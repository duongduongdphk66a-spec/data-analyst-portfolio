"""
Script: merge_all_excel_datasets.py
Mục đích: Gộp toàn bộ các file Excel cùng loại trong các thư mục data (data-sources/kami, data/kami, public/kami)
thành các file Excel tổng hợp chuẩn hóa (Master Merged Datasets).
"""
import os
import sys
import shutil
import mysql.connector
import pandas as pd
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = r"c:\Users\ADMIN\Documents\data-analyst-portfolio"
DATA_SOURCES_MERGED = os.path.join(ROOT_DIR, "data-sources", "kami", "merged")
DATA_MERGED = os.path.join(ROOT_DIR, "data", "kami", "merged")

os.makedirs(DATA_SOURCES_MERGED, exist_ok=True)
os.makedirs(DATA_MERGED, exist_ok=True)

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="173053ms",
        database="pplo"
    )

def format_excel_sheet(ws, title_color="0D7287"):
    """Thêm style đẹp, header chuyên nghiệp, căn chỉnh độ rộng cột tự động"""
    header_fill = PatternFill(start_color=title_color, end_color=title_color, fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    data_font = Font(name="Calibri", size=10)
    border_thin = Border(
        left=Side(style='thin', color='D9D9D9'),
        right=Side(style='thin', color='D9D9D9'),
        top=Side(style='thin', color='D9D9D9'),
        bottom=Side(style='thin', color='D9D9D9')
    )

    # Style headers
    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Data rows border and fonts
    for row in ws.iter_rows(min_row=2, max_row=ws.max_row, min_col=1, max_col=ws.max_column):
        for cell in row:
            cell.font = data_font
            cell.border = border_thin
            if isinstance(cell.value, (int, float)):
                cell.alignment = Alignment(horizontal="right", vertical="center")

    # Column width auto-fit
    for col in ws.columns:
        col_letter = get_column_letter(col[0].column)
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_name = str(col[0].value or '')
        header_len = len(col_name)
        width = max(max_len, header_len) + 4
        ws.column_dimensions[col_letter].width = min(max(width, 12), 50)

    ws.row_dimensions[1].height = 26
    ws.freeze_panes = "A2"

def export_and_copy(writer, filename, desc):
    writer.close()
    src_path = os.path.join(DATA_SOURCES_MERGED, filename)
    dst_path = os.path.join(DATA_MERGED, filename)
    shutil.copy2(src_path, dst_path)
    # Also copy to data-sources/kami root
    root_copy = os.path.join(ROOT_DIR, "data-sources", "kami", filename)
    shutil.copy2(src_path, root_copy)
    print(f"✓ Đã tạo thành công: {filename} ({desc})")

print("=== BẮT ĐẦU GỘP CÁC FILE EXCEL CÙNG LOẠI ===")
conn = get_db()

# -------------------------------------------------------------------------
# 1. GỘP 10 MÃ SKU CHUỖI THỜI GIAN (SKU DAILY TIMESERIES)
# -------------------------------------------------------------------------
print("\n1. Gộp 10 file SKU Daily Timeseries...")
query_all_skus = """
SELECT 
    sku_code as `Mã SKU`,
    product_name as `Tên Sản Phẩm`,
    category_group as `Ngành Hàng`,
    season_affinity as `Đặc Tính Mùa`,
    record_date as `Ngày Ghi Nhận`,
    cumulative_sales_units as `Lượng Bán Tích Lũy (Sp)`,
    delta_sales_units as `Lượng Bán Trong Ngày (Sp)`,
    cumulative_gmv_vnd as `Doanh Thu Tích Lũy (VNĐ)`,
    delta_gmv_vnd as `Doanh Thu Trong Ngày (VNĐ)`,
    cumulative_influencers as `KOC Tích Lũy`,
    delta_influencers as `KOC Mới Trong Ngày`,
    cumulative_videos as `Video Tích Lũy`,
    delta_videos as `Video Mới Trong Ngày`,
    cumulative_livestreams as `Livestream Tích Lũy`,
    delta_livestreams as `Livestream Mới Trong Ngày`,
    avg_transaction_price_vnd as `Giá Bán TB (VNĐ)`,
    source_file as `File Nguồn Gốc`
FROM kami_sku_daily_timeseries
ORDER BY sku_code, record_date ASC
"""
df_all_skus = pd.read_sql(query_all_skus, conn)

fn_skus = "[Kami Ely]_10_SKU_Daily_Timeseries_Merged.xlsx"
writer_skus = pd.ExcelWriter(os.path.join(DATA_SOURCES_MERGED, fn_skus), engine="openpyxl")

# Sheet 1: Tổng hợp 10 SKU
df_all_skus.to_excel(writer_skus, sheet_name="All_10_SKUs_Merged", index=False)
format_excel_sheet(writer_skus.sheets["All_10_SKUs_Merged"], title_color="0D7287")

# Sheets 2-11: Từng SKU riêng biệt
for sku in sorted(df_all_skus["Mã SKU"].unique()):
    df_single = df_all_skus[df_all_skus["Mã SKU"] == sku].copy()
    sheet_name = f"SKU_{sku}"
    df_single.to_excel(writer_skus, sheet_name=sheet_name, index=False)
    format_excel_sheet(writer_skus.sheets[sheet_name], title_color="1E3A8A")

export_and_copy(writer_skus, fn_skus, f"{len(df_all_skus):,} dòng, 11 sheets")

# -------------------------------------------------------------------------
# 2. GỘP TỔNG QUAN GIAN HÀNG 231 NGÀY (STORE DAILY OVERVIEW)
# -------------------------------------------------------------------------
print("\n2. Gộp Tổng Quan Dữ Liệu Gian Hàng 231 Ngày...")
query_store = """
SELECT 
    record_date as `Ngày Ghi Nhận`,
    sales_units as `Lượng Bán Tích Lũy (Sp)`,
    delta_sales_units as `Lượng Bán Trong Ngày (Sp)`,
    gmv_vnd as `Doanh Thu Tích Lũy (VNĐ)`,
    delta_gmv_vnd as `Doanh Thu Trong Ngày (VNĐ)`,
    influencers_count as `KOC Tích Lũy`,
    delta_influencers_count as `KOC Mới Trong Ngày`,
    videos_count as `Video Tích Lũy`,
    delta_videos_count as `Video Mới Trong Ngày`,
    livestreams_count as `Livestream Tích Lũy`,
    delta_livestreams_count as `Livestream Mới Trong Ngày`
FROM kami_store_daily_overview
ORDER BY record_date ASC
"""
df_store = pd.read_sql(query_store, conn)

fn_store = "[Kami Ely]_Store_Daily_Overview_231_Days_Merged.xlsx"
writer_store = pd.ExcelWriter(os.path.join(DATA_SOURCES_MERGED, fn_store), engine="openpyxl")
df_store.to_excel(writer_store, sheet_name="Store_Daily_231_Days", index=False)
format_excel_sheet(writer_store.sheets["Store_Daily_231_Days"], title_color="0D7287")
export_and_copy(writer_store, fn_store, f"{len(df_store):,} dòng (09/03/2026 -> 25/10/2026)")

# -------------------------------------------------------------------------
# 3. GỘP DANH SÁCH KOL / KOC LIÊN KẾT TIẾP THỊ (AFFILIATE KOLS)
# -------------------------------------------------------------------------
print("\n3. Gộp Danh Bạ Affiliate KOC / KOL...")
query_kol = """
SELECT 
    koc_id as `KOC ID`,
    koc_name as `Tên KOC`,
    category as `Ngành Hàng Hoạt Động`,
    region as `Khu Vực`,
    fans_count as `Người Theo Dõi (Followers)`,
    affiliate_sales_units as `Số Lượng Bán Đóng Góp (Sp)`,
    affiliate_gmv_vnd as `Doanh Số Đóng Góp (VNĐ)`,
    live_gpm as `Live GPM`,
    video_gpm as `Video GPM`,
    products_in_store as `Số Sản Phẩm Của Shop Trong Kênh`
FROM kami_affiliate_kol
ORDER BY affiliate_gmv_vnd DESC
"""
df_kol = pd.read_sql(query_kol, conn)

fn_kol = "[Kami Ely]_Affiliate_KOL_Merged.xlsx"
writer_kol = pd.ExcelWriter(os.path.join(DATA_SOURCES_MERGED, fn_kol), engine="openpyxl")
df_kol.to_excel(writer_kol, sheet_name="Affiliate_KOL_6086_Creators", index=False)
format_excel_sheet(writer_kol.sheets["Affiliate_KOL_6086_Creators"], title_color="0D7287")
export_and_copy(writer_kol, fn_kol, f"{len(df_kol):,} KOC duy nhất")

# -------------------------------------------------------------------------
# 4. GỘP CÁC PHIÊN LIVESTREAM LIÊN KẾT TIẾP THỊ (AFFILIATE LIVESTREAMS)
# -------------------------------------------------------------------------
print("\n4. Gộp Danh Sách Affiliate Livestreams...")
query_live_aff = """
SELECT 
    session_time as `Thời Gian Bắt Đầu Live`,
    title as `Tiêu Đề Phiên Live`,
    duration_hours as `Thời Lượng (Giờ)`,
    live_type as `Loại Hình Live`,
    main_category as `Danh Mục Ngành Hàng`,
    koc_name as `Tên KOC`,
    koc_id as `KOC ID`,
    fans_count as `Followers`,
    koc_category as `Phân Loại Tài Khoản`,
    total_views as `Tổng Lượt Xem Live`,
    store_sales_units as `Số Lượng Bán Cho Shop (Sp)`,
    store_gmv_vnd as `Doanh Thu Cho Shop (VNĐ)`,
    store_product_count as `Số Sản Phẩm Shop Được Ghim`
FROM kami_affiliate_livestreams
ORDER BY session_time DESC
"""
df_live_aff = pd.read_sql(query_live_aff, conn)

fn_live_aff = "[Kami Ely]_Affiliate_Livestreams_Merged.xlsx"
writer_live_aff = pd.ExcelWriter(os.path.join(DATA_SOURCES_MERGED, fn_live_aff), engine="openpyxl")
df_live_aff.to_excel(writer_live_aff, sheet_name="Affiliate_Live_8355_Sessions", index=False)
format_excel_sheet(writer_live_aff.sheets["Affiliate_Live_8355_Sessions"], title_color="0D7287")
export_and_copy(writer_live_aff, fn_live_aff, f"{len(df_live_aff):,} phiên livestream")

# -------------------------------------------------------------------------
# 5. GỘP VIDEO LIÊN KẾT TIẾP THỊ (AFFILIATE VIDEOS)
# -------------------------------------------------------------------------
print("\n5. Gộp Danh Sách Affiliate Videos...")
query_video_aff = """
SELECT 
    publish_time as `Thời Gian Xuất Bản`,
    title as `Tiêu Đề Video`,
    duration as `Thời Lượng`,
    is_ads_eligible as `Ủy Quyền Quảng Cáo`,
    koc_name as `Tên KOC`,
    koc_id as `KOC ID`,
    fans_count as `Followers`,
    category as `Danh Mục Nội Dung`,
    views as `Lượt Xem`,
    recent_likes as `Lượt Thích`,
    recent_store_sales_units as `Số Lượng Bán (Sp)`,
    recent_store_gmv_vnd as `Doanh Thu Đóng Góp (VNĐ)`,
    store_product_count as `Số Sản Phẩm Ghim Trong Video`
FROM kami_affiliate_videos
ORDER BY publish_time DESC
"""
df_video_aff = pd.read_sql(query_video_aff, conn)

fn_video_aff = "[Kami Ely]_Affiliate_Videos_Merged.xlsx"
writer_video_aff = pd.ExcelWriter(os.path.join(DATA_SOURCES_MERGED, fn_video_aff), engine="openpyxl")
df_video_aff.to_excel(writer_video_aff, sheet_name="Affiliate_Video_4797_Clips", index=False)
format_excel_sheet(writer_video_aff.sheets["Affiliate_Video_4797_Clips"], title_color="0D7287")
export_and_copy(writer_video_aff, fn_video_aff, f"{len(df_video_aff):,} videos")

# -------------------------------------------------------------------------
# 6. GỘP LIVESTREAM KÊNH CHÍNH CHỦ (CREATOR LIVESTREAMS)
# -------------------------------------------------------------------------
print("\n6. Gộp Danh Sách Creator Livestreams (Kênh Chính Chủ)...")
query_cr_live = """
SELECT 
    start_time as `Thời Gian Bắt Đầu Live`,
    title as `Tiêu Đề Phiên Live`,
    duration_hours as `Thời Lượng (Giờ)`,
    main_category as `Danh Mục Ngành Hàng`,
    total_viewers as `Tổng Người Xem`,
    product_count as `Số Sản Phẩm Lên Kệ`,
    products_sold_count as `Số Sản Phẩm Phát Sinh Đơn`,
    sales_units as `Số Lượng Bán Thành Công (Sp)`,
    gmv_vnd as `Doanh Thu Phiên Live (VNĐ)`,
    uv_value as `Doanh Thu / Người Xem (UV)`
FROM kami_creator_livestreams
ORDER BY start_time DESC
"""
df_cr_live = pd.read_sql(query_cr_live, conn)

fn_cr_live = "[Kami Ely]_Creator_Livestreams_Merged.xlsx"
writer_cr_live = pd.ExcelWriter(os.path.join(DATA_SOURCES_MERGED, fn_cr_live), engine="openpyxl")
df_cr_live.to_excel(writer_cr_live, sheet_name="Creator_Live_600_Sessions", index=False)
format_excel_sheet(writer_cr_live.sheets["Creator_Live_600_Sessions"], title_color="0D7287")
export_and_copy(writer_cr_live, fn_cr_live, f"{len(df_cr_live):,} phiên live chính chủ")

# -------------------------------------------------------------------------
# 7. GỘP VIDEO KÊNH CHÍNH CHỦ (CREATOR VIDEOS)
# -------------------------------------------------------------------------
print("\n7. Gộp Danh Sách Creator Videos (Kênh Chính Chủ)...")
query_cr_vid = """
SELECT 
    publish_time as `Thời Gian Đăng Video`,
    title as `Tiêu Đề Video`,
    duration as `Thời Lượng`,
    video_type as `Loại Hình Video`,
    sales_units as `Số Lượng Bán (Sp)`,
    gmv_vnd as `Doanh Thu Chuyển Đổi (VNĐ)`,
    views as `Lượt Xem`,
    likes as `Lượt Thích`,
    interaction_rate as `Tỷ Lệ Tương Tác`
FROM kami_creator_videos
ORDER BY publish_time DESC
"""
df_cr_vid = pd.read_sql(query_cr_vid, conn)

fn_cr_vid = "[Kami Ely]_Creator_Videos_Merged.xlsx"
writer_cr_vid = pd.ExcelWriter(os.path.join(DATA_SOURCES_MERGED, fn_cr_vid), engine="openpyxl")
df_cr_vid.to_excel(writer_cr_vid, sheet_name="Creator_Video_276_Clips", index=False)
format_excel_sheet(writer_cr_vid.sheets["Creator_Video_276_Clips"], title_color="0D7287")
export_and_copy(writer_cr_vid, fn_cr_vid, f"{len(df_cr_vid):,} videos chính chủ")

# -------------------------------------------------------------------------
# 8. GỘP SẢN PHẨM BÁN HÀNG CỦA SHOP (CREATOR PRODUCTS SNAPSHOT)
# -------------------------------------------------------------------------
print("\n8. Gộp Danh Sách Creator Products (Snapshot 2 Kỳ)...")
query_cr_prod = """
SELECT 
    snapshot_period as `Kỳ Snapshot Dữ Liệu`,
    snapshot_date as `Ngày Chốt Dữ Liệu`,
    product_name as `Tên Sản Phẩm`,
    shop_name as `Tên Shop`,
    category as `Danh Mục Ngành Hàng`,
    price_raw as `Mức Giá Niêm Yết`,
    units_sold_raw as `Số Lượng Bán Trong Kỳ`,
    revenue_raw as `Doanh Thu Trong Kỳ`,
    commission_rate as `Tỷ Lệ Hoa Hồng`,
    upload_time as `Thời Điểm Niêm Yết`,
    shop_total_sales_raw as `Lượng Bán Toàn Shop`
FROM kami_creator_products
ORDER BY snapshot_period DESC, product_name ASC
"""
df_cr_prod = pd.read_sql(query_cr_prod, conn)

fn_cr_prod = "[Kami Ely]_Creator_Products_Merged.xlsx"
writer_cr_prod = pd.ExcelWriter(os.path.join(DATA_SOURCES_MERGED, fn_cr_prod), engine="openpyxl")
df_cr_prod.to_excel(writer_cr_prod, sheet_name="Creator_Products_787_Rows", index=False)
format_excel_sheet(writer_cr_prod.sheets["Creator_Products_787_Rows"], title_color="0D7287")
export_and_copy(writer_cr_prod, fn_cr_prod, f"{len(df_cr_prod):,} bản ghi")

# -------------------------------------------------------------------------
# 9. GỘP DANH MỤC SẢN PHẨM CỬA HÀNG (SHOP PRODUCTS CATALOG)
# -------------------------------------------------------------------------
print("\n9. Gộp Danh Mục Shop Products Catalog...")
query_shop_prod = """
SELECT 
    product_title as `Tên Sản Phẩm Bày Bán`,
    category as `Cây Danh Mục Chi Tiết`,
    region as `Khu Vực Phân Phối`,
    price_raw as `Giá Bán Niêm Yết`,
    launch_time as `Ngày Giờ Lên Sàn`,
    commission_rate as `Tỷ Lệ Hoa Hồng`,
    recent_sales_units as `Lượng Bán Gần Nhất (Sp)`,
    recent_revenue_vnd as `Doanh Thu Gần Nhất (VNĐ)`
FROM kami_shop_products
ORDER BY recent_revenue_vnd DESC
"""
df_shop_prod = pd.read_sql(query_shop_prod, conn)

fn_shop_prod = "[Kami Ely]_Shop_Products_Merged.xlsx"
writer_shop_prod = pd.ExcelWriter(os.path.join(DATA_SOURCES_MERGED, fn_shop_prod), engine="openpyxl")
df_shop_prod.to_excel(writer_shop_prod, sheet_name="Shop_Products_339_Items", index=False)
format_excel_sheet(writer_shop_prod.sheets["Shop_Products_339_Items"], title_color="0D7287")
export_and_copy(writer_shop_prod, fn_shop_prod, f"{len(df_shop_prod):,} sản phẩm")

# -------------------------------------------------------------------------
# 10. GỘP SẢN PHẨM GHIM TRONG LIVESTREAM (LIVESTREAM PRODUCTS)
# -------------------------------------------------------------------------
print("\n10. Gộp Danh Mục Sản Phẩm Ghim Live Stream...")
query_live_prod = """
SELECT 
    product_name as `Tên Sản Phẩm Ghim Live`,
    category as `Ngành Hàng`,
    price_raw as `Khoảng Giá Live`,
    region as `Khu Vực`,
    shop_name as `Tên Shop`,
    shop_total_units_sold as `Lượng Bán Toàn Shop`,
    live_units_sold as `Lượng Bán Trong Live`,
    live_revenue_vnd as `Doanh Thu Trực Tiếp Trong Live (VNĐ)`,
    commission_rate as `Tỷ Lệ Hoa Hồng`
FROM kami_livestream_products
ORDER BY live_revenue_vnd DESC
"""
df_live_prod = pd.read_sql(query_live_prod, conn)

fn_live_prod = "[Kami Ely]_Livestream_Products_Merged.xlsx"
writer_live_prod = pd.ExcelWriter(os.path.join(DATA_SOURCES_MERGED, fn_live_prod), engine="openpyxl")
df_live_prod.to_excel(writer_live_prod, sheet_name="Live_Products_103_Items", index=False)
format_excel_sheet(writer_live_prod.sheets["Live_Products_103_Items"], title_color="0D7287")
export_and_copy(writer_live_prod, fn_live_prod, f"{len(df_live_prod):,} sản phẩm ghim live")

conn.close()
print("\n=== HOÀN TẤT TOÀN BỘ 10 FILE EXCEL GỘP CHUẨN HÓA ===")
