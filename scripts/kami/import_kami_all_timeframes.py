"""
Unified Kami Ely Ingestion Engine: Merging Both Timeframes into MySQL (pplo)

Sources merged:
  - Timeframe 1 (Old): data/kami/*.xlsx (March 2026 to Sept 2026)
  - Timeframe 2 (New): public/kami/*.xlsx (April 2026 to Oct 2026)

Rules enforced:
  1. Exclude all columns containing URLs, hyperlinks, and images.
  2. Map bilingual headers (English in old, Vietnamese in new) to canonical SQL columns.
  3. Continuous timeline unification for store daily telemetry:
     Merges 180 days (old) and 180 days (new) into 226 continuous days (2026-03-09 to 2026-10-20)
     with seamless cumulative and delta tracking.
  4. Deduplicate across both timeframes using primary business keys and SHA-256 row hashes.
  5. Apply INSERT INTO ... ON DUPLICATE KEY UPDATE for idempotent, duplicate-safe updates.
"""
from __future__ import annotations

import hashlib
import os
import re
import sys
from typing import Any, Dict, List

import mysql.connector
import numpy as np
import pandas as pd

sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OLD_DIR = os.path.join(ROOT_DIR, "data", "kami")
NEW_DIR = os.path.join(ROOT_DIR, "public", "kami")
ENV_FILE = os.path.join(ROOT_DIR, ".env")

URL_PATTERN = re.compile(r"^(https?://|www\.|//)", re.IGNORECASE)


def load_env() -> Dict[str, str]:
    env = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip("'\"")
                    env[k] = v
    return env


def is_url_column(series: pd.Series, col_name: str) -> bool:
    name_low = str(col_name).lower()
    link_keywords = ["link", "liên kết", "url", "bìa", "ảnh", "picture", "image", "avatar"]
    if any(kw in name_low for kw in link_keywords):
        if "ảnh hưởng" in name_low:
            return False
        return True

    non_null = series.dropna().astype(str).str.strip()
    if len(non_null) == 0:
        return False
    matches = non_null.apply(lambda x: bool(URL_PATTERN.match(x))).sum()
    return (matches / len(non_null)) >= 0.5


def drop_url_cols(df: pd.DataFrame) -> pd.DataFrame:
    cols_to_drop = [c for c in df.columns if is_url_column(df[c], c)]
    return df.drop(columns=cols_to_drop)


def clean_num(val: Any) -> float:
    if val is None or (isinstance(val, float) and np.isnan(val)):
        return 0.0
    if isinstance(val, (int, float, np.integer, np.floating)):
        return float(val)
    s = str(val).replace("₫", "").replace("VNĐ", "").replace("%", "").strip()
    if not s or s == "-":
        return 0.0
    mult = 1.0
    low = s.lower()
    if low.endswith("tr"):
        mult = 1_000_000.0
        s = s[:-2].strip()
    elif low.endswith("k"):
        mult = 1_000.0
        s = s[:-1].strip()
    elif low.endswith("m"):
        mult = 1_000_000.0
        s = s[:-1].strip()
    elif low.endswith("b"):
        mult = 1_000_000_000.0
        s = s[:-1].strip()

    s = s.replace(".", "").replace(",", ".")
    try:
        return float(s) * mult
    except ValueError:
        return 0.0


def clean_int(val: Any) -> int:
    return int(round(clean_num(val)))


def make_row_hash(*args: Any) -> str:
    payload = "|".join(str(a if a is not None else "").strip() for a in args)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def find_files(dir_path: str, keyword: str) -> List[str]:
    if not os.path.exists(dir_path):
        return []
    return [
        os.path.join(dir_path, f)
        for f in os.listdir(dir_path)
        if keyword.lower() in f.lower() and f.endswith(".xlsx") and not f.startswith("~$")
    ]


def get_db_connection() -> mysql.connector.MySQLConnection:
    env = load_env()
    conn = mysql.connector.connect(
        host=env.get("MYSQL_HOST", "127.0.0.1"),
        port=int(env.get("MYSQL_PORT", 3306)),
        user=env.get("MYSQL_USER", "root"),
        password=env.get("MYSQL_PASSWORD", ""),
        database=env.get("MYSQL_DATABASE", "pplo"),
        charset="utf8mb4",
        collation="utf8mb4_unicode_ci",
    )
    return conn


