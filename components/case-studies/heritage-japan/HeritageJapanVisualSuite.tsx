'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { ThesisCodedChart, THESIS_FIGURES } from './ThesisCodedChart';

export interface HeritageJapanVisualSuiteProps {
  isEn?: boolean;
}

export default function HeritageJapanVisualSuite({ isEn: propIsEn }: HeritageJapanVisualSuiteProps = {}) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');

  // Trạng thái tương tác trên biểu đồ chuỗi thời gian
  const [selectedYearIdx, setSelectedYearIdx] = useState<number>(6); // Mặc định chọn năm 2025

  // Trạng thái Modal xem 6 biểu đồ gốc trong luận văn (thesis-chart-3-1.png -> 3-6.png)
  const [activeChartModal, setActiveChartModal] = useState<number | null>(null);
  const [modalViewMode, setModalViewMode] = useState<'coded' | 'scan'>('coded');

  // 3 Thanh trượt cho Bộ Mô phỏng Chính sách Bảo tồn (Policy What-If Simulator)
  const [subsidyRatePct, setSubsidyRatePct] = useState<number>(65); // Trợ cấp trùng tu quốc gia (%)
  const [ecoTaxYen, setEcoTaxYen] = useState<number>(500);          // Thuế lưu trú di sản (Yen/đêm)
  const [dispersalRatePct, setDispersalRatePct] = useState<number>(30); // Điều phối khách sang vùng vệ tinh (%)

  // 1. Dữ liệu Chuỗi thời gian: Ngân sách Bảo tồn (Tỉ Yên) & Khách Du lịch Di sản (Triệu lượt)
  const timeSeriesData = [
    { year: '2015', budgetB: 102.4, visitorsM: 19.7, status: { vi: 'Mở rộng thị thực', en: 'Visa Relaxation' } },
    { year: '2017', budgetB: 108.9, visitorsM: 28.7, status: { vi: 'Tăng trưởng nóng', en: 'Inbound Surge' } },
    { year: '2019', budgetB: 118.5, visitorsM: 31.9, status: { vi: 'Đỉnh trước đại dịch (Luật sửa đổi)', en: 'Pre-Pandemic Peak (Law Reform)' } },
    { year: '2021', budgetB: 105.2, visitorsM: 2.5, status: { vi: 'Đóng băng COVID-19 (Trợ cấp bảo trì)', en: 'COVID-19 Freeze (Maintenance Aid)' } },
    { year: '2023', budgetB: 124.8, visitorsM: 25.1, status: { vi: 'Phục hồi hậu đại dịch', en: 'Post-Pandemic Recovery' } },
    { year: '2024', budgetB: 132.6, visitorsM: 36.8, status: { vi: 'Vượt đỉnh lịch sử (Yên yếu)', en: 'Record High (Weak Yen)' } },
    { year: '2025', budgetB: 141.2, visitorsM: 40.2, status: { vi: 'Tái cơ cấu chống quá tải (Overtourism)', en: 'Anti-Overtourism Restructuring' } }
  ];

  // 2. Dữ liệu Phân bổ Bất cân xứng theo Vùng (Regional Disparity & Econometric Elasticity)
  const regionalDistribution = [
    {
      region: 'Kansai (Kyoto, Nara, Himeji)',
      treasuresSharePct: 41.8,
      tourismSharePct: 38.4,
      crowdingIndex: 92,
      color: 'bg-[#FFD14C]',
      diagnosis: { vi: 'Quá tải nghiêm trọng (Cần giãn khách)', en: 'Severe Overtourism (Needs Dispersal)' }
    },
    {
      region: 'Kanto (Tokyo, Nikko, Kamakura)',
      treasuresSharePct: 24.5,
      tourismSharePct: 31.2,
      crowdingIndex: 84,
      color: 'bg-[#FFE485]',
      diagnosis: { vi: 'Áp lực đô thị hóa & thương mại cao', en: 'High Urbanization & Commercial Pressure' }
    },
    {
      region: 'Chubu (Shirakawa-go, Kanazawa)',
      treasuresSharePct: 12.4,
      tourismSharePct: 11.8,
      crowdingIndex: 68,
      color: 'bg-[#9BE7FA]',
      diagnosis: { vi: 'Cân bằng tốt nhờ mô hình Quỹ cộng đồng (Yui)', en: 'Balanced via Community Trust (Yui)' }
    },
    {
      region: 'Chugoku & Shikoku (Hiroshima, Izumo)',
      treasuresSharePct: 10.6,
      tourismSharePct: 8.1,
      crowdingIndex: 45,
      color: 'bg-[#C8EEF7]',
      diagnosis: { vi: 'Dư địa tăng trưởng du lịch bền vững lớn', en: 'High Sustainable Growth Potential' }
    },
    {
      region: 'Tohoku, Kyushu & Hokkaido',
      treasuresSharePct: 10.7,
      tourismSharePct: 10.5,
      crowdingIndex: 38,
      color: 'bg-slate-300 dark:bg-slate-700',
      diagnosis: { vi: 'Thiếu hụt ngân sách bảo tồn địa phương', en: 'Local Preservation Funding Deficit' }
    }
  ];

  // 3. Dải 6 Biểu đồ Luận văn Thực nghiệm Số hóa (Chương 3)
  const thesisChartsGallery = THESIS_FIGURES;

  // Tính toán kết quả Mô phỏng Chính sách (Policy Simulator)
  const policySim = useMemo(() => {
    const baseSelfFundingB = 42.5; // Tỉ Yên tự chủ hiện tại
    const taxRevenueB = (40.2 * 0.65 * ecoTaxYen) / 1000; // Thu từ thuế lưu trú di sản (Tỉ Yên)
    const privateCoInvestmentB = (subsidyRatePct / 50) * 18.4; // Vốn đối ứng tư nhân kích hoạt
    const totalPreservationFundB = baseSelfFundingB + taxRevenueB + privateCoInvestmentB;

    // Giảm áp lực quá tải tại Kyoto/Nara nhờ điều phối khách sang vùng vệ tinh
    const kyotoCrowdingScore = Math.max(45, Math.round(92 - dispersalRatePct * 0.85));
    // Gia tăng doanh thu cho các tỉnh vệ tinh (Chugoku, Tohoku, Kyushu)
    const regionalSpilloverB = Math.round(dispersalRatePct * 4.8 * 10) / 10;
    // Điểm bền vững tổng hợp (0 - 100)
    const sustainabilityScore = Math.min(
      98,
      Math.round(58 + (subsidyRatePct - 50) * 0.35 + (ecoTaxYen / 200) * 3.2 + dispersalRatePct * 0.45)
    );

    return {
      taxRevenueB: taxRevenueB.toFixed(1),
      totalPreservationFundB: totalPreservationFundB.toFixed(1),
      kyotoCrowdingScore,
      regionalSpilloverB: regionalSpilloverB.toFixed(1),
      sustainabilityScore
    };
  }, [subsidyRatePct, ecoTaxYen, dispersalRatePct]);

  return (
    <section className="w-full space-y-6">
      {/* KHỐI 1: 2 BIỂU ĐỒ TƯƠNG TÁC CỐT LÕI (TIME-SERIES & REGIONAL DISPARITY) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* BIỂU ĐỒ 1 (7 CỘT): TƯƠNG QUAN NGÂN SÁCH BẢO TỒN & KHÁCH DU LỊCH (2015–2025) */}
        <div className="xl:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-950/90 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="px-2 py-0.5 rounded text-xs tabular-nums font-bold uppercase bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30">
                BIỂU ĐỒ #1 • KINH TẾ LƯỢNG CHUỖI THỜI GIAN (2015 – 2025)
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                {lang === 'vi'
                  ? 'Ngân Sách Bảo Tồn Quốc Gia (Tỉ Yên) vs. Lượng Khách Quốc Tế (Triệu Lượt)'
                  : 'National Preservation Budget (B JPY) vs. Inbound Visitors (M Visits)'}
              </h3>
            </div>
            <div className="text-right tabular-nums text-xs">
              <div className="text-[#0D7287] dark:text-[#9BE7FA] font-bold">R² = 0,84 • β = +0,72 (p &lt; 0,01)</div>
              <div className="text-slate-500 dark:text-slate-400">Luật Bảo tồn sửa đổi: 04/2019</div>
            </div>
          </div>

          {/* CHÚ GIẢI 2 MÀU CỘT & NGUỒN CƠ QUAN */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums pt-1 pb-1">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-bold">
                <span className="w-3 h-3 rounded-xs bg-sky-500 inline-block" />
                {lang === 'vi' ? 'Ngân sách Bảo tồn ACA (Tỉ Yên ¥)' : 'ACA Preservation Budget (B JPY)'}
              </span>
              <span className="flex items-center gap-1.5 text-[#B45309] dark:text-[#FFD14C] font-bold">
                <span className="w-3 h-3 rounded-xs bg-[#FFD14C] inline-block" />
                {lang === 'vi' ? 'Lượng Khách Quốc Tế JNTO (Triệu Lượt)' : 'JNTO Inbound Visitors (M)'}
              </span>
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              {lang === 'vi' ? 'Đơn vị: Tỉ Yên (B) / Triệu khách (M)' : 'Units: Billion JPY (B) / Million Visits (M)'}
            </span>
          </div>

          {/* CỘT ĐÔI TƯƠNG TÁC: NGÂN SÁCH (XANH LAM) & DU LỊCH (AMBER GOLD) */}
          <div className="pt-2 pb-1">
            <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-56 px-1 border-slate-200 dark:border-slate-800 pb-2">
              {timeSeriesData.map((item, idx) => {
                const budgetHeight = Math.round((item.budgetB / 150) * 100);
                const visitorHeight = Math.max(8, Math.round((item.visitorsM / 42) * 100));
                const isSelected = selectedYearIdx === idx;
                return (
                  <div
                    key={item.year}
                    onMouseEnter={() => setSelectedYearIdx(idx)}
                    onClick={() => setSelectedYearIdx(idx)}
                    className="flex flex-col items-center justify-end h-full cursor-pointer group"
                  >
                    <div className="flex items-center justify-center gap-1 text-[11px] tabular-nums font-bold mb-1.5 whitespace-nowrap">
                      <span
                        className={isSelected ? 'text-sky-600 dark:text-sky-400 font-black' : 'text-sky-700/80 dark:text-sky-400/80'}
                        title={`Ngân sách ACA: ${item.budgetB} Tỉ Yên`}
                      >
                        {item.budgetB}B
                      </span>
                      <span className="text-slate-300 dark:text-slate-600 font-normal">/</span>
                      <span
                        className={isSelected ? 'text-[#B45309] dark:text-[#FFD14C] font-black' : 'text-[#B45309]/80 dark:text-[#FFD14C]/80'}
                        title={`Khách du lịch: ${item.visitorsM} Triệu lượt`}
                      >
                        {item.visitorsM}M
                      </span>
                    </div>
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Cột Ngân sách ACA */}
                      <div
                        style={{ height: `${budgetHeight}%` }}
                        className={`w-1/2 max-w-[22px] rounded-t transition bg-sky-600 ${
                          isSelected ? 'ring-2 ring-sky-500 dark:ring-white opacity-100' : 'opacity-85 group-hover:opacity-100'
                        }`}
                        title={`Ngân sách ACA: ${item.budgetB} Tỉ Yên`}
                      />
                      {/* Cột Khách du lịch JNTO */}
                      <div
                        style={{ height: `${visitorHeight}%` }}
                        className={`w-1/2 max-w-[22px] rounded-t transition bg-[#FFD14C] ${
                          isSelected ? 'ring-2 ring-[#FFD14C] dark:ring-white opacity-100' : 'opacity-85 group-hover:opacity-100'
                        }`}
                        title={`Khách du lịch: ${item.visitorsM} Triệu lượt`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2 text-center">
              {timeSeriesData.map((item, idx) => (
                <div
                  key={item.year}
                  className={`text-xs tabular-nums ${
                    selectedYearIdx === idx ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.year}
                </div>
              ))}
            </div>
          </div>

          {/* CHÚ THÍCH NĂM ĐANG CHỌN & GIẢI TRÌNH NGUỒN ACA */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 text-xs tabular-nums">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-slate-900 dark:text-white font-bold">Năm {timeSeriesData[selectedYearIdx].year}:</span>
                <span className="text-sky-700 dark:text-sky-300 font-bold">
                  Ngân sách ACA: <strong>{timeSeriesData[selectedYearIdx].budgetB} Tỉ Yên</strong>
                </span>
                <span className="text-[#B45309] dark:text-[#FFD14C] font-bold">
                  Khách quốc tế: <strong>{timeSeriesData[selectedYearIdx].visitorsM} Triệu lượt</strong>
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-amber-50 dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-transparent font-bold">
                {timeSeriesData[selectedYearIdx].status[lang]}
              </span>
            </div>
            <div className="pt-2 border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400">
              <span>
                <strong>Nguồn Ngân Sách ACA:</strong> Cục Văn hóa Nhật Bản (<em>Agency for Cultural Affairs - Bunkachō 文化庁</em>, thuộc Bộ MEXT Nhật Bản).
              </span>
              <span>
                <strong>Nguồn Lượng Khách:</strong> Tổ chức Du lịch Quốc gia Nhật Bản (<em>JNTO</em>) & Cục Du lịch Nhật Bản (<em>JTA / MLIT</em>).
              </span>
            </div>
          </div>
        </div>

        {/* BIỂU ĐỒ 2 (5 CỘT): BẤT CÂN XỨNG KHÔNG GIAN & CHỈ SỐ QUÁ TẢI THEO VÙNG */}
        <div className="xl:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-950/90 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="border-slate-200 dark:border-slate-800 pb-3">
            <span className="px-2 py-0.5 rounded text-xs tabular-nums font-bold uppercase bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
              BIỂU ĐỒ #2 • BẤT CÂN XỨNG KHÔNG GIAN (GINI = 0,64)
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {lang === 'vi'
                ? 'Tỷ Trọng Quốc Bảo vs. Chỉ Số Áp Lực Quá Tải (Overtourism)'
                : 'National Treasures Share vs. Overtourism Crowding Index'}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {regionalDistribution.map((reg, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/75 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>{reg.region}</span>
                  <span className="tabular-nums text-sky-700 dark:text-sky-300">{reg.treasuresSharePct}% Di sản</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${reg.color}`} style={{ width: `${reg.crowdingIndex}%` }} />
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 tabular-nums">
                  <span>{reg.diagnosis[lang]}</span>
                  <span className={reg.crowdingIndex >= 80 ? 'text-[#92400E] dark:text-[#FFE485] font-bold' : 'text-[#0D7287] dark:text-[#9BE7FA]'}>
                    Áp lực: {reg.crowdingIndex}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KHỐI 2: BỘ MÔ PHỎNG CHÍNH SÁCH CÔNG (INTERACTIVE POLICY SIMULATOR) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-950/95 p-5 sm:p-7 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="px-2.5 py-1 rounded text-xs tabular-nums font-bold uppercase bg-[#C8EEF7]/40 dark:bg-[#074553]/60 text-[#074553] dark:text-[#9BE7FA] border border-[#9BE7FA]/40">
              MÔ HÌNH LƯỢNG HÓA CHÍNH SÁCH • WHAT-IF POLICY SIMULATOR
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              {lang === 'vi'
                ? 'Mô Phỏng Tái Cấu Trúc Tài Chính Di Sản & Giãn Khách Khỏi Tâm Điểm Kyoto'
                : 'Simulating Heritage Fiscal Restructuring & Tourist Dispersal from Kyoto'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setSubsidyRatePct(75);
              setEcoTaxYen(1000);
              setDispersalRatePct(45);
            }}
            className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 dark:bg-sky-500/20 dark:hover:bg-sky-500/30 dark:text-sky-300 dark:border-sky-500/40 text-xs tabular-nums font-bold transition self-start lg:self-auto cursor-pointer"
          >
            {lang === 'vi' ? 'Áp dụng Kịch bản Khuyến nghị Chính sách 2026' : 'Apply Recommended 2026 Policy Scenario'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 3 Thanh trượt chính sách */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/75 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  1. Tỷ lệ Trợ cấp Trùng tu Quốc gia & Khấu trừ Thuế Tư nhân
                </span>
                <span className="tabular-nums font-extrabold text-sky-600 dark:text-sky-400">{subsidyRatePct}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={85}
                step={5}
                value={subsidyRatePct}
                onChange={(e) => setSubsidyRatePct(parseInt(e.target.value, 10))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs tabular-nums text-slate-500 dark:text-slate-400">
                <span>Mức nền: 50%</span>
                <span>Luật sửa đổi 2019: 65%</span>
                <span>Tối đa: 85%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/75 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  2. Thuế Lưu trú Bảo tồn Di sản (Heritage Accommodation Tax)
                </span>
                <span className="tabular-nums font-extrabold text-[#0D7287] dark:text-[#9BE7FA]">{ecoTaxYen.toLocaleString()} ¥ / đêm</span>
              </div>
              <input
                type="range"
                min={200}
                max={1500}
                step={100}
                value={ecoTaxYen}
                onChange={(e) => setEcoTaxYen(parseInt(e.target.value, 10))}
                className="w-full accent-[#0D7287] dark:accent-[#9BE7FA] cursor-pointer"
              />
              <div className="flex justify-between text-xs tabular-nums text-slate-500 dark:text-slate-400">
                <span>Hiện hành: 200 ¥</span>
                <span>Đề xuất Kyoto: 1.000 ¥</span>
                <span>Cao cấp: 1.500 ¥</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/75 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  3. Tỷ lệ Điều phối Khách sang Vùng Vệ tinh (JR Pass & Digital Ticketing)
                </span>
                <span className="tabular-nums font-extrabold text-amber-600 dark:text-amber-400">{dispersalRatePct}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={dispersalRatePct}
                onChange={(e) => setDispersalRatePct(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs tabular-nums text-slate-500 dark:text-slate-400">
                <span>Hiện tại: 15%</span>
                <span>Mục tiêu 2026: 45%</span>
                <span>Tối đa: 60%</span>
              </div>
            </div>
          </div>

          {/* Kết quả đầu ra của Mô hình Chính sách */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4 bg-slate-50">
            <div>
              <div className="text-xs tabular-nums uppercase text-[#0D7287] dark:text-[#9BE7FA] font-bold">
                Tổng Quỹ Tự Chủ Bảo Tồn Tạo Thêm / Năm
              </div>
              <div className="text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white mt-1">
                {policySim.totalPreservationFundB} Tỉ Yên
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Trong đó Thuế lưu trú đóng góp +{policySim.taxRevenueB} Tỉ Yên/năm
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 border-slate-200 dark:border-slate-800 pt-3 text-xs tabular-nums">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-sans text-slate-700 dark:text-slate-300">Chỉ số Quá tải Kyoto (Từ 92/100):</span>
                <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">Giảm còn {policySim.kyotoCrowdingScore}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-sans text-slate-700 dark:text-slate-300">Doanh thu Lan tỏa Vùng Vệ tinh:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">+{policySim.regionalSpilloverB} Tỉ Yên</span>
              </div>
              <div className="p-3 rounded-xl bg-[#C8EEF7]/40 dark:bg-[#074553]/40 border border-[#9BE7FA]/50 flex justify-between items-center">
                <span className="font-sans font-bold text-slate-900 dark:text-white">Điểm Cân bằng Bảo tồn – Kinh tế:</span>
                <span className="font-extrabold text-[#074553] dark:text-[#9BE7FA] text-base">{policySim.sustainabilityScore} / 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 3: DẢI 6 BIỂU ĐỒ LUẬN VĂN SỐ HÓA (CHƯƠNG 3) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-950/90 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="px-2 py-0.5 rounded text-xs tabular-nums font-bold uppercase bg-cyan-50 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
              BẰNG CHỨNG HỌC THUẬT GỐC • 6 THESIS FIGURES (CHƯƠNG 3)
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {lang === 'vi'
                ? 'Thư Viện 6 Biểu Đồ Thực Nghiệm Số Hóa Trong Luận Văn (Bấm Để Phóng To)'
                : 'Original 6 Empirical Thesis Figures (Interactive Vector • Click to Zoom)'}
            </h3>
          </div>
          <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
            {lang === 'vi' ? 'Biểu đồ Vector trực quan • 100% Coded' : 'Vector Coded Charts • 100% Interactive'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {thesisChartsGallery.map((fig, index) => (
            <button
              key={fig.id}
              type="button"
              onClick={() => {
                setActiveChartModal(index);
                setModalViewMode('coded');
              }}
              className="group text-left rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-sky-500/60 dark:hover:border-sky-400/60 transition flex flex-col justify-between shadow-xs cursor-pointer"
            >
              <div className="relative h-32 w-full bg-slate-50/80 dark:bg-slate-950/80 p-2 overflow-hidden flex items-center justify-center">
                <ThesisCodedChart figure={fig} isThumbnail={true} lang={lang} />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] tabular-nums font-bold bg-white/95 dark:bg-slate-900/95 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 shadow-xs pointer-events-none">
                  {fig.code}
                </span>
              </div>
              <div className="p-3 space-y-1 border-slate-100 dark:border-slate-800/60">
                <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                  {fig.shortTitle[lang]}
                </div>
                <div className="text-[11px] tabular-nums text-[#0D7287] dark:text-[#9BE7FA] truncate">
                  {fig.stat}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL PHÓNG TO & TƯƠNG TÁC BIỂU ĐỒ LUẬN VĂN */}
      {activeChartModal !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setActiveChartModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-4 max-h-[94vh] overflow-y-auto"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-slate-200 dark:border-slate-800 pb-3">
              <div className="space-y-0.5 max-w-[70%]">
                <div className="flex items-center gap-2">
                  <span className="text-xs tabular-nums text-sky-600 dark:text-sky-400 font-bold">
                    {thesisChartsGallery[activeChartModal].code}
                  </span>
                  <span className="text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                    (Luận văn trang {thesisChartsGallery[activeChartModal].pageInDoc})
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {thesisChartsGallery[activeChartModal].title[lang]}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                {/* Chuyển đổi Biểu đồ số hóa vs Ảnh scan gốc */}
                <div className="flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setModalViewMode('coded')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      modalViewMode === 'coded'
                        ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {lang === 'vi' ? 'Biểu đồ Số hóa' : 'Vector Chart'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalViewMode('scan')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      modalViewMode === 'scan'
                        ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {lang === 'vi' ? 'Ảnh Scan Gốc' : 'Thesis Scan'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveChartModal(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white text-xs tabular-nums cursor-pointer border border-slate-200 dark:border-transparent transition"
                >
                  Đóng (ESC)
                </button>
              </div>
            </div>

            {/* Khung Biểu Đồ */}
            <div className="rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 sm:p-4">
              {modalViewMode === 'coded' ? (
                <ThesisCodedChart
                  figure={thesisChartsGallery[activeChartModal]}
                  isThumbnail={false}
                  lang={lang}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thesisChartsGallery[activeChartModal].scanSrc}
                    alt={thesisChartsGallery[activeChartModal].title[lang]}
                    className="max-h-[62vh] w-auto object-contain mx-auto rounded-lg border border-slate-200 dark:border-slate-800"
                  />
                  <span className="text-[11px] tabular-nums text-slate-500 dark:text-slate-400 mt-2">
                    Bản chụp quét từ tài liệu Luận văn cử nhân gốc (Trang {thesisChartsGallery[activeChartModal].pageInDoc})
                  </span>
                </div>
              )}
            </div>

            {/* Nút Điều Hướng Trái / Phải */}
            <div className="flex items-center justify-between text-xs tabular-nums pt-1">
              <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold truncate max-w-[50%]">
                {thesisChartsGallery[activeChartModal].stat}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveChartModal(
                      (activeChartModal - 1 + thesisChartsGallery.length) % thesisChartsGallery.length
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white cursor-pointer border border-slate-200 dark:border-transparent transition"
                >
                  ← Hình trước
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartModal((activeChartModal + 1) % thesisChartsGallery.length)}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white cursor-pointer transition"
                >
                  Hình tiếp →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export { HeritageJapanVisualSuite };
