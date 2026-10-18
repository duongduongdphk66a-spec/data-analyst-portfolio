'use client';

import React, { useState } from 'react';
import { 
  Server, Lock, ExternalLink, 
  CheckCircle2, AlertTriangle, Layers, TableProperties,
  Maximize2, X, Minimize2
} from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

export interface Chapter4BackendLogicProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

const BACKEND_CHARTS = [
  {
    id: 'workflow',
    titleVi: '4.1 Luồng Mượn/Trả & Chống Race Condition',
    titleEn: '4.1 Borrowing Workflow & Race Condition Prevention',
    badge: 'ACID + select_for_update()',
    src: '/library-bus/borrowing-workflow.html?embed=1',
    externalUrl: '/library-bus/borrowing-workflow.html',
    metrics: ['Row-level Locking', 'Auto Reservation', 'Zero Overselling'],
    descVi: 'Quy trình giải quyết tranh chấp tài nguyên khi nhiều độc giả mượn cùng lúc cuốn sách cuối cùng trên xe.',
    descEn: 'Concurrency control workflow when multiple readers attempt to borrow the last available book copy.'
  },
  {
    id: 'dataflow',
    titleVi: '4.2 Luồng Dữ liệu Phân tích & Celery',
    titleEn: '4.2 Analytics Dataflow & Asynchronous Celery Queue',
    badge: 'Celery @shared_task + Bayesian/Cosine',
    src: '/library-bus/analytics-dataflow.html?embed=1',
    externalUrl: '/library-bus/analytics-dataflow.html',
    metrics: ['Async Email/Notify', 'Bayesian Rating', 'Real-time Dashboard'],
    descVi: 'Đường ống xử lý dữ liệu ngầm không gây nghẽn HTTP, tổng hợp báo cáo và tính toán gợi ý cá nhân hóa.',
    descEn: 'Non-blocking asynchronous data pipeline computing user recommendations and analytics dashboards.'
  },
];

const TECHNICAL_SPECS = [
  {
    fn: 'transaction.atomic',
    signature: '(using=None, savepoint=True, durable=False)',
    paramsVi: [
      'using=None: Sử dụng kết nối cơ sở dữ liệu default.',
      'savepoint=True: Cho phép tạo SAVEPOINT trong các giao dịch lồng nhau.',
      'durable=False: Không ràng buộc đây phải là khối giao dịch ngoài cùng.'
    ],
    paramsEn: [
      'using=None: Uses default database connection.',
      'savepoint=True: Enables SAVEPOINT in nested transactions.',
      'durable=False: Not constrained to be root transaction.'
    ],
    mechanismVi: 'Trả về đối tượng Atomic (Context Manager / Decorator). Tự động COMMIT khi khối mã thực thi trọn vẹn hoặc ROLLBACK toàn bộ khi phát sinh Exception.',
    mechanismEn: 'Returns Atomic object (Context Manager / Decorator). Automatically commits upon clean execution or rolls back entirely on Exception.'
  },
  {
    fn: 'QuerySet.select_for_update',
    signature: '(nowait=False, skip_locked=False, of=(), no_key=False)',
    paramsVi: [
      'nowait=False: Chờ (block) đến khi khóa hàng dữ liệu được giải phóng.',
      'skip_locked=False: Không bỏ qua các bản ghi đang bị khóa.',
      'of=(): Khóa tất cả bảng liên quan trong câu lệnh truy vấn.',
      'no_key=False: Khởi tạo khóa FOR UPDATE tiêu chuẩn.'
    ],
    paramsEn: [
      'nowait=False: Blocks until row lock is released.',
      'skip_locked=False: Does not skip locked records.',
      'of=(): Locks all involved tables in the query.',
      'no_key=False: Creates standard FOR UPDATE lock.'
    ],
    mechanismVi: 'Trả về QuerySet khóa cứng dòng dữ liệu (Row-level Lock) trong PostgreSQL cho tới khi khối atomic kết thúc, loại bỏ triệt để xung đột Race Condition khi nhiều độc giả mượn cùng cuốn sách.',
    mechanismEn: 'Returns QuerySet with Row-level Lock in PostgreSQL until atomic block finishes, completely preventing race conditions on concurrent book borrowings.'
  },
  {
    fn: '@celery.shared_task',
    signature: '(name=None, bind=False, max_retries=3, default_retry_delay=180, ignore_result=False)',
    paramsVi: [
      'name=None: Tự sinh định danh task theo đường dẫn module.',
      'bind=False: Không truyền đối tượng self vào hàm thực thi.',
      'max_retries=3: Thử lại tối đa 3 lần nếu có lỗi.',
      'default_retry_delay=180: Chờ 180 giây giữa các lần thử lại.',
      'ignore_result=False: Lưu kết quả thực thi vào Result Backend.'
    ],
    paramsEn: [
      'name=None: Auto-generates task name from module path.',
      'bind=False: Does not pass self instance into task function.',
      'max_retries=3: Retries up to 3 times on failure.',
      'default_retry_delay=180: Waits 180 seconds between retries.',
      'ignore_result=False: Stores execution result into Result Backend.'
    ],
    mechanismVi: 'Khi gọi qua .delay(), message lập tức được đẩy vào Redis Broker và trả về AsyncResult (task_id), giải phóng luồng HTTP chính để xử lý gửi email và cập nhật chỉ số phân tích ngầm.',
    mechanismEn: 'When invoked via .delay(), message is queued into Redis Broker and returns AsyncResult (task_id), keeping the main HTTP response non-blocking.'
  }
];

