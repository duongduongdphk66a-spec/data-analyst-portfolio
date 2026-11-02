'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Code2,
  AlertTriangle,
  Terminal,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { ChartRoleBadge, Chip, usePlaybookLang } from '../playbook/PlaybookUi';
import { KAMI_BRAND_PALETTE, V2 } from './kamiOutlineV2Metrics';

export interface Tier3EngineeringAppendixProps {
  onOpenNotebook?: () => void;
}

type AppendixSection = 'a-quality' | 'b-sql' | 'c-limits';

const REPRESENTATIVE_CHAPTER_SQL = [
  {
    id: 'sql-ch1',
    labelVi: 'Ch 1 · Khử trùng Live',
    labelEn: 'Ch 1 · Live Dedup',
    code: `-- Mục đích: Khử trùng 595 phiên @shop_official giữa Affiliate_Livestreams và Creator_Livestreams (+13h)
-- Đầu vào: stg_affiliate_live (8.355 dòng), stg_creator_live (600 dòng) · Đầu ra: mart_live_dedup_weekly
WITH dedup_live AS (
  SELECT
    DATE(session_start_vn) AS session_date,
    STRFTIME('%Y-W%W', session_start_vn) AS iso_week,
    creator_alias,
    shop_gmv_vnd
  FROM stg_affiliate_live -- Đã chứa 595 phiên @shop_official + 7.760 phiên creator ngoài
)
SELECT
  w.iso_week,
  SUM(s.daily_gmv_vnd) / 1e6 AS store_week_gmv_m,
  SUM(COALESCE(l.live_gmv_vnd, 0)) / 1e6 AS dedup_live_week_gmv_m
FROM (
  SELECT STRFTIME('%Y-W%W', record_date) AS iso_week, SUM(daily_gmv_vnd) AS daily_gmv_vnd
  FROM stg_store_daily GROUP BY 1
) w
JOIN stg_store_daily s ON STRFTIME('%Y-W%W', s.record_date) = w.iso_week
LEFT JOIN (
  SELECT iso_week, SUM(shop_gmv_vnd) AS live_gmv_vnd FROM dedup_live GROUP BY 1
) l ON w.iso_week = l.iso_week
GROUP BY w.iso_week;`,
  },
  {
    id: 'sql-ch2',
    labelVi: 'Ch 2 · Pareto & Dải giá',
    labelEn: 'Ch 2 · SKU Pareto',
    code: `-- Mục đích: Đường Pareto tích lũy trên 133/339 SKU có đơn và gom 4 dải giá (cận dưới vs ASP thực)
-- Đầu vào: stg_shop_products (339 SKU, cửa sổ 90N) · Đầu ra: mart_sku_pareto
WITH active_skus AS (
  SELECT
    sku_code,
    price_min_vnd,
    recent_gmv_vnd * 1.0 / NULLIF(recent_units, 0) AS realized_asp_vnd,
    recent_gmv_vnd,
    ROW_NUMBER() OVER (ORDER BY recent_gmv_vnd DESC) AS sku_rank,
    SUM(recent_gmv_vnd) OVER () AS catalog_gmv_vnd,
    SUM(recent_gmv_vnd) OVER (
      ORDER BY recent_gmv_vnd DESC
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cum_gmv_vnd
  FROM stg_shop_products
  WHERE recent_gmv_vnd > 0
)
SELECT
  sku_rank,
  sku_code,
  ROUND(cum_gmv_vnd * 100.0 / catalog_gmv_vnd, 2) AS cum_gmv_pct
FROM active_skus
ORDER BY sku_rank;`,
  },
  {
    id: 'sql-ch3',
    labelVi: 'Ch 3 · MA7/MA28 & Phân rã',
    labelEn: 'Ch 3 · MA & Waterfall',
    code: `-- Mục đích: Tính MA7/MA28 không nhìn trước (trailing) và phân rã đồng nhất thức GMV = N_live * Yield
-- Đầu vào: stg_store_daily (231 ngày) · Đầu ra: mart_daily_ma, mart_monthly_decomp
WITH daily_ma AS (
  SELECT
    record_date,
    daily_gmv_vnd / 1e6 AS gmv_m,
    AVG(daily_gmv_vnd / 1e6) OVER (ORDER BY record_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma7_m,
    AVG(daily_gmv_vnd / 1e6) OVER (ORDER BY record_date ROWS BETWEEN 27 PRECEDING AND CURRENT ROW) AS ma28_m
  FROM stg_store_daily
),
monthly_agg AS (
  SELECT
    SUBSTR(record_date, 1, 7) AS ym,
    SUM(daily_gmv_vnd) / 1e6 AS gmv_m,
    SUM(new_lives_cnt) AS n_lives,
    (SUM(daily_gmv_vnd) / 1e6) / NULLIF(SUM(new_lives_cnt), 0) AS y_per_live
  FROM stg_store_daily
  WHERE record_date BETWEEN '2026-06-01' AND '2026-08-31'
  GROUP BY 1
)
SELECT
  j.gmv_m AS jun_m, a.gmv_m AS aug_m,
  ROUND((a.n_lives - j.n_lives) * j.y_per_live, 1) AS volume_effect_m,
  ROUND(j.n_lives * (a.y_per_live - j.y_per_live), 1) AS yield_effect_m,
  ROUND((a.n_lives - j.n_lives) * (a.y_per_live - j.y_per_live), 1) AS interaction_m
FROM (SELECT * FROM monthly_agg WHERE ym = '2026-06') j
CROSS JOIN (SELECT * FROM monthly_agg WHERE ym = '2026-08') a;`,
  },
  {
    id: 'sql-ch4',
    labelVi: 'Ch 4 · Cohort & Sống còn KOC',
    labelEn: 'Ch 4 · KOC Cohorts',
    code: `-- Mục đích: Ma trận giữ chân M+0..M+7 trên 302 KOC ngoài và kiểm định 3 phiên đầu 0 đơn
-- Đầu vào: stg_affiliate_live (lọc creator_alias != '@shop_official', 7.760 phiên)
WITH koc_span AS (
  SELECT
    creator_hash,
    MIN(SUBSTR(session_start_vn, 1, 7)) AS cohort_ym,
    JULIANDAY(MAX(DATE(session_start_vn))) - JULIANDAY(MIN(DATE(session_start_vn))) AS active_span_days,
    SUM(CASE WHEN session_rn <= 3 THEN shop_gmv_vnd ELSE 0 END) AS first3_gmv_vnd,
    SUM(shop_gmv_vnd) AS lifetime_gmv_vnd
  FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY creator_hash ORDER BY session_start_vn) AS session_rn
    FROM stg_affiliate_live
    WHERE creator_alias <> '@shop_official'
  ) t
  GROUP BY creator_hash
)
SELECT
  COUNT(*) AS total_ext_kocs,
  SUM(CASE WHEN first3_gmv_vnd = 0 THEN 1 ELSE 0 END) AS first3_zero_kocs,
  ROUND(
    SUM(CASE WHEN first3_gmv_vnd = 0 AND lifetime_gmv_vnd = 0 THEN 1 ELSE 0 END) * 100.0 /
    NULLIF(SUM(CASE WHEN first3_gmv_vnd = 0 THEN 1 ELSE 0 END), 0), 1
  ) AS never_convert_pct
FROM koc_span;`,
  },
  {
    id: 'sql-ch5',
    labelVi: 'Ch 5 · Forest Ads/Organic',
    labelEn: 'Ch 5 · Ads vs Organic',
    code: `-- Mục đích: So sánh tỷ lệ clip ra đơn và GPM giữa Ads vs Organic trong cùng KOC (192 creator có cả hai)
-- Đầu vào: stg_affiliate_videos (4.796 clip sau khử trùng khóa phức hợp)
WITH dual_creators AS (
  SELECT creator_hash
  FROM stg_affiliate_videos
  GROUP BY creator_hash
  HAVING SUM(CASE WHEN is_ads_auth = 1 THEN 1 ELSE 0 END) > 0
     AND SUM(CASE WHEN is_ads_auth = 0 THEN 1 ELSE 0 END) > 0
)
SELECT
  v.is_ads_auth,
  COUNT(*) AS clip_cnt,
  ROUND(SUM(CASE WHEN v.contributed_gmv_vnd > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS conv_pct,
  ROUND(SUM(v.contributed_gmv_vnd) * 1000.0 / NULLIF(SUM(v.views_cnt), 0), 0) AS gpm_vnd
FROM stg_affiliate_videos v
JOIN dual_creators d ON v.creator_hash = d.creator_hash
GROUP BY v.is_ads_auth;`,
  },
  {
    id: 'sql-ch6',
    labelVi: 'Ch 6 · Backtest & 9 Cổng QA',
    labelEn: 'Ch 6 · Backtest & QA',
    code: `-- Mục đích: Phát hiện 4 điểm giao cắt MA7 < MA28 và kiểm định tự động cổng toàn vẹn dữ liệu
-- Đầu vào: mart_daily_ma, stg_store_daily, stg_affiliate_videos · Đầu ra: audit_early_warning_signals
WITH lagged_ma AS (
  SELECT
    record_date,
    ma7_m,
    ma28_m,
    LAG(ma7_m) OVER (ORDER BY record_date) AS prev_ma7_m,
    LAG(ma28_m) OVER (ORDER BY record_date) AS prev_ma28_m
  FROM mart_daily_ma
)
SELECT
  record_date AS crossover_date,
  ROUND(ma7_m, 2) AS ma7_m,
  ROUND(ma28_m, 2) AS ma28_m,
  CAST(JULIANDAY('2026-06-16') - JULIANDAY(record_date) AS INTEGER) AS lead_days_vs_peak
FROM lagged_ma
WHERE prev_ma7_m >= prev_ma28_m
  AND ma7_m < ma28_m
ORDER BY record_date;`,
  },
] as const;

