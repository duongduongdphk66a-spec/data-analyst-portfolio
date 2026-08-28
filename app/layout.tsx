import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from './context/LanguageContext';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ma Văn Hùng - Data Analyst Portfolio & Telemetry Hub',
  description: 'Data Analyst & Business Intelligence Portfolio: SQL, Python, Power BI, Advanced Excel, Interactive Telemetry & Case Studies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`scroll-smooth ${jakarta.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased min-h-screen bg-white text-slate-900 font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

