'use client';

import React from 'react';
import { 
  Bus, Type, Palette, MousePointer, Grid, BookOpen, 
  Search, MapPin, Calendar, QrCode 
} from 'lucide-react';
import { BRAND_IDENTITY_DATA } from '@/app/data/libraryBusData';
import SectionHeader from '@/components/ui/SectionHeader';

import { useLanguage } from '@/app/context/LanguageContext';

export interface Chapter2BrandIdentityProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

export function Chapter2BrandIdentity({ 
  isEn: propIsEn, 
  onCopyDeepLink = () => {} 
}: Chapter2BrandIdentityProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  return (
    <>
      {/* 2.1 HỆ THỐNG LOGO */}
      <section id="sec-logo" className="space-y-6 scroll-mt-36">
        <SectionHeader
          variant="chapter"
          id="sec-logo"
          chapter="CHAPTER 02"
          subtitle={isEn ? BRAND_IDENTITY_DATA.titleEn : BRAND_IDENTITY_DATA.titleVi}
          badge="2.1"
          title={isEn ? 'Logo Idea, Grid Structure & Safe Distance' : 'Hệ Thống Logo, Tỉ Lệ Lưới 6.6X & Khoảng Cách An Toàn'}
          onCopy={onCopyDeepLink}
        />

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Logo Concept & Visual Grid Diagram */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
                2.1.1 Logo Idea & Meaning
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Biểu Tượng Cánh Chim Tri Thức & Xe Bus Lưu Động
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                {BRAND_IDENTITY_DATA.logo.ideaVi}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                {BRAND_IDENTITY_DATA.logo.meaningVi}
              </p>
            </div>

            {/* Visual Logo Render Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#FAF5EF] to-[#FAF4EC] border-2 border-dashed border-[#FFC270] flex flex-col items-center justify-center gap-3 dark:bg-slate-800 dark:border-slate-700">
              <div className="w-20 h-20 rounded-3xl bg-[#4E0705] text-white flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Bus className="w-10 h-10 text-[#FFC270]" />
              </div>
              <div className="text-center">
                <div className="text-lg font-black tracking-tight text-slate-900 dark:text-white">LIBRARY BUS</div>
                <div className="text-xs uppercase font-mono tracking-widest text-[#BD5705] dark:text-[#FFC270]">Transit Wisdom · Tri Thức Lưu Động</div>
              </div>
            </div>
          </div>

          {/* Specifications: Structure Ratio, Safe Distance, Min Size */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <span className="text-xs font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
              2.1.2 Quy chuẩn kích thước & Khoảng cách an toàn
            </span>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Tỉ lệ cấu trúc logo:</span>
                  <span className="font-mono font-black text-[#0D7287] dark:text-[#9BE7FA]">6.6X × 4X</span>
                </div>
                <p className="text-slate-500 text-[11px]">{BRAND_IDENTITY_DATA.logo.structureRatio}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Khoảng cách an toàn (Safe Distance):</span>
                  <span className="font-mono font-black text-emerald-600">1.5X & 2X</span>
                </div>
                <p className="text-slate-500 text-[11px]">{BRAND_IDENTITY_DATA.logo.safeDistance}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Kích thước hiển thị tối thiểu:</span>
                  <span className="font-mono font-black text-amber-600">56.7px / 42.5px</span>
                </div>
                <p className="text-slate-500 text-[11px]">{BRAND_IDENTITY_DATA.logo.minimumSize}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF4EC] border border-[#FFC270]/60 text-xs text-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                <b>Phông chữ tiêu chuẩn:</b> {BRAND_IDENTITY_DATA.logo.fontName}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.2 THÀNH PHẦN GIAO DIỆN (UI COMPONENTS) */}
      <section id="sec-components" className="space-y-8 scroll-mt-36">
        <SectionHeader
          variant="chapter"
          id="sec-components"
          chapter="CHAPTER 02"
          subtitle={isEn ? 'Typography, Color Palettes & UI Elements' : 'Typography, Bảng Màu & Thư Viện UI'}
          badge="2.2"
          title={isEn ? 'UI Components Specification' : 'Quy Chuẩn Thành Phần Giao Diện (UI Components)'}
          onCopy={onCopyDeepLink}
        />

        {/* Typography Table */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <Type className="w-4 h-4" />
            <span>{isEn ? '2.2.1 Typography System (Outfit & Inter)' : '2.2.1 Hệ thống kiểu chữ (Typography Hierarchy)'}</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0F9FB] text-slate-800 font-bold uppercase border-b border-[#D2EDF6] dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="p-3">Thẻ Phân Cấp</th>
                  <th className="p-3">Font Size</th>
                  <th className="p-3">Letter Spacing</th>
                  <th className="p-3">Minh Họa Hiển Thị</th>
                  <th className="p-3">Mục Đích Áp Dụng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {BRAND_IDENTITY_DATA.typography.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-[#0D7287] whitespace-nowrap dark:text-[#9BE7FA]">{item.tag}</td>
                    <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{item.size}</td>
                    <td className="p-3 font-mono text-slate-500">{item.letterSpacing}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{item.example}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{item.roleVi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Color Palette (Neo-Bakery Warm Paper Tokens) */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#BD5705] dark:text-[#FFC270] flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span>{isEn ? '2.2.2 Library Bus Color System (Neo-Bakery Warm Paper Tokens)' : '2.2.2 Bảng màu chuẩn giao diện Website Thư Viện (Neo-Bakery Warm Paper Tokens)'}</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">tokens.css · 6 tông màu chuẩn nhận diện</span>
          </div>

          {/* Primary Colors */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {isEn ? 'Primary Brand Colors (Core Identity)' : 'Màu chủ đạo (Primary Brand Colors)'}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {BRAND_IDENTITY_DATA.colors.primary.map((col, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
                  <div className="h-16 w-full rounded-2xl shadow-inner border border-black/10" style={{ backgroundColor: col.hex }} />
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm">{isEn ? col.nameEn : col.nameVi}</h4>
                    <div className="flex justify-between font-mono text-xs text-slate-500 mt-1">
                      <span>{col.hex}</span>
                      <span>RGB({col.rgb})</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-2 dark:text-slate-400 leading-relaxed">{isEn ? col.roleEn : col.roleVi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting & Neutral Colors */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {isEn ? 'Supporting & Neutral Tokens (Surface & Badges)' : 'Màu bổ trợ & Giao diện (Supporting & Neutral Tokens)'}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BRAND_IDENTITY_DATA.colors.supporting.map((col, idx) => (
                <div key={idx} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                  <div className="h-12 w-full rounded-xl shadow-inner border border-black/10" style={{ backgroundColor: col.hex }} />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{isEn ? col.nameEn : col.nameVi}</h4>
                    <div className="flex justify-between font-mono text-[11px] text-slate-500 mt-0.5">
                      <span>{col.hex}</span>
                      <span>RGB({col.rgb})</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1.5 dark:text-slate-400 leading-snug">{isEn ? col.roleEn : col.roleVi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive UI Components: Buttons, Inputs & Icons */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Button States */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#BD5705] dark:text-[#FFC270] flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              <span>2.2.3 Trạng thái nút bấm (Button States)</span>
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF5EF]/60 dark:bg-slate-800 space-y-2 border border-slate-100 dark:border-slate-700">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Button (Hành động chính):</div>
                <div className="flex flex-wrap gap-3 items-center">
                  <button className="px-4 py-2 rounded-xl bg-[#BD5705] text-white text-xs font-black shadow-md cursor-pointer hover:bg-[#812203] transition-colors">
                    Default: Đặt mượn
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-[#812203] text-white text-xs font-black shadow-lg ring-2 ring-[#FFC270]">
                    Hover: Đặt mượn
                  </button>
                  <button disabled className="px-4 py-2 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed">
                    Disabled
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF5EF]/60 dark:bg-slate-800 space-y-2 border border-slate-100 dark:border-slate-700">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Secondary & Accent CTA:</div>
                <div className="flex flex-wrap gap-3 items-center">
                  <button className="px-4 py-2 rounded-xl bg-[#FFC270] text-[#4E0705] text-xs font-black shadow-md hover:bg-[#FDE971] transition-colors">
                    Honey CTA: Giữ chỗ ngay
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-white border border-[#BD5705] text-[#BD5705] text-xs font-black hover:bg-[#FAF4EC] transition-colors">
                    Secondary Outline
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Text Inputs & Icon Set */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#BD5705] dark:text-[#FFC270] flex items-center gap-2">
              <Grid className="w-4 h-4" />
              <span>2.2.4 Ô nhập liệu (Text Fill) & Bộ Icon 24px</span>
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Default Input State:</label>
                <input 
                  type="text" 
                  placeholder="Nhập tên sách, tác giả hoặc chủ đề tra cứu..."
                  readOnly
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#BD5705] focus:ring-2 focus:ring-[#FFC270] dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Standard 24px Icons */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-600 mb-2 dark:text-slate-400">Bộ 12 Icon chuẩn kích thước 24×24px:</div>
                <div className="grid grid-cols-6 gap-2 text-center text-[#BD5705] dark:text-[#FFC270]">
                  <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><Bus className="w-5 h-5" /></div>
                  <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><BookOpen className="w-5 h-5" /></div>
                  <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><Search className="w-5 h-5" /></div>
                  <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><MapPin className="w-5 h-5" /></div>
                  <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><Calendar className="w-5 h-5" /></div>
                  <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><QrCode className="w-5 h-5" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Chapter2BrandIdentity;
