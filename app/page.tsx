'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Menu, X, ShieldCheck, Lock, User, FileText, 
  Briefcase, LayoutDashboard, ChevronDown, ChevronRight, Globe 
} from 'lucide-react';
import { ProfileData, ProjectData, DashboardData } from './types';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_DASHBOARD } from './defaultData';
import { isSessionAdmin, setAdminSession, touchSession } from './lib/auth';
import { safeJsonParse } from './lib/security';
import { trackVisitorAction } from './lib/visitorTracking';
import { useLanguage } from './context/LanguageContext';

import Sidebar from './components/Sidebar';
import AboutSection from './components/AboutSection';
import CVSection from './components/CVSection';
import ProjectsSection from './components/ProjectsSection';
import ProjectDetailView from './components/ProjectDetailView';
import AdminLoginModal from './components/AdminLoginModal';
import dynamic from 'next/dynamic';

const DashboardSection = dynamic(() => import('./components/DashboardSection'), {
  loading: () => <div className="flex h-full items-center justify-center text-slate-500 animate-pulse">Loading Dashboard...</div>,
});

const AdminPanel = dynamic(() => import('./components/AdminPanel'), {
  loading: () => <div className="flex h-full items-center justify-center text-slate-500 animate-pulse">Loading Admin Panel...</div>,
});

const KamiElyProject = dynamic(() => import('./projects/proj-kami-ely/page'), {
  loading: () => <div className="flex h-full items-center justify-center text-slate-500 animate-pulse">Loading Project...</div>,
});

const HeritageJapanProject = dynamic(() => import('./projects/proj-heritage-japan/page'), {
  loading: () => <div className="flex h-full items-center justify-center text-slate-500 animate-pulse">Loading Project...</div>,
});

