/**
 * Library Bus Management System - Design Guidelines, Architecture & Telemetry Data
 * Structured following "Thiết kế chưa có tên.pdf" (Website Guidelines by Dương Dương)
 * Adapted to Personal Portfolio Palette (#0D7287, #9BE7FA, #C8EEF7, #FFD14C)
 */

export const PORTFOLIO_PALETTE = {
  teal: '#0D7287',         // Deep Teal Anchor
  tealHover: '#095869',    // Deep Teal Hover
  skyVivid: '#9BE7FA',     // Sky Blue Vivid
  skyLight: '#C8EEF7',     // Soft Sky Blue Surface
  yellow: '#FFD14C',       // Vibrant Yellow / Gold CTA
  yellowLight: '#FFE485',   // Pastel Gold / Soft Accent
  ink: '#1A2332',          // Deep Navy Slate Text
  inkSecondary: '#4A5C72', // Slate Secondary Text
  ground: '#FAFDFE',       // Crisp Ground
  groundAlt: '#F0F9FB',    // Subtle Sky Ground
  borderSubtle: '#D2EDF6', // Subtle Sky Border
  borderStrong: '#A3DFF0', // Strong Sky Border
};

// Aliased for backward compatibility
export const NEO_BAKERY = PORTFOLIO_PALETTE;

// ==========================================
// 01 INTRODUCTION AND RESEARCH
// ==========================================

export const ABOUT_US_DATA = {
  chapter: '01',
  subChapter: '1.1',
  titleVi: 'VỀ CHÚNG TÔI',
  titleEn: 'ABOUT US',
  subtitleVi: '/Về chúng tôi/',
  subtitleEn: '/About Us/',
  reason: {
    titleVi: 'Lý do phát triển',
    titleEn: 'Reason for Development',
    descVi: 'Tại nhiều khu đô thị mới, khu dân cư ngoại thành và trường học công lập, khoảng cách địa lý đến các thư viện trung tâm còn xa, nguồn sách mới cập nhật chưa đồng đều. Dự án Xe Thư Viện Lưu Động (Library Bus) ra đời nhằm xóa bỏ rào cản tiếp cận tri thức, đưa những cuốn sách hay đến tận cửa nhà và sân trường của độc giả.',
    descEn: 'In many suburban zones, schools, and developing residential clusters, physical distance to central libraries remains a barrier. The Mobile Library Bus project bridges this gap by bringing quality literature directly to local neighborhoods and school gates.'
  },
  mission: {
    titleVi: 'Sứ mệnh',
    titleEn: 'Mission',
    descVi: 'Bình đẳng hóa cơ hội tiếp cận tri thức chất lượng cao; kết hợp công nghệ định vị GPS, đặt mượn trực tuyến O(1) và không gian sinh hoạt văn hóa lưu động để nuôi dưỡng tình yêu đọc sách lâu dài cho mọi lứa tuổi trong cộng đồng.',
    descEn: 'Democratize access to premier reading materials; blend real-time GPS tracking, O(1) online book reservations, and welcoming pop-up reading spaces to foster sustainable reading habits across all generations.'
  },
  brandMeaning: {
    titleVi: 'Ý nghĩa tên thương hiệu',
    titleEn: 'Brand Name Meaning',
    descVi: '"Library Bus" – Sự giao thoa giữa không gian tĩnh của tri thức (Library) và chuyển động không ngừng của bánh xe cộng đồng (Bus). Tên gọi khẳng định tinh thần: Thư viện không còn thụ động chờ người đọc tìm đến, mà chủ động lăn bánh phục vụ người dân.',
    descEn: '"Library Bus" embodies the harmony between static wisdom (Library) and dynamic community movement (Bus). It proclaims a paradigm shift: wisdom no longer waits in silence, it travels to meet the people.'
  }
};

export const UX_RESEARCH_DATA = {
  chapter: '01',
  subChapter: '1.2',
  titleVi: 'NGHIÊN CỨU TRẢI NGHIỆM NGƯỜI DÙNG',
  titleEn: 'UX RESEARCH',
  subtitleVi: '/Nghiên cứu thị trường & Người dùng/',
  subtitleEn: '/Market Research & User Insights/',
  marketResearch: {
    marketId: {
      titleVi: 'Xác định thị trường',
      titleEn: 'Market Identification',
      descVi: 'Thị trường văn hóa đọc đang chuyển dịch mạnh mẽ theo xu hướng O2O (Online-to-Offline). Độc giả hiện đại mong muốn tra cứu thông tin sách nhanh chóng qua smartphone nhưng vẫn khao khát được cầm trên tay những cuốn sách giấy và sinh hoạt trong không gian cộng đồng ấm áp.',
      descEn: 'The reading ecosystem is shifting rapidly towards O2O (Online-to-Offline). Readers want instantaneous digital discovery coupled with the tactile satisfaction of physical books in friendly communal settings.'
    },
    currentTrends: {
      titleVi: 'Xu hướng hiện tại',
      titleEn: 'Current Trends',
      descVi: 'Số hóa quản trị kho theo thời gian thực (Real-time IoT & GPS), mô hình trạm đón thông minh (Smart Bus Stops), trải nghiệm đặt trước không chạm và ứng dụng cơ chế Gamification (chuỗi đọc, bảng vinh danh độc giả) nhằm gia tăng gắn kết.',
      descEn: 'Real-time inventory telemetry via IoT & GPS, smart pick-up stops, contactless reservation queues, and gamified reading streaks to dramatically heighten user engagement.'
    }
  },
  customerTarget: {
    demographics: [
      { labelVi: 'Độ tuổi', labelEn: 'Age Group', value: '6 - 45 tuổi' },
      { labelVi: 'Giới tính', labelEn: 'Gender', value: 'Mọi giới tính (55% Nữ, 45% Nam)' },
      { labelVi: 'Nghề nghiệp', labelEn: 'Occupation', value: 'Học sinh, Sinh viên, Phụ huynh, Hưu trí' },
      { labelVi: 'Khu vực', labelEn: 'Geography', value: 'Trường học, khu đô thị ngoại ô, điểm dừng bus' },
    ],
    personas: [
      {
        name: 'Nguyễn Minh Trí',
        roleVi: 'Học sinh THPT (16 tuổi)',
        roleEn: 'High School Student (16 y/o)',
        avatar: '🎓',
        needsVi: 'Cần sách ôn luyện khoa học, văn học và tiểu thuyết trẻ. Thường tan trường vào cuối chiều, không kịp tới thư viện thành phố.',
        needsEn: 'Needs exam preps, science books and young adult novels. Finishes school late and cannot travel to central city libraries.',
        painPointVi: 'Sợ đến xe thì sách đã bị mượn hết; muốn biết chính xác xe dừng ở cổng trường vào thứ mấy.',
        painPointEn: 'Worries the desired book is already borrowed; wants exact stop timings at the school gate.'
      },
      {
        name: 'Trần Thị Mai Lan',
        roleVi: 'Phụ huynh bận rộn (34 tuổi)',
        roleEn: 'Working Mother (34 y/o)',
        avatar: '👩‍💼',
        needsVi: 'Muốn rèn thói quen đọc sách cho con gái 8 tuổi thay vì xem thiết bị điện tử. Thích không gian đọc ngoài trời cuối tuần.',
        needsEn: 'Wants to instill reading habits in her 8 y/o child instead of screens. Loves outdoor weekend reading events.',
        painPointVi: 'Thời gian rảnh eo hẹp; cần ứng dụng đặt trước sách nhanh chóng để đón con tan học là lấy sách luôn.',
        painPointEn: 'Extremely limited free time; needs quick mobile reservation to pick up books right when picking up kids.'
      },
      {
        name: 'Bác Lê Văn Hưng',
        roleVi: 'Cán bộ hưu trí (68 tuổi)',
        roleEn: 'Retired Teacher (68 y/o)',
        avatar: '👴',
        needsVi: 'Yêu thích đọc báo buổi sáng, sách lịch sử, hồi ký. Coi điểm dừng thư viện là nơi gặp gỡ giao lưu tuổi già.',
        needsEn: 'Enjoys morning news, history books and memoirs. Considers the mobile bus stop a heartwarming social hub.',
        painPointVi: 'Gặp khó khăn với các giao diện ứng dụng phức tạp; cần sự trợ giúp thân thiện trực tiếp từ thủ thư.',
        painPointEn: 'Struggles with complex app navigations; values warm, direct face-to-face assistance from librarians.'
      }
    ]
  },
  websiteReferences: [
    {
      name: 'Thư viện Quốc gia Số',
      prosVi: 'Kho tài liệu số hóa khổng lồ, danh mục học thuật chuẩn DDC.',
      consVi: 'Giao diện truyền thống, thiếu định vị thực địa và thiếu tính năng giữ chỗ trạm di động.',
      takeawayVi: 'Học hỏi quy chuẩn phân loại danh mục sách quốc tế, hiện đại hóa giao diện phẳng trực quan.'
    },
    {
      name: 'Mô hình Bookmobile Quốc tế',
      prosVi: 'Tính lưu động cao, gắn kết trực tiếp với các trường học và khu dân cư.',
      consVi: 'Quản lý lịch trình thủ công, độc giả không xem được vị trí xe thời gian thực.',
      takeawayVi: 'Tích hợp định vị GPS trực tiếp (Live Fleet Telemetry) và đồng bộ kho O(1) qua Redis.'
    },
    {
      name: 'Nền tảng Libby / OverDrive',
      prosVi: 'Trải nghiệm mượn sách mượt mà, hệ thống giữ chỗ (Hold Queues) tối ưu.',
      consVi: 'Chủ yếu phục vụ E-book, không hỗ trợ điều phối xe thực tế.',
      takeawayVi: 'Kế thừa luồng giữ chỗ tự động và bổ sung thông báo Celery nhắc hẹn qua Email/SMS.'
    }
  ],
  functions: [
    { id: '1', nameVi: 'Tra Cứu Mục Lục Động O(1)', nameEn: 'Dynamic O(1) Catalog Discovery', descVi: 'Tìm kiếm theo tên sách, tác giả, thể loại với bộ nhớ đệm Redis sub-30ms.' },
    { id: '2', nameVi: 'Định Vị Xe GPS Theo Thời Gian Thực', nameEn: 'Live GPS Fleet Tracking', descVi: 'Theo dõi 12 đầu xe và 48 trạm dừng, hiển thị lộ trình sắp đến từng phút.' },
    { id: '3', nameVi: 'Khóa Bi Quan Đặt Giữ Chỗ Trạm', nameEn: 'Pessimistic Hold Queues', descVi: 'select_for_update() khóa cứng bản ghi tại DB, cam kết 0% Race Condition.' },
    { id: '4', nameVi: 'Thẻ Độc Giả Số & Gamification', nameEn: 'Digital Reader Pass & Streaks', descVi: 'Thẻ thành viên mã QR, tích điểm uy tín, duy trì chuỗi ngày đọc và thăng hạng.' },
    { id: '5', nameVi: 'Nhắc Hẹn Tự Động Qua Celery', nameEn: 'Automated Celery Reminders', descVi: 'Gửi thông báo đẩy và email nhắc hẹn trả sách trước 2 ngày, tự động tính hạn.' },
    { id: '6', nameVi: 'Cổng Quản Trị Dispatcher Cho Thủ Thư', nameEn: 'Librarian Fleet Dispatch Portal', descVi: 'Màn hình kiểm kê tồn kho, xuất nhập sách thực địa và quản lý độc giả mượn trả.' }
  ],
  sitemap: [
    {
      parentVi: 'Trang chủ (Home)',
      childrenVi: ['Hero xe thư viện', 'Bản đồ lộ trình trạm', 'Sách mới nổi bật', 'Bảng tin hoạt động']
    },
    {
      parentVi: 'Kho sách & Tra cứu',
      childrenVi: ['Mục lục phân loại', 'Bộ lọc xe buýt & trạm', 'Chi tiết cuốn sách', 'Đặt giữ chỗ trước']
    },
    {
      parentVi: 'Lộ trình & Trạm dừng',
      childrenVi: ['Danh sách 48 trạm GPS', 'Lịch trình theo ngày', 'Bản đồ vị trí xe live', 'Đăng ký trạm mới']
    },
    {
      parentVi: 'Hồ sơ & Thẻ độc giả',
      childrenVi: ['Thẻ thư viện QR', 'Lịch sử mượn & trả', 'Chuỗi ngày đọc (Streak)', 'Hạng thành viên']
    },
    {
      parentVi: 'Cộng đồng & Tin tức',
      childrenVi: ['Review sách hay', 'Sự kiện giao lưu cuối tuần', 'Quyên góp sách', 'Chính sách mượn']
    }
  ],
  userFlowSteps: [
    { id: 'start', labelVi: 'Trang chủ', type: 'start', descVi: 'Độc giả truy cập cổng Library Bus' },
    { id: 'search_decision', labelVi: 'Đã biết sách cần tìm?', type: 'decision', descVi: 'Lựa chọn tìm kiếm theo tên hoặc duyệt danh mục' },
    { id: 'enter_keyword', labelVi: 'Nhập từ khóa tra cứu', type: 'action', descVi: 'Tìm nhanh qua bộ nhớ đệm Redis' },
    { id: 'browse_catalog', labelVi: 'Khám phá theo thể loại', type: 'action', descVi: 'Duyệt theo chủ đề và trạm xe gần nhất' },
    { id: 'book_detail', labelVi: 'Xem chi tiết sách', type: 'action', descVi: 'Kiểm tra tình trạng còn sách trên các xe' },
    { id: 'choose_station', labelVi: 'Chọn trạm nhận sách', type: 'action', descVi: 'Lựa chọn trạm đón tiện lợi nhất' },
    { id: 'auth_decision', labelVi: 'Đã có tài khoản?', type: 'decision', descVi: 'Kiểm tra trạng thái đăng nhập độc giả' },
    { id: 'login', labelVi: 'Đăng nhập thẻ độc giả', type: 'action', descVi: 'Xác thực nhanh qua mã thẻ hoặc SĐT' },
    { id: 'register', labelVi: 'Đăng ký nhanh', type: 'action', descVi: 'Khai báo thông tin nhận sách' },
    { id: 'confirm_hold', labelVi: 'Xác nhận giữ chỗ (Lock)', type: 'action', descVi: 'Khóa bi quan select_for_update' },
    { id: 'success', labelVi: 'Đặt mượn thành công & Mã QR', type: 'end', descVi: 'Nhận vé QR và thông báo lịch xe đến' }
  ]
};

