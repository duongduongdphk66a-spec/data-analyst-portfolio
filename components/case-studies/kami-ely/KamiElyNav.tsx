'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface KamiElyNavProps {
  activeSection?: string;
  onSelectSection?: (_sectionId: string) => void;
  onBack?: () => void;
}

export const KAMI_SECTION_IDS = [
  'sec-exec-summary',
  'sec-ch1-data',
  'sec-ch2-sku',
  'sec-ch3-season',
  'sec-ch4-koc',
  'sec-ch5-funnel',
  'sec-ch6-pipeline',
  'sec-ch7-conclusion',
  'sec-appendix',
] as const;

export default function KamiElyNav({
  activeSection = 'sec-exec-summary',
  onSelectSection,
  onBack,
}: KamiElyNavProps) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';

  const sections = [
    { id: 'sec-exec-summary', label: { vi: '0. Tóm tắt', en: '0. Executive brief' } },
    { id: 'sec-ch1-data', label: { vi: '1. Dữ liệu', en: '1. Data & scope' } },
    { id: 'sec-ch2-sku', label: { vi: '2. Kênh & SKU', en: '2. Channels & SKUs' } },
    { id: 'sec-ch3-season', label: { vi: '3. Đỉnh T6, đáy T8', en: '3. Jun peak & Aug trough' } },
    { id: 'sec-ch4-koc', label: { vi: '4. Affiliate KOC', en: '4. Affiliate cohorts' } },
    { id: 'sec-ch5-funnel', label: { vi: '5. Live, Video & Ads', en: '5. Live, Video & Ads' } },
    { id: 'sec-ch6-pipeline', label: { vi: '6. Pipeline & PII', en: '6. Pipeline & PII' } },
    { id: 'sec-ch7-conclusion', label: { vi: '7. Kết luận', en: '7. Recommendations' } },
    { id: 'sec-appendix', label: { vi: 'Phụ lục (A·B·C)', en: 'Appendix (A·B·C)' } },
  ];

  const handleScrollTo = (id: string) => {
    if (onSelectSection) onSelectSection(id);
    const el = document.getElementById(id);
    if (el) {
      if (id === 'sec-appendix') {
        el.dispatchEvent(new CustomEvent('kami-open-appendix'));
      }
      const y = el.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Điều hướng chương báo cáo Kami Ely"
      className="sticky top-2 z-30 w-full rounded-2xl border border-slate-200/90 bg-white/95 dark:border-slate-800/90 dark:bg-slate-950/90 backdrop-blur-md p-1.5" /* taste-skill-ignore: single sticky bar allowed */
    >
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] px-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
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
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer shrink-0 flex items-center ${
                isActive
                  ? 'bg-[#C8EEF7]/60 text-[#074553] border-[#9BE7FA] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/50'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:text-slate-950 hover:bg-slate-100 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              {sec.label[lang]}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export { KamiElyNav };
