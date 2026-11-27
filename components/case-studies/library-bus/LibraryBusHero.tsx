'use client';

import React from 'react';
import Link from 'next/link';
import { Download, FileText } from 'lucide-react';
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
      id: 'kpi-bus-ba',
      title: {
        vi: 'Quy tắc nghiệp vụ',
        en: 'Core Business Rules',
      },
      primaryValue: isEn ? '4 Rules (BR-01..04)' : '4 Bộ Quy tắc BR',
      exactSubValue: isEn
        ? 'No double-booking • 7d FIFO • 3-tier fines'
        : 'Chống trùng sách cuối • Hàng đợi 7N • Phạt 3 bậc',
      accentBorder: 'hover:border-[#9BE7FA]/60',
    },
    {
      id: 'kpi-bus-brd',
      title: {
        vi: 'Hồ sơ BA & Phạm vi',
        en: 'BA Spec & Scope',
      },
      primaryValue: isEn ? 'Mini-BRD & 5 Stories' : 'Mini-BRD & 5 Stories',
      exactSubValue: isEn
        ? 'As-Is/To-Be • 5 Stakeholders • MoSCoW'
        : 'As-Is/To-Be • 5 Stakeholder • MoSCoW',
      accentBorder: 'hover:border-[#FFD14C]/60',
    },
    {
      id: 'kpi-bus-ui',
      title: {
        vi: 'Luồng màn hình cốt lõi',
        en: 'Core Screen Flows',
      },
      primaryValue: isEn ? '11 Screen Pairs' : '11 Cặp Màn hình',
      exactSubValue: 'Wireframe ↔ UI • Desktop 1440 & Mobile 390',
      accentBorder: 'hover:border-[#9BE7FA]/60',
    },
    {
      id: 'kpi-bus-tracking',
      title: {
        vi: 'Đo lường & Kiểm chứng',
        en: 'Telemetry & Validation',
      },
      primaryValue: isEn ? '7 Core Entities • 8 Events' : '7 Bảng ERD lõi • 8 Events',
      exactSubValue: isEn
        ? 'Extracted from 36-model prototype • 4-week pilot'
        : 'Tách từ bản mẫu 36 models • Pilot 4 tuần',
      accentBorder: 'hover:border-[#FFD14C]/60',
    },
  ];

  return (
    <header className="relative w-full rounded-3xl border border-slate-200 bg-white dark:border-slate-800/90 p-5 sm:p-7 overflow-hidden space-y-5 dark:bg-slate-950 transition-colors duration-200">
      {/* HERO HEADLINE */}
      <div className="relative space-y-2.5 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="inline-flex flex-wrap items-center gap-2 rounded-xl bg-[#C8EEF7]/45 border border-[#9BE7FA] px-3 py-1 text-xs font-bold text-[#074553] dark:bg-[#9BE7FA]/15 dark:border-[#9BE7FA]/40 dark:text-[#9BE7FA] tabular-nums">
            {isEn
              ? 'Technical BA Case Study • Pre-launch spec & prototype (171 unit tests)'
              : 'Case Study Technical BA • Đặc tả trước Go-Live & bản mẫu (171 unit tests)'}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/projects/library-bus/brd"
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] px-3.5 py-2 text-xs font-bold text-slate-950 border border-[#0D7287]/20 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#074553]" aria-hidden="true" />
              <span>{isEn ? 'Mini-BRD & RTM (PDF)' : 'Tài liệu Mini-BRD & RTM (PDF)'}</span>
            </Link>
            <a
              href="/library-bus/library_bus_bpmn_tobe.drawio"
              download
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#FFE485]/60 hover:bg-[#FFE485] px-3.5 py-2 text-xs font-bold text-amber-950 border border-[#FFD14C] dark:bg-[#FFD14C]/15 dark:hover:bg-[#FFD14C]/25 dark:text-[#FFE485] dark:border-[#FFD14C]/40 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-800 dark:text-[#FFD14C]" aria-hidden="true" />
              <span>{isEn ? 'BPMN Diagram (.drawio)' : 'Sơ đồ BPMN (.drawio)'}</span>
            </a>
          </div>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
          {isEn ? (
            <>
              Library Bus:{' '}
              <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                Technical BA, Core Data Model &amp; Tracking Plan
              </span>
            </>
          ) : (
            <>
              Library Bus:{' '}
              <span className="text-[#0D7287] dark:text-[#9BE7FA]">
                Phân Tích Nghiệp Vụ, Mô Hình Dữ Liệu &amp; Tracking Plan
              </span>
            </>
          )}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {isEn
            ? 'Core question: How do we standardize mobile library bus circulation to prevent last-copy double-booking, manage 7-day waitlists, enforce fair overdue fines, and measure route demand before live launch? Solved through Mini-BRD rules (BR-01..04), a normalized 7-entity ERD, an 8-event Tracking Plan, and a 4-week pilot framework.'
            : 'Câu hỏi nghiệp vụ: Làm sao chuẩn hóa quy trình mượn trả cho xe thư viện lưu động nhằm chặn đặt trùng bản sách cuối, điều phối hàng đợi 7 ngày, minh bạch phí phạt và đo nhu cầu từng tuyến trước khi Go-Live? Dự án giải quyết qua Mini-BRD (BR-01..04), ERD lõi 7 thực thể, Tracking Plan 8 sự kiện và khung thí điểm 4 tuần.'}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
          {isEn
            ? 'Scope disclosure: This is a pre-launch Technical BA specification backed by an academic Django/MySQL prototype (171 automated tests). No live circulation traffic exists yet; persona splits and dashboard mockups are design assumptions, validated via the 4-week pilot criteria below.'
            : 'Minh bạch phạm vi: Đây là hồ sơ Technical BA trước vận hành thật, đối chiếu với bản mẫu đồ án Django/MySQL (171 unit tests). Chưa có dữ liệu độc giả thực địa; tỷ trọng Persona và màn hình mẫu là giả định thiết kế, sẽ được kiểm chứng theo bộ ngưỡng Pilot 4 tuần bên dưới.'}
        </p>
      </div>

      {/* 4 COMPACT KPI CARDS */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {libraryBusKpiCards.map((card) => (
          <div
            key={card.id}
            className={`p-4 rounded-2xl bg-slate-50/60 border border-slate-200 dark:bg-slate-900/70 dark:border-slate-800/90 transition-colors duration-200 space-y-1 ${card.accentBorder}`}
          >
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {card.title[lang]}
            </p>
            <div className="text-lg sm:text-xl font-extrabold tabular-nums text-slate-950 dark:text-white tracking-tight">
              {card.primaryValue}
            </div>
            <p className="text-xs tabular-nums font-medium text-[#074553] dark:text-[#9BE7FA]">
              {card.exactSubValue}
            </p>
          </div>
        ))}
      </div>
    </header>
  );
}

export default LibraryBusHero;
