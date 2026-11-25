'use client';

import React from 'react';
import { ArrowLeft, Code2 } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export const KAMI_SECTION_IDS = [
  'sec-overview',
  'sec-context',
  'sec-content',
  'sec-seasonality',
  'sec-koc',
  'sec-warning',
  'sec-appendix',
] as const;

export type KamiSectionId = (typeof KAMI_SECTION_IDS)[number];

interface Props {
  lang?: 'vi' | 'en';
  activeSection: string;
  onSelectSection: (_id: string) => void;
  onBack?: () => void;
  onOpenSqlLab?: () => void;
}

const NAV_ITEMS: { id: KamiSectionId; labelVi: string; labelEn: string }[] = [
  { id: 'sec-overview', labelVi: 'Tổng quan', labelEn: 'Overview' },
  { id: 'sec-context', labelVi: 'Đối soát kênh', labelEn: 'Channel Audit' },
  { id: 'sec-content', labelVi: 'Live & Video', labelEn: 'Live & Video' },
  { id: 'sec-seasonality', labelVi: 'SKU & Affiliate', labelEn: 'SKU & Affiliate' },
  { id: 'sec-warning', labelVi: 'Khuyến nghị', labelEn: 'Playbook' },
  { id: 'sec-appendix', labelVi: 'Phụ lục & SQL', labelEn: 'Appendix & SQL' },
];

export function KamiElyNav({
  lang,
  activeSection,
  onSelectSection,
  onBack,
  onOpenSqlLab,
}: Props) {
  const { language } = useLanguage();
  const isVi = (lang ?? language) === 'vi';

  const handleJump = (id: KamiSectionId) => {
    onSelectSection(id);
    if (typeof window !== 'undefined') {
      const el = document.getElementById(id);
      if (el) {
        if (id === 'sec-appendix') {
          el.dispatchEvent(new CustomEvent('kami-open-appendix'));
        }
        const y = el.getBoundingClientRect().top + window.scrollY - 92;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
      <div className="max-w-7xl mx-auto px-3 md:px-5 flex flex-wrap items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isVi ? 'Quay lại' : 'Back'}</span>
            </button>
          )}
          <nav
            aria-label={isVi ? 'Mục lục báo cáo Kami Ely' : 'Kami Ely Case Study Sections'}
            className="flex items-center gap-1"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleJump(item.id)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#9BE7FA] text-slate-950'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {isVi ? item.labelVi : item.labelEn}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={() => (onOpenSqlLab ? onOpenSqlLab() : handleJump('sec-appendix'))}
          className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#C8EEF7] dark:border-slate-700 bg-[#C8EEF7]/25 dark:bg-slate-900 text-slate-900 dark:text-[#9BE7FA] hover:bg-[#9BE7FA]/40 transition-colors cursor-pointer shrink-0"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{isVi ? 'Phụ lục & Mã SQL' : 'Appendix & SQL'}</span>
        </button>
      </div>
    </div>
  );
}

export default KamiElyNav;
