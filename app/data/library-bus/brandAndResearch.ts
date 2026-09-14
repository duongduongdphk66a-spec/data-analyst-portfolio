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
