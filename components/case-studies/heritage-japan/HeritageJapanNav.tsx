'use client';

import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

interface HeritageJapanNavProps {
  onBack: () => void;
  isEmbedded?: boolean;
  isEn: boolean;
  setLanguage: (_lang: 'vi' | 'en') => void;
  navItems: Array<{ id: string; label: string }>;
  activeSection: string;
  onNavClick: (_id: string, _e: React.MouseEvent) => void;
}

export function HeritageJapanNav({
  onBack,
  isEmbedded,
  isEn,
  setLanguage,
  navItems,
  activeSection,
  onNavClick,
}: HeritageJapanNavProps) {
  const { t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs dark:bg-slate-900/95 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition-colors font-bold text-sm group cursor-pointer dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0D7287] dark:text-[#9BE7FA]" />
          <span>{t('nav_back_to_portfolio', 'Quay lß║íi Portfolio')}</span>
        </button>
        
        <div className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => onNavClick(item.id, e)}
                className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#8CE0F4] text-slate-950 font-black shadow-xs dark:bg-slate-800 dark:text-[#9BE7FA]'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 font-semibold'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {isEmbedded && (
            <a
              href="/projects/proj-heritage-japan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
              title={isEn ? 'Open full page in new tab' : 'Mß╗ƒ to├án trang trong tab mß╗¢i'}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={() => setLanguage(isEn ? 'vi' : 'en')}
            className="px-3 py-1.5 rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700"
            title={isEn ? 'Chuyß╗ân sang Tiß║┐ng Viß╗çt' : 'Switch to English'}
          >
            <span>{isEn ? '≡ƒç¼≡ƒçº English' : '≡ƒç╗≡ƒç│ Tiß║┐ng Viß╗çt'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
