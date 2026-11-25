'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  ExternalLink,
  Layers,
  Maximize2,
  Server,
  ShieldCheck,
  Terminal,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from '@/app/context/ThemeContext';

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
  selector?: string;
}

export const FLOW_EDGES: Record<'workflow' | 'dataflow', FlowEdge[]> = {
  workflow: [
    {
      id: 'E1',
      source: 'Client',
      target: 'TransactionService',
      routeVi: 'Độc giả (Client) → TransactionService (transactions/services.py)',
      routeEn: 'Reader (Client) → TransactionService (transactions/services.py)',
      techVi: 'with transaction.atomic()',
      techEn: 'with transaction.atomic()',
      descVi:
        'Khởi tạo giao dịch ACID trên MySQL 8.0 cho yêu cầu mượn sách; mọi lỗi phát sinh phía sau sẽ tự động ROLLBACK toàn bộ, bảo toàn tính toàn vẹn dữ liệu.',
      descEn:
        'Initializes an ACID MySQL 8.0 database transaction for the borrow request; any exception triggers an automatic ROLLBACK to preserve database integrity.',
      concurrencyVi:
        'Giao dịch nguyên tử trên MySQL 8.0; tự động rollback khi gặp exception hoặc vi phạm hạn mức mượn.',
      concurrencyEn:
        'Atomic transaction on MySQL 8.0; automatic rollback on exceptions or quota violations.',
      selector: 'path[data-edge-from="request_borrow"], path[data-edge-from="search"]',
    },
    {
      id: 'E2',
      source: 'TransactionService',
      target: 'MySQL8Lock',
      routeVi: 'TransactionService → MySQL 8.0 (Khóa bi quan Book & User)',
      routeEn: 'TransactionService → MySQL 8.0 (Book & User Pessimistic Lock)',
      techVi: 'Book.objects.select_for_update() & User.objects.select_for_update()',
      techEn: 'Book.objects.select_for_update() & User.objects.select_for_update()',
      descVi:
        'Khóa bi quan (Row-level Lock) theo thứ tự khóa cố định (Lock Ordering: User trước, Book theo UUID tăng dần) trong MySQL 8.0, chặn lỗi TOCTOU / Race Condition và ngăn Deadlock khi nhiều giao dịch đồng thời mượn cuốn sách cuối cùng.',
      descEn:
        'Applies deterministic lock ordering (User first, then Book by ascending UUID) with pessimistic row-level locks in MySQL 8.0, eliminating TOCTOU race conditions while preventing cross-table deadlocks.',
      concurrencyVi:
        'Pessimistic Row-level Lock (SELECT ... FOR UPDATE) kèm Lock Ordering cố định (User → Book) chống Deadlock cho tới khi transaction COMMIT.',
      concurrencyEn:
        'Pessimistic row-level lock with deterministic Lock Ordering (User → Book) preventing deadlocks until transaction COMMIT.',
      selector:
        'path[data-edge-to="lock_create"], path[data-edge-from="check_stock"][data-edge-to="lock_create"]',
    },
    {
      id: 'E3',
      source: 'MySQL8Lock',
      target: 'ReservationQueue',
      routeVi: 'Kiểm tra tồn kho → Hàng đợi Đặt trước FIFO (BR-02)',
      routeEn: 'Inventory Check → FIFO Reservation Queue (BR-02)',
      techVi: "not is_available → queue_position & F('queue_position') - 1",
      techEn: "not is_available → queue_position & F('queue_position') - 1",
      descVi:
        'Khi sách hết bản khả dụng (not is_available), hệ thống chuyển sang tạo BookReservation (cấp queue_position, giữ chỗ 7 ngày expires_date) và Celery Beat quét giải phóng mỗi 30 phút.',
      descEn:
        'When available inventory is 0 (not is_available), routes to BookReservation (FIFO queue_position, 7-day expires_date) scanned every 30 minutes by Celery Beat.',
      concurrencyVi:
        'Rẽ nhánh FIFO an toàn; dồn hàng đợi nguyên tử bằng biểu thức F("queue_position") - 1.',
      concurrencyEn:
        'Contention-free FIFO fallback; atomic queue shifting via F("queue_position") - 1.',
      selector: 'path[data-edge-to="reserve_queue"]',
    },
    {
      id: 'E4',
      source: 'TransactionService',
      target: 'CeleryBroker',
      routeVi: 'TransactionService → Redis 7 / Celery Worker (on_commit)',
      routeEn: 'TransactionService → Redis 7 / Celery Worker (on_commit)',
      techVi: 'transaction.on_commit(lambda: update_analytics_on_borrow_task.delay(...))',
      techEn: 'transaction.on_commit(lambda: update_analytics_on_borrow_task.delay(...))',
      descVi:
        'Sau khi MySQL 8.0 COMMIT thành công, hook transaction.on_commit đẩy task bất đồng bộ qua Redis 7 để cập nhật BookAnalytics, cộng +5đ uy tín UserReadingStats và xóa cache CacheMixin.',
      descEn:
        'After MySQL 8.0 COMMIT succeeds, transaction.on_commit dispatches async tasks to Redis 7 to update BookAnalytics, add +5 reputation pts, and invalidate versioned CacheMixin.',
      concurrencyVi:
        'Xử lý bất đồng bộ (Non-blocking I/O) qua Redis 7 Broker & Celery 5.5.3 Worker.',
      concurrencyEn:
        'Non-blocking asynchronous execution via Redis 7 Broker and Celery 5.5.3 Workers.',
      selector: 'path[data-edge-to="analytics_task"], path[data-edge-from="bus_handover"]',
    },
  ],
  dataflow: [
    {
      id: 'D1',
      source: 'UserEvents',
      target: 'CeleryWorker',
      routeVi: 'Sự kiện Độc giả (UserActivity) → Celery Event Collector',
      routeEn: 'Reader Events (UserActivity) → Celery Event Collector',
      techVi: 'analytics/models.py (UserActivity + JSONField metadata)',
      techEn: 'analytics/models.py (UserActivity + JSONField metadata)',
      descVi:
        'Thu thập 8 loại sự kiện (borrow, return, review, reputation_gained, level_up, login, view_book, bus_visit) kèm JSONField metadata; tự động chuyển bản ghi >90 ngày sang kho lạnh ArchivedUserActivity.',
      descEn:
        'Captures 8 event types with JSONField metadata; automatically archives records >90 days to cold storage ArchivedUserActivity on the 1st of each month at 02:00.',
      concurrencyVi:
        'Hàng đợi ngầm Redis 7; tách biệt bảng nóng UserActivity và kho lạnh ArchivedUserActivity.',
      concurrencyEn:
        'Redis 7 background queue; hot UserActivity table decoupled from 90-day ArchivedUserActivity cold storage.',
      selector:
        'path[data-edge-from="borrow_ops"], path[data-edge-from="user_clicks"], path[data-edge-id="borrow-event"]',
    },
    {
      id: 'D2',
      source: 'CeleryWorker',
      target: 'BookBusAnalytics',
      routeVi: 'Celery Worker → BookAnalytics & BusAnalytics Engine',
      routeEn: 'Celery Worker → BookAnalytics & BusAnalytics Engine',
      techVi: '0.60*borrow + 0.30*rating + 0.10*view + 20 (30d bonus)',
      techEn: '0.60*borrow + 0.30*rating + 0.10*view + 20 (30d bonus)',
      descVi:
        'Tính điểm phổ biến sách BookAnalytics (60% lượt mượn + 30% đánh giá + 10% lượt xem + 20đ thưởng mới mượn trong 30 ngày) và hiệu suất xe BusAnalytics = min((total_borrows / total_visits) * 100, 100).',
      descEn:
        'Computes BookAnalytics popularity score (60% borrows + 30% ratings + 10% views + 20pt 30d recency bonus) and BusAnalytics efficiency = min((total_borrows / total_visits) * 100, 100).',
      concurrencyVi:
        'Tổng hợp nền định kỳ qua Celery Beat (DailyStats lúc 00:15) và lưu cache Redis 7 có đánh số phiên bản.',
      concurrencyEn:
        'Computed in scheduled Celery Beat tasks (DailyStats at 00:15) and cached in versioned Redis 7.',
      selector:
        'path[data-edge-id="stats-persist"], path[data-edge-from="celery_analytics"][data-edge-to="stats_tables"]',
    },
    {
      id: 'D3',
      source: 'CeleryWorker',
      target: 'RecommendationFunnel',
      routeVi: 'Hồ sơ Độc giả → Phễu Gợi ý 5 Thuật toán (BookRecommendation)',
      routeEn: 'Reader Profile → 5-Algorithm Recommendation Funnel (BookRecommendation)',
      techVi: 'is_clicked → is_borrowed (Click Rate & Borrow Rate)',
      techEn: 'is_clicked → is_borrowed (Click Rate & Borrow Rate)',
      descVi:
        'Theo dõi chuyển đổi is_clicked → is_borrowed cho 5 thuật toán gợi ý sách và cập nhật điểm uy tín UserReadingStats (0–1.000 điểm: mượn +5đ, trả +10đ, review +3đ, phân 5 hạng Đồng → Kim cương).',
      descEn:
        'Tracks is_clicked → is_borrowed funnel conversion across 5 recommendation algorithms and updates UserReadingStats reputation (0–1,000 pts across 5 tiers from Bronze to Diamond).',
      concurrencyVi:
        'Tái huấn luyện ma trận gợi ý vào Chủ nhật 03:00; lưu cache Redis 7 TTL 24h.',
      concurrencyEn:
        'Recommendation matrix refreshed Sundays at 03:00; cached in Redis 7 with 24h TTL.',
      selector: 'path[data-edge-id="cache-ai-feed"], path[data-edge-from="cache_layer"]',
    },
  ],
};

