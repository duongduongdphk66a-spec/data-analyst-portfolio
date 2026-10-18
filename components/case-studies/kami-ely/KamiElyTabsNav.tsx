'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { ArrowLeft } from 'lucide-react';

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
  handleBack,
  isEmbedded,
  isEn: propIsEn,
  onOpenProofModal: _onOpenProofModal,
  currentNavItems,
  activeSection,
  scrollProgress: _scrollProgress = 0,
  subnavContainerRef,
  handleNavClick,
  isExecutiveMode = false,
  onToggleExecutiveMode,
  isExecutiveScanMode,
  onToggleExecutiveScanMode
}: KamiElyTabsNavProps) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');

  // Combined executive scan mode check
  const isExecActive = isExecutiveScanMode !== undefined ? isExecutiveScanMode : isExecutiveMode;
  const toggleExec = onToggleExecutiveScanMode || onToggleExecutiveMode;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        // Since sticky top is top-2 (8px), when the wrapper's top passes 16px, it is stuck!
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
    title: { vi: string; en: string };
    subtitle: { vi: string; en: string };
    badge: string;
    activeClass: string;
  }[] = [
    {
      id: 'commercial',
      title: { vi: '1. Hiệu Suất Thương Mại & Nội Dung', en: '1. Commercial & Content' },
      subtitle: {
        vi: 'Hợp nhất Shop & Creator • 10 Biểu đồ • Phễu 4 bước',
        en: 'Unified Shop & Creator • 10 Charts • 4-Step Funnel'
      },
      badge: '10 Biểu đồ • Phễu 4 Bước',
      activeClass: 'bg-sky-50 text-sky-950 border-sky-400 ring-2 ring-sky-300/50 shadow-sm dark:bg-sky-500/20 dark:text-sky-200 dark:border-sky-500/60'
    },
    {
      id: 'science',
      title: { vi: '2. Thống Kê Kiểm Định & Tối Ưu Hóa', en: '2. Statistics & Optimization' },
      subtitle: {
        vi: 'EDA & Tương quan • Kiểm định Giả thuyết • Mô phỏng What-If',
        en: 'EDA & Correlation • Hypothesis Testing • What-If Simulator'
      },
      badge: '6 Biểu đồ • p < 0.05',
      activeClass: 'bg-emerald-50 text-emerald-950 border-emerald-400 ring-2 ring-emerald-300/50 shadow-sm dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/60'
    },
    {
      id: 'sql',
      title: { vi: '3. Kỹ Thuật Dữ Liệu & Phòng Lab SQL', en: '3. Data Engineering & SQL' },
      subtitle: {
        vi: 'ETL Pipeline • Cohort Retain • Phễu SQL • Lab tương tác',
        en: 'ETL Pipeline • Cohort Retention • SQL Funnels • Interactive Lab'
      },
      badge: '4 Biểu đồ • SQL Lab',
      activeClass: 'bg-amber-50 text-amber-950 border-amber-400 ring-2 ring-amber-300/50 shadow-sm dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/60'
    }
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
        className={`sticky top-2 z-30 w-full border border-slate-200/90 bg-white/95 dark:border-slate-800/90 dark:bg-slate-950/95 backdrop-blur-md transition-all duration-300 ease-out ${
          isScrolledPast
            ? 'p-2 sm:p-2.5 rounded-2xl shadow-md space-y-2'
            : 'p-3 sm:p-4 rounded-3xl shadow-lg space-y-3'
        }`}
      >
        {/* OPTIONAL BACK BUTTON */}
        {handleBack && !isEmbedded && (
          <div className="pb-1 border-b border-slate-100 dark:border-slate-800/60">
            <button
              type="button"
              onClick={handleBack}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-950 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white transition cursor-pointer flex items-center gap-1.5"
              title={lang === 'vi' ? 'Quay lại danh mục dự án' : 'Back to projects'}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Dự án' : 'Projects'}</span>
            </button>
          </div>
        )}

        {/* 3 DEEP-DIVE TABS (100% WIDTH GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 w-full">
          {mainTabs.map((tab) => {
            const isSelected = isTabActive(tab.id) && !isExecActive;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (isExecActive && toggleExec) {
                    toggleExec();
                  }
                  handleSelectTab(tab.id);
                  const targetId = tab.id === 'commercial' ? 'sec-commercial' : tab.id === 'science' ? 'sec-science' : 'sec-sql';
                  const el = document.getElementById(targetId);
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 90;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                title={tab.subtitle[lang]}
                className={`border text-left transition-all cursor-pointer ${
                  isScrolledPast
                    ? `px-3.5 py-2 rounded-xl flex items-center justify-between gap-2 ${
                        isSelected
                          ? `${tab.activeClass} shadow-xs`
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900/60 dark:border-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                      }`
                    : `p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between space-y-1.5 ${
                        isSelected
                          ? `${tab.activeClass} shadow-md`
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900/60 dark:border-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                      }`
                }`}
              >
                {isScrolledPast ? (
                  <>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {tab.title[lang]}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-white text-slate-700 border border-slate-200 dark:bg-slate-950/80 dark:text-slate-300 dark:border-slate-800 shrink-0">
                      {tab.badge}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                        {tab.title[lang]}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-white text-slate-800 border border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 shadow-2xs shrink-0 whitespace-nowrap">
                        {tab.badge}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-sans line-clamp-1">
                      {tab.subtitle[lang]}
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* CHAPTER SUBNAV PILLS (Visible in full explorer mode when currentNavItems are available) */}
        {!isExecActive && currentNavItems && currentNavItems.length > 0 && handleNavClick && (
          <div
            ref={subnavContainerRef}
            className={`flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-slate-200 dark:border-slate-800/80 transition-all ${
              isScrolledPast ? 'pt-1.5 pb-0.5 text-xs' : 'pt-2.5 pb-1 text-xs'
            }`}
          >
            {currentNavItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isScrolledPast ? 'px-2.5 py-0.5 rounded-md text-[11px]' : 'px-3 py-1 rounded-lg text-xs'
                  } ${
                    isActive
                      ? 'bg-sky-600 text-white font-bold shadow-xs dark:bg-sky-500 dark:text-slate-950'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white font-bold dark:bg-slate-950/20 dark:text-slate-950' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}
