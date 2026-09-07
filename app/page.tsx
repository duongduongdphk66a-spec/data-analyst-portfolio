'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Menu, X, User, FileText, Briefcase, LayoutDashboard, 
  ChevronDown, ChevronRight, Globe, Sun, Moon, Laptop, Database
} from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { usePortfolioData } from './context/PortfolioDataContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageSkeleton } from './components/ui/Skeleton';
import { DEFAULT_DASHBOARD } from './defaultData';

import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import CVSection from './components/CVSection';
import ProjectsSection from './components/ProjectsSection';
import ProjectDetailView from './components/ProjectDetailView';
import CommandPalette from './components/ui/CommandPalette';
import dynamic from 'next/dynamic';

const AdminEditorModal = dynamic(() => import('./components/AdminEditorModal'), {
  ssr: false,
});

const DashboardSection = dynamic(() => import('./components/DashboardSection'), {
  loading: () => <PageSkeleton label="Loading Dashboard..." />,
});

const KamiElyProject = dynamic(() => import('./components/KamiElyProject'), {
  loading: () => <PageSkeleton label="Loading Project..." />,
});

const HeritageJapanProject = dynamic(() => import('./components/HeritageJapanProject'), {
  loading: () => <PageSkeleton label="Loading Project..." />,
});

const LibraryBusProject = dynamic(() => import('./components/LibraryBusProject'), {
  loading: () => <PageSkeleton label="Loading Project..." />,
});

// Bespoke case study components mapping
const SPECIAL_CASE_STUDIES: Record<string, React.ComponentType<any>> = {
  'proj-kami-ely': KamiElyProject,
  'proj-heritage-japan': HeritageJapanProject,
  'proj-library-bus': LibraryBusProject,
};

// Tab labels for document title
const TAB_LABELS: Record<string, { vi: string; en: string }> = {
  about: { vi: 'Giới thiệu', en: 'About' },
  home: { vi: 'Trang Chủ', en: 'Home' },
  cv: { vi: 'Học Vấn & Kinh Nghiệm', en: 'CV & Experience' },
  projects: { vi: 'Dự Án', en: 'Projects' },
  dashboard: { vi: 'Executive Dashboard', en: 'Executive Dashboard' },
  'project-detail': { vi: 'Chi tiết Dự án', en: 'Project Detail' },
};

