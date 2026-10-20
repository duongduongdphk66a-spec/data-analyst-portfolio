'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Download } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Label,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  THESIS_CHARTS_CATALOG,
  touristsData,
  kyotoVisitorsData,
  naraVisitorsData,
  kyotoNaraVisitorsData,
  spendNationalData,
  kyotoSpendData,
  naraSpendData,
  gdpShareData,
} from '@/app/data/heritageJapanData';
import { useLanguage } from '@/app/context/LanguageContext';

export interface Chapter3AnalyticsSectionProps {
  isEn?: boolean;
  onExportChart?: (_chartId: string, _filename: string) => void;
  liveData?: {
    tourists?: any[];
    spend?: any[];
    regional?: any[];
    isLiveDb?: boolean;
  } | null;
}

export function Chapter3AnalyticsSection({ 
  isEn: propIsEn, 
  onExportChart = () => {}, 
  liveData = null 
}: Chapter3AnalyticsSectionProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  // Volume Charts (3.1, 3.2, 3.3)
  const [volumeChartId, setVolumeChartId] = useState<string>('3.1');

  // Revenue Charts (3.4, 3.5, 3.6)
  const [revenueChartId, setRevenueChartId] = useState<string>('3.4');

  const volumeCharts = useMemo(() => THESIS_CHARTS_CATALOG.filter(c => ['3.1', '3.2', '3.3'].includes(c.chartId)), []);
  const revenueCharts = useMemo(() => THESIS_CHARTS_CATALOG.filter(c => ['3.4', '3.5', '3.6'].includes(c.chartId)), []);

  const selectedVolumeMeta = volumeCharts.find(c => c.chartId === volumeChartId) || volumeCharts[0];
  const selectedRevenueMeta = revenueCharts.find(c => c.chartId === revenueChartId) || revenueCharts[0];

  const activeTouristsData = liveData?.tourists && liveData.tourists.length > 0 ? liveData.tourists : touristsData;
  const activeSpendData = liveData?.spend && liveData.spend.length > 0 ? liveData.spend : spendNationalData;
  const activeKyotoData = liveData?.regional && liveData.regional.length > 0 ? liveData.regional.map((r: any) => ({ year: r.year, value: r.kyoto })) : kyotoVisitorsData;
  const activeNaraData = liveData?.regional && liveData.regional.length > 0 ? liveData.regional.map((r: any) => ({ year: r.year, value: r.nara })) : naraVisitorsData;
  const activeRegionalData = liveData?.regional && liveData.regional.length > 0 ? liveData.regional : kyotoNaraVisitorsData;


  return (
    <div className="mb-14">
      <div className="max-w-4xl mb-6">
        <h3 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2 dark:text-white">
          <TrendingUp className="w-6 h-6 text-[#0D7287] dark:text-[#9BE7FA]" />
          <span>3.1. Sự phát triển nhìn từ tiêu chí Hiệu quả du lịch (Quantitative Analytics)</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-700 mt-2 leading-relaxed dark:text-slate-300">
          Chương trình 2013 giúp du lịch Nhật Bản, <strong>Kyoto</strong> và <strong>Nara</strong> tăng trưởng nhảy vọt lượng khách và chi tiêu.
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 block mb-1">Khách quốc tế toàn quốc</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">36.9 Triệu</span>
            <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">+255%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Kỷ lục 2024 (JNTO, vượt đỉnh 31.9M năm 2019)</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 block mb-1">Chi tiêu du khách quốc tế</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">8.14 Nghìn tỷ ¥</span>
            <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">x5.8 lần</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Kỷ lục 2024 (観光庁, tăng +69% vs 2019)</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 block mb-1">Đóng góp vào GDP Nhật</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">8.4% GDP</span>
            <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">68.2T ¥</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Quy mô doanh thu du lịch 2024 (METI/WTTC)</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 block mb-1">Chi tiêu du lịch Kyoto</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">1.91 Nghìn tỷ ¥</span>
            <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">8.21M khách</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Kỷ lục 2024 (Khách quốc tế chiếm 50.4% lưu trú)</p>
        </div>
      </div>

      {/* 3.1.1 BIỂU ĐỒ SỐ LƯỢNG KHÁCH (VOLUME TELEMETRY HUB) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-black bg-[#9BE7FA] text-slate-950 dark:bg-[#9BE7FA] dark:text-slate-950">
                Nhóm 1 • Số lượng khách
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Biểu đồ {selectedVolumeMeta.chartId}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                {isEn ? selectedVolumeMeta.nameEn : selectedVolumeMeta.nameVi}
              </h4>
              {liveData?.isLiveDb && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] tabular-nums font-bold bg-[#C8EEF7]/40 text-[#074553] dark:bg-[#074553]/60 dark:text-[#9BE7FA] border border-[#9BE7FA]/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD14C] animate-pulse" />
                  MySQL Live
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">Đơn vị đo lường: <strong>{isEn ? selectedVolumeMeta.unitEn : selectedVolumeMeta.unitVi}</strong></p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExportChart(`volume-chart-container-${volumeChartId}`, `Bieu-do-So-luong-${volumeChartId}`)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 cursor-pointer"
              title="Tải ảnh biểu đồ PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Volume Chart Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-slate-100 dark:border-slate-800 scrollbar-thin">
          {volumeCharts.map((item) => (
            <button
              key={item.chartId}
              onClick={() => setVolumeChartId(item.chartId)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                volumeChartId === item.chartId
                  ? 'bg-[#0D7287] text-white shadow-xs font-black dark:bg-[#9BE7FA] dark:text-slate-950'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Biểu đồ {item.chartId} • {item.chartId === '3.1' ? 'Toàn quốc' : item.chartId === '3.2' ? 'Cố đô Kyoto' : 'Cố đô Nara'}
            </button>
          ))}
        </div>

        {/* Volume Chart Rendering */}
        <div id={`volume-chart-container-${volumeChartId}`} className="pt-6 min-h-[360px]">
          <div className="h-[340px] w-full">
            {volumeChartId === '3.1' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeTouristsData} margin={{ top: 22, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTourists" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D7287" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0D7287" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }}>
                    <Label value="(M)" position="top" offset={10} fill="#94a3b8" fontSize={11} />
                  </YAxis>
                  <Tooltip formatter={(value: any) => [`${value} Triệu khách`, 'Khách quốc tế']} />
                  <Area type="monotone" dataKey="value" stroke="#0D7287" strokeWidth={3} fillOpacity={1} fill="url(#colorTourists)" name="Lượng khách quốc tế (triệu người)" />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {volumeChartId === '3.2' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeKyotoData} margin={{ top: 22, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }}>
                    <Label value="(k)" position="top" offset={10} fill="#94a3b8" fontSize={11} />
                  </YAxis>
                  <Tooltip formatter={(value: any) => [`${value} Nghìn khách`, 'Khách quốc tế đến Kyoto']} />
                  <Bar dataKey="value" fill="#9BE7FA" stroke="#0D7287" strokeWidth={1} radius={[4, 4, 0, 0]} name="Khách đến TP Kyoto (nghìn người)" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {volumeChartId === '3.3' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeNaraData} margin={{ top: 22, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }}>
                    <Label value="(k)" position="top" offset={10} fill="#94a3b8" fontSize={11} />
                  </YAxis>
                  <Tooltip formatter={(value: any) => [`${value} Nghìn khách`, 'Khách quốc tế đến Nara']} />
                  <Bar dataKey="value" fill="#FFD14C" stroke="#FFD14C" strokeWidth={1} radius={[4, 4, 0, 0]} name="Khách đến Cố đô Nara (nghìn người)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Volume Commentary & Comparison Table */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <strong className="text-slate-900 font-bold dark:text-white">
              Phân tích học thuật & Cập nhật Dữ liệu Mới nhất (JNTO / DMO KYOTO / Nara):
            </strong>
            <span className="text-xs tabular-nums text-[#0D7287] dark:text-[#9BE7FA]">
              Niên luận (2003–2022) + Cập nhật chính thức (2023–2024)
            </span>
          </div>

          {volumeChartId === '3.1' && (
            <p>
              Lượng khách tăng vọt sau 2013 với tốc độ CAGR <strong>+20.6%/năm</strong>, lập đỉnh tiền đại dịch 31.9 triệu (2019) và tái thiết lập <strong>kỷ lục 36.9 triệu lượt vào 2024</strong> (theo JNTO).
            </p>
          )}

          {volumeChartId === '3.2' && (
            <div className="space-y-2">
              <p>
                Khách quốc tế đến Kyoto bùng nổ từ 844.9k (2013) lên đỉnh 4.5M (2019). Năm 2024 lập kỷ lục <strong>8.21 triệu khách quốc tế</strong>, lần đầu vượt khách nội địa (theo DMO KYOTO).
              </p>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                <span className="tabular-nums font-bold text-amber-700 dark:text-amber-400 shrink-0">KIỂM ĐỊNH DATA:</span>
                <span>
                  Đồ thị nguyên bản trong Niên luận (trang 31) ghi nhận năm 2020 là <strong>3,799 k</strong> (do lỗi gõ thiếu dấu phẩy thập phân của <strong>379.9 k</strong>). Biểu đồ tương tác đã được Data Analyst chuẩn hóa khoa học theo thống kê DMO Kyoto.
                </span>
              </div>
            </div>
          )}

          {volumeChartId === '3.3' && (
            <div className="space-y-2">
              <p>
                Khách đến Nara tăng mạnh từ 435k (2013) lên đỉnh 3.32M (2019). Năm 2024 đạt <strong>3.14 triệu lượt khách</strong>, phục hồi 94.6% so với trước đại dịch.
              </p>
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-900 dark:text-cyan-200 text-xs flex items-start gap-2">
                <span className="tabular-nums font-bold text-cyan-700 dark:text-cyan-400 shrink-0">NGHỊCH LÝ DAY-TRIPPER:</span>
                <span>
                  Dù đón hơn 3.3M khách ngoại quốc, trên <strong>85% du khách chỉ ghé thăm trong ngày</strong> (rời đi sau 3–4 tiếng ngắm hươu) khiến doanh thu lưu trú thấp và gây quá tải hạ tầng đô thị.
                </span>
              </div>
            </div>
          )}

          {/* Kyoto vs Nara Table */}
          <div className="mt-4 pt-4 border-slate-200 dark:border-slate-700">
            <h5 className="font-bold text-slate-900 mb-2 flex items-center justify-between dark:text-white text-xs">
              <span>Đối sánh Lượng khách du lịch: Kyoto vs Nara (2013 - 2024)</span>
              <span className="text-xs tabular-nums text-slate-400">Đơn vị: Nghìn người (k)</span>
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase font-bold bg-slate-50 dark:bg-slate-800/60">
                    <th className="py-1.5 px-2">Năm khảo sát</th>
                    <th className="py-1.5 px-2 text-[#0D7287] dark:text-[#9BE7FA]">Cố đô Kyoto (Khách quốc tế)</th>
                    <th className="py-1.5 px-2 text-amber-600 dark:text-amber-400">Cố đô Nara (Khách quốc tế)</th>
                    <th className="py-1.5 px-2 text-slate-500">Tỷ lệ Nara / Kyoto</th>
                  </tr>
                </thead>
                <tbody className="[&>tr:nth-child(even)]:bg-slate-50 dark:[&>tr:nth-child(even)]:bg-slate-800/40">
                  {activeRegionalData.filter(d => ['2013', '2015', '2017', '2019', '2021', '2022', '2023', '2024'].includes(d.year)).map(d => {
                    const ratio = d.nara && d.kyoto ? ((d.nara / d.kyoto) * 100).toFixed(1) : '-';
                    return (
                      <tr key={d.year}>
                        <td className="py-1.5 px-2 tabular-nums font-bold text-slate-600 dark:text-slate-400">{d.year}</td>
                        <td className="py-1.5 px-2 font-bold text-slate-900 dark:text-white">{d.kyoto.toLocaleString()}k khách</td>
                        <td className="py-1.5 px-2 font-bold text-slate-900 dark:text-white">{d.nara?.toLocaleString()}k khách</td>
                        <td className="py-1.5 px-2 tabular-nums text-slate-500 dark:text-slate-400">{ratio}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 3.1.2 BIỂU ĐỒ DOANH THU & CHI TIÊU (REVENUE HUB) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-black bg-[#FFE485]/40 text-[#92400E] dark:bg-[#FFE485]/20 dark:text-[#FFE485]">
                Nhóm 2 • Doanh thu & Chi tiêu
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Biểu đồ {selectedRevenueMeta.chartId}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                {isEn ? selectedRevenueMeta.nameEn : selectedRevenueMeta.nameVi}
              </h4>
              {liveData?.isLiveDb && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] tabular-nums font-bold bg-[#C8EEF7]/40 text-[#074553] dark:bg-[#074553]/60 dark:text-[#9BE7FA] border border-[#9BE7FA]/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD14C] animate-pulse" />
                  MySQL Live
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">Đơn vị đo lường: <strong>{isEn ? selectedRevenueMeta.unitEn : selectedRevenueMeta.unitVi}</strong></p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExportChart(`revenue-chart-container-${revenueChartId}`, `Bieu-do-Doanh-thu-${revenueChartId}`)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 cursor-pointer"
              title="Tải ảnh biểu đồ PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Revenue Chart Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-slate-100 dark:border-slate-800 scrollbar-thin">
          {revenueCharts.map((item) => (
            <button
              key={item.chartId}
              onClick={() => setRevenueChartId(item.chartId)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                revenueChartId === item.chartId
                  ? 'bg-[#0D7287] text-white shadow-xs font-black dark:bg-[#9BE7FA] dark:text-slate-950'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Biểu đồ {item.chartId} • {item.chartId === '3.4' ? 'Chi tiêu Toàn quốc' : item.chartId === '3.5' ? 'Chi tiêu Kyoto' : 'Chi tiêu Nara'}
            </button>
          ))}
        </div>

        {/* Revenue Chart Rendering */}
        <div id={`revenue-chart-container-${revenueChartId}`} className="pt-6 min-h-[360px]">
          <div className="h-[340px] w-full">
            {revenueChartId === '3.4' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeSpendData} margin={{ top: 22, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD14C" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FFD14C" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }}>
                    <Label value="(T¥)" position="top" offset={10} fill="#94a3b8" fontSize={11} />
                  </YAxis>
                  <Tooltip formatter={(value: any) => [`${value} Nghìn tỷ Yên`, 'Chi tiêu khách quốc tế']} />
                  <Area type="monotone" dataKey="value" stroke="#FFD14C" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" name="Chi tiêu quốc tế (nghìn tỷ Yên)" />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {revenueChartId === '3.5' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kyotoSpendData} margin={{ top: 22, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }}>
                    <Label value="(B¥)" position="top" offset={10} fill="#94a3b8" fontSize={11} />
                  </YAxis>
                  <Tooltip formatter={(value: any) => [`${value} Tỷ Yên`, 'Chi tiêu tại Kyoto']} />
                  <Bar dataKey="value" fill="#0D7287" radius={[4, 4, 0, 0]} name="Chi tiêu du lịch TP Kyoto (tỷ Yên)" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {revenueChartId === '3.6' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={naraSpendData} margin={{ top: 22, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }}>
                    <Label value="(B¥)" position="top" offset={10} fill="#94a3b8" fontSize={11} />
                  </YAxis>
                  <Tooltip formatter={(value: any) => [`${value} Tỷ Yên`, 'Chi tiêu tại Nara']} />
                  <Bar dataKey="value" fill="#FFD14C" radius={[4, 4, 0, 0]} name="Chi tiêu du lịch Cố đô Nara (tỷ Yên)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Revenue Commentary & GDP Contribution Table */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <strong className="text-slate-900 font-bold dark:text-white">
              Phân tích học thuật & Cập nhật Doanh thu Mới nhất (観光庁 / DMO KYOTO / Nara):
            </strong>
            <span className="text-xs tabular-nums text-[#0D7287] dark:text-[#9BE7FA]">
              Niên luận (2010–2021) + Cập nhật chính thức (2022–2024)
            </span>
          </div>

          {revenueChartId === '3.4' && (
            <p>
              Chi tiêu du lịch toàn quốc bùng nổ theo cấp số nhân từ 1.41T ¥ (2013) lên 4.81T ¥ (2019, x3.4 lần). Năm 2024 đạt <strong>kỷ lục 8.14 nghìn tỷ Yên</strong> và sơ bộ 2025 vượt mốc <strong>9.46 nghìn tỷ Yên</strong> (theo JTA 観光庁).
            </p>
          )}

          {revenueChartId === '3.5' && (
            <p>
              Doanh thu du lịch Cố đô Kyoto hồi phục ngoạn mục từ 648.8 tỷ Yên (2011) lên đỉnh 1,308 tỷ Yên (2019) và đạt <strong>kỷ lục 1,908 tỷ Yên</strong> vào 2024 (đóng góp ~12.8% ngân sách thuế thành phố).
            </p>
          )}

          {revenueChartId === '3.6' && (
            <div className="space-y-2">
              <p>
                Chi tiêu tại Cố đô Nara được ghi nhận 872.6 (2013), đỉnh 1,208 (2018) và phục hồi mạnh mẽ sau đại dịch đạt <strong>2,060 tỷ Yên (2024)</strong>.
              </p>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                <span className="tabular-nums font-bold text-amber-700 dark:text-amber-400 shrink-0">KIỂM ĐỊNH DATA:</span>
                <span>
                  Đồ thị gốc trong Niên luận ghi đơn vị &quot;tỷ yên&quot;. Tuy nhiên số liệu cấp tỉnh của Nhật Bản thường đo bằng <strong>億円 (trăm triệu Yên)</strong>. Doanh thu Nara phản ánh tổng chi tiêu (gồm cả khách nội địa và chi phí vận tải liên vùng), vì nếu chỉ tính riêng khách quốc tế thì doanh thu Nara không thể tiệm cận Kyoto do phần lớn là khách đi về trong ngày.
                </span>
              </div>
            </div>
          )}

          {/* GDP Contribution Table */}
          <div className="mt-4 pt-4 border-slate-200 dark:border-slate-700">
            <h5 className="font-bold text-slate-900 mb-2 flex items-center justify-between dark:text-white text-xs">
              <span>Tăng trưởng Đóng góp GDP Quốc gia của Ngành Du lịch (2000 - 2024)</span>
              <span className="text-xs tabular-nums text-slate-400">Nguồn: METI, WTTC & Cập nhật JTA/JNTO</span>
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase font-bold bg-slate-50 dark:bg-slate-800/60">
                    <th className="py-1.5 px-2">Năm thống kê</th>
                    <th className="py-1.5 px-2 text-[#0D7287] dark:text-[#9BE7FA]">Tỷ trọng trong tổng GDP</th>
                    <th className="py-1.5 px-2">Quy mô Doanh thu trực tiếp</th>
                  </tr>
                </thead>
                <tbody className="[&>tr:nth-child(even)]:bg-slate-50 dark:[&>tr:nth-child(even)]:bg-slate-800/40">
                  {gdpShareData.map(d => (
                    <tr key={d.year}>
                      <td className="py-1.5 px-2 tabular-nums font-bold text-slate-600 dark:text-slate-400">{d.year}</td>
                      <td className="py-1.5 px-2 font-bold text-[#0D7287] dark:text-[#9BE7FA]">{d.gdpShare}% GDP</td>
                      <td className="py-1.5 px-2 font-bold text-slate-900 dark:text-white">{d.directRevenue} Nghìn tỷ ¥</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chapter3AnalyticsSection;
