'use client';

import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Flame,
  LineChart as LineChartIcon,
  Scale,
  Table,
  TerminalSquare,
  TrendingDown,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Label,
  Legend,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  COLORS,
  dailySeries,
} from '../playbook/playbookData';
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

// 26 Tuần thực tế trích xuất từ 180 ngày nguồn
const WEEKLY_SERIES = [
  { label: 'W11 (09/03)', gmv: 265.3, lives: 78, koc: 10.1, gmvPerLive: 3402 },
  { label: 'W12 (16/03)', gmv: 257.7, lives: 236, koc: 21.4, gmvPerLive: 1092 },
  { label: 'W13 (23/03)', gmv: 366.8, lives: 176, koc: 33.0, gmvPerLive: 2084 },
  { label: 'W14 (30/03)', gmv: 486.8, lives: 427, koc: 71.4, gmvPerLive: 1140 },
  { label: 'W15 (06/04)', gmv: 500.9, lives: 651, koc: 88.6, gmvPerLive: 769 },
  { label: 'W16 (13/04)', gmv: 650.0, lives: 427, koc: 64.3, gmvPerLive: 1522 },
  { label: 'W17 (20/04)', gmv: 655.2, lives: 334, koc: 56.6, gmvPerLive: 1962 },
  { label: 'W18 (27/04)', gmv: 400.0, lives: 333, koc: 32.6, gmvPerLive: 1201 },
  { label: 'W19 (04/05)', gmv: 554.7, lives: 353, koc: 32.9, gmvPerLive: 1571 },
  { label: 'W20 (11/05)', gmv: 630.4, lives: 332, koc: 29.7, gmvPerLive: 1899 },
  { label: 'W21 (18/05)', gmv: 643.8, lives: 160, koc: 35.9, gmvPerLive: 4024 },
  { label: 'W22 (25/05)', gmv: 744.6, lives: 392, koc: 54.3, gmvPerLive: 1900 },
  { label: 'W23 (01/06)', gmv: 709.9, lives: 447, koc: 52.6, gmvPerLive: 1588 },
  { label: 'W24 (08/06)', gmv: 952.3, lives: 438, koc: 38.1, gmvPerLive: 2174 },
  { label: 'W25 (15/06)', gmv: 1058.2, lives: 283, koc: 25.6, gmvPerLive: 3739 }, // ĐỈNH TUẦN
  { label: 'W26 (22/06)', gmv: 850.2, lives: 301, koc: 30.1, gmvPerLive: 2824 },
  { label: 'W27 (29/06)', gmv: 640.1, lives: 177, koc: 18.9, gmvPerLive: 3616 },
  { label: 'W28 (06/07)', gmv: 594.2, lives: 203, koc: 22.0, gmvPerLive: 2927 },
  { label: 'W29 (13/07)', gmv: 469.1, lives: 237, koc: 29.1, gmvPerLive: 1979 },
  { label: 'W30 (20/07)', gmv: 400.6, lives: 178, koc: 21.4, gmvPerLive: 2250 },
  { label: 'W31 (27/07)', gmv: 289.0, lives: 179, koc: 18.3, gmvPerLive: 1615 },
  { label: 'W32 (03/08)', gmv: 204.2, lives: 162, koc: 15.7, gmvPerLive: 1261 },
  { label: 'W33 (10/08)', gmv: 143.9, lives: 112, koc: 12.4, gmvPerLive: 1285 },
  { label: 'W34 (17/08)', gmv: 114.3, lives: 146, koc: 16.1, gmvPerLive: 783 },
  { label: 'W35 (24/08)', gmv: 111.2, lives: 153, koc: 22.7, gmvPerLive: 727 },
  { label: 'W36 (31/08)', gmv: 41.7, lives: 99, koc: 23.4, gmvPerLive: 421 },
];

