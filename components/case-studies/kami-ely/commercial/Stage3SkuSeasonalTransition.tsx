'use client';

import React, { useState, useEffect } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Copy,
  Layers,
  Sparkles,
  TrendingDown,
  Shirt,
  Sun,
  Maximize2,
  Minimize2,
  DollarSign,
  Package,
} from 'lucide-react';
import {
  ChartCard,
  ChartTooltip,
  Chip,
  GRID_STROKE,
  axisTick,
  usePlaybookLang,
} from '../playbook/PlaybookUi';
import type { SkuSeasonalityPayload } from '@/app/types/caseStudies';

interface Props {
  skuData?: SkuSeasonalityPayload;
}

interface OverlappedDailyBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: any;
  isGmv?: boolean;
  displayCategory?: 'both' | 'summer' | 'winter';
}

const OverlappedDailyBar = (props: OverlappedDailyBarProps) => {
  const { x = 0, y = 0, width = 0, height = 0, payload, isGmv, displayCategory } = props;
  if (!payload || height <= 0) return null;

  const sVal = isGmv ? (payload.summerGmvM ?? 0) : (payload.summerUnits ?? 0);
  const wVal = isGmv ? (payload.winterGmvM ?? 0) : (payload.winterUnits ?? 0);
  const maxVal = isGmv ? (payload.maxGmvM ?? Math.max(sVal, wVal)) : (payload.maxUnits ?? Math.max(sVal, wVal));
  if (maxVal <= 0) return null;

  const yBottom = y + height;
  const barW = Math.max(width, 4);
  const barX = x + (width - barW) / 2;
  const radius = 2;

  // Colors: Amber Gold for Summer, Deep Sky Blue for Winter
  const summerFill = '#F59E0B';
  const summerStroke = '#D97706';
  const winterFill = '#0284C7';
  const winterStroke = '#0369A1';

  // If only showing Summer:
  if (displayCategory === 'summer') {
    if (sVal <= 0) return null;
    const sH = (sVal / maxVal) * height;
    const sY = yBottom - sH;
    return (
      <rect
        x={barX}
        y={sY}
        width={barW}
        height={Math.max(sH, 1.5)}
        fill={summerFill}
        stroke={summerStroke}
        strokeWidth={0.5}
        fillOpacity={0.85}
        rx={radius}
      />
    );
  }

  // If only showing Winter:
  if (displayCategory === 'winter') {
    if (wVal <= 0) return null;
    const wH = (wVal / maxVal) * height;
    const wY = yBottom - wH;
    return (
      <rect
        x={barX}
        y={wY}
        width={barW}
        height={Math.max(wH, 1.5)}
        fill={winterFill}
        stroke={winterStroke}
        strokeWidth={0.5}
        fillOpacity={0.85}
        rx={radius}
      />
    );
  }

  // Both categories: Overlap front-to-back (cột nào cao hơn ở sau, thấp hơn ở trước)
  const isSummerTaller = sVal >= wVal;
  const tallerVal = isSummerTaller ? sVal : wVal;
  const shorterVal = isSummerTaller ? wVal : sVal;

  const tallerFill = isSummerTaller ? summerFill : winterFill;
  const tallerStroke = isSummerTaller ? summerStroke : winterStroke;

  const shorterFill = isSummerTaller ? winterFill : summerFill;
  const shorterStroke = isSummerTaller ? winterStroke : summerStroke;

  const shorterHeight = tallerVal > 0 ? (shorterVal / tallerVal) * height : 0;
  const shorterY = yBottom - shorterHeight;

  return (
    <g>
      {/* Cột cao hơn: Vẽ trước (ở sau / background) */}
      {tallerVal > 0 && (
        <rect
          x={barX}
          y={y}
          width={barW}
          height={Math.max(height, 1.5)}
          fill={tallerFill}
          stroke={tallerStroke}
          strokeWidth={0.5}
          fillOpacity={0.75}
          rx={radius}
        />
      )}
      {/* Cột thấp hơn: Vẽ sau (ở trước / foreground) */}
      {shorterVal > 0 && (
        <rect
          x={barX}
          y={shorterY}
          width={barW}
          height={Math.max(shorterHeight, 1.5)}
          fill={shorterFill}
          stroke={shorterStroke}
          strokeWidth={0.75}
          fillOpacity={0.95}
          rx={radius}
        />
      )}
    </g>
  );
};

