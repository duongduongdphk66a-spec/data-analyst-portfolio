"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  Database,
  Download,
  FileSpreadsheet,
  Flame,
  GraduationCap,
  Layers,
  LineChart,
  Microscope,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

/* ============================================================================
 * CUSTOM SVG ICONS (Collect / Process / Visualise)
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
      {/* Checklist boxes */}
      <rect x="10" y="10" width="22" height="22" rx="4" fill="#FFA8A8" />
      <path
        d="M15.5 21L19.5 25L26.5 17"
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="10" y="39" width="22" height="22" rx="4" fill="#FFD3D3" />
      <rect x="10" y="68" width="22" height="22" rx="4" fill="#FFA8A8" />

      {/* Coral Pencil */}
      <g transform="rotate(42 62 48)">
        <rect x="52" y="14" width="18" height="58" rx="3" fill="#FF5A52" />
        <rect x="52" y="6" width="18" height="10" rx="4" fill="#FFA8A8" />
        <polygon points="52,72 70,72 61,88" fill="#FFD3D3" />
        <polygon points="58,82 64,82 61,88" fill="#FF5A52" />
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
      {/* Top Gear / Cog */}
      <path
        d="M54 8H66L68 15.5C70.5 16.4 72.8 17.8 74.7 19.6L82 17L88 27.4L82.2 32.8C82.7 35.1 82.7 37.5 82.2 39.8L88 45.2L82 55.6L74.7 53C72.8 54.8 70.5 56.2 68 57.1L66 64.6H54L52 57.1C49.5 56.2 47.2 54.8 45.3 53L38 55.6L32 45.2L37.8 39.8C37.3 37.5 37.3 35.1 37.8 32.8L32 27.4L38 17L45.3 19.6C47.2 17.8 49.5 16.4 52 15.5L54 8Z"
        fill="#FFA8A8"
      />
      <circle cx="60" cy="36.3" r="8.5" fill="#FF5A52" />

      {/* Hierarchy / Pipeline Connectors */}
      <path
        d="M60 65V75M60 75H26V82M60 75V82M60 75H94V82"
        stroke="#FFD3D3"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom Pipeline Nodes */}
      <rect x="12" y="80" width="28" height="12" rx="3.5" fill="#FFA8A8" />
      <rect x="46" y="80" width="28" height="12" rx="3.5" fill="#FFA8A8" />
      <rect x="80" y="80" width="28" height="12" rx="3.5" fill="#FFA8A8" />
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
          const isDeep = rowIdx === 0 || (colIdx >= 6 && rowIdx <= 3);
          const isMid = !isDeep && (rowIdx <= 2 || colIdx >= 4);
          const fill = isDeep ? "#FF4B42" : isMid ? "#FFA09B" : "#FFD3D0";
          return <circle key={`${colIdx}-${rowIdx}`} cx={cx} cy={cy} r="4.3" fill={fill} />;
        });
      })}
    </svg>
  );
}

