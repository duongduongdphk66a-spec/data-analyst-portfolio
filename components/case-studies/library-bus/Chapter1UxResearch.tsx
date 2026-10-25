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

interface SitemapRootItem {
  name: string;
  nameEn: string;
  screenId: string;
}

const SITEMAP_ROOT: SitemapRootItem[] = [
  { name: 'Trang chủ', nameEn: 'Home', screenId: 'screen-01' },
  { name: 'Kho sách & PDF', nameEn: 'Book Catalog & PDF', screenId: 'screen-03' },
  { name: 'Tuyến Xe & Bản đồ', nameEn: 'Bus Route & Map', screenId: 'screen-05' },
  { name: 'Mượn / Đặt trước', nameEn: 'Borrow / Reserve', screenId: 'screen-09' },
  { name: 'Cộng đồng (Blog)', nameEn: 'Community (Blog)', screenId: 'screen-15' },
  { name: 'Tài khoản & Analytics', nameEn: 'Account & Analytics', screenId: 'screen-18' },
];

interface SitemapSubItem {
  label: string;
  labelEn: string;
  screenId: string;
}

interface SitemapDetailChild {
  label: string;
  labelEn: string;
  screenId: string;
  sub?: SitemapSubItem[];
}

interface SitemapDetailGroup {
  parent: string;
  parentEn: string;
  screenId: string;
  children: SitemapDetailChild[];
}

const SITEMAP_DETAILS: SitemapDetailGroup[] = [
  {
    parent: 'Trang chủ',
    parentEn: 'Home',
    screenId: 'screen-01',
    children: [
      {
        label: 'Tìm kiếm',
        labelEn: 'Search',
        screenId: 'screen-01',
        sub: [
          { label: 'Kho sách', labelEn: 'Book Catalog', screenId: 'screen-03' },
          { label: 'Tuyến xe buýt', labelEn: 'Bus Routes', screenId: 'screen-05' },
        ],
      },
      { label: 'Giới thiệu dự án', labelEn: 'About Project', screenId: 'screen-02' },
      { label: 'Quyên góp sách', labelEn: 'Book Donation', screenId: 'screen-08' },
      { label: 'Hỏi đáp (FAQ)', labelEn: 'FAQ', screenId: 'screen-19' },
      { label: 'Thông tin liên hệ', labelEn: 'Contact Us', screenId: 'screen-20' },
    ],
  },
  {
    parent: 'Kho sách & PDF',
    parentEn: 'Book Catalog & PDF',
    screenId: 'screen-03',
    children: [
      {
        label: 'Danh mục sách đa cấp',
        labelEn: 'Multi-level Catalog',
        screenId: 'screen-03',
        sub: [
          { label: 'Chi tiết & Đọc PDF', labelEn: 'Detail & Read PDF', screenId: 'screen-04' },
          { label: 'Đánh giá sao', labelEn: 'Star Rating', screenId: 'screen-04' },
        ],
      },
      { label: 'Quản trị kho sách', labelEn: 'Library Admin Inventory', screenId: 'screen-07' },
    ],
  },
  {
    parent: 'Tuyến Xe & Bản đồ',
    parentEn: 'Bus Route & Map',
    screenId: 'screen-05',
    children: [
      { label: 'Bản đồ lộ trình GPS', labelEn: 'GPS Route Map', screenId: 'screen-05' },
      {
        label: 'Chi tiết xe buýt',
        labelEn: 'Bus Fleet Detail',
        screenId: 'screen-06',
        sub: [
          { label: 'Tồn kho trên xe', labelEn: 'Stock on Bus', screenId: 'screen-06' },
          { label: 'Lịch trạm dừng', labelEn: 'Stop Schedule', screenId: 'screen-05' },
        ],
      },
    ],
  },
  {
    parent: 'Mượn / Đặt trước',
    parentEn: 'Borrow / Reserve',
    screenId: 'screen-09',
    children: [
      { label: 'Tạo phiếu mượn sách', labelEn: 'Create Borrow Order', screenId: 'screen-09' },
      { label: 'Đặt trước giữ chỗ', labelEn: 'Hold Reservation', screenId: 'screen-10' },
      { label: 'Dashboard Giao dịch', labelEn: 'Transactions Dashboard', screenId: 'screen-11' },
    ],
  },
  {
    parent: 'Cộng đồng (Blog)',
    parentEn: 'Community (Blog)',
    screenId: 'screen-15',
    children: [
      { label: 'Trang chủ Blog', labelEn: 'Blog Home', screenId: 'screen-15' },
      {
        label: 'Chi tiết bài viết',
        labelEn: 'Article Detail',
        screenId: 'screen-16',
        sub: [
          { label: 'Review sách', labelEn: 'Book Review', screenId: 'screen-16' },
          { label: 'Bình luận Thread', labelEn: 'Threaded Comments', screenId: 'screen-16' },
        ],
      },
    ],
  },
  {
    parent: 'Tài khoản & Analytics',
    parentEn: 'Account & Analytics',
    screenId: 'screen-12',
    children: [
      {
        label: 'Xác thực tài khoản',
        labelEn: 'Authentication',
        screenId: 'screen-13',
        sub: [
          { label: 'Đăng nhập', labelEn: 'Login', screenId: 'screen-13' },
          { label: 'Đăng ký', labelEn: 'Register', screenId: 'screen-14' },
        ],
      },
      { label: 'Dashboard Độc giả', labelEn: 'Reader Profile Dashboard', screenId: 'screen-12' },
      { label: 'Thông báo hạn trả', labelEn: 'Due Date Notifications', screenId: 'screen-17' },
      { label: 'Analytics Dashboard', labelEn: 'Analytics Dashboard', screenId: 'screen-18' },
    ],
  },
];

