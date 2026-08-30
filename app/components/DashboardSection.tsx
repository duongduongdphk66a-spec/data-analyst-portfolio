'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  DollarSign, Users, Activity, TrendingUp, BarChart3, 
  Download, Upload, Search, RefreshCw, Database, Sparkles, Filter, Check
} from 'lucide-react';
import Papa from 'papaparse';
import { DashboardData, KpiItem, ChartConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { gsap, useGSAP } from '../lib/gsap';
import AnimatedCounter from './ui/AnimatedCounter';
import { exportChartAsPng } from '../lib/chartExport';
import { useToast } from './ui/Toast';

interface DashboardSectionProps {
  dashboard: DashboardData;
}

export default function DashboardSection({ dashboard }: DashboardSectionProps) {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { showToast } = useToast();
  const isDark = resolvedTheme === 'dark';
  const isEn = language === 'en';

  const [searchTerm, setSearchTerm] = useState('');
  const [customTableData, setCustomTableData] = useState<Record<string, any>[] | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Multi-dimension filters
  const [timeFilter, setTimeFilter] = useState<'all' | 'q1_q2' | 'q3_q4'>('all');
  const [channelFilter, setChannelFilter] = useState<'all' | 'live' | 'affiliate'>('all');

  useGSAP(() => {
    gsap.from('.dash-kpi-card', {
      autoAlpha: 0,
      y: 25,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.dash-kpi-grid',
        start: 'top 85%',
        once: true,
      },
    });

    gsap.from('.dash-chart-card', {
      autoAlpha: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.dash-charts-grid',
        start: 'top 85%',
        once: true,
      },
    });
  }, { scope: dashboardRef, dependencies: [dashboard.kpis?.length, dashboard.charts?.length] });

  // Active table data
  const activeTable = useMemo(() => {
    return customTableData || dashboard.tableData || [];
  }, [customTableData, dashboard.tableData]);

  // Filtered table rows
  const filteredRows = useMemo(() => {
    let list = activeTable;

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(row => 
        Object.values(row).some(val => 
          String(val).toLowerCase().includes(lower)
        )
      );
    }

    return list;
  }, [activeTable, searchTerm]);

  // Extract table column headers
  const columns = useMemo(() => {
    if (activeTable.length === 0) return [];
    return Object.keys(activeTable[0]).filter(k => k !== 'id');
  }, [activeTable]);

  // KPI icon resolver
  const renderKpiIcon = (iconType: KpiItem['icon']) => {
    const iconClass = "w-5 h-5 text-slate-900 dark:text-[#9BE7FA]";
    switch (iconType) {
      case 'dollar': return <DollarSign className={iconClass} />;
      case 'users': return <Users className={iconClass} />;
      case 'activity': return <Activity className={iconClass} />;
      case 'trending': return <TrendingUp className="w-5 h-5 text-[#FFD14C]" />;
      default: return <BarChart3 className={iconClass} />;
    }
  };

  // Upload custom CSV to preview on table
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setCustomTableData(results.data.map((item: any, i: number) => ({ id: `row-${i}`, ...item })));
          showToast(isEn ? `Loaded ${file.name} (${results.data.length} rows)` : `Đã nạp tệp ${file.name} (${results.data.length} dòng)`, 'success');
        }
      },
      error: (err) => {
        showToast(isEn ? 'Error reading CSV: ' + err.message : 'Lỗi đọc file CSV: ' + err.message, 'error');
      }
    });
  };

  // Reset custom CSV preview
  const handleResetTable = () => {
    setCustomTableData(null);
    setSearchTerm('');
    showToast(isEn ? 'Reset to default data' : 'Đã khôi phục dữ liệu mặc định', 'info');
  };

  // Export Individual Chart to PNG
  const handleExportChartPng = async (chartId: string, chartTitle: string) => {
    const success = await exportChartAsPng(`chart-box-${chartId}`, `${chartTitle.toLowerCase().replace(/\s+/g, '-')}.png`);
    if (success) {
      showToast(isEn ? `Exported ${chartTitle} as PNG!` : `Đã tải ảnh biểu đồ ${chartTitle}!`, 'success');
    }
  };

  // Export Dashboard / Print Executive Report
  const exportPDF = () => {
    window.print();
    showToast(isEn ? 'Opening print preview...' : 'Đang mở chế độ xem in báo cáo...', 'info');
  };

  // Export Table Data to CSV
  const exportTableCSV = () => {
    if (activeTable.length === 0) return;
    const csv = Papa.unparse(activeTable);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'analytics_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(isEn ? 'CSV data exported!' : 'Đã xuất tệp CSV!', 'success');
  };

  const chartGridColor = isDark ? '#334155' : '#e2e8f0';
  const chartAxisColor = isDark ? '#94a3b8' : '#64748b';
  const chartTooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '10px 14px',
    color: isDark ? '#f8fafc' : '#0f172a',
  };

  // Render individual chart component based on type
  const renderChartComponent = (chart: ChartConfig) => {
    // Dynamic filtered dataset based on time filter
    let chartData = chart.data || [];
    if (timeFilter === 'q1_q2') {
      chartData = chartData.slice(0, Math.ceil(chartData.length / 2));
    } else if (timeFilter === 'q3_q4') {
      chartData = chartData.slice(Math.ceil(chartData.length / 2));
    }

    switch (chart.type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {chart.series.map((s, idx) => (
                  <linearGradient key={s.dataKey} id={`grad-${chart.id}-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color || '#9BE7FA'} stopOpacity={0.35}/>
                    <stop offset="95%" stopColor={s.color || '#9BE7FA'} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
              <XAxis dataKey={chart.xAxisKey} stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              {chart.series.map((s, idx) => (
                <Area 
                  key={s.dataKey} 
                  type="monotone" 
                  dataKey={s.dataKey} 
                  name={s.name} 
                  stroke={s.color || '#9BE7FA'} 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill={`url(#grad-${chart.id}-${idx})`} 
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
              <XAxis dataKey={chart.xAxisKey} stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={chartTooltipStyle}
                cursor={{ fill: isDark ? 'rgba(51, 65, 85, 0.4)' : '#f1f5f9' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              {chart.series.map((s) => (
                <Bar 
                  key={s.dataKey} 
                  dataKey={s.dataKey} 
                  name={s.name} 
                  fill={s.color || '#9BE7FA'} 
                  radius={[6, 6, 0, 0]} 
                  barSize={36} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
              <XAxis dataKey={chart.xAxisKey} stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              {chart.series.map((s) => (
                <Line 
                  key={s.dataKey} 
                  type="monotone" 
                  dataKey={s.dataKey} 
                  name={s.name} 
                  stroke={s.color || '#FFD14C'} 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: isDark ? '#1e293b' : '#ffffff' }}
                  activeDot={{ r: 6 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-sm text-slate-400">{language === 'en' ? 'Chart type not supported.' : 'Loại biểu đồ chưa được hỗ trợ.'}</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500 bg-white dark:bg-slate-950 transition-colors duration-200" ref={dashboardRef}>
      {/* Header with Export & CSV actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-brand-blue-light dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-yellow-light/50 text-slate-900 rounded-full text-xs font-semibold tracking-wide border border-brand-blue-light mb-2 dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
            <Sparkles className="w-3.5 h-3.5 text-slate-900 dark:text-[#FFD14C]" />
            Executive Business Intelligence
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {dashboard.title || t('dash_title', 'Analytics Dashboard')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {dashboard.description || t('dash_subtitle', 'Trực quan hóa chỉ số dữ liệu và xu hướng tăng trưởng')}
          </p>
        </div>

        {/* Top actions */}
        <div className="flex flex-wrap items-center gap-3 no-print">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-brand-blue-light hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer transition-all shadow-xs dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800">
            <Upload className="w-4 h-4 text-slate-900 dark:text-slate-200" />
            {t('dash_upload_csv', 'Nạp CSV Bảng')}
            <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
          </label>

          <button
            onClick={exportPDF}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-950 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all disabled:opacity-60 cursor-pointer dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 font-bold"
          >
            <Download className="w-4 h-4" />
            {isExporting ? t('loading', 'Đang xuất...') : t('dash_export_pdf', 'Xuất Báo cáo PDF')}
          </button>
        </div>
      </div>

      {/* Multi-Dimension Interactive Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface/30 dark:bg-slate-900/90 rounded-2xl border border-border-subtle dark:border-slate-800 no-print">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink-secondary dark:text-slate-300">
          <Filter className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
          <span>{isEn ? 'Filter Time Horizon:' : 'Bộ lọc thời gian:'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: isEn ? 'All Horizons' : 'Tất cả chu kỳ' },
            { id: 'q1_q2', label: isEn ? 'H1 (Q1 - Q2)' : 'Nửa đầu năm (H1)' },
            { id: 'q3_q4', label: isEn ? 'H2 (Q3 - Q4)' : 'Nửa cuối năm (H2)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setTimeFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-medium transition-all cursor-pointer ${
                timeFilter === f.id
                  ? 'bg-accent text-slate-950 dark:bg-amber-400 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-ink-secondary dark:text-slate-300 border border-border-subtle dark:border-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      {dashboard.kpis && dashboard.kpis.length > 0 && (
        <div className="dash-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {dashboard.kpis.map((kpi) => (
            <div
              key={kpi.id}
              className="dash-kpi-card bg-white p-6 rounded-3xl border border-brand-blue-light shadow-sm hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800 dark:shadow-none"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                  {kpi.title}
                </span>
                <div className="p-2.5 bg-slate-50 rounded-2xl dark:bg-slate-800">
                  {renderKpiIcon(kpi.icon)}
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-white tabular-data">
                <AnimatedCounter value={kpi.value} duration={1.4} />
              </div>

              {kpi.change && (
                <div className="text-xs font-medium mt-2 flex items-center gap-1 text-slate-900 dark:text-[#9BE7FA]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {kpi.change}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Charts Grid */}
      <div className="dash-charts-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dashboard.charts && dashboard.charts.length > 0 ? (
          dashboard.charts.map((chart) => (
            <div
              key={chart.id}
              id={`chart-box-${chart.id}`}
              className="dash-chart-card bg-white p-6 sm:p-7 rounded-3xl border border-brand-blue-light shadow-sm hover:shadow-md transition-all flex flex-col dark:bg-slate-900 dark:border-slate-800 dark:shadow-none"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {chart.title}
                  </h3>
                  {chart.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {chart.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleExportChartPng(chart.id, chart.title)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg border border-border-subtle dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer no-print shrink-0"
                  title="Tải ảnh biểu đồ PNG"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="h-72 w-full flex-1">
                {renderChartComponent(chart)}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500">
            {language === 'en' ? 'No charts configured.' : 'Chưa có biểu đồ nào được thiết lập.'}
          </div>
        )}
      </div>

      {/* Tabular Dataset Explorer */}
      {activeTable.length > 0 && (
        <div className="bg-white rounded-3xl border border-brand-blue-light shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
          {/* Table Header & Controls */}
          <div className="p-6 border-b border-brand-blue-light dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/60">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-slate-900 dark:text-[#9BE7FA]" />
                {t('dash_table_title', 'Dữ liệu chi tiết & Bảng tổng hợp')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'en' ? `Showing ${filteredRows.length} records ${customTableData ? '(From custom CSV)' : ''}` : `Hiển thị ${filteredRows.length} dòng dữ liệu ${customTableData ? '(Từ CSV tải lên)' : ''}`}
              </p>
            </div>

            <div className="flex items-center gap-3 no-print">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('dash_search_placeholder', 'Lọc dữ liệu bảng...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-brand-blue dark:bg-slate-800 dark:border-slate-700 dark:text-white placeholder-slate-400"
                />
              </div>

              {customTableData && (
                <button
                  onClick={handleResetTable}
                  className="p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-brand-blue-light/50 text-xs font-medium inline-flex items-center gap-1 cursor-pointer dark:text-slate-400 dark:hover:bg-slate-800"
                  title={language === 'en' ? 'Reset to default data' : 'Đặt lại dữ liệu ban đầu'}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={exportTableCSV}
                className="px-3 py-1.5 bg-brand-blue-light/30 hover:bg-brand-blue-light/70 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                {language === 'en' ? 'Export CSV' : 'Xuất CSV'}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse text-xs sm:text-sm font-heading">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 z-10 border-b border-brand-blue-light dark:border-slate-800">
                <tr>
                  {columns.map(col => (
                    <th key={col} className="px-6 py-3.5 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRows.slice(0, 50).map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    {columns.map(col => (
                      <td key={col} className="px-6 py-3 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap tabular-data">
                        {typeof row[col] === 'number' ? row[col].toLocaleString() : String(row[col] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
