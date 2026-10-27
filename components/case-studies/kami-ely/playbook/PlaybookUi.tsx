'use client';

import React, { createContext, useContext, useState } from 'react';
import { Check, ChevronDown, Database, Clock, Copy, HelpCircle, CalendarDays } from 'lucide-react';
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

export const TEXT_FILL_CLASS = 'fill-slate-600 dark:fill-slate-300';
export const axisTick = { fontSize: 12, className: TEXT_FILL_CLASS } as const;

export const legendFormatter = (value: string): React.ReactNode => (
  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{value}</span>
);
export const GRID_STROKE = 'currentColor';

// ---------------------------------------------------------------------------
// Quản lý chế độ xem thời gian đồng bộ toàn trang & từng biểu đồ (Ngày / Tuần / Tháng / Tổng hợp)
// ---------------------------------------------------------------------------
export type GlobalGranularityPref = 'default' | 'day' | 'week';

interface GranularityContextValue {
  pref: GlobalGranularityPref;
  epoch: number;
  setGlobalPref: (_p: GlobalGranularityPref) => void;
}

const GranularityContext = createContext<GranularityContextValue>({
  pref: 'default',
  epoch: 0,
  setGlobalPref: () => {},
});

export function ChartGranularityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ pref: GlobalGranularityPref; epoch: number }>({
    pref: 'default',
    epoch: 0,
  });

  const setGlobalPref = (nextPref: GlobalGranularityPref) => {
    setState((prev) => ({ pref: nextPref, epoch: prev.epoch + 1 }));
  };

  return (
    <GranularityContext.Provider value={{ pref: state.pref, epoch: state.epoch, setGlobalPref }}>
      {children}
    </GranularityContext.Provider>
  );
}

export function useGlobalGranularity() {
  return useContext(GranularityContext);
}

export function useChartGranularity<T extends string>(
  defaultView: T,
  supported: readonly T[]
): [T, (_next: T) => void] {
  const { pref, epoch } = useContext(GranularityContext);

  const resolveFromGlobal = (p: GlobalGranularityPref): T => {
    if (p === 'day' && supported.includes('day' as T)) return 'day' as T;
    if (p === 'week' && supported.includes('week' as T)) return 'week' as T;
    return defaultView;
  };

  const [localState, setLocalState] = useState<{ epoch: number; view: T }>(() => ({
    epoch: -1,
    view: defaultView,
  }));

  const currentView = localState.epoch === epoch ? localState.view : resolveFromGlobal(pref);

  const setView = (next: T) => {
    setLocalState({ epoch, view: next });
  };

  return [currentView, setView];
}

export interface GranularityOption<T extends string> {
  id: T;
  label: string;
}

