'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Clock, Activity } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { shopOverviewKPIs, sellerCenterShopData } from '@/app/data/kamiElyData';

interface ShopOverviewSectionProps {
  isEn: boolean;
  copyDeepLink: (_id: string) => void;
  renderDataScopeMatrix: (_scope: 'shop' | 'creator') => React.ReactNode;
  overviewKPIs?: typeof shopOverviewKPIs;
}

export default function ShopOverviewSection({
  isEn,
  copyDeepLink,
  renderDataScopeMatrix,
  overviewKPIs
}: ShopOverviewSectionProps) {
  const activeOverview = overviewKPIs || shopOverviewKPIs;
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
              <b className="text-slate-900 dark:text-slate-200">{activeOverview.inclusionDate}</b>
            </div>
            <div className="py-2 flex justify-between">
              <span>{isEn ? 'Product Price Range' : 'Dải giá niêm yết'}:</span>
              <b className="text-slate-900 dark:text-slate-200">{activeOverview.priceRange}</b>
            </div>
            <div className="py-2 flex justify-between">
              <span>{isEn ? 'National Ranking' : 'Xếp hạng toàn quốc'}:</span>
              <b className="text-[#0D7287] font-bold dark:text-[#9BE7FA]">{activeOverview.nationalRank}</b>
            </div>
            <div className="py-2 flex justify-between">
              <span>{isEn ? 'Category Rank' : 'Xếp hạng ngành hàng'}:</span>
              <b className="text-[#0D7287] font-bold dark:text-[#9BE7FA]">{activeOverview.categoryRank}</b>
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
              <div className="text-xl font-black text-[#0D7287] dark:text-[#FFD14C]">{activeOverview.rating}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? 'Shop Overall Rating' : 'Đánh giá chung'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F0FBFE] dark:bg-slate-800/60 border border-[#9BE7FA]/60 dark:border-slate-700/60">
              <div className="text-xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{activeOverview.positiveRate}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? 'Positive Rating' : 'Tỷ lệ tích cực'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F0FBFE] dark:bg-slate-800/60 border border-[#9BE7FA]/60 dark:border-slate-700/60">
              <div className="text-xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{activeOverview.responseRate24h}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? 'Responds <24h' : 'Phản hồi trong 24h'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFFDF5] dark:bg-slate-800/60 border border-[#FFE485]/60 dark:border-slate-700/60">
              <div className="text-xl font-black text-[#0D7287] dark:text-[#FFD14C]">{activeOverview.shipWithin48h}</div>
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
              <span className="font-extrabold text-slate-900 dark:text-white">{activeOverview.activeSkus} / {activeOverview.historicalSkus}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
              <span>{isEn ? 'Shoppable LIVE Sessions' : 'Phiên LIVE gắn giỏ hàng'}</span>
              <span className="font-extrabold text-[#0D7287] dark:text-[#9BE7FA]">{activeOverview.totalLiveStreams}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
              <span>{isEn ? 'Shoppable Short Videos' : 'Video ngắn gắn giỏ hàng'}</span>
              <span className="font-extrabold text-[#0D7287] dark:text-[#9BE7FA]">{activeOverview.totalVideos}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
              <span>{isEn ? 'Active Affiliate Creators' : 'Nhà sáng tạo Affiliate'}</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{activeOverview.totalAffiliates}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TikTok Shop Seller Center 28-Day Operational Growth & Real-Time Snapshot */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-sky-50/40 border-2 border-sky-300/80 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/20 dark:border-sky-800/60 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-200/60 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-900 dark:text-sky-300 text-xs font-black uppercase tracking-wider border border-sky-500/20">
              <Activity className="w-3.5 h-3.5 text-[#0D7287] dark:text-sky-400" />
              <span>{isEn ? '1ST-PARTY SELLER CENTER TELEMETRY' : 'DỮ LIỆU GỐC TIKTOK SHOP SELLER CENTER · CHẨN ĐOÁN 28 NGÀY'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
              {isEn 
                ? '28-Day Growth Diagnostic & Real-Time Intraday Operational Health' 
                : 'Chẩn Đoán Tăng Trưởng 28 Ngày & Ảnh Chụp Vận Hành Trong Ngày (Intraday Snapshot)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn ? sellerCenterShopData.overview28d.periodLabel.en : sellerCenterShopData.overview28d.periodLabel.vi} ({sellerCenterShopData.overview28d.period})
            </p>
          </div>
        </div>

        {/* 3 Growth Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sellerCenterShopData.overview28d.metrics.map((m) => (
            <div 
              key={m.id}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border ${
                m.status === 'warning' 
                  ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/20' 
                  : 'border-sky-200 dark:border-sky-900/60 bg-sky-50/20'
              } shadow-xs space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {isEn ? m.label.en : m.label.vi}
                </span>
                {m.growthPct !== undefined && (
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    +{m.growthPct}% MoM
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-slate-950 dark:text-white">
                {m.value}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn ? m.insight.en : m.insight.vi}
              </p>
            </div>
          ))}
        </div>

        {/* Real-time Intraday Operational Snapshot */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {isEn ? 'Intraday Operations Snapshot (Recorded at 13:12)' : 'Ảnh Chụp Vận Hành Trong Ngày (Ghi Nhận Lúc 13:12)'}
              </h4>
            </div>
            <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              {isEn ? 'Daily Conversion Rate:' : 'Tỷ lệ chuyển đổi ngày:'} <b className="text-emerald-600 dark:text-emerald-400 font-black">{sellerCenterShopData.overview28d.intradaySnapshot.conversionRatePct}%</b> (Top Benchmark: {sellerCenterShopData.overview28d.intradaySnapshot.benchmarkCrPct})
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase">{isEn ? 'GMV Today (13:12)' : 'GMV Hôm Nay (13:12)'}</div>
              <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA] mt-0.5">{sellerCenterShopData.overview28d.intradaySnapshot.gmvToday}</div>
              <div className="text-xs text-slate-500">135 đơn hàng</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase">{isEn ? 'Visitors Today' : 'Lượt Ghé Thăm'}</div>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{sellerCenterShopData.overview28d.intradaySnapshot.visitorsToday.toLocaleString()}</div>
              <div className="text-xs text-slate-500">122 người mua</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase">{isEn ? 'AOV Today' : 'AOV Trong Ngày'}</div>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{sellerCenterShopData.overview28d.intradaySnapshot.aovToday.toLocaleString()} đ</div>
              <div className="text-xs text-slate-500">Giá trị đơn hàng</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase">{isEn ? 'AOV 28d Average' : 'AOV Bình Quân 28N'}</div>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{sellerCenterShopData.overview28d.intradaySnapshot.aov28dAvg.toLocaleString()} đ</div>
              <div className="text-xs text-emerald-600 font-bold">Chênh lệch +0,5%</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 col-span-2 sm:col-span-1">
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase">{isEn ? 'Conversion Rate' : 'CR Chuyển Đổi'}</div>
              <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-0.5">{sellerCenterShopData.overview28d.intradaySnapshot.conversionRatePct}%</div>
              <div className="text-xs text-slate-500">{isEn ? 'Benchmark: 2–3%' : 'Chuẩn ngành: 2–3%'}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border border-slate-200/60 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200">{isEn ? 'Diagnostic Note: ' : 'Ghi chú vận hành: '}</span>
            {isEn ? sellerCenterShopData.overview28d.intradaySnapshot.diagnosis.en : sellerCenterShopData.overview28d.intradaySnapshot.diagnosis.vi}
          </div>
        </div>
      </div>
    </section>
  );
}