export function Chapter4BackendLogic({ 
  isEn = false, 
  onCopyDeepLink = () => {} 
}: Chapter4BackendLogicProps) {
  // Tab filter: 'both' | 'workflow' | 'dataflow'
  const [activeTab, setActiveTab] = useState<'both' | 'workflow' | 'dataflow'>('both');
  
  // Layout mode: 'stacked' (full-width for maximum clarity) | 'grid' (2 columns)
  const [layoutMode, setLayoutMode] = useState<'stacked' | 'grid'>('stacked');
  
  // Height mode: 'standard' (750px) | 'jumbo' (950px)
  const [heightMode, setHeightMode] = useState<'standard' | 'jumbo'>('jumbo');

  // Fullscreen modal for deep inspection
  const [fullscreenChart, setFullscreenChart] = useState<typeof BACKEND_CHARTS[0] | null>(null);

  const iframeHeightClass = heightMode === 'jumbo' 
    ? 'h-[750px] sm:h-[850px] lg:h-[950px]' 
    : 'h-[620px] sm:h-[700px] lg:h-[780px]';

  return (
    <section id="chapter-4-backend" className="space-y-8 scroll-mt-36">
      {/* 04. SECTION HEADER */}
      <SectionHeader
        variant="chapter"
        id="sec-backend"
        chapter="CHAPTER 04"
        subtitle={isEn ? 'Django ORM, row-level locking, Celery asynchronous queue & analytics dataflow' : 'Django ORM, khóa dòng dữ liệu, hàng đợi bất đồng bộ Celery & luồng phân tích'}
        badge="04"
        title={isEn ? '04. Backend Logic & Interactive Flows' : '04. Backend Logic & Biểu Đồ Tương Tác'}
        onCopy={onCopyDeepLink}
      />

      {/* STACK CHIPS */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
          <Server className="w-4 h-4 text-[#FA6933]" />
          <span>{isEn ? 'Backend Architecture Stack:' : 'Ngăn xếp công nghệ Backend:'}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-mono font-semibold">
          <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#323987] dark:text-[#9BE7FA]">Django 5.x ORM</span>
          <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#FA6933]">PostgreSQL ACID</span>
          <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">Celery Workers</span>
          <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400">Redis Broker</span>
        </div>
      </div>

      {/* SƠ ĐỒ TUẦN TỰ LOGIC BACKEND (SEQUENCE DIAGRAM STEPS) */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="space-y-1">
            <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#FA6933]" />
              <span>{isEn ? 'Atomic Row Locking & Task Queue Sequence' : 'Sơ đồ Tuần tự: Khóa Dòng Dữ liệu & Đẩy Task Celery'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEn ? 'Transactions service sequence with PostgreSQL SELECT ... FOR UPDATE' : 'Quy trình giao dịch mượn sách an toàn với select_for_update() và Celery .delay()'}
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[#C8EEF7]/50 text-[#0D7287] dark:bg-slate-800 dark:text-[#9BE7FA] font-black border border-[#9BE7FA]/40">
            Zero Overselling
          </span>
        </div>

        {/* Sequence Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <span className="w-7 h-7 rounded-xl bg-[#323987] text-white flex items-center justify-center font-mono font-bold text-xs sm:text-sm shadow-xs">1</span>
            <div className="font-bold text-slate-900 dark:text-white">Độc giả gửi Yêu cầu</div>
            <p className="text-slate-500 font-mono text-xs">POST /transactions/borrow/</p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2.5">
            <span className="w-7 h-7 rounded-xl bg-[#FFD14C] text-slate-950 flex items-center justify-center font-mono font-bold text-xs sm:text-sm shadow-xs">2</span>
            <div className="font-bold text-amber-900 dark:text-amber-200">Khóa dòng bản ghi</div>
            <p className="text-slate-600 dark:text-slate-400 font-mono text-xs">BEGIN + SELECT ... FOR UPDATE</p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2.5">
            <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-xs sm:text-sm shadow-xs">3</span>
            <div className="font-bold text-emerald-900 dark:text-emerald-200">Giao dịch thành công</div>
            <p className="text-slate-600 dark:text-slate-400 text-xs">Tồn kho -1 & COMMIT giải phóng khóa</p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-2.5">
            <span className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center font-mono font-bold text-xs sm:text-sm shadow-xs">4</span>
            <div className="font-bold text-sky-900 dark:text-sky-200">Đẩy Task Redis</div>
            <p className="text-slate-600 dark:text-slate-400 font-mono text-xs">.delay() gửi email & phân tích</p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs sm:text-sm shadow-xs">5</span>
            <div className="font-bold text-slate-900 dark:text-white">Celery Worker ngầm</div>
            <p className="text-slate-500 text-xs">Cập nhật Analytics & Email nhắc hạn</p>
          </div>
        </div>

        {/* Branch Explanation Pills */}
        <div className="grid sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5 text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Trường hợp còn sách (Tồn kho &gt; 0): </span>
              <span>Khóa dòng dữ liệu, giảm tồn kho, ghi nhận phiếu mượn và phản hồi 200 OK.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-rose-900 dark:text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Trường hợp hết sách (Tồn kho == 0): </span>
              <span>ROLLBACK tức thời, phản hồi 400 Bad Request và tự động kích hoạt tùy chọn Đặt trước.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 BIỂU ĐỒ TƯƠNG TÁC CÓ SẴN (IFRAME EMBEDS) */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#323987] dark:text-[#9BE7FA]" />
              <span>{isEn ? '2 Interactive Flow Diagrams (Expanded View)' : '2 Biểu Đồ Luồng Tương Tác (Khổ Lớn Toàn Cảnh)'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEn ? 'Full-size embedded SVG diagrams for borrowing workflow and analytics dataflow' : 'Trực quan hóa kích thước lớn chi tiết từng node, luồng xử lý và quan hệ dữ liệu'}
            </p>
          </div>

          {/* Controls: Diagram Filter + Layout View Mode + Height Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tab Filter */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                  activeTab === 'both'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {isEn ? 'All Diagrams' : 'Cả 2 biểu đồ'}
              </button>
              <button
                onClick={() => setActiveTab('workflow')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                  activeTab === 'workflow'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                4.1 Workflow
              </button>
              <button
                onClick={() => setActiveTab('dataflow')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                  activeTab === 'dataflow'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                4.2 Analytics
              </button>
            </div>

            {/* Layout Mode (Stacked vs 2 Columns) when viewing both */}
            {activeTab === 'both' && (
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                <button
                  onClick={() => setLayoutMode('stacked')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                    layoutMode === 'stacked'
                      ? 'bg-[#323987] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="Xếp chồng toàn chiều rộng (Rộng nhất)"
                >
                  {isEn ? 'Full Width (Stacked)' : 'Toàn chiều rộng'}
                </button>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                    layoutMode === 'grid'
                      ? 'bg-[#323987] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="2 Cột song song"
                >
                  {isEn ? '2 Columns' : '2 Cột'}
                </button>
              </div>
            )}

            {/* Height Size Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              <button
                onClick={() => setHeightMode('standard')}
                className={`px-2.5 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                  heightMode === 'standard'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                780px
              </button>
              <button
                onClick={() => setHeightMode('jumbo')}
                className={`px-2.5 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                  heightMode === 'jumbo'
                    ? 'bg-[#FA6933] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Khổ cực đại 950px"
              >
                950px (To hơn)
              </button>
            </div>
          </div>
        </div>

        {/* Display Container: Stacked (1 column full width) by default for maximum visibility */}
        <div className={`grid gap-8 ${activeTab === 'both' && layoutMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {BACKEND_CHARTS.filter(c => activeTab === 'both' || c.id === activeTab).map((chart) => (
            <div key={chart.id} className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <div>
                  <h4 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    {isEn ? chart.titleEn : chart.titleVi}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {isEn ? chart.descEn : chart.descVi}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#FA6933] font-bold px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900">
                    {chart.badge}
                  </span>
                  
                  {/* Fullscreen Button */}
                  <button
                    onClick={() => setFullscreenChart(chart)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                    title={isEn ? 'Expand Fullscreen Modal' : 'Phóng to toàn cảnh (Modal)'}
                  >
                    <Maximize2 className="w-4 h-4 text-[#323987] dark:text-[#9BE7FA]" />
                  </button>

                  <a
                    href={chart.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                    title={isEn ? 'Open in new window' : 'Mở tab mới'}
                  >
                    <ExternalLink className="w-4 h-4 text-[#FA6933]" />
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {chart.metrics.map((m) => (
                  <span key={m} className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    {m}
                  </span>
                ))}
              </div>

              {/* Large Responsive Iframe Canvas */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner">
                <iframe 
                  src={chart.src} 
                  className={`w-full ${iframeHeightClass} bg-slate-950 transition-all duration-300`} 
                  title={isEn ? chart.titleEn : chart.titleVi} 
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN MODAL (WHEN USER CLICKS MAXIMIZE ON ANY CHART) */}
      {fullscreenChart && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-3 sm:p-6 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-white">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#FA6933] animate-pulse" />
              <h3 className="font-bold text-base sm:text-xl">
                {isEn ? fullscreenChart.titleEn : fullscreenChart.titleVi}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {fullscreenChart.badge}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href={fullscreenChart.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>{isEn ? 'Open Raw File' : 'Mở file gốc'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setFullscreenChart(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition"
                title={isEn ? 'Close fullscreen' : 'Đóng toàn màn hình (Esc)'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 my-3 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <iframe 
              src={fullscreenChart.src} 
              className="w-full h-full bg-slate-950" 
              title={isEn ? fullscreenChart.titleEn : fullscreenChart.titleVi} 
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Library Bus Interactive Flow Visualizer</span>
            <button 
              onClick={() => setFullscreenChart(null)} 
              className="hover:text-white font-semibold cursor-pointer"
            >
              Thu nhỏ trở lại trang
            </button>
          </div>
        </div>
      )}

      {/* BẢNG ĐẶC TẢ KỸ THUẬT PYTHON / DJANGO CỐT LÕI */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-[#323987] dark:text-[#9BE7FA]" />
            <span>{isEn ? 'Python / Django Technical Specification' : 'Đặc Tả Kỹ Thuật Python / Django Cốt Lõi'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {isEn ? 'Core transaction primitives and background queue decorators' : 'Hàm và Decorator chịu trách nhiệm toàn vẹn dữ liệu và xử lý tác vụ nền'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-xs">
              <tr>
                <th className="p-3.5 w-1/4">Hàm / Decorator Python</th>
                <th className="p-3.5 w-1/3">Tham số đầu vào & Mặc định</th>
                <th className="p-3.5">Kết quả trả về & Cơ chế hoạt động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {TECHNICAL_SPECS.map((spec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 align-top">
                    <span className="font-mono font-bold text-[#FA6933] block text-sm">{spec.fn}</span>
                    <span className="font-mono text-[11px] text-slate-500 block mt-0.5">{spec.signature}</span>
                  </td>
                  <td className="p-3.5 align-top space-y-1 text-slate-600 dark:text-slate-300">
                    {(isEn ? spec.paramsEn : spec.paramsVi).map((p, pIdx) => (
                      <div key={pIdx} className="leading-snug">• {p}</div>
                    ))}
                  </td>
                  <td className="p-3.5 align-top text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {isEn ? spec.mechanismEn : spec.mechanismVi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Chapter4BackendLogic;
