'use client';

import React from 'react';
import { 
  User, FileText, Briefcase, LayoutDashboard, Settings, 
  ChevronDown, ChevronRight, Github, Linkedin, Mail, Lock, 
  ShieldCheck, Database, Sparkles, BarChart2
} from 'lucide-react';
import { ProjectData } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  projects: ProjectData[];
  isAdmin: boolean;
  onOpenLogin: () => void;
  isProjectsOpen: boolean;
  setIsProjectsOpen: (open: boolean) => void;
  onProjectClick: (projId: string) => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  projects,
  isAdmin,
  onOpenLogin,
  isProjectsOpen,
  setIsProjectsOpen,
  onProjectClick
}: SidebarProps) {
  const publicNavItems = [
    { id: 'about', label: 'Giới thiệu', icon: User },
    { id: 'cv', label: 'CV & Kinh nghiệm', icon: FileText },
    { id: 'projects', label: 'Dự án cá nhân', icon: Briefcase, hasChildren: true },
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex-col hidden md:flex h-full flex-shrink-0 border-r border-slate-900 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight">
              Data Analyst
            </h1>
            <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Portfolio Hub
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        {publicNavItems.map((item) => {
          const isActive = activeTab === item.id;
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
                {item.hasChildren && (
                  isProjectsOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {/* Sub-projects list */}
              {item.hasChildren && isProjectsOpen && (
                <div className="flex flex-col gap-0.5 mt-1 pl-9 pr-1 animate-in slide-in-from-top-2 duration-150">
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => onProjectClick(proj.id)}
                      className="text-left text-xs py-1.5 px-2.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors truncate cursor-pointer"
                      title={proj.title}
                    >
                      • {proj.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Admin Tab (If authenticated) */}
        {isAdmin && (
          <div className="pt-4 border-t border-slate-900 mt-4">
            <button
              onClick={() => onTabChange('admin')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-indigo-950/40 text-indigo-400 border border-indigo-800/40 hover:bg-indigo-900/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Quản trị (Admin)
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono">
                Active
              </span>
            </button>
          </div>
        )}
      </nav>

      {/* Footer Area: Admin Lock Trigger & Socials */}
      <div className="p-4 border-t border-slate-900 space-y-3 bg-slate-950/50">
        {/* Subtle Admin Login trigger for owner */}
        {!isAdmin && (
          <button
            onClick={onOpenLogin}
            className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-900/80 rounded-xl transition-all cursor-pointer group"
            title="Đăng nhập Admin (Ctrl + Shift + A)"
          >
            <span className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              Chủ sở hữu
            </span>
            <kbd className="text-[9px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-500 font-mono">
              Ctrl+Shift+A
            </kbd>
          </button>
        )}

        <div className="flex justify-center items-center gap-4 text-slate-500 pt-1">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="mailto:analyst@example.com" className="hover:text-slate-300 transition-colors">
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </aside>
  );
}
