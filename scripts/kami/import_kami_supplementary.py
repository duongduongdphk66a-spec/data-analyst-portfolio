"""
Import and sync Kami Ely supplementary datasets from public/kami into MySQL database (pplo).

Rules enforced:
1. Exclude all columns whose data contains URLs/hyperlinks (images, TikTok links, FastMoss links).
2. Clean and deduplicate rows across batch export files.
3. Apply UNIQUE constraints and ON DUPLICATE KEY UPDATE so duplicate records are detected, updated, or skipped without redundancy.
4. Provide detailed logs of files processed, columns dropped, in-memory duplicates filtered, and database rows inserted/updated.
"""
from __future__ import annotations

import glob
import hashlib
import os
import re
import sys
from typing import Any, Dict, List, Tuple

import mysql.connector
import numpy as np
import pandas as pd

sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
KAMI_PUBLIC_DIR = os.path.join(ROOT_DIR, "public", "kami")
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
    # Explicit link keywords
    link_keywords = ["link", "liên kết", "url", "bìa", "ảnh", "picture", "image", "avatar"]
    # Check if keyword is in name but ensure not a false positive like 'người ảnh hưởng'
    if any(kw in name_low for kw in link_keywords):
        if "ảnh hưởng" in name_low:
            return False
        return True

    # Content-based check: >= 50% non-null values match URL pattern
    non_null = series.dropna().astype(str).str.strip()
    if len(non_null) == 0:
        return False
    matches = non_null.apply(lambda x: bool(URL_PATTERN.match(x))).sum()
    return (matches / len(non_null)) >= 0.5


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


def get_db_connection() -> mysql.connector.MySQLConnection:
    env = load_env()
    host = env.get("MYSQL_HOST", "127.0.0.1")
    port = int(env.get("MYSQL_PORT", 3306))
    user = env.get("MYSQL_USER", "root")
    password = env.get("MYSQL_PASSWORD", "")
    database = env.get("MYSQL_DATABASE", "pplo")

    conn = mysql.connector.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=database,
        charset="utf8mb4",
        collation="utf8mb4_unicode_ci",
    )
    return conn


def process_table_1_store_daily(files: List[str], conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Processing Table 1: kami_store_daily_overview ---")
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

    dfs = [pd.read_excel(f) for f in files]
    df = pd.concat(dfs, ignore_index=True).dropna(how="all")
    initial_rows = len(df)

    # Exclude link columns
    dropped_cols = [c for c in df.columns if is_url_column(df[c], c)]
    df = df.drop(columns=dropped_cols)

    # Deduplicate in memory
    dedup_df = df.drop_duplicates(subset=["Ngày"])
    in_memory_dups = initial_rows - len(dedup_df)

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
    for _, r in dedup_df.iterrows():
        rec_date = str(r["Ngày"]).strip()
        sales_units = clean_int(r.get("Khối Lượng Bán Hàng", 0))
        delta_sales = clean_int(r.get("Tăng Lượng Khối Lượng Bán Hàng", 0))
        gmv = clean_num(r.get("Tổng Giá Trị Bán Hàng", 0))
        delta_gmv = clean_num(r.get("Tăng Lượng Tổng Giá Trị Bán Hàng", 0))
        inf_cnt = clean_int(r.get("Số Lượng Người Ảnh Hưởng Đưa Hàng", 0))
        delta_inf = clean_int(r.get("Tăng Lượng Số Lượng Người Ảnh Hưởng Đưa Hàng", 0))
        vid_cnt = clean_int(r.get("Số Lượng Video Đưa Hàng", 0))
        delta_vid = clean_int(r.get("Tăng Lượng Số Lượng Video Đưa Hàng", 0))
        live_cnt = clean_int(r.get("Số Lượng Livestream Đưa Hàng", 0))
        delta_live = clean_int(r.get("Tăng Lượng Số Lượng Livestream Đưa Hàng", 0))
        r_hash = make_row_hash(rec_date, sales_units, gmv, inf_cnt, vid_cnt, live_cnt)

        records.append(
            (
                rec_date,
                sales_units,
                delta_sales,
                gmv,
                delta_gmv,
                inf_cnt,
                delta_inf,
                vid_cnt,
                delta_vid,
                live_cnt,
                delta_live,
                r_hash,
            )
        )

    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_store_daily_overview",
        "raw_rows": initial_rows,
        "dropped_link_columns": dropped_cols,
        "in_memory_dups": in_memory_dups,
        "inserted_or_updated": len(records),
    }


