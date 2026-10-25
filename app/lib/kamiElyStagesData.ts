// FILE: app/lib/kamiElyStagesData.ts
// Centralized Backend Data Engine for Kami Ely 7-Stage Case Study
// Consolidates metrics.json calculations, reconciliation matrices, and domain metadata
// for Server-Side Rendering (SSR) and API distribution, drastically streamlining frontend code.

import metricsJson from '@/app/data/kami-ely/generated/metrics.json';
import { kamiReconciliationData } from '@/app/data/kami-ely/reconciliation';
import type {
  BilingualText,
  KamiEly7StagesPayload,
  Stage1Payload,
  Stage2Payload,
  Stage3Payload,
  Stage4Payload,
  Stage5Payload,
  Stage6Payload,
  Stage7Payload,
} from '@/app/types/caseStudies';

const m = metricsJson;

export const COLORS = {
  cyan: '#9BE7FA',
  ice: '#C8EEF7',
  butter: '#FFE485',
  amber: '#FFD14C',
  teal: '#0D7287',
  deep: '#074553',
  alert: '#E11D48',
  axis: '#64748B',
} as const;

// Statistical Helpers
export const mean = (a: number[]): number => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);

export const sampleStd = (a: number[]): number => {
  if (a.length <= 1) return 0;
  const mu = mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - mu) ** 2, 0) / (a.length - 1));
};

