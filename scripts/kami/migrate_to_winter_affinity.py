import sys
import mysql.connector

sys.stdout.reconfigure(encoding='utf-8')

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="173053ms",
    database="pplo",
    charset="utf8mb4"
)
cur = conn.cursor()

updates = [
    ("AQ1", "Set Đồ Thể Thao Nữ AQ1", "Set Đồ Thể Thao Nữ", "Hàng Bán Đông"),
    ("AT06", "Áo Thun Nữ Dài Tay Cotton Rib AT06", "Áo Thun", "Hàng Bán Đông"),
    ("AG01", "Áo Khoác Gió Nữ Chống Nắng AG01", "Áo Gió", "Hàng Bán Đông"),
    ("CV11", "Chân Váy Ngắn Chữ A Nỉ 2 Da CV11", "Chân Váy", "Hàng Bán Đông"),
    ("CV02", "Chân Váy Dài Ren Ba Tầng Voan CV02", "Chân Váy", "Hàng Bán Đông"),
    ("H36", "Set Bikini 2 Mảnh Kẻ Sọc H36", "Bikini / Đồ Bơi", "Hàng Bán Hè"),
    ("M18", "Bikini 1 Mảnh Bodysuit Sexy M18", "Bikini / Đồ Bơi", "Hàng Bán Hè"),
    ("SW01", "Đồ Bơi 1 Mảnh Liền Thân Khóa Kéo SW01", "Bikini / Đồ Bơi", "Hàng Bán Hè"),
    ("H32", "Set Bikini 2 Mảnh Cúp Ngực H32", "Bikini / Đồ Bơi", "Hàng Bán Hè"),
    ("H30", "Set Bikini 2 Mảnh Kẻ Caro H30", "Bikini / Đồ Bơi", "Hàng Bán Hè")
]

for sku, name, cat, aff in updates:
    cur.execute("""
        UPDATE kami_sku_daily_timeseries
        SET product_name = %s,
            category_group = %s,
            season_affinity = %s
        WHERE sku_code = %s;
    """, (name, cat, aff, sku))
    print(f"Updated {sku} -> {cat} | Affinity: {aff} | Rows: {cur.rowcount}")

conn.commit()
print("All 10 SKUs updated with season_affinity in MySQL.")
