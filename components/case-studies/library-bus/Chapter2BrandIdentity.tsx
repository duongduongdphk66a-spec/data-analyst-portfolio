'use client';

import React, { useState } from 'react';
import { 
  Bus, Palette, Type, MousePointer, 
  BookOpen, Clock, Bell, User, MapPin, Search, Star, Tag, BarChart3, CreditCard, MessageSquare, Copy, CheckCheck
} from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

export interface Chapter2BrandIdentityProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

const PROJECT_ICONS = [
  { icon: BookOpen, label: 'Kho Sách', labelEn: 'Catalog', desc: 'Tra cứu sách & đọc bản mềm PDF' },
  { icon: Bus, label: 'Xe Bus', labelEn: 'Fleet', desc: 'Đội xe buýt thư viện lưu động' },
  { icon: Clock, label: 'Hạn Trả', labelEn: 'Due Date', desc: 'Đồng hồ đếm ngược thời gian mượn' },
  { icon: Bell, label: 'Thông Báo', labelEn: 'Alerts', desc: 'Chuông nhắc trả & thông báo sách mới' },
  { icon: User, label: 'Bạn Đọc', labelEn: 'Patron', desc: 'Hồ sơ độc giả & thẻ thư viện số' },
  { icon: MapPin, label: 'Trạm Dừng', labelEn: 'GPS Stop', desc: 'Định vị GPS lộ trình & trạm dừng buýt' },
  { icon: Search, label: 'Tìm Kiếm', labelEn: 'Search', desc: 'Tìm nhanh theo nhan đề, tác giả, ISBN' },
  { icon: Star, label: 'Đánh Giá', labelEn: 'Rating', desc: 'Xếp hạng sao & review cảm nhận sách' },
  { icon: Tag, label: 'Phân Loại', labelEn: 'Tags', desc: 'Thể loại sách & nhãn danh mục đa cấp' },
  { icon: BarChart3, label: 'Thống Kê', labelEn: 'Analytics', desc: 'Báo cáo mượn trả & mật độ độc giả' },
  { icon: CreditCard, label: 'Thẻ Mượn', labelEn: 'Borrow Pass', desc: 'Tạo phiếu mượn & mã giao dịch tự động' },
  { icon: MessageSquare, label: 'Thảo Luận', labelEn: 'Forum', desc: 'Diễn đàn bạn đọc & chia sẻ bài viết' },
];