# ==============================================================================
# TABLE 1: kami_store_daily_overview (Merged 226 Continuous Days)
# ==============================================================================
def merge_and_sync_store_daily(conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Merging Table 1: kami_store_daily_overview (226 continuous days) ---")
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS kami_store_daily_overview (
            record_date DATE NOT NULL PRIMARY KEY,
            sales_units INT NOT NULL DEFAULT 0,
            delta_sales_units INT NOT NULL DEFAULT 0,
            gmv_vnd DECIMAL(15,2) NOT NULL DEFAULT 0.00,
            delta_gmv_vnd DECIMAL(15,2) NOT NULL DEFAULT 0.00,
            influencers_count INT NOT NULL DEFAULT 0,
            delta_influencers_count INT NOT NULL DEFAULT 0,
            videos_count INT NOT NULL DEFAULT 0,
            delta_videos_count INT NOT NULL DEFAULT 0,
            livestreams_count INT NOT NULL DEFAULT 0,
            delta_livestreams_count INT NOT NULL DEFAULT 0,
            row_hash CHAR(64) NOT NULL UNIQUE,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    )

    f_old = find_files(OLD_DIR, "Store Detail Page_Data Overview")[0]
    f_new = find_files(NEW_DIR, "Tổng Quan Dữ Liệu")[0]

    df_old = pd.read_excel(f_old)
    df_new = pd.read_excel(f_new)

    # Dictionary keyed by date
    daily_dict: Dict[str, Dict[str, Any]] = {}

    # 1. Fill newer 180 days (2026-04-24 to 2026-10-20)
    for _, r in df_new.iterrows():
        d = str(r["Ngày"]).strip()
        daily_dict[d] = {
            "sales_units": clean_int(r["Khối Lượng Bán Hàng"]),
            "delta_sales_units": clean_int(r["Tăng Lượng Khối Lượng Bán Hàng"]),
            "gmv_vnd": clean_num(r["Tổng Giá Trị Bán Hàng"]),
            "delta_gmv_vnd": clean_num(r["Tăng Lượng Tổng Giá Trị Bán Hàng"]),
            "influencers_count": clean_int(r["Số Lượng Người Ảnh Hưởng Đưa Hàng"]),
            "delta_influencers_count": clean_int(r["Tăng Lượng Số Lượng Người Ảnh Hưởng Đưa Hàng"]),
            "videos_count": clean_int(r["Số Lượng Video Đưa Hàng"]),
            "delta_videos_count": clean_int(r["Tăng Lượng Số Lượng Video Đưa Hàng"]),
            "livestreams_count": clean_int(r["Số Lượng Livestream Đưa Hàng"]),
            "delta_livestreams_count": clean_int(r["Tăng Lượng Số Lượng Livestream Đưa Hàng"]),
        }

    # 2. Backpropagate cumulative metrics for earlier 46 days (2026-03-09 to 2026-04-23)
    # At boundary 2026-04-24:
    cum_sales = daily_dict["2026-04-24"]["sales_units"] - daily_dict["2026-04-24"]["delta_sales_units"]
    cum_gmv = daily_dict["2026-04-24"]["gmv_vnd"] - daily_dict["2026-04-24"]["delta_gmv_vnd"]
    cum_inf = daily_dict["2026-04-24"]["influencers_count"] - daily_dict["2026-04-24"]["delta_influencers_count"]
    cum_vid = daily_dict["2026-04-24"]["videos_count"] - daily_dict["2026-04-24"]["delta_videos_count"]
    cum_live = daily_dict["2026-04-24"]["livestreams_count"] - daily_dict["2026-04-24"]["delta_livestreams_count"]

    old_prior = df_old[df_old.iloc[:, 0].astype(str) < "2026-04-24"].sort_values(
        by=df_old.columns[0], ascending=False
    )
    for _, r in old_prior.iterrows():
        d = str(r.iloc[0]).strip()
        d_sales = clean_int(r.iloc[1])
        d_gmv = clean_num(r.iloc[2])
        d_inf = clean_int(r.iloc[3])
        d_vid = clean_int(r.iloc[4])
        d_live = clean_int(r.iloc[5])

        daily_dict[d] = {
            "sales_units": cum_sales,
            "delta_sales_units": d_sales,
            "gmv_vnd": cum_gmv,
            "delta_gmv_vnd": d_gmv,
            "influencers_count": cum_inf,
            "delta_influencers_count": d_inf,
            "videos_count": cum_vid,
            "delta_videos_count": d_vid,
            "livestreams_count": cum_live,
            "delta_livestreams_count": d_live,
        }
        cum_sales -= d_sales
        cum_gmv -= d_gmv
        cum_inf -= d_inf
        cum_vid -= d_vid
        cum_live -= d_live

    sql = """
        INSERT INTO kami_store_daily_overview (
            record_date, sales_units, delta_sales_units, gmv_vnd, delta_gmv_vnd,
            influencers_count, delta_influencers_count, videos_count, delta_videos_count,
            livestreams_count, delta_livestreams_count, row_hash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            sales_units = VALUES(sales_units),
            delta_sales_units = VALUES(delta_sales_units),
            gmv_vnd = VALUES(gmv_vnd),
            delta_gmv_vnd = VALUES(delta_gmv_vnd),
            influencers_count = VALUES(influencers_count),
            delta_influencers_count = VALUES(delta_influencers_count),
            videos_count = VALUES(videos_count),
            delta_videos_count = VALUES(delta_videos_count),
            livestreams_count = VALUES(livestreams_count),
            delta_livestreams_count = VALUES(delta_livestreams_count),
            row_hash = VALUES(row_hash);
    """

    records = []
    for d in sorted(daily_dict.keys()):
        item = daily_dict[d]
        r_hash = make_row_hash(
            d,
            item["sales_units"],
            item["gmv_vnd"],
            item["influencers_count"],
            item["videos_count"],
            item["livestreams_count"],
        )
        records.append(
            (
                d,
                item["sales_units"],
                item["delta_sales_units"],
                item["gmv_vnd"],
                item["delta_gmv_vnd"],
                item["influencers_count"],
                item["delta_influencers_count"],
                item["videos_count"],
                item["delta_videos_count"],
                item["livestreams_count"],
                item["delta_livestreams_count"],
                r_hash,
            )
        )

    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_store_daily_overview",
        "old_days": len(df_old),
        "new_days": len(df_new),
        "merged_continuous_days": len(records),
        "date_range": f"{records[0][0]} -> {records[-1][0]}",
    }


