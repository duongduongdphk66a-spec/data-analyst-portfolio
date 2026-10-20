/**
 * Library Bus Brand Identity, Neo-Bakery Tokens & UX Research
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

// 01 INTRODUCTION AND RESEARCH

export const ABOUT_US_DATA = {
  chapter: '1',
  subChapter: '1.1',
  titleVi: 'VỀ DỰ ÁN',
  titleEn: 'ABOUT US',
  subtitleVi: '/Về dự án/',
  subtitleEn: '/About the project/',
  reason: {
    titleVi: 'Lý do phát triển',
    titleEn: 'Reason for Development',
    descVi: 'Thư viện thường gắn với một địa điểm cố định, nên người ở xa hoặc ít thời gian khó đến mượn sách. Library Bus là website cho dịch vụ xe thư viện lưu động: người đọc tra cứu sách, xem xe đang ở đâu và đặt mượn trước. Thủ thư xử lý việc mượn trả tại từng điểm dừng.',
    descEn: 'A library usually sits in one fixed place, so readers who live far away or have little time find it hard to borrow books. Library Bus is the website for a mobile library service: readers search for books, see where each bus is and reserve in advance, and librarians handle borrowing and returns at each stop.'
  },
  scope: {
    titleVi: 'Phạm vi dự án',
    titleEn: 'Project Scope',
    descVi: 'Dự án chỉ gồm phần thiết kế UX/UI: nghiên cứu, hệ thống thiết kế, wireframe và giao diện cho 20 màn hình desktop, kèm bản mobile. Sách, xe, tuyến và người dùng trong giao diện là dữ liệu mẫu để minh họa bố cục.',
    descEn: 'The project covers UX/UI design only: research, design system, wireframes and interfaces for 20 desktop screens plus mobile versions. Books, buses, routes and users shown in the interface are sample data used to illustrate layouts.'
  },
  brandMeaning: {
    titleVi: 'Ý nghĩa tên thương hiệu',
    titleEn: 'Brand Name Meaning',
    descVi: 'Library là thư viện và tri thức, Bus là sự di chuyển. Tên Library Bus nói rằng thư viện đến với người đọc.',
    descEn: 'Library stands for books and knowledge, Bus stands for movement. The name says that the library comes to the reader.'
  }
};

export const UX_RESEARCH_DATA = {
  chapter: '1',
  subChapter: '1.2',
  titleVi: 'NGHIÊN CỨU TRẢI NGHIỆM NGƯỜI DÙNG',
  titleEn: 'UX RESEARCH',
  subtitleVi: '/Thị trường, khách hàng và cấu trúc website/',
  subtitleEn: '/Market, customers and website structure/',
  marketResearch: {
    marketId: {
      titleVi: 'Xác định thị trường',
      titleEn: 'Market Identification',
      descVi: 'Người đọc muốn tìm sách nhanh qua mạng, nhưng vẫn thích sách giấy và việc nhận sách trực tiếp. Một dịch vụ mượn sách lưu động cần cho họ biết ba điều: sách nào còn, xe đang ở đâu và bao giờ xe đến.',
      descEn: 'Readers want to find books quickly online, yet still prefer printed books and picking them up in person. A mobile lending service has to tell them three things: which books are available, where the bus is and when it arrives.'
    },
    currentTrends: {
      titleVi: 'Xu hướng hiện tại',
      titleEn: 'Current Trends',
      descVi: 'Tra cứu mục lục thư viện qua website, đặt trước sách và nhận tại điểm hẹn, thông báo nhắc hạn trả, cùng nội dung cộng đồng như tin tức và blog để người đọc quay lại.',
      descEn: 'Library catalogs searched through websites, books reserved ahead and collected at a meeting point, reminders before due dates, and community content such as news and blog posts that bring readers back.'
    },
    conclusionVi: '=> Giao diện đặt phần tìm sách, xem xe và đặt trước ở vị trí dễ thấy, và dùng được trên điện thoại.',
    conclusionEn: '=> The interface puts book search, bus lookup and reservation where they are easy to see, and works on a phone.',
    noteVi: 'Phần nghiên cứu này là định hướng cho thiết kế, chưa dựa trên khảo sát hay số liệu thực địa.',
    noteEn: 'This research section guides the design. It is not based on a survey or field data.'
  },
  customerGroups: [
    {
      id: '1',
      nameVi: 'Độc giả và khách vãng lai',
      nameEn: 'Readers and Visitors',
      descVi: 'Người tìm sách, xem lịch xe và đặt trước. Hội viên có thêm hồ sơ, danh sách sách đang mượn và thông báo. Khách vãng lai xem giới thiệu, blog, FAQ và liên hệ trước khi đăng ký.',
      descEn: 'People who search for books, check bus schedules and reserve. Members also get a profile, a list of borrowed books and notifications. Visitors read the about page, blog, FAQ and contact page before signing up.'
    },
    {
      id: '2',
      nameVi: 'Thủ thư tại điểm dừng',
      nameEn: 'Librarians at Stops',
      descVi: 'Người tạo phiếu mượn, xử lý đặt trước và nhận sách quyên góp. Cần màn hình quản lý rõ ràng, ít bước, đọc được nhanh khi đang phục vụ người đọc.',
      descEn: 'People who create borrow slips, handle reservations and receive donated books. They need clear management screens with few steps that can be read quickly while serving readers.'
    },
    {
      id: '3',
      nameVi: 'Quản lý và ban dự án',
      nameEn: 'Managers and Project Board',
      descVi: 'Người theo dõi tình hình kho sách, giao dịch và hoạt động của các xe qua các dashboard và trang analytics.',
      descEn: 'People who follow the book stock, transactions and bus activity through the dashboards and analytics page.'
    }
  ],
  websiteReferences: [
    {
      nameVi: 'Danh mục tra cứu thư viện (OPAC)',
      nameEn: 'Library Catalog (OPAC)',
      descVi: 'Cách tìm, lọc và hiển thị trạng thái của từng cuốn sách.',
      descEn: 'How books are searched, filtered and shown with their status.',
      appliedVi: 'Màn hình danh sách sách và chi tiết sách.',
      appliedEn: 'Book catalog and book detail screens.'
    },
    {
      nameVi: 'Ứng dụng mượn sách trực tuyến',
      nameEn: 'Online Lending Apps',
      descVi: 'Luồng đặt trước và theo dõi sách đang mượn trên điện thoại.',
      descEn: 'The reservation flow and tracking of borrowed books on a phone.',
      appliedVi: 'Màn hình đặt trước, dashboard người dùng và thông báo.',
      appliedEn: 'Reservation, user dashboard and notification screens.'
    },
    {
      nameVi: 'Mô hình xe thư viện (bookmobile)',
      nameEn: 'Bookmobile Model',
      descVi: 'Xe đi theo lịch và dừng tại các điểm cố định.',
      descEn: 'Buses follow a schedule and stop at fixed points.',
      appliedVi: 'Màn hình danh sách xe trên bản đồ và chi tiết xe.',
      appliedEn: 'Bus map list and bus detail screens.'
    }
  ],
  functions: [
    { id: '1', nameVi: 'Tra cứu sách', nameEn: 'Book Search', descVi: 'Danh sách sách và trang chi tiết từng cuốn.', descEn: 'A book list and a detail page for each book.' },
    { id: '2', nameVi: 'Xem xe trên bản đồ', nameEn: 'Bus Map', descVi: 'Danh sách xe trên bản đồ và trang chi tiết từng xe.', descEn: 'A map of the buses and a detail page for each bus.' },
    { id: '3', nameVi: 'Mượn và đặt trước', nameEn: 'Borrow and Reserve', descVi: 'Tạo phiếu mượn tại điểm dừng và đặt trước sách trực tuyến.', descEn: 'Borrow slips created at a stop and online reservations.' },
    { id: '4', nameVi: 'Tài khoản và thông báo', nameEn: 'Account and Notifications', descVi: 'Đăng nhập, đăng ký, dashboard người dùng và trung tâm thông báo.', descEn: 'Login, registration, user dashboard and a notification center.' },
    { id: '5', nameVi: 'Quản lý thư viện', nameEn: 'Library Management', descVi: 'Dashboard quản lý, giao dịch, quyên góp sách và analytics.', descEn: 'Management dashboard, transactions, book donations and analytics.' },
    { id: '6', nameVi: 'Blog, FAQ và liên hệ', nameEn: 'Blog, FAQ and Contact', descVi: 'Tin tức, câu hỏi thường gặp và biểu mẫu liên hệ.', descEn: 'News, frequently asked questions and a contact form.' }
  ],
  sitemapRoot: 'Library Bus',
  sitemapTop: [
    { vi: 'Trang chủ', en: 'Home' },
    { vi: 'Giới thiệu', en: 'About' },
    { vi: 'Sách', en: 'Books' },
    { vi: 'Xe buýt', en: 'Buses' },
    { vi: 'Mượn trả và quyên góp', en: 'Lending and Donations' },
    { vi: 'Tài khoản', en: 'Account' },
    { vi: 'Blog', en: 'Blog' },
    { vi: 'Quản lý', en: 'Management' },
    { vi: 'Hỗ trợ', en: 'Support' }
  ],
  sitemap: [
    { parentVi: 'Trang chủ', parentEn: 'Home', childrenVi: ['Hero và lối vào chính', 'Sách mới cập nhật', 'Góc nhìn và tin tức'], childrenEn: ['Hero and main entry points', 'Newly added books', 'News and perspectives'] },
    { parentVi: 'Giới thiệu', parentEn: 'About', childrenVi: ['Khởi nguồn ý tưởng', 'Mục tiêu dành cho khách hàng'], childrenEn: ['Origin of the idea', 'Goals for customers'] },
    { parentVi: 'Sách', parentEn: 'Books', childrenVi: ['Danh sách sách', 'Chi tiết sách'], childrenEn: ['Book list', 'Book detail'] },
    { parentVi: 'Xe buýt', parentEn: 'Buses', childrenVi: ['Danh sách xe (bản đồ)', 'Chi tiết xe buýt'], childrenEn: ['Bus list (map)', 'Bus detail'] },
    { parentVi: 'Mượn trả và quyên góp', parentEn: 'Lending and Donations', childrenVi: ['Tạo phiếu mượn sách', 'Tạo đặt trước sách', 'Danh sách quyên góp', 'Dashboard giao dịch'], childrenEn: ['Create a borrow slip', 'Create a reservation', 'Donation list', 'Transactions dashboard'] },
    { parentVi: 'Tài khoản', parentEn: 'Account', childrenVi: ['Đăng nhập', 'Đăng ký', 'Dashboard người dùng', 'Thông báo'], childrenEn: ['Login', 'Registration', 'User dashboard', 'Notifications'] },
    { parentVi: 'Blog', parentEn: 'Blog', childrenVi: ['Trang chủ blog', 'Chi tiết bài viết'], childrenEn: ['Blog home', 'Article detail'] },
    { parentVi: 'Quản lý', parentEn: 'Management', childrenVi: ['Dashboard quản lý thư viện', 'Analytics dashboard'], childrenEn: ['Library management dashboard', 'Analytics dashboard'] },
    { parentVi: 'Hỗ trợ', parentEn: 'Support', childrenVi: ['FAQ', 'Liên hệ'], childrenEn: ['FAQ', 'Contact'] }
  ],
  userFlowTitleVi: 'Luồng người dùng: tìm sách và đặt mượn',
  userFlowTitleEn: 'User flow: find a book and reserve it',
  userFlowSteps: [
    { id: 'start', type: 'start', labelVi: 'Trang chủ', labelEn: 'Home', descVi: 'Người đọc vào website', descEn: 'The reader opens the website' },
    { id: 'know_decision', type: 'decision', labelVi: 'Biết sách cần tìm?', labelEn: 'Knows the book?', descVi: 'Có: đi tới tìm kiếm. Không: xem sách mới và tin tức rồi vào danh sách sách', descEn: 'Yes: go to search. No: browse new books and news, then open the book list' },
    { id: 'search', type: 'action', labelVi: 'Tìm kiếm sách', labelEn: 'Search for a book', descVi: 'Nhập từ khóa và lọc theo danh mục', descEn: 'Enter a keyword and filter by category' },
    { id: 'list', type: 'action', labelVi: 'Danh sách sách', labelEn: 'Book list', descVi: 'Chọn một cuốn sách', descEn: 'Pick a book' },
    { id: 'detail', type: 'action', labelVi: 'Chi tiết sách', labelEn: 'Book detail', descVi: 'Xem thông tin sách và nút đăng ký mượn', descEn: 'Read the book details and the borrow button' },
    { id: 'auth_decision', type: 'decision', labelVi: 'Đã đăng nhập?', labelEn: 'Signed in?', descVi: 'Chưa: đăng nhập hoặc đăng ký rồi quay lại bước đặt', descEn: 'No: sign in or register, then return to the reservation step' },
    { id: 'reserve', type: 'action', labelVi: 'Đặt trước hoặc tạo phiếu mượn', labelEn: 'Reserve or create a borrow slip', descVi: 'Điền thông tin và xác nhận', descEn: 'Fill in the details and confirm' },
    { id: 'done', type: 'end', labelVi: 'Hoàn tất', labelEn: 'Done', descVi: 'Người đọc nhận xác nhận và thông báo', descEn: 'The reader receives a confirmation and a notification' }
  ]
};

// 02 LOGO AND UI COMPONENTS

export const BRAND_IDENTITY_DATA = {
  chapter: '2',
  subChapter: '2.1 & 2.2',
  titleVi: 'LOGO VÀ THÀNH PHẦN GIAO DIỆN',
  titleEn: 'LOGO AND UI COMPONENTS',
  subtitleVi: '/Logo và thành phần giao diện/',
  subtitleEn: '/Logo and UI components/',
  logo: {
    ideaVi: 'Logo ghép tên thương hiệu với biểu tượng xe buýt, hình ảnh gắn với dịch vụ chính là thư viện lưu động. Tên viết bằng font Lora đậm, biểu tượng nằm trong khối màu cam.',
    ideaEn: 'The logo pairs the brand name with a bus icon, the image tied to the main service: a mobile library. The name is set in bold Lora and the icon sits in an orange block.',
    meaningVi: 'Font có chân gợi sách in và thư viện. Biểu tượng xe buýt gợi sự di chuyển. Màu nâu đậm và cam lấy từ bảng màu của giao diện, tạo cảm giác ấm và gần gũi.',
    meaningEn: 'The serif font recalls printed books and libraries. The bus icon suggests movement. The dark brown and orange come from the interface palette and feel warm and familiar.',
    structureVi: 'Biểu tượng nằm bên trái, tên Library Bus bên phải, hai phần canh giữa theo chiều dọc. Đơn vị X bằng chiều cao của biểu tượng.',
    structureEn: 'The icon sits on the left and the name Library Bus on the right, both centered vertically. The unit X equals the height of the icon.',
    safeDistanceVi: 'Chừa tối thiểu 1X xung quanh logo. Không đặt chữ, ảnh hoặc họa tiết khác vào vùng này.',
    safeDistanceEn: 'Keep at least 1X of empty space around the logo. Do not place text, images or patterns in this area.',
    minimumSizeVi: 'Không thu nhỏ đến mức chân chữ và nét của biểu tượng bị mất.',
    minimumSizeEn: 'Do not shrink the logo until the serifs and the icon strokes disappear.',
    fontName: 'Lora (logo và tiêu đề), Outfit (nội dung và nút bấm)'
  },
  colors: {
    primary: [
      { nameVi: 'Molasses Ink', nameEn: 'Molasses Ink', hex: '#4E0705', rgb: '78, 7, 5', roleVi: 'Chữ chính và các khối nền đậm.', roleEn: 'Main text and dark background blocks.' },
      { nameVi: 'Well-browned', nameEn: 'Well-browned', hex: '#812203', rgb: '129, 34, 3', roleVi: 'Viền, tiêu đề phụ và trạng thái nhấn.', roleEn: 'Borders, secondary headings and emphasis states.' },
      { nameVi: 'Roast Amber', nameEn: 'Roast Amber', hex: '#BD5705', rgb: '189, 87, 5', roleVi: 'Nút chính và điểm nhấn chính.', roleEn: 'Primary buttons and the main accent.' }
    ],
    supporting: [
      { nameVi: 'Toasty Orange', nameEn: 'Toasty Orange', hex: '#ED9040', rgb: '237, 144, 64', roleVi: 'Huy hiệu và điểm nhấn phụ.', roleEn: 'Badges and secondary accents.' },
      { nameVi: 'Greasey Honey', nameEn: 'Greasey Honey', hex: '#FFC270', rgb: '255, 194, 112', roleVi: 'Viền thẻ và trạng thái hover.', roleEn: 'Card borders and hover states.' },
      { nameVi: 'Butter Cream', nameEn: 'Butter Cream', hex: '#FDE971', rgb: '253, 233, 113', roleVi: 'Điểm nhấn nhẹ.', roleEn: 'Light accents.' },
      { nameVi: 'Pure Ivory', nameEn: 'Pure Ivory', hex: '#FFFDF9', rgb: '255, 253, 249', roleVi: 'Nền trang.', roleEn: 'Page background.' }
    ]
  },
  typography: [
    { tag: 'HEADING 1', size: '36 pt', letterSpacing: '-1,0', example: 'Thư Viện Lưu Động', roleVi: 'Tiêu đề trang chính' },
    { tag: 'HEADING 2', size: '28 pt', letterSpacing: '-0,5', example: 'Sách Mới Cập Nhật', roleVi: 'Tiêu đề khu vực' },
    { tag: 'HEADING 3', size: '20 pt', letterSpacing: '0', example: 'Chi Tiết Xe Buýt', roleVi: 'Tiêu đề khối nội dung' },
    { tag: 'HEADING 4', size: '16 pt', letterSpacing: '0,2', example: 'Thông Tin Mượn Trả', roleVi: 'Tiêu đề thẻ và hộp thoại' },
    { tag: 'BODY 1', size: '14 pt', letterSpacing: '0,1', example: 'Tra cứu sách và đặt trước trực tuyến', roleVi: 'Nội dung chính' },
    { tag: 'BODY 2 / CAPTION', size: '12 pt', letterSpacing: '0,2', example: 'Cập nhật hôm nay', roleVi: 'Thông tin phụ, chú thích' },
    { tag: 'BUTTON', size: '13 pt', letterSpacing: '0,5', example: 'ĐẶT MƯỢN SÁCH', roleVi: 'Chữ trên nút bấm' }
  ],
  uiComponents: {
    buttons: [
      { type: 'Primary Button', default: 'Nền Roast Amber #BD5705, chữ trắng', hover: 'Nền Well-browned #812203', disabled: 'Nền nhạt, chữ xám' },
      { type: 'Secondary Button', default: 'Viền Molasses #4E0705, nền sáng', hover: 'Viền và chữ Roast Amber', disabled: 'Viền và chữ nhạt' },
      { type: 'Text Button', default: 'Chữ Well-browned', hover: 'Chữ Roast Amber, gạch chân', disabled: 'Chữ nhạt' }
    ],
    textFill: {
      defaultState: 'Viền nhạt, chữ gợi ý màu xám',
      focusState: 'Viền Roast Amber #BD5705 kèm vòng sáng nhẹ'
    },
    iconSet: ['BookOpen', 'Bus', 'Clock', 'Bell', 'User', 'MapPin', 'Search', 'Star', 'Calendar', 'BarChart3', 'Plus', 'Check']
  }
};

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

