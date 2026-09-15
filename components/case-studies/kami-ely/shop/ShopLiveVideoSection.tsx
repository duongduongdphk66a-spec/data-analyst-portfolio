'use client';

import React from 'react';
import { Radio, Video, Eye, ChevronRight, ShieldCheck, Sparkles, UserCheck, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  shopLiveKPIs,
  topShopLiveSessions,
  shopVideoKPIs,
  topShoppableVideos,
  shopSelfOperatedAccount
} from '@/app/data/kamiElyData';

interface ShopLiveVideoSectionProps {
  isEn: boolean;
  copyDeepLink: (id: string) => void;
  openProofScreenshot: (id: string) => void;
  handleTabChange: (tab: 'science' | 'shop' | 'creator') => void;
}

export default function ShopLiveVideoSection({
  isEn,
  copyDeepLink,
  openProofScreenshot,
  handleTabChange
}: ShopLiveVideoSectionProps) {
  return (
    <>
      {/* 1.5 LIVESTREAM */}
      <section id="shop-live" className="space-y-6 scroll-mt-36">
        <SectionHeader 
          badge="1.5" 
          title={isEn ? "Shop Livestream Performance" : "Hiệu Quả Livestream Của Shop"} 
          id="shop-live" 
          onCopy={copyDeepLink} 
        />

        {/* LIVE KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{shopLiveKPIs.sessions}</div>
            <div className="text-xs text-slate-500 mt-1">{isEn ? 'Total LIVE Sessions' : 'Tổng phiên LIVE (180 ngày)'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-slate-950 dark:text-white">{shopLiveKPIs.totalGmv}</div>
            <div className="text-xs text-slate-500 mt-1">{isEn ? 'Total LIVE GMV' : 'Tổng doanh số LIVE'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-slate-950 dark:text-white">{shopLiveKPIs.avgViewers}</div>
            <div className="text-xs text-slate-500 mt-1">{isEn ? 'Avg Viewers/Session' : 'Người xem TB/phiên'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-[#0D7287] dark:text-[#FFD14C]">{shopLiveKPIs.avgGmvPerSession}</div>
            <div className="text-xs text-slate-500 mt-1">{isEn ? 'Avg GMV/Session' : 'Doanh thu TB/phiên'}</div>
          </div>
        </div>

        {/* Top Mega-Live Sessions Table */}
        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
            {isEn ? 'Top Mega-Live Sessions Propelling Summer Peaks' : 'Chi Tiết Các Phiên Mega-Live Bùng Nổ Doanh Thu'}
          </h3>
          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#9BE7FA]/60 bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#C8EEF7]/30 text-slate-800 font-bold uppercase border-b border-[#9BE7FA]/40 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Tiêu Đề Phiên LIVE</th>
                  <th className="p-3.5">Người Phát</th>
                  <th className="p-3.5">Thời Gian Bắt Đầu</th>
                  <th className="p-3.5">Thời Lượng</th>
                  <th className="p-3.5">Lượt Xem</th>
                  <th className="p-3.5">Đã Bán</th>
                  <th className="p-3.5">GMV Phiên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topShopLiveSessions.map((l, i) => (
                  <tr key={i} className="hover:bg-[#C8EEF7]/10 transition-colors dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-xs truncate">{l.title}</td>
                    <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#9BE7FA]">{l.creator}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{l.startTime}</td>
                    <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">{l.duration}</td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{l.viewers.toLocaleString()}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{l.units.toLocaleString()} SP</td>
                    <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{l.gmv} Triệu đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {topShopLiveSessions.map((l, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">{l.creator}</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{l.startTime} · {l.duration}</span>
                </div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white line-clamp-2">{l.title}</h4>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-center">
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[10px] text-slate-400">{isEn ? 'Viewers' : 'Lượt xem'}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{l.viewers.toLocaleString()}</div>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[10px] text-slate-400">{isEn ? 'Sold' : 'Đã bán'}</div>
                    <div className="font-black text-slate-950 dark:text-white">{l.units.toLocaleString()} SP</div>
                  </div>
                  <div className="p-1.5 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
                    <div className="text-[10px] text-slate-400">{isEn ? 'GMV' : 'Doanh thu'}</div>
                    <div className="font-black text-[#0D7287] dark:text-[#FFD14C]">{l.gmv} Tr đ</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1.6 VIDEO */}
      <section id="shop-video" className="space-y-6 scroll-mt-36">
        <SectionHeader 
          badge="1.6" 
          title={isEn ? "Shoppable Video Analytics" : "Phân Tích Video Có Giỏ Hàng Của Shop"} 
          id="shop-video" 
          onCopy={copyDeepLink} 
        />

        {/* Video metrics strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-slate-950 dark:text-white">{shopVideoKPIs.totalShoppableVideos}</div>
            <div className="text-xs text-slate-500 mt-1">{isEn ? 'Shoppable Videos (180d)' : 'Video gắn giỏ hàng (180 ngày)'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-slate-950 dark:text-white">{shopVideoKPIs.units90d}</div>
            <div className="text-xs text-slate-500 mt-1">{isEn ? 'Units Sold (90d)' : 'Sản phẩm bán qua Video (90 ngày)'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{shopVideoKPIs.gmv90d}</div>
            <div className="text-xs text-slate-500 mt-1">{isEn ? 'Video GMV (90d)' : 'Doanh thu Video (90 ngày)'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="text-2xl font-black text-[#0D7287] dark:text-[#FFD14C]">0% Paid Ads</div>
            <div className="text-xs text-slate-500 mt-1">{isEn ? '100% Organic UGC Viral' : '100% Lan tỏa tự nhiên'}</div>
          </div>
        </div>

        {/* Top High-converting Shoppable Videos Table */}
        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
            {isEn ? 'Top Converting Shoppable Videos' : 'Top Video Gắn Giỏ Hàng Đạt Doanh Thu Cao Nhất'}
          </h3>
          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#9BE7FA]/60 bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#C8EEF7]/30 text-slate-800 font-bold uppercase border-b border-[#9BE7FA]/40 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Tiêu Đề Video</th>
                  <th className="p-3.5">Creator Sản Xuất</th>
                  <th className="p-3.5">Lượt Xem</th>
                  <th className="p-3.5">Lượt Thích</th>
                  <th className="p-3.5">Đã Bán</th>
                  <th className="p-3.5">GMV Video</th>
                  <th className="p-3.5">Chi Phí Ads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topShoppableVideos.map((v, i) => (
                  <tr key={i} className="hover:bg-[#C8EEF7]/10 transition-colors dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-sm truncate">{v.title}</td>
                    <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#9BE7FA]">{v.creator}</td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{v.views}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{v.likes}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{v.units.toLocaleString()} SP</td>
                    <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{v.gmv} Triệu đ</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] text-[11px] font-extrabold border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                        {v.ads}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {topShoppableVideos.map((v, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">{v.creator}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] text-[10px] font-extrabold border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                    {v.ads}
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white line-clamp-2">{v.title}</h4>
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-center">
                  <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[9px] text-slate-400">{isEn ? 'Views' : 'Lượt xem'}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{v.views}</div>
                  </div>
                  <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[9px] text-slate-400">{isEn ? 'Likes' : 'Thích'}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{v.likes}</div>
                  </div>
                  <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-[9px] text-slate-400">{isEn ? 'Sold' : 'Đã bán'}</div>
                    <div className="font-black text-slate-950 dark:text-white">{v.units.toLocaleString()} SP</div>
                  </div>
                  <div className="p-1 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/60">
                    <div className="text-[9px] text-slate-400">{isEn ? 'GMV' : 'Doanh thu'}</div>
                    <div className="font-black text-[#0D7287] dark:text-[#FFD14C]">{v.gmv} Tr đ</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1.7 TÀI KHOẢN TỰ VẬN HÀNH (SELF-OPERATED ACCOUNT @kamielyhn) */}
      <section id="shop-self-operated" className="space-y-6 scroll-mt-36">
        <SectionHeader 
          badge="1.7" 
          title={isEn ? "Self-Operated Creator Account (@kamielyhn)" : "Tài Khoản Sáng Tạo Tự Vận Hành Chính Chủ (@kamielyhn)"} 
          id="shop-self-operated" 
          onCopy={copyDeepLink} 
          extraAction={
            <button
              onClick={() => openProofScreenshot('sc-074244')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#C8EEF7] text-[#0D7287] hover:bg-[#9BE7FA] transition-colors border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 cursor-pointer"
              title={isEn ? 'View FastMoss Proof #074244' : 'Xem Bằng Chứng FastMoss #074244'}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>FastMoss #074244</span>
            </button>
          } 
        />

        {/* Self-Operated Account Banner & KPIs */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF5] via-white to-[#C8EEF7]/30 border border-[#FFD14C] shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0D7287] to-[#9BE7FA] flex items-center justify-center text-white text-2xl font-black shadow-md border border-[#9BE7FA]">
                KL
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-black text-slate-950 dark:text-white">
                    {shopSelfOperatedAccount.creatorName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C8EEF7] text-[#0D7287] font-mono text-xs font-bold border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                    {shopSelfOperatedAccount.handle}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-xs font-bold border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C]">
                    {isEn ? 'Sole In-House Creator' : 'Creator Tự Vận Hành Độc Quyền'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isEn 
                    ? `Cooperation since ${shopSelfOperatedAccount.bindingDate} · Accounts for 49.3% GMV and 49.8% Volume` 
                    : `Thời gian hợp tác từ ${shopSelfOperatedAccount.bindingDate} · Đóng góp 49.3% GMV và 49.8% sản lượng của toàn bộ shop`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTabChange('creator')}
                className="px-4 py-2 rounded-xl bg-[#0D7287] text-white text-xs font-bold hover:bg-[#0D7287]/90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isEn ? 'Deep Dive Creator Tab' : 'Khám phá sâu Tab Creator'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA]/60 shadow-xs dark:bg-slate-950 dark:border-slate-800">
              <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{shopSelfOperatedAccount.unitsSold}</div>
              <div className="text-xs text-slate-500 mt-1">
                {isEn ? `Units Sold (${shopSelfOperatedAccount.unitsShare})` : `Sản lượng bán (${shopSelfOperatedAccount.unitsShare})`}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#FFD14C] shadow-xs dark:bg-slate-950 dark:border-slate-800">
              <div className="text-2xl font-black text-slate-950 dark:text-white">{shopSelfOperatedAccount.gmv}</div>
              <div className="text-xs text-slate-500 mt-1">
                {isEn ? `Self GMV (${shopSelfOperatedAccount.gmvShare})` : `Doanh số tự thân (${shopSelfOperatedAccount.gmvShare})`}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#C8EEF7] shadow-xs dark:bg-slate-950 dark:border-slate-800">
              <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{shopSelfOperatedAccount.videosCount}</div>
              <div className="text-xs text-slate-500 mt-1">
                {isEn ? 'Shoppable Videos' : 'Video gắn giỏ hàng'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#FFE485] shadow-xs dark:bg-slate-950 dark:border-slate-800">
              <div className="text-2xl font-black text-slate-950 dark:text-[#FFD14C]">{shopSelfOperatedAccount.liveSessionsCount}</div>
              <div className="text-xs text-slate-500 mt-1">
                {isEn ? 'LIVE Sessions Hosted' : 'Phiên Livestream trực tiếp'}
              </div>
            </div>
          </div>

          {/* Strategic Flywheel cards */}
          <div className="grid md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#0D7287] shadow-xs space-y-2 dark:bg-slate-950 dark:border-slate-800 dark:border-l-[#0D7287]">
              <div className="font-black text-slate-950 dark:text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                {isEn ? 'Zero-Commission Margin' : 'Tối Ưu Biên Lợi Nhuận 0% Fee'}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {isEn 
                  ? '3.0B VND GMV generated in-house eliminates typical 15-20% third-party creator commissions, preserving cash flow for R&D and flash sales.' 
                  : '3,0 Tỷ đ doanh số đến từ kênh tự vận hành giúp shop tiết kiệm 15-20% phí hoa hồng so với KOC ngoài, bảo toàn dòng tiền để tái đầu tư vào mẫu mã và flash sale.'}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#FFD14C] shadow-xs space-y-2 dark:bg-slate-950 dark:border-slate-800 dark:border-l-[#FFD14C]">
              <div className="font-black text-slate-950 dark:text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD14C]" />
                {isEn ? 'Organic Traffic Flywheel' : 'Bánh Đà Traffic Tự Nhiên'}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {isEn 
                  ? '147 videos and 208 lives continuously funnel 34.3M creator views straight into shop product carts without paid customer acquisition costs.' 
                  : '147 video và 208 phiên live điều hướng liên tục 34.3M lượt xem của kênh vào giỏ hàng shop với chi phí CAC gần như bằng 0 cho tệp organic.'}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#0D7287] shadow-xs space-y-2 dark:bg-slate-950 dark:border-slate-800 dark:border-l-[#9BE7FA]">
              <div className="font-black text-slate-950 dark:text-white text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                {isEn ? 'Brand Consistency Control' : 'Kiểm Soát Nhất Quán Thương Hiệu'}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {isEn 
                  ? 'Direct host ownership guarantees accurate product sizing, fabric consultation, and rapid feedback loops between buyers and warehouse.' 
                  : 'Chủ kênh trực tiếp live giúp tư vấn đúng size số, chất liệu bikini/đồ bơi, hạn chế tối đa tỷ lệ hoàn hàng và tạo phản hồi tức thì về xưởng.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CROSS-TAB NAVIGATION CTA */}
      <div className="pt-8 border-t border-[#9BE7FA]/60 dark:border-slate-800">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF5] via-[#FFF9E6] to-[#FFE485]/40 border-2 border-[#FFD14C] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 dark:bg-gradient-to-br dark:from-[#041E24] dark:via-slate-900 dark:to-[#0D7287]/40 dark:border-[#9BE7FA] dark:shadow-xl transition-colors">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD14C] text-slate-950 text-xs font-black uppercase tracking-wider dark:bg-[#9BE7FA] dark:text-slate-950">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'DEEP-DIVE INTO THE ANCHOR CREATOR' : 'TIẾP TỤC KHÁM PHÁ: KÊNH CHÍNH CHỦ'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
              {isEn 
                ? 'Discover How @kamielyhn Generates 50% of Shop GMV' 
                : 'Tìm Hiểu Cách Kênh @kamielyhn Tạo Ra 50% Doanh Số Của Toàn Shop'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {isEn
                ? 'Analyze creator audience demographics, video conversion rates, 208 live sessions, and 9.2B VND career commercial capacity.'
                : 'Xem chân dung nhân khẩu học khán giả, tỷ lệ tương tác đỉnh 0.74%, dữ liệu 208 phiên live và năng lực thương mại 9,2 Tỷ đ của founder & anchor host.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                handleTabChange('creator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#0D7287] hover:bg-[#095262] text-white dark:bg-[#9BE7FA] dark:hover:bg-[#72dbf3] dark:text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isEn ? 'View Creator Analysis (Part 2)' : 'Xem Phân Tích Creator (Phần 2)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                handleTabChange('science');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#0D7287] text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 dark:text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isEn ? 'Data Science Case Study' : 'Nghiên Cứu Khoa Học Dữ Liệu'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