export default function AboutSection() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  return (
    <section id="about" className="py-6 sm:py-8 space-y-12 sm:space-y-16">
      {/* =====================================================================
       * 1. HERO "ABOUT ME" SPLIT BANNER (Max 2 Columns: Identity + Editorial)
       * ===================================================================== */}
      <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 bg-[#0d4a52]">
        {/* Column 1: Analyst Identity & Quick Action Panel */}
        <div className="lg:col-span-4 relative bg-gradient-to-br from-slate-900 via-[#103740] to-[#0a2e36] p-6 sm:p-8 md:p-10 flex flex-col justify-between text-white border-b lg:border-b-0 lg:border-r border-white/10">
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.35) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 space-y-6">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {isVi
                ? "Sẵn sàng cho vị trí Data Analyst"
                : "Available for Data Analyst Roles"}
            </div>

            {/* Avatar / Monogram */}
            <div className="pt-2">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#ff6b6b] to-[#ffa8a8] p-0.5 shadow-lg">
                <div className="w-full h-full rounded-[14px] bg-[#0b353c] flex items-center justify-center">
                  <span className="font-serif text-3xl font-bold tracking-wider text-white">
                    MVH
                  </span>
                </div>
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-white">
                Mã Văn Hùng
              </h2>
              <p className="text-sm text-teal-200/90 font-medium mt-1">
                Data Analyst & Quantitative Researcher
              </p>
            </div>

            {/* Core Identity Highlights */}
            <div className="space-y-3 pt-4 border-t border-white/10 text-sm text-slate-200/90">
              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-[#ff8787] shrink-0 mt-0.5" />
                <span>
                  {isVi
                    ? "Khởi nguồn từ Nghiên cứu Khoa học (Kinh tế học Di sản Nhật Bản)"
                    : "Rooted in Academic Research (Japanese Heritage Economics)"}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Database className="w-4 h-4 text-[#ff8787] shrink-0 mt-0.5" />
                <span>
                  SQL 8-Stage Pipeline • Python (Pandas, SciPy, Stats)
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <LineChart className="w-4 h-4 text-[#ff8787] shrink-0 mt-0.5" />
                <span>
                  {isVi
                    ? "Data Storytelling • BI & Product UX Analytics"
                    : "Data Storytelling • BI & Product UX Analytics"}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="relative z-10 pt-8 mt-8 border-t border-white/10 flex flex-wrap gap-3">
            <a
              href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0d4a52] font-semibold text-xs hover:bg-teal-50 transition shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {isVi ? "Tải CV (PDF)" : "Download CV"}
            </a>
            <Link
              href="/projects/proj-heritage-japan"
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition border border-white/15 cursor-pointer"
            >
              {isVi ? "Xem Nghiên cứu Khởi nguồn" : "View Origin Research"}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Column 2: Editorial "About Me" Statement */}
        <div className="lg:col-span-8 p-6 sm:p-10 lg:p-14 flex flex-col justify-center text-white">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            {isVi ? "About Me — Về Tôi" : "About Me"}
          </h1>

          <div className="space-y-5 text-base sm:text-[17px] leading-relaxed text-teal-50/95 font-normal">
            {isVi ? (
              <>
                <p>
                  Tôi là <strong>Mã Văn Hùng</strong>, một <strong>Data Analyst</strong> có nền tảng từ{" "}
                  <strong>nghiên cứu khoa học định lượng</strong>, luôn tâm huyết với việc đồng hành cùng các tổ chức và doanh nghiệp để khai thác giá trị thực chất từ dữ liệu; bắt đầu từ việc{" "}
                  <em>cần đo lường chỉ số gì và làm sao để thu thập dữ liệu chính xác</em>, qua quá trình làm sạch, đối soát (reconciliation), phân tích thống kê, cho đến bước truyền tải các{" "}
                  <strong>insights</strong> sắc bén thông qua trực quan hóa.
                </p>
                <p>
                  Tôi thực hiện từng mắt xích trong quy trình phân tích: từ thiết kế truy vấn{" "}
                  <strong>SQL chuyên sâu</strong>, mô hình hóa bằng <strong>Python</strong>, đến xây dựng{" "}
                  <strong>Interactive Dashboards</strong> — nhằm giúp đội ngũ đưa ra quyết định dựa trên bằng chứng thực nghiệm (
                  <em>evidence-driven decisions</em>) và truyền tải câu chuyện dữ liệu rõ ràng tới các bên liên quan.
                </p>
                <p className="pt-2 text-teal-200 font-medium">
                  Tôi hiện sẵn sàng cho các vị trí Data Analyst toàn thời gian, cũng như các dự án phân tích dữ liệu chuyên sâu và nghiên cứu sản phẩm.
                </p>
              </>
            ) : (
              <>
                <p>
                  I am <strong>Mã Văn Hùng</strong>, a <strong>Data Analyst</strong> with a background in{" "}
                  <strong>quantitative academic research</strong>, working with organisations that want to make effective use of their data; from defining{" "}
                  <em>what metrics to measure and how to capture accurate data</em>, through data auditing, reconciliation, and statistical modeling, to clear insight communication.
                </p>
                <p>
                  I support each step of the analytical lifecycle: from advanced <strong>SQL pipelines</strong> and{" "}
                  <strong>Python statistical modeling</strong> to interactive <strong>BI & web dashboards</strong> — enabling teams to make evidence-driven decisions and share actionable narratives with stakeholders.
                </p>
                <p className="pt-2 text-teal-200 font-medium">
                  I am available for full-time Data Analyst opportunities, short-term consulting projects, and research collaborations.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
       * 2. THREE PILLARS: HORIZONTAL FULL-WIDTH CARDS (Max 2 Columns per Card)
       * ===================================================================== */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff5a52]">
            {isVi ? "Quy trình & Năng lực Cốt lõi" : "End-to-End Analytical Workflow"}
          </span>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#0d4a52] dark:text-teal-300">
            {isVi
              ? "Từ Thu thập Thực nghiệm đến Trực quan hóa Chiến lược"
              : "From Empirical Collection to Strategic Visualisation"}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            {isVi
              ? "Ba mắt xích liền mạch được chuẩn hóa qua các dự án phân tích thực chiến."
              : "Three continuous phases validated across real-world analytical case studies."}
          </p>
        </div>

        {/* Stack of Horizontal Cards (Max 2 Columns Inside Each Card) */}
        <div className="space-y-5">
          {/* Pillar 1: Collect */}
          <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 flex items-center gap-5">
              <div className="shrink-0 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <CollectIllustration className="w-16 h-16" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-[#ff5a52] uppercase tracking-wider">
                  01 • DATA ACQUISITION
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d4a52] dark:text-teal-300">
                  Collect
                </h3>
              </div>
            </div>
            <div className="lg:col-span-8 text-slate-600 dark:text-slate-300 text-sm sm:text-[15px] leading-relaxed lg:border-l lg:border-slate-200 dark:lg:border-slate-700/60 lg:pl-8">
              {isVi ? (
                <>
                  Xuất phát từ nền tảng <strong>nghiên cứu khoa học kinh tế - xã hội</strong>, tôi có kiến thức vững chắc trong{" "}
                  <strong>thiết kế khung đo lường</strong>, thu thập dữ liệu đa nguồn và{" "}
                  <strong>kiểm toán chất lượng dữ liệu (Data Audit)</strong>. Tôi có kinh nghiệm trích xuất và chuẩn hóa dữ liệu từ{" "}
                  <strong>thống kê vĩ mô (UNESCO, JNTO)</strong>, dữ liệu thương mại điện tử{" "}
                  <strong>TikTok Shop / FastMoss</strong> và khảo sát hành vi người dùng{" "}
                  <strong>UX Research</strong>.
                </>
              ) : (
                <>
                  Coming from a background in <strong>quantitative academic research</strong>, I have practical knowledge in{" "}
                  <strong>metric & survey design</strong>, impact assessment, and{" "}
                  <strong>data quality auditing</strong>. I have hands-on experience structuring multi-source datasets across{" "}
                  <strong>macro-tourism statistics (UNESCO, JNTO)</strong>, e-commerce telemetry (
                  <strong>TikTok Shop, FastMoss</strong>), and <strong>UX user research</strong>.
                </>
              )}
            </div>
          </div>

          {/* Pillar 2: Process */}
          <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 flex items-center gap-5">
              <div className="shrink-0 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <ProcessIllustration className="w-16 h-16" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-[#ff5a52] uppercase tracking-wider">
                  02 • TRANSFORMATION & AUDIT
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d4a52] dark:text-teal-300">
                  Process
                </h3>
              </div>
            </div>
            <div className="lg:col-span-8 text-slate-600 dark:text-slate-300 text-sm sm:text-[15px] leading-relaxed lg:border-l lg:border-slate-200 dark:lg:border-slate-700/60 lg:pl-8">
              {isVi ? (
                <>
                  Áp dụng phương pháp luận 8 giai đoạn từ <strong>SQL for Data Analysis</strong> và hệ sinh thái{" "}
                  <strong>Python (Pandas, NumPy, SciPy, Scikit-learn)</strong>, tôi thiết kế và tối ưu hóa các luồng xử lý dữ liệu phức tạp: bao gồm{" "}
                  <strong>chuyển đổi dữ liệu (ETL), đối soát chênh lệch (Data Reconciliation), phân tích chuỗi thời gian (Time-Series)</strong>,{" "}
                  <strong>kiểm định giả thuyết thống kê (ANOVA, Mann-Whitney U)</strong> và mô hình hóa dự báo.
                </>
              ) : (
                <>
                  Applying an 8-stage <strong>SQL for Data Analysis</strong> methodology alongside{" "}
                  <strong>Python (Pandas, NumPy, SciPy, Scikit-learn)</strong>, I build and optimize analytical workflows covering{" "}
                  <strong>data transformation, cross-source reconciliation, cohort & time-series analysis</strong>,{" "}
                  <strong>statistical hypothesis testing (ANOVA, Mann-Whitney U)</strong>, and predictive modeling.
                </>
              )}
            </div>
          </div>

          {/* Pillar 3: Visualise */}
          <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 flex items-center gap-5">
              <div className="shrink-0 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <VisualiseIllustration className="w-16 h-16" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-[#ff5a52] uppercase tracking-wider">
                  03 • ACTIONABLE STORYTELLING
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0d4a52] dark:text-teal-300">
                  Visualise
                </h3>
              </div>
            </div>
            <div className="lg:col-span-8 text-slate-600 dark:text-slate-300 text-sm sm:text-[15px] leading-relaxed lg:border-l lg:border-slate-200 dark:lg:border-slate-700/60 lg:pl-8">
              {isVi ? (
                <>
                  Tôi áp dụng các <strong>nguyên tắc thực hành về trực quan hóa dữ liệu (data visualisation best practices)</strong> để xây dựng{" "}
                  <strong>công cụ dashboard tương tác</strong> và{" "}
                  <strong>báo cáo phân tích chuyên sâu</strong> giúp người đọc nắm bắt bản chất vấn đề, sử dụng{" "}
                  <strong>Power BI, Tableau, Matplotlib/Seaborn</strong> và{" "}
                  <strong>Next.js / Recharts</strong>.
                </>
              ) : (
                <>
                  I apply established <strong>data visualisation best practices</strong> to translate statistical outputs into clear visual narratives. I have experience creating{" "}
                  <strong>interactive web dashboards</strong> and <strong>executive case-study reports</strong> using{" "}
                  <strong>Power BI, Tableau, Matplotlib/Seaborn</strong>, and custom{" "}
                  <strong>Next.js / Recharts</strong> components.
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * 3. THE THREE CORE QUESTIONS: HORIZONTAL CARDS (Max 2 Columns per Card)
       * ===================================================================== */}
      <div className="space-y-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff5a52]">
            {isVi ? "Câu chuyện & Động lực" : "Who I Am, What I Do & Why It Matters"}
          </span>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {isVi
              ? "Ba Câu hỏi Định hình Phương pháp Phân tích của Tôi"
              : "Three Questions That Define My Analytical Approach"}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            {isVi
              ? "Cách tôi bắt đầu hành trình với dữ liệu, lý do tôi tập trung vào đối soát chuyên sâu và giá trị tôi hướng tới."
              : "How I started in data analysis, what fascinates me most about data, and where my core focus lies."}
          </p>
        </div>

        {/* Stack of 3 Horizontal Cards (Max 2 Columns per Card) */}
        <div className="space-y-6">
          {/* Card 1: How did you get started in data analysis? */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column (5 Cols): Meta, Badge, Title & Direct Project CTA */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0d4a52]/10 dark:bg-teal-500/15 text-[#0d4a52] dark:text-teal-300 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  01 / ORIGIN STORY
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#ff5a52] mb-1">
                  {isVi
                    ? "Tôi bắt đầu đến với Phân tích Dữ liệu như thế nào?"
                    : "How did I get started in data analysis?"}
                </p>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  {isVi
                    ? "Khởi nguồn từ Nghiên cứu Khoa học: Dự án Du lịch Di sản Nhật Bản"
                    : "Started in University Research: Japanese Heritage Tourism"}
                </h3>
              </div>

              <div className="pt-2">
                <Link
                  href="/projects/proj-heritage-japan"
                  className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0d4a52] hover:text-white dark:hover:bg-teal-400 dark:hover:text-slate-950 text-xs font-bold text-[#0d4a52] dark:text-teal-300 transition cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {isVi
                      ? "Khám phá Case Study Du lịch Di sản Nhật Bản"
                      : "Explore Heritage Japan Case Study"}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column (7 Cols): Narrative Details */}
            <div className="lg:col-span-7 space-y-3.5 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed lg:border-l lg:border-slate-100 dark:lg:border-slate-800 lg:pl-8">
              {isVi ? (
                <>
                  <p>
                    Cơ duyên đưa tôi đến với phân tích dữ liệu bắt đầu khi tôi thực hiện{" "}
                    <strong>nghiên cứu khoa học tại trường đại học</strong> — cụ thể là{" "}
                    <strong>Dự án Kinh tế học Du lịch Di sản Nhật Bản (Heritage Japan)</strong>.
                  </p>
                  <p>
                    Khi đánh giá tác động của danh hiệu Di sản Thế giới UNESCO đến kinh tế địa phương tại Nhật Bản, các nhận định cảm tính hay số liệu trung bình gộp không thể lý giải được vì sao có những di sản bùng nổ du lịch (thậm chí quá tải - <em>overtourism</em>), trong khi nhiều vùng khác lại suy giảm.
                  </p>
                  <p>
                    Quá trình tự tay thu thập dữ liệu đa chiều, kiểm toán sai số (data audit), phân tích cấu trúc vùng miền và lượng hóa hiệu quả chính sách cho thấy: dữ liệu thực nghiệm là công cụ khách quan để kiểm định giả thuyết khoa học và đưa ra giải pháp thực tiễn.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    My journey into data analysis began while conducting{" "}
                    <strong>scientific research at university</strong> — represented by the{" "}
                    <strong>Japanese World Heritage Tourism (`heritage-japan`)</strong> case study.
                  </p>
                  <p>
                    While investigating how UNESCO World Heritage status impacts regional economies across Japan, simple averages failed to explain why certain sites experienced severe <em>overtourism</em> while others saw visitor declines.
                  </p>
                  <p>
                    Collecting empirical datasets, auditing data integrity, and applying statistical models to evaluate policy effectiveness proved that empirical data provides an objective basis for evaluating hypotheses and guiding practical decisions.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Card 2: What about data interests you most? */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column (5 Cols): Meta, Badge, Title & Direct Project CTA */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#ff5a52]/10 text-[#ff5a52] flex items-center justify-center shrink-0">
                  <Microscope className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  02 / INTELLECTUAL CURIOSITY
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#ff5a52] mb-1">
                  {isVi
                    ? "Điều gì ở Dữ liệu thu hút tôi nhất?"
                    : "What about data interests me most?"}
                </p>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  {isVi
                    ? "Giải mã Nghịch lý Dữ liệu & Đối soát Sự thật Ngầm hiểu"
                    : "Uncovering Causal Patterns & Resolving Discrepancies"}
                </h3>
              </div>

              <div className="pt-2">
                <Link
                  href="/projects/proj-kami-ely"
                  className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0d4a52] hover:text-white dark:hover:bg-teal-400 dark:hover:text-slate-950 text-xs font-bold text-[#0d4a52] dark:text-teal-300 transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>
                    {isVi
                      ? "Xem Đối soát Dữ liệu & Thống kê tại Kami Ely"
                      : "See Reconciliation & Stats in Kami Ely"}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column (7 Cols): Narrative Details */}
            <div className="lg:col-span-7 space-y-3.5 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed lg:border-l lg:border-slate-100 dark:lg:border-slate-800 lg:pl-8">
              {isVi ? (
                <>
                  <p>
                    Điểm thu hút tôi nhất ở dữ liệu nằm ở{" "}
                    <strong>sự thật đằng sau những bộ dữ liệu tưởng chừng mâu thuẫn hoặc có độ nhiễu cao</strong>.
                  </p>
                  <p>
                    Trong thực tế, số liệu hiếm khi đồng nhất ngay từ đầu: ví dụ độ lệch GMV giữa luồng dữ liệu Creator và Shop trong dự án thương mại điện tử{" "}
                    <strong>TikTok Shop (Kami Ely)</strong>, hay hiện tượng phân phối lệch chuẩn (skewness) trong dữ liệu hành vi.
                  </p>
                  <p>
                    Tôi tập trung vào quá trình <strong>Data Reconciliation (Đối soát dữ liệu)</strong> và{" "}
                    <strong>Kiểm định giả thuyết thống kê</strong>: kiểm tra từng dòng log, phân tích phân phối xác suất để giải thích{" "}
                    <em>nguyên nhân gốc rễ</em> thay vì chỉ dừng ở các chỉ số mô tả bề mặt.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    What interests me most about data is{" "}
                    <strong>uncovering structural facts within noisy, seemingly contradictory datasets</strong>.
                  </p>
                  <p>
                    In live environments, telemetry streams rarely match on first inspection: such as reconciling GMV discrepancies between Creator and Shop pipelines in the{" "}
                    <strong>Kami Ely TikTok Shop</strong> project, or accounting for skewed distributions in regional tourism.
                  </p>
                  <p>
                    I focus on <strong>Data Reconciliation</strong> and{" "}
                    <strong>Statistical Hypothesis Testing</strong>: verifying schemas, evaluating distributions, and transitioning from purely descriptive summaries to diagnostic explanations.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Card 3: Where your passions lie in relation to data analytics */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column (5 Cols): Meta, Badge, Title & Direct Project CTA */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  03 / CORE PASSION
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#ff5a52] mb-1">
                  {isVi
                    ? "Đam mê của tôi nằm ở đâu trong Data Analytics?"
                    : "Where do my passions lie in data analytics?"}
                </p>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  {isVi
                    ? "Kết hợp Phân tích Định lượng với Data Storytelling & Tư duy Sản phẩm"
                    : "Bridging Quantitative Rigor with Actionable Storytelling & UX"}
                </h3>
              </div>

              <div className="pt-2">
                <Link
                  href="/projects/proj-library-bus"
                  className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0d4a52] hover:text-white dark:hover:bg-teal-400 dark:hover:text-slate-950 text-xs font-bold text-[#0d4a52] dark:text-teal-300 transition cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>
                    {isVi
                      ? "Khám phá Tư duy Sản phẩm & Dữ liệu tại Library Bus"
                      : "Explore Product & Data in Library Bus"}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column (7 Cols): Narrative Details */}
            <div className="lg:col-span-7 space-y-3.5 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed lg:border-l lg:border-slate-100 dark:lg:border-slate-800 lg:pl-8">
              {isVi ? (
                <>
                  <p>
                    Mục tiêu chính của tôi là <strong>chuyển hóa kết quả phân tích phức tạp thành công cụ ra quyết định rõ ràng, dễ tiếp cận</strong>.
                  </p>
                  <p>
                    Một phân tích thống kê chỉ phát huy hiệu quả khi người quản lý và các phòng ban có thể nắm bắt và áp dụng. Vì vậy, tôi kết hợp{" "}
                    <strong>kỹ thuật phân tích (SQL Pipeline, Python Modeling)</strong> với{" "}
                    <strong>tư duy sản phẩm và trải nghiệm người dùng (Product & UX Analytics)</strong>.
                  </p>
                  <p>
                    Từ việc xây dựng mô hình đối soát dữ liệu đến thiết kế luồng xử lý trong{" "}
                    <strong>Library Bus</strong>, tôi luôn hướng đến các giải pháp dữ liệu có cấu trúc minh bạch và hỗ trợ hành động cụ thể.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    My primary focus is <strong>translating complex analytical outputs into clear, human-accessible decision tools</strong>.
                  </p>
                  <p>
                    Statistical analyses provide value when stakeholders can interpret and act upon their findings. Therefore, I combine{" "}
                    <strong>analytical engineering (SQL Pipelines, Python Modeling)</strong> with{" "}
                    <strong>Product and UX considerations</strong>.
                  </p>
                  <p>
                    Whether building data reconciliation interfaces or structuring telemetry in{" "}
                    <strong>Library Bus</strong>, I aim to create transparent, structured data solutions that support direct operational actions.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * 4. VALUE PROPOSITION: STRICTLY MAX 2 COLUMNS
       * ===================================================================== */}
      <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 p-6 sm:p-8 lg:p-10 border border-slate-200/80 dark:border-slate-800 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0d4a52] dark:text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-[#ff5a52]" />
              {isVi ? "Giá trị mang lại cho Nhà tuyển dụng" : "What I Bring to Your Team"}
            </span>
            <h3 className="mt-1 font-serif text-2xl font-bold text-slate-900 dark:text-white">
              {isVi
                ? "Phương pháp làm việc dựa trên dữ liệu thực nghiệm"
                : "An Empirical Approach to Business Problem-Solving"}
            </h3>
          </div>
          <Link
            href="/projects"
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d4a52] text-white text-xs font-semibold hover:bg-[#0a383f] transition self-start md:self-auto cursor-pointer"
          >
            {isVi ? "Xem toàn bộ Dự án" : "Browse All Case Studies"}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Strictly Max 2 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              titleVi: "Tư duy Kiểm chứng Khoa học",
              titleEn: "Research-Grade Rigor",
              descVi:
                "Đưa ra nhận định dựa trên dữ liệu đã qua làm sạch, đối soát đa nguồn và kiểm định giả thuyết thống kê thay vì trực giác cảm tính.",
              descEn:
                "Recommendations are grounded in data auditing, cross-source reconciliation, and hypothesis testing rather than intuition.",
            },
            {
              titleVi: "Làm chủ SQL & Python Thực chiến",
              titleEn: "Production SQL & Python",
              descVi:
                "Thành thạo CTEs, Window Functions, Cohort/Retention, kết hợp Pandas, SciPy và mô hình hồi quy đa biến trong Python.",
              descEn:
                "Proficient in complex CTEs, Window Functions, Cohort/Retention SQL, paired with Python (Pandas, SciPy, Regression).",
            },
            {
              titleVi: "Hiểu sâu Ngữ cảnh Kinh doanh",
              titleEn: "Business & Domain Context",
              descVi:
                "Chuyển hóa linh hoạt giữa bài toán Kinh tế vĩ mô (Heritage Japan), E-commerce GMV (Kami Ely) và Product UX Telemetry (Library Bus).",
              descEn:
                "Proven adaptability across Macro-Tourism Economics, E-commerce GMV Optimization, and Product UX Telemetry.",
            },
            {
              titleVi: "Truyền tải Trực quan & Minh bạch",
              titleEn: "Impactful Data Storytelling",
              descVi:
                "Thiết kế báo cáo và dashboard theo chuẩn mực trực quan hóa, giúp các phòng ban nắm bắt hành động cần ưu tiên.",
              descEn:
                "Designing clear, interactive visual narratives that bridge the gap between technical data and executive decisions.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3.5"
            >
              <CheckCircle2 className="w-5 h-5 text-[#ff5a52] shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <div className="text-slate-900 dark:text-teal-300 font-bold text-sm sm:text-base">
                  {isVi ? item.titleVi : item.titleEn}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isVi ? item.descVi : item.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
