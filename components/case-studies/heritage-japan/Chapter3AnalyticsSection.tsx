'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Eye, Download } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { AcademicThesisMockup } from '@/components/ui/AcademicThesisMockup';
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

interface Chapter3AnalyticsSectionProps {
  isEn: boolean;
  onExportChart: (_chartId: string, _filename: string) => void;
}

export function Chapter3AnalyticsSection({ isEn, onExportChart }: Chapter3AnalyticsSectionProps) {
  // Volume Charts (3.1, 3.2, 3.3)
  const [volumeChartId, setVolumeChartId] = useState<string>('3.1');
  const [volumeViewMode, setVolumeViewMode] = useState<'interactive' | 'authentic'>('interactive');

  // Revenue Charts (3.4, 3.5, 3.6)
  const [revenueChartId, setRevenueChartId] = useState<string>('3.4');
  const [revenueViewMode, setRevenueViewMode] = useState<'interactive' | 'authentic'>('interactive');

  const volumeCharts = useMemo(() => THESIS_CHARTS_CATALOG.filter(c => ['3.1', '3.2', '3.3'].includes(c.chartId)), []);
  const revenueCharts = useMemo(() => THESIS_CHARTS_CATALOG.filter(c => ['3.4', '3.5', '3.6'].includes(c.chartId)), []);

  const selectedVolumeMeta = volumeCharts.find(c => c.chartId === volumeChartId) || volumeCharts[0];
  const selectedRevenueMeta = revenueCharts.find(c => c.chartId === revenueChartId) || revenueCharts[0];

  return (
    <div className="mb-14">
      <div className="max-w-4xl mb-6">
        <h3 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2 dark:text-white">
          <TrendingUp className="w-6 h-6 text-[#0D7287] dark:text-[#9BE7FA]" />
          <span>3.1. Sự phát triển nhìn từ tiêu chí Hiệu quả du lịch (Quantitative Analytics)</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-700 mt-2 leading-relaxed dark:text-slate-300">
          Sau khi Chương trình hành động 2013 được triển khai, các chỉ số hiệu quả du lịch tại Nhật Bản và hai trung tâm di sản hàng đầu là <strong>Thành phố Kyoto</strong> và <strong>Cố đô Nara</strong> đã có bước tăng trưởng nhảy vọt cả về quy mô lượng khách lẫn tổng mức chi tiêu.
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Khách quốc tế toàn quốc</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">36.9 Triệu</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+255%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Kỷ lục 2024 (JNTO, vượt đỉnh 31.9M năm 2019)</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Chi tiêu du khách quốc tế</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">8.14 Nghìn tỷ ¥</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">x5.8 lần</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Kỷ lục 2024 (観光庁, tăng +69% vs 2019)</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Đóng góp vào GDP Nhật</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">8.4% GDP</span>
            <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">68.2T ¥</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Quy mô doanh thu du lịch 2024 (METI/WTTC)</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Chi tiêu du lịch Kyoto</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">1.91 Nghìn tỷ ¥</span>
            <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">8.21M khách</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Kỷ lục 2024 (Khách quốc tế chiếm 50.4% lưu trú)</p>
        </div>
      </div>

      {/* 3.1.1 BIỂU ĐỒ SỐ LƯỢNG KHÁCH (VOLUME TELEMETRY HUB) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-black bg-[#9BE7FA] text-slate-950 dark:bg-[#9BE7FA] dark:text-slate-950">
                Nhóm 1 • Số lượng khách
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Biểu đồ {selectedVolumeMeta.chartId}
              </span>
              <span className="text-xs text-slate-500 font-semibold">(Trang {selectedVolumeMeta.pageInDoc} trong Niên luận)</span>
            </div>
            <h4 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
              {isEn ? selectedVolumeMeta.nameEn : selectedVolumeMeta.nameVi}
            </h4>
            <p className="text-xs text-slate-500">Đơn vị đo lường: <strong>{isEn ? selectedVolumeMeta.unitEn : selectedVolumeMeta.unitVi}</strong></p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <button
                onClick={() => setVolumeViewMode('interactive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  volumeViewMode === 'interactive'
                    ? 'bg-white text-slate-950 shadow-xs font-black dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-300'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>Biểu đồ Tương tác</span>
              </button>
              <button
                onClick={() => setVolumeViewMode('authentic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  volumeViewMode === 'authentic'
                    ? 'bg-white text-slate-950 shadow-xs font-black dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-300'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Ảnh Đồ thị Gốc</span>
              </button>
            </div>

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
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-100 dark:border-slate-800 scrollbar-thin">
          {volumeCharts.map((item) => (
            <button
              key={item.chartId}
              onClick={() => setVolumeChartId(item.chartId)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
          {volumeViewMode === 'interactive' ? (
            <div className="h-[340px] w-full">
              {volumeChartId === '3.1' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={touristsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTourists" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0D7287" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0D7287" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} unit="M" />
                    <Tooltip formatter={(value: any) => [`${value} Triệu khách`, 'Khách quốc tế']} />
                    <Area type="monotone" dataKey="value" stroke="#0D7287" strokeWidth={3} fillOpacity={1} fill="url(#colorTourists)" name="Lượng khách quốc tế (triệu người)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {volumeChartId === '3.2' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kyotoVisitorsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} unit="k" />
                    <Tooltip formatter={(value: any) => [`${value} Nghìn khách`, 'Khách quốc tế đến Kyoto']} />
                    <Bar dataKey="value" fill="#9BE7FA" stroke="#0D7287" strokeWidth={1} radius={[4, 4, 0, 0]} name="Khách đến TP Kyoto (nghìn người)" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {volumeChartId === '3.3' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={naraVisitorsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} unit="k" />
                    <Tooltip formatter={(value: any) => [`${value} Nghìn khách`, 'Khách quốc tế đến Nara']} />
                    <Bar dataKey="value" fill="#FFD14C" stroke="#B8860B" strokeWidth={1} radius={[4, 4, 0, 0]} name="Khách đến Cố đô Nara (nghìn người)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : (
            <AcademicThesisMockup
              chartId={selectedVolumeMeta.chartId}
              nameVi={selectedVolumeMeta.nameVi}
              nameEn={selectedVolumeMeta.nameEn}
              unitVi={selectedVolumeMeta.unitVi}
              unitEn={selectedVolumeMeta.unitEn}
              pageInDoc={selectedVolumeMeta.pageInDoc}
              data={volumeChartId === '3.1' ? touristsData : volumeChartId === '3.2' ? kyotoVisitorsData : naraVisitorsData}
              isEn={isEn}
            />
          )}
        </div>

        {/* Volume Commentary & Comparison Table */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <strong className="text-slate-900 font-bold dark:text-white">
              Phân tích học thuật & Cập nhật Dữ liệu Mới nhất (JNTO / DMO KYOTO / Nara):
            </strong>
            <span className="text-[10px] font-mono text-[#0D7287] dark:text-[#9BE7FA]">
              Niên luận (2003–2022) + Cập nhật chính thức (2023–2024)
            </span>
          </div>
          {volumeChartId === '3.1' && (
            <p>
              Lượng khách quốc tế đến Nhật Bản trước năm 2013 dao động ổn định trong khoảng 6 đến 8 triệu. Nhờ Chương trình hành động quốc gia 2013, con số này tăng phi mã, chạm 19.7 triệu (2015) và đạt đỉnh 31.9 triệu (2019). Sau giai đoạn gián đoạn 2020–2021, du lịch Nhật phục hồi thần tốc: năm 2023 đạt 25.1 triệu lượt và năm 2024 chính thức thiết lập <strong>kỷ lục lịch sử mới với 36.9 triệu lượt khách</strong> (tăng +47.1% so với 2023 và vượt đỉnh năm 2019 tới 5 triệu lượt theo JNTO).
            </p>
          )}
          {volumeChartId === '3.2' && (
            <p>
              Tại Thành phố Kyoto, lượng khách nước ngoài lưu trú trước 2013 dưới 1 triệu người. Giai đoạn 2013–2019 bùng nổ lên 4.5 triệu lượt. Sau đại dịch, lượng khách hồi phục ngoạn mục: năm 2023 đạt 5.36 triệu lượt và năm 2024 bứt phá lên mức kỷ lục <strong>8.21 triệu lượt khách quốc tế</strong>, lần đầu tiên vượt qua lượng khách nội địa (8.09 triệu) và chiếm 50.4% tổng lượng khách lưu trú tại cố đô (theo DMO KYOTO).
            </p>
          )}
          {volumeChartId === '3.3' && (
            <p>
              Cố đô Nara ghi nhận tốc độ tăng trưởng hàng năm phi thường từ 174 nghìn lượt (2011) lên 3.3 triệu lượt (2019). Hậu đại dịch, lượng khách quốc tế phục hồi mạnh mẽ: năm 2023 đón 2.58 triệu lượt và năm 2024 đạt <strong>3.14 triệu lượt khách</strong> (xếp thứ 7 trong 47 tỉnh thành Nhật Bản theo Cục Du lịch Tỉnh Nara).
            </p>
          )}

          {/* Kyoto vs Nara Table */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h5 className="font-bold text-slate-900 mb-2 flex items-center justify-between dark:text-white text-xs">
              <span>Đối sánh Lượng khách du lịch: Kyoto vs Nara (2013 - 2024)</span>
              <span className="text-[10px] font-mono text-slate-400">Đơn vị: Nghìn người (k)</span>
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold dark:border-slate-700">
                    <th className="py-1.5 px-2">Năm khảo sát</th>
                    <th className="py-1.5 px-2 text-[#0D7287] dark:text-[#9BE7FA]">Cố đô Kyoto (Khách quốc tế)</th>
                    <th className="py-1.5 px-2 text-amber-600 dark:text-amber-400">Cố đô Nara (Khách quốc tế)</th>
                    <th className="py-1.5 px-2 text-slate-500">Tỷ lệ Nara / Kyoto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {kyotoNaraVisitorsData.filter(d => ['2013', '2015', '2017', '2019', '2021', '2022', '2023', '2024'].includes(d.year)).map(d => {
                    const ratio = d.nara && d.kyoto ? ((d.nara / d.kyoto) * 100).toFixed(1) : '-';
                    return (
                      <tr key={d.year}>
                        <td className="py-1.5 px-2 font-mono font-bold text-slate-600 dark:text-slate-400">{d.year}</td>
                        <td className="py-1.5 px-2 font-bold text-slate-900 dark:text-white">{d.kyoto.toLocaleString()}k khách</td>
                        <td className="py-1.5 px-2 font-bold text-slate-900 dark:text-white">{d.nara?.toLocaleString()}k khách</td>
                        <td className="py-1.5 px-2 font-mono text-slate-500 dark:text-slate-400">{ratio}%</td>
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-black bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300">
                Nhóm 2 • Doanh thu & Chi tiêu
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Biểu đồ {selectedRevenueMeta.chartId}
              </span>
              <span className="text-xs text-slate-500 font-semibold">(Trang {selectedRevenueMeta.pageInDoc} trong Niên luận)</span>
            </div>
            <h4 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
              {isEn ? selectedRevenueMeta.nameEn : selectedRevenueMeta.nameVi}
            </h4>
            <p className="text-xs text-slate-500">Đơn vị đo lường: <strong>{isEn ? selectedRevenueMeta.unitEn : selectedRevenueMeta.unitVi}</strong></p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <button
                onClick={() => setRevenueViewMode('interactive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  revenueViewMode === 'interactive'
                    ? 'bg-white text-slate-950 shadow-xs font-black dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-300'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Biểu đồ Tương tác</span>
              </button>
              <button
                onClick={() => setRevenueViewMode('authentic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  revenueViewMode === 'authentic'
                    ? 'bg-white text-slate-950 shadow-xs font-black dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-300'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Ảnh Đồ thị Gốc</span>
              </button>
            </div>

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
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-100 dark:border-slate-800 scrollbar-thin">
          {revenueCharts.map((item) => (
            <button
              key={item.chartId}
              onClick={() => setRevenueChartId(item.chartId)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                revenueChartId === item.chartId
                  ? 'bg-emerald-700 text-white shadow-xs font-black dark:bg-emerald-500 dark:text-slate-950'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Biểu đồ {item.chartId} • {item.chartId === '3.4' ? 'Chi tiêu Toàn quốc' : item.chartId === '3.5' ? 'Doanh thu Kyoto' : 'Chi tiêu Nara'}
            </button>
          ))}
        </div>

        {/* Revenue Chart Rendering */}
        <div id={`revenue-chart-container-${revenueChartId}`} className="pt-6 min-h-[360px]">
          {revenueViewMode === 'interactive' ? (
            <div className="h-[340px] w-full">
              {revenueChartId === '3.4' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendNationalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} unit="T¥" />
                    <Tooltip formatter={(value: any) => [`${value} Nghìn tỷ Yên`, 'Chi tiêu khách quốc tế']} />
                    <Area type="monotone" dataKey="value" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" name="Chi tiêu quốc tế (nghìn tỷ Yên)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {revenueChartId === '3.5' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kyotoSpendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} unit="B¥" />
                    <Tooltip formatter={(value: any) => [`${value} Tỷ Yên`, 'Chi tiêu tại Kyoto']} />
                    <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} name="Chi tiêu du lịch TP Kyoto (tỷ Yên)" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {revenueChartId === '3.6' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={naraSpendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} unit="B¥" />
                    <Tooltip formatter={(value: any) => [`${value} Tỷ Yên`, 'Chi tiêu tại Nara']} />
                    <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Chi tiêu du lịch Cố đô Nara (tỷ Yên)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : (
            <AcademicThesisMockup
              chartId={selectedRevenueMeta.chartId}
              nameVi={selectedRevenueMeta.nameVi}
              nameEn={selectedRevenueMeta.nameEn}
              unitVi={selectedRevenueMeta.unitVi}
              unitEn={selectedRevenueMeta.unitEn}
              pageInDoc={selectedRevenueMeta.pageInDoc}
              data={revenueChartId === '3.4' ? spendNationalData : revenueChartId === '3.5' ? kyotoSpendData : naraSpendData}
              isEn={isEn}
            />
          )}
        </div>

        {/* Revenue Commentary & GDP Contribution Table */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <strong className="text-slate-900 font-bold dark:text-white">
              Phân tích học thuật & Cập nhật Doanh thu Mới nhất (観光庁 / DMO KYOTO / Nara):
            </strong>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              Niên luận (2010–2021) + Cập nhật chính thức (2022–2024)
            </span>
          </div>
          {revenueChartId === '3.4' && (
            <p>
              Tổng chi tiêu du lịch của khách quốc tế tại Nhật Bản tăng từ 1.41 nghìn tỷ Yên (2013) lên 4.81 nghìn tỷ Yên (2019). Giai đoạn hậu đại dịch bùng nổ mạnh mẽ nhờ tỷ giá đồng Yên thuận lợi và sự phục hồi toàn diện: năm 2023 đạt 5.31 nghìn tỷ Yên và năm 2024 chính thức xác lập <strong>kỷ lục lịch sử mọi thời đại 8.14 nghìn tỷ Yên</strong> (tăng gấp 5.8 lần so với 2013 và tăng +69.2% so với đỉnh 2019 theo Tổng cục Du lịch Nhật Bản 観光庁).
            </p>
          )}
          {revenueChartId === '3.5' && (
            <p>
              Doanh thu du lịch tại Kyoto tăng trưởng bền bỉ từ 601 tỷ Yên (2008) lên 1.308 tỷ Yên (2019). Sau đại dịch, chi tiêu tại cố đô hồi phục ngoạn mục lên 1.537 tỷ Yên (2023) và lập đỉnh lịch sử <strong>1.908 tỷ Yên</strong> vào năm 2024, tạo hiệu quả kinh tế lan tỏa lên tới 2.989 tỷ Yên cho toàn thành phố.
            </p>
          )}
          {revenueChartId === '3.6' && (
            <p>
              Tại Cố đô Nara, tổng chi tiêu du lịch tăng từ 872 tỷ Yên (2013) lên 1.208 tỷ Yên (2018). Hậu đại dịch, chi tiêu tại Nara bứt phá đạt 1.807 tỷ Yên (2023) và lập kỷ lục lịch sử mới <strong>2.060 tỷ Yên</strong> vào năm 2024 (tăng +14.0% so với mức đỉnh 2019 theo Cục Du lịch Tỉnh Nara).
            </p>
          )}

          {/* GDP Contribution Table */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h5 className="font-bold text-slate-900 mb-2 flex items-center justify-between dark:text-white text-xs">
              <span>Tăng trưởng Đóng góp GDP Quốc gia của Ngành Du lịch (2000 - 2024)</span>
              <span className="text-[10px] font-mono text-slate-400">Nguồn: METI, WTTC & Cập nhật JTA/JNTO</span>
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold dark:border-slate-700">
                    <th className="py-1.5 px-2">Năm thống kê</th>
                    <th className="py-1.5 px-2 text-emerald-600 dark:text-emerald-400">Tỷ trọng trong tổng GDP</th>
                    <th className="py-1.5 px-2">Quy mô Doanh thu trực tiếp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {gdpShareData.map(d => (
                    <tr key={d.year}>
                      <td className="py-1.5 px-2 font-mono font-bold text-slate-600 dark:text-slate-400">{d.year}</td>
                      <td className="py-1.5 px-2 font-bold text-emerald-600 dark:text-emerald-400">{d.gdpShare}% GDP</td>
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
