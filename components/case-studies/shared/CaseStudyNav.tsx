'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ExternalLink, List } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';

export interface CaseStudyNavItem {
  id: string;
  label: string;
}

interface CaseStudyNavProps {
  isEn: boolean;
  /** Short project name shown in the breadcrumb ("Dự án / <projectTitle>"). */
  projectTitle: string;
  onBack: () => void;
  isEmbedded?: boolean;
  /** Standalone URL used by the "open in new tab" button when embedded. */
  standaloneHref?: string;
  /** Optional center content, e.g. Kami Ely's Science / Shop / Creator tabs. */
  centerSlot?: React.ReactNode;
  /** Optional extra buttons placed before the language toggle (e.g. GitHub link). */
  extraActions?: React.ReactNode;
  navItems: CaseStudyNavItem[];
  activeSection: string;
  scrollProgress: number;
  onNavClick: (_id: string, _e: React.MouseEvent) => void;
  /** Heading shown at the top of the table-of-contents dropdown. */
  tocTitle: string;
  subnavContainerRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Shared sticky navbar for every case study.
 * Row 1: breadcrumb back-link · optional center slot · actions + language toggle
 * Row 2: table-of-contents dropdown · reading progress
 */
export default function CaseStudyNav({
  isEn,
  projectTitle,
  onBack,
  isEmbedded,
  standaloneHref,
  centerSlot,
  extraActions,
  navItems,
  activeSection,
  scrollProgress,
  onNavClick,
  tocTitle,
  subnavContainerRef,
}: CaseStudyNavProps) {
  const [isTocOpen, setIsTocOpen] = useState(false);
  const activeItem = navItems.find((item) => item.id === activeSection) || navItems[0];
  const progress = Math.max(0, Math.min(100, Math.round(scrollProgress)));

  return (
    <nav className="sticky top-0 z-50 bg-ground/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Row 1 */}
      <div className="page-container h-14 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="group flex items-center gap-2 min-w-0 text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-brand-teal group-hover:-translate-x-0.5 transition-transform" />
          <span className="shrink-0">{isEn ? 'Projects' : 'Dự án'}</span>
          <span className={`text-slate-300 dark:text-slate-600 ${centerSlot ? 'hidden lg:inline' : 'hidden sm:inline'}`}>/</span>
          <span
            className={`truncate font-bold text-slate-900 dark:text-white max-w-[260px] ${centerSlot ? 'hidden lg:inline' : 'hidden sm:inline'}`}
          >
            {projectTitle}
          </span>
        </button>

        {centerSlot && <div className="flex justify-center shrink-0">{centerSlot}</div>}

        <div className="flex items-center gap-2 shrink-0">
          {extraActions}
          {isEmbedded && standaloneHref && (
            <a
              href={standaloneHref}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl border border-brand-blue-light bg-white text-slate-600 hover:text-brand-teal dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 transition-colors"
              title={isEn ? 'Open in new tab' : 'Mở toàn trang trong tab mới'}
              aria-label={isEn ? 'Open in new tab' : 'Mở toàn trang trong tab mới'}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <LanguageToggle />
        </div>
      </div>

      {/* Row 2: TOC + progress */}
      <div ref={subnavContainerRef} className="border-t border-slate-200/70 dark:border-slate-800/80">
        <div className="page-container py-1.5 flex items-center justify-between gap-3">
          <div className="relative min-w-0">
            <button
              type="button"
              onClick={() => setIsTocOpen((open) => !open)}
              aria-expanded={isTocOpen}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-brand-blue-light dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:border-brand-blue-vivid transition-colors cursor-pointer max-w-full"
            >
              <List className="w-3.5 h-3.5 shrink-0 text-brand-teal" />
              <span className="font-semibold shrink-0">{isEn ? 'Contents:' : 'Mục lục:'}</span>
              <span className="truncate max-w-[150px] sm:max-w-[260px] font-bold text-brand-teal">
                {activeItem?.label}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform ${isTocOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTocOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsTocOpen(false)} />
                <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 max-h-96 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-brand-blue-light dark:border-slate-800 shadow-xl z-50 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 font-mono text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    <span className="truncate">{tocTitle}</span>
                    <span className="shrink-0">
                      {navItems.length} {isEn ? 'sections' : 'mục'}
                    </span>
                  </div>
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-tab-${item.id}`}
                        type="button"
                        onClick={(e) => {
                          onNavClick(item.id, e);
                          setIsTocOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-brand-blue-light/40 dark:bg-brand-blue-vivid/15 text-brand-teal font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-brand-teal shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div
            className="flex items-center gap-2 shrink-0 font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400"
            aria-label={isEn ? `Reading progress ${progress}%` : `Tiến độ đọc ${progress}%`}
          >
            <span>{progress}%</span>
            <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-brand-teal transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Thin progress line */}
      <div className="h-0.5 w-full bg-brand-blue-vivid/20 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-teal to-brand-blue-vivid transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </nav>
  );
}
