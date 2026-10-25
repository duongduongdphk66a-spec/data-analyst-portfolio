'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { HERITAGE_JAPAN_DATA } from '@/app/data/heritageJapanData';
import CaseStudyFooter from './shared/CaseStudyFooter';
import {
  Eye,
  X,
  TrendingUp,
  MapPin,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

interface HeritageJapanProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
  initialData?: any;
}

const THESIS_ORIGINAL_FIGURES = [
  { id: '3.1', titleVi: 'Biểu đồ 3.1: Khách du lịch nước ngoài đến Nhật Bản (2003–2022)', page: 30, src: '/heritage-japan/thesis-chart-3-1.png' },
  { id: '3.2', titleVi: 'Biểu đồ 3.2: Khách du lịch nước ngoài đến Kyoto (2008–2023)', page: 31, src: '/heritage-japan/thesis-chart-3-2.png' },
  { id: '3.3', titleVi: 'Biểu đồ 3.3: Khách du lịch nước ngoài đến Cố đô Nara (2009–2020)', page: 31, src: '/heritage-japan/thesis-chart-3-3.png' },
  { id: '3.4', titleVi: 'Biểu đồ 3.4: Chi tiêu của khách quốc tế tại Nhật Bản (2010–2021)', page: 33, src: '/heritage-japan/thesis-chart-3-4.png' },
  { id: '3.5', titleVi: 'Biểu đồ 3.5: Chi tiêu du lịch tại Thành phố Kyoto (2008–2020)', page: 33, src: '/heritage-japan/thesis-chart-3-5.png' },
  { id: '3.6', titleVi: 'Biểu đồ 3.6: Chi tiêu du lịch tại Nara (2013–2022)', page: 34, src: '/heritage-japan/thesis-chart-3-6.png' },
];

