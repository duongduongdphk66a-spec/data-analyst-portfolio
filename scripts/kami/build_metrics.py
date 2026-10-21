"""
Kami Ely - Single source of truth for every number shown in the portfolio case study.

Usage:
    python scripts/kami/build_metrics.py

Reads raw telemetry exports from data/kami/ and writes
app/data/kami-ely/generated/metrics.json. Each metric carries its time window
and scope so the UI never mixes 90-day, 180-day and all-time figures.

No hand-typed statistics: every value below is computed from the raw files.
"""
from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime

import numpy as np
import pandas as pd
from scipy import stats

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT not in sys.path:
    sys.path.append(ROOT)
DATA = os.path.join(ROOT, "data", "kami")
OUT = os.path.join(ROOT, "app", "data", "kami-ely", "generated", "metrics.json")
RNG = np.random.default_rng(42)

FILES = {
    "store": "Kami Ely_Store Detail Page_Data Overview (180 ngày) .xlsx",
    "goods": "[Kami Ely]-Creator's Goods for Sale List (90 ngày).xlsx",
    "ch_live": "[Kami Ely]-Creator's Live Streaming for Goods Promotion List (180 ngày).xlsx",
    "ch_video": "[Kami Ely]-Creator's Video List (180 ngày) .xlsx",
    "shop_video": "[Kami Ely]_Shoppable_Videos (180 ngày) .xlsx",
    "product": "_ product data (90 ngày).xlsx",
    "creators": "_Creators_merged (90 ngày) .xlsx",
    "shop_live": "_shop LIVE (180 ngày) 1.xlsx",
}
SELF_ID = "kamielyhn"
GIRL_STYLE_ID = "girlstyle.vn"


# ----------------------------------------------------------------------------
# Parsing helpers
# ----------------------------------------------------------------------------
def to_num(val) -> float:
    """Parse telemetry numbers: 185,596 ₫ | 500,2Tr ₫ | 1.0m | 12.3k | 0.22%."""
    if val is None or (isinstance(val, float) and np.isnan(val)):
        return 0.0
    if isinstance(val, (int, float, np.integer, np.floating)):
        return float(val)
    s = str(val).replace("₫", "").replace("VNĐ", "").replace("%", "").strip()
    if not s or s == "-":
        return 0.0
    mult = 1.0
    low = s.lower()
    if low.endswith("tr"):  # Vietnamese "triệu", decimal comma
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


def parse_gpm_range(val) -> float:
    """'29,2k ₫-30,2k ₫' -> midpoint 29700."""
    if pd.isna(val):
        return float("nan")
    parts = [p for p in re.split(r"-(?=\s*\d)", str(val)) if p.strip()]
    nums = [to_num(p.replace(",", ".")) for p in parts]
    return float(np.mean(nums)) if nums else float("nan")


def parse_dt(val):
    if pd.isna(val):
        return pd.NaT
    s = re.sub(r"\(UTC[+-]\d+\)", "", str(val)).strip()
    return pd.to_datetime(s, errors="coerce")


import unicodedata

def find_file(name: str) -> str:
    direct = os.path.join(DATA, name)
    if os.path.exists(direct):
        return direct
    norm_name = unicodedata.normalize("NFC", name).strip()
    for f in os.listdir(DATA):
        if unicodedata.normalize("NFC", f).strip() == norm_name:
            return os.path.join(DATA, f)
    raise FileNotFoundError(f"Cannot find {name} in {DATA}")


def load(key: str) -> pd.DataFrame:
    return pd.read_excel(find_file(FILES[key]))


def r(x, nd=2):
    if x is None or (isinstance(x, float) and (np.isnan(x) or np.isinf(x))):
        return None
    return round(float(x), nd)


def metric(value, window: str, scope: str, source: str, unit: str = "", note: str | None = None):
    m = {"value": value, "window": window, "scope": scope, "source": source, "unit": unit}
    if note:
        m["note"] = note
    return m


def bootstrap_median_ci(x: np.ndarray, n: int = 5000) -> list:
    idx = RNG.integers(0, len(x), size=(n, len(x)))
    meds = np.median(x[idx], axis=1)
    return [r(np.percentile(meds, 2.5)), r(np.percentile(meds, 97.5))]


def describe(x: np.ndarray) -> dict:
    return {
        "n": int(len(x)),
        "mean": r(np.mean(x)),
        "median": r(np.median(x)),
        "std": r(np.std(x, ddof=1)) if len(x) > 1 else None,
        "p25": r(np.percentile(x, 25)),
        "p75": r(np.percentile(x, 75)),
        "skew": r(stats.skew(x)),
    }


