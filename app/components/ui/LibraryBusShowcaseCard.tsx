'use client';

import React from 'react';
import { 
  Monitor, Grid, QrCode, 
  Wifi, Battery, ArrowRight
} from 'lucide-react';

interface LibraryBusShowcaseCardProps {
  id: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  tag: string;
  isEn?: boolean;
  onOpenZoom?: () => void;
}

export function LibraryBusShowcaseCard({
  id,
  titleVi,
  titleEn,
  descVi,
  descEn,
  tag,
  isEn = false,
  onOpenZoom
}: LibraryBusShowcaseCardProps) {

  // Render specific interactive code visualization based on card id
  const renderVisual = () => {
    switch (id) {
      case 'hero-bus':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-[#FFFDF9] to-[#FAF4EC] flex items-center justify-center p-4 overflow-hidden dark:from-slate-900 dark:to-slate-950">
            {/* Ambient Background Lights */}
            <div className="absolute top-2 right-4 flex items-center gap-1 text-[9px] font-mono text-[#BD5705] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>FLEET ON-DUTY (GPS ACTIVE)</span>
            </div>

            {/* Vector Library Bus SVG */}
            <svg viewBox="0 0 320 140" className="w-full max-w-[280px] h-auto drop-shadow-md">
              {/* Ground shadow */}
              <ellipse cx="160" cy="130" rx="140" ry="8" fill="#E2E8F0" opacity="0.6" />
              {/* Bus Body */}
              <rect x="20" y="30" width="280" height="85" rx="16" fill="#4E0705" />
              {/* Roof Rack / Solar Panel */}
              <rect x="50" y="24" width="220" height="7" rx="3" fill="#BD5705" />
              {/* Front windshield */}
              <path d="M 260 40 L 290 55 L 290 85 L 260 85 Z" fill="#9BE7FA" opacity="0.8" />
              {/* Windows with book silhouettes */}
              {[40, 85, 130, 175, 220].map((x, idx) => (
                <rect key={idx} x={x} y="42" width="36" height="38" rx="6" fill="#FFFDF9" opacity="0.9" />
              ))}
              {/* Books inside windows */}
              <rect x="46" y="55" width="8" height="20" rx="1" fill="#BD5705" />
              <rect x="56" y="52" width="8" height="23" rx="1" fill="#ED9040" />
              <rect x="92" y="54" width="8" height="21" rx="1" fill="#4E0705" />
              <rect x="136" y="50" width="8" height="25" rx="1" fill="#BD5705" />
              <rect x="182" y="56" width="8" height="19" rx="1" fill="#FFC270" />
              <rect x="226" y="52" width="8" height="23" rx="1" fill="#ED9040" />
              {/* Yellow branding stripe */}
              <rect x="20" y="86" width="280" height="8" fill="#FFC270" />
              {/* Side Text */}
              <text x="110" y="105" fill="#FFFDF9" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                TỦ SÁCH XE BUÝT LƯU ĐỘNG
              </text>
              {/* Headlights */}
              <circle cx="295" cy="95" r="5" fill="#FFC270" />
              <circle cx="295" cy="95" r="2" fill="#FFFFFF" />
              {/* Wheels */}
              <circle cx="75" cy="115" r="18" fill="#1E293B" />
              <circle cx="75" cy="115" r="8" fill="#94A3B8" />
              <circle cx="245" cy="115" r="18" fill="#1E293B" />
              <circle cx="245" cy="115" r="8" fill="#94A3B8" />
            </svg>
          </div>
        );

      case 'ui-dashboard':
        return (
          <div className="w-full h-full bg-slate-900 p-3.5 flex flex-col justify-between text-white font-sans text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 font-bold text-[#FFC270]">
                <Monitor className="w-3.5 h-3.5 text-[#BD5705]" />
                Librarian Dispatch Console
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px]">
                O(1) CACHE ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-1">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-[9px] text-slate-400 uppercase font-mono">Tổng Kho Sách</span>
                <div className="text-sm font-black text-[#FFC270]">1,280</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-[9px] text-slate-400 uppercase font-mono">Xe Đang Chạy</span>
                <div className="text-sm font-black text-cyan-400">4 / 4 Tuyến</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <span className="text-[9px] text-slate-400 uppercase font-mono">Đang Mượn</span>
                <div className="text-sm font-black text-emerald-400">342 Đơn</div>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/40 space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Bus 01: Linh Đàm</span>
                <span className="text-emerald-400">Đang phục vụ • 92% pin</span>
              </div>
              <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                <div className="bg-[#BD5705] h-full w-3/4" />
              </div>
            </div>
          </div>
        );

      case 'ui-mobile':
        return (
          <div className="w-full h-full bg-[#FAF4EC] dark:bg-slate-950 p-3 flex items-center justify-center">
            <div className="w-48 bg-white dark:bg-slate-900 border-2 border-stone-800 dark:border-stone-700 rounded-2xl p-2.5 shadow-md flex flex-col gap-2">
              {/* Phone Status Bar */}
              <div className="flex justify-between items-center text-[8px] text-stone-500 font-mono">
                <span>09:41</span>
                <div className="flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5" />
                  <Battery className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Digital Library Pass Card */}
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#4E0705] to-[#BD5705] text-white space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#FFC270]">Thẻ Độc Giả Số</span>
                  <QrCode className="w-4 h-4 text-white" />
                </div>
                <div className="text-[10px] font-black">Nguyễn Văn An</div>
                <div className="text-[8px] font-mono opacity-80">ID: LIB-BUS-2026-88</div>
              </div>

              {/* Quick Book Reserve Button */}
              <div className="p-1.5 rounded-lg bg-[#FFFDF9] dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-center justify-between">
                <div className="truncate">
                  <div className="text-[9px] font-bold text-stone-900 dark:text-white truncate">Bản Cực (Origin)</div>
                  <div className="text-[7px] text-[#BD5705]">Xe 01 • Còn 2 cuốn</div>
                </div>
                <button className="px-2 py-0.5 rounded bg-[#BD5705] text-white text-[8px] font-bold">
                  Đặt chỗ
                </button>
              </div>
            </div>
          </div>
        );

      case 'ui-design-all':
        return (
          <div className="w-full h-full bg-[#FFFDF9] dark:bg-slate-900 p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center pb-2 border-b border-amber-200 dark:border-slate-800">
              <span className="text-xs font-serif font-black text-[#4E0705] dark:text-[#FFC270]">
                Neo-Bakery 6-Tone Palette System
              </span>
              <span className="text-[9px] font-mono text-stone-400">12-COL GRID</span>
            </div>

            {/* Color Swatches */}
            <div className="grid grid-cols-6 gap-1.5 my-2">
              {[
                { hex: '#4E0705', name: 'Espresso' },
                { hex: '#BD5705', name: 'Caramel' },
                { hex: '#ED9040', name: 'Honey' },
                { hex: '#FFC270', name: 'Butter' },
                { hex: '#FAF4EC', name: 'Cream' },
                { hex: '#FFFDF9', name: 'Milk' }
              ].map((c, idx) => (
                <div key={idx} className="space-y-1 text-center">
                  <div className="h-9 rounded-md border border-stone-200 shadow-2xs" style={{ backgroundColor: c.hex }} />
                  <span className="text-[7px] font-mono font-bold text-stone-600 dark:text-stone-300 block">{c.hex}</span>
                </div>
              ))}
            </div>

            {/* 12-Column Blueprint Preview */}
            <div className="grid grid-cols-12 gap-1 p-1.5 rounded-lg bg-stone-100 dark:bg-slate-800">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="h-6 rounded bg-[#BD5705]/20 border border-[#BD5705]/40 flex items-center justify-center text-[7px] font-mono text-[#BD5705] font-bold">
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
        );

      case 'wireframe-all':
        return (
          <div className="w-full h-full bg-[#F8FAFC] dark:bg-slate-950 p-4 flex flex-col justify-between font-mono">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-slate-500" />
                Structural Wireframe Blueprint
              </span>
              <span className="text-[9px] text-slate-400">LOW-FIDELITY</span>
            </div>

            {/* Wireframe Mockup Canvas */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center">
                <div className="w-16 h-3 rounded-xs bg-slate-400" />
                <div className="flex gap-1">
                  <div className="w-8 h-3 rounded-xs bg-slate-300" />
                  <div className="w-8 h-3 rounded-xs bg-slate-300" />
                  <div className="w-10 h-3 rounded-xs bg-slate-500" />
                </div>
              </div>

              <div className="h-10 rounded bg-slate-100 border border-dashed border-slate-300 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center text-[9px] text-slate-400">
                HERO SECTION (Lưới 12 cột chuẩn tỷ lệ)
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div className="h-8 rounded bg-slate-200/80 dark:bg-slate-800" />
                <div className="h-8 rounded bg-slate-200/80 dark:bg-slate-800" />
                <div className="h-8 rounded bg-slate-200/80 dark:bg-slate-800" />
              </div>
            </div>

            <div className="flex justify-between text-[9px] text-slate-400 pt-1">
              <span>Hệ thống lưới: 12 Column Modular</span>
              <span className="text-slate-600 dark:text-slate-300 font-bold">Quy chuẩn Figma/PDF</span>
            </div>
          </div>
        );

      case 'reference-template':
      default:
        return (
          <div className="w-full h-full bg-slate-100 dark:bg-slate-950 flex flex-col justify-between p-3 relative overflow-hidden">
            {/* Split Screen Mockup */}
            <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 flex">
              {/* Left: Wireframe */}
              <div className="w-1/2 bg-white dark:bg-slate-900 p-2.5 border-r border-slate-300 dark:border-slate-700 space-y-1.5">
                <span className="text-[8px] font-mono font-bold uppercase text-slate-400 block">Wireframe</span>
                <div className="w-12 h-2 rounded-xs bg-slate-300" />
                <div className="w-full h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[7px] text-slate-400 font-mono">
                  [X] Khung Xám
                </div>
                <div className="w-full h-2 rounded-xs bg-slate-200" />
              </div>

              {/* Right: Branded UI */}
              <div className="w-1/2 bg-[#FFFDF9] dark:bg-slate-950 p-2.5 space-y-1.5">
                <span className="text-[8px] font-mono font-bold uppercase text-[#BD5705] block">UI Design</span>
                <div className="w-14 h-2 rounded-xs bg-[#4E0705]" />
                <div className="w-full h-8 rounded bg-gradient-to-r from-[#BD5705] to-[#ED9040] text-white flex items-center justify-center text-[7px] font-bold">
                  Giao Diện Chuẩn
                </div>
                <div className="w-10 h-2 rounded-xs bg-[#FFC270]" />
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] text-stone-500 mt-2 font-mono">
              <span>Chuẩn so sánh: 1-to-1 Pixel Matched</span>
              <span className="text-[#BD5705] font-bold">Bản mẫu tham khảo</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group dark:bg-slate-900 dark:border-slate-800">
      {/* Visual Canvas */}
      <div 
        className="relative h-56 w-full overflow-hidden cursor-pointer"
        onClick={onOpenZoom}
      >
        {renderVisual()}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
          {tag}
        </div>
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-950/90 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-bold shadow-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Code Interactive</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {/* Content Meta */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#0D7287] dark:group-hover:text-[#9BE7FA] transition-colors">
            {isEn ? titleEn : titleVi}
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed dark:text-slate-400">
            {isEn ? descEn : descVi}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] text-slate-400">
            #{id}
          </span>
          <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            {isEn ? 'View Code Visual' : 'Xem Mô Phỏng'} →
          </span>
        </div>
      </div>
    </div>
  );
}
