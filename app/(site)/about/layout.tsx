import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới Thiệu | Mã Văn Hùng — Data Analyst & Quantitative Researcher',
  description:
    'Hồ sơ chuyên môn, phương pháp luận phân tích dữ liệu 3 trụ cột (Collect • Process • Visualise) và đối soát dữ liệu thực nghiệm của Data Analyst Mã Văn Hùng.',
  openGraph: {
    title: 'Giới Thiệu | Mã Văn Hùng — Data Analyst & Quantitative Researcher',
    description:
      'Hồ sơ chuyên môn, phương pháp luận phân tích dữ liệu 3 trụ cột (Collect • Process • Visualise) và đối soát dữ liệu thực nghiệm của Data Analyst Mã Văn Hùng.',
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