export default function HeritageJapanProject({
  onBack: _onBack,
  isEmbedded: _isEmbedded,
  initialData: _initialData,
}: HeritageJapanProjectProps = {}) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [isProofModalOpen, setIsProofModalOpen] = useState<boolean>(false);
  const [selectedFigureId, setSelectedFigureId] = useState<string>('3.1');

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Niên luận Du lịch Di sản Nhật Bản (Ma Văn Hùng)', 'proj-heritage-japan', 'project');
  }, []);

  const activeFigure = THESIS_ORIGINAL_FIGURES.find((f) => f.id === selectedFigureId) || THESIS_ORIGINAL_FIGURES[0];

  const synchronizedVisitors = HERITAGE_JAPAN_DATA.japanVisitors.filter(
    (d) => Number(d.year) >= 2010 && Number(d.year) <= 2021
  );
  const synchronizedSpending = HERITAGE_JAPAN_DATA.japanSpending.filter(
    (d) => Number(d.year) >= 2010 && Number(d.year) <= 2021
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* HERO & KPI SUMMARY - UNIFIED KAMI ELY STYLE */}
      <header className="rounded-3xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white p-6 sm:p-10 border border-slate-200 dark:border-slate-800/90 relative overflow-hidden transition-colors duration-200 space-y-8">
        {/* BACKGROUND GLOW DECORATION */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#9BE7FA]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#FFE485]/10 blur-3xl" />

        <div className="relative space-y-4 max-w-5xl">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            {isEn ? (
              <>
                Quantitative Analysis of Japanese Heritage Tourism{' '}
                <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                  (2013–2023)
                </span>
                : Economic Drivers & Overtourism Capacity
              </>
            ) : (
              <>
                Phân Tích Tăng Trưởng & Sức Chứa Du Lịch Di Sản Nhật Bản{' '}
                <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                  (2013–2023)
                </span>
                : Từ Đòn Bẩy Kinh Tế Đến Bài Toán Quá Tải
              </>
            )}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            {isEn
              ? 'Evaluate macroeconomic impacts of the 2013 National Tourism Program, visa deregulation, currency depreciation, and carrying capacity tensions at UNESCO World Heritage sites.'
              : 'Đánh giá hiệu lực kinh tế của Chương trình Quốc gia Du lịch (06/2013), nới lỏng thị thực, giảm giá đồng Yên và bài toán sức chứa (Overtourism) tại các Di sản Thế giới UNESCO.'}
          </p>
        </div>

        {/* 4 BENTO KPI CARDS */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              id: 'kpi-heritage-visitors',
              badge: { vi: 'QUY MÔ KHÁCH • 2013–2019', en: 'VISITOR VOLUME • 2013–2019' },
              badgeColor: 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
              title: { vi: 'Đỉnh Khách Quốc Tế Toàn Quốc (2019)', en: 'Peak International Visitors (2019)' },
              primaryValue: '31,9M',
              exactSubValue: '+206,7% vs 2013 (10,4M)',
              comparisonNote: {
                vi: 'Tăng gấp ~3,8 lần so với mức nền 6–8 triệu lượt trước năm 2013. Tăng trưởng bứt phá nhờ chính sách thị thực & nới lỏng tiền tệ.',
                en: 'Grew ~3.8x over the pre-2013 baseline of 6–8M visitors. Spurred by aggressive visa deregulation and monetary easing.'
              },
              accentBorder: 'hover:border-[#9BE7FA]/60'
            },
            {
              id: 'kpi-heritage-spending',
              badge: { vi: 'DOANH THU DU LỊCH • ĐỈNH 2019', en: 'TOURISM REVENUE • 2019 PEAK' },
              badgeColor: 'bg-[#FFE485]/40 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFE485]/30',
              title: { vi: 'Chi Tiêu Khách Quốc Tế Tại Nhật Bản', en: 'Inbound Tourist Expenditure in Japan' },
              primaryValue: '4,81 nghìn tỷ ¥',
              exactSubValue: 'Tăng 3,41x vs 2013 (1,41T ¥)',
              comparisonNote: {
                vi: 'Chiếm 11,5% tổng doanh thu toàn ngành du lịch Nhật Bản (41,94T ¥). Tăng tốc mạnh mẽ nhờ mạng lưới hoàn thuế mua sắm.',
                en: 'Accounted for 11.5% of total tourism revenue in Japan (41.94T ¥). Boosted by nationwide duty-free retail expansion.'
              },
              accentBorder: 'hover:border-[#FFD14C]/60'
            },
            {
              id: 'kpi-heritage-gdp',
              badge: { vi: 'TỶ TRỌNG KINH TẾ • ĐÓNG GÓP GDP', en: 'ECONOMIC IMPACT • GDP SHARE' },
              badgeColor: 'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
              title: { vi: 'Đóng Góp Kinh Tế Vĩ Mô & Việc Làm', en: 'Macroeconomic Contribution & Jobs' },
              primaryValue: '7,5% GDP',
              exactSubValue: '375,4 Tỷ USD (Hạng 3 Thế giới)',
              comparisonNote: {
                vi: 'Tăng từ 2,2% GDP (2000), vượt Đức (344,8 tỷ USD), tạo hơn 4 triệu việc làm trực tiếp và gián tiếp (6,9% lực lượng lao động).',
                en: 'Rose from 2.2% GDP (2000), surpassing Germany (344.8B USD), sustaining over 4 million jobs (6.9% of workforce).'
              },
              accentBorder: 'hover:border-[#9BE7FA]/60'
            },
            {
              id: 'kpi-heritage-overtourism',
              badge: { vi: 'SỨC CHỨA DI SẢN • OVERTOURISM', en: 'HERITAGE CAPACITY • OVERTOURISM' },
              badgeColor: 'bg-[#FFE485]/40 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFE485]/30',
              title: { vi: 'Tỷ Lệ Áp Lực Quá Tải Cực Đại (UNESCO)', en: 'Peak Overtourism Pressure Ratio' },
              primaryValue: '3.000 : 1',
              exactSubValue: '1,8M Khách / 600 Cư Dân',
              comparisonNote: {
                vi: 'Ghi nhận tại làng cổ Shirakawa-go & Gokayama. Tỷ lệ đè nặng lên hạ tầng giao thông, rác thải và không gian cộng đồng bản địa.',
                en: 'Recorded at historic Shirakawa-go & Gokayama. Extreme strain on transit, waste logistics, and local residential quality.'
              },
              accentBorder: 'hover:border-[#FFD14C]/60'
            }
          ].map((card) => {
            const lang = isEn ? 'en' : 'vi';
            return (
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
            );
          })}
        </div>
      </header>

      {/* PHẦN 1: BỐI CẢNH CHÍNH SÁCH & TĂNG TRƯỞNG VĨ MÔ */}
      <section className="space-y-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F0F9FB] dark:bg-slate-900 border-2 border-[#0D7287]/25 dark:border-[#9BE7FA]/25 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 text-xs sm:text-sm font-black tabular-nums tracking-wide shadow-2xs">
              PHẦN 1
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Bối cảnh Chính sách & Kinh tế Vĩ mô
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
            1. Đòn bẩy chính sách năm 2013 và cú hích du lịch quốc tế
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-3xl leading-relaxed">
            {isEn
              ? 'Evaluating the impact of visa deregulation, monetary easing, and nationwide promotion strategies (2010–2021).'
              : 'Phân tích tác động chính sách thị thực, nới lỏng tiền tệ và chiến lược xúc tiến du lịch giai đoạn 2010–2021.'}
          </p>
        </div>

        {/* 3 Trụ cột chính sách */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {HERITAGE_JAPAN_DATA.policyPillars.map((p, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full"
            >
              <div>
                <div className="min-h-[28px] mb-3">
                  <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA]">
                    {p.year} : {p.focus}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white min-h-[54px] flex items-start leading-snug">
                  {p.name}
                </h3>
                <ul className="space-y-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                  {p.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* BỘ ĐÔI VĨ MÔ TOÀN QUỐC (GRID 2 CỘT SONG SONG): KHÁCH & CHI TIÊU - ĐỒNG BỘ 2010–2021 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* BIỂU ĐỒ 1: KHÁCH QUỐC TẾ ĐẾN NHẬT BẢN */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn ? 'Chart 1 (Fig 3.1) • Unit: Million Visitors' : 'Biểu đồ 1 (Gốc 3.1) • Đơn vị: Triệu người'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] border border-[#9BE7FA]/40">
                  {isEn ? '2019 Peak: 31.9M' : 'Đỉnh 2019: 31,9M lượt'}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white min-h-[52px] flex items-center">
                {isEn ? 'International Visitors to Japan (2010–2021)' : 'Số lượng khách du lịch quốc tế đến Nhật Bản (2010–2021)'}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mb-5">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" /> {isEn ? 'Pre-2013 / COVID-19' : 'Trước 2013 / COVID-19'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0D7287] dark:bg-[#9BE7FA]" /> {isEn ? 'Growth 2013–2018' : 'Tăng trưởng 2013–2018'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C]" /> {isEn ? '2019 Peak' : 'Đỉnh 2019'}
                </span>
              </div>

              <div className="w-full">
                <div className="h-56 flex items-end gap-1 sm:gap-2 px-1 border-b-2 border-slate-200 dark:border-slate-700">
                  {synchronizedVisitors.map((d) => {
                    const barHeight = Math.max(Math.round((d.value / 34) * 160), 6);
                    const isBoom = Number(d.year) >= 2013 && Number(d.year) <= 2018;
                    const isPeak = d.year === '2019';
                    return (
                      <div key={d.year} className="flex-1 flex flex-col items-center justify-end h-full group">
                        <span className="text-xs sm:text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200 mb-1.5 transition-transform group-hover:scale-110 select-none">
                          {d.value}
                        </span>
                        <div
                          style={{ height: `${barHeight}px` }}
                          className={`w-full rounded-t-md transition-transform duration-300 group-hover:opacity-90 ${
                            isPeak
                              ? 'bg-[#FFD14C]'
                              : isBoom
                              ? 'bg-[#0D7287] dark:bg-[#9BE7FA]'
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={`${d.year}: ${d.value} triệu người ${d.note ? `(${d.note})` : ''}`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-1 sm:gap-2 px-1 pt-2.5">
                  {synchronizedVisitors.map((d) => (
                    <div key={d.year} className="flex-1 text-center">
                      <span
                        className={`text-xs sm:text-xs font-semibold tabular-nums block truncate ${
                          d.year === '2019'
                            ? 'text-slate-950 dark:text-[#FFD14C] font-extrabold'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span className="hidden sm:inline">20</span>{d.year.slice(-2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-5 leading-relaxed pt-3">
              {isEn ? (
                <>
                  <strong>Observation:</strong> From 2010 to 2012, inbound volume plateaued at 6.2–8.6M visitors/year. Following the June 2013 Action Program, arrivals accelerated <strong>3.8x</strong> to reach an all-time peak of 31.9M visitors in 2019 before COVID-19.
                </>
              ) : (
                <>
                  <strong>Nhận xét:</strong> Giai đoạn 2010–2012, lượng khách đi ngang ở mức 6,2 – 8,6 triệu/năm. Ngay sau khi ban hành Chương trình 2013, lượng khách bùng nổ liên tục gấp <strong>3,8 lần</strong>, chạm đỉnh 31,9 triệu lượt vào năm 2019 trước khi chịu tác động dịch COVID-19.
                </>
              )}
            </p>
          </div>

          {/* BIỂU ĐỒ 2: CHI TIÊU CỦA KHÁCH QUỐC TẾ */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn ? 'Chart 2 (Fig 3.4) • Unit: Trillion Yen' : 'Biểu đồ 2 (Gốc 3.4) • Đơn vị: Nghìn tỷ Yên'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] border border-[#9BE7FA]/40">
                  {isEn ? '2019 Peak: 4.81T ¥' : 'Đỉnh 2019: 4,81 nghìn tỷ ¥'}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white min-h-[52px] flex items-center">
                {isEn ? 'International Tourist Spending in Japan (2010–2021)' : 'Chi tiêu của khách du lịch quốc tế tại Nhật (2010–2021)'}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mb-5">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" /> {isEn ? 'Pre-2013 / COVID-19' : 'Trước 2013 / COVID-19'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0D7287] dark:bg-[#9BE7FA]" /> {isEn ? 'Growth 2013–2018' : 'Tăng tốc 2013–2018'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C]" /> {isEn ? '2019 Peak' : 'Đỉnh 2019'}
                </span>
              </div>

              <div className="w-full">
                <div className="h-56 flex items-end gap-1 sm:gap-2 px-1 border-b-2 border-slate-200 dark:border-slate-700">
                  {synchronizedSpending.map((d) => {
                    const barHeight = Math.max(Math.round((d.value / 5.2) * 160), 6);
                    const isPeak = d.year === '2019';
                    const isBoom = Number(d.year) >= 2013 && Number(d.year) < 2019;
                    return (
                      <div key={d.year} className="flex-1 flex flex-col items-center justify-end h-full group">
                        <span className="text-xs sm:text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200 mb-1.5 transition-transform group-hover:scale-110 select-none">
                          {d.value}
                        </span>
                        <div
                          style={{ height: `${barHeight}px` }}
                          className={`w-full rounded-t-md transition-transform duration-300 group-hover:opacity-90 ${
                            isPeak
                              ? 'bg-[#FFD14C]'
                              : isBoom
                              ? 'bg-[#0D7287] dark:bg-[#9BE7FA]'
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={`${d.year}: ${d.value} nghìn tỷ Yên`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-1 sm:gap-2 px-1 pt-2.5">
                  {synchronizedSpending.map((d) => (
                    <div key={d.year} className="flex-1 text-center">
                      <span
                        className={`text-xs sm:text-xs font-semibold tabular-nums block truncate ${
                          d.year === '2019'
                            ? 'text-slate-950 dark:text-[#FFD14C] font-extrabold'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span className="hidden sm:inline">20</span>{d.year.slice(-2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-5 leading-relaxed pt-3">
              {isEn ? (
                <>
                  <strong>Observation:</strong> Inbound tourist spending grew <strong>3.41x</strong> from 1.41 trillion Yen (2013) to a record 4.81 trillion Yen (2019) driven by consumption tax exemptions (Tax-free) and extended tourist visas.
                </>
              ) : (
                <>
                  <strong>Nhận xét:</strong> Chi tiêu tăng gấp <strong>3,41 lần</strong> từ 1,41 nghìn tỷ Yên (2013) lên đỉnh 4,81 nghìn tỷ Yên (2019) nhờ chính sách miễn thuế tiêu dùng (Tax-free) và nới lỏng thời gian lưu trú cho khách quốc tế.
                </>
              )}
            </p>
          </div>
        </div>

        {/* BIỂU ĐỒ 3 (FULL WIDTH): CHỈ SỐ HÓA TỐC ĐỘ BỨT PHÁ (MỐC 2013 = 100) */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <div>
              <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                Biểu đồ 3 : Chỉ số hóa tốc độ tăng trưởng (Mốc chuẩn 2013 = 100)
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                Tốc độ bứt phá tương đối: Toàn quốc vs. Cố đô Kyoto vs. Cố đô Nara (2013–2019)
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-500" /> Toàn quốc
              </span>
              <span className="flex items-center gap-1.5 text-[#074553] dark:text-[#9BE7FA]">
                <span className="w-3 h-3 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" /> Cố đô Kyoto
              </span>
              <span className="flex items-center gap-1.5 text-amber-800 dark:text-[#FFE485]">
                <span className="w-3 h-3 rounded-full bg-[#FFD14C]" /> Cố đô Nara
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {HERITAGE_JAPAN_DATA.indexedGrowth2013To2019
              .filter((r) => ['2013', '2015', '2017', '2018', '2019'].includes(r.year))
              .map((row) => (
                <div key={row.year} className="space-y-2 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap justify-between items-center text-sm font-medium gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-base">Năm {row.year}</span>
                    <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                      Toàn Nhật: <b className="text-slate-900 dark:text-white">{row.japan}</b> | Kyoto:{' '}
                      <b className="text-[#0D7287] dark:text-[#9BE7FA]">{row.kyoto}</b> | Nara:{' '}
                      <b className="text-amber-700 dark:text-[#FFE485] font-bold">{row.nara}</b>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Toàn quốc</span>
                        <span className="font-bold">{row.japan}</span>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-slate-500 h-full rounded-full transition-[width] duration-300"
                          style={{ width: `${Math.max((row.japan / 800) * 100, 6)}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-[#074553] dark:text-[#9BE7FA]">
                        <span>Cố đô Kyoto</span>
                        <span className="font-bold">{row.kyoto}</span>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-[#0D7287] dark:bg-[#9BE7FA] h-full rounded-full transition-[width] duration-300"
                          style={{ width: `${Math.max((row.kyoto / 800) * 100, 6)}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-amber-700 dark:text-[#FFE485]">
                        <span>Cố đô Nara</span>
                        <span className="font-bold">{row.nara}</span>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-[#FFD14C] h-full rounded-full transition-[width] duration-300"
                          style={{ width: `${Math.max((row.nara / 800) * 100, 6)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[#C8EEF7]/25 border border-[#9BE7FA]/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <strong className="text-[#074553] dark:text-[#9BE7FA]">Insight cốt lõi: </strong> 
            Giai đoạn 2013–2019, khách quốc tế toàn Nhật tăng 3,07 lần (chỉ số 307), trong khi Kyoto tăng tới <strong>5,33 lần (chỉ số 533)</strong> và Nara bùng nổ kỷ lục tới <strong>7,63 lần (chỉ số 763)</strong>. Kết quả chỉ số hóa chứng minh các đô thị di sản UNESCO có tốc độ hút khách vượt xa trung bình quốc gia gấp 2,5 lần, tạo ra xung lực kinh tế vượt bậc nhưng cũng đẩy hạ tầng vào tình trạng quá tải nghiêm trọng.
          </div>
        </div>
      </section>

      {/* PHẦN 2: THỐNG KÊ TẠI CÁC ĐIỂM ĐẾN DI SẢN TRỌNG ĐIỂM (CỐ ĐÔ KYOTO & NARA) */}
      <section className="space-y-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F0F9FB] dark:bg-slate-900 border-2 border-[#0D7287]/25 dark:border-[#9BE7FA]/25 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 text-xs sm:text-sm font-black tabular-nums tracking-wide shadow-2xs">
              PHẦN 2
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Khảo sát Điểm đến Di sản Thế giới UNESCO
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
            2. Bức tranh lượng khách và doanh thu tại Cố đô Kyoto & Cố đô Nara
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-3xl leading-relaxed">
            Đối soát tốc độ phục hồi, cơ cấu chi tiêu thực tế và hiện tượng day-trippers tạo độ lệch nguồn thu địa phương.
          </p>
        </div>

        {/* BỘ ĐÔI LƯỢNG KHÁCH 2 CỐ ĐÔ (GRID 2 CỘT SONG SONG): KYOTO & NARA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* BIỂU ĐỒ 4: KHÁCH ĐẾN CỐ ĐÔ KYOTO */}
          <div className="rounded-2xl p-5 sm:p-6 lg:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  Biểu đồ 4 (Gốc 3.2) : Đơn vị: Nghìn người
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] border border-[#9BE7FA]/40">
                  Đỉnh 2019: 4.503,3 nghìn
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white min-h-[52px] flex items-center">
                Khách du lịch quốc tế đến Cố đô Kyoto (2008–2023)
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" /> Năm thường
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0D7287] dark:bg-[#9BE7FA]" /> Tăng tốc 2013–2018
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C]" /> Đỉnh 2019
                </span>
              </div>

              {/* Thang đo chung trục Y */}
              <div className="w-full pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 px-1">
                  <span className="font-medium">Thang đo trục Y (Nghìn người)</span>
                  <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA] bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/15 px-2 py-0.5 rounded-md">
                    Thang chuẩn: Mốc 1.000 nghìn = 36px (Đồng nhất 2 biểu đồ)
                  </span>
                </div>

                <div className="relative w-full">
                  {/* Đường lưới tham chiếu trục Y chung (Shared Gridlines) */}
                  <div className="absolute inset-0 pointer-events-none z-0" data-ui="chart-grid">
                    {/* Mức 4.000 */}
                    <div data-ui="chart-gridline" className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between px-1" style={{ bottom: '144px' }}>
                      <span className="text-[9px] tabular-nums font-bold text-slate-400 dark:text-slate-500 -mt-3.5 bg-white/90 dark:bg-slate-900/90 px-1 rounded">4.000</span>
                    </div>
                    {/* Mức 3.000 */}
                    <div data-ui="chart-gridline" className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between px-1" style={{ bottom: '108px' }}>
                      <span className="text-[9px] tabular-nums font-bold text-slate-400 dark:text-slate-500 -mt-3.5 bg-white/90 dark:bg-slate-900/90 px-1 rounded">3.000</span>
                    </div>
                    {/* Mức 2.000 */}
                    <div data-ui="chart-gridline" className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between px-1" style={{ bottom: '72px' }}>
                      <span className="text-[9px] tabular-nums font-bold text-slate-400 dark:text-slate-500 -mt-3.5 bg-white/90 dark:bg-slate-900/90 px-1 rounded">2.000</span>
                    </div>
                    {/* Mức 1.000 - ĐIỂM NHẤN TRỤC CHUNG */}
                    <div data-ui="chart-gridline" className="absolute w-full border-t border-dashed border-[#0D7287]/40 dark:border-[#9BE7FA]/40 flex items-center justify-between px-1" style={{ bottom: '36px' }}>
                      <span className="text-[9px] tabular-nums font-black text-[#0D7287] dark:text-[#9BE7FA] -mt-3.5 bg-[#C8EEF7]/70 dark:bg-[#0D7287]/40 px-1.5 py-0.5 rounded shadow-2xs">
                        1.000
                      </span>
                    </div>
                  </div>

                  {/* Vùng cột biểu đồ (Hiển thị đầy đủ 16 cột 2008-2023 không bị cắt) */}
                  <div className="h-60 flex items-end gap-1 sm:gap-1.5 px-1 border-b-2 border-slate-200 dark:border-slate-700 relative z-10">
                    {HERITAGE_JAPAN_DATA.kyotoVisitors.map((d) => {
                      const barHeight = Math.max(Math.round((d.value / 5000) * 180), 4);
                      const isPeak = d.year === '2019';
                      const isBoom = Number(d.year) >= 2013 && Number(d.year) <= 2019;
                      return (
                        <div key={d.year} className="flex-1 flex flex-col items-center justify-end h-full group min-w-0">
                          <span
                            className={`text-[8px] sm:text-[9px] lg:text-xs font-bold mb-1 transition-transform group-hover:scale-110 select-none tabular-nums truncate max-w-full ${
                              isPeak
                                ? 'text-[#92400E] dark:text-[#FFD14C] font-black'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {Math.round(d.value)}
                          </span>
                          <div
                            style={{ height: `${barHeight}px` }}
                            className={`w-full max-w-[18px] sm:max-w-[22px] rounded-t-md transition-opacity duration-300 group-hover:opacity-90 ${
                              isPeak
                                ? 'bg-[#FFD14C]'
                                : isBoom
                                ? 'bg-[#0D7287] dark:bg-[#9BE7FA]'
                                : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            title={`${d.year}: ${d.value} nghìn người`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Trục hoành năm */}
                  <div className="flex gap-1 sm:gap-1.5 px-1 pt-2">
                    {HERITAGE_JAPAN_DATA.kyotoVisitors.map((d) => (
                      <div key={d.year} className="flex-1 text-center min-w-0">
                        <span
                          className={`text-[9px] sm:text-xs lg:text-xs font-medium block truncate ${
                            d.year === '2019'
                              ? 'text-slate-950 dark:text-[#FFD14C] font-extrabold'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <span className="hidden sm:inline">{d.year}</span>
                          <span className="sm:hidden">{d.year.slice(2)}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-5 leading-relaxed pt-3">
              <strong>Nhận xét:</strong> Kyoto tăng từ 1,13 triệu khách (2013) lên đỉnh 4,50 triệu khách (2019) – tăng gần <strong>4 lần</strong> chỉ trong 6 năm. Đến năm 2023, lượng khách đã hồi phục mạnh mẽ đạt 3,14 triệu lượt.
            </p>
          </div>

          {/* BIỂU ĐỒ 5: KHÁCH ĐẾN CỐ ĐÔ NARA */}
          <div className="rounded-2xl p-5 sm:p-6 lg:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  Biểu đồ 5 (Gốc 3.3) : Đơn vị: Nghìn người
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] border border-[#9BE7FA]/40">
                  Đỉnh 2019: 3.318 nghìn
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white min-h-[52px] flex items-center">
                Khách du lịch quốc tế đến Cố đô Nara (2009–2020)
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" /> Trước 2013 / COVID-19
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C] dark:bg-[#FFE485]" /> Tăng tốc 2013–2018
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C]" /> Đỉnh 2019
                </span>
              </div>

              {/* Thang đo chung trục Y */}
              <div className="w-full pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 px-1">
                  <span className="font-medium">Thang đo trục Y (Nghìn người)</span>
                  <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA] bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/15 px-2 py-0.5 rounded-md">
                    Thang chuẩn: Mốc 1.000 nghìn = 36px (Đồng nhất 2 biểu đồ)
                  </span>
                </div>

                <div className="relative w-full">
                  {/* Đường lưới tham chiếu trục Y chung (Shared Gridlines) */}
                  <div className="absolute inset-0 pointer-events-none z-0" data-ui="chart-grid">
                    {/* Mức 4.000 */}
                    <div data-ui="chart-gridline" className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between px-1" style={{ bottom: '144px' }}>
                      <span className="text-[9px] tabular-nums font-bold text-slate-400 dark:text-slate-500 -mt-3.5 bg-white/90 dark:bg-slate-900/90 px-1 rounded">4.000</span>
                    </div>
                    {/* Mức 3.000 */}
                    <div data-ui="chart-gridline" className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between px-1" style={{ bottom: '108px' }}>
                      <span className="text-[9px] tabular-nums font-bold text-slate-400 dark:text-slate-500 -mt-3.5 bg-white/90 dark:bg-slate-900/90 px-1 rounded">3.000</span>
                    </div>
                    {/* Mức 2.000 */}
                    <div data-ui="chart-gridline" className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between px-1" style={{ bottom: '72px' }}>
                      <span className="text-[9px] tabular-nums font-bold text-slate-400 dark:text-slate-500 -mt-3.5 bg-white/90 dark:bg-slate-900/90 px-1 rounded">2.000</span>
                    </div>
                    {/* Mức 1.000 - ĐIỂM NHẤN TRỤC CHUNG */}
                    <div data-ui="chart-gridline" className="absolute w-full border-t border-dashed border-[#0D7287]/40 dark:border-[#9BE7FA]/40 flex items-center justify-between px-1" style={{ bottom: '36px' }}>
                      <span className="text-[9px] tabular-nums font-black text-[#0D7287] dark:text-[#9BE7FA] -mt-3.5 bg-[#C8EEF7]/70 dark:bg-[#0D7287]/40 px-1.5 py-0.5 rounded shadow-2xs">
                        1.000
                      </span>
                    </div>
                  </div>

                  {/* Vùng cột biểu đồ (Hiển thị đầy đủ 12 cột 2009-2020 không bị cắt) */}
                  <div className="h-60 flex items-end gap-1 sm:gap-1.5 px-1 border-b-2 border-slate-200 dark:border-slate-700 relative z-10">
                    {HERITAGE_JAPAN_DATA.naraVisitors.map((d) => {
                      const barHeight = Math.max(Math.round((d.value / 5000) * 180), 4);
                      const isPeak = d.year === '2019';
                      const isBoom = Number(d.year) >= 2013 && Number(d.year) <= 2019;
                      return (
                        <div key={d.year} className="flex-1 flex flex-col items-center justify-end h-full group min-w-0">
                          <span
                            className={`text-[8px] sm:text-[9px] lg:text-xs font-bold mb-1 transition-transform group-hover:scale-110 select-none tabular-nums truncate max-w-full ${
                              isPeak
                                ? 'text-[#92400E] dark:text-[#FFD14C] font-black'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {d.value}
                          </span>
                          <div
                            style={{ height: `${barHeight}px` }}
                            className={`w-full max-w-[18px] sm:max-w-[22px] rounded-t-md transition-opacity duration-300 group-hover:opacity-90 ${
                              isPeak
                                ? 'bg-[#FFD14C]'
                                : isBoom
                                ? 'bg-[#FFD14C] dark:bg-[#FFE485]'
                                : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            title={`${d.year}: ${d.value} nghìn người`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Trục hoành năm */}
                  <div className="flex gap-1 sm:gap-1.5 px-1 pt-2">
                    {HERITAGE_JAPAN_DATA.naraVisitors.map((d) => (
                      <div key={d.year} className="flex-1 text-center min-w-0">
                        <span
                          className={`text-[9px] sm:text-xs lg:text-xs font-medium block truncate ${
                            d.year === '2019'
                              ? 'text-slate-950 dark:text-[#FFD14C] font-extrabold'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <span className="hidden sm:inline">{d.year}</span>
                          <span className="sm:hidden">{d.year.slice(2)}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-5 leading-relaxed pt-3">
              <strong>Nhận xét:</strong> Từ mức khiêm tốn 435 nghìn khách (2013), Nara duy trì đà tăng trưởng 40–60%/năm và đạt đỉnh <strong>3.318 nghìn lượt</strong> vào năm 2019 (tăng gấp 7,6 lần trước đại dịch).
            </p>
          </div>
        </div>

        {/* BIỂU ĐỒ 6 (FULL WIDTH): SO SÁNH CHI TIÊU DU LỊCH KYOTO VS NARA & NGHỊCH LÝ LƯU TRÚ */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <div>
              <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                Biểu đồ 6 (Gộp Gốc 3.5 & 3.6) : Đơn vị: Tỷ Yên
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                So sánh Chi tiêu Du lịch giữa Cố đô Kyoto và Cố đô Nara (2014–2020)
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#074553] dark:text-[#9BE7FA]">
                <span className="w-3 h-3 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" /> Cố đô Kyoto
              </span>
              <span className="flex items-center gap-1.5 text-amber-800 dark:text-[#FFE485]">
                <span className="w-3 h-3 rounded-full bg-[#FFD14C]" /> Cố đô Nara
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {['2014', '2016', '2017', '2018', '2019', '2020'].map((yr) => {
              const kVal =
                HERITAGE_JAPAN_DATA.kyotoSpending.find((x) => x.year === yr)?.value || 0;
              const nVal =
                HERITAGE_JAPAN_DATA.naraSpending.find((x) => x.year === yr)?.value || 0;
              return (
                <div key={yr} className="space-y-2 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap justify-between items-center text-sm font-medium gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-base">Năm {yr}</span>
                    <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                      Kyoto: <b className="text-[#0D7287] dark:text-[#9BE7FA]">{kVal.toLocaleString()} tỷ ¥</b>{' '}
                      | Nara: <b className="text-amber-700 dark:text-[#FFE485] font-bold">{nVal.toLocaleString()} tỷ ¥</b>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-[#074553] dark:text-[#9BE7FA]">
                        <span>Kyoto</span>
                        <span className="font-bold">{kVal} tỷ ¥</span>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-[#0D7287] dark:bg-[#9BE7FA] rounded-full transition-[width] duration-300"
                          style={{ width: `${Math.max((kVal / 1400) * 100, 6)}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-amber-700 dark:text-[#FFE485]">
                        <span>Nara</span>
                        <span className="font-bold">{nVal} tỷ ¥</span>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-[#FFD14C] rounded-full transition-[width] duration-300"
                          style={{ width: `${Math.max((nVal / 1400) * 100, 6)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 sm:p-5 rounded-xl bg-[#C8EEF7]/25 border border-[#9BE7FA]/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <strong className="text-[#074553] dark:text-[#9BE7FA]">Nghịch lý phân bổ chi tiêu năm 2019 tại Nara: </strong>
            Dù lượng khách quốc tế đến Nara bùng nổ <strong>+25,1%</strong> (từ 2,65 triệu lên đỉnh 3,318 triệu lượt), tổng chi tiêu du lịch thực tế tại Nara lại giảm từ 1.208 xuống còn 1.147,2 tỷ Yên. Nguyên nhân là do <strong>hiện tượng khách đi về trong ngày (day-trippers)</strong>: Khách chủ yếu chọn lưu trú khách sạn qua đêm tại Kyoto hoặc Osaka và chỉ ghé Nara tham quan ngắn hạn. Chi tiêu của du khách chủ yếu rơi vào tiền vé tàu di chuyển thay vì tạo nguồn thu dịch vụ lưu trú, ẩm thực và mua sắm lưu niệm tại địa phương.
          </div>
        </div>
      </section>

      {/* PHẦN 3: QUÁ TẢI DU LỊCH (OVERTOURISM) & ĐỐI SÁCH ĐỊA PHƯƠNG */}
      <section className="space-y-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F0F9FB] dark:bg-slate-900 border-2 border-[#0D7287]/25 dark:border-[#9BE7FA]/25 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 text-xs sm:text-sm font-black tabular-nums tracking-wide shadow-2xs">
              PHẦN 3
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              Áp lực Bảo tồn & Quản trị Sức chứa
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
            3. Hệ lụy quá tải hạ tầng và ma trận can thiệp tại 5 Di sản Thế giới
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-3xl leading-relaxed">
            Đánh giá nút thắt lưu trú, xung đột dân sinh và phân tích hiệu quả các công cụ điều tiết quá tải du lịch.
          </p>
        </div>

        {/* BIỂU ĐỒ 7 & 8 (2 CỘT): CUNG - CẦU PHÒNG KYOTO & QUY MÔ ĐIỂM NÓNG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BIỂU ĐỒ 7: CƠ CẤU NỘI ĐỊA VS QUỐC TẾ & LỆCH CUNG CẦU KYOTO */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                Biểu đồ 7 : Nút thắt lưu trú & Kinh tế Kyoto (2014 vs 2019)
              </span>
              <h3 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                Độ lệch Cung : Cầu Phòng Khách sạn & Đóng góp Kinh tế Kyoto
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#C8EEF7]/30 border border-[#9BE7FA]/40">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Khách quốc tế đến Kyoto
                </p>
                <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">
                  1,13M → 4,50M
                </p>
                <p className="text-sm font-semibold text-[#0D7287] dark:text-[#9BE7FA] mt-1">
                  Tăng +300% (Gấp 4 lần sau 5 năm)
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#C8EEF7]/30 border border-[#9BE7FA]/40">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Nguồn cung phòng khách sạn
                </p>
                <p className="text-2xl font-extrabold text-[#0D7287] dark:text-[#9BE7FA] mt-1">
                  &lt;30.000 → 53.000
                </p>
                <p className="text-sm font-semibold text-[#0D7287] dark:text-[#9BE7FA] mt-1">
                  Chỉ tăng +76,7% (Thiếu hụt nặng)
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {HERITAGE_JAPAN_DATA.economicShareComparison.slice(3).map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.metric}</span>
                    <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                      {item.share}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0D7287] dark:bg-[#9BE7FA] rounded-full transition-transform duration-300"
                      style={{ width: `${Math.max((item.share / 15) * 100, 6)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BIỂU ĐỒ 8: ÁP LỰC TẠI CÁC ĐIỂM NÓNG DI SẢN */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                Biểu đồ 8 : Cường độ quá tải tại các Di sản nhạy cảm (2019)
              </span>
              <h3 className="text-xl font-bold mt-1 mb-6 text-slate-900 dark:text-white">
                Quy mô khách tại 5 điểm nóng Overtourism (Triệu lượt)
              </h3>

              <div className="space-y-4">
                {HERITAGE_JAPAN_DATA.overtourismHotspots.map((h, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-900 dark:text-white">{h.site}</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {h.visitorsMillion} triệu lượt
                      </span>
                    </div>
                    <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FFD14C] rounded-full transition-transform duration-300"
                        style={{ width: `${Math.max((h.visitorsMillion / 5.5) * 100, 6)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-5 leading-relaxed">
              Tại làng cổ Shirakawa-go, lượng khách 1,8 triệu người/năm gấp <strong>3.000 lần</strong> quy mô dân số bản địa (~600 người), buộc chính quyền phải giới hạn đặt chỗ trước.
            </p>
          </div>
        </div>

        {/* BẢNG MA TRẬN 5 CASE STUDIES (CHỮ LỚN, THOÁNG) */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Tổng hợp Giải pháp Quản trị & Bảo tồn tại 5 Di sản Thế giới
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs sm:text-sm uppercase">
                <tr>
                  <th className="p-5">Di sản & Địa phương</th>
                  <th className="p-5">Áp lực Dữ liệu</th>
                  <th className="p-5">Vấn đề Phát sinh</th>
                  <th className="p-5">Can thiệp Chính sách</th>
                </tr>
              </thead>
              <tbody className="[&>tr:nth-child(even)]:bg-slate-50 dark:[&>tr:nth-child(even)]:bg-slate-800/40">
                {HERITAGE_JAPAN_DATA.caseStudies.map((cs, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="p-5 font-bold whitespace-nowrap align-top">
                      <div className="text-base text-slate-900 dark:text-white">{cs.site}</div>
                      <div className="text-sm font-normal text-slate-500 mt-0.5">
                        {cs.prefecture}
                      </div>
                    </td>
                    <td className="p-5 font-bold text-slate-950 dark:text-white align-top">
                      {cs.pressureMetric}
                    </td>
                    <td className="p-5 text-slate-600 dark:text-slate-300 leading-relaxed max-w-md align-top">
                      {cs.coreIssue}
                    </td>
                    <td className="p-5 text-slate-700 dark:text-slate-200 leading-relaxed max-w-md align-top">
                      {cs.intervention}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PHẦN 4: THỪA NHẬN CÁC THIẾU SÓT CỦA NIÊN LUẬN GỐC (DATA AUDIT) */}
      <section className="rounded-3xl p-6 sm:p-8 bg-[#F0F9FB] dark:bg-slate-900 border-2 border-[#0D7287]/25 dark:border-[#9BE7FA]/25 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 text-xs sm:text-sm font-black tabular-nums tracking-wide shadow-2xs">
                PHẦN 4
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                Data Audit & Phản biện Học thuật
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
              4. Thừa nhận các thiếu sót của bài niên luận gốc (2023–2024)
            </h2>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] text-sm font-bold border border-[#9BE7FA]/40">
            5 Giới hạn Phương pháp luận & Dữ liệu
          </span>
        </div>

        <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
          Bài niên luận gốc được thực hiện vào năm 2023 – đầu năm 2024 dưới góc độ nghiên cứu Nhật Bản học. Khi chuyển hóa công trình này thành một dự án phân tích dữ liệu (Data Analytics Portfolio), tôi chủ động nhìn nhận và hiệu đính 5 thiếu sót tồn tại trong bản gốc:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {HERITAGE_JAPAN_DATA.thesisLimitations.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                  {item.id} : {item.category}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                    item.severity === 'Cao'
                      ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                      : item.severity === 'Đã hiệu đính'
                      ? 'bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#074553]/60 dark:text-[#9BE7FA]'
                      : 'bg-[#FFD14C]/20 text-slate-800 dark:text-[#FFD14C]'
                  }`}
                >
                  {item.severity}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">
                  Hạn chế trong niên luận:{' '}
                </strong>
                {item.flawInThesis}
              </p>

              <div className="text-sm sm:text-base text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 leading-relaxed">
                <strong className="text-[#0D7287] dark:text-[#9BE7FA]">
                  Khắc phục trên Portfolio:{' '}
                </strong>
                {item.portfolioFix}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MODAL: XEM 6 BIỂU ĐỒ GỐC TRONG NIÊN LUẬN (ORIGINAL SCAN) */}
      {isProofModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 bg-slate-100/70 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#FFD14C]" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Đối chứng 6 Biểu đồ Gốc trong Bản in Niên luận (Scan)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Khoa Đông Phương học, Trường ĐH KHXH&NV : ĐHQGHN (Tháng 01/2024)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProofModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex overflow-x-auto gap-2 p-3 bg-slate-100/40 dark:bg-slate-950/50">
              {THESIS_ORIGINAL_FIGURES.map((fig) => {
                const isSelected = selectedFigureId === fig.id;
                return (
                  <button
                    key={fig.id}
                    onClick={() => setSelectedFigureId(fig.id)}
                    className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#9BE7FA] text-slate-950 font-bold'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{fig.id}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Tr.{fig.page}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/80">
              <div className="text-center mb-3">
                <p className="text-base font-bold text-slate-900 dark:text-white">{activeFigure.titleVi}</p>
                <p className="text-xs text-slate-500">Số trang trong tài liệu gốc: Trang {activeFigure.page}</p>
              </div>
              <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 dark:border-slate-700 p-3 overflow-hidden flex items-center justify-center min-h-[280px]">
                <Image
                  src={activeFigure.src}
                  alt={activeFigure.titleVi}
                  width={720}
                  height={450}
                  className="rounded object-contain w-auto h-auto max-h-[50vh]"
                  priority
                />
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center max-w-lg">
                Ảnh chụp nguyên bản từ văn bản niên luận bảo vệ trước hội đồng ĐHQGHN, dùng làm cơ sở đối chiếu cho các biểu đồ trên web portfolio.
              </p>
            </div>

            <div className="p-4 flex justify-end bg-slate-100/70 dark:bg-slate-800/60">
              <button
                onClick={() => setIsProofModalOpen(false)}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. UNIFIED CASE STUDY FOOTER */}
      <CaseStudyFooter
        isEn={isEn}
        currentProjectId="proj-heritage-japan"
        attribution={{
          datasetVi: 'Dữ liệu chuỗi thời gian MLIT (Bộ Đất đai, Cơ sở hạ tầng, Giao thông & Du lịch Nhật Bản) & JNTO',
          datasetEn: 'MLIT (Ministry of Land, Infrastructure, Transport & Tourism) & JNTO Telemetry',
          scopeVi: 'Chuỗi thời gian 2003–2023, 25 di sản UNESCO và 47 tỉnh thành Nhật Bản',
          scopeEn: '2003–2023 time-series, 25 UNESCO sites across 47 Japanese prefectures',
        }}
      />
    </div>
  );
}
