'use client';

import React from 'react';
import { Download, Tag, Video, AlertTriangle, Zap } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Label, Tooltip, ResponsiveContainer, Legend,
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
        badge="1.1.1" 
        title={isEn ? "Sales Trajectory & Transaction Structure" : "Phân Tích Bán Hàng & Cơ Cấu Giao Dịch"} 
        id="shop-sales" 
        onCopy={copyDeepLink} 
      />

      {/* 180-Day Trajectory Chart */}
      <div id="shop-sales-trend" className="p-6 sm:p-8 rounded-3xl bg-white border border-[#9BE7FA]/60 space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-slate-100 pb-3 dark:border-slate-800">
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
            <AreaChart data={trendData} margin={{ top: 22, right: 10, left: -10, bottom: 0 }}>
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
              <YAxis yAxisId="left" stroke="#0D7287" fontSize={11} tickLine={false} width={34}>
                <Label value={isEn ? '(pcs)' : '(sp)'} position="top" offset={10} fill="#0D7287" fontSize={11} />
              </YAxis>
              <YAxis yAxisId="right" orientation="right" stroke="#FFD14C" fontSize={11} tickLine={false} width={38}>
                <Label value={isEn ? '(M)' : '(Tr)'} position="top" offset={10} fill="#B45309" fontSize={11} />
              </YAxis>
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
        <div id="shop-channels-pie" className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex justify-between items-center border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Transaction Channels' : 'Phân Bổ Kênh Giao Dịch'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kênh chính vs Mạng lưới Affiliate</p>
            </div>
            <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800">
              <button onClick={() => setChannelMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${channelMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số lượng</button>
              <button onClick={() => setChannelMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${channelMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
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
        <div id="shop-content-pie" className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex justify-between items-center border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Content Format Distribution' : 'Cơ Cấu Định Dạng Nội Dung'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">LIVE vs Video vs Thẻ sản phẩm</p>
            </div>
            <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800">
              <button onClick={() => setContentMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${contentMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số lượng</button>
              <button onClick={() => setContentMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${contentMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
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
                    <Cell key={`cell-ct-${index}`} fill={PALETTE[index % PALETTE.length]} />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Marketing Promotions & Discount Efficiency */}
        <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 bg-white dark:bg-slate-900 flex flex-col justify-between h-full">
          <div className="flex flex-wrap items-center justify-between gap-2 border-slate-100 dark:border-slate-800 pb-3 min-h-[52px]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#C8EEF7]/40 text-[#074553] dark:text-[#9BE7FA]">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-950 dark:text-white">
                  {isEn ? 'Marketing & Promotion Tools Efficiency' : 'Hiệu Quả Công Cụ Khuyến Mãi (Promotions Engine)'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">TikTok Shop Seller Center 28 Ngày • Đối soát chiết khấu thực tế</p>
              </div>
            </div>
            <span className="text-xs tabular-nums font-bold px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
              {isEn ? 'Discount Burn: 50.45%' : 'Tỷ lệ đốt giảm giá: 50,45%'}
            </span>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between h-full">
              <div className="text-xs text-slate-400 font-bold min-h-[32px] flex items-center justify-center leading-tight">{isEn ? 'Promo GMV' : 'GMV Khuyến Mãi'}</div>
              <div className="text-base font-black text-slate-900 dark:text-white my-1">{sellerCenterShopData.marketingPromotions.promoGmvValue}</div>
              <div className="text-[10px] text-[#074553] dark:text-[#9BE7FA] font-bold min-h-[28px] flex items-center justify-center leading-tight">{sellerCenterShopData.marketingPromotions.promoGmvContributionPct}% tổng GMV</div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 flex flex-col justify-between h-full">
              <div className="text-xs text-rose-700 dark:text-rose-400 font-bold min-h-[32px] flex items-center justify-center leading-tight">{isEn ? 'Discount Cost' : 'Chi Phí Giảm Giá'}</div>
              <div className="text-base font-black text-rose-600 dark:text-rose-400 my-1">{sellerCenterShopData.marketingPromotions.discountCostValue}</div>
              <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold min-h-[28px] flex items-center justify-center leading-tight">50,45% doanh số KM</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/10 border border-[#9BE7FA]/60 dark:border-[#9BE7FA]/30 flex flex-col justify-between h-full">
              <div className="text-xs text-[#074553] dark:text-[#9BE7FA] font-bold min-h-[32px] flex items-center justify-center leading-tight">{isEn ? 'Promo AOV' : 'AOV Khuyến Mãi'}</div>
              <div className="text-base font-black text-[#0D7287] dark:text-[#9BE7FA] my-1">{sellerCenterShopData.marketingPromotions.promoAov.toLocaleString()} đ</div>
              <div className="text-[10px] text-[#074553] dark:text-[#9BE7FA] font-bold min-h-[28px] flex items-center justify-center leading-tight">+{sellerCenterShopData.marketingPromotions.aovUpliftPct}% vs AOV gốc</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between h-full">
              <div className="text-xs text-slate-400 font-bold min-h-[32px] flex items-center justify-center leading-tight">{isEn ? 'Discount / Order' : 'Chi Phí / Đơn KM'}</div>
              <div className="text-base font-black text-rose-600 dark:text-rose-400 my-1">~76.100 đ</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium min-h-[28px] flex items-center justify-center leading-tight">Bào mòn biên lợi nhuận</div>
            </div>
          </div>

          {/* Breakdown 3 Promotion Tools */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
              <span>{isEn ? 'Promotion Tool Allocation & Efficiency' : 'Phân Bổ & Hiệu Quả Từng Công Cụ Giảm Giá'}</span>
              <span className="text-[11px] tabular-nums text-slate-500 dark:text-slate-400">Ngân sách: 62,2 Tr đ</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-[#FFD14C] shrink-0" />
                    <span>{isEn ? '1. Fixed Product Discount (28 Days)' : '1. Giảm Giá Cố Định Sản Phẩm (28 Ngày)'}</span>
                  </div>
                  <span className="tabular-nums font-bold text-slate-900 dark:text-[#FFD14C]">96,35% ngân sách (~59,9 Tr đ)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Applied continuously for 28 days (e.g., 141M VND seasonal clearance). Passive markdown with zero buyer urgency, leading to severe profit margin erosion.'
                    : 'Cài đặt giảm giá kéo dài suốt 28 ngày (tiêu biểu: chiến dịch xả kho 141 Tr đ). Giảm giá bị động, khách tự tìm đến vẫn nhận chiết khấu, gây lãng phí biên độ giá cao nhất.'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-[#9BE7FA] shrink-0" />
                    <span>{isEn ? '2. LIVE Session Flash Sale' : '2. Flash Sale Phiên LIVE'}</span>
                  </div>
                  <span className="tabular-nums font-bold text-[#0D7287] dark:text-[#9BE7FA]">19,65% GMV KM (24,2 Tr đ)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? '15-30m countdown deals pinned by hosts. Strong urgency and high conversion, but only consumes 3.45% of discount budget.'
                    : 'Ghim deal 15–30 phút kèm đồng hồ đếm ngược khi host chốt đơn. Tạo FOMO mạnh và tỷ lệ chuyển đổi cao nhất, nhưng ngân sách chiết khấu mới chiếm 3,45%.'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-[#C8EEF7] border border-[#0D7287] shrink-0" />
                    <span>{isEn ? '3. Shopping Tab Flash & Add-on Deals' : '3. Flash Sale Kệ Hàng & Deal Mua Kèm'}</span>
                  </div>
                  <span className="tabular-nums font-bold text-[#074553] dark:text-[#9BE7FA]">0,20% GMV KM (246k đ)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Barely utilized despite 1.17M product card viewers. Highest untapped potential for AOV bundles (Bikini + Mesh Top).'
                    : 'Gần như chưa khai thác dù thẻ sản phẩm đón 1,17 triệu lượt xem. Đây là dư địa lớn nhất để bán kèm nâng AOV mà không phá giá niêm yết.'}
                </p>
              </div>
            </div>
          </div>

          {/* Budget Share Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
              <span>Cơ cấu phân bổ ngân sách giảm giá:</span>
              <span>Cố định (96,35%) • LIVE (3,45%) • Kệ (0,20%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
              <div className="bg-[#FFD14C] h-full" style={{ width: '96.35%' }} title="Giảm giá cố định: 96,35%" />
              <div className="bg-[#9BE7FA] h-full" style={{ width: '3.45%' }} title="Flash Sale LIVE: 3,45%" />
              <div className="bg-[#0D7287] h-full" style={{ width: '0.20%' }} title="Flash Sale Kệ hàng: 0,20%" />
            </div>
          </div>

          {/* Actionable Strategy Box */}
          <div className="p-3.5 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-900/80 border border-[#9BE7FA]/60 dark:border-slate-700 text-xs space-y-2 mt-auto">
            <div className="flex items-center gap-1.5 font-bold text-[#074553] dark:text-[#9BE7FA] text-xs">
              <AlertTriangle className="w-4 h-4 text-[#FFD14C] shrink-0" />
              <span>{isEn ? 'Action Plan: Restructure Discount Margin from 50.45% to 32%' : 'Lộ Trình Tái Cấu Trúc: Hạ Tỷ Lệ Chiết Khấu Từ 50,45% Về 30%–35%'}</span>
            </div>
            <ul className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
              <li>
                <strong>Cắt giảm Giảm giá cố định:</strong> Thu hẹp từ 96,35% xuống dưới 30%, thay bằng Flash Sale ngắn 2 tiếng vào khung 20h–22h.
              </li>
              <li>
                <strong>Tăng tỷ trọng Flash Sale LIVE lên 40%:</strong> Ghim đồng hồ đếm ngược 15 phút theo mã sản phẩm đang được thử form.
              </li>
              <li>
                <strong>Kích hoạt Deal Mua Kèm (Add-on Deal):</strong> Mua Bikini giảm 50% Phụ kiện/Áo lưới để giữ AOV mức 150.991 đ mà giảm áp lực giảm giá trực diện.
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Shoppable Video Ads Leverage Breakdown */}
        <div className="p-6 sm:p-7 rounded-3xl border border-[#9BE7FA]/60 dark:border-slate-800 shadow-xs space-y-4 bg-white dark:bg-slate-900 flex flex-col justify-between h-full">
          <div className="flex flex-wrap items-center justify-between gap-2 border-slate-100 dark:border-slate-800 pb-3 min-h-[52px]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-950 dark:text-white">
                  {isEn ? 'Shoppable Video Ads Leverage Audit' : 'Đối Soát Đòn Bẩy Ads Trên 4.417 Shoppable Videos'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Đối soát 4.417 dòng CSV Shoppable Videos • Chu kỳ 180 ngày</p>
              </div>
            </div>
            <span className="text-xs tabular-nums font-bold px-2.5 py-1 rounded-md bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] border border-[#9BE7FA]/60">
              Paid Ads: 94,70% GMV
            </span>
          </div>

          {/* Scale Summary Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between h-full">
              <div className="text-[10px] text-slate-400 font-bold uppercase min-h-[32px] flex items-center justify-center leading-tight">Tổng Video Gắn Giỏ</div>
              <div className="text-base font-black text-slate-900 dark:text-white tabular-nums my-1">4.417 clip</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 min-h-[28px] flex items-center justify-center leading-tight">Toàn bộ kho dữ liệu</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between h-full">
              <div className="text-[10px] text-slate-400 font-bold uppercase min-h-[32px] flex items-center justify-center leading-tight">Tổng Sản Phẩm Bán</div>
              <div className="text-base font-black text-slate-900 dark:text-white tabular-nums my-1">13.083 SP</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 min-h-[28px] flex items-center justify-center leading-tight">Quy mô tiêu thụ 90d</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#C8EEF7]/30 dark:bg-[#9BE7FA]/10 border border-[#9BE7FA]/60 dark:border-[#9BE7FA]/30 flex flex-col justify-between h-full">
              <div className="text-[10px] text-[#074553] dark:text-[#9BE7FA] font-bold uppercase min-h-[32px] flex items-center justify-center leading-tight">Tổng Doanh Thu Video</div>
              <div className="text-base font-black text-[#0D7287] dark:text-[#9BE7FA] tabular-nums my-1">2,17 Tỉ đ</div>
              <div className="text-[10px] text-[#074553] dark:text-[#9BE7FA] font-bold min-h-[28px] flex items-center justify-center leading-tight">2.170.840.326 đ</div>
            </div>
          </div>

          {/* Deep-Dive Comparative Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/95 text-slate-600 dark:text-slate-300 tabular-nums text-[11px] uppercase">
                  <th className="p-2.5">Chỉ tiêu đối soát</th>
                  <th className="p-2.5 text-[#074553] dark:text-[#9BE7FA]">Quảng Cáo (Ads = YES)</th>
                  <th className="p-2.5 text-slate-600 dark:text-slate-400">Tự Nhiên (Ads = NO)</th>
                  <th className="p-2.5 text-right">Đòn bẩy</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-200 tabular-nums text-[11px] [&>tr:nth-child(even)]:bg-slate-50 dark:[&>tr:nth-child(even)]:bg-slate-800/40">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                  <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-slate-100">Số lượng video</td>
                  <td className="p-2.5 font-bold text-[#074553] dark:text-[#9BE7FA]">3.482 video (78,83%)</td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400">935 video (21,17%)</td>
                  <td className="p-2.5 text-right font-bold text-slate-900 dark:text-white">3,7x</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                  <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-slate-100">Sản phẩm tiêu thụ</td>
                  <td className="p-2.5 font-bold text-[#074553] dark:text-[#9BE7FA]">12.398 SP (94,76%)</td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400">685 SP (5,24%)</td>
                  <td className="p-2.5 text-right font-bold text-[#074553] dark:text-[#9BE7FA]">18,1x</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                  <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-slate-100">Doanh thu GMV</td>
                  <td className="p-2.5 font-bold text-[#0D7287] dark:text-[#9BE7FA]">2,05 Tỉ đ (94,70%)</td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400">115 Tr đ (5,30%)</td>
                  <td className="p-2.5 text-right font-bold text-[#074553] dark:text-[#9BE7FA]">17,9x</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                  <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-slate-100">GMV TB / video</td>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">590.395 đ / clip</td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400">123.082 đ / clip</td>
                  <td className="p-2.5 text-right font-bold text-[#0D7287] dark:text-[#9BE7FA]">4,8x</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                  <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-slate-100">Sản lượng TB / video</td>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">3,56 SP / clip</td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400">0,73 SP / clip</td>
                  <td className="p-2.5 text-right font-bold text-[#0D7287] dark:text-[#9BE7FA]">4,9x</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                  <td className="p-2.5 font-sans font-medium text-slate-900 dark:text-slate-100">Đơn giá TB / sản phẩm</td>
                  <td className="p-2.5 text-slate-700 dark:text-slate-300">165.813 đ</td>
                  <td className="p-2.5 text-slate-700 dark:text-slate-300">168.002 đ</td>
                  <td className="p-2.5 text-right text-slate-400 dark:text-slate-500">Sweet Spot</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Video GMV Share Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
              <span>Tỷ trọng doanh thu GMV:</span>
              <span>Paid Ads: 94,70% • Organic: 5,30%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
              <div className="bg-[#0D7287] dark:bg-[#9BE7FA] h-full" style={{ width: '94.7%' }} title="Paid Ads: 94,70%" />
              <div className="bg-slate-400 dark:bg-slate-600 h-full" style={{ width: '5.3%' }} title="Organic: 5,30%" />
            </div>
          </div>

          {/* Root-cause Diagnostic & Actionable Recommendations */}
          <div className="p-3.5 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-900/80 border border-[#9BE7FA]/50 dark:border-slate-800 text-xs space-y-2 mt-auto">
            <div className="flex items-center gap-1.5 font-bold text-[#074553] dark:text-[#9BE7FA] text-xs">
              <Zap className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0" />
              <span>{isEn ? 'Diagnostic & Organic Recovery Plan' : 'Chẩn Đoán Nghịch Lý GPM & Lộ Trình Phục Hồi Kênh Organic'}</span>
            </div>
            <ul className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
              <li>
                <strong>Bản chất GPM 135,2k đ / 1k views:</strong> GPM video cao gấp 4,5x LIVE không phải do video tự viral, mà do Paid Ads dồn ngân sách vào các clip chuyển đổi tốt nhất.
              </li>
              <li>
                <strong>Khắc phục 308 video chưa gắn giỏ hàng:</strong> Kênh chính chủ đang bỏ phí 308 video không có link sản phẩm, làm mất toàn bộ dòng GMV tự nhiên từ đề xuất TikTok.
              </li>
              <li>
                <strong>Chuyển dịch khung giờ đăng:</strong> 62% clip organic đăng vào buổi sáng (08:00–12:00) ít người mua sắm; cần dời lịch sang khung giờ vàng 12:00–13:00 và 20:00–22:00.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
