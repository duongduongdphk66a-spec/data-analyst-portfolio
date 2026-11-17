'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Maximize2, Sparkles, FileCode2,
  ChevronLeft, ChevronRight, Columns2, LayoutGrid,
  Smartphone, Monitor, Download, ZoomIn, ZoomOut, X
} from 'lucide-react';
import { LIBRARY_BUS_11_SCREENS, LIBRARY_BUS_MOBILE_SCREENS } from '@/app/data/libraryBusData';
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
  route: string;
  mobId: string;
  desktopHw: number;
  mobileHw: number;
  desktop: {
    wf: string;
    ui: string;
    dimLabel: string;
  };
  mobile: {
    wf: string;
    ui: string;
    dimLabel: string;
  };
}

const RAW_11_SPECS = [
  { id: "1", num: 1, nameVi: "Trang chủ", nameEn: "Homepage", slug: "01_trang_chu", route: "/", deskDim: "1440×3395", mobDim: "390×2586", deskHw: 2.36, mobHw: 6.63 },
  { id: "2", num: 2, nameVi: "Giới thiệu", nameEn: "About Us", slug: "02_gioi_thieu", route: "/about/", deskDim: "1440×3120", mobDim: "390×2775", deskHw: 2.17, mobHw: 7.12 },
  { id: "3", num: 3, nameVi: "Kho sách thư viện", nameEn: "Book Catalog", slug: "03_kho_sach", route: "/inventory/books/", deskDim: "1440×1836", mobDim: "390×760", deskHw: 1.28, mobHw: 1.95 },
  { id: "4", num: 4, nameVi: "Chi tiết sách", nameEn: "Book Detail", slug: "04_chi_tiet_sach", route: "/inventory/books/<uuid>/", deskDim: "1440×1140", mobDim: "390×1865", deskHw: 0.79, mobHw: 4.78 },
  { id: "5", num: 5, nameVi: "Quyên góp & Trao tặng sách", nameEn: "Book Donation Form", slug: "05_quyen_gop_sach", route: "/inventory/books/donate/", deskDim: "1440×900", mobDim: "390×944", deskHw: 0.63, mobHw: 2.42 },
  { id: "6", num: 6, nameVi: "Mạng lưới xe buýt lưu động", nameEn: "Mobile Bus Fleet Map", slug: "06_danh_sach_chuyen_xe", route: "/inventory/buses/", deskDim: "1440×900", mobDim: "390×743", deskHw: 0.63, mobHw: 1.91 },
  { id: "7", num: 7, nameVi: "Lộ trình & Điểm đón xe", nameEn: "Route & Stop Schedule", slug: "07_chi_tiet_lo_trinh", route: "/inventory/routes/<uuid>/", deskDim: "1440×1191", mobDim: "390×1300", deskHw: 0.83, mobHw: 3.33 },
  { id: "8", num: 8, nameVi: "Hồ sơ cá nhân & Thẻ thư viện", nameEn: "Reader Profile & Pass", slug: "08_ho_so_ban_doc", route: "/users/profile/", deskDim: "1440×978", mobDim: "390×844", deskHw: 0.68, mobHw: 2.16 },
  { id: "9", num: 9, nameVi: "Quản lý mượn trả sách", nameEn: "Borrow & Return Management", slug: "09_quan_ly_muon_tra", route: "/transactions/borrows/", deskDim: "1440×1218", mobDim: "390×1182", deskHw: 0.85, mobHw: 3.03 },
  { id: "10", num: 10, nameVi: "Báo cáo phân tích dữ liệu", nameEn: "Analytics Dashboard", slug: "10_analytics_dashboard", route: "/analytics/", deskDim: "1440×1644", mobDim: "390×1494", deskHw: 1.14, mobHw: 3.83 },
  { id: "11", num: 11, nameVi: "Trung tâm quản trị Django Admin", nameEn: "Django Admin Center", slug: "11_django_admin", route: "/admin/", deskDim: "1440×2149", mobDim: "390×1442", deskHw: 1.49, mobHw: 3.70 },
];

