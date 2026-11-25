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
      {/* Single Concise 60-Second Executive Summary Strip */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-[#C8EEF7]/15 dark:bg-slate-900/70 p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {isVi ? 'Tóm tắt 60 giây · 3 phát hiện cốt lõi' : '60-Second Summary · 3 Core Findings'}
          </h2>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
            {isVi
              ? '231 ngày (09/03 – 25/10/2026) · 15,01 tỷ · 101.896 sp'
              : '231 days (Mar 09 – Oct 25, 2026) · 15.01B · 101,896 units'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-4">
            <p className="font-bold text-slate-900 dark:text-white mb-1">
              {isVi ? '1. Vùng trũng T8 (-83,1% GMV tháng)' : '1. August Trough (-83.1% Monthly GMV)'}
            </p>
            <p className="tabular-nums text-xs sm:text-sm">
              {isVi
                ? 'GMV rơi từ 3,77 tỷ (T6) xuống 0,64 tỷ (T8, -83,7% TB/ngày) vì đồ bơi thoái trào trong khi 2 mã Thu Đông (AT06, AG01) lên kệ trễ gần 1 tháng.'
                : 'GMV fell from 3.77B (Jun) to 0.64B (Aug, -83.7% daily avg) as swimwear faded while autumn heroes (AT06, AG01) launched nearly 1 month late.'}
            </p>
          </div>
          <div className="rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-4">
            <p className="font-bold text-slate-900 dark:text-white mb-1">
              {isVi ? '2. Lệch kênh: Live Nội bộ vs. Video KOC' : '2. Channel Split: In-House Live vs. KOC Video'}
            </p>
            <p className="tabular-nums text-xs sm:text-sm">
              {isVi
                ? 'Livestream (70,5% GMV tại mốc 20/10) phụ thuộc 84,5% vào 2 kênh nội bộ (@shop_official, @koc_sat01). Ngược lại, KOC ngoài tạo 58,4% doanh thu Video ngắn.'
                : 'Livestream (70.5% GMV at Oct 20 cutoff) relies 84.5% on 2 in-house rooms (@shop_official, @koc_sat01), whereas external KOCs drive 58.4% of Short Video.'}
            </p>
          </div>
          <div className="rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-4">
            <p className="font-bold text-slate-900 dark:text-white mb-1">
              {isVi ? '3. Đòn bẩy Mega-Live & Rủi ro đơn mã AT06' : '3. Mega-Live Leverage & AT06 Risk'}
            </p>
            <p className="tabular-nums text-xs sm:text-sm">
              {isVi
                ? '67 ca live >10h đạt 4,55 Tr/giờ (4,1× ca <2h); Video bật Ads đạt 547,6k/clip (4,4× không Ads). T10 hồi phục nhưng riêng AT06 chiếm 80,5% GMV.'
                : '67 >10h mega-lives yielded 4.55M/hr (4.1x <2h); Ad-auth videos hit 547.6k/clip (4.4x organic). Oct rebounded, but AT06 alone drove 80.5% of GMV.'}
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
                ? 'Xu hướng GMV 8 tháng & Vùng trũng giao mùa Tháng 8'
                : '8-Month GMV Trajectory & The August Seasonal Trough'}
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
