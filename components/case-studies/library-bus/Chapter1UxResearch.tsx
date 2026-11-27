'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Cpu,
  Download,
  FileText,
  GitBranch,
  Lock,
  Users,
  Workflow,
} from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface Chapter1UxResearchProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

const BA_BUSINESS_RULES = [
  {
    code: 'BR-01',
    titleVi: 'Hạn mức mượn theo hạng & Chống tranh chấp tồn kho (TOCTOU)',
    titleEn: 'Tiered Borrow Quota & Concurrent Inventory Locking (TOCTOU Prevention)',
    ruleVi:
      'Hạn mượn chuẩn tại xe là 14 ngày (giao tận nơi nằm ngoài phạm vi GĐ 1). Hạn mức phân theo 3 hạng thẻ: basic (3 cuốn, mặc định), premium (5 cuốn, nâng hạng sau 5 lượt trả đúng hạn) và vip (10 cuốn, sau 15 lượt trả đúng hạn không nợ phạt).',
    ruleEn:
      'Standard stop-pickup loan duration is 14 days (home delivery is out of Phase 1 scope). Active caps follow 3 reader tiers: basic (3 books, default), premium (5 books, after 5 on-time returns), and vip (10 books, after 15 clean on-time returns).',
    exceptionVi:
      'Chặn tạo phiếu mới nếu độc giả chạm trần hạn mức đang mượn, đang có phiếu quá hạn hoặc nợ phạt chưa thanh toán, hoặc tồn kho cuốn sách trên xe đã về 0.',
    exceptionEn:
      'Blocks new borrows if the reader hits the active loan cap, holds an overdue loan or unpaid fine, or bus-level available_copies reaches 0.',
    techVi:
      'Khóa bi quan select_for_update() theo thứ tự cố định (User trước, sau đó BusBookInventory theo UUID tăng dần) bên trong transaction.atomic() (transactions/services.py) để chặn TOCTOU và Deadlock trên MySQL 8.0.',
    techEn:
      'Pessimistic select_for_update() row lock with deterministic lock ordering (User first, then BusBookInventory by ascending UUID) inside transaction.atomic() (transactions/services.py) to prevent concurrent TOCTOU double-booking and MySQL 8.0 deadlocks.',
    screenId: '4',
    screenLabelVi: '#04 Chi tiết sách (/inventory/books/<uuid>/)',
    screenLabelEn: '#04 Book Detail (/inventory/books/<uuid>/)',
  },
  {
    code: 'BR-02',
    titleVi: 'Hàng đợi Đặt trước FIFO & Cửa sổ nhận sách 7 ngày tại trạm',
    titleEn: 'FIFO Reservation Queue & Stop-Aligned 7-Day Pickup Window',
    ruleVi:
      'Chỉ mở đặt trước khi sách hết bản trên tuyến chọn (available_copies = 0); mỗi độc giả giữ tối đa 1 lượt đặt chưa hoàn tất cho cùng 1 đầu sách. Cửa sổ giữ chỗ 7 ngày bắt đầu tính từ khi sách về xe và gửi thông báo sẵn sàng nhận tại trạm.',
    ruleEn:
      'Reservations open only when route stock reaches 0; each reader can hold at most 1 active reservation per title. The 7-day hold window starts when the copy arrives at the chosen stop and the ready-for-pickup alert is sent.',
    exceptionVi:
      'Quá 7 ngày không nhận tại điểm dừng đăng ký, hệ thống tự hủy và đôn người kế tiếp. Nếu xe hủy chuyến do thời tiết hoặc bảo trì, hạn giữ chỗ tự động cộng bù đến chuyến kế tiếp.',
    exceptionEn:
      'Unclaimed holds auto-expire after 7 days and promote the next reader. If a bus cancels a stop due to weather or maintenance, the pickup expiry auto-extends to the next scheduled trip.',
    techVi:
      'Tự động cấp queue_position và dồn hàng đợi nguyên tử bằng F(\'queue_position\') - 1 khi hoàn tất/hủy; Celery Beat quét giữ chỗ quá hạn mỗi 30 phút.',
    techEn:
      'Auto-assigns queue_position and shifts the queue atomically via F(\'queue_position\') - 1 on fulfillment/cancellation; Celery Beat scans expired holds every 30 minutes.',
    screenId: '7',
    screenLabelVi: '#07 Lộ trình & Trạm đón (/inventory/routes/<uuid>/)',
    screenLabelEn: '#07 Route & Pickup Stop (/inventory/routes/<uuid>/)',
  },
  {
    code: 'BR-03',
    titleVi: 'Cổng điều kiện Gia hạn phiếu mượn (Renewal Gate)',
    titleEn: 'Loan Renewal Eligibility Gate (Renewal Gate)',
    ruleVi:
      'Cho phép độc giả gia hạn thêm +14 ngày cho mỗi lần, tối đa 2 lần/phiếu (renewal_count < 2). Chỉ mở nút Gia hạn trong 3 ngày cuối trước due_date để tránh gia hạn dồn ngay ngày đầu thành 42 ngày.',
    ruleEn:
      'Allows +14 days per renewal, capped at 2 renewals per loan (renewal_count < 2). Renewal opens only within the final 3 days before due_date to prevent Day-1 double-renewal to 42 days.',
    exceptionVi:
      'Chặn cứng nếu phiếu hiện tại đã quá hạn, độc giả đang có nợ phạt quá hạn ở bất kỳ phiếu nào khác, HOẶC đầu sách đó đang có người xếp hàng đặt trước.',
    exceptionEn:
      'Hard block if the current loan is overdue, the reader carries unpaid overdue fines on any other loan, OR another reader is waiting in the reservation queue.',
    techVi:
      'Kiểm tra nguyên tử trong TransactionService.renew_book(); ghi vết AuditMixin và xóa cache phiên bản Redis (CacheMixin) sau khi cập nhật due_date.',
    techEn:
      'Validated atomically in TransactionService.renew_book(); writes AuditMixin trace and invalidates versioned Redis cache (CacheMixin) upon updating due_date.',
    screenId: '8',
    screenLabelVi: '#08 Hồ sơ bạn đọc (/users/profile/)',
    screenLabelEn: '#08 Reader Profile (/users/profile/)',
  },
  {
    code: 'BR-04',
    titleVi: 'Biểu phí phạt 3 bậc, Trần giá thay thế & Phân quyền miễn giảm',
    titleEn: '3-Tier Overdue Fine, Replacement-Cost Cap & Waiver Governance',
    ruleVi:
      'Tính phạt tự động theo ngày trễ: Ngày 1–7: 5.000đ/ngày → Ngày 8–30: 10.000đ/ngày → Ngày 31+: 15.000đ/ngày. Trần phạt tối đa = 100% giá bìa thay thế sách (replacement_price) để tránh phí phạt vượt giá sách; mất/hỏng đền 100% giá thay thế.',
    ruleEn:
      'Progressive daily rates: Days 1–7: 5,000 VND/day → Days 8–30: 10,000 VND/day → Day 31+: 15,000 VND/day. Total fine is capped at 100% of book replacement_price to avoid perverse penalties; lost/damaged copies incur replacement cost.',
    exceptionVi:
      'Tự động tạm dừng tính phạt nếu xe hủy chuyến đúng ngày hạn trả. Phân quyền miễn giảm trên FinePayment (discount_percentage): ≤50% thủ thư điểm dừng duyệt, >50% bắt buộc Ban quản lý phê duyệt kèm lý do.',
    exceptionEn:
      'Fines pause automatically if a scheduled bus stop is canceled on due_date. Waiver authority on FinePayment (discount_percentage): ≤50% stop librarian, >50% requires project manager approval with logged reason.',
    techVi:
      'Celery Beat chạy tác vụ quét quá hạn & cập nhật FinePayment lúc 06:00 sáng và gửi email nhắc hạn lúc 08:00 sáng hàng ngày; toàn bộ miễn giảm lưu AuditMixin.',
    techEn:
      'Celery Beat scans overdue loans and updates FinePayment at 06:00 AM, then dispatches reminder emails at 08:00 AM daily; all waivers are logged via AuditMixin.',
    screenId: '9',
    screenLabelVi: '#09 Quản lý mượn trả (/transactions/borrows/)',
    screenLabelEn: '#09 Borrow & Fine Ops (/transactions/borrows/)',
  },
];

// Biểu đồ Bậc thang (Step Chart) cho Biểu phí phạt lũy tiến 3 bậc (BR-04)
const FINE_STEP_DATA = [
  { day: 'Ngày 1', dayNum: 1, rateK: 5, cumFineK: 5, tierVi: 'Bậc 1 (Ngày 1–7: 5k/ngày)', tierEn: 'Tier 1 (Days 1–7: 5k/d)' },
  { day: 'Ngày 3', dayNum: 3, rateK: 5, cumFineK: 15, tierVi: 'Bậc 1 (Ngày 1–7: 5k/ngày)', tierEn: 'Tier 1 (Days 1–7: 5k/d)' },
  { day: 'Ngày 7', dayNum: 7, rateK: 5, cumFineK: 35, tierVi: 'Hết Bậc 1 (7 ngày = 35k)', tierEn: 'End Tier 1 (7d = 35k)' },
  { day: 'Ngày 8', dayNum: 8, rateK: 10, cumFineK: 45, tierVi: 'Bậc 2 (Ngày 8–30: +10k/ngày)', tierEn: 'Tier 2 (Days 8–30: +10k/d)' },
  { day: 'Ngày 14', dayNum: 14, rateK: 10, cumFineK: 105, tierVi: 'Bậc 2 (14 ngày = 105k)', tierEn: 'Tier 2 (14d = 105k)' },
  { day: 'Ngày 21', dayNum: 21, rateK: 10, cumFineK: 175, tierVi: 'Bậc 2 (21 ngày = 175k)', tierEn: 'Tier 2 (21d = 175k)' },
  { day: 'Ngày 30', dayNum: 30, rateK: 10, cumFineK: 265, tierVi: 'Hết Bậc 2 (30 ngày = 265k)', tierEn: 'End Tier 2 (30d = 265k)' },
  { day: 'Ngày 31', dayNum: 31, rateK: 15, cumFineK: 280, tierVi: 'Bậc 3 (Từ ngày 31+: +15k/ngày)', tierEn: 'Tier 3 (Day 31+: +15k/d)' },
  { day: 'Ngày 35', dayNum: 35, rateK: 15, cumFineK: 340, tierVi: 'Bậc 3 (35 ngày = 340k)', tierEn: 'Tier 3 (35d = 340k)' },
  { day: 'Ngày 40', dayNum: 40, rateK: 15, cumFineK: 415, tierVi: 'Bậc 3 (Chặn trần 100% giá sách)', tierEn: 'Tier 3 (Capped at 100% book value)' },
];

