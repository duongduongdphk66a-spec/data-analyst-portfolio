'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon, Download, Home, Briefcase, FileText, UserCheck, Terminal, ChevronDown, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../context/PortfolioDataContext';
import Sidebar from '../components/Sidebar';
import CommandPalette from '../components/ui/CommandPalette';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const AdminEditorModal = dynamic(() => import('../components/AdminEditorModal'), {
  ssr: false,
});

export default function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { projects } = usePortfolioData();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const mainRef = useRef<HTMLElement>(null);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

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

  const navItems = [
    { id: '/', label: language === 'en' ? 'Home' : 'Trang Chủ', icon: Home },
    { id: '/projects', label: language === 'en' ? 'Work' : 'Dự Án', icon: Briefcase, hasChildren: true },
    { id: '/experience', label: language === 'en' ? 'Experience' : 'Kinh Nghiệm', icon: FileText },
    { id: '/about', label: language === 'en' ? 'About' : 'Giới Thiệu', icon: UserCheck },
    { id: '/lab', label: language === 'en' ? 'Lab' : 'Interactive Lab', icon: Terminal },
  ];

  return (
    <div className="flex h-screen bg-[#FAFDFE] text-slate-900 font-sans overflow-hidden dark:bg-[#0B0F17] dark:text-slate-100 transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#0B0F17]">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#FAFDFE] text-slate-900 h-14 flex items-center justify-between px-4 border-b border-slate-200/80 flex-shrink-0 z-30 dark:bg-[#0B0F17] dark:border-slate-800 dark:text-white transition-colors duration-200 font-sans">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-slate-700 hover:text-slate-950 rounded-lg transition-colors cursor-pointer dark:text-slate-300 dark:hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="font-heading font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            MVH
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="p-1.5 rounded-lg text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-[#FFD14C]" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')} className="px-2 py-0.5 rounded text-xs font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              {language.toUpperCase()}
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 right-0 bottom-0 bg-[#FAFDFE]/98 backdrop-blur-md z-40 flex flex-col p-4 animate-in slide-in-from-top-2 duration-150 border-b border-slate-200/80 shadow-xl overflow-y-auto dark:bg-[#0B0F17]/98 dark:border-slate-800">
            <nav className="flex-1 space-y-1 pt-2">
              {navItems.map((item) => {
                const isActive = pathname === item.id || (item.id === '/projects' && pathname.startsWith('/projects'));
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
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive
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
                    </Link>

                    {item.hasChildren && isProjectsOpen && (
                      <div className="flex flex-col gap-0.5 mt-1 pl-7 pr-2 py-1">
                        {projects.map((proj) => (
                          <Link
                            key={proj.id}
                            href={`/projects/${proj.id}`}
                            className={`text-left text-xs py-1.5 px-2.5 font-medium rounded-lg transition-all truncate cursor-pointer ${
                              pathname === `/projects/${proj.id}`
                                ? 'bg-slate-100 text-slate-950 font-bold dark:bg-slate-800 dark:text-[#9BE7FA]'
                                : 'text-slate-500 hover:text-slate-950 dark:text-slate-400'
                            }`}
                          >
                            • {proj.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800">
                <a
                  href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
                  target="_blank"
                  className="btn-primary-gold w-full text-xs py-3 justify-center flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'en' ? 'Download CV PDF' : 'Tải CV PDF'}</span>
                </a>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-[#FAFDFE] relative dark:bg-[#0B0F17] transition-colors duration-200">
          {children}
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        projects={projects}
        onSelectTab={(tab) => {
          // tab is 'home' | 'projects' | 'about' etc.
          const url = tab === 'home' ? '/' : `/${tab}`;
          window.location.href = url;
        }}
        onSelectProject={(id) => {
          window.location.href = `/projects/${id}`;
        }}
      />

      <AdminEditorModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}
