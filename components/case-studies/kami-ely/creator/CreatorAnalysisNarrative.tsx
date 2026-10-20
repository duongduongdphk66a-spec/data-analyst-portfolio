'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface CreatorAnalysisNarrativeProps {
  isEn?: boolean;
}

export default function CreatorAnalysisNarrative({ isEn: propIsEn }: CreatorAnalysisNarrativeProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const lang = isEn ? 'en' : 'vi';
  const [showFullNotes, setShowFullNotes] = useState<boolean>(false);

  const creatorVisualCards = [
    {
      tag: isEn ? 'GPM PARADOX 4.5X • VIDEO VS. LIVE' : 'NGHỊCH LÝ GPM 4,5X • VIDEO VS. LIVE',
      badgeClass: 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
      barClass: 'bg-[#0D7287] dark:bg-[#9BE7FA]',
      barWidth: 100,
      stat: isEn ? 'Video: 135.2k vs. LIVE: 30.2k / 1k views' : 'Video: 135,2k đ vs. LIVE: 30,2k đ / 1k views',
      headline: {
        vi: 'Gắn Giỏ Hàng Cho 308 Video Còn Trống & Giảm Lệ Thuộc 94,7% Paid Ads',
        en: 'Monetize 308 Unlinked Videos & Reduce 94.7% Paid Ads Dependency'
      },
      action: {
        vi: 'Kênh đã đăng 859 video All-time (34,3M views) nhưng mới gắn giỏ 551 video. Thương mại hóa 308 video còn lại giúp tăng ngay doanh số tự nhiên.',
        en: 'Out of 859 All-time videos (34.3M views), only 551 have product links. Linking the remaining 308 videos unlocks immediate organic GMV.'
      }
    },
    {
      tag: isEn ? 'LIVE ROOM FUNNEL • 46% FEED PV' : 'PHỄU PHÒNG LIVE • 46% PV Ô LIVE',
      badgeClass: 'bg-[#FFE485]/40 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFD14C]/30',
      barClass: 'bg-[#FFE485] dark:bg-[#FFE485]',
      barWidth: 20,
      stat: isEn ? 'Feed Preview: 5.09% entry vs. Search: 25.68%' : 'Ô Live: 5,09% vào phòng vs. Search: 25,68%',
      headline: {
        vi: 'Cải Tổ 3 Giây Đầu Ở Ô Xem Trước & Bắt Luồng Tìm Kiếm Chủ Động',
        en: 'Overhaul 3-Second Feed Preview Hook & Capture Search Intent'
      },
      action: {
        vi: 'Đặt bảng Flash Sale trực quan ngay giữa khung hình và chuẩn hóa SEO tiêu đề LIVE để đón luồng Tìm kiếm (tỷ lệ vào phòng gấp 5 lần Ô Live).',
        en: 'Place visual Flash Sale boards center-frame and standardize LIVE title SEO to capture Search traffic (5x higher entry rate than Feed).'
      }
    },
    {
      tag: isEn ? 'LIVE ADS PLAYBOOK • A/B TESTING' : 'ĐÒN BẨY LIVE ADS • A/B TESTING',
      badgeClass: 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
      barClass: 'bg-[#C8EEF7] dark:bg-[#9BE7FA]/40',
      barWidth: 88,
      stat: isEn ? 'Ads 3.2x → Sales velocity 3.16x (5.73M/h)' : 'Tăng Ads 3,2x → Tốc độ bán tăng 3,16x (5,73M/h)',
      headline: {
        vi: 'Nhân Bản Công Thức Phiên Bùng Nổ (28/03): Ads 2,17M + Ghim #1 Chân Váy CV11',
        en: 'Replicate Breakout Session Playbook (Mar 28): 2.17M Ads + Pin #1 CV11 Skirt'
      },
      action: {
        vi: 'Rút gọn thời lượng phiên về 3h–3h30p ca tối, ghim cố định Chân váy chữ A (CV11 chốt 130 đơn = 20,34 Tr đ, chiếm 98,48% GMV phiên).',
        en: 'Condense sessions to 3h–3.5h evening slots and pin CV11 A-Line Skirt at #1 (130 orders = 20.34M VND, driving 98.48% of session GMV).'
      }
    },
    {
      tag: isEn ? 'POSTING SCHEDULE • 73% FEMALE (18–24Y)' : 'LỊCH ĐĂNG GIỜ VÀNG • 73% NỮ (18–24T)',
      badgeClass: 'bg-[#FFE485]/40 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFD14C]/30',
      barClass: 'bg-[#FFD14C] dark:bg-[#FFD14C]',
      barWidth: 74,
      stat: isEn ? 'Peak Engagement: 12:00–13:00 (0.71%) & 15:00–16:00 (0.74%)' : 'Đỉnh tương tác: 12:00–13:00 (0,71%) & 15:00–16:00 (0,74%)',
      headline: {
        vi: 'Chuyển 54% Video Đăng Buổi Sáng Sang Khung Giờ Vàng Trưa & Chiều',
        en: 'Shift 54% Morning Video Posts to Midday & Afternoon Golden Hours'
      },
      action: {
        vi: 'Đăng video lúc 11:45 và 14:45 để đón đỉnh tương tác của tệp khách nữ 18–24 tuổi tại Hà Nội (43%) và TP.HCM (41%), mồi traffic cho ca LIVE tối.',
        en: 'Publish videos at 11:45 and 14:45 to hit peak engagement among 18–24 female viewers in Hanoi (43%) and HCMC (41%), priming evening LIVEs.'
      }
    }
  ];

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800/90 dark:bg-slate-950/90 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded text-xs tabular-nums font-bold uppercase bg-[#C8EEF7]/50 text-[#074553] border border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30">
            {lang === 'vi' ? 'CHẨN ĐOÁN TRỰC QUAN KÊNH @kamielyhn' : '@kamielyhn VISUAL DIAGNOSTIC SUMMARY'}
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
            {lang === 'vi'
              ? '4 Đòn Bẩy Tối Ưu Hóa Chuyển Đổi Kênh Chính Chủ (@kamielyhn)'
              : '4 Conversion Optimization Levers for Official Channel (@kamielyhn)'}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setShowFullNotes((prev) => !prev)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-700 text-xs tabular-nums font-semibold transition self-start sm:self-auto cursor-pointer"
        >
          {showFullNotes
            ? lang === 'vi'
              ? 'Thu gọn ghi chú kiểm toán ▲'
              : 'Hide Audit Notes ▲'
            : lang === 'vi'
            ? 'Xem ghi chú đối soát Gross/Net ▼'
            : 'View Gross/Net Audit Notes ▼'}
        </button>
      </div>

      {/* 4 VISUAL DIAGNOSTIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {creatorVisualCards.map((card, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/75 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded text-xs tabular-nums font-bold border ${card.badgeClass}`}>
                  {card.tag}
                </span>
                <span className="text-xs tabular-nums font-bold text-slate-900 dark:text-white">{card.stat}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{card.headline[lang]}</h4>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${card.barClass}`} style={{ width: `${card.barWidth}%` }} />
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{card.action[lang]}</p>
          </div>
        ))}
      </div>

      {/* COLLAPSIBLE GROSS VS NET AUDIT NOTE */}
      {showFullNotes && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed animate-in fade-in duration-200">
          <p>
            • <strong>{isEn ? 'All-Time vs. 180-Day Reconciliation:' : 'Đối soát Toàn thời gian (All-Time) vs. 180 Ngày:'}</strong>{' '}
            {isEn
              ? 'Cumulative since channel launch reaches 9.2B VND (69.9k units: LIVE 5.9B across 2.5k sessions; Video 3.2B across 859 videos), linking 4 collaborative stores (Kami Ely 9.1B VND; Havi Bikini 71.8M VND; KamiBiii 6.2M VND; KamiBiki 0 VND).'
              : 'Lũy kế từ khi lập kênh đạt 9,2 Tỉ VNĐ (69,9k SP: LIVE 5,9 Tỉ qua 2,5k phiên; Video 3,2 Tỉ qua 859 video), liên kết 4 cửa hàng hợp tác (Kami Ely 9,1 Tỉ đ; Havi Bikini 71,8 Tr đ; KamiBiii 6,2 Tr đ; KamiBiki 0 đ).'}
          </p>
          <p>
            • <strong>{isEn ? 'Gross CSV vs. Net UI Audit (180 Days):' : 'Đối soát Gross CSV vs. Net UI trong 180 Ngày:'}</strong>{' '}
            {isEn
              ? 'Gross sum across 475 LIVE sessions (7,023,530,158 VND | 49,817 units) and 222 Videos (870,200,806 VND | 5,144 units) in CSV logs equals 7.89B VND Gross; after accounting for order cancellation/return rate (26.5%), recognized revenue on 180-day charts normalizes to 5.80B VND Net (39.3k units: LIVE 4.90B VND across 470 normalized sessions; Video 872.2M VND).'
              : 'Tổng cộng dồn 475 phiên LIVE (7.023.530.158 đ | 49.817 SP) và 222 Video (870.200.806 đ | 5.144 SP) trong CSV đạt 7,89 Tỉ VNĐ Gross; sau khi trừ tỷ lệ hủy/hoàn trả đơn hàng (26,5%), doanh thu thực nhận trên biểu đồ 180 ngày đạt 5,80 Tỉ VNĐ Net (39,3k SP: LIVE 4,90 Tỉ đ qua 470 phiên chuẩn hóa; Video 872,2 Tr đ).'}
          </p>
        </div>
      )}
    </section>
  );
}