const BACKEND_CHARTS = [
  {
    id: 'workflow',
    titleVi: '2.1 Sơ đồ Kiến trúc Luồng Mượn/Trả & Khóa Bi Quan MySQL 8.0',
    titleEn: '2.1 Borrowing Workflow & MySQL 8.0 Pessimistic Row-Lock Architecture',
    badge: 'MySQL 8.0 ACID + select_for_update()',
    src: '/library-bus/borrowing-workflow.html?embed=1',
    externalUrl: '/library-bus/borrowing-workflow.html',
    metrics: ['select_for_update() Book & User', 'FIFO 7-Day Queue', 'Zero TOCTOU Overselling'],
    descVi:
      'Quy trình khóa bi quan dòng dữ liệu trong TransactionService khi nhiều độc giả mượn cùng lúc cuốn sách cuối cùng trên xe.',
    descEn:
      'Pessimistic concurrency control workflow in TransactionService when multiple readers attempt to borrow the last available book copy.',
  },
  {
    id: 'dataflow',
    titleVi: '2.2 Sơ đồ Kiến trúc Luồng Dữ liệu Telemetry & Hàng đợi Celery + Redis 7',
    titleEn: '2.2 Telemetry Dataflow Architecture & Asynchronous Celery + Redis 7 Queue',
    badge: 'Celery 5.5.3 + Redis 7 + analytics app',
    src: '/library-bus/analytics-dataflow.html?embed=1',
    externalUrl: '/library-bus/analytics-dataflow.html',
    metrics: ['transaction.on_commit Async', 'BookAnalytics & BusAnalytics', '90d Cold Archiving'],
    descVi:
      'Đường ống thu thập sự kiện UserActivity, tính điểm phổ biến sách, hiệu suất xe buýt và phễu gợi ý cá nhân hóa qua Celery Worker.',
    descEn:
      'Non-blocking asynchronous telemetry pipeline computing BookAnalytics, BusAnalytics, and recommendation funnels via Celery Workers.',
  },
];

// Sơ đồ 3: Timeline 24 giờ cho 9 Celery Beat Jobs trong settings.py
const CELERY_24H_TIMELINE = [
  {
    time: '00:00',
    taskName: 'cleanup_expired_sessions',
    labelVi: 'Dọn dẹp phiên đăng nhập & token hết hạn',
    labelEn: 'Clean up expired user sessions & tokens',
    module: 'users',
  },
  {
    time: '00:15',
    taskName: 'aggregate_daily_stats_task',
    labelVi: 'Tổng hợp bảng DailyStats (mượn, trả, user mới, doanh thu phạt)',
    labelEn: 'Roll up DailyStats table (borrows, returns, new users, fine revenue)',
    module: 'analytics',
  },
  {
    time: '01:00',
    taskName: 'update_reading_streaks_task',
    labelVi: 'Cập nhật chuỗi ngày đọc liên tiếp (reading_streak_days)',
    labelEn: 'Update reader consecutive reading_streak_days',
    module: 'analytics',
  },
  {
    time: '02:00 (Mùng 1)',
    taskName: 'archive_old_user_activities',
    labelVi: 'Chuyển log UserActivity > 90 ngày sang kho lạnh ArchivedUserActivity',
    labelEn: 'Move UserActivity logs > 90 days to cold ArchivedUserActivity table',
    module: 'analytics',
  },
  {
    time: '03:00 (CN)',
    taskName: 'refresh_book_recommendations',
    labelVi: 'Tính lại ma trận gợi ý sách 5 thuật toán & điểm BookAnalytics',
    labelEn: 'Recompute 5-algorithm BookRecommendation matrix & BookAnalytics scores',
    module: 'analytics',
  },
  {
    time: '05:00',
    taskName: 'warm_up_redis_cache_task',
    labelVi: 'Làm nóng Redis 7 Cache (CacheMixin) cho trang chủ & danh mục xe',
    labelEn: 'Warm up Redis 7 versioned cache (CacheMixin) for catalog & fleet routes',
    module: 'core',
  },
  {
    time: '06:00',
    taskName: 'check_overdue_books_and_fines',
    labelVi: 'Quét phiếu quá hạn & tính phạt lũy tiến 3 bậc (FinePayment)',
    labelEn: 'Scan overdue loans & compute 3-tier progressive FinePayment records',
    module: 'transactions',
  },
  {
    time: '08:00',
    taskName: 'send_due_date_reminders_task',
    labelVi: 'Gửi email & thông báo nhắc hạn trả sách trước 2 ngày',
    labelEn: 'Dispatch due-date reminder emails & UserNotification alerts',
    module: 'notifications',
  },
  {
    time: 'Mỗi 30 phút',
    taskName: 'process_reservation_queue_task',
    labelVi: 'Quét hàng đợi đặt trước FIFO (giải phóng chỗ quá 7 ngày & đôn queue_position)',
    labelEn: 'Scan FIFO reservation queue (release >7d expired holds & shift queue_position)',
    module: 'transactions',
  },
];

