'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Save, User, FileText, Database, 
  Check, RefreshCw, LogOut, FolderGit2
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './ui/Toast';
import { ProfileData, ProjectData } from '../types';

import AdminLoginView from './admin/AdminLoginView';
import ProfileEditorTab from './admin/ProfileEditorTab';
import TextsEditorTab from './admin/TextsEditorTab';
import ProjectsManagerTab from './admin/ProjectsManagerTab';
import DatabaseTab from './admin/DatabaseTab';

interface AdminEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AdminEditorContent({ onClose }: { onClose: () => void }) {
  const { 
    profile, 
    projects,
    customTexts, 
    dbStatus, 
    isSaving, 
    updateProfile, 
    updateCustomTexts, 
    updateProjects,
    refreshData, 
    resetToDefault 
  } = usePortfolioData();
  const { reloadTexts } = useLanguage();
  const { showToast } = useToast();

  // Authentication State: verified via httpOnly cookie
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'texts' | 'projects' | 'database'>('profile');

  // Local Editable Forms State initialized directly from context
  const [profileForm, setProfileForm] = useState<ProfileData>(() => JSON.parse(JSON.stringify(profile)));
  const [projectsForm, setProjectsForm] = useState<ProjectData[]>(() => JSON.parse(JSON.stringify(projects)));
  const [textsForm, setTextsForm] = useState<{ vi: Record<string, string>; en: Record<string, string> }>(() => JSON.parse(JSON.stringify(customTexts)));

  // Verify auth session cookie on mount
  useEffect(() => {
    let active = true;
    fetch('/api/auth/verify', { method: 'GET' })
      .then((res) => {
        if (!active) return;
        setIsAuthenticated(res.ok);
      })
      .catch(() => {
        if (!active) return;
        setIsAuthenticated(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Sync state if context updates externally
  useEffect(() => {
    setProfileForm(JSON.parse(JSON.stringify(profile)));
  }, [profile]);

  useEffect(() => {
    setProjectsForm(JSON.parse(JSON.stringify(projects)));
  }, [projects]);

  useEffect(() => {
    setTextsForm(JSON.parse(JSON.stringify(customTexts)));
  }, [customTexts]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    setIsAuthenticated(false);
    showToast('Đã đăng xuất phiên quản trị.', 'info');
  };

  // Handle Save Profile
  const handleSaveProfile = async () => {
    const res = await updateProfile(profileForm);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Save Texts
  const handleSaveTexts = async () => {
    const updates: Array<{ text_key: string; lang: 'vi' | 'en'; value_text: string; section?: string }> = [];

    for (const [key, val] of Object.entries(textsForm.vi)) {
      updates.push({ text_key: key, lang: 'vi', value_text: val });
    }
    for (const [key, val] of Object.entries(textsForm.en)) {
      updates.push({ text_key: key, lang: 'en', value_text: val });
    }

    const res = await updateCustomTexts(updates);
    await reloadTexts();
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Save Projects
  const handleSaveProjects = async () => {
    const res = await updateProjects(projectsForm);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Save All
  const handleSaveAll = async () => {
    await handleSaveProfile();
    await handleSaveTexts();
    await handleSaveProjects();
    showToast('Đã lưu toàn bộ thông tin cá nhân, văn bản & dự án thành công!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-6xl h-[90vh] shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 font-sans animate-in fade-in zoom-in-95 duration-200 origin-center ease-out">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0D7287] to-cyan-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-cyan-500/20">
              CMS
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Quản Trị Nội Dung & Dữ Liệu MySQL</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                  v2.0
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAuthenticated 
                  ? 'Chỉnh sửa toàn bộ hồ sơ, dự án, bản dịch và đồng bộ MySQL' 
                  : 'Bảo mật quyền quản trị viên'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all cursor-pointer"
                title="Đăng xuất quyền Admin"
                aria-label="Đăng xuất quyền Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Đóng cửa sổ quản trị"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Area */}
        {isAuthenticated === null ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-600 mb-2" />
            <p className="text-xs text-slate-500 font-medium">Đang kiểm tra phiên xác thực...</p>
          </div>
        ) : !isAuthenticated ? (
          <AdminLoginView onLoginSuccess={() => setIsAuthenticated(true)} />
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 gap-2 overflow-x-auto shrink-0 pt-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-[#0D7287] text-[#0D7287] dark:border-[#9BE7FA] dark:text-[#9BE7FA] bg-[#C4EEF9]/20 dark:bg-slate-800/60'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>1. Hồ Sơ Cá Nhân (Profile & Skills)</span>
              </button>

              <button
                onClick={() => setActiveTab('texts')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === 'texts'
                    ? 'border-[#0D7287] text-[#0D7287] dark:border-[#9BE7FA] dark:text-[#9BE7FA] bg-[#C4EEF9]/20 dark:bg-slate-800/60'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>2. Chỉnh Sửa Văn Bản Các Trang (Texts CMS)</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'border-[#0D7287] text-[#0D7287] dark:border-[#9BE7FA] dark:text-[#9BE7FA] bg-[#C4EEF9]/20 dark:bg-slate-800/60'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>3. Quản Lý Dự Án (Projects CMS)</span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === 'database'
                    ? 'border-[#0D7287] text-[#0D7287] dark:border-[#9BE7FA] dark:text-[#9BE7FA] bg-[#C4EEF9]/20 dark:bg-slate-800/60'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>4. Quản Lý Cơ Sở Dữ Liệu MySQL</span>
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/40">
              {activeTab === 'profile' && (
                <ProfileEditorTab
                  profileForm={profileForm}
                  setProfileForm={setProfileForm}
                  onSave={handleSaveProfile}
                  isSaving={isSaving}
                />
              )}

              {activeTab === 'texts' && (
                <TextsEditorTab
                  textsForm={textsForm}
                  setTextsForm={setTextsForm}
                  onSave={handleSaveTexts}
                  isSaving={isSaving}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsManagerTab
                  projectsForm={projectsForm}
                  setProjectsForm={setProjectsForm}
                  onSave={handleSaveProjects}
                  isSaving={isSaving}
                />
              )}

              {activeTab === 'database' && (
                <DatabaseTab
                  dbStatus={dbStatus}
                  projectsCount={projectsForm.length}
                  refreshData={refreshData}
                  resetToDefault={resetToDefault}
                  isSaving={isSaving}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between flex-shrink-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Thay đổi sẽ tự động đồng bộ thời gian thực lên toàn bộ các trang và cơ sở dữ liệu.
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#0D7287] hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Lưu Thay Đổi (Save to MySQL)</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminEditorModal({ isOpen, onClose }: AdminEditorModalProps) {
  if (!isOpen) return null;
  return <AdminEditorContent key="admin-editor-content" onClose={onClose} />;
}