export default function Tier3EngineeringAppendix({ onOpenNotebook }: Tier3EngineeringAppendixProps) {
  const { L, isEn, n } = usePlaybookLang();
  const [openSection, setOpenSection] = useState<AppendixSection | null>(null);
  const [sqlIdx, setSqlIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const wfAff = V2.appendix.sessionWaterfall;
  const wfCr = V2.appendix.crLiveWaterfall;
  const gates = V2.appendix.qualityGates;

  React.useEffect(() => {
    const handleOpen = () => setOpenSection('a-quality');
    const el = document.getElementById('sec-appendix');
    if (el) {
      el.addEventListener('kami-open-appendix', handleOpen);
      return () => el.removeEventListener('kami-open-appendix', handleOpen);
    }
  }, []);

  const toggleSection = (id: AppendixSection) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const handleCopySql = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const scrollToAnchor = (anchorId: string, tabId: AppendixSection) => {
    setOpenSection(tabId);
    const el = document.getElementById(anchorId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navItems: { id: AppendixSection; anchor: string; labelVi: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'a-quality',
      anchor: 'sec-appendix-a',
      labelVi: 'Phụ lục A. Pipeline & chất lượng dữ liệu',
      labelEn: 'Appendix A. Pipeline & data quality',
      icon: <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'b-sql',
      anchor: 'sec-appendix-b',
      labelVi: 'Phụ lục B. SQL & mã nguồn',
      labelEn: 'Appendix B. SQL & code index',
      icon: <Code2 className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    {
      id: 'c-limits',
      anchor: 'sec-appendix-c',
      labelVi: 'Phụ lục C. Quyền riêng tư, giới hạn & mở rộng',
      labelEn: 'Appendix C. Privacy, limits & roadmap',
      icon: <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
  ];

  const cleaningRulesOneLine = [
    {
      id: 1,
      vi: 'Chuẩn hóa tiền tệ & dải giá: bóc ký tự đ/k/Tr, tách price_min và price_max, tính thêm đơn giá thực bán ASP = Doanh thu / Lượng bán.',
      en: 'Currency & price-range parsing: strip suffixes, split price_min and price_max, and derive realized ASP = GMV / units.',
    },
    {
      id: 2,
      vi: 'Đồng bộ múi giờ Việt Nam (UTC+7): cộng +13h cho Creator_Livestreams (khớp 595/595 phiên từ 09/03) và chuẩn hóa giờ đăng Affiliate_Videos.',
      en: 'Vietnam UTC+7 alignment: shift Creator_Livestreams +13h (matching 595/595 sessions >= Mar 09) and normalize video publish timestamps.',
    },
    {
      id: 3,
      vi: 'Quy đổi số rút gọn: chuyển các chuỗi lượt xem/tương tác dạng 1.6k, 1.2m về số nguyên và ghi nhận sai số làm tròn của FastMoss.',
      en: 'Abbreviated count casting: parse strings like 1.6k and 1.2m into integers while documenting FastMoss rounding granularity.',
    },
    {
      id: 4,
      vi: 'Khử trùng khóa phức hợp & khử chồng lấn kênh: loại 1 video trùng khóa (4.797 -> 4.796) và không cộng gộp CrLive vào AffLive.',
      en: 'Composite-key & overlap deduplication: remove 1 duplicate video (4,797 -> 4,796) and prevent double-counting CrLive with AffLive.',
    },
    {
      id: 5,
      vi: 'Gắn cờ kiểm toán thay vì xóa dòng: tạo cờ is_orphan (1,59% KOC), is_outlier_duration (15 ca > 24h, 69 ca = 0h), followers_unknown.',
      en: 'Audit flagging over row deletion: attach is_orphan (1.59%), is_outlier_duration (15 > 24h, 69 = 0h), and followers_unknown flags.',
    },
    {
      id: 6,
      vi: 'Đánh dấu tháng thiếu ngày (is_partial_month): Tháng 3 (23 ngày, từ 09/03) và Tháng 10 (25 ngày, đến 25/10) luôn kèm bình quân/ngày.',
      en: 'Partial-month flagging (is_partial_month): March (23d from Mar 09) and October (25d to Oct 25) always report daily normalized rates.',
    },
    {
      id: 7,
      vi: 'Tra cứu nhóm kênh & giả danh hóa nhất quán: ánh xạ @shop_official, @koc_sat01 và băm Salted SHA-256 trước khi xuất metrics.json.',
      en: 'Lookup channel mapping & pseudonymization: map @shop_official, @koc_sat01, and Salted SHA-256 hashes prior to exporting metrics.json.',
    },
    {
      id: 8,
      vi: 'Gộp chuẩn hóa nhãn song ngữ trên Affiliate_Videos: hợp nhất cờ quảng cáo YES/có, NO/không và đồng bộ nhãn danh mục Anh/Việt trước khi phân tổ.',
      en: 'Bilingual label normalization on Affiliate_Videos: unify YES/có and NO/không ad flags and reconcile English/Vietnamese category tags prior to grouping.',
    },
  ];

  const sqlAndScriptIndex = [
    {
      scopeVi: 'Staging & QA (4 khối SQL)',
      scopeEn: 'Staging & QA (4 SQL blocks)',
      purposeVi: 'Ép kiểu tiền tệ, dịch múi giờ +13h, khử trùng video và chạy 9 cổng kiểm định tự động',
      purposeEn: 'Currency casting, +13h shift, composite video dedup, and 9 automated quality gates',
      tech: 'CTE, Regex, SHA-256, Assertions',
      file: 'sql/01_staging.sql · sql/07_quality_gates.sql',
    },
    {
      scopeVi: 'Chương 1 & 2 (3 khối SQL)',
      scopeEn: 'Chapters 1 & 2 (3 SQL blocks)',
      purposeVi: 'Đối soát bẫy cộng đôi Live theo ngày/tuần, đường Pareto 339 SKU, gom 4 dải giá và đường Lorenz KOC',
      purposeEn: 'Daily/weekly Live overlap check, 339-SKU Pareto curve, 4 price bands, and KOC Lorenz/HHI',
      tech: 'Window SUM OVER, ROW_NUMBER, HHI',
      file: 'sql/02_channel_sku_pareto.sql',
    },
    {
      scopeVi: 'Chương 3 (4 khối SQL)',
      scopeEn: 'Chapter 3 (4 SQL blocks)',
      purposeVi: 'MA7/MA28 trailing, phân rã đồng nhất thức T6->T8, tỷ trọng tuần 10 SKU Hè/Thu Đông, Z-score lùi 28N',
      purposeEn: 'Trailing MA7/MA28, Jun-Aug identity decomposition, weekly 10-SKU shares, trailing 28d Z-score',
      tech: 'ROWS PRECEDING, ISO Week, Cross Join',
      file: 'sql/03_timeseries_seasonality.sql',
    },
    {
      scopeVi: 'Chương 4 (2 khối SQL)',
      scopeEn: 'Chapter 4 (2 SQL blocks)',
      purposeVi: 'Ma trận cohort giữ chân M+0..M+7 trên 302 KOC, thời gian sống Kaplan-Meier và kiểm định 3 phiên đầu',
      purposeEn: '302-KOC M+0..M+7 retention matrix, Kaplan-Meier survival, and 3-session zero-GMV audit',
      tech: 'FIRST_VALUE, JULIANDAY, Cohort Pivot',
      file: 'sql/04_koc_cohort_survival.sql',
    },
    {
      scopeVi: 'Chương 5 & 6 (3 khối SQL)',
      scopeEn: 'Chapters 5 & 6 (3 SQL blocks)',
      purposeVi: '6 lát cắt Ads vs Organic, ma trận khung giờ x thời lượng Live, Spearman kệ hàng và backtest giao cắt MA',
      purposeEn: '6-slice Ads vs Organic, hour x duration Live matrix, shelf Spearman, and MA crossover backtest',
      tech: 'Paired Within-Creator CTE, LAG, Rank',
      file: 'sql/05_content_ads.sql · sql/06_backtest.sql',
    },
    {
      scopeVi: '4 Script ETL & Kiểm định (Node / Python)',
      scopeEn: '4 ETL & Statistical Scripts (Node / Python)',
      purposeVi: 'Đọc trực tiếp 10 tệp .xlsx (23.364 dòng), chạy hồi quy Panel FE + 400 bootstrap theo cụm SKU, sinh SSOT metrics.json',
      purposeEn: 'Parse all 10 .xlsx files (23,364 rows), run Panel FE + 400 SKU-cluster bootstrap, emit SSOT metrics.json',
      tech: 'Pure Node XLSX/Zlib, OLS Within-SKU FE, Vitest',
      file: 'scripts/kami/generate_outline_v2_metrics.mjs',
    },
  ];

  const piiPolicies = [
    {
      ruleVi: 'Băm định danh một chiều (Salted SHA-256)',
      ruleEn: 'One-way identifier hashing (Salted SHA-256)',
      scopeVi: 'Cột KOC ID và Tên KOC trên AffLive, AffVid, KOL',
      scopeEn: 'KOC ID and display name in AffLive, AffVid, KOL',
      implVi: 'Muối bí mật tách khỏi kho mã công khai; giữ tính nhất quán khi nối chéo bảng mà không lộ tài khoản thật.',
      implEn: 'Secret salt stored outside public repo; preserves cross-table join determinism without exposing raw handles.',
    },
    {
      ruleVi: 'Bí danh vai trò đồng nhất toàn trang',
      ruleEn: 'Uniform role aliases across all chapters',
      scopeVi: 'Toàn bộ tiêu đề, biểu đồ, bảng, chú thích và SQL Chương 0 đến Phụ lục C',
      scopeEn: 'All titles, charts, tables, footnotes, and SQL from Ch 0 to Appendix C',
      implVi: 'Thay thế đồng bộ tài khoản gốc bằng @shop_official cho kênh chính chủ, @koc_sat01 cho kênh vệ tinh nội bộ và Creator A/B/C cho đối tác ngoài trên toàn bộ trang.',
      implEn: 'Uniformly replaces raw handles with @shop_official for the official store, @koc_sat01 for the in-house satellite, and Creator A/B/C for external KOCs across the entire page.',
    },
    {
      ruleVi: 'Ẩn danh theo ngưỡng k-anonymity (k >= 10)',
      ruleEn: 'Cohort k-anonymity threshold (k >= 10)',
      scopeVi: 'Các lát cắt theo bậc follower và nhóm hiệu suất KOC',
      scopeEn: 'Follower tiers and creator performance buckets',
      implVi: 'Mọi nhóm gộp công khai đều chứa tối thiểu >= 10 creator để ngăn suy luận ngược danh tính cá nhân.',
      implEn: 'Every published creator bucket aggregates >= 10 accounts to prevent indirect re-identification.',
    },
    {
      ruleVi: 'Làm tròn thương mại & tuân thủ NĐ 356/2025/NĐ-CP',
      ruleEn: 'Commercial rounding & Decree 356/2025/ND-CP compliance',
      scopeVi: 'Các chỉ số hiển thị trên giao diện danh mục dự án',
      scopeEn: 'Public portfolio display metrics',
      implVi: 'Làm tròn tỷ/triệu đ trên biểu đồ (giữ số nguyên trong cổng kiểm định nội bộ), tuân thủ quy định dữ liệu cá nhân.',
      implEn: 'Rounds chart labels to B/M VND while keeping exact integers for internal QA gates.',
    },
  ];

  const consolidatedLimits = [
    {
      titleVi: '1. Chỉ có một mùa quan sát (n = 1 chu kỳ 2026)',
      titleEn: '1. Single observed season (n = 1 cycle in 2026)',
      descVi: 'Chưa có chuỗi cùng kỳ năm trước (YoY) để tách phần sụt giảm do thời tiết ngành hàng khỏi quyết định giảm lịch Live của shop; mọi ngưỡng ở Chương 6 dừng ở mức cảnh báo vận hành.',
      descEn: 'Lacks prior-year (YoY) data to fully separate industry weather seasonality from store scheduling choices; Chapter 6 thresholds serve as operational alerts only.',
    },
    {
      titleVi: '2. Dữ liệu ước tính bên thứ ba (FastMoss)',
      titleEn: '2. Third-party telemetry estimates (FastMoss)',
      descVi: 'Số liệu thu thập qua công cụ phân tích thị trường, lượt xem làm tròn và chưa xác nhận đã khấu trừ đơn hủy trước giao hoặc đơn hoàn COD sau giao hay chưa.',
      descEn: 'Derived from third-party market tracking with rounded view counts and unconfirmed netting of cancellations or COD returns.',
    },
    {
      titleVi: '3. Không có mã đơn, mã khách, giá vốn (COGS) và Ad spend',
      titleEn: '3. Missing order_id, customer_id, COGS, and Ad spend',
      descVi: 'Không tính được AOV giỏ hàng (thay bằng ASP = 147.298 đ/sp), tỷ lệ mua lặp lại, biên lợi nhuận ròng hay ROAS thực của các video bật cờ Ads.',
      descEn: 'Cannot compute basket AOV (replaced by ASP = 147,298 VND/unit), repeat purchase rate, net margin, or net ROAS on Ads-tagged clips.',
    },
    {
      titleVi: '4. Khung thời gian không đồng nhất giữa 10 tệp',
      titleEn: '4. Heterogeneous time windows across the 10 files',
      descVi: 'Store dài 231 ngày, SKU10 dài 179 ngày, Live trải từ 07/03 - 20/10, trong khi KOL, ShopProd, LiveProd và doanh số AffVid ghi nhận theo cửa sổ cuốn chiếu 90 ngày.',
      descEn: 'Store spans 231d, SKU10 179d, Live 07/03 - 20/10, whereas KOL, ShopProd, LiveProd, and AffVid revenue reflect rolling 90d windows.',
    },
    {
      titleVi: '5. Giới hạn dữ liệu quan sát và hiện tượng chọn mẫu ngược',
      titleEn: '5. Observational telemetry and reverse selection bias',
      descVi: 'Cờ Ủy Quyền Quảng Cáo trên video chịu hiện tượng chọn mẫu ngược (nhãn hàng ưu tiên bật Ads cho clip vốn đã bán tốt); phân rã T6->T8 là đồng nhất thức kế toán.',
      descEn: 'Video Ad authorization reflects reverse selection into boosting proven clips; Jun->Aug decomposition is an accounting identity.',
    },
    {
      titleVi: '6. Lệch thời điểm gán GMV phiên Live so với ngày lịch Shop',
      titleEn: '6. Session start-time attribution vs calendar-day Store GMV',
      descVi: 'GMV phiên Live (như các ca kéo dài 14 đến 17 giờ) được gán trọn vào giờ bắt đầu phiên, làm 28/231 ngày sau bỏ trùng vẫn có GMV Live vượt GMV ngày của cả shop.',
      descEn: 'Multi-hour Live session GMV attaches to session start timestamps, leaving 28/231 deduplicated days where session GMV exceeds calendar-day Store GMV.',
    },
  ];

  const expansionRoadmap = [
    {
      stepVi: 'Bước 1 · Bổ sung giá vốn (COGS), tồn kho & Seller Center',
      stepEn: 'Step 1 · Join COGS, inventory & Seller Center',
      detailVi: 'Nối mã đơn nội bộ (order_id, đơn hoàn COD), giá vốn và tồn kho thực tế để chuyển bước sàng lọc 206 SKU 0 đơn thành quyết định hàng tồn kho và lợi nhuận ròng.',
      detailEn: 'Join internal order_id logs, COD returns, COGS, and stock to turn 206 zero-sale SKU screening into inventory and net-margin decisions.',
    },
    {
      stepVi: 'Bước 2 · Dashboard theo dõi tuần & Thử nghiệm đối chứng',
      stepEn: 'Step 2 · Weekly monitor dashboard & controlled pilots',
      detailVi: 'Dựng dashboard theo dõi định kỳ bộ chỉ số Chương 6 và chạy thử nghiệm có nhóm đối chứng cho gói hỗ trợ 3 ca đầu của KOC mới cùng quyền chạy Ads.',
      detailEn: 'Build a weekly dashboard for Chapter 6 metrics and run controlled pilots for 3-session new-KOC onboarding support and Ad boosting.',
    },
    {
      stepVi: 'Bước 3 · Mở rộng hồi quy bảng 10 SKU (Panel FE)',
      stepEn: 'Step 3 · Enriched 10-SKU panel FE regression',
      detailVi: 'Đưa biến giá bán thực theo ngày, độ sâu chiết khấu voucher và cờ đứt size kho vào mô hình hiệu ứng cố định ở Chương 3.6.',
      detailEn: 'Add daily realized price, voucher discount depth, and stock-out flags into the Chapter 3.6 SKU Fixed-Effects model.',
    },
    {
      stepVi: 'Bước 4 · Thu thập mùa thứ hai để kiểm chứng cảnh báo',
      stepEn: 'Step 4 · Second-season warning signal validation',
      detailVi: 'Bổ sung thêm ít nhất một chu kỳ Hè sang Thu Đông năm kế tiếp để kiểm định độ dẫn trước 6 tuần của số ca Live và lượng creator mới.',
      detailEn: 'Add a second Summer-to-Autumn annual cycle to validate the 6-week lead time of monthly Live volume and new creator inflows.',
    },
  ];

  const originalQuestionsMatrix = [
    {
      qVi: 'Phễu giỏ hàng (Xem SP -> Thêm giỏ -> Thanh toán)',
      qEn: 'Checkout cart funnel (View -> Add to cart -> Paid)',
      statusVi: 'Không có log click/giỏ hàng',
      statusEn: 'No click/cart event logs',
      tone: 'rose' as const,
      altVi: 'Chuyển sang phễu hiệu suất nội dung (Lượt xem Live/Video -> Tỷ lệ phiên/clip phát sinh đơn -> GMV/lượt xem)',
      altEn: 'Replaced with content efficiency funnel (Live/Video views -> Converting session/clip rate -> VND/view)',
      chVi: 'Chương 1, Chương 5',
      chEn: 'Ch 1, Ch 5',
    },
    {
      qVi: 'Thử nghiệm A/B ngẫu nhiên cho Quảng cáo',
      qEn: 'Randomized A/B ad experiment',
      statusVi: 'Chỉ có cờ quan sát Ads/Organic',
      statusEn: 'Observational Ad flag only',
      tone: 'amber' as const,
      altVi: 'Forest plot đối chiếu 6 lát cắt kiểm soát (gồm so sánh trong cùng 192 KOC có cả hai loại clip)',
      altEn: 'Six-slice observational forest plot (including within-creator comparison across 192 dual KOCs)',
      chVi: 'Chương 5 (5.2)',
      chEn: 'Ch 5 (5.2)',
    },
    {
      qVi: 'Giá trị vòng đời khách hàng (Customer CLTV)',
      qEn: 'End-customer lifetime value (CLTV)',
      statusVi: 'Không có customer_id',
      statusEn: 'No customer_id',
      tone: 'rose' as const,
      altVi: 'Đo vòng đời & giữ chân mạng lưới 302 creator ngoài (Cohort M+0..M+7, đường sống còn Kaplan-Meier)',
      altEn: 'Modeled lifetime & retention of 302 external creators (M+0..M+7 cohorts, Kaplan-Meier survival)',
      chVi: 'Chương 4 (4.1, 4.2)',
      chEn: 'Ch 4 (4.1, 4.2)',
    },
    {
      qVi: 'Phân tích rổ hàng mua kèm (Market Basket)',
      qEn: 'Market basket co-occurrence',
      statusVi: 'Không có khóa đơn - sản phẩm',
      statusEn: 'No order-item join key',
      tone: 'rose' as const,
      altVi: 'Tương quan hạng Spearman số SP lên kệ vs GMV phiên (CrLive) và tỷ trọng bán trong Live của 103 SP (LiveProd)',
      altEn: 'Spearman rank correlation of shelf size vs session GMV (CrLive) and Live unit share across 103 SKUs (LiveProd)',
      chVi: 'Chương 5 (5.5)',
      chEn: 'Ch 5 (5.5)',
    },
    {
      qVi: 'Người mua hoạt động DAU / MAU',
      qEn: 'Buyer DAU / MAU stickiness',
      statusVi: 'Không có định danh người mua',
      statusEn: 'No buyer identifiers',
      tone: 'amber' as const,
      altVi: 'Phễu KOC hoạt động hàng tháng (Mới gia nhập / Còn lên sóng / Phát sinh đơn) từ tháng 3 đến tháng 10',
      altEn: 'Monthly active creator funnel (New / Retained active / Converting KOCs) from March to October',
      chVi: 'Chương 4 (4.4)',
      chEn: 'Ch 4 (4.4)',
    },
    {
      qVi: 'Vòng quay tồn kho & hàng chết đọng vốn',
      qEn: 'Inventory turnover & dead-stock capital',
      statusVi: 'Không có số dư kho ERP & COGS',
      statusEn: 'No ERP stock or COGS',
      tone: 'amber' as const,
      altVi: 'Phân tích Pareto 339 SKU kết hợp năm lên sàn (xác định 204/206 SKU 0 đơn là mã cũ từ 2022 - 2025)',
      altEn: '339-SKU Pareto combined with listing dates (identifying 204/206 zero-sale items as pre-2026 legacy SKUs)',
      chVi: 'Chương 2 (2.2), Chương 6',
      chEn: 'Ch 2 (2.2), Ch 6',
    },
  ];

  const currentSql = REPRESENTATIVE_CHAPTER_SQL[sqlIdx] || REPRESENTATIVE_CHAPTER_SQL[0];

  return (
    <section
      id="sec-appendix"
      className="scroll-mt-28 rounded-3xl border border-[#C8EEF7] bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900/90 space-y-4"
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#C8EEF7] pb-4 dark:border-slate-800">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-[#FFE485] px-2.5 py-0.5 text-xs font-black text-slate-950">
              {L('Phụ lục kỹ thuật A · B · C (Gập mặc định)', 'Technical Appendices A · B · C (Collapsed by default)')}
            </span>
            <Chip tone="emerald">{L('9/9 Cổng chất lượng đạt', '9/9 Quality gates passed')}</Chip>
            <Chip tone="cyan">{L(`${V2.meta.totalFiles} tệp · ${n(V2.meta.totalRawRows)} dòng`, `${V2.meta.totalFiles} files · ${n(V2.meta.totalRawRows)} rows`)}</Chip>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 dark:text-white text-balance">
            {L(
              'Kiến trúc Pipeline, đối soát số phiên, chỉ mục SQL và ma trận giới hạn dữ liệu',
              'Pipeline architecture, session reconciliation, SQL index, and data limitation matrix'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {L(
              'Toàn bộ chi tiết kỹ thuật, bảng kiểm định chất lượng và truy vấn SQL được gập gọn tại đây để giữ trang chính cô đọng (~3.200 từ) nhưng vẫn minh bạch cho kiểm toán độc lập.',
              'All engineering lineage, quality gate assertions, and SQL queries are housed here in collapsible drawers to keep the main narrative concise while preserving full auditability.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenNotebook && (
            <button
              type="button"
              onClick={onOpenNotebook}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0D7287] px-4 py-2 text-xs font-bold text-white hover:bg-[#074553] dark:bg-[#9BE7FA] dark:text-slate-950 dark:hover:bg-[#C8EEF7] cursor-pointer transition-colors"
            >
              <Terminal className="h-4 w-4" aria-hidden="true" />
              <span>{L('Mở Sổ tay Phân tích', 'Open Analysis Notebook')}</span>
            </button>
          )}
          <a
            href="https://github.com/duongduongdphk66a-spec/data-analyst-portfolio/tree/main/scripts/kami"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#9BE7FA] bg-[#C8EEF7]/30 hover:bg-[#C8EEF7]/60 px-3.5 py-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-slate-100 cursor-pointer transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
            <span>GitHub (scripts/kami)</span>
          </a>
        </div>
      </header>

      {/* Thanh chọn nhanh Phụ lục A · B · C */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={L('Các mục Phụ lục', 'Appendix sections')}>
        {navItems.map((item) => {
          const isSelected = openSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => scrollToAnchor(item.anchor, item.id)}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[#9BE7FA] text-slate-950'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-[#C8EEF7]/35 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{isEn ? item.labelEn : item.labelVi}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* PHỤ LỤC A: PIPELINE VÀ CHẤT LƯỢNG DỮ LIỆU                                  */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <button
          type="button"
          aria-expanded={openSection === 'a-quality'}
          onClick={() => toggleSection('a-quality')}
          className="w-full min-h-[44px] flex items-center justify-between p-4 bg-[#C8EEF7]/25 dark:bg-slate-950/80 hover:bg-[#C8EEF7]/45 dark:hover:bg-slate-900 cursor-pointer transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-xs font-black text-[#074553] dark:text-[#9BE7FA]">
                {L('Phụ lục A', 'Appendix A')}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
                {L('Pipeline 3 lớp, Waterfall đối soát số phiên (A.1), 9 cổng chất lượng (A.2) và 8 quy tắc làm sạch', '3-layer pipeline, session reconciliation waterfall (A.1), 9 quality gates (A.2), and 8 cleaning rules')}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Chip tone="emerald">{L('9/9 Đạt', '9/9 Passed')}</Chip>
            {openSection === 'a-quality' ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
          </div>
        </button>

        {openSection === 'a-quality' && (
          <section id="sec-appendix-a" className="scroll-mt-28 space-y-5 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800">
            {/* Sơ đồ 3 lớp Raw -> Staging -> Mart */}
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
                {L('Sơ đồ luồng 3 lớp: Raw (10 tệp Excel) -> Staging (stg_*) -> Analytical Marts (mart_*)', 'Three-tier lineage: Raw (10 Excel exports) -> Staging (stg_*) -> Analytical Marts (mart_*)')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1.5">
                  <div className="font-extrabold text-slate-950 dark:text-white">
                    {L(`1. Raw Layer (${V2.meta.totalFiles} tệp · ${n(V2.meta.totalRawRows)} dòng)`, `1. Raw Layer (${V2.meta.totalFiles} files · ${n(V2.meta.totalRawRows)} rows)`)}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed tabular-nums">
                    {V2.ch1.files.map((f) => `${f.abbr} (${n(f.rows)})`).join(' · ')}
                  </p>
                </div>
                <div className="rounded-xl border border-[#9BE7FA]/80 bg-[#C8EEF7]/25 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1.5">
                  <div className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
                    {L('2. Staging Layer (stg_* chuẩn hóa)', '2. Staging Layer (normalized stg_*)')}
                  </div>
                  <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    stg_store_daily · stg_sku10_daily · stg_affiliate_live · stg_creator_live (+13h) · stg_affiliate_videos · stg_creator_videos · stg_kol_directory · stg_shop_products · stg_creator_products · stg_live_products
                  </p>
                </div>
                <div className="rounded-xl border border-[#FFD14C]/80 bg-[#FFE485]/25 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1.5">
                  <div className="font-extrabold text-amber-950 dark:text-[#FFE485]">
                    {L('3. Mart Layer (SSOT metrics.json)', '3. Mart Layer (SSOT metrics.json)')}
                  </div>
                  <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    mart_daily_ma · mart_channel_reconciled · mart_sku_pareto_seasonality · mart_koc_cohort_survival · mart_content_ads_forest · mart_early_warning_backtest
                  </p>
                </div>
              </div>
            </div>

            {/* A.1 [XEM THÊM] Waterfall đối soát số phiên Live */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <ChartRoleBadge kind="more" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
                  {L('A.1. Waterfall đối soát số phiên Live: Từ 8.355 dòng AffLive và 600 dòng CrLive về các tập phân tích', 'A.1. Live session reconciliation waterfall: From 8,355 AffLive and 600 CrLive rows to analytical subsets')}
                </h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 text-xs tabular-nums">
                <div className="lg:col-span-7 rounded-xl border border-slate-200 p-3 dark:border-slate-800 space-y-2.5">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {L('Nhánh 1: Affiliate_Livestreams (toàn shop 07/03 - 20/10/2026)', 'Branch 1: Affiliate_Livestreams (store-wide Mar 07 - Oct 20, 2026)')}
                  </div>
                  {wfAff.map((step, idx) => {
                    const pct = Math.round((step.count / (wfAff[0]?.count || 8355)) * 100);
                    const barColor =
                      idx === 0
                        ? KAMI_BRAND_PALETTE.tealInk
                        : idx === 1
                          ? KAMI_BRAND_PALETTE.cyan
                          : idx === 2
                            ? KAMI_BRAND_PALETTE.ice
                            : KAMI_BRAND_PALETTE.amber;
                    return (
                      <div key={step.stepEn} className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{isEn ? step.stepEn : step.stepVi}</span>
                          <span className="font-extrabold text-slate-950 dark:text-white">
                            {n(step.count)} {step.delta !== 0 ? `(${step.delta > 0 ? '+' : ''}${n(step.delta)})` : ''}
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full rounded-md" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? step.noteEn : step.noteVi}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="lg:col-span-5 rounded-xl border border-slate-200 p-3 dark:border-slate-800 space-y-2.5">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {L('Nhánh 2: Creator_Livestreams (@shop_official)', 'Branch 2: Creator_Livestreams (@shop_official)')}
                  </div>
                  {wfCr.map((step, idx) => {
                    const pct = Math.round((step.count / (wfCr[0]?.count || 600)) * 100);
                    const barColor = idx === 0 ? KAMI_BRAND_PALETTE.tealInk : idx === 1 ? KAMI_BRAND_PALETTE.cyan : KAMI_BRAND_PALETTE.amber;
                    return (
                      <div key={step.stepEn} className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{isEn ? step.stepEn : step.stepVi}</span>
                          <span className="font-extrabold text-slate-950 dark:text-white">
                            {n(step.count)} {step.delta !== 0 ? `(${n(step.delta)})` : ''}
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full rounded-md" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? step.noteEn : step.noteVi}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* A.2 [XEM THÊM] Bảng 9 cổng chất lượng (6 cột chuẩn Dàn ý v2) */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <ChartRoleBadge kind="more" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
                  {L('A.2. Bảng hợp nhất 9 cổng kiểm định chất lượng dữ liệu (6 Chặn · 3 Cảnh báo)', 'A.2. Unified 9 data quality gates (6 Blocking · 3 Warnings)')}
                </h4>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="bg-[#C8EEF7]/45 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                      <th className="py-2 px-3 font-bold">{L('Cổng kiểm tra', 'Gate')}</th>
                      <th className="py-2 px-3 font-bold">{L('Phạm vi', 'Scope')}</th>
                      <th className="py-2 px-3 font-bold">{L('Kỳ vọng', 'Expected')}</th>
                      <th className="py-2 px-3 font-bold">{L('Kết quả thực tế', 'Observed result')}</th>
                      <th className="py-2 px-2.5 font-bold text-center">{L('Mức độ', 'Severity')}</th>
                      <th className="py-2 px-2.5 font-bold text-center">{L('Trạng thái', 'Status')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {gates.map((g, idx) => (
                      <tr key={g.id} className={idx % 2 === 1 ? 'bg-slate-50/60 dark:bg-slate-950/40' : ''}>
                        <td className="py-2 px-3 font-bold text-slate-950 dark:text-white">
                          G{g.id}. {isEn ? g.gateEn : g.gateVi}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-[#074553] dark:text-[#9BE7FA]">{g.scope}</td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{isEn ? g.expectedEn : g.expectedVi}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{isEn ? g.actualEn : g.actualVi}</td>
                        <td className="py-2 px-2.5 text-center">
                          <Chip tone={g.level === 'ERROR' ? 'cyan' : 'amber'}>
                            {g.level === 'ERROR' ? L('Chặn', 'Block') : L('Cảnh báo', 'Warn')}
                          </Chip>
                        </td>
                        <td className="py-2 px-2.5 text-center">
                          <Chip tone="emerald">{g.status}</Chip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tám quy tắc làm sạch (mỗi quy tắc một dòng) */}
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
                {L('Tám quy tắc làm sạch dữ liệu chuẩn hóa (1 dòng mỗi quy tắc)', 'Eight standardized data cleaning rules (one line per rule)')}
              </h4>
              <ol className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {cleaningRulesOneLine.map((r) => (
                  <li key={r.id} className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60">
                    <strong className="font-bold text-[#074553] dark:text-[#9BE7FA] mr-1.5">R{r.id}.</strong>
                    {isEn ? r.en : r.vi}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PHỤ LỤC B: SQL VÀ MÃ NGUỒN                                                 */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <button
          type="button"
          aria-expanded={openSection === 'b-sql'}
          onClick={() => toggleSection('b-sql')}
          className="w-full min-h-[44px] flex items-center justify-between p-4 bg-[#C8EEF7]/25 dark:bg-slate-950/80 hover:bg-[#C8EEF7]/45 dark:hover:bg-slate-900 cursor-pointer transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950">
              <Code2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-xs font-black text-[#074553] dark:text-[#9BE7FA]">
                {L('Phụ lục B', 'Appendix B')}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
                {L('Chỉ mục 16 khối SQL (~264 dòng), 4 script xử lý và truy vấn tiêu biểu từng chương', 'Index of 16 SQL blocks (~264 lines), 4 processing scripts, and representative chapter queries')}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Chip tone="cyan">{L('16 SQL · 4 Script', '16 SQL · 4 Scripts')}</Chip>
            {openSection === 'b-sql' ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
          </div>
        </button>

        {openSection === 'b-sql' && (
          <section id="sec-appendix-b" className="scroll-mt-28 space-y-4 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800">
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#C8EEF7]/45 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    <th className="py-2 px-3 font-bold whitespace-nowrap">{L('Chương / Tầng', 'Chapter / Tier')}</th>
                    <th className="py-2 px-3 font-bold min-w-[240px]">{L('Mục đích xử lý', 'Analytical purpose')}</th>
                    <th className="py-2 px-3 font-bold">{L('Kỹ thuật sử dụng', 'Key techniques')}</th>
                    <th className="py-2 px-3 font-bold">{L('Đường dẫn trong repo', 'Repository path')}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {sqlAndScriptIndex.map((row, idx) => (
                    <tr key={row.file} className={idx % 2 === 1 ? 'bg-slate-50/60 dark:bg-slate-950/40' : ''}>
                      <td className="py-2 px-3 font-bold text-slate-950 dark:text-white whitespace-nowrap">{isEn ? row.scopeEn : row.scopeVi}</td>
                      <td className="py-2 px-3 leading-relaxed">{isEn ? row.purposeEn : row.purposeVi}</td>
                      <td className="py-2 px-3 font-semibold text-[#074553] dark:text-[#9BE7FA]">{row.tech}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">{row.file}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-[#FFD14C]/70 bg-[#FFE485]/25 px-3.5 py-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-[#FFD14C]/10 dark:text-slate-200">
              <strong className="font-bold text-amber-950 dark:text-[#FFE485] mr-1.5">
                {L('Ghi chú phương ngữ SQL:', 'SQL dialect note:')}
              </strong>
              {L(
                'Các đoạn mã tiêu biểu bên dưới viết theo chuẩn SQLite / ANSI SQL để chạy trực tiếp trong môi trường kiểm thử cục bộ (độ lệch chuẩn cửa sổ tính qua công thức phương sai E[X²] - (E[X])²). Khi triển khai lên PostgreSQL, đổi JULIANDAY sang phép trừ DATE trực tiếp, dùng hàm cửa sổ STDDEV_SAMP() cho Z-score và dùng PERCENTILE_CONT(0.5) WITHIN GROUP cho trung vị.',
                'Snippets below use SQLite / ANSI SQL for zero-dependency local reproducibility (computing rolling dispersion via E[X²] - (E[X])²). On PostgreSQL, replace JULIANDAY with direct DATE subtraction, use STDDEV_SAMP() for rolling Z-scores, and PERCENTILE_CONT(0.5) WITHIN GROUP for exact medians.'
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {REPRESENTATIVE_CHAPTER_SQL.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSqlIdx(idx)}
                    className={`min-h-[44px] rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition-colors ${
                      sqlIdx === idx
                        ? 'bg-[#9BE7FA] text-slate-950'
                        : 'bg-slate-100 text-slate-600 hover:bg-[#C8EEF7]/40 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isEn ? item.labelEn : item.labelVi}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleCopySql(currentSql.code)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? L('Đã sao chép', 'Copied') : L('Sao chép SQL', 'Copy SQL')}</span>
              </button>
            </div>

            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-relaxed text-[#C8EEF7] border border-slate-800 font-mono">
              <code>{currentSql.code}</code>
            </pre>
          </section>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PHỤ LỤC C: QUYỀN RIÊNG TƯ, GIỚI HẠN VÀ MỞ RỘNG                             */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <button
          type="button"
          aria-expanded={openSection === 'c-limits'}
          onClick={() => toggleSection('c-limits')}
          className="w-full min-h-[44px] flex items-center justify-between p-4 bg-[#FFE485]/25 dark:bg-slate-950/80 hover:bg-[#FFE485]/45 dark:hover:bg-slate-900 cursor-pointer transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#FFD14C] text-slate-950">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="text-xs font-black text-amber-950 dark:text-[#FFE485]">
                {L('Phụ lục C', 'Appendix C')}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white">
                {L('Quyền riêng tư PII, 6 giới hạn hợp nhất, lộ trình mở rộng và ma trận Câu hỏi x Dữ liệu (C.1)', 'PII privacy rules, 6 consolidated limits, expansion roadmap, and Question x Data matrix (C.1)')}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Chip tone="amber">{L('PII · 6 Giới hạn · C.1', 'PII · 6 Limits · C.1')}</Chip>
            {openSection === 'c-limits' ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
          </div>
        </button>

        {openSection === 'c-limits' && (
          <section id="sec-appendix-c" className="scroll-mt-28 space-y-5 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800">
            {/* Bảng chính sách PII */}
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
                {L('Chính sách bảo vệ định danh (PII & k-anonymity) áp dụng đồng nhất toàn trang', 'Uniform PII & k-anonymity governance applied across the entire study')}
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#C8EEF7]/45 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                      <th className="py-2 px-3 font-bold">{L('Cơ chế bảo vệ', 'Control')}</th>
                      <th className="py-2 px-3 font-bold">{L('Phạm vi trường dữ liệu', 'Target fields')}</th>
                      <th className="py-2 px-3 font-bold">{L('Quy tắc thực thi', 'Implementation')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {piiPolicies.map((p, idx) => (
                      <tr key={p.ruleEn} className={idx % 2 === 1 ? 'bg-slate-50/60 dark:bg-slate-950/40' : ''}>
                        <td className="py-2 px-3 font-bold text-slate-950 dark:text-white whitespace-nowrap">{isEn ? p.ruleEn : p.ruleVi}</td>
                        <td className="py-2 px-3 text-[#074553] dark:text-[#9BE7FA] font-medium">{isEn ? p.scopeEn : p.scopeVi}</td>
                        <td className="py-2 px-3 leading-relaxed">{isEn ? p.implEn : p.implVi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sáu giới hạn hợp nhất */}
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
                {L('Sáu giới hạn dữ liệu và phương pháp luận hợp nhất (không lặp ở các chương)', 'Six consolidated data and methodological limitations')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                {consolidatedLimits.map((lim) => (
                  <div
                    key={lim.titleEn}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1"
                  >
                    <div className="font-bold text-slate-950 dark:text-white">{isEn ? lim.titleEn : lim.titleVi}</div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{isEn ? lim.descEn : lim.descVi}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* C.1 [XEM THÊM] Ma trận ô màu Câu hỏi x Dữ liệu */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <ChartRoleBadge kind="more" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
                  {L('C.1. Ma trận ô màu "Câu hỏi dàn ý gốc x Dữ liệu hiện có"', 'C.1. Color-coded matrix: Original outline questions vs available telemetry')}
                </h4>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FFE485]/45 dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                      <th className="py-2 px-3 font-bold min-w-[180px]">{L('Hạng mục dàn ý gốc', 'Original outline topic')}</th>
                      <th className="py-2 px-3 font-bold whitespace-nowrap">{L('Trạng thái dữ liệu', 'Data availability')}</th>
                      <th className="py-2 px-3 font-bold min-w-[260px]">{L('Phương án thay thế đã thực hiện', 'Implemented analytical alternative')}</th>
                      <th className="py-2 px-3 font-bold whitespace-nowrap">{L('Chương trả lời', 'Chapter')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {originalQuestionsMatrix.map((mRow, idx) => (
                      <tr key={mRow.qEn} className={idx % 2 === 1 ? 'bg-slate-50/60 dark:bg-slate-950/40' : ''}>
                        <td className="py-2.5 px-3 font-bold text-slate-950 dark:text-white">{isEn ? mRow.qEn : mRow.qVi}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <Chip tone={mRow.tone}>{isEn ? mRow.statusEn : mRow.statusVi}</Chip>
                        </td>
                        <td className="py-2.5 px-3 leading-relaxed">{isEn ? mRow.altEn : mRow.altVi}</td>
                        <td className="py-2.5 px-3 font-bold text-[#074553] dark:text-[#9BE7FA] whitespace-nowrap">{isEn ? mRow.chEn : mRow.chVi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lộ trình mở rộng 4 bước */}
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
                {L('Lộ trình mở rộng phân tích khi có thêm dữ liệu nội bộ và mùa thứ hai', 'Four-step analytical expansion roadmap')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                {expansionRoadmap.map((r) => (
                  <div
                    key={r.stepEn}
                    className="rounded-xl border border-[#9BE7FA]/70 bg-[#C8EEF7]/20 p-3 dark:border-slate-800 dark:bg-slate-950/60 space-y-1"
                  >
                    <div className="font-bold text-[#074553] dark:text-[#9BE7FA]">{isEn ? r.stepEn : r.stepVi}</div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{isEn ? r.detailEn : r.detailVi}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
