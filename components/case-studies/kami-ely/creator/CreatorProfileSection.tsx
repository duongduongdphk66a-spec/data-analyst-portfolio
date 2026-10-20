'use client';

import React from 'react';
import { Store, Sparkles } from 'lucide-react';
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
        badge="1.4.3" 
        title={isEn ? "Creator Overview & Commercial Index" : "Tổng Quan Người Bán & Chỉ Số Thương Mại"} 
        id="creator-overview" 
        onCopy={copyDeepLink} 
      />

      {/* Data Scope & Time Horizons Matrix for Creator */}
      {renderDataScopeMatrix('creator')}

      {/* Creator Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#9BE7FA]/60 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black border border-[#9BE7FA] bg-[#0D7287]">
            KL
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black text-slate-950 dark:text-white">{activeProfile.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8EEF7] text-[#0D7287] tabular-nums text-xs font-bold border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                @{activeProfile.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8EEF7]/60 text-[#074553] text-xs font-bold border border-[#9BE7FA]/60 dark:bg-slate-800 dark:text-[#9BE7FA]">
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
          <div className="p-3 rounded-2xl bg-[#C8EEF7]/25 border border-[#9BE7FA]/60 text-center dark:bg-slate-800 dark:border-slate-700">
            <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">#{activeProfile.nationalRank}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Hạng Quốc Gia</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#C8EEF7]/25 border border-[#9BE7FA]/60 text-center dark:bg-slate-800 dark:border-slate-700">
            <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">{activeProfile.ecomPotentialIndex}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Tiềm Năng E-Com</div>
          </div>
        </div>
      </div>

      {/* Commercial Capacity Split: Video vs LIVE */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-bold">{isEn ? 'Lifetime GMV Generated' : 'Tổng GMV Tích Lũy Kênh'}</div>
          <div className="text-3xl font-black text-slate-950 dark:text-white">{activeProfile.totalGmv}</div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400">
            {isEn ? '69.9k lifetime units sold (Since May 28, 2023 · Photo 080124)' : 'Từ 69.900 SP chốt đơn (Từ khi lập kênh 28/05/2023 · Ảnh 080124)'}
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-bold">GMV Livestream</div>
          <div className="text-3xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{activeProfile.liveGmv}</div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400">43.900 SP chốt qua các phiên LIVE</div>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-bold">GMV Shoppable Video</div>
          <div className="text-3xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{activeProfile.videoGmv}</div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400">26.000 SP chốt qua video ngắn</div>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-bold">Hiệu Suất Video GPM</div>
          <div className="text-xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{activeProfile.videoGpm}</div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400">Gấp 4.5 lần Live GPM ({activeProfile.liveGpm})</div>
        </div>
      </div>

      {/* Collaborative Shops Table */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
          {isEn ? 'Top Collaborative Stores with Creator Kamielyn' : 'Các Cửa Hàng Hợp Tác Với Creator Kamielyn'}
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#C8EEF7]/40 text-[#074553] font-bold uppercase dark:bg-slate-800/80 dark:text-[#9BE7FA]">
              <tr>
                <th className="p-3.5">Thứ Hạng</th>
                <th className="p-3.5">Tên Cửa Hàng</th>
                <th className="p-3.5">Ngành Hàng</th>
                <th className="p-3.5">SP Tiếp Thị</th>
                <th className="p-3.5">Sản Phẩm Nổi Bật</th>
                <th className="p-3.5">Creator Đã Bán</th>
                <th className="p-3.5">GMV Đóng Góp</th>
                <th className="p-3.5">Tỷ Trọng GMV</th>
              </tr>
            </thead>
            <tbody className="[&>tr:nth-child(even)]:bg-slate-50 dark:[&>tr:nth-child(even)]:bg-slate-800/40">
              {activeStores.map((store) => (
                <tr key={store.rank} className="hover:bg-[#C8EEF7]/15 transition-colors dark:hover:bg-slate-800/50">
                  <td className="p-3.5 font-bold tabular-nums text-[#0D7287] dark:text-[#9BE7FA]">#{store.rank}</td>
                  <td className="p-3.5 font-bold text-slate-950 dark:text-white">{store.name}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{store.category}</td>
                  <td className="p-3.5 tabular-nums text-slate-700 dark:text-slate-300">{store.affiliatedProducts} SP</td>
                  <td className="p-3.5 text-slate-800 dark:text-slate-200">{store.bestSeller}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{store.creatorUnitsSold.toLocaleString()} SP</td>
                  <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#9BE7FA]">{store.gmvDisplay}</td>
                  <td className="p-3.5">
                    <span className="tabular-nums font-bold text-xs px-2 py-0.5 rounded-md bg-[#C8EEF7]/60 text-[#074553] border border-[#9BE7FA]/60 dark:bg-slate-800 dark:text-[#9BE7FA]">
                      {store.gmvShare}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Captive Store Architecture Takeaway */}
        <div className="p-4 rounded-2xl bg-[#C8EEF7]/25 border border-[#9BE7FA]/60 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5 leading-relaxed">
          <Sparkles className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#074553] dark:text-[#9BE7FA]">Phát hiện kiến trúc kênh liên kết: </strong>
            Creator <code>@kamielyhn</code> phân phối tới <strong>98,92% GMV (9,1 Tỷ ₫)</strong> cho duy nhất gian hàng Kami Ely (gánh 69.100 trên tổng số 69.900 đơn hàng toàn kênh). Ba shop còn lại (Havi Bikini 71,8 Tr đ, KamiBiii 6,2 Tr đ, KamiBiki 0 đ) chỉ là các sub-brand thử nghiệm với đóng góp danh nghĩa dưới 1%. Điều này khẳng định <code>@kamielyhn</code> là một kênh bán hàng nội bộ độc quyền (captive channel) chứ không phải creator affiliate chạy đa nhãn hàng.
          </p>
        </div>
      </div>
    </section>
  );
}
