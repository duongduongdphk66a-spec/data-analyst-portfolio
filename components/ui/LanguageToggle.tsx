'use client';

import React from 'react';
import { useLanguage, Language } from '@/app/context/LanguageContext';

interface LanguageToggleProps {
  /** `sm` for dense bars (sidebar, mobile header); `md` for case-study navbars. */
  size?: 'sm' | 'md';
  className?: string;
}

const OPTIONS: Language[] = ['vi', 'en'];

/**
 * The single language switch used across the site.
 * Segmented control (VI | EN) so the current language is always explicit,
 * replacing the previous mix of flag-only, "EN", "English" and inverted ("shows target") toggles.
 */
export default function LanguageToggle({ size = 'md', className = '' }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const pad = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';

  return (
    <div
      role="group"
      aria-label={language === 'en' ? 'Language' : 'Ngôn ngữ'}
      className={`inline-flex items-center p-0.5 rounded-xl border border-brand-blue-light bg-white dark:bg-slate-900 dark:border-slate-700 shrink-0 ${className}`}
    >
      {OPTIONS.map((lang) => {
        const isActive = language === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            aria-pressed={isActive}
            className={`${pad} rounded-lg font-mono text-[11px] font-bold uppercase tracking-wide transition-colors cursor-pointer ${
              isActive
                ? 'bg-brand-teal text-white dark:text-slate-950'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {lang}
          </button>
        );
      })}
    </div>
  );
}
