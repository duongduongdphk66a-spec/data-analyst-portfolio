'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Database,
  ExternalLink,
  Layers,
  Maximize2,
  Server,
  ShieldCheck,
  Terminal,
  X,
} from 'lucide-react';
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
        'Thu thập đúng 8 sự kiện cốt lõi MVP (view_book, bus_visit, reserve_created, reserve_fulfilled, borrow, renew, return, fine_applied) kèm JSONField metadata; tự động chuyển bản ghi >90 ngày sang kho lạnh ArchivedUserActivity.',
      descEn:
        'Captures the 8 core MVP events (view_book, bus_visit, reserve_created, reserve_fulfilled, borrow, renew, return, fine_applied) with JSONField metadata; archives records >90 days to cold storage ArchivedUserActivity on the 1st of each month at 02:00.',
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
      techVi: 'borrows_per_visit (uncapped) + normalized popularity_score',
      techEn: 'borrows_per_visit (uncapped) + normalized popularity_score',
      descVi:
        'Tổng hợp chỉ số vận hành theo tuyến: lượt mượn/lượt ghé không chặn trần (borrows_per_visit), tỷ lệ độc giả ghé xe có mượn sách và điểm phổ biến sách chuẩn hóa theo phân vị (khắc phục lỗi trộn đơn vị và lỗi bão hòa trần 100% ở bản mẫu đầu).',
      descEn:
        'Computes route-level KPIs: uncapped borrows_per_visit, borrowing visitor share, and min-max/percentile-normalized book popularity score (fixing unit-mixing and the 100% ceiling saturation bug from the initial prototype).',
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
      routeVi: 'GĐ 2 Mở rộng (Could-Have) → Phễu Gợi ý & Điểm uy tín',
      routeEn: 'Phase 2 Extension (Could-Have) → Recommendation Funnel & Reputation',
      techVi: 'Decoupled from MVP • is_clicked → is_borrowed',
      techEn: 'Decoupled from MVP • is_clicked → is_borrowed',
      descVi:
        'Phân hệ mở rộng GĐ 2 đã dựng mẫu prototype nhưng tách khỏi lõi MVP: theo dõi chuyển đổi is_clicked → is_borrowed cho 5 thuật toán gợi ý và điểm uy tín UserReadingStats (0–1.000đ) để thử nghiệm A/B sau giai đoạn Pilot.',
      descEn:
        'Phase 2 extension prototyped but decoupled from MVP: tracks is_clicked → is_borrowed conversion across 5 recommendation algorithms and UserReadingStats reputation (0–1,000 pts) for post-pilot A/B testing.',
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

// Mô hình thực thể lõi rút gọn (Core Logical ERD — 7 thực thể nghiệp vụ chuẩn hóa + 1 bảng Telemetry)
const CORE_ERD_ENTITIES = [
  {
    entity: 'User & Profile',
    keys: 'PK id (UUID) · tier (basic/premium/vip) · borrow_limit (3/5/10)',
    rel: '1 : * BorrowRecord, BookReservation',
    ruleVi: 'Phân hạng độc giả (basic 3 / premium 5 / vip 10) kiểm soát trần mượn đồng thời (BR-01).',
    ruleEn: 'Reader tiers (basic 3 / premium 5 / vip 10) govern concurrent borrow caps (BR-01).',
  },
  {
    entity: 'LibraryBus & RouteStop',
    keys: 'PK id (UUID) · bus_number · license_plate · scheduled_window',
    rel: '1 : * BusBookInventory, BorrowRecord',
    ruleVi: 'Quản lý đội xe lưu động và lịch điểm dừng công bố (#06/#07), không phụ thuộc GPS phần cứng GĐ 1.',
    ruleEn: 'Manages mobile bus fleet and published stop timetables (#06/#07) without Phase 1 hardware GPS.',
  },
  {
    entity: 'BookTitle',
    keys: 'PK id (UUID) · isbn · title · replacement_price',
    rel: '1 : * BusBookInventory, BookReservation',
    ruleVi: 'Danh mục đầu sách chuẩn hóa 1 lần (ISBN, tác giả, giá thay thế làm trần phạt BR-04).',
    ruleEn: 'Normalized bibliographic title catalog (ISBN, author, replacement_price capping BR-04 fines).',
  },
  {
    entity: 'BusBookInventory',
    keys: 'PK id (UUID) · FK book_title_id · FK bus_id · available_copies',
    rel: '* : 1 BookTitle, LibraryBus · 1 : * BorrowRecord',
    ruleVi: 'Tồn kho bản sao trên từng xe; bị khóa dòng select_for_update() khi mượn cuốn cuối (BR-01).',
    ruleEn: 'Per-bus physical copy inventory; row-locked via select_for_update() on last-copy checkout (BR-01).',
  },
  {
    entity: 'BorrowRecord',
    keys: 'PK id · FK user_id · FK inventory_id · FK pickup_bus_id · status',
    rel: '* : 1 User, BusBookInventory · 1 : * FinePayment',
    ruleVi: 'Lưu borrow_date, due_date, renewal_count (≤2 trong 3 ngày cuối theo BR-03) và cờ trả chéo tuyến (IN_TRANSIT).',
    ruleEn: 'Tracks borrow_date, due_date, renewal_count (≤2 in final 3 days under BR-03), and cross-bus IN_TRANSIT state.',
  },
  {
    entity: 'BookReservation',
    keys: 'PK id · FK user_id · FK book_title_id · FK pickup_bus_id · queue_position',
    rel: '* : 1 User, BookTitle, LibraryBus',
    ruleVi: 'Hàng đợi FIFO giữ chỗ 7 ngày tính từ khi sách về trạm (ready_for_pickup_at), tự đôn lượt khi quá hạn (BR-02).',
    ruleEn: 'FIFO waitlist with 7-day hold starting from stop arrival (ready_for_pickup_at) and auto-promotion on expiry (BR-02).',
  },
  {
    entity: 'FinePayment',
    keys: 'PK id · FK borrow_id · amount · discount_percentage · approved_by',
    rel: '* : 1 BorrowRecord',
    ruleVi: 'Phí phạt 3 bậc (5k/10k/15k), áp trần 100% replacement_price và bắt buộc ghi vết miễn giảm (BR-04).',
    ruleEn: '3-tier overdue fine (5k/10k/15k) capped at 100% replacement_price with mandatory waiver audit log (BR-04).',
  },
  {
    entity: 'UserActivity (Telemetry)',
    keys: 'PK id · FK user_id · activity_type (8 MVP events) · metadata (JSON)',
    rel: '* : 1 User → ArchivedUserActivity (>90d)',
    ruleVi: 'Ghi nhận đúng 8 sự kiện hành vi lõi MVP, nạp DailyStats và chuyển kho lạnh sau 90 ngày.',
    ruleEn: 'Logs the 8 core MVP behavioral events, feeds DailyStats rollups, and cold-archives after 90 days.',
  },
];

