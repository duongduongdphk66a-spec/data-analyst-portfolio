'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, Users, BarChart3, MapPin, BookOpen, 
  FileText, Bell, GitBranch, ArrowRight, CheckCircle2, 
  ExternalLink, Layers, Workflow, ClipboardCheck, ShieldAlert
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import SectionHeader from '@/components/ui/SectionHeader';

export interface Chapter1UxResearchProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

interface SitemapRootItem {
  name: string;
  nameEn: string;
  screenId: string;
}

const SITEMAP_ROOT: SitemapRootItem[] = [
  { name: 'Trang chủ & Giới thiệu', nameEn: 'Home & About', screenId: 'screen-01' },
  { name: 'Kho sách & Quyên góp', nameEn: 'Catalog & Donation', screenId: 'screen-03' },
  { name: 'Đội xe & Lộ trình', nameEn: 'Fleet & Routes', screenId: 'screen-06' },
  { name: 'Hồ sơ & Thẻ thư viện', nameEn: 'Reader Profile & Pass', screenId: 'screen-08' },
  { name: 'Quản lý Mượn / Trả', nameEn: 'Borrow & Return Ops', screenId: 'screen-09' },
  { name: 'Analytics & Django Admin', nameEn: 'Analytics & Admin', screenId: 'screen-10' },
];

interface SitemapSubItem {
  label: string;
  labelEn: string;
  screenId: string;
}

interface SitemapDetailChild {
  label: string;
  labelEn: string;
  screenId: string;
  sub?: SitemapSubItem[];
}

interface SitemapDetailGroup {
  parent: string;
  parentEn: string;
  screenId: string;
  children: SitemapDetailChild[];
}

