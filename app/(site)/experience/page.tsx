'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Bus, Landmark, Calendar, Bookmark, ArrowRight, FileText, Terminal } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

type ExperienceCategory = 'all' | 'ecommerce' | 'product_bi' | 'econometrics';

interface ExperienceMilestone {
  id: string;
  category: Exclude<ExperienceCategory, 'all'>;
  period: string;
  role: { vi: string; en: string };
  organization: { vi: string; en: string };
  badge: string;
  badgeStyle: string;
  headlineMetric: string;
  summary: { vi: string; en: string };
  starBreakdown: {
    situation: { vi: string; en: string };
    action: { vi: string; en: string };
    result: { vi: string; en: string };
  };
  deliverables: { label: { vi: string; en: string }; value: string }[];
  skills: string[];
  caseStudyHref: string;
}

export default function ExperiencePage() {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'vi';

  const [selectedCategory, setSelectedCategory] = useState<ExperienceCategory>('all');

  const milestones: ExperienceMilestone[] = [
    {
      id: 'exp-kami-ely',
      category: 'ecommerce',
      period: '03/2026 – 09/2026 (Chu kỳ 180 Ngày)',
      role: {
        vi: 'Chuyên Viên Phân Tích Dữ Liệu Thương Mại Điện Tử (E-Commerce Data Analyst)',
        en: 'E-Commerce & Growth Data Analyst'
      },
      organization: {
        vi: 'Dự Án Kiểm Toán Gian Hàng TikTok Shop Kami Ely (@kamielyhn)',
        en: 'Kami Ely TikTok Shop (@kamielyhn) — Multi-Source Data Audit'
      },
      badge: 'E-COMMERCE SQL & GROWTH BI',
      badgeStyle:
        'bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30',
      headlineMetric: '12,74 Tỉ VNĐ (180d) • 85.500 SP • 18.778 Dòng SQL',
      summary: {
        vi: 'Thiết kế kho dữ liệu Star Schema và đối soát chéo 8 tệp dữ liệu thực nghiệm (TikTok Seller Center, Live Workbench) để giải bài toán suy giảm hiệu suất theo mùa vụ và tối ưu hóa ROI đa kênh.',
        en: 'Designed a Star Schema warehouse and cross-reconciled 8 empirical datasets (Seller Center, Live Workbench) to resolve seasonal performance decay and optimize multi-channel ROI.'
      },
      starBreakdown: {
        situation: {
          vi: 'Gian hàng đạt 31,6 Tỉ VNĐ All-Time (12,74 Tỉ VNĐ trong 180 ngày), nhưng phụ thuộc nặng vào kênh chính chủ @kamielyhn (49,31% GMV 90d) với lịch đứng LIVE ~7,5h/ngày và sụt giảm mạnh từ đỉnh 16/06 (315 Tr đ/ngày) xuống đáy 04/09 (5,44 Tr đ/ngày).',
          en: 'The store reached 31.6B VND All-Time (12.74B VND in 180d) but relied heavily on self-operated @kamielyhn (49.31% 90d GMV) with ~7.5h/day LIVE shifts and steep seasonal drop from Jun 16 (315M/day) to Sep 04 (5.44M/day).'
        },
        action: {
          vi: '1) Bóc tách mâu thuẫn Creator Pool 90d (4,73 Tỉ đ = 3,03 Tỉ đ chính chủ + 1,71 Tỉ đ từ 5.712 KOC ngoài); 2) Phát hiện GPM Video (135,2k đ) gấp 4,5x LIVE (30,2k đ) và 308/859 video chưa gắn giỏ; 3) Kiểm định A/B Live Ads nâng tốc độ bán từ 1,81M lên 5,73M đ/giờ.',
          en: '1) Reconciled the 90d Creator Pool (4.73B = 3.03B self-operated + 1.71B across 5,712 external KOCs); 2) Identified 4.5x Video vs LIVE GPM gap (135.2k vs 30.2k) and 308 unmonetized videos; 3) Conducted A/B Live Ads testing lifting velocity from 1.81M to 5.73M VND/hr.'
        },
        result: {
          vi: 'Xây dựng mô hình What-If ROI mở khóa +1,18 Tỉ VNĐ/tháng thông qua nâng CVR Kệ hàng (từ 0,25% trên 1,17M views lên 1,0%), kích hoạt lại siêu KOC @girlstyle.vn (732,77 Tr đ / 5.009 SP) và dịch chuyển lịch đăng bài sang giờ vàng 12:00–13:00 & 15:00–16:00.',
          en: 'Built a What-If ROI model unlocking +1.18B VND/month by lifting Product Card CVR (0.25% on 1.17M views to 1.0%), reactivating top KOC @girlstyle.vn (732.77M VND / 5,009 units), and aligning uploads with 12:00–13:00 & 15:00–16:00 golden hours.'
        }
      },
      deliverables: [
        { label: { vi: 'Phiên LIVE Kiểm Toán', en: 'Audited LIVE Sessions' }, value: '7.046 Phiên (475 Chính chủ)' },
        { label: { vi: 'Video Thương Mại', en: 'Shoppable Videos' }, value: '4.417 Videos (94,7% Ads GMV)' },
        { label: { vi: 'Mạng Lưới Creators', en: 'Creator Network' }, value: '5.713 KOCs (Top 1% = 91,49%)' },
        { label: { vi: 'Tăng Trưởng 28d Đầu', en: 'Initial 28d Growth' }, value: '1,35 Tỉ đ (+56,24% PoP)' }
      ],
      skills: [
        'MySQL / Window Functions',
        'Cohort Retention SQL',
        'Pareto & Lorenz Curve',
        'A/B Testing Live Ads',
        'Power BI Blueprint'
      ],
      caseStudyHref: '/projects/kami-ely'
    },
    {
      id: 'exp-library-bus',
      category: 'product_bi',
      period: '2025 – 2026',
      role: {
        vi: 'Kỹ Sư Phân Tích Sản Phẩm & Hệ Thống BI (Product Analytics & Full-Stack Developer)',
        en: 'Product Analytics & Full-Stack BI Developer'
      },
      organization: {
        vi: 'Hệ Sinh Thái Thư Viện Lưu Động Thông Minh (Library Bus Project)',
        en: 'Smart Mobile Library Bus Ecosystem (Django & Product BI)'
      },
      badge: 'PRODUCT BI & BACKEND ARCHITECTURE',
      badgeStyle:
        'bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
      headlineMetric: '7.080 Lượt Mượn/Tháng • 6 Django Apps • 92,0% Hoàn Tất Đặt Trước',
      summary: {
        vi: 'Thiết kế và triển khai hệ thống quản trị thư viện lưu động toàn diện gồm 6 phân hệ Django, hàng đợi bất đồng bộ Celery/Redis và 10 bảng điều khiển phân tích hành vi độc giả.',
        en: 'Architected and deployed an end-to-end mobile library platform featuring 6 Django apps, Celery/Redis async workers, and 10 reader behavior analytics dashboards.'
      },
      starBreakdown: {
        situation: {
          vi: 'Mô hình xe buýt thư viện lưu động gặp bài toán lệch tồn kho giữa các điểm đỗ, tỷ lệ độc giả quên trả sách quá hạn cao và lỗi trùng đơn (Race Condition) khi nhiều người đặt giữ chỗ cuốn sách cuối cùng.',
          en: 'Mobile library buses faced stock imbalances across stops, high overdue return rates, and race-condition double bookings when multiple readers reserved the last copy simultaneously.'
        },
        action: {
          vi: '1) Xây dựng cơ chế khóa giao dịch mức cơ sở dữ liệu (kiểm chứng bằng test_race_condition.py); 2) Thiết kế 10 màn hình Analytics theo dõi vòng quay sách theo từng tuyến xe; 3) Tự động hóa nhắc hạn qua Celery.',
          en: '1) Implemented database-level transaction locking (verified via test_race_condition.py); 2) Built 10 Analytics views tracking book turnover per bus route; 3) Automated due reminders via Celery.'
        },
        result: {
          vi: 'Đạt 0% lỗi xung đột đặt sách, nâng tỷ lệ hoàn tất nhận sách đặt trước lên 92,0% (+34%), duy trì hệ số vòng quay 3,6x trên 5 tuyến xe (30 điểm đỗ) và giảm tỷ lệ trễ hạn xuống dưới 4,8%.',
          en: 'Achieved 0% booking conflict, lifted reservation pickup completion to 92.0% (+34%), sustained a 3.6x turnover rate across 5 routes (30 stops), and reduced overdue returns below 4.8%.'
        }
      },
      deliverables: [
        { label: { vi: 'Kiến Trúc Phần Mềm', en: 'System Architecture' }, value: '6 Django Apps • 30 Nodes' },
        { label: { vi: 'Giao Diện Phân Tích', en: 'Analytics Views' }, value: '10 Dashboards • 55+ Templates' },
        { label: { vi: 'Kiểm Thử Đồng Thời', en: 'Concurrency Audit' }, value: '0% Race-Condition Conflict' },
        { label: { vi: 'Vòng Quay Tồn Kho', en: 'Inventory Turnover' }, value: '3,6x – 4,2x / Tháng' }
      ],
      skills: [
        'Python (Django)',
        'Celery & Redis',
        'Product Conversion Funnel',
        'Concurrency Locking',
        'UX/UI System Design'
      ],
      caseStudyHref: '/projects/library-bus'
    },
    {
      id: 'exp-heritage-japan',
      category: 'econometrics',
      period: '2025 – 2026',
      role: {
        vi: 'Nhà Nghiên Cứu Phân Tích Định Lượng & Kinh Tế Lượng (Quantitative Policy Analyst)',
        en: 'Quantitative & Econometric Policy Analyst'
      },
      organization: {
        vi: 'Nghiên Cứu Di Sản Văn Hóa & Kinh Tế Du Lịch Nhật Bản (2015–2025)',
        en: 'Cultural Heritage & Tourism Economics in Japan (2015–2025)'
      },
      badge: 'ECONOMETRICS & PUBLIC POLICY',
      badgeStyle:
        'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
      headlineMetric: '1.132 Quốc Bảo • R² = 0,84 (p < 0,01) • +24,6% Dự Án (DiD)',
      summary: {
        vi: 'Định lượng sự tập trung không gian của 14.509 di sản văn hóa cấp quốc gia tại Nhật Bản và đánh giá tác động kinh tế – chính sách của Luật Bảo tồn sửa đổi năm 2019.',
        en: 'Quantified spatial concentration across 14,509 national cultural properties in Japan and evaluated the economic and policy impacts of the 2019 Cultural Properties Law Reform.'
      },
      starBreakdown: {
        situation: {
          vi: '41,8% Quốc bảo tập trung tại vùng Kansai (Gini = 0,64) gây áp lực quá tải du lịch (Overtourism = 92/100 tại Kyoto), trong khi các tỉnh địa phương thiếu ngân sách bảo tồn (68% ngân sách ACA dồn cho trùng tu cơ bản).',
          en: '41.8% of National Treasures are concentrated in Kansai (Gini = 0.64), causing severe overtourism in Kyoto (92/100 index) while regional prefectures lack preservation funding.'
        },
        action: {
          vi: '1) Ước lượng mô hình hồi quy OLS đa biến kiểm định sức hút di sản đối với doanh thu du lịch; 2) Áp dụng mô hình Sai phân kép (DiD) đánh giá hiệu quả kế hoạch địa phương hóa sau năm 2019.',
          en: '1) Estimated multivariate OLS regression models testing heritage pull on tourism revenue; 2) Applied Difference-in-Differences (DiD) to evaluate post-2019 regional revitalization plans.'
        },
        result: {
          vi: 'Chứng minh hệ số co giãn du lịch β = +0,72 (R² = 0,84) và hiệu ứng DiD giúp các tỉnh phê duyệt quy hoạch tăng +24,6% dự án bảo tồn; xây dựng Simulator điều tiết giảm chỉ số quá tải Kyoto từ 92 xuống 54/100.',
          en: 'Proved tourism elasticity β = +0.72 (R² = 0.84) and a +24.6% project uplift via DiD; built a Policy Simulator reducing Kyoto overtourism pressure from 92 to 54/100.'
        }
      },
      deliverables: [
        { label: { vi: 'Tài Sản Kiểm Toán', en: 'Audited Properties' }, value: '1.132 Quốc bảo • 13.377 ICPs' },
        { label: { vi: 'Mô Hình Hồi Quy OLS', en: 'OLS Regression Fit' }, value: 'R² = 0,84 • β = +0,72' },
        { label: { vi: 'Kiểm Định Chính Sách', en: 'DiD Policy Impact' }, value: '+24,6% Dự án Địa phương' },
        { label: { vi: 'Chuỗi Thời Gian', en: 'Time-Series Span' }, value: '10 Năm (2015 – 2025)' }
      ],
      skills: [
        'OLS Multiple Regression',
        'Difference-in-Differences (DiD)',
        'Spatial Gini Index',
        'Policy Simulation',
        'Academic Storytelling'
      ],
      caseStudyHref: '/projects/heritage-japan'
    }
  ];

  const filteredMilestones =
    selectedCategory === 'all'
      ? milestones
      : milestones.filter((m) => m.category === selectedCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. HEADER & EXECUTIVE SUMMARY */}
      <header className="rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-950/95 p-5 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-2 max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-sky-100 text-sky-950 border border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30">
              {lang === 'vi'
                ? 'LỘ TRÌNH KINH NGHIỆM & THÀNH TỰU ĐỊNH LƯỢNG (STAR FRAMEWORK)'
                : 'EMPIRICAL EXPERIENCE & QUANTIFIED IMPACT (STAR FRAMEWORK)'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
              {lang === 'vi'
                ? 'Kinh Nghiệm Phân Tích Dữ Liệu Thực Chiến'
                : 'Hands-On Data Analytics & BI Engineering Experience'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'vi'
                ? 'Mỗi dự án dưới đây được trình bày theo khung STAR (Bối cảnh – Hành động Phân tích – Kết quả Định lượng), đi kèm kho dữ liệu gốc và công cụ mô phỏng trực tiếp.'
                : 'Every milestone below is structured using the STAR framework (Situation – Analytical Action – Quantified Result), backed by auditable datasets and live simulators.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#074553] hover:bg-[#05333d] dark:bg-[#9BE7FA] dark:hover:bg-[#82e2f8] text-white dark:text-slate-950 text-xs sm:text-sm font-bold transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Tải CV Đầy Đủ (PDF)' : 'Download Full CV (PDF)'}</span>
            </a>
            <Link
              href="/lab"
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-emerald-300 dark:border-emerald-500/30 text-xs sm:text-sm font-mono font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Kiểm tra SQL (/lab)' : 'Verify SQL (/lab)'}</span>
            </Link>
          </div>
        </div>

        {/* FILTER TABS (CHUẨN MIN-H 44PX THEO UI/UX PRO MAX) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: { vi: 'Tất cả Lĩnh vực (3)', en: 'All Domains (3)' }, icon: null },
              { key: 'ecommerce', label: { vi: 'E-Commerce SQL & BI', en: 'E-Commerce SQL & BI' }, icon: ShoppingBag },
              { key: 'product_bi', label: { vi: 'Product BI & Django', en: 'Product BI & Django' }, icon: Bus },
              { key: 'econometrics', label: { vi: 'Kinh tế lượng & Chính sách', en: 'Econometrics & Policy' }, icon: Landmark }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedCategory(tab.key as ExperienceCategory)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition border cursor-pointer inline-flex items-center gap-1.5 ${
                    selectedCategory === tab.key
                      ? 'bg-[#9BE7FA] text-[#074553] border-[#9BE7FA] shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:border-[#9BE7FA]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                  <span>{tab.label[lang]}</span>
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {lang === 'vi'
              ? '100% số liệu khớp với kho dữ liệu kiểm toán thực tế'
              : '100% metrics reconciled with ground-truth datasets'}
          </span>
        </div>
      </header>

      {/* 2. STAR TIMELINE CARDS */}
      <div className="space-y-6">
        {filteredMilestones.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-slate-950/95 p-5 sm:p-7 shadow-lg space-y-5"
          >
            {/* TOP META */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${item.badgeStyle}`}>
                    {item.badge}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.period}</span>
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white pt-1">
                  {item.role[lang]}
                </h2>
                <div className="text-xs sm:text-sm font-semibold text-[#074553] dark:text-[#9BE7FA]">
                  {item.organization[lang]}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#C8EEF7]/30 dark:bg-slate-800/80 border border-[#9BE7FA]/50 dark:border-slate-700 text-xs font-mono font-bold text-[#074553] dark:text-[#FFE485] self-start lg:self-auto inline-flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#FFD14C] shrink-0" />
                <span>{item.headlineMetric}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {item.summary[lang]}
            </p>

            {/* 4 DELIVERABLE METRICS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {item.deliverables.map((deliv, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800"
                >
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {deliv.label[lang]}
                  </div>
                  <div className="text-sm sm:text-base font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
                    {deliv.value}
                  </div>
                </div>
              ))}
            </div>

            {/* STAR BREAKDOWN (3 COLUMNS) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400 uppercase">
                  1. Bối Cảnh & Bài Toán (Situation & Task)
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.starBreakdown.situation[lang]}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="text-xs font-mono font-bold text-sky-800 dark:text-sky-400 uppercase">
                  2. Phương Pháp & Hành Động (Analytical Action)
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.starBreakdown.action[lang]}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 space-y-1.5">
                <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase">
                  3. Tác Động Định Lượng (Quantified Result)
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {item.starBreakdown.result[lang]}
                </p>
              </div>
            </div>

            {/* SKILLS & CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap gap-1.5">
                {item.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              <Link
                href={item.caseStudyHref}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#074553] hover:bg-[#05333d] dark:bg-[#9BE7FA] dark:hover:bg-[#82e2f8] text-white dark:text-slate-950 text-xs font-mono font-bold transition inline-flex items-center justify-center gap-2 shrink-0 shadow-xs cursor-pointer"
              >
                <span>{lang === 'vi' ? 'Mở Báo Cáo Case Study Đầy Đủ' : 'Open Full Case Study'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
