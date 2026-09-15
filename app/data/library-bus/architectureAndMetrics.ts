/**
 * Library Bus Architecture Paradigms, Benchmarks & Real UI Gallery
 */
import { LIBRARY_BUS_20_SCREENS } from './screens';

export const LIBRARY_BUS_SYSTEM_PARADIGMS = [
  {
    "id": "grid-viewport",
    "titleVi": "1. Hệ Thống Lưới & Không Gian Hiển Thị",
    "titleEn": "1. Grid System & Viewport Architecture",
    "desktopVi": "Lưới 12 cột chuẩn Responsive. Hiển thị cùng lúc Navbar, Sidebar đa tầng và Data Grid 4 cột.",
    "desktopEn": "12-column responsive grid (max-width 1280px / 1440px), 24px gutters. Displays multi-tier navigation, persistent sidebar, and 4-column cards.",
    "mobileVi": "Lưới 1 cột đơn với padding an toàn 16px. Mọi thành phần xếp dọc hoặc thành carousels vuốt ngang.",
    "mobileEn": "Fluid 1-column single-thumb stack (375px - 430px) with 16px safe margins. Stacks vertically or transforms into horizontal swipe carousels.",
    "badgeVi": "12 Cột vs 1 Cột",
    "badgeEn": "12-Col vs 1-Col",
    "impactVi": "Desktop tối đa hóa khả năng quan sát tổng thể; Mobile tối đa hóa sự tập trung và tốc độ lướt."
  },
  {
    "id": "navigation-ia",
    "titleVi": "2. Kiến Trúc Điều Hướng (Navigation & IA)",
    "titleEn": "2. Navigation Architecture & Information Hierarchy",
    "desktopVi": "Thanh Header cố định với Menu mở rộng, Breadcrumbs, thanh tìm kiếm toàn cục và Avatar.",
    "desktopEn": "Sticky top navbar with mega-menu dropdowns, breadcrumb trails, global search (Ctrl+K), and right-hand profile menu.",
    "mobileVi": "Thanh điều hướng đáy ở vùng an toàn ngón cái và Ngăn kéo trượt cho cài đặt sâu.",
    "mobileEn": "Bottom Tab Bar (48px) anchored in ergonomic Thumb Zone + Slide-out Drawer for deep sub-navigation and account settings.",
    "badgeVi": "Top Navbar vs Bottom Bar",
    "badgeEn": "Top Nav vs Bottom Bar",
    "impactVi": "Giảm 65% khoảng cách di chuyển ngón tay so với thao tác ở đỉnh màn hình."
  },
  {
    "id": "data-density",
    "titleVi": "3. Mật Độ Dữ Liệu & Hiển Thị Bảng Biểu",
    "titleEn": "3. Data Density & Table Presentation",
    "desktopVi": "Bảng dữ liệu đa cột có sắp xếp động, lọc đa tiêu chí và phân trang 20 dòng/trang.",
    "desktopEn": "Multi-column data tables with sortable headers, faceted filtering sidebars, and 20 rows/page server pagination.",
    "mobileVi": "Chuyển thành các thẻ thông tin dọc có tag trạng thái. Xem chi tiết qua cửa sổ trượt đáy.",
    "mobileEn": "Transformed into vertical card streams with status pill badges; secondary details expand via one-tap native bottom sheets.",
    "badgeVi": "Data Table vs Card Stack",
    "badgeEn": "Data Table vs Card Stack",
    "impactVi": "Loại bỏ hoàn toàn thao tác cuộn ngang (horizontal scroll) - nguyên nhân hàng đầu gây bỏ dở trên mobile."
  },
  {
    "id": "interaction-ergonomics",
    "titleVi": "4. Mô Hình Tương Tác & Công Thái Học",
    "titleEn": "4. Interaction Models & Ergonomics",
    "desktopVi": "Trạng thái Hover đổi màu tức thì, Tooltip giải thích chi tiết và hỗ trợ phím tắt điều hướng nhanh.",
    "desktopEn": "High-precision mouse pointer: Rich hover previews, contextual tooltips, and keyboard accessibility shortcuts (Arrows, Esc, Enter).",
    "mobileVi": "Cảm ứng chạm đa điểm với vùng chạm tối thiểu 48x48px, vuốt trượt Carousel và kéo để làm mới.",
    "mobileEn": "Multi-touch gestures: Minimum 48x48px touch targets (Apple HIG), horizontal card swiping, and pull-to-refresh feeds.",
    "badgeVi": "Hover & Phím vs Cảm ứng 48px",
    "badgeEn": "Hover vs Touch 48px",
    "impactVi": "Ngăn ngừa hiện tượng bấm trúng mục nhầm (fat-finger syndrome) và tăng tốc độ thao tác tại trạm xe."
  },
  {
    "id": "quick-workflow",
    "titleVi": "5. Quy Trình Giữ Chỗ & Đặt Sách O(1)",
    "titleEn": "5. O(1) Quick Reservation & Hold Workflow",
    "desktopVi": "Modal hiển thị song song sơ đồ trạm và kệ sách. Chốt đặt sách chỉ trong 3 click.",
    "desktopEn": "Modal dialog displaying bus route map and seat availability in parallel view; complete reservation in 3 clicks.",
    "mobileVi": "Bottom Sheet 2 bước: Tự động GPS tìm trạm gần nhất, xác nhận và giữ chỗ trong 2 chạm.",
    "mobileEn": "2-step sliding bottom sheet: Auto-detects nearest bus stop via GPS, verifies phone OTP, completes hold in 2 taps (~4s).",
    "badgeVi": "Modal 3-Click vs Sheet 2-Tap",
    "badgeEn": "Modal vs 2-Tap Sheet",
    "impactVi": "Rút ngắn thời gian đặt sách xuống dưới 5 giây khi độc giả đang đứng đón xe buýt ngoài trạm."
  },
  {
    "id": "hardware-integration",
    "titleVi": "6. Tích Hợp Cảm Biến & Phần Cứng Thiết Bị",
    "titleEn": "6. Hardware & Native Sensor Integration",
    "desktopVi": "Tối ưu hóa cho thiết bị PC, đa màn hình và in ấn xuất file Excel/PDF khổ A4.",
    "desktopEn": "Optimized for mechanical keyboards, optical mouse, multi-monitor setups, and direct A4 PDF/Excel report exports.",
    "mobileVi": "Tận dụng Camera điện thoại để quét mã ISBN/QR, GPS định vị lộ trình và Thông báo đẩy.",
    "mobileEn": "Direct camera barcode scanning for book intake/returns, GPS geofencing for bus arrival, and native push notifications.",
    "badgeVi": "Bàn phím & In vs Camera & GPS",
    "badgeEn": "Keyboard vs Camera/GPS",
    "impactVi": "Thủ thư nhập sách mới nhanh gấp 4 lần nhờ quét ISBN trực tiếp qua camera thay vì gõ tay."
  }
];

