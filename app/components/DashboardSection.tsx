'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  DollarSign, Users, Activity, TrendingUp, BarChart3, 
  Download, Upload, Search, Filter, RefreshCw, FileText, Database, Sparkles 
} from 'lucide-react';
import Papa from 'papaparse';
import { DashboardData, KpiItem, ChartConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DashboardSectionProps {
  dashboard: DashboardData;
}

export default function DashboardSection({ dashboard }: DashboardSectionProps) {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [customTableData, setCustomTableData] = useState<Record<string, any>[] | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Active table data (either custom uploaded or from dashboard config)
  const activeTable = useMemo(() => {
    return customTableData || dashboard.tableData || [];
  }, [customTableData, dashboard.tableData]);

  // Filter table rows
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return activeTable;
    const lower = searchTerm.toLowerCase();
    return activeTable.filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(lower)
      )
    );
  }, [activeTable, searchTerm]);

  // Extract table column headers
  const columns = useMemo(() => {
    if (activeTable.length === 0) return [];
    return Object.keys(activeTable[0]).filter(k => k !== 'id');
  }, [activeTable]);

  // KPI icon resolver
  const renderKpiIcon = (iconType: KpiItem['icon']) => {
    switch (iconType) {
      case 'dollar': return <DollarSign className="w-5 h-5 text-slate-900" />;
      case 'users': return <Users className="w-5 h-5 text-slate-900" />;
      case 'activity': return <Activity className="w-5 h-5 text-slate-900" />;
      case 'trending': return <TrendingUp className="w-5 h-5 text-brand-yellow" />;
      default: return <BarChart3 className="w-5 h-5 text-slate-900" />;
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
        }
      },
      error: (err) => {
        alert(language === 'en' ? 'Error reading CSV file: ' + err.message : 'Lỗi đọc file CSV: ' + err.message);
      }
    });
  };

  // Reset custom CSV preview
  const handleResetTable = () => {
    setCustomTableData(null);
    setSearchTerm('');
  };

  // Export Dashboard to PDF
  const exportPDF = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const noPrintEls = dashboardRef.current.querySelectorAll('.no-print');
      noPrintEls.forEach(el => (el as HTMLElement).style.opacity = '0');

      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      noPrintEls.forEach(el => (el as HTMLElement).style.opacity = '1');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Data-Analyst-Executive-Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(language === 'en' ? 'Error generating PDF. Please try again!' : 'Có lỗi khi tạo file PDF. Vui lòng thử lại!');
    } finally {
      setIsExporting(false);
    }
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
  };

  // Render individual chart component based on type
  const renderChartComponent = (chart: ChartConfig) => {
    switch (chart.type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {chart.series.map((s, idx) => (
                  <linearGradient key={s.dataKey} id={`grad-${chart.id}-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color || '#1A9AB5'} stopOpacity={0.35}/>
                    <stop offset="95%" stopColor={s.color || '#1A9AB5'} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey={chart.xAxisKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '10px 14px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              {chart.series.map((s, idx) => (
                <Area 
                  key={s.dataKey} 
                  type="monotone" 
                  dataKey={s.dataKey} 
                  name={s.name} 
                  stroke={s.color || '#1A9AB5'} 
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
            <BarChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey={chart.xAxisKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                cursor={{ fill: '#f1f5f9' }}
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
            <LineChart data={chart.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey={chart.xAxisKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              {chart.series.map((s) => (
                <Line 
                  key={s.dataKey} 
                  type="monotone" 
                  dataKey={s.dataKey} 
                  name={s.name} 
                  stroke={s.color || '#FFD14C'} 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
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
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-500 bg-white" ref={dashboardRef}>
      {/* Header with Export & CSV actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-brand-blue-light">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-yellow-light/50 text-slate-900 rounded-full text-xs font-semibold tracking-wide border border-brand-blue-light mb-2">
            <Sparkles className="w-3.5 h-3.5 text-slate-900" />
            Executive Business Intelligence
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {dashboard.title || t('dash_title', 'Analytics Dashboard')}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            {dashboard.description || t('dash_subtitle', 'Trực quan hóa chỉ số dữ liệu và xu hướng tăng trưởng')}
          </p>
        </div>

        {/* Top actions */}
        <div className="flex flex-wrap items-center gap-3 no-print">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-brand-blue-light hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer transition-all shadow-xs">
            <Upload className="w-4 h-4 text-slate-900" />
            {t('dash_upload_csv', 'Nạp CSV Bảng')}
            <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
          </label>

          <button
            onClick={exportPDF}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all disabled:opacity-60 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {isExporting ? t('loading', 'Đang xuất...') : t('dash_export_pdf', 'Xuất Báo cáo PDF')}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {dashboard.kpis && dashboard.kpis.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {dashboard.kpis.map((kpi) => (
            <div
              key={kpi.id}
              className="bg-white p-6 rounded-3xl border border-brand-blue-light shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className="p-2.5 bg-slate-50 rounded-2xl">
                  {renderKpiIcon(kpi.icon)}
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {kpi.value}
              </div>

              {kpi.change && (
                <div className="text-xs font-medium mt-2 flex items-center gap-1 text-slate-900">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {kpi.change}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dashboard.charts && dashboard.charts.length > 0 ? (
          dashboard.charts.map((chart) => (
            <div
              key={chart.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-brand-blue-light shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {chart.title}
                </h3>
                {chart.description && (
                  <p className="text-xs text-slate-500 mt-1">
                    {chart.description}
                  </p>
                )}
              </div>

              <div className="h-72 w-full flex-1">
                {renderChartComponent(chart)}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400">
            {language === 'en' ? 'No charts configured.' : 'Chưa có biểu đồ nào được thiết lập.'}
          </div>
        )}
      </div>

      {/* Tabular Dataset Explorer */}
      {activeTable.length > 0 && (
        <div className="bg-white rounded-3xl border border-brand-blue-light shadow-sm overflow-hidden">
          {/* Table Header & Controls */}
          <div className="p-6 border-b border-brand-blue-light flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-slate-900" />
                {t('dash_table_title', 'Dữ liệu chi tiết & Bảng tổng hợp')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
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
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              {customTableData && (
                <button
                  onClick={handleResetTable}
                  className="p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-brand-blue-light/50 text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  title={language === 'en' ? 'Reset to default data' : 'Đặt lại dữ liệu ban đầu'}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={exportTableCSV}
                className="px-3 py-1.5 bg-brand-blue-light/30 hover:bg-brand-blue-light/70 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {language === 'en' ? 'Export CSV' : 'Xuất CSV'}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="sticky top-0 bg-slate-50 z-10 border-b border-brand-blue-light">
                <tr>
                  {columns.map(col => (
                    <th key={col} className="px-6 py-3.5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.slice(0, 50).map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50 transition-colors">
                    {columns.map(col => (
                      <td key={col} className="px-6 py-3 text-slate-700 font-medium whitespace-nowrap">
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