export default function Stage3TimeSeriesAndSeasonality() {
  const { L, n } = usePlaybookLang();
  const [dailyView, setDailyView] = useState<'daily' | 'cumulative'>('daily');
  const [weeklyView, setWeeklyView] = useState<'gmv_lives' | 'efficiency'>('gmv_lives');
  const [activeSqlTab, setActiveSqlTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Bảng phân tích 8 tháng thực tế (Đối chiếu Mục 3.3.A)
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

  // Chỉ số mùa vụ theo thứ trong tuần (Mục 3.3.C)
  const dowSeasonality = [
    { dow: 'Thứ 2', mean: 65.9, median: 62.8, index: 93.1, growthMed: 71.2, peakMed: 85.4, declineMed: 25.1 },
    { dow: 'Thứ 3', mean: 69.6, median: 60.1, index: 98.3, growthMed: 60.1, peakMed: 147.2, declineMed: 28.5 },
    { dow: 'Thứ 4', mean: 67.5, median: 65.2, index: 95.4, growthMed: 67.8, peakMed: 118.9, declineMed: 40.9 },
    { dow: 'Thứ 5', mean: 79.6, median: 76.3, index: 112.6, growthMed: 83.3, peakMed: 162.7, declineMed: 38.6 }, // ĐỈNH TUẦN
    { dow: 'Thứ 6', mean: 72.3, median: 68.8, index: 102.3, growthMed: 75.4, peakMed: 135.2, declineMed: 35.2 },
    { dow: 'Thứ 7', mean: 71.0, median: 68.7, index: 100.4, growthMed: 73.1, peakMed: 140.6, declineMed: 36.8 },
    { dow: 'Chủ Nhật', mean: 69.3, median: 66.9, index: 97.9, growthMed: 74.5, peakMed: 132.8, declineMed: 37.1 },
  ];

  // Tương quan chéo (Cross-correlation với lag 0-7 ngày) (Mục 3.3.D)
  const lagData = [
    { lag: 'Lag 0d', rLives: 0.412, rKoc: 0.326, desc: L('Cùng ngày', 'Same day') },
    { lag: 'Lag 1d', rLives: 0.386, rKoc: 0.350, desc: L('GMV sau marketing 1 ngày', 'GMV lags marketing 1 day') },
    { lag: 'Lag 2d', rLives: 0.415, rKoc: 0.357, desc: L('Đỉnh tương quan ngắn', 'Short-term peak') },
    { lag: 'Lag 3d', rLives: 0.409, rKoc: 0.342, desc: L('Dư chấn ngày thứ 3', 'Day 3 residual') },
    { lag: 'Lag 4d', rLives: 0.405, rKoc: 0.335, desc: L('Giảm dần', 'Diminishing') },
    { lag: 'Lag 5d', rLives: 0.400, rKoc: 0.333, desc: L('Duy trì ổn định', 'Stable') },
    { lag: 'Lag 6d', rLives: 0.407, rKoc: 0.363, desc: L('Chu kỳ tuần hoàn', 'Weekly cycle') },
    { lag: 'Lag 7d', rLives: 0.446, rKoc: 0.381, desc: L('Tương quan chu kỳ tuần', 'Full 7-day cyclical peak') },
  ];

  // SQL Truy vấn mẫu thực nghiệm
  const sqlSnippets = [
    {
      title: L('1. Rolling Average & MoM Chuẩn Hóa Ngày', '1. Rolling MA7 & Day-Normalized MoM'),
      desc: L('Tính trung bình trượt 7 ngày và tính tốc độ tăng trưởng tháng theo GMV/ngày', 'Compute MA7 and day-normalized month-over-month growth via LAG()'),
      sql: `-- 1. Bảng lịch và GMV bình quân ngày chuẩn hóa MoM
WITH daily AS (
  SELECT date, gmv, units FROM stg_store
),
roll AS (
  SELECT date, gmv,
         AVG(gmv) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma7,
         AVG(gmv) OVER (ORDER BY date ROWS BETWEEN 27 PRECEDING AND CURRENT ROW) AS ma28
  FROM daily
),
monthly AS (
  SELECT strftime('%Y-%m', date) AS ym,
         COUNT(*) AS n_days,
         SUM(gmv) AS gmv,
         SUM(gmv) * 1.0 / COUNT(*) AS gmv_per_day,
         SUM(units) AS units,
         SUM(gmv) * 1.0 / SUM(units) AS aov
  FROM daily GROUP BY 1
)
SELECT ym, n_days, gmv, gmv_per_day, aov,
       gmv_per_day * 1.0 / LAG(gmv_per_day) OVER (ORDER BY ym) - 1 AS mom_per_day_pct
FROM monthly;`,
    },
    {
      title: L('2. Điểm Giao Cắt Sớm MA7 vs MA28', '2. Early Warning: MA7 vs MA28 Dead Cross'),
      desc: L('Tìm ngày đầu tiên đường MA7 cắt xuống dưới MA28 sau ngày đỉnh 16/06', 'Detect the first date MA7 crosses below MA28 after June 16 peak'),
      sql: `-- 2. Phát hiện Dead Cross báo hiệu kết thúc mùa vụ
WITH rolling_data AS (
  SELECT date, gmv,
         AVG(gmv) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma7,
         AVG(gmv) OVER (ORDER BY date ROWS BETWEEN 27 PRECEDING AND CURRENT ROW) AS ma28
  FROM stg_store
),
cross_detection AS (
  SELECT date, gmv, ma7, ma28,
         (ma7 - ma28) AS diff,
         LAG(ma7 - ma28) OVER (ORDER BY date) AS prev_diff
  FROM rolling_data
  WHERE date >= '2026-06-16'
)
SELECT date, ma7, ma28, diff
FROM cross_detection
WHERE prev_diff >= 0 AND diff < 0
LIMIT 1;`,
    },
    {
      title: L('3. Phân Rã Hiệu Ứng Số Lượng vs Hiệu Suất', '3. Quantity vs Efficiency Decomposition'),
      desc: L('Phân rã mức sụt giảm doanh thu thành hiệu ứng số phiên Live và hiệu ứng GMV/phiên', 'Decompose revenue drop into session volume effect and GMV per session efficiency'),
      sql: `-- 3. Phân rã delta GMV (Tháng 6 vs Tháng 8)
WITH summary AS (
  SELECT 
    strftime('%m', date) AS m,
    SUM(gmv) AS total_gmv,
    SUM(live_sessions) AS total_lives,
    SUM(gmv) * 1.0 / SUM(live_sessions) AS gmv_per_live
  FROM stg_store
  WHERE strftime('%m', date) IN ('06', '08')
  GROUP BY 1
)
SELECT 
  j.total_gmv AS gmv_june, a.total_gmv AS gmv_aug,
  (a.total_gmv - j.total_gmv) AS delta_gmv,
  -- Quantity effect: delta Lives * June Eff
  (a.total_lives - j.total_lives) * j.gmv_per_live AS quantity_effect,
  -- Efficiency effect: June Lives * delta Eff
  j.total_lives * (a.gmv_per_live - j.gmv_per_live) AS efficiency_effect,
  -- Interaction
  (a.total_lives - j.total_lives) * (a.gmv_per_live - j.gmv_per_live) AS interaction
FROM (SELECT * FROM summary WHERE m = '06') j
JOIN (SELECT * FROM summary WHERE m = '08') a;`,
    },
  ];

  const handleCopyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 3.1 & 3.2: Bối cảnh, Bảng Lịch & Tiền xử lý */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              3.1 & 3.2
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Mục Tiêu & Chuẩn Bị Chuỗi Thời Gian (Date Dimension & UTC+7)', 'Objectives & Time-Series Preparation')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L(
                  'Giải quyết câu hỏi trọng tâm #1: Doanh thu biến động do mùa vụ hay cường độ marketing?',
                  'Resolving Core Question #1: Is revenue driven by seasonality or marketing intensity?',
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip tone="cyan">180/180 Ngày Có Đơn</Chip>
            <Chip tone="amber">Chuẩn hóa GMV/Ngày</Chip>
          </div>
        </div>

        {/* 4 nguyên tắc chuẩn bị chuỗi */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <Calendar className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('1. Bảng lịch dim_date', '1. Calendar dim_date')}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {L(
                'Tạo đủ 180 ngày (09/03 – 04/09/2026). LEFT JOIN xác nhận Store Detail không bị khuyết ngày nào (min 49 sp/ngày). Gắn cờ is_partial_month cho T3 (23 ngày) và T9 (4 ngày).',
                'Full 180 days mapped. LEFT JOIN verifies Store Detail has 0 missing days (min 49 units/day). Partial month flags for Mar (23d) & Sep (4d).',
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <Clock className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('2. Thống nhất UTC+7', '2. Unified UTC+7')}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {L(
                'Dịch chuyển giờ (+13h cho Creator Live, -1h cho dòng UTC+8) trước khi gom nhóm theo ngày. Tránh việc các ca Live kéo dài qua nửa đêm bị cắt sai ngày.',
                'Shift timestamps (+13h for Creator Live, -1h for UTC+8) prior to daily aggregation to avoid cross-midnight session date misallocation.',
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <Table className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('3. Quy ước ngày thưa = 0', '3. Zero Filling for Sparse Days')}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {L(
                'Khi dựng chuỗi Live/Video từ Shop LIVE và Shoppable, ngày không có hoạt động phải điền 0 (không để NULL), vì NULL sẽ làm sai lệch các hàm cửa sổ trượt AVG() OVER.',
                'Fill sparse days with 0 instead of NULL when rolling up Shop LIVE/Shoppable to avoid breaking AVG() OVER window calculations.',
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <Scale className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              {L('4. Chuẩn hóa GMV/ngày', '4. Day-Normalized Metric')}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {L(
                'Tuyệt đối không so sánh tổng GMV tháng khi số ngày quan sát không đồng đều. Luôn dùng GMV bình quân ngày (GMV/ngày) để đo lường MoM chuẩn xác.',
                'Never compare raw monthly GMV sums when day counts differ. Standardize on daily average GMV (GMV/day) for rigorous MoM growth tracking.',
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 3.3.A: Bức tranh tổng thể & Bảng phân tích 7 tháng */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              3.3.A
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Bức Tranh Tổng Thể 8 Tháng (Bảng Số Liệu Chuẩn Hóa LAG)', '8-Month Macro Trajectory (Standardized LAG Model)')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L(
                  'Tổng GMV 14,84 tỷ VNĐ, sản lượng 100.669 sản phẩm, tăng trưởng MoM chuẩn hóa ngày',
                  'Total 14.84B VND GMV, 100,669 units, day-normalized MoM growth trajectory',
                )}
              </p>
            </div>
          </div>
          <Chip tone="cyan">Tổng 14,84 Tỷ đ</Chip>
        </div>

        {/* Bảng chi tiết 7 tháng */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 mb-5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                <th className="py-2.5 px-3 min-w-[90px]">{L('Tháng', 'Month')}</th>
                <th className="py-2.5 px-2.5 text-center w-20">{L('Số ngày', 'Days')}</th>
                <th className="py-2.5 px-3 text-right min-w-[130px]">{L('Tổng GMV (đ)', 'Total GMV')}</th>
                <th className="py-2.5 px-2.5 text-right w-20">{L('Tỷ trọng', 'Share')}</th>
                <th className="py-2.5 px-3 text-right min-w-[130px]">{L('GMV/Ngày (đ)', 'GMV/Day')}</th>
                <th className="py-2.5 px-2.5 text-right w-24">{L('Sản lượng', 'Units')}</th>
                <th className="py-2.5 px-3 text-right min-w-[110px]">{L('AOV (đ/sp)', 'AOV')}</th>
                <th className="py-2.5 px-3 text-right min-w-[130px]">{L('MoM Tổng Tháng', 'Raw MoM')}</th>
                <th className="py-2.5 px-3 text-right min-w-[140px]">{L('MoM Bình Quân Ngày', 'Day-Normalized MoM')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {monthlyTable.map((m, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                    m.ym === '2026-06'
                      ? 'bg-[#C8EEF7]/25 dark:bg-[#9BE7FA]/5 font-semibold'
                      : m.isPartial
                      ? 'opacity-80 italic'
                      : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {m.ym === '2026-06' && <Flame className="h-3.5 w-3.5 text-amber-500" />}
                    <span>{m.label}</span>
                    {m.isPartial && (
                      <span className="text-[10px] rounded px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 not-italic">
                        {m.days}N
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2.5 text-center font-mono tabular-nums">{m.days}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {n(m.gmv)}
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                    {m.share}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA] tabular-nums">
                    {n(m.gmvPerDay)}
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-mono tabular-nums">{n(m.units)}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">{n(m.aov)}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-500">
                    {m.momRaw !== null ? `${m.momRaw > 0 ? '+' : ''}${m.momRaw}%` : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                    {m.momDay !== null ? (
                      <span className={m.momDay > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                        {m.momDay > 0 ? '+' : ''}{m.momDay}%
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Biểu đồ GMV ngày kèm MA7 và Lũy kế */}
        <ChartCard
          title={
            dailyView === 'daily'
              ? L('GMV theo ngày, Đường trung bình trượt 7 ngày MA7 & Điểm đỉnh 16/06 (triệu đ)', 'Daily GMV, 7-day Moving Average MA7 & Peak Day (M VND)')
              : L('Doanh số lũy kế 180 ngày và quỹ đạo tích lũy (tỉ đ)', '180-day Cumulative GMV Trajectory (B VND)')
          }
          subtitle={L(
            'Làm mượt nhiễu dao động ngày bằng hàm cửa sổ AVG() OVER; ngày đỉnh 16/06 chạm 315,0 triệu đ',
            'Smoothing daily volatility via window AVG() OVER; peak day hits 315.0M VND on Jun 16',
          )}
          badge={
            <div className="flex rounded-xl bg-[#C8EEF7]/40 p-1 dark:bg-slate-800">
              {(['daily', 'cumulative'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setDailyView(k)}
                  className={`min-h-9 cursor-pointer rounded-lg px-2.5 text-xs font-bold transition-colors ${
                    dailyView === k ? 'bg-[#9BE7FA] text-slate-950' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {k === 'daily' ? L('Theo ngày MA7', 'Daily MA7') : L('Lũy kế YTD', 'Cumulative')}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%" minHeight={270}>
            {dailyView === 'daily' ? (
              <ComposedChart data={dailySeries} margin={{ top: 22, right: 12, left: -4, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" interval={Math.floor(dailySeries.length / 7)} tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} width={45}>
                  <Label value={L('(Tr đ)', '(M VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 1)} Tr`} />} />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
                <Bar dataKey="gmv" name="GMV Ngày" fill={COLORS.cyan} radius={[2, 2, 0, 0]} />
                <Line dataKey="ma7" name={L('MA7 ngày', '7-day MA')} stroke={COLORS.deep} strokeWidth={2.5} dot={false} connectNulls={false} />
                <ReferenceDot x="16/06" y={315.0} r={6} fill={COLORS.amber} stroke={COLORS.deep} strokeWidth={2} />
              </ComposedChart>
            ) : (
              <AreaChart data={dailySeries} margin={{ top: 22, right: 12, left: -4, bottom: 0 }}>
                <defs>
                  <linearGradient id="pbCum3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.amber} stopOpacity={0.7} />
                    <stop offset="95%" stopColor={COLORS.amber} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" interval={Math.floor(dailySeries.length / 7)} tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} width={45}>
                  <Label value={L('(Tỉ đ)', '(B VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 2)} Tỉ`} />} />
                <Area type="monotone" dataKey="cumulativeB" name={L('Lũy kế GMV', 'Cumulative GMV')} stroke={COLORS.deep} strokeWidth={2.5} fill="url(#pbCum3)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 3.3.B & 3.3.F: Xu hướng, Đỉnh 16/06 & Tín hiệu sớm MA7 vs MA28 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hộp phân tích đỉnh & độ rộng */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
                3.3.B
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">
                  {L('Đỉnh Doanh Thu 16/06 & Độ Rộng Vùng Đỉnh', 'June 16 Peak Day & Peak Window Concentration')}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {L('Đo lường mức độ tập trung doanh thu quanh thời điểm cực đại', 'Quantifying revenue clustering around seasonal apex')}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-600 dark:text-slate-400">{L('Ngày đỉnh tuyệt đối:', 'Absolute Peak Day:')}</span>
                  <span className="font-bold text-[#074553] dark:text-[#9BE7FA] font-mono text-sm">16/06/2026 (315,0 Tr đ)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {L('Doanh số 1.936 sản phẩm trong duy nhất 1 ngày nhờ sự bùng nổ của chiến dịch Live giữa hè.', '1,936 units sold in a single day fueled by peak midsummer live streams.')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40">
                  <span className="text-[11px] text-slate-500 block mb-0.5">{L('7 Ngày quanh đỉnh (13–19/06):', '7 Days around Peak:')}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">1,09 Tỷ đ</span>
                  <span className="text-[11px] text-[#0D7287] dark:text-[#9BE7FA] block mt-0.5 font-bold">8,56% {L('tổng 180 ngày', 'of total')}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40">
                  <span className="text-[11px] text-slate-500 block mb-0.5">{L('14 Ngày quanh đỉnh:', '14 Days Window:')}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">1,90 Tỷ đ</span>
                  <span className="text-[11px] text-[#0D7287] dark:text-[#9BE7FA] block mt-0.5 font-bold">14,95% {L('tổng 180 ngày', 'of total')}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                <strong>{L('Pha rơi sau đỉnh:', 'Post-Peak Drop:')}</strong> {L(
                  'Đường MA7 rơi xuống dưới mức bình quân ngày của Tháng 4 (82,0 Tr/ngày) vào ngày 13/07/2026 (MA7 = 78,8 Tr). Toàn bộ đợt cao điểm mùa hè chỉ kéo dài khoảng 6 tuần.',
                  'MA7 collapsed below April daily average (82.0M/day) on July 13 (MA7 = 78.8M). The true peak summer window spanned merely 6 weeks.',
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hộp Tín hiệu cảnh báo sớm: Giao cắt tử thần MA7 vs MA28 */}
        <div className="rounded-3xl border-2 border-[#9BE7FA] bg-[#F0F9FB] p-5 sm:p-6 dark:border-[#9BE7FA]/40 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#C8EEF7] dark:border-slate-800 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 font-black text-slate-950 text-sm">
                3.3.F
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">
                  {L('Tín Hiệu Cảnh Báo Sớm: Giao Cắt Tử Thần (Dead Cross 26/06)', 'Early Warning Signal: MA7 vs MA28 Dead Cross (Jun 26)')}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {L('Tín hiệu kỹ thuật xuất hiện 18 ngày trước khi doanh thu rơi thủng đáy', 'Technical warning appearing 18 days before revenue pierced April floor')}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[11px] text-slate-500 block">{L('Ngày xuất hiện Dead Cross:', 'Dead Cross Trigger Date:')}</span>
                  <span className="font-bold text-base text-rose-600 dark:text-rose-400 font-mono">26/06/2026</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">MA7 vs MA28:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">120,7 Tr &lt; 125,9 Tr đ</span>
                </div>
              </div>

              <p>
                {L(
                  'Khi so sánh trung bình ngắn hạn (MA7) với trung bình dài hạn (MA28), điểm giao cắt xuất hiện chỉ đúng 10 ngày sau ngày đỉnh 16/06. Đây là chỉ báo sớm nhất cho thấy động lượng mua sắm bikini đã gãy hoàn toàn.',
                  'Comparing short-term MA7 with long-term MA28 triggered a Dead Cross just 10 days after the peak. This served as the earliest signal of seasonal exhaustion.',
                )}
              </p>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px]">
                <strong>{L('Ý nghĩa ứng dụng vận hành (Phục vụ Mục 8):', 'Operational Actionable Insight:')}</strong> {L(
                  'Nếu theo dõi giao cắt MA7/MA28 hằng tuần, đội vận hành đã có thể ngừng nhập hàng đồ bơi và cắt giảm ngân sách booking KOC ngay từ tuần cuối tháng 6, tránh ôm tồn kho 645 triệu đ ở tháng 8.',
                  'Tracking MA7/MA28 weekly enables teams to halt swimwear POs and slash KOC booking fees by late June, preventing 645M VND dead stock in August.',
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3.3.C: Chu kỳ theo thứ trong tuần & Phân kỳ giai đoạn */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              3.3.C
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Chu Kỳ Theo Thứ Trong Tuần (Day-of-Week Seasonality)', 'Day-of-Week Cyclicality Across Seasonal Phases')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L('Đo lường chỉ số mùa vụ (Seasonal Index) và phân kỳ giữa 3 giai đoạn: Tăng trưởng, Đỉnh cao, Suy giảm', 'Measuring Seasonal Index and behavioral shifts across Growth, Peak, and Decline')}
              </p>
            </div>
          </div>
          <Chip tone="amber">Thứ 5 Đạt Đỉnh 112,6%</Chip>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          {/* Biểu đồ chỉ số mùa vụ */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dowSeasonality} margin={{ top: 20, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="dow" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} domain={[80, 120]}>
                  <Label value="(%)" position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 1)}%`} />} />
                <ReferenceLine y={100} stroke="#94A3B8" strokeDasharray="4 4" label={{ value: '100% Trung bình', position: 'insideBottomRight', fontSize: 10, fill: '#64748B' }} />
                <Bar dataKey="index" name={L('Chỉ số mùa vụ (%)', 'Seasonal Index (%)')} fill={COLORS.cyan} radius={[4, 4, 0, 0]}>
                  {dowSeasonality.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.dow === 'Thứ 5' ? COLORS.amber : COLORS.cyan} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bảng phân tích 3 giai đoạn */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                  <th className="py-2.5 px-3">{L('Thứ', 'Day')}</th>
                  <th className="py-2.5 px-3 text-right">{L('Chỉ số mùa vụ', 'Index')}</th>
                  <th className="py-2.5 px-3 text-right">{L('Tăng (T3–T5)', 'Growth')}</th>
                  <th className="py-2.5 px-3 text-right">{L('Đỉnh (T6)', 'Peak')}</th>
                  <th className="py-2.5 px-3 text-right">{L('Giảm (T7–T9)', 'Decline')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dowSeasonality.map((r, i) => (
                  <tr key={i} className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${r.dow === 'Thứ 5' ? 'bg-[#FFE485]/15 dark:bg-[#FFD14C]/5 font-semibold' : ''}`}>
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-1">
                      {r.dow === 'Thứ 5' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                      {r.dow}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                      {r.index}%
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                      {r.growthMed}M
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {r.peakMed}M
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-500">
                      {r.declineMed}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3.3.D & 3.3.E: Cường độ marketing vs Doanh thu & Phân rã hiệu suất */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9BE7FA] font-black text-slate-950 text-sm">
              3.3.D & 3.3.E
            </span>
            <div>
              <h4 className="text-base font-black text-slate-950 dark:text-white">
                {L('Cường Độ Marketing vs Doanh Thu & Phân Rã Hiệu Suất (T6 vs T8)', 'Marketing Intensity vs Revenue & Performance Decomposition')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {L(
                  'Tương quan 26 tuần (Pearson/Spearman) và phân rã nguyên nhân GMV rơi 82,9%',
                  '26-week correlation suite and causal decomposition of the 82.9% GMV collapse',
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip tone="cyan">r = 0,550 (LIVE)</Chip>
            <Chip tone="amber">Phân rã 71,1% Số lượng vs 70,3% Hiệu suất</Chip>
          </div>
        </div>

        {/* 2 khối: Tương quan chéo và Phân rã */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Tương quan chéo Lag 0 đến 7 ngày */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <LineChartIcon className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                {L('Tương quan chéo theo độ trễ (Lag 0 – 7 Ngày)', 'Cross-Correlation by Lag (0 to 7 Days)')}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Pearson r</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {L(
                'Kiểm tra giả thuyết "Marketing đi trước Doanh thu". Tương quan đạt đỉnh ở Lag 7 ngày (r = 0,446 với Live; r = 0,381 với KOC) phản ánh tính chu kỳ theo tuần hoàn toàn trùng khớp.',
                'Testing the lead-lag hypothesis. Peak correlation at Lag 7 days (r = 0.446 for Live; r = 0.381 for KOC) reflects synchronous weekly operational cycles.',
              )}
            </p>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lagData} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="lag" tick={axisTick} tickLine={false} axisLine={false} />
                  <YAxis domain={[0.2, 0.5]} tick={axisTick} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 3)}`} />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} formatter={legendFormatter} />
                  <Bar dataKey="rLives" name={L('Live vs GMV(t)', 'Live vs GMV(t)')} fill={COLORS.cyan} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="rKoc" name={L('KOC vs GMV(t)', 'KOC vs GMV(t)')} fill={COLORS.amber} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Phân rã hiệu suất GMV T6 vs T8 */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4 text-rose-500" />
                  {L('Phân rã thay đổi GMV: Số lượng vs Hiệu suất', 'Decomposition: Volume vs Efficiency (T6 vs T8)')}
                </span>
                <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-bold">-82,9% GMV (-3,13 Tỷ đ)</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                {L(
                  'Giải đáp câu hỏi: Doanh thu rơi do ít ca Live hơn hay do mỗi ca kém hiệu quả hơn? Kết quả phân rã toán học chỉ ra cả hai hiệu ứng tác động tương đương nhau:',
                  'Answering whether GMV dropped due to fewer live streams or lower stream conversion. Mathematical decomposition proves both factors drove the collapse equally:',
                )}
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">{L('1. Hiệu ứng Số lượng (Giảm ca Live 1.560 → 640):', '1. Volume Effect (1,560 → 640 Lives):')}</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">-2,22 Tỷ đ (71,1%)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">{L('2. Hiệu ứng Hiệu suất (GMV/ca 2,42M → 1,01M):', '2. Efficiency Effect (2.42M → 1.01M/Live):')}</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">-2,20 Tỷ đ (70,3%)</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">{L('3. Tác động tương tác bù trừ:', '3. Interaction Effect:')}</span>
                  <span className="font-mono text-slate-500">+1,30 Tỷ đ (+41,5%)</span>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300">
              <strong>{L('Kết luận cốt lõi:', 'Key Takeaway:')}</strong> {L(
                'Mùa vụ đồ bơi quyết định sức mua của thị trường; khi người mua không còn nhu cầu đi biển ở tháng 8, dù giữ nguyên số ca Live thì doanh số mỗi ca cũng đã rơi hơn 58%.',
                'Swimwear seasonality dictates baseline buyer demand; as vacation intent faded in August, revenue per stream plummeted 58% regardless of broadcast frequency.',
              )}
            </div>
          </div>
        </div>

        {/* Biểu đồ 26 tuần: GMV vs Live vs Hiệu suất */}
        <ChartCard
          title={
            weeklyView === 'gmv_lives'
              ? L('Theo dõi 26 tuần: Doanh thu GMV tuần (triệu đ) vs Số ca Live tuần', '26-Week Tracking: Weekly GMV (M VND) vs Weekly Live Sessions')
              : L('Theo dõi 26 tuần: Hiệu suất GMV trung bình trên mỗi ca Live (nghìn đ/ca)', '26-Week Tracking: Average GMV per Live Session (k VND/session)')
          }
          subtitle={L('Bắt trọn đỉnh điểm Tuần 25 (15–21/06 đạt 1,06 Tỷ đ) và pha thoái trào liên tục ở Quý 3', 'Capturing Week 25 peak (1.06B VND) followed by Q3 seasonal collapse')}
          badge={
            <div className="flex rounded-xl bg-[#C8EEF7]/40 p-1 dark:bg-slate-800">
              {(['gmv_lives', 'efficiency'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setWeeklyView(k)}
                  className={`min-h-9 cursor-pointer rounded-lg px-2.5 text-xs font-bold transition-colors ${
                    weeklyView === k ? 'bg-[#9BE7FA] text-slate-950' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {k === 'gmv_lives' ? L('GMV & Phiên Live', 'GMV & Lives') : L('Hiệu suất GMV/Ca', 'GMV/Live Efficiency')}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%" minHeight={270}>
            {weeklyView === 'gmv_lives' ? (
              <ComposedChart data={WEEKLY_SERIES} margin={{ top: 22, right: 28, left: -4, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" interval={3} tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tick={axisTick} tickLine={false} axisLine={false} width={45}>
                  <Label value={L('(Tr đ)', '(M VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <YAxis yAxisId="right" orientation="right" tick={axisTick} tickLine={false} axisLine={false} width={35}>
                  <Label value={L('(Ca)', '(Lives)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                </YAxis>
                <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 1)}`} />} />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
                <Bar yAxisId="left" dataKey="gmv" name="GMV Tuần" fill={COLORS.cyan} radius={[2, 2, 0, 0]} />
                <Line yAxisId="right" dataKey="lives" name={L('Số ca Live', 'Lives Count')} stroke={COLORS.amber} strokeWidth={2.5} dot={false} />
              </ComposedChart>
            ) : (
              <ComposedChart data={WEEKLY_SERIES} margin={{ top: 22, right: 12, left: -4, bottom: 0 }}>
                  <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" interval={3} tick={axisTick} tickLine={false} axisLine={false} />
                  <YAxis tick={axisTick} tickLine={false} axisLine={false} width={45}>
                    <Label value={L('(k đ)', '(k VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
                  </YAxis>
                  <Tooltip content={<ChartTooltip fmt={(v) => `${n(v)} k đ`} />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
                  <Line dataKey="gmvPerLive" name={L('GMV / ca Live (nghìn đ)', 'GMV / Live (k VND)')} stroke={COLORS.deep} strokeWidth={2.5} dot={{ r: 3 }} />
                  <ReferenceLine y={2000} stroke="#94A3B8" strokeDasharray="4 4" label={{ value: '2.000k Mốc chuẩn', position: 'top', fontSize: 10, fill: '#64748B' }} />
                </ComposedChart>
            )}
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 3.4: Kỹ thuật SQL & 3.6: Các giới hạn khoa học */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Truy vấn SQL mẫu */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <TerminalSquare className="h-5 w-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <h4 className="text-sm font-black text-slate-950 dark:text-white">
                  {L('Kỹ Thuật SQL Chuỗi Thời Gian Thực Nghiệm', 'Time-Series SQL Engineering')}
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Window Functions</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {sqlSnippets.map((snip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSqlTab(idx)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all min-h-8 cursor-pointer ${
                    activeSqlTab === idx
                      ? 'bg-[#9BE7FA] text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {snip.title}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3.5 text-slate-100 relative">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1.5 mb-1.5 border-b border-slate-800">
                <span>{sqlSnippets[activeSqlTab].desc}</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(sqlSnippets[activeSqlTab].sql, activeSqlTab)}
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
                <code>{sqlSnippets[activeSqlTab].sql}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* 3.6: 6 Hạn chế bắt buộc phải nêu rõ */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 font-black text-slate-950 text-sm">
              3.6
            </span>
            <div>
              <h4 className="text-sm font-black text-slate-950 dark:text-white">
                {L('6 Giới Hạn Khoa Học Bắt Buộc Phải Nêu Rõ', '6 Mandatory Scientific Limitations')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {L('Tính trung thực học thuật & ranh giới dữ liệu khi trình bày với hội đồng', 'Academic integrity and methodological boundaries for hiring panels')}
              </p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>{L('1. Chỉ có 1 mùa duy nhất (6 tháng):', '1. Single Season (6 Months):')}</strong> {L(
                  'Không thể tách được mùa vụ tự nhiên khỏi năng lực tăng trưởng nội tại của thương hiệu. Nhận định "mùa vụ chi phối" là một giả thuyết ngành đồ bơi hợp lý, không phải kết luận thống kê đa niên.',
                  'Impossible to mathematically isolate seasonal cycles from intrinsic growth. Seasonal dominance remains a domain hypothesis, not multi-year statistical proof.',
                )}
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>{L('2. Cỡ mẫu tuần nhỏ (26 tuần):', '2. Small Weekly Sample (26 Weeks):')}</strong> {L(
                  '26 quan sát tuần khiến khoảng tin cậy (Confidence Interval) của tương quan Pearson/Spearman còn rộng.',
                  '26 weekly observations yield wider confidence intervals on Pearson and Spearman coefficients.',
                )}
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>{L('3. Tháng thiếu ngày:', '3. Partial Months:')}</strong> {L(
                  'Tháng 3 (23 ngày) và Tháng 9 (4 ngày) bắt buộc phải so sánh bằng GMV bình quân ngày; dữ liệu Tháng 9 quá ngắn để làm đại diện.',
                  'March (23d) and September (4d) require day-normalized comparison; September is insufficient for standalone inference.',
                )}
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>{L('4. Thiếu biến điều khiển ngoại sinh:', '4. Missing Exogenous Controls:')}</strong> {L(
                  'Không có dữ liệu nhiệt độ/thời tiết, ngân sách chạy quảng cáo ads, lịch nghỉ hè học sinh sinh viên để kiểm soát biến gây nhiễu (confounders).',
                  'Lacks daily temperature, ad spend, and school holiday controls to eliminate confounding factors.',
                )}
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>{L('5. Định nghĩa lệch giữa các nguồn:', '5. Inconsistent Metric Definitions:')}</strong> {L(
                  'Số video và phiên live có độ vênh nhẹ giữa các tệp xuất (Mục 2.3), cần thống nhất chọn Store Detail làm mốc chuẩn so sánh.',
                  'Discrepancies in video and live counts across exports require strict standardization on Store Detail.',
                )}
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong>{L('6. Tương quan không phải nhân quả:', '6. Correlation is Not Causation:')}</strong> {L(
                  'Vì cả doanh thu và số ca Live cùng biến thiên theo mùa hè, tương quan cao (r = 0,55) có thể chịu ảnh hưởng từ hiện tượng tương quan giả (spurious correlation).',
                  'Because GMV and Live frequency co-move across summer, strong correlation (r=0.55) may partly reflect spurious co-seasonality.',
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