// Kế hoạch Tracking 8 sự kiện sản phẩm cốt lõi (đồng bộ 100% với UserActivity.activity_type)
const TRACKING_PLAN_ROWS = [
  {
    event: 'view_book',
    screen: '#03 Kho sách / #04 Chi tiết',
    props: 'book_title_id, bus_id, category, available_copies',
    kpiVi: 'Tỷ lệ xem sách hết hàng (Stockout View Rate)',
    kpiEn: 'Stockout View Rate at discovery',
    pilotVi: 'Phát hiện đầu sách thiếu bản theo từng tuyến để điều chuyển kho.',
    pilotEn: 'Detects stockout titles per route to guide copy rebalancing.',
  },
  {
    event: 'bus_visit',
    screen: '#06 Đội xe / #09 Quầy trạm',
    props: 'bus_id, stop_id, visit_source (qr_checkin / portal)',
    kpiVi: 'Lượt mượn / lượt ghé không chặn trần (borrows_per_visit)',
    kpiEn: 'Uncapped Borrows per Visit & Borrowing Visitor Share',
    pilotVi: 'Làm mẫu số sạch thay cho công thức min(..., 100) bị bão hòa trần.',
    pilotEn: 'Provides an uncapped denominator replacing the saturated min(..., 100) metric.',
  },
  {
    event: 'reserve_created / reserve_fulfilled',
    screen: '#04 Chi tiết / #07 Lộ trình / #09 Quầy',
    props: 'reservation_id, bus_id, queue_position, wait_days, expired_flag',
    kpiVi: 'Tỷ lệ nhận đặt trước đủ 7 ngày chín (Matured Pickup Rate)',
    kpiEn: 'Matured 7-Day Reservation Pickup Rate',
    pilotVi: 'Hiệu chỉnh cửa sổ giữ chỗ 7 ngày sau 4 tuần chạy thực tế trên 2 tuyến.',
    pilotEn: 'Calibrates the 7-day hold window across 2 pilot routes over 4 weeks.',
  },
  {
    event: 'borrow / renew',
    screen: '#04 Chi tiết / #08 Hồ sơ / #09 Quầy',
    props: 'borrow_id, inventory_id, pickup_bus_id, user_tier, renewal_count, offline_sync_flag',
    kpiVi: 'Lỗi đặt trùng bản cuối (= 0%) & Sách/độc giả/30 ngày',
    kpiEn: 'Last-Copy Double-Booking Rate (= 0%) & Books/Reader/30d',
    pilotVi: 'Đối soát tồn kho thực tế cuối ca và tỷ lệ xung đột đồng bộ ngoại tuyến.',
    pilotEn: 'Reconciles physical shelf stock at shift end and monitors offline sync conflicts.',
  },
  {
    event: 'return / fine_applied',
    screen: '#09 Quản lý mượn trả / #11 Admin',
    props: 'borrow_id, return_bus_id, is_cross_bus, days_overdue, fine_tier, discount_percentage',
    kpiVi: 'Tỷ lệ trả đúng hạn (On-Time Return Rate) & Tỷ lệ miễn giảm phạt',
    kpiEn: 'On-Time Return Rate & Waiver Audit Share',
    pilotVi: 'Kiểm định độ nhạy hành vi trả sách trước khi áp dụng đại trà biểu phí 3 bậc.',
    pilotEn: 'Tests return compliance sensitivity before rolling out 3-tier fines network-wide.',
  },
];

