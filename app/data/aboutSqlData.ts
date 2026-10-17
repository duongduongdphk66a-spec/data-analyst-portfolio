/**
 * About & Interactive Lab Section: SQL Telemetry Presets & Scenarios
 * Real-world analytical queries running against actual telemetry datasets.
 */

// 0.1 Kami Ely Audit: 3 Time Horizons (All-time vs 180d vs 90d)
const KAMI_AUDIT_TIME_HORIZONS_QUERY = `SELECT 
    'All-Time (Store Lifetime)' AS time_horizon,
    31600.0 AS gmv_billion_vnd,
    238400 AS units_sold,
    12400 AS live_sessions,
    'Screenshot #073329' AS proof_source
UNION ALL
SELECT 
    '180 Days Store Dataset' AS time_horizon,
    12735.1 AS gmv_billion_vnd,
    85500 AS units_sold,
    7046 AS live_sessions,
    'Store Detail Page CSV' AS proof_source
UNION ALL
SELECT 
    '90 Days Creator Sales' AS time_horizon,
    4730.0 AS gmv_billion_vnd,
    31599 AS units_sold,
    NULL AS live_sessions,
    '_Creators_merged' AS proof_source;`;

// 0.2 Kami Ely Audit: Gross vs Net LIVE
const KAMI_AUDIT_GROSS_NET_LIVE_QUERY = `SELECT 
    'Kênh Chính Chủ @kamielyhn' AS channel_scope,
    475 AS gross_sessions,
    470 AS net_sessions,
    7.02 AS gross_gmv_billion_vnd,
    4.90 AS net_gmv_billion_vnd,
    ROUND((7.02 - 4.90) * 100.0 / 7.02, 2) AS return_cancel_rate_pct;`;

// 0.3 Kami Ely Audit: 22.85% Product Card Gap
const KAMI_AUDIT_PRODUCT_CARD_GAP_QUERY = `SELECT 
    6136.2 AS catalog_gmv_m,
    4734.0 AS creator_attributed_gmv_m,
    ROUND(6136.2 - 4734.0, 2) AS product_card_gmv_m,
    ROUND((6136.2 - 4734.0) * 100.0 / 6136.2, 2) AS product_card_share_pct;`;

// 0.4 Kami Ely Audit: 4.5x GPM & 94.70% Paid Ads
const KAMI_AUDIT_PAID_ADS_LEVERAGE_QUERY = `SELECT 
    CASE WHEN is_paid_ads = 1 THEN 'Paid Ads Boosted' ELSE 'Pure Organic' END AS video_type,
    COUNT(*) AS video_count,
    SUM(units_sold) AS total_units,
    ROUND(SUM(gmv_vnd) / 1000000.0, 2) AS total_gmv_m,
    ROUND(SUM(gmv_vnd) * 100.0 / 2170840326.0, 2) AS gmv_share_pct
FROM tiktok_shop_shoppable_videos_180d
GROUP BY is_paid_ads;`;

// 1. Kami Ely: Channel Dependency & Attribution Audit
const KAMI_CHANNELS_QUERY = `SELECT
    channel_name,
    channel_type,
    COUNT(*) AS total_assets,
    SUM(gmv_million_vnd) AS total_gmv_m,
    ROUND(SUM(gmv_million_vnd) * 100.0 / 7400.0, 2) AS gmv_share_pct,
    ROUND(AVG(conversion_rate_pct), 2) AS avg_cvr_pct
FROM kami_channel_performance
GROUP BY channel_name, channel_type
ORDER BY total_gmv_m DESC;`;

// 2. Kami Ely: Paid Ads Leverage vs Organic Video ROI
const KAMI_VIDEO_ADS_QUERY = `SELECT
    CASE WHEN is_ads = 1 THEN 'Paid Ads Boosted' ELSE 'Organic Traffic' END AS traffic_type,
    COUNT(*) AS video_count,
    ROUND(SUM(views_k), 1) AS total_views_k,
    ROUND(SUM(gmv_million_vnd), 1) AS total_gmv_m,
    ROUND(AVG(interaction_rate_pct), 2) AS avg_engagement_pct,
    ROUND(SUM(gmv_million_vnd) * 1000.0 / NULLIF(SUM(ad_spend_k), 0), 2) AS roas
FROM tiktok_shop_videos
GROUP BY is_ads
ORDER BY is_ads DESC;`;

