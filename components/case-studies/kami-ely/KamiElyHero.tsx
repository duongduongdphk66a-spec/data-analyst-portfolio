'use client';

import React from 'react';
import Link from 'next/link';
import { Code2, Database, FileSpreadsheet, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { V2 } from './commercial/kamiOutlineV2Metrics';

export interface KamiElyHeroProps {
  onOpenProofModal?: (_screenshotId?: string) => void;
  onOpenNotebook?: () => void;
  onJumpToSection?: (_sectionId: string) => void;
  isEn?: boolean;
}

export default function KamiElyHero({
  onOpenNotebook,
  onJumpToSection,
  isEn: propIsEn,
}: KamiElyHeroProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const k = V2.ch0.kpis;
  const meta = V2.meta;

  const fmtInt = (v: number) => v.toLocaleString(isEn ? 'en-US' : 'vi-VN');
  const fmtDec = (v: number, d = 2) =>
    v.toLocaleString(isEn ? 'en-US' : 'vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });

  const kpiCards = [
    {
      id: 'kpi-gmv-231d',
      value: isEn ? `${fmtDec(k.gmvB, 2)}B VND` : `${fmtDec(k.gmvB, 2)} tỷ đ`,
      valueClass: 'text-slate-950 dark:text-white',
      title: isEn ? `Total GMV (${meta.days} days)` : `Tổng GMV ${meta.days} ngày`,
      sub: isEn
        ? `${fmtInt(k.unitsSold)} units · ~${fmtDec(k.dailyMeanM, 0)}M VND/day`
        : `${fmtInt(k.unitsSold)} sản phẩm · khoảng ${fmtDec(k.dailyMeanM, 0)} Tr/ngày`,
      tone: 'bg-[#9BE7FA]/30 border-[#9BE7FA] dark:bg-slate-900/90 dark:border-[#9BE7FA]/40',
    },
    {
      id: 'kpi-units-231d',
      value: isEn ? `${fmtDec(k.peakDayGmvM, 1)}M VND` : `${fmtDec(k.peakDayGmvM, 1)} Tr đ`,
      valueClass: 'text-slate-950 dark:text-white',
      title: isEn ? 'Single-day peak (16/06/2026)' : 'Đỉnh doanh thu ngày (16/06/2026)',
      sub: isEn
        ? `Peak day during the mid-year campaign`
        : `Doanh thu ngày cao nhất chiến dịch hè`,
      tone: 'bg-[#C8EEF7]/45 border-[#C8EEF7] dark:bg-slate-900/90 dark:border-slate-800',
    },
    {
      id: 'kpi-asp',
      value: isEn ? `${fmtInt(k.aspVnd)} VND` : `${fmtInt(k.aspVnd)} đ`,
      valueClass: 'text-slate-950 dark:text-white',
      title: isEn ? 'Average selling price (ASP)' : 'Giá bán trung bình mỗi sản phẩm (ASP)',
      sub: isEn
        ? 'Total GMV / units sold (no order_id for AOV)'
        : 'Tổng doanh thu / sản lượng (không có mã đơn để tính AOV)',
      tone: 'bg-[#FFE485]/45 border-[#FFD14C] dark:bg-slate-900/90 dark:border-[#FFD14C]/40',
    },
    {
      id: 'kpi-jun-aug-drop',
      value: `${fmtDec(k.junToAugDropPct, 1)}%`,
      valueClass: 'text-rose-600 dark:text-rose-400',
      title: isEn ? 'Seasonal contraction (Jun → Aug)' : 'Biên độ sụt giảm mùa vụ (T6 → T8)',
      sub: isEn
        ? `${fmtDec(k.junGmvB, 2)}B → ${fmtDec(k.augGmvB, 2)}B VND monthly sum`
        : `Từ ${fmtDec(k.junGmvB, 2)} tỷ xuống ${fmtDec(k.augGmvB, 2)} tỷ đ`,
      tone: 'bg-[#FFD14C]/25 border-[#FFD14C] dark:bg-slate-900/90 dark:border-rose-900/50',
    },
  ];

  return (
    <header className="relative w-full rounded-3xl border border-[#C8EEF7] bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-950 transition-colors duration-200 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-xl bg-[#FFE485]/45 border border-[#FFD14C] px-3 py-1.5 text-xs font-semibold text-amber-950 dark:bg-[#FFD14C]/15 dark:border-[#FFD14C]/40 dark:text-[#FFE485]">
          <Database className="w-3.5 h-3.5 shrink-0 text-amber-700 dark:text-[#FFD14C]" aria-hidden="true" />
          <span className="tabular-nums">
            {isEn
              ? `Personal SQL portfolio analysis on ${meta.totalFiles} FastMoss Excel exports (${fmtInt(meta.totalRawRows)} rows, 09/03 - 25/10/2026); uses third-party estimates without internal shop records.`
              : `Dự án cá nhân phân tích bằng SQL trên ${meta.totalFiles} tệp Excel ước tính từ FastMoss (${fmtInt(meta.totalRawRows)} dòng, 09/03 - 25/10/2026); không dùng số liệu nội bộ của shop.`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenNotebook && (
            <button
              type="button"
              onClick={onOpenNotebook}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] px-3.5 py-2 text-xs font-bold text-slate-950 border border-[#0D7287]/20 transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-[#074553]" aria-hidden="true" />
              <span>{isEn ? 'Python & SQL Notebook' : 'Sổ tay Python & SQL'}</span>
            </button>
          )}
          <Link
            href="/projects/kami-ely/bi-spec"
            className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#FFE485]/60 hover:bg-[#FFE485] px-3.5 py-2 text-xs font-bold text-amber-950 border border-[#FFD14C] dark:bg-[#FFD14C]/15 dark:hover:bg-[#FFD14C]/25 dark:text-[#FFE485] dark:border-[#FFD14C]/40 transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-800 dark:text-[#FFD14C]" aria-hidden="true" />
            <span>{isEn ? 'BI Dashboard & Spec' : 'BI Dashboard & Đặc tả'}</span>
          </Link>
          <a
            href="/kami/kami_ely_analytics_workbook.xlsx"
            download
            className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 text-xs font-bold text-emerald-800 border border-emerald-500/35 dark:text-emerald-300 dark:border-emerald-500/40 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            <span>{isEn ? 'Excel Model (.xlsx)' : 'File Excel công thức (.xlsx)'}</span>
          </a>
          {onJumpToSection && (
            <button
              type="button"
              onClick={() => onJumpToSection('sec-appendix')}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#C8EEF7]/45 hover:bg-[#C8EEF7] px-3.5 py-2 text-xs font-bold text-[#074553] border border-[#9BE7FA]/60 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
              <span>{isEn ? 'Appendix (A · B · C)' : 'Phụ lục (A · B · C)'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 max-w-4xl">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight text-balance">
          {isEn
            ? 'Kami Ely (@shop_official): Where does revenue come from, and why did August drop 83.1%?'
            : 'Kami Ely (@shop_official): Doanh thu đến từ đâu và vì sao Tháng 8 rơi 83,1%?'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {isEn
            ? 'Independent SQL and Python audit across 231 days (10 FastMoss exports) decomposing channel reliance, seasonal SKU transition, and KOC conversion.'
            : 'Kiểm toán độc lập bằng SQL và Python trên 231 ngày vận hành (10 bảng FastMoss) nhằm bóc tách cơ cấu kênh bán, vùng trũng giao mùa và hiệu suất mạng lưới KOC.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {kpiCards.map((card) => (
          <div
            key={card.id}
            className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col space-y-1 ${card.tone}`}
          >
            <div className={`text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight ${card.valueClass}`}>
              {card.value}
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {card.title}
            </div>
            <div className="text-xs tabular-nums text-slate-600 dark:text-slate-400 leading-snug">
              {card.sub}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}
