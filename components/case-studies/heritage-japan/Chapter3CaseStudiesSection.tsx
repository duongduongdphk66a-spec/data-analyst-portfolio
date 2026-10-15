'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export function Chapter3CaseStudiesSection() {
  const [activeCaseStudy, setActiveCaseStudy] = useState<'kyoto' | 'nara' | 'fuji' | 'shirakawago' | 'miyajima'>('kyoto');

  return (
    <div className="pt-6">
      <div className="max-w-4xl mb-8">
        <h3 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2 dark:text-white">
          <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <span>3.2. Sự phát triển nhìn từ tiêu chí bảo tồn và quản lý di sản (Case Studies)</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-700 mt-2 leading-relaxed dark:text-slate-300">
          Tăng trưởng nóng gây quá tải du lịch, mâu thuẫn, ô nhiễm. Dưới đây là 5 điển hình và giải pháp.
        </p>
      </div>

      {/* Case Studies Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'kyoto', label: 'Cố đô Kyoto', sub: 'Camera AI & Thuế du lịch' },
          { id: 'nara', label: 'Cố đô Nara', sub: 'Bảo tồn hươu & Minpaku' },
          { id: 'fuji', label: 'Núi Phú Sĩ', sub: 'Quỹ 1.000¥ & Bảo tàng VR' },
          { id: 'shirakawago', label: 'Làng Shirakawa-go', sub: 'Đặt trước 100% Light-up' },
          { id: 'miyajima', label: 'Đền Itsukushima', sub: 'Thuế vào đảo 100¥ Miyajima' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCaseStudy(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
              activeCaseStudy === tab.id
                ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black dark:bg-[#9BE7FA] dark:text-slate-950'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="block">{tab.label}</span>
            <span className="block text-[11px] font-normal text-slate-500 dark:text-slate-400">{tab.sub}</span>
          </button>
        ))}
      </div>

      {/* Case Study Detailed View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 dark:bg-slate-900 dark:border-slate-800">
        {/* CASE 1: KYOTO */}
        {activeCaseStudy === 'kyoto' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <span className="text-xs font-extrabold text-[#0D7287] uppercase tracking-wider dark:text-[#9BE7FA]">Case Study 01</span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                  Cố đô Kyoto: Quá tải xe buýt, Live camera Kyoto Comfort Map & Rác thải
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold w-fit dark:bg-amber-950/60 dark:text-amber-300">
                4.5M du khách (2019)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h5 className="font-bold text-rose-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Thực trạng khủng hoảng (Overtourism)</span>
                </h5>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Khách đông làm tê liệt xe buýt. Người dân khó đi lại do xe chật cứng khách và hành lý.
                </p>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Rác thải tràn ngập phố cổ gây tốn kém. Khách sạn thiếu hụt dẫn đến bùng nổ minpaku tự phát.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Giải pháp quản trị của Thành phố Kyoto</span>
                </h5>
                <ul className="space-y-2 text-slate-700 list-disc list-inside dark:text-slate-300">
                  <li>
                    <strong>Kyoto Comfort Map:</strong> Dùng camera AI báo mức độ đông đúc để khách né giờ cao điểm.
                  </li>
                  <li>
                    <strong>Phân tán thời gian & không gian:</strong> Quảng bá ngoại ô, tổ chức tour sáng sớm và ngắm cảnh đêm.
                  </li>
                  <li>
                    <strong>Tập trung chất lượng:</strong> Hướng tới khách chi tiêu cao qua khu nghỉ dưỡng sang, giảm áp lực số lượng.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: NARA */}
        {activeCaseStudy === 'nara' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider dark:text-amber-400">Case Study 02</span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                  Cố đô Nara: Vấn nạn bảo vệ đàn hươu thần & Pháp lệnh lưu trú cao cấp
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold w-fit dark:bg-emerald-950/60 dark:text-emerald-300">
                3.3M du khách (2019)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h5 className="font-bold text-rose-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Mối lo ngại sinh thái đàn hươu công viên Nara</span>
                </h5>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Hươu Nara gặp nguy hiểm do ăn túi nilon. Đàn hươu tăng nhanh, tràn ra phá hoại mùa màng.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pháp lệnh lưu trú & Tái thiết di sản</span>
                </h5>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Ban hành pháp lệnh thu hút khách sạn. Cải tạo công trình cổ thành nơi lưu trú để giữ khách.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CASE 3: FUJI */}
        {activeCaseStudy === 'fuji' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider dark:text-indigo-400">Case Study 03</span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                  Núi Phú Sĩ: Quỹ bảo tồn tự nguyện 1.000¥, Đề án đường sắt & Trung tâm VR
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold w-fit dark:bg-indigo-950/60 dark:text-indigo-300">
                5.06M du khách (2019)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h5 className="font-bold text-rose-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Áp lực quá tải sườn núi & Khí thải xe cá nhân</span>
                </h5>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Lượng khách tăng 2.2 lần năm 2019 gây tắc nghẽn, quá tải vệ sinh và ô nhiễm khí thải.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Bộ công cụ giải pháp bền vững</span>
                </h5>
                <ul className="space-y-2 text-slate-700 list-disc list-inside dark:text-slate-300">
                  <li>
                    <strong>Quỹ bảo tồn (2014):</strong> Vận động đóng 1.000 Yên/người để bảo trì vệ sinh, xử lý rác, y tế.
                  </li>
                  <li>
                    <strong>Đường sắt leo núi Fuji:</strong> Đề xuất cấm xe cá nhân, chỉ dùng tàu điện kiểm soát theo giờ.
                  </li>
                  <li>
                    <strong>Trung tâm Di sản (2017):</strong> Xây bảo tàng VR giúp trải nghiệm leo núi Phú Sĩ từ xa.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* CASE 4: SHIRAKAWA-GO */}
        {activeCaseStudy === 'shirakawago' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider dark:text-emerald-400">Case Study 04</span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                  Làng cổ Shirakawa-go: Chế độ đặt chỗ trước 100% Lễ hội Ánh sáng Winter Light-up
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#C8EEF7]/40 text-[#0D7287] border border-[#9BE7FA] text-xs font-bold w-fit dark:bg-[#0D7287]/20 dark:text-[#9BE7FA] dark:border-[#0D7287]/40">
                600 dân vs 1.8M khách
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h5 className="font-bold text-rose-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Tỷ lệ nghịch ngạc nhiên: Du khách gấp 3.000 lần dân số</span>
                </h5>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Đón 1.8 triệu khách. Lễ hội Ánh sáng thu hút đông người chen lấn, gây nguy hiểm, mất yên bình.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Hệ thống đặt chỗ nghiêm ngặt (Advance Reservation)</span>
                </h5>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Áp dụng <strong>đặt chỗ trước 100%</strong>. Khách lưu trú hoặc có vé xe mới được vào. Cấm xe cá nhân.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CASE 5: MIYAJIMA */}
        {activeCaseStudy === 'miyajima' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <span className="text-xs font-extrabold text-[#0D7287] uppercase tracking-wider dark:text-[#9BE7FA]">Case Study 05</span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                  Đền Itsukushima (Miyajima): Thuế vào đảo 100 Yên tái thiết di sản
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#C8EEF7]/40 text-[#0D7287] border border-[#9BE7FA] text-xs font-bold w-fit dark:bg-[#0D7287]/20 dark:text-[#9BE7FA]">
                4.6M du khách (2019)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h5 className="font-bold text-rose-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Chi phí duy tu đền nổi & Quá tải hòn đảo</span>
                </h5>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Đón <strong>4.6 triệu khách</strong> (2019). Gỗ ngâm nước biển khiến chi phí bảo dưỡng trở thành gánh nặng tài chính.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Chính sách thuế vào đảo (Miyajima Visitor Tax)</span>
                </h5>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Thu thuế vào đảo 100 Yên/người. Nguồn thu dùng bảo tồn, chia sẻ chi phí và điều tiết lượng khách.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chapter3CaseStudiesSection;
