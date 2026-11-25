'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Cpu,
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
    titleVi: 'Hạn mức mượn & Chống tranh chấp tồn kho (Race Condition / TOCTOU)',
    titleEn: 'Borrow Quota & Concurrent Inventory Locking (TOCTOU Prevention)',
    ruleVi:
      'Hạn mượn mặc định 14 ngày (riêng giao tận nơi ShippingRequest là 21 ngày); giới hạn mặc định 5 cuốn đang mượn/độc giả (hoặc phân tầng qua @property borrow_limit: basic 3 • premium 5 • vip 10).',
    ruleEn:
      'Default loan duration is 14 days (21 days for home-delivery ShippingRequest); default limit is 5 active loans/reader (or tiered via @property borrow_limit: basic 3 • premium 5 • vip 10).',
    exceptionVi:
      'Chặn tạo phiếu mới nếu độc giả đã chạm trần hạn mức đang mượn, đang có phiếu quá hạn chưa trả, hoặc tồn kho cuốn sách trên xe đã về 0.',
    exceptionEn:
      'Blocks new borrow creation if the reader hits the active loan cap, holds an unreturned overdue loan, or bus copy stock reaches 0.',
    techVi:
      'Khóa bi quan select_for_update() theo thứ tự khóa cố định (Lock Ordering: luôn khóa User trước, sau đó khóa Book theo UUID tăng dần) bên trong transaction.atomic() (transactions/services.py) để chặn lỗi TOCTOU và tránh Deadlock trên MySQL 8.0, kèm ràng buộc unique_active_borrow.',
    techEn:
      'Pessimistic select_for_update() row lock with deterministic lock ordering (always locking User first, then Book by ascending UUID) inside transaction.atomic() (transactions/services.py) to prevent concurrent TOCTOU double-booking and MySQL 8.0 deadlocks, paired with unique_active_borrow.',
    screenId: '4',
    screenLabelVi: '#04 Chi tiết sách (/inventory/books/<uuid>/)',
    screenLabelEn: '#04 Book Detail (/inventory/books/<uuid>/)',
  },
  {
    code: 'BR-02',
    titleVi: 'Hàng đợi Đặt trước FIFO & Tự động giải phóng chỗ',
    titleEn: 'FIFO Reservation Queue & Automated Slot Release',
    ruleVi:
      'Chỉ mở đặt trước khi sách không có sẵn (not is_available); mỗi độc giả chỉ giữ tối đa 1 lượt đặt chưa hoàn tất cho cùng 1 đầu sách (unique_active_reservation).',
    ruleEn:
      'Reservations open only when a book is unavailable (not is_available); each reader can hold at most 1 active unfulfilled reservation per book (unique_active_reservation).',
    exceptionVi:
      'Phiếu đặt giữ chỗ tối đa 7 ngày (expires_date); nếu quá hạn không nhận tại xe buýt đăng ký (preferred_pickup_location_id), hệ thống tự động hủy và đẩy người kế tiếp lên.',
    exceptionEn:
      'Holds expire after 7 days (expires_date); unclaimed reservations at the preferred bus (preferred_pickup_location_id) auto-expire and promote the next reader in line.',
    techVi:
      'Tự động cấp số thứ tự queue_position, tự động dồn hàng đợi bằng biểu thức nguyên tử F(\'queue_position\') - 1 khi hoàn tất/hủy; Celery Beat quét hàng đợi mỗi 30 phút.',
    techEn:
      'Auto-assigns queue_position, shifts queue atomically via F(\'queue_position\') - 1 on fulfillment/cancellation; Celery Beat scans expired holds every 30 minutes.',
    screenId: '7',
    screenLabelVi: '#07 Lộ trình & Trạm đón (/inventory/routes/<uuid>/)',
    screenLabelEn: '#07 Route & Pickup Stop (/inventory/routes/<uuid>/)',
  },
  {
    code: 'BR-03',
    titleVi: 'Điều kiện Gia hạn phiếu mượn (Renewal Gate)',
    titleEn: 'Loan Renewal Eligibility Gate (Renewal Gate)',
    ruleVi:
      'Cho phép độc giả gia hạn thêm +14 ngày cho mỗi lần gia hạn, tối đa 2 lần trên mỗi phiếu mượn (renewal_count < 2).',
    ruleEn:
      'Allows readers to extend due_date by +14 days per renewal, capped at a maximum of 2 renewals per loan record (renewal_count < 2).',
    exceptionVi:
      'Ngoại lệ chặn cứng: Từ chối gia hạn nếu phiếu mượn đã quá hạn (is_overdue) HOẶC đầu sách đó đang có độc giả khác xếp hàng đặt trước (reservations.filter(is_fulfilled=False).exists()).',
    exceptionEn:
      'Hard blocking exceptions: Rejects renewal if the loan is already overdue (is_overdue) OR another reader is waiting in the reservation queue (reservations.filter(is_fulfilled=False).exists()).',
    techVi:
      'Kiểm tra nguyên tử trong TransactionService.renew_book(); tự động ghi log AuditMixin và xóa cache phiên bản Redis (CacheMixin) của độc giả sau khi cập nhật due_date.',
    techEn:
      'Validated atomically in TransactionService.renew_book(); writes AuditMixin trace and invalidates versioned Redis cache (CacheMixin) upon updating due_date.',
    screenId: '8',
    screenLabelVi: '#08 Hồ sơ bạn đọc (/users/profile/)',
    screenLabelEn: '#08 Reader Profile (/users/profile/)',
  },
  {
    code: 'BR-04',
    titleVi: 'Biểu phí phạt lũy tiến 3 bậc & Vận hành tự động',
    titleEn: '3-Tier Progressive Overdue Fine Engine & Automated Ops',
    ruleVi:
      'Tính phạt tự động theo số ngày trễ hạn (TransactionService.calculate_fine): Ngày 1–7: 5.000đ/ngày → Ngày 8–30: 10.000đ/ngày → Từ ngày 31+: 15.000đ/ngày.',
    ruleEn:
      'Calculates progressive overdue fines by days late (TransactionService.calculate_fine): Days 1–7: 5,000 VND/day → Days 8–30: 10,000 VND/day → Day 31+: 15,000 VND/day.',
    exceptionVi:
      'Hỗ trợ thủ thư/Admin áp dụng mức miễn giảm 0–100% (discount_percentage) trên bảng FinePayment có bắt buộc ghi nhận người duyệt và lý do.',
    exceptionEn:
      'Supports 0–100% fine waivers (discount_percentage) on the FinePayment model with mandatory approver audit logging.',
    techVi:
      'Celery Beat tự động chạy task quét phiếu quá hạn & khởi tạo/cập nhật FinePayment lúc 06:00 sáng và gửi email nhắc hạn tự động lúc 08:00 sáng hàng ngày.',
    techEn:
      'Celery Beat automatically scans overdue loans and updates FinePayment records at 06:00 AM, then dispatches due-date reminder emails at 08:00 AM daily.',
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
  { day: 'Ngày 40', dayNum: 40, rateK: 15, cumFineK: 415, tierVi: 'Bậc 3 (40 ngày = 415k)', tierEn: 'Tier 3 (40d = 415k)' },
];