export const SCREENS_11_PAIRS: ScreenPairItem[] = RAW_11_SPECS.map((s) => ({
  id: s.id,
  num: s.num,
  nameVi: s.nameVi,
  nameEn: s.nameEn,
  slug: s.slug,
  route: s.route,
  mobId: s.slug.slice(0, 2),
  desktopHw: s.deskHw,
  mobileHw: s.mobHw,
  desktop: {
    wf: `/library-bus/screens/wf_${s.slug}.webp`,
    ui: `/library-bus/screens/screen_${s.slug}.webp`,
    dimLabel: s.deskDim,
  },
  mobile: {
    wf: `/library-bus/screens/wf_mobile_${s.slug}.webp`,
    ui: `/library-bus/screens/screen_mobile_${s.slug}.webp`,
    dimLabel: s.mobDim,
  },
}));

// Backward-compatible alias
export const SCREENS_20_PAIRS = SCREENS_11_PAIRS;

export const DESKTOP_SCREEN_HEIGHTS: Record<string, number> = {
  "1": 3395, "2": 3120, "3": 1836, "4": 1140, "5": 900,
  "6": 900, "7": 1191, "8": 978, "9": 1218, "10": 1644,
  "11": 2149,
};

export const MOBILE_SCREEN_HEIGHTS: Record<string, number> = {
  "1": 2586, "2": 2775, "3": 760, "4": 1865, "5": 944,
  "6": 743, "7": 1300, "8": 844, "9": 1182, "10": 1494,
  "11": 1442,
};

export interface ScreenCohort {
  id: string;
  nameVi: string;
  nameEn: string;
  heightRange: string;
  cols: 2 | 3;
  screenIds: string[];
}

export const DESKTOP_COHORTS: ScreenCohort[] = [
  {
    id: 'portals',
    nameVi: 'Nhóm 1: Trang chủ, Giới thiệu & Django Admin (Trang Dài)',
    nameEn: 'Cohort 1: Homepage, About & Django Admin (Long Pages)',
    heightRange: '1440 × 2149–3395px',
    cols: 3,
    screenIds: ['1', '2', '11'],
  },
  {
    id: 'catalog-analytics',
    nameVi: 'Nhóm 2: Kho Sách & Báo Cáo Analytics',
    nameEn: 'Cohort 2: Book Catalog & Analytics Dashboard',
    heightRange: '1440 × 1644–1836px',
    cols: 2,
    screenIds: ['3', '10'],
  },
  {
    id: 'operations',
    nameVi: 'Nhóm 3: Chi Tiết Sách, Lộ Trình & Quản Lý Mượn Trả',
    nameEn: 'Cohort 3: Book Detail, Route Schedule & Borrow Ops',
    heightRange: '1440 × 1140–1218px',
    cols: 3,
    screenIds: ['4', '7', '9'],
  },
  {
    id: 'compact-actions',
    nameVi: 'Nhóm 4: Quyên Góp Sách, Bản Đồ Đội Xe & Hồ Sơ Bạn Đọc',
    nameEn: 'Cohort 4: Donation Form, Fleet GPS Map & Reader Profile',
    heightRange: '1440 × 900–978px',
    cols: 3,
    screenIds: ['5', '6', '8'],
  },
];

export const MOBILE_COHORTS: ScreenCohort[] = [
  {
    id: 'mob-long',
    nameVi: 'Nhóm 1: Trang chủ & Giới thiệu Mobile (Cuộn Dài)',
    nameEn: 'Cohort 1: Homepage & About Mobile (Tall Views)',
    heightRange: '390 × 2586–2775px',
    cols: 2,
    screenIds: ['1', '2'],
  },
  {
    id: 'mob-medium-tall',
    nameVi: 'Nhóm 2: Chi Tiết Sách, Analytics & Django Admin Mobile',
    nameEn: 'Cohort 2: Book Detail, Analytics & Django Admin (Mobile)',
    heightRange: '390 × 1442–1865px',
    cols: 3,
    screenIds: ['4', '10', '11'],
  },
  {
    id: 'mob-routes-ops',
    nameVi: 'Nhóm 3: Lộ Trình, Quản Lý Mượn Trả & Quyên Góp Mobile',
    nameEn: 'Cohort 3: Routes, Borrow Ops & Donation (Mobile)',
    heightRange: '390 × 944–1300px',
    cols: 3,
    screenIds: ['7', '9', '5'],
  },
  {
    id: 'mob-compact',
    nameVi: 'Nhóm 4: Hồ Sơ, Kho Sách & Bản Đồ Đội Xe Mobile',
    nameEn: 'Cohort 4: Reader Profile, Catalog & Fleet Map (Mobile)',
    heightRange: '390 × 743–844px',
    cols: 3,
    screenIds: ['8', '3', '6'],
  },
];