const LB_RACI_MATRIX = [
  { taskVi: 'Mượn / giữ bản sao cuối & đối soát kho (BR-01)', taskEn: 'Last-Copy Checkout & Stock Audit (BR-01)', reader: 'C', librarian: 'R', driver: 'I', pm: 'A', donor: 'I' },
  { taskVi: 'Quản lý hàng đợi FIFO 7N & hủy chuyến (BR-02)', taskEn: '7-Day FIFO Queue & Trip Cancellations (BR-02)', reader: 'I', librarian: 'R', driver: 'C', pm: 'A', donor: 'I' },
  { taskVi: 'Xác nhận trả chéo tuyến & điều chuyển đêm', taskEn: 'Cross-Bus Return (IN_TRANSIT) & Night Transfer', reader: 'I', librarian: 'R', driver: 'R', pm: 'A', donor: 'I' },
  { taskVi: 'Thu phạt 3 bậc & duyệt miễn giảm >50% (BR-04)', taskEn: '3-Tier Fines & >50% Waiver Approval (BR-04)', reader: 'I', librarian: 'R', driver: 'I', pm: 'A', donor: 'I' },
  { taskVi: 'Đánh giá Pilot 4 tuần & điều chuyển đầu sách (US-05)', taskEn: '4-Week Pilot Review & Route Rebalancing (US-05)', reader: 'I', librarian: 'C', driver: 'C', pm: 'R / A', donor: 'I' },
];

const LB_USE_CASES = [
  {
    id: 'UC-01',
    titleVi: 'Đặt mượn sách tại điểm dừng (có khóa bản sao cuối)',
    titleEn: 'Stop-Level Book Checkout (with Last-Copy Row Lock)',
    actorVi: 'Độc giả (Primary) · Thủ thư điểm dừng (Secondary)',
    actorEn: 'Reader (Primary) · Stop Librarian (Secondary)',
    preVi: 'Độc giả đã đăng nhập, không có phiếu quá hạn/nợ phạt và đang mượn nhỏ hơn hạn mức hạng thẻ (3/5/10).',
    preEn: 'Authenticated reader, zero overdue loans/unpaid fines, and active loans below tier cap (3/5/10).',
    mainVi: [
      '1. Độc giả tra cứu #03/#04, chọn xe buýt có available_copies > 0 và bấm Mượn sách.',
      '2. Hệ thống mở transaction.atomic() và khóa tuần tự User → BusBookInventory (UUID tăng dần).',
      '3. Kiểm tra hạn mức + tồn kho hợp lệ → tạo BorrowRecord (hạn 14 ngày), trừ tồn -1 và COMMIT.',
      '4. Xóa cache Redis và đẩy tác vụ bất đồng bộ ghi sự kiện borrow vào UserActivity.',
    ],
    mainEn: [
      '1. Reader browses #03/#04, selects a bus with available_copies > 0, and submits Borrow.',
      '2. System opens transaction.atomic() and locks User → BusBookInventory (ascending UUID).',
      '3. Validates quota + stock → inserts BorrowRecord (14-day due date), decrements stock -1, and COMMITs.',
      '4. Invalidates Redis cache and enqueues async borrow telemetry into UserActivity.',
    ],
    excVi: 'E1 (Bản sao cuối bị tranh chấp): Giao dịch thứ 2 thấy available_copies = 0 → rollback an toàn và đề xuất chuyển sang hàng đợi FIFO (BR-02). E2 (Mất mạng 4G): Chỉ cho quét offline khi tồn ≥ 2 bản; bản cuối bắt buộc xác nhận trực tuyến.',
    excEn: 'E1 (Last-copy race): Second transaction reads available_copies = 0 → rolls back cleanly and suggests FIFO waitlist (BR-02). E2 (Weak 4G): Offline counter queue allowed only when stock ≥ 2; last copy requires online confirmation.',
  },
  {
    id: 'UC-02',
    titleVi: 'Trả sách chéo tuyến & Chốt công nợ phạt có trần giá sách',
    titleEn: 'Cross-Bus Return & Replacement-Capped Overdue Settlement',
    actorVi: 'Thủ thư điểm dừng (Primary) · Tài xế ca đêm & Ban QLDA (Secondary)',
    actorEn: 'Stop Librarian (Primary) · Night Depot Driver & PM (Secondary)',
    preVi: 'Phiếu mượn đang ở trạng thái ACTIVE hoặc OVERDUE; độc giả mang sách trả tại xe B (khác xe gốc A).',
    preEn: 'Loan is ACTIVE or OVERDUE; reader returns the physical copy at Bus B (different from home Bus A).',
    mainVi: [
      '1. Thủ thư xe B quét mã phiếu tại #09; hệ thống phát hiện return_bus_id ≠ pickup_bus_id.',
      '2. Hệ thống tính phạt 3 bậc (5k/10k/15k), trừ các ngày xe hủy lịch và chặn trần ≤ 100% replacement_price.',
      '3. Nếu miễn giảm >50%, gửi yêu cầu phê duyệt Ban QLDA và lưu vết AuditMixin.',
      '4. Đóng phiếu mượn, chuyển bản sao sang trạng thái IN_TRANSIT đưa vào danh sách điều chuyển đêm về xe A.',
    ],
    mainEn: [
      '1. Bus B librarian scans loan at #09; system detects return_bus_id ≠ pickup_bus_id.',
      '2. System computes 3-tier fines (5k/10k/15k), excludes canceled-stop days, and caps at 100% replacement_price.',
      '3. Any >50% waiver routes to PM approval and records reason + approver in AuditMixin.',
      '4. Closes loan and marks the copy IN_TRANSIT on the nightly depot transfer sheet back to Bus A.',
    ],
    excVi: 'E1 (Sách mất/hỏng): Chuyển mức bồi thường 100% giá thay thế và trừ tổng tồn vật lý. E2 (Hủy chuyến đúng hạn trả): Tạm dừng tính phạt tự động và dời hạn sang chuyến kế tiếp.',
    excEn: 'E1 (Lost/damaged copy): Charges 100% replacement_price and decrements physical inventory. E2 (Canceled trip on due_date): Pauses fine accrual and shifts due date to the next scheduled stop.',
  },
];

const LB_UAT_CASES = [
  { id: 'UAT-LB-01', ref: 'US-01 · BR-01', titleVi: '2 độc giả bấm mượn bản cuối cùng đồng thời', titleEn: 'Concurrent checkout on last copy', preVi: 'Xe #01 còn available_copies = 1; 2 tài khoản basic hợp lệ gửi POST song song.', preEn: 'Bus #01 has available_copies = 1; 2 valid basic accounts submit POST simultaneously.', passVi: 'Đúng 1 BorrowRecord được tạo, tồn về 0 (không âm), tài khoản thứ 2 nhận HTTP 409 kèm nút Đặt trước FIFO.', passEn: 'Exactly 1 BorrowRecord created, stock hits 0 (never negative), 2nd user receives conflict + FIFO waitlist prompt.' },
  { id: 'UAT-LB-02', ref: 'US-02 · BR-02', titleVi: 'Tự hủy giữ chỗ quá 7 ngày & đôn hàng đợi', titleEn: 'Auto-expire 7-day hold & shift queue', preVi: 'Phiếu #1 có ready_for_pickup_at cách hiện tại 7 ngày + 1 giờ; phiếu #2 và #3 đang chờ.', preEn: 'Hold #1 ready_for_pickup_at is 7d+1h ago; holds #2 and #3 are waiting.', passVi: 'Tác vụ 30p đổi #1 sang EXPIRED, đôn #2 → vị trí 1, #3 → vị trí 2 và gửi thông báo nhận sách cho #2.', passEn: '30m job marks #1 EXPIRED, promotes #2→pos 1, #3→pos 2, and dispatches pickup notification to #2.' },
  { id: 'UAT-LB-03', ref: 'US-03 · BR-03', titleVi: 'Chặn gia hạn sớm (>3 ngày) hoặc có người đặt trước', titleEn: 'Block early renewal (>3d) or active waitlist', preVi: 'Phiếu còn 6 ngày hạn trả (Case A) hoặc còn 2 ngày nhưng đầu sách có 1 người xếp hàng (Case B).', preEn: 'Loan has 6 days left (Case A) or 2 days left with 1 waitlisted reader (Case B).', passVi: 'Cả 2 trường hợp đều bị chặn gia hạn kèm thông báo lý do chính xác; due_date không đổi.', passEn: 'Both cases block renewal with exact reason message; due_date remains unchanged.' },
  { id: 'UAT-LB-04', ref: 'US-04 · BR-04', titleVi: 'Tính phạt 3 bậc có trần 100% giá thay thế', titleEn: '3-tier fine capped at 100% replacement value', preVi: 'Sách có replacement_price = 180.000đ, quá hạn 30 ngày (phạt thô = 265.000đ).', preEn: 'Book has replacement_price = 180,000 VND, 30 days overdue (raw schedule = 265,000 VND).', passVi: 'FinePayment chốt đúng 180.000đ (không vượt giá sách); nút miễn giảm 60% khóa quyền thủ thư, yêu cầu quản lý duyệt.', passEn: 'FinePayment caps exactly at 180,000 VND; 60% waiver blocks librarian role and requires PM approval.' },
  { id: 'UAT-LB-05', ref: 'Field · BR-04', titleVi: 'Tạm dừng phạt khi hủy chuyến & trả chéo tuyến', titleEn: 'Trip cancellation grace & cross-bus IN_TRANSIT', preVi: 'Xe #01 hủy trạm ngày hạn trả; độc giả trả sách ở xe #02 vào hôm sau.', preEn: 'Bus #01 cancels stop on due_date; reader returns book at Bus #02 next day.', passVi: 'Tiền phạt = 0đ; trạng thái bản sao đổi thành IN_TRANSIT gắn đích chuyển đêm về kho xe #01.', passEn: 'Fine equals 0 VND; copy status switches to IN_TRANSIT queued for nightly transfer back to Bus #01.' },
  { id: 'UAT-LB-06', ref: 'US-05 · SQL', titleVi: 'Báo cáo 30N lọc cohort 7 ngày chín & đủ xe 0 đơn', titleEn: '30d report matured 7d cohort & zero-loan buses', preVi: 'Tạo 1 xe mới có 0 giao dịch và 1 phiếu đặt trước vừa tạo hôm qua (<7 ngày).', preEn: 'Seed 1 active bus with 0 loans and 1 reservation created yesterday (<7 days).', passVi: 'Màn hình #10 vẫn hiện xe 0 đơn (LEFT JOIN) với 0 lỗi chia 0; phiếu mới tạo chưa bị tính vào mẫu số bỏ hẹn.', passEn: 'Dashboard #10 renders zero-loan bus (LEFT JOIN) without div/0; immature hold excluded from expired denominator.' },
];

