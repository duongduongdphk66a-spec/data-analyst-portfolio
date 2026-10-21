import os
import sys
import json
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

store_path = os.path.join(DATA_DIR, "Kami Ely_Store Detail Page_Data Overview (180 ngày) .xlsx")
df = pd.read_excel(store_path)
df["Date"] = pd.to_datetime(df["Date"])
df = df.rename(columns={
    "Sales Volume Increment": "units",
    "Sales Amount Increment": "gmv",
    "Number of Goods Carrying Influencers Increment": "koc",
    "Number of Goods Carrying Videos Increment": "videos",
    "Number of Goods Carrying Live Streams Increment": "lives",
})
for col in ["units", "gmv", "koc", "videos", "lives"]:
    df[col] = df[col].apply(to_num)
df = df.sort_values("Date").reset_index(drop=True)

# Weekly aggregation
# ISO week
df["iso_year"] = df["Date"].dt.isocalendar().year
df["iso_week"] = df["Date"].dt.isocalendar().week
weekly = df.groupby(["iso_year", "iso_week"]).agg(
    start_date=("Date", "min"),
    end_date=("Date", "max"),
    n_days=("Date", "count"),
    gmv=("gmv", "sum"),
    units=("units", "sum"),
    koc=("koc", "mean"),
    lives=("lives", "sum"),
    videos=("videos", "sum"),
).reset_index()

weekly["gmv_M"] = (weekly["gmv"] / 1e6).round(1)
weekly["gmv_per_live_k"] = (weekly["gmv"] / weekly["lives"] / 1e3).round(0)
weekly["label"] = weekly.apply(lambda r: f"W{r.iso_week} ({r.start_date.strftime('%d/%m')})", axis=1)

print("Weekly rows count:", len(weekly))
print(weekly[["label", "n_days", "gmv_M", "lives", "koc", "gmv_per_live_k"]].to_string())
