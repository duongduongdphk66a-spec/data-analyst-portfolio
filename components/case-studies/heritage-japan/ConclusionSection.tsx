'use client';

import React from 'react';
import { THESIS_METADATA } from '@/app/data/heritageJapanData';
import SectionHeader from '@/components/ui/SectionHeader';

interface ConclusionSectionProps {
  isEn: boolean;
  onCopyDeepLink: (_sectionId: string, _title?: string) => void;
}

export function ConclusionSection({ isEn, onCopyDeepLink }: ConclusionSectionProps) {
  return (
    <>
      <section id="ket-luan" className="py-16 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
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
              Qua toàn bộ khảo sát định lượng và nghiên cứu chính sách từ năm 2013 đến nay, bài niên luận đã khẳng định rằng du lịch di sản tại Nhật Bản đã có sự phát triển vượt bậc cả về quy mô lượng khách, doanh thu và tỷ trọng đóng góp vào nền kinh tế quốc gia. Sự thành công này được xây dựng trên nền tảng vững chắc của <strong>Luật Bảo vệ Di sản Văn hóa (1950 & sửa đổi 2004)</strong> cùng sự vào cuộc quyết liệt, đồng bộ của chính phủ qua <strong>Chương trình hành động hướng tới quốc gia du lịch (2013)</strong>.
            </p>

            {/* 4 Key Policy Lessons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#9BE7FA] text-slate-950 font-black text-sm mb-3">01</span>
                <h4 className="font-black text-slate-900 text-base mb-1 dark:text-white">Chuyển dịch sang bảo tồn động</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Từ bỏ tư duy bảo tồn khép kín trong bảo tàng sang mô hình kết hợp bảo tồn với phát huy giá trị di sản (tiêu biểu là đề án Japan Heritage), biến di sản thành tài sản phát triển kinh tế sinh lời cho xã hội.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FFD14C] text-slate-950 font-black text-sm mb-3">02</span>
                <h4 className="font-black text-slate-900 text-base mb-1 dark:text-white">Ứng dụng công nghệ quản trị thông minh</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Sử dụng bản đồ trực tiếp camera AI mật độ (Kyoto Comfort Map), hệ thống đặt chỗ trước bắt buộc (Shirakawa-go) và công nghệ thực tế ảo VR (Núi Phú Sĩ) để chủ động điều tiết dòng du khách.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#C8EEF7] text-[#0D7287] font-black text-sm mb-3">03</span>
                <h4 className="font-black text-slate-900 text-base mb-1 dark:text-white">Đa dạng hóa công cụ tài chính</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Linh hoạt áp dụng thuế du khách vào đảo (Miyajima), quỹ bảo tồn tự nguyện (Núi Phú Sĩ) và thuế lưu trú để tạo nguồn ngân sách bền vững tái đầu tư cho công tác trùng tu và dọn dẹp vệ sinh.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FFE485] text-slate-950 font-black text-sm mb-3">04</span>
                <h4 className="font-black text-slate-900 text-base mb-1 dark:text-white">Đặt cư dân bản địa làm trung tâm</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                  Không đánh đổi cuộc sống bình yên của người dân lấy tăng trưởng du lịch nóng. Khi có xung đột lợi ích, các chính quyền địa phương lập tức ban hành chế tài quản lý lưu trú và giải tỏa giao thông dân sinh.
                </p>
              </div>
            </div>

            <p className="text-sm italic text-slate-600 border-l-4 border-[#0D7287] pl-4 py-1 dark:text-slate-400 dark:border-[#9BE7FA]">
              &quot;Du lịch di sản chỉ có thể phát triển bền vững khi và chỉ khi nó tôn trọng tính nguyên bản của lịch sử, nâng cao phúc lợi kinh tế cho cộng đồng sở tại và bảo toàn trọn vẹn cảnh quan môi trường cho muôn đời sau.&quot; - Ma Văn Hùng (2024).
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-slate-900 text-slate-400 border-t border-slate-800 text-xs text-center">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="text-slate-300 font-bold text-sm">
            {THESIS_METADATA.universityVi} • {THESIS_METADATA.facultyVi}
          </p>
          <p>
            Đề tài niên luận: <em>&quot;{THESIS_METADATA.titleVi}&quot;</em> • Tác giả: {THESIS_METADATA.author} ({THESIS_METADATA.cohort}) • GVHD: {THESIS_METADATA.advisor}
          </p>
          <p className="text-slate-500 pt-2 border-t border-slate-800">
            Dữ liệu trực quan hóa học thuật và chuyển giao công nghệ phân tích dữ liệu du lịch bền vững.
          </p>
        </div>
      </footer>
    </>
  );
}