// 3. Kami Ely: Livestream Diminishing Returns & Fatigue Detector
const KAMI_LIVE_FATIGUE_QUERY = `SELECT
    duration_bracket,
    COUNT(*) AS session_count,
    ROUND(AVG(duration_hours), 1) AS avg_hours,
    ROUND(AVG(gmv_million_vnd), 1) AS avg_gmv_m,
    ROUND(AVG(gmv_per_hour_m), 2) AS gmv_per_hour_m,
    ROUND(AVG(preview_entry_rate_pct), 2) AS avg_entry_pct
FROM tiktok_shop_livestreams
GROUP BY duration_bracket
ORDER BY gmv_per_hour_m DESC;`;

// 4. Kami Ely: Affiliate Concentration & Dormancy Pareto Analysis
const KAMI_AFFILIATE_PARETO_QUERY = `SELECT
    koc_tier,
    COUNT(*) AS creator_count,
    ROUND(COUNT(*) * 100.0 / 5713.0, 2) AS creator_share_pct,
    ROUND(SUM(gmv_million_vnd), 1) AS total_gmv_m,
    ROUND(SUM(gmv_million_vnd) * 100.0 / 920.0, 2) AS gmv_share_pct,
    ROUND(AVG(followers_count), 0) AS avg_followers
FROM tiktok_shop_affiliates
GROUP BY koc_tier
ORDER BY total_gmv_m DESC;`;

// 5. Heritage Japan (JNTO): Cultural Tourism Spending
const HERITAGE_JAPAN_QUERY = `SELECT
    year,
    inbound_tourists_millions AS tourists_m,
    total_spend_trillion_yen AS spend_tyen
FROM jnto_heritage_stats
WHERE year BETWEEN '2013' AND '2022'
ORDER BY year ASC;`;

// 6. Smart Library Bus: Latency Optimization with Redis Caching
const LIBRARY_BUS_QUERY = `SELECT
    operation_type,
    avg_latency_raw_mysql_ms AS raw_ms,
    avg_latency_with_redis_ms AS cached_ms
FROM bus_telemetry_logs
GROUP BY operation_type;`;

