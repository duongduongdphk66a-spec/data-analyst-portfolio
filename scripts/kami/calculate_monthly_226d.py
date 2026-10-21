import sys
import os
sys.path.append(os.path.abspath("."))
from scripts.kami.import_kami_all_timeframes import get_db_connection

sys.stdout.reconfigure(encoding="utf-8")
conn = get_db_connection()
cur = conn.cursor(dictionary=True)

query = """
SELECT 
    DATE_FORMAT(record_date, '%Y-%m') AS month,
    COUNT(*) AS days,
    SUM(delta_gmv_vnd) AS monthly_gmv,
    SUM(delta_sales_units) AS monthly_units,
    AVG(delta_gmv_vnd) AS avg_daily_gmv,
    MAX(delta_gmv_vnd) AS peak_day_gmv
FROM kami_store_daily_overview
GROUP BY DATE_FORMAT(record_date, '%Y-%m')
ORDER BY month;
"""
cur.execute(query)
rows = cur.fetchall()
print("--- MONTHLY PERFORMANCE (226 DAYS: 03/2026 - 10/2026) ---")
for r in rows:
    gmv_b = float(r["monthly_gmv"]) / 1e9
    avg_m = float(r["avg_daily_gmv"]) / 1e6
    units = r["monthly_units"]
    days = r["days"]
    m = r["month"]
    print(f"{m} ({days} days): GMV = {gmv_b:.2f}B VND ({units:,} units) | Avg/day: {avg_m:.1f}M VND")

conn.close()
