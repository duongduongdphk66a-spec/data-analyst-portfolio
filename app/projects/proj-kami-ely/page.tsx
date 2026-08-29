import type { Metadata } from 'next';
import KamiElyProject from '@/app/components/KamiElyProject';

export const metadata: Metadata = {
  title: 'Kami Ely: TikTok Shop Performance & Affiliate Analytics | Ma Văn Hùng',
  description: 'Phân tích hiệu suất bán hàng TikTok Shop, mạng lưới 1,000+ creator affiliates, và tối ưu chi phí hoa hồng cho ngành Sports & Outdoor. SQL, Python, Power BI.',
  openGraph: {
    title: 'Kami Ely: TikTok Shop Analytics Case Study',
    description: 'Comprehensive analysis of 8.5B VND sales, creator affiliate networks, and livestream channel optimization for e-commerce.',
    type: 'article',
  },
};

export default function Page() {
  return <KamiElyProject />;
}
