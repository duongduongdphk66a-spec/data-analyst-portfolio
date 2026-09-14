import React from 'react';
import { Target, Search, BarChart2, Users, AlertTriangle, PlayCircle } from 'lucide-react';

interface CreatorAnalysisNarrativeProps {
  isEn: boolean;
}

export default function CreatorAnalysisNarrative({ isEn }: CreatorAnalysisNarrativeProps) {
  return (
    <div className="space-y-8 mt-12 pt-12 border-t border-slate-200 dark:border-slate-800">
      <div className="space-y-3">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          {isEn ? 'Official Creator Analysis & Strategy' : 'Phân Tích Kênh Chính Chủ & Chiến Lược'}
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          {isEn 
            ? 'Key insights and recommendations derived from analyzing the main @kamielyhn TikTok channel.' 
            : 'Phân tích hiệu suất nội dung số và định hướng chiến lược cho kênh @kamielyhn (Official Anchor Host).'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
            {isEn ? '1. Key Findings' : '1. Phân Tích Hiện Trạng'}
          </h4>
          
          <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex gap-3">
              <BarChart2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">
                  {isEn ? 'Scale & Revenue Contribution:' : 'Quy Mô & Tỷ Trọng Doanh Thu:'}
                </strong>
                {isEn 
                  ? '@kamielyhn generated 9.2B VND overall. Although the store has 5.7k affiliates, the main account single-handedly accounts for 49.3% of total revenue. A heavy dependency.'
                  : '@kamielyhn tạo ra 9.2 tỷ VNĐ doanh thu. Dù shop có đến 5.7k affiliates, kênh chính chủ vẫn "gánh" 49.3% tổng GMV toàn shop, cho thấy sự phụ thuộc cực lớn.'}
              </div>
            </li>
            
            <li className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">
                  {isEn ? 'The Conversion Paradox:' : 'Nghịch Lý Tỷ Lệ Chuyển Đổi:'}
                </strong>
                {isEn 
                  ? 'Video conversion rate is 0.77% vs Live conversion rate of 0.32%. Despite Live driving more total volume, Video is 2.4x more efficient at converting viewers to buyers.'
                  : 'Tỷ lệ chuyển đổi Video (0.77%) cao gấp 2.4 lần so với Live (0.32%). Nhưng nguồn lực lại đang dồn hết vào Live.'}
              </div>
            </li>

            <li className="flex gap-3">
              <PlayCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">
                  {isEn ? 'Single-Session Live Funnel:' : 'Phễu Phiên Live Điển Hình:'}
                </strong>
                {isEn 
                  ? 'High traffic but severe drop-offs at checkout. Only ~3 out of 1000 viewers complete a purchase per session.'
                  : 'Traffic đầu vào cao nhưng tụt phễu nghiêm trọng ở bước thanh toán. Trung bình 1 phiên live: Cứ 1000 người xem mới có ~3 người mua thành công.'}
              </div>
            </li>

            <li className="flex gap-3">
              <Users className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">
                  {isEn ? 'Audience Demographics:' : 'Nhân Khẩu Học & Brand Target:'}
                </strong>
                {isEn 
                  ? 'Followers are highly concentrated in the GenZ and young Millennial female demographic. Matches fast-fashion trends but highly vulnerable to seasonality.'
                  : 'Tập người theo dõi chủ yếu là nữ GenZ và Millennials trẻ. Rất khớp với mặt hàng thời trang nhanh nhưng vòng đời ngắn và dễ bị ảnh hưởng bởi mùa du lịch.'}
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-[#F0FBFE] to-[#C8EEF7]/40 dark:from-slate-900 dark:to-slate-800/80 rounded-3xl p-6 sm:p-8 border-2 border-[#0D7287] dark:border-[#9BE7FA] shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <Target className="w-6 h-6 text-[#0D7287] dark:text-[#9BE7FA]" />
              {isEn ? '2. Strategic Recommendations (Official Channel)' : '2. Đề xuất Strategy Kênh Chính Chủ'}
            </h4>
            
            <div className="space-y-5">
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0D7287]/10 dark:bg-[#9BE7FA]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-black text-[#0D7287] dark:text-[#9BE7FA]">1</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block text-sm">
                      {isEn ? 'Cap Livestream Duration:' : 'Giới Hạn Thời Lượng Livestream:'}
                    </strong>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1">
                      {isEn 
                        ? 'Based on the saturation model, strictly cap livestream sessions to 3.1 hours. Going beyond this point leads to diminishing returns and burns out the host.'
                        : 'Dựa trên mô hình bão hòa dữ liệu (đã phân tích ở mục Khoa học dữ liệu), cần giới hạn cứng thời lượng live ở mức 3.1h/phiên. Live lâu hơn chỉ bào mòn thể lực Host mà không tăng thêm GMV.'}
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
                      {isEn ? 'Shift Focus to Shoppable Videos:' : 'Chuyển Trọng Tâm Sang Shoppable Video:'}
                    </strong>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1">
                      {isEn 
                        ? 'Reallocate the saved hours from Livestreaming to mass-produce short shoppable videos. Ensure 100% of published videos have product links attached.'
                        : 'Lấy thời gian dư thừa từ việc cắt giảm Livestream để tập trung sản xuất Video ngắn. Đảm bảo tỷ lệ 100% video xuất bản đều có đính kèm giỏ hàng.'}
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
                      {isEn ? 'Fix the Live Checkout Drop-off:' : 'Vá Lỗ Hổng Phễu Livestream:'}
                    </strong>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1">
                      {isEn 
                        ? 'Implement flash-sale timers and limited-stock overlays on the Livestream screen to create urgency and fix the add-to-cart -> checkout drop-off.'
                        : 'Sử dụng Flash-sale timer và Gim sản phẩm có số lượng giới hạn để tạo FOMO chốt đơn ngay trên Live, giảm tỷ lệ rớt từ bước thêm vào giỏ hàng đến thanh toán.'}
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
