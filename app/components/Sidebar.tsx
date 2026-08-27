'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, ChevronRight, Github, Linkedin, Mail, Lock, 
  ShieldCheck, Sun, Moon, Laptop, Globe, Check, Settings
} from 'lucide-react';
import { ProjectData } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  projects: ProjectData[];
  isAdmin: boolean;
  onOpenLogin: () => void;
  isProjectsOpen: boolean;
  setIsProjectsOpen: (open: boolean) => void;
  onProjectClick: (projId: string) => void;
  selectedProjectId?: string | null;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  projects,
  isAdmin,
  onOpenLogin,
  isProjectsOpen,
  setIsProjectsOpen,
  onProjectClick,
  selectedProjectId
}: SidebarProps) {
  const { language, setLanguage, t } = useLanguage();

  // Settings Popover States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'none' | 'language' | 'theme'>('none');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio_theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  // Theme application helper
  const applyTheme = (selectedTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    if (selectedTheme === 'dark') {
      root.classList.add('dark');
    } else if (selectedTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System mode
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleSelectTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('portfolio_theme', newTheme);
    applyTheme(newTheme);
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
    <aside className="w-60 bg-[#C4EEF9] text-slate-800 flex-col hidden md:flex h-full flex-shrink-0 select-none border-r border-[#A8E2F2] shadow-xs relative z-40">
      {/* Navigation Links */}
      <nav className="flex-1 px-4 pt-16 pb-6 space-y-3 overflow-visible">
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
                      ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold shadow-sky-300/40'
                      : 'text-slate-800 hover:text-slate-950 hover:bg-white/40'
                  }`}
                >
                  <span className="underline decoration-slate-400/60 underline-offset-4">{item.label}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-white/60 text-slate-700 font-bold ml-2">
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
                    <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[9px] border-y-transparent border-r-[10px] border-r-white drop-shadow-[-2px_0px_1px_rgba(0,0,0,0.06)]" />

                    {/* Bridge overlay to prevent mouse exit flicker */}
                    <div className="absolute -left-5 top-0 bottom-0 w-6" />

                    {/* Popover Card */}
                    <div className="w-52 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-2 text-slate-800 relative">
                      
                      {/* Menu Item 1: Ngôn Ngữ */}
                      <div 
                        className="relative group/lang"
                        onMouseEnter={() => setActiveSubMenu('language')}
                      >
                        <button
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                            activeSubMenu === 'language' ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-600" />
                            <span>{t('nav_language', 'Ngôn Ngữ')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-bold text-slate-500">{language === 'vi' ? 'VI' : 'EN'}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        </button>

                        {/* Nested Submenu: Languages */}
                        {activeSubMenu === 'language' && (
                          <div className="absolute left-[calc(100%+8px)] top-0 w-48 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                            {/* Bridge */}
                            <div className="absolute -left-3 top-0 bottom-0 w-4" />
                            
                            <button
                              onClick={() => handleSelectLanguage('vi')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                language === 'vi' ? 'bg-[#C4EEF9]/50 text-slate-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-base leading-none">🇻🇳</span>
                                <span>Tiếng Việt</span>
                              </div>
                              {language === 'vi' && <Check className="w-3.5 h-3.5 text-[#155A8A]" />}
                            </button>

                            <button
                              onClick={() => handleSelectLanguage('en')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                language === 'en' ? 'bg-[#C4EEF9]/50 text-slate-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-base leading-none">🇬🇧</span>
                                <span>English</span>
                              </div>
                              {language === 'en' && <Check className="w-3.5 h-3.5 text-[#155A8A]" />}
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
                            activeSubMenu === 'theme' ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-500" /> : theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Laptop className="w-4 h-4 text-slate-600" />}
                            <span>{t('nav_theme', 'Giao Diện')}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {/* Nested Submenu: Theme Options */}
                        {activeSubMenu === 'theme' && (
                          <div className="absolute left-[calc(100%+8px)] top-0 w-44 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                            {/* Bridge */}
                            <div className="absolute -left-3 top-0 bottom-0 w-4" />
                            
                            <button
                              onClick={() => handleSelectTheme('light')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                theme === 'light' ? 'bg-[#C4EEF9]/50 text-slate-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Sun className="w-4 h-4 text-amber-500" />
                                <span>{t('nav_theme_light', 'Sáng')}</span>
                              </div>
                              {theme === 'light' && <Check className="w-3.5 h-3.5 text-[#155A8A]" />}
                            </button>

                            <button
                              onClick={() => handleSelectTheme('dark')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                theme === 'dark' ? 'bg-[#C4EEF9]/50 text-slate-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Moon className="w-4 h-4 text-indigo-500" />
                                <span>{t('nav_theme_dark', 'Tối')}</span>
                              </div>
                              {theme === 'dark' && <Check className="w-3.5 h-3.5 text-[#155A8A]" />}
                            </button>

                            <button
                              onClick={() => handleSelectTheme('system')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                theme === 'system' ? 'bg-[#C4EEF9]/50 text-slate-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Laptop className="w-4 h-4 text-slate-600" />
                                <span>{t('nav_theme_system', 'Hệ thống')}</span>
                              </div>
                              {theme === 'system' && <Check className="w-3.5 h-3.5 text-[#155A8A]" />}
                            </button>
                          </div>
                        )}
                      </div>

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
                    ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold shadow-sky-300/40'
                    : 'text-slate-800 hover:text-slate-950 hover:bg-white/40'
                }`}
              >
                <span>{item.label}</span>
                {item.hasChildren && (
                  isProjectsOpen ? <ChevronDown className="w-4 h-4 text-slate-600" /> : <ChevronRight className="w-4 h-4 text-slate-600" />
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
                            ? 'bg-white text-slate-950 font-bold shadow-xs border border-[#8CE0F4]'
                            : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
                        }`}
                        title={proj.title}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-amber-500 ring-2 ring-amber-200' : 'bg-slate-400'}`}></span>
                        <span className="truncate">{proj.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Divider line before Admin */}
        <div className="pt-2">
          <hr className="border-t-2 border-slate-900/60 my-3" />
        </div>

        {/* Admin Navigation Button */}
        <div>
          <button
            onClick={() => {
              if (isAdmin) {
                onTabChange('admin');
              } else {
                onOpenLogin();
              }
            }}
            className={`w-full flex items-center justify-between px-5 py-3 text-sm sm:text-base font-bold rounded-2xl transition-all duration-200 cursor-pointer text-left ${
              activeTab === 'admin'
                ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold shadow-sky-300/40'
                : 'text-slate-800 hover:text-slate-950 hover:bg-white/40'
            }`}
          >
            <span>{t('nav_admin', 'Admin')}</span>
            {isAdmin && (
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            )}
          </button>
        </div>
      </nav>

      {/* Footer Area: Circular Social Links & Quick Language Toggle */}
      <div className="p-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 hover:bg-slate-800 transition-all shadow-sm"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4 fill-white text-white" />
          </a>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 hover:bg-slate-800 transition-all shadow-sm"
            title="GitHub"
          >
            <Github className="w-4 h-4 fill-white text-white" />
          </a>
          <a 
            href="mailto:analyst@example.com" 
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 hover:bg-slate-800 transition-all shadow-sm"
            title="Email"
          >
            <Mail className="w-4 h-4 text-white" />
          </a>
        </div>

        {/* Quick Language Toggle Button */}
        <button
          onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
          className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
        >
          <span>{language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
        </button>
      </div>
    </aside>
  );
}
