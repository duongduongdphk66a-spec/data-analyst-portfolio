import os
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')
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

df_shop_live = pd.read_excel(os.path.join(DATA_DIR, f_shop_live))
df_cr_live = pd.read_excel(os.path.join(DATA_DIR, f_cr_live))
df_shoppable = pd.read_excel(os.path.join(DATA_DIR, f_shoppable))
df_cr_video = pd.read_excel(os.path.join(DATA_DIR, f_cr_video))
df_creators = pd.read_excel(os.path.join(DATA_DIR, f_creators))
df_store = pd.read_excel(os.path.join(DATA_DIR, f_store))
df_product = pd.read_excel(os.path.join(DATA_DIR, f_product))

print("======================================================================")
print("MỤC 5: PHỄU, GIỎ HÀNG VÀ SO SÁNH QUẢNG CÁO VỚI ORGANIC (TÍNH TOÁN THỰC CHỨNG)")
print("======================================================================\n")

# ======================================================================
# 5.3.A. PHỄU LIVE (SHOP LIVE & CREATOR LIVE LIST)
# ======================================================================
print("--- 5.3.A. PHỄU LIVE ---")

# Clean currency and numbers in Shop LIVE
def clean_num(val):
    if pd.isna(val):
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip().replace(',', '').replace('₫', '').replace('VNĐ', '').replace('VND', '').replace(' ', '')
    try:
        return float(s)
    except:
        return 0.0

df_shop_live['gmv_clean'] = df_shop_live['GMV'].apply(clean_num)
df_shop_live['units_clean'] = df_shop_live['units sold'].apply(clean_num)
df_shop_live['cum_clean'] = df_shop_live['cumulative'].apply(clean_num)

# Split Shop LIVE into Own-brand and Affiliate
is_own_live = df_shop_live['creator id'].astype(str).str.strip().str.lower() == 'kamielyhn'
df_live_own = df_shop_live[is_own_live].copy()
df_live_aff = df_shop_live[~is_own_live].copy()

print(f"Shop LIVE Total Sessions: {len(df_shop_live)}")
print(f"Own-brand Sessions (Shop LIVE): {len(df_live_own)} | With GMV>0: {(df_live_own['gmv_clean'] > 0).sum()} ({((df_live_own['gmv_clean'] > 0).sum()/len(df_live_own)*100):.2f}%)")
print(f"Affiliate Sessions (Shop LIVE): {len(df_live_aff)} | With GMV>0: {(df_live_aff['gmv_clean'] > 0).sum()} ({((df_live_aff['gmv_clean'] > 0).sum()/len(df_live_aff)*100):.2f}%)")

own_live_gmv = df_live_own['gmv_clean'].sum()
aff_live_gmv = df_live_aff['gmv_clean'].sum()
own_live_views = df_live_own['cum_clean'].sum()
aff_live_views = df_live_aff['cum_clean'].sum()

print(f"Own-brand Live GMV: {own_live_gmv:,.0f} đ ({own_live_gmv/1e9:.2f}B) | Viewers: {own_live_views:,.0f}")
print(f"Affiliate Live GMV: {aff_live_gmv:,.0f} đ ({aff_live_gmv/1e9:.2f}B) | Viewers: {aff_live_views:,.0f}")
print(f"GMV / Viewer: Own = {own_live_gmv / own_live_views:.1f} đ/viewer | Affiliate = {aff_live_gmv / aff_live_views:.1f} đ/viewer")
print(f"Ratio Own / Affiliate GMV per viewer: {(own_live_gmv / own_live_views) / (aff_live_gmv / aff_live_views):.1f}x")
print(f"Affiliate share of Live Viewers: {aff_live_views / (own_live_views + aff_live_views) * 100:.1f}%")
print(f"Affiliate share of Live GMV: {aff_live_gmv / (own_live_gmv + aff_live_gmv) * 100:.1f}%")

# Creator Live List (Official own-brand detailed live report)
print("\n--- Creator Live List (475 rows) ---")
df_cr_live['gmv_clean'] = df_cr_live['Live GMV'].apply(clean_num)
df_cr_live['viewers_clean'] = df_cr_live['Total Viewers'].apply(clean_num)
df_cr_live['promoted_clean'] = df_cr_live['Promoted Products'].apply(clean_num)
df_cr_live['sold_prods_clean'] = df_cr_live['No.of Products Sold'].apply(clean_num)
df_cr_live['units_clean'] = df_cr_live['LIVE Units Sold'].apply(clean_num)

