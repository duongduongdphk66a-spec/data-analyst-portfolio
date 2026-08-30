'use client';

import React, { useState, useEffect } from 'react';
import { 
  Save, BarChart3, Briefcase, User, Users, ShieldCheck, 
  Lock, LogOut 
} from 'lucide-react';
import { ProfileData, ProjectData, DashboardData } from '../types';
import { 
  changeAdminPasswords, getSessionUsername,
  isUsingDefaultPasswords, getSecurityLogs,
  clearSecurityLogs, getSessionData, SecurityLogEntry, SessionInfo 
} from '../lib/auth';
import { safeJsonParse, sanitizeObject, validateUploadedFile } from '../lib/security';
import { 
  getVisitorAnalytics, clearVisitorLogs, 
  VisitorAnalyticsSummary 
} from '../lib/visitorTracking';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_DASHBOARD } from '../defaultData';

// Modular Admin Tab Components
import ChartsTab from './admin/ChartsTab';
import ProjectsTab from './admin/ProjectsTab';
import ProfileTab from './admin/ProfileTab';
import VisitorsTab from './admin/VisitorsTab';
import SecurityTab from './admin/SecurityTab';

interface AdminPanelProps {
  profile: ProfileData;
  onSaveProfile: (p: ProfileData) => void;
  projects: ProjectData[];
  onSaveProjects: (p: ProjectData[]) => void;
  dashboard: DashboardData;
  onSaveDashboard: (d: DashboardData) => void;
  onLogout: () => void;
}

