'use client';

import React from 'react';
import { Compass, Info, Award, Layers } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

interface IntroductionSectionProps {
  isEn: boolean;
  onCopyDeepLink: (_sectionId: string, _title?: string) => void;
}

export function IntroductionSection({ isEn, onCopyDeepLink }: IntroductionSectionProps) {
  return (
    <section id="mo-dau" className="py-16 bg-[#FAFDFE] border-b border-slate-200/80 dark:bg-[#0B0F17] dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <SectionHeader
          variant="stacked"
          id="mo-dau"
          badge={isEn ? 'Part I • Introduction' : 'Phần Mở Đầu • Đề cương nghiên cứu'}
          title={isEn ? 'Research Rationale & Methodological Framework' : 'Lý do, Mục tiêu & Phương pháp nghiên cứu'}
          onCopy={onCopyDeepLink}
        />

        <div className="space-y-8 text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
          {/* 1. Lý do nghiên cứu */}
          <div className="space-y-3">
            <h3 className="text-xl font-black text-slate-950 flex items-center gap-2 dark:text-white">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#9BE7FA]/60 text-[#074553] font-black text-sm dark:bg-slate-800 dark:text-[#9BE7FA]">1</span>
              <span>{isEn ? '1. Research Rationale' : '1. Lý do nghiên cứu'}</span>
            </h3>
            <p>
              Bước vào thế kỷ 21, du lịch di sản (Heritage Tourism) đã vươn lên thành một trong những phân khúc phát triển bùng nổ nhất của ngành du lịch toàn cầu, chiếm hơn 40% lượng du khách quốc tế theo số liệu của Tổ chức Du lịch Thế giới. Đối với Nhật Bản, sau giai đoạn trì trệ kinh tế kéo dài cùng biến cố động đất sóng thần năm 2011, chính phủ đã xác định du lịch là trụ cột kinh tế chiến lược nhằm hồi sinh các vùng địa phương và nâng cao vị thế quốc gia.
            </p>
            <p>
              Mốc năm <strong>2013</strong> mang tính bước ngoặt lịch sử: Chính phủ Nhật Bản ban hành <em>"Chương trình hành động hướng tới quốc gia du lịch"</em> (観光立国実現に向けたアクション・プログラム), đồng thời Tokyo giành quyền đăng cai Thế vận hội Olympic 2020 và Núi Phú Sĩ chính thức được UNESCO công nhận là Di sản Thế giới. Sự kết hợp giữa chính sách mở cửa visa, mở rộng đường bay và chiến lược quảng bá thương hiệu quốc gia đã tạo ra làn sóng tăng trưởng chưa từng có. Nghiên cứu kinh nghiệm quản trị, cân bằng giữa phát triển du lịch di sản với bảo tồn nguyên vẹn các giá trị văn hóa của Nhật Bản đem lại những hàm ý và bài học quý giá cho các quốc gia đang phát triển như Việt Nam.
            </p>
          </div>

          {/* 2. Mục đích và câu hỏi nghiên cứu */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-950 flex items-center gap-2 dark:text-white">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#9BE7FA]/60 text-[#074553] font-black text-sm dark:bg-slate-800 dark:text-[#9BE7FA]">2</span>
              <span>{isEn ? '2. Objectives & Research Questions' : '2. Mục đích và câu hỏi nghiên cứu'}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700">
                <h4 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
                  <Compass className="w-4 h-4" />
                  <span>2.1 Mục đích nghiên cứu</span>
                </h4>
                <p className="text-sm leading-relaxed">
                  Khảo sát, phân tích toàn diện quá trình phát triển của du lịch di sản tại Nhật Bản giai đoạn 2013 đến nay dưới hai tiêu chí then chốt: <strong>Hiệu quả du lịch</strong> (lượng khách, chi tiêu, GDP, việc làm) và <strong>Công tác bảo tồn - quản lý di sản</strong> (quá tải du lịch, thương mại hóa, bảo vệ môi trường).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700">
                <h4 className="font-extrabold text-slate-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <Info className="w-4 h-4" />
                  <span>2.2 Ba câu hỏi nghiên cứu chính</span>
                </h4>
                <ul className="text-sm space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-300">
                  <li>Chính sách phát triển và bảo tồn di sản của Nhật Bản được hoạch định và chuyển dịch như thế nào?</li>
                  <li>Sự phát triển của du lịch di sản được phản ánh qua các chỉ số định lượng nào tại Kyoto, Nara và cả nước?</li>
                  <li>Chính quyền Nhật Bản đã giải quyết xung đột lợi ích dân cư và hệ lụy quá tải (Overtourism) ra sao?</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3, 4, 5, 6: Nhiệm vụ, Đối tượng, Phương pháp, Bố cục */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-800 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2 dark:text-white">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>3. Nhiệm vụ nghiên cứu & 4. Phạm vi</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                Hệ thống hóa cơ sở lý luận về du lịch di sản; thu thập và phân tích chuỗi dữ liệu thống kê khách du lịch, doanh thu tại Nhật Bản và các di sản trọng điểm (Kyoto, Nara, Shirakawa-go, Núi Phú Sĩ, Đền Itsukushima) trong phạm vi thời gian từ năm <strong>2013 đến 2023</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-800 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2 dark:text-white">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>5. Phương pháp & 6. Bố cục đề tài</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
                Kết hợp phân tích thống kê định lượng (thống kê JNTO, MLIT, Cục Văn hóa), phân tích chính sách và nghiên cứu trường hợp (Case study). Đề tài gồm 3 chương chính: <strong>Chương 1</strong> (Cơ sở lý luận & 25 di sản), <strong>Chương 2</strong> (Hệ thống chính sách), <strong>Chương 3</strong> (Thực chứng dữ liệu & bảo tồn).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
