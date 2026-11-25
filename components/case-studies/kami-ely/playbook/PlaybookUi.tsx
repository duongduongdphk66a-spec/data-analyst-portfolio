'use client';

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

type Bi = { vi: string; en: string };

export function usePlaybookLang() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const L = (vi: string, en: string): string => (isEn ? en : vi);
  const b = (x: Bi): string => (isEn ? x.en : x.vi);
  const n = (v: number, digits = 0): string =>
    v.toLocaleString(isEn ? 'en-US' : 'vi-VN', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return { isEn, L, b, n };
}

export function Chip({ children, tone = 'cyan' }: { children: React.ReactNode; tone?: 'cyan' | 'amber' | 'rose' | 'emerald' }) {
  const toneClass =
    tone === 'amber'
      ? 'bg-[#FFE485]/50 text-amber-950 dark:bg-[#FFD14C]/20 dark:text-[#FFE485]'
      : tone === 'rose'
        ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
        : tone === 'emerald'
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
          : 'bg-[#C8EEF7]/60 text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap tabular-nums ${toneClass}`}>
      {children}
    </span>
  );
}

export function ChartRoleBadge({ kind = 'main' }: { kind?: 'main' | 'more' }) {
  const { L } = usePlaybookLang();
  return kind === 'main' ? (
    <span className="inline-flex items-center rounded-md bg-[#9BE7FA] px-2 py-0.5 text-[11px] font-black text-slate-950 tabular-nums">
      {L('CHÍNH', 'MAIN')}
    </span>
  ) : (
    <span className="inline-flex items-center rounded-md bg-[#FFE485] px-2 py-0.5 text-[11px] font-black text-amber-950 tabular-nums">
      {L('XEM THÊM', 'MORE')}
    </span>
  );
}
