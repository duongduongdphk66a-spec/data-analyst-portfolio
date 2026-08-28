'use client';

import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, Bus, BookOpen, Database, Cpu, Zap, 
  Clock, ShieldCheck, CheckCircle2, Award, ExternalLink, 
  Flame, BarChart3, LineChart as LineChartIcon, RefreshCw, 
  Layers, GitBranch, ArrowRight, Code, Server, Check
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '../lib/visitorTracking';
import { useLanguage } from '../context/LanguageContext';

// Weekly Borrow vs Return mock telemetry data from Django DailyStats
const weeklyActivityData = [
  { day: 'T2', borrows: 142, returns: 120, activeUsers: 84 },
  { day: 'T3', borrows: 158, returns: 140, activeUsers: 92 },
  { day: 'T4', borrows: 151, returns: 138, activeUsers: 89 },
  { day: 'T5', borrows: 176, returns: 150, activeUsers: 104 },
  { day: 'T6', borrows: 190, returns: 171, activeUsers: 118 },
  { day: 'T7', borrows: 168, returns: 160, activeUsers: 98 },
  { day: 'CN', borrows: 199, returns: 182, activeUsers: 125 },
];

// Bus fleet performance comparison from BusAnalytics
const busFleetData = [
  { name: 'Bus 01 (Cầu Giấy)', borrows: 312, visits: 340, efficiency: 91.8, status: 'Đang chạy' },
  { name: 'Bus 02 (Đống Đa)', borrows: 284, visits: 310, efficiency: 91.6, status: 'Đang chạy' },
  { name: 'Bus 03 (Hà Đông)', borrows: 245, visits: 280, efficiency: 87.5, status: 'Đang chạy' },
  { name: 'Bus 04 (Hai Bà Trưng)', borrows: 198, visits: 230, efficiency: 86.1, status: 'Đang chạy' },
  { name: 'Bus 05 (Thanh Xuân)', borrows: 155, visits: 190, efficiency: 81.6, status: 'Đang chạy' },
  { name: 'Bus 06 (Tây Hồ)', borrows: 90, visits: 130, efficiency: 69.2, status: 'Tạm nghỉ' },
];

