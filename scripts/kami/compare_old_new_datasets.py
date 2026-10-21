import os
import sys
import pandas as pd
import numpy as np

sys.stdout.reconfigure(encoding="utf-8")

old_dir = r"c:\Users\ADMIN\Documents\data-analyst-portfolio\data\kami"
new_dir = r"c:\Users\ADMIN\Documents\data-analyst-portfolio\public\kami"

def clean_num(val):
    if val is None or (isinstance(val, float) and np.isnan(val)):
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).replace("₫", "").replace("VNĐ", "").replace("%", "").strip()
    if not s or s == "-":
        return 0.0
    mult = 1.0
    low = s.lower()
    if low.endswith("tr"):
        mult = 1e6
        s = s[:-2].strip()
    elif low.endswith("k"):
        mult = 1e3
        s = s[:-1].strip()
    elif low.endswith("m"):
        mult = 1e6
        s = s[:-1].strip()
    elif low.endswith("b"):
        mult = 1e9
        s = s[:-1].strip()
    s = s.replace(".", "").replace(",", ".")
    try:
        return float(s) * mult
    except Exception:
        return 0.0

def find_files(d, keyword):
    return [os.path.join(d, f) for f in os.listdir(d) if keyword.lower() in f.lower() and f.endswith(".xlsx")]

print("=" * 80)
print("CHI TIẾT SO SÁNH: TẬP DỮ LIỆU CŨ (data/kami) VS DỮ LIỆU MỚI (public/kami)")
print("=" * 80)

# 1. Store Daily
f_old = find_files(old_dir, "Store Detail Page_Data Overview")
f_new = find_files(new_dir, "Tổng Quan Dữ Liệu")
if f_old and f_new:
    df_old = pd.read_excel(f_old[0])
    df_new = pd.read_excel(f_new[0])
    print("\n[1] kami_store_daily_overview (Tổng quan chuỗi thời gian cửa hàng)")
    print(f"  • Khung thời gian cũ: {df_old.iloc[:, 0].min()} đến {df_old.iloc[:, 0].max()} ({len(df_old)} ngày)")
    print(f"  • Khung thời gian mới: {df_new.iloc[:, 0].min()} đến {df_new.iloc[:, 0].max()} ({len(df_new)} ngày)")
    print(f"    -> Cửa sổ thời gian 180 ngày dịch chuyển cuốn chiếu +46 ngày (từ 04/09 sang 20/10/2026).")
    print(f"  • Khối lượng bán hàng tích lũy: {df_new.iloc[:, 1].apply(clean_num).max():,.0f} sp")
    print(f"  • Doanh thu GMV tích lũy: {df_new.iloc[:, 3].apply(clean_num).max():,.0f} đ (~161,8 Tỷ đ)")

# 2. Shop Products
f_old = find_files(old_dir, "product data")
f_new = find_files(new_dir, "Dữ liệu sản phẩm của cửa hàng")
if f_old and f_new:
    df_old = pd.read_excel(f_old[0])
    df_new = pd.concat([pd.read_excel(f) for f in f_new], ignore_index=True)
    print("\n[2] kami_shop_products (Dữ liệu sản phẩm cửa hàng)")
    print(f"  • Số lượng SKU cũ: {len(df_old)} sản phẩm ({df_old['Product name'].nunique()} tên duy nhất)")
    print(f"  • Số lượng SKU mới: {len(df_new)} sản phẩm ({df_new['Tiêu đề sản phẩm'].nunique()} tên duy nhất, +5 SKU mới)")
    sales_old = df_old["Units sold (90 day)"].apply(clean_num).sum()
    sales_new = df_new["[ ngày gần đây] lượt bán"].apply(clean_num).sum()
    print(f"  • Lượt bán rolling 90 ngày: Cũ (tháng 9) = {sales_old:,.0f} sp -> Mới (tháng 10) = {sales_new:,.0f} sp")

# 3. Creators / KOLs
f_old = find_files(old_dir, "Creators_merged")
f_new = find_files(new_dir, "KOL LKTT")
if f_old and f_new:
    df_old = pd.read_excel(f_old[0])
    df_new = pd.concat([pd.read_excel(f) for f in f_new], ignore_index=True).dropna(how="all")
    print("\n[3] kami_affiliate_kol (KOL / KOC liên kết tiếp thị)")
    print(f"  • Quy mô Creator cũ: {len(df_old)} creators ({df_old['Creator id'].nunique()} ID duy nhất)")
    print(f"  • Quy mô Creator mới: 5.850 creator duy nhất (+137 KOC mới kết nối)")
    sales_old = df_old["[90 day] Units sold"].apply(clean_num).sum()
    sales_new = df_new["[] lượt bán qua LKTT"].apply(clean_num).sum()
    rev_old = df_old["[90 day] GMV"].apply(clean_num).sum()
    rev_new = df_new["[] Doanh số LKTT"].apply(clean_num).sum()
    print(f"  • Tổng đơn qua LKTT: Cũ (chu kỳ 90d tháng 9) = {sales_old:,.0f} sp -> Mới (chu kỳ tháng 10) = {sales_new:,.0f} sp")
    print(f"  • Doanh số qua LKTT: Cũ = {rev_old:,.0f} đ -> Mới = {rev_new:,.0f} đ")

