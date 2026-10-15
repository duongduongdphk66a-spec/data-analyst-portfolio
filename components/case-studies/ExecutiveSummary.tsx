'use client';

import React from 'react';
import { Clock, Target, FlaskConical, Lightbulb, Wrench } from 'lucide-react';

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
  readingTime,
  isEn = false,
}: ExecutiveSummaryProps) {
  return (
    <section className="scroll-mt-36 mb-12">
      {/* Section Label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-[#9BE7FA]/60 via-[#9BE7FA]/20 to-transparent dark:from-[#9BE7FA]/30 dark:via-[#9BE7FA]/10" />
        <span className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-[#0D7287] dark:text-[#9BE7FA] whitespace-nowrap flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          {isEn ? 'EXECUTIVE SUMMARY' : 'TỔNG QUAN NHANH'}
          {readingTime && (
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 normal-case tracking-normal">
              · {readingTime}
            </span>
          )}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-[#9BE7FA]/60 via-[#9BE7FA]/20 to-transparent dark:from-[#9BE7FA]/30 dark:via-[#9BE7FA]/10" />
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border-2 border-[#9BE7FA]/40 dark:border-slate-700/80 bg-gradient-to-br from-white via-[#FAFDFE] to-[#C8EEF7]/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/40 shadow-lg overflow-hidden">
        {/* Top Row: Problem → Method → Insight */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#9BE7FA]/30 dark:divide-slate-700/60">
          {/* Problem */}
          <div className="p-5 sm:p-6 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0">
                <Target className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
              </div>
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-red-600 dark:text-red-400">
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
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                <FlaskConical className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              </div>
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
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
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              </div>
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {isEn ? 'Key Insight' : 'Phát Hiện Chính'}
              </span>
            </div>
            <p className="text-[13px] sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {insight}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#9BE7FA]/40 to-transparent dark:via-slate-700/60" />

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
                  <div className="text-lg sm:text-xl font-mono font-black text-slate-950 dark:text-white tabular-nums leading-tight">
                    {metric.value}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-snug">
                    {metric.label}
                  </div>
                  {metric.change && (
                    <div className={`text-xs font-bold ${
                      metric.isPositive !== false
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-500 dark:text-red-400'
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
                  className="px-2.5 py-1 rounded-lg bg-[#C8EEF7]/30 dark:bg-slate-800 border border-[#9BE7FA]/30 dark:border-slate-700 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300"
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
