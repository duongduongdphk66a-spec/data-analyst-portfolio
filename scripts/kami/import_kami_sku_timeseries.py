"""
Ingest 10 SKU Daily Time-Series into MySQL (pplo)
Table: kami_sku_daily_timeseries
Files: data-sources/kami/*.xlsx (CV11, AT06, H30, AQ1, AG01, SW01, M18, H36, H32, CV02)
"""
import hashlib
import os
import sys
import mysql.connector
import openpyxl

sys.stdout.reconfigure(encoding="utf-8")

DATA_DIR = r"C:\Users\ADMIN\Documents\data-analyst-portfolio\data-sources\kami"

SKU_METADATA = {
    "CV11": {
        "file": "CV11.xlsx",
        "name": "Chân Váy Ngắn Chữ A Nỉ 2 Da CV11",
        "category": "Chân Váy",
        "affinity": "Hàng Bán Đông",
        "avg_price": 140600,
    },
    "AT06": {
        "file": "AT06.xlsx",
        "name": "Áo Thun Nữ Dài Tay Cotton Rib AT06",
        "category": "Áo Thun",
        "affinity": "Hàng Bán Đông",
        "avg_price": 119043,
    },
    "H30": {
        "file": "H30.xlsx",
        "name": "Set Bikini 2 Mảnh Kẻ Caro H30",
        "category": "Bikini / Đồ Bơi",
        "affinity": "Hàng Bán Hè",
        "avg_price": 195452,
    },
    "AQ1": {
        "file": "AQ1.xlsx",
        "name": "Set Đồ Thể Thao Nữ AQ1",
        "category": "Set Đồ Thể Thao Nữ",
        "affinity": "Hàng Bán Đông",
        "avg_price": 177247,
    },
    "AG01": {
        "file": "AG01.xlsx",
        "name": "Áo Khoác Gió Nữ Chống Nắng AG01",
        "category": "Áo Gió",
        "affinity": "Hàng Bán Đông",
        "avg_price": 209000,
    },
    "SW01": {
        "file": "SW01.xlsx",
        "name": "Đồ Bơi 1 Mảnh Liền Thân Khóa Kéo SW01",
        "category": "Bikini / Đồ Bơi",
        "affinity": "Hàng Bán Hè",
        "avg_price": 221461,
    },
    "M18": {
        "file": "M18.xlsx",
        "name": "Bikini 1 Mảnh Bodysuit Sexy M18",
        "category": "Bikini / Đồ Bơi",
        "affinity": "Hàng Bán Hè",
        "avg_price": 206845,
    },
    "H36": {
        "file": "H36.xlsx",
        "name": "Set Bikini 2 Mảnh Kẻ Sọc H36",
        "category": "Bikini / Đồ Bơi",
        "affinity": "Hàng Bán Hè",
        "avg_price": 183461,
    },
    "H32": {
        "file": "H32.xlsx",
        "name": "Set Bikini 2 Mảnh Cúp Ngực H32",
        "category": "Bikini / Đồ Bơi",
        "affinity": "Hàng Bán Hè",
        "avg_price": 157893,
    },
    "CV02": {
        "file": "CV02.xlsx",
        "name": "Chân Váy Dài Ren Ba Tầng Voan CV02",
        "category": "Chân Váy",
        "affinity": "Hàng Bán Đông",
        "avg_price": 181670,
    },
}

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS kami_sku_daily_timeseries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku_code VARCHAR(32) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category_group VARCHAR(64) NOT NULL,
    season_affinity VARCHAR(64) NOT NULL,
    record_date DATE NOT NULL,
    cumulative_sales_units INT NOT NULL DEFAULT 0,
    delta_sales_units INT NOT NULL DEFAULT 0,
    cumulative_gmv_vnd DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    delta_gmv_vnd DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    cumulative_influencers INT NOT NULL DEFAULT 0,
    delta_influencers INT NOT NULL DEFAULT 0,
    cumulative_videos INT NOT NULL DEFAULT 0,
    delta_videos INT NOT NULL DEFAULT 0,
    cumulative_livestreams INT NOT NULL DEFAULT 0,
    delta_livestreams INT NOT NULL DEFAULT 0,
    avg_transaction_price_vnd DECIMAL(12,2) DEFAULT NULL,
    source_file VARCHAR(128) NOT NULL,
    row_hash CHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_sku_date (sku_code, record_date),
    INDEX idx_date (record_date),
    INDEX idx_category (category_group),
    INDEX idx_affinity (season_affinity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"""


def compute_hash(sku: str, date_str: str, cum_units: int, cum_gmv: float) -> str:
    raw = f"{sku}|{date_str}|{cum_units}|{cum_gmv:.2f}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def main():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="173053ms",
        database="pplo",
        charset="utf8mb4",
    )
    cur = conn.cursor(dictionary=True)
    
    # 1. Ensure table exists
    cur.execute(CREATE_TABLE_SQL)
    conn.commit()
    print("Table 'kami_sku_daily_timeseries' created or verified.")

    insert_sql = """
    INSERT INTO kami_sku_daily_timeseries (
        sku_code, product_name, category_group, season_affinity,
        record_date, cumulative_sales_units, delta_sales_units,
        cumulative_gmv_vnd, delta_gmv_vnd, cumulative_influencers,
        delta_influencers, cumulative_videos, delta_videos,
        cumulative_livestreams, delta_livestreams, avg_transaction_price_vnd,
        source_file, row_hash
    ) VALUES (
        %s, %s, %s, %s,
        %s, %s, %s,
        %s, %s, %s,
        %s, %s, %s,
        %s, %s, %s,
        %s, %s
    )
    ON DUPLICATE KEY UPDATE
        product_name = VALUES(product_name),
        category_group = VALUES(category_group),
        season_affinity = VALUES(season_affinity),
        cumulative_sales_units = VALUES(cumulative_sales_units),
        delta_sales_units = VALUES(delta_sales_units),
        cumulative_gmv_vnd = VALUES(cumulative_gmv_vnd),
        delta_gmv_vnd = VALUES(delta_gmv_vnd),
        cumulative_influencers = VALUES(cumulative_influencers),
        delta_influencers = VALUES(delta_influencers),
        cumulative_videos = VALUES(cumulative_videos),
        delta_videos = VALUES(delta_videos),
        cumulative_livestreams = VALUES(cumulative_livestreams),
        delta_livestreams = VALUES(delta_livestreams),
        avg_transaction_price_vnd = VALUES(avg_transaction_price_vnd),
        source_file = VALUES(source_file),
        row_hash = VALUES(row_hash);
    """

    for sku_code, meta in SKU_METADATA.items():
        fpath = os.path.join(DATA_DIR, meta["file"])
        if not os.path.exists(fpath):
            print(f"ERROR: File not found {fpath}")
            continue

        wb = openpyxl.load_workbook(fpath, data_only=True)
        sheet = wb.active
        rows = list(sheet.iter_rows(values_only=True))
        wb.close()

        data_rows = rows[1:]  # skip header
        records = []
        for r in data_rows:
            if not r or r[0] is None:
                continue
            date_str = str(r[0])[:10]
            cum_units = int(r[1]) if r[1] is not None else 0
            d_units = int(r[2]) if r[2] is not None else 0
            cum_gmv = float(r[3]) if r[3] is not None else 0.0
            d_gmv = float(r[4]) if r[4] is not None else 0.0
            cum_inf = int(r[5]) if r[5] is not None else 0
            d_inf = int(r[6]) if r[6] is not None else 0
            cum_vid = int(r[7]) if r[7] is not None else 0
            d_vid = int(r[8]) if r[8] is not None else 0
            cum_live = int(r[9]) if r[9] is not None else 0
            d_live = int(r[10]) if r[10] is not None else 0
            avg_price = float(r[11]) if len(r) > 11 and r[11] is not None and r[11] != 0 else meta["avg_price"]

            r_hash = compute_hash(sku_code, date_str, cum_units, cum_gmv)

            records.append((
                sku_code, meta["name"], meta["category"], meta["affinity"],
                date_str, cum_units, d_units,
                cum_gmv, d_gmv, cum_inf,
                d_inf, cum_vid, d_vid,
                cum_live, d_live, avg_price,
                meta["file"], r_hash
            ))

        cur.executemany(insert_sql, records)
        conn.commit()
        print(f"Synced SKU {sku_code:5s} ({meta['name']}): {len(records)} daily records.")

    # Verification query
    cur.execute("""
        SELECT 
            sku_code,
            category_group,
            season_affinity,
            COUNT(*) AS total_days,
            MIN(record_date) AS min_date,
            MAX(record_date) AS max_date,
            SUM(delta_sales_units) AS total_delta_units,
            SUM(delta_gmv_vnd) AS total_delta_gmv,
            MAX(cumulative_sales_units) AS max_cum_units,
            MAX(cumulative_gmv_vnd) AS max_cum_gmv
        FROM kami_sku_daily_timeseries
        GROUP BY sku_code, category_group, season_affinity
        ORDER BY total_delta_gmv DESC;
    """)
    summary = cur.fetchall()

    print("\n=== VERIFICATION: INGESTION SUMMARY BY SKU ===")
    print(f"{'SKU':5s} | {'Days':4s} | {'Min Date':10s} -> {'Max Date':10s} | {'Delta Units':11s} | {'Delta GMV (VND)':17s} | Category")
    print("-" * 90)
    total_all_gmv = 0
    total_all_units = 0
    total_all_rows = 0
    for s in summary:
        total_all_gmv += float(s["total_delta_gmv"])
        total_all_units += int(s["total_delta_units"])
        total_all_rows += int(s["total_days"])
        print(f"{s['sku_code']:5s} | {s['total_days']:4d} | {str(s['min_date']):10s} -> {str(s['max_date']):10s} | {int(s['total_delta_units']):11,d} | {float(s['total_delta_gmv']):17,.0f} đ | {s['category_group']}")

    print("-" * 90)
    print(f"TOTAL: {total_all_rows} rows across 10 SKUs | {total_all_units:,} delta units | {total_all_gmv:,.0f} đ GMV")

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