const SITEMAP_DETAILS: SitemapDetailGroup[] = [
  {
    parent: 'Trang chủ & Giới thiệu',
    parentEn: 'Home & About',
    screenId: 'screen-01',
    children: [
      {
        label: 'Trang chủ (/)',
        labelEn: 'Homepage (/)',
        screenId: 'screen-01',
        sub: [
          { label: 'Thống kê quy mô & Sách mới', labelEn: 'Scale KPIs & New Books', screenId: 'screen-01' },
          { label: 'Góc nhìn & Hoạt động', labelEn: 'Community Perspectives', screenId: 'screen-01' },
        ],
      },
      {
        label: 'Giới thiệu dự án (/about/)',
        labelEn: 'About Project (/about/)',
        screenId: 'screen-02',
        sub: [
          { label: 'Khởi nguồn ý tưởng USSH', labelEn: 'USSH Student Origins', screenId: 'screen-02' },
          { label: '5 mục tiêu khách hàng', labelEn: '5 Customer Goals', screenId: 'screen-02' },
        ],
      },
    ],
  },
  {
    parent: 'Kho sách & Quyên góp',
    parentEn: 'Catalog & Donation',
    screenId: 'screen-03',
    children: [
      {
        label: 'Kho sách thư viện (/inventory/books/)',
        labelEn: 'Book Catalog (/inventory/books/)',
        screenId: 'screen-03',
        sub: [
          { label: 'Lọc 8 chuyên mục đa cấp', labelEn: '8-Category Accordion Filter', screenId: 'screen-03' },
          { label: 'Trạng thái tồn kho theo xe', labelEn: 'Bus-level Stock Badges', screenId: 'screen-03' },
        ],
      },
      {
        label: 'Chi tiết sách (/inventory/books/<uuid>/)',
        labelEn: 'Book Detail (/inventory/books/<uuid>/)',
        screenId: 'screen-04',
        sub: [
          { label: 'Thông số ISBN & Vị trí xe', labelEn: 'ISBN Metadata & Bus Card', screenId: 'screen-04' },
          { label: 'Đăng ký mượn & Sách gợi ý', labelEn: 'Borrow CTA & Related Books', screenId: 'screen-04' },
        ],
      },
      { label: 'Quyên góp sách (/inventory/books/donate/)', labelEn: 'Book Donation (/inventory/books/donate/)', screenId: 'screen-05' },
    ],
  },
  {
    parent: 'Đội xe & Lộ trình',
    parentEn: 'Fleet & Routes',
    screenId: 'screen-06',
    children: [
      { label: 'Bản đồ mạng lưới xe (/inventory/buses/)', labelEn: 'Fleet GPS Map (/inventory/buses/)', screenId: 'screen-06' },
      {
        label: 'Lộ trình & Điểm đón (/inventory/routes/<uuid>/)',
        labelEn: 'Route & Stops (/inventory/routes/<uuid>/)',
        screenId: 'screen-07',
        sub: [
          { label: 'Bản đồ đường đi Polyline', labelEn: 'Interactive Polyline Map', screenId: 'screen-07' },
          { label: 'Khung giờ & Thời lượng đỗ trạm', labelEn: 'Schedule & Stop Dwell Time', screenId: 'screen-07' },
        ],
      },
    ],
  },
  {
    parent: 'Hồ sơ & Thẻ thư viện',
    parentEn: 'Reader Profile & Pass',
    screenId: 'screen-08',
    children: [
      {
        label: 'Hồ sơ bạn đọc (/users/profile/)',
        labelEn: 'Reader Profile (/users/profile/)',
        screenId: 'screen-08',
        sub: [
          { label: 'Sách đang đọc & Hạn trả', labelEn: 'Active Loans & Due Date', screenId: 'screen-08' },
          { label: 'Sách đang chờ mượn / Đặt trước', labelEn: 'Pending Reservations', screenId: 'screen-08' },
        ],
      },
    ],
  },
  {
    parent: 'Quản lý Mượn / Trả',
    parentEn: 'Borrow & Return Ops',
    screenId: 'screen-09',
    children: [
      {
        label: 'Quản lý mượn trả (/transactions/borrows/)',
        labelEn: 'Borrow Management (/transactions/borrows/)',
        screenId: 'screen-09',
        sub: [
          { label: 'Tạo phiếu mượn & Xử lý hàng loạt', labelEn: 'Create Borrow & Bulk Actions', screenId: 'screen-09' },
          { label: 'Lọc phiếu Quá hạn / Đã trả', labelEn: 'Overdue / Returned Filter', screenId: 'screen-09' },
        ],
      },
    ],
  },
  {
    parent: 'Analytics & Django Admin',
    parentEn: 'Analytics & Admin',
    screenId: 'screen-10',
    children: [
      {
        label: 'Báo cáo phân tích (/analytics/)',
        labelEn: 'Analytics Dashboard (/analytics/)',
        screenId: 'screen-10',
        sub: [
          { label: '4 KPI cá nhân & Bảng xếp hạng', labelEn: '4 Reader KPIs & Leaderboard', screenId: 'screen-10' },
          { label: 'Gợi ý sách Cosine Similarity', labelEn: 'Cosine Book Recommendations', screenId: 'screen-10' },
        ],
      },
      {
        label: 'Trung tâm quản trị (/admin/)',
        labelEn: 'Django Admin Center (/admin/)',
        screenId: 'screen-11',
        sub: [
          { label: 'Quản lý 5 phân hệ & Thanh toán phạt', labelEn: '5 Core Apps & Fine Payments', screenId: 'screen-11' },
          { label: 'Nhật ký kiểm toán (Recent actions)', labelEn: 'System Audit Log', screenId: 'screen-11' },
        ],
      },
    ],
  },
];

interface BusinessRuleItem {
  code: string;
  titleVi: string;
  titleEn: string;
  ruleVi: string;
  ruleEn: string;
  givenVi: string;
  givenEn: string;
  whenVi: string;
  whenEn: string;
  thenVi: string;
  thenEn: string;
  screenRef: string;
}

