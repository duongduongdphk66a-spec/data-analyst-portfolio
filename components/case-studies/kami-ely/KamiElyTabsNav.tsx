'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export type KamiElyTabKey = 'commercial' | 'science' | 'sql' | 'shop' | 'creator';

export interface NavItemDef {
  id: string;
  label: string;
  badge: string;
  dividerBefore?: boolean;
}

export interface KamiElyTabsNavProps {
  activeTab?: KamiElyTabKey;
  onTabChange?: (_tab: KamiElyTabKey) => void;
  setActiveTab?: (_tab: KamiElyTabKey) => void;
  handleTabChange?: (_tab: KamiElyTabKey) => void;
  handleBack?: () => void;
  isEmbedded?: boolean;
  isEn?: boolean;
  onOpenProofModal?: () => void;
  currentNavItems?: NavItemDef[];
  activeSection?: string;
  scrollProgress?: number;
  subnavContainerRef?: React.RefObject<HTMLDivElement | null>;
  handleNavClick?: (_id: string, _e: React.MouseEvent) => void;
  isExecutiveMode?: boolean;
  onToggleExecutiveMode?: () => void;
  isExecutiveScanMode?: boolean;
  onToggleExecutiveScanMode?: () => void;
}

export default function KamiElyTabsNav({
  activeTab = 'commercial',
  onTabChange,
  setActiveTab,
  handleTabChange,
  isEn: propIsEn,
}: KamiElyTabsNavProps) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setIsScrolledPast(rect.top <= 16);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectTab = (tab: KamiElyTabKey) => {
    if (onTabChange) onTabChange(tab);
    if (handleTabChange) handleTabChange(tab);
    if (setActiveTab) setActiveTab(tab);
  };

  const mainTabs: {
    id: KamiElyTabKey;
    num: string;
    title: { vi: string; en: string };
    badge: { vi: string; en: string };
  }[] = [
    {
      id: 'commercial',
      num: '1',
      title: { vi: 'Kiến trúc, Làm sạch & Thời gian', en: 'Architecture, Cleaning & Time Series' },
      badge: { vi: 'Ch. 1–3 · Mục 1–3', en: 'Ch. 1–3 · Stages 1–3' },
    },
    {
      id: 'science',
      num: '2',
      title: { vi: 'Cohort, Phễu & Thử nghiệm A/B', en: 'Cohorts, Funnels & Split Testing' },
      badge: { vi: 'Ch. 4, 7, 9 · Mục 4–5', en: 'Ch. 4, 7, 9 · Stages 4–5' },
    },
    {
      id: 'sql',
      num: '3',
      title: { vi: 'Văn bản, Bất thường & ETL PII', en: 'Text Mining, Anomalies & ETL PII' },
      badge: { vi: 'Ch. 5, 6, 8 · Mục 6–7', en: 'Ch. 5, 6, 8 · Stages 6–7' },
    },
  ];

  const isTabActive = (tabId: KamiElyTabKey) => {
    if (activeTab === tabId) return true;
    if (tabId === 'commercial' && (activeTab === 'shop' || activeTab === 'creator')) return true;
    return false;
  };

  return (
    <div ref={wrapperRef} className="w-full">
      <nav
        aria-label="Kami Ely Case Study Navigation"
        className={`sticky top-2 z-30 w-full rounded-3xl border border-[#9BE7FA]/70 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95 backdrop-blur-md transition-[padding,background-color] duration-200 ${
          isScrolledPast ? 'p-2 shadow-md' : 'p-2.5 sm:p-3 shadow-sm' /* taste-skill-ignore: sticky bar */
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
          {mainTabs.map((tab) => {
            const isSelected = isTabActive(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`min-h-11 rounded-2xl border px-3.5 py-2.5 text-left transition-colors duration-200 cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'border-[#9BE7FA] bg-[#C8EEF7]/60 text-slate-950 shadow-xs dark:border-[#9BE7FA]/60 dark:bg-[#9BE7FA]/15 dark:text-white'
                    : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-[#C8EEF7]/25 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                      isSelected
                        ? 'bg-[#9BE7FA] text-slate-950'
                        : 'bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {tab.num}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-950 dark:text-white truncate">
                    {tab.title[lang]}
                  </span>
                </span>
                <span className="rounded-full bg-[#FFE485]/60 px-2.5 py-0.5 text-[11px] font-bold text-amber-950 shrink-0 dark:bg-[#FFD14C]/20 dark:text-[#FFE485]">
                  {tab.badge[lang]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
