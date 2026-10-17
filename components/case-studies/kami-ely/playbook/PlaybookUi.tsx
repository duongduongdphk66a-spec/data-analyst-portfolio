'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, CheckCircle2, CircleDashed, Copy } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { type Bi } from './playbookData';
import { STAGE_META } from './stageMeta';

// ---------------------------------------------------------------------------
// Ngôn ngữ và định dạng số
// ---------------------------------------------------------------------------
export function usePlaybookLang() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const L = (vi: string, en: string): string => (isEn ? en : vi);
  const b = (x: Bi): string => (isEn ? x.en : x.vi);
  const n = (v: number, digits = 0): string =>
    v.toLocaleString(isEn ? 'en-US' : 'vi-VN', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return { isEn, L, b, n };
}

// Thuộc tính trục dùng chung cho mọi biểu đồ recharts
// Màu chữ đặt bằng class để đủ tương phản ở cả light và dark mode (CSS thắng thuộc tính fill mặc định của recharts)
export const TEXT_FILL_CLASS = 'fill-slate-600 dark:fill-slate-300';
export const axisTick = { fontSize: 11, className: TEXT_FILL_CLASS } as const;

// Chữ chú giải mặc định lấy màu của chuỗi (vàng, xanh nhạt) nên khó đọc; đặt lại màu chữ.
export const legendFormatter = (value: string): React.ReactNode => (
  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{value}</span>
);
export const GRID_STROKE = 'currentColor';

// ---------------------------------------------------------------------------
// Thẻ biểu đồ
// ---------------------------------------------------------------------------
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  /** Lớp chiều cao của vùng vẽ. Truyền chuỗi rỗng để vùng vẽ tự giãn theo nội dung. */
  height?: string;
}

export function ChartCard({ title, children, badge, className = '', height = 'h-64' }: ChartCardProps) {
  return (
    <div
      className={`min-w-0 p-4 sm:p-5 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm dark:bg-slate-900 dark:border-slate-800 ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-black text-slate-950 dark:text-white">{title}</h4>
        {badge}
      </div>
      <div className={`w-full text-slate-200 dark:text-slate-700 ${height}`}>{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KPI và chip
// ---------------------------------------------------------------------------
export function Kpi({ value, label, tone = 'cyan' }: { value: string; label: string; tone?: 'cyan' | 'amber' }) {
  const toneClass =
    tone === 'amber'
      ? 'bg-[#FFE485]/30 border-[#FFD14C]/60 dark:bg-[#FFD14C]/10'
      : 'bg-[#C8EEF7]/50 border-[#9BE7FA]/70 dark:bg-[#9BE7FA]/10';
  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tabular-nums">{value}</div>
      <div className="text-xs text-slate-600 dark:text-slate-300">{label}</div>
    </div>
  );
}

export function Chip({ children, tone = 'cyan' }: { children: React.ReactNode; tone?: 'cyan' | 'amber' | 'rose' }) {
  const toneClass =
    tone === 'amber'
      ? 'bg-[#FFE485]/50 text-amber-900 dark:bg-[#FFD14C]/20 dark:text-[#FFE485]'
      : tone === 'rose'
        ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
        : 'bg-[#C8EEF7]/60 text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${toneClass}`}>
      {children}
    </span>
  );
}

export function CoveragePill({ kind }: { kind: 'full' | 'partial' }) {
  const { L } = usePlaybookLang();
  return kind === 'full' ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8EEF7]/60 px-3 py-1.5 text-xs font-bold text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]">
      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      {L('Dữ liệu thật', 'Real data')}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE485]/50 px-3 py-1.5 text-xs font-bold text-amber-900 dark:bg-[#FFD14C]/20 dark:text-[#FFE485]">
      <CircleDashed className="h-4 w-4" aria-hidden="true" />
      {L('Một phần', 'Partial')}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Tooltip tuỳ biến, hỗ trợ dark mode
// ---------------------------------------------------------------------------
interface TipItem {
  name?: string | number;
  value?: number | string | null;
  color?: string;
  dataKey?: string | number;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: readonly TipItem[];
  label?: string | number;
  fmt?: (_value: number, _name: string) => string;
  head?: (_label: string) => string;
}

export function ChartTooltip({ active, payload, label, fmt, head }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const title = label === undefined ? '' : head ? head(String(label)) : String(label);
  return (
    <div className="rounded-xl border border-[#9BE7FA] bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-800">
      {title && <div className="mb-1 font-black text-slate-950 dark:text-white">{title}</div>}
      {payload.map((p, i) => {
        if (p.value === null || p.value === undefined) return null;
        const v = typeof p.value === 'number' ? p.value : Number(p.value);
        const name = String(p.name ?? p.dataKey ?? '');
        return (
          <div key={`${name}-${i}`} className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: p.color }} aria-hidden="true" />
            <span>{name}</span>
            <span className="ml-auto pl-3 font-bold tabular-nums">{fmt ? fmt(v, name) : String(p.value)}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Khối SQL thu gọn
// ---------------------------------------------------------------------------
export function SqlPeek({ code }: { code: string }) {
  const { L } = usePlaybookLang();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-11 cursor-pointer items-center gap-2 px-4 text-sm font-bold text-slate-800 transition-colors hover:text-[#0D7287] dark:text-slate-200 dark:hover:text-[#9BE7FA]"
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
          SQL
        </button>
        {open && (
          <button
            type="button"
            onClick={copy}
            aria-label={L('Sao chép SQL', 'Copy SQL')}
            className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-slate-500 transition-colors hover:text-[#0D7287] dark:text-slate-400 dark:hover:text-[#9BE7FA]"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
      </div>
      {open && (
        <pre className="overflow-x-auto bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Khung một giai đoạn
// ---------------------------------------------------------------------------
interface StageSectionProps {
  stage: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  takeaway: string;
  kpis?: { value: string; label: string; tone?: 'cyan' | 'amber' }[];
  sql: string;
  children: React.ReactNode;
}

export function StageSection({ stage, takeaway, kpis, sql, children }: StageSectionProps) {
  const { b } = usePlaybookLang();
  const meta = STAGE_META[stage - 1];
  return (
    <section id={meta.id} className="scroll-mt-28 space-y-4">
      <header className="flex flex-wrap items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#9BE7FA] text-lg font-black text-slate-950">
          {stage}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">{b(meta.title)}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{takeaway}</p>
        </div>
        <CoveragePill kind={meta.coverage} />
      </header>

      {meta.gap && (
        <p className="rounded-2xl bg-[#FFE485]/30 px-4 py-2 text-xs font-semibold text-amber-900 dark:bg-[#FFD14C]/10 dark:text-[#FFE485]">
          {b(meta.gap)}
        </p>
      )}

      {kpis && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {kpis.map((k) => (
            <Kpi key={k.label} value={k.value} label={k.label} tone={k.tone} />
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">{children}</div>

      <SqlPeek code={sql} />
    </section>
  );
}
