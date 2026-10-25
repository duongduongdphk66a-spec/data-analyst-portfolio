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
    role: 'Data Analyst định hướng giải quyết bài toán kinh doanh',
    headline: 'Biến dữ liệu phức tạp thành tăng trưởng doanh thu & hiệu suất vận hành.',
    summary:
      'Doanh nghiệp cần những quyết định có cơ sở định lượng rõ ràng. Kết hợp tư duy phân tích với công cụ BI hiện đại, tôi giúp các đội ngũ chuyển hóa hàng triệu dòng dữ liệu thô thành hành động chiến lược đo lường được bằng con số thực tế.',
    skillsLabel: 'Công cụ & chuyên môn cốt lõi',
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
      'Xem cách tôi giải quyết từng bài toán thực tế qua các nghiên cứu tình huống dưới đây:',
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
      'Organisations need clear, evidence-backed answers from their data. By combining analytical rigor with modern BI tools, I bridge the gap between complex datasets and measurable business outcomes.',
    skillsLabel: 'Core tech stack & expertise',
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
        detail: 'Uncovering SKU matrices, creator performance, and conversion bottlenecks to drive incremental GMV.',
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
    curiosityTitle: 'How these skills translate into real impact',
    curiositySubtitle:
      'Explore the live case studies and interactive SQL workbenches below:',
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
        desc: 'Technical write-ups on SQL patterns, Python workflows, and business thinking.',
        href: '/blog',
        icon: BookOpen,
      },
    ],
    primaryBtn: 'Explore Live Case Studies',
    secondaryBtn: 'Download CV (PDF)',
  },
};

