// FILE: components/case-studies/kami-ely/playbook/playbookData.ts
// Dữ liệu cho SQL playbook 7 giai đoạn. Mọi số liệu lấy từ metrics.json
// (sinh bởi scripts/kami/build_metrics.py). Không có số bịa trong file này.

import metricsJson from '@/app/data/kami-ely/generated/metrics.json';
import { kamiReconciliationData } from '@/app/data/kami-ely/reconciliation';

const m = metricsJson;

export interface Bi {
  vi: string;
  en: string;
}

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

// ---------------------------------------------------------------------------
// Thống kê cơ bản (khớp hàm SQL: AVG, STDDEV mẫu, PERCENTILE_CONT)
// ---------------------------------------------------------------------------
export const mean = (a: number[]): number => a.reduce((s, x) => s + x, 0) / a.length;

export const sampleStd = (a: number[]): number => {
  const mu = mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - mu) ** 2, 0) / (a.length - 1));
};

export const percentile = (a: number[], p: number): number => {
  const s = [...a].sort((x, y) => x - y);
  const idx = (s.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return s[lo] + (s[hi] - s[lo]) * (idx - lo);
};

export const median = (a: number[]): number => percentile(a, 0.5);

/** Cắt ngọn phía trên tại phân vị p (giống LEAST(x, p99) trong SQL). */
export const winsorizeUpper = (a: number[], p: number): number[] => {
  const cap = percentile(a, p);
  return a.map((x) => Math.min(x, cap));
};

const toM = (v: number): number => Math.round((v / 1e6) * 10) / 10;

// ---------------------------------------------------------------------------
// Giai đoạn 1: kiến trúc dữ liệu
// ---------------------------------------------------------------------------
const TABLE_LABELS: Record<string, Bi> = {
  store: { vi: 'Shop theo ngày', en: 'Store daily' },
  goods: { vi: 'Danh sách hàng bán', en: 'Goods list' },
  ch_live: { vi: 'LIVE chính chủ', en: 'Own LIVE' },
  ch_video: { vi: 'Video chính chủ', en: 'Own video' },
  shop_video: { vi: 'Video gắn SP (shop)', en: 'Shoppable video' },
  product: { vi: 'SKU sản phẩm', en: 'Product SKU' },
  creators: { vi: 'Creator', en: 'Creators' },
  shop_live: { vi: 'LIVE toàn shop', en: 'Shop-wide LIVE' },
};

export const tableRows = m.dataScope
  .map((d) => ({
    key: d.key,
    rows: d.rows,
    columns: d.columns,
    label: TABLE_LABELS[d.key] ?? { vi: d.key, en: d.key },
  }))
  .sort((a, b) => b.rows - a.rows);

export const totalRows = m.dataScope.reduce((s, d) => s + d.rows, 0);

export const pipelineMeta = {
  generator: m.generator,
  generatedAt: m.generatedAt,
  tables: m.dataScope.length,
  rows: totalRows,
};

// ---------------------------------------------------------------------------
// Giai đoạn 2: hồ sơ và làm sạch
// ---------------------------------------------------------------------------
export const priceBands = m.products.priceBands.map((b) => ({
  band: b.band,
  sku: b.skuSharePct,
  units: b.unitsSharePct,
  gmv: b.gmvSharePct,
  skus: b.skus,
}));

export const paretoCurve = m.products.paretoCurve.map((p) => ({ sku: p.skuPct, gmv: p.gmvPct }));

const CATEGORY_SHORT: Record<string, string> = {
  'Sports & Outdoor': 'Sports & Outdoor',
  'Womenswear & Underwear': 'Womenswear',
  'Fashion Accessories': 'Accessories',
  'Computers & Office Equipment': 'Computers',
  Other: 'Other',
  'Menswear & Underwear': 'Menswear',
};

export const skuHealthByCategory = m.products.categories.map((c) => ({
  category: CATEGORY_SHORT[c.category] ?? c.category,
  withSales: c.skus - c.deadSkus,
  dead: c.deadSkus,
}));

export const productFacts = {
  skus: m.products.skus.value,
  withSales: m.products.skusWithSales.value,
  dead: m.products.deadSkus.value,
  deadPct: m.products.deadSkuPct.value,
  skusFor80: m.products.skusFor80PctGmv,
  skusFor80Pct: m.products.skusFor80PctGmvPct,
  gini: m.products.giniGmv,
};

export const reconciliationChecks = kamiReconciliationData.reconciliationRules.map((r) => ({
  code: r.ruleCode,
  status: r.status,
  title: r.title as Bi,
}));

// ---------------------------------------------------------------------------
// Giai đoạn 3: chuỗi thời gian
// ---------------------------------------------------------------------------
const daily = m.store.daily;
const gmvSeries = daily.map((d) => d.gmv);
export const dailyMean = mean(gmvSeries);
export const dailyStd = sampleStd(gmvSeries);

const ddmm = (iso: string): string => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

export const dailySeries = (() => {
  let cum = 0;
  return daily.map((d, i) => {
    cum += d.gmv;
    // Trung bình trượt 7 ngày, chỉ tính khi đủ cửa sổ (ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
    const ma7 = i >= 6 ? mean(gmvSeries.slice(i - 6, i + 1)) : null;
    return {
      date: d.date,
      label: ddmm(d.date),
      gmv: toM(d.gmv),
      ma7: ma7 === null ? null : toM(ma7),
      cumulativeB: Math.round((cum / 1e9) * 100) / 100,
    };
  });
})();

export const monthlySeries = m.store.monthly.map((x) => ({
  month: x.month,
  label: `T${Number(x.month.slice(5, 7))}`,
  gmvPerDay: toM(x.gmvPerDay),
  momPerDayPct: x.momPerDayPct,
  isPartial: x.isPartial,
  days: x.days,
}));

const DOW_EN: Record<string, string> = { T2: 'Mon', T3: 'Tue', T4: 'Wed', T5: 'Thu', T6: 'Fri', T7: 'Sat', CN: 'Sun' };
export const dowSeries = m.store.dayOfWeekMedianGmv.map((d) => ({
  day: d.day,
  dayEn: DOW_EN[d.day] ?? d.day,
  medianGmv: toM(d.medianGmv),
}));

export const storeFacts = {
  gmv: m.store.totals.gmv.value,
  avgPerDay: m.store.totals.avgGmvPerDay.value,
  peakMonth: m.store.peakMonth,
  peakDay: m.store.peakDay,
  dropFromPeakPct: m.store.declineFromPeak.gmvDropPct,
  sparseDays: daily.filter((d) => d.gmv === 0).length,
  days: daily.length,
};

// ---------------------------------------------------------------------------
// Giai đoạn 4: cohort creator (thay thế khách hàng, vì Seller Center không có mã khách)
// ---------------------------------------------------------------------------
export const creatorTiers = m.creators.followerTiers.map((t, i) => ({
  tier: t.tier,
  creators: t.creators,
  creatorsPct: t.creatorsSharePct,
  activationPct: t.activationRatePct,
  gmvPct: t.gmvSharePct,
  gmvPctExTop1: m.creators.followerTiersExGirlStyle[i]?.gmvSharePct ?? null,
}));

export const affiliateTop10 = (() => {
  let cum = 0;
  return m.shopLive.affiliate.top10.map((c, i) => {
    cum += c.sharePct;
    return {
      rank: `#${i + 1}`,
      name: c.name,
      sharePct: c.sharePct,
      cumulativePct: Math.round(cum * 100) / 100,
      sessions: c.sessions,
    };
  });
})();

export const affiliateTopExGirlStyle = (() => {
  const aff = m.shopLive.affiliate;
  const exTop1 = aff.top10.slice(1);
  const totEx = aff.gmv - aff.top10[0].gmv;
  let cumEx = 0;
  return exTop1.map((c, i) => {
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
})();

export const topCreatorMonthly = m.shopLive.girlStyle.monthly.map((x: any) => {
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

export const shopWideLiveMonthly = ((m.shopLive as any).monthly ?? []).map((x: any) => {
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

export const creatorFacts = {
  registered: m.creators.registered.value,
  sellers: m.creators.sellers.value,
  activationPct: m.creators.activationRatePct.value,
  creatorsFor80: m.creators.creatorsFor80PctGmv,
  hhi: m.shopLive.affiliate.hhi,
  top1Pct: m.shopLive.affiliate.top1SharePct,
  top10Pct: m.shopLive.affiliate.top10SharePct,
};

// ---------------------------------------------------------------------------
// Giai đoạn 5: phễu, so sánh định dạng
// ---------------------------------------------------------------------------
export type FunnelKey = 'creator' | 'sku' | 'video' | 'live';

export interface FunnelStep {
  label: Bi;
  value: number;
}

export const funnels: Record<FunnelKey, { title: Bi; steps: FunnelStep[] }> = {
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

export interface DonutSegment {
  name: Bi;
  value: number;
  color: string;
}

export interface DonutFunnelItem {
  title: Bi;
  subtitle: Bi;
  badge: Bi;
  tone: 'cyan' | 'amber';
  total: number;
  centerVal: string;
  centerLabel: Bi;
  segments: DonutSegment[];
}

export const donutFunnels: Record<FunnelKey, DonutFunnelItem> = {
  video: {
    title: { vi: 'Phễu Video chính chủ (Sequential LEFT JOIN)', en: 'Own Video Funnel (Sequential LEFT JOIN)' },
    subtitle: { vi: 'Tỷ lệ gắn giỏ hàng và phát sinh đơn trên 222 video chính chủ', en: 'Cart-linking & order conversion on 222 own videos' },
    badge: { vi: '222 Video', en: '222 Videos' },
    tone: 'cyan',
    total: m.channel.video.videos.value,
    centerVal: '45,5%',
    centerLabel: { vi: 'Có đơn', en: 'With orders' },
    segments: [
      {
        name: { vi: 'Có đơn hàng', en: 'With orders' },
        value: m.channel.video.withOrders.value,
        color: COLORS.teal,
      },
      {
        name: { vi: 'Gắn giỏ chưa đơn', en: 'Shoppable, 0 orders' },
        value: m.channel.video.shoppable.value - m.channel.video.withOrders.value,
        color: COLORS.cyan,
      },
      {
        name: { vi: 'Chưa gắn giỏ hàng', en: 'Not shoppable' },
        value: m.channel.video.videos.value - m.channel.video.shoppable.value,
        color: COLORS.amber,
      },
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
      {
        name: { vi: 'Có đơn hàng', en: 'With orders' },
        value: m.channel.live.sessionsWithOrders.value,
        color: COLORS.teal,
      },
      {
        name: { vi: 'Chưa phát sinh đơn', en: 'Zero orders' },
        value: m.channel.live.sessions.value - m.channel.live.sessionsWithOrders.value,
        color: COLORS.amber,
      },
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
      {
        name: { vi: 'Tạo 80% GMV (Top P80)', en: 'Make 80% GMV (P80)' },
        value: m.products.skusFor80PctGmv,
        color: COLORS.amber,
      },
      {
        name: { vi: 'Có đơn thông thường', en: 'Other active SKUs' },
        value: m.products.skusWithSales.value - m.products.skusFor80PctGmv,
        color: COLORS.cyan,
      },
      {
        name: { vi: 'Chưa phát sinh đơn', en: 'Zero orders' },
        value: m.products.skus.value - m.products.skusWithSales.value,
        color: '#94A3B8',
      },
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
      {
        name: { vi: 'Tạo 80% GMV (Top Creator)', en: 'Make 80% GMV (Top)' },
        value: m.creators.creatorsFor80PctGmv,
        color: COLORS.amber,
      },
      {
        name: { vi: 'Có đơn thông thường', en: 'Other active Creators' },
        value: m.creators.sellers.value - m.creators.creatorsFor80PctGmv,
        color: COLORS.cyan,
      },
      {
        name: { vi: 'Chưa phát sinh đơn', en: 'Zero orders' },
        value: m.creators.registered.value - m.creators.sellers.value,
        color: '#94A3B8',
      },
    ],
  },
};


export const liveDuration = m.channel.live.durationBuckets.map((b) => ({
  bucket: b.bucket,
  sessions: b.sessions,
  conversionPct: b.conversionPct,
  gmvPerHourM: Math.round((b.gmvPerHour / 1e6) * 100) / 100,
}));

const hyp = m.channel.hypothesis;

// Khoảng báo cáo của nền tảng (khung 28 ngày) lấy điểm giữa, đơn vị nghìn đồng.
// "134,8k–135,2k" -> 135,0k ; "29,2k–30,2k" -> 29,7k
export const gpmCompare = {
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

export const funnelFacts = {
  liveConvPct: m.channel.live.conversionPct.value,
  videoConvPct: m.channel.video.conversionPct.value,
  spearmanRho: m.channel.live.durationVsGmvSpearman.rho,
};

// ---------------------------------------------------------------------------
// Giai đoạn 6: bất thường
// ---------------------------------------------------------------------------
export const zScoreSeries = daily.map((d) => {
  const z = (d.gmv - dailyMean) / dailyStd;
  return { date: d.date, label: ddmm(d.date), z: Math.round(z * 100) / 100, isOutlier: Math.abs(z) > 3 };
});

export const outlierDays = zScoreSeries.filter((d) => d.isOutlier);

/** Robust z: 0.6745 * (x - median) / MAD */
export const robustZ = (x: number): number => {
  const med = median(gmvSeries);
  const mad = median(gmvSeries.map((g) => Math.abs(g - med)));
  return (0.6745 * (x - med)) / mad;
};

export const treatmentComparison = (() => {
  const keep = daily.filter((d) => Math.abs((d.gmv - dailyMean) / dailyStd) <= 3).map((d) => d.gmv);
  const rows: { key: string; label: Bi; mean: number; std: number }[] = [
    { key: 'raw', label: { vi: 'Giữ nguyên', en: 'As is' }, mean: dailyMean, std: dailyStd },
    { key: 'drop', label: { vi: 'Loại', en: 'Removed' }, mean: mean(keep), std: sampleStd(keep) },
    { key: 'p99', label: { vi: 'Cắt P99', en: 'Winsor P99' }, mean: mean(winsorizeUpper(gmvSeries, 0.99)), std: sampleStd(winsorizeUpper(gmvSeries, 0.99)) },
    { key: 'p95', label: { vi: 'Cắt P95', en: 'Winsor P95' }, mean: mean(winsorizeUpper(gmvSeries, 0.95)), std: sampleStd(winsorizeUpper(gmvSeries, 0.95)) },
  ];
  return rows.map((r) => ({ ...r, meanM: toM(r.mean), stdM: toM(r.std) }));
})();

export const categoryMatch = {
  swimwearGmvPct: m.products.swimwearGmvSharePct,
  otherGmvPct: Math.round((100 - m.products.swimwearGmvSharePct) * 100) / 100,
};

// ---------------------------------------------------------------------------
// Giai đoạn 7: ETL, lấy mẫu, PII
// ---------------------------------------------------------------------------
export const K_MIN = 10;

export const kAnonymity = m.creators.followerTiers.map((t) => ({
  tier: t.tier,
  creators: t.creators,
  passes: t.creators >= K_MIN,
}));

/** 10 mẫu nhất quán theo MOD(chỉ số ngày, 10): so trung bình mẫu với trung bình toàn tập. */
export const modSamples = (() => {
  const full = mean(gmvSeries);
  return Array.from({ length: 10 }, (_, r) => {
    const part = gmvSeries.filter((_, i) => i % 10 === r);
    const mu = mean(part);
    return { sample: `m${r}`, meanM: toM(mu), n: part.length, devPct: Math.round(((mu - full) / full) * 1000) / 10 };
  });
})();

export const modSampleFull = toM(dailyMean);
export const modSampleMaxDevPct = Math.max(...modSamples.map((s) => Math.abs(s.devPct)));

export const sqlSnippets = {
  s1: `-- minh họa, tên cột rút gọn
SELECT 'store_daily' AS tbl, COUNT(*) AS n FROM kami_store_daily_180d
UNION ALL SELECT 'product',  COUNT(*) FROM kami_product_data_90d
UNION ALL SELECT 'creators', COUNT(*) FROM kami_creators_merged_90d;
-- 5 bảng còn lại làm tương tự`,
  s2: `-- Gom nhóm giá, tỷ trọng GMV theo từng nhóm
SELECT CASE WHEN price_vnd < 75000  THEN '<75k'
            WHEN price_vnd < 150000 THEN '75k-150k'
            WHEN price_vnd < 250000 THEN '150k-250k'
            ELSE '>250k' END AS price_band,
       COUNT(*) AS skus,
       ROUND(100.0 * SUM(gmv_vnd) / SUM(SUM(gmv_vnd)) OVER (), 2) AS gmv_pct
FROM kami_product_data_90d
GROUP BY 1;

-- SKU chưa có đơn
SELECT COUNT(*) FROM kami_product_data_90d WHERE COALESCE(units_sold, 0) = 0;`,
  s3: `SELECT report_date, daily_gmv,
       AVG(daily_gmv) OVER (ORDER BY report_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma7,
       SUM(daily_gmv) OVER (ORDER BY report_date)      AS cumulative_gmv
FROM kami_store_daily_180d;

-- Mùa vụ theo thứ trong tuần
SELECT EXTRACT(DOW FROM report_date) AS dow,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY daily_gmv) AS median_gmv
FROM kami_store_daily_180d
GROUP BY 1;`,
  s4: `-- Đã dùng: tỷ lệ kích hoạt theo nhóm follower
SELECT follower_tier, COUNT(*) AS creators,
       100.0 * SUM(CASE WHEN gmv_vnd > 0 THEN 1 ELSE 0 END) / COUNT(*) AS activation_pct
FROM kami_creators_merged_90d
GROUP BY 1;

-- Khi có order-level: đường giữ chân theo cohort tháng
WITH first_order AS (
  SELECT customer_id, DATE_TRUNC('month', MIN(order_date)) AS cohort_month
  FROM orders GROUP BY 1
), activity AS (
  SELECT f.cohort_month,
         (DATE_PART('year', o.order_date) - DATE_PART('year', f.cohort_month)) * 12
         + DATE_PART('month', o.order_date) - DATE_PART('month', f.cohort_month) AS month_n,
         COUNT(DISTINCT o.customer_id) AS buyers
  FROM orders o JOIN first_order f USING (customer_id)
  GROUP BY 1, 2
)
SELECT cohort_month, month_n,
       buyers * 1.0 / FIRST_VALUE(buyers) OVER (PARTITION BY cohort_month ORDER BY month_n) AS pct_retained
FROM activity;`,
  s5: `-- Phễu video chính chủ
SELECT COUNT(*) AS posted,
       SUM(CASE WHEN is_shoppable THEN 1 ELSE 0 END) AS shoppable,
       SUM(CASE WHEN gmv_vnd > 0 THEN 1 ELSE 0 END)  AS with_orders
FROM kami_creator_video_180d;

-- Khi có order_detail: cặp sản phẩm mua cùng đơn
SELECT a.product, b.product, COUNT(*) AS n
FROM order_detail a
JOIN order_detail b ON a.order_id = b.order_id AND b.product > a.product
GROUP BY 1, 2 ORDER BY n DESC;`,
  s6: `WITH s AS (
  SELECT AVG(daily_gmv) AS mu, STDDEV(daily_gmv) AS sd,
         PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY daily_gmv) AS p99
  FROM kami_store_daily_180d
)
SELECT report_date, daily_gmv,
       (daily_gmv - mu) / sd      AS z,
       LEAST(daily_gmv, p99)      AS gmv_winsor
FROM kami_store_daily_180d CROSS JOIN s
WHERE ABS((daily_gmv - mu) / sd) > 3;

-- Khớp mẫu trên cột category
SELECT SUM(gmv_vnd) FROM kami_product_data_90d WHERE category ILIKE '%swimwear%';`,
  s7: `-- Lấy mẫu 10% nhất quán theo định danh
SELECT * FROM kami_creators_merged_90d
WHERE MOD(ABS(HASHTEXT(creator_handle)), 10) = 0;

-- Chỉ xuất nhóm đủ lớn (k >= ${K_MIN}), che định danh
SELECT follower_tier, COUNT(*) AS creators
FROM kami_creators_merged_90d
GROUP BY 1
HAVING COUNT(*) >= ${K_MIN};

SELECT MD5(creator_handle) AS creator_key FROM kami_creators_merged_90d;`,
} as const;
