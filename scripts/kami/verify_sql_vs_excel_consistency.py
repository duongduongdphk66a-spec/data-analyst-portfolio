"""
Kiểm toán đối soát toàn diện tính đồng nhất:
MySQL Database (pplo) VS 10 File Excel Master Merged VS JSON Web App
"""
import os
import sys
import json
import mysql.connector
import pandas as pd
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = r"c:\Users\ADMIN\Documents\data-analyst-portfolio"
EXCEL_DIR = os.path.join(ROOT_DIR, "data-sources", "kami", "merged")
JSON_PATH = os.path.join(ROOT_DIR, "app", "data", "kami-ely", "generated", "sku_seasonality.json")

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="173053ms",
        database="pplo"
    )

conn = get_db()
cursor = conn.cursor(dictionary=True)

audit_results = []

def record_check(table_name, excel_file, metric_name, sql_val, excel_val, unit=""):
    diff = 0
    if isinstance(sql_val, (int, float, np.integer, np.floating)) and isinstance(excel_val, (int, float, np.integer, np.floating)):
        diff = abs(sql_val - excel_val)
        is_match = diff < 0.01
    else:
        is_match = str(sql_val).strip() == str(excel_val).strip()
    
    audit_results.append({
        "table": table_name,
        "excel": excel_file,
        "metric": metric_name,
        "sql": sql_val,
        "excel": excel_val,
        "diff": diff,
        "match": is_match,
        "unit": unit
    })

print("================================================================================")
print("BẮT ĐẦU KIỂM TOÁN TÍNH ĐỒNG NHẤT: MYSQL (pplo) VS 10 FILE EXCEL MASTER MERGED")
print("================================================================================")

# ---------------------------------------------------------------------------------
# 1. kami_sku_daily_timeseries
# ---------------------------------------------------------------------------------
t1 = "kami_sku_daily_timeseries"
f1 = "[Kami Ely]_10_SKU_Daily_Timeseries_Merged.xlsx"
df1 = pd.read_excel(os.path.join(EXCEL_DIR, f1), sheet_name="All_10_SKUs_Merged")

cursor.execute("SELECT COUNT(*) as cnt, COUNT(DISTINCT sku_code) as skus, SUM(delta_sales_units) as units, SUM(delta_gmv_vnd) as gmv, MIN(record_date) as min_d, MAX(record_date) as max_d FROM kami_sku_daily_timeseries")
s1 = cursor.fetchone()

record_check(t1, f1, "Số dòng dữ liệu", s1['cnt'], len(df1), "dòng")
record_check(t1, f1, "Số lượng SKU riêng biệt", s1['skus'], df1['Mã SKU'].nunique(), "SKU")
record_check(t1, f1, "Tổng lượng bán (Units)", float(s1['units']), float(df1['Lượng Bán Trong Ngày (Sp)'].sum()), "sp")
record_check(t1, f1, "Tổng doanh thu (GMV)", float(s1['gmv']), float(df1['Doanh Thu Trong Ngày (VNĐ)'].sum()), "VNĐ")
record_check(t1, f1, "Ngày bắt đầu", str(s1['min_d']), str(df1['Ngày Ghi Nhận'].min())[:10], "")
record_check(t1, f1, "Ngày kết thúc", str(s1['max_d']), str(df1['Ngày Ghi Nhận'].max())[:10], "")

# Check individual SKUs
cursor.execute("SELECT sku_code, SUM(delta_sales_units) as units, SUM(delta_gmv_vnd) as gmv, COUNT(*) as days FROM kami_sku_daily_timeseries GROUP BY sku_code ORDER BY sku_code")
for r in cursor.fetchall():
    sku = r['sku_code']
    df_sku = df1[df1['Mã SKU'] == sku]
    record_check(t1, f1, f"SKU {sku} - Số ngày", r['days'], len(df_sku), "ngày")
    record_check(t1, f1, f"SKU {sku} - Sản lượng", float(r['units']), float(df_sku['Lượng Bán Trong Ngày (Sp)'].sum()), "sp")
    record_check(t1, f1, f"SKU {sku} - GMV", float(r['gmv']), float(df_sku['Doanh Thu Trong Ngày (VNĐ)'].sum()), "VNĐ")

# ---------------------------------------------------------------------------------
# 2. kami_store_daily_overview
# ---------------------------------------------------------------------------------
t2 = "kami_store_daily_overview"
f2 = "[Kami Ely]_Store_Daily_Overview_231_Days_Merged.xlsx"
df2 = pd.read_excel(os.path.join(EXCEL_DIR, f2), sheet_name="Store_Daily_231_Days")

cursor.execute("SELECT COUNT(*) as cnt, MIN(record_date) as min_d, MAX(record_date) as max_d, SUM(delta_sales_units) as units, SUM(delta_gmv_vnd) as gmv FROM kami_store_daily_overview")
s2 = cursor.fetchone()

