import { ProfileData, ProjectData, DashboardData } from './types';
import { libraryBusMarkdownContent } from './data/libraryBusContent';

export const DEFAULT_PROFILE: ProfileData = {
  name: "Ma Văn Hùng",
  subtitle: "Fresher Data Analyst | Business Intelligence & Analytics",
  title: "Fresher Data Analyst",
  bio: "Fresher Data Analyst phân tích dữ liệu kinh doanh bằng SQL, Python, thống kê ứng dụng và Recharts. Tập trung làm sạch dữ liệu đa nguồn, kiểm định giả thuyết, đối soát số liệu (Data Reconciliation) và thiết kế báo cáo vận hành.",
  careerGoal: "Thiết kế hệ thống dữ liệu và báo cáo phân tích kinh doanh",
  careerGoalsList: [
    {
      id: 'goal-1',
      title: 'Xây dựng pipeline và chuẩn hóa dữ liệu',
      desc: 'Thiết kế quy trình ETL/ELT, làm sạch và đối soát dữ liệu đa nguồn vào cơ sở dữ liệu quan hệ.',
      icon: 'list'
    },
    {
      id: 'goal-2',
      title: 'Phát triển dashboard trực quan',
      desc: 'Xây dựng bảng điều khiển tương tác trên Recharts theo dõi chỉ số hiệu suất vận hành.',
      icon: 'cloud'
    },
    {
      id: 'goal-3',
      title: 'Phân tích số liệu và hỗ trợ vận hành',
      desc: 'Áp dụng kiểm định thống kê và mô hình định lượng để giải quyết bài toán tối ưu doanh thu và chi phí.',
      icon: 'network'
    }
  ],
  avatarUrl: "/icon.svg",
  email: "mavanhung.da@gmail.com",
  github: "https://github.com/duongduongdphk66a-spec/data-analyst-portfolio",
  linkedin: "https://www.linkedin.com/in/ma-van-hung",
  skills: [
    { id: 'sk-1', name: 'SQL (PostgreSQL / MySQL)', category: 'Languages & Querying', level: 4, icon: 'sql', proficiencyNote: 'Complex Joins, CTEs, Window Functions, Subqueries, Data Reconciliation', tags: ['Joins', 'CTEs', 'Window Functions', 'Reconciliation'] },
    { id: 'sk-2', name: 'Python for Analytics', category: 'Languages & Querying', level: 4, icon: 'python', proficiencyNote: 'Pandas, NumPy, SciPy, Statsmodels, Automated Data Wrangling', tags: ['Pandas', 'NumPy', 'SciPy', 'Data Cleaning'] },
    { id: 'sk-3', name: 'BI & Data Visualization (Recharts)', category: 'BI & Visualization', level: 4, icon: 'uiux', proficiencyNote: 'Recharts Interactive Dashboards, Custom SVG Charts, Data Storytelling', tags: ['Recharts', 'Interactive Dashboards', 'Data Storytelling'] },
    { id: 'sk-4', name: 'Data Reconciliation & CSV Prep', category: 'BI & Visualization', level: 4, icon: 'database', proficiencyNote: 'Cross-Source Reconciliation, Definition Auditing, CSV & Tabular Cleaning', tags: ['Reconciliation', 'Metric Auditing', 'CSV Cleanup'] },
    { id: 'sk-5', name: 'Thống kê & Phân tích Khám phá (EDA)', category: 'Statistical & Modeling', level: 4, icon: 'ml', proficiencyNote: 'OLS Regression, Mann-Whitney U, HHI Concentration, Cohort & Time-series', tags: ['EDA', 'OLS & Mann-Whitney', 'Cohort', 'Time-series'] },
    { id: 'sk-6', name: 'Business Analysis & System Design', category: 'Data Engineering', level: 3, icon: 'devops', proficiencyNote: 'User Research, Sitemap, User Flow, Wireframe & Relational Schema (ERD)', tags: ['BRD & User Flow', 'ERD Design', 'Sitemap', 'Wireframe'] },
  ],
  experiences: [
    {
      id: 'exp-edu-1',
      role: 'Cử nhân Ngành Nhật Bản học (Khoa Đông Phương học)',
      company: 'Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQGHN',
      period: '2021 - 2025',
      type: 'education',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Nghiên cứu kinh tế - xã hội Nhật Bản bằng phương pháp định lượng và thống kê dữ liệu.',
        'Thực hiện niên luận: "Sự phát triển của Du lịch Di sản tại Nhật Bản giai đoạn từ năm 2013 đến nay" (trọng tâm 2013–2023 trên nền dữ liệu 2003–2022, GVHD: TS Võ Minh Vũ).'
      ]
    },
    {
      id: 'exp-work-1',
      role: 'Công trình Nghiên cứu Khoa học: Phân tích Du lịch Di sản tại Nhật Bản (2013–2023)',
      company: 'Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQGHN',
      period: '2023 - 2024',
      type: 'work',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Thu thập, kiểm toán (Data Audit) và chuẩn hóa 6 bộ dữ liệu chuỗi thời gian 20 năm (2003–2022) từ MLIT và JNTO để đánh giá giai đoạn chính sách 2013–2023.',
        'Lượng hóa quy mô đỉnh 31,9 triệu khách (2019), chi tiêu 4,81 nghìn tỷ Yên, đóng góp 7,5% GDP và tỷ lệ quá tải 3.000 : 1 tại làng cổ Shirakawa-go.'
      ]
    },
    {
      id: 'exp-work-2',
      role: 'Steve x Kami Company: Hỗ trợ Vận hành & Báo cáo Dữ liệu E-Commerce',
      company: 'Steve x Kami Company',
      period: '2022 - 2023',
      type: 'work',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Theo dõi đơn hàng hàng ngày, tỷ lệ hoàn/hủy và tổng hợp báo cáo doanh số định kỳ trên TikTok Shop.',
        'Kinh nghiệm vận hành thực tế giai đoạn 2022–2023 độc lập với dự án nghiên cứu cá nhân Kami Ely năm 2026 (sử dụng dữ liệu ước tính công khai từ FastMoss).'
      ]
    },
    {
      id: 'exp-work-3',
      role: 'Library Bus: Phân tích Nghiệp vụ (BA) & Thiết kế UX/UI Website Thư Viện Lưu Động',
      company: 'Dự án Thiết kế Sản phẩm & Nghiên cứu UX',
      period: '2023 - 2024',
      type: 'work',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Nghiên cứu nhu cầu độc giả (User Research, Persona), xây dựng Sitemap, User Flow và quy trình nghiệp vụ đặt mượn sách theo điểm dừng xe buýt.',
        'Thiết kế hệ thống lưới 12 cột, bộ thành phần giao diện và 20 cặp màn hình Wireframe – UI (Desktop & Mobile) kèm giao diện Dashboard quản trị mẫu.'
      ]
    }
  ]
};

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 'proj-kami-ely',
    title: 'Kami Ely: Phân tích hiệu suất TikTok Shop và mạng lưới Affiliate (Dữ liệu ước tính FastMoss)',
    titleEn: 'Kami Ely: TikTok Shop & Affiliate Network Analytics (FastMoss Estimated Telemetry)',
    desc: 'Dự án phân tích độc lập 231 ngày vận hành (09/03 – 25/10/2026: 15,01 tỷ đồng GMV ước tính, 101.896 sản phẩm bán ra) từ dữ liệu ước tính của bên thứ ba (FastMoss). Đối chiếu cửa sổ 180 ngày (12,74 tỷ đồng, 85.500 sản phẩm) và lũy kế toàn thời gian (31,6 tỷ đồng, 238,4k sản phẩm).',
    descEn: 'Independent case study analyzing 231 operating days (Mar 09 – Oct 25, 2026: 15.01B VND estimated GMV, 101,896 units sold) from third-party FastMoss telemetry. Cross-reconciled with the 180-day window (12.74B VND, 85,500 units) and all-time store cumulative totals (31.6B VND, 238.4k units).',
    tags: ['E-Commerce Analytics', 'Time-Series & OLS', 'Cohort & HHI', 'Statistical Testing', 'SQL & Python', 'Recharts'],
    img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    featured: true,
    problem: 'Doanh thu tháng 8 giảm 83,1% so với đỉnh tháng 6 khi qua cao điểm đồ bơi hè. Gian hàng cần xác định mức độ phụ thuộc vào từng kênh nội dung, sức bền mạng lưới KOC và danh mục sản phẩm thay thế cho mùa Thu Đông.',
    problemEn: 'August revenue fell 83.1% from the June peak after summer swimwear demand subsided. Needed to quantify channel concentration, KOC retention decay, and autumn-winter SKU transition performance.',
    method: 'Chuẩn hóa 10 bảng dữ liệu ước tính FastMoss (23.364 dòng, 231 ngày), kiểm chứng độ nhạy trung bình trượt khi Winsorize ngoại lai, chạy hồi quy OLS đa biến, đo chỉ số tập trung HHI và kiểm định phi tham số Mann-Whitney U cho video quảng cáo.',
    methodEn: 'Standardized 10 FastMoss estimated telemetry tables (23,364 rows, 231 days), tested moving-average crossover sensitivity under outlier Winsorization, fitted daily OLS regression, computed HHI concentration, and ran Mann-Whitney U tests on video ads.',
    insight: 'Live chính chủ và kênh vệ tinh tạo ra 84,5% doanh thu livestream, trong khi 12/133 mã có đơn tạo 80,6% GMV. Danh mục chuyển dịch sang hàng Thu Đông cùng nhóm creator mới giúp doanh thu tháng 10 hồi phục lên 1,62 tỷ đ (trong 25 ngày).',
    insightEn: 'Official and satellite livestreams generated 84.5% of live GMV, while 12 converting SKUs drove 80.6% of GMV. Transitioning to autumn catalog alongside new creator cohorts helped October revenue rebound to 1.62B VND (in 25 days).',
    metrics: [
      { label: 'GMV ước tính (231 ngày)', labelEn: 'Estimated GMV (231 Days)', value: '15,01 Tỷ', change: '101.896 sản phẩm bán ra', changeEn: '101,896 units sold', isPositive: true },
      { label: 'Giá bán TB thực tế (ASP)', labelEn: 'Average Selling Price (ASP)', value: '147,3k đ', change: 'Dải 75k-250k chiếm 93% GMV', changeEn: '75k-250k band = 93% GMV', isPositive: true },
      { label: 'Thị phần Live in-house', labelEn: 'In-House Live Share', value: '84,5%', change: 'Chính chủ + Kênh vệ tinh', changeEn: 'Official + Satellite Live', isPositive: true },
      { label: 'Mức tập trung HHI KOC', labelEn: 'Affiliate Live HHI', value: '1.471', change: 'HHI danh bạ 3.842 · Đối tác ngoài 1.471', changeEn: 'Directory HHI 3,842 · Ext partners 1,471', isPositive: true }
    ],
    tools: ['Python (scipy & numpy)', 'SQL Data Pipeline', 'OLS & Non-parametric Tests', 'Recharts']
  },
  {
    id: 'proj-heritage-japan',
    title: 'Sự phát triển của Du lịch Di sản tại Nhật Bản (2013–2023): Phân tích Chuỗi Thời gian',
    titleEn: 'Heritage Tourism Growth in Japan (2013–2023): A Time-Series Analysis',
    desc: 'Niên luận nghiên cứu định lượng giai đoạn chính sách 2013–2023 dựa trên chuỗi dữ liệu 20 năm (2003–2022) từ JNTO và MLIT. Đánh giá tác động kinh tế vĩ mô, cú sốc COVID-19 và áp lực quá tải tại các điểm di sản UNESCO.',
    descEn: 'Quantitative research thesis examining the 2013–2023 policy era built on a 20-year empirical time-series baseline (2003–2022) from JNTO and MLIT. Evaluates macroeconomic contributions, COVID-19 shocks, and overtourism at UNESCO sites.',
    tags: ['Time-Series Analysis', 'Data Audit', 'Policy Evaluation', 'Recharts'],
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    featured: true,
    problem: 'Lượng khách quốc tế đến Nhật Bản tăng vọt từ 10,36 triệu (2013) lên 31,88 triệu (2019) trước khi sụt giảm 99,2% năm 2021 vì đại dịch, gây ra bài toán kép giữa phục hồi kinh tế và bảo tồn di sản trước áp lực quá tải.',
    problemEn: 'International arrivals surged from 10.36M (2013) to 31.88M (2019) before collapsing 99.2% in 2021 during the pandemic, creating a dual challenge between economic recovery and heritage preservation under overtourism.',
    method: 'Thu thập, kiểm toán độ lệch (Data Audit) và chuẩn hóa 6 bộ dữ liệu thống kê (2003–2022) từ JNTO, MLIT, UNWTO và WTTC. Áp dụng mô hình xu thế log-linear và phân tích đối sánh đa điểm đến (Kyoto, Shirakawa-go, Himeji).',
    methodEn: 'Collected, audited, and standardized 6 statistical datasets (2003–2022) from JNTO, MLIT, UNWTO, and WTTC. Applied log-linear counterfactual trend modeling and multi-site comparative analysis (Kyoto, Shirakawa-go, Himeji).',
    insight: 'Tổng chi tiêu du lịch quốc tế đạt đỉnh 4,81 nghìn tỷ Yên năm 2019 (gấp 3,41 lần năm 2013), đóng góp 7,5% GDP và hơn 4 triệu việc làm. Phân bố khách lệch mạnh khiến làng cổ Shirakawa-go chịu tỷ lệ 3.000 du khách trên 1 cư dân.',
    insightEn: 'Inbound tourist expenditure peaked at 4.81 trillion Yen in 2019 (3.41x vs 2013), contributing 7.5% of GDP and over 4M jobs. Severe spatial concentration subjected historic Shirakawa-go village to a 3,000:1 tourist-to-resident ratio.',
    metrics: [
      { label: 'Khung Phân Tích & Dữ Liệu', labelEn: 'Study & Data Horizon', value: '2013–2023', change: 'Nền dữ liệu 20 năm (2003–2022)', changeEn: '20-yr baseline (2003–2022)', isPositive: true },
      { label: 'Lượng Khách Đạt Đỉnh', labelEn: 'Peak Annual Visitors', value: '31,9 Triệu', change: '+206,7% (2019 vs 2013)', changeEn: '+206.7% (2019 vs 2013)', isPositive: true },
      { label: 'Tổng Chi Tiêu Đỉnh Điểm', labelEn: 'Peak Tourism Expenditure', value: '4,81T Yên', change: '3,41x so với 2013 · 7,5% GDP', changeEn: '3.41x vs 2013 · 7.5% GDP', isPositive: true },
      { label: 'Tỷ Lệ Quá Tải Cục Bộ', labelEn: 'Local Overtourism Ratio', value: '3.000 : 1', change: 'Khách / cư dân tại Shirakawa-go', changeEn: 'Visitors / resident at Shirakawa-go', isPositive: false }
    ],
    tools: ['Python', 'Time-Series Modeling', 'Data Audit', 'Recharts', 'Data Storytelling']
  },
  {
    id: 'proj-library-bus',
    title: 'Library Bus: Phân tích Nghiệp vụ (BA) & Thiết kế UX/UI Website Thư Viện Lưu Động',
    titleEn: 'Library Bus: Business Analysis (BA) & UX/UI Design for a Mobile Library Website',
    desc: 'Dự án Phân tích Nghiệp vụ (BA) và Thiết kế UX/UI cho hệ thống xe thư viện lưu động: nghiên cứu người dùng, xây dựng sitemap, luồng nghiệp vụ mượn/trả và thiết kế 20 cặp màn hình Wireframe – UI (Desktop & Mobile) trên bộ dữ liệu mẫu.',
    descEn: 'A Business Analysis (BA) and UX/UI system design project for a mobile library service: user research, sitemap, borrowing user flows, and 20 Wireframe-to-UI screen pairs (Desktop & Mobile) built with sample data.',
    tags: ['Business Analysis (BA)', 'UX/UI Design', 'Sitemap & User Flow', 'Wireframe', 'Design System'],
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80',
    demoUrl: '/library-bus/website.html',
    featured: true,
    content: libraryBusMarkdownContent,
    problem: 'Thư viện cố định khó tiếp cận với người ở xa hoặc ít thời gian. Dịch vụ xe thư viện lưu động cần một hệ thống chuẩn hóa luồng nghiệp vụ giúp độc giả tra cứu tồn kho sách theo xe, theo dõi lộ trình điểm dừng và đặt mượn trước.',
    problemEn: 'A fixed library is hard to reach for people who live far away or have little time. A mobile library service needs a structured product workflow where readers check bus-level inventory, track route stops, and reserve books in advance.',
    method: 'Thực hiện quy trình BA, UX/UI & Kiến trúc dữ liệu: xây dựng Persona, Sitemap, User Flow, quy tắc nghiệp vụ (BR-01..04), hệ thống lưới 12 cột, cặp Wireframe – UI cho 11 màn hình cốt lõi (Desktop & Mobile) và lược đồ CSDL PostgreSQL ACID.',
    methodEn: 'Executed an end-to-end BA, UX/UI & Data Architecture workflow: Personas, Sitemap, User Flows, Business Rules (BR-01..04), 12-column grid, paired Wireframe-to-UI designs across 11 core screens (Desktop & Mobile), and PostgreSQL ACID schema.',
    insight: 'Chuẩn hóa luồng đặt giữ sách trước tại trạm dừng với khóa dòng dữ liệu (select_for_update) và đối chiếu trực tiếp 11 cặp Wireframe – UI giúp đồng bộ yêu cầu nghiệp vụ giữa BA, thiết kế và kỹ thuật. Số liệu hiển thị trên giao diện là dữ liệu hạt giống phục vụ kiểm thử.',
    insightEn: 'Standardizing the stop-based reservation flow with row-level locking (select_for_update) and pairing all 11 core Wireframes with final UI aligns requirements across BA, design, and engineering. Interface metrics represent seeded prototype data.',
    metrics: [
      { label: 'Màn Hình Cốt Lõi', labelEn: 'Core Screen Pairs', value: '11 Cặp', change: 'Desktop 1440px & Mobile 390px', changeEn: 'Desktop 1440px & Mobile 390px', isPositive: true },
      { label: 'Bản Thiết Kế', labelEn: 'Total Views', value: '44 Bản', change: '22 Wireframe + 22 UI đối chiếu', changeEn: '22 Wireframe + 22 UI paired', isPositive: true },
      { label: 'Luồng Nghiệp Vụ BA', labelEn: 'BA User Flows', value: '4 Luồng', change: 'Tra cứu · Đặt giữ · Mượn trả · Quyên góp', changeEn: 'Search · Reserve · Borrow · Donate', isPositive: true },
      { label: 'Kiến Trúc & Chỉ Số', labelEn: 'Schema & Analytics', value: '6 Bảng', change: 'ACID Lock · Bayesian & Cosine', changeEn: 'ACID Lock · Bayesian & Cosine', isPositive: true }
    ],
    tools: ['Business Analysis (BA)', 'UX/UI Design', 'Sitemap & User Flow', 'PostgreSQL ACID', 'Django ORM']
  }
];

