"""
Build SKU Seasonality & Transition Metrics for Kami Ely
Source: MySQL table kami_sku_daily_timeseries (pplo)
Output: app/data/kami-ely/generated/sku_seasonality.json
"""
import json
import os
import sys
import mysql.connector
from collections import defaultdict

sys.stdout.reconfigure(encoding="utf-8")

OUTPUT_PATH = r"C:\Users\ADMIN\Documents\data-analyst-portfolio\app\data\kami-ely\generated\sku_seasonality.json"

SKU_COLORS = {
    "AT06": "#9BE7FA",  # Primary Cyan (Hero Autumn SKU)
    "H36":  "#FFD14C",  # Amber Gold (Hero Swimwear SKU)
    "M18":  "#FFE485",  # Soft Butter Gold (Secondary Swimwear)
    "CV11": "#0D7287",  # Deep Teal Cyan (Autumn Skirt)
    "H32":  "#38BDF8",  # Sky Blue (Swimwear)
    "SW01": "#818CF8",  # Indigo (Swimwear Bodysuit)
    "CV02": "#94A3B8",  # Slate (Year-Round Voan Skirt)
    "H30":  "#F59E0B",  # Amber 500 (Swimwear Tankini)
    "AG01": "#10B981",  # Emerald (Autumn Windbreaker)
    "AQ1":  "#EC4899",  # Pink (Sport Swimwear)
}


