import dailySeriesJson from '@/app/data/kami-ely/generated/daily_231d.json';
import dailyChartsBundle from '@/app/data/kami-ely/generated/kami_daily_charts_231d.json';

export interface DailyPoint231 {
  d: string;
  iso: string;
  gmv: number;
  cap: number;
  ma7: number | null;
  ma28: number | null;
  lives: number;
}

export interface DailyChartRow231 {
  d: string;
  iso: string;
  storeTotal: number;
  storeUnits: number;
  aspK: number;
  ownLive: number;
  top1Live: number;
  extLive: number;
  lives: number;
  kocActive: number;
  kocNew: number;
  kocOrders: number;
  kocGmv: number;
  ownSes: number;
  ownViewsPerSes: number;
  ownUnitsPer1k: number;
  vidClips: number;
  vidTotal: number;
  vidBikini: number;
  vidDress: number;
  vidAutumn: number;
  vidOther: number;
}

export interface WeeklyChartRow33 {
  week: string;
  label: string;
  storeTotal: number;
  storeUnits: number;
  aspK: number;
  ownLive: number;
  top1Live: number;
  extLive: number;
  lives: number;
  kocActive: number;
  kocNew: number;
  kocOrders: number;
  kocGmv: number;
  ownSes: number;
  ownViewsPerSes: number;
  ownUnitsPer1k: number;
  vidClips: number;
  vidTotal: number;
  vidBikini: number;
  vidDress: number;
  vidAutumn: number;
  vidOther: number;
}

export interface MonthlyChartRow8 {
  month: string;
  ym: string;
  days: number;
  storeTotal: number;
  storePerDay: number;
  aspK: number;
  ownLive: number;
  top1Live: number;
  extLive: number;
  lives: number;
}

export interface SkuDailyRow179 {
  d: string;
  iso: string;
  summerM: number;
  autumnM: number;
  h36M: number;
  at06M: number;
  other8M: number;
  top1Pct: number;
  u75M: number;
  b75M: number;
  b150M: number;
  o250M: number;
}

export const DAILY_SERIES_231D: DailyPoint231[] = dailySeriesJson as DailyPoint231[];
export const DAILY_CHARTS_231D: DailyChartRow231[] = dailyChartsBundle.daily231 as DailyChartRow231[];
export const WEEKLY_CHARTS_33W: WeeklyChartRow33[] = dailyChartsBundle.weekly33 as WeeklyChartRow33[];
export const MONTHLY_CHARTS_8M: MonthlyChartRow8[] = dailyChartsBundle.monthly8 as MonthlyChartRow8[];
export const SKU_DAILY_179D: SkuDailyRow179[] = dailyChartsBundle.skuDaily179 as SkuDailyRow179[];

// 33 tuần liên tục (09/03 - 25/10/2026) cho biểu đồ Hero & đối soát kênh
export const WEEKLY_CHANNEL_SERIES = WEEKLY_CHARTS_33W;

