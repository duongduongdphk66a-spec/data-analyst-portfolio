'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import { usePortfolioData } from '@/app/context/PortfolioDataContext';

export default function HeroSection({ profile: propsProfile }: { profile?: any } = {}) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';
  const { profile: contextProfile } = usePortfolioData();
  const profile = propsProfile || contextProfile;

  const [activeHighlightIdx, setActiveHighlightIdx] = useState<number>(0);

  const flagshipHighlights = [
    {
      id: 'kami-ely',
      href: '/projects/kami-ely',
      tag: { vi: 'CASE STUDY #1 • E-COMMERCE SQL & BI', en: 'CASE STUDY #1 • E-COMMERCE SQL & BI' },
      title: {
        vi: 'TikTok Shop Kami Ely (@kamielyhn) — 12,74 Tỉ VNĐ (180d)',
        en: 'TikTok Shop Kami Ely (@kamielyhn) — 12.74B VND (180d)'
      },
      statMain: '31,6 Tỉ VNĐ All-Time • 18.778 Dòng SQL',
      statSub: {
        vi: 'Phát hiện Nghịch lý GPM Video gấp 4,5x LIVE (135,2k vs 30,2k) & Mở khóa +1,18 Tỉ đ/tháng',
        en: 'Uncovered 4.5x Video vs LIVE GPM Paradox (135.2k vs 30.2k) & +1.18B VND/mo ROI Uplift'
      },
      bars: [
        { label: 'Chính chủ @kamielyhn (90d)', val: '49,31% GMV (3,03 Tỉ)', pct: 49.31, color: 'bg-sky-500' },
        { label: 'Mạng lưới 5.712 KOCs (90d)', val: '27,84% GMV (1,71 Tỉ)', pct: 27.84, color: 'bg-emerald-500' },
        { label: 'Thẻ Sản Phẩm / Kệ Hàng (90d)', val: '22,85% GMV (1,40 Tỉ)', pct: 22.85, color: 'bg-amber-500' }
      ]
    },
    {
      id: 'library-bus',
      href: '/projects/library-bus',
      tag: { vi: 'CASE STUDY #2 • PRODUCT ANALYTICS & BI', en: 'CASE STUDY #2 • PRODUCT ANALYTICS & BI' },
      title: {
        vi: 'Hệ Sinh Thái Thư Viện Lưu Động (Library Bus Full-Stack)',
        en: 'Mobile Library Bus Ecosystem (Full-Stack & Product BI)'
      },
      statMain: '7.080 Lượt Mượn/Tháng • 6 Django Apps',
      statSub: {
        vi: 'Tối ưu hóa 5 tuyến xe (30 điểm đỗ), khóa chống xung đột 0% trùng đơn & 92% hoàn tất đặt trước',
        en: 'Optimized 5 bus routes (30 stops), 0% race-condition booking conflict & 92% reservation fulfillment'
      },
      bars: [
        { label: 'Tỷ lệ Hoàn tất Đặt giữ chỗ', val: '92,0% (+34% YoY)', pct: 92, color: 'bg-emerald-500' },
        { label: 'Tỷ lệ Chuyển đổi Tra cứu → Xem sách', val: '62,0% (7.688 độc giả)', pct: 62, color: 'bg-sky-500' },
        { label: 'Độ phủ Nhắc hạn Tự động (Celery)', val: '85,0% (Quá hạn <4,8%)', pct: 85, color: 'bg-indigo-500' }
      ]
    },
    {
      id: 'heritage-japan',
      href: '/projects/heritage-japan',
      tag: { vi: 'CASE STUDY #3 • KINH TẾ LƯỢNG & CHÍNH SÁCH', en: 'CASE STUDY #3 • ECONOMETRICS & POLICY' },
      title: {
        vi: 'Di Sản Văn Hóa & Kinh Tế Du Lịch Nhật Bản (2015–2025)',
        en: 'Japan Cultural Heritage & Tourism Economics (2015–2025)'
      },
      statMain: '1.132 Quốc Bảo • R² = 0,84 (p < 0,01)',
      statSub: {
        vi: 'Mô hình DiD đánh giá Luật Bảo tồn sửa đổi 2019 (+24,6% dự án) & Giải pháp giãn khách Kyoto',
        en: 'DiD evaluation of 2019 Law Reform (+24.6% projects) & Kyoto Overtourism dispersal simulation'
      },
      bars: [
        { label: 'Hệ số xác định Mô hình Hồi quy (R²)', val: '84,0% (β = +0,72)', pct: 84, color: 'bg-amber-500' },
        { label: 'Tỷ trọng Quốc bảo tại vùng Kansai', val: '41,8% (Gini = 0,64)', pct: 41.8, color: 'bg-rose-500' },
        { label: 'Tỷ lệ Trùng tu trong Ngân sách ACA', val: '68,0% (141,2 Tỉ Yên)', pct: 68, color: 'bg-sky-500' }
      ]
    }
  ];

  const currentHighlight = flagshipHighlights[activeHighlightIdx];

  const displayName =
    profile?.name?.[lang] ||
    (typeof profile?.name === 'string' ? profile.name : null) ||
    (lang === 'vi' ? 'Mã Văn Hùng' : 'Ma Van Hung');

  const displayRole =
    profile?.title?.[lang] ||
    (typeof profile?.title === 'string' ? profile.title : null) ||
    (lang === 'vi'
      ? 'Chuyên Viên Phân Tích Dữ Liệu (E-Commerce, Product BI & Econometrics)'
      : 'Data Analyst (E-Commerce, Product BI & Econometrics)');

  return (
    <section className="w-full pt-2 pb-4">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-950/95 p-5 sm:p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* CỘT TRÁI (7 CỘT): ĐỊNH VỊ CHUYÊN MÔN & HÀNH ĐỘNG NHANH */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {lang === 'vi' ? 'Sẵn sàng nhận việc • Hà Nội / Remote' : 'Available for Hire • Hanoi / Remote'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800">
                SQL • Python • Power BI • Next.js
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {displayName} —{' '}
                <span className="bg-gradient-to-r from-sky-600 via-emerald-600 to-indigo-600 dark:from-sky-400 dark:via-emerald-300 dark:to-indigo-400 bg-clip-text text-transparent">
                  {displayRole}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'vi'
                  ? 'Chuyển hóa dữ liệu thô đa nguồn thành quyết định tăng trưởng doanh thu có thể kiểm chứng: Từ kiểm toán 18.778 bản ghi SQL cho gian hàng TikTok Shop 31,6 Tỉ VNĐ, xây dựng hệ thống BI cho Thư viện Lưu động, đến mô hình kinh tế lượng đánh giá chính sách công.'
                  : 'Transforming multi-source raw telemetry into verifiable revenue decisions: From auditing 18,778 SQL records for a 31.6B VND TikTok Shop and architecting a Mobile Library BI platform, to econometric policy evaluation.'}
              </p>
            </div>

            {/* 3 CHỈ SỐ ĐỊNH ĐỊNH NĂNG LỰC NHANH */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {lang === 'vi' ? 'Quy mô GMV Phân tích' : 'Audited GMV Scale'}
                </div>
                <div className="text-base sm:text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
                  31,6 Tỉ đ
                </div>
                <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400">
                  12,74 Tỉ (180 ngày)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {lang === 'vi' ? 'Kho Dữ liệu SQL' : 'SQL Warehouse'}
                </div>
                <div className="text-base sm:text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
                  18.778 Dòng
                </div>
                <div className="text-xs font-mono text-sky-700 dark:text-sky-400">
                  8 Bảng • 3 Case Studies
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {lang === 'vi' ? 'Tác động Mô phỏng' : 'Simulated Uplift'}
                </div>
                <div className="text-base sm:text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
                  +1,18 Tỉ/th
                </div>
                <div className="text-xs font-mono text-amber-700 dark:text-amber-400">
                  What-If ROI Models
                </div>
              </div>
            </div>

            {/* CỤM NÚT HÀNH ĐỘNG CHUẨN VÙNG CHẠM >= 40PX */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/projects/kami-ely"
                className="min-h-[42px] px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-sky-500/20 flex items-center gap-2"
              >
                <span>📊</span>
                <span>
                  {lang === 'vi' ? 'Xem Dự Án Mũi Nhọn (Kami Ely)' : 'Explore Flagship Case Study'}
                </span>
              </Link>

              <Link
                href="/lab"
                className="min-h-[42px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-emerald-300 dark:border-emerald-500/30 text-xs sm:text-sm font-mono font-bold transition flex items-center gap-2"
              >
                <span>💻</span>
                <span>{lang === 'vi' ? 'Chạy Thử SQL (/lab)' : 'Interactive SQL Lab'}</span>
              </Link>

              <a
                href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold transition flex items-center gap-2"
              >
                <span>📄</span>
                <span>{lang === 'vi' ? 'Tải CV (PDF)' : 'Download CV (PDF)'}</span>
              </a>
            </div>
          </div>

          {/* CỘT PHẢI (5 CỘT): THẺ TRỰC QUAN HÓA ĐỐI SÁNH NHANH 3 DỰ ÁN */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-4 shadow-inner">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                ⚡ {lang === 'vi' ? 'Điểm Nhấn 3 Dự Án Thực Chiến' : '3 Flagship Case Studies Live Preview'}
              </span>
              <div className="flex gap-1">
                {flagshipHighlights.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveHighlightIdx(idx)}
                    className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                      activeHighlightIdx === idx
                        ? 'bg-sky-600 text-white shadow'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400">
                {currentHighlight.tag[lang]}
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {currentHighlight.title[lang]}
              </h2>
              <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                📌 {currentHighlight.statMain}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentHighlight.statSub[lang]}
              </p>

              {/* ĐỒ THỊ THANH NGANG TRỰC QUAN */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                {currentHighlight.bars.map((bar, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{bar.label}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-sky-300">{bar.val}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bar.color} transition-all duration-500`}
                        style={{ width: `${Math.min(100, bar.pct)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href={currentHighlight.href}
                  className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 dark:bg-sky-500/20 dark:hover:bg-sky-500/30 dark:text-sky-300 dark:border-sky-500/40 text-xs font-mono font-bold inline-flex items-center gap-1.5 transition"
                >
                  <span>{lang === 'vi' ? 'Mở Báo Cáo Chi Tiết' : 'Open Full Case Study'}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
