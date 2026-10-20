'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface KamiElyNavProps {
  activeSection?: string;
  onSelectSection?: (_sectionId: string) => void;
  onBack?: () => void;
}

export default function KamiElyNav({
  activeSection = 'part-1-commercial',
  onSelectSection,
  onBack,
}: KamiElyNavProps) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';

  const sections = [
    { id: 'part-1-commercial', label: { vi: '01. Kiến trúc & ETL (Ch.1–3)', en: '01. Architecture & ETL (Ch.1–3)' } },
    { id: 'sec-stage-3-time-series', label: { vi: '1.3 Chuỗi thời gian & Mùa vụ', en: '1.3 Time Series & Seasonality' } },
    { id: 'part-2-science', label: { vi: '02. Cohort, Phễu & A/B (Ch.4–5)', en: '02. Data Science (Ch.4–5)' } },
    { id: 'sec-stage-4-cohort-cltv', label: { vi: '4. Phân tích Affiliate', en: '4. Affiliate Analysis' } },
    { id: 'sec-stage-5-funnel-basket', label: { vi: '2.2 Phễu & Thử nghiệm A/B', en: '2.2 Funnels & Split Test' } },
    { id: 'part-3-playbook', label: { vi: '03. Sổ tay SQL & PII (Ch.6–7)', en: '03. SQL Playbook & PII (Ch.6–7)' } },
  ];

  const handleScrollTo = (id: string) => {
    if (onSelectSection) onSelectSection(id);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 95;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Kami Ely Case Study Navigation"
      className="sticky top-3 z-30 w-full rounded-2xl border border-slate-200/90 bg-white/95 dark:border-slate-800/90 dark:bg-slate-950/90 backdrop-blur-md p-1.5 sm:p-2"
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900/80 dark:text-slate-300 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-800 transition flex items-center gap-2 shrink-0 cursor-pointer mr-1 min-h-[40px]"
              title={lang === 'vi' ? 'Quay lại Portfolio' : 'Back to Portfolio'}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'vi' ? 'Quay lại' : 'Back'}</span>
            </button>
          )}

          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleScrollTo(sec.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition border cursor-pointer shrink-0 min-h-[40px] flex items-center ${
                  isActive
                    ? 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/50 shadow-xs'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-900'
                }`}
              >
                {sec.label[lang]}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export { KamiElyNav };
