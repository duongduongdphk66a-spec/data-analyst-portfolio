// FILE: components/case-studies/kami-ely/playbook/playbookData.ts
// Re-export bridge to centralized backend engine (app/lib/kamiElyStagesData.ts).
// Ensures 100% backward compatibility for tests while removing data duplication.

import {
  COLORS,
  mean,
  sampleStd,
  percentile,
  median,
  winsorizeUpper,
  buildKamiEly7StagesPayload,
} from '@/app/lib/kamiElyStagesData';

export { COLORS, mean, sampleStd, percentile, median, winsorizeUpper };

export interface Bi {
  vi: string;
  en: string;
}

const payload = buildKamiEly7StagesPayload();

// Stage 1
export const tableRows = payload.stage1.tableRows;
export const totalRows = payload.stage1.totalRows;
export const pipelineMeta = payload.stage1.pipelineMeta;

// Stage 2
export const priceBands = payload.stage2.priceBands;
export const paretoCurve = payload.stage2.paretoCurve;
export const skuHealthByCategory = payload.stage2.skuHealthByCategory;
export const productFacts = payload.stage2.productFacts;
export const reconciliationChecks = payload.stage2.reconciliationChecks;

// Stage 3
export const dailySeries = payload.stage3.dailySeries;
export const weeklySeries = payload.stage3.weeklySeries;
export const monthlySeries = payload.stage3.monthlySeries;
export const dowSeries = payload.stage3.dowSeries;
export const storeFacts = payload.stage3.storeFacts;
export const dailyMean = payload.stage3.dailyMean;
export const dailyStd = payload.stage3.dailyStd;

// Stage 4
export const creatorTiers = payload.stage4.creatorTiers;
export const affiliateTop10 = payload.stage4.affiliateTop10;
export const affiliateTopExGirlStyle = payload.stage4.affiliateTopExGirlStyle;
export const topCreatorMonthly = payload.stage4.topCreatorMonthly;
export const shopWideLiveMonthly = payload.stage4.shopWideLiveMonthly;
export const creatorFacts = payload.stage4.creatorFacts;

// Stage 5
export const funnels = payload.stage5.funnels;
export const donutFunnels = payload.stage5.donutFunnels;
export const liveDuration = payload.stage5.liveDuration;
export const gpmCompare = payload.stage5.gpmCompare;
export const funnelFacts = payload.stage5.funnelFacts;

// Stage 6
export const zScoreSeries = payload.stage6.zScoreSeries;
export const outlierDays = payload.stage6.outlierDays;
export const treatmentComparison = payload.stage6.treatmentComparison;
export const categoryMatch = payload.stage6.categoryMatch;

export const robustZ = (x: number): number => {
  const gmvSeries = dailySeries.map((d) => d.gmv * 1e6);
  const med = median(gmvSeries);
  const mad = median(gmvSeries.map((g) => Math.abs(g - med)));
  return (0.6745 * (x - med)) / (mad || 1);
};

// Stage 7
export const K_MIN = 10;
export const kAnonymity = payload.stage7.kAnonymity;

const toM = (v: number): number => Math.round((v / 1e6) * 10) / 10;
const gmvSeries = dailySeries.map((d) => d.gmv * 1e6);

