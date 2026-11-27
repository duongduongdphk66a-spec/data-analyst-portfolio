'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { V2 } from './kamiOutlineV2Metrics';

interface Props {
  lang: 'vi' | 'en';
}

type ParetoMode = 'koc' | 'sku';

export function Chapter3SeasonalityAndRegression({ lang }: Props) {
  const isVi = lang === 'vi';
  const [paretoMode, setParetoMode] = useState<ParetoMode>('koc');
  const [showRegressionAccordion, setShowRegressionAccordion] = useState(false);

  const skuMonthly = V2.ch3.skuMonthlySeries;
  const dp = V2.ch2.dualPareto;

  // Post-launch Active-Window Panel FE (n = 1,422, excluding 338 pre-launch zero rows; Within R² = 0.302)
  // Computed directly from [Kami Ely]_10_SKU_Daily_Timeseries_Merged.xlsx (400 SKU-cluster bootstrap reps, seed 20261101)
  const activePanelCoefs = [
    { key: 'live_t0', labelVi: 'Số phiên Live cùng ngày (t)', labelEn: 'Same-day Live sessions (t)', beta: 0.394, ciLow: 0.093, ciHigh: 0.641 },
    { key: 'live_l13', labelVi: 'Live trung bình trễ 1–3 ngày', labelEn: 'Lagged Live avg (t-1..t-3)', beta: 0.597, ciLow: 0.155, ciHigh: 0.877 },
    { key: 'vid_t0', labelVi: 'Video mới cùng ngày (t)', labelEn: 'Same-day new Videos (t)', beta: 0.079, ciLow: -0.410, ciHigh: 0.286 },
    { key: 'vid_l13', labelVi: 'Video trung bình trễ 1–3 ngày', labelEn: 'Lagged Video avg (t-1..t-3)', beta: 0.237, ciLow: -0.199, ciHigh: 0.649 },
    { key: 'koc_t0', labelVi: 'KOC mới cùng ngày (t)', labelEn: 'Same-day new KOCs (t)', beta: 0.165, ciLow: -0.258, ciHigh: 0.755 },
  ];
  const fmtDec = (val: number, digits = 3) => {
    const s = val.toFixed(digits);
    return isVi ? s.replace('.', ',') : s;
  };

  const paretoChartItems =
    paretoMode === 'koc'
      ? dp.koc.items.map((x) => ({
          name: x.rank === 1 ? '@shop_official' : x.rank === 2 ? '@koc_sat01' : `KOC #${x.rank}`,
          fullName: x.label,
          gmvM: x.gmvM,
          sharePct: x.sharePct,
          cumPct: x.cumPct,
          highlight: x.isInHouse,
        }))
      : dp.sku.items.slice(0, 12).map((x) => ({
          name: x.code,
          fullName: `SKU ${x.code}`,
          gmvM: x.gmvM,
          sharePct: x.sharePct,
          cumPct: x.cumPct,
          highlight: x.rank === 1,
        }));

  return (
    <section id="sec-seasonality" className="scroll-mt-28 space-y-6">
      <div id="sec-revenue" className="scroll-mt-28 space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {isVi
            ? 'Chuyển giao mùa vụ 10 SKU & Tập trung Pareto'
            : 'Seasonal Transition & Dual Pareto Concentration'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {isVi
            ? 'Đối chiếu chuyển giao Hè → Đông của 10 SKU chủ lực (52,1% GMV shop) với độ tập trung Pareto của 6.086 KOC và 339 SKU.'
            : 'Pairs Summer-to-Winter transition across 10 core SKUs (52.1% store GMV) with Pareto concentration across 6,086 KOCs and 339 SKUs.'}
        </p>
      </div>

      {/* Side-by-Side Grid: Biểu đồ 3 (Vùng xếp chồng Hè vs Đông từ 10 SKU) & Biểu đồ 5 (Pareto 2 lớp KOC Affiliate | Danh mục SKU) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Biểu đồ 3: Biểu đồ Vùng xếp chồng "Vùng trũng giao mùa" từ 10 SKU chủ lực (52,1% GMV toàn shop) */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="inline-flex items-center rounded-md bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 px-2.5 py-0.5 text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                {isVi ? 'Biểu đồ 3 · 10_SKU_Daily_Timeseries (52,1% GMV shop)' : 'Chart 3 · 10_SKU_Daily_Timeseries (52.1% store GMV)'}
              </span>
              <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-300 tabular-nums">
                {isVi ? 'AT06 mở bán 09/09 · AG01 14/09 (Trễ ~1 tháng)' : 'AT06 launched Sep 09 · AG01 Sep 14 (~1m late)'}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {isVi
                ? '6 mã Đồ bơi Hè rơi -89,3% (1,57 → 0,17 tỷ) trong khi mã Thu Đông AT06 mở bán trễ ~1 tháng'
                : '6 Summer Swimwear SKUs Fell -89.3% (1.57B → 0.17B) While Hero AT06 Launched ~1 Month Late'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
              {isVi
                ? 'Trục X = Tháng (T5 → T10) · Đơn vị: Triệu VNĐ (AQ1 đã chuẩn hóa về nhóm Đồ bơi Hè)'
                : 'X-Axis = Month (May → Oct) · Unit: Million VND (AQ1 normalized into Summer Swimwear)'}
            </p>

            <div className="h-[265px] w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={skuMonthly} margin={{ top: 12, right: 16, left: 0, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}M`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3 text-xs tabular-nums space-y-1">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {isVi ? `Tháng ${d.month} (${d.shortLabel})` : `Month ${d.month}`}
                          </p>
                          <p>
                            {isVi ? 'Nhóm Hàng Hè (6 mã Đồ bơi gồm AQ1): ' : 'Summer Swimwear (6 SKUs incl. AQ1): '}
                            <strong className="text-amber-600 dark:text-amber-400">
                              {d.summerGmvM}M ({d.summerSharePct}%)
                            </strong>
                            <span className="block text-[11px] text-slate-500">
                              5 Bikini: {d.bikini5GmvM}M · AQ1: {d.aq1GmvM}M
                            </span>
                          </p>
                          <p>
                            {isVi ? 'Nhóm Hàng Đông (AT06, CV11, CV02, AG01): ' : 'Winter Merchandise (AT06, CV11, CV02, AG01): '}
                            <strong className="text-[#0D7287] dark:text-[#9BE7FA]">
                              {d.winterGmvM}M ({d.winterSharePct}%)
                            </strong>
                            <span className="block text-[11px] text-slate-500">
                              AT06: {d.at06GmvM}M · AG01: {d.ag01GmvM}M · CV11+CV02: {d.skirtsGmvM}M
                            </span>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="summerGmvM"
                    stackId="season"
                    name={isVi ? 'Nhóm Hàng Hè (6 mã Đồ bơi gồm AQ1)' : 'Summer Swimwear (6 SKUs incl. AQ1)'}
                    stroke="#D97706"
                    fill="#FFD14C"
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="winterGmvM"
                    stackId="season"
                    name={isVi ? 'Nhóm Hàng Đông (AT06, CV11, CV02, AG01)' : 'Autumn-Winter (AT06, CV11, CV02, AG01)'}
                    stroke="#0D7287"
                    fill="#9BE7FA"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 tabular-nums leading-relaxed">
            <strong className="text-slate-900 dark:text-white">
              {isVi ? 'Kết luận: ' : 'Takeaway: '}
            </strong>
            {isVi
              ? '6 mã đồ bơi Hè rơi -89,3% trong T8 (1,57 tỷ → 0,17 tỷ, giải thích ~45% mức giảm T6→T8). Chân váy CV11/CV02 bán từ đầu T5 cũng giảm -41% T7→T8; AG01 chỉ bán 22 ngày (59M, tắt sau 05/10); sang T10 riêng AT06 gánh 80,5% GMV shop (1,30 tỷ) nhưng MA7 đã cắt dưới MA28 ngày 22/10.'
              : 'The 6 summer swimwear SKUs fell -89.3% in Aug (1.57B → 0.17B, ~45% of the Jun→Aug drop). Skirts CV11/CV02 (live since May) also fell -41% Jul→Aug; AG01 sold only 22d (59M, flat after Oct 05); AT06 drove 80.5% of Oct GMV (1.30B), leaving high single-SKU concentration.'}
          </p>
        </div>

        {/* Biểu đồ 4: Biểu đồ Pareto 2 lớp có nút gạt [KOC Affiliate | Danh mục SKU] */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-[#FFE485]/60 dark:bg-[#FFD14C]/15 px-2.5 py-0.5 text-xs font-semibold text-slate-900 dark:text-[#FFE485]">
                {isVi ? 'Biểu đồ 4 · Phân phối Pareto & Đường tích lũy 80%' : 'Chart 4 · Dual Pareto & 80% Cumulative Curve'}
              </span>

              <div
                role="group"
                aria-label={isVi ? 'Chuyển lớp Pareto' : 'Toggle Pareto mode'}
                className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/70 p-1"
              >
                <button
                  type="button"
                  onClick={() => setParetoMode('koc')}
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    paretoMode === 'koc'
                      ? 'bg-[#9BE7FA] text-slate-950'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isVi ? 'KOC Affiliate (6.086)' : 'KOC Affiliate (6,086)'}
                </button>
                <button
                  type="button"
                  onClick={() => setParetoMode('sku')}
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    paretoMode === 'sku'
                      ? 'bg-[#9BE7FA] text-slate-950'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isVi ? 'Danh mục SKU (339)' : 'SKU Catalog (339)'}
                </button>
              </div>
            </div>

            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {paretoMode === 'koc'
                ? isVi
                  ? 'Pareto KOC Affiliate: 329/6.086 kênh có đơn (5,4%) · 2 kênh nội bộ chiếm 74,9%'
                  : 'KOC Affiliate Pareto: 329/6,086 Active (5.4%) · 2 In-House Channels Drive 74.9%'
                : isVi
                ? 'Pareto Danh mục SKU: 133/339 link có đơn (39,2%) · Top 12 link tạo 80,6% GMV'
                : 'Catalog Pareto: 133/339 Active Listings (39.2%) · Top 12 Listings Drive 80.6% GMV'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
              {paretoMode === 'koc'
                ? isVi
                  ? 'Bảng Affiliate_KOL (Tổng 2,92 tỷ VNĐ cửa sổ cuốn chiếu) · Top 10 kênh chiếm 83,7%'
                  : 'Affiliate_KOL table (2.92B VND rolling window) · Top 10 channels account for 83.7%'
                : isVi
                ? 'Bảng Shop_Products (Tổng 3,16 tỷ VNĐ cửa sổ cuốn chiếu) · Riêng mã AT06 chiếm 46,9% (1,48 tỷ)'
                : 'Shop_Products table (3.16B VND rolling window) · AT06 alone drives 46.9% (1.48B)'}
            </p>

            <div className="h-[265px] w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={paretoChartItems} margin={{ top: 12, right: 16, left: 0, bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}M`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#d97706' }}
                    tickFormatter={(v) => `${v}%`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3 text-xs tabular-nums space-y-1">
                          <p className="font-bold text-slate-900 dark:text-white">{d.fullName}</p>
                          <p>
                            {isVi ? 'Doanh thu đóng góp: ' : 'GMV contribution: '}
                            <strong className="text-[#0D7287] dark:text-[#9BE7FA]">{d.gmvM}M VNĐ ({d.sharePct}%)</strong>
                          </p>
                          <p>
                            {isVi ? 'Tỷ trọng tích lũy: ' : 'Cumulative share: '}
                            <strong className="text-amber-600 dark:text-amber-400">{d.cumPct}%</strong>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine yAxisId="right" y={80} stroke="#E11D48" strokeDasharray="3 3" />
                  <Bar
                    yAxisId="left"
                    dataKey="gmvM"
                    name={isVi ? 'Doanh thu (Triệu VNĐ)' : 'GMV (M VND)'}
                    radius={[5, 5, 0, 0]}
                    maxBarSize={32}
                  >
                    {paretoChartItems.map((entry, idx) => (
                      <Cell key={`pcell-${idx}`} fill={entry.highlight ? '#0D7287' : '#9BE7FA'} />
                    ))}
                  </Bar>
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cumPct"
                    name={isVi ? '% GMV tích lũy' : 'Cumulative GMV %'}
                    stroke="#D97706"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#FFD14C', stroke: '#D97706', strokeWidth: 1.5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 tabular-nums leading-relaxed">
            {paretoMode === 'koc' ? (
              <>
                <strong className="text-slate-900 dark:text-white">
                  {isVi ? 'Kết luận: ' : 'Takeaway: '}
                </strong>
                {isVi
                  ? 'Chỉ 329/6.086 KOC (5,4%) có đơn; 2 kênh nội bộ (@shop_official 60,1% + @koc_sat01 14,8%) chiếm 74,9% bảng KOL.'
                  : 'Only 329/6,086 KOCs (5.4%) converted; 2 in-house accounts (@shop_official 60.1% + @koc_sat01 14.8%) drive 74.9% of KOL GMV.'}
              </>
            ) : (
              <>
                <strong className="text-slate-900 dark:text-white">
                  {isVi ? 'Kết luận: ' : 'Takeaway: '}
                </strong>
                {isVi
                  ? 'Chỉ 133/339 link sản phẩm (39,2%) có đơn; Top 12 link tạo 80,6% GMV (lưu ý mã H30 tách thành nhiều link: hạng #12 là 38,3M & hạng #13 là 32,7M).'
                  : 'Only 133/339 product listings (39.2%) converted; Top 12 listings drive 80.6% of GMV (note: SKU H30 splits across separate links at #12 38.3M & #13 32.7M).'}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Tóm tắt 3 kiểm định thống kê cốt lõi (HHI, Winsorize MA, Mann-Whitney/Fisher) — khớp trực tiếp với Notebook */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs tabular-nums">
        <div className="rounded-xl border border-[#C8EEF7] dark:border-slate-800 bg-[#F0F9FB]/70 dark:bg-slate-900/60 p-3.5">
          <p className="font-bold text-[#074553] dark:text-[#9BE7FA]">
            {isVi ? 'Chỉ số tập trung HHI & Gini' : 'HHI Concentration & Gini'}
          </p>
          <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
            {isVi
              ? 'KOL 90N: HHI = 3.842 (Gini 0,94) · Bỏ chính chủ (còn vệ tinh): 1.471 · Bỏ cả 2 kênh nội bộ: 246 (riêng Live thuần ngoài: 761).'
              : '90d KOL: HHI = 3,842 (Gini 0.94) · Ex official (incl. sat): 1,471 · Pure external (ex both in-house): 246 (pure external Live: 761).'}
          </p>
        </div>
        <div className="rounded-xl border border-[#FFE485] dark:border-slate-800 bg-[#FFE485]/15 dark:bg-slate-900/60 p-3.5">
          <p className="font-bold text-amber-900 dark:text-[#FFE485]">
            {isVi ? 'Kiểm chứng Winsorize đỉnh 16/06' : 'Jun 16 Outlier Winsorization'}
          </p>
          <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
            {isVi
              ? 'Đỉnh 315,0M (Z = 6,81 lùi 28N): khi cắt tại P99 (176,6M), P95 (136,8M) hoặc thay trung vị T6 (120,5M), mốc MA7 < MA28 vẫn rơi vào 26–27/06.'
              : '315.0M peak (trailing 28d Z = 6.81): clipping at P99 (176.6M), P95 (136.8M), or Jun median (120.5M) keeps the MA7 < MA28 crossover at Jun 26–27.'}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3.5">
          <p className="font-bold text-slate-900 dark:text-white">
            {isVi ? 'Mann-Whitney U & Fisher Exact' : 'Mann-Whitney U & Fisher Exact'}
          </p>
          <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
            {isVi
              ? 'Video Ads tăng tỷ lệ có đơn (Fisher OR = 3,83, p = 4,19e-44) nhưng trung vị GPM clip có đơn thấp hơn Organic (116,4k vs 245,3k, MW p = 3,00e-08).'
              : 'Ad videos lift conversion (Fisher OR = 3.83, p = 4.19e-44) yet converting-clip median GPM trails Organic (116.4k vs 245.3k, MW p = 3.00e-08).'}
          </p>
        </div>
      </div>

      {/* Collapsible Technical Accordion for Panel Fixed-Effects Regression & Price Bands */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
        <button
          type="button"
          onClick={() => setShowRegressionAccordion((v) => !v)}
          className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0D7287] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span>
            {showRegressionAccordion
              ? isVi
                ? 'Thu gọn bảng hệ số hồi quy Panel Fixed-Effects & phân bổ 4 dải giá ASP'
                : 'Collapse Panel Fixed-Effects regression coefficients & 4-band ASP price distribution'
              : isVi
              ? 'Xem kiểm định chuyên sâu (nhân tố tăng trưởng): Hồi quy Panel Fixed-Effects hậu mở bán (n = 1.422) & 4 dải giá ASP'
              : 'View technical audit (growth drivers): Post-Launch Panel Fixed-Effects Regression (n = 1,422) & 4-Band ASP Distribution'}
          </span>
          {showRegressionAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRegressionAccordion && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
            {/* Panel FE Regression Table (Post-launch active window robustness spec) */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                {isVi
                  ? 'Hồi quy Panel Fixed-Effects hậu mở bán (n = 1.422 SKU-ngày · Within R² = 0,302 · 400 bootstrap cụm)'
                  : 'Post-Launch Panel Fixed-Effects (n = 1,422 SKU-days · Within R² = 0.302 · 400 cluster bootstraps)'}
              </p>
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-1.5 pr-2 font-semibold">{isVi ? 'Biến giải thích (log1p)' : 'Regressor (log1p)'}</th>
                    <th className="py-1.5 px-2 font-semibold text-right">β</th>
                    <th className="py-1.5 px-2 font-semibold text-right">95% CI</th>
                    <th className="py-1.5 pl-2 font-semibold text-right">{isVi ? 'Ý nghĩa' : 'Sig.'}</th>
                  </tr>
                </thead>
                <tbody>
                  {activePanelCoefs.map((c) => {
                    const isSig = c.ciLow > 0 || c.ciHigh < 0;
                    return (
                      <tr key={c.key} className="border-b border-slate-100 dark:border-slate-800/60">
                        <td className="py-1.5 pr-2 font-medium text-slate-800 dark:text-slate-200">
                          {isVi ? c.labelVi : c.labelEn}
                        </td>
                        <td
                          className={`py-1.5 px-2 text-right font-bold ${
                            isSig
                              ? 'text-[#0D7287] dark:text-[#9BE7FA]'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          +{fmtDec(c.beta)}
                        </td>
                        <td className="py-1.5 px-2 text-right text-slate-600 dark:text-slate-400">
                          [{c.ciLow >= 0 ? '+' : ''}{fmtDec(c.ciLow)}, +{fmtDec(c.ciHigh)}]
                        </td>
                        <td className="py-1.5 pl-2 text-right">
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                              isSig
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {isSig ? (isVi ? 'Có ý nghĩa' : 'p < 0.05') : isVi ? 'Không ý nghĩa' : 'n.s.'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {isVi
                  ? 'Kiểm chứng độ vững: đã loại 338 ngày bằng 0 trước ngày mở bán của từng SKU (toàn mẫu n = 1.760 có Within R² = 0,490 bị phồng bởi các ngày chưa ra mắt). Chỉ 2 biến Livestream có 95% CI không cắt 0; lưu ý tự tương quan lag-1 = 0,680, đa cộng tuyến Live–KOC (r = 0,923) và cụm nhỏ (G = 10 SKU) nên chỉ tham chiếu định hướng, không suy diễn nhân quả.'
                  : 'Robustness check: excludes 338 pre-launch zero days per SKU (full n = 1,760 had inflated Within R² = 0.490). Only the 2 Livestream terms exclude 0; lag-1 autocorrelation (0.680), Live–KOC collinearity (r = 0.923), and small cluster count (G = 10) make this directional only.'}
              </p>
            </div>

            {/* 4 Price Bands Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                {isVi
                  ? 'Phân bổ 339 link sản phẩm theo 4 dải giá thực bán — Realized ASP (75k–250k chiếm 95,4% GMV)'
                  : '339 Product Listings Across 4 Realized ASP Price Bands (75k–250k Drives 95.4% GMV)'}
              </p>
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-1.5 pr-2 font-semibold">{isVi ? 'Dải giá' : 'Price Band'}</th>
                    <th className="py-1.5 px-2 font-semibold text-right">{isVi ? 'Có đơn / Tổng' : 'Active / Total'}</th>
                    <th className="py-1.5 px-2 font-semibold text-right">% SP</th>
                    <th className="py-1.5 pl-2 font-semibold text-right">% GMV</th>
                  </tr>
                </thead>
                <tbody>
                  {V2.ch2.skuPareto.priceBandsRealizedAsp.map((b) => (
                    <tr key={b.band} className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="py-1.5 pr-2 font-bold text-slate-900 dark:text-white">{b.band}</td>
                      <td className="py-1.5 px-2 text-right text-slate-600 dark:text-slate-300">
                        {b.activeSkus} / {b.skus}
                      </td>
                      <td className="py-1.5 px-2 text-right">{b.unitsSharePct}%</td>
                      <td className="py-1.5 pl-2 text-right font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                        {b.gmvSharePct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {isVi
                  ? 'Ghi chú phương pháp: Phân tổ theo đơn giá bán thực tế (Realized ASP = GMV / sản lượng) để phản ánh giá sau mã giảm giá (95,4%); nếu tính theo cận dưới giá niêm yết hoặc trung điểm khoảng giá trên FastMoss, tỷ trọng dải 75k–250k lần lượt là 94,8% và 93,1%.'
                  : 'Method note: Banded by Realized ASP (GMV / units) to reflect post-discount transaction prices (95.4%); using FastMoss list-price lower bound or range midpoint yields 94.8% and 93.1%, respectively.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
