'use client';

import React, { useEffect, useMemo } from 'react';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { useLanguage } from '@/app/context/LanguageContext';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { scrollToSection } from '@/app/lib/uiHelpers';
import SectionHeader from '@/components/ui/SectionHeader';
import ReadingRailLayout from '@/components/ui/ReadingRailLayout';
import { THESIS_METADATA } from '@/app/data/heritageJapanData';
import { LineChart, Map, Plane, TrendingUp } from 'lucide-react';

interface HeritageJapanProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
}

export default function HeritageJapanProject({ onBack, isEmbedded }: HeritageJapanProjectProps = {}) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const navItems = useMemo(() => [
    { id: 'sec-problem', label: isEn ? '01 The Problem' : '01 Vấn Đề' },
    { id: 'sec-architecture', label: isEn ? '02 Research Method' : '02 Phương Pháp Phân Tích' },
    { id: 'sec-impact', label: isEn ? '03 Impact & Conclusion' : '03 Kết Quả & Kết Luận' },
    { id: 'sec-appendix', label: isEn ? '04 Tech Appendix' : '04 Phụ Lục Kỹ Thuật' },
  ], [isEn]);

  const sectionIds = useMemo(() => navItems.map(item => item.id), [navItems]);
  const { activeSection, setActiveSection } = useScrollSpy(sectionIds, 130);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSection(id);
    scrollToSection(id, 16);
  };

  useEffect(() => {
    trackVisitorAction('Xem case study: Heritage Japan', 'proj-heritage-japan', 'project');
  }, []);

  const executiveSummary = (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-white mb-3">Executive Summary</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          {isEn
            ? "Conducted a comprehensive time-series analysis (2013-2023) of Japan's heritage tourism sector, analyzing inbound growth catalysts, economic impacts, and the emergence of overtourism in cities like Kyoto and Nara."
            : "Thực hiện phân tích chuỗi thời gian toàn diện (2013-2023) về lĩnh vực du lịch di sản của Nhật Bản, phân tích các động lực tăng trưởng lượng khách quốc tế, tác động kinh tế và sự xuất hiện của tình trạng quá tải du lịch ở các thành phố như Kyoto và Nara."}
        </p>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
          <li className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>Modeled a +513% inbound growth trajectory leading up to the 2019 peak.</span>
          </li>
          <li className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>Quantified economic impacts, including a 4.81T JPY tourist spend surge.</span>
          </li>
          <li className="flex items-center gap-2">
            <Map className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>Assessed spatial distribution imbalances across 25 UNESCO World Heritage sites.</span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <ReadingRailLayout
      title={isEn ? THESIS_METADATA.titleEn : THESIS_METADATA.titleVi}
      kicker={isEn ? 'HERITAGE TOURISM & QUANTITATIVE RESEARCH' : 'PHÂN TÍCH ĐỊNH LƯỢNG & DU LỊCH DI SẢN'}
      desc={isEn
        ? 'A comprehensive quantitative research & case study on Japan’s heritage tourism trajectory (2013–2023): examining inbound growth catalysts, the overtourism crisis, and sustainable preservation.'
        : 'Khảo sát thực tiễn toàn diện về lộ trình phát triển du lịch di sản tại Nhật Bản giai đoạn 2013–2023: phân tích động lực bùng nổ du khách quốc tế, khủng hoảng quá tải du lịch, và quản trị di sản bền vững.'}
      sections={navItems}
      activeSection={activeSection}
      onNavClick={handleNavClick}
      onBack={onBack}
      isEmbedded={isEmbedded}
      projectId="proj-heritage-japan"
      executiveSummary={executiveSummary}
    >
      {/* 01: The Problem */}
      <section id="sec-problem" className="space-y-6 scroll-mt-36 mb-16">
        <SectionHeader
          variant="chapter"
          id="sec-problem"
          chapter="01"
          subtitle={isEn ? 'The Challenge' : 'Thách thức'}
          badge="01"
          title={isEn ? 'The Problem' : 'Vấn Đề Đặt Ra'}
          onCopy={() => {}}
        />
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p>
            {isEn
              ? "Japan's 'Tourism Nation' initiative led to an unprecedented boom in international arrivals between 2013 and 2019, deeply concentrating in heritage-rich regions like the Golden Route. The problem required a quantitative assessment to understand whether the economic gains (spending, job creation) outweighed the socioeconomic costs of 'overtourism' (infrastructure strain, cultural erosion)."
              : "Sáng kiến 'Quốc gia Du lịch' của Nhật Bản đã dẫn đến sự bùng nổ chưa từng có về lượng khách quốc tế từ năm 2013 đến 2019, tập trung sâu sắc vào các khu vực giàu di sản như Cung đường Vàng. Vấn đề đòi hỏi một đánh giá định lượng để hiểu liệu lợi ích kinh tế (chi tiêu, tạo việc làm) có vượt qua chi phí kinh tế xã hội của 'quá tải du lịch' (áp lực cơ sở hạ tầng, xói mòn văn hóa) hay không."}
          </p>
        </div>
      </section>

      {/* 02: Research Method */}
      <section id="sec-architecture" className="space-y-6 scroll-mt-36 mb-16">
        <SectionHeader
          variant="chapter"
          id="sec-architecture"
          chapter="02"
          subtitle={isEn ? 'Methodology' : 'Phương pháp'}
          badge="02"
          title={isEn ? 'Research Method' : 'Phương Pháp Nghiên Cứu'}
          onCopy={() => {}}
        />
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p>
            {isEn
              ? "The research utilized econometric time-series analysis to model tourism flows and their spatial distribution:"
              : "Nghiên cứu sử dụng phân tích chuỗi thời gian kinh tế lượng để mô hình hóa các luồng du lịch và phân bố không gian của chúng:"}
          </p>
          <ul>
            <li><strong>Data Collection:</strong> {isEn ? 'Extracted 10 years of aggregated datasets from JNTO, MLIT, and the Japan Tourism Agency.' : 'Trích xuất 10 năm bộ dữ liệu tổng hợp từ JNTO, MLIT và Cơ quan Du lịch Nhật Bản.'}</li>
            <li><strong>Time-Series Modeling:</strong> {isEn ? 'Applied trend analysis to visualize the dramatic +513% spike in inbound volume culminating in 31.9M visitors in 2019.' : 'Áp dụng phân tích xu hướng để hình dung sự tăng vọt +513% về lượng khách quốc tế, đạt đỉnh 31.9 triệu du khách vào năm 2019.'}</li>
            <li><strong>Spatial Economics:</strong> {isEn ? 'Evaluated the Gini coefficient of tourism distribution, proving that over 60% of tourists concentrated in just 3 major prefectures, driving acute localized overtourism.' : 'Đánh giá hệ số Gini về phân bố du lịch, chứng minh rằng hơn 60% du khách tập trung chỉ ở 3 tỉnh lớn, gây ra tình trạng quá tải du lịch cục bộ nghiêm trọng.'}</li>
          </ul>
        </div>
      </section>

      {/* 03: Impact & Conclusion */}
      <section id="sec-impact" className="space-y-6 scroll-mt-36 mb-16">
        <SectionHeader
          variant="chapter"
          id="sec-impact"
          chapter="03"
          subtitle={isEn ? 'Results' : 'Kết quả'}
          badge="03"
          title={isEn ? 'Impact & Conclusion' : 'Kết Quả & Kết Luận'}
          onCopy={() => {}}
        />
        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-3xl font-mono font-black text-slate-900 dark:text-white mb-2">4.81T</p>
            <p className="text-sm font-medium text-slate-500">JPY Peak Spend (2019)</p>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-3xl font-mono font-black text-slate-900 dark:text-white mb-2">31.9M</p>
            <p className="text-sm font-medium text-slate-500">Peak Visitors</p>
          </div>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p>
            {isEn
              ? "The analysis proved that while the macro-economic benefits were substantial (4.81 trillion JPY in spend), the spatial concentration created severe diseconomies of scale for heritage cities. The resulting policy recommendation emphasized geographic dispersion (routing tourists to rural areas) and shifting KPIs from pure volume to spend-per-visitor to ensure sustainable heritage preservation."
              : "Phân tích đã chứng minh rằng mặc dù lợi ích kinh tế vĩ mô là đáng kể (chi tiêu 4.81 nghìn tỷ Yên), sự tập trung không gian đã tạo ra những tác động tiêu cực nghiêm trọng cho các thành phố di sản. Khuyến nghị chính sách được đưa ra nhấn mạnh sự phân tán địa lý (điều hướng du khách đến các khu vực nông thôn) và chuyển dịch KPI từ khối lượng thuần túy sang chi tiêu trên mỗi du khách để đảm bảo bảo tồn di sản bền vững."}
          </p>
        </div>
      </section>

      {/* 04: Tech Appendix */}
      <section id="sec-appendix" className="space-y-6 scroll-mt-36 mb-16">
        <SectionHeader
          variant="chapter"
          id="sec-appendix"
          chapter="04"
          subtitle={isEn ? 'Stack' : 'Công nghệ'}
          badge="04"
          title={isEn ? 'Tech Appendix' : 'Phụ Lục Kỹ Thuật'}
          onCopy={() => {}}
        />
        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
          <h4 className="text-sm font-mono text-slate-400 mb-4">Core Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {['Python', 'Jupyter', 'Pandas', 'Matplotlib', 'Statistical Analysis'].map(tech => (
              <span key={tech} className="px-3 py-1 rounded bg-slate-800 text-slate-200 text-xs font-mono font-semibold">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    </ReadingRailLayout>
  );
}
