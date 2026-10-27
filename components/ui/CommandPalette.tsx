'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Landmark,
  Bus,
  Home,
  FolderOpen,
  Briefcase,
  User,
  FileText,
  Globe,
  Sun,
  Moon,
  BarChart3,
  Search,
  CornerDownLeft,
} from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';
import { ProjectData } from '@/app/types';

export interface CommandItem {
  id: string;
  category: { vi: string; en: string };
  title: { vi: string; en: string };
  subtitle: { vi: string; en: string };
  keywords: string;
  icon: React.ReactNode;
  action: () => void;
}

export interface CommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
  projects?: ProjectData[];
  onSelectTab?: (_tabId: string) => void;
  onSelectProject?: (_projId: string) => void;
}

export default function CommandPalette({
  isOpen: propIsOpen,
  onClose: propOnClose,
  projects: propProjects,
  onSelectTab,
  onSelectProject,
}: CommandPaletteProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const lang = language === 'en' ? 'en' : 'vi';

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const closePalette = useCallback(() => {
    setInternalIsOpen(false);
    propOnClose?.();
    setQuery('');
    setSelectedIndex(0);
  }, [propOnClose]);

  const navigateSpa = useCallback(
    (href: string) => {
      closePalette();
      if (href.startsWith('/#') && pathname === '/') {
        const targetId = href.replace('/#', '');
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      router.push(href);
    },
    [closePalette, pathname, router]
  );

  const commands: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = [
      {
        id: 'case-kami-ely',
        category: { vi: 'Dự án mũi nhọn (Case studies)', en: 'Featured case studies' },
        title: {
          vi: 'Kami Ely: Phân tích TikTok Shop & mạng lưới Affiliate (15,01 tỷ đ · 231N)',
          en: 'Kami Ely: TikTok Shop & Affiliate Network Analytics (15.01B VND · 231d)',
        },
        subtitle: {
          vi: 'Phân tích 10 bảng FastMoss, hồi quy OLS mùa vụ, Cohort 302 KOC, chỉ số HHI & 9/9 cổng chất lượng',
          en: '10 FastMoss tables, seasonal OLS regression, 302-KOC cohorts, HHI & 9/9 quality gates',
        },
        keywords: 'kami ely tiktok shop ecommerce live video koc affiliate sql ols hhi 231d',
        icon: <ShoppingBag className="w-4 h-4 text-[#9BE7FA]" />,
        action: () => {
          navigateSpa('/projects/proj-kami-ely');
          onSelectProject?.('proj-kami-ely');
        },
      },
      {
        id: 'case-heritage-japan',
        category: { vi: 'Dự án mũi nhọn (Case studies)', en: 'Featured case studies' },
        title: {
          vi: 'Di sản văn hóa & kinh tế du lịch Nhật Bản',
          en: 'Japan Cultural Heritage & Tourism Economics',
        },
        subtitle: {
          vi: 'Kiểm định thống kê, hồi quy không gian & đánh giá chính sách công',
          en: 'Statistical testing, spatial regression & public policy evaluation',
        },
        keywords: 'heritage japan tourism policy statistics thesis',
        icon: <Landmark className="w-4 h-4 text-[#FFD14C]" />,
        action: () => {
          navigateSpa('/projects/proj-heritage-japan');
          onSelectProject?.('proj-heritage-japan');
        },
      },
      {
        id: 'case-library-bus',
        category: { vi: 'Dự án mũi nhọn (Case studies)', en: 'Featured case studies' },
        title: {
          vi: 'Library Bus: Thiết kế UX/UI Website thư viện lưu động',
          en: 'Library Bus: UX/UI Design for a Mobile Library Website',
        },
        subtitle: {
          vi: 'Nghiên cứu UX, sitemap, wireframe và UI design cho 20 màn hình desktop kèm bản mobile',
          en: 'UX research, sitemap, wireframes and UI design for 20 desktop screens plus mobile',
        },
        keywords: 'library bus ux ui design wireframe sitemap responsive',
        icon: <Bus className="w-4 h-4 text-[#9BE7FA]" />,
        action: () => {
          navigateSpa('/projects/proj-library-bus');
          onSelectProject?.('proj-library-bus');
        },
      },
      {
        id: 'nav-home',
        category: { vi: 'Công cụ & điều hướng', en: 'Navigation & tools' },
        title: { vi: 'Trang chủ tổng quan', en: 'Home overview' },
        subtitle: { vi: 'Về đầu trang chủ & tổng hợp hồ sơ Portfolio', en: 'Return to main portfolio page' },
        keywords: 'home dashboard overview main',
        icon: <Home className="w-4 h-4 text-slate-300" />,
        action: () => {
          navigateSpa('/');
          onSelectTab?.('home');
        },
      },
      {
        id: 'nav-projects',
        category: { vi: 'Công cụ & điều hướng', en: 'Navigation & tools' },
        title: { vi: 'Báo cáo phân tích Kami Ely & Phụ lục SQL', en: 'Kami Ely Case Study & SQL Appendix' },
        subtitle: { vi: 'Xem 7 chương phân tích dữ liệu TikTok Shop và thư viện SQL/Python', en: 'View 7-chapter TikTok Shop analytics and SQL/Python library' },
        keywords: 'projects kami ely sql lab case study',
        icon: <FolderOpen className="w-4 h-4 text-slate-300" />,
        action: () => {
          navigateSpa('/projects/proj-kami-ely');
          onSelectProject?.('proj-kami-ely');
        },
      },
      {
        id: 'nav-experience',
        category: { vi: 'Công cụ & điều hướng', en: 'Navigation & tools' },
        title: { vi: 'Kinh nghiệm & hồ sơ năng lực (/experience)', en: 'Experience & Resume (/experience)' },
        subtitle: { vi: 'Quá trình làm việc, kỹ năng SQL/Python/BI & học vấn', en: 'Work history, SQL/Python/BI skills & education' },
        keywords: 'experience cv resume career skills',
        icon: <Briefcase className="w-4 h-4 text-slate-300" />,
        action: () => {
          navigateSpa('/experience');
          onSelectTab?.('experience');
        },
      },
      {
        id: 'nav-about',
        category: { vi: 'Công cụ & điều hướng', en: 'Navigation & tools' },
        title: { vi: 'Giới thiệu & phương pháp luận (/about)', en: 'About & methodology (/about)' },
        subtitle: { vi: 'Hồ sơ năng lực, chuẩn đối soát dữ liệu & phương pháp phân tích', en: 'Core competencies, data reconciliation standards & methodology' },
        keywords: 'about profile skills audit reconciliation sql',
        icon: <User className="w-4 h-4 text-slate-300" />,
        action: () => {
          navigateSpa('/about');
          onSelectTab?.('about');
        },
      },
      {
        id: 'action-download-cv',
        category: { vi: 'Tài liệu & thiết lập', en: 'Documents & preferences' },
        title: {
          vi: 'Tải xuống CV PDF (Mã Văn Hùng - Data Analyst 2026)',
          en: 'Download Resume PDF (Ma Van Hung - Data Analyst 2026)',
        },
        subtitle: {
          vi: 'Mở hoặc tải trực tiếp tệp PDF hồ sơ năng lực chính thức',
          en: 'Open or download official PDF curriculum vitae',
        },
        keywords: 'download cv resume pdf ma van hung',
        icon: <FileText className="w-4 h-4 text-[#FFD14C]" />,
        action: () => {
          closePalette();
          window.open('/Ma_Van_Hung_CV_Data_Analyst_2026.pdf', '_blank', 'noopener,noreferrer');
        },
      },
      {
        id: 'action-toggle-lang',
        category: { vi: 'Tài liệu & thiết lập', en: 'Documents & preferences' },
        title: {
          vi: lang === 'vi' ? 'Chuyển ngôn ngữ: Tiếng Anh (English)' : 'Switch language: Vietnamese (Tiếng Việt)',
          en: lang === 'vi' ? 'Switch language: English' : 'Switch language: Tiếng Việt',
        },
        subtitle: { vi: 'Thay đổi ngôn ngữ hiển thị toàn trang tức thì', en: 'Toggle site-wide display language' },
        keywords: 'language vietnamese english vi en translate',
        icon: <Globe className="w-4 h-4 text-[#9BE7FA]" />,
        action: () => {
          setLanguage(lang === 'vi' ? 'en' : 'vi');
          closePalette();
        },
      },
      {
        id: 'action-toggle-theme',
        category: { vi: 'Tài liệu & thiết lập', en: 'Documents & preferences' },
        title: {
          vi: `Chuyển giao diện: ${(resolvedTheme || theme) === 'dark' ? 'Chế độ sáng (Light)' : 'Chế độ tối (Dark)'}`,
          en: `Switch theme: ${(resolvedTheme || theme) === 'dark' ? 'Light mode' : 'Dark mode'}`,
        },
        subtitle: { vi: 'Tối ưu độ tương phản thị giác theo môi trường', en: 'Toggle dark/light visual theme' },
        keywords: 'theme dark light mode appearance',
        icon:
          (resolvedTheme || theme) === 'dark' ? (
            <Sun className="w-4 h-4 text-[#FFD14C]" />
          ) : (
            <Moon className="w-4 h-4 text-[#9BE7FA]" />
          ),
        action: () => {
          toggleTheme();
          closePalette();
        },
      },
    ];

    if (propProjects && propProjects.length > 0) {
      propProjects.forEach((p) => {
        const bare = p.id.replace(/^proj-/, '');
        if (!items.some((it) => it.id.includes(bare))) {
          items.splice(3, 0, {
            id: `case-${p.id}`,
            category: { vi: 'Dự án bổ sung', en: 'Additional case studies' },
            title: { vi: p.title, en: p.title },
            subtitle: { vi: p.desc, en: p.desc },
            keywords: `${p.title} ${p.tags?.join(' ') || ''}`.toLowerCase(),
            icon: <BarChart3 className="w-4 h-4 text-[#9BE7FA]" />,
            action: () => {
              navigateSpa(`/projects/${p.id}`);
              onSelectProject?.(p.id);
            },
          });
        }
      });
    }

    return items;
  }, [closePalette, lang, navigateSpa, onSelectProject, onSelectTab, propProjects, resolvedTheme, setLanguage, theme, toggleTheme]);

  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (item) =>
        item.title.vi.toLowerCase().includes(q) ||
        item.title.en.toLowerCase().includes(q) ||
        item.subtitle.vi.toLowerCase().includes(q) ||
        item.subtitle.en.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (propIsOpen !== undefined) {
          if (isOpen) closePalette();
          else setInternalIsOpen(true);
        } else {
          setInternalIsOpen((prev) => !prev);
        }
        return;
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredCommands.length > 0 ? (prev + 1) % filteredCommands.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredCommands.length > 0 ? (prev - 1 + filteredCommands.length) % filteredCommands.length : 0
        );
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      }
    };

    const handleCustomOpen = () => {
      setInternalIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [closePalette, filteredCommands, isOpen, propIsOpen, selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'vi' ? 'Bảng điều khiển và tìm kiếm nhanh' : 'Command Palette Search'}
          className="fixed inset-0 z-[90] flex items-start justify-center pt-14 sm:pt-24 px-3 sm:px-4"
        >
          <div onClick={closePalette} className="fixed inset-0 bg-slate-950/85 transition-opacity" />

          <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-700/90 bg-slate-900 shadow-2xl overflow-hidden" /* taste-skill-ignore: modal overlay */>
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800" /* taste-skill-ignore: form input divider */>
              <Search className="w-4 h-4 text-[#9BE7FA] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  lang === 'vi'
                    ? 'Nhập tên dự án (Kami Ely, Japan, Library Bus) hoặc tải CV...'
                    : 'Search projects (Kami Ely, Japan, Library Bus) or download CV...'
                }
                aria-label={lang === 'vi' ? 'Ô nhập từ khóa tìm kiếm' : 'Command search input'}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9BE7FA]/70"
              />
              <button
                type="button"
                onClick={closePalette}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                <kbd>ESC</kbd>
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  {lang === 'vi' ? 'Không tìm thấy kết quả phù hợp.' : 'No matching commands found.'}
                </div>
              ) : (
                filteredCommands.map((cmd, index) => {
                  const isActive = index === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      type="button"
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={cmd.action}
                      className={`w-full text-left p-3 rounded-xl transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                        isActive
                          ? 'bg-[#9BE7FA]/15 border border-[#9BE7FA]/40 text-white'
                          : 'hover:bg-slate-800/70 border border-transparent text-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/70 shrink-0 mt-0.5 flex items-center justify-center">
                          {cmd.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[#9BE7FA]">{cmd.category[lang]}</div>
                          <div className="text-sm font-bold text-white truncate">{cmd.title[lang]}</div>
                          <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{cmd.subtitle[lang]}</div>
                        </div>
                      </div>
                      <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 shrink-0 self-center" />
                    </button>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400" /* taste-skill-ignore: modal footer */>
              <div className="flex items-center gap-3">
                <span><kbd>↑↓</kbd> {lang === 'vi' ? 'Di chuyển' : 'Navigate'}</span>
                <span><kbd>↵</kbd> {lang === 'vi' ? 'Mở trang (SPA)' : 'Open (SPA)'}</span>
                <span><kbd>ESC</kbd> {lang === 'vi' ? 'Đóng' : 'Close'}</span>
              </div>
              <span className="text-emerald-400 font-medium">Next.js App Router • Instant SPA Navigation</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
