/**
 * About Section: SQL Interactive Demo Data
 * Interactive SQL scenarios for visitors to test in-browser query execution.
 */

const KAMI_ELY_QUERY = `SELECT
    channel_name,
    SUM(gmv_millions) AS total_gmv_m,
    ROUND(SUM(gmv_millions) * 100.0
          / 7400, 2) AS share_pct
FROM kami_ely_sales_logs
GROUP BY channel_name
ORDER BY total_gmv_m DESC;`;

const HERITAGE_JAPAN_QUERY = `SELECT
    year,
    inbound_tourists_millions AS tourists_m,
    total_spend_trillion_yen AS spend_tyen
FROM jnto_heritage_stats
WHERE year BETWEEN '2013' AND '2022'
ORDER BY year ASC;`;

const LIBRARY_BUS_QUERY = `SELECT
    operation_type,
    avg_latency_raw_mysql_ms AS raw_ms,
    avg_latency_with_redis_ms AS cached_ms
FROM bus_telemetry_logs
GROUP BY operation_type;`;

export const SQL_SCENARIOS = [
  {
    id: 'kami-sales',
    title: 'TikTok Shop Channel GMV',
    tag: 'E-Commerce',
    projectId: 'proj-kami-ely',
    query: KAMI_ELY_QUERY,
    executionTime: '12ms',
    data: [
      { name: 'Live Shopping', gmv: 4665, share: '63.0%' },
      { name: 'Short Video', gmv: 1607, share: '21.7%' },
      { name: 'Product Card', gmv: 1128, share: '15.3%' },
    ],
    chartType: 'bar' as const,
    xAxisKey: 'name',
    dataKey: 'gmv',
    unit: 'Triệu đ',
    insight: 'Livestream đóng góp 63.04% tổng doanh số GMV, tỷ lệ chuyển đổi cao gấp 2.8 lần so với video ngắn.',
    insightEn: 'Livestream contributed 63.04% of total GMV with 2.8x higher conversion rate than short-form video.',
  },
  {
    id: 'japan-tourism',
    title: 'Japan Tourist Spending',
    tag: 'Time-Series',
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
    insight: 'Chi tiêu du lịch đạt đỉnh 4.81 nghìn tỷ Yên năm 2019 (+318% so với 2010), chủ yếu từ du khách văn hóa.',
    insightEn: 'Tourism spending peaked at 4.81T Yen in 2019 (+318% vs 2010), largely driven by cultural heritage visitors.',
  },
  {
    id: 'library-perf',
    title: 'Query Latency Benchmark',
    tag: 'Architecture',
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
    insight: 'Redis cache giảm 93.7% độ trễ (450ms xuống 28ms), loại bỏ 100% xung đột giao dịch mượn trùng.',
    insightEn: 'Redis caching reduced latency by 93.7% (450ms to 28ms) and eliminated 100% of double-booking conflicts.',
  },
];

export const CHART_COLORS = ['#9BE7FA', '#FFD14C', '#FFE485', '#C8EEF7'];
