'use client';

import React, { useState } from 'react';
import { 
  TrendingDown, 
  TrendingUp,
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Flame, 
  Clock, 
  BarChart2, 
  Users2, 
  Package, 
  ArrowUpRight,
  Zap,
  Target,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import metrics from '@/app/data/kami-ely/generated/metrics.json';

interface KamiElyExecutiveStoryProps {
  isEn: boolean;
  onJumpToTab?: (tab: 'science' | 'shop' | 'creator') => void;
}

export default function KamiElyExecutiveStory({ isEn, onJumpToTab }: KamiElyExecutiveStoryProps) {
  const [activeStoryBlock, setActiveStoryBlock] = useState<number>(1);

  // Formatter helpers
  const fmtVnd = (val: number) => {
    if (val >= 1e9) return `${(val / 1e9).toFixed(2)} tỷ ₫`;
    if (val >= 1e6) return `${(val / 1e6).toFixed(1)} tr ₫`;
    return `${val.toLocaleString()} ₫`;
  };

  const blocks = [
    { id: 1, title: isEn ? '1. The Business Cliff' : '1. Vực Thẳm Doanh Thu (-83%)', icon: TrendingDown },
    { id: 2, title: isEn ? '2. In-House Dual Channel' : '2. Giải Mã Kênh Vệ Tinh (89% GMV)', icon: Users2 },
    { id: 3, title: isEn ? '3. Statistical Audit' : '3. Kiểm Chứng Dashboard', icon: BarChart2 },
    { id: 4, title: isEn ? '4. Catalog Bottleneck' : '4. Ma Trận SKU & Tồn Kho', icon: Package },
    { id: 5, title: isEn ? '5. Action Plan & KPIs' : '5. Lộ Trình 5 Bước Có KPI', icon: CheckCircle2 },
  ];

  return (
    <section id="executive-story" className="mb-14 rounded-3xl bg-white border-2 border-slate-200/90 shadow-xl overflow-hidden dark:bg-slate-900/95 dark:border-slate-800 transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#041E24] to-[#0D7287] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-[#9BE7FA]/20 to-[#FFD14C]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD14C] text-slate-950 text-xs font-black uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>{isEn ? '3-MINUTE EXECUTIVE AUDIT' : 'BẢN PHÂN TÍCH ĐIỀU HÀNH · ĐỌC HIỂU TRONG 3 PHÚT'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {isEn 
                ? 'Deconstructing TikTok Shop Performance: Operational Reality vs Dashboard Illusions'
                : 'Chẩn Đoán Thực Tế Vận Hành TikTok Shop: Bóc Tách Bản Chất Kênh Vệ Tinh & 3 Bằng Chứng Thực Nghiệm'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {isEn
                ? 'Synthesized from 8 raw FastMoss & Seller Center files (12.74B VND GMV). An empirical investigation uncovering in-house dual channel reliance, seasonality saturation, and high-impact Autumn-Winter recovery.'
                : 'Tổng hợp từ 8 tệp dữ liệu FastMoss & Seller Center (12,74 tỷ VNĐ GMV 180N). Bóc tách cỗ máy Livestream nội bộ gánh 89% doanh thu, loại bỏ ngụy biện tương quan và đối chiếu 3 thực nghiệm định đoạt hiệu quả kinh doanh.'}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">{isEn ? '180d Real GMV' : 'GMV 180 Ngày'}</div>
              <div className="text-lg sm:text-xl font-black text-[#9BE7FA]">12,74 Tỷ ₫</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">{isEn ? 'In-House Live' : 'Live Nội Bộ'}</div>
              <div className="text-lg sm:text-xl font-black text-[#FFD14C]">89.4%</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center col-span-2 sm:col-span-1 md:col-span-2">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">{isEn ? 'Seasonality Cliff' : 'Sụt Giảm Mùa Vụ'}</div>
              <div className="text-lg sm:text-xl font-black text-rose-400">315M ➔ 5,4M/ngày</div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3 CỘT SO SÁNH THỰC NGHIỆM ĐỊNH ĐOẠT CHIẾN LƯỢC                      */}
      {/* =================================================================== */}
      <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
            <Target className="w-3.5 h-3.5" />
            <span>{isEn ? '3 EMPIRICAL A/B PROOF COLUMNS' : '3 CỘT SO SÁNH THỰC NGHIỆM ĐỊNH ĐOẠT CHIẾN LƯỢC'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
            {isEn
              ? 'Data-Driven Reality: 3 A/B Case Studies Proving Operational Turning Points'
              : 'Thực Chứng Dữ Liệu: 3 Case So Sánh A/B Khẳng Định Năng Lực Senior Data Analyst'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {isEn
              ? 'Direct side-by-side empirical evidence eliminating guesswork from operational management.'
              : 'Đối chiếu số liệu thực tế từng phiên và từng mã hàng, loại bỏ hoàn toàn các phỏng đoán cảm tính trong quản trị vận hành.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Cột 1: Spam Số Lượng vs. Tối Ưu Chất Lượng */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md dark:bg-slate-900 dark:border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-700 dark:text-rose-300 font-mono text-[11px] font-bold border border-rose-500/30">
                {isEn ? 'PROOF 1 · QUANTITY VS. QUALITY' : 'BẰNG CHỨNG 1 · BẪY SỐ LƯỢNG PHIÊN LIVE'}
              </span>
              <h4 className="text-base font-bold text-slate-950 dark:text-white leading-snug">
                {isEn ? 'Spamming 106 LIVEs (79M) vs. Quality 45 LIVEs (196M)' : 'Spam 106 Phiên LIVE (79,4M) vs. Tối Ưu 45 Phiên LIVE (196,1M)'}
              </h4>
              
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1">
                  <div className="flex justify-between font-bold text-rose-800 dark:text-rose-300">
                    <span>{isEn ? 'Spam Day: 2026-04-09' : 'Ngày Spam: 09/04/2026'}</span>
                    <span className="font-mono">79,4 Triệu ₫</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Phát tán <strong>106 phiên LIVE</strong> toàn sàn ➔ TB chỉ <strong>749k đ/phiên</strong>. Gây kiệt sức host và phân tán thuật toán.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                  <div className="flex justify-between font-bold text-emerald-800 dark:text-emerald-300">
                    <span>{isEn ? 'Optimized Day: 2026-06-25' : 'Ngày Tối Ưu: 25/06/2026'}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">196,1 Triệu ₫</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Chỉ phát <strong>45 phiên LIVE</strong> chất lượng ➔ Đạt <strong>4,36 Triệu đ/phiên</strong> (Gấp <strong>5,82 lần</strong> ngày 09/04).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Bài học Analytics:</strong> Tăng số lượng phiên LIVE trong ngày không làm tăng doanh thu ròng. TikTok ưu tiên giữ chân người xem (Retention) hơn là tần suất mở phòng.
            </div>
          </div>

          {/* Cột 2: Thực Nghiệm A/B Testing Live Ads */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md dark:bg-slate-900 dark:border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-bold border border-indigo-500/30">
                {isEn ? 'PROOF 2 · LIVE ADS A/B TEST' : 'BẰNG CHỨNG 2 · A/B TEST LIVE ADS'}
              </span>
              <h4 className="text-base font-bold text-slate-950 dark:text-white leading-snug">
                {isEn ? 'Standard (1.81M/hr) vs. Ads Booster (5.73M/hr · 3.16x)' : 'Phiên Tiêu Chuẩn (1,81M/h) vs. Kích Hoạt Ads (5,73M/h · Gấp 3,16x)'}
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{isEn ? 'Standard: 2026-03-22' : 'Phiên Chuẩn: 22/03/2026'}</span>
                    <span className="font-mono">9,25 Triệu ₫</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Chi phí Ads: <strong>678,75k đ</strong> | Thời lượng: 5h07m | Tốc độ chốt đơn: <strong>1,81 Triệu đ/giờ</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-1">
                  <div className="flex justify-between font-bold text-indigo-800 dark:text-indigo-300">
                    <span>{isEn ? 'Boosted: 2026-03-28' : 'Phiên Bùng Nổ: 28/03/2026'}</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">20,65 Triệu ₫</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Chi phí Ads: <strong>2,17 Triệu đ</strong> | Thời lượng: 3h36m | Tốc độ chốt đơn: <strong>5,73 Triệu đ/giờ</strong> (Gấp <strong>3,16 lần</strong>).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Bài học Analytics:</strong> Đòn bẩy Live Shopping Ads tạo ra điểm gãy doanh thu rõ rệt: rút ngắn 30% giờ live mà tăng gấp hơn 3 lần hiệu suất doanh thu/giờ.
            </div>
          </div>

          {/* Cột 3: Tiềm Năng Xoay Trục Hero SKU Thu - Đông */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md dark:bg-slate-900 dark:border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30">
                {isEn ? 'PROOF 3 · HERO SKU PIVOT' : 'BẰNG CHỨNG 3 · XOAY TRỤC HERO SKU'}
              </span>
              <h4 className="text-base font-bold text-slate-950 dark:text-white leading-snug">
                {isEn ? 'Bikini Trap vs. A-Line Skirt (CV11: 6,375 Units · 735M)' : 'Bẫy Đồ Bơi vs. Chân Váy Form Chữ A (CV11: 6.375 SP · 735M)'}
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1">
                  <div className="flex justify-between font-bold text-amber-800 dark:text-amber-300">
                    <span>{isEn ? 'Swimwear Trap' : 'Bẫy Lệ Thuộc Đồ Bơi'}</span>
                    <span className="font-mono">69,31% GMV</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Bikini mất 95% lực cầu vào tháng 8–9 khi thời tiết miền Bắc lạnh dần. Host tiếp tục live bikini chỉ tạo ra các phiên 0đ–119k đ.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                  <div className="flex justify-between font-bold text-emerald-800 dark:text-emerald-300">
                    <span>{isEn ? 'Hero SKU CV11 (All Shop)' : 'Hero SKU CV11 (Toàn Shop)'}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">6.375 SP / 735,07M</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Mã <strong>CV11</strong> đạt sản lượng #1 shop, nhưng kênh chính chủ mới chỉ khai thác <strong>21,0% (1.338 SP)</strong>. Tiềm năng xoay trục 79% còn lại sang Thu–Đông cực lớn!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Bài học Analytics:</strong> Khai phá khoảng trống danh mục: Chuyển giao các mã váy/nỉ Thu–Đông từ kênh vệ tinh và kệ hàng sang phòng LIVE chính chủ.
            </div>
          </div>
        </div>
      </div>

      {/* Tab switcher inside Executive Story */}
      <div className="px-6 sm:px-8 pt-4 pb-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {blocks.map((b) => {
          const Icon = b.icon;
          const isActive = activeStoryBlock === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setActiveStoryBlock(b.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 shadow-md font-black scale-102'
                  : 'bg-white dark:bg-slate-800 text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{b.title}</span>
            </button>
          );
        })}
      </div>

      {/* Body Content Area of 3-Minute Story */}
      <div className="p-6 sm:p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/40">
        
        {/* BLOCK 1: VỰC THẲM DOANH THU */}
        {activeStoryBlock === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 text-xs font-bold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>BỐI CẢNH BÀI TOÁN KINH DOANH</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-snug">
                  Đỉnh cao 3,77 tỷ (Tháng 6) và Cú rơi tự do 645 triệu (Tháng 8): Tại sao?
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Trong 180 ngày (09/03 – 04/09/2026), shop thời trang & đồ bơi <strong>Kami Ely</strong> đạt tổng GMV <strong>12,74 tỷ VNĐ</strong>. Tuy nhiên, đường cong doanh thu trải qua biến động cực đoan:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                    <div className="text-xs text-slate-500 font-bold">Tháng 4 (Bứt phá)</div>
                    <div className="text-base font-black text-slate-900 dark:text-white mt-1">2,46 Tỷ ₫</div>
                    <div className="text-[11px] text-emerald-600 font-bold mt-0.5">+98.5%/ngày (chuẩn hóa)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800">
                    <div className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">Tháng 6 (Đỉnh mùa hè)</div>
                    <div className="text-base font-black text-emerald-900 dark:text-emerald-100 mt-1">3,77 Tỷ ₫</div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">Chiếm 29.6% tổng kỳ</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 dark:bg-rose-950/40 dark:border-rose-800">
                    <div className="text-xs text-rose-800 dark:text-rose-300 font-bold">Tháng 8 (Vực thẳm)</div>
                    <div className="text-base font-black text-rose-900 dark:text-rose-100 mt-1">645,5 Tr ₫</div>
                    <div className="text-[11px] text-rose-600 font-bold mt-0.5">-82.9% so với đỉnh</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border-l-4 border-amber-500 text-amber-900 dark:bg-amber-950/30 dark:border-amber-400 dark:text-amber-200 text-xs sm:text-sm leading-relaxed">
                  <strong>Câu hỏi phân tích của Data Analyst:</strong> Sự suy giảm -83% này là do <em>chu kỳ kết thúc mùa du lịch biển tất yếu</em> (Demand drop), hay do <em>suy thoái kênh phân phối</em> (Supply/Channel failure)? Liệu đội ngũ vận hành có thể đảo ngược đà giảm bằng cách tăng cường độ livestream không?
                </div>
              </div>

              {/* Monthly breakdown visual */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-3">
                <div className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  Diễn biến GMV theo tháng (Chuẩn hóa trung bình ngày)
                </div>
                <div className="space-y-2.5">
                  {metrics.store.monthly.map((m: any) => {
                    const isPeak = m.month === '2026-06';
                    const isLow = m.month === '2026-08';
                    const widthPct = Math.min(100, Math.round((m.gmvPerDay / 125747625) * 100));
                    return (
                      <div key={m.month} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className={`${isPeak ? 'text-emerald-600 dark:text-emerald-400 font-black' : isLow ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-slate-700 dark:text-slate-300'}`}>
                            {m.month} {m.isPartial ? '(Một phần)' : ''}
                          </span>
                          <span className="text-slate-900 dark:text-white font-mono">
                            {(m.gmvPerDay / 1e6).toFixed(1)}M/ngày · {fmtVnd(m.gmv)}
                          </span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isPeak ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : isLow ? 'bg-rose-500' : 'bg-[#0D7287] dark:bg-[#9BE7FA]'
                            }`}
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 text-right">
                  Ngày đỉnh: 16/06 (315,0M ₫ / 1.936 SP) · Ngày thấp: 04/09 (5,4M ₫ / 49 SP)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCK 2: GIẢI MÃ KÊNH VỆ TINH VÀ MÔ HÌNH DUAL-CHANNEL IN-HOUSE */}
        {activeStoryBlock === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 border-2 border-indigo-200 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 dark:border-indigo-800 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-black uppercase tracking-wider">
                  PHÁT HIỆN ĐẶC QUYỀN (DOMAIN CORRECTION)
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Bóc tách nhãn dữ liệu nền tảng FastMoss</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                Bóc trần &quot;Ảo ảnh Affiliate&quot;: Girl Style là Kênh vệ tinh In-House, Đội ngũ nội bộ gánh tới 89,4% GMV Live!
              </h3>
              
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Trên báo cáo FastMoss, tài khoản <strong>Girl Style (@girlstyle.vn)</strong> được dán nhãn là &quot;Affiliate LIVE&quot; với hiệu suất bất thường (gấp 15 lần trung bình toàn mạng). Tuy nhiên, đối chiếu thực tế vận hành cho thấy: <strong>Girl Style thuộc quyền sở hữu của chính Shop và do CÙNG 1 ĐỘI NGŨ IN-HOUSE vận hành song song với kênh chính (@kamielyhn)!</strong>
              </p>

              {/* Before vs After Correction Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-rose-200 dark:bg-slate-900 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-rose-600 uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Báo Cáo Dashboard Gốc (Sai lệch thực tế)
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Kênh chính chiếm 75.8% GMV Live. Girl Style bị coi là 1 KOC bên ngoài chiếm tới 56.1% doanh thu affiliate. Nhà phân tích non tay sẽ cảnh báo: <em>&quot;Rủi ro phụ thuộc nghiêm trọng vào 1 creator ngoài, cần ký hợp đồng giữ chân kẻo họ bỏ đi&quot;</em>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 space-y-2">
                  <div className="text-xs font-black text-emerald-700 dark:text-emerald-300 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Bản Chất Vận Hành Thật Sự (Senior Audit)
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Shop vận hành <strong>Mô hình Dual-Channel In-House</strong> (2 kênh chạy luân phiên để chiếm sóng thuật toán TikTok). <strong>Đội ngũ nội bộ tạo ra 8,28 tỷ VNĐ (89.4% GMV Live)</strong>. Mạng lưới Affiliate bên ngoài thực tế rất yếu và gần như không có đóng góp đáng kể!
                  </p>
                </div>
              </div>

              {/* Dual Channel Live Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="p-3.5 rounded-xl bg-white border border-indigo-100 dark:bg-slate-900 dark:border-slate-800 text-center">
                  <div className="text-[11px] text-slate-500 font-bold">Kênh chính @kamielyhn</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-1">7,02 Tỷ ₫</div>
                  <div className="text-[10px] text-slate-500">470 phiên · 14,9M/phiên</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-indigo-100 dark:bg-slate-900 dark:border-slate-800 text-center">
                  <div className="text-[11px] text-slate-500 font-bold">Kênh vệ tinh @girlstyle.vn</div>
                  <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1">1,26 Tỷ ₫</div>
                  <div className="text-[10px] text-slate-500">255 phiên · 4,9M/phiên</div>
                </div>
                <div className="p-3.5 rounded-xl bg-indigo-600 text-white text-center shadow-md">
                  <div className="text-[11px] text-indigo-100 font-bold">Tổng Live Nội Bộ (180N)</div>
                  <div className="text-lg font-black text-white mt-1">8,28 Tỷ ₫</div>
                  <div className="text-[10px] text-indigo-100">89,4% GMV Live toàn shop</div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 dark:bg-amber-950/40 dark:border-amber-800 text-center">
                  <div className="text-[11px] text-amber-800 dark:text-amber-300 font-bold">Affiliate Ngoài Thực Thụ</div>
                  <div className="text-lg font-black text-amber-900 dark:text-amber-100 mt-1">982,4 Tr ₫</div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400">6.321 phiên · chỉ 155k/phiên</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                👉 <strong>Chênh lệch năng suất:</strong> Đội ngũ nội bộ tạo ra doanh thu trung bình <strong>11,4 triệu VNĐ/phiên</strong> — gấp <strong>73,5 lần</strong> so với mạng lưới KOC ngoài thực thụ (155k VNĐ/phiên). Điểm yếu cốt tử của shop là <em>không có đệm đỡ affiliate bên ngoài</em>, hoàn toàn cày cuốc bằng sức người nội bộ.
              </div>
            </div>
          </div>
        )}

        {/* BLOCK 3: KIỂM CHỨNG THỐNG KÊ */}
        {activeStoryBlock === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stat test 1: Marketing vs Seasonality */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-100 text-[#0D7287] dark:bg-sky-950 dark:text-[#9BE7FA] text-xs font-bold">
                  <BarChart2 className="w-3.5 h-3.5" />
                  KIỂM CHỨNG TƯƠNG QUAN VÀ MÙA VỤ
                </div>
                <h4 className="text-lg font-black text-slate-950 dark:text-white">
                  &quot;Tăng phiên Live có kéo được doanh thu mùa thấp điểm?&quot;
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Dashboard thoạt nhìn cho thấy số phiên Live hàng ngày tương quan dương với GMV (Pearson r = 0.41, Spearman ρ = 0.47).
                </p>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tương quan thô toàn kỳ (180N):</span>
                    <span className="font-bold text-emerald-600">ρ = 0.473 (p &lt; 0.001)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sau khi loại hiệu ứng tháng (Within-month):</span>
                    <span className="font-bold text-rose-500">ρ = -0.040 (p = 0.594)</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
                  <strong>Kết luận khoa học:</strong> Toàn bộ tương quan đến từ biến mùa vụ hè (tháng 5–6 cầu cao thì mở nhiều live). Trong cùng một tháng, ngày cày nhiều phiên hơn <strong>không làm tăng doanh thu có ý nghĩa thống kê</strong>. Đốt sức team live vào tháng 8–9 khi nhu cầu đồ bơi tắt lịm chỉ gây kiệt sức chứ không cứu được GMV!
                </div>
              </div>

              {/* Stat test 2: Video vs Live GPM */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  SO SÁNH GPM VIDEO VS LIVESTREAM
                </div>
                <h4 className="text-lg font-black text-slate-950 dark:text-white">
                  GPM Video 135k vs Live 30k: Sự thật đằng sau chỉ số
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  FastMoss báo GPM Video của kênh chính gấp 4.5 lần Live trong 28 ngày. Tuy nhiên, tính toán phân phối thực tế 180 ngày cho thấy:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 flex justify-between items-center">
                    <span>Shoppable Video (n=139)</span>
                    <span className="font-mono font-bold">Median: 46,0k ₫/1k view · 68.4% ra đơn</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 flex justify-between items-center">
                    <span>Creator Livestream (n=475)</span>
                    <span className="font-mono font-bold">Median: 995,9k ₫/1k viewer · 95.6% ra đơn</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Giác ngộ phương pháp luận:</strong> Mẫu số của hai chỉ số không đồng nhất (Lượt xem video so với Lượt người xem vào phiên live). Video đóng vai trò <em>phễu nhận diện và doanh thu tích lũy thụ động</em>, trong khi Live là <em>cỗ máy chốt đơn tức thì</em>. Cần kết hợp cả hai thay vì cắt bớt một bên.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCK 4: MA TRẬN DANH MỤC SKU VÀ TỒN KHO */}
        {activeStoryBlock === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 text-xs font-bold">
                  <Package className="w-3.5 h-3.5" />
                  MA TRẬN DANH MỤC VÀ TỒN KHO (90 NGÀY)
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                  Quy Luật Pareto Khắc Nghiệt: 6% SKU Tạo 80% Doanh Thu, 60% SKU Chết
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Bóc tách 331 mã sản phẩm trong file `_ product data (90 ngày)` với hệ số bất bình đẳng <strong>Gini = 0.919</strong>:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                    <div className="text-xs text-slate-500 font-bold">Tổng SKU Shop</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-1">331 SKU</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Danh mục niêm yết</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800">
                    <div className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">Hero SKUs (Top 80%)</div>
                    <div className="text-xl font-black text-emerald-900 dark:text-emerald-100 mt-1">21 SKU</div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">Chỉ chiếm 6.34% SKU</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 dark:bg-rose-950/40 dark:border-rose-800 col-span-2 sm:col-span-1">
                    <div className="text-xs text-rose-800 dark:text-rose-300 font-bold">Dead Stock (0 đơn)</div>
                    <div className="text-xl font-black text-rose-900 dark:text-rose-100 mt-1">197 SKU</div>
                    <div className="text-[11px] text-rose-600 font-bold mt-0.5">59.52% danh mục</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Cơ cấu ngách:</strong> Nhóm <strong>Đồ bơi & Bikini (Swimwear)</strong> chiếm tới <strong>58.7% GMV</strong> toàn shop trong 90 ngày. Điều này lý giải tại sao vào tháng 8–9 khi thời tiết chuyển lạnh, toàn bộ các Hero SKU này đồng loạt mất lực cầu, kéo theo toàn shop rơi tự do vì thiếu sản phẩm thay thế theo mùa.
                </div>
              </div>

              {/* Top 5 Hero SKUs Card */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-3">
                <div className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  Top 5 Hero SKUs Gánh Doanh Số (90 Ngày)
                </div>
                <div className="space-y-3">
                  {metrics.products.top10.slice(0, 5).map((p: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5 max-w-[200px] sm:max-w-[240px]">
                        <div className="font-bold text-slate-900 dark:text-white truncate" title={p.name}>
                          #{idx + 1} {p.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {p.category} · {fmtVnd(p.price)}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                          {fmtVnd(p.gmv)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold">
                          {p.units.toLocaleString()} SP ({p.sharePct}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCK 5: LỘ TRÌNH HÀNH ĐỘNG 5 BƯỚC */}
        {activeStoryBlock === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                CHIẾN LƯỢC ĐỀ XUẤT CỦA DATA ANALYST (ACTIONABLE ROADMAP)
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                5 Ưu Tiên Hành Động Xếp Theo Tác Động × Tính Khả Thi
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-black uppercase">
                    ƯU TIÊN 1 · KHẨN CẤP
                  </span>
                  <span className="text-xs text-slate-500 font-mono">KPI: Doanh số Q4</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Chuyển đổi danh mục Thu - Đông cho cả 2 kênh In-House
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Vì bikini chiếm 58.7% GMV đã hết mùa, team in-house không thể tiếp tục live đồ bơi. Cần lập tức đưa vào các mã: Áo nỉ, Set nỉ thể thao, Áo len, Chân váy dạ (kế thừa thành công từ Chân váy chữ A CV11 - 735M).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-black uppercase">
                    ƯU TIÊN 2 · ĐÒN BẨY HỆ THỐNG
                  </span>
                  <span className="text-xs text-slate-500 font-mono">KPI: Tỷ lệ ra đơn 5% → 12%</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Tuyển KOC Ngoài Thực Thụ nhắm nhóm 10k–50k Followers
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Bỏ ảo tưởng KOC &lt;1k follower (tỷ lệ ra đơn chỉ 1.6%). Nhóm 10k–50k có tỷ lệ ra đơn cao nhất (7.8% - 11.6%) và đóng góp 37.5% GMV ngoài. Cần gửi sample và hoa hồng bậc thang cho nhóm này để giảm tải cho team in-house.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-[#0D7287] dark:bg-sky-950 dark:text-[#9BE7FA] text-[10px] font-black uppercase">
                    ƯU TIÊN 3 · TỐI ƯU VỐN
                  </span>
                  <span className="text-xs text-slate-500 font-mono">KPI: Giảm 50% Dead-stock</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Xả kho Bundle 197 SKU Chết cùng Top 21 Hero SKU
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Thay vì giảm giá trực tiếp làm mất giá trị thương hiệu, đóng gói 197 SKU dead-stock thành &quot;Quà tặng kèm đơn từ 299k&quot; hoặc &quot;Combo mua 1 tặng 1&quot; trên các phiên live của Girl Style.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-black uppercase">
                    ƯU TIÊN 4 · VẬN HÀNH NỘI DUNG
                  </span>
                  <span className="text-xs text-slate-500 font-mono">KPI: Video conv 68% → 80%</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Tối ưu khung giờ đăng Video (15h–16h) & Bật Featured Sales
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Dữ liệu viễn trắc cho thấy khung giờ 16h đạt Engagement Rate đỉnh (0.69%). Kích hoạt tính năng Featured Sales của TikTok Shop (hiện đang bỏ trống 0đ suốt 180 ngày) để đón traffic tìm kiếm tự nhiên.
                </p>
              </div>
            </div>

            {/* Scientific limitation statement */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-1">
              <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>Tuyên bố giới hạn nghiên cứu (Research Limitations):</span>
              </div>
              <p>
                1. Bộ dữ liệu FastMoss không ghi nhận chi phí giá vốn (COGS), phí sàn, tỷ lệ hoàn hủy thực tế và chi phí chạy ads, do đó các phân tích tập trung vào Top-line GMV và năng suất kênh. 2. Chu kỳ 180 ngày phản ánh trọn vẹn mùa xuân–hè nhưng chưa đủ lịch sử đa năm để phân rã mô hình ARIMA chu kỳ năm. Mọi đề xuất đã tính đến các giới hạn này.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer CTA of Executive Story: Jump into deep-dive tabs */}
      <div className="bg-slate-100 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 dark:bg-slate-900/90 dark:border-slate-800">
        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium text-center sm:text-left">
          Đã xong phần tóm lược 3 phút. Hãy chọn tab chuyên sâu bên dưới để kiểm tra toàn bộ mã nguồn, biểu đồ và số liệu chi tiết.
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (onJumpToTab) onJumpToTab('science');
              const el = document.getElementById('tabs-container');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Tab Khoa Học Dữ Liệu</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (onJumpToTab) onJumpToTab('shop');
              const el = document.getElementById('tabs-container');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-2 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 text-xs font-black shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Tab Chi Tiết Shop</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
