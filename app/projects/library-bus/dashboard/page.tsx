import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Library Bus - Concentric Architecture Radar | Ma Văn Hùng',
  description: 'Concentric architecture radar & dashboard for Library Bus fleet, stations, transactions, and micro-interactions.',
};

export default function DashboardPage() {
  return (
    <div className="relative w-screen h-dvh flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-slate-900/90 border-slate-800 px-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/projects/library-bus"
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-[#9BE7FA] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 transition-colors border border-slate-700 hover:border-[#9BE7FA]/50 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#9BE7FA]" />
            <span>Về Case Study</span>
          </Link>
          <span className="text-slate-600">|</span>
          <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide">
            Concentric Architecture Radar & System Dashboard
          </h1>
        </div>
        <a
          href="/library-bus/understand_dashboard.html"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-[#074553] bg-[#9BE7FA] hover:bg-[#C8EEF7] px-3.5 py-2 rounded-xl transition cursor-pointer shadow-xs border border-[#9BE7FA]"
        >
          <span>HTML Tĩnh Gốc</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Embedded Iframe */}
      <main className="flex-1 w-full h-full bg-slate-950">
        <iframe
          src="/library-bus/understand_dashboard.html"
          title="Library Bus Concentric Radar Dashboard"
          className="w-full h-full border-0"
        />
      </main>
    </div>
  );
}
