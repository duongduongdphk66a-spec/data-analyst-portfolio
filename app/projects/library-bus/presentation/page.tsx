import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Library Bus - UX/UI Design Guidelines Deck | Ma Văn Hùng',
  description: '30-slide UX/UI deck in three chapters: introduction and research, logo and UI components, and website design with wireframe and UI pairs for 20 screens.',
};

export default function PresentationPage() {
  return (
    <div className="relative w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="min-h-[56px] py-2 bg-slate-900/90 backdrop-blur border-b border-[#C8EEF7]/20 px-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/projects/library-bus"
            className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-semibold text-slate-300 hover:text-[#9BE7FA] px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 hover:border-[#9BE7FA]/40 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Case Study</span>
          </Link>
          <span className="text-slate-600">|</span>
          <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide">
            UX/UI Design Guidelines Deck (30 Slides)
          </h1>
        </div>
        <a
          href="/library-bus/presentation.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-medium text-[#9BE7FA] hover:text-white px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-[#9BE7FA]/30 hover:border-[#9BE7FA] transition-colors cursor-pointer"
        >
          <span>HTML Tĩnh Gốc</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Embedded Iframe */}
      <main className="flex-1 w-full h-full bg-slate-950">
        <iframe
          src="/library-bus/presentation.html"
          title="Library Bus UX/UI Design Guidelines Deck"
          className="w-full h-full border-0"
        />
      </main>
    </div>
  );
}
