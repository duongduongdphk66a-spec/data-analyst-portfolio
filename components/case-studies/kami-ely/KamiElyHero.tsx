'use client';

import React from 'react';
import { Code2, Database, FileSpreadsheet } from 'lucide-react';
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
          {onJumpToSection && (
            <button
              type="button"
              onClick={() => onJumpToSection('sec-appendix')}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#C8EEF7]/45 hover:bg-[#C8EEF7] px-3.5 py-2 text-xs font-bold text-[#074553] border border-[#9BE7FA]/60 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
              <span>{isEn ? 'Appendix (A · B · C)' : 'Phụ lục (A · B · C)'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2.5 max-w-4xl">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight text-balance">
          {isEn
            ? 'Kami Ely (@shop_official): Where does revenue come from, and which signals precede a peak-season drop?'
            : 'Kami Ely (@shop_official): doanh thu đến từ đâu, và tín hiệu nào báo trước khi mùa cao điểm gãy?'}
        </h1>

        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl tabular-nums">
          <li>
            <strong className="font-bold text-slate-950 dark:text-white">
              {isEn ? 'Where does revenue come from?' : 'Doanh thu đến từ đâu?'}
            </strong>{' '}
            {isEn
              ? 'Live accounts for 69.8% of shop GMV, with official shop streams generating 72.5%; 12/133 SKUs drive 80.6% of GMV.'
              : 'Live chiếm 69,8% GMV shop, trong đó phiên của chính shop chiếm 72,5%; 12/133 mã tạo 80,6% GMV.'}
          </li>
          <li>
            <strong className="font-bold text-slate-950 dark:text-white">
              {isEn ? 'What does it depend on?' : 'Phụ thuộc vào đâu?'}
            </strong>{' '}
            {isEn
              ? 'Seasonality and official Live scheduling: monthly GMV quadrupled from Mar to Jun then fell 83.1% to Aug.'
              : 'Mùa vụ và lịch live của chính shop: GMV tăng gấp bốn từ T3 lên T6 rồi giảm 83,1% đến T8.'}
          </li>
          <li>
            <strong className="font-bold text-slate-950 dark:text-white">
              {isEn ? 'Risk signals?' : 'Tín hiệu rủi ro?'}
            </strong>{' '}
            {isEn
              ? 'With single-season data, no signal is both early and reliable; MA7/MA28 crossovers lag and produce false alarms.'
              : 'Với dữ liệu một mùa, chưa có tín hiệu nào vừa sớm vừa đúng; MA7/MA28 báo trễ và hay báo giả.'}
          </li>
        </ul>
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