const COLOR_SWATCHES = [
  { nameVi: 'Molasses (Mật mía)', nameEn: 'Molasses Ink', hex: '#4E0705', rgb: '78, 7, 5', textWhite: true },
  { nameVi: 'Well-browned (Nướng già)', nameEn: 'Roasted Chestnut', hex: '#812203', rgb: '129, 34, 3', textWhite: true },
  { nameVi: 'Roast (Caramel / CTA)', nameEn: 'Caramel Bronze (CTA)', hex: '#BD5705', rgb: '189, 87, 5', textWhite: true },
  { nameVi: 'Toasty (Hổ phách)', nameEn: 'Toasted Amber', hex: '#ED9040', rgb: '237, 144, 64', textWhite: false },
  { nameVi: 'Greasey (Bơ mật ong)', nameEn: 'Honey Butter', hex: '#FFC270', rgb: '255, 194, 112', textWhite: false },
  { nameVi: 'Butter (Vàng bơ)', nameEn: 'Pastry Yellow', hex: '#FDE971', rgb: '253, 233, 113', textWhite: false }
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
        chapter={isEn ? 'CHAPTER 2' : 'PHẦN 2'}
        subtitle={isEn ? 'Brand identity, typography, color palette & UI components' : 'Nhận diện thương hiệu, kiểu chữ, bảng màu & thư viện thành phần UI'}
        badge=""
        title={isEn ? '2. Logo & UI Components' : '2. Logo & Thành Phần Giao Diện'}
        onCopy={onCopyDeepLink}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 2.1 CẤU TRÚC LƯỚI LOGO (CONSTRUCTION GRID SVG) */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] font-black text-xs sm:text-sm tabular-nums">
                2.1
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <Bus className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Logo Construction Grid' : 'Cấu trúc Lưới Logo'}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500">{isEn ? '6.6X × 4X proportion & 1.5X safe distance' : 'Tỷ lệ 6.6X × 4X | Vùng an toàn 1.5X'}</p>
          </div>

          {/* SVG Construction Grid */}
          <div data-ui="brand-construction-grid" className="p-4 rounded-2xl bg-[#FFFDF9] dark:bg-[#170706] border border-dashed border-[#ED9040]/40 dark:border-[#FFC270]/30 relative flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
            {/* Safe distance boundary markers */}
            <div className="absolute inset-2 border border-dashed border-[#ED9040]/50 dark:border-[#FFC270]/30 rounded-xl pointer-events-none" />
            <span className="absolute top-3 left-3 text-xs tabular-nums text-[#BD5705] dark:text-[#FFC270] font-bold">1.5X Safe</span>

            {/* Logo Center */}
            <div className="flex items-center gap-2.5 z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#BD5705] text-white flex items-center justify-center shadow-xs">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-baseline font-serif font-black tracking-tight text-2xl sm:text-3xl">
                <span className="text-[#BD5705]">Library</span>
                <span className="text-[#4E0705] dark:text-[#FDE971] ml-0.5">Bus</span>
              </div>
            </div>

            <div className="mt-3 text-xs tabular-nums font-semibold text-slate-500 dark:text-slate-400 text-center">
              Tỷ lệ: 6.6X × 4X | Min: 42.5px
            </div>
          </div>
        </div>

        {/* 2.2 BẢNG MÀU CHỦ ĐẠO & BỔ TRỢ */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] font-black text-xs sm:text-sm tabular-nums">
                2.2
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Color Swatch Bar' : 'Bảng màu (HEX & RGB)'}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500">{isEn ? 'Core 6-tone Molasses-Butter palette from project tokens' : '6 mã màu chuẩn Molasses-Butter từ mã nguồn dự án'}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {COLOR_SWATCHES.map((col) => (
              <button
                key={col.hex}
                type="button"
                onClick={() => handleCopyHex(col.hex)}
                className="p-2.5 rounded-xl text-left transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-2xs border border-black/10 relative overflow-hidden"
                style={{ backgroundColor: col.hex, color: col.textWhite ? '#FFFFFF' : '#3A0806' }}
                title={isEn ? `Copy ${col.hex}` : `Sao chép mã ${col.hex}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-extrabold truncate">{isEn ? col.nameEn : col.nameVi}</span>
                  {copiedHex === col.hex ? (
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60 shrink-0" />
                  )}
                </div>
                <div className="mt-1 tabular-nums text-xs font-black">{col.hex}</div>
                <div className="text-xs opacity-80 tabular-nums">RGB({col.rgb})</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2.3 TYPOGRAPHY & BUTTON STATES MATRIX */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] font-black text-xs sm:text-sm tabular-nums">
                2.3
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <Type className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Type Scale & UI States' : 'Phông chữ & Nút bấm'}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500">Lora + Outfit | 3 trạng thái nút</p>
          </div>

          <div className="space-y-3 pt-1">
            {/* Visual Type Scale Pills */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Headings (Lora):</span>
                <span className="tabular-nums font-bold text-slate-900 dark:text-slate-100">72pt / 58pt / 46pt / 33pt</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Body (Outfit):</span>
                <span className="tabular-nums font-bold text-slate-900 dark:text-slate-100">16pt / 14pt</span>
              </div>
            </div>

            {/* Interactive Button States */}
            <div className="flex flex-wrap gap-2 items-center">
              <button 
                type="button"
                className="px-3.5 py-2 rounded-xl bg-[#BD5705] hover:bg-[#812203] text-white text-xs font-bold shadow-xs cursor-pointer min-h-[40px] flex items-center transition-colors active:scale-95"
              >
                Default (Roast)
              </button>
              <button 
                type="button"
                className="px-3.5 py-2 rounded-xl bg-[#4E0705] text-[#FDE971] text-xs font-bold shadow-xs hover:brightness-110 cursor-pointer min-h-[40px] flex items-center border border-[#812203] transition-transform active:scale-95"
              >
                Hover (Molasses)
              </button>
              <button 
                type="button"
                disabled 
                className="px-3.5 py-2 rounded-xl bg-[#F4ECE1] dark:bg-slate-800 text-[#96523E] dark:text-slate-400 text-xs font-bold cursor-not-allowed min-h-[40px] flex items-center border border-slate-200/80 dark:border-slate-700"
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
          <span className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            <span>{isEn ? '2.2.4 Single-Line Icon Matrix (24×24px)' : '2.2.4 Bộ biểu tượng nét đơn chuẩn (24×24px)'}</span>
          </span>
          <span className="text-xs tabular-nums text-slate-400">12 Icons • SVG</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 text-center pt-1">
          {PROJECT_ICONS.map((item) => (
            <div
              key={item.label}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-[#BD5705] dark:hover:text-[#ED9040] hover:bg-[#FAF5EF] dark:hover:bg-[#240C0B] transition-colors flex flex-col items-center justify-center gap-1.5 group shadow-2xs cursor-default"
              title={`${item.label} (${item.desc})`}
            >
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-transform group-hover:scale-110" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-[#BD5705] dark:group-hover:text-[#ED9040] truncate max-w-full">
                {isEn ? item.labelEn : item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Chapter2BrandIdentity;
