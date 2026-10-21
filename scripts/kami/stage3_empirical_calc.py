import os
import sys
import pandas as pd
import numpy as np
from scipy import stats

sys.stdout.reconfigure(encoding="utf-8")

DATA_DIR = r"c:\Users\ADMIN\Documents\data-analyst-portfolio\data\kami"

def to_num(val):
    if val is None or pd.isna(val):
        return 0.0
    if isinstance(val, (int, float, np.integer, np.floating)):
        return float(val)
    s = str(val).replace("₫", "").replace("VNĐ", "").replace("%", "").strip()
    if not s or s == "-":
        return 0.0
    mult = 1.0
    low = s.lower()
    if low.endswith("tr"):
        mult, s = 1e6, s[:-2].strip().replace(".", "").replace(",", ".")
    elif low.endswith("tỷ") or low.endswith("ty"):
        mult, s = 1e9, s[:-2].strip().replace(".", "").replace(",", ".")
    elif low.endswith("k"):
        mult, s = 1e3, s[:-1].strip().replace(",", ".") if s.count(",") == 1 and "." not in s and len(s.split(",")[1]) < 3 else s[:-1].replace(",", "")
    elif low.endswith("m"):
        mult, s = 1e6, s[:-1].replace(",", "")
    else:
        s = s.replace(",", "")
    try:
        return float(s) * mult
    except ValueError:
        return 0.0

# 1. Load Store Detail
store_path = os.path.join(DATA_DIR, "Kami Ely_Store Detail Page_Data Overview (180 ngày) .xlsx")
df_store = pd.read_excel(store_path)
df_store["Date"] = pd.to_datetime(df_store["Date"])
df_store = df_store.rename(columns={
    "Sales Volume Increment": "units",
    "Sales Amount Increment": "gmv",
    "Number of Goods Carrying Influencers Increment": "koc",
    "Number of Goods Carrying Videos Increment": "videos",
    "Number of Goods Carrying Live Streams Increment": "lives",
})
for col in ["units", "gmv", "koc", "videos", "lives"]:
    df_store[col] = df_store[col].apply(to_num)
df_store = df_store.sort_values("Date").reset_index(drop=True)

print("=== 1. STORE OVERVIEW ===")
print("Days:", len(df_store))
print("Start:", df_store["Date"].min(), "End:", df_store["Date"].max())
total_gmv = df_store["gmv"].sum()
total_units = df_store["units"].sum()
print(f"Total GMV: {total_gmv:,.0f} VND")
print(f"Total Units: {total_units:,.0f}")

# Part A: Monthly Table
df_store["ym"] = df_store["Date"].dt.strftime("%Y-%m")
monthly = df_store.groupby("ym").agg(
    n_days=("Date", "count"),
    gmv=("gmv", "sum"),
    units=("units", "sum"),
    koc=("koc", "mean"),
    lives=("lives", "mean"),
    videos=("videos", "mean"),
).reset_index()
monthly["gmv_per_day"] = monthly["gmv"] / monthly["n_days"]
monthly["units_per_day"] = monthly["units"] / monthly["n_days"]
monthly["aov"] = monthly["gmv"] / monthly["units"]
monthly["mom_raw_pct"] = monthly["gmv"].pct_change() * 100
monthly["mom_per_day_pct"] = monthly["gmv_per_day"].pct_change() * 100
monthly["share_pct"] = (monthly["gmv"] / total_gmv) * 100

print("\n=== PART A: MONTHLY BREAKDOWN ===")
for r in monthly.itertuples():
    print(f"Month: {r.ym} | Days: {r.n_days} | Total GMV: {r.gmv:,.0f} ({r.share_pct:.1f}%) | "
          f"GMV/Day: {r.gmv_per_day:,.0f} | Units: {r.units:,.0f} | AOV: {r.aov:,.0f} | "
          f"MoM Raw: {r.mom_raw_pct:+.1f}% | MoM Per Day: {r.mom_per_day_pct:+.1f}%")

# Part B: Peak & Trajectory
peak_idx = df_store["gmv"].idxmax()
peak_row = df_store.loc[peak_idx]
print(f"\n=== PART B: PEAK ===")
print(f"Peak Date: {peak_row['Date'].strftime('%d/%m/%Y')} | Peak GMV: {peak_row['gmv']:,.0f} VND | Units: {peak_row['units']}")

