'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, Terminal, CheckCircle2 } from 'lucide-react';
import { ProfileData } from '@/app/types';
import { useLanguage } from '@/app/context/LanguageContext';
import { sanitizeUrl } from '@/app/lib/security';

interface AboutSectionProps {
  profile: ProfileData;
  onSelectProject?: (_projId: string) => void;
  onNavigateTab?: (_tabId: string) => void;
}

export default function AboutSection({ profile, onNavigateTab }: AboutSectionProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const safeAvatarUrl = profile.avatarUrl ? sanitizeUrl(profile.avatarUrl) : '';
  const sectionRef = useRef<HTMLElement>(null);

  // Animations are now handled via Tailwind CSS classes
  const defaultGoalsEn = [
    { title: 'Optimize Data Pipelines', desc: 'Design ETL/ELT workflows, manage relational databases, and standardize data from multiple sources for analysis.' },
    { title: 'Build Advanced Dashboards', desc: 'Build BI dashboards on Power BI and Tableau, using segmentation and time-series forecasting.' },
    { title: 'Data Storytelling & Strategy', desc: 'Turn technical findings into clear reports that support business decisions.' },
  ];

  const defaultGoalsVi = [
    { title: 'Tối ưu hóa Data Pipeline', desc: 'Thiết kế quy trình ETL/ELT, quản lý CSDL quan hệ và chuẩn hóa dữ liệu từ nhiều nguồn để phân tích.' },
    { title: 'Xây dựng Dashboard nâng cao', desc: 'Xây dựng dashboard trên Power BI/Tableau, áp dụng phân khúc khách hàng và dự báo chuỗi thời gian.' },
    { title: 'Data Storytelling & Chiến lược', desc: 'Chuyển đổi kết quả phân tích kỹ thuật thành báo cáo dễ hiểu, giúp ban lãnh đạo ra quyết định.' },
  ];

  const goals = (profile.careerGoalsList && profile.careerGoalsList.length > 0)
    ? profile.careerGoalsList.map(g => ({ title: g.title, desc: g.desc }))
    : (isEn ? defaultGoalsEn : defaultGoalsVi);

  const pillars = [
    {
      title: isEn ? 'Empirical Rigor' : 'Nghiêm Ngặt Về Bằng Chứng',
      desc: isEn 
        ? 'Trained in quantitative research at VNU Hanoi. I back every claim with verified data and cross-checked numbers.'
        : 'Được đào tạo về nghiên cứu định lượng tại ĐHQG Hà Nội. Tôi kiểm chứng mọi kết luận bằng dữ liệu thực tế và đối soát từ nhiều nguồn.',
    },
    {
      title: isEn ? 'Business Translation' : 'Cầu Nối Dữ Liệu & Kinh Doanh',
      desc: isEn
        ? 'Connecting the data warehouse to the executive team. I translate SQL queries and statistics into P&L impact.'
        : 'Làm cầu nối giữa bộ phận kỹ thuật và ban điều hành. Tôi chuyển đổi các truy vấn SQL và kết quả thống kê thành những con số tác động trực tiếp đến doanh thu.',
    },
    {
      title: isEn ? 'Production Data Architecture' : 'Kiến Trúc Dữ Liệu Thực Chiến',
      desc: isEn
        ? 'Experienced in designing 3NF schemas, optimizing caches, and handling batch workloads with sub-30ms latency.'
        : 'Có kinh nghiệm thiết kế CSDL chuẩn 3NF, tối ưu cache và xử lý dữ liệu bất đồng bộ với độ trễ dưới 30ms.',
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="section-cinematic bg-ground dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="page-container space-y-16">
        
        {/* Editorial Section Header */}
        {/* taste-skill §4.7 Eyebrow Restraint: No eyebrow — headline alone is enough */}
        <div className="space-y-3 pb-8 border-b border-slate-200/80 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '0ms' }}>
          <h2 className="editorial-section-title text-3xl sm:text-4xl lg:text-5xl max-w-3xl">
            {isEn
              ? 'I analyze data to find the measurable impact on the business.'
              : 'Tôi phân tích dữ liệu để tìm ra các tác động cụ thể đến doanh nghiệp.'}
          </h2>
        </div>

        {/* 60% Editorial Layout: Two-Column Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Profile Card + Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '100ms' }}>
            
            {/* Identity line without heavy card box */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800">
              {safeAvatarUrl && safeAvatarUrl !== '#' ? (
                <div className="w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 relative">
                  <Image 
                    src={safeAvatarUrl} 
                    alt={profile.name || 'Avatar'} 
                    width={64} 
                    height={64} 
                    className="w-full h-full object-cover" 
                    unoptimized={safeAvatarUrl.startsWith('data:') || safeAvatarUrl.startsWith('blob:')}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-lg flex items-center justify-center shrink-0 dark:bg-slate-800">
                  {profile.name ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 3).toUpperCase() : 'MVH'}
                </div>
              )}
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-950 dark:text-white">
                  {profile.name || 'Ma Văn Hùng'}
                </h3>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {profile.title || 'Data Analyst'} • Hanoi, Vietnam
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{isEn ? 'Available for full-time & consulting roles' : 'Sẵn sàng tiếp nhận dự án & cơ hội mới'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-5 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                {profile.bio || (isEn
                  ? 'I am a Data Analyst working with SQL, Python, Power BI, and Excel. I clean fragmented data, build visual models, and turn raw numbers into insights that support business decisions.'
                  : 'Tôi là một Data Analyst làm việc chủ yếu với SQL, Python, Power BI và Excel. Công việc hàng ngày của tôi là xử lý các nguồn dữ liệu thô, xây dựng biểu đồ trực quan và tìm ra các điểm dữ liệu giúp ban lãnh đạo ra quyết định.')}
              </p>
              <p>
                {isEn
                  ? 'My background is in Japanese Studies and quantitative research at VNU Hanoi. This training taught me to combine strict academic methods with practical business needs.'
                  : 'Xuất thân từ ngành Nhật Bản học và nghiên cứu định lượng tại ĐHQG Hà Nội, tôi được rèn luyện cách kết hợp phương pháp nghiên cứu học thuật với bài toán kinh doanh thực tế.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('lab')}
                  className="btn-primary text-xs"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Open Interactive SQL Lab' : 'Mở Phòng Thí Nghiệm SQL'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('cv')}
                  className="btn-secondary-editorial text-xs"
                >
                  <span>{isEn ? 'View Detailed Experience' : 'Xem Kinh Nghiệm Chi Tiết'}</span>
                </button>
              )}
            </div>

            {/* Analytical Strengths & Tooling Grid - Balances layout with right column */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
              <span className="editorial-kicker">
                {isEn ? 'Core Analytical Competencies' : 'Năng lực phân tích & bộ công cụ'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="card-minimal p-3.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                    <span className="font-heading font-bold text-xs text-slate-950 dark:text-white">
                      {isEn ? 'SQL & Data Architecture' : 'SQL & Kiến Trúc Dữ Liệu'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn ? 'PostgreSQL, MySQL, Window Functions, 3NF schema, sub-30ms Redis cache.' : 'PostgreSQL, MySQL, Window Functions, chuẩn 3NF, tối ưu cache Redis <30ms.'}
                  </p>
                </div>

                <div className="card-minimal p-3.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFD14C]" />
                    <span className="font-heading font-bold text-xs text-slate-950 dark:text-white">
                      {isEn ? 'Python & Inferential Stats' : 'Python & Thống Kê Suy Diễn'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn ? 'Pandas, SciPy, Statsmodels, hypothesis testing, 180d time-series decomposition.' : 'Pandas, SciPy, Statsmodels, kiểm định giả thuyết, phân rã chuỗi thời gian 180N.'}
                  </p>
                </div>

                <div className="card-minimal p-3.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0D7287] dark:bg-[#9BE7FA]" />
                    <span className="font-heading font-bold text-xs text-slate-950 dark:text-white">
                      {isEn ? 'BI & Data Storytelling' : 'Power BI & Trực Quan Hóa'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn ? 'Interactive dashboards, DAX modeling, cohort metrics, Recharts visual analytics.' : 'Báo cáo BI đa chiều, mô hình DAX, phân tích Cohort, trực quan hóa Recharts.'}
                  </p>
                </div>

                <div className="card-minimal p-3.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFD14C]" />
                    <span className="font-heading font-bold text-xs text-slate-950 dark:text-white">
                      {isEn ? 'Pipeline Operations' : 'Vận Hành & Data Pipeline'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn ? 'Celery async task queues, 50k+ active users, pessimistic concurrency control.' : 'Hàng đợi tác vụ Celery, phục vụ 50k+ độc giả, kiểm soát xung đột dữ liệu.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Pillars & Career Goals (5 cols) */}
          <div className="lg:col-span-5 bento-telemetry space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
            
            {/* Core Pillars — taste-skill §4.7: varied layout (featured first + compact rest) */}
            <div className="space-y-4">
              <h3 className="text-sm font-heading font-bold text-slate-900 dark:text-white">
                {isEn ? 'Core Working Pillars' : '3 Nguyên tắc cốt lõi'}
              </h3>
              <div className="space-y-3">
                {/* First pillar: featured emphasis with tinted background */}
                {pillars.length > 0 && (
                  <div className="space-y-1.5 border-l-[3px] border-[#9BE7FA] dark:border-[#9BE7FA]/70 pl-4 py-3 bg-[#C8EEF7]/20 dark:bg-[#9BE7FA]/5 rounded-r-lg">
                    <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#074553] dark:text-[#9BE7FA]" />
                      <span>{pillars[0].title}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pillars[0].desc}
                    </p>
                  </div>
                )}
                {/* Remaining pillars: compact */}
                {pillars.slice(1).map((p, idx) => (
                  <div key={idx} className="space-y-1 border-l-2 border-slate-200 dark:border-slate-800 pl-4 py-0.5">
                    <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#074553] dark:text-[#9BE7FA]" />
                      <span>{p.title}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Direction */}
            <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <span className="editorial-kicker">
                {isEn ? 'Career Trajectory' : 'Định hướng phát triển'}
              </span>
              <div className="space-y-4">
                {goals.map((g, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-[#074553] dark:text-[#9BE7FA] mt-0.5 shrink-0">
                      0{idx + 1}.
                    </span>
                    <div>
                      <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-white">
                        {g.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                        {g.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
