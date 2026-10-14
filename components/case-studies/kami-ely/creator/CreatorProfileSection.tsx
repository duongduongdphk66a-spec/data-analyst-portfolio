'use client';

import React from 'react';
import { Store } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  creatorProfile,
  creatorCollaborativeStores
} from '@/app/data/kamiElyData';

interface CreatorProfileSectionProps {
  isEn: boolean;
  copyDeepLink: (_id: string) => void;
  renderDataScopeMatrix: (_scope: 'shop' | 'creator') => React.ReactNode;
  profile?: typeof creatorProfile;
  collaborativeStores?: typeof creatorCollaborativeStores;
}

export default function CreatorProfileSection({
  isEn,
  copyDeepLink,
  renderDataScopeMatrix,
  profile,
  collaborativeStores
}: CreatorProfileSectionProps) {
  const activeProfile = profile || creatorProfile;
  const activeStores = collaborativeStores || creatorCollaborativeStores;
  return (
    <section id="creator-overview" className="space-y-6 scroll-mt-36">
      <SectionHeader 
        badge="2.1" 
        title={isEn ? "Creator Overview & Commercial Index" : "Tổng Quan Người Bán & Chỉ Số Thương Mại"} 
        id="creator-overview" 
        onCopy={copyDeepLink} 
        badgeBg="bg-[#FFD14C] text-slate-950" 
      />

      {/* Data Scope & Time Horizons Matrix for Creator */}
      {renderDataScopeMatrix('creator')}

      {/* Creator Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#FFD14C] shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FFD14C] to-[#FFE485] flex items-center justify-center text-slate-950 text-2xl font-black shadow-md border border-[#FFD14C]">
            KL
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black text-slate-950 dark:text-white">{activeProfile.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8EEF7] text-[#0D7287] font-mono text-xs font-bold border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                @{activeProfile.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-xs font-bold border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C]">
                {activeProfile.category}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic">
              &quot;{activeProfile.bio}&quot;
            </p>
            <div className="text-xs text-slate-500 flex items-center gap-3 pt-1">
              <span>Video đầu tiên: <b>{activeProfile.firstVideoDate}</b></span>
              <span>•</span>
              <span>Mới nhất: <b>{activeProfile.latestCreationDate}</b></span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
          <div className="p-3 rounded-2xl bg-[#FFFDF5] border border-[#FFE485] text-center dark:bg-slate-800 dark:border-slate-700">
            <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">#{activeProfile.nationalRank}</div>
            <div className="text-[10px] text-slate-500">Hạng Quốc Gia</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFFDF5] border border-[#FFD14C] text-center dark:bg-slate-800 dark:border-slate-700">
            <div className="text-lg font-black text-slate-950 dark:text-[#FFD14C]">{activeProfile.ecomPotentialIndex}</div>
            <div className="text-[10px] text-slate-500">Tiềm Năng E-Com</div>
          </div>
        </div>
      </div>

      {/* Commercial Capacity Split: Video vs LIVE */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{isEn ? 'Lifetime GMV Generated' : 'Tổng GMV Tích Lũy Kênh'}</div>
          <div className="text-3xl font-black text-slate-950 dark:text-white">{activeProfile.totalGmv}</div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400">
            {isEn ? '69.9k lifetime units sold (Since May 28, 2023 · Photo 080124)' : 'Từ 69.900 SP chốt đơn (Từ khi lập kênh 28/05/2023 · Ảnh 080124)'}
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">GMV Livestream</div>
          <div className="text-3xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{activeProfile.liveGmv}</div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400">43.900 SP chốt qua các phiên LIVE</div>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#FFE485] shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">GMV Shoppable Video</div>
          <div className="text-3xl font-black text-slate-950 dark:text-[#FFD14C]">{activeProfile.videoGmv}</div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400">26.000 SP chốt qua video ngắn</div>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#FFD14C] shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Hiệu Suất Video GPM</div>
          <div className="text-xl font-black text-[#0D7287] dark:text-[#FFD14C]">{activeProfile.videoGpm}</div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400">Gấp 4.5 lần Live GPM ({activeProfile.liveGpm})</div>
        </div>
      </div>

      {/* Collaborative Shops Table */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
          {isEn ? 'Top Collaborative Stores with Creator Kamielyn' : 'Các Cửa Hàng Hợp Tác Với Creator Kamielyn'}
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-[#FFE485] bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FFE485]/30 text-slate-800 font-bold uppercase border-b border-[#FFE485]/60 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Thứ Hạng</th>
                <th className="p-3.5">Tên Cửa Hàng</th>
                <th className="p-3.5">Ngành Hàng</th>
                <th className="p-3.5">SP Tiếp Thị</th>
                <th className="p-3.5">Sản Phẩm Nổi Bật</th>
                <th className="p-3.5">Creator Đã Bán</th>
                <th className="p-3.5">GMV Đóng Góp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {activeStores.map((store) => (
                <tr key={store.rank} className="hover:bg-[#FFE485]/10 transition-colors dark:hover:bg-slate-800/50">
                  <td className="p-3.5 font-bold font-mono text-[#0D7287] dark:text-[#9BE7FA]">#{store.rank}</td>
                  <td className="p-3.5 font-bold text-slate-950 dark:text-white">{store.name}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{store.category}</td>
                  <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">{store.affiliatedProducts} SP</td>
                  <td className="p-3.5 text-slate-800 dark:text-slate-200">{store.bestSeller}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{store.creatorUnitsSold.toLocaleString()} SP</td>
                  <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{store.gmvDisplay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