export const modSamples = (() => {
  const full = mean(gmvSeries);
  return Array.from({ length: 10 }, (_, r) => {
    const part = gmvSeries.filter((_, i) => i % 10 === r);
    const mu = mean(part);
    return { sample: `m${r}`, meanM: toM(mu), n: part.length, devPct: Math.round(((mu - full) / (full || 1)) * 1000) / 10 };
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
  s4: `-- 1. Ma trận retention creator affiliate theo tuổi tháng (SQLite)
WITH cm AS (                          -- creator x tháng hoạt động
  SELECT creator_id, strftime('%Y-%m', start_ts) AS ym
  FROM stg_live
  WHERE live_type = 'Affiliate LIVE'
  GROUP BY 1, 2
),
first_m AS (
  SELECT creator_id, MIN(ym) AS cohort FROM cm GROUP BY 1
),
aged AS (
  SELECT f.cohort,
         (CAST(substr(c.ym,1,4) AS INT) - CAST(substr(f.cohort,1,4) AS INT)) * 12
         + CAST(substr(c.ym,6,2) AS INT) - CAST(substr(f.cohort,6,2) AS INT) AS age,
         c.creator_id
  FROM cm c JOIN first_m f USING (creator_id)
)
SELECT cohort, age,
       COUNT(DISTINCT creator_id) AS active,
       ROUND(100.0 * COUNT(DISTINCT creator_id)
         / FIRST_VALUE(COUNT(DISTINCT creator_id)) OVER (PARTITION BY cohort ORDER BY age), 1) AS retention_pct
FROM aged
WHERE cohort < '2026-09' AND (cohort || age <= '2026-08') -- loại bỏ các ô bị cắt phải (T9)
GROUP BY cohort, age;`,
  s5: `-- 1. So sánh Ads = YES vs NO trên Shoppable Videos (SQLite)
SELECT ads,
       COUNT(*) AS total_videos,
       SUM(CASE WHEN "[90 days]GMV" > 0 THEN 1 ELSE 0 END) AS videos_with_orders,
       ROUND(100.0 * SUM(CASE WHEN "[90 days]GMV" > 0 THEN 1 ELSE 0 END) / COUNT(*), 2) AS order_rate_pct,
       ROUND(AVG(views), 0) AS mean_views,
       ROUND(SUM("[90 days]GMV"), 0) AS total_gmv,
       ROUND(1000.0 * SUM("[90 days]GMV") / SUM(views), 0) AS gmv_per_1k_views
FROM stg_shoppable_videos
GROUP BY ads;

-- 2. So sánh hiệu số tỷ lệ có đơn trong cùng creator (Paired Comparison)
WITH creator_ads_perf AS (
  SELECT "creator ID" AS creator_id, ads, COUNT(*) AS n_videos,
         1.0 * SUM(CASE WHEN "[90 days]GMV" > 0 THEN 1 ELSE 0 END) / COUNT(*) AS pos_rate
  FROM stg_shoppable_videos
  GROUP BY 1, 2
)
SELECT y.creator_id, y.n_videos AS n_ads, o.n_videos AS n_organic,
       ROUND(100.0 * (y.pos_rate - o.pos_rate), 2) AS diff_pos_rate_pct
FROM creator_ads_perf y
JOIN creator_ads_perf o
  ON y.creator_id = o.creator_id AND y.ads = 'YES' AND o.ads = 'NO';`,
  s6: `-- 1. Z-Score cục bộ theo cửa sổ trượt 28 ngày không cần STDDEV (SQLite)
WITH w AS (
  SELECT date, gmv,
         AVG(gmv)        OVER win AS m,
         AVG(gmv * gmv)  OVER win AS m2
  FROM stg_store
  WINDOW win AS (ORDER BY date ROWS BETWEEN 14 PRECEDING AND 13 FOLLOWING)
)
SELECT date, gmv,
       ROUND(m, 0) AS rolling_mean_28d,
       ROUND(SQRT(NULLIF(m2 - m * m, 0)), 0) AS rolling_std_28d,
       ROUND((gmv - m) / NULLIF(SQRT(m2 - m * m), 0), 2) AS z_local
FROM w
WHERE ABS((gmv - m) / NULLIF(SQRT(m2 - m * m), 0)) > 2.5
ORDER BY ABS(z_local) DESC;

-- 2. Phân loại danh mục từ tiêu đề video
SELECT CASE
         WHEN LOWER(video_title) GLOB '*bikini*' OR LOWER(video_title) GLOB '*đồ bơi*' THEN 'Bikini / Đồ bơi'
         WHEN LOWER(video_title) GLOB '*váy*' OR LOWER(video_title) GLOB '*đầm*' THEN 'Váy / Đầm'
         ELSE 'Khác / Chưa phân loại'
       END AS cat_label,
       COUNT(*) AS n_videos,
       ROUND(100.0 * SUM(CASE WHEN gmv_vnd > 0 THEN 1 ELSE 0 END) / COUNT(*), 1) AS conv_pct
FROM stg_shoppable_videos GROUP BY 1;`,
  s7: `-- 1. Kiểm tra 8 Cổng Chất Lượng Dữ Liệu Tự Động (Quality Gates)
SELECT COUNT(DISTINCT date) AS active_days,
       CASE WHEN COUNT(DISTINCT date) = 180 THEN 'PASSED' ELSE 'FAILED' END AS gate_1_180d,
       SUM(units) AS store_units,
       CASE WHEN SUM(units) = 85500 THEN 'PASSED (85.500 sp)' ELSE 'FAILED' END AS gate_2_units,
       SUM(gmv) AS store_gmv,
       CASE WHEN SUM(gmv) = 12735128067 THEN 'PASSED (12,735B)' ELSE 'FAILED' END AS gate_2_gmv
FROM stg_store_daily;

-- 2. Bí danh hóa Creator PII (Salted SHA-256)
SELECT SUBSTR(HEX(SHA256('KAMI_ELY_SALT_2026' || creator_id)), 1, 10) AS creator_key,
       follower_tier,
       ROUND(gmv_vnd / 1e6, 0) AS gmv_millions_rounded
FROM stg_creators;`,
} as const;