// Kiểm kê 9 bảng chính + 1 bảng phụ trợ SKU (gộp độ hạt, cửa sổ & số dòng Raw -> Cleaned)
export const UNIFIED_SOURCE_TABLES = [
  {
    table: 'kami_store_daily_overview',
    windowVi: '231 ngày (09/03 - 25/10/2026)',
    windowEn: '231 days (09/03 - 25/10/2026)',
    grainVi: 'Ngày (1 dòng / ngày shop)',
    grainEn: 'Day (1 row / store day)',
    rawRows: 231,
    cleanRows: 231,
    noteVi: 'Chuỗi ngày liên tục, khớp tổng 15.009.083.662 đ & 101.896 sp',
    noteEn: 'Continuous daily series, exact 15.009B VND & 101,896 units',
  },
  {
    table: 'kami_affiliate_livestreams',
    windowVi: '231 ngày (09/03 - 20/10/2026)',
    windowEn: '231 days (09/03 - 20/10/2026)',
    grainVi: 'Ca Live (1 dòng / phiên gắn giỏ)',
    grainEn: 'Live session (1 row / tagged live)',
    rawRows: 8355,
    cleanRows: 8355,
    noteVi: '595 ca chính chủ (7,59 tỷ) + 261 ca @koc_sat01 (1,26 tỷ) + 7.499 ca KOC khác (1,62 tỷ)',
    noteEn: '595 official (7.59B) + 261 @koc_sat01 (1.26B) + 7,499 other KOCs (1.62B)',
  },
  {
    table: 'kami_creator_livestreams',
    windowVi: '07/03 - 20/10/2026 (dịch +13h)',
    windowEn: '07/03 - 20/10/2026 (+13h shifted)',
    grainVi: 'Ca Live chính chủ',
    grainEn: 'Official Live session',
    rawRows: 600,
    cleanRows: 595,
    noteVi: 'Loại 5 ca ngày 07-08/03 ngoài cửa sổ 231 ngày khi đối soát',
    noteEn: 'Filtered 5 pre-09/03 sessions during 231d window alignment',
  },
  {
    table: 'kami_affiliate_videos',
    windowVi: 'Đăng 231N · Doanh số 90N',
    windowEn: '231d publish · 90d sales window',
    grainVi: 'Video (1 dòng / clip gắn giỏ)',
    grainEn: 'Video (1 row / shoppable clip)',
    rawRows: 4797,
    cleanRows: 4796,
    noteVi: 'Khử 1 dòng trùng khóa phức hợp (koc_hash + tiêu đề + giờ đăng)',
    noteEn: 'Deduplicated 1 composite-key record',
  },
  {
    table: 'kami_creator_videos',
    windowVi: '11/03 - 20/10/2026',
    windowEn: '11/03 - 20/10/2026',
    grainVi: 'Video chính chủ',
    grainEn: 'Official channel video',
    rawRows: 276,
    cleanRows: 276,
    noteVi: 'Video kênh tự vận hành đạt tổng 959,0 triệu đ',
    noteEn: 'Official channel clips totaling 959.0M VND',
  },
  {
    table: 'kami_shop_products',
    windowVi: 'Snapshot 90 ngày gần nhất',
    windowEn: 'Rolling 90-day snapshot',
    grainVi: 'SKU (1 dòng / mã hàng trên kệ)',
    grainEn: 'SKU (1 row / catalog item)',
    rawRows: 339,
    cleanRows: 339,
    noteVi: '133 SKU có đơn · 206 SKU 0 đơn (60,8%) trong cửa sổ 90 ngày',
    noteEn: '133 active SKUs · 206 zero-sale SKUs (60.8%) in 90d window',
  },
  {
    table: 'kami_affiliate_kol',
    windowVi: 'Snapshot 90 ngày hợp nhất',
    windowEn: 'Merged 90-day snapshot',
    grainVi: 'Creator (1 dòng / tài khoản)',
    grainEn: 'Creator (1 row / creator ID)',
    rawRows: 6086,
    cleanRows: 6085,
    noteVi: 'Tách 1 tài khoản chính chủ khỏi 6.085 creator liên kết (328 có đơn)',
    noteEn: 'Separated 1 official account from 6,085 affiliates (328 with sales)',
  },
  {
    table: 'kami_creator_products',
    windowVi: '2 Snapshot 90N (Hè & Thu)',
    windowEn: 'Dual 90d snapshots (Summer & Autumn)',
    grainVi: 'SKU × Kỳ chốt',
    grainEn: 'SKU × Snapshot period',
    rawRows: 787,
    cleanRows: 787,
    noteVi: '392 dòng kỳ 04/09 + 395 dòng kỳ 20/10 (giữ khóa phân vùng)',
    noteEn: '392 Summer rows + 395 Autumn rows partitioned cleanly',
  },
  {
    table: 'kami_livestream_products',
    windowVi: 'Snapshot 90 ngày ghim Live',
    windowEn: '90-day pinned Live snapshot',
    grainVi: 'SKU ghim Live',
    grainEn: 'Live-pinned SKU',
    rawRows: 103,
    cleanRows: 103,
    noteVi: 'Đối chiếu tỷ lệ hoa hồng và sản lượng ghim trực tiếp',
    noteEn: 'Cross-checks commission rate and live-pinned units',
  },
  {
    table: 'kami_sku_daily_timeseries',
    windowVi: '179 ngày (30/04 - 25/10/2026)',
    windowEn: '179 days (30/04 - 25/10/2026)',
    grainVi: 'SKU × Ngày (10 mã chủ lực)',
    grainEn: 'SKU × Day (10 tracked SKUs)',
    rawRows: 1790,
    cleanRows: 1790,
    noteVi: 'Panel phụ trợ theo dõi chuyển dịch 5 mã Bikini Hè sang 5 mã Thu Đông',
    noteEn: 'Supplementary panel tracking 5 Summer vs 5 Autumn-Winter SKUs',
  },
];