export function GranularityToggle<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (_next: T) => void;
  options: readonly GranularityOption<T>[];
  ariaLabel?: string;
}) {
  const { L } = usePlaybookLang();
  return (
    <div
      role="group"
      aria-label={ariaLabel || L('Chọn độ hạt thời gian biểu đồ', 'Select chart time granularity')}
      className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/90 p-1 dark:border-slate-800 dark:bg-slate-950/80"
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap tabular-nums cursor-pointer transition-colors duration-150 ${
              active
                ? 'bg-[#9BE7FA] text-slate-950'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function GlobalGranularityBar() {
  const { L } = usePlaybookLang();
  const { pref, setGlobalPref } = useGlobalGranularity();

  const items: { id: GlobalGranularityPref; labelVi: string; labelEn: string }[] = [
    {
      id: 'default',
      labelVi: 'Mặc định theo chương',
      labelEn: 'Chapter default',
    },
    {
      id: 'day',
      labelVi: 'Xem theo ngày (Tất cả biểu đồ)',
      labelEn: 'Daily view (All charts)',
    },
    {
      id: 'week',
      labelVi: 'Xem theo tuần',
      labelEn: 'Weekly view',
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#9BE7FA]/70 bg-[#C8EEF7]/25 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
        <CalendarDays className="h-4 w-4 shrink-0 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
        <div>
          <span className="font-extrabold text-slate-950 dark:text-white">
            {L('Chế độ độ hạt thời gian toàn trang:', 'Global chart granularity:')}
          </span>{' '}
          <span className="text-slate-600 dark:text-slate-400">
            {L(
              'Chuyển đồng loạt toàn bộ 8 biểu đồ sang chuỗi ngày chi tiết (231N / 179N) hoặc bật riêng trên từng biểu đồ.',
              'Switch all 8 charts to daily series (231d / 179d) simultaneously, or toggle each chart individually.'
            )}
          </span>
        </div>
      </div>

      <div
        role="group"
        aria-label={L('Bộ chuyển đổi chế độ xem biểu đồ toàn trang', 'Global chart view mode switcher')}
        className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950"
      >
        {items.map((item) => {
          const active = pref === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setGlobalPref(item.id)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors duration-150 ${
                active
                  ? 'bg-[#9BE7FA] text-slate-950'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-900'
              }`}
            >
              {L(item.labelVi, item.labelEn)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tooltip giải nghĩa thuật ngữ chuyên ngành (Accessible Hover + Focus)
// ---------------------------------------------------------------------------
export function TermTooltip({
  label,
  explain,
}: {
  label: string;
  explain: string;
}) {
  return (
    <span className="relative inline-flex items-center gap-0.5 group align-baseline">
      <button
        type="button"
        className="inline-flex items-center gap-1 font-bold text-[#074553] dark:text-[#9BE7FA] border-b border-dotted border-[#0D7287] dark:border-[#9BE7FA] cursor-help focus:outline-none"
        aria-label={`${label}: ${explain}`}
      >
        <span>{label}</span>
        <HelpCircle className="w-3 h-3 shrink-0 opacity-75" aria-hidden="true" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity duration-150 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 p-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-normal leading-relaxed border border-slate-700 shadow-lg z-50 text-left" /* taste-skill-ignore: floating glossary tooltip */
      >
        <strong className="block font-bold text-[#9BE7FA] mb-0.5">{label}</strong>
        {explain}
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Thẻ biểu đồ
// ---------------------------------------------------------------------------
interface ChartCardProps {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  height?: string;
}

export function ChartCard({ title, subtitle, children, badge, footer, className = '', height = 'h-64' }: ChartCardProps) {
  const chartHeightClass = height === '' ? 'w-full' : `w-full ${height}`;
  return (
    <div
      className={`min-w-0 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex flex-col ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white leading-snug text-balance">{title}</h4>
          {subtitle && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{subtitle}</div>}
        </div>
        {badge && <div className="shrink-0 max-w-full">{badge}</div>}
      </div>
      <div className={`${chartHeightClass} text-slate-200 dark:text-slate-700`}>{children}</div>
      {footer && <div className="mt-auto pt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{footer}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// KPI và chip
// ---------------------------------------------------------------------------
export function Kpi({
  value,
  label,
  sub,
  tone = 'cyan',
}: {
  value: string;
  label: React.ReactNode;
  sub?: React.ReactNode;
  tone?: 'cyan' | 'amber';
}) {
  const toneClass =
    tone === 'amber'
      ? 'bg-[#FFE485]/30 border-[#FFD14C]/60 dark:bg-[#FFD14C]/10'
      : 'bg-[#C8EEF7]/45 border-[#9BE7FA]/70 dark:bg-[#9BE7FA]/10';
  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tabular-nums">{value}</div>
      <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export function Chip({ children, tone = 'cyan' }: { children: React.ReactNode; tone?: 'cyan' | 'amber' | 'rose' | 'emerald' }) {
  const toneClass =
    tone === 'amber'
      ? 'bg-[#FFE485]/50 text-amber-950 dark:bg-[#FFD14C]/20 dark:text-[#FFE485]'
      : tone === 'rose'
        ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
        : tone === 'emerald'
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
          : 'bg-[#C8EEF7]/60 text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap tabular-nums ${toneClass}`}>
      {children}
    </span>
  );
}

export function CoveragePill({ kind, customLabel }: { kind: 'full' | 'partial'; customLabel?: string }) {
  const { L } = usePlaybookLang();
  return kind === 'full' ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8EEF7]/55 px-3 py-1 text-xs font-bold text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA]">
      <Database className="h-3.5 w-3.5" aria-hidden="true" />
      {customLabel || L('Ước tính FastMoss · 231 ngày', 'FastMoss estimate · 231d')}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE485]/50 px-3 py-1 text-xs font-bold text-amber-950 dark:bg-[#FFD14C]/20 dark:text-[#FFE485]">
      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
      {customLabel || L('Ước tính FastMoss · Cửa sổ 90 ngày', 'FastMoss estimate · 90d window')}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Tooltip biểu đồ tuỳ biến, hỗ trợ dark mode
// ---------------------------------------------------------------------------
interface TipItem {
  name?: string | number;
  value?: number | string | null;
  color?: string;
  dataKey?: string | number;
  payload?: any;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: readonly TipItem[];
  label?: string | number;
  fmt?: (_value: number, _name: string) => string;
  head?: (_label: string, _payload?: readonly TipItem[]) => string;
  extraRow?: (_payload?: readonly TipItem[]) => React.ReactNode;
}

export function ChartTooltip({ active, payload, label, fmt, head, extraRow }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const title = label === undefined ? '' : head ? head(String(label), payload) : String(label);
  const extra = extraRow ? extraRow(payload) : null;
  return (
    <div className="rounded-xl border border-[#9BE7FA] bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-800" /* taste-skill-ignore: floating tooltip */>
      {title && <div className="mb-1 font-black text-slate-950 dark:text-white">{title}</div>}
      {payload.map((p, i) => {
        if (p.value === null || p.value === undefined) return null;
        const v = typeof p.value === 'number' ? p.value : Number(p.value);
        const name = String(p.name ?? p.dataKey ?? '');
        return (
          <div key={`${name}-${i}`} className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: p.color }} aria-hidden="true" />
            <span>{name}</span>
            <span className="ml-auto pl-3 font-bold tabular-nums">{fmt ? fmt(v, name) : String(p.value)}</span>
          </div>
        );
      })}
      {extra && <div className="mt-1.5 pt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-300">{extra}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Khối SQL / Code thu gọn
// ---------------------------------------------------------------------------
export function SqlPeek({ code, label = 'SQL' }: { code: string; label?: string }) {
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
          className="flex min-h-[44px] cursor-pointer items-center gap-2 px-4 text-xs sm:text-sm font-bold text-slate-800 transition-colors hover:text-[#0D7287] dark:text-slate-200 dark:hover:text-[#9BE7FA]"
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
          {label}
        </button>
        {open && (
          <button
            type="button"
            onClick={copy}
            aria-label={L('Sao chép', 'Copy')}
            className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center text-slate-500 transition-colors hover:text-[#0D7287] dark:text-slate-400 dark:hover:text-[#9BE7FA]"
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
// Khung Chương gọn chuẩn Tầng 2: Câu hỏi -> Biểu đồ chính -> Vậy thì sao -> Khuyến nghị
// ---------------------------------------------------------------------------
export interface ChapterShellProps {
  id: string;
  chapterNum: string;
  title: string;
  question: React.ReactNode;
  scopeLabel?: string;
  scopeKind?: 'full' | 'partial';
  soWhat?: React.ReactNode;
  recommendation?: React.ReactNode;
  confidenceLabel?: string;
  confidenceTone?: 'cyan' | 'amber' | 'rose' | 'emerald';
  appendixLabel?: string;
  onJumpToAppendix?: () => void;
  children: React.ReactNode;
}

export function ChapterShell({
  id,
  chapterNum,
  title,
  question,
  scopeLabel,
  scopeKind = 'full',
  soWhat,
  recommendation,
  confidenceLabel,
  confidenceTone = 'amber',
  appendixLabel,
  onJumpToAppendix,
  children,
}: ChapterShellProps) {
  const { L } = usePlaybookLang();

  const handleAppendixJump = () => {
    if (onJumpToAppendix) {
      onJumpToAppendix();
      return;
    }
    const el = document.getElementById('sec-appendix');
    if (el) {
      el.dispatchEvent(new CustomEvent('kami-open-appendix'));
      const y = el.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id={id} className="scroll-mt-28 space-y-3">
      <header className="flex flex-wrap items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-[#9BE7FA] px-2.5 py-0.5 text-xs font-black text-slate-950 tabular-nums">
              {chapterNum}
            </span>
            <CoveragePill kind={scopeKind} customLabel={scopeLabel} />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 dark:text-white text-balance">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            <strong className="font-bold text-slate-800 dark:text-slate-100">{L('Câu hỏi:', 'Question:')}</strong>{' '}
            {question}
          </p>
        </div>
      </header>

      <div className="space-y-3">{children}</div>

      {(soWhat || recommendation) && (
        <div className="grid gap-2.5 lg:grid-cols-2">
          {soWhat && (
            <div className="rounded-2xl border border-[#9BE7FA]/60 bg-[#C8EEF7]/25 px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 flex flex-col gap-1.5">
              <div>
                <strong className="font-bold text-[#074553] dark:text-[#9BE7FA] mr-1.5">
                  {L('Vậy thì sao?', 'So what?')}
                </strong>
                {soWhat}
              </div>
              {appendixLabel && (
                <div className="pt-0.5 mt-auto">
                  <button
                    type="button"
                    onClick={handleAppendixJump}
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold text-[#0D7287] hover:underline dark:text-[#9BE7FA] cursor-pointer"
                  >
                    <span>{appendixLabel}</span>
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          )}
          {recommendation && (
            <div className="rounded-2xl border border-[#FFD14C]/70 bg-[#FFE485]/25 px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-[#FFD14C]/10 dark:text-slate-200 flex flex-col gap-1.5">
              <div>
                <strong className="font-bold text-amber-950 dark:text-[#FFE485] mr-1.5">
                  {L('Khuyến nghị:', 'Recommendation:')}
                </strong>
                {recommendation}
              </div>
              {confidenceLabel && (
                <div className="flex items-center justify-between gap-2 pt-0.5 mt-auto">
                  <Chip tone={confidenceTone}>{confidenceLabel}</Chip>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Backward-compatible exports if referenced
// ---------------------------------------------------------------------------
export interface UnifiedSectionProps {
  id?: string;
  badge: string | number;
  title: string;
  takeaway: string;
  coverage?: 'full' | 'partial';
  gapText?: string;
  kpis?: { value: string; label: string; sub?: string; tone?: 'cyan' | 'amber' }[];
  finding?: string;
  action?: string;
  codePeek?: { label?: string; code: string };
  children: React.ReactNode;
}

export function UnifiedSection({
  id = '',
  badge,
  title,
  takeaway,
  coverage = 'full',
  finding,
  action,
  children,
}: UnifiedSectionProps) {
  return (
    <ChapterShell
      id={id}
      chapterNum={String(badge)}
      title={title}
      question={takeaway}
      scopeKind={coverage}
      soWhat={finding}
      recommendation={action}
    >
      <div className="grid gap-4 lg:grid-cols-2">{children}</div>
    </ChapterShell>
  );
}

export function StageSection({
  stage,
  takeaway,
  children,
}: {
  stage: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  takeaway: string;
  kpis?: { value: string; label: string; sub?: string; tone?: 'cyan' | 'amber' }[];
  sql: string;
  children: React.ReactNode;
}) {
  const { b } = usePlaybookLang();
  const meta = STAGE_META[stage - 1];
  return (
    <UnifiedSection id={meta.id} badge={stage} title={b(meta.title)} takeaway={takeaway} coverage={meta.coverage}>
      {children}
    </UnifiedSection>
  );
}
