'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Columns2,
  FileCode2,
  LayoutGrid,
  Maximize2,
  Monitor,
  Smartphone,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface VisualComparisonProps {
  isEn?: boolean;
  onOpenZoom?: (_imgUrl: string) => void;
}

export interface ScreenPairItem {
  id: string;
  num: number;
  nameVi: string;
  nameEn: string;
  slug: string;
  route: string;
  mobId: string;
  desktopHw: number;
  mobileHw: number;
  traceVi: string;
  traceEn: string;
  desktop: {
    wf: string;
    ui: string;
    dimLabel: string;
  };
  mobile: {
    wf: string;
    ui: string;
    dimLabel: string;
  };
}

const RAW_11_SPECS = [
  {
    id: '1',
    num: 1,
    nameVi: 'Trang chủ',
    nameEn: 'Homepage',
    slug: '01_trang_chu',
    route: '/',
    deskDim: '1440×3395',
    mobDim: '390×2586',
    deskHw: 2.36,
    mobHw: 6.63,
    traceVi: 'Đọc cache Redis 7 (CacheMixin) • Hiển thị KPI toàn mạng lưới & top sách BookAnalytics.popularity_score cao nhất',
    traceEn: 'Reads versioned Redis 7 cache (CacheMixin) • Displays network KPIs & top BookAnalytics.popularity_score titles',
  },
  {
    id: '2',
    num: 2,
    nameVi: 'Giới thiệu',
    nameEn: 'About Us',
    slug: '02_gioi_thieu',
    route: '/about/',
    deskDim: '1440×3120',
    mobDim: '390×2775',
    deskHw: 2.17,
    mobHw: 7.12,
    traceVi: 'Tĩnh / CacheMixin • Giới thiệu sứ mệnh mạng lưới xe thư viện lưu động & 5 mục tiêu phục vụ độc giả',
    traceEn: 'Static / CacheMixin • Presents mobile library bus network mission & 5 community service goals',
  },
  {
    id: '3',
    num: 3,
    nameVi: 'Kho sách thư viện',
    nameEn: 'Book Catalog',
    slug: '03_kho_sach',
    route: '/inventory/books/',
    deskDim: '1440×1836',
    mobDim: '390×760',
    deskHw: 1.28,
    mobHw: 1.95,
    traceVi: 'Truy vấn MySQL 8.0 inventory_book + inventory_category • Lọc trạng thái tồn kho available_copies theo từng xe buýt',
    traceEn: 'Queries MySQL 8.0 inventory_book + inventory_category • Filters bus-level available_copies stock badges',
  },
  {
    id: '4',
    num: 4,
    nameVi: 'Chi tiết sách',
    nameEn: 'Book Detail',
    slug: '04_chi_tiet_sach',
    route: '/inventory/books/<uuid>/',
    deskDim: '1440×1140',
    mobDim: '390×1865',
    deskHw: 0.79,
    mobHw: 4.78,
    traceVi: 'Gọi API track_book_view (ghi UserActivity view_book) • Bấm Mượn kích hoạt BR-01 (select_for_update()) hoặc BR-02 (Đặt trước FIFO)',
    traceEn: 'Calls track_book_view (logs UserActivity view_book) • Borrow CTA triggers BR-01 (select_for_update()) or BR-02 (FIFO Reservation)',
  },
  {
    id: '5',
    num: 5,
    nameVi: 'Quyên góp & Trao tặng sách',
    nameEn: 'Book Donation Form',
    slug: '05_quyen_gop_sach',
    route: '/inventory/books/donate/',
    deskDim: '1440×900',
    mobDim: '390×944',
    deskHw: 0.63,
    mobHw: 2.42,
    traceVi: 'Tạo bản ghi BookDonation trạng thái PENDING • Trích xuất metadata ISBN bằng Gemini AI (GĐ 2 mở rộng / Prototype) trước khi thủ thư duyệt nhập kho xe',
    traceEn: 'Creates PENDING BookDonation record • Uses Gemini AI ISBN extraction (Phase 2 extension / Prototype) before librarian physical intake',
  },
  {
    id: '6',
    num: 6,
    nameVi: 'Mạng lưới xe buýt lưu động',
    nameEn: 'Mobile Bus Fleet Map',
    slug: '06_danh_sach_chuyen_xe',
    route: '/inventory/buses/',
    deskDim: '1440×900',
    mobDim: '390×743',
    deskHw: 0.63,
    mobHw: 1.91,
    traceVi: 'Hiển thị lịch trình điểm dừng công bố (không cần GPS phần cứng GĐ 1) • Ghi nhận sự kiện bus_visit phục vụ đo lượt mượn/lượt ghé (borrows_per_visit)',
    traceEn: 'Shows published stop timetables (no Phase 1 hardware GPS) • Logs bus_visit event for uncapped borrows_per_visit route KPI',
  },
  {
    id: '7',
    num: 7,
    nameVi: 'Lộ trình & Điểm đón xe',
    nameEn: 'Route & Stop Schedule',
    slug: '07_chi_tiet_lo_trinh',
    route: '/inventory/routes/<uuid>/',
    deskDim: '1440×1191',
    mobDim: '390×1300',
    deskHw: 0.83,
    mobHw: 3.33,
    traceVi: 'Thực thi BR-02 • Gắn preferred_pickup_location_id vào BookReservation (giữ chỗ 7 ngày tính từ lúc sách về trạm, Celery Beat quét 30 phút/lần)',
    traceEn: 'Enforces BR-02 • Links preferred_pickup_location_id on BookReservation (7-day hold from stop arrival, 30m Celery scan)',
  },
  {
    id: '8',
    num: 8,
    nameVi: 'Hồ sơ cá nhân & Thẻ thư viện',
    nameEn: 'Reader Profile & Pass',
    slug: '08_ho_so_ban_doc',
    route: '/users/profile/',
    deskDim: '1440×978',
    mobDim: '390×844',
    deskHw: 0.68,
    mobHw: 2.16,
    traceVi: 'Thực thi BR-03 (Gia hạn +14 ngày trong 3 ngày cuối, renewal_count < 2) • Hạn mức mượn theo hạng basic (3) / premium (5) / vip (10)',
    traceEn: 'Enforces BR-03 (+14d renewal in final 3 days, renewal_count < 2) • Tiered active caps: basic (3) / premium (5) / vip (10)',
  },
  {
    id: '9',
    num: 9,
    nameVi: 'Quản lý mượn trả sách',
    nameEn: 'Borrow & Return Management',
    slug: '09_quan_ly_muon_tra',
    route: '/transactions/borrows/',
    deskDim: '1440×1218',
    mobDim: '390×1182',
    deskHw: 0.85,
    mobHw: 3.03,
    traceVi: 'Thực thi BR-04 (Phạt 3 bậc 5k/10k/15k, trần 100% giá thay thế sách) • Ghi nhận trả chéo tuyến (IN_TRANSIT) và đồng bộ sự kiện return/fine_applied',
    traceEn: 'Enforces BR-04 (3-tier fines 5k/10k/15k capped at 100% replacement value) • Supports cross-bus returns (IN_TRANSIT) and logs return/fine_applied',
  },
  {
    id: '10',
    num: 10,
    nameVi: 'Báo cáo phân tích dữ liệu',
    nameEn: 'Analytics Dashboard',
    slug: '10_analytics_dashboard',
    route: '/analytics/',
    deskDim: '1440×1644',
    mobDim: '390×1494',
    deskHw: 1.14,
    mobHw: 3.83,
    traceVi: 'GĐ 1.5 tổng hợp DailyStats (00:15): tỷ lệ nhận đặt trước đủ 7 ngày chín, borrows_per_visit và stockout theo tuyến (Phễu gợi ý 5 thuật toán tách sang GĐ 2)',
    traceEn: 'Phase 1.5 aggregates DailyStats (00:15): matured 7d pickup rate, uncapped borrows_per_visit, and route stockouts (5-algorithm rec funnel decoupled to Phase 2)',
  },
  {
    id: '11',
    num: 11,
    nameVi: 'Trung tâm quản trị Django Admin',
    nameEn: 'Django Admin Center',
    slug: '11_django_admin',
    route: '/admin/',
    deskDim: '1440×2149',
    mobDim: '390×1442',
    deskHw: 1.49,
    mobHw: 3.70,
    traceVi: 'Quản trị 7 phân hệ (36 Models) • Duyệt giảm giá phạt FinePayment (0–100% có log AuditMixin) & kiểm tra kho lạnh ArchivedUserActivity',
    traceEn: 'Manages 7 apps (36 Models) • Approves FinePayment waivers (0–100% with AuditMixin log) & inspects ArchivedUserActivity',
  },
];

