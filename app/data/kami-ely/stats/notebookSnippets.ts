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
    title: 'Cell 3: Hồi quy bảng Fixed-Effects 10 SKU & Bootstrap cụm (n = 1.760)',
    titleEn: 'Cell 3: 10-SKU Panel Fixed-Effects OLS & Cluster Bootstrap (n = 1,760)',
    code: `# Within-SKU Fixed-Effects Panel Model: log(1 + units_it) ~ log(1 + marketing_lags_it) + SKU_FE + DOW_FE
X_cols = ['log_live_t0', 'log_live_lag1_3', 'log_vid_t0', 'log_vid_lag1_3', 'log_koc_t0']
df_panel_dm = df_panel.groupby('sku_code')[['log_units'] + X_cols].transform(lambda s: s - s.mean())

X = df_panel_dm[X_cols].to_numpy()
y = df_panel_dm['log_units'].to_numpy()
beta, _, _, _ = np.linalg.lstsq(X, y, rcond=None)

# 400-iteration cluster bootstrap resampling by SKU
rng = np.random.default_rng(20261101)
skus = df_panel['sku_code'].unique()
boot_betas = []
for _ in range(400):
    sampled = rng.choice(skus, size=len(skus), replace=True)
    sub = pd.concat([df_panel_dm[df_panel['sku_code'] == k] for k in sampled])
    b, _, _, _ = np.linalg.lstsq(sub[X_cols].to_numpy(), sub['log_units'].to_numpy(), rcond=None)
    boot_betas.append(b)
ci_low, ci_high = np.quantile(boot_betas, [0.025, 0.975], axis=0)`,
  },
  {
    title: 'Cell 4: Chỉ số tập trung HHI & Đường Lorenz mạng lưới KOC',
    titleEn: 'Cell 4: KOC Network HHI Concentration & Lorenz Curve',
    code: `ext_live = df_live[df_live['KOC ID'] != 'shop_official'].copy()
by_koc = ext_live.groupby('koc_hash')['gmv'].sum()
shares = by_koc / by_koc.sum()
hhi_all = float((shares ** 2).sum() * 10_000)  # 2,152 (Full 231d); KOL 90d Directory = 3,842

# Separate in-house satellite @koc_sat01 to measure independent affiliate dispersion
by_indep = by_koc.drop(index='koc_sat01', errors='ignore')
hhi_indep = float(((by_indep / by_indep.sum()) ** 2).sum() * 10_000)  # 761`,
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