export const DEFAULT_DASHBOARD: DashboardData = {
  title: "Executive Business Analytics Dashboard",
  description: "Trực quan hóa các chỉ số kinh doanh từ dữ liệu ước tính FastMoss (Kami Ely 231 ngày) và chuỗi thời gian JNTO (Heritage Japan).",
  kpis: [
    {
      id: 'kpi-1',
      title: 'Tổng Doanh Thu Ước Tính (GMV)',
      value: '15,01 Tỉ VNĐ',
      change: 'Chu kỳ 231 ngày (101.896 sản phẩm)',
      isPositive: true,
      icon: 'dollar'
    },
    {
      id: 'kpi-2',
      title: 'Dữ Liệu Chuỗi Thời Gian JNTO',
      value: '20 Năm',
      change: '2003 - 2022 (Trọng tâm 2013 - 2023)',
      isPositive: true,
      icon: 'activity'
    },
    {
      id: 'kpi-3',
      title: 'Mạng Lưới Creators',
      value: '329/6.086',
      change: '5,4% affiliate có doanh thu (chính chủ 60,1% KOL)',
      isPositive: true,
      icon: 'users'
    },
    {
      id: 'kpi-4',
      title: 'Giá Bán Bình Quân (ASP)',
      value: '147.298 đ',
      change: 'Doanh thu / Sản phẩm (231 ngày)',
      isPositive: true,
      icon: 'trending'
    }
  ],
  charts: [
    {
      id: 'chart-1',
      title: 'Xu Hướng Doanh Thu TikTok Shop Kami Ely (231 Ngày: 09/03 – 25/10/2026)',
      type: 'area',
      description: 'Doanh số ước tính từ FastMoss qua 8 tháng vận hành (tổng 15,01 tỷ VNĐ, 101.896 sản phẩm; cửa sổ 180 ngày gần nhất đạt 12,74 tỷ VNĐ).',
      xAxisKey: 'month',
      series: [
        { dataKey: 'revenue', name: 'GMV ước tính (Triệu VNĐ)', color: '#9BE7FA' },
        { dataKey: 'orders', name: 'Sản phẩm bán ra (SP)', color: '#FFD14C' }
      ],
      data: [
        { month: 'T3 (23d)', revenue: 950, orders: 8039 },
        { month: 'T4', revenue: 2459, orders: 17358 },
        { month: 'T5', revenue: 2747, orders: 17267 },
        { month: 'T6', revenue: 3772, orders: 22096 },
        { month: 'T7', revenue: 2126, orders: 13358 },
        { month: 'T8', revenue: 637, orders: 6622 },
        { month: 'T9', revenue: 701, orders: 5841 },
        { month: 'T10 (25d)', revenue: 1617, orders: 11315 }
      ]
    },
    {
      id: 'chart-2',
      title: 'Cơ Cấu Doanh Thu Top 10 SKU Chủ Lực Theo Nhóm Hàng (Kami Ely)',
      type: 'bar',
      description: 'Phân bổ GMV giữa nhóm Đồ bơi mùa Hè và Thời trang Thu Đông trong Top 10 SKU đầu bảng (6,09 tỷ VNĐ / 38.037 sản phẩm).',
      xAxisKey: 'category',
      series: [
        { dataKey: 'revenue', name: 'Doanh thu (Triệu VNĐ)', color: '#9BE7FA' }
      ],
      data: [
        { category: 'Bikini / Đồ bơi hè (5 SKU)', revenue: 2465 },
        { category: 'Áo thun Thu Đông (AT06)', revenue: 1580 },
        { category: 'Chân váy chữ A (CV11, CV02)', revenue: 1245 },
        { category: 'Áo gió & Set thể thao (AG01, AQ1)', revenue: 802 }
      ]
    },
    {
      id: 'chart-3',
      title: 'Đóng Góp Doanh Thu Theo Kênh Nội Dung (Chu Kỳ 231 Ngày)',
      type: 'line',
      description: 'Tỷ trọng GMV phân bổ giữa Live chính chủ, Kênh vệ tinh & Affiliate Live, và Video / Kệ hàng.',
      xAxisKey: 'quarter',
      series: [
        { dataKey: 'official', name: 'Live Chính chủ (@shop_official)', color: '#9BE7FA' },
        { dataKey: 'affiliate', name: 'Kênh Vệ tinh & KOC Live', color: '#FFD14C' },
        { dataKey: 'showcase', name: 'Video gắn giỏ & Kệ hàng', color: '#FFE485' }
      ],
      data: [
        { quarter: 'GĐ Khởi động (T3-T4)', official: 1620, affiliate: 640, showcase: 900 },
        { quarter: 'Đỉnh Hè (T5-T7)', official: 4380, affiliate: 1490, showcase: 2430 },
        { quarter: 'Chuyển mùa Thu Đông (T8-T10)', official: 1590, affiliate: 740, showcase: 1220 }
      ]
    }
  ],
  tableData: [
    { id: '1', date: '2026-06-16', channel: 'Chính chủ LIVE (Đỉnh hè)', region: 'Toàn quốc', orders: 1936, revenue: 315050000, status: 'Completed' },
    { id: '2', date: '2026-06-25', channel: 'Tối ưu 45 phiên LIVE', region: 'Toàn quốc', orders: 1320, revenue: 196090000, status: 'Completed' },
    { id: '3', date: '2026-05-13', channel: 'Video gắn giỏ Top 1', region: 'Toàn quốc', orders: 856, revenue: 170160000, status: 'Completed' },
    { id: '4', date: '2026-09-04', channel: 'Đáy giao mùa cuối vụ hè', region: 'Miền Bắc', orders: 49, revenue: 5440000, status: 'Completed' },
    { id: '5', date: '2026-10-18', channel: 'Phục hồi Thu Đông (AT06, CV11)', region: 'Toàn quốc', orders: 940, revenue: 142500000, status: 'Completed' }
  ]
};
