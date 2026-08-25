'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Plus, Trash2, LayoutDashboard, Briefcase, User, 
  Shield, BarChart3, LineChart, PieChart, TrendingUp, Sparkles,
  Upload, Download, RefreshCw, Key, CheckCircle2, AlertCircle,
  Eye, EyeOff, Code, Layers, FileSpreadsheet, Lock, LogOut,
  ShieldCheck, ShieldAlert, History, Clock, Activity, Check, AlertTriangle,
  Users, Monitor, Smartphone, Globe, Compass, ExternalLink, Camera, Image as ImageIcon
} from 'lucide-react';
import Papa from 'papaparse';
import { 
  ProfileData, ProjectData, DashboardData, ChartConfig, 
  KpiItem, SkillItem, ExperienceItem, CareerGoalItem 
} from '../types';
import { 
  changeAdminPasswords, setAdminSession, getSessionUsername,
  isUsingDefaultPasswords, getSecurityLogs,
  clearSecurityLogs, getSessionData, SecurityLogEntry, SessionInfo
} from '../lib/auth';
import { safeJsonParse, sanitizeObject, validateUploadedFile } from '../lib/security';
import { 
  getVisitorAnalytics, getVisitorLogs, clearVisitorLogs, 
  VisitorAnalyticsSummary, VisitorActionLog 
} from '../lib/visitorTracking';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_DASHBOARD } from '../defaultData';

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
  onLogout
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

  // Triple-Password Change Form State
  const [currPass1, setCurrPass1] = useState('');
  const [currPass2, setCurrPass2] = useState('');
  const [currPass3, setCurrPass3] = useState('');

  const [newPass1, setNewPass1] = useState('');
  const [newPass2, setNewPass2] = useState('');
  const [newPass3, setNewPass3] = useState('');

  const [showPasswords, setShowPasswords] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active chart index being edited in custom modal/drawer
  const [editingChartIndex, setEditingChartIndex] = useState<number | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Save changes handler
  const handleSaveAll = () => {
    onSaveProfile(formProfile);
    onSaveProjects(formProjects);
    onSaveDashboard(formDashboard);
    alert('🎉 Đã lưu toàn bộ thông tin và biểu đồ thành công!');
  };

  // Avatar file input ref
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Avatar upload handler
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ Dung lượng ảnh không được vượt quá 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('⚠️ Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP, GIF).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFormProfile(prev => ({ ...prev, avatarUrl: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Profile Helpers ---
  const handleSkillAdd = () => {
    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name: 'Kỹ năng mới',
      category: 'Languages',
      level: 5,
      icon: 'code'
    };
    setFormProfile({ ...formProfile, skills: [...formProfile.skills, newSkill] });
  };

  const handleSkillRemove = (id: string) => {
    setFormProfile({ ...formProfile, skills: formProfile.skills.filter(s => s.id !== id) });
  };

  const handleSkillChange = (id: string, field: keyof SkillItem, value: any) => {
    setFormProfile({
      ...formProfile,
      skills: formProfile.skills.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const handleCareerGoalAdd = () => {
    const newGoal: CareerGoalItem = {
      id: `goal-${Date.now()}`,
      title: 'Mục tiêu chuyên môn mới',
      desc: 'Mô tả chi tiết về định hướng và giá trị mang lại.',
      icon: 'list'
    };
    const currentGoals = formProfile.careerGoalsList || [];
    setFormProfile({ ...formProfile, careerGoalsList: [...currentGoals, newGoal] });
  };

  const handleCareerGoalRemove = (id: string) => {
    const currentGoals = formProfile.careerGoalsList || [];
    setFormProfile({ ...formProfile, careerGoalsList: currentGoals.filter(g => g.id !== id) });
  };

  const handleCareerGoalChange = (id: string, field: keyof CareerGoalItem, value: any) => {
    const currentGoals = formProfile.careerGoalsList || [];
    setFormProfile({
      ...formProfile,
      careerGoalsList: currentGoals.map(g => g.id === id ? { ...g, [field]: value } : g)
    });
  };

  const handleExpAdd = (type: 'work' | 'education') => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: type === 'work' ? 'Vị trí công việc' : 'Bằng cấp / Chuyên ngành',
      company: type === 'work' ? 'Tên Công ty' : 'Tên Trường Đại học',
      period: '2023 - Hiện tại',
      type,
      description: ['Mô tả thành tựu chính hoặc dự án đã thực hiện']
    };
    setFormProfile({ ...formProfile, experiences: [newExp, ...formProfile.experiences] });
  };

  const handleExpRemove = (id: string) => {
    setFormProfile({ ...formProfile, experiences: formProfile.experiences.filter(e => e.id !== id) });
  };

  const handleExpChange = (id: string, field: keyof ExperienceItem, value: any) => {
    setFormProfile({
      ...formProfile,
      experiences: formProfile.experiences.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  // --- Projects Helpers ---
  const handleProjectAdd = () => {
    const newProj: ProjectData = {
      id: `proj-${Date.now()}`,
      title: 'Dự án Phân tích Dữ liệu Mới',
      desc: 'Mô tả ngắn gọn về bài toán kinh doanh, phương pháp tiếp cận và kết quả đạt được.',
      tags: ['Python', 'SQL'],
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      featured: false,
    };
    setFormProjects([newProj, ...formProjects]);
  };

  const handleProjectRemove = (id: string) => {
    setFormProjects(formProjects.filter(p => p.id !== id));
  };

  const handleProjectChange = (id: string, field: keyof ProjectData, value: any) => {
    setFormProjects(
      formProjects.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  // --- Dashboard KPI Helpers ---
  const handleKpiAdd = () => {
    const newKpi: KpiItem = {
      id: `kpi-${Date.now()}`,
      title: 'Chỉ số mới',
      value: '100.0%',
      change: '+5.0%',
      isPositive: true,
      icon: 'trending',
    };
    setFormDashboard({
      ...formDashboard,
      kpis: [...formDashboard.kpis, newKpi]
    });
  };

  const handleKpiRemove = (id: string) => {
    setFormDashboard({
      ...formDashboard,
      kpis: formDashboard.kpis.filter(k => k.id !== id)
    });
  };

  const handleKpiChange = (id: string, field: keyof KpiItem, value: any) => {
    setFormDashboard({
      ...formDashboard,
      kpis: formDashboard.kpis.map(k => k.id === id ? { ...k, [field]: value } : k)
    });
  };

  // --- Chart Helpers ---
  const handleChartAdd = (type: ChartConfig['type']) => {
    const newChart: ChartConfig = {
      id: `chart-${Date.now()}`,
      title: 'Biểu đồ phân tích mới',
      description: 'Trực quan hóa xu hướng và chỉ số theo thời gian',
      type,
      xAxisKey: 'name',
      series: [
        { dataKey: 'value', name: 'Giá trị', color: '#6366f1' }
      ],
      data: [
        { name: 'T1', value: 400 },
        { name: 'T2', value: 600 },
        { name: 'T3', value: 800 },
        { name: 'T4', value: 1200 },
      ]
    };
    setFormDashboard({
      ...formDashboard,
      charts: [...formDashboard.charts, newChart]
    });
  };

  const handleChartRemove = (id: string) => {
    setFormDashboard({
      ...formDashboard,
      charts: formDashboard.charts.filter(c => c.id !== id)
    });
  };

  const handleChartChange = (index: number, updatedChart: ChartConfig) => {
    const updated = [...formDashboard.charts];
    updated[index] = updatedChart;
    setFormDashboard({ ...formDashboard, charts: updated });
  };

  // CSV upload directly into a chart's data with security validation & sanitization
  const handleChartCsvUpload = (chartIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateUploadedFile(file, { maxSizeBytes: 5 * 1024 * 1024, allowedExtensions: ['.csv', '.txt'] });
    if (!validation.isValid) {
      alert(validation.error);
      e.target.value = '';
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const sanitizedData = sanitizeObject(results.data) as Record<string, any>[];
          const sample = sanitizedData[0];
          const keys = Object.keys(sample);
          const xAxisKey = keys[0] || 'x';
          const valueKeys = keys.slice(1);

          const defaultColors = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];
          const series = valueKeys.map((k, i) => ({
            dataKey: k,
            name: k,
            color: defaultColors[i % defaultColors.length]
          }));

          const updated = [...formDashboard.charts];
          updated[chartIndex] = {
            ...updated[chartIndex],
            xAxisKey,
            series: series.length > 0 ? series : [{ dataKey: 'val', name: 'Value', color: '#6366f1' }],
            data: sanitizedData
          };
          setFormDashboard({ ...formDashboard, charts: updated });
          alert(`✅ Đã nạp và làm sạch an toàn ${sanitizedData.length} dòng dữ liệu vào biểu đồ!`);
        }
      },
      error: (err) => {
        alert('❌ Lỗi đọc file CSV: ' + err.message);
      }
    });
  };

  // Handle Triple-Password change
  const handleChangeTriplePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    const res = await changeAdminPasswords(
      currPass1, currPass2, currPass3,
      newPass1, newPass2, newPass3
    );

    if (res.success) {
      setPassMsg({ type: 'success', text: res.message });
      setCurrPass1('');
      setCurrPass2('');
      setCurrPass3('');
      setNewPass1('');
      setNewPass2('');
      setNewPass3('');
      refreshSecurityState();
    } else {
      setPassMsg({ type: 'error', text: res.message });
    }
  };

  // Backup & Restore
  const handleExportBackup = () => {
    const fullData = {
      profile: formProfile,
      projects: formProjects,
      dashboard: formDashboard,
      exportDate: new Date().toISOString(),
      securityNote: 'Data Analyst Portfolio Backup File'
    };
    const jsonStr = JSON.stringify(fullData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

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
      } catch (err) {
        alert('❌ Lỗi xử lý tệp JSON!');
      }
    };
    reader.readAsText(file);
  };

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
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Bar with Tabs and Save Button */}
      <div className="bg-white rounded-3xl p-6 border border-brand-blue-light/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-20">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider mb-1">
            <Lock className="w-4 h-4" />
            Khu vực Quản trị Độc quyền (Admin Only)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Trung tâm Quản trị & Giám sát Portfolio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-brand-blue-light/30 hover:bg-brand-blue-light/70 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>

          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:shadow-brand-yellow/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Lưu Tất Cả Thay Đổi
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-brand-blue-light/50 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('charts')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'charts'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-slate-900" />
          Biểu đồ & Dashboard ({formDashboard.charts.length})
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4 text-slate-900" />
          Dự án ({formProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4 text-slate-900" />
          Hồ sơ & CV
        </button>

        {/* ⭐ NEW: Visitor Tracking Analytics Tab */}
        <button
          onClick={() => {
            setActiveTab('visitors');
            refreshVisitorData();
          }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'visitors'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          Khách xem & Hành vi
          {visitorAnalytics.uniqueVisitorsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full text-[10px] font-extrabold">
              {visitorAnalytics.uniqueVisitorsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-slate-900" />
          Bảo mật 3 Mật khẩu & Sao lưu
        </button>
      </div>

      {/* --- TAB 1: CHARTS & DASHBOARD --- */}
      {activeTab === 'charts' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Executive KPIs Editor */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-slate-900" />
                  Chỉ số KPI Tổng quan (Executive Scorecard)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉnh sửa các con số ấn tượng hiển thị trên đầu trang Dashboard
                </p>
              </div>

              <button
                onClick={handleKpiAdd}
                className="px-4 py-2 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 w-fit cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Thêm chỉ số KPI
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {formDashboard.kpis.map((kpi) => (
                <div key={kpi.id} className="p-4 bg-brand-blue-light/20 border border-brand-blue-light rounded-2xl space-y-3 relative group">
                  <button
                    onClick={() => handleKpiRemove(kpi.id)}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Xóa KPI"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Tên chỉ số
                    </label>
                    <input
                      type="text"
                      value={kpi.title}
                      onChange={(e) => handleKpiChange(kpi.id, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Giá trị
                      </label>
                      <input
                        type="text"
                        value={kpi.value}
                        onChange={(e) => handleKpiChange(kpi.id, 'value', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-extrabold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Tăng trưởng
                      </label>
                      <input
                        type="text"
                        value={kpi.change}
                        onChange={(e) => handleKpiChange(kpi.id, 'change', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Biểu tượng Icon
                    </label>
                    <select
                      value={kpi.icon}
                      onChange={(e) => handleKpiChange(kpi.id, 'icon', e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs text-slate-800 cursor-pointer"
                    >
                      <option value="trending">Trending (Xu hướng)</option>
                      <option value="activity">Activity (Hoạt động)</option>
                      <option value="users">Users (Người dùng)</option>
                      <option value="dollar">Dollar (Doanh thu)</option>
                      <option value="chart">Chart (Biểu đồ)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts List & CSV Data Importer */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-slate-900" />
                  Danh sách Biểu đồ Tương tác ({formDashboard.charts.length})
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉnh sửa tiêu đề, dạng biểu đồ (Line, Bar, Area, Pie) hoặc nạp file CSV trực tiếp
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleChartAdd('bar')}
                  className="px-3.5 py-2 bg-brand-blue-light/40 hover:bg-brand-blue-light text-slate-800 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> + Bar Chart
                </button>
                <button
                  onClick={() => handleChartAdd('line')}
                  className="px-3.5 py-2 bg-brand-blue-light/40 hover:bg-brand-blue-light text-slate-800 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> + Line Chart
                </button>
                <button
                  onClick={() => handleChartAdd('area')}
                  className="px-3.5 py-2 bg-brand-blue-light/40 hover:bg-brand-blue-light text-slate-800 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> + Area Chart
                </button>
                <button
                  onClick={() => handleChartAdd('pie')}
                  className="px-3.5 py-2 bg-brand-blue-light/40 hover:bg-brand-blue-light text-slate-800 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> + Pie Chart
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {formDashboard.charts.map((chart, index) => (
                <div key={chart.id} className="p-6 bg-slate-50/70 border border-brand-blue-light rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-blue-light/60">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-yellow text-slate-900 text-xs font-extrabold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{chart.title}</h4>
                      <span className="text-xs px-2 py-0.5 bg-brand-blue-light/50 text-slate-700 font-mono font-bold rounded uppercase">
                        {chart.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* CSV upload button */}
                      <label className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        Nạp File CSV
                        <input
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={(e) => handleChartCsvUpload(index, e)}
                        />
                      </label>

                      <button
                        onClick={() => handleChartRemove(chart.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="Xóa biểu đồ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Tiêu đề Biểu đồ
                      </label>
                      <input
                        type="text"
                        value={chart.title}
                        onChange={(e) => handleChartChange(index, { ...chart, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Mô tả / Giải thích
                      </label>
                      <input
                        type="text"
                        value={chart.description || ''}
                        onChange={(e) => handleChartChange(index, { ...chart, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Loại Biểu đồ
                      </label>
                      <select
                        value={chart.type}
                        onChange={(e) => handleChartChange(index, { ...chart, type: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-semibold text-slate-900 cursor-pointer"
                      >
                        <option value="bar">Bar (Cột)</option>
                        <option value="line">Line (Đường)</option>
                        <option value="area">Area (Vùng)</option>
                        <option value="pie">Pie (Tròn)</option>
                      </select>
                    </div>
                  </div>

                  {/* JSON Data Raw Preview / Editor */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1 flex items-center justify-between">
                      <span>Dữ liệu JSON ({chart.data.length} điểm dữ liệu)</span>
                      <span className="text-[10px] text-slate-400">Trục X: {chart.xAxisKey}</span>
                    </label>
                    <textarea
                      rows={4}
                      value={JSON.stringify(chart.data, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          if (Array.isArray(parsed)) {
                            handleChartChange(index, { ...chart, data: parsed });
                          }
                        } catch {
                          // Invalid JSON typing
                        }
                      }}
                      className="w-full p-3 bg-white border border-brand-blue-light rounded-xl text-xs font-mono text-slate-800 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: PROJECTS --- */}
      {activeTab === 'projects' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-slate-900" />
                Quản lý Dự án Cá nhân ({formProjects.length})
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Thêm dự án, viết bài phân tích Markdown chi tiết, gắn liên kết Live Demo và GitHub
              </p>
            </div>

            <button
              onClick={handleProjectAdd}
              className="px-4 py-2 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 w-fit cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Thêm Dự án Mới
            </button>
          </div>

          <div className="space-y-6">
            {formProjects.map((proj, idx) => (
              <div key={proj.id} className="p-6 bg-slate-50/70 border border-brand-blue-light rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brand-blue-light/60">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-yellow text-slate-900 text-xs font-extrabold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{proj.title}</h4>
                  </div>

                  <button
                    onClick={() => handleProjectRemove(proj.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Xóa dự án"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Tên Dự án
                    </label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => handleProjectChange(proj.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Thẻ công nghệ (Phân cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={proj.tags.join(', ')}
                      onChange={(e) => handleProjectChange(proj.id, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                      className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    Mô tả tóm tắt (Card Description)
                  </label>
                  <textarea
                    rows={2}
                    value={proj.desc}
                    onChange={(e) => handleProjectChange(proj.id, 'desc', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-800 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      URL Ảnh đại diện Thumbnail
                    </label>
                    <input
                      type="text"
                      value={proj.img || ''}
                      onChange={(e) => handleProjectChange(proj.id, 'img', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      URL Live Demo / Web App
                    </label>
                    <input
                      type="text"
                      value={proj.demoUrl || ''}
                      onChange={(e) => handleProjectChange(proj.id, 'demoUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      URL GitHub Source Code
                    </label>
                    <input
                      type="text"
                      value={proj.githubUrl || ''}
                      onChange={(e) => handleProjectChange(proj.id, 'githubUrl', e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1 flex items-center justify-between">
                    <span>Nội dung bài viết chi tiết (Hỗ trợ định dạng Markdown)</span>
                    <span className="text-[10px] text-slate-400">Hiển thị khi người xem bấm "Chi tiết"</span>
                  </label>
                  <textarea
                    rows={6}
                    value={proj.content || ''}
                    onChange={(e) => handleProjectChange(proj.id, 'content', e.target.value)}
                    placeholder="# Giới thiệu dự án&#10;&#10;## 1. Bài toán kinh doanh&#10;..."
                    className="w-full p-3 bg-white border border-brand-blue-light rounded-xl text-xs font-mono text-slate-800 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: PROFILE & CV --- */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-6 animate-in fade-in duration-200">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-slate-900" />
            Thông tin Hồ sơ & Lý lịch Cá nhân
          </h3>

          {/* Avatar Upload & Preview Card */}
          <div className="p-5 bg-slate-50 border border-brand-blue-light rounded-2xl flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Preview */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-brand-blue-light/40 flex-shrink-0 relative flex items-center justify-center">
              {formProfile.avatarUrl ? (
                <img
                  src={formProfile.avatarUrl}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-yellow text-slate-900 text-3xl font-extrabold">
                  {formProfile.name ? formProfile.name.charAt(0) : 'A'}
                </div>
              )}
            </div>

            {/* Actions & URL Input */}
            <div className="flex-1 space-y-3 w-full">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-slate-900" />
                  Ảnh đại diện (Avatar)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tải ảnh chân dung của bạn từ máy tính lên hoặc nhập liên kết ảnh trực tiếp
                </p>
              </div>

              {/* Hidden file input */}
              <input
                ref={avatarFileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                onChange={handleAvatarFileChange}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="px-4 py-2 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Tải ảnh từ máy tính
                </button>

                {formProfile.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setFormProfile({ ...formProfile, avatarUrl: '' })}
                    className="px-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Xóa ảnh đại diện
                  </button>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Hoặc nhập URL ảnh (https://...)"
                  value={formProfile.avatarUrl || ''}
                  onChange={(e) => setFormProfile({ ...formProfile, avatarUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-700 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Họ và Tên
              </label>
              <input
                type="text"
                value={formProfile.name}
                onChange={(e) => setFormProfile({ ...formProfile, name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Tên phụ / English Name
              </label>
              <input
                type="text"
                value={formProfile.subtitle || ''}
                placeholder="Placeholder Name"
                onChange={(e) => setFormProfile({ ...formProfile, subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Chức danh / Tiêu đề chuyên môn
              </label>
              <input
                type="text"
                value={formProfile.title}
                onChange={(e) => setFormProfile({ ...formProfile, title: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Email liên hệ
              </label>
              <input
                type="email"
                value={formProfile.email || ''}
                onChange={(e) => setFormProfile({ ...formProfile, email: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Link GitHub
              </label>
              <input
                type="text"
                value={formProfile.github || ''}
                onChange={(e) => setFormProfile({ ...formProfile, github: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Link LinkedIn
              </label>
              <input
                type="text"
                value={formProfile.linkedin || ''}
                onChange={(e) => setFormProfile({ ...formProfile, linkedin: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Tiểu sử giới thiệu (Bio)
            </label>
            <textarea
              rows={3}
              value={formProfile.bio}
              onChange={(e) => setFormProfile({ ...formProfile, bio: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-800 leading-relaxed"
            />
          </div>

          {/* Career Goals List Editor */}
          <div className="pt-4 border-t border-brand-blue-light/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Mục tiêu nghề nghiệp (Career Goals) ({formProfile.careerGoalsList?.length || 0})
                </h4>
                <p className="text-[11px] text-slate-500">Hiển thị ở cột bên phải phần Giới thiệu</p>
              </div>
              <button
                onClick={handleCareerGoalAdd}
                className="px-3 py-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Thêm Mục tiêu
              </button>
            </div>

            <div className="space-y-3">
              {(formProfile.careerGoalsList || []).map((goal) => (
                <div key={goal.id} className="p-4 bg-slate-50 border border-brand-blue-light rounded-2xl space-y-3 relative">
                  <button
                    onClick={() => handleCareerGoalRemove(goal.id)}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Xóa mục tiêu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Tiêu đề mục tiêu
                      </label>
                      <input
                        type="text"
                        value={goal.title}
                        onChange={(e) => handleCareerGoalChange(goal.id, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Icon biểu tượng
                      </label>
                      <select
                        value={goal.icon || 'list'}
                        onChange={(e) => handleCareerGoalChange(goal.id, 'icon', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs"
                      >
                        <option value="list">List / Checklist</option>
                        <option value="cloud">Cloud Architecture</option>
                        <option value="network">Network / Hierarchy</option>
                        <option value="target">Target / Goal</option>
                        <option value="database">Database / Data</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Mô tả chi tiết
                    </label>
                    <textarea
                      rows={2}
                      value={goal.desc}
                      onChange={(e) => handleCareerGoalChange(goal.id, 'desc', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Editor with Stars and Icons */}
          <div className="pt-4 border-t border-brand-blue-light/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Kỹ năng chuyên môn & Đánh giá Sao (Skills Matrix) ({formProfile.skills.length})
                </h4>
                <p className="text-[11px] text-slate-500">Hiển thị ở lưới thẻ kỹ năng hàng dưới</p>
              </div>
              <button
                onClick={handleSkillAdd}
                className="px-3 py-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Thêm Kỹ năng
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {formProfile.skills.map((skill) => (
                <div key={skill.id} className="p-3.5 bg-slate-50 border border-brand-blue-light rounded-2xl space-y-2.5 relative">
                  <button
                    onClick={() => handleSkillRemove(skill.id)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Xóa kỹ năng"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                      Tên Kỹ năng
                    </label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-brand-blue-light rounded-lg text-xs font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                        Số Sao (1 - 5)
                      </label>
                      <select
                        value={skill.level || 5}
                        onChange={(e) => handleSkillChange(skill.id, 'level', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white border border-brand-blue-light rounded-lg text-xs font-bold"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 sao)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 sao)</option>
                        <option value={3}>⭐⭐⭐ (3 sao)</option>
                        <option value={2}>⭐⭐ (2 sao)</option>
                        <option value={1}>⭐ (1 sao)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                        Biểu tượng Icon
                      </label>
                      <select
                        value={skill.icon || 'python'}
                        onChange={(e) => handleSkillChange(skill.id, 'icon', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-brand-blue-light rounded-lg text-xs"
                      >
                        <option value="python">Python (&lt;/&gt;)</option>
                        <option value="sql">SQL (Database)</option>
                        <option value="devops">DevOps (Gears)</option>
                        <option value="javascript">JavaScript (JS)</option>
                        <option value="ml">Machine Learning (Brain)</option>
                        <option value="uiux">UI/UX Design (App)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education List Editor */}
          <div className="pt-4 border-t border-brand-blue-light/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  🎓 Học Vấn & Bằng Cấp (Education) ({formProfile.experiences.filter(e => e.type === 'education').length})
                </h4>
                <p className="text-[11px] text-slate-500">Hiển thị ở Thẻ HỌC VẤN trên trang Học Vấn & Kinh Nghiệm</p>
              </div>
              <button
                onClick={() => handleExpAdd('education')}
                className="px-3 py-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> + Thêm Học vấn
              </button>
            </div>

            <div className="space-y-4">
              {formProfile.experiences.filter(e => e.type === 'education').map((exp) => (
                <div key={exp.id} className="p-4 bg-slate-50 border border-brand-blue-light rounded-2xl space-y-3 relative">
                  <button
                    onClick={() => handleExpRemove(exp.id)}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Xóa mục học vấn"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Chuyên ngành / Bằng cấp
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        placeholder="Chuyên ngành Quản trị thông tin"
                        onChange={(e) => handleExpChange(exp.id, 'role', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Trường Đại học / Tổ chức
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        placeholder="Đại học Quốc gia Hà Nội (VNU)"
                        onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Thời gian học
                      </label>
                      <input
                        type="text"
                        value={exp.period}
                        placeholder="2020 - 2024"
                        onChange={(e) => handleExpChange(exp.id, 'period', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Mô tả trọng tâm / Nội dung đào tạo
                    </label>
                    <textarea
                      rows={2}
                      value={exp.description.join('\n')}
                      placeholder="Tập trung vào quản lý, phân tích và tối ưu hóa hệ thống thông tin dữ liệu."
                      onChange={(e) => handleExpChange(exp.id, 'description', e.target.value.split('\n'))}
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs leading-relaxed font-normal"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience List Editor */}
          <div className="pt-4 border-t border-brand-blue-light/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  💼 Kinh Nghiệm Làm Việc & Nghiên Cứu ({formProfile.experiences.filter(e => e.type === 'work').length})
                </h4>
                <p className="text-[11px] text-slate-500">Hiển thị ở Thẻ KINH NGHIỆM trên trang Học Vấn & Kinh Nghiệm</p>
              </div>
              <button
                onClick={() => handleExpAdd('work')}
                className="px-3 py-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> + Thêm Kinh nghiệm
              </button>
            </div>

            <div className="space-y-4">
              {formProfile.experiences.filter(e => e.type === 'work').map((exp) => (
                <div key={exp.id} className="p-4 bg-slate-50 border border-brand-blue-light rounded-2xl space-y-3 relative">
                  <button
                    onClick={() => handleExpRemove(exp.id)}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Xóa mục kinh nghiệm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Tiêu đề Kinh nghiệm / Vị trí / Đề tài
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        placeholder="1. Nghiên cứu Khoa học Sinh viên: Phân tích Du lịch Di sản tại Nhật Bản."
                        onChange={(e) => handleExpChange(exp.id, 'role', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Tên Công ty / Đơn vị tổ chức
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        placeholder="Steve x Kami Company"
                        onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-semibold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Các gạch đầu dòng mô tả công việc (Mỗi dòng là một gạch đầu dòng •)
                    </label>
                    <textarea
                      rows={3}
                      value={exp.description.join('\n')}
                      placeholder="Sử dụng các phương pháp phân tích dữ liệu để đánh giá xu hướng..."
                      onChange={(e) => handleExpChange(exp.id, 'description', e.target.value.split('\n'))}
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- ⭐ TAB 4: VISITOR ACTIVITY & ANALYTICS --- */}
      {activeTab === 'visitors' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-brand-blue-light/80 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 mb-1.5">
                <Users className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Khách truy cập</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{visitorAnalytics.uniqueVisitorsCount}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Người xem độc nhất (Unique)</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-brand-blue-light/80 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 mb-1.5">
                <Activity className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Tổng tương tác</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{visitorAnalytics.totalActions}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Lượt xem & Click nút</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-brand-blue-light/80 shadow-xs">
              <div className="flex items-center gap-2 text-amber-600 mb-1.5">
                <Monitor className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Thiết bị chủ yếu</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 truncate">
                {Object.keys(visitorAnalytics.deviceBreakdown)[0] || 'Desktop'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Môi trường xem trang</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-brand-blue-light/80 shadow-xs">
              <div className="flex items-center gap-2 text-purple-600 mb-1.5">
                <Compass className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Mục xem nhiều</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 truncate">
                {Object.keys(visitorAnalytics.topSections)[0] || 'Giới thiệu'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Nội dung thu hút nhất</p>
            </div>
          </div>

          {/* Live Visitor Feed Table */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Nhật ký Hành vi Người xem Chi tiết (Live Activity Feed)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Biết rõ ai đã vào website, dùng thiết bị/trình duyệt gì, đã bấm xem mục nào, dự án nào và lúc mấy giờ.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshVisitorData}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Làm mới
                </button>

                {visitorAnalytics.recentActions.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn xóa sạch toàn bộ lịch sử theo dõi khách xem?')) {
                        clearVisitorLogs();
                        refreshVisitorData();
                      }
                    }}
                    className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Xóa nhật ký
                  </button>
                )}
              </div>
            </div>

            {visitorAnalytics.recentActions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Users className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-medium">Chưa có dữ liệu hành vi nào của khách xem.</p>
                <p className="text-xs">Khi có người mở web hoặc bấm các nút, dữ liệu sẽ tự động xuất hiện tại đây.</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Thời gian</th>
                      <th className="p-3">Người xem (Visitor)</th>
                      <th className="p-3">Hành động đã làm</th>
                      <th className="p-3">Chi tiết bổ sung</th>
                      <th className="p-3 text-right">Phân loại</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visitorAnalytics.recentActions.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 text-slate-500 whitespace-nowrap font-mono">{item.timestamp}</td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="font-bold text-slate-900">{item.visitorLabel}</div>
                          <div className="text-[10px] text-slate-400">Màn hình: {item.screenResolution || 'N/A'}</div>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">
                          {item.action}
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">
                          {item.details || '-'}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.category === 'pageview'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : item.category === 'project'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : item.category === 'contact'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.category === 'download'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.category.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 5: TRIPLE-PASSWORD SECURITY & BACKUP --- */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Default Password Alert Banner */}
          {isDefaultPass && (
            <div className="p-5 bg-amber-50 border border-amber-200 text-amber-900 rounded-3xl flex items-start gap-3.5 shadow-sm">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-amber-900">
                  Khuyến nghị: Bạn đang sử dụng bộ mật khẩu ban đầu!
                </h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Để tăng cường tính bảo mật cho quyền quản trị dữ liệu dự án và biểu đồ, vui lòng đổi sang bộ 3 mật khẩu riêng của bạn ngay bên dưới (chấp nhận mật khẩu ngắn/đơn giản theo ý muốn).
                </p>
              </div>
            </div>
          )}

          {/* Security Health Overview Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-brand-blue-light/80 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Xác thực</span>
              </div>
              <p className="text-sm font-bold text-slate-900">3 Tầng Bảo mật</p>
              <p className="text-[10px] text-slate-500 mt-0.5">1 Tài khoản Admin duy nhất</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-brand-blue-light/80 shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Lock className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Chống Brute-force</span>
              </div>
              <p className="text-sm font-bold text-slate-900">5 lần thử / Khóa 60s</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Tự động đếm ngược</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-brand-blue-light/80 shadow-xs">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Thời hạn phiên</span>
              </div>
              <p className="text-sm font-bold text-slate-900">30 phút bất hoạt</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Tự động ngắt phiên</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-brand-blue-light/80 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Chế độ xem</span>
              </div>
              <p className="text-sm font-bold text-slate-900">Công khai (Read-only)</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Ghi nhận hành vi người xem</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Form Đổi đồng thời 3 Mật khẩu */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-slate-900" />
                  Đổi Bộ 3 Mật khẩu Admin
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium cursor-pointer"
                >
                  {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPasswords ? 'Ẩn ký tự' : 'Hiện ký tự'}
                </button>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Khi đăng nhập quản trị, bạn cần nhập đúng cả 3 mật khẩu này. Bạn có thể đặt mật khẩu ngắn hoặc đơn giản tùy ý theo nhu cầu cá nhân.
              </p>

              <form onSubmit={handleChangeTriplePasswordSubmit} className="space-y-4">
                {/* 3 Mật khẩu hiện tại */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-slate-700">A. Nhập 3 Mật khẩu HIỆN TẠI:</div>
                  <div className="space-y-2">
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      required
                      value={currPass1}
                      onChange={(e) => setCurrPass1(e.target.value)}
                      placeholder="Mật khẩu 1 hiện tại"
                      className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs"
                    />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      required
                      value={currPass2}
                      onChange={(e) => setCurrPass2(e.target.value)}
                      placeholder="Mật khẩu 2 hiện tại"
                      className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs"
                    />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      required
                      value={currPass3}
                      onChange={(e) => setCurrPass3(e.target.value)}
                      placeholder="Mật khẩu 3 hiện tại"
                      className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* 3 Mật khẩu mới */}
                <div className="p-3.5 bg-brand-blue-light/20 border border-brand-blue-light rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-slate-800">B. Nhập 3 Mật khẩu MỚI mong muốn:</div>
                  <div className="space-y-2">
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      required
                      value={newPass1}
                      onChange={(e) => setNewPass1(e.target.value)}
                      placeholder="Mật khẩu MỚI 1 (tùy ý)"
                      className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold"
                    />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      required
                      value={newPass2}
                      onChange={(e) => setNewPass2(e.target.value)}
                      placeholder="Mật khẩu MỚI 2 (tùy ý)"
                      className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold"
                    />
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      required
                      value={newPass3}
                      onChange={(e) => setNewPass3(e.target.value)}
                      placeholder="Mật khẩu MỚI 3 (tùy ý)"
                      className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                {passMsg && (
                  <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    passMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {passMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                    {passMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
                >
                  Lưu & Cập nhật Bộ 3 Mật khẩu
                </button>
              </form>
            </div>

            {/* Card 2: Active Session & Safe Backup */}
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-slate-900" />
                    Phiên làm việc Quản trị
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Admin Active
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tài khoản Quản trị:</span>
                    <span className="font-bold text-slate-900 font-mono">admin (Độc quyền)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cơ chế bảo vệ:</span>
                    <span className="font-bold text-slate-900">Triple-Password Security</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tự động đăng xuất:</span>
                    <span className="font-medium text-slate-700">Sau 30 phút không tương tác</span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất Khỏi Quyền Quản trị
                </button>
              </div>

              {/* Card: Safe Backup & Restore */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-slate-900" />
                  Sao lưu & Khôi phục Dữ liệu
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tải về bản sao lưu JSON toàn bộ biểu đồ, dự án và CV hoặc khôi phục dữ liệu an toàn.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handleExportBackup}
                    className="py-3 px-3 bg-brand-blue-light/30 hover:bg-brand-blue-light/70 text-slate-800 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-900" />
                    Tải File Sao lưu (.JSON)
                  </button>

                  <label className="py-3 px-3 bg-brand-blue-light/30 hover:bg-brand-blue-light/70 text-slate-800 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer text-center">
                    <Upload className="w-4 h-4 text-slate-900" />
                    Khôi phục File Backup
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImportBackup}
                    />
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleResetToDefault}
                    className="w-full py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Khôi phục Dữ liệu Mẫu Ban đầu (Reset to Default)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Security Audit Log Table */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-900" />
                <h3 className="text-lg font-bold text-slate-900">
                  Nhật ký Hoạt động An ninh Hệ thống (Security Logs)
                </h3>
              </div>
              {securityLogs.length > 0 && (
                <button
                  onClick={() => {
                    clearSecurityLogs();
                    setSecurityLogs([]);
                  }}
                  className="text-xs text-slate-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                >
                  Xóa lịch sử
                </button>
              )}
            </div>

            {securityLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Chưa có sự kiện an ninh nào được ghi nhận.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Thời gian</th>
                      <th className="p-2.5">Hành động</th>
                      <th className="p-2.5">Chi tiết</th>
                      <th className="p-2.5 text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {securityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-2.5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-2.5 font-bold text-slate-800">{log.action}</td>
                        <td className="p-2.5 text-slate-600">{log.details}</td>
                        <td className="p-2.5 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700'
                              : log.status === 'warning'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {log.status === 'success' ? 'Thành công' : log.status === 'warning' ? 'Cảnh báo' : 'Từ chối'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
