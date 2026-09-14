import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Library Bus - 30-Slide Presentation Deck | Ma Văn Hùng',
  description: 'Full 30-slide project presentation deck detailing domain research, system architecture, database optimization and UI design.',
};

export default function PresentationPage() {
  return (
    <div className="relative w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-12 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/projects/proj-library-bus"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Case Study</span>
          </Link>
          <span className="text-slate-600">|</span>
          <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide">
            30-Slide Presentation Deck (Research, Architecture & Data Spec)
          </h1>
        </div>
        <a
          href="/library-bus/presentation.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9BE7FA] hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <span>HTML Tĩnh Gốc</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Embedded Iframe */}
      <main className="flex-1 w-full h-full bg-slate-950">
        <iframe
          src="/library-bus/presentation.html"
          title="Library Bus 30-Slide Presentation"
          className="w-full h-full border-0"
        />
      </main>
    </div>
  );
}
