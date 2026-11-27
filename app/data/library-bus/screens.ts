/**
 * Library Bus 11 Core Desktop Screens & 11 Core Mobile Screens Specification
 * Standardized from the Library Bus Django source project (docs/screenshots & docs/wireframes).
 */
export interface LibraryBusScreenItem {
  id: string;
  index: number;
  titleVi: string;
  titleEn: string;
  module: 'public' | 'transactions' | 'users' | 'admin' | 'blog' | 'brand' | 'inventory' | 'fleet' | 'community' | 'analytics';
  moduleNameVi: string;
  moduleNameEn: string;
  templatePath: string;
  routePath: string;
  role: string;
  descVi: string;
  descEn: string;
  wireframeElements: string[];
  uiFeatures: string[];
  badge: string;
  wireframeSrc: string;
  uiSrc: string;
  uiFullSrc?: string;
}

export const LIBRARY_BUS_11_SCREENS: LibraryBusScreenItem[] = [
  {
    id: '1',
    index: 1,
    titleVi: '1. Trang chủ',
    titleEn: '1. Homepage',
    module: 'public',
    moduleNameVi: 'Khách vãng lai & Độc giả',
    moduleNameEn: 'Public & Reader',
    templatePath: 'templates/pages/index.html',
    routePath: '/',
    role: 'Tất cả người dùng',
    descVi: 'Banner chào mừng với hai nút hành động chính, dải 4 chỉ số quy mô hệ thống, lưới 4 cột sách mới cập nhật và chuyên mục Góc nhìn & Hoạt động.',
    descEn: 'Hero banner with two primary CTAs, a 4-metric system scale strip, a 4-column newly updated books grid, and a community perspectives section.',
    wireframeElements: [
      'Thanh điều hướng trên cùng và khung Hero hai cột',
      'Dải 4 ô chỉ số thống kê (Đầu sách, Xe buýt, Lượt mượn, Chuyên mục)',
      'Lưới 4 cột thẻ sách mới cập nhật và 3 cột bài viết hoạt động',
      'Khối kêu gọi hành động (CTA) cuối trang và chân trang'
    ],
    uiFeatures: [
      'Hero "Khám phá Tri thức, Mở lối Tương lai" kèm nút Khám phá kho sách & Tìm xe gần bạn',
      '4 thẻ chỉ số: 10,250+ Đầu sách, 12 Xe buýt, 54,300+ Lượt mượn, 85+ Chuyên mục',
      'Thẻ sách hiển thị bìa, nhãn trạng thái Có sẵn / Đang mượn và mã xe buýt',
      'Khối Góc Nhìn & Hoạt Động 3 cột bài viết kèm ảnh minh họa'
    ],
    badge: 'Desktop 1440×3395',
    wireframeSrc: '/library-bus/screens/wf_01_trang_chu.webp',
    uiSrc: '/library-bus/screens/screen_01_trang_chu.webp',
    uiFullSrc: '/library-bus/screens/screen_01_trang_chu.webp'
  },
  {
    id: '2',
    index: 2,
    titleVi: '2. Giới thiệu',
    titleEn: '2. About Us',
    module: 'public',
    moduleNameVi: 'Khách vãng lai & Độc giả',
    moduleNameEn: 'Public & Reader',
    templatePath: 'templates/pages/about.html',
    routePath: '/about/',
    role: 'Tất cả người dùng',
    descVi: 'Giới thiệu dự án Tủ Sách Lưu Động (USSH - VNU), khởi nguồn ý tưởng từ góc nhìn sinh viên, 5 mục tiêu phục vụ độc giả và định hướng FAST • FLEXIBLE • FUTURE.',
    descEn: 'Introduction to the Mobile Library project (USSH - VNU), student-led origins, 5 core customer goals, and the FAST • FLEXIBLE • FUTURE vision.',
    wireframeElements: [
      'Khối tiêu đề giới thiệu kèm nhãn đơn vị thực hiện',
      'Hai khung trích dẫn khởi nguồn ý tưởng đối xứng',
      'Lưới 5 thẻ mục tiêu mang lại cho khách hàng',
      'Khối tuyên ngôn 2 cột kèm khung ảnh xe thư viện'
    ],
    uiFeatures: [
      'Huy hiệu USSH - VNU • Nhóm Học Tập Số 9 và tiêu đề Tủ Sách Lưu Động',
      'Hai thẻ tâm sự sinh viên lý giải bài toán thiếu thời gian đến thư viện cố định',
      '5 thẻ mục tiêu: Sách đến tận tay, Tối ưu thời gian, Trải nghiệm thoải mái, Kết nối cộng đồng, Nâng cao văn hóa đọc',
      'Khối FAST • FLEXIBLE • FUTURE phối nền nâu ấm và ảnh xe buýt vàng'
    ],
    badge: 'Desktop 1440×3120',
    wireframeSrc: '/library-bus/screens/wf_02_gioi_thieu.webp',
    uiSrc: '/library-bus/screens/screen_02_gioi_thieu.webp',
    uiFullSrc: '/library-bus/screens/screen_02_gioi_thieu.webp'
  },
  {
    id: '3',
    index: 3,
    titleVi: '3. Kho sách thư viện',
    titleEn: '3. Book Catalog',
    module: 'inventory',
    moduleNameVi: 'Kho sách & Danh mục',
    moduleNameEn: 'Catalog & Inventory',
    templatePath: 'templates/inventory/book_list.html',
    routePath: '/inventory/books/',
    role: 'Độc giả & Khách vãng lai',
    descVi: 'Thanh bên lọc danh mục đa cấp, thanh tìm kiếm từ khóa và lưới 4 cột thẻ sách kèm trạng thái tồn kho trực tiếp trên từng xe buýt.',
    descEn: 'Multi-level category accordion sidebar, keyword search bar, and a 4-column book catalog grid with live bus-level availability badges.',
    wireframeElements: [
      'Banner tiêu đề danh mục và thanh tìm kiếm trung tâm',
      'Cột trái: cây danh mục sách đa cấp có thể thu gọn',
      'Cột phải: lưới 4 cột thẻ sách đồng nhất chiều cao',
      'Thanh phân trang số thứ tự ở cuối danh sách'
    ],
    uiFeatures: [
      'Bộ lọc 8 nhóm: Văn học, Tâm lý & Kỹ năng, Tiểu thuyết, KHXH, Kinh tế, Ngoại ngữ, KHCN',
      'Nhãn trạng thái màu xanh (Có sẵn) và vàng cam (Đang mượn) gắn trực tiếp trên bìa',
      'Hiển thị tên xe buýt đang lưu giữ sách và năm xuất bản trên từng thẻ',
      'Nút Xem chi tiết mở thẳng tới trang thông tin và đặt mượn'
    ],
    badge: 'Desktop 1440×1836',
    wireframeSrc: '/library-bus/screens/wf_03_kho_sach.webp',
    uiSrc: '/library-bus/screens/screen_03_kho_sach.webp',
    uiFullSrc: '/library-bus/screens/screen_03_kho_sach.webp'
  },
  {
    id: '4',
    index: 4,
    titleVi: '4. Chi tiết sách',
    titleEn: '4. Book Detail',
    module: 'inventory',
    moduleNameVi: 'Kho sách & Danh mục',
    moduleNameEn: 'Catalog & Inventory',
    templatePath: 'templates/inventory/book_detail.html',
    routePath: '/inventory/books/<uuid>/',
    role: 'Độc giả & Hội viên',
    descVi: 'Cột trái hiển thị bìa sách và thẻ xe buýt đang lưu giữ; cột phải trình bày tóm tắt, lưới 6 thông số xuất bản, nút đăng ký mượn và sách gợi ý tương đồng.',
    descEn: 'Left column with book cover and assigned bus card; right column with synopsis, 6-field metadata grid, borrow registration CTA, and related titles.',
    wireframeElements: [
      'Cột trái (4 cột lưới): khung ảnh bìa và thẻ vị trí xe buýt',
      'Cột phải (8 cột lưới): tiêu đề, đánh giá sao, hộp giới thiệu nội dung',
      'Lưới 6 ô thông số (Thể loại, NXB, Năm XB, Số trang, ISBN, Ngôn ngữ)',
      'Hàng nút hành động chính và dải 4 thẻ sách liên quan'
    ],
    uiFeatures: [
      'Thẻ định vị xe buýt: Bus Sách Sinh Viên 02 kèm trạng thái CÓ SẴN ĐỂ MƯỢN',
      'Lưới 6 ô metadata đóng khung rõ ràng giúp tra cứu nhanh thông tin học thuật',
      'Nút chính Đăng ký mượn sách (#BD5705) và nút phụ Quay lại danh mục',
      'Khối "Có thể bạn cũng thích" gợi ý 4 đầu sách cùng chủ đề'
    ],
    badge: 'Desktop 1440×1140',
    wireframeSrc: '/library-bus/screens/wf_04_chi_tiet_sach.webp',
    uiSrc: '/library-bus/screens/screen_04_chi_tiet_sach.webp',
    uiFullSrc: '/library-bus/screens/screen_04_chi_tiet_sach.webp'
  },
  {
    id: '5',
    index: 5,
    titleVi: '5. Quyên góp & Trao tặng sách',
    titleEn: '5. Book Donation Form',
    module: 'inventory',
    moduleNameVi: 'Kho sách & Danh mục',
    moduleNameEn: 'Catalog & Inventory',
    templatePath: 'templates/inventory/book_donate.html',
    routePath: '/inventory/books/donate/',
    role: 'Hội viên & Cộng đồng',
    descVi: 'Biểu mẫu tiếp nhận sách quyên góp từ cộng đồng với các trường tên sách, tác giả, mô tả tình trạng vật lý và tệp đính kèm.',
    descEn: 'Community book donation intake form featuring book title, author, physical condition notes, and optional file attachment.',
    wireframeElements: [
      'Khung biểu mẫu căn giữa (6 cột lưới trung tâm)',
      'Các trường nhập liệu: Tên sách, Tác giả, Mô tả tình trạng',
      'Vùng chọn tệp đính kèm (ảnh chụp hoặc bản đọc thử)',
      'Cặp nút điều hướng Hủy và Gửi thông tin'
    ],
    uiFeatures: [
      'Tiêu đề "Quyên góp & Trao tặng Sách" kèm thông điệp lan tỏa tri thức',
      'Trường nhập liệu viền sáng dễ đọc trên nền giấy ấm Pure Ivory',
      'Hỗ trợ đính kèm tệp minh họa tình trạng sách trước khi thủ thư tiếp nhận tại trạm',
      'Nút Gửi thông tin nổi bật với tông màu Roast Amber'
    ],
    badge: 'Desktop 1440×900',
    wireframeSrc: '/library-bus/screens/wf_05_quyen_gop_sach.webp',
    uiSrc: '/library-bus/screens/screen_05_quyen_gop_sach.webp',
    uiFullSrc: '/library-bus/screens/screen_05_quyen_gop_sach.webp'
  },
  {
    id: '6',
    index: 6,
    titleVi: '6. Mạng lưới xe buýt lưu động',
    titleEn: '6. Mobile Bus Fleet Map',
    module: 'fleet',
    moduleNameVi: 'Lộ trình & Đội xe',
    moduleNameEn: 'Fleet & Routes',
    templatePath: 'templates/inventory/bus_list.html',
    routePath: '/inventory/buses/',
    role: 'Tất cả người dùng',
    descVi: 'Bản đồ tương tác toàn màn hình hiển thị các điểm đỗ xe buýt thư viện lưu động theo lịch trình công bố trên địa bàn Hà Nội (không dùng cảm biến GPS phần cứng thời gian thực ở GĐ 1).',
    descEn: 'Full-width interactive map displaying scheduled mobile library bus stop locations across Hanoi districts (live hardware GPS telematics deferred to Phase 2).',
    wireframeElements: [
      'Thanh điều hướng trên cùng giữ nguyên ngữ cảnh',
      'Khung bản đồ tương tác chiếm trọn vùng nhìn chính',
      'Các điểm đánh dấu (Markers) vị trí xe buýt và cụm điều khiển thu phóng'
    ],
    uiFeatures: [
      'Tích hợp bản đồ Leaflet & OpenStreetMap/CARTO sắc nét',
      'Hiển thị trực quan các điểm đỗ quanh khu vực Cầu Giấy, Thanh Xuân, Đống Đa, Hoàn Kiếm',
      'Cho phép nhấp trực tiếp vào từng điểm đánh dấu xe để xem chi tiết lộ trình'
    ],
    badge: 'Desktop 1440×900',
    wireframeSrc: '/library-bus/screens/wf_06_danh_sach_chuyen_xe.webp',
    uiSrc: '/library-bus/screens/screen_06_danh_sach_chuyen_xe.webp',
    uiFullSrc: '/library-bus/screens/screen_06_danh_sach_chuyen_xe.webp'
  },
  {
    id: '7',
    index: 7,
    titleVi: '7. Lộ trình & Điểm đón xe',
    titleEn: '7. Route Detail & Stop Schedule',
    module: 'fleet',
    moduleNameVi: 'Lộ trình & Đội xe',
    moduleNameEn: 'Fleet & Routes',
    templatePath: 'templates/inventory/route_detail.html',
    routePath: '/inventory/routes/<uuid>/',
    role: 'Độc giả & Thủ thư',
    descVi: 'Giao diện chi tiết tuyến xe kết hợp bản đồ đường đi polyline bên trái với khung giờ hoạt động và danh sách trạm dừng kèm thời gian đỗ bên phải.',
    descEn: 'Route detail view pairing an interactive polyline route map on the left with operating hours and timed stop schedules on the right.',
    wireframeElements: [
      'Thanh bên điều hướng quản lý thư viện',
      'Banner tiêu đề tuyến đường kèm biển số xe phụ trách',
      'Cột trái: bản đồ lộ trình nối các điểm dừng (Polyline)',
      'Cột phải: thẻ trạng thái, giờ hoạt động và danh sách trạm dừng theo thứ tự'
    ],
    uiFeatures: [
      'Thông tin Tuyến Cầu Giấy - Thanh Xuân (Bus Sách Sinh Viên 29B-67890)',
      'Bản đồ vẽ đường nối trực tiếp giữa các trạm dừng trong ngày',
      'Thẻ trạng thái ĐANG HOẠT ĐỘNG và lịch chạy Thứ 3, Thứ 5, Thứ 7 (09:00 - 15:00)',
      'Danh sách điểm dừng ghi rõ thời lượng đỗ: ĐHQGHN (180 phút), Công viên Cầu Giấy (120 phút), Ngã tư Sở (90 phút)'
    ],
    badge: 'Desktop 1440×1191',
    wireframeSrc: '/library-bus/screens/wf_07_chi_tiet_lo_trinh.webp',
    uiSrc: '/library-bus/screens/screen_07_chi_tiet_lo_trinh.webp',
    uiFullSrc: '/library-bus/screens/screen_07_chi_tiet_lo_trinh.webp'
  },
  {
    id: '8',
    index: 8,
    titleVi: '8. Hồ sơ cá nhân & Thẻ thư viện',
    titleEn: '8. Reader Profile & Library Pass',
    module: 'users',
    moduleNameVi: 'Tài khoản & Hội viên',
    moduleNameEn: 'User & Membership',
    templatePath: 'templates/users/profile.html',
    routePath: '/users/profile/',
    role: 'Hội viên thư viện',
    descVi: 'Không gian quản lý tủ sách cá nhân của độc giả: theo dõi sách đang đọc, hạn trả, nút trả sách nhanh và danh sách sách đang đặt trước chờ nhận.',
    descEn: 'Personal reader workspace tracking currently borrowed books, due dates, one-click return actions, and pending book reservations.',
    wireframeElements: [
      'Thanh bên tài khoản cá nhân (6 mục điều hướng)',
      'Banner tiêu đề Sách của tôi',
      'Khối Sách đang đọc kèm thẻ thông tin hạn trả và nút thao tác',
      'Khối Sách đang chờ mượn / Đặt trước'
    ],
    uiFeatures: [
      'Menu cá nhân: Bảng điều khiển, Trang cá nhân, Chỉnh sửa hồ sơ, Cài đặt, Lịch sử hoạt động, Nâng cấp tài khoản',
      'Thẻ sách đang đọc hiển thị rõ tên sách, tác giả, hạn trả (01/09/2026) và nút Trả sách',
      'Khối theo dõi trạng thái đặt giữ chỗ tại trạm xe buýt'
    ],
    badge: 'Desktop 1440×978',
    wireframeSrc: '/library-bus/screens/wf_08_ho_so_ban_doc.webp',
    uiSrc: '/library-bus/screens/screen_08_ho_so_ban_doc.webp',
    uiFullSrc: '/library-bus/screens/screen_08_ho_so_ban_doc.webp'
  },
  {
    id: '9',
    index: 9,
    titleVi: '9. Quản lý mượn trả sách',
    titleEn: '9. Borrow & Return Management',
    module: 'transactions',
    moduleNameVi: 'Lưu thông & Mượn trả',
    moduleNameEn: 'Circulation & Transactions',
    templatePath: 'templates/transactions/borrow_list.html',
    routePath: '/transactions/borrows/',
    role: 'Thủ thư & Vận hành',
    descVi: 'Bảng điều hành giao dịch lưu thông sách: lọc theo trạng thái mượn/trả/quá hạn, tạo phiếu mượn mới và kiểm soát hạn trả của từng hội viên.',
    descEn: 'Circulation transaction management table with status filtering (active, returned, overdue), new borrow slip creation, and due-date tracking.',
    wireframeElements: [
      'Thanh bên phân hệ giao dịch lưu thông',
      'Banner tiêu đề kèm nút + Tạo phiếu mượn ở góc phải',
      'Thanh công cụ tìm kiếm từ khóa và lọc trạng thái phiếu',
      'Bảng dữ liệu 7 cột hiển thị lịch sử mượn trả và nút Chi tiết'
    ],
    uiFeatures: [
      'Điều hướng nhanh: Mượn / Trả sách, Đặt trước, Xử lý hàng loạt, Thống kê',
      'Bộ lọc tìm kiếm theo tên sách hoặc mã người dùng kết hợp lọc trạng thái',
      'Bảng dữ liệu chuẩn hóa: Người dùng, Sách, Ngày mượn, Hạn trả, Ngày trả, Trạng thái',
      'Nhãn cảnh báo màu đỏ QUÁ HẠN và nhãn xanh ĐÃ TRẢ giúp thủ thư xử lý tức thì'
    ],
    badge: 'Desktop 1440×1218',
    wireframeSrc: '/library-bus/screens/wf_09_quan_ly_muon_tra.webp',
    uiSrc: '/library-bus/screens/screen_09_quan_ly_muon_tra.webp',
    uiFullSrc: '/library-bus/screens/screen_09_quan_ly_muon_tra.webp'
  },
  {
    id: '10',
    index: 10,
    titleVi: '10. Báo cáo phân tích dữ liệu',
    titleEn: '10. Operational Analytics Dashboard',
    module: 'analytics',
    moduleNameVi: 'Quản trị & Phân tích',
    moduleNameEn: 'Admin & Analytics',
    templatePath: 'templates/analytics/dashboard.html',
    routePath: '/analytics/',
    role: 'Ban dự án & Độc giả',
    descVi: 'Trung tâm phân tích dữ liệu tích hợp thống kê cá nhân, bảng xếp hạng Bayesian, phân tích hiệu suất đội xe và danh sách gợi ý sách Cosine Similarity.',
    descEn: 'Analytics hub integrating personal reading metrics, Bayesian leaderboards, bus fleet utilization, and Cosine Similarity book recommendations.',
    wireframeElements: [
      'Thanh bên 9 mục phân tích chuyên sâu (Cá nhân & Admin)',
      'Banner chào mừng và hàng 4 thẻ lối tắt chức năng',
      'Hàng 4 thẻ chỉ số KPI cá nhân hóa (Hạng, Sách đã mượn, Chuỗi đọc, Hoạt động)',
      'Danh sách 5 thẻ gợi ý sách dành riêng cho người dùng'
    ],
    uiFeatures: [
      'Menu phân tích toàn diện: Thống kê của tôi, Phân tích sách, Bảng xếp hạng, Gợi ý cho bạn, Tổng quan Admin, Phân tích xe bus, Báo cáo',
      '4 thẻ KPI trực quan với biểu tượng màu sắc phân biệt từng nhóm chỉ số',
      'Khối "Gợi ý dành riêng cho bạn" xuất kết quả từ thuật toán tương đồng sở thích đọc'
    ],
    badge: 'Desktop 1440×1644',
    wireframeSrc: '/library-bus/screens/wf_10_analytics_dashboard.webp',
    uiSrc: '/library-bus/screens/screen_10_analytics_dashboard.webp',
    uiFullSrc: '/library-bus/screens/screen_10_analytics_dashboard.webp'
  },
  {
    id: '11',
    index: 11,
    titleVi: '11. Trung tâm quản trị Django Admin',
    titleEn: '11. Django Admin Control Center',
    module: 'admin',
    moduleNameVi: 'Quản trị & Phân tích',
    moduleNameEn: 'Admin & Analytics',
    templatePath: 'templates/admin/index.html',
    routePath: '/admin/',
    role: 'Quản trị viên hệ thống (System Admin)',
    descVi: 'Bảng điều khiển quản trị cơ sở dữ liệu toàn hệ thống, phân quyền người dùng, kiểm soát giao dịch hàng loạt, thanh toán phạt và nhật ký kiểm toán.',
    descEn: 'System-wide database administration portal managing role permissions, bulk transactions, fine payments, and real-time audit logs.',
    wireframeElements: [
      'Thanh bên quản trị nền tối gom nhóm theo phân hệ Django App',
      'Lưới 2 cột các thẻ bảng dữ liệu (Models) kèm nút Xem và Thêm mới',
      'Cột phải: danh sách nhật ký thao tác gần đây (Recent actions)'
    ],
    uiFeatures: [
      'Phân nhóm rõ 5 phân hệ: Analytics, Authentication, Blog, Transactions, Users',
      'Quản lý trực tiếp các bảng: Gợi ý sách, Thống kê hàng ngày, Thống kê xe bus, Yêu cầu giao sách, Giao dịch hàng loạt, Thanh toán phạt, Đặt trước sách',
      'Khối Recent actions ghi vết lịch sử chỉnh sửa dữ liệu của quản trị viên'
    ],
    badge: 'Desktop 1440×2149',
    wireframeSrc: '/library-bus/screens/wf_11_django_admin.webp',
    uiSrc: '/library-bus/screens/screen_11_django_admin.webp',
    uiFullSrc: '/library-bus/screens/screen_11_django_admin.webp'
  }
];

