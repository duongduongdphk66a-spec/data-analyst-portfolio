import React from 'react';
import { TrendingDown, PieChart, Tag, Users, ShoppingCart, Lightbulb } from 'lucide-react';

interface ShopAnalysisNarrativeProps {
  isEn: boolean;
}

export default function ShopAnalysisNarrative({ isEn }: ShopAnalysisNarrativeProps) {
  return (
    <div className="space-y-8 mt-12 pt-12 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-3">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          {isEn ? 'Store-Level Analysis & Strategy' : 'Phân Tích Quy Mô Toàn Shop & Chiến Lược'}
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          {isEn 
            ? 'Key insights and recommendations derived from analyzing the entire ecosystem of Kami Ely TikTok Shop.' 
            : 'Các phát hiện chính và định hướng chiến lược từ dữ liệu toàn bộ hệ sinh thái của Kami Ely TikTok Shop.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
            {isEn ? '1. Key Findings' : '1. Điểm Khám Phá Chính'}
          </h4>
          
          <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex gap-3">
              <TrendingDown className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">
                  {isEn ? '180-Day Time-Series:' : 'Chuỗi thời gian 180 Ngày:'}
                </strong>
                {isEn 
                  ? 'GMV peaked in July, sharply declining in Aug-Sep. Hypothesis points to summer travel seasonality shifting user attention away from TikTok.'
                  : 'GMV đạt đỉnh vào tháng 7, giảm sâu trong tháng 8 và 9. Giả thuyết chính là do tính mùa vụ, tập tệp khách hàng GenZ/Millennials dành thời gian du lịch hè thay vì lướt TikTok.'}
              </div>
            </li>
            
            <li className="flex gap-3">
              <PieChart className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">
                  {isEn ? 'Channel Attribution Paradox:' : 'Phân bổ Kênh (Channel Attribution):'}
                </strong>
                {isEn 
                  ? 'Live accounts for 68.6% of GMV but requires massive resource allocation. Shoppable Video (26.3% GMV) achieves much higher ROI and operates semi-passively.'
                  : 'Kênh Live chiếm tỷ trọng lớn nhất (68.6% GMV) nhưng đòi hỏi phân bổ nguồn lực (nhân sự, thời gian) khổng lồ. Shoppable Video (26.3% GMV) đạt ROI cao hơn và mang tính thụ động.'}
              </div>
            </li>

            <li className="flex gap-3">
              <Tag className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">
                  {isEn ? 'Category & Pricing Structure:' : 'Cơ cấu Ngành hàng & Giá (Pricing):'}
                </strong>
                {isEn 
                  ? 'Top sales come from 100k - 200k VND items (impulse buy zone). Higher priced items (>300k VND) lack trust elements on standard product cards.'
                  : 'Thắng lớn ở phân khúc 100k - 200k VNĐ (vùng giá mua ngẫu hứng). Các sản phẩm giá cao (>300k VNĐ) khó chuyển đổi do thiếu yếu tố xây dựng lòng tin trên thẻ sản phẩm (Product Card).'}
              </div>
            </li>

            <li className="flex gap-3">
              <Users className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">
                  {isEn ? 'Affiliate KOC Efficiency:' : 'Đóng góp mạng lưới Affiliate KOC:'}
                </strong>
                {isEn 
                  ? '5,7k Affiliates act as the primary traffic engine. Over 95% of sales come from Nano and Micro influencers, indicating a highly decentralized and organic reach model.'
                  : 'Sở hữu mạng lưới khổng lồ 5,7k Affiliate đóng vai trò như động cơ traffic. Đáng chú ý, >95% doanh số đến từ Nano và Micro influencers, cho thấy sự phi tập trung và viral tự nhiên.'}
              </div>
            </li>

            <li className="flex gap-3">
              <ShoppingCart className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">
                  {isEn ? 'Product Card Funnel:' : 'Product Card Funnel (Cửa hàng):'}
                </strong>
                {isEn 
                  ? 'The "Shop Tab" (Product Cards) has an unexpectedly low conversion rate, highlighting severe UI/UX or trust issues preventing passive purchases.'
                  : 'Tỷ lệ chuyển đổi từ việc khách hàng tự lướt thẻ sản phẩm (Shop Tab) thấp bất ngờ. Chỉ ra điểm nghẽn ở việc tối ưu hiển thị (UI/UX) và thông tin kích thích mua thụ động.'}
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-[#F0FBFE] to-[#C8EEF7]/40 dark:from-slate-900 dark:to-slate-800/80 rounded-3xl p-6 sm:p-8 border-2 border-[#0D7287] dark:border-[#9BE7FA] shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <Lightbulb className="w-6 h-6 text-[#0D7287] dark:text-[#9BE7FA]" />
              {isEn ? '2. Strategic Recommendations (Store Level)' : '2. Đề xuất Strategy Cấp độ Toàn Shop'}
            </h4>
            
            <div className="space-y-5">
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0D7287]/10 dark:bg-[#9BE7FA]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-black text-[#0D7287] dark:text-[#9BE7FA]">1</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block text-sm">
                      {isEn ? 'Restructure Product Mix (High vs Low Ticket):' : 'Tái Cấu Trúc Product Mix (Phân Khúc Giá):'}
                    </strong>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1">
                      {isEn 
                        ? 'Double down on the 100k-200k VND segment for mass-market affiliate campaigns. Reposition >300k items exclusively for high-trust Livestreams or Macro KOC reviews.'
                        : 'Dồn tổng lực đẩy các sản phẩm phễu 100k-200k VNĐ cho chiến dịch Affiliate số lượng lớn. Dịch chuyển các mặt hàng >300k VNĐ sang kênh Livestream trực tiếp hoặc KOC Review sâu để xây dựng Trust.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0D7287]/10 dark:bg-[#9BE7FA]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-black text-[#0D7287] dark:text-[#9BE7FA]">2</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block text-sm">
                      {isEn ? 'Optimize the "Shop Tab" Passive Engine:' : 'Tối ưu Hóa "Cỗ Máy Thụ Động" (Product Card):'}
                    </strong>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1">
                      {isEn 
                        ? 'Redesign product thumbnails, add trust badges, and utilize text-overlay images to fix the drop-off in passive product card clicks.'
                        : 'Cải tổ hàng loạt Thumbnail sản phẩm, thêm nhãn dán uy tín (Trust Badges), hình ảnh có text overlay để sửa lỗi tụt phễu khi khách hàng tự lướt Shop.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0D7287]/10 dark:bg-[#9BE7FA]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-black text-[#0D7287] dark:text-[#9BE7FA]">3</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block text-sm">
                      {isEn ? 'Nano/Micro KOC Gamification:' : 'Gamification Mạng Lưới Nano/Micro KOC:'}
                    </strong>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1">
                      {isEn 
                        ? 'Since 95% of affiliate GMV is long-tail, implement a tiered commission system or monthly challenges to motivate this decentralized network.'
                        : 'Vì 95% GMV đến từ đuôi dài, cần thiết lập hệ thống hoa hồng theo bậc (Tiered Commission) hoặc Challenge hàng tháng để kích thích toàn bộ mạng lưới phân tán này.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
