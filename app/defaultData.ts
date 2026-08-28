import { ProfileData, ProjectData, DashboardData } from './types';
import { libraryBusMarkdownContent } from './data/libraryBusContent';

export const DEFAULT_PROFILE: ProfileData = {
  name: "Ma Văn Hùng",
  subtitle: "Intern Data Analyst | Business Intelligence & Analytics",
  title: "Data Analyst",
  bio: "Ma Văn Hùng là Data Analyst với nền tảng vững chắc về SQL, Python, Power BI và Excel nâng cao. Tập trung vào việc khai phá dữ liệu phân mảnh, thiết kế mô hình trực quan hóa và chuyển đổi số liệu thô thành các insight chiến lược hỗ trợ tối ưu hóa quy trình ra quyết định kinh doanh.",
  careerGoal: "Xây dựng Hệ thống Dữ liệu Vững chắc & Trực quan hóa Insight Chiến lược",
  careerGoalsList: [
    {
      id: 'goal-1',
      title: 'Tối ưu hóa Data Pipeline & Chuẩn hóa Dữ liệu',
      desc: 'Thiết kế quy trình ETL/ELT sạch, làm chủ cơ sở dữ liệu quan hệ và chuẩn hóa dữ liệu đa nguồn phục vụ phân tích tự động.',
      icon: 'list'
    },
    {
      id: 'goal-2',
      title: 'Xây dựng Dashboard & Mô hình Phân tích Nâng cao',
      desc: 'Phát triển báo cáo trực quan hóa theo thời gian thực trên Power BI/Tableau, áp dụng mô hình phân khúc và dự báo chuỗi thời gian.',
      icon: 'cloud'
    },
    {
      id: 'goal-3',
      title: 'Data Storytelling & Tối ưu Quyết định Kinh doanh',
      desc: 'Truyền tải các insight kỹ thuật phức tạp thành câu chuyện dữ liệu rõ ràng, hỗ trợ các nhà quản trị đưa ra quyết định tăng trưởng.',
      icon: 'network'
    }
  ],
  avatarUrl: "",
  email: "mavanhung.da@gmail.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
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
        'Chuyên sâu nghiên cứu kinh tế - xã hội Nhật Bản, phương pháp phân tích định lượng và xử lý dữ liệu nghiên cứu khoa học.',
        'Hoàn thành xuất sắc Niên luận Nghiên cứu định lượng: "Sự phát triển của Du lịch Di sản tại Nhật Bản giai đoạn từ năm 2013 đến nay" (GVHD: TS Võ Minh Vũ).'
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
        'Thu thập, trích xuất và chuẩn hóa 6 bộ dữ liệu chuỗi thời gian 20 năm từ MLIT, JNTO, Sở Du lịch Kyoto và Nara.',
        'Ứng dụng các mô hình trực quan hóa số liệu định lượng, phân tích tỷ trọng đóng góp GDP (7.5%), việc làm (4M+) và đánh giá 5 chính sách giải quyết quá tải du lịch.'
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
        'Xây dựng các báo cáo định kỳ theo dõi GMV, tỷ lệ chuyển đổi đơn hàng và chỉ số hoàn hàng trên sàn TikTok Shop.',
        'Phân tích ma trận hiệu quả giữa kênh tự vận hành và mạng lưới 1,000+ creator affiliates nhằm tối ưu hóa chi phí hoa hồng.'
      ]
    }
  ]
};

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 'proj-kami-ely',
    title: 'Kami Ely: Báo cáo Phân tích Hiệu suất TikTok Shop & Mạng lưới Affiliate',
    desc: 'Phân tích tổng hợp hiệu suất bán hàng, cơ cấu kênh doanh thu và mạng lưới 1,000+ nhà sáng tạo affiliate trên TikTok Shop cho ngành hàng Sports & Outdoor.',
    tags: ['TikTok Shop', 'Data Analytics', 'Python', 'Power BI', 'Recharts'],
    img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    featured: true,
    problem: 'Doanh nghiệp gặp khó khăn trong việc đánh giá hiệu quả chi phí giữa kênh tự vận hành (Live/Video) và mạng lưới Creator Affiliates, dẫn đến phân bổ hoa hồng chưa tối ưu.',
    method: 'Trích xuất và làm sạch dữ liệu giao dịch 15 đợt bán hàng, phân nhóm Creators theo tệp followers (>100k, 50k-100k, 10k-50k, 1k-5k, <=1k), tính toán GMV trung bình trên mỗi creator.',
    insight: 'Nhóm Nano-creator (1k-5k followers) tạo ra hơn 527 lượt cộng tác và đóng góp 3.3 tỷ VNĐ GMV (chiếm 38.6% tổng GMV affiliate), có chi phí chuyển đổi tối ưu hơn 40% so với nhóm Mega-creator.',
    metrics: [
      { label: 'Tổng Doanh Thu Phân Tích', value: '8.5 Tỷ VNĐ', change: '+34% MoM', isPositive: true },
      { label: 'Số Lượng Affiliate Creators', value: '1,087+', change: '527 Nano-KOC', isPositive: true },
      { label: 'Kênh Đóng Góp GMV Cao Nhất', value: 'Live Shopping', change: '63.04% GMV', isPositive: true },
      { label: 'Tối Ưu Chi Phí Hoa Hồng', value: '-32%', change: 'Tiết kiệm ngân sách', isPositive: true }
    ],
    tools: ['Python (Pandas)', 'Power BI', 'Recharts', 'SQL', 'Excel']
  },
  {
    id: 'proj-heritage-japan',
    title: 'Sự phát triển của Du lịch Di sản tại Nhật Bản: Phân tích Chuỗi Thời gian',
    desc: 'Phân tích chuỗi số liệu khách du lịch quốc tế, mức chi tiêu bình quân và chính sách bảo tồn di sản Nhật Bản giai đoạn 2013 đến nay bằng mô hình trực quan hóa.',
    tags: ['Time-Series Analysis', 'Data Extraction', 'Storytelling', 'Recharts'],
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    featured: true,
    problem: 'Cần đánh giá định lượng tác động của chiến lược mở cửa du lịch di sản quốc gia và đo lường tốc độ phục hồi của các điểm đến văn hóa truyền thống (Kyoto, Nara) sau biến động.',
    method: 'Thu thập và chuẩn hóa dữ liệu từ Cơ quan Xúc tiến Du lịch Nhật Bản (JNTO), áp dụng mô hình chuỗi thời gian (Time-series) và trực quan hóa so sánh đa chiều.',
    insight: 'Chi tiêu du lịch đạt đỉnh 4.81 nghìn tỷ Yên với tốc độ tăng trưởng 318% giai đoạn hoàng kim. Nhóm khách trải nghiệm văn hóa có mức chi tiêu bình quân cao gấp 3.2 lần so với du lịch thông thường.',
    metrics: [
      { label: 'Dữ Liệu Chuỗi Thời Gian', value: '20 Năm', change: '2003 - 2022', isPositive: true },
      { label: 'Lượng Khách Đạt Đỉnh', value: '31.9 Triệu', change: 'Năm 2019', isPositive: true },
      { label: 'Tổng Chi Tiêu Đỉnh Điểm', value: '4.81T Yên', change: '+318% vs 2010', isPositive: true },
      { label: 'Tỷ Lệ Phục Hồi Dự Báo', value: '88.4%', change: 'Hậu đại dịch', isPositive: true }
    ],
    tools: ['Python', 'Time-Series Modeling', 'Recharts', 'SQL', 'Data Storytelling']
  },
  {
    id: 'proj-library-bus',
    title: 'Library Bus Management System: Tối ưu Vận hành Logistics & Luồng Dữ liệu',
    desc: 'Thiết kế kiến trúc cơ sở dữ liệu quan hệ và luồng xử lý bất đồng bộ cho hệ thống thư viện lưu động đa điểm, phục vụ 50,000 người dùng với độ trễ thấp.',
    tags: ['Database Architecture', 'MySQL', 'Redis', 'Celery', 'Django'],
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80',
    demoUrl: '/website.pdf',
    featured: true,
    content: libraryBusMarkdownContent,
    problem: 'Hệ thống thư viện di động phân tán gặp vấn đề về dữ liệu tồn kho không đồng bộ, xung đột giao dịch khi nhiều người cùng đặt một đầu sách tại các điểm dừng xe.',
    method: 'Thiết kế ERD chuẩn hóa 3NF với các ràng buộc Transaction ACID nghiêm ngặt, áp dụng Redis Cache phân tán và Celery Background Worker giải phóng tải CPU máy chủ.',
    insight: 'Giảm 93.7% độ trễ phản hồi (từ 450ms xuống 28ms), chịu tải ổn định 500 kết nối đồng thời và triệt tiêu hoàn toàn 100% lỗi xung đột mượn trùng sách.',
    metrics: [
      { label: 'Quy Mô Người Dùng Phục Vụ', value: '50,000+', change: 'Active Accounts', isPositive: true },
      { label: 'Độ Trễ Phản Hồi Truy Vấn', value: '28ms', change: '-93.7% Latency', isPositive: true },
      { label: 'Kết Nối Đồng Thời (Concurrency)', value: '500 RPS', change: 'Zero Downtime', isPositive: true },
      { label: 'Tỷ Lệ Xung Đột Dữ Liệu', value: '0.0%', change: 'ACID Enforced', isPositive: true }
    ],
    tools: ['MySQL', 'Django ORM', 'Redis', 'Celery', 'Docker Architecture']
  }
];