# ----------------------------------------------------------------------------
# 1. Store daily overview (shop-wide, 226 continuous days)
# ----------------------------------------------------------------------------
def build_store(conn=None):
    df = None
    if conn is not None:
        try:
            cur = conn.cursor(dictionary=True)
            cur.execute("""
                SELECT 
                    record_date AS Date, 
                    delta_sales_units AS units, 
                    delta_gmv_vnd AS gmv,
                    delta_influencers_count AS koc, 
                    delta_videos_count AS videos, 
                    delta_livestreams_count AS lives
                FROM kami_store_daily_overview 
                ORDER BY record_date ASC;
            """)
            rows = cur.fetchall()
            cur.close()
            df = pd.DataFrame(rows)
            df["Date"] = pd.to_datetime(df["Date"])
            for c in ["units", "gmv", "koc", "videos", "lives"]:
                df[c] = df[c].astype(float)
            df = df.sort_values("Date").reset_index(drop=True)
            start, end = df["Date"].min(), df["Date"].max()
            window = f"{len(df)}N ({start:%d/%m}–{end:%d/%m/%Y})"
            src = "kami_store_daily_overview (226 ngày liên tục)"
        except Exception as e:
            print(f"Warning: Could not load store daily from MySQL: {e}")
            df = None

    if df is None:
        df = load("store")
        df["Date"] = pd.to_datetime(df["Date"])
        df = df.rename(columns={
            "Sales Volume Increment": "units",
            "Sales Amount Increment": "gmv",
            "Number of Goods Carrying Influencers Increment": "koc",
            "Number of Goods Carrying Videos Increment": "videos",
            "Number of Goods Carrying Live Streams Increment": "lives",
        })
        for c in ["units", "gmv", "koc", "videos", "lives"]:
            df[c] = df[c].apply(to_num)
        df = df.sort_values("Date").reset_index(drop=True)
        start, end = df["Date"].min(), df["Date"].max()
        window = f"180N ({start:%d/%m}–{end:%d/%m/%Y})"
        src = FILES["store"]

    df["month"] = df["Date"].dt.to_period("M")
    monthly = df.groupby("month").agg(
        days=("Date", "count"), gmv=("gmv", "sum"), units=("units", "sum"),
        koc=("koc", "mean"), lives=("lives", "mean"), videos=("videos", "mean"),
    ).reset_index()
    monthly["gmv_per_day"] = monthly["gmv"] / monthly["days"]
    monthly["mom_raw_pct"] = monthly["gmv"].pct_change() * 100
    monthly["mom_per_day_pct"] = monthly["gmv_per_day"].pct_change() * 100
    total = df["gmv"].sum()
    monthly_rows = [{
        "month": str(m.month), "days": int(m.days), "isPartial": bool(m.days < m.month.days_in_month),
        "gmv": r(m.gmv, 0), "units": int(m.units), "gmvPerDay": r(m.gmv_per_day, 0),
        "shareOfTotalPct": r(m.gmv / total * 100), "momRawPct": r(m.mom_raw_pct),
        "momPerDayPct": r(m.mom_per_day_pct),
        "avgKocPerDay": r(m.koc, 1), "avgLivesPerDay": r(m.lives, 1), "avgVideosPerDay": r(m.videos, 1),
    } for m in monthly.itertuples()]

    peak_i, low_i = df["gmv"].idxmax(), df["gmv"].idxmin()
    full_months = monthly[monthly["days"] == monthly["month"].apply(lambda p: p.days_in_month)]
    peak_m = full_months.loc[full_months["gmv"].idxmax()]
    last_full = full_months.iloc[-1]

    # Outliers: z-score on raw + robust (median/MAD) because daily GMV is right-skewed
    mu, sd = df["gmv"].mean(), df["gmv"].std()
    med = df["gmv"].median()
    mad = stats.median_abs_deviation(df["gmv"], scale="normal")
    df["z"] = (df["gmv"] - mu) / sd
    df["robust_z"] = (df["gmv"] - med) / mad
    outliers = df[(df["z"].abs() > 3) | (df["robust_z"].abs() > 3.5)]

    # Marketing intensity vs GMV (daily). Spearman because of skew; also lag-adjusted.
    corr = {}
    for c, label in [("koc", "KOC gắn sản phẩm/ngày"), ("lives", "Phiên LIVE gắn sản phẩm/ngày"), ("videos", "Video gắn sản phẩm/ngày")]:
        rho, p = stats.spearmanr(df[c], df["gmv"])
        pr, pp = stats.pearsonr(df[c], df["gmv"])
        corr[c] = {"label": label, "spearmanRho": r(rho, 3), "spearmanP": float(f"{p:.3g}"),
                   "pearsonR": r(pr, 3), "pearsonP": float(f"{pp:.3g}")}

    # Partial: does marketing still correlate with GMV after removing the month (seasonal) effect?
    df["gmv_dm"] = df["gmv"] - df.groupby("month")["gmv"].transform("mean")
    for c in ["koc", "lives", "videos"]:
        x = df[c] - df.groupby("month")[c].transform("mean")
        rho, p = stats.spearmanr(x, df["gmv_dm"])
        corr[c]["withinMonthSpearmanRho"] = r(rho, 3)
        corr[c]["withinMonthSpearmanP"] = float(f"{p:.3g}")

    # Day-of-week profile (within-week seasonality, NOT summer seasonality)
    dow = df.assign(dow=df["Date"].dt.dayofweek).groupby("dow")["gmv"].median()
    dow_names = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

    daily = [{"date": d.Date.strftime("%Y-%m-%d"), "gmv": int(d.gmv), "units": int(d.units),
              "koc": int(d.koc), "lives": int(d.lives), "videos": int(d.videos)} for d in df.itertuples()]

    return {
        "window": window, "source": src,
        "totals": {
            "gmv": metric(r(total, 0), window, "Toàn shop", src, "VND"),
            "units": metric(int(df["units"].sum()), window, "Toàn shop", src, "sản phẩm"),
            "avgGmvPerDay": metric(r(mu, 0), window, "Toàn shop", src, "VND"),
            "medianGmvPerDay": metric(r(med, 0), window, "Toàn shop", src, "VND"),
            "stdGmvPerDay": metric(r(sd, 0), window, "Toàn shop", src, "VND"),
            "avgUnitsPerDay": metric(r(df["units"].mean(), 0), window, "Toàn shop", src, "sản phẩm"),
            "avgKocPerDay": metric(r(df["koc"].mean(), 1), window, "Toàn shop", src),
            "avgLivesPerDay": metric(r(df["lives"].mean(), 1), window, "Toàn shop", src),
            "avgVideosPerDay": metric(r(df["videos"].mean(), 1), window, "Toàn shop", src),
        },
        "peakDay": {"date": df.loc[peak_i, "Date"].strftime("%Y-%m-%d"), "gmv": int(df.loc[peak_i, "gmv"]), "units": int(df.loc[peak_i, "units"])},
        "lowDay": {"date": df.loc[low_i, "Date"].strftime("%Y-%m-%d"), "gmv": int(df.loc[low_i, "gmv"]), "units": int(df.loc[low_i, "units"])},
        "peakMonth": {"month": str(peak_m["month"]), "gmv": r(peak_m["gmv"], 0), "gmvPerDay": r(peak_m["gmv_per_day"], 0)},
        "declineFromPeak": {
            "toMonth": str(last_full["month"]),
            "gmvDropPct": r((1 - last_full["gmv"] / peak_m["gmv"]) * 100),
            "gmvPerDayDropPct": r((1 - last_full["gmv_per_day"] / peak_m["gmv_per_day"]) * 100),
            "note": "So sánh giữa 2 tháng đủ ngày.",
        },
        "monthly": monthly_rows,
        "outliers": [{"date": o.Date.strftime("%Y-%m-%d"), "gmv": int(o.gmv), "z": r(o.z), "robustZ": r(o.robust_z)} for o in outliers.itertuples()],
        "outlierMethod": "|z| > 3 hoặc robust z (median/MAD) > 3.5",
        "marketingCorrelation": corr,
        "dayOfWeekMedianGmv": [{"day": dow_names[i], "medianGmv": r(v, 0)} for i, v in dow.items()],
        "daily": daily,
    }


