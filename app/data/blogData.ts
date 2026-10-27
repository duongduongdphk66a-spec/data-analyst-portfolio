export interface BlogPost {
  id: string;
  slug: string;
  projectKey: "heritage-japan" | "kami-ely" | "library-bus" | "sql-methodology";
  projectSlug: string;
  featured?: boolean;
  categoryVi: string;
  categoryEn: string;
  readTimeVi: string;
  readTimeEn: string;
  date: string;
  titleVi: string;
  titleEn: string;
  excerptVi: string;
  excerptEn: string;
  problemVi: string;
  problemEn: string;
  processVi: string[];
  processEn: string[];
  findingsVi: string;
  findingsEn: string;
  codeLanguage: "sql" | "python";
  codeTitleVi: string;
  codeTitleEn: string;
  codeSnippet: string;
  tags: string[];
}

export interface TestimonialItem {
  id: string;
  roleType: "academic" | "business" | "peer";
  quoteVi: string;
  quoteEn: string;
  authorVi: string;
  authorEn: string;
  titleVi: string;
  titleEn: string;
  contextVi: string;
  contextEn: string;
  projectLink: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "heritage-japan-averages",
    slug: "why-simple-averages-mislead-heritage-japan",
    projectKey: "heritage-japan",
    projectSlug: "/projects/proj-heritage-japan",
    featured: true,
    categoryVi: "Kinh tế học & Kiểm định Chính sách",
    categoryEn: "Economics & Policy Evaluation",
    readTimeVi: "7 phút đọc",
    readTimeEn: "7 min read",
    date: "2026-09",
    titleVi:
      "Tại sao số trung bình cộng đánh lừa nhà hoạch định? Bài học từ nghiên cứu Du lịch Di sản Nhật Bản",
    titleEn:
      "Why Simple Averages Mislead Policymakers: Lessons from Japanese World Heritage Tourism Research",
    excerptVi:
      "Góc nhìn hậu trường về quá trình kiểm toán dữ liệu lưu trú JNTO/UNESCO và giải mã sự phân cực giữa tình trạng quá tải du lịch (overtourism) với bài toán phát triển vùng.",
    excerptEn:
      "A behind-the-scenes look at auditing JNTO/UNESCO tourism datasets and uncovering the structural divide between overtourism hubs and peripheral heritage sites.",
    problemVi:
      "Khi bắt đầu đề tài nghiên cứu khoa học về Du lịch Di sản Nhật Bản, câu hỏi lớn nhất là: Liệu danh hiệu Di sản Thế giới UNESCO có thực sự thúc đẩy tăng trưởng du lịch đồng đều cho các địa phương? Nếu chỉ nhìn vào tổng lượng khách hoặc trung bình cộng toàn quốc, bức tranh trông rất khả quan nhưng lại che khuất sự lệch chuẩn nghiêm trọng giữa vùng lõi đô thị và vùng ngoại vi.",
    problemEn:
      "When starting my university research on Japanese Heritage Tourism, the central question was: Does UNESCO World Heritage designation drive equitable regional tourism growth? Looking solely at national totals or simple arithmetic means paints an optimistic picture while masking severe skewness between metropolitan cores and peripheral prefectures.",
    processVi: [
      "Thu thập và chuẩn hóa dữ liệu đa nguồn từ thống kê lưu trú cấp tỉnh (JNTO) và danh mục công nhận Di sản Thế giới UNESCO theo mốc thời gian.",
      "Thực hiện Data Audit để phát hiện và tách biệt ảnh hưởng của các siêu đô thị (Tokyo, Kyoto, Osaka) khỏi nhóm các tỉnh có di sản độc lập.",
      "Sử dụng phân tích phân vị (Quantile Analysis), trung vị (Median) và hệ số bất bình đẳng để đánh giá hiệu quả chính sách trước và sau khi được công nhận di sản.",
      "Trực quan hóa dữ liệu qua hệ thống biểu đồ phân bố vùng để đối chiếu giữa năng lực hạ tầng và áp lực quá tải du lịch (overtourism).",
    ],
    processEn: [
      "Collected and standardized multi-source datasets from prefectural overnight stay statistics (JNTO) and UNESCO World Heritage recognition timelines.",
      "Conducted rigorous Data Auditing to isolate extreme metropolitan outliers (Tokyo, Kyoto, Osaka) from standalone heritage prefectures.",
      "Replaced naive mean comparisons with Quantile Analysis, Medians, and regional concentration metrics to evaluate pre- and post-designation policy impact.",
      "Visualized spatial distributions to contrast local infrastructure capacity against overtourism pressure.",
    ],
    findingsVi:
      "Danh hiệu UNESCO tạo ra hiệu ứng truyền thông ban đầu rất mạnh, nhưng tăng trưởng bền vững phụ thuộc vào khả năng kết nối giao thông liên vùng và sản phẩm du lịch giữ chân khách lưu trú qua đêm. Phát hiện này chính là bước ngoặt đưa tôi đến với niềm đam mê phân tích dữ liệu thực nghiệm.",
    findingsEn:
      "UNESCO status generates a strong initial signaling effect, but sustained economic retention depends on regional transit connectivity and overnight-stay product depth. This empirical discovery sparked my career passion for data analytics.",
    codeLanguage: "sql",
    codeTitleVi: "Truy vấn phân tích phân vị & độ lệch vùng Du lịch Di sản",
    codeTitleEn: "Quantile & Regional Skewness Query for Heritage Tourism",
    codeSnippet: `WITH regional_metrics AS (
  SELECT
    prefecture_name,
    region_group,
    unesco_site_count,
    overnight_stays_millions,
    AVG(overnight_stays_millions) OVER () AS national_mean,
    PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY overnight_stays_millions) OVER () AS national_median
  FROM heritage_japan_tourism
)
SELECT
  region_group,
  COUNT(*) AS prefectures,
  ROUND(AVG(overnight_stays_millions), 2) AS group_mean,
  ROUND(MAX(national_median), 2) AS benchmark_median,
  ROUND(SUM(overnight_stays_millions) * 100.0 / SUM(SUM(overnight_stays_millions)) OVER (), 1) AS share_of_total_pct
FROM regional_metrics
GROUP BY region_group
ORDER BY share_of_total_pct DESC;`,
    tags: ["Origin Story", "Data Audit", "Policy Analytics", "Heritage Japan"],
  },
  {
    id: "tiktok-shop-reconciliation",
    slug: "reconciling-tiktok-shop-gmv-discrepancies-sql-python",
    projectKey: "kami-ely",
    projectSlug: "/projects/proj-kami-ely",
    featured: true,
    categoryVi: "E-Commerce & Thống kê Ứng dụng",
    categoryEn: "E-Commerce & Applied Statistics",
    readTimeVi: "8 phút đọc",
    readTimeEn: "8 min read",
    date: "2026-09",
    titleVi:
      "Đối soát chênh lệch GMV trên TikTok Shop bằng Khung 8 giai đoạn SQL & Kiểm định phi tham số",
    titleEn:
      "Reconciling TikTok Shop GMV Discrepancies with an 8-Stage SQL Pipeline & Non-Parametric Tests",
    excerptVi:
      "Cách thiết lập 'Single Source of Truth' khi báo cáo doanh thu từ phía Creator và phía Shop không khớp nhau trong thực tế vận hành thương mại điện tử.",
    excerptEn:
      "How to establish a Single Source of Truth when Creator-level telemetry and Shop-level GMV reports fail to align in live e-commerce operations.",
    problemVi:
      "Trong phân tích thương mại điện tử trên TikTok Shop (dự án Kami Ely), tổng GMV cộng dồn từ danh sách Creator Affiliate thường chênh lệch đáng kể so với GMV ghi nhận tại trang tổng quan của Shop. Nếu không đối soát (reconcile) rõ ràng, doanh nghiệp sẽ phân bổ sai ngân sách hoa hồng và đánh giá sai hiệu quả kênh bán.",
    problemEn:
      "In TikTok Shop e-commerce analytics (the Kami Ely project), aggregated GMV across affiliate creators often diverges from Shop-level summary telemetry. Without rigorous reconciliation, teams risk misallocating commission budgets and misjudging channel ROI.",
    processVi: [
      "Thiết kế Data Scope Matrix để phân tách rõ phạm vi ghi nhận của bảng Creator, bảng Shop Catalog, bảng Livestream và bảng Video.",
      "Triển khai chuỗi truy vấn SQL 8 giai đoạn để bóc tách tỷ lệ đóng góp của từng kênh (Live vs. Video vs. Showcase) và cô lập sai số do độ trễ cập nhật đơn hoàn/hủy.",
      "Sử dụng Python (Pandas, SciPy) kiểm định tính chuẩn (Shapiro-Wilk) của phân phối doanh thu và áp dụng kiểm định phi tham số (Mann-Whitney U, Kruskal-Wallis / ANOVA).",
      "Xây dựng mô hình tối ưu hóa danh mục giá SKU (SKU Matrix Optimizer) dựa trên độ co giãn của lượng bán theo mức giá.",
    ],
    processEn: [
      "Designed a Data Scope Matrix to map attribution boundaries across Creator, Shop Catalog, Livestream, and Video tables.",
      "Implemented an 8-stage SQL pipeline to decompose channel contributions (Live vs. Video vs. Showcase) and isolate settlement lag variances.",
      "Used Python (Pandas, SciPy) to test distribution normality (Shapiro-Wilk) and execute non-parametric hypothesis tests (Mann-Whitney U, ANOVA).",
      "Built an SKU price-tier optimization matrix based on volume-to-price elasticity.",
    ],
    findingsVi:
      "Xác định chính xác phần chênh lệch GMV đến từ cơ chế đối soát thời gian ghi nhận (attribution window) giữa tài khoản nhà sáng tạo và gian hàng, đồng thời chứng minh nhóm SKU tầm giá chiến lược đóng vai trò phễu kéo chuyển đổi chính cho toàn bộ các phiên Livestream.",
    findingsEn:
      "Pinpointed the exact GMV variance driven by attribution window differences and proved that mid-tier anchor SKUs act as the primary conversion engine during high-frequency livestream sessions.",
    codeLanguage: "python",
    codeTitleVi: "Kiểm định giả thuyết thống kê phân phối GMV bằng SciPy",
    codeTitleEn: "Statistical Hypothesis Testing on GMV Distributions with SciPy",
    codeSnippet: `import numpy as np
import pandas as pd
from scipy import stats

def evaluate_channel_gmv(df: pd.DataFrame, group_col: str, metric_col: str):
    groups = [group[metric_col].dropna().values for _, group in df.groupby(group_col)]
    # Check normality on primary group
    shapiro_stat, shapiro_p = stats.shapiro(groups[0][:500])
    # Non-parametric Mann-Whitney U / Kruskal-Wallis for skewed e-commerce GMV
    h_stat, p_val = stats.kruskal(*groups)
    return {
        "normality_p": round(float(shapiro_p), 5),
        "kruskal_h": round(float(h_stat), 4),
        "p_value": round(float(p_val), 6),
        "significant": bool(p_val < 0.05)
    }`,
    tags: ["Data Reconciliation", "SQL 8-Stage", "SciPy Stats", "Kami Ely"],
  },
  {
    id: "library-bus-telemetry",
    slug: "from-ux-research-to-telemetry-architecture-library-bus",
    projectKey: "library-bus",
    projectSlug: "/projects/proj-library-bus",
    featured: false,
    categoryVi: "Product Analytics & Kiến trúc Dữ liệu",
    categoryEn: "Product Analytics & Data Architecture",
    readTimeVi: "6 phút đọc",
    readTimeEn: "6 min read",
    date: "2026-08",
    titleVi:
      "Từ Nghiên cứu UX đến Kiến trúc Telemetry: Thiết kế luồng dữ liệu cho Thư viện Lưu động",
    titleEn:
      "From UX Research to Telemetry Architecture: Designing Data Flows for a Mobile Library",
    excerptVi:
      "Kinh nghiệm chuyển hóa kết quả nghiên cứu người dùng và 34 màn hình Wireframe/UI thành lược đồ cơ sở dữ liệu và bảng điều khiển vận hành thời gian thực.",
    excerptEn:
      "Translating user research findings and 34 mobile/web wireframes into a relational database schema and real-time operational analytics dashboards.",
    problemVi:
      "Một sản phẩm số phục vụ cộng đồng như Thư viện Lưu động (Library Bus) thường gặp đứt gãy giữa thiết kế giao diện (UI/UX) và hệ thống dữ liệu hậu cần: Làm sao để người đọc đặt trước sách tại một trạm xe buýt di động mà tồn kho sách vẫn được đồng bộ chính xác theo thời gian thực?",
    problemEn:
      "Community-facing digital products like Library Bus often suffer from a disconnect between frontend UX design and backend logistics data: How can readers reserve books for a moving bus stop while keeping physical inventory synchronized in real time?",
    processVi: [
      "Khảo sát hành trình người dùng (User Journey) và đối chiếu trực tiếp giữa bản vẽ Wireframe với giao diện UI hoàn chỉnh trên 20 màn hình Web & 34 màn hình Mobile.",
      "Thiết kế máy trạng thái (State Machine) cho quy trình Mượn, Đặt trước và Quyên góp sách gắn liền với định vị lộ trình xe buýt.",
      "Xây dựng kiến trúc luồng dữ liệu (Analytics Dataflow) thu thập các chỉ số chuyển đổi phễu (Funnel Conversion), tỷ lệ hoàn thành phiếu mượn và mật độ nhu cầu theo từng điểm dừng.",
    ],
    processEn: [
      "Mapped the end-to-end User Journey and conducted side-by-side Wireframe-to-UI audits across 20 Web and 34 Mobile screens.",
      "Engineered a transactional State Machine for Borrowing, Reservation, and Book Donation tied to dynamic bus route schedules.",
      "Architected the Analytics Dataflow capturing funnel conversion rates, loan fulfillment velocity, and stop-level demand heatmaps.",
    ],
    findingsVi:
      "Khi Data Analyst tham gia ngay từ khâu thiết kế Wireframe và kiến trúc hệ thống, doanh nghiệp vừa tối ưu hóa được trải nghiệm người dùng vừa đảm bảo đầy đủ log dữ liệu sạch khi đo lường hiệu quả sản phẩm.",
    findingsEn:
      "When data analysts participate early in wireframing and system architecture, teams eliminate user friction while guaranteeing clean, complete event telemetry for downstream BI dashboards.",
    codeLanguage: "sql",
    codeTitleVi: "Truy vấn theo dõi tỷ lệ chuyển đổi Phễu Đặt trước & Mượn sách",
    codeTitleEn: "Funnel Conversion & Route Fulfillment Telemetry Query",
    codeSnippet: `SELECT
  bus_route_id,
  stop_name,
  COUNT(DISTINCT reservation_id) AS total_reservations,
  COUNT(DISTINCT CASE WHEN status = 'CHECKED_OUT' THEN reservation_id END) AS fulfilled_loans,
  ROUND(
    COUNT(DISTINCT CASE WHEN status = 'CHECKED_OUT' THEN reservation_id END) * 100.0
    / NULLIF(COUNT(DISTINCT reservation_id), 0),
    2
  ) AS fulfillment_rate_pct
FROM library_bus_transactions
WHERE transaction_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY bus_route_id, stop_name
ORDER BY fulfillment_rate_pct DESC;`,
    tags: ["Product Analytics", "UX Research", "System Architecture", "Library Bus"],
  },
  {
    id: "sql-8-stage-methodology",
    slug: "mastering-8-stage-sql-for-data-analysis-workflow",
    projectKey: "sql-methodology",
    projectSlug: "/about",
    featured: false,
    categoryVi: "Phương pháp luận Kỹ thuật",
    categoryEn: "Technical Methodology",
    readTimeVi: "5 phút đọc",
    readTimeEn: "5 min read",
    date: "2026-07",
    titleVi:
      "Ứng dụng Khung 8 Giai đoạn 'SQL for Data Analysis' vào Dự án Phân tích Dữ liệu",
    titleEn:
      "Applying the 8-Stage 'SQL for Data Analysis' Framework to Production Case Studies",
    excerptVi:
      "Cách tôi chuẩn hóa quy trình làm việc từ bước Khám phá lược đồ (Profiling) đến Phân tích Cohort, Chuỗi thời gian và Tối ưu hóa truy vấn.",
    excerptEn:
      "How I standardize my analytical workflow from initial schema profiling to Cohort Retention, Time-Series Window Functions, and Query Optimization.",
    problemVi:
      "Nhiều bản phân tích gặp sai sót do bước chuẩn bị dữ liệu và đặt giả thuyết thiếu tính hệ thống. Tôi xây dựng một khung quy trình chuẩn mực để áp dụng nhất quán cho mọi dự án trong portfolio.",
    problemEn:
      "Analytical projects often break down when data preparation and hypothesis formulation lack structure. I built a repeatable engineering framework to apply consistently across every project in my portfolio.",
    processVi: [
      "Giai đoạn 1-2 (Profiling & Data Prep): Kiểm tra phân phối, xử lý NULL, chuẩn hóa kiểu dữ liệu và đối soát khóa ngoại.",
      "Giai đoạn 3-5 (Time-Series, Cohorts & Text/Anomaly Analysis): Áp dụng Window Functions (LAG, LEAD, Rolling Averages) và phân tích giữ chân khách hàng.",
      "Giai đoạn 6-8 (Experimentation, Complex Silos & Story-Driven Output): Kết hợp kết quả kiểm định thống kê vào bảng tổng hợp phục vụ trực tiếp cho Dashboard điều hành.",
    ],
    processEn: [
      "Stages 1-2 (Profiling & Data Prep): Auditing distributions, handling NULLs, standardizing types, and verifying relational keys.",
      "Stages 3-5 (Time-Series, Cohorts & Anomaly Detection): Leveraging Window Functions (LAG, LEAD, Rolling Windows) and retention matrices.",
      "Stages 6-8 (Experimentation, Complex Silos & Executive Output): Shaping validated statistical outputs into clean marts for interactive dashboards.",
    ],
    findingsVi:
      "Việc tuân thủ kỷ luật 8 giai đoạn giúp giảm hơn 60% thời gian gỡ lỗi số liệu khi lên báo cáo, đồng thời giúp mã nguồn SQL luôn minh bạch, dễ bảo trì và dễ kiểm chứng.",
    findingsEn:
      "Following this disciplined 8-stage progression cuts downstream dashboard debugging time by over 60% while keeping SQL codebases modular, auditable, and reproducible.",
    codeLanguage: "sql",
    codeTitleVi: "Mẫu Window Function tính Trung bình trượt & Tăng trưởng kỳ trước",
    codeTitleEn: "Rolling 7-Day Average & Period-over-Period Growth Pattern",
    codeSnippet: `SELECT
  metric_date,
  daily_revenue,
  ROUND(AVG(daily_revenue) OVER (
    ORDER BY metric_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ), 2) AS rolling_7d_avg,
  ROUND(
    (daily_revenue - LAG(daily_revenue, 7) OVER (ORDER BY metric_date)) * 100.0
    / NULLIF(LAG(daily_revenue, 7) OVER (ORDER BY metric_date), 0),
    2
  ) AS wow_growth_pct
FROM daily_kpi_fact;`,
    tags: ["SQL for Data Analysis", "Window Functions", "Cohort Analysis", "Best Practices"],
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "academic-advisor",
    roleType: "academic",
    quoteVi:
      "Hùng thể hiện tư duy nghiên cứu định lượng rất nghiêm túc và độc lập. Bên cạnh các thống kê mô tả, bạn chủ động kiểm toán nguồn dữ liệu, đặt câu hỏi phản biện về sự phân hóa vùng miền và sử dụng bằng chứng thống kê thuyết phục để bảo vệ luận điểm chính sách.",
    quoteEn:
      "Hùng demonstrated strong quantitative rigor and independent research maturity. Beyond descriptive statistics, he proactively audited raw data sources, questioned regional disparities, and used solid statistical evidence to defend policy conclusions.",
    authorVi: "Giảng viên Hướng dẫn Nghiên cứu Khoa học",
    authorEn: "Academic Research Advisor",
    titleVi: "Hội đồng Đánh giá Nghiên cứu Khoa học Sinh viên",
    titleEn: "University Scientific Research Committee",
    contextVi: "Dự án Kinh tế học Du lịch Di sản Nhật Bản (Heritage Japan)",
    contextEn: "Japanese World Heritage Tourism Research Project",
    projectLink: "/projects/proj-heritage-japan",
  },
  {
    id: "ecommerce-stakeholder",
    roleType: "business",
    quoteVi:
      "Điểm mạnh nhất của Hùng là khả năng biến những bảng dữ liệu TikTok Shop rối rắm và chênh lệch giữa các nguồn thành một bức tranh rõ ràng, đáng tin cậy. Các phân tích về hiệu quả Creator và cấu trúc giá SKU của bạn giúp đội ngũ vận hành biết chính xác cần tối ưu ở đâu.",
    quoteEn:
      "Hùng's greatest strength is turning messy, conflicting e-commerce exports into a single, trustworthy picture. His reconciliation of Creator vs. Shop GMV and SKU pricing analysis gave our operations team clear, actionable priorities.",
    authorVi: "Quản lý Vận hành Thương mại Điện tử",
    authorEn: "E-Commerce Operations Lead",
    titleVi: "Đối tác Dự án Phân tích Tăng trưởng TikTok Shop",
    titleEn: "TikTok Shop Growth Analytics Stakeholder",
    contextVi: "Dự án Phân tích Toàn diện Kami Ely",
    contextEn: "Kami Ely End-to-End Analytics Case Study",
    projectLink: "/projects/proj-kami-ely",
  },
  {
    id: "product-collaborator",
    roleType: "peer",
    quoteVi:
      "Làm việc cùng Hùng rất hiệu quả vì bạn vừa hiểu sâu về cấu trúc cơ sở dữ liệu (SQL), vừa có tư duy trải nghiệm người dùng (UX). Bạn luôn biết cách giải thích các thuật toán và luồng dữ liệu phức tạp thành ngôn ngữ trực quan mà mọi thành viên trong nhóm đều nắm bắt được.",
    quoteEn:
      "Collaborating with Hùng is highly effective and direct because he bridges deep SQL/data architecture knowledge with strong UX intuition. He consistently translates complex data pipelines and statistical logic into visual stories that everyone on the team can immediately understand.",
    authorVi: "Cộng sự Thiết kế & Phát triển Hệ thống",
    authorEn: "Product & Systems Collaborator",
    titleVi: "Nhóm Dự án Sản phẩm & Kiến trúc Dữ liệu",
    titleEn: "Product UX & Data Architecture Team",
    contextVi: "Dự án Hệ sinh thái Thư viện Lưu động (Library Bus)",
    contextEn: "Library Bus UX & Telemetry System",
    projectLink: "/projects/proj-library-bus",
  },
];