// Khung ra quyết định cho Pilot 4 tuần (2 tuyến xe lưu động)
const PILOT_DECISION_RULES = [
  {
    metricVi: 'Lỗi đặt trùng bản cuối (Double-Booking)',
    metricEn: 'Last-Copy Double-Booking Rate',
    target: '0%',
    actionVi: 'Nếu > 0%: tạm dừng mở rộng, kiểm toán khóa select_for_update() và luồng đồng bộ offline.',
    actionEn: 'If > 0%: halt rollout, audit select_for_update() locks and offline sync conflict logs.',
  },
  {
    metricVi: 'Tỷ lệ nhận sách đặt trước (cohort đủ 7 ngày chín)',
    metricEn: 'Matured 7-Day Reservation Pickup Rate',
    target: '≥ 70%',
    actionVi: 'Nếu tỷ lệ bỏ hẹn quá hạn > 25%: rút cửa sổ giữ chỗ từ 7 ngày xuống 4 ngày và thêm nhắc lịch trước 24h.',
    actionEn: 'If expired hold share > 25%: tighten hold window from 7 days to 4 days and add 24h reminders.',
  },
  {
    metricVi: 'Tỷ lệ trả sách đúng hạn (On-Time Return)',
    metricEn: 'On-Time Return Rate',
    target: '≥ 80%',
    actionVi: 'Nếu < 70% hoặc tỷ lệ miễn giảm > 30%: rà lại mức phạt 5k/10k/15k và đẩy lịch nhắc sớm trước 3 ngày.',
    actionEn: 'If < 70% or waiver share > 30%: recalibrate 5k/10k/15k fine tiers and send reminders 3 days early.',
  },
  {
    metricVi: 'Tỷ lệ xem sách hết hàng (Stockout View Rate)',
    metricEn: 'Stockout View Rate per Route',
    target: '< 15%',
    actionVi: 'Nếu > 20% tại 1 tuyến trong 2 tuần liên tiếp: điều chuyển bản sao từ tuyến dư tồn hoặc bổ sung nhập sách.',
    actionEn: 'If > 20% on a route for 2 consecutive weeks: rebalance copies from low-utilization buses or procure stock.',
  },
  {
    metricVi: 'Tỷ lệ xung đột đồng bộ ngoại tuyến tại trạm',
    metricEn: 'Offline Counter Sync Conflict Rate',
    target: '< 1%',
    actionVi: 'Nếu ≥ 1%: chỉ cho phép quét trả sách khi mất mạng; yêu cầu xác nhận trực tuyến khi mượn sách còn ≤ 2 bản.',
    actionEn: 'If ≥ 1%: restrict offline queue to returns only; require live confirmation when stock ≤ 2 copies.',
  },
];