const LB_SPRINT_BACKLOG = [
  { key: 'LB-101', us: 'US-01', sprint: 'Sprint 1', pts: 8, priority: 'Must-Have', statusVi: 'Đã kiểm chứng (Prototype)', statusEn: 'Verified (Prototype)', titleVi: 'Khóa dòng select_for_update() & hạn mức 3 hạng', titleEn: 'Row-lock checkout & 3-tier reader quotas' },
  { key: 'LB-102', us: 'US-02', sprint: 'Sprint 1', pts: 5, priority: 'Must-Have', statusVi: 'Đã kiểm chứng (Prototype)', statusEn: 'Verified (Prototype)', titleVi: 'Hàng đợi FIFO 7N & Celery Beat quét 30p', titleEn: '7-day FIFO queue & 30m Celery expiry scan' },
  { key: 'LB-103', us: 'US-03', sprint: 'Sprint 1', pts: 3, priority: 'Must-Have', statusVi: 'Đã kiểm chứng (Prototype)', statusEn: 'Verified (Prototype)', titleVi: 'Cổng gia hạn ≤3 ngày cuối & Redis cache bust', titleEn: 'Final-3-day renewal gate & Redis cache bust' },
  { key: 'LB-104', us: 'US-04', sprint: 'Sprint 2', pts: 5, priority: 'Must-Have', statusVi: 'Đã kiểm chứng (Prototype)', statusEn: 'Verified (Prototype)', titleVi: 'Phạt 3 bậc trần 100% giá + phân quyền miễn giảm', titleEn: 'Capped 3-tier fines + tiered waiver audit' },
  { key: 'LB-105', us: 'US-05', sprint: 'Sprint 2', pts: 5, priority: 'Should-Have', statusVi: 'Sẵn sàng Pilot 4W', statusEn: 'Ready for 4W Pilot', titleVi: '8 sự kiện UserActivity + SQL 30N lọc cohort 7N', titleEn: '8 MVP events + matured-7d 30d route SQL' },
];

