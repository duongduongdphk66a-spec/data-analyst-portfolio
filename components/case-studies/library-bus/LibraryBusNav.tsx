'use client';

import React from 'react';
import { Github } from 'lucide-react';
import CaseStudyNav from '../shared/CaseStudyNav';

export interface LibraryBusNavItem {
  id: string;
  label: string;
  chapter: string;
}

interface LibraryBusNavProps {
  onBack?: () => void;
  isEmbedded?: boolean;
  isEn: boolean;
  /** Kept for backward compatibility; the shared LanguageToggle reads the context directly. */
  setLanguage?: (_lang: 'vi' | 'en') => void;
  navItems: LibraryBusNavItem[];
  activeSection: string;
  scrollProgress: number;
  onNavClick: (_id: string, _e: React.MouseEvent) => void;
  subnavContainerRef: React.RefObject<HTMLDivElement | null>;
}

/** Library Bus navbar = shared CaseStudyNav + GitHub repo link in the actions slot. */
export function LibraryBusNav({
  onBack,
  isEmbedded,
  isEn,
  navItems,
  activeSection,
  scrollProgress,
  onNavClick,
  subnavContainerRef,
}: LibraryBusNavProps) {
  const githubLink = (
    <a
      href="https://github.com/duongduongdphk66a-spec/prj"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 rounded-xl border border-brand-blue-light bg-white text-xs font-semibold text-slate-700 hover:text-brand-teal dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 transition-colors"
      title={isEn ? 'View GitHub Repository' : 'Xem mã nguồn trên GitHub'}
      aria-label={isEn ? 'View GitHub Repository' : 'Xem mã nguồn trên GitHub'}
    >
      <Github className="w-4 h-4" />
      <span className="hidden sm:inline">GitHub</span>
    </a>
  );

  return (
    <CaseStudyNav
      isEn={isEn}
      projectTitle={isEn ? 'Library Bus System' : 'Tủ Sách Lưu Động'}
      onBack={onBack ?? (() => undefined)}
      isEmbedded={isEmbedded}
      standaloneHref="/projects/proj-library-bus"
      extraActions={githubLink}
      navItems={navItems}
      activeSection={activeSection}
      scrollProgress={scrollProgress}
      onNavClick={onNavClick}
      tocTitle={isEn ? 'Library Bus Chapters' : 'Các chương Tủ Sách Lưu Động'}
      subnavContainerRef={subnavContainerRef}
    />
  );
}
