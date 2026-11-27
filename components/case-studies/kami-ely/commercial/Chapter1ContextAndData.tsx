'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { V2 } from './kamiOutlineV2Metrics';

interface Props {
  lang: 'vi' | 'en';
}

export function Chapter1ContextAndData({ lang }: Props) {
  const isVi = lang === 'vi';
  const [showFullMatrix, setShowFullMatrix] = useState(false);

  const dc = V2.ch1.doubleCountTrap;

  const doubleCountChartData = [
    {
      name: isVi ? '1. Cộng gộp thô (Sai: 120%)' : '1. Naive Sum (Wrong: 120%)',
      gmvB: dc.naiveSumB,
      pctOfStore: Math.round((dc.naiveSumB / dc.storeGmvB) * 1000) / 10,
      fill: '#E11D48',
    },
    {
      name: isVi ? '2. GMV Toàn shop (231 ngày)' : '2. Store Benchmark (231d)',
      gmvB: dc.storeGmvB,
      pctOfStore: 100.0,
      fill: '#9BE7FA',
    },
    {
      name: isVi ? '3. Live khử trùng (69,8%)' : '3. Deduplicated Live (69.8%)',
      gmvB: dc.dedupLiveB,
      pctOfStore: dc.dedupShareOfStorePct,
      fill: '#059669',
    },
  ];

  // Biểu đồ 2: So sánh cơ cấu Nội bộ vs KOC ngoài trong từng kênh (không trừ chéo Gross/Net và khung thời gian khác nhau)
  const tierComparisonData = [
    {
      channel: isVi ? 'Livestream (10,47 tỷ · 226d Gross)' : 'Livestream (10.47B · 226d Gross)',
      totalB: 10.47,
      officialPct: 72.5,
      officialB: 7.59,
      satellitePct: 12.0,
      satelliteB: 1.26,
      externalPct: 15.5,
      externalB: 1.62,
    },
    {
      channel: isVi ? 'Video ngắn (2,20 tỷ · 90d Gross)' : 'Short Video (2.20B · 90d Gross)',
      totalB: 2.2,
      officialPct: 36.5,
      officialB: 0.8,
      satellitePct: 5.1,
      satelliteB: 0.11,
      externalPct: 58.4,
      externalB: 1.28,
    },
  ];

  return (
    <section id="sec-context" className="scroll-mt-28 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {isVi
            ? 'Đối soát 10 bảng & Cấu trúc kênh (Gross phiên vs. Net cửa hàng)'
            : '10-Table Reconciliation & Channel Mix (Gross vs. Net)'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {isVi
            ? 'Tách riêng cơ cấu nội bộ trong từng bảng theo đúng khung thời gian (Toàn shop 231d Net, Live 226d Gross, Video 90d Gross) thay vì trừ chéo ra phần dư giả.'
            : 'Audits channel mix within each table’s native grain and window (231d Net Store, 226d Gross Live, rolling 90d Video) without invalid cross-window subtraction.'}
        </p>
      </div>

      {/* Biểu đồ 2: Cơ cấu Nội bộ vs KOC ngoài theo từng kênh + Hộp đối soát Gross vs Net */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 md:p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-md bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 px-2.5 py-0.5 text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA] mb-1.5">
              {isVi
                ? 'Biểu đồ 2 · Đối chiếu cơ cấu Nội bộ vs. KOC ngoài trong từng kênh (đúng độ hạt & khung thời gian)'
                : 'Chart 2 · In-House vs. External KOC Split Within Each Channel (Window- & Grain-Consistent)'}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {isVi
                ? 'Đảo chiều vai trò kênh: Live do Nội bộ dẫn dắt (84,5%) · Video do KOC ngoài dẫn dắt (58,4%)'
                : 'Channel Role Reversal: In-House Leads Live (84.5%) · External KOCs Lead Video (58.4%)'}
            </h3>
          </div>
          <span className="rounded-xl bg-[#FFE485]/45 dark:bg-[#FFD14C]/15 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-[#FFE485] tabular-nums">
            {isVi
              ? 'Toàn shop Net: 15,01 tỷ (231d) · 14,84 tỷ (226d)'
              : 'Store Net: 15.01B (231d) · 14.84B (226d)'}
          </span>
        </div>

        {/* 3-Column Channel Structure + Gross-vs-Net Reconciliation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch tabular-nums">
          {/* Col 1: Store Net Benchmark & Reconciliation Guard */}
          <div className="lg:col-span-4 rounded-xl border border-amber-500/35 bg-[#FFE485]/20 dark:bg-slate-950/80 p-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-800 dark:text-[#FFE485]">
                {isVi ? 'Nguyên tắc đối soát · Không trừ chéo Gross/Net' : 'Reconciliation Guard · No Cross-Window Subtraction'}
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {isVi ? '14,84 tỷ (226d Net)' : '14.84B (226d Net)'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                {isVi
                  ? 'Riêng T6, Live Gross đạt 4,92 tỷ vs. Toàn shop Net 3,77 tỷ (+30,5%), nên không trừ chéo 3 bảng khác cửa sổ để suy ra Shop Tab.'
                  : 'June Gross Live hit 4.92B vs. 3.77B Store Net (+30.5%), so subtracting across mismatched windows is invalid.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>{isVi ? 'Store Overview (231d):' : 'Store Overview (231d):'}</span>
                <strong>15,01 tỷ (Net)</strong>
              </div>
              <div className="flex justify-between">
                <span>{isVi ? 'AffLive khử trùng (226d):' : 'Deduped AffLive (226d):'}</span>
                <strong>10,47 tỷ (Gross)</strong>
              </div>
              <div className="flex justify-between">
                <span>{isVi ? 'AffVid khử trùng (90d):' : 'Deduped AffVid (90d):'}</span>
                <strong>2,20 tỷ (Rolling 90d)</strong>
              </div>
            </div>
          </div>

          {/* Col 2 & Col 3: Within-Channel Breakdowns */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Branch 1: Livestream (226d Gross = 10.47B) */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {isVi ? 'Kênh A · Livestream (226 ngày)' : 'Channel A · Livestream (226d)'}
                  </span>
                  <span className="rounded-md bg-[#9BE7FA]/40 dark:bg-[#9BE7FA]/20 px-2 py-0.5 text-xs font-bold text-slate-900 dark:text-[#9BE7FA]">
                    {isVi ? 'Gross phiên' : 'Session Gross'}
                  </span>
                </div>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {isVi ? '10,47 tỷ VNĐ' : '10.47B VND'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isVi ? '8.355 phiên (đã khử trùng 600 ca CrLive)' : '8,355 sessions (CrLive overlap removed)'}
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {isVi ? 'Nội bộ thống trị 84,5% (8,85 tỷ):' : 'In-House Dominates 84.5% (8.85B):'}
                </p>
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span>{isVi ? 'Kênh chính chủ (@shop_official)' : 'Official Channel (@shop_official)'}</span>
                      <strong className="text-[#0D7287] dark:text-[#9BE7FA]">72,5% (7,59 tỷ)</strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-0.5">
                      <div className="h-full bg-[#0D7287]" style={{ width: '72.5%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span>{isVi ? 'Kênh vệ tinh (@koc_sat01)' : 'Satellite Channel (@koc_sat01)'}</span>
                      <strong className="text-amber-600 dark:text-amber-400">12,0% (1,26 tỷ)</strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-0.5">
                      <div className="h-full bg-[#FFD14C]" style={{ width: '12%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span>{isVi ? 'KOC bên ngoài (301 kênh)' : 'External KOCs (301)'}</span>
                      <strong className="text-slate-600 dark:text-slate-400">15,5% (1,62 tỷ)</strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-0.5">
                      <div className="h-full bg-slate-400" style={{ width: '15.5%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Branch 2: Short Video (Rolling 90d = 2.20B) */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {isVi ? 'Kênh B · Video ngắn (90 ngày cuốn chiếu)' : 'Channel B · Short Video (Rolling 90d)'}
                  </span>
                  <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    {isVi ? 'Rolling 90d' : 'Rolling 90d'}
                  </span>
                </div>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {isVi ? '2,20 tỷ VNĐ' : '2.20B VND'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isVi ? '4.796 clip sau khử trùng (từ 4.797 dòng thô)' : '4,796 deduped clips (from 4,797 raw rows)'}
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-500/20 space-y-2 text-xs">
                <p className="font-bold text-emerald-800 dark:text-emerald-300">
                  {isVi ? 'Đảo chiều — KOC ngoài tạo 58,4% (1,28 tỷ):' : 'Reversed — External KOCs Drive 58.4% (1.28B):'}
                </p>
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span>{isVi ? 'KOC bên ngoài' : 'External KOCs'}</span>
                      <strong className="text-emerald-700 dark:text-emerald-400">58,4% (1,28 tỷ)</strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-0.5">
                      <div className="h-full bg-emerald-500" style={{ width: '58.4%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span>{isVi ? 'Kênh chính chủ (@shop_official)' : 'Official Channel (@shop_official)'}</span>
                      <strong className="text-[#0D7287] dark:text-[#9BE7FA]">36,5% (0,80 tỷ)</strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-0.5">
                      <div className="h-full bg-[#0D7287]" style={{ width: '36.5%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span>{isVi ? 'Kênh vệ tinh (@koc_sat01)' : 'Satellite Channel (@koc_sat01)'}</span>
                      <strong className="text-amber-600 dark:text-amber-400">5,1% (0,11 tỷ)</strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-0.5">
                      <div className="h-full bg-[#FFD14C]" style={{ width: '5.1%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 100% Stacked Horizontal Comparison Bar: Live vs Short Video Internal/External Mix */}
        <div className="h-[155px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tierComparisonData}
              layout="vertical"
              margin={{ top: 4, right: 20, left: 10, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="channel"
                width={185}
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3 text-xs tabular-nums space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">{d.channel}</p>
                      <p>
                        @shop_official: <strong>{d.officialPct}% ({d.officialB} {isVi ? 'tỷ' : 'B'})</strong>
                      </p>
                      <p>
                        @koc_sat01: <strong>{d.satellitePct}% ({d.satelliteB} {isVi ? 'tỷ' : 'B'})</strong>
                      </p>
                      <p>
                        {isVi ? 'KOC bên ngoài: ' : 'External KOCs: '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          {d.externalPct}% ({d.externalB} {isVi ? 'tỷ' : 'B'})
                        </strong>
                      </p>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="officialPct"
                stackId="mix"
                name="@shop_official"
                fill="#0D7287"
                barSize={24}
              />
              <Bar
                dataKey="satellitePct"
                stackId="mix"
                name="@koc_sat01"
                fill="#FFD14C"
                barSize={24}
              />
              <Bar
                dataKey="externalPct"
                stackId="mix"
                name={isVi ? 'KOC bên ngoài' : 'External KOCs'}
                fill="#10B981"
                radius={[0, 6, 6, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accordion gom gọn: 4 bẫy dữ liệu + Ma trận 10 bảng (đóng mặc định để giữ trang thoáng) */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-[#C8EEF7]/10 dark:bg-slate-900/60 p-4">
        <button
          type="button"
          onClick={() => setShowFullMatrix((v) => !v)}
          className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-left hover:border-[#0D7287] flex items-center justify-between gap-3 transition-colors cursor-pointer"
        >
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <ShieldCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5 sm:mt-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {showFullMatrix
                  ? isVi
                    ? 'Thu gọn 4 bẫy dữ liệu đã xử lý & Ma trận đối soát 10 bảng (23.364 dòng)'
                    : 'Collapse 4 Resolved Data Traps & 10-Table Reconciliation Matrix (23,364 rows)'
                  : isVi
                  ? 'Kiểm toán làm sạch dữ liệu: 4 bẫy thực tế & Ma trận 10 bảng (23.364 dòng)'
                  : 'Data Cleaning Audit: 4 Real Data Traps & 10-Table Matrix (23,364 rows)'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums truncate">
                {isVi
                  ? 'Bẫy trừ lũy kế (-310 sp) · Đổi nhãn mùa AQ1 · Gộp YES/có & bí danh KOC · Tránh cộng trùng Live 120,3%'
                  : 'Cumulative trap (-310 units) · Reclassified AQ1 · Bilingual YES/có merge · Live 120.3% dedup'}
              </p>
            </div>
          </div>
          {showFullMatrix ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
        </button>

        {showFullMatrix && (
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300 tabular-nums">
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3.5">
                <p className="font-bold text-slate-900 dark:text-white mb-1">
                  {isVi ? '1. Bẫy trừ lũy kế thiếu 310 sp ngày đầu' : '1. Cumulative Subtraction Day-1 Trap (-310 units)'}
                </p>
                <p>
                  {isVi
                    ? 'Cộng trực tiếp cột bán ngày (231 ngày) ra đúng 101.896 sp; trừ cột lũy kế ngày cuối cho ngày đầu sẽ hụt 310 sp bán ngày 09/03.'
                    : 'Summing daily units across 231 rows yields 101,896 units; subtracting cumulative endpoints omits 310 units sold on day 1 (Mar 09).'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3.5">
                <p className="font-bold text-slate-900 dark:text-white mb-1">
                  {isVi ? '2. Sửa nhãn mùa mã AQ1 (Đông → Đồ bơi Hè)' : '2. Reclassified SKU AQ1 (Winter → Summer Swimwear)'}
                </p>
                <p>
                  {isVi
                    ? 'Đối chiếu Shop_Products cho thấy AQ1 là "Set Đồ Bơi Kín Đáo" (đạt đỉnh T7 = 16,94M), nên đã chuyển về nhóm 6 mã Đồ bơi Hè.'
                    : 'Cross-checking Shop_Products confirmed AQ1 is a modest swimwear set (peaking in July at 16.94M), moving it to the 6 Summer SKUs.'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3.5">
                <p className="font-bold text-slate-900 dark:text-white mb-1">
                  {isVi ? '3. Gộp nhãn song ngữ, bí danh KOC & trùng mã H30' : '3. Bilingual Flags, KOC Aliases & Duplicate H30'}
                </p>
                <p>
                  {isVi
                    ? 'Gộp YES/có và NO/không; GROUP BY theo KOC ID ẩn danh vì @koc_sat01 xuất hiện dưới 2 tên hiển thị; tách rõ 2 link trùng mã H30 (38,3M & 32,7M).'
                    : 'Merged YES/có & NO/không flags; grouped by pseudonymized KOC ID since @koc_sat01 had 2 aliases; tracked 2 separate H30 product links (38.3M & 32.7M).'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3.5">
                <p className="font-bold text-slate-900 dark:text-white mb-1.5">
                  {isVi ? '4. Đối soát khung thời gian 4 nhóm bảng' : '4. Time-Window Reconciliation Across 4 Table Groups'}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px] tabular-nums">
                    <tbody className="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/60">
                      <tr>
                        <td className="py-1 pr-2 font-semibold">Store_Daily (231d)</td>
                        <td className="py-1 px-2">25/10/2026</td>
                        <td className="py-1 pl-2">{isVi ? '15,01 tỷ (20/10 = 14,84 tỷ)' : '15.01B (Oct 20 = 14.84B)'}</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-2 font-semibold">AffLive &amp; AffVid</td>
                        <td className="py-1 px-2">20/10/2026</td>
                        <td className="py-1 pl-2">{isVi ? 'Live 10,47 tỷ · Video 2,20 tỷ' : 'Live 10.47B · Video 2.20B'}</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-2 font-semibold">Creator_Live (600)</td>
                        <td className="py-1 px-2">20/10/2026</td>
                        <td className="py-1 pl-2">{isVi ? '7,59 tỷ · Tập con @shop_official' : '7.59B · Official subset'}</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-2 font-semibold">KOL &amp; Products</td>
                        <td className="py-1 px-2">Rolling 90d</td>
                        <td className="py-1 pl-2">{isVi ? '2,92 tỷ & 3,16 tỷ' : '2.92B & 3.16B'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Double-Counting Proof Chart */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 p-4">
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                {isVi
                  ? 'Kiểm chứng bẫy cộng trùng (Double-Counting): Affiliate_Livestreams (10,47 tỷ) + Creator_Livestreams (7,59 tỷ) = 18,06 tỷ (120,3% toàn shop)'
                  : 'Double-Counting Audit: Affiliate_Livestreams (10.47B) + Creator_Livestreams (7.59B) = 18.06B (120.3% of Store)'}
              </p>
              <div className="h-[170px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={doubleCountChartData}
                    layout="vertical"
                    margin={{ top: 6, right: 28, left: 10, bottom: 6 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 20]}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickFormatter={(v) => `${v}B`}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={210}
                      tick={{ fontSize: 11, fill: '#475569' }}
                      tickLine={false}
                    />
                    <ReferenceLine x={15.01} stroke="#0D7287" strokeDasharray="4 4" />
                    <Bar dataKey="gmvB" radius={[0, 6, 6, 0]} maxBarSize={26}>
                      {doubleCountChartData.map((entry, index) => (
                        <Cell key={`dc-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 10-Table Schema Matrix */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 p-4">
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-2 pr-3 font-semibold">#</th>
                    <th className="py-2 px-3 font-semibold">{isVi ? 'Viết tắt' : 'Abbr'}</th>
                    <th className="py-2 px-3 font-semibold">{isVi ? 'Tên bảng nguồn (Excel)' : 'Source Table'}</th>
                    <th className="py-2 px-3 font-semibold text-right">{isVi ? 'Số dòng' : 'Rows'}</th>
                    <th className="py-2 px-3 font-semibold text-right">{isVi ? 'Số cột' : 'Cols'}</th>
                    <th className="py-2 pl-3 font-semibold">{isVi ? 'Khung thời gian & Cơ chế' : 'Time Window & Mechanism'}</th>
                  </tr>
                </thead>
                <tbody>
                  {V2.ch1.files.map((f, idx) => (
                    <tr key={f.abbr} className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="py-2 pr-3 font-semibold text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-[#0D7287] dark:text-[#9BE7FA]">{f.abbr}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-800 dark:text-slate-200">{f.file}</td>
                      <td className="py-2 px-3 text-right font-semibold text-slate-900 dark:text-white">
                        {f.rows.toLocaleString(isVi ? 'vi-VN' : 'en-US')}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-300">{f.cols}</td>
                      <td className="py-2 pl-3 text-slate-600 dark:text-slate-300">
                        {f.start} → {f.end} ({f.mode})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
