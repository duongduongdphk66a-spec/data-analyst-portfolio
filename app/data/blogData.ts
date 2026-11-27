export interface BlogPost {
  id: string;
  slug: string;
  projectKey: "heritage-japan" | "kami-ely" | "library-bus" | "sql-methodology";
  projectSlug: string;
  featured?: boolean;
  categoryVi: string;
  categoryEn: string;
  readTimeVi: string;
  readTimeEn: string;
  date: string;
  titleVi: string;
  titleEn: string;
  excerptVi: string;
  excerptEn: string;
  problemVi: string;
  problemEn: string;
  processVi: string[];
  processEn: string[];
  findingsVi: string;
  findingsEn: string;
  codeLanguage: "sql" | "python";
  codeTitleVi: string;
  codeTitleEn: string;
  codeSnippet: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "heritage-japan-audit",
    slug: "why-simple-averages-mislead-heritage-japan",
    projectKey: "heritage-japan",
    projectSlug: "/projects/proj-heritage-japan",
    featured: true,
    categoryVi: "Data Audit & Chuỗi thời gian",
    categoryEn: "Data Audit & Time-Series",
    readTimeVi: "3 phút đọc",
    readTimeEn: "3 min read",
    date: "2026-09",
    titleVi:
      "Tự kiểm toán 5 lỗi số liệu và bẫy chỉ số bình quân trong niên luận Du lịch Di sản Nhật Bản",
    titleEn:
      "Auditing 5 Data Errors and Per-Visitor Spend Traps in My Japan Heritage Tourism Thesis",
    excerptVi:
      "Hậu trường đối soát 6 chuỗi dữ liệu gốc tiếng Nhật (JNTO, MLIT, Kyoto, Nara): sửa lỗi phóng đại ×10 đơn vị 億円/万人, lệch năm +1 ở Kyoto và bóc tách mức giảm -14,6% chi tiêu/khách sau 2015.",
    excerptEn:
      "Behind the audit of 6 primary Japanese series (JNTO, MLIT, Kyoto, Nara): fixing 10× 億円/万人 unit errors, a +1-year Kyoto axis shift, and unpacking the -14.6% per-visitor spend drop post-2015.",
    problemVi:
      "Khi chuyển niên luận đại học (01/2024) thành case study DA, mình đối soát lại toàn bộ 6 biểu đồ với báo cáo gốc tiếng Nhật của JNTO, MLIT, TP. Kyoto và TP. Nara. Kết quả phát hiện 5 lỗi trực tiếp làm sai lệch kết luận: chi tiêu Nara bị phóng đại ×10 do đọc nhầm đơn vị 億円 thành tỷ Yên, chuỗi Kyoto bị đẩy tiến +1 năm từ 2012, và phép tính YoY đi xuyên qua năm đổi phương pháp khảo sát R1/2019.",
    problemEn:
      "When converting my Jan 2024 undergraduate thesis into a DA case study, I reconciled all 6 charts against primary Japanese reports from JNTO, MLIT, Kyoto City, and Nara City. The audit uncovered 5 material errors: Nara spend inflated 10× from misreading 億円 as billion JPY, Kyoto's axis shifted +1 year from 2012 onward, and YoY growth calculated across Kyoto's R1/2019 survey break.",
    processVi: [
      "Chia 10 chuỗi chi tiêu Nara về Tỷ Yên (2018: 120,8 tỷ ¥ ≈ 1/11 Kyoto; 2019: 114,7 tỷ ¥) và sửa lượt khách Nara 2020 từ 28,9 nghìn thành 289 nghìn (28,9 万人).",
      "Lùi trục năm -1 cho chuỗi Kyoto giai đoạn raw_year >= 2012 và trả NULL cho YoY năm R1/2019 thay vì tính mức sụt giảm giả -15,6%.",
      "Tách bạch 4,81 nghìn tỷ Yên chi tiêu khách quốc tế (~0,86% GDP 2019) khỏi đóng góp 7,5% GDP toàn ngành du lịch theo WTTC (nội địa + quốc tế + gián tiếp).",
      "Đối chiếu thêm yếu tố tỷ giá Yên (~121 lên ~109 JPY/USD giai đoạn 2015–2019) và cơ cấu khách Đông Á ngắn ngày khi lý giải mức giảm -14,6% chi tiêu/khách (176,6k → 150,8k ¥).",
    ],
    processEn: [
      "Divided Nara's spend series by 10 to Billion JPY (2018: ¥120.8B ≈ 1/11 of Kyoto; 2019: ¥114.7B) and fixed Nara 2020 arrivals from 28.9k to 289k (28.9 万人).",
      "Shifted Kyoto's axis back by 1 year for raw_year >= 2012 and suppressed YoY (NULL) across the R1/2019 methodology break instead of reporting a fake -15.6% drop.",
      "Separated ¥4.81T inbound visitor spending (~0.86% of 2019 GDP) from WTTC's 7.5% total Travel & Tourism GDP (domestic + inbound + indirect).",
      "Accounted for JPY appreciation (~121 to ~109 JPY/USD in 2015–2019) and short-haul East Asian mix shift when interpreting the -14.6% per-visitor spend drop (¥176.6k → ¥150.8k).",
    ],
    findingsVi:
      "Sau khi làm sạch, bức tranh nhất quán hơn hẳn: khách quốc tế đỉnh 2019 đạt 31,9 triệu (+206,7% vs. 2013), Nara chịu độ lệch lớn giữa lượng khách đi trong ngày và quy mô chi tiêu (1/11 Kyoto), còn làng cổ Shirakawa-go đối mặt 3.000 lượt khách/cư dân/năm (~8,2 khách/dân/ngày). Bài học cốt lõi là kiểm tra đơn vị gốc và ranh giới phương pháp đo luôn quan trọng hơn chạy mô hình phức tạp trên bảng số lỗi.",
    findingsEn:
      "After auditing, the numbers align cleanly: inbound arrivals peaked at 31.9M in 2019 (+206.7% vs. 2013), Nara's total spend stayed at ~1/11 of Kyoto due to day-tripping, and Shirakawa-go faced 3,000 annual visits per resident (~8.2/resident/day). Verifying raw units and methodology breaks matters more than fitting complex models on dirty tables.",
    codeLanguage: "sql",
    codeTitleVi: "MySQL 8.0 · Hiệu chỉnh lệch năm Kyoto, đơn vị Nara và mốc đứt gãy R1/2019",
    codeTitleEn: "MySQL 8.0 · Fixing Kyoto Axis Shift, Nara Units & R1/2019 Break",
    codeSnippet: `WITH cleaned_series AS (
  SELECT
    region_code,
    CASE
      WHEN region_code = 'KYOTO_CITY' AND raw_year >= 2012 THEN raw_year - 1
      ELSE raw_year
    END AS report_year,
    CASE
      WHEN region_code = 'NARA_CITY' AND raw_year = 2020 THEN raw_visitors_k * 10.0
      ELSE raw_visitors_k
    END AS visitors_k,
    CASE
      WHEN region_code = 'NARA_CITY' THEN raw_spend_unit / 10.0
      ELSE raw_spend_unit
    END AS spend_billion_jpy,
    CASE
      WHEN region_code = 'KYOTO_CITY' AND raw_year = 2020 THEN 'METHOD_BREAK_R1_2019'
      ELSE 'CONTINUOUS'
    END AS method_flag
  FROM heritage_raw_thesis_series
)
SELECT
  region_code,
  report_year,
  ROUND(visitors_k, 1) AS visitors_k,
  ROUND(spend_billion_jpy, 2) AS spend_billion_jpy,
  CASE
    WHEN method_flag = 'METHOD_BREAK_R1_2019' THEN NULL
    ELSE ROUND(
      (visitors_k - LAG(visitors_k) OVER (PARTITION BY region_code ORDER BY report_year)) * 100.0
      / NULLIF(LAG(visitors_k) OVER (PARTITION BY region_code ORDER BY report_year), 0),
      1
    )
  END AS yoy_visitors_pct
FROM cleaned_series
WHERE report_year BETWEEN 2013 AND 2022
ORDER BY region_code, report_year;`,
    tags: ["Data Audit", "MySQL 8.0", "Time-Series", "Heritage Japan"],
  },
  {
    id: "tiktok-shop-reconciliation",
    slug: "reconciling-tiktok-shop-gmv-discrepancies-sql-python",
    projectKey: "kami-ely",
    projectSlug: "/projects/proj-kami-ely",
    featured: true,
    categoryVi: "E-Commerce & Thống kê Ứng dụng",
    categoryEn: "E-Commerce & Applied Statistics",
    readTimeVi: "3 phút đọc",
    readTimeEn: "3 min read",
    date: "2026-09",
    titleVi:
      "Đối soát 10 bảng FastMoss trên TikTok Shop: Tránh bẫy cộng trùng 7,59 tỷ và thiên lệch phân tầng",
    titleEn:
      "Reconciling 10 FastMoss TikTok Shop Tables: Catching a 7.59B Double-Count and Stratification Traps",
    excerptVi:
      "Cách khử trùng 595 phiên livestream chính chủ giữa AffLive và CrLive, phân tầng Video Ads qua 6 lát cắt và tính chi phí cơ hội trước khi đề xuất luật cắt KOC.",
    excerptEn:
      "How I deduplicated 595 official live sessions across AffLive and CrLive, stratified Video Ads across 6 slices, and quantified false-positive GMV loss before proposing a KOC cutoff rule.",
    problemVi:
      "Trong bộ 10 bảng ước tính FastMoss của Kami Ely (231 ngày: 15,01 tỷ đ GMV, 101.896 sản phẩm), nếu cộng thô bảng AffLive (10,47 tỷ, 226 ngày) với CrLive (7,59 tỷ) sẽ ra 18,06 tỷ, vượt 120,3% doanh thu toàn gian hàng. Bên cạnh đó, phép so sánh tổng gộp dễ rơi vào hai bẫy: kết luận kéo dài phiên Live >10h tạo 4,55 Tr/giờ dù 69% đến từ riêng tháng 6, và đề xuất cắt KOC sau 3 phiên 0đ mà bỏ quên nhóm chuyển đổi muộn.",
    problemEn:
      "Across 10 FastMoss tables for Kami Ely (231 days: 15.01B VND GMV, 101,896 units), naively summing AffLive (10.47B, 226d) and CrLive (7.59B) yields 18.06B (120.3% of Net Store GMV). Aggregate cuts also hide two traps: attributing 4.55M/hr to >10h livestreams when 69% came from peak June alone, and proposing a hard 3-session KOC cutoff without pricing late converters.",
    processVi: [
      "Chuyển múi giờ CrLive (+13h UTC+7), khử trùng 595 phiên chính chủ trùng với AffLive (tránh cộng trùng +7,59 tỷ) và khóa quy tắc không lấy Gross phiên trừ Net cửa hàng.",
      "Gộp nhãn song ngữ YES/có trên 4.796 video khử trùng, chạy Fisher Exact và Mann-Whitney U (SciPy) kèm kiểm tra 6 lát cắt (kể cả trong cùng 192 KOC có cả clip Ads và Organic).",
      "Phân tầng thời lượng Live >10h theo từng tháng để kiểm tra Simpson's Paradox (Tháng 6: 8,30 Tr/h, Tháng 7: 1,38 Tr/h, Tháng 8: 0,73 Tr/h).",
      "Kiểm tra chi phí cơ hội của luật 3 phiên 0đ: tách 94 KOC không bao giờ ra đơn khỏi 51 KOC chuyển đổi ở phiên 4+ (tạo 304,9 triệu = 18,8% Live độc lập) để chuyển sang luật hỗ trợ 2 tầng.",
    ],
    processEn: [
      "Shifted CrLive timestamps (+13h UTC+7), deduplicated 595 official sessions overlapping AffLive (preventing +7.59B double-counting), and banned subtracting Gross sessions from Net Store GMV.",
      "Merged bilingual YES/có flags across 4,796 deduplicated videos and ran Fisher Exact + Mann-Whitney U tests across 6 slices (including within-192 dual KOCs).",
      "Stratified >10h live sessions by month to catch Simpson's Paradox (June: 8.30M/hr, July: 1.38M/hr, August: 0.73M/hr).",
      "Audited false-positive GMV loss under a 3-session cutoff: 51 of 145 zero-start KOCs converted in session 4+ and generated 304.9M VND (18.8% of independent Live GMV), leading to a 2-tier policy.",
    ],
    findingsVi:
      "Live nội bộ (chính chủ + vệ tinh @koc_sat01) chiếm 84,5% doanh thu livestream, còn KOC ngoài dẫn dắt 58,4% doanh thu Video. Video có ủy quyền Ads chuyển đổi cao hơn +20,1 đpt (OR = 3,83, p = 4,19e-44) nhưng GPM tổng lại thấp hơn Organic (0,84×; trong cùng 192 KOC chỉ 0,73×), nên chỉ nên cấp mã Ads có chọn lọc trên clip đã có đơn tự nhiên.",
    findingsEn:
      "In-house channels (official + satellite @koc_sat01) drove 84.5% of live GMV while external KOCs drove 58.4% of Video GMV. Ad-authorized clips converted +20.1pp higher (OR = 3.83, p = 4.19e-44) yet yielded lower overall GPM (0.84×; 0.73× within dual KOCs), favoring selective Spark Ads only on organically converting videos.",
    codeLanguage: "python",
    codeTitleVi: "Python (SciPy) · Kiểm định Fisher Exact & Mann-Whitney U cho 4.796 Video",
    codeTitleEn: "Python (SciPy) · Fisher Exact & Mann-Whitney U on 4,796 Videos",
    codeSnippet: `from scipy import stats
import pandas as pd

def audit_video_ads_effect(df: pd.DataFrame) -> dict:
    # df: 4,796 deduplicated affiliate videos after merging YES/có flags
    ads = df[df["is_ad_authorized"] == 1]
    org = df[df["is_ad_authorized"] == 0]

    table = [
        [(ads["gmv_vnd"] > 0).sum(), (ads["gmv_vnd"] == 0).sum()],
        [(org["gmv_vnd"] > 0).sum(), (org["gmv_vnd"] == 0).sum()],
    ]
    odds_ratio, fisher_p = stats.fisher_exact(table)

    # Compare GPM on converting videos (skewed non-normal distribution)
    u_stat, mw_p = stats.mannwhitneyu(
        ads.loc[ads["gmv_vnd"] > 0, "gpm_vnd"],
        org.loc[org["gmv_vnd"] > 0, "gpm_vnd"],
        alternative="two-sided",
    )
    return {
        "ads_conv_pct": round((ads["gmv_vnd"] > 0).mean() * 100, 1),
        "org_conv_pct": round((org["gmv_vnd"] > 0).mean() * 100, 1),
        "fisher_or": round(float(odds_ratio), 2),
        "fisher_p": float(fisher_p),
        "mw_gpm_p": float(mw_p),
    }`,
    tags: ["Data Reconciliation", "Simpson's Paradox", "SciPy", "Kami Ely"],
  },
  {
    id: "library-bus-telemetry",
    slug: "from-ux-research-to-telemetry-architecture-library-bus",
    projectKey: "library-bus",
    projectSlug: "/projects/proj-library-bus",
    featured: false,
    categoryVi: "Technical BA & Product Analytics",
    categoryEn: "Technical BA & Product Analytics",
    readTimeVi: "3 phút đọc",
    readTimeEn: "3 min read",
    date: "2026-08",
    titleVi:
      "Từ đặc tả Technical BA đến Tracking Plan và truy vấn MySQL 8.0 cho Library Bus",
    titleEn:
      "From Technical BA Specs to an Event Tracking Plan and MySQL 8.0 Queries for Library Bus",
    excerptVi:
      "Cách chuyển hóa 4 quy tắc nghiệp vụ mượn trả xe thư viện lưu động thành ERD 7 thực thể lõi, Tracking Plan 8 sự kiện đồng bộ schema và truy vấn KPI tránh lỗi right-censoring.",
    excerptEn:
      "Translating 4 mobile-library circulation rules into a 7-entity core ERD, a schema-aligned 8-event Tracking Plan, and a right-censoring-safe MySQL 8.0 KPI query.",
    problemVi:
      "Khi thiết kế hệ thống cho mạng lưới xe thư viện lưu động ở giai đoạn tiền vận hành, bài toán BA không chỉ dừng ở vẽ màn hình: cần chặn đặt trùng bản sách cuối cùng, giữ công bằng hàng đợi 7 ngày theo lịch xe ghé trạm, đặt mức trần tiền phạt hợp lý và cài sẵn Tracking Plan để đo hiệu suất từng tuyến ngay trong đợt thí điểm 4 tuần.",
    problemEn:
      "Designing a pre-launch mobile library system requires more than UI mockups: we must prevent last-copy double-booking, align 7-day reservation holds with bus stop schedules, cap overdue fines at replacement value, and embed a Tracking Plan to measure route efficiency during a 4-week pilot.",
    processVi: [
      "Khóa phạm vi MoSCoW MVP (4 quy tắc BR-01..04 và danh mục sách theo điểm dừng), tách rõ GPS phần cứng và AI gợi ý sách ra ngoài Giai đoạn 1.",
      "Tách thực thể đầu sách (BookTitle) khỏi tồn kho vật lý trên từng xe (BusBookInventory) trong ERD lõi, đồng thời bổ sung quy tắc đồng bộ offline và trần phí phạt bằng giá đền sách.",
      "Đồng nhất tên 8 sự kiện giữa Tracking Plan và bảng UserActivity để phục vụ trực tiếp khung quyết định Pilot 4 tuần trên 2 tuyến xe.",
      "Viết truy vấn MySQL 8.0 dùng 2 CTE cùng cửa sổ UTC, LEFT JOIN từ danh sách xe (tránh sót xe 0 đơn) và lọc cohort đặt trước đủ chín ≥7 ngày (tránh lệch right-censoring).",
    ],
    processEn: [
      "Scoped MoSCoW MVP to BR-01..04 and stop-level catalogs while deferring hardware GPS and AI recommendations out of Phase 1.",
      "Separated bibliographic titles (BookTitle) from physical bus copies (BusBookInventory) in the core ERD, and added offline sync plus replacement-cost fine caps.",
      "Aligned all 8 event names between the Tracking Plan and UserActivity schema to directly power the 4-week 2-route pilot decision matrix.",
      "Wrote a MySQL 8.0 KPI query using aligned UTC CTEs, LEFT JOIN from the bus master table (avoiding survivorship bias), and a 7-day maturity cutoff against right-censoring.",
    ],
    findingsVi:
      "Trong bản thiết kế trước đây, phép chia fulfilled / total trên toàn bộ 30 ngày gần nhất làm tụt giả tạo tỷ lệ nhận sách vì các đơn tạo trong 1–6 ngày cuối chưa hết hạn giữ chỗ 7 ngày, còn chỉ số borrows/visits bị bão hòa ở trần 100%. Lọc nhóm đơn đủ chín (reserved_date <= NOW - 7 ngày) và tách chỉ số borrows_per_visit không cắt trần giúp KPI phản ánh đúng thực tế vận hành.",
    findingsEn:
      "An earlier query divided fulfilled by total reservations across the full last 30 days, artificially depressing pickup rate due to 1–6 day right-censored reservations, while capping borrows/visits at 100%. Filtering to matured cohorts (reserved_date <= NOW - 7d) and tracking uncapped borrows_per_visit fixes both distortions.",
    codeLanguage: "sql",
    codeTitleVi: "MySQL 8.0 · Đối soát tỷ lệ nhận sách đủ chín (7 ngày) & hiệu suất từng tuyến xe",
    codeTitleEn: "MySQL 8.0 · Matured 7-Day Reservation Fulfillment & Route Yield",
    codeSnippet: `WITH matured_res AS (
  SELECT
    preferred_pickup_location_id AS bus_id,
    COUNT(*) AS matured_reservations_30d,
    SUM(CASE WHEN is_fulfilled = 1 THEN 1 ELSE 0 END) AS fulfilled_30d,
    SUM(CASE WHEN is_fulfilled = 0 AND expires_date < UTC_TIMESTAMP() THEN 1 ELSE 0 END) AS expired_30d
  FROM transactions_bookreservation
  WHERE is_deleted = 0
    AND reserved_date >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 37 DAY)
    AND reserved_date <= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 7 DAY)
  GROUP BY preferred_pickup_location_id
),
visits_borrows_30d AS (
  SELECT
    bus_id,
    SUM(CASE WHEN activity_type = 'borrow' THEN 1 ELSE 0 END) AS borrows_30d,
    SUM(CASE WHEN activity_type = 'bus_visit' THEN 1 ELSE 0 END) AS visits_30d
  FROM analytics_useractivity
  WHERE created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY)
  GROUP BY bus_id
)
SELECT
  b.bus_number,
  COALESCE(r.matured_reservations_30d, 0) AS matured_reservations_30d,
  ROUND(COALESCE(r.fulfilled_30d, 0) * 100.0 / NULLIF(r.matured_reservations_30d, 0), 1) AS fulfillment_rate_pct,
  COALESCE(v.borrows_30d, 0) AS borrows_30d,
  ROUND(COALESCE(v.borrows_30d, 0) / NULLIF(v.visits_30d, 0), 2) AS borrows_per_visit
FROM inventory_librarybus b
LEFT JOIN matured_res r ON r.bus_id = b.id
LEFT JOIN visits_borrows_30d v ON v.bus_id = b.id
ORDER BY borrows_30d DESC;`,
    tags: ["Technical BA", "Tracking Plan", "MySQL 8.0", "Library Bus"],
  },
  {
    id: "sql-8-stage-methodology",
    slug: "mastering-8-stage-sql-for-data-analysis-workflow",
    projectKey: "sql-methodology",
    projectSlug: "/about",
    featured: false,
    categoryVi: "Phương pháp luận SQL",
    categoryEn: "SQL Methodology",
    readTimeVi: "2 phút đọc",
    readTimeEn: "2 min read",
    date: "2026-07",
    titleVi:
      "Checklist 8 bước kiểm soát chất lượng truy vấn MySQL 8.0 cho dự án phân tích",
    titleEn:
      "An 8-Step MySQL 8.0 Quality Checklist for Analytics Projects",
    excerptVi:
      "Tóm tắt 8 điểm kiểm tra mình áp dụng trước khi đưa số liệu lên biểu đồ: kiểm tra khóa chính, chuẩn hóa múi giờ, hàm cửa sổ trượt, cohort, Pareto và đối soát đa nguồn.",
    excerptEn:
      "The 8 checks I run before plotting metrics: key uniqueness, timezone alignment, rolling windows, cohorts, Pareto share, and cross-source reconciliation.",
    problemVi:
      "Phần lớn sai số trong báo cáo phân tích không đến từ công thức nâng cao mà từ bước tiền xử lý: đếm trùng khóa khi JOIN, trộn cửa sổ ngày khác nhau hoặc cộng gộp các nhóm có bản chất khác biệt.",
    problemEn:
      "Most reporting errors stem from upstream preparation rather than advanced math: fan-out joins, mismatched date windows, or pooling heterogeneous subgroups.",
    processVi: [
      "Bước 1–2 (Profiling & Cleaning): Đếm trùng khóa chính toàn bảng, kiểm tra tỷ lệ NULL, gộp nhãn song ngữ và chuẩn hóa về một múi giờ thống nhất.",
      "Bước 3–5 (Time-Series, Cohort & Pareto): Dùng Window Functions (MA7/MA28, LAG, ROW_NUMBER) và phân tầng theo tháng để tránh Simpson's Paradox.",
      "Bước 6–8 (Feature Prep, Reconciliation & Mart): Đối soát Gross vs. Net trên cùng khoảng thời gian, dùng LEFT JOIN tránh mất đối tượng 0 đơn và lọc cohort đủ chín.",
    ],
    processEn: [
      "Steps 1–2 (Profiling & Cleaning): Check table-wide primary key duplicates, NULL rates, bilingual labels, and timezone alignment.",
      "Steps 3–5 (Time-Series, Cohort & Pareto): Apply Window Functions (MA7/MA28, LAG, ROW_NUMBER) and stratify by month against Simpson's Paradox.",
      "Steps 6–8 (Feature Prep, Reconciliation & Mart): Reconcile Gross vs. Net on locked cutoffs, preserve zero-activity entities with LEFT JOIN, and guard against right-censoring.",
    ],
    findingsVi:
      "Áp dụng cố định checklist 8 bước này giúp mình bắt được lỗi trùng 595 phiên Live (+7,59 tỷ) ở Kami Ely, 5 lỗi đơn vị/lệch năm ở Heritage Japan và lỗi right-censoring ở truy vấn đặt trước của Library Bus.",
    findingsEn:
      "Running this fixed 8-step checklist surfaced the 595 duplicate live sessions (+7.59B) in Kami Ely, 5 unit/axis errors in Heritage Japan, and right-censoring bias in Library Bus.",
    codeLanguage: "sql",
    codeTitleVi: "MySQL 8.0 · Trung bình trượt 7 ngày & tăng trưởng tuần liền kề (WoW)",
    codeTitleEn: "MySQL 8.0 · Rolling 7-Day Average & Week-over-Week Growth",
    codeSnippet: `SELECT
  metric_date,
  store_gmv_vnd,
  ROUND(AVG(store_gmv_vnd) OVER (
    ORDER BY metric_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ), 0) AS ma7_gmv_vnd,
  ROUND(
    (store_gmv_vnd - LAG(store_gmv_vnd, 7) OVER (ORDER BY metric_date)) * 100.0
    / NULLIF(LAG(store_gmv_vnd, 7) OVER (ORDER BY metric_date), 0),
    2
  ) AS wow_growth_pct
FROM fact_store_daily
ORDER BY metric_date;`,
    tags: ["MySQL 8.0", "Window Functions", "Data Quality", "Reconciliation"],
  },
];