def main():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="173053ms",
        database="pplo",
        charset="utf8mb4",
    )
    cur = conn.cursor(dictionary=True)

    # 1. Fetch all daily records
    cur.execute("""
        SELECT 
            sku_code, product_name, category_group, season_affinity,
            record_date, cumulative_sales_units, delta_sales_units,
            cumulative_gmv_vnd, delta_gmv_vnd, avg_transaction_price_vnd
        FROM kami_sku_daily_timeseries
        ORDER BY record_date ASC, sku_code ASC;
    """)
    rows = cur.fetchall()

    # 2. Basic summaries per SKU
    skus_data = defaultdict(lambda: {
        "daily": [],
        "monthlyGmv": defaultdict(float),
        "monthlyUnits": defaultdict(int),
        "totalUnits": 0,
        "totalGmv": 0.0,
        "product_name": "",
        "category_group": "",
        "season_affinity": "",
        "avg_price": 0.0,
    })

    all_dates = set()
    for r in rows:
        sku = r["sku_code"]
        d_str = str(r["record_date"])
        ym = d_str[:7]
        all_dates.add(d_str)

        d_units = int(r["delta_sales_units"])
        d_gmv = float(r["delta_gmv_vnd"])

        skus_data[sku]["product_name"] = r["product_name"]
        skus_data[sku]["category_group"] = r["category_group"]
        skus_data[sku]["season_affinity"] = r["season_affinity"]
        if r["avg_transaction_price_vnd"]:
            skus_data[sku]["avg_price"] = float(r["avg_transaction_price_vnd"])

        skus_data[sku]["totalUnits"] += d_units
        skus_data[sku]["totalGmv"] += d_gmv
        skus_data[sku]["monthlyGmv"][ym] += d_gmv
        skus_data[sku]["monthlyUnits"][ym] += d_units
        skus_data[sku]["daily"].append({
            "date": d_str,
            "units": d_units,
            "gmv": d_gmv,
        })

    # Build SKU list sorted by total GMV
    sku_list = []
    for sku, sdata in sorted(skus_data.items(), key=lambda x: x[1]["totalGmv"], reverse=True):
        # find peak month
        peak_month = max(sdata["monthlyGmv"].keys(), key=lambda m: sdata["monthlyGmv"][m]) if sdata["monthlyGmv"] else ""
        peak_gmv = sdata["monthlyGmv"].get(peak_month, 0.0)

        # formatted monthly GMV in millions
        m_gmv_m = {m: round(v / 1e6, 2) for m, v in sorted(sdata["monthlyGmv"].items())}
        m_units = dict(sorted(sdata["monthlyUnits"].items()))

        sku_list.append({
            "code": sku,
            "name": sdata["product_name"],
            "category": sdata["category_group"],
            "affinity": sdata["season_affinity"],
            "avgPrice": round(sdata["avg_price"]),
            "totalUnits": sdata["totalUnits"],
            "totalGmv": round(sdata["totalGmv"]),
            "totalGmvM": round(sdata["totalGmv"] / 1e6, 1),
            "peakMonth": peak_month,
            "peakGmvM": round(peak_gmv / 1e6, 1),
            "color": SKU_COLORS.get(sku, "#94A3B8"),
            "monthlyGmvM": m_gmv_m,
            "monthlyUnits": m_units,
        })

    # 3. Monthly category transitions
    # Months from 2026-05 to 2026-10 (April has only 1 day: 2026-04-30)
    cur.execute("""
        SELECT 
            DATE_FORMAT(record_date, '%Y-%m') AS ym,
            SUM(CASE WHEN category_group = 'Bikini / Đồ Bơi' THEN delta_gmv_vnd ELSE 0 END) AS bikini_gmv,
            SUM(CASE WHEN category_group = 'Áo Thun' THEN delta_gmv_vnd ELSE 0 END) AS tshirt_gmv,
            SUM(CASE WHEN category_group = 'Áo Gió' THEN delta_gmv_vnd ELSE 0 END) AS wind_gmv,
            SUM(CASE WHEN sku_code = 'CV11' THEN delta_gmv_vnd ELSE 0 END) AS cv11_gmv,
            SUM(CASE WHEN sku_code = 'CV02' THEN delta_gmv_vnd ELSE 0 END) AS cv02_gmv,
            SUM(CASE WHEN category_group = 'Set Đồ Thể Thao Nữ' THEN delta_gmv_vnd ELSE 0 END) AS sport_gmv,
            SUM(CASE WHEN category_group != 'Bikini / Đồ Bơi' THEN delta_gmv_vnd ELSE 0 END) AS winter_gmv,
            SUM(delta_gmv_vnd) AS total_gmv,
            -- Sales units
            SUM(CASE WHEN category_group = 'Bikini / Đồ Bơi' THEN delta_sales_units ELSE 0 END) AS bikini_units,
            SUM(CASE WHEN category_group = 'Áo Thun' THEN delta_sales_units ELSE 0 END) AS tshirt_units,
            SUM(CASE WHEN category_group = 'Áo Gió' THEN delta_sales_units ELSE 0 END) AS wind_units,
            SUM(CASE WHEN sku_code = 'CV11' THEN delta_sales_units ELSE 0 END) AS cv11_units,
            SUM(CASE WHEN sku_code = 'CV02' THEN delta_sales_units ELSE 0 END) AS cv02_units,
            SUM(CASE WHEN category_group = 'Set Đồ Thể Thao Nữ' THEN delta_sales_units ELSE 0 END) AS sport_units,
            SUM(CASE WHEN category_group != 'Bikini / Đồ Bơi' THEN delta_sales_units ELSE 0 END) AS winter_units,
            SUM(delta_sales_units) AS total_units
        FROM kami_sku_daily_timeseries
        WHERE record_date >= '2026-05-01'
        GROUP BY ym
        ORDER BY ym ASC;
    """)
    m_cat_rows = cur.fetchall()

    monthly_transitions = []
    month_names = {
        "2026-05": "T5 (Khởi động)",
        "2026-06": "T6 (Đỉnh Hè)",
        "2026-07": "T7 (Hạ nhiệt)",
        "2026-08": "T8 (Đáy Hè)",
        "2026-09": "T9 (Chuyển Mùa)",
        "2026-10": "T10 (Bùng nổ Thu Đông)",
    }

    for r in m_cat_rows:
        ym = str(r["ym"])
        bikini_m = round(float(r["bikini_gmv"]) / 1e6, 1)
        tshirt_m = round(float(r["tshirt_gmv"]) / 1e6, 1)
        wind_m = round(float(r["wind_gmv"]) / 1e6, 1)
        cv11_m = round(float(r["cv11_gmv"]) / 1e6, 1)
        cv02_m = round(float(r["cv02_gmv"]) / 1e6, 1)
        sport_m = round(float(r["sport_gmv"]) / 1e6, 1)
        winter_m = round(float(r["winter_gmv"]) / 1e6, 1)
        tot_m = round(float(r["total_gmv"]) / 1e6, 1)

        b_units = int(r["bikini_units"])
        ts_units = int(r["tshirt_units"])
        w_units = int(r["wind_units"])
        sk_units = int(r["cv11_units"]) + int(r["cv02_units"])
        sp_units = int(r["sport_units"])
        win_units = int(r["winter_units"])
        tot_units = int(r["total_units"])

        swim_share = round((float(r["bikini_gmv"]) / float(r["total_gmv"]) * 100), 1) if tot_m > 0 else 0.0
        winter_share = round((float(r["winter_gmv"]) / float(r["total_gmv"]) * 100), 1) if tot_m > 0 else 0.0

        monthly_transitions.append({
            "month": ym,
            "label": month_names.get(ym, ym),
            "bikiniGmvM": bikini_m,
            "tshirtGmvM": tshirt_m,
            "windbreakerGmvM": wind_m,
            "skirtGmvM": round(cv11_m + cv02_m, 1),
            "sportswearGmvM": sport_m,
            # Units per category:
            "bikiniUnits": b_units,
            "tshirtUnits": ts_units,
            "windbreakerUnits": w_units,
            "skirtUnits": sk_units,
            "sportswearUnits": sp_units,
            "winterUnits": win_units,
            "totalUnits": tot_units,
            # Dual-pole seasonal aggregates:
            "swimwearGmvM": bikini_m,
            "autumnGmvM": winter_m,
            "winterGmvM": winter_m,
            "yearRoundGmvM": 0.0,
            "totalGmvM": tot_m,
            "bikiniSharePct": swim_share,
            "swimwearSharePct": swim_share,
            "autumnSharePct": winter_share,
            "winterSharePct": winter_share,
            "yearRoundSharePct": 0.0,
            "swimwearUnits": b_units,
            "autumnUnits": win_units,
            "yearRoundUnits": 0,
        })

    # 4. Weekly category aggregates (ISO Weeks)
    cur.execute("""
        SELECT 
            YEARWEEK(record_date, 3) AS yw,
            MIN(record_date) AS min_d,
            MAX(record_date) AS max_d,
            SUM(CASE WHEN category_group = 'Bikini / Đồ Bơi' THEN delta_gmv_vnd ELSE 0 END) AS swimwear_gmv,
            SUM(CASE WHEN category_group != 'Bikini / Đồ Bơi' THEN delta_gmv_vnd ELSE 0 END) AS winter_gmv,
            SUM(CASE WHEN sku_code = 'AT06' THEN delta_gmv_vnd ELSE 0 END) AS at06_gmv,
            SUM(CASE WHEN sku_code = 'H36' THEN delta_gmv_vnd ELSE 0 END) AS h36_gmv,
            SUM(CASE WHEN sku_code = 'M18' THEN delta_gmv_vnd ELSE 0 END) AS m18_gmv,
            SUM(CASE WHEN sku_code = 'CV11' THEN delta_gmv_vnd ELSE 0 END) AS cv11_gmv,
            SUM(CASE WHEN sku_code = 'CV02' THEN delta_gmv_vnd ELSE 0 END) AS cv02_gmv,
            SUM(CASE WHEN sku_code = 'AG01' THEN delta_gmv_vnd ELSE 0 END) AS ag01_gmv,
            SUM(CASE WHEN sku_code = 'AQ1' THEN delta_gmv_vnd ELSE 0 END) AS aq1_gmv,
            SUM(delta_gmv_vnd) AS total_gmv,
            -- Weekly Sales units
            SUM(CASE WHEN category_group = 'Bikini / Đồ Bơi' THEN delta_sales_units ELSE 0 END) AS swimwear_units,
            SUM(CASE WHEN category_group != 'Bikini / Đồ Bơi' THEN delta_sales_units ELSE 0 END) AS winter_units,
            SUM(CASE WHEN sku_code = 'AT06' THEN delta_sales_units ELSE 0 END) AS at06_units,
            SUM(CASE WHEN sku_code = 'H36' THEN delta_sales_units ELSE 0 END) AS h36_units,
            SUM(CASE WHEN sku_code = 'M18' THEN delta_sales_units ELSE 0 END) AS m18_units,
            SUM(CASE WHEN sku_code = 'CV11' THEN delta_sales_units ELSE 0 END) AS cv11_units,
            SUM(CASE WHEN sku_code = 'CV02' THEN delta_sales_units ELSE 0 END) AS cv02_units,
            SUM(CASE WHEN sku_code = 'AG01' THEN delta_sales_units ELSE 0 END) AS ag01_units,
            SUM(CASE WHEN sku_code = 'AQ1' THEN delta_sales_units ELSE 0 END) AS aq1_units,
            SUM(delta_sales_units) AS total_units
        FROM kami_sku_daily_timeseries
        WHERE record_date >= '2026-05-04'
        GROUP BY yw
        ORDER BY yw ASC;
    """)
    weekly_rows = cur.fetchall()

    weekly_series = []
    has_crossed = False
    for r in weekly_rows:
        yw = str(r["yw"])
        week_num = int(yw[4:])
        min_d = str(r["min_d"])
        label = f"W{week_num} ({min_d[8:10]}/{min_d[5:7]})"

        swim_m = round(float(r["swimwear_gmv"]) / 1e6, 1)
        winter_m = round(float(r["winter_gmv"]) / 1e6, 1)
        tot_m = round(float(r["total_gmv"]) / 1e6, 1)

        # Check crossover point (Winter > Summer sustainably, starting from W36)
        is_crossover = False
        if winter_m > swim_m and not has_crossed and week_num >= 36:
            is_crossover = True
            has_crossed = True

        weekly_series.append({
            "week": label,
            "weekNum": week_num,
            "startDate": min_d,
            "swimwearGmvM": swim_m,
            "autumnGmvM": winter_m,
            "winterGmvM": winter_m,
            "at06GmvM": round(float(r["at06_gmv"]) / 1e6, 1),
            "h36GmvM": round(float(r["h36_gmv"]) / 1e6, 1),
            "m18GmvM": round(float(r["m18_gmv"]) / 1e6, 1),
            "cv11GmvM": round(float(r["cv11_gmv"]) / 1e6, 1),
            "cv02GmvM": round(float(r["cv02_gmv"]) / 1e6, 1),
            "ag01GmvM": round(float(r["ag01_gmv"]) / 1e6, 1),
            "aq1GmvM": round(float(r["aq1_gmv"]) / 1e6, 1),
            "totalGmvM": tot_m,
            # Weekly units
            "swimwearUnits": int(r["swimwear_units"]),
            "winterUnits": int(r["winter_units"]),
            "at06Units": int(r["at06_units"]),
            "h36Units": int(r["h36_units"]),
            "m18Units": int(r["m18_units"]),
            "cv11Units": int(r["cv11_units"]),
            "cv02Units": int(r["cv02_units"]),
            "ag01Units": int(r["ag01_units"]),
            "aq1Units": int(r["aq1_units"]),
            "totalUnits": int(r["total_units"]),
            "isCrossover": is_crossover,
        })

    # 4b. Daily category aggregates (Daily Histogram & 7-day Moving Average)
    cur.execute("""
        SELECT 
            record_date,
            SUM(CASE WHEN season_affinity = 'Hàng Bán Hè' THEN delta_gmv_vnd ELSE 0 END) AS summer_gmv,
            SUM(CASE WHEN season_affinity != 'Hàng Bán Hè' THEN delta_gmv_vnd ELSE 0 END) AS winter_gmv,
            SUM(CASE WHEN season_affinity = 'Hàng Bán Hè' THEN delta_sales_units ELSE 0 END) AS summer_units,
            SUM(CASE WHEN season_affinity != 'Hàng Bán Hè' THEN delta_sales_units ELSE 0 END) AS winter_units,
            SUM(delta_gmv_vnd) AS total_gmv,
            SUM(delta_sales_units) AS total_units
        FROM kami_sku_daily_timeseries
        GROUP BY record_date
        ORDER BY record_date ASC;
    """)
    daily_rows = cur.fetchall()

    daily_transitions = []
    recent_s_gmv = []
    recent_w_gmv = []
    recent_s_units = []
    recent_w_units = []

    for r in daily_rows:
        d_str = str(r["record_date"])
        label = f"{d_str[8:10]}/{d_str[5:7]}"
        s_gmv_m = round(float(r["summer_gmv"]) / 1e6, 2)
        w_gmv_m = round(float(r["winter_gmv"]) / 1e6, 2)
        s_units = int(r["summer_units"])
        w_units = int(r["winter_units"])

        recent_s_gmv.append(s_gmv_m)
        recent_w_gmv.append(w_gmv_m)
        recent_s_units.append(s_units)
        recent_w_units.append(w_units)

        if len(recent_s_gmv) > 7:
            recent_s_gmv.pop(0)
            recent_w_gmv.pop(0)
            recent_s_units.pop(0)
            recent_w_units.pop(0)

        s_ma7_gmv = round(sum(recent_s_gmv) / len(recent_s_gmv), 2)
        w_ma7_gmv = round(sum(recent_w_gmv) / len(recent_w_gmv), 2)
        s_ma7_units = round(sum(recent_s_units) / len(recent_s_units), 1)
        w_ma7_units = round(sum(recent_w_units) / len(recent_w_units), 1)

        daily_transitions.append({
            "date": d_str,
            "label": label,
            "summerGmvM": s_gmv_m,
            "winterGmvM": w_gmv_m,
            "summerUnits": s_units,
            "winterUnits": w_units,
            "maxGmvM": max(s_gmv_m, w_gmv_m),
            "minGmvM": min(s_gmv_m, w_gmv_m),
            "maxUnits": max(s_units, w_units),
            "minUnits": min(s_units, w_units),
            "totalGmvM": round(float(r["total_gmv"]) / 1e6, 2),
            "totalUnits": int(r["total_units"]),
            "summerMa7GmvM": s_ma7_gmv,
            "winterMa7GmvM": w_ma7_gmv,
            "summerMa7Units": s_ma7_units,
            "winterMa7Units": w_ma7_units,
            "isCrossover": (d_str == "2026-08-31"),
        })

    # 5. Build full payload
    total_winter_gmv = sum(s["totalGmv"] for s in sku_list if s["category"] != "Bikini / Đồ Bơi")
    total_summer_gmv = sum(s["totalGmv"] for s in sku_list if s["category"] == "Bikini / Đồ Bơi")
    total_winter_units = sum(s["totalUnits"] for s in sku_list if s["category"] != "Bikini / Đồ Bơi")
    total_summer_units = sum(s["totalUnits"] for s in sku_list if s["category"] == "Bikini / Đồ Bơi")

    payload = {
        "summary": {
            "totalSkus": len(sku_list),
            "totalDays": len(all_dates),
            "totalGmv": round(sum(s["totalGmv"] for s in sku_list)),
            "totalGmvM": round(sum(s["totalGmv"] for s in sku_list) / 1e6, 1),
            "totalUnits": sum(s["totalUnits"] for s in sku_list),
            "summerUnits": total_summer_units,
            "winterUnits": total_winter_units,
            "bikiniUnits": total_summer_units,
            "tshirtUnits": sum(s["totalUnits"] for s in sku_list if s["category"] == "Áo Thun"),
            "skirtUnits": sum(s["totalUnits"] for s in sku_list if s["category"] == "Chân Váy"),
            "windbreakerUnits": sum(s["totalUnits"] for s in sku_list if s["category"] == "Áo Gió"),
            "sportswearUnits": sum(s["totalUnits"] for s in sku_list if s["category"] == "Set Đồ Thể Thao Nữ"),
            "dateRange": {
                "start": min(all_dates) if all_dates else "",
                "end": max(all_dates) if all_dates else "",
            },
            "bikiniGmvM": round(total_summer_gmv / 1e6, 1),
            "tshirtGmvM": round(sum(s["totalGmv"] for s in sku_list if s["category"] == "Áo Thun") / 1e6, 1),
            "skirtGmvM": round(sum(s["totalGmv"] for s in sku_list if s["category"] == "Chân Váy") / 1e6, 1),
            "windbreakerGmvM": round(sum(s["totalGmv"] for s in sku_list if s["category"] == "Áo Gió") / 1e6, 1),
            "sportswearGmvM": round(sum(s["totalGmv"] for s in sku_list if s["category"] == "Set Đồ Thể Thao Nữ") / 1e6, 1),
            "swimwearGmvM": round(total_summer_gmv / 1e6, 1),
            "summerGmvM": round(total_summer_gmv / 1e6, 1),
            "autumnGmvM": round(total_winter_gmv / 1e6, 1),
            "winterGmvM": round(total_winter_gmv / 1e6, 1),
            "yearRoundGmvM": 0.0,
        },
        "skus": sku_list,
        "monthlyTransitions": monthly_transitions,
        "dailyTransitions": daily_transitions,
        "weeklySeries": weekly_series,
        "transitionInsights": [
            {
                "phase": "Pha 1: Bùng Nổ Cao Điểm Hè (Tháng 5 – Tháng 7)",
                "phaseEn": "Phase 1: Summer Peak Dominance (May – July)",
                "kpi": "90,9% GMV Bikini T6",
                "tag": "Đỉnh Hè 1,57 Tỷ/tháng",
                "desc": "5 mã Bikini / Đồ bơi (H36, M18, SW01, H32, H30) độc chiếm giỏ hàng hè. Đỉnh điểm Tháng 6 đạt 1.566,1M đ (90,9% doanh thu mẫu), dẫn đầu bởi H36 (572,8M đ) và M18 (350,4M đ). Nhóm Hàng Bán Đông (Chân váy CV11, CV02) đóng góp nền tảng 157,0M đ.",
                "descEn": "5 Summer Bikini SKUs dominated sales. June peaked at 1,566.1M VND (90.9% share), led by H36 (572.8M) and M18 (350.4M). Winter merchandise (Skirts CV11, CV02) provided a baseline of 157.0M VND.",
            },
            {
                "phase": "Pha 2: Điểm Rơi Mùa Vụ & Vực Thẳm Tháng 8 (Tháng 8)",
                "phaseEn": "Phase 2: Seasonal Drop & The August Chasm (August)",
                "kpi": "-90,2% GMV Bikini",
                "tag": "Lao dốc tự nhiên",
                "desc": "Khi mùa du lịch biển kết thúc, doanh số Bikini bốc hơi từ 1.566,1M đ xuống chỉ còn 152,7M đ (T8). Cả 4 dòng Hàng Bán Đông (Chân váy CV11, CV02 đạt 94,6M đ; Set thể thao nữ AQ1 đạt 15,0M đ) giữ vững 109,6M đ (41,8% thị phần), đóng vai trò vùng đệm sống còn trước khi vào vụ lạnh.",
                "descEn": "As beach vacations ceased, Bikini revenue tumbled from 1,566.1M VND to 152.7M VND. The 4 Winter product lines (Skirts CV11/CV02 at 94.6M, Sports set AQ1 at 15.0M) secured 109.6M VND (41.8% share) as a critical lifeline.",
            },
            {
                "phase": "Pha 3: Thử Nghiệm & Đảo Trạng Thái Sang Hàng Bán Đông (Tháng 9)",
                "phaseEn": "Phase 3: Seasonal Pivot to Winter Merchandise (September)",
                "kpi": "Crossover Tuần 36-37",
                "tag": "Chuyển trục Hàng Đông",
                "desc": "Gian hàng bẻ lái toàn diện sang 4 dòng Hàng Bán Đông: Áo thun nữ dài tay cotton rib AT06 (297,7M đ), Áo khoác gió AG01 (47,4M đ), Chân váy CV11 (123,1M đ) và Set thể thao AQ1 (8,4M đ). Hàng Bán Đông chiếm áp đảo 518,8M đ (90,7% thị phần), chính thức đảo ngôi vương của Bikini.",
                "descEn": "The store executed a full pivot to 4 Winter lines: AT06 long-sleeve tee (297.7M), AG01 windbreaker (47.4M), CV11 skirt (123.1M), and AQ1 sports set (8.4M). Winter items seized 518.8M VND (90.7% share), surpassing Bikini.",
            },
            {
                "phase": "Pha 4: Cứu Tinh AT06 & Xác Lập Đỉnh Mới Mùa Đông (Tháng 10)",
                "phaseEn": "Phase 4: Hero SKU AT06 & Winter Expansion (October)",
                "kpi": "98,4% GMV Hàng Đông T10",
                "tag": "1,53 Tỷ đ Hàng Đông",
                "desc": "Áo thun nữ dài tay AT06 bùng nổ 1.301,0M đ chỉ trong 25 ngày, kết hợp cùng Chân váy CV11 (194,1M đ) và CV02 (24,5M đ). Hàng Bán Đông đạt kỷ lục 1.533,5M đ (98,4% doanh thu mẫu), xác lập chu kỳ tăng trưởng vụ đông thành công mỹ mãn.",
                "descEn": "AT06 long-sleeve tee surged with 1,301.0M VND in 25 days, paired with CV11 (194.1M) and CV02 (24.5M). Winter merchandise set a record 1,533.5M VND (98.4% share), completing the winter transition.",
            },
        ],
    }

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"\nSuccessfully generated {OUTPUT_PATH}")
    print(f"Summary: {len(sku_list)} SKUs | {len(weekly_series)} weeks | Total GMV: {payload['summary']['totalGmvM']}M đ")

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
