import os
import sys
import re
import pandas as pd
import numpy as np

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

def parse_dt(val):
    if pd.isna(val):
        return pd.NaT
    s = re.sub(r"\(UTC[+-]\d+\)", "", str(val)).strip()
    return pd.to_datetime(s, errors="coerce")

# Load Shop LIVE
live_path = os.path.join(DATA_DIR, "_shop LIVE (180 ngày) 1.xlsx")
df_live = pd.read_excel(live_path)
df_live["start_dt"] = df_live["LIVE start time"].apply(parse_dt)
df_live["gmv"] = df_live["GMV"].apply(to_num)
df_live["units"] = df_live["units sold"].apply(to_num)
df_live["creator_id"] = df_live["creator id"].astype(str).str.strip()

print(f"Total LIVE rows: {len(df_live)}")
print(f"Distinct creators in LIVE: {df_live['creator_id'].nunique()}")

# Filter out own brand: kamielyhn
df_aff = df_live[df_live["creator_id"] != "kamielyhn"].copy()
print(f"Affiliate LIVE rows: {len(df_aff)}, Affiliate creators: {df_aff['creator_id'].nunique()}")

# Monthly cohort for each affiliate creator
first_live = df_aff.groupby("creator_id").agg(
    first_dt=("start_dt", "min"),
    last_dt=("start_dt", "max"),
    total_sessions=("start_dt", "count"),
    total_gmv=("gmv", "sum"),
    total_units=("units", "sum"),
    has_sale_ever=("gmv", lambda s: (s > 0).any()),
).reset_index()

first_live["cohort_m"] = first_live["first_dt"].dt.strftime("%Y-%m")
first_live["lifespan_days"] = (first_live["last_dt"] - first_live["first_dt"]).dt.total_seconds() / 86400.0

print("\n=== 4.3.A: COHORT SIZES (NEW CREATORS BY MONTH) ===")
cohort_sizes = first_live["cohort_m"].value_counts().sort_index()
for cm, cnt in cohort_sizes.items():
    print(f"Cohort {cm}: {cnt} new creators")

# Monthly active creators
df_aff["ym"] = df_aff["start_dt"].dt.strftime("%Y-%m")
active_per_m = df_aff.groupby("ym")["creator_id"].nunique()
print("\nActive creators per month (appeared):")
for ym, cnt in active_per_m.items():
    print(f"{ym}: {cnt} active creators")

# Active with sale (GMV > 0) per month
active_sale_m = df_aff[df_aff["gmv"] > 0].groupby("ym")["creator_id"].nunique()
print("\nActive creators with sales (GMV > 0) per month:")
for ym, cnt in active_sale_m.items():
    print(f"{ym}: {cnt} active sellers")

# Retention Matrix (Appearance & Sales)
# Creator x month
cm_app = df_aff.groupby(["creator_id", "ym"]).size().reset_index(name="n_sessions")
cm_app = cm_app.merge(first_live[["creator_id", "cohort_m"]], on="creator_id")
cm_app["age_m"] = (pd.to_datetime(cm_app["ym"]) - pd.to_datetime(cm_app["cohort_m"])).dt.days // 30

# Calculate exact age in calendar months:
def month_diff(y2, m2, y1, m1):
    return (y2 - y1) * 12 + (m2 - m1)

cm_app["c_year"] = cm_app["cohort_m"].apply(lambda s: int(s[:4]))
cm_app["c_mon"] = cm_app["cohort_m"].apply(lambda s: int(s[5:7]))
cm_app["a_year"] = cm_app["ym"].apply(lambda s: int(s[:4]))
cm_app["a_mon"] = cm_app["ym"].apply(lambda s: int(s[5:7]))
cm_app["cal_age"] = month_diff(cm_app["a_year"], cm_app["a_mon"], cm_app["c_year"], cm_app["c_mon"])

ret_matrix = cm_app.groupby(["cohort_m", "cal_age"])["creator_id"].nunique().unstack(fill_value=0)
print("\n=== 4.3.B: RETENTION MATRIX (ACTIVE CREATOR COUNT) ===")
print(ret_matrix.to_string())

cohort_initial = ret_matrix[0]
ret_pct = ret_matrix.div(cohort_initial, axis=0) * 100
print("\nRetention Matrix (%):")
print(ret_pct.round(1).to_string())

# 4.3.C: Lifespan & Survival
print("\n=== 4.3.C: LIFESPAN & SURVIVAL ===")
print(f"Median lifespan (days between first & last session): {first_live['lifespan_days'].median():.1f} days")
print(f"Mean lifespan: {first_live['lifespan_days'].mean():.1f} days")
one_session_count = (first_live["total_sessions"] == 1).sum()
print(f"1-session only creators: {one_session_count}/{len(first_live)} ({one_session_count/len(first_live)*100:.1f}%)")
lived_30d = (first_live["lifespan_days"] >= 30).sum()
print(f"Lived >= 30 days: {lived_30d}/{len(first_live)} ({lived_30d/len(first_live)*100:.1f}%)")