def process_table_2_livestream_products(files: List[str], conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Processing Table 2: kami_livestream_products ---")
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

    dfs = [pd.read_excel(f) for f in files]
    df = pd.concat(dfs, ignore_index=True).dropna(how="all")
    initial_rows = len(df)

    dropped_cols = [c for c in df.columns if is_url_column(df[c], c)]
    df = df.drop(columns=dropped_cols)

    dedup_df = df.drop_duplicates()
    in_memory_dups = initial_rows - len(dedup_df)

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
    for _, r in dedup_df.iterrows():
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
        "raw_rows": initial_rows,
        "dropped_link_columns": dropped_cols,
        "in_memory_dups": in_memory_dups,
        "inserted_or_updated": len(records),
    }


def process_table_3_creator_livestreams(files: List[str], conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Processing Table 3: kami_creator_livestreams ---")
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

    dfs = [pd.read_excel(f) for f in files]
    df = pd.concat(dfs, ignore_index=True).dropna(how="all")
    initial_rows = len(df)

    dropped_cols = [c for c in df.columns if is_url_column(df[c], c)]
    df = df.drop(columns=dropped_cols)

    dedup_df = df.drop_duplicates(subset=["Thời gian bắt đầu Livestream"])
    in_memory_dups = initial_rows - len(dedup_df)

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

    records = []
    for _, r in dedup_df.iterrows():
        title = str(r.get("Tiêu đề Livestream", "")).strip()
        st_time = str(r.get("Thời gian bắt đầu Livestream", "")).strip()
        dur = clean_num(r.get("Thời lượng Livestream", 0))
        cat = str(r.get("Danh mục chính", "")).strip()
        viewers = clean_int(r.get("Tổng số lượng người xem", 0))
        prod_cnt = clean_int(r.get("Số lượng sản phẩm", 0))
        sold_cnt = clean_int(r.get("Số sản phẩm được bán ra", 0))
        units = clean_int(r.get("Số lượng bán hàng trong Livestream", 0))
        gmv = clean_num(r.get("Doanh số Livestream", 0))
        uv = clean_num(r.get("Giá trị UV", 0))
        r_hash = make_row_hash(st_time, title, viewers, units, gmv)

        records.append((title, st_time, dur, cat, viewers, prod_cnt, sold_cnt, units, gmv, uv, r_hash))

    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_creator_livestreams",
        "raw_rows": initial_rows,
        "dropped_link_columns": dropped_cols,
        "in_memory_dups": in_memory_dups,
        "inserted_or_updated": len(records),
    }


