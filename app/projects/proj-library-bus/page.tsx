import type { Metadata } from 'next';
import LibraryBusProject from '@/app/components/LibraryBusProject';

export const metadata: Metadata = {
  title: 'Library Bus System: Database Architecture & Optimization | Ma Văn Hùng',
  description: 'Thiết kế kiến trúc CSDL quan hệ, Redis cache, Celery workers cho hệ thống thư viện lưu động 50,000+ người dùng. Giảm 93.7% latency, 0% xung đột dữ liệu.',
  openGraph: {
    title: 'Library Bus Management System: Data Architecture Case Study',
    description: 'Relational database design with ACID transactions, Redis caching, and async task processing serving 50K+ users with sub-30ms response times.',
    type: 'article',
  },
};

export default function Page() {
  return <LibraryBusProject />;
}
