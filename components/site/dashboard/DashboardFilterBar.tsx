'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface DashboardFilterBarProps {
  timeFilter: 'all' | 'q1_q2' | 'q3_q4';
  setTimeFilter: (_f: 'all' | 'q1_q2' | 'q3_q4') => void;
  channelFilter: 'all' | 'live' | 'affiliate';
  setChannelFilter: (_c: 'all' | 'live' | 'affiliate') => void;
  isEn: boolean;
}

export const DashboardFilterBar = React.memo(function DashboardFilterBar({
  timeFilter,
  setTimeFilter,
  channelFilter,
  setChannelFilter,
  isEn,
}: DashboardFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#C8EEF7]/30 dark:bg-slate-900/90 rounded-2xl border border-[#9BE7FA]/50 dark:border-slate-800 no-print">
      {/* Time Horizon Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#074553] dark:text-[#9BE7FA]" />
          <span>{isEn ? 'Time Horizon:' : 'Chu kỳ:'}</span>
        </div>
        {[
          { id: 'all', label: isEn ? 'All Horizons' : 'Tất cả chu kỳ' },
          { id: 'q1_q2', label: isEn ? 'H1 (Q1 - Q2)' : 'Nửa đầu năm (H1)' },
          { id: 'q3_q4', label: isEn ? 'H2 (Q3 - Q4)' : 'Nửa cuối năm (H2)' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setTimeFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              timeFilter === f.id
                ? 'bg-[#FFD14C] text-slate-950 font-bold shadow-xs border border-[#FFE485]'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#9BE7FA]/50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Channel Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mr-1">
          {isEn ? 'Channel:' : 'Kênh:'}
        </span>
        {[
          { id: 'all', label: isEn ? 'All Channels' : 'Tất cả kênh' },
          { id: 'live', label: isEn ? 'Live Shopping' : 'Live Shopping' },
          { id: 'affiliate', label: isEn ? 'Affiliate Network' : 'Affiliate' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setChannelFilter(c.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              channelFilter === c.id
                ? 'bg-[#9BE7FA] text-slate-950 font-bold shadow-xs border border-[#9BE7FA]'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#9BE7FA]/50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
});
