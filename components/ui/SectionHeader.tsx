'use client';

import React from 'react';
import { Link as LinkIcon } from 'lucide-react';

export interface SectionHeaderProps {
  badge: string;
  title: string;
  id: string;
  onCopy: (_id: string, _title: string) => void;
  badgeBg?: string;
  extraAction?: React.ReactNode;
  variant?: 'pill' | 'stacked' | 'chapter';
  chapter?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Reusable SectionHeader for portfolio case-study sub-sections.
 * Unified data-analyst editorial design:
 * - 'pill': Pill badge + Title (Kami Ely style)
 * - 'stacked': Eyebrow above Title (Heritage Japan style)
 * - 'chapter': Chapter badge + Subtitle + Title (Library Bus style)
 */
export function SectionHeader({
  badge,
  title,
  id,
  onCopy,
  badgeBg,
  extraAction,
  variant = 'pill',
  chapter,
  subtitle,
  className = '',
}: SectionHeaderProps) {
  const copyBtn = (
    <button
      type="button"
      onClick={() => onCopy(id, `${badge ? badge + ' ' : ''}${title}`)}
      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-teal hover:bg-slate-100 dark:hover:text-[#9BE7FA] dark:hover:bg-slate-800 transition-colors cursor-pointer"
      title="Sao chép liên kết"
      aria-label={`Sao chép liên kết ${title}`}
    >
      <LinkIcon className="w-4 h-4" />
    </button>
  );

  if (variant === 'stacked') {
    return (
      <div className={`flex items-start sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-200/80 dark:border-slate-800 ${className}`}>
        <div className="space-y-1">
          {badge && (
            <span className="editorial-kicker text-xs block text-brand-teal dark:text-[#9BE7FA]">
              {badge}
            </span>
          )}
          <h2 className="editorial-section-title text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
          {extraAction}
          {copyBtn}
        </div>
      </div>
    );
  }

  if (variant === 'chapter') {
    return (
      <div className={`flex items-start sm:items-center justify-between gap-4 pb-4 mb-8 border-b border-slate-200/80 dark:border-slate-800 ${className}`}>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            {chapter && (
              <span className="px-2.5 py-1 bg-brand-blue-vivid text-slate-950 rounded-lg text-xs sm:text-sm font-mono font-bold tracking-wider shrink-0 shadow-xs">
                {chapter}
              </span>
            )}
            {subtitle && (
              <span className="text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400">
                {subtitle}
              </span>
            )}
          </div>
          <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 dark:text-white flex items-center gap-3">
            {badge && <span className="text-brand-teal dark:text-[#9BE7FA] font-mono text-xl sm:text-2xl">{badge}</span>}
            <span>{title}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
          {extraAction}
          {copyBtn}
        </div>
      </div>
    );
  }

  // Variant: 'pill'
  const customBadgeStyle = badgeBg
    ? badgeBg
    : 'bg-brand-blue-light/50 border border-brand-blue-vivid text-brand-teal dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]';

  return (
    <div className={`flex items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-200/80 dark:border-slate-800 ${className}`}>
      <div className="flex flex-wrap items-center gap-2.5">
        {badge && (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 ${customBadgeStyle}`}>
            {badge}
          </span>
        )}
        <h2 className="editorial-section-title text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {extraAction}
        {copyBtn}
      </div>
    </div>
  );
}

export default SectionHeader;
