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
  setTsPanelFocus: (v: 'all' | 'trend' | 'seasonal' | 'residual') => void;
  handleExport: (id: string, name: string) => void;
}

export default function ScienceTimeSeriesSection({
  isEn,
  tsPanelFocus,
  setTsPanelFocus,
  handleExport
}: ScienceTimeSeriesSectionProps) {
  return (
    <section id="sec-timeseries" className="space-y-8 py-14 border-b border-slate-200/80 dark:border-slate-800">
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
            ? 'Decomposing 180 days of store sales into Trend, Seasonality, and Residual components. This demonstrates that the August-September decline was driven by seasonal post-summer vacation demand, not live team execution failure.'
            : 'Bóc tách dữ liệu 180 ngày thành Xu hướng dài hạn, Chu kỳ mùa vụ và Đợt sale đột biến. Kết quả chứng minh sự sụt giảm doanh số tháng 8-9 là hệ quả khách quan của chu kỳ mùa du lịch hè kết thúc, không hoàn toàn do lỗi đội ngũ vận hành Live.'}
        </p>
      </div>

      {/* Signal Breakdown Framework */}
      <div className="card-minimal p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 text-xs font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {isEn ? '180-Day Revenue Signal Breakdown' : 'Bóc Tách 3 Thành Phần Doanh Thu 180 Ngày'}
          </span>
          <span className="font-mono text-[11px] text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
            Chu kỳ tuần hoàn 7 ngày
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-1 text-xs sm:grid-cols-3">
          <div className="space-y-1">
            <strong className="text-[#0D7287] dark:text-[#9BE7FA]">1. Xu hướng Dài hạn (Trend):</strong>
            <p className="text-slate-500 dark:text-slate-400">Tăng trưởng mạnh mẽ từ tháng 4 đến tháng 6 (cao điểm sắm đồ bơi hè), thoái trào tự nhiên từ tháng 8 đến tháng 9 khi học sinh trở lại trường.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-amber-600 dark:text-amber-400">2. Chu kỳ Tuần hoàn (Seasonality):</strong>
            <p className="text-slate-500 dark:text-slate-400">Tập trung doanh số cao vào thứ Năm đến thứ Bảy hàng tuần để kịp giao hàng phục vụ các chuyến du lịch cuối tuần.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-emerald-600 dark:text-emerald-400">3. Xung lực Đột biến (Residual):</strong>
            <p className="text-slate-500 dark:text-slate-400">Các đợt bùng nổ đơn hàng phát sinh từ chiến dịch Mega Sale định kỳ của nền tảng TikTok Shop (6.6, 7.7).</p>
          </div>
        </div>
      </div>

      {/* 4-Panel Synchronized Time-Series Chart */}
      <div id="chart-decomp-4panel" className="card-minimal p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              {isEn ? '5.1. 4-Panel Synchronized Time-Series Chart' : '5.1. Biểu đồ 4 Panel Phân Rã Tín Hiệu Doanh Thu'}
            </h3>
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
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${tsPanelFocus === btn.id ? 'bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-bold' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}
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
              <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">1. Doanh thu Thực tế & Đường Xu hướng Dài hạn</span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={KAMI_MATH_STATS.timeSeries.data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} unit="M" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="original" stroke="#0D7287" strokeWidth={1.5} dot={false} name="Doanh thu thực tế (M)" />
                    <Line type="monotone" dataKey="trend" stroke="#f59e0b" strokeWidth={2.5} dot={false} name="Xu hướng dài hạn" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Panel 2: Seasonal */}
          {(tsPanelFocus === 'all' || tsPanelFocus === 'seasonal') && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">2. Chu kỳ Biến động Tuần hoàn (Seasonality)</span>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={KAMI_MATH_STATS.timeSeries.data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} unit="M" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="seasonal" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Biến động tuần hoàn (M)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Panel 3: Residual */}
          {(tsPanelFocus === 'all' || tsPanelFocus === 'residual') && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">3. Tác động Ngẫu nhiên & Đợt Sale (Residual)</span>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={KAMI_MATH_STATS.timeSeries.data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} unit="M" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                    <Bar dataKey="residual" fill="#64748b" name="Tác động đột biến (M)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200">
          <strong>Bài học Quản trị Vận hành:</strong> Kết quả bóc tách chuỗi thời gian cho thấy rõ doanh thu tháng 8-9 sụt giảm đồng thuận với sự hạ nhiệt của mùa du lịch hè. Việc ban quản lý cố gắng ép đội ngũ tăng lên tới 27 phiên LIVE/ngày vào tháng 9 là một quyết định đi ngược lại chu kỳ tự nhiên của thị trường, gây lãng phí chi phí vận hành.
        </div>
      </div>
    </section>
  );
}
