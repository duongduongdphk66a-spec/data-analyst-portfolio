'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Maximize2, Sparkles, CheckCircle2, FileCode2,
  ChevronLeft, ChevronRight, Columns2,
  Smartphone, Monitor, Download, ZoomIn, ZoomOut, X
} from 'lucide-react';
import { LIBRARY_BUS_20_SCREENS, LIBRARY_BUS_MOBILE_SCREENS } from '@/app/data/libraryBusData';
import { useLanguage } from '@/app/context/LanguageContext';

export interface VisualComparisonProps {
  isEn?: boolean;
  onOpenZoom?: (_imgUrl: string) => void;
}

export default function LibraryBusVisualComparison({ isEn: propIsEn, onOpenZoom }: VisualComparisonProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  // Device mode: 'desktop' (20 screens) | 'mobile' (20 screens)
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  // Active Screen ID in 1-to-1 Side-by-Side mode
  const [activeScreenId, setActiveScreenId] = useState<string>('screen-01');

  // Filter for Module
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  // Lightbox modal state (fallback when onOpenZoom is not provided)
  const [lightboxImg, setLightboxImg] = useState<{
    src: string;
    title: string;
    subtitle: string;
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleOpenLightbox = (src: string, title: string, subtitle: string) => {
    if (onOpenZoom) {
      onOpenZoom(src);
    } else {
      setLightboxImg({ src, title, subtitle });
      setZoomLevel(1);
    }
  };

  // View fit mode: 'fit' (vừa vặn màn hình máy tính - không cần cuộn) | 'full' (kích thước đầy đủ - cuộn chi tiết)
  const [viewFitMode, setViewFitMode] = useState<'fit' | 'full'>('fit');

  // Refs for auto-scrolling to top of comparison card and carousel centering
  const comparisonTopRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const currentScreens = deviceMode === 'desktop' ? LIBRARY_BUS_20_SCREENS : LIBRARY_BUS_MOBILE_SCREENS;
  const selectedScreen = currentScreens.find(s => s.id === activeScreenId) || currentScreens[0];
  const selectedIndex = currentScreens.findIndex(s => s.id === activeScreenId);

  const handleDeviceModeChange = (mode: 'desktop' | 'mobile') => {
    setDeviceMode(mode);
    setModuleFilter('all');
    setActiveScreenId(mode === 'desktop' ? 'screen-01' : 'mob_01');
  };

  const handleSelectScreen = (id: string) => {
    setActiveScreenId(id);
  };

  const handlePrevScreen = () => {
    const prevIdx = selectedIndex > 0 ? selectedIndex - 1 : currentScreens.length - 1;
    setActiveScreenId(currentScreens[prevIdx].id);
  };

  const handleNextScreen = () => {
    const nextIdx = selectedIndex < currentScreens.length - 1 ? selectedIndex + 1 : 0;
    setActiveScreenId(currentScreens[nextIdx].id);
  };

  // Keyboard navigation: ArrowLeft / ArrowRight to switch screens quickly
  useEffect(() => {
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
  }, [selectedIndex, currentScreens]);

  // Auto-scroll the screen carousel to keep the active screen in view
  useEffect(() => {
    if (carouselRef.current) {
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
  }, [activeScreenId]);

  const filteredScreens = moduleFilter === 'all' 
    ? currentScreens 
    : currentScreens.filter(s => s.module === moduleFilter);

  const desktopFilters = [
    { id: 'all', label: isEn ? 'All (20)' : 'Tất cả (20)' },
    { id: 'public', label: isEn ? 'Public & Reader (8)' : 'Khách vãng lai & Độc giả (8)' },
    { id: 'transactions', label: isEn ? 'Lending (4)' : 'Lưu thông & Mượn trả (4)' },
    { id: 'users', label: isEn ? 'Account & Pass (4)' : 'Tài khoản & Hội viên (4)' },
    { id: 'admin', label: isEn ? 'Admin & Analytics (2)' : 'Quản trị & Phân tích (2)' },
    { id: 'blog', label: isEn ? 'Community News (2)' : 'Cộng đồng & Tin tức (2)' },
  ];

  const mobileFilters = [
    { id: 'all', label: isEn ? 'All Mobile (20)' : 'Tất cả Mobile (20)' },
    { id: 'public', label: isEn ? 'Public & Reader (8)' : 'Khách vãng lai & Độc giả (8)' },
    { id: 'transactions', label: isEn ? 'Lending (4)' : 'Lưu thông & Mượn trả (4)' },
    { id: 'users', label: isEn ? 'Account & Pass (4)' : 'Tài khoản & Hội viên (4)' },
    { id: 'admin', label: isEn ? 'Admin & Analytics (2)' : 'Quản trị & Phân tích (2)' },
    { id: 'blog', label: isEn ? 'Community News (2)' : 'Cộng đồng & Tin tức (2)' },
  ];

  const activeModuleFilters = deviceMode === 'desktop' ? desktopFilters : mobileFilters;

  return (
    <div className="space-y-6">
      {/* Device Mode Switcher (Desktop vs Mobile) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-gradient-to-r from-[#F0F9FB] via-white to-[#FAFDFE] border border-[#0D7287]/20 shadow-xs dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
            {isEn ? 'Device Viewport:' : 'Chế độ hiển thị:'}
          </span>
          <div className="flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs dark:bg-slate-950 dark:border-slate-800">
            <button
              onClick={() => handleDeviceModeChange('desktop')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer min-h-[38px] ${
                deviceMode === 'desktop'
                  ? 'bg-[#0D7287] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>{isEn ? 'Desktop (20 Screens)' : 'Desktop (20 màn hình)'}</span>
            </button>
            <button
              onClick={() => handleDeviceModeChange('mobile')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer min-h-[38px] ${
                deviceMode === 'mobile'
                  ? 'bg-[#FFD14C] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{isEn ? 'Mobile (20 Screens Matched)' : 'Mobile (20 màn hình chuẩn)'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={deviceMode === 'desktop' ? '/library-bus/website.html' : '/library-bus/website-mobile.html'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 cursor-pointer min-h-[38px]"
            title={deviceMode === 'desktop' ? 'Mở tài liệu thiết kế Desktop HTML' : 'Mở tài liệu thiết kế Mobile HTML'}
          >
            <FileCode2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>{deviceMode === 'desktop' ? (isEn ? 'Desktop Spec (HTML)' : 'Tài liệu Desktop (HTML)') : (isEn ? 'Mobile Spec (HTML)' : 'Tài liệu Mobile (HTML)')}</span>
          </a>
        </div>
      </div>

      {/* Navigation Mode Tabs: Chỉ giữ 'Đối Chiếu Từng Cặp Template (Mẫu Chuẩn)' */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          <div className="px-5 py-2.5 rounded-2xl text-sm sm:text-base font-bold flex items-center gap-2.5 bg-[#0D7287] text-white shadow-md">
            <Columns2 className="w-5 h-5" />
            <span>{isEn ? '1-to-1 Template Pairs (Left Wireframe, Right UI)' : 'Đối Chiếu Từng Cặp Template (Mẫu Chuẩn)'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentScreens.length} Wireframes + {currentScreens.length} UI designs</span>
        </div>
      </div>

      {/* 1-to-1 TEMPLATE PAIRS (WIREFRAME LEFT, UI DESIGN RIGHT) */}
      <div className="space-y-4 animate-in fade-in duration-300">
        {/* Top Control Bar: Compact non-sticky layout */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 dark:bg-slate-900 dark:border-slate-800">
          {/* Module Filter Pills & Prev/Next & View Mode in a single slim line */}
          <div className="flex items-center justify-between gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink">
              {activeModuleFilters.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModuleFilter(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    moduleFilter === m.id
                      ? 'bg-[#0D7287] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* View Fit Mode Toggle & Prev / Next controls */}
            <div className="flex items-center gap-2 shrink-0 ml-auto whitespace-nowrap">
              <button
                onClick={() => setViewFitMode(prev => prev === 'fit' ? 'full' : 'fit')}
                className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  viewFitMode === 'fit'
                    ? 'bg-[#0D7287] text-white border-[#0D7287]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                }`}
                title={viewFitMode === 'fit' ? 'Chuyển sang kích thước gốc đầy đủ' : 'Chuyển sang chế độ vừa vặn màn hình'}
              >
                <span>{viewFitMode === 'fit' ? 'Vừa vặn' : 'Kích thước gốc'}</span>
              </button>

              <button
                onClick={handlePrevScreen}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center gap-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                title="Phím tắt: Mũi tên trái (←)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Trước</span>
              </button>

              <button
                onClick={handleNextScreen}
                className="px-3 py-1.5 rounded-xl bg-[#0D7287] hover:bg-[#0A5A6B] text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                title="Phím tắt: Mũi tên phải (→)"
              >
                <span>Tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick 5 Key Screens Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
              {isEn ? 'Key Screens:' : '5 Màn hình tiêu điểm:'}
            </span>
            {[
              { id: deviceMode === 'desktop' ? 'screen-01' : 'mob_01', num: '01', nameVi: 'Trang chủ', nameEn: 'Home' },
              { id: deviceMode === 'desktop' ? 'screen-04' : 'mob_04', num: '04', nameVi: 'Chi tiết sách', nameEn: 'Book Detail' },
              { id: deviceMode === 'desktop' ? 'screen-05' : 'mob_05', num: '05', nameVi: 'Bản đồ Xe', nameEn: 'Bus Map' },
              { id: deviceMode === 'desktop' ? 'screen-09' : 'mob_09', num: '09', nameVi: 'Phiếu mượn', nameEn: 'Borrow Slip' },
              { id: deviceMode === 'desktop' ? 'screen-18' : 'mob_18', num: '18', nameVi: 'Analytics', nameEn: 'Analytics' }
            ].map((s) => {
              const isActive = activeScreenId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectScreen(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#323987] text-white shadow-xs'
                      : 'bg-[#C8EEF7]/50 text-[#0D7287] hover:bg-[#C8EEF7] dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <span className="font-mono">{s.num}.</span>
                  <span>{isEn ? s.nameEn : s.nameVi}</span>
                </button>
              );
            })}
          </div>

          {/* Full Screen Carousel with Auto-centering */}
          <div ref={carouselRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {filteredScreens.map((screen) => {
              const isActive = screen.id === activeScreenId;
              return (
                <button
                  key={screen.id}
                  data-screen-id={screen.id}
                  onClick={() => handleSelectScreen(screen.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0D7287] text-white shadow-xs border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800'
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center font-mono text-xs font-black ${
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

        {/* Smooth scroll anchor for screen switching */}
        <div ref={comparisonTopRef} className="scroll-mt-36" />

        {/* Compact Active Screen Metadata Strip */}
        <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#C8EEF7]/40 via-white to-[#F0F9FB] border border-[#9BE7FA]/50 shadow-xs flex flex-wrap items-center justify-between gap-3 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:border-slate-700 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-md bg-[#0D7287] text-white font-mono text-xs sm:text-sm font-black">
              Màn #{selectedScreen.index.toString().padStart(2, '0')}
            </span>
            <h3 className="font-sans font-black text-base sm:text-lg text-[#0D7287] dark:text-[#9BE7FA]">
              {isEn ? selectedScreen.titleEn : selectedScreen.titleVi}
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-[#C8EEF7]/50 text-[#0D7287] border border-[#9BE7FA]/40 font-bold dark:bg-slate-800 dark:text-[#9BE7FA]">
              {selectedScreen.moduleNameVi}
            </span>
            <span className="font-mono text-slate-500 hidden sm:inline">
              {isEn ? 'Route:' : 'Đường dẫn:'} <code className="text-[#0D7287] font-bold dark:text-[#9BE7FA]">{selectedScreen.routePath}</code>
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden lg:inline text-stone-600 dark:text-slate-300 max-w-md truncate">
              {isEn ? selectedScreen.descEn : selectedScreen.descVi}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-white border border-stone-200 text-stone-700 font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-stone-300">
              Quyền: {selectedScreen.role}
            </span>
          </div>
        </div>

        {/* THE MASTERPIECE SPREAD: WIREFRAME (LEFT) VS UI DESIGN (RIGHT) */}
        <div className="grid lg:grid-cols-2 gap-5 items-start">
          {/* LEFT COLUMN: WIREFRAME */}
          <div className="space-y-3">
            {/* Header: Exact clean typography as sample image */}
            <div className="flex justify-between items-center pb-2.5 min-h-[58px] border-b-2 border-slate-300 dark:border-slate-700">
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0 inline-block" />
                  <span>3.2 Wireframe — {isEn ? selectedScreen.titleEn : selectedScreen.titleVi}</span>
                </h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">Khung xám chuẩn cấu trúc, phân bổ lưới 12 cột</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <button
                  onClick={() => handleOpenLightbox(
                    selectedScreen.wireframeSrc,
                    `${selectedScreen.titleVi} - Wireframe`,
                    'Cấu trúc khung xám lưới 12 cột'
                  )}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Phóng to Wireframe"
                >
                  <Maximize2 className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                </button>
                <a
                  href={selectedScreen.wireframeSrc}
                  download={`wf_${selectedScreen.id}.png`}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Tải ảnh Wireframe"
                >
                  <Download className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                </a>
              </div>
            </div>

            {/* Wireframe Canvas Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all dark:bg-slate-900 dark:border-slate-800 group relative">
              <div 
                className={`rounded-2xl overflow-hidden border border-slate-200 bg-white flex justify-center p-3 cursor-zoom-in dark:bg-slate-950 dark:border-slate-800 transition-all ${
                  viewFitMode === 'fit' 
                    ? 'h-[58vh] max-h-[520px] min-h-[360px] items-center' 
                    : 'min-h-[420px] items-start'
                }`}
                onClick={() => handleOpenLightbox(
                  selectedScreen.wireframeSrc,
                  `${selectedScreen.titleVi} - Wireframe`,
                  'Cấu trúc khung xám lưới 12 cột'
                )}
              >
                <Image 
                  src={selectedScreen.wireframeSrc} 
                  alt={`${selectedScreen.titleVi} Wireframe`}
                  width={1200}
                  height={800}
                  className={`${viewFitMode === 'fit' ? 'h-full max-h-full' : 'max-h-[750px]'} w-auto max-w-full object-contain rounded transition-transform duration-300 group-hover:scale-[1.01]`} 
                />
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs sm:text-sm text-slate-500 font-mono">
                <span>Khung xám: Grayscale wireframe</span>
                <span className="text-[#0D7287] font-bold dark:text-[#9BE7FA]">Lưới 12 cột quy chuẩn</span>
              </div>
            </div>

            {/* Wireframe Specs List */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                Cấu trúc thành phần Wireframe:
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedScreen.wireframeElements.map((elem, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                    • {elem}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: UI DESIGN */}
          <div className="space-y-3">
            {/* Header: Exact clean typography as sample image */}
            <div className="flex justify-between items-center pb-2.5 min-h-[58px] border-b-2 border-[#FA6933]">
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-[#FA6933] tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FA6933] shrink-0 inline-block" />
                  <span>3.3 UI Design — {isEn ? selectedScreen.titleEn : selectedScreen.titleVi}</span>
                </h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">Giao diện thành phẩm hoàn chỉnh, bảng màu thương hiệu</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <button
                  onClick={() => handleOpenLightbox(
                    selectedScreen.uiSrc,
                    `${selectedScreen.titleVi} - UI Design`,
                    'Giao diện hoàn chỉnh, bảng màu 6 tông'
                  )}
                  className="p-2.5 rounded-xl bg-[#C8EEF7]/30 hover:bg-[#FFE485]/40 text-[#0D7287] border border-[#9BE7FA]/40 transition-colors dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 cursor-pointer"
                  title="Phóng to UI Design"
                >
                  <Maximize2 className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                </button>
                <a
                  href={selectedScreen.uiSrc}
                  download={`ui_${selectedScreen.id}.png`}
                  className="p-2.5 rounded-xl bg-[#C8EEF7]/30 hover:bg-[#FFE485]/40 text-[#0D7287] border border-[#9BE7FA]/40 transition-colors dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 cursor-pointer"
                  title="Tải ảnh UI Design"
                >
                  <Download className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                </a>
              </div>
            </div>

            {/* UI Design Canvas Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-ground border border-[#9BE7FA]/40 shadow-md hover:shadow-lg transition-all dark:bg-slate-900 dark:border-[#9BE7FA]/30 group relative">
              <div 
                className={`rounded-2xl overflow-hidden border border-[#9BE7FA]/30 bg-[#F0F9FB] flex justify-center p-3 cursor-zoom-in dark:bg-slate-950 dark:border-slate-800 transition-all ${
                  viewFitMode === 'fit' 
                    ? 'h-[58vh] max-h-[520px] min-h-[360px] items-center' 
                    : 'min-h-[420px] items-start'
                }`}
                onClick={() => handleOpenLightbox(
                  selectedScreen.uiSrc,
                  `${selectedScreen.titleVi} - UI Design`,
                  'Giao diện hoàn chỉnh, bảng màu 6 tông'
                )}
              >
                <Image 
                  src={selectedScreen.uiSrc} 
                  alt={`${selectedScreen.titleVi} UI Design`} 
                  width={1200}
                  height={800}
                  className={`${viewFitMode === 'fit' ? 'h-full max-h-full' : 'max-h-[750px]'} w-auto max-w-full object-contain rounded transition-transform duration-300 group-hover:scale-[1.01]`} 
                />
              </div>

              <div className="mt-3.5 pt-3 border-t border-[#9BE7FA]/20 dark:border-slate-800 flex justify-between items-center text-xs sm:text-sm text-slate-500 font-mono">
                <span>Hệ màu: #9BE7FA, #C8EEF7, #FFE485, #FFD14C</span>
                <span className="text-[#0D7287] font-bold dark:text-[#9BE7FA]">
                  Bản trình bày chuẩn hồ sơ
                </span>
              </div>
            </div>

            {/* UI Features Specs List */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#C8EEF7]/20 border border-[#9BE7FA]/40 space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2 font-sans">
                <Sparkles className="w-4 h-4 text-[#FFD14C]" />
                Điểm nhấn thiết kế giao diện (UI Highlights):
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedScreen.uiFeatures.map((feat, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-[#9BE7FA]/40 text-[#0D7287] text-xs sm:text-sm font-bold shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Fallback Lightbox Modal */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImg(null)}
        >
          <div 
            className="w-full max-w-6xl max-h-[95vh] flex flex-col bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950/80">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white">{lightboxImg.title}</h4>
                <p className="text-xs text-slate-400">{lightboxImg.subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-400 w-12 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Phóng to"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <a
                  href={lightboxImg.src}
                  download="library_bus_image.png"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Tải ảnh gốc"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setLightboxImg(null)}
                  className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors ml-2"
                  title="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Viewport */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/50">
              <Image 
                src={lightboxImg.src} 
                alt={lightboxImg.title} 
                width={1600}
                height={1200}
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                className="max-h-[80vh] w-auto object-contain transition-transform duration-200 select-none shadow-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { LibraryBusVisualComparison };
