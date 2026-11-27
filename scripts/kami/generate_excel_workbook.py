"""
Generate live-formula Excel Analytics Workbook & BI-ready CSV pack for Kami Ely (231 days).
Reads raw FastMoss Excel exports from data/kami/, applies PII-safe SHA-256 pseudonymization,
and outputs:
  - public/kami/kami_ely_analytics_workbook.xlsx (5 sheets with live SUMIFS, COUNTIFS, INDEX/MATCH, IF, MA7/MA28, Power Query M)
  - public/kami/bi-pack/*.csv (clean Star-Schema-ready CSVs for Looker Studio / Tableau Public / Power BI)
"""

import hashlib
import os
import re
from pathlib import Path

import numpy as np
import openpyxl
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "data" / "kami"
OUT_XLSX = ROOT / "public" / "kami" / "kami_ely_analytics_workbook.xlsx"
BI_PACK_DIR = ROOT / "public" / "kami" / "bi-pack"

OFFICIAL_SHA256 = "2884bd95e154a3255b1c0272bcfe9505211a293710db406701023782eb0645ec"
SATELLITE_SHA256 = "6aa6d7c1d040cfe8c061b3e7d7700969504d16b70fe6e65a45d3b573ef71f7bb"


def hash_handle(val) -> str:
    return hashlib.sha256(str(val).strip().lower().encode("utf-8")).hexdigest()


def alias_handle(val) -> str:
    h = hash_handle(val)
    if h == OFFICIAL_SHA256:
        return "@shop_official"
    if h == SATELLITE_SHA256:
        return "@koc_sat01"
    return f"koc_{h[:8]}"


def to_num(val) -> float:
    if val is None or (isinstance(val, float) and np.isnan(val)):
        return 0.0
    if isinstance(val, (int, float, np.integer, np.floating)):
        return float(val)
    s = str(val).replace("₫", "").replace("VNĐ", "").replace("đ", "").replace("%", "").strip()
    if not s or s in ("-", "--", "nan", "None"):
        return 0.0
    low = s.lower()
    mult = 1.0
    if "tỷ" in low or "tỉ" in low:
        mult = 1e9
        low = re.sub(r"t[ỷỉ]", "", low).strip()
    elif "triệu" in low or low.endswith("tr") or low.endswith("m"):
        mult = 1e6
        low = re.sub(r"(triệu|tr|m)$", "", low).strip()
    elif "nghìn" in low or low.endswith("k"):
        mult = 1e3
        low = re.sub(r"(nghìn|k)$", "", low).strip()
    elif "vạn" in low or low.endswith("w"):
        mult = 1e4
        low = re.sub(r"(vạn|w)$", "", low).strip()
    low = low.replace(" ", "")
    if re.match(r"^\d{1,3}(\.\d{3})+$", low):
        low = low.replace(".", "")
    else:
        low = low.replace(",", ".")
    try:
        return float(low) * mult
    except ValueError:
        return 0.0


def parse_price_min(val) -> float:
    s = str(val or "").replace("₫", "").replace("đ", "").replace(".", "").replace(",", "")
    nums = re.findall(r"\d+", s)
    return float(nums[0]) if nums else 0.0


def parse_duration_hours(val) -> float:
    s = str(val or "").strip().lower()
    if not s or s in ("-", "nan"):
        return 0.0
    h = m = sec = 0.0
    if ":" in s:
        parts = [float(p) for p in re.findall(r"\d+", s)]
        if len(parts) == 3:
            h, m, sec = parts
        elif len(parts) == 2:
            h, m = parts
    else:
        mh = re.search(r"(\d+(?:[.,]\d+)?)\s*(?:h|giờ)", s)
        mm = re.search(r"(\d+(?:[.,]\d+)?)\s*(?:m|phút|p)", s)
        ms = re.search(r"(\d+(?:[.,]\d+)?)\s*(?:s|giây)", s)
        if mh:
            h = float(mh.group(1).replace(",", "."))
        if mm:
            m = float(mm.group(1).replace(",", "."))
        if ms:
            sec = float(ms.group(1).replace(",", "."))
    return h + m / 60.0 + sec / 3600.0


# Portfolio official palette styles
FILL_DARK = PatternFill("solid", fgColor="074553")
FILL_CYAN = PatternFill("solid", fgColor="C8EEF7")
FILL_CYAN_BRIGHT = PatternFill("solid", fgColor="9BE7FA")
FILL_AMBER = PatternFill("solid", fgColor="FFE485")
FILL_INPUT = PatternFill("solid", fgColor="E0F2FE")
FILL_ZEBRA = PatternFill("solid", fgColor="F8FAFC")
FILL_WHITE = PatternFill("solid", fgColor="FFFFFF")

FONT_TITLE = Font(name="Calibri", size=14, bold=True, color="FFFFFF")
FONT_SUBTITLE = Font(name="Calibri", size=10, italic=True, color="074553")
FONT_SEC = Font(name="Calibri", size=11, bold=True, color="074553")
FONT_HDR = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
FONT_BODY = Font(name="Calibri", size=10, color="0F172A")
FONT_BOLD = Font(name="Calibri", size=10, bold=True, color="0F172A")
FONT_INPUT = Font(name="Calibri", size=10, bold=True, color="0369A1")
FONT_MONO = Font(name="Consolas", size=9.5, color="0F172A")

THIN_BORDER = Border(
    left=Side(style="thin", color="CBD5E1"),
    right=Side(style="thin", color="CBD5E1"),
    top=Side(style="thin", color="CBD5E1"),
    bottom=Side(style="thin", color="CBD5E1"),
)

FMT_VND = '#,##0'
FMT_VND_M = '#,##0.0'
FMT_INT = '#,##0'
FMT_PCT = '0.0%'
FMT_DEC2 = '0.00'


def style_range(ws, min_row, max_row, min_col, max_col, font=None, fill=None, align=None, border=THIN_BORDER, num_fmt=None):
    for r in range(min_row, max_row + 1):
        for c in range(min_col, max_col + 1):
            cell = ws.cell(row=r, column=c)
            if font:
                cell.font = font
            if fill:
                cell.fill = fill
            if align:
                cell.alignment = align
            if border:
                cell.border = border
            if num_fmt:
                cell.number_format = num_fmt


def auto_fit_columns(ws, max_widths=None):
    max_widths = max_widths or {}
    for col in ws.columns:
        col_letter = get_column_letter(col[0].column)
        best = 10
        for cell in col:
            if cell.value is None:
                continue
            val_str = str(cell.value)
            if val_str.startswith("="):
                continue
            best = max(best, min(len(val_str) + 3, 52))
        cap = max_widths.get(col_letter, 42)
        ws.column_dimensions[col_letter].width = min(max(best, 11), cap)


