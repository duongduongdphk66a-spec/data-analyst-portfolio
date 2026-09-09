'use client';

import React, { useState } from 'react';
import { Clock, ImageIcon, ChevronDown, CheckCircle2, Eye } from 'lucide-react';
import { KAMI_DATA_SCOPES, fastmossScreenshotsManifest } from '@/app/data/kamiElyData';

interface KamiElyDataScopeMatrixProps {
  scopeType: 'shop' | 'creator';
  isEn: boolean;
  openProofScreenshot: (id: string) => void;
  openProofModalWithGroup: (group: 'shop' | 'creator') => void;
}

export default function KamiElyDataScopeMatrix({
  scopeType,
  isEn,
  openProofScreenshot,
  openProofModalWithGroup
}: KamiElyDataScopeMatrixProps) {
  const [isDataScopeExpanded, setIsDataScopeExpanded] = useState(false);
  const scopes = KAMI_DATA_SCOPES.filter((s) => s.scope === scopeType);
  const isShop = scopeType === 'shop';

  return (
    <div className="rounded-3xl bg-gradient-to-br from-white via-[#F0FBFE]/50 to-white border-2 border-[#9BE7FA]/80 shadow-md dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 dark:border-slate-800 overflow-hidden">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsDataScopeExpanded(!isDataScopeExpanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-[#F0FBFE]/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8EEF7] text-[#0D7287] dark:bg-slate-800 dark:text-[#9BE7FA] text-xs font-black uppercase tracking-wider shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>{isEn ? 'METHODOLOGY' : 'PHƯƠNG PHÁP'}</span>
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
            {isEn 
              ? (isShop ? 'Store data horizons: Lifetime · 180d · 90d · 28d' : 'Creator data horizons: Lifetime · 180d · 90d · 28d')
              : (isShop ? 'Chu kỳ dữ liệu: Tích lũy · 180 ngày · 90 ngày · 28 ngày' : 'Chu kỳ dữ liệu Creator: Tích lũy · 180 ngày · 90 ngày · 28 ngày')}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProofModalWithGroup(scopeType);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-[#0D7287] dark:border-[#9BE7FA] text-[#0D7287] dark:text-[#9BE7FA] hover:bg-[#0D7287] hover:text-white dark:hover:bg-[#9BE7FA] dark:hover:text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>
              {isEn 
                ? `Proofs (${fastmossScreenshotsManifest.filter(s => s.group === scopeType).length})` 
                : `Bằng chứng (${fastmossScreenshotsManifest.filter(s => s.group === scopeType).length})`}
            </span>
          </button>
          <ChevronDown className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isDataScopeExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Collapsible Content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isDataScopeExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 sm:p-8 pt-0 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8EEF7] text-[#0D7287] dark:bg-slate-800 dark:text-[#9BE7FA] text-xs font-black uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>{isEn ? 'DATA COLLECTION HORIZONS & SCOPE SPECIFICATION' : 'MA TRẬN PHÂN ĐỊNH PHẠM VI & CHU KỲ DỮ LIỆU'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                {isEn 
                  ? (isShop ? 'Store-Wide Telemetry Horizon Breakdown' : 'Creator @kamielyhn Horizon Breakdown')
                  : (isShop ? 'Phân Định 3 Chu Kỳ Thu Thập Dữ Liệu Của Toàn Shop' : 'Phân Định 3 Chu Kỳ Thu Thập Dữ Liệu Kênh Chính Chủ @kamielyhn')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn 
                  ? 'Methodological clarification: Explicitly separating Lifetime Inception Data from rolling observation windows (180 days, 90 days, 28 days) based on authentic FastMoss audit captures (dated 2026-09-05).'
                  : 'Quy chuẩn phương pháp luận: Tách bạch tuyệt đối giữa Dữ liệu Tích Lũy Toàn Thời Gian (từ khi thành lập) và các chu kỳ quan sát viễn trắc (180 ngày, 90 ngày, 28 ngày) theo bộ ảnh kiểm toán độc lập FastMoss ngày 05/09/2026.'}
              </p>
            </div>
          </div>

          {/* 3 Scope Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {scopes.map((scopeItem) => {
              const isAllTime = scopeItem.isAllTime;
              return (
                <div 
                  key={scopeItem.id}
                  className={`p-6 rounded-3xl border-2 flex flex-col justify-between transition-all ${
                    isAllTime 
                      ? 'bg-gradient-to-b from-[#FFFDF5] to-white border-amber-400/90 shadow-md dark:from-amber-950/20 dark:to-slate-900 dark:border-amber-700/80' 
                      : 'bg-white border-[#9BE7FA]/70 shadow-sm dark:bg-slate-900 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Scope Badge & Period */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black tracking-wide uppercase ${
                          isAllTime 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-700' 
                            : 'bg-[#C8EEF7] text-[#0D7287] border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700'
                        }`}>
                          {scopeItem.timeframeBadge}
                        </span>
                        {isAllTime && (
                          <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300/60">
                            ⚠️ KHÔNG PHẢI 180N
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-black text-slate-950 dark:text-white leading-snug">
                        {isEn ? scopeItem.timeframeEn : scopeItem.timeframeVi}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                        <span>{isEn ? scopeItem.periodEn : scopeItem.periodVi}</span>
                      </div>
                    </div>

                    {/* Core Numeric Strip */}
                    <div className={`p-3.5 rounded-2xl border ${
                      isAllTime 
                        ? 'bg-amber-50/70 border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-900/60' 
                        : 'bg-[#F0FBFE] border-[#9BE7FA]/60 dark:bg-slate-800/60 dark:border-slate-700/60'
                    } space-y-1.5`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isEn ? 'Core Commercial Metric' : 'Chỉ Số Thương Mại Trọng Tâm'}
                      </div>
                      <div className="text-2xl font-black text-slate-950 dark:text-white">
                        {scopeItem.totalGmv}
                      </div>
                      <div className="text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                        {scopeItem.totalUnits}
                      </div>
                    </div>

                    {/* Highlights list */}
                    <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                      {(isEn ? scopeItem.keyHighlightsEn : scopeItem.keyHighlightsVi).map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isAllTime ? 'text-amber-600 dark:text-amber-400' : 'text-[#0D7287] dark:text-[#9BE7FA]'}`} />
                          <span className="leading-tight">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proof Screenshot Anchors */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {isEn ? 'Verified FastMoss Captures:' : 'Ảnh Bằng Chứng FastMoss Đối Soát:'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {scopeItem.screenshotIds.slice(0, 4).map((scId) => {
                        const scItem = fastmossScreenshotsManifest.find((s) => s.id === scId);
                        if (!scItem) return null;
                        const shortCode = scItem.filename.replace('Screenshot 2026-09-05 ', '').replace('.png', '');
                        return (
                          <button
                            key={scId}
                            onClick={() => openProofScreenshot(scId)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                              isAllTime
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800'
                                : 'bg-slate-100 hover:bg-[#C8EEF7] text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                            }`}
                            title={isEn ? `View ${scItem.filename}` : `Xem ảnh ${scItem.filename}`}
                          >
                            <Eye className="w-3 h-3" />
                            <span>Ảnh {shortCode}</span>
                          </button>
                        );
                      })}
                      {scopeItem.screenshotIds.length > 4 && (
                        <button
                          onClick={() => openProofModalWithGroup(scopeType)}
                          className="px-2 py-1 rounded-xl text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                          +{scopeItem.screenshotIds.length - 4} ảnh khác →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
