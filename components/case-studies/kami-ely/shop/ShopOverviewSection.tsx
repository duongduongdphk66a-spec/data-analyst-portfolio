'use client';

import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { shopOverviewKPIs } from '@/app/data/kamiElyData';

interface ShopOverviewSectionProps {
  isEn: boolean;
  copyDeepLink: (id: string) => void;
  renderDataScopeMatrix: (scope: 'shop' | 'creator') => React.ReactNode;
}

export default function ShopOverviewSection({
  isEn,
  copyDeepLink,
  renderDataScopeMatrix
}: ShopOverviewSectionProps) {
  return (
    <section id="shop-overview" className="space-y-6 scroll-mt-36">
      <SectionHeader 
        badge="1.1" 
        title={isEn ? "Shop Overview & Operational Health" : "Tổng Quan Về Shop & Sức Khỏe Vận Hành"} 
        id="shop-overview" 
        onCopy={copyDeepLink} 
      />

      {/* Data Scope & Time Horizons Matrix for Store */}
      {renderDataScopeMatrix('shop')}

      {/* Shop Profile & Benchmark Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/80 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C8EEF7] flex items-center justify-center font-black text-[#0D7287] text-lg border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700">
              KE
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">Kami Ely</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">TikTok Shop Vietnam · Sports & Outdoor</p>
            </div>
          </div>
          <div className="divide-y divide-slate-100 text-xs text-slate-600 dark:divide-slate-800 dark:text-slate-400">
            <div className="py-2 flex justify-between">
              <span>{isEn ? 'Inclusion Time' : 'Thời gian gia nhập'}:</span>
              <b className="text-slate-900 dark:text-slate-200">{shopOverviewKPIs.inclusionDate}</b>
            </div>
            <div className="py-2 flex justify-between">
              <span>{isEn ? 'Product Price Range' : 'Dải giá niêm yết'}:</span>
              <b className="text-slate-900 dark:text-slate-200">{shopOverviewKPIs.priceRange}</b>
            </div>
            <div className="py-2 flex justify-between">
              <span>{isEn ? 'National Ranking' : 'Xếp hạng toàn quốc'}:</span>
              <b className="text-[#0D7287] font-bold dark:text-[#9BE7FA]">{shopOverviewKPIs.nationalRank}</b>
            </div>
            <div className="py-2 flex justify-between">
              <span>{isEn ? 'Category Rank' : 'Xếp hạng ngành hàng'}:</span>
              <b className="text-[#0D7287] font-bold dark:text-[#9BE7FA]">{shopOverviewKPIs.categoryRank}</b>
            </div>
          </div>
        </div>

        {/* Operations & Service Quality */}
        <div className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            {isEn ? 'Service & Operations Score' : 'Chất Lượng Dịch Vụ & Vận Hành'}
          </h3>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-[#FFFDF5] dark:bg-slate-800/60 border border-[#FFE485]/60 dark:border-slate-700/60">
              <div className="text-xl font-black text-[#0D7287] dark:text-[#FFD14C]">{shopOverviewKPIs.rating}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? 'Shop Overall Rating' : 'Đánh giá chung'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F0FBFE] dark:bg-slate-800/60 border border-[#9BE7FA]/60 dark:border-slate-700/60">
              <div className="text-xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{shopOverviewKPIs.positiveRate}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? 'Positive Rating' : 'Tỷ lệ tích cực'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F0FBFE] dark:bg-slate-800/60 border border-[#9BE7FA]/60 dark:border-slate-700/60">
              <div className="text-xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{shopOverviewKPIs.responseRate24h}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? 'Responds <24h' : 'Phản hồi trong 24h'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFFDF5] dark:bg-slate-800/60 border border-[#FFE485]/60 dark:border-slate-700/60">
              <div className="text-xl font-black text-[#0D7287] dark:text-[#FFD14C]">{shopOverviewKPIs.shipWithin48h}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? 'Ships <48h' : 'Giao hàng trong 48h'}</div>
            </div>
          </div>
        </div>

        {/* Content Assets Inventory */}
        <div className="p-6 rounded-3xl bg-white border border-[#C8EEF7] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FFD14C]" />
            {isEn ? 'Content & Commerce Inventory' : 'Tài Sản Nội Dung & Thương Mại'}
          </h3>
          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
              <span>{isEn ? 'Active Products on Sale' : 'Sản phẩm đang mở bán'}</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{shopOverviewKPIs.activeSkus} / {shopOverviewKPIs.historicalSkus}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
              <span>{isEn ? 'Shoppable LIVE Sessions' : 'Phiên LIVE gắn giỏ hàng'}</span>
              <span className="font-extrabold text-[#0D7287] dark:text-[#9BE7FA]">{shopOverviewKPIs.totalLiveStreams}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
              <span>{isEn ? 'Shoppable Short Videos' : 'Video ngắn gắn giỏ hàng'}</span>
              <span className="font-extrabold text-[#0D7287] dark:text-[#9BE7FA]">{shopOverviewKPIs.totalVideos}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
              <span>{isEn ? 'Active Affiliate Creators' : 'Nhà sáng tạo Affiliate'}</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{shopOverviewKPIs.totalAffiliates}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