tot_promoted = df_cr_live['promoted_clean'].sum()
tot_sold_prods = df_cr_live['sold_prods_clean'].sum()
print(f"Total Promoted Products: {tot_promoted:,.0f}")
print(f"Total Products Sold: {tot_sold_prods:,.0f} ({tot_sold_prods / tot_promoted * 100:.2f}%)")

# Median ratio per session
session_ratios = (df_cr_live['sold_prods_clean'] / df_cr_live['promoted_clean'].replace(0, np.nan)).dropna()
print(f"Median Products Sold / Promoted per session: {session_ratios.median()*100:.1f}%")

# Spearman correlation of promoted products with GMV
spear_corr, spear_p = stats.spearmanr(df_cr_live['promoted_clean'], df_cr_live['gmv_clean'])
print(f"Spearman corr (Promoted Products vs Live GMV): {spear_corr:.4f} (p = {spear_p:.2e})")

# Monthly breakdown of Creator Live List (UTC+7 shifted)
# Start Time in Creator Live List is UTC-something, let's parse and add 13h
def parse_time_add13(val):
    if pd.isna(val):
        return None
    # Usually format 'YYYY-MM-DD HH:MM:SS'
    s = str(val).split('(')[0].strip()
    try:
        dt = pd.to_datetime(s)
        return dt + timedelta(hours=13)
    except:
        return None

df_cr_live['start_ts_vn'] = df_cr_live['Start Time'].apply(parse_time_add13)
df_cr_live['ym'] = df_cr_live['start_ts_vn'].dt.strftime('%Y-%m')

monthly_cr_live = df_cr_live.groupby('ym').agg(
    sessions=('gmv_clean', 'count'),
    with_orders=('gmv_clean', lambda s: (s > 0).sum()),
    tot_viewers=('viewers_clean', 'sum'),
    tot_units=('units_clean', 'sum'),
    tot_gmv=('gmv_clean', 'sum')
).reset_index()

monthly_cr_live['viewers_per_session'] = monthly_cr_live['tot_viewers'] / monthly_cr_live['sessions']
monthly_cr_live['units_per_1k_views'] = monthly_cr_live['tot_units'] / monthly_cr_live['tot_viewers'] * 1000
monthly_cr_live['gmv_per_view'] = monthly_cr_live['tot_gmv'] / monthly_cr_live['tot_viewers']
monthly_cr_live['order_rate'] = monthly_cr_live['with_orders'] / monthly_cr_live['sessions'] * 100

print("\nOwn-brand Live Monthly Funnel (Creator Live List +13h):")
for idx, r in monthly_cr_live.iterrows():
    print(f"  {r['ym']}: {r['sessions']} sessions | {r['order_rate']:.1f}% order rate | Avg Viewers/ses: {r['viewers_per_session']:,.0f} | Units/1k views: {r['units_per_1k_views']:.1f} | GMV/view: {r['gmv_per_view']:,.0f} đ | Tot GMV: {r['tot_gmv']/1e6:.1f}M")


# ======================================================================
# 5.3.B. PHỄU VIDEO (SHOPPABLE & CREATOR VIDEO LIST)
# ======================================================================
print("\n--- 5.3.B. PHỄU VIDEO ---")
# Clean Shoppable videos
df_shoppable['gmv_clean'] = df_shoppable['[90 days]GMV'].apply(clean_num)
df_shoppable['units_clean'] = df_shoppable['[ 90 days]Units sold'].apply(clean_num)
df_shoppable['likes_clean'] = df_shoppable['[ 90 days]Likes'].apply(clean_num)

def parse_views(v):
    if pd.isna(v):
        return 0.0
    s = str(v).strip().lower()
    if 'k' in s:
        return float(s.replace('k', '')) * 1000
    if 'm' in s:
        return float(s.replace('m', '')) * 1000000
    try:
        return float(s.replace(',', ''))
    except:
        return 0.0

df_shoppable['views_clean'] = df_shoppable['Views'].apply(parse_views)

total_shoppable = len(df_shoppable)
shoppable_with_gmv = (df_shoppable['gmv_clean'] > 0).sum()
print(f"Shoppable Videos Total: {total_shoppable} | With GMV>0: {shoppable_with_gmv} ({shoppable_with_gmv / total_shoppable * 100:.2f}%)")