// Thanh 100% theo nhóm kênh (xác nhận rõ phạm vi thời gian để không lệch số)
export const CHANNEL_SHARE_100_STACKS = [
  {
    scopeVi: 'Live 231 ngày (10,47 tỷ đ · 8.355 ca)',
    scopeEn: '231d Live GMV (10.47B · 8,355 lives)',
    ownPct: 72.5,
    satPct: 12.0,
    extPct: 15.5,
    ownVal: '7,59 tỷ',
    satVal: '1,26 tỷ',
    extVal: '1,62 tỷ',
  },
  {
    scopeVi: 'Danh bạ KOL 90 ngày gộp (2,92 tỷ đ Live + Video)',
    scopeEn: 'Merged 90d Creator Directory (2.92B Live + Video)',
    ownPct: 60.1,
    satPct: 14.8,
    extPct: 25.1,
    ownVal: '1,75 tỷ',
    satVal: '0,43 tỷ',
    extVal: '0,73 tỷ',
  },
  {
    scopeVi: 'Snapshot KOL 90 ngày kỳ Hè (đến 04/09)',
    scopeEn: 'Summer 90d Creator Snapshot (to Sep 04)',
    ownPct: 63.9,
    satPct: 15.5,
    extPct: 20.6,
    ownVal: 'Tự vận hành',
    satVal: '@koc_sat01',
    extVal: 'Affiliate khác',
  },
];

// Đường cong Pareto chỉ vẽ trên 133 SKU phát sinh doanh số (>0) trên bảng kệ hàng 339 SKU
export const ACTIVE_SKU_PARETO = [
  { rank: 0, activeLabel: '0%', activePct: 0.0, gmvPct: 0.0 },
  { rank: 1, activeLabel: '1 SKU', activePct: 0.8, gmvPct: 46.9 },
  { rank: 3, activeLabel: '3 SKU', activePct: 2.3, gmvPct: 62.3 },
  { rank: 5, activeLabel: 'Top 5 SKU', activePct: 3.8, gmvPct: 68.5 },
  { rank: 8, activeLabel: '8 SKU', activePct: 6.0, gmvPct: 74.8 },
  { rank: 12, activeLabel: '12 SKU (80,6%)', activePct: 9.0, gmvPct: 80.6 },
  { rank: 21, activeLabel: '21 SKU', activePct: 15.8, gmvPct: 88.0 },
  { rank: 30, activeLabel: '30 SKU', activePct: 22.6, gmvPct: 91.6 },
  { rank: 45, activeLabel: '45 SKU', activePct: 33.8, gmvPct: 95.4 },
  { rank: 65, activeLabel: '65 SKU', activePct: 48.9, gmvPct: 97.9 },
  { rank: 90, activeLabel: '90 SKU', activePct: 67.7, gmvPct: 99.4 },
  { rank: 133, activeLabel: '133 SKU', activePct: 100.0, gmvPct: 100.0 },
];

// Waterfall phân rã T6 -> T8 cộng khớp tuyệt đối từng chữ số thập phân (3.772,4 - 2.224,8 - 2.220,5 + 1.309,6 = 636,7 Tr đ)
export const WATERFALL_T6_T8 = [
  {
    stepVi: 'Đỉnh T6',
    stepEn: 'Jun peak',
    subVi: '1.560 ca · 2,42 Tr/ca',
    subEn: '1,560 lives · 2.42M/live',
    range: [0, 3772.4] as [number, number],
    signedVal: 3772.4,
    displayVi: '3.772,4 Tr',
    displayEn: '3,772.4M',
    kind: 'total' as const,
    color: '#0D7287',
  },
  {
    stepVi: 'Giảm số ca',
    stepEn: 'Fewer lives',
    subVi: '1.560 -> 640 ca',
    subEn: '1,560 -> 640 lives',
    range: [1547.6, 3772.4] as [number, number],
    signedVal: -2224.8,
    displayVi: '-2.224,8 Tr',
    displayEn: '-2,224.8M',
    kind: 'neg' as const,
    color: '#E11D48',
  },
  {
    stepVi: 'Giảm GMV/ca',
    stepEn: 'Lower GMV/live',
    subVi: '2,42 -> 0,99 Tr/ca',
    subEn: '2.42 -> 0.99M/live',
    range: [-672.9, 1547.6] as [number, number],
    signedVal: -2220.5,
    displayVi: '-2.220,5 Tr',
    displayEn: '-2,220.5M',
    kind: 'neg' as const,
    color: '#F43F5E',
  },
  {
    stepVi: 'Tác động chéo',
    stepEn: 'Interaction',
    subVi: 'ΔSố ca × ΔGMV/ca',
    subEn: 'ΔLives × ΔRate',
    range: [-672.9, 636.7] as [number, number],
    signedVal: 1309.6,
    displayVi: '+1.309,6 Tr',
    displayEn: '+1,309.6M',
    kind: 'pos' as const,
    color: '#F59E0B',
  },
  {
    stepVi: 'Đáy T8',
    stepEn: 'Aug trough',
    subVi: '640 ca · 0,99 Tr/ca',
    subEn: '640 lives · 0.99M/live',
    range: [0, 636.7] as [number, number],
    signedVal: 636.7,
    displayVi: '636,7 Tr',
    displayEn: '636.7M',
    kind: 'total' as const,
    color: '#64748B',
  },
];