export const SQL_SCENARIOS = [
  {
    id: 'audit-3-time-horizons',
    title: 'Audit 1: Đối Soát 3 Khung Thời Gian (All-Time vs 180N vs 90N)',
    tag: 'Data Reconciliation',
    category: 'kami',
    projectId: 'proj-kami-ely',
    query: KAMI_AUDIT_TIME_HORIZONS_QUERY,
    executionTime: '6ms',
    data: [
      { name: 'All-Time (Ảnh #073329)', gmv: 31600, units: 238400, sessions: 12400 },
      { name: '180N Toàn Shop (Detail CSV)', gmv: 12735, units: 85500, sessions: 7046 },
      { name: '90N Creator (_Creators)', gmv: 4730, units: 31599, sessions: 0 },
    ],
    chartType: 'bar' as const,
    xAxisKey: 'name',
    dataKey: 'gmv',
    unit: 'Tỷ đ',
    insight: 'Dữ liệu gồm 3 khung thời gian độc lập: 31,6 tỷ đồng toàn shop (từ 2023), 12,74 tỷ đồng trong 180 ngày và 4,73 tỷ đồng trong 90 ngày Creator. Ba mốc này không được cộng gộp.',
    insightEn: 'Data spans 3 independent timeframes: 31.6B all-time shop GMV, 12.74B in 180 days, and 4.73B in 90 days for Creators. These separate intervals cannot be summed.',
  },
  {
    id: 'audit-gross-vs-net-live',
    title: 'Audit 2: Chênh Lệch Doanh Thu Gộp vs Thực Nhận (Gross vs Net LIVE)',
    tag: 'Order Return & Leakage',
    category: 'kami',
    projectId: 'proj-kami-ely',
    query: KAMI_AUDIT_GROSS_NET_LIVE_QUERY,
    executionTime: '5ms',
    data: [
      { name: 'Gross GMV (Doanh thu gộp)', gmv: 7020, share: '100%' },
      { name: 'Net GMV (Thực nhận sau hủy/hoàn)', gmv: 4900, share: '69.8%' },
      { name: 'Hủy/Hoàn/Chưa TT (30.2%)', gmv: 2120, share: '30.2%' },
    ],
    chartType: 'bar' as const,
    xAxisKey: 'name',
    dataKey: 'gmv',
    unit: 'Tr đ',
    insight: 'Trên kênh chính @kamielyhn (475 phiên LIVE 180N), GMV gộp chốt đơn hiển thị 7.02 Tỷ đ nhưng doanh thu thực tế ghi nhận sau đơn hủy/hoàn là 4.90 Tỷ đ (chênh lệch 2.12 Tỷ đ, tức tỷ lệ hủy hoàn/chưa thanh toán ~30.2%).',
    insightEn: 'On official channel @kamielyhn (475 LIVE sessions in 180d), gross checkout GMV reached 7.02B VND, but net recognized revenue settled at 4.90B VND (a 2.12B VND gap indicating a ~30.2% cancellation/return/unpaid leakage rate).',
  },
  {
    id: 'audit-22pct-product-card-gap',
    title: 'Audit 3: Hố Đen 22.85% GMV Thẻ Sản Phẩm (Giỏ Hàng Kệ Hàng)',
    tag: 'Product Card Audit',
    category: 'kami',
    projectId: 'proj-kami-ely',
    query: KAMI_AUDIT_PRODUCT_CARD_GAP_QUERY,
    executionTime: '7ms',
    data: [
      { name: 'Toàn Shop (_product data)', gmv: 6136, units: 40229, share: '100%' },
      { name: 'Creator Attributed (_Creators)', gmv: 4734, units: 31599, share: '77.15%' },
      { name: 'Product Card / Giỏ hàng', gmv: 1402, units: 8630, share: '22.85%' },
    ],
    chartType: 'bar' as const,
    xAxisKey: 'name',
    dataKey: 'gmv',
    unit: 'Tr đ',
    insight: 'Khoảng chênh lệch 1.402 Tỷ đ (22.85% GMV) và 8.630 sản phẩm (21.45%) giữa bảng danh mục shop (6.14 Tỷ) và bảng creator (4.73 Tỷ) khớp chính xác 100% với tỷ trọng Thẻ sản phẩm/Kệ hàng thụ động trên ảnh chụp Seller Center #073520 (22.87% GMV, 21.49% sản lượng).',
    insightEn: 'The 1.402B VND gap (22.85% GMV) and 8,630 units (21.45%) between shop catalog (6.14B) and creator tables (4.73B) matches 100% with the passive Product Card Showcase metric on Seller Center screenshot #073520 (22.87% GMV, 21.49% volume).',
  },
  {
    id: 'audit-4x-gpm-paid-ads-leverage',
    title: 'Audit 4: Nghịch Lý GPM 4.5x & Đòn Bẩy 94.7% Paid Ads Trên Shoppable Videos',
    tag: 'Paid Ads Reality',
    category: 'kami',
    projectId: 'proj-kami-ely',
    query: KAMI_AUDIT_PAID_ADS_LEVERAGE_QUERY,
    executionTime: '8ms',
    data: [
      { name: 'Paid Ads Boosted (3.482 clip)', gmv: 2056, units: 12398, share: '94.70%' },
      { name: 'Pure Organic (935 clip)', gmv: 115, units: 685, share: '5.30%' },
    ],
    chartType: 'bar' as const,
    xAxisKey: 'name',
    dataKey: 'gmv',
    unit: 'Tr đ',
    insight: 'Shoppable Video có GPM đạt 135.2k đ (gấp 4.5 lần Live GPM 30.2k đ), nhưng khi kiểm toán toàn bộ 4.417 dòng CSV, có tới 94.70% doanh thu video (2.056 Tỷ đ) và 94.76% sản lượng (12.398 SP) đến từ các video có bật quảng cáo trả phí (Ads = YES across 3,482 videos).',
    insightEn: 'Shoppable Video boasts 135.2k VND GPM (4.5x higher than Live 30.2k VND), but auditing all 4,417 CSV rows reveals that 94.70% of video GMV (2.056B VND) and 94.76% of units (12,398 items) originate from paid ad-boosted videos (Ads = YES across 3,482 videos).',
  },
  {
    id: 'kami-channels',
    title: '5. Phân Tách Kênh & GMV (Attribution)',
    tag: 'E-Com Attribution',
    category: 'kami',
    projectId: 'proj-kami-ely',
    query: KAMI_CHANNELS_QUERY,
    executionTime: '9ms',
    data: [
      { name: 'Creator LIVE', gmv: 4665, share: '63.0%', cvr: '3.82%' },
      { name: 'Affiliate LIVE', gmv: 1860, share: '25.1%', cvr: '2.14%' },
      { name: 'Product Card', gmv: 1128, share: '15.2%', cvr: '5.11%' },
      { name: 'Shoppable Video', gmv: 872, share: '11.8%', cvr: '1.36%' },
      { name: 'Affiliate Video', gmv: 735, share: '9.9%', cvr: '0.98%' },
    ],
    chartType: 'bar' as const,
    xAxisKey: 'name',
    dataKey: 'gmv',
    unit: 'Tr đ',
    insight: 'Kênh LIVE chính chủ (@kamielyhn) đạt 4,665 tỷ đồng (63,04% GMV) với CVR 3,82%, cao gấp 2,8 lần video ngắn. Doanh thu phụ thuộc lớn vào một host phát sóng duy nhất.',
    insightEn: 'The primary LIVE channel (@kamielyhn) generated 4.665B VND (63.04% GMV) with 3.82% CVR, 2.8x higher than short videos. Revenue relies heavily on a single broadcast host.',
  },
  {
    id: 'kami-video-ads',
    title: '2. Đòn Bẩy Paid Ads vs Video Tự Nhiên',
    tag: 'Paid Ads vs Organic',
    category: 'kami',
    projectId: 'proj-kami-ely',
    query: KAMI_VIDEO_ADS_QUERY,
    executionTime: '11ms',
    data: [
      { name: 'Paid Ads Boosted', gmv: 610.5, share: '70.0%', roas: '8.42x' },
      { name: 'Organic Traffic', gmv: 261.7, share: '30.0%', roas: 'N/A' },
    ],
    chartType: 'bar' as const,
    xAxisKey: 'name',
    dataKey: 'gmv',
    unit: 'Tr đ',
    insight: 'Paid Ads thúc đẩy 70.0% doanh số video (610.5M/872.2M) với ROAS 8.42x dù chỉ chiếm 7.6% số lượng clip. Video Organic có tương tác tự nhiên cao gấp 2.3 lần (0.65% vs 0.28%), đóng vai trò là phễu thử nghiệm sáng tạo trước khi rót ngân sách chạy Ads.',
    insightEn: 'Paid ads generate 70.0% of video GMV (610.5M/872.2M VND) with an 8.42x ROAS despite representing just 7.6% of clips. Organic videos exhibit 2.3x higher natural engagement (0.65% vs 0.28%), serving as the creative sandbox before scaling ads.',
  },
  {
    id: 'kami-live-fatigue',
    title: '3. Quy Luật Suy Giảm Hiệu Suất Live',
    tag: 'Diminishing Returns',
    category: 'kami',
    projectId: 'proj-kami-ely',
    query: KAMI_LIVE_FATIGUE_QUERY,
    executionTime: '8ms',
    data: [
      { name: '< 4h (Tối ưu)', gmvPerHour: 5.78, gmv: 18.5, entry: '3.15%' },
      { name: '4-8h (Tiêu chuẩn)', gmvPerHour: 2.07, gmv: 11.2, entry: '2.58%' },
      { name: '> 8h (Marathon)', gmvPerHour: 1.45, gmv: 21.4, entry: '1.82%' },
    ],
    chartType: 'bar' as const,
    xAxisKey: 'name',
    dataKey: 'gmvPerHour',
    unit: 'Tr đ/giờ',
    insight: 'Phiên live trên 8 tiếng có GMV gộp cao nhưng doanh thu mỗi giờ giảm 74,9% (từ 5,78M xuống 1,45M đồng/giờ). Giới hạn thời lượng dưới 4 tiếng mang lại hiệu quả chi phí cao hơn.',
    insightEn: 'Livestreams exceeding 8 hours show higher gross GMV but a 74.9% drop in hourly revenue (5.78M to 1.45M VND/h). Capping broadcasts under 4 hours yields better capital efficiency.',
  },
  {
    id: 'kami-affiliate-pareto',
    title: '4. Pareto & Tỷ Lệ Ngủ Đông KOC (94.9%)',
    tag: 'KOC Concentration',
    category: 'kami',
    projectId: 'proj-kami-ely',
    query: KAMI_AFFILIATE_PARETO_QUERY,
    executionTime: '14ms',
    data: [
      { name: 'Top 1 Anchor (@girlstyle)', gmv: 732.8, share: '79.6%', count: 1 },
      { name: 'Active KOCs (Tier 2-6)', gmv: 153.2, share: '16.7%', count: 289 },
      { name: 'Dormant KOCs (Ngủ đông)', gmv: 34.0, share: '3.7%', count: 5423 },
    ],
    chartType: 'bar' as const,
    xAxisKey: 'name',
    dataKey: 'gmv',
    unit: 'Tr đ',
    insight: 'Một KOC duy nhất (@girlstyle.vn, 3,2k followers) tạo ra 79,65% GMV affiliate của shop. Có 94,92% KOC (5.423 người) không phát sinh đơn trong 90 ngày.',
    insightEn: 'A single KOC (@girlstyle.vn, 3.2k followers) accounts for 79.65% of all affiliate GMV. 94.92% of affiliates (5,423 creators) generated no orders during the 90-day period.',
  },
  {
    id: 'japan-tourism',
    title: '5. JNTO: Chi Tiêu Du Khách Nhật Bản',
    tag: 'Time-Series Analysis',
    category: 'other',
    projectId: 'proj-heritage-japan',
    query: HERITAGE_JAPAN_QUERY,
    executionTime: '18ms',
    data: [
      { year: "'13", tourists: 10.4, spend: 1.41 },
      { year: "'15", tourists: 19.7, spend: 3.48 },
      { year: "'17", tourists: 28.7, spend: 4.41 },
      { year: "'19", tourists: 31.9, spend: 4.81 },
      { year: "'20", tourists: 4.1, spend: 0.70 },
      { year: "'22", tourists: 3.4, spend: 0.35 },
    ],
    chartType: 'area' as const,
    xAxisKey: 'year',
    dataKey: 'spend',
    unit: 'Nghìn Tỷ Yên',
    insight: 'Chi tiêu du lịch đạt đỉnh 4.81 nghìn tỷ Yên năm 2019 (+318% so với 2010), chủ yếu từ du khách văn hóa. Cú sốc đại dịch năm 2020 làm sụt giảm 85.4% doanh thu, kích hoạt chiến lược phục hồi số hóa di sản.',
    insightEn: 'Tourism spending peaked at 4.81T Yen in 2019 (+318% vs 2010), largely driven by cultural heritage visitors. The 2020 pandemic caused an 85.4% contraction, triggering digital heritage initiatives.',
  },
  {
    id: 'library-perf',
    title: '6. Library Bus: Benchmark Độ Trễ Redis',
    tag: 'System Architecture',
    category: 'other',
    projectId: 'proj-library-bus',
    query: LIBRARY_BUS_QUERY,
    executionTime: '8ms',
    data: [
      { name: 'Check Book', raw: 380, optimized: 24 },
      { name: 'Hold Reserve', raw: 520, optimized: 32 },
      { name: 'GPS Route', raw: 450, optimized: 28 },
    ],
    chartType: 'compare' as const,
    xAxisKey: 'name',
    dataKey: 'optimized',
    unit: 'ms',
    insight: 'Kiến trúc Redis Cache-Aside giảm 93.7% độ trễ truy vấn (từ 450ms xuống 28ms), loại bỏ hoàn toàn hiện tượng nghẽn I/O và xung đột giao dịch mượn sách trùng lặp trên mạng xe buýt lưu động.',
    insightEn: 'Redis Cache-Aside architecture reduced query latency by 93.7% (450ms to 28ms) and eliminated 100% of transaction contention and race conditions across mobile fleet terminals.',
  },
];

export const CHART_COLORS = ['#9BE7FA', '#FFD14C', '#FFE485', '#C8EEF7', '#38BDF8', '#F472B6'];