// Sơ đồ 4: Phễu Telemetry Gợi ý & Giữ chân độc giả (analytics/views.py & analytics/models.py)
const TELEMETRY_FUNNEL_DATA = [
  {
    step: '1. view_book (UserActivity)',
    shortStep: '1. view_book',
    ratePct: 100.0,
    descVi: 'Ghi nhận lượt xem chi tiết sách (kèm JSONField metadata: bus_id, category, source)',
    descEn: 'Captures book detail views (with JSONField metadata: bus_id, category, source)',
    fill: '#9BE7FA',
  },
  {
    step: '2. recommendation_clicked (click_rate)',
    shortStep: '2. is_clicked (34,2%)',
    ratePct: 34.2,
    descVi: 'Độc giả nhấp vào thẻ gợi ý BookRecommendation (5 thuật toán: collaborative, content, popular, bus_local, hybrid)',
    descEn: 'Reader clicks a BookRecommendation card across 5 algorithms',
    fill: '#38BDF8',
  },
  {
    step: '3. borrow (borrow_rate & +5đ uy tín)',
    shortStep: '3. is_borrowed (18,6%)',
    ratePct: 18.6,
    descVi: 'Chuyển đổi thành phiếu mượn BorrowRecord thành công (khóa select_for_update(), cộng +5đ uy tín)',
    descEn: 'Converts into an active BorrowRecord (select_for_update() lock, +5 reputation pts)',
    fill: '#0D7287',
  },
  {
    step: '4. return (completion_rate & +10đ uy tín)',
    shortStep: '4. returned_on_time (16,4%)',
    ratePct: 16.4,
    descVi: 'Hoàn trả đúng hạn: cập nhật completion_rate, reading_streak_days và cộng +10đ uy tín (review thêm +3đ)',
    descEn: 'Returned on time: updates completion_rate, reading_streak_days, and +10 reputation pts (+3 pts on review)',
    fill: '#059669',
  },
];

const ACTUAL_MYSQL_TELEMETRY_SQL = `-- Truy vấn MySQL 8.0 trên schema thật (transactions_bookreservation, inventory_librarybus, analytics_busanalytics)
SELECT
  b.bus_number,
  b.license_plate,
  COUNT(r.id) AS total_reservations,
  SUM(CASE WHEN r.is_fulfilled = 1 THEN 1 ELSE 0 END) AS fulfilled_reservations,
  SUM(CASE WHEN r.is_fulfilled = 0 AND r.expires_date < UTC_TIMESTAMP() THEN 1 ELSE 0 END) AS expired_holds,
  ROUND(
    SUM(CASE WHEN r.is_fulfilled = 1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(r.id), 0),
    2
  ) AS fulfillment_rate_pct,
  ROUND(
    LEAST((ba.total_borrows / NULLIF(ba.total_visits, 0)) * 100.0, 100.0),
    1
  ) AS bus_efficiency_score
FROM transactions_bookreservation r
INNER JOIN inventory_librarybus b
  ON r.preferred_pickup_location_id = b.id
LEFT JOIN analytics_busanalytics ba
  ON ba.bus_id = b.id
WHERE r.is_deleted = 0
  AND r.reserved_date >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY)
GROUP BY b.id, b.bus_number, b.license_plate, ba.total_borrows, ba.total_visits
ORDER BY fulfillment_rate_pct DESC;`;

