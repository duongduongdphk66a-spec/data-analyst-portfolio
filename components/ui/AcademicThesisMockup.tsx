'use client';

import React, { useState } from 'react';
import { FileText, CheckCircle2, X, ZoomIn } from 'lucide-react';

interface AcademicThesisMockupProps {
  chartId: string;
  nameVi: string;
  nameEn: string;
  unitVi: string;
  unitEn: string;
  pageInDoc: number;
  data: Array<{ year: string; value: number }>;
  imageSrc?: string;
  isEn?: boolean;
}

export function AcademicThesisMockup({
  chartId,
  nameVi,
  nameEn,
  unitVi,
  unitEn,
  pageInDoc,
  data,
  imageSrc,
  isEn = false
}: AcademicThesisMockupProps) {
  // Mặc định là 'vector' (Tái hiện số hóa chuẩn SVG/CSS) để hiển thị sắc nét 100% trên cả mobile 390px và desktop
  const [displayType, setDisplayType] = useState<'image' | 'vector'>('vector');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="w-full max-w-4xl mx-auto p-5 sm:p-8 bg-ground border border-[#0D7287]/20 rounded-2xl shadow-lg dark:bg-slate-950 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-serif">
      {/* Archival Document Header */}
      <div className="border-b-2 border-stone-800 dark:border-stone-400 pb-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-sans font-black tracking-wider uppercase text-stone-600 dark:text-stone-300">
              {isEn 
                ? 'VIETNAM NATIONAL UNIVERSITY, HANOI • USSH' 
                : 'ĐẠI HỌC QUỐC GIA HÀ NỘI • TRƯỜNG ĐH KHOA HỌC XÃ HỘI & NHÂN VĂN'}
            </div>
            <div className="text-xs font-sans text-stone-500 dark:text-stone-400 mt-0.5">
              {isEn 
                ? 'Faculty of Tourism Studies - Master of Science Thesis / Monograph' 
                : 'Khoa Du lịch học - Văn bản trích lục Niên luận & Luận văn Thạc sĩ'}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-2.5 py-1 rounded-md bg-[#C8EEF7]/40 text-[#0D7287] border border-[#9BE7FA] font-mono text-[11px] font-bold dark:bg-slate-900 dark:text-[#9BE7FA] dark:border-slate-700">
              {isEn ? `Page ${pageInDoc}` : `Trang ${pageInDoc}`}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#FFE485]/50 text-[#473400] border border-[#FFD14C] font-sans text-[11px] font-extrabold dark:bg-[#FFD14C]/20 dark:text-[#FFE485] dark:border-[#FFD14C]/40">
              {isEn ? 'Archival Document' : 'Tư liệu gốc'}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-dashed border-stone-300 dark:border-stone-700 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white font-serif">
            {isEn ? `Figure ${chartId}: ${nameEn}` : `Biểu đồ ${chartId}: ${nameVi}`}
          </h3>
          <span className="text-xs font-sans italic text-stone-500 dark:text-stone-400 shrink-0">
            {isEn ? `Unit: ${unitEn}` : `Đơn vị tính: ${unitVi}`}
          </span>
        </div>

        {imageSrc && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-sans text-stone-500">{isEn ? 'Display mode:' : 'Chế độ hiển thị:'}</span>
            <div className="inline-flex rounded-lg p-0.5 bg-stone-150 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-[11px] font-sans">
              <button
                type="button"
                onClick={() => setDisplayType('vector')}
                className={`px-3 py-1 rounded font-bold cursor-pointer transition-all ${
                  displayType === 'vector'
                    ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-xs font-black'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {isEn ? '📐 Digitized Grid (Responsive)' : '📐 Số Hóa Vector (Rõ nét)'}
              </button>
              <button
                type="button"
                onClick={() => setDisplayType('image')}
                className={`px-3 py-1 rounded font-bold cursor-pointer transition-all ${
                  displayType === 'image'
                    ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-xs font-black'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {isEn ? '📷 Original DOCX Scan' : '📷 Bản Quét Niên Luận'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Canvas */}
      {displayType === 'image' && imageSrc ? (
        <div className="relative p-3 rounded-xl bg-white border border-stone-200 dark:bg-slate-900 dark:border-slate-800 shadow-inner flex flex-col items-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={isEn ? `Figure ${chartId}: ${nameEn}` : `Biểu đồ ${chartId}: ${nameVi}`}
            onClick={() => setIsModalOpen(true)}
            className="w-full max-h-[380px] object-contain rounded-lg border border-stone-150 dark:border-stone-800 bg-white cursor-zoom-in"
          />
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900/80 text-white hover:bg-slate-900 shadow-md backdrop-blur-sm transition flex items-center gap-1.5 text-xs font-sans font-bold"
          >
            <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">{isEn ? 'Inspect Full Resolution' : 'Phóng to kiểm chứng'}</span>
          </button>
          <div className="mt-2 w-full flex justify-between items-center text-xs font-sans text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-2">
            <span>{isEn ? 'Extracted directly from Niên luận.docx (USSH VNU Hanoi)' : 'Trích xuất trực tiếp từ file Niên luận.docx gốc (Khoa Đông Phương học)'}</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{isEn ? 'Verified Primary Source' : 'Nguồn Sơ Cấp Thẩm Tra'}</span>
          </div>
        </div>
      ) : (
        <div className="relative p-4 sm:p-6 rounded-xl bg-white border border-stone-200 dark:bg-slate-900 dark:border-slate-800 shadow-inner">
          {/* Academic Grid Coordinate System */}
          <div className="h-56 sm:h-64 w-full flex items-end gap-1.5 sm:gap-3 pt-6 pb-2 px-1 sm:px-2 border-b-2 border-l-2 border-stone-800 dark:border-stone-400">
            {data.map((item, idx) => {
              const heightPercent = Math.max(8, Math.round((item.value / maxVal) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-xs font-mono font-bold px-2 py-0.5 rounded shadow pointer-events-none z-20 whitespace-nowrap">
                    {item.year}: {item.value} {isEn ? unitEn : unitVi}
                  </div>
                  <span className="text-xs font-mono text-stone-600 dark:text-stone-300 mb-1 opacity-80 group-hover:opacity-100 font-bold">
                    {item.value}
                  </span>
                  <div 
                    className="w-full max-w-[28px] bg-gradient-to-t from-[#0D7287] to-[#9BE7FA] rounded-t-xs dark:from-[#0D7287] dark:to-[#9BE7FA] group-hover:brightness-110 transition-all shadow-xs"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs sm:text-xs font-mono text-stone-500 dark:text-stone-400 mt-1.5 -rotate-45 sm:rotate-0 origin-center">
                    {item.year.replace('20', "'")}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-xs font-sans text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-2">
            <span>{isEn ? 'Coordinate System: Cartesian 2D • Mobile Optimized' : 'Hệ quy chiếu: Lưới tọa độ Đề-các chuẩn học thuật (Tối ưu Mobile 390px)'}</span>
            <span className="font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA]">
              {isEn ? `Max Range: ${maxVal} ${unitEn}` : `Ngưỡng cực đại: ${maxVal} ${unitVi}`}
            </span>
          </div>
        </div>
      )}

      {/* Academic Citation & Footnote */}
      <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs font-sans text-stone-600 dark:text-stone-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span>
            {isEn 
              ? 'Source: Japan National Tourism Organization (JNTO) & Kyoto / Nara Statistical Bureaus.' 
              : 'Nguồn: Tổng cục Du lịch Nhật Bản (JNTO), Cục Thống kê Kyoto & Nara (Dữ liệu thẩm tra luận văn).'}
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[11px] text-[#0D7287] dark:text-[#9BE7FA] font-bold">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
          <span>{isEn ? 'Digitized Code Reconstruction' : 'Số hóa dạng Code chuẩn xác'}</span>
        </div>
      </div>

      {/* MODAL FULL RESOLUTION SCAN */}
      {isModalOpen && imageSrc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <span>{isEn ? `Original Archival Scan: Figure ${chartId}` : `Bản Quét Gốc Niên Luận: Biểu Đồ ${chartId}`}</span>
                  <span className="text-xs text-sky-400 font-mono font-normal">Trang {pageInDoc}</span>
                </h4>
                <p className="text-xs text-slate-400 font-sans">{isEn ? nameEn : nameVi}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 bg-white rounded-xl my-4 overflow-auto max-h-[70vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={isEn ? nameEn : nameVi}
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
              <span>Đại học Quốc gia Hà Nội • Khoa Du lịch học</span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition"
              >
                {isEn ? 'Close Window' : 'Đóng cửa sổ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AcademicThesisMockup;