record_check(t2, f2, "Số ngày chuỗi thời gian", s2['cnt'], len(df2), "ngày")
record_check(t2, f2, "Ngày bắt đầu", str(s2['min_d']), str(df2['Ngày Ghi Nhận'].min())[:10], "")
record_check(t2, f2, "Ngày kết thúc", str(s2['max_d']), str(df2['Ngày Ghi Nhận'].max())[:10], "")
record_check(t2, f2, "Tổng sản lượng delta toàn shop", float(s2['units']), float(df2['Lượng Bán Trong Ngày (Sp)'].sum()), "sp")
record_check(t2, f2, "Tổng doanh thu delta toàn shop", float(s2['gmv']), float(df2['Doanh Thu Trong Ngày (VNĐ)'].sum()), "VNĐ")

# ---------------------------------------------------------------------------------
# 3. kami_affiliate_kol
# ---------------------------------------------------------------------------------
t3 = "kami_affiliate_kol"
f3 = "[Kami Ely]_Affiliate_KOL_Merged.xlsx"
df3 = pd.read_excel(os.path.join(EXCEL_DIR, f3))

cursor.execute("SELECT COUNT(*) as cnt, SUM(affiliate_sales_units) as units, SUM(affiliate_gmv_vnd) as gmv FROM kami_affiliate_kol")
s3 = cursor.fetchone()

record_check(t3, f3, "Số lượng KOC/KOL", s3['cnt'], len(df3), "KOC")
record_check(t3, f3, "Tổng lượng bán Affiliate", float(s3['units']), float(df3['Số Lượng Bán Đóng Góp (Sp)'].sum()), "sp")
record_check(t3, f3, "Tổng GMV Affiliate", float(s3['gmv']), float(df3['Doanh Số Đóng Góp (VNĐ)'].sum()), "VNĐ")

# ---------------------------------------------------------------------------------
# 4. kami_affiliate_livestreams
# ---------------------------------------------------------------------------------
t4 = "kami_affiliate_livestreams"
f4 = "[Kami Ely]_Affiliate_Livestreams_Merged.xlsx"
df4 = pd.read_excel(os.path.join(EXCEL_DIR, f4))

cursor.execute("SELECT COUNT(*) as cnt, SUM(store_sales_units) as units, SUM(store_gmv_vnd) as gmv FROM kami_affiliate_livestreams")
s4 = cursor.fetchone()

record_check(t4, f4, "Số phiên live Affiliate", s4['cnt'], len(df4), "phiên")
record_check(t4, f4, "Lượng bán live Affiliate", float(s4['units']), float(df4['Số Lượng Bán Cho Shop (Sp)'].sum()), "sp")
record_check(t4, f4, "GMV live Affiliate", float(s4['gmv']), float(df4['Doanh Thu Cho Shop (VNĐ)'].sum()), "VNĐ")

# ---------------------------------------------------------------------------------
# 5. kami_affiliate_videos
# ---------------------------------------------------------------------------------
t5 = "kami_affiliate_videos"
f5 = "[Kami Ely]_Affiliate_Videos_Merged.xlsx"
df5 = pd.read_excel(os.path.join(EXCEL_DIR, f5))

cursor.execute("SELECT COUNT(*) as cnt, SUM(recent_store_sales_units) as units, SUM(recent_store_gmv_vnd) as gmv FROM kami_affiliate_videos")
s5 = cursor.fetchone()

record_check(t5, f5, "Số video Affiliate", s5['cnt'], len(df5), "video")
record_check(t5, f5, "Lượng bán qua video Affiliate", float(s5['units']), float(df5['Số Lượng Bán (Sp)'].sum()), "sp")
record_check(t5, f5, "GMV qua video Affiliate", float(s5['gmv']), float(df5['Doanh Thu Đóng Góp (VNĐ)'].sum()), "VNĐ")

# ---------------------------------------------------------------------------------
# 6. kami_creator_livestreams
# ---------------------------------------------------------------------------------
t6 = "kami_creator_livestreams"
f6 = "[Kami Ely]_Creator_Livestreams_Merged.xlsx"
df6 = pd.read_excel(os.path.join(EXCEL_DIR, f6))

cursor.execute("SELECT COUNT(*) as cnt, SUM(sales_units) as units, SUM(gmv_vnd) as gmv FROM kami_creator_livestreams")
s6 = cursor.fetchone()

record_check(t6, f6, "Số phiên live chính chủ", s6['cnt'], len(df6), "phiên")
record_check(t6, f6, "Sản lượng live chính chủ", float(s6['units']), float(df6['Số Lượng Bán Thành Công (Sp)'].sum()), "sp")
record_check(t6, f6, "GMV live chính chủ", float(s6['gmv']), float(df6['Doanh Thu Phiên Live (VNĐ)'].sum()), "VNĐ")

# ---------------------------------------------------------------------------------
# 7. kami_creator_videos
# ---------------------------------------------------------------------------------
t7 = "kami_creator_videos"
f7 = "[Kami Ely]_Creator_Videos_Merged.xlsx"
df7 = pd.read_excel(os.path.join(EXCEL_DIR, f7))

cursor.execute("SELECT COUNT(*) as cnt, SUM(sales_units) as units, SUM(gmv_vnd) as gmv FROM kami_creator_videos")
s7 = cursor.fetchone()