# ----------------------------------------------------------------------------
# 2. Channel (@kamielyhn) LIVE + videos, and the Video vs Live GPM test
# ----------------------------------------------------------------------------
def build_channel():
    lv = load("ch_live")
    lv["start"] = pd.to_datetime(lv["Start Time"], errors="coerce")
    lv["hours"] = lv["Live Streaming Duration"].apply(to_num)
    lv["viewers"] = lv["Total Viewers"].apply(to_num)
    lv["gmv"] = lv["Live GMV"].apply(to_num)
    lv["units"] = lv["LIVE Units Sold"].apply(to_num)
    src_l = FILES["ch_live"]
    wl = f"180N ({lv['start'].min():%d/%m}–{lv['start'].max():%d/%m/%Y})"

    with_orders = int((lv["units"] > 0).sum())
    # Duration buckets: GMV per hour, within observed range (no extrapolation)
    bins = [0, 1, 2, 3, 4, 6, 24]
    labels = ["<1h", "1–2h", "2–3h", "3–4h", "4–6h", "≥6h"]
    lv["bucket"] = pd.cut(lv["hours"], bins=bins, labels=labels, right=False)
    bucket = lv.groupby("bucket", observed=False).agg(
        sessions=("gmv", "size"), gmv_med=("gmv", "median"), gmv_sum=("gmv", "sum"), hours_sum=("hours", "sum"),
        conv=("units", lambda s: (s > 0).mean() * 100)).reset_index()
    bucket["gmv_per_hour"] = bucket["gmv_sum"] / bucket["hours_sum"].replace(0, np.nan)
    rho_d, p_d = stats.spearmanr(lv["hours"], lv["gmv"])
    lv["gmv_per_hour"] = lv["gmv"] / lv["hours"].replace(0, np.nan)
    rho_dh, p_dh = stats.spearmanr(lv["hours"], lv["gmv_per_hour"], nan_policy="omit")

    # Hour-of-day for LIVE start
    lv["hour"] = lv["start"].dt.hour
    by_hour = lv.groupby("hour").agg(sessions=("gmv", "size"), gmv_med=("gmv", "median"), gmv_sum=("gmv", "sum")).reset_index()

    vd = load("ch_video")
    vd["published"] = pd.to_datetime(vd["Publish Date"], errors="coerce")
    vd["views"] = vd["Views"].apply(to_num)
    vd["gmv"] = vd["Video GMV"].apply(to_num)
    vd["units"] = vd["Units Sold"].apply(to_num)
    vd["er"] = vd["Interaction Rate"].apply(to_num)
    src_v = FILES["ch_video"]
    wv = f"180N ({vd['published'].min():%d/%m}–{vd['published'].max():%d/%m/%Y})"
    shoppable = vd[vd["Video Type"].astype(str).str.contains("Shoppable", case=False)]
    vd["hour"] = vd["published"].dt.hour
    er_by_hour = vd.groupby("hour").agg(videos=("er", "size"), er_median=("er", "median"), views_median=("views", "median")).reset_index()

    # ---- GPM test ---------------------------------------------------------
    # Video GPM = GMV / views * 1000 (per shoppable video with views > 0)
    # Live  GPM = GMV / total viewers * 1000 (per session with viewers > 0)
    # Denominators differ (views vs unique viewers) -> stated as a limitation.
    v = shoppable[shoppable["views"] > 0]
    l = lv[lv["viewers"] > 0]
    gv = (v["gmv"] / v["views"] * 1000).to_numpy()
    gl = (l["gmv"] / l["viewers"] * 1000).to_numpy()
    mw = stats.mannwhitneyu(gv, gl, alternative="greater")
    rank_biserial = 1 - 2 * mw.statistic / (len(gv) * len(gl))  # sign: positive => video > live
    rank_biserial = -rank_biserial
    welch_log = stats.ttest_ind(np.log1p(gv), np.log1p(gl), equal_var=False, alternative="greater")
    agg_gv = v["gmv"].sum() / v["views"].sum() * 1000
    agg_gl = l["gmv"].sum() / l["viewers"].sum() * 1000
    hyp = {
        "test": "Mann-Whitney U (một phía) + Welch t-test trên log(1+GPM)",
        "h0": "Phân phối GPM của Video không cao hơn LIVE",
        "h1": "GPM của Video cao hơn LIVE (một phía)",
        "alpha": 0.05,
        "video": {**describe(gv), "medianCI95": bootstrap_median_ci(gv), "aggregateGpm": r(agg_gv, 0),
                  "zeroGmvSharePct": r((gv == 0).mean() * 100)},
        "live": {**describe(gl), "medianCI95": bootstrap_median_ci(gl), "aggregateGpm": r(agg_gl, 0),
                 "zeroGmvSharePct": r((gl == 0).mean() * 100)},
        "mannWhitneyU": r(mw.statistic, 1),
        "mannWhitneyP": float(f"{mw.pvalue:.3g}"),
        "rankBiserial": r(rank_biserial, 3),
        "welchLogT": r(welch_log.statistic, 3),
        "welchLogP": float(f"{welch_log.pvalue:.3g}"),
        "aggregateRatio": r(agg_gv / agg_gl, 2),
        "isSignificant": bool(mw.pvalue < 0.05),
        "window": "180N", "scope": "Kênh chính chủ @kamielyhn",
        "source": f"{src_v} + {src_l}",
        "limitations": [
            "Mẫu số khác nhau: Video dùng lượt xem, LIVE dùng tổng người xem phiên.",
            "Video là tài sản dài hạn (doanh thu tích lũy); LIVE là sự kiện một lần.",
            "Dữ liệu quan sát, không phải thí nghiệm ngẫu nhiên: chỉ kết luận được 'khác biệt', không kết luận nhân quả.",
        ],
        "platformReported28d": {"videoGpm": "134,8k–135,2k ₫", "liveGpm": "29,2k–30,2k ₫",
                                "source": FILES["creators"], "note": "Số báo cáo ghi nhận, khung 28 ngày."},
    }

    return {
        "live": {
            "window": wl, "source": src_l,
            "sessions": metric(int(len(lv)), wl, "Kênh chính chủ", src_l, "phiên"),
            "sessionsWithOrders": metric(with_orders, wl, "Kênh chính chủ", src_l, "phiên"),
            "conversionPct": metric(r(with_orders / len(lv) * 100), wl, "Kênh chính chủ", src_l, "%"),
            "gmv": metric(r(lv["gmv"].sum(), 0), wl, "Kênh chính chủ", src_l, "VND"),
            "units": metric(int(lv["units"].sum()), wl, "Kênh chính chủ", src_l, "sản phẩm"),
            "gmvPerSession": {"mean": r(lv["gmv"].mean(), 0), "median": r(lv["gmv"].median(), 0)},
            "hours": {"mean": r(lv["hours"].mean()), "median": r(lv["hours"].median()), "total": r(lv["hours"].sum(), 1)},
            "durationBuckets": [{"bucket": str(b.bucket), "sessions": int(b.sessions), "medianGmv": r(b.gmv_med, 0),
                                 "gmvPerHour": r(b.gmv_per_hour, 0), "conversionPct": r(b.conv, 1)} for b in bucket.itertuples()],
            "durationVsGmvSpearman": {"rho": r(rho_d, 3), "p": float(f"{p_d:.3g}")},
            "durationVsGmvPerHourSpearman": {"rho": r(rho_dh, 3), "p": float(f"{p_dh:.3g}")},
            "byStartHour": [{"hour": int(h.hour), "sessions": int(h.sessions), "medianGmv": r(h.gmv_med, 0), "gmv": r(h.gmv_sum, 0)} for h in by_hour.itertuples()],
        },
        "video": {
            "window": wv, "source": src_v,
            "videos": metric(int(len(vd)), wv, "Kênh chính chủ", src_v, "video"),
            "shoppable": metric(int(len(shoppable)), wv, "Kênh chính chủ", src_v, "video"),
            "withOrders": metric(int((vd["units"] > 0).sum()), wv, "Kênh chính chủ", src_v, "video"),
            "conversionPct": metric(r((vd["units"] > 0).mean() * 100), wv, "Kênh chính chủ", src_v, "%",
                                    note="Tỷ lệ trên toàn bộ video trong danh sách."),
            "shoppableConversionPct": metric(r((shoppable["units"] > 0).mean() * 100), wv, "Kênh chính chủ", src_v, "%"),
            "gmv": metric(r(vd["gmv"].sum(), 0), wv, "Kênh chính chủ", src_v, "VND"),
            "views": {"total": int(vd["views"].sum()), "mean": r(vd["views"].mean(), 0), "median": r(vd["views"].median(), 0)},
            "top10GmvSharePct": r(vd["gmv"].nlargest(10).sum() / max(vd["gmv"].sum(), 1) * 100),
            "engagementByHour": [{"hour": int(h.hour), "videos": int(h.videos), "medianEr": r(h.er_median, 3),
                                  "medianViews": r(h.views_median, 0)} for h in er_by_hour.itertuples()],
        },
        "hypothesis": hyp,
    }


