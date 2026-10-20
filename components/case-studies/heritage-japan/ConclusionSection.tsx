'use client';

import SectionHeader from '@/components/ui/SectionHeader';

import { useLanguage } from '@/app/context/LanguageContext';

export interface ConclusionSectionProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

export function ConclusionSection({ 
  isEn: propIsEn, 
  onCopyDeepLink = () => {} 
}: ConclusionSectionProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  return (
    <>
      <section id="ket-luan" className="py-16 bg-ground border-slate-200/80 dark:bg-[#0B0F17] dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            variant="stacked"
            id="ket-luan"
            badge={isEn ? 'Part III • Synthesis & Policy Implications' : 'Phần Kết Luận • Tổng kết & Hàm ý chính sách'}
            title={isEn ? 'Synthesis & Key Takeaways for Sustainable Heritage Tourism' : 'Kết luận & Bài học kinh nghiệm từ Nhật Bản'}
            onCopy={onCopyDeepLink}
          />

          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
            <p>
              Du lịch di sản phát triển nhờ <strong>Luật Bảo vệ Di sản Văn hóa</strong> và <strong>Chương trình hành động 2013</strong>.
            </p>

            {/* 4 Key Policy Lessons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#9BE7FA] text-slate-950 font-black text-sm mb-3">1</span>
                <h4 className="font-black text-slate-900 text-base mb-1 dark:text-white">Chuyển dịch sang bảo tồn động</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Chuyển từ bảo tồn khép kín sang kết hợp phát huy giá trị kinh tế.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FFD14C] text-slate-950 font-black text-sm mb-3">2</span>
                <h4 className="font-black text-slate-900 text-base mb-1 dark:text-white">Ứng dụng công nghệ quản trị thông minh</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Dùng camera AI, đặt vé trước và công nghệ VR để chủ động điều tiết du khách.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#C8EEF7] text-[#0D7287] font-black text-sm mb-3">3</span>
                <h4 className="font-black text-slate-900 text-base mb-1 dark:text-white">Đa dạng hóa công cụ tài chính</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Thuế vào đảo, quỹ bảo tồn và thuế lưu trú tạo ngân sách tái đầu tư, trùng tu.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FFE485] text-slate-950 font-black text-sm mb-3">4</span>
                <h4 className="font-black text-slate-900 text-base mb-1 dark:text-white">Đặt cư dân bản địa làm trung tâm</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Không đánh đổi bình yên của người dân lấy tăng trưởng du lịch. Ban hành chế tài bảo vệ.
                </p>
              </div>
            </div>

            <p className="text-sm italic text-slate-600 border-l-4 border-[#0D7287] pl-4 py-1 dark:text-slate-400 dark:border-[#9BE7FA]">
              &quot;Phát triển bền vững là tôn trọng lịch sử, nâng cao phúc lợi và bảo vệ môi trường.&quot; - Ma Văn Hùng.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default ConclusionSection;
