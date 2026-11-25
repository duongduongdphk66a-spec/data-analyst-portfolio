'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bus,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  Grid,
  Palette,
  Presentation,
  Type,
} from 'lucide-react';

export interface Chapter2BrandIdentityProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

const COLOR_SWATCHES = [
  { nameVi: 'Molasses (Mật mía)', nameEn: 'Molasses Ink', hex: '#4E0705', rgb: '78, 7, 5', textWhite: true },
  { nameVi: 'Well-browned (Nướng già)', nameEn: 'Roasted Chestnut', hex: '#812203', rgb: '129, 34, 3', textWhite: true },
  { nameVi: 'Roast (Caramel / CTA)', nameEn: 'Caramel Bronze (CTA)', hex: '#BD5705', rgb: '189, 87, 5', textWhite: true },
  { nameVi: 'Toasty (Hổ phách)', nameEn: 'Toasted Amber', hex: '#ED9040', rgb: '237, 144, 64', textWhite: false },
  { nameVi: 'Greasey (Bơ mật ong)', nameEn: 'Honey Butter', hex: '#FFC270', rgb: '255, 194, 112', textWhite: false },
  { nameVi: 'Butter (Vàng bơ)', nameEn: 'Pastry Yellow', hex: '#FDE971', rgb: '253, 233, 113', textWhite: false },
];

export function Chapter2BrandIdentity({
  isEn = false,
}: Chapter2BrandIdentityProps) {
  const [showDesignSystem, setShowDesignSystem] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <section id="chapter-2-brand" className="scroll-mt-28">
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowDesignSystem((v) => !v)}
            className="flex-1 min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0D7287] flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span>
                {showDesignSystem
                  ? isEn
                    ? 'Collapse Design System (Neo-Bakery 6-Tone Palette, Lora + Outfit, 12-Col Grid & GSAP 60 FPS)'
                    : 'Thu gọn Hệ thống Thiết kế (Bảng màu Neo-Bakery 6-Tone, Lora + Outfit, Lưới 12 cột & GSAP 60 FPS)'
                  : isEn
                  ? 'View Design System Specification (Neo-Bakery 6-Tone Palette, Lora + Outfit, 12-Column Grid & GSAP)'
                  : 'Xem Hệ thống Thiết kế (Bảng màu Neo-Bakery 6-Tone, Lora + Outfit, Hệ lưới 12 cột & GSAP 60 FPS)'}
              </span>
            </span>
            {showDesignSystem ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <Link
            href="/projects/library-bus/presentation"
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#C8EEF7] dark:border-slate-700 bg-[#C8EEF7]/30 dark:bg-slate-900 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] hover:bg-[#9BE7FA]/40 inline-flex items-center gap-2 shrink-0"
          >
            <Presentation className="w-4 h-4" />
            <span>{isEn ? '30-Slide UX/UI Deck' : 'Bản trình chiếu 30 Slide'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {showDesignSystem && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs tabular-nums">
            {/* 1. Neo-Bakery 6-Tone Palette */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Palette className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Neo-Bakery 6-Tone Palette' : 'Bảng màu Neo-Bakery 6-Tone'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_SWATCHES.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => handleCopyHex(col.hex)}
                    className="p-2 rounded-lg text-left border border-black/10 cursor-pointer"
                    style={{
                      backgroundColor: col.hex,
                      color: col.textWhite ? '#FFFFFF' : '#3A0806',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold truncate text-[11px]">
                        {isEn ? col.nameEn : col.nameVi}
                      </span>
                      {copiedHex === col.hex ? (
                        <CheckCheck className="w-3 h-3 shrink-0" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-70 shrink-0" />
                      )}
                    </div>
                    <div className="font-black text-[11px] mt-0.5">{col.hex}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Typography Lora + Outfit & Logo 6.6X x 4X */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Type className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Typography & Logo Safe Zone' : 'Phông chữ Lora + Outfit & Tỷ lệ Logo'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#BD5705] text-white flex items-center justify-center">
                    <Bus className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-black text-lg text-[#4E0705] dark:text-[#FDE971]">
                    Library Bus (6.6X × 4X • Safe 1.5X)
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Headings (Lora Serif):</strong> 72pt / 58pt / 46pt / 33pt
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Body &amp; UI (Outfit Sans):</strong> 16pt / 14pt • WCAG AA ≥ 4.5:1
                </p>
              </div>
            </div>

            {/* 3. 12-Column Grid & GSAP 60 FPS Motion */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Grid className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? '12-Column Grid & GSAP 60 FPS' : 'Hệ lưới 12 cột & Chuyển động GSAP'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 space-y-1.5 text-slate-600 dark:text-slate-300">
                <p>
                  <strong>Desktop 1440px:</strong> 12 cột (Width <code>78px</code> • Gutter <code>24px</code> • Margin <code>360px</code> trên khung 1920px).
                </p>
                <p>
                  <strong>Mobile 390px:</strong> 1 cột xếp dọc tối ưu vùng chạm <code>≥ 44×44px</code>.
                </p>
                <p>
                  <strong>Motion (DESIGN.md):</strong> GSAP 60 FPS hardware-accelerated (<code>transform</code>, <code>opacity</code>) + Glassmorphism navbar.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Chapter2BrandIdentity;