# ----------------------------------------------------------------------------
# 3. Shop-wide LIVE (own + affiliate, 180 days) + Girl Style concentration
# ----------------------------------------------------------------------------
def build_shop_live():
    df = load("shop_live")
    df["start"] = df["LIVE start time"].apply(parse_dt)
    df["gmv"] = df["GMV"].apply(to_num)
    df["units"] = df["units sold"].apply(to_num)
    df["hours"] = df["LIVE duration"].apply(to_num)
    src = FILES["shop_live"]
    w = f"180N ({df['start'].min():%d/%m}–{df['start'].max():%d/%m/%Y})"
    tot_g, tot_u = df["gmv"].sum(), df["units"].sum()

    by_type = df.groupby("LIVE type").agg(sessions=("gmv", "size"), units=("units", "sum"), gmv=("gmv", "sum"),
                                          with_orders=("units", lambda s: int((s > 0).sum()))).reset_index()
    types = [{"type": t["LIVE type"], "sessions": int(t.sessions), "sessionSharePct": r(t.sessions / len(df) * 100),
              "units": int(t.units), "unitsSharePct": r(t.units / tot_u * 100), "gmv": r(t.gmv, 0),
              "gmvSharePct": r(t.gmv / tot_g * 100), "gmvPerSession": r(t.gmv / t.sessions, 0),
              "conversionPct": r(t.with_orders / t.sessions * 100)} for _, t in by_type.iterrows()]

    aff = df[df["LIVE type"].str.contains("Affiliate", case=False, na=False)]
    by_creator = aff.groupby("creator id").agg(name=("creator name", "first"), sessions=("gmv", "size"),
                                               units=("units", "sum"), gmv=("gmv", "sum"),
                                               followers=("followers", "max")).sort_values("gmv", ascending=False)
    aff_g = aff["gmv"].sum()
    shares = by_creator["gmv"] / aff_g
    hhi = float((shares ** 2).sum() * 10000)
    gs = by_creator.loc[GIRL_STYLE_ID] if GIRL_STYLE_ID in by_creator.index else None
    rest = by_creator.drop(index=GIRL_STYLE_ID, errors="ignore")
    rest_sessions = aff[aff["creator id"] != GIRL_STYLE_ID]

    gs_block = None
    if gs is not None:
        gs_block = {
            "sessions": int(gs.sessions), "units": int(gs.units), "gmv": r(gs.gmv, 0),
            "gmvPerSession": r(gs.gmv / gs.sessions, 0), "unitsPerSession": r(gs.units / gs.sessions, 1),
            "shareOfAffiliateLiveGmvPct": r(gs.gmv / aff_g * 100),
            "shareOfAffiliateLiveSessionsPct": r(gs.sessions / len(aff) * 100),
            "shareOfAllLiveGmvPct": r(gs.gmv / tot_g * 100),
            "otherAffiliatesGmvPerSession": r(rest_sessions["gmv"].sum() / len(rest_sessions), 0),
            "allAffiliatesGmvPerSession": r(aff_g / len(aff), 0),
            "multipleVsOtherAffiliates": r((gs.gmv / gs.sessions) / (rest_sessions["gmv"].sum() / len(rest_sessions)), 1),
            "multipleVsAllAffiliatesAvg": r((gs.gmv / gs.sessions) / (aff_g / len(aff)), 1),
        }
        # Monthly trend for Girl Style
        g = aff[aff["creator id"] == GIRL_STYLE_ID].copy()
        g["month"] = g["start"].dt.to_period("M").astype(str)
        gs_block["monthly"] = [
            {"month": m, "sessions": int(len(x)), "gmv": r(x["gmv"].sum(), 0), "liveHours": r(x["hours"].sum(), 1)}
            for m, x in g.groupby("month")
        ]

    # In-House Dual Channel Analysis:
    # Girl Style is an in-house satellite channel operated by the SAME internal team as @kamielyhn.
    inhouse_sessions = len(df[df["LIVE type"].str.contains("Shop", case=False, na=False)]) + (gs["sessions"] if gs is not None else 0)
    inhouse_units = df[df["LIVE type"].str.contains("Shop", case=False, na=False)]["units"].sum() + (gs["units"] if gs is not None else 0)
    inhouse_gmv = df[df["LIVE type"].str.contains("Shop", case=False, na=False)]["gmv"].sum() + (gs["gmv"] if gs is not None else 0)

    true_ext_sessions = len(rest_sessions)
    true_ext_units = rest_sessions["units"].sum()
    true_ext_gmv = rest_sessions["gmv"].sum()

    inhouse_dual = {
        "channelNames": ["Kami Ely (@kamielyhn)", "Girl Style (@girlstyle.vn)"],
        "nature": "Đội ngũ in-house vận hành song song 2 kênh (Kênh chính + Kênh vệ tinh)",
        "sessions": int(inhouse_sessions),
        "sessionSharePct": r(inhouse_sessions / len(df) * 100),
        "units": int(inhouse_units),
        "unitsSharePct": r(inhouse_units / tot_u * 100),
        "gmv": r(inhouse_gmv, 0),
        "gmvSharePct": r(inhouse_gmv / tot_g * 100),
        "gmvPerSession": r(inhouse_gmv / inhouse_sessions, 0) if inhouse_sessions else 0,
        "trueExternalAffiliate": {
            "sessions": int(true_ext_sessions),
            "sessionSharePct": r(true_ext_sessions / len(df) * 100),
            "units": int(true_ext_units),
            "unitsSharePct": r(true_ext_units / tot_u * 100),
            "gmv": r(true_ext_gmv, 0),
            "gmvSharePct": r(true_ext_gmv / tot_g * 100),
            "gmvPerSession": r(true_ext_gmv / true_ext_sessions, 0) if true_ext_sessions else 0,
        },
        "inhouseOverExternalMultiple": r((inhouse_gmv / inhouse_sessions) / (true_ext_gmv / true_ext_sessions), 1) if (true_ext_sessions and true_ext_gmv) else 0,
    }

    return {
        "window": w, "source": src,
        "sessions": metric(int(len(df)), w, "Toàn shop (chính chủ + affiliate)", src, "phiên"),
        "gmv": metric(r(tot_g, 0), w, "Toàn shop (chính chủ + affiliate)", src, "VND"),
        "units": metric(int(tot_u), w, "Toàn shop (chính chủ + affiliate)", src, "sản phẩm"),
        "byType": types,
        "inhouseDualChannel": inhouse_dual,
        "affiliate": {
            "uniqueCreators": int(by_creator.shape[0]),
            "creatorsWithOrders": int((by_creator["units"] > 0).sum()),
            "gmv": r(aff_g, 0),
            "hhi": r(hhi, 0),
            "hhiNote": "HHI > 2500 = tập trung cao (thang 0–10.000).",
            "top1SharePct": r(shares.iloc[0] * 100),
            "top5SharePct": r(shares.iloc[:5].sum() * 100),
            "top10SharePct": r(shares.iloc[:10].sum() * 100),
            "top10": [{"id": i, "name": str(c["name"]), "sessions": int(c.sessions), "gmv": r(c.gmv, 0),
                       "sharePct": r(c.gmv / aff_g * 100), "followers": int(to_num(c.followers))} for i, c in by_creator.head(10).iterrows()],
        },
        "girlStyle": gs_block,
        "secondAffiliate": {"id": rest.index[0], "name": str(rest.iloc[0]["name"]), "gmv": r(rest.iloc[0]["gmv"], 0)} if len(rest) else None,
        "monthly": [
            {"month": m, "sessions": int(len(x)), "gmv": r(x["gmv"].sum(), 0), "liveHours": r(x["hours"].sum(), 1)}
            for m, x in df.groupby(df["start"].dt.to_period("M").astype(str))
        ],
    }