export const percentile = (a: number[], p: number): number => {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  const idx = (s.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return s[lo] + (s[hi] - s[lo]) * (idx - lo);
};

export const median = (a: number[]): number => percentile(a, 0.5);

export const winsorizeUpper = (a: number[], p: number): number[] => {
  const cap = percentile(a, p);
  return a.map((x) => Math.min(x, cap));
};

const toM = (v: number): number => Math.round((v / 1e6) * 10) / 10;
const ddmm = (iso: string): string => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

const TABLE_LABELS: Record<string, BilingualText> = {
  store: { vi: 'Shop theo ngày (226 ngày)', en: 'Store daily (226 days)' },
  goods: { vi: 'Hàng bán (2 Snapshot Hè/Thu)', en: 'Goods list (2 snapshots)' },
  ch_live: { vi: 'LIVE chính chủ', en: 'Own LIVE' },
  ch_video: { vi: 'Video chính chủ', en: 'Own video' },
  shop_video: { vi: 'Video gắn SP (shop)', en: 'Shoppable video' },
  product: { vi: 'SKU sản phẩm', en: 'Product SKU' },
  creators: { vi: 'Creator', en: 'Creators' },
  shop_live: { vi: 'LIVE toàn shop', en: 'Shop-wide LIVE' },
  live_products: { vi: 'SP gắn trong LIVE', en: 'Live-featured products' },
};

export function buildStage1Data(): Stage1Payload {
  const tableRows = m.dataScope
    .map((d) => ({
      key: d.key,
      rows: d.rows,
      columns: d.columns,
      label: TABLE_LABELS[d.key] ?? { vi: d.key, en: d.key },
    }))
    .sort((a, b) => b.rows - a.rows);

  const totalRows = m.dataScope.reduce((s, d) => s + d.rows, 0);

  const subQuestions: Stage1Payload['subQuestions'] = [
    {
      id: 1,
      question: {
        vi: 'Doanh thu biến động do mùa vụ hay do cường độ marketing?',
        en: 'Is revenue driven by seasonality or marketing intensity?',
      },
      metrics: {
        vi: 'GMV ngày/tháng, số KOC và số phiên Live mỗi ngày',
        en: 'Daily/monthly GMV, active KOCs & daily LIVE count',
      },
      table: 'Store Detail Page (226 ngày)',
      decision: {
        vi: 'Lịch chiến dịch, kế hoạch nhập hàng & tồn kho',
        en: 'Campaign scheduling, stock & inventory planning',
      },
      iconName: 'calendar',
      tone: 'cyan',
    },
    {
      id: 2,
      question: {
        vi: 'Doanh thu phụ thuộc kênh và hình thức nội dung nào?',
        en: 'Which channels and content formats drive revenue?',
      },
      metrics: {
        vi: 'Tỷ trọng GMV theo kênh, Live / Video / Product Card',
        en: 'GMV share by channel: Live / Video / Product Card',
      },
      table: 'Shop LIVE, Shoppable Videos, Creators Merged',
      decision: {
        vi: 'Phân bổ ngân sách quảng cáo và nhân lực sản xuất',
        en: 'Budget & headcount allocation across content formats',
      },
      iconName: 'video',
      tone: 'amber',
    },
    {
      id: 3,
      question: {
        vi: 'Mạng lưới KOC/Affiliate có bền vững không hay phụ thuộc vài cá nhân?',
        en: 'Is the affiliate network resilient or top-heavy?',
      },
      metrics: {
        vi: 'HHI concentration index, tỷ trọng top 1 & top 10 KOC',
        en: 'HHI index, top 1 & top 10 creator GMV share',
      },
      table: 'Creators Merged (90 ngày) & Shop LIVE (180 ngày)',
      decision: {
        vi: 'Chính sách hoa hồng, chiến lược tuyển & giữ chân KOC',
        en: 'Commission policy, KOC recruiting & retention strategy',
      },
      iconName: 'users',
      tone: 'cyan',
    },
    {
      id: 4,
      question: {
        vi: 'Sản phẩm nào là "xương sống" và sản phẩm nào là "hàng chết"?',
        en: 'Which SKUs form the backbone vs dead catalog inventory?',
      },
      metrics: {
        vi: 'Đường cong Pareto, tỷ lệ SKU có doanh số (dead SKU %)',
        en: 'Pareto curve, active vs dead SKU percentage',
      },
      table: 'Product Data & Goods for Sale (90 ngày)',
      decision: {
        vi: 'Tối ưu danh mục, loại bỏ SKU chết, tập trung sản xuất',
        en: 'Catalog trimming, dead SKU phaseout, focused manufacturing',
      },
      iconName: 'layers',
      tone: 'amber',
    },
    {
      id: 5,
      question: {
        vi: 'Định dạng nội dung nào có hiệu suất chuyển đổi thực tế cao hơn?',
        en: 'Which content format yields higher real conversion efficiency?',
      },
      metrics: {
        vi: 'GPM (Doanh thu / 1.000 views) giữa Video và Live',
        en: 'GPM (GMV per 1,000 views) across Video and Live',
      },
      table: 'Shoppable Videos & Shop LIVE (180 ngày)',
      decision: {
        vi: 'Cân đối ca Live và sản xuất video ngắn cho đội ngũ',
        en: 'Balance Live streaming roster against short-video team',
      },
      iconName: 'barChart',
      tone: 'cyan',
    },
  ];

  const architectureLayers: Stage1Payload['architectureLayers'] = [
    {
      layer: 'Layer 1: Raw / Ingestion Layer',
      badge: 'Bảo toàn nguyên bản (Lossless Raw)',
      title: { vi: 'Tầng nạp dữ liệu thô (Staging Stg)', en: 'Raw Ingestion Tier (Stg)' },
      subtitle: { vi: 'Nạp nguyên vẹn từ 8 file XLSX/CSV gốc', en: 'Direct ingestion from 8 raw source files' },
      schemas: ['stg_store_daily', 'stg_goods_for_sale', 'stg_creator_live', 'stg_creator_video', 'stg_shoppable_video', 'stg_product_data', 'stg_creators_merged', 'stg_shop_live'],
      responsibilities: [
        { vi: 'Giữ nguyên 100% tên cột gốc, kiểu dữ liệu chuỗi (TEXT) để không làm mất thông tin', en: 'Retain 100% original column headers and string types to prevent data loss' },
        { vi: 'Ghi nhận mốc nạp (loaded_at) và hash file nguồn (sha256_hash) để đối soát', en: 'Record loading timestamp (loaded_at) and source file SHA-256 for auditability' },
      ],
      tone: 'slate',
    },
    {
      layer: 'Layer 2: Cleaned & Normalized Staging',
      badge: 'Chuẩn hóa định dạng (7 Rules)',
      title: { vi: 'Tầng làm sạch & Chuẩn hóa kiểu', en: 'Cleaned & Standardized Staging' },
      subtitle: { vi: 'Xử lý chuỗi, ép kiểu số, bù múi giờ và lọc ngoại lai', en: 'String casting, timezone lag adjustment & outlier handling' },
      schemas: ['clean_store_daily_226d', 'clean_catalog_products', 'clean_creators_network', 'clean_shop_live_sessions', 'clean_shoppable_videos'],
      responsibilities: [
        { vi: 'Chuyển đổi chuỗi tiền tệ ("500,2Tr ₫", "1.6k views") về số nguyên INTEGER', en: 'Convert localized strings ("500.2Tr VND", "1.6k views") into numeric integers' },
        { vi: 'Bù lệch múi giờ +13h giữa UTC và GMT+7 cho các phiên Live', en: 'Apply +13h timezone lag adjustment between UTC and Vietnam GMT+7' },
        { vi: 'Gắn cờ phiên Live outlier > 24h và mã Creator mồ côi (is_orphan = 1)', en: 'Flag >24h outlier streams and orphan creator IDs (is_orphan = 1)' },
      ],
      tone: 'cyan',
    },
    {
      layer: 'Layer 3: Analytical Data Marts (SSOT)',
      badge: 'Báo cáo & Ra quyết định',
      title: { vi: 'Tầng dữ liệu phân tích (Marts)', en: 'Analytical Marts Tier (SSOT)' },
      subtitle: { vi: 'Bảng tổng hợp phục vụ 5 câu hỏi kinh doanh và Case Study', en: 'Consolidated marts serving 5 business queries and dashboard' },
      schemas: ['mart_store_seasonality_daily', 'mart_creator_cohorts_retention', 'mart_sku_pareto_health', 'mart_content_funnel_gpm', 'mart_anomaly_telemetry'],
      responsibilities: [
        { vi: 'Trung tâm sự thật duy nhất (Single Source of Truth) cho toàn bộ biểu đồ', en: 'Single Source of Truth for all production dashboards and charts' },
        { vi: 'Tối ưu hóa chỉ mục (INDEX) trên date, creator_id, sku để truy vấn dưới 10ms', en: 'Indexed on date, creator_id, and sku to guarantee sub-10ms response times' },
      ],
      tone: 'amber',
    },
  ];

  const dataFlowSteps: Stage1Payload['dataFlowSteps'] = [
    {
      step: 1,
      phase: { vi: 'Xuất dữ liệu nền tảng', en: 'Platform Export' },
      action: { vi: 'TikTok Shop Seller Center & FastMoss export báo cáo theo 3 khung thời gian', en: 'TikTok Shop Seller Center & FastMoss export across 3 windows' },
      tables: '8 file XLSX/CSV gốc',
      cadence: { vi: 'Hàng ngày / Hàng tuần', en: 'Daily / Weekly' },
    },
    {
      step: 2,
      phase: { vi: 'Nạp & Kiểm tra toàn vẹn', en: 'Ingestion & Hash Audit' },
      action: { vi: 'Python nạp vào MySQL/SQLite, kiểm tra SHA-256 để chống trùng lặp dòng', en: 'Python ingestion with SHA-256 row-hash deduplication' },
      tables: 'stg_* (8 bảng thô)',
      cadence: { vi: 'Tự động khi có file', en: 'Automated on drop' },
    },
    {
      step: 3,
      phase: { vi: 'Làm sạch & Đồng bộ', en: 'Cleanse & Synchronize' },
      action: { vi: 'Áp dụng 7 quy tắc làm sạch, chuẩn hóa múi giờ, gán cờ dữ liệu mồ côi', en: 'Apply 7 cleaning rules, standardize timezone, flag orphans' },
      tables: 'clean_* (5 bảng sạch)',
      cadence: { vi: 'Batch xử lý', en: 'Batch pipeline' },
    },
    {
      step: 4,
      phase: { vi: 'Mô hình hóa Marts', en: 'Mart Modeling' },
      action: { vi: 'SQL aggregations, tính rolling averages (MA7), retention matrix, đường cong Pareto', en: 'SQL aggregations, 7-day rolling averages, retention matrices' },
      tables: 'mart_* (5 marts)',
      cadence: { vi: 'Real-time cache', en: 'Real-time cache' },
    },
    {
      step: 5,
      phase: { vi: 'Trình diễn & Báo cáo', en: 'Serving & Dashboard' },
      action: { vi: 'API Next.js truyền tải đến giao diện trực quan hóa tương tác', en: 'Next.js backend streaming data directly into interactive UI' },
      tables: 'Web UI / API',
      cadence: { vi: 'Tức thời (SSR/Cache)', en: 'Instant (SSR/Cache)' },
    },
  ];

  const pipelineChecklist: Stage1Payload['pipelineChecklist'] = [
    {
      id: 1,
      area: { vi: 'Khung thời gian chuẩn hóa', en: 'Standardized Time Horizon' },
      status: 'passed',
      detail: { vi: '226 ngày liên tục từ 09/03/2026 đến 20/10/2026 không có ngày trống', en: '226 continuous days from Mar 09 to Oct 20 with zero missing days' },
      evidence: 'stg_store_daily: 226 records',
    },
    {
      id: 2,
      area: { vi: 'Nhận diện giới hạn dữ liệu', en: 'Data Scope Transparency' },
      status: 'passed',
      detail: { vi: 'Nhận diện rõ ràng việc thiếu customer_id và COGS để không đưa ra kết luận suy diễn', en: 'Transparent boundary regarding missing customer_id & internal COGS' },
      evidence: 'Giới hạn phân tích đã ghi nhận',
    },
    {
      id: 3,
      area: { vi: 'Kiến trúc Schema 3 tầng', en: '3-Tier Schema Design' },
      status: 'passed',
      detail: { vi: 'Phân định tách bạch Raw Staging -> Clean Staging -> Presentation Marts', en: 'Strict isolation: Raw Staging -> Clean Staging -> Presentation Marts' },
      evidence: 'schema_kami_supplementary.sql',
    },
    {
      id: 4,
      area: { vi: 'Bảo toàn số liệu kiểm toán', en: 'Audit Telemetry Integrity' },
      status: 'passed',
      detail: { vi: 'Khớp 100% doanh thu 14,84 tỷ và 100.669 sản phẩm giữa các bảng đối soát', en: '100% reconciliation match on 14.84B GMV and 100,669 units' },
      evidence: 'reconciliationRules: 6/6 passed',
    },
    {
      id: 5,
      area: { vi: 'Bảo vệ PII & Tuân thủ', en: 'PII Protection & Compliance' },
      status: 'passed',
      detail: { vi: 'Toàn bộ Creator ID và Phone được băm SHA-256 + Salt theo chuẩn ISO/IEC 27701', en: 'All Creator IDs and Phones hashed via SHA-256 + Salt (ISO 27701)' },
      evidence: 'k-anonymity: k >= 10 verified',
    },
    {
      id: 6,
      area: { vi: 'Sẵn sàng tích hợp ERP', en: 'Enterprise ERP Readiness' },
      status: 'passed',
      detail: { vi: 'Khóa chính và chuẩn hóa bảng giúp dễ dàng nối dữ liệu với SAP/Odoo nội bộ', en: 'Normalized schemas ready for direct join with internal SAP/Odoo' },
      evidence: 'Unified Primary Keys',
    },
  ];

  const dataGrains: Stage1Payload['dataGrains'] = [
    {
      grain: { vi: 'Theo ngày (Daily)', en: 'Daily Grain' },
      table: 'Store Detail Page Overview',
      key: 'report_date',
      desc: { vi: '226 dòng SSOT theo dõi GMV, lượt hiển thị, đơn hàng toàn shop (09/03 – 20/10/2026)', en: '226 SSOT daily records tracking GMV, impressions, orders (Mar 09 – Oct 20, 2026)' },
    },
    {
      grain: { vi: 'Theo sản phẩm (SKU)', en: 'Product SKU Grain' },
      table: 'Shop Products & Creator Products',
      key: 'product_id, sku_id',
      desc: { vi: '339 SKU niêm yết và 787 dòng sản phẩm creator (hợp nhất 2 snapshot Hè & Thu)', en: '339 listed SKUs and 787 creator product records (2 seasonal snapshots merged)' },
    },
    {
      grain: { vi: 'Theo Creator', en: 'Creator Grain' },
      table: 'Affiliate KOL / Creators',
      key: 'creator_handle',
      desc: { vi: '6.086 creator liên kết, bậc follower, số đơn phát sinh và GMV', en: '6,086 affiliate creators, follower tiers, order count & GMV' },
    },
    {
      grain: { vi: 'Theo ca LIVE (Session)', en: 'Live Session Grain' },
      table: 'Shop LIVE & Creator Livestreams',
      key: 'session_id, start_time',
      desc: { vi: '600 phiên LIVE chính chủ và 7.367 phiên LIVE toàn shop liên kết', en: '600 own LIVE sessions and 7,367 shop-wide affiliate LIVE sessions' },
    },
    {
      grain: { vi: 'Theo Video', en: 'Video Grain' },
      table: 'Shoppable Videos & Creator Videos',
      key: 'video_id',
      desc: { vi: '276 video chính chủ và 4.796 video gắn giỏ hàng của nhà sáng tạo', en: '276 own videos and 4,796 affiliate shoppable videos' },
    },
  ];

  const reconciliationRules: Stage1Payload['reconciliationRules'] = [
    {
      check: { vi: 'Sản lượng kênh chính chủ giữa Creators Merged và Goods for Sale', en: 'Own-channel volume between Creators Merged & Goods for Sale' },
      expected: { vi: 'Khớp tuyệt đối', en: 'Exact match' },
      actual: { vi: 'Khớp chính xác 20.027 sản phẩm', en: 'Exact match: 20,027 units' },
      status: 'pass',
      statusLabel: { vi: 'Khớp 100%', en: 'Pass 100%' },
      note: { vi: 'Tính nhất quán cao giữa danh mục sản phẩm bày bán và báo cáo kênh creator.', en: 'High consistency between listed catalog goods and creator performance.' },
    },
    {
      check: { vi: 'Số phiên LIVE chính chủ giữa Creator Live List và Shop LIVE', en: 'Own LIVE session count between Creator Live List & Shop LIVE' },
      expected: { vi: 'Bằng nhau', en: 'Equal count' },
      actual: { vi: 'Lệch 5 phiên (475 phiên vs 470 phiên)', en: 'Mismatch: 475 vs 470 sessions' },
      status: 'warn',
      statusLabel: { vi: 'Lệch 5 phiên', en: '5-session diff' },
      note: { vi: 'Đã giải mã ở Mục 2.3: Lệch 13 tiếng (+13h khớp 470/470); 5 phiên thừa gồm 1 phiên 07/03 và 4 phiên test 0 GMV.', en: 'Solved in Stage 2.3: 13h lag (+13h matches 470/470); 5 surplus sessions are 1 Mar 07 pre-window & 4 zero-GMV test runs.' },
    },
    {
      check: { vi: 'GMV LIVE chính chủ giữa hai nguồn trên', en: 'Own LIVE GMV between Creator Live List & Shop LIVE' },
      expected: { vi: 'Bằng nhau', en: 'Equal GMV' },
      actual: { vi: 'Lệch nhẹ 91.000 đ (7.023.530.158 vs 7.023.621.158 đ)', en: 'Minor diff: 91K VND (0.001%)' },
      status: 'warn',
      statusLabel: { vi: 'Lệch 0,001%', en: '0.001% diff' },
      note: { vi: 'Đã giải mã ở Mục 2.3: Khớp toán học trọn vẹn từ 190.000 đ (lệch phiên 06/05) − 99.000 đ (phiên 07/03) = đúng 91.000 đ.', en: 'Solved in Stage 2.3: Exact math reconciliation: 190k VND (May 06 session diff) − 99k VND (Mar 07 session) = 91k VND.' },
    },
    {
      check: { vi: 'Khử trùng lặp giữa Shop LIVE tập 1 và tập 2', en: 'Deduplication across Shop LIVE Part 1 & Part 2' },
      expected: { vi: 'Không có bản ghi trùng', en: 'Zero duplicates' },
      actual: { vi: 'Khử trùng lặp qua DISTINCT session_id', en: 'Deduplicated via DISTINCT session_id' },
      status: 'info',
      statusLabel: { vi: 'Đã làm sạch', en: 'Deduplicated' },
      note: { vi: 'Bảo đảm không bị nhân đôi số liệu khi gom file xuất định kỳ theo 2 đợt.', en: 'Prevents artificial row inflation when merging split periodic exports.' },
    },
    {
      check: { vi: 'Tổng GMV theo ngày chu kỳ 226 ngày', en: '226-day Daily GMV Time-Series' },
      expected: { vi: 'Cộng khớp SSOT', en: 'Exact SSOT sum' },
      actual: { vi: 'Khớp chính xác 14,84 tỷ VNĐ (14.842.597.762 đ)', en: 'Exact match: 14.84B VND' },
      status: 'pass',
      statusLabel: { vi: 'Khớp SSOT', en: 'SSOT Valid' },
      note: { vi: 'Xác minh toàn vẹn chuỗi thời gian không bị thất thoát ngày nào trong 226 ngày liên tục.', en: 'Confirms complete time-series integrity with zero missing days across 226 continuous days.' },
    },
  ];

  const pipelineSteps: Stage1Payload['pipelineSteps'] = [
    {
      step: '1',
      title: { vi: 'Hệ thống nguồn (Source)', en: 'Source Systems' },
      detail: { vi: '9 bảng dữ liệu xuất từ nền tảng (nạp qua MySQL & script tự động).', en: '9 raw tables exported from platform (ingested into MySQL with automated ETL).' },
      iconName: 'fileSpreadsheet',
      badge: `${tableRows.length} Bảng`,
    },
    {
      step: '2',
      title: { vi: 'Nạp & Kiểm tra (Ingestion)', en: 'Ingestion & Validation' },
      detail: { vi: 'Script Python chuẩn hóa snake_case, kiểm tra kiểu dữ liệu và chạy test đối chiếu tự động.', en: 'Python script standardizes schemas, casts types, and runs automated checks.' },
      iconName: 'database',
      badge: 'Python ETL',
    },
    {
      step: '3',
      title: { vi: 'Kho dữ liệu 3 lớp (Warehouse)', en: '3-Tier Warehouse' },
      detail: { vi: 'Mô hình hóa raw (gốc) → staging (làm sạch) → mart (tổng hợp daily, creator, session).', en: 'raw (audit) → staging (cleaned) → mart (daily/creator/session aggregates).' },
      iconName: 'layers',
      badge: 'raw / staging / mart',
    },
    {
      step: '4',
      title: { vi: 'Phân tích SQL (5-Step Loop)', en: 'SQL Analytics Loop' },
      detail: { vi: 'Vòng lặp chuẩn: Khám phá → Lập hồ sơ → Làm sạch → Định hình → Phân tích chuyên sâu.', en: 'Standard loop: Explore → Profile → Clean → Shape → Analyze.' },
      iconName: 'terminalSquare',
      badge: '5 Loops',
    },
    {
      step: '5',
      title: { vi: 'Trình bày (Presentation)', en: 'BI & Reporting' },
      detail: { vi: 'Dashboard BI thương mại, kiểm định giả thuyết thống kê và khuyến nghị hành động.', en: 'Commercial BI dashboard, statistical hypothesis tests & actionable playbooks.' },
      iconName: 'layoutDashboard',
      badge: 'BI & Decision',
    },
  ];

  return {
    tableRows,
    totalRows,
    pipelineMeta: {
      generator: m.generator,
      generatedAt: m.generatedAt,
      tables: tableRows.length,
      rows: totalRows,
    },
    subQuestions,
    architectureLayers,
    dataFlowSteps,
    pipelineChecklist,
    dataGrains,
    reconciliationRules,
    pipelineSteps,
  };
}

export function buildStage2Data(): Stage2Payload {
  const priceBands = m.products.priceBands.map((b) => ({
    band: b.band,
    sku: b.skuSharePct,
    units: b.unitsSharePct,
    gmv: b.gmvSharePct,
    skus: b.skus,
  }));

  const paretoCurve = m.products.paretoCurve.map((p) => ({ sku: p.skuPct, gmv: p.gmvPct }));

  const CATEGORY_SHORT: Record<string, string> = {
    'Sports & Outdoor': 'Sports & Outdoor',
    'Womenswear & Underwear': 'Womenswear',
    'Fashion Accessories': 'Accessories',
    'Computers & Office Equipment': 'Computers',
    Other: 'Other',
    'Menswear & Underwear': 'Menswear',
  };

  const skuHealthByCategory = m.products.categories.map((c) => ({
    category: CATEGORY_SHORT[c.category] ?? c.category,
    withSales: c.skus - c.deadSkus,
    dead: c.deadSkus,
  }));

  const productFacts = {
    skus: m.products.skus.value,
    withSales: m.products.skusWithSales.value,
    dead: m.products.deadSkus.value,
    deadPct: m.products.deadSkuPct.value,
    skusFor80: m.products.skusFor80PctGmv,
    skusFor80Pct: m.products.skusFor80PctGmvPct,
    gini: m.products.giniGmv,
  };

  const reconciliationChecks = kamiReconciliationData.reconciliationRules.map((r) => ({
    code: r.ruleCode,
    status: r.status,
    title: r.title,
  }));

  const dataModelTables: Stage2Payload['dataModelTables'] = [
    {
      name: 'Store Detail (Daily Overview)',
      window: { vi: '226 ngày liên tục', en: '226 continuous days' },
      rows: 226,
      grain: { vi: 'Ngày', en: 'Daily' },
      joinKey: 'record_date',
      desc: { vi: 'Dữ liệu tổng hợp theo ngày toàn gian hàng (T3–T10/2026)', en: 'Store-level daily performance (Mar-Oct 2026)' },
      tag: 'SSOT',
    },
    {
      name: 'Shop Products (Catalog)',
      window: { vi: 'Toàn shop', en: 'Catalog-wide' },
      rows: 339,
      grain: { vi: 'Sản phẩm', en: 'Product SKU' },
      joinKey: 'product_name',
      desc: { vi: 'Danh mục 339 SKU, giá niêm yết và doanh số tích lũy', en: 'Product catalog of 339 SKUs & cumulative sales' },
      tag: 'Catalog',
    },
    {
      name: 'Affiliate KOL Network',
      window: { vi: 'Hợp nhất 2 kỳ', en: '2-Snapshot Merged' },
      rows: 6086,
      grain: { vi: 'Creator', en: 'Creator' },
      joinKey: 'creator_id',
      desc: { vi: '6.086 Creator liên kết tiếp thị & hoa hồng', en: '6,086 Affiliate creators & commission tiers' },
      tag: 'Affiliate',
    },
    {
      name: 'Goods for Sale (Multi-Snapshot)',
      window: { vi: 'Kỳ Hè + Kỳ Thu', en: 'Summer + Autumn Snapshots' },
      rows: 787,
      grain: { vi: 'SP × Gian hàng × Kỳ', en: 'Product × Shop × Period' },
      joinKey: { vi: 'Tên SP + Shop + Kỳ', en: 'Product + Shop + Period' },
      desc: { vi: 'Phân vùng 2 kỳ đo lường 90 ngày (392 hè + 395 thu)', en: '2-snapshot partitioning (392 summer + 395 autumn)' },
      tag: 'Snapshot',
    },
    {
      name: 'Creator Live Sessions',
      window: { vi: 'Hợp nhất 2 kỳ', en: '2-Snapshot Merged' },
      rows: 600,
      grain: { vi: 'Phiên Live chính chủ', en: 'Own LIVE Session' },
      joinKey: 'start_time',
      desc: { vi: '600 ca phát sóng trực tiếp từ tài khoản chính', en: '600 Direct live sessions from main account' },
      tag: 'Brand LIVE',
    },
    {
      name: 'Creator Videos',
      window: { vi: 'Hợp nhất 2 kỳ', en: '2-Snapshot Merged' },
      rows: 276,
      grain: { vi: 'Video chính chủ', en: 'Own Video' },
      joinKey: 'publish_time',
      desc: { vi: '276 video ngắn xuất bản từ kênh chính chủ', en: '276 Short-form videos published by brand channel' },
      tag: 'Brand Video',
    },
    {
      name: 'Affiliate Shoppable Videos',
      window: { vi: 'Hợp nhất 2 kỳ', en: '2-Snapshot Merged' },
      rows: 4796,
      grain: { vi: 'Video gắn link', en: 'Shoppable Video' },
      joinKey: 'title + publisher',
      desc: { vi: '4.796 video từ mạng lưới creator toàn thị trường', en: '4,796 Shoppable videos across affiliate network' },
      tag: 'Affiliate Video',
    },
    {
      name: 'Shop-wide Affiliate LIVE',
      window: { vi: 'Hợp nhất 2 kỳ', en: '2-Snapshot Merged' },
      rows: 8355,
      grain: { vi: 'Phiên Live toàn shop', en: 'Shop LIVE Session' },
      joinKey: 'session_id + start_time',
      desc: { vi: '8.355 phiên live có gắn giỏ hàng sản phẩm shop', en: '8,355 LIVE sessions tagging store products' },
      tag: 'Shop LIVE',
    },
    {
      name: 'Livestream Featured Products',
      window: { vi: 'Live Details', en: 'Live Product List' },
      rows: 103,
      grain: { vi: 'SP trong phiên LIVE', en: 'Live Product Item' },
      joinKey: 'product_name + session',
      desc: { vi: '103 lượt sản phẩm gắn ghim trực tiếp trong các ca LIVE', en: '103 featured items pinned during live broadcasts' },
      tag: 'Live Goods',
    },
  ];

  const profilingFindings: Stage2Payload['profilingFindings'] = [
    {
      entity: 'Store Detail (226d)',
      badge: { vi: '226/226 ngày hợp lệ', en: '226/226 days valid' },
      tone: 'cyan',
      finding: {
        vi: 'Đủ 226/226 ngày liên tục, không ngày nào 0 đơn (thấp nhất 49 sp/ngày). Tổng khớp: 100.669 sản phẩm, 14.842.597.762 VNĐ. Bao phủ trọn vẹn từ 09/03/2026 đến 20/10/2026.',
        en: 'Full 226/226 continuous days recorded, zero zero-order days (minimum 49 units/day). Total exact match: 100,669 units, 14,842,597,762 VND. Continuous coverage from Mar 09, 2026 to Oct 20, 2026.',
      },
      stat: '14,84 Tỷ đ · 100.669 sp',
      detail: { vi: 'Mốc chuỗi thời gian nền tảng (SSOT)', en: 'Foundational time-series benchmark' },
    },
    {
      entity: 'Product Data (90d)',
      badge: { vi: '134/331 SP có GMV', en: '134/331 active SKUs' },
      tone: 'amber',
      finding: {
        vi: '331 dòng nhưng chỉ 134 sản phẩm có GMV > 0 (197 dòng bằng 0). 3 tên sản phẩm bị trùng lặp. 15 giá ở dạng khoảng ("249.192 ₫ - 271.949 ₫"). Top 5 sản phẩm chiếm 44,9% GMV của 134 sản phẩm đang bán.',
        en: '331 rows but only 134 SKUs have GMV > 0 (197 rows zero sales). 3 duplicate titles. 15 price ranges ("249,192 ₫ - 271,949 ₫"). Top 5 SKUs generate 44.9% of active catalog GMV.',
      },
      stat: 'Top 5 = 44,9% GMV',
      detail: { vi: 'Cần tách dải giá min-max & gán cờ tồn kho chết', en: 'Requires price unnesting & zero-sale flags' },
    },
    {
      entity: 'Creators Merged (90d)',
      badge: { vi: '292 creator ra đơn', en: '292 active creators' },
      tone: 'cyan',
      finding: {
        vi: 'Tổng khớp 31.599 sản phẩm / 4.734.186.743 VNĐ. Có 292 creator có doanh thu (gồm cả kênh chính chủ, tức 291/5.712 affiliate). 1 ID bị rỗng, 46 creator có số follower ≤ 0.',
        en: 'Exact match: 31,599 units / 4,734,186,743 VND. 292 creators produced revenue (including own brand channel, i.e., 291/5,712 affiliates). 1 blank ID, 46 creators with followers ≤ 0.',
      },
      stat: '291 affiliate active / 5.712',
      detail: { vi: 'Tỷ lệ kích hoạt affiliate chỉ đạt 5,1%', en: 'Affiliate activation rate is only 5.1%' },
    },
    {
      entity: 'Goods for Sale (90d)',
      badge: { vi: '278 dòng Kami Ely', en: '278 Kami Ely rows' },
      tone: 'amber',
      finding: {
        vi: '394 dòng đến từ 4 gian hàng: Kami Ely (278 dòng, gánh toàn bộ 20.027 sản phẩm), còn 3 gian hàng Havi Bikini, KamiBiki, KamiBiii (116 dòng) đều có 0 sản phẩm. GMV lưu dạng chữ làm tròn ("500,2Tr ₫").',
        en: '394 rows across 4 storefronts: Kami Ely (278 rows, holding all 20,027 units), while Havi Bikini, KamiBiki, KamiBiii (116 rows) record 0 units. GMV stored as rounded text ("500.2Tr ₫").',
      },
      stat: '20.027 sp trên 1 gian hàng',
      detail: { vi: '3 gian phụ không phát sinh doanh số thực', en: '3 satellite storefronts have 0 sales' },
    },
    {
      entity: 'Live Sessions (180d)',
      badge: { vi: '69,2% ca 0 GMV', en: '69.2% zero-GMV sessions' },
      tone: 'rose',
      finding: {
        vi: '69,2% phiên có GMV = 0 (kênh chính chủ 3,6%, affiliate 73,9%). 15 phiên dài hơn 24 giờ (dài nhất 269 giờ - treo máy), 69 phiên thời lượng bằng 0, 1.012 phiên bị thiếu tiêu đề.',
        en: '69.2% of sessions have zero GMV (brand channel 3.6%, affiliate network 73.9%). 15 sessions exceeded 24 hours (longest 269h - idle live stream), 69 zero-duration sessions, 1,012 missing titles.',
      },
      stat: '15 ca outlier > 24 giờ',
      detail: { vi: 'Cần loại bỏ ca >24h khi tính thời lượng trung bình', en: 'Exclude >24h idle sessions for duration averages' },
    },
    {
      entity: 'Shoppable Videos (180d)',
      badge: { vi: '21,7% video ra đơn', en: '21.7% video conversion' },
      tone: 'rose',
      finding: {
        vi: '4 dòng trùng khóa (creator, ngày, tiêu đề). Mốc giờ bị lẫn giữa UTC+7 và UTC+8. Lượt xem lưu dạng chữ ("1.6k", "1.2m" ở 1.420 dòng). Cột Likes, Units sold, GMV lưu theo cửa sổ lăn 90 ngày.',
        en: '4 duplicate key rows (creator, date, title). Mixed timestamps between UTC+7 and UTC+8. Views stored as strings ("1.6k", "1.2m" across 1,420 rows). Rolling window fields.',
      },
      stat: 'Lẫn UTC+7 & UTC+8',
      detail: { vi: 'Chuyển đổi chuỗi chữ số & chuẩn hóa múi giờ', en: 'String-to-numeric parser & UTC+7 normalization' },
    },
  ];

  const crossReconciliations: Stage2Payload['crossReconciliations'] = [
    {
      test: { vi: 'Goods for Sale vs Creators Merged', en: 'Goods for Sale vs Creators Merged' },
      metric: '20.027 sp khớp tuyệt đối',
      detail: {
        vi: 'GMV: 3.026.020.300 đ so với 3.026.026.869 đ, lệch 6.569 đ do làm tròn chuỗi hiển thị. Quy chuẩn lấy Creators Merged làm mốc.',
        en: 'GMV: 3,026,020,300 VND vs 3,026,026,869 VND, 6,569 VND string rounding delta. Standardized on Creators Merged as truth.',
      },
      status: 'pass',
      statusLabel: { vi: 'Khớp 100% Sản lượng', en: 'Units Match 100%' },
    },
    {
      test: { vi: 'Số phiên Live: Store Detail (tổng ngày) vs Shop LIVE', en: 'Live Session Count: Store Detail daily sum vs Shop LIVE' },
      metric: '7.014 vs 7.046 phiên',
      detail: {
        vi: 'Chênh lệch 32 phiên (lệch 0,45%). Do cách định nghĩa ca Live vắt qua nửa đêm (cross-midnight) giữa báo cáo ngày và nhật ký phiên.',
        en: '32 sessions variance (0.45% diff). Caused by cross-midnight session attribution differences between daily rollup and session log.',
      },
      status: 'info',
      statusLabel: { vi: 'Lệch 0,45%', en: '0.45% diff' },
    },
    {
      test: { vi: 'Số video: Store vs Shoppable vs Dashboard', en: 'Video Counts: Store vs Shoppable vs Dashboard' },
      metric: '2.443 vs 4.417 vs 4,8k video',
      detail: {
        vi: 'Ba nguồn cho 3 con số khác biệt do 3 định nghĩa kỹ thuật khác nhau: video có phát sinh đơn trong ngày, video đã từng đăng và video đang hoạt động trên hệ thống.',
        en: 'Three disparate figures reflecting 3 differing platform criteria: active daily converting videos, total uploaded catalog, and live published assets.',
      },
      status: 'warn',
      statusLabel: { vi: 'Khác định nghĩa', en: 'Def Split' },
    },
    {
      test: { vi: 'Creator ID trong Shop LIVE không có trong Creators Merged', en: 'Shop LIVE Creator IDs missing from Creators Merged' },
      metric: '4/251 ID mồ côi',
      detail: {
        vi: '4 creator có phát sóng trực tiếp nhưng không xuất hiện trong bảng danh sách 90 ngày (do phiên nằm ngoài cửa sổ 90 ngày hoặc tài khoản đã xóa). Đã gắn cờ is_orphan.',
        en: '4 creators streamed live but are absent from the 90-day creators export (streamed outside 90d window or deactivated handle). Flagged via is_orphan.',
      },
      status: 'warn',
      statusLabel: { vi: 'Gắn cờ mồ côi', en: 'Flagged Orphan' },
    },
  ];

  const cleaningRules: Stage2Payload['cleaningRules'] = [
    {
      ruleNumber: 1,
      title: { vi: 'Quy đổi chuỗi tiền tệ tiếng Việt và viết tắt k / m về số nguyên chuẩn', en: 'Parse localized currency strings and k/m abbreviations to integers' },
      severity: 'critical',
      targetTable: 'stg_goods_for_sale, stg_shoppable_video',
      rawIssue: { vi: 'Dữ liệu thô chứa chuỗi "500,2Tr ₫", "1,2k", "3,5m" khiến SQL không thể tính toán SUM/AVG', en: 'Raw strings like "500.2Tr VND", "1.2k" break standard SQL aggregations' },
      transformLogic: `CASE 
  WHEN col LIKE '%Tr%' THEN CAST(REPLACE(REPLACE(REPLACE(col, 'Tr', ''), '₫', ''), ',', '.') AS REAL) * 1000000
  WHEN col LIKE '%k%' THEN CAST(REPLACE(col, 'k', '') AS REAL) * 1000
  ELSE CAST(REPLACE(REPLACE(col, '₫', ''), '.', '') AS INTEGER)
END`,
      impact: { vi: 'Cứu 1.420 dòng dữ liệu view và khôi phục 3,026 tỷ đồng GMV về dạng số chuẩn', en: 'Rescued 1,420 view records and restored 3.026B VND GMV to exact numeric form' },
    },
    {
      ruleNumber: 2,
      title: { vi: 'Xử lý dải giá sản phẩm (Price Range Unnesting)', en: 'Unnest Product Price Ranges into Min, Max, and Midpoint' },
      severity: 'high',
      targetTable: 'stg_product_data',
      rawIssue: { vi: '15 sản phẩm có giá ở dạng khoảng "249.192 ₫ - 271.949 ₫" do có nhiều phân loại (SKU variants)', en: '15 SKUs carry ranged prices like "249,192 ₫ - 271,949 ₫" due to multi-variant options' },
      transformLogic: `price_min = CAST(TRIM(SUBSTR(price, 1, INSTR(price, '-') - 1)) AS INTEGER),
price_max = CAST(TRIM(SUBSTR(price, INSTR(price, '-') + 1)) AS INTEGER),
price_mid = (price_min + price_max) / 2`,
      impact: { vi: 'Cho phép phân nhóm dải giá (price bands) chính xác 100% cho toàn bộ 331 SKU', en: 'Ensures 100% accurate price-band segmentation across all 331 catalog SKUs' },
    },
    {
      ruleNumber: 3,
      title: { vi: 'Chuẩn hóa định dạng thời gian và bù lệch múi giờ +13h', en: 'Timestamp Normalization and +13h Timezone Alignment' },
      severity: 'critical',
      targetTable: 'stg_creator_live, stg_shop_live',
      rawIssue: { vi: 'Mốc giờ xuất khẩu lưu theo UTC (PST/CST lệch so với giờ Việt Nam GMT+7)', en: 'Raw timestamps stored in UTC / server time causing cross-day boundary splits in GMT+7' },
      transformLogic: `DATETIME(start_time, '+13 hours') AS start_time_vn`,
      impact: { vi: 'Giải quyết triệt để sự chênh lệch 475 vs 470 phiên giữa báo cáo ngày và nhật ký', en: 'Mathematically resolves the 475 vs 470 session discrepancy down to the exact day' },
    },
    {
      ruleNumber: 4,
      title: { vi: 'Lọc phiên LIVE ngoại lai treo máy (> 24 giờ)', en: 'Filter Unattended Outlier Streams Exceeding 24 Hours' },
      severity: 'high',
      targetTable: 'stg_shop_live',
      rawIssue: { vi: '15 phiên live có thời lượng > 24h (dài nhất 269h) làm méo mó nghiêm trọng thời lượng trung bình', en: '15 sessions longer than 24h (up to 269h) heavily distort average live duration' },
      transformLogic: `WHERE duration_seconds <= 86400 AND duration_seconds > 0`,
      impact: { vi: 'Thời lượng live trung bình đưa về mức phản ánh đúng thực tế 1,48 giờ/phiên', en: 'Normalizes live stream duration to a realistic mean of 1.48 hours per session' },
    },
    {
      ruleNumber: 5,
      title: { vi: 'Gán cờ dữ liệu mồ côi (Orphan Records Flagging)', en: 'Orphan Key Tagging for Outer-Window Entities' },
      severity: 'medium',
      targetTable: 'clean_shop_live, clean_shoppable_videos',
      rawIssue: { vi: '4 creator trong Shop LIVE không tồn tại trong danh sách Creators Merged 90 ngày', en: '4 creator IDs in Shop LIVE have no corresponding master profile in the 90-day creators export' },
      transformLogic: `CASE WHEN c.creator_id IS NULL THEN 1 ELSE 0 END AS is_orphan`,
      impact: { vi: 'Tránh lỗi INNER JOIN làm rơi rụng mất 15,2 triệu đồng GMV phát sinh từ creator vãng lai', en: 'Prevents losing 15.2M VND GMV from guest creators in strict relational joins' },
    },
    {
      ruleNumber: 6,
      title: { vi: 'Bóc tách và gán nhãn gian hàng chính Kami Ely', en: 'Isolate and Label Primary Kami Ely Storefront' },
      severity: 'high',
      targetTable: 'stg_goods_for_sale',
      rawIssue: { vi: '394 dòng chứa 4 gian hàng khác nhau nhưng 3 gian vệ tinh đều có doanh số bằng 0', en: '394 rows include 4 storefronts, but 3 satellite stores contribute 0 units' },
      transformLogic: `WHERE shop_name = 'Kami Ely' AND units_sold > 0`,
      impact: { vi: 'Tập trung tuyệt đối vào 278 dòng có giá trị kinh doanh thực, loại bỏ nhiễu', en: 'Focuses analysis strictly on the 278 revenue-generating rows, eliminating noise' },
    },
    {
      ruleNumber: 7,
      title: { vi: 'Khử trùng lặp khóa đa thành phần (Deduplication via SHA-256)', en: 'Composite Key Deduplication via SHA-256 Row Hashing' },
      severity: 'medium',
      targetTable: 'stg_shoppable_video',
      rawIssue: { vi: '4 dòng trùng lặp hoàn toàn về nội dung và mốc thời gian do xuất file nhiều đợt', en: '4 exact duplicate records introduced by overlapping platform export windows' },
      transformLogic: `ROW_NUMBER() OVER (PARTITION BY creator_id, title, publish_time ORDER BY id) = 1`,
      impact: { vi: 'Bảo đảm tính duy nhất tuyệt đối cho kho dữ liệu phân tích', en: 'Guarantees absolute entity uniqueness across analytical warehouse tables' },
    },
  ];

  const legacyCorrections: Stage2Payload['legacyCorrections'] = [
    {
      caseNumber: 'Case 1',
      title: { vi: 'Sai lệch tính tốc độ tăng trưởng T3→T4 (98,5% vs 158,9%)', en: 'March-to-April Growth Rate Distortion (98.5% vs 158.9%)' },
      flawedClaim: {
        vi: 'Báo cáo cũ tuyên bố doanh thu tháng 4 tăng trưởng +158,9% so với tháng 3 (tính thô: 2,46 tỷ / 0,95 tỷ - 1 = 158,9%).',
        en: 'Legacy report claimed April GMV soared +158.9% over March (raw math: 2.46B / 0.95B - 1 = 158.9%).',
      },
      empiricalProof: {
        vi: 'Tháng 3 trong tệp nguồn chỉ bắt đầu ghi nhận từ ngày 09/03 (chỉ có 23 ngày), trong khi tháng 4 có đủ 30 ngày. So sánh tổng thô là ngụy biện về mẫu (sampling fallacy). Tính theo trung bình ngày: T3 đạt 41,3 triệu/ngày, T4 đạt 82,0 triệu/ngày.',
        en: 'March data only began on March 09 (23 days recorded), whereas April had full 30 days. Comparing raw sums is a sampling fallacy. Daily average GMV was 41.3M/day in Mar vs 82.0M/day in Apr.',
      },
      correctedFact: {
        vi: 'Tốc độ tăng trưởng thực tế theo ngày (GMV/ngày) là +98,5%, chứ không phải +158,9%. Báo cáo cũ đã thổi phồng mức tăng thêm 60,4 điểm phần trăm!',
        en: 'Real daily normalized growth was +98.5%, not +158.9%. Legacy reporting artificially inflated growth by 60.4 percentage points!',
      },
    },
    {
      caseNumber: 'Case 2',
      title: { vi: 'Ngụy biện về KOC siêu nhỏ (<5k follower là nòng cốt)', en: 'The Micro-KOC Fallacy (<5k Followers as Backbone)' },
      flawedClaim: {
        vi: 'Báo cáo cũ nhận định nhóm KOC dưới 5.000 follower là "lực lượng nòng cốt" mang lại nhiều doanh thu nhất vì số lượng áp đảo (5.148 KOC, chiếm 90,1%).',
        en: 'Legacy deck declared micro-KOCs (<5k followers) as the "core growth driver" due to their sheer volume (5,148 KOCs, 90.1% of network).',
      },
      empiricalProof: {
        vi: 'Tỷ lệ kích hoạt đơn (activation rate) của nhóm <5k chỉ đạt 3,5% (178/5.148 KOC có đơn). Doanh thu trung bình mỗi KOC chỉ đạt 182 nghìn đồng! Trong khi đó, nhóm 100k-500k có tỷ lệ kích hoạt 50% và tạo ra hơn 1,35 tỷ đồng doanh thu.',
        en: 'Activation rate for <5k creators was only 3.5% (178/5,148 sold anything). Average GMV per micro-KOC was a negligible 182k VND! Meanwhile, the 100k-500k tier had a 50% activation rate and drove over 1.35B VND.',
      },
      correctedFact: {
        vi: 'Nhóm <5k follower là cái bẫy quy mô (vanity metric). Đội ngũ đã lãng phí nguồn lực gửi mẫu và duyệt affiliate cho 4.970 KOC không bán được đơn nào!',
        en: 'The <5k tier is a vanity trap. Massive resources were wasted approving and sampling 4,970 dead affiliates who generated zero revenue.',
      },
    },
  ];

  return {
    dataModelTables,
    profilingFindings,
    crossReconciliations,
    reconciliationChecks,
    cleaningRules,
    legacyCorrections,
    priceBands,
    paretoCurve,
    skuHealthByCategory,
    productFacts,
  };
}

export function buildStage3Data(): Stage3Payload {
  const daily = m.store.daily;
  const gmvSeries = daily.map((d) => d.gmv);
  const dailyMean = mean(gmvSeries);
  const dailyStd = sampleStd(gmvSeries);

  let cum = 0;
  const dailySeries = daily.map((d, i) => {
    cum += d.gmv;
    const ma7 = i >= 6 ? mean(gmvSeries.slice(i - 6, i + 1)) : null;
    return {
      date: d.date,
      label: ddmm(d.date),
      gmv: toM(d.gmv),
      ma7: ma7 === null ? null : toM(ma7),
      cumulativeB: Math.round((cum / 1e9) * 100) / 100,
    };
  });

  // Chuỗi theo dõi theo tuần (33 tuần) tổng hợp từ 226 ngày liên tục (09/03 – 20/10/2026)
  const weeklyMap = new Map<string, {
    week: number;
    mon: string;
    label: string;
    gmv: number;
    lives: number;
    kocs: number[];
  }>();

  for (const d of daily) {
    const dt = new Date(d.date + 'T00:00:00Z');
    const day = dt.getUTCDay();
    const diff = (day === 0 ? -6 : 1 - day);
    const monDt = new Date(dt);
    monDt.setUTCDate(dt.getUTCDate() + diff);
    const monStr = monDt.toISOString().slice(0, 10);

    const target = new Date(dt);
    const targetDay = target.getUTCDay() || 7;
    target.setUTCDate(target.getUTCDate() + 4 - targetDay);
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

    const key = `W${week}`;
    if (!weeklyMap.has(key)) {
      weeklyMap.set(key, {
        week,
        mon: monStr,
        label: `W${week} (${monStr.slice(8, 10)}/${monStr.slice(5, 7)})`,
        gmv: 0,
        lives: 0,
        kocs: [],
      });
    }
    const item = weeklyMap.get(key)!;
    item.gmv += d.gmv;
    item.lives += d.lives;
    item.kocs.push(d.koc);
  }

  const weeklySeries = Array.from(weeklyMap.values()).map((w) => {
    const gmvM = Math.round((w.gmv / 1e6) * 10) / 10;
    const avgKoc = Math.round((w.kocs.reduce((a, b) => a + b, 0) / w.kocs.length) * 10) / 10;
    const gmvPerLive = w.lives > 0 ? Math.round(w.gmv / w.lives / 1e3) : 0;
    return {
      label: w.label,
      gmv: gmvM,
      lives: w.lives,
      koc: avgKoc,
      gmvPerLive,
    };
  });

  const monthlyTable = [
    { ym: '2026-03', label: 'T3', days: 23, isPartial: true, gmv: 949812912, share: 6.4, gmvPerDay: 41296214, units: 8039, aov: 118151, momRaw: null, momDay: null },
    { ym: '2026-04', label: 'T4', days: 30, isPartial: false, gmv: 2459105727, share: 16.6, gmvPerDay: 81970191, units: 17358, aov: 141670, momRaw: 158.9, momDay: 98.5 },
    { ym: '2026-05', label: 'T5', days: 31, isPartial: false, gmv: 2747315221, share: 18.5, gmvPerDay: 88623072, units: 17267, aov: 159108, momRaw: 11.7, momDay: 8.1 },
    { ym: '2026-06', label: 'T6 (Đỉnh)', days: 30, isPartial: false, gmv: 3772428748, share: 25.4, gmvPerDay: 125747625, units: 22096, aov: 170729, momRaw: 37.3, momDay: 41.9 },
    { ym: '2026-07', label: 'T7', days: 31, isPartial: false, gmv: 2125850482, share: 14.3, gmvPerDay: 68575822, units: 13358, aov: 159144, momRaw: -43.6, momDay: -45.5 },
    { ym: '2026-08', label: 'T8', days: 31, isPartial: false, gmv: 636689605, share: 4.3, gmvPerDay: 20538374, units: 6622, aov: 96148, momRaw: -70.1, momDay: -70.1 },
    { ym: '2026-09', label: 'T9', days: 30, isPartial: false, gmv: 701005244, share: 4.7, gmvPerDay: 23366841, units: 5841, aov: 120015, momRaw: 10.1, momDay: 13.8 },
    { ym: '2026-10', label: 'T10', days: 20, isPartial: true, gmv: 1450389823, share: 9.8, gmvPerDay: 72519491, units: 10088, aov: 143774, momRaw: 106.9, momDay: 210.4 },
  ];

  // Tính chỉ số mùa vụ theo thứ trong tuần (DOW Seasonality) từ 226 ngày liên tục
  const DOW_NAMES = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const DOW_ORDER = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  const overallDailyMean = gmvSeries.reduce((s, x) => s + x, 0) / (daily.length || 1);

  const dowBuckets: Record<string, { all: number[]; growth: number[]; peak: number[]; decline: number[] }> = {};
  for (const name of DOW_ORDER) {
    dowBuckets[name] = { all: [], growth: [], peak: [], decline: [] };
  }

  for (const d of daily) {
    const dt = new Date(d.date + 'T00:00:00Z');
    const dowName = DOW_NAMES[dt.getUTCDay()];
    dowBuckets[dowName].all.push(d.gmv);

    const ym = d.date.slice(0, 7);
    if (ym >= '2026-03' && ym <= '2026-05') dowBuckets[dowName].growth.push(d.gmv);
    else if (ym === '2026-06') dowBuckets[dowName].peak.push(d.gmv);
    else if (ym >= '2026-07' && ym <= '2026-09') dowBuckets[dowName].decline.push(d.gmv);
  }

  const dowSeasonality = DOW_ORDER.map((name) => {
    const b = dowBuckets[name];
    const meanVal = b.all.length ? b.all.reduce((s, x) => s + x, 0) / b.all.length : 0;
    const medianVal = percentile(b.all, 0.5);
    const index = overallDailyMean > 0 ? (meanVal / overallDailyMean) * 100 : 100;
    return {
      dow: name,
      mean: Math.round((meanVal / 1e6) * 10) / 10,
      median: Math.round((medianVal / 1e6) * 10) / 10,
      index: Math.round(index * 10) / 10,
      growthMed: Math.round((percentile(b.growth, 0.5) / 1e6) * 10) / 10,
      peakMed: Math.round((percentile(b.peak, 0.5) / 1e6) * 10) / 10,
      declineMed: Math.round((percentile(b.decline, 0.5) / 1e6) * 10) / 10,
    };
  });

  const monthlySeries = m.store.monthly.map((x) => ({
    month: x.month,
    label: `T${Number(x.month.slice(5, 7))}`,
    gmvPerDay: toM(x.gmvPerDay),
    momPerDayPct: x.momPerDayPct,
    isPartial: x.isPartial,
    days: x.days,
  }));

  const DOW_EN: Record<string, string> = { T2: 'Mon', T3: 'Tue', T4: 'Wed', T5: 'Thu', T6: 'Fri', T7: 'Sat', CN: 'Sun' };
  const dowSeries = m.store.dayOfWeekMedianGmv.map((d) => ({
    day: d.day,
    dayEn: DOW_EN[d.day] ?? d.day,
    medianGmv: toM(d.medianGmv),
  }));

  const storeFacts = {
    gmv: m.store.totals.gmv.value,
    avgPerDay: m.store.totals.avgGmvPerDay.value,
    peakMonth: m.store.peakMonth,
    peakDay: m.store.peakDay,
    dropFromPeakPct: m.store.declineFromPeak.gmvDropPct,
    sparseDays: daily.filter((d) => d.gmv === 0).length,
    days: daily.length,
  };

  const lagData = [
    { lag: 'Lag 0d', rLives: 0.412, rKoc: 0.326, desc: { vi: 'Cùng ngày', en: 'Same day' } },
    { lag: 'Lag 1d', rLives: 0.386, rKoc: 0.350, desc: { vi: 'GMV sau marketing 1 ngày', en: 'GMV lags marketing 1 day' } },
    { lag: 'Lag 2d', rLives: 0.415, rKoc: 0.357, desc: { vi: 'Đỉnh tương quan ngắn', en: 'Short-term peak' } },
    { lag: 'Lag 3d', rLives: 0.409, rKoc: 0.342, desc: { vi: 'Dư chấn ngày thứ 3', en: 'Day 3 residual' } },
    { lag: 'Lag 4d', rLives: 0.405, rKoc: 0.335, desc: { vi: 'Giảm dần', en: 'Diminishing' } },
    { lag: 'Lag 5d', rLives: 0.400, rKoc: 0.333, desc: { vi: 'Duy trì ổn định', en: 'Stable' } },
    { lag: 'Lag 6d', rLives: 0.407, rKoc: 0.363, desc: { vi: 'Chu kỳ tuần hoàn', en: 'Weekly cycle' } },
    { lag: 'Lag 7d', rLives: 0.446, rKoc: 0.381, desc: { vi: 'Tương quan chu kỳ tuần', en: 'Full 7-day cyclical peak' } },
  ];

  return {
    dailySeries,
    weeklySeries,
    monthlyTable,
    dowSeasonality,
    monthlySeries,
    dowSeries,
    lagData,
    storeFacts,
    dailyMean,
    dailyStd,
  };
}

export function buildStage4Data(): Stage4Payload {
  const creatorTiers = m.creators.followerTiers.map((t, i) => ({
    tier: t.tier,
    creators: t.creators,
    creatorsPct: t.creatorsSharePct,
    activationPct: t.activationRatePct,
    gmvPct: t.gmvSharePct,
    gmvPctExTop1: m.creators.followerTiersExGirlStyle[i]?.gmvSharePct ?? null,
  }));

  let cum1 = 0;
  const affiliateTop10 = m.shopLive.affiliate.top10.map((c, i) => {
    cum1 += c.sharePct;
    return {
      rank: `#${i + 1}`,
      name: c.name,
      sharePct: c.sharePct,
      cumulativePct: Math.round(cum1 * 100) / 100,
      sessions: c.sessions,
    };
  });

  const aff = m.shopLive.affiliate;
  const exTop1 = aff.top10.slice(1);
  const totEx = aff.gmv - aff.top10[0].gmv;
  let cumEx = 0;
  const affiliateTopExGirlStyle = exTop1.map((c, i) => {
    const shareEx = (c.gmv / totEx) * 100;
    cumEx += shareEx;
    return {
      rank: `#${i + 1}`,
      name: c.name,
      sharePct: Math.round(shareEx * 100) / 100,
      cumulativePct: Math.round(cumEx * 100) / 100,
      sessions: c.sessions,
    };
  });

  const topCreatorMonthly = m.shopLive.girlStyle.monthly.map((x: any) => {
    const gmvM = toM(x.gmv);
    const liveHours = Number(x.liveHours ?? 0);
    const gmvPerHourM = liveHours > 0 ? Math.round((gmvM / liveHours) * 100) / 100 : 0;
    return {
      month: x.month,
      label: `T${Number(x.month.slice(5, 7))}`,
      gmvM,
      sessions: x.sessions,
      liveHours,
      gmvPerHourM,
    };
  });

  const shopWideLiveMonthly = ((m.shopLive as any).monthly ?? []).map((x: any) => {
    const gmvM = toM(x.gmv);
    const liveHours = Number(x.liveHours ?? 0);
    const gmvPerHourM = liveHours > 0 ? Math.round((gmvM / liveHours) * 100) / 100 : 0;
    return {
      month: x.month,
      label: `T${Number(x.month.slice(5, 7))}`,
      gmvM,
      sessions: x.sessions,
      liveHours,
      gmvPerHourM,
    };
  });

  const cohortScaleData: Stage4Payload['cohortScaleData'] = [
    { ym: 'T3/2026', newCreators: 66, activeAppear: 66, activeSales: 16, note: { vi: 'Tháng mở màn (tính từ 09/03)', en: 'Opening cohort (from Mar 09)' } },
    { ym: 'T4/2026', newCreators: 80, activeAppear: 127, activeSales: 55, note: { vi: 'Đỉnh điểm tuyển mới & người xuất hiện', en: 'Peak recruitment & appearance month' } },
    { ym: 'T5/2026', newCreators: 37, activeAppear: 104, activeSales: 54, note: { vi: 'Tuyển mới giảm 54% so với T4', en: 'New recruitment fell 54% vs Apr' } },
    { ym: 'T6/2026', newCreators: 30, activeAppear: 95, activeSales: 61, note: { vi: 'Đỉnh người bán được hàng (61 creator)', en: 'Peak selling creators (61 active sellers)' } },
    { ym: 'T7/2026', newCreators: 14, activeAppear: 64, activeSales: 33, note: { vi: 'Quy mô hoạt động thu hẹp nhanh', en: 'Active base shrinking rapidly' } },
    { ym: 'T8/2026', newCreators: 18, activeAppear: 49, activeSales: 15, note: { vi: 'Chỉ còn 15 creator ra đơn', en: 'Only 15 active selling creators' } },
    { ym: 'T9/2026', newCreators: 5, activeAppear: 20, activeSales: 4, note: { vi: 'Bị cắt phải (chỉ 4 ngày đầu tháng)', en: 'Right-censored (only 4 days)' } },
  ];

  const retentionMatrix: Stage4Payload['retentionMatrix'] = [
    { cohort: 'T3/2026', size: 66, m0: { count: 66, pct: 100 }, m1: { count: 47, pct: 71.2 }, m2: { count: 31, pct: 47.0 }, m3: { count: 27, pct: 40.9 }, m4: { count: 17, pct: 25.8 }, m5: { count: 10, pct: 15.2 } },
    { cohort: 'T4/2026', size: 80, m0: { count: 80, pct: 100 }, m1: { count: 36, pct: 45.0 }, m2: { count: 20, pct: 25.0 }, m3: { count: 15, pct: 18.8 }, m4: { count: 6, pct: 7.5 }, m5: { count: 2, pct: 2.5, censored: true } },
    { cohort: 'T5/2026', size: 37, m0: { count: 37, pct: 100 }, m1: { count: 18, pct: 48.6 }, m2: { count: 8, pct: 21.6 }, m3: { count: 5, pct: 13.5 }, m4: { count: 1, pct: 2.7, censored: true }, m5: null },
    { cohort: 'T6/2026', size: 30, m0: { count: 30, pct: 100 }, m1: { count: 10, pct: 33.3 }, m2: { count: 6, pct: 20.0 }, m3: { count: 2, pct: 6.7, censored: true }, m4: null, m5: null },
    { cohort: 'T7/2026', size: 14, m0: { count: 14, pct: 100 }, m1: { count: 4, pct: 28.6 }, m2: { count: 1, pct: 7.1, censored: true }, m3: null, m4: null, m5: null },
    { cohort: 'T8/2026', size: 18, m0: { count: 18, pct: 100 }, m1: { count: 3, pct: 16.7, censored: true }, m2: null, m3: null, m4: null, m5: null },
  ];

  const cohortGmvData: Stage4Payload['cohortGmvData'] = [
    { cohort: 'T3/2026', withGs: 438.6, withoutGs: 438.6, size: 66, note: { vi: 'Chưa có Girl Style', en: 'Pre-Girl Style' } },
    { cohort: 'T4/2026', withGs: 224.4, withoutGs: 224.4, size: 80, note: { vi: 'Chưa có Girl Style', en: 'Pre-Girl Style' } },
    { cohort: 'T5/2026', withGs: 1463.1, withoutGs: 206.8, size: 37, note: { vi: 'Girl Style kéo 1,26 Tỷ đ (86%)!', en: 'Girl Style drives 1.26B VND (86%)!' } },
    { cohort: 'T6/2026', withGs: 109.4, withoutGs: 109.4, size: 30, note: { vi: 'Không có Girl Style', en: 'External KOCs only' } },
    { cohort: 'T7/2026', withGs: 3.1, withoutGs: 3.1, size: 14, note: { vi: 'Thoái trào hè', en: 'Late season contraction' } },
    { cohort: 'T8/2026', withGs: 0.14, withoutGs: 0.14, size: 18, note: { vi: 'Chỉ 143k đ', en: 'Only 143k VND' } },
  ];

  const creatorFacts = {
    registered: m.creators.registered.value,
    sellers: m.creators.sellers.value,
    activationPct: m.creators.activationRatePct.value,
    creatorsFor80: m.creators.creatorsFor80PctGmv,
    hhi: m.shopLive.affiliate.hhi,
    top1Pct: m.shopLive.affiliate.top1SharePct,
    top10Pct: m.shopLive.affiliate.top10SharePct,
  };

  return {
    cohortScaleData,
    creatorTiers,
    affiliateTop10,
    affiliateTopExGirlStyle,
    topCreatorMonthly,
    shopWideLiveMonthly,
    retentionMatrix,
    cohortGmvData,
    creatorFacts,
  };
}

export function buildStage5Data(): Stage5Payload {
  const funnels: Stage5Payload['funnels'] = {
    creator: {
      title: { vi: 'Creator', en: 'Creators' },
      steps: [
        { label: { vi: 'Đăng ký', en: 'Registered' }, value: m.creators.registered.value },
        { label: { vi: 'Có đơn', en: 'With orders' }, value: m.creators.sellers.value },
        { label: { vi: 'Tạo 80% GMV', en: 'Make 80% of GMV' }, value: m.creators.creatorsFor80PctGmv },
      ],
    },
    sku: {
      title: { vi: 'SKU', en: 'SKUs' },
      steps: [
        { label: { vi: 'Đang niêm yết', en: 'Listed' }, value: m.products.skus.value },
        { label: { vi: 'Có đơn', en: 'With sales' }, value: m.products.skusWithSales.value },
        { label: { vi: 'Tạo 80% GMV', en: 'Make 80% of GMV' }, value: m.products.skusFor80PctGmv },
      ],
    },
    video: {
      title: { vi: 'Video chính chủ', en: 'Own videos' },
      steps: [
        { label: { vi: 'Đã đăng', en: 'Posted' }, value: m.channel.video.videos.value },
        { label: { vi: 'Gắn sản phẩm', en: 'Shoppable' }, value: m.channel.video.shoppable.value },
        { label: { vi: 'Có đơn', en: 'With orders' }, value: m.channel.video.withOrders.value },
      ],
    },
    live: {
      title: { vi: 'LIVE chính chủ', en: 'Own LIVE' },
      steps: [
        { label: { vi: 'Phiên LIVE', en: 'Sessions' }, value: m.channel.live.sessions.value },
        { label: { vi: 'Có đơn', en: 'With orders' }, value: m.channel.live.sessionsWithOrders.value },
      ],
    },
  };

  const donutFunnels = {
    video: {
      title: { vi: 'Phễu Video chính chủ (Sequential LEFT JOIN)', en: 'Own Video Funnel (Sequential LEFT JOIN)' },
      subtitle: { vi: 'Tỷ lệ gắn giỏ hàng và phát sinh đơn trên 222 video chính chủ', en: 'Cart-linking & order conversion on 222 own videos' },
      badge: { vi: '222 Video', en: '222 Videos' },
      tone: 'cyan',
      total: m.channel.video.videos.value,
      centerVal: '45,5%',
      centerLabel: { vi: 'Có đơn', en: 'With orders' },
      segments: [
        { name: { vi: 'Có đơn hàng', en: 'With orders' }, value: m.channel.video.withOrders.value, color: COLORS.teal },
        { name: { vi: 'Gắn giỏ chưa đơn', en: 'Shoppable, 0 orders' }, value: m.channel.video.shoppable.value - m.channel.video.withOrders.value, color: COLORS.cyan },
        { name: { vi: 'Chưa gắn giỏ hàng', en: 'Not shoppable' }, value: m.channel.video.videos.value - m.channel.video.shoppable.value, color: COLORS.amber },
      ],
    },
    live: {
      title: { vi: 'Phễu LIVE chính chủ (Sequential LEFT JOIN)', en: 'Own LIVE Funnel (Sequential LEFT JOIN)' },
      subtitle: { vi: 'Tỷ lệ chuyển đổi phát sinh đơn trên 475 ca LIVE chính chủ', en: 'Order conversion rate on 475 own LIVE sessions' },
      badge: { vi: '475 Ca LIVE', en: '475 Sessions' },
      tone: 'cyan',
      total: m.channel.live.sessions.value,
      centerVal: '95,6%',
      centerLabel: { vi: 'Có đơn', en: 'With orders' },
      segments: [
        { name: { vi: 'Có đơn hàng', en: 'With orders' }, value: m.channel.live.sessionsWithOrders.value, color: COLORS.teal },
        { name: { vi: 'Chưa phát sinh đơn', en: 'Zero orders' }, value: m.channel.live.sessions.value - m.channel.live.sessionsWithOrders.value, color: COLORS.amber },
      ],
    },
    sku: {
      title: { vi: 'Phễu SKU sản phẩm (Sequential LEFT JOIN)', en: 'Product SKU Funnel (Sequential LEFT JOIN)' },
      subtitle: { vi: 'Tỷ lệ phát sinh đơn và tập trung 80% GMV trên 331 mã SKU niêm yết', en: 'Order conversion and Pareto 80% GMV on 331 listed SKUs' },
      badge: { vi: '331 SKU', en: '331 SKUs' },
      tone: 'amber',
      total: m.products.skus.value,
      centerVal: '40,5%',
      centerLabel: { vi: 'Có đơn', en: 'With sales' },
      segments: [
        { name: { vi: 'Tạo 80% GMV (Top P80)', en: 'Make 80% GMV (P80)' }, value: m.products.skusFor80PctGmv, color: COLORS.amber },
        { name: { vi: 'Có đơn thông thường', en: 'Other active SKUs' }, value: m.products.skusWithSales.value - m.products.skusFor80PctGmv, color: COLORS.cyan },
        { name: { vi: 'Chưa phát sinh đơn', en: 'Zero orders' }, value: m.products.skus.value - m.products.skusWithSales.value, color: '#94A3B8' },
      ],
    },
    creator: {
      title: { vi: 'Phễu Mạng lưới Creator (Sequential LEFT JOIN)', en: 'Creator Network Funnel (Sequential LEFT JOIN)' },
      subtitle: { vi: 'Tỷ lệ kích hoạt đơn và nòng cốt 80% GMV trong 5.713 Creator đăng ký', en: 'Order activation and Pareto 80% GMV in 5,713 Creators' },
      badge: { vi: '5.713 Creator', en: '5,713 Creators' },
      tone: 'amber',
      total: m.creators.registered.value,
      centerVal: '5,1%',
      centerLabel: { vi: 'Có đơn', en: 'With orders' },
      segments: [
        { name: { vi: 'Tạo 80% GMV (Top Creator)', en: 'Make 80% GMV (Top)' }, value: m.creators.creatorsFor80PctGmv, color: COLORS.amber },
        { name: { vi: 'Có đơn thông thường', en: 'Other active Creators' }, value: m.creators.sellers.value - m.creators.creatorsFor80PctGmv, color: COLORS.cyan },
        { name: { vi: 'Chưa phát sinh đơn', en: 'Zero orders' }, value: m.creators.registered.value - m.creators.sellers.value, color: '#94A3B8' },
      ],
    },
  };

  const liveDuration = m.channel.live.durationBuckets.map((b) => ({
    bucket: b.bucket,
    sessions: b.sessions,
    conversionPct: b.conversionPct,
    gmvPerHourM: Math.round((b.gmvPerHour / 1e6) * 100) / 100,
  }));

  const hyp = m.channel.hypothesis;
  const gpmCompare = {
    platform28d: { videoK: 135.0, liveK: 29.7 },
    recomputed180d: {
      videoK: Math.round(hyp.video.median / 100) / 10,
      liveK: Math.round(hyp.live.median / 100) / 10,
    },
    mannWhitneyP: hyp.mannWhitneyP,
    rankBiserial: hyp.rankBiserial,
    isSignificant: hyp.isSignificant,
    nVideo: hyp.video.n,
    nLive: hyp.live.n,
  };

  const monthlyOwnLiveFunnel: Stage5Payload['monthlyOwnLiveFunnel'] = [
    { ym: 'T3/2026', sessions: 52, orderRate: 90.4, avgViewers: 3385, unitsPer1k: 5.7, gmvPerView: 643, gmvM: 113.1 },
    { ym: 'T4/2026', sessions: 112, orderRate: 97.3, avgViewers: 8869, unitsPer1k: 6.3, gmvPerView: 846, gmvM: 840.8 },
    { ym: 'T5/2026', sessions: 92, orderRate: 100.0, avgViewers: 8703, unitsPer1k: 12.6, gmvPerView: 1810, gmvM: 1449.1 },
    { ym: 'T6/2026', sessions: 51, orderRate: 98.0, avgViewers: 15015, unitsPer1k: 34.0, gmvPerView: 4888, gmvM: 3742.7 },
    { ym: 'T7/2026', sessions: 77, orderRate: 92.2, avgViewers: 4971, unitsPer1k: 11.4, gmvPerView: 1729, gmvM: 661.8 },
    { ym: 'T8/2026', sessions: 85, orderRate: 95.3, avgViewers: 2004, unitsPer1k: 11.9, gmvPerView: 1266, gmvM: 215.6 },
    { ym: 'T9/2026', sessions: 80, orderRate: 90.0, avgViewers: 1870, unitsPer1k: 10.9, gmvPerView: 1262, gmvM: 188.8 },
    { ym: 'T10/2026', sessions: 51, orderRate: 86.3, avgViewers: 2069, unitsPer1k: 25.5, gmvPerView: 3608, gmvM: 380.8 },
  ];

  const adsComparisonCards = {
    overall: {
      title: { vi: '1. Toàn bộ mẫu (3.482 Ads vs 935 Organic)', en: '1. Full Sample (3,482 Ads vs 935 Organic)' },
      desc: { vi: 'Quảng cáo giúp tăng mạnh lượt xem và tỷ lệ có đơn, nhưng GMV trên 1.000 lượt xem (GPM) lại thấp hơn Organic.', en: 'Ads drastically boost views and conversion probability, but GMV per 1,000 views is lower than Organic.' },
      rows: [
        { metric: { vi: 'Số lượng video', en: 'Video Count' }, ads: '3.482', organic: '935', note: { vi: 'Ads chiếm 78,8% tổng video', en: 'Ads accounts for 78.8% of all videos' } },
        { metric: { vi: 'Tỷ lệ video có đơn', en: 'Positive Order Rate' }, ads: '26,2% (911)', organic: '5,2% (49)', note: { vi: 'Odds Ratio = 6,41 (p < 0,001, Fisher)', en: 'Odds Ratio = 6.41 (p < 0.001, Fisher)' }, highlight: true },
        { metric: { vi: 'Lượt xem trung vị', en: 'Median Views' }, ads: '609', organic: '154', note: { vi: 'Mann-Whitney U = 2,39M (p < 0,001)', en: 'Mann-Whitney U = 2.39M (p < 0.001)' } },
        { metric: { vi: 'Lượt xem trung bình', en: 'Mean Views' }, ads: '8.303', organic: '1.522', note: { vi: 'Gấp 5,5 lần Organic', en: '5.5x higher than Organic' } },
        { metric: { vi: 'Tổng GMV (VND)', en: 'Total GMV (VND)' }, ads: '2,06 Tỷ đ', organic: '115,1 Tr đ', note: { vi: 'Ads chiếm 94,7% GMV video giỏ hàng', en: 'Ads generates 94.7% of shoppable GMV' } },
        { metric: { vi: 'GMV / 1.000 lượt xem (GPM)', en: 'GMV / 1,000 Views (GPM)' }, ads: '71.103 đ', organic: '80.874 đ', note: { vi: 'Organic cao hơn 13,7%!', en: 'Organic is 13.7% higher!' }, highlight: true, tone: 'amber' },
      ],
    },
    within_creator: {
      title: { vi: '2. So sánh trong cùng Creator (175 creator có cả Ads và Organic)', en: '2. Within-Creator Paired Comparison (175 creators with both)' },
      desc: { vi: 'Kiểm soát đặc tính cá nhân của creator: tỷ lệ có đơn của video Ads vẫn cao hơn trung bình +10,40%.', en: 'Controls for individual creator skill: Ads order rate is on average +10.40% higher within the same creator.' },
      rows: [
        { metric: { vi: 'Số creator có cả 2 loại video', en: 'Creators with both video types' }, ads: '175 creator', organic: '175 creator', note: { vi: 'Mẫu đối chứng nội bộ chuẩn xác', en: 'Rigorous within-subject sample' } },
        { metric: { vi: 'Chênh lệch tỷ lệ có đơn TB (YES - NO)', en: 'Mean paired rate difference' }, ads: '+10,40%', organic: '0,00%', note: { vi: 'Wilcoxon signed-rank stat = 364 (p = 1,68e-5)', en: 'Wilcoxon signed-rank stat = 364 (p = 1.68e-5)' }, highlight: true },
        { metric: { vi: 'Creator có Ads hiệu quả hơn Organic', en: 'Creators where Ads > Organic' }, ads: '53 creator (30,3%)', organic: '-', note: { vi: 'Tỷ lệ có đơn tăng rõ rệt', en: 'Marked positive uplift' } },
        { metric: { vi: 'Creator có kết quả bằng nhau', en: 'Creators where Ads == Organic' }, ads: '113 creator (64,6%)', organic: '-', note: { vi: 'Đa số là 0% ở cả hai nhóm (chưa bán được)', en: 'Mostly 0% in both groups (unactivated)' } },
        { metric: { vi: 'Creator có Organic tốt hơn Ads', en: 'Creators where Organic > Ads' }, ads: '9 creator (5,1%)', organic: '-', note: { vi: 'Chỉ thiểu số nhỏ bị giảm', en: 'Only a tiny minority saw drops' } },
      ],
    },
    tiers: {
      title: { vi: '3. Phân tầng theo nhóm Follower', en: '3. Follower Tier Stratification' },
      desc: { vi: 'Ở mọi quy mô kênh từ nano đến macro, video có chạy Ads đều có tỷ lệ ra đơn vượt trội Organic.', en: 'Across every follower tier from nano to macro, Ads-boosted videos consistently outperform Organic in order conversion.' },
      rows: [
        { metric: '< 1k Follower', ads: '12,2% (46/378)', organic: '0,7% (1/141)', note: { vi: 'Ads giúp nano KOC phá băng đơn hàng', en: 'Ads breaks the ice for nano KOCs' } },
        { metric: '1k – 10k Follower', ads: '21,7% (468/2.155)', organic: '2,5% (14/565)', note: { vi: 'Nhóm chiếm tỷ trọng lớn nhất (62%)', en: 'Largest creator tier (62% of videos)' }, highlight: true },
        { metric: '10k – 50k Follower', ads: '40,3% (278/689)', organic: '12,6% (22/175)', note: { vi: 'Tỷ lệ chuyển đổi tăng gấp 3,2 lần', en: 'Conversion rate increases 3.2x' } },
        { metric: '50k – 100k Follower', ads: '38,7% (60/155)', organic: '7,4% (2/27)', note: { vi: 'Gấp 5,2 lần Organic', en: '5.2x higher than Organic' } },
        { metric: '> 100k Follower', ads: '56,2% (59/105)', organic: '37,0% (10/27)', note: { vi: 'Hơn một nửa video có phát sinh đơn', en: 'Over half of videos generate orders' } },
      ],
    },
    ex_dominant: {
      title: { vi: '4. Loại bỏ 3 Creator chi phối (kamielyhn, _thzy.tien, girlstyle.vn)', en: '4. Excluding 3 Dominant Creators' },
      desc: { vi: 'Loại trừ các tài khoản gánh phần lớn GMV để kiểm tra tính đại diện cho toàn bộ mạng lưới KOC ngoài.', en: 'Excludes top revenue-driving accounts to verify true external KOC representativeness.' },
      rows: [
        { metric: { vi: 'Số lượng video còn lại', en: 'Remaining Videos' }, ads: '3.132', organic: '933', note: { vi: 'Loại 352 video của top 3 tài khoản', en: 'Excluded 352 videos from top 3 accounts' } },
        { metric: { vi: 'Tỷ lệ video có đơn', en: 'Order Rate' }, ads: '21,9% (686)', organic: '5,3% (49)', note: { vi: 'Chênh lệch vẫn duy trì +16,6%', en: 'Net uplift remains +16.6%' }, highlight: true },
        { metric: { vi: 'Lượt xem trung vị', en: 'Median Views' }, ads: '504', organic: '154', note: { vi: 'Gấp 3,3 lần Organic', en: '3.3x higher than Organic' } },
        { metric: { vi: 'Tổng GMV (VND)', en: 'Total GMV (VND)' }, ads: '1,04 Tỷ đ', organic: '115,1 Tr đ', note: { vi: 'Mạng lưới KOC ngoài đóng góp 1,04B', en: 'External KOC network drove 1.04B' } },
        { metric: { vi: 'GMV / 1.000 lượt xem (GPM)', en: 'GMV / 1,000 Views (GPM)' }, ads: '53.883 đ', organic: '81.082 đ', note: { vi: 'GPM Organic vẫn cao hơn Ads', en: 'Organic GPM remains higher than Ads' }, tone: 'amber' },
      ],
    },
    last_90d: {
      title: { vi: '5. Cửa sổ chuẩn hóa 90 ngày cuối (Đồng bộ thời gian tính GMV)', en: '5. 90-Day Window Normalization' },
      desc: { vi: 'Khắc phục hạn chế dữ liệu: chỉ lấy video xuất bản từ 06/06 đến 04/09/2026 để khớp chính xác cửa sổ 90 ngày của cột GMV.', en: 'Resolves data grain limitation: filters for videos posted Jun 06 to Sep 04 to match the 90-day GMV reporting window.' },
      rows: [
        { metric: { vi: 'Số lượng video xuất bản trong 90 ngày', en: 'Videos published in last 90 days' }, ads: '1.172', organic: '174', note: { vi: 'Tổng cộng 1.346 video', en: 'Total 1,346 videos in window' } },
        { metric: { vi: 'Tỷ lệ video có đơn', en: 'Order Rate' }, ads: '36,4% (427)', organic: '7,5% (13)', note: { vi: 'Chênh lệch vọt lên +28,9%', en: 'Spread widens to +28.9%' }, highlight: true },
        { metric: { vi: 'Lượt xem trung vị', en: 'Median Views' }, ads: '509', organic: '97,5', note: { vi: 'Gấp 5,2 lần Organic', en: '5.2x higher than Organic' } },
        { metric: { vi: 'Tổng GMV (VND)', en: 'Total GMV (VND)' }, ads: '429,2 Tr đ', organic: '5,0 Tr đ', note: { vi: 'Ads áp đảo tuyệt đối (98,8% GMV)', en: 'Ads dominates with 98.8% of GMV' } },
        { metric: { vi: 'GMV / 1.000 lượt xem (GPM)', en: 'GMV / 1,000 Views (GPM)' }, ads: '89.027 đ', organic: '22.468 đ', note: { vi: 'Ở video mới, GPM của Ads cao gấp gần 4 lần!', en: 'In recent videos, Ads GPM is nearly 4x higher!' }, highlight: true },
      ],
    },
  };

  const timeSlotData: Stage5Payload['timeSlotData'] = [
    { slot: '00:00 - 05:59', n: 7, viewers: 23987, gmvM: 19.7, gmvPerViewer: 822, gmvPerHourM: 1.74, medianDur: 1.52, note: { vi: 'Đêm khuya, ít người xem', en: 'Late night, low traffic' } },
    { slot: '06:00 - 11:59', n: 211, viewers: 1795884, gmvM: 4180.0, gmvPerViewer: 2328, gmvPerHourM: 3.16, medianDur: 4.11, note: { vi: 'Khung sáng chủ lực (44% ca live)', en: 'Core morning block (44% of lives)' } },
    { slot: '12:00 - 17:59', n: 125, viewers: 746399, gmvM: 1997.8, gmvPerViewer: 2677, gmvPerHourM: 3.24, medianDur: 3.22, note: { vi: 'GMV/viewer cao nhất (2.677 đ)', en: 'Highest GMV/viewer (2,677 VND)' } },
    { slot: '18:00 - 23:59', n: 132, viewers: 726428, gmvM: 826.0, gmvPerViewer: 1137, gmvPerHourM: 1.84, medianDur: 3.16, note: { vi: 'Khung tối không có ca >8h', en: 'Evening lacks >8h mega-sessions' } },
  ];

  const heatmapMatrix: Stage5Payload['heatmapMatrix'] = [
    { slot: '00:00 - 05:59', d1: { n: 5, gmvPerV: 1058 }, d2: { n: 2, gmvPerV: 616 }, d3: { n: 0, gmvPerV: 0 }, d4: { n: 0, gmvPerV: 0 } },
    { slot: '06:00 - 11:59', d1: { n: 39, gmvPerV: 849 }, d2: { n: 64, gmvPerV: 1124 }, d3: { n: 40, gmvPerV: 1546 }, d4: { n: 68, gmvPerV: 2833 } },
    { slot: '12:00 - 17:59', d1: { n: 18, gmvPerV: 1440 }, d2: { n: 53, gmvPerV: 1247 }, d3: { n: 18, gmvPerV: 1161 }, d4: { n: 36, gmvPerV: 3891 } },
    { slot: '18:00 - 23:59', d1: { n: 24, gmvPerV: 583 }, d2: { n: 59, gmvPerV: 908 }, d3: { n: 49, gmvPerV: 1341 }, d4: { n: 0, gmvPerV: 0 } },
  ];

  const funnelFacts = {
    liveConvPct: m.channel.live.conversionPct.value,
    videoConvPct: m.channel.video.conversionPct.value,
    spearmanRho: m.channel.live.durationVsGmvSpearman.rho,
  };

  return {
    funnels,
    donutFunnels,
    liveDuration,
    gpmCompare,
    monthlyOwnLiveFunnel,
    adsComparisonCards,
    timeSlotData,
    heatmapMatrix,
    funnelFacts,
  };
}

export function buildStage6Data(): Stage6Payload {
  const daily = m.store.daily;
  const gmvSeries = daily.map((d) => d.gmv);
  const dailyMean = mean(gmvSeries);
  const dailyStd = sampleStd(gmvSeries);

  const zScoreSeries = daily.map((d) => {
    const z = (d.gmv - dailyMean) / dailyStd;
    return { date: d.date, label: ddmm(d.date), z: Math.round(z * 100) / 100, isOutlier: Math.abs(z) > 3 };
  });

  const outlierDays = zScoreSeries.filter((d) => d.isOutlier);

  const treatmentComparison = (() => {
    const keep = daily.filter((d) => Math.abs((d.gmv - dailyMean) / dailyStd) <= 3).map((d) => d.gmv);
    const rows = [
      { key: 'raw', label: { vi: 'Giữ nguyên', en: 'As is' }, mean: dailyMean, std: dailyStd },
      { key: 'drop', label: { vi: 'Loại', en: 'Removed' }, mean: mean(keep), std: sampleStd(keep) },
      { key: 'p99', label: { vi: 'Cắt P99', en: 'Winsor P99' }, mean: mean(winsorizeUpper(gmvSeries, 0.99)), std: sampleStd(winsorizeUpper(gmvSeries, 0.99)) },
      { key: 'p95', label: { vi: 'Cắt P95', en: 'Winsor P95' }, mean: mean(winsorizeUpper(gmvSeries, 0.95)), std: sampleStd(winsorizeUpper(gmvSeries, 0.95)) },
    ];
    return rows.map((r) => ({ ...r, meanM: toM(r.mean), stdM: toM(r.std) }));
  })();

  const categoryMatch = {
    swimwearGmvPct: m.products.swimwearGmvSharePct,
    otherGmvPct: Math.round((100 - m.products.swimwearGmvSharePct) * 100) / 100,
  };

  const categoryData: Stage6Payload['categoryData'] = [
    { name: { vi: 'Bikini / Đồ bơi', en: 'Bikini / Swimwear' }, n: 1590, orderRate: 26.1, gmvM: 1324.2, gmvShare: 61.0, color: '#9BE7FA' },
    { name: { vi: 'Váy / Đầm', en: 'Dresses / Skirts' }, n: 1095, orderRate: 22.1, gmvM: 155.3, gmvShare: 7.2, color: '#0D7287' },
    { name: { vi: 'Khác / Chưa phân loại', en: 'Other / Unclassified' }, n: 1060, orderRate: 21.7, gmvM: 496.5, gmvShare: 22.9, color: '#94A3B8' },
    { name: { vi: 'Set trang phục', en: 'Co-ord Sets' }, n: 364, orderRate: 9.1, gmvM: 76.2, gmvShare: 3.5, color: '#FFE485' },
    { name: { vi: 'Áo / Croptop', en: 'Tops / Croptops' }, n: 242, orderRate: 13.6, gmvM: 81.5, gmvShare: 3.8, color: '#FFD14C' },
    { name: { vi: 'Quần / Quần gió', en: 'Pants / Shorts' }, n: 66, orderRate: 10.6, gmvM: 36.8, gmvShare: 1.7, color: '#F43F5E' },
  ];

  const topHashtags: Stage6Payload['topHashtags'] = [
    { tag: '#xuhuong', count: 1163, type: 'generic' },
    { tag: '#bikini', count: 1076, type: 'product' },
    { tag: '#thoitrangnu', count: 738, type: 'generic' },
    { tag: '#viral', count: 462, type: 'generic' },
    { tag: '#chanvay', count: 400, type: 'product' },
    { tag: '#xuhuongtiktok', count: 395, type: 'generic' },
    { tag: '#xh', count: 393, type: 'generic' },
    { tag: '#fyp', count: 369, type: 'generic' },
    { tag: '#dodibien', count: 297, type: 'product' },
    { tag: '#chanvayxinh', count: 287, type: 'product' },
    { tag: '#outfit', count: 287, type: 'generic' },
    { tag: '#chanvayngan', count: 264, type: 'product' },
    { tag: '#capcut', count: 255, type: 'generic' },
    { tag: '#thoitrang', count: 234, type: 'generic' },
    { tag: '#setdibien', count: 226, type: 'product' },
  ];

  const anomalyRegistry: Stage6Payload['anomalyRegistry'] = [
    {
      type: { vi: 'Dị biệt GMV Ngày', en: 'Daily GMV Outlier' },
      target: '16/06/2026',
      metric: '315,0 Tr đ (z = 5,57)',
      rootCause: { vi: '1 ca Live chính chủ (194,9M) + 90 ca affiliate (77,3M) chiếm 86% GMV ngày', en: '1 own-brand live (194.9M) + 90 affiliate lives (77.3M) = 86% daily GMV' },
      treatment: { vi: 'Giữ nguyên, không loại bỏ; dùng z trượt 28 ngày để nhận diện đỉnh cục bộ', en: 'Retain; employ 28-day rolling z-score to isolate local surges' },
      status: 'verified',
    },
    {
      type: { vi: 'Creator Ngoại lai', en: 'Creator Outlier' },
      target: 'girlstyle.vn (Girl Style)',
      metric: '1,26 Tỷ đ (56,1% GMV Live Affiliate)',
      rootCause: { vi: 'Kênh vệ tinh nội bộ in-house do chủ shop vận hành, phát 98/101 ngày tồn tại', en: 'Internal in-house satellite channel operated by shop, streaming 98/101 active days' },
      treatment: { vi: 'Tách bạch 2 bản phân tích: Có và Không có Girl Style; Winsorize ở P99', en: 'Dual reporting (With vs Excl Girl Style); Winsorize at P99 for KOC benchmarks' },
      status: 'isolated',
    },
    {
      type: { vi: 'Dị biệt Thời lượng', en: 'Session Duration Outlier' },
      target: '15 phiên Live > 24 Giờ',
      metric: 'Dài nhất 269,1 giờ (~11 ngày liên tục)',
      rootCause: { vi: 'KOC treo máy live lặp video (6 ca thuộc vayxinhchery888), tổng GMV chỉ 25,5M', en: 'Looped automated streams (6 from vayxinhchery888); total GMV only 25.5M VND' },
      treatment: { vi: 'Gắn cờ is_outlier_duration = 1; loại khỏi tính toán thời lượng trung bình', en: 'Flag is_outlier_duration = 1; exclude from mean duration metrics' },
      status: 'flagged',
    },
    {
      type: { vi: 'Chất lượng Dữ liệu', en: 'Zero-Duration Sessions' },
      target: '69 phiên Live thời lượng = 0',
      metric: '0 giờ phát sóng, 0 GMV',
      rootCause: { vi: 'Phiên live bị lỗi kết nối hoặc tắt ngay sau khi bật', en: 'Connection drops or immediate cancellations upon launch' },
      treatment: { vi: 'Gắn cờ is_zero_duration; lọc khi tính hiệu suất ca live', en: 'Flag is_zero_duration; filter out when computing stream efficiency' },
      status: 'flagged',
    },
  ];

  return {
    categoryData,
    topHashtags,
    anomalyRegistry,
    zScoreSeries,
    outlierDays,
    treatmentComparison,
    categoryMatch,
  };
}

export function buildStage7Data(): Stage7Payload {
  const K_MIN = 10;
  const kAnonymity = m.creators.followerTiers.map((t) => ({
    tier: t.tier,
    creators: t.creators,
    passes: t.creators >= K_MIN,
  }));

  const hashAudit = [
    { stage: '1. Ingestion', table: 'stg_creator_live', records: 600, hashMethod: 'SHA-256 + Salt', saltStatus: 'HMAC Server Secret' },
    { stage: '2. Staging', table: 'clean_creators_network', records: 6086, hashMethod: 'Masking Phone/UID', saltStatus: 'Irreversible Hash' },
    { stage: '3. Marts', table: 'mart_creator_cohorts', records: 292, hashMethod: 'Aggregated / No PII', saltStatus: 'Differential Privacy' },
    { stage: '4. Serving', table: 'api_case_study_payload', records: 1, hashMethod: 'JSON SSL Transit', saltStatus: 'TLS 1.3 In-Flight' },
  ];

  const schemaTables = [
    { tableName: 'mart_store_seasonality_daily', grain: { vi: 'Theo ngày', en: 'Daily' }, records: 226, columns: 12, description: { vi: 'Chuỗi thời gian doanh thu 226 ngày, MA7, delta z-score', en: '226-day GMV time series, 7d rolling average, z-scores' } },
    { tableName: 'mart_creator_cohorts_retention', grain: { vi: 'Creator x Tháng', en: 'Creator x Month' }, records: 292, columns: 9, description: { vi: 'Ma trận giữ chân creator, vòng đời LTV, độ nhạy Girl Style', en: 'Creator retention matrix, LTV cycle, Girl Style sensitivity' } },
    { tableName: 'mart_sku_pareto_health', grain: { vi: 'Mã SKU', en: 'SKU' }, records: 331, columns: 8, description: { vi: 'Phân loại A/B/C Pareto, tình trạng tồn kho chết, dải giá', en: 'Pareto ABC classification, dead stock flags, price bands' } },
    { tableName: 'mart_content_funnel_gpm', grain: { vi: 'Định dạng nội dung', en: 'Content Format' }, records: 4, columns: 7, description: { vi: 'Chuyển đổi phễu Live vs Video, hiệu suất GPM, phân vị', en: 'Live vs Video funnel conversion, GPM efficiency, percentiles' } },
    { tableName: 'mart_anomaly_telemetry', grain: { vi: 'Phiên / Sự kiện', en: 'Session / Event' }, records: 15, columns: 6, description: { vi: 'Danh mục phiên ngoại lai >24h, lệch ngày, log đối soát', en: 'Outlier sessions catalog (>24h), audit resolution log' } },
  ];

  const cronCadence = [
    { pipeline: '1. FastMoss Incremental Ingestion', cadence: '0 2 * * *', window: 'Daily 02:00 AM', trigger: 'Python Ingestion Script', targetTable: 'stg_store_daily' },
    { pipeline: '2. Staging Normalization & Timezone Sync', cadence: '30 2 * * *', window: 'Daily 02:30 AM', trigger: 'SQL Transform / dbt', targetTable: 'clean_store_daily_226d' },
    { pipeline: '3. Anomaly & Outlier Detector', cadence: '0 3 * * *', window: 'Daily 03:00 AM', trigger: 'Python Z-Score Engine', targetTable: 'mart_anomaly_telemetry' },
    { pipeline: '4. Marts Rollup & Cache Invalidation', cadence: '15 3 * * *', window: 'Daily 03:15 AM', trigger: 'API Cache Invalidator', targetTable: 'mart_*' },
  ];

  const qualityGates: Stage7Payload['qualityGates'] = [
    {
      gate: { vi: '1. Chuỗi ngày liên tục', en: '1. Continuous Date Range' },
      scope: 'stg_store',
      expected: { vi: 'Đủ 226 ngày không đứt đoạn (09/03 – 20/10/2026)', en: '226 uninterrupted days (Mar 09 - Oct 20)' },
      actual: '226/226 ngày',
      level: 'error',
      status: 'passed',
      note: { vi: 'Đảm bảo tính toàn vẹn chuỗi thời gian', en: 'Guarantees time-series continuity' },
    },
    {
      gate: { vi: '2. Kiểm soát tổng doanh số', en: '2. Total Sales Reconciliation' },
      scope: 'stg_store',
      expected: '100.669 sp · 14.842.597.762 VNĐ',
      actual: '100.669 sp · 14.842.597.762 VNĐ',
      level: 'error',
      status: 'passed',
      note: { vi: 'Khớp tuyệt đối 100% không lệch 1 xu', en: '100% exact currency reconciliation' },
    },
    {
      gate: { vi: '3. Khóa duy nhất video', en: '3. Unique Video Primary Key' },
      scope: 'stg_shoppable',
      expected: { vi: '0 bản ghi trùng lặp (creator + title + pub_date)', en: '0 duplicate rows (creator + title + date)' },
      actual: { vi: '0 trùng (4.796 video duy nhất sau hợp nhất)', en: '0 duplicates (4,796 unique after merge)' },
      level: 'error',
      status: 'passed',
      note: { vi: 'Xử lý qua CTE ROW_NUMBER()', en: 'Resolved via ROW_NUMBER() CTE' },
    },
    {
      gate: { vi: '4. Đối soát sản lượng chính chủ', en: '4. Own-Brand Volume Parity' },
      scope: 'creators_merged vs goods_for_sale',
      expected: { vi: 'Sản lượng kamielyhn khớp nhau (90 ngày)', en: 'kamielyhn 90d volume parity' },
      actual: '20.027 sp = 20.027 sp',
      level: 'error',
      status: 'passed',
      note: { vi: 'Khớp 100% giữa 2 bảng độc lập', en: '100% match across 2 independent exports' },
    },
    {
      gate: { vi: '5. Khớp phiên Live chính chủ', en: '5. Live Session Cross-Match' },
      scope: 'shop_live vs creator_live_list',
      expected: { vi: '470 phiên khớp sau khi dịch +13h', en: '470 sessions match after +13h shift' },
      actual: '470/470 phiên khớp',
      level: 'error',
      status: 'passed',
      note: { vi: 'Khắc phục độ lệch múi giờ UTC+7', en: 'Solves timezone latency discrepancy' },
    },
    {
      gate: { vi: '6. Giải mã sai số GMV 91k đ', en: '6. 91k VND GMV Delta Proof' },
      scope: 'Live reconciliation',
      expected: { vi: '190.000 đ (06/05) − 99.000 đ (07/03) = 91.000 đ', en: '190k (May 06) - 99k (Mar 07) = 91k' },
      actual: { vi: 'Khớp toán học 91.000 đ', en: 'Exact 91k VND mathematical match' },
      level: 'warn',
      status: 'passed',
      note: { vi: 'Giải mã triệt để biến động ngoài cửa sổ', en: 'Accounts for boundary window cutoffs' },
    },
    {
      gate: { vi: '7. Tỷ lệ Creator mồ côi', en: '7. Orphan Creator Ratio' },
      scope: 'stg_live vs stg_creators',
      expected: '≤ 4/251 creator (≤ 1,6%)',
      actual: '4/251 creator (1,59%)',
      level: 'warn',
      status: 'passed',
      note: { vi: 'Gắn cờ is_orphan = 1 trong mart', en: 'Flagged as is_orphan = 1 in marts' },
    },
    {
      gate: { vi: '8. Tỷ lệ tiêu đề thiếu', en: '8. Missing Title Threshold' },
      scope: 'stg_shoppable & stg_live',
      expected: { vi: 'Shoppable ≤ 5% · Live ≤ 15%', en: 'Shoppable ≤ 5% · Live ≤ 15%' },
      actual: 'Shoppable 5,0% · Live 14,4%',
      level: 'warn',
      status: 'passed',
      note: { vi: 'Đã lọc bỏ tiêu đề mặc định hệ thống', en: 'Default system titles binned separately' },
    },
    {
      gate: { vi: '9. Phân vùng Multi-Snapshot Hàng Bán', en: '9. Multi-Snapshot Goods Partitioning' },
      scope: 'kami_creator_products',
      expected: { vi: '392 SP (Kỳ Hè) + 395 SP (Kỳ Thu) = 787 bản ghi', en: '392 SKUs (Summer) + 395 SKUs (Autumn) = 787 rows' },
      actual: { vi: '787/787 bản ghi (0 ghi đè làm mất lịch sử)', en: '787/787 rows (zero historical data loss)' },
      level: 'error',
      status: 'passed',
      note: { vi: 'Khóa duy nhất kết hợp (product_name, shop_name, snapshot_period)', en: 'Compound unique key (product_name, shop_name, snapshot_period)' },
    },
  ];

  const piiInventory: Stage7Payload['piiInventory'] = [
    { field: 'creator id (handle)', type: { vi: 'Định danh tài khoản', en: 'Account Handle' }, risk: { vi: 'Cao (nhận diện cá nhân)', en: 'High (personal ID)' }, treatment: { vi: 'Băm SHA-256 kèm muối: sha256(salt + id)[:10]', en: 'Salted SHA-256 hash: sha256(salt + id)[:10]' } },
    { field: 'creator name / nickname', type: { vi: 'Tên hiển thị công khai', en: 'Display Name' }, risk: { vi: 'Trung bình (chứa tên thật)', en: 'Medium (real names)' }, treatment: { vi: 'Ẩn hoàn toàn trong bản Public; thay bằng "Creator A, B, C"', en: 'Replaced with anonymous aliases "Creator A, B, C"' } },
    { field: 'followers & GMV', type: { vi: 'Chỉ số thương mại', en: 'Commercial Metrics' }, risk: { vi: 'Cao (Deanonymization qua phân vị)', en: 'High (quantile reverse lookup)' }, treatment: { vi: 'Làm tròn / nhóm thành các dải tier; không công bố bảng chi tiết nhóm nhỏ', en: 'Binned into tiers; suppress granular micro-tier tables' } },
    { field: 'Tiêu đề Video / Live', type: { vi: 'Văn bản tự do', en: 'Free Text' }, risk: { vi: 'Thấp (dương tính giả SĐT)', en: 'Low (false positive phones)' }, treatment: { vi: 'Quét regex làm sạch thông tin liên hệ; bản Public chỉ xuất hashtag', en: 'Regex scrub contacts; export only aggregated tags in public repo' } },
    { field: { vi: 'Dữ liệu người mua', en: 'Buyer Customer Logs' }, type: { vi: 'Thông tin cá nhân khách', en: 'Customer Data' }, risk: { vi: 'Không có rủi ro', en: 'Zero Risk' }, treatment: { vi: 'Dữ liệu SSOT không chứa bất kỳ thông tin người mua nào', en: 'No buyer-level records exist in raw TikTok exports' } },
  ];

  return {
    qualityGates,
    piiInventory,
    kAnonymity,
    hashAudit,
    schemaTables,
    cronCadence,
  };
}

let cachedPayload: KamiEly7StagesPayload | null = null;

export function buildKamiEly7StagesPayload(): KamiEly7StagesPayload {
  if (cachedPayload) return cachedPayload;

  cachedPayload = {
    stage1: buildStage1Data(),
    stage2: buildStage2Data(),
    stage3: buildStage3Data(),
    stage4: buildStage4Data(),
    stage5: buildStage5Data(),
    stage6: buildStage6Data(),
    stage7: buildStage7Data(),
  };

  return cachedPayload;
}
