'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  TerminalSquare,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { COLORS } from '../playbook/playbookData';
import {
  ChartTooltip,
  Chip,
  GRID_STROKE,
  TEXT_FILL_CLASS,
  axisTick,
  legendFormatter,
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import type { Stage4Payload } from '@/app/types/caseStudies';
import { buildStage4Data } from '@/app/lib/kamiElyStagesData';

export interface Stage4Props {
  data?: Stage4Payload;
}

export default function Stage4CreatorCohortsAndLtv(props?: Stage4Props) {
  const { L, n } = usePlaybookLang();
  const [girlStyleScope, setGirlStyleScope] = useState<'with' | 'without'>('without');
  const [retentionMetric, setRetentionMetric] = useState<'pct' | 'count'>('pct');
  const [activeSqlTab, setActiveSqlTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const stageData = props?.data || buildStage4Data();
  const cohortScaleData = stageData.cohortScaleData;
  const retentionMatrix = stageData.retentionMatrix;
  const cohortGmvData = stageData.cohortGmvData;

  // SQL mẫu cho Mục 4
  const stage4Sql = [
    {
      title: L('1. Ma Trận Retention Creator (SQLite)', '1. Creator Retention Matrix'),
      desc: L('Xác định tháng đầu tiên qua MIN() và tự nối (SELF JOIN) tính retention theo tuổi cohort', 'Determine first month via MIN() and compute age-based retention via self join'),
      sql: `-- 1. Ma trận retention creator affiliate theo tuổi tháng
WITH cm AS (
  SELECT creator_id, strftime('%Y-%m', datetime(start_ts, '+13 hours')) AS ym
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
       COUNT(DISTINCT creator_id) AS active_creators,
       ROUND(100.0 * COUNT(DISTINCT creator_id)
         / FIRST_VALUE(COUNT(DISTINCT creator_id)) OVER (PARTITION BY cohort ORDER BY age), 1) AS retention_pct
FROM aged
WHERE cohort < '2026-09' AND (c_year * 12 + c_mon) <= (2026 * 12 + 8) -- Loại bỏ T9 bị cắt phải
GROUP BY cohort, age;`,
    },
    {
      title: L('2. Kiểm Tra Độ Nhạy Girl Style', '2. Girl Style Sensitivity Filter'),
      desc: L('Tách bạch GMV cohort có và không có tài khoản đồng vận hành girlstyle.vn', 'Isolate cohort GMV with and without in-house satellite account girlstyle.vn'),
      sql: `-- 2. Phân tích độ nhạy GMV cohort loại trừ girlstyle.vn
WITH creator_cohort AS (
  SELECT creator_id,
         MIN(strftime('%Y-%m', datetime(start_ts, '+13 hours'))) AS cohort
  FROM stg_live
  WHERE live_type = 'Affiliate LIVE'
  GROUP BY 1
)
SELECT 
    cc.cohort,
    COUNT(DISTINCT l.creator_id) AS creators_count,
    SUM(l.gmv) AS gmv_with_girlstyle,
    SUM(CASE WHEN l.creator_id <> 'girlstyle.vn' THEN l.gmv ELSE 0 END) AS gmv_without_girlstyle,
    ROUND(100.0 * SUM(CASE WHEN l.creator_id = 'girlstyle.vn' THEN l.gmv ELSE 0 END) / SUM(l.gmv), 1) AS girlstyle_share_pct
FROM stg_live l
JOIN creator_cohort cc USING (creator_id)
WHERE live_type = 'Affiliate LIVE'
GROUP BY 1
ORDER BY 1;`,
    },
  ];

  const handleCopyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 4.1 & 4.2: Bối cảnh, Chuyển thể & Chuẩn bị phương pháp luận */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              4.1 & 4.2
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Mục Tiêu & Phương Pháp Luận Chuyển Thể Cohort Creator', 'Objectives & Methodological Cohort Adaptation')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L(
                  'Giải quyết câu hỏi trọng tâm #4: Mạng lưới affiliate có bền vững và đa dạng thật không?',
                  'Resolving Core Question #4: Is the affiliate network genuinely diversified and resilient?',
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip tone="cyan">250 Affiliate Live</Chip>
            <Chip tone="amber">Tách Kênh Girl Style</Chip>
          </div>
        </div>

        {/* Bảng chuyển thể phương pháp luận */}
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs" data-ui="table">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold" data-ui="tr">
                <th className="py-2.5 px-3 min-w-[150px]">{L('Khái niệm gốc (E-commerce)', 'Standard E-comm Concept')}</th>
                <th className="py-2.5 px-3 min-w-[200px]">{L('Chuyển thể thực tế (TikTok Shop)', 'Practical TikTok Shop Adaptation')}</th>
                <th className="py-2.5 px-3 min-w-[280px]">{L('Lý do & Nguyên tắc kiểm soát sai lệch', 'Rationale & Bias Controls')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800" data-ui="tbody">
              <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                  {L('Cohort tháng mua đầu', 'First Purchase Cohort')}
                </td>
                <td className="py-2.5 px-3 font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {L('Cohort tháng livestream đầu tiên', 'First Live Streaming Month')}
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {L('Không có mã đơn hay khách hàng cá nhân; gom cohort theo tháng phát sinh ca Live/video đầu.', 'No customer_id available; cohort creators by month of initial live stream or video upload.')}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                  {L('Tỷ lệ giữ chân khách (Retention)', 'Customer Retention Rate')}
                </td>
                <td className="py-2.5 px-3 font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {L('Tỷ lệ affiliate còn xuất hiện / còn ra đơn', 'Affiliate Active & Seller Retention')}
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {L('Theo dõi đồng thời 2 định nghĩa: "còn xuất hiện" (có ca live) và "còn bán được" (có GMV > 0).', 'Track two definitions in parallel: "appeared" (streamed) and "active seller" (GMV > 0).')}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                  {L('Giá trị trọn đời (CLTV)', 'Customer Lifetime Value')}
                </td>
                <td className="py-2.5 px-3 font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {L('Giá trị GMV vòng đời creator lũy kế', 'Cumulative GMV Lifecycle Value')}
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {L('Gọi chính xác là GMV vòng đời, không gọi CLTV vì thiếu dữ liệu biên lợi nhuận ròng và COGS.', 'Reported strictly as GMV lifecycle value rather than CLTV due to absence of net COGS/margins.')}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                  {L('Khách hàng rời bỏ (Churn)', 'Customer Churn')}
                </td>
                <td className="py-2.5 px-3 font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {L('Ngưỡng ngừng hoạt động 30 ngày', '30-Day Stream Inactivity Threshold')}
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {L('Coi creator đã churn khi không có bất kỳ phiên Live nào trong 30 ngày liên tiếp.', 'Creator is classified as churned when zero live sessions occur within 30 consecutive days.')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4.3.A: Quy mô Tuyển mới vs Hoạt động theo tháng */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              4.3.A
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Quy Mô Cohort: Tuyển Mới & Người Hoạt Động Theo Tháng', 'Cohort Dynamics: New Recruitment vs Monthly Active Creators')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L(
                  'Tổng 250 creator Live affiliate: Nguồn tuyển mới sụt giảm hơn một nửa từ Tháng 5',
                  '250 total affiliate live creators: New recruitment contracted over 50% starting May',
                )}
              </p>
            </div>
          </div>
          <Chip tone="amber">Đỉnh 127 Creator T4 → 49 Creator T8</Chip>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          {/* Biểu đồ thanh đôi: Tuyển mới vs Còn hoạt động */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortScaleData} margin={{ top: 20, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="ym" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} width={38} />
                <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v)} creator`} />} />
                <Legend wrapperStyle={{ fontSize: 11 }} formatter={legendFormatter} />
                <Bar dataKey="newCreators" name={L('Tuyển mới', 'New Recruited')} fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
                <Bar dataKey="activeAppear" name={L('Còn xuất hiện', 'Active Appeared')} fill={COLORS.amber} radius={[4, 4, 0, 0]} />
                <Bar dataKey="activeSales" name={L('Có ra đơn (GMV>0)', 'Active Sellers')} fill={COLORS.teal} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bảng số liệu chi tiết quy mô */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs" data-ui="table">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold" data-ui="tr">
                  <th className="py-2 px-3">{L('Tháng', 'Month')}</th>
                  <th className="py-2 px-2.5 text-right">{L('Tuyển mới', 'New')}</th>
                  <th className="py-2 px-2.5 text-right">{L('Xuất hiện', 'Appeared')}</th>
                  <th className="py-2 px-2.5 text-right">{L('Có đơn', 'Sellers')}</th>
                  <th className="py-2 px-3">{L('Đặc điểm thực tế', 'Context Note')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800" data-ui="tbody">
                {cohortScaleData.map((r, i) => (
                  <tr key={i} className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${r.ym === 'T4/2026' ? 'bg-[#C8EEF7]/25 font-semibold' : ''}`}>
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">{r.ym}</td>
                    <td className="py-2 px-2.5 text-right tabular-nums font-bold text-[#0D7287] dark:text-[#9BE7FA]">{r.newCreators}</td>
                    <td className="py-2 px-2.5 text-right tabular-nums font-bold text-slate-900 dark:text-white">{r.activeAppear}</td>
                    <td className="py-2 px-2.5 text-right tabular-nums font-bold text-amber-700 dark:text-amber-400">{r.activeSales}</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 text-[11px]">{typeof r.note === 'string' ? r.note : L(r.note.vi, r.note.en)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4.3.B: Ma trận Retention (Heatmap Cohort x Tháng tuổi) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              4.3.B
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Ma Trận Giữ Chân Creator (Cohort Retention Heatmap)', 'Cohort Retention Matrix & Quality Degradation Heatmap')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L(
                  'Tỷ lệ giữ chân M+1 giảm đều từ 71,2% (T3) xuống 28,6% (T7); các ô kiểm duyệt T9 được đánh dấu',
                  'M+1 retention decayed steadily from 71.2% (Mar) to 28.6% (Jul); right-censored Sep cells tagged',
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-[#C8EEF7]/40 p-0.5 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setRetentionMetric('pct')}
                className={`min-h-8 cursor-pointer rounded-lg px-2.5 text-xs font-bold transition-colors ${
                  retentionMetric === 'pct' ? 'bg-[#9BE7FA] text-slate-950' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                % Giữ chân
              </button>
              <button
                type="button"
                onClick={() => setRetentionMetric('count')}
                className={`min-h-8 cursor-pointer rounded-lg px-2.5 text-xs font-bold transition-colors ${
                  retentionMetric === 'count' ? 'bg-[#9BE7FA] text-slate-950' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Số lượng Creator
              </button>
            </div>
          </div>
        </div>

        {/* Bảng Heatmap Retention */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-center border-collapse text-xs" data-ui="table">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold" data-ui="tr">
                <th className="py-2.5 px-3 text-left min-w-[90px]">{L('Cohort', 'Cohort')}</th>
                <th className="py-2.5 px-2.5 w-16">{L('Quy mô', 'Size')}</th>
                <th className="py-2.5 px-2.5 w-16">M+0</th>
                <th className="py-2.5 px-2.5 w-16">M+1</th>
                <th className="py-2.5 px-2.5 w-16">M+2</th>
                <th className="py-2.5 px-2.5 w-16">M+3</th>
                <th className="py-2.5 px-2.5 w-16">M+4</th>
                <th className="py-2.5 px-2.5 w-16">M+5</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 tabular-nums" data-ui="tbody">
              {retentionMatrix.map((row, i) => {
                const getHeatCls = (pct: number, censored?: boolean) => {
                  if (censored) return 'bg-slate-100/70 text-slate-400 dark:bg-slate-800/40 dark:text-slate-500 italic';
                  if (pct >= 70) return 'bg-[#9BE7FA]/60 font-bold text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA]';
                  if (pct >= 40) return 'bg-[#C8EEF7]/50 font-bold text-[#0D7287] dark:bg-[#C8EEF7]/15 dark:text-[#C8EEF7]';
                  if (pct >= 20) return 'bg-[#FFE485]/40 text-amber-900 dark:bg-[#FFE485]/15 dark:text-[#FFE485]';
                  if (pct > 0) return 'bg-amber-100/40 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300';
                  return 'text-slate-400';
                };

                return (
                  <tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-left font-bold font-sans text-slate-900 dark:text-white">
                      {row.cohort}
                    </td>
                    <td className="py-2 px-2.5 font-bold text-slate-800 dark:text-slate-200">
                      {row.size}
                    </td>
                    {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5].map((cell, idx) => {
                      if (!cell) {
                        return (
                          <td key={idx} className="py-2 px-2.5 text-slate-300 dark:text-slate-700">
                            —
                          </td>
                        );
                      }
                      const val = retentionMetric === 'pct' ? `${cell.pct}%` : cell.count;
                      return (
                        <td
                          key={idx}
                          className={`py-2 px-2.5 transition-colors ${getHeatCls(cell.pct, cell.censored)}`}
                          title={cell.censored ? L('Ô bị cắt phải bởi tháng 9 (chỉ có 4 ngày)', 'Right-censored by partial September (4 days)') : undefined}
                        >
                          {val}
                          {cell.censored && <span className="text-[9px] ml-0.5 not-italic">*</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-amber-600 dark:text-amber-400">* Ghi chú cắt phải (Right-censoring):</span>
            {L('Các ô có dấu * rơi vào Tháng 9 (chỉ có 4 ngày), không được xem là retention hoàn chỉnh.', 'Cells with * fall into September (4 days) and represent incomplete truncated periods.')}
          </div>
          <div>
            {L('Độ suy thoái M+1: T3 (71,2%) → T4 (45,0%) → T7 (28,6%)', 'M+1 retention decay: Mar (71.2%) → Apr (45.0%) → Jul (28.6%)')}
          </div>
        </div>
      </div>

      {/* 4.3.C & 4.3.D: Thời gian sống & Kích hoạt phiên đầu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Thời gian sống (Kaplan-Meier Survival) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
                4.3.C
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">
                  {L('Thời Gian Sống & Tỷ Lệ Tồn Tại Của Creator', 'Creator Lifespan & Survival Dynamics')}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {L('Đo lường khoảng cách từ phiên đầu đến phiên cuối (ngưỡng churn 30 ngày)', 'Measuring duration from first to last session with 30-day inactivity churn')}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block mb-0.5">{L('Trung vị thời gian sống:', 'Median Lifespan:')}</span>
                  <span className="tabular-nums font-bold text-[#074553] dark:text-[#9BE7FA] text-base">14,0 {L('ngày', 'days')}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Mean = 35,7 {L('ngày', 'days')}</span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block mb-0.5">{L('Creator live đúng 1 phiên:', '1-Session Only Creators:')}</span>
                  <span className="tabular-nums font-bold text-amber-800 dark:text-amber-300 text-base">22,8% (57/250)</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{L('Bỏ cuộc ngay sau ca đầu', 'Abandoned immediately')}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span>{L('Tồn tại từ 30 ngày trở lên:', 'Survived >= 30 days:')}</span>
                  <span className="font-bold tabular-nums text-slate-900 dark:text-white">36,4% (91/250 creator)</span>
                </div>
                <div className="flex justify-between">
                  <span>{L('Còn hoạt động trong 30 ngày cuối:', 'Active in last 30 days:')}</span>
                  <span className="font-bold tabular-nums text-[#0D7287] dark:text-[#9BE7FA]">20,4% (51/250 creator)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kích hoạt phiên đầu tiên (Session 1 Activation) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 font-black text-slate-950 text-sm">
                4.3.D
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">
                  {L('Kích Hoạt Phiên Đầu Tiên & Quy Tắc 3 Phiên', 'First Session Activation & The 3-Session Rule')}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {L('Hành vi ra đơn sớm quyết định khả năng gắn bó và hiệu suất lâu dài', 'Early order conversion dictates affiliate longevity and lifetime output')}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600 dark:text-slate-400">{L('Tỷ lệ có đơn ngay phiên đầu:', 'Session 1 Conversion Rate:')}</span>
                  <span className="tabular-nums font-bold text-amber-800 dark:text-amber-300">14,8% (37/250 creator)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">{L('Tỷ lệ chưa từng bán được đơn nào:', 'Never Sold Any Orders:')}</span>
                  <span className="tabular-nums font-bold text-rose-600 dark:text-rose-400">56,0% (140/250 creator)</span>
                </div>
              </div>

              <p className="text-[11px]">
                {L(
                  'Phân tích ngược cho thấy hơn một nửa mạng lưới (56%) không bao giờ phát sinh doanh số. Những KOC có đơn ngay trong 3 phiên đầu tiên có xác suất gắn bó qua 30 ngày cao gấp 2,8 lần nhóm không ra đơn.',
                  'Forensic checks reveal over half the network (56%) never generated a single order. KOCs securing sales within their first 3 sessions exhibit 2.8x higher probability of surviving past 30 days.',
                )}
              </p>

              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px]">
                <strong>{L('Quy tắc hành động (Phục vụ Mục 8):', 'Action Rule for Section 8:')}</strong> {L(
                  'Tập trung hỗ trợ mẫu sản phẩm (seeding) và voucher đẩy view cho KOC trong đúng 3 ca Live đầu tiên. Nếu sau 3 ca vẫn 0 đơn, tỷ lệ bỏ cuộc lên tới trên 80%.',
                  'Focus sample seeding and promo vouchers exclusively on a KOC’s first 3 streams. Inactivity abandonment exceeds 80% if zero sales occur by stream 3.',
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4.3.E & 4.3.F: Giá trị vòng đời GMV & Thử nghiệm bóc tách Girl Style */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              4.3.E & 4.3.F
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Giá Trị Vòng Đời GMV & Phân Tích Độ Nhạy Girl Style', 'GMV Lifecycle Value & Girl Style Sensitivity Analysis')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L(
                  'Girl Style (@girlstyle.vn) gánh 56,1% tổng GMV Live affiliate (1,26 Tỷ đ); bóc tách số liệu có và không có tài khoản nội bộ',
                  'Girl Style accounts for 56.1% of affiliate live GMV (1.26B VND); isolating cohort performance with vs without in-house co-op',
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-[#C8EEF7]/40 p-0.5 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setGirlStyleScope('without')}
                className={`min-h-8 cursor-pointer rounded-lg px-2.5 text-xs font-bold transition-colors ${
                  girlStyleScope === 'without' ? 'bg-[#9BE7FA] text-slate-950' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Không có Girl Style (Chuẩn thực tế)
              </button>
              <button
                type="button"
                onClick={() => setGirlStyleScope('with')}
                className={`min-h-8 cursor-pointer rounded-lg px-2.5 text-xs font-bold transition-colors ${
                  girlStyleScope === 'with' ? 'bg-[#9BE7FA] text-slate-950' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Có Girl Style (Dữ liệu thô)
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          {/* Biểu đồ GMV Cohort có vs không có Girl Style */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortGmvData} margin={{ top: 20, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="cohort" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} width={45}>
                  <Label value={L('(Tr đ)', '(M VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 1)} Tr đ`} />} />
                <Legend wrapperStyle={{ fontSize: 11 }} formatter={legendFormatter} />
                <Bar
                  dataKey={girlStyleScope === 'with' ? 'withGs' : 'withoutGs'}
                  name={girlStyleScope === 'with' ? L('GMV (Có Girl Style)', 'GMV (With GS)') : L('GMV (Không có Girl Style)', 'GMV (Excl. GS)')}
                  fill={girlStyleScope === 'with' ? COLORS.amber : COLORS.cyan}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey={girlStyleScope === 'with' ? 'withGs' : 'withoutGs'}
                    position="top"
                    fontSize={10}
                    className={TEXT_FILL_CLASS}
                    formatter={(v: unknown) => `${n(Number(v), 0)}M`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bảng so sánh GMV Cohort */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs" data-ui="table">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold" data-ui="tr">
                  <th className="py-2 px-3">{L('Cohort', 'Cohort')}</th>
                  <th className="py-2 px-2.5 text-right">{L('Số creator', 'Size')}</th>
                  <th className="py-2 px-3 text-right">{L('Có Girl Style', 'With GS')}</th>
                  <th className="py-2 px-3 text-right">{L('Bỏ Girl Style', 'Excl. GS')}</th>
                  <th className="py-2 px-3">{L('Đánh giá thực chất', 'Evaluation')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 tabular-nums" data-ui="tbody">
                {cohortGmvData.map((r, i) => (
                  <tr key={i} className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${r.cohort === 'T5/2026' ? 'bg-[#FFE485]/15 font-semibold' : ''}`}>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-white">{r.cohort}</td>
                    <td className="py-2 px-2.5 text-right text-slate-700 dark:text-slate-300">{r.size}</td>
                    <td className="py-2 px-3 text-right text-amber-700 dark:text-amber-400 font-bold">{n(r.withGs, 1)}M</td>
                    <td className="py-2 px-3 text-right text-[#0D7287] dark:text-[#9BE7FA] font-bold">{n(r.withoutGs, 1)}M</td>
                    <td className="py-2 px-3 font-sans text-slate-600 dark:text-slate-400 text-[11px]">{typeof r.note === 'string' ? r.note : L(r.note.vi, r.note.en)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 p-3.5 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <strong className="text-[#074553] dark:text-[#9BE7FA]">{L('Kết luận then chốt về Giá trị vòng đời:', 'Critical LTV Finding:')}</strong> {L(
            'Nếu không bóc tách Girl Style, Cohort Tháng 5 trông giống như đợt tuyển dụng KOC thành công nhất lịch sử (tạo 1,46 tỷ đ). Nhưng khi bóc tách, Cohort T5 thực chất chỉ tạo ra 206,8 triệu đ từ các KOC bên ngoài, thấp hơn cả Cohort T4 (224,4 triệu) và T3 (438,6 triệu). Doanh thu affiliate sụt giảm đều đặn theo từng đợt tuyển.',
            'Without isolating Girl Style, Cohort May appears as the most successful recruitment cohort ever (1.46B VND). Once isolated, Cohort May produced merely 206.8M VND from external KOCs, lagging April (224.4M) and March (438.6M). External affiliate GMV decayed consistently across every subsequent cohort.',
          )}
        </div>
      </div>

      {/* 4.3.G: Phễu kích hoạt kép & Shoppable Videos */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              4.3.G
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Phễu Kích Hoạt Kép & Đối Chiếu Shoppable Videos', 'Dual Activation Funnels & Shoppable Video Cross-Validation')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L(
                  'Tách bạch 2 phễu vì khung thời gian khác nhau (90 ngày vs 226 ngày) để tránh kết luận ngụy biện',
                  'Separating 2 funnels due to disparate observation windows (90d vs 226d) to maintain rigor',
                )}
              </p>
            </div>
          </div>
          <Chip tone="cyan">Đối chiếu Live & Video</Chip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Phễu 1 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {L('Phễu 1: Toàn Mạng Lưới (90 ngày)', 'Funnel 1: Network (90d)')}
                </span>
                <Chip tone="cyan">Creators Merged</Chip>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span>{L('Creator liên kết:', 'Linked Creators:')}</span>
                  <span className="tabular-nums font-bold">5.713</span>
                </li>
                <li className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span>{L('Có phát sinh doanh thu:', 'Active with Sales:')}</span>
                  <span className="tabular-nums font-bold text-amber-700 dark:text-amber-400">292 (5,1%)</span>
                </li>
                <li className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span>{L('Gánh 91% GMV mạng lưới:', 'Drive 91% GMV:')}</span>
                  <span className="tabular-nums font-bold text-[#0D7287] dark:text-[#9BE7FA]">58 creator (1,0%)</span>
                </li>
              </ul>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 italic">
              {L('Tỷ lệ kích hoạt chỉ 5,1%; 94,9% creator liên kết không tạo ra đồng nào.', 'Activation rate is only 5.1%; 94.9% of linked creators produced zero revenue.')}
            </div>
          </div>

          {/* Phễu 2 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {L('Phễu 2: Affiliate LIVE (226 ngày)', 'Funnel 2: Live Affiliate (226d)')}
                </span>
                <Chip tone="amber">Shop LIVE</Chip>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span>{L('Từng livestream gắn giỏ:', 'Ever Streamed Live:')}</span>
                  <span className="tabular-nums font-bold">250</span>
                </li>
                <li className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span>{L('Từng có GMV > 0:', 'Ever Sold (GMV > 0):')}</span>
                  <span className="tabular-nums font-bold text-amber-700 dark:text-amber-400">110 (44,0%)</span>
                </li>
                <li className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span>{L('Còn hoạt động 30 ngày cuối:', 'Active in Last 30 Days:')}</span>
                  <span className="tabular-nums font-bold text-[#0D7287] dark:text-[#9BE7FA]">51 (20,4%)</span>
                </li>
              </ul>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 italic">
              {L('56% creator live chưa từng ra đơn; chỉ 20,4% duy trì hoạt động đến cuối mùa.', '56% of live creators never sold; only 20.4% sustained streams to season end.')}
            </div>
          </div>

          {/* Phễu 3 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {L('Đối chiếu: Shoppable Videos (226 ngày)', 'Shoppable Videos (226d)')}
                </span>
                <Chip tone="cyan">Shoppable Videos</Chip>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span>{L('Tổng số video gắn giỏ:', 'Total Shoppable Videos:')}</span>
                  <span className="tabular-nums font-bold">4.417</span>
                </li>
                <li className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span>{L('Creator đăng video:', 'Distinct Video Creators:')}</span>
                  <span className="tabular-nums font-bold">1.847</span>
                </li>
                <li className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span>{L('Video có ra đơn (GMV>0):', 'Videos with GMV > 0:')}</span>
                  <span className="tabular-nums font-bold text-[#0D7287] dark:text-[#9BE7FA]">960 (21,7%)</span>
                </li>
              </ul>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 italic">
              {L('78,3% video giỏ hàng không ra đơn; số creator đăng video giảm từ 724 (T4) về 195 (T8).', '78.3% of videos had 0 orders; active video creators fell from 724 (Apr) to 195 (Aug).')}
            </div>
          </div>
        </div>
      </div>

      {/* 4.4: Kỹ thuật SQL & 4.6: Hạn chế kiểm duyệt (Censoring) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SQL mẫu */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3">
              <div className="flex items-center gap-2">
                <TerminalSquare className="h-5 w-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <h4 className="text-sm font-black text-slate-950 dark:text-white">
                  {L('Kỹ Thuật SQL Cohort & Bóc Tách Kênh', 'Cohort & Sensitivity SQL Engineering')}
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">SQLite Engine</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {stage4Sql.map((snip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSqlTab(idx)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors min-h-8 cursor-pointer ${
                    activeSqlTab === idx
                      ? 'bg-[#9BE7FA] text-slate-950'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {snip.title}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3.5 text-slate-100 relative">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1.5 mb-1.5 border-b border-slate-800" data-ui="code-header">
                <span>{stage4Sql[activeSqlTab].desc}</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(stage4Sql[activeSqlTab].sql, activeSqlTab)}
                  className="flex items-center gap-1 hover:text-[#9BE7FA] transition-colors cursor-pointer text-xs"
                >
                  {copiedIndex === activeSqlTab ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">{L('Đã chép', 'Copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="font-mono text-xs overflow-x-auto text-[#9BE7FA] leading-relaxed max-h-56">
                <code>{stage4Sql[activeSqlTab].sql}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* 4.6: Hạn chế kiểm duyệt dữ liệu bắt buộc */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 pb-3 mb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 font-black text-slate-950 text-sm">
              4.6
            </span>
            <div>
              <h4 className="text-sm font-black text-slate-950 dark:text-white">
                {L('Kiểm Duyệt Dữ Liệu & Ranh Giới Phương Pháp Luận', 'Data Censoring & Methodological Boundaries')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {L('Xử lý sai lệch cắt trái (Left-censoring) và cắt phải (Right-censoring)', 'Handling left-censoring and right-censoring biases strictly')}
              </p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>{L('1. Cắt trái ở Cohort T3 (Left-Censoring):', '1. Left-Censoring in Cohort Mar:')}</strong> {L(
                  'Cửa sổ bắt đầu từ 09/03, nên Cohort T3 (66 creator) thực chất là creator xuất hiện lần đầu trong dữ liệu, bao gồm cả những người đã live từ trước. Có 26 creator xuất hiện ngay trong tuần đầu (09–15/03). Retention T3 cao (71,2%) một phần vì lẫn creator trung thành cũ.',
                  'Data begins Mar 09, meaning Cohort Mar includes existing pre-window creators. 26 creators streamed in week 1. High retention reflects legacy loyalists, not superior onboarding.'
                )}
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>{L('2. Cắt phải ở Tháng 9 (Right-Censoring):', '2. Right-Censoring in September:')}</strong> {L(
                  'Tháng 9 chỉ có 4 ngày quan sát (đến 04/09). Mọi ô rơi vào Tháng 9 đều bị cắt ngắn và không được xem là retention hoàn chỉnh. Toàn bộ Cohort T9 (5 creator) bị loại khỏi phân tích.',
                  'September captures only 4 days. All cells falling into Sep are right-censored and excluded from true retention reads. Cohort Sep (5 creators) is omitted.'
                )}
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>{L('3. So sánh cohort không cùng tuổi:', '3. Age-Mismatched Comparisons:')}</strong> {L(
                  'Các cohort sau có ít thời gian tích lũy hơn cohort trước. Luôn phải so sánh GMV và retention ở cùng một mốc tháng tuổi (M+0, M+1), không so sánh tổng dồn.',
                  'Later cohorts have fewer observation days. Always evaluate GMV and retention at identical age horizons (M+0, M+1) rather than lifetime sums.'
                )}
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>{L('4. Không nhầm lẫn giữa GMV và Lợi nhuận:', '4. GMV vs Profit Distinction:')}</strong> {L(
                  'Dữ liệu chỉ có GMV phát sinh qua link, không có tỷ lệ chia hoa hồng thực tế, chi phí mẫu gửi hay tỷ lệ hoàn hủy đơn (Mục 1.4).',
                  'Metrics reflect gross merchandise value, not net economic contribution or creator commission payouts.'
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
