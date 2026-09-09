'use client';

import React, { useEffect, useMemo } from 'react';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { useLanguage } from '@/app/context/LanguageContext';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { scrollToSection } from '@/app/lib/uiHelpers';
import SectionHeader from '@/components/ui/SectionHeader';
import ReadingRailLayout from '@/components/ui/ReadingRailLayout';
import { Activity, Database, TrendingUp, Users } from 'lucide-react';

interface KamiElyProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
}

export default function KamiElyProject({ onBack, isEmbedded }: KamiElyProjectProps = {}) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const navItems = useMemo(() => [
    { id: 'sec-problem', label: isEn ? '01 The Problem' : '01 Vấn Đề' },
    { id: 'sec-architecture', label: isEn ? '02 Analytics Method' : '02 Phương Pháp Phân Tích' },
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
    trackVisitorAction('Xem case study: Kami Ely', 'proj-kami-ely', 'project');
  }, []);

  const executiveSummary = (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-white mb-3">Executive Summary</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          {isEn
            ? "Developed an end-to-end e-commerce telemetry and creator performance matrix to optimize commercial synergy between brand LIVE streams and a network of 5,700 affiliates on TikTok Shop."
            : "Phát triển hệ thống phân tích hiệu suất bán hàng thương mại điện tử từ đầu đến cuối và ma trận hiệu suất của nhà sáng tạo nội dung nhằm tối ưu hóa sự phối hợp thương mại giữa các luồng LIVE của thương hiệu và mạng lưới 5.700 affiliates trên TikTok Shop."}
        </p>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
          <li className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>Tracked and optimized 31.6B VND in total GMV over 180 days.</span>
          </li>
          <li className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>Identified that 52.7% of affiliate GMV was driven by nano-creators.</span>
          </li>
          <li className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            <span>Established baseline metrics for LIVE vs Video content ROI.</span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <ReadingRailLayout
      title={isEn ? 'Kami Ely: TikTok Shop Analytics' : 'Kami Ely: Phân Tích TikTok Shop'}
      kicker={isEn ? 'CREATOR & AFFILIATE ANALYTICS' : 'PHÂN TÍCH CREATOR & AFFILIATE'}
      desc={isEn 
        ? 'E-commerce telemetry & creator performance matrix across 338 products and 5,700 affiliates.'
        : 'Hệ thống phân tích hiệu suất bán hàng TikTok Shop và ma trận chuyển đổi 5.700 nhà sáng tạo nội dung.'}
      sections={navItems}
      activeSection={activeSection}
      onNavClick={handleNavClick}
      onBack={onBack}
      isEmbedded={isEmbedded}
      projectId="proj-kami-ely"
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
              ? "Kami Ely operates in a highly competitive Sports & Outdoor segment on TikTok Shop. They possessed vast amounts of transaction and affiliate data but lacked actionable insights. The primary challenge was determining the actual ROI of different content formats (LIVE vs Short Video) and identifying the most cost-effective tier of affiliates to partner with."
              : "Kami Ely hoạt động trong phân khúc Thể thao & Ngoài trời đầy cạnh tranh trên TikTok Shop. Họ sở hữu lượng lớn dữ liệu giao dịch và affiliate nhưng thiếu thông tin chi tiết có thể hành động. Thách thức chính là xác định ROI thực tế của các định dạng nội dung khác nhau (LIVE vs Video ngắn) và xác định phân khúc affiliate tiết kiệm chi phí nhất để hợp tác."}
          </p>
        </div>
      </section>

      {/* 02: Analytics Method */}
      <section id="sec-architecture" className="space-y-6 scroll-mt-36 mb-16">
        <SectionHeader
          variant="chapter"
          id="sec-architecture"
          chapter="02"
          subtitle={isEn ? 'Methodology' : 'Phương pháp'}
          badge="02"
          title={isEn ? 'Analytics Method' : 'Phương Pháp Phân Tích'}
          onCopy={() => {}}
        />
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p>
            {isEn
              ? "I constructed an automated analytics pipeline to extract, transform, and visualize TikTok Shop data:"
              : "Tôi đã xây dựng một luồng phân tích tự động để trích xuất, chuyển đổi và trực quan hóa dữ liệu TikTok Shop:"}
          </p>
          <ul>
            <li><strong>Data Aggregation:</strong> {isEn ? 'Consolidated transaction logs, creator performance metrics, and product catalog data (338 products) using Python.' : 'Tổng hợp nhật ký giao dịch, chỉ số hiệu suất của creator và dữ liệu danh mục sản phẩm (338 sản phẩm) bằng Python.'}</li>
            <li><strong>Outlier Detection:</strong> {isEn ? 'Applied statistical models to clean the dataset, removing mega-influencer anomalies that skewed the average conversion rates.' : 'Áp dụng các mô hình thống kê để làm sạch tập dữ liệu, loại bỏ các điểm dị biệt từ mega-influencer làm sai lệch tỷ lệ chuyển đổi trung bình.'}</li>
            <li><strong>Affiliate Tiering:</strong> {isEn ? 'Categorized 5,700 creators into Nano, Micro, and Macro tiers to evaluate commission efficiency.' : 'Phân loại 5.700 creators thành các cấp độ Nano, Micro và Macro để đánh giá hiệu quả hoa hồng.'}</li>
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
            <p className="text-3xl font-mono font-black text-slate-900 dark:text-white mb-2">52.7%</p>
            <p className="text-sm font-medium text-slate-500">GMV from Nano-Creators</p>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-3xl font-mono font-black text-slate-900 dark:text-white mb-2">31.6B</p>
            <p className="text-sm font-medium text-slate-500">VND Analyzed (180D)</p>
          </div>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p>
            {isEn
              ? "The analysis revealed a counter-intuitive insight: Nano-creators (those with fewer followers) collectively drove 52.7% of the total affiliate GMV at a significantly lower customer acquisition cost compared to Macro-influencers. The brand shifted its strategy to scale its nano-affiliate network, optimizing the commission budget."
              : "Phân tích đã tiết lộ một thông tin chi tiết đáng ngạc nhiên: Nano-creators (những người có ít người theo dõi hơn) đã thúc đẩy tập thể 52.7% tổng GMV affiliate với chi phí thu hút khách hàng thấp hơn đáng kể so với Macro-influencers. Thương hiệu đã chuyển đổi chiến lược để mở rộng mạng lưới nano-affiliate, tối ưu hóa ngân sách hoa hồng."}
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
            {['Python', 'Pandas', 'SQL', 'Power BI', 'TikTok Shop API'].map(tech => (
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
