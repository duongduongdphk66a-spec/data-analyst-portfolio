'use client';

import React, { useState } from 'react';
import { 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  AlertTriangle, 
  Sparkles, 
  Flame, 
  Clock, 
  ChevronRight,
  PieChart,
  BarChart2,
  FileText,
  Users2,
  Package,
  ArrowUpRight
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
              <span>{isEn ? '3-MINUTE EXECUTIVE AUDIT' : 'BẢN PHÂN TÍCH ĐIỀU HÀNH · ĐỌC TRONG 3 PHÚT'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {isEn 
                ? 'Deconstructing TikTok Shop Performance: Operational Reality vs Dashboard Illusions'
                : 'Chẩn Đoán Thực Tế Vận Hành TikTok Shop: Bóc Tách Bản Chất Kênh Vệ Tinh & Nghịch Lý Mùa Vụ'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {isEn
                ? 'Synthesized from 8 raw FastMoss files (12.7B VND GMV). An end-to-end data audit revealing dual-channel in-house concentration, catalog seasonality cliffs, and debunking dashboard correlation fallacies.'
                : 'Tổng hợp từ 8 nguồn dữ liệu FastMoss (12,7 tỷ VNĐ GMV 180N). Phẫu thuật chuyên sâu phát hiện cỗ máy Livestream 2 kênh in-house gánh 89% doanh thu, bóc trần sự suy kiệt tệp affiliate ngoài và vạch ra chiến lược cứu vãn mùa thấp điểm.'}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">{isEn ? '180d GMV' : 'GMV 180 Ngày'}</div>
              <div className="text-lg sm:text-xl font-black text-[#9BE7FA]">12,74 Tỷ ₫</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">{isEn ? 'In-House Live' : 'Live Nội Bộ'}</div>
              <div className="text-lg sm:text-xl font-black text-[#FFD14C]">89.4%</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center col-span-2 sm:col-span-1 md:col-span-2">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">{isEn ? 'Peak-to-Trough Cliff' : 'Sụt Giảm Sau Đỉnh'}</div>
              <div className="text-lg sm:text-xl font-black text-rose-400">-82.9% (T6 → T8)</div>
            </div>
          </div>
        </div>

        {/* Tab switcher inside Executive Story */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 scrollbar-none border-t border-white/10 mt-6">
          {blocks.map((b) => {
            const Icon = b.icon;
            const isActive = activeStoryBlock === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setActiveStoryBlock(b.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#9BE7FA] text-slate-950 shadow-md font-black scale-102'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{b.title}</span>
              </button>
            );
          })}
        </div>
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
