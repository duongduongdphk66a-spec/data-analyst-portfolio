'use client';

import React, { useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, ReferenceDot, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import { COLORS, dailySeries, dowSeries, monthlySeries, sqlSnippets, storeFacts } from '../playbookData';
import { ChartCard, ChartTooltip, GRID_STROKE, StageSection, axisTick, legendFormatter, usePlaybookLang } from '../PlaybookUi';

type DailyView = 'daily' | 'cumulative';

export default function Stage3TimeSeries() {
  const { L, n } = usePlaybookLang();
  const [view, setView] = useState<DailyView>('daily');

  const peak = dailySeries.find((d) => d.date === storeFacts.peakDay.date);
  const maxDow = Math.max(...dowSeries.map((d) => d.medianGmv));
  const tickEvery = Math.floor(dailySeries.length / 6);

  const toggle = (
    <div className="flex rounded-xl bg-[#C8EEF7]/40 p-1 dark:bg-slate-800" role="group" aria-label={L('Chế độ xem', 'View mode')}>
      {(['daily', 'cumulative'] as const).map((k) => (
        <button
          key={k}
          type="button"
          aria-pressed={view === k}
          onClick={() => setView(k)}
          className={`min-h-11 min-w-11 cursor-pointer rounded-lg px-3 text-xs font-bold transition-colors duration-200 ${
            view === k ? 'bg-[#9BE7FA] text-slate-950' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {k === 'daily' ? L('Theo ngày', 'Daily') : L('Lũy kế', 'Cumulative')}
        </button>
      ))}
    </div>
  );

  return (
    <StageSection
      stage={3}
      takeaway={L(
        `Đỉnh tháng 6 (${n(storeFacts.peakMonth.gmv / 1e9, 2)} Tỉ), tháng 8 giảm ${n(storeFacts.dropFromPeakPct, 1)}% so với đỉnh.`,
        `Peak in June (${n(storeFacts.peakMonth.gmv / 1e9, 2)}B VND), August is down ${n(storeFacts.dropFromPeakPct, 1)}% from the peak.`,
      )}
      kpis={[
        { value: `${n(storeFacts.gmv / 1e9, 2)} ${L('Tỉ', 'B')}`, label: L('GMV 180 ngày', 'GMV, 180 days') },
        { value: `${n(storeFacts.avgPerDay / 1e6, 1)} ${L('Tr', 'M')}`, label: L('GMV trung bình mỗi ngày', 'average GMV per day') },
        { value: `${storeFacts.sparseDays}/${storeFacts.days}`, label: L('ngày thưa (không có GMV)', 'sparse days (no GMV)'), tone: 'amber' },
      ]}
      sql={sqlSnippets.s3}
    >
      <ChartCard
        className="lg:col-span-2"
        title={
          view === 'daily'
            ? L('GMV theo ngày và trung bình trượt 7 ngày (triệu đ)', 'Daily GMV and 7-day moving average (M VND)')
            : L('GMV lũy kế từ đầu khung 180 ngày (tỉ đ)', 'Cumulative GMV since the start of the 180-day window (B VND)')
        }
        badge={toggle}
        height="h-72"
      >
        <ResponsiveContainer width="100%" height="100%">
          {view === 'daily' ? (
            <ComposedChart data={dailySeries} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" interval={tickEvery} tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(155,231,250,0.15)' }}
                content={<ChartTooltip fmt={(v) => `${n(v, 1)} ${L('Tr', 'M')}`} />}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
              <Bar dataKey="gmv" name="GMV" fill={COLORS.cyan} radius={[2, 2, 0, 0]} />
              <Line dataKey="ma7" name={L('Trung bình 7 ngày', '7-day average')} stroke={COLORS.deep} strokeWidth={2.5} dot={false} connectNulls={false} />
              {peak && <ReferenceDot x={peak.label} y={peak.gmv} r={6} fill={COLORS.amber} stroke={COLORS.deep} strokeWidth={2} />}
            </ComposedChart>
          ) : (
            <AreaChart data={dailySeries} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="pbCum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.amber} stopOpacity={0.7} />
                  <stop offset="95%" stopColor={COLORS.amber} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" interval={tickEvery} tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 2)} ${L('Tỉ', 'B')}`} />} />
              <Area type="monotone" dataKey="cumulativeB" name={L('GMV lũy kế', 'Cumulative GMV')} stroke={COLORS.deep} strokeWidth={2.5} fill="url(#pbCum)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={L('GMV mỗi ngày theo tháng (triệu đ) và % so với tháng trước', 'GMV per day by month (M VND) and % vs previous month')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySeries} margin={{ top: 22, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={<ChartTooltip fmt={(v) => `${n(v, 1)} ${L('Tr/ngày', 'M/day')}`} />}
            />
            <Bar
              dataKey="gmvPerDay"
              name="GMV"
              radius={[6, 6, 0, 0]}
              label={(p: { x?: number | string; y?: number | string; width?: number | string; index?: number }) => {
                const row = typeof p.index === 'number' ? monthlySeries[p.index] : undefined;
                if (!row || row.isPartial || row.momPerDayPct === null) return <g />;
                const x = Number(p.x);
                const y = Number(p.y);
                const w = Number(p.width);
                if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(w)) return <g />;
                const up = row.momPerDayPct >= 0;
                return (
                  <text
                    x={x + w / 2}
                    y={y - 6}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    className={up ? 'fill-[#0D7287] dark:fill-[#9BE7FA]' : 'fill-[#E11D48] dark:fill-rose-300'}
                  >
                    {`${up ? '+' : ''}${n(row.momPerDayPct, 0)}%`}
                  </text>
                );
              }}
            >
              {monthlySeries.map((m) => (
                <Cell key={m.month} fill={m.month === '2026-06' ? COLORS.amber : COLORS.cyan} fillOpacity={m.isPartial ? 0.45 : 1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={L('Mùa vụ theo thứ: GMV trung vị mỗi ngày (triệu đ)', 'Day-of-week seasonality: median daily GMV (M VND)')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dowSeries} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey={L('day', 'dayEn')} tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={<ChartTooltip fmt={(v) => `${n(v, 1)} ${L('Tr', 'M')}`} />}
            />
            <Bar dataKey="medianGmv" name={L('Trung vị', 'Median')} radius={[6, 6, 0, 0]}>
              {dowSeries.map((d) => (
                <Cell key={d.day} fill={d.medianGmv === maxDow ? COLORS.amber : COLORS.cyan} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </StageSection>
  );
}
