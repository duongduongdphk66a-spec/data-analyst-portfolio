import { ProfileData, ProjectData } from './types';
import { libraryBusMarkdownContent } from './data/libraryBusContent';

export const DEFAULT_PROFILE: ProfileData = {
  name: "Ma Văn Hùng",
  subtitle: "Fresher Data Analyst / Business Analyst",
  title: "Fresher Data Analyst / BA",
  bio: "Fresher Data Analyst & Business Analyst làm việc với SQL (MySQL 8.0), Python, thống kê ứng dụng, đặc tả BI (Star Schema/DAX) và Technical BA (Mini-BRD, ERD, Tracking Plan). Tập trung làm sạch, đối soát số liệu đa nguồn và viết đặc tả nghiệp vụ gắn với chỉ số đo lường.",
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
        'Thực hiện niên luận: "Sự phát triển của Du lịch Di sản tại Nhật Bản giai đoạn 2013–2022" (nền chuỗi 20 năm 2003–2022, kèm cập nhật 2023, GVHD: TS Võ Minh Vũ).'
      ]
    },
    {
      id: 'exp-work-1',
      role: 'Công trình Nghiên cứu Khoa học: Phân tích Du lịch Di sản tại Nhật Bản (2013–2022)',
      company: 'Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQGHN',
      period: '2023 - 2024',
      type: 'work',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Kiểm toán (Data Audit) 5 lỗi nguồn trong niên luận và chuẩn hóa 6 bộ dữ liệu chuỗi thời gian 20 năm (2003–2022) từ MLIT và JNTO.',
        'Lượng hóa đỉnh 31,9 triệu khách (2019), chi tiêu quốc tế 4,81 nghìn tỷ Yên (~0,86% GDP, tách khỏi toàn ngành 7,5% GDP WTTC), chi tiêu/khách giảm -14,6% (2015→2019) và quá tải Shirakawa-go (3.000 lượt/cư dân khu lõi Ogimachi/năm).'
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
        'Theo dõi đơn hàng hằng ngày, tỷ lệ hoàn/hủy và tổng hợp báo cáo doanh số định kỳ bằng Excel/Google Sheets trên TikTok Shop.',
        'Kinh nghiệm vận hành thực tế giai đoạn 2022–2023 độc lập với dự án nghiên cứu cá nhân Kami Ely năm 2026 (sử dụng dữ liệu ước tính công khai từ FastMoss).'
      ]
    },
    {
      id: 'exp-work-3',
      role: 'Library Bus: Technical BA (Mini-BRD, ERD 7 bảng), Tracking Plan & Prototype',
      company: 'Dự án Hệ thống Thư viện Lưu động (Pre-Launch Spec · Prototype 171 Unit Tests)',
      period: '2023 - 2024',
      type: 'work',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Đặc tả As-Is/To-Be, 5 Stakeholder, MoSCoW, 5 User Stories và 4 quy tắc BR-01..04 (khóa bi quan select_for_update(), hàng đợi FIFO 7 ngày từ lúc sách về trạm, phạt 3 bậc có trần 100% giá sách).',
        'Chuẩn hóa ERD lõi 7 bảng (BookTitle/BusBookInventory), Tracking Plan 8 sự kiện, khung quyết định Pilot 4 tuần (2 tuyến) và 11 cặp màn hình Wireframe–UI (kiểm chứng bằng bản mẫu Django/MySQL 171 unit tests).'
      ]
    }
  ]
};

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 'proj-kami-ely',
    title: 'Kami Ely: Phân tích hiệu suất TikTok Shop, mạng lưới Affiliate & Đặc tả BI (FastMoss)',
    titleEn: 'Kami Ely: TikTok Shop, Affiliate Network Analytics & BI Spec (FastMoss)',
    desc: 'Dự án phân tích độc lập 231 ngày vận hành (09/03 – 25/10/2026: 15,01 tỷ đồng GMV ước tính, 101.896 sản phẩm bán ra) từ 10 bảng FastMoss; phát hiện và loại trừ +7,59 tỷ đ trùng nguồn giữa CrLive và AffLive, kèm Đặc tả BI Star Schema (4 Fact · 3 Dim).',
    descEn: 'Independent 231-day case study (Mar 09 – Oct 25, 2026: 15.01B VND estimated GMV, 101,896 units) from 10 FastMoss tables; caught and reconciled +7.59B VND cross-file overlap between CrLive and AffLive, paired with a 4-Fact · 3-Dim Star Schema BI Spec.',
    tags: ['E-Commerce Analytics', 'Data Reconciliation', 'Panel FE & Stats', 'Cohort & HHI', 'SQL & Python', 'BI Spec (DAX)'],
    img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    featured: true,
    problem: 'Doanh thu tháng 8 giảm -83,1% so với đỉnh tháng 6 (riêng 6 mã đồ bơi rơi -89,3% từ 1,57 xuống 0,17 tỷ đ) khi qua cao điểm hè. Gian hàng cần chẩn đoán nguyên nhân theo kênh/SKU, kiểm chứng hiệu quả Live dài giờ, đo độ tập trung KOC và thiết kế kế hoạch chuyển mùa.',
    problemEn: 'August GMV fell -83.1% from the June peak (6 swimwear SKUs dropped -89.3%, 1.57B to 0.17B VND) after summer demand faded. Needed to diagnose channel/SKU drivers, test long-session live productivity, quantify KOC concentration, and plan autumn transition.',
    method: 'Chuẩn hóa 10 bảng FastMoss (23.364 dòng, 231 ngày), đối soát loại +7,59 tỷ trùng nguồn, phân tầng Live >10h theo tháng kiểm tra Nghịch lý Simpson, chạy Panel FE trên cửa sổ hoạt động sau mở bán (n = 1.422, Within R² = 0,302), Winsorize, HHI, Fisher Exact và Mann-Whitney U.',
    methodEn: 'Standardized 10 FastMoss tables (23,364 rows, 231 days), removed +7.59B VND overlap, stratified >10h Live by month for Simpson’s Paradox, ran post-launch active-window Panel FE (n = 1,422, Within R² = 0.302), Winsorization, HHI, Fisher Exact, and Mann-Whitney U tests.',
    insight: 'Live nội bộ (chính chủ + vệ tinh) tạo 84,5% GMV Live nhưng hiệu suất phiên >10h tụt từ 8,48 Tr/h (T6) về 0,73 Tr/h (T8); Video Ads có GPM 0,84× Organic; 12/133 link sản phẩm có đơn chiếm 80,6% GMV và bộ lọc KOC 2 tầng bảo toàn 51 creator nổ đơn muộn (304,9 Tr = 18,8% Live ngoài).',
    insightEn: 'In-house Live drove 84.5% of live GMV but >10h productivity fell from 8.48M/hr (Jun) to 0.73M/hr (Aug); Video Ads trailed Organic GPM (0.84x); 12/133 converting product listings drove 80.6% GMV, and a 2-tier KOC rule protects 51 late converters (304.9M = 18.8% external Live).',
    metrics: [
      { label: 'GMV ước tính (231 ngày)', labelEn: 'Estimated GMV (231 Days)', value: '15,01 Tỷ', change: 'Loại +7,59 tỷ trùng nguồn · 101.896 sp', changeEn: 'Removed +7.59B overlap · 101,896 units', isPositive: true },
      { label: 'Giá bán TB thực tế (ASP)', labelEn: 'Average Selling Price (ASP)', value: '147,3k đ', change: 'ASP thực bán 75k–250k = 95,4% GMV', changeEn: 'Realized ASP 75k–250k = 95.4% GMV', isPositive: true },
      { label: 'Thị phần Live in-house', labelEn: 'In-House Live Share', value: '84,5%', change: 'Live >10h tụt 8,48 → 0,73 Tr/h (T6→T8)', changeEn: '>10h Live fell 8.48 → 0.73M/hr (Jun→Aug)', isPositive: true },
      { label: 'Tập trung HHI (KOL 90N)', labelEn: 'KOL 90d Concentration (HHI)', value: '3.842 → 246', change: 'Loại chính chủ 1.471 · Bỏ cả vệ tinh 246', changeEn: 'Excl. official 1,471 · Pure external 246', isPositive: true }
    ],
    tools: ['SQL (MySQL 8.0)', 'Python (Pandas & SciPy)', 'Panel FE & Non-parametric Tests', 'BI Spec (4 Fact · 3 Dim)']
  },
  {
    id: 'proj-heritage-japan',
    title: 'Sự phát triển của Du lịch Di sản tại Nhật Bản (2013–2022): Kiểm toán Dữ liệu & Chuỗi Thời gian',
    titleEn: 'Heritage Tourism Growth in Japan (2013–2022): Data Audit & Time-Series Analysis',
    desc: 'Niên luận định lượng giai đoạn 2013–2022 (kèm cập nhật 2023) trên chuỗi dữ liệu 20 năm (2003–2022) từ JNTO và MLIT. Kiểm toán 5 sai lệch nguồn trong tài liệu gốc, đánh giá chất lượng chi tiêu/khách (-14,6% giai đoạn 2015–2019) và áp lực quá tải di sản UNESCO.',
    descEn: 'Quantitative thesis covering 2013–2022 (with 2023 notes) built on a 20-year baseline (2003–2022) from JNTO and MLIT. Audits 5 source errors in the original draft, tracks -14.6% per-visitor spend erosion (2015–2019), and quantifies UNESCO overtourism pressure.',
    tags: ['Time-Series Analysis', 'Data Audit (5 Errors)', 'Policy Evaluation', 'SQL & Python'],
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    featured: true,
    problem: 'Lượng khách quốc tế đến Nhật Bản tăng vọt từ 10,36 triệu (2013) lên 31,88 triệu (2019) trước khi sụt giảm -99,2% năm 2021 vì đại dịch, trong khi chi tiêu bình quân/khách lại giảm -14,6% (2015→2019) và điểm di sản UNESCO đối mặt quá tải cục bộ.',
    problemEn: 'International arrivals jumped from 10.36M (2013) to 31.88M (2019) before falling -99.2% in 2021 during COVID-19, while average spend per visitor eroded -14.6% (2015→2019) and UNESCO sites faced acute local overtourism.',
    method: 'Kiểm toán 5 sai lệch nguồn niên luận (lỗi dịch niên độ Kyoto từ 2012, sai dấu thập phân Nara 28,9→289 tỷ ¥, trộn đơn vị, nhầm phạm vi GDP) và chuẩn hóa 6 bộ dữ liệu (2003–2022). Kết hợp ngoại suy log-linear (công bố rõ R² = 0,347, p = 0,073 và tác động tỷ giá JPY) với đối sánh 5 điểm UNESCO.',
    methodEn: 'Audited 5 thesis source errors (Kyoto post-2012 year shift, Nara 10x decimal slip 28.9→289B JPY, unit mixing, GDP scope conflation) across 6 datasets (2003–2022). Combined log-linear counterfactuals (with R² = 0.347, p = 0.073 & JPY FX diagnostics) and 5-site UNESCO benchmarking.',
    insight: 'Chi tiêu khách quốc tế đạt 4,81 nghìn tỷ Yên năm 2019 (~0,86% GDP, tách bạch với toàn ngành 7,5% GDP WTTC), nhưng chi tiêu/khách giảm -14,6% từ đỉnh 176,6k Yên (2015) xuống 150,8k Yên (2019). Làng cổ Shirakawa-go (~600 cư dân khu lõi Ogimachi) chịu 3.000 lượt khách/cư dân/năm.',
    insightEn: 'Inbound spend reached 4.81T JPY in 2019 (~0.86% GDP, separate from WTTC 7.5% total sector GDP), while per-visitor spend fell -14.6% from 176.6k JPY (2015) to 150.8k JPY (2019). Shirakawa-go’s core Ogimachi hamlet (~600 residents) absorbed 3,000 annual visits per resident.',
    metrics: [
      { label: 'Kiểm toán & Chuỗi Dữ Liệu', labelEn: 'Audit & Data Horizon', value: '5 Lỗi · 20N', change: 'Chuỗi 2003–2022 (trọng tâm 2013–2022)', changeEn: '2003–2022 series (2013–2022 focus)', isPositive: true },
      { label: 'Lượng Khách Đạt Đỉnh', labelEn: 'Peak Annual Visitors', value: '31,9 Triệu', change: '+207,7% (2019 vs 2013)', changeEn: '+207.7% (2019 vs 2013)', isPositive: true },
      { label: 'Chi Tiêu Quốc Tế & Bình Quân', labelEn: 'Inbound & Per-Capita Spend', value: '4,81T Yên', change: '~0,86% GDP · Chi/khách -14,6% (2015→19)', changeEn: '~0.86% GDP · Spend/visitor -14.6% (15→19)', isPositive: false },
      { label: 'Tỷ Lệ Quá Tải Cục Bộ', labelEn: 'Local Overtourism Ratio', value: '3.000 : 1', change: 'Lượt/cư dân khu lõi Ogimachi (~600 dân)', changeEn: 'Visits/resident in core Ogimachi (~600 pop)', isPositive: false }
    ],
    tools: ['Python (NumPy/Stats)', 'SQL Data Audit', 'Time-Series Counterfactual', 'Policy Evaluation']
  },
  {
    id: 'proj-library-bus',
    title: 'Library Bus: Phân tích Nghiệp vụ (Technical BA), Mô hình Dữ liệu & Tracking Plan',
    titleEn: 'Library Bus: Technical Business Analysis (BA), Core Data Modeling & Tracking Plan',
    desc: 'Hồ sơ Technical BA trước Go-Live cho mạng lưới xe thư viện lưu động: As-Is/To-Be, ràng buộc thực địa (offline 4G, trả chéo tuyến, hủy chuyến), 5 Stakeholder, MoSCoW, 5 User Stories, BR-01..04 (trần phạt 100% giá sách), ERD lõi 7 bảng (BookTitle/BusBookInventory), Tracking Plan 8 sự kiện và khung Pilot 4 tuần.',
    descEn: 'Pre-launch Technical BA spec for a mobile library network: As-Is/To-Be, mobile-bus field constraints (offline 4G, cross-bus returns, cancellations), 5 stakeholders, MoSCoW, 5 User Stories, BR-01..04 (100% replacement-cost cap), normalized 7-entity ERD (BookTitle/BusBookInventory), 8-event Tracking Plan, and 4-week pilot criteria.',
    tags: ['Technical BA', 'Mini-BRD & RTM', 'MoSCoW & ERD', 'Tracking Plan', 'Wireframe & UI'],
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80',
    demoUrl: '/library-bus/website.html',
    featured: true,
    content: libraryBusMarkdownContent,
    problem: 'Vận hành xe thư viện lưu động thủ công gây đặt trùng bản sách cuối cùng, bỏ lỡ lượt chờ khi sách hết bản, tính phí phạt cảm tính, rủi ro mất sóng 4G/trả chéo tuyến và thiếu dữ liệu theo dõi nhu cầu theo từng tuyến xe.',
    problemEn: 'Manual mobile library circulation causes last-copy double-booking, uncoordinated waitlists, ad-hoc fines, field disruptions (flaky 4G, cross-bus returns), and zero visibility into route-level demand.',
    method: 'Phân tích As-Is/To-Be & 3 ràng buộc thực địa, Ma trận 5 Stakeholder, MoSCoW, đặc tả 5 User Stories + BR-01..04 (Mini-BRD/RTM), chuẩn hóa ERD lõi 7 bảng (BookTitle → BusBookInventory), thiết kế Tracking Plan 8 sự kiện + SQL 30 ngày lọc cohort 7 ngày chín và kiểm chứng trên bản mẫu Django/MySQL (171 unit tests).',
    methodEn: 'Built As-Is/To-Be & 3 mobile-bus constraints, 5-stakeholder map, MoSCoW, 5 User Stories + BR-01..04 (Mini-BRD/RTM), normalized 7-entity ERD (BookTitle → BusBookInventory), 8-event Tracking Plan + matured 7-day SQL, validated via a Django/MySQL prototype (171 unit tests).',
    insight: 'Tách lõi MVP khỏi GĐ 2 (AI/gamification), áp trần phạt 100% giá sách và thiết lập khung quyết định Pilot 4 tuần (2 tuyến) với chỉ số borrows_per_visit không chặn trần giúp kiểm chứng thực địa trước khi mở rộng toàn đội xe.',
    insightEn: 'Decoupling Phase 1 MVP from Phase 2 AI/gamification, capping fines at 100% replacement value, and setting a 4-week 2-route pilot decision matrix with uncapped borrows_per_visit de-risks network rollout.',
    metrics: [
      { label: 'Đặc tả Nghiệp vụ BA', labelEn: 'BA Specification', value: 'BR-01..04 • 5 US', change: 'As-Is/To-Be • 5 Stakeholders • RTM', changeEn: 'As-Is/To-Be • 5 Stakeholders • RTM', isPositive: true },
      { label: 'Mô hình Dữ liệu & Tracking', labelEn: 'Data Model & Tracking', value: 'ERD 7 bảng • 8 Events', change: 'BookTitle/BusBookInventory • Matured 7d SQL', changeEn: 'BookTitle/BusBookInventory • Matured 7d SQL', isPositive: true },
      { label: 'Luồng Màn hình Cốt lõi', labelEn: 'Core Screen Flows', value: '11 Cặp Wireframe–UI', change: 'Desktop 1440px & Mobile 390px', changeEn: 'Desktop 1440px & Mobile 390px', isPositive: true },
      { label: 'Kiểm chứng & Thí điểm', labelEn: 'Validation & Pilot', value: 'Pilot 4W • 171 Tests', change: '5 ngưỡng Go/Tune trên 2 tuyến xe', changeEn: '5 Go/Tune thresholds across 2 routes', isPositive: true }
    ],
    tools: ['Technical BA (Mini-BRD/RTM)', 'MoSCoW & User Stories', 'MySQL 8.0 & ERD', 'Tracking Plan', 'Wireframe / UI']
  }
];
