'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, Users, BarChart3, MapPin, BookOpen, 
  FileText, Bell, GitBranch, ArrowRight, CheckCircle2, 
  ExternalLink, Layers, Workflow
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import SectionHeader from '@/components/ui/SectionHeader';

export interface Chapter1UxResearchProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

export function Chapter1UxResearch({ 
  isEn = false, 
  onCopyDeepLink = () => {} 
}: Chapter1UxResearchProps) {
  const [activeEmbedTab, setActiveEmbedTab] = useState<'visual' | 'architecture' | 'flow'>('visual');
  const { resolvedTheme } = useTheme();

  // Synchronize theme changes to all embedded iframes immediately
  useEffect(() => {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((ifr) => {
      try {
        ifr.contentWindow?.postMessage({ theme: resolvedTheme }, '*');
      } catch (_) {}
    });
  }, [resolvedTheme]);

  return (
    <section id="chapter-1-ux" className="space-y-8 scroll-mt-36">
      {/* 01. SECTION HEADER */}
      <SectionHeader
        variant="chapter"
        id="sec-research"
        chapter="CHAPTER 01"
        subtitle={isEn ? 'Introduction, target audience & user experience research' : 'Giới thiệu dự án, khách hàng mục tiêu & nghiên cứu trải nghiệm'}
        badge="01"
        title={isEn ? '01. Introduction & UX Research' : '01. Giới Thiệu & Nghiên Cứu Trải Nghiệm'}
        onCopy={onCopyDeepLink}
      />

      {/* 1.1 SỨ MỆNH & 1.2 KHẢO SÁT THỊ TRƯỜNG */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1.1 Sứ mệnh & KPI cốt lõi */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FA6933]">
              <Compass className="w-4 h-4 text-[#FA6933]" />
              <span>{isEn ? '1.1 Mission' : '1.1 Sứ mệnh'}</span>
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 leading-snug">
              {isEn ? 'Mobile library connecting books to every bus stop.' : 'Thư viện lưu động kết nối tri thức đến mọi trạm dừng.'}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="block font-mono text-2xl font-black text-[#FA6933]">20+</span>
              <span className="text-xs text-slate-500 font-medium">{isEn ? 'Screens' : 'Màn hình'}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="block font-mono text-2xl font-black text-[#323987] dark:text-[#9BE7FA]">7</span>
              <span className="text-xs text-slate-500 font-medium">{isEn ? 'Modules' : 'Phân hệ'}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="block font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</span>
              <span className="text-xs text-slate-500 font-medium">{isEn ? 'Auto flow' : 'Tự động'}</span>
            </div>
          </div>
        </div>

        {/* 1.2 Khách hàng mục tiêu (Bar chart) */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#323987] dark:text-[#9BE7FA]">
              <Users className="w-4 h-4" />
              <span>{isEn ? '1.2 Customer Target (15-45 y.o)' : '1.2 Khách hàng mục tiêu (15–45 tuổi)'}</span>
            </div>
            <p className="text-xs text-slate-500">{isEn ? 'User demographic proportion' : 'Tỷ trọng 3 nhóm đối tượng chính'}</p>
          </div>
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>{isEn ? 'Students / Academic' : 'Học sinh / Sinh viên'}</span>
                <span className="font-mono font-bold text-[#FA6933]">48%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#FA6933] rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>{isEn ? 'Tech-savvy Professionals' : 'Người đi làm yêu công nghệ'}</span>
                <span className="font-mono font-bold text-[#323987] dark:text-[#9BE7FA]">32%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#323987] dark:bg-[#9BE7FA] rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>{isEn ? 'Family & Community' : 'Gia đình & Cộng đồng'}</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">20%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* 1.2 Nhu cầu chức năng (Market Survey) */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="w-4 h-4" />
              <span>{isEn ? '1.2 Market Demand' : '1.2 Nhu cầu chức năng'}</span>
            </div>
            <p className="text-xs text-slate-500">{isEn ? 'Essential feature preference rate' : 'Khảo sát tỷ lệ người dùng ưu tiên'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-[#FA6933]" />
                <span>{isEn ? 'Bus GPS' : 'Định vị xe'}</span>
              </div>
              <span className="block font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">92%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <BookOpen className="w-3.5 h-3.5 text-[#323987] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Reserve' : 'Đặt giữ chỗ'}</span>
              </div>
              <span className="block font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">88%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isEn ? 'Read PDF' : 'Đọc PDF'}</span>
              </div>
              <span className="block font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">76%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>{isEn ? 'Due alert' : 'Nhắc hạn'}</span>
              </div>
              <span className="block font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">84%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SƠ ĐỒ SITEMAP & LUỒNG TRẢI NGHIỆM NGƯỜI DÙNG */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <GitBranch className="w-5 h-5 text-[#323987] dark:text-[#9BE7FA]" />
              <span>{isEn ? '1.2 Sitemap & User Experience Flow' : '1.2 Sơ Đồ Phân Cấp Sitemap & Luồng Người Dùng'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEn ? 'Information hierarchy & book borrowing decision workflow' : 'Cấu trúc thông tin phân tầng & quy trình quyết định mượn sách'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveEmbedTab('visual')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                activeEmbedTab === 'visual'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isEn ? 'Visual Diagrams' : 'Sơ đồ trực quan'}
            </button>
            <button
              onClick={() => setActiveEmbedTab('architecture')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                activeEmbedTab === 'architecture'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isEn ? 'Architecture Embed' : 'Kiến trúc chi tiết'}
            </button>
            <button
              onClick={() => setActiveEmbedTab('flow')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                activeEmbedTab === 'flow'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isEn ? 'Workflow Embed' : 'Luồng tương tác'}
            </button>
          </div>
        </div>

        {activeEmbedTab === 'visual' ? (
          <div className="space-y-8">
            {/* A. SƠ ĐỒ PHÂN CẤP SITEMAP (TREE DIAGRAM) */}
            <div className="space-y-4">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#323987] dark:text-[#9BE7FA] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{isEn ? 'A. Sitemap Hierarchy Tree' : 'A. Sơ đồ phân cấp Sitemap'}</span>
              </div>

              {/* Tree Grid Layout */}
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                {/* Root Hub */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#323987] text-white font-bold text-sm shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FA6933] animate-pulse" />
                  <span>🚌 Library Bus Root</span>
                </div>

                {/* Branch Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="block text-xs font-bold text-[#FA6933]">01. Trang chủ</span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Tìm kiếm nhanh</li>
                      <li>• Sách nổi bật</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="block text-xs font-bold text-[#323987] dark:text-[#9BE7FA]">02. Kho sách & PDF</span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Lọc đa cấp</li>
                      <li>• Đọc PDF / Quyên góp</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="block text-xs font-bold text-indigo-600 dark:text-indigo-400">03. Tuyến Xe & Bản đồ</span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Lịch trình GPS</li>
                      <li>• Tồn kho theo xe</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400">04. Mượn / Đặt trước</span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Tạo phiếu mượn</li>
                      <li>• Đặt trước giữ chỗ</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="block text-xs font-bold text-amber-600 dark:text-amber-400">05. Cộng đồng (Blog)</span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Tin tức & CLB</li>
                      <li>• Sự kiện đọc sách</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">06. Tài khoản & Stats</span>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Dashboard cá nhân</li>
                      <li>• Thông báo hạn trả</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* B. LUỒNG TRẢI NGHIỆM NGƯỜI DÙNG (DECISION FLOWCHART) */}
            <div className="space-y-4">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FA6933] flex items-center gap-2">
                <Workflow className="w-4 h-4" />
                <span>{isEn ? 'B. User Flow (Borrowing Decision Matrix)' : 'B. Luồng trải nghiệm người dùng (Quyết định mượn sách)'}</span>
              </div>

              {/* Decision Flowchart Grid */}
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
                <div className="flex items-center gap-3 min-w-[780px] text-xs font-medium">
                  {/* Step 1 */}
                  <div className="px-3.5 py-2.5 rounded-full bg-emerald-600 text-white font-bold shrink-0 shadow-xs">
                    Trang chủ
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 2 Decision */}
                  <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center shrink-0">
                    <span className="block font-bold text-amber-800 dark:text-amber-200">Đã biết tên sách?</span>
                    <div className="flex gap-1.5 mt-1 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 font-bold">Có: Tìm kiếm</span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Không: Gợi ý</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 3 Action */}
                  <div className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                    Chi tiết & Tồn kho xe
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 4 Decision */}
                  <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center shrink-0">
                    <span className="block font-bold text-amber-800 dark:text-amber-200">Còn sách trên xe?</span>
                    <div className="flex gap-1.5 mt-1 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Có: Mượn ngay</span>
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">Hết: Đặt trước</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 5 Auth & Station Confirm */}
                  <div className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                    Xác nhận Trạm nhận
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 6 Complete */}
                  <div className="px-3.5 py-2.5 rounded-full bg-[#FA6933] text-white font-bold shrink-0 flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hoàn tất Phiếu mượn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeEmbedTab === 'architecture' ? (
          <div className="space-y-2">
            <div className="flex justify-end">
              <a 
                href={`/library-bus/system-architecture.html?theme=${resolvedTheme}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#323987] dark:text-[#9BE7FA] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{isEn ? 'Open in new tab' : 'Mở toàn màn hình'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <iframe 
              src={`/library-bus/system-architecture.html?embed=1&theme=${resolvedTheme}`} 
              className="w-full h-[500px] sm:h-[580px] lg:h-[640px] max-h-[70vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300" 
              title="Library Bus System Architecture Diagram" 
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-end">
              <a 
                href={`/library-bus/borrowing-workflow.html?theme=${resolvedTheme}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#323987] dark:text-[#9BE7FA] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{isEn ? 'Open in new tab' : 'Mở toàn màn hình'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <iframe 
              src={`/library-bus/borrowing-workflow.html?embed=1&theme=${resolvedTheme}`} 
              className="w-full h-[500px] sm:h-[580px] lg:h-[640px] max-h-[70vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300" 
              title="Library Bus Borrowing Workflow Diagram" 
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default Chapter1UxResearch;
