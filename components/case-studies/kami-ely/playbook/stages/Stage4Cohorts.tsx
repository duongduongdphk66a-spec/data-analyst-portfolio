'use client';

import React from 'react';
import {
  Bar, BarChart, CartesianGrid, ComposedChart, LabelList, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  COLORS, affiliateTop10, creatorFacts, creatorTiers, sqlSnippets, topCreatorMonthly,
} from '../playbookData';
import { ChartCard, ChartTooltip, GRID_STROKE, StageSection, TEXT_FILL_CLASS, axisTick, legendFormatter, usePlaybookLang } from '../PlaybookUi';

export default function Stage4Cohorts() {
  const { L, n } = usePlaybookLang();
  const first = creatorTiers[0];
  const last = creatorTiers[creatorTiers.length - 1];

  return (
    <StageSection
      stage={4}
      takeaway={L(
        `Follower càng nhiều, tỷ lệ kích hoạt càng cao: ${n(first.activationPct, 1)}% ở nhóm nhỏ nhất, ${n(last.activationPct, 1)}% ở nhóm lớn nhất.`,
        `More followers, higher activation: ${n(first.activationPct, 1)}% in the smallest tier, ${n(last.activationPct, 1)}% in the largest.`,
      )}
      kpis={[
        { value: n(creatorFacts.registered), label: L('creator trong cohort', 'creators in the cohort') },
        { value: `${n(creatorFacts.sellers)} (${n(creatorFacts.activationPct, 2)}%)`, label: L('creator có đơn', 'creators with orders'), tone: 'amber' },
        { value: `${n(creatorFacts.top1Pct, 1)}%`, label: L('GMV affiliate LIVE thuộc creator #1', 'affiliate LIVE GMV from creator #1') },
      ]}
      sql={sqlSnippets.s4}
    >
      <ChartCard title={L('Tỷ lệ kích hoạt theo nhóm follower (%)', 'Activation rate by follower tier (%)')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={creatorTiers} margin={{ top: 20, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="tier" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={<ChartTooltip fmt={(v) => `${n(v, 2)}%`} head={(l) => `${l} follower`} />}
            />
            <Bar dataKey="activationPct" name={L('Kích hoạt', 'Activation')} fill={COLORS.cyan} radius={[6, 6, 0, 0]}>
              <LabelList dataKey="activationPct" position="top" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => `${n(Number(v), 1)}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={L('Tỷ trọng GMV theo nhóm: có và không có creator #1 (%)', 'GMV share by tier: with and without creator #1 (%)')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={creatorTiers} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="tier" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={<ChartTooltip fmt={(v) => `${n(v, 2)}%`} head={(l) => `${l} follower`} />}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
            <Bar dataKey="gmvPct" name={L('Tất cả creator', 'All creators')} fill={COLORS.amber} radius={[4, 4, 0, 0]} />
            <Bar dataKey="gmvPctExTop1" name={L('Bỏ creator #1', 'Excluding creator #1')} fill={COLORS.teal} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={L('Top 10 affiliate LIVE: tỷ trọng và tích lũy (%)', 'Top 10 affiliate LIVE: share and cumulative (%)')}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={affiliateTop10} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="rank" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={<ChartTooltip fmt={(v) => `${n(v, 2)}%`} />}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
            <Bar dataKey="sharePct" name={L('Tỷ trọng', 'Share')} fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
            <Line dataKey="cumulativePct" name={L('Tích lũy', 'Cumulative')} stroke={COLORS.deep} strokeWidth={2.5} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={L('Vòng đời creator #1: GMV (triệu đ) và số phiên LIVE', 'Creator #1 lifecycle: GMV (M VND) and LIVE sessions')}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={topCreatorMonthly} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis yAxisId="gmv" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis yAxisId="ses" orientation="right" tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={<ChartTooltip fmt={(v, name) => (name === 'GMV' ? `${n(v, 1)} ${L('Tr', 'M')}` : n(v))} />}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
            <Bar yAxisId="gmv" dataKey="gmvM" name="GMV" fill={COLORS.amber} radius={[6, 6, 0, 0]} />
            <Line yAxisId="ses" dataKey="sessions" name={L('Phiên LIVE', 'LIVE sessions')} stroke={COLORS.deep} strokeWidth={2.5} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </StageSection>
  );
}
