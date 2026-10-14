'use client';

import React from 'react';
import { Download, Tag, Video, AlertTriangle } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import SectionHeader from '@/components/ui/SectionHeader';
import { shopWeeklyTrendData, PALETTE, sellerCenterShopData } from '@/app/data/kamiElyData';

interface ShopSalesSectionProps {
  isEn: boolean;
  copyDeepLink: (_id: string) => void;
  handleExportChart: (_id: string, _name: string) => void;
  channelData: Record<string, any[]>;
  contentData: Record<string, any[]>;
  channelMetric: 'units' | 'gmv';
  setChannelMetric: (_m: 'units' | 'gmv') => void;
  contentMetric: 'units' | 'gmv';
  setContentMetric: (_m: 'units' | 'gmv') => void;
  weeklyTrendData?: any[];
}

export default function ShopSalesSection({
  isEn,
  copyDeepLink,
  handleExportChart,
  channelData,
  contentData,
  channelMetric,
  setChannelMetric,
  contentMetric,
  setContentMetric,
  weeklyTrendData
}: ShopSalesSectionProps) {
  const trendData = weeklyTrendData && weeklyTrendData.length > 0 ? weeklyTrendData : shopWeeklyTrendData;

  return (
    <section id="shop-sales" className="space-y-6 scroll-mt-36">
      <SectionHeader 
        badge="1.2" 
        title={isEn ? "Sales Trajectory & Transaction Structure" : "Phân Tích Bán Hàng & Cơ Cấu Giao Dịch"} 
        id="shop-sales" 
        onCopy={copyDeepLink} 
      />

      {/* 180-Day Trajectory Chart */}
      <div id="shop-sales-trend" className="p-6 sm:p-8 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h3 className="text-base font-black text-slate-950 dark:text-white">
              {isEn ? '180-Day Trajectory (26 Weeks): Units Sold & GMV in Million VND' : 'Chuỗi Doanh Số 180 Ngày (26 Tuần): Sản Lượng & Doanh Thu GMV (Triệu đ)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn ? 'Weekly aggregation showing June summer peak propelled by continuous LIVE sessions' : 'Dữ liệu tổng hợp theo tuần ghi nhận đỉnh điểm mùa du lịch tháng 6 với hơn 1.950 SP/ngày'}
            </p>
          </div>
          <button
            onClick={() => handleExportChart('shop-sales-trend', 'kami-ely-sales-trend-180d')}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#C8EEF7]/50 hover:bg-[#C8EEF7] text-[#0D7287] border border-[#9BE7FA] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-[#9BE7FA] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất PNG</span>
          </button>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUnitsBrand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9BE7FA" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#9BE7FA" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorGmvBrand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFE485" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#FFD14C" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#0D7287" fontSize={11} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#b45309" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #9BE7FA', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Area yAxisId="left" type="monotone" dataKey="units" name={isEn ? 'Units Sold' : 'Sản phẩm bán ra'} stroke="#0D7287" strokeWidth={3} fillOpacity={1} fill="url(#colorUnitsBrand)" />
              <Area yAxisId="right" type="monotone" dataKey="gmv" name={isEn ? 'GMV (Million VND)' : 'GMV (Triệu đ)'} stroke="#FFD14C" strokeWidth={3} fillOpacity={1} fill="url(#colorGmvBrand)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Channels & Content Formats Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Channels */}
        <div id="shop-channels-pie" className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Transaction Channels' : 'Phân Bổ Kênh Giao Dịch'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kênh chính vs Mạng lưới Affiliate</p>
            </div>
            <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800">
              <button onClick={() => setChannelMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${channelMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số lượng</button>
              <button onClick={() => setChannelMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${channelMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={channelData[channelMetric]}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="78%"
                  paddingAngle={3}
                  dataKey="value"
                >
                  {channelData[channelMetric].map((_, index) => (
                    <Cell key={`cell-ch-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, channelMetric === 'gmv' ? 'Tỷ trọng GMV' : 'Tỷ trọng số lượng']} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Distribution */}
        <div id="shop-content-pie" className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Content Format Distribution' : 'Cơ Cấu Định Dạng Nội Dung'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">LIVE vs Video vs Thẻ sản phẩm</p>
            </div>
            <div className="flex bg-[#FFE485]/30 rounded-xl p-1 dark:bg-slate-800">
              <button onClick={() => setContentMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${contentMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số lượng</button>
              <button onClick={() => setContentMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${contentMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={contentData[contentMetric]}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="78%"
                  paddingAngle={3}
                  dataKey="value"
                >
                  {contentData[contentMetric].map((_, index) => (
                    <Cell key={`cell-ct-${index}`} fill={PALETTE[(index + 2) % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, contentMetric === 'gmv' ? 'Tỷ trọng GMV' : 'Tỷ trọng số lượng']} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Advanced Telemetry: Marketing Promotions & Shoppable Video Ads Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Marketing Promotions & Discount Efficiency */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white to-amber-50/40 border border-amber-200/80 dark:from-slate-900 dark:to-amber-950/20 dark:border-amber-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-950 dark:text-white">
                  {isEn ? 'Marketing & Promotion Tools Efficiency' : 'Hiệu Quả Công Cụ Khuyến Mãi (Promotions)'}
                </h4>
                <p className="text-[11px] text-slate-500">TikTok Shop Seller Center 28 Ngày</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {isEn ? 'Discount Burn: 50.45%' : 'Tỷ lệ đốt giảm giá: 50,45%'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-[10px] text-slate-400 font-bold uppercase">{isEn ? 'Promo GMV' : 'GMV Khuyến Mãi'}</div>
              <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">{sellerCenterShopData.marketingPromotions.promoGmvValue}</div>
              <div className="text-[10px] text-emerald-600 font-bold">{sellerCenterShopData.marketingPromotions.promoGmvContributionPct}% tổng GMV</div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
              <div className="text-[10px] text-rose-500 font-bold uppercase">{isEn ? 'Discount Cost' : 'Chi Phí Giảm Giá'}</div>
              <div className="text-base font-black text-rose-600 dark:text-rose-400 mt-0.5">{sellerCenterShopData.marketingPromotions.discountCostValue}</div>
              <div className="text-[10px] text-rose-500 font-bold">50,45% doanh số KM</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-[10px] text-slate-400 font-bold uppercase">{isEn ? 'Promo AOV' : 'AOV Khuyến Mãi'}</div>
              <div className="text-base font-black text-[#0D7287] dark:text-[#9BE7FA] mt-0.5">{sellerCenterShopData.marketingPromotions.promoAov.toLocaleString()} đ</div>
              <div className="text-[10px] text-emerald-600 font-bold">+{sellerCenterShopData.marketingPromotions.aovUpliftPct}% vs AOV gốc</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Chẩn đoán cơ cấu voucher & giảm giá:</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {isEn ? sellerCenterShopData.marketingPromotions.insights.en : sellerCenterShopData.marketingPromotions.insights.vi}
            </p>
          </div>
        </div>

        {/* Right: Shoppable Video Ads Leverage Breakdown */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white to-sky-50/40 border border-sky-200/80 dark:from-slate-900 dark:to-sky-950/20 dark:border-sky-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-300">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-950 dark:text-white">
                  {isEn ? 'Shoppable Video Ads Leverage Audit' : 'Đối Soát Đòn Bẩy Ads Trên 4.417 Shoppable Videos'}
                </h4>
                <p className="text-[11px] text-slate-500">Đối soát toàn bộ 4.417 dòng CSV Shoppable Videos</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              Paid Ads: 94,70% GMV
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Paid Ads Box */}
            <div className="p-3.5 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 space-y-2">
              <div className="flex items-center justify-between font-bold text-sky-950 dark:text-sky-200">
                <span>Quảng Cáo (Ads = YES)</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-sky-200/60 dark:bg-sky-900 text-sky-800 dark:text-sky-200 font-mono">
                  {sellerCenterShopData.shoppableVideoAdsBreakdown.paidAds.videoSharePct}% video
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Số lượng video:</span>
                  <b className="text-slate-900 dark:text-slate-100">{sellerCenterShopData.shoppableVideoAdsBreakdown.paidAds.videoCount.toLocaleString()} video</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sản phẩm bán:</span>
                  <b className="text-slate-900 dark:text-slate-100">{sellerCenterShopData.shoppableVideoAdsBreakdown.paidAds.unitsSold.toLocaleString()} SP ({sellerCenterShopData.shoppableVideoAdsBreakdown.paidAds.unitsSharePct}%)</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Doanh thu GMV:</span>
                  <b className="text-[#0D7287] dark:text-[#9BE7FA]">2,05 Tỷ ₫ ({sellerCenterShopData.shoppableVideoAdsBreakdown.paidAds.gmvSharePct}%)</b>
                </div>
              </div>
            </div>

            {/* Organic Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>Tự Nhiên (Ads = NO)</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {sellerCenterShopData.shoppableVideoAdsBreakdown.organic.videoSharePct}% video
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Số lượng video:</span>
                  <b className="text-slate-900 dark:text-slate-100">{sellerCenterShopData.shoppableVideoAdsBreakdown.organic.videoCount.toLocaleString()} video</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sản phẩm bán:</span>
                  <b className="text-slate-900 dark:text-slate-100">{sellerCenterShopData.shoppableVideoAdsBreakdown.organic.unitsSold.toLocaleString()} SP ({sellerCenterShopData.shoppableVideoAdsBreakdown.organic.unitsSharePct}%)</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Doanh thu GMV:</span>
                  <b className="text-slate-700 dark:text-slate-300">115 Tr ₫ ({sellerCenterShopData.shoppableVideoAdsBreakdown.organic.gmvSharePct}%)</b>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-sky-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA]">Sự thật dữ liệu: </span>
            Chỉ số GPM <strong>135,2k đ / 1k views</strong> của video (gấp 4.5x LIVE) thực chất là kết quả của việc dồn ngân sách Paid Ads vào các clip bán chạy nhất, chứ không phải do video organic tự lan truyền tự nhiên.
          </div>
        </div>
      </div>
    </section>
  );
}
