'use client';

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { KpiItem } from '@/app/types';

export interface MetricCardItem {
  id?: string;
  label?: string | { vi: string; en: string };
  title?: string;
  value: string | number;
  subtext?: string | { vi: string; en: string };
  change?: string;
  trend?: string;
  projectBadge?: { vi: string; en: string };
}

export interface DashboardMetricCardsProps {
  metrics?: MetricCardItem[];
  kpis?: (MetricCardItem | KpiItem)[];
}

const DEFAULT_CONTEXTUAL_METRICS: MetricCardItem[] = [
  {
    id: 'metric-kami-gmv',
    label: { vi: 'Doanh Thu Kiểm Toán (180 Ngày)', en: 'Audited GMV (180-Day Cycle)' },
    value: '12,74 Tỉ VNĐ',
    subtext: {
      vi: '85.500 SP • Lũy kế All-Time: 31,6 Tỉ đ (238,4k SP)',
      en: '85,500 units • All-Time: 31.6B VND (238.4k units)'
    },
    trend: '+56,24% (28d đầu)',
    projectBadge: { vi: 'Dự án TikTok Shop Kami Ely', en: 'Kami Ely TikTok Shop Case Study' }
  },
  {
    id: 'metric-kami-records',
    label: { vi: 'Quy Mô Dữ Liệu Thực Chiến', en: 'Empirical Dataset Scale' },
    value: '18.778 Dòng',
    subtext: {
      vi: '8 bảng CSV/MySQL • 7.046 LIVE • 4.417 Videos • 5.713 KOCs',
      en: '8 SQL tables • 7,046 LIVEs • 4,417 Videos • 5,713 KOCs'
    },
    trend: '100% Ground Truth',
    projectBadge: { vi: 'Kho Dữ Liệu E-Commerce & SQL Lab', en: 'E-Commerce Warehouse & SQL Lab' }
  },
  {
    id: 'metric-query-latency',
    label: { vi: 'Tối Ưu Hóa Độ Trễ Truy Vấn', en: 'Query Latency Optimization' },
    value: '93,7% ↓',
    subtext: {
      vi: 'Cơ chế L1/L2 Caching & Snapshot ETL cho Dashboard BI',
      en: 'Two-tier L1/L2 Caching & Snapshot ETL for BI Dashboards'
    },
    trend: '< 15ms phản hồi',
    projectBadge: { vi: 'Kiến Trúc Backend & SQL Engine', en: 'Backend Architecture & SQL Engine' }
  },
  {
    id: 'metric-roi-uplift',
    label: { vi: 'Tiềm Năng Doanh Thu Mở Khóa', en: 'Simulated Monthly GMV Uplift' },
    value: '+1,18 Tỉ/tháng',
    subtext: {
      vi: 'Nâng CVR Kệ hàng (0,25% → 0,75%) & Gắn giỏ 308 Videos',
      en: 'Lifting Card CVR (0.25% → 0.75%) & Linking 308 Videos'
    },
    trend: 'GPM Video 4,5x LIVE',
    projectBadge: { vi: 'Mô Hình What-If ROI Simulator', en: 'What-If ROI Simulator Model' }
  }
];

export function DashboardMetricCards({ metrics, kpis }: DashboardMetricCardsProps) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';

  const rawList = metrics && metrics.length > 0 ? metrics : (kpis && kpis.length > 0 ? kpis : DEFAULT_CONTEXTUAL_METRICS);

  const displayList: MetricCardItem[] = rawList.map((rawItem, idx) => {
    const item = rawItem as MetricCardItem;
    const fallback = DEFAULT_CONTEXTUAL_METRICS[idx % DEFAULT_CONTEXTUAL_METRICS.length];
    return {
      id: item.id || fallback.id,
      label: item.label || item.title || fallback.label,
      value: item.value || fallback.value,
      subtext: item.subtext || item.change || fallback.subtext,
      trend: item.trend || item.change || fallback.trend,
      projectBadge: item.projectBadge || fallback.projectBadge,
    };
  });

  const resolveText = (val?: string | { vi: string; en: string }) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
      {displayList.map((item, idx) => {
        const fallbackContext = DEFAULT_CONTEXTUAL_METRICS[idx % DEFAULT_CONTEXTUAL_METRICS.length];
        const badgeText = item.projectBadge
          ? item.projectBadge[lang]
          : fallbackContext.projectBadge?.[lang];

        return (
          <div
            key={item.id || idx}
            className="p-5 rounded-2xl bg-slate-900/85 border border-slate-800/90 hover:border-sky-500/40 transition flex flex-col justify-between space-y-3 shadow-lg"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 truncate">
                  {badgeText}
                </span>
                {item.trend && (
                  <span className="text-xs font-mono font-semibold text-emerald-400 shrink-0">
                    {item.trend}
                  </span>
                )}
              </div>

              <div className="text-xs font-semibold text-slate-300 pt-1">{resolveText(item.label)}</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                {item.value}
              </div>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5">
              {resolveText(item.subtext) || resolveText(fallbackContext.subtext)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardMetricCards;
