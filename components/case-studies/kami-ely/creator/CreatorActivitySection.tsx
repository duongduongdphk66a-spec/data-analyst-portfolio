'use client';

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface CreatorActivitySectionProps {
  isEn?: boolean;
  copyDeepLink?: (_id: string, _name?: string) => void;
  handleExportChart?: (_chartId: string, _fileName: string) => void;
  hourlyActivity?: any;
  activityHighlights?: any;
}

export default function CreatorActivitySection({
  isEn: propIsEn,
  copyDeepLink: _copyDeepLink,
  handleExportChart: _handleExportChart,
  hourlyActivity: _hourlyActivity,
  activityHighlights: _activityHighlights
}: CreatorActivitySectionProps = {}) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');

  // 1. Phễu Nguồn Lưu Lượng Phòng LIVE (7 ngày giữa tháng 3/2026: 12/03 – 18/03/2026 = 33.011.731 đ)
  const liveTrafficSources = [
    {
      source: { vi: 'Bảng tin - Ô Live (Feed Live Preview)', en: 'Feed - Live Preview Cell' },
      pvSharePct: 46,
      enterRoomRatePct: 5.09,
      statusBadge: { vi: 'ĐIỂM NGHẼN LỚN NHẤT (95% lướt qua)', en: 'PRIMARY BOTTLENECK (95% scroll past)' },
      badgeColor: 'bg-[#FFE485]/30 text-[#92400E] border-[#FFD14C]/40 dark:bg-[#FFD14C]/10 dark:text-[#FFE485] dark:border-[#FFD14C]/30',
      solution: {
        vi: 'Cải tổ 3 giây đầu (Hook), treo biển Flash Sale trực quan và đổi góc máy cận form dáng ngay trên Ô xem trước.',
        en: 'Overhaul 3-second hook, display visual Flash Sale boards, and show close-up fitting on the preview cell.'
      }
    },
    {
      source: { vi: 'Tìm kiếm (Search Intent)', en: 'Search (High Intent)' },
      pvSharePct: 43,
      enterRoomRatePct: 25.68,
      statusBadge: { vi: 'CHUYỂN ĐỔI CHỦ LỰC (Gấp 5x Ô Live)', en: 'HIGH-INTENT DRIVER (5x Feed Rate)' },
      badgeColor: 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/60 dark:bg-[#9BE7FA]/10 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
      solution: {
        vi: 'Chuẩn hóa SEO tiêu đề phòng LIVE chứa từ khóa sản phẩm hot (Bikini đi biển, Chân váy chữ A tôn dáng).',
        en: 'Standardize LIVE title SEO with high-intent keywords (Beach Bikini, Fitted A-Line Skirt).'
      }
    },
    {
      source: { vi: 'Hợp nhất Live (Live Merge)', en: 'Live Merge / Co-Host' },
      pvSharePct: 2,
      enterRoomRatePct: 41.41,
      statusBadge: { vi: 'TỶ LỆ VÀO PHÒNG CAO NHẤT (41,41%)', en: 'HIGHEST ENTRY RATE (41.41%)' },
      badgeColor: 'bg-[#C8EEF7]/30 text-[#0D7287] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/10 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
      solution: {
        vi: 'Tăng tần suất PK / Hợp nhất Live với các KOC trong mạng lưới vào khung giờ tối 20:00 – 22:00.',
        en: 'Increase PK / Live Merge frequency with network KOCs during peak 20:00–22:00 hours.'
      }
    },
    {
      source: { vi: 'Bảng tin - Đầu video & Tab Cửa hàng', en: 'Video Header & Store Tab' },
      pvSharePct: 9,
      enterRoomRatePct: 6.55,
      statusBadge: { vi: 'NGUỒN BỔ TRỢ ĐA KÊNH', en: 'OMNI-CHANNEL ASSIST' },
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      solution: {
        vi: 'Đăng video ngắn lúc 15:00 – 16:00 ngay trước giờ lên sóng ca tối (16:30) để đẩy luồng người xem sang phòng LIVE.',
        en: 'Publish short videos at 15:00–16:00 right before the 16:30 evening LIVE session to funnel viewers.'
      }
    }
  ];

  // 2. Đối chứng Thực nghiệm A/B Testing 2 Phiên LIVE (Đồng bộ ngày 22/03/2026 vs. 28/03/2026)
  const abTestComparison = [
    {
      metric: { vi: 'Mốc Thời Gian Đồng Bộ (Trong 180d)', en: 'Synchronized Date (In 180d Window)' },
      baseline: '22/03/2026 (5 giờ 07 phút)',
      scaled: '28/03/2026 (3 giờ 36 phút)',
      delta: 'Rút gọn 30% thời lượng'
    },
    {
      metric: { vi: 'Ngân Sách Quảng Cáo (Live Ads Spend)', en: 'Live Ads Spend' },
      baseline: '678.750 VNĐ',
      scaled: '2.170.000 VNĐ',
      delta: 'Tăng gấp 3,20 lần (+220%)'
    },
    {
      metric: { vi: 'Tổng Lượt Hiển Thị Phòng LIVE', en: 'Total LIVE Impressions' },
      baseline: '53.520 lượt (10,44K/giờ)',
      scaled: '94.760 lượt (26,32K/giờ)',
      delta: '+77,1% tổng hiển thị (+152%/giờ)'
    },
    {
      metric: { vi: 'Doanh Thu Phiên (Session GMV)', en: 'Session GMV' },
      baseline: '9.250.675 VNĐ (83 món)',
      scaled: '20.649.761 VNĐ (134 SP chính + 54 quà)',
      delta: '+123,2% doanh thu phiên'
    },
    {
      metric: { vi: 'Tốc Độ Tạo Doanh Thu Mỗi Giờ', en: 'Hourly GMV Velocity' },
      baseline: '1.810.000 VNĐ / giờ',
      scaled: '5.730.000 VNĐ / giờ',
      delta: 'Tăng gấp 3,16 lần (+216,6%)'
    },
    {
      metric: { vi: 'GPM Hiển Thị & Tỷ Trọng Tìm Kiếm', en: 'Display GPM & Search GMV Share' },
      baseline: 'GPM 172,86K • Tìm kiếm: 8,26% GMV',
      scaled: 'GPM 217,92K • Tìm kiếm: 15,97% GMV',
      delta: 'Tỷ trọng Search tăng gấp 1,93 lần'
    },
    {
      metric: { vi: 'Hiệu Suất Hero SKU #1 (Chân Váy Chữ A CV11)', en: 'Hero SKU #1 (CV11 A-Line Skirt)' },
      baseline: '17.900 clicks (CTR 5,51%) → 57 đơn (9,09 Tr đ = 98,28%)',
      scaled: '24.093 clicks (CTR 7,43%) → 130 đơn (20,34 Tr đ = 98,48%)',
      delta: 'Tăng +128% số đơn Hero SKU'
    }
  ];

  return (
    <section id="creator-activity" className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 dark:border-slate-800/90 dark:bg-slate-950/90 space-y-8 scroll-mt-36">
      {/* HEADER */}
      <div className="space-y-1 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-xs tabular-nums font-bold bg-[#C8EEF7]/50 text-[#074553] border border-[#9BE7FA] dark:bg-[#9BE7FA]/10 dark:text-[#9BE7FA] rounded-md">
            {lang === 'vi' ? 'Chẩn Đoán Kênh Chính Chủ @kamielyhn' : 'Official Channel @kamielyhn Diagnostics'}
          </span>
          <span className="px-2.5 py-1 text-[11px] tabular-nums font-bold text-[#92400E] bg-[#FFE485]/30 border border-[#FFD14C]/40 dark:text-[#FFE485] dark:bg-[#FFD14C]/10 rounded-md">
            {lang === 'vi' ? '475 Phiên LIVE (95,58% Có Đơn) • 222 Video' : '475 LIVEs (95.58% Converting) • 222 Videos'}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white mt-1">
          {lang === 'vi'
            ? 'Phễu Lưu Lượng Phòng LIVE (5,09% vs. 25,68%), Thực Nghiệm A/B Live Ads & Lịch Đăng Giờ Vàng'
            : 'LIVE Room Traffic Funnel (5.09% vs. 25.68%), Live Ads A/B Experiment & Golden Hour Schedule'}
        </h2>
      </div>

      {/* 1. PHỄU NGUỒN LƯU LƯỢNG PHÒNG LIVE */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-[#C8EEF7]/60 text-[#074553] border border-[#9BE7FA] text-xs font-bold dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA]">
            1
          </span>
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            {lang === 'vi' ? 'Phễu Nguồn Lưu Lượng Phòng LIVE (5,09% vs. 25,68%)' : 'LIVE Room Traffic Source Funnel (5.09% vs. 25.68%)'}
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/70 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs tabular-nums text-[#074553] dark:text-[#9BE7FA] font-bold">
              {lang === 'vi'
                ? 'Đồng bộ Tuần 12/03 – 18/03/2026: Tổng GMV @kamielyhn đạt 33.011.731 VNĐ (@girlstyle.vn: 0 đ trước khi kích hoạt hè)'
                : 'Synced Week Mar 12–18, 2026: @kamielyhn GMV reached 33,011,731 VND (@girlstyle.vn: 0 VND pre-summer activation)'}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {lang === 'vi'
                ? 'Khớp trực tiếp các phiên trong bảng 180 ngày: Phiên 16/03 19:20 (6.526.649 đ • 5.203 viewers), Phiên 17/03 20:29 (6.705.758 đ • 4.032 viewers), Phiên 18/03 10:09 (5.046.672 đ • 2.500 viewers).'
                : 'Matches sessions in the 180d table: Mar 16 19:20 (6,526,649 VND • 5,203 viewers), Mar 17 20:29 (6,705,758 VND • 4,032 viewers), Mar 18 10:09 (5,046,672 VND • 2,500 viewers).'}
            </p>
          </div>
          <div className="shrink-0 px-3.5 py-2 rounded-lg bg-[#FFE485]/20 border border-[#FFE485]/80 text-xs tabular-nums text-[#92400E] dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-[#FFE485]">
            CTOR Chuyển Mùa: <strong>1,44% (-81,51%)</strong> • CTR: <strong>5,49%</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveTrafficSources.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/75 dark:border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-950 dark:text-white">{item.source[lang]}</span>
                  <span className={`px-2 py-0.5 rounded text-xs tabular-nums font-bold border ${item.badgeColor}`}>
                    {item.statusBadge[lang]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-white border border-slate-200 dark:bg-slate-950/80 dark:border-slate-800/80 tabular-nums">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Tỷ Trọng Hiển Thị (PV)</div>
                    <div className="text-lg font-extrabold text-slate-950 dark:text-white">{item.pvSharePct}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Tỷ Lệ Bấm Vào Phòng</div>
                    <div className="text-lg font-extrabold text-[#0D7287] dark:text-[#9BE7FA]">{item.enterRoomRatePct}%</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-slate-200 dark:border-slate-800 pt-2.5">
                <strong className="text-[#074553] dark:text-[#9BE7FA]">Giải pháp: </strong>
                {item.solution[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. THỰC NGHIỆM A/B TESTING LIVE ADS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-[#C8EEF7]/60 text-[#074553] border border-[#9BE7FA] text-xs font-bold dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA]">
            2
          </span>
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            {lang === 'vi' ? 'Thực Nghiệm A/B Testing Live Ads (3,16x Tốc Độ GMV)' : 'Live Ads A/B Testing Experiment (3.16x GMV Velocity)'}
          </h3>
        </div>

        <div className="p-3.5 rounded-xl bg-[#C8EEF7]/30 border border-[#9BE7FA]/50 text-xs text-[#074553] dark:bg-[#9BE7FA]/10 dark:border-slate-800 dark:text-[#9BE7FA]">
          <strong>{lang === 'vi' ? 'Kết luận Thực nghiệm A/B Testing:' : 'A/B Testing Empirical Conclusion:'}</strong>{' '}
          {lang === 'vi'
            ? 'Khi tăng ngân sách Live Ads gấp 3,2 lần (từ 678,75K lên 2,17M VNĐ) kết hợp bắt luồng Tìm kiếm (tăng từ 8,26% lên 15,97% GMV) và ghim cố định mã Chân Váy Ngắn Form Chữ A (CV11) ở vị trí #1, tốc độ tạo doanh thu tăng vọt từ 1,81M đ/giờ lên 5,73M đ/giờ (gấp 3,16 lần) dù thời lượng phiên rút ngắn từ 5h07p xuống 3h36p.'
            : 'Scaling Live Ads by 3.2x (from 678.75K to 2.17M VND) while capturing Search intent (rising from 8.26% to 15.97% GMV) and pinning the CV11 A-Line Mini Skirt at #1 multiplied hourly GMV velocity from 1.81M/hr to 5.73M/hr (3.16x), even with a shorter 3h36m duration.'}
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 dark:bg-slate-900/95 dark:text-slate-300 tabular-nums uppercase text-[11px]">
                <th className="p-3.5">{lang === 'vi' ? 'Chỉ Số Thực Nghiệm (Live Workbench)' : 'Workbench Metric'}</th>
                <th className="p-3.5 bg-slate-100/50 dark:bg-slate-900/50">
                  {lang === 'vi' ? 'Phiên Tiêu Chuẩn (Profile A)' : 'Baseline Session (Profile A)'}
                </th>
                <th className="p-3.5 bg-[#C8EEF7]/40 text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]">
                  {lang === 'vi' ? 'Phiên Bùng Nổ Ads (Profile B)' : 'Breakout Ads Session (Profile B)'}
                </th>
                <th className="p-3.5">{lang === 'vi' ? 'Mức Độ Thay Đổi (Lift)' : 'Net Lift'}</th>
              </tr>
            </thead>
            <tbody className="text-slate-800 dark:text-slate-200 [&>tr:nth-child(even)]:bg-slate-50 dark:[&>tr:nth-child(even)]:bg-slate-800/40">
              {abTestComparison.map((row, index) => (
                <tr key={index} className="hover:bg-slate-100/60 dark:hover:bg-slate-900/50 transition">
                  <td className="p-3.5 font-bold text-slate-950 dark:text-white">{row.metric[lang]}</td>
                  <td className="p-3.5 tabular-nums text-slate-700 bg-slate-50 dark:text-slate-300 dark:bg-slate-900/20">{row.baseline}</td>
                  <td className="p-3.5 tabular-nums font-bold text-[#074553] bg-[#C8EEF7]/25 dark:text-[#9BE7FA] dark:bg-[#9BE7FA]/10">{row.scaled}</td>
                  <td className="p-3.5 tabular-nums font-semibold text-[#92400E] dark:text-[#FFE485]">{row.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. LỆCH PHA GIỜ ĐĂNG & BẪY QUÁN TÍNH THỜI LƯỢNG LIVE */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-[#C8EEF7]/60 text-[#074553] border border-[#9BE7FA] text-xs font-bold dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA]">
            3
          </span>
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            {lang === 'vi' ? 'Lệch Pha Giờ Đăng Video & Bẫy Quán Tính Thời Lượng LIVE' : 'Posting Schedule Mismatch & LIVE Duration Inertia'}
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/75 dark:border-slate-800 space-y-3">
            <span className="px-2.5 py-0.5 rounded text-xs tabular-nums font-bold bg-[#FFE485]/30 text-[#92400E] border border-[#FFE485] dark:bg-[#FFD14C]/10 dark:text-[#FFE485]">
              {lang === 'vi' ? 'LỆCH PHA GIỜ ĐĂNG VIDEO (222 VIDEOS / 180D)' : 'VIDEO POSTING SCHEDULE MISMATCH'}
            </span>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              {lang === 'vi'
                ? 'Đăng 54% Video Vào Buổi Sáng (08:00–12:00) Khi Khán Giả Nữ 18–24 Tuổi Chưa Online'
                : 'Posting 54% of Videos in the Morning (08:00–12:00) Outside Peak Female 18–24 Windows'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'vi'
                ? 'Tệp người theo dõi của @kamielyhn gồm 73% Nữ, 60% trong độ tuổi 18–24 (31% từ 25–34 tuổi), tập trung tại Hà Nội (43%) và TP.HCM (41%). Thống kê cho thấy kênh đăng tới 54% video vào khung 08:00–12:00 sáng (8 video lúc 08:00–09:00 và 13 video lúc 10:00–12:00), trong khi tỷ lệ tương tác thực tế đạt đỉnh vào buổi trưa 12:00–13:00 (0,71%) và buổi chiều 15:00–16:00 (0,74% so với mức trung bình 0,62%).'
                : '@kamielyhn’s audience is 73% Female, 60% aged 18–24 (31% aged 25–34), concentrated in Hanoi (43%) and HCMC (41%). Currently, 54% of videos are published between 08:00–12:00, whereas actual engagement peaks at 12:00–13:00 (0.71%) and 15:00–16:00 (0.74% vs. 0.62% average).'}
            </p>
            <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs tabular-nums text-[#074553] dark:bg-slate-950/90 dark:border-slate-800 dark:text-[#9BE7FA]">
              Khuyến nghị: Dịch chuyển 100% lịch đăng video sang 11:45–12:15 và 14:45–15:15; gắn giỏ hàng bổ sung cho 308/859 video chưa thương mại hóa.
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/75 dark:border-slate-800 space-y-3">
            <span className="px-2.5 py-0.5 rounded text-xs tabular-nums font-bold bg-[#C8EEF7]/50 text-[#074553] border border-[#9BE7FA]/60 dark:bg-[#9BE7FA]/10 dark:text-[#9BE7FA]">
              {lang === 'vi' ? 'BẪY QUÁN TÍNH THỜI LƯỢNG LIVE (~7,5 GIỜ/NGÀY)' : 'LIVE DURATION INERTIA TRAP (~7.5H/DAY)'}
            </span>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              {lang === 'vi'
                ? 'Cắt Ca Trưa Ngày Thường (11:30–13:30) & Tinh Gọn Giỏ Hàng Từ >375 Mã Về 15–20 Hero SKUs'
                : 'Cut Midday Weekday LIVEs (11:30–13:30) & Trim Pinned Basket from >375 to 15–20 Hero SKUs'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'vi'
                ? 'Trong 180 ngày, kênh phát sóng 475 phiên CSV (470 phiên chuẩn hóa, thời lượng trung bình 2 giờ 26 phút/phiên, nhiều phiên marathon tháng 6 kéo dài 10–16 tiếng như ngày 16/06 đạt 272,1 Tr đ). Tuy nhiên vào cuối tháng 8 – đầu tháng 9, việc giữ lịch cố định ~7,5h/ngày với >375 sản phẩm gắn dàn trải khiến GPM LIVE tụt xuống 29,2k–30,2k đ (thấp hơn 4,5 lần so với GPM Video 134,8k–135,2k đ) và xuất hiện các phiên 0 đ – 119k đ.'
                : 'Across 180 days, the channel hosted 475 CSV sessions (470 normalized, avg 2h26m/session, with June marathons lasting 10–16 hours such as Jun 16 hitting 272.1M VND). However, keeping a rigid ~7.5h/day schedule in late Aug–Sep with >375 pinned SKUs diluted LIVE GPM to 29.2k–30.2k VND (4.5x lower than Video GPM at 134.8k–135.2k VND), resulting in 0–119k VND sessions.'}
            </p>
            <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs tabular-nums text-[#0D7287] dark:bg-slate-950/90 dark:border-slate-800 dark:text-[#9BE7FA]">
              Khuyến nghị: Hủy ca trưa ngày thường mùa thấp điểm, dồn lực vào ca tối trọng điểm 19:30–22:30 (2,5–3h) chỉ xoay quanh 15–20 Hero SKUs.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
