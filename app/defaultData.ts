import { ProfileData, ProjectData, DashboardData } from './types';
import { libraryBusMarkdownContent } from './data/libraryBusContent';

export const DEFAULT_PROFILE: ProfileData = {
  name: "Nguyễn Văn A",
  subtitle: "Placeholder Name",
  title: "Software Engineer",
  bio: "Nguyễn Văn A is an experienced professional in data analysis, software engineering, and customer experience. Passionate about developing community-driven platforms, scalable systems, and automated data pipelines.",
  careerGoal: "Lead Development of Scalable Systems & Master Cloud Architecture",
  careerGoalsList: [
    {
      id: 'goal-1',
      title: 'Lead Development of Scalable Systems',
      desc: 'Develop concept of organization development systems, and management solutions.',
      icon: 'list'
    },
    {
      id: 'goal-2',
      title: 'Master Cloud Architecture',
      desc: 'Develop development of problems, cloud platforms and real-time monitoring systems.',
      icon: 'cloud'
    },
    {
      id: 'goal-3',
      title: 'Enterprise Data & Cloud Architecture',
      desc: 'Provide operational and resilient architectures and cloud-native applications.',
      icon: 'network'
    }
  ],
  avatarUrl: "",
  email: "analyst@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  skills: [
    { id: 'sk-1', name: 'Python', category: 'Languages', level: 5, icon: 'python' },
    { id: 'sk-2', name: 'SQL', category: 'Languages', level: 5, icon: 'sql' },
    { id: 'sk-3', name: 'DevOps', category: 'Frameworks', level: 4, icon: 'devops' },
    { id: 'sk-4', name: 'JavaScript', category: 'Languages', level: 5, icon: 'javascript' },
    { id: 'sk-5', name: 'Machine Learning', category: 'Core Skills', level: 4, icon: 'ml' },
    { id: 'sk-6', name: 'UI/UX Design', category: 'Tools', level: 4, icon: 'uiux' }
  ],
  experiences: [
    {
      id: 'exp-edu-1',
      role: 'Chuyên ngành Quản trị thông tin',
      company: 'Đại học Quốc gia Hà Nội (VNU)',
      period: '2020 - 2024',
      type: 'education',
      description: [
        'Tập trung vào quản lý, phân tích và tối ưu hóa hệ thống thông tin dữ liệu.'
      ]
    },
    {
      id: 'exp-work-1',
      role: 'Nghiên cứu Khoa học Sinh viên: Phân tích Du lịch Di sản tại Nhật Bản.',
      company: 'Đại học Quốc gia Hà Nội',
      period: '2023 - 2024',
      type: 'work',
      description: [
        'Sử dụng các phương pháp phân tích dữ liệu để đánh giá xu hướng và tiềm năng phát triển du lịch bền vững tại các khu di sản Nhật Bản.'
      ]
    },
    {
      id: 'exp-work-2',
      role: 'Steve x Kami Company - Hỗ trợ Vận hành Nền tảng Thương mại điện tử.',
      company: 'Steve x Kami Company',
      period: '2022 - 2023',
      type: 'work',
      description: [
        'Quản lý quy trình vận hành, theo dõi đơn hàng và phân tích dữ liệu kinh doanh trên các nền tảng thương mại điện tử.'
      ]
    }
  ]
};

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 'proj-kami-ely',
    title: 'Kami Ely — Báo cáo phân tích TikTok Shop',
    desc: 'Phân tích tổng hợp hiệu suất bán hàng, mạng lưới affiliate và kênh nhà sáng tạo tự vận hành từ nền tảng dữ liệu TikTok Shop cho ngành hàng Sports & Outdoor.',
    tags: ['TikTok Shop', 'Data Analytics', 'Recharts', 'Dashboard'],
    img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    featured: true
  },
  {
    id: 'proj-heritage-japan',
    title: 'Sự phát triển của Du lịch Di sản tại Nhật Bản',
    desc: 'Phân tích chuỗi số liệu khách du lịch quốc tế, chi tiêu du lịch và chính sách bảo tồn di sản Nhật Bản giai đoạn 2013 – nay. Trực quan hoá bằng Recharts.',
    tags: ['Data extraction', 'Data viz', 'Recharts', 'Storytelling'],
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    featured: true
  },
  {
    id: 'proj-library-bus',
    title: 'Library Bus Management System',
    desc: 'Hệ thống quản lý mượn/trả sách lưu động tích hợp IoT GPS tracking và thanh toán phạt tự động.',
    tags: ['Django', 'Celery', 'Redis', 'MySQL', 'Docker', 'Tailwind CSS'],
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80',
    demoUrl: '/website.pdf',
    featured: true,
    content: libraryBusMarkdownContent,
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