export const LIBRARY_BUS_MOBILE_SCREENS: LibraryBusScreenItem[] = LIBRARY_BUS_11_SCREENS.map((s) => {
  const slug = s.uiSrc.replace('/library-bus/screens/screen_', '').replace('.webp', '');
  const mobileHeights: Record<string, string> = {
    '1': '390×2586',
    '2': '390×2775',
    '3': '390×760',
    '4': '390×1865',
    '5': '390×944',
    '6': '390×743',
    '7': '390×1300',
    '8': '390×844',
    '9': '390×1182',
    '10': '390×1494',
    '11': '390×1442',
  };
  return {
    ...s,
    titleEn: `${s.titleEn} (Mobile)`,
    role: 'Mobile (390px)',
    descVi: `Bản Mobile (${mobileHeights[s.id] || '390px'}): bố cục một cột tối ưu thao tác chạm một tay, thu gọn thanh điều hướng thành menu ngăn kéo. ${s.descVi}`,
    descEn: `Mobile viewport (${mobileHeights[s.id] || '390px'}): single-column touch-optimized layout with collapsible drawer navigation. ${s.descEn}`,
    badge: `Mobile ${mobileHeights[s.id] || '390px'}`,
    wireframeSrc: `/library-bus/screens/wf_mobile_${slug}.webp`,
    uiSrc: `/library-bus/screens/screen_mobile_${slug}.webp`,
    uiFullSrc: `/library-bus/screens/screen_mobile_${slug}.webp`,
  };
});

// Backward-compatible export alias
export const LIBRARY_BUS_20_SCREENS = LIBRARY_BUS_11_SCREENS;
