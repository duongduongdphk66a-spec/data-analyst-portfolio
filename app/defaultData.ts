import { ProfileData, ProjectData, DashboardData } from './types';
import { libraryBusMarkdownContent } from './data/libraryBusContent';

export const DEFAULT_PROFILE: ProfileData = {
  name: "Ma Văn Hùng",
  subtitle: "Intern Data Analyst | Business Intelligence & Analytics",
  title: "Data Analyst",
  bio: "Data Analyst chuyên phân tích dữ liệu kinh doanh bằng SQL, Python, Power BI và Excel. Chuyên làm sạch dữ liệu đa nguồn, thiết kế dashboard và đo lường chỉ số vận hành.",
  careerGoal: "Thiết kế hệ thống dữ liệu và báo cáo phân tích kinh doanh",
  careerGoalsList: [
    {
      id: 'goal-1',
      title: 'Xây dựng pipeline và chuẩn hóa dữ liệu',
      desc: 'Thiết kế quy trình ETL/ELT và chuẩn hóa dữ liệu đa nguồn vào cơ sở dữ liệu quan hệ.',
      icon: 'list'
    },
    {
      id: 'goal-2',
      title: 'Phát triển dashboard trực quan',
      desc: 'Xây dựng báo cáo tự động trên Power BI và Tableau theo dõi chỉ số hiệu suất.',
      icon: 'cloud'
    },
    {
      id: 'goal-3',
      title: 'Phân tích số liệu và hỗ trợ vận hành',
      desc: 'Định lượng số liệu thực tế nhằm giải quyết bài toán tối ưu chi phí và tăng trưởng.',
      icon: 'network'
    }
  ],
  avatarUrl: "",
  email: "mavanhung.da@gmail.com",
  github: "",
  linkedin: "",
  skills: [
    { id: 'sk-1', name: 'SQL (PostgreSQL / MySQL)', category: 'Languages & Querying', level: 5, icon: 'sql', proficiencyNote: 'Complex Joins, CTEs, Window Functions, Subqueries, Query Optimization', tags: ['Joins', 'CTEs', 'Window Functions', 'Optimization'] },
    { id: 'sk-2', name: 'Python for Analytics', category: 'Languages & Querying', level: 5, icon: 'python', proficiencyNote: 'Pandas, NumPy, Matplotlib, Seaborn, Automated Data Wrangling', tags: ['Pandas', 'NumPy', 'Data Cleaning', 'Automation'] },
    { id: 'sk-3', name: 'Power BI & DAX', category: 'BI & Visualization', level: 5, icon: 'uiux', proficiencyNote: 'Data Modeling (Star Schema), Complex DAX Measures, Executive KPI Dashboards', tags: ['DAX', 'Data Modeling', 'Interactive Dashboards'] },
    { id: 'sk-4', name: 'Advanced Excel & Power Query', category: 'BI & Visualization', level: 5, icon: 'database', proficiencyNote: 'Power Query ETL, Dynamic Arrays, Pivot Tables, Statistical Modeling', tags: ['Power Query', 'Dynamic Arrays', 'Financial Analysis'] },
    { id: 'sk-5', name: 'Thống kê & Phân tích Khám phá (EDA)', category: 'Statistical & Modeling', level: 4, icon: 'ml', proficiencyNote: 'Hypothesis Testing, Time-series Forecasting, Customer Segmentation (RFM)', tags: ['EDA', 'Time-series', 'RFM Segmentation', 'A/B Testing'] },
    { id: 'sk-6', name: 'Database Architecture & ETL', category: 'Data Engineering', level: 4, icon: 'devops', proficiencyNote: 'Relational Schema Design (ERD), Transaction ACID, Redis Cache, Data Pipelines', tags: ['ERD Design', 'PostgreSQL', 'Redis', 'ETL Pipelines'] },
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
        'Thực hiện niên luận: "Sự phát triển của Du lịch Di sản tại Nhật Bản từ 2013 đến nay" (GVHD: TS Võ Minh Vũ).'
      ]
    },
    {
      id: 'exp-work-1',
      role: 'Công trình Nghiên cứu Khoa học: Phân tích Du lịch Di sản tại Nhật Bản',
      company: 'Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQGHN',
      period: '2023 - 2024',
      type: 'work',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Thu thập và làm sạch 6 bộ dữ liệu chuỗi thời gian 20 năm từ MLIT và JNTO.',
        'Mô hình hóa số liệu đo lường mức đóng góp GDP 7,5% và việc làm cho hơn 4 triệu lao động.'
      ]
    },
    {
      id: 'exp-work-2',
      role: 'Steve x Kami Company: Hỗ trợ Vận hành & Phân tích Dữ liệu E-Commerce',
      company: 'Steve x Kami Company',
      period: '2022 - 2023',
      type: 'work',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Xây dựng báo cáo theo dõi GMV, tỷ lệ chuyển đổi đơn và tỷ lệ hoàn hàng trên TikTok Shop.',
        'Phân tích hiệu quả kênh tự vận hành so với mạng lưới hơn 1.000 creator affiliate.'
      ]
    },
    {
      id: 'exp-work-3',
      role: 'Library Bus: Thiết kế UX/UI Website Thư Viện Lưu Động',
      company: 'Dự án Website Xe Thư Viện Lưu Động',
      period: '2023 - 2024',
      type: 'work',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Nghiên cứu nhu cầu độc giả, xây dựng sitemap và luồng người dùng cho dịch vụ xe thư viện lưu động.',
        'Thiết kế hệ thống lưới 12 cột, bộ thành phần giao diện và wireframe/UI cho 20 màn hình desktop kèm bản mobile.'
      ]
    }
  ]
};

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 'proj-kami-ely',
    title: 'Kami Ely: Phân tích hiệu suất TikTok Shop và mạng lưới Affiliate',
    titleEn: 'Kami Ely: TikTok Shop & Affiliate Network Analytics',
    desc: 'Phân tích 231 ngày vận hành (15,01 tỷ đồng GMV ước tính, 101.896 sản phẩm) từ dữ liệu FastMoss. Bóc tách động lực doanh thu giữa Live chính chủ, kênh vệ tinh, mạng lưới KOC và chuyển dịch danh mục mùa vụ.',
    descEn: 'Analyzed 231 operating days (15.01B VND estimated GMV, 101,896 units) from FastMoss telemetry. Evaluated revenue drivers across official livestreams, in-house satellite channel, affiliate KOC cohorts, and seasonal SKU transitions.',
    tags: ['E-Commerce Analytics', 'Time-Series & OLS', 'Cohort & HHI', 'Statistical Testing', 'SQL & Python', 'Recharts'],
    img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    featured: true,
    problem: 'Doanh thu tháng 8 giảm 83,1% so với đỉnh tháng 6 khi qua cao điểm đồ bơi hè. Gian hàng cần xác định mức độ phụ thuộc vào từng kênh nội dung, sức bền mạng lưới KOC và danh mục sản phẩm thay thế cho mùa Thu Đông.',
    problemEn: 'August revenue fell 83.1% from the June peak after summer swimwear demand subsided. Needed to quantify channel concentration, KOC retention decay, and autumn-winter SKU transition performance.',
    method: 'Chuẩn hóa 9 bảng dữ liệu ước tính FastMoss (231 ngày), kiểm chứng độ nhạy trung bình trượt khi Winsorize ngoại lai, chạy hồi quy OLS đa biến, đo chỉ số tập trung HHI và kiểm định phi tham số Mann-Whitney U cho video quảng cáo.',
    methodEn: 'Standardized 9 FastMoss telemetry tables (231 days), tested moving-average crossover sensitivity under outlier Winsorization, fitted daily OLS regression, computed HHI concentration, and ran Mann-Whitney U tests on video ads.',
    insight: 'Live chính chủ và kênh vệ tinh tạo ra 84,5% doanh thu livestream, trong khi 12/339 SKU đóng góp 80,6% GMV kỳ gần nhất. Chuyển dịch sang dòng Áo thu và Chân váy cùng nhóm KOC mới giúp doanh thu tháng 10 phục hồi gấp 2,3 lần đáy tháng 8.',
    insightEn: 'Official and satellite livestreams generated 84.5% of live GMV, while 12/339 SKUs drove 80.6% of recent catalog sales. Pivoting to autumn tops and skirts with new KOC cohorts lifted October daily sales 2.3x above the August trough.',
    metrics: [
      { label: 'GMV ước tính (231 ngày)', labelEn: 'Estimated GMV (231 Days)', value: '15,01 Tỷ', change: '101.896 sản phẩm bán ra', changeEn: '101,896 units sold', isPositive: true },
      { label: 'Giá bán TB thực tế (ASP)', labelEn: 'Average Selling Price (ASP)', value: '147,3k đ', change: 'Dải 75k-250k chiếm 93% GMV', changeEn: '75k-250k band = 93% GMV', isPositive: true },
      { label: 'Thị phần Live in-house', labelEn: 'In-House Live Share', value: '84,5%', change: 'Chính chủ + Kênh vệ tinh', changeEn: 'Official + Satellite Live', isPositive: true },
      { label: 'Mức tập trung HHI KOC', labelEn: 'Affiliate Live HHI', value: '2.152', change: 'Giảm từ 3.230 nhờ KOC Thu Đông', changeEn: 'Down from 3,230 in autumn', isPositive: true }
    ],
    tools: ['Python (scipy & numpy)', 'SQL Data Pipeline', 'OLS & Non-parametric Tests', 'Recharts']
  },
  {
    id: 'proj-heritage-japan',
    title: 'Sự phát triển của Du lịch Di sản tại Nhật Bản: Phân tích Chuỗi Thời gian',
    titleEn: 'Heritage Tourism Growth in Japan: A Time-Series Analysis',
    desc: 'Phân tích số liệu du khách quốc tế và mức chi tiêu tại Nhật Bản từ năm 2013. Báo cáo đánh giá chính sách mở cửa và đo lường tốc độ phục hồi của các điểm di sản.',
    descEn: 'Analyzed international visitor inflows and average tourist spending in Japan since 2013. Evaluated national inbound policies and measured post-disruption recovery across regional heritage destinations.',
    tags: ['Time-Series Analysis', 'Data Extraction', 'Storytelling', 'Recharts'],
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    featured: true,
    problem: 'Cần đo lường mức độ phục hồi của các điểm di sản Kyoto và Nara sau biến động. Nghiên cứu đánh giá định lượng tác động của chính sách mở cửa đến mức chi tiêu thực tế.',
    problemEn: 'Needed to quantify post-pandemic recovery speeds for traditional cultural centers like Kyoto and Nara. Evaluated inbound border reopening impacts against actual inbound tourist spending patterns.',
    method: 'Thu thập và chuẩn hóa dữ liệu từ Cơ quan Xúc tiến Du lịch Nhật Bản. Áp dụng mô hình chuỗi thời gian 20 năm để theo dõi lượng khách và mức chi tiêu.',
    methodEn: 'Extracted and standardized 20-year official records from the Japan National Tourism Organization. Applied time-series econometric modeling to evaluate visitor volume and regional spending disparities.',
    insight: 'Tổng chi tiêu du lịch chạm mức 4,81 nghìn tỷ Yên trong giai đoạn tăng trưởng cao. Khách tham quan di sản chi tiêu cao gấp 3,2 lần so với du khách thông thường. Tỷ lệ phục hồi dự báo đạt 88,4% tại các trung tâm văn hóa truyền thống.',
    insightEn: 'Total tourist expenditure reached 4.81 trillion Yen, growing 318% during peak expansion. Cultural heritage travelers spent 3.2 times more per trip than general tourists. Post-pandemic recovery reached a projected 88.4% across traditional destination centers.',
    metrics: [
      { label: 'Dữ Liệu Chuỗi Thời Gian', labelEn: 'Time-Series Horizon', value: '20 Năm', change: '2003 - 2022', changeEn: '2003 - 2022', isPositive: true },
      { label: 'Lượng Khách Đạt Đỉnh', labelEn: 'Peak Annual Visitors', value: '31.9 Triệu', change: 'Năm 2019', changeEn: 'Recorded in 2019', isPositive: true },
      { label: 'Tổng Chi Tiêu Đỉnh Điểm', labelEn: 'Peak Tourism Expenditure', value: '4.81T Yên', change: '+318% vs 2010', changeEn: '+318% vs 2010', isPositive: true },
      { label: 'Tỷ Lệ Phục Hồi Dự Báo', labelEn: 'Projected Recovery Rate', value: '88.4%', change: 'Hậu đại dịch', changeEn: 'Post-Pandemic Target', isPositive: true }
    ],
    tools: ['Python', 'Time-Series Modeling', 'Recharts', 'SQL', 'Data Storytelling']
  },
  {
    id: 'proj-library-bus',
    title: 'Library Bus: Thiết kế UX/UI Website Thư Viện Lưu Động',
    titleEn: 'Library Bus: UX/UI Design for a Mobile Library Website',
    desc: 'Dự án thiết kế UX/UI cho website xe thư viện lưu động: nghiên cứu, logo và thành phần giao diện, hệ thống lưới, wireframe và UI design cho 20 màn hình desktop kèm bản mobile.',
    descEn: 'A UX/UI design project for a mobile library website: research, logo and UI components, grid system, wireframes and UI design for 20 desktop screens plus mobile versions.',
    tags: ['UX/UI Design', 'Wireframe', 'Design System', 'Responsive'],
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80',
    demoUrl: '/library-bus/website.html',
    featured: true,
    content: libraryBusMarkdownContent,
    problem: 'Thư viện cố định khó tiếp cận với người ở xa hoặc ít thời gian. Dịch vụ xe thư viện lưu động cần một website cho người đọc biết sách nào còn, xe đang ở đâu và đặt mượn trước.',
    problemEn: 'A fixed library is hard to reach for people who live far away or have little time. A mobile library service needs a website where readers see which books are available, where the bus is and reserve in advance.',
    method: 'Đi theo cấu trúc hướng dẫn thiết kế website: nghiên cứu và sitemap, logo cùng bộ thành phần giao diện, rồi lưới, wireframe và UI design cho từng màn hình.',
    methodEn: 'Followed a website guidelines structure: research and sitemap, logo with a set of UI components, then grid, wireframes and UI design for each screen.',
    insight: 'Mỗi màn hình có cặp wireframe và UI design để đối chiếu bố cục. Dữ liệu hiển thị trong giao diện là dữ liệu mẫu.',
    insightEn: 'Every screen has a wireframe and UI design pair to compare layouts. The data shown in the interface is sample data.',
    metrics: [
      { label: 'Màn Hình Desktop', labelEn: 'Desktop Screens', value: '20', change: 'Wireframe + UI', changeEn: 'Wireframe + UI', isPositive: true },
      { label: 'Bản Mobile', labelEn: 'Mobile Versions', value: '20', change: 'Wireframe + UI', changeEn: 'Wireframe + UI', isPositive: true },
      { label: 'Bảng Màu', labelEn: 'Color Palette', value: '6 tông', change: 'Molasses đến Butter', changeEn: 'Molasses to Butter', isPositive: true },
      { label: 'Phông Chữ', labelEn: 'Typefaces', value: '2', change: 'Lora + Outfit', changeEn: 'Lora + Outfit', isPositive: true }
    ],
    tools: ['UX Research', 'Wireframe', 'Design System', 'UI Design']
  }
];

