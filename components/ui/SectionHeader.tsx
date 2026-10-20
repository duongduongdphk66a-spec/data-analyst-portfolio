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
  lead?: string;
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
  lead,
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
      <div className={`flex items-start sm:items-center justify-between gap-4 pb-4 mb-6 border-slate-200/80 dark:border-slate-800 ${className}`}>
        <div className="space-y-1">
          {badge && (
            <span className="meta-label text-xs block text-brand-teal dark:text-[#9BE7FA]">
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
      <div className={`p-6 sm:p-8 rounded-3xl bg-[#F0F9FB] dark:bg-slate-900 border-2 border-[#0D7287]/25 dark:border-[#9BE7FA]/25 shadow-xs mb-8 ${className}`}>
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {chapter && (
                <span className="px-3 py-1 bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 rounded-xl text-xs sm:text-sm tabular-nums font-black tracking-wide shadow-2xs shrink-0">
                  {chapter}
                </span>
              )}
              {subtitle && (
                <span className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {subtitle}
                </span>
              )}
            </div>
            <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              {badge && !title.startsWith(badge) && (
                <span className="text-[#0D7287] dark:text-[#9BE7FA] tabular-nums text-2xl sm:text-3xl font-black">{badge}</span>
              )}
              <span>{title}</span>
            </h2>
            {lead && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-3xl leading-relaxed pt-1">
                {lead}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
            {extraAction}
            {copyBtn}
          </div>
        </div>
      </div>
    );
  }

  // Variant: 'pill'
  // Determine hierarchy based on badge depth:
  // Level 1: "1", "1.", "Phần 1", "Chương 1"
  // Level 2: "1.1", "1.2", "2.1", etc.
  // Level 3: "1.2.1", "1.2.2", "2.1.1", etc.
  const cleanBadge = (badge || '').trim();
  const isLevel1 = /^(phần|chương|part|chapter)?\s*\d+(\.0*)?$/i.test(cleanBadge);
  const isLevel2 = /^\d+\.\d+$/.test(cleanBadge);
  const isLevel3 = /^\d+\.\d+\.\d+/.test(cleanBadge);

  let headingClass = 'text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white';
  let badgeStyle = badgeBg
    ? badgeBg
    : 'bg-[#C8EEF7]/50 border border-[#9BE7FA] text-[#074553] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]';
  let badgePadding = 'px-2.5 py-1 text-xs font-bold';

  if (isLevel1) {
    headingClass = 'text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white';
    badgeStyle = 'bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 shadow-xs';
    badgePadding = 'px-3.5 py-1.5 text-xs sm:text-sm font-black tracking-wide';
  } else if (isLevel2) {
    headingClass = 'text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0D7287] dark:text-[#9BE7FA]';
    badgeStyle = 'bg-[#0D7287]/15 border border-[#0D7287]/30 text-[#0A5868] dark:bg-[#9BE7FA]/20 dark:border-[#9BE7FA]/40 dark:text-[#9BE7FA] shadow-2xs';
    badgePadding = 'px-3 py-1 text-xs sm:text-sm font-black';
  } else if (isLevel3) {
    headingClass = 'text-base sm:text-lg lg:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100';
    badgeStyle = 'bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300';
    badgePadding = 'px-2.5 py-0.5 text-xs font-bold';
  }

  return (
    <div className={`flex items-center justify-between gap-4 pb-4 mb-6 border-slate-200/80 dark:border-slate-800 ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        {badge && (
          <span className={`rounded-xl tabular-nums shrink-0 ${badgePadding} ${badgeStyle}`}>
            {badge}
          </span>
        )}
        <h2 className={`editorial-section-title ${headingClass}`}>
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
