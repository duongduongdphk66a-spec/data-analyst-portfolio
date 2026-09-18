'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Home, Briefcase, FileText, UserCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '@/components/site/Sidebar';
import CommandPalette from '@/components/ui/CommandPalette';
import Link from 'next/link';
import { ProjectData } from '../types';

export default function MainLayoutClient({ children, initialProjects = [] }: { children: React.ReactNode, initialProjects?: ProjectData[] }) {
  const { language, setLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  const mainRef = useRef<HTMLElement>(null);

  // Scroll to top on path change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
  ];

  return (
    <div className="flex h-screen bg-[#FAFDFE] text-slate-900 font-sans overflow-hidden dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-200">
      {/* 
        NOTE: Sidebar relies on PortfolioDataContext. To fully sever the tie, Sidebar would need projects as props.
        But let's leave it as is if it pulls from PortfolioDataContext. If it's a Server Sidebar later, we'll update it.
      */}
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#0B0F17]">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#FAFDFE] text-slate-900 h-14 flex items-center justify-between px-4 border-b border-slate-200/80 flex-shrink-0 z-30 dark:bg-[#0B0F17] dark:border-slate-800 dark:text-white transition-colors duration-200 font-sans">
          <div className="font-heading font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            <Link href="/">MVH</Link>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-[#FFD14C]" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')} className="px-2 py-0.5 rounded text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              {language.toUpperCase()}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-[#FAFDFE] relative dark:bg-[#0B0F17] transition-colors duration-200 mb-16 md:mb-0 pb-safe">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#FAFDFE]/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-around z-50 px-2 pb-safe-bottom">
          {navItems.map((item) => {
            const isActive = pathname === item.id || (item.id === '/projects' && pathname.startsWith('/projects'));
            return (
              <Link
                key={item.id}
                href={item.id}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive
                    ? 'text-[#0D7287] dark:text-[#9BE7FA]'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#0D7287] dark:text-[#9BE7FA]' : ''}`} />
                <span className={`text-[10px] font-semibold ${isActive ? 'font-bold' : ''}`}>
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
          window.location.href = url;
        }}
        onSelectProject={(id) => {
          window.location.href = `/projects/${id}`;
        }}
      />
    </div>
  );
}
