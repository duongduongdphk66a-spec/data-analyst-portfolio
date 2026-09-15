'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, ArrowRight, TrendingUp } from 'lucide-react';
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
      className="project-card-item animate-in fade-in slide-in-from-bottom-6 duration-600 fill-mode-both block group cursor-pointer rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0E1524] hover:border-[#9BE7FA] dark:hover:border-[#9BE7FA]/60 hover:shadow-xl hover:-translate-y-0.5 transition-all overflow-hidden p-6 sm:p-8 space-y-5"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* 1. Header: Kicker + Index Badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-mono font-black uppercase tracking-[0.15em] text-[#0D7287] dark:text-[#9BE7FA]">
            {presentation.kicker}
          </span>
          <span className="text-[10px] font-mono text-slate-300 dark:text-slate-700">/</span>
          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 group-hover:bg-[#C8EEF7]/40 group-hover:text-[#074553] dark:group-hover:bg-[#9BE7FA]/20 dark:group-hover:text-[#9BE7FA] transition-colors">
          {isEn ? 'CASE STUDY' : 'BÁO CÁO PHÂN TÍCH'}
        </span>
      </div>

      {/* 2. Title & 3. 1-sentence Description */}
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-950 dark:text-white leading-snug group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA] transition-colors">
          {presentation.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {presentation.desc}
        </p>
      </div>

      {/* 4. Single Highlighted Primary Metric (Hero Stat) */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 p-4 sm:p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 group-hover:border-[#9BE7FA]/40 transition-colors">
        <div className="space-y-0.5">
          <div className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>{isEn ? 'Key Result / Impact' : 'Kết Quả Trọng Tâm'}</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-black text-[#0D7287] dark:text-[#9BE7FA] tabular-nums tracking-tight">
            {presentation.value}
          </div>
        </div>

        {presentation.sub && (
          <div className="text-xs sm:text-[13px] font-semibold text-slate-600 dark:text-slate-400 sm:text-right max-w-sm">
            {presentation.sub}
          </div>
        )}
      </div>

      {/* 5. Bottom Row: Tech Stack Chips + Direct CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/60">
        {presentation.tools.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <Wrench className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
            {presentation.tools.slice(0, 4).map((tool) => (
              <span
                key={tool}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-400"
              >
                {tool}
              </span>
            ))}
          </div>
        ) : <div />}

        <span className="text-xs font-heading font-bold text-[#074553] dark:text-[#9BE7FA] group-hover:translate-x-0.5 inline-flex items-center gap-1.5 shrink-0 transition-transform">
          <span>{isEn ? 'View case study' : 'Xem case study'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
});
