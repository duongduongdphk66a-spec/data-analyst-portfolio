'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';
import DashboardMetricCards from '@/components/site/dashboard/DashboardMetricCards';

export interface DashboardSectionProps {
  dashboard?: any;
  onOpenAdmin?: () => void;
}

export default function DashboardSection({ dashboard: _dashboard }: DashboardSectionProps = {}) {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';

  const [selectedDomain, setSelectedDomain] = useState<'all' | 'ecommerce' | 'product' | 'policy'>('all');

  const projectComparisonRows = [
    {
      id: 'kami-ely',
      domain: 'ecommerce',
      badge: 'E-Commerce SQL',
      name: {
        vi: '1. TikTok Shop Kami Ely (@kamielyhn)',
        en: '1. Kami Ely TikTok Shop (@kamielyhn)'
      },
      dataScale: '8 Bảng CSV/MySQL • 18.778 Dòng • 22 Ảnh',
      coreFinding: {
        vi: 'GPM Video (135,2k) gấp 4,5x LIVE (30,2k); CVR Kệ hàng 0,25% (1,17M views); 43% khách Hà Nội',
        en: 'Video GPM (135.2k) is 4.5x LIVE (30.2k); Card CVR 0.25% (1.17M views); 43% Hanoi audience'
      },
      impactMetric: '+1,18 Tỉ VNĐ/tháng (What-If ROI)',
      completenessPct: 98,
      barColor: 'bg-sky-500',
      href: '/projects/kami-ely'
    },
    {
      id: 'library-bus',
      domain: 'product',
      badge: 'Product BI & UX',
      name: {
        vi: '2. Hệ Sinh Thái Thư Viện Lưu Động (Library Bus)',
        en: '2. Mobile Library Bus Ecosystem (Django & BI)'
      },
      dataScale: '6 Django Apps • 10 Analytics Views • 30 Nodes',
      coreFinding: {
        vi: 'Tối ưu 5 tuyến xe (7.080 lượt mượn/tháng), khóa Race Condition 0% trùng đơn, Celery giảm trễ hạn <4,8%',
        en: 'Optimized 5 routes (7,080 borrows/mo), 0% race-condition conflict, Celery cut overdue <4.8%'
      },
      impactMetric: '92,0% Hoàn tất Đặt giữ chỗ (+34%)',
      completenessPct: 95,
      barColor: 'bg-emerald-500',
      href: '/projects/library-bus'
    },
    {
      id: 'heritage-japan',
      domain: 'policy',
      badge: 'Econometrics',
      name: {
        vi: '3. Di Sản Văn Hóa & Kinh Tế Du Lịch Nhật Bản',
        en: '3. Japan Cultural Heritage & Tourism Economics'
      },
      dataScale: '1.132 Quốc bảo • 13.377 Di sản • Chuỗi 2015–2025',
      coreFinding: {
        vi: 'Bất cân xứng không gian (Kansai 41,8%, Gini = 0,64); Hồi quy R² = 0,84; Luật sửa đổi 2019 tăng +24,6% dự án',
        en: 'Spatial disparity (Kansai 41.8%, Gini = 0.64); R² = 0.84; 2019 Law Reform lifted projects by +24.6%'
      },
      impactMetric: 'Giảm áp lực quá tải Kyoto 92 → 54/100',
      completenessPct: 94,
      barColor: 'bg-amber-500',
      href: '/projects/heritage-japan'
    }
  ];

  const filteredRows =
    selectedDomain === 'all'
      ? projectComparisonRows
      : projectComparisonRows.filter((r) => r.domain === selectedDomain);

  return (
    <section aria-label="Executive Analytics Overview" className="w-full space-y-6">
      {/* 1. HÀNG 4 THẺ CHỈ SỐ ĐỊNH LƯỢNG CÓ NGỮ CẢNH RÕ RÀNG */}
      <DashboardMetricCards />

      {/* 2. MA TRẬN ĐỐI SÁNH TRỰC QUAN 3 DỰ ÁN (XÓA KHOẢNG TRỐNG Ở 1440x900) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-950/90 p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5">
          <div>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
              {lang === 'vi'
                ? 'MA TRẬN NĂNG LỰC THỰC CHIẾN • 3 LĨNH VỰC TRỌNG TÂM'
                : 'CROSS-PROJECT ANALYTICS MATRIX • 3 CORE DOMAINS'}
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
              {lang === 'vi'
                ? 'Đối Chiếu Quy Mô Dữ Liệu, Phát Hiện Cốt Lõi & Tác Động Kinh Doanh'
                : 'Comparing Dataset Scale, Core Findings & Quantified Business Impact'}
            </h2>
          </div>

          {/* BỘ LỌC NHANH THEO LĨNH VỰC */}
          <div className="inline-flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {[
              { key: 'all', label: { vi: 'Tất cả (3)', en: 'All (3)' } },
              { key: 'ecommerce', label: { vi: 'E-Commerce SQL', en: 'E-Commerce SQL' } },
              { key: 'product', label: { vi: 'Product BI', en: 'Product BI' } },
              { key: 'policy', label: { vi: 'Kinh tế lượng', en: 'Econometrics' } }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedDomain(tab.key as typeof selectedDomain)}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                  selectedDomain === tab.key
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* DANH SÁCH ĐỐI SÁNH KÈM THANH TIẾN TRÌNH TRỰC QUAN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {filteredRows.map((row) => (
            <Link
              key={row.id}
              href={row.href}
              className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-900/75 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500/50 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-sky-300">
                    {row.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                    {row.dataScale}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition">
                  {row.name[lang]}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {row.coreFinding[lang]}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">{row.impactMetric}</span>
                  <span className="text-sky-700 dark:text-sky-400 font-bold">
                    {lang === 'vi' ? 'Chi tiết →' : 'Inspect →'}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.barColor}`}
                    style={{ width: `${row.completenessPct}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
