import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Data Analyst Portfolio & Executive Dashboard',
  description: 'Trang cá nhân và trung tâm trực quan hóa dữ liệu dành cho Data Analyst, Business Intelligence & Data Science.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body suppressHydrationWarning className="antialiased min-h-screen bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
