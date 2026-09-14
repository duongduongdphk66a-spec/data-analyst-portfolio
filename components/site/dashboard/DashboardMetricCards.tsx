'use client';

import React from 'react';
import { DollarSign, Users, Activity, TrendingUp, BarChart3 } from 'lucide-react';
import { KpiItem } from '@/app/types';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface DashboardMetricCardsProps {
  kpis: KpiItem[];
}

function renderKpiIcon(iconType: KpiItem['icon']) {
  const iconClass = 'w-5 h-5 text-slate-900 dark:text-[#9BE7FA]';
  switch (iconType) {
    case 'dollar':
      return <DollarSign className={iconClass} />;
    case 'users':
      return <Users className={iconClass} />;
    case 'activity':
      return <Activity className={iconClass} />;
    case 'trending':
      return <TrendingUp className="w-5 h-5 text-[#FFD14C]" />;
    default:
      return <BarChart3 className={iconClass} />;
  }
}

export const DashboardMetricCards = React.memo(function DashboardMetricCards({
  kpis,
}: DashboardMetricCardsProps) {
  if (!kpis || kpis.length === 0) return null;

  return (
    <div className="dash-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="dash-kpi-card animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both card-bento p-6 hover:border-[#9BE7FA] transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
              {kpi.title}
            </span>
            <div className="p-2.5 bg-[#C8EEF7]/50 rounded-2xl dark:bg-slate-800">
              {renderKpiIcon(kpi.icon)}
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-white tabular-data">
            <AnimatedCounter value={kpi.value} duration={1.4} />
          </div>

          {kpi.change && (
            <div className="text-xs font-bold mt-2 flex items-center gap-1 text-[#0D7287] dark:text-[#9BE7FA]">
              <TrendingUp className="w-3.5 h-3.5" />
              {kpi.change}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});
