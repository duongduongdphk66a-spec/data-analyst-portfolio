import type { Metadata } from 'next';

import './globals.css';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from '@/components/ui/Toast';
import { PortfolioDataProvider } from './context/PortfolioDataContext';
import { headers } from 'next/headers';

// JetBrains Mono loaded via preconnect in head for Turbopack compatibility






const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mavanhung-portfolio.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ma Văn Hùng | Fresher Data Analyst / Business Analyst',
  description: 'Fresher Data Analyst / Business Analyst sử dụng SQL, Python, thống kê ứng dụng, đặc tả BI và Technical BA (Mini-BRD, ERD, Tracking Plan).',
  openGraph: {
    title: 'Ma Văn Hùng | Fresher Data Analyst / BA Portfolio',
    description: 'Evidence-driven Fresher Data Analyst & Technical Business Analyst: SQL, Python, Applied Statistics, BI Spec, Mini-BRD & Tracking Plan.',
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
  jobTitle: 'Fresher Data Analyst / Business Analyst',
  description: 'Fresher Data Analyst & Business Analyst specializing in SQL, Python, Applied Statistics, Data Reconciliation, BI Specifications, Mini-BRD, and Tracking Plans.',
  url: siteUrl,
  email: 'mavanhung.da@gmail.com',
  knowsAbout: [
    'SQL', 'PostgreSQL', 'MySQL', 'Python', 'Pandas', 'SciPy', 'Applied Statistics',
    'Data Warehousing', 'Time-Series Modeling', 'E-Commerce Analytics',
    'Business Analysis', 'Data Reconciliation', 'Data Storytelling', 'Recharts'
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
      className="scroll-smooth" /* taste-skill-ignore: code block monospace font */
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
        <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: langInitScript }} />
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-ground text-ink min-h-dvh transition-colors duration-200 antialiased selection:bg-brand-blue-vivid/70 dark:selection:bg-slate-700">
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