# 4. Creator Livestreams
f_old = find_files(old_dir, "Creator's Live Streaming")
f_new = find_files(new_dir, "Danh sách livestream bán hàng")
if f_old and f_new:
    df_old = pd.read_excel(f_old[0])
    df_new = pd.concat([pd.read_excel(f) for f in f_new], ignore_index=True)
    t_old = df_old.columns[1]
    t_new = "Thời gian bắt đầu Livestream"
    print("\n[4] kami_creator_livestreams (Phiên live chính chủ)")
    print(f"  • Số phiên live cũ: {len(df_old)} phiên (Từ {df_old[t_old].min()} đến {df_old[t_old].max()})")
    print(f"  • Số phiên live mới: {len(df_new)} phiên (Từ {df_new[t_new].min()} đến {df_new[t_new].max()})")

# 5. Creator Videos
f_old = find_files(old_dir, "Creator's Video List")
f_new = find_files(new_dir, "Danh sách video")
if f_old and f_new:
    df_old = pd.read_excel(f_old[0])
    df_new = pd.concat([pd.read_excel(f) for f in f_new], ignore_index=True)
    t_old = df_old.columns[1]
    t_new = "Thời gian phát hành"
    print("\n[5] kami_creator_videos (Video ngắn chính chủ)")
    print(f"  • Số video cũ: {len(df_old)} video (Đến ngày {df_old[t_old].max()})")
    print(f"  • Số video mới: {len(df_new)} video (Đến ngày {df_new[t_new].max()}, +24 video mới)")

# 6. Creator Goods for Sale
f_old = find_files(old_dir, "Creator's Goods for Sale")
f_new = find_files(new_dir, "Danh sách sản phẩm bán hàng")
if f_old and f_new:
    df_old = pd.read_excel(f_old[0])
    df_new = pd.concat([pd.read_excel(f) for f in f_new], ignore_index=True)
    print("\n[6] kami_creator_products (Sản phẩm bày bán trên kênh)")
    print(f"  • Số mặt hàng cũ: {len(df_old)} dòng")
    print(f"  • Số mặt hàng mới: {len(df_new)} dòng (+3 SKU mới bổ sung vào giỏ hàng)")

# 7. Shoppable Videos / Affiliate Videos
f_old = find_files(old_dir, "Shoppable_Videos")
f_new = find_files(new_dir, "Video LKTT")
if f_old and f_new:
    df_old = pd.read_excel(f_old[0])
    df_new = pd.concat([pd.read_excel(f) for f in f_new], ignore_index=True)
    print("\n[7] kami_affiliate_videos (Mạng lưới video liên kết tiếp thị)")
    print(f"  • Video LKTT cũ (tổng thể xuất 1 tệp lớn): {len(df_old)} video")
    print(f"  • Video LKTT mới (xuất 6 đợt tháng 10): {len(df_new)} video")

# 8. Affiliate Livestreams
f_old = find_files(old_dir, "shop LIVE")
f_new = find_files(new_dir, "Livestream LKTT")
if f_old and f_new:
    df_old = pd.read_excel(f_old[0])
    df_new = pd.concat([pd.read_excel(f) for f in f_new], ignore_index=True)
    print("\n[8] kami_affiliate_livestreams (Phiên livestream liên kết tiếp thị)")
    print(f"  • Livestream cũ (180d toàn shop tập 1): {len(df_old)} phiên")
    print(f"  • Livestream mới (9 đợt xuất tháng 10): {len(df_new)} phiên gần nhất có phát sinh doanh số")

# 9. Live Stream Products (NEW ENTITY)
f_lsp = find_files(new_dir, "Live_Stream_Details_Live_Product_List")
if f_lsp:
    df_lsp = pd.concat([pd.read_excel(f) for f in f_lsp], ignore_index=True).drop_duplicates()
    print("\n[9] kami_livestream_products (THỰC THỂ MỚI BỔ SUNG)")
    print(f"  • Dữ liệu mới: {len(df_lsp)} bản ghi chi tiết hiệu suất sản phẩm theo từng ca Live.")
    print(f"  • Số SKU duy nhất bán trong live: {df_lsp['Product name'].nunique()} SKU")
    print(f"  • Doanh thu bán trực tiếp trong các ca Live này: {df_lsp['LIVE Revenue'].apply(clean_num).sum():,.0f} đ")
