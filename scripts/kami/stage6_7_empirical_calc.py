import os
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')
import hashlib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from scipy import stats

DATA_DIR = r"data\kami"
files = os.listdir(DATA_DIR)

f_shop_live = [f for f in files if "_shop LIVE" in f][0]
f_cr_live = [f for f in files if "Creator's Live Streaming" in f][0]
f_shoppable = [f for f in files if "Shoppable_Videos" in f][0]
f_cr_video = [f for f in files if "Creator's Video List" in f][0]
f_creators = [f for f in files if "Creators_merged" in f][0]
f_store = [f for f in files if "Store Detail Page" in f and f.endswith(".xlsx")][0]
f_product = [f for f in files if "product data" in f][0]
f_goods = [f for f in files if "Creator's Goods for Sale" in f][0]

print("======================================================================")
print("KIỂM TRA THỰC CHỨNG CHO MỤC 6 (VĂN BẢN & BẤT THƯỜNG) VÀ MỤC 7 (ETL & PII)")
print("======================================================================\n")

# --- 1. KIỂM TRA TÊN SHEET TRONG TẤT CẢ 8 FILE ---
print("--- 1. TÊN SHEET TRONG 8 FILE NGUỒN ---")
all_8_files = [f_store, f_product, f_creators, f_goods, f_cr_live, f_shop_live, f_cr_video, f_shoppable]
for fname in all_8_files:
    fpath = os.path.join(DATA_DIR, fname)
    # Get sheet names using openpyxl
    import openpyxl
    wb = openpyxl.load_workbook(fpath, read_only=True)
    sheets = wb.sheetnames
    wb.close()
    sha256 = hashlib.sha256(open(fpath, 'rb').read()).hexdigest()[:10]
    print(f"File: {fname[:35]}... | Sheets: {sheets} | SHA256[:10]: {sha256}")

# --- Load dataframes ---
df_store = pd.read_excel(os.path.join(DATA_DIR, f_store))
df_product = pd.read_excel(os.path.join(DATA_DIR, f_product))
df_creators = pd.read_excel(os.path.join(DATA_DIR, f_creators))
df_goods = pd.read_excel(os.path.join(DATA_DIR, f_goods))
df_cr_live = pd.read_excel(os.path.join(DATA_DIR, f_cr_live))
df_shop_live = pd.read_excel(os.path.join(DATA_DIR, f_shop_live))
df_cr_video = pd.read_excel(os.path.join(DATA_DIR, f_cr_video))
df_shoppable = pd.read_excel(os.path.join(DATA_DIR, f_shoppable))

def clean_num(val):
    if pd.isna(val): return 0.0
    if isinstance(val, (int, float)): return float(val)
    s = str(val).strip().replace(',', '').replace('₫', '').replace('VNĐ', '').replace('VND', '').replace(' ', '')
    try: return float(s)
    except: return 0.0

def parse_views(v):
    if pd.isna(v): return 0.0
    s = str(v).strip().lower()
    if 'k' in s: return float(s.replace('k', '')) * 1000
    if 'm' in s: return float(s.replace('m', '')) * 1000000
    try: return float(s.replace(',', ''))
    except: return 0.0

# --- 2. MỤC 6.2: PHÂN TÍCH VĂN BẢN (SHOPPABLE VIDEOS & SHOP LIVE) ---
print("\n--- 2. VĂN BẢN: TIÊU ĐỀ THIẾU & PHÂN LOẠI NHÓM HÀNG ---")
print("Shoppable total rows:", len(df_shoppable))
shoppable_missing_title = df_shoppable['video title'].isna().sum() + (df_shoppable['video title'].astype(str).str.strip() == '').sum()
print(f"Shoppable missing video title: {shoppable_missing_title} ({shoppable_missing_title / len(df_shoppable) * 100:.2f}%)")

