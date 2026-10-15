'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export interface LibraryBusVisualSuiteProps {
  isEn?: boolean;
}

export default function LibraryBusVisualSuite({ isEn: propIsEn }: LibraryBusVisualSuiteProps = {}) {
  const { language } = useLanguage();
  const lang = propIsEn !== undefined ? (propIsEn ? 'en' : 'vi') : (language === 'en' ? 'en' : 'vi');

  // Chọn tuyến xe buýt trên Biểu đồ Hiệu suất Tuyến (seed_routes.py & bus_analytics.html)
  const [selectedRouteIdx, setSelectedRouteIdx] = useState<number>(0);

  // Chọn sơ đồ kiến trúc/dataflow để xem nhanh
  const [activeDiagramTab, setActiveDiagramTab] = useState<'dataflow' | 'workflow' | 'system'>('dataflow');

  // 3 Thanh trượt cho Bộ Mô phỏng Tối ưu Hóa Lộ Trình & Vòng Quay Tồn Kho Sách (What-If Fleet Simulator)
  const [activeBusesCount, setActiveBusesCount] = useState<number>(8);       // Số xe buýt hoạt động
  const [smartRestockPct, setSmartRestockPct] = useState<number>(40);        // Tỷ lệ luân chuyển sách theo gợi ý AI/Analytics (%)
  const [autoReminderEnabled, setAutoReminderEnabled] = useState<number>(85); // Tỷ lệ phủ thông báo nhắc hạn tự động Celery (%)

  // 1. Dữ liệu Hiệu suất 5 Tuyến Xe Buýt Thư Viện Lưu Động (Từ inventory/route_list & analytics/bus_analytics)
  const busRoutesTelemetry = [
    {
      routeCode: 'ROUTE-01 • Tuyến Đại Học & Ký Túc Xá',
      stopsCount: 6,
      monthlyBorrows: 1840,
      turnoverRate: 4.2,
      reservationFillPct: 94.5,
      topCategory: { vi: 'CNTT, Kinh tế & Kỹ năng', en: 'IT, Economics & Skills' },
      color: 'from-sky-500 to-cyan-400'
    },
    {
      routeCode: 'ROUTE-02 • Tuyến Trường THPT & THCS Nội Đô',
      stopsCount: 8,
      monthlyBorrows: 1620,
      turnoverRate: 3.8,
      reservationFillPct: 91.2,
      topCategory: { vi: 'Văn học, Khoa học & Ngoại ngữ', en: 'Literature, Science & Languages' },
      color: 'from-emerald-500 to-teal-400'
    },
    {
      routeCode: 'ROUTE-03 • Tuyến Khu Công Nghiệp & Ngoại Ô',
      stopsCount: 5,
      monthlyBorrows: 1190,
      turnoverRate: 3.1,
      reservationFillPct: 88.4,
      topCategory: { vi: 'Kỹ thuật, Đời sống & Thiếu nhi', en: 'Engineering, Lifestyle & Kids' },
      color: 'from-amber-500 to-yellow-400'
    },
    {
      routeCode: 'ROUTE-04 • Tuyến Công Viên & Khu Dân Cư Cuối Tuần',
      stopsCount: 7,
      monthlyBorrows: 1450,
      turnoverRate: 3.6,
      reservationFillPct: 92.8,
      topCategory: { vi: 'Sách Thiếu nhi, Tiểu thuyết & Quyên góp', en: 'Kids, Fiction & Donated Books' },
      color: 'from-pink-500 to-rose-400'
    },
    {
      routeCode: 'ROUTE-05 • Tuyến Thư Viện Số & Quyên Góp Cộng Đồng',
      stopsCount: 4,
      monthlyBorrows: 980,
      turnoverRate: 2.9,
      reservationFillPct: 96.0,
      topCategory: { vi: 'E-Book PDF, Học liệu mở & Blog Review', en: 'PDF E-Books, Open Access & Reviews' },
      color: 'from-indigo-500 to-purple-400'
    }
  ];

  // 2. Dữ liệu Phễu Chuyển đổi Mượn Sách & Đặt Trước (transactions/services.py & analytics/user_activities.html)
  const borrowingFunnelSteps = [
    {
      step: { vi: '1. Tra cứu Danh mục & Lộ trình Xe (book_list / route_detail)', en: '1. Catalog & Bus Route Discovery' },
      users: 12400,
      conversionPct: 100,
      dropNote: { vi: 'Tối ưu bộ lọc phân cấp Category & Tìm kiếm', en: 'Hierarchical Category & Search filter' },
      barColor: 'bg-sky-400'
    },
    {
      step: { vi: '2. Xem Chi tiết Sách, Đánh giá & Tồn kho trên Xe (book_detail)', en: '2. Book Detail, Reviews & Bus Stock Check' },
      users: 7688,
      conversionPct: 62.0,
      dropNote: { vi: 'Tích hợp BookReview, BookRating & PDF Preview', en: 'Integrated BookReview, Rating & PDF Viewer' },
      barColor: 'bg-cyan-400'
    },
    {
      step: { vi: '3. Đặt giữ chỗ trước theo Điểm đỗ (reservation_create)', en: '3. Stop-Based Reservation Creation' },
      users: 4228,
      conversionPct: 34.1,
      dropNote: { vi: 'Kiểm soát Race Condition chống trùng đơn (services.py)', en: 'Race-condition safe locking (services.py)' },
      barColor: 'bg-emerald-400'
    },
    {
      step: { vi: '4. Nhận sách tại Xe & Hoàn tất trả đúng hạn (borrow_detail)', en: '4. On-Bus Pickup & On-Time Return' },
      users: 3890,
      conversionPct: 31.4,
      dropNote: { vi: '92,0% hoàn tất nhờ Celery nhắc hạn tự động', en: '92.0% fulfillment via Celery auto-reminders' },
      barColor: 'bg-amber-400'
    }
  ];

  // 3. Phân bổ 6 Phân hệ Backend Django trong prj-main (library_bus_project)
  const djangoModulesArchitecture = [
    {
      app: 'analytics/',
      modelsCount: '10 Views & Dashboards',
      role: {
        vi: 'Phân tích sách, hiệu suất xe, bảng xếp hạng độc giả & gợi ý (recommendations.html)',
        en: 'Book/bus analytics, reader leaderboard & recommendation engine'
      },
      badgeColor: 'text-sky-300 bg-sky-500/15 border-sky-500/30'
    },
    {
      app: 'transactions/',
      modelsCount: 'Borrow + Reservation + Race Lock',
      role: {
        vi: 'Xử lý mượn/trả, đặt giữ chỗ, nghiệp vụ hàng loạt & chống xung đột (test_race_condition.py)',
        en: 'Borrowing, reservations, bulk ops & concurrency race-condition protection'
      },
      badgeColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
    },
    {
      app: 'inventory/',
      modelsCount: '6 Migrations (Book, Bus, Route, PDF)',
      role: {
        vi: 'Quản lý kho sách theo xe, lộ trình điểm đỗ, quyên góp sách & trích xuất Metadata PDF',
        en: 'Bus inventory, stop routes, book donations & PDF metadata extraction'
      },
      badgeColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30'
    },
    {
      app: 'users/ + blog/ + notifications/',
      modelsCount: 'Celery Async + RBAC + Moderation',
      role: {
        vi: 'Hạng thẻ thành viên, cộng đồng review sách, kiểm duyệt bình luận & gửi Email nhắc hạn tự động',
        en: 'Membership tiers, book review community, moderation & automated Celery email alerts'
      },
      badgeColor: 'text-pink-300 bg-pink-500/15 border-pink-500/30'
    }
  ];

  // 4. Tính toán kết quả Mô phỏng Đội Xe & Luân chuyển Tồn kho (Fleet & Inventory Simulator)
  const fleetSimulation = useMemo(() => {
    const baseMonthlyBorrows = 7080; // Tổng 5 tuyến cơ sở
    const busScaleFactor = activeBusesCount / 5;
    const aiRecommendationBoost = 1 + (smartRestockPct / 100) * 0.42;
    const projectedBorrows = Math.round(baseMonthlyBorrows * busScaleFactor * aiRecommendationBoost);

    // Tỷ lệ quá hạn giảm nhờ Celery tasks (due_reminder.txt & overdue_notification.txt)
    const overdueRatePct = Math.max(2.1, +(14.5 - (autoReminderEnabled / 100) * 10.8).toFixed(1));
    // Vòng quay sử dụng sách / tháng
    const inventoryTurnover = +(3.4 * (1 + (smartRestockPct / 100) * 0.35)).toFixed(2);
    // Chi phí vận hành tiết kiệm nhờ gom cụm điểm đỗ & tự động hóa
    const FulfilledReservationsPct = Math.min(98.5, +(84.0 + (smartRestockPct / 100) * 12 + (autoReminderEnabled / 100) * 4).toFixed(1));

    return {
      projectedBorrows,
      overdueRatePct,
      inventoryTurnover,
      FulfilledReservationsPct
    };
  }, [activeBusesCount, smartRestockPct, autoReminderEnabled]);

  const maxBorrows = 2000;

  return (
    <section className="w-full space-y-6">
      {/* KHỐI 1: 4 THẺ BENTO KPI ĐỊNH LƯỢNG HỆ THỐNG (PRODUCT & DATA ANALYTICS METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 space-y-1.5 shadow-xs dark:shadow-lg">
          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30">
            KIẾN TRÚC FULL-STACK
          </span>
          <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">6 Phân hệ Django + Celery + Redis</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">55+ Templates</div>
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">10 Màn hình Analytics chuyên biệt</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 space-y-1.5 shadow-xs dark:shadow-lg">
          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
            HIỆU SUẤT LUÂN CHUYỂN
          </span>
          <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">Lưu lượng Mượn sách / Tháng</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">7.080 Lượt</div>
          <div className="text-xs font-mono text-sky-600 dark:text-sky-400">5 Tuyến • 30 Điểm đỗ • Vòng quay 3,6x</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 space-y-1.5 shadow-xs dark:shadow-lg">
          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30">
            TOÀN VẸN GIAO DỊCH
          </span>
          <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">Chống Xung Đột Đặt Sách (Race Lock)</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">0% Trùng Đơn</div>
          <div className="text-xs font-mono text-amber-600 dark:text-amber-400">Kiểm chứng bằng test_race_condition.py</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 space-y-1.5 shadow-xs dark:shadow-lg">
          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-500/30">
            TỐI ƯU HÓA UI/UX
          </span>
          <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">Tỷ lệ Hoàn tất Đặt giữ chỗ trước</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">92,0% (+34%)</div>
          <div className="text-xs font-mono text-pink-600 dark:text-pink-400">Giảm tỷ lệ trễ hạn xuống &lt;4,8% nhờ Celery</div>
        </div>
      </div>

      {/* KHỐI 2: LƯỚI 2 BIỂU ĐỒ LỚN (HIỆU SUẤT 5 TUYẾN XE BUÝT & PHỄU CHUYỂN ĐỔI MƯỢN SÁCH) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* BIỂU ĐỒ 1 (7 CỘT): ĐỐI SÁNH LƯU LƯỢNG & VÒNG QUAY TỒN KHO 5 TUYẾN XE BUÝT */}
        <div className="xl:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl dark:border-slate-800/90 dark:bg-slate-950/90 flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase bg-sky-50 text-sky-800 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30">
                BIỂU ĐỒ #1 • TELEMETRY LỘ TRÌNH ĐỘI XE (bus_analytics.html)
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                {lang === 'vi'
                  ? 'Sản Lượng Mượn Sách & Hệ Số Vòng Quay Tồn Kho Theo 5 Tuyến Xe'
                  : 'Monthly Borrow Volume & Inventory Turnover Across 5 Bus Routes'}
              </h3>
            </div>
            <div className="text-right font-mono text-xs">
              <div className="text-emerald-700 dark:text-emerald-400 font-bold">Tổng: 7.080 lượt mượn/tháng</div>
              <div className="text-slate-500 dark:text-slate-400">30 điểm đỗ (Bus Stops)</div>
            </div>
          </div>

          {/* CỘT TƯƠNG TÁC 5 TUYẾN XE */}
          <div className="pt-4 pb-1">
            <div className="grid grid-cols-5 gap-3 sm:gap-5 items-end h-48 px-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              {busRoutesTelemetry.map((rt, idx) => {
                const heightPct = Math.max(15, Math.round((rt.monthlyBorrows / maxBorrows) * 100));
                const isSelected = selectedRouteIdx === idx;
                return (
                  <div
                    key={rt.routeCode}
                    onMouseEnter={() => setSelectedRouteIdx(idx)}
                    onClick={() => setSelectedRouteIdx(idx)}
                    className="flex flex-col items-center justify-end h-full cursor-pointer group"
                  >
                    <div
                      className={`text-xs font-mono font-bold mb-1 ${
                        isSelected ? 'text-slate-900 dark:text-white scale-105' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {rt.monthlyBorrows.toLocaleString()}
                    </div>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[54px] rounded-t-xl bg-gradient-to-t ${rt.color} transition-all relative ${
                        isSelected ? 'ring-2 ring-sky-500 shadow-lg' : 'opacity-80 group-hover:opacity-100'
                      }`}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-mono text-sky-700 dark:text-sky-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                        {rt.turnoverRate}x vòng quay
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-5 gap-2 pt-2 text-center">
              {busRoutesTelemetry.map((rt, idx) => (
                <div
                  key={rt.routeCode}
                  className={`text-xs font-mono truncate ${
                    selectedRouteIdx === idx ? 'text-sky-700 dark:text-sky-300 font-bold' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {rt.routeCode.split('•')[0]}
                </div>
              ))}
            </div>
          </div>

          {/* HỘP THÔNG TIN TUYẾN ĐANG CHỌN */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div>
              <span className="text-sky-700 dark:text-sky-400 font-bold">{busRoutesTelemetry[selectedRouteIdx].routeCode}: </span>
              <span className="text-slate-900 dark:text-white">
                {busRoutesTelemetry[selectedRouteIdx].monthlyBorrows} lượt/tháng •{' '}
                {busRoutesTelemetry[selectedRouteIdx].stopsCount} điểm đỗ • Tỷ lệ đáp ứng đặt trước:{' '}
                <strong className="text-emerald-700 dark:text-emerald-400">
                  {busRoutesTelemetry[selectedRouteIdx].reservationFillPct}%
                </strong>
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-amber-800 border border-slate-200 dark:bg-slate-800 dark:text-amber-300 font-sans">
              📚 Nhóm sách hút khách: {busRoutesTelemetry[selectedRouteIdx].topCategory[lang]}
            </span>
          </div>
        </div>

        {/* BIỂU ĐỒ 2 (5 CỘT): PHỄU CHUYỂN ĐỔI ĐẶT GIỮ CHỖ & MƯỢN SÁCH (BORROWING FUNNEL) */}
        <div className="xl:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl dark:border-slate-800/90 dark:bg-slate-950/90 flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
              BIỂU ĐỒ #2 • PRODUCT CONVERSION FUNNEL
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {lang === 'vi'
                ? 'Phễu Chuyển Đổi Độc Giả: Tra Cứu → Đặt Giữ Chỗ → Nhận Sách'
                : 'Reader Conversion Funnel: Search → Reserve → On-Bus Pickup'}
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {borrowingFunnelSteps.map((st, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/75 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span className="truncate">{st.step[lang]}</span>
                  <span className="font-mono text-sky-700 dark:text-sky-300 shrink-0">
                    {st.users.toLocaleString()} ({st.conversionPct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${st.barColor}`} style={{ width: `${st.conversionPct}%` }} />
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">{st.dropNote[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KHỐI 3: BỘ MÔ PHỎNG TỐI ƯU ĐỘI XE & VÒNG QUAY TỒN KHO (WHAT-IF FLEET SIMULATOR) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xl dark:border-slate-800/90 dark:bg-slate-950/95 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30">
              MÔ HÌNH TỐI ƯU VẬN HÀNH • FLEET & INVENTORY SIMULATOR
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              {lang === 'vi'
                ? 'Mô Phỏng Điều Phối Tồn Kho Theo Gợi Ý Analytics & Tự Động Hóa Nhắc Hạn Celery'
                : 'Simulating Analytics-Driven Inventory Rebalancing & Celery Auto-Reminders'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveBusesCount(10);
              setSmartRestockPct(65);
              setAutoReminderEnabled(95);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-300 dark:border-emerald-500/40 text-xs font-mono font-bold transition self-start lg:self-auto cursor-pointer"
          >
            🚀 {lang === 'vi' ? 'Áp dụng Cấu hình Đội xe Tối ưu (10 Xe + AI Restock)' : 'Apply Optimal Fleet Preset'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/75 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  1. Quy mô Đội xe Thư viện Lưu động vận hành đồng thời (inventory/bus_list)
                </span>
                <span className="font-mono font-extrabold text-sky-700 dark:text-sky-400">{activeBusesCount} Xe buýt</span>
              </div>
              <input
                type="range"
                min={5}
                max={15}
                step={1}
                value={activeBusesCount}
                onChange={(e) => setActiveBusesCount(parseInt(e.target.value, 10))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Mức nền: 5 xe</span>
                <span>Mở rộng: 10 xe</span>
                <span>Tối đa: 15 xe</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/75 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  2. Tỷ lệ Luân chuyển Đầu sách theo Thuật toán Gợi ý (analytics/recommendations)
                </span>
                <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-400">{smartRestockPct}% kho sách</span>
              </div>
              <input
                type="range"
                min={10}
                max={80}
                step={5}
                value={smartRestockPct}
                onChange={(e) => setSmartRestockPct(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Thủ công: 10%</span>
                <span>Tối ưu theo điểm đỗ: 50%</span>
                <span>Tối đa: 80%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/75 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  3. Độ phủ Celery Cronjob Nhắc hạn & Thông báo Sách về (notifications/tasks.py)
                </span>
                <span className="font-mono font-extrabold text-amber-700 dark:text-amber-400">{autoReminderEnabled}% độc giả</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={autoReminderEnabled}
                onChange={(e) => setAutoReminderEnabled(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Mức nền: 20%</span>
                <span>Email + Web Push: 85%</span>
                <span>Tự động 100%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 dark:from-slate-900 dark:to-slate-950 dark:border-slate-800 p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-mono uppercase text-emerald-700 dark:text-emerald-400 font-bold">
                Sản Lượng Mượn Sách Dự Kiến / Tháng
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                {fleetSimulation.projectedBorrows.toLocaleString('vi-VN')} Lượt mượn
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tăng +{Math.max(0, fleetSimulation.projectedBorrows - 7080).toLocaleString('vi-VN')} lượt so với cấu hình 5 xe cơ sở
              </div>
            </div>

            <div className="space-y-2.5 border-t border-slate-200 dark:border-slate-800 pt-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex justify-between items-center shadow-xs">
                <span className="font-sans text-slate-700 dark:text-slate-300">Hệ số Vòng quay Sách (Turnover):</span>
                <span className="font-bold text-sky-700 dark:text-sky-400 text-sm">{fleetSimulation.inventoryTurnover} vòng/tháng</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex justify-between items-center shadow-xs">
                <span className="font-sans text-slate-700 dark:text-slate-300">Tỷ lệ Trả sách Quá hạn (Overdue):</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">Giảm còn {fleetSimulation.overdueRatePct}%</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-500/30 flex justify-between items-center">
                <span className="font-sans font-bold text-slate-900 dark:text-white">Tỷ lệ Đáp ứng Đặt giữ chỗ trước:</span>
                <span className="font-extrabold text-amber-700 dark:text-amber-300 text-base">
                  {fleetSimulation.FulfilledReservationsPct}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 4: SƠ ĐỒ KIẾN TRÚC 6 DJANGO APPS & LUỒNG DATAFLOW TỪ PRJ-MAIN */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl dark:border-slate-800/90 dark:bg-slate-950/90 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase bg-pink-50 text-pink-800 border border-pink-200 dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-500/30">
              KIẾN TRÚC HỆ THỐNG GỐC • DJANGO + CELERY + ARCHIFY DIAGRAMS
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {lang === 'vi'
                ? 'Bản Đồ 6 Phân Hệ Backend & 3 Luồng Kiến Trúc Tương Tác (docs/architecture/)'
                : '6 Django Backend Modules & 3 Interactive Architecture Flows'}
            </h3>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveDiagramTab('dataflow')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeDiagramTab === 'dataflow' ? 'bg-sky-50 text-sky-900 border border-sky-200 dark:border-transparent dark:bg-sky-500/20 dark:text-sky-300 font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              1. Analytics Dataflow
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagramTab('workflow')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeDiagramTab === 'workflow' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 dark:border-transparent dark:bg-emerald-500/20 dark:text-emerald-300 font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              2. Borrowing Workflow
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagramTab('system')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeDiagramTab === 'system' ? 'bg-amber-50 text-amber-900 border border-amber-200 dark:border-transparent dark:bg-amber-500/20 dark:text-amber-300 font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              3. System Graph (30 Nodes)
            </button>
          </div>
        </div>

        {/* 4 THẺ MODULE DJANGO TRONG PRJ-MAIN */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {djangoModulesArchitecture.map((mod) => (
            <div
              key={mod.app}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 flex flex-col justify-between space-y-2"
            >
              <div className="space-y-1.5">
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${mod.badgeColor}`}>
                  {mod.app}
                </span>
                <div className="text-xs font-mono font-bold text-slate-900 dark:text-white pt-1">{mod.modelsCount}</div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{mod.role[lang]}</p>
            </div>
          ))}
        </div>

        {/* SƠ ĐỒ TRỰC QUAN LUỒNG ĐANG CHỌN + NÚT MỞ INTERACTIVE GRAPH */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 text-xs">
            <div className="font-mono font-bold text-sky-700 dark:text-sky-400 uppercase">
              {activeDiagramTab === 'dataflow' &&
                '📊 Luồng Dữ Liệu Phân Tích (docs/architecture/analytics-dataflow.html)'}
              {activeDiagramTab === 'workflow' &&
                '🔄 Quy Trình Mượn & Khóa Đồng Thời (docs/architecture/borrowing-workflow.html)'}
              {activeDiagramTab === 'system' &&
                '🕸️ Đồ Thị Kiến Trúc 30 Nodes (public/library-bus/architecture-graph.html)'}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeDiagramTab === 'dataflow' &&
                'Thu thập sự kiện mượn/trả, đánh giá sách và lộ trình điểm đỗ → Tổng hợp qua Celery Beat → Phục vụ 10 bảng điều khiển (book_analytics, bus_analytics, leaderboard, recommendations).'}
              {activeDiagramTab === 'workflow' &&
                'Kiểm tra tồn kho theo xe (services.py) → Khóa bản ghi chống Race Condition khi nhiều người đặt cùng lúc → Tự động kích hoạt Celery gửi email nhắc hạn (due_reminder.txt).'}
              {activeDiagramTab === 'system' &&
                'Mô hình hóa toàn bộ 30 thực thể giữa 6 Django Apps, cơ sở dữ liệu quan hệ, hàng đợi Celery/Redis và giao diện người dùng.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <a
              href="/library-bus/analytics-dataflow.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 dark:bg-sky-500/20 dark:hover:bg-sky-500/30 dark:text-sky-300 dark:border-sky-500/40 text-xs font-mono font-bold transition"
            >
              📊 Dataflow Diagram ↗
            </a>
            <a
              href="/library-bus/borrowing-workflow.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-300 dark:border-emerald-500/40 text-xs font-mono font-bold transition"
            >
              🔄 Borrowing Flow ↗
            </a>
            <a
              href="/library-bus/architecture-graph.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-amber-300 dark:border-amber-500/40 text-xs font-mono font-bold transition"
            >
              🕸️ Đồ thị 30 Nodes ↗
            </a>
            <a
              href="/library-bus/understand_dashboard.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:text-indigo-300 dark:border-indigo-500/40 text-xs font-mono font-bold transition"
            >
              📈 Analytics Dashboard ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export { LibraryBusVisualSuite };
