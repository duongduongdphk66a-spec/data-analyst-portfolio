"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { usePortfolioData } from "@/app/context/PortfolioDataContext";
import { BLOG_POSTS } from "@/app/data/blogData";
import { DEFAULT_PROFILE } from "@/app/defaultData";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";

/* ============================================================================
 * OFFICIAL 4-COLOR PALETTE SVG ILLUSTRATIONS
 * (#9BE7FA Primary Cyan | #C8EEF7 Ice Light | #FFE485 Butter Gold | #FFD14C Amber Gold)
 * ============================================================================ */

function CollectIllustration({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Checklist boxes in #9BE7FA & #C8EEF7 */}
      <rect x="10" y="10" width="22" height="22" rx="5" fill="#9BE7FA" />
      <path
        d="M15.5 21L19.5 25L26.5 17"
        stroke="#074553"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="10" y="39" width="22" height="22" rx="5" fill="#C8EEF7" />
      <rect x="10" y="68" width="22" height="22" rx="5" fill="#9BE7FA" />

      {/* Pencil in #FFD14C & #FFE485 */}
      <g transform="rotate(42 62 48)">
        <rect x="52" y="14" width="18" height="58" rx="3" fill="#FFD14C" />
        <rect x="52" y="6" width="18" height="10" rx="4" fill="#FFE485" />
        <polygon points="52,72 70,72 61,88" fill="#C8EEF7" />
        <polygon points="58,82 64,82 61,88" fill="#074553" />
      </g>
    </svg>
  );
}

function ProcessIllustration({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Gear in #9BE7FA */}
      <path
        d="M54 8H66L68 15.5C70.5 16.4 72.8 17.8 74.7 19.6L82 17L88 27.4L82.2 32.8C82.7 35.1 82.7 37.5 82.2 39.8L88 45.2L82 55.6L74.7 53C72.8 54.8 70.5 56.2 68 57.1L66 64.6H54L52 57.1C49.5 56.2 47.2 54.8 45.3 53L38 55.6L32 45.2L37.8 39.8C37.3 37.5 37.3 35.1 37.8 32.8L32 27.4L38 17L45.3 19.6C47.2 17.8 49.5 16.4 52 15.5L54 8Z"
        fill="#9BE7FA"
      />
      <circle cx="60" cy="36.3" r="8.5" fill="#074553" />

      {/* Hierarchy Connectors in #C8EEF7 */}
      <path
        d="M60 65V75M60 75H26V82M60 75V82M60 75H94V82"
        stroke="#C8EEF7"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Nodes in #FFD14C & #FFE485 */}
      <rect x="12" y="80" width="28" height="12" rx="3.5" fill="#FFE485" />
      <rect x="46" y="80" width="28" height="12" rx="3.5" fill="#FFD14C" />
      <rect x="80" y="80" width="28" height="12" rx="3.5" fill="#FFE485" />
    </svg>
  );
}

function VisualiseIllustration({ className = "w-16 h-16" }: { className?: string }) {
  const colHeights = [5, 3, 4, 5, 4, 6, 6, 8];
  return (
    <svg
      viewBox="0 0 120 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {colHeights.map((height, colIdx) => {
        const cx = 14 + colIdx * 13;
        return Array.from({ length: height }).map((_, rowIdx) => {
          const cy = 86 - rowIdx * 10.5;
          const fill =
            rowIdx === 0
              ? "#FFD14C"
              : colIdx % 3 === 0
              ? "#9BE7FA"
              : colIdx % 3 === 1
              ? "#FFE485"
              : "#C8EEF7";
          return (
            <circle
              key={`${colIdx}-${rowIdx}`}
              cx={cx}
              cy={cy}
              r="4.3"
              fill={fill}
            />
          );
        });
      })}
    </svg>
  );
}

