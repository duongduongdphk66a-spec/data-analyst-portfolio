'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2 
} from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

type Lang = 'vi' | 'en';
type SkillFilter = 'ALL' | 'SQL' | 'PYTHON' | 'BI' | 'PRODUCT';

interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  domainTag: string;
  categories: SkillFilter[];
  summary: string;
  keyOutcomes: string[];
  technicalDeepDive: string[];
  tools: string[];
  proofLink?: {
    label: string;
    href: string;
  };
}

interface SnapshotMetric {
  label: string;
  value: string;
  sub: string;
}

const SNAPSHOT_METRICS: Record<Lang, SnapshotMetric[]> = {
  vi: [
    { label: 'Quy mô GMV Phân tích', value: '31,6 Tỉ đ', sub: '15,01 Tỉ (Chu kỳ 231d)' },
    { label: 'Kho Dữ liệu SQL', value: '21.573 Dòng', sub: '9 Bảng • Star Schema' },
    { label: 'Mô hình & Kiểm định', value: 'R² = 0,84', sub: 'OLS • DiD • What-If ROI' },
    { label: 'Kiến trúc & Dashboard', value: '20 Cặp Màn hình', sub: 'End-to-End Dataflow' },
  ],
  en: [
    { label: 'Audited GMV Scale', value: '31.6B VND', sub: '15.01B (231d Cycle)' },
    { label: 'SQL Warehouse', value: '21,573 Rows', sub: '9 Tables • Star Schema' },
    { label: 'Models & Econometrics', value: 'R² = 0.84', sub: 'OLS • DiD • What-If ROI' },
    { label: 'Systems & Dashboards', value: '20 Screen Pairs', sub: 'End-to-End Dataflow' },
  ],
};

const CONTENT: Record<
  Lang,
  {
    badge: string;
    title: string;
    subtitle: string;
    downloadCv: string;
    snapshotTitle: string;
    filterLabel: string;
    filters: { key: SkillFilter; label: string }[];
    outcomesTitle: string;
    techToggleOpen: string;
    techToggleClose: string;
    ctaBottomTitle: string;
    ctaBottomDesc: string;
    ctaBottomBtn: string;
    experiences: ExperienceItem[];
  }
