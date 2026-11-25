import { ProfileData, ProjectData } from './types';
import { libraryBusMarkdownContent } from './data/libraryBusContent';

export const DEFAULT_PROFILE: ProfileData = {
  name: "Ma Văn Hùng",
  subtitle: "Fresher Data Analyst / Business Analyst",
  title: "Fresher Data Analyst / BA",
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
    { id: 'sk-3', name: 'BI & Data Visualization (Recharts / BI Spec)', category: 'BI & Visualization', level: 4, icon: 'uiux', proficiencyNote: 'Recharts Interactive Dashboards, Power BI / Looker Studio Spec (Star Schema & DAX), Data Storytelling', tags: ['Recharts', 'BI Spec (Power BI / Looker)', 'Data Storytelling'] },
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
      role: 'Steve x Kami Company: Nhân viên Hỗ trợ Vận hành & Báo cáo Dữ liệu E-Commerce (Full-time)',
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
      role: 'Library Bus: Phân tích Nghiệp vụ (BA), Kiến trúc Dữ liệu (MySQL/Redis/Celery) & UX/UI',
      company: 'Dự án Hệ thống Thư viện Lưu động (Django 5.2 • 7 Apps • 36 Models)',
      period: '2023 - 2024',
      type: 'work',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Đặc tả 4 bộ quy tắc nghiệp vụ (BR-01..04), khóa bi quan select_for_update() chống Race Condition trên MySQL 8.0, 9 tác vụ nền Celery Beat + Redis 7 và 171 unit test tự động.',
        'Thiết kế phân hệ Telemetry (analytics app: UserActivity, BookAnalytics, BusAnalytics, DailyStats) cùng 11 cặp màn hình Wireframe – UI (Desktop 1440px & Mobile 390px).'
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
    title: 'Library Bus: Phân tích Nghiệp vụ (BA), Kiến trúc Telemetry (MySQL 8.0 / Redis / Celery) & UX/UI',
    titleEn: 'Library Bus: BA Specification, Telemetry Architecture (MySQL 8.0 / Redis / Celery) & UX/UI',
    desc: 'Hệ thống số hóa mạng lưới xe buýt thư viện lưu động xây dựng trên Django 5.2 (7 phân hệ, 36 model dữ liệu, 97 template HTML, 171 unit test), MySQL 8.0, Redis 7 và 9 cron job Celery Beat, kết hợp đối chiếu 11 cặp màn hình Wireframe – UI (Desktop 1440px & Mobile 390px).',
    descEn: 'Mobile library network platform built on Django 5.2 (7 apps, 36 data models, 97 HTML templates, 171 unit tests), MySQL 8.0, Redis 7, and 9 Celery Beat cron jobs, paired with 11 core Desktop & Mobile Wireframe-to-UI screen flows.',
    tags: ['Business Analysis (BA)', 'MySQL 8.0 & Django 5.2', 'Redis & Celery Beat', 'Product Telemetry', 'Wireframe & UI'],
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80',
    demoUrl: '/library-bus/website.html',
    featured: true,
    content: libraryBusMarkdownContent,
    problem: 'Dịch vụ xe thư viện lưu động cần ngăn chặn lỗi đặt trùng cuốn sách cuối cùng khi nhiều độc giả thao tác đồng thời (TOCTOU Race Condition), tự động hóa hàng đợi đặt trước FIFO, tính phí phạt lũy tiến và đo lường hiệu suất từng chuyến xe.',
    problemEn: 'A mobile library network must prevent concurrent double-booking on the last book copy (TOCTOU race conditions), automate FIFO reservation queues, calculate progressive overdue fines, and track bus-level operational telemetry.',
    method: 'Đặc tả 4 quy tắc nghiệp vụ (BR-01..04) thực thi bằng khóa bi quan select_for_update() trong transaction.atomic() trên MySQL 8.0 (UUIDv4, SoftDeleteModel, AuditMixin), 9 cron job Celery Beat + Redis 7 CacheMixin, và đối chiếu 11 cặp màn hình Wireframe – UI.',
    methodEn: 'Specified 4 business rules (BR-01..04) enforced via pessimistic select_for_update() locks inside transaction.atomic() on MySQL 8.0 (UUIDv4, SoftDeleteModel, AuditMixin), 9 Celery Beat cron jobs + Redis 7 CacheMixin, and 11 paired Wireframe-to-UI screens.',
    insight: 'Tích hợp phân hệ analytics trực tiếp vào luồng giao dịch (transaction.on_commit đẩy task bất đồng bộ) giúp đo lường phễu gợi ý sách (Click Rate -> Borrow Rate), điểm phổ biến sách (BookAnalytics), hiệu suất xe (BusAnalytics) và lưu trữ lạnh sự kiện sau 90 ngày.',
    insightEn: 'Integrating the analytics app directly into transactional commits (transaction.on_commit async tasks) tracks recommendation funnels (Click Rate -> Borrow Rate), BookAnalytics popularity scores, BusAnalytics efficiency, and 90-day cold event archiving.',
    metrics: [
      { label: 'Quy Mô Kiến Trúc', labelEn: 'System Architecture', value: '7 Apps • 36 Models', change: 'Django 5.2 • MySQL 8.0 • UUIDv4', changeEn: 'Django 5.2 • MySQL 8.0 • UUIDv4', isPositive: true },
      { label: 'Quy Tắc BA & Khóa DB', labelEn: 'BA Rules & Concurrency', value: 'BR-01..04 • ACID', change: 'select_for_update() chống Race Condition', changeEn: 'select_for_update() row locking', isPositive: true },
      { label: 'Tác Vụ Nền Tự Động', labelEn: 'Automated Cron Jobs', value: '9 Celery Jobs', change: 'Redis 7 CacheMixin • Quét FIFO 30p', changeEn: 'Redis 7 CacheMixin • 30m FIFO scan', isPositive: true },
      { label: 'Kiểm Thử & Giao Diện', labelEn: 'Tests & UI Flows', value: '171 Unit Tests', change: '11 cặp Wireframe–UI • 97 Templates', changeEn: '11 Wireframe–UI pairs • 97 Templates', isPositive: true }
    ],
    tools: ['MySQL 8.0', 'Redis 7 & Celery', 'Django 5.2 ORM', 'Business Analysis (BA)', 'Product Telemetry']
  }
];
