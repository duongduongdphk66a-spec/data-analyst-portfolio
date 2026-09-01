'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Save, User, FileText, Database, Plus, Trash2, 
  Check, RefreshCw, Sparkles, Copy, CheckCheck, ShieldCheck,
  Lock, KeyRound, LogOut, ExternalLink, Eye, EyeOff, FolderGit2
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './ui/Toast';
import { ProfileData, SkillItem, ExperienceItem, ProjectData } from '../types';
import { translations } from '../data/translations';

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

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(sessionStorage.getItem('admin_token'));
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'profile' | 'texts' | 'projects' | 'database'>('profile');
  const [textSubSection, setTextSubSection] = useState<string>('all');
  const [textLang, setTextLang] = useState<'vi' | 'en'>('vi');
  const [textSearch, setTextSearch] = useState<string>('');
  const [isCopiedSql, setIsCopiedSql] = useState(false);

  // Local Editable Forms State initialized directly from context
  const [profileForm, setProfileForm] = useState<ProfileData>(() => JSON.parse(JSON.stringify(profile)));
  const [projectsForm, setProjectsForm] = useState<ProjectData[]>(() => JSON.parse(JSON.stringify(projects)));
  const [textsForm, setTextsForm] = useState<{ vi: Record<string, string>; en: Record<string, string> }>(() => JSON.parse(JSON.stringify(customTexts)));
  const [isDbTesting, setIsDbTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [resetConfirmInput, setResetConfirmInput] = useState('');
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('Vui lòng nhập mật khẩu quản trị.');
      return;
    }

    setIsLoggingIn(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        setPasswordInput('');
        showToast('Đăng nhập quản trị thành công!', 'success');
      } else {
        setAuthError(data.message || 'Mật khẩu quản trị không chính xác.');
      }
    } catch {
      setAuthError('Không thể kết nối máy chủ xác thực.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_token');
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

    // Collect VI updates
    for (const [key, val] of Object.entries(textsForm.vi)) {
      updates.push({ text_key: key, lang: 'vi', value_text: val });
    }
    // Collect EN updates
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

  // Skill Handlers
  const handleAddSkill = () => {
    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name: 'Kỹ năng mới',
      category: 'Languages & Querying',
      level: 5,
      proficiencyNote: 'Mô tả kinh nghiệm',
      tags: ['New'],
    };
    setProfileForm({
      ...profileForm,
      skills: [...(profileForm.skills || []), newSkill],
    });
  };

  const handleRemoveSkill = (id: string) => {
    setProfileForm({
      ...profileForm,
      skills: (profileForm.skills || []).filter((s) => s.id !== id),
    });
  };

  // Experience Handlers
  const handleAddExperience = (type: 'work' | 'education') => {
    const newExp: ExperienceItem = {
      id: `exp-${type}-${Date.now()}`,
      role: type === 'education' ? 'Bằng Cử nhân / Khóa học mới' : 'Vị trí công việc mới',
      company: 'Tổ chức / Công ty',
      period: '2024 - 2025',
      type,
      location: 'Hà Nội, Việt Nam',
      description: ['Nội dung kinh nghiệm hoặc thành tích 1', 'Nội dung kinh nghiệm hoặc thành tích 2'],
    };
    setProfileForm({
      ...profileForm,
      experiences: [...(profileForm.experiences || []), newExp],
    });
  };

  const handleRemoveExperience = (id: string) => {
    setProfileForm({
      ...profileForm,
      experiences: (profileForm.experiences || []).filter((e) => e.id !== id),
    });
  };

  // Project Handlers
  const handleAddProject = () => {
    const newProj: ProjectData = {
      id: `proj-custom-${Date.now()}`,
      title: 'Dự án phân tích dữ liệu mới',
      desc: 'Mô tả tổng quan về bài toán dữ liệu, mục tiêu và kết quả đạt được.',
      tags: ['Data Analysis', 'Python', 'SQL'],
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      featured: false,
      problem: 'Mô tả bài toán kinh doanh cần giải quyết.',
      method: 'Phương pháp thu thập và làm sạch dữ liệu.',
      insight: 'Những insight giá trị nhất được rút ra.',
      demoUrl: '',
      githubUrl: '',
      embedUrl: '',
      metrics: [
        { label: 'Chỉ số 1', value: '100%', change: '+10%', isPositive: true },
      ],
      tools: ['Python', 'SQL', 'Excel'],
    };
    setProjectsForm([...projectsForm, newProj]);
  };

  const handleRemoveProject = (id: string) => {
    setProjectsForm(projectsForm.filter((p) => p.id !== id));
  };

  const handleUpdateProjectField = (idx: number, field: keyof ProjectData, value: any) => {
    const updated = [...projectsForm];
    updated[idx] = { ...updated[idx], [field]: value };
    setProjectsForm(updated);
  };

  // Text Key Categories
  const textKeysList = Object.keys(translations.vi).map((key) => {
    let section = 'general';
    let sectionLabel = 'Chung (General)';
    if (key.startsWith('nav_')) {
      section = 'navigation';
      sectionLabel = 'Menu & Điều hướng';
    } else if (key.startsWith('hero_') || key.startsWith('cta_')) {
      section = 'hero';
      sectionLabel = 'Trang chủ (Hero & CTA)';
    } else if (key.startsWith('about_') || key.startsWith('goal_')) {
      section = 'about';
      sectionLabel = 'Giới thiệu (About)';
    } else if (key.startsWith('cv_')) {
      section = 'cv';
      sectionLabel = 'Học vấn & CV';
    } else if (key.startsWith('proj_')) {
      section = 'projects';
      sectionLabel = 'Dự án (Projects)';
    } else if (key.startsWith('dash_')) {
      section = 'dashboard';
      sectionLabel = 'Dashboard & Thống kê';
    }
    return { key, section, sectionLabel };
  });

  const filteredTextKeys = textKeysList.filter((item) => {
    const matchSection = textSubSection === 'all' || item.section === textSubSection;
    const currentVal = (textsForm[textLang] && textsForm[textLang][item.key]) || '';
    const matchSearch =
      !textSearch ||
      item.key.toLowerCase().includes(textSearch.toLowerCase()) ||
      currentVal.toLowerCase().includes(textSearch.toLowerCase()) ||
      item.sectionLabel.toLowerCase().includes(textSearch.toLowerCase());
    return matchSection && matchSearch;
  });

  const handleCopySchema = () => {
    const sqlContent = `CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

CREATE TABLE IF NOT EXISTS portfolio_profile (
  id INT NOT NULL DEFAULT 1,
  name VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) DEFAULT '',
  title VARCHAR(255) NOT NULL,
  bio TEXT,
  career_goal TEXT,
  avatar_url VARCHAR(1000) DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  github VARCHAR(255) DEFAULT '',
  linkedin VARCHAR(255) DEFAULT '',
  skills_json LONGTEXT,
  experiences_json LONGTEXT,
  career_goals_json LONGTEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS portfolio_texts (
  text_key VARCHAR(120) NOT NULL,
  lang VARCHAR(10) NOT NULL DEFAULT 'vi',
  value_text LONGTEXT NOT NULL,
  section VARCHAR(50) DEFAULT 'general',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (text_key, lang)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  desc_text TEXT NOT NULL,
  tags_json LONGTEXT,
  img VARCHAR(1000) DEFAULT '',
  demo_url VARCHAR(1000) DEFAULT '',
  github_url VARCHAR(1000) DEFAULT '',
  embed_url VARCHAR(1000) DEFAULT '',
  featured TINYINT(1) DEFAULT 0,
  problem TEXT,
  method TEXT,
  insight TEXT,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

    navigator.clipboard.writeText(sqlContent);
    setIsCopiedSql(true);
    showToast('Đã sao chép mã SQL Schema vào clipboard!', 'success');
    setTimeout(() => setIsCopiedSql(false), 2500);
  };

  const handleTestConnection = async () => {
    setIsDbTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/db').then((r) => r.json());
      if (res.connected) {
        setTestResult(`✅ Kết nối MySQL thành công! (${res.stats?.textRows || 0} texts, ${res.stats?.profileRows || 0} profile, ${res.stats?.projectRows || 0} projects)`);
        showToast('Kết nối MySQL hoạt động tốt!', 'success');
      } else {
        setTestResult(`⚠️ MySQL chưa kết nối: ${res.message}. Hệ thống đang dùng bộ nhớ đệm cục bộ.`);
        showToast('Đang chạy chế độ Local Cache.', 'info');
      }
      await refreshData();
    } catch (e: any) {
      setTestResult(`❌ Lỗi kiểm tra: ${e.message}`);
    } finally {
      setIsDbTesting(false);
    }
  };

  // Handle Confirmed Reset Database
  const handleExecuteReset = async () => {
    if (resetConfirmInput !== 'CONFIRM_RESET_DATABASE') {
      showToast('Mã xác nhận không đúng! Vui lòng nhập chính xác CONFIRM_RESET_DATABASE', 'error');
      return;
    }

    const res = await resetToDefault();
    if (res.success) {
      showToast(res.message, 'success');
      setShowResetConfirmModal(false);
      setResetConfirmInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Quản trị Nội dung & Backend MySQL
                </h2>
                {isAuthenticated && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    <ShieldCheck className="w-3 h-3" />
                    Admin Authenticated
                  </span>
                )}
                {dbStatus.connected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    MySQL Online
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Local Fallback
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chỉnh sửa thông tin cá nhân, cập nhật các đoạn văn bản, dự án và cấu hình cơ sở dữ liệu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0D7287] to-cyan-600 hover:from-cyan-700 hover:to-[#0D7287] text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Lưu Toàn Bộ</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Đăng xuất quyền quản trị"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ADMIN AUTHENTICATION GATE (If not authenticated) */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-cyan-100 dark:bg-cyan-950/60 text-[#0D7287] dark:text-[#9BE7FA] flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Khu Vực Quản Trị Viên (Admin Gate)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Trang quản trị chứa quyền truy cập vào cơ sở dữ liệu và cấu hình website. Vui lòng nhập mật khẩu quản trị để tiếp tục.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mật khẩu Quản trị (Admin Password)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Nhập mật khẩu quản trị..."
                      autoFocus
                      className="w-full px-4 py-2.5 pr-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#0D7287] to-cyan-600 hover:from-cyan-700 hover:to-[#0D7287] text-white font-extrabold text-xs rounded-xl shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>Xác Thực & Mở Khóa CMS</span>
                </button>
              </form>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Mật khẩu mặc định trong file <code className="font-mono text-[#0D7287] dark:text-[#9BE7FA]">.env</code>: <span className="font-mono font-bold">admin123</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 pt-2 flex-shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-[#0D7287] text-[#0D7287] dark:border-[#9BE7FA] dark:text-[#9BE7FA] bg-[#C4EEF9]/20 dark:bg-slate-800/60'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>1. Thông Tin Cá Nhân (Profile)</span>
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
              {/* TAB 1: PERSONAL PROFILE */}
              {activeTab === 'profile' && (
                <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-150">
                  {/* Basic Details Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                        Thông tin Cơ bản
                      </h3>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-3 py-1.5 bg-[#0D7287] hover:bg-cyan-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs"
                      >
                        Lưu phần này
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Họ và Tên
                        </label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Chức danh hiển thị (Job Title)
                        </label>
                        <input
                          type="text"
                          value={profileForm.title}
                          onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Phụ đề / Headline (Subtitle)
                        </label>
                        <input
                          type="text"
                          value={profileForm.subtitle || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, subtitle: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Ảnh đại diện URL (Avatar URL)
                        </label>
                        <input
                          type="text"
                          value={profileForm.avatarUrl || ''}
                          placeholder="https://example.com/avatar.jpg"
                          onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Email Liên hệ
                        </label>
                        <input
                          type="email"
                          value={profileForm.email || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          GitHub URL
                        </label>
                        <input
                          type="text"
                          value={profileForm.github || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          LinkedIn URL
                        </label>
                        <input
                          type="text"
                          value={profileForm.linkedin || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Mục tiêu Nghề nghiệp (Career Goal Overview)
                        </label>
                        <input
                          type="text"
                          value={profileForm.careerGoal || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, careerGoal: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Tiểu sử & Giới thiệu Tóm tắt (Bio)
                      </label>
                      <textarea
                        rows={4}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500 leading-relaxed font-lora"
                      />
                    </div>
                  </div>

                  {/* Skills List Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                          Danh sách Kỹ Năng & Công Cụ ({profileForm.skills?.length || 0})
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Hiển thị tại phần About và thanh kỹ năng
                        </p>
                      </div>
                      <button
                        onClick={handleAddSkill}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Kỹ Năng</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                      {(profileForm.skills || []).map((skill, idx) => (
                        <div
                          key={skill.id || idx}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 relative group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={skill.name}
                              placeholder="Tên kỹ năng"
                              onChange={(e) => {
                                const newSkills = [...profileForm.skills];
                                newSkills[idx].name = e.target.value;
                                setProfileForm({ ...profileForm, skills: newSkills });
                              }}
                              className="text-xs font-bold text-slate-900 dark:text-white bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-cyan-500 focus:outline-hidden px-1 py-0.5 flex-1"
                            />
                            <button
                              onClick={() => handleRemoveSkill(skill.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              title="Xóa kỹ năng"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-500 dark:text-slate-400">Danh mục</label>
                              <input
                                type="text"
                                value={skill.category || 'Languages & Querying'}
                                onChange={(e) => {
                                  const newSkills = [...profileForm.skills];
                                  newSkills[idx].category = e.target.value;
                                  setProfileForm({ ...profileForm, skills: newSkills });
                                }}
                                className="w-full text-[11px] px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 dark:text-slate-400">Cấp độ (1-5 sao)</label>
                              <input
                                type="number"
                                min={1}
                                max={5}
                                value={skill.level || 5}
                                onChange={(e) => {
                                  const newSkills = [...profileForm.skills];
                                  newSkills[idx].level = parseInt(e.target.value, 10) || 5;
                                  setProfileForm({ ...profileForm, skills: newSkills });
                                }}
                                className="w-full text-[11px] px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-500 dark:text-slate-400">Mô tả độ thành thạo</label>
                            <input
                              type="text"
                              value={skill.proficiencyNote || ''}
                              placeholder="Ví dụ: Complex Joins, CTEs, Window Functions..."
                              onChange={(e) => {
                                const newSkills = [...profileForm.skills];
                                newSkills[idx].proficiencyNote = e.target.value;
                                setProfileForm({ ...profileForm, skills: newSkills });
                              }}
                              className="w-full text-[11px] px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experiences & Education Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                          Kinh Nghiệm & Học Vấn ({profileForm.experiences?.length || 0})
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Hiển thị tại dòng thời gian mục CV & Experience
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddExperience('education')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs"
                        >
                          + Học Vấn
                        </button>
                        <button
                          onClick={() => handleAddExperience('work')}
                          className="px-3 py-1.5 bg-[#0D7287] hover:bg-cyan-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs"
                        >
                          + Kinh Nghiệm
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {(profileForm.experiences || []).map((exp, idx) => (
                        <div
                          key={exp.id || idx}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 relative"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              exp.type === 'education' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' 
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}>
                              {exp.type === 'education' ? '🎓 Học vấn' : '💼 Kinh nghiệm thực tế'}
                            </span>
                            <button
                              onClick={() => handleRemoveExperience(exp.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="md:col-span-2">
                              <label className="text-[10px] text-slate-500 dark:text-slate-400">Chức vụ / Ngành học</label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => {
                                  const newExp = [...profileForm.experiences];
                                  newExp[idx].role = e.target.value;
                                  setProfileForm({ ...profileForm, experiences: newExp });
                                }}
                                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 dark:text-slate-400">Thời gian</label>
                              <input
                                type="text"
                                value={exp.period}
                                onChange={(e) => {
                                  const newExp = [...profileForm.experiences];
                                  newExp[idx].period = e.target.value;
                                  setProfileForm({ ...profileForm, experiences: newExp });
                                }}
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-500 dark:text-slate-400">Tổ chức / Trường học / Công ty</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => {
                                  const newExp = [...profileForm.experiences];
                                  newExp[idx].company = e.target.value;
                                  setProfileForm({ ...profileForm, experiences: newExp });
                                }}
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 dark:text-slate-400">Địa điểm</label>
                              <input
                                type="text"
                                value={exp.location || ''}
                                onChange={(e) => {
                                  const newExp = [...profileForm.experiences];
                                  newExp[idx].location = e.target.value;
                                  setProfileForm({ ...profileForm, experiences: newExp });
                                }}
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-500 dark:text-slate-400">Các điểm nhấn mô tả (Mỗi dòng 1 gạch đầu dòng)</label>
                            <textarea
                              rows={2}
                              value={(exp.description || []).join('\n')}
                              onChange={(e) => {
                                const newExp = [...profileForm.experiences];
                                newExp[idx].description = e.target.value.split('\n').filter((l) => l.trim() !== '');
                                setProfileForm({ ...profileForm, experiences: newExp });
                              }}
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-lora"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PAGE TEXTS CMS */}
              {activeTab === 'texts' && (
                <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-150">
                  {/* Controls & Filters Bar */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    {/* Language Switch */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        onClick={() => setTextLang('vi')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                          textLang === 'vi'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        🇻🇳 Tiếng Việt
                      </button>
                      <button
                        onClick={() => setTextLang('en')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                          textLang === 'en'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        🇬🇧 English
                      </button>
                    </div>

                    {/* Section filter */}
                    <div className="flex items-center gap-1 overflow-x-auto py-1">
                      {[
                        { id: 'all', label: 'Tất cả' },
                        { id: 'hero', label: 'Trang Chủ' },
                        { id: 'about', label: 'Giới Thiệu' },
                        { id: 'cv', label: 'Học Vấn & CV' },
                        { id: 'projects', label: 'Dự Án' },
                        { id: 'dashboard', label: 'Dashboard' },
                      ].map((sec) => (
                        <button
                          key={sec.id}
                          onClick={() => setTextSubSection(sec.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            textSubSection === sec.id
                              ? 'bg-[#0D7287] text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {sec.label}
                        </button>
                      ))}
                    </div>

                    {/* Search Bar */}
                    <input
                      type="text"
                      placeholder="Tìm kiếm nội dung hoặc key..."
                      value={textSearch}
                      onChange={(e) => setTextSearch(e.target.value)}
                      className="px-3.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white w-full sm:w-48"
                    />

                    <button
                      onClick={handleSaveTexts}
                      disabled={isSaving}
                      className="px-4 py-1.5 bg-[#0D7287] hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      Lưu Văn Bản
                    </button>
                  </div>

                  {/* Text Inputs List */}
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    {filteredTextKeys.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        Không tìm thấy đoạn văn bản nào khớp với bộ lọc.
                      </div>
                    ) : (
                      filteredTextKeys.map((item) => {
                        const val = textsForm[textLang]?.[item.key] ?? (translations[textLang] as any)?.[item.key] ?? '';
                        const isLongText = val.length > 80;

                        return (
                          <div
                            key={`${item.key}-${textLang}`}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-cyan-300 dark:hover:border-cyan-800 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-mono text-[10px] font-bold">
                                  {item.key}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                  • {item.sectionLabel}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {val.length} ký tự
                              </span>
                            </div>

                            {isLongText ? (
                              <textarea
                                rows={3}
                                value={val}
                                onChange={(e) => {
                                  setTextsForm({
                                    ...textsForm,
                                    [textLang]: {
                                      ...textsForm[textLang],
                                      [item.key]: e.target.value,
                                    },
                                  });
                                }}
                                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-cyan-500 font-lora"
                              />
                            ) : (
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => {
                                  setTextsForm({
                                    ...textsForm,
                                    [textLang]: {
                                      ...textsForm[textLang],
                                      [item.key]: e.target.value,
                                    },
                                  });
                                }}
                                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                              />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PROJECTS CMS */}
              {activeTab === 'projects' && (
                <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                        Danh sách Dự án Portfolio ({projectsForm.length})
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Quản lý nội dung, hình ảnh, liên kết demo, github và iframe embed của từng dự án
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleAddProject}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Dự Án Mới</span>
                      </button>
                      <button
                        onClick={handleSaveProjects}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0D7287] hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu Dự Án</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
                    {projectsForm.map((proj, idx) => (
                      <div
                        key={proj.id || idx}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                              #{idx + 1}
                            </span>
                            <span className="font-mono text-xs text-slate-400">ID: {proj.id}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(proj.featured)}
                                onChange={(e) => handleUpdateProjectField(idx, 'featured', e.target.checked)}
                                className="rounded text-cyan-600 focus:ring-cyan-500"
                              />
                              <span>⭐ Featured</span>
                            </label>

                            <button
                              onClick={() => handleRemoveProject(proj.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              title="Xóa dự án"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Tiêu đề Dự án
                            </label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => handleUpdateProjectField(idx, 'title', e.target.value)}
                              className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Mô tả Ngắn (Summary Description)
                            </label>
                            <textarea
                              rows={2}
                              value={proj.desc}
                              onChange={(e) => handleUpdateProjectField(idx, 'desc', e.target.value)}
                              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed font-lora"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Ảnh Bìa URL (Image URL)
                            </label>
                            <input
                              type="text"
                              value={proj.img || ''}
                              placeholder="https://images.unsplash.com/..."
                              onChange={(e) => handleUpdateProjectField(idx, 'img', e.target.value)}
                              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Tags Phân loại (Ngăn cách bằng dấu phẩy)
                            </label>
                            <input
                              type="text"
                              value={(proj.tags || []).join(', ')}
                              onChange={(e) =>
                                handleUpdateProjectField(
                                  idx,
                                  'tags',
                                  e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                                )
                              }
                              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Demo / Report URL (hoặc file PDF)
                            </label>
                            <input
                              type="text"
                              value={proj.demoUrl || ''}
                              placeholder="/website.pdf hoặc https://demo.com"
                              onChange={(e) => handleUpdateProjectField(idx, 'demoUrl', e.target.value)}
                              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              GitHub Repository URL
                            </label>
                            <input
                              type="text"
                              value={proj.githubUrl || ''}
                              placeholder="https://github.com/..."
                              onChange={(e) => handleUpdateProjectField(idx, 'githubUrl', e.target.value)}
                              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Iframe Embed URL (Trực quan hóa nhúng ngoài)
                            </label>
                            <input
                              type="text"
                              value={proj.embedUrl || ''}
                              placeholder="https://lookerstudio.google.com/embed/..."
                              onChange={(e) => handleUpdateProjectField(idx, 'embedUrl', e.target.value)}
                              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Bài toán Kinh doanh (Problem)
                            </label>
                            <textarea
                              rows={3}
                              value={proj.problem || ''}
                              onChange={(e) => handleUpdateProjectField(idx, 'problem', e.target.value)}
                              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-lora"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Phương pháp Xử lý (Methodology)
                            </label>
                            <textarea
                              rows={3}
                              value={proj.method || ''}
                              onChange={(e) => handleUpdateProjectField(idx, 'method', e.target.value)}
                              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-lora"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Insight Giá Trị Đạt Được (Key Insight)
                            </label>
                            <textarea
                              rows={2}
                              value={proj.insight || ''}
                              onChange={(e) => handleUpdateProjectField(idx, 'insight', e.target.value)}
                              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-lora"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MYSQL DATABASE SETTINGS */}
              {activeTab === 'database' && (
                <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
                  {/* Connection Status Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                          Trạng Thái Kết Nối Cơ Sở Dữ Liệu MySQL
                        </h3>
                      </div>
                      <button
                        onClick={handleTestConnection}
                        disabled={isDbTesting}
                        className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isDbTesting ? 'animate-spin' : ''}`} />
                        <span>Kiểm Tra Kết Nối</span>
                      </button>
                    </div>

                    {testResult && (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {testResult}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                          Bảng Thông tin Cá nhân
                        </span>
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                          {dbStatus.stats?.profileRows ?? (dbStatus.connected ? 1 : 0)} bản ghi
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">`portfolio_profile`</span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                          Bảng Đoạn Văn Bản (CMS)
                        </span>
                        <span className="text-xl font-extrabold text-[#0D7287] dark:text-[#9BE7FA] font-mono">
                          {dbStatus.stats?.textRows ?? (dbStatus.connected ? Object.keys(translations.vi).length * 2 : 0)} bản ghi
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">`portfolio_texts`</span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                          Bảng Dự Án
                        </span>
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                          {dbStatus.stats?.projectRows ?? projectsForm.length} dự án
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">`portfolio_projects`</span>
                      </div>
                    </div>
                  </div>

                  {/* Setup Guide & Environment Variables Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                      Hướng Dẫn Cấu Hình Kết Nối MySQL (File .env)
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Để kết nối với máy chủ MySQL cục bộ (XAMPP, Laragon, Docker MySQL) hoặc MySQL trên Cloud (Aiven, Railway, PlanetScale, Clever Cloud), hãy tạo hoặc chỉnh sửa file <code className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[#0D7287] dark:text-[#9BE7FA]">.env</code> ở thư mục gốc dự án:
                    </p>

                    <div className="bg-slate-900 rounded-xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto space-y-1 relative">
                      <p># Cấu hình mật khẩu quản trị</p>
                      <p className="text-cyan-300">ADMIN_PASSWORD=&quot;admin123&quot;</p>
                      <p className="pt-2"># Cấu hình kết nối MySQL</p>
                      <p>MYSQL_HOST=&quot;127.0.0.1&quot;</p>
                      <p>MYSQL_PORT=3306</p>
                      <p>MYSQL_USER=&quot;root&quot;</p>
                      <p>MYSQL_PASSWORD=&quot;&quot;</p>
                      <p>MYSQL_DATABASE=&quot;portfolio_db&quot;</p>
                      <p className="pt-2 text-slate-400"># Hoặc sử dụng Connection URL duy nhất:</p>
                      <p className="text-cyan-300"># DATABASE_URL=&quot;mysql://root:password@localhost:3306/portfolio_db&quot;</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={handleCopySchema}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        {isCopiedSql ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        <span>Sao Chép Script Tạo Bảng MySQL</span>
                      </button>

                      <button
                        onClick={() => setShowResetConfirmModal(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 font-bold text-xs rounded-xl transition-all cursor-pointer ml-auto"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Khôi Phục Dữ Liệu Gốc (Reset DB)</span>
                      </button>
                    </div>
                  </div>
                </div>
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

        {/* Danger Zone: Reset Confirmation Dialog */}
        {showResetConfirmModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-red-200 dark:border-red-800 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  Xác Nhận Khôi Phục Cơ Sở Dữ Liệu?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hành động này sẽ xóa toàn bộ nội dung trong 3 bảng <code className="font-mono text-red-500">portfolio_profile</code>, <code className="font-mono text-red-500">portfolio_texts</code>, <code className="font-mono text-red-500">portfolio_projects</code> và khôi phục về dữ liệu mặc định ban đầu.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Vui lòng nhập <span className="font-mono text-red-600 dark:text-red-400 select-all">CONFIRM_RESET_DATABASE</span> để tiếp tục:
                </label>
                <input
                  type="text"
                  value={resetConfirmInput}
                  onChange={(e) => setResetConfirmInput(e.target.value)}
                  placeholder="CONFIRM_RESET_DATABASE"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowResetConfirmModal(false);
                    setResetConfirmInput('');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleExecuteReset}
                  disabled={resetConfirmInput !== 'CONFIRM_RESET_DATABASE' || isSaving}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer shadow-md shadow-red-500/20"
                >
                  Xác Nhận Khôi Phục
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminEditorModal({ isOpen, onClose }: AdminEditorModalProps) {
  if (!isOpen) return null;
  return <AdminEditorContent key="admin-editor-content" onClose={onClose} />;
}
