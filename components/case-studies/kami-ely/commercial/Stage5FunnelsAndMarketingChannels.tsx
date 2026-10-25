'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Coins,
  Copy,
  Database,
  ShieldAlert,
  Sparkles,
  TerminalSquare,
  Video,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Label,
  LabelList,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { COLORS } from '../playbook/playbookData';
import {
  ChartCard,
  ChartTooltip,
  Chip,
  GRID_STROKE,
  TEXT_FILL_CLASS,
  axisTick,
  legendFormatter,
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import type { Stage5Payload } from '@/app/types/caseStudies';
import { buildStage5Data } from '@/app/lib/kamiElyStagesData';

export interface Stage5Props {
  data?: Stage5Payload;
}

export default function Stage5FunnelsAndMarketingChannels(props?: Stage5Props) {
  const { L, n } = usePlaybookLang();
  const [adsTab, setAdsTab] = useState<'overall' | 'within_creator' | 'tiers' | 'ex_dominant' | 'last_90d'>('overall');
  const [activeSqlTab, setActiveSqlTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const stageData = props?.data || buildStage5Data();
  const monthlyOwnLiveFunnel = stageData.monthlyOwnLiveFunnel;

  // 5.3.E: Phân tích Ads vs Organic trên Shoppable Videos
  const adsComparisonCards = {
    overall: {
      title: L('1. Toàn bộ mẫu (3.482 Ads vs 935 Organic)', '1. Full Sample (3,482 Ads vs 935 Organic)'),
      desc: L('Quảng cáo giúp tăng mạnh lượt xem và tỷ lệ có đơn, nhưng GMV trên 1.000 lượt xem (GPM) lại thấp hơn Organic.', 'Ads drastically boost views and conversion probability, but GMV per 1,000 views is lower than Organic.'),
      rows: [
        { metric: L('Số lượng video', 'Video Count'), ads: '3.482', organic: '935', note: L('Ads chiếm 78,8% tổng video', 'Ads accounts for 78.8% of all videos') },
        { metric: L('Tỷ lệ video có đơn', 'Positive Order Rate'), ads: '26,2% (911)', organic: '5,2% (49)', note: L('Odds Ratio = 6,41 (p < 0,001, Fisher)', 'Odds Ratio = 6.41 (p < 0.001, Fisher)'), highlight: true },
        { metric: L('Lượt xem trung vị', 'Median Views'), ads: '609', organic: '154', note: L('Mann-Whitney U = 2,39M (p < 0,001)', 'Mann-Whitney U = 2.39M (p < 0.001)') },
        { metric: L('Lượt xem trung bình', 'Mean Views'), ads: '8.303', organic: '1.522', note: L('Gấp 5,5 lần Organic', '5.5x higher than Organic') },
        { metric: L('Tổng GMV (VND)', 'Total GMV (VND)'), ads: '2,06 Tỷ đ', organic: '115,1 Tr đ', note: L('Ads chiếm 94,7% GMV video giỏ hàng', 'Ads generates 94.7% of shoppable GMV') },
        { metric: L('GMV / 1.000 lượt xem (GPM)', 'GMV / 1,000 Views (GPM)'), ads: '71.103 đ', organic: '80.874 đ', note: L('Organic cao hơn 13,7%!', 'Organic is 13.7% higher!'), highlight: true, tone: 'amber' },
      ],
    },
    within_creator: {
      title: L('2. So sánh trong cùng Creator (175 creator có cả Ads và Organic)', '2. Within-Creator Paired Comparison (175 creators with both)'),
      desc: L('Kiểm soát đặc tính cá nhân của creator: tỷ lệ có đơn của video Ads vẫn cao hơn trung bình +10,40%.', 'Controls for individual creator skill: Ads order rate is on average +10.40% higher within the same creator.'),
      rows: [
        { metric: L('Số creator có cả 2 loại video', 'Creators with both video types'), ads: '175 creator', organic: '175 creator', note: L('Mẫu đối chứng nội bộ chuẩn xác', 'Rigorous within-subject sample') },
        { metric: L('Chênh lệch tỷ lệ có đơn TB (YES - NO)', 'Mean paired rate difference'), ads: '+10,40%', organic: '0,00%', note: L('Wilcoxon signed-rank stat = 364 (p = 1,68e-5)', 'Wilcoxon signed-rank stat = 364 (p = 1.68e-5)'), highlight: true },
        { metric: L('Creator có Ads hiệu quả hơn Organic', 'Creators where Ads > Organic'), ads: '53 creator (30,3%)', organic: '—', note: L('Tỷ lệ có đơn tăng rõ rệt', 'Marked positive uplift') },
        { metric: L('Creator có kết quả bằng nhau', 'Creators where Ads == Organic'), ads: '113 creator (64,6%)', organic: '—', note: L('Đa số là 0% ở cả hai nhóm (chưa bán được)', 'Mostly 0% in both groups (unactivated)') },
        { metric: L('Creator có Organic tốt hơn Ads', 'Creators where Organic > Ads'), ads: '9 creator (5,1%)', organic: '—', note: L('Chỉ thiểu số nhỏ bị giảm', 'Only a tiny minority saw drops') },
      ],
    },
    tiers: {
      title: L('3. Phân tầng theo nhóm Follower', '3. Follower Tier Stratification'),
      desc: L('Ở mọi quy mô kênh từ nano đến macro, video có chạy Ads đều có tỷ lệ ra đơn vượt trội Organic.', 'Across every follower tier from nano to macro, Ads-boosted videos consistently outperform Organic in order conversion.'),
      rows: [
        { metric: '< 1k Follower', ads: '12,2% (46/378)', organic: '0,7% (1/141)', note: L('Ads giúp nano KOC phá băng đơn hàng', 'Ads breaks the ice for nano KOCs') },
        { metric: '1k – 10k Follower', ads: '21,7% (468/2.155)', organic: '2,5% (14/565)', note: L('Nhóm chiếm tỷ trọng lớn nhất (62%)', 'Largest creator tier (62% of videos)'), highlight: true },
        { metric: '10k – 50k Follower', ads: '40,3% (278/689)', organic: '12,6% (22/175)', note: L('Tỷ lệ chuyển đổi tăng gấp 3,2 lần', 'Conversion rate increases 3.2x') },
        { metric: '50k – 100k Follower', ads: '38,7% (60/155)', organic: '7,4% (2/27)', note: L('Gấp 5,2 lần Organic', '5.2x higher than Organic') },
        { metric: '> 100k Follower', ads: '56,2% (59/105)', organic: '37,0% (10/27)', note: L('Hơn một nửa video có phát sinh đơn', 'Over half of videos generate orders') },
      ],
    },
    ex_dominant: {
      title: L('4. Loại bỏ 3 Creator chi phối (kamielyhn, _thzy.tien, girlstyle.vn)', '4. Excluding 3 Dominant Creators'),
      desc: L('Loại trừ các tài khoản gánh phần lớn GMV để kiểm tra tính đại diện cho toàn bộ mạng lưới KOC ngoài.', 'Excludes top revenue-driving accounts to verify true external KOC representativeness.'),
      rows: [
        { metric: L('Số lượng video còn lại', 'Remaining Videos'), ads: '3.132', organic: '933', note: L('Loại 352 video của top 3 tài khoản', 'Excluded 352 videos from top 3 accounts') },
        { metric: L('Tỷ lệ video có đơn', 'Order Rate'), ads: '21,9% (686)', organic: '5,3% (49)', note: L('Chênh lệch vẫn duy trì +16,6%', 'Net uplift remains +16.6%'), highlight: true },
        { metric: L('Lượt xem trung vị', 'Median Views'), ads: '504', organic: '154', note: L('Gấp 3,3 lần Organic', '3.3x higher than Organic') },
        { metric: L('Tổng GMV (VND)', 'Total GMV (VND)'), ads: '1,04 Tỷ đ', organic: '115,1 Tr đ', note: L('Mạng lưới KOC ngoài đóng góp 1,04B', 'External KOC network drove 1.04B') },
        { metric: L('GMV / 1.000 lượt xem (GPM)', 'GMV / 1,000 Views (GPM)'), ads: '53.883 đ', organic: '81.082 đ', note: L('GPM Organic vẫn cao hơn Ads', 'Organic GPM remains higher than Ads'), tone: 'amber' },
      ],
    },
    last_90d: {
      title: L('5. Cửa sổ chuẩn hóa 90 ngày cuối (Đồng bộ thời gian tính GMV)', '5. 90-Day Window Normalization'),
      desc: L('Khắc phục hạn chế dữ liệu: chỉ lấy video xuất bản từ 06/06 đến 04/09/2026 để khớp chính xác cửa sổ 90 ngày của cột GMV.', 'Resolves data grain limitation: filters for videos posted Jun 06 to Sep 04 to match the 90-day GMV reporting window.'),
      rows: [
        { metric: L('Số lượng video xuất bản trong 90 ngày', 'Videos published in last 90 days'), ads: '1.172', organic: '174', note: L('Tổng cộng 1.346 video', 'Total 1,346 videos in window') },
        { metric: L('Tỷ lệ video có đơn', 'Order Rate'), ads: '36,4% (427)', organic: '7,5% (13)', note: L('Chênh lệch vọt lên +28,9%', 'Spread widens to +28.9%'), highlight: true },
        { metric: L('Lượt xem trung vị', 'Median Views'), ads: '509', organic: '97,5', note: L('Gấp 5,2 lần Organic', '5.2x higher than Organic') },
        { metric: L('Tổng GMV (VND)', 'Total GMV (VND)'), ads: '429,2 Tr đ', organic: '5,0 Tr đ', note: L('Ads áp đảo tuyệt đối (98,8% GMV)', 'Ads dominates with 98.8% of GMV') },
        { metric: L('GMV / 1.000 lượt xem (GPM)', 'GMV / 1,000 Views (GPM)'), ads: '89.027 đ', organic: '22.468 đ', note: L('Ở video mới, GPM của Ads cao gấp gần 4 lần!', 'In recent videos, Ads GPM is nearly 4x higher!'), highlight: true },
      ],
    },
  };

  // 5.3.F: Khung giờ phát sóng và thời lượng phiên Live chính chủ (+13h UTC+7)
  const timeSlotData = [
    { slot: '00:00 - 05:59', n: 7, viewers: 23987, gmvM: 19.7, gmvPerViewer: 822, gmvPerHourM: 1.74, medianDur: 1.52, note: L('Đêm khuya, ít người xem', 'Late night, low traffic') },
    { slot: '06:00 - 11:59', n: 211, viewers: 1795884, gmvM: 4180.0, gmvPerViewer: 2328, gmvPerHourM: 3.16, medianDur: 4.11, note: L('Khung sáng chủ lực (44% ca live)', 'Core morning block (44% of lives)') },
    { slot: '12:00 - 17:59', n: 125, viewers: 746399, gmvM: 1997.8, gmvPerViewer: 2677, gmvPerHourM: 3.24, medianDur: 3.22, note: L('GMV/viewer cao nhất (2.677 đ)', 'Highest GMV/viewer (2,677 VND)') },
    { slot: '18:00 - 23:59', n: 132, viewers: 726428, gmvM: 826.0, gmvPerViewer: 1137, gmvPerHourM: 1.84, medianDur: 3.16, note: L('Khung tối không có ca >8h', 'Evening lacks >8h mega-sessions') },
  ];

  // Heatmap matrix Time Slot x Duration Bucket (GMV / Viewer)
  const heatmapMatrix = [
    { slot: '00:00 - 05:59', d1: { n: 5, gmvPerV: 1058 }, d2: { n: 2, gmvPerV: 616 }, d3: { n: 0, gmvPerV: 0 }, d4: { n: 0, gmvPerV: 0 } },
    { slot: '06:00 - 11:59', d1: { n: 39, gmvPerV: 849 }, d2: { n: 64, gmvPerV: 1124 }, d3: { n: 40, gmvPerV: 1546 }, d4: { n: 68, gmvPerV: 2833 } },
    { slot: '12:00 - 17:59', d1: { n: 18, gmvPerV: 1440 }, d2: { n: 53, gmvPerV: 1247 }, d3: { n: 18, gmvPerV: 1161 }, d4: { n: 36, gmvPerV: 3891 } },
    { slot: '18:00 - 23:59', d1: { n: 24, gmvPerV: 583 }, d2: { n: 59, gmvPerV: 908 }, d3: { n: 49, gmvPerV: 1341 }, d4: { n: 0, gmvPerV: 0 } },
  ];

  const getHeatCls = (rate: number, count: number) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600';
    if (rate >= 3000) return 'bg-[#9BE7FA] text-slate-950 font-bold';
    if (rate >= 2000) return 'bg-[#9BE7FA]/80 text-slate-950 font-bold';
    if (rate >= 1400) return 'bg-[#C8EEF7] text-slate-900 font-semibold dark:bg-[#074553] dark:text-[#9BE7FA]';
    if (rate >= 1000) return 'bg-[#FFE485]/70 text-slate-900 dark:bg-amber-950/60 dark:text-amber-200';
    if (rate >= 600) return 'bg-[#FFE485]/35 text-slate-800 dark:bg-amber-950/30 dark:text-amber-300';
    return 'bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
  };

  // SQL code snippets
  const stage5Sql = [
    {
      title: L('1. So sánh Ads vs Organic trên Video Shoppable', '1. Ads vs Organic on Shoppable Videos'),
      desc: L('Tổng hợp số lượng video, tỷ lệ ra đơn và GMV trên mỗi 1.000 lượt xem (GPM) giữa 2 nhóm quảng cáo', 'Aggregates video count, conversion rate and GMV per 1k views between Ads and Organic'),
      sql: `-- Tổng quan Ads = YES vs NO trên Shoppable Videos (SQLite)
SELECT ads,
       COUNT(*) AS total_videos,
       SUM(CASE WHEN "[90 days]GMV" > 0 THEN 1 ELSE 0 END) AS videos_with_orders,
       ROUND(100.0 * SUM(CASE WHEN "[90 days]GMV" > 0 THEN 1 ELSE 0 END) / COUNT(*), 2) AS order_rate_pct,
       ROUND(AVG(views), 0) AS mean_views,
       ROUND(SUM("[90 days]GMV"), 0) AS total_gmv,
       ROUND(1000.0 * SUM("[90 days]GMV") / SUM(views), 0) AS gmv_per_1k_views
FROM stg_shoppable_videos
GROUP BY ads;`,
    },
    {
      title: L('2. Kiểm soát trong cùng Creator (Paired Comparison)', '2. Within-Creator Paired Query'),
      desc: L('Chỉ lấy các creator xuất bản cả video Ads và Organic để tính hiệu số tỷ lệ ra đơn, loại trừ thiên lệch cá nhân', 'Filters creators with both video types to compute paired differences, eliminating creator-level bias'),
      sql: `-- So sánh hiệu số tỷ lệ có đơn trong cùng creator
WITH creator_ads_perf AS (
  SELECT "creator ID" AS creator_id,
         ads,
         COUNT(*) AS n_videos,
         1.0 * SUM(CASE WHEN "[90 days]GMV" > 0 THEN 1 ELSE 0 END) / COUNT(*) AS pos_rate
  FROM stg_shoppable_videos
  GROUP BY 1, 2
)
SELECT y.creator_id,
       y.n_videos AS n_ads,
       o.n_videos AS n_organic,
       ROUND(100.0 * y.pos_rate, 2) AS ads_pos_rate_pct,
       ROUND(100.0 * o.pos_rate, 2) AS org_pos_rate_pct,
       ROUND(100.0 * (y.pos_rate - o.pos_rate), 2) AS diff_pos_rate_pct
FROM creator_ads_perf y
JOIN creator_ads_perf o
  ON y.creator_id = o.creator_id AND y.ads = 'YES' AND o.ads = 'NO';`,
    },
    {
      title: L('3. Phân rã Khung giờ và Thời lượng Live (UTC+7)', '3. Live Time Slot & Duration Decomposition'),
      desc: L('Chuyển đổi múi giờ +13h sang giờ Việt Nam và gom nhóm phiên theo ca phát sóng để đánh giá hiệu suất GMV/lượt xem', 'Shifts start time +13h to UTC+7 and bins sessions by broadcast block to assess GMV per viewer'),
      sql: `-- Hiệu suất phiên Live chính chủ theo khung giờ và thời lượng (+13h UTC+7)
WITH live_adj AS (
  SELECT "Live Streaming Title",
         "Live GMV" AS gmv,
         "Total Viewers" AS viewers,
         CAST("Live Streaming Duration" AS REAL) AS dur_hours,
         -- Dịch thời gian sang UTC+7
         datetime("Start Time", '+13 hours') AS start_vn,
         CAST(strftime('%H', datetime("Start Time", '+13 hours')) AS INT) AS hour_vn
  FROM stg_creator_live_list
),
binned AS (
  SELECT *,
         CASE
           WHEN hour_vn < 6 THEN '00:00 - 05:59'
           WHEN hour_vn < 12 THEN '06:00 - 11:59'
           WHEN hour_vn < 18 THEN '12:00 - 17:59'
           ELSE '18:00 - 23:59'
         END AS time_slot,
         CASE
           WHEN dur_hours <= 2.0 THEN '<= 2h'
           WHEN dur_hours <= 4.0 THEN '2h - 4h'
           WHEN dur_hours <= 8.0 THEN '4h - 8h'
           ELSE '> 8h'
         END AS dur_tier
  FROM live_adj
)
SELECT time_slot, dur_tier,
       COUNT(*) AS session_count,
       ROUND(SUM(gmv) / SUM(viewers), 0) AS gmv_per_viewer,
       ROUND(SUM(gmv) / SUM(dur_hours), 0) AS gmv_per_hour
FROM binned
GROUP BY time_slot, dur_tier
ORDER BY time_slot, dur_tier;`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 5.1 & 5.2: Khung Phương Pháp Luận & Chuyển Thể */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BE7FA] text-slate-950 font-bold text-xs">
              5.1
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {L('Mục Tiêu & Chuyển Thể Từ Dàn Ý Gốc Sang Dữ Liệu Thực Tế', 'Objective & Methodological Adaptation from Original Outline')}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Database className="h-3.5 w-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>{L('Dữ liệu: Shop LIVE, Shoppable Videos, Creator Live/Video List', 'Sources: Shop LIVE, Shoppable Videos, Creator Live/Video')}</span>
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {L(
            'Dữ liệu TikTok Shop không cung cấp bảng `order_detail` hay mã đơn hàng khách hàng, do đó phễu thương mại điện tử truyền thống (xem → thêm giỏ → thanh toán) và phân tích giỏ hàng (basket analysis) không thể thực hiện trực tiếp. Chúng tôi chuyển thể bài toán thành Phễu Nội Dung (Content Funnel: Người xem → Phiên/Video có đơn → Sản phẩm bán được) và thực hiện so sánh quan sát chặt chẽ giữa Quảng cáo (Ads) và Tự nhiên (Organic) có kiểm soát biến gây nhiễu.',
            'Without order_detail or customer-level logs, traditional e-commerce funnels (view → cart → checkout) and basket association rules cannot be executed directly. We adapt the framework into a Content Conversion Funnel (Viewers → Converting Sessions/Videos → Units Sold) and perform rigorous observational comparisons between Ads and Organic with confounding controls.',
          )}
        </p>

        {/* Bảng đối chiếu chuyển thể */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0F9FB] dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{L('Dàn ý lý thuyết ban đầu', 'Theoretical Outline')}</th>
                <th className="py-2.5 px-3">{L('Khả thi trên dữ liệu', 'Data Feasibility')}</th>
                <th className="py-2.5 px-3">{L('Giải pháp chuyển thể thực chứng SSOT', 'Empirical SSOT Adaptation')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{L('Phễu TMĐT (Xem → Giỏ → Mua)', 'E-com Funnel (View → Cart → Pay)')}</td>
                <td className="py-2 px-3"><Chip tone="rose">{L('Không có mã đơn', 'No order logs')}</Chip></td>
                <td className="py-2 px-3">{L('Phễu nội dung: Lượt xem → Phiên/Video phát sinh doanh số → Số lượng sản phẩm bán ra.', 'Content Funnel: Views → Converting sessions/videos → Units sold.')}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{L('Phân tích giỏ hàng mua kèm (Basket)', 'Market Basket Analysis')}</td>
                <td className="py-2 px-3"><Chip tone="rose">{L('Không có mã giỏ', 'No basket ID')}</Chip></td>
                <td className="py-2 px-3">{L('Dùng giá trị trung bình mỗi sản phẩm bán (GMV/sp ~ 139k–155k đ) làm đại diện giá trị đơn hàng.', 'Use average selling price per unit (GMV/unit ~ 139k-155k VND) as a basket size proxy.')}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{L('Thử nghiệm A/B Test ngẫu nhiên', 'Randomized A/B Test')}</td>
                <td className="py-2 px-3"><Chip tone="amber">{L('Dữ liệu quan sát', 'Observational only')}</Chip></td>
                <td className="py-2 px-3">{L('So sánh quan sát có phân tầng (Stratification), so sánh trong cùng creator (Paired) và kiểm định Fisher/Mann-Whitney.', 'Observational comparisons with stratification, within-creator pairing, and Fisher/Mann-Whitney tests.')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5.3.A: Phễu LIVE (Chính chủ vs Affiliate) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title={L('5.3.A. Hiệu Suất Phễu LIVE: Chính Chủ vs Affiliate', '5.3.A. LIVE Funnel: Own-Brand vs Affiliate Streamers')}
          subtitle={L('So sánh 470 phiên chính chủ với 6.576 phiên affiliate trong 226 ngày', 'Comparison across 470 own-brand lives and 6,576 affiliate lives over 226 days')}
          badge={<Chip tone="cyan">{L('GMV/Viewer gấp 34,3 lần', '34.3x GMV/Viewer')}</Chip>}
          height=""
        >
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{L('Chính Chủ (kamielyhn)', 'Own-Brand (kamielyhn)')}</div>
                <div className="text-xl font-bold text-[#074553] dark:text-[#9BE7FA] tabular-nums mt-0.5">2.155 đ</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{L('GMV / lượt xem', 'GMV / viewer')}</div>
                <div className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">96,4% {L('phiên có đơn', 'conversion rate')}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{L('Affiliate Ngoài (6.576 ca)', 'Affiliate Live (6,576 ses)')}</div>
                <div className="text-xl font-bold text-slate-700 dark:text-slate-300 tabular-nums mt-0.5">63 đ</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{L('GMV / lượt xem', 'GMV / viewer')}</div>
                <div className="mt-2 text-[11px] font-medium text-rose-600 dark:text-rose-400">26,1% {L('phiên có đơn', 'conversion rate')}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>{L('Tỷ trọng lượt xem (Views Share):', 'Views Share:')}</span>
                <span className="font-bold tabular-nums">Affiliate 91,6% (35,6M) vs Chính chủ 8,4% (3,26M)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>{L('Tỷ trọng GMV tạo ra:', 'GMV Contribution:')}</span>
                <span className="font-bold tabular-nums text-[#074553] dark:text-[#9BE7FA]">Chính chủ 75,8% (7,02B) vs Affiliate 24,2% (2,24B)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span>{L('Chuyển đổi sản phẩm trong phiên:', 'Within-Session Product Conversion:')}</span>
                <span className="font-bold tabular-nums">17.504 sp quảng bá → 6.233 sp có đơn (35,6%)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                {L(
                  'Affiliate gánh tới 91,6% lượt xem Live nhưng hiệu suất GMV/lượt xem thấp hơn kênh chính chủ tới 34,3 lần (63 đ vs 2.155 đ). Mạng lưới KOC chủ yếu tạo độ phủ nhận diện chứ không phải cỗ máy chuyển đổi doanh thu cốt lõi.',
                  'Affiliates generate 91.6% of Live views but deliver 34.3x lower GMV per view than the own-brand room (63 vs 2,155 VND). External KOCs drive awareness reach rather than bottom-funnel conversion.',
                )}
              </span>
            </div>
          </div>
        </ChartCard>

        {/* Xu hướng chuyển đổi theo tháng của Live chính chủ */}
        <ChartCard
          title={L('Xu Hướng Chuyển Đổi Phễu Live Chính Chủ Theo Tháng', 'Monthly Conversion Dynamics in Own-Brand Live')}
          subtitle={L('Người xem trung bình/ca vs Sản phẩm bán được trên 1.000 lượt xem', 'Avg viewers per session vs Units sold per 1,000 views')}
          badge={<Chip tone="amber">{L('Mất người xem sau T6', 'Traffic drop after Jun')}</Chip>}
        >
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={monthlyOwnLiveFunnel} margin={{ top: 20, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="ym" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis yAxisId="views" tick={axisTick} tickLine={false} axisLine={false} width={40}>
                <Label value={L('Views/ca', 'Views/ses')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={10} />
              </YAxis>
              <YAxis yAxisId="conv" orientation="right" tick={axisTick} tickLine={false} axisLine={false} width={35}>
                <Label value={L('SP/1k views', 'Units/1k views')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={10} />
              </YAxis>
              <Tooltip
                cursor={{ fill: 'rgba(155,231,250,0.15)' }}
                content={
                  <ChartTooltip
                    fmt={(v, name) =>
                      name.includes('Lượt xem') || name.includes('Viewers')
                        ? `${n(v)} views`
                        : `${n(v, 1)} sp/1k views`
                    }
                  />
                }
              />
              <Legend wrapperStyle={{ fontSize: 11 }} formatter={legendFormatter} />
              <Bar
                yAxisId="views"
                dataKey="avgViewers"
                name={L('Lượt xem TB / ca', 'Avg Viewers / session')}
                fill={COLORS.cyan}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="conv"
                dataKey="unitsPer1k"
                name={L('Sản phẩm / 1.000 views', 'Units sold / 1k views')}
                stroke={COLORS.amber}
                strokeWidth={2.5}
                dot={{ r: 4, fill: COLORS.amber }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 5.3.E: So Sánh Quảng Cáo (Ads) vs Tự Nhiên (Organic) trên Shoppable Videos */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFE485] text-slate-950 font-bold text-xs">
              5.3.E
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {L('So Sánh Quảng Cáo (Ads = YES) và Tự Nhiên (Ads = NO) Trên Shoppable Videos', 'Ads = YES vs Organic (Ads = NO) on Shoppable Videos')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Kiểm định thống kê Fisher, Mann-Whitney U, Bootstrap 95% CI và 5 bài test độ vững (Robustness Checks)', 'Fisher Exact, Mann-Whitney U, Bootstrap 95% CI & 5 Robustness Checks')}
              </p>
            </div>
          </div>

          {/* Navigation Tabs for Ads Robustness */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setAdsTab('overall')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                adsTab === 'overall'
                  ? 'bg-white dark:bg-slate-900 text-[#074553] dark:text-[#9BE7FA] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {L('Toàn Bộ Mẫu (4.417)', 'Full Sample (4,417)')}
            </button>
            <button
              onClick={() => setAdsTab('within_creator')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                adsTab === 'within_creator'
                  ? 'bg-white dark:bg-slate-900 text-[#074553] dark:text-[#9BE7FA] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {L('Trong Cùng Creator (175)', 'Within-Creator (175)')}
            </button>
            <button
              onClick={() => setAdsTab('tiers')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                adsTab === 'tiers'
                  ? 'bg-white dark:bg-slate-900 text-[#074553] dark:text-[#9BE7FA] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {L('Phân Tầng Follower', 'Follower Tiers')}
            </button>
            <button
              onClick={() => setAdsTab('ex_dominant')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                adsTab === 'ex_dominant'
                  ? 'bg-white dark:bg-slate-900 text-[#074553] dark:text-[#9BE7FA] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {L('Bỏ Top 3 Creator', 'Excl. Top 3')}
            </button>
            <button
              onClick={() => setAdsTab('last_90d')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                adsTab === 'last_90d'
                  ? 'bg-white dark:bg-slate-900 text-[#074553] dark:text-[#9BE7FA] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {L('Chuẩn Hóa 90 Ngày Cuối', 'Last 90d Window')}
            </button>
          </div>
        </div>

        {/* Selected Ads Tab Detail Card */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FFD14C]" />
              {adsComparisonCards[adsTab].title}
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 italic">
              {adsComparisonCards[adsTab].desc}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0F9FB] dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">{L('Chỉ số đo lường', 'Metric')}</th>
                  <th className="py-2.5 px-3 text-[#074553] dark:text-[#9BE7FA] font-bold">Ads = YES (Quảng Cáo)</th>
                  <th className="py-2.5 px-3 text-slate-600 dark:text-slate-400">Ads = NO (Tự Nhiên)</th>
                  <th className="py-2.5 px-3">{L('Đánh giá thống kê / Chú thích kiểm định', 'Statistical Interpretation / Note')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                {adsComparisonCards[adsTab].rows.map((r, i) => (
                  <tr key={i} className={r.highlight ? 'bg-[#9BE7FA]/10 dark:bg-[#074553]/20 font-medium' : ''}>
                    <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{r.metric}</td>
                    <td className="py-2 px-3 font-bold tabular-nums text-slate-900 dark:text-white">{r.ads}</td>
                    <td className="py-2 px-3 tabular-nums">{r.organic}</td>
                    <td className="py-2 px-3 text-[11px] text-slate-500 dark:text-slate-400">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hộp phát hiện mấu chốt về Ads */}
        <div className="p-3.5 rounded-xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-1.5">
          <div className="font-bold text-[#074553] dark:text-[#9BE7FA] flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            {L('Phát hiện then chốt về Quảng cáo (Ads vs Organic Insights):', 'Core Ads vs Organic Insights:')}
          </div>
          <p>
            {L(
              '• Quảng cáo giúp tăng xác suất video có đơn gấp 5,0 lần (26,2% vs 5,2%, Odds Ratio = 6,41, p < 0,001) và tăng mạnh lượt xem trung vị (609 vs 154 views). Khi kiểm soát log(views) bằng hồi quy logistic, cờ Ads vẫn có Odds Ratio = 2,68, chứng minh Ads giúp mở rộng phân phối tới tệp người xem có ý định mua sắm cao hơn.',
              '• Ads boosts conversion probability 5.0x (26.2% vs 5.2%, Odds Ratio = 6.41, p < 0.001) and significantly elevates median views (609 vs 154). Controlling for log(views) via logistic regression, Ads retains an Odds Ratio of 2.68, confirming targeting toward higher-intent shoppers.',
            )}
          </p>
          <p>
            {L(
              '• Tuy nhiên, trên toàn bộ dữ liệu 226 ngày, GMV trên mỗi 1.000 lượt xem (GPM) của Ads lại thấp hơn Organic (71.103 đ vs 80.874 đ). Điều này xảy ra do video cũ bị cắt cửa sổ GMV 90 ngày. Khi chuẩn hóa chỉ xét video đăng trong 90 ngày gần nhất, GPM của Ads đạt 89.027 đ (cao gấp gần 4 lần mức 22.468 đ của Organic).',
              '• However, across the unadjusted 226-day sample, GMV per 1,000 views (GPM) for Ads is lower than Organic (71,103 vs 80,874 VND) due to 90-day GMV cutoff on older videos. Filtering for videos posted in the last 90 days reveals Ads GPM is actually 89,027 VND (nearly 4x higher than Organic 22,468 VND).',
            )}
          </p>
          <p className="text-rose-600 dark:text-rose-400 font-semibold">
            {L(
              '• Cảnh báo phương pháp luận: Ads không được gán ngẫu nhiên (chọn lọc video đã có đà) và thiếu dữ liệu chi phí quảng cáo (Ad Spend), do đó kết quả phản ánh mối quan hệ quan sát (association), không khẳng định quan hệ nhân quả và không thể tính ROAS.',
              '• Methodological Caveat: Ads are non-randomly allocated to videos with existing organic traction, and ad spend is unavailable; results reflect observational associations, not causal proofs or ROAS estimates.',
            )}
          </p>
        </div>
      </div>

      {/* 5.3.F: Khung Giờ & Độ Dài Phiên Live Chính Chủ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title={L('5.3.F. Khung Giờ Phát Sóng & GMV / Lượt Xem (UTC+7)', '5.3.F. Broadcast Time Slots & GMV / Viewer (UTC+7)')}
          subtitle={L('Đã dịch múi giờ +13h sang giờ Việt Nam (475 phiên chính chủ)', 'Shifted +13h to Vietnam Local Time (475 own-brand sessions)')}
          badge={<Chip tone="amber">{L('Khung 12h–18h đạt đỉnh', 'Peak 12h-18h')}</Chip>}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={timeSlotData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="slot" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} width={40}>
                <Label value="(VNĐ/view)" position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={10} />
              </YAxis>
              <Tooltip
                cursor={{ fill: 'rgba(155,231,250,0.15)' }}
                content={
                  <ChartTooltip
                    fmt={(v) => `${n(v)} đ/viewer`}
                    head={(l) => `${l}`}
                  />
                }
              />
              <Bar dataKey="gmvPerViewer" name={L('GMV / Lượt xem (đ)', 'GMV / Viewer (VND)')} fill={COLORS.cyan} radius={[6, 6, 0, 0]}>
                <LabelList dataKey="gmvPerViewer" position="top" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => `${n(Number(v))} đ`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Heatmap Matrix: Khung giờ x Độ dài phiên */}
        <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {L('Ma Trận Khung Giờ × Độ Dài Phiên (GMV / Lượt Xem)', 'Time Slot × Session Duration Heatmap (GMV / Viewer)')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Giải mã hiện tượng khung tối có GMV/lượt xem thấp', 'Decodes why evening slots exhibit lower conversion')}
              </p>
            </div>
            <Chip tone="cyan">&gt; 8h = 3.103 đ/view</Chip>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs tabular-nums">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2 px-2 text-left">{L('Khung giờ (UTC+7)', 'Time Slot (UTC+7)')}</th>
                  <th className="py-2 px-2">≤ 2 Giờ</th>
                  <th className="py-2 px-2">2h – 4h</th>
                  <th className="py-2 px-2">4h – 8h</th>
                  <th className="py-2 px-2">&gt; 8 Giờ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {heatmapMatrix.map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-2 text-left font-semibold text-slate-800 dark:text-slate-200">
                      {row.slot}
                    </td>
                    {[row.d1, row.d2, row.d3, row.d4].map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`py-2 px-2 transition-colors ${getHeatCls(cell.gmvPerV, cell.n)}`}
                        title={`${cell.n} phiên live`}
                      >
                        {cell.n > 0 ? (
                          <div>
                            <div>{n(cell.gmvPerV)} đ</div>
                            <div className="text-[9px] opacity-75">({cell.n} {L('ca', 'ses')})</div>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
            {L(
              '• Giải mã biến gây nhiễu: Khung tối (18h–23h) có GMV/view thấp (1.137 đ) không phải do người xem buổi tối không mua hàng, mà vì khung tối hoàn toàn KHÔNG CÓ ca live dài >8h (0 phiên). Trong khi đó, khung sáng có 68 ca và chiều có 36 ca >8h (đạt hiệu suất từ 2.833 đ đến 3.891 đ/view nhờ thuật toán TikTok đẩy đề xuất mạnh khi ca live kéo dài).',
              '• Confounding factor explained: Evening lives (18h-23h) show low conversion (1,137 VND/view) strictly because they featured ZERO >8h sessions. In contrast, morning and afternoon slots hosted 68 and 36 mega-sessions (>8h), driving 2,833 to 3,891 VND/view as the TikTok algorithm amplified streaming momentum.',
            )}
          </p>
        </div>
      </div>

      {/* 5.3.D & G: So Sánh Kênh & Giá Trị Đơn Vị (Unit Economics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Video className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            {L('Cơ cấu Live vs Video (Chính chủ)', 'Live vs Video Split (Own-Brand)')}
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">89,0%</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">7,02 Tỷ / 7,89 Tỷ đ</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {L('Doanh thu phụ thuộc gần như tuyệt đối vào livestream; video chính chủ đóng góp 11% (870 Tr đ).', 'Revenue hinges almost entirely on livestreaming; own videos contribute 11% (870M VND).')}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-[#FFD14C]" />
            {L('Giá Trị Trung Bình / Sản Phẩm (ASP)', 'Average Selling Price (ASP Proxy)')}
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">147.878 đ</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{L('Trung vị ngày từ Store', 'Daily median from Store')}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {L('Thay thế phân tích giỏ hàng: biên độ dao động từ 52k đ đến 193k đ, trung bình 139.281 đ/sp.', 'Proxy for basket value: spans 52k to 193k VND, averaging 139,281 VND per unit sold.')}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            {L('Top 10 Video Shoppable Affiliate', 'Top 10 Affiliate Shoppable Videos')}
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">26,6%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">577,5 Tr / 2,17 Tỷ đ</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {L('Chỉ 10 video xuất sắc nhất đã chiếm hơn 1/4 tổng GMV của 4.417 video gắn giỏ hàng affiliate.', 'Just top 10 videos drive over a quarter of total GMV across 4,417 affiliate shoppable videos.')}
          </p>
        </div>
      </div>

      {/* 5.4: Truy Vấn SQL Chuẩn Hóa Mục 5 */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TerminalSquare className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {L('Kỹ Thuật SQL Khám Phá & So Sánh Phễu (Mục 5)', 'SQL Queries for Funnel & Marketing Channel Comparison')}
            </h4>
          </div>
          <div className="flex gap-1.5">
            {stage5Sql.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSqlTab(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeSqlTab === idx
                    ? 'bg-[#9BE7FA] text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {idx + 1}. {tab.title.split('.')[1]?.trim() || tab.title}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 italic">
            {stage5Sql[activeSqlTab].desc}
          </p>
          <div className="relative rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
            <button
              onClick={() => {
                navigator.clipboard.writeText(stage5Sql[activeSqlTab].sql);
                setCopiedIndex(activeSqlTab);
                setTimeout(() => setCopiedIndex(null), 2000);
              }}
              className="absolute top-3 right-3 flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] text-slate-300 transition-colors cursor-pointer"
            >
              {copiedIndex === activeSqlTab ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">{L('Đã chép', 'Copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>{L('Sao chép SQL', 'Copy SQL')}</span>
                </>
              )}
            </button>
            <pre className="pr-16 text-slate-300 leading-relaxed">
              <code>{stage5Sql[activeSqlTab].sql}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* 5.6 & 5.7: Hạn Chế Phương Pháp Luận & Kết Luận Đầu Ra */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-4">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
          <ShieldAlert className="h-4 w-4 text-amber-600" />
          <span>{L('5.6. Bốn Ràng Buộc Phương Pháp Luận Bắt Buộc (Methodological Guardrails):', '5.6. Mandatory Methodological Guardrails:')}</span>
        </div>

        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <div>
              <strong>{L('1. Nghiên cứu Quan sát (Không phải A/B Test):', '1. Observational Study (Not Randomized A/B):')}</strong> {L(
                'Quảng cáo, khung giờ và thời lượng phiên đều do con người chủ động phân bổ (thường chạy Ads cho video đã có đà). Sự chênh lệch phản ánh mối liên hệ đi kèm (association), không thể diễn giải thành quan hệ nhân quả (causality).',
                'Ads, time slots, and session lengths were purposively assigned by operators. Differentials represent statistical associations, not randomized causal claims.'
              )}
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <div>
              <strong>{L('2. Lệch cửa sổ 90 ngày vs 226 ngày trong Shoppable Videos:', '2. 90-Day vs 226-Day Window Lag in Shoppable Videos:')}</strong> {L(
                'Cột GMV và Units sold trong bảng Shoppable Videos chỉ tính trong 90 ngày gần nhất dù video đăng trong 226 ngày. Video đăng trước tháng 6 bị cắt ngắn doanh số, khiến GMV/views bị kéo giảm nhân tạo nếu không lọc 90 ngày cuối.',
                'Shoppable Videos GMV captures only the last 90 rolling days. Pre-June videos suffer truncation; always verify with normalized 90-day subsets.'
              )}
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <div>
              <strong>{L('3. Tương hỗ giữa Video và Live:', '3. Cross-Channel Attribution Overlap:')}</strong> {L(
                'Tiêu đề video chính chủ thường chứa lời mời "Vào Live săn deal". Video đóng vai trò phễu dẫn khách vào phòng Live, do đó không thể tách bạch tuyệt đối doanh thu của từng kênh.',
                'Video titles explicitly urge viewers to join active livestreams. Video serves as an upper-funnel feeder, confounding independent revenue attribution.'
              )}
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <div>
              <strong>{L('4. Thiếu chi phí quảng cáo (Ad Spend):', '4. Absence of Cost Data & ROAS:')}</strong> {L(
                'Dữ liệu chỉ có cờ Ads = YES/NO, không có số tiền chạy ads thực tế hay giá vốn (COGS), do đó tuyệt đối không tuyên bố quảng cáo có sinh lời (profitable) hay tính ROAS.',
                'Data provides binary YES/NO flags without ad spend or COGS; claiming ROAS or net advertising profitability is strictly prohibited.'
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
