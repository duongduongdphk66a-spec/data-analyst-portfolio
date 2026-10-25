'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Maximize2, Sparkles, FileCode2,
  ChevronLeft, ChevronRight, Columns2, LayoutGrid,
  Smartphone, Monitor, Download, ZoomIn, ZoomOut, X
} from 'lucide-react';
import { LIBRARY_BUS_20_SCREENS, LIBRARY_BUS_MOBILE_SCREENS } from '@/app/data/libraryBusData';
import { useLanguage } from '@/app/context/LanguageContext';

export interface VisualComparisonProps {
  isEn?: boolean;
  onOpenZoom?: (_imgUrl: string) => void;
}

export interface ScreenPairItem {
  id: string;
  num: number;
  nameVi: string;
  nameEn: string;
  slug: string;
  mobId: string;
  desktop: {
    wf: string;
    ui: string;
  };
  mobile: {
    wf: string;
    ui: string;
  };
}

export const SCREENS_20_PAIRS: ScreenPairItem[] = [
  { id: "1", num: 1, nameVi: "Trang chủ", nameEn: "Homepage", slug: "01_trang_chu" },
  { id: "2", num: 2, nameVi: "Giới thiệu", nameEn: "About Us", slug: "02_gioi_thieu" },
  { id: "3", num: 3, nameVi: "Danh sách sách", nameEn: "Book Catalog", slug: "03_danh_sach_sach" },
  { id: "4", num: 4, nameVi: "Chi tiết sách", nameEn: "Book Detail", slug: "04_chi_tiet_sach" },
  { id: "5", num: 5, nameVi: "Bản đồ & Tuyến xe", nameEn: "Bus Route & Map", slug: "05_danh_sach_xe_ban_do" },
  { id: "6", num: 6, nameVi: "Chi tiết xe buýt", nameEn: "Bus Fleet Detail", slug: "06_chi_tiet_xe_buyt" },
  { id: "7", num: 7, nameVi: "Quản lý thư viện", nameEn: "Library Admin", slug: "07_dashboard_quan_ly_thu_vien" },
  { id: "8", num: 8, nameVi: "Quyên góp sách", nameEn: "Book Donation", slug: "08_danh_sach_quyen_gop_sach" },
  { id: "9", num: 9, nameVi: "Tạo phiếu mượn", nameEn: "Borrow Order", slug: "09_tao_phieu_muon_sach" },
  { id: "10", num: 10, nameVi: "Đặt trước sách", nameEn: "Hold Reservation", slug: "10_tao_dat_truoc_sach" },
  { id: "11", num: 11, nameVi: "Dashboard Giao dịch", nameEn: "Transactions Dashboard", slug: "11_dashboard_giao_dich" },
  { id: "12", num: 12, nameVi: "Dashboard Độc giả", nameEn: "Reader Profile", slug: "12_dashboard_nguoi_dung" },
  { id: "13", num: 13, nameVi: "Đăng nhập", nameEn: "Login", slug: "13_dang_nhap" },
  { id: "14", num: 14, nameVi: "Đăng ký", nameEn: "Register", slug: "14_dang_ky" },
  { id: "15", num: 15, nameVi: "Blog Cộng đồng", nameEn: "Community Blog", slug: "15_blog_trang_chu" },
  { id: "16", num: 16, nameVi: "Chi tiết bài Blog", nameEn: "Article Detail", slug: "16_blog_chi_tiet_bai_viet" },
  { id: "17", num: 17, nameVi: "Thông báo", nameEn: "Notifications", slug: "17_thong_bao" },
  { id: "18", num: 18, nameVi: "Analytics Dashboard", nameEn: "Analytics Dashboard", slug: "18_analytics_dashboard" },
  { id: "19", num: 19, nameVi: "Hỏi đáp (FAQ)", nameEn: "FAQ", slug: "19_faq" },
  { id: "20", num: 20, nameVi: "Liên hệ", nameEn: "Contact Us", slug: "20_lien_he" },
].map((s) => ({
  ...s,
  mobId: s.slug.slice(0, 2),
  desktop: {
    wf: `/library-bus/screens/wf_${s.slug}.webp`,
    ui: `/library-bus/screens/ui_${s.slug}.webp`,
  },
  mobile: {
    wf: `/library-bus/mobile_screens/wf_mob_${s.slug.slice(0, 2)}.webp`,
    ui: `/library-bus/mobile_screens/ui_mob_${s.slug.slice(0, 2)}.webp`,
  },
}));

