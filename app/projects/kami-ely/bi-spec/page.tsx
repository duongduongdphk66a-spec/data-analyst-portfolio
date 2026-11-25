import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kami Ely - Đặc tả BI Dashboard (Power BI / Looker Studio) | Ma Văn Hùng',
  description:
    'Bản đặc tả BI cho dự án Kami Ely: Star Schema 3 Fact / 3 Dim, 6 nhóm DAX Measures đối chiếu metrics_v2.json, bố cục 3 trang Power BI / Looker Studio và 4 ngưỡng cảnh báo sớm.',
};

export default function KamiBiSpecPage() {
  return (
    <div className="relative w-screen h-dvh flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      <header className="min-h-[56px] py-2 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-3 z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/projects/proj-kami-ely"
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0D7287] dark:text-slate-300 dark:hover:text-[#9BE7FA] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>Về Case Study</span>
          </Link>
          <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">|</span>
          <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
            Đặc tả BI Dashboard (Power BI / Looker Studio) · Kami Ely
          </h1>
        </div>
        <a
          href="/kami/kami-ely-bi-spec.html"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold text-[#074553] bg-[#9BE7FA] hover:bg-[#C8EEF7] px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-[#0D7287]/20 shrink-0"
        >
          <span>Mở bản in / PDF</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </header>

      <main className="flex-1 w-full h-full bg-white">
        <iframe
          src="/kami/kami-ely-bi-spec.html"
          title="Kami Ely Power BI and Looker Studio Dashboard Specification"
          className="w-full h-full border-0"
        />
      </main>
    </div>
  );
}