// ==========================================
// 02 LOGO AND UI COMPONENTS
// ==========================================

export const BRAND_IDENTITY_DATA = {
  chapter: '02',
  subChapter: '2.1 & 2.2',
  titleVi: 'HỆ THỐNG NHẬN DIỆN & THÀNH PHẦN GIAO DIỆN',
  titleEn: 'LOGO AND UI COMPONENTS',
  subtitleVi: '/Nhận diện thương hiệu & Thư viện thành phần/',
  subtitleEn: '/Brand Guidelines & Component Library/',
  logo: {
    ideaVi: 'Logo của Library Bus được kết hợp từ biểu tượng chiếc xe buýt chuyển động và những trang sách đang mở, tượng trưng cho cánh chim tri thức vươn cao trên cung đường số.',
    ideaEn: 'The Library Bus logo fuses the silhouette of a moving transit vehicle with open book pages, symbolizing wings of knowledge soaring across digital routes.',
    meaningVi: 'Sự giao hòa giữa màu Xanh Teal uy tín và Xanh Sky năng động tạo nên vẻ đẹp hiện đại, đáng tin cậy và tràn đầy nhiệt huyết phụng sự cộng đồng.',
    meaningEn: 'The harmonious union of Deep Teal integrity and Sky Blue vitality embodies modern reliability and passionate civic commitment.',
    structureRatio: '6.6X × 4X (Chiều dài 6.6X và Chiều cao 4X, với X là đơn vị cơ sở chuẩn hóa)',
    safeDistance: '1.5X khi đứng độc lập và 2X khi đứng cạnh logo đối tác trường học / nhà tài trợ',
    minimumSize: '56.7px (~2cm) trên ấn phẩm in và 42.5px trên màn hình số để đảm bảo độ rõ nét',
    fontName: 'Outfit & Inter (Tối ưu cho màn hình số Responsive)'
  },
  colors: {
    primary: [
      { nameVi: 'Deep Teal (Màu chủ đạo)', hex: '#0D7287', rgb: '13, 114, 135', roleVi: 'Nhận diện thương hiệu chính, màu của sự tin cậy, tri thức bền vững' },
      { nameVi: 'Sky Blue Vivid (Màu công nghệ)', hex: '#9BE7FA', rgb: '155, 231, 250', roleVi: 'Màu nền bề mặt phụ trợ, thanh điều hướng và trạng thái hover tươi sáng' },
      { nameVi: 'Gold CTA (Màu hành động)', hex: '#FFD14C', rgb: '255, 209, 76', roleVi: 'Nút bấm kêu gọi hành động (Đặt mượn, Giữ chỗ, Đăng ký)' }
    ],
    supporting: [
      { nameVi: 'Deep Slate Text', hex: '#1A2332', rgb: '26, 35, 50', roleVi: 'Văn bản hiển thị chính, độ tương phản cao đạt chuẩn WCAG AAA' },
      { nameVi: 'Muted Slate Text', hex: '#4A5C72', rgb: '74, 92, 114', roleVi: 'Văn bản phụ, nhãn metadata và đường phân cách' },
      { nameVi: 'Soft Sky Ground', hex: '#F0F9FB', rgb: '240, 249, 251', roleVi: 'Bề mặt thẻ card, khối dữ liệu phân cấp' },
      { nameVi: 'Crisp Ground', hex: '#FAFDFE', rgb: '250, 253, 254', roleVi: 'Màu nền trang chủ, đem lại cảm giác thoáng mát' }
    ]
  },
  typography: [
    { tag: 'HEADING 1', size: '72 pt', letterSpacing: '-1.5', example: 'Thư Viện Lưu Động', roleVi: 'Tiêu đề Hero & Trang chính' },
    { tag: 'HEADING 2', size: '58 pt', letterSpacing: '-0.5', example: 'Mục Lục Sách Động', roleVi: 'Tiêu đề phân hệ chính' },
    { tag: 'HEADING 3', size: '46 pt', letterSpacing: '0', example: 'Lộ Trình Xe Bus GPS', roleVi: 'Tiêu đề khối chức năng' },
    { tag: 'HEADING 4', size: '33 pt', letterSpacing: '0.25', example: 'Thông Tin Mượn Trả', roleVi: 'Tiêu đề card & modal' },
    { tag: 'Subtitle 1', size: '15 pt', letterSpacing: '0.15', example: 'Hệ sinh thái tri thức cho mọi nhà', roleVi: 'Phụ đề giới thiệu' },
    { tag: 'Subtitle 2', size: '13 pt', letterSpacing: '0.1', example: 'Cập nhật 5 phút trước', roleVi: 'Nhãn thời gian & trạng thái' },
    { tag: 'Body 1', size: '16 pt', letterSpacing: '0.1', example: 'Độc giả có thể tra cứu và giữ chỗ sách trực tuyến...', roleVi: 'Nội dung văn bản chuẩn' },
    { tag: 'Body 2', size: '14 pt', letterSpacing: '0.25', example: 'Áp dụng khóa bi quan cấp cơ sở dữ liệu...', roleVi: 'Ghi chú kỹ thuật' },
    { tag: 'BUTTON', size: '14 pt', letterSpacing: '1.25', example: 'ĐẶT MƯỢN NGAY', roleVi: 'Nút bấm kêu gọi' },
    { tag: 'Caption', size: '12 pt', letterSpacing: '0.4', example: 'Bản quyền © 2026 Library Bus System', roleVi: 'Chú thích chân trang' }
  ],
  uiComponents: {
    buttons: [
      { type: 'Primary Button', default: 'Đặt Mượn Sách', hover: 'Hiệu ứng Shadow Teal', disabled: 'Màu xám nhạt không click' },
      { type: 'Secondary Button', default: 'Xem Lộ Trình Xe', hover: 'Nền Sky Light viền Teal', disabled: 'Ẩn hiệu ứng' },
      { type: 'Outline Button', default: 'Chi Tiết Trạm Dừng', hover: 'Đổi nền trắng sang viền đậm', disabled: 'Mờ nhạt' }
    ],
    textFill: {
      defaultState: 'Nhập tên sách hoặc tác giả...',
      hoverState: 'Viền sáng #9BE7FA',
      focusState: 'Viền xanh Teal #0D7287 kèm glow ring',
      errorState: 'Viền đỏ kèm thông báo lỗi'
    },
    iconSet: ['Bus', 'BookOpen', 'Search', 'User', 'MapPin', 'Calendar', 'Bell', 'ShieldCheck', 'QrCode', 'Clock', 'Sparkles', 'Layers']
  }
};

// ==========================================
// Bảng màu chuẩn hóa từ Bảng 4 màu chính thức (#9BE7FA, #C8EEF7, #FFE485, #FFD14C)
export const NEO_BAKERY_TOKENS = {
  molasses: '#074553',         // Deep teal anchor / page ground dark (Darker shade of #9BE7FA)
  wellBrowned: '#095869',     // Rich deep cyan hover
  roast: '#0D7287',           // Deep cyan brand anchor / Primary CTA
  toasty: '#9BE7FA',          // Sky blue vivid / active border
  greasey: '#FFE485',         // Soft sunlight cream / badge background
  butter: '#FFD14C',          // Honey gold CTA / highlight
  bgPage: '#FAFDFE',          // Clean ice ground
  bgPageAlt: '#F0F9FB',       // Soft sky surface
  bgSurface: '#FFFFFF',       // Elevated card surface
  bgSurfaceRaised: '#E8FAFE', // Interactive surface
  bgSurfaceSunken: '#C8EEF7', // Input recessed surface
  darkPage: '#0B171D',        // Deep night teal ground
  darkSurface: '#0F262F',     // Dark card surface
  darkSurfaceRaised: '#153A47',
};

// ==========================================
// 03 WEBSITE DESIGN (Toàn bộ 20 Màn hình Hệ thống)
// ==========================================

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
  uiFullSrc: string;
}

