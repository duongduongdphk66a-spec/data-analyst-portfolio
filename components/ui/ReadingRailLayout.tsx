'use client';

import React from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useRouter } from 'next/navigation';

interface Section {
  id: string;
  label: string;
}

interface ReadingRailLayoutProps {
  title: string;
  kicker: string;
  desc: string;
  sections: Section[];
  activeSection: string;
  onNavClick: (id: string, e: React.MouseEvent) => void;
  onBack?: () => void;
  isEmbedded?: boolean;
  projectId?: string;
  executiveSummary: React.ReactNode;
  children: React.ReactNode;
}

export default function ReadingRailLayout({
  title,
  kicker,
  desc,
  sections,
  activeSection,
  onNavClick,
  onBack,
  isEmbedded,
  projectId,
  executiveSummary,
  children
}: ReadingRailLayoutProps) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const isEn = language === 'en';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFDFE] font-sans text-[#1A2332] selection:bg-[#9BE7FA]/60 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Global Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all dark:bg-slate-900/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-semibold cursor-pointer group dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
          </button>

          <div className="flex items-center gap-3">
            {isEmbedded && projectId && (
              <a
                href={`/projects/${projectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
                title={isEn ? 'Open in new tab' : 'Mở toàn trang trong tab mới'}
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={() => setLanguage(isEn ? 'vi' : 'en')}
              className="px-2.5 py-1 rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer border border-[#FFD14C] dark:bg-slate-900 dark:text-white dark:border-slate-800 dark:hover:bg-slate-800"
            >
              <span>{isEn ? '🇬🇧 EN' : '🇻🇳 VI'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area with Reading Rail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Left Side: Main Content */}
        <div className="flex-1 min-w-0 pb-24">
          {/* Header */}
          <div className="mb-10 space-y-4">
            <span className="editorial-kicker text-[#0D7287] dark:text-[#9BE7FA] font-bold text-xs sm:text-sm tracking-wider uppercase">
              {kicker}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white leading-[1.18]">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
              {desc}
            </p>
          </div>

          {/* Executive Summary */}
          <div className="mb-16">
            {executiveSummary}
          </div>

          {/* Sections */}
          <div className="space-y-20">
            {children}
          </div>
        </div>

        {/* Right Side: Reading Rail */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-28 self-start">
          <nav className="space-y-1 border-l-2 border-slate-100 dark:border-slate-800 pl-4">
            <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
              {isEn ? 'On this page' : 'Nội dung bài viết'}
            </p>
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => onNavClick(section.id, e)}
                  className={`block py-1.5 text-sm transition-colors relative ${
                    isActive
                      ? 'text-[#0D7287] dark:text-[#9BE7FA] font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
                  }`}
                >
                  {/* Active Indicator Line */}
                  {isActive && (
                    <span className="absolute -left-[18px] top-0 bottom-0 w-0.5 bg-[#0D7287] dark:bg-[#9BE7FA] rounded-r-full" />
                  )}
                  {section.label}
                </a>
              );
            })}
          </nav>
        </aside>
      </div>
    </div>
  );
}
