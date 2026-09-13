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
 * Reusable SectionHeader for portfolio case-study sub-sections
 * Supports:
 * - 'pill': [BADGE] Title (Kami Ely style)
 * - 'stacked': Subtitle over large H2 (Heritage Japan style)
 * - 'chapter': CHAPTER badge + subtitle over H2 with colored number prefix (Library Bus style)
 */
export function SectionHeader({
  badge,
  title,
  id,
  onCopy,
  badgeBg = 'bg-[#9BE7FA]',
  extraAction,
  variant = 'pill',
  chapter,
  subtitle,
  className = ''
}: SectionHeaderProps) {
  if (variant === 'stacked') {
    return (
      <div className={`flex items-center justify-between pb-4 mb-8 border-b border-slate-200 dark:border-slate-800 ${className}`}>
        <div>
          <span className="text-xs font-extrabold tracking-widest text-[#074553] uppercase dark:text-[#9BE7FA]">
            {badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mt-1 dark:text-white">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {extraAction}
          <button
            onClick={() => onCopy(id, `${badge} ${title}`)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all dark:hover:text-white dark:hover:bg-slate-800 cursor-pointer"
            title="Sao chép liên kết"
            aria-label={`Sao chép liên kết ${title}`}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'chapter') {
    return (
      <div className={`flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800 ${className}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {chapter && (
              <span className="px-2.5 py-0.5 bg-[#9BE7FA] text-slate-950 rounded-md text-[11px] font-mono font-black shrink-0">
                {chapter}
              </span>
            )}
            {subtitle && (
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                {subtitle}
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            {badge && <span className="text-[#074553] dark:text-[#9BE7FA]">{badge}</span>}
            <span>{title}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {extraAction}
          <button
            onClick={() => onCopy(id, `${badge} ${title}`)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#074553] dark:hover:text-[#9BE7FA] transition-colors cursor-pointer"
            title="Sao chép liên kết"
            aria-label={`Sao chép liên kết ${title}`}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const isLightBadge = badgeBg.includes('9BE7FA') || badgeBg.includes('C8EEF7') || badgeBg.includes('FFD14C') || badgeBg.includes('FFE485');

  return (
    <div className={`flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800 ${className}`}>
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 ${badgeBg} ${isLightBadge ? 'text-slate-950 font-bold' : 'text-white font-bold'} rounded-lg text-xs font-black uppercase shrink-0`}>
          {badge}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {extraAction}
        <button
          onClick={() => onCopy(id, `${badge} ${title}`)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          title="Sao chép liên kết"
          aria-label={`Sao chép liên kết ${title}`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default SectionHeader;
