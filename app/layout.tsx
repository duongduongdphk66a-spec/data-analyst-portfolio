import type { Metadata } from 'next';
import { Space_Grotesk, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-source-serif',
  display: 'swap',
  weight: ['400', '500', '600'],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`scroll-smooth ${spaceGrotesk.variable} ${sourceSerif.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning className="bg-ground text-ink min-h-screen transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
