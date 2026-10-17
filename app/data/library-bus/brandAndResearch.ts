/**
 * Library Bus Brand Identity, Neo-Bakery Tokens & UX Research
 */
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
    descVi: 'Library Bus xóa bỏ rào cản địa lý, đưa sách hay đến tận khu dân cư và trường học.',
    descEn: 'Library Bus bridges the gap by bringing quality books directly to suburban neighborhoods and school gates.'
  },
  mission: {
    titleVi: 'Sứ mệnh',
    titleEn: 'Mission',
    descVi: 'Bình đẳng hóa tri thức qua công nghệ GPS và mượn trực tuyến, nuôi dưỡng tình yêu đọc sách.',
    descEn: 'Democratize reading through GPS tracking and online reservations, fostering sustainable habits across all generations.'
  },
  brandMeaning: {
    titleVi: 'Ý nghĩa tên thương hiệu',
    titleEn: 'Brand Name Meaning',
    descVi: '"Library Bus" kết hợp tri thức (Library) và sự chuyển động (Bus), mang thư viện đến mọi người.',
    descEn: '"Library Bus" blends static wisdom with dynamic movement. Knowledge no longer waits; it travels to the people.'
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
      descVi: 'Xu hướng O2O tăng cao. Độc giả thích tra cứu online nhưng vẫn chuộng sách giấy và giao lưu cộng đồng.',
      descEn: 'O2O ecosystem is growing. Readers want quick digital discovery combined with physical books in communal settings.'
    },
    currentTrends: {
      titleVi: 'Xu hướng hiện tại',
      titleEn: 'Current Trends',
      descVi: 'Số hóa kho trực tuyến, đặt sách không chạm và Gamification (chuỗi đọc) để tăng tương tác.',
      descEn: 'Real-time IoT inventory, contactless reservations, and gamified reading streaks dramatically heighten user engagement.'
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
        needsVi: 'Cần sách ôn luyện và tiểu thuyết. Tan trường muộn nên không kịp tới thư viện thành phố.',
        needsEn: 'Needs exam prep and novels. Finishes school late and cannot travel to central libraries.',
        painPointVi: 'Sợ sách bị mượn hết trước khi đến; cần biết chính xác lịch xe dừng ở cổng trường.',
        painPointEn: 'Worries the desired book is already borrowed; wants exact stop timings at the school gate.'
      },
      {
        name: 'Trần Thị Mai Lan',
        roleVi: 'Phụ huynh bận rộn (34 tuổi)',
        roleEn: 'Working Mother (34 y/o)',
        avatar: '👩‍💼',
        needsVi: 'Muốn rèn thói quen đọc sách cho con thay vì dùng đồ điện tử. Thích không gian ngoài trời.',
        needsEn: 'Wants to instill reading habits in her 8 y/o child instead of screens. Loves outdoor weekend reading events.',
        painPointVi: 'Thời gian eo hẹp; cần ứng dụng đặt sách nhanh để lấy ngay khi đón con tan học.',
        painPointEn: 'Extremely limited free time; needs quick mobile reservation to pick up books right when picking up kids.'
      },
      {
        name: 'Bác Lê Văn Hưng',
        roleVi: 'Cán bộ hưu trí (68 tuổi)',
        roleEn: 'Retired Teacher (68 y/o)',
        avatar: '👴',
        needsVi: 'Thích đọc báo, sách lịch sử. Coi trạm dừng thư viện là nơi giao lưu kết bạn tuổi già.',
        needsEn: 'Enjoys morning news, history books and memoirs. Considers the mobile bus stop a heartwarming social hub.',
        painPointVi: 'Gặp khó khăn với giao diện phức tạp; cần sự trợ giúp trực tiếp từ thủ thư.',
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
    ideaVi: 'Logo kết hợp xe buýt và trang sách, tượng trưng cho tri thức trên cung đường số.',
    ideaEn: 'The logo fuses a transit vehicle with open pages, symbolizing knowledge soaring across digital routes.',
    meaningVi: 'Tông màu ấm áp Neo-Bakery (Molasses #4E0705, Roast #BD5705, Butter #FDE971) gợi cảm giác thân thuộc như gian bếp gia đình và những trang sách mới.',
    meaningEn: 'The warm Neo-Bakery palette (Molasses #4E0705, Roast #BD5705, Butter #FDE971) evokes the comfort of printed pages and community learning.',
    structureRatio: '6.6X × 4X (Chiều dài 6.6X và Chiều cao 4X, với X là đơn vị cơ sở chuẩn hóa)',
    safeDistance: '1.5X khi đứng độc lập và 2X khi đứng cạnh logo đối tác trường học / nhà tài trợ',
    minimumSize: '56.7px (~2cm) trên ấn phẩm in và 42.5px trên màn hình số để đảm bảo độ rõ nét',
    fontName: 'Outfit & Inter (Tối ưu cho màn hình số Responsive)'
  },
  colors: {
    primary: [
      { nameVi: 'Molasses Ink (Màu chủ đạo)', nameEn: 'Molasses Ink (Primary Brand)', hex: '#4E0705', rgb: '78, 7, 5', roleVi: 'Nhận diện thương hiệu chính, màu nâu đen espresso sâu dùng cho logo, tiêu đề và chữ chính', roleEn: 'Primary brand identity, deep espresso brown used for logo, headings and primary text' },
      { nameVi: 'Well-browned (Màu viền & Cấu trúc)', nameEn: 'Well-browned (Structure & Accent)', hex: '#812203', rgb: '129, 34, 3', roleVi: 'Màu hạt dẻ nướng, dùng cho đường viền, phân cách cấu trúc và thanh điều hướng', roleEn: 'Toasted chestnut, structural borders and active divider states' },
      { nameVi: 'Roast Amber (Màu hành động CTA)', nameEn: 'Roast Amber (Primary CTA)', hex: '#BD5705', rgb: '189, 87, 5', roleVi: 'Màu hổ phách caramel, điểm nhấn chính (Single Accent) cho nút bấm đặt mượn, giữ chỗ sách', roleEn: 'Warm amber caramel, single accent for primary CTAs (Hold Book, Borrow)' }
    ],
    supporting: [
      { nameVi: 'Toasty Orange (Màu trạng thái)', nameEn: 'Toasty Orange (Status)', hex: '#ED9040', rgb: '237, 144, 64', roleVi: 'Màu cam bánh mì nướng cho thanh cuộn, nhãn metadata và badge', roleEn: 'Warm toast orange for status badges and metadata tags' },
      { nameVi: 'Greasey Honey (Màu thẻ & Hover)', nameEn: 'Greasey Honey (Card Accent)', hex: '#FFC270', rgb: '255, 194, 112', roleVi: 'Màu bơ mật ong cho viền thẻ sách và hiệu ứng hover', roleEn: 'Honey butter for book card borders and subtle hover glow' },
      { nameVi: 'Butter Cream (Màu nổi bật)', nameEn: 'Butter Cream (Highlight)', hex: '#FDE971', rgb: '253, 233, 113', roleVi: 'Màu vàng kem pastry nhạt cho nhãn nổi bật và hero tag', roleEn: 'Pastry butter cream for featured tags and hero badges' },
      { nameVi: 'Pure Ivory (Màu nền giấy sách)', nameEn: 'Pure Ivory (Page Background)', hex: '#FFFDF9', rgb: '255, 253, 249', roleVi: 'Màu nền trang web, đem lại cảm giác trang giấy sách ấm áp cổ điển', roleEn: 'Warm ivory background evoking classic printed book paper' }
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
      { type: 'Primary Button', default: 'Đặt Mượn Sách', hover: 'Nền Well-browned #812203 kèm ring vàng kem', disabled: 'Màu xám nhạt không click' },
      { type: 'Secondary Button', default: 'Xem Lộ Trình Xe', hover: 'Nền Parchment viền Roast Amber', disabled: 'Ẩn hiệu ứng' },
      { type: 'Outline Button', default: 'Chi Tiết Trạm Dừng', hover: 'Đổi nền trắng sang viền đậm', disabled: 'Mờ nhạt' }
    ],
    textFill: {
      defaultState: 'Nhập tên sách hoặc tác giả...',
      hoverState: 'Viền bơ mật ong #FFC270',
      focusState: 'Viền Roast Amber #BD5705 kèm glow ring #FFC270',
      errorState: 'Viền đỏ kèm thông báo lỗi'
    },
    iconSet: ['Bus', 'BookOpen', 'Search', 'User', 'MapPin', 'Calendar', 'Bell', 'ShieldCheck', 'QrCode', 'Clock', 'Sparkles', 'Layers']
  }
};

