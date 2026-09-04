'use client';

import React, { useEffect } from 'react';
import { 
  ArrowLeft, Bus, 
  ExternalLink, Code, Download, Link as LinkIcon 
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '../lib/visitorTracking';
import { useLanguage } from '../context/LanguageContext';
import { weeklyActivityData } from '../data/libraryBusData';
import { DJANGO_APPS, PIPELINE_STOPS, SCHEMA_MODELS, CELERY_TASKS, TECH_STACK } from '../data/libraryBusContent';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useToast } from './ui/Toast';
import { exportChartAsPng } from '../lib/chartExport';

/** Reusable section header with badge, title, and deep-link button */
function SectionHeader({ badge, title, sectionId, isEn, onCopyLink }: {
  badge: string; title: string; sectionId: string; isEn: boolean;
  onCopyLink: (_id: string, _label: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
          <span>{badge}</span>
        </div>
        <button
          onClick={() => onCopyLink(sectionId, title)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          title={isEn ? 'Copy link to section' : 'Sao chép liên kết mục'}
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
        {title}
      </h2>
    </div>
  );
}

const LIBRARY_BUS_SECTIONS = ['overview', 'kien-truc', 'thuat-toan', 'schema', 'celery', 'stack'];

export default function LibraryBusProject({ onBack, isEmbedded }: { onBack?: () => void; isEmbedded?: boolean } = {}) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { showToast } = useToast();
  const isEn = language === 'en';

  const copyDeepLink = (sectionId: string, title: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
      navigator.clipboard.writeText(url);
      showToast(isEn ? `Copied link to ${title}!` : `Đã sao chép liên kết mục ${title}!`, 'success');
    }
  };

  const handleExportChart = async (elementId: string, name: string) => {
    const ok = await exportChartAsPng(elementId, `${name}.png`);
    if (ok) {
      showToast(isEn ? `Exported ${name} as PNG!` : `Đã tải ảnh biểu đồ ${name}!`, 'success');
    }
  };

  const activeSection = useScrollSpy(LIBRARY_BUS_SECTIONS, 130);

  const navItems = [
    { id: 'overview', label: isEn ? 'Overview' : 'Tổng quan' },
    { id: 'kien-truc', label: isEn ? '6-Stop Pipeline' : 'Luồng dữ liệu' },
    { id: 'thuat-toan', label: isEn ? 'Algorithms' : 'Thuật toán' },
    { id: 'schema', label: isEn ? 'Schema Models' : 'Mô hình dữ liệu' },
    { id: 'celery', label: isEn ? 'Celery Beat' : 'Tác vụ nền' },
    { id: 'stack', label: isEn ? 'Tech Stack' : 'Hạ tầng' },
  ];

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Library Bus Hệ Thống Thư Viện Lưu Động', 'proj-library-bus', 'project');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-element').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-white font-lora text-slate-900 selection:bg-[#FFE485]/40 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/90 transition-all dark:bg-slate-900/90 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-950 transition-colors font-bold text-sm group cursor-pointer dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>{t('nav_back_to_portfolio', 'Quay lại Portfolio')}</span>
          </button>
          
          <div className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#8CE0F4] text-slate-950 shadow-sm font-extrabold shadow-sky-300/40 dark:bg-slate-800 dark:text-[#9BE7FA] dark:shadow-none'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 font-semibold'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}

            {/* GitHub Repo Button */}
            <a
              href="https://github.com/duongduongdphk66a-spec/prj"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 px-3 ml-1.5 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
              title={isEn ? 'View GitHub Repository' : 'Xem mã nguồn trên GitHub'}
            >
              <Code className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span className="font-mono text-xs">GitHub</span>
            </a>

            {/* Open Standalone Page if Embedded */}
            {isEmbedded && (
              <a
                href="/projects/proj-library-bus"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 px-3 ml-1.5 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
                title={isEn ? 'Open standalone page in new tab' : 'Mở trang độc lập'}
              >
                <ExternalLink className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span className="font-mono text-xs">{isEn ? 'Tab' : 'Tab mới'}</span>
              </a>
            )}

            {/* Quick Language Toggle */}
            <button
              onClick={() => setLanguage(isEn ? 'vi' : 'en')}
              className="px-2.5 py-1 rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer ml-1 border border-[#FFD14C] dark:bg-slate-900 dark:text-white dark:border-slate-800 dark:hover:bg-slate-800"
              title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
            >
              <span>{isEn ? '🇬🇧 EN' : '🇻🇳 VI'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-b from-[#F3FCFE] via-[#FFFDF5] to-[#FFF9E6] text-slate-900 pt-16 pb-20 overflow-hidden border-b border-slate-200/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-white dark:border-slate-800" id="overview">
        
        {/* Ambient background blur */}
        <div className="absolute right-[8%] top-[10%] w-60 h-60 rounded-full bg-gradient-to-tr from-[#FFE485] via-[#FFD14C] to-[#9BE7FA] opacity-35 blur-3xl pointer-events-none hidden md:block" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-10 justify-between items-start mb-12">
            <div className="max-w-2xl space-y-4">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C8EEF7]/60 border border-[#9BE7FA] rounded-md text-xs font-bold tracking-wide text-slate-900 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
                <Bus className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#FFD14C]" />
                <span>{isEn ? 'LINE 01 · DATA ARCHITECTURE & ANALYTICS CASE STUDY' : 'LINE 01 : CASE STUDY KIẾN TRÚC DỮ LIỆU & TẦNG ANALYTICS'}</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight text-slate-950 dark:text-white">
                {isEn ? 'Library Bus: Mobile Fleet' : 'Library Bus : Thư Viện Lưu Động'} <br/>
                <span className="text-[#0D7287] dark:text-[#9BE7FA] font-extrabold text-2xl sm:text-4xl lg:text-5xl">
                  {isEn ? '& Real-Time Analytics Engine Behind It' : '& Tầng Phân Tích Dữ Liệu Đứng Sau'}
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed dark:text-slate-300">
                {isEn 
                  ? 'A high-load Django system for mobile "books on wheels" fleet: tracking each bus trip, borrow/return lifecycle, converting telemetry into reader reputation scores, book popularity ratings, and near real-time operational reports.'
                  : 'Hệ thống Django cho mô hình "xe bus chở sách": theo dõi từng chuyến xe, từng lượt mượn/trả, và biến chúng thành điểm uy tín, xếp hạng thành viên, gợi ý sách thông minh và báo cáo vận hành theo thời gian thực.'}
              </p>
              
              <div className="flex flex-wrap gap-2.5 pt-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                  {isEn ? 'Core Role:' : 'Vai trò:'} <b className="text-[#0D7287] dark:text-[#9BE7FA]">Thiết kế Backend & Tầng Analytics</b>
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                  {isEn ? 'Core Stack:' : 'Stack:'} <b className="text-[#0D7287] dark:text-[#9BE7FA]">Django · MySQL · Redis · Celery</b>
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                  {isEn ? 'Capacity Target:' : 'Mục tiêu tải:'} <b className="text-[#0D7287] dark:text-[#FFD14C] font-serif font-bold">50k Users / 500 Conns</b>
                </span>
              </div>

              <div className="pt-2">
                <a
                  href="https://github.com/duongduongdphk66a-spec/prj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 font-black text-xs shadow-md border border-[#FFD14C] transition-all cursor-pointer dark:bg-slate-900 dark:text-white dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  <span>{isEn ? 'Explore GitHub Repository' : 'Xem mã nguồn trên GitHub'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-950 dark:text-white" />
                </a>
              </div>
            </div>
            
            {/* Live Dashboard Mock Widget */}
            <div className="bg-white/95 border border-slate-200/90 rounded-3xl p-6 shadow-xl w-full lg:max-w-md space-y-4 dark:bg-slate-900/90 dark:border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  </div>
                  <span>/analytics/reports · Dashboard</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300">
                  LIVE TELEMETRY
                </span>
              </div>

              {/* 4 Mock Stats */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold dark:text-slate-400">Lượt mượn (kỳ)</div>
                  <div className="text-xl font-black font-serif text-[#0D7287] dark:text-[#9BE7FA]">1.284</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold dark:text-slate-400">Người dùng mới</div>
                  <div className="text-xl font-black font-serif text-slate-950 dark:text-white">96</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold dark:text-slate-400">Tỷ lệ hoàn trả</div>
                  <div className="text-xl font-black font-serif text-[#0D7287] dark:text-[#FFD14C]">91.4%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold dark:text-slate-400">Xe bus hoạt động</div>
                  <div className="text-xl font-black font-serif text-slate-950 dark:text-white">7 / 9 xe</div>
                </div>
              </div>

              {/* Mini Trend Chart */}
              <div className="pt-1" id="lib-bus-telemetry-chart">
                <div className="text-xs font-bold text-slate-700 mb-2 dark:text-slate-300 flex justify-between items-center">
                  <span>Xu hướng mượn vs trả trong tuần</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-slate-400">DailyStats</span>
                    <button
                      onClick={() => handleExportChart('lib-bus-telemetry-chart', 'library-bus-telemetry')}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      title={isEn ? 'Export chart as PNG' : 'Tải ảnh biểu đồ PNG'}
                    >
                      <Download className="w-2.5 h-2.5" />
                      <span>PNG</span>
                    </button>
                  </div>
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyActivityData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="busBorrowGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0D7287" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#0D7287" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="busReturnGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFD14C" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#FFD14C" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                      <Area type="monotone" dataKey="borrows" name="Lượt mượn" stroke="#0D7287" strokeWidth={2} fill="url(#busBorrowGrad)" />
                      <Area type="monotone" dataKey="returns" name="Lượt trả" stroke="#FFD14C" strokeWidth={2} fill="url(#busReturnGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Main Sections */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-20">
        
        {/* SECTION 1: BỐI CẢNH & CẤU TRÚC 7 DJANGO APPS */}
        <section id="boi-canh" className="space-y-6 reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <SectionHeader badge="01 : BỐI CẢNH HỆ THỐNG" title={isEn ? 'Not Just a Regular Library Website' : 'Không Chỉ Là Một Website Mượn Sách'} sectionId="boi-canh" isEn={isEn} onCopyLink={copyDeepLink} />
            <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed dark:text-slate-300">
              {isEn 
                ? 'The mobile "bus" model fundamentally changes the operational dynamics: books travel along routes rather than staying stationary. Each bus has distinct capacity, route schedules, and operational status (active / resting / maintenance). The system must measure performance per vehicle and run gamification mechanics to foster regular reading habits.'
                : 'Mô hình "xe bus" khiến bài toán khác hẳn một thư viện tĩnh: sách di chuyển theo tuyến, mỗi xe có sức chứa và trạng thái vận hành riêng (đang chạy / tạm nghỉ / bảo trì). Hệ thống đòi hỏi khả năng đo lường hiệu suất theo từng xe, kết hợp cơ chế Gamification (điểm uy tín, 5 cấp thành viên) để duy trì thói quen đọc sách.'}
            </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DJANGO_APPS.map((a) => (
              <div key={a.app} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1 dark:bg-slate-900 dark:border-slate-800">
                <span className="font-mono text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA] block">
                  app : {a.app}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: KIẾN TRÚC & LUỒNG DỮ LIỆU (6-STOP ROUTE) */}
        <section id="kien-truc" className="space-y-8 reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <div className="space-y-2">
            <SectionHeader badge="02 : KIẾN TRÚC & LUỒNG DỮ LIỆU (ROUTE LINE)" title={isEn ? 'From a Single Book Borrow to a Dashboard Metric' : 'Từ Một Lượt Mượn Sách Đến Một Dòng Trong Báo Cáo'} sectionId="kien-truc" isEn={isEn} onCopyLink={copyDeepLink} />
            <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed dark:text-slate-300">
              {isEn
                ? 'Tracing the exact flow of data through the system: from user event, through async queue workers, to versioned Redis caching and pre-aggregated dashboards.'
                : 'Đi theo đúng hành trình dữ liệu thực tế di chuyển trong hệ thống: từ hành vi người dùng, qua hàng đợi Celery bất đồng bộ, đến cơ chế cache theo version và dashboard tổng hợp.'}
            </p>
          </div>

          {/* 6-Stop Timeline */}
          <div className="space-y-4">
            {PIPELINE_STOPS.map((s) => (
              <div key={s.stop} className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-[#0D7287] text-white flex items-center justify-center font-serif font-bold text-xs shrink-0 dark:bg-[#9BE7FA] dark:text-slate-950">
                  {s.stop}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-base font-black text-slate-950 dark:text-white">{s.title}</h3>
                    <span className="text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA]">{s.tag}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: THUẬT TOÁN & CÔNG THỨC TRỌNG SỐ */}
        <section id="thuat-toan" className="space-y-8 reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <div className="space-y-2">
            <SectionHeader badge="03 : CHỈ SỐ & THUẬT TOÁN TÍNH ĐIỂM" title={isEn ? 'Three Transparent Weighting Formulas' : 'Ba Công Thức Điều Khiển Toàn Bộ Hệ Thống Điểm'} sectionId="thuat-toan" isEn={isEn} onCopyLink={copyDeepLink} />
            <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed dark:text-slate-300">
              {isEn 
                ? 'No black-box ML required: formulas use explicit weights that are easily explainable to non-technical library operators and easily fine-tunable over time.'
                : 'Không dùng thư viện ML hộp đen: các chỉ số được tính bằng công thức trọng số tường minh, dễ giải thích cho người vận hành thư viện và dễ dàng tinh chỉnh.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Formula 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFE485] text-slate-950 flex items-center justify-center font-serif font-bold text-xs dark:bg-[#FFD14C]">01</span>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">Điểm Phổ Biến Sách</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                Kết hợp lượt mượn, đánh giá và lượt xem, cộng thêm điểm thưởng nếu sách vừa được mượn trong 30 ngày gần nhất để sách hot nổi lên nhanh hơn.
              </p>
              <div className="p-3.5 rounded-xl bg-[#FFE485] text-slate-950 font-mono text-xs font-bold leading-relaxed border border-[#FFD14C] overflow-x-auto shadow-2xs dark:bg-slate-950 dark:text-[#FFE485] dark:border-slate-800">
                popularity =<br/>
                &nbsp;&nbsp;0.6 * min(borrows * 5, 100)<br/>
                + 0.3 * (avg_rating * 20)<br/>
                + 0.1 * min(views * 0.1, 100)<br/>
                + 20 (nếu mượn &lt;= 30 ngày)
              </div>
            </div>

            {/* Formula 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C8EEF7] text-slate-950 flex items-center justify-center font-serif font-bold text-xs dark:bg-slate-800 dark:text-[#9BE7FA]">02</span>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">Hiệu Suất Xe Bus</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                Tỷ lệ chuyển đổi từ lượt ghé thăm sang lượt mượn thực tế trên từng xe, giúp so sánh hiệu quả giữa các tuyến xe và điểm dừng.
              </p>
              <div className="p-3.5 rounded-xl bg-[#FFE485] text-slate-950 font-mono text-xs font-bold leading-relaxed border border-[#FFD14C] overflow-x-auto shadow-2xs dark:bg-slate-950 dark:text-[#9BE7FA] dark:border-slate-800">
                efficiency =<br/>
                &nbsp;&nbsp;min(borrows / visits * 100, 100)
              </div>
            </div>

            {/* Formula 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFE485] text-slate-950 flex items-center justify-center font-serif font-bold text-xs dark:bg-[#FFD14C]">03</span>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">Cấp Độ Thành Viên</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                Điểm uy tín tích lũy từ hoạt động đọc (mượn +5, trả +10, review +3...) được ánh xạ sang 5 cấp độ thành viên tự động.
              </p>
              <div className="p-3.5 rounded-xl bg-[#FFE485] text-slate-950 font-mono text-xs font-bold leading-relaxed border border-[#FFD14C] overflow-x-auto shadow-2xs dark:bg-slate-950 dark:text-slate-200 dark:border-slate-800">
                0 - 199 &nbsp;&nbsp;&nbsp;→ Đồng (Bronze)<br/>
                200 - 399 &nbsp;→ Bạc (Silver)<br/>
                400 - 599 &nbsp;→ Vàng (Gold)<br/>
                600 - 799 &nbsp;→ Bạch kim<br/>
                800 - 1000 → Kim cương
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: SCHEMA MODELS (MÔ HÌNH DỮ LIỆU) */}
        <section id="schema" className="space-y-6 reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <SectionHeader badge="04 : MÔ HÌNH DỮ LIỆU (SCHEMA MODELS)" title={isEn ? 'Core Analytics Models' : 'Các Bảng Cốt Lõi Của App Analytics'} sectionId="schema" isEn={isEn} onCopyLink={copyDeepLink} />

          <div className="overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-4">Model Name</th>
                  <th className="p-4">Vai Trò Chính</th>
                  <th className="p-4">Điểm Thiết Kế Đáng Chú Ý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {SCHEMA_MODELS.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50">
                    <td className="p-4 font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA]">{row.name}</td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{row.role}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{row.feat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 5: CELERY BEAT SCHEDULE */}
        <section id="celery" className="space-y-6 reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <SectionHeader badge="05 : VẬN HÀNH NỀN (CELERY BEAT PIPELINE)" title={isEn ? 'Automated Celery Beat Schedule' : 'Lịch Chạy Tác Vụ Nền Celery Beat'} sectionId="celery" isEn={isEn} onCopyLink={copyDeepLink} />
            <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed dark:text-slate-300">
              {isEn 
                ? 'Metrics are not calculated on-the-fly inside every request; they are pre-aggregated on fixed schedules, ensuring fast page loads under heavy concurrency.'
                : 'Toàn bộ số liệu tổng hợp không tính trực tiếp trong mỗi request: chúng được chốt theo lịch cố định, giữ cho trang dashboard luôn phản hồi tức thì.'}
            </p>

          <div className="rounded-3xl border border-slate-200/90 overflow-hidden bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {CELERY_TASKS.map((b) => (
                <div key={b.tag} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <span className="w-24 font-serif font-bold text-xs text-[#0D7287] dark:text-[#FFD14C]">{b.time}</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{b.task}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 hidden sm:inline-block">{b.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: TECH STACK CHIPS */}
        <section id="stack" className="space-y-6 reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <SectionHeader badge="06 : HẠ TẦNG CÔNG NGHỆ" title={isEn ? 'Configured for High-Load Scalability' : 'Cấu Hình Sẵn Sàng Cho Tải Cao'} sectionId="stack" isEn={isEn} onCopyLink={copyDeepLink} />

          <div className="flex flex-wrap gap-2.5">
            {TECH_STACK.map((tech) => (
              <div key={tech.name} className="px-4 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2 dark:bg-slate-900 dark:border-slate-800">
                <span className="font-bold text-xs text-slate-950 dark:text-white">{tech.name}</span>
                <span className="text-[11px] font-mono text-slate-400">({tech.role})</span>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 bg-slate-50 border-t border-slate-200/80 text-center text-xs text-slate-500 dark:bg-slate-950 dark:border-slate-900 dark:text-slate-400">
        <div className="max-w-4xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-300">
            Dự án Library Bus : Hệ thống thư viện lưu động & Tầng phân tích dữ liệu
          </p>
          <p>
            Kho mã nguồn : <a href="https://github.com/duongduongdphk66a-spec/prj" target="_blank" rel="noopener noreferrer" className="text-[#0D7287] dark:text-[#9BE7FA] underline">github.com/duongduongdphk66a-spec/prj</a>
          </p>
        </div>
      </footer>

    </div>
  );
}
