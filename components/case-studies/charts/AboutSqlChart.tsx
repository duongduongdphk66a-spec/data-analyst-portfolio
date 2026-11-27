"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { CheckCircle2, Terminal } from "lucide-react";

interface SqlStage {
  id: number;
  nameVi: string;
  nameEn: string;
  descVi: string;
  descEn: string;
  queryTitleVi: string;
  queryTitleEn: string;
  sqlSnippet: string;
  keyDeliverableVi: string;
  keyDeliverableEn: string;
  appliedCase: string;
}

const SQL_STAGES: SqlStage[] = [
  {
    id: 1,
    nameVi: "Giai đoạn 1: Kiểm toán khóa & độ đầy đủ (Profiling)",
    nameEn: "Stage 1: Key Uniqueness & Nullability Profiling",
    descVi:
      "Kiểm tra tổng số dòng, trùng lặp khóa chính (Primary Key) và tỷ lệ giá trị NULL toàn bảng trước khi nối hoặc cộng dồn chỉ số.",
    descEn:
      "Auditing total row counts, Primary Key duplicates, and NULL rates across the table before joining or aggregating metrics.",
    queryTitleVi: "MySQL 8.0 · Kiểm tra khóa trùng lặp & tỷ lệ NULL toàn bảng",
    queryTitleEn: "MySQL 8.0 · Table-Wide Key Uniqueness & Null Profiling",
    sqlSnippet: `SELECT
  COUNT(*) AS total_rows,
  COUNT(DISTINCT session_id) AS distinct_sessions,
  COUNT(*) - COUNT(DISTINCT session_id) AS duplicate_rows,
  SUM(CASE WHEN session_id IS NULL THEN 1 ELSE 0 END) AS null_keys,
  ROUND(
    SUM(CASE WHEN gmv_vnd IS NULL THEN 1 ELSE 0 END) * 100.0
    / NULLIF(COUNT(*), 0),
    2
  ) AS null_gmv_pct
FROM raw_affiliate_livestreams;`,
    keyDeliverableVi: "Ma trận chất lượng dữ liệu đầu vào (Quality Gate Baseline)",
    keyDeliverableEn: "Input Data Quality Gate Baseline",
    appliedCase: "All Projects Baseline",
  },
  {
    id: 2,
    nameVi: "Giai đoạn 2: Làm sạch, chuẩn hóa nhãn & múi giờ",
    nameEn: "Stage 2: Data Cleaning, Label & Timezone Normalization",
    descVi:
      "Chuẩn hóa nhãn song ngữ (YES/có), đồng bộ múi giờ (+13h UTC+7), ép kiểu ngày/số an toàn và khử trùng bản ghi theo khóa kép.",
    descEn:
      "Normalizing bilingual flags (YES/có), aligning timezones (+13h UTC+7), safe type casting, and deduplicating rows via composite keys.",
    queryTitleVi: "MySQL 8.0 · Gộp nhãn song ngữ & ép kiểu bảng Video",
    queryTitleEn: "MySQL 8.0 · Bilingual Flag Merging & Safe Casting",
    sqlSnippet: `SELECT
  video_id,
  LOWER(TRIM(creator_handle)) AS creator_key,
  CAST(posted_at_utc7 AS DATE) AS post_date,
  CASE
    WHEN UPPER(TRIM(ad_authorized_raw)) IN ('YES', 'CÓ', 'CO', '1') THEN 1
    ELSE 0
  END AS is_ad_authorized,
  COALESCE(CAST(gmv_vnd AS DECIMAL(14,2)), 0.00) AS gmv_vnd
FROM raw_affiliate_videos;`,
    keyDeliverableVi: "Tầng dữ liệu sạch staging (Standardized Clean Mart)",
    keyDeliverableEn: "Standardized Clean Staging Mart",
    appliedCase: "Kami Ely TikTok Shop",
  },
  {
    id: 3,
    nameVi: "Giai đoạn 3: Chuỗi thời gian & hàm cửa sổ (Window Functions)",
    nameEn: "Stage 3: Time-Series & Window Functions",
    descVi:
      "Áp dụng AVG/LAG trên khung trượt 7 ngày và 28 ngày để làm mượt nhiễu ngày lẻ, nhận diện đỉnh mùa vụ và tín hiệu đảo chiều.",
    descEn:
      "Applying 7-day and 28-day trailing windows plus LAG() to smooth daily noise, locate seasonal peaks, and flag trend reversals.",
    queryTitleVi: "MySQL 8.0 · Trung bình trượt 7 ngày & tăng trưởng WoW",
    queryTitleEn: "MySQL 8.0 · Rolling 7-Day Average & WoW Growth",
    sqlSnippet: `SELECT
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
FROM fact_store_daily;`,
    keyDeliverableVi: "Chuỗi xu hướng MA7 / MA28 phục vụ cảnh báo sớm",
    keyDeliverableEn: "MA7 / MA28 Trend Series for Early Warning",
    appliedCase: "Kami Ely TikTok Shop",
  },
  {
    id: 4,
    nameVi: "Giai đoạn 4: Phân tích giữ chân theo Cohort (Cohort Retention)",
    nameEn: "Stage 4: Monthly Cohort Retention Analysis",
    descVi:
      "Nhóm 302 KOC livestream ngoài theo tháng lên sóng đầu tiên (M+0) và đo tỷ lệ duy trì qua các tháng kế tiếp (M+1, M+2...).",
    descEn:
      "Grouping 302 external livestream KOCs by their first active month (M+0) and tracking retention across subsequent months (M+1, M+2...).",
    queryTitleVi: "MySQL 8.0 · Ma trận giữ chân 302 KOC Live theo tháng",
    queryTitleEn: "MySQL 8.0 · Monthly Retention Matrix for 302 Live KOCs",
    sqlSnippet: `WITH first_live AS (
  SELECT
    koc_id,
    DATE_FORMAT(MIN(session_date), '%Y-%m-01') AS cohort_month
  FROM fact_affiliate_live
  WHERE is_official = 0
  GROUP BY koc_id
),
activity AS (
  SELECT
    l.koc_id,
    f.cohort_month,
    TIMESTAMPDIFF(
      MONTH,
      f.cohort_month,
      DATE_FORMAT(l.session_date, '%Y-%m-01')
    ) AS month_offset
  FROM fact_affiliate_live l
  JOIN first_live f ON l.koc_id = f.koc_id
  WHERE l.is_official = 0
)
SELECT cohort_month, month_offset, COUNT(DISTINCT koc_id) AS retained_kocs
FROM activity
GROUP BY cohort_month, month_offset
ORDER BY cohort_month, month_offset;`,
    keyDeliverableVi: "Bảng giữ chân Cohort & quy tắc sàng lọc 2 tầng",
    keyDeliverableEn: "Cohort Retention Matrix & 2-Tier Screening Rule",
    appliedCase: "Kami Ely Affiliate Network",
  },
  {
    id: 5,
    nameVi: "Giai đoạn 5: Mức độ tập trung Pareto & rủi ro phụ thuộc",
    nameEn: "Stage 5: Pareto Concentration & Dependency Risk",
    descVi:
      "Tính tỷ trọng tích lũy theo mã SKU và đối tác KOC để nhận diện rủi ro phụ thuộc vào số ít nguồn tạo doanh thu (12/133 SKU = 80,6% GMV).",
    descEn:
      "Computing cumulative GMV shares across SKUs and KOCs to surface single-SKU or single-channel concentration risk (12/133 SKUs = 80.6% GMV).",
    queryTitleVi: "MySQL 8.0 · Xếp hạng tích lũy Pareto theo SKU 90 ngày",
    queryTitleEn: "MySQL 8.0 · Cumulative 90-Day SKU Pareto Ranking",
    sqlSnippet: `WITH ranked_sku AS (
  SELECT
    sku_code,
    gmv_90d_vnd,
    ROW_NUMBER() OVER (ORDER BY gmv_90d_vnd DESC) AS rank_pos,
    SUM(gmv_90d_vnd) OVER (ORDER BY gmv_90d_vnd DESC) AS running_gmv,
    SUM(gmv_90d_vnd) OVER () AS total_gmv
  FROM dim_sku_90d_summary
  WHERE gmv_90d_vnd > 0
)
SELECT
  sku_code,
  gmv_90d_vnd,
  rank_pos,
  ROUND(running_gmv * 100.0 / NULLIF(total_gmv, 0), 2) AS cum_share_pct
FROM ranked_sku
ORDER BY rank_pos;`,
    keyDeliverableVi: "Báo cáo phân tầng đối tác & rủi ro tập trung SKU",
    keyDeliverableEn: "Partner Tiering & SKU Concentration Report",
    appliedCase: "Kami Ely TikTok Shop",
  },
  {
    id: 6,
    nameVi: "Giai đoạn 6: Chuẩn bị bảng đặc trưng cho kiểm định thống kê",
    nameEn: "Stage 6: Statistical Modeling Feature Extraction",
    descVi:
      "Hiệu chỉnh trục năm, quy đổi đơn vị và tạo biến log/chỉ số gốc (2013 = 100) trước khi đưa vào phân tích hồi quy hoặc kiểm định bằng Python.",
    descEn:
      "Aligning reporting years, standardizing units, and computing base-100 indices or log transforms before Python statistical tests.",
    queryTitleVi: "MySQL 8.0 · Chuẩn hóa chuỗi thời gian Du lịch Nhật Bản",
    queryTitleEn: "MySQL 8.0 · Normalized Japan Tourism Time-Series Extract",
    sqlSnippet: `SELECT
  region_code,
  report_year,
  visitors_k,
  spend_billion_jpy,
  ROUND(LN(NULLIF(visitors_k, 0)), 4) AS log_visitors
FROM heritage_japan_audited_series
WHERE report_year BETWEEN 2003 AND 2022
ORDER BY region_code, report_year;`,
    keyDeliverableVi: "Bảng chuỗi thời gian sạch phục vụ Python SciPy / NumPy",
    keyDeliverableEn: "Audited Time-Series Table for Python SciPy / NumPy",
    appliedCase: "Heritage Japan Time-Series",
  },
  {
    id: 7,
    nameVi: "Giai đoạn 7: Đối soát chênh lệch đa nguồn (Reconciliation)",
    nameEn: "Stage 7: Cross-Source Reconciliation",
    descVi:
      "Khóa chung cửa sổ thời gian (226 ngày) để đối chiếu doanh thu gộp phiên Live (Gross) với doanh thu cửa hàng (Net), phát hiện trùng đếm trước khi báo cáo.",
    descEn:
      "Locking a common 226-day cutoff to reconcile Gross Live sessions against Net Store GMV and isolate overlap before reporting.",
    queryTitleVi: "MySQL 8.0 · Đối soát Gross Live vs. Net Store cùng cửa sổ 226N",
    queryTitleEn: "MySQL 8.0 · 226-Day Gross Live vs. Net Store Reconciliation",
    sqlSnippet: `SELECT
  s.metric_date,
  s.store_net_gmv_vnd,
  COALESCE(l.dedup_live_gross_vnd, 0) AS dedup_live_gross_vnd,
  (COALESCE(l.dedup_live_gross_vnd, 0) - s.store_net_gmv_vnd) AS gross_minus_net_vnd
FROM fact_store_daily s
LEFT JOIN (
  SELECT session_date, SUM(gmv_vnd) AS dedup_live_gross_vnd
  FROM fact_affiliate_live
  WHERE is_dedup_kept = 1
  GROUP BY session_date
) l ON s.metric_date = l.session_date
WHERE s.metric_date <= '2026-10-20'
ORDER BY s.metric_date;`,
    keyDeliverableVi: "Báo cáo kiểm toán chênh lệch Gross vs. Net (Reconciliation)",
    keyDeliverableEn: "Gross vs. Net Variance Reconciliation Audit",
    appliedCase: "Kami Ely TikTok Shop",
  },
  {
    id: 8,
    nameVi: "Giai đoạn 8: Đóng gói Data Mart & chống thiên lệch kỳ báo cáo",
    nameEn: "Stage 8: Reporting Mart & Right-Censoring Guard",
    descVi:
      "Tổng hợp bảng KPI phục vụ Dashboard và đặc tả BI, áp dụng LEFT JOIN tránh mất đối tượng 0 giao dịch và lọc cohort đủ chín cho cửa sổ 7 ngày.",
    descEn:
      "Packaging KPI marts for BI specs using LEFT JOIN against survivorship bias and maturity filters against right-censoring.",
    queryTitleVi: "MySQL 8.0 · Tỷ lệ nhận sách đặt trước đủ chín (7 ngày)",
    queryTitleEn: "MySQL 8.0 · Matured 7-Day Reservation Fulfillment Mart",
    sqlSnippet: `SELECT
  b.bus_number,
  COUNT(r.id) AS matured_reservations_30d,
  SUM(CASE WHEN r.is_fulfilled = 1 THEN 1 ELSE 0 END) AS fulfilled_30d,
  ROUND(
    SUM(CASE WHEN r.is_fulfilled = 1 THEN 1 ELSE 0 END) * 100.0
    / NULLIF(COUNT(r.id), 0),
    2
  ) AS matured_fulfillment_pct
FROM inventory_librarybus b
LEFT JOIN transactions_bookreservation r
  ON r.preferred_pickup_location_id = b.id
  AND r.is_deleted = 0
  AND r.reserved_date >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 37 DAY)
  AND r.reserved_date <= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 7 DAY)
GROUP BY b.id, b.bus_number
ORDER BY matured_fulfillment_pct DESC;`,
    keyDeliverableVi: "Bảng KPI vận hành cho BI Spec & Pilot 4 tuần",
    keyDeliverableEn: "Operational KPI Mart for BI Spec & 4-Week Pilot",
    appliedCase: "Library Bus · BI Spec",
  },
];