def process_table_4_creator_products(files: List[str], conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Processing Table 4: kami_creator_products ---")
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS kami_creator_products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_name VARCHAR(500) NOT NULL,
            region VARCHAR(100) DEFAULT '',
            category VARCHAR(255) DEFAULT '',
            price_raw VARCHAR(100) DEFAULT '',
            units_sold_raw VARCHAR(50) DEFAULT '',
            revenue_raw VARCHAR(100) DEFAULT '',
            upload_time VARCHAR(50) DEFAULT '',
            commission_rate VARCHAR(50) DEFAULT '',
            shop_name VARCHAR(255) DEFAULT '',
            shop_total_sales_raw VARCHAR(100) DEFAULT '',
            row_hash CHAR(64) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_product_name (product_name(255)),
            INDEX idx_shop_name (shop_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    )

    dfs = [pd.read_excel(f) for f in files]
    df = pd.concat(dfs, ignore_index=True).dropna(how="all")
    initial_rows = len(df)

    dropped_cols = [c for c in df.columns if is_url_column(df[c], c)]
    df = df.drop(columns=dropped_cols)

    dedup_df = df.drop_duplicates()
    in_memory_dups = initial_rows - len(dedup_df)

    sql = """
        INSERT INTO kami_creator_products (
            product_name, region, category, price_raw, units_sold_raw,
            revenue_raw, upload_time, commission_rate, shop_name,
            shop_total_sales_raw, row_hash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            region = VALUES(region),
            category = VALUES(category),
            price_raw = VALUES(price_raw),
            units_sold_raw = VALUES(units_sold_raw),
            revenue_raw = VALUES(revenue_raw),
            upload_time = VALUES(upload_time),
            commission_rate = VALUES(commission_rate),
            shop_name = VALUES(shop_name),
            shop_total_sales_raw = VALUES(shop_total_sales_raw);
    """

    records = []
    for _, r in dedup_df.iterrows():
        pname = str(r.get("Tên sản phẩm", "")).strip()
        reg = str(r.get("Quốc gia/Địa phương", "")).strip()
        cat = str(r.get("Phân loại sản phẩm", "")).strip()
        price = str(r.get("Giá sản phẩm", "")).strip()
        sold = str(r.get("Đã bán", "")).strip()
        rev = str(r.get("Doanh số", "")).strip()
        upload = str(r.get("Thời gian đăng lên", "")).strip()
        comm = str(r.get("Tỷ lệ hoa hồng", "")).strip()
        shop = str(r.get("Tên cửa hàng", "")).strip()
        shop_tot = str(r.get("Tổng số lượng bán hàng của cửa hàng thuộc về", "")).strip()
        r_hash = make_row_hash(pname, shop, upload, price, sold, rev)

        records.append((pname, reg, cat, price, sold, rev, upload, comm, shop, shop_tot, r_hash))

    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_creator_products",
        "raw_rows": initial_rows,
        "dropped_link_columns": dropped_cols,
        "in_memory_dups": in_memory_dups,
        "inserted_or_updated": len(records),
    }


def process_table_5_creator_videos(files: List[str], conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Processing Table 5: kami_creator_videos ---")
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

    dfs = [pd.read_excel(f) for f in files]
    df = pd.concat(dfs, ignore_index=True).dropna(how="all")
    initial_rows = len(df)

    dropped_cols = [c for c in df.columns if is_url_column(df[c], c)]
    df = df.drop(columns=dropped_cols)

    dedup_df = df.drop_duplicates(subset=["Thời gian phát hành"])
    in_memory_dups = initial_rows - len(dedup_df)

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

    records = []
    for _, r in dedup_df.iterrows():
        title = str(r.get("Tiêu đề video", "")).strip()
        pub_time = str(r.get("Thời gian phát hành", "")).strip()
        dur = str(r.get("Thời lượng video", "")).strip()
        v_type = str(r.get("Loại video", "")).strip()
        units = clean_int(r.get("Số lượng bán hàng của video", 0))
        gmv = clean_num(r.get("Doanh số bán hàng của video", 0))
        views = clean_int(r.get("Số lượt xem", 0))
        likes = clean_int(r.get("Số lượng likes", 0))
        rate = str(r.get("Tỷ lệ tương tác", "")).strip()
        r_hash = make_row_hash(pub_time, title, views, units, gmv)

        records.append((title, pub_time, dur, v_type, units, gmv, views, likes, rate, r_hash))

    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_creator_videos",
        "raw_rows": initial_rows,
        "dropped_link_columns": dropped_cols,
        "in_memory_dups": in_memory_dups,
        "inserted_or_updated": len(records),
    }


