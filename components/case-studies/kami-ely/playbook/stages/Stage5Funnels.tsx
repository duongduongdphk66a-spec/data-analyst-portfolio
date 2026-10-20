'use client';

import React from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, ComposedChart, Label, LabelList, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  COLORS, donutFunnels, funnelFacts, funnels, gpmCompare, liveDuration, sqlSnippets, type FunnelKey,
} from '../playbookData';
import { ChartCard, ChartTooltip, Chip, GRID_STROKE, StageSection, TEXT_FILL_CLASS, axisTick, legendFormatter, usePlaybookLang } from '../PlaybookUi';

const FUNNEL_KEYS: FunnelKey[] = ['video', 'live', 'sku', 'creator'];
const STEP_COLORS = [COLORS.cyan, COLORS.butter, COLORS.amber] as const;

export default function Stage5Funnels() {
  const { L, b, n } = usePlaybookLang();

  const gpm = [
    {
      title: L('Nền tảng báo cáo (28 ngày)', 'Platform reported (28 days)'),
      data: [
        { name: 'Video', v: gpmCompare.platform28d.videoK },
        { name: 'LIVE', v: gpmCompare.platform28d.liveK },
      ],
    },
    {
      title: L('Tính lại từ dữ liệu 180 ngày (trung vị)', 'Recomputed from 180 days (median)'),
      data: [
        { name: 'Video', v: gpmCompare.recomputed180d.videoK },
        { name: 'LIVE', v: gpmCompare.recomputed180d.liveK },
      ],
    },
  ];

  return (
    <StageSection
      stage={5}
      takeaway={L(
        `${n(funnelFacts.liveConvPct, 1)}% phiên LIVE có đơn, ${n(funnelFacts.videoConvPct, 1)}% video có đơn.`,
        `${n(funnelFacts.liveConvPct, 1)}% of LIVE sessions have orders, ${n(funnelFacts.videoConvPct, 1)}% of videos do.`,
      )}
      kpis={[
        { value: `${n(funnelFacts.liveConvPct, 2)}%`, label: L('phiên LIVE có đơn', 'LIVE sessions with orders') },
        { value: `${n(funnelFacts.videoConvPct, 1)}%`, label: L('video có đơn', 'videos with orders') },
        { value: `ρ = ${n(funnelFacts.spearmanRho, 3)}`, label: L('thời lượng LIVE và GMV (Spearman)', 'LIVE duration vs GMV (Spearman)'), tone: 'amber' },
      ]}
      sql={sqlSnippets.s5}
    >
      {FUNNEL_KEYS.map((k) => {
        const item = donutFunnels[k];
        return (
          <ChartCard
            key={k}
            title={b(item.title)}
            subtitle={b(item.subtitle)}
            badge={<Chip tone={item.tone}>{b(item.badge)}</Chip>}
            height=""
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-1">
              {/* Donut Chart with center metric */}
              <div className="relative w-40 h-40 sm:w-44 sm:h-44 shrink-0 flex items-center justify-center mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      content={
                        <ChartTooltip
                          fmt={(v) => `${n(Number(v))} (${n((Number(v) / item.total) * 100, 1)}%)`}
                        />
                      }
                    />
                    <Pie
                      data={item.segments.map((s) => ({ ...s, name: b(s.name) }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={66}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {item.segments.map((seg, idx) => (
                        <Cell key={`cell-${idx}`} fill={seg.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                    {item.centerVal}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {b(item.centerLabel)}
                  </span>
                </div>
              </div>

              {/* Structured Breakdown List */}
              <div className="flex-1 w-full space-y-2.5">
                {item.segments.map((seg, idx) => {
                  const pct = n((seg.value / item.total) * 100, 1);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 text-xs rounded-lg p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: seg.color }}
                        />
                        <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                          {b(seg.name)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 tabular-nums">
                        <span className="font-semibold text-slate-900 dark:text-white">{n(seg.value)}</span>
                        <Chip tone={idx === 0 ? 'teal' : idx === 1 ? 'cyan' : 'amber'}>
                          {pct}%
                        </Chip>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ChartCard>
        );
      })}

      <ChartCard
        title={L('GPM video và LIVE: hai nguồn, hai kết quả (nghìn đ)', 'Video vs LIVE GPM: two sources, two results (K VND)')}
        height=""
      >
        <div className="grid grid-cols-2 gap-3">
          {gpm.map((g) => (
            <div key={g.title} className="min-w-0">
              <div className="mb-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">{g.title}</div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={g.data} margin={{ top: 20, right: 4, left: 4, bottom: 0 }}>
                    <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 1)}k`} />} />
                    <Bar dataKey="v" name="GPM" radius={[6, 6, 0, 0]}>
                      {g.data.map((d) => (
                        <Cell key={d.name} fill={d.name === 'Video' ? COLORS.cyan : COLORS.amber} />
                      ))}
                      <LabelList dataKey="v" position="top" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => `${n(Number(v), 1)}k`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip tone={gpmCompare.isSignificant ? 'cyan' : 'amber'}>
            {L('Mann-Whitney một phía', 'One-sided Mann-Whitney')}: p = {n(gpmCompare.mannWhitneyP, 1)}
          </Chip>
          <Chip>{L('Rank-biserial', 'Rank-biserial')} {n(gpmCompare.rankBiserial, 3)}</Chip>
          <Chip tone="amber">{L('Dữ liệu quan sát, không phải A/B ngẫu nhiên', 'Observational data, not a randomized A/B test')}</Chip>
        </div>
      </ChartCard>

      <ChartCard
        className="lg:col-span-2"
        title={L('LIVE: tỷ lệ có đơn (%) và GMV mỗi giờ (triệu đ) theo thời lượng', 'LIVE: share with orders (%) and GMV per hour (M VND) by duration')}
        height="h-72"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={liveDuration} margin={{ top: 22, right: 8, left: -4, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="bucket" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis yAxisId="pct" domain={[0, 100]} tick={axisTick} tickLine={false} axisLine={false} width={34}>
              <Label value="(%)" position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
            </YAxis>
            <YAxis yAxisId="gph" orientation="right" tick={axisTick} tickLine={false} axisLine={false} width={38}>
              <Label value={L('(Tr đ)', '(M VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
            </YAxis>
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={
                <ChartTooltip
                  fmt={(v, name) => (name.includes('%') ? `${n(v, 1)}%` : `${n(v, 2)} ${L('Tr/giờ', 'M/hour')}`)}
                  head={(l) => `${l} · ${n(liveDuration.find((d) => d.bucket === l)?.sessions ?? 0)} ${L('phiên', 'sessions')}`}
                />
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
            <Bar yAxisId="pct" dataKey="conversionPct" name={L('Có đơn (%)', 'With orders (%)')} fill={COLORS.cyan} radius={[6, 6, 0, 0]} />
            <Line yAxisId="gph" dataKey="gmvPerHourM" name={L('GMV mỗi giờ', 'GMV per hour')} stroke={COLORS.deep} strokeWidth={2.5} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </StageSection>
  );
}