# ----------------------------------------------------------------------------
# 4. Creators merged (90 days) - affiliate network
# ----------------------------------------------------------------------------
def build_creators():
    df = load("creators")
    df["followers"] = df["Followers"].apply(to_num)
    df["units"] = df["[90 day] Units sold"].apply(to_num)
    df["gmv"] = df["[90 day] GMV"].apply(to_num)
    src = FILES["creators"]
    w = "90N"
    self_row = df[df["Creator id"] == SELF_ID]
    aff = df[df["Creator id"] != SELF_ID].copy()
    sellers = aff[aff["units"] > 0].copy()
    aff_g, aff_u = aff["gmv"].sum(), aff["units"].sum()

    tiers = [(0, 1e3, "≤1k"), (1e3, 5e3, "1k–5k"), (5e3, 1e4, "5k–10k"), (1e4, 5e4, "10k–50k"), (5e4, 1e5, "50k–100k"), (1e5, np.inf, ">100k")]
    tier_rows = []
    for lo, hi, lab in tiers:
        allm = aff[(aff["followers"] > lo if lo else aff["followers"] >= 0) & (aff["followers"] <= hi)]
        sm = allm[allm["units"] > 0]
        tier_rows.append({
            "tier": lab,
            "creators": int(len(allm)), "creatorsSharePct": r(len(allm) / len(aff) * 100),
            "sellers": int(len(sm)), "sellersSharePct": r(len(sm) / len(sellers) * 100),
            "activationRatePct": r(len(sm) / len(allm) * 100) if len(allm) else None,
            "units": int(sm["units"].sum()), "unitsSharePct": r(sm["units"].sum() / aff_u * 100),
            "gmv": r(sm["gmv"].sum(), 0), "gmvSharePct": r(sm["gmv"].sum() / aff_g * 100),
            "gmvPerSeller": r(sm["gmv"].sum() / len(sm), 0) if len(sm) else None,
        })
    # Same tiers excluding Girl Style (an extreme outlier that sits in the 1k-5k tier)
    no_gs = sellers[sellers["Creator id"] != GIRL_STYLE_ID]
    tier_rows_ex = []
    for lo, hi, lab in tiers:
        sm = no_gs[(no_gs["followers"] > lo if lo else no_gs["followers"] >= 0) & (no_gs["followers"] <= hi)]
        tier_rows_ex.append({"tier": lab, "gmvSharePct": r(sm["gmv"].sum() / no_gs["gmv"].sum() * 100)})

    cat = sellers.groupby("Creator type").agg(n=("gmv", "size"), gmv=("gmv", "sum")).sort_values("gmv", ascending=False)
    cat_rows = [{"category": k, "sellers": int(c.n), "sellersSharePct": r(c.n / len(sellers) * 100),
                 "gmvSharePct": r(c.gmv / aff_g * 100)} for k, c in cat.iterrows()]

    ranked = aff.sort_values("gmv", ascending=False)
    gs = ranked[ranked["Creator id"] == GIRL_STYLE_ID]
    shares = ranked["gmv"] / aff_g
    cum = shares.cumsum().to_numpy()
    n80 = int(np.searchsorted(cum, 0.8) + 1)

    return {
        "window": w, "source": src,
        "registered": metric(int(len(aff)), w, "Mạng lưới affiliate", src, "creator",
                             note="Không tính tài khoản chính chủ."),
        "sellers": metric(int(len(sellers)), w, "Mạng lưới affiliate", src, "creator"),
        "activationRatePct": metric(r(len(sellers) / len(aff) * 100), w, "Mạng lưới affiliate", src, "%"),
        "dormantPct": metric(r((1 - len(sellers) / len(aff)) * 100), w, "Mạng lưới affiliate", src, "%"),
        "gmv": metric(r(aff_g, 0), w, "Mạng lưới affiliate", src, "VND"),
        "units": metric(int(aff_u), w, "Mạng lưới affiliate", src, "sản phẩm"),
        "selfChannel": {"gmv": r(self_row["gmv"].sum(), 0), "units": int(self_row["units"].sum()),
                        "followers": int(self_row["followers"].max()) if len(self_row) else None},
        "inhouseDualChannel90d": {
            "channelNames": ["Kami Ely (@kamielyhn)", "Girl Style (@girlstyle.vn)"],
            "nature": "Hai kênh trực thuộc cùng đội ngũ in-house vận hành",
            "gmv": r(self_row["gmv"].sum() + (gs["gmv"].sum() if len(gs) else 0), 0),
            "units": int(self_row["units"].sum() + (gs["units"].sum() if len(gs) else 0)),
            "shareOfTotalCreatorGmvPct": r((self_row["gmv"].sum() + (gs["gmv"].sum() if len(gs) else 0)) / (self_row["gmv"].sum() + aff_g) * 100),
            "trueExternalAffiliateGmv": r(aff_g - (gs["gmv"].sum() if len(gs) else 0), 0),
            "trueExternalAffiliateUnits": int(aff_u - (gs["units"].sum() if len(gs) else 0)),
            "trueExternalAffiliateSharePct": r((aff_g - (gs["gmv"].sum() if len(gs) else 0)) / (self_row["gmv"].sum() + aff_g) * 100),
        },
        "followerTiers": tier_rows,
        "followerTiersExGirlStyle": tier_rows_ex,
        "categories": cat_rows,
        "girlStyle": {"gmv": r(gs["gmv"].sum(), 0), "units": int(gs["units"].sum()),
                      "followers": int(gs["followers"].max()) if len(gs) else None,
                      "shareOfAffiliateGmvPct": r(gs["gmv"].sum() / aff_g * 100)},
        "second": {"id": ranked.iloc[1]["Creator id"], "name": str(ranked.iloc[1]["Creator name"]), "gmv": r(ranked.iloc[1]["gmv"], 0)},
        "top1Over2nd": r(ranked.iloc[0]["gmv"] / ranked.iloc[1]["gmv"], 1),
        "creatorsFor80PctGmv": n80,
        "top10SharePct": r(shares.iloc[:10].sum() * 100),
    }