export function Chapter1UxResearch({ 
  isEn = false, 
  onCopyDeepLink = () => {} 
}: Chapter1UxResearchProps) {
  const [activeEmbedTab, setActiveEmbedTab] = useState<'visual' | 'architecture' | 'flow'>('visual');
  const { resolvedTheme } = useTheme();

  const handleSitemapNodeClick = (screenId: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('select-library-bus-screen', { detail: { screenId } })
      );
    }
  };

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
        chapter={isEn ? 'CHAPTER 1' : 'PHẦN 1'}
        subtitle={isEn ? 'Introduction, target audience & user experience research' : 'Giới thiệu dự án, khách hàng mục tiêu & nghiên cứu trải nghiệm'}
        badge=""
        title={isEn ? '1. Introduction & UX Research' : '1. Giới Thiệu & Nghiên Cứu Trải Nghiệm'}
        onCopy={onCopyDeepLink}
      />

      {/* 1.1 SỨ MỆNH & 1.2 KHẢO SÁT THỊ TRƯỜNG */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1.1 Sứ mệnh & KPI cốt lõi */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] font-black text-xs sm:text-sm tabular-nums">
                1.1
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Mission & Core KPIs' : 'Sứ mệnh & KPI cốt lõi'}</span>
              </h3>
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 leading-snug">
              {isEn ? 'Mobile library connecting books to every bus stop.' : 'Thư viện lưu động kết nối tri thức đến mọi trạm dừng.'}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="block tabular-nums text-2xl font-black text-slate-950 dark:text-white">20+</span>
              <span className="text-xs text-slate-500 font-medium">{isEn ? 'Screens' : 'Màn hình'}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="block tabular-nums text-2xl font-black text-slate-950 dark:text-white">7</span>
              <span className="text-xs text-slate-500 font-medium">{isEn ? 'Modules' : 'Phân hệ'}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="block tabular-nums text-2xl font-black text-slate-950 dark:text-white">100%</span>
              <span className="text-xs text-slate-500 font-medium">{isEn ? 'Auto flow' : 'Tự động'}</span>
            </div>
          </div>
        </div>

        {/* 1.2 Khách hàng mục tiêu (Bar chart) */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] font-black text-xs sm:text-sm tabular-nums">
                1.2
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Customer Target (15–45 y.o)' : 'Khách hàng mục tiêu (15–45 tuổi)'}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500">{isEn ? 'User demographic proportion' : 'Tỷ trọng 3 nhóm đối tượng chính'}</p>
          </div>
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>{isEn ? 'Students / Academic' : 'Học sinh / Sinh viên'}</span>
                <span className="tabular-nums font-bold text-slate-950 dark:text-white">48%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#0D7287] dark:bg-[#9BE7FA] rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>{isEn ? 'Tech-savvy Professionals' : 'Người đi làm yêu công nghệ'}</span>
                <span className="tabular-nums font-bold text-slate-950 dark:text-white">32%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#FFD14C] rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>{isEn ? 'Family & Community' : 'Gia đình & Cộng đồng'}</span>
                <span className="tabular-nums font-bold text-slate-950 dark:text-white">20%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#FFE485] dark:bg-[#FFE485]/70 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* 1.3 Nhu cầu chức năng (Market Survey) */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] font-black text-xs sm:text-sm tabular-nums">
                1.3
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Market Demand' : 'Nhu cầu chức năng'}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500">{isEn ? 'Essential feature preference rate' : 'Khảo sát tỷ lệ người dùng ưu tiên'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Bus GPS' : 'Định vị xe'}</span>
              </div>
              <span className="block tabular-nums text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">92%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <BookOpen className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Reserve' : 'Đặt giữ chỗ'}</span>
              </div>
              <span className="block tabular-nums text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">88%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <FileText className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Read PDF' : 'Đọc PDF'}</span>
              </div>
              <span className="block tabular-nums text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">76%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <Bell className="w-3.5 h-3.5 text-[#FFD14C]" />
                <span>{isEn ? 'Due alert' : 'Nhắc hạn'}</span>
              </div>
              <span className="block tabular-nums text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">84%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SƠ ĐỒ SITEMAP & LUỒNG TRẢI NGHIỆM NGƯỜI DÙNG */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-black text-sm tabular-nums">
                1.4
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Sitemap Hierarchy & User Experience Flow' : 'Sơ Đồ Phân Cấp Sitemap & Luồng Người Dùng'}</span>
              </h3>
            </div>
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
            {/* A. SƠ ĐỒ CÂY VUÔNG GÓC SITEMAP & SITEMAP DETAIL (2 CỘT CHUẨN ĐỒ HỌA) */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  <span>{isEn ? 'A. Orthogonal Sitemap & Detailed Hierarchy' : 'A. Sơ đồ cây vuông góc Sitemap & Sitemap Detail'}</span>
                </div>
                <span className="text-xs tabular-nums px-3 py-1 rounded-full bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/10 text-[#074553] dark:text-[#9BE7FA] border border-[#9BE7FA]/30">
                  {isEn ? 'Click any branch to jump to Wireframe vs UI' : 'Nhấp vào nhánh để mở màn hình Wireframe vs UI'}
                </span>
              </div>

              {/* Bố cục 2 cột: SITEMAP & SITEMAP DETAIL */}
              <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#C8EEF7]/40 border border-[#9BE7FA]/40 text-xs text-[#074553] dark:bg-[#9BE7FA]/10 dark:border-[#9BE7FA]/20 dark:text-[#9BE7FA] font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                    <span>{isEn ? 'Click any box on Sitemap to scroll and open corresponding Wireframe & UI in Section 03' : 'Ấn vào bất kỳ ô nào trên Sitemap để cuộn xuống và mở ngay Wireframe & UI tương ứng ở Phần 03'}</span>
                  </div>
                  <span className="tabular-nums text-xs text-slate-500 dark:text-slate-400">20/20 Screens Desktop</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  {/* CỘT TRÁI (5 CỘT): SITEMAP TỔNG QUAN NỐI VUÔNG GÓC TỪ NÚT GỐC */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="border-slate-100 dark:border-slate-800 pb-2">
                      <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                        SITEMAP
                      </h3>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {isEn ? '/High-Level Information Architecture/' : '/Sơ đồ trang web tổng quan/'}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center">
                      {/* Nút gốc xanh slate đậm */}
                      <button
                        type="button"
                        onClick={() => handleSitemapNodeClick('screen-01')}
                        className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-extrabold text-xs sm:text-sm shrink-0 transition-transform active:scale-95 cursor-pointer flex items-center gap-2 shadow-xs whitespace-nowrap"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#9BE7FA]" />
                        <span>Library Bus</span>
                      </button>

                      {/* Đoạn nối ngang */}
                      <div className="w-3 sm:w-4 border-t-2 border-slate-600 dark:border-slate-400 shrink-0" />

                      {/* Trục dọc nối 6 nhánh vuông góc */}
                      <div className="border-l-2 border-slate-600 dark:border-slate-400 py-1 space-y-2.5 sm:space-y-3 shrink-0">
                        {SITEMAP_ROOT.map((item, idx) => (
                          <div key={item.name} className="flex items-center">
                            {/* Nét ngang vuông góc */}
                            <div className="w-3 sm:w-4 border-t-2 border-slate-600 dark:border-slate-400 shrink-0" />
                            <button
                              type="button"
                              onClick={() => handleSitemapNodeClick(item.screenId)}
                              title={isEn ? `Open Screen: ${item.nameEn}` : `Mở màn hình: ${item.name}`}
                              className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-[#9BE7FA] hover:text-[#0D7287] dark:hover:text-[#9BE7FA] text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors text-left shadow-2xs hover:shadow-xs cursor-pointer flex items-center justify-between gap-2.5 whitespace-nowrap"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="tabular-nums text-xs text-slate-400">0{idx + 1}.</span>
                                <span>{isEn ? item.nameEn : item.name}</span>
                              </div>
                              <span className="tabular-nums text-xs px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                                #{item.screenId.replace('screen-', '')}
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI (7 CỘT): SITEMAP DETAIL CÂY PHÂN CẤP ĐA TẦNG */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="border-slate-100 dark:border-slate-800 pb-2">
                      <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                        SITEMAP DETAIL
                      </h3>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {isEn ? '/Multi-Tier Granular Hierarchy/' : '/Sơ đồ phân cấp đa tầng chi tiết/'}
                      </p>
                    </div>

                    <div className="pt-2 grid grid-cols-1 xl:grid-cols-2 gap-4 text-xs">
                      {SITEMAP_DETAILS.map((group) => (
                        <div
                          key={group.parent}
                          className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-2"
                        >
                          {/* Nhóm cha */}
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleSitemapNodeClick(group.screenId)}
                              className="px-2.5 py-1 rounded-md border border-[#0D7287]/30 dark:border-[#9BE7FA]/30 bg-[#0D7287]/10 dark:bg-[#9BE7FA]/10 text-[#0D7287] dark:text-[#9BE7FA] font-extrabold hover:bg-[#0D7287] hover:text-white dark:hover:bg-[#9BE7FA] dark:hover:text-slate-950 transition cursor-pointer text-left shrink-0 text-xs flex items-center gap-1.5"
                            >
                              <span>{isEn ? group.parentEn : group.parent}</span>
                              <span className="opacity-70 text-xs tabular-nums font-bold">#{group.screenId.replace('screen-', '')}</span>
                            </button>
                            <div className="w-3 border-t-2 border-slate-400 dark:border-slate-600 shrink-0" />
                            <span className="text-xs tabular-nums text-slate-400 pl-1">
                              {group.children.length} {isEn ? 'nodes' : 'nhánh'}
                            </span>
                          </div>

                          {/* Cây vuông góc các nhánh con */}
                          <div className="ml-3 border-l-2 border-slate-400 dark:border-slate-600 pl-2 py-1 space-y-2">
                            {group.children.map((child) => (
                              <div key={child.label} className="space-y-1">
                                <div className="flex items-center">
                                  <div className="w-3 border-t-2 border-slate-400 dark:border-slate-600 shrink-0" />
                                  <button
                                    type="button"
                                    onClick={() => handleSitemapNodeClick(child.screenId)}
                                    className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-[#9BE7FA] hover:text-[#0D7287] dark:hover:text-[#9BE7FA] text-xs font-medium transition text-left shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                                  >
                                    <span>•</span>
                                    <span>{isEn ? child.labelEn : child.label}</span>
                                    <span className="tabular-nums text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold">
                                      #{child.screenId.replace('screen-', '')}
                                    </span>
                                  </button>
                                </div>

                                {/* Nhánh con cấp 3 (nếu có) */}
                                {child.sub && child.sub.length > 0 && (
                                  <div className="ml-5 border-l-2 border-dashed border-slate-300 dark:border-slate-700 pl-2 py-0.5 space-y-1">
                                    {child.sub.map((subItem) => (
                                      <div key={subItem.label} className="flex items-center">
                                        <div className="w-2.5 border-slate-300 dark:border-slate-700 shrink-0" />
                                        <button
                                          type="button"
                                          onClick={() => handleSitemapNodeClick(subItem.screenId)}
                                          className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium hover:border-[#9BE7FA] hover:text-[#0D7287] dark:hover:text-[#9BE7FA] hover:bg-[#C8EEF7]/20 transition cursor-pointer flex items-center gap-1"
                                        >
                                          <span>{isEn ? subItem.labelEn : subItem.label}</span>
                                          <span className="tabular-nums text-[9px] text-[#0D7287] dark:text-[#9BE7FA] font-bold">#{subItem.screenId.replace('screen-', '')}</span>
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* B. LUỒNG TRẢI NGHIỆM NGƯỜI DÙNG (DECISION FLOWCHART) */}
            <div className="space-y-4">
              <div className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <Workflow className="w-4 h-4" />
                <span>{isEn ? 'B. User Flow (Borrowing Decision Matrix)' : 'B. Luồng trải nghiệm người dùng (Quyết định mượn sách)'}</span>
              </div>

              {/* Decision Flowchart Grid */}
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
                <div className="flex items-center gap-3 min-w-[780px] text-xs font-medium">
                  {/* Step 1 */}
                  <div className="px-3.5 py-2.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA] text-white dark:text-[#04242C] font-bold shrink-0 shadow-xs">
                    Trang chủ
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 2 Decision */}
                  <div className="p-2.5 rounded-2xl bg-[#FFE485]/20 dark:bg-[#FFE485]/10 border border-[#FFD14C]/40 text-center shrink-0">
                    <span className="block font-bold text-slate-900 dark:text-white">Đã biết tên sách?</span>
                    <div className="flex gap-1.5 mt-1 text-xs">
                      <span className="px-2 py-0.5 rounded bg-[#C8EEF7] text-[#074553] font-bold">Có: Tìm kiếm</span>
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
                  <div className="p-2.5 rounded-2xl bg-[#FFE485]/20 dark:bg-[#FFE485]/10 border border-[#FFD14C]/40 text-center shrink-0">
                    <span className="block font-bold text-slate-900 dark:text-white">Còn sách trên xe?</span>
                    <div className="flex gap-1.5 mt-1 text-xs">
                      <span className="px-2 py-0.5 rounded bg-[#C8EEF7] text-[#074553] font-bold">Có: Mượn ngay</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">Hết: Đặt trước</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 5 Auth & Station Confirm */}
                  <div className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                    Xác nhận Trạm nhận
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 6 Complete */}
                  <div className="px-3.5 py-2.5 rounded-full bg-[#0D7287] hover:bg-[#074553] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-bold shrink-0 flex items-center gap-1.5 shadow-xs transition-colors">
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
                className="text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{isEn ? 'Open in new tab' : 'Mở toàn màn hình'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <iframe 
              src={`/library-bus/system-architecture.html?embed=1&theme=${resolvedTheme}`} 
              className="w-full h-[500px] sm:h-[580px] lg:h-[640px] max-h-[70vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition duration-300" 
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
                className="text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{isEn ? 'Open in new tab' : 'Mở toàn màn hình'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <iframe 
              src={`/library-bus/borrowing-workflow.html?embed=1&theme=${resolvedTheme}`} 
              className="w-full h-[500px] sm:h-[580px] lg:h-[640px] max-h-[70vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition duration-300" 
              title="Library Bus Borrowing Workflow Diagram" 
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default Chapter1UxResearch;
