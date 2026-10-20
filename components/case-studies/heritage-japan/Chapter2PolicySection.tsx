'use client';

import React from 'react';
import { Compass, Sparkles, TrendingUp, Camera, Users, ShieldCheck } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

import { useLanguage } from '@/app/context/LanguageContext';

export interface Chapter2PolicySectionProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

export function Chapter2PolicySection({ 
  isEn: propIsEn, 
  onCopyDeepLink = () => {} 
}: Chapter2PolicySectionProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  return (
    <section id="chuong-2" className="py-16 bg-ground border-slate-200/80 dark:bg-[#0B0F17] dark:border-slate-800">
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
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-3 flex items-center gap-2 dark:text-white">
              <Compass className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span>2.1. &quot;Chương trình hành động hướng tới quốc gia du lịch&quot; (2013)</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-700 mb-6 dark:text-slate-300">
              Tháng 6/2013, Nhật Bản ban hành chiến lược phát triển du lịch quốc gia với 4 biện pháp trọng tâm:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-ground border border-slate-200/80 shadow-xs dark:bg-slate-800/70 dark:border-slate-700/80">
                <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA]">
                  <Sparkles className="w-4 h-4" />
                  <span>2.1.1 Quảng bá &quot;Thương hiệu Nhật Bản&quot; (日本ブランド)</span>
                </h4>
                <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                  Định vị điểm đến an toàn qua chiến lược 'Cool Japan', kết hợp ẩm thực Washoku và văn hóa Omotenashi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-ground border border-slate-200/80 shadow-xs dark:bg-slate-800/70 dark:border-slate-700/80">
                <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA]">
                  <TrendingUp className="w-4 h-4" />
                  <span>2.1.2 Nới lỏng Visa, Hàng không LCC & Miễn thuế</span>
                </h4>
                <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                  Miễn visa ngắn hạn khối ASEAN, mở rộng đường bay LCC và chính sách miễn thuế tại điểm du lịch.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-ground border border-slate-200/80 shadow-xs dark:bg-slate-800/70 dark:border-slate-700/80">
                <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA]">
                  <Camera className="w-4 h-4" />
                  <span>2.1.3 Hạ tầng đa ngôn ngữ, Wi-Fi & Cashless</span>
                </h4>
                <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                  Phủ sóng Wi-Fi miễn phí, chuẩn hóa biển chỉ dẫn đa ngôn ngữ và thúc đẩy thanh toán không tiền mặt.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-ground border border-slate-200/80 shadow-xs dark:bg-slate-800/70 dark:border-slate-700/80">
                <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2 text-[#0D7287] dark:text-[#9BE7FA]">
                  <Users className="w-4 h-4" />
                  <span>2.1.4 Phát triển Du lịch MICE & Hội nghị Quốc tế</span>
                </h4>
                <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                  Hướng đến trung tâm hội nghị quốc tế châu Á, kết hợp sự kiện lớn với trải nghiệm di sản.
                </p>
              </div>
            </div>
          </div>

          {/* 2.2 Chính sách bảo tồn di sản & Luật 1950/2004 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-3 flex items-center gap-2 dark:text-white">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>2.2. Khung pháp lý: Luật Bảo vệ Di sản Văn hóa (1950 & Sửa đổi 2004)</span>
            </h3>
            
            <div className="space-y-4 text-sm sm:text-base">
              <p>
                <strong>Lịch sử (1950):</strong> Vụ cháy Chùa Horyuji (1949) thúc đẩy ra đời <strong>Luật Bảo vệ Di sản Văn hóa</strong>.
              </p>
              
              <p>
                <strong>Sửa đổi 2004:</strong> Để phù hợp tốc độ đô thị hóa, luật thiết lập <strong>4 chế độ bảo tồn then chốt</strong>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-lg bg-ground border border-slate-200/80 dark:bg-slate-850 dark:border-slate-700/80">
                  <strong className="text-slate-900 block font-bold mb-1 dark:text-white">1. Di sản văn hóa vật thể:</strong>
                  Phân hạng 'Tài sản quan trọng' và 'Bảo vật quốc gia'. Cục Văn hóa duyệt mọi hoạt động trùng tu.
                </div>
                <div className="p-3.5 rounded-lg bg-ground border border-slate-200/80 dark:bg-slate-850 dark:border-slate-700/80">
                  <strong className="text-slate-900 block font-bold mb-1 dark:text-white">2. Di tích, Danh thắng & Đài kỷ niệm:</strong>
                  Bảo vệ địa điểm khảo cổ, hoa viên cổ và hệ sinh vật đặc hữu theo vùng đệm bảo tồn.
                </div>
                <div className="p-3.5 rounded-lg bg-ground border border-slate-200/80 dark:bg-slate-850 dark:border-slate-700/80">
                  <strong className="text-[#0D7287] block font-bold mb-1 dark:text-[#9BE7FA]">3. Cảnh quan văn hóa (文化的景観):</strong>
                  Bảo vệ cảnh quan hình thành từ tương tác giữa con người và tự nhiên (như ruộng bậc thang, làng chài).
                </div>
                <div className="p-3.5 rounded-lg bg-ground border border-slate-200/80 dark:bg-slate-850 dark:border-slate-700/80">
                  <strong className="text-slate-900 block font-bold mb-1 dark:text-white">4. Quần thể công trình kiến trúc:</strong>
                  Bảo tồn toàn bộ diện mạo đô thị cổ (làng Shirakawa-go, phố cổ Gion, phố Samurai Kakunodate).
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
              Năm 2015, khởi xướng <strong>&quot;Japan Heritage&quot;</strong>. Dùng phương pháp <em>Kể chuyện</em> (Storytelling) biến di sản thành tài nguyên du lịch và giáo dục.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Chapter2PolicySection;
