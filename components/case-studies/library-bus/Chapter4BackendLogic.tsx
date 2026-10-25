'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, Lock, ExternalLink, 
  CheckCircle2, AlertTriangle, Layers, TableProperties,
  Maximize2, X, Activity, Zap, ShieldCheck, GitCommit
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import SectionHeader from '@/components/ui/SectionHeader';

export interface Chapter4BackendLogicProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  routeVi: string;
  routeEn: string;
  techVi: string;
  techEn: string;
  descVi: string;
  descEn: string;
  concurrencyVi: string;
  concurrencyEn: string;
  mathFormula?: string;
  selector?: string;
}

export const FLOW_EDGES: Record<'workflow' | 'dataflow', FlowEdge[]> = {
  workflow: [
    {
      id: 'E1',
      source: 'Client',
      target: 'BorrowService',
      routeVi: 'Độc giả (Client) → BorrowService (Django View)',
      routeEn: 'Reader (Client) → BorrowService (Django View)',
      techVi: 'with transaction.atomic()',
      techEn: 'with transaction.atomic()',
      descVi: 'Khởi tạo giao dịch ACID cho yêu cầu mượn sách; mọi lỗi phát sinh phía sau sẽ tự động ROLLBACK toàn bộ, bảo toàn tính toàn vẹn dữ liệu.',
      descEn: 'Initializes an ACID database transaction for the borrow request; any exception triggers an automatic ROLLBACK to preserve database integrity.',
      concurrencyVi: 'Giao dịch nguyên tử; tự động rollback khi gặp exception hoặc gián đoạn kết nối.',
      concurrencyEn: 'Atomic transaction; automatic rollback on exceptions or network disconnects.',
      selector: 'path[data-edge-from="request_borrow"], path[data-edge-from="search"]',
    },
    {
      id: 'E2',
      source: 'BorrowService',
      target: 'InventoryDB',
      routeVi: 'BorrowService → PostgreSQL (Book Row Lock)',
      routeEn: 'BorrowService → PostgreSQL (Book Row Lock)',
      techVi: 'Book.objects.select_for_update(nowait=False)',
      techEn: 'Book.objects.select_for_update(nowait=False)',
      descVi: 'Khóa cứng dòng dữ liệu cuốn sách (Row-level Lock) trong DB, chặn các luồng mượn trùng lặp cùng lúc (chống Race Condition tuyệt đối).',
      descEn: 'Applies row-level lock on the book record in PostgreSQL, forcing concurrent requests to wait in queue to eliminate race conditions.',
      concurrencyVi: 'Row-level Lock (Pessimistic Locking) trong PostgreSQL cho tới khi COMMIT.',
      concurrencyEn: 'Pessimistic row-level lock in PostgreSQL retained until transaction COMMIT.',
      selector: 'path[data-edge-to="lock_create"], path[data-edge-from="check_stock"][data-edge-to="lock_create"]',
    },
    {
      id: 'E3',
      source: 'InventoryDB',
      target: 'ReservationQueue',
      routeVi: 'Kiểm tra tồn kho → Hàng đợi Đặt trước (Fallback)',
      routeEn: 'Inventory Check → Reservation Queue (Fallback)',
      techVi: 'available_copies == 0 (Fallback)',
      techEn: 'available_copies == 0 (Fallback)',
      descVi: 'Đường rẽ nhánh khi tồn kho bằng 0: tự động chuyển yêu cầu sang hàng đợi Đặt trước (reservation_create) và gửi thông báo khi có sách trả.',
      descEn: 'Branch path when available inventory equals 0: auto-reroutes request to reservation queue (reservation_create) and notifies upon book return.',
      concurrencyVi: 'Fallback an toàn không gây tranh chấp kho; chuyển giao sang hàng đợi reservation.',
      concurrencyEn: 'Contention-free fallback; safely delegates request to reservation queue.',
      selector: 'path[data-edge-to="reserve_queue"]',
    },
    {
      id: 'E4',
      source: 'BorrowService',
      target: 'CeleryBroker',
      routeVi: 'BorrowService → Redis / Celery Worker',
      routeEn: 'BorrowService → Redis / Celery Worker',
      techVi: '@shared_task.delay(borrow_id=order.id)',
      techEn: '@shared_task.delay(borrow_id=order.id)',
      descVi: 'Sau khi COMMIT giảm tồn kho -1, đẩy sự kiện bất đồng bộ sang Redis để gửi email xác nhận & lịch nhắc trả (due_reminder.txt) mà không chặn HTTP.',
      descEn: 'Post-commit non-blocking dispatch: queues async tasks to Redis for email receipts and overdue reminders without stalling user HTTP responses.',
      concurrencyVi: 'Xử lý bất đồng bộ (Non-blocking I/O) qua Redis Broker & Celery Worker.',
      concurrencyEn: 'Non-blocking asynchronous execution via Redis Broker and Celery Workers.',
      selector: 'path[data-edge-to="analytics_task"], path[data-edge-from="bus_handover"]',
    },
  ],
  dataflow: [
    {
      id: 'D1',
      source: 'UserEvents',
      target: 'CeleryWorker',
      routeVi: 'Giao dịch / Đọc PDF → Event Collector (Celery)',
      routeEn: 'User Events (Borrow/PDF) → Event Collector (Celery)',
      techVi: 'analytics/tasks.py (Signals & Celery Tasks)',
      techEn: 'analytics/tasks.py (Signals & Celery Tasks)',
      descVi: 'Thu thập luồng sự kiện mượn sách, đọc PDF, đánh giá sao và đẩy ngầm vào Worker mà không làm chậm phản hồi HTTP của người dùng.',
      descEn: 'Captures stream events (borrows, PDF dwell time, star ratings) and queues into background workers with zero impact on HTTP latency.',
      concurrencyVi: 'Hàng đợi ngầm Redis; tốc độ nạp sự kiện cao độc lập với thời gian tính toán.',
      concurrencyEn: 'Redis background queue; high ingestion rate isolated from calculation latency.',
      selector: 'path[data-edge-from="borrow_ops"], path[data-edge-from="user_clicks"], path[data-edge-id="borrow-event"]',
    },
    {
      id: 'D2',
      source: 'CeleryWorker',
      target: 'BayesianEngine',
      routeVi: 'Celery Worker → Bayesian Ranking Engine',
      routeEn: 'Celery Worker → Bayesian Ranking Engine',
      techVi: 'W = (v / (v + m)) * R + (m / (v + m)) * C',
      techEn: 'W = (v / (v + m)) * R + (m / (v + m)) * C',
      mathFormula: 'W = \\frac{v}{v+m}R + \\frac{m}{v+m}C',
      descVi: 'Đường tính toán lại bảng xếp hạng sách (leaderboard.html) bằng trọng số Bayes để triệt tiêu sai lệch khi sách mới có ít lượt đánh giá so với sách lâu năm.',
      descEn: 'Recalculates book leaderboard rankings with Bayesian weighting to eliminate small-sample bias between newly introduced books and old classics.',
      concurrencyVi: 'Chạy nền định kỳ theo batch hoặc khi chạm ngưỡng rating mới; lưu cache Redis.',
      concurrencyEn: 'Computed in background batch or rating threshold trigger; cached in Redis.',
      selector: 'path[data-edge-id="stats-persist"], path[data-edge-from="celery_analytics"][data-edge-to="stats_tables"]',
    },
    {
      id: 'D3',
      source: 'CeleryWorker',
      target: 'CosineRecommender',
      routeVi: 'Hồ sơ Độc giả → Cosine Similarity Recommender',
      routeEn: 'User Profile → Cosine Similarity Recommender',
      techVi: 'cos(θ) = (u · b) / (||u|| * ||b||)',
      techEn: 'cos(θ) = (u · b) / (||u|| * ||b||)',
      mathFormula: '\\cos(\\theta) = \\frac{\\mathbf{u}\\cdot\\mathbf{b}}{\\|\\mathbf{u}\\|_2 \\|\\mathbf{b}\\|_2}',
      descVi: 'Đường đối chiếu vector sở thích độc giả (interests.html) với kho sách để xuất danh sách gợi ý cá nhân hóa (recommendations.html) tức thì trên Dashboard.',
      descEn: 'Matches user preference embeddings against book vectors to generate personalized recommendation feeds on the reader dashboard.',
      concurrencyVi: 'Đối chiếu vector bất đồng bộ; ghi đè recommendation cache với TTL 24h.',
      concurrencyEn: 'Asynchronous vector similarity matrix match; caches recommendation feed with 24h TTL.',
      selector: 'path[data-edge-id="cache-ai-feed"], path[data-edge-from="cache_layer"]',
    },
  ],
};

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
    descEn: 'Concurrency control workflow when multiple readers attempt to borrow the last available book copy.',
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
    descEn: 'Non-blocking asynchronous data pipeline computing user recommendations and analytics dashboards.',
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
  const { resolvedTheme } = useTheme();

  // Tab filter: 'both' | 'workflow' | 'dataflow'
  const [activeTab, setActiveTab] = useState<'both' | 'workflow' | 'dataflow'>('both');
  
  // Layout mode: 'stacked' (full-width for maximum clarity) | 'grid' (2 columns)
  const [layoutMode, setLayoutMode] = useState<'stacked' | 'grid'>('stacked');
  
  // Height mode: 'fit' (vừa 1 màn hình) | 'standard' (750px) | 'jumbo' (900px)
  const [heightMode, setHeightMode] = useState<'fit' | 'standard' | 'jumbo'>('fit');

  // Fullscreen modal for deep inspection
  const [fullscreenChart, setFullscreenChart] = useState<typeof BACKEND_CHARTS[0] | null>(null);

  // Active Flow Inspector Edge selections
  const [selectedWorkflowEdge, setSelectedWorkflowEdge] = useState<FlowEdge>(FLOW_EDGES.workflow[0]);
  const [selectedDataflowEdge, setSelectedDataflowEdge] = useState<FlowEdge>(FLOW_EDGES.dataflow[0]);

  // Iframe references
  const wfIframeRef = useRef<HTMLIFrameElement>(null);
  const dfIframeRef = useRef<HTMLIFrameElement>(null);

  // Synchronize theme changes to all embedded iframes immediately
  useEffect(() => {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((ifr) => {
      try {
        ifr.contentWindow?.postMessage({ theme: resolvedTheme }, '*');
      } catch (_) {}
    });
  }, [resolvedTheme]);

  // Highlight specific path in iframe
  const highlightEdgeInIframe = (
    iframe: HTMLIFrameElement | null,
    edge: FlowEdge,
    _type: 'workflow' | 'dataflow'
  ) => {
    try {
      const doc = iframe?.contentDocument;
      if (!doc) return;

      const highlightColor = resolvedTheme === 'dark' ? '#9BE7FA' : '#0D7287';
      const _glowColor = 'rgba(155, 231, 250, 0.9)';

      // Reset all edges
      const allPaths = doc.querySelectorAll('path[data-animate="edge"], path[data-edge-from]');
      allPaths.forEach((p) => {
        const el = p as HTMLElement;
        el.style.stroke = '';
        el.style.strokeWidth = '';
        el.style.filter = '';
        el.style.opacity = '0.55';
      });

      // Highlight target edges
      const targetPaths = edge.selector ? doc.querySelectorAll(edge.selector) : [];
      if (targetPaths.length > 0) {
        targetPaths.forEach((p) => {
          const el = p as HTMLElement;
          el.style.stroke = highlightColor;
          el.style.strokeWidth = '3.5px';
          el.style.opacity = '1';
        });
      } else {
        // Fallback: highlight paths with edge index
        allPaths.forEach((p, idx) => {
          if (idx === 0) {
            const el = p as HTMLElement;
            el.style.stroke = highlightColor;
            el.style.strokeWidth = '3px';
            el.style.opacity = '1';
          }
        });
      }
    } catch (_) {
      // Safe fallback when iframe cross-origin restrictions apply
    }
  };

  // Attach event listeners to nodes & edges inside iframe
  const attachIframeInspector = (
    iframe: HTMLIFrameElement | null,
    type: 'workflow' | 'dataflow'
  ) => {
    try {
      const doc = iframe?.contentDocument;
      if (!doc) return;

      const interactiveElements = doc.querySelectorAll(
        'path[data-animate="edge"], path[data-edge-from], g[role="button"], g[data-node-id], .node, .edge'
      );

      interactiveElements.forEach((el, idx) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.cursor = 'pointer';

        htmlEl.addEventListener('click', (e) => {
          e.stopPropagation();
          const edgeList = FLOW_EDGES[type];

          const edgeFrom = htmlEl.getAttribute('data-edge-from') || htmlEl.getAttribute('data-node-id') || '';
          const edgeTo = htmlEl.getAttribute('data-edge-to') || '';
          const combined = `${edgeFrom} ${edgeTo}`.toLowerCase();

          let matched = edgeList.find(edge => 
            combined.includes(edge.source.toLowerCase()) || 
            combined.includes(edge.target.toLowerCase())
          );

          if (!matched) {
            matched = edgeList[idx % edgeList.length];
          }

          if (type === 'workflow') {
            setSelectedWorkflowEdge(matched);
            highlightEdgeInIframe(iframe, matched, 'workflow');
          } else {
            setSelectedDataflowEdge(matched);
            highlightEdgeInIframe(iframe, matched, 'dataflow');
          }
        });
      });

      // Initial edge highlight
      const initialEdge = type === 'workflow' ? FLOW_EDGES.workflow[0] : FLOW_EDGES.dataflow[0];
      highlightEdgeInIframe(iframe, initialEdge, type);
    } catch (_) {
      // Graceful fallback
    }
  };

  const handleSelectWorkflowEdge = (edge: FlowEdge) => {
    setSelectedWorkflowEdge(edge);
    highlightEdgeInIframe(wfIframeRef.current, edge, 'workflow');
  };

  const handleSelectDataflowEdge = (edge: FlowEdge) => {
    setSelectedDataflowEdge(edge);
    highlightEdgeInIframe(dfIframeRef.current, edge, 'dataflow');
  };

  const iframeHeightClass = heightMode === 'fit'
    ? 'h-[480px] sm:h-[540px] lg:h-[620px] max-h-[68vh]'
    : heightMode === 'standard'
    ? 'h-[620px] sm:h-[700px] lg:h-[750px]'
    : 'h-[750px] sm:h-[820px] lg:h-[900px]';

  return (
    <section id="chapter-4-backend" className="space-y-8 scroll-mt-36">
      {/* 04. SECTION HEADER */}
      <SectionHeader
        variant="chapter"
        id="sec-backend"
        chapter={isEn ? 'CHAPTER 4' : 'PHẦN 4'}
        subtitle={isEn ? 'Django ORM, row-level locking, Celery asynchronous queue & interactive flow inspector' : 'Django ORM, khóa dòng dữ liệu, hàng đợi bất đồng bộ Celery & bộ kiểm tra luồng tương tác'}
        badge=""
        title={isEn ? '4. Backend Logic & Interactive Flow Inspector' : '4. Backend Logic & Bộ Kiểm Tra Luồng Tương Tác'}
        onCopy={onCopyDeepLink}
      />

      {/* STACK CHIPS */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
          <Server className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
          <span>{isEn ? 'Backend Architecture Stack:' : 'Ngăn xếp công nghệ Backend:'}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs tabular-nums font-semibold">
          <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0D7287] dark:text-[#9BE7FA]">Django 5.x ORM</span>
          <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">PostgreSQL ACID</span>
          <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0D7287] dark:text-[#9BE7FA]">Celery Workers</span>
          <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">Redis Broker</span>
        </div>
      </div>

      {/* SƠ ĐỒ TUẦN TỰ LOGIC BACKEND (SEQUENCE DIAGRAM STEPS) */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-slate-100 dark:border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-black text-sm tabular-nums">
                4.1
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Atomic Row Locking & Task Queue Sequence' : 'Sơ đồ Tuần tự: Khóa Dòng Dữ liệu & Đẩy Task Celery'}</span>
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEn ? 'Transactions service sequence with PostgreSQL SELECT ... FOR UPDATE' : 'Quy trình giao dịch mượn sách an toàn với select_for_update() và Celery .delay()'}
            </p>
          </div>
          <span className="text-xs tabular-nums px-3 py-1.5 rounded-xl bg-[#C8EEF7]/50 text-[#0D7287] dark:bg-slate-800 dark:text-[#9BE7FA] font-black border border-[#9BE7FA]/40">
            Zero Overselling
          </span>
        </div>

        {/* Sequence Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center tabular-nums font-bold text-xs sm:text-sm shadow-xs">1</span>
            <div className="font-bold text-slate-900 dark:text-white">Độc giả gửi Yêu cầu</div>
            <p className="text-slate-500 tabular-nums text-xs">POST /transactions/borrow/</p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-[#FFE485]/20 dark:bg-[#FFE485]/10 border border-[#FFD14C]/40 space-y-2.5">
            <span className="w-7 h-7 rounded-xl bg-[#FFD14C] text-slate-950 flex items-center justify-center tabular-nums font-bold text-xs sm:text-sm shadow-xs">2</span>
            <div className="font-bold text-[#92400E] dark:text-[#FFE485]">Khóa dòng bản ghi</div>
            <p className="text-slate-600 dark:text-slate-400 tabular-nums text-xs">BEGIN + SELECT ... FOR UPDATE</p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-[#C8EEF7]/30 dark:bg-[#074553]/20 border border-[#9BE7FA]/40 space-y-2.5">
            <span className="w-7 h-7 rounded-xl bg-[#0D7287] dark:bg-[#9BE7FA] text-white dark:text-[#04242C] flex items-center justify-center tabular-nums font-bold text-xs sm:text-sm shadow-xs">3</span>
            <div className="font-bold text-[#074553] dark:text-[#9BE7FA]">Giao dịch thành công</div>
            <p className="text-slate-600 dark:text-slate-400 text-xs">Tồn kho -1 & COMMIT giải phóng khóa</p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-[#FFE485]/15 dark:bg-[#FFE485]/5 border border-[#FFD14C]/40 space-y-2.5">
            <span className="w-7 h-7 rounded-xl bg-[#FFD14C] text-slate-950 flex items-center justify-center tabular-nums font-bold text-xs sm:text-sm shadow-xs">4</span>
            <div className="font-bold text-[#92400E] dark:text-[#FFE485]">Đẩy Task Redis</div>
            <p className="text-slate-600 dark:text-slate-400 tabular-nums text-xs">.delay() gửi email & phân tích</p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center tabular-nums font-bold text-xs sm:text-sm shadow-xs">5</span>
            <div className="font-bold text-slate-900 dark:text-white">Celery Worker ngầm</div>
            <p className="text-slate-500 text-xs">Cập nhật Analytics & Email nhắc hạn</p>
          </div>
        </div>

        {/* Branch Explanation Pills */}
        <div className="grid sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm">
          <div className="p-3.5 rounded-2xl bg-[#C8EEF7]/30 dark:bg-[#074553]/20 border border-[#9BE7FA]/40 flex items-start gap-2.5 text-[#074553] dark:text-[#9BE7FA]">
            <CheckCircle2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Trường hợp còn sách (Tồn kho &gt; 0): </span>
              <span>Khóa dòng dữ liệu, giảm tồn kho, ghi nhận phiếu mượn và phản hồi 200 OK.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFE485]/20 dark:bg-[#FFE485]/10 border border-[#FFE485]/60 flex items-start gap-2.5 text-[#92400E] dark:text-[#FFE485]">
            <AlertTriangle className="w-4 h-4 text-[#B45309] dark:text-[#FFD14C] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Trường hợp hết sách (Tồn kho == 0): </span>
              <span>ROLLBACK tức thời, phản hồi 400 Bad Request và tự động kích hoạt tùy chọn Đặt trước.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 BIỂU ĐỒ TƯƠNG TÁC + EDGE INSPECTOR (GIẢI THÍCH ĐƯỜNG NỐI KHI CLICK) */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-black text-sm tabular-nums">
                4.2
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Interactive Flow Diagrams & Edge Inspector' : 'Biểu Đồ Luồng Tương Tác & Bộ Giải Thích Đường Nối'}</span>
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEn ? 'Click on SVG nodes/edges or chip buttons to inspect underlying backend transactions and concurrency locks' : 'Nhấp trực tiếp vào đường nối trên sơ đồ hoặc chọn thẻ bên dưới để xem giải thích kỹ thuật chi tiết'}
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
                      ? 'bg-slate-900 text-white dark:bg-[#9BE7FA] dark:text-slate-950 shadow-xs'
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
                      ? 'bg-slate-900 text-white dark:bg-[#9BE7FA] dark:text-slate-950 shadow-xs'
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
                onClick={() => setHeightMode('fit')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                  heightMode === 'fit'
                    ? 'bg-slate-900 text-white dark:bg-[#9BE7FA] dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title={isEn ? 'Fit diagram completely in 1 screen' : 'Kích thước vừa trọn 1 màn hình'}
              >
                {isEn ? 'Fit Screen' : 'Vừa 1 màn hình'}
              </button>
              <button
                onClick={() => setHeightMode('standard')}
                className={`px-2.5 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                  heightMode === 'standard'
                    ? 'bg-slate-900 text-white dark:bg-[#9BE7FA] dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                750px
              </button>
              <button
                onClick={() => setHeightMode('jumbo')}
                className={`px-2.5 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                  heightMode === 'jumbo'
                    ? 'bg-slate-900 text-white dark:bg-[#9BE7FA] dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title={isEn ? 'Large expanded view (900px)' : 'Khổ lớn (900px)'}
              >
                900px
              </button>
            </div>
          </div>
        </div>

        {/* Display Container: Stacked (1 column full width) by default for maximum visibility */}
        <div className={`grid gap-8 ${activeTab === 'both' && layoutMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* CHART 1: BORROWING WORKFLOW & RACE CONDITION PREVENTION */}
          {(activeTab === 'both' || activeTab === 'workflow') && (
            <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-slate-100 dark:border-slate-800 pb-3.5">
                <div>
                  <h4 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                    <span>{isEn ? BACKEND_CHARTS[0].titleEn : BACKEND_CHARTS[0].titleVi}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {isEn ? BACKEND_CHARTS[0].descEn : BACKEND_CHARTS[0].descVi}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs tabular-nums text-[#92400E] dark:text-[#FFE485] font-bold px-2.5 py-1 rounded-xl bg-[#FFE485]/40 dark:bg-[#FFE485]/10 border border-[#FFE485]/60">
                    {BACKEND_CHARTS[0].badge}
                  </span>
                  
                  <button
                    onClick={() => setFullscreenChart(BACKEND_CHARTS[0])}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                    title={isEn ? 'Expand Fullscreen Modal' : 'Phóng to toàn cảnh (Modal)'}
                  >
                    <Maximize2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </button>

                  <a
                    href={`${BACKEND_CHARTS[0].externalUrl}?theme=${resolvedTheme}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                    title={isEn ? 'Open in new window' : 'Mở tab mới'}
                  >
                    <ExternalLink className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </a>
                </div>
              </div>

              {/* Metric tags */}
              <div className="flex flex-wrap gap-2">
                {BACKEND_CHARTS[0].metrics.map((m) => (
                  <span key={m} className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    {m}
                  </span>
                ))}
              </div>

              {/* Responsive Iframe Canvas */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <iframe 
                  ref={wfIframeRef}
                  src={`${BACKEND_CHARTS[0].src}&theme=${resolvedTheme}`} 
                  onLoad={() => attachIframeInspector(wfIframeRef.current, 'workflow')}
                  className={`w-full ${iframeHeightClass} bg-white dark:bg-slate-950 transition duration-300`} 
                  title={isEn ? BACKEND_CHARTS[0].titleEn : BACKEND_CHARTS[0].titleVi} 
                  loading="lazy"
                />
              </div>

              {/* EDGE INSPECTOR FOR 4.1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-slate-200/80 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {isEn ? 'Edge Inspector: Select Active Flow Path' : 'Bộ kiểm tra đường nối: Chọn luồng xử lý trên biểu đồ'}
                    </span>
                  </div>
                  <span className="text-xs tabular-nums text-[#0D7287] dark:text-[#9BE7FA] font-semibold">
                    {isEn ? 'Interactive DOM Synced' : 'Đồng bộ sự kiện DOM'}
                  </span>
                </div>

                {/* Edge selector chip buttons */}
                <div className="flex flex-wrap gap-2">
                  {FLOW_EDGES.workflow.map((edge) => {
                    const isSelected = selectedWorkflowEdge.id === edge.id;
                    return (
                      <button
                        key={edge.id}
                        type="button"
                        onClick={() => handleSelectWorkflowEdge(edge)}
                        className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-[#9BE7FA] dark:text-slate-950 dark:border-[#9BE7FA] shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#9BE7FA]'
                        }`}
                      >
                        <span className={`px-1.5 py-0.5 rounded tabular-nums text-xs font-bold ${
                          isSelected ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-700 text-[#0D7287] dark:text-[#9BE7FA]'
                        }`}>
                          {edge.id}
                        </span>
                        <span>{edge.source} → {edge.target}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Edge Detail Card */}
                <div className="p-4 rounded-xl border-l-4 border-[#0D7287] dark:border-[#9BE7FA] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums font-bold px-2 py-0.5 rounded bg-[#FFE485]/40 dark:bg-[#FFE485]/10 text-[#92400E] dark:text-[#FFE485] border border-[#FFE485]/60">
                        {selectedWorkflowEdge.id}
                      </span>
                      <b className="text-slate-900 dark:text-white text-xs sm:text-sm">
                        {isEn ? selectedWorkflowEdge.routeEn : selectedWorkflowEdge.routeVi}
                      </b>
                    </div>
                    <code className="font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0D7287] dark:text-[#9BE7FA] text-xs border border-slate-200 dark:border-slate-700">
                      {isEn ? selectedWorkflowEdge.techEn : selectedWorkflowEdge.techVi}
                    </code>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {isEn ? selectedWorkflowEdge.descEn : selectedWorkflowEdge.descVi}
                  </p>

                  <div className="pt-2 border-slate-100 dark:border-slate-800 flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5" />
                    <span><b>{isEn ? 'Concurrency Mechanism:' : 'Cơ chế an toàn luồng:'}</b> {isEn ? selectedWorkflowEdge.concurrencyEn : selectedWorkflowEdge.concurrencyVi}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHART 2: ANALYTICS DATAFLOW & ASYNCHRONOUS CELERY QUEUE */}
          {(activeTab === 'both' || activeTab === 'dataflow') && (
            <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-slate-100 dark:border-slate-800 pb-3.5">
                <div>
                  <h4 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                    <span>{isEn ? BACKEND_CHARTS[1].titleEn : BACKEND_CHARTS[1].titleVi}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {isEn ? BACKEND_CHARTS[1].descEn : BACKEND_CHARTS[1].descVi}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs tabular-nums text-[#0D7287] dark:text-[#9BE7FA] font-bold px-2.5 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900">
                    {BACKEND_CHARTS[1].badge}
                  </span>
                  
                  <button
                    onClick={() => setFullscreenChart(BACKEND_CHARTS[1])}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                    title={isEn ? 'Expand Fullscreen Modal' : 'Phóng to toàn cảnh (Modal)'}
                  >
                    <Maximize2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </button>

                  <a
                    href={`${BACKEND_CHARTS[1].externalUrl}?theme=${resolvedTheme}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                    title={isEn ? 'Open in new window' : 'Mở tab mới'}
                  >
                    <ExternalLink className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </a>
                </div>
              </div>

              {/* Metric tags */}
              <div className="flex flex-wrap gap-2">
                {BACKEND_CHARTS[1].metrics.map((m) => (
                  <span key={m} className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    {m}
                  </span>
                ))}
              </div>

              {/* Responsive Iframe Canvas */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <iframe 
                  ref={dfIframeRef}
                  src={`${BACKEND_CHARTS[1].src}&theme=${resolvedTheme}`} 
                  onLoad={() => attachIframeInspector(dfIframeRef.current, 'dataflow')}
                  className={`w-full ${iframeHeightClass} bg-white dark:bg-slate-950 transition duration-300`} 
                  title={isEn ? BACKEND_CHARTS[1].titleEn : BACKEND_CHARTS[1].titleVi} 
                  loading="lazy"
                />
              </div>

              {/* EDGE INSPECTOR FOR 4.2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-slate-200/80 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {isEn ? 'Edge Inspector: Select Active Flow Path' : 'Bộ kiểm tra đường nối: Chọn luồng phân tích trên biểu đồ'}
                    </span>
                  </div>
                  <span className="text-xs tabular-nums text-[#0D7287] dark:text-[#9BE7FA] font-semibold">
                    {isEn ? 'Interactive DOM Synced' : 'Đồng bộ sự kiện DOM'}
                  </span>
                </div>

                {/* Edge selector chip buttons */}
                <div className="flex flex-wrap gap-2">
                  {FLOW_EDGES.dataflow.map((edge) => {
                    const isSelected = selectedDataflowEdge.id === edge.id;
                    return (
                      <button
                        key={edge.id}
                        type="button"
                        onClick={() => handleSelectDataflowEdge(edge)}
                        className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-[#9BE7FA] dark:text-slate-950 dark:border-[#9BE7FA] shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#9BE7FA]'
                        }`}
                      >
                        <span className={`px-1.5 py-0.5 rounded tabular-nums text-xs font-bold ${
                          isSelected ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-700 text-[#0D7287] dark:text-[#9BE7FA]'
                        }`}>
                          {edge.id}
                        </span>
                        <span>{edge.source} → {edge.target}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Edge Detail Card */}
                <div className="p-4 rounded-xl border-l-4 border-[#0D7287] dark:border-[#9BE7FA] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/60 text-[#0D7287] dark:text-[#9BE7FA] border border-cyan-200 dark:border-cyan-800">
                        {selectedDataflowEdge.id}
                      </span>
                      <b className="text-slate-900 dark:text-white text-xs sm:text-sm">
                        {isEn ? selectedDataflowEdge.routeEn : selectedDataflowEdge.routeVi}
                      </b>
                    </div>
                    <code className="font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0D7287] dark:text-[#9BE7FA] text-xs border border-slate-200 dark:border-slate-700">
                      {isEn ? selectedDataflowEdge.techEn : selectedDataflowEdge.techVi}
                    </code>
                  </div>

                  {selectedDataflowEdge.mathFormula && (
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 tabular-nums text-xs text-[#0D7287] dark:text-[#9BE7FA] border border-slate-200 dark:border-slate-700">
                      <span className="font-sans font-bold text-slate-500 mr-2 text-xs">Công thức toán:</span>
                      <code>{selectedDataflowEdge.techVi}</code>
                    </div>
                  )}

                  <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {isEn ? selectedDataflowEdge.descEn : selectedDataflowEdge.descVi}
                  </p>

                  <div className="pt-2 border-slate-100 dark:border-slate-800 flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <Zap className="w-4 h-4 text-[#FFD14C] shrink-0 mt-0.5" />
                    <span><b>{isEn ? 'Async / Concurrency Model:' : 'Mô hình xử lý bất đồng bộ:'}</b> {isEn ? selectedDataflowEdge.concurrencyEn : selectedDataflowEdge.concurrencyVi}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN MODAL (WHEN USER CLICKS MAXIMIZE ON ANY CHART) */}
      {fullscreenChart && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 p-3 sm:p-6 flex flex-col justify-between animate-in fade-in duration-200">
          <div data-ui="modal-header" className="flex items-center justify-between pb-3 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
              <h3 className="font-bold text-base sm:text-xl">
                {isEn ? fullscreenChart.titleEn : fullscreenChart.titleVi}
              </h3>
              <span className="text-xs tabular-nums px-2 py-0.5 rounded bg-[#C8EEF7]/50 dark:bg-slate-800 text-[#074553] dark:text-[#9BE7FA] border border-[#9BE7FA]/40 dark:border-slate-700">
                {fullscreenChart.badge}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href={`${fullscreenChart.externalUrl}?theme=${resolvedTheme}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA] hover:underline flex items-center gap-1"
              >
                <span>{isEn ? 'Open Raw File' : 'Mở file gốc'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setFullscreenChart(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white cursor-pointer transition"
                title={isEn ? 'Close fullscreen' : 'Đóng toàn màn hình (Esc)'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 my-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <iframe 
              src={`${fullscreenChart.src}&theme=${resolvedTheme}`} 
              className="w-full h-full bg-white dark:bg-slate-950" 
              title={isEn ? fullscreenChart.titleEn : fullscreenChart.titleVi} 
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-slate-200 dark:border-slate-800">
            <span>Library Bus Interactive Flow Visualizer</span>
            <button 
              onClick={() => setFullscreenChart(null)} 
              className="hover:text-slate-900 dark:hover:text-white font-semibold cursor-pointer"
            >
              Thu nhỏ trở lại trang
            </button>
          </div>
        </div>
      )}

      {/* DANH MỤC ĐƯỜNG NỐI & GIẢI THÍCH LUỒNG XỬ LÝ (EDGE INSPECTOR SUMMARY TABLE) */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-slate-100 dark:border-slate-800 pb-3">
          <div className="space-y-1">
            <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              <span>{isEn ? 'Edge Inspector Catalog & Flow Explanations' : 'Danh Mục Đường Nối & Giải Thích Luồng Xử Lý (Edge Inspector)'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEn ? 'Comprehensive mapping of edges, backend triggers, locking mechanisms and async workers' : 'Bảng tổng hợp đối chiếu toàn bộ các đường nối, cơ chế kích hoạt backend và giải thích luồng xử lý'}
            </p>
          </div>
          <span className="text-xs tabular-nums px-3 py-1.5 rounded-xl bg-[#FFE485]/40 dark:bg-slate-800 text-[#92400E] dark:text-[#FFE485] font-bold border border-[#FFE485]/60 dark:border-slate-700">
            7 Core Flows
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase text-xs">
              <tr>
                <th className="p-3.5 w-1/5">{isEn ? 'Diagram & Code' : 'Biểu đồ & Mã đường nối'}</th>
                <th className="p-3.5 w-1/4">{isEn ? 'Backend Trigger' : 'Cơ chế Backend kích hoạt'}</th>
                <th className="p-3.5">{isEn ? 'Flow Explanation When Rendered' : 'Giải thích luồng xử lý khi đường nối hiện ra'}</th>
              </tr>
            </thead>
            <tbody className="[&>tr:nth-child(even)]:bg-slate-50 dark:[&>tr:nth-child(even)]:bg-slate-800/40">
              {/* 4.1 Luồng Mượn/Trả */}
              {FLOW_EDGES.workflow.map((edge) => (
                <tr key={edge.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 align-top">
                    <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA] block text-xs">4.1 Luồng Mượn/Trả</span>
                    <span className="tabular-nums font-bold text-slate-900 dark:text-white text-xs block mt-0.5">
                      [{edge.id}] {edge.source} → {edge.target}
                    </span>
                  </td>
                  <td className="p-3.5 align-top">
                    <code className="font-mono text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 block">
                      {isEn ? edge.techEn : edge.techVi}
                    </code>
                    <span className="text-xs text-slate-500 block mt-1">
                      {isEn ? edge.concurrencyEn : edge.concurrencyVi}
                    </span>
                  </td>
                  <td className="p-3.5 align-top text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn ? edge.descEn : edge.descVi}
                  </td>
                </tr>
              ))}

              {/* 4.2 Luồng Phân tích */}
              {FLOW_EDGES.dataflow.map((edge) => (
                <tr key={edge.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 align-top">
                    <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA] block text-xs">4.2 Luồng Phân tích</span>
                    <span className="tabular-nums font-bold text-slate-900 dark:text-white text-xs block mt-0.5">
                      [{edge.id}] {edge.source} → {edge.target}
                    </span>
                  </td>
                  <td className="p-3.5 align-top">
                    <code className="font-mono text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 block">
                      {isEn ? edge.techEn : edge.techVi}
                    </code>
                    <span className="text-xs text-slate-500 block mt-1">
                      {isEn ? edge.concurrencyEn : edge.concurrencyVi}
                    </span>
                  </td>
                  <td className="p-3.5 align-top text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn ? edge.descEn : edge.descVi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BẢNG ĐẶC TẢ KỸ THUẬT PYTHON / DJANGO CỐT LÕI */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>{isEn ? 'Python / Django Technical Specification' : 'Đặc Tả Kỹ Thuật Python / Django Cốt Lõi'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {isEn ? 'Core transaction primitives and background queue decorators' : 'Hàm và Decorator chịu trách nhiệm toàn vẹn dữ liệu và xử lý tác vụ nền'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold uppercase text-xs">
              <tr>
                <th className="p-3.5 w-1/4">Hàm / Decorator Python</th>
                <th className="p-3.5 w-1/3">Tham số đầu vào & Mặc định</th>
                <th className="p-3.5">Kết quả trả về & Cơ chế hoạt động</th>
              </tr>
            </thead>
            <tbody className="[&>tr:nth-child(even)]:bg-slate-50 dark:[&>tr:nth-child(even)]:bg-slate-800/40">
              {TECHNICAL_SPECS.map((spec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 align-top">
                    <span className="tabular-nums font-bold text-[#0D7287] dark:text-[#9BE7FA] block text-sm">{spec.fn}</span>
                    <span className="tabular-nums text-xs text-slate-500 block mt-0.5">{spec.signature}</span>
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