export default function AboutSection() {
  const { language } = useLanguage();
  const { profile } = usePortfolioData();
  const isVi = language === "vi";

  const displayName = (profile?.name || DEFAULT_PROFILE.name || "Ma Văn Hùng").replace(/^Mã\s+/i, "Ma ");
  const emailAddress = profile?.email?.trim() || DEFAULT_PROFILE.email || "mavanhung.da@gmail.com";
  const githubUrl = profile?.github?.trim() || DEFAULT_PROFILE.github || "";
  const linkedinUrl = profile?.linkedin?.trim() || DEFAULT_PROFILE.linkedin || "";

  const provenTools = isVi
    ? ["SQL", "Python", "Thống kê ứng dụng", "Recharts", "BI Spec (Power BI / Looker)"]
    : ["SQL", "Python", "Applied Statistics", "Recharts", "BI Spec (Power BI / Looker)"];

  const projectQuestions = [
    {
      href: "/projects/proj-kami-ely",
      domain: isVi ? "E-Commerce & TikTok Shop" : "E-Commerce & TikTok Shop",
      title: "Kami Ely",
      question: isVi
        ? "Doanh thu tăng vọt đến từ giảm giá theo ngày hay do mạng lưới KOL/KOC?"
        : "Did sales spikes come from daily discounting or the KOL/KOC affiliate network?",
      metrics: [
        {
          value: isVi ? "15,01 tỷ VNĐ" : "15.01B VND",
          label: isVi ? "GMV ước tính (231 ngày)" : "Est. GMV (231 days)",
        },
        {
          value: "101.896",
          label: isVi ? "Sản phẩm bán ra (231 ngày)" : "Units sold (231 days)",
        },
        {
          value: isVi ? "231 ngày" : "231 days",
          label: "09/03 - 25/10/2026",
        },
      ],
      sourceNote: isVi
        ? "Nguồn: 10 bảng ước tính FastMoss (231 ngày, 23.364 dòng), tách biệt hoàn toàn khỏi công việc tại Steve x Kami (2022–2023)."
        : "Source: 10 FastMoss estimated tables (231 days, 23,364 rows), separate from the 2022–2023 role at Steve x Kami.",
      accent: "cyan" as const,
    },
    {
      href: "/projects/proj-heritage-japan",
      domain: isVi ? "Chuỗi thời gian & Nghiên cứu" : "Time-Series & Research",
      title: "Heritage Japan",
      question: isVi
        ? "Du lịch Nhật Bản mở rộng ra sao trước dịch và tạo áp lực thế nào lên điểm di sản?"
        : "How did inbound Japanese tourism scale pre-pandemic and pressure local heritage sites?",
      metrics: [
        {
          value: isVi ? "31,9 triệu" : "31.9M",
          label: isVi ? "Lượt khách quốc tế (đỉnh 2019)" : "Inbound visitors (2019 peak)",
        },
        {
          value: isVi ? "4,81 nghìn tỷ Yên" : "¥4.81T",
          label: isVi ? "Chi tiêu du lịch (2019)" : "Inbound spending (2019)",
        },
        {
          value: "3.000 : 1",
          label: isVi ? "Tỷ lệ khách/dân tại Shirakawa-go" : "Visitor-to-resident ratio (Shirakawa-go)",
        },
      ],
      sourceNote: isVi
        ? "Nguồn: Dữ liệu công khai JNTO, MLIT và tư liệu khóa luận tại ĐHKHXH&NV - ĐHQGHN."
        : "Source: Public JNTO & MLIT statistics paired with undergraduate thesis research at VNU-USSH.",
      accent: "gold" as const,
    },
    {
      href: "/projects/proj-library-bus",
      domain: isVi ? "BA, Product Telemetry & UX/UI" : "BA, Product Telemetry & UX/UI",
      title: "Library Bus",
      question: isVi
        ? "Làm sao chống đặt trùng tồn kho khi mượn đồng thời và đo lường hiệu suất đội xe thư viện lưu động?"
        : "How do we prevent concurrent inventory race conditions and measure mobile library fleet telemetry?",
      metrics: [
        {
          value: isVi ? "7 Apps • 36 Models" : "7 Apps • 36 Models",
          label: isVi ? "Django 5.2 • MySQL 8.0 • UUIDv4" : "Django 5.2 • MySQL 8.0 • UUIDv4",
        },
        {
          value: "select_for_update()",
          label: isVi ? "Khóa bi quan ACID • BR-01..04" : "Pessimistic ACID lock • BR-01..04",
        },
        {
          value: isVi ? "9 Cron • 171 Tests" : "9 Cron • 171 Tests",
          label: isVi ? "Celery Beat + Redis 7 • 11 luồng UI" : "Celery Beat + Redis 7 • 11 UI flows",
        },
      ],
      sourceNote: isVi
        ? "Nguồn: Đặc tả BA (BR-01..04), lược đồ Telemetry + prototype Django 5.2/MySQL 8.0 và 11 cặp màn hình Wireframe – UI."
        : "Source: BA rules (BR-01..04), Telemetry schema + Django 5.2/MySQL 8.0 prototype, and 11 Wireframe-to-UI screen pairs.",
      accent: "slate" as const,
    },
  ];

  const pillars = [
    {
      id: "collect",
      title: isVi ? "1. Thu thập & Đối soát" : "1. Collect & Reconcile",
      subtitle: isVi ? "Chuẩn hóa định nghĩa chỉ số" : "Lock metric definitions first",
      Illustration: CollectIllustration,
      desc: isVi
        ? "Tách bạch phạm vi thời gian, nguồn công khai (JNTO, MLIT) hoặc bảng ước tính (FastMoss CSV/Excel), kiểm tra trùng lặp và phân biệt rõ sản phẩm với đơn hàng trước khi tính."
        : "Separate reporting windows and raw sources (JNTO, MLIT, or FastMoss CSV/Excel exports), remove duplicates, and verify units versus orders before aggregating.",
    },
    {
      id: "process",
      title: isVi ? "2. Xử lý & Kiểm định" : "2. Process & Validate",
      subtitle: isVi ? "SQL và Python thống kê" : "SQL & Statistical Python",
      Illustration: ProcessIllustration,
      desc: isVi
        ? "Làm sạch bảng bằng SQL và Pandas, kiểm tra phân phối lệch và chạy hồi quy OLS, kiểm định Mann-Whitney U hoặc HHI bằng SciPy và Statsmodels để kiểm chứng giả thuyết."
        : "Clean tables with SQL and Pandas, test skewed distributions, and run OLS regression, Mann-Whitney U, and HHI concentration checks in SciPy and Statsmodels.",
    },
    {
      id: "visualise",
      title: isVi ? "3. Trực quan hóa" : "3. Visualise & Recommend",
      subtitle: isVi ? "Biểu đồ tương tác Recharts" : "Interactive Recharts Views",
      Illustration: VisualiseIllustration,
      desc: isVi
        ? "Dựng dashboard tương tác bằng Recharts trên nền web, trình bày từ câu hỏi kinh doanh đến con số kiểm chứng và gợi ý hành động cụ thể."
        : "Build interactive web dashboards in Recharts structured from the business question to verified numbers and concrete next actions.",
    },
  ];

  return (
    <section id="about" className="py-6 sm:py-8 space-y-12 sm:space-y-14">
      {/* =====================================================================
       * 1. HERO: FRESHER DA / BA POSITIONING & DIRECT CONTACT
       * ===================================================================== */}
      <div className="rounded-3xl overflow-hidden border border-[#C8EEF7] dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 bg-[#F0F9FB] dark:bg-slate-900 text-slate-900 dark:text-white">
        {/* Left Identity Column */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-r border-[#C8EEF7] dark:border-slate-800 bg-white/75 dark:bg-slate-950/60">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FFE485] text-[#5C2808]">
              <span className="w-2 h-2 rounded-full bg-[#074553]" aria-hidden="true" />
              {isVi ? "Đang tìm Fresher DA / BA" : "Seeking Fresher DA / BA Roles"}
            </span>

            <div className="flex items-center gap-4">
              <div
                aria-label={`${displayName} initials`}
                className="w-16 h-16 rounded-2xl bg-[#9BE7FA] text-[#074553] font-extrabold text-xl tracking-tight flex items-center justify-center shrink-0"
              >
                MVH
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                  {displayName}
                </p>
                <p className="text-sm font-medium text-[#074553] dark:text-[#9BE7FA]">
                  Fresher Data Analyst / BA
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 mt-0.5 text-[#0D7287] dark:text-[#9BE7FA] shrink-0" aria-hidden="true" />
                <span>
                  {isVi
                    ? "Cử nhân Nhật Bản học, ĐHKHXH&NV - ĐHQGHN"
                    : "B.A. in Japanese Studies, VNU-USSH"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA] shrink-0" aria-hidden="true" />
                <span>{isVi ? "Hà Nội, Việt Nam" : "Hanoi, Vietnam"}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {isVi ? "Công cụ sử dụng trong dự án" : "Tools backed by repo projects"}
              </p>
              <div className="flex flex-wrap gap-2">
                {provenTools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#C8EEF7]/70 dark:bg-slate-800 text-[#074553] dark:text-[#9BE7FA] border border-[#9BE7FA]/60 dark:border-slate-700"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <a
              href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
              download
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#9BE7FA] hover:bg-[#7ADCF7] text-[#074553] text-sm font-bold cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              {isVi ? "Tải CV PDF" : "Download CV"}
            </a>

            <a
              href={`mailto:${emailAddress}`}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-[#C8EEF7]/50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-sm font-semibold cursor-pointer transition-colors"
            >
              <Mail className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" aria-hidden="true" />
              {isVi ? "Gửi email" : "Email me"}
            </a>

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-[#C8EEF7]/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-sm font-medium cursor-pointer transition-colors"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
                <span>GitHub</span>
              </a>
            )}

            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-[#C8EEF7]/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-sm font-medium cursor-pointer transition-colors"
              >
                <Linkedin className="w-4 h-4" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Narrative Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center gap-5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white text-balance">
            {isVi
              ? "Mình biến dữ liệu bán hàng và chuỗi thời gian thành khuyến nghị cụ thể."
              : "I turn sales and time-series data into specific operational recommendations."}
          </h1>

          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-prose">
            {isVi
              ? "Từ nền tảng Nhật Bản học tại ĐHKHXH&NV, mình chuyển sang làm sạch dữ liệu bảng bằng SQL và Python, kiểm định giả thuyết bằng thống kê và dựng biểu đồ tương tác bằng Recharts. Với mỗi bài toán, mình ghi rõ nguồn dữ liệu, phạm vi thời gian và phần chưa kiểm chứng được trước khi đưa ra đề xuất."
              : "With a B.A. in Japanese Studies from VNU-USSH, I moved into cleaning tabular records with SQL and Python, testing hypotheses with applied statistics, and building Recharts dashboards. In each project, I document data sources, time windows, and measurement gaps before proposing actions."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="rounded-2xl p-4 bg-white dark:bg-slate-800/70 border border-[#C8EEF7] dark:border-slate-700">
              <p className="text-xs font-semibold text-[#074553] dark:text-[#9BE7FA]">
                {isVi ? "Kinh nghiệm thực tế" : "Hands-on experience"}
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {isVi
                  ? "Nhân viên Hỗ trợ Vận hành & Báo cáo Dữ liệu E-Commerce tại Steve x Kami (2022–2023)"
                  : "E-Commerce Operations & Data Reporting Staff (Full-time) at Steve x Kami (2022–2023)"}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {isVi
                  ? "Theo dõi báo cáo vận hành, SKU tồn kho và đối soát số liệu bán hàng trên sàn."
                  : "Tracked SKU inventory reports and reconciled store-level operational sheets."}
              </p>
            </div>

            <div className="rounded-2xl p-4 bg-white dark:bg-slate-800/70 border border-[#FFE485] dark:border-slate-700">
              <p className="text-xs font-semibold text-[#78350F] dark:text-[#FFE485]">
                {isVi ? "Liên hệ nhanh" : "Direct contact"}
              </p>
              <a
                href={`mailto:${emailAddress}`}
                className="block text-[13px] font-bold text-slate-900 dark:text-white mt-1 whitespace-nowrap truncate hover:underline"
                title={emailAddress}
              >
                {emailAddress}
              </a>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {isVi
                  ? "Sẵn sàng trao đổi bài kiểm tra kỹ thuật SQL, Python hoặc Business Analysis."
                  : "Available for Fresher DA / BA technical assessments and interviews."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * 2. THREE PROJECTS, THREE QUESTIONS
       * ===================================================================== */}
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isVi ? "Ba dự án, ba câu hỏi" : "Three projects, three questions"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-prose">
            {isVi
              ? "Mỗi case study giải một câu hỏi cụ thể, dùng số liệu đối soát theo trang dự án và ghi rõ nguồn thu thập."
              : "Each case study answers one focused question with metrics reconciled against its project page and explicit source attribution."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projectQuestions.map((item) => {
            const borderTone =
              item.accent === "cyan"
                ? "border-[#9BE7FA]/80 dark:border-slate-700"
                : item.accent === "gold"
                ? "border-[#FFE485] dark:border-slate-700"
                : "border-slate-200 dark:border-slate-700";

            const badgeTone =
              item.accent === "cyan"
                ? "bg-[#C8EEF7]/70 text-[#074553] dark:bg-slate-800 dark:text-[#9BE7FA]"
                : item.accent === "gold"
                ? "bg-[#FFE485]/60 text-[#5C2808] dark:bg-slate-800 dark:text-[#FFE485]"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group rounded-2xl border ${borderTone} bg-white dark:bg-slate-900 p-6 flex flex-col justify-between gap-5 hover:border-[#0D7287] dark:hover:border-[#9BE7FA] cursor-pointer transition-colors`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${badgeTone}`}>
                      {item.domain}
                    </span>
                    <ArrowUpRight
                      className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-[#0D7287] dark:group-hover:text-[#9BE7FA] transition-colors shrink-0"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-[#0D7287] dark:group-hover:text-[#9BE7FA] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                      {item.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 pt-1">
                    {item.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-xl px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 flex items-baseline justify-between gap-3"
                      >
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {metric.label}
                        </span>
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums shrink-0">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.sourceNote}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
                    {isVi ? "Xem chi tiết dự án" : "Open case study"}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
       * 3. HOW I WORK: COLLECT / PROCESS / VISUALISE (WITH 4-COLOR SVGs)
       * ===================================================================== */}
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isVi ? "Cách làm việc" : "How I work"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-prose">
            {isVi
              ? "Quy trình ba bước từ chuẩn hóa định nghĩa chỉ số đến kiểm định thống kê và trực quan hóa trên web."
              : "A three-step workflow from locking metric definitions to running statistical tests and publishing interactive views."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ id, title, subtitle, Illustration, desc }) => (
            <div
              key={id}
              className="rounded-2xl border border-[#C8EEF7] dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col gap-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-xs font-semibold text-[#074553] dark:text-[#9BE7FA] mt-0.5">
                    {subtitle}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-[#F0F9FB] dark:bg-slate-800 p-2 flex items-center justify-center shrink-0">
                  <Illustration className="w-full h-full" />
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
       * 4. BLOG PREVIEW (CONDENSED)
       * ===================================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isVi ? "Ghi chép phân tích" : "Analytical notes"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isVi
                ? "Các bài viết ngắn về xử lý dữ liệu và câu lệnh SQL/Python đằng sau dự án."
                : "Short write-ups on data cleaning, metric caveats, and the SQL or Python logic behind each project."}
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#9BE7FA] hover:bg-[#7ADCF7] text-[#074553] text-sm font-bold cursor-pointer transition-colors shrink-0"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            {isVi ? "Xem tất cả bài viết" : "All articles"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/blog?post=${post.slug}`}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4 hover:border-[#0D7287] dark:hover:border-[#9BE7FA] cursor-pointer transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-[#074553] dark:text-[#9BE7FA]">
                    {isVi ? post.categoryVi : post.categoryEn}
                  </span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {isVi ? post.readTimeVi : post.readTimeEn}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0D7287] dark:group-hover:text-[#9BE7FA] leading-snug transition-colors">
                  {isVi ? post.titleVi : post.titleEn}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {isVi ? post.excerptVi : post.excerptEn}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
                {isVi ? "Đọc bài" : "Read note"}
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
