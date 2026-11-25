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
  const reg = V2.ch3.panelRegression;

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
      <div id="sec-revenue" className="scroll-mt-28 space-y-1.5">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {isVi
            ? 'Mạng lưới Affiliate & Danh mục SKU: Chuyển giao mùa vụ & Phân phối Pareto'
            : 'Affiliate Network & SKU Catalog: Seasonal Transition & Pareto Concentration'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-prose leading-relaxed">
          {isVi
            ? 'Đặt cạnh nhau quá trình chuyển giao Hè → Đông của 10 SKU chủ lực (chiếm 52,1% GMV toàn shop giai đoạn 30/04–25/10) và mức độ tập trung Pareto của 6.086 kênh KOC cùng 339 mã sản phẩm.'
            : 'Pairing the Summer-to-Winter transition across the 10 tracked core SKUs (52.1% of store GMV during Apr 30–Oct 25) with the dual-layer Pareto concentration of 6,086 KOC channels and 339 catalog SKUs.'}
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
                ? 'Vùng trũng giao mùa: 6 mã Đồ bơi Hè (gồm AQ1) vs. 4 mã Thu Đông'
                : 'Seasonal Transition Chasm: 6 Summer Swimwear SKUs (incl. AQ1) vs. 4 Autumn-Winter SKUs'}
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

          <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-3 text-xs text-slate-700 dark:text-slate-300 tabular-nums leading-relaxed">
            <strong className="text-slate-900 dark:text-white">
              {isVi ? 'Từ đứt gãy mùa vụ sang phụ thuộc đơn mã: ' : 'From Seasonal Gap to Single-SKU Dependency: '}
            </strong>
            {isVi
              ? 'Đồ bơi đạt đỉnh T6 (1,57 tỷ) rồi rơi 90% trong T8 xuống 0,15 tỷ (gộp AQ1 là 0,17 tỷ). Hai mã Thu Đông mới AT06 (mở bán 09/09) và AG01 (mở bán 14/09) lên kệ chậm gần 1 tháng tạo khoảng trống T8. Sang T10, riêng 1 mã AT06 đạt 1,30 tỷ (chiếm 80,5% tổng doanh thu toàn shop T10).'
              : 'Swimwear peaked in June (1.57B) and dropped 90% in August to 0.15B (0.17B incl. AQ1). Autumn heroes AT06 (first sale Sep 09) and AG01 (Sep 14) launched nearly 1 month late, leaving an August product gap. In October, single SKU AT06 hit 1.30B (80.5% of total October store GMV).'}
          </div>
        </div>

        {/* Biểu đồ 5: Biểu đồ Pareto 2 lớp có nút gạt [KOC Affiliate | Danh mục SKU] */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-[#FFE485]/60 dark:bg-[#FFD14C]/15 px-2.5 py-0.5 text-xs font-semibold text-slate-900 dark:text-[#FFE485]">
                {isVi ? 'Biểu đồ 5 · Phân phối Pareto & Đường tích lũy 80%' : 'Chart 5 · Dual Pareto & 80% Cumulative Curve'}
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
                ? 'Pareto Danh mục SKU: 133/339 mã có đơn (39,2%) · Top 12 mã tạo 80,6% GMV'
                : 'SKU Catalog Pareto: 133/339 Active (39.2%) · Top 12 SKUs Drive 80.6% GMV'}
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

          <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-3 text-xs text-slate-700 dark:text-slate-300 tabular-nums leading-relaxed">
            {paretoMode === 'koc' ? (
              <>
                <strong className="text-slate-900 dark:text-white">
                  {isVi ? 'Đuôi dài KOC 94,6% không ra đơn: ' : '94.6% Zero-Sale KOC Long Tail: '}
                </strong>
                {isVi
                  ? 'Chỉ 329/6.086 tài khoản (5,4%) trong bảng Affiliate_KOL phát sinh doanh thu. Riêng kênh chính chủ @shop_official (60,1%) + kênh vệ tinh @koc_sat01 (14,8%) chiếm 74,9% tổng doanh thu bảng KOL (2,92 tỷ); Top 10 kênh chiếm 83,7%.'
                  : 'Only 329/6,086 accounts (5.4%) in Affiliate_KOL generated revenue. In-house @shop_official (60.1%) + satellite @koc_sat01 (14.8%) account for 74.9% of KOL table GMV (2.92B); Top 10 channels reach 83.7%.'}
              </>
            ) : (
              <>
                <strong className="text-slate-900 dark:text-white">
                  {isVi ? 'Tập trung danh mục & Bẫy trùng mã H30: ' : 'Catalog Concentration & H30 Duplicate Listing: '}
                </strong>
                {isVi
                  ? 'Chỉ 133/339 SKU (39,2%) có đơn (206 mã = 60,8% doanh số 0đ). Mã AT06 chiếm 46,9% (1,48 tỷ) và Top 12 SKU tạo ra 80,6% tổng GMV (3,16 tỷ). Lưu ý làm sạch: mã H30 có 2 link sản phẩm tách biệt cùng nằm trong Top 13 (38,3 triệu và 32,7 triệu).'
                  : 'Only 133/339 SKUs (39.2%) had orders (206 SKUs = 60.8% zero-sale). AT06 takes 46.9% (1.48B) and the Top 12 SKUs drive 80.6% of total GMV (3.16B). Data audit note: SKU H30 has 2 separate product links in the Top 13 (38.3M and 32.7M).'}
              </>
            )}
          </div>
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
                ? 'Thu gọn bảng hệ số hồi quy Panel Fixed-Effects, phân rã dải giá & đối soát đỉnh 16/06'
                : 'Collapse Panel Fixed-Effects regression coefficients, price bands & Jun 16 peak reconciliation'
              : isVi
              ? 'Xem kiểm định chuyên sâu (nhân tố tăng trưởng): Hồi quy Panel Fixed-Effects (n = 1.760), Phân bổ 4 dải giá ASP & Đối soát đỉnh 16/06'
              : 'View technical audit (growth drivers): Panel Fixed-Effects Regression (n = 1,760), 4-Band ASP Distribution & Jun 16 Peak Audit'}
          </span>
          {showRegressionAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRegressionAccordion && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
            {/* Panel FE Regression Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                {isVi
                  ? `Hồi quy Panel Fixed-Effects trên 10 SKU (n = ${reg.nObs} quan sát SKU-ngày, ${reg.bootstrapReps} lần cluster bootstrap)`
                  : `Panel Fixed-Effects Regression across 10 SKUs (n = ${reg.nObs} SKU-day obs, ${reg.bootstrapReps} cluster bootstrap reps)`}
              </p>
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-1.5 pr-2 font-semibold">{isVi ? 'Biến giải thích (log1p)' : 'Regressor (log1p)'}</th>
                    <th className="py-1.5 px-2 font-semibold text-right">β</th>
                    <th className="py-1.5 pl-2 font-semibold text-right">95% CI</th>
                  </tr>
                </thead>
                <tbody>
                  {reg.coefficients.map((c) => (
                    <tr key={c.key} className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="py-1.5 pr-2 font-medium text-slate-800 dark:text-slate-200">
                        {isVi ? c.labelVi : c.labelEn}
                      </td>
                      <td className="py-1.5 px-2 text-right font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                        +{c.beta.toFixed(3)}
                      </td>
                      <td className="py-1.5 pl-2 text-right text-slate-600 dark:text-slate-400">
                        [{c.ciLow.toFixed(3)}, +{c.ciHigh.toFixed(3)}]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4 Price Bands Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                {isVi
                  ? 'Phân bổ 339 SKU theo 4 dải giá bán thực tế (Dải 75k–250k chiếm 93,1% GMV)'
                  : '339 SKUs Across 4 Realized ASP Price Bands (75k–250k Band Drives 93.1% GMV)'}
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
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
