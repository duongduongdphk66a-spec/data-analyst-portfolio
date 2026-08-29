'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu, X, ShieldCheck, Lock, User, FileText, 
  Briefcase, LayoutDashboard, ChevronDown, ChevronRight, Globe,
  Sun, Moon, Laptop
} from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { useTheme } from './context/ThemeContext';
import { usePortfolioState } from '@/hooks/usePortfolioState';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { trackVisitorAction } from './lib/visitorTracking';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageSkeleton } from './components/ui/Skeleton';

import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import CVSection from './components/CVSection';
import ProjectsSection from './components/ProjectsSection';
import ProjectDetailView from './components/ProjectDetailView';
import AdminLoginModal from './components/AdminLoginModal';
import dynamic from 'next/dynamic';

const DashboardSection = dynamic(() => import('./components/DashboardSection'), {
  loading: () => <PageSkeleton label="Loading Dashboard..." />,
});

const AdminPanel = dynamic(() => import('./components/AdminPanel'), {
  loading: () => <PageSkeleton label="Loading Admin Panel..." />,
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

// Tab labels for tracking and document title
const TAB_LABELS: Record<string, { vi: string; en: string }> = {
  about: { vi: 'Giới thiệu', en: 'About' },
  home: { vi: 'Trang Chủ', en: 'Home' },
  cv: { vi: 'Học Vấn & Kinh Nghiệm', en: 'CV & Experience' },
  projects: { vi: 'Dự Án', en: 'Projects' },
  dashboard: { vi: 'Executive Dashboard', en: 'Executive Dashboard' },
  admin: { vi: 'Quản trị', en: 'Admin' },
  'project-detail': { vi: 'Chi tiết Dự án', en: 'Project Detail' },
};

export default function Portfolio() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('about');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);

  // Custom hooks — encapsulate data management and auth
  const {
    profile, projects, dashboard,
    handleSaveProfile, handleSaveProjects, handleSaveDashboard,
  } = usePortfolioState();

  const {
    isAdmin, isLoginModalOpen,
    handleLoginSuccess: rawLoginSuccess, handleLogout: rawLogout,
    openLoginModal, closeLoginModal,
  } = useAdminAuth();

  // Update document title when tab changes
  useEffect(() => {
    const label = TAB_LABELS[activeTab];
    const suffix = label
      ? (language === 'en' ? label.en : label.vi)
      : activeTab;
    document.title = `Ma Văn Hùng | ${suffix}`;
  }, [activeTab, language]);

  // Handler for tab change with visitor tracking
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    if (tabId !== 'project-detail') {
      setSelectedProjectId(null);
    }
    setIsMobileMenuOpen(false);

    if (tabId !== 'admin') {
      const label = TAB_LABELS[tabId];
      const displayLabel = label ? label.vi : tabId;
      trackVisitorAction(`Xem mục: ${displayLabel}`, `Chuyển tới tab ${tabId}`, 'navigation');
    }
  }, []);

  // Redirect to about if session expires while on admin tab
  useEffect(() => {
    if (!isAdmin && activeTab === 'admin') {
      setActiveTab('about');
    }
  }, [isAdmin, activeTab]);

  // Global Keyboard Shortcut: Ctrl + Shift + A to open Admin Login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdmin) {
          setActiveTab('admin');
        } else {
          openLoginModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, openLoginModal]);

  // Auth handlers with tab navigation
  const handleLoginSuccess = useCallback(() => {
    rawLoginSuccess();
    setActiveTab('admin');
  }, [rawLoginSuccess]);

  const handleLogout = useCallback(() => {
    rawLogout();
    setActiveTab('about');
  }, [rawLogout]);

  // Open project detail directly in the right viewport
  const handleProjectClick = useCallback((projId: string) => {
    setSelectedProjectId(projId);
    setActiveTab('project-detail');
    setIsMobileMenuOpen(false);
    trackVisitorAction('Bấm xem chi tiết dự án trong khung nhìn', `Mã dự án: ${projId}`, 'project');
  }, []);

  const navItems = [
    { id: 'home', label: t('nav_home', 'Trang Chủ'), icon: User },
    { id: 'about', label: t('nav_about', 'Giới Thiệu'), icon: User },
    { id: 'cv', label: t('nav_cv', 'Học Vấn & Kinh Nghiệm'), icon: FileText },
    { id: 'projects', label: t('nav_projects', 'Dự Án'), icon: Briefcase, hasChildren: true },
    { id: 'dashboard', label: t('nav_dashboard', 'Cài Đặt'), icon: LayoutDashboard },
  ];

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        projects={projects}
        isAdmin={isAdmin}
        onOpenLogin={openLoginModal}
        isProjectsOpen={isProjectsOpen}
        setIsProjectsOpen={setIsProjectsOpen}
        onProjectClick={handleProjectClick}
        selectedProjectId={selectedProjectId}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950">
        {/* Mobile Topbar */}
        <header className="md:hidden bg-[#C4EEF9] text-slate-900 h-16 flex items-center justify-between px-4 border-b border-[#A8E2F2] flex-shrink-0 z-30 shadow-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white transition-colors duration-200">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white">Portfolio Hub</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Theme Toggle on Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/60 hover:bg-white text-slate-900 text-xs font-bold transition-all border border-[#A8E2F2] flex items-center cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Quick Language Toggle on Mobile Topbar */}
            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="px-2 py-1 rounded-lg bg-white/60 hover:bg-white text-slate-900 text-xs font-bold transition-all border border-[#A8E2F2] flex items-center gap-1 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
              title="Toggle Language"
            >
              <span>{language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
            </button>

            {!isAdmin ? (
              <button
                onClick={openLoginModal}
                className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white/40 transition-colors cursor-pointer dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                title="Admin Login"
                aria-label="Open admin login"
              >
                <Lock className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-[10px] px-2 py-0.5 bg-[#8CE0F4] text-slate-900 font-bold rounded-full dark:bg-slate-800 dark:text-[#9BE7FA]">
                Admin
              </span>
            )}
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
          <div className="md:hidden absolute top-16 left-0 right-0 bottom-0 bg-[#C4EEF9]/95 backdrop-blur-md z-40 flex flex-col p-4 animate-in slide-in-from-top-4 duration-200 border-b border-[#A8E2F2] shadow-xl overflow-y-auto dark:bg-slate-900/95 dark:border-slate-800">
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
                        ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold dark:bg-slate-800 dark:text-[#9BE7FA]'
                        : 'text-slate-800 hover:bg-white/40 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
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
                          className={`text-left text-xs py-2 px-3 font-medium rounded-xl transition-all truncate cursor-pointer ${
                            activeTab === 'project-detail' && selectedProjectId === proj.id
                              ? 'bg-white text-slate-950 font-bold shadow-xs dark:bg-slate-800 dark:text-[#9BE7FA]'
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

              <div className="pt-2">
                <hr className="border-t-2 border-slate-900/60 my-2 dark:border-slate-800" />
              </div>

              {/* Theme Switcher in Mobile Drawer */}
              <div className="p-3 bg-white/40 rounded-2xl border border-white/60 flex items-center justify-between dark:bg-slate-800/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Laptop className="w-4 h-4 text-slate-500" />}
                  <span>{t('nav_theme', 'Giao Diện')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      theme === 'light' 
                        ? 'bg-[#8CE0F4] text-slate-950 shadow-xs dark:bg-slate-700 dark:text-white' 
                        : 'text-slate-700 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    ☀️ {t('nav_theme_light', 'Sáng')}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      theme === 'dark' 
                        ? 'bg-[#8CE0F4] text-slate-950 shadow-xs dark:bg-slate-700 dark:text-[#9BE7FA]' 
                        : 'text-slate-700 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    🌙 {t('nav_theme_dark', 'Tối')}
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      theme === 'system' 
                        ? 'bg-[#8CE0F4] text-slate-950 shadow-xs dark:bg-slate-700 dark:text-[#9BE7FA]' 
                        : 'text-slate-700 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    💻 {t('nav_theme_system', 'Hệ thống')}
                  </button>
                </div>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="p-3 bg-white/40 rounded-2xl border border-white/60 flex items-center justify-between dark:bg-slate-800/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Globe className="w-4 h-4 text-slate-700 dark:text-slate-400" />
                  <span>{t('nav_language', 'Ngôn Ngữ')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLanguage('vi')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      language === 'vi' 
                        ? 'bg-[#8CE0F4] text-slate-950 shadow-xs dark:bg-slate-700 dark:text-white' 
                        : 'text-slate-700 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    🇻🇳 VI
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      language === 'en' 
                        ? 'bg-[#8CE0F4] text-slate-950 shadow-xs dark:bg-slate-700 dark:text-white' 
                        : 'text-slate-700 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                </div>
              </div>

              {isAdmin ? (
                <button
                  onClick={() => handleTabChange('admin')}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold dark:bg-slate-800 dark:text-[#9BE7FA]'
                      : 'text-slate-800 hover:bg-white/40 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  {t('nav_admin', 'Quản trị (Admin)')}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openLoginModal();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-800 hover:bg-white/40 transition-all cursor-pointer dark:text-slate-300 dark:hover:bg-slate-800/60"
                >
                  <Lock className="w-5 h-5" />
                  {t('admin_btn_login', 'Admin Login')}
                </button>
              )}
            </nav>
          </div>
        )}

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-y-auto bg-white relative dark:bg-slate-950 transition-colors duration-200">
          <ErrorBoundary>
            {activeTab === 'home' && (
              <>
                <HeroSection 
                  profile={profile} 
                  onNavigateTab={handleTabChange}
                  onSelectProject={handleProjectClick}
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
            {activeTab === 'cv' && <CVSection experiences={profile.experiences} name={profile.name} title={profile.title} />}
            {activeTab === 'projects' && (
              <ProjectsSection 
                projects={projects} 
                onSelectProject={handleProjectClick}
              />
            )}
            {activeTab === 'project-detail' && (
              selectedProjectId === 'proj-kami-ely' ? (
                <KamiElyProject onBack={() => setActiveTab('projects')} isEmbedded={true} />
              ) : selectedProjectId === 'proj-heritage-japan' ? (
                <HeritageJapanProject onBack={() => setActiveTab('projects')} isEmbedded={true} />
              ) : selectedProjectId === 'proj-library-bus' ? (
                <LibraryBusProject onBack={() => setActiveTab('projects')} isEmbedded={true} />
              ) : (
                <ProjectDetailView 
                  project={projects.find(p => p.id === selectedProjectId)} 
                  onBack={() => setActiveTab('projects')} 
                  isEmbedded={true} 
                />
              )
            )}
            {activeTab === 'dashboard' && <DashboardSection dashboard={dashboard} />}
            {activeTab === 'admin' && (
              isAdmin ? (
                <AdminPanel
                  profile={profile}
                  onSaveProfile={handleSaveProfile}
                  projects={projects}
                  onSaveProjects={handleSaveProjects}
                  dashboard={dashboard}
                  onSaveDashboard={handleSaveDashboard}
                  onLogout={handleLogout}
                />
              ) : (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                  {language === 'en' ? 'Admin login required to view this area.' : 'Bạn cần đăng nhập quản trị để truy cập trang này.'}
                </div>
              )
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