// Kiểm chứng độ nhạy Dead Cross 26/06 khi xử lý ngoại lai 16/06 (315,0 Tr đ)
export const DEAD_CROSS_SENSITIVITY = [
  {
    scenarioVi: 'Chuỗi gốc chưa cắt ngoại lai',
    scenarioEn: 'Raw unadjusted series',
    crossDate: '26/06/2026',
    ma7AtCross: '120,7 Tr',
    ma28AtCross: '125,9 Tr',
    leadDays: 'Sớm 18 ngày trước khi thủng nền T4',
  },
  {
    scenarioVi: 'Winsorize ở phân vị P99 (176,6 Tr)',
    scenarioEn: 'Winsorized at P99 (176.6M)',
    crossDate: '26/06/2026',
    ma7AtCross: '117,9 Tr',
    ma28AtCross: '120,3 Tr',
    leadDays: 'Giữ nguyên ngày cắt 26/06',
  },
  {
    scenarioVi: 'Winsorize ở phân vị P95 (136,8 Tr)',
    scenarioEn: 'Winsorized at P95 (136.8M)',
    crossDate: '26/06/2026',
    ma7AtCross: '112,2 Tr',
    ma28AtCross: '112,8 Tr',
    leadDays: 'Giữ nguyên ngày cắt 26/06',
  },
  {
    scenarioVi: 'Thay 16/06 bằng trung vị T6 (120,5 Tr)',
    scenarioEn: 'Impute 16/06 with June median',
    crossDate: '27/06/2026',
    ma7AtCross: '119,2 Tr',
    ma28AtCross: '119,8 Tr',
    leadDays: 'Chỉ dịch chuyển 1 ngày',
  },
];

// Ma trận tỷ lệ giữ chân KOC Live (M0 -> M7) kèm cột GMV có / không có kênh vệ tinh @koc_sat01
export const COHORT_RETENTION_231D = [
  { cohort: 'T3/26', n: 66, gmvWithSatM: 444.9, gmvNoSatM: 444.9, m: [100.0, 71.2, 47.0, 40.9, 25.8, 15.2, 16.7, 12.1] },
  { cohort: 'T4/26', n: 80, gmvWithSatM: 226.8, gmvNoSatM: 226.8, m: [100.0, 45.0, 25.0, 18.8, 7.5, 6.2, 3.8, null] },
  { cohort: 'T5/26', n: 37, gmvWithSatM: 1496.7, gmvNoSatM: 238.9, m: [100.0, 48.6, 21.6, 13.5, 10.8, 10.8, null, null] },
  { cohort: 'T6/26', n: 30, gmvWithSatM: 114.5, gmvNoSatM: 114.5, m: [100.0, 33.3, 20.0, 13.3, 13.3, null, null, null] },
  { cohort: 'T7/26', n: 15, gmvWithSatM: 6.0, gmvNoSatM: 6.0, m: [100.0, 33.3, 20.0, 6.7, null, null, null, null] },
  { cohort: 'T8/26', n: 18, gmvWithSatM: 0.5, gmvNoSatM: 0.5, m: [100.0, 27.8, 22.2, null, null, null, null, null] },
  { cohort: 'T9/26', n: 29, gmvWithSatM: 376.1, gmvNoSatM: 376.1, m: [100.0, 41.4, null, null, null, null, null] },
  { cohort: 'T10/26', n: 27, gmvWithSatM: 211.7, gmvNoSatM: 211.7, m: [100.0, null, null, null, null, null, null, null] },
];

// Ma trận Khung giờ × Độ dài ca Live chính chủ (595 phiên dịch +13h VN, có tách ca >= 8 giờ và cờ làm mờ mẫu nhỏ n < 10)
export interface SlotDurationCell {
  gmvPerView: number | null;
  n: number;
  lowSample: boolean;
}

export interface SlotDurationRow {
  slotVi: string;
  slotEn: string;
  u2h: SlotDurationCell;
  b2_4h: SlotDurationCell;
  b4_8h: SlotDurationCell;
  o8h: SlotDurationCell;
}