export function Chapter4BackendLogic({
  isEn = false,
}: Chapter4BackendLogicProps) {
  const { resolvedTheme } = useTheme();
  const [showCodeAuditAccordion, setShowCodeAuditAccordion] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(ACTUAL_MYSQL_TELEMETRY_SQL);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 1800);
    } catch {
      setCopiedSql(false);
    }
  };

  // Interactive Controls for the 2 Backend Architecture Diagrams
  const [activeTab, setActiveTab] = useState<'both' | 'workflow' | 'dataflow'>('both');
  const [fullscreenChart, setFullscreenChart] = useState<(typeof BACKEND_CHARTS)[0] | null>(null);

  const [selectedWorkflowEdge, setSelectedWorkflowEdge] = useState<FlowEdge>(
    FLOW_EDGES.workflow[0]
  );
  const [selectedDataflowEdge, setSelectedDataflowEdge] = useState<FlowEdge>(
    FLOW_EDGES.dataflow[0]
  );

  const wfIframeRef = useRef<HTMLIFrameElement>(null);
  const dfIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((ifr) => {
      try {
        ifr.contentWindow?.postMessage({ theme: resolvedTheme }, '*');
      } catch (_) {}
    });
  }, [resolvedTheme]);

  const highlightEdgeInIframe = (
    iframe: HTMLIFrameElement | null,
    edge: FlowEdge
  ) => {
    try {
      const doc = iframe?.contentDocument;
      if (!doc) return;
      const highlightColor = resolvedTheme === 'dark' ? '#9BE7FA' : '#0D7287';

      const allPaths = doc.querySelectorAll('path[data-animate="edge"], path[data-edge-from]');
      allPaths.forEach((p) => {
        const el = p as HTMLElement;
        el.style.stroke = '';
        el.style.strokeWidth = '';
        el.style.opacity = '0.55';
      });

      const targetPaths = edge.selector ? doc.querySelectorAll(edge.selector) : [];
      if (targetPaths.length > 0) {
        targetPaths.forEach((p) => {
          const el = p as HTMLElement;
          el.style.stroke = highlightColor;
          el.style.strokeWidth = '3.5px';
          el.style.opacity = '1';
        });
      }
    } catch (_) {}
  };

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
          const edgeFrom =
            htmlEl.getAttribute('data-edge-from') ||
            htmlEl.getAttribute('data-node-id') ||
            '';
          const edgeTo = htmlEl.getAttribute('data-edge-to') || '';
          const combined = `${edgeFrom} ${edgeTo}`.toLowerCase();

          let matched = edgeList.find(
            (edge) =>
              combined.includes(edge.source.toLowerCase()) ||
              combined.includes(edge.target.toLowerCase())
          );
          if (!matched) {
            matched = edgeList[idx % edgeList.length];
          }

          if (type === 'workflow') {
            setSelectedWorkflowEdge(matched);
            highlightEdgeInIframe(iframe, matched);
          } else {
            setSelectedDataflowEdge(matched);
            highlightEdgeInIframe(iframe, matched);
          }
        });
      });

      const initialEdge =
        type === 'workflow' ? FLOW_EDGES.workflow[0] : FLOW_EDGES.dataflow[0];
      highlightEdgeInIframe(iframe, initialEdge);
    } catch (_) {}
  };

  const iframeHeightClass = 'h-[320px] sm:h-[440px] md:h-[520px] lg:h-[600px] xl:h-[640px]';

  return (
    <section id="chapter-4-backend" className="space-y-6 scroll-mt-28">
      <div className="space-y-1.5">
        <span className="inline-flex items-center rounded-md bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 px-2.5 py-0.5 text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
          {isEn
            ? 'Section 02 · Data Architecture (MySQL 8.0 + Redis 7 + Celery) & Product Telemetry'
            : 'Phần 02 · Kiến trúc Dữ liệu (MySQL 8.0 + Redis 7 + Celery) & Hệ thống Telemetry'}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {isEn
            ? '5-Layer System Architecture, Interactive Backend Diagrams & Event Telemetry'
            : 'Kiến trúc 5 lớp (MySQL 8.0 • Redis • Celery), 2 Biểu đồ Kiến trúc Backend & Công thức Telemetry'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-prose leading-relaxed">
          {isEn
            ? 'Directly audited from settings.py, docker-compose.yml, core/models.py, transactions/services.py, and analytics/models.py across all 229 repository files.'
            : 'Đối chiếu trực tiếp từ settings.py, docker-compose.yml, core/models.py, transactions/services.py và analytics/models.py trên toàn bộ 229 file mã nguồn.'}
        </p>
      </div>

      {/* 2 KHỐI ĐẶT NGANG NHAU: TRÁI (KIẾN TRÚC 5 LỚP MYSQL + REDIS + CELERY) | PHẢI (4 CÔNG THỨC TELEMETRY & DATA MODELING) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Bên trái (6 cột): Kiến trúc 5 lớp & Lược đồ Dữ liệu cốt lõi (MySQL 8.0 + Redis 7) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 px-2.5 py-0.5 text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                <Server className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? 'Left · 5-Layer Architecture & Core Schema'
                    : 'Trái · Kiến trúc 5 lớp & Lược đồ Dữ liệu cốt lõi'}
                </span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                mysqlclient==2.2.7 • Redis 7
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {isEn
                ? '7 Django Apps (36 Models + 3 Base Mixins) on MySQL 8.0'
                : '7 Phân hệ Django (36 Models + 3 Base Mixins) trên MySQL 8.0'}
            </h3>

            <div className="space-y-2.5 text-xs tabular-nums">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isEn
                    ? 'Layer 1 · 7 Modular Django 5.2 Apps (97 HTML Templates & Gemini AI)'
                    : 'Lớp 1 · 7 Phân hệ Django 5.2 (97 HTML Templates & Gemini AI)'}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  {isEn ? (
                    <>
                      <code>users</code> (Profile, UserRole, LoginHistory) • <code>inventory</code> (LibraryBus, BusRoute, Book, Category, BookDonation) • <code>transactions</code> (BorrowRecord, BookReservation, FinePayment, ShippingRequest) • <code>analytics</code> (6 Telemetry tables) • <code>notifications</code> • <code>blog</code> • <code>core</code>. Integrates <strong>Gemini AI</strong> for automated ISBN book metadata extraction.
                    </>
                  ) : (
                    <>
                      <code>users</code> (Profile, UserRole, LoginHistory) • <code>inventory</code> (LibraryBus, BusRoute, Book, Category, BookDonation) • <code>transactions</code> (BorrowRecord, BookReservation, FinePayment, ShippingRequest) • <code>analytics</code> (6 bảng Telemetry) • <code>notifications</code> • <code>blog</code> • <code>core</code>. Tích hợp <strong>Gemini AI</strong> trích xuất metadata sách tự động.
                    </>
                  )}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#C8EEF7]/20 dark:bg-[#9BE7FA]/10 border border-[#C8EEF7] dark:border-slate-800">
                <p className="font-bold text-[#074553] dark:text-[#9BE7FA]">
                  {isEn
                    ? 'Layer 2 · Service Layer with Pessimistic Locking (TransactionService)'
                    : 'Lớp 2 · Service Layer có Khóa bi quan (TransactionService)'}
                </p>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                  {isEn ? (
                    <>
                      Encapsulates borrowing, reservation, renewal, and fine rules inside <code>transactions/services.py</code>, applying <code>select_for_update()</code> inside <code>transaction.atomic()</code> on <code>Book</code> and <code>User</code> rows to prevent race conditions.
                    </>
                  ) : (
                    <>
                      Tách biệt toàn bộ nghiệp vụ mượn/đặt trước/gia hạn/tính phạt vào <code>transactions/services.py</code>; sử dụng <code>select_for_update()</code> trong <code>transaction.atomic()</code> để khóa bản ghi <code>Book</code> và <code>User</code> chống Race Condition.
                    </>
                  )}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isEn
                    ? 'Layer 3 · MySQL 8.0 Storage with UUIDv4, SoftDelete & AuditMixin'
                    : 'Lớp 3 · MySQL 8.0 chuẩn hóa UUIDv4, SoftDelete & AuditMixin'}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  {isEn ? (
                    <>
                      All 36 models inherit 3 base mixins in <code>core/models.py</code>: <code>TimestampedModel</code> (<strong>UUIDv4</strong> primary keys, <code>created_at</code>, <code>updated_at</code>), <code>SoftDeleteModel</code> (<code>is_deleted</code>, <code>deleted_at</code>), and <code>AuditMixin</code>.
                    </>
                  ) : (
                    <>
                      Toàn bộ 36 model kế thừa 3 lớp cơ sở trong <code>core/models.py</code>: <code>TimestampedModel</code> (khóa chính <strong>UUIDv4</strong>, <code>created_at</code>, <code>updated_at</code>), <code>SoftDeleteModel</code> (xóa mềm <code>is_deleted</code>, <code>deleted_at</code>) và <code>AuditMixin</code>.
                    </>
                  )}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isEn
                    ? 'Layer 4 & 5 · Redis 7 Versioned CacheMixin & Celery 5.5.3'
                    : 'Lớp 4 & 5 · Redis 7 Cache có Versioning (CacheMixin) & Celery 5.5.3'}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  {isEn ? (
                    <>
                      <code>CacheMixin</code> automatically bumps Redis 7 key versions on model updates; Celery Worker &amp; Celery Beat execute 9 scheduled background jobs across 5 Docker Compose services.
                    </>
                  ) : (
                    <>
                      <code>CacheMixin</code> tự động tăng version key trên Redis 7 khi model thay đổi; Celery Worker &amp; Celery Beat vận hành 9 tác vụ nền qua 5 container Docker Compose.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bên phải (6 cột): 4 Công thức Telemetry & Data Modeling thật trong analytics app */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FFE485]/60 dark:bg-[#FFD14C]/15 px-2.5 py-0.5 text-xs font-bold text-slate-900 dark:text-[#FFE485]">
                <Activity className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? 'Right · Product Telemetry & Data Modeling (analytics/models.py)'
                    : 'Phải · Công thức Telemetry & Data Modeling thật (analytics/models.py)'}
                </span>
              </span>
              <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                Product DA Core
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {isEn
                ? '4 Quantitative Telemetry Engines Built Into the Codebase'
                : '4 Cơ chế Đo lường & Chấm điểm Định lượng trong phân hệ analytics'}
            </h3>

            <div className="space-y-2.5 text-xs tabular-nums">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isEn ? (
                    <>1. Event Log (<code>UserActivity</code> &amp; Cold Archive <code>ArchivedUserActivity</code>)</>
                  ) : (
                    <>1. Event Log (<code>UserActivity</code> &amp; Kho lạnh <code>ArchivedUserActivity</code>)</>
                  )}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  {isEn ? (
                    <>
                      Logs 8 behavioral event types (<code>borrow</code>, <code>return</code>, <code>review</code>, <code>reputation_gained</code>, <code>level_up</code>, <code>login</code>, <code>view_book</code>, <code>bus_visit</code>) with <code>JSONField metadata</code>. Automatically archives records older than <strong>90 days</strong> to <code>ArchivedUserActivity</code> (1st of month at 02:00) to keep the hot table lightweight.
                    </>
                  ) : (
                    <>
                      Ghi nhận sự kiện hành vi (<code>borrow</code>, <code>return</code>, <code>review</code>, <code>reputation_gained</code>, <code>level_up</code>, <code>login</code>, <code>view_book</code>, <code>bus_visit</code>) kèm <code>JSONField metadata</code>. Tự động chuyển bản ghi &gt; <strong>90 ngày</strong> sang bảng lưu trữ lạnh <code>ArchivedUserActivity</code> (02:00 ngày mùng 1 hàng tháng) để giữ bảng nóng luôn nhẹ.
                    </>
                  )}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#C8EEF7]/20 dark:bg-[#9BE7FA]/10 border border-[#C8EEF7] dark:border-slate-800">
                <p className="font-bold text-[#074553] dark:text-[#9BE7FA]">
                  {isEn ? (
                    <>2. Book Popularity Score (<code>BookAnalytics.calculate_popularity_score</code>)</>
                  ) : (
                    <>2. Điểm phổ biến sách (<code>BookAnalytics.calculate_popularity_score</code>)</>
                  )}
                </p>
                <p className="text-slate-700 dark:text-slate-300 mt-1 font-mono text-xs leading-relaxed">
                  {isEn
                    ? 'popularity_score = 0.60 × borrow_score + 0.30 × rating_score + 0.10 × view_score + 20 (recency bonus if borrowed within 30d)'
                    : 'popularity_score = 0.60 × borrow_score + 0.30 × rating_score + 0.10 × view_score + 20 (thưởng sách mới được mượn trong 30 ngày gần nhất)'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isEn ? (
                    <>3. Bus Fleet Efficiency (<code>BusAnalytics.efficiency_score</code>)</>
                  ) : (
                    <>3. Hiệu suất vận hành xe buýt (<code>BusAnalytics.efficiency_score</code>)</>
                  )}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-1 font-mono text-xs leading-relaxed">
                  efficiency_score = min((total_borrows / total_visits) × 100, 100)
                </p>
                <p className="text-slate-500 mt-0.5">
                  {isEn ? (
                    <>Measures conversion from bus visits (<code>track_bus_visit</code>) to completed borrows per bus route.</>
                  ) : (
                    <>Đo tỷ lệ chuyển đổi từ lượt ghé thăm xe buýt (<code>track_bus_visit</code>) thành lượt mượn thực tế trên từng chuyến xe.</>
                  )}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isEn ? (
                    <>4. Recommendation Funnel (<code>BookRecommendation</code>) &amp; Gamification (<code>UserReadingStats</code>)</>
                  ) : (
                    <>4. Phễu Gợi ý (<code>BookRecommendation</code>) &amp; Gamification (<code>UserReadingStats</code>)</>
                  )}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  {isEn ? (
                    <>
                      Tracks <code>is_clicked</code> → <code>is_borrowed</code> to measure <strong>Click Rate</strong> and <strong>Borrow Rate</strong> across 5 recommendation algorithms. Reader reputation spans <code>0–1,000 pts</code> (borrow <code>+5</code>, on-time return <code>+10</code>, review <code>+3</code>) across 5 Bronze-to-Diamond tiers.
                    </>
                  ) : (
                    <>
                      Theo dõi trạng thái <code>is_clicked</code> → <code>is_borrowed</code> để tính <strong>Click Rate</strong> và <strong>Borrow Rate</strong> cho 5 thuật toán gợi ý. Hệ thống uy tín <code>0–1.000 điểm</code> (mượn <code>+5đ</code>, trả đúng hạn <code>+10đ</code>, viết review <code>+3đ</code>) phân 5 hạng thẻ từ Đồng đến Kim cương.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GIỮ LẠI 2 BIỂU ĐỒ KIẾN TRÚC BACKEND TƯƠNG TÁC + BỘ KIỂM TRA ĐƯỜNG NỐI (EDGE INSPECTOR) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {isEn
                  ? 'Interactive Backend Architecture Diagrams & Edge Inspector'
                  : '2 Biểu Đồ Kiến Trúc Backend Tương Tác & Bộ Giải Thích Đường Nối'}
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {isEn
                ? 'Click on SVG nodes/edges or select an edge chip below to inspect underlying MySQL 8.0 locks & Celery tasks'
                : 'Nhấp trực tiếp vào đường nối trên sơ đồ hoặc chọn thẻ bên dưới để xem cơ chế khóa MySQL 8.0 và hàng đợi Celery'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer min-h-[34px] ${
                  activeTab === 'both'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {isEn ? 'Both Diagrams' : 'Cả 2 biểu đồ'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('workflow')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer min-h-[34px] ${
                  activeTab === 'workflow'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                2.1 Workflow
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dataflow')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer min-h-[34px] ${
                  activeTab === 'dataflow'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                2.2 Telemetry
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* BIỂU ĐỒ BACKEND 1: BORROWING WORKFLOW & RACE CONDITION PREVENTION */}
          {(activeTab === 'both' || activeTab === 'workflow') && (
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                    <span>{isEn ? BACKEND_CHARTS[0].titleEn : BACKEND_CHARTS[0].titleVi}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {isEn ? BACKEND_CHARTS[0].descEn : BACKEND_CHARTS[0].descVi}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs tabular-nums text-[#92400E] dark:text-[#FFE485] font-bold px-2.5 py-1.5 rounded-xl bg-[#FFE485]/40 dark:bg-[#FFE485]/10 border border-[#FFE485]/60">
                    {BACKEND_CHARTS[0].badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFullscreenChart(BACKEND_CHARTS[0])}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#9BE7FA]/35 hover:bg-[#9BE7FA]/60 text-[#074553] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-[#9BE7FA] text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 border border-[#9BE7FA]/60 dark:border-slate-700"
                    title={isEn ? 'Expand Fullscreen Modal' : 'Phóng to toàn màn hình'}
                  >
                    <Maximize2 className="w-4 h-4 shrink-0" />
                    <span>{isEn ? 'Fullscreen' : 'Phóng to'}</span>
                  </button>
                  <a
                    href={`${BACKEND_CHARTS[0].externalUrl}?theme=${resolvedTheme}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
                    title={isEn ? 'Open in new window' : 'Mở tab mới'}
                  >
                    <ExternalLink className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </a>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <iframe
                  ref={wfIframeRef}
                  src={`${BACKEND_CHARTS[0].src}&theme=${resolvedTheme}`}
                  onLoad={() => attachIframeInspector(wfIframeRef.current, 'workflow')}
                  className={`w-full ${iframeHeightClass} bg-white dark:bg-slate-950`}
                  title={isEn ? BACKEND_CHARTS[0].titleEn : BACKEND_CHARTS[0].titleVi}
                  loading="lazy"
                />
              </div>

              {/* Edge Inspector for 2.1 */}
              <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {FLOW_EDGES.workflow.map((edge) => {
                    const isSelected = selectedWorkflowEdge.id === edge.id;
                    return (
                      <button
                        key={edge.id}
                        type="button"
                        onClick={() => {
                          setSelectedWorkflowEdge(edge);
                          highlightEdgeInIframe(wfIframeRef.current, edge);
                        }}
                        className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-[#9BE7FA] dark:text-slate-950 dark:border-[#9BE7FA]'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className="font-bold tabular-nums">{edge.id}</span>
                        <span>
                          {edge.source} → {edge.target}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl border-l-4 border-[#0D7287] dark:border-[#9BE7FA] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b className="text-slate-900 dark:text-white">
                      {selectedWorkflowEdge.id} ·{' '}
                      {isEn ? selectedWorkflowEdge.routeEn : selectedWorkflowEdge.routeVi}
                    </b>
                    <code className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#0D7287] dark:text-[#9BE7FA]">
                      {isEn ? selectedWorkflowEdge.techEn : selectedWorkflowEdge.techVi}
                    </code>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {isEn ? selectedWorkflowEdge.descEn : selectedWorkflowEdge.descVi}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BIỂU ĐỒ BACKEND 2: ANALYTICS DATAFLOW & ASYNCHRONOUS CELERY QUEUE */}
          {(activeTab === 'both' || activeTab === 'dataflow') && (
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD14C]" />
                    <span>{isEn ? BACKEND_CHARTS[1].titleEn : BACKEND_CHARTS[1].titleVi}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {isEn ? BACKEND_CHARTS[1].descEn : BACKEND_CHARTS[1].descVi}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs tabular-nums text-[#074553] dark:text-[#9BE7FA] font-bold px-2.5 py-1.5 rounded-xl bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/10 border border-[#9BE7FA]/60">
                    {BACKEND_CHARTS[1].badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFullscreenChart(BACKEND_CHARTS[1])}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#9BE7FA]/35 hover:bg-[#9BE7FA]/60 text-[#074553] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-[#9BE7FA] text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 border border-[#9BE7FA]/60 dark:border-slate-700"
                    title={isEn ? 'Expand Fullscreen Modal' : 'Phóng to toàn màn hình'}
                  >
                    <Maximize2 className="w-4 h-4 shrink-0" />
                    <span>{isEn ? 'Fullscreen' : 'Phóng to'}</span>
                  </button>
                  <a
                    href={`${BACKEND_CHARTS[1].externalUrl}?theme=${resolvedTheme}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
                    title={isEn ? 'Open in new window' : 'Mở tab mới'}
                  >
                    <ExternalLink className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  </a>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <iframe
                  ref={dfIframeRef}
                  src={`${BACKEND_CHARTS[1].src}&theme=${resolvedTheme}`}
                  onLoad={() => attachIframeInspector(dfIframeRef.current, 'dataflow')}
                  className={`w-full ${iframeHeightClass} bg-white dark:bg-slate-950`}
                  title={isEn ? BACKEND_CHARTS[1].titleEn : BACKEND_CHARTS[1].titleVi}
                  loading="lazy"
                />
              </div>

              {/* Edge Inspector for 2.2 */}
              <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {FLOW_EDGES.dataflow.map((edge) => {
                    const isSelected = selectedDataflowEdge.id === edge.id;
                    return (
                      <button
                        key={edge.id}
                        type="button"
                        onClick={() => {
                          setSelectedDataflowEdge(edge);
                          highlightEdgeInIframe(dfIframeRef.current, edge);
                        }}
                        className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-[#9BE7FA] dark:text-slate-950 dark:border-[#9BE7FA]'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className="font-bold tabular-nums">{edge.id}</span>
                        <span>
                          {edge.source} → {edge.target}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl border-l-4 border-[#FFD14C] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b className="text-slate-900 dark:text-white">
                      {selectedDataflowEdge.id} ·{' '}
                      {isEn ? selectedDataflowEdge.routeEn : selectedDataflowEdge.routeVi}
                    </b>
                    <code className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#0D7287] dark:text-[#9BE7FA]">
                      {isEn ? selectedDataflowEdge.techEn : selectedDataflowEdge.techVi}
                    </code>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {isEn ? selectedDataflowEdge.descEn : selectedDataflowEdge.descVi}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SƠ ĐỒ 3: TIMELINE 24 GIỜ CHO 9 CELERY BEAT JOBS (LƯỚI 3×3 RỘNG RÕ) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {isEn
                ? 'Diagram 3 · 24-Hour Operational Timeline for 9 Celery Beat Jobs (settings.py)'
                : 'Sơ đồ 3 · Trục thời gian vận hành 24 giờ của 9 tác vụ tự động Celery Beat (settings.py)'}
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA] tabular-nums">
            00:00 → 24:00 • CELERY_BEAT_SCHEDULE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 tabular-nums">
          {CELERY_24H_TIMELINE.map((job) => (
            <div
              key={job.taskName}
              className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 p-4 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-extrabold text-xs">
                  {job.time}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {job.module}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA] break-words">
                  {job.taskName}
                </p>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn ? job.labelEn : job.labelVi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SƠ ĐỒ 4: PHỄU TELEMETRY GỢI Ý & GIỮ CHÂN ĐỘC GIẢ + TRUY VẤN SQL MYSQL 8.0 THẬT */}
      <div className="grid grid-cols-1 gap-6">
        {/* Sơ đồ 4 (Toàn chiều rộng): Phễu Telemetry Gợi ý & Giữ chân độc giả */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 px-2.5 py-1 text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn
                  ? 'Diagram 4 · Recommendation & Reader Retention Telemetry Funnel'
                  : 'Sơ đồ 4 · Phễu Telemetry Gợi ý sách & Giữ chân độc giả (analytics/views.py)'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#FFE485]/60 dark:bg-[#FFD14C]/15 border border-[#FFD14C]/50 text-xs font-bold text-amber-950 dark:text-[#FFE485]">
                {isEn ? 'Simulated Prototype Data' : 'Dữ liệu mô phỏng (Bản mẫu)'}
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
              {isEn
                ? '4-Stage Tracking Schema: view_book → click_rate → borrow_rate → completion_rate'
                : 'Mô hình 4 tầng đo lường: view_book → recommendation_clicked → borrow → return'}
            </h3>

            <div className="h-[300px] sm:h-[340px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={TELEMETRY_FUNNEL_DATA}
                  layout="vertical"
                  margin={{ top: 10, right: 64, left: 12, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.22)" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 108]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}%`}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortStep"
                    width={215}
                    tick={{ fontSize: 13, fill: resolvedTheme === 'dark' ? '#e2e8f0' : '#1e293b', fontWeight: 600 }}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3.5 text-xs sm:text-sm tabular-nums space-y-1 max-w-sm">
                          <p className="font-bold text-slate-900 dark:text-white">{d.step}</p>
                          <p>
                            {isEn ? 'Funnel conversion: ' : 'Tỷ lệ phễu: '}
                            <strong className="text-[#0D7287] dark:text-[#9BE7FA]">{d.ratePct}%</strong>
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">{isEn ? d.descEn : d.descVi}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="ratePct" radius={[0, 8, 8, 0]} barSize={38}>
                    {TELEMETRY_FUNNEL_DATA.map((entry, idx) => (
                      <Cell key={`fcell-${idx}`} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="ratePct"
                      position="right"
                      offset={10}
                      formatter={(val: unknown) =>
                        typeof val === 'number'
                          ? `${isEn ? val.toFixed(1) : val.toFixed(1).replace('.', ',')}%`
                          : ''
                      }
                      style={{
                        fill: resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a',
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed tabular-nums">
            {isEn
              ? 'Illustrative prototype metrics demonstrating how UserActivity (view_book), BookRecommendation (is_clicked, is_borrowed), BorrowRecord (borrow), and UserReadingStats (completion_rate) connect in the telemetry schema (not production user traffic). Before rolling out the 7-day reservation cap and 5k/10k/15k fine tiers, the BA validation plan calls for a 4-week field pilot on 2 bus routes to gather reader/librarian feedback and A/B test threshold sensitivity.'
              : 'Số liệu mô phỏng minh họa cách liên kết 4 bảng Telemetry: UserActivity (view_book) → BookRecommendation (is_clicked, is_borrowed) → BorrowRecord (borrow) → UserReadingStats (completion_rate), không phải dữ liệu vận hành thực tế. Trước khi áp dụng chính thức ngưỡng giữ chỗ 7 ngày và biểu phí phạt 5k/10k/15k, kế hoạch kiểm chứng BA đề xuất chạy pilot 4 tuần trên 2 tuyến xe để khảo sát độc giả, thủ thư và kiểm định độ nhạy thực địa.'}
          </p>
        </div>

        {/* Khối SQL MySQL 8.0 trên Schema thật */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-950 text-slate-100 p-5 sm:p-6 flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#9BE7FA]">
                <Terminal className="w-4 h-4" />
                <span>
                  {isEn
                    ? 'Actual MySQL 8.0 Telemetry Query (transactions + inventory + analytics)'
                    : 'Truy vấn SQL MySQL 8.0 trên tên bảng & cột thật của dự án'}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#9BE7FA]/20 text-[#9BE7FA] text-xs font-mono font-bold">
                  MySQL 8.0
                </span>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? (isEn ? 'Copied' : 'Đã sao chép') : (isEn ? 'Copy SQL' : 'Sao chép SQL')}</span>
                </button>
              </div>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-[13px] font-mono text-slate-200 overflow-x-auto leading-relaxed">
              <code>{ACTUAL_MYSQL_TELEMETRY_SQL}</code>
            </pre>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            {isEn
              ? 'Uses real Django ORM table names: transactions_bookreservation (preferred_pickup_location_id, is_fulfilled, expires_date), inventory_librarybus, and analytics_busanalytics.'
              : 'Truy vấn đúng tên bảng thật do Django ORM sinh ra trên MySQL 8.0: transactions_bookreservation (preferred_pickup_location_id, is_fulfilled, expires_date), inventory_librarybus và analytics_busanalytics.'}
          </div>
        </div>
      </div>

      {/* ACCORDION KIỂM TOÁN MÃ NGUỒN & GHI CHÚ KỸ THUẬT PHỎNG VẤN (4 ĐIỂM CẦN NẮM RÕ) */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-[#C8EEF7]/10 dark:bg-slate-900/50 p-4">
        <button
          type="button"
          onClick={() => setShowCodeAuditAccordion((v) => !v)}
          className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0D7287] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>
              {showCodeAuditAccordion
                ? isEn
                  ? 'Collapse 4 Codebase Audit Notes & MySQL 8.0 Partial Index Caveat'
                  : 'Thu gọn 4 ghi chú kiểm toán mã nguồn & Lưu ý kỹ thuật UniqueConstraint trên MySQL 8.0'
                : isEn
                ? 'View 4 Codebase Audit Notes & Technical Interview Insights (MySQL 8.0 UniqueConstraint condition, borrow_limit, bus_visit)'
                : 'Xem 4 ghi chú kiểm toán mã nguồn & Điểm nhấn kỹ thuật (UniqueConstraint condition trên MySQL 8.0, @property borrow_limit, bus_visit)'}
            </span>
          </span>
          {showCodeAuditAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showCodeAuditAccordion && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300 tabular-nums">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3.5">
              <p className="font-bold text-slate-900 dark:text-white mb-1">
                {isEn ? (
                  <>1. MySQL 8.0 Caveat on <code>UniqueConstraint(condition=Q(...))</code></>
                ) : (
                  <>1. Lưu ý kỹ thuật về <code>UniqueConstraint(condition=Q(...))</code> trên MySQL 8.0</>
                )}
              </p>
              <p>
                {isEn ? (
                  <>
                    In <code>transactions/models.py</code>, <code>unique_active_borrow</code> and <code>unique_active_reservation</code> specify <code>condition=Q(...)</code> (partial unique index). Because Django ignores conditional <code>UniqueConstraint</code> migrations on <strong>MySQL 8.0</strong>, pessimistic <code>select_for_update()</code> locking in <code>TransactionService</code> serves as the primary concurrency guard.
                  </>
                ) : (
                  <>
                    Trong <code>transactions/models.py</code>, hai ràng buộc <code>unique_active_borrow</code> và <code>unique_active_reservation</code> dùng tham số <code>condition=Q(...)</code> (partial unique index). Trên <strong>MySQL 8.0</strong>, Django bỏ qua <code>UniqueConstraint</code> có <code>condition</code> khi migrate. Do đó, khóa bi quan <code>select_for_update()</code> trong <code>TransactionService</code> chính là chốt chặn chính đảm bảo an toàn chống trùng lặp.
                  </>
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3.5">
              <p className="font-bold text-slate-900 dark:text-white mb-1">
                {isEn ? (
                  <>2. Aligning Tiered <code>@property def borrow_limit(self)</code> in <code>users/models.py</code></>
                ) : (
                  <>2. Đồng bộ <code>@property def borrow_limit(self)</code> theo hạng thẻ trong <code>users/models.py</code></>
                )}
              </p>
              <p>
                {isEn ? (
                  <>
                    <code>transactions/services.py</code> checks <code>getattr(user.profile, &apos;borrow_limit&apos;, 5)</code>. Exposing a <code>@property borrow_limit</code> mapped to membership tiers <code>{`{'basic': 3, 'premium': 5, 'vip': 10}`}</code> on <code>Profile</code> aligns runtime quotas with the BA specification.
                  </>
                ) : (
                  <>
                    Trong <code>transactions/services.py</code> kiểm tra <code>getattr(user.profile, &apos;borrow_limit&apos;, 5)</code>. Việc bổ sung thuộc tính <code>@property borrow_limit</code> ánh xạ trực tiếp hạng hội viên <code>{`{'basic': 3, 'premium': 5, 'vip': 10}`}</code> trên model <code>Profile</code> giúp phân tầng hạn mức mượn khớp hoàn toàn với đặc tả BA.
                  </>
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3.5">
              <p className="font-bold text-slate-900 dark:text-white mb-1">
                {isEn ? (
                  <>3. Registering <code>&apos;bus_visit&apos;</code> in <code>UserActivity.activity_type</code></>
                ) : (
                  <>3. Chuẩn hóa danh mục sự kiện <code>&apos;bus_visit&apos;</code> trong <code>UserActivity.activity_type</code></>
                )}
              </p>
              <p>
                {isEn ? (
                  <>
                    The <code>track_bus_visit</code> endpoint in <code>analytics/views.py</code> logs <code>activity_type=&apos;bus_visit&apos;</code> as the denominator for <code>BusAnalytics.efficiency_score</code>; registering <code>&apos;bus_visit&apos;</code> inside <code>UserActivity</code> choices keeps schema validation consistent.
                  </>
                ) : (
                  <>
                    Endpoint <code>track_bus_visit</code> trong <code>analytics/views.py</code> ghi nhận sự kiện <code>activity_type=&apos;bus_visit&apos;</code> để làm mẫu số tính <code>BusAnalytics.efficiency_score</code>; bổ sung <code>&apos;bus_visit&apos;</code> vào danh sách <code>choices</code> của model <code>UserActivity</code> giúp đồng bộ hoàn toàn schema validation.
                  </>
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3.5">
              <p className="font-bold text-slate-900 dark:text-white mb-1">
                {isEn ? (
                  <>4. UTF-8 Vietnamese String Normalization in <code>blog/views.py</code></>
                ) : (
                  <>4. Chuẩn hóa mã hóa chuỗi tiếng Việt UTF-8 trong <code>blog/views.py</code></>
                )}
              </p>
              <p>
                {isEn ? (
                  <>
                    Audited and normalized Vietnamese flash messages and docstrings to consistent UTF-8 encoding across all 7 Django apps prior to running the 171-test CI suite.
                  </>
                ) : (
                  <>
                    Rà soát và chuẩn hóa toàn bộ chuỗi thông báo flash message / docstring tiếng Việt về chuẩn UTF-8 đồng nhất trên cả 7 phân hệ Django trước khi chạy CI pipeline (171 unit tests).
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN DIAGRAM MODAL */}
      {fullscreenChart && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-3 sm:p-5"
          onClick={() => setFullscreenChart(null)}
        >
          <div
            className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl max-w-[96vw] w-full mx-auto mb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {isEn ? fullscreenChart.titleEn : fullscreenChart.titleVi}
              </h4>
              <p className="text-xs text-slate-400">
                {isEn ? fullscreenChart.descEn : fullscreenChart.descVi}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFullscreenChart(null)}
              className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 cursor-pointer flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div
            className="flex-1 max-w-[96vw] w-full mx-auto rounded-2xl overflow-hidden border border-slate-800 bg-white dark:bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`${fullscreenChart.src}&theme=${resolvedTheme}`}
              className="w-full h-full bg-white dark:bg-slate-950"
              title={isEn ? fullscreenChart.titleEn : fullscreenChart.titleVi}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default Chapter4BackendLogic;
