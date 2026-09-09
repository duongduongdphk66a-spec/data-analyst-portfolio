'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, Terminal, CheckCircle2 } from 'lucide-react';
import { ProfileData } from '@/app/types';
import { useLanguage } from '@/app/context/LanguageContext';
import { gsap, useGSAP } from '@/app/lib/gsap';
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

  useGSAP(() => {
    gsap.from('.about-content-reveal', {
      autoAlpha: 0,
      y: 12,
      stagger: 0.08,
      duration: 0.45,
      ease: 'power2.out',
    });
  }, { scope: sectionRef });

  const defaultGoalsEn = [
    { title: 'Optimize Data Pipelines', desc: 'Design clean ETL/ELT workflows, master relational databases, and standardize multi-source data for automated analysis.' },
    { title: 'Build Advanced Dashboards', desc: 'Develop real-time BI dashboards on Power BI/Tableau, apply segmentation models and time-series forecasting.' },
    { title: 'Data Storytelling & Strategy', desc: 'Translate complex technical insights into clear data narratives that help leadership make growth decisions.' },
  ];

  const defaultGoalsVi = [
    { title: 'Tối ưu hóa Data Pipeline', desc: 'Thiết kế quy trình ETL/ELT sạch, làm chủ CSDL quan hệ và chuẩn hóa dữ liệu đa nguồn phục vụ phân tích tự động.' },
    { title: 'Xây dựng Dashboard nâng cao', desc: 'Phát triển báo cáo trực quan hóa thời gian thực trên Power BI/Tableau, áp dụng phân khúc và dự báo chuỗi thời gian.' },
    { title: 'Data Storytelling & Chiến lược', desc: 'Truyền tải insight kỹ thuật phức tạp thành câu chuyện dữ liệu rõ ràng, hỗ trợ quản trị ra quyết định tăng trưởng.' },
  ];

  const goals = (profile.careerGoalsList && profile.careerGoalsList.length > 0)
    ? profile.careerGoalsList.map(g => ({ title: g.title, desc: g.desc }))
    : (isEn ? defaultGoalsEn : defaultGoalsVi);

  const pillars = [
    {
      title: isEn ? 'Empirical Rigor' : 'Nghiêm Ngặt Về Bằng Chứng',
      desc: isEn 
        ? 'Rooted in quantitative research methodology from Japanese Studies at VNU Hanoi. Every insight is backed by verified time-series data and cross-checked telemetry.'
        : 'Xuất phát từ phương pháp nghiên cứu định lượng tại ĐHQG Hà Nội. Mọi kết luận đều được kiểm chứng từ chuỗi dữ liệu thực tế và đối soát đa nguồn.',
    },
    {
      title: isEn ? 'Business Translation' : 'Cầu Nối Dữ Liệu & Kinh Doanh',
      desc: isEn
        ? 'Bridging the gap between raw data warehouses and commercial leadership. Translating SQL queries and statistical correlations into actionable P&L impact.'
        : 'Kết nối trực tiếp giữa kho dữ liệu kỹ thuật và ban điều hành. Chuyển hóa các câu lệnh SQL và tương quan thống kê thành tác động doanh thu cụ thể.',
    },
    {
      title: isEn ? 'Production Data Architecture' : 'Kiến Trúc Dữ Liệu Thực Chiến',
      desc: isEn
        ? 'Hands-on experience architecting 3NF normalized schemas, optimizing distributed cache layers, and handling asynchronous batch workloads with sub-30ms latency.'
        : 'Thực chiến thiết kế CSDL chuẩn hóa 3NF, tối ưu bộ đệm phân tán và xử lý pipeline bất đồng bộ đạt tốc độ phản hồi sub-30ms.',
    }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-16 md:py-24 bg-[#FAFDFE] dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-16">
        
        {/* Editorial Section Header */}
        <div className="space-y-3 pb-8 border-b border-slate-200/80 dark:border-slate-800 about-content-reveal">
          <span className="editorial-kicker">
            {isEn ? 'ANALYTICAL PHILOSOPHY & PROFILE' : 'TRIẾT LÝ PHÂN TÍCH & NĂNG LỰC'}
          </span>
          <h2 className="editorial-section-title text-3xl sm:text-4xl lg:text-5xl max-w-3xl">
            {isEn
              ? 'Evidence-driven analyst focused on measurable commercial impact.'
              : 'Phân tích dựa trên bằng chứng, tập trung vào tác động đo lường được.'}
          </h2>
        </div>

        {/* 60% Editorial Layout: Two-Column Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Profile Card + Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-8 about-content-reveal">
            
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

            {/* Editorial Paragraphs */}
            <div className="space-y-5 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                {profile.bio || (isEn
                  ? 'Ma Van Hung is a Data Analyst with a solid foundation in SQL, Python, Power BI, and advanced Excel. Focused on extracting insights from fragmented data, designing visual analytics models, and transforming raw numbers into strategic insights that optimize business decision-making.'
                  : 'Ma Văn Hùng là Data Analyst với tư duy logic và kỹ năng thực chiến vững vàng trên các công cụ SQL, Python, Power BI và Excel nâng cao. Luôn tập trung vào việc chuyển hóa các luồng dữ liệu thô phức tạp thành biểu đồ trực quan, tối ưu hóa chi phí vận hành và cung cấp insight hỗ trợ ban lãnh đạo ra quyết định chính xác.')}
              </p>
              <p>
                {isEn
                  ? 'With a background in Japanese Studies and quantitative research at VNU Hanoi, I bring a unique cross-disciplinary perspective to data analysis, combining rigorous academic methodology with cultural insight and practical business acumen.'
                  : 'Với nền tảng Nhật Bản học và nghiên cứu định lượng tại Đại học Quốc gia Hà Nội, tôi mang đến góc nhìn liên ngành độc đáo cho phân tích dữ liệu, kết hợp phương pháp nghiên cứu nghiêm ngặt với hiểu biết văn hóa và nhạy bén kinh doanh.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('lab')}
                  className="btn-primary-gold text-xs"
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
          </div>

          {/* Right Column: 3 Pillars & Career Goals (5 cols) */}
          <div className="lg:col-span-5 space-y-10 about-content-reveal">
            
            {/* Core Pillars */}
            <div className="space-y-4">
              <span className="editorial-kicker">
                {isEn ? 'CORE WORKING PILLARS' : '3 NGUYÊN TẮC CỐT LÕI'}
              </span>
              <div className="space-y-4">
                {pillars.map((p, idx) => (
                  <div key={idx} className="space-y-1 border-l-2 border-slate-200 dark:border-slate-800 pl-4 py-0.5">
                    <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
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
                {isEn ? 'CAREER TRAJECTORY' : 'ĐỊNH HƯỚNG PHÁT TRIỂN'}
              </span>
              <div className="space-y-4">
                {goals.map((g, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA] mt-0.5 shrink-0">
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
