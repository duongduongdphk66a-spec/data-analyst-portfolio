import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới Thiệu | Ma Văn Hùng | Fresher Data Analyst',
  description:
    'Hồ sơ chuyên môn, ba câu hỏi phân tích trọng tâm và quy trình làm việc dữ liệu (Thu thập, Xử lý, Trực quan hóa) của Ma Văn Hùng.',
  openGraph: {
    title: 'Giới Thiệu | Ma Văn Hùng | Fresher Data Analyst',
    description:
      'Hồ sơ chuyên môn, ba câu hỏi phân tích trọng tâm và quy trình làm việc dữ liệu (Thu thập, Xử lý, Trực quan hóa) của Ma Văn Hùng.',
    type: 'profile',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