export const DEFAULT_DASHBOARD: DashboardData = {
  title: "Executive Business Analytics Dashboard",
  description: "Trực quan hóa thời gian thực các chỉ số kinh doanh chủ chốt, xu hướng tăng trưởng và phân bổ phân khúc sản phẩm.",
  kpis: [
    {
      id: 'kpi-1',
      title: 'Tổng Doanh Thu (YTD)',
      value: '$845,200',
      change: '+18.4% so với cùng kỳ',
      isPositive: true,
      icon: 'dollar'
    },
    {
      id: 'kpi-2',
      title: 'Tổng Khách Hàng Hoạt Động',
      value: '24,850',
      change: '+12.1% tăng trưởng',
      isPositive: true,
      icon: 'users'
    },
    {
      id: 'kpi-3',
      title: 'Giá Trị Đơn Trung Bình (AOV)',
      value: '$34.01',
      change: '+5.6% cải thiện',
      isPositive: true,
      icon: 'trending'
    },
    {
      id: 'kpi-4',
      title: 'Tỷ Lệ Chuyển Đổi (CVR)',
      value: '3.82%',
      change: '+0.4% tháng này',
      isPositive: true,
      icon: 'activity'
    }
  ],
  charts: [
    {
      id: 'chart-1',
      title: 'Xu Hướng Doanh Thu & Lợi Nhuận Theo Tháng',
      type: 'area',
      description: 'So sánh tốc độ tăng trưởng doanh thu so với lợi nhuận ròng qua các tháng trong năm.',
      xAxisKey: 'month',
      series: [
        { dataKey: 'revenue', name: 'Doanh thu ($)', color: '#9BE7FA' },
        { dataKey: 'profit', name: 'Lợi nhuận ($)', color: '#FFD14C' }
      ],
      data: [
        { month: 'T1', revenue: 48000, profit: 16000, orders: 1200 },
        { month: 'T2', revenue: 52000, profit: 18500, orders: 1350 },
        { month: 'T3', revenue: 61000, profit: 22000, orders: 1580 },
        { month: 'T4', revenue: 58000, profit: 19800, orders: 1420 },
        { month: 'T5', revenue: 74000, profit: 27500, orders: 1890 },
        { month: 'T6', revenue: 82000, profit: 31000, orders: 2100 },
        { month: 'T7', revenue: 79000, profit: 29500, orders: 1980 },
        { month: 'T8', revenue: 93000, profit: 36000, orders: 2450 },
        { month: 'T9', revenue: 88000, profit: 33500, orders: 2250 },
        { month: 'T10', revenue: 104000, profit: 41000, orders: 2700 },
        { month: 'T11', revenue: 118000, profit: 46500, orders: 3050 },
        { month: 'T12', revenue: 132000, profit: 53000, orders: 3400 }
      ]
    },
    {
      id: 'chart-2',
      title: 'Cơ Cấu Doanh Thu Theo Danh Mục Sản Phẩm',
      type: 'bar',
      description: 'Phân bổ doanh số đóng góp từ từng ngành hàng chính.',
      xAxisKey: 'category',
      series: [
        { dataKey: 'revenue', name: 'Doanh thu ($)', color: '#9BE7FA' }
      ],
      data: [
        { category: 'Enterprise Software', revenue: 340000 },
        { category: 'Cloud Infrastructure', revenue: 260000 },
        { category: 'Data Consulting', revenue: 145000 },
        { category: 'AI & Automation APIs', revenue: 100200 }
      ]
    },
    {
      id: 'chart-3',
      title: 'Tăng Trưởng Khách Hàng Theo Kênh Marketing',
      type: 'line',
      description: 'Số lượng người dùng mới được thu hút qua Organic Search, Paid Ads và Referral.',
      xAxisKey: 'quarter',
      series: [
        { dataKey: 'organic', name: 'Organic Search', color: '#9BE7FA' },
        { dataKey: 'paid', name: 'Paid Ads', color: '#FFD14C' },
        { dataKey: 'referral', name: 'Referrals', color: '#FFE485' }
      ],
      data: [
        { quarter: 'Q1', organic: 3200, paid: 2800, referral: 1100 },
        { quarter: 'Q2', organic: 4100, paid: 3400, referral: 1450 },
        { quarter: 'Q3', organic: 5600, paid: 3900, referral: 1900 },
        { quarter: 'Q4', organic: 7200, paid: 4500, referral: 2600 }
      ]
    }
  ],
  tableData: [
    { id: '1', date: '2024-12-01', channel: 'Direct', region: 'APAC', orders: 450, revenue: 18500, status: 'Completed' },
    { id: '2', date: '2024-12-02', channel: 'Organic', region: 'North America', orders: 620, revenue: 25400, status: 'Completed' },
    { id: '3', date: '2024-12-03', channel: 'Paid Ads', region: 'EMEA', orders: 380, revenue: 14900, status: 'Completed' },
    { id: '4', date: '2024-12-04', channel: 'Referral', region: 'APAC', orders: 510, revenue: 21200, status: 'Completed' },
    { id: '5', date: '2024-12-05', channel: 'Email Campaign', region: 'Global', orders: 490, revenue: 19800, status: 'Completed' }
  ]
};