# Top 10 Shoppable videos GMV share
top10_shoppable_gmv = df_shoppable.sort_values(by='gmv_clean', ascending=False).head(10)['gmv_clean'].sum()
tot_shoppable_gmv = df_shoppable['gmv_clean'].sum()
print(f"Top 10 Shoppable Videos GMV: {top10_shoppable_gmv:,.0f} đ / {tot_shoppable_gmv:,.0f} đ ({top10_shoppable_gmv / tot_shoppable_gmv * 100:.2f}%)")

# Creator Video List (Own-brand)
print("\n--- Creator Video List (Own-brand, 222 rows) ---")
print("Columns:", df_cr_video.columns.tolist()[:8])
print("Video Type unique:", df_cr_video['Video Type'].value_counts().to_dict())

df_cr_video['gmv_clean'] = df_cr_video['Video GMV'].apply(clean_num)
df_cr_video['units_clean'] = df_cr_video['Units Sold'].apply(clean_num)
df_cr_video['views_clean'] = df_cr_video['Views'].apply(parse_views)

# Split by Video Type
video_type_agg = df_cr_video.groupby('Video Type').agg(
    n=('gmv_clean', 'count'),
    with_orders=('gmv_clean', lambda s: (s > 0).sum()),
    tot_gmv=('gmv_clean', 'sum'),
    tot_units=('units_clean', 'sum'),
    tot_views=('views_clean', 'sum')
).reset_index()
video_type_agg['order_pct'] = video_type_agg['with_orders'] / video_type_agg['n'] * 100
print(video_type_agg)

# Video Duration breakdown
# Convert duration string to seconds, e.g., '00:15', '00:00:15', or float
def parse_duration_sec(d):
    if pd.isna(d):
        return 0
    s = str(d).strip()
    parts = s.split(':')
    try:
        if len(parts) == 3:
            return int(parts[0])*3600 + int(parts[1])*60 + int(parts[2])
        elif len(parts) == 2:
            return int(parts[0])*60 + int(parts[1])
        elif len(parts) == 1:
            return float(parts[0])
    except:
        return 0
    return 0

df_cr_video['duration_sec'] = df_cr_video['Video Duration'].apply(parse_duration_sec)

def duration_tier(sec):
    if sec <= 15:
        return '<=15s'
    elif sec <= 30:
        return '15-30s'
    else:
        return '>30s'

df_cr_video['dur_tier'] = df_cr_video['duration_sec'].apply(duration_tier)

dur_agg = df_cr_video.groupby('dur_tier').agg(
    n=('gmv_clean', 'count'),
    with_orders=('gmv_clean', lambda s: (s > 0).sum()),
    tot_gmv=('gmv_clean', 'sum')
).reset_index()
dur_agg['order_pct'] = dur_agg['with_orders'] / dur_agg['n'] * 100
print("\nVideo Duration Breakdown (Own-brand):")
print(dur_agg)


# ======================================================================
# 5.3.D. SO SÁNH VIDEO VÀ LIVE
# ======================================================================
print("\n--- 5.3.D. VIDEO SO VỚI LIVE ---")
own_video_gmv = df_cr_video['gmv_clean'].sum()
print(f"Own-brand Live GMV: {own_live_gmv:,.0f} đ ({own_live_gmv/(own_live_gmv+own_video_gmv)*100:.1f}%)")
print(f"Own-brand Video GMV: {own_video_gmv:,.0f} đ ({own_video_gmv/(own_live_gmv+own_video_gmv)*100:.1f}%)")

aff_video_gmv = tot_shoppable_gmv
print(f"Affiliate Live GMV (180d): {aff_live_gmv:,.0f} đ")
print(f"Affiliate Shoppable Video GMV (90d window): {aff_video_gmv:,.0f} đ")

# Inspect Creators Merged GPM columns
print("\nCreators Merged GPM columns:")
print(df_creators[['LIVE GPM', 'Video GPM']].head(10))
print("LIVE GPM non-null count:", df_creators['LIVE GPM'].dropna().count())
print("Video GPM non-null count:", df_creators['Video GPM'].dropna().count())


# ======================================================================
# 5.3.E. QUẢNG CÁO SO VỚI ORGANIC (SHOPPABLE VIDEOS)
# ======================================================================
print("\n--- 5.3.E. ADS SO VỚI ORGANIC TRÊN SHOPPABLE VIDEOS ---")

