'use client';

import React, { useState } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
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

type Granularity = 'month' | 'week' | 'day';

const MONTH_GROWTH_NOTES: Record<string, { momVi: string; momEn: string }> = {
  '2026-03': { momVi: '23 ngày mở bán', momEn: '23 partial days' },
  '2026-04': { momVi: '+98,7% TB/ngày', momEn: '+98.7% daily avg' },
  '2026-05': { momVi: '+8,1% TB/ngày', momEn: '+8.1% daily avg' },
  '2026-06': { momVi: '+41,8% · Đỉnh Hè', momEn: '+41.8% · Summer Peak' },
  '2026-07': { momVi: '-45,4% TB/ngày', momEn: '-45.4% daily avg' },
  '2026-08': { momVi: '-70,1% (-83,7% TB/ngày vs T6)', momEn: '-70.1% (-83.7% daily avg vs Jun)' },
  '2026-09': { momVi: '+13,9% TB/ngày', momEn: '+13.9% daily avg' },
  '2026-10': { momVi: '+176,8% (+214,9% vs T8)', momEn: '+176.8% (+214.9% vs Aug)' },
};

export function Tier1ExecutiveSummary({ lang }: Props) {
  const isVi = lang === 'vi';
  const [granularity, setGranularity] = useState<Granularity>('month');

  const monthlyComboData = V2.ch3.monthly.map((m) => ({
    ...m,
    axisLabel: m.isPartial ? `${m.shortLabel} (${m.days}d)` : m.shortLabel,
    momNote: isVi
      ? MONTH_GROWTH_NOTES[m.month]?.momVi || ''
      : MONTH_GROWTH_NOTES[m.month]?.momEn || '',
  }));

  return (
    <section id="sec-overview" className="scroll-mt-28 space-y-6">
      {/* Compact 3-Point Key Findings Strip (non-redundant with Hero KPIs) */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-[#C8EEF7]/15 dark:bg-slate-900/70 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300 tabular-nums">
          <div className="rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 px-3.5 py-2.5">
            <span className="font-bold text-slate-900 dark:text-white">
              {isVi ? '1. Vùng trũng T8: ' : '1. Aug Trough: '}
            </span>
            {isVi
              ? '6 mã đồ bơi rơi -89,3% (1,57 → 0,17 tỷ, ~45% mức sụt T6→T8) trong khi AT06 lên kệ trễ ~1 tháng; phần còn lại cần thêm dữ liệu Ads/tồn kho.'
              : '6 swimwear SKUs fell -89.3% (1.57B → 0.17B, ~45% of the Jun→Aug drop) while AT06 launched ~1m late; remaining gap needs ad-spend/stock logs.'}
          </div>
          <div className="rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 px-3.5 py-2.5">
            <span className="font-bold text-slate-900 dark:text-white">
              {isVi ? '2. Đảo chiều kênh: ' : '2. Channel Split: '}
            </span>
            {isVi
              ? 'Live (10,47 tỷ) phụ thuộc 84,5% vào 2 phòng nội bộ; Video (2,20 tỷ) do KOC ngoài dẫn 58,4%.'
              : 'Live (10.47B) relies 84.5% on 2 in-house rooms; Video (2.20B) is 58.4% external KOCs.'}
          </div>
          <div className="rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 px-3.5 py-2.5">
            <span className="font-bold text-slate-900 dark:text-white">
              {isVi ? '3. Đòn bẩy & Rủi ro: ' : '3. Leverage & Risk: '}
            </span>
            {isVi
              ? 'Live >10h tụt từ 8,48 Tr/h (T6) về 0,73 Tr/h (T8); Video Ads có GPM thấp hơn Organic (0,84×); T10 riêng AT06 chiếm 80,5%.'
              : '>10h Live fell from 8.48M/hr (Jun) to 0.73M/hr (Aug); Video Ads GPM trails Organic (0.84x); AT06 drove 80.5% of Oct.'}
          </div>
        </div>
      </div>

      {/* Cây chỉ số (KPI Tree) gắn kết mục tiêu kinh doanh với 3 nút thắt gốc */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 sm:p-5 space-y-3.5 tabular-nums">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
              {isVi
                ? 'Cây chỉ số (KPI Tree) · Phân rã GMV 15,01 tỷ đ → Kênh & 3 nút thắt vận hành'
                : 'KPI Tree · Decomposing 15.01B VND GMV into Channel Drivers & 3 Bottlenecks'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isVi
                ? 'GMV (15,01 tỷ) = 101.896 sản phẩm × ASP 147,3k đ (cộng dồn trên 231 ngày, đã loại +7,59 tỷ trùng nguồn)'
                : 'GMV (15.01B) = 101,896 units × 147.3k ASP (231 days, after removing +7.59B cross-file overlap)'}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#FFE485]/50 dark:bg-[#FFD14C]/15 border border-[#FFD14C]/60 text-[11px] font-bold text-amber-950 dark:text-[#FFE485]">
            {isVi ? 'Khung định vị bài toán DA → BA' : 'DA → BA Framing Tree'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl border border-[#C8EEF7] dark:border-slate-800 bg-[#F0F9FB]/60 dark:bg-slate-950/60 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                {isVi ? 'Nhánh 1 · Livestream' : 'Branch 1 · Livestream'}
              </span>
              <span className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">10,47 tỷ đ</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {isVi
                ? 'Công thức: Giờ live × GMV/giờ · Nội bộ chiếm 84,5% (8,85 tỷ), KOC ngoài 15,5% (1,62 tỷ).'
                : 'Driver: Live Hours × GMV/hr · In-house 84.5% (8.85B), external KOCs 15.5% (1.62B).'}
            </p>
            <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-500/10 rounded-md px-2 py-1">
              {isVi
                ? 'Nút thắt: Ca >10h tụt 8,48 → 0,73 Tr/h (T6→T8); 94/145 KOC 3 phiên 0đ không ra đơn.'
                : 'Bottleneck: >10h shifts fell 8.48 → 0.73M/hr (Jun→Aug); 94/145 zero-start KOCs never convert.'}
            </p>
          </div>

          <div className="rounded-xl border border-[#C8EEF7] dark:border-slate-800 bg-[#F0F9FB]/60 dark:bg-slate-950/60 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                {isVi ? 'Nhánh 2 · Short Video' : 'Branch 2 · Short Video'}
              </span>
              <span className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">2,20 tỷ đ</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {isVi
                ? 'Công thức: Số clip × Lượt xem × GPM · KOC ngoài dẫn 58,4% (1,28 tỷ), Nội bộ 41,6%.'
                : 'Driver: Clips × Views × GPM · External KOCs lead 58.4% (1.28B), in-house 41.6%.'}
            </p>
            <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-500/10 rounded-md px-2 py-1">
              {isVi
                ? 'Nút thắt: Video Ads có GPM bằng 0,84× Organic (0,73× trong cùng 192 KOC) do thiếu cổng lọc.'
                : 'Bottleneck: Video Ads GPM is 0.84x Organic (0.73x within 192 dual KOCs) without boost gating.'}
            </p>
          </div>

          <div className="rounded-xl border border-[#C8EEF7] dark:border-slate-800 bg-[#F0F9FB]/60 dark:bg-slate-950/60 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                {isVi ? 'Nhánh 3 · Danh mục & Mùa vụ' : 'Branch 3 · Assortment & Season'}
              </span>
              <span className="font-extrabold text-[#074553] dark:text-[#9BE7FA]">
                {isVi ? '12/133 link = 80,6%' : '12/133 listings = 80.6%'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {isVi
                ? 'Dải ASP thực bán 75k–250k chiếm 95,4% GMV; 206/339 link (60,8%) phát sinh 0đ trong 90 ngày.'
                : 'Realized ASP 75k–250k band = 95.4% GMV; 206/339 listings (60.8%) had zero sales in 90 days.'}
            </p>
            <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-500/10 rounded-md px-2 py-1">
              {isVi
                ? 'Nút thắt: 6 mã đồ bơi rơi -89,3% T6→T8; AT06 lên kệ trễ ~1 tháng và chiếm 80,5% T10.'
                : 'Bottleneck: 6 swimwear SKUs fell -89.3% Jun→Aug; AT06 launched ~1m late and hit 80.5% of Oct.'}
            </p>
          </div>
        </div>
      </div>

      {/* Biểu đồ 1: Xu hướng GMV tháng & Vùng trũng tháng 8 (Combo Chart: Bar = Monthly GMV | Line = Daily Mean GMV) */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center rounded-md bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 px-2.5 py-0.5 text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                {isVi ? 'Biểu đồ 1 · Cột = Tổng GMV tháng | Đường = GMV bình quân/ngày' : 'Chart 1 · Bars = Monthly GMV | Line = Daily Average GMV'}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                {isVi ? 'Hiệu chỉnh tháng thiếu ngày: T3 (23 ngày) & T10 (25 ngày)' : 'Adjusted for partial months: Mar (23d) & Oct (25d)'}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isVi
                ? 'Doanh thu T8 rơi -83,1% so với đỉnh T6 trước khi hồi phục lên 1,62 tỷ ở T10 (25 ngày)'
                : 'August GMV Fell -83.1% from June Peak Before Rebounding to 1.62B in Oct (25d)'}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label={isVi ? 'Chọn độ phân giải thời gian' : 'Select time granularity'}
              className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/70 p-1"
            >
              {(
                [
                  { id: 'month', labelVi: 'Theo tháng (Cột + TB/ngày)', labelEn: 'Monthly (Bar + Daily Avg)' },
                  { id: 'week', labelVi: 'Theo tuần (33 tuần)', labelEn: 'Weekly (33w)' },
                  { id: 'day', labelVi: 'Theo ngày (231 ngày)', labelEn: 'Daily (231d)' },
                ] as const
              ).map((tab) => {
                const active = granularity === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setGranularity(tab.id)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#9BE7FA] text-slate-950'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isVi ? tab.labelVi : tab.labelEn}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3 Direct Milestone Callouts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 text-xs tabular-nums">
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-3.5 py-2.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                {isVi ? 'Đỉnh Hè (Tháng 6 · 30 ngày)' : 'Summer Peak (June · 30d)'}
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {isVi ? '3,77 tỷ · 125,7 triệu/ngày' : '3.77B · 125.7M/day'}
              </p>
            </div>
            <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-bold text-emerald-700 dark:text-emerald-300">
              +41,8%
            </span>
          </div>

          <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 px-3.5 py-2.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                {isVi ? 'Đáy giao mùa (Tháng 8 · 31 ngày)' : 'Seasonal Trough (August · 31d)'}
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {isVi ? '0,64 tỷ · 20,5 triệu/ngày' : '0.64B · 20.5M/day'}
              </p>
            </div>
            <span className="rounded-md bg-rose-500/15 px-2 py-0.5 font-bold text-rose-700 dark:text-rose-300">
              {isVi ? '-83,1% (-83,7%/ngày)' : '-83.1% (-83.7%/d)'}
            </span>
          </div>

          <div className="rounded-xl border border-[#0D7287]/30 bg-[#C8EEF7]/20 dark:bg-[#9BE7FA]/10 px-3.5 py-2.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                {isVi ? 'Bật lại Thu Đông (Tháng 10 · 25 ngày)' : 'Autumn Rebound (Oct · 25d)'}
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {isVi ? '1,62 tỷ · 64,7 triệu/ngày' : '1.62B · 64.7M/day'}
              </p>
            </div>
            <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-bold text-emerald-700 dark:text-emerald-300">
              {isVi ? '+214,9% vs T8' : '+214.9% vs Aug'}
            </span>
          </div>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {granularity === 'month' ? (
              <ComposedChart data={monthlyComboData} margin={{ top: 14, right: 20, left: 4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                <XAxis
                  dataKey="axisLabel"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `${v}B`}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 4.2]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#d97706' }}
                  tickFormatter={(v) => `${v}M/d`}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 140]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3.5 text-xs tabular-nums">
                        <p className="font-bold text-slate-900 dark:text-white mb-1">
                          {isVi ? `Tháng ${d.month} (${d.days} ngày)` : `Month ${d.month} (${d.days} days)`}
                          {d.isPartial ? (isVi ? ' · Tháng chưa đủ 30 ngày' : ' · Partial month') : ''}
                        </p>
                        <div className="space-y-1 text-slate-600 dark:text-slate-300">
                          <p>
                            {isVi ? 'Tổng GMV tháng (Cột): ' : 'Monthly Total GMV (Bar): '}
                            <strong className="text-slate-900 dark:text-white">
                              {d.storeGmvB.toFixed(2).replace('.', ',')} {isVi ? 'tỷ VNĐ' : 'B VND'} ({d.storeGmvM}M)
                            </strong>
                          </p>
                          <p>
                            {isVi ? 'GMV bình quân/ngày (Đường): ' : 'Daily Average GMV (Line): '}
                            <strong className="text-amber-600 dark:text-amber-400">
                              {d.dailyAvgM.toFixed(1).replace('.', ',')} {isVi ? 'triệu/ngày' : 'M/day'}
                            </strong>
                          </p>
                          <p>
                            {isVi ? 'Sản lượng bán: ' : 'Units sold: '}
                            <strong>{(d.units ?? 0).toLocaleString(isVi ? 'vi-VN' : 'en-US')} sp</strong>
                          </p>
                          <p className="text-[11px] font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                            {d.momNote}
                          </p>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="storeGmvB"
                  name={isVi ? 'Tổng GMV tháng (Tỷ VNĐ)' : 'Monthly Total GMV (B VND)'}
                  fill="#9BE7FA"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={46}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="dailyAvgM"
                  name={isVi ? 'GMV bình quân/ngày (Triệu/ngày)' : 'Daily Avg GMV (M/day)'}
                  stroke="#D97706"
                  strokeWidth={2.75}
                  dot={{ r: 4.5, fill: '#FFD14C', stroke: '#D97706', strokeWidth: 2 }}
                />
              </ComposedChart>
            ) : granularity === 'week' ? (
              <ComposedChart data={V2.ch3.weekly} margin={{ top: 14, right: 16, left: 4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={2}
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
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3.5 text-xs tabular-nums">
                        <p className="font-bold text-slate-900 dark:text-white mb-1">
                          {d.week} ({isVi ? `Tuần ${d.ddmm} · ${d.days} ngày` : `Week of ${d.ddmm} · ${d.days}d`})
                        </p>
                        <div className="space-y-1 text-slate-600 dark:text-slate-300">
                          <p>
                            {isVi ? 'Tổng GMV tuần: ' : 'Weekly GMV: '}
                            <strong className="text-slate-900 dark:text-white">{d.storeGmvM}M đ</strong>
                          </p>
                          <p>
                            {isVi ? 'Trung bình ngày: ' : 'Daily average: '}
                            <strong>{d.dailyAvgM}M đ/ngày</strong>
                          </p>
                          <p>
                            {isVi ? 'Sản lượng: ' : 'Units sold: '}
                            <strong>{(d.units ?? 0).toLocaleString(isVi ? 'vi-VN' : 'en-US')} sp</strong>
                          </p>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="storeGmvM"
                  name={isVi ? 'GMV tuần (Triệu đ)' : 'Weekly GMV (M VND)'}
                  fill="#9BE7FA"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="dailyAvgM"
                  name={isVi ? 'TB ngày trong tuần (Triệu đ)' : 'Daily Mean in Week (M VND)'}
                  stroke="#D97706"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#FFD14C' }}
                />
              </ComposedChart>
            ) : (
              <ComposedChart data={V2.ch0.dailySeries} margin={{ top: 14, right: 16, left: 4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                <XAxis
                  dataKey="ddmm"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={18}
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
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3.5 text-xs tabular-nums">
                        <p className="font-bold text-slate-900 dark:text-white mb-1.5">
                          {isVi ? `Ngày ${d.ddmm}/2026` : `Date ${d.date}`}
                        </p>
                        <div className="space-y-1 text-slate-600 dark:text-slate-300">
                          <p>
                            {isVi ? 'Doanh thu ngày: ' : 'Daily GMV: '}
                            <strong className="text-slate-900 dark:text-white">{d.gmvM}M đ</strong>
                          </p>
                          {d.ma7M !== null && (
                            <p>
                              MA7: <strong className="text-[#0D7287] dark:text-[#9BE7FA]">{d.ma7M}M đ</strong>
                            </p>
                          )}
                          {d.ma28M !== null && (
                            <p>
                              MA28: <strong className="text-amber-600 dark:text-amber-400">{d.ma28M}M đ</strong>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x="16/06" stroke="#059669" strokeDasharray="3 3" />
                <Bar
                  dataKey="gmvM"
                  name={isVi ? 'GMV ngày (Triệu đ)' : 'Daily GMV (M VND)'}
                  fill="#C8EEF7"
                  opacity={0.75}
                  radius={[2, 2, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="ma7M"
                  name="MA7 (7d)"
                  stroke="#0D7287"
                  strokeWidth={2.2}
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="ma28M"
                  name="MA28 (28d)"
                  stroke="#FFD14C"
                  strokeWidth={2.4}
                  dot={false}
                  connectNulls={false}
                />
                <ReferenceDot x="16/06" y={315.0} r={5} fill="#059669" stroke="#ffffff" strokeWidth={1.5} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
