import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from './context/LanguageContext';

export const metadata: Metadata = {
  title: 'Data Analyst Portfolio & Executive Dashboard',
  description: 'Data Analyst, Business Intelligence & Data Science Portfolio & Interactive Telemetry Dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased min-h-screen bg-white text-slate-900">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
