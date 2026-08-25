'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Menu, X, ShieldCheck, Lock, User, FileText, 
  Briefcase, LayoutDashboard, ChevronDown, ChevronRight 
} from 'lucide-react';
import { ProfileData, ProjectData, DashboardData } from './types';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_DASHBOARD } from './defaultData';
import { isSessionAdmin, setAdminSession, touchSession } from './lib/auth';
import { safeJsonParse } from './lib/security';
import { trackVisitorAction } from './lib/visitorTracking';

import Sidebar from './components/Sidebar';
import AboutSection from './components/AboutSection';
import CVSection from './components/CVSection';
import ProjectsSection from './components/ProjectsSection';
import AdminLoginModal from './components/AdminLoginModal';
import dynamic from 'next/dynamic';

const DashboardSection = dynamic(() => import('./components/DashboardSection'), {
  loading: () => <div className="flex h-full items-center justify-center text-slate-500 animate-pulse">Đang tải Dashboard...</div>,
});

const AdminPanel = dynamic(() => import('./components/AdminPanel'), {
  loading: () => <div className="flex h-full items-center justify-center text-slate-500 animate-pulse">Đang tải Admin Panel...</div>,
});

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<string>('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

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
    const savedProjects = localStorage.getItem('portfolio_projects_v2');
    if (savedProjects) {
      setProjects(safeJsonParse(savedProjects, DEFAULT_PROJECTS));
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
    localStorage.setItem('portfolio_projects_v2', JSON.stringify(newProjects));
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

  // Scroll to project by ID with tracking
  const handleProjectClick = (projId: string) => {
    setActiveTab('projects');
    setIsMobileMenuOpen(false);
    trackVisitorAction('Bấm chọn dự án từ Menu', `Mã dự án: ${projId}`, 'project');
    setTimeout(() => {
      const el = document.getElementById(projId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const navItems = [
    { id: 'home', label: 'Trang Chủ', icon: User },
    { id: 'about', label: 'Giới Thiệu', icon: User },
    { id: 'cv', label: 'Học Vấn & Kinh Nghiệm', icon: FileText },
    { id: 'projects', label: 'Dự Án', icon: Briefcase },
    { id: 'dashboard', label: 'Cài Đặt', icon: LayoutDashboard },
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
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {/* Mobile Topbar */}
        <header className="md:hidden bg-[#C4EEF9] text-slate-900 h-16 flex items-center justify-between px-4 border-b border-[#A8E2F2] flex-shrink-0 z-30 shadow-xs">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-extrabold text-slate-900">Portfolio Hub</h1>
          </div>

          <div className="flex items-center gap-2">
            {!isAdmin ? (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white/40 transition-colors"
                title="Đăng nhập Admin"
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
              className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-white/40 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bottom-0 bg-[#C4EEF9]/95 backdrop-blur-md z-40 flex flex-col p-4 animate-in slide-in-from-top-4 duration-200 border-b border-[#A8E2F2] shadow-xl">
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === item.id || (item.id === 'home' && activeTab === 'home')
                      ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold'
                      : 'text-slate-800 hover:bg-white/40'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}

              <div className="pt-2">
                <hr className="border-t-2 border-slate-900/60 my-2" />
              </div>

              {isAdmin ? (
                <button
                  onClick={() => handleTabChange('admin')}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === 'admin'
                      ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold'
                      : 'text-slate-800 hover:bg-white/40'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  Khu vực Quản trị (Admin)
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-800 hover:bg-white/40 transition-all"
                >
                  <Lock className="w-5 h-5" />
                  Admin Login
                </button>
              )}
            </nav>
          </div>
        )}

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-y-auto bg-white relative">
          {(activeTab === 'about' || activeTab === 'home') && <AboutSection profile={profile} />}
          {activeTab === 'cv' && <CVSection experiences={profile.experiences} name={profile.name} title={profile.title} />}
          {activeTab === 'projects' && <ProjectsSection projects={projects} />}
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
                Bạn cần đăng nhập quản trị để truy cập trang này.
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
