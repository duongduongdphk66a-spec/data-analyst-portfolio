import type { Metadata } from 'next';
import { Lora, Merriweather, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

const lora = Lora({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const merriweather = Merriweather({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-merriweather',
  display: 'swap',
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Ma Văn Hùng | Data Analyst',
  description: 'Data Analyst chuyên SQL, Python, Power BI. Phân tích hiệu suất E-Commerce, chuỗi thời gian du lịch di sản, kiến trúc dữ liệu. Portfolio trực quan hóa và case studies tương tác.',
  openGraph: {
    title: 'Ma Văn Hùng | Data Analyst Portfolio',
    description: 'Evidence-driven Data Analyst: SQL, Python, Power BI, Recharts. Interactive case studies and live data visualizations.',
    type: 'website',
    locale: 'vi_VN',
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

import { ToastProvider } from './components/ui/Toast';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ma Văn Hùng',
  jobTitle: 'Data Analyst & Business Intelligence Specialist',
  description: 'Evidence-driven Data Analyst specializing in SQL, Python, Power BI, Recharts, and ETL Data Pipelines.',
  url: 'https://mavanhung-portfolio.vercel.app',
  email: 'mavanhung.da@gmail.com',
  knowsAbout: [
    'SQL', 'PostgreSQL', 'MySQL', 'Python', 'Pandas', 'Power BI', 'DAX',
    'Data Warehousing', 'Time-Series Modeling', 'E-Commerce Analytics',
    'Redis', 'Celery', 'Data Storytelling', 'Recharts'
  ],
  sameAs: [
    'https://github.com',
    'https://linkedin.com'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`scroll-smooth ${lora.variable} ${merriweather.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-ground text-ink min-h-screen transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
