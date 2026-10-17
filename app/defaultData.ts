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
      role: 'Library Bus: Tối ưu Hóa Cơ Sở Dữ Liệu & Vận Hành Logistics',
      company: 'Dự án Hệ thống Thư viện Lưu động',
      period: '2023 - 2024',
      type: 'work',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Thiết kế mô hình cơ sở dữ liệu quan hệ 3NF chịu tải 500 yêu cầu mỗi giây.',
        'Tích hợp Redis cache và Celery giúp giảm 93,7% độ trễ truy vấn, loại bỏ xung đột mượn sách.'
      ]
    }
  ]
};

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 'proj-kami-ely',
    title: 'Tối ưu hóa Phân bổ Nguồn lực Đa kênh: Case Study Thương hiệu Kami Ely',
    titleEn: 'Multi-Channel Resource Allocation: Kami Ely Case Study',
    desc: 'Phân tích dữ liệu 238,4k đơn hàng và 31,6 tỷ đồng GMV từ khi mở shop. Báo cáo so sánh hiệu quả kênh video và livestream. Chuỗi thời gian 180 ngày chỉ rõ điểm bão hòa thời lượng phát sóng.',
    descEn: 'Analyzed 238.4k orders and 31.6B VND in cumulative GMV since store launch. Compared revenue performance between shoppable short videos and livestreams. A 180-day time series models the daily broadcast saturation threshold.',
    tags: ['Data Analytics', 'Statistical Testing', 'Time-Series Analysis', 'Resource Optimization', 'Python', 'Recharts'],
    img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    featured: true,
    problem: 'Kênh Live chiếm phần lớn thời gian nhưng chỉ đạt GPM 30,2k đồng. Ngược lại, video ngắn mang lại GPM 135,2k đồng trên mỗi nghìn lượt xem. Doanh số tháng 8 và 9 sụt giảm, cần tìm nguyên nhân do mùa vụ hay vận hành.',
    problemEn: 'Livestreams consumed most broadcast hours but delivered only 30.2k VND per thousand views. Short videos generated 135.2k VND GPM per thousand views. Late summer revenue dropped, requiring root cause attribution between seasonality and execution.',
    method: 'So sánh kiểm định thống kê giữa 551 video và 470 phiên live. Mô hình hồi quy xác định ngưỡng bão hòa phiên live ở mức 3,1 giờ mỗi ngày. Phân rã chuỗi thời gian 180 ngày thành ba phần: xu hướng, mùa vụ và nhiễu.',
    methodEn: 'Conducted statistical hypothesis tests comparing 551 videos against 470 livestreams. Modeled diminishing marginal returns to pinpoint a 3.1-hour daily saturation threshold. Decomposed the 180-day time series into trend, seasonal, and residual components.',
    insight: 'Video ngắn đạt hiệu quả doanh thu cao gấp 4,48 lần so với live (p < 0,0001). Mùa du lịch hè giải thích 85% mức giảm doanh số sau tháng 7. Shop cần cắt giảm giờ live vượt ngưỡng 3,1 giờ và gắn giỏ hàng vào toàn bộ video.',
    insightEn: 'Shoppable videos generated 4.48 times higher revenue velocity than livestreams (p < 0.0001). Summer vacation seasonality explained 85% of the post-July sales slump. Cutting excess broadcast hours beyond 3.1 hours recovered operational efficiency.',
    metrics: [
      { label: 'Quy Mô Quần Thể Toàn Thời Gian', labelEn: 'All-Time Order Volume', value: '238.4k', change: '31.6 Tỷ VNĐ (Từ 2022)', changeEn: '31.6B VND (Since 2022)', isPositive: true },
      { label: 'Chênh Lệch GPM Video vs Live', labelEn: 'Video vs Live GPM Ratio', value: '4.48x', change: 'Ưu thế bền vững', changeEn: 'Sustainable Advantage', isPositive: true },
      { label: 'Ngưỡng Giờ Live Hiệu Quả', labelEn: 'Optimal Live Threshold', value: '3.1h', change: 'Điểm bão hòa doanh số', changeEn: 'Revenue Saturation Point', isPositive: true },
      { label: 'Chu Kỳ Phân Rã Dữ Liệu', labelEn: 'Time-Series Decomposition', value: '180 Ngày', change: 'Xu hướng & Mùa vụ hè', changeEn: 'Trend & Summer Seasonality', isPositive: true }
    ],
    tools: ['Python (scipy.stats & statsmodels)', 'Statistical Analysis', 'Time-Series Modeling', 'Recharts']
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
    title: 'Library Bus Management System: Tối ưu Vận hành Logistics & Luồng Dữ liệu',
    titleEn: 'Library Bus Management System: Logistics & Architecture',
    desc: 'Thiết kế cơ sở dữ liệu quan hệ và luồng xử lý bất đồng bộ cho thư viện xe buýt. Hệ thống phục vụ hơn 50.000 bạn đọc với khả năng chịu tải 500 yêu cầu mỗi giây.',
    descEn: 'Architected a relational database and asynchronous pipeline for a multi-stop mobile library. The platform supports 50,000 active patrons with 500 concurrent requests per second.',
    tags: ['Database Architecture', 'MySQL', 'Redis', 'Celery', 'Django'],
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80',
    demoUrl: '/library-bus/website.html',
    featured: true,
    content: libraryBusMarkdownContent,
    problem: 'Các trạm xe buýt lưu động thường gặp lỗi lệch số lượng sách giữa các điểm dừng. Nhiều người cùng đặt mượn một cuốn sách gây ra lỗi xung đột giao dịch dữ liệu.',
    problemEn: 'Distributed mobile buses encountered inventory discrepancies across municipal scheduled pickup stops. Simultaneous book hold requests caused database transaction race conditions and booking collisions.',
    method: 'Chuẩn hóa bảng dữ liệu 3NF với các ràng buộc giao dịch ACID để khóa dòng an toàn. Hệ thống sử dụng Redis đệm truy vấn và dùng Celery xử lý tác vụ chạy ngầm.',
    methodEn: 'Normalized relational schemas to 3NF and enforced strict ACID transaction row locks. Implemented Redis caching layers with Celery background workers to offload server CPU.',
    insight: 'Độ trễ truy vấn giảm từ 450ms xuống 28ms, tương đương mức cải thiện 93,7%. Hệ thống vận hành ổn định 500 kết nối đồng thời và ngăn chặn hoàn toàn việc mượn trùng sách.',
    insightEn: 'Query latency dropped from 450ms to 28ms, yielding a 93.7% performance improvement. The system sustained 500 concurrent connections while eliminating double-borrowing errors entirely.',
    metrics: [
      { label: 'Quy Mô Người Dùng Phục Vụ', labelEn: 'Active Patron Base', value: '50,000+', change: 'Active Accounts', changeEn: 'Active Accounts', isPositive: true },
      { label: 'Độ Trễ Phản Hồi Truy Vấn', labelEn: 'Query Response Latency', value: '28ms', change: '-93.7% Latency', changeEn: '-93.7% Latency', isPositive: true },
      { label: 'Kết Nối Đồng Thời (Concurrency)', labelEn: 'System Concurrency', value: '500 RPS', change: 'Zero Downtime', changeEn: 'Zero Downtime', isPositive: true },
      { label: 'Tỷ Lệ Xung Đột Dữ Liệu', labelEn: 'Data Collision Rate', value: '0.0%', change: 'ACID Enforced', changeEn: 'ACID Enforced', isPositive: true }
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
      title: 'Tổng Doanh Thu (GMV)',
      value: '12,74 Tỉ VNĐ',
      change: '12,74 Tỉ VNĐ GMV 180 ngày — TikTok Shop Kami Ely',
      isPositive: true,
      icon: 'dollar'
    },
    {
      id: 'kpi-2',
      title: 'Hiệu Năng Cơ Sở Dữ Liệu',
      value: '28ms',
      change: 'Giảm 93,7% độ trễ truy vấn — SQL Caching',
      isPositive: true,
      icon: 'activity'
    },
    {
      id: 'kpi-3',
      title: 'Mạng Lưới Creators',
      value: '5,700+',
      change: '+18.4% KOC liên kết — Creator Network',
      isPositive: true,
      icon: 'users'
    },
    {
      id: 'kpi-4',
      title: 'Giá Trị Đơn Trung Bình (AOV)',
      value: '268,500 đ',
      change: '+12.1% tăng trưởng — RFM Segmentation',
      isPositive: true,
      icon: 'trending'
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

