'use client';

import React, { useState, useRef } from 'react';
import { 
  ChevronDown, ChevronRight, Github, Linkedin, Mail, 
  Sun, Moon, Laptop, Globe, Check, Search, Database, Lock
} from 'lucide-react';
import { ProjectData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../context/PortfolioDataContext';

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

  // Settings Popover States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'none' | 'language' | 'theme'>('none');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  const handleSelectLanguage = (newLang: 'vi' | 'en') => {
    setLanguage(newLang);
    setIsSettingsOpen(false);
    setActiveSubMenu('none');
  };

  const handleMouseEnterSettings = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsSettingsOpen(true);
  };

  const handleMouseLeaveSettings = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsSettingsOpen(false);
      setActiveSubMenu('none');
    }, 250);
  };

  const navItems = [
    { id: 'home', label: t('nav_home', 'Trang Chủ') },
    { id: 'about', label: t('nav_about', 'Giới Thiệu') },
    { id: 'cv', label: t('nav_cv', 'Học Vấn & Kinh Nghiệm') },
    { id: 'projects', label: t('nav_projects', 'Dự Án'), hasChildren: true },
    { id: 'dashboard', label: t('nav_dashboard', 'Cài Đặt'), isSettings: true },
  ];

  return (
    <aside className="w-60 bg-[#C4EEF9] text-slate-800 flex-col hidden md:flex h-full flex-shrink-0 select-none border-r border-[#A8E2F2] shadow-xs relative z-40 transition-colors duration-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 font-sans">
      {/* Navigation Links */}
      <nav className="flex-1 px-4 pt-6 pb-6 space-y-2.5 overflow-y-auto overflow-x-visible">
        {/* User Profile Header with Avatar */}
        <div className="flex items-center gap-3 px-3 py-2.5 mb-3 bg-white/50 dark:bg-slate-800/70 rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-xs">
          {profile.avatarUrl ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-cyan-500/40 shrink-0">
              <img src={profile.avatarUrl} alt={profile.name || 'Avatar'} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0D7287] to-cyan-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {profile.name ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 3).toUpperCase() : 'MVH'}
            </div>
          )}
          <div className="overflow-hidden min-w-0">
            <h3 className="text-xs font-black text-slate-900 dark:text-white truncate">
              {profile.name || 'Ma Văn Hùng'}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
              {profile.title || 'Data Analyst'}
            </p>
          </div>
        </div>

        {/* Quick Search / Command Palette Button */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white/60 hover:bg-white text-slate-700 hover:text-slate-950 border border-slate-300/60 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs mb-4 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span>{language === 'en' ? 'Quick Search...' : 'Tìm kiếm nhanh...'}</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 font-mono text-[10px] text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
              Ctrl K
            </kbd>
          </button>
        )}

        {navItems.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'home' && activeTab === 'home') || (item.id === 'projects' && activeTab === 'project-detail');
          
          if (item.isSettings) {
            return (
              <div 
                key={item.id} 
                className="relative"
                onMouseEnter={handleMouseEnterSettings}
                onMouseLeave={handleMouseLeaveSettings}
              >
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-5 py-3 text-sm sm:text-base font-bold rounded-2xl transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold shadow-sky-300/40 dark:bg-slate-800 dark:text-[#9BE7FA] dark:shadow-none'
                      : 'text-slate-800 hover:text-slate-950 hover:bg-white/40 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="underline decoration-slate-400/60 underline-offset-4 dark:decoration-slate-600">{item.label}</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-md bg-white/60 text-slate-700 font-bold ml-2 dark:bg-slate-800 dark:text-slate-300">
                    {language.toUpperCase()}
                  </span>
                </button>

                {/* Settings Speech-Bubble Popover */}
                {isSettingsOpen && (
                  <div 
                    className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseEnter={handleMouseEnterSettings}
                    onMouseLeave={handleMouseLeaveSettings}
                  >
                    {/* Speech bubble pointer arrow */}
                    <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[9px] border-y-transparent border-r-[10px] border-r-white drop-shadow-[-2px_0px_1px_rgba(0,0,0,0.06)] dark:border-r-slate-800" />

                    {/* Bridge overlay to prevent mouse exit flicker */}
                    <div className="absolute -left-5 top-0 bottom-0 w-6" />

                    {/* Popover Card */}
                    <div className="w-52 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-2 text-slate-800 relative dark:bg-slate-900/95 dark:border-slate-800 dark:text-slate-200">
                      
                      {/* Menu Item 1: Ngôn Ngữ */}
                      <div 
                        className="relative group/lang"
                        onMouseEnter={() => setActiveSubMenu('language')}
                      >
                        <button
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                            activeSubMenu === 'language' 
                              ? 'bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white' 
                              : 'hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            <span>{t('nav_language', 'Ngôn Ngữ')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{language === 'vi' ? 'VI' : 'EN'}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        </button>

                        {/* Nested Submenu: Languages */}
                        {activeSubMenu === 'language' && (
                          <div className="absolute left-[calc(100%+8px)] top-0 w-48 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50 dark:bg-slate-900/95 dark:border-slate-800">
                            {/* Bridge */}
                            <div className="absolute -left-3 top-0 bottom-0 w-4" />
                            
                            <button
                              onClick={() => handleSelectLanguage('vi')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                language === 'vi' 
                                  ? 'bg-[#C4EEF9]/50 text-slate-950 font-bold dark:bg-slate-800 dark:text-[#9BE7FA]' 
                                  : 'hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-base leading-none">🇻🇳</span>
                                <span>Tiếng Việt</span>
                              </div>
                              {language === 'vi' && <Check className="w-3.5 h-3.5 text-[#155A8A] dark:text-[#9BE7FA]" />}
                            </button>

                            <button
                              onClick={() => handleSelectLanguage('en')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                language === 'en' 
                                  ? 'bg-[#C4EEF9]/50 text-slate-950 font-bold dark:bg-slate-800 dark:text-[#9BE7FA]' 
                                  : 'hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-base leading-none">🇬🇧</span>
                                <span>English</span>
                              </div>
                              {language === 'en' && <Check className="w-3.5 h-3.5 text-[#155A8A] dark:text-[#9BE7FA]" />}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Menu Item 2: Giao Diện */}
                      <div 
                        className="relative group/theme mt-1"
                        onMouseEnter={() => setActiveSubMenu('theme')}
                      >
                        <button
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                            activeSubMenu === 'theme' 
                              ? 'bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white' 
                              : 'hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                            <span>{t('nav_theme', 'Giao Diện')}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {/* Nested Submenu: Theme Options */}
                        {activeSubMenu === 'theme' && (
                          <div className="absolute left-[calc(100%+8px)] top-0 w-44 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50 dark:bg-slate-900/95 dark:border-slate-800">
                            {/* Bridge */}
                            <div className="absolute -left-3 top-0 bottom-0 w-4" />
                            
                            <button
                              onClick={() => handleSelectTheme('light')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                theme === 'light' 
                                  ? 'bg-[#C4EEF9]/50 text-slate-950 font-bold dark:bg-slate-800 dark:text-[#9BE7FA]' 
                                  : 'hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Sun className="w-4 h-4 text-amber-500" />
                                <span>{t('nav_theme_light', 'Sáng')}</span>
                              </div>
                              {theme === 'light' && <Check className="w-3.5 h-3.5 text-[#155A8A] dark:text-[#9BE7FA]" />}
                            </button>

                            <button
                              onClick={() => handleSelectTheme('dark')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                theme === 'dark' 
                                  ? 'bg-[#C4EEF9]/50 text-slate-950 font-bold dark:bg-slate-800 dark:text-[#9BE7FA]' 
                                  : 'hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Moon className="w-4 h-4 text-indigo-400" />
                                <span>{t('nav_theme_dark', 'Tối')}</span>
                              </div>
                              {theme === 'dark' && <Check className="w-3.5 h-3.5 text-[#155A8A] dark:text-[#9BE7FA]" />}
                            </button>

                            <button
                              onClick={() => handleSelectTheme('system')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                theme === 'system' 
                                  ? 'bg-[#C4EEF9]/50 text-slate-950 font-bold dark:bg-slate-800 dark:text-[#9BE7FA]' 
                                  : 'hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                <span>{t('nav_theme_system', 'Hệ thống')}</span>
                              </div>
                              {theme === 'system' && <Check className="w-3.5 h-3.5 text-[#155A8A] dark:text-[#9BE7FA]" />}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <hr className="border-t border-slate-100 dark:border-slate-800 my-1" />

                      {/* Menu Item 3: Quản Trị & CMS */}
                      {onOpenAdmin && (
                        <button
                          onClick={() => {
                            setIsSettingsOpen(false);
                            onOpenAdmin();
                          }}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer hover:bg-slate-50 text-[#0D7287] dark:text-[#9BE7FA] dark:hover:bg-slate-800/60"
                        >
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                            <span>{language === 'en' ? 'Admin CMS (Locked)' : 'Admin CMS (Khóa)'}</span>
                          </div>
                          <span className={`w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={item.id} className="flex flex-col">
              <button
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
                className={`w-full flex items-center justify-between px-5 py-3 text-sm sm:text-base font-bold rounded-2xl transition-all duration-200 cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold shadow-sky-300/40 dark:bg-slate-800 dark:text-[#9BE7FA] dark:shadow-none'
                    : 'text-slate-800 hover:text-slate-950 hover:bg-white/40 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{item.label}</span>
                {item.hasChildren && (
                  isProjectsOpen ? <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                )}
              </button>

              {/* Sub-projects list if expanded */}
              {item.hasChildren && isProjectsOpen && (
                <div className="flex flex-col gap-1 mt-1.5 pl-5 pr-2 animate-in slide-in-from-top-2 duration-150">
                  {projects.map((proj) => {
                    const isSelected = activeTab === 'project-detail' && selectedProjectId === proj.id;
                    return (
                      <button
                        key={proj.id}
                        onClick={() => onProjectClick(proj.id)}
                        className={`text-left text-xs py-2 px-2.5 font-medium rounded-xl transition-all truncate cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-white text-slate-950 font-bold shadow-xs border border-[#8CE0F4] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700'
                            : 'text-slate-700 hover:text-slate-950 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                        }`}
                        title={proj.title}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-amber-500 ring-2 ring-amber-200 dark:ring-amber-900/50' : 'bg-slate-400 dark:bg-slate-600'}`}></span>
                        <span className="truncate">{proj.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Quick Admin CMS Edit Trigger Button */}
        {onOpenAdmin && (
          <div className="pt-4">
            <button
              onClick={onOpenAdmin}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/50 hover:bg-white text-slate-800 hover:text-slate-950 border border-slate-300/60 dark:bg-slate-800/60 dark:border-slate-700/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white transition-all text-xs font-extrabold cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>Chỉnh Sửa CMS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {dbStatus.connected ? 'MySQL' : 'Local'}
                </span>
              </div>
            </button>
          </div>
        )}
      </nav>

      {/* Footer Area: Circular Social Links & Quick Language Toggle */}
      <div className="p-6 flex items-center justify-between text-white border-t border-transparent dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-110 hover:bg-slate-800 transition-all shadow-xs dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-700"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4 fill-white text-white" />
          </a>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-110 hover:bg-slate-800 transition-all shadow-xs dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-700"
            title="GitHub"
          >
            <Github className="w-4 h-4 fill-white text-white" />
          </a>
          <a 
            href="mailto:mavanhung.da@gmail.com" 
            className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-110 hover:bg-slate-800 transition-all shadow-xs dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-700"
            title="Email"
          >
            <Mail className="w-4 h-4 text-white" />
          </a>
        </div>

        {/* Quick Language Toggle Button */}
        <button
          onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
          className="px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:border dark:border-slate-700"
          title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
        >
          <span>{language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
        </button>
      </div>
    </aside>
  );
}
