'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { HERITAGE_JAPAN_DATA } from '@/app/data/heritageJapanData';
import CaseStudyFooter from './shared/CaseStudyFooter';
import {
  ArrowLeft,
  Eye,
  X,
  FileText,
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
  onBack,
  isEmbedded: _isEmbedded,
  initialData: _initialData,
}: HeritageJapanProjectProps = {}) {
  const router = useRouter();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [isProofModalOpen, setIsProofModalOpen] = useState<boolean>(false);
  const [selectedFigureId, setSelectedFigureId] = useState<string>('3.1');

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Niên luận Du lịch Di sản Nhật Bản (Ma Văn Hùng)', 'proj-heritage-japan', 'project');
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  const activeFigure = THESIS_ORIGINAL_FIGURES.find((f) => f.id === selectedFigureId) || THESIS_ORIGINAL_FIGURES[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* =====================================================================
          HERO & KPI SUMMARY
         ===================================================================== */}
      <header className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-slate-700/60 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-[#9BE7FA]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/10 text-sm font-semibold cursor-pointer transition min-h-[44px]"
              aria-label={isEn ? 'Back to projects' : 'Quay lại danh mục'}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isEn ? 'Back' : 'Quay lại'}</span>
            </button>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[#FFD14C]/20 text-[#FFE485] border border-[#FFD14C]/30">
              <FileText className="w-4 h-4" />
              Case Study từ Niên luận ĐHQGHN (2023–2024)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProofModalOpen(true)}
              className="min-h-[44px] text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl border border-[#FFE485]/60 bg-[#FFE485]/10 text-amber-200 hover:bg-[#FFE485]/20 transition cursor-pointer flex items-center gap-2"
              title="Xem 6 file scan biểu đồ gốc trong niên luận"
            >
              <Eye className="w-4 h-4 text-[#FFD14C]" />
              <span>{isEn ? 'View Original Figures' : 'Xem 6 Biểu đồ Gốc'}</span>
            </button>
            <span className="text-xs sm:text-sm text-slate-300 font-medium hidden sm:inline-block">
              {HERITAGE_JAPAN_DATA.meta.institution}
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white">
          {HERITAGE_JAPAN_DATA.meta.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-4xl leading-relaxed mb-10">
          {HERITAGE_JAPAN_DATA.meta.subtitle}
        </p>

        {/* 4 KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {HERITAGE_JAPAN_DATA.kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-[#9BE7FA]/50 transition duration-200"
            >
              <p className="text-sm font-medium text-slate-300">{kpi.label}</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#FFE485] mt-2">
                {kpi.value}
              </p>
              <p className="text-sm font-semibold text-[#9BE7FA] mt-2">{kpi.delta}</p>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">{kpi.desc}</p>
            </div>
          ))}
        </div>
      </header>

      {/* =====================================================================
          PHẦN 1: BỐI CẢNH CHÍNH SÁCH & TĂNG TRƯỞNG VĨ MÔ
         ===================================================================== */}
      <section className="space-y-10">
        <div className="space-y-2">
          <span className="text-sm font-bold uppercase tracking-wider text-sky-600 dark:text-[#9BE7FA] flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Phần 1 : Bối cảnh Chính sách & Kinh tế Vĩ mô
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Đòn bẩy chính sách năm 2013 và cú hích du lịch quốc tế
          </h2>
        </div>

        {/* 3 Trụ cột chính sách */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HERITAGE_JAPAN_DATA.policyPillars.map((p, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-[#9BE7FA]/20 text-sky-800 dark:text-[#9BE7FA] mb-3">
                {p.year} : {p.focus}
              </span>
              <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">{p.name}</h3>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                {p.highlights.map((h, j) => (
                  <li key={j}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BIỂU ĐỒ 1 (FULL WIDTH): KHÁCH QUỐC TẾ ĐẾN NHẬT BẢN */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-[#9BE7FA]">
                Biểu đồ 1 (Gốc 3.1) : Đơn vị: Triệu người
              </span>
              <h3 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                Số lượng khách du lịch nước ngoài đến Nhật Bản (2003–2022)
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" /> Trước 2013 / Hậu Covid
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 dark:bg-[#9BE7FA]" /> Tăng trưởng 2013–2018
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C]" /> Đỉnh 2019
                </span>
              </div>
              <span className="px-3.5 py-1.5 rounded-lg bg-[#FFE485]/30 text-amber-900 dark:text-[#FFE485] text-sm font-bold">
                Đỉnh lịch sử: 31,9 triệu lượt (2019)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-[760px]">
              {/* Bars container with explicit height and bottom baseline */}
              <div className="h-64 flex items-end gap-2.5 sm:gap-3 px-2 border-b-2 border-slate-200 dark:border-slate-700">
                {HERITAGE_JAPAN_DATA.japanVisitors.map((d) => {
                  const barHeight = Math.max(Math.round((d.value / 34) * 190), 8);
                  const isBoom = Number(d.year) >= 2013 && Number(d.year) <= 2019;
                  const isPeak = d.year === '2019';
                  return (
                    <div key={d.year} className="flex-1 flex flex-col items-center justify-end h-full group">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 transition-transform group-hover:scale-110 select-none">
                        {d.value}
                      </span>
                      <div
                        style={{ height: `${barHeight}px` }}
                        className={`w-full rounded-t-md transition-all duration-300 group-hover:opacity-90 ${
                          isPeak
                            ? 'bg-[#FFD14C] shadow-[0_0_12px_rgba(255,209,76,0.5)]'
                            : isBoom
                            ? 'bg-sky-500 dark:bg-[#9BE7FA]'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={`${d.year}: ${d.value} triệu người ${d.note ? `(${d.note})` : ''}`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-axis year labels below baseline */}
              <div className="flex gap-2.5 sm:gap-3 px-2 pt-2.5">
                {HERITAGE_JAPAN_DATA.japanVisitors.map((d) => (
                  <div key={d.year} className="flex-1 text-center">
                    <span
                      className={`text-[11px] sm:text-xs font-medium block truncate ${
                        d.year === '2019'
                          ? 'text-amber-600 dark:text-[#FFD14C] font-bold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {d.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-5 leading-relaxed">
            <strong>Nhận xét:</strong> Trước năm 2013, lượng khách quốc tế chỉ đi ngang ở mức 5,2 – 8,6 triệu lượt/năm. Ngay sau khi ban hành <em>Chương trình hành động hướng tới quốc gia du lịch (06/2013)</em>, lượng khách tăng tốc liên tục và đạt đỉnh 31,9 triệu lượt vào năm 2019.
          </p>
        </div>

        {/* BIỂU ĐỒ 2 & 3 (2 CỘT THOÁNG): CHI TIÊU QUỐC TẾ & CHỈ SỐ HÓA TĂNG TRƯỞNG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BIỂU ĐỒ 2 */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-[#9BE7FA]">
                  Biểu đồ 2 (Gốc 3.4) : Đơn vị: Nghìn tỷ Yên
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#FFD14C]/20 text-amber-900 dark:text-[#FFE485]">
                  Đỉnh 2019: 4,81 nghìn tỷ ¥
                </span>
              </div>
              <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                Chi tiêu của khách quốc tế tại Nhật (2010–2021)
              </h3>

              <div className="overflow-x-auto pb-2">
                <div className="min-w-[480px]">
                  {/* Bars container */}
                  <div className="h-56 flex items-end gap-2.5 sm:gap-3 px-2 border-b-2 border-slate-200 dark:border-slate-700">
                    {HERITAGE_JAPAN_DATA.japanSpending.map((d) => {
                      const barHeight = Math.max(Math.round((d.value / 5.2) * 160), 8);
                      const isPeak = d.year === '2019';
                      const isBoom = Number(d.year) >= 2013 && Number(d.year) < 2020;
                      return (
                        <div key={d.year} className="flex-1 flex flex-col items-center justify-end h-full group">
                          <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 transition-transform group-hover:scale-110 select-none">
                            {d.value}
                          </span>
                          <div
                            style={{ height: `${barHeight}px` }}
                            className={`w-full rounded-t-md transition-all duration-300 group-hover:opacity-90 ${
                              isPeak
                                ? 'bg-[#FFD14C] shadow-[0_0_12px_rgba(255,209,76,0.5)]'
                                : isBoom
                                ? 'bg-sky-500 dark:bg-[#9BE7FA]'
                                : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            title={`${d.year}: ${d.value} nghìn tỷ Yên`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* X-axis year labels */}
                  <div className="flex gap-2.5 sm:gap-3 px-2 pt-2.5">
                    {HERITAGE_JAPAN_DATA.japanSpending.map((d) => (
                      <div key={d.year} className="flex-1 text-center">
                        <span
                          className={`text-[11px] sm:text-xs font-medium block truncate ${
                            d.year === '2019'
                              ? 'text-amber-600 dark:text-[#FFD14C] font-bold'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {d.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-5 leading-relaxed">
              Chi tiêu tăng gấp <strong>3,41 lần</strong> từ 1,41 nghìn tỷ Yên (2013) lên đỉnh 4,81 nghìn tỷ Yên (2019) nhờ chính sách miễn thuế tiêu dùng (Tax-free) và nới lỏng thời gian lưu trú.
            </p>
          </div>

          {/* BIỂU ĐỒ 3 */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-[#9BE7FA]">
                  Biểu đồ 3 : Chỉ số hóa tốc độ tăng trưởng (Mốc 2013 = 100)
                </span>
                <div className="flex items-center gap-3 text-xs font-medium">
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Toàn quốc
                  </span>
                  <span className="flex items-center gap-1 text-sky-600 dark:text-[#9BE7FA]">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-[#9BE7FA]" /> Kyoto
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-[#FFE485]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD14C]" /> Nara
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold mt-1 mb-6 text-slate-900 dark:text-white">
                Tốc độ bứt phá: Toàn quốc vs. Kyoto vs. Nara (2013–2019)
              </h3>

              <div className="space-y-4">
                {HERITAGE_JAPAN_DATA.indexedGrowth2013To2019
                  .filter((r) => ['2013', '2015', '2017', '2018', '2019'].includes(r.year))
                  .map((row) => (
                    <div key={row.year} className="space-y-1.5">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="font-bold text-slate-900 dark:text-white">Năm {row.year}</span>
                        <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                          Nhật: <b>{row.japan}</b> | Kyoto:{' '}
                          <b className="text-sky-600 dark:text-[#9BE7FA]">{row.kyoto}</b> | Nara:{' '}
                          <b className="text-amber-600 dark:text-[#FFE485]">{row.nara}</b>
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-slate-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.max((row.japan / 800) * 100, 6)}%` }}
                          />
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-sky-500 dark:bg-[#9BE7FA] h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.max((row.kyoto / 800) * 100, 6)}%` }}
                          />
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-[#FFD14C] h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.max((row.nara / 800) * 100, 6)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-5 leading-relaxed">
              <strong>Insight cốt lõi:</strong> Giai đoạn 2013–2019, khách quốc tế toàn Nhật tăng 3,07 lần, nhưng Kyoto tăng tới <strong>5,33 lần</strong> và Nara tăng <strong>7,63 lần</strong>, phản ánh các đô thị di sản tăng trưởng vượt xa mức trung bình quốc gia.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHẦN 2: THỐNG KÊ TẠI CÁC ĐIỂM ĐẾN DI SẢN TRỌNG ĐIỂM (KYOTO, NARA, PHÚ SĨ)
         ===================================================================== */}
      <section className="space-y-10">
        <div className="space-y-2">
          <span className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-[#FFE485] flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Phần 2 : Khảo sát Điểm đến Di sản Thế giới UNESCO
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Bức tranh lượng khách và doanh thu tại Kyoto, Nara & Núi Phú Sĩ
          </h2>
        </div>

        {/* BIỂU ĐỒ 4 (FULL WIDTH): KHÁCH QUỐC TẾ ĐẾN KYOTO */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-[#9BE7FA]">
                Biểu đồ 4 (Gốc 3.2) : Đơn vị: Nghìn người
              </span>
              <h3 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                Số lượng khách du lịch nước ngoài đến Thành phố Kyoto (2008–2023)
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" /> Năm thường
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 dark:bg-[#9BE7FA]" /> Tăng tốc 2013–2018
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFD14C]" /> Đỉnh 2019
                </span>
              </div>
              <span className="px-3.5 py-1.5 rounded-lg bg-[#9BE7FA]/20 text-sky-800 dark:text-[#9BE7FA] text-sm font-bold">
                Đỉnh: 4.503,3 nghìn khách (2019)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-[720px]">
              {/* Bars container */}
              <div className="h-64 flex items-end gap-2.5 sm:gap-3 px-2 border-b-2 border-slate-200 dark:border-slate-700">
                {HERITAGE_JAPAN_DATA.kyotoVisitors.map((d) => {
                  const barHeight = Math.max(Math.round((d.value / 4800) * 190), 8);
                  const isPeak = d.year === '2019';
                  const isBoom = Number(d.year) >= 2013 && Number(d.year) <= 2019;
                  return (
                    <div key={d.year} className="flex-1 flex flex-col items-center justify-end h-full group">
                      <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 transition-transform group-hover:scale-110 select-none">
                        {Math.round(d.value)}
                      </span>
                      <div
                        style={{ height: `${barHeight}px` }}
                        className={`w-full rounded-t-md transition-all duration-300 group-hover:opacity-90 ${
                          isPeak
                            ? 'bg-[#FFD14C] shadow-[0_0_12px_rgba(255,209,76,0.5)]'
                            : isBoom
                            ? 'bg-sky-500 dark:bg-[#9BE7FA]'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={`${d.year}: ${d.value} nghìn người`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-axis year labels below baseline */}
              <div className="flex gap-2.5 sm:gap-3 px-2 pt-2.5">
                {HERITAGE_JAPAN_DATA.kyotoVisitors.map((d) => (
                  <div key={d.year} className="flex-1 text-center">
                    <span
                      className={`text-[11px] sm:text-xs font-medium block truncate ${
                        d.year === '2019'
                          ? 'text-amber-600 dark:text-[#FFD14C] font-bold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {d.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-5 leading-relaxed">
            <strong>Nhận xét:</strong> Kyoto tăng từ 1,13 triệu khách (2013) lên đỉnh 4,50 triệu khách (2019) – tăng gần <strong>4 lần</strong> chỉ trong 6 năm. Đến năm 2023, lượng khách đã hồi phục mạnh mẽ đạt 3,14 triệu lượt.
          </p>
        </div>

        {/* BIỂU ĐỒ 5 & 6 (2 CỘT): KHÁCH NARA & CHI TIÊU KYOTO vs NARA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BIỂU ĐỒ 5: KHÁCH NARA */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-[#FFE485]">
                  Biểu đồ 5 (Gốc 3.3) : Đơn vị: Nghìn người
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#FFD14C]/20 text-amber-900 dark:text-[#FFE485]">
                  Đỉnh 2019: 3.318 nghìn
                </span>
              </div>
              <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                Khách nước ngoài đến Cố đô Nara (2009–2020)
              </h3>

              <div className="overflow-x-auto pb-2">
                <div className="min-w-[480px]">
                  {/* Bars container */}
                  <div className="h-56 flex items-end gap-2.5 sm:gap-3 px-2 border-b-2 border-slate-200 dark:border-slate-700">
                    {HERITAGE_JAPAN_DATA.naraVisitors.map((d) => {
                      const barHeight = Math.max(Math.round((d.value / 3500) * 160), 8);
                      const isPeak = d.year === '2019';
                      const isBoom = Number(d.year) >= 2013 && Number(d.year) <= 2019;
                      return (
                        <div key={d.year} className="flex-1 flex flex-col items-center justify-end h-full group">
                          <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 transition-transform group-hover:scale-110 select-none">
                            {d.value}
                          </span>
                          <div
                            style={{ height: `${barHeight}px` }}
                            className={`w-full rounded-t-md transition-all duration-300 group-hover:opacity-90 ${
                              isPeak
                                ? 'bg-[#FFD14C] shadow-[0_0_12px_rgba(255,209,76,0.5)]'
                                : isBoom
                                ? 'bg-amber-500/80 dark:bg-[#FFE485]'
                                : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            title={`${d.year}: ${d.value} nghìn người`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* X-axis year labels */}
                  <div className="flex gap-2.5 sm:gap-3 px-2 pt-2.5">
                    {HERITAGE_JAPAN_DATA.naraVisitors.map((d) => (
                      <div key={d.year} className="flex-1 text-center">
                        <span
                          className={`text-[11px] sm:text-xs font-medium block truncate ${
                            d.year === '2019'
                              ? 'text-amber-600 dark:text-[#FFD14C] font-bold'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {d.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-5 leading-relaxed">
              Từ mức 435 nghìn khách (2013), Nara duy trì đà tăng trưởng 40–60%/năm và đạt đỉnh <strong>3.318 nghìn lượt</strong> vào năm 2019.
            </p>
          </div>

          {/* BIỂU ĐỒ 6: SO SÁNH CHI TIÊU KYOTO VS NARA */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-[#9BE7FA]">
                  Biểu đồ 6 (Gộp Gốc 3.5 & 3.6) : Đơn vị: Tỷ Yên
                </span>
                <div className="flex items-center gap-3 text-xs font-medium">
                  <span className="flex items-center gap-1 text-sky-600 dark:text-[#9BE7FA]">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-[#9BE7FA]" /> Kyoto
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-[#FFE485]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD14C]" /> Nara
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold mt-1 mb-6 text-slate-900 dark:text-white">
                Chi tiêu Du lịch tại Kyoto vs. Nara (2014–2020)
              </h3>

              <div className="space-y-4">
                {['2014', '2016', '2017', '2018', '2019', '2020'].map((yr) => {
                  const kVal =
                    HERITAGE_JAPAN_DATA.kyotoSpending.find((x) => x.year === yr)?.value || 0;
                  const nVal =
                    HERITAGE_JAPAN_DATA.naraSpending.find((x) => x.year === yr)?.value || 0;
                  return (
                    <div key={yr} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-900 dark:text-white">Năm {yr}</span>
                        <span>
                          Kyoto: <b className="text-sky-600 dark:text-[#9BE7FA]">{kVal} tỷ ¥</b>{' '}
                          | Nara: <b className="text-amber-600 dark:text-[#FFE485]">{nVal} tỷ ¥</b>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-sky-500 dark:bg-[#9BE7FA] rounded-full transition-all duration-300"
                            style={{ width: `${Math.max((kVal / 1400) * 100, 6)}%` }}
                          />
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-[#FFD14C] rounded-full transition-all duration-300"
                            style={{ width: `${Math.max((nVal / 1400) * 100, 6)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-5 leading-relaxed">
              <strong>Nghịch lý năm 2019 tại Nara:</strong> Dù lượng khách quốc tế đến Nara tăng +25,1% (lên 3,318M), tổng chi tiêu lại giảm từ 1.208 xuống 1.147,2 tỷ Yên do khách chủ yếu đi về trong ngày, thiếu khách sạn lưu trú qua đêm.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHẦN 3: QUÁ TẢI DU LỊCH (OVERTOURISM) & ĐỐI SÁCH ĐỊA PHƯƠNG
         ===================================================================== */}
      <section className="space-y-10">
        <div className="space-y-2">
          <span className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Phần 3 : Áp lực Bảo tồn & Quản trị Sức chứa
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Hệ lụy quá tải hạ tầng và ma trận can thiệp tại 5 Di sản Thế giới
          </h2>
        </div>

        {/* BIỂU ĐỒ 7 & 8 (2 CỘT): CUNG - CẦU PHÒNG KYOTO & QUY MÔ ĐIỂM NÓNG */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BIỂU ĐỒ 7: CƠ CẤU NỘI ĐỊA VS QUỐC TẾ & LỆCH CUNG CẦU KYOTO */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                Biểu đồ 7 : Nút thắt lưu trú & Kinh tế Kyoto (2014 vs 2019)
              </span>
              <h3 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                Độ lệch Cung : Cầu Phòng Khách sạn & Đóng góp Kinh tế Kyoto
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-rose-500/5 border border-rose-500/20">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Khách quốc tế đến Kyoto
                </p>
                <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                  1,13M → 4,50M
                </p>
                <p className="text-sm font-semibold text-rose-500 mt-1">
                  Tăng +300% (Gấp 4 lần sau 5 năm)
                </p>
              </div>

              <div className="p-5 rounded-xl bg-sky-500/5 border border-sky-500/20">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Nguồn cung phòng khách sạn
                </p>
                <p className="text-2xl font-extrabold text-sky-600 dark:text-[#9BE7FA] mt-1">
                  &lt;30.000 → 53.000
                </p>
                <p className="text-sm font-semibold text-sky-500 mt-1">
                  Chỉ tăng +76,7% (Thiếu hụt nặng)
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {HERITAGE_JAPAN_DATA.economicShareComparison.slice(3).map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.metric}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {item.share}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max((item.share / 15) * 100, 6)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BIỂU ĐỒ 8: ÁP LỰC TẠI CÁC ĐIỂM NÓNG DI SẢN */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-[#FFE485]">
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
                      <span className="font-bold text-amber-600 dark:text-[#FFE485]">
                        {h.visitorsMillion} triệu lượt
                      </span>
                    </div>
                    <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-300"
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
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
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
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {HERITAGE_JAPAN_DATA.caseStudies.map((cs, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="p-5 font-bold whitespace-nowrap align-top">
                      <div className="text-base text-slate-900 dark:text-white">{cs.site}</div>
                      <div className="text-sm font-normal text-slate-500 mt-0.5">
                        {cs.prefecture}
                      </div>
                    </td>
                    <td className="p-5 font-semibold text-amber-600 dark:text-[#FFE485] align-top">
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

      {/* =====================================================================
          PHẦN 4: THỪA NHẬN CÁC THIẾU SÓT CỦA NIÊN LUẬN GỐC (DATA AUDIT)
         ===================================================================== */}
      <section className="rounded-3xl p-8 sm:p-10 bg-[#FFD14C]/5 dark:bg-[#FFD14C]/10 border border-[#FFD14C]/30 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-[#FFE485] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FFD14C]" />
              Phần 4 : Data Audit & Phản biện Học thuật
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-slate-900 dark:text-white">
              Thừa nhận các thiếu sót của bài niên luận gốc (2023–2024)
            </h2>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-[#FFD14C]/20 text-amber-800 dark:text-[#FFE485] text-sm font-bold border border-[#FFD14C]/30">
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
              className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-sky-600 dark:text-[#9BE7FA]">
                  {item.id} : {item.category}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                    item.severity === 'Cao'
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      : item.severity === 'Đã hiệu đính'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {item.severity}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-rose-600 dark:text-rose-400">
                  Hạn chế trong niên luận:{' '}
                </strong>
                {item.flawInThesis}
              </p>

              <div className="text-sm sm:text-base text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 leading-relaxed">
                <strong className="text-emerald-600 dark:text-emerald-400">
                  Khắc phục trên Portfolio:{' '}
                </strong>
                {item.portfolioFix}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          5. MODAL: XEM 6 BIỂU ĐỒ GỐC TRONG NIÊN LUẬN (ORIGINAL SCAN)
         ===================================================================== */}
      {isProofModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
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

            <div className="flex overflow-x-auto gap-2 p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/50">
              {THESIS_ORIGINAL_FIGURES.map((fig) => {
                const isSelected = selectedFigureId === fig.id;
                return (
                  <button
                    key={fig.id}
                    onClick={() => setSelectedFigureId(fig.id)}
                    className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#9BE7FA] text-slate-950 shadow-sm font-bold'
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
              <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow border border-slate-200 dark:border-slate-700 p-3 overflow-hidden flex items-center justify-center min-h-[280px]">
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

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-800/50">
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

      {/* =====================================================================
          6. UNIFIED CASE STUDY FOOTER
         ===================================================================== */}
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