# ==============================================================================
# TABLE 2: kami_creator_livestreams (Merged Unique Sessions)
# ==============================================================================
def merge_and_sync_creator_livestreams(conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Merging Table 3: kami_creator_livestreams ---")
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS kami_creator_livestreams (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(500) NOT NULL,
            start_time VARCHAR(50) NOT NULL,
            duration_hours DECIMAL(10,4) DEFAULT 0.0000,
            main_category VARCHAR(255) DEFAULT '',
            total_viewers INT DEFAULT 0,
            product_count INT DEFAULT 0,
            products_sold_count INT DEFAULT 0,
            sales_units INT DEFAULT 0,
            gmv_vnd DECIMAL(15,2) DEFAULT 0.00,
            uv_value DECIMAL(12,2) DEFAULT 0.00,
            row_hash CHAR(64) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY uk_session_start (start_time),
            INDEX idx_title (title(255))
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    )

    f_old = find_files(OLD_DIR, "Creator's Live Streaming")
    f_new = find_files(NEW_DIR, "livestream bán hàng")

    dfs_old = [drop_url_cols(pd.read_excel(f)) for f in f_old]
    dfs_new = [drop_url_cols(pd.read_excel(f)) for f in f_new]

    # Map old columns to canonical names
    mapped_rows = {}

    # Load old first
    for df in dfs_old:
        for _, r in df.iterrows():
            st_time = str(r["Start Time"]).strip()
            title = str(r["Live Streaming Title"]).strip()
            dur = clean_num(r["Live Streaming Duration"])
            cat = str(r.get("Live Streaming Category", "")).strip()
            viewers = clean_int(r.get("Total Viewers", 0))
            prods = clean_int(r.get("Promoted Products", 0))
            sold = clean_int(r.get("No.of Products Sold", 0))
            units = clean_int(r.get("LIVE Units Sold", 0))
            gmv = clean_num(r.get("Live GMV", 0))
            uv = clean_num(r.get("UV Value", 0))
            r_hash = make_row_hash(st_time, title, viewers, units, gmv)
            mapped_rows[st_time] = (title, st_time, dur, cat, viewers, prods, sold, units, gmv, uv, r_hash)

    # Load new (overwrites/updates overlap with newer data)
    for df in dfs_new:
        for _, r in df.iterrows():
            st_time = str(r["Thời gian bắt đầu Livestream"]).strip()
            title = str(r["Tiêu đề Livestream"]).strip()
            dur = clean_num(r["Thời lượng Livestream"])
            cat = str(r.get("Danh mục chính", "")).strip()
            viewers = clean_int(r.get("Tổng số lượng người xem", 0))
            prods = clean_int(r.get("Số lượng sản phẩm", 0))
            sold = clean_int(r.get("Số sản phẩm được bán ra", 0))
            units = clean_int(r.get("Số lượng bán hàng trong Livestream", 0))
            gmv = clean_num(r.get("Doanh số Livestream", 0))
            uv = clean_num(r.get("Giá trị UV", 0))
            r_hash = make_row_hash(st_time, title, viewers, units, gmv)
            mapped_rows[st_time] = (title, st_time, dur, cat, viewers, prods, sold, units, gmv, uv, r_hash)

    sql = """
        INSERT INTO kami_creator_livestreams (
            title, start_time, duration_hours, main_category, total_viewers,
            product_count, products_sold_count, sales_units, gmv_vnd, uv_value, row_hash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            duration_hours = VALUES(duration_hours),
            main_category = VALUES(main_category),
            total_viewers = VALUES(total_viewers),
            product_count = VALUES(product_count),
            products_sold_count = VALUES(products_sold_count),
            sales_units = VALUES(sales_units),
            gmv_vnd = VALUES(gmv_vnd),
            uv_value = VALUES(uv_value),
            row_hash = VALUES(row_hash);
    """

    records = list(mapped_rows.values())
    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_creator_livestreams",
        "old_sessions": sum(len(d) for d in dfs_old),
        "new_sessions": sum(len(d) for d in dfs_new),
        "merged_unique_sessions": len(records),
    }


# ==============================================================================
# TABLE 3: kami_creator_videos (Merged Unique Videos)
# ==============================================================================
def merge_and_sync_creator_videos(conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Merging Table 5: kami_creator_videos ---")
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS kami_creator_videos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title TEXT,
            publish_time VARCHAR(50) NOT NULL,
            duration VARCHAR(50) DEFAULT '',
            video_type VARCHAR(100) DEFAULT '',
            sales_units INT DEFAULT 0,
            gmv_vnd DECIMAL(15,2) DEFAULT 0.00,
            views BIGINT DEFAULT 0,
            likes INT DEFAULT 0,
            interaction_rate VARCHAR(50) DEFAULT '',
            row_hash CHAR(64) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY uk_publish_time (publish_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    )

    f_old = find_files(OLD_DIR, "Creator's Video List")
    f_new = find_files(NEW_DIR, "Danh sách video")

    dfs_old = [drop_url_cols(pd.read_excel(f)) for f in f_old]
    dfs_new = [drop_url_cols(pd.read_excel(f)) for f in f_new]

    mapped_rows = {}

    for df in dfs_old:
        for _, r in df.iterrows():
            pub_time = str(r["Publish Date"]).strip()
            title = str(r["Video Title"]).strip()
            dur = str(r.get("Video Duration", "")).strip()
            v_type = str(r.get("Video Type", "")).strip()
            units = clean_int(r.get("Units Sold", 0))
            gmv = clean_num(r.get("Video GMV", 0))
            views = clean_int(r.get("Views", 0))
            likes = clean_int(r.get("Likes", 0))
            rate = str(r.get("Interaction Rate", "")).strip()
            r_hash = make_row_hash(pub_time, title, views, units, gmv)
            mapped_rows[pub_time] = (title, pub_time, dur, v_type, units, gmv, views, likes, rate, r_hash)

    for df in dfs_new:
        for _, r in df.iterrows():
            pub_time = str(r["Thời gian phát hành"]).strip()
            title = str(r["Tiêu đề video"]).strip()
            dur = str(r.get("Thời lượng video", "")).strip()
            v_type = str(r.get("Loại video", "")).strip()
            units = clean_int(r.get("Số lượng bán hàng của video", 0))
            gmv = clean_num(r.get("Doanh số bán hàng của video", 0))
            views = clean_int(r.get("Số lượt xem", 0))
            likes = clean_int(r.get("Số lượng likes", 0))
            rate = str(r.get("Tỷ lệ tương tác", "")).strip()
            r_hash = make_row_hash(pub_time, title, views, units, gmv)
            mapped_rows[pub_time] = (title, pub_time, dur, v_type, units, gmv, views, likes, rate, r_hash)

    sql = """
        INSERT INTO kami_creator_videos (
            title, publish_time, duration, video_type, sales_units,
            gmv_vnd, views, likes, interaction_rate, row_hash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            duration = VALUES(duration),
            video_type = VALUES(video_type),
            sales_units = VALUES(sales_units),
            gmv_vnd = VALUES(gmv_vnd),
            views = VALUES(views),
            likes = VALUES(likes),
            interaction_rate = VALUES(interaction_rate),
            row_hash = VALUES(row_hash);
    """

    records = list(mapped_rows.values())
    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_creator_videos",
        "old_videos": sum(len(d) for d in dfs_old),
        "new_videos": sum(len(d) for d in dfs_new),
        "merged_unique_videos": len(records),
    }


