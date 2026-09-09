'use client';

import React, { useEffect, useMemo } from 'react';
import { trackVisitorAction } from '@/app/lib/visitorTracking';
import { useLanguage } from '@/app/context/LanguageContext';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { scrollToSection } from '@/app/lib/uiHelpers';
import SectionHeader from '@/components/ui/SectionHeader';
import ReadingRailLayout from '@/components/ui/ReadingRailLayout';
import { libraryBusKPIs } from '@/app/data/libraryBusData';
import { ArrowRight, Database, Server, Zap } from 'lucide-react';

interface LibraryBusProjectProps {
  onBack?: () => void;
  isEmbedded?: boolean;
}

export default function LibraryBusProject({ onBack, isEmbedded }: LibraryBusProjectProps = {}) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const navItems = useMemo(() => [
    { id: 'sec-problem', label: isEn ? '01 The Problem' : '01 Vấn Đề' },
    { id: 'sec-architecture', label: isEn ? '02 Architecture' : '02 Kiến Trúc Dữ Liệu' },
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
    trackVisitorAction('Xem case study: Tủ Sách Lưu Động', 'proj-library-bus', 'project');
  }, []);

  const executiveSummary = (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-white mb-3">Executive Summary</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          {isEn
            ? "Designed and implemented a high-concurrency relational data architecture and asynchronous pipeline to solve real-time inventory synchronization and reservation race conditions across 48 roving bus stops."
            : "Thiết kế kiến trúc cơ sở dữ liệu quan hệ đồng thời cao và luồng xử lý bất đồng bộ để giải quyết vấn đề đồng bộ tồn kho thời gian thực và xung đột đặt sách tại 48 trạm xe lưu động."}
        </p>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
          <li className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>93.7% latency reduction (450ms → 28ms) via Redis caching.</span>
          </li>
          <li className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-500" />
            <span>Successfully scaled to handle 500 concurrent connections.</span>
          </li>
          <li className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <span>Zero data contention (0.0% race conditions) achieved.</span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <ReadingRailLayout
      title={isEn ? 'Library Bus System' : 'Tủ Sách Lưu Động'}
      kicker={isEn ? 'DATABASE ARCHITECTURE & OPTIMIZATION' : 'KIẾN TRÚC DATABASE & TỐI ƯU HÓA'}
      desc={isEn 
        ? 'High-concurrency relational data architecture and asynchronous pipeline serving 50,000 active readers.'
        : 'Kiến trúc cơ sở dữ liệu quan hệ và luồng xử lý bất đồng bộ phục vụ 50,000 độc giả với độ trễ thấp.'}
      sections={navItems}
      activeSection={activeSection}
      onNavClick={handleNavClick}
      onBack={onBack}
      isEmbedded={isEmbedded}
      projectId="proj-library-bus"
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
              ? "The Mobile Library project operates a fleet of library buses traveling across multiple city districts. The core issue was real-time inventory synchronization. When 500 readers attempt to reserve books simultaneously as the bus schedule is announced, the legacy database suffered from severe race conditions, resulting in over-booking and a 450ms query latency."
              : "Dự án Tủ sách lưu động vận hành đội xe buýt thư viện di chuyển qua nhiều quận trong thành phố. Vấn đề cốt lõi là đồng bộ tồn kho thời gian thực. Khi 500 độc giả cố gắng đặt sách cùng lúc khi lịch trình xe buýt được công bố, cơ sở dữ liệu cũ gặp phải tình trạng xung đột dữ liệu nghiêm trọng, dẫn đến việc đặt vượt mức và độ trễ truy vấn lên tới 450ms."}
          </p>
        </div>
      </section>

      {/* 02: Architecture */}
      <section id="sec-architecture" className="space-y-6 scroll-mt-36 mb-16">
        <SectionHeader
          variant="chapter"
          id="sec-architecture"
          chapter="02"
          subtitle={isEn ? 'Data Pipeline' : 'Luồng dữ liệu'}
          badge="02"
          title={isEn ? 'Data & Architecture' : 'Kiến trúc Dữ Liệu'}
          onCopy={() => {}}
        />
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p>
            {isEn
              ? "To resolve these bottlenecks, I redesigned the data pipeline from the ground up, moving away from monolithic synchronous writes."
              : "Để giải quyết những nút thắt này, tôi đã thiết kế lại luồng dữ liệu từ đầu, từ bỏ các thao tác ghi đồng bộ nguyên khối."}
          </p>
          <ul>
            <li><strong>Relational Normalization:</strong> {isEn ? 'Structured the database into 3NF to eliminate anomalies in inventory tracking.' : 'Cấu trúc lại cơ sở dữ liệu về chuẩn 3NF để loại bỏ các bất thường trong theo dõi tồn kho.'}</li>
            <li><strong>Redis Caching Layer:</strong> {isEn ? 'Implemented an in-memory cache to serve heavy read queries (e.g., book availability) instantly, offloading the primary SQL database.' : 'Triển khai lớp cache bộ nhớ để phục vụ các truy vấn đọc nặng (như tính khả dụng của sách) ngay lập tức, giảm tải cho cơ sở dữ liệu SQL chính.'}</li>
            <li><strong>Asynchronous Task Queue:</strong> {isEn ? 'Integrated Celery workers to handle write-heavy operations like reservation requests asynchronously, ensuring smooth UX.' : 'Tích hợp Celery workers để xử lý các thao tác ghi nặng như yêu cầu đặt sách một cách bất đồng bộ, đảm bảo trải nghiệm người dùng mượt mà.'}</li>
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
            <p className="text-3xl font-mono font-black text-slate-900 dark:text-white mb-2">93.7%</p>
            <p className="text-sm font-medium text-slate-500">Latency Reduction</p>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-3xl font-mono font-black text-slate-900 dark:text-white mb-2">0.0%</p>
            <p className="text-sm font-medium text-slate-500">Race Conditions</p>
          </div>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p>
            {isEn
              ? "The new architecture successfully handled the 500 concurrent connections peak without a single inventory mismatch. The query latency dropped from an average of 450ms down to 28ms, fundamentally transforming the user experience."
              : "Kiến trúc mới đã xử lý thành công đỉnh tải 500 kết nối đồng thời mà không có bất kỳ sai lệch tồn kho nào. Độ trễ truy vấn giảm từ trung bình 450ms xuống còn 28ms, thay đổi hoàn toàn trải nghiệm người dùng."}
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
            {['PostgreSQL', 'Redis', 'Python', 'Celery', 'Next.js'].map(tech => (
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