// ==========================================
// Bảng màu chuẩn hóa hệ màu ấm Neo-Bakery Warm Paper Tokens của Web Thư Viện
export const NEO_BAKERY_TOKENS = {
  molasses: '#4E0705',        // Deep espresso / primary text & dark ground
  wellBrowned: '#812203',     // Toasted chestnut / structural border & divider
  roast: '#BD5705',           // Warm amber / primary CTA & action
  toasty: '#ED9040',          // Toast orange / status badges & active tags
  greasey: '#FFC270',         // Honey butter / card border & hover tint
  butter: '#FDE971',          // Pastry cream / highlight badges & hero tag
  bgPage: '#FFFDF9',          // Warm ivory / clean page background
  bgPageAlt: '#FAF4EC',       // Soft warm parchment surface
  bgSurface: '#FFFFFF',       // Elevated card surface
  bgSurfaceRaised: '#FAF5EF', // Interactive surface
  bgSurfaceSunken: '#F5EBE1', // Input recessed surface
  darkPage: '#1A0403',        // Night espresso ground
  darkSurface: '#260B0A',     // Dark card surface
  darkSurfaceRaised: '#3B1513',
};

// ==========================================
// 03 WEBSITE DESIGN (Toàn bộ 20 Màn hình Hệ thống)
// ==========================================
