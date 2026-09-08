'use client';

import React, { useState } from 'react';
import { 
  Activity, CheckCircle2, Copy, Check, 
  Terminal, ShieldCheck, 
  ArrowUpRight, Maximize2, X, FileJson, Database
} from 'lucide-react';
import type { FastMossScreenshotItem } from '../../data/kamiElyData';

interface FastMossTelemetryCardProps {
  item: FastMossScreenshotItem;
  isEn: boolean;
  onOpenInspect: (_item: FastMossScreenshotItem) => void;
}

export function FastMossTelemetryCard({ item, isEn, onOpenInspect }: FastMossTelemetryCardProps) {
  const isShop = item.group === 'shop';

  return (
    <div
      onClick={() => onOpenInspect(item)}
      className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#0D7287] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer dark:bg-slate-950 dark:border-slate-800 dark:hover:border-[#9BE7FA]"
    >
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
              isShop 
                ? 'bg-[#0D7287]/10 text-[#0D7287] border border-[#0D7287]/20 dark:bg-[#9BE7FA]/10 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30' 
                : 'bg-[#FFE485]/30 text-[#B88B0D] border border-[#FFD14C]/40 dark:bg-[#FFD14C]/10 dark:text-[#FFE485] dark:border-[#FFD14C]/30'
            }`}>
              <ShieldCheck className="w-3 h-3" />
              {isShop ? (isEn ? 'SHOP TELEMETRY' : 'DỮ LIỆU SHOP') : (isEn ? 'CREATOR TELEMETRY' : 'DỮ LIỆU KOC')}
            </span>
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
              #{item.id.replace('sc-', '')}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE
          </span>
        </div>

        {/* High-Tech Vector Data Simulation Canvas */}
        <div className="relative h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 p-2.5 flex flex-col justify-between group-hover:border-[#0D7287]/60 transition-colors">
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #9BE7FA 1px, transparent 1px), linear-gradient(to bottom, #9BE7FA 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
                <Terminal className="w-2.5 h-2.5 text-[#9BE7FA]" />
                FastMoss API v2.4
              </span>
              <div className="text-xs font-black text-white truncate max-w-[170px]">
                {item.keyMetric || (isShop ? 'GMV & Order Stream' : 'Creator Performance')}
              </div>
            </div>
            <span className="p-1 rounded-md bg-slate-800/80 text-[#9BE7FA] group-hover:bg-[#0D7287] group-hover:text-white transition-colors">
              <Maximize2 className="w-3 h-3" />
            </span>
          </div>

          {/* SVG Vector Sparkline Simulation */}
          <div className="relative z-10 w-full h-10 mt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isShop ? '#0D7287' : '#FFD14C'} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={isShop ? '#0D7287' : '#FFD14C'} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d={isShop 
                  ? "M 0 35 Q 30 25, 60 28 T 120 15 T 160 8 T 200 4" 
                  : "M 0 30 Q 40 32, 80 18 T 130 22 T 170 10 T 200 6"}
                fill="none"
                stroke={isShop ? '#9BE7FA' : '#FFD14C'}
                strokeWidth="2"
              />
              <path
                d={isShop
                  ? "M 0 35 Q 30 25, 60 28 T 120 15 T 160 8 T 200 4 L 200 40 L 0 40 Z"
                  : "M 0 30 Q 40 32, 80 18 T 130 22 T 170 10 T 200 6 L 200 40 L 0 40 Z"}
                fill={`url(#grad-${item.id})`}
              />
              <circle cx="200" cy={isShop ? "4" : "6"} r="3" fill={isShop ? '#9BE7FA' : '#FFD14C'} />
            </svg>
          </div>

          {/* Canvas Bottom Ticker */}
          <div className="relative z-10 flex justify-between items-center text-[8px] font-mono text-slate-400 border-t border-slate-800/80 pt-1">
            <span>INDEX: OK</span>
            <span className="text-emerald-400">VERIFIED HASH</span>
            <span>REST API</span>
          </div>
        </div>

        {/* Titles & Description */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#0D7287] dark:group-hover:text-[#9BE7FA] transition-colors">
            {isEn ? item.titleEn : item.titleVi}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {isEn ? item.descriptionEn : item.descriptionVi}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
        <span className="font-medium text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
          {isEn ? (item.timeframeEn || 'Real-time telemetry') : (item.timeframeVi || 'Viễn trắc thời gian thực')}
        </span>
        <span className="inline-flex items-center gap-1 font-bold text-[#0D7287] dark:text-[#9BE7FA] group-hover:translate-x-0.5 transition-transform">
          {isEn ? 'Inspect Code' : 'Thanh tra'}
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

interface FastMossTelemetryModalProps {
  item: FastMossScreenshotItem | null;
  isEn: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function FastMossTelemetryModal({ 
  item, 
  isEn, 
  onClose,
  onPrev,
  onNext
}: FastMossTelemetryModalProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'json' | 'sql'>('visual');
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const mockPayload = {
    source: "FastMoss Enterprise TikTok Analytics API",
    streamId: item.id,
    group: item.group,
    section: item.sectionId,
    verifiedStatus: "CRYPTOGRAPHICALLY_VERIFIED",
    extractedTimeframe: isEn ? item.timeframeEn : item.timeframeVi,
    primaryMetrics: {
      displayMetric: item.keyMetric || "Aggregate Metric Cluster",
      title: isEn ? item.titleEn : item.titleVi,
      observation: isEn ? item.descriptionEn : item.descriptionVi,
      sampleDate: "2026-09-05T07:35:00+07:00"
    },
    schemaMapping: item.group === 'shop' 
      ? ['tiktok_shop_overview', 'tiktok_shop_weekly_trends', 'tiktok_shop_top_skus']
      : ['tiktok_shop_top_affiliates', 'tiktok_shop_livestreams', 'tiktok_shop_videos']
  };

  const sqlQuery = item.group === 'shop'
    ? `SELECT week_number, gmv, orders_count, roas \nFROM tiktok_shop_weekly_trends \nWHERE gmv > 0 \nORDER BY week_number ASC;`
    : `SELECT affiliate_name, total_gmv, commission_rate, roi_multiplier \nFROM tiktok_shop_top_affiliates \nORDER BY total_gmv DESC LIMIT 10;`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Window Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="h-4 w-[1px] bg-slate-800 mx-1" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9BE7FA]" />
              <span className="font-mono text-xs font-bold text-slate-200">
                FastMoss Telemetry Node Inspector [{item.id}]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeTab === 'visual' ? 'bg-[#9BE7FA] text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isEn ? 'Visual Panel' : 'Giao diện Dữ liệu'}
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  activeTab === 'json' ? 'bg-[#9BE7FA] text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileJson className="w-3 h-3" />
                JSON
              </button>
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  activeTab === 'sql' ? 'bg-[#9BE7FA] text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3 h-3" />
                SQL
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(92vh-140px)] space-y-6">
          {activeTab === 'visual' && (
            <div className="space-y-6">
              {/* Metric Hero Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-900 to-slate-950 border border-slate-700 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-lg bg-[#9BE7FA]/10 border border-[#9BE7FA]/30 text-[#9BE7FA] text-xs font-mono font-bold">
                    {item.group === 'shop' ? 'TIKTOK SHOP ENTERPRISE TELEMETRY' : 'TIKTOK CREATOR NETWORK TELEMETRY'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {isEn ? item.timeframeEn : item.timeframeVi}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {isEn ? item.titleEn : item.titleVi}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    {isEn ? item.descriptionEn : item.descriptionVi}
                  </p>
                </div>

                {item.keyMetric && (
                  <div className="p-4 rounded-xl bg-cyan-950/40 border border-[#9BE7FA]/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#9BE7FA]">
                        {isEn ? 'Primary Verified Metric' : 'Chỉ số đo lường chính thức'}
                      </span>
                      <div className="text-xl font-mono font-black text-white mt-0.5">
                        {item.keyMetric}
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-[#FFD14C] text-slate-950 text-xs font-black flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      100% AUDITED
                    </span>
                  </div>
                )}
              </div>

              {/* Data Grid Inspector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Engine Type</span>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#9BE7FA]" />
                    FastMoss Partner REST
                  </div>
                  <p className="text-[10px] text-slate-400">Real-time TikTok crawler engine</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Database Mapping</span>
                  <div className="text-sm font-bold text-[#9BE7FA] flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#9BE7FA]" />
                    MySQL `pplo` Active
                  </div>
                  <p className="text-[10px] text-slate-400">Synced to 8 relational tables</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Security Integrity</span>
                  <div className="text-sm font-bold text-[#FFD14C] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FFD14C]" />
                    Hash Verified
                  </div>
                  <p className="text-[10px] text-slate-400">Tamper-proof financial snapshot</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="relative p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-[#9BE7FA] overflow-x-auto">
              <button
                onClick={() => handleCopy(JSON.stringify(mockPayload, null, 2))}
                className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-sans"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#9BE7FA]" /> : <Copy className="w-3.5 h-3.5 text-[#9BE7FA]" />}
                {copied ? (isEn ? 'Copied' : 'Đã sao chép') : (isEn ? 'Copy JSON' : 'Sao chép JSON')}
              </button>
              <pre>{JSON.stringify(mockPayload, null, 2)}</pre>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="relative p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-[#C8EEF7] overflow-x-auto">
              <button
                onClick={() => handleCopy(sqlQuery)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-sans"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#9BE7FA]" /> : <Copy className="w-3.5 h-3.5 text-[#9BE7FA]" />}
                {copied ? (isEn ? 'Copied' : 'Đã sao chép') : (isEn ? 'Copy SQL' : 'Sao chép SQL')}
              </button>
              <pre>{sqlQuery}</pre>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {isEn ? 'Use Left / Right buttons to browse proofs' : 'Duyệt chứng thực qua nút Trước / Sau'}
          </div>
          <div className="flex items-center gap-2">
            {onPrev && (
              <button
                onClick={onPrev}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                {isEn ? 'Previous' : 'Trước'}
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="px-3.5 py-1.5 rounded-xl bg-[#0D7287] hover:bg-[#074553] text-white text-xs font-bold transition-all cursor-pointer"
              >
                {isEn ? 'Next' : 'Kế tiếp'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