print("Shop LIVE total rows:", len(df_shop_live))
shop_live_missing_title = df_shop_live['LIVE title'].isna().sum() + (df_shop_live['LIVE title'].astype(str).str.strip() == '').sum()
print(f"Shop LIVE missing title: {shop_live_missing_title} ({shop_live_missing_title / len(df_shop_live) * 100:.2f}%)")

# Default platform titles in Shop LIVE
live_titles = df_shop_live['LIVE title'].fillna('').astype(str).str.strip()
welcome_live = live_titles.str.contains('Chào mừng bạn đến với phiên LIVE|Chào mừng bạn đến phiên LIVE', case=False).sum()
new_event_live = live_titles.str.contains('Sự kiện mới', case=False).sum()
print(f"Shop LIVE default title 'Chào mừng': {welcome_live} | 'Sự kiện mới': {new_event_live}")

# Country distribution in Shoppable
print("\nShoppable country distribution:")
print(df_shoppable['country'].value_counts(dropna=False))

# Category classification on Shoppable video titles
df_shoppable['gmv_clean'] = df_shoppable['[90 days]GMV'].apply(clean_num)
df_shoppable['has_orders'] = (df_shoppable['gmv_clean'] > 0).astype(int)

titles_shoppable = df_shoppable['video title'].fillna('').astype(str).str.lower()

# Regex rules (Round 1 & Round 2)
is_bikini = titles_shoppable.str.contains(r'bikini|đồ bơi|do boi|monokini|swimwear|áo tắm|ao tam', case=False)
is_vay = titles_shoppable.str.contains(r'váy|vay|đầm|dam|chân váy|chan vay|skirt|dress', case=False) & ~is_bikini
is_quan = titles_shoppable.str.contains(r'quần|quan|pants|short|quần gió|quan gio', case=False) & ~is_bikini & ~is_vay
is_ao = titles_shoppable.str.contains(r'áo|ao|croptop|crop top|shirt|t-shirt|sơ mi|so mi', case=False) & ~is_bikini & ~is_vay & ~is_quan
is_set = titles_shoppable.str.contains(r'set|bộ|bo', case=False) & ~is_bikini & ~is_vay & ~is_quan & ~is_ao

def classify_cat(row):
    t = str(row['video title']).lower()
    if re.search(r'bikini|đồ bơi|do boi|monokini|swimwear|áo tắm|ao tam', t):
        return 'Bikini / Đồ bơi'
    elif re.search(r'váy|vay|đầm|dam|chân váy|chan vay|skirt|dress', t):
        return 'Váy / Đầm'
    elif re.search(r'quần|quan|pants|short|quần gió|quan gio', t):
        return 'Quần / Quần gió'
    elif re.search(r'áo|ao|croptop|crop top|shirt|t-shirt|sơ mi|so mi', t):
        return 'Áo / Croptop'
    elif re.search(r'set|bộ|bo', t):
        return 'Set trang phục'
    else:
        return 'Khác / Chưa phân loại'

df_shoppable['category_label'] = df_shoppable.apply(classify_cat, axis=1)

cat_agg = df_shoppable.groupby('category_label').agg(
    n=('gmv_clean', 'count'),
    with_orders=('has_orders', 'sum'),
    tot_gmv=('gmv_clean', 'sum')
).reset_index()
cat_agg['order_rate_pct'] = cat_agg['with_orders'] / cat_agg['n'] * 100
cat_agg['gmv_share_pct'] = cat_agg['tot_gmv'] / df_shoppable['gmv_clean'].sum() * 100
print("\nVideo Category Classification (Shoppable Videos):")
print(cat_agg.sort_values(by='n', ascending=False))

# --- HASHTAG ANALYSIS ---
hashtags_all = []
for t in df_shoppable['video title'].dropna():
    found = re.findall(r'#(\w+)', str(t).lower())
    hashtags_all.extend(found)

from collections import Counter
tag_counts = Counter(hashtags_all)
print("\nTop 15 Hashtags in Shoppable Videos:")
for tag, count in tag_counts.most_common(15):
    print(f"  #{tag}: {count}")

