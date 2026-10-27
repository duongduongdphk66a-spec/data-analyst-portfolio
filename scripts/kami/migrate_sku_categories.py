"""
Update product names and categories in kami_sku_daily_timeseries on MySQL
Based on user specification:
- AQ1: Set Đồ Thể Thao Nữ
- AT06: Áo Thun
- AG01: Áo Gió
- CV11, CV02: Chân Váy (Không phải Bikini)
- H36, M18, SW01, H32, H30: Bikini / Đồ Bơi
"""
import mysql.connector
import sys
sys.stdout.reconfigure(encoding="utf-8")

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="173053ms",
    database="pplo",
    charset="utf8mb4"
)
cur = conn.cursor()

updates = [
    ("AQ1", "Set Đồ Thể Thao Nữ AQ1", "Set Đồ Thể Thao Nữ", "Đồ Thể Thao"),
    ("AT06", "Áo Thun Nữ Dài Tay Cotton Rib AT06", "Áo Thun", "Thu Đông / Thuần Việt"),
    ("AG01", "Áo Khoác Gió Nữ Chống Nắng AG01", "Áo Gió", "Thu Đông / Chuyển mùa"),
    ("CV11", "Chân Váy Ngắn Chữ A Nỉ 2 Da CV11", "Chân Váy", "Thu Đông (Nỉ 2 Da)"),
    ("CV02", "Chân Váy Dài Ren Ba Tầng Voan CV02", "Chân Váy", "Quanh năm (Voan)"),
    ("H36", "Set Bikini 2 Mảnh Kẻ Sọc H36", "Bikini / Đồ Bơi", "Mùa Hè (Swimwear)"),
    ("M18", "Bikini 1 Mảnh Bodysuit Sexy M18", "Bikini / Đồ Bơi", "Mùa Hè (Swimwear)"),
    ("SW01", "Đồ Bơi 1 Mảnh Liền Thân Khóa Kéo SW01", "Bikini / Đồ Bơi", "Mùa Hè (Swimwear)"),
    ("H32", "Set Bikini 2 Mảnh Cúp Ngực H32", "Bikini / Đồ Bơi", "Mùa Hè (Swimwear)"),
    ("H30", "Set Bikini 2 Mảnh Kẻ Caro H30", "Bikini / Đồ Bơi", "Mùa Hè (Swimwear)")
]

for sku, name, cat, aff in updates:
    cur.execute("""
        UPDATE kami_sku_daily_timeseries
        SET product_name = %s,
            category_group = %s,
            season_affinity = %s
        WHERE sku_code = %s;
    """, (name, cat, aff, sku))
    print(f"Updated {sku} -> {cat} ({name}) | Rows: {cur.rowcount}")

conn.commit()
print("All 10 SKUs updated in MySQL successfully.")
