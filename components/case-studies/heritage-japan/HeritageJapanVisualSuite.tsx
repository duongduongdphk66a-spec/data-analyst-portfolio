'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

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
      color: 'bg-rose-500',
      diagnosis: { vi: 'Quá tải nghiêm trọng (Cần giãn khách)', en: 'Severe Overtourism (Needs Dispersal)' }
    },
    {
      region: 'Kanto (Tokyo, Nikko, Kamakura)',
      treasuresSharePct: 24.5,
      tourismSharePct: 31.2,
      crowdingIndex: 84,
      color: 'bg-amber-400',
      diagnosis: { vi: 'Áp lực đô thị hóa & thương mại cao', en: 'High Urbanization & Commercial Pressure' }
    },
    {
      region: 'Chubu (Shirakawa-go, Kanazawa)',
      treasuresSharePct: 12.4,
      tourismSharePct: 11.8,
      crowdingIndex: 68,
      color: 'bg-sky-400',
      diagnosis: { vi: 'Cân bằng tốt nhờ mô hình Quỹ cộng đồng (Yui)', en: 'Balanced via Community Trust (Yui)' }
    },
    {
      region: 'Chugoku & Shikoku (Hiroshima, Izumo)',
      treasuresSharePct: 10.6,
      tourismSharePct: 8.1,
      crowdingIndex: 45,
      color: 'bg-emerald-400',
      diagnosis: { vi: 'Dư địa tăng trưởng du lịch bền vững lớn', en: 'High Sustainable Growth Potential' }
    },
    {
      region: 'Tohoku, Kyushu & Hokkaido',
      treasuresSharePct: 10.7,
      tourismSharePct: 10.5,
      crowdingIndex: 38,
      color: 'bg-indigo-400',
      diagnosis: { vi: 'Thiếu hụt ngân sách bảo tồn địa phương', en: 'Local Preservation Funding Deficit' }
    }
  ];

  // 3. Dải 6 Biểu đồ Luận văn Gốc (public/heritage-japan/thesis-chart-3-1.png -> 3-6.png)
  const thesisChartsGallery = [
    {
      id: 1,
      src: '/heritage-japan/thesis-chart-3-1.png',
      code: 'Hình 3.1',
      title: { vi: 'Cơ cấu Di sản Văn hóa theo Loại hình', en: 'Cultural Properties by Category' },
      stat: '1.132 Quốc bảo • 13.377 Di sản Quan trọng'
    },
    {
      id: 2,
      src: '/heritage-japan/thesis-chart-3-2.png',
      code: 'Hình 3.2',
      title: { vi: 'Chuỗi Thời gian Ngân sách Bảo tồn (ACA)', en: 'ACA Preservation Budget Time-Series' },
      stat: 'CAGR +3,2%/năm • Tỷ trọng Trùng tu 68%'
    },
    {
      id: 3,
      src: '/heritage-japan/thesis-chart-3-3.png',
      code: 'Hình 3.3',
      title: { vi: 'Phân bổ Không gian Di sản theo Vùng', en: 'Spatial Concentration across Prefectures' },
      stat: 'Hệ số Gini = 0,64 (Tập trung tại Kansai/Kanto)'
    },
    {
      id: 4,
      src: '/heritage-japan/thesis-chart-3-4.png',
      code: 'Hình 3.4',
      title: { vi: 'Tương quan Khách Quốc tế & Doanh thu', en: 'Inbound Visitors vs. Regional Revenue' },
      stat: 'R² = 0,84 • Hệ số co giãn β = +0,72 (p < 0,01)'
    },
    {
      id: 5,
      src: '/heritage-japan/thesis-chart-3-5.png',
      code: 'Hình 3.5',
      title: { vi: 'Tác động Luật Sửa đổi 2019 (DiD Model)', en: '2019 Law Amendment Impact (DiD Model)' },
      stat: 'Tăng +24,6% dự án khai thác thương mại hóa'
    },
    {
      id: 6,
      src: '/heritage-japan/thesis-chart-3-6.png',
      code: 'Hình 3.6',
      title: { vi: 'Đánh giá Chỉ số Bền vững 4 Case Studies', en: 'Sustainability Index across 4 Case Studies' },
      stat: 'Himeji & Shirakawa-go dẫn đầu điểm cân bằng'
    }
  ];

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
        <div className="xl:col-span-7 rounded-2xl border border-slate-800/90 bg-slate-950/90 p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase bg-sky-500/15 text-sky-300 border border-sky-500/30">
                BIỂU ĐỒ #1 • KINH TẾ LƯỢNG CHUỖI THỜI GIAN (2015 – 2025)
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white mt-1">
                {lang === 'vi'
                  ? 'Ngân Sách Bảo Tồn Quốc Gia (Tỉ Yên) vs. Lượng Khách Quốc Tế (Triệu Lượt)'
                  : 'National Preservation Budget (B JPY) vs. Inbound Visitors (M Visits)'}
              </h3>
            </div>
            <div className="text-right font-mono text-xs">
              <div className="text-emerald-400 font-bold">R² = 0,84 • β = +0,72 (p &lt; 0,01)</div>
              <div className="text-slate-400">Luật Bảo tồn sửa đổi: 04/2019</div>
            </div>
          </div>

          {/* CỘT ĐÔI TƯƠNG TÁC: NGÂN SÁCH (XANH LAM) & DU LỊCH (XANH NGỌC) */}
          <div className="pt-4 pb-1">
            <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-52 px-1 border-b border-slate-800 pb-2">
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
                    <div
                      className={`text-xs font-mono font-bold mb-1 ${
                        isSelected ? 'text-emerald-300' : 'text-slate-400'
                      }`}
                    >
                      {item.visitorsM}M
                    </div>
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Cột Ngân sách */}
                      <div
                        style={{ height: `${budgetHeight}%` }}
                        className={`w-1/2 max-w-[20px] rounded-t bg-gradient-to-t from-sky-600 to-sky-400 transition-all ${
                          isSelected ? 'ring-1 ring-white' : 'opacity-80 group-hover:opacity-100'
                        }`}
                        title={`Ngân sách: ${item.budgetB} Tỉ Yên`}
                      />
                      {/* Cột Khách du lịch */}
                      <div
                        style={{ height: `${visitorHeight}%` }}
                        className={`w-1/2 max-w-[20px] rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all ${
                          isSelected ? 'ring-1 ring-white' : 'opacity-80 group-hover:opacity-100'
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
                  className={`text-xs font-mono ${
                    selectedYearIdx === idx ? 'text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  {item.year}
                </div>
              ))}
            </div>
          </div>

          {/* CHÚ THÍCH NĂM ĐANG CHỌN */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-white font-bold">Năm {timeSeriesData[selectedYearIdx].year}:</span>
              <span className="text-sky-300">
                🟦 Ngân sách ACA: <strong>{timeSeriesData[selectedYearIdx].budgetB} Tỉ Yên</strong>
              </span>
              <span className="text-emerald-300">
                🟩 Khách quốc tế: <strong>{timeSeriesData[selectedYearIdx].visitorsM} Triệu lượt</strong>
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-slate-800 text-amber-300">
              {timeSeriesData[selectedYearIdx].status[lang]}
            </span>
          </div>
        </div>

        {/* BIỂU ĐỒ 2 (5 CỘT): BẤT CÂN XỨNG KHÔNG GIAN & CHỈ SỐ QUÁ TẢI THEO VÙNG */}
        <div className="xl:col-span-5 rounded-2xl border border-slate-800/90 bg-slate-950/90 p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
              BIỂU ĐỒ #2 • BẤT CÂN XỨNG KHÔNG GIAN (GINI = 0,64)
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-1">
              {lang === 'vi'
                ? 'Tỷ Trọng Quốc Bảo vs. Chỉ Số Áp Lực Quá Tải (Overtourism)'
                : 'National Treasures Share vs. Overtourism Crowding Index'}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {regionalDistribution.map((reg, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/75 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{reg.region}</span>
                  <span className="font-mono text-sky-300">{reg.treasuresSharePct}% Di sản</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${reg.color}`} style={{ width: `${reg.crowdingIndex}%` }} />
                </div>
                <div className="flex items-center justify-between text-slate-400 font-mono">
                  <span>{reg.diagnosis[lang]}</span>
                  <span className={reg.crowdingIndex >= 80 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    Áp lực: {reg.crowdingIndex}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KHỐI 2: BỘ MÔ PHỎNG CHÍNH SÁCH CÔNG (INTERACTIVE POLICY SIMULATOR) */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-950/95 p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              MÔ HÌNH LƯỢNG HÓA CHÍNH SÁCH • WHAT-IF POLICY SIMULATOR
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1.5">
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
            className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-mono font-bold transition self-start lg:self-auto cursor-pointer"
          >
            ⚡ {lang === 'vi' ? 'Áp dụng Kịch bản Khuyến nghị Chính sách 2026' : 'Apply Recommended 2026 Policy Scenario'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 3 Thanh trượt chính sách */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/75 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">
                  1. Tỷ lệ Trợ cấp Trùng tu Quốc gia & Khấu trừ Thuế Tư nhân
                </span>
                <span className="font-mono font-extrabold text-sky-400">{subsidyRatePct}%</span>
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
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Mức nền: 50%</span>
                <span>Luật sửa đổi 2019: 65%</span>
                <span>Tối đa: 85%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/75 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">
                  2. Thuế Lưu trú Bảo tồn Di sản (Heritage Accommodation Tax)
                </span>
                <span className="font-mono font-extrabold text-emerald-400">{ecoTaxYen.toLocaleString()} ¥ / đêm</span>
              </div>
              <input
                type="range"
                min={200}
                max={1500}
                step={100}
                value={ecoTaxYen}
                onChange={(e) => setEcoTaxYen(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Hiện hành: 200 ¥</span>
                <span>Đề xuất Kyoto: 1.000 ¥</span>
                <span>Cao cấp: 1.500 ¥</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/75 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-white">
                  3. Tỷ lệ Điều phối Khách sang Vùng Vệ tinh (JR Pass & Digital Ticketing)
                </span>
                <span className="font-mono font-extrabold text-amber-400">{dispersalRatePct}%</span>
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
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Hiện tại: 15%</span>
                <span>Mục tiêu 2026: 45%</span>
                <span>Tối đa: 60%</span>
              </div>
            </div>
          </div>

          {/* Kết quả đầu ra của Mô hình Chính sách */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-mono uppercase text-emerald-400 font-bold">
                Tổng Quỹ Tự Chủ Bảo Tồn Tạo Thêm / Năm
              </div>
              <div className="text-3xl font-extrabold font-mono text-white mt-1">
                {policySim.totalPreservationFundB} Tỉ Yên
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Trong đó Thuế lưu trú đóng góp +{policySim.taxRevenueB} Tỉ Yên/năm
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 border-t border-slate-800 pt-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="font-sans text-slate-300">Chỉ số Quá tải Kyoto (Từ 92/100):</span>
                <span className="font-bold text-sky-400 text-sm">Giảm còn {policySim.kyotoCrowdingScore}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="font-sans text-slate-300">Doanh thu Lan tỏa Vùng Vệ tinh:</span>
                <span className="font-bold text-amber-400 text-sm">+{policySim.regionalSpilloverB} Tỉ Yên</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex justify-between items-center">
                <span className="font-sans font-bold text-white">Điểm Cân bằng Bảo tồn – Kinh tế:</span>
                <span className="font-extrabold text-emerald-400 text-base">{policySim.sustainabilityScore} / 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 3: DẢI 6 HÌNH ẢNH BIỂU ĐỒ LUẬN VĂN GỐC (CLICK ĐỂ PHÓNG TO) */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-950/90 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              BẰNG CHỨNG HỌC THUẬT GỐC • 6 THESIS FIGURES (CHƯƠNG 3)
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-1">
              {lang === 'vi'
                ? 'Thư Viện 6 Biểu Đồ Thực Nghiệm Trong Luận Văn (Bấm Vào Ảnh Để Phóng To)'
                : 'Original 6 Empirical Thesis Figures (Click Any Chart to Zoom In)'}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {thesisChartsGallery.map((fig, index) => (
            <button
              key={fig.id}
              type="button"
              onClick={() => setActiveChartModal(index)}
              className="group text-left rounded-xl overflow-hidden border border-slate-800 bg-slate-900/70 hover:border-sky-500/60 transition flex flex-col justify-between shadow-md cursor-pointer"
            >
              <div className="relative h-32 w-full bg-slate-950 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fig.src}
                  alt={fig.title[lang]}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-950/90 text-sky-300 border border-slate-700">
                  {fig.code}
                </span>
              </div>
              <div className="p-3 space-y-1">
                <div className="text-xs font-bold text-white line-clamp-1 group-hover:text-sky-300">
                  {fig.title[lang]}
                </div>
                <div className="text-xs font-mono text-emerald-400 truncate">{fig.stat}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL PHÓNG TO ẢNH BIỂU ĐỒ LUẬN VĂN */}
      {activeChartModal !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
          onClick={() => setActiveChartModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-2xl bg-slate-900 border border-slate-700 p-4 sm:p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-sky-400 font-bold">
                  {thesisChartsGallery[activeChartModal].code}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {thesisChartsGallery[activeChartModal].title[lang]}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveChartModal(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono cursor-pointer"
              >
                ✕ Đóng (ESC)
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-[70vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thesisChartsGallery[activeChartModal].src}
                alt={thesisChartsGallery[activeChartModal].title[lang]}
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">
                📌 {thesisChartsGallery[activeChartModal].stat}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveChartModal(
                      (activeChartModal - 1 + thesisChartsGallery.length) % thesisChartsGallery.length
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                >
                  ← Hình trước
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartModal((activeChartModal + 1) % thesisChartsGallery.length)}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white cursor-pointer"
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