ads_groups = df_shoppable.groupby('ads').agg(
    n=('gmv_clean', 'count'),
    with_orders=('gmv_clean', lambda s: (s > 0).sum()),
    tot_views=('views_clean', 'sum'),
    median_views=('views_clean', 'median'),
    mean_views=('views_clean', 'mean'),
    p25_views=('views_clean', lambda s: s.quantile(0.25)),
    p75_views=('views_clean', lambda s: s.quantile(0.75)),
    tot_gmv=('gmv_clean', 'sum'),
    median_gmv=('gmv_clean', 'median'),
    mean_gmv=('gmv_clean', 'mean')
).reset_index()

ads_groups['order_pct'] = ads_groups['with_orders'] / ads_groups['n'] * 100
ads_groups['gmv_per_1k_views'] = ads_groups['tot_gmv'] / ads_groups['tot_views'] * 1000

print(ads_groups[['ads', 'n', 'with_orders', 'order_pct', 'median_views', 'mean_views', 'tot_gmv', 'gmv_per_1k_views']])

# Contingency table & Fisher exact test
yes_pos = (df_shoppable[df_shoppable['ads'] == 'YES']['gmv_clean'] > 0).sum()
yes_neg = len(df_shoppable[df_shoppable['ads'] == 'YES']) - yes_pos
no_pos = (df_shoppable[df_shoppable['ads'] == 'NO']['gmv_clean'] > 0).sum()
no_neg = len(df_shoppable[df_shoppable['ads'] == 'NO']) - no_pos

table_2x2 = [[yes_pos, yes_neg], [no_pos, no_neg]]
odds_ratio, p_fisher = stats.fisher_exact(table_2x2)
print(f"\nContingency Table [[YES_pos, YES_neg], [NO_pos, NO_neg]]: {table_2x2}")
print(f"Fisher's Exact Test: Odds Ratio = {odds_ratio:.4f}, p = {p_fisher:.2e}")

# Mann-Whitney U test on GMV and Views
u_views, p_mwu_views = stats.mannwhitneyu(
    df_shoppable[df_shoppable['ads'] == 'YES']['views_clean'],
    df_shoppable[df_shoppable['ads'] == 'NO']['views_clean']
)
u_gmv, p_mwu_gmv = stats.mannwhitneyu(
    df_shoppable[df_shoppable['ads'] == 'YES']['gmv_clean'],
    df_shoppable[df_shoppable['ads'] == 'NO']['gmv_clean']
)
print(f"Mann-Whitney U Test (Views): U = {u_views:.0f}, p = {p_mwu_views:.2e}")
print(f"Mann-Whitney U Test (GMV): U = {u_gmv:.0f}, p = {p_mwu_gmv:.2e}")

# Bootstrap CI for conversion rate difference
np.random.seed(42)
yes_arr = (df_shoppable[df_shoppable['ads'] == 'YES']['gmv_clean'] > 0).values.astype(int)
no_arr = (df_shoppable[df_shoppable['ads'] == 'NO']['gmv_clean'] > 0).values.astype(int)
diffs = []
for _ in range(2000):
    b_yes = np.random.choice(yes_arr, size=len(yes_arr), replace=True).mean()
    b_no = np.random.choice(no_arr, size=len(no_arr), replace=True).mean()
    diffs.append(b_yes - b_no)

ci_low, ci_high = np.percentile(diffs, [2.5, 97.5])
print(f"Bootstrap 95% CI for (Rate_YES - Rate_NO): [{ci_low*100:.2f}%, {ci_high*100:.2f}%] (Observed diff: {(yes_pos/len(yes_arr) - no_pos/len(no_arr))*100:.2f}%)")

# --- Robustness 1: Within-creator paired comparison ---
print("\n--- Robustness 1: Within-Creator Paired Comparison ---")
cr_ads = df_shoppable.groupby(['creator ID', 'ads']).agg(
    n=('gmv_clean', 'count'),
    with_orders=('gmv_clean', lambda s: (s > 0).sum())
).reset_index()
cr_ads['pos_rate'] = cr_ads['with_orders'] / cr_ads['n']

piv = cr_ads.pivot(index='creator ID', columns='ads', values=['n', 'pos_rate'])
piv = piv.dropna() # Only creators with both YES and NO
print(f"Creators with both YES and NO videos: {len(piv)}")

piv['rate_diff'] = piv[('pos_rate', 'YES')] - piv[('pos_rate', 'NO')]
mean_diff = piv['rate_diff'].mean()
median_diff = piv['rate_diff'].median()
piv_yes_better = (piv['rate_diff'] > 0).sum()
piv_no_better = (piv['rate_diff'] < 0).sum()
piv_equal = (piv['rate_diff'] == 0).sum()