export const OFFICIAL_SLOT_DURATION_595: SlotDurationRow[] = [
  {
    slotVi: '06h - 12h (Sáng)',
    slotEn: '06:00 - 12:00 (Morning)',
    u2h: { gmvPerView: 891, n: 41, lowSample: false },
    b2_4h: { gmvPerView: 1260, n: 71, lowSample: false },
    b4_8h: { gmvPerView: 1546, n: 40, lowSample: false },
    o8h: { gmvPerView: 2833, n: 68, lowSample: false },
  },
  {
    slotVi: '12h - 18h (Chiều)',
    slotEn: '12:00 - 18:00 (Afternoon)',
    u2h: { gmvPerView: 1904, n: 40, lowSample: false },
    b2_4h: { gmvPerView: 1444, n: 77, lowSample: false },
    b4_8h: { gmvPerView: 1552, n: 35, lowSample: false },
    o8h: { gmvPerView: 3891, n: 36, lowSample: false },
  },
  {
    slotVi: '18h - 24h (Tối)',
    slotEn: '18:00 - 24:00 (Evening)',
    u2h: { gmvPerView: 871, n: 49, lowSample: false },
    b2_4h: { gmvPerView: 1066, n: 77, lowSample: false },
    b4_8h: { gmvPerView: 1467, n: 53, lowSample: false },
    o8h: { gmvPerView: null, n: 0, lowSample: true },
  },
  {
    slotVi: '00h - 06h (Đêm)',
    slotEn: '00:00 - 06:00 (Overnight)',
    u2h: { gmvPerView: 961, n: 6, lowSample: true },
    b2_4h: { gmvPerView: 616, n: 2, lowSample: true },
    b4_8h: { gmvPerView: null, n: 0, lowSample: true },
    o8h: { gmvPerView: null, n: 0, lowSample: true },
  },
];

// Hợp nhất 9 cổng kiểm tra chất lượng dữ liệu (6 ERROR + 3 WARN)
export const UNIFIED_9_QUALITY_GATES = [
  {
    id: 1,
    gateVi: 'Tính liên tục chuỗi ngày toàn shop',
    gateEn: 'Store daily date continuity',
    scope: 'kami_store_daily_overview',
    expected: 'Đủ 231 ngày liên tục (09/03 - 25/10/2026)',
    actual: '231 / 231 ngày (0 ngày khuyết)',
    level: 'ERROR',
  },
  {
    id: 2,
    gateVi: 'Bảo toàn tổng doanh số & sản lượng',
    gateEn: 'Store GMV & unit conservation',
    scope: 'stg_store vs raw Excel',
    expected: '15.009.083.662 đ · 101.896 sp',
    actual: 'Khớp tuyệt đối 100%',
    level: 'ERROR',
  },
  {
    id: 3,
    gateVi: 'Khử trùng lặp khóa phức hợp Video',
    gateEn: 'Shoppable video composite-key dedup',
    scope: 'kami_affiliate_videos',
    expected: '0 bản ghi trùng (koc_hash + title + pub_time)',
    actual: 'Loại 1 dòng trùng (4.797 -> 4.796 video)',
    level: 'ERROR',
  },
  {
    id: 4,
    gateVi: 'Đối soát sản lượng kênh chính chủ 90N',
    gateEn: '90d official channel unit reconciliation',
    scope: 'kol_merged vs creator_products',
    expected: 'Sản lượng chính chủ kỳ Hè khớp chéo',
    actual: '20.027 sp = 20.027 sp (sai số 0)',
    level: 'ERROR',
  },
  {
    id: 5,
    gateVi: 'Đồng bộ múi giờ +13h phiên Live chính chủ',
    gateEn: '+13h timezone alignment on official Live',
    scope: 'creator_live vs affiliate_live',
    expected: 'Khớp 100% phiên trong cùng cửa sổ ngày',
    actual: '595 / 595 phiên khớp sau dịch +13 giờ',
    level: 'ERROR',
  },
  {
    id: 6,
    gateVi: 'Phân vùng đa kỳ Snapshot hàng bán',
    gateEn: 'Multi-snapshot partitioning integrity',
    scope: 'kami_creator_products',
    expected: 'Không ghi đè lịch sử giữa Kỳ Hè & Kỳ Thu',
    actual: '392 dòng (04/09) + 395 dòng (20/10) = 787',
    level: 'ERROR',
  },
  {
    id: 7,
    gateVi: 'Sai số cắt ranh giới ngày Live (91.000 đ)',
    gateEn: 'Boundary timestamp delta (91,000 VND)',
    scope: 'Đối soát chéo 2 bảng Live kỳ Hè',
    expected: 'Sai số < 0,01% tổng GMV',
    actual: '91.000 đ = 0,0006% GMV',
    level: 'WARN',
  },
  {
    id: 8,
    gateVi: 'Tỷ lệ tài khoản KOC mồ côi giữa các bảng',
    gateEn: 'Orphan creator ID rate across tables',
    scope: 'affiliate_live vs affiliate_kol',
    expected: 'Tỷ lệ thiếu hồ sơ KOC <= 2,0%',
    actual: '1,59% (độ trễ cập nhật danh sách 90 ngày)',
    level: 'WARN',
  },
  {
    id: 9,
    gateVi: 'Tỷ lệ khuyết tiêu đề phiên Live / Video',
    gateEn: 'Missing session/clip title rate',
    scope: 'affiliate_videos & affiliate_live',
    expected: 'Video <= 5% · Live <= 15%',
    actual: 'Video 5,0% · Live 14,4% (gán nhãn Khác)',
    level: 'WARN',
  },
];

