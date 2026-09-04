'use client';

import React from 'react';
import {
  AreaChart, Area, ResponsiveContainer, YAxis, Tooltip,
} from 'recharts';

export interface HeroAreaChartProps {
  data: Array<{ y: string; v: number }>;
  isDark: boolean;
  isEn: boolean;
}

export default function HeroAreaChart({ data, isDark, isEn }: HeroAreaChartProps) {
  return (
    <div className="h-44 sm:h-52 w-full min-h-[176px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={176}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9BE7FA" stopOpacity={isDark ? 0.45 : 0.35} />
              <stop offset="95%" stopColor="#9BE7FA" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[0, 'dataMax + 5']} />
          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#fafcfd',
              border: `1px solid ${isDark ? '#334155' : '#d8e6ed'}`,
              borderRadius: '8px',
              fontFamily: 'var(--font-heading)',
              fontSize: '12px',
              padding: '8px 12px',
              color: isDark ? '#f8fafc' : '#1a2332',
              boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 12px rgba(26,35,50,0.06)',
            }}
            labelStyle={{ color: isDark ? '#94a3b8' : '#7b8fa6', fontWeight: 500, marginBottom: 2 }}
            formatter={(value: number | string | readonly (string | number)[] | undefined) => [
              `${value}M`,
              isEn ? 'Tourists' : 'Khách',
            ]}
            labelFormatter={(label: React.ReactNode) => `${isEn ? 'Year' : 'Năm'} ${label ?? ''}`}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke="#9BE7FA"
            strokeWidth={2.5}
            fill="url(#heroGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: '#9BE7FA',
              stroke: isDark ? '#1e293b' : '#fafcfd',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
