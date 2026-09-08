'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Menu, X, FileText, Briefcase, 
  ChevronDown, ChevronRight, Sun, Moon,
  Terminal, Download, Home, UserCheck
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

const InteractiveLab = dynamic(() => import('./components/InteractiveLab'), {
  loading: () => <PageSkeleton label="Loading SQL Lab..." />,
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
  home: { vi: 'Trang Chủ', en: 'Home' },
  projects: { vi: 'Dự Án', en: 'Work' },
  lab: { vi: 'Interactive Lab', en: 'Lab' },
  dashboard: { vi: 'Executive Dashboard', en: 'Executive Dashboard' },
  cv: { vi: 'Kinh Nghiệm', en: 'Experience' },
  about: { vi: 'Giới Thiệu', en: 'About' },
  'project-detail': { vi: 'Chi tiết Dự án', en: 'Project Detail' },
};

export default function Portfolio() {
  const { language, setLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { profile, projects } = usePortfolioData();
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
    { id: 'home', label: language === 'en' ? 'Home' : 'Trang Chủ', icon: Home },
    { id: 'projects', label: language === 'en' ? 'Work' : 'Dự Án', icon: Briefcase, hasChildren: true },
    { id: 'cv', label: language === 'en' ? 'Experience' : 'Kinh Nghiệm', icon: FileText },
    { id: 'about', label: language === 'en' ? 'About' : 'Giới Thiệu', icon: UserCheck },
    { id: 'lab', label: language === 'en' ? 'Lab' : 'Interactive Lab', icon: Terminal },
  ];

  return (
    <div className="flex h-screen bg-[#FAFDFE] text-slate-900 font-sans overflow-hidden dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-200">
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
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#0B0F17]">
        {/* Mobile Editorial Topbar: ☰ MVH */}
        <header className="md:hidden bg-[#FAFDFE] text-slate-900 h-14 flex items-center justify-between px-4 border-b border-slate-200/80 flex-shrink-0 z-30 dark:bg-[#0B0F17] dark:border-slate-800 dark:text-white transition-colors duration-200 font-sans">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-slate-700 hover:text-slate-950 rounded-lg transition-colors cursor-pointer dark:text-slate-300 dark:hover:text-white"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="font-heading font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            MVH
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FFD14C]" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="px-2 py-0.5 rounded text-xs font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Language"
            >
              {language.toUpperCase()}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 right-0 bottom-0 bg-[#FAFDFE]/98 backdrop-blur-md z-40 flex flex-col p-4 animate-in slide-in-from-top-2 duration-150 border-b border-slate-200/80 shadow-xl overflow-y-auto dark:bg-[#0B0F17]/98 dark:border-slate-800 font-sans">
            <nav className="flex-1 space-y-1 pt-2">
              {navItems.map((item) => (
                <div key={item.id} className="flex flex-col">
                  <button
                    onClick={() => {
                      if (item.hasChildren) {
                        setIsProjectsOpen(!isProjectsOpen);
                      }
                      handleTabChange(item.id);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === item.id || (item.id === 'projects' && activeTab === 'project-detail')
                        ? 'bg-slate-100 text-slate-950 font-bold border-l-3 border-[#0D7287] dark:bg-slate-900 dark:text-white dark:border-[#9BE7FA]'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                      <span>{item.label}</span>
                    </div>
                    {item.hasChildren && (
                      isProjectsOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {/* Sub-projects list in mobile drawer */}
                  {item.hasChildren && isProjectsOpen && (
                    <div className="flex flex-col gap-0.5 mt-1 pl-7 pr-2 py-1">
                      {projects.map((proj) => (
                        <button
                          key={proj.id}
                          onClick={() => handleProjectClick(proj.id)}
                          className={`text-left text-xs py-1.5 px-2.5 font-medium rounded-lg transition-all truncate cursor-pointer ${
                            activeTab === 'project-detail' && selectedProjectId === proj.id
                              ? 'bg-slate-100 text-slate-950 font-bold dark:bg-slate-800 dark:text-[#9BE7FA]'
                              : 'text-slate-500 hover:text-slate-950 dark:text-slate-400'
                          }`}
                        >
                          • {proj.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Download CV CTA */}
              <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.open('/library-bus/website.pdf', '_blank');
                  }}
                  className="btn-primary-gold w-full text-xs py-3 justify-center"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'en' ? 'Download CV PDF' : 'Tải CV PDF'}</span>
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Dynamic Main View */}
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-[#FAFDFE] relative dark:bg-[#0B0F17] transition-colors duration-200">
          <ErrorBoundary key={activeTab + (selectedProjectId ? `-${selectedProjectId}` : '')} resetKeys={[activeTab, selectedProjectId]}>
            {/* Phase 2: Homepage Editorial Stream */}
            {activeTab === 'home' && (
              <div className="space-y-16 pb-24">
                {/* 1. Hero Section */}
                <HeroSection 
                  profile={profile} 
                  onNavigateTab={handleTabChange}
                  onSelectProject={handleProjectClick}
                />

                {/* 2. Featured Projects (Selected Work Stream) */}
                <section className="max-w-6xl mx-auto px-5 sm:px-8 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="space-y-1">
                      <span className="editorial-kicker">SELECTED CASE STUDIES</span>
                      <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl">
                        {language === 'en' ? 'Featured Analytical Work' : 'Dự Án Phân Tích Dữ Liệu Nổi Bật'}
                      </h2>
                    </div>
                    <button
                      onClick={() => handleTabChange('projects')}
                      className="text-xs font-heading font-bold text-[#0D7287] dark:text-[#9BE7FA] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{language === 'en' ? 'View all projects' : 'Xem toàn bộ dự án'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <ProjectsSection 
                    projects={projects.slice(0, 3)} 
                    onSelectProject={handleProjectClick} 
                    isFeaturedView={true}
                  />
                </section>

                {/* 3. Experience & Career Timeline */}
                <section className="max-w-6xl mx-auto px-5 sm:px-8 space-y-6 pt-4">
                  <div className="space-y-1 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                    <span className="editorial-kicker">CAREER & RESEARCH PATH</span>
                    <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl">
                      {language === 'en' ? 'Experience & Quantitative Background' : 'Học Vấn & Kinh Nghiệm Phân Tích'}
                    </h2>
                  </div>
                  <CVSection 
                    experiences={profile.experiences || []} 
                    name={profile.name} 
                    title={profile.title} 
                  />
                </section>

                {/* 4. Editorial Bottom CTA Strip */}
                <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-8">
                  <div className="p-8 sm:p-12 rounded-2xl bg-slate-950 text-white dark:bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-xl">
                    <div className="space-y-2 max-w-xl">
                      <span className="text-xs font-mono font-semibold text-[#9BE7FA] uppercase tracking-wider">
                        {language === 'en' ? 'DIRECT COLLABORATION' : 'CƠ HỘI HỢP TÁC'}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-heading font-bold">
                        {language === 'en' ? 'Looking for an evidence-driven data analyst?' : 'Tìm kiếm Data Analyst giải quyết bài toán tăng trưởng?'}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {language === 'en'
                          ? 'Available for full-time Data Analyst roles, Business Intelligence implementations, and quantitative research consulting.'
                          : 'Sẵn sàng phỏng vấn vị trí Data Analyst full-time hoặc tư vấn xây dựng hệ thống báo cáo BI, tối ưu hóa dữ liệu vận hành.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <button
                        onClick={() => window.open('/library-bus/website.pdf', '_blank')}
                        className="btn-primary-gold text-xs px-5 py-3"
                      >
                        <Download className="w-4 h-4" />
                        <span>{language === 'en' ? 'Download CV PDF' : 'Tải CV PDF'}</span>
                      </button>
                      <a
                        href="mailto:mavanhung.da@gmail.com"
                        className="btn-secondary-editorial text-xs py-3 px-5 border-slate-700 text-white hover:bg-slate-800"
                      >
                        <span>{language === 'en' ? 'Contact Directly' : 'Liên Hệ Trực Tiếp'}</span>
                      </a>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'about' && (
              <AboutSection 
                profile={profile} 
                onSelectProject={handleProjectClick} 
                onNavigateTab={handleTabChange}
              />
            )}

            {activeTab === 'cv' && (
              <div className="py-12">
                <CVSection 
                  experiences={profile.experiences || []} 
                  name={profile.name} 
                  title={profile.title} 
                />
              </div>
            )}

            {activeTab === 'projects' && (
              <ProjectsSection 
                projects={projects} 
                onSelectProject={handleProjectClick}
              />
            )}

            {activeTab === 'lab' && (
              <InteractiveLab onSelectProject={handleProjectClick} />
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
