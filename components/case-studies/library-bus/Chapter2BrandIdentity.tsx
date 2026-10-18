'use client';

import React from 'react';
import { 
  Bus, Type, Palette, MousePointer, Grid, BookOpen, 
  Search, MapPin, Calendar, Clock, Bell, User, Star, BarChart3, Plus, Check, PanelTop 
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
          title={isEn ? 'Logo Idea, Meaning, Structure & Safe Distance' : 'Logo: Ý Tưởng, Ý Nghĩa, Cấu Trúc & Khoảng Cách An Toàn'}
          onCopy={onCopyDeepLink}
        />

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Logo Concept & Visual Grid Diagram */}
          <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-3.5">
              <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
                2.1.1 Logo Idea & Meaning
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {isEn ? 'Bus Icon + Brand Name' : 'Biểu Tượng Xe Bus + Tên Thương Hiệu'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed dark:text-slate-300">
                {isEn ? BRAND_IDENTITY_DATA.logo.ideaEn : BRAND_IDENTITY_DATA.logo.ideaVi}
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed dark:text-slate-300">
                {isEn ? BRAND_IDENTITY_DATA.logo.meaningEn : BRAND_IDENTITY_DATA.logo.meaningVi}
              </p>
            </div>

            {/* Visual Logo Render Card */}
            <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#FAF5EF] to-[#FAF4EC] border-2 border-dashed border-[#FFC270] flex flex-col items-center justify-center gap-3.5 dark:bg-slate-800 dark:border-slate-700">
              <div className="w-22 h-22 rounded-3xl bg-[#4E0705] text-white flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Bus className="w-11 h-11 text-[#FFC270]" />
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#4E0705] dark:text-white" style={{ fontFamily: "'Lora', Georgia, serif" }}>Library Bus</div>
                <div className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 mt-1">{isEn ? 'Brand name + bus icon' : 'Tên thương hiệu + biểu tượng xe buýt'}</div>
              </div>
            </div>
          </div>

          {/* Specifications: Structure Ratio, Safe Distance, Min Size */}
          <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 dark:bg-slate-900 dark:border-slate-800">
            <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
              {isEn ? '2.1.2 Structure, Safe Distance & Minimum Size' : '2.1.2 Cấu trúc, khoảng cách an toàn & kích thước tối thiểu'}
            </span>

            <div className="space-y-3.5 text-sm sm:text-base">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">{isEn ? 'Logo structure:' : 'Cấu trúc logo:'}</span>
                  <span className="font-mono font-black text-[#0D7287] dark:text-[#9BE7FA]">X = {isEn ? 'icon height' : 'chiều cao biểu tượng'}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{isEn ? BRAND_IDENTITY_DATA.logo.structureEn : BRAND_IDENTITY_DATA.logo.structureVi}</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">{isEn ? 'Safe distance:' : 'Khoảng cách an toàn (Safe Distance):'}</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">1X</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{isEn ? BRAND_IDENTITY_DATA.logo.safeDistanceEn : BRAND_IDENTITY_DATA.logo.safeDistanceVi}</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">{isEn ? 'Minimum size:' : 'Kích thước tối thiểu:'}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{isEn ? BRAND_IDENTITY_DATA.logo.minimumSizeEn : BRAND_IDENTITY_DATA.logo.minimumSizeVi}</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF4EC] border border-[#FFC270]/60 text-sm sm:text-base text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
                <b className="text-slate-900 dark:text-white">{isEn ? 'Typefaces:' : 'Phông chữ:'}</b> {BRAND_IDENTITY_DATA.logo.fontName}
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
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <Type className="w-5 h-5" />
            <span>{isEn ? '2.2.1 Typography (Lora & Outfit)' : '2.2.1 Hệ thống kiểu chữ (Typography: Lora & Outfit)'}</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-[#F0F9FB] text-slate-800 font-bold uppercase border-b border-[#D2EDF6] dark:bg-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                <tr>
                  <th className="p-3.5">{isEn ? 'Name / Tags' : 'Thẻ Phân Cấp'}</th>
                  <th className="p-3.5">Font Size</th>
                  <th className="p-3.5">Letter Spacing</th>
                  <th className="p-3.5">Minh Họa Hiển Thị</th>
                  <th className="p-3.5">Mục Đích Áp Dụng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {BRAND_IDENTITY_DATA.typography.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-mono font-bold text-[#0D7287] whitespace-nowrap dark:text-[#9BE7FA]">{item.tag}</td>
                    <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">{item.size}</td>
                    <td className="p-3.5 font-mono text-slate-500">{item.letterSpacing}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{item.example}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 leading-relaxed">{item.roleVi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Color Palette (Neo-Bakery Warm Paper Tokens) */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#BD5705] dark:text-[#FFC270] flex items-center gap-2">
              <Palette className="w-5 h-5" />
              <span>{isEn ? '2.2.2 Library Bus Color System' : '2.2.2 Bảng màu giao diện website (Color)'}</span>
            </h3>
            <span className="text-xs sm:text-sm font-mono text-slate-500">{isEn ? '6 tones' : '6 tông màu'}</span>
          </div>

          {/* Primary Colors */}
          <div className="space-y-3">
            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {isEn ? 'Primary Brand Colors (Core Identity)' : 'Màu chủ đạo (Primary Brand Colors)'}
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {BRAND_IDENTITY_DATA.colors.primary.map((col, idx) => (
                <div key={idx} className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3.5 dark:bg-slate-900 dark:border-slate-800">
                  <div className="h-18 w-full rounded-2xl shadow-inner border border-black/10" style={{ backgroundColor: col.hex }} />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">{isEn ? col.nameEn : col.nameVi}</h4>
                    <div className="flex justify-between font-mono text-xs sm:text-sm text-slate-500 mt-1">
                      <span className="font-bold">{col.hex}</span>
                      <span>RGB({col.rgb})</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2.5 dark:text-slate-300 leading-relaxed">{isEn ? col.roleEn : col.roleVi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting & Neutral Colors */}
          <div className="space-y-3">
            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {isEn ? 'Supporting Colors' : 'Màu bổ trợ (Supporting Colors)'}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BRAND_IDENTITY_DATA.colors.supporting.map((col, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
                  <div className="h-14 w-full rounded-xl shadow-inner border border-black/10" style={{ backgroundColor: col.hex }} />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{isEn ? col.nameEn : col.nameVi}</h4>
                    <div className="flex justify-between font-mono text-xs text-slate-500 mt-1">
                      <span className="font-bold">{col.hex}</span>
                      <span>RGB({col.rgb})</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 dark:text-slate-300 leading-relaxed">{isEn ? col.roleEn : col.roleVi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive UI Components: Buttons, Inputs & Icons */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Button States */}
          <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#BD5705] dark:text-[#FFC270] flex items-center gap-2">
              <MousePointer className="w-5 h-5" />
              <span>{isEn ? '2.2.3 Button States' : '2.2.3 Trạng thái nút bấm (Button)'}</span>
            </h3>
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EF]/60 dark:bg-slate-800 space-y-3 border border-slate-100 dark:border-slate-700">
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Primary Button (Hành động chính):</div>
                <div className="flex flex-wrap gap-3 items-center">
                  <button className="px-5 py-2.5 rounded-xl bg-[#BD5705] text-white text-sm font-bold shadow-md cursor-pointer hover:bg-[#812203] transition-colors min-h-[42px]">
                    Default: Đặt mượn
                  </button>
                  <button className="px-5 py-2.5 rounded-xl bg-[#812203] text-white text-sm font-bold shadow-lg ring-2 ring-[#FFC270] min-h-[42px]">
                    Hover: Đặt mượn
                  </button>
                  <button disabled className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-400 text-sm font-bold cursor-not-allowed min-h-[42px]">
                    Disabled
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EF]/60 dark:bg-slate-800 space-y-3 border border-slate-100 dark:border-slate-700">
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">Secondary & Accent CTA:</div>
                <div className="flex flex-wrap gap-3 items-center">
                  <button className="px-5 py-2.5 rounded-xl bg-[#FFC270] text-[#4E0705] text-sm font-bold shadow-md hover:bg-[#FDE971] transition-colors min-h-[42px]">
                    Honey CTA: Giữ chỗ ngay
                  </button>
                  <button className="px-5 py-2.5 rounded-xl bg-white border border-[#BD5705] text-[#BD5705] text-sm font-bold hover:bg-[#FAF4EC] transition-colors min-h-[42px]">
                    Secondary Outline
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Text Inputs & Icon Set */}
          <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#BD5705] dark:text-[#FFC270] flex items-center gap-2">
              <Grid className="w-5 h-5" />
              <span>{isEn ? '2.2.4 Text Fill & Icon (24 px)' : '2.2.4 Ô nhập liệu (Text Fill) & Bộ Icon 24px'}</span>
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">Default Input State:</label>
                <input 
                  type="text" 
                  placeholder="Tìm sách hoặc tác giả"
                  readOnly
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#BD5705] focus:ring-2 focus:ring-[#FFC270] dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Standard 24px Icons */}
              <div className="pt-2">
                <div className="text-xs sm:text-sm font-bold text-slate-600 mb-2.5 dark:text-slate-300">{isEn ? '12 icons, 24×24 px, single-line style:' : 'Bộ 12 icon nét đơn, kích thước 24×24px:'}</div>
                <div className="grid grid-cols-6 gap-2.5 text-center text-[#BD5705] dark:text-[#FFC270]">
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><Bus className="w-6 h-6" /></div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><BookOpen className="w-6 h-6" /></div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><Clock className="w-6 h-6" /></div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><Bell className="w-6 h-6" /></div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><User className="w-6 h-6" /></div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><MapPin className="w-6 h-6" /></div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><Search className="w-6 h-6" /></div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><Star className="w-6 h-6" /></div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><Calendar className="w-6 h-6" /></div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><BarChart3 className="w-6 h-6" /></div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><Plus className="w-6 h-6" /></div>
                  <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-center dark:bg-slate-800"><Check className="w-6 h-6" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2.2.5 Header & Navigation */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#BD5705] dark:text-[#FFC270] flex items-center gap-2">
            <PanelTop className="w-5 h-5" />
            <span>{isEn ? '2.2.5 Header & Navigation' : '2.2.5 Đầu trang & điều hướng (Header)'}</span>
          </h3>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3.5 rounded-2xl bg-[#FFFDF9] border border-[#FFC270]/60 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#BD5705] text-white flex items-center justify-center"><Bus className="w-4 h-4" /></span>
              <span className="text-xl font-bold text-[#4E0705] dark:text-white" style={{ fontFamily: "'Lora', Georgia, serif" }}>Library Bus</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#4E0705] flex-1 justify-center dark:text-slate-200 font-medium">
              <span>{isEn ? 'About' : 'Giới thiệu'}</span>
              <span>{isEn ? 'Search books' : 'Tra cứu sách'}</span>
              <span>{isEn ? 'News' : 'Tin tức'}</span>
              <span>{isEn ? 'Bus map' : 'Bản đồ xe'}</span>
              <span className="font-bold text-[#BD5705]">{isEn ? 'Library management' : 'Quản lý thư viện'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#4E0705] dark:text-slate-200">
              <Bell className="w-4 h-4" />
              <span className="w-6 h-6 rounded-full bg-[#BD5705]" />
              <span className="font-semibold">admin</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-5 rounded-2xl bg-[#FAF5EF]/60 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
              <b className="text-slate-900 dark:text-white">Header: </b>
              {isEn
                ? 'Logo on the left and menu items in the middle. The Library management item is orange to separate it from the public items. The notification bell and avatar sit on the right.'
                : 'Logo ở bên trái, các mục menu ở giữa. Mục Quản lý thư viện dùng màu cam để tách khỏi các mục công khai. Chuông thông báo và avatar nằm bên phải.'}
            </div>
            <div className="p-5 rounded-2xl bg-[#FAF5EF]/60 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
              <b className="text-slate-900 dark:text-white">{isEn ? 'Management navigation: ' : 'Điều hướng khu quản lý: '}</b>
              {isEn
                ? 'A dark brown sidebar on the left with an orange active item, and a breadcrumb above the content so users know where they are.'
                : 'Thanh bên trái nền nâu đậm, mục đang mở có nền cam. Phía trên nội dung có breadcrumb để người dùng biết mình đang ở đâu.'}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Chapter2BrandIdentity;