def process_table_6_affiliate_videos(files: List[str], conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Processing Table 6: kami_affiliate_videos ---")
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

    dfs = [pd.read_excel(f) for f in files]
    df = pd.concat(dfs, ignore_index=True).dropna(how="all")
    initial_rows = len(df)

    dropped_cols = [c for c in df.columns if is_url_column(df[c], c)]
    df = df.drop(columns=dropped_cols)

    dedup_df = df.drop_duplicates()
    in_memory_dups = initial_rows - len(dedup_df)

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

    records = []
    for _, r in dedup_df.iterrows():
        title = str(r.get("Tiêu đề Video", "")).strip()
        dur = str(r.get("Thời lượng Video", "")).strip()
        ads = str(r.get("Có thể chạy Ads không", "")).strip()
        koc_name = str(r.get("Tên KOC/KOL", "")).strip()
        koc_id = str(r.get("ID KOC/KOL", "")).strip()
        fans = clean_int(r.get("Số Fans", 0))
        reg = str(r.get("Quốc Gia", "")).strip()
        cat = str(r.get("Phân loại KOC/KOL", "")).strip()
        pub_time = str(r.get("Thời gian đăng", "")).strip()
        views = str(r.get("Lượt xem", "0")).strip()
        likes = str(r.get("[ ngày gần đây]Lượt thích", "0")).strip()
        store_sales = clean_int(r.get("[ ngày gần đây]lượt bán sản phẩm của cửa hàng", 0))
        store_gmv = clean_num(r.get("[ ngày gần đây]Doanh thu sản phẩm của cửa hàng", 0))
        store_prods = clean_int(r.get("Số lượng sản phẩm của cửa hàng", 0))
        r_hash = make_row_hash(koc_id, pub_time, title, views, store_sales, store_gmv)

        records.append(
            (
                title,
                dur,
                ads,
                koc_name,
                koc_id,
                fans,
                reg,
                cat,
                pub_time,
                views,
                likes,
                store_sales,
                store_gmv,
                store_prods,
                r_hash,
            )
        )

    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_affiliate_videos",
        "raw_rows": initial_rows,
        "dropped_link_columns": dropped_cols,
        "in_memory_dups": in_memory_dups,
        "inserted_or_updated": len(records),
    }


def process_table_7_shop_products(files: List[str], conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Processing Table 7: kami_shop_products ---")
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

    dfs = [pd.read_excel(f) for f in files]
    df = pd.concat(dfs, ignore_index=True).dropna(how="all")
    initial_rows = len(df)

    dropped_cols = [c for c in df.columns if is_url_column(df[c], c)]
    df = df.drop(columns=dropped_cols)

    dedup_df = df.drop_duplicates(subset=["Tiêu đề sản phẩm", "Thời gian mở bán"])
    in_memory_dups = initial_rows - len(dedup_df)

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

    records = []
    for _, r in dedup_df.iterrows():
        title = str(r.get("Tiêu đề sản phẩm", "")).strip()
        reg = str(r.get("Quốc gia", "")).strip()
        price = str(r.get("Giá bán", "")).strip()
        cat = str(r.get("Phân loại sản phẩm", "")).strip()
        launch = str(r.get("Thời gian mở bán", "")).strip()
        comm = str(r.get("Tỷ lệ hoa hồng", "")).strip()
        sales = clean_int(r.get("[ ngày gần đây] lượt bán", 0))
        rev = clean_num(r.get("[ ngày gần đây] Doanh thu", 0))
        r_hash = make_row_hash(title, launch, price, sales, rev)

        records.append((title, reg, price, cat, launch, comm, sales, rev, r_hash))

    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_shop_products",
        "raw_rows": initial_rows,
        "dropped_link_columns": dropped_cols,
        "in_memory_dups": in_memory_dups,
        "inserted_or_updated": len(records),
    }


