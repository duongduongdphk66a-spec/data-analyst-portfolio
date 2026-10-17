'use client';

import React from 'react';
import { ArrowDown, Database, FileSpreadsheet, LayoutDashboard, TerminalSquare } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { COLORS, pipelineMeta, sqlSnippets, tableRows } from '../playbookData';
import { ChartCard, ChartTooltip, Chip, GRID_STROKE, StageSection, TEXT_FILL_CLASS, axisTick, usePlaybookLang } from '../PlaybookUi';

const SQL_LOOP = ['Explore', 'Profile', 'Clean', 'Shape', 'Analyze'] as const;

export default function Stage1Architecture() {
  const { L, b, n } = usePlaybookLang();
  const data = tableRows.map((t) => ({ name: b(t.label), rows: t.rows }));

  const steps = [
    {
      icon: FileSpreadsheet,
      title: L('Hệ thống nguồn', 'Source systems'),
      value: `${pipelineMeta.tables} ${L('tệp xlsx', 'xlsx files')} · ${n(pipelineMeta.rows)} ${L('dòng', 'rows')}`,
    },
    {
      icon: Database,
      title: L('Kho dữ liệu (ELT)', 'Data warehouse (ELT)'),
      value: `${pipelineMeta.tables} ${L('bảng', 'tables')}`,
    },
    {
      icon: TerminalSquare,
      title: L('Truy vấn SQL', 'SQL queries'),
      value: null,
    },
    {
      icon: LayoutDashboard,
      title: L('Trình bày (BI)', 'Presentation (BI)'),
      value: L('7 giai đoạn, dashboard này', '7 stages, this dashboard'),
    },
  ];

  return (
    <StageSection
      stage={1}
      takeaway={L(
        `${pipelineMeta.tables} tệp, ${n(pipelineMeta.rows)} dòng, đi qua 4 bước từ nguồn đến dashboard.`,
        `${pipelineMeta.tables} files, ${n(pipelineMeta.rows)} rows, 4 steps from source to dashboard.`,
      )}
      kpis={[
        { value: String(pipelineMeta.tables), label: L('bảng nguồn', 'source tables') },
        { value: n(pipelineMeta.rows), label: L('dòng dữ liệu', 'data rows') },
        { value: '5', label: L('bước vòng lặp SQL', 'SQL loop steps'), tone: 'amber' },
      ]}
      sql={sqlSnippets.s1}
    >
      <ChartCard title={L('Số dòng theo bảng', 'Rows per table')} height="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, left: 4, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={116} tick={axisTick} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(155,231,250,0.15)' }}
              content={<ChartTooltip fmt={(v) => n(v)} />}
            />
            <Bar dataKey="rows" name={L('Dòng', 'Rows')} fill={COLORS.cyan} radius={[0, 8, 8, 0]}>
              <LabelList dataKey="rows" position="right" fontSize={11} className={TEXT_FILL_CLASS} formatter={(v: unknown) => n(Number(v))} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={L('Luồng 4 bước', '4-step flow')} height="">
        <ol className="space-y-1">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.title}>
                <div className="flex items-center gap-3 rounded-2xl border border-[#9BE7FA]/60 bg-[#C8EEF7]/30 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#9BE7FA] text-slate-950">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-black text-slate-950 dark:text-white">{s.title}</div>
                    {s.value ? (
                      <div className="text-xs text-slate-600 dark:text-slate-300">{s.value}</div>
                    ) : (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {SQL_LOOP.map((x) => (
                          <Chip key={x}>{x}</Chip>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex justify-center py-0.5 text-[#0D7287] dark:text-[#9BE7FA]">
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </ChartCard>
    </StageSection>
  );
}