# Active in last 30 days of dataset (dataset max date)
max_dt = df_aff["start_dt"].max()
cutoff_30d = max_dt - pd.Timedelta(days=30)
active_last_30d = (first_live["last_dt"] >= cutoff_30d).sum()
print(f"Active in last 30 days (since {cutoff_30d:%d/%m}): {active_last_30d}/{len(first_live)} ({active_last_30d/len(first_live)*100:.1f}%)")

# 4.3.D: First Session & Activation
df_aff_sorted = df_aff.sort_values(["creator_id", "start_dt"]).reset_index(drop=True)
df_aff_sorted["session_rank"] = df_aff_sorted.groupby("creator_id").cumcount() + 1
s1 = df_aff_sorted[df_aff_sorted["session_rank"] == 1]
s1_with_sale = (s1["gmv"] > 0).sum()
print("\n=== 4.3.D: ACTIVATION IN SESSION 1 ===")
print(f"Creators with sale in Session 1: {s1_with_sale}/{len(s1)} ({s1_with_sale/len(s1)*100:.1f}%)")

# Check survival of s1_sale vs s1_nosale
s1_sales_map = s1.set_index("creator_id")["gmv"] > 0
first_live["s1_had_sale"] = first_live["creator_id"].map(s1_sales_map)
med_sale = first_live[first_live["s1_had_sale"]]["lifespan_days"].median()
med_nosale = first_live[~first_live["s1_had_sale"]]["lifespan_days"].median()
sess_sale = first_live[first_live["s1_had_sale"]]["total_sessions"].median()
sess_nosale = first_live[~first_live["s1_had_sale"]]["total_sessions"].median()
print(f"S1 Sale: Median Lifespan = {med_sale:.1f} days, Median Sessions = {sess_sale}")
print(f"S1 No Sale: Median Lifespan = {med_nosale:.1f} days, Median Sessions = {sess_nosale}")

# Ever had sale
ever_sale = first_live["has_sale_ever"].sum()
print(f"Ever had sale: {ever_sale}/{len(first_live)} ({ever_sale/len(first_live)*100:.1f}%) | Never sold: {len(first_live)-ever_sale} ({(len(first_live)-ever_sale)/len(first_live)*100:.1f}%)")

# 4.3.F: Girl Style & Concentration
print("\n=== 4.3.F: GIRL STYLE & CONCENTRATION ===")
gs_rows = df_aff[df_aff["creator_id"] == "girlstyle.vn"]
total_aff_gmv = df_aff["gmv"].sum()
gs_gmv = gs_rows["gmv"].sum()
print(f"Total Affiliate Live GMV: {total_aff_gmv:,.0f} VND")
print(f"Girl Style GMV: {gs_gmv:,.0f} VND ({gs_gmv/total_aff_gmv*100:.1f}%)")
if len(gs_rows) > 0:
    print(f"Girl Style first live: {gs_rows['start_dt'].min():%d/%m/%Y}, last: {gs_rows['start_dt'].max():%d/%m/%Y}")
    print(f"Girl Style days streamed: {gs_rows['start_dt'].dt.date.nunique()}, sessions: {len(gs_rows)}")

# Cohort GMV With and Without Girl Style
first_live_gmv = df_aff.groupby(["creator_id", "ym"])["gmv"].sum().reset_index()
first_live_gmv = first_live_gmv.merge(first_live[["creator_id", "cohort_m"]], on="creator_id")

cohort_gmv_all = df_aff.merge(first_live[["creator_id", "cohort_m"]], on="creator_id").groupby("cohort_m")["gmv"].sum()
cohort_gmv_no_gs = df_aff[df_aff["creator_id"] != "girlstyle.vn"].merge(first_live[["creator_id", "cohort_m"]], on="creator_id").groupby("cohort_m")["gmv"].sum()

print("\nCohort Total GMV (With vs Without Girl Style):")
for cm in cohort_sizes.index:
    g_all = cohort_gmv_all.get(cm, 0)
    g_nogs = cohort_gmv_no_gs.get(cm, 0)
    print(f"Cohort {cm}: With GS = {g_all:,.0f} VND | Without GS = {g_nogs:,.0f} VND")

# 4.3.G: Shoppable Videos Cohort check
shop_path = os.path.join(DATA_DIR, "[Kami Ely]_Shoppable_Videos (180 ngày) .xlsx")
df_shop = pd.read_excel(shop_path)
df_shop["pub_dt"] = df_shop["Published date"].apply(parse_dt)
df_shop["creator_id"] = df_shop["creator ID"].astype(str).str.strip()
df_shop["ym"] = df_shop["pub_dt"].dt.strftime("%Y-%m")
df_shop["gmv"] = df_shop["[90 days]GMV"].apply(to_num)

print("\n=== 4.3.G: SHOPPABLE VIDEOS STATS ===")
print(f"Shoppable total videos: {len(df_shop)}, distinct creators: {df_shop['creator_id'].nunique()}")
shop_creators_by_m = df_shop.groupby("ym")["creator_id"].nunique()
for ym, cnt in shop_creators_by_m.items():
    print(f"Shoppable active creators {ym}: {cnt}")
v_with_sale = (df_shop["gmv"] > 0).sum()
print(f"Videos with GMV > 0: {v_with_sale}/{len(df_shop)} ({v_with_sale/len(df_shop)*100:.1f}%)")