> = {
  vi: {
    badge: 'Hành trình Chuyên môn & Tác động Kinh doanh',
    title: 'Kinh nghiệm làm việc & Dự án trọng điểm',
    subtitle:
      'Mỗi giai đoạn dưới đây thể hiện quá trình chuyển hóa các bài toán dữ liệu phức tạp thành kết quả định lượng và hệ thống vận hành thực tế.',
    downloadCv: 'Tải bản đầy đủ CV (PDF)',
    snapshotTitle: 'Tóm tắt năng lực cốt lõi (Career Snapshot)',
    filterLabel: 'Lọc theo nhóm chuyên môn:',
    filters: [
      { key: 'ALL', label: 'Tất cả' },
      { key: 'SQL', label: 'SQL & ETL Pipeline' },
      { key: 'PYTHON', label: 'Python & Thống kê ứng dụng' },
      { key: 'BI', label: 'Power BI / Tableau & Storytelling' },
      { key: 'PRODUCT', label: 'Product & System Analytics' },
    ],
    outcomesTitle: 'Tác động Kinh doanh (Business Outcomes)',
    techToggleOpen: 'Xem chi tiết Kỹ thuật & Phương pháp (Technical Deep-Dive) ↓',
    techToggleClose: 'Thu gọn chi tiết kỹ thuật ↑',
    ctaBottomTitle: 'Muốn kiểm chứng trực tiếp kỹ năng viết SQL & Phân tích của tôi?',
    ctaBottomDesc:
      'Bạn có thể chạy thử truy vấn trực tiếp trên SQL Lab hoặc tương tác với các biểu đồ dữ liệu sống ngay trong trang Dự án.',
    ctaBottomBtn: 'Trải nghiệm các Case Study ngay →',
    experiences: [
      {
        id: 'exp-1',
        period: 'Kinh nghiệm Dự án • E-Commerce & Creator Economy',
        role: 'Data Analyst: Thương mại Điện tử & Phân tích Kênh bán',
        organization: 'Dự án Phân tích Chuyên sâu TikTok Shop (Kami Ely)',
        domainTag: 'E-Commerce & TikTok Shop Analytics',
        categories: ['SQL', 'PYTHON', 'BI'],
        summary:
          'Giải quyết bài toán phân mảnh dữ liệu giữa hiệu suất Nhà sáng tạo (Creator/Affiliate), danh mục sản phẩm (SKU Matrix) và doanh thu thực tế trên nền tảng thương mại điện tử.',
        keyOutcomes: [
          'Xây dựng quy trình đối soát dữ liệu (Data Reconciliation) giúp phát hiện sai lệch số liệu và đảm bảo tính toàn vẹn cho báo cáo doanh thu.',
          'Phân tích ma trận SKU, chiến lược định giá và hiệu quả Livestream/Video để xác định nhóm sản phẩm mang lại biên lợi nhuận chủ lực.',
          'Áp dụng cấu trúc Minto Pyramid để chuyển hóa kết quả phân tích thống kê thành khuyến nghị hành động trực tiếp cho vận hành.',
        ],
        technicalDeepDive: [
          'SQL Playbook 7 giai đoạn: Thiết kế kiến trúc bảng, làm sạch dữ liệu (Profile & Clean), phân tích chuỗi thời gian (Time Series), Cohort Retention, Funnel chuyển đổi, phát hiện bất thường (Anomalies) và bảo mật ETL/PII.',
          'Python & Thống kê ứng dụng: Thực hiện EDA, phân tích tương quan (Correlation), kiểm định giả thuyết thống kê (Hypothesis Testing) và mô hình tối ưu hóa danh mục.',
        ],
        tools: ['SQL', 'Python', 'Applied Statistics', 'Minto Pyramid', 'Data Reconciliation'],
        proofLink: {
          label: 'Mở Case Study & SQL Lab Kami Ely →',
          href: '/projects/kami-ely',
        },
      },
      {
        id: 'exp-2',
        period: 'Kinh nghiệm Dự án • Product Analytics & System Design',
        role: 'Product & BI Analyst: Thiết kế Hệ thống & Dashboard Quản trị',
        organization: 'Hệ sinh thái Thư viện Lưu động (Library Bus)',
        domainTag: 'System Architecture & BI Dashboard',
        categories: ['PRODUCT', 'BI', 'SQL'],
        summary:
          'Kết nối từ nghiên cứu trải nghiệm người dùng (UX Research), thiết kế luồng nghiệp vụ Backend đến xây dựng hệ thống Dashboard theo dõi giao dịch, mượn trả và hiệu suất đội xe theo thời gian thực.',
        keyOutcomes: [
          'Chuẩn hóa luồng dữ liệu toàn trình (End-to-End Analytics Dataflow) từ ứng dụng người dùng đến hệ thống quản trị trung tâm.',
          'Thiết kế hệ thống 4 nhóm Dashboard chuyên biệt: Quản lý thư viện, Giao dịch mượn/trả, Phân tích hành vi người dùng và Analytics tổng thể.',
          'Chuyển hóa các yêu cầu vận hành phức tạp thành Wireframe và UI trực quan giúp rút ngắn khoảng cách giữa đội ngũ Business và Engineering.',
        ],
        technicalDeepDive: [
          'Thiết kế sơ đồ kiến trúc hệ thống (System Architecture Graph) và quy trình nghiệp vụ mượn trả/đặt trước sách (Borrowing Workflow).',
          'Xây dựng bộ chỉ số đo lường (Metrics Architecture) theo dõi vòng quay sách, tỷ lệ quyên góp và hiệu suất hoạt động của từng tuyến xe buýt.',
        ],
        tools: ['BI Dashboard', 'Dataflow Architecture', 'SQL', 'UX Research', 'Wireframing'],
        proofLink: {
          label: 'Xem Kiến trúc & Dashboard Library Bus →',
          href: '/projects/library-bus',
        },
      },
      {
        id: 'exp-3',
        period: 'Giai đoạn Nghiên cứu Định lượng • Data Audit & Policy',
        role: 'Quantitative Data Researcher: Kiểm toán Dữ liệu & Đánh giá Chính sách',
        organization: 'Nghiên cứu Di sản & Chính sách Bảo tồn (Heritage Japan)',
        domainTag: 'Data Audit & Policy Evaluation',
        categories: ['PYTHON', 'BI'],
        summary:
          'Thực hiện kiểm toán chất lượng dữ liệu (Data Audit) và phân tích định lượng đa chiều nhằm đánh giá tác động thực tế của các chính sách bảo tồn di sản tại Nhật Bản.',
        keyOutcomes: [
          'Thực hiện Data Audit toàn diện nhằm nhận diện độ lệch, dữ liệu khuyết thiếu và chuẩn hóa bộ dữ liệu phục vụ phân tích chính sách.',
          'Trực quan hóa dữ liệu chuyên sâu qua hệ thống biểu đồ phân tích (Visual Suite) làm rõ mối tương quan giữa phân bổ nguồn lực và hiệu quả bảo tồn.',
          'Xây dựng báo cáo Executive Story giúp người đọc nắm bắt nhanh kết luận cốt lõi từ các bằng chứng thống kê phức tạp.',
        ],
        technicalDeepDive: [
          'Phân tích định lượng kết hợp đánh giá các trường hợp điển hình (Case Studies) qua nhiều chương phân tích có cấu trúc chặt chẽ.',
          'Thiết kế bộ biểu đồ chuẩn học thuật & quản trị (Coded Charts & Visual Suite) để truyền tải thông điệp dữ liệu chính xác.',
        ],
        tools: ['Data Audit', 'Quantitative Analysis', 'Data Visualization', 'Policy Evaluation'],
        proofLink: {
          label: 'Đọc Nghiên cứu Heritage Japan →',
          href: '/projects/heritage-japan',
        },
      },
    ],
  },
  en: {
    badge: 'Proven Track Record & Business Impact',
    title: 'Experience & High-Impact Engagements',
    subtitle:
      'This timeline highlights how I translate complex data problems into quantified business outcomes and production-ready analytics.',
    downloadCv: 'Download Full CV (PDF)',
    snapshotTitle: 'Career Snapshot & Core Competencies',
    filterLabel: 'Filter by competency:',
    filters: [
      { key: 'ALL', label: 'All' },
      { key: 'SQL', label: 'SQL & ETL Pipelines' },
      { key: 'PYTHON', label: 'Python & Applied Statistics' },
      { key: 'BI', label: 'Power BI / Tableau & Storytelling' },
      { key: 'PRODUCT', label: 'Product & System Analytics' },
    ],
    outcomesTitle: 'Measurable Business Outcomes',
    techToggleOpen: 'View Technical Execution & Methodology ↓',
    techToggleClose: 'Hide Technical Details ↑',
    ctaBottomTitle: 'Want to test my SQL & Analytical thinking live?',
    ctaBottomDesc:
      'Run real queries in the interactive SQL Lab or explore live telemetry charts directly inside the Projects section.',
    ctaBottomBtn: 'Explore Interactive Case Studies →',
    experiences: [
      {
        id: 'exp-1',
        period: 'Applied Engagement • E-Commerce & Creator Economy',
        role: 'Data Analyst: Commercial & Creator Performance',
        organization: 'TikTok Shop Deep-Dive Analytics (Kami Ely)',
        domainTag: 'E-Commerce & TikTok Shop Analytics',
        categories: ['SQL', 'PYTHON', 'BI'],
        summary:
          'Bridged fragmented data across affiliate creator telemetry, SKU pricing matrices, and shop sales to uncover sustainable revenue drivers.',
        keyOutcomes: [
          'Engineered an end-to-end Data Reconciliation workflow to resolve telemetry discrepancies and ensure single-source-of-truth reporting.',
          'Evaluated SKU matrices, catalog pricing, and livestream/video conversion to pinpoint high-margin revenue levers.',
          'Structured complex statistical findings into an executive Minto Pyramid narrative for rapid stakeholder decision-making.',
        ],
        technicalDeepDive: [
          '7-Stage SQL Playbook: Schema architecture, data profiling & cleaning, time-series trends, cohort retention, conversion funnels, anomaly detection, and ETL/PII governance.',
          'Python & Applied Statistics: Conducted EDA, correlation matrices, hypothesis testing, and portfolio optimization modeling.',
        ],
        tools: ['SQL', 'Python', 'Applied Statistics', 'Minto Pyramid', 'Data Reconciliation'],
        proofLink: {
          label: 'Inspect Kami Ely Case Study & SQL Lab →',
          href: '/projects/kami-ely',
        },
      },
      {
        id: 'exp-2',
        period: 'Applied Engagement • Product Analytics & System Design',
        role: 'Product & BI Analyst: System Architecture & Executive Dashboards',
        organization: 'Mobile Library Ecosystem (Library Bus)',
        domainTag: 'System Architecture & BI Dashboard',
        categories: ['PRODUCT', 'BI', 'SQL'],
        summary:
          'Connected UX research, backend borrowing logic, and analytics dataflows to build an operational intelligence suite for a mobile library network.',
        keyOutcomes: [
          'Designed the end-to-end Analytics Dataflow linking mobile user interactions with centralized management databases.',
          'Architected specialized dashboards covering Library Operations, Borrowing Transactions, User Behavior, and Executive Analytics.',
          'Translated business logic into interactive wireframes and high-fidelity UI specifications, aligning product and engineering teams.',
        ],
        technicalDeepDive: [
          'Mapped full system architecture graphs and multi-step book borrowing/reservation state machines.',
          'Defined core operational KPIs tracking fleet utilization, book circulation velocity, and community donation funnels.',
        ],
        tools: ['BI Dashboard', 'Dataflow Architecture', 'SQL', 'UX Research', 'Wireframing'],
        proofLink: {
          label: 'Explore Library Bus Architecture & Dashboards →',
          href: '/projects/library-bus',
        },
      },
      {
        id: 'exp-3',
        period: 'Quantitative Research • Data Audit & Policy',
        role: 'Quantitative Data Researcher: Data Audit & Policy Evaluation',
        organization: 'Cultural Heritage & Policy Study (Heritage Japan)',
        domainTag: 'Data Audit & Policy Evaluation',
        categories: ['PYTHON', 'BI'],
        summary:
          'Executed rigorous data auditing and multi-dimensional quantitative analysis to evaluate the effectiveness of heritage preservation policies in Japan.',
        keyOutcomes: [
          'Conducted comprehensive Data Audits to identify structural biases, missingness, and anomalies across historical datasets.',
          'Built an interactive Visual Suite illustrating regional resource allocation and policy outcomes.',
          'Synthesized empirical findings into a clear executive narrative for non-technical readers.',
        ],
        technicalDeepDive: [
          'Combined macro-level statistical evaluation with comparative regional case studies.',
          'Developed reproducible coded charts to communicate multi-variable trends with high visual clarity.',
        ],
        tools: ['Data Audit', 'Quantitative Analysis', 'Data Visualization', 'Policy Evaluation'],
        proofLink: {
          label: 'Read Heritage Japan Analysis →',
          href: '/projects/heritage-japan',
        },
      },
    ],
  },
};