print(f"Mean within-creator diff (YES - NO): {mean_diff*100:.2f}%")
print(f"Median within-creator diff: {median_diff*100:.2f}%")
print(f"Creators where YES > NO: {piv_yes_better} ({piv_yes_better/len(piv)*100:.1f}%)")
print(f"Creators where YES == NO: {piv_equal} ({piv_equal/len(piv)*100:.1f}%)")
print(f"Creators where YES < NO: {piv_no_better} ({piv_no_better/len(piv)*100:.1f}%)")

# Wilcoxon signed-rank test
w_stat, w_pval = stats.wilcoxon(piv['rate_diff'])
print(f"Wilcoxon signed-rank test on within-creator diffs: stat = {w_stat:.1f}, p = {w_pval:.2e}")

# --- Robustness 2: Exclude dominant creators ---
print("\n--- Robustness 2: Exclude Dominant Creators ---")
dominant = ['kamielyhn', '_thzy.tien', 'girlstyle.vn']
# Check creator ID or nickname
df_shoppable['creator_norm'] = df_shoppable['creator ID'].astype(str).str.strip().str.lower()
df_ex_dom = df_shoppable[~df_shoppable['creator_norm'].isin(dominant)].copy()
print(f"Total rows after excluding dominant: {len(df_ex_dom)}")

ex_dom_agg = df_ex_dom.groupby('ads').agg(
    n=('gmv_clean', 'count'),
    with_orders=('gmv_clean', lambda s: (s > 0).sum()),
    tot_views=('views_clean', 'sum'),
    median_views=('views_clean', 'median'),
    tot_gmv=('gmv_clean', 'sum')
).reset_index()
ex_dom_agg['order_pct'] = ex_dom_agg['with_orders'] / ex_dom_agg['n'] * 100
ex_dom_agg['gmv_per_1k_views'] = ex_dom_agg['tot_gmv'] / ex_dom_agg['tot_views'] * 1000
print(ex_dom_agg[['ads', 'n', 'with_orders', 'order_pct', 'median_views', 'tot_gmv', 'gmv_per_1k_views']])

# --- Robustness 3: Only last 90 days videos ---
print("\n--- Robustness 3: Videos Published in Last 90 Days ---")
# Published date: parse
df_shoppable['pub_dt'] = pd.to_datetime(df_shoppable['Published date'].str.split('(').str[0].str.strip())
max_dt = df_shoppable['pub_dt'].max()
cutoff_90d = max_dt - timedelta(days=90)
df_last90 = df_shoppable[df_shoppable['pub_dt'] >= cutoff_90d].copy()
print(f"Cutoff 90 days: {cutoff_90d} | Total videos in last 90 days: {len(df_last90)}")

last90_agg = df_last90.groupby('ads').agg(
    n=('gmv_clean', 'count'),
    with_orders=('gmv_clean', lambda s: (s > 0).sum()),
    tot_views=('views_clean', 'sum'),
    median_views=('views_clean', 'median'),
    tot_gmv=('gmv_clean', 'sum')
).reset_index()
last90_agg['order_pct'] = last90_agg['with_orders'] / last90_agg['n'] * 100
last90_agg['gmv_per_1k_views'] = last90_agg['tot_gmv'] / last90_agg['tot_views'] * 1000
print(last90_agg[['ads', 'n', 'with_orders', 'order_pct', 'median_views', 'tot_gmv', 'gmv_per_1k_views']])


# ======================================================================
# 5.3.F. KHUNG GIỜ VÀ ĐỘ DÀI PHIÊN (CREATOR LIVE LIST +13H)
# ======================================================================
print("\n--- 5.3.F. KHUNG GIỜ VÀ ĐỘ DÀI PHIÊN LIVE CHÍNH CHỦ ---")

# Add duration in hours
df_cr_live['duration_hours'] = df_cr_live['Live Streaming Duration'].apply(parse_duration_sec) / 3600.0

# Hour of day (UTC+7)
df_cr_live['hour_vn'] = df_cr_live['start_ts_vn'].dt.hour

def time_bucket(h):
    if 0 <= h < 6:
        return '00:00 - 05:59'
    elif 6 <= h < 12:
        return '06:00 - 11:59'
    elif 12 <= h < 18:
        return '12:00 - 17:59'
    else:
        return '18:00 - 23:59'