const ACTUAL_MYSQL_TELEMETRY_SQL = `-- Truy vấn MySQL 8.0 đồng bộ khung 30 ngày:
-- (1) Lọc cohort đặt trước đã "chín" đủ 7 ngày (tránh right-censoring bias các phiếu mới tạo <7 ngày)
-- (2) Dùng LEFT JOIN từ toàn đội xe (tránh survivorship bias)
-- (3) Tính borrows_per_visit không chặn trần thay cho min((borrows/visits)*100, 100)
WITH matured_res_30d AS (
  SELECT
    preferred_pickup_location_id AS bus_id,
    COUNT(*) AS matured_reservations_30d,
    SUM(CASE WHEN is_fulfilled = 1 THEN 1 ELSE 0 END) AS fulfilled_30d,
    SUM(CASE WHEN is_fulfilled = 0 AND expires_date < UTC_TIMESTAMP() THEN 1 ELSE 0 END) AS expired_holds_30d
  FROM transactions_bookreservation
  WHERE is_deleted = 0
    AND reserved_date >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 37 DAY)
    AND reserved_date <= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 7 DAY)
  GROUP BY preferred_pickup_location_id
),
borrow_30d AS (
  SELECT
    pickup_bus_id AS bus_id,
    COUNT(*) AS borrows_30d,
    COUNT(DISTINCT user_id) AS active_readers_30d
  FROM transactions_borrowrecord
  WHERE is_deleted = 0
    AND borrow_date >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY)
  GROUP BY pickup_bus_id
),
visit_30d AS (
  SELECT
    JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.bus_id')) AS bus_id,
    COUNT(*) AS bus_visits_30d
  FROM analytics_useractivity
  WHERE activity_type = 'bus_visit'
    AND created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY)
  GROUP BY JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.bus_id'))
)
SELECT
  b.bus_number,
  b.license_plate,
  COALESCE(r.matured_reservations_30d, 0) AS matured_reservations_30d,
  COALESCE(r.fulfilled_30d, 0) AS fulfilled_30d,
  COALESCE(r.expired_holds_30d, 0) AS expired_holds_30d,
  ROUND(COALESCE(r.fulfilled_30d, 0) * 100.0 / NULLIF(r.matured_reservations_30d, 0), 2) AS matured_pickup_rate_pct,
  COALESCE(br.borrows_30d, 0) AS borrows_30d,
  COALESCE(v.bus_visits_30d, 0) AS bus_visits_30d,
  ROUND(COALESCE(br.borrows_30d, 0) / NULLIF(v.bus_visits_30d, 0), 2) AS borrows_per_visit,
  ROUND(COALESCE(br.borrows_30d, 0) / NULLIF(br.active_readers_30d, 0), 2) AS avg_books_per_reader_30d
FROM inventory_librarybus b
LEFT JOIN matured_res_30d r ON r.bus_id = b.id
LEFT JOIN borrow_30d br ON br.bus_id = b.id
LEFT JOIN visit_30d v ON v.bus_id = b.id
WHERE b.is_deleted = 0
ORDER BY matured_pickup_rate_pct DESC, borrows_30d DESC;`;

const CORE_DATA_DICTIONARY = [
  { field: 'available_copies', table: 'BusBookInventory', type: 'INT UNSIGNED', constraint: 'CHECK >= 0 · Row Lock', descVi: 'Số bản sao vật lý còn trên xe; khóa dòng select_for_update() khi mượn cuốn cuối (BR-01).', descEn: 'Physical copies remaining on a bus; row-locked via select_for_update() on last-copy checkout (BR-01).' },
  { field: 'borrow_limit', table: 'User / Profile', type: 'TINYINT', constraint: 'ENUM (3, 5, 10)', descVi: 'Trần sách đang mượn theo hạng thẻ (basic 3 / premium 5 / vip 10).', descEn: 'Active loan ceiling by tier (basic 3 / premium 5 / vip 10).' },
  { field: 'replacement_price', table: 'BookTitle', type: 'DECIMAL(10,0)', constraint: 'NOT NULL > 0', descVi: 'Giá bìa thay thế sách dùng làm trần phạt tối đa 100% (BR-04).', descEn: 'Book replacement value enforcing the hard 100% overdue fine cap (BR-04).' },
  { field: 'queue_position', table: 'BookReservation', type: 'SMALLINT', constraint: 'UNIQUE active/title', descVi: 'Thứ tự xếp hàng FIFO, tự động giảm nguyên tử bằng F("queue_position") - 1 (BR-02).', descEn: 'FIFO queue rank decremented atomically via F("queue_position") - 1 (BR-02).' },
  { field: 'ready_for_pickup_at', table: 'BookReservation', type: 'DATETIME (UTC)', constraint: 'Nullable until arrived', descVi: 'Mốc bắt đầu đếm cửa sổ giữ chỗ 7 ngày khi sách về tới điểm dừng đăng ký.', descEn: 'Timestamp starting the 7-day hold clock once the book arrives at the pickup stop.' },
  { field: 'renewal_count', table: 'BorrowRecord', type: 'TINYINT', constraint: 'CHECK <= 2', descVi: 'Số lần gia hạn (+14 ngày/lần); chỉ cho mở trong 3 ngày cuối trước due_date (BR-03).', descEn: 'Renewal count (+14d each); allowed only within final 3 days before due_date (BR-03).' },
  { field: 'status', table: 'BorrowRecord', type: 'VARCHAR(20)', constraint: 'ACTIVE/RETURNED/IN_TRANSIT', descVi: 'Trạng thái vòng đời phiếu; IN_TRANSIT đánh dấu sách trả chéo tuyến chờ xe ca đêm.', descEn: 'Loan lifecycle state; IN_TRANSIT flags cross-bus returns awaiting nightly depot transfer.' },
  { field: 'discount_percentage', table: 'FinePayment', type: 'DECIMAL(5,2)', constraint: '0–100 · AuditMixin', descVi: 'Tỷ lệ miễn giảm phạt: ≤50% thủ thư duyệt, >50% bắt buộc Ban QLDA phê duyệt.', descEn: 'Fine waiver rate: ≤50% stop librarian, >50% requires PM approval with logged reason.' },
  { field: 'activity_type', table: 'UserActivity', type: 'VARCHAR(32)', constraint: 'INDEX · 8 MVP Events', descVi: 'Loại sự kiện chuẩn hóa (view_book, bus_visit, reserve_*, borrow, renew, return, fine_applied).', descEn: 'Standardized event taxonomy (view_book, bus_visit, reserve_*, borrow, renew, return, fine_applied).' },
];