export function Chapter1UxResearch({
  isEn = false,
}: Chapter1UxResearchProps) {
  const [activeBaTab, setActiveBaTab] = useState<'gap' | 'stories' | 'usecase-uat' | 'rules' | 'flow'>('gap');
  const [showSitemapAccordion, setShowSitemapAccordion] = useState(false);

  const handleJumpToScreen = (screenId: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('select-library-bus-screen', { detail: { screenId } })
      );
    }
  };

  const baTabs = [
    { id: 'gap' as const, vi: 'As-Is/To-Be & RACI', en: 'As-Is/To-Be & RACI' },
    { id: 'stories' as const, vi: 'MoSCoW, Stories & Backlog', en: 'MoSCoW, Stories & Backlog' },
    { id: 'usecase-uat' as const, vi: 'Use Cases & 6 UAT', en: 'Use Cases & 6 UAT' },
    { id: 'rules' as const, vi: 'Quy tắc BR-01..04', en: 'Rules BR-01..04' },
    { id: 'flow' as const, vi: 'BPMN & Biểu phí phạt', en: 'BPMN & Fine Chart' },
  ];

  return (
    <section id="chapter-1-ux" className="space-y-5 scroll-mt-28">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isEn
              ? 'Business Analysis & Core Rules (BR-01..04)'
              : 'Phân tích Nghiệp vụ (BA) & 4 Quy tắc cốt lõi'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {isEn
              ? 'Switch tabs below to inspect core business rules, operational gap analysis, MoSCoW scope, Given–When–Then stories, and transactional flows.'
              : 'Chuyển tab bên dưới để xem quy tắc nghiệp vụ, phân tích As-Is/To-Be, phạm vi MoSCoW, User Stories và lưu đồ giao dịch.'}
          </p>
        </div>

        {/* 4-TAB BA WORKSPACE SWITCHER */}
        <div
          role="tablist"
          aria-label={isEn ? 'Business Analysis Sections' : 'Nhóm tài liệu Phân tích nghiệp vụ'}
          className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
        >
          {baTabs.map((tab) => {
            const isActive = activeBaTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveBaTab(tab.id)}
                className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-[#074553] dark:text-[#9BE7FA] border border-[#9BE7FA]/70 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'
                }`}
              >
                {isEn ? tab.en : tab.vi}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: LƯỚI 2x2 CHO 4 THẺ QUY TẮC NGHIỆP VỤ BR-01..04 (GỌN, KHÔNG THẺ LỒNG THẺ) */}
      {activeBaTab === 'rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {BA_BUSINESS_RULES.map((br) => (
            <div
              key={br.code}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-extrabold text-xs tabular-nums shrink-0">
                    {br.code}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {isEn ? br.titleEn : br.titleVi}
                  </h3>
                </div>

                <dl className="space-y-2 text-xs leading-relaxed tabular-nums">
                  <div>
                    <dt className="inline font-bold text-slate-900 dark:text-white">
                      {isEn ? 'Rule: ' : 'Quy tắc: '}
                    </dt>
                    <dd className="inline text-slate-700 dark:text-slate-300">
                      {isEn ? br.ruleEn : br.ruleVi}
                    </dd>
                  </div>

                  <div>
                    <dt className="inline font-bold text-rose-700 dark:text-rose-400">
                      {isEn ? 'Exception: ' : 'Ngoại lệ chặn: '}
                    </dt>
                    <dd className="inline text-slate-700 dark:text-slate-300">
                      {isEn ? br.exceptionEn : br.exceptionVi}
                    </dd>
                  </div>

                  <div className="pt-1 text-slate-500 dark:text-slate-400">
                    <dt className="inline font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                      {isEn ? 'Dev note: ' : 'Kiểm chứng kỹ thuật: '}
                    </dt>
                    <dd className="inline">
                      {isEn ? br.techEn : br.techVi}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {isEn ? 'Linked screen:' : 'Màn hình đối chiếu:'}
                </span>
                <button
                  type="button"
                  onClick={() => handleJumpToScreen(br.screenId)}
                  className="font-bold text-[#0D7287] dark:text-[#9BE7FA] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{isEn ? br.screenLabelEn : br.screenLabelVi}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: SWIMLANE 3 LÀN & BIỂU ĐỒ BẬC THANG PHÍ PHẠT (BR-04) */}
      {activeBaTab === 'flow' && (
        <div className="grid grid-cols-1 gap-6">
        {/* Sơ đồ 1 (Toàn chiều rộng): Lưu đồ 3 làn bơi (Độc giả → TransactionService / MySQL Lock → Celery Beat & Telemetry) */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 px-2.5 py-1 text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                <Workflow className="w-4 h-4" />
                <span>
                  {isEn
                    ? 'Diagram 1 · 3-Lane Swimlane Flowchart (Borrow → Lock → Return → Fine & Telemetry)'
                    : 'Sơ đồ 1 · Lưu đồ 3 làn bơi (Mượn – Khóa bi quan – Trả – Phạt & Telemetry)'}
                </span>
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {isEn
                  ? 'How BA Business Rules Connect Directly to MySQL Locks & Async Telemetry'
                  : 'Cách quy trình nghiệp vụ nối thẳng sang khóa MySQL 8.0 và tác vụ nền Telemetry'}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              transaction.atomic() → on_commit → Celery
            </span>
          </div>

          <div className="space-y-4 tabular-nums">
            {/* SƠ ĐỒ BPMN 2.0 CHUẨN (START EVENT, EXCLUSIVE GATEWAY X, TIMER EVENTS 30M & 06:00, END EVENT) */}
            <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
                  {isEn
                    ? 'BPMN 2.0 Process Notation · Core Borrow / FIFO Waitlist / Overdue Fine Flow'
                    : 'Lưu đồ chuẩn BPMN 2.0 · Rẽ nhánh Mượn sách (XOR), Hàng đợi FIFO & Tác vụ định thời (Timer)'}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
                  <span>○ Start</span>
                  <span>◇× XOR Gateway</span>
                  <span>◷ Timer Event</span>
                  <span>◎ End</span>
                  <a
                    href="/library-bus/library_bus_bpmn_tobe.drawio"
                    download
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-bold hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-3 h-3" aria-hidden="true" />
                    <span>.drawio</span>
                  </a>
                </div>
              </div>
              <div className="overflow-x-auto">
                <svg
                  viewBox="0 0 960 250"
                  className="w-full min-w-[760px] h-auto"
                  role="img"
                  aria-label={isEn ? 'BPMN 2.0 Library Bus Circulation Diagram' : 'Sơ đồ BPMN 2.0 luồng mượn trả Library Bus'}
                >
                  <defs>
                    <marker id="bpmn-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0D7287" />
                    </marker>
                    <marker id="bpmn-arrow-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#E11D48" />
                    </marker>
                  </defs>

                  {/* 3 BPMN Swimlane bands */}
                  <rect x="4" y="6" width="952" height="74" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" className="dark:fill-slate-900 dark:stroke-slate-700" />
                  <text x="16" y="48" fontSize="10.5" fontWeight="700" fill="#475569" className="dark:fill-slate-300">Reader / UI</text>

                  <rect x="4" y="88" width="952" height="78" rx="8" fill="#F0F9FB" stroke="#9BE7FA" strokeWidth="1.2" className="dark:fill-slate-900/90 dark:stroke-slate-700" />
                  <text x="16" y="131" fontSize="10.5" fontWeight="700" fill="#074553" className="dark:fill-[#9BE7FA]">ACID Service</text>

                  <rect x="4" y="174" width="952" height="70" rx="8" fill="#FFFBEB" stroke="#FFD14C" strokeWidth="1" className="dark:fill-slate-900 dark:stroke-slate-700" />
                  <text x="16" y="213" fontSize="10.5" fontWeight="700" fill="#92400E" className="dark:fill-[#FFE485]">Celery / Timer</text>

                  {/* Start Event */}
                  <circle cx="122" cy="43" r="14" fill="#ECFDF5" stroke="#059669" strokeWidth="2" />
                  <text x="122" y="72" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#334155" className="dark:fill-slate-300">Start (#04)</text>

                  {/* User Task 1 */}
                  <rect x="166" y="22" width="124" height="42" rx="8" fill="#FFFFFF" stroke="#0D7287" strokeWidth="1.5" className="dark:fill-slate-800 dark:stroke-[#9BE7FA]" />
                  <text x="228" y="40" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0F172A" className="dark:fill-white">Gửi yêu cầu Mượn</text>
                  <text x="228" y="54" textAnchor="middle" fontSize="9.5" fill="#64748B" className="dark:fill-slate-400">view_book → POST</text>

                  {/* Service Task: Row Lock */}
                  <rect x="166" y="105" width="144" height="44" rx="8" fill="#FFFFFF" stroke="#0D7287" strokeWidth="1.8" className="dark:fill-slate-800 dark:stroke-[#9BE7FA]" />
                  <text x="238" y="123" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#074553" className="dark:fill-[#9BE7FA]">select_for_update()</text>
                  <text x="238" y="138" textAnchor="middle" fontSize="9.5" fill="#475569" className="dark:fill-slate-300">BR-01: User → Inventory</text>

                  {/* Exclusive Gateway (XOR) */}
                  <polygon points="366,105 390,127 366,149 342,127" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" />
                  <text x="366" y="132" textAnchor="middle" fontSize="14" fontWeight="800" fill="#92400E">×</text>
                  <text x="366" y="162" textAnchor="middle" fontSize="9" fontWeight="700" fill="#92400E" className="dark:fill-[#FFE485]">Tồn &gt; 0 &amp; Đủ hạn?</text>

                  {/* Branch YES: Create BorrowRecord */}
                  <rect x="448" y="105" width="146" height="44" rx="8" fill="#ECFDF5" stroke="#059669" strokeWidth="1.6" className="dark:fill-emerald-950/60 dark:stroke-emerald-500" />
                  <text x="521" y="123" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#065F46" className="dark:fill-emerald-300">Tạo BorrowRecord</text>
                  <text x="521" y="138" textAnchor="middle" fontSize="9.5" fill="#047857" className="dark:fill-emerald-400">Trừ tồn -1 · COMMIT</text>

                  {/* Branch YES -> Renewal / Return */}
                  <rect x="640" y="22" width="146" height="42" rx="8" fill="#FFFFFF" stroke="#0D7287" strokeWidth="1.5" className="dark:fill-slate-800 dark:stroke-[#9BE7FA]" />
                  <text x="713" y="40" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#0F172A" className="dark:fill-white">Gia hạn (≤3d) / Trả xe</text>
                  <text x="713" y="54" textAnchor="middle" fontSize="9.5" fill="#64748B" className="dark:fill-slate-400">BR-03 · Chéo tuyến OK</text>

                  {/* End Event */}
                  <circle cx="888" cy="43" r="14" fill="#EFF6FF" stroke="#0F172A" strokeWidth="3.5" className="dark:stroke-white dark:fill-slate-800" />
                  <text x="888" y="72" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0F172A" className="dark:fill-white">Hoàn tất</text>

                  {/* Branch NO: FIFO Queue + Timer 30m */}
                  <circle cx="366" cy="209" r="14" fill="#FFF1F2" stroke="#E11D48" strokeWidth="1.8" />
                  <circle cx="366" cy="209" r="10" fill="none" stroke="#E11D48" strokeWidth="1" />
                  <path d="M 366 203 L 366 209 L 370 212" stroke="#E11D48" strokeWidth="1.5" fill="none" />
                  <text x="366" y="236" textAnchor="middle" fontSize="9" fontWeight="700" fill="#BE123C" className="dark:fill-rose-400">Timer 30p</text>

                  <rect x="412" y="187" width="182" height="44" rx="8" fill="#FFF1F2" stroke="#E11D48" strokeWidth="1.5" className="dark:fill-rose-950/50 dark:stroke-rose-500" />
                  <text x="503" y="205" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#9F1239" className="dark:fill-rose-300">BookReservation FIFO (BR-02)</text>
                  <text x="503" y="220" textAnchor="middle" fontSize="9.5" fill="#BE123C" className="dark:fill-rose-400">Giữ 7N từ lúc về trạm · F()-1</text>

                  {/* Timer 06:00 Overdue Fine */}
                  <circle cx="662" cy="209" r="14" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" />
                  <circle cx="662" cy="209" r="10" fill="none" stroke="#D97706" strokeWidth="1" />
                  <path d="M 662 203 L 662 209 L 667 211" stroke="#D97706" strokeWidth="1.5" fill="none" />
                  <text x="662" y="236" textAnchor="middle" fontSize="9" fontWeight="700" fill="#92400E" className="dark:fill-[#FFE485]">06:00 / 08:00</text>

                  <rect x="708" y="187" width="224" height="44" rx="8" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" className="dark:fill-slate-800 dark:stroke-[#FFD14C]" />
                  <text x="820" y="205" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#92400E" className="dark:fill-[#FFE485]">Phạt 3 bậc &amp; Trần 100% giá (BR-04)</text>
                  <text x="820" y="220" textAnchor="middle" fontSize="9.5" fill="#64748B" className="dark:fill-slate-300">FinePayment + Email nhắc + AuditMixin</text>

                  {/* Connectors */}
                  <line x1="136" y1="43" x2="164" y2="43" stroke="#0D7287" strokeWidth="1.8" markerEnd="url(#bpmn-arrow)" />
                  <line x1="228" y1="64" x2="228" y2="103" stroke="#0D7287" strokeWidth="1.8" markerEnd="url(#bpmn-arrow)" />
                  <line x1="310" y1="127" x2="340" y2="127" stroke="#0D7287" strokeWidth="1.8" markerEnd="url(#bpmn-arrow)" />
                  <line x1="390" y1="127" x2="446" y2="127" stroke="#0D7287" strokeWidth="1.8" markerEnd="url(#bpmn-arrow)" />
                  <text x="418" y="121" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#059669">Có</text>

                  <line x1="366" y1="149" x2="366" y2="193" stroke="#E11D48" strokeWidth="1.6" strokeDasharray="4 2" markerEnd="url(#bpmn-arrow-rose)" />
                  <text x="389" y="176" fontSize="9.5" fontWeight="700" fill="#E11D48">Hết bản</text>
                  <line x1="380" y1="209" x2="410" y2="209" stroke="#E11D48" strokeWidth="1.6" markerEnd="url(#bpmn-arrow-rose)" />

                  <path d="M 594 127 L 616 127 L 616 43 L 638 43" fill="none" stroke="#0D7287" strokeWidth="1.8" markerEnd="url(#bpmn-arrow)" />
                  <line x1="786" y1="43" x2="872" y2="43" stroke="#0D7287" strokeWidth="1.8" markerEnd="url(#bpmn-arrow)" />

                  <path d="M 713 64 L 713 127 L 662 127 L 662 193" fill="none" stroke="#D97706" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#bpmn-arrow)" />
                  <text x="692" y="119" fontSize="9" fontWeight="700" fill="#92400E" className="dark:fill-[#FFE485]">Quá hạn</text>
                  <line x1="676" y1="209" x2="706" y2="209" stroke="#0D7287" strokeWidth="1.6" markerEnd="url(#bpmn-arrow)" />
                </svg>
              </div>
            </div>

            {/* LÀN 1: ĐỘC GIẢ & GIAO DIỆN */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-4 sm:p-5 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  <span className="w-7 h-7 rounded-lg bg-[#9BE7FA]/40 dark:bg-[#9BE7FA]/20 text-[#074553] dark:text-[#9BE7FA] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </span>
                  <span>
                    {isEn
                      ? 'Lane 1 · Reader & UI Layer (97 HTML Templates)'
                      : 'Làn 1 · Độc giả & Tầng Giao diện (97 HTML Templates)'}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                  Screen #03 → #04 → #07 → #09
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {[
                  {
                    step: 'Bước 1',
                    stepEn: 'Step 1',
                    titleVi: 'Xem chi tiết sách',
                    titleEn: 'View Book Detail',
                    endpoint: 'track_book_view()',
                    descVi: 'Mở trang chi tiết sách (#04), kiểm tra tồn kho theo xe và ghi log sự kiện view_book.',
                    descEn: 'Opens Book Detail (#04), checks per-bus stock, and logs a view_book event.',
                    hasNext: true,
                  },
                  {
                    step: 'Bước 2',
                    stepEn: 'Step 2',
                    titleVi: 'Bấm Mượn / Đặt chỗ',
                    titleEn: 'Borrow / Reserve',
                    endpoint: 'POST /transactions/borrow/',
                    descVi: 'Gửi yêu cầu mượn sách (hoặc xếp hàng đặt trước khi hết bản) xuống TransactionService.',
                    descEn: 'Submits borrow request (or waitlist reservation if out of stock) to TransactionService.',
                    hasNext: true,
                    highlight: true,
                  },
                  {
                    step: 'Bước 3',
                    stepEn: 'Step 3',
                    titleVi: 'Gia hạn (+14 ngày)',
                    titleEn: 'Renew (+14 days)',
                    endpoint: 'BR-03 · renewal_count < 2',
                    descVi: 'Cho phép gia hạn tối đa 2 lần nếu phiếu chưa quá hạn và không có người chờ đặt trước.',
                    descEn: 'Allows up to 2 renewals when the loan is not overdue and no reader is waiting in FIFO.',
                    hasNext: true,
                  },
                  {
                    step: 'Bước 4',
                    stepEn: 'Step 4',
                    titleVi: 'Trả sách & Đánh giá',
                    titleEn: 'Return & Review',
                    endpoint: 'BR-04 · FinePayment',
                    descVi: 'Thủ thư xác nhận trả tại trạm xe (#09), chốt phí phạt (nếu trễ) và cộng điểm uy tín.',
                    descEn: 'Librarian confirms stop return (#09), settles any overdue fine, and awards reputation.',
                    hasNext: false,
                  },
                ].map((node) => (
                  <div
                    key={node.step}
                    className={`relative rounded-xl p-4 bg-white dark:bg-slate-900 border flex flex-col justify-between gap-2 ${
                      node.highlight
                        ? 'border-[#0D7287] dark:border-[#9BE7FA]'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-[#0D7287] dark:text-[#9BE7FA]">
                          {isEn ? node.stepEn : node.step}
                        </span>
                        {node.hasNext && (
                          <ArrowRight className="w-4 h-4 text-slate-400 hidden xl:block shrink-0" aria-hidden="true" />
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {isEn ? node.titleEn : node.titleVi}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isEn ? node.descEn : node.descVi}
                      </p>
                    </div>
                    <code className="self-start px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200">
                      {node.endpoint}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            {/* MŨI TÊN CHUYỂN TIẾP LÀN 1 → LÀN 2 */}
            <div className="flex items-center justify-center py-0.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C8EEF7]/60 dark:bg-[#9BE7FA]/15 border border-[#9BE7FA] dark:border-[#9BE7FA]/40 text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {isEn
                    ? 'Handoff to Service Layer: POST request enters with transaction.atomic()'
                    : 'Chuyển xuống Service Layer: Yêu cầu POST đi vào khối with transaction.atomic()'}
                </span>
              </div>
            </div>

            {/* LÀN 2: TRANSACTIONSERVICE & MYSQL 8.0 LOCK */}
            <div className="rounded-2xl border-2 border-[#9BE7FA] dark:border-[#9BE7FA]/45 bg-[#C8EEF7]/20 dark:bg-slate-950/80 p-4 sm:p-5 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#9BE7FA]/60 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#074553] dark:text-[#9BE7FA]">
                  <span className="w-7 h-7 rounded-lg bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </span>
                  <span>
                    {isEn
                      ? 'Lane 2 · TransactionService & MySQL 8.0 Pessimistic Lock (ACID)'
                      : 'Làn 2 · TransactionService & Khóa bi quan MySQL 8.0 (ACID)'}
                  </span>
                </div>
                <code className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-[#9BE7FA] dark:border-slate-700 text-xs font-mono font-bold text-[#074553] dark:text-[#9BE7FA]">
                  with transaction.atomic():
                </code>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#9BE7FA]/70 dark:border-slate-800 p-4 flex flex-col justify-between gap-2.5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#C8EEF7]/70 dark:bg-[#9BE7FA]/20 text-[#074553] dark:text-[#9BE7FA] text-xs font-bold">
                        {isEn ? 'Step 2A · Row Lock' : 'Bước 2A · Khóa dòng'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] hidden lg:block" aria-hidden="true" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                      select_for_update()
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      {isEn
                        ? 'Locks User first, then Book by ascending UUID (Lock Ordering prevents deadlocks); validates available_copies > 0 and borrow_limit.'
                        : 'Khóa bản ghi User trước, sau đó khóa Book theo UUID tăng dần (Lock Ordering chống Deadlock); kiểm tra tồn kho > 0 và hạn mức mượn.'}
                    </p>
                  </div>
                  <code className="self-start px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-200">
                    BR-01 · Zero TOCTOU &amp; Deadlock
                  </code>
                </div>

                <div className="rounded-xl bg-white dark:bg-slate-900 border border-rose-300/80 dark:border-rose-900/60 p-4 flex flex-col justify-between gap-2.5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-bold">
                        {isEn ? 'Branch · Stock = 0' : 'Nhánh rẽ · Tồn kho = 0'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 hidden lg:block" aria-hidden="true" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isEn ? 'FIFO Waitlist Reservation' : 'Chuyển sang Hàng đợi Đặt trước FIFO'}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      {isEn
                        ? "Creates BookReservation with sequential queue_position (7-day hold); shifts remaining queue atomically via F('queue_position') - 1."
                        : "Tạo phiếu BookReservation cấp số thứ tự queue_position (giữ chỗ 7 ngày); dồn hàng nguyên tử bằng F('queue_position') - 1 khi hoàn tất/hủy."}
                    </p>
                  </div>
                  <code className="self-start px-2 py-0.5 rounded-md bg-rose-500/10 text-xs font-mono text-rose-700 dark:text-rose-300">
                    BR-02 · FIFO 7-Day Queue
                  </code>
                </div>

                <div className="rounded-xl bg-white dark:bg-slate-900 border border-emerald-400/70 dark:border-emerald-800/70 p-4 flex flex-col justify-between gap-2.5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        {isEn ? 'Branch · Stock > 0' : 'Nhánh chính · Tồn kho > 0'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isEn ? 'COMMIT, Cache Bust & on_commit' : 'COMMIT, Xóa Cache & Kích hoạt on_commit'}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      {isEn
                        ? 'Creates BorrowRecord, decrements available_copies - 1, bumps Redis CacheMixin key version, and dispatches async Celery task via transaction.on_commit.'
                        : 'Tạo phiếu BorrowRecord, trừ available_copies - 1, nâng version cache Redis (CacheMixin) và đẩy tác vụ nền qua hook transaction.on_commit.'}
                    </p>
                  </div>
                  <code className="self-start px-2 py-0.5 rounded-md bg-emerald-500/10 text-xs font-mono text-emerald-700 dark:text-emerald-300">
                    ACID Commit → Async Hook
                  </code>
                </div>
              </div>
            </div>

            {/* MŨI TÊN CHUYỂN TIẾP LÀN 2 → LÀN 3 */}
            <div className="flex items-center justify-center py-0.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFE485]/60 dark:bg-[#FFD14C]/15 border border-[#FFD14C] dark:border-[#FFD14C]/40 text-xs font-bold text-amber-950 dark:text-[#FFE485]">
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {isEn
                    ? 'Non-blocking Handoff: transaction.on_commit pushes async events via Redis 7 Broker'
                    : 'Chuyển bất đồng bộ (Non-blocking): transaction.on_commit đẩy sự kiện qua Redis 7 Broker'}
                </span>
              </div>
            </div>

            {/* LÀN 3: CELERY WORKER / BEAT & ANALYTICS TELEMETRY */}
            <div className="rounded-2xl border border-[#FFD14C]/70 bg-[#FFE485]/20 dark:bg-slate-950/60 p-4 sm:p-5 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#FFD14C]/40 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-amber-950 dark:text-[#FFE485]">
                  <span className="w-7 h-7 rounded-lg bg-[#FFD14C] text-slate-950 flex items-center justify-center shrink-0">
                    <Cpu className="w-4 h-4" />
                  </span>
                  <span>
                    {isEn
                      ? 'Lane 3 · Celery Worker / Beat & analytics Telemetry Module'
                      : 'Làn 3 · Celery Worker / Beat & Phân hệ Telemetry (analytics app)'}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-[#FFD14C]/60 dark:border-slate-700 text-xs font-mono font-bold text-amber-900 dark:text-[#FFE485]">
                  Redis 7 Broker • 9 Cron Jobs
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#FFD14C]/50 dark:border-slate-800 p-4 flex flex-col justify-between gap-2">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                      {isEn ? 'Event-Driven Worker' : 'Tác vụ tức thời (Event-Driven)'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono break-words">
                      update_analytics_on_borrow
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      {isEn
                        ? 'Logs UserActivity, awards +5 reputation points in UserReadingStats, and updates BookAnalytics popularity score.'
                        : 'Ghi sự kiện UserActivity, cộng +5đ uy tín vào UserReadingStats và cập nhật điểm phổ biến BookAnalytics.'}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#FFD14C]/50 dark:border-slate-800 p-4 flex flex-col justify-between gap-2">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-amber-700 dark:text-[#FFE485]">
                      {isEn ? 'Every 30 Minutes (Celery Beat)' : 'Định kỳ mỗi 30 phút (Celery Beat)'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isEn ? 'FIFO Queue Expiration Scan' : 'Quét giải phóng hàng đợi FIFO'}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      {isEn
                        ? 'Releases unclaimed reservations past 7 days (expires_date < now) and automatically notifies the next reader in line.'
                        : 'Tự động giải phóng phiếu đặt trước quá 7 ngày chưa nhận (expires_date < now) và gửi thông báo cho người kế tiếp.'}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#FFD14C]/50 dark:border-slate-800 p-4 flex flex-col justify-between gap-2">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                      {isEn ? 'Daily 06:00 & 08:00 (Celery Beat)' : 'Hằng ngày 06:00 & 08:00 (Celery Beat)'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isEn ? 'Overdue Fines & Due Reminders' : 'Tính phạt lũy tiến & Nhắc hạn trả'}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      {isEn
                        ? 'Executes calculate_fine (5k/10k/15k) into FinePayment at 06:00 and dispatches due-date reminder emails at 08:00.'
                        : 'Chạy hàm calculate_fine (5k/10k/15k) tạo bản ghi FinePayment lúc 06:00 và gửi email nhắc hạn trả lúc 08:00.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sơ đồ 2 (Toàn chiều rộng): Biểu đồ Bậc thang (Step Chart) cho Biểu phí phạt lũy tiến 3 bậc (BR-04) */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-[#FFE485]/60 dark:bg-[#FFD14C]/15 px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-[#FFE485]">
                {isEn
                  ? 'Diagram 2 · Step Chart (BR-04 Progressive Fine)'
                  : 'Sơ đồ 2 · Biểu đồ Bậc thang Phí phạt lũy tiến (BR-04)'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                5k → 10k → 15k/ngày
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isEn
                ? 'TransactionService.calculate_fine: Daily Rate & Cumulative Fine'
                : 'Hàm TransactionService.calculate_fine: Bậc phạt ngày & Tổng phạt lũy kế'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
              {isEn
                ? 'Step Line = Daily marginal rate (k VND/day) · Bars = Cumulative fine (k VND)'
                : 'Đường bậc thang = Mức phạt mỗi ngày (Nghìn đ/ngày) · Cột = Tổng phạt lũy kế (Nghìn đ)'}
            </p>

            <div className="h-[300px] sm:h-[330px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={FINE_STEP_DATA} margin={{ top: 12, right: 18, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.22)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(v) => `${v}k`}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 450]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: '#e11d48', fontWeight: 600 }}
                    tickFormatter={(v) => `${v}k/d`}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 18]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3.5 text-xs sm:text-sm tabular-nums space-y-1">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {isEn ? d.tierEn : d.tierVi}
                          </p>
                          <p>
                            {isEn ? 'Marginal rate (Step): ' : 'Đơn giá bậc phạt (Bậc thang): '}
                            <strong className="text-rose-600 dark:text-rose-400">{d.rateK}.000đ/ngày</strong>
                          </p>
                          <p>
                            {isEn ? 'Cumulative fine (Bar): ' : 'Tổng tiền phạt lũy kế (Cột): '}
                            <strong className="text-[#0D7287] dark:text-[#9BE7FA]">{d.cumFineK}.000đ</strong>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="cumFineK"
                    name={isEn ? 'Cumulative Fine (k VND)' : 'Tổng phạt lũy kế (Nghìn đ)'}
                    fill="#9BE7FA"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  />
                  <Line
                    yAxisId="right"
                    type="stepAfter"
                    dataKey="rateK"
                    name={isEn ? 'Daily Tier Rate (k/day)' : 'Mức phạt bậc thang (Nghìn/ngày)'}
                    stroke="#E11D48"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#FFE485', stroke: '#E11D48', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 tabular-nums leading-relaxed">
            <strong className="text-slate-900 dark:text-white">
              {isEn ? '3-Tier Formula & Replacement-Cost Cap: ' : 'Công thức 3 bậc & Trần giá thay thế: '}
            </strong>
            {isEn
              ? 'Days 1–7: 5,000 VND/day (35k) → Days 8–30: +10,000 VND/day (265k at day 30) → Day 31+: +15,000 VND/day. The chart shows the raw schedule; production enforces a hard ceiling at 100% of book replacement_price (e.g., 150k–200k VND) plus tiered waivers (≤50% librarian, >50% manager) logged in FinePayment.'
              : 'Ngày 1–7: 5.000đ/ngày (35k) → Ngày 8–30: +10.000đ/ngày (265k ở ngày 30) → Ngày 31+: +15.000đ/ngày. Biểu đồ thể hiện đường công thức chưa áp trần; khi vận hành áp trần cứng bằng 100% giá thay thế sách (ví dụ 150k–200kđ) và phân quyền miễn giảm (≤50% thủ thư, >50% Ban quản lý) lưu vết trong FinePayment.'}
          </div>
        </div>
        </div>
      )}

      {/* TAB 2: AS-IS / TO-BE, STAKEHOLDERS & RÀNG BUỘC THỰC ĐỊA XE LƯU ĐỘNG */}
      {activeBaTab === 'gap' && (
        <div className="space-y-4 text-xs sm:text-sm tabular-nums">
            {/* 0. Cây chỉ số (KPI Tree) nối mục tiêu vận hành với 5 chỉ số Pilot */}
            <div className="rounded-xl border border-[#C8EEF7] dark:border-slate-800 bg-[#F0F9FB]/70 dark:bg-slate-950/60 p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
                  {isEn
                    ? 'KPI Tree · Linking Mobile Library Circulation Goal to 5 Pilot Metrics'
                    : 'Cây chỉ số (KPI Tree) · Nối mục tiêu luân chuyển sách lưu động với 5 ngưỡng Pilot 4 tuần'}
                </p>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {isEn ? 'BR-01..04 → 8 Events → Pilot Go/Tune' : 'BR-01..04 → 8 Sự kiện → Ngưỡng Go/Tune'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {isEn ? '1. Inventory Accuracy (BR-01)' : '1. Độ tin cậy kho xe (BR-01)'}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {isEn
                      ? 'Double-Booking = 0% · Offline Counter Sync Conflict < 1%'
                      : 'Lỗi đặt trùng bản cuối = 0% · Xung đột đồng bộ offline < 1%'}
                  </p>
                </div>
                <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {isEn ? '2. Queue & Return Velocity (BR-02/04)' : '2. Tốc độ luân chuyển (BR-02/04)'}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {isEn
                      ? 'Matured 7-Day Pickup ≥ 70% · On-Time Return Rate ≥ 80%'
                      : 'Nhận sách đặt trước đủ 7 ngày chín ≥ 70% · Trả đúng hạn ≥ 80%'}
                  </p>
                </div>
                <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {isEn ? '3. Route Demand Fit (Tracking)' : '3. Khớp cung–cầu tuyến (Tracking)'}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {isEn
                      ? 'Stockout View Rate < 15% · Uncapped borrows_per_visit by stop'
                      : 'Tỷ lệ xem sách hết hàng < 15% · Lượt mượn/lượt ghé không chặn trần'}
                  </p>
                </div>
              </div>
            </div>

            {/* 1. Bảng phân tích hiện trạng As-Is vs To-Be */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60">
              <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEn ? 'A. As-Is vs. To-Be Operational Gap Analysis' : 'A. Phân tích Hiện trạng & Mục tiêu (As-Is vs. To-Be)'}
                </p>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2 px-3 font-semibold">{isEn ? 'Workflow' : 'Nghiệp vụ'}</th>
                    <th className="py-2 px-3 font-semibold">{isEn ? 'As-Is (Manual Pain Point)' : 'Hiện trạng thủ công (As-Is)'}</th>
                    <th className="py-2 px-3 font-semibold">{isEn ? 'To-Be (Digital Solution)' : 'Giải pháp đề xuất (To-Be)'}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/70">
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">{isEn ? 'Borrowing (BR-01)' : 'Mượn sách (BR-01)'}</td>
                    <td className="py-2 px-3 text-rose-700 dark:text-rose-300/90">{isEn ? 'Paper logs allow concurrent double-booking on the last book copy.' : 'Ghi sổ tay dễ phát sinh đặt trùng cuốn sách cuối cùng khi đông bạn đọc.'}</td>
                    <td className="py-2 px-3">{isEn ? 'Atomic stock reservation prevents double-booking and redirects overflow to waitlist.' : 'Khóa tồn kho tức thời, chặn đặt trùng 100% và điều hướng lượt sau vào hàng đợi.'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">{isEn ? 'Waitlist (BR-02)' : 'Đặt trước (BR-02)'}</td>
                    <td className="py-2 px-3 text-rose-700 dark:text-rose-300/90">{isEn ? 'Abandoned holds sit uncollected; next readers are not notified.' : 'Người đặt trước bỏ hẹn làm kẹt sách, người xếp sau không biết tới lượt.'}</td>
                    <td className="py-2 px-3">{isEn ? '7-day FIFO hold cap with automated expiration and next-in-line pickup alerts.' : 'Giữ chỗ tối đa 7 ngày theo thứ tự FIFO, tự động hủy quá hạn và báo người kế tiếp.'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">{isEn ? 'Fines (BR-04)' : 'Phí phạt (BR-04)'}</td>
                    <td className="py-2 px-3 text-rose-700 dark:text-rose-300/90">{isEn ? 'Ad-hoc overdue reminders and unlogged verbal fee waivers.' : 'Nhắc hạn và miễn giảm phí phạt cảm tính, khó đối soát công nợ.'}</td>
                    <td className="py-2 px-3">{isEn ? '3-tier progressive schedule (5k/10k/15k) with mandatory waiver approval logs.' : 'Tính phí 3 bậc tự động (5k/10k/15k) và lưu bắt buộc lý do + người duyệt miễn giảm.'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">{isEn ? 'Demand Visibility' : 'Đo nhu cầu tuyến'}</td>
                    <td className="py-2 px-3 text-rose-700 dark:text-rose-300/90">{isEn ? 'Zero data on which bus stops or book genres see stockouts.' : 'Không có số liệu biết tuyến xe hay nhóm sách nào thường xuyên hết bản.'}</td>
                    <td className="py-2 px-3">{isEn ? '8-event Tracking Plan + 30-day bus fulfillment query guiding restocking.' : 'Tracking Plan 8 sự kiện + báo cáo 30 ngày theo tuyến xe hỗ trợ điều phối sách.'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. Ma trận Stakeholder (tách bạch tác nhân hệ thống) */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60">
              <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEn ? 'B. Stakeholder Matrix (5 Business Stakeholders)' : 'B. Ma trận Các bên liên quan (5 Stakeholder vận hành)'}
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isEn ? 'Note: Celery Beat is a system automation actor, not a business stakeholder.' : 'Lưu ý: Celery Beat là tác nhân tự động hóa hệ thống, tách khỏi nhóm Stakeholder.'}
                </span>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2 px-3 font-semibold">{isEn ? 'Stakeholder' : 'Bên liên quan'}</th>
                    <th className="py-2 px-3 font-semibold">{isEn ? 'Primary Need' : 'Nhu cầu cốt lõi'}</th>
                    <th className="py-2 px-3 font-semibold">{isEn ? 'Touchpoints' : 'Điểm chạm chính'}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/70">
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{isEn ? 'Readers / Students' : 'Độc giả / Sinh viên'}</td>
                    <td className="py-2 px-3">{isEn ? 'Check available copies by stop, borrow/reserve online, renew easily.' : 'Tra sách còn trên xe gần nhất, đặt mượn/xếp hàng và gia hạn trực tuyến.'}</td>
                    <td className="py-2 px-3">#01, #03, #04, #06, #07, #08</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{isEn ? 'Stop Librarians' : 'Thủ thư tại điểm dừng'}</td>
                    <td className="py-2 px-3">{isEn ? 'Fast handover without stock conflicts; clear overdue balances.' : 'Giao/nhận sách nhanh không trùng đơn; theo dõi công nợ phạt rõ ràng.'}</td>
                    <td className="py-2 px-3">#09, #10, #11</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{isEn ? 'Bus Drivers & Dispatch' : 'Tài xế & Điều phối tuyến'}</td>
                    <td className="py-2 px-3">{isEn ? 'Published stop schedules and reserved-book load lists per route.' : 'Lịch điểm dừng công bố và danh sách sách cần chở theo đơn đặt trước.'}</td>
                    <td className="py-2 px-3">#06, #07</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{isEn ? 'Project Management' : 'Ban quản lý Dự án'}</td>
                    <td className="py-2 px-3">{isEn ? 'Monitor pickup rate, return compliance, waiver audits, and route utilization.' : 'Giám sát tỷ lệ nhận sách, trả đúng hạn, duyệt miễn giảm và hiệu suất tuyến.'}</td>
                    <td className="py-2 px-3">#10, #11</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{isEn ? 'Donors & Host Campuses' : 'Nhà tài trợ & Điểm trường'}</td>
                    <td className="py-2 px-3">{isEn ? 'Simple book donation intake and transparent circulation impact reports.' : 'Gửi quyên góp sách thuận tiện và nhận báo cáo minh bạch lượt luân chuyển.'}</td>
                    <td className="py-2 px-3">#05, #10</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2B. Ma trận RACI phân vai trách nhiệm vận hành */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60">
              <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEn ? 'B2. RACI Governance Matrix (5 Workflows × 5 Stakeholders)' : 'B2. Ma trận Phân vai Trách nhiệm (RACI Matrix)'}
                </p>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  R: Responsible · A: Accountable · C: Consulted · I: Informed
                </span>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2 px-3 font-semibold">{isEn ? 'Operational Process' : 'Luồng nghiệp vụ'}</th>
                    <th className="py-2 px-2 font-semibold text-center">{isEn ? 'Reader' : 'Độc giả'}</th>
                    <th className="py-2 px-2 font-semibold text-center">{isEn ? 'Librarian' : 'Thủ thư'}</th>
                    <th className="py-2 px-2 font-semibold text-center">{isEn ? 'Driver' : 'Tài xế'}</th>
                    <th className="py-2 px-2 font-semibold text-center">{isEn ? 'PM / Ops' : 'Ban QLDA'}</th>
                    <th className="py-2 px-3 font-semibold text-center">{isEn ? 'Donor' : 'Tài trợ'}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/70">
                  {LB_RACI_MATRIX.map((r) => (
                    <tr key={r.taskEn}>
                      <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">
                        {isEn ? r.taskEn : r.taskVi}
                      </td>
                      {[r.reader, r.librarian, r.driver, r.pm, r.donor].map((val, idx) => (
                        <td key={idx} className="py-2 px-2 text-center font-mono font-bold">
                          <span
                            className={`inline-block min-w-[24px] px-1.5 py-0.5 rounded text-[11px] ${
                              val.includes('R')
                                ? 'bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950'
                                : val === 'A'
                                ? 'bg-[#FFE485]/80 text-amber-950 dark:bg-[#FFD14C]/25 dark:text-[#FFE485]'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {val}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3. Ràng buộc thực địa đặc thù của xe thư viện lưu động */}
            <div className="rounded-xl border border-[#C8EEF7] dark:border-slate-800 bg-[#C8EEF7]/15 dark:bg-slate-950/60 p-4 space-y-2.5">
              <p className="text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
                {isEn
                  ? 'C. Mobile-Bus Field Constraints (What Makes a Bus Different from a Fixed Library)'
                  : 'C. Ràng buộc thực địa đặc thù của xe thư viện lưu động'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                <div className="rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-3 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {isEn ? 'Offline / Weak 4G at Stops' : 'Mạng 4G chập chờn tại trạm'}
                  </p>
                  <p>
                    {isEn
                      ? 'Stop librarians can queue barcode returns and non-last-copy checkouts offline locally and sync atomically on reconnect. Last-copy checkouts require online confirmation to preserve BR-01.'
                      : 'Thủ thư quét trả sách và mượn bản còn nhiều vào hàng đợi cục bộ khi mất mạng, đồng bộ khi có sóng. Riêng bản sao cuối yêu cầu xác nhận trực tuyến để giữ BR-01.'}
                  </p>
                </div>
                <div className="rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-3 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {isEn ? 'Cross-Bus Returns & Night Transfer' : 'Trả sách chéo tuyến & điều chuyển đêm'}
                  </p>
                  <p>
                    {isEn
                      ? 'Readers may return a copy to any bus stop. Cross-bus returns enter IN_TRANSIT status and move back to the home bus inventory during the nightly depot shift.'
                      : 'Độc giả được trả sách tại bất kỳ xe nào. Bản trả chéo tuyến chuyển trạng thái IN_TRANSIT và điều chuyển về kho xe gốc vào ca đêm tại bến.'}
                  </p>
                </div>
                <div className="rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-3 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {isEn ? 'Weather / Breakdown Stop Cancellation' : 'Hủy trạm do thời tiết / bảo trì'}
                  </p>
                  <p>
                    {isEn
                      ? 'When dispatch flags a canceled stop, pending 7-day reservation holds auto-extend to the next trip and overdue fine accrual pauses for loans due that day.'
                      : 'Khi điều phối đánh dấu hủy chuyến, hạn giữ chỗ đặt trước tự cộng bù sang chuyến kế tiếp và hệ thống tạm dừng tính phí phạt cho các phiếu đến hạn đúng ngày hủy.'}
                  </p>
                </div>
              </div>
            </div>
        </div>
      )}

      {/* TAB 3: PHÂN PHA MOSCOW & USER STORIES */}
      {activeBaTab === 'stories' && (
        <div className="space-y-4 text-xs sm:text-sm tabular-nums">
            {/* 3. Phân pha phạm vi MVP theo MoSCoW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-1">
                <p className="font-bold text-emerald-700 dark:text-emerald-400">
                  {isEn ? 'Must-Have (Phase 1 MVP)' : 'Must-Have (GĐ 1 MVP)'}
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Stop-level book catalog, safe borrowing (BR-01), 7-day FIFO waitlist (BR-02), renewal gate (BR-03), 3-tier overdue fines & audited waivers (BR-04).'
                    : 'Tra cứu kho sách theo tuyến, mượn chống trùng (BR-01), hàng đợi FIFO 7 ngày (BR-02), gia hạn (BR-03) và phí phạt 3 bậc có lưu vết (BR-04).'}
                </p>
              </div>
              <div className="rounded-xl border border-[#9BE7FA]/60 bg-[#C8EEF7]/20 dark:bg-slate-950/60 p-3.5 space-y-1">
                <p className="font-bold text-[#074553] dark:text-[#9BE7FA]">
                  {isEn ? 'Should-Have (Phase 1.5)' : 'Should-Have (GĐ 1.5)'}
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? '8-event Tracking Plan, 30-day bus fulfillment & borrow reporting, and 4-week 2-route field pilot.'
                    : 'Tracking Plan 8 sự kiện cốt lõi, báo cáo 30 ngày theo tuyến xe và kế hoạch thí điểm 4 tuần trên 2 tuyến.'}
                </p>
              </div>
              <div className="rounded-xl border border-[#FFD14C]/60 bg-[#FFE485]/20 dark:bg-slate-950/60 p-3.5 space-y-1">
                <p className="font-bold text-amber-800 dark:text-[#FFE485]">
                  {isEn ? 'Could-Have (Phase 2)' : 'Could-Have (GĐ 2 mở rộng)'}
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Gemini AI ISBN metadata autofill on donations, book recommendations, community blog, and reading reputation tiers (prototyped but decoupled from MVP).'
                    : 'Trích xuất ISBN bằng Gemini AI, gợi ý sách, blog cộng đồng và điểm uy tín (đã dựng mẫu prototype, tách khỏi lõi MVP).'}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3.5 space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {isEn ? "Won't-Have (Out-of-Scope)" : "Won't-Have (Ngoài phạm vi)"}
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Online fine payment gateway (counter verification in GĐ 1), live hardware GPS bus trackers, and inter-province warehouse transfers.'
                    : 'Cổng thanh toán phạt trực tuyến (xác nhận tại quầy GĐ 1), cảm biến GPS phần cứng gắn xe và luân chuyển kho liên tỉnh.'}
                </p>
              </div>
            </div>

            {/* 4. User Stories tách bạch Tiêu chí nghiệm thu nghiệp vụ khỏi Ghi chú kỹ thuật cho Dev */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    <th className="py-2.5 px-3 font-bold whitespace-nowrap">ID</th>
                    <th className="py-2.5 px-3 font-bold min-w-[190px]">User Story</th>
                    <th className="py-2.5 px-3 font-bold min-w-[260px]">{isEn ? 'Acceptance Criteria (Business Behavior)' : 'Tiêu chí nghiệm thu (Hành vi nghiệp vụ)'}</th>
                    <th className="py-2.5 px-3 font-bold min-w-[175px]">{isEn ? 'Tech Note for Dev' : 'Ghi chú kỹ thuật cho Dev'}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/70">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#0D7287] dark:text-[#9BE7FA] align-top">US-01<br /><span className="text-[11px] text-slate-500">BR-01</span></td>
                    <td className="py-2.5 px-3 align-top">
                      {isEn
                        ? 'As a reader, I want to borrow the last available copy safely so my confirmed loan is never double-booked.'
                        : 'Là độc giả, tôi muốn đặt mượn cuốn sách cuối cùng an toàn để không bị trùng đơn với người khác.'}
                    </td>
                    <td className="py-2.5 px-3 align-top leading-relaxed">
                      {isEn
                        ? 'Given only 1 copy remains and 2 readers submit Borrow at the same time, When the system processes both requests, Then only the first reader receives a confirmed loan (stock becomes 0) and the second sees a clear prompt to join the waitlist.'
                        : 'Given sách chỉ còn 1 bản và 2 độc giả bấm Mượn cùng lúc, When hệ thống xử lý hai yêu cầu, Then chỉ người đầu tiên nhận phiếu mượn thành công (tồn về 0) và người thứ hai nhận gợi ý chuyển sang xếp hàng đặt trước.'}
                    </td>
                    <td className="py-2.5 px-3 align-top font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      select_for_update() + transaction.atomic() (MySQL 8.0)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#0D7287] dark:text-[#9BE7FA] align-top">US-02<br /><span className="text-[11px] text-slate-500">BR-02</span></td>
                    <td className="py-2.5 px-3 align-top">
                      {isEn
                        ? 'As a queued reader, I want automatic promotion when an earlier hold expires so I do not miss my turn.'
                        : 'Là độc giả đang xếp hàng đặt trước, tôi muốn tự động được đôn lượt khi người trước bỏ hẹn quá 7 ngày.'}
                    </td>
                    <td className="py-2.5 px-3 align-top leading-relaxed">
                      {isEn
                        ? 'Given a reserved book is uncollected past its 7-day hold window, When the scheduled check runs, Then the expired hold is released automatically, queue positions shift forward by 1, and the next reader receives a pickup notice.'
                        : 'Given phiếu đặt trước chưa nhận quá hạn 7 ngày, When phiên kiểm tra định kỳ chạy, Then chỗ giữ hết hạn tự giải phóng, toàn bộ thứ tự phía sau đôn lên 1 bậc và người kế tiếp nhận thông báo nhận sách.'}
                    </td>
                    <td className="py-2.5 px-3 align-top font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      Celery Beat (30m scan) + F(&apos;queue_position&apos;) - 1
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#0D7287] dark:text-[#9BE7FA] align-top">US-03<br /><span className="text-[11px] text-slate-500">BR-03</span></td>
                    <td className="py-2.5 px-3 align-top">
                      {isEn
                        ? 'As a reader, I want to renew an eligible loan for 14 more days from my profile without violating waitlist priority.'
                        : 'Là độc giả, tôi muốn gia hạn sách đang đọc thêm 14 ngày ngay trên hồ sơ cá nhân nếu đủ điều kiện.'}
                    </td>
                    <td className="py-2.5 px-3 align-top leading-relaxed">
                      {isEn
                        ? 'Given a loan is within 3 days of due_date, on time, renewed fewer than 2 times, the reader has no unpaid overdue fines, and nobody is waitlisted, When the reader selects Renew on Profile, Then the due date extends by 14 days; otherwise renewal is blocked with the exact reason.'
                        : 'Given phiếu còn ≤3 ngày trước hạn trả, chưa quá hạn, gia hạn dưới 2 lần, độc giả không nợ phạt quá hạn và không có người chờ đặt trước, When độc giả chọn Gia hạn tại Hồ sơ, Then hạn trả cộng thêm 14 ngày; ngược lại hệ thống từ chối kèm lý do.'}
                    </td>
                    <td className="py-2.5 px-3 align-top font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      renewal_count &lt; 2 + CacheMixin invalidation
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#0D7287] dark:text-[#9BE7FA] align-top">US-04<br /><span className="text-[11px] text-slate-500">BR-04</span></td>
                    <td className="py-2.5 px-3 align-top">
                      {isEn
                        ? 'As a librarian, I want progressive overdue fines calculated automatically with a replacement-cost cap and audited waivers so balances stay fair and transparent.'
                        : 'Là thủ thư, tôi muốn hệ thống tự tính tiền phạt lũy tiến có trần giá thay thế và lưu vết miễn giảm để công nợ minh bạch.'}
                    </td>
                    <td className="py-2.5 px-3 align-top leading-relaxed">
                      {isEn
                        ? 'Given a loan is overdue each morning on an active bus schedule, When daily fine calculation runs, Then fees accrue at 5k/10k/15k VND/day capped at 100% of book replacement value, and waivers (>50% manager approval) record approver and reason.'
                        : 'Given phiếu mượn quá hạn vào sáng hằng ngày (không trùng ngày hủy chuyến), When hệ thống tính phạt tự động, Then phí cộng theo 3 bậc 5k/10k/15k nhưng không vượt 100% giá thay thế sách, và mọi miễn giảm (>50% quản lý duyệt) đều ghi rõ người duyệt cùng lý do.'}
                    </td>
                    <td className="py-2.5 px-3 align-top font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      06:00 cron + FinePayment (cap) + AuditMixin
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#0D7287] dark:text-[#9BE7FA] align-top">US-05<br /><span className="text-[11px] text-slate-500">Telemetry</span></td>
                    <td className="py-2.5 px-3 align-top">
                      {isEn
                        ? 'As an operations manager, I want matured 7-day pickup rates, stockout views, and borrows per visit by route so I can rebalance copies between buses.'
                        : 'Là quản lý vận hành, tôi muốn theo dõi tỷ lệ nhận sách đủ 7 ngày chín, tỷ lệ xem hết hàng và lượt mượn/lượt ghé theo tuyến để điều phối kho sách.'}
                    </td>
                    <td className="py-2.5 px-3 align-top leading-relaxed">
                      {isEn
                        ? 'Given 8 core events are logged across stops over 30 days, When the daily reporting job finishes, Then Dashboard #10 lists all active buses (including zero-activity buses) with uncapped borrows/visit, matured 7-day reservation pickup rate, and stockout view share.'
                        : 'Given 8 sự kiện cốt lõi được ghi nhận dọc tuyến trong 30 ngày, When báo cáo ngày chốt sổ, Then màn hình #10 hiển thị đủ mọi xe buýt (kể cả xe chưa có đơn) kèm lượt mượn/lượt ghé không chặn trần, tỷ lệ nhận đặt trước đủ 7 ngày và tỷ lệ xem sách hết hàng.'}
                    </td>
                    <td className="py-2.5 px-3 align-top font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      8 UserActivity events + Matured 7d CTE + LEFT JOIN
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4B. Sprint Backlog chuẩn Jira (2 Sprints · 26 Story Points) */}
            <div className="overflow-x-auto rounded-xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-950/60">
              <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Agile Sprint Backlog (Jira-Style Breakdown · 26 Story Points)' : 'Bảng Sprint Backlog (Cấu trúc Jira · 2 Sprint · 26 Story Points)'}
                </p>
                <span className="text-[11px] font-mono text-[#0D7287] dark:text-[#9BE7FA]">LB-101..105 · MVP Scope</span>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2 px-3 font-semibold whitespace-nowrap">Ticket</th>
                    <th className="py-2 px-2 font-semibold whitespace-nowrap">Sprint</th>
                    <th className="py-2 px-3 font-semibold">{isEn ? 'Backlog Item' : 'Hạng mục công việc'}</th>
                    <th className="py-2 px-2 font-semibold text-center">Pts</th>
                    <th className="py-2 px-2 font-semibold whitespace-nowrap">MoSCoW</th>
                    <th className="py-2 px-3 font-semibold whitespace-nowrap">{isEn ? 'Status' : 'Trạng thái'}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/70">
                  {LB_SPRINT_BACKLOG.map((b) => (
                    <tr key={b.key}>
                      <td className="py-2 px-3 font-mono font-bold text-[#074553] dark:text-[#9BE7FA] whitespace-nowrap">
                        {b.key} <span className="text-slate-400 font-normal">({b.us})</span>
                      </td>
                      <td className="py-2 px-2 whitespace-nowrap">{b.sprint}</td>
                      <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">{isEn ? b.titleEn : b.titleVi}</td>
                      <td className="py-2 px-2 text-center font-mono font-bold">{b.pts}</td>
                      <td className="py-2 px-2 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                          {b.priority}
                        </span>
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-[11px] font-semibold text-[#0D7287] dark:text-[#9BE7FA]">
                        {isEn ? b.statusEn : b.statusVi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#9BE7FA]/60 bg-[#C8EEF7]/20 dark:bg-slate-950/60 dark:border-slate-800 px-3.5 py-2.5 text-xs">
              <div className="space-y-0.5 text-slate-700 dark:text-slate-300">
                <p>
                  {isEn
                    ? 'Full printable Business Requirements Document (5 User Stories + Requirements Traceability Matrix + Telemetry NFRs).'
                    : 'Bản đầy đủ gồm 5 User Stories, Ma trận truy vết yêu cầu (RTM) và kế hoạch đo lường Telemetry dạng in A4.'}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {isEn
                    ? 'Planned 30-day Go-Live KPIs: 0% concurrent double-booking errors, 7-day reservation pickup rate, and on-time return rate.'
                    : 'KPI dự kiến đo trong 30 ngày đầu vận hành thật: 0% lỗi đặt trùng tồn kho, tỷ lệ nhận sách đúng hẹn đặt trước 7 ngày và tỷ lệ trả đúng hạn.'}
                </p>
              </div>
              <Link
                href="/projects/library-bus/brd"
                className="min-h-[44px] inline-flex items-center gap-1.5 rounded-lg bg-[#9BE7FA] hover:bg-[#C8EEF7] px-3 py-1.5 font-bold text-slate-950 transition-colors cursor-pointer shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-[#074553]" aria-hidden="true" />
                <span>{isEn ? 'Open Mini-BRD (Print / PDF)' : 'Mở Mini-BRD đầy đủ (In / PDF)'}</span>
              </Link>
            </div>
        </div>
      )}

      {/* TAB 3B: FORMAL USE CASE SPECIFICATIONS (UC-01..02) & UAT TEST CASES (UAT-LB-01..06) */}
      {activeBaTab === 'usecase-uat' && (
        <div className="space-y-4 text-xs tabular-nums">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {LB_USE_CASES.map((uc) => (
              <div key={uc.id} className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-mono font-bold text-[11px]">
                    {uc.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {isEn ? uc.titleEn : uc.titleVi}
                  </h3>
                </div>
                <dl className="space-y-2 leading-relaxed">
                  <div>
                    <dt className="inline font-bold text-slate-900 dark:text-white">{isEn ? 'Actors: ' : 'Tác nhân: '}</dt>
                    <dd className="inline text-slate-700 dark:text-slate-300">{isEn ? uc.actorEn : uc.actorVi}</dd>
                  </div>
                  <div>
                    <dt className="inline font-bold text-slate-900 dark:text-white">{isEn ? 'Preconditions: ' : 'Điều kiện tiên quyết: '}</dt>
                    <dd className="inline text-slate-700 dark:text-slate-300">{isEn ? uc.preEn : uc.preVi}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-[#074553] dark:text-[#9BE7FA] mb-1">{isEn ? 'Main Success Flow:' : 'Luồng xử lý chính (Main Flow):'}</dt>
                    <dd className="space-y-1 text-slate-700 dark:text-slate-300 pl-2">
                      {(isEn ? uc.mainEn : uc.mainVi).map((step) => (
                        <p key={step}>{step}</p>
                      ))}
                    </dd>
                  </div>
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <dt className="inline font-bold text-rose-700 dark:text-rose-400">{isEn ? 'Exception Flows: ' : 'Luồng ngoại lệ: '}</dt>
                    <dd className="inline text-slate-700 dark:text-slate-300">{isEn ? uc.excEn : uc.excVi}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-slate-900 dark:text-white">
                {isEn ? 'User Acceptance Test Cases (UAT-LB-01..06)' : 'Bảng Kịch bản Kiểm thử Nghiệm thu (UAT Test Cases — UAT-LB-01..06)'}
              </p>
              <span className="text-[11px] font-mono text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn ? 'Covers BR-01..04, Offline 4G, Cross-Bus & SQL Cohort' : 'Phủ đủ BR-01..04, 4G chập chờn, Trả chéo tuyến & SQL Cohort'}
              </span>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Test ID</th>
                  <th className="py-2.5 px-3 font-semibold">{isEn ? 'Test Case' : 'Kịch bản kiểm thử'}</th>
                  <th className="py-2.5 px-3 font-semibold">{isEn ? 'Precondition / Input' : 'Điều kiện & Đầu vào'}</th>
                  <th className="py-2.5 px-4 font-semibold">{isEn ? 'Expected Result (Pass Criteria)' : 'Kết quả kỳ vọng (Tiêu chí Pass)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-slate-700 dark:text-slate-300">
                {LB_UAT_CASES.map((tc) => (
                  <tr key={tc.id}>
                    <td className="py-2.5 px-4 align-top whitespace-nowrap">
                      <span className="font-mono font-bold text-[#074553] dark:text-[#9BE7FA]">{tc.id}</span>
                      <div className="text-[11px] font-mono text-slate-500">{tc.ref}</div>
                    </td>
                    <td className="py-2.5 px-3 align-top font-semibold text-slate-900 dark:text-white">
                      {isEn ? tc.titleEn : tc.titleVi}
                    </td>
                    <td className="py-2.5 px-3 align-top leading-relaxed">
                      {isEn ? tc.preEn : tc.preVi}
                    </td>
                    <td className="py-2.5 px-4 align-top leading-relaxed">
                      {isEn ? tc.passEn : tc.passVi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ACCORDION THU GỌN: SITEMAP 11 MÀN HÌNH & PERSONA NGƯỜI DÙNG */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
        <button
          type="button"
          onClick={() => setShowSitemapAccordion((v) => !v)}
          className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0D7287] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>
              {showSitemapAccordion
                ? isEn
                  ? 'Collapse Sitemap Hierarchy (11 Core Routes) & Target Persona Distribution'
                  : 'Thu gọn Sơ đồ Sitemap 11 đường dẫn cốt lõi & Chân dung Persona mục tiêu'
                : isEn
                ? 'View Information Architecture Sitemap (11 Core Routes) & User Persona Breakdown'
                : 'Xem Sơ đồ Kiến trúc Thông tin Sitemap (11 màn hình cốt lõi) & Phân bổ Persona độc giả'}
            </span>
          </span>
          {showSitemapAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSitemapAccordion && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs tabular-nums">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <p className="font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Target Reader Personas (15–45 y.o)' : 'Phân bổ Persona mục tiêu (15–45 tuổi)'}
                </p>
                <span className="px-2 py-0.5 rounded bg-[#FFE485]/50 dark:bg-[#FFD14C]/15 text-[11px] font-bold text-amber-950 dark:text-[#FFE485]">
                  {isEn ? 'Design Assumption (Sample)' : 'Giả định thiết kế (Mẫu)'}
                </span>
              </div>
              <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>{isEn ? 'University Students (VNU/USSH):' : 'Sinh viên đại học (ĐHQGHN):'}</span>
                  <strong>48%</strong>
                </div>
                <div className="flex justify-between">
                  <span>{isEn ? 'Young Office Commuters:' : 'Người đi làm trẻ dọc tuyến buýt:'}</span>
                  <strong>32%</strong>
                </div>
                <div className="flex justify-between">
                  <span>{isEn ? 'Local Families & Book Donors:' : 'Gia đình & Người quyên góp sách:'}</span>
                  <strong>20%</strong>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug pt-1">
                {isEn
                  ? 'Note: Illustrative persona split used for prototype prioritization, not from a live user survey.'
                  : 'Lưu ý: Tỷ trọng giả định dùng để ưu tiên tính năng bản mẫu, không phải số liệu khảo sát thực địa.'}
              </p>
            </div>

            <div className="md:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">
                {isEn
                  ? '11 Core Screen Routes (Click any route to inspect in Master–Detail below)'
                  : 'Ánh xạ nhanh 11 đường dẫn màn hình cốt lõi (Nhấp để mở trong khung Master–Detail bên dưới)'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: '1', label: '#01 Trang chủ (/)' },
                  { id: '2', label: '#02 Giới thiệu (/about/)' },
                  { id: '3', label: '#03 Kho sách (/inventory/books/)' },
                  { id: '4', label: '#04 Chi tiết sách (/inventory/books/<uuid>/)' },
                  { id: '5', label: '#05 Quyên góp (/inventory/books/donate/)' },
                  { id: '6', label: '#06 Bản đồ đội xe (/inventory/buses/)' },
                  { id: '7', label: '#07 Lộ trình & Trạm (/inventory/routes/<uuid>/)' },
                  { id: '8', label: '#08 Hồ sơ bạn đọc (/users/profile/)' },
                  { id: '9', label: '#09 Quản lý mượn trả (/transactions/borrows/)' },
                  { id: '10', label: '#10 Analytics Dashboard (/analytics/)' },
                  { id: '11', label: '#11 Django Admin (/admin/)' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleJumpToScreen(r.id)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-[#0D7287] text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Chapter1UxResearch;
