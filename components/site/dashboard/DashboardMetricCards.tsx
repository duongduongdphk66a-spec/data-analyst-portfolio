'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Database, Bus, Landmark, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface MetricCardItem {
  id?: string;
  label: string | { vi: string; en: string };
  value: string | number;
  subtext?: string | { vi: string; en: string };
  trend?: string;
  projectBadge?: { vi: string; en: string };
  icon?: React.ElementType;
  href?: string;
}

export interface DashboardMetricCardsProps {
  metrics?: MetricCardItem[];
  kpis?: any[];
}

const DEFAULT_CONTEXTUAL_METRICS: MetricCardItem[] = [
  {
    id: 'metric-kami-gmv',
    label: { vi: 'Doanh Thu Kiểm Toán (180 Ngày)', en: 'Audited Net GMV (180-Day Cycle)' },
    value: '12,74 Tỉ VNĐ',
    subtext: {
      vi: '85.500 SP bán ra • Lũy kế All-Time: 31,6 Tỉ đ (238,4k SP)',
      en: '85,500 units sold • All-Time: 31.6B VND (238.4k units)'
    },
    trend: '+56,24% (28d đầu)',
    projectBadge: { vi: 'Dự án TikTok Shop Kami Ely', en: 'Kami Ely TikTok Shop' },
    icon: ShoppingBag,
    href: '/projects/kami-ely'
  },
  {
    id: 'metric-kami-records',
    label: { vi: 'Kho Dữ Liệu SQL Thực Chiến', en: 'Empirical SQL Warehouse Scale' },
    value: '18.778 Dòng',
    subtext: {
      vi: '8 bảng CSV/MySQL • 7.046 LIVE • 4.417 Videos • 5.713 KOCs',
      en: '8 SQL tables • 7,046 LIVEs • 4,417 Videos • 5,713 KOCs'
    },
    trend: '100% Ground Truth',
    projectBadge: { vi: 'Phòng Thí Nghiệm SQL (/lab)', en: 'Interactive SQL Lab (/lab)' },
    icon: Database,
    href: '/lab'
  },
  {
    id: 'metric-library-bus',
    label: { vi: 'Hiệu Suất Đặt Sách & Đội Xe', en: 'Fleet & Reservation Fulfillment' },
    value: '92,0% Hoàn tất',
    subtext: {
      vi: '7.080 lượt mượn/tháng • 5 tuyến (30 điểm đỗ) • 0% trùng đơn',
      en: '7,080 borrows/mo • 5 routes (30 stops) • 0% race conflict'
    },
    trend: '6 Django Apps + Celery',
    projectBadge: { vi: 'Dự án Thư Viện Lưu Động', en: 'Mobile Library Bus BI' },
    icon: Bus,
    href: '/projects/library-bus'
  },
  {
    id: 'metric-heritage-japan',
    label: { vi: 'Mô Hình Kinh Tế Lượng Di Sản', en: 'Heritage Econometric Model' },
    value: 'R² = 0,84',
    subtext: {
      vi: '1.132 Quốc bảo Nhật Bản • Hệ số co giãn du lịch β = +0,72 (p < 0,01)',
      en: '1,132 National Treasures • Tourism elasticity β = +0.72 (p < 0.01)'
    },
    trend: '+24,6% dự án (DiD)',
    projectBadge: { vi: 'Dự án Di Sản Nhật Bản', en: 'Japan Heritage Policy' },
    icon: Landmark,
    href: '/projects/heritage-japan'
  }
];

export default function DashboardMetricCards({ metrics }: DashboardMetricCardsProps) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';

  const displayList = metrics && metrics.length > 0 ? metrics : DEFAULT_CONTEXTUAL_METRICS;

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
        const targetHref = item.href || fallbackContext.href || '/projects';
        const IconComponent = item.icon || fallbackContext.icon || Database;

        return (
          <Link
            key={item.id || idx}
            href={targetHref}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-[#9BE7FA] dark:hover:border-[#9BE7FA]/60 transition flex flex-col justify-between space-y-3 shadow-md hover:shadow-xl cursor-pointer"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#C8EEF7]/40 text-[#074553] border border-[#9BE7FA]/50 dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 truncate">
                  <IconComponent className="w-3.5 h-3.5 text-[#074553] dark:text-[#9BE7FA] shrink-0" />
                  <span className="truncate">{badgeText}</span>
                </span>
                {(item.trend || fallbackContext.trend) && (
                  <span className="text-xs font-mono font-bold text-[#074553] dark:text-[#FFE485] shrink-0">
                    {item.trend || fallbackContext.trend}
                  </span>
                )}
              </div>

              <div className="text-xs font-bold text-slate-600 dark:text-slate-300 pt-1">
                {resolveText(item.label)}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA] transition">
                {item.value}
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-2.5 flex items-center justify-between gap-2">
              <span className="line-clamp-2">
                {resolveText(item.subtext) || resolveText(fallbackContext.subtext)}
              </span>
              <span className="text-xs font-mono font-bold text-[#074553] dark:text-[#9BE7FA] shrink-0 group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export { DashboardMetricCards };
