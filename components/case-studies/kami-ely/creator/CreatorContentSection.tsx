'use client';

import React, { useState } from 'react';
import { Bookmark, Video, Radio, Eye, Sparkles, ShoppingCart } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  creatorVideoStats,
  creatorTopVideos,
  creatorLiveKPIs,
  creatorTopLiveStreams,
  PALETTE
} from '@/app/data/kamiElyData';

interface CreatorContentSectionProps {
  isEn: boolean;
  copyDeepLink: (_id: string, _name?: string) => void;
  topVideos?: typeof creatorTopVideos;
  topLiveStreams?: typeof creatorTopLiveStreams;
}

export default function CreatorContentSection({
  isEn,
  copyDeepLink,
  topVideos,
  topLiveStreams
}: CreatorContentSectionProps) {
  const [crVideoCatMetric, setCrVideoCatMetric] = useState<'units' | 'gmv'>('units');
  const activeVideos = (topVideos && topVideos.length > 0) ? topVideos : creatorTopVideos;
  const activeStreams = (topLiveStreams && topLiveStreams.length > 0) ? topLiveStreams : creatorTopLiveStreams;

  return (
    <div className="space-y-16">
      {/* GROUP DIVIDER: ĐỘNG CƠ NỘI DUNG & DOANH THU */}
      <div className="pt-6 pb-2 flex items-center gap-4">
        <div className="h-px bg-gradient-to-r from-transparent via-[#FFD14C] to-transparent flex-1 dark:via-slate-700" />
        <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFE485] text-slate-950 border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700 shadow-xs">
          {isEn ? 'Group II: Content & Sales Engine (Video & LIVE)' : 'Nhóm II: Động Cơ Nội Dung & Doanh Thu (Video & LIVE)'}
        </span>
        <div className="h-px bg-gradient-to-r from-transparent via-[#FFD14C] to-transparent flex-1 dark:via-slate-700" />
      </div>

      {/* 2.4 VIDEO (CREATOR VIDEO PERFORMANCE) */}
      <section id="creator-video" className="space-y-6 scroll-mt-36">
        <SectionHeader 
          badge="2.4" 
          title={isEn ? "Creator Video Performance & Tag Analytics" : "Hiệu Quả Video Của Creator & Phân Tích Tag"} 
          id="creator-video" 
          onCopy={copyDeepLink} 
          badgeBg="bg-[#FFD14C] text-slate-950" 
        />

        {/* Creator video overview metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-slate-950 dark:text-white">{creatorVideoStats.totalVideos}</div>
            <div className="text-xs text-slate-500 mt-1">Tổng video (551 có giỏ hàng)</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{creatorVideoStats.totalViews}</div>
            <div className="text-xs text-slate-500 mt-1">Tổng lượt xem tích lũy</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-[#0D7287] dark:text-[#FFD14C]">{creatorVideoStats.avgEngagementRate}</div>
            <div className="text-xs text-slate-500 mt-1">Tỷ lệ tương tác bình quân</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-slate-950 dark:text-[#FFD14C]">{creatorVideoStats.videoGmv}</div>
            <div className="text-xs text-slate-500 mt-1">GMV bán trực tiếp qua video</div>
          </div>
        </div>

        {/* Hashtags & Category proportion */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top 5 Hashtags */}
          <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#0D7287] dark:text-[#FFD14C]" />
              {isEn ? 'Top 5 Viral Hashtags' : 'Top 5 Hashtag Mang Lại Tương Tác Cao Nhất'}
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={creatorVideoStats.topHashtags} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis dataKey="tag" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={110} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Tỷ lệ xuất hiện']} />
                  <Bar dataKey="value" fill="#0D7287" radius={[0, 6, 6, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Video Category Distribution */}
          <div className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-950 dark:text-white">Cơ Cấu Ngành Bán Qua Video</h3>
              <div className="flex bg-[#FFE485]/30 rounded-xl p-1 dark:bg-slate-800">
                <button 
                  onClick={() => setCrVideoCatMetric('units')} 
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${crVideoCatMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Số lượng
                </button>
                <button 
                  onClick={() => setCrVideoCatMetric('gmv')} 
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${crVideoCatMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  GMV
                </button>
              </div>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={creatorVideoStats.categories[crVideoCatMetric]}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="75%"
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {creatorVideoStats.categories[crVideoCatMetric].map((_, index) => (
                      <Cell key={`cell-vc-${index}`} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, 'Tỷ trọng']} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Creator Top Videos Table */}
        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
            {isEn ? 'Top Revenue-Generating Videos Produced by Kamielyn' : 'Top Video Gắn Giỏ Hàng Mang Lại GMV Khủng Nhất Của Kamielyn'}
          </h3>
          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#FFE485] bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFE485]/30 text-slate-800 font-bold uppercase border-b border-[#FFE485]/60 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Tiêu Đề Video</th>
                  <th className="p-3.5">Ngày Đăng</th>
                  <th className="p-3.5">Lượt Xem</th>
                  <th className="p-3.5">Lượt Thích</th>
                  <th className="p-3.5">Tỷ Lệ Tương Tác</th>
                  <th className="p-3.5">Sản Phẩm Bán</th>
                  <th className="p-3.5">GMV Video</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeVideos.map((v, i) => (
                  <tr key={i} className="hover:bg-[#FFE485]/10 transition-colors dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-sm truncate">{v.title}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono">{v.publishDate}</td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{v.views.toLocaleString()}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{v.likes.toLocaleString()}</td>
                    <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#9BE7FA]">{v.interactionRate}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{v.units.toLocaleString()} SP</td>
                    <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{v.gmv} Triệu đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {activeVideos.map((v, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {v.publishDate}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FFE485] text-slate-950 text-xs font-black border border-[#FFD14C]">
                    {v.interactionRate} tương tác
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white line-clamp-2">
                  {v.title}
                </h4>
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-center">
                  <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-xs text-slate-400">{isEn ? 'Views' : 'Lượt xem'}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{v.views.toLocaleString()}</div>
                  </div>
                  <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-xs text-slate-400">{isEn ? 'Likes' : 'Thích'}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{v.likes.toLocaleString()}</div>
                  </div>
                  <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-xs text-slate-400">{isEn ? 'Sold' : 'Đã bán'}</div>
                    <div className="font-black text-slate-950 dark:text-white">{v.units.toLocaleString()} SP</div>
                  </div>
                  <div className="p-1 rounded-xl bg-[#FFE485]/40 dark:bg-slate-800/60">
                    <div className="text-xs text-slate-400">{isEn ? 'GMV' : 'Doanh thu'}</div>
                    <div className="font-black text-[#0D7287] dark:text-[#FFD14C]">{v.gmv} Tr đ</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 LIVESTREAM (CREATOR LIVE PERFORMANCE) */}
      <section id="creator-live" className="space-y-6 scroll-mt-36">
        <SectionHeader 
          badge="2.5" 
          title={isEn ? "Creator LIVE Performance & Marathon Sales" : "Hiệu Suất Livestream Của Creator & Kỷ Lục Doanh Số"} 
          id="creator-live" 
          onCopy={copyDeepLink} 
          badgeBg="bg-[#FFD14C] text-slate-950" 
        />

        {/* Creator LIVE KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{creatorLiveKPIs.totalSessionsLifetime}</div>
            <div className="text-xs text-slate-500 mt-1">Phiên LIVE toàn thời gian</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-slate-950 dark:text-white">{creatorLiveKPIs.gmv180d}</div>
            <div className="text-xs text-slate-500 mt-1">GMV LIVE 180 ngày (49.8k SP)</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#C8EEF7] shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{creatorLiveKPIs.avgDuration}</div>
            <div className="text-xs text-slate-500 mt-1">Thời lượng trung bình / phiên</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-[#0D7287] dark:text-[#FFD14C]">{creatorLiveKPIs.peakViewersAccumulated}</div>
            <div className="text-xs text-slate-500 mt-1">Đỉnh điểm người xem tích lũy</div>
          </div>
        </div>

        {/* Creator Top Live Sessions */}
        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
            {isEn ? 'Top Revenue-Generating LIVE Sessions Hosted by Kamielyn' : 'Chi Tiết Các Phiên Mega LIVE Khủng Nhất Của Kamielyn'}
          </h3>
          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#FFD14C] bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFE485]/30 text-slate-800 font-bold uppercase border-b border-[#FFE485]/60 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Tiêu Đề Phiên LIVE</th>
                  <th className="p-3.5">Thời Gian Bắt Đầu</th>
                  <th className="p-3.5">Thời Lượng</th>
                  <th className="p-3.5">Người Xem</th>
                  <th className="p-3.5">Đã Bán</th>
                  <th className="p-3.5">GMV Phiên</th>
                  <th className="p-3.5">Chỉ Số UV Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeStreams.map((l, i) => (
                  <tr key={i} className="hover:bg-[#FFE485]/10 transition-colors dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-sm truncate">{l.title}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono">{l.startTime}</td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200 font-mono">{l.duration}</td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{l.viewers.toLocaleString()}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{l.units.toLocaleString()} SP</td>
                    <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{l.gmv} Triệu đ</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#C8EEF7] text-[#0D7287] font-bold font-mono text-xs border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                        {l.uv.toLocaleString()} đ/view
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {activeStreams.map((l, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {l.startTime} · {l.duration}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] font-bold font-mono text-xs border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                    {l.uv.toLocaleString()} đ/view
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white line-clamp-2">
                  {l.title}
                </h4>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-center">
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-xs text-slate-400">{isEn ? 'Viewers' : 'Lượt xem'}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{l.viewers.toLocaleString()}</div>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-xs text-slate-400">{isEn ? 'Sold' : 'Đã bán'}</div>
                    <div className="font-black text-slate-950 dark:text-white">{l.units.toLocaleString()} SP</div>
                  </div>
                  <div className="p-1.5 rounded-xl bg-[#FFE485]/40 dark:bg-slate-800/60">
                    <div className="text-xs text-slate-400">{isEn ? 'GMV' : 'Doanh thu'}</div>
                    <div className="font-black text-[#0D7287] dark:text-[#FFD14C]">{l.gmv} Tr đ</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2.5.B LIVE Traffic Funnel Bottlenecks & Conversion Diagnostics */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-sky-50/40 border-2 border-[#9BE7FA]/80 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/20 dark:border-sky-800/60 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-200/60 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-900 dark:text-sky-300 text-xs font-black uppercase tracking-wider border border-sky-500/20">
                <Radio className="w-3.5 h-3.5 text-[#0D7287] dark:text-sky-400" />
                <span>{isEn ? 'LIVE FUNNEL DIAGNOSTICS & ENTRY BOTTLENECKS' : 'CHẨN ĐOÁN PHỄU LIVE & NÚT THẮT TỶ LỆ VÀO PHÒNG'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                {isEn 
                  ? 'The 5.09% Feed Preview Bottleneck vs. 25.68% Search Efficiency' 
                  : 'Nút Thắt Ô Xem Trước 5,09% Vào Phòng vs. Đòn Bẩy Tìm Kiếm 25,68%'}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-sky-300 dark:border-slate-700 text-[#0D7287] dark:text-sky-300 shrink-0 self-start sm:self-auto">
              Low-Season Funnel: CTOR 1,44% · CTR 5,49%
            </span>
          </div>

          {/* 2-Column Comparative Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Traffic Source Entry Rates */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                {isEn ? '1. Traffic Source Entry Rate Paradox' : '1. Nơi Khán Giả Tìm Thấy Bạn (Hiển Thị vs. Vào Phòng)'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Bóc tách dữ liệu viễn trắc TikTok Live Workbench chỉ ra nghịch lý lớn ở phễu tiếp cận:
              </p>
              <div className="space-y-2 pt-1 text-xs">
                {/* Feed preview */}
                <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                  <div>
                    <span className="font-black text-rose-950 dark:text-rose-200">Bảng tin - Ô Live (Feed Preview):</span>
                    <span className="text-[11px] text-slate-500 block">46% Tổng lượt hiển thị (PV khổng lồ)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-rose-600 dark:text-rose-400 text-sm">5,09% vào phòng</span>
                    <span className="text-xs text-slate-500 block">95% người xem lướt qua</span>
                  </div>
                </div>

                {/* Search */}
                <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                  <div>
                    <span className="font-black text-emerald-950 dark:text-emerald-200">Tìm kiếm (Search Intent):</span>
                    <span className="text-[11px] text-slate-500 block">43% Tổng lượt hiển thị</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-700 dark:text-emerald-300 text-sm">25,68% vào phòng</span>
                    <span className="text-xs text-slate-500 block">Gấp 5x so với Feed Preview</span>
                  </div>
                </div>

                {/* Live Merge */}
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-400">Hợp nhất Live (Live Merge): 2% PV</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400">41,41% vào phòng (Cao nhất sàn)</span>
                </div>
              </div>
            </div>

            {/* Right: Conversion Leakage */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-500" />
                {isEn ? '2. In-Room Checkout Conversion Funnel' : '2. Nghẽn Phễu Chuyển Đổi Trong Phòng LIVE'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Chẩn đoán 28 ngày giai đoạn thấp điểm (843 đơn SKU / 93,5 Tr đ GMV trên 47 đơn/phiên):
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 flex items-center justify-between">
                  <div>
                    <span className="font-black text-slate-900 dark:text-white">Tỷ lệ Nhấp Sản Phẩm (CTR):</span>
                    <span className="text-[11px] text-slate-500 block">Khách xem bấm mở giỏ hàng</span>
                  </div>
                  <span className="font-black text-[#0D7287] dark:text-[#9BE7FA] text-sm">5,49%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                  <div>
                    <span className="font-black text-amber-950 dark:text-amber-200">Tỷ lệ Chốt Đơn Từ Lượt Nhấp (CTOR):</span>
                    <span className="text-[11px] text-slate-500 block">Nút thắt nghiêm trọng nhất của phòng live</span>
                  </div>
                  <span className="font-black text-rose-600 dark:text-rose-400 text-sm">1,44%</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic pt-1">
                → Doanh số từ công cụ Flash Sale LIVE hiện mới chỉ chiếm <strong>19,65%</strong> doanh thu marketing, cho thấy phòng live thiếu voucher chốt hạ khẩn cấp (Urgency / Countdown).
              </p>
            </div>
          </div>

          {/* Actionable Strategy Takeaway */}
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5 leading-relaxed">
            <Sparkles className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#0D7287] dark:text-[#9BE7FA]">Kế hoạch hành động phễu LIVE: </strong>
              (1) <em>Cải tổ 3 giây đầu ô Live</em>: Tối ưu cover title và góc quay cận chất vải đồ bơi ngay trên màn hình preview để kéo tỷ lệ vào phòng từ 5,09% lên 8–10%. (2) <em>Khai thác từ khóa SEO</em>: Tối ưu tiêu đề phòng theo từ khóa có ý định mua cao (&quot;Bikini đi biển&quot;, &quot;Chân váy ngắn&quot;). (3) <em>Đồng bộ Ghim Đinh & Flash Sale 15 phút</em>: Host nói mã nào ghim ngay mã đó kèm đồng hồ đếm ngược để nâng CTOR từ 1,44% lên ngưỡng chuẩn 3–4%.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

