'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Database, 
  Terminal, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  FileText, 
  ArrowRight, 
  ArrowUpRight, 
  Globe, 
  Briefcase, 
  Clock, 
  User, 
  BookOpen, 
  ShoppingBag, 
  Layout, 
  Landmark 
} from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { usePortfolioData } from '@/app/context/PortfolioDataContext';

type Lang = 'vi' | 'en';

interface SkillItem {
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface OutcomeItem {
  metric: string;
  detail: string;
}

interface TeaserItem {
  tag: string;
  question: string;
  cta: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavLinkItem {
  title: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ContentType {
  badge: string;
  greeting: string;
  name: string;
  role: string;
  headline: string;
  summary: string;
  skillsLabel: string;
  skills: SkillItem[];
  outcomes: OutcomeItem[];
  curiosityTitle: string;
  curiositySubtitle: string;
  teasers: TeaserItem[];
  navExploreTitle: string;
  navLinks: NavLinkItem[];
  primaryBtn: string;
  secondaryBtn: string;
}

const CONTENT: Record<Lang, ContentType> = {
  vi: {
    badge: 'Sẵn sàng cho các bài toán dữ liệu thực chiến',
    greeting: 'Xin chào, tôi là',
    name: 'Mã Văn Hùng',
    role: 'Data Analyst — Định hướng Giải quyết Bài toán Kinh doanh',
    headline: 'Biến dữ liệu phức tạp thành tăng trưởng doanh thu & hiệu suất vận hành.',
    summary:
      'Doanh nghiệp không thiếu dữ liệu, họ thiếu những quyết định có cơ sở. Kết hợp tư duy phân tích sắc bén với công cụ hiện đại, tôi giúp các đội ngũ chuyển hóa hàng triệu dòng dữ liệu thô thành hành động chiến lược đo lường được bằng con số thực tế.',
    skillsLabel: 'Công cụ & Chuyên môn cốt lõi',
    skills: [
      { name: 'SQL', desc: 'Cohort, Funnel, Tối ưu hóa truy vấn & ETL', icon: Database },
      { name: 'Python', desc: 'EDA, Kiểm định giả thuyết & Dự báo chuỗi thời gian', icon: Terminal },
      { name: 'Power BI', desc: 'Data Modeling (DAX) & Executive Dashboard', icon: BarChart3 },
      { name: 'Tableau', desc: 'Visual Storytelling & Phân tích tương tác', icon: PieChart },
      { name: 'Business Intelligence', desc: 'Tư duy Minto Pyramid & Tối ưu KPI', icon: TrendingUp },
    ],
    outcomes: [
      {
        metric: 'Tối ưu Doanh thu',
        detail: 'Bóc tách hành vi khách hàng, ma trận SKU và hiệu quả kênh bán để tìm đòn bẩy tăng trưởng.',
      },
      {
        metric: 'Minh bạch Vận hành',
        detail: 'Tự động hóa luồng báo cáo, đối soát dữ liệu (Reconciliation) và phát hiện bất thường (Anomaly Detection).',
      },
      {
        metric: 'Quyết định Dựa trên Bằng chứng',
        detail: 'Thay thế cảm tính bằng kiểm định thống kê và cấu trúc kể chuyện dữ liệu (Minto Pyramid).',
      },
    ],
    curiosityTitle: 'Đằng sau những con số là câu chuyện gì?',
    curiositySubtitle:
      'Đừng chỉ nghe tôi nói về kỹ năng. Hãy xem cách tôi giải quyết từng bài toán thực tế bên dưới:',
    teasers: [
      {
        tag: 'E-Commerce & TikTok Shop Analytics',
        question: 'Làm thế nào để tối ưu hóa danh mục SKU, phân tích Affiliate/Creator và kiểm định thống kê doanh số trên TikTok Shop?',
        cta: 'Khám phá Case Study Kami Ely',
        href: '/projects/kami-ely',
        icon: ShoppingBag,
      },
      {
        tag: 'Product Analytics & System Architecture',
        question: 'Từ nghiên cứu UX đến thiết kế luồng dữ liệu và Dashboard quản trị vận hành hệ thống xe buýt thư viện diễn ra như thế nào?',
        cta: 'Xem kiến trúc dự án Library Bus',
        href: '/projects/library-bus',
        icon: Layout,
      },
      {
        tag: 'Data Audit & Policy Evaluation',
        question: 'Dữ liệu định lượng tiết lộ điều gì về hiệu quả chính sách bảo tồn di sản tại Nhật Bản?',
        cta: 'Đọc phân tích Heritage Japan',
        href: '/projects/heritage-japan',
        icon: Landmark,
      },
    ],
    navExploreTitle: 'Khám phá thêm về hành trình của tôi',
    navLinks: [
      {
        title: 'Tất cả Dự án (Projects)',
        desc: 'Trải nghiệm trực tiếp SQL Lab, biểu đồ tương tác và các phân tích chuyên sâu.',
        href: '/projects',
        icon: Briefcase,
      },
      {
        title: 'Kinh nghiệm (Experience)',
        desc: 'Quá trình làm việc và những giá trị thực tế tôi đã đóng góp.',
        href: '/experience',
        icon: Clock,
      },
      {
        title: 'Về tôi (About)',
        desc: 'Triết lý phân tích dữ liệu, bộ kỹ năng chi tiết và câu chuyện cá nhân.',
        href: '/about',
        icon: User,
      },
      {
        title: 'Góc chia sẻ (Blog)',
        desc: 'Ghi chép chuyên môn về SQL, Python, BI và tư duy giải quyết vấn đề.',
        href: '/blog',
        icon: BookOpen,
      },
    ],
    primaryBtn: 'Xem các Case Study thực chiến',
    secondaryBtn: 'Tải CV (PDF)',
  },
  en: {
    badge: 'Ready for High-Impact Data Challenges',
    greeting: "Hi, I'm",
    name: 'Ma Van Hung',
    role: 'Outcome-Driven Data Analyst',
    headline: 'Turning raw, fragmented data into revenue growth & operational clarity.',
    summary:
      "Businesses don't suffer from a lack of data—they suffer from a lack of actionable answers. By combining analytical rigor with modern BI tools, I bridge the gap between complex datasets and measurable business outcomes.",
    skillsLabel: 'Core Tech Stack & Expertise',
    skills: [
      { name: 'SQL', desc: 'Cohort, Funnel, Query Optimization & ETL', icon: Database },
      { name: 'Python', desc: 'EDA, Hypothesis Testing & Time Series', icon: Terminal },
      { name: 'Power BI', desc: 'DAX Data Modeling & Executive Dashboards', icon: BarChart3 },
      { name: 'Tableau', desc: 'Visual Storytelling & Interactive Analytics', icon: PieChart },
      { name: 'Business Intelligence', desc: 'Minto Pyramid Narrative & KPI Strategy', icon: TrendingUp },
    ],
    outcomes: [
      {
        metric: 'Revenue Optimization',
        detail: 'Uncovering SKU matrices, creator performance, and conversion bottlenecks to unlock growth.',
      },
      {
        metric: 'Operational Clarity',
        detail: 'Automating reporting pipelines, data reconciliation, and real-time anomaly detection.',
      },
      {
        metric: 'Evidence-Based Decisions',
        detail: 'Replacing guesswork with applied statistics and structured executive storytelling.',
      },
    ],
    curiosityTitle: 'Curious how these skills translate into real impact?',
    curiositySubtitle:
      "Don't just take my word for it. Dive into the live case studies and interactive workbenches:",
    teasers: [
      {
        tag: 'E-Commerce & TikTok Shop Analytics',
        question: 'How do you reconcile creator telemetry, optimize SKU pricing, and run applied statistics on TikTok Shop data?',
        cta: 'Explore Kami Ely Case Study',
        href: '/projects/kami-ely',
        icon: ShoppingBag,
      },
      {
        tag: 'Product Analytics & System Architecture',
        question: 'How do UX research, backend dataflows, and management dashboards come together in a mobile library ecosystem?',
        cta: 'Inspect Library Bus Architecture',
        href: '/projects/library-bus',
        icon: Layout,
      },
      {
        tag: 'Data Audit & Policy Evaluation',
        question: 'What does a rigorous data audit reveal about heritage preservation policies in Japan?',
        cta: 'Read Heritage Japan Study',
        href: '/projects/heritage-japan',
        icon: Landmark,
      },
    ],
    navExploreTitle: 'Continue Exploring',
    navLinks: [
      {
        title: 'Projects & SQL Lab',
        desc: 'Interact with live SQL workbenches, charts, and end-to-end case studies.',
        href: '/projects',
        icon: Briefcase,
      },
      {
        title: 'Experience',
        desc: 'My professional timeline and measurable contributions.',
        href: '/experience',
        icon: Clock,
      },
      {
        title: 'About Me',
        desc: 'My analytical philosophy, background, and technical depth.',
        href: '/about',
        icon: User,
      },
      {
        title: 'Blog & Insights',
        desc: 'Deep dives into SQL patterns, Python workflows, and business thinking.',
        href: '/blog',
        icon: BookOpen,
      },
    ],
    primaryBtn: 'Explore Live Case Studies',
    secondaryBtn: 'Download CV (PDF)',
  },
};

export default function HeroSection({ profile: propsProfile }: { profile?: any } = {}) {
  const { language, toggleLanguage } = useLanguage();
  const lang: Lang = language === 'en' ? 'en' : 'vi';
  const { profile: contextProfile } = usePortfolioData();
  const profile = propsProfile || contextProfile;

  const t = CONTENT[lang];

  const resolvedName =
    typeof profile?.name === 'string' && profile.name.trim()
      ? profile.name
      : t.name;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-16 md:space-y-20">
      
      {/* Top Bar: Live Status Badge & Language Toggle */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/10 border border-[#9BE7FA]/40 text-[#074553] dark:text-[#9BE7FA] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t.badge}</span>
        </div>
        
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={lang === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese'}
          className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Globe className="w-3.5 h-3.5 text-[#074553] dark:text-[#9BE7FA]" />
          <span>{lang === 'vi' ? 'EN / VI' : 'VI / EN'}</span>
        </button>
      </div>

      {/* 1. HERO SECTION: Who I Am & Business Outcomes Statement */}
      <section className="space-y-6">
        <div className="space-y-2.5">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-[#074553] dark:text-[#9BE7FA] font-bold">
            {t.greeting} <span className="text-slate-900 dark:text-white font-extrabold">{resolvedName}</span> — {t.role}
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {t.headline}
          </h1>
        </div>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {t.summary}
        </p>

        {/* Primary CTAs with 44px Touch Targets */}
        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          <Link
            href="/projects"
            className="min-h-[44px] px-6 py-3 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] font-extrabold text-sm shadow-md shadow-[#9BE7FA]/20 transition-all flex items-center gap-2 cursor-pointer border border-[#9BE7FA]"
          >
            <span>{t.primaryBtn}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>

          <a
            href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>{t.secondaryBtn}</span>
          </a>
        </div>
      </section>

      {/* 2. CORE TECH STACK: SQL, Python, Power BI, Tableau, Business Intelligence */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t.skillsLabel}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {t.skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.name}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 hover:border-[#9BE7FA]/60 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#C8EEF7]/40 dark:bg-[#9BE7FA]/10 text-[#074553] dark:text-[#9BE7FA]">
                      <Icon className="w-4 h-4 shrink-0" />
                    </span>
                    <div className="font-bold text-slate-900 dark:text-[#9BE7FA] text-base">
                      {skill.name}
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-snug">
                    {skill.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. BUSINESS OUTCOMES PILLARS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {t.outcomes.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800/90 shadow-xs hover:border-[#9BE7FA]/40 transition-all"
          >
            <div className="text-xs font-mono font-bold text-[#074553] dark:text-[#9BE7FA] mb-2.5">
              0{idx + 1} {'//'} OUTCOME
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {item.metric}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.detail}
            </p>
          </div>
        ))}
      </section>

      {/* 4. CURIOSITY HOOKS: Case Study Teasers (Open Loops) */}
      <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800/80">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.curiosityTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.curiositySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {t.teasers.map((teaser, idx) => {
            const TeaserIcon = teaser.icon;
            return (
              <Link
                key={idx}
                href={teaser.href}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-[#9BE7FA]/60 dark:hover:border-[#9BE7FA]/60 hover:bg-slate-50/70 dark:hover:bg-slate-900 transition-all flex flex-col justify-between shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="space-y-3.5">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#074553] dark:text-[#9BE7FA] bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/10 border border-[#9BE7FA]/30 px-2.5 py-1 rounded-md">
                    <TeaserIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{teaser.tag}</span>
                  </span>
                  <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-relaxed">
                    “{teaser.question}”
                  </p>
                </div>
                <div className="pt-6 text-xs font-bold text-[#074553] dark:text-[#9BE7FA] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>{teaser.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. EXPLORE OTHER PAGES: Navigation Hooks */}
      <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800/80">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          {t.navExploreTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.navLinks.map((nav) => {
            const NavIcon = nav.icon;
            return (
              <Link
                key={nav.href}
                href={nav.href}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-all flex items-start justify-between gap-4 shadow-xs cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#074553] dark:text-[#9BE7FA] shrink-0 mt-0.5">
                    <NavIcon className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA] transition-colors">
                      {nav.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {nav.desc}
                    </p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform shrink-0 pt-0.5">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}

