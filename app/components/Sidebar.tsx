'use client';

import React from 'react';
import Image from 'next/image';
import { 
  ChevronDown, ChevronRight, Github, Linkedin, Mail, 
  Sun, Moon, Laptop, Globe, Search, Database, Terminal,
  Home, UserCheck, FileText, Briefcase, LayoutDashboard
} from 'lucide-react';
import { ProjectData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { sanitizeUrl } from '../lib/security';

interface SidebarProps {
  activeTab: string;
  onTabChange: (_tab: string) => void;
  projects: ProjectData[];
  isProjectsOpen: boolean;
  setIsProjectsOpen: (_open: boolean) => void;
  onProjectClick: (_projId: string) => void;
  selectedProjectId?: string | null;
  onOpenCommandPalette?: () => void;
  onOpenAdmin?: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  projects,
  isProjectsOpen,
  setIsProjectsOpen,
  onProjectClick,
  selectedProjectId,
  onOpenCommandPalette,
  onOpenAdmin,
}: SidebarProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { profile, dbStatus } = usePortfolioData();
  const safeAvatarUrl = profile.avatarUrl ? sanitizeUrl(profile.avatarUrl) : '';

  const navItems = [
    { id: 'home', label: t('nav_home', 'Trang Chủ'), icon: Home },
    { id: 'projects', label: t('nav_projects', 'Dự Án'), icon: Briefcase, hasChildren: true },
    { id: 'lab', label: t('nav_lab', 'Interactive Lab'), icon: Terminal },
    { id: 'dashboard', label: t('nav_dashboard', 'Bảng Điều Khiển'), icon: LayoutDashboard },
    { id: 'cv', label: t('nav_cv', 'Học Vấn & Kinh Nghiệm'), icon: FileText },
    { id: 'about', label: t('nav_about', 'Giới Thiệu'), icon: UserCheck },
  ];

  return (
    <aside 
      aria-label="Thanh điều hướng chính"
      className="w-64 bg-[#FAFDFE] text-slate-900 flex-col hidden md:flex h-full flex-shrink-0 select-none border-r border-slate-200/80 shadow-2xs relative z-40 transition-colors duration-200 dark:bg-[#0B0F17] dark:border-slate-800 dark:text-slate-200 font-sans"
    >
      {/* Top Header: User Profile Card */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          {safeAvatarUrl && safeAvatarUrl !== '#' ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 relative">
              <Image 
                src={safeAvatarUrl} 
                alt={profile.name || 'Avatar'} 
                width={40} 
                height={40} 
                className="w-full h-full object-cover" 
                unoptimized={safeAvatarUrl.startsWith('data:') || safeAvatarUrl.startsWith('blob:')}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 dark:bg-slate-800">
              {profile.name ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 3).toUpperCase() : 'MVH'}
            </div>
          )}
          <div className="overflow-hidden min-w-0">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {profile.name || 'Ma Văn Hùng'}
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              {profile.title || 'Data Analyst'}
            </p>
          </div>
        </div>

        {/* Quick Search / Command Palette (Ctrl+K) */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            aria-label="Mở bảng tìm kiếm và lệnh nhanh (Ctrl+K)"
            className="w-full mt-3 flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-950 border border-slate-200/80 rounded-xl text-xs font-medium transition-all cursor-pointer dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{language === 'en' ? 'Quick search...' : 'Tìm kiếm nhanh...'}</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 font-mono text-[10px] text-slate-500 border border-slate-200 dark:border-slate-700">
              Ctrl K
            </kbd>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-visible">
        {navItems.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'projects' && activeTab === 'project-detail');
          const ItemIcon = item.icon;

          return (
            <div key={item.id} className="flex flex-col">
              <button
                type="button"
                onClick={() => {
                  if (item.hasChildren) {
                    if (activeTab === 'projects') {
                      setIsProjectsOpen(!isProjectsOpen);
                    } else {
                      onTabChange(item.id);
                      setIsProjectsOpen(true);
                    }
                  } else {
                    onTabChange(item.id);
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
              </button>

              {/* Sub-projects nested list */}
              {item.hasChildren && isProjectsOpen && (
                <div className="flex flex-col gap-0.5 mt-1 pl-6 pr-1 animate-in slide-in-from-top-1 duration-150">
                  {projects.map((proj) => {
                    const isSelected = activeTab === 'project-detail' && selectedProjectId === proj.id;
                    return (
                      <button
                        type="button"
                        key={proj.id}
                        onClick={() => onProjectClick(proj.id)}
                        className={`text-left text-[11px] py-1.5 px-2.5 font-medium rounded-lg transition-all truncate cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-slate-100 text-slate-950 font-bold dark:bg-slate-900 dark:text-[#9BE7FA]'
                            : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/40'
                        }`}
                        title={proj.title}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-[#FFD14C]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        <span className="truncate">{proj.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Controls & System Settings */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2 bg-slate-50/40 dark:bg-slate-900/30">
        {/* Quick Admin CMS Trigger */}
        {onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            aria-label="Mở trang quản trị CMS"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>{language === 'en' ? 'Admin CMS' : 'Quản trị CMS'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-[#FFD14C]'}`} />
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {dbStatus.connected ? 'MySQL' : 'Local'}
              </span>
            </div>
          </button>
        )}

        {/* Theme & Language Controls Bar */}
        <div className="flex items-center justify-between gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          {/* Theme Selector (Light / Dark / System) */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setTheme('light')}
              aria-label="Chế độ sáng"
              title="Chế độ sáng"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                theme === 'light' 
                  ? 'bg-slate-100 text-slate-950 font-bold dark:bg-slate-800' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              aria-label="Chế độ tối"
              title="Chế độ tối"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-slate-100 text-slate-950 font-bold dark:bg-slate-800 dark:text-[#9BE7FA]' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              aria-label="Chế độ theo hệ thống"
              title="Chế độ hệ thống"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                theme === 'system' 
                  ? 'bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-200' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            aria-label={`Đổi ngôn ngữ (Hiện tại: ${language === 'vi' ? 'Tiếng Việt' : 'English'})`}
            title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-between pt-1 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn Profile"
              className="p-1.5 rounded-lg hover:bg-white/70 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
              title="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://github.com/duongduongdphk66a-spec/data-analyst-portfolio" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub Repository"
              className="p-1.5 rounded-lg hover:bg-white/70 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
              title="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a 
              href="mailto:mavanhung.da@gmail.com" 
              aria-label="Email Ma Văn Hùng"
              className="p-1.5 rounded-lg hover:bg-white/70 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
              title="Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>

          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-500 font-medium">v2.13</span>
        </div>
      </div>
    </aside>
  );
}