/**
 * Distributes cards across `columnCount` shortest-first Masonry columns
 * using live measured image aspect ratios (falling back to expected ratios before load)
 * so columns pack tightly with zero vertical gap or orphan grid cells.
 */
function distributeMasonryColumns(
  items: ScreenPairItem[],
  columnCount: number,
  platform: 'desktop' | 'mobile',
  measuredRatios: Record<string, number>,
  measuredDims: Record<string, string>
): ScreenPairItem[][] {
  const columns: ScreenPairItem[][] = Array.from({ length: columnCount }, () => []);
  const heights = Array.from({ length: columnCount }, () => 0);

  for (const item of items) {
    const keyPrefix = platform;
    const wfRatio = measuredRatios[`${keyPrefix}-wf-${item.id}`] ?? (platform === 'desktop' ? item.desktopHw : item.mobileHw);
    const uiRatio = measuredRatios[`${keyPrefix}-ui-${item.id}`] ?? (platform === 'desktop' ? item.desktopHw : item.mobileHw);
    // Avoid lint unused warning if caller passes dims separately
    void measuredDims;
    const cardScore = Math.max(wfRatio, uiRatio) + 0.35;

    let minIdx = 0;
    for (let i = 1; i < columnCount; i++) {
      if (heights[i] < heights[minIdx]) {
        minIdx = i;
      }
    }
    columns[minIdx].push(item);
    heights[minIdx] += cardScore;
  }

  return columns;
}

