'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Filter,
  LayoutDashboard,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { V2 } from './commercial/kamiOutlineV2Metrics';

type PhaseFilter = 'all' | 'ramp' | 'peak' | 'contraction' | 'autumn';
type WorkspaceTab = 'dashboard' | 'spec';

const OVER10_MONTHLY = [
  { month: 'T4', sessions: 4, gmvPerHourM: 3.36 },
  { month: 'T5', sessions: 12, gmvPerHourM: 4.54 },
  { month: 'T6', sessions: 23, gmvPerHourM: 8.48 },
  { month: 'T7', sessions: 16, gmvPerHourM: 1.43 },
  { month: 'T8', sessions: 12, gmvPerHourM: 0.73 },
];

const BI_CSV_PACK = [
  { name: 'fact_store_daily_231d.csv', label: 'Fact Store Daily (231d)' },
  { name: 'fact_monthly_summary.csv', label: 'Fact Monthly (8m)' },
  { name: 'dim_shop_products_339.csv', label: 'Dim Products (339)' },
  { name: 'dim_koc_screening_302.csv', label: 'Dim KOC Screening (302)' },
];

const EXTERNAL_BI_URL = process.env.NEXT_PUBLIC_KAMI_BI_EXTERNAL_URL || '';

export default function KamiBiInteractiveWorkspace() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('dashboard');
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all');
  const [selectedBand, setSelectedBand] = useState<string>('all');
  const [hourlyCostK, setHourlyCostK] = useState<number>(450); // 450k VND / hr
  const [marginPct, setMarginPct] = useState<number>(25); // 25% contribution margin

  const monthlyData = useMemo(() => {
    const all = V2.ch3.monthly;
    if (phaseFilter === 'all') return all;
    return all.filter((m) => {
      if (phaseFilter === 'ramp') return m.month <= '2026-05';
      if (phaseFilter === 'peak') return m.month === '2026-06';
      if (phaseFilter === 'contraction') return m.month === '2026-07' || m.month === '2026-08';
      return m.month >= '2026-09';
    });
  }, [phaseFilter]);

  const filteredTotals = useMemo(() => {
    const totalGmvB = monthlyData.reduce((acc, m) => acc + m.storeGmvB, 0);
    const totalUnits = monthlyData.reduce((acc, m) => acc + m.units, 0);
    const totalDays = monthlyData.reduce((acc, m) => acc + m.days, 0);
    const dailyAvgM = totalDays > 0 ? (totalGmvB * 1000) / totalDays : 0;
    const aspVnd = totalUnits > 0 ? Math.round((totalGmvB * 1e9) / totalUnits) : 0;
    return { totalGmvB, totalUnits, totalDays, dailyAvgM, aspVnd };
  }, [monthlyData]);

  const priceBands = useMemo(() => {
    const all = V2.ch2.skuPareto.priceBandsRealizedAsp;
    if (selectedBand === 'all') return all;
    return all.filter((b) => b.band === selectedBand);
  }, [selectedBand]);

  const breakEvenGmvM = useMemo(() => {
    if (marginPct <= 0) return 0;
    return Number(((hourlyCostK / (marginPct / 100)) / 1000).toFixed(2));
  }, [hourlyCostK, marginPct]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Action Bar */}
      <header className="sticky top-0 z-20 min-h-[60px] py-2 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-4 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href="/projects/proj-kami-ely"
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0D7287] dark:text-slate-300 dark:hover:text-[#9BE7FA] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
            <span>Về Case Study</span>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              Kami Ely — BI Dashboard Tương tác &amp; Đặc tả Power BI / Looker Studio
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate tabular-nums">
              SSOT 231 ngày · Star Schema 4 Fact · 3 Dim · 6 DAX Measures
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="Chế độ xem BI"
            className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              className={`min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-[#074553] dark:text-[#9BE7FA]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
              <span>BI Dashboard (Slicer)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'spec'}
              onClick={() => setActiveTab('spec')}
              className={`min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'spec'
                  ? 'bg-white dark:bg-slate-900 text-[#074553] dark:text-[#9BE7FA]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Star Schema &amp; DAX</span>
            </button>
          </div>

          <a
            href="/kami/kami_ely_analytics_workbook.xlsx"
            download
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-2 rounded-xl transition-colors cursor-pointer border border-emerald-500/35 shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Tải Excel (.xlsx)</span>
          </a>

          {EXTERNAL_BI_URL ? (
            <a
              href={EXTERNAL_BI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold text-[#074553] bg-[#9BE7FA] hover:bg-[#C8EEF7] px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-[#0D7287]/20 shrink-0"
            >
              <span>Mở Looker / Tableau</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          ) : (
            <a
              href="/kami/kami-ely-bi-spec.html"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold text-[#074553] bg-[#9BE7FA] hover:bg-[#C8EEF7] px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-[#0D7287]/20 shrink-0"
            >
              <span>Mở bản in PDF</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </header>

      {activeTab === 'dashboard' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5 tabular-nums">
          {/* Global BI Slicer Bar */}
          <section className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
                <Filter className="w-4 h-4" aria-hidden="true" />
                <span>Bộ lọc tương tác toàn cục (Cross-Filter Slicers)</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Chọn giai đoạn mùa vụ hoặc dải giá để lọc trực tiếp KPI và biểu đồ bên dưới
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 text-xs">
              <div className="lg:col-span-7 space-y-1.5">
                <p className="font-semibold text-slate-600 dark:text-slate-400">1. Giai đoạn vận hành (231 ngày):</p>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: 'all', label: 'Tất cả 231N (T3–T10)' },
                      { id: 'ramp', label: 'Tăng tốc (T3–T5)' },
                      { id: 'peak', label: 'Đỉnh Hè (T6)' },
                      { id: 'contraction', label: 'Sụt giảm (T7–T8)' },
                      { id: 'autumn', label: 'Hồi phục Thu (T9–T10)' },
                    ] as const
                  ).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPhaseFilter(p.id)}
                      className={`min-h-[36px] px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer border ${
                        phaseFilter === p.id
                          ? 'bg-[#9BE7FA] text-slate-950 border-[#0D7287]/30'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#0D7287]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-1.5">
                <p className="font-semibold text-slate-600 dark:text-slate-400">2. Dải giá thực bán (Realized ASP — 339 link):</p>
                <div className="flex flex-wrap gap-1.5">
                  {['all', '<75k', '75k-150k', '150k-250k', '>=250k'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBand(b)}
                      className={`min-h-[36px] px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer border ${
                        selectedBand === b
                          ? 'bg-[#FFE485] text-amber-950 border-[#FFD14C]'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#FFD14C]'
                      }`}
                    >
                      {b === 'all' ? 'Tất cả dải giá' : b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 4 Dynamic KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-2xl border border-[#9BE7FA] bg-[#C8EEF7]/30 dark:bg-slate-900/80 dark:border-slate-800 p-4 space-y-1">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tổng GMV theo bộ lọc</p>
              <p className="text-2xl font-extrabold text-slate-950 dark:text-white">
                {filteredTotals.totalGmvB.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tỷ đ
              </p>
              <p className="text-[11px] text-[#074553] dark:text-[#9BE7FA] font-semibold">
                {filteredTotals.totalDays} ngày quan sát · Net Store Daily
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 space-y-1">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tổng sản lượng bán ra</p>
              <p className="text-2xl font-extrabold text-slate-950 dark:text-white">
                {filteredTotals.totalUnits.toLocaleString('vi-VN')} sp
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ASP thực bán: {filteredTotals.aspVnd.toLocaleString('vi-VN')} đ/sp
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 space-y-1">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">GMV bình quân / ngày</p>
              <p className="text-2xl font-extrabold text-slate-950 dark:text-white">
                {filteredTotals.dailyAvgM.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Tr/ngày
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Đỉnh 16/06: 315,0 Tr · Đáy T8: 22,1 Tr/ngày
              </p>
            </div>
            <div className="rounded-2xl border border-[#FFD14C] bg-[#FFE485]/35 dark:bg-slate-900/80 dark:border-[#FFD14C]/40 p-4 space-y-1">
              <p className="text-xs font-semibold text-amber-950 dark:text-[#FFE485]">Điểm hòa vốn ca Live &gt;10h</p>
              <p className="text-2xl font-extrabold text-slate-950 dark:text-white">
                {breakEvenGmvM.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Tr/giờ
              </p>
              <p className="text-[11px] text-amber-900 dark:text-[#FFE485]">
                Giả định {hourlyCostK}k/h ÷ biên {marginPct}% (Kéo thanh bên dưới)
              </p>
            </div>
          </section>

          {/* Row 2: Monthly Pulse Chart + Realized ASP Price Bands */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                    Trang 1 · Executive Pulse: GMV tháng (tỷ đ) &amp; Bình quân ngày (Tr/ngày)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Đỉnh tháng 6 đạt 4,06 tỷ đ trước khi giảm -83,1% về 0,68 tỷ đ tháng 8 và phục hồi nhờ AT06 tháng 10.
                  </p>
                </div>
              </div>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyData} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="shortLabel" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} unit=" tỷ" />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} unit=" Tr" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="storeGmvB" name="GMV tháng (tỷ đ)" radius={[6, 6, 0, 0]}>
                      {monthlyData.map((entry) => (
                        <Cell
                          key={entry.month}
                          fill={
                            entry.month === '2026-06'
                              ? '#0D7287'
                              : entry.month === '2026-08'
                              ? '#E11D48'
                              : '#9BE7FA'
                          }
                        />
                      ))}
                    </Bar>
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="dailyAvgM"
                      name="GMV TB/ngày (Tr đ)"
                      stroke="#D97706"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#FFE485', stroke: '#D97706', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 sm:p-5 space-y-3">
              <div>
                <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                  Trang 2 · Phân bổ 339 link theo 4 dải giá thực bán (Realized ASP)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dải 75k–250k chiếm 95,4% GMV (75k–150k: 75,4%; 150k–250k: 20,0%).
                </p>
              </div>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={priceBands} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="band" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip />
                    <Bar dataKey="gmvSharePct" name="% GMV 90 ngày" radius={[6, 6, 0, 0]}>
                      {priceBands.map((b) => (
                        <Cell
                          key={b.band}
                          fill={b.band === '75k-150k' ? '#0D7287' : b.band === '150k-250k' ? '#9BE7FA' : '#CBD5E1'}
                        />
                      ))}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                      <th className="py-1.5 pr-2 font-semibold">Dải ASP</th>
                      <th className="py-1.5 px-2 font-semibold text-right">Có đơn / Tổng</th>
                      <th className="py-1.5 pl-2 font-semibold text-right">% GMV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {priceBands.map((b) => (
                      <tr key={b.band}>
                        <td className="py-1.5 pr-2 font-bold">{b.band}</td>
                        <td className="py-1.5 px-2 text-right">{b.activeSkus} / {b.skus}</td>
                        <td className="py-1.5 pl-2 text-right font-bold text-[#0D7287] dark:text-[#9BE7FA]">{b.gmvSharePct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Row 3: What-If Live >10h Break-Even Simulator + Looker/Tableau CSV Export Pack */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
                  <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                    Trang 3 · Mô phỏng Stop-Loss Ca Live &gt;10h (Nghịch lý Simpson T4–T8)
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                  Hòa vốn: {breakEvenGmvM.toFixed(2)} Tr/h
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-3 text-xs">
                <label className="space-y-1">
                  <span className="flex justify-between font-semibold">
                    <span>Chi phí Host + Studio / giờ:</span>
                    <strong className="text-[#074553] dark:text-[#9BE7FA]">{hourlyCostK}k đ/h</strong>
                  </span>
                  <input
                    type="range"
                    min={250}
                    max={900}
                    step={50}
                    value={hourlyCostK}
                    onChange={(e) => setHourlyCostK(Number(e.target.value))}
                    className="w-full accent-[#0D7287] cursor-pointer"
                  />
                </label>
                <label className="space-y-1">
                  <span className="flex justify-between font-semibold">
                    <span>Biên lợi nhuận gộp giả định:</span>
                    <strong className="text-[#074553] dark:text-[#9BE7FA]">{marginPct}%</strong>
                  </span>
                  <input
                    type="range"
                    min={15}
                    max={45}
                    step={5}
                    value={marginPct}
                    onChange={(e) => setMarginPct(Number(e.target.value))}
                    className="w-full accent-[#0D7287] cursor-pointer"
                  />
                </label>
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={OVER10_MONTHLY} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit=" Tr/h" />
                    <Tooltip />
                    <ReferenceLine
                      y={breakEvenGmvM}
                      stroke="#E11D48"
                      strokeDasharray="4 3"
                      strokeWidth={2}
                      label={{ value: `Hòa vốn ${breakEvenGmvM} Tr/h`, position: 'insideTopRight', fill: '#E11D48', fontSize: 11 }}
                    />
                    <Bar dataKey="gmvPerHourM" name="GMV thực / giờ (Tr đ)" radius={[6, 6, 0, 0]}>
                      {OVER10_MONTHLY.map((m) => (
                        <Cell key={m.month} fill={m.gmvPerHourM >= breakEvenGmvM ? '#059669' : '#E11D48'} />
                      ))}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 sm:p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                  Gói dữ liệu sạch kết nối Power BI / Looker Studio / Tableau
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Toàn bộ 4 bảng Star Schema đã làm sạch, chuẩn hóa hậu tố tiếng Việt và giả danh SHA-256. Tải trực tiếp để kiểm chứng hoặc nạp thẳng lên Power BI Desktop, Looker Studio hay Tableau Public.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {BI_CSV_PACK.map((item) => (
                    <a
                      key={item.name}
                      href={`/kami/bi-pack/${item.name}`}
                      download
                      className="min-h-[44px] flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-[#0D7287] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span className="truncate">{item.label}</span>
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#0D7287] dark:text-[#9BE7FA] shrink-0">
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>CSV</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <a
                href="/kami/kami_ely_analytics_workbook.xlsx"
                download
                className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] px-4 py-2.5 text-xs font-bold text-slate-950 border border-[#0D7287]/20 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#074553]" aria-hidden="true" />
                <span>Tải Workbook Excel 5 sheet (SUMIFS · INDEX/MATCH · Power Query)</span>
              </a>
            </div>
          </section>
        </main>
      ) : (
        <main className="flex-1 w-full h-[calc(100dvh-60px)] bg-white">
          <iframe
            src="/kami/kami-ely-bi-spec.html?embed=1"
            title="Kami Ely Power BI and Looker Studio Dashboard Specification"
            className="w-full h-full border-0"
          />
        </main>
      )}
    </div>
  );
}
