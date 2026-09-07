'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, Bus, ExternalLink, Code, Download, 
  Zap, Layers, GitBranch, Clock, 
  Sparkles, BookOpen, Smartphone, Monitor, FileText, 
  Eye, BarChart2, Server, Check, Compass, Users, Target, Grid,
  ChevronRight, Layout, Palette, Type, MousePointer, MapPin, 
  Calendar, CheckSquare, Search, QrCode
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Legend
} from 'recharts';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '../lib/visitorTracking';
import { useLanguage } from '../context/LanguageContext';
import { 
  libraryBusKPIs, weeklyActivityData, 
  latencyBenchmarkData, 
  realUIGallery, interactiveShowcases,
  ABOUT_US_DATA, UX_RESEARCH_DATA, BRAND_IDENTITY_DATA, WEBSITE_DESIGN_DATA
} from '../data/libraryBusData';
import { 
  DJANGO_APPS, PIPELINE_STOPS, LOCKING_CODE_SNIPPET, 
  CELERY_BEAT_SCHEDULES, DOCKER_COMPOSE_SERVICES 
} from '../data/libraryBusContent';
import LibraryBusVisualComparison from './LibraryBusVisualComparison';
import { scrollToSection, centerTabInContainer, useCaseStudyActions } from '../lib/uiHelpers';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import SectionHeader from './ui/SectionHeader';