# Compare conversion between videos with product-specific hashtags vs general-only hashtags
def tag_type(t):
    tags = re.findall(r'#(\w+)', str(t).lower())
    if not tags:
        return '0 tag'
    has_product = any(tag in ['bikini', 'dodibien', 'chanvay', 'vay', 'quangio', 'swimming', 'swimwear'] for tag in tags)
    if has_product:
        return 'Hashtag sản phẩm'
    else:
        return 'Hashtag chung chung'

df_shoppable['tag_group'] = df_shoppable['video title'].apply(tag_type)
tag_agg = df_shoppable.groupby('tag_group').agg(
    n=('has_orders', 'count'),
    with_orders=('has_orders', 'sum'),
    tot_gmv=('gmv_clean', 'sum')
).reset_index()
tag_agg['order_rate_pct'] = tag_agg['with_orders'] / tag_agg['n'] * 100
print("\nHashtag Group Performance:")
print(tag_agg)

# --- 3. MỤC 6.3: PHÂN TÍCH BẤT THƯỜNG (ANOMALIES) ---
print("\n--- 3. PHÂN TÍCH BẤT THƯỜNG (Z-SCORE, MAD, CỬA SỔ TRƯỢT 28 NGÀY) ---")
df_store['gmv'] = df_store['Sales Amount Increment'].apply(clean_num)
df_store['date'] = pd.to_datetime(df_store['Date'])
df_store = df_store.sort_values('date').reset_index(drop=True)

# Global Z-score
mu = df_store['gmv'].mean()
sigma = df_store['gmv'].std()
df_store['z_global'] = (df_store['gmv'] - mu) / sigma

# Robust Z-score via MAD
med = df_store['gmv'].median()
mad = np.median(np.abs(df_store['gmv'] - med))
df_store['z_mad'] = 0.6745 * (df_store['gmv'] - med) / mad

# Rolling 28-day Z-score (14 preceding, 13 following)
roll_mean = df_store['gmv'].rolling(window=28, center=True, min_periods=7).mean()
roll_std = df_store['gmv'].rolling(window=28, center=True, min_periods=7).std()
df_store['z_rolling28'] = (df_store['gmv'] - roll_mean) / roll_std

print("Top 5 dates by Global Z-score:")
print(df_store.sort_values(by='z_global', ascending=False)[['Date', 'gmv', 'z_global', 'z_mad', 'z_rolling28']].head(5))

print("\nDays with |z_global| > 2:", (df_store['z_global'].abs() > 2).sum())
print("Days with |z_global| > 3:", (df_store['z_global'].abs() > 3).sum())
print("Days with |z_rolling28| > 2.5:", (df_store['z_rolling28'].abs() > 2.5).sum())

# Examine 16/06 and 19/06 in Shop LIVE
df_shop_live['gmv_clean'] = df_shop_live['GMV'].apply(clean_num)
df_shop_live['start_dt'] = pd.to_datetime(df_shop_live['LIVE start time'].str.split('(').str[0].str.strip())
df_shop_live['start_vn'] = df_shop_live['start_dt'] + timedelta(hours=13) # Shift +13h if needed, check format
df_shop_live['date_vn'] = df_shop_live['start_vn'].dt.strftime('%Y-%m-%d')
# Also check date without shift
df_shop_live['date_raw'] = df_shop_live['start_dt'].dt.strftime('%Y-%m-%d')

print("\nExamine 16/06/2026 in Shop LIVE (by start_dt):")
live_jun16 = df_shop_live[df_shop_live['date_raw'] == '2026-06-16']
own_jun16 = live_jun16[live_jun16['creator id'].astype(str).str.strip().str.lower() == 'kamielyhn']
aff_jun16 = live_jun16[live_jun16['creator id'].astype(str).str.strip().str.lower() != 'kamielyhn']
print(f"Jun 16 Sessions: Own={len(own_jun16)} (GMV={own_jun16['gmv_clean'].sum():,.0f} đ), Affiliate={len(aff_jun16)} (GMV={aff_jun16['gmv_clean'].sum():,.0f} đ)")

