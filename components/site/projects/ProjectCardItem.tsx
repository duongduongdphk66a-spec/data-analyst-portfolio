'use client';

import React from 'react';
import Link from 'next/link';
import { Target, FlaskConical, Lightbulb, Wrench, ArrowRight } from 'lucide-react';
import { ProjectData } from '@/app/types';
import { getProjectPresentation } from './projectPresentation';

interface ProjectCardItemProps {
  project: ProjectData;
  index: number;
  isEn: boolean;
  onOpenDetail: (_id: string) => void;
}

export const ProjectCardItem = React.memo(function ProjectCardItem({
  project,
  index,
  isEn,
  onOpenDetail,
}: ProjectCardItemProps) {
  const presentation = getProjectPresentation(project, isEn);

  return (
    <Link
      href={`/projects/${project.id}`}
      id={project.id}
      onClick={() => onOpenDetail(project.id)}
      className="project-card-item animate-in fade-in slide-in-from-bottom-6 duration-600 fill-mode-both block group cursor-pointer rounded-3xl border-2 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0E1524] hover:border-[#9BE7FA] dark:hover:border-[#9BE7FA] transition-all hover:shadow-2xl overflow-hidden"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Top Section: Kicker + Title + Description */}
      <div className="p-6 sm:p-8 pb-0 sm:pb-0 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-black uppercase tracking-[0.15em] text-[#0D7287] dark:text-[#9BE7FA]">
            {presentation.kicker}
          </span>
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">·</span>
          <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {isEn ? 'CASE STUDY' : 'BÁO CÁO PHÂN TÍCH'} #{String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-heading font-black text-slate-950 dark:text-white leading-snug group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA] transition-colors">
          {presentation.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {presentation.desc}
        </p>
      </div>

      {/* Middle Section: Problem → Method → Insight (3-column) */}
      <div className="px-6 sm:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 md:divide-x divide-[#9BE7FA]/25 dark:divide-slate-700/50">
          <div className="md:pr-5 space-y-2">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                {isEn ? 'Problem' : 'Bài Toán'}
              </span>
            </div>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {presentation.problem}
            </p>
          </div>

          <div className="md:px-5 space-y-2">
            <div className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {isEn ? 'Method' : 'Phương Pháp'}
              </span>
            </div>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {presentation.method}
            </p>
          </div>

          <div className="md:pl-5 space-y-2">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {isEn ? 'Key Insight' : 'Phát Hiện'}
              </span>
            </div>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {presentation.insight}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 sm:mx-8 h-px bg-gradient-to-r from-[#9BE7FA]/30 via-[#9BE7FA]/15 to-transparent dark:from-slate-700/50 dark:via-slate-800/30" />

      {/* Bottom Section: 4 KPIs + Tools + CTA */}
      <div className="p-6 sm:p-8 pt-5 sm:pt-5 space-y-4">
        {presentation.metrics.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {presentation.metrics.slice(0, 4).map((metric, mIdx) => (
              <div
                key={mIdx}
                className="p-3 rounded-xl bg-[#C8EEF7]/15 dark:bg-slate-900/60 border border-[#9BE7FA]/25 dark:border-slate-800 space-y-0.5"
              >
                <div className="text-base sm:text-lg font-mono font-black text-slate-950 dark:text-white tabular-nums leading-tight">
                  {metric.value}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-snug">
                  {metric.label}
                </div>
                {metric.change && (
                  <div className={`text-[10px] font-bold ${
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {presentation.tools.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Wrench className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
              {presentation.tools.slice(0, 5).map((tool) => (
                <span
                  key={tool}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-400"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}

          <span className="text-xs font-heading font-bold text-[#074553] dark:text-[#9BE7FA] group-hover:underline inline-flex items-center gap-1.5 shrink-0">
            <span>{isEn ? 'Read full case study' : 'Đọc chi tiết case study'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
});
