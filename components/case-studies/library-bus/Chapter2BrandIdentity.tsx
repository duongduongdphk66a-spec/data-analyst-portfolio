'use client';

import React, { useState } from 'react';
import { 
  Bus, Palette, Type, MousePointer, 
  BookOpen, Clock, Bell, User, MapPin, Search, Star, Calendar, BarChart3, Plus, Check, Copy, CheckCheck
} from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

export interface Chapter2BrandIdentityProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

const COLOR_SWATCHES = [
  { nameVi: 'Cam chủ đạo', nameEn: 'Primary Orange', hex: '#FA6933', rgb: '250, 105, 51', textWhite: true },
  { nameVi: 'Chàm thương hiệu', nameEn: 'Brand Indigo', hex: '#323987', rgb: '50, 57, 135', textWhite: true },
  { nameVi: 'Đen than / Chữ', nameEn: 'Charcoal / Body', hex: '#2D2F34', rgb: '45, 47, 52', textWhite: true },
  { nameVi: 'Xám viền / Nền', nameEn: 'Border / Light', hex: '#D3D3D3', rgb: '211, 211, 211', textWhite: false }
];

export function Chapter2BrandIdentity({ 
  isEn = false, 
  onCopyDeepLink = () => {} 
}: Chapter2BrandIdentityProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <section id="chapter-2-brand" className="space-y-8 scroll-mt-36">
      {/* 02. SECTION HEADER */}
      <SectionHeader
        variant="chapter"
        id="sec-logo"
        chapter="CHAPTER 02"
        subtitle={isEn ? 'Brand identity, typography, color palette & UI components' : 'Nhận diện thương hiệu, kiểu chữ, bảng màu & thư viện thành phần UI'}
        badge="02"
        title={isEn ? '02. Logo & UI Components' : '02. Logo & Thành Phần Giao Diện'}
        onCopy={onCopyDeepLink}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 2.1 CẤU TRÚC LƯỚI LOGO (CONSTRUCTION GRID SVG) */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FA6933] flex items-center gap-1.5">
              <Bus className="w-4 h-4" />
              <span>{isEn ? '2.1 Logo Construction Grid' : '2.1 Cấu trúc Lưới Logo'}</span>
            </span>
            <p className="text-xs text-slate-500">{isEn ? '6.6X × 4X proportion & 1.5X safe distance' : 'Tỷ lệ 6.6X × 4X | Vùng an toàn 1.5X'}</p>
          </div>

          {/* SVG Construction Grid */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-[#FA6933]/50 relative flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
            {/* Safe distance boundary markers */}
            <div className="absolute inset-2 border border-dashed border-sky-400/40 rounded-xl pointer-events-none" />
            <span className="absolute top-3 left-3 text-[10px] font-mono text-sky-500 font-bold">1.5X Safe</span>

            {/* Logo Center */}
            <div className="flex items-center gap-2 z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#FA6933] text-white flex items-center justify-center shadow-md">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-baseline font-black tracking-tight text-2xl sm:text-3xl">
                <span className="text-[#FA6933]">Library</span>
                <span className="text-[#323987] dark:text-[#9BE7FA]">Bus</span>
              </div>
            </div>

            <div className="mt-3 text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 text-center">
              Tỷ lệ: 6.6X × 4X | Min: 42.5px
            </div>
          </div>
        </div>

        {/* 2.2 BẢNG MÀU CHỦ ĐẠO & BỔ TRỢ */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#323987] dark:text-[#9BE7FA] flex items-center gap-1.5">
              <Palette className="w-4 h-4" />
              <span>{isEn ? '2.2 Color Swatch Bar' : '2.2 Bảng màu (HEX & RGB)'}</span>
            </span>
            <p className="text-xs text-slate-500">{isEn ? 'Core tones from guidelines PDF' : '4 mã màu chính từ tài liệu PDF'}</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {COLOR_SWATCHES.map((col) => (
              <button
                key={col.hex}
                onClick={() => handleCopyHex(col.hex)}
                className="p-3 rounded-2xl text-left transition transform hover:scale-[1.02] cursor-pointer shadow-xs border border-slate-200/50 relative overflow-hidden"
                style={{ backgroundColor: col.hex, color: col.textWhite ? '#FFFFFF' : '#000000' }}
                title={isEn ? `Copy ${col.hex}` : `Sao chép mã ${col.hex}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold truncate">{isEn ? col.nameEn : col.nameVi}</span>
                  {copiedHex === col.hex ? (
                    <CheckCheck className="w-3.5 h-3.5 text-white shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60 shrink-0" />
                  )}
                </div>
                <div className="mt-2 font-mono text-xs font-black">{col.hex}</div>
                <div className="text-[10px] opacity-80 font-mono">RGB({col.rgb})</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2.2 TYPOGRAPHY & BUTTON STATES MATRIX */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Type className="w-4 h-4" />
              <span>{isEn ? '2.2 Type Scale & UI States' : '2.2 Phông chữ & Nút bấm'}</span>
            </span>
            <p className="text-xs text-slate-500">Lora + Outfit | 3 trạng thái nút</p>
          </div>

          <div className="space-y-3 pt-1">
            {/* Visual Type Scale Pills */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Headings:</span>
                <span className="font-mono font-bold text-[#FA6933]">72pt / 58pt / 46pt / 33pt</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Body:</span>
                <span className="font-mono font-bold text-[#323987] dark:text-[#9BE7FA]">16pt / 14pt</span>
              </div>
            </div>

            {/* Interactive Button States */}
            <div className="flex flex-wrap gap-2 items-center">
              <button 
                type="button"
                className="px-4 py-2 rounded-xl bg-[#FA6933] text-white text-xs font-bold shadow-xs hover:brightness-105 cursor-pointer min-h-[40px] flex items-center"
              >
                Default
              </button>
              <button 
                type="button"
                className="px-4 py-2 rounded-xl bg-[#323987] text-white text-xs font-bold shadow-xs hover:brightness-110 cursor-pointer min-h-[40px] flex items-center"
              >
                Hover
              </button>
              <button 
                type="button"
                disabled 
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 text-xs font-bold cursor-not-allowed min-h-[40px] flex items-center"
              >
                Disabled
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2.2.4 ICON MATRIX (24x24px Lucide SVG Icons) */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-[#FA6933]" />
            <span>{isEn ? '2.2.4 Single-Line Icon Matrix (24×24px)' : '2.2.4 Bộ biểu tượng nét đơn chuẩn (24×24px)'}</span>
          </span>
          <span className="text-xs font-mono text-slate-400">12 Icons • SVG</span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#FA6933]" title="Bus"><Bus className="w-6 h-6" /></div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#323987] dark:text-[#9BE7FA]" title="Book"><BookOpen className="w-6 h-6" /></div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300" title="Clock"><Clock className="w-6 h-6" /></div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-amber-500" title="Bell"><Bell className="w-6 h-6" /></div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300" title="User"><User className="w-6 h-6" /></div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-emerald-600" title="MapPin"><MapPin className="w-6 h-6" /></div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300" title="Search"><Search className="w-6 h-6" /></div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-amber-500" title="Star"><Star className="w-6 h-6" /></div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300" title="Calendar"><Calendar className="w-6 h-6" /></div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[#323987] dark:text-[#9BE7FA]" title="Analytics"><BarChart3 className="w-6 h-6" /></div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300" title="Plus"><Plus className="w-6 h-6" /></div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-emerald-600" title="Check"><Check className="w-6 h-6" /></div>
        </div>
      </div>
    </section>
  );
}

export default Chapter2BrandIdentity;