export default function LibraryBusProject({ onBack, isEmbedded }: { onBack?: () => void; isEmbedded?: boolean } = {}) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const isEn = language === 'en';
  const { showToast, copyDeepLink, handleExportChart } = useCaseStudyActions(isEn);

  // Active showcase demo tab: 'gallery' | 'architecture-graph' | 'understand-radar' | 'presentation-slides' | 'website-pdf'
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<string>('gallery');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  // Navigation Items matching the 3 Chapters from "Thiết kế chưa có tên.pdf"
  const navItems = useMemo(() => [
    { id: 'sec-about', label: isEn ? '1.1 About Us' : '1.1 Về chúng tôi', chapter: '01' },
    { id: 'sec-research', label: isEn ? '1.2 UX Research' : '1.2 Nghiên cứu UX', chapter: '01' },
    { id: 'sec-logo', label: isEn ? '2.1 Logo System' : '2.1 Hệ thống Logo', chapter: '02' },
    { id: 'sec-components', label: isEn ? '2.2 UI Components' : '2.2 UI Components', chapter: '02' },
    { id: 'sec-grid-wireframe', label: isEn ? '3.1 Grid & Wireframe' : '3.1 Lưới & Wireframe', chapter: '03' },
    { id: 'sec-screens', label: isEn ? '3.2 20 UI Screens & Boards' : '3.2 20 Màn hình & Bảng Wireframe/UI', chapter: '03' },
    { id: 'sec-interactive', label: isEn ? '3.3 Live Demos' : '3.3 Trình diễn tương tác', chapter: '03' },
    { id: 'sec-tech', label: isEn ? '3.4 Tech & Telemetry' : '3.4 Kỹ thuật & Telemetry', chapter: '03' },
  ], [isEn]);

  // Unified ScrollSpy
  const sectionIds = useMemo(() => navItems.map(item => item.id), [navItems]);
  const { activeSection, scrollProgress, setActiveSection } = useScrollSpy(sectionIds, 130);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const subnavContainerRef = useRef<HTMLDivElement>(null);

  const handleCopyCode = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(LOCKING_CODE_SNIPPET);
      setCopiedSnippet(true);
      showToast(isEn ? 'Copied Python code snippet!' : 'Đã sao chép đoạn mã Python!', 'success');
      setTimeout(() => setCopiedSnippet(false), 2500);
    }
  };

  // Center active tab on taskbar horizontally only
  useEffect(() => {
    if (activeSection) {
      centerTabInContainer(subnavContainerRef.current, `nav-tab-${activeSection}`);
    }
  }, [activeSection]);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSection(id);
    scrollToSection(id, 16);
  };

  useEffect(() => {
    trackVisitorAction('Xem hồ sơ thiết kế & phân tích: Tủ Sách Lưu Động (Library Bus)', 'proj-library-bus', 'project');
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFDFE] font-sans text-[#1A2332] selection:bg-[#9BE7FA]/60 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs dark:bg-slate-900/95 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition-colors font-bold text-xs sm:text-sm group cursor-pointer dark:text-slate-300 dark:hover:text-white shrink-0"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0D7287] dark:text-[#9BE7FA]" />
            <span className="hidden sm:inline">{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
            <span className="sm:hidden">{isEn ? 'Back' : 'Quay lại'}</span>
          </button>

          {/* Project Identity Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#C8EEF7]/40 border border-[#9BE7FA]/60 text-xs font-black text-[#0D7287] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA] shrink-0">
            <Bus className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span className="hidden md:inline">Tủ Sách Lưu Động · Website Guidelines & Architecture</span>
            <span className="md:hidden">Library Bus Guidelines</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Download/View PDF Spec */}
            <a
              href="/library-bus/website.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              title={isEn ? 'Download System Spec PDF (9.5 MB)' : 'Tải hồ sơ đặc tả hệ thống PDF (9.5 MB)'}
            >
              <FileText className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span className="hidden sm:inline">PDF Spec (9.5MB)</span>
            </a>

            {/* GitHub Repo */}
            <a
              href="https://github.com/duongduongdphk66a-spec/prj"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
              title={isEn ? 'View GitHub Repository' : 'Xem mã nguồn trên GitHub'}
            >
              <Code className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span className="hidden sm:inline font-mono">GitHub</span>
            </a>

            {/* Open Standalone Page if Embedded */}
            {isEmbedded && (
              <a
                href="/projects/proj-library-bus"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
                title={isEn ? 'Open standalone page in new tab' : 'Mở toàn trang trong tab mới'}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(isEn ? 'vi' : 'en')}
              className="px-2.5 py-1.5 rounded-xl bg-[#0D7287] hover:bg-[#095869] text-white text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer border border-[#0D7287]"
              title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
            >
              <span>{isEn ? '🇬🇧 EN' : '🇻🇳 VI'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Bar with Dynamic ScrollSpy Active Effect */}
        <div 
          ref={subnavContainerRef}
          className="bg-[#F0F9FB]/95 backdrop-blur-md border-t border-[#D2EDF6] py-2 px-4 overflow-x-auto dark:bg-slate-900/90 dark:border-slate-800/80"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
              <span className="text-[11px] font-black uppercase text-[#0D7287] dark:text-[#9BE7FA] mr-1 shrink-0 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA] animate-ping" />
                {isEn ? 'Chapters:' : 'Chương mục:'}
              </span>
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    type="button"
                    onClick={(e) => handleNavClick(item.id, e)}
                    className={`group relative px-3 py-1.5 rounded-xl transition-all duration-200 ease-out cursor-pointer flex items-center gap-1.5 shrink-0 select-none ${
                      isActive
                        ? 'bg-[#9BE7FA] text-slate-950 font-black shadow-sm border-2 border-[#0D7287] scale-105 dark:bg-[#0D7287] dark:text-white dark:border-[#9BE7FA]'
                        : 'hover:bg-white hover:text-slate-950 text-slate-600 font-semibold border-2 border-transparent dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80'
                    }`}
                  >
                    {isActive && (
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D7287] opacity-75 dark:bg-[#9BE7FA]" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D7287] dark:bg-[#9BE7FA]" />
                      </span>
                    )}
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA] shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Reading progress tracker */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
              <span>{Math.round(scrollProgress)}%</span>
              <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full transition-all duration-150 bg-[#0D7287] dark:bg-[#9BE7FA]" 
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic reading progress line */}
        <div className="h-0.5 w-full bg-slate-200/80 overflow-hidden dark:bg-slate-800">
          <div 
            className="h-full transition-all duration-150 ease-out bg-gradient-to-r from-[#0D7287] via-[#9BE7FA] to-[#FFD14C]" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </nav>

      {/* Main Hero Header */}
      <header className="relative bg-gradient-to-b from-[#C8EEF7]/40 via-white to-[#FAFDFE] text-slate-900 pt-12 pb-16 overflow-hidden border-b border-[#D2EDF6] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white dark:border-slate-800">
        
        {/* Soft cyan & teal ambient glow */}
        <div className="absolute right-[5%] top-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-[#9BE7FA]/30 to-[#C8EEF7]/20 blur-3xl pointer-events-none hidden md:block" />
        <div className="absolute left-[3%] top-[30%] w-64 h-64 rounded-full bg-gradient-to-tr from-[#FFE485]/20 to-[#9BE7FA]/20 blur-3xl pointer-events-none hidden md:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 justify-between items-start mb-10">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8EEF7]/60 border border-[#9BE7FA] rounded-xl text-xs font-bold tracking-wide text-[#0D7287] shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
                <Bus className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'WEBSITE DESIGN GUIDELINES · ARENA MULTIMEDIA FORMAT' : 'QUY CHUẨN THIẾT KẾ WEBSITE & BÁO CÁO PHÂN TÍCH HỆ THỐNG THƯ VIỆN LƯU ĐỘNG'}</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                {isEn ? 'Library Bus System:' : 'Tủ Sách Lưu Động (Library Bus):'} <br />
                <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                  {isEn ? 'Website Guidelines, UX Research & Production Telemetry' : 'Bộ Quy Chuẩn Thiết Kế Giao Diện, Nghiên Cứu UX & Hạ Tầng Kỹ Thuật'}
                </span>
              </h1>
              
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed dark:text-slate-300">
                {isEn 
                  ? 'Complete 3-Chapter System Guidelines adapted from "Thiết kế chưa có tên.pdf" (Arena Multimedia). Featuring 01 Introduction and UX Research, 02 Logo and UI Components, and 03 Website Design with 8 key responsive screens, interactive architecture graph, and pessimistic locking (select_for_update) telemetry.'
                  : 'Trình bày theo đúng cấu trúc chuẩn hóa 3 chương từ tài liệu hồ sơ thiết kế: Chương 01 Giới thiệu & Nghiên cứu UX; Chương 02 Hệ thống Logo & Thành phần giao diện UI Components; Chương 03 Thiết kế 8 màn hình Website kèm bộ trình diễn tương tác kiến trúc Django và cơ chế khóa bi quan tồn kho.'}
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <a
                  href="#sec-screens"
                  onClick={(e) => handleNavClick('sec-screens', e)}
                  className="px-4 py-2 rounded-xl bg-[#0D7287] hover:bg-[#095869] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isEn ? 'View 8 UI Screens' : 'Xem 8 Màn Hình Giao Diện'}</span>
                </a>
                <a
                  href="/library-bus/website.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                >
                  <Download className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  <span>{isEn ? 'Download Spec PDF (9.5 MB)' : 'Tải Hồ Sơ Thiết Kế (9.5 MB)'}</span>
                </a>
              </div>
            </div>

            {/* Quick Architectural SLA Card */}
            <div className="bg-white border-2 border-[#9BE7FA]/80 rounded-3xl p-6 shadow-md min-w-[290px] space-y-3 dark:bg-slate-900 dark:border-slate-800">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold dark:text-slate-400">
                {isEn ? 'SYSTEM SCALE & RELIABILITY' : 'QUY MÔ VẬN HÀNH & HIỆU NĂNG'}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                50,000 <span className="text-lg font-bold text-[#0D7287] dark:text-[#9BE7FA]">{isEn ? 'Readers' : 'Độc giả'}</span>
              </div>
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3 dark:border-slate-800 dark:text-slate-300">
                <div className="flex justify-between items-center">
                  <span>{isEn ? 'Concurrent Connections:' : 'Kết nối đồng thời (CCU):'}</span>
                  <b className="font-mono text-[#0D7287] dark:text-[#9BE7FA]">500 CCU</b>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isEn ? 'Average Query Latency:' : 'Độ trễ truy vấn (Redis):'}</span>
                  <b className="font-mono text-emerald-600 font-bold">28ms (-93.7%)</b>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isEn ? 'Race Condition Rate:' : 'Xung đột tồn kho mượn trả:'}</span>
                  <b className="font-mono text-emerald-600 font-bold">0.0% (Locking)</b>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Core KPIs Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{libraryBusKPIs.activeBusFleet}</div>
              <div className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">{isEn ? 'Fleet (48 GPS Stops)' : 'Đội xe (48 Trạm GPS)'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">{libraryBusKPIs.totalCatalogBooks}</div>
              <div className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">{isEn ? 'Physical Catalog Books' : 'Đầu sách giấy trên hệ thống'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{libraryBusKPIs.totalCirculation}</div>
              <div className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">{isEn ? 'Circulation Operations' : 'Lượt mượn & trả thành công'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#9BE7FA] shadow-xs dark:bg-slate-900 dark:border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">&lt; 28ms</div>
              <div className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">{isEn ? 'O(1) Redis Query Time' : 'Độ trễ phản hồi O(1) Redis'}</div>
            </div>
          </div>
        </div>
      </header>

      {/* BODY CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-20">
        
        {/* ========================================================================= */}
        {/* CHAPTER 01: INTRODUCTION AND RESEARCH                                    */}
        {/* ========================================================================= */}
        
        {/* 1.1 VỀ CHÚNG TÔI (ABOUT US) */}
        <section id="sec-about" className="space-y-6 scroll-mt-36">
          <SectionHeader
            variant="chapter"
            id="sec-about"
            chapter="CHAPTER 01"
            subtitle={isEn ? ABOUT_US_DATA.titleEn : ABOUT_US_DATA.titleVi}
            badge="1.1"
            title={isEn ? 'About Us' : 'Về Chúng Tôi'}
            onCopy={copyDeepLink}
          />

          <div className="grid md:grid-cols-3 gap-6">
            {/* Lý do phát triển */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3 dark:bg-slate-900 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-[#C8EEF7]/50 text-[#0D7287] flex items-center justify-center font-black">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {isEn ? ABOUT_US_DATA.reason.titleEn : ABOUT_US_DATA.reason.titleVi}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                {isEn ? ABOUT_US_DATA.reason.descEn : ABOUT_US_DATA.reason.descVi}
              </p>
            </div>

            {/* Sứ mệnh */}
            <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/80 shadow-xs hover:shadow-md transition-all space-y-3 dark:bg-slate-900 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-[#9BE7FA]/40 text-[#0D7287] flex items-center justify-center font-black">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {isEn ? ABOUT_US_DATA.mission.titleEn : ABOUT_US_DATA.mission.titleVi}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                {isEn ? ABOUT_US_DATA.mission.descEn : ABOUT_US_DATA.mission.descVi}
              </p>
            </div>

            {/* Ý nghĩa tên thương hiệu */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3 dark:bg-slate-900 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD14C]/30 text-slate-900 flex items-center justify-center font-black">
                <Sparkles className="w-5 h-5 text-[#0D7287]" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {isEn ? ABOUT_US_DATA.brandMeaning.titleEn : ABOUT_US_DATA.brandMeaning.titleVi}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                {isEn ? ABOUT_US_DATA.brandMeaning.descEn : ABOUT_US_DATA.brandMeaning.descVi}
              </p>
            </div>
          </div>
        </section>

        {/* 1.2 NGHIÊN CỨU TRẢI NGHIỆM NGƯỜI DÙNG (UX RESEARCH) */}
        <section id="sec-research" className="space-y-8 scroll-mt-36">
          <SectionHeader
            variant="chapter"
            id="sec-research"
            chapter="CHAPTER 01"
            subtitle={isEn ? UX_RESEARCH_DATA.subtitleEn : UX_RESEARCH_DATA.subtitleVi}
            badge="1.2"
            title={isEn ? 'UX Research & Customer Target' : 'Nghiên Cứu UX, Khách Hàng Mục Tiêu & Chức Năng'}
            onCopy={copyDeepLink}
          />

          {/* Part A: Market Research */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              <span>{isEn ? '1.2.1 Market Research & Industry Trends' : '1.2.1 Nghiên cứu thị trường & Xu hướng'}</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0D7287]" />
                  {isEn ? UX_RESEARCH_DATA.marketResearch.marketId.titleEn : UX_RESEARCH_DATA.marketResearch.marketId.titleVi}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                  {isEn ? UX_RESEARCH_DATA.marketResearch.marketId.descEn : UX_RESEARCH_DATA.marketResearch.marketId.descVi}
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5 dark:bg-slate-900 dark:border-slate-800">
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFD14C]" />
                  {isEn ? UX_RESEARCH_DATA.marketResearch.currentTrends.titleEn : UX_RESEARCH_DATA.marketResearch.currentTrends.titleVi}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                  {isEn ? UX_RESEARCH_DATA.marketResearch.currentTrends.descEn : UX_RESEARCH_DATA.marketResearch.currentTrends.descVi}
                </p>
              </div>
            </div>
          </div>

          {/* Part B: Customer Target & 3 User Personas */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{isEn ? '1.2.2 Customer Target (Demographics & 3 Personas)' : '1.2.2 Khách hàng mục tiêu & 3 Chân dung người dùng (Personas)'}</span>
            </h3>

            {/* Demographics Strip */}
            <div className="p-4 rounded-2xl bg-[#F0F9FB] border border-[#D2EDF6] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs dark:bg-slate-900 dark:border-slate-800">
              {UX_RESEARCH_DATA.customerTarget.demographics.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">{isEn ? item.labelEn : item.labelVi}</span>
                  <p className="font-black text-slate-900 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {/* 3 Personas Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {UX_RESEARCH_DATA.customerTarget.personas.map((persona, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#C8EEF7]/50 text-2xl flex items-center justify-center">
                      {persona.avatar}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">{persona.name}</h4>
                      <p className="text-[11px] font-bold text-[#0D7287] dark:text-[#9BE7FA]">{isEn ? persona.roleEn : persona.roleVi}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Nhu cầu & Kỳ vọng:</span>
                      <p className="text-slate-600 dark:text-slate-400">{isEn ? persona.needsEn : persona.needsVi}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 dark:bg-slate-800 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-amber-800 dark:text-amber-400">Điểm đau (Pain Point):</span>
                      <p className="text-slate-600 dark:text-slate-400">{isEn ? persona.painPointEn : persona.painPointVi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Part C: Website References (Benchmarking) */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
              <Layout className="w-4 h-4" />
              <span>{isEn ? '1.2.3 Website References & Comparative Analysis' : '1.2.3 Đối chuẩn mô hình tham chiếu (Website References)'}</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {UX_RESEARCH_DATA.websiteReferences.map((ref, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{ref.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Ref 0{idx+1}</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <p><b className="text-emerald-600">Ưu điểm:</b> <span className="text-slate-600 dark:text-slate-400">{ref.prosVi}</span></p>
                    <p><b className="text-rose-600">Hạn chế:</b> <span className="text-slate-600 dark:text-slate-400">{ref.consVi}</span></p>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <b className="text-[#0D7287] dark:text-[#9BE7FA]">Bài học áp dụng:</b>
                      <p className="text-slate-600 mt-0.5 dark:text-slate-400">{ref.takeawayVi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Part D: Website Core Functions */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span>{isEn ? '1.2.4 Website Core Functions (6 Modules)' : '1.2.4 6 Chức năng cốt lõi của Website'}</span>
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {UX_RESEARCH_DATA.functions.map((func) => (
                <div key={func.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-[#9BE7FA] transition-all space-y-2 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="w-7 h-7 rounded-xl bg-[#0D7287] text-white flex items-center justify-center text-xs font-black">
                      {func.id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Core Feature</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {isEn ? func.nameEn : func.nameVi}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {func.descVi}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Part E: Sitemap & User Flow */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Sitemap Structure */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                <span>{isEn ? '1.2.5 Sitemap Detail' : '1.2.5 Sơ đồ cấu trúc Website (Sitemap)'}</span>
              </h3>
              <div className="space-y-3 text-xs">
                {UX_RESEARCH_DATA.sitemap.map((node, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800 space-y-1.5">
                    <div className="font-black text-slate-900 flex items-center gap-1.5 dark:text-white">
                      <ChevronRight className="w-3.5 h-3.5 text-[#0D7287]" />
                      <span>{node.parentVi}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-5">
                      {node.childrenVi.map((c, cIdx) => (
                        <span key={cIdx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Flow Diagram */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                <span>{isEn ? '1.2.6 User Flow: Book Reservation & Hold Checkout' : '1.2.6 Sơ đồ luồng người dùng (User Flow)'}</span>
              </h3>
              <div className="p-4 rounded-2xl bg-[#F0F9FB] border border-[#D2EDF6] dark:bg-slate-950 dark:border-slate-800 space-y-3 overflow-x-auto">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Bắt đầu/Kết thúc</span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800">Điểm quyết định</span>
                  <span className="px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800">Hành động</span>
                </div>
                <div className="space-y-2 min-w-[500px]">
                  {UX_RESEARCH_DATA.userFlowSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-400 w-6 shrink-0">0{idx+1}</span>
                      <div className={`px-3 py-1.5 text-xs font-bold shrink-0 flex items-center gap-2 ${
                        step.type === 'start' || step.type === 'end'
                          ? 'rounded-full bg-emerald-600 text-white shadow-xs'
                          : step.type === 'decision'
                          ? 'rounded-xl bg-[#FFD14C] text-slate-950 border border-amber-300'
                          : 'rounded-xl bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:text-white dark:border-slate-700'
                      }`}>
                        <span>{step.labelVi}</span>
                      </div>
                      <span className="text-slate-400">→</span>
                      <span className="text-[11px] text-slate-500 truncate dark:text-slate-400">{step.descVi}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CHAPTER 02: LOGO AND UI COMPONENTS                                       */}
        {/* ========================================================================= */}

        {/* 2.1 HỆ THỐNG LOGO */}
        <section id="sec-logo" className="space-y-6 scroll-mt-36">
          <SectionHeader
            variant="chapter"
            id="sec-logo"
            chapter="CHAPTER 02"
            subtitle={isEn ? BRAND_IDENTITY_DATA.titleEn : BRAND_IDENTITY_DATA.titleVi}
            badge="2.1"
            title={isEn ? 'Logo Idea, Grid Structure & Safe Distance' : 'Hệ Thống Logo, Tỉ Lệ Lưới 6.6X & Khoảng Cách An Toàn'}
            onCopy={copyDeepLink}
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
              <div className="p-8 rounded-2xl bg-gradient-to-br from-[#F0F9FB] to-[#C8EEF7]/40 border-2 border-dashed border-[#9BE7FA] flex flex-col items-center justify-center gap-3 dark:bg-slate-800 dark:border-slate-700">
                <div className="w-20 h-20 rounded-3xl bg-[#0D7287] text-white flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <Bus className="w-10 h-10 text-[#9BE7FA]" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-black tracking-tight text-slate-900 dark:text-white">LIBRARY BUS</div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-[#0D7287] dark:text-[#9BE7FA]">Transit Wisdom · Tri Thức Lưu Động</div>
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

                <div className="p-4 rounded-2xl bg-[#C8EEF7]/30 border border-[#9BE7FA]/60 text-xs text-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
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
            onCopy={copyDeepLink}
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

          {/* Color Palette (Portfolio Tokens) */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span>{isEn ? '2.2.2 Color System (Portfolio Harmonized Tokens)' : '2.2.2 Bảng màu chuẩn giao diện (Màu Portfolio Cá Nhân)'}</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {BRAND_IDENTITY_DATA.colors.primary.map((col, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
                  <div className="h-16 w-full rounded-2xl shadow-inner border border-black/10" style={{ backgroundColor: col.hex }} />
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm">{col.nameVi}</h4>
                    <div className="flex justify-between font-mono text-xs text-slate-500 mt-1">
                      <span>{col.hex}</span>
                      <span>RGB({col.rgb})</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-2 dark:text-slate-400">{col.roleVi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive UI Components: Buttons, Inputs & Icons */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Button States */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                <span>2.2.3 Trạng thái nút bấm (Button States)</span>
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Button (Hành động chính):</div>
                  <div className="flex flex-wrap gap-3 items-center">
                    <button className="px-4 py-2 rounded-xl bg-[#0D7287] text-white text-xs font-black shadow-md cursor-pointer hover:bg-[#095869]">
                      Default: Đặt mượn
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-[#095869] text-white text-xs font-black shadow-lg ring-2 ring-[#9BE7FA]">
                      Hover: Đặt mượn
                    </button>
                    <button disabled className="px-4 py-2 rounded-xl bg-slate-300 text-slate-500 text-xs font-bold cursor-not-allowed">
                      Disabled
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Secondary & Gold CTA:</div>
                  <div className="flex flex-wrap gap-3 items-center">
                    <button className="px-4 py-2 rounded-xl bg-[#FFD14C] text-slate-950 text-xs font-black shadow-md hover:bg-[#FFE485]">
                      Gold CTA: Giữ chỗ ngay
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-white border border-[#0D7287] text-[#0D7287] text-xs font-black hover:bg-[#F0F9FB]">
                      Secondary Outline
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Inputs & Icon Set */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0D7287] focus:ring-2 focus:ring-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>

                {/* Standard 24px Icons */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-600 mb-2 dark:text-slate-400">Bộ 12 Icon chuẩn kích thước 24×24px:</div>
                  <div className="grid grid-cols-6 gap-2 text-center text-[#0D7287] dark:text-[#9BE7FA]">
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

        {/* ========================================================================= */}
        {/* CHAPTER 03: WEBSITE DESIGN                                               */}
        {/* ========================================================================= */}

        {/* 3.1 & 3.2 LƯỚI QUY CHUẨN & WIREFRAME */}
        <section id="sec-grid-wireframe" className="space-y-6 scroll-mt-36">
          <SectionHeader
            variant="chapter"
            id="sec-grid-wireframe"
            chapter="CHAPTER 03"
            subtitle={isEn ? WEBSITE_DESIGN_DATA.titleEn : WEBSITE_DESIGN_DATA.titleVi}
            badge="3.1 & 3.2"
            title={isEn ? 'Grid System (12 Columns) & Wireframe Principles' : 'Hệ Thống Lưới 12 Cột & Quy Chuẩn Wireframe'}
            onCopy={copyDeepLink}
          />

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Grid Specifications Box */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <Grid className="w-4 h-4" />
                <span>3.1 Hệ thống lưới Desktop 12 Columns</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Quy chuẩn theo tiêu chuẩn trình bày chuyên nghiệp từ tài liệu mẫu với 12 cột linh hoạt đảm bảo tính cân đối trên mọi độ phân giải.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Columns (Số lượng cột):</span>
                  <b className="font-mono text-slate-900 dark:text-white">12</b>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Margin (Lề hai bên):</span>
                  <b className="font-mono text-slate-900 dark:text-white">{WEBSITE_DESIGN_DATA.gridSystem.margin}</b>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Width (Độ rộng cột):</span>
                  <b className="font-mono text-slate-900 dark:text-white">{WEBSITE_DESIGN_DATA.gridSystem.width}</b>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Gutter (Khoảng cách giữa các cột):</span>
                  <b className="font-mono text-slate-900 dark:text-white">{WEBSITE_DESIGN_DATA.gridSystem.gutter}</b>
                </div>
              </div>
            </div>

            {/* 12-Column Visual Simulation */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <Layout className="w-4 h-4" />
                <span>Mô phỏng trực quan lưới 12 cột trên màn hình</span>
              </h3>
              
              <div className="p-4 rounded-2xl bg-[#F0F9FB] border border-[#D2EDF6] dark:bg-slate-950 dark:border-slate-800">
                <div className="grid grid-cols-12 gap-2 h-36">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-[#9BE7FA]/40 border border-[#0D7287]/30 rounded-lg flex flex-col justify-between items-center py-2 text-[10px] font-mono text-[#0D7287] dark:text-[#9BE7FA]"
                    >
                      <span>Col</span>
                      <span className="font-bold">{i+1}</span>
                      <span className="text-[8px] opacity-70">78px</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Margin: 360px</span>
                  <span>Gutter: 24px</span>
                  <span>Container Max-Width: 1280px</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                3.2 Wireframe tập trung cấu trúc phân tầng thông tin, đảm bảo hành trình tra cứu và đặt mượn sách không bị xao nhãng bởi yếu tố trang trí.
              </p>
            </div>
          </div>
        </section>

        {/* 3.2 THIẾT KẾ WEBSITE & BẢNG TỔNG HỢP 20 MÀN HÌNH WIREFRAME VS UI DESIGN */}
        <section id="sec-screens" className="space-y-6 scroll-mt-36">
          <SectionHeader
            variant="chapter"
            id="sec-screens"
            chapter="CHAPTER 03"
            subtitle={isEn ? '3.2 Master 20-Screen System (Wireframe & UI Design)' : '3.2 Hệ thống 20 màn hình Wireframe & Giao diện UI hoàn chỉnh'}
            badge="3.2"
            title={isEn ? '20-Screen Master Boards & Side-by-Side Visual Comparison' : 'Bảng Tổng Hợp 20 Màn Hình Wireframe vs Giao Diện Thật (Chuẩn Mẫu Hồ Sơ Thiết Kế)'}
            onCopy={copyDeepLink}
          />

          {/* Interactive 20-Screen & Side-by-Side Spread Component */}
          <LibraryBusVisualComparison 
            isEn={isEn} 
            onOpenZoom={(src) => setSelectedGalleryImg(src)} 
          />
        </section>


        {/* 3.4 TRÌNH DIỄN TƯƠNG TÁC & HỆ THỐNG KIẾN TRÚC */}
        <section id="sec-interactive" className="space-y-6 scroll-mt-36">
          <SectionHeader
            variant="chapter"
            id="sec-interactive"
            chapter="CHAPTER 03"
            subtitle={isEn ? '3.4 Interactive Demos & Embedded Specifications' : '3.4 Bộ trình diễn tương tác & Bản đồ kiến trúc'}
            badge="3.4"
            title={isEn ? 'Live Interactive Showcase & Architecture Graph' : 'Bộ Trình Diễn Tương Tác: Bản Đồ Kiến Trúc & Slide Thuyết Trình'}
            onCopy={copyDeepLink}
          />

          {/* Showcase Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <button
              onClick={() => setActiveShowcaseTab('gallery')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeShowcaseTab === 'gallery'
                  ? 'bg-[#0D7287] text-white shadow-md'
                  : 'text-slate-700 hover:text-[#0D7287] hover:bg-white/80 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{isEn ? '1. Real Fleet & UI Gallery' : '1. Thư Viện Ảnh Thực Địa'}</span>
            </button>

            {interactiveShowcases.map((showcase) => (
              <button
                key={showcase.id}
                onClick={() => setActiveShowcaseTab(showcase.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  activeShowcaseTab === showcase.id
                    ? 'bg-[#0D7287] text-white shadow-md'
                    : 'text-slate-700 hover:text-[#0D7287] hover:bg-white/80 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {showcase.id === 'architecture-graph' && <GitBranch className="w-4 h-4" />}
                {showcase.id === 'understand-radar' && <Layers className="w-4 h-4" />}
                {showcase.id === 'presentation-slides' && <Monitor className="w-4 h-4" />}
                {showcase.id === 'website-pdf' && <FileText className="w-4 h-4" />}
                <span>{isEn ? showcase.titleEn : showcase.titleVi}</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] font-bold dark:bg-slate-800 dark:text-[#9BE7FA]">
                  {showcase.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Tab 1: Real Fleet & UI Gallery */}
          {activeShowcaseTab === 'gallery' && (
            <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {realUIGallery.map((item) => (
                <div 
                  key={item.id}
                  className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group dark:bg-slate-900 dark:border-slate-800"
                >
                  <div className="relative h-56 w-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                    <img 
                      src={item.src} 
                      alt={item.titleVi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => setSelectedGalleryImg(item.src)}
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-bold">
                      {item.tag}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {isEn ? item.titleEn : item.titleVi}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed dark:text-slate-400">
                        {isEn ? item.descEn : item.descVi}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center dark:border-slate-800">
                      <span className="text-[11px] font-mono text-slate-400">Source: static_presentation</span>
                      <a 
                        href={item.src} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#0D7287] hover:underline flex items-center gap-1 dark:text-[#9BE7FA]"
                      >
                        <span>{isEn ? 'View full size' : 'Xem kích thước gốc'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Interactive D3 Architecture Graph */}
          {activeShowcaseTab === 'architecture-graph' && (
            <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden animate-in fade-in duration-300 dark:bg-slate-900 dark:border-slate-800">
              <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <GitBranch className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  <span>Interactive Architecture Graph (7 Apps, Models & Foreign Keys)</span>
                </div>
                <a
                  href="/library-bus/architecture-graph.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#0D7287]" />
                  <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
                </a>
              </div>
              <div className="w-full h-[650px] bg-slate-50 dark:bg-slate-950">
                <iframe
                  src="/library-bus/architecture-graph.html"
                  title="Library Bus Architecture Graph"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Concentric Architecture Radar */}
          {activeShowcaseTab === 'understand-radar' && (
            <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden animate-in fade-in duration-300 dark:bg-slate-900 dark:border-slate-800">
              <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Layers className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  <span>Concentric Architecture Radar: Bản đồ Vòng Tròn Đồng Tâm</span>
                </div>
                <a
                  href="/library-bus/understand_dashboard.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#0D7287]" />
                  <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
                </a>
              </div>
              <div className="w-full h-[650px] bg-slate-50 dark:bg-slate-950">
                <iframe
                  src="/library-bus/understand_dashboard.html"
                  title="Library Bus Concentric Radar"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* Tab 4: 30-Slide Presentation Deck */}
          {activeShowcaseTab === 'presentation-slides' && (
            <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden animate-in fade-in duration-300 dark:bg-slate-900 dark:border-slate-800">
              <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Monitor className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  <span>30-Slide Project Presentation Deck (Research, Architecture & Data Spec)</span>
                </div>
                <a
                  href="/library-bus/presentation.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#0D7287]" />
                  <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
                </a>
              </div>
              <div className="w-full h-[650px] bg-slate-50 dark:bg-slate-950">
                <iframe
                  src="/library-bus/presentation.html"
                  title="Library Bus 30-Slide Presentation"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* Tab 5: Original Specification & Design PDF */}
          {activeShowcaseTab === 'website-pdf' && (
            <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden animate-in fade-in duration-300 dark:bg-slate-900 dark:border-slate-800">
              <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <FileText className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  <span>website.pdf: Bản Đặc Tả Thiết Kế Hoàn Chỉnh (9.5 MB)</span>
                </div>
                <a
                  href="/library-bus/website.pdf"
                  target="_blank"
                  download="website.pdf"
                  className="px-3 py-1 rounded-xl bg-[#0D7287] hover:bg-[#095869] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Download PDF' : 'Tải tập tin PDF'}</span>
                </a>
              </div>
              <div className="w-full h-[650px] bg-slate-50 dark:bg-slate-950">
                <iframe
                  src="/library-bus/website.pdf"
                  title="Library Bus Website Spec PDF"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}
        </section>

        {/* 3.5 PHÂN HỆ KỸ THUẬT & TELEMETRY */}
        <section id="sec-tech" className="space-y-8 scroll-mt-36">
          <SectionHeader
            variant="chapter"
            id="sec-tech"
            chapter="CHAPTER 03"
            subtitle={isEn ? '3.5 Technical Architecture & Data Engineering' : '3.5 Kiến trúc kỹ thuật & Kỹ thuật dữ liệu'}
            badge="3.5"
            title={isEn ? '7 Django Apps, Pessimistic Locking & Weekly Trends' : 'Kiến Trúc 7 Django Apps, Khóa Bi Quan & Xu Hướng Vận Hành'}
            onCopy={copyDeepLink}
          />

          {/* 7 Django Apps Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>7 Phân Hệ Nghiệp Vụ Django (Modular Monolith)</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DJANGO_APPS.map((app, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#0D7287]/50 hover:shadow-md transition-all space-y-3 dark:bg-slate-900 dark:border-slate-800"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#C8EEF7]/40 text-[#0D7287] border border-[#9BE7FA]/50 dark:bg-slate-800 dark:text-[#9BE7FA]">
                      app: {app.app}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">0{idx + 1}/07</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {isEn ? app.nameEn : app.nameVi}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                    {isEn ? app.descEn : app.descVi}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 dark:border-slate-800">
                    {app.models.map((m, mIdx) => (
                      <span key={mIdx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Propagation Pipeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              <span>Luồng Dữ Liệu 6 Trạm Dừng (Event Pipeline)</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PIPELINE_STOPS.map((stop, i) => (
                <div 
                  key={i} 
                  className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#9BE7FA] hover:shadow-md transition-all space-y-3 dark:bg-slate-900 dark:border-slate-800 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-[#0D7287] text-white flex items-center justify-center font-black text-sm">
                      {stop.stop}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#C8EEF7]/40 text-[#0D7287] border border-[#9BE7FA]/40 dark:bg-slate-800 dark:text-[#9BE7FA]">
                      {stop.tag}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {isEn ? stop.titleEn : stop.titleVi}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                    {isEn ? stop.descEn : stop.descVi}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Concurrency Locking & Redis Benchmarks */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Real Source Code Box */}
            <div className="lg:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md flex flex-col">
              <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  </div>
                  <span className="font-mono text-slate-400 ml-2">transactions/services.py (Pessimistic Locking)</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed flex-1">
                <code>{LOCKING_CODE_SNIPPET}</code>
              </pre>
            </div>

            {/* Performance Benchmark Table & Analysis */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 dark:bg-slate-900 dark:border-slate-800">
                <h4 className="text-sm font-black uppercase text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  {isEn ? 'Redis Caching Benchmark (ms)' : 'Benchmark Đo Lường Hiệu Năng Redis Cache'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Triển khai bộ đệm đa tầng Redis Memory giúp giảm trung bình 93.7% thời gian truy vấn cho độc giả.
                </p>
                <div className="space-y-2 pt-1">
                  {latencyBenchmarkData.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1 dark:bg-slate-800 dark:border-slate-700">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>{item.endpoint}</span>
                        <span className="text-emerald-600 font-mono font-black">{item.withCache}ms</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Không cache: <b className="line-through text-red-500">{item.withoutCache}ms</b></span>
                        <span className="font-mono text-[#0D7287] dark:text-[#9BE7FA]">Giảm {item.reduction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Celery Tasks & Weekly Activity Chart */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Celery Beat Schedule Table */}
            <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <h4 className="text-sm font-black uppercase text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {isEn ? 'Automated Periodic Maintenance Schedules' : 'Lịch Trình Tự Động Định Kỳ (Celery Beat Schedules)'}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F0F9FB] text-slate-900 font-bold uppercase border-b border-[#D2EDF6] dark:bg-slate-800 dark:text-slate-300">
                    <tr>
                      <th className="p-3">Thời Điểm</th>
                      <th className="p-3">Tác Vụ (Task)</th>
                      <th className="p-3">App</th>
                      <th className="p-3">Mô Tả Xử Lý</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {CELERY_BEAT_SCHEDULES.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-[#0D7287] whitespace-nowrap dark:text-[#9BE7FA]">{item.time}</td>
                        <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{item.taskName}</td>
                        <td className="p-3 text-slate-500 font-mono">{item.app}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{isEn ? item.descEn : item.descVi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weekly Borrow/Return Telemetry Chart */}
            <div id="chart-weekly-circulation" className="lg:col-span-5 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black uppercase text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  {isEn ? 'Weekly Borrow vs Return Trend' : 'Xu Hướng Mượn / Trả Trong Tuần'}
                </h4>
                <button
                  onClick={() => handleExportChart('chart-weekly-circulation', 'weekly_circulation_trend')}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                  title="Tải ảnh PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyActivityData}>
                    <defs>
                      <linearGradient id="colorBorrows" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0D7287" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0D7287" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFD14C" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#FFD14C" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="borrows" name="Lượt mượn" stroke="#0D7287" fillOpacity={1} fill="url(#colorBorrows)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="returns" name="Lượt trả" stroke="#FFD14C" fillOpacity={1} fill="url(#colorReturns)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Docker Infrastructure Topology */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
              <Server className="w-4 h-4" />
              <span>Hạ Tầng Triển Khai & Mô Hình Docker Compose</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DOCKER_COMPOSE_SERVICES.map((srv, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#0D7287]/50 hover:shadow-md transition-all space-y-3 dark:bg-slate-900 dark:border-slate-800"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                      <Server className="w-4 h-4" />
                      <span>{srv.service}</span>
                    </div>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {srv.port}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-500">Image: {srv.image}</div>
                  <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                    {isEn ? srv.roleEn : srv.roleVi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Callout */}
        <div className="rounded-3xl bg-gradient-to-r from-[#C8EEF7]/30 via-white to-[#C8EEF7]/30 p-8 border-2 border-[#9BE7FA]/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:border-slate-800">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {isEn ? 'Want to inspect the complete source code or design spec?' : 'Bạn muốn tìm hiểu sâu hơn về mã nguồn hoặc hồ sơ thiết kế?'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isEn 
                ? 'Full source code available on GitHub. Complete system architecture and wireframes documented in website.pdf (9.5 MB).'
                : 'Mã nguồn đầy đủ đã được công khai trên GitHub. Toàn bộ kiến trúc và thiết kế giao diện được lưu trữ trong tập tin website.pdf (9.5 MB).'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/library-bus/website.pdf"
              target="_blank"
              download="website.pdf"
              className="px-4 py-2.5 rounded-xl bg-[#0D7287] hover:bg-[#095869] text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>{isEn ? 'Download PDF (9.5 MB)' : 'Tải Hồ Sơ PDF'}</span>
            </a>
            <a
              href="https://github.com/duongduongdphk66a-spec/prj"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 text-xs font-black transition-all shadow-xs flex items-center gap-1.5 dark:bg-slate-800 dark:text-white dark:border-slate-700"
            >
              <Code className="w-4 h-4 text-[#0D7287]" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>
      </main>

      {/* Image Zoom Modal */}
      {selectedGalleryImg && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedGalleryImg(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] bg-transparent rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={selectedGalleryImg} 
              alt="Zoomed UI preview" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
            />
            <button
              onClick={() => setSelectedGalleryImg(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
