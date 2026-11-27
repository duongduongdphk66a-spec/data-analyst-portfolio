"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { BLOG_POSTS, BlogPost } from "@/app/data/blogData";
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
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
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const slug = new URLSearchParams(window.location.search).get("post");
    if (slug) {
      const matched = BLOG_POSTS.find((p) => p.slug === slug || p.id === slug);
      if (matched) setActivePost(matched);
    }
  }, []);

  const categories: { id: FilterCategory; labelVi: string; labelEn: string }[] =
    [
      { id: "all", labelVi: `Tất cả (${BLOG_POSTS.length})`, labelEn: `All (${BLOG_POSTS.length})` },
      {
        id: "kami-ely",
        labelVi: "Kami Ely",
        labelEn: "Kami Ely",
      },
      {
        id: "heritage-japan",
        labelVi: "Heritage Japan",
        labelEn: "Heritage Japan",
      },
      {
        id: "library-bus",
        labelVi: "Library Bus",
        labelEn: "Library Bus",
      },
      {
        id: "sql-methodology",
        labelVi: "Checklist SQL",
        labelEn: "SQL Checklist",
      },
    ];

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(
      (post) => selectedCategory === "all" || post.projectKey === selectedCategory
    );
  }, [selectedCategory]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8 sm:space-y-10">
      {/* =====================================================================
       * 1. BLOG HEADER (Concise & Proportional to 4 Short Notes)
       * ===================================================================== */}
      <section className="rounded-3xl bg-[#F0F9FB] dark:bg-slate-900 border border-[#C8EEF7] dark:border-slate-800 text-slate-900 dark:text-white p-7 sm:p-10 space-y-5">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight text-balance">
            {isVi
              ? "Ghi chép kỹ thuật & đối soát dữ liệu"
              : "Technical notes & data reconciliation"}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-prose">
            {isVi
              ? "Bốn ghi chép ngắn (2–3 phút đọc) tổng hợp các lỗi số liệu thực tế mình tự bắt được, câu lệnh MySQL 8.0 / Python và lý do đằng sau từng quyết định kỹ thuật trong 3 dự án."
              : "Four concise notes (2–3 min reads) documenting real data traps I caught, MySQL 8.0 / Python snippets, and key technical trade-offs across the 3 projects."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
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
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-[#C8EEF7] dark:border-slate-700 hover:border-[#0D7287]"
                }`}
              >
                {isVi ? cat.labelVi : cat.labelEn}
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
       * 3. ARTICLES LIST (Scannable Summary Cards -> Full Note & Code in Modal)
       * ===================================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.length === 0 ? (
          <div className="md:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center">
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
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 hover:border-[#9BE7FA]/60 transition-colors flex flex-col justify-between gap-5"
            >
              <div className="space-y-3.5">
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
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    <Terminal className="w-3 h-3 text-[#0D7287] dark:text-[#9BE7FA]" />
                    {post.codeLanguage.toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {isVi ? post.titleVi : post.titleEn}
                </h2>

                {/* Concise Excerpt */}
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {isVi ? post.excerptVi : post.excerptEn}
                </p>
              </div>

              {/* Tags & Action Bar */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActivePost(post)}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] text-xs font-bold transition-colors cursor-pointer border border-[#9BE7FA]"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {isVi ? "Đọc chi tiết & xem mã nguồn" : "Read full note & code"}
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
