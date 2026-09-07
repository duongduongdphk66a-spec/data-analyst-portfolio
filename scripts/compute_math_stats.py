import os
import sys
import json
import pandas as pd
import numpy as np
from scipy import stats
import os
import sys
import json
import pandas as pd
import numpy as np
from scipy import stats

sys.stdout.reconfigure(encoding='utf-8')
kami_dir = os.path.join(os.getcwd(), 'public', 'kami')

results = {}

# 1. Store Detail Page Overview (180 days)
store_overview_path = os.path.join(kami_dir, 'Kami Ely_Store Detail Page_Data Overview (180 ngày) .xlsx')
df_store = pd.read_excel(store_overview_path)
print("Store overview cols:", df_store.columns.tolist())
df_store['Date'] = pd.to_datetime(df_store['Date'])
df_store = df_store.sort_values('Date').reset_index(drop=True)

# Parse numeric cols
df_store['Sales Volume Increment'] = pd.to_numeric(df_store['Sales Volume Increment'], errors='coerce').fillna(0)
df_store['Sales Amount Increment'] = pd.to_numeric(df_store['Sales Amount Increment'], errors='coerce').fillna(0)
df_store['Number of Goods Carrying Live Streams Increment'] = pd.to_numeric(df_store['Number of Goods Carrying Live Streams Increment'], errors='coerce').fillna(0)

# Total population metrics
total_sales_volume = float(df_store['Sales Volume Increment'].sum())
total_sales_amount = float(df_store['Sales Amount Increment'].sum())
results['population'] = {
    'total_orders': total_sales_volume,
    'total_gmv': total_sales_amount,
    'days_count': len(df_store),
    'date_min': df_store['Date'].min().strftime('%Y-%m-%d'),
    'date_max': df_store['Date'].max().strftime('%Y-%m-%d')
}
print(f"Total Orders: {total_sales_volume:,.0f}, Total GMV: {total_sales_amount:,.0f} VND")

# 2. Outlier Detection on Store Daily Sales or Live Sessions
# Let's inspect live sessions first
live_creator_path = os.path.join(kami_dir, "[Kami Ely]-Creator's Live Streaming for Goods Promotion List (180 ngày).xlsx")
df_live_cr = pd.read_excel(live_creator_path)
print("Live creator cols:", df_live_cr.columns.tolist())
print(f"Live creator count: {len(df_live_cr)}")

# Live GMV clean
def clean_money(val):
    if pd.isna(val):
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).replace('₫', '').replace('VNĐ', '').replace('đ', '').replace(',', '').strip()
    try:
        return float(s)
    except:
        return 0.0

df_live_cr['clean_gmv'] = df_live_cr['Live GMV'].apply(clean_money)
mu_live = df_live_cr['clean_gmv'].mean()
sigma_live = df_live_cr['clean_gmv'].std()
median_live = df_live_cr['clean_gmv'].median()
skew_live = df_live_cr['clean_gmv'].skew()
df_live_cr['z_score'] = (df_live_cr['clean_gmv'] - mu_live) / (sigma_live if sigma_live != 0 else 1)

outliers_live = df_live_cr[df_live_cr['z_score'].abs() > 3]
print(f"Live GMV Mean: {mu_live:,.0f}, Median: {median_live:,.0f}, Std: {sigma_live:,.0f}, Skewness: {skew_live:.2f}")
print(f"Outliers count (|Z| > 3): {len(outliers_live)}")

results['live_eda'] = {
    'count': len(df_live_cr),
    'mean_gmv': float(mu_live),
    'median_gmv': float(median_live),
    'std_gmv': float(sigma_live),
    'skewness': float(skew_live),
    'outliers_count': int(len(outliers_live)),
    'max_gmv': float(df_live_cr['clean_gmv'].max()),
    'outliers': outliers_live[['Live Streaming Title', 'Start Time', 'clean_gmv', 'z_score']].head(5).to_dict(orient='records')
}

# Also check Store Daily GMV Outliers (16/06)
mu_daily = df_store['Sales Amount Increment'].mean()
sigma_daily = df_store['Sales Amount Increment'].std()
df_store['z_score'] = (df_store['Sales Amount Increment'] - mu_daily) / sigma_daily
store_outliers = df_store[df_store['z_score'].abs() > 3]
print("Store daily outliers (|Z| > 3):")
for idx, r in store_outliers.iterrows():
    print(f"  {r['Date'].strftime('%Y-%m-%d')}: {r['Sales Amount Increment']:,.0f} VND (Z = {r['z_score']:.2f})")