export const DEFAULT_DASHBOARD: DashboardData = {
  title: "Executive Business Analytics Dashboard",
  description: "Trực quan hóa thời gian thực các chỉ số kinh doanh chủ chốt, xu hướng tăng trưởng và phân bổ phân khúc sản phẩm.",
  kpis: [
    {
      id: 'kpi-1',
      title: 'Tổng Doanh Thu (GMV)',
      value: '12,74 Tỉ VNĐ',
      change: '12,74 Tỉ VNĐ GMV 180 ngày (TikTok Shop Kami Ely)',
      isPositive: true,
      icon: 'dollar'
    },
    {
      id: 'kpi-2',
      title: 'Dữ Liệu Chuỗi Thời Gian JNTO',
      value: '20 Năm',
      change: '2003 - 2022 Chuỗi số liệu Du lịch Di sản',
      isPositive: true,
      icon: 'activity'
    },
    {
      id: 'kpi-3',
      title: 'Mạng Lưới Creators',
      value: '5,700+',
      change: '+18.4% KOC liên kết (Creator Network)',
      isPositive: true,
      icon: 'users'
    },
    {
      id: 'kpi-4',
      title: 'Giá Trị Đơn Trung Bình (AOV)',
      value: '268,500 đ',
      change: '+12.1% tăng trưởng (RFM Segmentation)',
      isPositive: true,
      icon: 'trending'
    }
  ],
  charts: [
    {
      id: 'chart-1',
      title: 'Xu Hướng Doanh Thu TikTok Shop Kami Ely (180 Ngày)',
      type: 'area',
      description: 'Doanh số thực tế ghi nhận qua 6 tháng vận hành kênh E-Commerce.',
      xAxisKey: 'month',
      series: [
        { dataKey: 'revenue', name: 'GMV (Triệu VNĐ)', color: '#9BE7FA' },
        { dataKey: 'profit', name: 'Thực nhận (Triệu VNĐ)', color: '#FFD14C' }
      ],
      data: [
        { month: 'T3', revenue: 1350, profit: 940, orders: 12200 },
        { month: 'T4', revenue: 1920, profit: 1340, orders: 15400 },
        { month: 'T5', revenue: 2840, profit: 1980, orders: 21900 },
        { month: 'T6', revenue: 3450, profit: 2410, orders: 26800 },
        { month: 'T7', revenue: 2120, profit: 1480, orders: 16400 },
        { month: 'T8', revenue: 1055, profit: 735, orders: 8800 }
      ]
    },
    {
      id: 'chart-2',
      title: 'Cơ Cấu Doanh Thu Theo Danh Mục Sản Phẩm (Kami Ely)',
      type: 'bar',
      description: 'Phân bổ doanh số đóng góp từ các dòng sản phẩm thời trang thể thao.',
      xAxisKey: 'category',
      series: [
        { dataKey: 'revenue', name: 'Doanh thu (Triệu VNĐ)', color: '#9BE7FA' }
      ],
      data: [
        { category: 'Áo thun thể thao', revenue: 4850 },
        { category: 'Quần tập jogger/legging', revenue: 3920 },
        { category: 'Set đồ tập gym & yoga', revenue: 2480 },
        { category: 'Phụ kiện thể thao', revenue: 1485 }
      ]
    },
    {
      id: 'chart-3',
      title: 'Đóng Góp Doanh Thu Theo Kênh Phân Phối',
      type: 'line',
      description: 'Tỷ trọng GMV phân bổ giữa Kênh chính chủ, KOC Affiliate và Kệ hàng.',
      xAxisKey: 'quarter',
      series: [
        { dataKey: 'official', name: 'Chính chủ @kamielyhn', color: '#9BE7FA' },
        { dataKey: 'affiliate', name: 'Creator Affiliate', color: '#FFD14C' },
        { dataKey: 'showcase', name: 'Kệ hàng / Product Card', color: '#FFE485' }
      ],
      data: [
        { quarter: 'Tháng 1-2', official: 1480, affiliate: 850, showcase: 690 },
        { quarter: 'Tháng 3-4', official: 2350, affiliate: 1320, showcase: 1090 },
        { quarter: 'Tháng 5-6', official: 3030, affiliate: 1710, showcase: 1400 }
      ]
    }
  ],
  tableData: [
    { id: '1', date: '2024-06-16', channel: 'Chính chủ LIVE', region: 'Hà Nội', orders: 1850, revenue: 315000000, status: 'Completed' },
    { id: '2', date: '2024-06-25', channel: 'Video gắn giỏ', region: 'Toàn quốc', orders: 1420, revenue: 192000000, status: 'Completed' },
    { id: '3', date: '2024-07-02', channel: 'Top KOC @girlstyle', region: 'Hồ Chí Minh', orders: 980, revenue: 135000000, status: 'Completed' },
    { id: '4', date: '2024-07-15', channel: 'Kệ hàng tự nhiên', region: 'Đà Nẵng', orders: 620, revenue: 84000000, status: 'Completed' },
    { id: '5', date: '2024-08-01', channel: 'Creator Affiliate', region: 'Toàn quốc', orders: 890, revenue: 118000000, status: 'Completed' }
  ]
};

