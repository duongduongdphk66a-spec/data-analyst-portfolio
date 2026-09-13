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
          Song hành cùng tăng trưởng kinh tế là những hệ lụy tiêu cực sâu sắc: tình trạng <strong>quá tải du lịch (Overtourism / 観光公害 - Kanko Kogai)</strong>, mâu thuẫn dân cư bản địa, thương mại hóa làm xói mòn tính nguyên bản và ô nhiễm môi trường. Dưới đây là khảo sát thực tiễn 5 trường hợp điển hình cùng các giải pháp quản trị sáng tạo của Nhật Bản.
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
                  Lượng khách bùng nổ quanh các địa điểm Gion và Kinkakuji khiến mạng lưới xe buýt công cộng bị tê liệt. Người dân bản địa thường xuyên không thể lên xe để đi làm hoặc đi khám bệnh do xe buýt luôn chật kín du khách với hành lý cồng kềnh.
                </p>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  <strong>&quot;Trò chơi mèo vờn chuột&quot; với rác thải:</strong> Tại các con phố cổ Arashiyama và Higashiyama, vỏ lon và hộp nhựa chất đống tràn ngập các thùng rác công cộng, phát sinh chi phí dọn dẹp khổng lồ cho thành phố. Khách sạn tăng từ 30.000 lên 53.000 phòng vẫn thiếu, dẫn đến làn sóng minpaku tự phát trong khu chung cư gây xung đột nếp sống.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Giải pháp quản trị của Thành phố Kyoto</span>
                </h5>
                <ul className="space-y-2 text-slate-700 list-disc list-inside dark:text-slate-300">
                  <li>
                    <strong>Kyoto Comfort Map (京都観光快適度マップ):</strong> Lắp đặt camera AI tại các điểm nóng để phát trực tiếp mức độ đông đúc theo thời gian thực, khuyến khích du khách chủ động né giờ cao điểm.
                  </li>
                  <li>
                    <strong>Phân tán không gian & thời gian:</strong> Quảng bá 6 khu vực di sản ngoại ô ít người biết; kết hợp với tập đoàn JR Tokai triển khai các tour tham quan sáng sớm (Morning Tours) và ngắm cảnh đêm (Night Tours).
                  </li>
                  <li>
                    <strong>Chất lượng hơn số lượng:</strong> Thu hút các chuỗi nghỉ dưỡng siêu sang (Park Hyatt Kyoto, Aman Kyoto) để gia tăng nguồn thu từ đối tượng có mức chi tiêu cao mà không làm gia tăng quá mức áp lực dân số vãng lai.
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
                  Hơn 1.200 chú hươu tại Công viên Nara và Đền Kasuga Taisha là biểu tượng văn hóa thiêng liêng. Tuy nhiên, du khách đông đúc thường cho hươu ăn thức ăn không phù hợp, vứt túi nilon khiến nhiều chú hươu nuốt phải và tử vong. Ngoài ra, việc bảo tồn nghiêm ngặt khiến đàn hươu gia tăng số lượng, tràn ra ngoài phá hoại cây trồng nông nghiệp của người dân.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pháp lệnh lưu trú & Tái thiết di sản</span>
                </h5>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Tỉnh Nara ban hành <em>&quot;Pháp lệnh đảm bảo quản lý hợp lý doanh nghiệp lưu trú&quot;</em> (奈良県住宅宿泊事業の適正な運営の確保に関する条例). Cung cấp trợ cấp đặc biệt để thu hút các khách sạn đẳng cấp quốc tế (Fufu Nara, JW Marriott Hotel Nara, Fairfield by Marriott Tenri), đồng thời cho phép cải tạo các công trình cổ có giá trị văn hóa thành cơ sở lưu trú cao cấp giữ chân du khách qua đêm thay vì chỉ đi về trong ngày từ Osaka/Kyoto.
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
                  Năm 2019, 5.06 triệu người đến thăm núi Phú Sĩ (gấp 2.2 lần so với năm 2012 trước khi được công nhận di sản). Hàng vạn người leo núi cùng lúc gây tắc nghẽn nguy hiểm trên các cung đường dốc, tắc nghẽn nhà vệ sinh và lượng khí thải khổng lồ từ xe buýt, ô tô cá nhân đổ dồn lên trạm số 5 Subaru Line.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Bộ công cụ giải pháp bền vững</span>
                </h5>
                <ul className="space-y-2 text-slate-700 list-disc list-inside dark:text-slate-300">
                  <li>
                    <strong>Quỹ hợp tác bảo tồn Núi Phú Sĩ (2014):</strong> Vận động phí đóng góp tự nguyện 1.000 Yên/người leo núi, tạo nguồn tài chính bảo trì nhà vệ sinh sinh thái, xử lý rác và cứu hộ y tế.
                  </li>
                  <li>
                    <strong>Đề án Đường sắt leo núi Fuji (Fuji Mountain Railway):</strong> Đề xuất cấm hoàn toàn xe ô tô cá nhân, chỉ cho phép đi tàu điện leo núi có kiểm soát số lượng theo giờ.
                  </li>
                  <li>
                    <strong>Trung tâm Di sản Thế giới Núi Phú Sĩ (2017):</strong> Xây dựng bảo tàng rộng 6.100 m² tại Shizuoka với công nghệ leo núi thực tế ảo VR, giúp du khách trải nghiệm đỉnh Phú Sĩ từ xa mà không cần leo núi thực.
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
                  Ngôi làng cổ kính nép mình giữa thung lũng tuyết chỉ có vỏn vẹn khoảng 600 cư dân sinh sống nhưng đón tới <strong>1.8 triệu lượt du khách mỗi năm</strong> (gấp 3.000 lần dân số). Trong các đêm Lễ hội Ánh sáng Mùa đông (Shirakawago Winter Light-up), hàng nghìn du khách chen lấn trên đài quan sát hẹp và đường làng, gây nguy cơ giẫm đạp và làm đảo lộn hoàn toàn sự yên bình của làng quê.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Hệ thống đặt chỗ nghiêm ngặt (Advance Reservation)</span>
                </h5>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Chính quyền làng quyết định chuyển đổi Lễ hội Ánh sáng sang hình thức <strong>đặt chỗ trước 100% (Complete Reservation System)</strong>. Chỉ những khách đặt trước qua đêm tại làng hoặc mua vé xe buýt có số ghế kèm vé lên đài quan sát mới được phép vào làng sau 17h. Xe ô tô cá nhân không có giấy phép đăng ký đỗ xe trước bị cấm vào làng tuyệt đối. Giải pháp này đã xóa bỏ hoàn toàn cảnh hỗn loạn, đảm bảo an toàn tuyệt đối và nâng tầm trải nghiệm của du khách.
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
                  Đền Thần đạo Itsukushima với cổng Torii màu đỏ son khổng lồ cắm thẳng xuống biển thủy triều đón tới <strong>4.6 triệu du khách</strong> năm 2019. Việc các công trình bằng gỗ liên tục tiếp xúc với nước biển mặn khiến chi phí bảo dưỡng, trùng tu và thu dọn vệ sinh trên đảo là gánh nặng tài chính khổng lồ đối với ngân sách thị trấn Hatsukaichi.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-emerald-700 flex items-center gap-1.5 text-sm uppercase tracking-wider dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Chính sách thuế vào đảo (Miyajima Visitor Tax)</span>
                </h5>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Thành phố Hatsukaichi chính thức áp dụng <strong>Thuế vào đảo Miyajima (入島税)</strong> với mức 100 Yên/người thu trực tiếp qua giá vé phà. Nguồn thu thuế chuyên dụng này được chuyển thẳng vào quỹ bảo tồn cảnh quan và trùng tu đền thờ, vừa san sẻ chi phí với du khách một cách công bằng, vừa điều tiết mật độ khách lên đảo bền vững qua nhiều thế hệ.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