def process_table_8_affiliate_kol(files: List[str], conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Processing Table 8: kami_affiliate_kol ---")
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

    dfs = [pd.read_excel(f) for f in files]
    df = pd.concat(dfs, ignore_index=True).dropna(how="all")
    initial_rows = len(df)

    dropped_cols = [c for c in df.columns if is_url_column(df[c], c)]
    df = df.drop(columns=dropped_cols)

    # Filter out records where ID KOC/KOL is NaN/empty
    valid_df = df[df["ID KOC/KOL"].notnull() & (df["ID KOC/KOL"].astype(str).str.strip() != "")]
    dedup_df = valid_df.drop_duplicates(subset=["ID KOC/KOL"])
    in_memory_dups = initial_rows - len(dedup_df)

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

    records = []
    for _, r in dedup_df.iterrows():
        koc_name = str(r.get("Tên KOC/KOL", "")).strip()
        koc_id = str(r.get("ID KOC/KOL", "")).strip()
        cat = str(r.get("Phân loại KOC/KOL", "")).strip()
        reg = str(r.get("Quốc gia", "")).strip()
        fans = clean_int(r.get("Số Fans", 0))
        sales = clean_int(r.get("[] lượt bán qua LKTT", 0))
        gmv = clean_num(r.get("[] Doanh số LKTT", 0))
        live_gpm = str(r.get("GPM Livestream", "")).strip()
        video_gpm = str(r.get("GPM Video", "")).strip()
        prods = clean_int(r.get("Số lượng sản phẩm trong cửa hàng này", 0))
        r_hash = make_row_hash(koc_id, koc_name, fans, sales, gmv)

        records.append((koc_name, koc_id, cat, reg, fans, sales, gmv, live_gpm, video_gpm, prods, r_hash))

    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_affiliate_kol",
        "raw_rows": initial_rows,
        "dropped_link_columns": dropped_cols,
        "in_memory_dups": in_memory_dups,
        "inserted_or_updated": len(records),
    }


def process_table_9_affiliate_livestreams(files: List[str], conn: mysql.connector.MySQLConnection) -> Dict[str, Any]:
    print("\n--- Processing Table 9: kami_affiliate_livestreams ---")
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

    dfs = [pd.read_excel(f) for f in files]
    df = pd.concat(dfs, ignore_index=True).dropna(how="all")
    initial_rows = len(df)

    dropped_cols = [c for c in df.columns if is_url_column(df[c], c)]
    df = df.drop(columns=dropped_cols)

    dedup_df = df.drop_duplicates()
    in_memory_dups = initial_rows - len(dedup_df)

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

    records = []
    for _, r in dedup_df.iterrows():
        title = str(r.get("Tiêu đề Livestream", "")).strip()
        dur = clean_num(r.get("Thời lượng Livestream", 0))
        l_type = str(r.get("Loại Livestream", "")).strip()
        cat = str(r.get("Loại sản phẩm chính", "")).strip()
        koc_name = str(r.get("Tên KOC/KOL", "")).strip()
        koc_id = str(r.get("ID KOC/KOL", "")).strip()
        fans = clean_int(r.get("Số Fans", 0))
        reg = str(r.get("Quốc Gia", "")).strip()
        koc_cat = str(r.get("Phân loại KOC/KOL", "")).strip()
        sess_time = str(r.get("Thời gian Livestream", "")).strip()
        views = clean_int(r.get("Tổng lượt xem", 0))
        sales = clean_int(r.get("Lượt bán sản phẩm của cửa hàng", 0))
        gmv = clean_num(r.get("Doanh thu sản phẩm của cửa hàng", 0))
        prods = clean_int(r.get("Số lượng sản phẩm của cửa hàng", 0))
        r_hash = make_row_hash(koc_id, sess_time, title, views, sales, gmv)

        records.append(
            (
                title,
                dur,
                l_type,
                cat,
                koc_name,
                koc_id,
                fans,
                reg,
                koc_cat,
                sess_time,
                views,
                sales,
                gmv,
                prods,
                r_hash,
            )
        )

    cur.executemany(sql, records)
    conn.commit()
    cur.close()

    return {
        "table": "kami_affiliate_livestreams",
        "raw_rows": initial_rows,
        "dropped_link_columns": dropped_cols,
        "in_memory_dups": in_memory_dups,
        "inserted_or_updated": len(records),
    }


