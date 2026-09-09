'use client';

import React, { useState } from 'react';
import { Bookmark, Video, Radio } from 'lucide-react';
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
  copyDeepLink: (id: string, name?: string) => void;
}

export default function CreatorContentSection({
  isEn,
  copyDeepLink
}: CreatorContentSectionProps) {
  const [crVideoCatMetric, setCrVideoCatMetric] = useState<'units' | 'gmv'>('units');

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
                {creatorTopVideos.map((v, i) => (
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
            {creatorTopVideos.map((v, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {v.publishDate}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FFE485] text-slate-950 text-[10px] font-black border border-[#FFD14C]">
                    {v.interactionRate} tương tác
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white line-clamp-2">
                  {v.title}
                </h4>
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-center">
                  <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[9px] text-slate-400">{isEn ? 'Views' : 'Lượt xem'}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{v.views.toLocaleString()}</div>
                  </div>
                  <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[9px] text-slate-400">{isEn ? 'Likes' : 'Thích'}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{v.likes.toLocaleString()}</div>
                  </div>
                  <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[9px] text-slate-400">{isEn ? 'Sold' : 'Đã bán'}</div>
                    <div className="font-black text-slate-950 dark:text-white">{v.units.toLocaleString()} SP</div>
                  </div>
                  <div className="p-1 rounded-xl bg-[#FFE485]/40 dark:bg-slate-800/60">
                    <div className="text-[9px] text-slate-400">{isEn ? 'GMV' : 'Doanh thu'}</div>
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
                {creatorTopLiveStreams.map((l, i) => (
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
            {creatorTopLiveStreams.map((l, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {l.startTime} · {l.duration}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] font-bold font-mono text-[10px] border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                    {l.uv.toLocaleString()} đ/view
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white line-clamp-2">
                  {l.title}
                </h4>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-center">
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[10px] text-slate-400">{isEn ? 'Viewers' : 'Lượt xem'}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{l.viewers.toLocaleString()}</div>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[10px] text-slate-400">{isEn ? 'Sold' : 'Đã bán'}</div>
                    <div className="font-black text-slate-950 dark:text-white">{l.units.toLocaleString()} SP</div>
                  </div>
                  <div className="p-1.5 rounded-xl bg-[#FFE485]/40 dark:bg-slate-800/60">
                    <div className="text-[10px] text-slate-400">{isEn ? 'GMV' : 'Doanh thu'}</div>
                    <div className="font-black text-[#0D7287] dark:text-[#FFD14C]">{l.gmv} Tr đ</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
