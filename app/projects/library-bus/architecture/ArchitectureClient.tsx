'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

export default function ArchitectureClient() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((ifr) => {
      try {
        ifr.contentWindow?.postMessage({ theme: resolvedTheme }, '*');
      } catch (_) {}
    });
  }, [resolvedTheme]);

  return (
    <div className="relative w-screen h-screen flex flex-col bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-white/95 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/projects/library-bus"
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0D7287] dark:text-slate-300 dark:hover:text-[#9BE7FA] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-colors border border-slate-200 dark:border-slate-700 hover:border-[#9BE7FA]/50 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>Về Case Study</span>
          </Link>
          <span className="text-slate-400 dark:text-slate-600">|</span>
          <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-wide">
            Interactive Architecture Graph (7 Apps, Models &amp; FKs)
          </h1>
        </div>
        <a
          href={`/library-bus/architecture-graph.html?theme=${resolvedTheme}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-[#074553] bg-[#9BE7FA] hover:bg-[#C8EEF7] px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs border border-[#9BE7FA]"
        >
          <span>HTML Tĩnh Gốc</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Embedded Iframe */}
      <main className="flex-1 w-full h-full bg-white dark:bg-slate-950">
        <iframe
          src={`/library-bus/architecture-graph.html?theme=${resolvedTheme}`}
          title="Library Bus Architecture Graph"
          className="w-full h-full border-0 bg-white dark:bg-slate-950"
        />
      </main>
    </div>
  );
}