export default function Stage3SkuSeasonalTransition({ skuData }: Props) {
  const { L } = usePlaybookLang();
  const [activeTab, setActiveTab] = useState<'category_shift' | 'sku_lines' | 'heatmap'>('category_shift');
  const [viewMetric, setViewMetric] = useState<'gmv' | 'units'>('gmv');
  const [skuFilter, setSkuFilter] = useState<'all' | 'duel' | 'bikini' | 'winter_all' | 'tshirt' | 'skirt' | 'outer_sport'>('all');
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [displayCategory, setDisplayCategory] = useState<'both' | 'summer' | 'winter'>('both');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (!skuData) return null;

  const { summary, skus, monthlyTransitions: _monthlyTransitions, dailyTransitions = [], weeklySeries, transitionInsights } = skuData;

  const sqlSnippet = `-- Truy vấn Doanh thu / Sản lượng theo ngày & Đường trung bình trượt 7 ngày (MA-7)
-- Bảng nguồn MySQL SSOT: kami_sku_daily_timeseries (1.790 bản ghi)
WITH daily_seasonal_split AS (
  SELECT 
    record_date,
    SUM(CASE WHEN season_affinity = 'Hàng Bán Hè' THEN delta_gmv_vnd ELSE 0 END) AS summer_gmv,
    SUM(CASE WHEN season_affinity != 'Hàng Bán Hè' THEN delta_gmv_vnd ELSE 0 END) AS winter_gmv,
    SUM(CASE WHEN season_affinity = 'Hàng Bán Hè' THEN delta_sales_units ELSE 0 END) AS summer_units,
    SUM(CASE WHEN season_affinity != 'Hàng Bán Hè' THEN delta_sales_units ELSE 0 END) AS winter_units
  FROM kami_sku_daily_timeseries
  GROUP BY record_date
)
SELECT 
  record_date,
  ROUND(summer_gmv / 1e6, 2) AS summer_gmv_m,
  ROUND(winter_gmv / 1e6, 2) AS winter_gmv_m,
  summer_units,
  winter_units,
  -- Đường trung bình trượt 7 ngày (MA-7)
  ROUND(AVG(summer_gmv / 1e6) OVER (ORDER BY record_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS summer_ma7_m,
  ROUND(AVG(winter_gmv / 1e6) OVER (ORDER BY record_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS winter_ma7_m
FROM daily_seasonal_split
ORDER BY record_date ASC;`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const getCategoryBadgeClass = (category: string) => {
    if (category.includes('Bikini') || category.includes('Đồ Bơi')) {
      return 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50';
    }
    if (category.includes('Áo Thun')) {
      return 'bg-[#C8EEF7] text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] border border-[#9BE7FA]/40';
    }
    if (category.includes('Chân Váy')) {
      return 'bg-sky-100 text-sky-900 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50';
    }
    if (category.includes('Áo Gió')) {
      return 'bg-teal-100 text-teal-900 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50';
    }
    if (category.includes('Thể Thao')) {
      return 'bg-pink-100 text-pink-900 dark:bg-pink-950/60 dark:text-pink-300 border border-pink-200/50 dark:border-pink-800/50';
    }
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  };

  const isGmv = viewMetric === 'gmv';

  const content = (
    <div className={`rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900 shadow-xs ${isFullscreen ? 'w-full max-w-[1700px] shadow-2xl' : 'w-full'}`}>
      {/* Khối tiêu đề Mục 3.3 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFE485] font-black text-slate-950 text-sm shrink-0 shadow-xs">
            3.3
          </span>
          <div>
            <h4 className="text-base sm:text-lg font-black text-slate-950 dark:text-white flex items-center gap-2 flex-wrap">
              {L(
                'Phân Tích Chuyển Trạng Thái Mùa Vụ Theo Từng Mã Hàng (10 SKU Thực Nghiệm)',
                'SKU-Level Seasonal Transition & Category Pivot Analysis (10 Core SKUs)',
              )}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C8EEF7] text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] shrink-0">
                SQL Telemetry
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {L(
                'Phân rã 1.790 bản ghi từ kami_sku_daily_timeseries: Giải mã cặp đấu giữa Hàng Bán Hè (5 SKU Bikini) và Hàng Bán Đông (Cả 4 dòng: Áo thun AT06, Chân váy, Áo gió, Set thể thao)',
                'Decomposing 1,790 daily records from kami_sku_daily_timeseries: Summer Goods (5 Bikini SKUs) vs Winter Goods (All 4 lines: T-shirt, Skirt, Windbreaker, Sports)',
              )}
            </p>
          </div>
        </div>

        {/* Cụm công cụ điều khiển: Chuyển Đổi Doanh Thu / Số Lượng & Toàn Màn Hình */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Bộ chuyển đổi Doanh thu vs Số lượng sản phẩm */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800 shrink-0 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMetric('gmv')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isGmv
                  ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <DollarSign className="h-3.5 w-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span>{L('Doanh Thu (Tr đ)', 'Revenue (M VND)')}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMetric('units')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isGmv
                  ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Package className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>{L('Số Lượng (Sản phẩm)', 'Volume (Units)')}</span>
            </button>
          </div>

          <Chip tone="cyan">10 SKU</Chip>
          <Chip tone="amber">179 Ngày</Chip>
          <Chip>
            {isGmv
              ? `${summary.totalGmvM.toLocaleString('vi-VN')} Tr GMV`
              : `${summary.totalUnits.toLocaleString('vi-VN')} Sản Phẩm`}
          </Chip>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shadow-xs min-h-8"
            title={isFullscreen ? L('Thu nhỏ lại (Esc)', 'Exit Fullscreen (Esc)') : L('Phóng to ngang toàn màn hình', 'Full Screen')}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{L('Thu nhỏ', 'Exit')}</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{L('Toàn màn hình', 'Full Screen')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Thẻ KPI Tóm Tắt Chuyển Trạng Thái (Thích ứng theo Doanh thu / Sản lượng) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 my-5">
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 dark:bg-amber-950/20 dark:border-amber-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2 flex-nowrap">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 whitespace-nowrap">
              <Sun className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              {L('Đỉnh Hàng Bán Hè (T6)', 'Summer Goods Peak (Jun)')}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-amber-200/60 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 whitespace-nowrap shrink-0">
              {isGmv ? '90,9% GMV' : '88,2% Sản lượng'}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tabular-nums whitespace-nowrap">
            {isGmv ? '1.566,1 Tr đ' : '7.721 sản phẩm'}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {isGmv
              ? L('5 SKU Bikini độc chiếm mùa hè; H36 đạt đỉnh 572,8 Tr đ, M18 đạt 350,4 Tr đ', '5 Bikini SKUs commanded summer; H36 peaked at 572.8M, M18 at 350.4M')
              : L('Tháng 6 xuất kho 7.721 bộ bikini; H36 bán 2.866 bộ, M18 bán 1.631 bộ', 'June shipped 7,721 bikini sets; H36 moved 2,866 units, M18 1,631 units')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 dark:bg-rose-950/20 dark:border-rose-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2 flex-nowrap">
            <span className="text-xs font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5 whitespace-nowrap">
              <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
              {L('Vực Thẳm Mùa Vụ (T8)', 'Seasonal Chasm (Aug)')}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-rose-200/60 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200 whitespace-nowrap shrink-0">
              {isGmv ? '-90,2% Bikini' : '-81,2% Sản lượng'}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tabular-nums whitespace-nowrap">
            {isGmv ? '152,7 Tr đ' : '1.451 sản phẩm'}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {isGmv
              ? L('Bikini bốc hơi 1,4 Tỷ đ; cả 4 dòng Hàng Bán Đông giữ vững 109,6M đ (41,8% thị phần) làm vùng đệm', 'Bikini dropped 1.4B; all 4 Winter lines sustained 109.6M (41.8% share) as buffer')
              : L('Sản lượng bikini giảm 6.270 bộ; 4 dòng Hàng Bán Đông bán 1.074 sản phẩm làm đệm đỡ', 'Bikini volume fell 6,270 units; 4 Winter lines sold 1,074 units as essential buffer')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 dark:bg-sky-950/20 dark:border-sky-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2 flex-nowrap">
            <span className="text-xs font-bold text-[#074553] dark:text-[#9BE7FA] flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0" />
              {L('Điểm Crossover (T9)', 'Crossover Pivot (Sep)')}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-[#C8EEF7] text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] whitespace-nowrap shrink-0">
              {isGmv ? '90,7% Hàng Đông' : '93,8% Sản lượng'}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tabular-nums whitespace-nowrap">
            {isGmv ? '518,8 Tr đ' : '4.390 sản phẩm'}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {isGmv
              ? L('Cả 4 dòng Hàng Bán Đông (Áo thun, Chân váy, Áo gió, Set thể thao) vượt mặt Bikini (518,8M vs 53,4M đ)', 'All 4 Winter product lines surpassed Bikini revenue (518.8M vs 53.4M)')
              : L('Hàng Bán Đông xuất 4.390 sản phẩm (gấp 15 lần bikini: 290 cái) nhờ mở bán AT06', 'Winter lines shipped 4,390 units (15x bikini: 290 units) fueled by AT06 rollout')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 dark:bg-emerald-950/20 dark:border-emerald-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2 flex-nowrap">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 whitespace-nowrap">
              <Shirt className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              {L('Hàng Bán Đông Bùng Nổ (T10)', 'Winter Goods Explosion (Oct)')}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-emerald-200/60 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200 whitespace-nowrap shrink-0">
              {isGmv ? '98,4% SKU GMV' : '98,9% Sản lượng'}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums whitespace-nowrap">
            {isGmv ? '1.533,5 Tr đ' : '10.804 sản phẩm'}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {isGmv
              ? L('Áo thun AT06 (1.301,0M) cùng Chân váy CV11 (194,1M) đưa Hàng Đông chiếm trọn 98,4% doanh số', 'T-shirt AT06 (1,301.0M) & Skirt CV11 (194.1M) propelled Winter goods to 98.4% share')
              : L('Áo thun AT06 bán kỷ lục 9.192 cái (367 cái/ngày); Chân váy CV11 bán 1.399 cái', 'AT06 moved a record 9,192 units (367/day); Skirt CV11 moved 1,399 units')}
          </p>
        </div>
      </div>

      {/* Tab chuyển đổi góc nhìn */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center overflow-x-auto no-scrollbar rounded-xl bg-slate-100 p-1 dark:bg-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('category_shift')}
            className={`min-h-9 cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'category_shift' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {L('1. Histogram Theo Ngày & TB 7 Ngày (Hè vs Đông)', '1. Daily Histogram & 7-Day MA (Summer vs Winter)')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sku_lines')}
            className={`min-h-9 cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'sku_lines' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {L('2. Đường Cong Từng Mã SKU', '2. Individual SKU Trajectories')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('heatmap')}
            className={`min-h-9 cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'heatmap' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {L('3. Ma Trận Nhiệt 10 SKU × 7 Tháng', '3. Monthly SKU Heatmap')}
          </button>
        </div>

        {activeTab === 'sku_lines' && (
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar py-0.5">
            <span className="text-slate-500 font-medium mr-1 whitespace-nowrap">{L('Lọc SKU:', 'Filter:')}</span>
            {(['all', 'duel', 'bikini', 'winter_all', 'tshirt', 'skirt', 'outer_sport'] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setSkuFilter(k)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  skuFilter === k
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {k === 'all' && L('Tất cả 10 SKU', 'All 10')}
                {k === 'duel' && L('Cặp Đấu H36 vs AT06', 'Duel: H36 vs AT06')}
                {k === 'bikini' && L('Hàng Bán Hè: Bikini (5)', 'Summer Bikini (5)')}
                {k === 'winter_all' && L('Cả 4 Dòng Hàng Bán Đông (5)', 'All 4 Winter Lines (5)')}
                {k === 'tshirt' && L('Áo Thun (AT06)', 'T-shirt (AT06)')}
                {k === 'skirt' && L('Chân Váy (CV11, CV02)', 'Skirts (2)')}
                {k === 'outer_sport' && L('Áo Gió & Set Thể Thao', 'Windbreaker & Sports')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* NỘI DUNG VIEW 1: Histogram theo ngày kèm Đường trung bình 7 ngày (Hè vs Đông gộp) */}
      {activeTab === 'category_shift' && (
        <div>
          <ChartCard
            title={
              isGmv
                ? L(
                    'Biểu Đồ Histogram Doanh Thu Theo Ngày & Đường Trung Bình 7 Ngày (MA-7): Hàng Bán Hè vs Hàng Bán Đông (Triệu VNĐ)',
                    'Daily Revenue Histogram & 7-Day Moving Average (MA-7): Summer vs Winter Goods (M VND)',
                  )
                : L(
                    'Biểu Đồ Histogram Sản Lượng Xuất Kho Theo Ngày & Đường Trung Bình 7 Ngày (MA-7): Hàng Bán Hè vs Hàng Bán Đông (Sản Phẩm)',
                    'Daily Volume Histogram & 7-Day Moving Average (MA-7): Summer vs Winter Goods (Units)',
                  )
            }
            subtitle={
              isGmv
                ? L(
                    'Cột doanh thu từng ngày được xếp chồng trước - sau (cột cao hơn ở sau, cột thấp hơn ở trước để không bị che khuất). Đi kèm 2 đường trung bình trượt 7 ngày (MA-7) và bộ nút góc trên bên phải để bật/tắt riêng Đồ Hè hoặc Đồ Đông.',
                    'Daily revenue bars layered front-to-back (taller behind, shorter in front). Accompanied by 7-day moving averages (MA-7) and category filter buttons at top right.',
                  )
                : L(
                    'Sản lượng xuất kho 179 ngày được xếp chồng trước - sau (cột cao hơn ở sau, cột thấp hơn ở trước để không bị che khuất). Đi kèm 2 đường trung bình 7 ngày (MA-7) và bộ nút góc trên bên phải để bật/tắt riêng Đồ Hè hoặc Đồ Đông.',
                    '179-day daily volume bars layered front-to-back (taller behind, shorter in front). Accompanied by 7-day moving averages (MA-7) and category filter buttons at top right.',
                  )
            }
            badge={
              <div className="flex flex-wrap items-center gap-2">
                {/* 2 Nút lọc ngành hàng: Đồ Hè / Đồ Đông / Hiện Cả Hai */}
                <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setDisplayCategory(displayCategory === 'summer' ? 'both' : 'summer')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      displayCategory === 'summer'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : displayCategory === 'both'
                        ? 'text-amber-800 hover:bg-amber-100/80 dark:text-amber-300 dark:hover:bg-amber-950/50'
                        : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 opacity-60'
                    }`}
                    title={L('Chỉ hiện Đồ Hè (ẩn Đồ Đông) hoặc bấm lại để hiện cả hai', 'Show Summer Goods Only')}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400 border border-amber-600 shrink-0" />
                    <span>{L('Đồ Hè (Bikini)', 'Summer Goods')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDisplayCategory(displayCategory === 'winter' ? 'both' : 'winter')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      displayCategory === 'winter'
                        ? 'bg-[#0284C7] text-white shadow-xs'
                        : displayCategory === 'both'
                        ? 'text-[#074553] hover:bg-sky-100/80 dark:text-[#9BE7FA] dark:hover:bg-sky-950/50'
                        : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 opacity-60'
                    }`}
                    title={L('Chỉ hiện Đồ Đông (ẩn Đồ Hè) hoặc bấm lại để hiện cả hai', 'Show Winter Goods Only')}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-[#38BDF8] border border-sky-600 shrink-0" />
                    <span>{L('Đồ Đông (Gộp)', 'Winter Goods')}</span>
                  </button>

                  {displayCategory !== 'both' && (
                    <button
                      type="button"
                      onClick={() => setDisplayCategory('both')}
                      className="ml-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
                    >
                      {L('Hiện Cả Hai', 'Show Both')}
                    </button>
                  )}
                </div>

                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {isGmv ? 'Doanh Thu (Tr đ)' : 'Sản Lượng (SP)'}
                </span>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={isFullscreen ? 520 : 380}>
              <ComposedChart
                data={dailyTransitions && dailyTransitions.length > 0 ? dailyTransitions : []}
                margin={{ top: 25, right: 20, left: 10, bottom: 5 }}
                barCategoryGap="12%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis
                  dataKey="label"
                  tick={axisTick}
                  stroke="#94A3B8"
                  interval={13}
                />
                <YAxis
                  tick={axisTick}
                  stroke="#94A3B8"
                  unit={isGmv ? 'M' : ''}
                  tickFormatter={(val) =>
                    isGmv ? `${val}M` : Number(val) >= 1000 ? `${(Number(val) / 1000).toFixed(0)}k` : `${val}`
                  }
                />
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0]?.payload;
                    if (!d) return null;

                    return (
                      <div className="rounded-2xl border border-slate-200 bg-white/95 p-3.5 text-xs shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 space-y-2">
                        <div className="font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5">
                          {d.date} ({d.label})
                        </div>
                        <div className="space-y-1.5">
                          {displayCategory !== 'winter' && (
                            <div>
                              <div className="flex items-center justify-between gap-5 font-semibold text-amber-700 dark:text-amber-400">
                                <span className="flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                                  {L('Hàng Hè (Theo ngày):', 'Summer Goods (Daily):')}
                                </span>
                                <span className="tabular-nums font-bold">
                                  {isGmv ? `${d.summerGmvM?.toLocaleString('vi-VN')} Tr đ` : `${d.summerUnits?.toLocaleString('vi-VN')} SP`}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-5 text-[11px] text-slate-500 dark:text-slate-400 pl-3.5">
                                <span>{L('Đường TB 7 ngày Hè:', '7-Day MA Summer:')}</span>
                                <span className="tabular-nums font-semibold text-amber-800 dark:text-amber-300">
                                  {isGmv ? `${d.summerMa7GmvM?.toLocaleString('vi-VN')} Tr đ` : `${d.summerMa7Units?.toLocaleString('vi-VN')} SP`}
                                </span>
                              </div>
                            </div>
                          )}

                          {displayCategory !== 'summer' && (
                            <div className="pt-0.5">
                              <div className="flex items-center justify-between gap-5 font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                                <span className="flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
                                  {L('Hàng Đông (Theo ngày):', 'Winter Goods (Daily):')}
                                </span>
                                <span className="tabular-nums font-bold">
                                  {isGmv ? `${d.winterGmvM?.toLocaleString('vi-VN')} Tr đ` : `${d.winterUnits?.toLocaleString('vi-VN')} SP`}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-5 text-[11px] text-slate-500 dark:text-slate-400 pl-3.5">
                                <span>{L('Đường TB 7 ngày Đông:', '7-Day MA Winter:')}</span>
                                <span className="tabular-nums font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                                  {isGmv ? `${d.winterMa7GmvM?.toLocaleString('vi-VN')} Tr đ` : `${d.winterMa7Units?.toLocaleString('vi-VN')} SP`}
                                </span>
                              </div>
                            </div>
                          )}

                          {displayCategory === 'both' && (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-5 text-[11px] font-bold">
                              <span className="text-slate-600 dark:text-slate-400">{L('Tổng cộng cả ngày:', 'Daily Total:')}</span>
                              <span className="tabular-nums text-slate-950 dark:text-white">
                                {isGmv ? `${d.totalGmvM?.toLocaleString('vi-VN')} Tr đ` : `${d.totalUnits?.toLocaleString('vi-VN')} SP`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 15 }}
                  content={() => (
                    <div className="flex flex-wrap items-center justify-end gap-3.5 pb-2 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      {displayCategory !== 'winter' && (
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-xs bg-[#F59E0B] border border-[#D97706]" />
                          <span>{L('Cột Ngày: Hàng Hè (Bikini)', 'Daily Bar: Summer Goods (Bikini)')}</span>
                        </div>
                      )}
                      {displayCategory !== 'winter' && (
                        <div className="flex items-center gap-1.5">
                          <span className="h-0.5 w-3.5 rounded-full bg-[#B45309]" />
                          <span className="font-semibold text-amber-800 dark:text-amber-300">
                            {L('Đường TB 7 ngày: Hàng Hè', '7-Day MA: Summer Goods')}
                          </span>
                        </div>
                      )}
                      {displayCategory !== 'summer' && (
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-xs bg-[#0284C7] border border-[#0369A1]" />
                          <span>{L('Cột Ngày: Hàng Đông (Gộp)', 'Daily Bar: Winter Goods (Combined)')}</span>
                        </div>
                      )}
                      {displayCategory !== 'summer' && (
                        <div className="flex items-center gap-1.5">
                          <span className="h-0.5 w-3.5 rounded-full bg-[#083344]" />
                          <span className="font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                            {L('Đường TB 7 ngày: Hàng Đông', '7-Day MA: Winter Goods')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                />

                {/* Histogram xếp chồng trước - sau: Cột cao hơn ở sau, cột thấp hơn ở trước */}
                <Bar
                  dataKey={
                    isGmv
                      ? displayCategory === 'summer'
                        ? 'summerGmvM'
                        : displayCategory === 'winter'
                        ? 'winterGmvM'
                        : 'maxGmvM'
                      : displayCategory === 'summer'
                      ? 'summerUnits'
                      : displayCategory === 'winter'
                      ? 'winterUnits'
                      : 'maxUnits'
                  }
                  name={L('Cột Ngày', 'Daily Bar')}
                  shape={<OverlappedDailyBar isGmv={isGmv} displayCategory={displayCategory} />}
                  isAnimationActive={false}
                />

                {/* Đường trung bình 7 ngày: Hàng Bán Hè */}
                {displayCategory !== 'winter' && (
                  <Line
                    type="monotone"
                    dataKey={isGmv ? 'summerMa7GmvM' : 'summerMa7Units'}
                    name={L('Đường TB 7 ngày: Hàng Hè (Bikini)', '7-Day MA: Summer Goods (Bikini)')}
                    stroke="#B45309"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}

                {/* Đường trung bình 7 ngày: Hàng Bán Đông (Gộp tất cả) */}
                {displayCategory !== 'summer' && (
                  <Line
                    type="monotone"
                    dataKey={isGmv ? 'winterMa7GmvM' : 'winterMa7Units'}
                    name={L('Đường TB 7 ngày: Hàng Đông (Gộp các mã)', '7-Day MA: Winter Goods (Combined)')}
                    stroke="#083344"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}

                {/* Mốc Crossover */}
                {displayCategory === 'both' && (
                  <ReferenceLine
                    x="31/08"
                    stroke="#0D7287"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: 'Crossover (31/08)',
                      position: 'insideTopRight',
                      fill: '#0D7287',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* NỘI DUNG VIEW 2: Đường cong 10 SKU theo tuần */}
      {activeTab === 'sku_lines' && (
        <div>
          <ChartCard
            title={
              isGmv
                ? L(
                    `Theo Dõi ${weeklySeries.length} Tuần (25 Tuần) Theo Từng SKU: Đỉnh Hè H36 vs Bùng Nổ Thu Đông AT06 (Triệu VNĐ)`,
                    `Weekly Trajectory Across ${weeklySeries.length} Weeks: Summer Peak H36 vs Autumn Explosion AT06 (M VND)`,
                  )
                : L(
                    `Theo Dõi ${weeklySeries.length} Tuần (25 Tuần) Sản Lượng Theo Từng SKU: Đỉnh Hè H36 vs Bùng Nổ Thu Đông AT06 (Sản Phẩm / Tuần)`,
                    `Weekly Volume Trajectory: Summer Peak H36 vs Autumn Explosion AT06 (Units / Week)`,
                  )
            }
            subtitle={
              isGmv
                ? L(
                    'Quan sát sự chuyển giao thế hệ: H36 đạt đỉnh ở Tuần 24-25 (hơn 180 Tr/tuần), hạ dần về 0. Ngược lại, AT06 xuất hiện từ Tuần 37 và bùng nổ lên gần 450 Tr/tuần vào Tháng 10.',
                    'Generation handover: H36 peaked at W24-25 (>180M/wk) then decayed to near 0. Conversely, AT06 debuted at W37 and exploded to ~450M/wk in October.',
                  )
                : L(
                    'Sản lượng xuất bán theo tuần: H36 đạt đỉnh hơn 900 bộ/tuần (tháng 6), thoái trào về 0. AT06 xuất hiện từ tuần 37 và bùng nổ đạt đỉnh gần 4.100 áo/tuần vào giữa tháng 10.',
                    'Weekly units: H36 peaked at >900 units/wk (June), tapering to near 0. AT06 debuted at W37 and peaked at ~4,100 units/wk in mid-October.',
                  )
            }
            badge={
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {skuFilter === 'duel' ? 'H36 vs AT06 Head-to-Head' : '25 Tuần (04/05 – 25/10)'}
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={isFullscreen ? 500 : 350}>
              <LineChart data={weeklySeries} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="week" tick={axisTick} stroke="#94A3B8" />
                <YAxis
                  tick={axisTick}
                  stroke="#94A3B8"
                  unit={isGmv ? 'M' : ''}
                  tickFormatter={(val) =>
                    isGmv ? `${val}M` : Number(val) >= 1000 ? `${(Number(val) / 1000).toFixed(0)}k` : `${val}`
                  }
                />
                <Tooltip
                  content={
                    <ChartTooltip
                      fmt={(val) =>
                        isGmv
                          ? `${Number(val).toLocaleString('vi-VN')} Tr đ`
                          : `${Number(val).toLocaleString('vi-VN')} sản phẩm`
                      }
                    />
                  }
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 15, fontSize: 11 }} />

                {(skuFilter === 'all' || skuFilter === 'duel' || skuFilter === 'winter_all' || skuFilter === 'tshirt') && (
                  <Line
                    type="monotone"
                    dataKey={isGmv ? 'at06GmvM' : 'at06Units'}
                    name={isGmv ? 'AT06: Áo Thun Rib (Tr đ)' : 'AT06: Áo Thun Rib (Cái)'}
                    stroke="#0D7287"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#9BE7FA' }}
                    activeDot={{ r: 6 }}
                  />
                )}

                {(skuFilter === 'all' || skuFilter === 'duel' || skuFilter === 'bikini') && (
                  <Line
                    type="monotone"
                    dataKey={isGmv ? 'h36GmvM' : 'h36Units'}
                    name={isGmv ? 'H36: Bikini Kẻ Sọc (Tr đ)' : 'H36: Bikini Kẻ Sọc (Bộ)'}
                    stroke="#FFD14C"
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: '#FFD14C' }}
                  />
                )}

                {(skuFilter === 'all' || skuFilter === 'bikini') && (
                  <Line
                    type="monotone"
                    dataKey={isGmv ? 'm18GmvM' : 'm18Units'}
                    name={isGmv ? 'M18: Bikini Bodysuit (Tr đ)' : 'M18: Bikini Bodysuit (Bộ)'}
                    stroke="#FFE485"
                    strokeWidth={2}
                    dot={false}
                  />
                )}

                {(skuFilter === 'all' || skuFilter === 'winter_all' || skuFilter === 'skirt') && (
                  <Line
                    type="monotone"
                    dataKey={isGmv ? 'cv11GmvM' : 'cv11Units'}
                    name={isGmv ? 'CV11: Chân Váy Nỉ 2 Da (Tr đ)' : 'CV11: Chân Váy Nỉ (Cái)'}
                    stroke="#38BDF8"
                    strokeWidth={2}
                    dot={false}
                  />
                )}

                {(skuFilter === 'all' || skuFilter === 'winter_all' || skuFilter === 'skirt') && (
                  <Line
                    type="monotone"
                    dataKey={isGmv ? 'cv02GmvM' : 'cv02Units'}
                    name={isGmv ? 'CV02: Chân Váy Ren Voan (Tr đ)' : 'CV02: Chân Váy Ren (Cái)'}
                    stroke="#94A3B8"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                  />
                )}

                {(skuFilter === 'all' || skuFilter === 'winter_all' || skuFilter === 'outer_sport') && (
                  <Line
                    type="monotone"
                    dataKey={isGmv ? 'ag01GmvM' : 'ag01Units'}
                    name={isGmv ? 'AG01: Áo Khoác Gió (Tr đ)' : 'AG01: Áo Khoác Gió (Cái)'}
                    stroke="#0D9488"
                    strokeWidth={2}
                    dot={false}
                  />
                )}

                {(skuFilter === 'all' || skuFilter === 'winter_all' || skuFilter === 'outer_sport') && (
                  <Line
                    type="monotone"
                    dataKey={isGmv ? 'aq1GmvM' : 'aq1Units'}
                    name={isGmv ? 'AQ1: Set Đồ Thể Thao (Tr đ)' : 'AQ1: Set Đồ Thể Thao (Bộ)'}
                    stroke="#EC4899"
                    strokeWidth={1.8}
                    dot={false}
                  />
                )}

                <ReferenceLine
                  x="W36 (31/08)"
                  stroke="#E11D48"
                  strokeDasharray="4 4"
                  label={{
                    value: 'W36: Crossover',
                    position: 'top',
                    fill: '#E11D48',
                    fontSize: 10,
                    fontWeight: 'bold',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* NỘI DUNG VIEW 3: Ma trận nhiệt 10 SKU x 7 tháng */}
      {activeTab === 'heatmap' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                <th className="py-2.5 px-3 min-w-[70px]">Mã SKU</th>
                <th className="py-2.5 px-3 min-w-[200px]">{L('Tên sản phẩm', 'Product Name')}</th>
                <th className="py-2.5 px-3 min-w-[210px]">{L('Phân nhóm & Thuộc tính mùa vụ', 'Category & Seasonality')}</th>
                <th className="py-2.5 px-2.5 text-right w-20">{L('Đơn giá', 'Price')}</th>
                <th className="py-2.5 px-2 text-right w-16">T4</th>
                <th className="py-2.5 px-2 text-right w-16">T5</th>
                <th className="py-2.5 px-2 text-right w-16 bg-amber-500/10 font-bold text-amber-700 dark:text-amber-300">T6 (Đỉnh Hè)</th>
                <th className="py-2.5 px-2 text-right w-16">T7</th>
                <th className="py-2.5 px-2 text-right w-16 bg-rose-500/10 text-rose-700 dark:text-rose-300">T8 (Đáy Hè)</th>
                <th className="py-2.5 px-2 text-right w-16">T9</th>
                <th className="py-2.5 px-2 text-right w-16 bg-[#9BE7FA]/20 font-bold text-[#074553] dark:text-[#9BE7FA]">T10 (Đỉnh Đông)</th>
                <th className="py-2.5 px-3 text-right min-w-[105px]">
                  {isGmv ? L('Tổng GMV (Tr đ)', 'Total GMV') : L('Tổng Số Lượng (Cái)', 'Total Volume')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {skus.map((s) => (
                <tr
                  key={s.code}
                  onClick={() => setSelectedSku(selectedSku === s.code ? null : s.code)}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    selectedSku === s.code ? 'bg-[#C8EEF7]/30 dark:bg-slate-800/80' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.code}
                  </td>
                  <td className="py-2.5 px-3 text-slate-900 dark:text-slate-100">
                    {s.name}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${getCategoryBadgeClass(
                          s.category,
                        )}`}
                      >
                        {s.category}
                      </span>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                          s.affinity === 'Hàng Bán Đông'
                            ? 'bg-sky-100 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] border border-[#9BE7FA]/40'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/50'
                        }`}
                      >
                        {s.affinity}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2.5 text-right tabular-nums text-slate-600 dark:text-slate-400">
                    {s.avgPrice.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums text-slate-500">
                    {isGmv
                      ? (s.monthlyGmvM['2026-04'] > 0 ? s.monthlyGmvM['2026-04'] : '—')
                      : (s.monthlyUnits['2026-04'] > 0 ? s.monthlyUnits['2026-04'].toLocaleString('vi-VN') : '—')}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums">
                    {isGmv
                      ? (s.monthlyGmvM['2026-05'] > 0 ? s.monthlyGmvM['2026-05'] : '—')
                      : (s.monthlyUnits['2026-05'] > 0 ? s.monthlyUnits['2026-05'].toLocaleString('vi-VN') : '—')}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums font-bold bg-amber-500/5 text-amber-900 dark:text-amber-300">
                    {isGmv
                      ? (s.monthlyGmvM['2026-06'] > 0 ? s.monthlyGmvM['2026-06'] : '—')
                      : (s.monthlyUnits['2026-06'] > 0 ? s.monthlyUnits['2026-06'].toLocaleString('vi-VN') : '—')}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums">
                    {isGmv
                      ? (s.monthlyGmvM['2026-07'] > 0 ? s.monthlyGmvM['2026-07'] : '—')
                      : (s.monthlyUnits['2026-07'] > 0 ? s.monthlyUnits['2026-07'].toLocaleString('vi-VN') : '—')}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums text-slate-500 bg-rose-500/5">
                    {isGmv
                      ? (s.monthlyGmvM['2026-08'] > 0 ? s.monthlyGmvM['2026-08'] : '—')
                      : (s.monthlyUnits['2026-08'] > 0 ? s.monthlyUnits['2026-08'].toLocaleString('vi-VN') : '—')}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums">
                    {isGmv
                      ? (s.monthlyGmvM['2026-09'] > 0 ? s.monthlyGmvM['2026-09'] : '—')
                      : (s.monthlyUnits['2026-09'] > 0 ? s.monthlyUnits['2026-09'].toLocaleString('vi-VN') : '—')}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums font-bold bg-[#9BE7FA]/10 text-[#074553] dark:text-[#9BE7FA]">
                    {isGmv
                      ? (s.monthlyGmvM['2026-10'] > 0 ? s.monthlyGmvM['2026-10'] : '—')
                      : (s.monthlyUnits['2026-10'] > 0 ? s.monthlyUnits['2026-10'].toLocaleString('vi-VN') : '—')}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-bold text-slate-950 dark:text-white">
                    {isGmv
                      ? `${s.totalGmvM.toLocaleString('vi-VN')} Tr`
                      : `${s.totalUnits.toLocaleString('vi-VN')} cái`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4 Khối Insight: Giải mã chiến lược chuyển trạng thái */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-900 dark:text-white">
          <Layers className="h-4 w-4 text-[#0D7287] dark:text-[#9BE7FA]" />
          {L(
            'Bản Đồ 4 Pha Chuyển Trạng Thái Danh Mục: Hàng Bán Hè vs Hàng Bán Đông (Transition Playbook)',
            '4-Phase Seasonal Transition Playbook: Summer Goods vs Winter Goods',
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {transitionInsights.map((ins, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[11px] font-bold text-slate-950 dark:text-white">
                    {L(ins.phase.split('(')[0], ins.phaseEn.split('(')[0])}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-[#C8EEF7] text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA]">
                    {ins.kpi}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {L(ins.desc, ins.descEn)}
                </p>
              </div>
              <div className="mt-2 text-[10px] font-bold text-[#0D7287] dark:text-[#9BE7FA] uppercase tracking-wider">
                {ins.tag}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Khối Truy Vấn SQL Chứng Minh Trên Kho MySQL */}
      <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 p-4">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
          <span className="font-mono text-[#9BE7FA] flex items-center gap-1.5">
            <span>SQL: kami_sku_daily_timeseries</span>
            <span className="text-slate-400">({skus.length} SKUs × 179 ngày = 1.790 bản ghi | Doanh thu & Sản lượng)</span>
          </span>
          <button
            type="button"
            onClick={handleCopySql}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{copiedSql ? L('Đã chép!', 'Copied!') : L('Chép SQL', 'Copy SQL')}</span>
          </button>
        </div>
        <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed p-1">
          <code>{sqlSnippet}</code>
        </pre>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-md p-3 sm:p-6 lg:p-8 flex flex-col items-center">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pt-2">
      {content}
    </div>
  );
}
