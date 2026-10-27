export const notebookSnippets = [
  {
    title: 'Cell 1: Nạp dữ liệu ước tính FastMoss 231 ngày & chuẩn hóa',
    code: `import pandas as pd
import numpy as np
from scipy import stats

# Nạp các tập dữ liệu hợp nhất 231 ngày (09/03 - 25/10/2026)
df_store = pd.read_excel('[Kami Ely]_Store_Daily_Overview_231_Days_Merged.xlsx')
df_live  = pd.read_excel('[Kami Ely]_Affiliate_Livestreams_Merged.xlsx')
df_video = pd.read_excel('[Kami Ely]_Affiliate_Videos_Merged.xlsx').drop_duplicates(
    subset=['KOC ID', 'Tiêu Đề Video', 'Thời Gian Xuất Bản']
)
df_prod  = pd.read_excel('[Kami Ely]_Shop_Products_Merged.xlsx')

print(f"Store: {len(df_store)} ngày | Live: {len(df_live)} phiên | Video duy nhất: {len(df_video)} | SKU: {len(df_prod)}")`,
  },
  {
    title: 'Cell 2: Kiểm chứng độ nhạy Dead Cross khi Winsorize ngoại lai ngày 16/06',
    code: `df_store['dt'] = pd.to_datetime(df_store['Ngày Ghi Nhận'])
df_store = df_store.sort_values('dt').reset_index(drop=True)

p99 = df_store['gmv'].quantile(0.99)   # 176.6M VND
p95 = df_store['gmv'].quantile(0.95)   # 136.8M VND
june_med = df_store.loc[df_store['dt'].dt.month == 6, 'gmv'].median()

for label, series in [
    ('Chuỗi gốc', df_store['gmv']),
    ('Winsorize P99', df_store['gmv'].clip(upper=p99)),
    ('Winsorize P95', df_store['gmv'].clip(upper=p95)),
    ('Thay 16/06 bằng trung vị T6', df_store['gmv'].where(df_store['dt'] != '2026-06-16', june_med)),
]:
    ma7, ma28 = series.rolling(7).mean(), series.rolling(28).mean()
    diff = ma7 - ma28
    cross = df_store[(df_store['dt'] >= '2026-06-10') & (diff < 0) & (diff.shift(1) >= 0)]
    print(label, '->', cross['dt'].dt.strftime('%d/%m/%Y').tolist())`,
  },
  {
    title: 'Cell 3: Hồi quy OLS đa biến giải thích doanh thu ngày (n = 231, R² = 0.446)',
    code: `# Mô hình: GMV_ngày (Triệu VNĐ) ~ Giờ_Live_Chính_Chủ + Ca_Kênh_Vệ_Tinh + Ca_KOC_Ngoài + Video_Mới + Mùa_Cao_Điểm_T5_T6
X_cols = ['own_live_h', 'sat_live_n', 'ext_live_n', 'new_vid', 'summer_peak']
X = np.column_stack([np.ones(len(df_daily))] + [df_daily[c].to_numpy() for c in X_cols])
y = (df_daily['gmv'] / 1e6).to_numpy()

beta, _, _, _ = np.linalg.lstsq(X, y, rcond=None)
resid = y - (X @ beta)
n, k = X.shape
se = np.sqrt(np.diag(((resid @ resid) / (n - k)) * np.linalg.inv(X.T @ X)))
t_stats = beta / se
p_vals = 2 * (1 - stats.t.cdf(np.abs(t_stats), df=n - k))`,
  },
  {
    title: 'Cell 4: Tính chỉ số tập trung Herfindahl-Hirschman (HHI) mạng lưới KOC',
    code: `ext_live = df_live[df_live['KOC ID'] != 'official_shop'].copy()
by_koc = ext_live.groupby('koc_hash')['gmv'].sum()
shares = by_koc / by_koc.sum()
hhi_all = float((shares ** 2).sum() * 10_000)  # 2,152 (Toàn kỳ 231N); Kỳ Hè = 3,230

# Tách riêng kênh vệ tinh @koc_sat01 để đo độ phân tán thực của KOC độc lập
by_indep = by_koc.drop(index='koc_sat01', errors='ignore')
hhi_indep = float(((by_indep / by_indep.sum()) ** 2).sum() * 10_000)  # 761`,
  },
  {
    title: 'Cell 5: Kiểm định phi tham số Mann-Whitney U & Fisher Exact (Ads vs Tự nhiên)',
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