# 7 days around peak (e.g. peak_idx - 3 to peak_idx + 3)
w7_start = max(0, peak_idx - 3)
w7_end = min(len(df_store), peak_idx + 4)
w7_gmv = df_store.iloc[w7_start:w7_end]["gmv"].sum()
print(f"7 days around peak ({df_store.iloc[w7_start]['Date'].strftime('%d/%m')} to {df_store.iloc[w7_end-1]['Date'].strftime('%d/%m')}): {w7_gmv:,.0f} VND ({w7_gmv/total_gmv*100:.2f}% of total 180d GMV)")

# 14 days around peak
w14_start = max(0, peak_idx - 7)
w14_end = min(len(df_store), peak_idx + 7)
w14_gmv = df_store.iloc[w14_start:w14_end]["gmv"].sum()
print(f"14 days window around peak: {w14_gmv:,.0f} VND ({w14_gmv/total_gmv*100:.2f}% of total)")

# Post-peak decline: when does daily GMV touch April avg (82M/day)?
t4_avg = monthly.loc[monthly["ym"] == "2026-04", "gmv_per_day"].values[0]
post_peak = df_store[df_store["Date"] > peak_row["Date"]].copy()
post_peak["ma7"] = post_peak["gmv"].rolling(7).mean()
touch_t4 = post_peak[post_peak["ma7"] <= t4_avg]
if len(touch_t4) > 0:
    first_touch = touch_t4.iloc[0]
    print(f"MA7 dropped below April daily avg ({t4_avg:,.0f}) on: {first_touch['Date'].strftime('%d/%m/%Y')} (MA7 = {first_touch['ma7']:,.0f})")

# Part C: Day of Week Cyclicality
df_store["dow"] = df_store["Date"].dt.dayofweek # 0=Mon, 6=Sun
dow_names = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"]
df_store["dow_name"] = df_store["dow"].apply(lambda d: dow_names[d])

mean_dow = df_store.groupby("dow")["gmv"].mean()
median_dow = df_store.groupby("dow")["gmv"].median()
overall_mean = df_store["gmv"].mean()
dow_index = (mean_dow / overall_mean) * 100

print("\n=== PART C: DAY OF WEEK CYCLICALITY ===")
for d in range(7):
    print(f"{dow_names[d]}: Mean = {mean_dow[d]:,.0f} VND | Median = {median_dow[d]:,.0f} VND | Index = {dow_index[d]:.1f}%")

# By Phase: Growth (Mar-May), Peak (Jun), Decline (Jul-Sep)
phase_growth = df_store[df_store["Date"] < "2026-06-01"]
phase_peak = df_store[(df_store["Date"] >= "2026-06-01") & (df_store["Date"] < "2026-07-01")]
phase_decline = df_store[df_store["Date"] >= "2026-07-01"]

print("\nPhase Dow Median GMV:")
for p_name, p_df in [("Tăng trưởng (T3-T5)", phase_growth), ("Đỉnh cao (T6)", phase_peak), ("Suy giảm (T7-T9)", phase_decline)]:
    meds = p_df.groupby("dow")["gmv"].median()
    top_d = dow_names[meds.idxmax()]
    low_d = dow_names[meds.idxmin()]
    print(f"{p_name}: Peak={top_d} ({meds.max():,.0f}), Low={low_d} ({meds.min():,.0f})")

# Part D: Weekly Aggregation & Marketing Intensity Correlation
df_store["week"] = df_store["Date"].dt.isocalendar().week
# Since year might cross or start from W10
df_store["year_week"] = df_store["Date"].dt.strftime("%Y-W%U")
weekly = df_store.groupby("year_week").agg(
    start_date=("Date", "min"),
    end_date=("Date", "max"),
    n_days=("Date", "count"),
    gmv=("gmv", "sum"),
    units=("units", "sum"),
    koc=("koc", "mean"),
    lives=("lives", "sum"),
    videos=("videos", "sum"),
).reset_index()
weekly["gmv_per_day"] = weekly["gmv"] / weekly["n_days"]

print(f"\n=== PART D: WEEKLY CORRELATIONS ({len(weekly)} weeks) ===")
for var in ["koc", "lives", "videos"]:
    r_p, p_p = stats.pearsonr(weekly[var], weekly["gmv"])
    r_s, p_s = stats.spearmanr(weekly[var], weekly["gmv"])
    print(f"Weekly GMV vs {var.upper()}: Pearson r = {r_p:.3f} (p={p_p:.3g}) | Spearman rho = {r_s:.3f} (p={p_s:.3g})")