const BA_BUSINESS_RULES: BusinessRuleItem[] = [
  {
    code: 'BR-01',
    titleVi: 'Kiểm tra tồn kho theo xe & Khóa dòng dữ liệu',
    titleEn: 'Bus-level Stock Validation & Row Locking',
    ruleVi: 'Mỗi cuốn sách gắn với một xe buýt cụ thể (bus_id). Khi độc giả gửi yêu cầu mượn, hệ thống phải khóa dòng bản ghi sách để kiểm tra available_copies > 0.',
    ruleEn: 'Each book copy is assigned to a specific bus (bus_id). Upon a borrow request, the system locks the book row to verify available_copies > 0.',
    givenVi: 'Sách "A History of Graphic Design" trên Bus 02 còn 1 bản khả dụng (available_copies = 1).',
    givenEn: 'Book "A History of Graphic Design" on Bus 02 has 1 available copy (available_copies = 1).',
    whenVi: 'Hai độc giả cùng nhấn "Đăng ký mượn sách" tại cùng một thời điểm.',
    whenEn: 'Two readers click "Register to Borrow" at the exact same timestamp.',
    thenVi: 'Yêu cầu thứ nhất khóa dòng bằng select_for_update(), giảm tồn kho về 0 và tạo phiếu mượn; yêu cầu thứ hai chuyển sang trạng thái Đặt trước.',
    thenEn: 'Request #1 acquires select_for_update() lock, decrements stock to 0, and creates the borrow slip; Request #2 is routed to the Reservation queue.',
    screenRef: 'screen-04',
  },
  {
    code: 'BR-02',
    titleVi: 'Đặt giữ sách theo Điểm dừng & Thời gian đỗ tại trạm',
    titleEn: 'Stop-based Reservation & Dwell-Time Window',
    ruleVi: 'Phiếu đặt giữ sách tại trạm chỉ hợp lệ khi xe buýt lưu giữ sách có lịch đi qua trạm đó và thời gian nhận nằm trong khung giờ đỗ (90–180 phút).',
    ruleEn: 'A stop pickup reservation is valid only if the assigned bus serves that route stop and pickup occurs within the scheduled dwell window (90–180 mins).',
    givenVi: 'Tuyến Cầu Giấy - Thanh Xuân (Bus 29B-67890) đỗ tại trạm Đại học Quốc Gia 180 phút (Thứ 3, 5, 7: 09:00–15:00).',
    givenEn: 'Cau Giay - Thanh Xuan Route (Bus 29B-67890) stops at VNU Station for 180 mins (Tue, Thu, Sat: 09:00–15:00).',
    whenVi: 'Hội viên chọn nhận sách tại trạm Đại học Quốc Gia và xác nhận đặt giữ chỗ.',
    whenEn: 'A member selects VNU Station for pickup and confirms the reservation.',
    thenVi: 'Hệ thống giữ sách tối đa đến hết ca đỗ tại trạm; nếu quá giờ đỗ chưa nhận, phiếu tự động giải phóng tồn kho cho độc giả tiếp theo.',
    thenEn: 'The system holds the copy until the station dwell window ends; unclaimed holds auto-release stock to the next queued reader.',
    screenRef: 'screen-07',
  },
  {
    code: 'BR-03',
    titleVi: 'Giới hạn định mức mượn & Cảnh báo quá hạn tự động',
    titleEn: 'Borrow Quota & Automated Overdue Escalation',
    ruleVi: 'Mỗi hội viên tiêu chuẩn được mượn tối đa 3 cuốn cùng lúc trong 14 ngày. Quá hạn trả (due_date < today) sẽ khóa quyền tạo phiếu mượn mới cho đến khi hoàn trả.',
    ruleEn: 'Standard members can borrow up to 3 books concurrently for 14 days. Any overdue loan (due_date < today) blocks new borrow requests until returned.',
    givenVi: 'Độc giả đang giữ 1 cuốn sách có hạn trả ngày 01/09/2026 và chưa hoàn trả đúng hạn.',
    givenEn: 'A reader holds 1 active book with a due date of 01/09/2026 that has passed without return.',
    whenVi: 'Tác vụ ngầm Celery quét bảng giao dịch hằng ngày hoặc thủ thư mở bảng Quản lý mượn trả.',
    whenEn: 'Daily Celery beat task scans transaction records or a librarian opens Borrow Management.',
    thenVi: 'Trạng thái phiếu chuyển sang QUÁ HẠN (nhãn đỏ), gửi thông báo nhắc hạn và tạm khóa nút mượn mới của tài khoản đó.',
    thenEn: 'Loan status transitions to OVERDUE (red badge), dispatches a reminder alert, and suspends new borrowing privileges.',
    screenRef: 'screen-09',
  },
  {
    code: 'BR-04',
    titleVi: 'Kiểm duyệt sách quyên góp trước khi nhập kho lưu động',
    titleEn: 'Donation Quality Screening Before Fleet Intake',
    ruleVi: 'Sách do cộng đồng quyên góp qua biểu mẫu trực tuyến bắt buộc ở trạng thái Chờ duyệt (PENDING) cho tới khi thủ thư kiểm tra vật lý và gán mã ISBN + xe buýt.',
    ruleEn: 'Community-donated books submitted online remain in PENDING state until a librarian verifies physical condition and assigns ISBN + bus inventory.',
    givenVi: 'Người dùng điền tên sách, tác giả, mô tả tình trạng và tải tệp đính kèm trên trang Quyên góp.',
    givenEn: 'A user submits book title, author, condition description, and attachment on the Donation form.',
    whenVi: 'Nhấn "Gửi thông tin" thành công.',
    whenEn: 'The user clicks "Submit Donation" successfully.',
    thenVi: 'Bản ghi lưu vào bảng duyệt quyên góp của Admin mà chưa cộng ngay vào số lượng sách khả dụng ngoài trang Kho sách công khai.',
    thenEn: 'Record is created in Admin donation review queue without prematurely inflating public catalog available stock.',
    screenRef: 'screen-05',
  },
];

