'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Home, Briefcase, FileText, UserCheck, BookOpen, Search, Download } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '@/components/site/Sidebar';
import CommandPalette from '@/components/ui/CommandPalette';
import Link from 'next/link';
import { ProjectData } from '../types';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function MainLayoutClient({ children, initialProjects = [] }: { children: React.ReactNode, initialProjects?: ProjectData[] }) {
  const { language } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Scroll to top on path change (Window/Document level)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: '/', label: language === 'en' ? 'Home' : 'Trang Chủ', icon: Home },
    { id: '/projects', label: language === 'en' ? 'Work' : 'Dự Án', icon: Briefcase, hasChildren: true },
    { id: '/experience', label: language === 'en' ? 'Experience' : 'Kinh Nghiệm', icon: FileText },
    { id: '/about', label: language === 'en' ? 'About' : 'Giới Thiệu', icon: UserCheck },
    { id: '/blog', label: language === 'en' ? 'Blog' : 'Blog', icon: BookOpen },
  ];

  return (
    <div className="min-h-dvh w-full bg-ground text-slate-900 font-sans dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-200 flex flex-col md:flex-row">
      {/* 1. Skip Link cho bàn phím & screen reader */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[#0D7287] focus:text-white dark:focus:bg-[#9BE7FA] dark:focus:text-slate-950 focus:font-bold focus:shadow-lg focus:outline-none"
      >
        {language === 'en' ? 'Skip to main content' : 'Chuyển tới nội dung chính (Skip to content)'}
      </a>

      {/* 2. Sidebar cố định ở màn hình desktop, cuộn độc lập nếu dài hơn viewport */}
      <aside
        aria-label={language === 'en' ? 'Primary Navigation' : 'Thanh điều hướng chính'}
        className="hidden md:flex md:w-20 lg:w-64 shrink-0 md:sticky md:top-0 md:h-dvh md:overflow-y-auto border-r border-slate-200/80 dark:border-slate-800 z-40"
      >
        <Sidebar />
      </aside>

      {/* 3. Main Content cuộn tự nhiên ở cấp Document/Window */}
      <div className="flex-1 min-w-0 flex flex-col bg-white dark:bg-[#0B0F17]">
        {/* Mobile Header */}
        <header className="md:hidden bg-ground text-slate-900 h-14 flex items-center justify-between px-3 border-b border-slate-200/80 flex-shrink-0 z-30 dark:bg-[#0B0F17] dark:border-slate-800 dark:text-white transition-colors duration-200 font-sans sticky top-0 backdrop-blur-md">
          <div className="font-heading font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            <Link href="/" aria-label="Trang chủ MVH">MVH</Link>
          </div>
          <div className="flex items-center gap-1">
            {/* Quick search (Ctrl+K) trigger button on mobile (min-h-[44px] min-w-[44px]) */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              aria-label="Tìm kiếm nhanh (Ctrl+K)"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#074553] dark:text-[#9BE7FA]" />
            </button>

            {/* Quick download CV button on mobile (min-h-[44px] min-w-[44px]) */}
            <a
              href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tải CV"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </a>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-[#FFD14C]" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <LanguageToggle size="sm" />
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" ref={mainRef} className="flex-1 min-w-0 max-w-full overflow-x-hidden bg-ground relative dark:bg-[#0B0F17] transition-colors duration-200 mb-16 md:mb-0 pb-safe focus:outline-none">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav
          aria-label="Thanh điều hướng di động"
          className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-ground/95 dark:bg-[#0B0F17]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-around z-50 px-2 pb-safe-bottom"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.id || (item.id === '/projects' && pathname.startsWith('/projects'));
            return (
              <Link
                key={item.id}
                href={item.id}
                aria-current={isActive ? 'page' : undefined}
                className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive
                    ? 'text-[#0D7287] dark:text-[#9BE7FA]'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#0D7287] dark:text-[#9BE7FA]' : ''}`} />
                <span className={`text-xs font-semibold ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        projects={initialProjects}
        onSelectTab={(tab) => {
          const url = tab === 'home' ? '/' : `/${tab}`;
          router.push(url);
        }}
        onSelectProject={(id) => {
          router.push(`/projects/${id}`);
        }}
      />
    </div>
  );
}