export default function ExperiencePage() {
  const { language } = useLanguage();
  const lang: Lang = language === 'en' ? 'en' : 'vi';

  const [activeFilter, setActiveFilter] = useState<SkillFilter>('ALL');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'exp-1': true,
  });

  const t = CONTENT[lang];
  const snapshotMetrics = SNAPSHOT_METRICS[lang];

  const filteredExperiences = t.experiences.filter((exp) =>
    activeFilter === 'ALL' ? true : exp.categories.includes(activeFilter)
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-12 md:space-y-16">
      
      {/* 1. TOP BAR: Status Badge & Download CV */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/10 border border-[#9BE7FA]/40 text-[#074553] dark:text-[#9BE7FA] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{t.badge}</span>
        </div>

        <a
          href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span>{t.downloadCv}</span>
        </a>
      </div>

      {/* 2. HEADER: Page Title & Executive Introduction */}
      <header className="space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          {t.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {t.subtitle}
        </p>
      </header>

      {/* 3. CAREER SNAPSHOT BAR: 4 Core Competency Metric Cards */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {t.snapshotTitle}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {snapshotMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-[#C8EEF7] dark:border-slate-800/80 hover:border-[#9BE7FA] transition-colors"
            >
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {metric.label}
              </div>
              <div className="text-lg sm:text-xl font-extrabold tabular-nums text-slate-900 dark:text-white mt-1">
                {metric.value}
              </div>
              <div className="text-xs text-[#074553] dark:text-[#9BE7FA] font-medium mt-0.5 tabular-nums">
                {metric.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE SKILL & DOMAIN FILTER */}
      <section className="space-y-3">
        <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {t.filterLabel}
        </div>
        <div className="flex flex-wrap gap-2">
          {t.filters.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-colors border cursor-pointer ${
                  isActive
                    ? 'bg-[#9BE7FA] text-[#074553] border-[#9BE7FA]'
                    : 'bg-white dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:border-[#9BE7FA]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. INTERACTIVE IMPACT TIMELINE */}
      <section className="relative border-l-2 border-[#C8EEF7] dark:border-slate-800 ml-3 md:ml-4 pl-6 md:pl-8 space-y-10">
        {filteredExperiences.map((exp) => {
          const isExpanded = !!expandedIds[exp.id];
          return (
            <article
              key={exp.id}
              className="relative group rounded-3xl bg-white dark:bg-slate-900/60 border border-[#C8EEF7] dark:border-slate-800/90 hover:border-[#9BE7FA] p-6 sm:p-8 transition-colors space-y-6"
            >
              {/* Timeline Indicator Dot */}
              <span className="absolute -left-[33px] md:-left-[41px] top-8 w-4 h-4 rounded-full bg-[#9BE7FA] ring-4 ring-white dark:ring-slate-950 border-2 border-[#074553]" />

              {/* Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
                    {exp.period}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {exp.role}
                  </h2>
                  <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {exp.organization}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#C8EEF7]/45 dark:bg-[#9BE7FA]/10 border border-[#9BE7FA]/30 text-[#074553] dark:text-[#9BE7FA] text-xs font-semibold">
                  {exp.domainTag}
                </span>
              </div>

              {/* Business Problem & Context Summary */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {exp.summary}
              </p>

              {/* Measurable Business Outcomes */}
              <div className="space-y-3 bg-[#F8FCFD] dark:bg-slate-950/70 p-5 rounded-2xl border border-[#C8EEF7] dark:border-slate-800/80">
                <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{t.outcomesTitle}</span>
                </h3>
                <ul className="space-y-2.5">
                  {exp.keyOutcomes.map((outcome, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expandable Technical Deep-Dive */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => toggleExpand(exp.id)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold text-[#074553] dark:text-[#9BE7FA] hover:bg-[#C8EEF7]/30 dark:hover:bg-[#9BE7FA]/10 border border-[#9BE7FA]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isExpanded ? t.techToggleClose : t.techToggleOpen}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <ul className="p-5 rounded-2xl bg-[#C8EEF7]/20 dark:bg-[#9BE7FA]/5 border border-[#9BE7FA]/30 space-y-2.5">
                    {exp.technicalDeepDive.map((tech, idx) => (
                      <li
                        key={idx}
                        className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#074553] dark:bg-[#9BE7FA] shrink-0 mt-2" />
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer: Tech Tools & Proof-of-Work Link */}
              <div className="pt-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {exp.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 rounded-lg bg-[#F8FCFD] dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {exp.proofLink && (
                  <Link
                    href={exp.proofLink.href}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] text-xs sm:text-sm font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer border border-[#9BE7FA]"
                  >
                    <span>{exp.proofLink.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {/* 6. BOTTOM CTA: Direct Bridge to Projects & Interactive SQL Lab */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#F0F9FB] dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.ctaBottomTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.ctaBottomDesc}
          </p>
        </div>
        <Link
          href="/projects/proj-kami-ely"
          className="min-h-[44px] px-6 py-3 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] font-extrabold text-sm whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer border border-[#9BE7FA]"
        >
          <span>{t.ctaBottomBtn}</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </Link>
      </section>

    </main>
  );
}
