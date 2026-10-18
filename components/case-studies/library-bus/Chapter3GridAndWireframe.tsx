'use client';

import React from 'react';
import { Grid, Layout } from 'lucide-react';
import { WEBSITE_DESIGN_DATA } from '@/app/data/libraryBusData';
import SectionHeader from '@/components/ui/SectionHeader';

import { useLanguage } from '@/app/context/LanguageContext';

export interface Chapter3GridAndWireframeProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

export function Chapter3GridAndWireframe({ 
  isEn: propIsEn, 
  onCopyDeepLink = () => {} 
}: Chapter3GridAndWireframeProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  return (
    <section id="chapter-3-design" className="space-y-6 scroll-mt-36">
      <SectionHeader
        variant="chapter"
        id="sec-grid-wireframe"
        chapter="CHAPTER 03"
        subtitle={isEn ? WEBSITE_DESIGN_DATA.titleEn : WEBSITE_DESIGN_DATA.titleVi}
        badge="3.1 & 3.2"
        title={isEn ? 'Grid System & Wireframe' : 'Hệ Thống Lưới & Khung Wireframe'}
        onCopy={onCopyDeepLink}
      />

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Grid Specifications Box */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <Grid className="w-4 h-4" />
            <span>{isEn ? '3.1 Grid System (Desktop)' : '3.1 Hệ thống lưới (Grid System)'}</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {isEn
              ? 'Desktop pages use a 12-column grid. Content sits in the middle of the page and blocks are split by columns.'
              : 'Trang desktop dùng lưới 12 cột. Nội dung đặt giữa trang và các khối chia theo cột.'}
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-600 dark:text-slate-400">{isEn ? 'Desktop columns:' : 'Desktop (số cột):'}</span>
              <b className="font-mono text-slate-900 dark:text-white">{WEBSITE_DESIGN_DATA.gridSystem.count}</b>
            </div>
            <div className="flex justify-between gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Mobile:</span>
              <b className="text-right text-slate-900 dark:text-white">{isEn ? WEBSITE_DESIGN_DATA.gridSystem.mobileEn : WEBSITE_DESIGN_DATA.gridSystem.mobileVi}</b>
            </div>
          </div>
        </div>

        {/* 12-Column Visual + wireframe elements */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <Layout className="w-4 h-4" />
            <span>{isEn ? '3.2 12-Column Grid & Wireframe Elements' : '3.2 Lưới 12 cột & thành phần wireframe'}</span>
          </h3>

          <div className="p-4 rounded-2xl bg-[#F0F9FB] border border-[#D2EDF6] dark:bg-slate-950 dark:border-slate-800">
            <div className="grid grid-cols-12 gap-2 h-28">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#9BE7FA]/40 border border-[#0D7287]/30 rounded-lg flex flex-col justify-center items-center text-xs font-mono text-[#0D7287] dark:text-[#9BE7FA]"
                >
                  <span className="font-bold">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-[11px] text-slate-600 dark:text-slate-400">
            <div className="space-y-1.5">
              <div className="font-bold text-slate-800 dark:text-slate-200">{isEn ? 'Image frame' : 'Khung ảnh'}</div>
              <div className="h-14 rounded-md bg-slate-200 relative overflow-hidden dark:bg-slate-700">
                <svg viewBox="0 0 100 56" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                  <line x1="0" y1="0" x2="100" y2="56" stroke="#94A3B8" />
                  <line x1="100" y1="0" x2="0" y2="56" stroke="#94A3B8" />
                </svg>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="font-bold text-slate-800 dark:text-slate-200">{isEn ? 'Text frame' : 'Khung chữ'}</div>
              <div className="space-y-1.5 pt-1">
                <div className="h-2.5 w-2/3 rounded bg-slate-400" />
                <div className="h-2 rounded bg-slate-300" />
                <div className="h-2 rounded bg-slate-300" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="font-bold text-slate-800 dark:text-slate-200">{isEn ? 'Button' : 'Nút bấm'}</div>
              <div className="h-6 w-24 rounded-full bg-slate-400" />
              <div className="h-6 w-24 rounded-full border-2 border-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Chapter3GridAndWireframe;