def main():
    BI_PACK_DIR.mkdir(parents=True, exist_ok=True)
    OUT_XLSX.parent.mkdir(parents=True, exist_ok=True)

    # 1. Load & normalize raw datasets
    df_store = pd.read_excel(DATA_DIR / "[Kami Ely]_Store_Daily_Overview_231_Days_Merged.xlsx")
    df_store["dt"] = pd.to_datetime(df_store["Ngày Ghi Nhận"])
    df_store = df_store.sort_values("dt").reset_index(drop=True)
    df_store["date_str"] = df_store["dt"].dt.strftime("%Y-%m-%d")
    df_store["ym"] = df_store["dt"].dt.strftime("%Y-%m")
    df_store["units"] = df_store["Lượng Bán Trong Ngày (Sp)"].map(to_num).astype(int)
    df_store["gmv_vnd"] = df_store["Doanh Thu Trong Ngày (VNĐ)"].map(to_num)
    df_store["new_lives"] = df_store["Livestream Mới Trong Ngày"].map(to_num).astype(int)
    df_store["new_videos"] = df_store["Video Mới Trong Ngày"].map(to_num).astype(int)
    df_store["new_koc"] = df_store["KOC Mới Trong Ngày"].map(to_num).astype(int)

    df_prod = pd.read_excel(DATA_DIR / "[Kami Ely]_Shop_Products_Merged.xlsx")
    df_prod["gmv_vnd"] = df_prod["Doanh Thu Gần Nhất (VNĐ)"].map(to_num)
    df_prod["units"] = df_prod["Lượng Bán Gần Nhất (Sp)"].map(to_num).astype(int)
    df_prod["list_min_vnd"] = df_prod["Giá Bán Niêm Yết"].map(parse_price_min)
    df_prod["launch_year"] = df_prod["Ngày Giờ Lên Sàn"].astype(str).str.slice(0, 4)
    df_prod["title"] = df_prod["Tên Sản Phẩm Bày Bán"].astype(str).str.strip()
    df_prod = df_prod.sort_values(["gmv_vnd", "units"], ascending=[False, False]).reset_index(drop=True)

    df_aff_live = pd.read_excel(DATA_DIR / "[Kami Ely]_Affiliate_Livestreams_Merged.xlsx")
    df_aff_live["koc_alias"] = df_aff_live["KOC ID"].map(alias_handle)
    df_aff_live["koc_hash"] = df_aff_live["KOC ID"].map(hash_handle)
    df_aff_live["gmv_vnd"] = df_aff_live["Doanh Thu Cho Shop (VNĐ)"].map(to_num)
    df_aff_live["ts_clean"] = pd.to_datetime(
        df_aff_live["Thời Gian Bắt Đầu Live"].astype(str).str.replace(r"\(UTC[+-]\d+\)", "", regex=True).str.strip(),
        errors="coerce",
    )

    df_cr_live = pd.read_excel(DATA_DIR / "[Kami Ely]_Creator_Livestreams_Merged.xlsx")
    df_cr_live["gmv_vnd"] = df_cr_live["Doanh Thu Phiên Live (VNĐ)"].map(to_num)
    df_cr_live["hours"] = pd.to_numeric(df_cr_live["Thời Lượng (Giờ)"], errors="coerce").fillna(0.0)
    df_cr_live["ts_utc7"] = (
        pd.to_datetime(df_cr_live["Thời Gian Bắt Đầu Live"].astype(str).str.replace(r"\(UTC[+-]\d+\)", "", regex=True).str.strip(), errors="coerce")
        + pd.Timedelta(hours=13)
    )
    df_cr_live["ym"] = df_cr_live["ts_utc7"].dt.strftime("%Y-%m")
    cr_over10 = df_cr_live[(df_cr_live["hours"] > 10.0) & (df_cr_live["ym"].isin(["2026-04", "2026-05", "2026-06", "2026-07", "2026-08"]))]
    over10_by_month = (
        cr_over10.groupby("ym")
        .agg(sessions=("gmv_vnd", "count"), total_hours=("hours", "sum"), total_gmv_vnd=("gmv_vnd", "sum"))
        .reindex(["2026-04", "2026-05", "2026-06", "2026-07", "2026-08"])
        .fillna(0)
        .reset_index()
    )

    # KOC 302 external Live screening dataset
    ext_live = df_aff_live[df_aff_live["koc_hash"] != OFFICIAL_SHA256].sort_values(["koc_alias", "ts_clean"]).copy()
    koc_rows = []
    for alias, grp in ext_live.groupby("koc_alias", sort=False):
        grp = grp.sort_values("ts_clean")
        n_sess = len(grp)
        first3_gmv = float(grp["gmv_vnd"].iloc[:3].sum())
        total_gmv = float(grp["gmv_vnd"].sum())
        first_ym = grp["ts_clean"].iloc[0].strftime("%Y-%m") if pd.notna(grp["ts_clean"].iloc[0]) else ""
        tier_type = "In-House Satellite" if alias == "@koc_sat01" else "Independent External"
        koc_rows.append(
            {
                "koc_alias": alias,
                "koc_type": tier_type,
                "cohort_month": first_ym,
                "total_sessions": int(n_sess),
                "first_3_gmv_vnd": round(first3_gmv, 0),
                "total_gmv_vnd": round(total_gmv, 0),
            }
        )
    df_koc = pd.DataFrame(koc_rows).sort_values("total_gmv_vnd", ascending=False).reset_index(drop=True)

    # Reconciliation raw sums
    aff_live_total = float(df_aff_live["gmv_vnd"].sum())
    aff_live_official_overlap = float(df_aff_live[df_aff_live["koc_hash"] == OFFICIAL_SHA256]["gmv_vnd"].sum())
    cr_live_total = float(df_cr_live["gmv_vnd"].sum())

    # 2. Export BI-ready clean CSVs for Looker Studio / Tableau Public / Power BI
    df_store_export = df_store[["date_str", "ym", "units", "gmv_vnd", "new_lives", "new_videos", "new_koc"]].copy()
    df_store_export["asp_vnd"] = np.where(df_store_export["units"] > 0, np.round(df_store_export["gmv_vnd"] / df_store_export["units"], 0), 0)
    df_store_export["ma7_vnd"] = df_store_export["gmv_vnd"].rolling(7).mean().round(0)
    df_store_export["ma28_vnd"] = df_store_export["gmv_vnd"].rolling(28).mean().round(0)
    df_store_export.to_csv(BI_PACK_DIR / "fact_store_daily_231d.csv", index=False, encoding="utf-8-sig")

    df_prod_export = df_prod[["title", "launch_year", "list_min_vnd", "units", "gmv_vnd"]].copy()
    df_prod_export.insert(0, "rank", range(1, len(df_prod_export) + 1))
    df_prod_export["realized_asp_vnd"] = np.where(df_prod_export["units"] > 0, np.round(df_prod_export["gmv_vnd"] / df_prod_export["units"], 0), 0)
    df_prod_export.to_csv(BI_PACK_DIR / "dim_shop_products_339.csv", index=False, encoding="utf-8-sig")

    df_koc_export = df_koc.copy()
    df_koc_export["first3_zero_flag"] = ((df_koc_export["total_sessions"] >= 3) & (df_koc_export["first_3_gmv_vnd"] == 0)).astype(int)
    df_koc_export["late_converter_flag"] = ((df_koc_export["first3_zero_flag"] == 1) & (df_koc_export["total_gmv_vnd"] > 0)).astype(int)
    df_koc_export.to_csv(BI_PACK_DIR / "dim_koc_screening_302.csv", index=False, encoding="utf-8-sig")

    monthly_csv = (
        df_store.groupby("ym")
        .agg(days=("date_str", "count"), gmv_vnd=("gmv_vnd", "sum"), units=("units", "sum"), new_lives=("new_lives", "sum"), new_koc=("new_koc", "sum"))
        .reset_index()
    )
    monthly_csv["daily_mean_vnd"] = (monthly_csv["gmv_vnd"] / monthly_csv["days"]).round(0)
    monthly_csv.to_csv(BI_PACK_DIR / "fact_monthly_summary.csv", index=False, encoding="utf-8-sig")

    # 3. Build 5-sheet live-formula Excel Workbook
    wb = openpyxl.Workbook()

    # =========================================================================
    # SHEET 4 FIRST (DATA): 04_Store_Daily_231d
    # =========================================================================
    ws_daily = wb.create_sheet("04_Store_Daily_231d")
    ws_daily.views.sheetView[0].showGridLines = True
    ws_daily.freeze_panes = "A4"

    ws_daily.merge_cells("A1:K1")
    ws_daily["A1"] = "KAMI ELY (@shop_official) — 231-DAY NORMALIZED STORE DAILY SERIES & LIVE MA7/MA28 EARLY-WARNING FORMULAS"
    style_range(ws_daily, 1, 1, 1, 11, font=FONT_TITLE, fill=FILL_DARK, align=Alignment(vertical="center", horizontal="left"))
    ws_daily.row_dimensions[1].height = 26

    ws_daily.merge_cells("A2:K2")
    ws_daily["A2"] = "Source: FastMoss Store_Daily_Overview_231_Days_Merged (09/03/2026 – 25/10/2026). Columns F–K use live Excel formulas."
    style_range(ws_daily, 2, 2, 1, 11, font=FONT_SUBTITLE, fill=FILL_CYAN)

    daily_headers = [
        "Date", "YearMonth", "Units_Sold", "GMV_VND", "New_Lives", "New_Videos",
        "New_KOC", "Realized_ASP", "MA7_GMV", "MA28_GMV", "Signal_MA7_lt_MA28",
    ]
    for ci, h in enumerate(daily_headers, 1):
        ws_daily.cell(row=3, column=ci, value=h)
    style_range(ws_daily, 3, 3, 1, 11, font=FONT_HDR, fill=FILL_DARK, align=Alignment(horizontal="center", vertical="center"))

    for idx, r in df_store.iterrows():
        row_num = idx + 4
        ws_daily.cell(row=row_num, column=1, value=r["date_str"])
        ws_daily.cell(row=row_num, column=2, value=r["ym"])
        ws_daily.cell(row=row_num, column=3, value=int(r["units"]))
        ws_daily.cell(row=row_num, column=4, value=float(r["gmv_vnd"]))
        ws_daily.cell(row=row_num, column=5, value=int(r["new_lives"]))
        ws_daily.cell(row=row_num, column=6, value=int(r["new_videos"]))
        ws_daily.cell(row=row_num, column=7, value=int(r["new_koc"]))
        ws_daily.cell(row=row_num, column=8, value=f"=IF(C{row_num}>0,D{row_num}/C{row_num},0)")
        ws_daily.cell(row=row_num, column=9, value=f'=IF(ROW()>={7+3},AVERAGE(D{max(4,row_num-6)}:D{row_num}),"")')
        ws_daily.cell(row=row_num, column=10, value=f'=IF(ROW()>={28+3},AVERAGE(D{max(4,row_num-27)}:D{row_num}),"")')
        if row_num == 4:
            ws_daily.cell(row=row_num, column=11, value="WARMUP")
        else:
            ws_daily.cell(
                row=row_num,
                column=11,
                value=f'=IF(OR(I{row_num}="",J{row_num}=""),"WARMUP",IF(AND(I{row_num}<J{row_num},I{row_num-1}>=J{row_num-1}),"CROSS_DOWN",IF(I{row_num}<J{row_num},"BELOW_MA28","ABOVE_MA28")))',
            )

    last_daily_row = len(df_store) + 3
    style_range(ws_daily, 4, last_daily_row, 1, 11, font=FONT_BODY, border=THIN_BORDER)
    for r in range(4, last_daily_row + 1):
        ws_daily.cell(row=r, column=3).number_format = FMT_INT
        ws_daily.cell(row=r, column=4).number_format = FMT_VND
        ws_daily.cell(row=r, column=5).number_format = FMT_INT
        ws_daily.cell(row=r, column=6).number_format = FMT_INT
        ws_daily.cell(row=r, column=7).number_format = FMT_INT
        ws_daily.cell(row=r, column=8).number_format = FMT_VND
        ws_daily.cell(row=r, column=9).number_format = FMT_VND
        ws_daily.cell(row=r, column=10).number_format = FMT_VND
    auto_fit_columns(ws_daily)

    # =========================================================================
    # SHEET 2: 02_SKU_Pareto_Lookup (INDEX/MATCH + SUMIFS Price Bands + ABC)
    # =========================================================================
    ws_sku = wb.create_sheet("02_SKU_Pareto_Lookup")
    ws_sku.views.sheetView[0].showGridLines = True
    ws_sku.freeze_panes = "A13"

    ws_sku.merge_cells("A1:J1")
    ws_sku["A1"] = "KAMI ELY — 339 PRODUCT LISTINGS PARETO, INDEX/MATCH LOOKUP & REALIZED ASP PRICE BANDS"
    style_range(ws_sku, 1, 1, 1, 10, font=FONT_TITLE, fill=FILL_DARK, align=Alignment(vertical="center"))
    ws_sku.row_dimensions[1].height = 26

    # Dynamic INDEX/MATCH Lookup Card (Rows 3-7, Cols A-D)
    ws_sku["A3"] = "DYNAMIC INDEX/MATCH SKU LOOKUP (Change Rank in B4)"
    ws_sku.merge_cells("A3:D3")
    style_range(ws_sku, 3, 3, 1, 4, font=FONT_SEC, fill=FILL_CYAN)

    last_sku_row = len(df_prod) + 12
    lookup_specs = [
        ("Lookup Rank (1–339):", 1, FMT_INT, True),
        ("Product Title (INDEX/MATCH):", f"=INDEX($B$13:$B${last_sku_row},MATCH($B$4,$A$13:$A${last_sku_row},0))", "@", False),
        ("90d GMV VND (INDEX/MATCH):", f"=INDEX($F$13:$F${last_sku_row},MATCH($B$4,$A$13:$A${last_sku_row},0))", FMT_VND, False),
        ("Realized ASP (INDEX/MATCH):", f"=INDEX($G$13:$G${last_sku_row},MATCH($B$4,$A$13:$A${last_sku_row},0))", FMT_VND, False),
        ("Cumulative Share % (INDEX/MATCH):", f"=INDEX($I$13:$I${last_sku_row},MATCH($B$4,$A$13:$A${last_sku_row},0))", FMT_PCT, False),
    ]
    for offset, (lbl, formula_val, nfmt, is_inp) in enumerate(lookup_specs):
        rr = 4 + offset
        ws_sku.cell(row=rr, column=1, value=lbl)
        ws_sku.cell(row=rr, column=2, value=formula_val)
        ws_sku.merge_cells(start_row=rr, start_column=2, end_row=rr, end_column=4)
        style_range(ws_sku, rr, rr, 1, 1, font=FONT_BOLD, fill=FILL_ZEBRA)
        style_range(ws_sku, rr, rr, 2, 4, font=FONT_INPUT if is_inp else FONT_BODY, fill=FILL_INPUT if is_inp else FILL_WHITE, num_fmt=nfmt)

    # 4 Realized ASP Price Bands Summary (Rows 3-9, Cols F-J) using COUNTIFS & SUMIFS
    ws_sku["F3"] = "4 REALIZED ASP PRICE BANDS (LIVE SUMIFS / COUNTIFS)"
    ws_sku.merge_cells("F3:J3")
    style_range(ws_sku, 3, 3, 6, 10, font=FONT_SEC, fill=FILL_AMBER)

    pb_headers = ["Realized ASP Band", "Active Listings", "Total Units", "90d GMV (VND)", "% of GMV"]
    for ci, h in enumerate(pb_headers, 6):
        ws_sku.cell(row=4, column=ci, value=h)
    style_range(ws_sku, 4, 4, 6, 10, font=FONT_HDR, fill=FILL_DARK, align=Alignment(horizontal="center"))

    bands = ["<75k", "75k-150k", "150k-250k", ">=250k"]
    for bi, b_name in enumerate(bands):
        rr = 5 + bi
        ws_sku.cell(row=rr, column=6, value=b_name)
        ws_sku.cell(row=rr, column=7, value=f'=COUNTIFS($H$13:$H${last_sku_row},F{rr},$F$13:$F${last_sku_row},">0")')
        ws_sku.cell(row=rr, column=8, value=f'=SUMIFS($E$13:$E${last_sku_row},$H$13:$H${last_sku_row},F{rr})')
        ws_sku.cell(row=rr, column=9, value=f'=SUMIFS($F$13:$F${last_sku_row},$H$13:$H${last_sku_row},F{rr})')
        ws_sku.cell(row=rr, column=10, value=f"=IF($I$9>0,I{rr}/$I$9,0)")
    ws_sku.cell(row=9, column=6, value="Total Active (133/339)")
    ws_sku.cell(row=9, column=7, value="=SUM(G5:G8)")
    ws_sku.cell(row=9, column=8, value="=SUM(H5:H8)")
    ws_sku.cell(row=9, column=9, value="=SUM(I5:I8)")
    ws_sku.cell(row=9, column=10, value="=SUM(J5:J8)")
    ws_sku.cell(row=10, column=6, value="Sweet Spot 75k–250k Share")
    ws_sku.merge_cells("F10:I10")
    ws_sku.cell(row=10, column=10, value="=J6+J7")

    style_range(ws_sku, 5, 8, 6, 10, font=FONT_BODY)
    style_range(ws_sku, 9, 9, 6, 10, font=FONT_BOLD, fill=FILL_CYAN)
    style_range(ws_sku, 10, 10, 6, 10, font=FONT_BOLD, fill=FILL_AMBER)
    for r in range(5, 10):
        ws_sku.cell(row=r, column=7).number_format = FMT_INT
        ws_sku.cell(row=r, column=8).number_format = FMT_INT
        ws_sku.cell(row=r, column=9).number_format = FMT_VND
        ws_sku.cell(row=r, column=10).number_format = FMT_PCT
    ws_sku.cell(row=10, column=10).number_format = FMT_PCT

    sku_headers = [
        "Rank", "Product_Listing_Title", "Launch_Year", "List_Min_VND", "Units_90d",
        "GMV_90d_VND", "Realized_ASP", "ASP_Band_Formula", "Cum_GMV_Share", "ABC_Class",
    ]
    for ci, h in enumerate(sku_headers, 1):
        ws_sku.cell(row=12, column=ci, value=h)
    style_range(ws_sku, 12, 12, 1, 10, font=FONT_HDR, fill=FILL_DARK, align=Alignment(horizontal="center"))

    for idx, r in df_prod.iterrows():
        rr = idx + 13
        ws_sku.cell(row=rr, column=1, value=idx + 1)
        ws_sku.cell(row=rr, column=2, value=r["title"])
        ws_sku.cell(row=rr, column=3, value=r["launch_year"])
        ws_sku.cell(row=rr, column=4, value=float(r["list_min_vnd"]))
        ws_sku.cell(row=rr, column=5, value=int(r["units"]))
        ws_sku.cell(row=rr, column=6, value=float(r["gmv_vnd"]))
        ws_sku.cell(row=rr, column=7, value=f"=IF(E{rr}>0,F{rr}/E{rr},0)")
        ws_sku.cell(row=rr, column=8, value=f'=IF(E{rr}=0,"No Sales",IF(G{rr}<75000,"<75k",IF(G{rr}<150000,"75k-150k",IF(G{rr}<250000,"150k-250k",">=250k"))))')
        ws_sku.cell(row=rr, column=9, value=f"=SUM($F$13:F{rr})/SUM($F$13:$F${last_sku_row})")
        ws_sku.cell(row=rr, column=10, value=f'=IF(F{rr}=0,"Zero-Sale",IF(A{rr}<=12,"A (Top 12 = 80.6%)",IF(I{rr}<=0.95,"B (Core Tail)","C (Long Tail)")))')

    style_range(ws_sku, 13, last_sku_row, 1, 10, font=FONT_BODY)
    for r in range(13, last_sku_row + 1):
        ws_sku.cell(row=r, column=1).number_format = FMT_INT
        ws_sku.cell(row=r, column=4).number_format = FMT_VND
        ws_sku.cell(row=r, column=5).number_format = FMT_INT
        ws_sku.cell(row=r, column=6).number_format = FMT_VND
        ws_sku.cell(row=r, column=7).number_format = FMT_VND
        ws_sku.cell(row=r, column=9).number_format = FMT_PCT
    auto_fit_columns(ws_sku, max_widths={"B": 44, "J": 22})

    # =========================================================================
    # SHEET 3: 03_KOC_2Tier_Screening (302 Non-Official Live KOCs + 2-Tier IF Rule)
    # =========================================================================
    ws_koc = wb.create_sheet("03_KOC_2Tier_Screening")
    ws_koc.views.sheetView[0].showGridLines = True
    ws_koc.freeze_panes = "A12"

    ws_koc.merge_cells("A1:I1")
    ws_koc["A1"] = "KAMI ELY — 302 NON-OFFICIAL LIVE KOCS & AUTOMATED 2-TIER SCREENING RULE (PII-SAFE SHA-256)"
    style_range(ws_koc, 1, 1, 1, 9, font=FONT_TITLE, fill=FILL_DARK, align=Alignment(vertical="center"))
    ws_koc.row_dimensions[1].height = 26

    last_koc_row = len(df_koc) + 11
    ws_koc["A3"] = "2-TIER SCREENING IMPACT SUMMARY (LIVE COUNTIFS / SUMIFS — PROVES 51 LATE CONVERTERS = 304.9M)"
    ws_koc.merge_cells("A3:F3")
    style_range(ws_koc, 3, 3, 1, 6, font=FONT_SEC, fill=FILL_AMBER)

    koc_sum_hdrs = ["2-Tier Action Segment", "KOC Count", "% of 302", "Total GMV (VND)", "% of Indep. Live", "Operational Rule"]
    for ci, h in enumerate(koc_sum_hdrs, 1):
        ws_koc.cell(row=4, column=ci, value=h)
    style_range(ws_koc, 4, 4, 1, 6, font=FONT_HDR, fill=FILL_DARK, align=Alignment(horizontal="center"))

    koc_segments = [
        ("In-House Satellite", "Core studio backup channel (@koc_sat01) — separate from external KOCs"),
        ("Tier 1: Fast Converter", "Converted within first 3 sessions — priority sample & commission tier"),
        ("Tier 2: Late Converter (Session 4+)", "0đ in sessions 1–3, converted on session 4+ — PROTECTED by keeping open link"),
        ("Tier 2: Pause Paid Sample (Keep Open Link)", "0đ across >=3 sessions — stop free samples/fees, keep 0đ open affiliate link"),
        ("Onboarding (<3 Sessions)", "Still within 3-session observation window"),
    ]
    for si, (seg, note) in enumerate(koc_segments):
        rr = 5 + si
        ws_koc.cell(row=rr, column=1, value=seg)
        ws_koc.cell(row=rr, column=2, value=f'=COUNTIF($I$12:$I${last_koc_row},A{rr})')
        ws_koc.cell(row=rr, column=3, value=f"=B{rr}/$B$10")
        ws_koc.cell(row=rr, column=4, value=f'=SUMIF($I$12:$I${last_koc_row},A{rr},$F$12:$F${last_koc_row})')
        ws_koc.cell(row=rr, column=5, value=f'=IF(A{rr}="In-House Satellite",0,D{rr}/SUMIF($B$12:$B${last_koc_row},"Independent External",$F$12:$F${last_koc_row}))')
        ws_koc.cell(row=rr, column=6, value=note)
    ws_koc.cell(row=10, column=1, value="Total Non-Official Live KOCs")
    ws_koc.cell(row=10, column=2, value="=SUM(B5:B9)")
    ws_koc.cell(row=10, column=3, value="=SUM(C5:C9)")
    ws_koc.cell(row=10, column=4, value="=SUM(D5:D9)")
    ws_koc.cell(row=10, column=5, value="=SUM(E5:E9)")
    ws_koc.cell(row=10, column=6, value="Independent External Live GMV excludes @koc_sat01 (1.26B)")

    style_range(ws_koc, 5, 9, 1, 6, font=FONT_BODY)
    style_range(ws_koc, 7, 7, 1, 6, font=FONT_BOLD, fill=FILL_CYAN)
    style_range(ws_koc, 10, 10, 1, 6, font=FONT_BOLD, fill=FILL_AMBER)
    for r in range(5, 11):
        ws_koc.cell(row=r, column=2).number_format = FMT_INT
        ws_koc.cell(row=r, column=3).number_format = FMT_PCT
        ws_koc.cell(row=r, column=4).number_format = FMT_VND
        ws_koc.cell(row=r, column=5).number_format = FMT_PCT

    koc_hdrs = [
        "KOC_Alias_SHA256", "Account_Type", "First_Cohort_Month", "Total_Sessions",
        "First_3_Sessions_GMV", "Total_GMV_VND", "Zero_Start_3Plus_Flag", "Late_Converter_Flag", "2Tier_Action_Status",
    ]
    for ci, h in enumerate(koc_hdrs, 1):
        ws_koc.cell(row=11, column=ci, value=h)
    style_range(ws_koc, 11, 11, 1, 9, font=FONT_HDR, fill=FILL_DARK, align=Alignment(horizontal="center"))

    for idx, r in df_koc.iterrows():
        rr = idx + 12
        ws_koc.cell(row=rr, column=1, value=r["koc_alias"])
        ws_koc.cell(row=rr, column=2, value=r["koc_type"])
        ws_koc.cell(row=rr, column=3, value=r["cohort_month"])
        ws_koc.cell(row=rr, column=4, value=int(r["total_sessions"]))
        ws_koc.cell(row=rr, column=5, value=float(r["first_3_gmv_vnd"]))
        ws_koc.cell(row=rr, column=6, value=float(r["total_gmv_vnd"]))
        ws_koc.cell(row=rr, column=7, value=f'=IF(AND(B{rr}="Independent External",D{rr}>=3,E{rr}=0),1,0)')
        ws_koc.cell(row=rr, column=8, value=f"=IF(AND(G{rr}=1,F{rr}>0),1,0)")
        ws_koc.cell(
            row=rr,
            column=9,
            value=f'=IF(B{rr}="In-House Satellite","In-House Satellite",IF(H{rr}=1,"Tier 2: Late Converter (Session 4+)",IF(G{rr}=1,"Tier 2: Pause Paid Sample (Keep Open Link)",IF(F{rr}>0,"Tier 1: Fast Converter","Onboarding (<3 Sessions)"))))',
        )

    style_range(ws_koc, 12, last_koc_row, 1, 9, font=FONT_BODY)
    for r in range(12, last_koc_row + 1):
        ws_koc.cell(row=r, column=4).number_format = FMT_INT
        ws_koc.cell(row=r, column=5).number_format = FMT_VND
        ws_koc.cell(row=r, column=6).number_format = FMT_VND
        ws_koc.cell(row=r, column=7).number_format = FMT_INT
        ws_koc.cell(row=r, column=8).number_format = FMT_INT
    auto_fit_columns(ws_koc, max_widths={"F": 44, "I": 38})

    # =========================================================================
    # SHEET 1 (DEFAULT ACTIVE SHEET): 01_Executive_Summary
    # =========================================================================
    ws_exec = wb.active
    ws_exec.title = "01_Executive_Summary"
    ws_exec.views.sheetView[0].showGridLines = True

    ws_exec.merge_cells("A1:H1")
    ws_exec["A1"] = "KAMI ELY (@shop_official) — TIKTOK SHOP ANALYTICS WORKBOOK (LIVE EXCEL FORMULAS · 231 DAYS)"
    style_range(ws_exec, 1, 1, 1, 8, font=FONT_TITLE, fill=FILL_DARK, align=Alignment(vertical="center"))
    ws_exec.row_dimensions[1].height = 28

    ws_exec.merge_cells("A2:H2")
    ws_exec["A2"] = "Author: Ma Van Hung (Fresher DA/BA) | Scope: 10 public FastMoss exports (09/03–25/10/2026), PII pseudonymized via SHA-256 | Blue cells = editable model inputs"
    style_range(ws_exec, 2, 2, 1, 8, font=FONT_SUBTITLE, fill=FILL_CYAN)

    # Section A: Executive KPI Cards (Rows 4-11, Cols A-C)
    ws_exec.merge_cells("A4:C4")
    ws_exec["A4"] = "A. EXECUTIVE KPI SUMMARY (LIVE FORMULAS FROM 04_Store_Daily_231d)"
    style_range(ws_exec, 4, 4, 1, 3, font=FONT_SEC, fill=FILL_CYAN)

    exec_kpis = [
        ("Total Estimated GMV (231d, VND)", f"=SUM('04_Store_Daily_231d'!$D$4:$D${last_daily_row})", FMT_VND),
        ("Total Units Sold (231d)", f"=SUM('04_Store_Daily_231d'!$C$4:$C${last_daily_row})", FMT_INT),
        ("Realized ASP (VND / Unit)", "=B5/B6", FMT_VND),
        ("Daily Mean GMV (VND / Day)", f"=AVERAGE('04_Store_Daily_231d'!$D$4:$D${last_daily_row})", FMT_VND),
        ("Single-Day Peak GMV (VND)", f"=MAX('04_Store_Daily_231d'!$D$4:$D${last_daily_row})", FMT_VND),
        ("Peak Date (INDEX/MATCH)", f"=INDEX('04_Store_Daily_231d'!$A$4:$A${last_daily_row},MATCH(B9,'04_Store_Daily_231d'!$D$4:$D${last_daily_row},0))", "@"),
        ("Seasonal Contraction (Jun -> Aug)", "=(C21-C19)/C19", FMT_PCT),
        ("MA7 < MA28 Cross-Down Alerts", f'=COUNTIF(\'04_Store_Daily_231d\'!$K$4:$K${last_daily_row},"CROSS_DOWN")', FMT_INT),
    ]
    for i, (lbl, fml, nfmt) in enumerate(exec_kpis):
        rr = 5 + i
        ws_exec.cell(row=rr, column=1, value=lbl)
        ws_exec.cell(row=rr, column=2, value=fml)
        ws_exec.merge_cells(start_row=rr, start_column=2, end_row=rr, end_column=3)
        style_range(ws_exec, rr, rr, 1, 1, font=FONT_BOLD, fill=FILL_ZEBRA)
        style_range(ws_exec, rr, rr, 2, 3, font=FONT_BOLD, fill=FILL_WHITE, num_fmt=nfmt, align=Alignment(horizontal="right"))

    # Section B: Cross-Table Reconciliation Proof (Rows 4-11, Cols E-H)
    ws_exec.merge_cells("E4:H4")
    ws_exec["E4"] = "B. CROSS-FILE OVERLAP RECONCILIATION PROOF (CrLive vs AffLive)"
    style_range(ws_exec, 4, 4, 5, 8, font=FONT_SEC, fill=FILL_AMBER)

    rec_rows = [
        ("Raw AffLive Gross GMV (8,355 sessions)", aff_live_total, "Includes 595 official sessions", FMT_VND),
        ("Raw CrLive Official GMV (600 sessions)", cr_live_total, "Official channel live export", FMT_VND),
        ("Naive Sum (Double-Counting Trap)", "=F5+F6", "Inflates channel GMV!", FMT_VND),
        ("Verified Overlap Removed (595 sessions)", aff_live_official_overlap, "Matched via SHA-256 @shop_official", FMT_VND),
        ("Reconciled Unique Live GMV", "=F5", "Deduped Gross Live baseline", FMT_VND),
        ("75k–250k Realized ASP Share (Sheet 02)", "='02_SKU_Pareto_Lookup'!J10", "Proved via live SUMIFS", FMT_PCT),
        ("Protected Late-Converter KOCs (Sheet 03)", "='03_KOC_2Tier_Screening'!B7", "Session 4+ converters kept", FMT_INT),
        ("Protected Late-Converter GMV (Sheet 03)", "='03_KOC_2Tier_Screening'!D7", "18.8% of independent Live", FMT_VND),
    ]
    for i, (lbl, val, note, nfmt) in enumerate(rec_rows):
        rr = 5 + i
        ws_exec.cell(row=rr, column=5, value=lbl)
        ws_exec.cell(row=rr, column=6, value=val)
        ws_exec.cell(row=rr, column=7, value=note)
        ws_exec.merge_cells(start_row=rr, start_column=7, end_row=rr, end_column=8)
        style_range(ws_exec, rr, rr, 5, 5, font=FONT_BOLD if i in (2, 3, 4) else FONT_BODY, fill=FILL_ZEBRA)
        style_range(ws_exec, rr, rr, 6, 6, font=FONT_BOLD, fill=FILL_AMBER if i == 3 else FILL_WHITE, num_fmt=nfmt, align=Alignment(horizontal="right"))
        style_range(ws_exec, rr, rr, 7, 8, font=FONT_BODY, fill=FILL_WHITE)

    # Section C: Monthly Summary Table using SUMIFS / COUNTIFS / AVERAGEIFS (Rows 14-23)
    ws_exec.merge_cells("A14:H14")
    ws_exec["A14"] = "C. MONTHLY STORE PERFORMANCE (LIVE SUMIFS / COUNTIFS / AVERAGEIFS)"
    style_range(ws_exec, 14, 14, 1, 8, font=FONT_SEC, fill=FILL_CYAN)

    m_hdrs = ["Month", "Active Days", "GMV (VND)", "Units Sold", "Daily Avg GMV", "MoM Growth %", "Share of 231d", "New Lives"]
    for ci, h in enumerate(m_hdrs, 1):
        ws_exec.cell(row=15, column=ci, value=h)
    style_range(ws_exec, 15, 15, 1, 8, font=FONT_HDR, fill=FILL_DARK, align=Alignment(horizontal="center"))

    months_list = sorted(df_store["ym"].unique())
    for mi, ym in enumerate(months_list):
        rr = 16 + mi
        ws_exec.cell(row=rr, column=1, value=ym)
        ws_exec.cell(row=rr, column=2, value=f'=COUNTIF(\'04_Store_Daily_231d\'!$B$4:$B${last_daily_row},A{rr})')
        ws_exec.cell(row=rr, column=3, value=f'=SUMIF(\'04_Store_Daily_231d\'!$B$4:$B${last_daily_row},A{rr},\'04_Store_Daily_231d\'!$D$4:$D${last_daily_row})')
        ws_exec.cell(row=rr, column=4, value=f'=SUMIF(\'04_Store_Daily_231d\'!$B$4:$B${last_daily_row},A{rr},\'04_Store_Daily_231d\'!$C$4:$C${last_daily_row})')
        ws_exec.cell(row=rr, column=5, value=f'=AVERAGEIF(\'04_Store_Daily_231d\'!$B$4:$B${last_daily_row},A{rr},\'04_Store_Daily_231d\'!$D$4:$D${last_daily_row})')
        ws_exec.cell(row=rr, column=6, value="=0" if mi == 0 else f"=IF(C{rr-1}>0,(C{rr}-C{rr-1})/C{rr-1},0)")
        ws_exec.cell(row=rr, column=7, value=f"=C{rr}/$C$24")
        ws_exec.cell(row=rr, column=8, value=f'=SUMIF(\'04_Store_Daily_231d\'!$B$4:$B${last_daily_row},A{rr},\'04_Store_Daily_231d\'!$E$4:$E${last_daily_row})')
    ws_exec.cell(row=24, column=1, value="Total (231d)")
    ws_exec.cell(row=24, column=2, value="=SUM(B16:B23)")
    ws_exec.cell(row=24, column=3, value="=SUM(C16:C23)")
    ws_exec.cell(row=24, column=4, value="=SUM(D16:D23)")
    ws_exec.cell(row=24, column=5, value="=C24/B24")
    ws_exec.cell(row=24, column=6, value="")
    ws_exec.cell(row=24, column=7, value="=SUM(G16:G23)")
    ws_exec.cell(row=24, column=8, value="=SUM(H16:H23)")

    style_range(ws_exec, 16, 23, 1, 8, font=FONT_BODY)
    style_range(ws_exec, 24, 24, 1, 8, font=FONT_BOLD, fill=FILL_CYAN)
    for r in range(16, 25):
        ws_exec.cell(row=r, column=2).number_format = FMT_INT
        ws_exec.cell(row=r, column=3).number_format = FMT_VND
        ws_exec.cell(row=r, column=4).number_format = FMT_INT
        ws_exec.cell(row=r, column=5).number_format = FMT_VND
        if r >= 17 and r <= 23:
            ws_exec.cell(row=r, column=6).number_format = FMT_PCT
        ws_exec.cell(row=r, column=7).number_format = FMT_PCT
        ws_exec.cell(row=r, column=8).number_format = FMT_INT

    # Section D: >10h Mega-Live Break-Even What-If Simulator (Rows 26-36)
    ws_exec.merge_cells("A26:H26")
    ws_exec["A26"] = "D. MEGA-LIVE (>10h) BREAK-EVEN SIMULATOR (SIMPSON'S PARADOX · EDIT BLUE INPUT ASSUMPTIONS)"
    style_range(ws_exec, 26, 26, 1, 8, font=FONT_SEC, fill=FILL_AMBER)

    ws_exec["A27"] = "Assumed Host + Studio Cost / Hour (VND):"
    ws_exec["C27"] = 450000
    ws_exec["D27"] = "Assumed Contribution Margin (%):"
    ws_exec["F27"] = 0.25
    ws_exec["G27"] = "Break-Even GMV/h:"
    ws_exec["H27"] = "=C27/F27"
    ws_exec.merge_cells("A27:B27")
    ws_exec.merge_cells("D27:E27")
    style_range(ws_exec, 27, 27, 1, 8, font=FONT_BOLD, fill=FILL_ZEBRA)
    ws_exec["C27"].fill = FILL_INPUT
    ws_exec["C27"].font = FONT_INPUT
    ws_exec["C27"].number_format = FMT_VND
    ws_exec["F27"].fill = FILL_INPUT
    ws_exec["F27"].font = FONT_INPUT
    ws_exec["F27"].number_format = FMT_PCT
    ws_exec["H27"].fill = FILL_AMBER
    ws_exec["H27"].number_format = FMT_VND

    sim_hdrs = ["Month (>10h Shifts)", "Sessions", "Total Hours", "Total GMV (VND)", "Actual GMV / Hour", "Est. Contribution / Hr", "Net Margin / Hr", "Stop-Loss Verdict"]
    for ci, h in enumerate(sim_hdrs, 1):
        ws_exec.cell(row=28, column=ci, value=h)
    style_range(ws_exec, 28, 28, 1, 8, font=FONT_HDR, fill=FILL_DARK, align=Alignment(horizontal="center"))

    for si, r in over10_by_month.iterrows():
        rr = 29 + si
        ws_exec.cell(row=rr, column=1, value=r["ym"])
        ws_exec.cell(row=rr, column=2, value=int(r["sessions"]))
        ws_exec.cell(row=rr, column=3, value=round(float(r["total_hours"]), 2))
        ws_exec.cell(row=rr, column=4, value=round(float(r["total_gmv_vnd"]), 0))
        ws_exec.cell(row=rr, column=5, value=f"=IF(C{rr}>0,D{rr}/C{rr},0)")
        ws_exec.cell(row=rr, column=6, value=f"=E{rr}*$F$27")
        ws_exec.cell(row=rr, column=7, value=f"=F{rr}-$C$27")
        ws_exec.cell(row=rr, column=8, value=f'=IF(E{rr}>=$H$27,"KEEP (> Break-Even)","STOP-LOSS (< Break-Even)")')

    style_range(ws_exec, 29, 33, 1, 8, font=FONT_BODY)
    for r in range(29, 34):
        ws_exec.cell(row=r, column=2).number_format = FMT_INT
        ws_exec.cell(row=r, column=3).number_format = FMT_DEC2
        ws_exec.cell(row=r, column=4).number_format = FMT_VND
        ws_exec.cell(row=r, column=5).number_format = FMT_VND
        ws_exec.cell(row=r, column=6).number_format = FMT_VND
        ws_exec.cell(row=r, column=7).number_format = FMT_VND
    auto_fit_columns(ws_exec, max_widths={"A": 34, "E": 38, "G": 30, "H": 24})

    # =========================================================================
    # SHEET 5: 05_PowerQuery_M_Script (Power Query ETL + Data Cleaning Log)
    # =========================================================================
    ws_pq = wb.create_sheet("05_PowerQuery_M_Script")
    ws_pq.views.sheetView[0].showGridLines = True

    ws_pq.merge_cells("A1:D1")
    ws_pq["A1"] = "KAMI ELY — POWER QUERY (M) CLEANING PIPELINE & DATA AUDIT LOG"
    style_range(ws_pq, 1, 1, 1, 4, font=FONT_TITLE, fill=FILL_DARK, align=Alignment(vertical="center"))
    ws_pq.row_dimensions[1].height = 26

    ws_pq["A3"] = "1. Reusable Power Query (M) Function — Parse Vietnamese Currency / View Suffixes & Shift UTC+7"
    ws_pq.merge_cells("A3:D3")
    style_range(ws_pq, 3, 3, 1, 4, font=FONT_SEC, fill=FILL_CYAN)

    pq_lines = [
        "// Power Query (M) — Clean FastMoss Vietnamese number suffixes ('k', 'm', 'Tr', 'Tỷ')",
        "let",
        "    fnParseVnNumber = (rawVal as any) as number =>",
        "        let",
        '            txt = if rawVal = null then "0" else Text.Lower(Text.Trim(Text.From(rawVal))),',
        '            clean = Text.Replace(Text.Replace(Text.Replace(txt, "₫", ""), "vnđ", ""), "đ", ""),',
        '            mult = if Text.Contains(clean, "tỷ") or Text.Contains(clean, "tỉ") then 1000000000',
        '                   else if Text.EndsWith(clean, "tr") or Text.EndsWith(clean, "m") then 1000000',
        '                   else if Text.EndsWith(clean, "k") then 1000',
        "                   else 1,",
        '            numTxt = Text.Select(clean, {"0".."9", ",", "."}),',
        '            normalized = if Text.Contains(numTxt, ",") and not Text.Contains(numTxt, ".") then Text.Replace(numTxt, ",", ".") else Text.Replace(numTxt, ",", ""),',
        "            val = try Number.FromText(normalized) * mult otherwise 0",
        "        in",
        "            val,",
        "    Source = Excel.Workbook(File.Contents(pFolderPath & \"[Kami Ely]_Creator_Livestreams_Merged.xlsx\"), null, true){0}[Data],",
        "    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars = true]),",
        '    ShiftedUTC7 = Table.AddColumn(Promoted, "StartTime_VN", each DateTime.FromText(Text.BeforeDelimiter([Thời Gian Bắt Đầu Live], "(")) + #duration(0, 13, 0, 0), type datetime),',
        '    CleanGMV = Table.AddColumn(ShiftedUTC7, "GMV_VND", each fnParseVnNumber([Doanh Thu Phiên Live (VNĐ)]), type number)',
        "in",
        "    CleanGMV",
    ]
    for i, line in enumerate(pq_lines):
        rr = 4 + i
        ws_pq.cell(row=rr, column=1, value=line)
        ws_pq.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=4)
        style_range(ws_pq, rr, rr, 1, 4, font=FONT_MONO, fill=FILL_ZEBRA)

    log_start = 4 + len(pq_lines) + 2
    ws_pq.cell(row=log_start, column=1, value="2. Data Cleaning & Reconciliation Decisions Log")
    ws_pq.merge_cells(start_row=log_start, start_column=1, end_row=log_start, end_column=4)
    style_range(ws_pq, log_start, log_start, 1, 4, font=FONT_SEC, fill=FILL_AMBER)

    log_hdrs = ["Rule ID", "Affected Table", "Issue Detected", "Cleaning Rule & Rationale"]
    for ci, h in enumerate(log_hdrs, 1):
        ws_pq.cell(row=log_start + 1, column=ci, value=h)
    style_range(ws_pq, log_start + 1, log_start + 1, 1, 4, font=FONT_HDR, fill=FILL_DARK)

    cleaning_rules = [
        ("CLN-01", "AffLive vs CrLive", "+7.59B VND double-counted across 595 official sessions", "Deduplicated via SHA-256 handle match (@shop_official); kept AffLive as unified Live baseline."),
        ("CLN-02", "CrLive (600 rows)", "Timestamps lag Vietnam local time by -13 hours", "Shifted +13h to UTC+7 before aligning against Store Daily Overview dates."),
        ("CLN-03", "AffVid (4,797 rows)", "1 duplicate video record & mixed bilingual Ads flags ('Có'/'YES')", "Deduplicated on composite key (KOC ID, Title, Publish Time) -> 4,796 clips; unified Ads flag."),
        ("CLN-04", "AffVid Views", "Mixed Vietnamese suffixes ('1,60 Tr', '1.1m', 'k')", "Normalized with suffix multiplier parser so pooled GPM reproduces 65.7k vs 77.8k exactly."),
        ("CLN-05", "Store Daily (16/06)", "Mid-year peak 315.0M VND (Z = +6.81 trailing 28d)", "Preserved raw value for totals; verified MA7<MA28 alert stability under P99/P95 Winsorization."),
        ("CLN-06", "AffLive vs KOL Dir", "24/303 live KOCs (7.92%) missing from 90d KOL directory", "Flagged is_orphan = 1 instead of deleting rows to prevent survivorship bias."),
        ("CLN-07", "SKU10 Panel FE", "338 pre-launch zero rows inflate Within R² (0.490)", "Filtered post-launch active window (cumulative units > 0 -> n = 1,422, Within R² = 0.302)."),
        ("CLN-08", "All Creator Tables", "Public creator handles represent third-party PII", "Pseudonymized handles via SHA-256 (@shop_official, @koc_sat01, koc_xxxxxxxx)."),
    ]
    for idx, (rid, tbl, iss, rat) in enumerate(cleaning_rules):
        rr = log_start + 2 + idx
        ws_pq.cell(row=rr, column=1, value=rid)
        ws_pq.cell(row=rr, column=2, value=tbl)
        ws_pq.cell(row=rr, column=3, value=iss)
        ws_pq.cell(row=rr, column=4, value=rat)
    style_range(ws_pq, log_start + 2, log_start + 1 + len(cleaning_rules), 1, 4, font=FONT_BODY)
    ws_pq.column_dimensions["A"].width = 16
    ws_pq.column_dimensions["B"].width = 24
    ws_pq.column_dimensions["C"].width = 46
    ws_pq.column_dimensions["D"].width = 62

    # Reorder sheets cleanly: 01, 02, 03, 04, 05
    wb._sheets = [ws_exec, ws_sku, ws_koc, ws_daily, ws_pq]
    wb.save(OUT_XLSX)
    print(f"SAVED_WORKBOOK: {OUT_XLSX} ({OUT_XLSX.stat().st_size:,} bytes)")
    print(f"SAVED_BI_CSVS: {list(p.name for p in BI_PACK_DIR.glob('*.csv'))}")


if __name__ == "__main__":
    main()
