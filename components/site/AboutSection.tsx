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
    ? ["SQL (MySQL / PostgreSQL)", "Python (pandas, SciPy)", "Excel & Google Sheets", "Recharts & BI Spec", "Technical BA (BRD, ERD, Tracking)"]
    : ["SQL (MySQL / PostgreSQL)", "Python (pandas, SciPy)", "Excel & Google Sheets", "Recharts & BI Spec", "Technical BA (BRD, ERD, Tracking)"];

  const competencyTracks = [
    {
      id: "da",
      badge: isVi ? "Nhánh Data Analytics (DA)" : "Data Analytics Track (DA)",
      title: isVi ? "Đối soát số liệu, thống kê & báo cáo" : "Reconciliation, statistics & reporting",
      accent: "cyan" as const,
      points: isVi
        ? [
            "Làm sạch và đối soát đa nguồn (10 bảng FastMoss 23.364 dòng; 6 chuỗi thống kê gốc tiếng Nhật JNTO/MLIT).",
            "Truy vấn SQL (CTE, Window Functions, Cohort, xử lý right-censoring) và Python (Pandas, SciPy, Statsmodels).",
            "Kiểm định giả thuyết phi tham số (Mann-Whitney U, Fisher Exact), phân tầng lát cắt chống Simpson's Paradox và đo tập trung Pareto/HHI.",
            "Thiết kế dashboard Recharts và đặc tả BI (Star Schema 4 Fact · 3 Dim, DAX cho Power BI / Looker Studio).",
          ]
        : [
            "Multi-source cleaning & reconciliation (10 FastMoss tables, 23,364 rows; 6 primary Japanese JNTO/MLIT series).",
            "SQL querying (CTEs, Window Functions, Cohorts, right-censoring guards) and Python (Pandas, SciPy, Statsmodels).",
            "Non-parametric testing (Mann-Whitney U, Fisher Exact), stratified checks against Simpson's Paradox, and Pareto/HHI concentration.",
            "Interactive Recharts dashboards and BI specifications (4-Fact · 3-Dim Star Schema, Power BI / Looker DAX).",
          ],
    },
    {
      id: "ba",
      badge: isVi ? "Nhánh Business Analysis (BA)" : "Business Analysis Track (BA)",
      title: isVi ? "Đặc tả nghiệp vụ, ERD & Tracking Plan" : "Requirements, ERD & Tracking Plan",
      accent: "gold" as const,
      points: isVi
        ? [
            "Khung hóa bài toán vận hành: As-Is/To-Be, ma trận 5 Stakeholder tách biệt System Actor và phân pha MoSCoW MVP.",
            "Đặc tả quy tắc nghiệp vụ có thể kiểm thử (BR-01..04), User Story Given–When–Then tách biệt ghi chú dev và ma trận RTM.",
            "Mô hình hóa dữ liệu lõi (tách BookTitle vs. BusBookInventory), định nghĩa Tracking Plan 8 sự kiện đồng bộ schema và khung Pilot 4 tuần.",
            "Chuyển kết quả phân tích thành kế hoạch hành động có người phụ trách, KPI, ngưỡng cắt lỗ và phân tích đánh đổi lợi ích – rủi ro.",
          ]
        : [
            "Operational scoping: As-Is/To-Be mapping, 5-stakeholder matrix separating system actors, and MoSCoW MVP phasing.",
            "Testable business rules (BR-01..04), Given–When–Then acceptance criteria separated from dev notes, and RTM traceability.",
            "Core relational modeling (separating BookTitle vs. BusBookInventory), schema-aligned 8-event Tracking Plan, and 4-week pilot design.",
            "Translating findings into prioritized action plans with owners, target KPIs, stop-loss thresholds, and trade-off analysis.",
          ],
    },
  ];

  const projectQuestions = [
    {
      href: "/projects/proj-kami-ely",
      domain: isVi ? "E-Commerce DA & BI Spec" : "E-Commerce DA & BI Spec",
      title: "Kami Ely",
      question: isVi
        ? "Doanh thu đến từ kênh nào, vì sao Tháng 8 giảm 83,1% và danh mục Thu Đông có thay thế được không?"
        : "Which channels drive revenue, why did August drop 83.1%, and can the autumn catalog replace summer swimwear?",
      summary: isVi
        ? "231 ngày (15,01 tỷ VNĐ, 101.896 sp) · Sửa bẫy cộng trùng +7,59 tỷ · Phân tầng Video Ads, Live >10h và luật KOC 2 tầng."
        : "231 days (15.01B VND, 101,896 units) · Fixed +7.59B double-count · Stratified Video Ads, >10h Live, and 2-tier KOC rule.",
      sourceNote: isVi
        ? "Nguồn: 10 bảng ước tính FastMoss (09/03–25/10/2026), tách biệt khỏi công việc tại Steve x Kami (2022–2023)."
        : "Source: 10 FastMoss estimated tables (Mar 09–Oct 25, 2026), separate from the 2022–2023 role at Steve x Kami.",
      accent: "cyan" as const,
    },
    {
      href: "/projects/proj-heritage-japan",
      domain: isVi ? "Data Audit & Chuỗi thời gian" : "Data Audit & Time-Series",
      title: "Heritage Japan",
      question: isVi
        ? "Du lịch Nhật Bản mở rộng ra sao giai đoạn 2013–2022 và tạo áp lực thế nào lên 5 điểm di sản UNESCO?"
        : "How did Japanese inbound tourism scale in 2013–2022 and strain 5 UNESCO heritage sites?",
      summary: isVi
        ? "Tự kiểm toán 5 lỗi từ niên luận gốc (đơn vị ×10 Nara, lệch năm Kyoto) · Đỉnh 31,9M khách, 4,81T ¥ (~0,86% GDP) và 3.000× tại Shirakawa-go."
        : "Audited 5 errors from original thesis (10× Nara units, Kyoto +1yr shift) · 31.9M peak, ¥4.81T (~0.86% GDP), and 3,000× at Shirakawa-go.",
      sourceNote: isVi
        ? "Nguồn: Dữ liệu công khai JNTO, MLIT, Kyoto, Nara và tư liệu niên luận tại ĐHKHXH&NV - ĐHQGHN (01/2024)."
        : "Source: Public JNTO, MLIT, Kyoto, Nara statistics paired with undergraduate quantitative thesis at VNU-USSH (Jan 2024).",
      accent: "gold" as const,
    },
    {
      href: "/projects/proj-library-bus",
      domain: isVi ? "Technical BA & Tracking Plan" : "Technical BA & Tracking Plan",
      title: "Library Bus",
      question: isVi
        ? "Làm sao chuẩn hóa quy trình mượn trả lưu động và thiết kế Tracking Plan đo hiệu suất tuyến xe?"
        : "How should we standardize mobile-library circulation rules and design an event Tracking Plan?",
      summary: isVi
        ? "As-Is/To-Be, MoSCoW, BR-01..04 (kèm ràng buộc offline & trần phạt), ERD 7 thực thể lõi, 8 sự kiện Tracking và khung Pilot 4 tuần."
        : "As-Is/To-Be, MoSCoW, BR-01..04 (with offline & fine-cap rules), 7-entity core ERD, 8 Tracking events, and 4-week pilot framework.",
      sourceNote: isVi
        ? "Nguồn: Tài liệu Mini-BRD/RTM, ERD lõi, Tracking Plan & prototype kiểm chứng (171 unit tests); chưa có dữ liệu vận hành thật."
        : "Source: Mini-BRD/RTM, core ERD, Tracking Plan & validation prototype (171 unit tests); no live production user data.",
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
      subtitle: isVi ? "SQL, Python & kiểm tra phân tầng" : "SQL, Python & stratified checks",
      Illustration: ProcessIllustration,
      desc: isVi
        ? "Làm sạch bảng bằng MySQL 8.0 và Pandas, kiểm tra phân tầng tránh Simpson's Paradox, chạy Panel Fixed-Effects, Mann-Whitney U và Pareto/HHI trong SciPy để kiểm chứng giả thuyết."
        : "Clean tables with MySQL 8.0 and Pandas, stratify checks against Simpson's Paradox, and run Panel Fixed-Effects, Mann-Whitney U, and Pareto/HHI checks in SciPy.",
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
              ? "Từ nền tảng Nhật Bản học và vận hành sàn TMĐT sang phân tích dữ liệu và nghiệp vụ."
              : "From Japanese Studies and e-commerce operations into data and business analysis."}
          </h1>

          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-prose">
            {isVi
              ? "Khả năng đọc trực tiếp thống kê gốc tiếng Nhật (JNTO, MLIT, Kyoto, Nara) cùng kinh nghiệm theo dõi đơn hàng, tồn kho SKU và báo cáo TikTok Shop tại Steve x Kami giúp mình nối được hai đầu công việc: đối soát số liệu sạch bằng SQL/Python và viết đặc tả nghiệp vụ (BRD, ERD, Tracking Plan) có thể triển khai. Ở mỗi dự án, mình nêu rõ nguồn dữ liệu, phạm vi thời gian và đánh đổi rủi ro trước khi đề xuất hành động."
              : "Reading primary Japanese statistical tables (JNTO, MLIT, Kyoto, Nara) alongside hands-on TikTok Shop order, SKU stock, and sales reporting at Steve x Kami lets me bridge both sides of the role: reconciling clean metrics in SQL/Python and writing actionable BA specifications (BRD, ERD, Tracking Plan). In each project, I state data sources, windows, and trade-offs before recommending actions."}
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
                  ? "Theo dõi đơn hằng ngày, tỷ lệ giao/hoàn hủy và tồn kho theo mã SKU trên TikTok Seller Center; tổng hợp báo cáo Excel/Google Sheets so sánh live nội bộ với affiliate."
                  : "Tracked daily orders, delivery/return rates, and SKU stock in TikTok Seller Center; built Excel/Google Sheets reports comparing in-house live vs. affiliate partners."}
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
       * 2. DA vs. BA COMPETENCY SPLIT
       * ===================================================================== */}
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isVi ? "Hai nhánh năng lực: DA và BA" : "Two capability tracks: DA and BA"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-prose">
            {isVi
              ? "Tách rõ phần kỹ năng phân tích định lượng và phần phân tích nghiệp vụ đã kiểm chứng trong 3 dự án."
              : "Clear separation between quantitative analytics skills and business analysis deliverables demonstrated across 3 projects."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competencyTracks.map((track) => (
            <div
              key={track.id}
              className={`rounded-2xl border p-6 bg-white dark:bg-slate-900 space-y-4 ${
                track.accent === "cyan"
                  ? "border-[#9BE7FA]/80 dark:border-slate-800"
                  : "border-[#FFE485] dark:border-slate-800"
              }`}
            >
              <div className="space-y-1.5">
                <span
                  className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                    track.accent === "cyan"
                      ? "bg-[#C8EEF7]/70 text-[#074553] dark:bg-slate-800 dark:text-[#9BE7FA]"
                      : "bg-[#FFE485]/60 text-[#5C2808] dark:bg-slate-800 dark:text-[#FFE485]"
                  }`}
                >
                  {track.badge}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {track.title}
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {track.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5">
                    <span
                      className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${
                        track.accent === "cyan" ? "bg-[#0D7287] dark:bg-[#9BE7FA]" : "bg-[#FFD14C]"
                      }`}
                      aria-hidden="true"
                    />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
       * 3. THREE PROJECTS, THREE QUESTIONS (COMPACT — NO METRIC DUPLICATION)
       * ===================================================================== */}
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isVi ? "Ba dự án, ba câu hỏi" : "Three projects, three questions"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-prose">
            {isVi
              ? "Mỗi dự án gắn với một bài toán cụ thể và ghi rõ giới hạn dữ liệu đầu vào."
              : "Each case study anchors on one operational question with explicit source scope."}
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
                className={`group rounded-2xl border ${borderTone} bg-white dark:bg-slate-900 p-6 flex flex-col justify-between gap-4 hover:border-[#0D7287] dark:hover:border-[#9BE7FA] cursor-pointer transition-colors`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${badgeTone}`}>
                      {item.domain}
                    </span>
                    <ArrowUpRight
                      className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-[#0D7287] dark:group-hover:text-[#9BE7FA] transition-colors shrink-0"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-[#0D7287] dark:group-hover:text-[#9BE7FA] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {item.question}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed tabular-nums">
                    {item.summary}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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