export const WEBSITE_DESIGN_DATA = {
  chapter: '03',
  subChapter: '3.1, 3.2, 3.3',
  titleVi: 'THIẾT KẾ GIAO DIỆN WEBSITE & HỆ THỐNG 20 MÀN HÌNH',
  titleEn: 'WEBSITE DESIGN & 20-SCREEN ARCHITECTURE',
  subtitleVi: '/Lưới quy chuẩn, Wireframe toàn cảnh & So sánh trực quan/',
  subtitleEn: '/Grid System, 20-Screen Master Wireframe & Visual UI Showcase/',
  gridSystem: {
    type: 'Desktop Responsive Grid',
    count: 12,
    margin: '360px (hoặc Auto Center max-width 1280px)',
    width: '78px',
    gutter: '24px'
  },
  masterBoards: {
    wireframeAllSrc: '/library-bus/library_bus_wireframe_all_screens.webp',
    uiDesignAllSrc: '/library-bus/library_bus_ui_design_all_screens.webp',
    referenceTemplateSrc: '/library-bus/reference_wireframe_vs_ui.webp',
    screenCount: 20,
    totalTemplates: '70+ Django HTML Templates'
  },
  screens: LIBRARY_BUS_20_SCREENS
};

// ==========================================
// Operational Metrics & Benchmarks
// ==========================================

export const libraryBusKPIs = {
  activeUsers: '50,000+',
  concurrentConnections: '500 CCU',
  queryLatency: '28ms',
  latencyReduction: '-93.7%',
  raceConditionRate: '0.0%',
  totalCatalogBooks: '15,400+',
  activeBusFleet: '12 Đầu xe',
  activeBusStops: '48 Trạm GPS',
  totalCirculation: '142,800+',
  celeryTasksPerDay: '12,500+',
};

// Weekly Borrow vs Return telemetry data from Django DailyStats
export const weeklyActivityData = [
  { day: 'T2', borrows: 142, returns: 120, activeUsers: 84 },
  { day: 'T3', borrows: 158, returns: 140, activeUsers: 92 },
  { day: 'T4', borrows: 151, returns: 138, activeUsers: 89 },
  { day: 'T5', borrows: 176, returns: 150, activeUsers: 104 },
  { day: 'T6', borrows: 190, returns: 171, activeUsers: 118 },
  { day: 'T7', borrows: 168, returns: 160, activeUsers: 98 },
  { day: 'CN', borrows: 199, returns: 182, activeUsers: 125 },
];

