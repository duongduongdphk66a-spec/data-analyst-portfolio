'use client';

import React, { useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, ComposedChart, LabelList, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  COLORS, funnelFacts, funnels, gpmCompare, liveDuration, sqlSnippets, type FunnelKey,
} from '../playbookData';
import { ChartCard, ChartTooltip, Chip, GRID_STROKE, StageSection, TEXT_FILL_CLASS, axisTick, legendFormatter, usePlaybookLang } from '../PlaybookUi';

const FUNNEL_KEYS: FunnelKey[] = ['creator', 'sku', 'video', 'live'];
const STEP_COLORS = [COLORS.cyan, COLORS.butter, COLORS.amber] as const;

export default function Stage5Funnels() {
  const { L, b, n } = usePlaybookLang();
  const [active, setActive] = useState<FunnelKey>('video');
  const funnel = funnels[active];
  const first = funnel.steps[0].value;

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
      <ChartCard
        title={L('Phễu theo đối tượng', 'Funnel by object')}
        height=""
        badge={
          <div className="flex flex-wrap justify-end gap-1" role="group" aria-label={L('Chọn phễu', 'Select funnel')}>
            {FUNNEL_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={active === k}
                onClick={() => setActive(k)}
                className={`min-h-11 min-w-11 cursor-pointer rounded-xl px-3 text-xs font-bold transition-colors duration-200 ${
                  active === k
                    ? 'bg-[#9BE7FA] text-slate-950'
                    : 'bg-[#C8EEF7]/40 text-slate-600 hover:bg-[#C8EEF7] dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {b(funnels[k].title)}
              </button>
            ))}
          </div>
        }
      >
        <ol className="space-y-4 pt-1">
          {funnel.steps.map((s, i) => {
            const width = Math.max((s.value / first) * 100, 3);
            const prev = i > 0 ? funnel.steps[i - 1].value : null;
            return (
              <li key={`${active}-${i}`}>
                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-100">{b(s.label)}</span>
                  <span className="flex items-center gap-2 tabular-nums text-slate-600 dark:text-slate-300">
                    {n(s.value)}
                    {prev !== null && <Chip tone="amber">{n((s.value / prev) * 100, 1)}%</Chip>}
                  </span>
                </div>
                <div className="h-8 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-8 rounded-xl transition-all duration-300"
                    style={{ width: `${width}%`, backgroundColor: STEP_COLORS[i] ?? COLORS.amber }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </ChartCard>

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
          <Chip tone={gpmCompare.isSignificant ? 'cyan' : 'rose'}>
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
          <ComposedChart data={liveDuration} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="bucket" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis yAxisId="pct" domain={[0, 100]} tick={axisTick} tickLine={false} axisLine={false} unit="%" />
            <YAxis yAxisId="gph" orientation="right" tick={axisTick} tickLine={false} axisLine={false} />
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