export default function Portfolio() {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('about');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);

  // Core Data States with defaults
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<ProjectData[]>(DEFAULT_PROJECTS);
  const [dashboard, setDashboard] = useState<DashboardData>(DEFAULT_DASHBOARD);

  // Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Load saved data from localStorage & check admin session securely
  useEffect(() => {
    // Check session
    setIsAdmin(isSessionAdmin());

    // Track initial page visit
    trackVisitorAction('Truy cập trang web', 'Người xem mở trang Portfolio', 'pageview');

    // Load Profile securely
    const savedProfile = localStorage.getItem('portfolio_profile_v2');
    if (savedProfile) {
      setProfile(safeJsonParse(savedProfile, DEFAULT_PROFILE));
    }

    // Load Projects securely
    const savedProjects = localStorage.getItem('portfolio_projects_v3');
    if (savedProjects) {
      setProjects(safeJsonParse(savedProjects, DEFAULT_PROJECTS));
    } else {
      setProjects(DEFAULT_PROJECTS);
    }

    // Load Dashboard & Charts securely
    const savedDashboard = localStorage.getItem('portfolio_dashboard_v2');
    if (savedDashboard) {
      setDashboard(safeJsonParse(savedDashboard, DEFAULT_DASHBOARD));
    }
  }, []);

  // Handler for tab change with visitor tracking
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId !== 'project-detail') {
      setSelectedProjectId(null);
    }
    setIsMobileMenuOpen(false);

    if (tabId !== 'admin') {
      const tabLabels: Record<string, string> = {
        about: 'Giới thiệu (About)',
        cv: 'CV & Kinh nghiệm',
        projects: 'Dự án cá nhân',
        dashboard: 'Executive Dashboard',
      };
      trackVisitorAction(`Xem mục: ${tabLabels[tabId] || tabId}`, `Chuyển tới tab ${tabId}`, 'navigation');
    }
  };

  // Periodic Session Inactivity Check and Activity Touch
  useEffect(() => {
    if (!isAdmin) return;

    const handleUserActivity = () => {
      touchSession();
    };

    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    const interval = setInterval(() => {
      const valid = isSessionAdmin();
      if (!valid) {
        setIsAdmin(false);
        if (activeTab === 'admin') {
          setActiveTab('about');
        }
      }
    }, 30000);

    return () => {
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearInterval(interval);
    };
  }, [isAdmin, activeTab]);

  // Global Keyboard Shortcut: Ctrl + Shift + A to open Admin Login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdmin) {
          setActiveTab('admin');
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  // Save Handlers
  const handleSaveProfile = (newProfile: ProfileData) => {
    setProfile(newProfile);
    localStorage.setItem('portfolio_profile_v2', JSON.stringify(newProfile));
  };

  const handleSaveProjects = (newProjects: ProjectData[]) => {
    setProjects(newProjects);
    localStorage.setItem('portfolio_projects_v3', JSON.stringify(newProjects));
  };

  const handleSaveDashboard = (newDashboard: DashboardData) => {
    setDashboard(newDashboard);
    localStorage.setItem('portfolio_dashboard_v2', JSON.stringify(newDashboard));
  };

  // Auth Handlers
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setActiveTab('admin');
  };

  const handleLogout = () => {
    setAdminSession(false);
    setIsAdmin(false);
    setActiveTab('about');
  };

  // Open project detail directly in the right viewport
  const handleProjectClick = (projId: string) => {
    setSelectedProjectId(projId);
    setActiveTab('project-detail');
    setIsMobileMenuOpen(false);
    trackVisitorAction('Bấm xem chi tiết dự án trong khung nhìn', `Mã dự án: ${projId}`, 'project');
  };

  const navItems = [
    { id: 'home', label: t('nav_home', 'Trang Chủ'), icon: User },
    { id: 'about', label: t('nav_about', 'Giới Thiệu'), icon: User },
    { id: 'cv', label: t('nav_cv', 'Học Vấn & Kinh Nghiệm'), icon: FileText },
    { id: 'projects', label: t('nav_projects', 'Dự Án'), icon: Briefcase, hasChildren: true },
    { id: 'dashboard', label: t('nav_dashboard', 'Cài Đặt'), icon: LayoutDashboard },
  ];

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        projects={projects}
        isAdmin={isAdmin}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        isProjectsOpen={isProjectsOpen}
        setIsProjectsOpen={setIsProjectsOpen}
        onProjectClick={handleProjectClick}
        selectedProjectId={selectedProjectId}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {/* Mobile Topbar */}
        <header className="md:hidden bg-[#C4EEF9] text-slate-900 h-16 flex items-center justify-between px-4 border-b border-[#A8E2F2] flex-shrink-0 z-30 shadow-xs">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-extrabold text-slate-900">Portfolio Hub</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Language Toggle on Mobile Topbar */}
            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="px-2 py-1 rounded-lg bg-white/60 hover:bg-white text-slate-900 text-xs font-bold transition-all border border-[#A8E2F2] flex items-center gap-1 cursor-pointer"
              title="Toggle Language"
            >
              <span>{language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
            </button>

            {!isAdmin ? (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white/40 transition-colors cursor-pointer"
                title="Admin Login"
              >
                <Lock className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-[10px] px-2 py-0.5 bg-[#8CE0F4] text-slate-900 font-bold rounded-full">
                Admin
              </span>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white/40 transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bottom-0 bg-[#C4EEF9]/95 backdrop-blur-md z-40 flex flex-col p-4 animate-in slide-in-from-top-4 duration-200 border-b border-[#A8E2F2] shadow-xl overflow-y-auto">
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
                        ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold'
                        : 'text-slate-800 hover:bg-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.hasChildren && (
                      isProjectsOpen ? <ChevronDown className="w-4 h-4 text-slate-600" /> : <ChevronRight className="w-4 h-4 text-slate-600" />
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
                              ? 'bg-white text-slate-950 font-bold shadow-xs'
                              : 'text-slate-700 hover:text-slate-950 hover:bg-white/40'
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
                <hr className="border-t-2 border-slate-900/60 my-2" />
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="p-3 bg-white/40 rounded-2xl border border-white/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Globe className="w-4 h-4 text-slate-700" />
                  <span>{t('nav_language', 'Ngôn Ngữ')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLanguage('vi')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      language === 'vi' ? 'bg-[#8CE0F4] text-slate-950 shadow-xs' : 'text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    🇻🇳 VI
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      language === 'en' ? 'bg-[#8CE0F4] text-slate-950 shadow-xs' : 'text-slate-700 hover:bg-white/60'
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
                      ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold'
                      : 'text-slate-800 hover:bg-white/40'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  {t('nav_admin', 'Quản trị (Admin)')}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-800 hover:bg-white/40 transition-all cursor-pointer"
                >
                  <Lock className="w-5 h-5" />
                  {t('admin_btn_login', 'Admin Login')}
                </button>
              )}
            </nav>
          </div>
        )}

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-y-auto bg-white relative">
          {(activeTab === 'about' || activeTab === 'home') && <AboutSection profile={profile} />}
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
              <div className="p-12 text-center text-slate-500">
                {language === 'en' ? 'Admin login required to view this area.' : 'Bạn cần đăng nhập quản trị để truy cập trang này.'}
              </div>
            )
          )}
        </main>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