export const DESKTOP_SCREEN_HEIGHTS: Record<string, number> = {
  "1": 600, "2": 508, "3": 645, "4": 265, "5": 206,
  "6": 352, "7": 338, "8": 226, "9": 360, "10": 215,
  "11": 438, "12": 432, "13": 215, "14": 254, "15": 635,
  "16": 465, "17": 168, "18": 355, "19": 145, "20": 102,
};

export const MOBILE_SCREEN_HEIGHTS: Record<string, number> = {
  "1": 730, "2": 462, "3": 550, "4": 355, "5": 377,
  "6": 384, "7": 599, "8": 707, "9": 407, "10": 370,
  "11": 385, "12": 377, "13": 548, "14": 302, "15": 359,
  "16": 306, "17": 300, "18": 339, "19": 332, "20": 368,
};

export interface ScreenCohort {
  id: string;
  nameVi: string;
  nameEn: string;
  heightRange: string;
  screenIds: string[];
}

export const DESKTOP_COHORTS: ScreenCohort[] = [
  {
    id: 'long',
    nameVi: 'Trang dài & Duyệt danh mục',
    nameEn: 'Long-scroll Catalogs',
    heightRange: '~500px – 650px',
    screenIds: ['3', '15', '1', '2'],
  },
  {
    id: 'dashboard',
    nameVi: 'Bảng điều khiển & Bài viết',
    nameEn: 'Dashboards & Articles',
    heightRange: '~350px – 465px',
    screenIds: ['16', '11', '12', '9', '18', '6'],
  },
  {
    id: 'forms',
    nameVi: 'Biểu mẫu & Chi tiết tác vụ',
    nameEn: 'Action Forms & Details',
    heightRange: '~215px – 338px',
    screenIds: ['7', '4', '14', '8', '10', '13'],
  },
  {
    id: 'utilities',
    nameVi: 'Tiện ích & Bản đồ',
    nameEn: 'Utilities & Maps',
    heightRange: '~100px – 206px',
    screenIds: ['5', '17', '19', '20'],
  },
];

export const MOBILE_COHORTS: ScreenCohort[] = [
  {
    id: 'mob-tall',
    nameVi: 'Trang cuộn dài Mobile',
    nameEn: 'Tall Mobile Flows',
    heightRange: '~540px – 730px',
    screenIds: ['1', '8', '7', '3', '13', '2'],
  },
  {
    id: 'mob-medium',
    nameVi: 'Giao dịch & Điều hướng Mobile',
    nameEn: 'Medium Navigation Flows',
    heightRange: '~359px – 407px',
    screenIds: ['9', '11', '6', '5', '12', '10', '20', '15'],
  },
  {
    id: 'mob-compact',
    nameVi: 'Biểu mẫu gọn & Tiện ích Mobile',
    nameEn: 'Compact Screens',
    heightRange: '~300px – 355px',
    screenIds: ['4', '18', '19', '16', '14', '17'],
  },
];

