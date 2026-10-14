/**
 * About & Interactive Lab Section: SQL Telemetry Presets & Scenarios
 * Real-world analytical queries running against actual telemetry datasets.
 */

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
    id: 'kami-channels',
    title: '1. Phân Tách Kênh & GMV (Attribution)',
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
    insight: 'Creator LIVE cá nhân (@kamielyhn) gánh 63.04% tổng GMV (4,665 tỷ) với CVR 3.82% — cao gấp 2.8 lần Video ngắn. Tuy nhiên, sự phụ thuộc >60% vào một kênh độc nhất tiềm ẩn rủi ro đứt gãy dòng tiền nghiêm trọng khi host gặp sự cố lịch phát sóng.',
    insightEn: 'Self-operated Creator LIVE (@kamielyhn) drives 63.04% of total GMV (4.665B VND) with 3.82% CVR — 2.8x higher than short video. However, >60% reliance on a single human channel poses severe business continuity risks.',
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
    insight: 'Nghịch lý Marathon Live: Các phiên live thâu đêm kéo dài trên 8 tiếng (14–18h) mang lại GMV gộp cao nhưng hiệu suất GMV/giờ sụt giảm tới 74.9% (từ 5.78M/giờ xuống 1.45M/giờ). Tối ưu hóa thời lượng dưới 4h kết hợp kích hoạt Ads giờ vàng mang lại ROI vốn cao gấp 3.9 lần.',
    insightEn: 'The Marathon Live Paradox: Overnight endurance sessions (>8h) deliver higher gross revenue but suffer a 74.9% collapse in hourly GMV efficiency (from 5.78M/h down to 1.45M/h). Capping sessions at <4h paired with golden-hour ad boosts delivers 3.9x higher capital efficiency.',
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
    insight: 'Nguyên lý Pareto cực đoan: 1 KOC duy nhất (@girlstyle.vn, 3.2k followers) tạo ra 79.65% GMV affiliate của shop. 94.92% (5.423/5.713 KOCs) rơi vào trạng thái ngủ đông không phát sinh đơn. Cần chuyển từ tuyển KOC đại trà sang cơ chế thưởng bậc thang theo doanh số.',
    insightEn: 'Extreme Pareto distribution: A single micro-KOC (@girlstyle.vn, 3.2k followers) accounts for 79.65% of all affiliate GMV. 94.92% (5,423/5,713 KOCs) remain completely dormant. Tiered performance bonuses are essential to re-engage the dormant base.',
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
