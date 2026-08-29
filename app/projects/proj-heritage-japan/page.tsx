import type { Metadata } from 'next';
import HeritageJapanProject from '@/app/components/HeritageJapanProject';

export const metadata: Metadata = {
  title: 'Du lịch Di sản Nhật Bản: Phân tích Chuỗi Thời Gian | Ma Văn Hùng',
  description: 'Phân tích chuỗi thời gian 20 năm du lịch di sản Nhật Bản: lượng khách quốc tế, chi tiêu, chính sách bảo tồn Kyoto-Nara. JNTO data, time-series modeling.',
  openGraph: {
    title: 'Heritage Tourism in Japan: Time-Series Analysis',
    description: '20-year longitudinal analysis of inbound tourism, spending patterns, and cultural preservation policies across Japan\'s heritage sites.',
    type: 'article',
  },
};

export default function Page() {
  return <HeritageJapanProject />;
}