export default function LibraryBusVisualComparison({ isEn: propIsEn, onOpenZoom }: VisualComparisonProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';

  // 1. Platform Tab: 'desktop' (11 screens) <-> 'mobile' (11 screens)
  const [platformTab, setPlatformTab] = useState<'desktop' | 'mobile'>('desktop');

  // 2. View Mode: 'continuous' (All 11 pairs visible in full) vs 'single' (1-to-1 deep inspection)
  const [viewLayout, setViewLayout] = useState<'continuous' | 'single'>('continuous');

  // 2b. Arrangement Mode: 'masonry' (Shortest-column balanced Masonry) vs 'cohorts' (Aspect-matched rows)
  const [sortMode, setSortMode] = useState<'masonry' | 'cohorts'>('masonry');

  // 3. Highlighted screen ID when jumped from Sitemap
  const [highlightedScreenId, setHighlightedScreenId] = useState<string>('1');
  const [highlightPulse, setHighlightPulse] = useState<boolean>(false);
  const pulseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 4. Single 1-to-1 Mode active screen
  const [activeScreenId, setActiveScreenId] = useState<string>('1');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  // 5. Measured real aspect ratios & dimensions from loaded images
  const [measuredRatios, setMeasuredRatios] = useState<Record<string, number>>({});
  const [measuredDims, setMeasuredDims] = useState<Record<string, string>>({});

  // 6. Lightbox modal state
  const [lightboxImg, setLightboxImg] = useState<{
    src: string;
    title: string;
    subtitle: string;
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const comparisonTopRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = (key: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.naturalWidth || !img.naturalHeight) return;
    const ratio = img.naturalHeight / img.naturalWidth;
    const dim = `${img.naturalWidth}×${img.naturalHeight}`;

    setMeasuredRatios((prev) => {
      if (prev[key] !== undefined && Math.abs(prev[key] - ratio) < 0.01) return prev;
      return { ...prev, [key]: ratio };
    });
    setMeasuredDims((prev) => {
      if (prev[key] === dim) return prev;
      return { ...prev, [key]: dim };
    });
  };

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

      const cleanNum = rawId.trim().replace(/^#/, '').replace(/^screen-/, '').replace(/^mob_/, '').replace(/^0+/, '') || '1';

      setHighlightedScreenId(cleanNum);
      setActiveScreenId(cleanNum);
      setHighlightPulse(true);

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
  const currentScreens = platformTab === 'desktop' ? LIBRARY_BUS_11_SCREENS : LIBRARY_BUS_MOBILE_SCREENS;
  const selectedScreen = currentScreens.find(s => s.id === activeScreenId) || currentScreens[0];
  const selectedPairMeta = SCREENS_11_PAIRS.find(s => s.id === activeScreenId) || SCREENS_11_PAIRS[0];
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

  const screenMap = new Map(SCREENS_11_PAIRS.map(s => [s.id, s]));

  /**
   * Renders a pure, clean 1:1 visual comparison card (Wireframe vs UI Design ONLY — zero injected text inside image columns).
   * Both images show 100% full height immediately with zero scrollbars.
   */
  const renderScreenPairCard = (s: ScreenPairItem) => {
    const isHighlighted = highlightedScreenId === s.id;
    const currentPair = platformTab === 'desktop' ? s.desktop : s.mobile;
    const uiDim = measuredDims[`${platformTab}-ui-${s.id}`] || currentPair.dimLabel;

    return (
      <div
        key={s.id}
        id={`screen-${s.id}`}
        className={`flex flex-col space-y-3 p-4 rounded-3xl transition duration-300 scroll-mt-28 ${
          isHighlighted
            ? 'ring-4 ring-[#9BE7FA] bg-[#C8EEF7]/20 dark:bg-[#9BE7FA]/10'
            : 'border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900'
        }`}
      >
        {/* Screen Card Header */}
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center tabular-nums font-bold text-xs shrink-0">
              {s.num}
            </span>
            <h3 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">
              {isEn ? s.nameEn : s.nameVi}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <code className="text-xs font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0D7287] dark:text-[#9BE7FA] font-semibold">
              {s.route}
            </code>
            <span className="text-xs tabular-nums font-medium px-2 py-0.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
              {uiDim}
            </span>
          </div>
        </div>

        {/* Pure Visual Pair: Left Wireframe | Right UI Design (100% Full Height, Zero Scrollbars) */}
        <div className="grid grid-cols-2 gap-3 items-start">
          {/* Left: Wireframe */}
          <div className="space-y-1.5 flex flex-col">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Wireframe</span>
              <button
                type="button"
                onClick={() => handleOpenLightbox(
                  currentPair.wf,
                  `${s.num}. ${s.nameVi} - Wireframe`,
                  platformTab === 'desktop' ? 'Cấu trúc khung xám lưới 12 cột' : 'Bố cục dọc Mobile 1 cột'
                )}
                className="min-h-[32px] min-w-[32px] p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer flex items-center justify-center"
                aria-label={isEn ? "Zoom wireframe" : "Phóng to wireframe"}
                title={isEn ? "Zoom wireframe" : "Phóng to wireframe"}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div
              data-ui="image-frame"
              className="w-full border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 cursor-zoom-in group"
              onClick={() => handleOpenLightbox(
                currentPair.wf,
                `${s.num}. ${s.nameVi} - Wireframe`,
                platformTab === 'desktop' ? 'Cấu trúc khung xám lưới 12 cột' : 'Bố cục dọc Mobile 1 cột'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPair.wf}
                alt={`Wireframe ${s.nameVi} (${platformTab})`}
                loading="lazy"
                onLoad={(e) => handleImageLoad(`${platformTab}-wf-${s.id}`, e)}
                className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
          </div>

          {/* Right: UI Design */}
          <div className="space-y-1.5 flex flex-col">
            <div className="flex justify-between items-center text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
              <span>UI Design</span>
              <button
                type="button"
                onClick={() => handleOpenLightbox(
                  currentPair.ui,
                  `${s.num}. ${s.nameVi} - UI Design (${uiDim})`,
                  platformTab === 'desktop' ? 'Giao diện hoàn chỉnh Desktop (1440px)' : 'Giao diện hoàn chỉnh Mobile (390px)'
                )}
                className="min-h-[32px] min-w-[32px] p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer flex items-center justify-center"
                aria-label={isEn ? "Zoom UI design" : "Phóng to giao diện UI"}
                title={isEn ? "Zoom UI design" : "Phóng to giao diện UI"}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div
              data-ui="image-frame"
              className="w-full border border-[#9BE7FA]/50 dark:border-slate-800 rounded-2xl overflow-hidden bg-[#FFFDF9] dark:bg-slate-950 cursor-zoom-in group"
              onClick={() => handleOpenLightbox(
                currentPair.ui,
                `${s.num}. ${s.nameVi} - UI Design (${uiDim})`,
                platformTab === 'desktop' ? 'Giao diện hoàn chỉnh Desktop (1440px)' : 'Giao diện hoàn chỉnh Mobile (390px)'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPair.ui}
                alt={`UI design ${s.nameVi} (${platformTab})`}
                loading="lazy"
                onLoad={(e) => handleImageLoad(`${platformTab}-ui-${s.id}`, e)}
                className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Pre-compute balanced Masonry columns using live measured ratios
  const masonryColumns = distributeMasonryColumns(
    SCREENS_11_PAIRS,
    platformTab === 'desktop' ? 2 : 3,
    platformTab,
    measuredRatios,
    measuredDims
  );

  return (
    <div id="visual-comparison" className="space-y-6 scroll-mt-24">
      {/* 03. TOP CONTROL STRIP: 2 TABS DESKTOP (11) <-> MOBILE (11) & LAYOUT SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl border border-[#0D7287]/20 dark:border-slate-700 bg-[#F0F9FB] dark:bg-slate-900">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
              {isEn ? '03. Visual Design (11 Core Screen Pairs)' : '03. Thiết Kế Trực Quan (11 Cặp Màn Hình Cốt Lõi)'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {platformTab === 'desktop'
              ? (isEn ? 'Desktop 1440px: 1:1 Wireframe vs UI paired cleanly in 2 auto-balanced Masonry columns (no scrollbars)' : 'Desktop 1440px: Đối chiếu 1:1 Wireframe và UI không thanh cuộn trong lưới 2 cột Masonry tự cân chiều cao')
              : (isEn ? 'Mobile 390px: 1:1 Wireframe vs UI paired cleanly across 3 auto-balanced Masonry columns (no scrollbars)' : 'Mobile 390px: Đối chiếu 1:1 Wireframe và UI không thanh cuộn trong lưới 3 cột Masonry tự cân chiều cao')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 2 Tabs: Desktop (11) <-> Mobile (11) */}
          <div className="inline-flex rounded-2xl border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setPlatformTab('desktop')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                platformTab === 'desktop'
                  ? 'bg-slate-900 text-white dark:bg-[#9BE7FA] dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4 text-[#0D7287] dark:text-slate-950" />
              <span>Desktop (11)</span>
            </button>
            <button
              type="button"
              onClick={() => setPlatformTab('mobile')}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                platformTab === 'mobile'
                  ? 'bg-slate-900 text-white dark:bg-[#9BE7FA] dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#FFD14C]" />
              <span>Mobile (11)</span>
            </button>
          </div>

          {/* Layout Mode Toggle: All 11 Pairs vs 1-to-1 Deep Inspection */}
          <div className="inline-flex rounded-2xl border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-950">
            <button
              type="button"
              onClick={() => setViewLayout('continuous')}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'continuous'
                  ? 'bg-[#0D7287] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isEn ? 'Full Masonry Gallery (All 11 Pairs)' : 'Dàn trang toàn bộ 11 cặp (Đầy đủ không cuộn)'}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">{isEn ? 'All 11 Pairs' : '11 Cặp nối tiếp'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('single')}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'single'
                  ? 'bg-[#0D7287] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isEn ? '1-to-1 Deep Inspection' : 'Đối chiếu chi tiết từng cặp 1-1'}
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
            className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold transition flex items-center gap-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
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
        <div className="p-4 rounded-2xl font-bold text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2 animate-in fade-in slide-in-from-top-3 duration-300 bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin text-[#FFE485] dark:text-amber-600" />
            <span>
              {isEn ? 'Jumped from Sitemap:' : 'Đã cuộn tới giao diện từ Sitemap:'} <b>#{highlightedScreenId} {SCREENS_11_PAIRS.find(s => s.id === highlightedScreenId)?.nameVi}</b>
            </span>
          </div>
          <span className="tabular-nums text-xs px-2.5 py-0.5 rounded-full bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-950">
            {platformTab === 'desktop' ? 'Desktop 1440px' : 'Mobile 390px'}
          </span>
        </div>
      )}

      {/* LAYOUT A: CONTINUOUS 11-SCREEN FEED (PURE IMAGES, FULL HEIGHT, ZERO SCROLLBARS) */}
      {viewLayout === 'continuous' ? (
        <div className="space-y-6">
          {/* Sorting / Arrangement Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {isEn ? 'Packing Mode:' : 'Kiểu dàn trang:'}
              </span>
              <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setSortMode('masonry')}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    sortMode === 'masonry'
                      ? 'bg-[#0D7287] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>
                    {platformTab === 'desktop'
                      ? (isEn ? 'Balanced 2-Column Masonry' : 'Masonry 2 cột tự cân bằng')
                      : (isEn ? 'Balanced 3-Column Masonry' : 'Masonry 3 cột tự cân bằng')}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSortMode('cohorts')}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    sortMode === 'cohorts'
                      ? 'bg-[#0D7287] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{isEn ? 'Grouped by Height (4 Cohorts)' : 'Phân nhóm cùng kích thước (4 Nhóm)'}</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              {isEn
                ? '100% full image visibility from top to bottom with zero scrollbars and automatic height-balanced columns.'
                : 'Hiển thị trọn vẹn 100% ảnh không thanh cuộn và tự cân cột theo kích thước thực tế của từng ảnh.'}
            </div>
          </div>

          {sortMode === 'masonry' ? (
            <div className={`grid grid-cols-1 ${platformTab === 'desktop' ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6 items-start`}>
              {masonryColumns.map((colItems, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-6">
                  {colItems.map((s) => renderScreenPairCard(s))}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {(platformTab === 'desktop' ? DESKTOP_COHORTS : MOBILE_COHORTS).map((cohort) => {
                const screensInCohort = cohort.screenIds
                  .map(id => screenMap.get(id))
                  .filter(Boolean) as ScreenPairItem[];

                return (
                  <div key={cohort.id} className="space-y-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 py-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                        <h4 className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
                          {isEn ? cohort.nameEn : cohort.nameVi}
                        </h4>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 tabular-nums">
                          {cohort.heightRange}
                        </span>
                      </div>
                      <span className="text-xs tabular-nums font-semibold text-slate-500">
                        {screensInCohort.length} {isEn ? 'screen pairs' : 'cặp màn hình'}
                      </span>
                    </div>

                    <div className={`grid grid-cols-1 ${cohort.cols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 items-start`}>
                      {screensInCohort.map((s) => renderScreenPairCard(s))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* LAYOUT B: 1-TO-1 DEEP INSPECTION MODE — PURE FULL-HEIGHT IMAGES + CLEAN SEPARATE SPEC */
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Module Filter Pills & Prev/Next */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 space-y-2 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2.5 pb-2 border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">{isEn ? 'Module:' : 'Phân hệ:'}</span>
                {['all', 'public', 'inventory', 'fleet', 'users', 'transactions', 'analytics', 'admin'].map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => setModuleFilter(mod)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      moduleFilter === mod
                        ? 'bg-[#0D7287] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {mod.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Prev / Next */}
              <div className="flex items-center gap-2 shrink-0 ml-auto whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    const prevIdx = selectedIndex > 0 ? selectedIndex - 1 : currentScreens.length - 1;
                    setActiveScreenId(currentScreens[prevIdx].id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isEn ? 'Prev' : 'Trước'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = selectedIndex < currentScreens.length - 1 ? selectedIndex + 1 : 0;
                    setActiveScreenId(currentScreens[nextIdx].id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0D7287] hover:bg-[#0A5A6B] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>{isEn ? 'Next' : 'Tiếp'}</span>
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
                          ? 'bg-[#0D7287] text-white border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]'
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

          {platformTab === 'desktop' ? (
            /* Desktop: Clean 2-column visual spread + Separate full-width Spec below */
            <div className="space-y-5">
              <div className="grid lg:grid-cols-2 gap-6 items-start">
                {/* Wireframe */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2.5 min-h-[52px] border-b-2 border-slate-300 dark:border-slate-700">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        <span>3.2 Wireframe: {isEn ? selectedScreen.titleEn : selectedScreen.titleVi}</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isEn ? 'Structural Lo-Fi wireframe blueprint' : 'Khung xám chuẩn cấu trúc bố cục'} • <code className="font-mono text-[#0D7287] dark:text-[#9BE7FA]">{selectedScreen.routePath}</code>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenLightbox(
                        selectedScreen.wireframeSrc,
                        `${selectedScreen.titleVi} - Wireframe`,
                        isEn ? 'Structural wireframe blueprint' : 'Khung xám chuẩn bố cục'
                      )}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    </button>
                  </div>

                  <div
                    className="p-3 sm:p-4 rounded-3xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 cursor-zoom-in"
                    onClick={() => handleOpenLightbox(
                      selectedScreen.wireframeSrc,
                      `${selectedScreen.titleVi} - Wireframe`,
                      isEn ? 'Structural wireframe blueprint' : 'Khung xám chuẩn bố cục'
                    )}
                  >
                    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedScreen.wireframeSrc}
                        alt={`${selectedScreen.titleVi} Wireframe`}
                        className="w-full h-auto block"
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
                      <p className="text-xs text-slate-500">
                        {isEn ? 'Production-ready interface (100% full height)' : 'Giao diện hoàn chỉnh (Hiển thị đầy đủ)'} • <span className="tabular-nums font-semibold">{measuredDims[`desktop-ui-${activeScreenId}`] || selectedScreen.badge}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenLightbox(
                        selectedScreen.uiSrc,
                        `${selectedScreen.titleVi} - UI Design`,
                        isEn ? 'Production UI design' : 'Giao diện hoàn chỉnh'
                      )}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    </button>
                  </div>

                  <div
                    className="p-3 sm:p-4 rounded-3xl bg-white border border-[#9BE7FA]/50 dark:bg-slate-900 dark:border-[#9BE7FA]/30 cursor-zoom-in"
                    onClick={() => handleOpenLightbox(
                      selectedScreen.uiSrc,
                      `${selectedScreen.titleVi} - UI Design`,
                      isEn ? 'Production UI design' : 'Giao diện hoàn chỉnh'
                    )}
                  >
                    <div className="w-full rounded-2xl overflow-hidden border border-[#9BE7FA]/30 bg-[#FFFDF9] dark:bg-slate-950 dark:border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedScreen.uiSrc}
                        alt={`${selectedScreen.titleVi} UI Design`}
                        className="w-full h-auto block"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dedicated Spec Block Below Images */}
              <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {isEn ? `Screen Specification: ${selectedScreen.titleEn}` : `Đặc tả màn hình: ${selectedScreen.titleVi}`}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isEn ? selectedScreen.descEn : selectedScreen.descVi}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs tabular-nums">
                    <span className="px-2.5 py-1 rounded-lg bg-[#C8EEF7]/40 text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] font-bold">
                      {isEn ? selectedScreen.moduleNameEn : selectedScreen.moduleNameVi}
                    </span>
                    <code className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                      {selectedScreen.templatePath}
                    </code>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {isEn ? 'Wireframe Structure & Layout Blocks' : 'Cấu trúc Khung Wireframe & Phân vùng'}
                    </div>
                    <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                      {selectedScreen.wireframeElements.map((el, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-slate-400 font-bold">•</span>
                          <span>{el}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 space-y-2">
                    <div className="font-bold text-[#074553] dark:text-[#9BE7FA]">
                      {isEn ? 'UI Components & Business Logic Highlights' : 'Thành phần UI & Điểm nhấn Nghiệp vụ'}
                    </div>
                    <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                      {selectedScreen.uiFeatures.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Mobile: 3-column spread (4 cols Wireframe | 4 cols UI Design | 4 cols sticky Spec) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Wireframe (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex justify-between items-center pb-2.5 min-h-[52px] border-b-2 border-slate-300 dark:border-slate-700">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <span>Wireframe (390px)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      <code className="font-mono text-[#0D7287] dark:text-[#9BE7FA]">{selectedScreen.routePath}</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenLightbox(
                      selectedScreen.wireframeSrc,
                      `${selectedScreen.titleVi} - Wireframe (Mobile)`,
                      'Bố cục dọc Mobile 1 cột'
                    )}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </button>
                </div>

                <div
                  className="p-3 rounded-3xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 cursor-zoom-in"
                  onClick={() => handleOpenLightbox(
                    selectedScreen.wireframeSrc,
                    `${selectedScreen.titleVi} - Wireframe (Mobile)`,
                    'Bố cục dọc Mobile 1 cột'
                  )}
                >
                  <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedScreen.wireframeSrc}
                      alt={`${selectedScreen.titleVi} Wireframe Mobile`}
                      className="w-full h-auto block"
                    />
                  </div>
                </div>
              </div>

              {/* UI Design (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex justify-between items-center pb-2.5 min-h-[52px] border-b-2 border-slate-300 dark:border-slate-700">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                      <span>UI Design ({measuredDims[`mobile-ui-${activeScreenId}`] || selectedPairMeta.mobile.dimLabel})</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isEn ? 'Full native mobile view' : 'Hiển thị trọn vẹn 100%'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenLightbox(
                      selectedScreen.uiSrc,
                      `${selectedScreen.titleVi} - UI Design (${selectedPairMeta.mobile.dimLabel})`,
                      'Giao diện Mobile hoàn chỉnh'
                    )}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </button>
                </div>

                <div
                  className="p-3 rounded-3xl bg-white border border-[#9BE7FA]/50 dark:bg-slate-900 dark:border-[#9BE7FA]/30 cursor-zoom-in"
                  onClick={() => handleOpenLightbox(
                    selectedScreen.uiSrc,
                    `${selectedScreen.titleVi} - UI Design (${selectedPairMeta.mobile.dimLabel})`,
                    'Giao diện Mobile hoàn chỉnh'
                  )}
                >
                  <div className="w-full rounded-2xl overflow-hidden border border-[#9BE7FA]/30 bg-[#FFFDF9] dark:bg-slate-950 dark:border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedScreen.uiSrc}
                      alt={`${selectedScreen.titleVi} UI Design Mobile`}
                      className="w-full h-auto block"
                    />
                  </div>
                </div>
              </div>

              {/* Sticky BA & UI Spec Column (4 cols) */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="space-y-1 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] font-bold text-xs">
                    {isEn ? selectedScreen.moduleNameEn : selectedScreen.moduleNameVi}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                    {isEn ? selectedScreen.titleEn : selectedScreen.titleVi}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn ? selectedScreen.descEn : selectedScreen.descVi}
                  </p>
                  <code className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs">
                    {selectedScreen.templatePath}
                  </code>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {isEn ? 'Wireframe Structure' : 'Cấu trúc Wireframe'}
                  </div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {selectedScreen.wireframeElements.map((el, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-slate-400 font-bold">•</span>
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/60 border border-[#C8EEF7] dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="font-bold text-[#074553] dark:text-[#9BE7FA]">
                    {isEn ? 'UI Components & BA Highlights' : 'Thành phần UI & Nghiệp vụ'}
                  </div>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {selectedScreen.uiFeatures.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
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
                  className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
                  aria-label={isEn ? "Zoom out" : "Thu nhỏ"}
                  title={isEn ? "Zoom out" : "Thu nhỏ"}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs tabular-nums text-slate-400 w-12 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                  className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
                  aria-label={isEn ? "Zoom in" : "Phóng to"}
                  title={isEn ? "Zoom in" : "Phóng to"}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <a
                  href={lightboxImg.src}
                  download="screen-preview.webp"
                  className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
                  aria-label={isEn ? "Download original image" : "Tải ảnh gốc"}
                  title={isEn ? "Download original image" : "Tải ảnh gốc"}
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxImg(null)}
                  className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
                  aria-label={isEn ? "Close modal" : "Đóng modal"}
                  title={isEn ? "Close modal" : "Đóng modal"}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Viewport */}
            <div className="flex-1 overflow-auto p-4 flex items-start justify-center bg-black/50 min-h-[350px]">
              <div 
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}
                className="max-w-full flex items-start justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightboxImg.src}
                  alt={lightboxImg.title}
                  className="w-auto max-w-full h-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
