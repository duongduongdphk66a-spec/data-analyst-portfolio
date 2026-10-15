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
          <div className="relative w-full h-full bg-gradient-to-br from-[#FAFDFE] to-[#C8EEF7]/40 flex items-center justify-center p-4 overflow-hidden dark:from-slate-900 dark:to-slate-950">
            {/* Ambient Background Lights */}
            <div className="absolute top-2 right-4 flex items-center gap-1 text-xs font-mono text-[#0D7287] dark:text-[#9BE7FA] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FFD14C] animate-pulse" />
              <span>FLEET ON-DUTY (GPS ACTIVE)</span>
            </div>

            {/* Vector Library Bus SVG */}
            <svg viewBox="0 0 320 140" className="w-full max-w-[280px] h-auto drop-shadow-md">
              {/* Ground shadow */}
              <ellipse cx="160" cy="130" rx="140" ry="8" fill="#E2E8F0" opacity="0.6" />
              {/* Bus Body - Deep Teal Shade of #9BE7FA */}
              <rect x="20" y="30" width="280" height="85" rx="16" fill="#0D7287" />
              {/* Roof Rack / Solar Panel */}
              <rect x="50" y="24" width="220" height="7" rx="3" fill="#074553" />
              {/* Front windshield */}
              <path d="M 260 40 L 290 55 L 290 85 L 260 85 Z" fill="#9BE7FA" opacity="0.9" />
              {/* Windows with book silhouettes */}
              {[40, 85, 130, 175, 220].map((x, idx) => (
                <rect key={idx} x={x} y="42" width="36" height="38" rx="6" fill="#C8EEF7" opacity="0.95" />
              ))}
              {/* Books inside windows */}
              <rect x="46" y="55" width="8" height="20" rx="1" fill="#FFD14C" />
              <rect x="56" y="52" width="8" height="23" rx="1" fill="#FFE485" />
              <rect x="92" y="54" width="8" height="21" rx="1" fill="#074553" />
              <rect x="136" y="50" width="8" height="25" rx="1" fill="#FFD14C" />
              <rect x="182" y="56" width="8" height="19" rx="1" fill="#9BE7FA" />
              <rect x="226" y="52" width="8" height="23" rx="1" fill="#FFE485" />
              {/* Golden Yellow branding stripe */}
              <rect x="20" y="86" width="280" height="8" fill="#FFD14C" />
              {/* Side Text */}
              <text x="110" y="105" fill="#FAFDFE" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                TỦ SÁCH XE BUÝT LƯU ĐỘNG
              </text>
              {/* Headlights */}
              <circle cx="295" cy="95" r="5" fill="#FFD14C" />
              <circle cx="295" cy="95" r="2" fill="#FFFFFF" />
              {/* Wheels */}
              <circle cx="75" cy="115" r="18" fill="#0B171D" />
              <circle cx="75" cy="115" r="8" fill="#C8EEF7" />
              <circle cx="245" cy="115" r="18" fill="#0B171D" />
              <circle cx="245" cy="115" r="8" fill="#C8EEF7" />
            </svg>
          </div>
        );

      case 'ui-dashboard':
        return (
          <div className="w-full h-full bg-slate-900 p-3.5 flex flex-col justify-between text-white font-sans text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 font-bold text-[#FFE485]">
                <Monitor className="w-3.5 h-3.5 text-[#9BE7FA]" />
                Librarian Dispatch Console
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#9BE7FA]/20 text-[#9BE7FA] font-mono text-xs font-bold">
                O(1) CACHE ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-1">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-[#9BE7FA]/20">
                <span className="text-xs text-slate-400 uppercase font-mono">Tổng Kho Sách</span>
                <div className="text-sm font-black text-[#FFD14C]">1,280</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-[#9BE7FA]/20">
                <span className="text-xs text-slate-400 uppercase font-mono">Xe Đang Chạy</span>
                <div className="text-sm font-black text-[#9BE7FA]">4 / 4 Tuyến</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-[#9BE7FA]/20">
                <span className="text-xs text-slate-400 uppercase font-mono">Đang Mượn</span>
                <div className="text-sm font-black text-[#FFE485]">342 Đơn</div>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/40 space-y-1">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Bus 01: Linh Đàm</span>
                <span className="text-[#9BE7FA] font-bold">Đang phục vụ • 92% pin</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#FFD14C] h-full w-3/4" />
              </div>
            </div>
          </div>
        );

      case 'ui-mobile':
        return (
          <div className="w-full h-full bg-[#F0F9FB] dark:bg-slate-950 p-3 flex items-center justify-center">
            <div className="w-48 bg-white dark:bg-slate-900 border-2 border-[#0D7287]/40 dark:border-slate-700 rounded-2xl p-2.5 shadow-md flex flex-col gap-2">
              {/* Phone Status Bar */}
              <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                <span>09:41</span>
                <div className="flex items-center gap-1 text-[#0D7287] dark:text-[#9BE7FA]">
                  <Wifi className="w-2.5 h-2.5" />
                  <Battery className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Digital Library Pass Card */}
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#074553] to-[#0D7287] text-white space-y-1 shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#FFD14C]">Thẻ Độc Giả Số</span>
                  <QrCode className="w-4 h-4 text-[#9BE7FA]" />
                </div>
                <div className="text-xs font-black text-white">Nguyễn Văn An</div>
                <div className="text-xs font-mono text-[#C8EEF7] opacity-90">ID: LIB-BUS-2026-88</div>
              </div>

              {/* Quick Book Reserve Button */}
              <div className="p-1.5 rounded-lg bg-ground dark:bg-slate-800 border border-[#9BE7FA]/50 dark:border-slate-700 flex items-center justify-between">
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Bản Cực (Origin)</div>
                  <div className="text-xs text-[#0D7287] dark:text-[#9BE7FA] font-semibold">Xe 01 • Còn 2 cuốn</div>
                </div>
                <button className="px-2 py-0.5 rounded bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-extrabold shadow-2xs">
                  Đặt chỗ
                </button>
              </div>
            </div>
          </div>
        );

      case 'ui-design-all':
        return (
          <div className="w-full h-full bg-ground dark:bg-slate-900 p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center pb-2 border-b border-[#C8EEF7] dark:border-slate-800">
              <span className="text-xs font-black text-[#0D7287] dark:text-[#9BE7FA]">
                Hệ Màu Nhận Diện Chuẩn (4-Color Spectrum)
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">12-COL GRID</span>
            </div>

            {/* Color Swatches */}
            <div className="grid grid-cols-6 gap-1.5 my-2">
              {[
                { hex: '#9BE7FA', name: 'Sky Blue' },
                { hex: '#C8EEF7', name: 'Ice Blue' },
                { hex: '#FFE485', name: 'Cream' },
                { hex: '#FFD14C', name: 'Gold CTA' },
                { hex: '#0D7287', name: 'Deep Teal' },
                { hex: '#074553', name: 'Midnight' }
              ].map((c, idx) => (
                <div key={idx} className="space-y-1 text-center">
                  <div className="h-9 rounded-md border border-slate-200 shadow-2xs" style={{ backgroundColor: c.hex }} />
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block">{c.hex}</span>
                </div>
              ))}
            </div>

            {/* 12-Column Blueprint Preview */}
            <div className="grid grid-cols-12 gap-1 p-1.5 rounded-lg bg-[#C8EEF7]/30 dark:bg-slate-800 border border-[#9BE7FA]/40">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="h-6 rounded bg-[#9BE7FA]/30 border border-[#9BE7FA]/60 flex items-center justify-center text-xs font-mono text-[#0D7287] dark:text-[#9BE7FA] font-bold">
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
        );

      case 'wireframe-all':
        return (
          <div className="w-full h-full bg-ground dark:bg-slate-950 p-4 flex flex-col justify-between font-mono">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                Structural Wireframe Blueprint
              </span>
              <span className="text-xs text-slate-400 font-bold">LOW-FIDELITY</span>
            </div>

            {/* Wireframe Mockup Canvas */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center">
                <div className="w-16 h-3 rounded-xs bg-[#0D7287]/40" />
                <div className="flex gap-1">
                  <div className="w-8 h-3 rounded-xs bg-slate-300 dark:bg-slate-700" />
                  <div className="w-8 h-3 rounded-xs bg-slate-300 dark:bg-slate-700" />
                  <div className="w-10 h-3 rounded-xs bg-[#FFD14C]" />
                </div>
              </div>

              <div className="h-10 rounded bg-[#C8EEF7]/20 border border-dashed border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center text-xs text-[#0D7287] dark:text-[#9BE7FA] font-sans font-bold">
                HERO SECTION (Lưới 12 cột chuẩn tỷ lệ)
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div className="h-8 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                <div className="h-8 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                <div className="h-8 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              </div>
            </div>

            <div className="flex justify-between text-xs text-slate-400 pt-1">
              <span>Hệ thống lưới: 12 Column Modular</span>
              <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold">Quy chuẩn Figma/PDF</span>
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
                <span className="text-xs font-mono font-bold uppercase text-slate-400 block">Wireframe</span>
                <div className="w-12 h-2 rounded-xs bg-slate-300 dark:bg-slate-700" />
                <div className="w-full h-8 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400 font-mono">
                  [X] Khung Xám
                </div>
                <div className="w-full h-2 rounded-xs bg-slate-200 dark:bg-slate-700" />
              </div>

              {/* Right: Branded UI */}
              <div className="w-1/2 bg-ground dark:bg-slate-950 p-2.5 space-y-1.5">
                <span className="text-xs font-mono font-bold uppercase text-[#0D7287] dark:text-[#9BE7FA] block">UI Design</span>
                <div className="w-14 h-2 rounded-xs bg-[#0D7287]" />
                <div className="w-full h-8 rounded bg-gradient-to-r from-[#0D7287] to-[#9BE7FA] text-slate-950 flex items-center justify-center text-xs font-black">
                  Giao Diện Chuẩn
                </div>
                <div className="w-10 h-2 rounded-xs bg-[#FFD14C]" />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-mono">
              <span>Chuẩn so sánh: 1-to-1 Pixel Matched</span>
              <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold">Bản mẫu tham khảo</span>
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
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-950/90 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold shadow-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