export function Chapter1UxResearch({
  isEn = false,
}: Chapter1UxResearchProps) {
  const [showSitemapAccordion, setShowSitemapAccordion] = useState(false);
  const [showUserStoriesAccordion, setShowUserStoriesAccordion] = useState(true);

  const handleJumpToScreen = (screenId: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('select-library-bus-screen', { detail: { screenId } })
      );
    }
  };

  return (
    <section id="chapter-1-ux" className="space-y-6 scroll-mt-28">
      <div className="space-y-1.5">
        <span className="inline-flex items-center rounded-md bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 px-2.5 py-0.5 text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
          {isEn
            ? 'Section 01 · Business Analysis (BA) & Core Rules in transactions/services.py'
            : 'Phần 01 · Phân tích Nghiệp vụ (BA) & 4 Quy tắc cốt lõi trong transactions/services.py'}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {isEn
            ? 'Business Rules Specification (BR-01..04) & Transactional Swimlane'
            : 'Bài toán Nghiệp vụ & 4 Quy tắc cốt lõi BR-01..04 (Quy tắc → Ngoại lệ → Thực thi)'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-prose leading-relaxed">
          {isEn
            ? 'Every business rule is mapped directly from user requirements to blocking exceptions and exact MySQL 8.0 / Celery enforcement in transactions/services.py and transactions/models.py.'
            : 'Mỗi quy tắc nghiệp vụ được đặc tả theo chuẩn BA (Quy tắc → Ngoại lệ chặn → Ràng buộc kỹ thuật thực tế đang chạy trong transactions/services.py và transactions/models.py).'}
        </p>
      </div>

      {/* LƯỚI 2x2 CHO 4 THẺ QUY TẮC NGHIỆP VỤ BR-01..04 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {BA_BUSINESS_RULES.map((br) => (
          <div
            key={br.code}
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-black text-xs tabular-nums">
                    {br.code}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {isEn ? br.titleEn : br.titleVi}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs leading-relaxed tabular-nums">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {isEn ? 'Rule Specification: ' : 'Quy tắc nghiệp vụ: '}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {isEn ? br.ruleEn : br.ruleVi}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20">
                  <span className="font-bold text-rose-700 dark:text-rose-300">
                    {isEn ? 'Blocking Exception: ' : 'Ngoại lệ chặn: '}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {isEn ? br.exceptionEn : br.exceptionVi}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#C8EEF7]/25 dark:bg-[#9BE7FA]/10 border border-[#C8EEF7] dark:border-slate-800">
                  <span className="font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                    {isEn ? 'Technical Enforcement: ' : 'Thực thi kỹ thuật: '}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {isEn ? br.techEn : br.techVi}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {isEn ? 'Linked UI Screen:' : 'Màn hình kiểm chứng:'}
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

      {/* 2 SƠ ĐỒ TRỰC QUAN XẾP DỌC TOÀN CHIỀU RỘNG: SWIMLANE 3 LÀN & BIỂU ĐỒ BẬC THANG PHÍ PHẠT (BR-04) */}
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

          <div className="space-y-2 tabular-nums">
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
              {isEn ? '3-Tier Formula: ' : 'Công thức 3 bậc trong code: '}
            </strong>
            {isEn
              ? 'Days 1–7: 5,000 VND/day (max 35k) → Days 8–30: +10,000 VND/day (30 days = 265k) → Day 31+: +15,000 VND/day. Supports 0–100% discount waivers with approver logging in FinePayment.'
              : 'Ngày 1–7: 5.000đ/ngày (tối đa 35k) → Ngày 8–30: +10.000đ/ngày (30 ngày = 265k) → Ngày 31+: +15.000đ/ngày. Hỗ trợ miễn giảm 0–100% có lưu log người duyệt trong bảng FinePayment.'}
          </div>
        </div>
      </div>

      {/* ACCORDION THU GỌN: USER STORIES, ACCEPTANCE CRITERIA (GIVEN-WHEN-THEN) & PHẠM VI DỰ ÁN */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-[#C8EEF7]/10 dark:bg-slate-900/50 p-4">
        <button
          type="button"
          onClick={() => setShowUserStoriesAccordion((v) => !v)}
          className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#0D7287] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>
              {showUserStoriesAccordion
                ? isEn
                  ? 'Collapse BA Deliverables: User Stories, Acceptance Criteria (Given-When-Then) & Project Scope'
                  : 'Thu gọn Đặc tả BA: User Stories, Tiêu chí nghiệm thu (Given–When–Then) & Phạm vi dự án'
                : isEn
                ? 'View BA Deliverables: User Stories, Acceptance Criteria (Given-When-Then) & In/Out-of-Scope'
                : 'Xem Đặc tả BA chuẩn: User Stories, Acceptance Criteria (Given–When–Then) & Phạm vi In/Out-of-Scope'}
            </span>
          </span>
          {showUserStoriesAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showUserStoriesAccordion && (
          <div className="space-y-4 pt-4 text-xs sm:text-sm tabular-nums">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-emerald-500/25 bg-white dark:bg-slate-950/60 p-3.5 space-y-1">
                <p className="font-bold text-emerald-700 dark:text-emerald-400">
                  {isEn ? 'In-Scope (Phase 1 MVP)' : 'Trong phạm vi (In-Scope · GĐ 1)'}
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Online catalog search by bus location, concurrent borrow locking (BR-01), 7-day FIFO reservation queue (BR-02), renewal gate (BR-03), 3-tier overdue fine automation (BR-04), and event telemetry tracking.'
                    : 'Tra cứu kho sách theo tuyến xe buýt, mượn sách chống trùng tồn kho (BR-01), hàng đợi đặt trước FIFO 7 ngày (BR-02), gia hạn (BR-03), tự động tính phạt 3 bậc (BR-04) và phân hệ Telemetry.'}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-3.5 space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {isEn ? 'Out-of-Scope (Deferred)' : 'Ngoài phạm vi (Out-of-Scope)'}
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Live payment gateway integration for fine collection (manual librarian verification in Phase 1), real-time GPS telematics hardware on physical buses, and inter-province warehouse transfers.'
                    : 'Cổng thanh toán trực tuyến thu tiền phạt (GĐ 1 xác nhận tại quầy qua FinePayment), cảm biến GPS phần cứng gắn trên xe thật và luân chuyển kho liên tỉnh.'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    <th className="py-2.5 px-3 font-bold whitespace-nowrap">ID</th>
                    <th className="py-2.5 px-3 font-bold min-w-[210px]">{isEn ? 'User Story' : 'User Story'}</th>
                    <th className="py-2.5 px-3 font-bold min-w-[300px]">{isEn ? 'Acceptance Criteria (Given / When / Then)' : 'Tiêu chí nghiệm thu (Given / When / Then)'}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/70">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#0D7287] dark:text-[#9BE7FA] align-top">US-01<br /><span className="text-[11px] text-slate-500">BR-01</span></td>
                    <td className="py-2.5 px-3 align-top">
                      {isEn
                        ? 'As a reader, I want to borrow the last available copy safely so my confirmed loan is never double-booked.'
                        : 'Là độc giả, tôi muốn đặt mượn cuốn sách cuối cùng an toàn để không bị lỗi trùng đơn với người khác.'}
                    </td>
                    <td className="py-2.5 px-3 align-top leading-relaxed">
                      {isEn
                        ? 'Given available_copies = 1 and 2 readers click Borrow simultaneously, When TransactionService acquires select_for_update(), Then only the first reader receives an active BorrowRecord (copies -> 0) and the second is prompted to join the FIFO queue.'
                        : 'Given available_copies = 1 và 2 độc giả bấm Mượn cùng lúc, When TransactionService khóa dòng select_for_update(), Then chỉ người đầu tiên tạo phiếu mượn thành công (tồn -> 0), người thứ hai được chuyển sang đặt trước FIFO.'}
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
                        ? 'Given a reservation with is_fulfilled = False and expires_date < now, When the 30-min Celery Beat scan runs, Then the expired hold is released, remaining queue_position values decrement by 1, and the next reader receives a pickup notification.'
                        : 'Given phiếu đặt trước chưa nhận (is_fulfilled = False) quá 7 ngày, When Celery Beat quét định kỳ 30 phút, Then hệ thống tự giải phóng chỗ, dồn queue_position - 1 và gửi thông báo nhận sách cho người kế tiếp.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#0D7287] dark:text-[#9BE7FA] align-top">US-03<br /><span className="text-[11px] text-slate-500">BR-03/04</span></td>
                    <td className="py-2.5 px-3 align-top">
                      {isEn
                        ? 'As a librarian, I want renewal blocks and progressive fines calculated automatically so overdue stock returns faster.'
                        : 'Là thủ thư, tôi muốn hệ thống chặn gia hạn sai quy định và tự tính phạt lũy tiến để thu hồi sách quá hạn đúng chuẩn.'}
                    </td>
                    <td className="py-2.5 px-3 align-top leading-relaxed">
                      {isEn
                        ? 'Given a loan is overdue OR has an active reservation waiting, When the reader requests renewal, Then the system rejects it; at 06:00 daily, overdue loans accrue 5k/day (d1–7), 10k/day (d8–30), and 15k/day (d31+) with optional audited waivers.'
                        : 'Given phiếu mượn đã quá hạn HOẶC sách đang có người đặt trước, When độc giả bấm Gia hạn, Then hệ thống từ chối; lúc 06:00 mỗi ngày, phiếu quá hạn tự tính phạt 5k/10k/15k theo 3 bậc và lưu log duyệt miễn giảm nếu có.'}
                    </td>
                  </tr>
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
      </div>

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
                  { id: '6', label: '#06 Đội xe GPS (/inventory/buses/)' },
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
