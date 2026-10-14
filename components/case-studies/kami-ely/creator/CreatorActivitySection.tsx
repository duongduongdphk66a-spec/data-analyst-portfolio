'use client';

import React from 'react';
import { Download, Clock, TrendingUp, Radio, AlertCircle, Sparkles } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  creatorHourlyActivity,
  creatorActivityHighlights
} from '@/app/data/kamiElyData';

interface CreatorActivitySectionProps {
  isEn: boolean;
  copyDeepLink: (_id: string) => void;
  handleExportChart: (_id: string, _name: string) => void;
  hourlyActivity?: typeof creatorHourlyActivity;
  activityHighlights?: typeof creatorActivityHighlights;
}

export default function CreatorActivitySection({
  isEn,
  copyDeepLink,
  handleExportChart,
  hourlyActivity,
  activityHighlights
}: CreatorActivitySectionProps) {
  const activeHourly = (hourlyActivity && hourlyActivity.length > 0) ? hourlyActivity : creatorHourlyActivity;
  const activeHighlights = activityHighlights || creatorActivityHighlights;
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
            <LineChart data={activeHourly} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
            {activeHighlights.topPostingHours.map((h, i) => (
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
            {activeHighlights.topEngagementWindows.map((w, i) => (
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

      {/* 2.2.B Posting Schedule Mismatch vs. Audience Peak Engagement Diagnostics */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-amber-50/30 border-2 border-[#FFD14C]/80 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 dark:border-amber-700/60 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 dark:text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/20">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{isEn ? 'BEHAVIORAL ENGAGEMENT GAP ANALYSIS' : 'CHẨN ĐOÁN ĐIỂM RƠI TƯƠNG TÁC & LỆCH PHA LỊCH ĐĂNG'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
              {isEn 
                ? 'Posting Schedule Mismatch vs. Audience Peak Engagement Hours' 
                : 'Lệch Pha Giờ Đăng (54% Đăng Sáng) vs. Giờ Vàng Tương Tác Khán Giả (12h & 15h)'}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 text-amber-800 dark:text-amber-300 shrink-0 self-start sm:self-auto">
            Audience: 73% Nữ · 60% 18–24 Tuổi
          </span>
        </div>

        {/* 2-Column Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Current Ineffective Habit */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              {isEn ? '1. Current Publication Practice (Morning Heavy)' : '1. Thói Quen Xuất Bản Hiện Tại (Lệch Buổi Sáng)'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dữ liệu chu kỳ 24 giờ cho thấy <strong>54% số lượng video</strong> được đăng tập trung dồn dập trong khung giờ <strong>08:00 – 12:00 sáng</strong>:
            </p>
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between">
                <span>08:00 sáng:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">8 video (Tương tác chỉ 0,66%)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between">
                <span>10:00 – 11:00 trưa:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">13 video (Tương tác chỉ 0,55% – 0,60%)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic pt-1">
              → Khán giả mục tiêu (60% độ tuổi 18–24, học sinh/sinh viên & nhân sự trẻ) đang trong giờ học và làm việc, khiến video bỏ lỡ cửa sổ 1 giờ vàng đầu tiên của thuật toán phân phối.
            </p>
          </div>

          {/* Right: Actual Audience Behavioral Peak */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {isEn ? '2. Actual Audience Engagement Peak Hours' : '2. Điểm Rơi Tương Tác Thật Của Khán Giả'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tỷ lệ tương tác thực tế (Engagement Rate %) bùng nổ mạnh nhất vào hai thời điểm thư giãn tự nhiên:
            </p>
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex justify-between">
                <span className="font-bold text-emerald-900 dark:text-emerald-200">Khung 15:00 – 16:00 (Chiều):</span>
                <span className="font-black text-emerald-700 dark:text-emerald-300">0,74% (Đỉnh cao nhất ngày)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex justify-between">
                <span className="font-bold text-emerald-900 dark:text-emerald-200">Khung 12:00 – 13:00 (Nghỉ trưa):</span>
                <span className="font-black text-emerald-700 dark:text-emerald-300">0,71% (Đỉnh nhì ngày)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic pt-1">
              → Mức tương tác lúc 15h–16h vượt trội <strong>+76%</strong> so với tỷ lệ tương tác bình quân 0,42% của toàn kênh.
            </p>
          </div>
        </div>

        {/* Action Plan */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5 leading-relaxed">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-amber-900 dark:text-amber-300">Hành động điều chỉnh lịch đăng: </strong>
            Dịch chuyển toàn bộ lịch đăng video sáng sang <strong>11:30 – 12:00</strong> (đón dòng người lướt mạng giờ nghỉ trưa) và <strong>14:30 – 15:00</strong> (đón giờ giải lao chiều). Việc đăng trước đỉnh tương tác 30 phút cho phép thuật toán TikTok thu thập đủ tín hiệu retention ban đầu để đẩy video vào For You Feed tại đúng đỉnh tương tác.
          </p>
        </div>
      </div>
    </section>
  );
}