export default function LibraryBusVisualComparison({ isEn: propIsEn, onOpenZoom }: VisualComparisonProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';

  // 1. Platform Tab: 'desktop' (20 screens) <-> 'mobile' (20 screens)
  const [platformTab, setPlatformTab] = useState<'desktop' | 'mobile'>('desktop');

  // 2. View Mode: 'continuous' (Dàn trang nối tiếp toàn bộ 20 cặp) vs 'single' (Đối chiếu chi tiết 1 cặp)
  const [viewLayout, setViewLayout] = useState<'continuous' | 'single'>('continuous');

  // 2b. Continuous Sorting Mode: 'matched' (Cùng kích thước / Cân đối chiều cao) vs 'sequential' (Thứ tự 1 - 20)
  const [sortMode, setSortMode] = useState<'matched' | 'sequential'>('matched');

  // 3. Highlighted screen ID when jumped from Sitemap (e.g. "1", "9")
  const [highlightedScreenId, setHighlightedScreenId] = useState<string>('1');
  const [highlightPulse, setHighlightPulse] = useState<boolean>(false);
  const pulseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 4. Single 1-to-1 Mode active screen
  const [activeScreenId, setActiveScreenId] = useState<string>('1');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [viewFitMode, setViewFitMode] = useState<'fit' | 'full'>('fit');

  // 5. Lightbox modal state
  const [lightboxImg, setLightboxImg] = useState<{
    src: string;
    title: string;
    subtitle: string;
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const comparisonTopRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleOpenLightbox = (src: string, title: string, subtitle: string) => {
    if (onOpenZoom) {
      onOpenZoom(src);
    } else {
      setLightboxImg({ src, title, subtitle });
      setZoomLevel(1);
    }
  };

  // Listen to external jump selection from Sitemap tree
  useEffect(() => {
    const handleCustomScreenSelect = (e: Event) => {
      const customEvt = e as CustomEvent<string | { screenId: string }>;
      const rawId = typeof customEvt.detail === 'string' ? customEvt.detail : customEvt.detail?.screenId;
      if (!rawId) return;

      // Extract numeric id from raw input
      const cleanNum = rawId.trim().replace(/^#/, '').replace(/^screen-/, '').replace(/^mob_/, '').replace(/^0+/, '') || '1';

      setHighlightedScreenId(cleanNum);
      setActiveScreenId(cleanNum);
      setHighlightPulse(true);

      // Smooth scroll to the target screen element
      const targetEl = document.getElementById(`screen-${cleanNum}`) || comparisonTopRef.current;
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      pulseTimerRef.current = setTimeout(() => {
        setHighlightPulse(false);
      }, 1600);
    };

    window.addEventListener('select-library-bus-screen', handleCustomScreenSelect);
    return () => {
      window.removeEventListener('select-library-bus-screen', handleCustomScreenSelect);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, []);

  // Keyboard navigation for single 1-to-1 mode
  const currentScreens = platformTab === 'desktop' ? LIBRARY_BUS_20_SCREENS : LIBRARY_BUS_MOBILE_SCREENS;
  const selectedScreen = currentScreens.find(s => s.id === activeScreenId) || currentScreens[0];
  const selectedIndex = currentScreens.findIndex(s => s.id === activeScreenId);

  useEffect(() => {
    if (viewLayout !== 'single') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toUpperCase();
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = selectedIndex > 0 ? selectedIndex - 1 : currentScreens.length - 1;
        setActiveScreenId(currentScreens[prevIdx].id);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = selectedIndex < currentScreens.length - 1 ? selectedIndex + 1 : 0;
        setActiveScreenId(currentScreens[nextIdx].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewLayout, selectedIndex, currentScreens]);

  // Auto-scroll the screen carousel to keep the active screen in view
  useEffect(() => {
    if (viewLayout === 'single' && carouselRef.current) {
      const activeBtn = carouselRef.current.querySelector(`[data-screen-id="${activeScreenId}"]`) as HTMLElement;
      if (activeBtn) {
        const container = carouselRef.current;
        const scrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
        container.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: 'smooth',
        });
      }
    }
  }, [viewLayout, activeScreenId]);

  return (
    <div id="visual-comparison" className="space-y-6 scroll-mt-24">
      {/* 03. TOP CONTROL STRIP: 2 TABS DESKTOP (20) <-> MOBILE (20) & LAYOUT SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl border border-[#0D7287]/20 shadow-xs dark:border-slate-700 bg-[#F0F9FB]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
              {isEn ? '03. Visual Design (20 Screen Pairs)' : '03. Thiết Kế Trực Quan (20 Cặp Giao Diện)'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {platformTab === 'desktop'
              ? (isEn ? 'Desktop Layout: 12 Columns | Width: 78px | Gutter: 24px' : 'Lưới Desktop: 12 Cột | Chiều rộng: 78px | Khoảng cách: 24px')
              : (isEn ? 'Mobile Layout: 4 Columns | Margin: 16px | Gutter: 16px' : 'Lưới Mobile: 4 Cột | Lề biên: 16px | Khoảng cách: 16px')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 2 Tabs: Desktop (20) <-> Mobile (20) */}
          <div className="inline-flex rounded-2xl border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-950 shadow-2xs">
            <button
              type="button"
              onClick={() => setPlatformTab('desktop')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                platformTab === 'desktop'
                  ? 'bg-slate-900 text-white dark:bg-[#9BE7FA] dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4 text-[#0D7287] dark:text-slate-950" />
              <span>Desktop (20)</span>
            </button>
            <button
              type="button"
              onClick={() => setPlatformTab('mobile')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                platformTab === 'mobile'
                  ? 'bg-slate-900 text-white dark:bg-[#9BE7FA] dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#FFE485]" />
              <span>Mobile (20)</span>
            </button>
          </div>

          {/* Layout Mode Toggle: Continuous feed (20 pairs) vs Single 1-to-1 */}
          <div className="inline-flex rounded-2xl border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-950 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewLayout('continuous')}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'continuous'
                  ? 'bg-[#0D7287] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isEn ? 'Continuous Layout (All 20 Pairs)' : 'Dàn trang nối tiếp (Toàn bộ 20 cặp)'}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">{isEn ? 'All 20 Pairs' : '20 Cặp nối tiếp'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('single')}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'single'
                  ? 'bg-[#0D7287] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isEn ? '1-to-1 Deep Inspection' : 'Đối chiếu từng cặp mẫu (Chi tiết)'}
            >
              <Columns2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isEn ? '1-to-1 Deep' : 'Chi tiết 1-1'}</span>
            </button>
          </div>

          {/* Raw Spec Link */}
          <a
            href={platformTab === 'desktop' ? '/library-bus/website.html' : '/library-bus/website-mobile.html'}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold transition shadow-xs flex items-center gap-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
            title={platformTab === 'desktop' ? 'Mở tài liệu HTML Desktop' : 'Mở tài liệu HTML Mobile'}
          >
            <FileCode2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span className="hidden md:inline">{platformTab === 'desktop' ? 'HTML Spec' : 'Mobile Spec'}</span>
          </a>
        </div>
      </div>

      {/* Smooth scroll anchor */}
      <div ref={comparisonTopRef} className="scroll-mt-32" />

      {/* Active Jump Confirmation Banner from Sitemap */}
      {highlightPulse && (
        <div className="p-4 rounded-2xl font-bold text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2 animate-in fade-in slide-in-from-top-3 duration-300 bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin text-[#FFE485] dark:text-amber-600" />
            <span>
              {isEn ? 'Jumped from Sitemap:' : 'Đã cuộn tới giao diện từ Sitemap:'} <b>#{highlightedScreenId} {SCREENS_20_PAIRS.find(s => s.id === highlightedScreenId)?.nameVi}</b>
            </span>
          </div>
          <span className="tabular-nums text-xs px-2.5 py-0.5 rounded-full bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-950">
            {platformTab === 'desktop' ? 'Desktop Grid 12 Columns' : 'Mobile Grid 4 Columns'}
          </span>
        </div>
      )}

      {/* LAYOUT A: CONTINUOUS 20-SCREEN FEED (DÀN TRANG NỐI TIẾP TOÀN BỘ 20 CẶP) */}
      {viewLayout === 'continuous' ? (
        <div className="space-y-6">
          {/* Sorting / Arrangement Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {isEn ? 'Arrangement:' : 'Sắp xếp:'}
              </span>
              <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setSortMode('matched')}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    sortMode === 'matched'
                      ? 'bg-[#0D7287] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{isEn ? 'Equal Height Cohorts (Balanced)' : 'Cùng kích thước (Cân đối)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSortMode('sequential')}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    sortMode === 'sequential'
                      ? 'bg-[#0D7287] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{isEn ? 'Numeric Order (1 → 20)' : 'Thứ tự Sitemap (1 → 20)'}</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              {sortMode === 'matched'
                ? (isEn ? 'Grouped by screen height to eliminate vertical gaps' : 'Các màn hình cùng chiều cao được ghép đôi cạnh nhau để loại bỏ lệch độ cao')
                : (isEn ? 'Sequential order from Sitemap #01 to #20' : 'Hiển thị tuần tự theo thứ tự số hiệu từ #01 đến #20')}
            </div>
          </div>

          {/* Render continuous screens either by height cohorts or flat 1-20 list */}
          {sortMode === 'matched' ? (
            <div className="space-y-8">
              {(platformTab === 'desktop' ? DESKTOP_COHORTS : MOBILE_COHORTS).map((cohort) => {
                const screenMap = new Map(SCREENS_20_PAIRS.map(s => [s.id, s]));
                const screensInCohort = cohort.screenIds
                  .map(id => screenMap.get(id))
                  .filter(Boolean) as ScreenPairItem[];

                return (
                  <div key={cohort.id} className="space-y-4">
                    {/* Cohort Header */}
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                        <h4 className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
                          {isEn ? cohort.nameEn : cohort.nameVi}
                        </h4>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {cohort.heightRange}
                        </span>
                      </div>
                      <span className="text-xs tabular-nums font-semibold text-slate-500">
                        {screensInCohort.length} {isEn ? 'screens' : 'màn hình'}
                      </span>
                    </div>

                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8 items-stretch">
                      {screensInCohort.map((s) => {
                        const isHighlighted = highlightedScreenId === s.id;
                        const currentPair = platformTab === 'desktop' ? s.desktop : s.mobile;
                        const screenHeight = platformTab === 'desktop'
                          ? DESKTOP_SCREEN_HEIGHTS[s.id]
                          : MOBILE_SCREEN_HEIGHTS[s.id];

                        return (
                          <div
                            key={s.id}
                            id={`screen-${s.id}`}
                            className={`h-full flex flex-col justify-between space-y-3.5 p-4 sm:p-5 rounded-3xl transition duration-500 scroll-mt-28 ${
                              isHighlighted
                                ? 'ring-4 ring-[#9BE7FA] bg-[#C8EEF7]/20 dark:bg-[#9BE7FA]/10 scale-[1.01]'
                                : 'border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900'
                            }`}
                          >
                            {/* Screen Card Header */}
                            <div className="flex justify-between items-center pb-2.5 border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center tabular-nums font-bold text-xs">
                                  {s.num}
                                </span>
                                <h3 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white">
                                  {isEn ? s.nameEn : s.nameVi}
                                </h3>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs tabular-nums font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0D7287] dark:text-[#9BE7FA]">
                                  {platformTab === 'desktop' ? `Web #${s.id}` : `Mob #${s.mobId}`}
                                </span>
                                {screenHeight && (
                                  <span className="text-xs tabular-nums font-medium px-2 py-0.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                                    {screenHeight}px
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* 2 Columns: Left Wireframe, Right UI Design */}
                            <div className="grid grid-cols-2 gap-3.5 items-start flex-1">
                              {/* Left: Wireframe */}
                              <div className="space-y-1.5 flex flex-col h-full">
                                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                                  <span>Wireframe</span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenLightbox(
                                      currentPair.wf,
                                      `${s.num}. ${s.nameVi} - Wireframe`,
                                      platformTab === 'desktop' ? 'Cấu trúc khung xám lưới 12 cột' : 'Bố cục dọc Mobile 4 cột'
                                    )}
                                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
                                    title="Phóng to"
                                  >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div 
                                  data-ui="image-frame" className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 cursor-zoom-in group relative flex-1 flex items-start"
                                  onClick={() => handleOpenLightbox(
                                    currentPair.wf,
                                    `${s.num}. ${s.nameVi} - Wireframe`,
                                    platformTab === 'desktop' ? 'Cấu trúc khung xám lưới 12 cột' : 'Bố cục dọc Mobile 4 cột'
                                  )}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={currentPair.wf}
                                    alt={`Wireframe ${s.nameVi} (${platformTab})`}
                                    loading="lazy"
                                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                                  />
                                </div>
                              </div>

                              {/* Right: UI Design */}
                              <div className="space-y-1.5 flex flex-col h-full">
                                <div className="flex justify-between items-center text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                                  <span>UI design</span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenLightbox(
                                      currentPair.ui,
                                      `${s.num}. ${s.nameVi} - UI Design`,
                                      platformTab === 'desktop' ? 'Giao diện màu hoàn chỉnh Desktop' : 'Giao diện màu hoàn chỉnh Mobile'
                                    )}
                                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
                                    title="Phóng to"
                                  >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div 
                                  data-ui="image-frame" className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 cursor-zoom-in group relative flex-1 flex items-start"
                                  onClick={() => handleOpenLightbox(
                                    currentPair.ui,
                                    `${s.num}. ${s.nameVi} - UI Design`,
                                    platformTab === 'desktop' ? 'Giao diện màu hoàn chỉnh Desktop' : 'Giao diện màu hoàn chỉnh Mobile'
                                  )}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={currentPair.ui}
                                    alt={`UI design ${s.nameVi} (${platformTab})`}
                                    loading="lazy"
                                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8 items-stretch">
              {SCREENS_20_PAIRS.map((s) => {
                const isHighlighted = highlightedScreenId === s.id;
                const currentPair = platformTab === 'desktop' ? s.desktop : s.mobile;
                const screenHeight = platformTab === 'desktop'
                  ? DESKTOP_SCREEN_HEIGHTS[s.id]
                  : MOBILE_SCREEN_HEIGHTS[s.id];

                return (
                  <div
                    key={s.id}
                    id={`screen-${s.id}`}
                    className={`h-full flex flex-col justify-between space-y-3.5 p-4 sm:p-5 rounded-3xl transition duration-500 scroll-mt-28 ${
                      isHighlighted
                        ? 'ring-4 ring-[#9BE7FA] bg-[#C8EEF7]/20 dark:bg-[#9BE7FA]/10 scale-[1.01]'
                        : 'border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {/* Screen Card Header */}
                    <div className="flex justify-between items-center pb-2.5 border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center tabular-nums font-bold text-xs">
                          {s.num}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white">
                          {isEn ? s.nameEn : s.nameVi}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs tabular-nums font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0D7287] dark:text-[#9BE7FA]">
                          {platformTab === 'desktop' ? `Web #${s.id}` : `Mob #${s.mobId}`}
                        </span>
                        {screenHeight && (
                          <span className="text-xs tabular-nums font-medium px-2 py-0.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                            {screenHeight}px
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2 Columns: Left Wireframe, Right UI Design */}
                    <div className="grid grid-cols-2 gap-3.5 items-start flex-1">
                      {/* Left: Wireframe */}
                      <div className="space-y-1.5 flex flex-col h-full">
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <span>Wireframe</span>
                          <button
                            type="button"
                            onClick={() => handleOpenLightbox(
                              currentPair.wf,
                              `${s.num}. ${s.nameVi} - Wireframe`,
                              platformTab === 'desktop' ? 'Cấu trúc khung xám lưới 12 cột' : 'Bố cục dọc Mobile 4 cột'
                            )}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
                            title="Phóng to"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div 
                          data-ui="image-frame" className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 cursor-zoom-in group relative flex-1 flex items-start"
                          onClick={() => handleOpenLightbox(
                            currentPair.wf,
                            `${s.num}. ${s.nameVi} - Wireframe`,
                            platformTab === 'desktop' ? 'Cấu trúc khung xám lưới 12 cột' : 'Bố cục dọc Mobile 4 cột'
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={currentPair.wf}
                            alt={`Wireframe ${s.nameVi} (${platformTab})`}
                            loading="lazy"
                            className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </div>
                      </div>

                      {/* Right: UI Design */}
                      <div className="space-y-1.5 flex flex-col h-full">
                        <div className="flex justify-between items-center text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                          <span>UI design</span>
                          <button
                            type="button"
                            onClick={() => handleOpenLightbox(
                              currentPair.ui,
                              `${s.num}. ${s.nameVi} - UI Design`,
                              platformTab === 'desktop' ? 'Giao diện màu hoàn chỉnh Desktop' : 'Giao diện màu hoàn chỉnh Mobile'
                            )}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
                            title="Phóng to"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div 
                          data-ui="image-frame" className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 cursor-zoom-in group relative flex-1 flex items-start"
                          onClick={() => handleOpenLightbox(
                            currentPair.ui,
                            `${s.num}. ${s.nameVi} - UI Design`,
                            platformTab === 'desktop' ? 'Giao diện màu hoàn chỉnh Desktop' : 'Giao diện màu hoàn chỉnh Mobile'
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={currentPair.ui}
                            alt={`UI design ${s.nameVi} (${platformTab})`}
                            loading="lazy"
                            className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* LAYOUT B: 1-TO-1 DEEP INSPECTION MODE WITH FULL CAROUSEL & SPECS */
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Module Filter Pills & Prev/Next */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2.5 pb-2 border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">{isEn ? 'Filter:' : 'Lọc phân hệ:'}</span>
                {['all', 'public', 'transactions', 'users', 'admin', 'blog'].map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => setModuleFilter(mod)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      moduleFilter === mod
                        ? 'bg-[#0D7287] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {mod.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* View Fit & Prev/Next */}
              <div className="flex items-center gap-2 shrink-0 ml-auto whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => setViewFitMode(prev => prev === 'fit' ? 'full' : 'fit')}
                  className="px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                >
                  <span>{viewFitMode === 'fit' ? 'Vừa vặn' : 'Kích thước gốc'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const prevIdx = selectedIndex > 0 ? selectedIndex - 1 : currentScreens.length - 1;
                    setActiveScreenId(currentScreens[prevIdx].id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trước</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = selectedIndex < currentScreens.length - 1 ? selectedIndex + 1 : 0;
                    setActiveScreenId(currentScreens[nextIdx].id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0D7287] hover:bg-[#0A5A6B] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>Tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Carousel Thumbnails */}
            <div ref={carouselRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {currentScreens
                .filter(s => moduleFilter === 'all' || s.module === moduleFilter)
                .map((screen) => {
                  const isActive = screen.id === activeScreenId;
                  return (
                    <button
                      key={screen.id}
                      type="button"
                      data-screen-id={screen.id}
                      onClick={() => setActiveScreenId(screen.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#0D7287] text-white shadow-xs border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded flex items-center justify-center tabular-nums text-xs font-black ${
                        isActive ? 'bg-[#FFD14C] text-slate-950 font-black' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {screen.index}
                      </span>
                      <span>{isEn ? screen.titleEn : screen.titleVi}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Master 1-to-1 Spread */}
          <div className="grid lg:grid-cols-2 gap-5 items-start">
            {/* Wireframe */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2.5 min-h-[52px] border-b-2 border-slate-300 dark:border-slate-700">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span>3.2 Wireframe: {isEn ? selectedScreen.titleEn : selectedScreen.titleVi}</span>
                  </h3>
                  <p className="text-xs text-slate-500">Khung xám chuẩn cấu trúc giao diện</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenLightbox(
                    selectedScreen.wireframeSrc,
                    `${selectedScreen.titleVi} - Wireframe`,
                    'Khung xám chuẩn bố cục'
                  )}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                </button>
              </div>

              <div 
                className="p-5 rounded-3xl bg-ground border border-stone-200 dark:bg-slate-900 dark:border-slate-800 cursor-zoom-in"
                onClick={() => handleOpenLightbox(
                  selectedScreen.wireframeSrc,
                  `${selectedScreen.titleVi} - Wireframe`,
                  'Khung xám chuẩn bố cục'
                )}
              >
                <div className={`rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 dark:bg-slate-950 dark:border-slate-800 flex justify-center p-3 ${
                  viewFitMode === 'fit' ? 'h-[58vh] max-h-[520px] items-center' : 'min-h-[420px] items-start'
                }`}>
                  <Image 
                    src={selectedScreen.wireframeSrc} 
                    alt={`${selectedScreen.titleVi} Wireframe`} 
                    width={1200}
                    height={800}
                    className="h-full max-h-full w-auto max-w-full object-contain rounded"
                  />
                </div>
              </div>
            </div>

            {/* UI Design */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2.5 min-h-[52px] border-b-2 border-slate-300 dark:border-slate-700">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                    <span className="text-slate-900 dark:text-white">3.3 UI Design: {isEn ? selectedScreen.titleEn : selectedScreen.titleVi}</span>
                  </h3>
                  <p className="text-xs text-slate-500">Giao diện hoàn chỉnh màu sắc thương hiệu</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenLightbox(
                    selectedScreen.uiSrc,
                    `${selectedScreen.titleVi} - UI Design`,
                    'Giao diện hoàn chỉnh'
                  )}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                </button>
              </div>

              <div 
                className="p-5 rounded-3xl bg-ground border border-[#9BE7FA]/40 dark:bg-slate-900 dark:border-[#9BE7FA]/30 cursor-zoom-in"
                onClick={() => handleOpenLightbox(
                  selectedScreen.uiSrc,
                  `${selectedScreen.titleVi} - UI Design`,
                  'Giao diện hoàn chỉnh'
                )}
              >
                <div className={`rounded-2xl overflow-hidden border border-[#9BE7FA]/30 bg-[#F0F9FB] dark:bg-slate-950 dark:border-slate-800 flex justify-center p-3 ${
                  viewFitMode === 'fit' ? 'h-[58vh] max-h-[520px] items-center' : 'min-h-[420px] items-start'
                }`}>
                  <Image 
                    src={selectedScreen.uiSrc} 
                    alt={`${selectedScreen.titleVi} UI Design`} 
                    width={1200}
                    height={800}
                    className="h-full max-h-full w-auto max-w-full object-contain rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Internal Fallback Lightbox Modal */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImg(null)}
        >
          <div 
            className="w-full max-w-6xl max-h-[95vh] flex flex-col bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-slate-800 bg-slate-950/80">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white">{lightboxImg.title}</h4>
                <p className="text-xs text-slate-400">{lightboxImg.subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs tabular-nums text-slate-400 w-12 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Phóng to"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <a
                  href={lightboxImg.src}
                  download="screen-preview.webp"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Tải ảnh gốc"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxImg(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Đóng modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Viewport */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/50 min-h-[350px]">
              <div 
                style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
                className="max-w-full max-h-full flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightboxImg.src}
                  alt={lightboxImg.title}
                  className="max-h-[80vh] w-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
