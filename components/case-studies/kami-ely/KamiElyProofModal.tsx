'use client';

import React from 'react';
import { X } from 'lucide-react';
import { FastMossTelemetryCard, FastMossTelemetryModal } from '@/components/ui/FastMossTelemetryCard';
import { fastmossScreenshotsManifest, FastMossScreenshotItem } from '@/app/data/kamiElyData';

interface KamiElyProofModalProps {
  isEn: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedProofGroup: 'all' | 'shop' | 'creator';
  setSelectedProofGroup: (_group: 'all' | 'shop' | 'creator') => void;
  activeScreenshot: FastMossScreenshotItem | null;
  setActiveScreenshot: (_item: FastMossScreenshotItem | null) => void;
}

export default function KamiElyProofModal({
  isEn,
  isOpen,
  onClose,
  selectedProofGroup,
  setSelectedProofGroup,
  activeScreenshot,
  setActiveScreenshot
}: KamiElyProofModalProps) {
  if (!isOpen && !activeScreenshot) return null;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-slate-900 border border-[#9BE7FA]/80 dark:border-slate-800 rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-gradient-to-r from-[#C8EEF7]/30 via-white to-[#FFE485]/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0D7287] text-white text-[11px] font-black uppercase tracking-wider">
                    FastMoss Verified Telemetry
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-xs font-bold border border-[#FFD14C]">
                    36 {isEn ? 'Original Captures' : 'Ảnh Gốc'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                  {isEn ? 'FastMoss Telemetry Proof Gallery' : 'Kho Bằng Chứng Viễn Trắc FastMoss (36 Ảnh Gốc)'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isEn 
                    ? 'Official audit screenshots captured on 2026-09-05 confirming all shop & creator metrics' 
                    : 'Dữ liệu chụp màn hình xác thực độc lập ghi nhận ngày 05/09/2026 cho Shop Kami Ely & Creator @kamielyhn'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter group buttons */}
                <div className="flex bg-[#C8EEF7]/50 rounded-xl p-1 dark:bg-slate-800">
                  <button
                    onClick={() => setSelectedProofGroup('all')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedProofGroup === 'all'
                        ? 'bg-white text-slate-950 shadow-xs font-black dark:bg-slate-700 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isEn ? 'All' : 'Tất cả'} ({fastmossScreenshotsManifest.length})
                  </button>
                  <button
                    onClick={() => setSelectedProofGroup('shop')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedProofGroup === 'shop'
                        ? 'bg-[#0D7287] text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Shop ({fastmossScreenshotsManifest.filter(s => s.group === 'shop').length})
                  </button>
                  <button
                    onClick={() => setSelectedProofGroup('creator')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedProofGroup === 'creator'
                        ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Creator ({fastmossScreenshotsManifest.filter(s => s.group === 'creator').length})
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                  title={isEn ? 'Close' : 'Đóng'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Gallery Grid Container */}
            <div className="p-6 overflow-y-auto max-h-[calc(92vh-140px)] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {fastmossScreenshotsManifest
                  .filter((item) => selectedProofGroup === 'all' || item.group === selectedProofGroup)
                  .map((item) => (
                    <FastMossTelemetryCard
                      key={item.id}
                      item={item}
                      isEn={isEn}
                      onOpenInspect={(it) => setActiveScreenshot(it)}
                    />
                  ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Full-Screen FastMoss Telemetry Inspector Modal */}
      {activeScreenshot && (() => {
        const currentIdx = fastmossScreenshotsManifest.findIndex((s) => s.id === activeScreenshot.id);
        const prevItem = currentIdx > 0 ? fastmossScreenshotsManifest[currentIdx - 1] : null;
        const nextItem = currentIdx < fastmossScreenshotsManifest.length - 1 ? fastmossScreenshotsManifest[currentIdx + 1] : null;

        return (
          <FastMossTelemetryModal
            item={activeScreenshot}
            isEn={isEn}
            onClose={() => setActiveScreenshot(null)}
            onPrev={prevItem ? () => setActiveScreenshot(prevItem) : undefined}
            onNext={nextItem ? () => setActiveScreenshot(nextItem) : undefined}
          />
        );
      })()}
    </>
  );
}
