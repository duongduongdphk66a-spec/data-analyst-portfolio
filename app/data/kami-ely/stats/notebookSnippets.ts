export const notebookSnippets = [
  {
    title: 'Cell 1: Nạp dữ liệu ước tính FastMoss 231 ngày & chuẩn hóa',
    titleEn: 'Cell 1: Load & normalize 231-day FastMoss exports',
    code: `import pandas as pd
import numpy as np
from scipy import stats

# Load merged 231-day datasets (Mar 09 - Oct 25, 2026; 10 files = 23,364 rows)
df_store = pd.read_excel('[Kami Ely]_Store_Daily_Overview_231_Days_Merged.xlsx')
df_live  = pd.read_excel('[Kami Ely]_Affiliate_Livestreams_Merged.xlsx')
df_video = pd.read_excel('[Kami Ely]_Affiliate_Videos_Merged.xlsx').drop_duplicates(
    subset=['KOC ID', 'Tiêu Đề Video', 'Thời Gian Xuất Bản']
)
df_prod  = pd.read_excel('[Kami Ely]_Shop_Products_Merged.xlsx')

print(f"Store: {len(df_store)}d | Live: {len(df_live)} sessions | Unique videos: {len(df_video)} | SKUs: {len(df_prod)}")`,
  },
  {
    title: 'Cell 2: Kiểm chứng độ nhạy MA7 < MA28 khi Winsorize đỉnh 16/06',
    titleEn: 'Cell 2: MA7 < MA28 crossover sensitivity under Jun 16 Winsorization',
    code: `df_store['dt'] = pd.to_datetime(df_store['Ngày Ghi Nhận'])
df_store = df_store.sort_values('dt').reset_index(drop=True)

p99 = df_store['gmv'].quantile(0.99)   # 176.6M VND
p95 = df_store['gmv'].quantile(0.95)   # 136.8M VND
june_med = df_store.loc[df_store['dt'].dt.month == 6, 'gmv'].median()

for label, series in [
    ('Raw series', df_store['gmv']),
    ('Winsorize P99', df_store['gmv'].clip(upper=p99)),
    ('Winsorize P95', df_store['gmv'].clip(upper=p95)),
    ('Replace 16/06 with Jun median', df_store['gmv'].where(df_store['dt'] != '2026-06-16', june_med)),
]:
    ma7, ma28 = series.rolling(7).mean(), series.rolling(28).mean()
    diff = ma7 - ma28
    cross = df_store[(df_store['dt'] >= '2026-06-10') & (diff < 0) & (diff.shift(1) >= 0)]
    print(label, '->', cross['dt'].dt.strftime('%d/%m/%Y').tolist())`,
  },
  {
    title: 'Cell 3: Hồi quy Panel Fixed-Effects 10 SKU hậu mở bán (n = 1.422, Within R² = 0,302)',
    titleEn: 'Cell 3: Post-Launch 10-SKU Panel Fixed-Effects OLS (n = 1,422, Within R² = 0.302)',
    code: `# Within-SKU Fixed-Effects Panel Model: log(1 + units_it) ~ log(1 + marketing_lags_it) + SKU_FE + DOW_FE
# Filter pre-launch zero rows per SKU (n = 1,422 active SKU-days vs 1,760 full panel)
base_cols = ['log_live_t0', 'log_live_lag1_3', 'log_vid_t0', 'log_vid_lag1_3', 'log_koc_t0']
dow_dummies = pd.get_dummies(df_active['dt'].dt.dayofweek, prefix='dow', drop_first=True, dtype=float)
df_work = pd.concat([df_active[['sku_code', 'log_units'] + base_cols], dow_dummies], axis=1)
X_cols = base_cols + list(dow_dummies.columns)

df_panel_dm = df_work.groupby('sku_code')[['log_units'] + X_cols].transform(lambda s: s - s.mean())
X, y = df_panel_dm[X_cols].to_numpy(), df_panel_dm['log_units'].to_numpy()
beta, _, _, _ = np.linalg.lstsq(X, y, rcond=None)
within_r2 = 1 - np.sum((y - X @ beta) ** 2) / np.sum((y - y.mean()) ** 2)  # 0.302 (vs 0.490 full)

# 400-iteration cluster bootstrap resampling by SKU (seed 20261101)
rng = np.random.default_rng(20261101)
skus = df_work['sku_code'].unique()
boot_betas = []
for _ in range(400):
    sampled = rng.choice(skus, size=len(skus), replace=True)
    sub = pd.concat([df_panel_dm[df_work['sku_code'] == k] for k in sampled])
    b, _, _, _ = np.linalg.lstsq(sub[X_cols].to_numpy(), sub['log_units'].to_numpy(), rcond=None)
    boot_betas.append(b[:len(base_cols)])
ci_low, ci_high = np.quantile(boot_betas, [0.025, 0.975], axis=0)`,
  },
  {
    title: 'Cell 4: Chỉ số tập trung HHI & Đường Lorenz mạng lưới KOC',
    titleEn: 'Cell 4: KOC Network HHI Concentration & Lorenz Curve',
    code: `ext_live = df_live[df_live['KOC ID'] != 'shop_official'].copy()
by_koc = ext_live.groupby('koc_hash')['gmv'].sum()
shares = by_koc / by_koc.sum()
hhi_all = float((shares ** 2).sum() * 10_000)  # 2,152 (AffLive excl. official, incl. @koc_sat01)

# Separate in-house satellite @koc_sat01 to measure independent affiliate dispersion
by_indep = by_koc.drop(index='koc_sat01', errors='ignore')
hhi_indep = float(((by_indep / by_indep.sum()) ** 2).sum() * 10_000)  # 761 (AffLive pure external)
# Note: 90d KOL Directory HHI = 3,842 (all) | 1,471 (excl. official, incl. @koc_sat01) | 246 (pure external)`,
  },
  {
    title: 'Cell 5: Kiểm định Mann-Whitney U, Fisher Exact & 6 lát cắt Ads/Organic',
    titleEn: 'Cell 5: Mann-Whitney U, Fisher Exact & 6-Slice Ads vs. Organic Forest',
    code: `ads_yes = df_video[df_video['ads_flag'] == 'YES']
ads_no  = df_video[df_video['ads_flag'] == 'NO']

u_stat, p_mw = stats.mannwhitneyu(ads_yes['gpm'], ads_no['gpm'], alternative='two-sided')
odds_ratio, p_fisher = stats.fisher_exact([
    [(ads_yes['units'] > 0).sum(), (ads_yes['units'] == 0).sum()],
    [(ads_no['units'] > 0).sum(),  (ads_no['units'] == 0).sum()],
])
print(f"Mann-Whitney p={p_mw:.3e} | Fisher OR={odds_ratio:.2f} (p={p_fisher:.3e})")`,
  },
];
