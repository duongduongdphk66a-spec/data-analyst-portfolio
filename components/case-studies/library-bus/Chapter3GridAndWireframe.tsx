'use client';

import React from 'react';
import { Grid, Layout } from 'lucide-react';
import { WEBSITE_DESIGN_DATA } from '@/app/data/libraryBusData';
import SectionHeader from '@/components/ui/SectionHeader';

interface Chapter3GridAndWireframeProps {
  isEn: boolean;
  onCopyDeepLink: (_sectionId: string, _title?: string) => void;
}

export function Chapter3GridAndWireframe({ isEn, onCopyDeepLink }: Chapter3GridAndWireframeProps) {
  return (
    <section id="sec-grid-wireframe" className="space-y-6 scroll-mt-36">
      <SectionHeader
        variant="chapter"
        id="sec-grid-wireframe"
        chapter="CHAPTER 03"
        subtitle={isEn ? WEBSITE_DESIGN_DATA.titleEn : WEBSITE_DESIGN_DATA.titleVi}
        badge="3.1 & 3.2"
        title={isEn ? 'Grid System (12 Columns) & Wireframe Principles' : 'Hệ Thống Lưới 12 Cột & Quy Chuẩn Wireframe'}
        onCopy={onCopyDeepLink}
      />

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Grid Specifications Box */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <Grid className="w-4 h-4" />
            <span>3.1 Hệ thống lưới Desktop 12 Columns</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Quy chuẩn theo tiêu chuẩn trình bày chuyên nghiệp từ tài liệu mẫu với 12 cột linh hoạt đảm bảo tính cân đối trên mọi độ phân giải.
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Columns (Số lượng cột):</span>
              <b className="font-mono text-slate-900 dark:text-white">12</b>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Margin (Lề hai bên):</span>
              <b className="font-mono text-slate-900 dark:text-white">{WEBSITE_DESIGN_DATA.gridSystem.margin}</b>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Width (Độ rộng cột):</span>
              <b className="font-mono text-slate-900 dark:text-white">{WEBSITE_DESIGN_DATA.gridSystem.width}</b>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Gutter (Khoảng cách giữa các cột):</span>
              <b className="font-mono text-slate-900 dark:text-white">{WEBSITE_DESIGN_DATA.gridSystem.gutter}</b>
            </div>
          </div>
        </div>

        {/* 12-Column Visual Simulation */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <Layout className="w-4 h-4" />
            <span>Mô phỏng trực quan lưới 12 cột trên màn hình</span>
          </h3>
          
          <div className="p-4 rounded-2xl bg-[#F0F9FB] border border-[#D2EDF6] dark:bg-slate-950 dark:border-slate-800">
            <div className="grid grid-cols-12 gap-2 h-36">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-[#9BE7FA]/40 border border-[#0D7287]/30 rounded-lg flex flex-col justify-between items-center py-2 text-[10px] font-mono text-[#0D7287] dark:text-[#9BE7FA]"
                >
                  <span>Col</span>
                  <span className="font-bold">{i+1}</span>
                  <span className="text-[10px] opacity-70">78px</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Margin: 360px</span>
              <span>Gutter: 24px</span>
              <span>Container Max-Width: 1280px</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            3.2 Wireframe tập trung phân tầng thông tin, giúp hành trình tra cứu và mượn sách không bị xao nhãng.
          </p>
        </div>
      </div>
    </section>
  );
}
