'use client';

import React from 'react';
import { TrendingUp, Plus, Trash2, BarChart3, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';
import { DashboardData, ChartConfig, KpiItem } from '../../types';

interface ChartsTabProps {
  formDashboard: DashboardData;
  setFormDashboard: React.Dispatch<React.SetStateAction<DashboardData>>;
}

export default function ChartsTab({ formDashboard, setFormDashboard }: ChartsTabProps) {
  // KPI Handlers
  const handleKpiAdd = () => {
    const newKpi: KpiItem = {
      id: `kpi-${Date.now()}`,
      title: 'Chỉ số mới',
      value: '100%',
      change: '+10% MoM',
      icon: 'trending',
    };
    setFormDashboard((prev) => ({ ...prev, kpis: [...prev.kpis, newKpi] }));
  };

  const handleKpiRemove = (id: string) => {
    setFormDashboard((prev) => ({ ...prev, kpis: prev.kpis.filter((k) => k.id !== id) }));
  };

  const handleKpiChange = (id: string, field: keyof KpiItem, value: any) => {
    setFormDashboard((prev) => ({
      ...prev,
      kpis: prev.kpis.map((k) => (k.id === id ? { ...k, [field]: value } : k)),
    }));
  };

  // Chart Handlers
  const handleChartAdd = (type: ChartConfig['type']) => {
    const newChart: ChartConfig = {
      id: `chart-${Date.now()}`,
      title: `Biểu đồ ${type.toUpperCase()} mới`,
      description: 'Mô tả ngắn gọn về chỉ số và xu hướng dữ liệu...',
      type,
      xAxisKey: 'name',
      series: [
        {
          name: 'Chỉ số A',
          dataKey: 'valA',
          color: type === 'line' ? '#FFD14C' : '#9BE7FA',
        },
      ],
      data: [
        { name: 'Tháng 1', valA: 400 },
        { name: 'Tháng 2', valA: 600 },
        { name: 'Tháng 3', valA: 800 },
        { name: 'Tháng 4', valA: 1100 },
      ],
    };
    setFormDashboard((prev) => ({ ...prev, charts: [...prev.charts, newChart] }));
  };

  const handleChartRemove = (id: string) => {
    setFormDashboard((prev) => ({ ...prev, charts: prev.charts.filter((c) => c.id !== id) }));
  };

  const handleChartChange = (index: number, updated: ChartConfig) => {
    const list = [...formDashboard.charts];
    list[index] = updated;
    setFormDashboard((prev) => ({ ...prev, charts: list }));
  };

  const handleChartCsvUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const firstRow = results.data[0] as Record<string, any>;
          const keys = Object.keys(firstRow);
          const xKey = keys[0] || 'name';
          const numericKeys = keys.slice(1).filter((k) => typeof firstRow[k] === 'number');

          const series = (numericKeys.length > 0 ? numericKeys : keys.slice(1)).map((k, i) => ({
            name: k,
            dataKey: k,
            color: ['#9BE7FA', '#FFD14C', '#10B981', '#6366F1', '#EC4899'][i % 5],
          }));

          const updated: ChartConfig = {
            ...formDashboard.charts[index],
            xAxisKey: xKey,
            series,
            data: results.data as Record<string, any>[],
          };
          handleChartChange(index, updated);
          alert(`✅ Đã nạp thành công ${results.data.length} dòng dữ liệu từ CSV vào biểu đồ!`);
        }
      },
      error: (err) => {
        alert('Lỗi đọc CSV: ' + err.message);
      },
    });
  };

  return (
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
  );
}
