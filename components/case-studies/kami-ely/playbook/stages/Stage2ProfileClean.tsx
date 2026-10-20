'use client';

import React from 'react';
import { BadgeCheck, Scale, ShieldAlert } from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Label, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  COLORS, paretoCurve, priceBands, productFacts, reconciliationChecks, skuHealthByCategory, sqlSnippets,
} from '../playbookData';
import { ChartCard, ChartTooltip, GRID_STROKE, StageSection, TEXT_FILL_CLASS, axisTick, legendFormatter, usePlaybookLang } from '../PlaybookUi';

const STATUS_VIEW = {
  VERIFIED_EXACT: {
    icon: BadgeCheck,
    cls: 'border-[#9BE7FA] bg-[#C8EEF7]/40 text-[#074553] dark:border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/10 dark:text-[#9BE7FA]',
    vi: 'Khớp tuyệt đối',
    en: 'Exact match',
  },
  GROSS_VS_NET: {
    icon: Scale,
    cls: 'border-[#FFD14C] bg-[#FFE485]/30 text-amber-900 dark:border-[#FFD14C]/40 dark:bg-[#FFD14C]/10 dark:text-[#FFE485]',
    vi: 'Gross và net',
    en: 'Gross vs net',
  },
  WINDOW_SYNCED: {
    icon: ShieldAlert,
    cls: 'border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200',
    vi: 'Đồng bộ khung ngày',
    en: 'Window synced',
  },
} as const;

export default function Stage2ProfileClean() {
  const { L, b, n } = usePlaybookLang();

  return (
    <StageSection
      stage={2}
      takeaway={L(
        `${n(productFacts.deadPct, 1)}% SKU chưa có đơn. ${productFacts.skusFor80} SKU tạo 80% GMV.`,
        `${n(productFacts.deadPct, 1)}% of SKUs have no orders. ${productFacts.skusFor80} SKUs make 80% of GMV.`,
      )}
      kpis={[
        { value: n(productFacts.skus), label: L('SKU niêm yết (90 ngày)', 'listed SKUs (90 days)') },
        { value: n(productFacts.dead), label: L('SKU chưa có đơn', 'SKUs without orders'), tone: 'amber' },
        { value: n(productFacts.gini, 3), label: L('Gini của GMV theo SKU', 'Gini of GMV across SKUs') },
      ]}
      sql={sqlSnippets.s2}
    >
      <ChartCard title={L('Nhóm giá: tỷ trọng SKU, sản lượng, GMV (%)', 'Price band: share of SKUs, units, GMV (%)')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priceBands} margin={{ top: 22, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="band" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} width={34}>
              <Label value="(%)" position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
            </YAxis>
            <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => `${n(v, 2)}%`} />} />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
            <Bar dataKey="sku" name="SKU" fill={COLORS.teal} radius={[4, 4, 0, 0]} />
            <Bar dataKey="units" name={L('Sản lượng', 'Units')} fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
            <Bar dataKey="gmv" name="GMV" fill={COLORS.amber} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={L('Đường Pareto: % & Số lượng SKU vs % GMV tích lũy', 'Pareto curve: cumulative % & count of SKUs vs % GMV')}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={paretoCurve} margin={{ top: 22, right: 12, left: -18, bottom: 18 }}>
            <defs>
              <linearGradient id="pbPareto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="sku"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              interval={0}
              tickLine={false}
              axisLine={false}
              tick={(props: { x?: number; y?: number; payload?: { value?: number | string } }) => {
                const { x = 0, y = 0, payload } = props;
                const v = Number(payload?.value ?? 0);
                const skuCount = Math.round((v * productFacts.skus) / 100);
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} textAnchor="middle" fontSize={11} className={TEXT_FILL_CLASS}>
                      <tspan x={0} dy={12}>{v}%</tspan>
                      <tspan x={0} dy={14} fontSize={10} className="fill-slate-500 dark:fill-slate-400">({skuCount} SKU)</tspan>
                    </text>
                  </g>
                );
              }}
            />
            <YAxis domain={[0, 100]} tick={axisTick} tickLine={false} axisLine={false} width={34}>
              <Label value="(%)" position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
            </YAxis>
            <Tooltip
              content={
                <ChartTooltip
                  fmt={(v) => `${n(v, 1)}%`}
                  head={(l) => {
                    const pct = Number(l);
                    const skus = Math.round((pct * productFacts.skus) / 100);
                    return `${n(pct, 1)}% SKU (${skus}/${productFacts.skus} SKU)`;
                  }}
                />
              }
            />
            <ReferenceLine y={80} stroke={COLORS.amber} strokeDasharray="5 4" label={{ value: '80% GMV', position: 'insideBottomRight', fontSize: 11, className: TEXT_FILL_CLASS }} />
            <ReferenceLine
              x={productFacts.skusFor80Pct}
              stroke={COLORS.teal}
              strokeDasharray="5 4"
              label={{ value: `${n(productFacts.skusFor80Pct, 1)}% (${productFacts.skusFor80} SKU)`, position: 'top', fontSize: 11, className: TEXT_FILL_CLASS }}
            />
            <Area type="monotone" dataKey="gmv" name={L('GMV tích lũy', 'Cumulative GMV')} stroke={COLORS.teal} strokeWidth={2.5} fill="url(#pbPareto)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={L('SKU có đơn và chưa có đơn theo ngành hàng', 'SKUs with and without orders by category')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={skuHealthByCategory} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="category" width={96} tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: 'rgba(155,231,250,0.15)' }} content={<ChartTooltip fmt={(v) => n(v)} />} />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={legendFormatter} />
            <Bar dataKey="withSales" stackId="a" name={L('Có đơn', 'With orders')} fill={COLORS.cyan} />
            <Bar dataKey="dead" stackId="a" name={L('Chưa có đơn', 'No orders')} fill={COLORS.amber} radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={L('6 quy tắc đối soát', '6 reconciliation rules')} height="">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {reconciliationChecks.map((r) => {
            const v = STATUS_VIEW[r.status];
            const Icon = v.icon;
            return (
              <li
                key={r.code}
                title={b(r.title)}
                className={`flex min-h-11 flex-col gap-1 rounded-2xl border px-3 py-2 ${v.cls}`}
              >
                <span className="flex items-center gap-1.5 text-xs font-black">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {r.code}
                </span>
                <span className="text-xs">{L(v.vi, v.en)}</span>
              </li>
            );
          })}
        </ul>
      </ChartCard>
    </StageSection>
  );
}
