import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Phân Tích & Nghiên Cứu | Mã Văn Hùng',
  description:
    'Nhật ký phân tích dữ liệu chuyên sâu: Quy trình đặt giả thuyết, kiểm toán dữ liệu (Data Audit), đối soát doanh thu (Reconciliation) và đúc kết phát hiện thực nghiệm.',
  openGraph: {
    title: 'Blog Phân Tích & Nghiên Cứu | Mã Văn Hùng',
    description:
      'Nhật ký phân tích dữ liệu chuyên sâu: Quy trình đặt giả thuyết, kiểm toán dữ liệu (Data Audit), đối soát doanh thu (Reconciliation) và đúc kết phát hiện thực nghiệm.',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