export default function LibraryBusProject({ onBack, isEmbedded }: { onBack?: () => void; isEmbedded?: boolean } = {}) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const isEn = language === 'en';

  const [activeChartMetric, setActiveChartMetric] = useState<'borrows' | 'efficiency'>('borrows');

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
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#FFE485]/40 dark:bg-slate-950 dark:text-slate-100">
      
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
          
          <div className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            <a href="#overview" className="hover:text-slate-950 transition-colors dark:hover:text-white">{isEn ? 'Overview' : 'Tổng quan'}</a>
            <a href="#kien-truc" className="hover:text-slate-950 transition-colors dark:hover:text-white">{isEn ? '6-Stop Pipeline' : 'Luồng dữ liệu'}</a>
            <a href="#thuat-toan" className="hover:text-slate-950 transition-colors dark:hover:text-white">{isEn ? 'Algorithms' : 'Thuật toán'}</a>
            <a href="#schema" className="hover:text-slate-950 transition-colors dark:hover:text-white">{isEn ? 'Schema Models' : 'Mô hình dữ liệu'}</a>
            <a href="#celery" className="hover:text-slate-950 transition-colors dark:hover:text-white">{isEn ? 'Celery Beat' : 'Tác vụ nền'}</a>
            <a href="#stack" className="hover:text-slate-950 transition-colors dark:hover:text-white">{isEn ? 'Tech Stack' : 'Hạ tầng'}</a>

            {/* GitHub Repo Button */}
            <a
              href="https://github.com/duongduongdphk66a-spec/prj"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 px-3 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200"
              title={isEn ? 'View GitHub Repository' : 'Xem mã nguồn trên GitHub'}
            >
              <Code className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span className="font-mono text-xs">GitHub</span>
            </a>

            {/* Quick Language Toggle */}
            <button
              onClick={() => setLanguage(isEn ? 'vi' : 'en')}
              className="px-2.5 py-1 rounded-xl bg-slate-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer dark:bg-[#9BE7FA] dark:text-slate-950"
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
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C8EEF7]/60 border border-[#9BE7FA] rounded-md text-xs font-bold font-mono tracking-wide text-slate-900 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
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
                  {isEn ? 'Core Stack:' : 'Stack:'} <b className="text-[#0D7287] dark:text-[#9BE7FA] font-mono">Django · MySQL · Redis · Celery</b>
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                  {isEn ? 'Capacity Target:' : 'Mục tiêu tải:'} <b className="text-[#0D7287] dark:text-[#FFD14C] font-mono">50k Users / 500 Conns</b>
                </span>
              </div>

              <div className="pt-2">
                <a
                  href="https://github.com/duongduongdphk66a-spec/prj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all dark:bg-[#FFD14C] dark:text-slate-950 dark:hover:bg-amber-400"
                >
                  <span>{isEn ? 'Explore GitHub Repository' : 'Xem mã nguồn trên GitHub'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            
            {/* Live Dashboard Mock Widget */}
            <div className="bg-white/95 border border-slate-200/90 rounded-3xl p-6 shadow-xl w-full lg:max-w-md space-y-4 dark:bg-slate-900/90 dark:border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  </div>
                  <span>/analytics/reports · Dashboard</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300">
                  LIVE TELEMETRY
                </span>
              </div>

              {/* 4 Mock Stats */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono dark:text-slate-400">Lượt mượn (kỳ)</div>
                  <div className="text-xl font-black font-mono text-[#0D7287] dark:text-[#9BE7FA]">1.284</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono dark:text-slate-400">Người dùng mới</div>
                  <div className="text-xl font-black font-mono text-slate-950 dark:text-white">96</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono dark:text-slate-400">Tỷ lệ hoàn trả</div>
                  <div className="text-xl font-black font-mono text-[#0D7287] dark:text-[#FFD14C]">91.4%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono dark:text-slate-400">Xe bus hoạt động</div>
                  <div className="text-xl font-black font-mono text-slate-950 dark:text-white">7 / 9 xe</div>
                </div>
              </div>

              {/* Mini Trend Chart */}
              <div className="pt-1">
                <div className="text-xs font-bold text-slate-700 mb-2 dark:text-slate-300 flex justify-between">
                  <span>Xu hướng mượn vs trả trong tuần</span>
                  <span className="font-mono text-[10px] text-slate-400">DailyStats</span>
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
        <section className="space-y-6 reveal-element opacity-0 translate-y-8 transition-all duration-700">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold font-mono tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <span>01 : BỐI CẢNH HỆ THỐNG</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'Not Just a Regular Library Website' : 'Không Chỉ Là Một Website Mượn Sách'}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed dark:text-slate-300">
              {isEn 
                ? 'The mobile "bus" model fundamentally changes the operational dynamics: books travel along routes rather than staying stationary. Each bus has distinct capacity, route schedules, and operational status (active / resting / maintenance). The system must measure performance per vehicle and run gamification mechanics to foster regular reading habits.'
                : 'Mô hình "xe bus" khiến bài toán khác hẳn một thư viện tĩnh: sách di chuyển theo tuyến, mỗi xe có sức chứa và trạng thái vận hành riêng (đang chạy / tạm nghỉ / bảo trì). Hệ thống đòi hỏi khả năng đo lường hiệu suất theo từng xe, kết hợp cơ chế Gamification (điểm uy tín, 5 cấp thành viên) để duy trì thói quen đọc sách.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { app: 'core', desc: 'CacheMixin, audit base models, common utilities' },
              { app: 'users', desc: 'Custom user model, authentication, profiles' },
              { app: 'inventory', desc: 'Quản lý sách, danh mục và đội xe LibraryBus' },
              { app: 'transactions', desc: 'Mượn/trả, đặt trước sách, giao nhận, tiền phạt' },
              { app: 'notifications', desc: 'Thông báo quá hạn, nhắc lịch xe bus, email' },
              { app: 'blog', desc: 'Tin tức khuyến đọc, bài viết giới thiệu sách' },
              { app: 'analytics', desc: 'UserReadingStats, BookAnalytics, BusAnalytics' },
              { app: 'celery_tasks', desc: 'Celery Beat cron jobs, async worker pipelines' },
            ].map((a, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1 dark:bg-slate-900 dark:border-slate-800">
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold font-mono tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <span>02 : KIẾN TRÚC & LUỒNG DỮ LIỆU (ROUTE LINE)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'From a Single Book Borrow to a Dashboard Metric' : 'Từ Một Lượt Mượn Sách Đến Một Dòng Trong Báo Cáo'}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed dark:text-slate-300">
              {isEn
                ? 'Tracing the exact flow of data through the system: from user event, through async queue workers, to versioned Redis caching and pre-aggregated dashboards.'
                : 'Đi theo đúng hành trình dữ liệu thực tế di chuyển trong hệ thống: từ hành vi người dùng, qua hàng đợi Celery bất đồng bộ, đến cơ chế cache theo version và dashboard tổng hợp.'}
            </p>
          </div>

          {/* 6-Stop Timeline */}
          <div className="space-y-4">
            {[
              {
                stop: '1',
                title: 'Sự kiện gốc: mượn / trả / xem / đánh giá',
                desc: 'Mỗi hành động của người dùng ghi ra một dòng UserActivity: bảng log trung tâm có compound index theo (user, created_at) để truy vấn lịch sử cá nhân nhanh, và index theo activity_type cho báo cáo tổng hợp.',
                tag: 'model : UserActivity'
              },
              {
                stop: '2',
                title: 'Xử lý bất đồng bộ bằng Celery, không chặn request',
                desc: 'View chỉ đẩy job vào hàng đợi (.delay()) rồi trả response ngay. Việc cộng dồn điểm uy tín, tính lại độ phổ biến sách hay hiệu suất xe bus diễn ra trong Celery worker, bọc trong transaction.atomic() và dùng F() expression để chống race condition.',
                tag: 'tasks.py : update_analytics_on_borrow_task'
              },
              {
                stop: '3',
                title: 'Ba tầng thống kê được tính riêng biệt',
                desc: 'UserReadingStats (điểm uy tín, chuỗi đọc, 5 cấp thành viên) · BookAnalytics (điểm phổ biến sách) · BusAnalytics (hiệu suất từng xe bus). Tách riêng để mỗi loại có nhịp cập nhật và thời gian cache độc lập.',
                tag: 'models : UserReadingStats · BookAnalytics · BusAnalytics'
              },
              {
                stop: '4',
                title: 'Cache theo version, không xoá key thủ công',
                desc: 'Thay vì dò quét xoá từng cache key khi dữ liệu đổi, mỗi model có một "version" riêng trong Redis; key thực tế sinh ra gồm cả version đó. Chỉ cần tăng version lên 1 là toàn bộ cache cũ tự động hết hạn mà không cần biết danh sách key.',
                tag: 'core/models.py : CacheMixin'
              },
              {
                stop: '5',
                title: 'Job định kỳ tổng hợp lại theo ngày',
                desc: 'Celery Beat chạy generate_daily_stats_task mỗi đêm để chốt số liệu của app DailyStats (tổng user, active user, lượt mượn/trả, người dùng mới, lượt xem, review), là nguồn dữ liệu cho biểu đồ xu hướng tuần/tháng.',
                tag: 'DailyStats.generate_daily_stats()'
              },
              {
                stop: '6',
                title: 'Hiển thị: Dashboard cá nhân & Dashboard vận hành',
                desc: 'Độc giả theo dõi hạng, chuỗi ngày đọc và gợi ý sách. Quản trị viên theo dõi sách phổ biến, độc giả dẫn đầu, phân bố cấp độ, xe bus hiệu quả nhất và biểu đồ xu hướng kèm xuất PDF/Excel.',
                tag: 'templates/analytics/*.html · Recharts / Chart.js'
              }
            ].map((s, idx) => (
              <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-[#0D7287] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 dark:bg-[#9BE7FA] dark:text-slate-950">
                  {s.stop}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-base font-black text-slate-950 dark:text-white">{s.title}</h3>
                    <span className="font-mono text-xs text-[#0D7287] dark:text-[#9BE7FA]">{s.tag}</span>
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold font-mono tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <span>03 : CHỈ SỐ & THUẬT TOÁN TÍNH ĐIỂM</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'Three Transparent Weighting Formulas' : 'Ba Công Thức Điều Khiển Toàn Bộ Hệ Thống Điểm'}
            </h2>
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
                <span className="w-6 h-6 rounded-full bg-[#FFE485] text-slate-950 flex items-center justify-center font-mono font-bold text-xs dark:bg-[#FFD14C]">01</span>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">Điểm Phổ Biến Sách</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                Kết hợp lượt mượn, đánh giá và lượt xem, cộng thêm điểm thưởng nếu sách vừa được mượn trong 30 ngày gần nhất để sách hot nổi lên nhanh hơn.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 text-[#FFE485] font-mono text-xs leading-relaxed border border-slate-800 overflow-x-auto">
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
                <span className="w-6 h-6 rounded-full bg-[#C8EEF7] text-slate-950 flex items-center justify-center font-mono font-bold text-xs dark:bg-slate-800 dark:text-[#9BE7FA]">02</span>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">Hiệu Suất Xe Bus</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                Tỷ lệ chuyển đổi từ lượt ghé thăm sang lượt mượn thực tế trên từng xe, giúp so sánh hiệu quả giữa các tuyến xe và điểm dừng.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 text-[#9BE7FA] font-mono text-xs leading-relaxed border border-slate-800 overflow-x-auto">
                efficiency =<br/>
                &nbsp;&nbsp;min(borrows / visits * 100, 100)
              </div>
            </div>

            {/* Formula 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFE485] text-slate-950 flex items-center justify-center font-mono font-bold text-xs dark:bg-[#FFD14C]">03</span>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">Cấp Độ Thành Viên</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
                Điểm uy tín tích lũy từ hoạt động đọc (mượn +5, trả +10, review +3...) được ánh xạ sang 5 cấp độ thành viên tự động.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed border border-slate-800 overflow-x-auto">
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
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold font-mono tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <span>04 : MÔ HÌNH DỮ LIỆU (SCHEMA MODELS)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'Core Analytics Models' : 'Các Bảng Cốt Lõi Của App Analytics'}
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 font-mono font-bold uppercase border-b border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-4">Model Name</th>
                  <th className="p-4">Vai Trò Chính</th>
                  <th className="p-4">Điểm Thiết Kế Đáng Chú Ý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { name: 'UserReadingStats', role: 'Hồ sơ đọc & Gamification của từng user', feat: 'Có total_points, completion_rate, reading_velocity tính động qua property' },
                  { name: 'BookAnalytics', role: 'Thống kê & điểm phổ biến từng đầu sách', feat: 'Có classmethod get_trending_books() lọc theo cửa sổ thời gian, cache 15 phút' },
                  { name: 'BusAnalytics', role: 'Thống kê & hiệu suất từng xe bus', feat: 'Liên kết 1-1 với inventory.LibraryBus, cache Redis 30 phút' },
                  { name: 'UserActivity', role: 'Log sự kiện trung tâm kiêm audit trail', feat: 'Trường metadata dạng JSONField để mở rộng linh hoạt không cần migration' },
                  { name: 'BookRecommendation', role: 'Gợi ý sách theo 5 thuật toán', feat: 'popular, similar_users, same_category, trending, personalized' },
                  { name: 'DailyStats', role: 'Tổng hợp theo ngày cho biểu đồ xu hướng', feat: 'Sinh tự động mỗi đêm qua Celery Beat, unique constraint theo ngày' },
                  { name: 'ArchivedUserActivity', role: 'Lưu trữ hoạt động >90 ngày', feat: 'Soft-delete pattern dọn nhẹ bảng chính nhưng không mất dữ liệu' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50">
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
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold font-mono tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <span>05 : VẬN HÀNH NỀN (CELERY BEAT PIPELINE)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'Automated Celery Beat Schedule' : 'Lịch Chạy Tác Vụ Nền Celery Beat'}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed dark:text-slate-300">
              {isEn 
                ? 'Metrics are not calculated on-the-fly inside every request; they are pre-aggregated on fixed schedules, ensuring fast page loads under heavy concurrency.'
                : 'Toàn bộ số liệu tổng hợp không tính trực tiếp trong mỗi request: chúng được chốt theo lịch cố định, giữ cho trang dashboard luôn phản hồi tức thì.'}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 overflow-hidden bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { time: '00:00', task: 'Bảo trì hệ thống & tính DailyStats', tag: 'daily_maintenance' },
                { time: 'CN · 03:00', task: 'Tính lại điểm phổ biến toàn bộ sách', tag: 'recalculate_popularity_scores_task' },
                { time: '05:00', task: 'Làm nóng cache (top sách, top độc giả, tuần)', tag: 'cache_warmup_task' },
                { time: '06:00', task: 'Quét sách quá hạn trả', tag: 'check_overdue_books' },
                { time: '08:00', task: 'Gửi thông báo nhắc hạn trả sách', tag: 'send_due_reminders' },
                { time: 'Mỗi 30 phút', task: 'Xử lý hàng đợi đặt trước sách', tag: 'process_reservation_queue' },
              ].map((b, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <span className="w-24 font-mono font-bold text-xs text-[#0D7287] dark:text-[#FFD14C]">{b.time}</span>
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
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold font-mono tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
              <span>06 : HẠ TẦNG CÔNG NGHỆ</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
              {isEn ? 'Configured for High-Load Scalability' : 'Cấu Hình Sẵn Sàng Cho Tải Cao'}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {[
              { name: 'Django 5', role: 'Web Framework' },
              { name: 'MySQL', role: 'Relational Database' },
              { name: 'Redis + django-redis', role: 'Cache Layer' },
              { name: 'Celery + Celery Beat', role: 'Async Queue & Scheduled Tasks' },
              { name: 'WhiteNoise', role: 'Static Files Compression' },
              { name: 'Jazzmin', role: 'Admin Interface' },
              { name: 'Argon2', role: 'Password Hashing' },
              { name: 'Recharts / Chart.js', role: 'Interactive Telemetry' },
              { name: 'i18n', role: 'Asia/Ho_Chi_Minh Timezone' },
            ].map((tech, idx) => (
              <div key={idx} className="px-4 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2 dark:bg-slate-900 dark:border-slate-800">
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
