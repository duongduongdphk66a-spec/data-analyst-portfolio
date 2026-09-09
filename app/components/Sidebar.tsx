'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Github, Linkedin, 
  Sun, Moon, Download,
  UserCheck, FileText, Briefcase, Home, FlaskConical
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../context/PortfolioDataContext';

export default function Sidebar() {
  const { language, setLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { profile, projects } = usePortfolioData();
  const pathname = usePathname();
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const navItems = [
    { id: '/', label: language === 'en' ? 'Home' : 'Trang Chủ', icon: Home, hasChildren: false },
    { id: '/projects', label: language === 'en' ? 'Work' : 'Dự Án', icon: Briefcase, hasChildren: true },
    { id: '/experience', label: language === 'en' ? 'Experience' : 'Kinh Nghiệm', icon: FileText, hasChildren: false },
    { id: '/about', label: language === 'en' ? 'About' : 'Giới Thiệu', icon: UserCheck, hasChildren: false },
    { id: '/lab', label: language === 'en' ? 'Interactive Lab' : 'Thực Hành Lab', icon: FlaskConical, hasChildren: false },
  ];

  return (
    <aside 
      aria-label="Thanh điều hướng chính"
      className="w-64 bg-[#FAFDFE] text-slate-900 flex-col hidden md:flex h-full flex-shrink-0 select-none border-r border-slate-200/80 shadow-2xs relative z-40 transition-colors duration-200 dark:bg-[#0B0F17] dark:border-slate-800 dark:text-slate-200 font-sans"
    >
      {/* Top Header: Brand Identity (MVH) */}
      <div className="p-6 pb-2">
        <Link href="/" className="flex flex-col gap-1 inline-block">
          <h2 className="text-xl font-heading font-black text-slate-950 dark:text-white tracking-tight hover:text-[#0D7287] dark:hover:text-[#9BE7FA] transition-colors">
            {profile.name || 'MVH'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {profile.title || 'Data Analyst'}
          </p>
        </Link>
      </div>

      {/* Main Editorial Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto overflow-x-visible">
        {navItems.map((item) => {
          const isActive = pathname === item.id || (item.id === '/projects' && pathname.startsWith('/projects'));
          const ItemIcon = item.icon;

          return (
            <div key={item.id} className="flex flex-col">
              <Link
                href={item.id}
                onClick={(e) => {
                  if (item.hasChildren) {
                    if (pathname.startsWith('/projects')) {
                      e.preventDefault();
                      setIsProjectsOpen(!isProjectsOpen);
                    } else {
                      setIsProjectsOpen(true);
                    }
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer text-left text-xs font-semibold group ${
                  isActive
                    ? 'bg-slate-100 text-slate-950 font-bold border-l-3 border-[#0D7287] dark:bg-slate-900 dark:text-white dark:border-[#9BE7FA]'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ItemIcon className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? 'text-[#0D7287] dark:text-[#9BE7FA]' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.hasChildren && (
                  isProjectsOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </Link>

              {/* Sub-projects nested list */}
              {item.hasChildren && isProjectsOpen && (
                <div className="flex flex-col gap-0.5 mt-1 pl-6 pr-1 animate-in slide-in-from-top-1 duration-150">
                  {projects.map((proj) => {
                    const isSelected = pathname === `/projects/${proj.id}`;
                    return (
                      <Link
                        key={proj.id}
                        href={`/projects/${proj.id}`}
                        className={`text-left text-[11px] py-1.5 px-2.5 font-medium rounded-lg transition-all truncate cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-slate-100 text-slate-950 font-bold dark:bg-slate-900 dark:text-[#9BE7FA]'
                            : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/40'
                        }`}
                        title={proj.title}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-[#FFD14C]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        <span className="truncate">{proj.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Editorial Divider */}
        <div className="pt-3 pb-2 px-2">
          <div className="border-t border-slate-200/80 dark:border-slate-800" />
        </div>

        {/* Direct Action: Download CV */}
        <div className="px-2 pt-6">
          <a
            href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span>{language === 'en' ? 'Download CV' : 'Tải CV'}</span>
          </a>
        </div>
      </nav>

      {/* Footer Controls */}
      <div className="p-6 space-y-6">
        {/* Minimal Social Links */}
        <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
          {profile.linkedin && profile.linkedin !== '#' && (
            <a 
              href={profile.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn Profile"
              className="hover:text-[#0D7287] dark:hover:text-[#9BE7FA] transition-colors cursor-pointer"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {profile.github && profile.github !== '#' && (
            <a 
              href={profile.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub Repository"
              className="hover:text-[#0D7287] dark:hover:text-[#9BE7FA] transition-colors cursor-pointer"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Language & Theme Controls Bar */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
            className="text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer uppercase"
          >
            {language === 'en' ? 'VI' : 'EN'}
          </button>
          
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Đổi chế độ sáng / tối"
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