export const LIBRARY_BUS_20_SCREENS: LibraryBusScreenItem[] = [
  {
    id: 'screen-01',
    index: 1,
    titleVi: '1. Trang chủ',
    titleEn: '1. Homepage',
    module: 'public',
    moduleNameVi: 'Khách vãng lai & Độc giả',
    moduleNameEn: 'Public & Reader',
    templatePath: 'template/pages/index.html',
    routePath: '/',
    role: 'Tất cả người dùng',
    descVi: 'Khung Hero chào đón với hình ảnh xe thư viện thực địa, thanh tìm kiếm thông minh O(1), 4 chỉ số KPI vận hành, kệ sách tuyển chọn và tin tức cộng đồng.',
    descEn: 'Hero welcome banner featuring real-life library bus, instant O(1) search, 4 operational KPI metrics, featured book shelf, and community news.',
    wireframeElements: ['Navbar & Brand logo', 'Hero Banner image box', 'O(1) Search bar input', '4-Column Book Cards Grid', '3-News Cards Grid'],
    uiFeatures: ['Ảnh xe thực địa hero_bus.webp', 'Nút CTA Giữ chỗ vàng mật ong', 'Huy hiệu xe buýt nổi bật', 'Hoạt cảnh GSAP mượt mà'],
    badge: 'Core Page',
    wireframeSrc: '/library-bus/screens/wf_01_trang_chu.webp',
    uiSrc: '/library-bus/screens/ui_01_trang_chu.webp',
    uiFullSrc: '/library-bus/full_screens/full_01_trang_chu.png'
  },
  {
    id: 'screen-02',
    index: 2,
    titleVi: '2. Giới thiệu',
    titleEn: '2. About Us',
    module: 'public',
    moduleNameVi: 'Khách vãng lai & Độc giả',
    moduleNameEn: 'Public & Reader',
    templatePath: 'template/pages/about.html',
    routePath: '/about/',
    role: 'Tất cả người dùng',
    descVi: 'Sứ mệnh bình đẳng hóa tri thức văn hóa đọc, lịch sử ra đời của mô hình xe buýt chở sách và cơ cấu mạng lưới 12 đầu xe phục vụ 48 trạm.',
    descEn: 'Mission to democratize reading culture, inception history of the mobile library concept, and the fleet framework of 12 buses serving 48 stops.',
    wireframeElements: ['Mission statement header', 'History timeline', 'Bus fleet structure grid', 'Volunteer callout banner'],
    uiFeatures: ['Thẻ sứ mệnh viền hổ phách', 'Chân dung đội ngũ thủ thư', 'Thông số xã hội 50.000+ độc giả'],
    badge: 'Brand',
    wireframeSrc: '/library-bus/screens/wf_02_gioi_thieu.webp',
    uiSrc: '/library-bus/screens/ui_02_gioi_thieu.webp',
    uiFullSrc: '/library-bus/full_screens/full_02_gioi_thieu.webp'
  },
  {
    id: 'screen-03',
    index: 3,
    titleVi: '3. Danh sách sách',
    titleEn: '3. Book Catalog',
    module: 'public',
    moduleNameVi: 'Khách vãng lai & Độc giả',
    moduleNameEn: 'Public & Reader',
    templatePath: 'template/inventory/book_list.html',
    routePath: '/books/',
    role: 'Tất cả người dùng',
    descVi: 'Kho sách 15.000+ cuốn với bộ lọc danh mục đa tầng DDC, lọc theo tuyến xe buýt gần nhất, tìm kiếm tức thì và lưới thẻ sách 2 cột kèm phân trang.',
    descEn: '15,000+ book repository with multi-tier DDC classification, nearest bus line filter, instant search, and 2-column card grid with pagination.',
    wireframeElements: ['Category Sidebar filter', 'Instant Search Input', 'Sort Dropdown', 'Book Cards Grid with badges', 'Pagination bar (1 2 3 ... 24)'],
    uiFeatures: ['Thẻ sách tông màu bơ mật ong', 'Tag tình trạng tồn kho thời gian thực', 'Phân loại DDC chuẩn thư viện quốc gia'],
    badge: 'Inventory',
    wireframeSrc: '/library-bus/screens/wf_03_danh_sach_sach.webp',
    uiSrc: '/library-bus/screens/ui_03_danh_sach_sach.webp',
    uiFullSrc: '/library-bus/full_screens/full_03_danh_sach_sach.webp'
  },
  {
    id: 'screen-04',
    index: 4,
    titleVi: '4. Chi tiết sách',
    titleEn: '4. Book Detail',
    module: 'public',
    moduleNameVi: 'Khách vãng lai & Độc giả',
    moduleNameEn: 'Public & Reader',
    templatePath: 'template/inventory/book_detail.html',
    routePath: '/books/<slug>/',
    role: 'Tất cả người dùng',
    descVi: 'Bố cục 2-sheet chuẩn mẫu: Khung ảnh gallery, bảng chọn xe bus còn tồn kho kèm nút Giữ Chỗ, hệ thống đánh giá 9.7/10, review độc giả và sách tương tự.',
    descEn: '2-sheet layout twin to guidelines: Media gallery, bus selector table with Hold CTA, 9.7/10 rating breakdown, reader reviews, and similar books.',
    wireframeElements: ['Gallery with 1 large + 3 thumbs', 'Specs & Amenities row', 'Bus Fleet Selector table', '9.7 Score Circle & Progress bars', '4 Similar Books grid'],
    uiFeatures: ['Bảng chọn xe bus tồn kho sống', 'Nút Giữ chỗ khóa bi quan 48h', 'Đánh giá độc giả thực tế 9.7/10', 'Bìa sách phân giải cao'],
    badge: 'Signature UI',
    wireframeSrc: '/library-bus/screens/wf_04_chi_tiet_sach.webp',
    uiSrc: '/library-bus/screens/ui_04_chi_tiet_sach.webp',
    uiFullSrc: '/library-bus/full_screens/full_04_chi_tiet_sach.webp'
  },
  {
    id: 'screen-05',
    index: 5,
    titleVi: '5. Danh sách xe (bản đồ)',
    titleEn: '5. Bus Fleet GPS Map',
    module: 'public',
    moduleNameVi: 'Khách vãng lai & Độc giả',
    moduleNameEn: 'Public & Reader',
    templatePath: 'template/inventory/bus_list.html',
    routePath: '/buses/',
    role: 'Tất cả người dùng',
    descVi: 'Bản đồ định vị GPS tương tác hiển thị thời gian thực vị trí của 12 đầu xe buýt thư viện, trạng thái di chuyển và danh sách 48 trạm dừng toàn thành phố.',
    descEn: 'Interactive live GPS map displaying real-time positions of 12 library buses, moving telemetry, and 48 municipal scheduled pick-up stops.',
    wireframeElements: ['Full-width Interactive Map canvas', 'Bus route filter drawer', 'Bus stop pin markers', 'Realtime Telemetry card popup'],
    uiFeatures: ['Bản đồ định vị GPS sub-second', 'Trạng thái hoạt động / bảo dưỡng', 'Bộ đếm số độc giả đang có mặt tại xe'],
    badge: 'IoT Fleet',
    wireframeSrc: '/library-bus/screens/wf_05_danh_sach_xe_ban_do.webp',
    uiSrc: '/library-bus/screens/ui_05_danh_sach_xe_ban_do.webp',
    uiFullSrc: '/library-bus/full_screens/full_05_danh_sach_xe_ban_do.webp'
  },
  {
    id: 'screen-06',
    index: 6,
    titleVi: '6. Chi tiết xe buýt',
    titleEn: '6. Bus Detail & Schedule',
    module: 'public',
    moduleNameVi: 'Khách vãng lai & Độc giả',
    moduleNameEn: 'Public & Reader',
    templatePath: 'template/inventory/bus_detail.html',
    routePath: '/buses/<id>/',
    role: 'Tất cả người dùng',
    descVi: 'Hồ sơ chi tiết từng đầu xe: Biển số, dung lượng kho sách (1.200 cuốn), tài xế & thủ thư phụ trách, lịch trình đón trả khách trong tuần.',
    descEn: 'Detailed bus profile: License plate, physical capacity (1,200 books), assigned driver & librarian, and weekly scheduled stops timeline.',
    wireframeElements: ['Bus Profile Header', 'Weekly Schedule Timeline', 'On-board Books list', 'Librarian Contact card'],
    uiFeatures: ['Lịch đón xe chi tiết theo thứ', 'Danh mục sách đang có mặt trên xe', 'Đánh giá tiện nghi xe buýt'],
    badge: 'Fleet Ops',
    wireframeSrc: '/library-bus/screens/wf_06_chi_tiet_xe_buyt.webp',
    uiSrc: '/library-bus/screens/ui_06_chi_tiet_xe_buyt.webp',
    uiFullSrc: '/library-bus/full_screens/full_06_chi_tiet_xe_buyt.webp'
  },
  {
    id: 'screen-07',
    index: 7,
    titleVi: '7. Dashboard quản lý thư viện',
    titleEn: '7. Librarian Inventory Dashboard',
    module: 'admin',
    moduleNameVi: 'Quản trị & Phân tích',
    moduleNameEn: 'Admin & Analytics',
    templatePath: 'template/inventory/dashboard.html',
    routePath: '/inventory/dashboard/',
    role: 'Thủ thư & Quản lý',
    descVi: 'Bảng điều khiển tác nghiệp của thủ thư: Kiểm soát tồn kho sách O(1), cảnh báo sách mượn quá hạn, phê duyệt luân chuyển sách giữa các đầu xe.',
    descEn: 'Librarian control center: Real-time O(1) inventory monitoring, overdue borrow alerts, and cross-bus book dispatch approvals.',
    wireframeElements: ['Inventory KPI metric cards', 'Alerts & Overdue Table', 'Cross-bus Transfer queue', 'Bulk Action toolbar'],
    uiFeatures: ['Bộ chỉ số vận hành tức thì', 'Cảnh báo tự động qua Celery Beat', 'Lọc nhanh sách cần bổ sung bản in'],
    badge: 'Librarian',
    wireframeSrc: '/library-bus/screens/wf_07_dashboard_quan_ly_thu_vien.webp',
    uiSrc: '/library-bus/screens/ui_07_dashboard_quan_ly_thu_vien.webp',
    uiFullSrc: '/library-bus/full_screens/full_07_dashboard_quan_ly_thu_vien.webp'
  },
  {
    id: 'screen-08',
    index: 8,
    titleVi: '8. Danh sách quyên góp sách',
    titleEn: '8. Book Donation List',
    module: 'transactions',
    moduleNameVi: 'Lưu thông & Mượn trả',
    moduleNameEn: 'Circulation & Transactions',
    templatePath: 'template/inventory/donation_list.html',
    routePath: '/donations/',
    role: 'Độc giả & Thủ thư',
    descVi: 'Tiếp nhận sách đóng góp từ cộng đồng độc giả, theo dõi quy trình thẩm định chất lượng sách, phân loại mã DDC và gắn mã vạch đưa vào lưu thông.',
    descEn: 'Community book donation tracking: Inspection pipeline, quality grading, DDC classification, and barcode issuance for active fleet circulation.',
    wireframeElements: ['Donation Submission form', 'Donation Pipeline Kanban', 'Contributor Hall of Fame', 'Book Condition status pills'],
    uiFeatures: ['Bảng vinh danh nhà hảo tâm', 'Quy trình kiểm duyệt sách 4 bước', 'Đếm tổng số sách đã tiếp nhận'],
    badge: 'Community',
    wireframeSrc: '/library-bus/screens/wf_08_danh_sach_quyen_gop_sach.webp',
    uiSrc: '/library-bus/screens/ui_08_danh_sach_quyen_gop_sach.webp',
    uiFullSrc: '/library-bus/full_screens/full_08_danh_sach_quyen_gop_sach.webp'
  },
  {
    id: 'screen-09',
    index: 9,
    titleVi: '9. Tạo phiếu mượn sách',
    titleEn: '9. Create Borrow Order',
    module: 'transactions',
    moduleNameVi: 'Lưu thông & Mượn trả',
    moduleNameEn: 'Circulation & Transactions',
    templatePath: 'template/transactions/borrow_create.html',
    routePath: '/transactions/borrow/create/',
    role: 'Thủ thư tại trạm',
    descVi: 'Biểu mẫu thủ thư lập phiếu mượn trực tiếp tại cửa xe: Quét mã vạch sách, kiểm tra hạn mức thẻ độc giả, in biên nhận tự động hẹn ngày trả 14 ngày.',
    descEn: 'On-site borrow order creation at bus door: Barcode scan, reader quota verification, and automated receipt generation with 14-day return date.',
    wireframeElements: ['Barcode input scanner', 'Reader Membership lookup', 'Borrowing Policy summary', 'Confirm & Print Receipt button'],
    uiFeatures: ['Xác thực thẻ độc giả tức thời', 'Tính toán ngày hẹn trả tự động', 'Chống mượn vượt hạn mức (Max 5 cuốn)'],
    badge: 'Transaction',
    wireframeSrc: '/library-bus/screens/wf_09_tao_phieu_muon_sach.webp',
    uiSrc: '/library-bus/screens/ui_09_tao_phieu_muon_sach.webp',
    uiFullSrc: '/library-bus/full_screens/full_09_tao_phieu_muon_sach.webp'
  },
  {
    id: 'screen-10',
    index: 10,
    titleVi: '10. Tạo đặt trước sách',
    titleEn: '10. Book Reservation & Hold',
    module: 'transactions',
    moduleNameVi: 'Lưu thông & Mượn trả',
    moduleNameEn: 'Circulation & Transactions',
    templatePath: 'template/transactions/reservation_create.html',
    routePath: '/transactions/reserve/<book_id>/',
    role: 'Hội viên thư viện',
    descVi: 'Quy trình độc giả đặt giữ sách trực tuyến qua cơ chế khóa bi quan select_for_update: Chọn xe buýt, chọn điểm hẹn nhận sách và nhận mã giữ 48h.',
    descEn: 'Online book hold flow powered by pessimistic select_for_update locking: Select target bus, choose scheduled stop, and receive a 48h hold reservation.',
    wireframeElements: ['Book Summary Card', 'Bus Selection Radio List', 'Pickup Time Slot dropdown', '48h Hold Terms checkbox', 'Submit Hold CTA'],
    uiFeatures: ['Khóa bi quan ngăn xung đột mượn', 'Đếm ngược 48h bảo vệ chỗ', 'Gửi email xác nhận kèm mã QR'],
    badge: 'ACID Lock',
    wireframeSrc: '/library-bus/screens/wf_10_tao_dat_truoc_sach.webp',
    uiSrc: '/library-bus/screens/ui_10_tao_dat_truoc_sach.webp',
    uiFullSrc: '/library-bus/full_screens/full_10_tao_dat_truoc_sach.webp'
  },
  {
    id: 'screen-11',
    index: 11,
    titleVi: '11. Dashboard giao dịch',
    titleEn: '11. Circulation Transactions Dashboard',
    module: 'transactions',
    moduleNameVi: 'Lưu thông & Mượn trả',
    moduleNameEn: 'Circulation & Transactions',
    templatePath: 'template/transactions/dashboard.html',
    routePath: '/transactions/dashboard/',
    role: 'Thủ thư & Quản lý',
    descVi: 'Quản lý toàn diện vòng đời phiếu mượn trả: Theo dõi phiếu đang lưu hành, xử lý gia hạn mượn, giải quyết sách trễ hạn và thu phí đền bù hư hỏng.',
    descEn: 'Comprehensive circulation management: Track active loans, process renewal extensions, resolve overdue cases, and manage fine settlements.',
    wireframeElements: ['Circulation KPI Cards', 'Transaction Filter tabs (Active/Due/Overdue)', 'Circulation Log table', 'Quick Actions modal'],
    uiFeatures: ['Lọc nhanh phiếu mượn theo trạng thái', 'Gia hạn sách 1-click O(1)', 'Biểu đồ phân bổ mượn theo ngày'],
    badge: 'Circulation',
    wireframeSrc: '/library-bus/screens/wf_11_dashboard_giao_dich.webp',
    uiSrc: '/library-bus/screens/ui_11_dashboard_giao_dich.webp',
    uiFullSrc: '/library-bus/full_screens/full_11_dashboard_giao_dich.webp'
  },
  {
    id: 'screen-12',
    index: 12,
    titleVi: '12. Dashboard người dùng',
    titleEn: '12. Reader Profile Dashboard',
    module: 'users',
    moduleNameVi: 'Tài khoản & Hội viên',
    moduleNameEn: 'User & Membership',
    templatePath: 'template/users/dashboard.html',
    routePath: '/users/dashboard/',
    role: 'Hội viên thư viện',
    descVi: 'Cổng thông tin cá nhân của độc giả: Thẻ thư viện số tích hợp mã QR, danh sách sách đang giữ, lịch sử đọc sách, chuỗi ngày đọc (Streak) và cấp bậc Gamification.',
    descEn: 'Personal reader portal: Digital library pass with QR, active loans list, reading history timeline, reading streak counter, and gamification tier.',
    wireframeElements: ['Digital Library Pass card', 'Active Borrows table', 'Reading History timeline', 'Gamification Streak & Badge widget'],
    uiFeatures: ['Thẻ QR số quét trực tiếp tại xe', 'Hệ thống 5 cấp độ thành viên', 'Đề xuất sách thông minh theo sở thích'],
    badge: 'Gamification',
    wireframeSrc: '/library-bus/screens/wf_12_dashboard_nguoi_dung.webp',
    uiSrc: '/library-bus/screens/ui_12_dashboard_nguoi_dung.webp',
    uiFullSrc: '/library-bus/full_screens/full_12_dashboard_nguoi_dung.webp'
  },
  {
    id: 'screen-13',
    index: 13,
    titleVi: '13. Đăng nhập',
    titleEn: '13. User Login',
    module: 'users',
    moduleNameVi: 'Tài khoản & Hội viên',
    moduleNameEn: 'User & Membership',
    templatePath: 'template/users/login.html',
    routePath: '/users/login/',
    role: 'Tất cả người dùng',
    descVi: 'Trang đăng nhập an toàn bảo mật cao: Thuật toán băm mật khẩu Argon2, cơ chế chống tấn công Brute-force và bảo vệ CSRF chuẩn Django.',
    descEn: 'High-security login portal: Argon2 password hashing algorithm, brute-force mitigation, and Django CSRF token protection.',
    wireframeElements: ['Brand Logo header', 'Identifier Input (Email/Phone)', 'Password Input with show/hide', 'Remember Me checkbox', 'Login CTA button'],
    uiFeatures: ['Màu nền gụ ấm áp Neo-Bakery', 'Bảo mật mật khẩu Argon2', 'Chuyển hướng thông minh sau đăng nhập'],
    badge: 'Security',
    wireframeSrc: '/library-bus/screens/wf_13_dang_nhap.webp',
    uiSrc: '/library-bus/screens/ui_13_dang_nhap.webp',
    uiFullSrc: '/library-bus/full_screens/full_13_dang_nhap.webp'
  },
  {
    id: 'screen-14',
    index: 14,
    titleVi: '14. Đăng ký',
    titleEn: '14. User Registration',
    module: 'users',
    moduleNameVi: 'Tài khoản & Hội viên',
    moduleNameEn: 'User & Membership',
    templatePath: 'template/users/register.html',
    routePath: '/users/register/',
    role: 'Khách vãng lai',
    descVi: 'Đăng ký cấp thẻ độc giả mới: Khai báo thông tin cá nhân, chọn cụm trạm xe buýt thường xuyên ghé thăm và tự động kích hoạt tài khoản qua email.',
    descEn: 'New reader card enrollment: Personal profile submission, preferred bus stop selection, and automated email verification via Celery task.',
    wireframeElements: ['Registration Form fields', 'Preferred Stops multi-select', 'Terms of Service checkbox', 'Submit & Verify button'],
    uiFeatures: ['Khảo sát sở thích đọc cá nhân hóa', 'Kích hoạt thẻ tức thì 0đ phí mở thẻ', 'Tạo tài khoản tự động trong MySQL'],
    badge: 'Onboarding',
    wireframeSrc: '/library-bus/screens/wf_14_dang_ky.webp',
    uiSrc: '/library-bus/screens/ui_14_dang_ky.webp',
    uiFullSrc: '/library-bus/full_screens/full_14_dang_ky.webp'
  },
  {
    id: 'screen-15',
    index: 15,
    titleVi: '15. Blog - trang chủ',
    titleEn: '15. Community Blog & News',
    module: 'blog',
    moduleNameVi: 'Cộng đồng & Tin tức',
    moduleNameEn: 'Blog & Community',
    templatePath: 'template/blog/post_list.html',
    routePath: '/blog/',
    role: 'Tất cả người dùng',
    descVi: 'Cổng thông tin văn hóa đọc: Giới thiệu tác phẩm kinh điển, lịch trình sự kiện giao lưu tác giả tại trạm xe và các bài cảm nhận từ cộng đồng độc giả.',
    descEn: 'Reading culture hub: Classic literature spotlights, author meet-and-greet schedules at bus stops, and essays written by community readers.',
    wireframeElements: ['Featured Article Hero banner', 'Category Tags pill row', 'Article Cards Grid with author avatars', 'Newsletter signup box'],
    uiFeatures: ['Thiết kế tạp chí văn học thanh lịch', 'Lọc bài viết theo chủ đề', 'Bộ sưu tập ảnh giao lưu thực địa'],
    badge: 'Editorial',
    wireframeSrc: '/library-bus/screens/wf_15_blog_trang_chu.webp',
    uiSrc: '/library-bus/screens/ui_15_blog_trang_chu.webp',
    uiFullSrc: '/library-bus/full_screens/full_15_blog_trang_chu.webp'
  },
  {
    id: 'screen-16',
    index: 16,
    titleVi: '16. Blog - chi tiết bài viết',
    titleEn: '16. Blog Post Detail',
    module: 'blog',
    moduleNameVi: 'Cộng đồng & Tin tức',
    moduleNameEn: 'Blog & Community',
    templatePath: 'template/blog/post_detail.html',
    routePath: '/blog/<slug>/',
    role: 'Tất cả người dùng',
    descVi: 'Trang đọc bài viết chuyên sâu: Trình bày typography font Lora trang nhã, hệ thống bình luận có kiểm duyệt, chia sẻ mạng xã hội và nút mượn sách ngay.',
    descEn: 'In-depth article reader: Elegant Lora serif typography, moderated discussion comments, social sharing, and instant book hold link.',
    wireframeElements: ['Article Header with metadata', 'Rich text Content body', 'Related Book callout box', 'Discussion Comment thread'],
    uiFeatures: ['Typography Lora đậm chất hoài niệm', 'Bình luận thời gian thực', 'Liên kết mượn trực tiếp tác phẩm trong bài'],
    badge: 'Longform',
    wireframeSrc: '/library-bus/screens/wf_16_blog_chi_tiet_bai_viet.webp',
    uiSrc: '/library-bus/screens/ui_16_blog_chi_tiet_bai_viet.webp',
    uiFullSrc: '/library-bus/full_screens/full_16_blog_chi_tiet_bai_viet.webp'
  },
  {
    id: 'screen-17',
    index: 17,
    titleVi: '17. Thông báo',
    titleEn: '17. Notification Center',
    module: 'users',
    moduleNameVi: 'Tài khoản & Hội viên',
    moduleNameEn: 'User & Membership',
    templatePath: 'template/notifications/notification_list.html',
    routePath: '/notifications/',
    role: 'Hội viên thư viện',
    descVi: 'Trung tâm thông báo đẩy thời gian thực: Nhắc hẹn sắp đến hạn trả sách (trước 2 ngày), báo xe đã đến trạm gần nhất và xác nhận đặt giữ chỗ thành công.',
    descEn: 'Real-time push notification center: Return due reminders (2 days prior), bus arrival alerts at nearby stop, and reservation confirmations.',
    wireframeElements: ['Notification Filter pills', 'Notification List items with icons', 'Mark all as read button', 'Notification Settings link'],
    uiFeatures: ['Cập nhật badge thông báo tự động', 'Phân loại thông báo hệ thống vs giao dịch', 'Gửi email song song qua Celery'],
    badge: 'Telemetry',
    wireframeSrc: '/library-bus/screens/wf_17_thong_bao.webp',
    uiSrc: '/library-bus/screens/ui_17_thong_bao.webp',
    uiFullSrc: '/library-bus/full_screens/full_17_thong_bao.webp'
  },
  {
    id: 'screen-18',
    index: 18,
    titleVi: '18. Analytics dashboard',
    titleEn: '18. Operational Analytics Dashboard',
    module: 'admin',
    moduleNameVi: 'Quản trị & Phân tích',
    moduleNameEn: 'Admin & Analytics',
    templatePath: 'template/transactions/statistics.html',
    routePath: '/analytics/',
    role: 'Quản lý & Ban dự án',
    descVi: 'Bảng điều khiển phân tích chuyên sâu: Biểu đồ chuỗi thời gian mượn/trả, phân tích hiệu suất luân chuyển 12 xe buýt, top 10 sách mượn nhiều nhất và tỷ lệ quá hạn.',
    descEn: 'Deep operational analytics: Time-series borrow/return telemetry, 12-bus fleet circulation efficiency, top 10 popular books, and overdue ratios.',
    wireframeElements: ['Executive KPI Cards', 'Time-series Borrow/Return Chart', 'Bus Efficiency comparative bar chart', 'Top Books table'],
    uiFeatures: ['Biểu đồ Area Chart mượn trả tuần hoàn', 'Phân tích hiệu suất từng tuyến xe bus', 'Xuất báo cáo Excel / PDF tức thời'],
    badge: 'Data Analytics',
    wireframeSrc: '/library-bus/screens/wf_18_analytics_dashboard.webp',
    uiSrc: '/library-bus/screens/ui_18_analytics_dashboard.webp',
    uiFullSrc: '/library-bus/full_screens/full_18_analytics_dashboard.webp'
  },
  {
    id: 'screen-19',
    index: 19,
    titleVi: '19. FAQ',
    titleEn: '19. Frequently Asked Questions',
    module: 'public',
    moduleNameVi: 'Khách vãng lai & Độc giả',
    moduleNameEn: 'Public & Reader',
    templatePath: 'template/pages/faq.html',
    routePath: '/faq/',
    role: 'Tất cả người dùng',
    descVi: 'Hệ thống hỏi đáp thường gặp: Giải đáp quy chế mượn trả sách, biểu phí bồi thường hư hỏng, cách đăng ký thẻ độc giả và hướng dẫn đề xuất trạm dừng mới.',
    descEn: 'Comprehensive FAQ: Borrowing policies, damage reimbursement guidelines, membership card registration steps, and new stop petition guide.',
    wireframeElements: ['Category Filter Tabs', 'Accordion Question/Answer list', 'Still Have Questions callout box', 'Contact Support CTA'],
    uiFeatures: ['Accordion đóng mở mượt mà', 'Tìm kiếm từ khóa câu hỏi tức thì', 'Liên kết trực tiếp đến biểu mẫu liên hệ'],
    badge: 'Support',
    wireframeSrc: '/library-bus/screens/wf_19_faq.webp',
    uiSrc: '/library-bus/screens/ui_19_faq.webp',
    uiFullSrc: '/library-bus/full_screens/full_19_faq.webp'
  },
  {
    id: 'screen-20',
    index: 20,
    titleVi: '20. Liên hệ',
    titleEn: '20. Contact & Feedback',
    module: 'public',
    moduleNameVi: 'Khách vãng lai & Độc giả',
    moduleNameEn: 'Public & Reader',
    templatePath: 'template/pages/contact.html',
    routePath: '/contact/',
    role: 'Tất cả người dùng',
    descVi: 'Kênh tiếp nhận phản hồi đóng góp của cộng đồng: Biểu mẫu gửi ý kiến, thông tin tổng đài điều phối xe thư viện lưu động và đăng ký tình nguyện viên.',
    descEn: 'Community feedback channel: Feedback submission form, mobile library bus dispatch hotline, and volunteer recruitment program.',
    wireframeElements: ['Contact Details card', 'Feedback Input form', 'Operating Hours box', 'Volunteer Registration banner'],
    uiFeatures: ['Xử lý form liên hệ tự động', 'Tổng đài hỗ trợ độc giả 1900', 'Bản đồ trụ sở điều hành xe buýt'],
    badge: 'Community',
    wireframeSrc: '/library-bus/screens/wf_20_lien_he.webp',
    uiSrc: '/library-bus/screens/ui_20_lien_he.webp',
    uiFullSrc: '/library-bus/full_screens/full_20_lien_he.webp'
  }
];