def main():
    print("================================================================================")
    print("STARTING KAMI ELY SUPPLEMENTARY DATA INGESTION TO MYSQL")
    print(f"Directory: {KAMI_PUBLIC_DIR}")
    print("================================================================================")

    xlsx_files = [
        f for f in glob.glob(os.path.join(KAMI_PUBLIC_DIR, "*.xlsx"))
        if not os.path.basename(f).startswith("~$")
    ]
    print(f"Discovered {len(xlsx_files)} Excel files in public/kami")

    file_groups: Dict[str, List[str]] = {
        "store_daily": [],
        "livestream_products": [],
        "creator_livestreams": [],
        "creator_products": [],
        "creator_videos": [],
        "affiliate_videos": [],
        "shop_products": [],
        "affiliate_kol": [],
        "affiliate_livestreams": [],
    }

    for f in xlsx_files:
        fn = os.path.basename(f)
        if "Tổng Quan Dữ Liệu" in fn:
            file_groups["store_daily"].append(f)
        elif "Live_Stream_Details_Live_Product_List" in fn:
            file_groups["livestream_products"].append(f)
        elif "Danh sách livestream bán hàng" in fn:
            file_groups["creator_livestreams"].append(f)
        elif "Danh sách sản phẩm bán hàng" in fn:
            file_groups["creator_products"].append(f)
        elif "Danh sách video" in fn:
            file_groups["creator_videos"].append(f)
        elif "Video LKTT" in fn:
            file_groups["affiliate_videos"].append(f)
        elif "Dữ liệu sản phẩm của cửa hàng" in fn:
            file_groups["shop_products"].append(f)
        elif "KOL LKTT của cửa hàng" in fn:
            file_groups["affiliate_kol"].append(f)
        elif "Livestream LKTT của cửa hàng" in fn:
            file_groups["affiliate_livestreams"].append(f)

    for k, v in file_groups.items():
        print(f"  - Group '{k}': {len(v)} files")

    conn = get_db_connection()
    print("Connected to MySQL database successfully.")

    reports = []
    reports.append(process_table_1_store_daily(file_groups["store_daily"], conn))
    reports.append(process_table_2_livestream_products(file_groups["livestream_products"], conn))
    reports.append(process_table_3_creator_livestreams(file_groups["creator_livestreams"], conn))
    reports.append(process_table_4_creator_products(file_groups["creator_products"], conn))
    reports.append(process_table_5_creator_videos(file_groups["creator_videos"], conn))
    reports.append(process_table_6_affiliate_videos(file_groups["affiliate_videos"], conn))
    reports.append(process_table_7_shop_products(file_groups["shop_products"], conn))
    reports.append(process_table_8_affiliate_kol(file_groups["affiliate_kol"], conn))
    reports.append(process_table_9_affiliate_livestreams(file_groups["affiliate_livestreams"], conn))

    # Verification query to check counts in database
    cur = conn.cursor()
    print("\n================================================================================")
    print("INGESTION & DEDUPLICATION SUMMARY")
    print("================================================================================")
    total_db_rows = 0
    for rep in reports:
        tbl = rep["table"]
        cur.execute(f"SELECT COUNT(*) FROM {tbl};")
        db_count = cur.fetchone()[0]
        total_db_rows += db_count
        print(f"\n[TABLE: {tbl}]")
        print(f"  * Raw rows read from Excel: {rep['raw_rows']}")
        print(f"  * Dropped link columns ({len(rep['dropped_link_columns'])}): {rep['dropped_link_columns']}")
        print(f"  * In-memory duplicate rows skipped: {rep['in_memory_dups']}")
        print(f"  * Inserted / Updated in MySQL: {rep['inserted_or_updated']}")
        print(f"  * Total active rows in MySQL: {db_count}")

    print("\n--------------------------------------------------------------------------------")
    print(f"SUCCESS: Total records across all 9 Kami Ely tables in MySQL: {total_db_rows}")
    print("================================================================================")

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
