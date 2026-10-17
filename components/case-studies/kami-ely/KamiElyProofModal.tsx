'use client';

import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { FastMossTelemetryCard, FastMossTelemetryModal } from '@/components/ui/FastMossTelemetryCard';
import { fastmossScreenshotsManifest, FastMossScreenshotItem } from '@/app/data/kamiElyData';

export interface KamiElyProofModalProps {
  isEn?: boolean;
  isOpen: boolean;
  onClose: () => void;
  initialScreenshotId?: string;
}

export default function KamiElyProofModal({
  isEn: propIsEn,
  isOpen,
  onClose,
  initialScreenshotId
}: KamiElyProofModalProps) {
  const { language } = useLanguage();
  const isEn = propIsEn ?? (language === 'en');
  const lang = isEn ? 'en' : 'vi';

  const [selectedGroup, setSelectedGroup] = useState<'all' | 'shop' | 'creator'>('all');
  const [activeScreenshot, setActiveScreenshot] = useState<FastMossScreenshotItem | null>(() => {
    if (initialScreenshotId) {
      return fastmossScreenshotsManifest.find((s) => s.id === initialScreenshotId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (initialScreenshotId) {
      const match = fastmossScreenshotsManifest.find((s) => s.id === initialScreenshotId);
      if (match) {
        setActiveScreenshot(match);
      }
    }
  }, [initialScreenshotId]);

  if (!isOpen && !activeScreenshot) return null;

  const filteredScreenshots = fastmossScreenshotsManifest.filter((s) => {
    if (selectedGroup === 'all') return true;
    return s.group === selectedGroup;
  });

  const currentIndex = activeScreenshot
    ? fastmossScreenshotsManifest.findIndex((s) => s.id === activeScreenshot.id)
    : -1;
  const prevItem = currentIndex > 0 ? fastmossScreenshotsManifest[currentIndex - 1] : undefined;
  const nextItem =
    currentIndex >= 0 && currentIndex < fastmossScreenshotsManifest.length - 1
      ? fastmossScreenshotsManifest[currentIndex + 1]
      : undefined;

  const handleCloseInspector = () => {
    setActiveScreenshot(null);
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#9BE7FA]/30 text-[#074553] dark:text-[#9BE7FA]">
                    <Search className="w-4 h-4" />
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white">
                    {lang === 'vi' ? 'Bằng Chứng Dữ Liệu Gốc Telemetry' : 'Raw Telemetry Proof Gallery'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'vi'
                    ? '22 ảnh chụp màn hình thu thập ngày 05/09/2026 đối soát với kho dữ liệu MySQL 18.778 bản ghi.'
                    : '22 verified screenshots collected on Sep 05, 2026 cross-checked against 18,778 MySQL records.'}
                </p>
              </div>

              {/* Group Filter Buttons */}
              <div className="flex items-center gap-2">
                <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setSelectedGroup('all')}
                    className={`min-h-[36px] px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedGroup === 'all'
                        ? 'bg-[#9BE7FA] text-[#074553] shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {lang === 'vi' ? 'Tất cả' : 'All'} ({fastmossScreenshotsManifest.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGroup('shop')}
                    className={`min-h-[36px] px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedGroup === 'shop'
                        ? 'bg-[#9BE7FA] text-[#074553] shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Shop ({fastmossScreenshotsManifest.filter((s) => s.group === 'shop').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGroup('creator')}
                    className={`min-h-[36px] px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      selectedGroup === 'creator'
                        ? 'bg-[#9BE7FA] text-[#074553] shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Creator ({fastmossScreenshotsManifest.filter((s) => s.group === 'creator').length})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label={lang === 'vi' ? 'Đóng cửa sổ' : 'Close modal'}
                  className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredScreenshots.map((item) => (
                  <FastMossTelemetryCard
                    key={item.id}
                    item={item}
                    isEn={isEn}
                    onOpenInspect={() => setActiveScreenshot(item)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Inspector Modal */}
      {activeScreenshot && (
        <FastMossTelemetryModal
          item={activeScreenshot}
          isEn={isEn}
          onClose={handleCloseInspector}
          onPrev={prevItem ? () => setActiveScreenshot(prevItem) : undefined}
          onNext={nextItem ? () => setActiveScreenshot(nextItem) : undefined}
        />
      )}
    </>
  );
}
