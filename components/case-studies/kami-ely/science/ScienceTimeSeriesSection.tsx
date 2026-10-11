'use client';

import React from 'react';
import { Activity, Download } from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { KAMI_MATH_STATS } from '@/app/data/kamiElyData';

interface ScienceTimeSeriesSectionProps {
  isEn: boolean;
  tsPanelFocus: 'all' | 'trend' | 'seasonal' | 'residual';
  setTsPanelFocus: (_v: 'all' | 'trend' | 'seasonal' | 'residual') => void;
  handleExport: (_id: string, _name: string) => void;
  timeSeriesData?: any[];
  isLiveDb?: boolean;
}

export default function ScienceTimeSeriesSection({
  isEn,
  tsPanelFocus,
  setTsPanelFocus,
  handleExport,
  timeSeriesData,
  isLiveDb
}: ScienceTimeSeriesSectionProps) {
  const chartData = timeSeriesData && timeSeriesData.length > 0 ? timeSeriesData : KAMI_MATH_STATS.timeSeries.data;

  return (
    <section id="sec-timeseries" className="space-y-8 py-16 md:py-20 border-b border-slate-200/80 dark:border-slate-800">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="editorial-kicker">
            {isEn ? 'PHASE 05 · 180-DAY TIME-SERIES DECOMPOSITION' : 'PHẦN 5 · BÓC TÁCH XU HƯỚNG & TÍNH MÙA VỤ 180 NGÀY'}
          </span>
        </div>
        <h2 className="editorial-section-title text-2xl sm:text-3xl lg:text-4xl text-slate-950 dark:text-white">
          {isEn ? '180-Day Seasonal Decomposition: Trend vs Cycle' : 'Bóc Tách Tín Hiệu Doanh Thu 180 Ngày: Hiệu Ứng Mùa Vụ Hè'}
        </h2>
        <p className="editorial-lead text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-4xl">
          {isEn
            ? 'Decomposing 180-day sales into Trend, Seasonality, and Residuals proves the August-September decline was due to post-summer seasonality, not the live team\'s execution.'
            : 'Bóc tách dữ liệu 180 ngày cho thấy doanh số tháng 8-9 giảm là do hết mùa du lịch hè, không phải do lỗi vận hành Live.'}
        </p>
      </div>

      {/* Signal Breakdown Framework */}
      <div className="card-minimal p-6 space-y-4 border border-[#9BE7FA] bg-gradient-to-br from-white via-[#EAF8FC]/50 to-[#C8EEF7]/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="flex items-center justify-between border-b border-[#C8EEF7] dark:border-slate-800 pb-3 text-xs font-bold uppercase tracking-wider text-[#074553] dark:text-[#9BE7FA]">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#074553] dark:text-[#9BE7FA]" />
            {isEn ? '180-Day Revenue Signal Breakdown' : 'Bóc Tách 3 Thành Phần Doanh Thu 180 Ngày'}
          </span>
          <span className="font-mono text-[11px] text-[#074553] dark:text-[#9BE7FA] bg-[#C8EEF7]/70 dark:bg-[#9BE7FA]/15 px-2.5 py-0.5 rounded-full border border-[#9BE7FA]">
            Chu kỳ tuần hoàn 7 ngày
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-1 text-xs sm:grid-cols-3">
          <div className="space-y-1">
            <strong className="text-[#074553] dark:text-[#9BE7FA]">1. Xu hướng Dài hạn (Trend):</strong>
            <p className="text-slate-600 dark:text-slate-400">Tăng trưởng mạnh lúc cao điểm sắm đồ bơi hè (tháng 4-6), giảm tự nhiên khi vào năm học mới (tháng 8-9).</p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-800 dark:text-slate-200">2. Chu kỳ Tuần hoàn (Seasonality):</strong>
            <p className="text-slate-600 dark:text-slate-400">Doanh số tập trung cao từ thứ Năm đến thứ Bảy để kịp giao hàng cho các chuyến du lịch cuối tuần.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-[#074553] dark:text-[#9BE7FA]">3. Xung lực Đột biến (Residual):</strong>
            <p className="text-slate-600 dark:text-slate-400">Các đợt bùng nổ đơn hàng phát sinh từ chiến dịch Mega Sale định kỳ của nền tảng TikTok Shop (6.6, 7.7).</p>
          </div>
        </div>
      </div>

      {/* 4-Panel Synchronized Time-Series Chart */}
      <div id="chart-decomp-4panel" className="card-minimal p-6 space-y-6 border border-[#9BE7FA]/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {isEn ? '5.1. 4-Panel Synchronized Time-Series Chart' : '5.1. Biểu đồ 4 Panel Phân Rã Tín Hiệu Doanh Thu'}
              </h3>
              {isLiveDb && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isEn ? 'MySQL Live (180 Days)' : 'MySQL Live (180 Ngày)'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {isEn ? 'Visualizing Original Revenue, Trend Line, Weekly Cycle, and Event Spikes' : 'Trực quan hóa Doanh thu thực tế, Đường xu hướng, Chu kỳ tuần hoàn và Xung lực sale'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: isEn ? 'ALL' : 'Tất cả' },
              { id: 'trend', label: isEn ? 'TREND' : 'Xu hướng' },
              { id: 'seasonal', label: isEn ? 'SEASON' : 'Mùa vụ' },
              { id: 'residual', label: isEn ? 'EVENT' : 'Đột biến' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setTsPanelFocus(btn.id as any)}
                className={`rounded-lg px-3 py-1.5 text-xs transition cursor-pointer active:scale-[0.97] ${
                  tsPanelFocus === btn.id
                    ? 'bg-[#9BE7FA] text-slate-950 font-bold border border-[#9BE7FA] shadow-xs dark:bg-[#9BE7FA] dark:text-slate-950'
                    : 'bg-[#C8EEF7]/30 text-slate-700 hover:bg-[#C8EEF7]/60 border border-[#C8EEF7] dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                }`}
              >
                {btn.label}
              </button>
            ))}
            <button
              onClick={() => handleExport('chart-decomp-4panel', 'TimeSeries_Breakdown_KamiEly')}
              className="btn-secondary-editorial py-1.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isEn ? 'Export PNG' : 'Xuất'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Panel 1: Original */}
          {(tsPanelFocus === 'all' || tsPanelFocus === 'trend') && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">1. Doanh thu Thực tế & Đường Xu hướng Dài hạn</span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#9BE7FA" opacity={0.25} />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} unit="M" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#9BE7FA', color: '#f8fafc', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="original" stroke="#074553" strokeWidth={1.5} dot={false} name="Doanh thu thực tế (M)" />
                    <Line type="monotone" dataKey="trend" stroke="#FFD14C" strokeWidth={2.5} dot={false} name="Xu hướng dài hạn" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Panel 2: Seasonal */}
          {(tsPanelFocus === 'all' || tsPanelFocus === 'seasonal') && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">2. Chu kỳ Biến động Tuần hoàn (Seasonality)</span>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#9BE7FA" opacity={0.25} />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} unit="M" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#9BE7FA', color: '#f8fafc', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="seasonal" stroke="#0D7287" fill="#9BE7FA" fillOpacity={0.4} name="Biến động tuần hoàn (M)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Panel 3: Residual */}
          {(tsPanelFocus === 'all' || tsPanelFocus === 'residual') && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">3. Tác động Ngẫu nhiên & Đợt Sale (Residual)</span>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#9BE7FA" opacity={0.25} />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} unit="M" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#9BE7FA', color: '#f8fafc', borderRadius: '12px' }} />
                    <Bar dataKey="residual" fill="#9BE7FA" name="Tác động đột biến (M)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#9BE7FA] bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/10 p-4 text-xs text-slate-800 dark:text-slate-200">
          <span className="inline-block px-2 py-0.5 rounded bg-[#FFD14C] text-slate-950 font-bold mr-2 text-[10px] uppercase">
            Bài học Quản trị Vận hành
          </span>
          Doanh thu tháng 8-9 giảm theo tính mùa vụ (hết hè). Việc ép đội ngũ tăng 27 phiên LIVE/ngày vào tháng 9 là đi ngược thị trường và gây lãng phí chi phí.
        </div>
      </div>
    </section>
  );
}
