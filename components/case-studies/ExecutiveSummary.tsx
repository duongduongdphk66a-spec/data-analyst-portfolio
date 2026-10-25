'use client';

import React from 'react';
import { Target, FlaskConical, Lightbulb, Wrench } from 'lucide-react';

interface MetricItem {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

interface ExecutiveSummaryProps {
  problem: string;
  method: string;
  insight: string;
  metrics: MetricItem[];
  tools: string[];
  readingTime?: string;
  isEn?: boolean;
}

export default function ExecutiveSummary({
  problem,
  method,
  insight,
  metrics,
  tools,
  readingTime: _readingTime,
  isEn = false,
}: ExecutiveSummaryProps) {
  return (
    <section className="scroll-mt-36 mb-12">
      {/* Section Label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 bg-[#9BE7FA]/60" />
        <span className="text-xs tabular-nums font-black text-[#0D7287] dark:text-[#9BE7FA] whitespace-nowrap flex items-center gap-2">
          {isEn ? 'EXECUTIVE SUMMARY' : 'TỔNG QUAN NHANH'}
        </span>
        <div className="flex-1 bg-[#9BE7FA]/60" />
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border-2 border-[#9BE7FA]/40 dark:border-slate-700/80 overflow-hidden bg-white">
        {/* Top Row: Problem → Method → Insight */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-[#9BE7FA]/30 dark:divide-slate-700/60">
          {/* Problem */}
          <div className="p-5 sm:p-6 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 flex items-center justify-center shrink-0">
                <Target className="w-3.5 h-3.5 text-[#074553] dark:text-[#9BE7FA]" />
              </div>
              <span className="text-xs tabular-nums font-black text-[#074553] dark:text-[#9BE7FA]">
                {isEn ? 'Problem' : 'Bài Toán'}
              </span>
            </div>
            <p className="text-[13px] sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {problem}
            </p>
          </div>

          {/* Method */}
          <div className="p-5 sm:p-6 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 flex items-center justify-center shrink-0">
                <FlaskConical className="w-3.5 h-3.5 text-[#074553] dark:text-[#9BE7FA]" />
              </div>
              <span className="text-xs tabular-nums font-black text-[#074553] dark:text-[#9BE7FA]">
                {isEn ? 'Method' : 'Phương Pháp'}
              </span>
            </div>
            <p className="text-[13px] sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {method}
            </p>
          </div>

          {/* Key Insight */}
          <div className="p-5 sm:p-6 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFE485]/40 dark:bg-[#FFE485]/15 flex items-center justify-center shrink-0">
                <Lightbulb className="w-3.5 h-3.5 text-[#B45309] dark:text-[#FFE485]" />
              </div>
              <span className="text-xs tabular-nums font-black text-amber-950 dark:text-[#FFE485]">
                {isEn ? 'Key Insight' : 'Phát Hiện Chính'}
              </span>
            </div>
            <p className="text-[13px] sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {insight}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="" />

        {/* Bottom Row: 4 KPIs + Tools */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* KPI Grid */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {metrics.slice(0, 4).map((metric, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-[#9BE7FA]/30 dark:border-slate-700/50 space-y-1 hover:border-[#9BE7FA]/70 dark:hover:border-slate-600 transition-colors"
                >
                  <div className="text-lg sm:text-xl font-black text-slate-950 dark:text-white tabular-nums leading-tight">
                    {metric.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-snug">
                    {metric.label}
                  </div>
                  {metric.change && (
                    <div className={`text-xs font-bold tabular-nums ${
                      metric.isPositive === false || metric.change.startsWith('-')
                        ? 'text-rose-600 dark:text-rose-400'
                        : metric.isPositive === true || metric.change.startsWith('+')
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-[#0D7287] dark:text-[#9BE7FA]'
                    }`}>
                      {metric.change}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tools */}
          {tools.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Wrench className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-lg bg-[#C8EEF7]/30 dark:bg-slate-800 border border-[#9BE7FA]/30 dark:border-slate-700 text-xs tabular-nums font-semibold text-slate-700 dark:text-slate-300"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