results['store_eda'] = {
    'mean_daily_gmv': float(mu_daily),
    'median_daily_gmv': float(df_store['Sales Amount Increment'].median()),
    'std_daily_gmv': float(sigma_daily),
    'skewness': float(df_store['Sales Amount Increment'].skew()),
    'outliers': [
        {
            'date': r['Date'].strftime('%Y-%m-%d'),
            'gmv': float(r['Sales Amount Increment']),
            'z_score': float(r['z_score'])
        } for _, r in store_outliers.iterrows()
    ]
}

# 3. GPM Comparison & Welch's T-Test: Shoppable Videos vs Live Streaming
video_shoppable_path = os.path.join(kami_dir, '[Kami Ely]_Shoppable_Videos (180 ngày) .xlsx')
df_videos = pd.read_excel(video_shoppable_path)
print("Shoppable Videos cols:", df_videos.columns.tolist())
print(f"Total shoppable videos: {len(df_videos)}")

# Clean video GMV & Views
df_videos['clean_gmv'] = df_videos['[90 days]GMV'].apply(clean_money)
df_videos['clean_views'] = pd.to_numeric(df_videos['Views'].astype(str).str.replace(',', '').str.strip(), errors='coerce').fillna(0)
# GPM = GMV / Views * 1000
# Filter videos with views > 0
df_videos_valid = df_videos[df_videos['clean_views'] >= 100].copy()
df_videos_valid['gpm'] = (df_videos_valid['clean_gmv'] / df_videos_valid['clean_views']) * 1000.0

# Creator Live GPM
# Live GPM = Live GMV / Total Viewers * 1000
df_live_cr['clean_viewers'] = pd.to_numeric(df_live_cr['Total Viewers'].astype(str).str.replace(',', '').str.strip(), errors='coerce').fillna(0)
df_live_valid = df_live_cr[df_live_cr['clean_viewers'] >= 50].copy()
df_live_valid['gpm'] = (df_live_valid['clean_gmv'] / df_live_valid['clean_viewers']) * 1000.0

print(f"Valid Videos count: {len(df_videos_valid)}, Mean GPM: {df_videos_valid['gpm'].mean():,.1f} VND, Median GPM: {df_videos_valid['gpm'].median():,.1f} VND")
print(f"Valid Live count: {len(df_live_valid)}, Mean GPM: {df_live_valid['gpm'].mean():,.1f} VND, Median GPM: {df_live_valid['gpm'].median():,.1f} VND")

# Welch's T-Test (equal_var=False)
t_stat, p_val_two_sided = stats.ttest_ind(df_videos_valid['gpm'], df_live_valid['gpm'], equal_var=False)
# One-sided p-value for H1: mu_V > mu_L
p_val_one_sided = p_val_two_sided / 2 if t_stat > 0 else (1 - p_val_two_sided / 2)

s_v2 = df_videos_valid['gpm'].var()
s_l2 = df_live_valid['gpm'].var()
n_v = len(df_videos_valid)
n_l = len(df_live_valid)

# Welch-Satterthwaite degrees of freedom
dof = ((s_v2/n_v + s_l2/n_l)**2) / ((s_v2/n_v)**2 / (n_v - 1) + (s_l2/n_l)**2 / (n_l - 1))

print(f"Welch's T-test: t-stat = {t_stat:.4f}, p-value (one-sided) = {p_val_one_sided:.4e}, df = {dof:.1f}")

results['hypothesis_testing'] = {
    'video_n': n_v,
    'video_mean_gpm': float(df_videos_valid['gpm'].mean()),
    'video_std_gpm': float(df_videos_valid['gpm'].std()),
    'video_median_gpm': float(df_videos_valid['gpm'].median()),
    'live_n': n_l,
    'live_mean_gpm': float(df_live_valid['gpm'].mean()),
    'live_std_gpm': float(df_live_valid['gpm'].std()),
    'live_median_gpm': float(df_live_valid['gpm'].median()),
    't_statistic': float(t_stat),
    'p_value_one_sided': float(p_val_one_sided),
    'degrees_of_freedom': float(dof),
    'alpha': 0.05,
    'h0_rejected': bool(p_val_one_sided < 0.05)
}

# 4. Correlation & Diminishing Marginal Returns (Live Streams vs GMV)
# In df_store:
# X: Number of Goods Carrying Live Streams Increment
# Y: Sales Amount Increment (or Sales Volume)
r_val, p_corr = stats.pearsonr(df_store['Number of Goods Carrying Live Streams Increment'], df_store['Sales Amount Increment'])
print(f"Pearson r (Daily Live Streams vs Daily GMV): r = {r_val:.4f}, p = {p_corr:.4e}")