df_cr_live['time_slot'] = df_cr_live['hour_vn'].apply(time_bucket)

def dur_bucket(h):
    if h <= 2.0:
        return '<= 2h'
    elif h <= 4.0:
        return '2h - 4h'
    elif h <= 8.0:
        return '4h - 8h'
    else:
        return '> 8h'

df_cr_live['dur_slot'] = df_cr_live['duration_hours'].apply(dur_bucket)

# Time slot aggregation
time_agg = df_cr_live.groupby('time_slot').agg(
    n=('gmv_clean', 'count'),
    tot_viewers=('viewers_clean', 'sum'),
    tot_gmv=('gmv_clean', 'sum'),
    tot_hours=('duration_hours', 'sum'),
    median_dur=('duration_hours', 'median')
).reset_index()

time_agg['gmv_per_viewer'] = time_agg['tot_gmv'] / time_agg['tot_viewers']
time_agg['gmv_per_hour'] = time_agg['tot_gmv'] / time_agg['tot_hours']
print("Time Slot Performance (UTC+7):")
print(time_agg[['time_slot', 'n', 'tot_viewers', 'tot_gmv', 'gmv_per_viewer', 'gmv_per_hour', 'median_dur']])

# Duration bucket aggregation
dur_agg = df_cr_live.groupby('dur_slot').agg(
    n=('gmv_clean', 'count'),
    tot_viewers=('viewers_clean', 'sum'),
    tot_gmv=('gmv_clean', 'sum'),
    tot_hours=('duration_hours', 'sum')
).reset_index()
dur_agg['gmv_per_viewer'] = dur_agg['tot_gmv'] / dur_agg['tot_viewers']
dur_agg['gmv_per_hour'] = dur_agg['tot_gmv'] / dur_agg['tot_hours']
print("\nDuration Bucket Performance:")
print(dur_agg[['dur_slot', 'n', 'tot_viewers', 'tot_gmv', 'gmv_per_viewer', 'gmv_per_hour']])

# Heatmap: Time Slot x Duration Bucket (GMV / Viewer)
piv_heat = df_cr_live.pivot_table(
    index='time_slot',
    columns='dur_slot',
    values=['gmv_clean', 'viewers_clean', 'Live Streaming Title'],
    aggfunc={'gmv_clean': 'sum', 'viewers_clean': 'sum', 'Live Streaming Title': 'count'}
)

heat_gmv_per_viewer = piv_heat['gmv_clean'] / piv_heat['viewers_clean']
heat_counts = piv_heat['Live Streaming Title']

print("\nHeatmap: Counts (Time Slot x Duration):")
print(heat_counts)
print("\nHeatmap: GMV per Viewer (Time Slot x Duration):")
print(heat_gmv_per_viewer.round(0))


# ======================================================================
# 5.3.G. GIÁ TRỊ MỖI SẢN PHẨM (THAY PHÂN TÍCH GIỎ HÀNG)
# ======================================================================
print("\n--- 5.3.G. GIÁ TRỊ MỖI SẢN PHẨM BÁN (GMV / SP) ---")
df_store['gmv'] = df_store['Sales Amount Increment'].apply(clean_num)
df_store['units'] = df_store['Sales Volume Increment'].apply(clean_num)
df_store['asp'] = df_store['gmv'] / df_store['units'].replace(0, np.nan)

print(f"Store ASP (GMV / Unit): Mean = {df_store['asp'].mean():,.0f} đ | Median = {df_store['asp'].median():,.0f} đ | Min = {df_store['asp'].min():,.0f} đ | Max = {df_store['asp'].max():,.0f} đ")

# Product Data price bands
df_product['gmv_clean'] = df_product['GMV (- 90 day)'].apply(clean_num)
df_product['units_clean'] = df_product['Units sold (90 day)'].apply(clean_num)
df_product_active = df_product[df_product['gmv_clean'] > 0].copy()
print(f"Active Products: {len(df_product_active)} / {len(df_product)}")
df_product_active['asp'] = df_product_active['gmv_clean'] / df_product_active['units_clean'].replace(0, np.nan)
print(f"Product ASP: Mean = {df_product_active['asp'].mean():,.0f} đ | Median = {df_product_active['asp'].median():,.0f} đ")

print("\n=== HOÀN TẤT TÍNH TOÁN THỰC CHỨNG MỤC 5 ===")