# ----------------------------------------------------------------------------
# 5. Products (90 days) - Pareto, dead stock, category, price band
# ----------------------------------------------------------------------------
def build_products():
    df = load("product")
    df["units"] = df["Units sold (90 day)"].apply(to_num)
    df["gmv"] = df["GMV (- 90 day)"].apply(to_num)
    df["price"] = df["Price"].apply(to_num)
    df["cat1"] = df["Category"].astype(str).str.split("/").str[0]
    df["cat3"] = df["Category"].astype(str).str.split("/").str[-1]
    src = FILES["product"]
    w = "90N"
    tot_g, tot_u = df["gmv"].sum(), df["units"].sum()
    srt = df.sort_values("gmv", ascending=False).reset_index(drop=True)
    cum = (srt["gmv"].cumsum() / tot_g).to_numpy()
    n80 = int(np.searchsorted(cum, 0.8) + 1)
    p95 = df["units"].quantile(0.95)
    hero = df[df["units"] >= p95]
    dead = df[df["units"] <= 0]
    swim = df["Category"].astype(str).str.contains("Swimwear", case=False)

    cats = df.groupby("cat1").agg(skus=("gmv", "size"), units=("units", "sum"), gmv=("gmv", "sum"),
                                  dead=("units", lambda s: int((s <= 0).sum()))).sort_values("gmv", ascending=False)
    cat_rows = [{"category": k, "skus": int(c.skus), "skuSharePct": r(c.skus / len(df) * 100),
                 "unitsSharePct": r(c.units / tot_u * 100), "gmvSharePct": r(c.gmv / tot_g * 100),
                 "deadSkus": int(c.dead)} for k, c in cats.iterrows()]

    bands = [(0, 75000, "<75k"), (75000, 150000, "75k–150k"), (150000, 250000, "150k–250k"), (250000, np.inf, ">250k")]
    band_rows = []
    for lo, hi, lab in bands:
        b = df[(df["price"] >= lo) & (df["price"] < hi)]
        band_rows.append({"band": lab, "skus": int(len(b)), "skuSharePct": r(len(b) / len(df) * 100),
                          "unitsSharePct": r(b["units"].sum() / tot_u * 100), "gmvSharePct": r(b["gmv"].sum() / tot_g * 100)})

    gini = 1 - 2 * np.trapezoid(np.concatenate([[0], np.cumsum(np.sort(df["gmv"].to_numpy())) / tot_g]), dx=1 / len(df))
    return {
        "window": w, "source": src,
        "skus": metric(int(len(df)), w, "Toàn shop", src, "SKU"),
        "gmv": metric(r(tot_g, 0), w, "Toàn shop", src, "VND"),
        "units": metric(int(tot_u), w, "Toàn shop", src, "sản phẩm"),
        "skusWithSales": metric(int((df["units"] > 0).sum()), w, "Toàn shop", src, "SKU"),
        "deadSkus": metric(int(len(dead)), w, "Toàn shop", src, "SKU", note="0 sản phẩm bán ra trong 90 ngày."),
        "deadSkuPct": metric(r(len(dead) / len(df) * 100), w, "Toàn shop", src, "%"),
        "skusFor80PctGmv": n80,
        "skusFor80PctGmvPct": r(n80 / len(df) * 100),
        "giniGmv": r(gini, 3),
        "p95Units": r(p95, 1),
        "heroSkus": int(len(hero)),
        "heroGmvSharePct": r(hero["gmv"].sum() / tot_g * 100),
        "swimwearGmvSharePct": r(df.loc[swim, "gmv"].sum() / tot_g * 100),
        "top10": [{"name": str(p["Product name"])[:70], "category": p.cat3, "price": r(p.price, 0), "units": int(p.units),
                   "gmv": r(p.gmv, 0), "sharePct": r(p.gmv / tot_g * 100)} for _, p in srt.head(10).iterrows()],
        "categories": cat_rows,
        "priceBands": band_rows,
        "paretoCurve": [{"skuPct": r((i + 1) / len(df) * 100, 1), "gmvPct": r(c * 100, 1)} for i, c in enumerate(cum) if i % 5 == 0 or i == len(cum) - 1],
    }