export const SCREENS_11_PAIRS: ScreenPairItem[] = RAW_11_SPECS.map((s) => ({
  id: s.id,
  num: s.num,
  nameVi: s.nameVi,
  nameEn: s.nameEn,
  slug: s.slug,
  route: s.route,
  mobId: s.slug.slice(0, 2),
  desktopHw: s.deskHw,
  mobileHw: s.mobHw,
  traceVi: s.traceVi,
  traceEn: s.traceEn,
  desktop: {
    wf: `/library-bus/screens/wf_${s.slug}.webp`,
    ui: `/library-bus/screens/screen_${s.slug}.webp`,
    dimLabel: s.deskDim,
  },
  mobile: {
    wf: `/library-bus/screens/wf_mobile_${s.slug}.webp`,
    ui: `/library-bus/screens/screen_mobile_${s.slug}.webp`,
    dimLabel: s.mobDim,
  },
}));

export const SCREENS_20_PAIRS = SCREENS_11_PAIRS;

export default function LibraryBusVisualComparison({
  isEn: propIsEn,
  onOpenZoom,
}: VisualComparisonProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';

  // Active screen in Master-Detail (1..11)
  const [activeScreenId, setActiveScreenId] = useState<string>('4');
  // Viewport toggle: 'desktop' (1440px) | 'mobile' (390px)
  const [platformTab, setPlatformTab] = useState<'desktop' | 'mobile'>('desktop');
  // Display mode toggle: 'split' (Wireframe + UI side-by-side) | 'wf' (Wireframe only) | 'ui' (UI only)
  const [displayMode, setDisplayMode] = useState<'split' | 'wf' | 'ui'>('split');
  // Optional full 11-screen gallery expansion (collapsed by default to cut ~75% vertical height)
  const [showAll11Grid, setShowAll11Grid] = useState<boolean>(false);

  // Lightbox modal state
  const [lightboxImg, setLightboxImg] = useState<{
    src: string;
    title: string;
    subtitle: string;
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    const handleCustomScreenSelect = (e: Event) => {
      const customEvt = e as CustomEvent<string | { screenId: string }>;
      const rawId =
        typeof customEvt.detail === 'string'
          ? customEvt.detail
          : customEvt.detail?.screenId;
      if (!rawId) return;
      const cleanNum =
        rawId
          .trim()
          .replace(/^#/, '')
          .replace(/^screen-/, '')
          .replace(/^mob_/, '')
          .replace(/^0+/, '') || '1';
      setActiveScreenId(cleanNum);
      const containerEl = document.getElementById('visual-comparison');
      if (containerEl) {
        containerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.addEventListener('select-library-bus-screen', handleCustomScreenSelect);
    return () =>
      window.removeEventListener('select-library-bus-screen', handleCustomScreenSelect);
  }, []);

  const activeItem =
    SCREENS_11_PAIRS.find((s) => s.id === activeScreenId) || SCREENS_11_PAIRS[0];
  const activeIdx = SCREENS_11_PAIRS.findIndex((s) => s.id === activeItem.id);
  const currentPair =
    platformTab === 'desktop' ? activeItem.desktop : activeItem.mobile;

  const handleOpenLightbox = (src: string, title: string, subtitle: string) => {
    if (onOpenZoom) {
      onOpenZoom(src);
    } else {
      setLightboxImg({ src, title, subtitle });
      setZoomLevel(1);
    }
  };

  return (
    <section id="visual-comparison" className="space-y-5 scroll-mt-28">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center rounded-md bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 px-2.5 py-0.5 text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
            {isEn
              ? 'Section 03 · Master–Detail 11 Core Screen Flows (44 Wireframe & UI Views)'
              : 'Phần 03 · Khung Master–Detail 11 Cặp Màn Hình Cốt Lõi (44 Bản Vẽ Wireframe & UI)'}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isEn
              ? 'Interactive Master–Detail Inspector with Backend & Telemetry Trace'
              : 'Đối chiếu Wireframe – UI gắn liền Dấu vết Nghiệp vụ & API Telemetry'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={
              platformTab === 'desktop'
                ? '/library-bus/website.html'
                : '/library-bus/website-mobile.html'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <FileCode2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>{platformTab === 'desktop' ? 'HTML Spec (1440px)' : 'Mobile Spec (390px)'}</span>
          </a>
        </div>
      </div>

      {/* KHUNG MASTER-DETAIL DUY NHẤT: CỘT TRÁI 11 MÀN HÌNH | CỘT PHẢI MÀN HÌNH ĐANG CHỌN + 2 NÚT GẠT + DẤU VẾT NGHIỆP VỤ */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* CỘT TRÁI (4 CỘT): DANH SÁCH 11 MÀN HÌNH CỐT LÕI */}
          <div className="lg:col-span-4 space-y-2">
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {isEn ? 'Select 1 of 11 Core Screens:' : 'Chọn 1 trong 11 màn hình cốt lõi:'}
              </span>
              <span className="text-xs font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA] tabular-nums">
                {activeItem.num}/11
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
              {SCREENS_11_PAIRS.map((s) => {
                const isSelected = s.id === activeItem.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveScreenId(s.id)}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-left transition flex items-center justify-between gap-2 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#9BE7FA] text-slate-950 border-[#9BE7FA] font-bold'
                        : 'bg-slate-50/80 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-[#0D7287]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black tabular-nums shrink-0 ${
                          isSelected
                            ? 'bg-slate-950 text-[#9BE7FA]'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {String(s.num).padStart(2, '0')}
                      </span>
                      <span className="text-xs truncate">
                        {isEn ? s.nameEn : s.nameVi}
                      </span>
                    </div>
                    <code
                      className={`text-[11px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                        isSelected
                          ? 'bg-slate-950/15 text-slate-950 font-bold'
                          : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {s.route}
                    </code>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI (8 CỘT): KHUNG HIỂN THỊ CẶP MÀN HÌNH ĐANG CHỌN + 2 NÚT GẠT + DẤU VẾT NGHIỆP VỤ */}
          <div className="lg:col-span-8 space-y-4">
            {/* Thanh công cụ 2 nút gạt: [Wireframe + UI | Wireframe | UI] và [Desktop 1440px | Mobile 390px] */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 text-xs font-black tabular-nums">
                    #{String(activeItem.num).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isEn ? activeItem.nameEn : activeItem.nameVi}
                  </h3>
                  <code className="text-xs font-mono text-[#0D7287] dark:text-[#9BE7FA] font-semibold">
                    {activeItem.route}
                  </code>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Nút gạt 1: Chế độ xem [Song song | Wireframe | UI] */}
                <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1">
                  {(
                    [
                      { id: 'split', labelVi: 'Wireframe + UI', labelEn: 'Side-by-Side' },
                      { id: 'wf', labelVi: 'Wireframe', labelEn: 'Wireframe' },
                      { id: 'ui', labelVi: 'UI Design', labelEn: 'UI Design' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setDisplayMode(m.id)}
                      className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        displayMode === m.id
                          ? 'bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isEn ? m.labelEn : m.labelVi}
                    </button>
                  ))}
                </div>

                {/* Nút gạt 2: Khung nhìn [Desktop 1440px | Mobile 390px] */}
                <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1">
                  <button
                    type="button"
                    onClick={() => setPlatformTab('desktop')}
                    className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      platformTab === 'desktop'
                        ? 'bg-slate-900 text-white dark:bg-[#9BE7FA] dark:text-slate-950'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop 1440px</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatformTab('mobile')}
                    className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      platformTab === 'mobile'
                        ? 'bg-slate-900 text-white dark:bg-[#9BE7FA] dark:text-slate-950'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile 390px</span>
                  </button>
                </div>
              </div>
            </div>

            {/* DẤU VẾT NGHIỆP VỤ & TELEMETRY NGAY TRÊN / DƯỚI ẢNH */}
            <div className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-[#C8EEF7]/20 dark:bg-slate-950/80 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-start sm:items-center gap-2">
                <Activity className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <strong className="text-slate-900 dark:text-white">
                    {isEn ? 'Backend & Telemetry Trace: ' : 'Dấu vết Nghiệp vụ & Telemetry: '}
                  </strong>
                  <span className="text-slate-700 dark:text-slate-200">
                    {isEn ? activeItem.traceEn : activeItem.traceVi}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    const prev =
                      activeIdx > 0 ? activeIdx - 1 : SCREENS_11_PAIRS.length - 1;
                    setActiveScreenId(SCREENS_11_PAIRS[prev].id);
                  }}
                  className="min-h-[34px] px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#0D7287] flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Prev' : 'Trước'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next =
                      activeIdx < SCREENS_11_PAIRS.length - 1 ? activeIdx + 1 : 0;
                    setActiveScreenId(SCREENS_11_PAIRS[next].id);
                  }}
                  className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>{isEn ? 'Next' : 'Tiếp'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Khung ảnh Master-Detail (Có giới hạn chiều cao max-h-[640px] cuộn mượt hoặc phóng to Lightbox) */}
            <div
              className={`grid gap-4 items-start ${
                displayMode === 'split' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {(displayMode === 'split' || displayMode === 'wf') && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
                    <span>
                      Wireframe ({currentPair.dimLabel})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenLightbox(
                          currentPair.wf,
                          `${activeItem.num}. ${activeItem.nameVi} - Wireframe`,
                          platformTab === 'desktop'
                            ? 'Desktop 1440px Structural Wireframe'
                            : 'Mobile 390px Structural Wireframe'
                        )
                      }
                      className="inline-flex items-center gap-1 text-[#0D7287] dark:text-[#9BE7FA] hover:underline cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Zoom' : 'Phóng to'}</span>
                    </button>
                  </div>
                  <div
                    className="max-h-[560px] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 cursor-zoom-in"
                    onClick={() =>
                      handleOpenLightbox(
                        currentPair.wf,
                        `${activeItem.num}. ${activeItem.nameVi} - Wireframe`,
                        platformTab === 'desktop'
                          ? 'Desktop 1440px Structural Wireframe'
                          : 'Mobile 390px Structural Wireframe'
                      )
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentPair.wf}
                      alt={`Wireframe ${activeItem.nameVi}`}
                      className={`h-auto block mx-auto ${
                        platformTab === 'mobile' && displayMode !== 'split'
                          ? 'max-w-[390px] w-full'
                          : 'w-full'
                      }`}
                    />
                  </div>
                </div>
              )}

              {(displayMode === 'split' || displayMode === 'ui') && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA] px-1">
                    <span>
                      UI Design ({currentPair.dimLabel})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenLightbox(
                          currentPair.ui,
                          `${activeItem.num}. ${activeItem.nameVi} - UI Design`,
                          platformTab === 'desktop'
                            ? 'Desktop 1440px High-Fidelity UI'
                            : 'Mobile 390px High-Fidelity UI'
                        )
                      }
                      className="inline-flex items-center gap-1 text-[#0D7287] dark:text-[#9BE7FA] hover:underline cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Zoom' : 'Phóng to'}</span>
                    </button>
                  </div>
                  <div
                    className="max-h-[560px] overflow-y-auto rounded-2xl border border-[#9BE7FA]/60 dark:border-slate-800 bg-[#FFFDF9] dark:bg-slate-950 cursor-zoom-in"
                    onClick={() =>
                      handleOpenLightbox(
                        currentPair.ui,
                        `${activeItem.num}. ${activeItem.nameVi} - UI Design`,
                        platformTab === 'desktop'
                          ? 'Desktop 1440px High-Fidelity UI'
                          : 'Mobile 390px High-Fidelity UI'
                      )
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentPair.ui}
                      alt={`UI Design ${activeItem.nameVi}`}
                      className={`h-auto block mx-auto ${
                        platformTab === 'mobile' && displayMode !== 'split'
                          ? 'max-w-[390px] w-full'
                          : 'w-full'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nút tùy chọn mở rộng toàn bộ 11 cặp màn hình nếu người xem muốn lướt toàn cảnh */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-500">
            {isEn
              ? 'Master–Detail mode saves ~75% vertical scroll height while keeping all 44 views accessible.'
              : 'Chế độ Master–Detail giúp rút gọn ~75% chiều dài cuộn trang nhưng vẫn giữ đủ 44 bản thiết kế.'}
          </span>
          <button
            type="button"
            onClick={() => setShowAll11Grid((v) => !v)}
            className="min-h-[38px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#0D7287] inline-flex items-center gap-1.5 cursor-pointer"
          >
            {showAll11Grid ? <Columns2 className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
            <span>
              {showAll11Grid
                ? isEn
                  ? 'Collapse Full 11-Screen Gallery'
                  : 'Thu gọn lưới toàn bộ 11 cặp màn hình'
                : isEn
                ? 'Expand All 11 Screen Pairs at Once'
                : 'Mở xem dàn trải toàn bộ 11 cặp màn hình cùng lúc'}
            </span>
          </button>
        </div>

        {showAll11Grid && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
            {SCREENS_11_PAIRS.map((s) => {
              const pair = platformTab === 'desktop' ? s.desktop : s.mobile;
              return (
                <div
                  key={s.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 p-3 space-y-2 bg-slate-50/50 dark:bg-slate-950/50"
                >
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-slate-900 dark:text-white">
                      #{String(s.num).padStart(2, '0')} {isEn ? s.nameEn : s.nameVi}
                    </strong>
                    <code className="text-[11px] font-mono text-[#0D7287] dark:text-[#9BE7FA]">
                      {s.route}
                    </code>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pair.wf}
                      alt={`WF ${s.nameVi}`}
                      loading="lazy"
                      onClick={() =>
                        handleOpenLightbox(pair.wf, `${s.num}. ${s.nameVi} - Wireframe`, s.route)
                      }
                      className="w-full h-44 object-cover object-top rounded-lg border border-slate-200 dark:border-slate-800 cursor-zoom-in"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pair.ui}
                      alt={`UI ${s.nameVi}`}
                      loading="lazy"
                      onClick={() =>
                        handleOpenLightbox(pair.ui, `${s.num}. ${s.nameVi} - UI Design`, s.route)
                      }
                      className="w-full h-44 object-cover object-top rounded-lg border border-[#9BE7FA]/50 dark:border-slate-800 cursor-zoom-in"
                    />
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {isEn ? s.traceEn : s.traceVi}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl max-w-5xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 className="text-sm font-bold text-white">{lightboxImg.title}</h4>
              <p className="text-xs text-slate-400">{lightboxImg.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-white px-2 tabular-nums">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-auto flex items-start justify-center py-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImg.src}
              alt={lightboxImg.title}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
              className="max-w-4xl w-full h-auto rounded-xl border border-slate-800 transition-transform duration-200"
            />
          </div>
        </div>
      )}
    </section>
  );
}
