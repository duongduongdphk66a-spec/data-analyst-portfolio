'use client';

import React from 'react';
import { Code2, Database, FileSpreadsheet } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { TermTooltip } from './playbook/PlaybookUi';

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

  const kpiCards = [
    {
      id: 'kpi-gmv-231d',
      value: isEn ? '15.01B VND' : '15,01 tỷ đ',
      valueClass: 'text-slate-950 dark:text-white',
      title: isEn ? '231-day store GMV' : 'GMV 231 ngày (09/03 - 25/10/2026)',
      sub: isEn ? '101,896 units · Mean 65.0M VND/day' : '101.896 sản phẩm · Trung bình 65,0 Tr/ngày',
      tone: 'bg-[#C8EEF7]/40 border-[#9BE7FA]/60 dark:bg-slate-900/80 dark:border-slate-800',
    },
    {
      id: 'kpi-aug-drop',
      value: '-83,1%',
      valueClass: 'text-rose-600 dark:text-rose-400',
      title: isEn ? 'August GMV vs. June peak' : 'GMV T8 so với đỉnh T6',
      sub: isEn ? '0.64B vs. 3.77B VND (-3.14B contraction)' : '0,64 tỷ so với 3,77 tỷ đ (giảm 3,14 tỷ)',
      tone: 'bg-rose-50/50 border-rose-200/80 dark:bg-rose-950/20 dark:border-slate-800',
    },
    {
      id: 'kpi-sku-pareto',
      value: isEn ? '12 SKUs = 80.6% GMV' : '12 SKU = 80,6% GMV',
      valueClass: 'text-slate-950 dark:text-white',
      title: isEn ? (
        <>
          206 / 339 SKUs with zero 90d orders{' '}
          <TermTooltip
            label={isEn ? '(Scope)' : '(Đối chiếu)'}
            explain="Trên danh mục 339 SKU cập nhật đến tháng 10 (có thêm mã Thu Đông AT06), 12 SKU tạo 80,6% GMV và 206 SKU có 0 đơn (60,8%). Ở bản chụp kỳ Hè trước tháng 10 (331 SKU), con số tương ứng là 21 SKU tạo 80% GMV và 197 SKU 0 đơn."
          />
        </>
      ) : (
        <>
          206/339 SKU không ra đơn trong 90 ngày{' '}
          <TermTooltip
            label="(Đối chiếu)"
            explain="Trên bảng kệ hàng 339 SKU hợp nhất đến tháng 10 (sau khi lên mã AT06), 12 SKU tạo 80,6% GMV và 206 SKU (60,8%) ghi nhận 0 đơn. Ở bản chụp riêng kỳ Hè trước tháng 10 (331 SKU), con số tương ứng là 21 SKU = 80% GMV và 197 SKU không ra đơn."
          />
        </>
      ),
      sub: isEn ? 'Top 5 SKUs hold 68.5% of recent 90d GMV' : 'Top 5 SKU chiếm 68,5% GMV cửa sổ 90 ngày',
      tone: 'bg-[#FFE485]/35 border-[#FFD14C]/60 dark:bg-slate-900/80 dark:border-slate-800',
    },
    {
      id: 'kpi-koc-retention',
      value: '71,2% -> 27,8%',
      valueClass: 'text-rose-600 dark:text-rose-400',
      title: isEn ? 'Creators active after 1 month (M+1)' : 'Creator còn hoạt động sau 1 tháng (M+1)',
      sub: isEn ? 'Cohort T3 -> T8 (rebounded to 41.4% in T9)' : 'Cohort T3 -> T8 (hồi phục lên 41,4% ở lô T9)',
      tone: 'bg-slate-50/80 border-slate-200/90 dark:bg-slate-900/80 dark:border-slate-800',
    },
  ];

  return (
    <header className="relative w-full rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-950 transition-colors duration-200 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-xl bg-amber-50/90 border border-amber-200/80 px-3 py-1.5 text-xs font-semibold text-amber-950 dark:bg-amber-950/30 dark:border-amber-800/60 dark:text-amber-200">
          <Database className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <span>
            {isEn
              ? 'FastMoss market-intelligence estimates (passed 9 quality gates; no order ID, COGS, or ad spend). Observational data: text uses "associated with", not causal claims.'
              : 'Dữ liệu ước tính từ FastMoss, đã qua 9 cổng kiểm tra chất lượng; không có order ID, COGS hay chi phí quảng cáo. Toàn bộ là dữ liệu quan sát nên văn bản dùng "gắn với", không dùng "do".'}
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
              <span>{isEn ? 'Python Notebook' : 'Sổ tay Python'}</span>
            </button>
          )}
          {onJumpToSection && (
            <button
              type="button"
              onClick={() => onJumpToSection('sec-appendix')}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-bold text-slate-800 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
              <span>{isEn ? 'Appendix (A · B · C)' : 'Phụ lục (A · B · C)'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 max-w-4xl">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight text-balance">
          {isEn
            ? 'Kami Ely on TikTok Shop: Where does revenue come from, and when does momentum fade?'
            : 'Kami Ely trên TikTok Shop: doanh thu đến từ đâu và khi nào bắt đầu mất đà?'}
        </h1>

        <p className="text-sm sm:text-base font-semibold text-[#074553] dark:text-[#9BE7FA]">
          {isEn
            ? '231-day SQL & Python analysis (09/03 - 25/10/2026) across 9 core tables + 1 SKU panel: 15.01B VND GMV, 101,896 units.'
            : 'Phân tích SQL 231 ngày (09/03 - 25/10/2026) trên 9 bảng chính và 1 bảng phụ trợ SKU: 15,01 tỷ đ GMV, 101.896 sản phẩm.'}
        </p>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          <strong className="font-bold text-slate-900 dark:text-white">
            {isEn ? 'Core question:' : 'Câu hỏi trọng tâm:'}
          </strong>{' '}
          {isEn
            ? 'What does store revenue depend on, and is there a monitoring signal before peak season ends?'
            : 'Doanh thu của shop phụ thuộc vào đâu, và có tín hiệu nào cảnh báo trước khi mùa cao điểm kết thúc?'}
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
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
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
