'use client';

import React from 'react';
import { ArrowDown, ArrowRight, FileCode, FileJson, FileSpreadsheet, LayoutDashboard } from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, Cell, Label, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  COLORS, K_MIN, kAnonymity, modSampleFull, modSampleMaxDevPct, modSamples, pipelineMeta, sqlSnippets,
} from '../playbookData';
import { ChartCard, ChartTooltip, Chip, GRID_STROKE, StageSection, TEXT_FILL_CLASS, axisTick, usePlaybookLang } from '../PlaybookUi';

export default function Stage7EtlPii() {
  const { L, n } = usePlaybookLang();
  const minGroup = Math.min(...kAnonymity.map((k) => k.creators));
  const builtAt = pipelineMeta.generatedAt.replace('T', ' ').slice(0, 16);

  const nodes = [
    { icon: FileSpreadsheet, title: `${pipelineMeta.tables} xlsx`, sub: `${n(pipelineMeta.rows)} ${L('dòng', 'rows')}` },
    { icon: FileCode, title: pipelineMeta.generator.split('/').pop() ?? pipelineMeta.generator, sub: L('một lệnh, chạy lại được', 'one command, repeatable') },
    { icon: FileJson, title: 'metrics.json', sub: `${L('sinh lúc', 'built')} ${builtAt}` },
    { icon: LayoutDashboard, title: L('Biểu đồ trang này', 'Charts on this page'), sub: L('đọc trực tiếp từ JSON', 'read straight from JSON') },
  ];

  return (
    <StageSection
      stage={7}
      takeaway={L(
        `Một lệnh build sinh metrics.json. Nhóm nhỏ nhất có ${n(minGroup)} creator, vượt ngưỡng k = ${K_MIN}.`,
        `One build command produces metrics.json. The smallest group has ${n(minGroup)} creators, above the k = ${K_MIN} threshold.`,
      )}
      kpis={[
        { value: '0', label: L('bước chỉnh tay trong luồng', 'manual steps in the flow') },
        { value: n(minGroup), label: L(`creator ở nhóm nhỏ nhất (k ≥ ${K_MIN})`, `creators in the smallest group (k ≥ ${K_MIN})`) },
        { value: `±${n(modSampleMaxDevPct, 1)}%`, label: L('lệch tối đa của 10 mẫu mod 10', 'max deviation across 10 mod-10 samples'), tone: 'amber' },
      ]}
      sql={sqlSnippets.s7}
    >
      <ChartCard className="lg:col-span-2" title={L('Luồng ETL tự động', 'Automated ETL flow')} height="">
        <ol className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
          {nodes.map((node, i) => {
            const Icon = node.icon;
            return (
              <React.Fragment key={node.title}>
                <li className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#9BE7FA]/60 bg-[#C8EEF7]/30 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#9BE7FA] text-slate-950">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black text-slate-950 dark:text-white">{node.title}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">{node.sub}</div>
                  </div>
                </li>
                {i < nodes.length - 1 && (
                  <li aria-hidden="true" className="flex justify-center text-[#0D7287] dark:text-[#9BE7FA]">
                    <ArrowDown className="h-4 w-4 lg:hidden" />
                    <ArrowRight className="hidden h-4 w-4 lg:block" />
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip>{L('Không chỉnh tay trên bảng tính', 'No manual spreadsheet edits')}</Chip>
          <Chip>{L('Chỉ xuất dữ liệu tổng hợp', 'Aggregated output only')}</Chip>
        </div>
      </ChartCard>

      <ChartCard
        title={L(`Quy mô nhóm creator và ngưỡng k = ${K_MIN} (thang log)`, `Creator group size vs threshold k = ${K_MIN} (log scale)`)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={kAnonymity} margin={{ top: 12, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="tier" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis
              scale="log"
              domain={[1, 10000]}
              ticks={[1, 10, 100, 1000, 10000]}
              allowDataOverflow
              tick={axisTick}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={<ChartTooltip fmt={(v) => n(v)} />}
            />
            <ReferenceLine y={K_MIN} stroke={COLORS.alert} strokeDasharray="5 4" label={{ value: `k = ${K_MIN}`, position: 'insideTopRight', fontSize: 11, fill: COLORS.alert }} />
            <Bar dataKey="creators" name="Creator" radius={[6, 6, 0, 0]}>
              {kAnonymity.map((k) => (
                <Cell key={k.tier} fill={k.passes ? COLORS.cyan : COLORS.alert} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title={L('Lấy mẫu MOD(chỉ số ngày, 10): GMV trung bình mỗi ngày (triệu đ)', 'MOD(day index, 10) sampling: mean daily GMV (M VND)')}
        badge={<Chip tone="amber">{L('Toàn tập', 'Full set')} {n(modSampleFull, 1)}</Chip>}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={modSamples} margin={{ top: 22, right: 8, left: -4, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="sample" tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} domain={[0, 'auto']} width={38}>
              <Label value={L('(Tr đ)', '(M VND)')} position="top" offset={10} className={TEXT_FILL_CLASS} fontSize={11} />
            </YAxis>
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={<ChartTooltip fmt={(v) => `${n(v, 1)} ${L('Tr', 'M')}`} />}
            />
            <ReferenceLine y={modSampleFull} stroke={COLORS.deep} strokeDasharray="5 4" />
            <Bar dataKey="meanM" name={L('Trung bình mẫu', 'Sample mean')} fill={COLORS.amber} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </StageSection>
  );
}