record_check(t7, f7, "Số video chính chủ", s7['cnt'], len(df7), "video")
record_check(t7, f7, "Lượng bán video chính chủ", float(s7['units']), float(df7['Số Lượng Bán (Sp)'].sum()), "sp")
record_check(t7, f7, "GMV video chính chủ", float(s7['gmv']), float(df7['Doanh Thu Chuyển Đổi (VNĐ)'].sum()), "VNĐ")

# ---------------------------------------------------------------------------------
# 8. kami_creator_products
# ---------------------------------------------------------------------------------
t8 = "kami_creator_products"
f8 = "[Kami Ely]_Creator_Products_Merged.xlsx"
df8 = pd.read_excel(os.path.join(EXCEL_DIR, f8))

cursor.execute("SELECT COUNT(*) as cnt, COUNT(DISTINCT BINARY product_name) as distinct_prods FROM kami_creator_products")
s8 = cursor.fetchone()

record_check(t8, f8, "Số bản ghi snapshot", s8['cnt'], len(df8), "bản ghi")
record_check(t8, f8, "Số sản phẩm duy nhất", s8['distinct_prods'], df8['Tên Sản Phẩm'].nunique(), "sản phẩm")

# ---------------------------------------------------------------------------------
# 9. kami_shop_products
# ---------------------------------------------------------------------------------
t9 = "kami_shop_products"
f9 = "[Kami Ely]_Shop_Products_Merged.xlsx"
df9 = pd.read_excel(os.path.join(EXCEL_DIR, f9))

cursor.execute("SELECT COUNT(*) as cnt, SUM(recent_sales_units) as units, SUM(recent_revenue_vnd) as rev FROM kami_shop_products")
s9 = cursor.fetchone()

record_check(t9, f9, "Số sản phẩm shop catalog", s9['cnt'], len(df9), "sản phẩm")
record_check(t9, f9, "Lượng bán gần nhất catalog", float(s9['units']), float(df9['Lượng Bán Gần Nhất (Sp)'].sum()), "sp")
record_check(t9, f9, "Doanh số gần nhất catalog", float(s9['rev']), float(df9['Doanh Thu Gần Nhất (VNĐ)'].sum()), "VNĐ")

# ---------------------------------------------------------------------------------
# 10. kami_livestream_products
# ---------------------------------------------------------------------------------
t10 = "kami_livestream_products"
f10 = "[Kami Ely]_Livestream_Products_Merged.xlsx"
df10 = pd.read_excel(os.path.join(EXCEL_DIR, f10))

cursor.execute("SELECT COUNT(*) as cnt, SUM(live_units_sold) as units, SUM(live_revenue_vnd) as rev FROM kami_livestream_products")
s10 = cursor.fetchone()

record_check(t10, f10, "Số sản phẩm ghim live", s10['cnt'], len(df10), "sản phẩm")
record_check(t10, f10, "Lượng bán trong live", float(s10['units']), float(df10['Lượng Bán Trong Live'].sum()), "sp")
record_check(t10, f10, "Doanh số trong live", float(s10['rev']), float(df10['Doanh Thu Trực Tiếp Trong Live (VNĐ)'].sum()), "VNĐ")

# ---------------------------------------------------------------------------------
# 11. ĐỐI SOÁT VỚI JSON CỦA WEB APP (sku_seasonality.json)
# ---------------------------------------------------------------------------------
if os.path.exists(JSON_PATH):
    with open(JSON_PATH, "r", encoding="utf-8") as jf:
        sku_json = json.load(jf)
    
    json_total_gmv = sku_json['summary']['totalGmv']
    json_total_units = sku_json['summary']['totalUnits']
    
    record_check("WEB JSON summary", "sku_seasonality.json", "Tổng GMV 10 SKU trên Web", float(s1['gmv']), float(json_total_gmv), "VNĐ")
    record_check("WEB JSON summary", "sku_seasonality.json", "Tổng Sản Lượng 10 SKU trên Web", float(s1['units']), float(json_total_units), "sp")

cursor.close()
conn.close()

# In kết quả
df_results = pd.DataFrame(audit_results)
passed_count = df_results['match'].sum()
total_checks = len(df_results)

print(f"\nKẾT QUẢ KIỂM TRA ĐỐI SOÁT: {passed_count}/{total_checks} CHỈ SỐ KHỚP TUYỆT ĐỐI (100% MATCH)")
print("--------------------------------------------------------------------------------")
for idx, r in df_results.iterrows():
    status = "✓ KHỚP 100%" if r['match'] else "✗ LỆCH"
    unit_str = f" {r['unit']}" if r['unit'] else ""
    if isinstance(r['sql'], (int, float)) and r['unit'] in ['VNĐ', 'sp', 'dòng', 'ngày', 'phiên', 'video', 'KOC', 'SKU', 'bản ghi', 'sản phẩm']:
        print(f"[{status}] {r['table']} | {r['metric']}: SQL={r['sql']:,.0f}{unit_str} == EXCEL={r['excel']:,.0f}{unit_str}")
    else:
        print(f"[{status}] {r['table']} | {r['metric']}: SQL='{r['sql']}' == EXCEL='{r['excel']}'")
