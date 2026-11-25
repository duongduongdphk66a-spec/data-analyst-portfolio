'use client';

import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface LibraryBusHeroProps {
  isEn?: boolean;
  onNavClick?: (_id: string, _e?: React.MouseEvent) => void;
}

export function LibraryBusHero({
  isEn: propIsEn,
  onNavClick: _onNavClick,
}: LibraryBusHeroProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const lang = isEn ? 'en' : 'vi';

  const libraryBusKpiCards = [
    {
      id: 'kpi-bus-django',
      badge: {
        vi: 'KIẾN TRÚC HỆ THỐNG • MYSQL 8.0 + UUIDv4',
        en: 'SYSTEM ARCHITECTURE • MYSQL 8.0 + UUIDv4',
      },
      badgeColor:
        'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
      title: {
        vi: 'Quy Mô Phân Hệ & Thực Thể Dữ Liệu',
        en: 'Django Modules & Data Entities',
      },
      primaryValue: isEn ? '7 Apps (36 Models)' : '7 Phân hệ Django (36 Models)',
      exactSubValue: isEn
        ? 'MySQL 8.0 • 3 Base Mixins • 97 HTML Templates'
        : 'MySQL 8.0 • 3 Base Mixins • 97 HTML Templates',
      comparisonNote: {
        vi: '7 phân hệ (users, inventory, transactions, analytics, notifications, blog, core) kế thừa UUIDv4, SoftDelete và AuditMixin.',
        en: '7 modular apps inheriting UUIDv4, SoftDelete, and AuditMixin on MySQL 8.0.',
      },
      accentBorder: 'hover:border-[#9BE7FA]/60',
    },
    {
      id: 'kpi-bus-ba',
      badge: {
        vi: 'QUY TẮC NGHIỆP VỤ • CHỐNG RACE CONDITION',
        en: 'BUSINESS RULES • RACE CONDITION GUARD',
      },
      badgeColor:
        'bg-[#FFE485]/40 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFE485]/30',
      title: {
        vi: 'Đặc Tả Nghiệp Vụ & Khóa Bi Quan DB',
        en: 'BA Rules & Pessimistic DB Locking',
      },
      primaryValue: isEn ? '4 BR Rules + ACID Lock' : '4 Bộ Quy tắc BR + Khóa ACID',
      exactSubValue: 'select_for_update() • transaction.atomic()',
      comparisonNote: {
        vi: 'Khóa bi quan select_for_update() chống lỗi đặt trùng TOCTOU, hàng đợi FIFO 7 ngày và biểu phí phạt lũy tiến 3 bậc.',
        en: 'Pessimistic select_for_update() lock preventing TOCTOU double-booking, 7-day FIFO queues, and 3-tier fines.',
      },
      accentBorder: 'hover:border-[#FFD14C]/60',
    },
    {
      id: 'kpi-bus-celery',
      badge: {
        vi: 'VẬN HÀNH TỰ ĐỘNG • REDIS 7 + CELERY 5.5',
        en: 'AUTOMATED OPS • REDIS 7 + CELERY 5.5',
      },
      badgeColor:
        'bg-[#C8EEF7]/50 text-[#074553] border-[#9BE7FA]/40 dark:bg-[#9BE7FA]/15 dark:text-[#9BE7FA] dark:border-[#9BE7FA]/30',
      title: {
        vi: 'Tác Vụ Nền Định Kỳ & Bộ Nhớ Đệm',
        en: 'Scheduled Cron Jobs & Cache Layer',
      },
      primaryValue: isEn ? '9 Cron Jobs (Celery + Redis)' : '9 Cron Jobs (Celery + Redis)',
      exactSubValue: isEn
        ? 'FIFO Scan 30m • Overdue 06:00 • CacheMixin'
        : 'Quét FIFO 30p • Quét phạt 06:00 • CacheMixin',
      comparisonNote: {
        vi: '9 tác vụ Celery Beat tự động quét hàng đợi 30p/lần, tính phạt 06:00, nhắc hạn 08:00, tổng hợp DailyStats và lưu kho lạnh >90 ngày.',
        en: '9 Celery Beat schedules for 30m FIFO scans, 06:00 fines, 08:00 reminders, DailyStats rollups, and >90d log archiving.',
      },
      accentBorder: 'hover:border-[#9BE7FA]/60',
    },
    {
      id: 'kpi-bus-tests',
      badge: {
        vi: 'KIỂM THỬ TỰ ĐỘNG • TELEMETRY & UI',
        en: 'AUTOMATED TESTS • TELEMETRY & UI',
      },
      badgeColor:
        'bg-[#FFE485]/40 text-amber-950 border-[#FFD14C]/40 dark:bg-[#FFE485]/15 dark:text-[#FFE485] dark:border-[#FFE485]/30',
      title: {
        vi: 'Độ Phủ Unit Test & Luồng Màn Hình',
        en: 'Unit Test Suite & Core Screen Flows',
      },
      primaryValue: isEn ? '171 Unit Tests • 11 Flows' : '171 Unit Tests • 11 Luồng Màn hình',
      exactSubValue: isEn
        ? '5 Docker Services • Desktop 1440 & Mobile 390'
        : '5 Dịch vụ Docker • Desktop 1440 & Mobile 390',
      comparisonNote: {
        vi: '171 unit test kiểm chứng logic mượn/trả/phạt, phân hệ Telemetry và 11 cặp màn hình Wireframe–UI đối chiếu.',
        en: '171 unit tests verifying circulation logic, product telemetry, and 11 paired Wireframe–UI flows.',
      },
      accentBorder: 'hover:border-[#FFD14C]/60',
    },
  ];

  return (
    <header className="relative w-full rounded-3xl border border-slate-200 bg-white dark:border-slate-800/90 p-5 sm:p-8 overflow-hidden space-y-6 dark:bg-slate-950 transition-colors duration-200">
      {/* HERO HEADLINE */}
      <div className="relative space-y-3 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="inline-flex flex-wrap items-center gap-2 rounded-xl bg-[#C8EEF7]/45 border border-[#9BE7FA] px-3 py-1 text-xs font-bold text-[#074553] dark:bg-[#9BE7FA]/15 dark:border-[#9BE7FA]/40 dark:text-[#9BE7FA] tabular-nums">
            {isEn
              ? 'Codebase Audit: 229 Source Files • MySQL 8.0 • Redis 7 • Celery 5.5.3 • Django 5.2 • Gemini AI Metadata'
              : 'Kiểm toán 229 file mã nguồn: MySQL 8.0 • Redis 7 • Celery 5.5.3 • Django 5.2 • Gemini AI trích xuất Metadata'}
          </div>
          <Link
            href="/projects/library-bus/brd"
            className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] px-3.5 py-2 text-xs font-bold text-slate-950 border border-[#0D7287]/20 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#074553]" aria-hidden="true" />
            <span>{isEn ? 'Mini-BRD & RTM (PDF / Print)' : 'Tài liệu Mini-BRD & RTM (In / PDF)'}</span>
          </Link>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
          {isEn ? (
            <>
              Library Bus System:{' '}
              <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                BA Specification, MySQL/Redis/Celery Architecture &amp; Product Telemetry
              </span>
            </>
          ) : (
            <>
              Hệ Thống Xe Thư Viện Lưu Động (Library Bus):{' '}
              <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                Đặc Tả Nghiệp Vụ (BA), Kiến Trúc MySQL/Redis/Celery &amp; Product Telemetry
              </span>
            </>
          )}
        </h1>
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-w-4xl">
          <strong className="text-slate-900 dark:text-white">
            {isEn ? 'Business Problem: ' : 'Bài toán vận hành: '}
          </strong>
          {isEn
            ? 'Manual circulation across mobile library buses causes last-copy double-booking, uncoordinated waitlists when books run out, inconsistent overdue penalties, and zero visibility into route or title demand.'
            : 'Vận hành xe thư viện lưu động thủ công dễ gây đặt trùng bản sách cuối cùng, bỏ lỡ lượt chờ khi sách hết bản, khó thu hồi sách trễ hạn theo bậc và thiếu số liệu đo nhu cầu theo từng tuyến xe.'}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          <strong className="text-slate-900 dark:text-white">
            {isEn ? 'My Role: ' : 'Vai trò của tôi: '}
          </strong>
          {isEn
            ? 'Business Analysis (BR-01..04, user flows, edge cases), Product Telemetry schema design, and UX/UI Wireframes; built a working Django 5.2 prototype (verified by 171 unit tests) to validate business rules end-to-end.'
            : 'Phân tích nghiệp vụ (đặc tả BR-01..04, luồng người dùng, ngoại lệ), thiết kế lược đồ Product Telemetry và Wireframe/UI; sử dụng prototype Django 5.2 (kiểm chứng bằng 171 unit tests) để xác nhận logic nghiệp vụ thực tế.'}
        </p>
      </div>

      {/* 4 BENTO KPI CARDS */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {libraryBusKpiCards.map((card) => (
          <div
            key={card.id}
            className={`p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800/90 transition duration-200 flex flex-col justify-between space-y-2.5 ${card.accentBorder}`}
          >
            <div className="space-y-1.5">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] tabular-nums font-bold border ${card.badgeColor}`}
              >
                {card.badge[lang]}
              </span>
              <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title[lang]}
              </h2>
              <div className="text-xl sm:text-2xl font-extrabold tabular-nums text-slate-950 dark:text-white tracking-tight">
                {card.primaryValue}
              </div>
              <div className="text-xs tabular-nums font-bold text-[#074553] dark:text-[#9BE7FA]">
                {card.exactSubValue}
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
              {card.comparisonNote[lang]}
            </p>
          </div>
        ))}
      </div>

      {/* DẢI TÓM TẮT 60 GIÂY (60-SECOND EXECUTIVE SUMMARY STRIP) */}
      <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-[#C8EEF7]/15 dark:bg-slate-900/70 p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            {isEn
              ? '60-Second Executive Summary (From BA Rules to Event Telemetry)'
              : 'Tóm tắt 60 giây (Từ Quy tắc Nghiệp vụ BA đến Tầng Dữ liệu Telemetry)'}
          </h2>
          <span className="text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA] tabular-nums">
            {isEn
              ? 'MySQL 8.0 • Redis 7 • Celery 5.5.3 • Django 5.2 (5 Docker Compose Services)'
              : 'MySQL 8.0 • Redis 7 • Celery 5.5.3 • Django 5.2 (5 dịch vụ Docker Compose)'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300 tabular-nums">
          <div className="rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-3.5">
            <p className="font-bold text-slate-900 dark:text-white mb-1">
              {isEn
                ? '1. Concurrency & Circulation Engine (BR-01..04)'
                : '1. Chống đặt trùng tồn kho & Hàng đợi FIFO (BR-01..04)'}
            </p>
            <p>
              {isEn
                ? 'Digitizes the mobile library bus network across Hanoi and neighboring provinces. Enforces pessimistic select_for_update() locks on Book & User inside transaction.atomic() to prevent TOCTOU double-booking, auto-manages 7-day FIFO reservation queues, and calculates 3-tier progressive overdue fines (5k/10k/15k VND/day).'
                : 'Số hóa mạng lưới xe buýt thư viện lưu động (Hà Nội và các tỉnh lân cận). Dùng khóa bi quan select_for_update() trên cả Book và User trong transaction.atomic() để chặn lỗi đặt trùng TOCTOU khi nhiều người mượn cùng lúc, tự động dịch chuyển hàng đợi đặt trước FIFO (giữ chỗ 7 ngày) và tính phạt lũy tiến 3 bậc (5k/10k/15k/ngày).'}
            </p>
          </div>
          <div className="rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-3.5">
            <p className="font-bold text-slate-900 dark:text-white mb-1">
              {isEn
                ? '2. Product Telemetry & Analytics App (analytics/models.py)'
                : '2. Phân hệ Telemetry & Đo lường Sản phẩm (analytics app)'}
            </p>
            <p>
              {isEn
                ? 'Captures 8 UserActivity event types with JSONField metadata (archiving >90d logs to ArchivedUserActivity), computes weighted BookAnalytics popularity (60% borrows + 30% ratings + 10% views + 20pt recency), scores BusAnalytics efficiency, and tracks Click-to-Borrow conversion across 5 recommendation algorithms.'
                : 'Ghi nhận 8 loại sự kiện UserActivity kèm JSONField metadata (tự động chuyển sang kho lạnh ArchivedUserActivity sau 90 ngày), tính điểm phổ biến sách BookAnalytics (60% mượn + 30% đánh giá + 10% xem + 20đ thưởng mới), chấm hiệu suất xe BusAnalytics và đo phễu Click Rate -> Borrow Rate cho 5 thuật toán gợi ý.'}
            </p>
          </div>
          <div className="rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-3.5">
            <p className="font-bold text-slate-900 dark:text-white mb-1">
              {isEn
                ? '3. 11 Master–Detail UI Flows Linked to Backend Triggers'
                : '3. 11 Luồng Giao diện Master–Detail gắn Dấu vết Nghiệp vụ'}
            </p>
            <p>
              {isEn
                ? 'Compresses 44 Wireframe & UI views (11 core screens across Desktop 1440px and Mobile 390px) into a single interactive Master–Detail inspector where each screen maps directly to its underlying Django view, API telemetry trigger, and BA business rule.'
                : 'Nén 44 bản vẽ Wireframe & UI (11 màn hình cốt lõi trên Desktop 1440px và Mobile 390px) vào một khung Master–Detail duy nhất, nơi mỗi màn hình gắn trực tiếp với dấu vết API Telemetry và quy tắc nghiệp vụ BR tương ứng.'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default LibraryBusHero;