// Latency benchmark comparison: Before vs After Redis Caching (ms)
export const latencyBenchmarkData = [
  { endpoint: 'Chi tiết sách (Book Detail)', withoutCache: 420, withCache: 24, reduction: '94.3%' },
  { endpoint: 'Lộ trình xe GPS (Bus Route)', withoutCache: 510, withCache: 28, reduction: '94.5%' },
  { endpoint: 'Hồ sơ độc giả (User Stats)', withoutCache: 380, withCache: 22, reduction: '94.2%' },
  { endpoint: 'Bảng xếp hạng (Leaderboard)', withoutCache: 680, withCache: 32, reduction: '95.3%' },
  { endpoint: 'Tìm kiếm danh mục (Search)', withoutCache: 340, withCache: 35, reduction: '89.7%' },
];

// Bus fleet performance comparison from BusAnalytics
export const busFleetData = [
  { name: 'Bus 01 (Cầu Giấy)', borrows: 312, visits: 340, efficiency: 91.8, status: 'Đang hoạt động', driver: 'Nguyễn Văn Nam' },
  { name: 'Bus 02 (Đống Đa)', borrows: 284, visits: 310, efficiency: 91.6, status: 'Đang hoạt động', driver: 'Trần Đình Trọng' },
  { name: 'Bus 03 (Hà Đông)', borrows: 245, visits: 280, efficiency: 87.5, status: 'Đang hoạt động', driver: 'Lê Hoàng Long' },
  { name: 'Bus 04 (Hai Bà Trưng)', borrows: 198, visits: 230, efficiency: 86.1, status: 'Đang hoạt động', driver: 'Phạm Đức Anh' },
  { name: 'Bus 05 (Thanh Xuân)', borrows: 155, visits: 190, efficiency: 81.6, status: 'Đang hoạt động', driver: 'Vũ Quốc Huy' },
  { name: 'Bus 06 (Tây Hồ)', borrows: 90, visits: 130, efficiency: 69.2, status: 'Bảo dưỡng định kỳ', driver: 'Đỗ Minh Tuấn' },
];

// Reader Gamification Tiers from analytics.models.UserReadingStats
export const gamificationTiers = [
  { level: 'Đồng (Bronze)', minPoints: 0, borrowLimit: 3, discountRate: '0%', color: '#0D7287', desc: 'Độc giả mới gia nhập tủ sách' },
  { level: 'Bạc (Silver)', minPoints: 200, borrowLimit: 5, discountRate: '5%', color: '#0284C7', desc: 'Duy trì đọc 3 cuốn/tháng' },
  { level: 'Vàng (Gold)', minPoints: 500, borrowLimit: 8, discountRate: '10%', color: '#FFD14C', desc: 'Đọc đều đặn và có review chất lượng' },
  { level: 'Bạch kim (Platinum)', minPoints: 1000, borrowLimit: 12, discountRate: '15%', color: '#0D7287', desc: 'Độc giả nòng cốt tại các trạm xe' },
  { level: 'Kim cương (Diamond)', minPoints: 2000, borrowLimit: 20, discountRate: '25%', color: '#6366F1', desc: 'Đại sứ lan tỏa văn hóa đọc' },
];