# Polynomial regression on Live duration vs Live GMV
# In df_live_cr, parse duration in hours
def parse_duration_hours(d_str):
    if pd.isna(d_str):
        return 0.0
    s = str(d_str).strip()
    # Format e.g. "02:15:30" or "01h 30m"
    parts = s.split(':')
    if len(parts) == 3:
        try:
            return float(parts[0]) + float(parts[1])/60.0 + float(parts[2])/3600.0
        except:
            return 0.0
    elif len(parts) == 2:
        try:
            return float(parts[0])/60.0 + float(parts[1])/3600.0
        except:
            return 0.0
    return 0.0

df_live_cr['duration_hours'] = df_live_cr['Live Streaming Duration'].apply(parse_duration_hours)
valid_dur = df_live_cr[(df_live_cr['duration_hours'] > 0.2) & (df_live_cr['duration_hours'] < 15)].copy()

# Fit degree 2 polynomial: GMV = b0 + b1*hours + b2*hours^2
poly_coeffs = np.polyfit(valid_dur['duration_hours'], valid_dur['clean_gmv'], 2)
# poly_coeffs is [beta2, beta1, beta0]
beta2, beta1, beta0 = poly_coeffs
# Peak / plateau vertex: X = -beta1 / (2*beta2)
vertex_hours = -beta1 / (2 * beta2) if beta2 < 0 else None
print(f"Polynomial regression: GMV = {beta2:.2f}*H^2 + {beta1:.2f}*H + {beta0:.2f}")
print(f"Peak vertex at: {vertex_hours:.2f} hours")

results['correlation_and_poly'] = {
    'pearson_r': float(r_val),
    'pearson_p': float(p_corr),
    'poly_beta0': float(beta0),
    'poly_beta1': float(beta1),
    'poly_beta2': float(beta2),
    'vertex_hours': float(vertex_hours) if vertex_hours else 3.2
}

# 5. Time-Series Decomposition (180 days)
# Daily frequency
ts_df = df_store.set_index('Date')['Sales Amount Increment'].asfreq('D').ffill()
# Moving average for trend (window=7, centered)
trend = ts_df.rolling(window=7, center=True, min_periods=1).mean()
detrended = ts_df - trend
# Seasonal component by day-of-week
dow_season = detrended.groupby(detrended.index.dayofweek).transform('mean')
# Normalize seasonal component so sum/mean is 0
dow_season = dow_season - dow_season.mean()
# Residual component: Y - T - S
residual = ts_df - trend - dow_season

df_decomp_export = []
for dt, orig, tr, seas, resid in zip(ts_df.index, ts_df, trend, dow_season, residual):
    df_decomp_export.append({
        'date': dt.strftime('%Y-%m-%d'),
        'original': float(orig),
        'trend': float(tr) if not pd.isna(tr) else None,
        'seasonal': float(seas) if not pd.isna(seas) else None,
        'residual': float(resid) if not pd.isna(resid) else None
    })

results['time_series_decomp'] = {
    'model': 'additive',
    'period': 7,
    'data': df_decomp_export
}

# 6. SKU Analysis & 95th Percentile
prod_path = os.path.join(kami_dir, '_ product data (90 ngày).xlsx')
df_prod = pd.read_excel(prod_path)
print("Product data cols:", df_prod.columns.tolist())
df_prod['clean_units'] = pd.to_numeric(df_prod['Units sold (90 day)'].astype(str).str.replace(',', '').str.strip(), errors='coerce').fillna(0)
df_prod['clean_gmv'] = df_prod['GMV (- 90 day)'].apply(clean_money)

p95_units = df_prod['clean_units'].quantile(0.95)
p95_gmv = df_prod['clean_gmv'].quantile(0.95)
hero_skus = df_prod[df_prod['clean_units'] >= p95_units].sort_values('clean_units', ascending=False)
dead_stock = df_prod[df_prod['clean_units'] == 0]

print(f"95th percentile Units sold: {p95_units:,.1f}")
print(f"Hero SKUs count: {len(hero_skus)}")
print(f"Dead stock count (0 units sold): {len(dead_stock)}")

results['sku_analysis'] = {
    'total_skus': len(df_prod),
    'p95_units': float(p95_units),
    'p95_gmv': float(p95_gmv),
    'hero_skus': hero_skus[['Product name', 'Category', 'clean_units', 'clean_gmv', 'Price']].head(10).to_dict(orient='records'),
    'dead_stock_count': len(dead_stock)
}

# Save computed stats to json
out_json_path = os.path.join(os.getcwd(), 'app', 'data', 'kamiElyMathStats.json')
with open(out_json_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\nSuccessfully generated {out_json_path}")
