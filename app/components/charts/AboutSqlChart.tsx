'use client';

import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, Cell,
} from 'recharts';
import { CHART_COLORS } from '../../data/aboutSqlData';

export interface PresetScenarioData {
  id: string;
  chartType: string;
  data: any[];
  xAxisKey: string;
  dataKey: string;
  unit: string;
}

export interface AboutSqlChartProps {
  scenario: PresetScenarioData;
  isDark: boolean;
  isEn: boolean;
}

export default function AboutSqlChart({ scenario, isDark, isEn }: AboutSqlChartProps) {
  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#fafcfd',
    border: `1px solid ${isDark ? '#334155' : '#d8e6ed'}`,
    borderRadius: '8px',
    fontFamily: 'var(--font-heading)',
    fontSize: '12px',
    padding: '6px 10px',
    color: isDark ? '#f8fafc' : '#1a2332',
    boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 12px rgba(26,35,50,0.06)',
  };

  const axisColor = isDark ? '#64748b' : '#94a3b8';

  if (scenario.chartType === 'bar') {
    return (
      <div className="w-full h-40">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={scenario.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis dataKey={scenario.xAxisKey} tick={{ fontSize: 10, fontFamily: 'var(--font-heading)', fill: axisColor }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} cursor={false} formatter={(val: any) => [`${val} ${scenario.unit}`, '']} />
            <Bar dataKey={scenario.dataKey} radius={[4, 4, 0, 0]} barSize={36}>
              {scenario.data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (scenario.chartType === 'area') {
    return (
      <div className="w-full h-40">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={scenario.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="sqlAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9BE7FA" stopOpacity={isDark ? 0.4 : 0.3} />
                <stop offset="95%" stopColor="#9BE7FA" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey={scenario.xAxisKey} tick={{ fontSize: 10, fontFamily: 'var(--font-heading)', fill: axisColor }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} cursor={false} formatter={(val: any) => [`${val} ${scenario.unit}`, '']} />
            <Area type="monotone" dataKey={scenario.dataKey} stroke="#9BE7FA" strokeWidth={2} fill="url(#sqlAreaGrad)" dot={false} activeDot={{ r: 4, fill: '#9BE7FA', stroke: isDark ? '#1e293b' : '#fafcfd', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={scenario.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <XAxis dataKey={scenario.xAxisKey} tick={{ fontSize: 10, fontFamily: 'var(--font-heading)', fill: axisColor }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={tooltipStyle} cursor={false} />
          <Bar dataKey="raw" name={isEn ? 'Before (MySQL)' : 'Trước (MySQL)'} fill={isDark ? '#334155' : '#d8e6ed'} radius={[4, 4, 0, 0]} barSize={20} />
          <Bar dataKey="optimized" name={isEn ? 'After (Redis)' : 'Sau (Redis)'} fill="#9BE7FA" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