// Real UI gallery assets copied from C:\Users\ADMIN\Documents\prj
export const realUIGallery = [
  {
    id: 'ui-design-all',
    titleVi: 'Toàn Bộ 20 Màn Hình Giao Diện Thật (UI Design)',
    titleEn: 'Full 20-Screen Master Board (UI Design)',
    descVi: 'Bảng thiết kế 20 màn hình thực tế áp dụng bảng màu nhận diện chuẩn (#0D7287, #9BE7FA, #FFD14C, #C8EEF7).',
    descEn: 'Master board containing all 20 production screens of Library Bus system styled with the official 4-color palette.',
    src: '/library-bus/library_bus_ui_design_all_screens.webp',
    tag: 'Official 4-Tone UI'
  },
  {
    id: 'wireframe-all',
    titleVi: 'Toàn Bộ 20 Màn Hình Cấu Trúc Khung Xương (Wireframe)',
    titleEn: 'Full 20-Screen Master Wireframe Architecture',
    descVi: 'Khung xương quy chuẩn 20 màn hình: Lưới 12 cột, phân tầng thông tin, nút tương tác và thành phần dữ liệu.',
    descEn: 'Comprehensive 20-screen wireframe board: 12-column grid system, visual hierarchy, interactive controls, and structural cards.',
    src: '/library-bus/library_bus_wireframe_all_screens.webp',
    tag: 'Wireframe Architecture'
  },
  {
    id: 'reference-template',
    titleVi: 'Mẫu Tham Khảo Trình Bày So Sánh Wireframe vs UI',
    titleEn: 'Reference Template: Wireframe vs UI Design Comparison',
    descVi: 'Bố cục tài liệu chuẩn: Trái là Wireframe, phải là UI Design hoàn chỉnh với màu thương hiệu.',
    descEn: 'Design guidelines standard benchmark: Left half features wireframe skeletons, right half showcases final branded UI.',
    src: '/library-bus/reference_wireframe_vs_ui.webp',
    tag: 'Benchmark Standard'
  },
  {
    id: 'hero-bus',
    titleVi: 'Xe Thư Viện Lưu Động Thực Địa',
    titleEn: 'Mobile Library Bus in Field Operations',
    descVi: 'Xe buýt với hơn 1.200 đầu sách, trạm sạc điện thoại và khu vực đọc sách tại các điểm dừng.',
    descEn: 'Mobile bus carrying over 1,200 physical books, device charging ports, and open pop-up reading zones at scheduled stops.',
    src: '/library-bus/hero_bus.webp',
    tag: 'Hardware & Fleet'
  },
  {
    id: 'ui-dashboard',
    titleVi: 'Giao Diện Quản Trị & Điều Phối Của Thủ Thư',
    titleEn: 'Librarian Fleet Dispatch & Inventory Dashboard',
    descVi: 'Màn hình kiểm kê tồn kho động O(1), theo dõi GPS xe theo thời gian thực và quản lý mượn/trả.',
    descEn: 'Dynamic O(1) inventory monitoring, real-time GPS tracking across bus lines, and borrow/return processing.',
    src: '/library-bus/ui_dashboard.jpg',
    tag: 'Web Portal'
  },
  {
    id: 'ui-mobile',
    titleVi: 'Cổng Độc Giả Trên Điện Thoại & Thẻ Thư Viện Số',
    titleEn: 'Mobile Reader Portal & Digital Library Pass',
    descVi: 'Ứng dụng tra cứu sách, đặt chỗ ngồi, giữ sách tại điểm dừng và tích điểm Gamification.',
    descEn: 'Mobile app for book discovery, stop reservations, hold queues, and reading gamification score tracking.',
    src: '/library-bus/ui_mobile.jpg',
    tag: 'Mobile App'
  }
];

// Interactive demo showcases
export const interactiveShowcases = [
  {
    id: 'architecture-graph',
    titleVi: 'Đồ Thị Mạng Lưới Kiến Trúc 7 Apps',
    titleEn: '7-App Interactive Architecture Graph',
    descVi: 'Mô hình D3 Canvas trực quan hóa 7 Django Apps, quan hệ Foreign Key và luồng phân tầng dữ liệu.',
    descEn: 'Interactive Canvas graph visualizing 7 Django apps, model relationships, and transactional data flows.',
    url: '/library-bus/architecture-graph.html',
    badge: 'D3 Graph'
  },
  {
    id: 'understand-radar',
    titleVi: 'Bản Đồ Radar Vòng Tròn Đồng Tâm',
    titleEn: 'Concentric Architecture Radar',
    descVi: 'Khám phá kiến trúc phần mềm từ lõi nghiệp vụ qua Use Cases, Gateways đến tầng hạ tầng.',
    descEn: 'Explore Clean Architecture layers from Domain Entities through Use Cases to external Infrastructure.',
    url: '/library-bus/understand_dashboard.html',
    badge: 'Clean Radar'
  },
  {
    id: 'presentation-slides',
    titleVi: 'Bộ Slide Thuyết Trình Dự Án (30 Trang)',
    titleEn: 'Project Strategic Presentation (30 Slides)',
    descVi: 'Slide trình bày: bài toán thực địa, nghiên cứu xã hội, kiến trúc hệ thống và dữ liệu.',
    descEn: 'Comprehensive 30-slide pitch: field problem statement, reader demographics, technical architecture, and data analytics.',
    url: '/library-bus/presentation.html',
    badge: '30 Slides'
  },
  {
    id: 'website-pdf',
    titleVi: 'Hồ Sơ Đặc Tả & Thiết Kế Gốc (website.html)',
    titleEn: 'Original Specification & Design Document (website.html)',
    descVi: 'Tài liệu thiết kế 20 màn hình bao gồm wireframes, sitemap, luồng người dùng và phân tích dữ liệu.',
    descEn: 'Complete 20-screen system specification interactive HTML document with wireframes, sitemaps, user flows, and metrics.',
    url: '/library-bus/website.html',
    badge: 'Interactive HTML'
  }
];