export const LIBRARY_BUS_MOBILE_SCREENS: LibraryBusScreenItem[] = [
  {
    "id": "mob_01",
    "index": 1,
    "titleVi": "1. Trang chủ",
    "titleEn": "1. Homepage (Mobile)",
    "module": "public",
    "moduleNameVi": "Khách vãng lai & Độc giả",
    "moduleNameEn": "Public & Reader",
    "templatePath": "pages/index.html",
    "routePath": "/pages/index.html",
    "role": "Mobile Responsive",
    "descVi": "Khung Hero chào đón thu gọn tối ưu màn hình dọc, thanh tìm kiếm O(1) đặt trong tầm ngón tay cái, 4 chỉ số KPI vận hành dạng thẻ trượt và kệ sách tuyển chọn.",
    "descEn": "Compact vertical hero banner, thumb-zone O(1) search bar, swipeable KPI metrics cards, and curated book shelf carousel.",
    "wireframeElements": [
      "Mobile Header & Logo",
      "Compact Hero Banner",
      "Thumb-Zone O(1) Search",
      "Vertical Book Cards Feed",
      "Quick News Carousel"
    ],
    "uiFeatures": [
      "Bảng màu nhận diện (#0D7287, #9BE7FA, #FFD14C)",
      "Font Lora Serif + Outfit Sans",
      "Thao tác 1 chạm trong tầm ngón tay",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Core Page",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_01.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_01.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_01.webp"
  },
  {
    "id": "mob_02",
    "index": 2,
    "titleVi": "2. Giới thiệu",
    "titleEn": "2. About Us (Mobile)",
    "module": "public",
    "moduleNameVi": "Khách vãng lai & Độc giả",
    "moduleNameEn": "Public & Reader",
    "templatePath": "pages/about.html",
    "routePath": "/pages/about.html",
    "role": "Mobile Responsive",
    "descVi": "Giới thiệu sứ mệnh xe thư viện lưu động trên màn hình dọc, timeline dự án và hình ảnh xe thực tế tối ưu chạm lướt.",
    "descEn": "Project mission, mobile library bus initiative, project timeline and photography formatted for vertical touch.",
    "wireframeElements": [
      "Brand Header & Icon",
      "Mission Statement Card",
      "Vertical Project Timeline",
      "Photo Gallery Stack",
      "Community Impact Stats"
    ],
    "uiFeatures": [
      "Bố cục thẻ dọc dễ cuộn lướt",
      "Typography Lora + Outfit tương phản",
      "Ảnh chụp thực tế tối ưu dung lượng",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Public",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_02.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_02.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_02.webp"
  },
  {
    "id": "mob_03",
    "index": 3,
    "titleVi": "3. Danh sách sách",
    "titleEn": "3. Book Catalog (Mobile)",
    "module": "public",
    "moduleNameVi": "Khách vãng lai & Độc giả",
    "moduleNameEn": "Public & Reader",
    "templatePath": "inventory/book_list.html",
    "routePath": "/inventory/book_list.html",
    "role": "Mobile Responsive",
    "descVi": "Duyệt danh mục 15.000+ đầu sách trên di động: thanh tìm kiếm dính đỉnh, bộ lọc thể loại dạng chip vuốt ngang và thẻ sách hiển thị tình trạng còn/hết tại các trạm xe.",
    "descEn": "Browse 15,000+ books on mobile: sticky search bar, horizontal scrollable category chips, and live bus availability badges.",
    "wireframeElements": [
      "Sticky Search Input",
      "Horizontal Category Pills",
      "Vertical Book Cards Grid (1-Col)",
      "Status Badge (Sẵn sàng / Đang mượn)",
      "Bottom Bar Pagination"
    ],
    "uiFeatures": [
      "Thẻ sách tối ưu tỉ lệ vàng 2:3 bìa sách",
      "Chip lọc màu mật ong mượt mà",
      "Nút giữ chỗ nhanh 1-tap",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Inventory",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_06.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_06.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_06.webp"
  },
  {
    "id": "mob_04",
    "index": 4,
    "titleVi": "4. Chi tiết sách",
    "titleEn": "4. Book Detail (Mobile)",
    "module": "public",
    "moduleNameVi": "Khách vãng lai & Độc giả",
    "moduleNameEn": "Public & Reader",
    "templatePath": "inventory/book_detail.html",
    "routePath": "/inventory/book_detail.html",
    "role": "Mobile Responsive",
    "descVi": "Trang thông tin chi tiết đầu sách trên điện thoại: ảnh bìa lớn, tóm tắt nội dung, bảng tra cứu xe buýt đang chở cuốn sách này và thanh CTA giữ chỗ cố định dưới chân.",
    "descEn": "Mobile book profile: large cover art, collapsible synopsis, live bus location status, and sticky bottom CTA for instant reservation.",
    "wireframeElements": [
      "Book Cover Preview",
      "Author & Publisher Badges",
      "Bus Location Accordion",
      "Collapsible Synopsis",
      "Sticky Bottom Action CTA"
    ],
    "uiFeatures": [
      "Nút CTA cố định đáy màn hình dễ bấm",
      "Badge vị trí xe buýt thời gian thực",
      "Đánh giá sao và review cộng đồng",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Inventory",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_07.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_07.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_07.webp"
  },
  {
    "id": "mob_05",
    "index": 5,
    "titleVi": "5. Danh sách xe (bản đồ)",
    "titleEn": "5. Bus Fleet & Live Map (Mobile)",
    "module": "public",
    "moduleNameVi": "Khách vãng lai & Độc giả",
    "moduleNameEn": "Public & Reader",
    "templatePath": "inventory/bus_list.html",
    "routePath": "/inventory/bus_list.html",
    "role": "Mobile Responsive",
    "descVi": "Bản đồ GPS trực tuyến 12 đầu xe thư viện lưu động: định vị vị trí trạm gần nhất, vuốt thẻ xem lịch trình xe đến và chạm để xem danh mục sách đang có trên xe.",
    "descEn": "Live GPS fleet map of 12 mobile library buses: find closest stop, swipe bus cards for arrival estimates, and check on-board catalog.",
    "wireframeElements": [
      "Full-Width GPS Map Viewport",
      "User Location Pin & Compass",
      "Bus Status Marker Cluster",
      "Swipeable Bottom Sheet Bus Cards",
      "Route Selector Pills"
    ],
    "uiFeatures": [
      "Tương tác bản đồ cảm ứng mượt mà",
      "Thẻ Bottom Sheet vuốt lên để xem chi tiết",
      "Chỉ báo trạng thái xe buýt thời gian thực",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Fleet",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_10.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_10.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_10.webp"
  },
  {
    "id": "mob_06",
    "index": 6,
    "titleVi": "6. Chi tiết xe buýt",
    "titleEn": "6. Bus Detail & Schedule (Mobile)",
    "module": "public",
    "moduleNameVi": "Khách vãng lai & Độc giả",
    "moduleNameEn": "Public & Reader",
    "templatePath": "inventory/bus_detail.html",
    "routePath": "/inventory/bus_detail.html",
    "role": "Mobile Responsive",
    "descVi": "Hồ sơ chi tiết tuyến xe buýt lưu động: sơ đồ trạm dừng trong ngày, danh sách thủ thư phụ trách, sức chứa sách và thông báo đến trạm kịp thời.",
    "descEn": "Mobile bus profile and daily itinerary: stops timeline, on-duty librarian info, on-board book capacity, and arrival alert toggle.",
    "wireframeElements": [
      "Bus Profile Header & Photo",
      "Daily Itinerary Timeline",
      "Driver & Librarian Contact Cards",
      "Capacity & Equipment Badges",
      "Subscribe Route Alert Button"
    ],
    "uiFeatures": [
      "Timeline trạm dừng thiết kế dọc trực quan",
      "Nút gọi điện / nhắn tin kíp xe 1-chạm",
      "Chỉ báo pin và thiết bị trạm đọc",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Fleet",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_11.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_11.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_11.webp"
  },
  {
    "id": "mob_07",
    "index": 7,
    "titleVi": "7. Dashboard quản lý thư viện",
    "titleEn": "7. Inventory Dashboard (Mobile)",
    "module": "admin",
    "moduleNameVi": "Quản trị & Phân tích",
    "moduleNameEn": "Admin & Telemetry",
    "templatePath": "inventory/dashboard.html",
    "routePath": "/inventory/dashboard.html",
    "role": "Mobile Responsive",
    "descVi": "Bảng điều khiển kho sách di động cho thủ thư: tổng kết 15.400+ cuốn sách, biểu đồ phân bố danh mục, cảnh báo sách hư hỏng hoặc quá hạn và nút nhập sách nhanh.",
    "descEn": "Mobile inventory dashboard for librarians: 15,400+ catalog overview, category distribution charts, damaged/overdue book alerts, and fast intake CTA.",
    "wireframeElements": [
      "Inventory KPI Metric Cards",
      "Stock Distribution Sparkline",
      "Low Stock / Alert Banners",
      "Quick Action Buttons Grid",
      "Recent Stock Inflow Feed"
    ],
    "uiFeatures": [
      "Thẻ số liệu KPI nổi bật với màu thương hiệu",
      "Biểu đồ thanh ngang tối ưu màn hình hẹp",
      "Menu tác vụ nhanh tiện dụng ngón cái",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Inventory",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_05.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_05.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_05.webp"
  },
  {
    "id": "mob_08",
    "index": 8,
    "titleVi": "8. Danh sách quyên góp sách",
    "titleEn": "8. Book Intake & Donation Form (Mobile)",
    "module": "transactions",
    "moduleNameVi": "Lưu thông & Mượn trả",
    "moduleNameEn": "Circulation & Borrows",
    "templatePath": "inventory/book_form.html",
    "routePath": "/inventory/book_form.html",
    "role": "Mobile Responsive",
    "descVi": "Biểu mẫu di động tiếp nhận sách quyên góp và nhập kho mới: tích hợp quét mã ISBN bằng camera điện thoại, tự động điền metadata và chọn trạm xe phân bổ.",
    "descEn": "Mobile book donation intake form: camera barcode/ISBN scanning, automated metadata autofill, and bus allocation selector.",
    "wireframeElements": [
      "Camera ISBN Scan Trigger",
      "Book Title & Author Inputs",
      "Category & Publisher Selectors",
      "Physical Condition Rating (1-5)",
      "Bus Assignment Dropdown",
      "Submit Intake Button"
    ],
    "uiFeatures": [
      "Trải nghiệm quét mã vạch qua camera mượt mà",
      "Trường nhập liệu lớn dễ bấm trên màn hình cảm ứng",
      "Phản hồi xác thực form tức thì",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Inventory",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_08.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_08.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_08.webp"
  },
  {
    "id": "mob_09",
    "index": 9,
    "titleVi": "9. Tạo phiếu mượn sách",
    "titleEn": "9. Borrowing & Returns (Mobile)",
    "module": "transactions",
    "moduleNameVi": "Lưu thông & Mượn trả",
    "moduleNameEn": "Circulation & Borrows",
    "templatePath": "transactions/borrow_list.html",
    "routePath": "/transactions/borrow_list.html",
    "role": "Mobile Responsive",
    "descVi": "Theo dõi danh sách các cuốn sách đang mượn trên di động: đếm ngược ngày hoàn trả, nút gia hạn 1 chạm và mã vạch hoàn trả nhanh tại xe buýt.",
    "descEn": "Mobile borrow tracking screen: due date countdown, one-tap extension button, and quick-scan return barcode at the bus.",
    "wireframeElements": [
      "Active Loans Tab vs Past History",
      "Book Due Countdown Cards",
      "One-Tap Renew Button",
      "Digital Return QR Code Pass",
      "Fine Status Indicator"
    ],
    "uiFeatures": [
      "Thẻ đếm ngược trực quan với màu cảnh báo",
      "Tạo mã QR trả sách không cần giấy tờ",
      "Thông báo nhắc nhở trước 2 ngày",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Circulation",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_16.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_16.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_16.webp"
  },
  {
    "id": "mob_10",
    "index": 10,
    "titleVi": "10. Tạo đặt trước sách",
    "titleEn": "10. Book Reservations (Mobile)",
    "module": "transactions",
    "moduleNameVi": "Lưu thông & Mượn trả",
    "moduleNameEn": "Circulation & Borrows",
    "templatePath": "transactions/reservation_list.html",
    "routePath": "/transactions/reservation_list.html",
    "role": "Mobile Responsive",
    "descVi": "Quy trình đặt trước sách tại trạm xe buýt định sẵn trên điện thoại: xếp hàng giữ chỗ O(1), xem số thứ tự hàng đợi và nhận thông báo khi sách đã lên xe.",
    "descEn": "Mobile book reservation workflow at designated bus stops: instant O(1) queue placement, waitlist position, and pickup alert.",
    "wireframeElements": [
      "Reservation Queue Cards",
      "Pickup Bus Stop Selector",
      "Hold Expiry Countdown",
      "Waitlist Rank Indicator",
      "Cancel/Modify Reservation CTA"
    ],
    "uiFeatures": [
      "Chỉ báo số thứ tự hàng chờ trực quan",
      "Chọn trạm nhận sách thuận tiện nhất",
      "Xác nhận giữ chỗ tức thì qua tin nhắn/app",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Circulation",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_18.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_18.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_18.webp"
  },
  {
    "id": "mob_11",
    "index": 11,
    "titleVi": "11. Dashboard giao dịch",
    "titleEn": "11. Circulation Dashboard (Mobile)",
    "module": "transactions",
    "moduleNameVi": "Lưu thông & Mượn trả",
    "moduleNameEn": "Circulation & Borrows",
    "templatePath": "transactions/dashboard.html",
    "routePath": "/transactions/dashboard.html",
    "role": "Mobile Responsive",
    "descVi": "Trung tâm tổng quan các giao dịch mượn trả sách trên điện thoại: tiến độ hoàn thành chỉ tiêu đọc, điểm uy tín độc giả và lịch sử mượn trả chi tiết.",
    "descEn": "Personal circulation overview dashboard on mobile: reading challenge progress, reader reliability score, and borrowing history ledger.",
    "wireframeElements": [
      "User Reading Reliability Score",
      "Active Loans Metric Bar",
      "Upcoming Due Dates Alert Box",
      "Borrowing History Feed",
      "Quick Borrow Shortcut Button"
    ],
    "uiFeatures": [
      "Vòng tròn điểm tín nhiệm độc giả Gamification",
      "Bộ lọc trạng thái đã trả / đang mượn mượt mà",
      "Tối ưu trải nghiệm một tay",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Circulation",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_15.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_15.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_15.webp"
  },
  {
    "id": "mob_12",
    "index": 12,
    "titleVi": "12. Dashboard người dùng",
    "titleEn": "12. User Account Dashboard (Mobile)",
    "module": "users",
    "moduleNameVi": "Tài khoản & Hội viên",
    "moduleNameEn": "Account & Pass",
    "templatePath": "users/dashboard.html",
    "routePath": "/users/dashboard.html",
    "role": "Mobile Responsive",
    "descVi": "Thẻ hội viên thư viện điện tử tích hợp mã QR quét tại xe buýt, cấp bậc độc giả, điểm thưởng đổi quà và cài đặt tài khoản cá nhân trên di động.",
    "descEn": "Digital mobile library pass with QR code, reader loyalty tier, reward points redemption, and account preferences.",
    "wireframeElements": [
      "Virtual Library Card (with Dynamic QR)",
      "Reader Tier Badge & Progress",
      "Gamification Reward Points",
      "Favorite Books Wishlist",
      "Quick Settings Navigation"
    ],
    "uiFeatures": [
      "Thẻ thư viện ảo hiệu ứng tráng gương sang trọng",
      "Mã QR tăng độ sáng màn hình khi quét",
      "Huy hiệu thành tích sinh động",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Account",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_24.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_24.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_24.webp"
  },
  {
    "id": "mob_13",
    "index": 13,
    "titleVi": "13. Đăng nhập",
    "titleEn": "13. Member Login (Mobile)",
    "module": "users",
    "moduleNameVi": "Tài khoản & Hội viên",
    "moduleNameEn": "Account & Pass",
    "templatePath": "users/login.html",
    "routePath": "/users/login.html",
    "role": "Mobile Responsive",
    "descVi": "Màn hình đăng nhập tài khoản độc giả di động: hỗ trợ đăng nhập sinh trắc học (vân tay / FaceID), mã OTP gửi qua SMS và đăng nhập nhanh 1 chạm.",
    "descEn": "Mobile member login interface: supports biometric authentication (FaceID/Fingerprint), phone OTP, and one-tap social login.",
    "wireframeElements": [
      "Library Bus Brand Header",
      "Phone / Email Input Field",
      "Password Input with Visibility Toggle",
      "Biometric (FaceID/Fingerprint) Button",
      "One-Tap Login CTA",
      "Forgot Password & Register Links"
    ],
    "uiFeatures": [
      "Bàn phím tự động hiển thị số khi nhập SĐT",
      "Tích hợp xác thực sinh trắc học WebAuthn",
      "Nút bấm lớn 48px chuẩn công thái học",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Account",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_21.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_21.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_21.webp"
  },
  {
    "id": "mob_14",
    "index": 14,
    "titleVi": "14. Đăng ký",
    "titleEn": "14. Member Registration (Mobile)",
    "module": "users",
    "moduleNameVi": "Tài khoản & Hội viên",
    "moduleNameEn": "Account & Pass",
    "templatePath": "users/register.html",
    "routePath": "/users/register.html",
    "role": "Mobile Responsive",
    "descVi": "Đăng ký thẻ bạn đọc mới qua 3 bước thu gọn trên di động: xác minh số điện thoại qua OTP tức thì, cấp thẻ thư viện điện tử ngay lập tức.",
    "descEn": "3-step compact mobile registration workflow: instant phone OTP verification and instant digital library card issuance.",
    "wireframeElements": [
      "3-Step Progress Bar",
      "Phone & Full Name Inputs",
      "SMS 6-Digit OTP Box",
      "Reading Preference Tags",
      "Complete Registration CTA"
    ],
    "uiFeatures": [
      "Quy trình Progressive Disclosure không gây ngợp",
      "Tự động bắt mã OTP từ SMS trên điện thoại",
      "Cấp thẻ số ngay sau khi hoàn tất",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Account",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_22.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_22.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_22.webp"
  },
  {
    "id": "mob_15",
    "index": 15,
    "titleVi": "15. Blog - trang chủ",
    "titleEn": "15. Blog & Stories (Mobile)",
    "module": "blog",
    "moduleNameVi": "Cộng đồng & Tin tức",
    "moduleNameEn": "Community & Blog",
    "templatePath": "blog/post_list.html",
    "routePath": "/blog/post_list.html",
    "role": "Mobile Responsive",
    "descVi": "Bản tin cộng đồng đọc sách, bài review sách và nhật ký hành trình xe buýt thư viện: thiết kế dạng thẻ dọc cuộn lướt nhẹ nhàng, ước tính thời gian đọc.",
    "descEn": "Community book club stories, book reviews, and bus roadtrip journals: formatted in vertical card stream with estimated reading times.",
    "wireframeElements": [
      "Featured Article Hero Card",
      "Topic Filter Chips (Review, Sự kiện, Xe buýt)",
      "Article Cards Feed",
      "Author Avatar & Reading Time",
      "Search Articles Input"
    ],
    "uiFeatures": [
      "Hình ảnh bài viết tràn viền bắt mắt",
      "Tải vô tận (Infinite Scroll) mượt mà",
      "Đánh dấu bài viết yêu thích nhanh",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Community",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_27.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_27.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_27.webp"
  },
  {
    "id": "mob_16",
    "index": 16,
    "titleVi": "16. Blog - chi tiết bài viết",
    "titleEn": "16. Article Detail (Mobile)",
    "module": "blog",
    "moduleNameVi": "Cộng đồng & Tin tức",
    "moduleNameEn": "Community & Blog",
    "templatePath": "blog/post_detail.html",
    "routePath": "/blog/post_detail.html",
    "role": "Mobile Responsive",
    "descVi": "Trang đọc bài viết tối ưu trải nghiệm đọc không phân tâm: font chữ Lora cỡ lớn dễ đọc, thanh tiến độ cuộn trang, bình luận và chia sẻ mạng xã hội nhanh.",
    "descEn": "Distraction-free reading screen: large readable Lora typography, scroll progress bar, native share sheet, and comments.",
    "wireframeElements": [
      "Sticky Reading Progress Bar",
      "Article Hero Image",
      "Author Info & Publish Date",
      "Longform Typography Block",
      "Comments Section & Share Bar"
    ],
    "uiFeatures": [
      "Typography Lora 17px tỉ lệ dòng 1.6 hoàn hảo",
      "Thanh tiến độ đọc dính đỉnh màn hình",
      "Chia sẻ native qua Zalo/Facebook/SMS",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Community",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_28.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_28.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_28.webp"
  },
  {
    "id": "mob_17",
    "index": 17,
    "titleVi": "17. Thông báo",
    "titleEn": "17. Alerts & Notification Center (Mobile)",
    "module": "users",
    "moduleNameVi": "Tài khoản & Hội viên",
    "moduleNameEn": "Account & Pass",
    "templatePath": "inventory/alerts_list.html",
    "routePath": "/inventory/alerts_list.html",
    "role": "Mobile Responsive",
    "descVi": "Trung tâm thông báo đẩy trên điện thoại: nhắc lịch trả sách, thông báo xe buýt sắp cập bến gần bạn, sách đặt trước đã sẵn sàng và tin tức khuyến mãi.",
    "descEn": "Mobile push notification center: return reminders, bus arrival alerts, reservation ready alerts, and community announcements.",
    "wireframeElements": [
      "Notification Category Tabs",
      "Chronological Notification Cards",
      "Unread Badge Dot",
      "Swipe to Dismiss Action",
      "Notification Settings Shortcut"
    ],
    "uiFeatures": [
      "Phân loại biểu tượng màu sắc rõ ràng (Lịch xe, Mượn trả, Tin tức)",
      "Thao tác vuốt ngang để xóa / đánh dấu đã đọc",
      "Thông báo đẩy Push Notification trực tiếp",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "System",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_14.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_14.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_14.webp"
  },
  {
    "id": "mob_18",
    "index": 18,
    "titleVi": "18. Analytics dashboard",
    "titleEn": "18. Analytics & Statistics (Mobile)",
    "module": "admin",
    "moduleNameVi": "Quản trị & Phân tích",
    "moduleNameEn": "Admin & Telemetry",
    "templatePath": "transactions/statistics.html",
    "routePath": "/transactions/statistics.html",
    "role": "Mobile Responsive",
    "descVi": "Báo cáo số liệu lưu lượng độc giả, biểu đồ xu hướng đọc sách và tỷ lệ sách luân chuyển theo từng trạm xe buýt tối ưu hiển thị trên màn hình dọc.",
    "descEn": "Mobile analytics telemetry: reader traffic trends, circulation velocity charts, and bus route efficiency cards.",
    "wireframeElements": [
      "Period Selector Chips (Tuần / Tháng / Quý)",
      "Circulation Trend Sparkline",
      "Top 5 Most Borrowed Books",
      "Route Utilization Bar Chart",
      "Export PDF/Excel Button"
    ],
    "uiFeatures": [
      "Biểu đồ cảm ứng hiển thị tooltip khi chạm",
      "Bố cục thẻ dọc tổng hợp gọn gàng",
      "Tông màu hổ phách - mật mía sang trọng",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Telemetry",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_20.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_20.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_20.webp"
  },
  {
    "id": "mob_19",
    "index": 19,
    "titleVi": "19. FAQ",
    "titleEn": "19. FAQ & Help Center (Mobile)",
    "module": "public",
    "moduleNameVi": "Khách vãng lai & Độc giả",
    "moduleNameEn": "Public & Reader",
    "templatePath": "pages/faq.html",
    "routePath": "/pages/faq.html",
    "role": "Mobile Responsive",
    "descVi": "Trung tâm trợ giúp và giải đáp thắc mắc thường gặp dạng Accordion mở rộng: quy trình mượn trả sách, lịch trình xe buýt, thẻ thư viện và hotline hỗ trợ.",
    "descEn": "Mobile help center and expandable FAQ accordions covering membership, borrowing rules, bus tracking, and hotline.",
    "wireframeElements": [
      "Instant Search Question Bar",
      "Quick Topic Badges",
      "Expandable Accordion QA Items",
      "Helpful Vote (Thích / Không thích)",
      "Direct Call Hotline Floating Button"
    ],
    "uiFeatures": [
      "Hiệu ứng mở Accordion mượt mà",
      "Thanh tìm kiếm câu hỏi tức thì O(1)",
      "Nút gọi tổng đài hỗ trợ 1 chạm",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Public",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_04.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_04.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_04.webp"
  },
  {
    "id": "mob_20",
    "index": 20,
    "titleVi": "20. Liên hệ",
    "titleEn": "20. Contact & Feedback (Mobile)",
    "module": "public",
    "moduleNameVi": "Khách vãng lai & Độc giả",
    "moduleNameEn": "Public & Reader",
    "templatePath": "pages/contact.html",
    "routePath": "/pages/contact.html",
    "role": "Mobile Responsive",
    "descVi": "Gửi phản hồi và đóng góp ý kiến di động: đề xuất trạm dừng mới cho xe buýt, phản ánh chất lượng sách và chỉ đường GPS đến trạm điều hành.",
    "descEn": "Mobile feedback & contact: propose new bus stop locations, feedback on book quality, and GPS directions to central station.",
    "wireframeElements": [
      "Quick Action Buttons (Gọi điện, Bản đồ, Email)",
      "Feedback Category Selector",
      "Feedback Message Input Field",
      "Attach Photo Button",
      "Submit Feedback CTA"
    ],
    "uiFeatures": [
      "Nút gọi điện thoại & mở Google Maps 1 chạm",
      "Form gọn gàng tối ưu bàn phím di động",
      "Phản hồi gửi thành công ngay lập tức",
      "Khớp kích thước 1-to-1 Wireframe"
    ],
    "badge": "Public",
    "wireframeSrc": "/library-bus/mobile_screens/wf_mob_03.webp",
    "uiSrc": "/library-bus/mobile_screens/ui_mob_03.webp",
    "uiFullSrc": "/library-bus/mobile_screens/ui_mob_03.webp"
  }
];

export const LIBRARY_BUS_SYSTEM_PARADIGMS = [
  {
    "id": "grid-viewport",
    "titleVi": "1. Hệ Thống Lưới & Không Gian Hiển Thị",
    "titleEn": "1. Grid System & Viewport Architecture",
    "desktopVi": "Lưới 12 cột chuẩn Responsive (max-width 1280px / 1440px), gutter 24px, margin 360px hoặc auto-center. Hiển thị cùng lúc Navbar, Sidebar đa tầng và Data Grid 4 cột.",
    "desktopEn": "12-column responsive grid (max-width 1280px / 1440px), 24px gutters. Displays multi-tier navigation, persistent sidebar, and 4-column cards.",
    "mobileVi": "Lưới 1 cột đơn (Fluid 1-Column Stack, 375px – 430px), padding an toàn 16px. Mọi thành phần xếp chồng thẳng đứng hoặc chuyển thành carousels vuốt ngang.",
    "mobileEn": "Fluid 1-column single-thumb stack (375px - 430px) with 16px safe margins. Stacks vertically or transforms into horizontal swipe carousels.",
    "badgeVi": "12 Cột vs 1 Cột",
    "badgeEn": "12-Col vs 1-Col",
    "impactVi": "Desktop tối đa hóa khả năng quan sát tổng thể; Mobile tối đa hóa sự tập trung và tốc độ lướt."
  },
  {
    "id": "navigation-ia",
    "titleVi": "2. Kiến Trúc Điều Hướng (Navigation & IA)",
    "titleEn": "2. Navigation Architecture & Information Hierarchy",
    "desktopVi": "Thanh Header cố định (Sticky Top Navbar) với Menu mở rộng, Breadcrumbs phân tầng trang, thanh tìm kiếm toàn cục (Ctrl+K) và Avatar góc phải.",
    "desktopEn": "Sticky top navbar with mega-menu dropdowns, breadcrumb trails, global search (Ctrl+K), and right-hand profile menu.",
    "mobileVi": "Thanh điều hướng đáy (Bottom Tab Bar 48px) đặt gọn trong \"Vùng an toàn ngón cái\" (Thumb-Zone) + Ngăn kéo trượt (Slide-out Drawer) cho cài đặt sâu.",
    "mobileEn": "Bottom Tab Bar (48px) anchored in ergonomic Thumb Zone + Slide-out Drawer for deep sub-navigation and account settings.",
    "badgeVi": "Top Navbar vs Bottom Bar",
    "badgeEn": "Top Nav vs Bottom Bar",
    "impactVi": "Giảm 65% khoảng cách di chuyển ngón tay trên màn hình điện thoại so với việc phải với tay lên đỉnh."
  },
  {
    "id": "data-density",
    "titleVi": "3. Mật Độ Dữ Liệu & Hiển Thị Bảng Biểu",
    "titleEn": "3. Data Density & Table Presentation",
    "desktopVi": "Bảng dữ liệu đa cột (Data Tables) với chức năng sắp xếp động theo cột, lọc đa tiêu chí (Faceted Filtering) và phân trang 20 dòng/trang.",
    "desktopEn": "Multi-column data tables with sortable headers, faceted filtering sidebars, and 20 rows/page server pagination.",
    "mobileVi": "Chuyển đổi thành các thẻ thông tin dọc (Card-Based List) có gắn tag trạng thái; xem chi tiết qua cửa sổ trượt đáy (Bottom Sheet) 1 chạm.",
    "mobileEn": "Transformed into vertical card streams with status pill badges; secondary details expand via one-tap native bottom sheets.",
    "badgeVi": "Data Table vs Card Stack",
    "badgeEn": "Data Table vs Card Stack",
    "impactVi": "Loại bỏ hoàn toàn thao tác cuộn ngang (horizontal scroll) - nguyên nhân hàng đầu gây bỏ dở trên mobile."
  },
  {
    "id": "interaction-ergonomics",
    "titleVi": "4. Mô Hình Tương Tác & Công Thái Học",
    "titleEn": "4. Interaction Models & Ergonomics",
    "desktopVi": "Độ chính xác pixel con trỏ chuột: Trạng thái Hover đổi màu tức thì, Tooltip giải thích chi tiết, phím tắt điều hướng nhanh (Mũi tên, Esc, Enter).",
    "desktopEn": "High-precision mouse pointer: Rich hover previews, contextual tooltips, and keyboard accessibility shortcuts (Arrows, Esc, Enter).",
    "mobileVi": "Cảm ứng chạm đa điểm: Vùng chạm tối thiểu 48x48px (Apple HIG & Material Design), vuốt trượt Carousel, kéo để làm mới (Pull-to-refresh).",
    "mobileEn": "Multi-touch gestures: Minimum 48x48px touch targets (Apple HIG), horizontal card swiping, and pull-to-refresh feeds.",
    "badgeVi": "Hover & Phím vs Cảm ứng 48px",
    "badgeEn": "Hover vs Touch 48px",
    "impactVi": "Ngăn ngừa hiện tượng bấm trúng mục nhầm (fat-finger syndrome) và tăng tốc độ thao tác tại trạm xe."
  },
  {
    "id": "quick-workflow",
    "titleVi": "5. Quy Trình Giữ Chỗ & Đặt Sách O(1)",
    "titleEn": "5. O(1) Quick Reservation & Hold Workflow",
    "desktopVi": "Hộp thoại Modal hiển thị song song sơ đồ trạm xe và danh sách ghế/kệ sách trên cùng một góc nhìn; chọn sách và bấm giữ chỗ trong 3 click.",
    "desktopEn": "Modal dialog displaying bus route map and seat availability in parallel view; complete reservation in 3 clicks.",
    "mobileVi": "Luồng 2 bước dạng Bottom Sheet trượt từ đáy: Tự động dùng GPS tìm trạm xe gần nhất, xác nhận số điện thoại và giữ chỗ chỉ trong 2 chạm.",
    "mobileEn": "2-step sliding bottom sheet: Auto-detects nearest bus stop via GPS, verifies phone OTP, completes hold in 2 taps (~4s).",
    "badgeVi": "Modal 3-Click vs Sheet 2-Tap",
    "badgeEn": "Modal vs 2-Tap Sheet",
    "impactVi": "Rút ngắn thời gian đặt sách xuống dưới 5 giây khi độc giả đang đứng đón xe buýt ngoài trạm."
  },
  {
    "id": "hardware-integration",
    "titleVi": "6. Tích Hợp Cảm Biến & Phần Cứng Thiết Bị",
    "titleEn": "6. Hardware & Native Sensor Integration",
    "desktopVi": "Tối ưu hóa cho bàn phím cơ, chuột quang, nhiều màn hình làm việc (Multi-monitor) và in ấn xuất file Excel / PDF khổ A4.",
    "desktopEn": "Optimized for mechanical keyboards, optical mouse, multi-monitor setups, and direct A4 PDF/Excel report exports.",
    "mobileVi": "Tận dụng trực tiếp Camera điện thoại (quét mã ISBN sách / QR thẻ bạn đọc), GPS định vị lộ trình xe và Thông báo đẩy (Push Notification).",
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
    descVi: 'Bảng thiết kế hoàn chỉnh 20 màn hình giao diện thực tế của hệ thống Tủ Sách Lưu Động áp dụng bảng màu nhận diện chuẩn (#0D7287, #9BE7FA, #FFD14C, #C8EEF7).',
    descEn: 'Master board containing all 20 production screens of Library Bus system styled with the official 4-color palette.',
    src: '/library-bus/library_bus_ui_design_all_screens.webp',
    tag: 'Official 4-Tone UI'
  },
  {
    id: 'wireframe-all',
    titleVi: 'Toàn Bộ 20 Màn Hình Cấu Trúc Khung Xương (Wireframe)',
    titleEn: 'Full 20-Screen Master Wireframe Architecture',
    descVi: 'Bảng khung xương quy chuẩn 20 màn hình: Phân bổ lưới 12 cột, phân tầng thông tin, vị trí các nút tương tác và thành phần dữ liệu.',
    descEn: 'Comprehensive 20-screen wireframe board: 12-column grid system, visual hierarchy, interactive controls, and structural cards.',
    src: '/library-bus/library_bus_wireframe_all_screens.webp',
    tag: 'Wireframe Architecture'
  },
  {
    id: 'reference-template',
    titleVi: 'Mẫu Tham Khảo Trình Bày So Sánh Wireframe vs UI',
    titleEn: 'Reference Template: Wireframe vs UI Design Comparison',
    descVi: 'Bố cục chuẩn mẫu tài liệu thiết kế: Nửa trái là Wireframe khung xám, nửa phải là UI Design hoàn chỉnh với hệ màu thương hiệu.',
    descEn: 'Design guidelines standard benchmark: Left half features wireframe skeletons, right half showcases final branded UI.',
    src: '/library-bus/reference_wireframe_vs_ui.webp',
    tag: 'Benchmark Standard'
  },
  {
    id: 'hero-bus',
    titleVi: 'Xe Thư Viện Lưu Động Thực Địa',
    titleEn: 'Mobile Library Bus in Field Operations',
    descVi: 'Mô hình xe buýt chở tri thức với hơn 1.200 đầu sách giấy, trạm sạc điện thoại và khu vực đọc sách mở tại các điểm dừng.',
    descEn: 'Mobile bus carrying over 1,200 physical books, device charging ports, and open pop-up reading zones at scheduled stops.',
    src: '/library-bus/hero_bus.webp',
    tag: 'Hardware & Fleet'
  },
  {
    id: 'ui-dashboard',
    titleVi: 'Giao Diện Quản Trị & Điều Phối Của Thủ Thư',
    titleEn: 'Librarian Fleet Dispatch & Inventory Dashboard',
    descVi: 'Màn hình kiểm kê tồn kho động O(1), theo dõi vị trí GPS các xe theo thời gian thực và quản lý đơn mượn/trả.',
    descEn: 'Dynamic O(1) inventory monitoring, real-time GPS tracking across bus lines, and borrow/return processing.',
    src: '/library-bus/ui_dashboard.jpg',
    tag: 'Web Portal'
  },
  {
    id: 'ui-mobile',
    titleVi: 'Cổng Độc Giả Trên Điện Thoại & Thẻ Thư Viện Số',
    titleEn: 'Mobile Reader Portal & Digital Library Pass',
    descVi: 'Ứng dụng di động tra cứu sách, đặt trước chỗ ngồi, giữ sách tại điểm dừng và tích lũy điểm uy tín Gamification.',
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
    descVi: 'Mô hình D3 Canvas trực quan hóa 7 Django Apps, quan hệ Foreign Key giữa các Models và luồng phân tầng dữ liệu.',
    descEn: 'Interactive Canvas graph visualizing 7 Django apps, model relationships, and transactional data flows.',
    url: '/library-bus/architecture-graph.html',
    badge: 'D3 Graph'
  },
  {
    id: 'understand-radar',
    titleVi: 'Bản Đồ Radar Vòng Tròn Đồng Tâm',
    titleEn: 'Concentric Architecture Radar',
    descVi: 'Khám phá kiến trúc phần mềm từ lõi nghiệp vụ (Domain Entities) qua Use Cases, Gateways đến tầng hạ tầng ngoài cùng.',
    descEn: 'Explore Clean Architecture layers from Domain Entities through Use Cases to external Infrastructure.',
    url: '/library-bus/understand_dashboard.html',
    badge: 'Clean Radar'
  },
  {
    id: 'presentation-slides',
    titleVi: 'Bộ Slide Thuyết Trình Dự Án (30 Trang)',
    titleEn: 'Project Strategic Presentation (30 Slides)',
    descVi: 'Toàn bộ slide trình bày dự án: bài toán thực địa, nghiên cứu xã hội học, cấu trúc kỹ thuật và báo cáo phân tích dữ liệu.',
    descEn: 'Comprehensive 30-slide pitch: field problem statement, reader demographics, technical architecture, and data analytics.',
    url: '/library-bus/presentation.html',
    badge: '30 Slides'
  },
  {
    id: 'website-pdf',
    titleVi: 'Hồ Sơ Đặc Tả & Thiết Kế Gốc (website.html)',
    titleEn: 'Original Specification & Design Document (website.html)',
    descVi: 'Tài liệu thiết kế chi tiết 20 màn hình tổng hợp đầy đủ wireframes, sitemap, luồng người dùng và phân tích dữ liệu tương tác HTML.',
    descEn: 'Complete 20-screen system specification interactive HTML document with wireframes, sitemaps, user flows, and metrics.',
    url: '/library-bus/website.html',
    badge: 'Interactive HTML'
  }
];
