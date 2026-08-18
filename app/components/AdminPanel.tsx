'use client';

import React, { useState } from 'react';
import { 
  Save, Plus, Trash2, LayoutDashboard, Briefcase, User, 
  Shield, BarChart3, LineChart, PieChart, TrendingUp, Sparkles,
  Upload, Download, RefreshCw, Key, CheckCircle2, AlertCircle,
  Eye, EyeOff, Code, Layers, FileSpreadsheet, Lock, LogOut
} from 'lucide-react';
import Papa from 'papaparse';
import { 
  ProfileData, ProjectData, DashboardData, ChartConfig, 
  KpiItem, SkillItem, ExperienceItem 
} from '../types';
import { changePassword, setAdminSession, getSessionUsername } from '../lib/auth';
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
  const [activeTab, setActiveTab] = useState<'charts' | 'projects' | 'profile' | 'security'>('charts');
  
  // Local form states
  const [formProfile, setFormProfile] = useState<ProfileData>(profile);
  const [formProjects, setFormProjects] = useState<ProjectData[]>(projects);
  const [formDashboard, setFormDashboard] = useState<DashboardData>(dashboard);

  // Auth state
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  React.useEffect(() => {
    setCurrentUsername(getSessionUsername());
  }, []);

  // Password change form
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
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

  // --- Profile Helpers ---
  const handleSkillAdd = () => {
    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name: 'Kỹ năng mới',
      category: 'Core Skills'
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
    setFormProfile({
      ...formProfile,
      experiences: formProfile.experiences.filter(e => e.id !== id)
    });
  };

  const handleExpChange = (id: string, field: keyof ExperienceItem, value: any) => {
    setFormProfile({
      ...formProfile,
      experiences: formProfile.experiences.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };

  // --- Project Helpers ---
  const handleProjectAdd = () => {
    const newProj: ProjectData = {
      id: `proj-${Date.now()}`,
      title: 'Tên dự án phân tích dữ liệu mới',
      desc: 'Mô tả bài toán kinh doanh, phương pháp phân tích, các thuật toán áp dụng và kết quả đạt được.',
      tags: ['Python', 'SQL', 'Dashboard'],
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      demoUrl: '',
      githubUrl: '',
      embedUrl: '',
      featured: false
    };
    setFormProjects([newProj, ...formProjects]);
  };

  const handleProjectRemove = (id: string) => {
    setFormProjects(formProjects.filter(p => p.id !== id));
  };

  const handleProjectChange = (id: string, field: keyof ProjectData, value: any) => {
    setFormProjects(formProjects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // --- KPI Helpers ---
  const handleKpiAdd = () => {
    const newKpi: KpiItem = {
      id: `kpi-${Date.now()}`,
      title: 'Chỉ số mới',
      value: '$100,000',
      change: '+10% so với tháng trước',
      isPositive: true,
      icon: 'trending'
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
  const handleChartAdd = () => {
    const newChart: ChartConfig = {
      id: `chart-${Date.now()}`,
      title: 'Biểu đồ phân tích mới',
      type: 'area',
      description: 'Nhận xét và xu hướng của biểu đồ',
      xAxisKey: 'period',
      series: [
        { dataKey: 'metric1', name: 'Số liệu 1', color: '#6366f1' }
      ],
      data: [
        { period: 'Tháng 1', metric1: 4000 },
        { period: 'Tháng 2', metric1: 5200 },
        { period: 'Tháng 3', metric1: 6100 },
        { period: 'Tháng 4', metric1: 7800 }
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

  // CSV upload directly into a chart's data
  const handleChartCsvUpload = (chartIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const sample = results.data[0] as Record<string, any>;
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
            data: results.data as Record<string, any>[]
          };
          setFormDashboard({ ...formDashboard, charts: updated });
          alert(`Đã nạp thành công ${results.data.length} dòng dữ liệu vào biểu đồ!`);
        }
      },
      error: (err) => {
        alert('Lỗi đọc CSV: ' + err.message);
      }
    });
  };

  // Handle password change
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (!currentUsername) {
       setPassMsg({ type: 'error', text: 'Không xác định được phiên đăng nhập.' });
       return;
    }
    const res = await changePassword(currentUsername, oldPass, newPass);
    if (res.success) {
      setPassMsg({ type: 'success', text: res.message });
      setOldPass('');
      setNewPass('');
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
      exportDate: new Date().toISOString()
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

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && parsed.projects && parsed.dashboard) {
          setFormProfile(parsed.profile);
          setFormProjects(parsed.projects);
          setFormDashboard(parsed.dashboard);
          alert('Đã nạp file sao lưu thành công! Hãy bấm "Lưu Tất Cả Thay Đổi" để áp dụng.');
        } else {
          alert('File backup không đúng định dạng!');
        }
      } catch (err) {
        alert('Lỗi đọc file JSON!');
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
      alert('Đã khôi phục dữ liệu ban đầu!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Bar with Tabs and Save Button */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-20">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Lock className="w-4 h-4" />
            Khu vực Quản trị Riêng tư
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Trung tâm Quản trị Portfolio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>

          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Lưu Tất Cả Thay Đổi
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-800/80 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('charts')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'charts'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Biểu đồ & Dashboard ({formDashboard.charts.length})
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Dự án cá nhân ({formProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          Hồ sơ & CV
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          Bảo mật & Dữ liệu
        </button>
      </div>

      {/* --- TAB 1: CHARTS & DASHBOARD --- */}
      {activeTab === 'charts' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Dashboard Meta */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Cấu hình Tiêu đề Dashboard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Tiêu đề Trang Dashboard
                </label>
                <input
                  type="text"
                  value={formDashboard.title}
                  onChange={(e) => setFormDashboard({ ...formDashboard, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Mô tả phụ
                </label>
                <input
                  type="text"
                  value={formDashboard.description}
                  onChange={(e) => setFormDashboard({ ...formDashboard, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* KPIs Manager */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Quản lý Thẻ Chỉ số (KPI Cards)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Các chỉ số tổng quan quan trọng hiển thị ở đầu trang Dashboard
                </p>
              </div>
              <button
                onClick={handleKpiAdd}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Thêm KPI
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formDashboard.kpis.map((kpi) => (
                <div key={kpi.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 relative group space-y-3">
                  <button
                    onClick={() => handleKpiRemove(kpi.id)}
                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    title="Xóa KPI"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Tên KPI
                      </label>
                      <input
                        type="text"
                        value={kpi.title}
                        onChange={(e) => handleKpiChange(kpi.id, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Giá trị (Số liệu)
                      </label>
                      <input
                        type="text"
                        value={kpi.value}
                        onChange={(e) => handleKpiChange(kpi.id, 'value', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Mức thay đổi / Xu hướng
                      </label>
                      <input
                        type="text"
                        value={kpi.change || ''}
                        onChange={(e) => handleKpiChange(kpi.id, 'change', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        placeholder="+12.5% tháng này"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Loại Icon
                      </label>
                      <select
                        value={kpi.icon}
                        onChange={(e) => handleKpiChange(kpi.id, 'icon', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        <option value="dollar">💰 Tiền tệ ($ Doanh thu)</option>
                        <option value="users">👥 Khách hàng (Users)</option>
                        <option value="activity">⚡ Hoạt động / CVR</option>
                        <option value="trending">📈 Tăng trưởng (Growth)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Manager */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Danh sách Biểu đồ Trực quan hóa ({formDashboard.charts.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Thêm mới, sửa số liệu, chọn kiểu Area/Bar/Line hoặc tải lên CSV để tự động vẽ biểu đồ
                </p>
              </div>
              <button
                onClick={handleChartAdd}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                Tạo Biểu đồ mới
              </button>
            </div>

            <div className="space-y-6">
              {formDashboard.charts.map((chart, cIdx) => (
                <div
                  key={chart.id}
                  className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200/80 dark:border-slate-700 space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                        #{cIdx + 1}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {chart.title || 'Biểu đồ chưa đặt tên'}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Upload CSV directly for this chart */}
                      <label className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        Nạp Data từ CSV
                        <input
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={(e) => handleChartCsvUpload(cIdx, e)}
                        />
                      </label>

                      <button
                        onClick={() => handleChartRemove(chart.id)}
                        className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Chart config inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Tên Biểu đồ
                      </label>
                      <input
                        type="text"
                        value={chart.title}
                        onChange={(e) => handleChartChange(cIdx, { ...chart, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Loại Biểu đồ
                      </label>
                      <select
                        value={chart.type}
                        onChange={(e) => handleChartChange(cIdx, { ...chart, type: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        <option value="area">📈 Area Chart (Biểu đồ Vùng / Gradient)</option>
                        <option value="bar">📊 Bar Chart (Biểu đồ Cột)</option>
                        <option value="line">📉 Line Chart (Biểu đồ Đường / Xu hướng)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Trường trục hoành X (xAxisKey)
                      </label>
                      <input
                        type="text"
                        value={chart.xAxisKey}
                        onChange={(e) => handleChartChange(cIdx, { ...chart, xAxisKey: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                        placeholder="VD: month, category, date"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Mô tả / Nhận xét biểu đồ
                    </label>
                    <input
                      type="text"
                      value={chart.description || ''}
                      onChange={(e) => handleChartChange(cIdx, { ...chart, description: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      placeholder="VD: Doanh thu Q3 tăng trưởng vượt bậc nhờ mở rộng thị trường..."
                    />
                  </div>

                  {/* Series Configuration */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                        Các Series Số liệu (Cột / Đường đo lường)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newSeries = { dataKey: `metric_${chart.series.length + 1}`, name: `Chỉ số ${chart.series.length + 1}`, color: '#6366f1' };
                          handleChartChange(cIdx, { ...chart, series: [...chart.series, newSeries] });
                        }}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm Series
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {chart.series.map((s, sIdx) => (
                        <div key={sIdx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                          <input
                            type="color"
                            value={s.color}
                            onChange={(e) => {
                              const updatedS = [...chart.series];
                              updatedS[sIdx] = { ...s, color: e.target.value };
                              handleChartChange(cIdx, { ...chart, series: updatedS });
                            }}
                            className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0"
                            title="Chọn màu hiển thị"
                          />
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={s.dataKey}
                              onChange={(e) => {
                                const updatedS = [...chart.series];
                                updatedS[sIdx] = { ...s, dataKey: e.target.value };
                                handleChartChange(cIdx, { ...chart, series: updatedS });
                              }}
                              className="w-full text-xs font-mono px-1.5 py-0.5 border border-slate-200 rounded"
                              placeholder="dataKey (vd: revenue)"
                            />
                            <input
                              type="text"
                              value={s.name}
                              onChange={(e) => {
                                const updatedS = [...chart.series];
                                updatedS[sIdx] = { ...s, name: e.target.value };
                                handleChartChange(cIdx, { ...chart, series: updatedS });
                              }}
                              className="w-full text-xs px-1.5 py-0.5 border border-slate-200 rounded font-medium"
                              placeholder="Tên hiển thị (vd: Doanh thu)"
                            />
                          </div>
                          {chart.series.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updatedS = chart.series.filter((_, i) => i !== sIdx);
                                handleChartChange(cIdx, { ...chart, series: updatedS });
                              }}
                              className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Raw Data JSON Editor */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-indigo-500" />
                        Dữ liệu biểu đồ (JSON Dataset - {chart.data.length} điểm dữ liệu)
                      </label>
                    </div>

                    <textarea
                      rows={5}
                      defaultValue={JSON.stringify(chart.data, null, 2)}
                      onBlur={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          if (Array.isArray(parsed)) {
                            handleChartChange(cIdx, { ...chart, data: parsed });
                            setJsonError(null);
                          } else {
                            alert('Dữ liệu biểu đồ phải là một mảng các object (Array of Objects).');
                          }
                        } catch (err: any) {
                          alert('Lỗi cú pháp JSON: ' + err.message);
                        }
                      }}
                      className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                Quản lý Danh sách Dự án ({formProjects.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Trình bày các case study, mô tả bài toán dữ liệu, link GitHub và link web demo
              </p>
            </div>
            <button
              onClick={handleProjectAdd}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              Thêm Dự án mới
            </button>
          </div>

          <div className="space-y-6">
            {formProjects.map((proj, idx) => (
              <div
                key={proj.id}
                className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200/80 dark:border-slate-700 space-y-4 relative group"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    {proj.title || 'Dự án mới'}
                  </span>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={proj.featured || false}
                        onChange={(e) => handleProjectChange(proj.id, 'featured', e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      ⭐ Nổi bật
                    </label>

                    <button
                      onClick={() => handleProjectRemove(proj.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      title="Xóa dự án"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Tên Dự án
                    </label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => handleProjectChange(proj.id, 'title', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Mô tả chi tiết bài toán & kết quả
                    </label>
                    <textarea
                      rows={3}
                      value={proj.desc}
                      onChange={(e) => handleProjectChange(proj.id, 'desc', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Tags Công nghệ (cách nhau bởi dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={proj.tags.join(', ')}
                      onChange={(e) => handleProjectChange(proj.id, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                      placeholder="Python, SQL, Streamlit, Scikit-learn"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      URL Ảnh minh họa (Thumbnail)
                    </label>
                    <input
                      type="text"
                      value={proj.img}
                      onChange={(e) => handleProjectChange(proj.id, 'img', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Link Demo (Trang Web Live bên ngoài)
                    </label>
                    <input
                      type="text"
                      value={proj.demoUrl || ''}
                      onChange={(e) => handleProjectChange(proj.id, 'demoUrl', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      placeholder="https://my-app.streamlit.app"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Link Source Code (GitHub Repository)
                    </label>
                    <input
                      type="text"
                      value={proj.githubUrl || ''}
                      onChange={(e) => handleProjectChange(proj.id, 'githubUrl', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Link Iframe Embed (Tùy chọn: Nhúng App tương tác trực tiếp ngay trong Portfolio)
                    </label>
                    <input
                      type="text"
                      value={proj.embedUrl || ''}
                      onChange={(e) => handleProjectChange(proj.id, 'embedUrl', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                      placeholder="VD: https://my-streamlit-app.share.streamlit.io/?embed=true"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: PROFILE & CV --- */}
      {activeTab === 'profile' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Main Info */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Thông tin Cá nhân & Chức danh
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  value={formProfile.name}
                  onChange={(e) => setFormProfile({ ...formProfile, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Chức danh nghề nghiệp
                </label>
                <input
                  type="text"
                  value={formProfile.title}
                  onChange={(e) => setFormProfile({ ...formProfile, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  URL Ảnh đại diện (Avatar)
                </label>
                <input
                  type="text"
                  value={formProfile.avatarUrl}
                  onChange={(e) => setFormProfile({ ...formProfile, avatarUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Email liên hệ
                </label>
                <input
                  type="email"
                  value={formProfile.email || ''}
                  onChange={(e) => setFormProfile({ ...formProfile, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Link GitHub
                </label>
                <input
                  type="text"
                  value={formProfile.github || ''}
                  onChange={(e) => setFormProfile({ ...formProfile, github: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Link LinkedIn
                </label>
                <input
                  type="text"
                  value={formProfile.linkedin || ''}
                  onChange={(e) => setFormProfile({ ...formProfile, linkedin: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Giới thiệu bản thân (Bio)
                </label>
                <textarea
                  rows={4}
                  value={formProfile.bio}
                  onChange={(e) => setFormProfile({ ...formProfile, bio: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm leading-relaxed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Mục tiêu nghề nghiệp (Career Goals)
                </label>
                <textarea
                  rows={3}
                  value={formProfile.careerGoal}
                  onChange={(e) => setFormProfile({ ...formProfile, careerGoal: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Skills Manager */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Quản lý Kỹ năng Chuyên môn ({formProfile.skills.length})
              </h3>
              <button
                onClick={handleSkillAdd}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Thêm Kỹ năng
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {formProfile.skills.map((skill) => (
                <div key={skill.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                      className="w-full text-xs font-semibold px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                    <select
                      value={skill.category}
                      onChange={(e) => handleSkillChange(skill.id, 'category', e.target.value)}
                      className="w-full text-[11px] px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
                    >
                      <option value="Languages">Languages (SQL, Python...)</option>
                      <option value="Tools">Tools (Power BI, Tableau...)</option>
                      <option value="Frameworks">Frameworks (Airflow, Streamlit...)</option>
                      <option value="Core Skills">Core Skills (A/B Testing, RFM...)</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleSkillRemove(skill.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience & Education Manager */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                Kinh nghiệm & Học vấn ({formProfile.experiences.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExpAdd('work')}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Thêm Kinh nghiệm
                </button>
                <button
                  onClick={() => handleExpAdd('education')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Thêm Học vấn
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {formProfile.experiences.map((exp) => (
                <div key={exp.id} className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 relative group">
                  <button
                    onClick={() => handleExpRemove(exp.id)}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    title="Xóa mục này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        {exp.type === 'work' ? 'Vị trí / Chức vụ' : 'Chuyên ngành / Bằng cấp'}
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleExpChange(exp.id, 'role', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        {exp.type === 'work' ? 'Công ty / Tổ chức' : 'Trường Đại học'}
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Thời gian
                      </label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => handleExpChange(exp.id, 'period', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Các gạch đầu dòng mô tả thành tích (Mỗi dòng là 1 gạch)
                    </label>
                    <textarea
                      rows={3}
                      value={exp.description.join('\n')}
                      onChange={(e) => handleExpChange(exp.id, 'description', e.target.value.split('\n').filter(Boolean))}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: SECURITY & BACKUP --- */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {/* Password Change Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              Đổi Mật khẩu Admin
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mật khẩu giúp bảo vệ trang admin để chỉ có bạn mới có thể chỉnh sửa biểu đồ và nội dung.
            </p>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  required
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="Mật khẩu cũ (mặc định: admin123)"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              {passMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  passMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {passMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {passMsg.text}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-md"
              >
                Cập nhật Mật khẩu
              </button>
            </form>
          </div>

          {/* Backup & Restore Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-600" />
              Sao lưu & Khôi phục Dữ liệu
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Bạn có thể tải toàn bộ dữ liệu cấu hình biểu đồ, dự án và CV về máy tính dưới dạng file JSON để lưu trữ hoặc chuyển sang máy khác.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleExportBackup}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                Tải file Sao lưu (Export Backup JSON)
              </button>

              <label className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4 text-emerald-600" />
                Khôi phục từ file Backup JSON
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportBackup}
                />
              </label>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleResetToDefault}
                  className="w-full py-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Khôi phục Dữ liệu Mẫu Ban đầu (Reset to Default)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
