'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Hash,
  Sparkles,
  TerminalSquare,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import type { Stage6Payload } from '@/app/types/caseStudies';
import { buildStage6Data } from '@/app/lib/kamiElyStagesData';

export interface Stage6Props {
  data?: Stage6Payload;
}

export default function Stage6TextAndAnomalies(props?: Stage6Props) {
  const { L, n } = usePlaybookLang();
  const [activeSqlTab, setActiveSqlTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const stageData = props?.data || buildStage6Data();

  const categoryData = stageData.categoryData.map((c) => ({
    ...c,
    name: typeof c.name === 'string' ? c.name : L(c.name.vi, c.name.en),
  }));

  const topHashtags = stageData.topHashtags;

  const anomalyRegistry = stageData.anomalyRegistry.map((a) => ({
    ...a,
    type: typeof a.type === 'string' ? a.type : L(a.type.vi, a.type.en),
    rootCause: typeof a.rootCause === 'string' ? a.rootCause : L(a.rootCause.vi, a.rootCause.en),
    treatment: typeof a.treatment === 'string' ? a.treatment : L(a.treatment.vi, a.treatment.en),
  }));

  // SQL snippets
  const stage6Sql = [
    {
      title: L('1. Z-Score Trượt 28 Ngày Không Cần STDDEV (SQLite)', '1. Rolling 28-Day Z-Score in SQLite'),
      desc: L('Tính độ lệch chuẩn cục bộ bằng công thức toán học E[X^2] - (E[X])^2 trong cửa sổ 28 ngày', 'Computes local standard deviation via E[X^2] - (E[X])^2 over a 28-day centered window'),
      sql: `-- Z-Score cục bộ theo cửa sổ trượt 28 ngày (SQLite)
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
ORDER BY ABS(z_local) DESC;`,
    },
    {
      title: L('2. Phân Loại Danh Mục Video Bằng Regex (SQL)', '2. Regex Video Category Tagging'),
      desc: L('Tự động gắn nhãn danh mục sản phẩm từ tiêu đề video bằng các từ khóa thời trang tiếng Việt', 'Automatically tags product categories from video titles using Vietnamese fashion keywords'),
      sql: `-- Phân loại danh mục sản phẩm từ tiêu đề video
SELECT CASE
         WHEN LOWER(video_title) GLOB '*bikini*' OR LOWER(video_title) GLOB '*đồ bơi*' OR LOWER(video_title) GLOB '*swimwear*' THEN 'Bikini / Đồ bơi'
         WHEN LOWER(video_title) GLOB '*váy*' OR LOWER(video_title) GLOB '*đầm*' OR LOWER(video_title) GLOB '*chân váy*' THEN 'Váy / Đầm'
         WHEN LOWER(video_title) GLOB '*quần*' OR LOWER(video_title) GLOB '*quần gió*' THEN 'Quần / Quần gió'
         WHEN LOWER(video_title) GLOB '*áo*' OR LOWER(video_title) GLOB '*croptop*' THEN 'Áo / Croptop'
         WHEN LOWER(video_title) GLOB '*set*' OR LOWER(video_title) GLOB '*bộ*' THEN 'Set trang phục'
         ELSE 'Khác / Chưa phân loại'
       END AS category_label,
       COUNT(*) AS total_videos,
       SUM(CASE WHEN gmv_vnd > 0 THEN 1 ELSE 0 END) AS videos_with_orders,
       ROUND(100.0 * SUM(CASE WHEN gmv_vnd > 0 THEN 1 ELSE 0 END) / COUNT(*), 2) AS conversion_rate_pct,
       ROUND(SUM(gmv_vnd) / 1e6, 1) AS gmv_millions
FROM stg_shoppable_videos
GROUP BY 1
ORDER BY total_videos DESC;`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 6.1: Khung Phương Pháp Luận & Đính Chính Dàn Ý Cũ */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BE7FA] text-slate-950 font-bold text-xs">
              6.1
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {L('Mục Tiêu & Hai Điều Chỉnh Thực Chứng So Với Dàn Ý Ban Đầu', 'Objective & Two Empirical Reconciliations vs Legacy Outline')}
            </h3>
          </div>
          <Chip tone="cyan">{L('Dữ liệu văn bản: 4.417 Video & 7.046 Phiên Live', 'Text Corpus: 4,417 Videos & 7,046 Lives')}</Chip>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {L(
            'Do không có dữ liệu đánh giá sản phẩm hay ticket CSKH, các mô hình phân tích cảm xúc (Sentiment Analysis) và mô hình chủ đề (LDA) được chủ động loại bỏ để tránh suy diễn giả lập. Trọng tâm chuyển sang khai phá văn bản tự nhiên (Text Mining) từ tiêu đề video/live, hashtag và phát hiện các điểm dị biệt (Anomalies) làm sai lệch kết luận kinh doanh.',
            'Lacking reviews or support tickets, NLP sentiment analysis and topic modeling were intentionally omitted to avoid synthetic speculation. Focus shifted to empirical text mining across video/live titles and hashtags, combined with statistical anomaly detection that distorts commercial baselines.',
          )}
        </p>

        {/* Hai điểm điều chỉnh so với dàn ý cũ */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs" data-ui="table">
            <thead className="bg-[#F0F9FB] dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800" data-ui="thead">
              <tr>
                <th className="py-2.5 px-3">{L('Dàn ý lý thuyết ban đầu', 'Theoretical Claim')}</th>
                <th className="py-2.5 px-3">{L('Kết quả kiểm tra dữ liệu thật (SSOT)', 'Empirical Reality (SSOT)')}</th>
                <th className="py-2.5 px-3">{L('Xử lý chuẩn xác trong báo cáo', 'Methodological Correction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400" data-ui="tbody">
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{L('"Spike view tháng 8"', '"August View Spike"')}</td>
                <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400 font-semibold">
                  {L('Trong Shoppable, Tháng 8 là tháng THẤP NHẤT (~333k views vs 11,7M ở T4, trung vị chỉ 249 views). Không hề có spike!', 'August is actually the LOWEST month in Shoppable (~333k views vs 11.7M in April, median 249 views). Zero spike exists!')}
                </td>
                <td className="py-2.5 px-3">{L('Bỏ hoàn toàn giả thuyết spike; chuyển sang phân tích hiện tượng sụt giảm lưu lượng sau đỉnh T4.', 'Discard spike narrative; pivot to explaining post-April traffic contraction.')}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{L('"GMV/phiên của Girl Style vượt P99 toàn mạng"', '"Girl Style GMV/session exceeds network P99"')}</td>
                <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-semibold">
                  {L('Girl Style đạt 4,93 Tr đ/phiên (hạng 5), thấp hơn P99 toàn mạng (12,07 Tr đ) vì P99 bị kéo lệch bởi KOC chỉ live đúng 1 phiên ăn may (như ciin đạt 86M).', 'Girl Style averages 4.93M/session (rank 5), below raw P99 (12.07M) which is skewed by single-session 1-hit wonders (e.g. ciin: 1 live, 86M).')}
                </td>
                <td className="py-2.5 px-3">{L('Chỉ so sánh trong nhóm creator phát sóng bền bỉ (≥ 20 phiên); dùng tỷ trọng GMV 56,1% và Winsorize ở P99 để đo lường chuẩn xác.', 'Benchmark only among sustained creators (≥20 lives); utilize 56.1% share metric and P99 Winsorization.')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6.2: Khai Phá Văn Bản & Hashtag */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title={L('6.2.B. Phân Loại Danh Mục Video Theo Tiêu Đề', '6.2.B. Video Categorization by Title')}
          subtitle={L('4.417 video Shoppable: Số lượng & Tỷ trọng GMV (%)', '4,417 Shoppable videos: Count & GMV share (%)')}
          badge={<Chip tone="cyan">{L('Bikini chiếm 61% GMV', 'Bikini drives 61% GMV')}</Chip>}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData} layout="vertical" margin={{ top: 15, right: 20, left: 25, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={axisTick} tickLine={false} axisLine={false} width={110} />
              <Tooltip
                cursor={{ fill: 'rgba(155,231,250,0.15)' }}
                content={
                  <ChartTooltip
                    fmt={(v, name) =>
                      name.includes('GMV') ? `${n(v, 1)}% ${L('tỷ trọng', 'share')}` : `${n(v)} video`
                    }
                  />
                }
              />
              <Bar dataKey="gmvShare" name={L('Tỷ trọng GMV (%)', 'GMV Share (%)')} fill={COLORS.cyan} radius={[0, 4, 4, 0]}>
                <LabelList dataKey="gmvShare" position="right" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => `${n(Number(v), 1)}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6.2.C: Phân tích Hashtag Sản phẩm vs Hashtag Chung */}
        <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 mb-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Hash className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                {L('6.2.C. Hiệu Quả Giữa Hashtag Sản Phẩm và Hashtag Chung', '6.2.C. Product Hashtags vs Generic Hashtags')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('So sánh tỷ lệ video có đơn giữa các nhóm hashtag', 'Conversion rate comparison across hashtag groups')}
              </p>
            </div>
            <Chip tone="amber">{L('Hashtag SP: 28,6% có đơn', 'Product Tag: 28.6%')}</Chip>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800">
              <div className="text-xs font-semibold text-[#074553] dark:text-[#9BE7FA]">{L('Hashtag Sản Phẩm (#bikini, #chanvay...)', 'Product Tags (#bikini, #chanvay...)')}</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">28,6%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">491/1.714 {L('video có đơn', 'videos converted')}</div>
              <div className="mt-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">1,30 Tỷ đ GMV (60%)</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">{L('Chỉ Dùng Hashtag Chung (#xuhuong, #fyp...)', 'Generic Tags Only (#xuhuong, #fyp...)')}</div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300 tabular-nums mt-1">16,4%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">356/2.175 {L('video có đơn', 'videos converted')}</div>
              <div className="mt-1.5 text-xs font-semibold text-slate-500">640,7 Tr đ GMV (30%)</div>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{L('Top 10 Hashtag xuất hiện nhiều nhất:', 'Top 10 Most Frequent Hashtags:')}</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {topHashtags.slice(0, 10).map((t, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                    t.type === 'product'
                      ? 'bg-[#9BE7FA]/30 text-[#074553] dark:text-[#9BE7FA] border border-[#9BE7FA]/50'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.tag} <span className="opacity-60 tabular-nums">({t.count})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6.3: Phân Tích Dị Biệt (Anomalies) */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFD14C] text-slate-950 font-bold text-xs">
              6.3
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {L('Bảng Đăng Ký Dị Biệt & Nguyên Nhân Gốc Rễ (Anomaly Registry)', 'Comprehensive Anomaly Registry & Root Causes')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Định danh 4 nhóm dị biệt lớn và phương án kiểm soát độ nhạy dữ liệu', 'Identifies 4 major anomaly groups and analytical treatment protocols')}
              </p>
            </div>
          </div>
          <Chip tone="amber">{L('Duy nhất 16/06 vượt z > 3', 'Only Jun 16 exceeds z > 3')}</Chip>
        </div>

        {/* Bảng Registry */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs" data-ui="table">
            <thead className="bg-[#F0F9FB] dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800" data-ui="thead">
              <tr>
                <th className="py-2.5 px-3">{L('Loại dị biệt', 'Anomaly Type')}</th>
                <th className="py-2.5 px-3">{L('Đối tượng / Thời điểm', 'Subject / Timestamp')}</th>
                <th className="py-2.5 px-3">{L('Độ lệch / Quy mô', 'Magnitude')}</th>
                <th className="py-2.5 px-3">{L('Nguyên nhân gốc rễ (Root Cause)', 'Root Cause')}</th>
                <th className="py-2.5 px-3">{L('Phương án xử lý dữ liệu', 'Treatment Protocol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400" data-ui="tbody">
              {anomalyRegistry.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">{item.type}</td>
                  <td className="py-2 px-3 font-medium text-[#074553] dark:text-[#9BE7FA]">{item.target}</td>
                  <td className="py-2 px-3 tabular-nums font-bold text-slate-900 dark:text-white">{item.metric}</td>
                  <td className="py-2 px-3 text-xs leading-relaxed">{item.rootCause}</td>
                  <td className="py-2 px-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium">{item.treatment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chi tiết bóc tách ngày 16/06 và 19/06 */}
        <div className="p-3.5 rounded-xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-1.5">
          <div className="font-bold text-[#074553] dark:text-[#9BE7FA] flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            {L('Bóc tách bản chất toán học của các đỉnh GMV đột biến:', 'Mathematical Deconstruction of GMV Spikes:')}
          </div>
          <p>
            {L(
              '• Đỉnh tuyệt đối 16/06/2026 (315,0 Tr đ, z = 5,57) được tạo nên bởi đúng 1 ca Live chính chủ kéo dài đạt 194,9 Tr đ (chiếm 62% GMV ngày) kết hợp với 90 ca Live affiliate đạt 77,3 Tr đ. Tổng cộng Livestream gánh tới 86,4% GMV của ngày này.',
              '• Absolute peak Jun 16 (315.0M, z = 5.57) was driven by exactly 1 massive own-brand live generating 194.9M (62% of daily GMV) combined with 90 affiliate lives generating 77.3M. Livestreaming drove 86.4% of peak-day revenue.',
            )}
          </p>
          <p>
            {L(
              '• Đỉnh 19/06/2026 (170,5 Tr đ) chỉ ghi nhận vỏn vẹn 4 KOC tham gia, nhưng đạt GMV cao thứ 5 toàn kỳ do có 2 phiên Live chính chủ đạt 168,7 Tr đ (gánh 99% doanh số ngày). Điều này tái khẳng định: các đỉnh doanh thu đột biến không phụ thuộc vào quy mô bùng nổ số lượng KOC mà phụ thuộc vào lịch điều phối ca Live quy mô lớn của kênh chính chủ.',
              '• Spike Jun 19 (170.5M) saw only 4 participating KOCs, yet ranked 5th overall because 2 own-brand lives generated 168.7M (99% of daily GMV). This confirms revenue spikes depend on core internal live operations rather than surges in KOC headcount.',
            )}
          </p>
        </div>
      </div>

      {/* 6.4: Kỹ Thuật SQL Cho Mục 6 */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <TerminalSquare className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {L('Truy Vấn SQL Nhận Diện Dị Biệt & Phân Loại Văn Bản', 'SQL Queries for Anomaly Detection & Text Parsing')}
            </h4>
          </div>
          <div className="flex gap-1.5">
            {stage6Sql.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSqlTab(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeSqlTab === idx
                    ? 'bg-[#9BE7FA] text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab.title.split('.')[1]?.trim() || tab.title}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 italic">
            {stage6Sql[activeSqlTab].desc}
          </p>
          <div className="relative rounded-xl bg-slate-950 p-4 text-xs text-slate-200 overflow-x-auto">
            <button
              onClick={() => {
                navigator.clipboard.writeText(stage6Sql[activeSqlTab].sql);
                setCopiedIndex(activeSqlTab);
                setTimeout(() => setCopiedIndex(null), 2000);
              }}
              className="absolute top-3 right-3 flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-xs text-slate-300 transition-colors cursor-pointer"
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
            <pre className="font-mono pr-16 text-slate-300 leading-relaxed">
              <code>{stage6Sql[activeSqlTab].sql}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
