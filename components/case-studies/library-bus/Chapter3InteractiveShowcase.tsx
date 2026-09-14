'use client';

import React, { useState } from 'react';
import { 
  GitBranch, Layers, Monitor, FileText, Smartphone, ExternalLink 
} from 'lucide-react';
import { realUIGallery, interactiveShowcases } from '@/app/data/libraryBusData';
import SectionHeader from '@/components/ui/SectionHeader';
import { LibraryBusShowcaseCard } from '@/components/ui/LibraryBusShowcaseCard';

interface Chapter3InteractiveShowcaseProps {
  isEn: boolean;
  onCopyDeepLink: (_sectionId: string, _title?: string) => void;
}

export function Chapter3InteractiveShowcase({ isEn, onCopyDeepLink }: Chapter3InteractiveShowcaseProps) {
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<string>('gallery');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<(typeof realUIGallery)[0] | null>(null);

  return (
    <>
      <section id="sec-interactive" className="space-y-6 scroll-mt-36">
        <SectionHeader
          variant="chapter"
          id="sec-interactive"
          chapter="CHAPTER 03"
          subtitle={isEn ? '3.4 Interactive Demos & Embedded Specifications' : '3.4 Bộ trình diễn tương tác & Bản đồ kiến trúc'}
          badge="3.4"
          title={isEn ? 'Live Interactive Showcase & Architecture Graph' : 'Bộ Trình Diễn Tương Tác: Bản Đồ Kiến Trúc & Slide Thuyết Trình'}
          onCopy={onCopyDeepLink}
        />

        {/* Showcase Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <button
            onClick={() => setActiveShowcaseTab('gallery')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeShowcaseTab === 'gallery'
                ? 'bg-[#0D7287] text-white shadow-md'
                : 'text-slate-700 hover:text-[#0D7287] hover:bg-white/80 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{isEn ? '1. Real Fleet & UI Gallery' : '1. Thư Viện Ảnh Thực Địa'}</span>
          </button>

          {interactiveShowcases.map((showcase) => (
            <button
              key={showcase.id}
              onClick={() => setActiveShowcaseTab(showcase.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeShowcaseTab === showcase.id
                  ? 'bg-[#0D7287] text-white shadow-md'
                  : 'text-slate-700 hover:text-[#0D7287] hover:bg-white/80 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {showcase.id === 'architecture-graph' && <GitBranch className="w-4 h-4" />}
              {showcase.id === 'understand-radar' && <Layers className="w-4 h-4" />}
              {showcase.id === 'presentation-slides' && <Monitor className="w-4 h-4" />}
              {showcase.id === 'website-pdf' && <FileText className="w-4 h-4" />}
              <span>{isEn ? showcase.titleEn : showcase.titleVi}</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] font-bold dark:bg-slate-800 dark:text-[#9BE7FA]">
                {showcase.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Tab 1: Real Fleet & UI Gallery */}
        {activeShowcaseTab === 'gallery' && (
          <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {realUIGallery.map((item) => (
              <LibraryBusShowcaseCard
                key={item.id}
                id={item.id}
                titleVi={item.titleVi}
                titleEn={item.titleEn}
                descVi={item.descVi}
                descEn={item.descEn}
                tag={item.tag}
                isEn={isEn}
                onOpenZoom={() => setSelectedGalleryItem(item)}
              />
            ))}
          </div>
        )}

        {/* Tab 2: Interactive D3 Architecture Graph */}
        {activeShowcaseTab === 'architecture-graph' && (
          <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden animate-in fade-in duration-300 dark:bg-slate-900 dark:border-slate-800">
            <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <GitBranch className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>Interactive Architecture Graph (7 Apps, Models & Foreign Keys)</span>
              </div>
              <a
                href="/library-bus/architecture-graph.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#0D7287]" />
                <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
              </a>
            </div>
            <div className="w-full h-[650px] bg-slate-50 dark:bg-slate-950">
              <iframe
                src="/library-bus/architecture-graph.html"
                title="Library Bus Architecture Graph"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Concentric Architecture Radar */}
        {activeShowcaseTab === 'understand-radar' && (
          <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden animate-in fade-in duration-300 dark:bg-slate-900 dark:border-slate-800">
            <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Layers className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>Concentric Architecture Radar: Bản đồ Vòng Tròn Đồng Tâm</span>
              </div>
              <a
                href="/library-bus/understand_dashboard.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#0D7287]" />
                <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
              </a>
            </div>
            <div className="w-full h-[650px] bg-slate-50 dark:bg-slate-950">
              <iframe
                src="/library-bus/understand_dashboard.html"
                title="Library Bus Concentric Radar"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

        {/* Tab 4: 30-Slide Presentation Deck */}
        {activeShowcaseTab === 'presentation-slides' && (
          <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden animate-in fade-in duration-300 dark:bg-slate-900 dark:border-slate-800">
            <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Monitor className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>30-Slide Project Presentation Deck (Research, Architecture & Data Spec)</span>
              </div>
              <a
                href="/library-bus/presentation.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#0D7287]" />
                <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
              </a>
            </div>
            <div className="w-full h-[650px] bg-slate-50 dark:bg-slate-950">
              <iframe
                src="/library-bus/presentation.html"
                title="Library Bus 30-Slide Presentation"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

        {/* Tab 5: Interactive 20-Screen Specification HTML */}
        {activeShowcaseTab === 'website-pdf' && (
          <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden animate-in fade-in duration-300 dark:bg-slate-900 dark:border-slate-800">
            <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <FileText className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>website.html: Bản Đặc Tả Thiết Kế Hoàn Chỉnh (20 Màn Hình)</span>
              </div>
              <a
                href="/library-bus/website.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-[#0D7287] hover:bg-[#095869] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isEn ? 'Open Fullscreen' : 'Mở toàn trang'}</span>
              </a>
            </div>
            <div className="w-full h-[650px] bg-slate-50 dark:bg-slate-950">
              <iframe
                src="/library-bus/website.html"
                title="Library Bus Website Spec HTML"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}
      </section>

      {/* Code Showcase Modal */}
      {selectedGalleryItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedGalleryItem(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="px-2.5 py-0.5 rounded-md bg-[#0D7287]/10 text-[#0D7287] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] font-mono text-[10px] font-bold">
                  {selectedGalleryItem.tag}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isEn ? selectedGalleryItem.titleEn : selectedGalleryItem.titleVi}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGalleryItem(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="h-[50vh] min-h-[300px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <LibraryBusShowcaseCard
                id={selectedGalleryItem.id}
                titleVi={selectedGalleryItem.titleVi}
                titleEn={selectedGalleryItem.titleEn}
                descVi={selectedGalleryItem.descVi}
                descEn={selectedGalleryItem.descEn}
                tag={selectedGalleryItem.tag}
                isEn={isEn}
              />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isEn ? selectedGalleryItem.descEn : selectedGalleryItem.descVi}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
