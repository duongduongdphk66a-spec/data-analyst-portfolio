'use client';

import React from 'react';
import { 
  GraduationCap, Briefcase, Calendar, MapPin, 
  Download, FileText, CheckCircle2, Sparkles, ArrowUpRight 
} from 'lucide-react';
import { ExperienceItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { trackVisitorAction } from '../lib/visitorTracking';

interface CVSectionProps {
  experiences: ExperienceItem[];
  name?: string;
  title?: string;
}

export default React.memo(function CVSection({ experiences, name, title }: CVSectionProps) {
  const { language, t } = useLanguage();

  const workList = experiences.filter(e => e.type === 'work');
  const educationList = experiences.filter(e => e.type === 'education');

  const defaultEducationEn: ExperienceItem[] = [
    {
      id: 'default-edu-en',
      role: 'Bachelor in Japanese Studies (Faculty of Oriental Studies)',
      company: 'University of Social Sciences and Humanities - VNU Hanoi',
      period: '2021 - 2025',
      type: 'education',
      location: 'Hanoi, Vietnam',
      description: [
        'Specialized in Japanese socio-economic development, quantitative research methodology, and empirical data analysis.',
        'Authored research thesis: "The Evolution of Heritage Tourism in Japan from 2013 to Present" (Supervised by Dr. Vo Minh Vu).'
      ]
    }
  ];

  const defaultWorkEn: ExperienceItem[] = [
    {
      id: 'default-work-1-en',
      role: 'Academic Research Project: Heritage Tourism Data Analytics in Japan',
      company: 'University of Social Sciences and Humanities - VNU Hanoi',
      period: '2023 - 2024',
      type: 'work',
      location: 'Hanoi, Vietnam',
      description: [
        'Extracted, cleaned, and standardized 6 time-series datasets spanning 20 years from MLIT, JNTO, Kyoto Tourism Board, and Nara Prefecture.',
        'Synthesized macroeconomic indicators (7.5% GDP, 4M+ jobs) and modeled overtourism counter-measures across 5 UNESCO world heritage sites.'
      ]
    },
    {
      id: 'default-work-2-en',
      role: 'Steve x Kami Company: E-Commerce Operations & Performance Analytics',
      company: 'Steve x Kami Company',
      period: '2022 - 2023',
      type: 'work',
      location: 'Hanoi, Vietnam',
      description: [
        'Built automated sales tracking dashboards monitoring GMV, return rates, and live shopping conversion rates on TikTok Shop.',
        'Analyzed affiliate network contribution across 1,000+ creator tiers to optimize commission budget allocation and ROI.'
      ]
    }
  ];

  const defaultEducationVi: ExperienceItem[] = [
    {
      id: 'default-edu',
      role: 'Cử nhân Ngành Nhật Bản học (Khoa Đông Phương học)',
      company: 'Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQGHN',
      period: '2021 - 2025',
      type: 'education',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Chuyên sâu nghiên cứu kinh tế - xã hội Nhật Bản, phương pháp phân tích định lượng và xử lý dữ liệu nghiên cứu khoa học.',
        'Hoàn thành xuất sắc Niên luận Nghiên cứu định lượng: "Sự phát triển của Du lịch Di sản tại Nhật Bản giai đoạn từ năm 2013 đến nay" (GVHD: TS Võ Minh Vũ).'
      ]
    }
  ];

  const defaultWorkVi: ExperienceItem[] = [
    {
      id: 'default-work-1',
      role: 'Công trình Nghiên cứu Khoa học: Phân tích Du lịch Di sản tại Nhật Bản',
      company: 'Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQGHN',
      period: '2023 - 2024',
      type: 'work',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Thu thập, trích xuất và chuẩn hóa 6 bộ dữ liệu chuỗi thời gian 20 năm từ MLIT, JNTO, Sở Du lịch Kyoto và Nara.',
        'Ứng dụng các mô hình trực quan hóa số liệu định lượng, phân tích tỷ trọng đóng góp GDP (7.5%), việc làm (4M+) và đánh giá 5 chính sách giải quyết quá tải du lịch.'
      ]
    },
    {
      id: 'default-work-2',
      role: 'Steve x Kami Company: Hỗ trợ Vận hành & Phân tích Dữ liệu E-Commerce',
      company: 'Steve x Kami Company',
      period: '2022 - 2023',
      type: 'work',
      location: 'Hà Nội, Việt Nam',
      description: [
        'Xây dựng các báo cáo định kỳ theo dõi GMV, tỷ lệ chuyển đổi đơn hàng và chỉ số hoàn hàng trên sàn TikTok Shop.',
        'Phân tích ma trận hiệu quả giữa kênh tự vận hành và mạng lưới 1,000+ creator affiliates nhằm tối ưu hóa chi phí hoa hồng.'
      ]
    }
  ];

  const educationsToDisplay = language === 'en'
    ? defaultEducationEn
    : (educationList.length > 0 ? educationList : defaultEducationVi);

  const worksToDisplay = language === 'en'
    ? defaultWorkEn
    : (workList.length > 0 ? workList : defaultWorkVi);

  const handleDownloadCV = () => {
    trackVisitorAction('Bấm tải CV PDF', 'Ma_Van_Hung_Data_Analyst_CV.pdf', 'download');
    window.open('/website.pdf', '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-8 lg:px-10 space-y-10 animate-in fade-in duration-400">
      
      {/* Header with quick download CV CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/90 dark:border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8EEF7]/50 text-slate-900 rounded-md text-xs font-bold font-mono tracking-wide border border-[#9BE7FA] dark:bg-slate-800 dark:border-slate-700 dark:text-[#9BE7FA]">
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'ACADEMIC & PROFESSIONAL TIMELINE' : 'HỌC VẤN & KINH NGHIỆM THỰC CHIẾN'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight dark:text-white">
            {language === 'en' ? 'Education & Experience' : 'Lộ Trình Học Vấn & Kinh Nghiệm'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {language === 'en' 
              ? 'Structured timeline of academic background in Information Management and hands-on data analytics experience.'
              : 'Tổng hợp quá trình đào tạo chính quy về Quản trị Thông tin và các dự án phân tích dữ liệu thực tế.'}
          </p>
        </div>

        <button
          onClick={handleDownloadCV}
          className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm shadow-xs transition-all duration-200 cursor-pointer inline-flex items-center gap-2 self-start sm:self-auto active:scale-95 dark:bg-[#9BE7FA] dark:text-slate-950 dark:hover:bg-[#C8EEF7]"
        >
          <Download className="w-4 h-4" />
          <span>{t('cv_download_btn', 'Tải CV PDF')}</span>
        </button>
      </div>

      {/* SECTION 1: HỌC VẤN (EDUCATION) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFE485] text-slate-950 flex items-center justify-center dark:bg-[#FFD14C]">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight dark:text-white">
            {t('cv_education_title', 'HỌC VẤN')}
          </h2>
        </div>

        <div className="space-y-4">
          {educationsToDisplay.map((item, idx) => (
            <div 
              key={item.id || idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-[#9BE7FA] transition-all space-y-3 dark:bg-slate-900/80 dark:border-slate-800"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">
                    {item.role}
                  </h3>
                  <p className="text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                    {item.company}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 font-mono text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {item.period}
                  </span>
                </div>
              </div>

              {item.description && item.description.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {item.description.map((desc, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed dark:text-slate-300">
                      <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold mt-0.5">•</span>
                      <span>{desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: KINH NGHIỆM THỰC TẾ (EXPERIENCE) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#C8EEF7] text-slate-950 flex items-center justify-center dark:bg-slate-800 dark:text-[#9BE7FA]">
            <Briefcase className="w-4 h-4" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight dark:text-white">
            {t('cv_experience_title', 'KINH NGHIỆM THỰC TẾ')}
          </h2>
        </div>

        <div className="space-y-4">
          {worksToDisplay.map((item, idx) => (
            <div 
              key={item.id || idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-[#9BE7FA] transition-all space-y-3 dark:bg-slate-900/80 dark:border-slate-800"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">
                    {item.role}
                  </h3>
                  <p className="text-sm font-bold text-[#0D7287] dark:text-[#9BE7FA]">
                    {item.company}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 font-mono text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {item.period}
                  </span>
                </div>
              </div>

              {item.description && item.description.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {item.description.map((desc, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed dark:text-slate-300">
                      <span className="text-[#FFD14C] font-bold mt-0.5">•</span>
                      <span>{desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
});