export function Chapter4BackendLogic({
  isEn = false,
}: Chapter4BackendLogicProps) {
  const { resolvedTheme } = useTheme();
  const [showDataDictionary, setShowDataDictionary] = useState(false);
  const [showPrototypeAppendix, setShowPrototypeAppendix] = useState(false);
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

  // Interactive Controls for the 2 Backend Architecture Diagrams (show 1 at a time by default)
  const [activeTab, setActiveTab] = useState<'workflow' | 'dataflow'>('workflow');
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

  const iframeHeightClass = 'h-[300px] sm:h-[400px] lg:h-[480px]';

  return (
    <section id="chapter-4-backend" className="space-y-5 scroll-mt-28">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {isEn
            ? 'Core 7-Entity ERD, Event Tracking Plan & Flow Diagrams'
            : 'Mô hình Dữ liệu Lõi (ERD), Tracking Plan & Lưu đồ Luồng'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          {isEn
            ? 'Core relational model, 8-event Tracking Plan with 4-week pilot criteria, and interactive flow switcher. Backend prototype implementation details are tucked in the appendix below.'
            : 'Lược đồ 7 thực thể lõi, Tracking Plan 8 sự kiện cho pilot 4 tuần và sơ đồ luồng tương tác. Chi tiết triển khai prototype (Django, Redis, Celery, SQL) được gom vào phụ lục kỹ thuật bên dưới.'}
        </p>
      </div>

      {/* BẢNG MÔ HÌNH DỮ LIỆU LÕI (CORE LOGICAL ERD - 7 THỰC THỂ NGHIỆP VỤ + TELEMETRY) */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {isEn
                  ? 'Core Logical ERD (7 Normalized Business Entities + Telemetry)'
                  : 'Lược đồ Dữ liệu Lõi (7 Thực thể Nghiệp vụ chuẩn hóa + Bảng Telemetry)'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Extracted from the 36-model Django prototype (decoupling auth, notifications, blog, and Phase 2 gamification). BookTitle (1) → BusBookInventory (*) prevents duplicate bibliographic rows across buses.'
                : 'Tách lọc từ bản mẫu 36 models Django (bỏ nhóm auth, thông báo, blog và gamification GĐ 2). Tách BookTitle (1) → BusBookInventory (*) tránh trùng dữ liệu thư mục giữa các xe.'}
            </p>
          </div>
          <span className="text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA] tabular-nums">
            UUIDv4 • SoftDelete • AuditMixin
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-2 pr-3 font-semibold">{isEn ? 'Entity' : 'Thực thể'}</th>
                <th className="py-2 px-2 font-semibold">{isEn ? 'Primary / Foreign Keys' : 'Khóa chính & Ngoại'}</th>
                <th className="py-2 px-2 font-semibold">{isEn ? 'Cardinality' : 'Quan hệ'}</th>
                <th className="py-2 pl-2 font-semibold">{isEn ? 'Governing Business Rule' : 'Vai trò & Ràng buộc'}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/70">
              {CORE_ERD_ENTITIES.map((row) => (
                <tr key={row.entity}>
                  <td className="py-2 pr-3 font-mono font-bold text-[#074553] dark:text-[#9BE7FA] whitespace-nowrap">
                    {row.entity}
                  </td>
                  <td className="py-2 px-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    {row.keys}
                  </td>
                  <td className="py-2 px-2 font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {row.rel}
                  </td>
                  <td className="py-2 pl-2 leading-relaxed">
                    {isEn ? row.ruleEn : row.ruleVi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Collapsible Core Data Dictionary (9 Critical Attributes) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <button
            type="button"
            onClick={() => setShowDataDictionary((v) => !v)}
            className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0D7287] flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>
              {showDataDictionary
                ? isEn
                  ? 'Collapse Core Data Dictionary (9 Critical Attributes & Constraints)'
                  : 'Thu gọn Từ điển Dữ liệu (Data Dictionary — 9 trường ràng buộc cốt lõi)'
                : isEn
                ? 'Inspect Core Data Dictionary (9 Critical Fields, Types & Business Rules)'
                : 'Xem Từ điển Dữ liệu (Data Dictionary — 9 trường cốt lõi, kiểu dữ liệu & ràng buộc)'}
            </span>
            {showDataDictionary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDataDictionary && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2 pr-3 font-semibold">{isEn ? 'Field' : 'Trường dữ liệu'}</th>
                    <th className="py-2 px-2 font-semibold">{isEn ? 'Entity' : 'Bảng'}</th>
                    <th className="py-2 px-2 font-semibold">{isEn ? 'SQL Type' : 'Kiểu dữ liệu'}</th>
                    <th className="py-2 px-2 font-semibold">{isEn ? 'Constraint' : 'Ràng buộc'}</th>
                    <th className="py-2 pl-2 font-semibold">{isEn ? 'Business Definition' : 'Ý nghĩa nghiệp vụ'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                  {CORE_DATA_DICTIONARY.map((d) => (
                    <tr key={`${d.table}-${d.field}`}>
                      <td className="py-2 pr-3 font-mono font-bold text-[#074553] dark:text-[#9BE7FA] whitespace-nowrap">{d.field}</td>
                      <td className="py-2 px-2 font-mono text-[11px] whitespace-nowrap">{d.table}</td>
                      <td className="py-2 px-2 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">{d.type}</td>
                      <td className="py-2 px-2 font-mono text-[11px] text-amber-800 dark:text-[#FFE485] whitespace-nowrap">{d.constraint}</td>
                      <td className="py-2 pl-2 leading-relaxed">{isEn ? d.descEn : d.descVi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* KẾ HOẠCH TRACKING SẢN PHẨM (PRODUCT TELEMETRY TRACKING PLAN) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {isEn
              ? 'Product Telemetry Tracking Plan & 4-Week Pilot (No Fabricated Traffic)'
              : 'Kế hoạch Tracking Sự kiện (Tracking Plan) & Thí điểm 4 tuần'}
          </h3>
          <span className="px-2.5 py-0.5 rounded-md bg-[#FFE485]/60 dark:bg-[#FFD14C]/15 border border-[#FFD14C]/50 text-xs font-bold text-amber-950 dark:text-[#FFE485]">
            {isEn ? 'Pre-Launch Spec · 2-Route Pilot' : 'Trước Go-Live · Pilot 2 tuyến'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-2 pr-3 font-semibold">{isEn ? 'Event Name' : 'Sự kiện'}</th>
                <th className="py-2 px-2 font-semibold">{isEn ? 'Trigger Screen' : 'Màn hình'}</th>
                <th className="py-2 px-2 font-semibold">{isEn ? 'Payload Properties' : 'Thuộc tính'}</th>
                <th className="py-2 px-2 font-semibold">{isEn ? 'Target KPI' : 'KPI đo lường'}</th>
                <th className="py-2 pl-2 font-semibold">{isEn ? '4-Week Pilot Goal' : 'Mục tiêu Pilot'}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/70">
              {TRACKING_PLAN_ROWS.map((row) => (
                <tr key={row.event}>
                  <td className="py-2 pr-3 font-mono font-bold text-[#074553] dark:text-[#9BE7FA] whitespace-nowrap">
                    {row.event}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap text-slate-600 dark:text-slate-400">
                    {row.screen}
                  </td>
                  <td className="py-2 px-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    {row.props}
                  </td>
                  <td className="py-2 px-2 font-semibold text-slate-900 dark:text-white">
                    {isEn ? row.kpiEn : row.kpiVi}
                  </td>
                  <td className="py-2 pl-2 leading-relaxed">
                    {isEn ? row.pilotEn : row.pilotVi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {isEn
            ? 'Schema alignment: All 8 MVP event names (view_book, bus_visit, reserve_created, reserve_fulfilled, borrow, renew, return, fine_applied) map 1:1 to UserActivity.activity_type. Phase 2 events (recommendation_clicked, reputation_gained) are isolated from MVP pilot reporting.'
            : 'Đồng bộ lược đồ: Đủ 8 tên sự kiện lõi MVP (view_book, bus_visit, reserve_created, reserve_fulfilled, borrow, renew, return, fine_applied) khớp 1:1 với UserActivity.activity_type. Sự kiện GĐ 2 (recommendation_clicked, reputation_gained) được tách khỏi báo cáo Pilot.'}
        </p>

        {/* KHUNG RA QUYẾT ĐỊNH PILOT 4 TUẦN (2 TUYẾN XE) */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {isEn
                ? '4-Week Pilot Decision Rules (2 Mobile Routes — Keep vs. Adjust Thresholds)'
                : 'Khung ra quyết định sau Pilot 4 tuần (2 tuyến xe — Ngưỡng giữ nguyên vs. điều chỉnh)'}
            </p>
            <span className="text-[11px] font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
              {isEn ? 'Actionable Go / Tune Criteria' : 'Tiêu chí Go-Live & Hiệu chỉnh'}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2 pr-3 font-semibold">{isEn ? 'Pilot Metric' : 'Chỉ số Pilot'}</th>
                  <th className="py-2 px-2 font-semibold whitespace-nowrap">{isEn ? 'Target / Keep' : 'Ngưỡng đạt'}</th>
                  <th className="py-2 pl-2 font-semibold">{isEn ? 'Decision Action if Breached' : 'Hành động điều chỉnh khi lệch ngưỡng'}</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/70">
                {PILOT_DECISION_RULES.map((rule) => (
                  <tr key={rule.metricEn}>
                    <td className="py-2 pr-3 font-semibold text-slate-900 dark:text-white">
                      {isEn ? rule.metricEn : rule.metricVi}
                    </td>
                    <td className="py-2 px-2 font-mono font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                      {rule.target}
                    </td>
                    <td className="py-2 pl-2 leading-relaxed">
                      {isEn ? rule.actionEn : rule.actionVi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BỘ CHUYỂN ĐỔI 1 SƠ ĐỒ / LẦN (WORKFLOW HOẶC TELEMETRY) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {isEn
                ? 'Interactive System Flow Diagrams (Switch View)'
                : 'Sơ đồ Luồng Hệ thống Tương tác (Chọn 1 luồng để xem)'}
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('workflow')}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'workflow'
                  ? 'bg-white dark:bg-slate-900 text-[#074553] dark:text-[#9BE7FA]'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {isEn ? '2.1 Borrow Workflow (ACID)' : '2.1 Luồng Mượn–Trả (ACID)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dataflow')}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'dataflow'
                  ? 'bg-white dark:bg-slate-900 text-[#074553] dark:text-[#9BE7FA]'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {isEn ? '2.2 Telemetry Dataflow' : '2.2 Luồng Telemetry'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {/* BIỂU ĐỒ BACKEND 1: BORROWING WORKFLOW & RACE CONDITION PREVENTION */}
          {activeTab === 'workflow' && (
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
          {activeTab === 'dataflow' && (
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

      {/* PHỤ LỤC KỸ THUẬT PROTOTYPE (ĐÓNG MẶC ĐỊNH: KIẾN TRÚC 5 TẦNG, 4 CÔNG THỨC ANALYTICS, 9 CELERY JOBS & SQL MYSQL 8.0) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4">
        <button
          type="button"
          onClick={() => setShowPrototypeAppendix((v) => !v)}
          className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0D7287] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2 text-left">
            <Server className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0" />
            <span>
              {showPrototypeAppendix
                ? isEn
                  ? 'Collapse Technical Prototype Appendix (5-Layer Stack, 4 Telemetry Formulas, 9 Celery Cron Jobs & MySQL SQL)'
                  : 'Thu gọn Phụ lục Kỹ thuật Prototype (Kiến trúc 5 tầng, 4 công thức Analytics, 9 Celery Job & SQL MySQL 8.0)'
                : isEn
                ? 'Open Technical Prototype Appendix: 5-Layer Django/Redis Stack, 4 Analytics Formulas, 9 Celery Jobs & MySQL 8.0 SQL'
                : 'Mở Phụ lục Kỹ thuật Prototype: Kiến trúc 5 tầng Django/Redis, 4 công thức Analytics, 9 Celery Beat Jobs & Truy vấn SQL MySQL 8.0'}
            </span>
          </span>
          {showPrototypeAppendix ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
        </button>

        {showPrototypeAppendix && (
          <div className="space-y-5 pt-4">
            {/* Kiến trúc 5 lớp & 4 công thức Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs tabular-nums">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span>{isEn ? '5-Layer Stack (7 Apps • 36 Models)' : 'Kiến trúc 5 lớp (7 Apps • 36 Models)'}</span>
                  </p>
                  <span className="font-mono text-[11px] text-slate-500">Django 5.2 • MySQL 8.0 • Redis 7</span>
                </div>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn ? (
                    <>
                      <li><strong>Apps:</strong> <code>users</code>, <code>inventory</code>, <code>transactions</code>, <code>analytics</code>, <code>notifications</code>, <code>blog</code>, <code>core</code> (97 templates + Phase 2 Gemini AI ISBN autofill).</li>
                      <li><strong>Service Layer:</strong> <code>select_for_update()</code> inside <code>transaction.atomic()</code> locks User then BusBookInventory by ascending UUID to prevent TOCTOU/deadlocks.</li>
                      <li><strong>Base Mixins:</strong> All 36 models inherit <code>TimestampedModel</code> (UUIDv4), <code>SoftDeleteModel</code>, and <code>AuditMixin</code>.</li>
                      <li><strong>Cache &amp; Async:</strong> Versioned Redis 7 <code>CacheMixin</code> and 9 scheduled Celery Beat jobs (5 Docker Compose services).</li>
                    </>
                  ) : (
                    <>
                      <li><strong>Apps:</strong> <code>users</code>, <code>inventory</code>, <code>transactions</code>, <code>analytics</code>, <code>notifications</code>, <code>blog</code>, <code>core</code> (97 templates + trích xuất ISBN Gemini AI ở GĐ 2).</li>
                      <li><strong>Service Layer:</strong> <code>select_for_update()</code> trong <code>transaction.atomic()</code> khóa User rồi BusBookInventory theo UUID tăng dần chống TOCTOU/Deadlock.</li>
                      <li><strong>Base Mixins:</strong> Toàn bộ 36 model kế thừa <code>TimestampedModel</code> (UUIDv4), <code>SoftDeleteModel</code> và <code>AuditMixin</code>.</li>
                      <li><strong>Cache &amp; Async:</strong> <code>CacheMixin</code> versioning trên Redis 7 và 9 lịch chạy Celery Beat (5 container Docker Compose).</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span>{isEn ? '4 Telemetry Audit Notes (analytics/models.py)' : '4 Kiểm toán Công thức Telemetry (analytics/models.py)'}</span>
                  </p>
                </div>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isEn ? (
                    <>
                      <li><strong>Event Archive:</strong> 8 core MVP events (<code>view_book</code>, <code>bus_visit</code>, <code>reserve_created</code>, <code>reserve_fulfilled</code>, <code>borrow</code>, <code>renew</code>, <code>return</code>, <code>fine_applied</code>) archived to <code>ArchivedUserActivity</code> after 90 days.</li>
                      <li><strong>Popularity (Audit):</strong> Initial prototype summed raw counts (<code>0.60×borrow + 0.30×rating + 0.10×view</code>); production spec normalizes each input via min-max/percentile scaling before weighting.</li>
                      <li><strong>Bus Efficiency (Audit):</strong> Prototype used <code>min((borrows/visits)×100, 100)</code> which saturates at 100% when 1 visitor borrows &gt;1 book; replaced with uncapped <code>borrows_per_visit</code> and borrowing visitor share.</li>
                      <li><strong>Phase 2 Recs &amp; Tiers:</strong> <code>is_clicked → is_borrowed</code> funnel and 0–1,000 reputation tiers are prototyped but decoupled from MVP pilot KPIs.</li>
                    </>
                  ) : (
                    <>
                      <li><strong>Event Archive:</strong> 8 sự kiện lõi MVP (<code>view_book</code>, <code>bus_visit</code>, <code>reserve_created</code>, <code>reserve_fulfilled</code>, <code>borrow</code>, <code>renew</code>, <code>return</code>, <code>fine_applied</code>) chuyển kho lạnh <code>ArchivedUserActivity</code> sau 90 ngày.</li>
                      <li><strong>Popularity (Kiểm toán):</strong> Bản mẫu cộng thẳng biến khác đơn vị (<code>0,60×borrow + 0,30×rating + 0,10×view</code>); bản vận hành chuẩn hóa min-max/phân vị từng thành phần trước khi ghép trọng số.</li>
                      <li><strong>Bus Efficiency (Kiểm toán):</strong> Bản mẫu dùng <code>min((borrows/visits)×100, 100)</code> dễ chạm trần 100% khi 1 khách mượn nhiều cuốn; thay bằng <code>borrows_per_visit</code> không chặn trần và tỷ lệ khách ghé có mượn.</li>
                      <li><strong>GĐ 2 mở rộng:</strong> Phễu gợi ý <code>is_clicked → is_borrowed</code> và điểm uy tín 0–1.000đ tách khỏi bộ KPI lõi của Pilot GĐ 1.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Trục thời gian 9 Celery Beat Jobs */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  <span>{isEn ? '9 Scheduled Celery Beat Jobs (24h)' : '9 Tác vụ tự động Celery Beat (24 giờ)'}</span>
                </p>
                <span className="text-[11px] font-mono text-slate-500">CELERY_BEAT_SCHEDULE</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 tabular-nums text-xs">
                {CELERY_24H_TIMELINE.map((job) => (
                  <div
                    key={job.taskName}
                    className="rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-bold text-[11px]">
                        {job.time}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">{job.module}</span>
                    </div>
                    <p className="font-mono text-[11px] font-bold text-[#0D7287] dark:text-[#9BE7FA] break-words">
                      {job.taskName}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-snug">
                      {isEn ? job.labelEn : job.labelVi}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Khối SQL MySQL 8.0 trên Schema thật */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 text-slate-100 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-xs font-bold text-[#9BE7FA]">
                  <Terminal className="w-4 h-4" />
                  <span>
                    {isEn
                      ? 'Actual MySQL 8.0 30-Day Telemetry Query (Aligned CTEs + LEFT JOIN)'
                      : 'Truy vấn SQL MySQL 8.0 đối soát khung 30 ngày (CTE đồng bộ + LEFT JOIN)'}
                  </span>
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
              <pre className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{ACTUAL_MYSQL_TELEMETRY_SQL}</code>
              </pre>
            </div>
          </div>
        )}
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
