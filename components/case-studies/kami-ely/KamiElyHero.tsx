'use client';

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface KamiElyHeroProps {
  onOpenProofModal?: (_screenshotId?: string) => void;
  onOpenNotebook?: () => void;
  onJumpToSection?: (_sectionId: string) => void;
  isEn?: boolean;
}

export default function KamiElyHero({
  isEn: propIsEn,
}: KamiElyHeroProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const lang = isEn ? 'en' : 'vi';

  const kamiKpiCards = [
    {
      id: 'kpi-kami-gmv-226d',
      badge: { vi: 'DOANH THU GMV • 226 NGÀY', en: '226-DAY STORE GMV' },
      badgeColor: 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
      title: { vi: 'Tổng Doanh Số Gian Hàng (226 Ngày)', en: '226-Day Cumulative Store GMV' },
      primaryValue: isEn ? '14.84B VND' : '14,84 Tỉ đ',
      exactSubValue: isEn ? '100,669 units sold · 65.7M/day' : '100.669 sản phẩm · 65,7 Tr/ngày',
      comparisonNote: {
        vi: 'Doanh thu thuần từ 9 bảng dữ liệu hợp nhất với 21.569 dòng SSOT. Chu kỳ mùa vụ cao điểm ghi nhận tại tháng 6 và các đợt bùng nổ Mega Sale (06/05, 10/10).',
        en: 'Net revenue from 9 unified tables across 21,569 SSOT rows. Peak seasonal velocity observed during June and Mega Sale spikes (06/05, 10/10).',
      },
      accentBorder: 'hover:border-[#9BE7FA]/60',
    },
    {
      id: 'kpi-kami-gmv-alltime',
      badge: { vi: 'LŨY KẾ • TOÀN THỜI GIAN', en: 'ALL-TIME CUMULATIVE GMV' },
      badgeColor: 'bg-[#FFE485]/40 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFE485]/30',
      title: { vi: 'Doanh Số Lũy Kế & Đơn Hàng Toàn Shop', en: 'All-Time Store Revenue & Orders' },
      primaryValue: isEn ? '31.6B VND' : '31,6 Tỉ đ',
      exactSubValue: isEn ? '238,400 orders · Top #44 category rank' : '238.400 đơn hàng · Top #44 ngành hàng',
      comparisonNote: {
        vi: 'Xếp hạng top thương hiệu thời trang nữ & đồ bơi TikTok Shop. Mạng lưới 1.000+ creator affiliate đóng góp 58% doanh số.',
        en: 'Top-tier ranking in TikTok Shop swimwear & women fashion. 1,000+ creator affiliate network generating 58% of volume.',
      },
      accentBorder: 'hover:border-[#FFD14C]/60',
    },
    {
      id: 'kpi-kami-aov',
      badge: { vi: 'GIÁ TRỊ ĐƠN HÀNG • AOV', en: 'AVERAGE ORDER VALUE • AOV' },
      badgeColor: 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
      title: { vi: 'Giá Trị Đơn Trung Bình Chuẩn Hóa', en: 'Normalized Average Order Value (AOV)' },
      primaryValue: isEn ? '149K VND' : '149.000 đ',
      exactSubValue: isEn ? 'Core price tiers >75k VND (Swimwear)' : 'Phân khúc chủ lực >75k đ (Váy & Bikini)',
      comparisonNote: {
        vi: 'Phân khúc 149k–189k đ chiếm 62% tổng số đơn hàng. Tối ưu giỏ hàng và combo giúp cải thiện biên lợi nhuận ròng 14%.',
        en: 'Key price range 149k–189k VND represents 62% of volume. Bundle optimization improved net margins by 14%.',
      },
      accentBorder: 'hover:border-[#9BE7FA]/60',
    },
    {
      id: 'kpi-kami-cvr',
      badge: { vi: 'TỶ LỆ CHUYỂN ĐỔI • CVR', en: 'CONVERSION RATE • CVR' },
      badgeColor: 'bg-[#FFE485]/40 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFE485]/30',
      title: { vi: 'Tỷ Lệ Chuyển Đổi & Uy Tín Gian Hàng', en: 'Store-Wide CVR & Trust Score' },
      primaryValue: '1,85%',
      exactSubValue: isEn ? '369,514 Followers · Rating 4.7/5.0 stars' : '369.514 Follower · Đánh giá 4,7/5,0 sao',
      comparisonNote: {
        vi: 'Chuyển đổi vượt trội mức chuẩn ngành (1,2–1,5%). Tỷ lệ hoàn tất đơn đạt 94,8% nhờ kiểm soát chặt chẽ tồn kho và logistics.',
        en: 'Exceeds category benchmarks (1.2–1.5%). Fulfillment completion reached 94.8% through tightly synchronized inventory logistics.',
      },
      accentBorder: 'hover:border-[#FFD14C]/60',
    },
  ];

  const corePillars = [
    {
      tag: isEn ? '1. Core E-Commerce Questions' : '1. Câu hỏi cốt lõi TMĐT',
      body: isEn
        ? 'Addresses 3 core questions: how many new buyers and KOCs are acquired, how sales trend across seasonal cycles, and why certain cohorts repeat while others churn after one transaction.'
        : 'Giải quyết 3 bài toán trọng tâm: thu hút bao nhiêu người mua và KOC mới, doanh số biến động theo chu kỳ mùa vụ nào, và vì sao một nhóm tiếp tục gắn bó tạo đơn lặp lại trong khi nhóm khác rời bỏ sau lần đầu.',
    },
    {
      tag: isEn ? '2. 1st & 2nd-Party Data Integration' : '2. Tích hợp dữ liệu 1st & 2nd-Party',
      body: isEn
        ? 'Integrates second-party platform exports (TikTok Seller Center & FastMoss) into a central warehouse via custom ETL scripts to join with first-party internal data (SKU inventory, discounts, and cancellations).'
        : 'Kết hợp dữ liệu bên thứ hai (Second-party data từ TikTok Seller Center & FastMoss) về kho tập trung thông qua trình nạp ETL tùy chỉnh để đối chiếu cùng dữ liệu nội bộ (First-party data: tồn kho SKU, chiết khấu và hủy đơn).',
    },
    {
      tag: isEn ? '3. 5-Step SQL Loop & BI' : '3. Vòng lặp SQL 5 bước & BI',
      body: isEn
        ? 'Executes a continuous loop from Explore → Profile → Clean → Shape → Analyze, feeding tactical BI dashboards and Python statistical models without manual spreadsheet edits.'
        : 'Vận hành quy trình lặp liên tục từ Khám phá (Explore) → Lập hồ sơ (Profile) → Làm sạch (Clean) → Định hình (Shape) → Phân tích (Analyze), xuất thẳng ra dashboard chiến thuật và mô hình thống kê Python.',
    },
  ];

  return (
    <header className="relative w-full rounded-3xl border border-slate-200 bg-white dark:border-slate-800/90 p-6 sm:p-10 overflow-hidden space-y-8 dark:bg-slate-950 transition-colors duration-200">
      {/* BACKGROUND GLOW DECORATION */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#9BE7FA]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#FFE485]/10 blur-3xl" />

      {/* HERO HEADLINE */}
      <div className="relative space-y-4 max-w-5xl">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
          {isEn ? (
            <>
              Kami Ely (@kamielyhn):{' '}
              <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                TikTok Shop Performance & Affiliate Analytics
              </span>
              : 7-Stage SQL & Econometric Case Study
            </>
          ) : (
            <>
              Kami Ely (@kamielyhn):{' '}
              <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                Phân Tích Hiệu Suất TikTok Shop & Mạng Lưới Affiliate
              </span>
              : Quy Trình 7 Giai Đoạn SQL & Kinh Tế Lượng
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {isEn
            ? 'Comprehensive single-page analytical case study across 7 stages for the Kami Ely swimwear & fashion store: (1) ETL architecture, (2) Profiling & cleaning, (3) Time series & seasonality, (4) Cohorts & CLTV, (5) Funnels & split testing, (6) Text mining & outliers, (7) CTE automation & PII governance.'
            : 'Báo cáo xuyên suốt 7 giai đoạn phân tích trên gian hàng thời trang & đồ bơi Kami Ely: (1) Kiến trúc luồng ETL, (2) Khám phá & làm sạch, (3) Chuỗi thời gian & mùa vụ, (4) Cohort & CLTV, (5) Phễu, giỏ hàng & thử nghiệm A/B, (6) Khai phá văn bản & xử lý ngoại lai, (7) Tự động hóa CTEs & bảo mật PII.'}
        </p>
      </div>

      {/* 4 BENTO KPI CARDS - UNIFIED PORTFOLIO STYLE */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kamiKpiCards.map((card) => (
          <div
            key={card.id}
            className={`p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800/90 transition duration-200 flex flex-col justify-between space-y-3 ${card.accentBorder}`}
          >
            <div className="space-y-2">
              <div className="min-h-[42px] flex items-start">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-md text-xs tabular-nums font-bold border ${card.badgeColor}`}
                >
                  {card.badge[lang]}
                </span>
              </div>
              <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 min-h-[34px] flex items-start leading-snug">
                {card.title[lang]}
              </h2>
              <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-slate-950 dark:text-white tracking-tight min-h-[72px] flex items-center">
                {card.primaryValue}
              </div>
              <div className="text-xs tabular-nums font-semibold text-[#074553] dark:text-[#9BE7FA] min-h-[34px] flex items-start leading-snug">
                {card.exactSubValue}
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-3 mt-auto">
              {card.comparisonNote[lang]}
            </p>
          </div>
        ))}
      </div>

      {/* 3 CORE PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {corePillars.map((p, idx) => (
          <div
            key={p.tag}
            className={`rounded-2xl border p-5 text-xs leading-relaxed flex flex-col justify-between space-y-2 ${
              idx === 2
                ? 'border-[#FFD14C]/70 bg-[#FFE485]/15 text-slate-800 dark:border-slate-800 dark:bg-[#FFD14C]/10 dark:text-slate-200'
                : 'border-slate-200 bg-slate-50/70 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300'
            }`}
          >
            <div className="font-black text-slate-950 dark:text-white text-sm">{p.tag}</div>
            <p className="text-slate-600 dark:text-slate-300">{p.body}</p>
          </div>
        ))}
      </div>
    </header>
  );
}
