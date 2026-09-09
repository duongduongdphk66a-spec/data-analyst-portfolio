'use client';

import React from 'react';
import { Download, Clock, TrendingUp, Radio } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import SectionHeader from '../../ui/SectionHeader';
import {
  creatorHourlyActivity,
  creatorActivityHighlights
} from '../../../data/kamiElyData';

interface CreatorActivitySectionProps {
  isEn: boolean;
  copyDeepLink: (id: string) => void;
  handleExportChart: (id: string, name: string) => void;
}

export default function CreatorActivitySection({
  isEn,
  copyDeepLink,
  handleExportChart
}: CreatorActivitySectionProps) {
  return (
    <section id="creator-activity" className="space-y-6 scroll-mt-36">
      <SectionHeader 
        badge="2.2" 
        title={isEn ? "Activity & Optimal Posting Windows" : "Phân Tích Hoạt Động & Khung Giờ Đăng Tối Ưu"} 
        id="creator-activity" 
        onCopy={copyDeepLink} 
        badgeBg="bg-[#FFD14C] text-slate-950" 
      />

      {/* 24-Hour Posting Curve Chart */}
      <div id="creator-posting-chart" className="p-6 sm:p-8 rounded-3xl bg-white border border-[#FFD14C]/70 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h3 className="text-base font-black text-slate-950 dark:text-white">
              {isEn ? '24-Hour Video Posting Count & Hourly Engagement Rate (%)' : 'Biểu Đồ 24 Giờ: Số Lượng Bài Đăng & Tỷ Lệ Tương Tác Giờ Vàng (%)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ghi nhận đỉnh điểm đăng video lúc 08:00, 10:00, 11:00 và tỷ lệ tương tác bùng nổ lúc 15:00 - 16:00 (0.74%)
            </p>
          </div>
          <button
            onClick={() => handleExportChart('creator-posting-chart', 'kamielyn-posting-activity-24h')}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FFE485]/50 hover:bg-[#FFE485] text-slate-950 border border-[#FFD14C] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-[#FFD14C] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất PNG</span>
          </button>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={creatorHourlyActivity} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#0D7287" fontSize={11} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#b45309" fontSize={11} tickLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }} />
              <Line yAxisId="left" type="monotone" dataKey="posts" name="Số video đã đăng" stroke="#0D7287" strokeWidth={3} dot={{ r: 4, fill: '#9BE7FA' }} />
              <Line yAxisId="right" type="monotone" dataKey="engagement" name="Tỷ lệ tương tác (%)" stroke="#FFD14C" strokeWidth={3} dot={{ r: 4, fill: '#FFE485' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Activity Highlights Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA]">
            <Clock className="w-5 h-5" />
            <h4 className="font-black text-sm text-slate-950 dark:text-white">Khung Giờ Đăng Nhiều Nhất</h4>
          </div>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {creatorActivityHighlights.topPostingHours.map((h, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#C8EEF7]/30 font-bold dark:bg-slate-800 flex justify-between">
                <span>Top {i + 1}</span>
                <span className="text-[#0D7287] dark:text-[#9BE7FA]">{h}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 pt-1">54% bài đăng tập trung trong khoảng 06:00 - 12:00 sáng.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#FFD14C] shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-950 dark:text-[#FFD14C]">
            <TrendingUp className="w-5 h-5" />
            <h4 className="font-black text-sm text-slate-950 dark:text-white">Khung Giờ Tương Tác Đỉnh</h4>
          </div>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {creatorActivityHighlights.topEngagementWindows.map((w, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#FFFDF5] font-bold border border-[#FFE485]/60 dark:bg-slate-800 flex justify-between">
                <span>{w.time}</span>
                <span className="text-[#0D7287] dark:text-[#FFD14C]">{w.rate}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 pt-1">Đỉnh 15h-16h vượt trội 76% so với mức trung bình 0.42% toàn kênh.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#C8EEF7] shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA]">
            <Radio className="w-5 h-5" />
            <h4 className="font-black text-sm text-slate-950 dark:text-white">Tần Suất Bán Hàng</h4>
          </div>
          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-2.5 rounded-xl bg-[#C8EEF7]/30 font-bold dark:bg-slate-800 flex justify-between">
              <span>Đăng video ngắn</span>
              <span className="text-slate-900 dark:text-white">~2 video / ngày</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#C8EEF7]/30 font-bold dark:bg-slate-800 flex justify-between">
              <span>Phiên LIVE định kỳ</span>
              <span className="text-[#0D7287] dark:text-[#9BE7FA]">73 phiên / 28 ngày</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#C8EEF7]/30 font-bold dark:bg-slate-800 flex justify-between">
              <span>Thời lượng TB/phiên</span>
              <span className="text-slate-900 dark:text-white">02 giờ 26 phút</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">Mật độ phủ sóng dày đặc ~2.6 phiên LIVE/ngày giúp duy trì tương tác cao.</p>
        </div>
      </div>
    </section>
  );
}
