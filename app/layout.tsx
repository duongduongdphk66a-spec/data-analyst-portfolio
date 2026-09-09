import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from '@/components/ui/Toast';
import { PortfolioDataProvider } from './context/PortfolioDataContext';
import { headers } from 'next/headers';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mavanhung-portfolio.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ma Văn Hùng | Data Analyst',
  description: 'Data Analyst chuyên SQL, Python, Power BI. Phân tích hiệu suất E-Commerce, chuỗi thời gian du lịch di sản, kiến trúc dữ liệu. Portfolio trực quan hóa và case studies tương tác.',
  openGraph: {
    title: 'Ma Văn Hùng | Data Analyst Portfolio',
    description: 'Evidence-driven Data Analyst: SQL, Python, Power BI, Recharts. Interactive case studies and live data visualizations.',
    type: 'website',
    locale: 'vi_VN',
    url: siteUrl,
  },
};

const themeInitScript = `
  (function() {
    try {
      var saved = localStorage.getItem('portfolio_theme');
      var isDark = saved === 'dark' || (!saved || saved === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

const langInitScript = `
  (function() {
    try {
      var savedLang = localStorage.getItem('portfolio_lang');
      if (savedLang) {
        document.documentElement.lang = savedLang;
      }
    } catch (e) {}
  })();
`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ma Văn Hùng',
  jobTitle: 'Data Analyst & Business Intelligence Specialist',
  description: 'Evidence-driven Data Analyst specializing in SQL, Python, Power BI, Recharts, and ETL Data Pipelines.',
  url: siteUrl,
  email: 'mavanhung.da@gmail.com',
  knowsAbout: [
    'SQL', 'PostgreSQL', 'MySQL', 'Python', 'Pandas', 'Power BI', 'DAX',
    'Data Warehousing', 'Time-Series Modeling', 'E-Commerce Analytics',
    'Redis', 'Celery', 'Data Storytelling', 'Recharts'
  ],
  sameAs: [
    'https://github.com/duongduongdphk66a-spec/data-analyst-portfolio'
  ]
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || undefined;

  return (
    <html
      lang="vi"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Lora:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: langInitScript }} />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-ground text-ink font-sans min-h-screen transition-colors duration-200 antialiased selection:bg-brand-yellow-light/80 dark:selection:bg-slate-700">
        <ThemeProvider>
          <PortfolioDataProvider>
            <LanguageProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </LanguageProvider>
          </PortfolioDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