# ----------------------------------------------------------------------------
# 6. Shop-wide shoppable videos (180d published, 90d sales)
# ----------------------------------------------------------------------------
def build_shop_videos():
    df = load("shop_video")
    df["views"] = df["Views"].apply(to_num)
    df["units"] = df["[ 90 days]Units sold"].apply(to_num)
    df["gmv"] = df["[90 days]GMV"].apply(to_num)
    src = FILES["shop_video"]
    w = "Đăng trong 180N, doanh số 90N"
    is_self = df["creator ID"] == SELF_ID
    grp = lambda d: {"videos": int(len(d)), "withOrders": int((d["units"] > 0).sum()),
                     "conversionPct": r((d["units"] > 0).mean() * 100) if len(d) else None,
                     "gmv": r(d["gmv"].sum(), 0), "views": int(d["views"].sum()),
                     "gpm": r(d["gmv"].sum() / d["views"].sum() * 1000, 0) if d["views"].sum() else None}
    return {
        "window": w, "source": src,
        "note": "Khung thời gian lệch: video đăng trong 180 ngày nhưng doanh số chỉ tính 90 ngày.",
        "all": grp(df), "self": grp(df[is_self]), "affiliate": grp(df[~is_self]),
        "uniqueCreators": int(df["creator ID"].nunique()),
        "adsSharePct": r((df["ads"].astype(str).str.upper() == "YES").mean() * 100),
    }


# ----------------------------------------------------------------------------
# 7. Channel goods (Multi-Snapshot Option A: Summer + Autumn)
# ----------------------------------------------------------------------------
def build_goods(conn=None):
    if conn is not None:
        try:
            cur = conn.cursor(dictionary=True)
            cur.execute("SELECT * FROM kami_creator_products;")
            rows = cur.fetchall()
            cur.close()
            if rows:
                df = pd.DataFrame(rows)
                df["units"] = df["units_sold_raw"].apply(to_num)
                df["gmv"] = df["revenue_raw"].apply(to_num)
                own = df["shop_name"].astype(str).str.strip().str.lower() == "kami ely"
                summer_df = df[df["snapshot_period"].str.contains("2026-09")]
                autumn_df = df[df["snapshot_period"].str.contains("2026-10")]
                return {
                    "window": "2 Snapshot 90N (Kỳ Hè 04/09 & Kỳ Thu 20/10)",
                    "source": "kami_creator_products (MySQL SSOT)",
                    "products": int(len(df)),
                    "ownStoreProducts": int(own.sum()),
                    "otherStoreProducts": int((~own).sum()),
                    "productsWithSales": int((df["units"] > 0).sum()),
                    "units": int(df["units"].sum()),
                    "gmv": r(df["gmv"].sum(), 0),
                    "summerSnapshot": {
                        "products": int(len(summer_df)),
                        "units": int(summer_df["units"].sum()),
                        "gmv": r(summer_df["gmv"].sum(), 0),
                    },
                    "autumnSnapshot": {
                        "products": int(len(autumn_df)),
                        "units": int(autumn_df["units"].sum()),
                        "gmv": r(autumn_df["gmv"].sum(), 0),
                    },
                    "note": "Hợp nhất theo Phương án A: phân vùng snapshot_period, bảo toàn cả 2 chu kỳ bán hàng 90 ngày.",
                }
        except Exception as e:
            print(f"Warning: Could not load goods from MySQL: {e}")

    df = load("goods")
    df["units"] = df["Units Sold"].apply(to_num)
    df["gmv"] = df["Total GMV"].apply(to_num)
    own = df["Owned Store Name"].astype(str).str.strip().str.lower() == "kami ely"
    return {
        "window": "90N", "source": FILES["goods"],
        "products": int(len(df)), "ownStoreProducts": int(own.sum()),
        "otherStoreProducts": int((~own).sum()),
        "productsWithSales": int((df["units"] > 0).sum()),
        "units": int(df["units"].sum()), "gmv": r(df["gmv"].sum(), 0),
        "note": "GMV ở định dạng rút gọn (vd 500,2Tr ₫) nên chỉ chính xác tới 0,1 triệu.",
    }


