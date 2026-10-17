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
    nameVi: "Giai đoạn 1: Schema Profiling & Key Auditing",
    nameEn: "Stage 1: Schema Profiling & Key Auditing",
    descVi:
      "Khám phá cấu trúc bảng, kiểm tra độ đầy đủ (cardinality), tính duy nhất của khóa chính (Primary Key) và đối soát quan hệ khóa ngoại.",
    descEn:
      "Auditing table schemas, checking cardinality, verifying Primary Key uniqueness, and validating foreign key relational integrity.",
    queryTitleVi: "Truy vấn kiểm tra khóa trùng lặp & tỷ lệ NULL",
    queryTitleEn: "Primary Key Uniqueness & Nullability Profiling",
    sqlSnippet: `SELECT
  column_name,
  COUNT(*) AS total_rows,
  COUNT(DISTINCT column_name) AS distinct_keys,
  SUM(CASE WHEN column_name IS NULL THEN 1 ELSE 0 END) AS null_count,
  ROUND(SUM(CASE WHEN column_name IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS null_pct
FROM raw_orders_table
GROUP BY column_name;`,
    keyDeliverableVi: "Ma trận chất lượng dữ liệu đầu vào (Data Health Matrix)",
    keyDeliverableEn: "Data Health & Schema Baseline Matrix",
    appliedCase: "All Projects Baseline",
  },
  {
    id: 2,
    nameVi: "Giai đoạn 2: Data Cleaning & Type Casting",
    nameEn: "Stage 2: Data Cleaning & Type Casting",
    descVi:
      "Chuẩn hóa định dạng ngày tháng (ISO 8601), ép kiểu số nguyên/thực, xử lý khoảng trắng thừa và chuẩn hóa chuỗi văn bản.",
    descEn:
      "Standardizing timestamp formats (ISO 8601), casting numeric types, trimming whitespace, and canonicalizing string values.",
    queryTitleVi: "Ép kiểu dữ liệu chuẩn & làm sạch chuỗi",
    queryTitleEn: "Safe Type Casting & String Normalization",
    sqlSnippet: `SELECT
  order_id,
  TRIM(LOWER(customer_email)) AS cleaned_email,
  CAST(order_timestamp AS DATE) AS order_date,
  COALESCE(CAST(discount_amount AS DECIMAL(12,2)), 0.00) AS safe_discount,
  CASE WHEN payment_status IN ('PAID', 'SETTLED') THEN 1 ELSE 0 END AS is_settled
FROM staging_transactions;`,
    keyDeliverableVi: "Tầng dữ liệu sạch staging (Standardized Clean Mart)",
    keyDeliverableEn: "Standardized Clean Staging Mart",
    appliedCase: "Kami Ely TikTok Shop",
  },
  {
    id: 3,
    nameVi: "Giai đoạn 3: Time-Series & Window Functions",
    nameEn: "Stage 3: Time-Series & Window Functions",
    descVi:
      "Áp dụng các hàm cửa sổ (LAG, LEAD, FIRST_VALUE) và trung bình trượt 7 ngày để bắt nhịp biến động mùa vụ và xu hướng tăng trưởng.",
    descEn:
      "Applying Window Functions (LAG, LEAD, Rolling Windows) to capture seasonality trends and period-over-period growth velocity.",
    queryTitleVi: "Tính trung bình trượt 7 ngày & tốc độ tăng trưởng WoW",
    queryTitleEn: "Rolling 7-Day Average & WoW Growth Velocity",
    sqlSnippet: `SELECT
  metric_date,
  daily_gmv,
  ROUND(AVG(daily_gmv) OVER (
    ORDER BY metric_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ), 2) AS rolling_7d_avg,
  ROUND(
    (daily_gmv - LAG(daily_gmv, 7) OVER (ORDER BY metric_date)) * 100.0
    / NULLIF(LAG(daily_gmv, 7) OVER (ORDER BY metric_date), 0),
    2
  ) AS wow_growth_rate_pct
FROM fact_daily_sales;`,
    keyDeliverableVi: "Bảng xu hướng chuỗi thời gian (Smoothed Time-Series)",
    keyDeliverableEn: "Smoothed Time-Series Trend Dataset",
    appliedCase: "Heritage Japan Tourism",
  },
  {
    id: 4,
    nameVi: "Giai đoạn 4: Cohort Retention & Churn Analysis",
    nameEn: "Stage 4: Cohort Retention & Churn Analysis",
    descVi:
      "Nhóm người dùng theo tháng đăng ký đầu tiên và theo dõi hành vi quay lại (retention rate) qua các chu kỳ tháng 1, 2, 3...",
    descEn:
      "Grouping users by acquisition month and tracking longitudinal retention decay curves across Month 0, 1, 2, 3 cohorts.",
    queryTitleVi: "Bảng ma trận giữ chân người dùng (Cohort Matrix)",
    queryTitleEn: "Cohort Retention Lifecycle Matrix",
    sqlSnippet: `WITH first_order AS (
  SELECT customer_id, DATE_TRUNC('month', MIN(order_date)) AS cohort_month
  FROM fact_orders GROUP BY customer_id
),
activity AS (
  SELECT o.customer_id, f.cohort_month,
         EXTRACT(MONTH FROM AGE(DATE_TRUNC('month', o.order_date), f.cohort_month)) AS period_month
  FROM fact_orders o
  JOIN first_order f ON o.customer_id = f.customer_id
)
SELECT cohort_month, period_month, COUNT(DISTINCT customer_id) AS retained_users
FROM activity GROUP BY 1, 2 ORDER BY 1, 2;`,
    keyDeliverableVi: "Ma trận Cohort Heatmap & Tỷ lệ Churn",
    keyDeliverableEn: "Cohort Retention Heatmap & Churn Rates",
    appliedCase: "Library Bus System",
  },
  {
    id: 5,
    nameVi: "Giai đoạn 5: Anomaly & Pareto Concentration",
    nameEn: "Stage 5: Anomaly & Pareto Concentration",
    descVi:
      "Phân rã 80/20 (Pareto Analysis) xác định nhóm đối tác/sản phẩm trụ cột và nhận diện các giao dịch bất thường (Z-score).",
    descEn:
      "Decomposing 80/20 concentration (Pareto Analysis) to identify anchor creators/SKUs and detect statistical volume outliers.",
    queryTitleVi: "Phân bổ tích lũy Pareto & xếp hạng KOC",
    queryTitleEn: "Cumulative Pareto Distribution & Creator Tiers",
    sqlSnippet: `WITH ranked_creators AS (
  SELECT
    creator_id,
    total_gmv,
    ROW_NUMBER() OVER (ORDER BY total_gmv DESC) AS rank_pos,
    SUM(total_gmv) OVER (ORDER BY total_gmv DESC) AS running_total_gmv,
    SUM(total_gmv) OVER () AS grand_total_gmv
  FROM dim_creator_summary
)
SELECT
  creator_id,
  total_gmv,
  rank_pos,
  ROUND(running_total_gmv * 100.0 / grand_total_gmv, 2) AS cum_share_pct
FROM ranked_creators;`,
    keyDeliverableVi: "Báo cáo phân tầng đối tác & rủi ro phụ thuộc (Concentration Risk)",
    keyDeliverableEn: "Partner Tiering & Concentration Risk Report",
    appliedCase: "Kami Ely Affiliate Network",
  },
  {
    id: 6,
    nameVi: "Giai đoạn 6: Statistical Hypothesis Testing Prep",
    nameEn: "Stage 6: Statistical Hypothesis Testing Prep",
    descVi:
      "Tổng hợp các bảng chỉ số định lượng phục vụ trực tiếp cho mô hình hồi quy (OLS) và các kiểm định thống kê trong Python (SciPy).",
    descEn:
      "Aggregating clean tabular feature marts ready for OLS regression, ANOVA, and non-parametric hypothesis tests in Python.",
    queryTitleVi: "Chuẩn bị biến độc lập & phụ thuộc cho mô hình",
    queryTitleEn: "Econometric Modeling Feature Set Extraction",
    sqlSnippet: `SELECT
  prefecture_id,
  prefecture_name,
  overnight_tourist_count,
  unesco_heritage_sites_count,
  railway_transit_stations,
  gdp_per_capita_yen,
  LOG(NULLIF(overnight_tourist_count, 0)) AS log_tourists
FROM heritage_econometric_mart
WHERE survey_year = 2024;`,
    keyDeliverableVi: "Bảng đặc trưng định lượng (Analytical Feature Mart)",
    keyDeliverableEn: "Structured Feature Mart for Python Modeling",
    appliedCase: "Heritage Japan Econometrics",
  },
  {
    id: 7,
    nameVi: "Giai đoạn 7: Cross-Source Reconciliation",
    nameEn: "Stage 7: Cross-Source Reconciliation",
    descVi:
      "Đối soát chênh lệch telemetry giữa các hệ thống (Gross Orders vs Net Settled GMV), xác lập nguồn sự thật duy nhất (Single Source of Truth).",
    descEn:
      "Reconciling telemetry disparities across disparate endpoints (Gross Orders vs Net Settled GMV) to establish the Single Source of Truth.",
    queryTitleVi: "Đối soát chênh lệch doanh thu 3 nguồn",
    queryTitleEn: "Multi-Source Settlement Reconciliation Query",
    sqlSnippet: `SELECT
  c.settlement_date,
  s.shop_gross_gmv,
  c.creator_logged_gmv,
  (s.shop_gross_gmv - c.creator_logged_gmv) AS telemetry_variance,
  ROUND(
    ABS(s.shop_gross_gmv - c.creator_logged_gmv) * 100.0
    / NULLIF(s.shop_gross_gmv, 0),
    2
  ) AS variance_pct
FROM fact_shop_daily s
JOIN fact_creator_daily c ON s.settlement_date = c.settlement_date;`,
    keyDeliverableVi: "Báo cáo kiểm toán đối soát tài chính (Reconciliation Audit)",
    keyDeliverableEn: "Financial Reconciliation & Variance Audit",
    appliedCase: "Kami Ely TikTok Shop",
  },
  {
    id: 8,
    nameVi: "Giai đoạn 8: Executive Data Mart & Storytelling",
    nameEn: "Stage 8: Executive Data Mart & Storytelling",
    descVi:
      "Đóng gói kết quả thành bảng chiều và bảng sự kiện tối ưu (Star Schema), cấp dữ liệu độ trễ thấp cho Power BI và Next.js Interactive Dashboard.",
    descEn:
      "Packaging validated outputs into an optimized Star Schema serving sub-second queries to Power BI and Next.js Interactive Dashboards.",
    queryTitleVi: "Truy vấn bảng tổng hợp cấp điều hành (Executive Mart)",
    queryTitleEn: "Executive KPI Summary Mart Query",
    sqlSnippet: `SELECT
  d.month_label,
  p.category_name,
  SUM(f.net_revenue) AS total_revenue,
  ROUND(SUM(f.net_margin) * 100.0 / NULLIF(SUM(f.net_revenue), 0), 2) AS net_margin_pct,
  COUNT(DISTINCT f.customer_id) AS active_buyers
FROM fact_executive_performance f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_product p ON f.product_key = p.product_key
GROUP BY 1, 2
ORDER BY d.month_label DESC;`,
    keyDeliverableVi: "Kho dữ liệu điều hành và Dashboard hành động",
    keyDeliverableEn: "Executive Star Schema & Actionable Dashboard",
    appliedCase: "Production BI Dashboards",
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
              className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? "bg-[#9BE7FA] text-[#074553] border-[#9BE7FA] shadow-sm font-bold shadow-[#9BE7FA]/20"
                  : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#9BE7FA]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    isSelected
                      ? "bg-[#074553] text-[#9BE7FA]"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  0{stage.id}
                </span>
                <span className="text-xs sm:text-sm font-semibold line-clamp-1">
                  {isVi ? stage.nameVi : stage.nameEn}
                </span>
              </div>
              <span
                className={`text-xs font-mono uppercase px-2 py-0.5 rounded shrink-0 hidden sm:inline-block ${
                  isSelected
                    ? "bg-[#C8EEF7]/50 text-[#074553] border border-[#074553]/20"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {stage.appliedCase}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Column (7 Cols): Active Stage Deep Dive & SQL Snippet */}
      <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 text-white space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#9BE7FA] uppercase tracking-wider">
              {isVi ? `Giai đoạn 0${activeStage.id} / 08` : `Stage 0${activeStage.id} of 08`}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {isVi ? activeStage.nameVi : activeStage.nameEn}
            </h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#FFE485]/15 text-[#FFE485] border border-[#FFE485]/30">
            {activeStage.appliedCase}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {isVi ? activeStage.descVi : activeStage.descEn}
        </p>

        {/* SQL Code Block */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
          <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#9BE7FA]">
              <Terminal className="w-3.5 h-3.5 text-[#FFD14C]" />
              {isVi ? activeStage.queryTitleVi : activeStage.queryTitleEn}
            </span>
            <span className="text-xs font-mono uppercase text-[#9BE7FA] bg-[#9BE7FA]/15 px-2 py-0.5 rounded">SQL</span>
          </div>
          <pre className="p-4 text-xs font-mono text-[#C8EEF7] overflow-x-auto leading-relaxed">
            <code>{activeStage.sqlSnippet}</code>
          </pre>
        </div>

        {/* Deliverable Badge */}
        <div className="pt-2 flex items-center gap-2 text-xs text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-[#9BE7FA] shrink-0" />
          <span className="font-semibold text-white">
            {isVi ? "Sản phẩm đầu ra:" : "Key Deliverable:"}
          </span>
          <span className="text-[#FFE485]">
            {isVi ? activeStage.keyDeliverableVi : activeStage.keyDeliverableEn}
          </span>
        </div>
      </div>
    </div>
  );
}
