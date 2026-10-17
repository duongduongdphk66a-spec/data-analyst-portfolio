'use client';

import React from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  COLORS, categoryMatch, outlierDays, robustZ, sqlSnippets, storeFacts, treatmentComparison, zScoreSeries,
} from '../playbookData';
import { ChartCard, ChartTooltip, Chip, GRID_STROKE, StageSection, axisTick, legendFormatter, usePlaybookLang } from '../PlaybookUi';

export default function Stage6Anomalies() {
  const { L, b, n } = usePlaybookLang();

  const tickEvery = Math.floor(zScoreSeries.length / 6);
  const raw = treatmentComparison[0];
  const dropped = treatmentComparison[1];
  const stdDropPct = ((raw.std - dropped.std) / raw.std) * 100;
  const meanDropPct = ((raw.mean - dropped.mean) / raw.mean) * 100;
  const peakZ = Math.max(...zScoreSeries.map((d) => d.z));
  const outlierList = outlierDays.map((d) => `${d.label} (z = ${n(d.z, 2)})`).join(', ');

  const donut = [
    { name: 'Swimwear', value: categoryMatch.swimwearGmvPct },
    { name: L('Còn lại', 'Others'), value: categoryMatch.otherGmvPct },
  ];

  return (
    <StageSection
      stage={6}
      takeaway={
        outlierDays.length > 0
          ? L(
              `${outlierDays.length}/${storeFacts.days} ngày vượt |z| > 3: ${outlierList}.`,
              `${outlierDays.length} of ${storeFacts.days} days exceed |z| > 3: ${outlierList}.`,
            )
          : L('Không có ngày nào vượt |z| > 3.', 'No day exceeds |z| > 3.')
      }
      kpis={[
        { value: `z = ${n(peakZ, 2)}`, label: L('ngày cao nhất', 'highest day'), tone: 'amber' },
        { value: `${n(robustZ(storeFacts.peakDay.gmv), 2)}`, label: L('robust z (median và MAD)', 'robust z (median and MAD)') },
        { value: `-${n(stdDropPct, 1)}%`, label: L('độ lệch chuẩn khi loại outlier', 'standard deviation without the outlier') },
      ]}
      sql={sqlSnippets.s6}
    >
      <ChartCard
        className="lg:col-span-2"
        title={L('Z-score GMV theo ngày, ngưỡng |z| = 3', 'Daily GMV z-score, threshold |z| = 3')}
        height="h-72"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={zScoreSeries} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" interval={tickEvery} tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} domain={[-3, 6]} ticks={[-3, 0, 3, 6]} />
            <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => n(v, 2)} />} />
            <ReferenceLine y={3} stroke={COLORS.alert} strokeDasharray="5 4" />
            <ReferenceLine y={-3} stroke={COLORS.alert} strokeDasharray="5 4" />
            <Bar dataKey="z" name="z" radius={[2, 2, 0, 0]}>
              {zScoreSeries.map((d) => (
                <Cell key={d.date} fill={d.isOutlier ? COLORS.alert : COLORS.cyan} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title={L('Bốn cách xử lý outlier: trung bình và độ lệch chuẩn (triệu đ)', 'Four outlier treatments: mean and standard deviation (M VND)')}
        badge={<Chip tone="amber">{`${L('Trung bình', 'Mean')} -${n(meanDropPct, 1)}%`}</Chip>}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={treatmentComparison.map((t) => ({ ...t, name: b(t.label) }))}
            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
          >
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={<ChartTooltip fmt={(v) => `${n(v, 1)} ${L('Tr', 'M')}`} />}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
            <Bar dataKey="meanM" name={L('Trung bình', 'Mean')} fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
            <Bar dataKey="stdM" name={L('Độ lệch chuẩn', 'Std. dev.')} fill={COLORS.amber} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title={L("Khớp mẫu category ILIKE '%swimwear%': tỷ trọng GMV 90 ngày (%)", "Category ILIKE '%swimwear%': share of 90-day GMV (%)")}
      >
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<ChartTooltip fmt={(v) => `${n(v, 2)}%`} />} />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
              <Pie data={donut} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={3} stroke="none">
                <Cell fill={COLORS.amber} />
                <Cell fill={COLORS.cyan} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-8">
            <span className="text-2xl font-black tabular-nums text-slate-950 dark:text-white">
              {n(categoryMatch.swimwearGmvPct, 1)}%
            </span>
          </div>
        </div>
      </ChartCard>
    </StageSection>
  );
}