export default function Portfolio() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const { profile, projects, dbStatus } = usePortfolioData();
  const mainRef = useRef<HTMLElement>(null);

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const dashboard = DEFAULT_DASHBOARD;

  // Update document title when tab changes or profile name updates
  useEffect(() => {
    const label = TAB_LABELS[activeTab];
    const suffix = label
      ? (language === 'en' ? label.en : label.vi)
      : activeTab;
    document.title = `${profile.name || 'Ma Văn Hùng'} | ${suffix}`;
  }, [activeTab, language, profile.name]);

  // Handler for tab change
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    if (tabId !== 'project-detail') {
      setSelectedProjectId(null);
    }
    setIsMobileMenuOpen(false);
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Global Keyboard Shortcut: Ctrl + K (Command Palette) & Ctrl + E (Admin CMS)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Open project detail directly in the viewport
  const handleProjectClick = useCallback((projId: string) => {
    setSelectedProjectId(projId);
    setActiveTab('project-detail');
    setIsMobileMenuOpen(false);
  }, []);

  const navItems = [
    { id: 'home', label: t('nav_home', 'Trang Chủ'), icon: User },
    { id: 'about', label: t('nav_about', 'Giới Thiệu'), icon: User },
    { id: 'cv', label: t('nav_cv', 'Học Vấn & Kinh Nghiệm'), icon: FileText },
    { id: 'projects', label: t('nav_projects', 'Dự Án'), icon: Briefcase, hasChildren: true },
    { id: 'dashboard', label: t('nav_dashboard', 'Bảng Điều Khiển'), icon: LayoutDashboard },
  ];

  return (
    <div className="flex h-screen bg-ground text-slate-900 font-sans overflow-hidden dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        projects={projects}
        isProjectsOpen={isProjectsOpen}
        setIsProjectsOpen={setIsProjectsOpen}
        onProjectClick={handleProjectClick}
        selectedProjectId={selectedProjectId}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950">
        {/* Mobile Topbar */}
        <header className="md:hidden bg-[#C8EEF7] text-slate-900 h-16 flex items-center justify-between px-4 border-b border-[#9BE7FA] flex-shrink-0 z-30 shadow-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white transition-colors duration-200 font-sans">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white">Portfolio Hub</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Admin CMS Button on Mobile */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 rounded-lg bg-white/70 hover:bg-white text-slate-900 text-xs font-bold transition-all border border-[#9BE7FA] flex items-center gap-1 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              title="Quản trị nội dung & MySQL"
              aria-label="Admin CMS"
            >
              <Database className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span className={`w-1.5 h-1.5 rounded-full ${dbStatus.connected ? 'bg-emerald-500' : 'bg-[#FFD14C]'}`} />
            </button>

            {/* Quick Theme Toggle on Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/70 hover:bg-white text-slate-900 text-xs font-bold transition-all border border-[#9BE7FA] flex items-center cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FFD14C]" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Quick Language Toggle on Mobile Topbar */}
            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="px-2 py-1 rounded-lg bg-white/70 hover:bg-white text-slate-900 text-xs font-bold transition-all border border-[#9BE7FA] flex items-center gap-1 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white/40 transition-colors cursor-pointer dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bottom-0 bg-[#C8EEF7]/95 backdrop-blur-md z-40 flex flex-col p-4 animate-in slide-in-from-top-4 duration-200 border-b border-[#9BE7FA] shadow-xl overflow-y-auto dark:bg-slate-900/95 dark:border-slate-800 font-sans">
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <div key={item.id} className="flex flex-col">
                  <button
                    onClick={() => {
                      if (item.hasChildren) {
                        setIsProjectsOpen(!isProjectsOpen);
                      }
                      handleTabChange(item.id);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                      activeTab === item.id || (item.id === 'home' && activeTab === 'home') || (item.id === 'projects' && activeTab === 'project-detail')
                        ? 'bg-[#9BE7FA] text-slate-950 shadow-sm font-black border-l-4 border-[#0D7287] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-[#9BE7FA]'
                        : 'text-slate-800 hover:bg-white/50 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                      <span>{item.label}</span>
                    </div>
                    {item.hasChildren && (
                      isProjectsOpen ? <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    )}
                  </button>

                  {/* Sub-projects list in mobile drawer */}
                  {item.hasChildren && isProjectsOpen && (
                    <div className="flex flex-col gap-1 mt-1 pl-8 pr-2 py-1">
                      {projects.map((proj) => (
                        <button
                          key={proj.id}
                          onClick={() => handleProjectClick(proj.id)}
                          className={`text-left text-xs py-2 px-3 font-semibold rounded-xl transition-all truncate cursor-pointer ${
                            activeTab === 'project-detail' && selectedProjectId === proj.id
                              ? 'bg-white text-slate-950 font-bold shadow-xs border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]'
                              : 'text-slate-700 hover:text-slate-950 hover:bg-white/40 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          • {proj.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Admin CMS Trigger in Mobile Drawer */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAdminOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/70 hover:bg-white text-slate-900 font-extrabold text-sm border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span>Quản Trị CMS (MySQL)</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-[#FFD14C]'}`} />
                </button>
              </div>

              <div className="pt-2">
                <hr className="border-t border-[#9BE7FA]/60 my-2 dark:border-slate-800" />
              </div>

              {/* Theme Switcher in Mobile Drawer */}
              <div className="p-3 bg-white/50 rounded-2xl border border-white/80 flex items-center justify-between dark:bg-slate-800/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : theme === 'light' ? <Sun className="w-4 h-4 text-[#FFD14C]" /> : <Laptop className="w-4 h-4 text-slate-500" />}
                  <span>{t('nav_theme', 'Giao Diện')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      theme === 'light' 
                        ? 'bg-[#FFD14C] text-slate-950 shadow-xs dark:bg-slate-700 dark:text-white' 
                        : 'text-slate-700 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {t('nav_theme_light', 'Sáng')}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      theme === 'dark' 
                        ? 'bg-[#9BE7FA] text-slate-950 shadow-xs dark:bg-slate-700 dark:text-[#9BE7FA]' 
                        : 'text-slate-700 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {t('nav_theme_dark', 'Tối')}
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      theme === 'system' 
                        ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-700 dark:text-[#9BE7FA]' 
                        : 'text-slate-700 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {t('nav_theme_system', 'Hệ thống')}
                  </button>
                </div>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="p-3 bg-white/50 rounded-2xl border border-white/80 flex items-center justify-between dark:bg-slate-800/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Globe className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  <span>{t('nav_language', 'Ngôn Ngữ')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLanguage('vi')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      language === 'vi' 
                        ? 'bg-[#9BE7FA] text-slate-950 shadow-xs dark:bg-slate-700 dark:text-white' 
                        : 'text-slate-700 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    VI
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      language === 'en' 
                        ? 'bg-[#9BE7FA] text-slate-950 shadow-xs dark:bg-slate-700 dark:text-white' 
                        : 'text-slate-700 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}

        {/* Dynamic Main View */}
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-white relative dark:bg-slate-950 transition-colors duration-200">
          <ErrorBoundary key={activeTab + (selectedProjectId ? `-${selectedProjectId}` : '')} resetKeys={[activeTab, selectedProjectId]}>
            {activeTab === 'home' && (
              <>
                <HeroSection 
                  profile={profile} 
                  onNavigateTab={handleTabChange}
                  onSelectProject={handleProjectClick}
                  onOpenAdmin={() => setIsAdminOpen(true)}
                />
                <AboutSection 
                  profile={profile} 
                  onSelectProject={handleProjectClick}
                  onNavigateTab={handleTabChange}
                />
              </>
            )}
            {activeTab === 'about' && (
              <AboutSection 
                profile={profile} 
                onSelectProject={handleProjectClick}
                onNavigateTab={handleTabChange}
              />
            )}
            {activeTab === 'cv' && (
              <CVSection 
                experiences={profile.experiences || []} 
                name={profile.name} 
                title={profile.title} 
              />
            )}
            {activeTab === 'projects' && (
              <ProjectsSection 
                projects={projects} 
                onSelectProject={handleProjectClick}
              />
            )}
            {activeTab === 'project-detail' && (() => {
              const SpecialCase = selectedProjectId ? SPECIAL_CASE_STUDIES[selectedProjectId] : null;
              if (SpecialCase) {
                return <SpecialCase onBack={() => setActiveTab('projects')} isEmbedded={true} />;
              }
              return (
                <ProjectDetailView 
                  project={projects.find(p => p.id === selectedProjectId)} 
                  onBack={() => setActiveTab('projects')} 
                  isEmbedded={true} 
                />
              );
            })()}
            {activeTab === 'dashboard' && (
              <DashboardSection 
                dashboard={dashboard} 
                onOpenAdmin={() => setIsAdminOpen(true)}
              />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Floating Quick Action CMS Button (Always Accessible) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#0D7287] via-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-[#0D7287] text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-cyan-900/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
          title="Chỉnh sửa nội dung & Thông tin cá nhân (Ctrl + E)"
        >
          <div className="relative">
            <Database className="w-4 h-4" />
            <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </div>
          <span className="hidden sm:inline">Chỉnh Sửa CMS</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">
            Ctrl E
          </kbd>
        </button>
      </div>

      {/* Spotlight Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        projects={projects}
        onSelectTab={handleTabChange}
        onSelectProject={handleProjectClick}
      />

      {/* Admin Content Editor & MySQL Modal */}
      <AdminEditorModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