export default function AdminPanel({
  profile,
  onSaveProfile,
  projects,
  onSaveProjects,
  dashboard,
  onSaveDashboard,
  onLogout,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'charts' | 'projects' | 'profile' | 'visitors' | 'security'>('charts');

  // Local form states
  const [formProfile, setFormProfile] = useState<ProfileData>(profile);
  const [formProjects, setFormProjects] = useState<ProjectData[]>(projects);
  const [formDashboard, setFormDashboard] = useState<DashboardData>(dashboard);

  // Auth & Security state
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isDefaultPass, setIsDefaultPass] = useState<boolean>(false);
  const [securityLogs, setSecurityLogs] = useState<SecurityLogEntry[]>([]);

  // Visitor Tracking Analytics state
  const [visitorAnalytics, setVisitorAnalytics] = useState<VisitorAnalyticsSummary>({
    totalActions: 0,
    uniqueVisitorsCount: 0,
    topSections: {},
    deviceBreakdown: {},
    browserBreakdown: {},
    recentActions: [],
  });

  const refreshVisitorData = () => {
    setVisitorAnalytics(getVisitorAnalytics());
  };

  useEffect(() => {
    const uname = getSessionUsername();
    setCurrentUsername(uname);
    setSessionInfo(getSessionData());
    setIsDefaultPass(isUsingDefaultPasswords());
    setSecurityLogs(getSecurityLogs());
    refreshVisitorData();
  }, [activeTab]);

  const refreshSecurityState = () => {
    const uname = getSessionUsername();
    setCurrentUsername(uname);
    setSessionInfo(getSessionData());
    setIsDefaultPass(isUsingDefaultPasswords());
    setSecurityLogs(getSecurityLogs());
  };

  // Save All Changes
  const handleSaveAll = () => {
    const cleanProfile = sanitizeObject(formProfile);
    const cleanProjects = sanitizeObject(formProjects);
    const cleanDashboard = sanitizeObject(formDashboard);

    setFormProfile(cleanProfile);
    setFormProjects(cleanProjects);
    setFormDashboard(cleanDashboard);

    onSaveProfile(cleanProfile);
    onSaveProjects(cleanProjects);
    onSaveDashboard(cleanDashboard);

    alert('🎉 Đã lưu toàn bộ thay đổi thành công!');
  };

  // Change Password
  const handleChangeTriplePassword = async (
    curr: [string, string, string],
    next: [string, string, string]
  ): Promise<{ success: boolean; message: string }> => {
    const [c1, c2, c3] = curr;
    const [n1, n2, n3] = next;

    if (!c1 || !c2 || !c3) {
      return { success: false, message: 'Vui lòng nhập đầy đủ cả 3 mật khẩu hiện tại.' };
    }
    if (!n1 || !n2 || !n3) {
      return { success: false, message: 'Vui lòng nhập đầy đủ cả 3 mật khẩu mới.' };
    }

    const res = await changeAdminPasswords(c1, c2, c3, n1, n2, n3);
    if (res.success) {
      refreshSecurityState();
    }
    return res;
  };

  // Export Full JSON Backup
  const handleExportBackup = () => {
    const fullData = {
      profile: formProfile,
      projects: formProjects,
      dashboard: formDashboard,
      exportDate: new Date().toISOString(),
      securityNote: 'Data Analyst Portfolio Backup File',
    };
    const jsonStr = JSON.stringify(fullData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateUploadedFile(file, { maxSizeBytes: 5 * 1024 * 1024, allowedExtensions: ['.json'] });
    if (!validation.isValid) {
      alert(validation.error);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = safeJsonParse(raw, null as any);
        if (parsed && parsed.profile && parsed.projects && parsed.dashboard) {
          setFormProfile(parsed.profile);
          setFormProjects(parsed.projects);
          setFormDashboard(parsed.dashboard);
          onSaveProfile(parsed.profile);
          onSaveProjects(parsed.projects);
          onSaveDashboard(parsed.dashboard);
          alert('✅ Đã nạp và xác thực file sao lưu thành công! Dữ liệu đã được lưu an toàn.');
        } else {
          alert('❌ Cấu trúc tệp sao lưu không hợp lệ hoặc thiếu trường dữ liệu.');
        }
      } catch {
        alert('❌ Lỗi xử lý tệp JSON!');
      }
    };
    reader.readAsText(file);
  };

  // Reset to Default Data
  const handleResetToDefault = () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu ban đầu? Những nội dung đã chỉnh sửa sẽ bị ghi đè.')) {
      setFormProfile(DEFAULT_PROFILE);
      setFormProjects(DEFAULT_PROJECTS);
      setFormDashboard(DEFAULT_DASHBOARD);
      onSaveProfile(DEFAULT_PROFILE);
      onSaveProjects(DEFAULT_PROJECTS);
      onSaveDashboard(DEFAULT_DASHBOARD);
      alert('✅ Đã khôi phục dữ liệu về mặc định ban đầu thành công!');
    }
  };

  return (
    <div className="admin-panel-container max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Bar with Tabs and Save Button */}
      <div className="bg-white rounded-3xl p-6 border border-brand-blue-light/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-20 dark:bg-slate-900 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider mb-1 dark:text-[#9BE7FA]">
            <Lock className="w-4 h-4" />
            Khu vực Quản trị Độc quyền (Admin Only)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Trung tâm Quản trị & Giám sát Portfolio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-brand-blue-light/30 hover:bg-brand-blue-light/70 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>

          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:shadow-brand-yellow/20 transition-all flex items-center gap-2 cursor-pointer dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950"
          >
            <Save className="w-4 h-4" />
            Lưu Tất Cả Thay Đổi
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-brand-blue-light/50 rounded-2xl w-fit dark:bg-slate-900 dark:border dark:border-slate-800">
        <button
          onClick={() => setActiveTab('charts')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'charts'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-[#9BE7FA]'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-slate-900 dark:text-[#9BE7FA]" />
          Biểu đồ & Dashboard ({formDashboard.charts.length})
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-[#9BE7FA]'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4 text-slate-900 dark:text-[#9BE7FA]" />
          Dự án ({formProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-[#9BE7FA]'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4 text-slate-900 dark:text-[#9BE7FA]" />
          Hồ sơ & CV
        </button>

        <button
          onClick={() => {
            setActiveTab('visitors');
            refreshVisitorData();
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'visitors'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-[#9BE7FA]'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Khách xem & Hành vi
          {visitorAnalytics.uniqueVisitorsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full text-[10px] font-extrabold dark:bg-indigo-950 dark:text-indigo-300">
              {visitorAnalytics.uniqueVisitorsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-[#9BE7FA]'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-slate-900 dark:text-[#9BE7FA]" />
          Bảo mật 3 Mật khẩu & Sao lưu
        </button>
      </div>

      {/* --- TAB CONTENT COMPONENTS --- */}
      {activeTab === 'charts' && (
        <ChartsTab
          formDashboard={formDashboard}
          setFormDashboard={setFormDashboard}
        />
      )}

      {activeTab === 'projects' && (
        <ProjectsTab
          formProjects={formProjects}
          setFormProjects={setFormProjects}
          onSaveProjects={onSaveProjects}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileTab
          formProfile={formProfile}
          setFormProfile={setFormProfile}
        />
      )}

      {activeTab === 'visitors' && (
        <VisitorsTab
          visitorAnalytics={visitorAnalytics}
          refreshVisitorData={refreshVisitorData}
          clearVisitorLogs={clearVisitorLogs}
        />
      )}

      {activeTab === 'security' && (
        <SecurityTab
          isDefaultPass={isDefaultPass}
          securityLogs={securityLogs}
          setSecurityLogs={setSecurityLogs}
          clearSecurityLogs={clearSecurityLogs}
          onLogout={onLogout}
          handleExportBackup={handleExportBackup}
          handleImportBackup={handleImportBackup}
          handleResetToDefault={handleResetToDefault}
          onChangeTriplePassword={handleChangeTriplePassword}
        />
      )}
    </div>
  );
}
