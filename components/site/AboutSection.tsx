"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { BLOG_POSTS, TESTIMONIALS } from "@/app/data/blogData";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Clock,
  Code2,
  Compass,
  Database,
  Download,
  FileSpreadsheet,
  Flame,
  GraduationCap,
  Layers,
  LineChart,
  Microscope,
  Quote,
  Sparkles,
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
          // Harmonious dots using the 4 project colors
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
  const isVi = language === "vi";

  return (
    <section id="about" className="py-6 sm:py-8 space-y-12 sm:space-y-16">
      {/* =====================================================================
       * 1. HERO "ABOUT ME" SPLIT BANNER (Theme-consistent 4-Color Palette)
       * ===================================================================== */}
      <div className="rounded-3xl overflow-hidden border border-[#C8EEF7] dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 bg-[#F0F9FB] dark:bg-slate-900 text-slate-900 dark:text-white">
        {/* Left Column: Analyst Identity Card */}
        <div className="lg:col-span-4 relative bg-[#C8EEF7]/45 dark:bg-slate-950/60 p-6 sm:p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#C8EEF7] dark:border-slate-800" /* taste-skill-ignore: column boundary */>
          <div className="space-y-6">
            {/* Status Pill in #9BE7FA / #FFD14C */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#9BE7FA]/15 border border-[#9BE7FA]/50 dark:border-[#9BE7FA]/35 text-[#074553] dark:text-[#9BE7FA] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FFD14C]" />
              {isVi
                ? "Sẵn sàng cho vị trí Data Analyst"
                : "Available for Data Analyst Roles"}
            </div>

            <div className="pt-2">
              <div className="w-20 h-20 rounded-2xl bg-[#9BE7FA] border border-[#074553]/15 flex items-center justify-center">
                <span className="text-2xl font-extrabold text-[#074553]">
                  MVH
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Mã Văn Hùng
              </h2>
              <p className="text-sm text-[#074553] dark:text-[#9BE7FA] font-semibold mt-1">
                Data Analyst & Quantitative Researcher
              </p>
            </div>

            <div className="space-y-3 pt-5 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-[#074553] dark:text-[#9BE7FA] shrink-0 mt-0.5" />
                <span>
                  {isVi
                    ? "Khởi nguồn từ Nghiên cứu Khoa học (Du lịch Di sản Nhật Bản)"
                    : "Rooted in University Research (Japanese Heritage Tourism)"}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Database className="w-4 h-4 text-[#0D7287] dark:text-[#FFE485] shrink-0 mt-0.5" />
                <span>SQL 8-Stage Pipeline • Python (Pandas, SciPy)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <LineChart className="w-4 h-4 text-amber-600 dark:text-[#FFD14C] shrink-0 mt-0.5" />
                <span>Data Storytelling • BI & Product UX Analytics</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 flex flex-wrap gap-3">
            <a
              href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] font-bold text-xs transition-colors border border-[#9BE7FA] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {isVi ? "Tải CV (PDF)" : "Download CV"}
            </a>
            <Link
              href="/blog"
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs transition-colors border border-[#C8EEF7] dark:border-slate-700 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#074553] dark:text-[#9BE7FA]" />
              {isVi ? "Đọc Blog Phân tích" : "Read Analytics Blog"}
            </Link>
          </div>
        </div>

        {/* Right Column: Editorial "About Me" Introduction */}
        <div className="lg:col-span-8 p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
          <span className="text-sm font-semibold text-[#074553] dark:text-[#9BE7FA] mb-2">
            {isVi ? "Hồ sơ năng lực & Định hướng nghề nghiệp" : "Who I am, what I do & why it matters"}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            {isVi ? "Giới Thiệu Bản Thân" : "About Me"}
          </h1>

          <div className="space-y-4 text-base sm:text-[17px] leading-relaxed text-slate-700 dark:text-slate-200">
            {isVi ? (
              <>
                <p>
                  Tôi là <strong>Mã Văn Hùng</strong>, một{" "}
                  <strong className="text-[#074553] dark:text-[#9BE7FA]">Data Analyst</strong> trưởng thành từ nền tảng{" "}
                  <strong>nghiên cứu khoa học định lượng</strong>, luôn tâm huyết với việc đồng hành cùng các tổ chức để khai thác hiệu quả giá trị thực từ dữ liệu: từ những ý tưởng đầu tiên về việc{" "}
                  <em>cần đo lường chỉ số gì và làm sao để thu thập dữ liệu chính xác</em>, xuyên suốt quá trình làm sạch, đối soát (reconciliation), phân tích thống kê cho đến bước truyền tải các{" "}
                  <strong>insights</strong> có sức nặng.
                </p>
                <p>
                  Tôi hỗ trợ trọn vẹn từng mắt xích của quy trình phân tích, bao gồm xây dựng luồng truy vấn{" "}
                  <strong>SQL 8 giai đoạn</strong>, kiểm định thống kê bằng <strong>Python</strong>, và thiết kế{" "}
                  <strong>Interactive Dashboards</strong> để giúp đội ngũ của bạn đưa ra quyết định dựa trên bằng chứng thực nghiệm (
                  <em>evidence-driven decisions</em>).
                </p>
                <p className="pt-2 text-[#074553] dark:text-[#C8EEF7] font-semibold text-sm">
                  Tôi hiện sẵn sàng cho các vị trí Data Analyst toàn thời gian, các dự án phân tích đối soát dữ liệu và nghiên cứu sản phẩm.
                </p>
              </>
            ) : (
              <>
                <p>
                  I am <strong>Mã Văn Hùng</strong>, a{" "}
                  <strong className="text-[#074553] dark:text-[#9BE7FA]">Data Analyst</strong> with a strong foundation in{" "}
                  <strong>quantitative academic research</strong>, working with organisations that want to make effective use of their data: from the first ideas around{" "}
                  <em>what you want to measure and how to capture data accurately</em>, through data preparation, reconciliation, and statistical analysis, all the way to clear presentation of insights.
                </p>
                <p>
                  I support each step of the analytical process, including <strong>8-stage SQL pipelines</strong>,{" "}
                  <strong>Python statistical modeling</strong>, and interactive <strong>BI & web dashboards</strong> so your organisation can make evidence-driven decisions with confidence.
                </p>
                <p className="pt-2 text-[#074553] dark:text-[#C8EEF7] font-semibold text-sm">
                  I am available for full-time Data Analyst opportunities, short-term data audit consulting, and research collaborations.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
       * 2. THREE PILLARS: COLLECT • PROCESS • VISUALISE (Horizontal Cards, Max 2 Cols)
       * ===================================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#C8EEF7] dark:border-slate-800 space-y-8">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold text-[#074553] dark:text-[#9BE7FA]">
            {isVi ? "Quy trình & năng lực cốt lõi" : "End-to-end analytical workflow"}
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {isVi
              ? "Ba Trụ cột: Thu thập • Xử lý • Trực quan hóa"
              : "Collect • Process • Visualise"}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            {isVi
              ? "Ba mắt xích liền mạch được chuẩn hóa qua các dự án phân tích dữ liệu."
              : "Three continuous phases validated across real-world analytical case studies."}
          </p>
        </div>

        <div className="space-y-5">
          {/* Pillar 1: Collect */}
          <div className="rounded-2xl bg-[#F8FCFD] dark:bg-slate-800/50 p-6 sm:p-8 border border-[#C8EEF7] dark:border-slate-800 hover:border-[#9BE7FA] transition-colors grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 flex items-center gap-5">
              <div className="shrink-0 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-700">
                <CollectIllustration className="w-16 h-16" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#074553] dark:text-[#9BE7FA]">
                  {isVi ? "Thu thập & kiểm toán nguồn" : "Data acquisition"}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Collect
                </h3>
              </div>
            </div>
            <div className="lg:col-span-8 text-slate-600 dark:text-slate-300 text-sm sm:text-[15px] leading-relaxed lg:pl-8">
              {isVi ? (
                <>
                  Xuất phát từ nền tảng <strong>nghiên cứu khoa học kinh tế - xã hội</strong>, tôi có kiến thức lý thuyết và thực tiễn vững chắc trong{" "}
                  <strong>thiết kế khung đo lường</strong> và <strong>kiểm toán chất lượng dữ liệu (Data Audit)</strong> trên đa nguồn dữ liệu: từ thống kê vĩ mô{" "}
                  <strong>UNESCO / JNTO</strong>, dữ liệu thương mại điện tử{" "}
                  <strong>TikTok Shop / FastMoss</strong> đến nghiên cứu hành vi người dùng{" "}
                  <strong>UX Research</strong>.
                </>
              ) : (
                <>
                  Coming from a background in <strong>quantitative academic research</strong>, I have theoretical and practical knowledge in{" "}
                  <strong>metric design</strong>, impact assessment, and{" "}
                  <strong>data quality auditing</strong> across{" "}
                  <strong>UNESCO / JNTO macro-statistics</strong>,{" "}
                  <strong>TikTok Shop / FastMoss telemetry</strong>, and{" "}
                  <strong>UX research</strong>.
                </>
              )}
            </div>
          </div>

          {/* Pillar 2: Process */}
          <div className="rounded-2xl bg-[#F8FCFD] dark:bg-slate-800/50 p-6 sm:p-8 border border-[#C8EEF7] dark:border-slate-800 hover:border-[#9BE7FA] transition-colors grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 flex items-center gap-5">
              <div className="shrink-0 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-700">
                <ProcessIllustration className="w-16 h-16" />
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-800 dark:text-[#FFD14C]">
                  {isVi ? "Biến đổi & đối soát" : "Transformation & audit"}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Process
                </h3>
              </div>
            </div>
            <div className="lg:col-span-8 text-slate-600 dark:text-slate-300 text-sm sm:text-[15px] leading-relaxed lg:pl-8">
              {isVi ? (
                <>
                  Vận dụng khung 8 giai đoạn <strong>SQL for Data Analysis</strong> và hệ sinh thái{" "}
                  <strong>Python (Pandas, NumPy, SciPy, Scikit-learn)</strong>, tôi xây dựng và tối ưu hóa các luồng xử lý dữ liệu bao gồm{" "}
                  <strong>chuyển đổi dữ liệu (ETL), đối soát chênh lệch (Data Reconciliation), phân tích chuỗi thời gian</strong> và{" "}
                  <strong>kiểm định giả thuyết thống kê (ANOVA, Mann-Whitney U)</strong>.
                </>
              ) : (
                <>
                  Applying the 8-stage <strong>SQL for Data Analysis</strong> methodology alongside{" "}
                  <strong>Python (Pandas, NumPy, SciPy, Scikit-learn)</strong>, I build and optimize workflows covering{" "}
                  <strong>data transformation, cross-source reconciliation, time-series analysis</strong>, and{" "}
                  <strong>statistical hypothesis testing</strong>.
                </>
              )}
            </div>
          </div>

          {/* Pillar 3: Visualise */}
          <div className="rounded-2xl bg-[#F8FCFD] dark:bg-slate-800/50 p-6 sm:p-8 border border-[#C8EEF7] dark:border-slate-800 hover:border-[#9BE7FA] transition-colors grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 flex items-center gap-5">
              <div className="shrink-0 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-700">
                <VisualiseIllustration className="w-16 h-16" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#074553] dark:text-[#9BE7FA]">
                  {isVi ? "Trực quan hóa & kể chuyện dữ liệu" : "Actionable storytelling"}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Visualise
                </h3>
              </div>
            </div>
            <div className="lg:col-span-8 text-slate-600 dark:text-slate-300 text-sm sm:text-[15px] leading-relaxed lg:pl-8">
              {isVi ? (
                <>
                  Áp dụng các <strong>nguyên tắc thực hành tốt nhất về trực quan hóa dữ liệu (data visualisation best-practices)</strong>, tôi thiết kế các{" "}
                  <strong>công cụ dashboard tương tác (interactive tools)</strong> và{" "}
                  <strong>báo cáo chuyên sâu (executive stories)</strong> bằng{" "}
                  <strong>Power BI, Tableau, Matplotlib/Seaborn</strong> và{" "}
                  <strong>Next.js / Recharts</strong>.
                </>
              ) : (
                <>
                  Applying <strong>data visualisation best-practices</strong>, I create{" "}
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
       * 3. THREE CORE QUESTIONS (Horizontal Cards, Max 2 Cols per Card)
       * ===================================================================== */}
      <div className="space-y-8">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold text-[#074553] dark:text-[#9BE7FA]">
            {isVi ? "Hành trình & động lực" : "My story & analytical mindset"}
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {isVi
              ? "Khởi nguồn, Sự Tò mò & Đam mê với Phân tích Dữ liệu"
              : "How I Started, What Fascinates Me & Where My Passions Lie"}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Card 1: How did you get started */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 border border-[#C8EEF7] dark:border-slate-800 hover:border-[#9BE7FA] transition-colors grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#9BE7FA]/20 text-[#074553] dark:text-[#9BE7FA] border border-[#9BE7FA]/40 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#C8EEF7]/45 dark:bg-slate-800 text-[#074553] dark:text-[#9BE7FA]">
                  {isVi ? "Khởi đầu hành trình" : "How I got started"}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  {isVi
                    ? "Khởi đầu từ Nghiên cứu Khoa học ở trường: Dự án Du lịch Di sản Nhật Bản"
                    : "Started in University Scientific Research: The Japanese Heritage Tourism Project"}
                </h3>
              </div>

              <div className="pt-2">
                <Link
                  href="/projects/proj-heritage-japan"
                  className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9BE7FA]/20 hover:bg-[#9BE7FA] text-[#074553] dark:text-[#9BE7FA] dark:hover:text-[#074553] border border-[#9BE7FA]/40 text-xs font-bold transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {isVi
                      ? "Xem Dự án Du lịch Di sản Nhật Bản"
                      : "Explore Heritage Japan Research"}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3.5 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed lg:pl-8">
              {isVi ? (
                <>
                  <p>
                    Tôi bắt đầu bước chân vào lĩnh vực phân tích dữ liệu khi thực hiện{" "}
                    <strong>đề tài nghiên cứu khoa học tại trường đại học</strong>, chính là{" "}
                    <strong>Dự án Kinh tế học Du lịch Di sản Nhật Bản (Heritage Japan)</strong>.
                  </p>
                  <p>
                    Khi tìm cách chứng minh tác động của danh hiệu UNESCO đối với kinh tế các vùng tại Nhật Bản, tôi nhận ra các báo cáo trung bình cộng đơn thuần không thể giải thích được sự phân cực giữa tình trạng quá tải du lịch (<em>overtourism</em>) ở vùng lõi và sự chững lại ở vùng ven.
                  </p>
                  <p>
                    Việc tự tay kiểm toán dữ liệu (data audit), phân tích phân vị và lượng hóa hiệu quả chính sách trong nghiên cứu đó đã thắp lên trong tôi quyết tâm theo đuổi con đường Data Analyst chuyên nghiệp.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    I got started in data analysis while conducting{" "}
                    <strong>university scientific research</strong> on the{" "}
                    <strong>Japanese World Heritage Tourism (`heritage-japan`)</strong> project featured in this portfolio.
                  </p>
                  <p>
                    Investigating the regional economic impact of UNESCO designations across Japan revealed that simple averages masked severe structural disparities between overtourism hubs and peripheral prefectures.
                  </p>
                  <p>
                    Auditing empirical datasets and applying statistical models to evaluate policy outcomes turned an academic research project into my career foundation in Data Analytics.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Card 2: What about data interests you most */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 border border-[#C8EEF7] dark:border-slate-800 hover:border-[#FFE485] transition-colors grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FFE485]/30 text-amber-900 dark:text-[#FFE485] border border-[#FFE485]/50 flex items-center justify-center shrink-0">
                  <Microscope className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFE485]/30 dark:bg-slate-800 text-amber-900 dark:text-[#FFE485]">
                  {isVi ? "Điểm thu hút nhất ở dữ liệu" : "What interests me most"}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  {isVi
                    ? "Đối soát Nghịch lý Dữ liệu & Khám phá Quy luật Nhân quả"
                    : "Reconciling Data Paradoxes & Uncovering Causal Truths"}
                </h3>
              </div>

              <div className="pt-2">
                <Link
                  href="/projects/proj-kami-ely"
                  className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFE485]/20 hover:bg-[#FFE485] text-amber-950 dark:text-[#FFE485] dark:hover:text-amber-950 border border-[#FFE485]/50 text-xs font-bold transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>
                    {isVi
                      ? "Xem Đối soát & Thống kê tại Kami Ely"
                      : "See Reconciliation in Kami Ely"}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3.5 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed lg:pl-8">
              {isVi ? (
                <>
                  <p>
                    Điều thu hút tôi nhất ở dữ liệu là{" "}
                    <strong>việc tìm ra sự thật gốc (Single Source of Truth) ẩn sau những con số mâu thuẫn hoặc phân phối lệch chuẩn</strong>.
                  </p>
                  <p>
                    Trong thực tế, dữ liệu giữa các hệ thống hiếm khi khớp nhau hoàn toàn, điển hình như độ lệch GMV giữa báo cáo Creator và Shop trên{" "}
                    <strong>TikTok Shop (Kami Ely)</strong>.
                  </p>
                  <p>
                    Tôi đặc biệt hứng thú với quá trình <strong>Data Reconciliation</strong> kết hợp{" "}
                    <strong>kiểm định giả thuyết thống kê</strong> để trả lời câu hỏi{" "}
                    <em>&ldquo;Tại sao?&rdquo;</em> với độ tin cậy toán học cao nhất.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    What interests me most about data is{" "}
                    <strong>establishing a Single Source of Truth from noisy, conflicting, or heavily skewed real-world datasets</strong>.
                  </p>
                  <p>
                    Whether reconciling Creator vs. Shop GMV variances in{" "}
                    <strong>TikTok Shop (Kami Ely)</strong> or testing non-normal distributions, I enjoy the investigative rigor of{" "}
                    <strong>Data Reconciliation</strong> and <strong>Hypothesis Testing</strong> to answer <em>&ldquo;Why?&rdquo;</em> with statistical confidence.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Card 3: Where your passions lie */}
          <div className="group rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 lg:p-10 border border-[#C8EEF7] dark:border-slate-800 hover:border-[#FFD14C] transition-colors grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FFD14C]/20 text-amber-800 dark:text-[#FFD14C] border border-[#FFD14C]/50 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFD14C]/20 dark:bg-slate-800 text-amber-900 dark:text-[#FFD14C]">
                  {isVi ? "Đam mê nghề nghiệp" : "Where my passions lie"}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  {isVi
                    ? "Giao thoa giữa Phân tích Định lượng, Data Storytelling & Tư duy Sản phẩm"
                    : "Bridging Quantitative Analytics, Data Storytelling & Product UX"}
                </h3>
              </div>

              <div className="pt-2">
                <Link
                  href="/projects/proj-library-bus"
                  className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFD14C]/20 hover:bg-[#FFD14C] text-amber-950 dark:text-[#FFD14C] dark:hover:text-slate-950 border border-[#FFD14C]/50 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>
                    {isVi
                      ? "Xem Kiến trúc Dữ liệu & UX tại Library Bus"
                      : "Explore Library Bus Architecture"}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3.5 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed lg:pl-8">
              {isVi ? (
                <>
                  <p>
                    Đam mê lớn nhất của tôi trong Data Analytics là{" "}
                    <strong>biến các mô hình phân tích phức tạp thành công cụ trực quan, dễ hiểu để thúc đẩy hành động thực tế</strong>.
                  </p>
                  <p>
                    Tôi luôn kết hợp <strong>kỹ thuật xử lý dữ liệu hậu cần (SQL Pipeline, Python)</strong> với{" "}
                    <strong>trải nghiệm người dùng (Product/UX Analytics)</strong>, từ việc xây dựng{" "}
                    <strong>SQL Lab tương tác</strong> đến thiết kế luồng dữ liệu cho hệ thống{" "}
                    <strong>Library Bus</strong>.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    My passion lies at the intersection of{" "}
                    <strong>quantitative rigor, data storytelling, and product UX thinking</strong>.
                  </p>
                  <p>
                    From interactive <strong>SQL Workbenches</strong> to end-to-end telemetry architecture in{" "}
                    <strong>Library Bus</strong>, I focus on turning complex backend data into transparent, human-centric tools that drive immediate business action.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
       * 4. TESTIMONIALS SECTION (Theme-consistent surface)
       * ===================================================================== */}
      <div className="rounded-3xl bg-[#F0F9FB] dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 p-6 sm:p-10 lg:p-12 text-slate-900 dark:text-white space-y-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#074553] dark:text-[#9BE7FA]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-[#FFD14C]" />
            {isVi
              ? "Đánh giá & nhận xét (Testimonials)"
              : "Testimonials & endorsements"}
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {isVi
              ? "Góc nhìn từ Giảng viên, Quản lý & Cộng sự Dự án"
              : "What Advisors, Stakeholders & Peers Say"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => {
            const RoleIcon =
              item.roleType === "academic"
                ? GraduationCap
                : item.roleType === "business"
                ? Briefcase
                : Code2;

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white dark:bg-slate-950/70 border border-[#C8EEF7] dark:border-slate-800 p-6 sm:p-7 flex flex-col justify-between hover:border-[#9BE7FA] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/15 border border-[#9BE7FA]/40 text-[#074553] dark:text-[#9BE7FA] flex items-center justify-center">
                      <Quote className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#F0F9FB] dark:bg-slate-800 text-[#074553] dark:text-slate-200 border border-[#C8EEF7] dark:border-slate-700">
                      <RoleIcon className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                      {item.roleType === "academic"
                        ? isVi
                          ? "Nghiên cứu Khoa học"
                          : "Academic Research"
                        : item.roleType === "business"
                        ? isVi
                          ? "Vận hành Doanh nghiệp"
                          : "Business Operations"
                        : isVi
                        ? "Phát triển Sản phẩm"
                        : "Product & Systems"}
                    </span>
                  </div>

                  <blockquote className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 italic mb-6">
                    &ldquo;{isVi ? item.quoteVi : item.quoteEn}&rdquo;
                  </blockquote>
                </div>

                <div className="pt-5 mt-auto">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {isVi ? item.authorVi : item.authorEn}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isVi ? item.titleVi : item.titleEn}
                  </div>
                  <Link
                    href={item.projectLink}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#074553] dark:text-[#9BE7FA] hover:underline"
                  >
                    • {isVi ? item.contextVi : item.contextEn}
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
       * 5. BLOG PREVIEW SECTION LINKING TO DEDICATED /blog PAGE
       * ===================================================================== */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-10 lg:p-12 border border-[#C8EEF7] dark:border-slate-800 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#074553] dark:text-[#9BE7FA]">
              <BookOpen className="w-3.5 h-3.5" />
              {isVi
                ? "Bài viết chia sẻ quy trình & phát hiện"
                : "Analytical process & findings blog"}
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {isVi
                ? "Góc nhìn Hậu trường từ các Dự án Phân tích"
                : "Latest Write-Ups from My Analytics Blog"}
            </h2>
          </div>

          <Link
            href="/blog"
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] text-xs font-extrabold transition-colors self-start md:self-auto border border-[#9BE7FA] cursor-pointer"
          >
            {isVi ? "Xem toàn bộ Trang /blog" : "Visit Full /blog Page"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href="/blog"
              className="group rounded-2xl bg-[#F8FCFD] dark:bg-slate-800/50 border border-[#C8EEF7] dark:border-slate-800 p-6 flex flex-col justify-between hover:border-[#9BE7FA] transition-colors cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="font-bold text-[#074553] dark:text-[#9BE7FA]">
                    {isVi ? post.categoryVi : post.categoryEn}
                  </span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    {isVi ? post.readTimeVi : post.readTimeEn}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA] transition-colors leading-snug mb-2">
                  {isVi ? post.titleVi : post.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {isVi ? post.excerptVi : post.excerptEn}
                </p>
              </div>

              <div className="pt-4 mt-5 flex items-center justify-between text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
                <span>
                  {isVi ? "Đọc quy trình & SQL/Python" : "Read Process & Code"}
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
