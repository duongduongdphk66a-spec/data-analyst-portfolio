'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Github, Linkedin, 
  Sun, Moon, Download,
  UserCheck, FileText, Briefcase, Home,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';
import { usePortfolioData } from '@/app/context/PortfolioDataContext';

export default function Sidebar() {
  const { language, setLanguage } = useLanguage();
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
  ];

  return (
    <aside 
      aria-label="Thanh điều hướng chính"
      className="w-64 bg-[#9BE7FA] text-slate-900 flex-col hidden md:flex h-full flex-shrink-0 select-none border-r border-[#7adcf5] shadow-xl relative z-40 font-sans overflow-hidden transition-all duration-300"
    >
      {/* Ambient Soft Light Glow Orbs */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/40 rounded-full blur-2xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 -right-20 w-44 h-44 bg-white/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-44 h-44 bg-[#C8EEF7]/50 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header: Brand Identity (MVH) */}
      <div className="p-5 pb-3 relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white text-[#074553] shadow-[0_2px_10px_rgba(7,69,83,0.12)] border border-white/80 group-hover:scale-105 group-hover:bg-white/95 transition-all duration-300 shrink-0 flex items-center justify-center">
            <span className="font-heading font-black text-sm text-[#074553] tracking-wider">
              {profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('') : 'MVH'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-base font-heading font-black text-slate-950 tracking-tight group-hover:text-[#074553] transition-colors truncate">
              {profile.name || 'Ma Văn Hùng'}
            </h2>
            <p className="text-[11px] text-[#074553] font-mono font-bold tracking-wide truncate">
              {profile.title || 'Data Analyst'}
            </p>
          </div>
        </Link>

        {/* Live Status Badge */}
        <div className="mt-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-white text-[10px] font-bold text-[#074553] shadow-2xs backdrop-blur-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#074553] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#074553]"></span>
            </span>
            <span>{language === 'en' ? 'Open for Analytics' : 'Sẵn sàng nhận dự án DA'}</span>
          </div>
        </div>

        {/* Quick Search trigger (Command Palette) */}
        <div className="mt-3">
          <button
            type="button"
            onClick={openCommandPalette}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-800 border border-white hover:border-[#074553]/25 text-xs transition-all duration-200 group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#074553] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-800 group-hover:text-slate-950">
                {language === 'en' ? 'Quick search...' : 'Tìm kiếm nhanh...'}
              </span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-[#074553]/10 border border-[#074553]/15 text-[9px] font-mono font-black text-[#074553]">
              Ctrl K
            </kbd>
          </button>
        </div>
      </div>

      {/* Main Editorial Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto overflow-x-visible relative z-10 scrollbar-thin scrollbar-thumb-white/20">
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left text-xs group ${
                  isActive
                    ? 'bg-white text-[#074553] font-black shadow-[0_4px_14px_rgba(7,69,83,0.12)] border-l-4 border-[#074553] translate-x-1'
                    : 'text-slate-900 font-bold hover:text-[#074553] hover:bg-white/60 hover:translate-x-1 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ItemIcon 
                    className={`w-4 h-4 transition-all duration-200 group-hover:scale-110 ${
                      isActive 
                        ? 'text-[#074553] scale-105' 
                        : 'text-[#074553]/80 group-hover:text-[#074553]'
                    }`} 
                  />
                  <span>{item.label}</span>
                </div>
                {item.hasChildren && (
                  isProjectsOpen ? (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-[#074553]' : 'text-[#074553]/70'}`} />
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-[#074553]' : 'text-slate-600 group-hover:text-[#074553]'}`} />
                  )
                )}
              </Link>

              {/* Sub-projects nested list */}
              {item.hasChildren && isProjectsOpen && (
                <div className="flex flex-col gap-1 mt-1 pl-4 ml-3 border-l-2 border-[#074553]/25 animate-in slide-in-from-top-1 duration-200">
                  {projects.map((proj) => {
                    const isSelected = pathname === `/projects/${proj.id}`;
                    return (
                      <Link
                        key={proj.id}
                        href={`/projects/${proj.id}`}
                        className={`text-left text-[11px] py-1.5 px-2.5 font-bold rounded-lg transition-all duration-150 truncate cursor-pointer flex items-center gap-2 group ${
                          isSelected
                            ? 'bg-white text-[#074553] font-black shadow-xs'
                            : 'text-slate-800 hover:text-[#074553] hover:bg-white/60 hover:translate-x-0.5'
                        }`}
                        title={proj.title}
                      >
                        {isSelected ? (
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#074553] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#074553]"></span>
                          </span>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#074553]/40 group-hover:bg-[#074553] transition-colors" />
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

        {/* Editorial Divider */}
        <div className="pt-3 pb-2 px-2">
          <div className="border-t border-[#074553]/15" />
        </div>

        {/* Direct Action: Download CV with Shimmer Effect */}
        <div className="px-1 pt-1">
          <a
            href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden group p-2.5 rounded-xl bg-white hover:bg-white/95 border border-white hover:border-[#074553]/25 shadow-[0_3px_12px_rgba(7,69,83,0.08)] hover:shadow-[0_6px_20px_rgba(7,69,83,0.15)] transition-all duration-300 flex items-center justify-between cursor-pointer"
          >
            {/* Shimmer light sweep animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 ease-out pointer-events-none" />

            <div className="flex items-center gap-2.5 text-xs font-extrabold text-slate-950 relative z-10">
              <div className="p-1.5 rounded-lg bg-[#C8EEF7] text-[#074553] group-hover:scale-110 transition-transform">
                <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span>{language === 'en' ? 'Download CV' : 'Tải CV Chi Tiết'}</span>
                <span className="text-[10px] font-mono font-bold text-[#074553]/80">PDF • 2026 Update</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-[#FFD14C] text-slate-950 shadow-2xs relative z-10">
              CV
            </span>
          </a>
        </div>
      </nav>

      {/* Footer Controls */}
      <div className="p-4 pt-3 space-y-3 relative z-10 border-t border-[#074553]/15 bg-white/20 backdrop-blur-xs">
        {/* Social Links & Controls Row */}
        <div className="flex items-center justify-between">
          {/* Social Links */}
          <div className="flex items-center gap-2 text-slate-900">
            {profile.linkedin && profile.linkedin !== '#' && (
              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn Profile"
                className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-[#074553] hover:text-slate-950 border border-white hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
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
                className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-[#074553] hover:text-slate-950 border border-white hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Language & Theme Controls Bar */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
              className="px-2 py-1 rounded-lg bg-white/70 hover:bg-white text-slate-950 font-mono text-[11px] font-black transition-all border border-white hover:shadow-xs cursor-pointer uppercase"
              title={language === 'en' ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
            >
              {language === 'en' ? 'VI' : 'EN'}
            </button>
            
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Đổi chế độ sáng / tối"
              className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-[#074553] hover:text-amber-500 transition-all border border-white hover:shadow-xs hover:rotate-12 cursor-pointer"
              title="Đổi theme Sáng / Tối"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-[#074553]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
