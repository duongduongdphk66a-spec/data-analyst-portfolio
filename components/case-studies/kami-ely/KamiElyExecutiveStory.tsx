'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { ArrowUpRight } from 'lucide-react';

export interface KamiElyExecutiveStoryProps {
  isEn?: boolean;
  onJumpToTab?: (_tab: 'science' | 'shop' | 'creator') => void;
}

export default function KamiElyExecutiveStory({ isEn: propIsEn, onJumpToTab }: KamiElyExecutiveStoryProps = {}) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');
  const [selectedPillar, setSelectedPillar] = useState<number>(0);

  const executivePillars = [
    {
      id: 'pillar-1-gpm',
      tag: { vi: 'PHÁT HIỆN #1 • HIỆU SUẤT KÊNH CHÍNH CHỦ', en: 'FINDING #1 • OFFICIAL CHANNEL EFFICIENCY' },
      title: {
        vi: 'Nghịch Lý GPM Gấp 4,5 Lần & Bẫy Quán Tính Thời Lượng Livestream (~7,5 Giờ/Ngày)',
        en: 'The 4.5x GPM Paradox & Livestream Duration Burnout (~7.5 Hours/Day)'
      },
      summaryMetric: '135,2k vs. 30,2k VNĐ / 1k Views',
      targetTab: 'creator' as const,
      problemStatement: {
        vi: 'Kênh chính chủ @kamielyhn tự gánh 49,31% GMV toàn shop (3,03 Tỉ đ / 90 ngày; 5,80 Tỉ đ Net / 180 ngày). Tuy nhiên, đội ngũ đang duy trì lịch LIVE cố định ~7,5 tiếng/ngày (11:30–13:30 & 16:30–22:00, tổng 470–475 phiên với TB 2h26p/phiên) và ghim dàn trải >375 mã sản phẩm, khiến GPM Livestream chỉ đạt 29,2k – 30,2k VNĐ/1.000 views.',
        en: 'Official channel @kamielyhn carries 49.31% of shop GMV (3.03B in 90d; 5.80B Net in 180d). However, maintaining a rigid ~7.5h/day LIVE schedule (470–475 sessions, avg 2h26m/session) with >375 pinned SKUs dilutes conversion, leaving LIVE GPM at just 29.2k–30.2k VND/1,000 views.'
      },
      empiricalProof: {
        vi: 'Trong khi đó, Shoppable Video trên kênh chính chủ đạt GPM 134,8k – 135,2k VNĐ/1.000 views (cao gấp 4,5 lần LIVE). Tuy nhiên, 94,70% GMV của 4.417 Shoppable Videos toàn sàn (2.055.758.301 đ) đang phụ thuộc vào Paid Ads, còn 308/859 video trên kênh chính chủ vẫn chưa được gắn giỏ hàng và 54% video đăng lệch vào buổi sáng (06:00–12:00).',
        en: 'Meanwhile, Shoppable Videos achieve 134.8k–135.2k VND GPM (4.5x higher than LIVE). Yet 94.70% of shop-wide Shoppable Video GMV (2.055B VND) depends on Paid Ads, while 308/859 official videos lack product links and 54% are posted in the morning (06:00–12:00).'
      },
      actionableSolution: {
        vi: 'Cắt giảm 25%–30% giờ LIVE ca trưa mùa thấp điểm; gắn giỏ hàng cho 308 video sẵn có và chuyển lịch đăng sang đúng khung giờ vàng tương tác 12:00–13:00 (0,71%) và 15:00–16:00 (0,74%).',
        en: 'Cut 25%–30% of off-peak midday LIVE hours; attach product links to the 308 unmonetized videos and shift posting to peak engagement windows at 12:00–13:00 (0.71%) and 15:00–16:00 (0.74%).'
      }
    },
    {
      id: 'pillar-2-live-ab',
      tag: { vi: 'PHÁT HIỆN #2 • CHẨN ĐOÁN PHÒNG LIVE & ADS', en: 'FINDING #2 • LIVE FUNNEL & ADS LEVERAGE' },
      title: {
        vi: 'Bẫy Số Lượng Phiên (106 Phiên = 79,4 Tr) vs. Đòn Bẩy Live Ads & SEO Tìm Kiếm (Gấp 3,16x Tốc Độ)',
        en: 'Session Volume Trap (106 LIVEs = 79.4M) vs. Live Ads & Search Leverage (3.16x Velocity)'
      },
      summaryMetric: '1,81M/giờ → 5,73M/giờ (+216%)',
      targetTab: 'creator' as const,
      problemStatement: {
        vi: 'Dữ liệu chuỗi thời gian 180 ngày bác bỏ giả thuyết "càng nhiều phiên LIVE càng nhiều tiền": Ngày 09/04/2026 toàn sàn phát sóng kỷ lục 106 phiên LIVE nhưng chỉ thu về 79,46 triệu đ (~749k/phiên). Bên trong phòng LIVE chính chủ, 46% lượt hiển thị đến từ Bảng tin - Ô Live nhưng tỷ lệ vào phòng chỉ đạt 5,09% (95% khách lướt qua).',
        en: '180-day time-series refutes the "more sessions = more revenue" myth: Apr 09 spammed 106 LIVEs for just 79.46M VND (~749k/session). Inside official LIVE rooms, 46% of impressions come from Feed Preview with only a 5.09% entry rate (95% scroll past).'
      },
      empiricalProof: {
        vi: 'Ngược lại, ngày 25/06 chỉ với 45 phiên LIVE chất lượng đã mang về 196,09 triệu đ (~4,36 triệu/phiên). Thực nghiệm A/B Testing giữa Phiên Tiêu Chuẩn (22/03 - Ads 678,75K -> 9,25 Tr đ, 1,81M/giờ) và Phiên Bùng Nổ (28/03 - Ads 2,17M -> 20,65 Tr đ, 5,73M/giờ) chứng minh: Khi bắt luồng Tìm kiếm (tỷ lệ vào phòng 25,68%, đóng góp GMV tăng từ 8,26% lên 15,97%) và dồn lực vào 1 Hero SKU, tốc độ doanh thu tăng gấp 3,16 lần.',
        en: 'Conversely, Jun 25 ran just 45 high-quality LIVEs to generate 196.09M VND (~4.36M/session). A/B testing Baseline (Mar 22: 678.75K Ads -> 9.25M, 1.81M/hr) vs. Breakout (Mar 28: 2.17M Ads -> 20.65M, 5.73M/hr) proves that capturing Search intent (25.68% entry rate, search GMV share rising from 8.26% to 15.97%) around 1 Hero SKU multiplies hourly velocity by 3.16x.'
      },
      actionableSolution: {
        vi: 'Chuẩn hóa SEO tiêu đề phòng LIVE để đón luồng Tìm kiếm (25,68% vào phòng), cải tổ 3 giây đầu ở Ô Live và nhân bản công thức Ads 2,17M đ/phiên xoay quanh Hero SKU.',
        en: 'Standardize LIVE title SEO to capture Search traffic (25.68% entry rate), overhaul the first 3 seconds for Feed Previews, and replicate the 2.17M VND Ads playbook around Hero SKUs.'
      }
    },
    {
      id: 'pillar-3-card-promo',
      tag: { vi: 'PHÁT HIỆN #3 • MỎ VÀNG KỆ HÀNG & KHUYẾN MÃI', en: 'FINDING #3 • PRODUCT CARD & PROMO ENGINE' },
      title: {
        vi: 'Khắc Phục Điểm Nghẽn CVR 0,25% Trên 1,17 Triệu Lượt Xem Kệ Hàng & Chi Phí Giảm Giá 50,45%',
        en: 'Fixing the 0.25% CVR Bottleneck Across 1.17M Product Card Viewers & 50.45% Discount Bleed'
      },
      summaryMetric: '1,17M Viewers • CVR 0,25% → 1,0%',
      targetTab: 'shop' as const,
      problemStatement: {
        vi: 'Đối soát bảng _product data (6,14 Tỉ đ) và _Creators_merged (4,73 Tỉ đ) chỉ ra Thẻ sản phẩm (Kệ hàng) tự nhiên mang về 1.402.019.230 đ (22,85% GMV 90 ngày) mà không tốn hoa hồng KOC. Tuy nhiên, chẩn đoán Seller Center 28 ngày phát hiện Kệ hàng thu hút tới 1,17 Triệu người xem (+34,46%) nhưng CVR chỉ đạt 0,25% (442,36 Tr đ).',
        en: 'Reconciling _product data (6.14B) and _Creators_merged (4.73B) reveals Product Cards organically drive 1,402,019,230 VND (22.85% of 90d GMV) with zero commission. Yet Seller Center 28d telemetry shows 1.17M card viewers (+34.46%) converting at just 0.25% CVR (442.36M VND).'
      },
      empiricalProof: {
        vi: 'Đồng thời, phân tích Marketing chỉ ra chương trình khuyến mãi tạo 35,86% GMV (123,3 Tr đ, nâng AOV lên 150.991 đ) nhưng ngốn tới 62,2 Tr đ chi phí giảm giá (tỷ lệ chiết khấu 50,45%) do phụ thuộc 96,35% vào Giảm giá cố định, trong khi Flash Sale LIVE chỉ chiếm 19,65% và Flash Sale thường chỉ 0,20%.',
        en: 'Simultaneously, Marketing telemetry shows promotions drive 35.86% GMV (123.3M VND, lifting AOV to 150,991 VND) but consume 62.2M VND in discount costs (50.45% markdown rate) due to 96.35% reliance on Fixed Discounts, whereas LIVE Flash Sale is 19.65% and standard Flash Sale is 0.20%.'
      },
      actionableSolution: {
        vi: 'Bổ sung kho size cho các mẫu hot, bật Freeship Xtra và chuyển từ Giảm giá cố định sang Flash Sale khung giờ ngắn để nâng CVR Kệ hàng từ 0,25% lên 1,0% (mở khóa +1,32 Tỉ đ/tháng).',
        en: 'Restock broken sizes on hot SKUs, enable Freeship Xtra, and replace Fixed Discounts with time-boxed Flash Sales to lift Card CVR from 0.25% to 1.0% (unlocking +1.32B VND/month).'
      }
    },
    {
      id: 'pillar-4-seasonality-pareto',
      tag: { vi: 'PHÁT HIỆN #4 • XOAY TRỤC THU ĐÔNG & KOC PARETO', en: 'FINDING #4 • AUTUMN PIVOT & KOC PARETO' },
      title: {
        vi: 'Giải Cứu Suy Thoái Cuối Vụ (-81,26%) Cho 43% Khách Hà Nội & Quản Trị Rủi Ro Pareto Affiliate',
        en: 'Reversing Late-Season Drop (-81.26%) for 43% Hanoi Audience & Affiliate Pareto Risk'
      },
      summaryMetric: 'CV11: 6.375 SP (#1) • Top 1 KOC = 42,9%',
      targetTab: 'science' as const,
      problemStatement: {
        vi: 'Vì 43% người theo dõi ở Hà Nội và 69,31% GMV 90 ngày là Đồ bơi (Sports & Outdoor), khi miền Bắc sang thu vào tháng 8 – tháng 9, doanh thu toàn shop lao dốc từ 3,77 Tỉ đ (tháng 6) xuống 645,53 Tr đ (tháng 8) và nhánh nội dung chuyển mùa giảm -81,26% (CTOR tụt xuống 1,44%). Song song, mạng lưới 5.712 KOC ngoài (1,71 Tỉ đ) có tới 94,9% không ra đơn và phụ thuộc 42,9% vào duy nhất @girlstyle.vn (732,77 Tr đ / 5.009 SP).',
        en: 'With 43% of followers in Hanoi and 69.31% of 90d GMV in Swimwear, Northern Vietnam’s autumn transition caused shop GMV to plunge from 3.77B (June) to 645.53M (August), with transition branch GMV dropping -81.26% (CTOR down to 1.44%). Meanwhile, 94.9% of 5,712 external KOCs (1.71B VND) generate zero orders, and 42.9% relies on a single KOC, @girlstyle.vn (732.77M VND / 5,009 units).'
      },
      empiricalProof: {
        vi: 'Phân tích chéo bảng _product data và Creator Goods phát hiện mã Chân Váy Ngắn Form Chữ A (CV11) đứng #1 toàn shop về sản lượng (6.375 SP = 735,07 Tr đ) và chiếm 98,48% GMV trong phiên LIVE bùng nổ (130 đơn = 20,34 Tr đ), nhưng kênh chính chủ mới chỉ khai thác 21,0% (1.338 SP). Ngoài ra, mã Chân váy dài phối viền ren đang tăng trưởng +471,28% trên Kệ hàng.',
        en: 'Cross-referencing _product data and Creator Goods reveals the A-Line Mini Skirt (CV11) ranks #1 shop-wide in volume (6,375 units = 735.07M VND) and drove 98.48% of the breakout LIVE session (130 orders = 20.34M VND), yet the official channel only accounts for 21.0% (1,338 units). Additionally, the Lace Midi Skirt is growing +471.28% on Product Cards.'
      },
      actionableSolution: {
        vi: 'Đưa Chân váy CV11 & Chân váy dài viền ren làm sản phẩm ghim #1 trên sóng LIVE chính chủ mùa Thu – Đông; áp dụng hoa hồng bậc thang (10%–14%) để nhân rộng nhóm Micro KOC (1k–5k followers đang tạo 52,67% GMV Affiliate).',
        en: 'Make CV11 A-Line Skirt & Lace Midi Skirt the #1 pinned SKUs on official Autumn/Winter LIVEs; deploy tiered commissions (10%–14%) to scale the 1k–5k Micro-KOC tier (currently driving 52.67% of Affiliate GMV).'
      }
    }
  ];

  const activeItem = executivePillars[selectedPillar];

  return (
    <section id="executive-story" className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 dark:border-slate-800/90 dark:bg-slate-950/95 space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs tabular-nums font-bold text-amber-700 dark:text-amber-400">
            {lang === 'vi' ? 'Tóm Tắt Điều Hành' : 'Executive Story'}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white mt-0.5">
            {lang === 'vi'
              ? '4 Phát Hiện Cốt Lõi & Bằng Chứng Thực Nghiệm Từ 18.778 Bản Ghi'
              : '4 Core Findings & Empirical Proofs Across 18,778 Records'}
          </h2>
        </div>
      </div>

      {/* 4 PILLAR SELECTOR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {executivePillars.map((pillar, index) => {
          const isSelected = selectedPillar === index;
          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => setSelectedPillar(index)}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#C8EEF7]/25 border-[#9BE7FA] ring-1 ring-[#9BE7FA]/50 dark:bg-slate-900 dark:border-[#9BE7FA]/60 dark:ring-[#9BE7FA]/30'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-900/40 dark:border-slate-800/80 dark:hover:bg-slate-900/70 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="text-xs tabular-nums font-bold uppercase text-[#074553] dark:text-[#9BE7FA]">{pillar.tag[lang]}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{pillar.title[lang]}</div>
              </div>
              <div className="pt-2 border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs tabular-nums font-extrabold text-[#0D7287] dark:text-[#9BE7FA]">{pillar.summaryMetric}</span>
                <span className="text-xs tabular-nums text-slate-400">{isSelected ? '▼' : '▶'}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE PILLAR DETAIL: PROBLEM -> EMPIRICAL PROOF -> SOLUTION */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200 dark:bg-slate-900/75 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[11px] tabular-nums font-bold text-[#074553] dark:text-[#9BE7FA] uppercase">{activeItem.tag[lang]}</span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white mt-0.5">{activeItem.title[lang]}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-[#C8EEF7]/50 border border-[#9BE7FA]/60 tabular-nums text-xs font-bold text-[#074553] dark:bg-[#9BE7FA]/15 dark:border-[#9BE7FA]/30 dark:text-[#9BE7FA]">
              {activeItem.summaryMetric}
            </span>
            {onJumpToTab && (
              <button
                type="button"
                onClick={() => onJumpToTab(activeItem.targetTab)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#C8EEF7]/50 text-[#074553] hover:bg-[#C8EEF7] border border-[#9BE7FA]/60 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:hover:bg-[#9BE7FA]/25 dark:border-[#9BE7FA]/30 transition cursor-pointer"
                title={lang === 'vi' ? 'Xem chi tiết phân hệ' : 'Inspect tab details'}
              >
                <span>{lang === 'vi' ? 'Xem phân hệ' : 'Go to tab'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-white border border-slate-200 dark:bg-slate-950/80 dark:border-slate-800 space-y-1.5 shadow-xs">
            <div className="text-xs tabular-nums font-bold uppercase text-slate-900 dark:text-slate-100">
              1. {lang === 'vi' ? 'Nút Thắt Vận Hành (Problem)' : 'Operational Bottleneck'}
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{activeItem.problemStatement[lang]}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#9BE7FA]/40 dark:bg-slate-950/80 dark:border-[#9BE7FA]/20 space-y-1.5 shadow-xs">
            <div className="text-xs tabular-nums font-bold uppercase text-[#074553] dark:text-[#9BE7FA]">
              2. {lang === 'vi' ? 'Bằng Chứng Dữ Liệu (Empirical Proof)' : 'Empirical Data Proof'}
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{activeItem.empiricalProof[lang]}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#9BE7FA]/60 dark:bg-slate-950/80 dark:border-[#9BE7FA]/30 space-y-1.5 shadow-xs">
            <div className="text-xs tabular-nums font-bold uppercase text-[#074553] dark:text-[#9BE7FA]">
              3. {lang === 'vi' ? 'Giải Pháp & Tác Động (Action & ROI)' : 'Strategic Action & ROI'}
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed text-xs">{activeItem.actionableSolution[lang]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