# Cross-correlation with lag 0 to 7 days on DAILY data
print("\nCross-correlation on Daily data (GMV vs Marketing with lag):")
for lag in range(8):
    # lag means marketing leads GMV by 'lag' days: GMV(t) vs Mkt(t - lag)
    gmv_t = df_store["gmv"].iloc[lag:]
    koc_lag = df_store["koc"].shift(lag).iloc[lag:]
    lives_lag = df_store["lives"].shift(lag).iloc[lag:]
    rk, _ = stats.pearsonr(gmv_t, koc_lag)
    rl, _ = stats.pearsonr(gmv_t, lives_lag)
    print(f"Lag {lag} days: GMV vs KOC(t-{lag}) r = {rk:.3f} | GMV vs Lives(t-{lag}) r = {rl:.3f}")

# Part E: Efficiency per Unit (GMV/Live and GMV/KOC)
weekly["gmv_per_live"] = weekly["gmv"] / weekly["lives"]
weekly["gmv_per_koc"] = weekly["gmv"] / weekly["koc"]

# Decompose GMV change between Peak Month (June) and Decline (August)
# GMV = Lives * (GMV/Live)
# ln(GMV2/GMV1) = ln(Lives2/Lives1) + ln(Eff2/Eff1)
june_lives = monthly.loc[monthly["ym"] == "2026-06", "lives"].values[0] * 30
june_gmv = monthly.loc[monthly["ym"] == "2026-06", "gmv"].values[0]
june_eff = june_gmv / june_lives

aug_lives = monthly.loc[monthly["ym"] == "2026-08", "lives"].values[0] * 31
aug_gmv = monthly.loc[monthly["ym"] == "2026-08", "gmv"].values[0]
aug_eff = aug_gmv / aug_lives

print("\n=== PART E: EFFICIENCY DECOMPOSITION (T6 vs T8) ===")
print(f"T6: GMV = {june_gmv:,.0f} | Lives = {june_lives:.0f} | GMV/Live = {june_eff:,.0f}")
print(f"T8: GMV = {aug_gmv:,.0f} | Lives = {aug_lives:.0f} | GMV/Live = {aug_eff:,.0f}")
delta_gmv = aug_gmv - june_gmv
# Exact decomposition:
# dGMV = (Lives_aug - Lives_june) * Eff_june (Quantity effect)
#      + Lives_june * (Eff_aug - Eff_june) (Efficiency effect)
#      + (Lives_aug - Lives_june) * (Eff_aug - Eff_june) (Interaction)
q_effect = (aug_lives - june_lives) * june_eff
e_effect = june_lives * (aug_eff - june_eff)
inter = (aug_lives - june_lives) * (aug_eff - june_eff)
print(f"Total delta GMV: {delta_gmv:,.0f} VND ({delta_gmv/june_gmv*100:.1f}%)")
print(f"Quantity effect (lives drop): {q_effect:,.0f} VND ({q_effect/delta_gmv*100:.1f}%)")
print(f"Efficiency effect (gmv/live drop): {e_effect:,.0f} VND ({e_effect/delta_gmv*100:.1f}%)")
print(f"Interaction: {inter:,.0f} VND")

# Part F: MA7 vs MA28 Dead Cross
df_store["ma7"] = df_store["gmv"].rolling(7).mean()
df_store["ma28"] = df_store["gmv"].rolling(28).mean()
# Find when MA7 crosses below MA28 after peak
post_peak_cross = df_store[df_store["Date"] >= "2026-06-16"].copy()
post_peak_cross["diff"] = post_peak_cross["ma7"] - post_peak_cross["ma28"]
dead_cross = post_peak_cross[(post_peak_cross["diff"] < 0) & (post_peak_cross["diff"].shift(1) >= 0)]
print("\n=== PART F: EARLY WARNING (MA7 vs MA28 CROSS) ===")
if len(dead_cross) > 0:
    first_cross = dead_cross.iloc[0]
    print(f"Dead Cross (MA7 < MA28) Date: {first_cross['Date'].strftime('%d/%m/%Y')} | MA7: {first_cross['ma7']:,.0f} | MA28: {first_cross['ma28']:,.0f}")
