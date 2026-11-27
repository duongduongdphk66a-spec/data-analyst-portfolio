"""Recompute headline Kami Ely figures from the ten exported FastMoss workbooks.

Usage:  python scripts/verify_kami_data.py [folder_with_xlsx]
Default folder: data/kami (files named [Kami Ely]_<Table>_Merged.xlsx)
Each line prints: claim on the site | value recomputed from the raw files | status.
"""
import hashlib
import sys
from pathlib import Path

import pandas as pd

OFFICIAL_SHA256 = "2884bd95e154a3255b1c0272bcfe9505211a293710db406701023782eb0645ec"
_h = lambda s: hashlib.sha256(str(s).strip().lower().encode("utf-8")).hexdigest()

RAW = Path(sys.argv[1] if len(sys.argv) > 1 else "data/kami")


def load(name, cols):
    matches = sorted(RAW.glob(f"*Kami*Ely*{name}_Merged.xlsx"))
    if not matches:
        matches = sorted(RAW.glob(f"*{name}_Merged.xlsx"))
    if not matches:
        raise FileNotFoundError(f"Could not find merged workbook for {name} in {RAW}")
    df = pd.read_excel(matches[0])
    df.columns = cols
    return df


def row(label, claimed, computed, tol=0.01):
    """tol is a relative tolerance; claimed=None means informational only."""
    if claimed is None:
        status = "info"
    else:
        status = "OK" if abs(computed - claimed) <= tol * abs(claimed) else "DIFF"
    print(f"{label:<58} claimed={claimed!s:>16}  raw={computed:>18,.1f}  [{status}]")


daily = load(
    "Store_Daily_Overview_231_Days",
    "date cum_units units cum_rev rev cum_koc koc cum_vid vid cum_live live".split(),
)
daily["date"] = pd.to_datetime(daily["date"])
daily = daily.sort_values("date").reset_index(drop=True)
shop = load("Shop_Products", "name cat region price listed comm units rev".split())
kol = load("Affiliate_KOL", "id name cat region followers units rev live_gpm vid_gpm n_products".split())
alive = load("Affiliate_Livestreams", "t title hrs type cat koc kid fol acct views units rev pins".split())
clive = load("Creator_Livestreams", "t title hrs cat viewers listed ordered_items units rev rev_per_uv".split())
cvid = load("Creator_Videos", "t title dur type units rev views likes eng".split())

print(
    f"Period: {daily.date.min().date()} to {daily.date.max().date()}  ({len(daily)} days, "
    f"{daily.date.nunique()} unique, missing: {len(pd.date_range(daily.date.min(), daily.date.max()).difference(daily.date))})"
)
print("\n-- Store daily (231 days)")
row("GMV over 231 days (VND)", 15_010_000_000, daily.rev.sum(), 0.001)
row("Units over 231 days", 101_896, daily.units.sum(), 0.0001)
row("Average selling price (VND)", 147_300, daily.rev.sum() / daily.units.sum(), 0.001)
row("Peak day units", 1_936, daily.units.max(), 0.0001)
m = daily.groupby(daily.date.dt.to_period("M")).rev.sum()
row("Revenue change Jun -> Aug (%)", -83.1, (m["2026-08"] / m["2026-06"] - 1) * 100, 0.001)
w180, w90 = daily.iloc[:180], daily.iloc[90:180]
row("GMV first 180 days (VND)", 12_735_128_067, w180.rev.sum(), 0.001)
row("Units first 180 days", 85_500, w180.units.sum(), 0.01)
row("GMV days 91-180 (VND)", 6_136_205_973, w90.rev.sum(), 0.01)
row("Units days 91-180", 40_229, w90.units.sum(), 0.01)
row("Cumulative GMV column, last day (VND)  [UI 05/09: 31.6B]", 31_600_000_000, daily.cum_rev.iloc[-1], 0.01)
row("Cumulative units column, last day  [UI 05/09: 238.4k]", 238_400, daily.cum_units.iloc[-1], 0.01)

print("\n-- Shop products (339 SKUs; trailing ~90 days snapshot)")
s = shop.sort_values("rev", ascending=False)
row("SKUs in table", 339, len(shop), 0)
row("Top 12 SKUs share of GMV (%)", 80.6, s.rev.head(12).sum() / s.rev.sum() * 100, 0.001)
row("Top 1 SKU share of GMV (%)", None, s.rev.iloc[0] / s.rev.sum() * 100)
row("SKUs with zero sales", None, (shop.rev == 0).sum())
last90 = daily.iloc[-90:]
row("Table GMV vs daily file last 90 days (VND)", last90.rev.sum(), shop.rev.sum(), 0.02)

print("\n-- Affiliate / creator tables")
row("Creators in KOL list", None, len(kol))
row("Creators with revenue > 0", 329, (kol.rev > 0).sum(), 0.01)
row("Official channel share of KOL revenue (%)", 60.1, kol.loc[kol.id.map(_h) == OFFICIAL_SHA256, "rev"].sum() / kol.rev.sum() * 100, 0.005)
top2 = alive.groupby("kid").rev.sum().sort_values(ascending=False).head(2).sum()
row("Top 2 accounts share of affiliate livestream GMV (%)", 84.5, top2 / alive.rev.sum() * 100, 0.002)
official_in_aff = alive.loc[alive.kid.map(_h) == OFFICIAL_SHA256, "rev"].sum()
row("Official live GMV: Creator table (VND)", None, clive.rev.sum())
row("Official live GMV inside Affiliate table (VND) -> overlap", clive.rev.sum(), official_in_aff, 0.001)
row("Creator video GMV (VND)", None, cvid.rev.sum())

print("\n-- Row counts")
tot = sum(len(x) for x in (daily, shop, kol, alive, clive, cvid))
row("Rows in the six tables above", None, tot)

print(
    "\nNotes: [DIFF] means the site figure could not be reproduced from these files "
    "(screenshots were captured in early September 2026, while the exports run to 25 Oct 2026; "
    "FastMoss UI figures and export columns can use different windows or bases)."
)