export default function HeroSection({ profile: propsProfile }: { profile?: any } = {}) {
  const { language } = useLanguage();
  const lang: Lang = language === 'en' ? 'en' : 'vi';
  const { profile: contextProfile } = usePortfolioData();
  const profile = propsProfile || contextProfile;

  const t = CONTENT[lang];

  const resolvedName =
    typeof profile?.name === 'string' && profile.name.trim()
      ? profile.name
      : t.name;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-16 md:space-y-24">
      
      {/* 1. HERO SECTION: Who I Am & Business Outcomes Statement */}
      <section className="relative space-y-6">
        <div className="pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full bg-[#FFE485]/15 dark:bg-[#FFD14C]/5 blur-3xl" />

        <div className="space-y-3">
          <p className="text-sm sm:text-base text-[#074553] dark:text-[#9BE7FA] font-semibold flex flex-wrap items-center gap-1.5">
            <span>{t.greeting}</span>
            <span className="text-slate-900 dark:text-white font-extrabold">{resolvedName}</span>
            <span className="text-slate-400">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFE485]/35 dark:bg-[#FFE485]/15 text-[#854D0E] dark:text-[#FFE485] font-bold text-xs sm:text-sm border border-[#FFD14C]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD14C]" />
              {t.role}
            </span>
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
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
            className="min-h-[44px] px-6 py-3 rounded-xl bg-[#9BE7FA] hover:bg-[#C8EEF7] text-[#074553] font-extrabold text-sm transition-colors flex items-center gap-2 cursor-pointer border border-[#9BE7FA]"
          >
            <span>{t.primaryBtn}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>

          <a
            href="/Ma_Van_Hung_CV_Data_Analyst_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-6 py-3 rounded-xl bg-slate-100 hover:bg-[#FFE485]/20 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 hover:border-[#FFD14C]/50 text-slate-800 dark:text-slate-200 hover:text-amber-900 dark:hover:text-[#FFE485] font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <span>{t.secondaryBtn}</span>
          </a>
        </div>
      </section>

      {/* 2. CORE TECH STACK & BUSINESS OUTCOMES (Horizontal Display) */}
      <section className="rounded-3xl bg-[#F0F9FB] dark:bg-slate-900/70 border border-[#C8EEF7] dark:border-slate-800 p-6 sm:p-10 space-y-8">
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.skillsLabel}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {lang === 'vi'
              ? 'Kết hợp truy vấn SQL chuẩn xác, kiểm định thống kê Python và trực quan hóa BI để giải quyết trọn vẹn bài toán dữ liệu.'
              : 'Combining SQL pipelines, Python statistical testing, and interactive BI to solve end-to-end business questions.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {t.skills.map((skill) => {
            const Icon = skill.icon;
            const isGold = skill.name === 'Power BI' || skill.name === 'Business Intelligence';
            return (
              <div
                key={skill.name}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-colors flex flex-col items-start gap-3 ${
                  isGold
                    ? 'border-[#FFE485]/70 dark:border-slate-800 hover:border-[#FFD14C]'
                    : 'border-[#C8EEF7] dark:border-slate-800 hover:border-[#9BE7FA]'
                }`}
              >
                <span
                  className={`p-2 rounded-xl shrink-0 ${
                    isGold
                      ? 'bg-[#FFE485]/40 dark:bg-[#FFE485]/15 text-[#854D0E] dark:text-[#FFE485] border border-[#FFD14C]/30'
                      : 'bg-[#C8EEF7]/45 dark:bg-[#9BE7FA]/10 text-[#074553] dark:text-[#9BE7FA]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {skill.name}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {skill.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Business Outcomes Editorial Ledger with Butter Gold Accent Cards */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.outcomes.map((item) => (
            <div
              key={item.metric}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-[#FFE485]/70 dark:border-[#FFD14C]/30 space-y-2.5 transition-colors"
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#FFE485]/35 dark:bg-[#FFE485]/15 text-[#854D0E] dark:text-[#FFE485] text-xs font-bold border border-[#FFD14C]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD14C]" />
                <span>{item.metric}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CURIOSITY HOOKS: Case Study Teasers */}
      <section className="space-y-6">
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
            const isCommerce = idx === 0; // Kami Ely commercial project
            return (
              <Link
                key={idx}
                href={teaser.href}
                className={`group p-6 rounded-2xl bg-white dark:bg-slate-900/60 border hover:bg-[#F8FCFD] dark:hover:bg-slate-900 transition-colors flex flex-col justify-between cursor-pointer ${
                  isCommerce
                    ? 'border-[#FFE485]/70 dark:border-slate-800 hover:border-[#FFD14C]'
                    : 'border-[#C8EEF7] dark:border-slate-800 hover:border-[#9BE7FA] dark:hover:border-[#9BE7FA]/60'
                }`}
              >
                <div className="space-y-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${
                      isCommerce
                        ? 'text-[#854D0E] dark:text-[#FFE485] bg-[#FFE485]/35 dark:bg-[#FFE485]/15 border-[#FFD14C]/40'
                        : 'text-[#074553] dark:text-[#9BE7FA] bg-[#C8EEF7]/50 dark:bg-[#9BE7FA]/10 border-[#9BE7FA]/30'
                    }`}
                  >
                    <TeaserIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{teaser.tag}</span>
                  </span>
                  <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-relaxed">
                    “{teaser.question}”
                  </p>
                </div>
                <div
                  className={`pt-6 text-xs font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform ${
                    isCommerce
                      ? 'text-[#854D0E] dark:text-[#FFE485]'
                      : 'text-[#074553] dark:text-[#9BE7FA]'
                  }`}
                >
                  <span>{teaser.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. EXPLORE OTHER PAGES: Editorial Directory */}
      <section className="rounded-3xl bg-[#F8FCFD] dark:bg-slate-900/40 border border-[#C8EEF7] dark:border-slate-800 p-6 sm:p-8 space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          {t.navExploreTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {t.navLinks.map((nav, idx) => {
            const NavIcon = nav.icon;
            const isGoldNav = idx === 1 || idx === 3; // Experience & Blog
            return (
              <Link
                key={nav.href}
                href={nav.href}
                className={`group p-4 rounded-2xl bg-white dark:bg-slate-900/80 border transition-colors flex items-start justify-between gap-4 cursor-pointer ${
                  isGoldNav
                    ? 'border-slate-200/80 dark:border-slate-800 hover:border-[#FFD14C]'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-[#9BE7FA]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isGoldNav
                        ? 'bg-[#FFE485]/35 dark:bg-[#FFE485]/15 text-[#854D0E] dark:text-[#FFE485] border border-[#FFD14C]/30'
                        : 'bg-[#C8EEF7]/40 dark:bg-slate-800 text-[#074553] dark:text-[#9BE7FA]'
                    }`}
                  >
                    <NavIcon className="w-4 h-4" />
                  </span>
                  <div>
                    <h3
                      className={`text-sm font-bold text-slate-900 dark:text-white transition-colors ${
                        isGoldNav
                          ? 'group-hover:text-[#854D0E] dark:group-hover:text-[#FFE485]'
                          : 'group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA]'
                      }`}
                    >
                      {nav.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {nav.desc}
                    </p>
                  </div>
                </div>
                <span
                  className={`transition-transform shrink-0 pt-0.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 ${
                    isGoldNav
                      ? 'text-slate-400 group-hover:text-[#854D0E] dark:group-hover:text-[#FFE485]'
                      : 'text-slate-400 group-hover:text-[#074553] dark:group-hover:text-[#9BE7FA]'
                  }`}
                >
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