# ==============================================================================
# TABLE 4: kami_creator_products (Merged Goods for Sale)
# ==============================================================================
def merge_and_sync_creator_products(conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Merging Table 4: kami_creator_products ---")
    cur = conn.cursor()
    cur.execute("DROP TABLE IF EXISTS kami_creator_products;")
    cur.execute(
        """
        CREATE TABLE kami_creator_products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_name VARCHAR(500) NOT NULL,
            shop_name VARCHAR(255) DEFAULT '',
            snapshot_period VARCHAR(50) NOT NULL,
            snapshot_date DATE NOT NULL,
            region VARCHAR(100) DEFAULT '',
            category VARCHAR(255) DEFAULT '',
            price_raw VARCHAR(100) DEFAULT '',
            units_sold_raw VARCHAR(50) DEFAULT '',
            revenue_raw VARCHAR(100) DEFAULT '',
            upload_time VARCHAR(50) DEFAULT '',
            commission_rate VARCHAR(50) DEFAULT '',
            shop_total_sales_raw VARCHAR(100) DEFAULT '',
            row_hash CHAR(64) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_product_name (product_name(255)),
            INDEX idx_shop_name (shop_name),
            INDEX idx_snapshot_period (snapshot_period),
            UNIQUE KEY uk_prod_shop_period (product_name(255), shop_name, snapshot_period)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    )

    f_old = find_files(OLD_DIR, "Creator's Goods for Sale")
    f_new = find_files(NEW_DIR, "Danh sách sản phẩm bán hàng")

    dfs_old = [drop_url_cols(pd.read_excel(f)) for f in f_old]
    dfs_new = [drop_url_cols(pd.read_excel(f)) for f in f_new]

    mapped_rows = {}

    # Snapshot 1: Kỳ Hè (2026-09)
    for df in dfs_old:
        for _, r in df.iterrows():
            pname = str(r["Product Name"]).strip()
            shop = str(r.get("Owned Store Name", "")).strip()
            reg = str(r.get("Country/Region", "")).strip()
            cat = str(r.get("Product Category", "")).strip()
            price = str(r.get("Price", "")).strip()
            sold = str(r.get("Units Sold", "")).strip()
            rev = str(r.get("Total GMV", "")).strip()
            upload = str(r.get("Launch Date", "")).strip()
            comm = str(r.get("Commission Rate", "")).strip()
            shop_tot = str(r.get("Total Sales Volume of the Store It Belongs To", "")).strip()
            period = "2026-09 (Kỳ Hè)"
            snap_date = "2026-09-04"
            k = (pname.lower(), shop.lower(), period)
            r_hash = make_row_hash(pname, shop, period)
            mapped_rows[k] = (
                pname, shop, period, snap_date, reg, cat, price, sold, rev, upload, comm, shop_tot, r_hash
            )

    # Snapshot 2: Kỳ Thu (2026-10)
    for df in dfs_new:
        for _, r in df.iterrows():
            pname = str(r["Tên sản phẩm"]).strip()
            shop = str(r.get("Tên cửa hàng", "")).strip()
            reg = str(r.get("Quốc gia/Địa phương", "")).strip()
            cat = str(r.get("Phân loại sản phẩm", "")).strip()
            price = str(r.get("Giá sản phẩm", "")).strip()
            sold = str(r.get("Đã bán", "")).strip()
            rev = str(r.get("Doanh số", "")).strip()
            upload = str(r.get("Thời gian đăng lên", "")).strip()
            comm = str(r.get("Tỷ lệ hoa hồng", "")).strip()
            shop_tot = str(r.get("Tổng số lượng bán hàng của cửa hàng thuộc về", "")).strip()
            period = "2026-10 (Kỳ Thu)"
            snap_date = "2026-10-20"
            k = (pname.lower(), shop.lower(), period)
            r_hash = make_row_hash(pname, shop, period)
            mapped_rows[k] = (
                pname, shop, period, snap_date, reg, cat, price, sold, rev, upload, comm, shop_tot, r_hash
            )

    sql = """
        INSERT INTO kami_creator_products (
            product_name, shop_name, snapshot_period, snapshot_date,
            region, category, price_raw, units_sold_raw,
            revenue_raw, upload_time, commission_rate,
            shop_total_sales_raw, row_hash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            snapshot_date = VALUES(snapshot_date),
            region = VALUES(region),
            category = VALUES(category),
            price_raw = VALUES(price_raw),
            units_sold_raw = VALUES(units_sold_raw),
            revenue_raw = VALUES(revenue_raw),
            upload_time = VALUES(upload_time),
            commission_rate = VALUES(commission_rate),
            shop_total_sales_raw = VALUES(shop_total_sales_raw);
    """

    records = list(mapped_rows.values())
    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_creator_products",
        "snapshot_summer_rows": sum(1 for r in records if "2026-09" in r[2]),
        "snapshot_autumn_rows": sum(1 for r in records if "2026-10" in r[2]),
        "total_snapshot_records": len(records),
        "unique_product_store_pairs": len(set((r[0].lower(), r[1].lower()) for r in records)),
    }


# ==============================================================================
# TABLE 5: kami_shop_products (Merged Store Catalog)
# ==============================================================================
def merge_and_sync_shop_products(conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Merging Table 7: kami_shop_products ---")
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS kami_shop_products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_title VARCHAR(500) NOT NULL,
            region VARCHAR(50) DEFAULT '',
            price_raw VARCHAR(100) DEFAULT '',
            category VARCHAR(255) DEFAULT '',
            launch_time VARCHAR(50) NOT NULL,
            commission_rate VARCHAR(50) DEFAULT '',
            recent_sales_units INT DEFAULT 0,
            recent_revenue_vnd DECIMAL(15,2) DEFAULT 0.00,
            row_hash CHAR(64) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY uk_title_launch (product_title(255), launch_time),
            INDEX idx_launch_time (launch_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    )

    f_old = find_files(OLD_DIR, "product data")
    f_new = find_files(NEW_DIR, "Dữ liệu sản phẩm của cửa hàng")

    dfs_old = [drop_url_cols(pd.read_excel(f)) for f in f_old]
    dfs_new = [drop_url_cols(pd.read_excel(f)) for f in f_new]

    mapped_rows = {}

    for df in dfs_old:
        for _, r in df.iterrows():
            title = str(r["Product name"]).strip()
            reg = str(r.get("Country", "")).strip()
            price = str(r.get("Price", "")).strip()
            cat = str(r.get("Category", "")).strip()
            launch = str(r.get("Estimated launch date", "")).strip()
            comm = str(r.get("Commission rate", "")).strip()
            sales = clean_int(r.get("Units sold (90 day)", 0))
            rev = clean_num(r.get("GMV (- 90 day)", 0))
            k = f"{title}|{launch}"
            r_hash = make_row_hash(title, launch, price, sales, rev)
            mapped_rows[k] = (title, reg, price, cat, launch, comm, sales, rev, r_hash)

    for df in dfs_new:
        for _, r in df.iterrows():
            title = str(r["Tiêu đề sản phẩm"]).strip()
            reg = str(r.get("Quốc gia", "")).strip()
            price = str(r.get("Giá bán", "")).strip()
            cat = str(r.get("Phân loại sản phẩm", "")).strip()
            launch = str(r.get("Thời gian mở bán", "")).strip()
            comm = str(r.get("Tỷ lệ hoa hồng", "")).strip()
            sales = clean_int(r.get("[ ngày gần đây] lượt bán", 0))
            rev = clean_num(r.get("[ ngày gần đây] Doanh thu", 0))
            k = f"{title}|{launch}"
            r_hash = make_row_hash(title, launch, price, sales, rev)
            mapped_rows[k] = (title, reg, price, cat, launch, comm, sales, rev, r_hash)

    sql = """
        INSERT INTO kami_shop_products (
            product_title, region, price_raw, category, launch_time,
            commission_rate, recent_sales_units, recent_revenue_vnd, row_hash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            region = VALUES(region),
            price_raw = VALUES(price_raw),
            category = VALUES(category),
            commission_rate = VALUES(commission_rate),
            recent_sales_units = VALUES(recent_sales_units),
            recent_revenue_vnd = VALUES(recent_revenue_vnd),
            row_hash = VALUES(row_hash);
    """

    records = list(mapped_rows.values())
    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_shop_products",
        "old_products": sum(len(d) for d in dfs_old),
        "new_products": sum(len(d) for d in dfs_new),
        "merged_unique_products": len(records),
    }


# ==============================================================================
# TABLE 6: kami_affiliate_kol (Merged KOC Network)
# ==============================================================================
def merge_and_sync_affiliate_kol(conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Merging Table 8: kami_affiliate_kol ---")
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS kami_affiliate_kol (
            id INT AUTO_INCREMENT PRIMARY KEY,
            koc_name VARCHAR(255) DEFAULT '',
            koc_id VARCHAR(100) NOT NULL UNIQUE,
            category VARCHAR(255) DEFAULT '',
            region VARCHAR(50) DEFAULT '',
            fans_count BIGINT DEFAULT 0,
            affiliate_sales_units INT DEFAULT 0,
            affiliate_gmv_vnd DECIMAL(15,2) DEFAULT 0.00,
            live_gpm VARCHAR(100) DEFAULT '',
            video_gpm VARCHAR(100) DEFAULT '',
            products_in_store INT DEFAULT 0,
            row_hash CHAR(64) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_koc_id (koc_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    )

    f_old = find_files(OLD_DIR, "Creators_merged")
    f_new = find_files(NEW_DIR, "KOL LKTT")

    dfs_old = [drop_url_cols(pd.read_excel(f)) for f in f_old]
    dfs_new = [drop_url_cols(pd.read_excel(f)) for f in f_new]

    mapped_rows = {}

    for df in dfs_old:
        for _, r in df.iterrows():
            koc_id = str(r["Creator id"]).strip()
            if not koc_id or koc_id.lower() == "nan":
                continue
            koc_name = str(r.get("Creator name", "")).strip()
            cat = str(r.get("Creator type", "")).strip()
            reg = str(r.get("Country", "")).strip()
            fans = clean_int(r.get("Followers", 0))
            sales = clean_int(r.get("[90 day] Units sold", 0))
            gmv = clean_num(r.get("[90 day] GMV", 0))
            live_gpm = str(r.get("LIVE GPM", "")).strip()
            video_gpm = str(r.get("Video GPM", "")).strip()
            prods = clean_int(r.get("Num. of products", 0))
            r_hash = make_row_hash(koc_id, koc_name, fans, sales, gmv)
            mapped_rows[koc_id] = (koc_name, koc_id, cat, reg, fans, sales, gmv, live_gpm, video_gpm, prods, r_hash)

    for df in dfs_new:
        for _, r in df.iterrows():
            koc_id = str(r.get("ID KOC/KOL", "")).strip()
            if not koc_id or koc_id.lower() == "nan":
                continue
            koc_name = str(r.get("Tên KOC/KOL", "")).strip()
            cat = str(r.get("Phân loại KOC/KOL", "")).strip()
            reg = str(r.get("Quốc gia", "")).strip()
            fans = clean_int(r.get("Số Fans", 0))
            sales = clean_int(r.get("[] lượt bán qua LKTT", 0))
            gmv = clean_num(r.get("[] Doanh số LKTT", 0))
            live_gpm = str(r.get("GPM Livestream", "")).strip()
            video_gpm = str(r.get("GPM Video", "")).strip()
            prods = clean_int(r.get("Số lượng sản phẩm trong cửa hàng này", 0))
            r_hash = make_row_hash(koc_id, koc_name, fans, sales, gmv)
            mapped_rows[koc_id] = (koc_name, koc_id, cat, reg, fans, sales, gmv, live_gpm, video_gpm, prods, r_hash)

    sql = """
        INSERT INTO kami_affiliate_kol (
            koc_name, koc_id, category, region, fans_count,
            affiliate_sales_units, affiliate_gmv_vnd, live_gpm,
            video_gpm, products_in_store, row_hash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            koc_name = VALUES(koc_name),
            category = VALUES(category),
            region = VALUES(region),
            fans_count = VALUES(fans_count),
            affiliate_sales_units = VALUES(affiliate_sales_units),
            affiliate_gmv_vnd = VALUES(affiliate_gmv_vnd),
            live_gpm = VALUES(live_gpm),
            video_gpm = VALUES(video_gpm),
            products_in_store = VALUES(products_in_store),
            row_hash = VALUES(row_hash);
    """

    records = list(mapped_rows.values())
    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_affiliate_kol",
        "old_kocs": sum(len(d) for d in dfs_old),
        "new_kocs": sum(len(d) for d in dfs_new),
        "merged_unique_kocs": len(records),
    }


# ==============================================================================
# TABLE 7: kami_affiliate_videos (Merged Shoppable Videos)
# ==============================================================================
def merge_and_sync_affiliate_videos(conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Merging Table 6: kami_affiliate_videos ---")
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS kami_affiliate_videos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title TEXT,
            duration VARCHAR(50) DEFAULT '',
            is_ads_eligible VARCHAR(50) DEFAULT '',
            koc_name VARCHAR(255) DEFAULT '',
            koc_id VARCHAR(100) NOT NULL,
            fans_count BIGINT DEFAULT 0,
            region VARCHAR(50) DEFAULT '',
            category VARCHAR(255) DEFAULT '',
            publish_time VARCHAR(50) NOT NULL,
            views VARCHAR(50) DEFAULT '0',
            recent_likes VARCHAR(50) DEFAULT '0',
            recent_store_sales_units INT DEFAULT 0,
            recent_store_gmv_vnd DECIMAL(15,2) DEFAULT 0.00,
            store_product_count INT DEFAULT 0,
            row_hash CHAR(64) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_koc_id (koc_id),
            INDEX idx_publish_time (publish_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    )

    f_old = find_files(OLD_DIR, "Shoppable_Videos")
    f_new = find_files(NEW_DIR, "Video LKTT")

    dfs_old = [drop_url_cols(pd.read_excel(f)) for f in f_old]
    dfs_new = [drop_url_cols(pd.read_excel(f)) for f in f_new]

    mapped_rows = {}

    for df in dfs_old:
        for _, r in df.iterrows():
            koc_id = str(r["creator ID"]).strip()
            pub_time = str(r["Published date"]).strip()
            title = str(r["video title"]).strip()
            dur = str(r.get("video duration", "")).strip()
            ads = str(r.get("ads", "")).strip()
            koc_name = str(r.get("creator nickname", "")).strip()
            fans = clean_int(r.get("followers", 0))
            reg = str(r.get("country", "")).strip()
            cat = str(r.get("creator category", "")).strip()
            views = str(r.get("Views", "0")).strip()
            likes = str(r.get("[ 90 days]Likes", "0")).strip()
            store_sales = clean_int(r.get("[ 90 days]Units sold", 0))
            store_gmv = clean_num(r.get("[90 days]GMV", 0))
            store_prods = clean_int(r.get("Number of products", 0))
            k = f"{koc_id}|{pub_time}|{title[:80]}"
            r_hash = make_row_hash(koc_id, pub_time, title, views, store_sales, store_gmv)
            mapped_rows[k] = (
                title, dur, ads, koc_name, koc_id, fans, reg, cat, pub_time,
                views, likes, store_sales, store_gmv, store_prods, r_hash
            )

    for df in dfs_new:
        for _, r in df.iterrows():
            koc_id = str(r.get("ID KOC/KOL", "")).strip()
            pub_time = str(r.get("Thời gian đăng", "")).strip()
            title = str(r.get("Tiêu đề Video", "")).strip()
            dur = str(r.get("Thời lượng Video", "")).strip()
            ads = str(r.get("Có thể chạy Ads không", "")).strip()
            koc_name = str(r.get("Tên KOC/KOL", "")).strip()
            fans = clean_int(r.get("Số Fans", 0))
            reg = str(r.get("Quốc Gia", "")).strip()
            cat = str(r.get("Phân loại KOC/KOL", "")).strip()
            views = str(r.get("Lượt xem", "0")).strip()
            likes = str(r.get("[ ngày gần đây]Lượt thích", "0")).strip()
            store_sales = clean_int(r.get("[ ngày gần đây]lượt bán sản phẩm của cửa hàng", 0))
            store_gmv = clean_num(r.get("[ ngày gần đây]Doanh thu sản phẩm của cửa hàng", 0))
            store_prods = clean_int(r.get("Số lượng sản phẩm của cửa hàng", 0))
            k = f"{koc_id}|{pub_time}|{title[:80]}"
            r_hash = make_row_hash(koc_id, pub_time, title, views, store_sales, store_gmv)
            mapped_rows[k] = (
                title, dur, ads, koc_name, koc_id, fans, reg, cat, pub_time,
                views, likes, store_sales, store_gmv, store_prods, r_hash
            )

    sql = """
        INSERT INTO kami_affiliate_videos (
            title, duration, is_ads_eligible, koc_name, koc_id, fans_count,
            region, category, publish_time, views, recent_likes,
            recent_store_sales_units, recent_store_gmv_vnd, store_product_count, row_hash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            duration = VALUES(duration),
            is_ads_eligible = VALUES(is_ads_eligible),
            koc_name = VALUES(koc_name),
            fans_count = VALUES(fans_count),
            region = VALUES(region),
            category = VALUES(category),
            views = VALUES(views),
            recent_likes = VALUES(recent_likes),
            recent_store_sales_units = VALUES(recent_store_sales_units),
            recent_store_gmv_vnd = VALUES(recent_store_gmv_vnd),
            store_product_count = VALUES(store_product_count);
    """

    records = list(mapped_rows.values())
    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_affiliate_videos",
        "old_videos": sum(len(d) for d in dfs_old),
        "new_videos": sum(len(d) for d in dfs_new),
        "merged_unique_videos": len(records),
    }


# ==============================================================================
# TABLE 8: kami_affiliate_livestreams (Merged Shop LIVE Sessions)
# ==============================================================================
def merge_and_sync_affiliate_livestreams(conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Merging Table 9: kami_affiliate_livestreams ---")
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS kami_affiliate_livestreams (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(500) DEFAULT '',
            duration_hours DECIMAL(10,4) DEFAULT 0.0000,
            live_type VARCHAR(100) DEFAULT '',
            main_category VARCHAR(255) DEFAULT '',
            koc_name VARCHAR(255) DEFAULT '',
            koc_id VARCHAR(100) NOT NULL,
            fans_count BIGINT DEFAULT 0,
            region VARCHAR(50) DEFAULT '',
            koc_category VARCHAR(255) DEFAULT '',
            session_time VARCHAR(50) NOT NULL,
            total_views BIGINT DEFAULT 0,
            store_sales_units INT DEFAULT 0,
            store_gmv_vnd DECIMAL(15,2) DEFAULT 0.00,
            store_product_count INT DEFAULT 0,
            row_hash CHAR(64) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_koc_session (koc_id, session_time),
            INDEX idx_session_time (session_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    )

    f_old = find_files(OLD_DIR, "shop LIVE")
    f_new = find_files(NEW_DIR, "Livestream LKTT")

    dfs_old = [drop_url_cols(pd.read_excel(f)) for f in f_old]
    dfs_new = [drop_url_cols(pd.read_excel(f)) for f in f_new]

    mapped_rows = {}

    for df in dfs_old:
        for _, r in df.iterrows():
            koc_id = str(r["creator id"]).strip()
            sess_time = str(r["LIVE start time"]).strip()
            title = str(r.get("LIVE title", "")).strip()
            dur = clean_num(r.get("LIVE duration", 0))
            l_type = str(r.get("LIVE type", "")).strip()
            cat = str(r.get("Main category", "")).strip()
            koc_name = str(r.get("creator name", "")).strip()
            fans = clean_int(r.get("followers", 0))
            reg = str(r.get("country", "")).strip()
            koc_cat = str(r.get("creator type", "")).strip()
            views = clean_int(r.get("cumulative", 0))
            sales = clean_int(r.get("units sold", 0))
            gmv = clean_num(r.get("GMV", 0))
            prods = clean_int(r.get("num. of products", 0))
            k = f"{koc_id}|{sess_time}"
            r_hash = make_row_hash(koc_id, sess_time, title, views, sales, gmv)
            mapped_rows[k] = (
                title, dur, l_type, cat, koc_name, koc_id, fans, reg, koc_cat,
                sess_time, views, sales, gmv, prods, r_hash
            )

    for df in dfs_new:
        for _, r in df.iterrows():
            koc_id = str(r.get("ID KOC/KOL", "")).strip()
            sess_time = str(r.get("Thời gian Livestream", "")).strip()
            title = str(r.get("Tiêu đề Livestream", "")).strip()
            dur = clean_num(r.get("Thời lượng Livestream", 0))
            l_type = str(r.get("Loại Livestream", "")).strip()
            cat = str(r.get("Loại sản phẩm chính", "")).strip()
            koc_name = str(r.get("Tên KOC/KOL", "")).strip()
            fans = clean_int(r.get("Số Fans", 0))
            reg = str(r.get("Quốc Gia", "")).strip()
            koc_cat = str(r.get("Phân loại KOC/KOL", "")).strip()
            views = clean_int(r.get("Tổng lượt xem", 0))
            sales = clean_int(r.get("Lượt bán sản phẩm của cửa hàng", 0))
            gmv = clean_num(r.get("Doanh thu sản phẩm của cửa hàng", 0))
            prods = clean_int(r.get("Số lượng sản phẩm của cửa hàng", 0))
            k = f"{koc_id}|{sess_time}"
            r_hash = make_row_hash(koc_id, sess_time, title, views, sales, gmv)
            mapped_rows[k] = (
                title, dur, l_type, cat, koc_name, koc_id, fans, reg, koc_cat,
                sess_time, views, sales, gmv, prods, r_hash
            )

    sql = """
        INSERT INTO kami_affiliate_livestreams (
            title, duration_hours, live_type, main_category, koc_name,
            koc_id, fans_count, region, koc_category, session_time,
            total_views, store_sales_units, store_gmv_vnd, store_product_count, row_hash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            duration_hours = VALUES(duration_hours),
            live_type = VALUES(live_type),
            main_category = VALUES(main_category),
            koc_name = VALUES(koc_name),
            fans_count = VALUES(fans_count),
            region = VALUES(region),
            koc_category = VALUES(koc_category),
            total_views = VALUES(total_views),
            store_sales_units = VALUES(store_sales_units),
            store_gmv_vnd = VALUES(store_gmv_vnd),
            store_product_count = VALUES(store_product_count);
    """

    records = list(mapped_rows.values())
    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_affiliate_livestreams",
        "old_sessions": sum(len(d) for d in dfs_old),
        "new_sessions": sum(len(d) for d in dfs_new),
        "merged_unique_sessions": len(records),
    }


# ==============================================================================
# TABLE 9: kami_livestream_products (Live Product Breakdown)
# ==============================================================================
def merge_and_sync_livestream_products(conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Merging Table 2: kami_livestream_products ---")
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS kami_livestream_products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_name VARCHAR(500) NOT NULL,
            price_raw VARCHAR(100) DEFAULT '',
            region VARCHAR(50) DEFAULT '',
            category VARCHAR(255) DEFAULT '',
            shop_name VARCHAR(255) DEFAULT '',
            shop_total_units_sold INT DEFAULT 0,
            live_units_sold INT DEFAULT 0,
            live_revenue_vnd DECIMAL(15,2) DEFAULT 0.00,
            commission_rate VARCHAR(50) DEFAULT '',
            row_hash CHAR(64) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_product_name (product_name(255)),
            INDEX idx_shop_name (shop_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    )

    f_new = find_files(NEW_DIR, "Live_Stream_Details_Live_Product_List")
    dfs_new = [drop_url_cols(pd.read_excel(f)) for f in f_new]
    df_all = pd.concat(dfs_new, ignore_index=True).drop_duplicates()

    sql = """
        INSERT INTO kami_livestream_products (
            product_name, price_raw, region, category, shop_name,
            shop_total_units_sold, live_units_sold, live_revenue_vnd,
            commission_rate, row_hash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            price_raw = VALUES(price_raw),
            region = VALUES(region),
            category = VALUES(category),
            shop_name = VALUES(shop_name),
            shop_total_units_sold = VALUES(shop_total_units_sold),
            live_units_sold = VALUES(live_units_sold),
            live_revenue_vnd = VALUES(live_revenue_vnd),
            commission_rate = VALUES(commission_rate);
    """

    records = []
    for _, r in df_all.iterrows():
        pname = str(r.get("Product name", "")).strip()
        price = str(r.get("Price", "")).strip()
        reg = str(r.get("Region", "")).strip()
        cat = str(r.get("Product Category", "")).strip()
        shop = str(r.get("Shops", "")).strip()
        shop_units = clean_int(r.get("Shop Total Units Sold", 0))
        live_units = clean_int(r.get("LIVE Units Sold", 0))
        live_rev = clean_num(r.get("LIVE Revenue", 0))
        comm = str(r.get("Commission Rate", "")).strip()
        r_hash = make_row_hash(pname, price, reg, shop, live_units, live_rev)
        records.append((pname, price, reg, cat, shop, shop_units, live_units, live_rev, comm, r_hash))

    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_livestream_products",
        "raw_rows": sum(len(d) for d in dfs_new),
        "merged_unique_products": len(records),
    }


def main():
    print("=" * 80)
    print("STARTING COMPLETE TWO-TIMEFRAME MERGE INTO MYSQL (PPLO)")
    print(f"Directory 1 (Old Timeframe): {OLD_DIR}")
    print(f"Directory 2 (New Timeframe): {NEW_DIR}")
    print("=" * 80)

    conn = get_db_connection()
    print("Connected to MySQL database successfully.")

    r1 = merge_and_sync_store_daily(conn)
    r2 = merge_and_sync_creator_livestreams(conn)
    r3 = merge_and_sync_creator_videos(conn)
    r4 = merge_and_sync_creator_products(conn)
    r5 = merge_and_sync_shop_products(conn)
    r6 = merge_and_sync_affiliate_kol(conn)
    r7 = merge_and_sync_affiliate_videos(conn)
    r8 = merge_and_sync_affiliate_livestreams(conn)
    r9 = merge_and_sync_livestream_products(conn)

    cur = conn.cursor()
    print("\n" + "=" * 80)
    print("COMPLETE UNIFIED TIME-FRAME AUDIT SUMMARY (IN MYSQL)")
    print("=" * 80)

    tables = [
        ("kami_store_daily_overview", r1),
        ("kami_creator_livestreams", r2),
        ("kami_creator_videos", r3),
        ("kami_creator_products", r4),
        ("kami_shop_products", r5),
        ("kami_affiliate_kol", r6),
        ("kami_affiliate_videos", r7),
        ("kami_affiliate_livestreams", r8),
        ("kami_livestream_products", r9),
    ]

    total_rows = 0
    for tbl_name, info in tables:
        cur.execute(f"SELECT COUNT(*) FROM {tbl_name};")
        db_cnt = cur.fetchone()[0]
        total_rows += db_cnt
        print(f"\n[TABLE: {tbl_name}] -> Total active rows in MySQL: {db_cnt}")
        for k, v in info.items():
            if k != "table":
                print(f"   • {k}: {v}")

    print("\n" + "-" * 80)
    print(f"TOTAL UNIFIED RECORDS ACROSS ALL 9 TABLES: {total_rows:,.0f}")
    print("=" * 80)

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
