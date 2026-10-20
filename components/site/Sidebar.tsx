'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Github, Linkedin, 
  Sun, Moon, Download,
  UserCheck, FileText, Briefcase, Home, BookOpen,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';
import { usePortfolioData } from '@/app/context/PortfolioDataContext';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function Sidebar() {
  const { language } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { profile, projects } = usePortfolioData();
  const pathname = usePathname();
  const [isProjectsOpen, setIsProjectsOpen] = useState(
    pathname.startsWith('/projects')
  );

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  const navItems = [
    { id: '/', label: language === 'en' ? 'Home' : 'Trang Chủ', icon: Home, hasChildren: false },
    { id: '/projects', label: language === 'en' ? 'Work' : 'Dự Án', icon: Briefcase, hasChildren: true },
    { id: '/experience', label: language === 'en' ? 'Experience' : 'Kinh Nghiệm', icon: FileText, hasChildren: false },
    { id: '/about', label: language === 'en' ? 'About' : 'Giới Thiệu', icon: UserCheck, hasChildren: false },
    { id: '/blog', label: language === 'en' ? 'Blog' : 'Blog Phân Tích', icon: BookOpen, hasChildren: false },
  ];

  return (
    <aside 
      aria-label="Thanh điều hướng chính"
      className="w-20 lg:w-64 bg-slate-50/90 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex-col hidden md:flex h-full flex-shrink-0 select-none border-r border-slate-200/80 dark:border-slate-800 relative z-40 font-sans overflow-hidden transition-[width] duration-300 backdrop-blur-md" /* taste-skill-ignore: sidebar layout boundary */
    >
      {/* Single subtle ambient brand glow (reduced from 3 blur halos) */}
      <div className="absolute -top-20 -left-20 w-44 h-44 bg-[#9BE7FA]/20 dark:bg-[#9BE7FA]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Brand Identity (MVH) */}
      <div className="p-3 lg:p-5 pb-3 relative z-10">
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-3 group" title={profile.name || 'Ma Văn Hùng'}>
          <div className="w-10 h-10 rounded-xl bg-[#9BE7FA] text-slate-950 border border-[#0D7287]/20 group-hover:scale-105 transition-transform duration-300 shrink-0 flex items-center justify-center">
            <span className="font-heading font-black text-sm text-slate-950">
              {profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('') : 'MVH'}
            </span>
          </div>
          <div className="hidden lg:flex flex-col min-w-0">
            <h2 className="text-base font-heading font-black text-slate-950 dark:text-white tracking-tight group-hover:text-[#0D7287] dark:group-hover:text-[#9BE7FA] transition-colors truncate">
              {profile.name || 'Ma Văn Hùng'}
            </h2>
            <p className="text-xs text-[#0D7287] dark:text-[#9BE7FA] font-semibold truncate">
              {profile.title || 'Data Analyst'}
            </p>
          </div>
        </Link>

        {/* Live Status Badge */}
        <div className="hidden lg:block mt-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <span className="inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
            <span>{language === 'en' ? 'Open for Analytics' : 'Sẵn sàng nhận dự án DA'}</span>
          </div>
        </div>
        <div className="lg:hidden flex justify-center mt-3" title={language === 'en' ? 'Open for Analytics' : 'Sẵn sàng nhận dự án DA'}>
          <span className="inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
        </div>

        {/* Quick Search trigger (Command Palette) */}
        <div className="hidden lg:block mt-3">
          <button
            type="button"
            onClick={openCommandPalette}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 text-xs transition-colors duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-[#0D7287] dark:group-hover:text-[#9BE7FA] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white">
                {language === 'en' ? 'Quick search...' : 'Tìm kiếm nhanh...'}
              </span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400">
              Ctrl K
            </kbd>
          </button>
        </div>
        <div className="lg:hidden flex justify-center mt-3">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label={language === 'en' ? 'Quick search' : 'Tìm kiếm nhanh'}
            title={language === 'en' ? 'Quick search (Ctrl K)' : 'Tìm kiếm nhanh (Ctrl K)'}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors duration-200 cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Editorial Navigation */}
      <nav className="flex-1 px-2 lg:px-3 py-2 space-y-1 overflow-y-auto overflow-x-visible relative z-10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {navItems.map((item) => {
          const isActive = pathname === item.id || (item.id === '/projects' && pathname.startsWith('/projects'));
          const ItemIcon = item.icon;

          return (
            <div key={item.id} className="flex flex-col">
              <Link
                href={item.id}
                title={item.label}
                onClick={(e) => {
                  if (item.hasChildren) {
                    const isDesktopRail = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
                    if (!isDesktopRail) return;
                    if (pathname.startsWith('/projects')) {
                      e.preventDefault();
                      setIsProjectsOpen(!isProjectsOpen);
                    } else {
                      setIsProjectsOpen(true);
                    }
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-center lg:justify-between px-2.5 lg:px-3.5 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer text-left text-xs group ${
                  isActive
                    ? 'bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/10 text-[#074553] dark:text-[#9BE7FA] font-black border-l-3 border-[#0D7287] dark:border-[#9BE7FA]'
                    : 'text-slate-600 dark:text-slate-400 font-semibold hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ItemIcon 
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive 
                        ? 'text-[#074553] dark:text-[#9BE7FA]' 
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    }`} 
                  />
                  <span className="hidden lg:inline">{item.label}</span>
                </div>
                {item.hasChildren && (
                  isProjectsOpen ? (
                    <ChevronDown className={`hidden lg:block w-3.5 h-3.5 transition-transform ${isActive ? 'text-[#074553] dark:text-[#9BE7FA]' : 'text-slate-400'}`} />
                  ) : (
                    <ChevronRight className={`hidden lg:block w-3.5 h-3.5 transition-transform ${isActive ? 'text-[#074553] dark:text-[#9BE7FA]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  )
                )}
              </Link>

              {/* Sub-projects nested list */}
              {item.hasChildren && isProjectsOpen && (
                <div className="hidden lg:flex flex-col gap-1 mt-1 pl-4 ml-3 border-l-2 border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-1 duration-200">
                  {projects.map((proj) => {
                    const isSelected = pathname === `/projects/${proj.id}`;
                    return (
                      <Link
                        key={proj.id}
                        href={`/projects/${proj.id}`}
                        className={`text-left text-xs py-1.5 px-2.5 font-bold rounded-lg transition-colors duration-150 truncate cursor-pointer flex items-center gap-2 group ${
                          isSelected
                            ? 'bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 text-[#074553] dark:text-[#9BE7FA] font-black'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                        title={proj.title}
                      >
                        {isSelected ? (
                          <span className="w-2 h-2 rounded-full shrink-0 bg-[#0D7287] dark:bg-[#9BE7FA]" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-700 group-hover:bg-[#0D7287] dark:group-hover:bg-[#9BE7FA] transition-colors" />
                        )}
                        <span className="truncate">{proj.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Editorial Spacing */}
        <div className="pt-2 pb-1" />

        {/* Direct Action: Download CV */}
        <div className="hidden lg:block px-1 pt-1">
          <a
            href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden group p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 hover:border-[#9BE7FA]/60 hover:-translate-y-0.5 active:scale-[0.98] transition-transform duration-200 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-900 dark:text-white relative z-10">
              <div className="p-1.5 rounded-lg bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 text-[#074553] dark:text-[#9BE7FA] group-hover:scale-110 transition-transform">
                <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span>{language === 'en' ? 'Download CV' : 'Tải CV Chi Tiết'}</span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tabular-nums">PDF • 2026</span>
              </div>
            </div>
            <span className="text-xs font-black px-1.5 py-0.5 rounded bg-[#FFD14C] text-slate-950 relative z-10">
              CV
            </span>
          </a>
        </div>
        <div className="lg:hidden flex justify-center px-1 pt-1">
          <a
            href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            title={language === 'en' ? 'Download CV' : 'Tải CV Chi Tiết'}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 text-[#074553] dark:text-[#9BE7FA] transition-colors duration-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </nav>

      {/* Footer Controls */}
      <div className="p-2 lg:p-4 pt-4 space-y-3 relative z-10 bg-slate-100/60 dark:bg-slate-900/60 backdrop-blur-xs">
        {/* Social Links & Controls Row */}
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-2.5 lg:gap-0">
          {/* Social Links */}
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            {profile.linkedin && profile.linkedin !== '#' && (
              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn Profile"
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors duration-200 cursor-pointer"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile.github && profile.github !== '#' && (
              <a 
                href={profile.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub Repository"
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors duration-200 cursor-pointer"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Language & Theme Controls Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-1.5">
            <LanguageToggle size="sm" />
            
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Đổi chế độ sáng / tối"
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-transform border border-slate-200 dark:border-slate-700 hover:rotate-12 cursor-pointer"
              title="Đổi theme Sáng / Tối"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
