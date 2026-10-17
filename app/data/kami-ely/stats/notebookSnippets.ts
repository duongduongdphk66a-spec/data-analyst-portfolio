export const notebookSnippets = [
  {
    title: 'Cell 1: Telemetry Data Ingestion & Cleansing',
    code: `import pandas as pd
import numpy as np
from scipy import stats

# Ingest raw daily telemetry
df_store = pd.read_excel('Kami Ely_Store Detail Page_Data Overview (180 ngày) .xlsx')
df_videos = pd.read_excel('[Kami Ely]_Shoppable_Videos (180 ngày) .xlsx')
df_live = pd.read_excel('_shop LIVE (180 ngày) 1.xlsx')
df_prod = pd.read_excel('_ product data (90 ngày).xlsx')

print(f"Ingested {len(df_store)} store days, {len(df_videos)} videos, {len(df_live)} live streams")`,
  },
  {
    title: "Cell 2: Welch's Two-Sample T-test (Video vs Live GPM)",
    code: `# Welch's T-test for Video vs Live GPM
t_stat, p_val = stats.ttest_ind(
    df_videos['GPM'], df_live['GPM'], equal_var=False
)
print(f"t-statistic: {t_stat:.4f}, p-value: {p_val:.4e}")
# Reject H0 at alpha = 0.05`,
  },
  {
    title: 'Cell 3: Pearson Correlation & Polynomial Fit',
    code: `# Pearson correlation r
r, p_val = stats.pearsonr(df_store['live_streams'], df_store['daily_gmv'])

# Polynomial Regression degree 2
poly = np.polyfit(df_live['duration_hours'], df_live['gmv'], 2)
vertex = -poly[1] / (2 * poly[0])
print(f"Diminishing marginal returns threshold: {vertex:.2f} hours/day")`,
  },
  {
    title: 'Cell 4: STL Additive Time-Series Decomposition',
    code: `from statsmodels.tsa.seasonal import seasonal_decompose

decomp = seasonal_decompose(df_store['gmv'], model='additive', period=7)
decomp.plot()
# Proving summer vacation seasonality (St) vs operational dip`,
  },
  {
    title: 'Cell 5: SKU 95th Percentile Strategy',
    code: `p95 = df_prod['units_sold'].quantile(0.95)
hero_skus = df_prod[df_prod['units_sold'] >= p95]
dead_stock = df_prod[df_prod['units_sold'] == 0]
print(f"Hero SKUs: {len(hero_skus)}, Dead Stock: {len(dead_stock)}")`,
  },
];
