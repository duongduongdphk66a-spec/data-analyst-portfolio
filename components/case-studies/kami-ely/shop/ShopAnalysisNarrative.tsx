'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface ShopAnalysisNarrativeProps {
  isEn?: boolean;
}

export default function ShopAnalysisNarrative({ isEn: propIsEn }: ShopAnalysisNarrativeProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const lang = isEn ? 'en' : 'vi';
  const [expandedText, setExpandedText] = useState<boolean>(false);

  const visualActionCards = [
    {
      badge: isEn ? 'CATEGORY PIVOT • FALL/WINTER' : 'XOAY TRỤC DANH MỤC • THU ĐÔNG',
      color: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
      barColor: 'bg-sky-400',
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
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
      barColor: 'bg-emerald-400',
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
      color: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
      barColor: 'bg-amber-400',
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
      color: 'border-pink-500/30 bg-pink-500/10 text-pink-300',
      barColor: 'bg-pink-400',
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
    <section className="w-full rounded-2xl border border-slate-800/90 bg-slate-950/90 p-5 sm:p-7 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-sky-500/15 text-sky-300 border border-sky-500/30">
            {lang === 'vi' ? 'TÓM TẮT CHIẾN LƯỢC TOÀN SHOP (VISUAL SUMMARY)' : 'SHOP-WIDE VISUAL ACTION SUMMARY'}
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-white mt-1">
            {lang === 'vi'
              ? '4 Trọng Tâm Tối Ưu Hóa Vận Hành Gian Hàng Kami Ely'
              : '4 Core Operational Optimization Pillars for Kami Ely'}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setExpandedText((prev) => !prev)}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-semibold transition self-start sm:self-auto cursor-pointer"
        >
          {expandedText
            ? lang === 'vi'
              ? '📖 Thu gọn phần diễn giải chữ ▲'
              : '📖 Hide Detailed Text ▲'
            : lang === 'vi'
            ? '📖 Xem thêm thuyết minh chi tiết ▼'
            : '📖 Read Full Analytical Notes ▼'}
        </button>
      </div>

      {/* 4 VISUAL INFOGRAPHIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visualActionCards.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-900/75 border border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${item.color}`}>
                  {item.badge}
                </span>
                <span className="text-xs font-mono font-bold text-white">{item.metric}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{item.title[lang]}</h4>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${item.barColor}`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{item.shortAction[lang]}</p>
          </div>
        ))}
      </div>

      {/* COLLAPSIBLE TEXT DETAILS (HIDDEN BY DEFAULT TO REDUCE TEXT CLUTTER) */}
      {expandedText && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed animate-in fade-in duration-200">
          <p>
            • <strong>{isEn ? '180-Day Audit (09/03 – 04/09/2026):' : 'Kiểm toán Chu kỳ 180 ngày (09/03 – 04/09/2026):'}</strong>{' '}
            {isEn
              ? 'The store reached 12,735,128,067 VND (85,500 units), averaging 70.75M VND/day. Seasonality peaked in June 2026 at 3,772.43M VND (29.6% of total GMV), reaching an all-time daily peak on Jun 16 with 315.05M VND (1,936 units).'
              : 'Toàn gian hàng đạt 12.735.128.067 VNĐ (85.500 SP), trung bình 70,75 triệu đ/ngày. Đỉnh mùa vụ rơi vào tháng 6/2026 với 3.772,43 triệu đ (chiếm 29,6% tổng GMV), lập kỷ lục ngày 16/06 đạt 315,05 triệu đ (1.936 SP).'}
          </p>
          <p>
            • <strong>{isEn ? '90-Day 3-Channel Reconciliation (6,136,205,973 VND | 40,229 units):' : 'Đối soát 3 Kênh Giao dịch 90 ngày (6.136.205.973 VNĐ | 40.229 SP):'}</strong>{' '}
            {isEn
              ? 'Self-operated @kamielyhn drives 49.31% GMV (3,026,026,869 VND | 20,027 units), 5,712 affiliate KOCs contribute 27.84% GMV (1,708,159,874 VND | 11,572 units), and Showcase product cards deliver 22.85% GMV (1,402,019,230 VND | 8,630 units).'
              : 'Kênh chính chủ @kamielyhn tự gánh 49,31% GMV (3.026.026.869 đ | 20.027 SP), mạng lưới 5.712 KOC ngoài đóng góp 27,84% GMV (1.708.159.874 đ | 11.572 SP), và Thẻ sản phẩm đóng góp 22,85% GMV (1.402.019.230 đ | 8.630 SP).'}
          </p>
        </div>
      )}
    </section>
  );
}
