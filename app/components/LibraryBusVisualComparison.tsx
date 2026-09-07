'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bus, Download, Maximize2, Minimize2, Wifi, Wind, 
  BatteryCharging, Coffee, Layers, Grid, 
  ZoomIn, ZoomOut, X, ArrowRight, BookOpen,
  CheckCircle2, Sparkles, FileCode2,
  ChevronLeft, ChevronRight, SplitSquareVertical, Columns2, ArrowLeftRight,
  Smartphone, Monitor
} from 'lucide-react';
import { LIBRARY_BUS_20_SCREENS, LIBRARY_BUS_MOBILE_SCREENS, LIBRARY_BUS_SYSTEM_PARADIGMS } from '../data/libraryBusData';

interface VisualComparisonProps {
  isEn: boolean;
  onOpenZoom?: (_imgUrl: string) => void;
}

// Wireframe Cross Box Helper (Image Placeholder with Diagonal 'X')
export function WireframeCrossBox({ 
  className = '', 
  aspect = 'aspect-video' 
}: { 
  className?: string; 
  aspect?: string; 
}) {
  return (
    <div className={`relative bg-[#E8EAEF] border border-[#CBD5E1] rounded overflow-hidden flex items-center justify-center ${aspect} ${className}`}>
      <svg className="absolute inset-0 w-full h-full text-[#CBD5E1] stroke-current" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100" y2="100" strokeWidth="0.8" />
        <line x1="100" y1="0" x2="0" y2="100" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

// Wireframe Skeleton Bar Helper
export function WireframeBar({ 
  w = 'w-full', 
  h = 'h-2', 
  rounded = 'rounded-xs', 
  className = '' 
}: { 
  w?: string; 
  h?: string; 
  rounded?: string; 
  className?: string; 
}) {
  return <div className={`bg-[#CBD5E1] ${w} ${h} ${rounded} ${className}`} />;
}

// Wireframe Skeleton Pill / Button Helper
export function WireframePill({ 
  w = 'w-14', 
  h = 'h-5', 
  className = '' 
}: { 
  w?: string; 
  h?: string; 
  className?: string; 
}) {
  return <div className={`bg-[#94A3B8] rounded-full ${w} ${h} ${className}`} />;
}

export default function LibraryBusVisualComparison({ isEn, onOpenZoom }: VisualComparisonProps) {
  // Device mode: 'desktop' (20 screens) | 'mobile' (20 screens)
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  // Main view mode tab: 'side-by-side' (default) | 'all-pairs' | 'master-boards' | 'mockup-specs'
  const [mainTab, setMainTab] = useState<'side-by-side' | 'system-comparison' | 'all-pairs' | 'master-boards' | 'mockup-specs'>('side-by-side');
  const [crossDeviceIdx, setCrossDeviceIdx] = useState<number>(0);

  // Active Screen ID in 1-to-1 Side-by-Side mode
  const [activeScreenId, setActiveScreenId] = useState<string>('screen-01');

  // UI view type in Side-by-Side mode: 'sheet' (cropped presentation template) | 'full' (full web screenshot)
  const [uiViewType, setUiViewType] = useState<'sheet' | 'full'>('sheet');

  // Filter for Module
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  // Master boards filter
  const [masterBoardFilter, setMasterBoardFilter] = useState<'both' | 'ui' | 'wireframe' | 'reference'>('both');

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

  const scrollToTop = () => {
    if (comparisonTopRef.current) {
      comparisonTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDeviceModeChange = (mode: 'desktop' | 'mobile') => {
    setDeviceMode(mode);
    setModuleFilter('all');
    setActiveScreenId(mode === 'desktop' ? 'screen-01' : 'mob_01');
    scrollToTop();
  };

  const handleSelectScreen = (id: string) => {
    setActiveScreenId(id);
    scrollToTop();
  };

  const handlePrevScreen = () => {
    const prevIdx = selectedIndex > 0 ? selectedIndex - 1 : currentScreens.length - 1;
    setActiveScreenId(currentScreens[prevIdx].id);
    scrollToTop();
  };

  const handleNextScreen = () => {
    const nextIdx = selectedIndex < currentScreens.length - 1 ? selectedIndex + 1 : 0;
    setActiveScreenId(currentScreens[nextIdx].id);
    scrollToTop();
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
        scrollToTop();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = selectedIndex < currentScreens.length - 1 ? selectedIndex + 1 : 0;
        setActiveScreenId(currentScreens[nextIdx].id);
        scrollToTop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, currentScreens]);

  // Center active screen button in the horizontal carousel
  useEffect(() => {
    if (carouselRef.current) {
      const activeBtn = carouselRef.current.querySelector(`[data-screen-id="${activeScreenId}"]`) as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeScreenId]);

  const filteredScreens = moduleFilter === 'all' 
    ? currentScreens 
    : currentScreens.filter(s => s.module === moduleFilter);

  const desktopFilters = [
    { id: 'all', label: isEn ? 'All (20)' : 'Tất cả (20)' },
    { id: 'public', label: isEn ? 'Public & Reader (8)' : 'Khách vãng lai & Độc giả (8)' },
    { id: 'transactions', label: isEn ? 'Circulation (4)' : 'Lưu thông & Mượn trả (4)' },
    { id: 'users', label: isEn ? 'Account & Pass (4)' : 'Tài khoản & Hội viên (4)' },
    { id: 'admin', label: isEn ? 'Admin & Telemetry (2)' : 'Quản trị & Phân tích (2)' },
    { id: 'blog', label: isEn ? 'Community News (2)' : 'Cộng đồng & Tin tức (2)' },
  ];

  const mobileFilters = [
    { id: 'all', label: isEn ? 'All Mobile (20)' : 'Tất cả Mobile (20)' },
    { id: 'public', label: isEn ? 'Public & Reader (8)' : 'Khách vãng lai & Độc giả (8)' },
    { id: 'transactions', label: isEn ? 'Circulation (4)' : 'Lưu thông & Mượn trả (4)' },
    { id: 'users', label: isEn ? 'Account & Pass (4)' : 'Tài khoản & Hội viên (4)' },
    { id: 'admin', label: isEn ? 'Admin & Telemetry (2)' : 'Quản trị & Phân tích (2)' },
    { id: 'blog', label: isEn ? 'Community News (2)' : 'Cộng đồng & Tin tức (2)' },
  ];

  const activeModuleFilters = deviceMode === 'desktop' ? desktopFilters : mobileFilters;

  // =========================================================================
  // RENDER HELPERS FOR MOCKUP SPECS (SHEET 1 & 2)
  // =========================================================================
  const renderBookDetailWireframe = (sheetNum: 1 | 2) => {
    if (sheetNum === 1) {
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-slate-300" />
              <WireframeBar w="w-16" h="h-3" />
            </div>
            <div className="hidden sm:flex gap-2">
              <WireframeBar w="w-8" h="h-2" />
              <WireframeBar w="w-8" h="h-2" />
              <WireframeBar w="w-8" h="h-2" />
            </div>
            <WireframePill w="w-12" h="h-4" />
          </div>

          <div className="flex gap-2 items-center">
            <WireframeBar w="w-10" h="h-1.5" />
            <span className="text-[10px] text-slate-300">&gt;</span>
            <WireframeBar w="w-12" h="h-1.5" />
            <span className="text-[10px] text-slate-300">&gt;</span>
            <WireframeBar w="w-16" h="h-1.5" />
          </div>

          <div className="space-y-1">
            <WireframeBar w="w-48" h="h-4" />
            <WireframeBar w="w-32" h="h-2" />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <WireframeCrossBox aspect="aspect-4/3" className="w-full" />
            </div>
            <div className="col-span-1 flex flex-col gap-1.5">
              <WireframeCrossBox aspect="aspect-square" className="w-full" />
              <WireframeCrossBox aspect="aspect-square" className="w-full" />
              <WireframeCrossBox aspect="aspect-square" className="w-full" />
            </div>
          </div>

          <div className="p-2 bg-slate-100 rounded-lg flex justify-between items-center">
            <div className="flex gap-1 items-center"><div className="w-3 h-3 rounded bg-slate-300" /><WireframeBar w="w-6" h="h-1.5" /></div>
            <div className="flex gap-1 items-center"><div className="w-3 h-3 rounded bg-slate-300" /><WireframeBar w="w-6" h="h-1.5" /></div>
            <div className="flex gap-1 items-center"><div className="w-3 h-3 rounded bg-slate-300" /><WireframeBar w="w-6" h="h-1.5" /></div>
            <div className="flex gap-1 items-center"><div className="w-3 h-3 rounded bg-slate-300" /><WireframeBar w="w-6" h="h-1.5" /></div>
          </div>

          <div className="pt-1">
            <WireframeBar w="w-28" h="h-3" className="mb-2" />
            <div className="space-y-2">
              {[1, 2, 3].map((row) => (
                <div key={row} className="p-2 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1 shrink-0">
                      <WireframeCrossBox aspect="aspect-square" className="w-9 h-9 rounded" />
                      <div className="flex gap-0.5">
                        <div className="w-2.5 h-1.5 bg-slate-300 rounded-xs" />
                        <div className="w-2.5 h-1.5 bg-slate-300 rounded-xs" />
                        <div className="w-2.5 h-1.5 bg-slate-300 rounded-xs" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <WireframeBar w="w-24" h="h-2.5" />
                      <div className="flex gap-2">
                        <WireframeBar w="w-8" h="h-1.5" />
                        <WireframeBar w="w-8" h="h-1.5" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <WireframeBar w="w-10" h="h-2.5" />
                    <WireframePill w="w-12" h="h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-center py-1 border-b border-slate-200">
          <WireframeBar w="w-16" h="h-2.5" className="mx-auto" />
        </div>

        <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-200">
          <div className="w-12 h-12 rounded-full border-2 border-slate-400 flex items-center justify-center font-mono font-bold text-xs text-slate-500">
            9.7
          </div>
          <div className="flex-1 space-y-1.5">
            <WireframeBar w="w-full" h="h-1" />
            <WireframeBar w="w-3/4" h="h-1" />
            <WireframeBar w="w-1/2" h="h-1" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <WireframeBar w="w-20" h="h-2" />
            <WireframePill w="w-10" h="h-3" />
          </div>
          <div className="p-2 border border-slate-200 rounded-lg space-y-1">
            <WireframeBar w="w-24" h="h-2" />
            <WireframeBar w="w-full" h="h-1.5" />
            <WireframeBar w="w-5/6" h="h-1.5" />
          </div>
        </div>

        <div className="space-y-1.5">
          <WireframeBar w="w-24" h="h-2" />
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="p-1 border border-slate-200 rounded space-y-1">
                <WireframeCrossBox aspect="aspect-square" className="w-full" />
                <WireframeBar w="w-full" h="h-1" />
                <WireframeBar w="w-2/3" h="h-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-2 bg-slate-200 rounded text-center">
          <WireframeBar w="w-36" h="h-2.5" className="mx-auto mb-1" />
          <WireframePill w="w-16" h="h-3.5" className="mx-auto" />
        </div>
      </div>
    );
  };

  const renderBookDetailUI = (sheetNum: 1 | 2) => {
    if (sheetNum === 1) {
      return (
        <div className="space-y-3 font-sans text-stone-800">
          <div className="flex justify-between items-center pb-2 border-b border-[#ED9040]/30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#4E0705] flex items-center justify-center text-white font-serif font-black text-[10px]">
                LB
              </div>
              <span className="font-serif font-black text-xs text-[#4E0705] tracking-tight">Library Bus</span>
            </div>
            <div className="hidden sm:flex gap-3 text-[10px] font-bold text-[#812203]">
              <span className="text-[#BD5705] hover:underline cursor-pointer">Tra cứu</span>
              <span className="hover:underline cursor-pointer">Bản đồ</span>
              <span className="hover:underline cursor-pointer">Lịch trình</span>
            </div>
            <button className="px-2.5 py-1 rounded-full bg-[#BD5705] text-white text-[10px] font-bold shadow-xs hover:bg-[#812203] transition-colors">
              Đăng nhập
            </button>
          </div>

          <div className="text-[10px] font-medium text-stone-500 flex items-center gap-1">
            <span>Trang chủ</span> <span>/</span> <span>Kho sách</span> <span>/</span> <span className="text-[#BD5705] font-bold">Bản Cực (Origin)</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-black text-sm text-[#4E0705]">Bản Cực (Origin) - Dan Brown</h3>
              <span className="px-1.5 py-0.5 rounded bg-[#FFC270]/60 text-[#4E0705] text-[9px] font-black">Có sẵn</span>
            </div>
            <p className="text-[10px] text-stone-500">Mã sách: BK-DAN-8802 • NXB Tổng hợp TP.HCM • 2021</p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3 rounded-xl overflow-hidden shadow-xs border border-[#ED9040]/30 relative group bg-gradient-to-br from-[#4E0705] via-[#7B1D0E] to-[#BD5705] p-3 text-white flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs text-[#FFC270] text-[9px] font-bold">
                  ⭐ 4.8 / 5.0
                </span>
                <BookOpen className="w-4 h-4 text-[#FFC270] opacity-80" />
              </div>
              <div className="space-y-0.5 border-l-2 border-[#FFC270] pl-2">
                <div className="text-[11px] font-serif font-black tracking-wide text-[#FFFDF9]">ORIGIN</div>
                <div className="text-[8px] font-sans text-amber-200">DAN BROWN</div>
              </div>
              <div className="flex justify-between text-[7px] font-mono text-amber-100/70 border-t border-white/20 pt-1">
                <span>THƯ VIỆN SỐ</span>
                <span>BẢN CHUẨN</span>
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-1.5">
              <div className="w-full h-9 rounded-lg border border-[#ED9040]/30 bg-gradient-to-r from-[#BD5705] to-[#ED9040] p-1 flex items-center justify-center text-[7px] font-bold text-white shadow-2xs">
                Bìa 1
              </div>
              <div className="w-full h-9 rounded-lg border border-[#ED9040]/30 bg-gradient-to-r from-[#4E0705] to-[#7B1D0E] p-1 flex items-center justify-center text-[7px] font-bold text-[#FFC270] shadow-2xs">
                Mục lục
              </div>
              <div className="w-full h-9 rounded-lg border border-[#ED9040]/30 bg-gradient-to-r from-[#ED9040] to-[#FFC270] p-1 flex items-center justify-center text-[7px] font-bold text-[#4E0705] shadow-2xs">
                Lời tựa
              </div>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#FAF4EC] border border-[#ED9040]/25 grid grid-cols-4 gap-1 text-[10px] text-center">
            <div className="flex items-center justify-center gap-1 font-bold text-[#4E0705]"><Wifi className="w-3 h-3 text-[#BD5705]" /> WiFi 5G</div>
            <div className="flex items-center justify-center gap-1 font-bold text-[#4E0705]"><Wind className="w-3 h-3 text-[#BD5705]" /> Máy lạnh</div>
            <div className="flex items-center justify-center gap-1 font-bold text-[#4E0705]"><BatteryCharging className="w-3 h-3 text-[#BD5705]" /> Sạc Type-C</div>
            <div className="flex items-center justify-center gap-1 font-bold text-[#4E0705]"><Coffee className="w-3 h-3 text-[#BD5705]" /> Trà miễn phí</div>
          </div>

          <div className="pt-1">
            <h4 className="font-serif font-black text-xs text-[#4E0705] mb-1.5 flex items-center justify-between">
              <span>Đang có trên các xe buýt lưu động:</span>
              <span className="text-[10px] text-[#BD5705] font-sans font-normal">3 xe đang dừng</span>
            </h4>
            <div className="space-y-1.5">
              {[
                { name: 'Bus 01: KĐT Linh Đàm', dist: '0.8 km', eta: '10 phút', copies: 2, status: 'Còn sách' },
                { name: 'Bus 04: ĐH Quốc Gia HN', dist: '2.4 km', eta: '35 phút', copies: 1, status: 'Còn sách' },
                { name: 'Bus 07: THPT Chu Văn An', dist: '4.1 km', eta: '50 phút', copies: 0, status: 'Đã đặt hết' },
              ].map((bus, idx) => (
                <div key={idx} className="p-2 rounded-xl border border-[#ED9040]/30 bg-white flex items-center justify-between shadow-2xs hover:border-[#BD5705] transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF4EC] text-[#BD5705] flex items-center justify-center font-bold">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[11px] text-[#4E0705]">{bus.name}</div>
                      <div className="text-[9px] text-stone-500">Cách {bus.dist} • Dừng tiếp sau {bus.eta}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${bus.copies > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {bus.status}
                    </span>
                    <button className="block mt-0.5 px-2 py-0.5 rounded-md bg-[#BD5705] text-white text-[9px] font-bold hover:bg-[#812203]">
                      Giữ sách
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3 font-sans text-stone-800">
        <div className="text-center pb-1 border-b border-[#ED9040]/30">
          <h4 className="font-serif font-black text-xs text-[#4E0705]">Độc giả đánh giá & Bình luận</h4>
        </div>

        <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FAF4EC] to-[#FFFDF9] border border-[#ED9040]/30 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#4E0705] text-[#FFC270] font-serif font-black text-sm flex items-center justify-center shadow-xs">
            9.7
          </div>
          <div className="flex-1 text-[10px]">
            <div className="font-bold text-[#4E0705]">Xuất sắc • 128 lượt bình chọn</div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-[#BD5705] h-full w-[97%]" />
            </div>
            <div className="text-[9px] text-stone-500 mt-0.5 flex justify-between">
              <span>Chất lượng sách: 9.8</span>
              <span>Tiện nghi xe: 9.6</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl border border-[#ED9040]/30 bg-white space-y-1">
          <div className="flex justify-between items-center text-[10px]">
            <div className="font-bold text-[#4E0705]">Nguyễn Hoàng Nam • Độc giả thân thiết</div>
            <span className="text-[9px] text-stone-400">12/03/2024</span>
          </div>
          <p className="text-[10px] text-stone-600 leading-relaxed italic">
            &ldquo;Sách rất mới, xe buýt đỗ đúng giờ tại điểm đón ngã tư Linh Đàm. Thủ thư hỗ trợ mượn trả qua mã QR rất nhanh!&rdquo;
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] font-serif font-bold text-[#4E0705]">Sách cùng tác giả / thể loại:</div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { title: 'Mật Mã Da Vinci', color: 'from-[#4E0705] to-[#7B1D0E]', textColor: 'text-[#FFC270]' },
              { title: 'Thiên Thần & Ác Quỷ', color: 'from-[#BD5705] to-[#ED9040]', textColor: 'text-white' },
              { title: 'Biểu Tượng Thất Truyền', color: 'from-[#7B1D0E] to-[#BD5705]', textColor: 'text-[#FFFDF9]' },
              { title: 'Hỏa Ngục', color: 'from-[#1E293B] to-[#334155]', textColor: 'text-sky-200' },
            ].map((book, idx) => (
              <div key={idx} className="p-1.5 rounded-lg border border-[#ED9040]/30 bg-white text-center group cursor-pointer hover:border-[#BD5705] transition-colors">
                <div className={`w-full h-11 rounded mb-1 bg-gradient-to-br ${book.color} flex flex-col items-center justify-center p-1 shadow-2xs`}>
                  <BookOpen className={`w-3 h-3 ${book.textColor} mb-0.5 opacity-90`} />
                  <span className={`text-[7px] font-black ${book.textColor} leading-none truncate max-w-full`}>DAN BROWN</span>
                </div>
                <div className="text-[8px] font-bold text-[#4E0705] truncate">{book.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#4E0705] text-white text-center space-y-1">
          <div className="text-[10px] font-bold text-[#FFC270]">Sẵn sàng tiếp cận tri thức lưu động?</div>
          <button className="px-3 py-1 rounded-full bg-[#BD5705] text-white text-[10px] font-bold hover:bg-[#ED9040]">
            Đăng ký thẻ đọc miễn phí
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Device Mode Switcher (Desktop vs Mobile) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-3xl bg-gradient-to-r from-[#F0F9FB] via-white to-[#FAF4EC] border border-[#0D7287]/20 shadow-xs dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
            {isEn ? 'Device Viewport:' : 'Chế độ hiển thị:'}
          </span>
          <div className="flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs dark:bg-slate-950 dark:border-slate-800">
            <button
              onClick={() => handleDeviceModeChange('desktop')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                deviceMode === 'desktop'
                  ? 'bg-[#0D7287] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>{isEn ? 'Desktop (20 Screens)' : '🖥️ Desktop (20 màn hình)'}</span>
            </button>
            <button
              onClick={() => handleDeviceModeChange('mobile')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                deviceMode === 'mobile'
                  ? 'bg-[#BD5705] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{isEn ? 'Mobile (20 Screens Matched)' : '📱 Mobile (20 màn hình chuẩn)'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={deviceMode === 'desktop' ? '/library-bus/website.pdf' : '/library-bus/website-mobile.pdf'}
            download={deviceMode === 'desktop' ? 'Library_Bus_Website_Design.pdf' : 'tulsach-uxui-mobile-adjusted.pdf'}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
            title={deviceMode === 'desktop' ? 'Tải PDF thiết kế Desktop' : 'Tải PDF thiết kế Mobile đã khớp 1-to-1'}
          >
            <Download className="w-3.5 h-3.5 text-[#BD5705]" />
            <span>{deviceMode === 'desktop' ? (isEn ? 'Desktop PDF' : 'Tải PDF Desktop') : (isEn ? 'Mobile PDF (Matched)' : 'Tải PDF Mobile (Đã khớp 1-to-1)')}</span>
          </a>
        </div>
      </div>

      {/* Navigation Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMainTab('side-by-side')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'side-by-side'
                ? 'bg-[#0D7287] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
            }`}
          >
            <Columns2 className="w-4 h-4" />
            {isEn ? '1-to-1 Template Pairs (Left Wireframe, Right UI)' : 'Đối Chiếu Từng Cặp Template (Mẫu Chuẩn)'}
          </button>

          <button
            onClick={() => setMainTab('system-comparison')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'system-comparison'
                ? 'bg-gradient-to-r from-[#0D7287] to-[#BD5705] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
            }`}
          >
            <SplitSquareVertical className="w-4 h-4" />
            {isEn ? 'Cross-Platform System Comparison (Desktop vs Mobile)' : 'So Sánh 2 Hệ Giao Diện (Desktop vs Mobile)'}
          </button>

          <button
            onClick={() => setMainTab('all-pairs')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'all-pairs'
                ? 'bg-[#0D7287] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            {isEn ? `All ${currentScreens.length} Pairs Feed (Scroll All)` : `Toàn Bộ ${currentScreens.length} Cặp Màn Hình (Cuộn Dọc)`}
          </button>

          <button
            onClick={() => setMainTab('master-boards')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'master-boards'
                ? 'bg-[#0D7287] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
            {isEn ? 'Master Boards Overview (Panoramas)' : 'Bảng Tổng Quan 20 Màn Hình (Panorama)'}
          </button>

          <button
            onClick={() => setMainTab('mockup-specs')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === 'mockup-specs'
                ? 'bg-[#0D7287] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            {isEn ? 'Interactive React Spec (Twin Mockup)' : 'Bản Vẽ Chi Tiết Code React'}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentScreens.length} Wireframes + {currentScreens.length} UI Templates Synced</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: 1-to-1 TEMPLATE PAIRS (WIREFRAME LEFT, UI DESIGN RIGHT)           */}
      {/* ========================================================================= */}
      {mainTab === 'side-by-side' && (
        <div className="space-y-3 animate-in fade-in duration-300">
          {/* Top Control Bar: Compact non-sticky layout */}
          <div className="p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5 dark:bg-slate-900 dark:border-slate-800">
            {/* Module Filter Pills & Prev/Next & View Mode in a single slim line */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap gap-1">
                {activeModuleFilters.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModuleFilter(m.id)}
                    className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      moduleFilter === m.id
                        ? 'bg-[#0D7287] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* View Fit Mode Toggle & Prev / Next controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewFitMode(prev => prev === 'fit' ? 'full' : 'fit')}
                  className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    viewFitMode === 'fit'
                      ? 'bg-[#FAF4EC] border-[#ED9040] text-[#812203] dark:bg-slate-800 dark:border-amber-600 dark:text-amber-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300'
                  }`}
                  title="Bật/tắt chế độ vừa màn hình"
                >
                  {viewFitMode === 'fit' ? <Minimize2 className="w-3 h-3 text-[#BD5705]" /> : <Maximize2 className="w-3 h-3 text-slate-500" />}
                  <span>{viewFitMode === 'fit' ? 'Vừa màn hình' : 'Kích thước thực'}</span>
                </button>

                <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

                <button
                  onClick={handlePrevScreen}
                  className="px-2 py-0.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-0.5 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
                  title="Màn trước (Phím ←)"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Trước</span>
                </button>
                <span className="text-[11px] font-mono font-bold text-[#0D7287] px-0.5 dark:text-[#9BE7FA]">
                  {selectedScreen.index}/{currentScreens.length}
                </span>
                <button
                  onClick={handleNextScreen}
                  className="px-2.5 py-0.5 rounded-lg bg-[#BD5705] hover:bg-[#812203] text-white text-[11px] font-black flex items-center gap-0.5 shadow-2xs cursor-pointer"
                  title="Màn tiếp theo (Phím →)"
                >
                  <span>Tiếp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick 20/34-Screen Carousel / Selector Pills with Auto-centering */}
            <div ref={carouselRef} className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
              {filteredScreens.map((screen) => {
                const isActive = screen.id === activeScreenId;
                return (
                  <button
                    key={screen.id}
                    data-screen-id={screen.id}
                    onClick={() => handleSelectScreen(screen.id)}
                    className={`px-2 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-[#4E0705] text-[#FFC270] shadow-2xs border border-[#BD5705] dark:bg-slate-800 dark:text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center font-mono text-[9px] font-black ${
                      isActive ? 'bg-[#BD5705] text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
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
          <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FAF4EC] via-white to-[#F0F9FB] border border-[#ED9040]/30 shadow-2xs flex flex-wrap items-center justify-between gap-2 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:border-slate-700 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#BD5705] text-white font-mono text-[11px] font-black">
                Màn #{selectedScreen.index.toString().padStart(2, '0')}
              </span>
              <h3 className="font-serif font-black text-sm text-[#4E0705] dark:text-[#FFC270]">
                {isEn ? selectedScreen.titleEn : selectedScreen.titleVi}
              </h3>
              <span className="px-1.5 py-0.5 rounded bg-[#FAF4EC] text-[#812203] border border-[#ED9040]/30 text-[10px] font-bold dark:bg-slate-800 dark:text-[#FFC270]">
                {selectedScreen.moduleNameVi}
              </span>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                Django: <code className="text-[#0D7287] font-bold dark:text-[#9BE7FA]">{selectedScreen.templatePath}</code>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-[11px]">
              <span className="hidden lg:inline text-stone-500 max-w-md truncate">
                {isEn ? selectedScreen.descEn : selectedScreen.descVi}
              </span>
              <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700 font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-stone-300">
                Quyền: {selectedScreen.role}
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* THE MASTERPIECE SPREAD: WIREFRAME (LEFT) VS UI DESIGN (RIGHT)    */}
          {/* Faithfully recreated following reference Image 1 layout           */}
          {/* ================================================================= */}
          <div className="grid lg:grid-cols-2 gap-4 items-start">
            {/* LEFT COLUMN: WIREFRAME */}
            <div className="space-y-2">
              {/* Header: Exact clean typography as sample image */}
              <div className="flex justify-between items-center pb-1.5 border-b-2 border-slate-300 dark:border-slate-700">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif tracking-tight dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                    Wireframe
                  </h3>
                  <p className="text-[11px] text-slate-500">Khung xám chuẩn cấu trúc, phân bổ lưới 12 cột</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenLightbox(
                      selectedScreen.wireframeSrc,
                      `${selectedScreen.titleVi} - Wireframe`,
                      'Cấu trúc khung xám lưới 12 cột'
                    )}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                    title="Phóng to Wireframe"
                  >
                    <Maximize2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </button>
                  <a
                    href={selectedScreen.wireframeSrc}
                    download={`wf_${selectedScreen.id}.png`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                    title="Tải ảnh Wireframe"
                  >
                    <Download className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </a>
                </div>
              </div>

              {/* Wireframe Canvas Card */}
              <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all dark:bg-slate-900 dark:border-slate-800 group relative">
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
                  <img 
                    src={selectedScreen.wireframeSrc} 
                    alt={`${selectedScreen.titleVi} Wireframe`}
                    className={`${viewFitMode === 'fit' ? 'h-full max-h-full' : 'max-h-[750px]'} w-auto max-w-full object-contain rounded transition-transform duration-300 group-hover:scale-[1.01]`} 
                  />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500 font-mono">
                  <span>Khung xám: Grayscale wireframe</span>
                  <span className="text-[#0D7287] font-bold dark:text-[#9BE7FA]">Lưới 12 cột quy chuẩn</span>
                </div>
              </div>

              {/* Wireframe Specs List */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 dark:bg-slate-900 dark:border-slate-800">
                <div className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  Cấu trúc thành phần Wireframe:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedScreen.wireframeElements.map((elem, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                      • {elem}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: UI DESIGN */}
            <div className="space-y-2">
              {/* Header: Exact clean typography as sample image */}
              <div className="flex justify-between items-center pb-1.5 border-b-2 border-[#BD5705] dark:border-[#BD5705]">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#4E0705] font-serif tracking-tight dark:text-[#FFC270] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#BD5705] inline-block" />
                    UI design
                  </h3>
                  <p className="text-[11px] text-stone-500">Giao diện thành phẩm hoàn chỉnh • Neo-Bakery 6-tone</p>
                </div>

                {/* Toggle: Sheet crop vs Full web screenshot */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center p-1 rounded-xl bg-[#FAF4EC] border border-[#ED9040]/30 dark:bg-slate-800 dark:border-slate-700">
                    <button
                      onClick={() => setUiViewType('sheet')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        uiViewType === 'sheet'
                          ? 'bg-[#BD5705] text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 dark:text-slate-300'
                      }`}
                    >
                      Bản thiết kế
                    </button>
                    <button
                      onClick={() => setUiViewType('full')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        uiViewType === 'full'
                          ? 'bg-[#BD5705] text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 dark:text-slate-300'
                      }`}
                    >
                      Web đầy đủ
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenLightbox(
                      uiViewType === 'full' ? selectedScreen.uiFullSrc : selectedScreen.uiSrc,
                      `${selectedScreen.titleVi} - UI Design`,
                      'Giao diện hoàn chỉnh Neo-Bakery 6-Tone'
                    )}
                    className="p-2 rounded-xl bg-[#FAF4EC] hover:bg-[#FDE971]/40 text-[#4E0705] border border-[#ED9040]/30 transition-colors dark:bg-slate-800 dark:text-[#FFC270] dark:border-slate-700"
                    title="Phóng to UI Design"
                  >
                    <Maximize2 className="w-4 h-4 text-[#BD5705]" />
                  </button>
                  <a
                    href={uiViewType === 'full' ? selectedScreen.uiFullSrc : selectedScreen.uiSrc}
                    download={`ui_${selectedScreen.id}.png`}
                    className="p-2 rounded-xl bg-[#FAF4EC] hover:bg-[#FDE971]/40 text-[#4E0705] border border-[#ED9040]/30 transition-colors dark:bg-slate-800 dark:text-[#FFC270] dark:border-slate-700"
                    title="Tải ảnh UI Design"
                  >
                    <Download className="w-4 h-4 text-[#BD5705]" />
                  </a>
                </div>
              </div>

              {/* UI Design Canvas Card */}
              <div className="p-4 sm:p-6 rounded-3xl bg-[#FFFDF9] border border-amber-900/20 shadow-md hover:shadow-lg transition-all dark:bg-slate-900 dark:border-amber-900/40 group relative">
                <div 
                  className={`rounded-2xl overflow-hidden border border-amber-900/15 bg-[#FAF4EC] flex justify-center p-3 cursor-zoom-in dark:bg-slate-950 dark:border-slate-800 transition-all ${
                    viewFitMode === 'fit' 
                      ? 'h-[58vh] max-h-[520px] min-h-[360px] items-center' 
                      : 'min-h-[420px] items-start'
                  }`}
                  onClick={() => handleOpenLightbox(
                    uiViewType === 'full' ? selectedScreen.uiFullSrc : selectedScreen.uiSrc,
                    `${selectedScreen.titleVi} - UI Design`,
                    'Giao diện hoàn chỉnh Neo-Bakery 6-Tone'
                  )}
                >
                  <img 
                    src={uiViewType === 'full' ? selectedScreen.uiFullSrc : selectedScreen.uiSrc} 
                    alt={`${selectedScreen.titleVi} UI Design`}
                    className={`${viewFitMode === 'fit' ? 'h-full max-h-full' : 'max-h-[750px]'} w-auto max-w-full object-contain rounded transition-transform duration-300 group-hover:scale-[1.01]`} 
                  />
                </div>

                <div className="mt-3 pt-3 border-t border-amber-900/10 dark:border-slate-800 flex justify-between items-center text-[11px] text-stone-500 font-mono">
                  <span>Hệ màu: #4E0705, #BD5705, #ED9040</span>
                  <span className="text-[#BD5705] font-bold">
                    {uiViewType === 'full' ? 'Bản chụp web toàn trang' : 'Bản trình bày chuẩn hồ sơ'}
                  </span>
                </div>
              </div>

              {/* UI Features Specs List */}
              <div className="p-4 rounded-2xl bg-[#FAF4EC] border border-[#ED9040]/30 space-y-2 dark:bg-slate-900 dark:border-slate-800">
                <div className="text-xs font-black uppercase tracking-wider text-[#4E0705] dark:text-[#FFC270] flex items-center gap-1.5 font-serif">
                  <Sparkles className="w-3.5 h-3.5 text-[#BD5705]" />
                  Điểm nhấn thiết kế giao diện (UI Highlights):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedScreen.uiFeatures.map((feat, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-[#ED9040]/30 text-[#812203] text-xs font-bold shadow-2xs dark:bg-slate-800 dark:border-slate-700 dark:text-[#FFC270]">
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cụm mũi tên ngang chuyển trang nằm dưới cả chân khung Wireframe và UI Design */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <button
              onClick={handlePrevScreen}
              className="px-3.5 py-2 rounded-xl bg-[#FAF4EC] hover:bg-slate-100 text-[#4E0705] border border-[#ED9040]/30 flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-all cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-stone-200"
              title="Màn trước (Phím ←)"
            >
              <ChevronLeft className="w-4 h-4 text-[#BD5705]" />
              <span>Trước</span>
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-[#4E0705] dark:text-[#FFC270]">
              <span className="px-2.5 py-1 rounded-md bg-[#ED9040]/20 text-[#812203] dark:text-[#FFC270] dark:bg-slate-800 text-xs font-bold">
                {selectedScreen.index} / {currentScreens.length}
              </span>
              <span className="text-stone-700 dark:text-stone-300 font-sans font-medium text-xs sm:text-sm truncate max-w-[180px] sm:max-w-[340px]">
                {isEn ? selectedScreen.titleEn : selectedScreen.titleVi}
              </span>
            </div>

            <button
              onClick={handleNextScreen}
              className="px-4 py-2 rounded-xl bg-[#BD5705] hover:bg-[#812203] text-white flex items-center gap-1.5 text-xs sm:text-sm font-black transition-all shadow-xs hover:shadow-md cursor-pointer"
              title="Màn tiếp theo (Phím →)"
            >
              <span>Tiếp</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE: CROSS-PLATFORM SYSTEM COMPARISON (DESKTOP 12-COL VS MOBILE TOUCH)   */}
      {/* ========================================================================= */}
      {mainTab === 'system-comparison' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Comparison Overview Header Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-[#F0F9FB] to-[#FAF4EC] border border-[#0D7287]/20 shadow-xs dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:border-slate-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D7287]/10 text-[#0D7287] dark:bg-[#0D7287]/30 dark:text-[#9BE7FA] text-xs font-black uppercase tracking-wider mb-2">
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Cross-Platform Responsive Architecture' : 'Kiến Trúc Đối Chiếu Responsive 2 Hệ Thống'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {isEn ? 'Desktop 12-Column vs Mobile Touch-First System Comparison' : 'So Sánh 2 Hệ Giao Diện: Desktop 12-Cột vs Mobile Chạm Cảm Ứng'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  {isEn 
                    ? 'Comprehensive comparison of responsive design patterns, layout adaptation, information density, and thumb-zone ergonomics between the 20 desktop screens and their 20 corresponding mobile touch counterparts.' 
                    : 'Phân tích đối chiếu toàn diện về phương pháp chuyển đổi giao diện, mật độ thông tin, tương tác công thái học và quy trình xử lý O(1) giữa 20 màn hình máy tính và 20 màn hình điện thoại tương ứng trong Tủ Sách Lưu Động.'}
                </p>
              </div>

              {/* Quick device spec pills */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 shadow-2xs">
                  <Monitor className="w-4 h-4 text-[#0D7287]" />
                  <span>20 Màn Hình Desktop</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 shadow-2xs">
                  <Smartphone className="w-4 h-4 text-[#BD5705]" />
                  <span>20 Màn Hình Mobile</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Interactive Screen-by-Screen Dual Device Comparison */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <SplitSquareVertical className="w-5 h-5 text-[#0D7287]" />
                <span>{isEn ? '1. Interactive Screen-by-Screen Twin Comparison (1 to 20)' : '1. Đối Chiếu Tương Tác Từng Màn Hình (Màn 01 Đến 20)'}</span>
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? 'Select any screen below to compare Desktop & Mobile side-by-side' : 'Chọn màn hình bên dưới để so sánh trực quan Desktop & Mobile song song'}
              </span>
            </div>

            {/* Screen selector carousel */}
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-2xs">
              <div className="flex items-center gap-1.5 min-w-max">
                {LIBRARY_BUS_20_SCREENS.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCrossDeviceIdx(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      crossDeviceIdx === idx
                        ? 'bg-gradient-to-r from-[#0D7287] to-[#BD5705] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-80">{String(idx + 1).padStart(2, '0')}</span>
                    <span>{s.titleVi.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Arrow Bar for Screen-by-Screen Comparison */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-xs shadow-2xs">
              <button
                onClick={() => setCrossDeviceIdx(prev => prev > 0 ? prev - 1 : 19)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isEn ? 'Previous Screen' : 'Màn Trước'}</span>
              </button>

              <div className="flex items-center gap-2 text-center">
                <span className="font-mono font-black text-sm text-[#0D7287] dark:text-[#9BE7FA]">
                  {String(crossDeviceIdx + 1).padStart(2, '0')} / 20
                </span>
                <span className="text-slate-400">|</span>
                <span className="font-black text-sm text-slate-800 dark:text-slate-200">
                  {LIBRARY_BUS_20_SCREENS[crossDeviceIdx].titleVi}
                </span>
                <span className="hidden md:inline-block px-2.5 py-0.5 rounded-md bg-[#0D7287]/10 text-[#0D7287] dark:bg-[#0D7287]/20 dark:text-[#9BE7FA] text-[11px] font-mono">
                  {LIBRARY_BUS_20_SCREENS[crossDeviceIdx].templatePath}
                </span>
              </div>

              <button
                onClick={() => setCrossDeviceIdx(prev => prev < 19 ? prev + 1 : 0)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>{isEn ? 'Next Screen' : 'Màn Tiếp'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Side-by-side viewports */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Desktop 12-Column Viewport (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                  {/* Desktop browser chrome */}
                  <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-500 font-mono dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400">
                        <span>https://librarybus.vn/</span>
                        <span className="text-slate-800 dark:text-slate-200 font-bold">{LIBRARY_BUS_20_SCREENS[crossDeviceIdx].templatePath}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#0D7287]/10 text-[#0D7287] dark:bg-[#0D7287]/20 dark:text-[#9BE7FA] text-[10px] font-mono font-bold flex items-center gap-1">
                        <Monitor className="w-3 h-3" />
                        <span>Desktop 1440px</span>
                      </span>
                      <button
                        onClick={() => handleOpenLightbox(
                          LIBRARY_BUS_20_SCREENS[crossDeviceIdx].uiSrc,
                          LIBRARY_BUS_20_SCREENS[crossDeviceIdx].titleVi,
                          'Desktop Web 12-Column Interface'
                        )}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 dark:hover:bg-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Xem phóng to"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Desktop Image Viewport */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[380px]">
                    <div className="relative group max-h-[500px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <img
                        src={LIBRARY_BUS_20_SCREENS[crossDeviceIdx].uiSrc}
                        alt={LIBRARY_BUS_20_SCREENS[crossDeviceIdx].titleVi}
                        className="w-full h-auto max-h-[500px] object-contain rounded-xl"
                      />
                      <button
                        onClick={() => handleOpenLightbox(
                          LIBRARY_BUS_20_SCREENS[crossDeviceIdx].uiSrc,
                          LIBRARY_BUS_20_SCREENS[crossDeviceIdx].titleVi,
                          'Desktop Web 12-Column Interface'
                        )}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold cursor-pointer"
                      >
                        <ZoomIn className="w-4 h-4" />
                        <span>{isEn ? 'Click to Enlarge Desktop UI' : 'Nhấn để phóng to giao diện Desktop'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Desktop Highlights */}
                  <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black text-[#0D7287] dark:text-[#9BE7FA]">
                        <Monitor className="w-4 h-4" />
                        <span>{isEn ? 'Desktop UX Architecture:' : 'Kiến trúc giao diện Desktop:'}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">Lưới 12 Cột · 1440px</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {LIBRARY_BUS_20_SCREENS[crossDeviceIdx].descVi}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {LIBRARY_BUS_20_SCREENS[crossDeviceIdx].uiFeatures.map((feat, fIdx) => (
                        <span key={fIdx} className="px-2 py-0.5 rounded-md bg-[#0D7287]/10 text-[#0D7287] dark:bg-[#0D7287]/20 dark:text-[#9BE7FA] text-[10px] font-medium">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Mobile Touch-First Viewport (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                  {/* Mobile smartphone chrome */}
                  <div className="px-4 py-2.5 bg-amber-50/60 border-b border-amber-200/60 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-600 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      </div>
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        {LIBRARY_BUS_MOBILE_SCREENS[crossDeviceIdx].titleVi}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#BD5705]/10 text-[#BD5705] dark:bg-[#BD5705]/20 dark:text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
                        <Smartphone className="w-3 h-3" />
                        <span>Mobile 390px</span>
                      </span>
                      <button
                        onClick={() => handleOpenLightbox(
                          LIBRARY_BUS_MOBILE_SCREENS[crossDeviceIdx].uiSrc,
                          LIBRARY_BUS_MOBILE_SCREENS[crossDeviceIdx].titleVi,
                          'Mobile Touch-First Screen'
                        )}
                        className="p-1 rounded-lg hover:bg-amber-100 text-amber-800 dark:hover:bg-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Xem phóng to"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Image Viewport */}
                  <div className="p-3 bg-amber-50/20 dark:bg-slate-950 flex items-center justify-center min-h-[380px]">
                    <div className="relative group max-h-[500px] overflow-hidden rounded-2xl border-2 border-slate-800 dark:border-slate-700 shadow-md bg-white dark:bg-slate-900">
                      <img
                        src={LIBRARY_BUS_MOBILE_SCREENS[crossDeviceIdx].uiSrc}
                        alt={LIBRARY_BUS_MOBILE_SCREENS[crossDeviceIdx].titleVi}
                        className="w-auto h-auto max-h-[480px] object-contain rounded-2xl"
                      />
                      <button
                        onClick={() => handleOpenLightbox(
                          LIBRARY_BUS_MOBILE_SCREENS[crossDeviceIdx].uiSrc,
                          LIBRARY_BUS_MOBILE_SCREENS[crossDeviceIdx].titleVi,
                          'Mobile Touch-First Screen'
                        )}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold cursor-pointer"
                      >
                        <ZoomIn className="w-4 h-4" />
                        <span>{isEn ? 'Click to Enlarge Mobile UI' : 'Nhấn để phóng to giao diện Mobile'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Mobile Highlights */}
                  <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black text-[#BD5705] dark:text-amber-400">
                        <Smartphone className="w-4 h-4" />
                        <span>{isEn ? 'Mobile Touch Adaptation:' : 'Chuyển đổi tối ưu trên Mobile:'}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">Lưới 1 Cột · Thumb Zone</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {LIBRARY_BUS_MOBILE_SCREENS[crossDeviceIdx].descVi}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {LIBRARY_BUS_MOBILE_SCREENS[crossDeviceIdx].uiFeatures.map((feat, fIdx) => (
                        <span key={fIdx} className="px-2 py-0.5 rounded-md bg-[#BD5705]/10 text-[#BD5705] dark:bg-[#BD5705]/20 dark:text-amber-300 text-[10px] font-medium">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Core Architectural UX Matrix (6 Key Differences) */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Columns2 className="w-5 h-5 text-[#BD5705]" />
                <span>{isEn ? '2. System Architecture & UX Comparison Matrix' : '2. Ma Trận So Sánh Kiến Trúc & Trải Nghiệm 2 Hệ Thống'}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {isEn
                  ? 'Deep-dive into the 6 fundamental pillars distinguishing the desktop web portal from the mobile touch experience.'
                  : 'Phân tích 6 trụ cột khác biệt nền tảng giữa cổng thông tin máy tính để bàn và trải nghiệm chạm trên điện thoại di động.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LIBRARY_BUS_SYSTEM_PARADIGMS.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#0D7287]/40 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-[#0D7287]/60 shadow-2xs transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{item.titleVi}</h5>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                      {item.badgeVi}
                    </span>
                  </div>

                  {/* Desktop Box */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-[#0D7287] dark:text-[#9BE7FA]">
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Hệ Thống Desktop:</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.desktopVi}
                    </p>
                  </div>

                  {/* Mobile Box */}
                  <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-900/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-[#BD5705] dark:text-amber-400">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Hệ Thống Mobile:</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.mobileVi}
                    </p>
                  </div>

                  {/* Impact statement */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic pt-1 border-t border-slate-100 dark:border-slate-800">
                    💡 {item.impactVi}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Shared Design Tokens & Responsive Harmonization */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FAF4EC] via-white to-[#F0F9FB] border border-[#BD5705]/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:border-slate-700 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#BD5705]" />
              <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider">
                {isEn ? '3. Shared Design System & Backend Synchronization' : '3. Tính Nhất Quán Hệ Thống Nhận Diện & Đồng Bộ Dữ Liệu'}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-[#0D7287] tracking-wider">Bảng Màu Đồng Nhất</span>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">Neo-Bakery 6-Tone Palette</h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Cả hai hệ thống đều dùng chung mã màu Mật Mía (#0D7287), Hổ Phách (#BD5705) và Bơ Sữa (#FAF4EC) tạo nên bản sắc nhận diện thương hiệu bền vững.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-[#BD5705] tracking-wider">Hòa Sắc Typography</span>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">Lora Serif + Outfit Sans</h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Tiêu đề dùng Lora mang vẻ đẹp trang nhã của sách in truyền thống; văn bản dùng Outfit đạt độ nét tối đa trên mọi mật độ điểm ảnh (Retina / OLED).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Đồng Bộ Dữ Liệu O(1)</span>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">Django ORM + Redis Cache</h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Độc giả đặt trước sách trên điện thoại hay thủ thư điều phối xe trên máy tính đều truy xuất qua kiến trúc Redis Caching độ trễ 28ms không lệch pha.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: ALL 20 PAIRS FEED (SEQUENTIAL LIST OF WIREFRAME + UI)             */}
      {/* ========================================================================= */}
      {mainTab === 'all-pairs' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Module Filter Pills */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex flex-wrap gap-1.5">
              {activeModuleFilters.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModuleFilter(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    moduleFilter === m.id
                      ? 'bg-[#0D7287] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-slate-500">
              Hiển thị: <b>{filteredScreens.length}</b> / {currentScreens.length} cặp màn hình
            </div>
          </div>

          {/* Sequential 20 Pairs Feed */}
          <div className="space-y-10">
            {filteredScreens.map((screen) => (
              <div 
                key={screen.id} 
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-800"
              >
                {/* Pair Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#4E0705] text-[#FFC270] font-mono font-black text-sm flex items-center justify-center shadow-xs">
                      {screen.index}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white font-serif">
                          {isEn ? screen.titleEn : screen.titleVi}
                        </h4>
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF4EC] text-[#BD5705] border border-[#ED9040]/30 text-[10px] font-bold dark:bg-slate-800 dark:text-[#FFC270]">
                          {screen.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Module: <b>{screen.moduleNameVi}</b> • Template: <code className="text-[#0D7287] dark:text-[#9BE7FA] font-bold">{screen.templatePath}</code>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveScreenId(screen.id);
                      setMainTab('side-by-side');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FAFDFE] border border-[#0D7287]/40 text-[#0D7287] hover:bg-[#F0F9FB] text-xs font-bold flex items-center gap-1.5 transition-colors dark:bg-slate-800 dark:text-[#9BE7FA]"
                  >
                    Xem chi tiết đối chiếu <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Two Columns: Wireframe (Left) vs UI Design (Right) */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column: Wireframe */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        Wireframe
                      </span>
                      <button
                        onClick={() => handleOpenLightbox(
                          screen.wireframeSrc,
                          `${screen.titleVi} - Wireframe`,
                          'Khung xương cấu trúc lưới 12 cột'
                        )}
                        className="text-[11px] text-[#0D7287] hover:underline font-mono flex items-center gap-1 dark:text-[#9BE7FA]"
                      >
                        <Maximize2 className="w-3 h-3" /> Phóng to
                      </button>
                    </div>

                    <div 
                      className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50/70 p-3 flex justify-center cursor-zoom-in hover:border-slate-400 transition-colors dark:bg-slate-950 dark:border-slate-800 min-h-[280px] items-start"
                      onClick={() => handleOpenLightbox(
                        screen.wireframeSrc,
                        `${screen.titleVi} - Wireframe`,
                        'Khung xương cấu trúc lưới 12 cột'
                      )}
                    >
                      <img 
                        src={screen.wireframeSrc} 
                        alt={`${screen.titleVi} Wireframe`} 
                        className="max-h-[500px] w-auto max-w-full object-contain rounded"
                      />
                    </div>
                  </div>

                  {/* Right Column: UI Design */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-[#4E0705] dark:text-[#FFC270]">
                      <span className="flex items-center gap-1.5 font-serif">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#BD5705]" />
                        UI Design
                      </span>
                      <button
                        onClick={() => handleOpenLightbox(
                          screen.uiSrc,
                          `${screen.titleVi} - UI Design`,
                          'Giao diện hoàn chỉnh Neo-Bakery 6-Tone'
                        )}
                        className="text-[11px] text-[#BD5705] hover:underline font-mono flex items-center gap-1 dark:text-[#FFC270]"
                      >
                        <Maximize2 className="w-3 h-3" /> Phóng to
                      </button>
                    </div>

                    <div 
                      className="rounded-2xl overflow-hidden border border-amber-900/15 bg-[#FAF4EC]/70 p-3 flex justify-center cursor-zoom-in hover:border-[#BD5705] transition-colors dark:bg-slate-950 dark:border-slate-800 min-h-[280px] items-start"
                      onClick={() => handleOpenLightbox(
                        screen.uiSrc,
                        `${screen.titleVi} - UI Design`,
                        'Giao diện hoàn chỉnh Neo-Bakery 6-Tone'
                      )}
                    >
                      <img 
                        src={screen.uiSrc} 
                        alt={`${screen.titleVi} UI Design`} 
                        className="max-h-[500px] w-auto max-w-full object-contain rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: MASTER BOARDS OVERVIEW (PANORAMAS)                                */}
      {/* ========================================================================= */}
      {mainTab === 'master-boards' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Sub-tabs for master board filter */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <button
              onClick={() => setMasterBoardFilter('both')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                masterBoardFilter === 'both'
                  ? 'bg-[#0D7287] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              Xem Song Song Cả 2 Bảng (Side-by-Side)
            </button>
            <button
              onClick={() => setMasterBoardFilter('ui')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                masterBoardFilter === 'ui'
                  ? 'bg-[#0D7287] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              Chỉ Xem UI Design (20 Trang)
            </button>
            <button
              onClick={() => setMasterBoardFilter('wireframe')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                masterBoardFilter === 'wireframe'
                  ? 'bg-[#0D7287] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              Chỉ Xem Wireframe (20 Trang)
            </button>
            <button
              onClick={() => setMasterBoardFilter('reference')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                masterBoardFilter === 'reference'
                  ? 'bg-[#0D7287] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              Mẫu Tham Khảo Quy Chuẩn (Reference Template)
            </button>
          </div>

          {/* Master boards side-by-side or individual */}
          {masterBoardFilter === 'both' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Board: Wireframe */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800 flex flex-col">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      Wireframe: Toàn bộ 20 trang
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">Khung xám chuẩn cấu trúc, phân bổ lưới 12 cột</p>
                  </div>
                  <button
                    onClick={() => handleOpenLightbox(
                      '/library-bus/library_bus_wireframe_all_screens.png',
                      'Wireframe: Library Bus (toàn bộ 20 trang)',
                      'Bảng quy chuẩn khung xương 20 màn hình'
                    )}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    title="Phóng to"
                  >
                    <Maximize2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </button>
                </div>

                <div 
                  className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 relative group cursor-zoom-in dark:bg-slate-950 dark:border-slate-800"
                  onClick={() => handleOpenLightbox(
                    '/library-bus/library_bus_wireframe_all_screens.png',
                    'Wireframe: Library Bus (toàn bộ 20 trang)',
                    'Bảng quy chuẩn khung xương 20 màn hình'
                  )}
                >
                  <img 
                    src="/library-bus/library_bus_wireframe_all_screens.png" 
                    alt="Wireframe Library Bus All 20 Screens" 
                    className="w-full h-auto object-contain group-hover:scale-[1.01] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-xl bg-black/75 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <ZoomIn className="w-4 h-4" /> Nhấp để xem ảnh phân giải cao
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-[11px] text-slate-500 font-mono">
                  <span>Kích thước: 1400 × 1833 px</span>
                  <a 
                    href="/library-bus/library_bus_wireframe_all_screens.png" 
                    download="library_bus_wireframe_all_screens.png"
                    className="flex items-center gap-1 text-[#0D7287] hover:underline font-bold dark:text-[#9BE7FA]"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải ảnh gốc
                  </a>
                </div>
              </div>

              {/* Right Board: UI Design */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800 flex flex-col">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-base font-black text-[#4E0705] dark:text-[#FFC270] flex items-center gap-2 font-serif">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#BD5705]" />
                      UI Design: Toàn bộ 20 trang
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">Giao diện thành phẩm hoàn chỉnh áp dụng bảng màu Neo-Bakery</p>
                  </div>
                  <button
                    onClick={() => handleOpenLightbox(
                      '/library-bus/library_bus_ui_design_all_screens.png',
                      'UI Design: Library Bus (toàn bộ 20 trang)',
                      'Bảng thiết kế hoàn chỉnh hệ thống 20 màn hình'
                    )}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    title="Phóng to"
                  >
                    <Maximize2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </button>
                </div>

                <div 
                  className="rounded-2xl overflow-hidden border border-slate-200 bg-[#FAF4EC] relative group cursor-zoom-in dark:bg-slate-950 dark:border-slate-800"
                  onClick={() => handleOpenLightbox(
                    '/library-bus/library_bus_ui_design_all_screens.png',
                    'UI Design: Library Bus (toàn bộ 20 trang)',
                    'Bảng thiết kế hoàn chỉnh hệ thống 20 màn hình'
                  )}
                >
                  <img 
                    src="/library-bus/library_bus_ui_design_all_screens.png" 
                    alt="UI Design Library Bus All 20 Screens" 
                    className="w-full h-auto object-contain group-hover:scale-[1.01] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-xl bg-black/75 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <ZoomIn className="w-4 h-4" /> Nhấp để xem ảnh phân giải cao
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-[11px] text-slate-500 font-mono">
                  <span>Kích thước: 1290 × 3388 px</span>
                  <a 
                    href="/library-bus/library_bus_ui_design_all_screens.png" 
                    download="library_bus_ui_design_all_screens.png"
                    className="flex items-center gap-1 text-[#0D7287] hover:underline font-bold dark:text-[#9BE7FA]"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải ảnh gốc
                  </a>
                </div>
              </div>
            </div>
          )}

          {masterBoardFilter === 'ui' && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-black text-[#4E0705] dark:text-[#FFC270] font-serif">
                    UI Design: Library Bus (Ảnh Chụp Giao Diện Thật, Toàn Bộ 20 Trang)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Bao gồm toàn bộ 20 màn hình áp dụng hệ màu Neo-Bakery 6-tone
                  </p>
                </div>
                <button
                  onClick={() => handleOpenLightbox(
                    '/library-bus/library_bus_ui_design_all_screens.png',
                    'UI Design: Library Bus (toàn bộ 20 trang)',
                    'Ảnh chụp giao diện thật 20 màn hình'
                  )}
                  className="px-3.5 py-2 rounded-xl bg-[#0D7287] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Maximize2 className="w-4 h-4" /> Xem Toàn Màn Hình
                </button>
              </div>

              <div 
                className="rounded-2xl overflow-hidden border border-slate-200 bg-[#FAF4EC] flex justify-center p-2 cursor-zoom-in dark:bg-slate-950 dark:border-slate-800"
                onClick={() => handleOpenLightbox(
                  '/library-bus/library_bus_ui_design_all_screens.png',
                  'UI Design: Library Bus (toàn bộ 20 trang)',
                  'Ảnh chụp giao diện thật 20 màn hình'
                )}
              >
                <img 
                  src="/library-bus/library_bus_ui_design_all_screens.png" 
                  alt="UI Design Library Bus Full" 
                  className="max-h-[85vh] w-auto object-contain rounded-lg shadow-sm"
                />
              </div>
            </div>
          )}

          {masterBoardFilter === 'wireframe' && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    Wireframe: Library Bus (Toàn Bộ 20 Trang Cấu Trúc Khung Xương)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Bố cục 20 khung màn hình chuẩn wireframe theo tỷ lệ lưới 12 cột của hệ thống
                  </p>
                </div>
                <button
                  onClick={() => handleOpenLightbox(
                    '/library-bus/library_bus_wireframe_all_screens.png',
                    'Wireframe: Library Bus (toàn bộ 20 trang)',
                    'Khung xương cấu trúc 20 màn hình'
                  )}
                  className="px-3.5 py-2 rounded-xl bg-[#0D7287] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Maximize2 className="w-4 h-4" /> Xem Toàn Màn Hình
                </button>
              </div>

              <div 
                className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex justify-center p-2 cursor-zoom-in dark:bg-slate-950 dark:border-slate-800"
                onClick={() => handleOpenLightbox(
                  '/library-bus/library_bus_wireframe_all_screens.png',
                  'Wireframe: Library Bus (toàn bộ 20 trang)',
                  'Khung xương cấu trúc 20 màn hình'
                )}
              >
                <img 
                  src="/library-bus/library_bus_wireframe_all_screens.png" 
                  alt="Wireframe Library Bus Full" 
                  className="max-h-[85vh] w-auto object-contain rounded-lg shadow-sm"
                />
              </div>
            </div>
          )}

          {masterBoardFilter === 'reference' && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    Ảnh Mẫu Tham Khảo Quy Chuẩn (Reference Template: Wireframe vs UI design)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Mẫu so sánh trực quan đối chiếu song song Wireframe (trái) và UI Design (phải) chuẩn hồ sơ thiết kế
                  </p>
                </div>
                <button
                  onClick={() => handleOpenLightbox(
                    '/library-bus/reference_wireframe_vs_ui.png',
                    'Mẫu Tham Khảo (Wireframe vs UI design)',
                    'Chuẩn mực trình bày hồ sơ thiết kế giao diện người dùng'
                  )}
                  className="px-3.5 py-2 rounded-xl bg-[#0D7287] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Maximize2 className="w-4 h-4" /> Xem Toàn Màn Hình
                </button>
              </div>

              <div 
                className="rounded-2xl overflow-hidden border border-slate-200 bg-white flex justify-center p-2 cursor-zoom-in dark:bg-slate-950 dark:border-slate-800"
                onClick={() => handleOpenLightbox(
                  '/library-bus/reference_wireframe_vs_ui.png',
                  'Mẫu Tham Khảo (Wireframe vs UI design)',
                  'Chuẩn mực trình bày hồ sơ thiết kế giao diện người dùng'
                )}
              >
                <img 
                  src="/library-bus/reference_wireframe_vs_ui.png" 
                  alt="Reference Template Wireframe vs UI" 
                  className="max-h-[85vh] w-auto object-contain rounded-lg shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: MOCKUP SPECS (INTERACTIVE REACT TWIN MOCKUPS)                     */}
      {/* ========================================================================= */}
      {mainTab === 'mockup-specs' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Bản Vẽ Chi Tiết Theo Mã Nguồn Component (Screen 04: Chi tiết sách)
              </h4>
              <p className="text-xs text-slate-500">
                Tái hiện cấu trúc code React chuẩn xác theo từng thẻ giao diện, đối chiếu khung xương và giao diện sống
              </p>
            </div>
            <span className="text-xs font-mono text-[#0D7287] font-bold dark:text-[#9BE7FA]">
              Template: template/inventory/book_detail.html
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Wireframe Specs */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b-2 border-slate-300">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-xs bg-slate-400" />
                  Wireframe (Mã Nguồn Khung Xương)
                </h3>
                <span className="text-[11px] font-mono text-slate-500">Sheet 1 & Sheet 2</span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <div className="text-[10px] font-mono font-bold text-slate-400 mb-2">SHEET 01: HERO & CONTROLS</div>
                {renderBookDetailWireframe(1)}
              </div>

              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
                <div className="text-[10px] font-mono font-bold text-slate-400 mb-2">SHEET 02: REVIEWS & FOOTER</div>
                {renderBookDetailWireframe(2)}
              </div>
            </div>

            {/* UI Design Specs */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b-2 border-[#BD5705]">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#4E0705] flex items-center gap-2 font-serif dark:text-[#FFC270]">
                  <span className="w-3 h-3 rounded-xs bg-[#BD5705]" />
                  UI Design (Giao Diện Sống Thành Phẩm)
                </h3>
                <span className="text-[11px] font-mono text-[#BD5705] font-bold">Neo-Bakery 6-Tone (#4E0705)</span>
              </div>

              <div className="p-4 rounded-3xl bg-[#FFFDF9] border border-amber-900/20 shadow-xs dark:bg-slate-900 dark:border-amber-900/40">
                <div className="text-[10px] font-mono font-bold text-[#BD5705] mb-2 flex justify-between items-center">
                  <span>SHEET 01: PRODUCTION READY COMPONENT</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#FFC270]/40 text-[#4E0705] text-[9px]">Live Interactive</span>
                </div>
                {renderBookDetailUI(1)}
              </div>

              <div className="p-4 rounded-3xl bg-[#FFFDF9] border border-amber-900/20 shadow-xs dark:bg-slate-900 dark:border-amber-900/40">
                <div className="text-[10px] font-mono font-bold text-[#BD5705] mb-2 flex justify-between items-center">
                  <span>SHEET 02: REVIEWS & FOOTER SPECS</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px]">Score 9.7/10</span>
                </div>
                {renderBookDetailUI(2)}
              </div>
            </div>
          </div>
        </div>
      )}



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
              <img 
                src={lightboxImg.src} 
                alt={lightboxImg.title} 
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
