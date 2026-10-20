'use client';

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface ShopAnalysisNarrativeProps {
  isEn?: boolean;
}

export default function ShopAnalysisNarrative({ isEn: propIsEn }: ShopAnalysisNarrativeProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const lang = isEn ? 'en' : 'vi';

  const visualActionCards = [
    {
      badge: isEn ? 'CATEGORY PIVOT • FALL/WINTER' : 'XOAY TRỤC DANH MỤC • THU ĐÔNG',
      color: 'border-[#9BE7FA]/40 bg-[#C8EEF7]/40 text-[#074553] dark:text-[#9BE7FA] dark:bg-[#9BE7FA]/15 dark:border-[#9BE7FA]/30',
      barColor: 'bg-[#0D7287] dark:bg-[#9BE7FA]',
      pct: 69.31,
      metric: isEn ? '69.31% Swimwear → Push CV11 (6,375 Units)' : '69,31% Đồ bơi → Đẩy Chân váy CV11 (6.375 SP)',
      title: {
        vi: 'Giải Cứu Đà Giảm -82,9% Tháng 8 Do 43% Khách Hà Nội Hết Mùa Biển',
        en: 'Reverse August -82.9% Drop as 43% Hanoi Audience Exits Beach Season'
      },
      shortAction: {
        vi: 'Dừng nhập Bikini từ cuối tháng 7; đưa Chân váy chữ A (CV11 - #1 sản lượng shop) và Chân váy dài viền ren (+471% GMV tuần) làm chủ lực.',
        en: 'Stop restocking Bikinis by late July; pivot to CV11 A-Line Skirt (#1 shop volume) and Lace Midi Skirt (+471% weekly GMV).'
      }
    },
    {
      badge: isEn ? 'ORGANIC SHOWCASE • 0 VND COMMISSION' : 'MỎ VÀNG KỆ HÀNG • 0Đ HOA HỒNG',
      color: 'border-[#FFD14C]/40 bg-[#FFE485]/40 text-amber-950 dark:text-[#FFE485] dark:bg-[#FFE485]/15 dark:border-[#FFD14C]/30',
      barColor: 'bg-[#FFE485] dark:bg-[#FFE485]',
      pct: 22.85,
      metric: isEn ? '1.17M Viewers • CVR 0.25% → 1.0% Target' : '1,17M Người xem • CVR 0,25% → Mục tiêu 1,0%',
      title: {
        vi: 'Mở Khóa +1,32 Tỉ Đ/Tháng Từ Luồng Tìm Kiếm & Đề Xuất (1,71M PV)',
        en: 'Unlock +1.32B VND/Month from Search & Recommendations (1.71M PV)'
      },
      shortAction: {
        vi: 'Bật Freeship Xtra, bổ sung kho size lẻ và gắn video 15s cận chất vải vào 4 thẻ sản phẩm có lượt xem cao nhất.',
        en: 'Enable Freeship Xtra, restock broken sizes, and attach 15s fabric close-up videos to the top 4 high-traffic product cards.'
      }
    },
    {
      badge: isEn ? 'PROMO RESTRUCTURING • AOV 150.9K' : 'TÁI CẤU TRÚC KHUYẾN MÃI • AOV 150,9K',
      color: 'border-[#9BE7FA]/40 bg-[#C8EEF7]/40 text-[#074553] dark:text-[#9BE7FA] dark:bg-[#9BE7FA]/15 dark:border-[#9BE7FA]/30',
      barColor: 'bg-[#C8EEF7] dark:bg-[#9BE7FA]/40',
      pct: 50.45,
      metric: isEn ? 'Discount cost 62.2M / 123.3M GMV (50.45%)' : 'Chi phí giảm giá 62,2 Tr / 123,3 Tr GMV (50,45%)',
      title: {
        vi: 'Thay Thế Giảm Giá Cố Định (96,35%) Bằng Flash Sale Ngắn Hạn & Deal Mua Kèm',
        en: 'Replace Fixed Discounts (96.35%) with Time-Boxed Flash Sales & Add-on Deals'
      },
      shortAction: {
        vi: 'Giữ nguyên AOV khuyến mãi 150.991 đ (+17,4%) nhưng kéo tỷ lệ chiết khấu từ 50,45% xuống 32%–35% nhờ Flash Sale khung 20h–22h.',
        en: 'Preserve the 150,991 VND promo AOV (+17.4%) while cutting markdown rate from 50.45% to 32%–35% via 20:00–22:00 Flash Sales.'
      }
    },
    {
      badge: isEn ? 'PARETO RISK MITIGATION • 5,712 KOCS' : 'QUẢN TRỊ RỦI RO PARETO • 5.712 KOCS',
      color: 'border-[#FFD14C]/40 bg-[#FFE485]/40 text-amber-950 dark:text-[#FFE485] dark:bg-[#FFE485]/15 dark:border-[#FFD14C]/30',
      barColor: 'bg-[#FFD14C] dark:bg-[#FFD14C]',
      pct: 91.49,
      metric: isEn ? 'Top 1% (58 KOC) = 91.49% GMV • @girlstyle.vn = 42.9%' : 'Top 1% (58 KOC) = 91,49% GMV • @girlstyle.vn = 42,9%',
      title: {
        vi: 'Nhân Bản Nhóm Nano/Micro KOC (<5k Follow Chiếm 96,09% GMV Affiliate)',
        en: 'Scale Nano/Micro KOC Tier (<5k Followers Driving 96.09% of Affiliate GMV)'
      },
      shortAction: {
        vi: 'Áp dụng hoa hồng bậc thang 10%–14% và gửi mẫu thử cho 286 KOC thuộc Top 5% để giảm phụ thuộc vào duy nhất @girlstyle.vn.',
        en: 'Deploy 10%–14% tiered commissions and free samples to the Top 5% (286 KOCs) to reduce single-KOC dependency on @girlstyle.vn.'
      }
    }
  ];

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800/90 dark:bg-slate-950/90 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded text-xs tabular-nums font-bold uppercase bg-sky-50 text-sky-800 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30">
            {lang === 'vi' ? 'TÓM TẮT CHIẾN LƯỢC TOÀN SHOP (VISUAL SUMMARY)' : 'SHOP-WIDE VISUAL ACTION SUMMARY'}
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
            {lang === 'vi'
              ? '4 Trọng Tâm Tối Ưu Hóa Vận Hành Gian Hàng Kami Ely'
              : '4 Core Operational Optimization Pillars for Kami Ely'}
          </h3>
        </div>
      </div>

      {/* 4 VISUAL INFOGRAPHIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visualActionCards.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/75 dark:border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded text-xs tabular-nums font-bold border ${item.color}`}>
                  {item.badge}
                </span>
                <span className="text-xs tabular-nums font-bold text-slate-900 dark:text-white">{item.metric}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title[lang]}</h4>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${item.barColor}`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.shortAction[lang]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