export default function AboutSqlChart() {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const [activeStageId, setActiveStageId] = useState<number>(1);

  const activeStage =
    SQL_STAGES.find((s) => s.id === activeStageId) || SQL_STAGES[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
      {/* Left Column (5 Cols): Stage Selector List */}
      <div className="lg:col-span-5 space-y-2">
        {SQL_STAGES.map((stage) => {
          const isSelected = stage.id === activeStageId;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStageId(stage.id)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? "bg-[#9BE7FA] text-[#04242C] font-bold"
                  : "bg-white dark:bg-[#131E2E] text-slate-700 dark:text-slate-300 hover:bg-[#C8EEF7]/40 dark:hover:bg-[#1A293D]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center tabular-nums text-xs font-bold shrink-0 ${
                    isSelected
                      ? "bg-[#04242C] text-[#9BE7FA]"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {stage.id}
                </span>
                <span className="text-xs sm:text-sm font-semibold line-clamp-1">
                  {isVi ? stage.nameVi : stage.nameEn}
                </span>
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 hidden sm:inline-block ${
                  isSelected
                    ? "bg-[#C8EEF7] text-[#04242C]"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {stage.appliedCase}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Column (7 Cols): Active Stage Deep Dive & SQL Snippet */}
      <div className="lg:col-span-7 rounded-3xl bg-slate-900 dark:bg-[#0E1726] p-6 sm:p-8 text-white space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-2xl">
          <div>
            <span className="text-xs font-bold tabular-nums text-[#9BE7FA]">
              {isVi ? `Giai đoạn ${activeStage.id} / 8` : `Stage ${activeStage.id} of 8`}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {isVi ? activeStage.nameVi : activeStage.nameEn}
            </h3>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#FFE485]/15 text-[#FFE485]">
            {activeStage.appliedCase}
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {isVi ? activeStage.descVi : activeStage.descEn}
        </p>

        {/* SQL Code Block */}
        <div className="rounded-2xl bg-slate-950 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900/90 flex items-center justify-between" /* taste-skill-ignore: terminal titlebar divider */>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9BE7FA]">
              <Terminal className="w-3.5 h-3.5 text-[#FFD14C]" />
              {isVi ? activeStage.queryTitleVi : activeStage.queryTitleEn}
            </span>
            <span className="text-xs font-bold text-[#9BE7FA] bg-[#9BE7FA]/15 px-2 py-0.5 rounded">SQL</span>
          </div>
          <pre className="p-4 sm:p-5 text-xs font-mono text-[#C8EEF7] overflow-x-auto leading-relaxed">
            <code>{activeStage.sqlSnippet}</code>
          </pre>
        </div>

        {/* Deliverable Badge */}
        <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
          <CheckCircle2 className="w-4 h-4 text-[#9BE7FA] shrink-0" />
          <span className="font-semibold text-white">
            {isVi ? "Sản phẩm đầu ra:" : "Key Deliverable:"}
          </span>
          <span className="text-[#FFE485] font-medium">
            {isVi ? activeStage.keyDeliverableVi : activeStage.keyDeliverableEn}
          </span>
        </div>
      </div>
    </div>
  );
}
