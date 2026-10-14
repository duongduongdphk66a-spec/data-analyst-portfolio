'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  Search, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ArrowUpRight, 
  BarChart2, 
  Sparkles, 
  ShieldAlert, 
  Landmark, 
  Coins, 
  Activity,
  Compass,
  FileCheck
} from 'lucide-react';
interface HeritageJapanExecutiveStoryProps {
  isEn: boolean;
  onJumpToSection?: (_sectionId: string) => void;
}

export default function HeritageJapanExecutiveStory({ isEn, onJumpToSection }: HeritageJapanExecutiveStoryProps) {
  const [activeStoryBlock, setActiveStoryBlock] = useState<number>(1);

  const blocks = [
    { id: 1, title: isEn ? '1. 20-Yr Growth Engine' : '1. Động Lực Tăng Trưởng (36.9M Khách)', icon: TrendingUp },
    { id: 2, title: isEn ? '2. Overtourism Crisis' : '2. Khủng Hoảng Quá Tải Cố Đô', icon: AlertTriangle },
    { id: 3, title: isEn ? '3. V-Shape & Counterfactual' : '3. Cú Sốc & Mô Hình Phục Hồi', icon: Layers },
    { id: 4, title: isEn ? '4. Statistical Audit (Typo 10x)' : '4. Kiểm Định Data & Dị Biệt', icon: Search },
    { id: 5, title: isEn ? '5. 4-Pillar Action Plan' : '5. Lộ Trình Chính Sách 4 Trụ Cột', icon: CheckCircle2 },
  ];

  return (
    <section id="heritage-executive-story" className="mb-14 rounded-3xl bg-white border-2 border-slate-200/90 shadow-xl overflow-hidden dark:bg-slate-900/95 dark:border-slate-800 transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#062831] to-[#0D7287] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-[#9BE7FA]/20 to-[#FFD14C]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD14C] text-slate-950 text-xs font-black uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>{isEn ? '3-MINUTE EXECUTIVE AUDIT' : 'BẢN PHÂN TÍCH ĐIỀU HÀNH · ĐỌC TRONG 3 PHÚT'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {isEn 
                ? 'Japan Heritage Tourism: ¥8.14T Economic Boom vs Cultural Overtourism Crisis'
                : 'Du Lịch Di Sản Nhật Bản: Cú Hích Kinh Tế ¥8.14T vs Khủng Hoảng Quá Tải Cố Đô'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {isEn
                ? 'Synthesized from 20-year JNTO & MLIT datasets and VNU academic thesis. Deconstructing a +481% surge in inbound spending, uncovering hidden statistical typos (10x anomaly), and charting a balanced model between cultural conservation and regional resident vitality.'
                : 'Tổng hợp từ dữ liệu chuỗi thời gian 20 năm của JNTO, MLIT và Niên luận học thuật ĐHQGHN. Bóc tách sức bật tăng trưởng +481% chi tiêu, phát hiện sai lệch số liệu 10x trong đồ thị lưu trữ và định hình mô hình cân bằng giữa bảo tồn di sản và dân sinh cố đô.'}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">{isEn ? '2024 Record Visitors' : 'Kỷ Lục Khách 2024'}</div>
              <div className="text-lg sm:text-xl font-black text-[#9BE7FA]">36.87 Triệu</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">{isEn ? '2024 Expenditure' : 'Chi Tiêu 2024'}</div>
              <div className="text-lg sm:text-xl font-black text-[#FFD14C]">8.14 Nghìn Tỷ ¥</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center col-span-2 sm:col-span-1 md:col-span-2">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">{isEn ? 'Policy CAGR (2013-19)' : 'Tăng Trưởng CAGR'}</div>
              <div className="text-lg sm:text-xl font-black text-emerald-300">+20.6% / năm</div>
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

      {/* Body Content Area */}
      <div className="p-6 sm:p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/40">
        
        {/* BLOCK 1: ĐỘNG LỰC TĂNG TRƯỞNG 20 NĂM */}
        {activeStoryBlock === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-100 text-teal-900 dark:bg-teal-950/80 dark:text-teal-300 text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{isEn ? '20-YEAR TIME-SERIES DYNAMICS' : 'ĐỘNG LỰC CHUỖI THỜI GIAN 20 NĂM'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  {isEn
                    ? 'From Inbound Obscurity to Global Tourism Superpower (2003 – 2024)'
                    : 'Hành Trình Bứt Phá Thành Cường Quốc Du Lịch Toàn Cầu (2003 – 2024)'}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'In 2003, Japan welcomed merely 5.2 million foreign visitors. The watershed turning point was the "2013 Tourism Nation Action Plan" combined with the 2015 "Japan Heritage" thematic branding project, which unlocked aggressive visa deregulation, tax-free retail, and low-cost carrier access.'
                    : 'Năm 2003, Nhật Bản chỉ đón vỏn vẹn 5.2 triệu khách quốc tế. Bước ngoặt lịch sử diễn ra vào năm 2013 khi Thủ tướng Abe ban hành "Chương trình Hành động Quốc gia Du lịch" kết hợp với đề án "Japan Heritage 2015", nới lỏng toàn diện thị thực cho Đông Nam Á, mở rộng hàng không giá rẻ và miễn thuế mua sắm.'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">2003 Baseline</div>
                    <div className="text-lg font-black text-slate-800 dark:text-slate-100">5.21M Khách</div>
                    <div className="text-xs text-slate-500 font-medium">Chi tiêu ~1.1T ¥</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-[#0D7287] dark:text-[#9BE7FA] font-mono">2019 Pre-Covid Peak</div>
                    <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">31.88M Khách</div>
                    <div className="text-xs text-teal-600 dark:text-teal-400 font-bold">+512% vs 2003</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
                    <div className="text-[10px] uppercase font-bold text-[#FFD14C] font-mono">2024 All-Time High</div>
                    <div className="text-lg font-black text-amber-600 dark:text-amber-400">36.87M Khách</div>
                    <div className="text-xs text-amber-600 font-bold">¥8.14T Chi tiêu</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0F9FB] dark:bg-slate-850 border border-[#9BE7FA]/40 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                  <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isEn ? 'Core Analytical Takeaway:' : 'Góc Nhìn Phân Tích Cốt Lõi:'}
                  </span>
                  <p className="leading-relaxed">
                    {isEn
                      ? 'Inbound expenditure grew significantly faster (+481%) than visitor headcounts (+255%), proving that structural policy shifts successfully pivoted tourism from low-budget sightseeing to high-value cultural immersion.'
                      : 'Tốc độ tăng trưởng chi tiêu (+481%) vượt xa tốc độ tăng trưởng lượng khách (+255%), minh chứng chiến lược di sản đã chuyển đổi thành công cơ cấu từ du lịch "ngắm cảnh giá rẻ" sang du lịch trải nghiệm văn hóa chi tiêu cao.'}
                  </p>
                </div>
              </div>

              {/* Data Table Comparison */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    {isEn ? 'National Milestone Telemetry' : 'Cột Mốc Tăng Trưởng Toàn Quốc'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">JNTO / MLIT</span>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { year: '2003', visitors: '5.2M', spend: '1.1T ¥', gdp: '1.2%', status: 'Khởi xướng Yokoso Japan' },
                    { year: '2010', visitors: '8.6M', spend: '1.15T ¥', gdp: '1.4%', status: 'Trước Động đất Tohoku' },
                    { year: '2013', visitors: '10.4M', spend: '1.41T ¥', gdp: '1.8%', status: 'Ban hành Action Plan' },
                    { year: '2016', visitors: '24.0M', spend: '3.75T ¥', gdp: '3.9%', status: 'Bùng nổ Japan Heritage' },
                    { year: '2019', visitors: '31.9M', spend: '4.81T ¥', gdp: '5.4%', status: 'Đỉnh cao tiền đại dịch' },
                    { year: '2021', visitors: '0.2M', spend: '0.10T ¥', gdp: '0.2%', status: 'Đáy khủng hoảng Covid' },
                    { year: '2024', visitors: '36.9M', spend: '8.14T ¥', gdp: '7.3%', status: 'Kỷ lục mọi thời đại' },
                  ].map((row, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA]">{row.year}</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{row.status}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-slate-900 dark:text-white">{row.visitors}</span>
                        <span className="text-slate-400 text-[10px] ml-1.5">({row.spend})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCK 2: KHỦNG HOẢNG QUÁ TẢI (OVERTOURISM) */}
        {activeStoryBlock === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isEn ? 'DESTINATION CAPACITY CONFLICT' : 'NGHỊCH LÝ SỨC CHỨA TẠI CỐ ĐÔ'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  {isEn 
                    ? 'Overtourism Dilemma: Cultural Erosion & The Day-Tripper Trap' 
                    : 'Khủng Hoảng Quá Tải: Xói Mòn Di Sản & Bẫy Khách Đi Trong Ngày'}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'While national metrics celebrated record arrivals, Kyoto and Nara bore extreme spatial pressure. At Gion and Kiyomizu-dera, local buses experienced complete gridlock, while Nara suffered the "Day-Tripper Paradox": absorbing millions of short-stay sightseers without capturing overnight accommodation spending.'
                    : 'Khi số liệu toàn quốc đạt kỷ lục, hai cố đô Kyoto và Nara rơi vào tình trạng quá tải nghiêm trọng. Tại phố cổ Gion và chùa Thanh Thủy, hệ thống xe buýt đô thị tê liệt vì du khách. Đặc biệt tại Nara, nghịch lý "Khách đi trong ngày" khiến tỉnh gánh chịu toàn bộ chi phí dọn rác và ách tắc nhưng không thu được thuế lưu trú khách sạn.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <Landmark className="w-4 h-4" />
                      Cố Đô Kyoto (4.5M Khách Quốc Tế)
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Mật độ khách tại các điểm UNESCO vượt <strong>4.2 lần</strong> ngưỡng chịu tải lý tưởng. 78% cư dân phàn nàn về rác thải, tiếng ồn và không thể đón xe buýt đi làm.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Compass className="w-4 h-4" />
                      Cố Đô Nara (Nghịch Lý Day-Tripper)
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Lượng khách tăng <strong>7.6 lần</strong> nhưng trên <strong>85%</strong> là khách đi trong ngày từ Osaka/Kyoto. Thời gian lưu trú trung bình chỉ 3.2 giờ.
                    </p>
                  </div>
                </div>
              </div>

              {/* Structural Metric Comparison */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Activity className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  {isEn ? 'Spatial Strain Comparison' : 'Đối Sánh Áp Lực Hạ Tầng'}
                </h4>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Tỷ lệ khách lưu trú qua đêm tại Kyoto</span>
                      <span className="font-mono text-[#0D7287] dark:text-[#9BE7FA]">68.4%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#0D7287] h-full rounded-full" style={{ width: '68.4%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Tỷ lệ khách lưu trú qua đêm tại Nara</span>
                      <span className="font-mono text-amber-500">14.8% (Bẫy Day-trip)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#FFD14C] h-full rounded-full" style={{ width: '14.8%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Áp lực xe buýt đô thị vượt chuẩn</span>
                      <span className="font-mono text-rose-500">+142% giờ cao điểm</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  <strong>Khuyến nghị từ dữ liệu:</strong> Cần ban hành Thuế lưu trú linh hoạt kết hợp với hệ thống vé liên tuyến điện tử để điều hướng khách khỏi trục &ldquo;Golden Route&rdquo; (Tokyo – Kyoto – Osaka).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCK 3: CÚ SỐC COVID & MÔ HÌNH PHỤC HỒI */}
        {activeStoryBlock === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-300 text-xs font-bold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isEn ? 'COUNTERFACTUAL & MACRO SHOCK' : 'DỰ BÁO PHẢN THỰC TẾ & CÚ SỐC VĨ MÔ'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  {isEn 
                    ? 'Counterfactual Baseline: Proving The +63.4M Policy Surplus' 
                    : 'Mô Hình Phản Thực Tế: Chứng Minh Thặng Dư +63.4 Triệu Du Khách'}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'By modeling the counterfactual baseline (extending 2003–2012 historical CAGR of 5.1%), we prove that without the 2013 Policy Action Plan, Japan would have only welcomed 12.1 million tourists in 2019. The actual outcome of 31.9M demonstrates a net policy dividend of +19.8M visitors in 2019 alone.'
                    : 'Bằng việc xây dựng kịch bản phản thực tế (kéo dài tốc độ tăng trưởng tự nhiên 5.1%/năm giai đoạn 2003–2012), phân tích chỉ ra nếu không có Chương trình 2013, Nhật Bản chỉ đón 12.1 triệu khách vào năm 2019. Con số thực tế 31.9M khẳng định thặng dư chính sách đạt tới +19.8 triệu khách trong riêng năm 2019.'}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Tự nhiên (5.1%)</div>
                    <div className="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300">12.1M (2019)</div>
                    <div className="text-xs text-slate-500">Kịch bản không chính sách</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 font-mono">Thực tế (20.6%)</div>
                    <div className="text-base sm:text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">31.9M (2019)</div>
                    <div className="text-xs text-teal-600 dark:text-teal-400 font-bold">Gấp 2.6 lần dự phóng</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-amber-500 font-mono">Thặng dư tích lũy</div>
                    <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">+63.4M Lượt</div>
                    <div className="text-xs text-amber-600 font-bold">2013 – 2019</div>
                  </div>
                </div>
              </div>

              {/* V-Shape Recovery Insight Card */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <span className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  {isEn ? 'V-Shape Rebound & Weak Yen Accelerator' : 'Phục Hồi V-Shape & Hiệu Ứng Tỷ Giá Yên'}
                </span>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                    <div className="font-bold text-rose-900 dark:text-rose-200">2020 – 2021: Đáy Khủng Hoảng (-99.4%)</div>
                    <div className="text-slate-600 dark:text-slate-400 mt-0.5">Khách quốc tế rơi xuống 245 nghìn người năm 2021 do phong tỏa biên giới tuyệt đối.</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                    <div className="font-bold text-teal-900 dark:text-teal-200">2023 – 2024: Phục Hồi Thần Tốc V-Shape</div>
                    <div className="text-slate-600 dark:text-slate-400 mt-0.5">25.1M (2023) ➔ 36.9M (2024). Đạt 115.6% lượng khách đỉnh 2019 chỉ sau 24 tháng mở cửa.</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <div className="font-bold text-amber-900 dark:text-amber-200">Hiệu Ứng Đồng Yên Mất Giá (JPY Depreciation)</div>
                    <div className="text-slate-600 dark:text-slate-400 mt-0.5">Tỷ giá USD/JPY suy yếu 35% kích hoạt làn sóng &ldquo;Revenge Spending&rdquo;, đẩy chi tiêu bình quân đầu người vượt 220,000 Yên/chuyến.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCK 4: KIỂM ĐỊNH DATA & DỊ BIỆT */}
        {activeStoryBlock === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 text-xs font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{isEn ? 'STATISTICAL AUDITING & INTEGRITY' : 'KIỂM ĐỊNH DỮ LIỆU & PHÁT HIỆN SAI LỆCH'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  {isEn 
                    ? 'Unmasking The 10x Typo Anomaly & Unit Discrepancies' 
                    : 'Bóc Tách Lỗi Đánh Máy 10x & Sai Lệch Thứ Nguyên Đo Lường'}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'A core competency of a Data Analyst is refusing to take academic or municipal charts at face value. During our data audit of the original thesis graphs, two major empirical distortions were discovered, traced back to raw Japanese prefectural reporting ambiguities.'
                    : 'Phẩm chất cốt lõi của một Data Analyst là không thụ động tin tưởng đồ thị có sẵn. Quá trình kiểm định dữ liệu niên luận đã phát hiện 2 điểm dị biệt nghiêm trọng có thể làm sai lệch hoàn toàn kết luận nghiên cứu nếu không đối chiếu chéo với số liệu vĩ mô.'}
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-900 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-700 dark:text-rose-400 text-xs flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        Lỗi 1: Điểm Dị Biệt 10x tại Kyoto Năm 2020 (Biểu đồ 3.2)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-mono font-bold">CRITICAL OUTLIER</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Đồ thị gốc ghi nhận <strong>3,799 nghìn khách</strong> (3.8M). Trong khi toàn quốc chỉ đón 4.1M khách. Kyoto không thể chiếm tới 92% khách cả nước. DMO Kyoto công bố chính thức chỉ có <strong>379.9 nghìn khách</strong>. Tác giả đã gõ sót dấu chấm thập phân trong Excel.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-amber-900 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-700 dark:text-amber-400 text-xs flex items-center gap-1.5">
                        <Coins className="w-4 h-4" />
                        Lỗi 2: Nhầm Lẫn Thứ Nguyên &ldquo;Tỷ Yên&rdquo; vs &ldquo;Trăm Triệu Yên&rdquo; tại Nara (Biểu đồ 3.6)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">UNIT AMBIGUITY</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Biểu đồ 3.6 ghi 1,208 tỷ Yên cho Nara (ngang ngửa doanh thu Kyoto 1,308 tỷ Yên). Thống kê tỉnh Nara sử dụng đơn vị <strong>億円 (Trăm triệu Yên)</strong>. Doanh thu thực tế là 120.8 tỷ Yên. Việc nhầm lẫn giữa 億円 và 10億円 là lỗi dịch thuật kinh tế điển hình.
                    </p>
                  </div>
                </div>
              </div>

              {/* Audit Verification Checklist */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <span className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <FileCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  {isEn ? 'Data Cleansing Actions Taken' : 'Quy Chuẩn Làm Sạch Dữ Liệu'}
                </span>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Chuẩn Hóa Chuỗi Số Liệu Sạch (Clean Time-Series)
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Đã điều chỉnh Kyoto 2020 về 379.9k và gắn nhãn chú thích khoa học minh bạch.</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Cung Cấp Chế Độ Đối Soát &ldquo;Đồ Thị Nguyên Bản&rdquo;
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Người xem có thể chuyển đổi giữa đồ thị đã chuẩn hóa và hình chụp trang niên luận gốc.</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Cập Nhật Số Liệu Hậu Khủng Hoảng (2023 – 2025)
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Bổ sung toàn bộ dữ liệu mới nhất từ JNTO giúp dự án vượt lên trên phạm vi niên luận cũ.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCK 5: LỘ TRÌNH 4 TRỤ CỘT CHÍNH SÁCH */}
        {activeStoryBlock === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'STRATEGIC POLICY BLUEPRINT' : 'LỘ TRÌNH CHÍNH SÁCH 4 TRỤ CỘT CÓ KPI'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-tight">
                {isEn 
                  ? 'Sustainable Heritage Blueprint: Balancing High Yield with Preservation' 
                  : 'Chiến Lược Du Lịch Di Sản Bền Vững: Cân Bằng Doanh Thu & Bảo Tồn Cố Đô'}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
                {isEn
                  ? 'Based on quantitative findings, we propose a 4-pillar policy framework to relieve spatial congestion, disincentivize zero-dollar day-trippers, and redirect tourism revenue back into municipal heritage conservation.'
                  : 'Dựa trên kết quả định lượng, chúng tôi đề xuất khung chính sách 4 trụ cột nhằm giải tỏa áp lực không gian, triệt tiêu bẫy khách đi trong ngày 0 đồng và tái đầu tư nguồn thu du lịch vào quỹ bảo tồn di tích địa phương.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {[
                  {
                    step: '01',
                    title: isEn ? 'Dynamic Lodging Tax' : 'Thuế Lưu Trú Lũy Tiến',
                    kpi: 'Tăng thu 6.2 tỷ ¥/năm',
                    desc: isEn 
                      ? 'Tiered accommodation levy (¥200 to ¥1,000/night) dedicated to heritage restoration and resident subsidies.' 
                      : 'Áp dụng thuế lưu trú lũy tiến theo giá phòng. 100% nguồn thu chuyển về Quỹ Bảo tồn Di sản và trợ giá xe buýt cư dân.',
                    tag: 'Financial Sustainability'
                  },
                  {
                    step: '02',
                    title: isEn ? 'Decentralized Heritage Pass' : 'Thẻ Di Sản Phi Tập Trung',
                    kpi: 'Điều hướng 35% dòng khách',
                    desc: isEn 
                      ? 'Digital pass bundle linking Kansai UNESCO sites with secondary regional routes (Wakayama, Mie, Shiga).' 
                      : 'Phát hành vé số kết hợp tàu JR kết nối Nara/Kyoto với các vùng lân cận để giải tỏa dồn ứ trục Golden Route.',
                    tag: 'Spatial Routing'
                  },
                  {
                    step: '03',
                    title: isEn ? 'AI Smart Bus Dispatch' : 'Điều Hướng Xe Buýt Thông Minh',
                    kpi: 'Giảm 42% kẹt xe Gion',
                    desc: isEn 
                      ? 'AI-managed tourist express buses bypassing residential commuting routes during peak cherry blossom hours.' 
                      : 'Tách biệt hoàn toàn tuyến xe buýt ngắm cảnh và xe buýt dân sinh trong mùa cao điểm hoa anh đào/lá đỏ.',
                    tag: 'Infrastructure Relieve'
                  },
                  {
                    step: '04',
                    title: isEn ? 'Luxury Immersion Stays' : 'Chuỗi Lưu Trú Bản Địa Cao Cấp',
                    kpi: 'Tăng lưu trú Nara lên 30%',
                    desc: isEn 
                      ? 'High-end ryokan and boutique hotel zoning in Nara to capture overnight stays instead of 3-hour day-trips.' 
                      : 'Quy hoạch khu nghỉ dưỡng cao cấp tại Nara nhằm giữ chân du khách qua đêm, nâng mức chi tiêu lên gấp 3.5 lần.',
                    tag: 'Economic Density'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs font-black text-[#0D7287] dark:text-[#9BE7FA]">{item.step}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">{item.tag}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-950 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Mục tiêu định lượng:</div>
                      <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{item.kpi}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to action buttons to deep dive */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onJumpToSection && onJumpToSection('chuong-3')}
                  className="px-5 py-2.5 rounded-xl bg-[#0D7287] hover:bg-[#095262] text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{isEn ? 'Explore Chapter 3 Data & Charts' : 'Xem Dữ Liệu & Biểu Đồ Chi Tiết (Chương 3)'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onJumpToSection && onJumpToSection('kiem-dinh-du-lieu')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{isEn ? 'View Raw Thesis Artifact Audit' : 'Xem Bằng Chứng Kiểm Định Học Thuật'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