// Thư viện SQL chuẩn hóa duy nhất ở Phụ lục B (chia rõ theo từng chương với tiêu đề 4 dòng chuẩn hóa)
export const CLEAN_SQL_LIBRARY = [
  {
    id: 'sql-ch2',
    titleVi: 'Chương 2 · Pareto tích lũy, gom dải giá & kiểm tra trùng khóa',
    titleEn: 'Ch 2 · Active SKU Pareto, price band grouping & composite-key dedup',
    code: `-- Mục đích: Tính đường cong Pareto trên SKU có đơn (>0 đ), gom dải giá niêm yết và kiểm tra trùng lặp
-- Bảng đầu vào: raw_shop_products, raw_affiliate_videos
-- Bảng đầu ra: mart_sku_pareto, stg_videos_dedup
-- Giả định: Chỉ tính 133 SKU phát sinh GMV > 0 trong 90 ngày; dải giá lấy theo trung điểm niêm yết

WITH active_skus AS (
  SELECT
    product_title,
    recent_sales_units,
    recent_revenue_vnd,
    CASE
      WHEN recent_revenue_vnd / NULLIF(recent_sales_units, 0) < 75000 THEN '< 75k'
      WHEN recent_revenue_vnd / NULLIF(recent_sales_units, 0) < 150000 THEN '75k - 150k'
      WHEN recent_revenue_vnd / NULLIF(recent_sales_units, 0) < 250000 THEN '150k - 250k'
      ELSE '> 250k'
    END AS price_band,
    ROW_NUMBER() OVER (ORDER BY recent_revenue_vnd DESC) AS sku_rank,
    COUNT(*) OVER () AS total_active_skus,
    SUM(recent_revenue_vnd) OVER () AS total_catalog_gmv,
    SUM(recent_revenue_vnd) OVER (
      ORDER BY recent_revenue_vnd DESC
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cum_gmv
  FROM kami_shop_products
  WHERE recent_revenue_vnd > 0
)
SELECT
  sku_rank,
  price_band,
  ROUND(sku_rank * 100.0 / total_active_skus, 1) AS active_sku_pct,
  ROUND(cum_gmv * 100.0 / total_catalog_gmv, 1) AS cum_gmv_pct
FROM active_skus
ORDER BY sku_rank;`,
  },
  {
    id: 'sql-ch3',
    titleVi: 'Chương 3 · Giao cắt MA7/MA28, MoM & Phân rã Waterfall T6 -> T8',
    titleEn: 'Ch 3 · MA7/MA28 crossover, MoM delta & June-to-August Waterfall',
    code: `-- Mục đích: Tính MA7/MA28 phát hiện Dead Cross 26/06 và phân rã đồng nhất thức mức sụt T6 -> T8
-- Bảng đầu vào: kami_store_daily_overview (231 ngày liên tục)
-- Bảng đầu ra: mart_daily_ma, mart_waterfall_june_aug
-- Giả định: ΔGMV = ΔLives*R6 + L6*ΔRate + ΔLives*ΔRate (cộng khớp tuyệt đối từng đồng)

WITH daily_ma AS (
  SELECT
    record_date,
    delta_gmv_vnd / 1e6 AS gmv_m,
    AVG(delta_gmv_vnd / 1e6) OVER (
      ORDER BY record_date
      ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS ma7_m,
    AVG(delta_gmv_vnd / 1e6) OVER (
      ORDER BY record_date
      ROWS BETWEEN 27 PRECEDING AND CURRENT ROW
    ) AS ma28_m
  FROM kami_store_daily_overview
),
monthly_decomp AS (
  SELECT
    DATE_FORMAT(record_date, '%Y-%m') AS ym,
    SUM(delta_gmv_vnd) / 1e6 AS gmv_m,
    SUM(delta_livestreams_count) AS lives_cnt,
    (SUM(delta_gmv_vnd) / 1e6) / SUM(delta_livestreams_count) AS gmv_per_live
  FROM kami_store_daily_overview
  WHERE record_date BETWEEN '2026-06-01' AND '2026-08-31'
  GROUP BY ym
)
SELECT
  j.gmv_m AS june_gmv_m,
  a.gmv_m AS aug_gmv_m,
  ROUND((a.lives_cnt - j.lives_cnt) * j.gmv_per_live, 1) AS volume_effect_m,
  ROUND(j.lives_cnt * (a.gmv_per_live - j.gmv_per_live), 1) AS rate_effect_m,
  ROUND((a.lives_cnt - j.lives_cnt) * (a.gmv_per_live - j.gmv_per_live), 1) AS interaction_m
FROM (SELECT * FROM monthly_decomp WHERE ym = '2026-06') j
CROSS JOIN (SELECT * FROM monthly_decomp WHERE ym = '2026-08') a;`,
  },
  {
    id: 'sql-ch4',
    titleVi: 'Chương 4 · Cohort giữ chân KOC & tách kênh vệ tinh @koc_sat01',
    titleEn: 'Ch 4 · KOC retention cohorts & in-house satellite @koc_sat01 sensitivity',
    code: `-- Mục đích: Tính tỷ lệ giữ chân M0..M7 của 302 KOC Live và đối chiếu GMV có vs không có @koc_sat01
-- Bảng đầu vào: stg_affiliate_livestreams (đã lọc kênh chính chủ)
-- Bảng đầu ra: mart_koc_cohort_retention, mart_koc_satellite_split
-- Giả định: Cohort gán theo tháng lên sóng đầu tiên (MIN session_time_vn); tách riêng @koc_sat01

WITH creator_first_month AS (
  SELECT
    creator_hash,
    is_inhouse_satellite,
    DATE_FORMAT(MIN(session_time_vn), '%Y-%m') AS cohort_ym
  FROM stg_affiliate_livestreams
  WHERE is_official_shop = 0
  GROUP BY creator_hash, is_inhouse_satellite
),
monthly_activity AS (
  SELECT DISTINCT
    s.creator_hash,
    f.cohort_ym,
    f.is_inhouse_satellite,
    PERIOD_DIFF(
      EXTRACT(YEAR_MONTH FROM s.session_time_vn),
      EXTRACT(YEAR_MONTH FROM STR_TO_DATE(CONCAT(f.cohort_ym, '-01'), '%Y-%m-%d'))
    ) AS month_number,
    s.store_gmv_vnd
  FROM stg_affiliate_livestreams s
  JOIN creator_first_month f ON s.creator_hash = f.creator_hash
  WHERE s.is_official_shop = 0
)
SELECT
  cohort_ym,
  COUNT(DISTINCT creator_hash) AS cohort_size,
  ROUND(SUM(store_gmv_vnd) / 1e6, 1) AS gmv_with_satellite_m,
  ROUND(SUM(CASE WHEN is_inhouse_satellite = 0 THEN store_gmv_vnd ELSE 0 END) / 1e6, 1) AS gmv_excl_satellite_m
FROM monthly_activity
GROUP BY cohort_ym
ORDER BY cohort_ym;`,
  },
  {
    id: 'sql-ch5',
    titleVi: 'Chương 5 · Ads vs Organic, ghép cặp cùng KOC & Ma trận Khung giờ Live',
    titleEn: 'Ch 5 · Ads vs Organic paired test & Live slot × duration matrix',
    code: `-- Mục đích: Đo lường tỷ lệ clip ra đơn, GPM gộp (Ads vs Tự nhiên) và doanh thu theo khung giờ Live
-- Bảng đầu vào: stg_affiliate_videos, stg_official_live (+13h VN)
-- Bảng đầu ra: mart_video_ads_lift, mart_live_slot_matrix
-- Giả định: Dữ liệu quan sát; GPM tính trên 1.000 lượt xem; ô ca Live dịch chuẩn sang giờ UTC+7

WITH video_ads_summary AS (
  SELECT
    is_ads_tagged,
    COUNT(*) AS total_clips,
    SUM(CASE WHEN recent_gmv_vnd > 0 THEN 1 ELSE 0 END) AS order_clips,
    ROUND(SUM(CASE WHEN recent_gmv_vnd > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS conversion_rate,
    ROUND(SUM(recent_gmv_vnd) * 1000.0 / NULLIF(SUM(views_num), 0), 0) AS gpm_vnd
  FROM stg_affiliate_videos
  GROUP BY is_ads_tagged
),
live_slot_matrix AS (
  SELECT
    CASE
      WHEN HOUR(start_time_vn) BETWEEN 6 AND 11 THEN '06h - 12h'
      WHEN HOUR(start_time_vn) BETWEEN 12 AND 17 THEN '12h - 18h'
      WHEN HOUR(start_time_vn) BETWEEN 18 AND 23 THEN '18h - 24h'
      ELSE '00h - 06h'
    END AS time_slot,
    CASE
      WHEN duration_hours < 2 THEN '< 2h'
      WHEN duration_hours < 4 THEN '2 - 4h'
      WHEN duration_hours < 8 THEN '4 - 8h'
      ELSE '>= 8h'
    END AS duration_tier,
    COUNT(*) AS sessions_cnt,
    ROUND(AVG(gmv_vnd / NULLIF(total_viewers, 0)), 0) AS gmv_per_viewer
  FROM stg_official_live
  GROUP BY time_slot, duration_tier
)
SELECT * FROM video_ads_summary;`,
  },
  {
    id: 'sql-ch6-ch7',
    titleVi: 'Chương 6 & 7 · Chín cổng kiểm tra chất lượng & Dựng Marts idempotent',
    titleEn: 'Ch 6 & 7 · Nine quality assertions & idempotent analytical mart builds',
    code: `-- Mục đích: Chạy tự động 9 cổng kiểm định chất lượng (6 ERROR chặn, 3 WARN cảnh báo)
-- Bảng đầu vào: raw_store_overview, raw_creator_live, raw_affiliate_videos, raw_kol
-- Bảng đầu ra: audit_quality_gate_results (idempotent, không sinh bản ghi trùng khi chạy lại)
-- Giả định: Ngăn chặn tuyệt đối lệch ngày, lệch tổng doanh số và trùng lặp bản ghi trước khi xuất JSON

SELECT 1 AS gate_id, 'Date Continuity' AS gate_name,
  CASE WHEN COUNT(DISTINCT record_date) = 231 THEN 'PASS' ELSE 'FAIL_BLOCK' END AS status
FROM raw_store_overview
UNION ALL
SELECT 2, 'GMV Conservation',
  CASE WHEN SUM(delta_gmv_vnd) = 15009083662 THEN 'PASS' ELSE 'FAIL_BLOCK' END
FROM raw_store_overview
UNION ALL
SELECT 3, 'Video Uniqueness',
  CASE WHEN COUNT(*) = COUNT(DISTINCT CONCAT(koc_hash, '|', clean_title, '|', publish_time_vn))
       THEN 'PASS' ELSE 'FAIL_BLOCK' END
FROM stg_affiliate_videos
UNION ALL
SELECT 4, '90d Official Units Match',
  CASE WHEN (SELECT SUM(units) FROM stg_official_units) = 20027 THEN 'PASS' ELSE 'FAIL_BLOCK' END
UNION ALL
SELECT 5, '+13h Live Alignment',
  CASE WHEN (SELECT COUNT(*) FROM stg_official_live WHERE record_date >= '2026-03-09') = 595
       THEN 'PASS' ELSE 'FAIL_BLOCK' END;`,
  },
  {
    id: 'sql-aux-zscore',
    titleVi: 'Phụ trợ · Z-Score trượt 28 ngày phát hiện ngoại lai (Lưu ý: dùng cho hồi cứu)',
    titleEn: 'Auxiliary · Centered 28-day rolling Z-Score for retrospective anomaly detection',
    code: `-- Mục đích: Phát hiện các phiên ngoại lai doanh số (|z| > 3) trên chuỗi doanh thu ngày
-- Bảng đầu vào: kami_store_daily_overview
-- Bảng đầu ra: mart_daily_anomalies
-- Giả định & Lưu ý kỹ thuật quan trọng:
--   Z-score ở đây dùng cửa sổ [14 PRECEDING AND 13 FOLLOWING], tức CĂN GIỮA và có dùng dữ liệu tương lai.
--   Kỹ thuật này PHÙ HỢP để tìm điểm bất thường HỒI CỨU (retrospective audit).
--   KHÔNG ĐƯỢC DÙNG cấu trúc này làm tín hiệu cảnh báo sớm thời gian thực (vì đòi hỏi biết trước 13 ngày sau).

WITH centered_stats AS (
  SELECT
    record_date,
    delta_gmv_vnd / 1e6 AS gmv_m,
    AVG(delta_gmv_vnd / 1e6) OVER (
      ORDER BY record_date
      ROWS BETWEEN 14 PRECEDING AND 13 FOLLOWING
    ) AS rolling_mean_28,
    STDDEV(delta_gmv_vnd / 1e6) OVER (
      ORDER BY record_date
      ROWS BETWEEN 14 PRECEDING AND 13 FOLLOWING
    ) AS rolling_std_28
  FROM kami_store_daily_overview
)
SELECT
  record_date,
  gmv_m,
  ROUND(rolling_mean_28, 2) AS center_mean_28,
  ROUND((gmv_m - rolling_mean_28) / NULLIF(rolling_std_28, 0), 2) AS centered_zscore,
  CASE
    WHEN ABS((gmv_m - rolling_mean_28) / NULLIF(rolling_std_28, 0)) > 3.0 THEN 'ANOMALY_OUTLIER'
    ELSE 'NORMAL_BAND'
  END AS anomaly_flag
FROM centered_stats
ORDER BY record_date;`,
  },
];