# Creator anomalies: Girl Style
is_gs = df_shop_live['creator id'].astype(str).str.strip().str.lower() == 'girlstyle.vn'
df_gs = df_shop_live[is_gs]
print(f"\nGirl Style in Shop LIVE: Sessions = {len(df_gs)}, Total GMV = {df_gs['gmv_clean'].sum():,.0f} đ, Mean GMV/session = {df_gs['gmv_clean'].mean():,.0f} đ")

# Winsorizing at P99 for creator GMV/session
# Group by creator
cr_live_perf = df_shop_live.groupby('creator id').agg(
    sessions=('gmv_clean', 'count'),
    tot_gmv=('gmv_clean', 'sum')
).reset_index()
cr_live_perf['gmv_per_session'] = cr_live_perf['tot_gmv'] / cr_live_perf['sessions']

p99_cr = cr_live_perf['gmv_per_session'].quantile(0.99)
p95_cr = cr_live_perf['gmv_per_session'].quantile(0.95)
print(f"Creator GMV/session: Mean = {cr_live_perf['gmv_per_session'].mean():,.0f} đ | Median = {cr_live_perf['gmv_per_session'].median():,.0f} đ | P95 = {p95_cr:,.0f} đ | P99 = {p99_cr:,.0f} đ")

# Winsorized mean at P99
winsorized_vals = cr_live_perf['gmv_per_session'].clip(upper=p99_cr)
print(f"Winsorized Mean at P99: {winsorized_vals.mean():,.0f} đ")

# Quality anomalies: Live duration > 24 hours
durs_hours = df_shop_live['LIVE duration'].astype(float)
long_sessions = df_shop_live[durs_hours > 24.0]
zero_sessions = df_shop_live[durs_hours == 0.0]
print(f"\nLive Sessions > 24 hours: {len(long_sessions)} sessions | Max duration: {durs_hours.max():.1f} hours | Total GMV: {long_sessions['gmv_clean'].sum():,.0f} đ")
print(f"Live Sessions duration == 0: {len(zero_sessions)} sessions")
print("Top creators with >24h sessions:\n", long_sessions['creator id'].value_counts())

# --- 4. MỤC 7.3: PII AUDIT VÀ SỐ ĐIỆN THOẠI / EMAIL TRONG VĂN BẢN ---
print("\n--- 4. PII AUDIT: SĐT VÀ EMAIL TRONG TIÊU ĐỀ VIDEO VÀ LIVE ---")
phone_pattern = r'(?:\+84|0)(?:\d[\s\.]?){8,10}\d'
email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'

titles_vid_str = df_shoppable['video title'].dropna().astype(str)
phones_vid = [t for t in titles_vid_str if re.search(phone_pattern, t)]
emails_vid = [t for t in titles_vid_str if re.search(email_pattern, t)]
print(f"Shoppable Video Titles with Phone match: {len(phones_vid)}")
for p in phones_vid[:3]:
    print(f"  Matched text: {p[:60]}")
print(f"Shoppable Video Titles with Email match: {len(emails_vid)}")

titles_live_str = df_shop_live['LIVE title'].dropna().astype(str)
phones_live = [t for t in titles_live_str if re.search(phone_pattern, t)]
emails_live = [t for t in titles_live_str if re.search(email_pattern, t)]
print(f"Shop LIVE Titles with Phone match: {len(phones_live)} | Email match: {len(emails_live)}")

# Check Creator Goods for Sale and Creators Merged product match
print("\n--- Creator Goods for Sale (90d) Units check ---")
goods_units = df_goods['[90 days] Units sold'].apply(clean_num).sum()
print(f"Goods for Sale total units: {goods_units:,.0f}")

print("\n=== HOÀN TẤT TÍNH TOÁN THỰC CHỨNG MỤC 6 VÀ MỤC 7 ===")
