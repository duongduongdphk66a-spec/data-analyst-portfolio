"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { BLOG_POSTS, BlogPost } from "@/app/data/blogData";
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Sparkles,
  Tag,
  Terminal,
  X,
} from "lucide-react";

type FilterCategory =
  | "all"
  | "heritage-japan"
  | "kami-ely"
  | "library-bus"
  | "sql-methodology";

export default function BlogPage() {
  const { language } = useLanguage();
  const isVi = language === "vi";

  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories: { id: FilterCategory; labelVi: string; labelEn: string }[] =
    [
      { id: "all", labelVi: "Tất cả bài viết", labelEn: "All Articles" },
      {
        id: "heritage-japan",
        labelVi: "Heritage Japan (NCKH)",
        labelEn: "Heritage Japan (Research)",
      },
      {
        id: "kami-ely",
        labelVi: "Kami Ely (TikTok Shop)",
        labelEn: "Kami Ely (TikTok Shop)",
      },
      {
        id: "library-bus",
        labelVi: "Library Bus (Product/UX)",
        labelEn: "Library Bus (Product/UX)",
      },
      {
        id: "sql-methodology",
        labelVi: "Phương pháp luận SQL",
        labelEn: "SQL Methodology",
      },
    ];

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.projectKey === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const title = (isVi ? post.titleVi : post.titleEn).toLowerCase();
      const excerpt = (isVi ? post.excerptVi : post.excerptEn).toLowerCase();
      const tagsMatch = post.tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && (title.includes(query) || excerpt.includes(query) || tagsMatch);
    });
  }, [selectedCategory, searchQuery, isVi]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10 sm:space-y-12">
      {/* =====================================================================
       * 1. BLOG HERO HEADER (Official Project Cyan & Deep Teal Palette)
       * ===================================================================== */}
      <section className="relative rounded-3xl overflow-hidden bg-[#F0F9FB] dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 text-slate-900 dark:text-white p-8 sm:p-12">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-[#C8EEF7] dark:border-slate-700 text-[#074553] dark:text-[#9BE7FA] text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-[#FFD14C]" />
            <span>
              {isVi
                ? "Nhật ký Phân tích & Nghiên cứu Dữ liệu"
                : "Data Analytics & Research Engineering Blog"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {isVi
              ? "Quy trình Phân tích, Đối soát & Phát hiện Thực nghiệm"
              : "Analytical Process, Data Reconciliation & Key Findings"}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            {isVi
              ? "Nơi tôi ghi lại chi tiết cách đặt câu hỏi nghiên cứu, quy trình làm sạch dữ liệu (Data Audit), tối ưu hóa truy vấn SQL, kiểm định giả thuyết thống kê và đúc kết bài học từ các dự án thực tế."
              : "Detailed write-ups documenting my research hypotheses, data auditing pipelines, SQL query optimization, statistical hypothesis testing, and strategic findings across projects."}
          </p>
        </div>

        {/* Summary Metric Pills */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6">
          {[
            {
              labelVi: "Chuyên đề Phân tích",
              labelEn: "In-Depth Articles",
              value: `${BLOG_POSTS.length} Posts`,
            },
            {
              labelVi: "Dự án Case Study",
              labelEn: "Core Case Studies",
              value: "3 Projects",
            },
            {
              labelVi: "Khung Phương pháp",
              labelEn: "SQL Framework",
              value: "8 Stages",
            },
            {
              labelVi: "Ngôn ngữ & Công cụ",
              labelEn: "Core Stack",
              value: "SQL • Python • BI",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-slate-950/70 border border-[#C8EEF7] dark:border-slate-800 px-4 py-3"
            >
              <div className="text-lg sm:text-xl font-bold text-[#074553] dark:text-[#9BE7FA] tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {isVi ? stat.labelVi : stat.labelEn}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
       * 2. FILTER & SEARCH BAR (Cyan & Gold Active States)
       * ===================================================================== */}
      <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1 hidden sm:block" />
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  active
                    ? "bg-[#9BE7FA] text-[#074553] border-[#9BE7FA] font-extrabold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-[#9BE7FA]/40 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {isVi ? cat.labelVi : cat.labelEn}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isVi
                ? "Tìm theo chủ đề, SQL, Python..."
                : "Search topics, SQL, Python..."
            }
            aria-label={
              isVi
                ? "Tìm kiếm bài viết theo chủ đề, SQL, Python"
                : "Search articles by topic, SQL, Python"
            }
            className="w-full min-h-[44px] pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9BE7FA] focus:border-[#9BE7FA]"
          />
        </div>
      </section>

      {/* =====================================================================
       * 3. ARTICLES LIST (Max 2 Columns per Article Card)
       * ===================================================================== */}
      <section className="space-y-8">
        {filteredPosts.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isVi
                ? "Không tìm thấy bài viết phù hợp với từ khóa của bạn."
                : "No articles matched your current filter."}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-9 hover:border-[#9BE7FA]/60 transition-colors grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column (7 Cols): Narrative, Process & Actions */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  {/* Meta Badges */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="px-3 py-1 rounded-full font-bold bg-[#9BE7FA]/15 dark:bg-[#9BE7FA]/10 text-[#074553] dark:text-[#9BE7FA] border border-[#9BE7FA]/30">
                      {isVi ? post.categoryVi : post.categoryEn}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 tabular-nums">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 tabular-nums">
                      <Clock className="w-3.5 h-3.5" />
                      {isVi ? post.readTimeVi : post.readTimeEn}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                    {isVi ? post.titleVi : post.titleEn}
                  </h2>

                  {/* Problem Context */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isVi ? post.problemVi : post.problemEn}
                  </p>

                  {/* Process Steps */}
                  <div className="space-y-2 pt-1">
                    <h3 className="text-sm font-bold text-[#074553] dark:text-[#9BE7FA]">
                      {isVi
                        ? "Quy trình Phân tích (Analytical Process):"
                        : "Analytical Process:"}
                    </h3>
                    <ul className="space-y-2">
                      {(isVi ? post.processVi : post.processEn).map(
                        (step, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#074553] dark:text-[#9BE7FA] shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Tags & Action Bar */}
                <div className="pt-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActivePost(post)}
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] text-xs font-bold transition-colors cursor-pointer border border-[#9BE7FA]"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {isVi ? "Đọc chi tiết" : "Read Full Note"}
                    </button>
                    <Link
                      href={post.projectSlug}
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {isVi ? "Xem Dự án" : "View Case Study"}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column (5 Cols): Code Snippet & Key Finding Highlight in #FFE485 */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                {/* Code Block Card */}
                <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between" /* taste-skill-ignore: code block header */>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300">
                      <Terminal className="w-3.5 h-3.5 text-[#9BE7FA]" />
                      {isVi ? post.codeTitleVi : post.codeTitleEn}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#9BE7FA]/20 text-[#9BE7FA]">
                      {post.codeLanguage.toUpperCase()}
                    </span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-60">
                    <code>{post.codeSnippet}</code>
                  </pre>
                </div>

                {/* Key Findings Box with Gold Accent (#FFE485 & #FFD14C) */}
                <div className="rounded-2xl bg-[#FFE485]/15 dark:bg-[#FFE485]/10 border border-[#FFE485]/35 p-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-[#FFE485] mb-2">
                    <Sparkles className="w-4 h-4 text-[#FFD14C]" />
                    <span>
                      {isVi
                        ? "Phát hiện & Giá trị Cốt lõi (Key Findings)"
                        : "Key Findings & Impact"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {isVi ? post.findingsVi : post.findingsEn}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* =====================================================================
       * 4. FULL ARTICLE READER MODAL (Consistent Project Theme)
       * ===================================================================== */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 overflow-y-auto"
          onClick={() => setActivePost(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-2xl my-8 space-y-6" /* taste-skill-ignore: modal overlay */
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePost(null)}
              className="absolute top-6 right-6 min-h-[44px] min-w-[44px] rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-3 pr-8">
              <span className="inline-block text-xs font-bold text-[#074553] dark:text-[#9BE7FA]">
                {isVi ? activePost.categoryVi : activePost.categoryEn}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
                {isVi ? activePost.titleVi : activePost.titleEn}
              </h2>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-5 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {isVi ? "Bài toán & Bối cảnh" : "Problem & Context"}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {isVi ? activePost.problemVi : activePost.problemEn}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#074553] dark:text-[#9BE7FA]">
                {isVi
                  ? "Quy trình Xử lý & Phân tích"
                  : "Step-by-Step Analytical Process"}
              </h3>
              <ul className="space-y-2.5">
                {(isVi ? activePost.processVi : activePost.processEn).map(
                  (step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#074553] dark:text-[#9BE7FA] shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between" /* taste-skill-ignore: code block header */>
                <span className="text-xs font-medium text-slate-300">
                  {isVi ? activePost.codeTitleVi : activePost.codeTitleEn}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#9BE7FA]/20 text-[#9BE7FA]">
                  {activePost.codeLanguage.toUpperCase()}
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{activePost.codeSnippet}</code>
              </pre>
            </div>

            <div className="rounded-2xl bg-[#FFE485]/15 border border-[#FFE485]/35 p-5 space-y-2">
              <h3 className="text-sm font-bold text-amber-900 dark:text-[#FFE485]">
                {isVi
                  ? "Phát hiện Cốt lõi (Key Findings)"
                  : "Key Findings & Strategic Impact"}
              </h3>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {isVi ? activePost.findingsVi : activePost.findingsEn}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between" /* taste-skill-ignore: modal footer */>
              <Link
                href={activePost.projectSlug}
                onClick={() => setActivePost(null)}
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] text-xs font-bold transition border border-[#9BE7FA] cursor-pointer"
              >
                {isVi
                  ? "Mở Toàn bộ Case Study Tương tác"
                  : "Open Full Interactive Case Study"}
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
              >
                {isVi ? "Đóng" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
