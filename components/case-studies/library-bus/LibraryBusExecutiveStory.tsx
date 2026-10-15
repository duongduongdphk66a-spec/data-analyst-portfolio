'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Layers, 
  Zap, 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ChevronRight, 
  Code2, 
  Database, 
  Sparkles, 
  Smartphone, 
  ShieldCheck,
  TrendingDown,
  Activity,
  HardDrive
} from 'lucide-react';
import { latencyBenchmarkData, weeklyActivityData } from '@/app/data/libraryBusData';
import { DJANGO_APPS } from '@/app/data/libraryBusContent';

import { useLanguage } from '@/app/context/LanguageContext';

export interface LibraryBusExecutiveStoryProps {
  isEn?: boolean;
  onJumpToSection?: (_sectionId: string) => void;
}

export default function LibraryBusExecutiveStory({ isEn: propIsEn, onJumpToSection }: LibraryBusExecutiveStoryProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const [activeStoryBlock, setActiveStoryBlock] = useState<number>(1);

  const blocks = [
    { id: 1, title: isEn ? '1. Concurrency Problem' : '1. Vực Thẳm Race Condition (Âm Tồn Kho)', icon: AlertTriangle },
    { id: 2, title: isEn ? '2. ACID & Locking' : '2. Kiến Trúc 3NF & Khóa Bi Quan', icon: Layers },
    { id: 3, title: isEn ? '3. Redis & Celery (28ms)' : '3. Đột Phá Hiệu Năng Caching (-94%)', icon: Zap },
    { id: 4, title: isEn ? '4. 500 CCU Stress Test' : '4. Đo Tải 500 CCU & Benchmarks', icon: BarChart2 },
    { id: 5, title: isEn ? '5. 20-Screen & Offline' : '5. Quy Chuẩn UI/UX & Đồng Bộ Ngoại Tuyến', icon: CheckCircle2 },
  ];

  return (
    <section id="library-bus-executive-story" className="mb-14 rounded-3xl bg-white border-2 border-slate-200/90 shadow-xl overflow-hidden dark:bg-slate-900/95 dark:border-slate-800 transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#041E24] to-[#0D7287] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-[#9BE7FA]/20 to-[#FFD14C]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD14C] text-slate-950 text-xs font-black uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>{isEn ? '3-MINUTE SYSTEM & ARCHITECTURE AUDIT' : 'BẢN PHÂN TÍCH ĐIỀU HÀNH · ĐỌC TRONG 3 PHÚT'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {isEn 
                ? 'Mobile Library Bus: Eliminating Distributed Race Conditions & Sub-30ms Caching'
                : 'Hệ Thống Tủ Sách Xe Buýt: Triệt Tiêu Race Condition & Đột Phá Hiệu Năng 28ms'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {isEn
                ? 'Engineering a resilient distributed system for 48 GPS mobile bus stations serving 50,000+ active readers. Auditing 3NF relational schemas, ACID pessimistic locking, Redis cache-aside invalidation, and a 20-screen WCAG 2.1 AA UI design system.'
                : 'Phân tích kỹ thuật hệ thống phân tán 48 trạm buýt di động phục vụ 50,000+ độc giả. Bóc tách cơ chế giải quyết xung đột đặt chỗ thời gian thực, khóa bi quan ACID, bộ đệm phân tán Redis giảm 93.7% độ trễ và hệ thống lưới 12 cột cho 20 màn hình UI.'}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">{isEn ? 'Active Users' : 'Độc Giả Hoạt Động'}</div>
              <div className="text-lg sm:text-xl font-black text-[#9BE7FA]">50,000+</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">{isEn ? 'Query Latency' : 'Độ Trễ Phản Hồi'}</div>
              <div className="text-lg sm:text-xl font-black text-[#FFD14C]">28ms (-94%)</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center col-span-2 sm:col-span-1 md:col-span-2">
              <div className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">{isEn ? 'Concurrency Stability' : 'Chịu Tải Đồng Thời'}</div>
              <div className="text-lg sm:text-xl font-black text-emerald-300">500 CCU (0% Lỗi)</div>
            </div>
          </div>
        </div>

        {/* Tab switcher inside Executive Story */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 scrollbar-none border-t border-white/10 mt-6">
          {blocks.map((b) => {
            const Icon = b.icon;
            const isActive = activeStoryBlock === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setActiveStoryBlock(b.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#9BE7FA] text-slate-950 shadow-md font-black scale-102'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{b.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Body Content Area */}
      <div className="p-6 sm:p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/40">
        
        {/* BLOCK 1: VẤN ĐỀ HỆ THỐNG & RACE CONDITION */}
        {activeStoryBlock === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isEn ? 'DISTRIBUTED RACE HAZARD' : 'NGUY CƠ XUNG ĐỘT GIAO DỊCH PHÂN TÁN'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  {isEn 
                    ? 'The Mobile Bus Double-Booking Dilemma & Inventory Desynchronization' 
                    : 'Nghịch Lý Đặt Trùng Sách & Bất Đồng Bộ Tồn Kho Tại 48 Trạm Xe'}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'In a fleet-based mobile library, each bus functions as a roaming micro-warehouse. When hundreds of users across 48 GPS stops concurrently attempt to hold the final copy of a popular book (e.g., Dan Brown’s Origin), naive database reads trigger critical race conditions, producing negative inventory (-1 copy) and severe reader disputes upon bus arrival.'
                    : 'Trong mô hình thư viện lưu động, mỗi chiếc xe buýt đóng vai trò như một kho sách di động độc lập. Khi hàng trăm độc giả tại 48 trạm dừng cùng mở ứng dụng đặt giữ bản in duy nhất còn lại của một cuốn sách (ví dụ: Bản Cực - Dan Brown), truy vấn cơ sở dữ liệu ngây thơ sẽ dẫn đến hiện tượng đọc bẩn (dirty read), khiến tồn kho bị âm (-1 cuốn) và gây tranh cãi khi độc giả đón xe.'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Độ Trễ Ban Đầu</div>
                    <div className="text-lg font-black text-rose-600 dark:text-rose-400">440ms / Req</div>
                    <div className="text-xs text-slate-500 font-medium">Chậm khi xe mất sóng</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Tỷ Lệ Xung Đột</div>
                    <div className="text-lg font-black text-rose-600 dark:text-rose-400">14.2% Giờ Đỉnh</div>
                    <div className="text-xs text-slate-500 font-medium">Không có Row Locking</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
                    <div className="text-[10px] uppercase font-bold text-[#0D7287] dark:text-[#9BE7FA] font-mono">Mục Tiêu Kỹ Thuật</div>
                    <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">0.0% Xung Đột</div>
                    <div className="text-xs text-teal-600 dark:text-teal-400 font-bold">Chuẩn ACID tuyệt đối</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0F9FB] dark:bg-slate-850 border border-[#9BE7FA]/40 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                  <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isEn ? 'Core Engineering Challenge:' : 'Thách Thức Kỹ Thuật Trung Tâm:'}
                  </span>
                  <p className="leading-relaxed">
                    {isEn
                      ? 'Eliminate race conditions without introducing massive database lock wait timeouts (Deadlocks), while slashing response latency from 440ms down to sub-50ms under peak 500 CCU concurrent rush-hour loads.'
                      : 'Loại bỏ triệt để hiện tượng đặt trùng sách mà không gây nghẽn hàng đợi (Deadlock) ở cơ sở dữ liệu, đồng thời hạ gục độ trễ truy vấn từ 440ms xuống dưới 50ms trong giờ tan tầm cao điểm.'}
                  </p>
                </div>
              </div>

              {/* Anatomy of a Race Condition Card */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <span className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                  {isEn ? 'Anatomy of the Unsynchronized Race' : 'Diễn Tiến Xảy Ra Race Condition (Trước Khi Khóa)'}
                </span>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div className="font-mono text-[#0D7287] dark:text-[#9BE7FA] font-bold">T0: Sách còn tồn kho = 1</div>
                    <div className="text-slate-600 dark:text-slate-400 mt-0.5">Hai độc giả An (Trạm Linh Đàm) và Bình (Trạm Cầu Giấy) cùng xem cuốn sách.</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <div className="font-mono text-amber-700 dark:text-amber-400 font-bold">T1: Hai truy vấn READ cùng đọc tồn kho = 1</div>
                    <div className="text-slate-600 dark:text-slate-400 mt-0.5">Cả 2 luồng đều kiểm tra điều kiện (copies &gt; 0) và hợp lệ.</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                    <div className="font-mono text-rose-700 dark:text-rose-400 font-bold">T2: Cả 2 luồng cùng ghi WRITE (copies = copies - 1)</div>
                    <div className="text-slate-600 dark:text-slate-400 mt-0.5">Tồn kho bị âm (-1). Hai phiếu mượn được cấp cho cùng một cuốn sách thật trên xe!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCK 2: THIẾT KẾ CƠ SỞ DỮ LIỆU 3NF & KHÓA BI QUAN */}
        {activeStoryBlock === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-100 text-teal-900 dark:bg-teal-950/80 dark:text-teal-300 text-xs font-bold">
                  <Database className="w-3.5 h-3.5" />
                  <span>{isEn ? '3NF RELATIONAL MODEL & ACID LOCKING' : 'CHUẨN HÓA 3NF & KHÓA BI QUAN ROW-LEVEL'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  {isEn 
                    ? 'Modular Monolith (7 Django Apps) & select_for_update() Guarantee' 
                    : 'Kiến Trúc 7 Phân Hệ Django & Cam Kết Khóa Hàng Dọc (Pessimistic Locking)'}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'To guarantee strict ACID transaction isolation, the system was decomposed into 7 decoupled Django apps. When a book reservation transaction initiates, PostgreSQL enforces row-level pessimistic locking via select_for_update(), freezing the specific BookCopy instance until the status write commits.'
                    : 'Để đảm bảo toàn vẹn dữ liệu chuẩn ACID, hệ thống được quy hoạch thành 7 phân hệ Django tách biệt. Khi giao dịch giữ sách được kích hoạt, PostgreSQL thực thi khóa hàng bi quan (Row-level Locking) qua select_for_update(), phong tỏa trạng thái bản sách cụ thể cho đến khi giao dịch cam kết hoàn tất.'}
                </p>

                {/* Code Snippet Card */}
                <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto text-slate-200">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-[#9BE7FA]">
                      <Code2 className="w-3.5 h-3.5" />
                      circulation/services.py • Pessimistic Lock Engine
                    </span>
                    <span className="text-emerald-400 font-bold">ACID COMPLIANT</span>
                  </div>
                  <pre className="text-[11px] leading-relaxed text-slate-300">
                    <code>{`with transaction.atomic():
    # Lock row độc quyền ở cấp CSDL cho đến khi commit
    copy = BookCopy.objects.select_for_update(nowait=False).get(
        id=copy_id, status='AVAILABLE'
    )
    copy.status = 'RESERVED'
    copy.save(update_fields=['status'])
    Reservation.objects.create(user=user, copy=copy, station=station)`}</code>
                  </pre>
                </div>
              </div>

              {/* 7 Apps Breakdown Pill */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <span className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <HardDrive className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  {isEn ? '7 Django Modular Subsystems' : '7 Phân Hệ Nghiệp Vụ Chuẩn 3NF'}
                </span>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  {DJANGO_APPS.map((app, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA]">{app.app}</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">{app.nameVi}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">0{i+1}/07</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCK 3: ĐỘT PHÁ HIỆU NĂNG REDIS & CELERY */}
        {activeStoryBlock === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 text-xs font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isEn ? 'SUB-30MS CACHING ARCHITECTURE' : 'ĐỘT PHÁ BỘ ĐỆM REDIS & HÀNG ĐỢI CELERY'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  {isEn 
                    ? 'Sub-30ms Query Latency: Cache-Aside & Asynchronous Worker Offloading' 
                    : 'Độ Trễ Phản Hồi 28ms: Mô Hình Cache-Aside & Giải Phóng CPU Qua Celery'}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'By implementing a Redis distributed Cache-Aside layer with TTL invalidation, static catalog queries and GPS station coordinates achieve O(1) retrieval speed. Meanwhile, heavy I/O operations (SMS verification, bus route ETA calculation, daily penalty assessments) are offloaded to asynchronous Celery Beat workers backed by RabbitMQ.'
                    : 'Nhờ triển khai tầng bộ đệm phân tán Redis theo mô hình Cache-Aside, các truy vấn tra cứu danh mục sách và tọa độ trạm GPS đạt tốc độ O(1). Đồng thời, các tác vụ nặng (gửi tin nhắn SMS, tính toán ETA xe buýt qua GPS, tính phạt sách quá hạn) được đẩy sang hàng đợi bất đồng bộ Celery workers với RabbitMQ.'}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Trước Cache</div>
                    <div className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">440ms</div>
                    <div className="text-xs text-slate-500">Chờ truy vấn SQL nặng</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 font-mono">Sau Redis Cache</div>
                    <div className="text-base sm:text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">28ms</div>
                    <div className="text-xs text-teal-600 dark:text-teal-400 font-bold">-93.7% Độ trễ</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-amber-500 font-mono">Celery Tasks/Ngày</div>
                    <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">12,500+</div>
                    <div className="text-xs text-amber-600 font-bold">Không nghẽn luồng</div>
                  </div>
                </div>
              </div>

              {/* Latency Comparison Table */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <span className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  {isEn ? 'Endpoint Benchmark Breakdown' : 'Đo Kiểm Độ Trễ Từng Điểm Cuối (ms)'}
                </span>

                <div className="space-y-2 text-xs">
                  {latencyBenchmarkData.map((b, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200">{b.endpoint}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">{b.reduction}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono mt-1 text-slate-500">
                        <span>Gốc: <strong className="text-rose-500">{b.withoutCache}ms</strong></span>
                        <span>➔</span>
                        <span>Cache: <strong className="text-[#0D7287] dark:text-[#9BE7FA]">{b.withCache}ms</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCK 4: KIỂM ĐỊNH TẢI 500 CCU CONCURRENCY */}
        {activeStoryBlock === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isEn ? '500 CCU CONCURRENCY VALIDATION' : 'KIỂM ĐỊNH CHỊU TẢI 500 KẾT NỐI ĐỒNG THỜI'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  {isEn 
                    ? 'Locust Benchmark: Zero Connection Dropped at 1,250 Requests/Sec' 
                    : 'Đo Kiểm Locust: 0% Lỗi Kết Nối Dưới Thông Lượng 1,250 Yêu Cầu/Giây'}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Simulating rush-hour spikes across municipal bus routes, a 500 CCU load test verified system resilience. Even during synchronized reservation bursts, p95 query latency remained stable below 48ms with 0.0% request failure and zero database connection pool exhaustion.'
                    : 'Mô phỏng đợt truy cập dồn dập vào giờ tan tầm của các trường đại học và khu đô thị, bài kiểm tra tải 500 người dùng đồng thời khẳng định độ bền bỉ của hạ tầng. Ngay cả khi xảy ra các đợt bấm giữ sách đồng thời, độ trễ p95 vẫn ổn định dưới 48ms với 0.0% lỗi rớt gói.'}
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Thông Lượng Xử Lý Đỉnh (Throughput)</div>
                      <div className="text-xs text-slate-500">Đo kiểm qua Locust & Apache Bench</div>
                    </div>
                    <div className="text-lg font-black font-mono text-[#0D7287] dark:text-[#9BE7FA]">1,250 Req/s</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Độ Trễ Phân Vị 95% (p95 Latency)</div>
                      <div className="text-xs text-slate-500">95% người dùng nhận kết quả dưới 48ms</div>
                    </div>
                    <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">46.2ms</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Tỷ Lệ Xung Đột Dữ Liệu (Lock Contention)</div>
                      <div className="text-xs text-slate-500">Nhờ kiểm soát qua select_for_update()</div>
                    </div>
                    <div className="text-lg font-black font-mono text-teal-600 dark:text-teal-400">0.00%</div>
                  </div>
                </div>
              </div>

              {/* Telemetry Weekly Activity */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <span className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  {isEn ? 'Daily Borrow vs Return Telemetry' : 'Dữ Liệu Mượn / Trả Tuần Hoàn (Telemetry)'}
                </span>

                <div className="space-y-1.5 text-xs font-mono">
                  {weeklyActivityData.map((d, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                      <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA]">{d.day}</span>
                      <span className="text-slate-600 dark:text-slate-300">Mượn: <strong>{d.borrows}</strong></span>
                      <span className="text-slate-600 dark:text-slate-300">Trả: <strong>{d.returns}</strong></span>
                      <span className="text-emerald-600 font-bold">{d.activeUsers} Users</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BLOCK 5: QUY CHUẨN UI/UX 20 MÀN HÌNH & TRẠM NGOẠI TUYẾN */}
        {activeStoryBlock === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-100 text-teal-900 dark:bg-teal-950/80 dark:text-teal-300 text-xs font-bold">
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isEn ? 'DESIGN SYSTEM & OFFLINE RESILIENCE' : 'QUY CHUẨN UI/UX 20 MÀN HÌNH & CHẾ ĐỘ NGOẠI TUYẾN'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-tight">
                {isEn 
                  ? '20-Screen Master Design Board & Offline-First Field Protocol' 
                  : 'Bảng Quy Chuẩn 20 Màn Hình (Wireframe vs UI) & Cơ Chế Ngoại Tuyến Tại Trạm'}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
                {isEn
                  ? 'Designed with a 12-column responsive grid and 4-color palette (#0D7287, #9BE7FA, #FFD14C, #C8EEF7) meeting WCAG 2.1 AA standards. For remote stops where cellular connectivity dips, the offline-first protocol caches book checkouts in local IndexedDB and syncs bi-directionally once the vehicle re-enters network range.'
                  : 'Hệ thống giao diện được chuẩn hóa trên lưới 12 cột với bộ 4 màu nhận diện (#0D7287, #9BE7FA, #FFD14C, #C8EEF7) đạt chuẩn tương phản tiếp cận WCAG 2.1 AA. Đối với các trạm dừng ngoại thành sóng 4G chập chờn, cơ chế Ngoại tuyến (Offline-First) lưu trữ giao dịch mượn trả vào IndexedDB cục bộ và tự động đồng bộ hai chiều khi xe có kết nối trở lại.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {[
                  {
                    step: '01',
                    title: isEn ? '12-Column Modular Grid' : 'Lưới 12 Cột Đáp Ứng',
                    kpi: 'Tỷ lệ khung hình 100% pixel-perfect',
                    desc: isEn 
                      ? 'Strict 1280px container with 24px gutters, eliminating layout shifts between Desktop and Mobile.' 
                      : 'Lưới 12 cột chuẩn Figma, khoảng cách rãnh 24px, loại bỏ hiện tượng giật vỡ khung hình khi chuyển thiết bị.',
                    tag: 'Layout Precision'
                  },
                  {
                    step: '02',
                    title: isEn ? 'WCAG 2.1 AA Palette' : 'Bảng Màu Nhận Diện 4 Tông',
                    kpi: 'Độ tương phản 7.2:1 (AAA cho Body)',
                    desc: isEn 
                      ? 'Deep Teal (#0D7287) and Honey Gold (#FFD14C) provide high legibility under direct sunlight at bus stops.' 
                      : 'Độ tương phản cao giúp độc giả và thủ thư dễ dàng đọc thông tin dưới ánh nắng mặt trời tại trạm dừng dã ngoại.',
                    tag: 'Accessibility'
                  },
                  {
                    step: '03',
                    title: isEn ? '20-Screen Master Board' : 'Đối Chuẩn 20 Màn Hình',
                    kpi: '20 Wireframes ➔ 20 UI Thật',
                    desc: isEn 
                      ? 'Comprehensive side-by-side comparison spanning Catalog, GPS Fleet, Dispatch Console, and Member Passes.' 
                      : 'Bộ đối chuẩn 1:1 giữa khung xương Wireframe và giao diện thật: từ tra cứu, bản đồ GPS đến thẻ độc giả số.',
                    tag: 'Design Architecture'
                  },
                  {
                    step: '04',
                    title: isEn ? 'Offline-First Fallback' : 'Đồng Bộ Hai Chiều Ngoại Tuyến',
                    kpi: '0% mất mát giao dịch',
                    desc: isEn 
                      ? 'Local IndexedDB buffer stores barcode scans when buses transit through network dead zones.' 
                      : 'Bộ nhớ đệm trình duyệt lưu trữ dữ liệu quét mã vạch và tự động phát lệnh Replay Sync khi xe bắt được sóng 4G.',
                    tag: 'Resilience'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs font-black text-[#0D7287] dark:text-[#9BE7FA]">{item.step}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">{item.tag}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-950 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Quy chuẩn kỹ thuật:</div>
                      <div className="text-xs font-black text-teal-600 dark:text-teal-400 mt-0.5">{item.kpi}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to action buttons to deep dive */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onJumpToSection && onJumpToSection('sec-screens')}
                  className="px-5 py-2.5 rounded-xl bg-[#0D7287] hover:bg-[#095262] text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{isEn ? 'Explore 20-Screen Visual Comparison' : 'Xem Bảng Đối Chuẩn 20 Màn Hình (Wireframe vs UI)'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onJumpToSection && onJumpToSection('sec-tech')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{isEn ? 'View Technical Architecture & Django Code' : 'Xem Chi Tiết Kiến Trúc 7 Django Apps & Redis'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
