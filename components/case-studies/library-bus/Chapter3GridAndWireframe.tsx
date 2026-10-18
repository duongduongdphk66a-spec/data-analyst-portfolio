'use client';

import React from 'react';
import { Grid, Layout } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

export interface Chapter3GridAndWireframeProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

export function Chapter3GridAndWireframe({ 
  isEn = false, 
  onCopyDeepLink = () => {} 
}: Chapter3GridAndWireframeProps) {
  return (
    <section id="chapter-3-design" className="space-y-6 scroll-mt-36">
      {/* 03. SECTION HEADER */}
      <SectionHeader
        variant="chapter"
        id="sec-grid"
        chapter="CHAPTER 03"
        subtitle={isEn ? '12-column desktop grid system, wireframe blueprints & UI design' : 'Hệ thống lưới 12 cột, khung mẫu wireframe & thiết kế giao diện UI'}
        badge="03"
        title={isEn ? '03. Website Design (Grid & Wireframe)' : '03. Thiết Kế Website (Lưới & Khung Wireframe)'}
        onCopy={onCopyDeepLink}
      />

      <div className="grid lg:grid-cols-12 gap-5">
        {/* 3.1 GRID SYSTEM SPECIFICATION */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#323987] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <Grid className="w-4 h-4" />
              <span>{isEn ? '3.1 Desktop Grid System' : '3.1 Hệ thống lưới 12 cột'}</span>
            </span>
            <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200">
              Desktop Grid: 12 Columns | Width: 78px | Gutter: 24px | Margin: 360px
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="block font-mono text-xl sm:text-2xl font-black text-[#323987] dark:text-[#9BE7FA]">78px</span>
              <span className="text-xs text-slate-500 font-medium">Width</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="block font-mono text-xl sm:text-2xl font-black text-[#FA6933]">24px</span>
              <span className="text-xs text-slate-500 font-medium">Gutter</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="block font-mono text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200">360px</span>
              <span className="text-xs text-slate-500 font-medium">Margin</span>
            </div>
          </div>
        </div>

        {/* 12-COLUMN VISUAL OVERLAY & WIREFRAME BLUEPRINT */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FA6933] flex items-center gap-1.5">
              <Layout className="w-4 h-4" />
              <span>{isEn ? '3.2 12-Column Blueprint & Elements' : '3.2 Trực quan hóa Lưới 12 Cột'}</span>
            </span>
            <span className="text-xs font-mono text-slate-400">1920 × 1080 Viewport</span>
          </div>

          {/* 12 Columns Visual Strip */}
          <div className="p-3.5 rounded-2xl bg-[#F0F9FB] border border-[#D2EDF6] dark:bg-slate-950 dark:border-slate-800">
            <div className="grid grid-cols-12 gap-1.5 h-16">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#9BE7FA]/40 border border-[#0D7287]/30 rounded-lg flex items-center justify-center text-xs font-mono font-black text-[#0D7287] dark:text-[#9BE7FA]"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Wireframe Elements */}
          <div className="grid grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 relative overflow-hidden shrink-0">
                <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full text-slate-400">
                  <line x1="0" y1="0" x2="32" y2="32" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="32" y1="0" x2="0" y2="32" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Khung ảnh</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex flex-col justify-center gap-1 px-1 shrink-0">
                <div className="h-1 bg-slate-400 rounded-full w-full" />
                <div className="h-1 bg-slate-400 rounded-full w-2/3" />
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Khung văn bản</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg border-2 border-dashed border-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Nút Wireframe</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Chapter3GridAndWireframe;