export function Chapter1UxResearch({ 
  isEn = false, 
  onCopyDeepLink = () => {} 
}: Chapter1UxResearchProps) {
  const [activeEmbedTab, setActiveEmbedTab] = useState<'visual' | 'architecture' | 'flow'>('visual');
  const { resolvedTheme } = useTheme();

  const handleSitemapNodeClick = (screenId: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('select-library-bus-screen', { detail: { screenId } })
      );
    }
  };

  // Synchronize theme changes to all embedded iframes immediately
  useEffect(() => {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((ifr) => {
      try {
        ifr.contentWindow?.postMessage({ theme: resolvedTheme }, '*');
      } catch (_) {}
    });
  }, [resolvedTheme]);

  return (
    <section id="chapter-1-ux" className="space-y-8 scroll-mt-36">
      {/* 01. SECTION HEADER */}
      <SectionHeader
        variant="chapter"
        id="sec-research"
        chapter={isEn ? 'CHAPTER 1' : 'PHẦN 1'}
        subtitle={isEn ? 'Business problem, user personas, information architecture & BA business rules' : 'Bài toán nghiệp vụ, chân dung người dùng, kiến trúc thông tin & quy tắc nghiệp vụ BA'}
        badge=""
        title={isEn ? '1. Business Analysis & UX Research' : '1. Phân Tích Nghiệp Vụ (BA) & Nghiên Cứu UX'}
        onCopy={onCopyDeepLink}
      />

      {/* 1.1 SỨ MỆNH & 1.2 PERSONA & 1.3 ƯU TIÊN TÍNH NĂNG */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1.1 Sứ mệnh & Phạm vi hệ thống */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] font-black text-xs sm:text-sm tabular-nums">
                1.1
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Mission & System Scope' : 'Sứ mệnh & Quy mô hệ thống'}</span>
              </h3>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-snug">
              {isEn
                ? 'Mobile library network bringing physical books to university and community bus stops across Hanoi.'
                : 'Mạng lưới xe thư viện lưu động đưa sách giấy đến tận các điểm dừng trường đại học và khu dân cư.'}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="block tabular-nums text-2xl font-black text-slate-950 dark:text-white">11</span>
              <span className="text-xs text-slate-500 font-medium">{isEn ? 'Core Pairs' : 'Cặp màn hình'}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="block tabular-nums text-2xl font-black text-slate-950 dark:text-white">6</span>
              <span className="text-xs text-slate-500 font-medium">{isEn ? 'Modules' : 'Phân hệ'}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="block tabular-nums text-2xl font-black text-slate-950 dark:text-white">ACID</span>
              <span className="text-xs text-slate-500 font-medium">{isEn ? 'Row Lock' : 'Khóa tồn kho'}</span>
            </div>
          </div>
        </div>

        {/* 1.2 Phân bổ Persona mục tiêu (Giả định thiết kế) */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] font-black text-xs sm:text-sm tabular-nums">
                1.2
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Target Personas (15–45 y.o)' : 'Nhóm Persona mục tiêu (15–45 tuổi)'}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {isEn ? 'Design persona weighting hypothesis for UI layout' : 'Tỷ trọng nhóm người dùng mục tiêu (giả định thiết kế UX/BA)'}
            </p>
          </div>
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>{isEn ? 'University Students (USSH / VNU)' : 'Học sinh / Sinh viên (ĐHQGHN)'}</span>
                <span className="tabular-nums font-bold text-slate-950 dark:text-white">48%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#0D7287] dark:bg-[#9BE7FA] rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>{isEn ? 'Young Office Commuters' : 'Người đi làm trẻ dọc tuyến buýt'}</span>
                <span className="tabular-nums font-bold text-slate-950 dark:text-white">32%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#FFD14C] rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">
                <span>{isEn ? 'Local Families & Book Donors' : 'Gia đình & Người quyên góp sách'}</span>
                <span className="tabular-nums font-bold text-slate-950 dark:text-white">20%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#FFE485] dark:bg-[#FFE485]/70 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* 1.3 Trọng số ưu tiên chức năng (Feature Prioritization) */}
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 text-[#074553] dark:bg-[#9BE7FA]/20 dark:text-[#9BE7FA] font-black text-xs sm:text-sm tabular-nums">
                1.3
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Feature Priority Weights' : 'Trọng số ưu tiên tính năng'}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {isEn ? 'BA functional priority scoring for MVP scope' : 'Đánh giá mức độ thiết yếu cho phạm vi sản phẩm cốt lõi (MVP)'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Bus Route Map' : 'Lộ trình & Trạm'}</span>
              </div>
              <span className="block tabular-nums text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">92%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <BookOpen className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Bus Stock Hold' : 'Đặt giữ theo xe'}</span>
              </div>
              <span className="block tabular-nums text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">88%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <Bell className="w-3.5 h-3.5 text-[#FFD14C]" />
                <span>{isEn ? 'Due Date Alert' : 'Kiểm soát hạn trả'}</span>
              </div>
              <span className="block tabular-nums text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">84%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <FileText className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Book Donation' : 'Quyên góp sách'}</span>
              </div>
              <span className="block tabular-nums text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">76%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1.4 SƠ ĐỒ SITEMAP & LUỒNG TRẢI NGHIỆM NGƯỜI DÙNG */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-black text-sm tabular-nums">
                1.4
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>{isEn ? 'Sitemap Hierarchy (11 Core Screens) & User Flow' : 'Sơ Đồ Phân Cấp Sitemap (11 Màn Hình Cốt Lõi) & Luồng Người Dùng'}</span>
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEn ? 'Information architecture mapped directly to the 11 core routes & book borrowing decision flow' : 'Kiến trúc thông tin ánh xạ trực tiếp tới 11 đường dẫn cốt lõi và lưu đồ quyết định mượn sách'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveEmbedTab('visual')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                activeEmbedTab === 'visual'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isEn ? 'Visual Diagrams' : 'Sơ đồ trực quan'}
            </button>
            <button
              onClick={() => setActiveEmbedTab('architecture')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                activeEmbedTab === 'architecture'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isEn ? 'Architecture Embed' : 'Kiến trúc chi tiết'}
            </button>
            <button
              onClick={() => setActiveEmbedTab('flow')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer min-h-[36px] ${
                activeEmbedTab === 'flow'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isEn ? 'Workflow Embed' : 'Luồng tương tác'}
            </button>
          </div>
        </div>

        {activeEmbedTab === 'visual' ? (
          <div className="space-y-8">
            {/* A. SƠ ĐỒ CÂY VUÔNG GÓC SITEMAP & SITEMAP DETAIL */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                  <span>{isEn ? 'A. Orthogonal Sitemap & 11-Screen Route Hierarchy' : 'A. Sơ đồ cây vuông góc Sitemap & Ánh xạ 11 màn hình cốt lõi'}</span>
                </div>
                <span className="text-xs tabular-nums px-3 py-1 rounded-full bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/10 text-[#074553] dark:text-[#9BE7FA] border border-[#9BE7FA]/30">
                  {isEn ? 'Click any node to jump to Wireframe vs UI' : 'Nhấp vào nhánh để mở cặp Wireframe vs UI tương ứng'}
                </span>
              </div>

              <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#C8EEF7]/40 border border-[#9BE7FA]/40 text-xs text-[#074553] dark:bg-[#9BE7FA]/10 dark:border-[#9BE7FA]/20 dark:text-[#9BE7FA] font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                    <span>{isEn ? 'Click any box on Sitemap to scroll and inspect its paired Wireframe & UI in Section 03' : 'Ấn vào bất kỳ ô nào trên Sitemap để cuộn xuống và mở ngay cặp Wireframe & UI tương ứng ở Phần 03'}</span>
                  </div>
                  <span className="tabular-nums text-xs text-slate-600 dark:text-slate-400">11/11 Core Screen Pairs (Desktop &amp; Mobile)</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  {/* CỘT TRÁI (5 CỘT): SITEMAP TỔNG QUAN */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="border-slate-100 dark:border-slate-800 pb-2">
                      <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                        SITEMAP
                      </h3>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {isEn ? '/6 Functional Pillars/' : '/6 Phân hệ chức năng chính/'}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center">
                      <button
                        type="button"
                        onClick={() => handleSitemapNodeClick('screen-01')}
                        className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-extrabold text-xs sm:text-sm shrink-0 transition-transform active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#9BE7FA]" />
                        <span>Library Bus</span>
                      </button>

                      <div className="w-3 sm:w-4 border-t-2 border-slate-600 dark:border-slate-400 shrink-0" />

                      <div className="border-l-2 border-slate-600 dark:border-slate-400 py-1 space-y-2.5 sm:space-y-3 shrink-0">
                        {SITEMAP_ROOT.map((item, idx) => (
                          <div key={item.name} className="flex items-center">
                            <div className="w-3 sm:w-4 border-t-2 border-slate-600 dark:border-slate-400 shrink-0" />
                            <button
                              type="button"
                              onClick={() => handleSitemapNodeClick(item.screenId)}
                              title={isEn ? `Open Screen: ${item.nameEn}` : `Mở màn hình: ${item.name}`}
                              className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-[#9BE7FA] hover:text-[#0D7287] dark:hover:text-[#9BE7FA] text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors text-left cursor-pointer flex items-center justify-between gap-2.5 whitespace-nowrap"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="tabular-nums text-xs text-slate-400">0{idx + 1}.</span>
                                <span>{isEn ? item.nameEn : item.name}</span>
                              </div>
                              <span className="tabular-nums text-xs px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                                #{item.screenId.replace('screen-', '')}
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI (7 CỘT): SITEMAP DETAIL */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="border-slate-100 dark:border-slate-800 pb-2">
                      <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                        SITEMAP DETAIL
                      </h3>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {isEn ? '/11 Core Routes & Sub-views/' : '/Chi tiết 11 màn hình cốt lõi & tác vụ con/'}
                      </p>
                    </div>

                    <div className="pt-2 grid grid-cols-1 xl:grid-cols-2 gap-4 text-xs">
                      {SITEMAP_DETAILS.map((group) => (
                        <div
                          key={group.parent}
                          className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-2"
                        >
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleSitemapNodeClick(group.screenId)}
                              className="px-2.5 py-1 rounded-md border border-[#0D7287]/30 dark:border-[#9BE7FA]/30 bg-[#0D7287]/10 dark:bg-[#9BE7FA]/10 text-[#0D7287] dark:text-[#9BE7FA] font-extrabold hover:bg-[#0D7287] hover:text-white dark:hover:bg-[#9BE7FA] dark:hover:text-slate-950 transition cursor-pointer text-left shrink-0 text-xs flex items-center gap-1.5"
                            >
                              <span>{isEn ? group.parentEn : group.parent}</span>
                              <span className="opacity-70 text-xs tabular-nums font-bold">#{group.screenId.replace('screen-', '')}</span>
                            </button>
                            <div className="w-3 border-t-2 border-slate-400 dark:border-slate-600 shrink-0" />
                            <span className="text-xs tabular-nums text-slate-400 pl-1">
                              {group.children.length} {isEn ? 'routes' : 'trang'}
                            </span>
                          </div>

                          <div className="ml-3 border-l-2 border-slate-400 dark:border-slate-600 pl-2 py-1 space-y-2">
                            {group.children.map((child) => (
                              <div key={child.label} className="space-y-1">
                                <div className="flex items-center">
                                  <div className="w-3 border-t-2 border-slate-400 dark:border-slate-600 shrink-0" />
                                  <button
                                    type="button"
                                    onClick={() => handleSitemapNodeClick(child.screenId)}
                                    className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-[#9BE7FA] hover:text-[#0D7287] dark:hover:text-[#9BE7FA] text-xs font-medium transition text-left cursor-pointer inline-flex items-center gap-1.5"
                                  >
                                    <span>•</span>
                                    <span>{isEn ? child.labelEn : child.label}</span>
                                    <span className="tabular-nums text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                                      #{child.screenId.replace('screen-', '')}
                                    </span>
                                  </button>
                                </div>

                                {child.sub && child.sub.length > 0 && (
                                  <div className="ml-5 border-l-2 border-dashed border-slate-300 dark:border-slate-700 pl-2 py-0.5 space-y-1">
                                    {child.sub.map((subItem) => (
                                      <div key={subItem.label} className="flex items-center">
                                        <div className="w-2.5 border-slate-300 dark:border-slate-700 shrink-0" />
                                        <button
                                          type="button"
                                          onClick={() => handleSitemapNodeClick(subItem.screenId)}
                                          className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium hover:border-[#9BE7FA] hover:text-[#0D7287] dark:hover:text-[#9BE7FA] hover:bg-[#C8EEF7]/20 transition cursor-pointer flex items-center gap-1"
                                        >
                                          <span>{isEn ? subItem.labelEn : subItem.label}</span>
                                          <span className="tabular-nums text-xs text-[#0D7287] dark:text-[#9BE7FA] font-bold">#{subItem.screenId.replace('screen-', '')}</span>
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* B. LUỒNG TRẢI NGHIỆM NGƯỜI DÙNG (DECISION FLOWCHART) */}
            <div className="space-y-4">
              <div className="text-xs sm:text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <Workflow className="w-4 h-4" />
                <span>{isEn ? 'B. User Flow (Borrowing & Stop Reservation Decision Matrix)' : 'B. Luồng trải nghiệm người dùng (Quy trình tra cứu, mượn & đặt giữ sách theo trạm)'}</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
                <div className="flex items-center gap-3 min-w-[780px] text-xs font-medium">
                  {/* Step 1 */}
                  <button
                    type="button"
                    onClick={() => handleSitemapNodeClick('screen-01')}
                    className="px-3.5 py-2.5 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA] text-white dark:text-[#04242C] font-bold shrink-0 cursor-pointer"
                  >
                    {isEn ? '#01 Homepage' : '#01 Trang chủ'}
                  </button>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 2 Decision */}
                  <button
                    type="button"
                    onClick={() => handleSitemapNodeClick('screen-03')}
                    className="p-2.5 rounded-2xl bg-[#FFE485]/20 dark:bg-[#FFE485]/10 border border-[#FFD14C]/40 text-center shrink-0 cursor-pointer"
                  >
                    <span className="block font-bold text-slate-900 dark:text-white">
                      {isEn ? 'Know book title?' : 'Đã biết tên sách?'}
                    </span>
                    <div className="flex gap-1.5 mt-1 text-xs">
                      <span className="px-2 py-0.5 rounded bg-[#C8EEF7] text-[#074553] font-bold">
                        {isEn ? 'Yes: Search #03' : 'Có: Tìm tại #03'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {isEn ? 'No: AI Feed #10' : 'Không: Gợi ý #10'}
                      </span>
                    </div>
                  </button>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 3 Action */}
                  <button
                    type="button"
                    onClick={() => handleSitemapNodeClick('screen-04')}
                    className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 shrink-0 cursor-pointer hover:border-[#9BE7FA]"
                  >
                    {isEn ? '#04 Book Detail & Bus Stock' : '#04 Chi tiết & Tồn kho xe'}
                  </button>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 4 Decision */}
                  <div className="p-2.5 rounded-2xl bg-[#FFE485]/20 dark:bg-[#FFE485]/10 border border-[#FFD14C]/40 text-center shrink-0">
                    <span className="block font-bold text-slate-900 dark:text-white">
                      {isEn ? 'Copies on Bus > 0?' : 'Còn sách trên xe?'}
                    </span>
                    <div className="flex gap-1.5 mt-1 text-xs">
                      <span className="px-2 py-0.5 rounded bg-[#C8EEF7] text-[#074553] font-bold">
                        {isEn ? 'Yes: Lock & Borrow' : 'Có: Khóa & Mượn'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                        {isEn ? '0: Hold Queue' : 'Hết: Đặt trước'}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 5 Auth & Station Confirm */}
                  <button
                    type="button"
                    onClick={() => handleSitemapNodeClick('screen-07')}
                    className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 shrink-0 cursor-pointer hover:border-[#9BE7FA]"
                  >
                    {isEn ? '#07 Route Stop Pickup' : '#07 Chọn Trạm đón xe'}
                  </button>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* Step 6 Complete */}
                  <button
                    type="button"
                    onClick={() => handleSitemapNodeClick('screen-09')}
                    className="px-3.5 py-2.5 rounded-full bg-[#0D7287] hover:bg-[#074553] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-bold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isEn ? '#09 Borrow Slip Created' : '#09 Hoàn tất Phiếu mượn'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeEmbedTab === 'architecture' ? (
          <div className="space-y-2">
            <div className="flex justify-end">
              <a 
                href={`/library-bus/system-architecture.html?theme=${resolvedTheme}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{isEn ? 'Open in new tab' : 'Mở toàn màn hình'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <iframe 
              src={`/library-bus/system-architecture.html?embed=1&theme=${resolvedTheme}`} 
              className="w-full h-[500px] sm:h-[580px] lg:h-[640px] max-h-[70vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition duration-300" 
              title="Library Bus System Architecture Diagram" 
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-end">
              <a 
                href={`/library-bus/borrowing-workflow.html?theme=${resolvedTheme}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{isEn ? 'Open in new tab' : 'Mở toàn màn hình'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <iframe 
              src={`/library-bus/borrowing-workflow.html?embed=1&theme=${resolvedTheme}`} 
              className="w-full h-[500px] sm:h-[580px] lg:h-[640px] max-h-[70vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition duration-300" 
              title="Library Bus Borrowing Workflow Diagram" 
            />
          </div>
        )}
      </div>

      {/* 1.5 ĐẶC TẢ QUY TẮC NGHIỆP VỤ BA (BUSINESS RULES & ACCEPTANCE CRITERIA GIVEN/WHEN/THEN) */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-black text-sm tabular-nums">
                1.5
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA] flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>
                  {isEn
                    ? 'BA Specification: Business Rules (BR) & Acceptance Criteria (Gherkin)'
                    : 'Đặc Tả Nghiệp Vụ BA: Quy Tắc Kinh Doanh (BR) & Tiêu Chí Nghiệm Thu'}
                </span>
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEn
                ? 'Core business rules governing bus-level inventory locking, stop pickup windows, overdue blocks, and donation screening'
                : '4 quy tắc nghiệp vụ cốt lõi kiểm soát khóa tồn kho theo xe, khung giờ nhận sách tại trạm, khóa tài khoản quá hạn và duyệt sách quyên góp'}
            </p>
          </div>
          <span className="text-xs tabular-nums px-3 py-1.5 rounded-xl bg-[#FFE485]/40 text-amber-950 dark:bg-slate-800 dark:text-[#FFE485] font-bold border border-[#FFD14C]/50">
            Given / When / Then
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {BA_BUSINESS_RULES.map((item) => (
            <div
              key={item.code}
              className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#0D7287] text-white dark:bg-[#9BE7FA] dark:text-slate-950 font-black text-xs tabular-nums">
                      {item.code}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {isEn ? item.titleEn : item.titleVi}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSitemapNodeClick(item.screenRef)}
                    className="text-xs tabular-nums font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0D7287] dark:text-[#9BE7FA] hover:border-[#9BE7FA] cursor-pointer shrink-0"
                  >
                    {isEn ? `Screen #${item.screenRef.replace('screen-', '')}` : `Màn hình #${item.screenRef.replace('screen-', '')}`}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEn ? item.ruleEn : item.ruleVi}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold shrink-0">
                    GIVEN
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {isEn ? item.givenEn : item.givenVi}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#FFE485]/40 dark:bg-[#FFE485]/15 text-amber-950 dark:text-[#FFE485] font-mono font-bold shrink-0">
                    WHEN
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {isEn ? item.whenEn : item.whenVi}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono font-bold shrink-0">
                    THEN
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {isEn ? item.thenEn : item.thenVi}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800/50 border border-[#C8EEF7] dark:border-slate-700 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
          <ShieldAlert className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0 mt-0.5" />
          <span>
            {isEn
              ? 'Data Integrity Note: All figures displayed inside the 11 interface screens (10,250+ books, 12 buses, 54,300+ borrows) are seeded prototype records created to test BA rules, UI states, and SQL aggregations.'
              : 'Ghi chú minh bạch dữ liệu: Các con số hiển thị trên 11 màn hình giao diện (10.250+ đầu sách, 12 xe buýt, 54.300+ lượt mượn) là dữ liệu hạt giống (seed data) phục vụ kiểm thử quy tắc BA, trạng thái UI và truy vấn tổng hợp.'}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Chapter1UxResearch;