def build_data_scope(frames_meta):
    return frames_meta


def main():
    conn = None
    try:
        from scripts.kami.import_kami_all_timeframes import get_db_connection
        conn = get_db_connection()
        print("Connected to MySQL for SSOT metric computation.")
    except Exception as e:
        print(f"MySQL unavailable, falling back to raw files: {e}")

    if conn is not None:
        meta = [
            {"key": "store", "file": "kami_store_daily_overview (226 continuous days)", "rows": 226, "columns": 11},
            {"key": "goods", "file": "kami_creator_products (Snapshot Hè + Thu)", "rows": 787, "columns": 14},
            {"key": "ch_live", "file": "kami_creator_livestreams", "rows": 600, "columns": 12},
            {"key": "ch_video", "file": "kami_creator_videos", "rows": 276, "columns": 10},
            {"key": "shop_video", "file": "kami_affiliate_videos", "rows": 4796, "columns": 15},
            {"key": "product", "file": "kami_shop_products", "rows": 339, "columns": 10},
            {"key": "creators", "file": "kami_affiliate_kol", "rows": 6086, "columns": 11},
            {"key": "shop_live", "file": "kami_affiliate_livestreams", "rows": 8355, "columns": 15},
            {"key": "live_products", "file": "kami_livestream_products", "rows": 103, "columns": 10},
        ]
    else:
        meta = []
        for k, f in FILES.items():
            df = load(k)
            meta.append({"key": k, "file": f, "rows": int(df.shape[0]), "columns": int(df.shape[1])})

    store = build_store(conn)
    channel = build_channel()
    shop_live = build_shop_live()
    creators = build_creators()
    products = build_products()
    shop_videos = build_shop_videos()
    goods = build_goods(conn)

    # Cross-file derived figures (same window only)
    gs_live = shop_live["girlStyle"]["gmv"] if shop_live["girlStyle"] else 0
    store_gmv = store["totals"]["gmv"]["value"]
    derived = {
        "girlStyleLiveShareOfShopGmvPct": metric(r(gs_live / store_gmv * 100), "180N", "Toàn shop",
                                                 f"{FILES['shop_live']} ÷ {FILES['store']}", "%",
                                                 note="Chỉ tính GMV LIVE của Girl Style; cùng khung 180 ngày."),
        "inhouseDualChannelLiveGmv": metric(r(shop_live["inhouseDualChannel"]["gmv"], 0), "180N", "Toàn shop",
                                            FILES["shop_live"], "VND",
                                            note="Tổng GMV LIVE của Kami Ely + Girl Style (cùng 1 đội ngũ in-house vận hành)."),
        "inhouseDualChannelLiveShareOfShopGmvPct": metric(r(shop_live["inhouseDualChannel"]["gmv"] / store_gmv * 100), "180N", "Toàn shop",
                                                          f"{FILES['shop_live']} ÷ {FILES['store']}", "%",
                                                          note="Tỷ trọng GMV LIVE in-house (Kami Ely + Girl Style) trên tổng GMV toàn shop."),
        "inhouseDualChannelLiveShareOfAllLivePct": metric(shop_live["inhouseDualChannel"]["gmvSharePct"], "180N", "Toàn shop",
                                                          FILES["shop_live"], "%",
                                                          note="Tỷ trọng GMV LIVE in-house trên tổng GMV livestream toàn shop."),
        "trueExternalAffiliateLiveGmv": metric(r(shop_live["inhouseDualChannel"]["trueExternalAffiliate"]["gmv"], 0), "180N", "Toàn shop",
                                               FILES["shop_live"], "VND",
                                               note="GMV LIVE từ mạng lưới affiliate bên ngoài thực thụ sau khi bóc tách Girl Style."),
        "trueExternalAffiliateLiveShareOfShopGmvPct": metric(r(shop_live["inhouseDualChannel"]["trueExternalAffiliate"]["gmv"] / store_gmv * 100), "180N", "Toàn shop",
                                                             f"{FILES['shop_live']} ÷ {FILES['store']}", "%"),
        "liveShareOfShopGmvPct": metric(r(shop_live["gmv"]["value"] / store_gmv * 100), "180N", "Toàn shop",
                                        f"{FILES['shop_live']} ÷ {FILES['store']}", "%"),
    }

    out = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "generator": "scripts/kami/build_metrics.py",
        "dataScope": meta,
        "store": store,
        "channel": channel,
        "shopLive": shop_live,
        "creators": creators,
        "products": products,
        "shopVideos": shop_videos,
        "goods": goods,
        "derived": derived,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=2, default=lambda o: o.item() if hasattr(o, "item") else str(o))
    print(f"Wrote {OUT}")
    summary = {k: v for k, v in out.items() if k not in ("store",)}
    summary["store"] = {k: v for k, v in store.items() if k != "daily"}
    print(json.dumps(summary, ensure_ascii=False, indent=1, default=str)[:60000])


if __name__ == "__main__":
    main()
