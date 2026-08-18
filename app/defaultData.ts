import { ProfileData, ProjectData, DashboardData } from './types';
import { libraryBusMarkdownContent } from './data/libraryBusContent';

export const DEFAULT_PROFILE: ProfileData = {
  name: "Nguyễn Văn A",
  title: "Senior Data Analyst & BI Specialist",
  bio: "Tôi là một Data Analyst với niềm đam mê sâu sắc trong việc biến dữ liệu thô thành câu chuyện chiến lược có giá trị cho doanh nghiệp. Chuyên môn của tôi tập trung vào SQL nâng cao, Python cho phân tích và trực quan hóa dữ liệu, cùng với việc thiết kế các hệ thống Dashboard tương tác trực quan cao cấp.",
  careerGoal: "Mục tiêu trở thành Lead Data Analyst / Analytics Engineer, kiến tạo các data pipeline tự động, phát triển mô hình phân tích dự báo (Predictive Analytics) và giúp doanh nghiệp ra quyết định hoàn toàn dựa trên dữ liệu (Data-Driven Decision Making).",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  email: "analyst@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  skills: [
    { id: 'sk-1', name: 'SQL (PostgreSQL / BigQuery)', category: 'Languages' },
    { id: 'sk-2', name: 'Python (Pandas, NumPy, Scikit-learn)', category: 'Languages' },
    { id: 'sk-3', name: 'R Programming', category: 'Languages' },
    { id: 'sk-4', name: 'Power BI & DAX', category: 'Tools' },
    { id: 'sk-5', name: 'Tableau Desktop', category: 'Tools' },
    { id: 'sk-6', name: 'Apache Airflow (ETL)', category: 'Frameworks' },
    { id: 'sk-7', name: 'Streamlit & Plotly', category: 'Frameworks' },
    { id: 'sk-8', name: 'A/B Testing & Hypothesis Testing', category: 'Core Skills' },
    { id: 'sk-9', name: 'Cohort & RFM Customer Segmentation', category: 'Core Skills' },
    { id: 'sk-10', name: 'Time-series Forecasting (Prophet)', category: 'Core Skills' }
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Senior Data Analyst',
      company: 'FinTech Innovation Corp',
      period: '2022 - Hiện tại',
      type: 'work',
      description: [
        'Xây dựng Data Warehouse và mô hình hóa dữ liệu (Data Modeling) phục vụ phân tích hành vi khách hàng với hơn 2 triệu giao dịch/tháng.',
        'Thiết kế và chuẩn hóa 15+ Executive Dashboard trên Power BI, giúp ban lãnh đạo cắt giảm 35% thời gian tổng hợp báo cáo thủ công.',
        'Thực hiện phân tích Cohort Retention và tối ưu hóa phễu thanh toán (Checkout Funnel), giúp tăng tỷ lệ chuyển đổi thêm 12.8%.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Data Analyst & BI Developer',
      company: 'Retail Group APAC',
      period: '2020 - 2022',
      type: 'work',
      description: [
        'Lập trình các Data Pipeline tự động hóa bằng Python & Airflow để trích xuất dữ liệu từ các sàn thương mại điện tử và ERP.',
        'Phân khúc khách hàng theo thuật toán RFM (Recency, Frequency, Monetary) kết hợp K-Means Clustering, cá nhân hóa chiến dịch Marketing.',
        'Chịu trách nhiệm trực quan hóa dữ liệu và thuyết trình báo cáo doanh thu định kỳ hàng tuần cho Giám đốc kinh doanh.'
      ]
    },
    {
      id: 'exp-3',
      role: 'Cử nhân Hệ thống Thông tin & Khoa học Dữ liệu',
      company: 'Đại học Quốc gia',
      period: '2016 - 2020',
      type: 'education',
      description: [
        'Tốt nghiệp loại Xuất sắc (GPA: 3.75/4.0).',
        'Đề tài khóa luận: "Ứng dụng Machine Learning trong dự báo nhu cầu tồn kho chuỗi bán lẻ".'
      ]
    }
  ]
};

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 'proj-library-bus',
    title: 'Library Bus Management System',
    desc: 'Hệ thống quản lý mượn/trả sách lưu động tích hợp IoT GPS tracking và thanh toán phạt tự động.',
    tags: ['Django', 'Celery', 'Redis', 'MySQL', 'Docker', 'Tailwind CSS'],
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80',
    demoUrl: '/website.pdf',
    content: libraryBusMarkdownContent,
  },
  {
    id: 'proj-1',
    title: 'Customer Segmentation & RFM Analytics',
    desc: 'Phân tích phân khúc 50,000 khách hàng E-commerce bằng phương pháp RFM và thuật toán K-Means Clustering. Giúp Marketing tối ưu chi phí chuyển đổi và tăng 18% tỷ lệ quay lại.',
    tags: ['Python', 'Scikit-Learn', 'RFM', 'Seaborn', 'PostgreSQL'],
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    demoUrl: 'https://streamlit.io',
    githubUrl: 'https://github.com',
    featured: true
  },
  {
    id: 'proj-2',
    title: 'Executive Sales & Revenue Forecast Dashboard',
    desc: 'Dashboard phân tích doanh thu đa kênh kết hợp mô hình dự báo chuỗi thời gian Facebook Prophet. Cho phép lọc theo vùng miền, danh mục sản phẩm và xuất báo cáo tự động.',
    tags: ['Streamlit', 'Prophet', 'Plotly', 'Pandas'],
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    demoUrl: 'https://streamlit.io',
    githubUrl: 'https://github.com',
    embedUrl: '',
    featured: true
  },
  {
    id: 'proj-3',
    title: 'End-to-End Automated Data Pipeline (ETL)',
    desc: 'Hệ thống tự động hóa thu thập dữ liệu từ REST API, làm sạch dữ liệu, kiểm tra Data Quality (Great Expectations) và nạp vào Cloud Data Warehouse định kỳ theo lịch trình Airflow.',
    tags: ['Airflow', 'Python', 'BigQuery', 'Docker', 'SQL'],
    img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80',
    githubUrl: 'https://github.com',
    featured: false
  },
  {
    id: 'proj-4',
    title: 'E-Commerce Churn Prediction & Survival Analysis',
    desc: 'Xây dựng mô hình Machine Learning dự báo tỷ lệ khách hàng rời bỏ (Churn Rate) dựa trên lịch sử mua sắm và tương tác, kết hợp SHAP value để giải thích lý do khách rời đi.',
    tags: ['Python', 'XGBoost', 'SHAP', 'Classification'],
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    demoUrl: 'https://streamlit.io',
    githubUrl: 'https://github.com',
    featured: false
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
        { dataKey: 'revenue', name: 'Doanh thu ($)', color: '#6366f1' },
        { dataKey: 'profit', name: 'Lợi nhuận ($)', color: '#10b981' }
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
        { dataKey: 'revenue', name: 'Doanh thu ($)', color: '#3b82f6' }
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
      title: 'Tăng Trưởng Khách Hàng Theo Kênh Marketing (Customer Acquisition)',
      type: 'line',
      description: 'Số lượng người dùng mới được thu hút qua Organic Search, Paid Ads và Referral.',
      xAxisKey: 'quarter',
      series: [
        { dataKey: 'organic', name: 'Organic Search', color: '#10b981' },
        { dataKey: 'paid', name: 'Paid Ads', color: '#f59e0b' },
        { dataKey: 'referral', name: 'Referrals', color: '#8b5cf6' }
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
