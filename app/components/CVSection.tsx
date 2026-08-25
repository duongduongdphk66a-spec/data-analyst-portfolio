'use client';

import React from 'react';
import Image from 'next/image';
import { ExperienceItem } from '../types';

interface CVSectionProps {
  experiences: ExperienceItem[];
  name: string;
  title: string;
}

export default React.memo(function CVSection({ experiences }: CVSectionProps) {
  const workList = experiences.filter(e => e.type === 'work');
  const educationList = experiences.filter(e => e.type === 'education');

  // Fallback defaults if list is empty
  const defaultEducation = [
    {
      id: 'default-edu',
      role: 'Chuyên ngành Quản trị thông tin',
      company: 'Đại học Quốc gia Hà Nội (VNU)',
      description: ['Tập trung vào quản lý, phân tích và tối ưu hóa hệ thống thông tin dữ liệu.']
    }
  ];

  const defaultWork = [
    {
      id: 'default-work-1',
      role: 'Nghiên cứu Khoa học Sinh viên: Phân tích Du lịch Di sản tại Nhật Bản.',
      description: ['Sử dụng các phương pháp phân tích dữ liệu để đánh giá xu hướng và tiềm năng phát triển du lịch bền vững tại các khu di sản Nhật Bản.']
    },
    {
      id: 'default-work-2',
      role: 'Steve x Kami Company - Hỗ trợ Vận hành Nền tảng Thương mại điện tử.',
      description: ['Quản lý quy trình vận hành, theo dõi đơn hàng và phân tích dữ liệu kinh doanh trên các nền tảng thương mại điện tử.']
    }
  ];

  const educationsToDisplay = educationList.length > 0 ? educationList : defaultEducation;
  const worksToDisplay = workList.length > 0 ? workList : defaultWork;

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 sm:px-10 lg:px-12 space-y-8 animate-in fade-in duration-400 bg-white">
      
      {/* TOP CARD: HỌC VẤN (EDUCATION) */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-md shadow-slate-100/70 relative overflow-hidden">
        {/* Title with yellow underline bar */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#155A8A] tracking-wide uppercase">
            HỌC VẤN
          </h2>
          <div className="w-12 h-1 bg-[#FFD147] rounded-full mt-2 mb-6" />
        </div>

        {/* Education items */}
        <div className="space-y-6">
          {educationsToDisplay.map((item, idx) => (
            <div key={item.id || idx} className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#155A8A] leading-snug">
                {item.role}
              </h3>
              {item.company && (
                <h4 className="text-lg sm:text-xl font-extrabold text-[#155A8A] leading-snug">
                  {item.company}
                </h4>
              )}
              {item.description && item.description.length > 0 && (
                <div className="pt-1">
                  {item.description.map((desc, dIdx) => (
                    <p key={dIdx} className="text-sm sm:text-base text-slate-700 font-normal leading-relaxed">
                      {desc}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CARD: KINH NGHIỆM (EXPERIENCE) */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-md shadow-slate-100/70 relative overflow-hidden">
        
        {/* Subtle decorative curved rings from reference image */}
        <div className="absolute top-0 right-0 w-44 sm:w-56 h-auto pointer-events-none opacity-80 select-none">
          <Image 
            src="/extracted/decor_rings.png" 
            alt="Decorative Rings" 
            width={220} 
            height={140} 
            className="object-contain"
            unoptimized
          />
        </div>

        {/* Title with yellow underline bar */}
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#155A8A] tracking-wide uppercase">
            KINH NGHIỆM
          </h2>
          <div className="w-12 h-1 bg-[#FFD147] rounded-full mt-2 mb-6" />
        </div>

        {/* Experience items */}
        <div className="space-y-6 relative z-10">
          {worksToDisplay.map((item, idx) => {
            // Determine display title with clean numbering
            const hasLeadingNumber = /^\d+\./.test(item.role.trim());
            const displayTitle = hasLeadingNumber ? item.role : `${idx + 1}. ${item.role}`;

            return (
              <div key={item.id || idx} className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#155A8A] leading-snug">
                  {displayTitle}
                </h3>
                {item.description && item.description.length > 0 && (
                  <div className="space-y-1.5 pl-4 sm:pl-5">
                    {item.description.map((desc, dIdx) => (
                      <p key={dIdx} className="text-sm sm:text-base text-slate-700 font-normal leading-relaxed flex items-start gap-2">
                        <span className="text-slate-900 text-base leading-none mt-1">•</span>
                        <span>{desc}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
});
