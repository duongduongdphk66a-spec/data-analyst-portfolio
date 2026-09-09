'use client';

import React from 'react';
import { Compass, Sparkles, TrendingUp, Camera, Users, ShieldCheck } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

interface Chapter2PolicySectionProps {
  isEn: boolean;
  onCopyDeepLink: (_sectionId: string, _title?: string) => void;
}

export function Chapter2PolicySection({ isEn, onCopyDeepLink }: Chapter2PolicySectionProps) {
  return (
    <section id="chuong-2" className="py-16 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          variant="stacked"
          id="chuong-2"
          badge={isEn ? 'Chapter 2 • Governance & Policy Matrix' : 'Chương 2 • Thể chế & Hệ thống chính sách'}
          title={isEn ? "Japan's Strategic Policy on Heritage Tourism" : 'Chính sách của Nhật Bản về Du lịch Di sản'}
          onCopy={onCopyDeepLink}
        />

        <div className="space-y-8 text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
          {/* 2.1 Chính sách trong Chương trình hành động 2013 */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs dark:bg-slate-950 dark:border-slate-800">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-3 flex items-center gap-2 dark:text-white">
              <Compass className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span>2.1. &quot;Chương trình hành động hướng tới quốc gia du lịch&quot; (2013)</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-700 mb-6 dark:text-slate-300">
              Tháng 6 năm 2013, Thủ tướng Shinzo Abe chủ trì Hội nghị Bộ trưởng ban hành văn kiện chiến lược quốc gia mang tên <em>&quot;Chương trình hành động hướng tới quốc gia du lịch&quot;</em> (観光立国実現に向けたアクション・プログラム). Đây là bước đột phá toàn diện với 4 nhóm biện pháp trọng tâm:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA]">
                  <Sparkles className="w-4 h-4" />
                  <span>2.1.1 Quảng bá &quot;Thương hiệu Nhật Bản&quot; (日本ブランド)</span>
                </h4>
                <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                  Xây dựng thương hiệu quốc gia thông qua chiến lược <em>&quot;Cool Japan&quot;</em>, kết hợp quảng bá ẩm thực truyền thống Washoku (được UNESCO công nhận 2013) và văn hóa Omotenashi (sự hiếu khách tận tụy). Tận dụng truyền thông số và JNTO tại 22 quốc gia để định vị Nhật Bản là điểm đến di sản an toàn, tinh tế.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>2.1.2 Nới lỏng Visa, Hàng không LCC & Miễn thuế</span>
                </h4>
                <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                  Miễn thị thực nhập cảnh ngắn hạn cho các nước ASEAN (Thái Lan, Malaysia...) và cấp visa nhiều lần cho Trung Quốc; mở rộng slot bay tại Haneda/Narita và cấp phép cho các hãng hàng không giá rẻ LCC; mở rộng chính sách hoàn thuế tiêu thụ (Tax-free Shopping) áp dụng cho cả thực phẩm, mỹ phẩm tại các phố cổ.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA]">
                  <Camera className="w-4 h-4" />
                  <span>2.1.3 Hạ tầng đa ngôn ngữ, Wi-Fi & Cashless</span>
                </h4>
                <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                  Phổ cập mạng lưới <em>&quot;Japan Connected-free Wi-Fi&quot;</em> tại tất cả các đền chùa và nhà ga; chuẩn hóa biển chỉ dẫn giao thông 4 thứ tiếng (Nhật, Anh, Trung, Hàn); khuyến khích lắp đặt máy quẹt thẻ tín dụng và thanh toán quét mã QR nhằm tháo gỡ rào cản tiền mặt cố hữu.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA]">
                  <Users className="w-4 h-4" />
                  <span>2.1.4 Phát triển Du lịch MICE & Hội nghị Quốc tế</span>
                </h4>
                <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                  Đưa Nhật Bản trở thành trung tâm tổ chức hội nghị quốc tế số 1 châu Á; tổ chức các sự kiện tầm cỡ như Hội nghị Văn hóa Du lịch Thế giới UNWTO/UNESCO lần thứ 4 tại Kyoto (2019), kết hợp chiêu đãi và trải nghiệm di sản văn hóa truyền thống cho quan khách cấp cao.
                </p>
              </div>
            </div>
          </div>

          {/* 2.2 Chính sách bảo tồn di sản & Luật 1950/2004 */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs dark:bg-slate-950 dark:border-slate-800">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-3 flex items-center gap-2 dark:text-white">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>2.2. Khung pháp lý: Luật Bảo vệ Di sản Văn hóa (1950 & Sửa đổi 2004)</span>
            </h3>
            
            <div className="space-y-4 text-sm sm:text-base">
              <p>
                <strong>Nguồn gốc lịch sử (1950):</strong> Ngày 26/1/1949, một vụ hỏa hoạn nghiêm trọng đã thiêu rụi tòa Kim Đường (Kondo) của Chùa Horyuji cùng 12 bức bích họa cổ vô giá thế kỷ thứ 7. Thảm họa này đã thúc đẩy Quốc hội Nhật Bản ban hành <strong>Luật Bảo vệ Di sản Văn hóa</strong> vào ngày 30/5/1950. Kể từ đó, ngày 26 tháng 1 hàng năm được ấn định là <em>&quot;Ngày Phòng chống Cháy nổ Di sản Văn hóa&quot;</em> trên toàn quốc.
              </p>
              
              <p>
                <strong>Luật sửa đổi năm 2004 (Cải cách toàn diện):</strong> Nhận thấy mô hình bảo tồn đơn lẻ không còn theo kịp thực tiễn đô thị hóa, bản sửa đổi năm 2004 đã thiết lập <strong>4 chế độ bảo tồn then chốt</strong>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                  <strong className="text-slate-900 block font-bold mb-1 dark:text-white">1. Di sản văn hóa vật thể:</strong>
                  Quy định phân hạng nghiêm ngặt thành <em>&quot;Tài sản văn hóa quan trọng&quot;</em> và <em>&quot;Bảo vật quốc gia&quot;</em> (Kokuho). Mọi hoạt động can thiệp trùng tu phải được Cục Văn hóa phê duyệt.
                </div>
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                  <strong className="text-slate-900 block font-bold mb-1 dark:text-white">2. Di tích, Danh thắng & Đài kỷ niệm thiên nhiên:</strong>
                  Bảo vệ các địa điểm khảo cổ, hoa viên cổ và hệ sinh vật đặc hữu theo ranh giới vùng đệm bảo tồn.
                </div>
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                  <strong className="text-[#0D7287] block font-bold mb-1 dark:text-[#9BE7FA]">3. Cảnh quan văn hóa (文化的景観):</strong>
                  <em>(Điểm bổ sung đột phá năm 2004)</em>. Lần đầu tiên công nhận giá trị của cảnh quan được hình thành từ mối tương tác hài hòa giữa con người và tự nhiên (như ruộng bậc thang, làng chài, rừng bách).
                </div>
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                  <strong className="text-slate-900 block font-bold mb-1 dark:text-white">4. Quần thể công trình kiến trúc truyền thống:</strong>
                  Bảo tồn toàn bộ diện mạo đô thị cổ (như làng Gassho-zukuri Shirakawa-go, phố cổ Gion Kyoto, phố Samurai Kakunodate).
                </div>
              </div>
            </div>
          </div>

          {/* 2.3 Chuyển dịch tư duy: Dự án Japan Heritage 2015 */}
          <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60">
            <h3 className="text-lg sm:text-xl font-black text-amber-900 mb-2 flex items-center gap-2 dark:text-amber-300">
              <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <span>2.3. Chuyển dịch tư duy: Dự án &quot;Japan Heritage&quot; (日本遺産) năm 2015</span>
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200">
              Nếu như trước đây, quan điểm của Nhật Bản là <strong>&quot;Bảo tồn thụ động&quot;</strong> (đóng khung di sản trong tủ kính, hạn chế du khách), thì từ năm 2015, Cục Văn hóa (Agency for Cultural Affairs) đã khởi xướng đề án <strong>&quot;Japan Heritage&quot; (Di sản Nhật Bản)</strong>. Điểm mấu chốt của đề án là phương pháp <em>Kể chuyện (Storytelling)</em>: kết nối các di tích vật thể và phi vật thể rời rạc thành một câu chuyện văn hóa mạch lạc, biến di sản thành tài nguyên sống động phục vụ du khách và giáo dục thế hệ tương lai.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
