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

  const commands: CommandItem[] = useMemo(
    () => {
      const items: CommandItem[] = [
        {
          id: 'case-kami-ely',
          category: { vi: 'Dự Án Mũi Nhọn (Case Studies)', en: 'Featured Case Studies' },
          title: {
            vi: 'TikTok Shop Kami Ely (@kamielyhn): 12,74 Tỉ VNĐ (180d)',
            en: 'TikTok Shop Kami Ely (@kamielyhn): 12.74B VND (180d)'
          },
          subtitle: {
            vi: 'Phân tích 8 bảng dữ liệu (18.778 dòng), Phễu LIVE, Kệ hàng 1,17M views & What-If ROI',
            en: '8 datasets (18,778 rows), LIVE Funnel, 1.17M Card views & What-If ROI Simulator'
          },
          keywords: 'kami ely tiktok shop ecommerce live video koc affiliate sql 180d 90d',
          icon: <ShoppingBag className="w-4 h-4 text-[#9BE7FA]" />,
          action: () => {
            navigateSpa('/projects/proj-kami-ely');
            onSelectProject?.('proj-kami-ely');
          }
        },
        {
          id: 'case-heritage-japan',
          category: { vi: 'Dự Án Mũi Nhọn (Case Studies)', en: 'Featured Case Studies' },
          title: {
            vi: 'Di Sản Văn Hóa & Kinh Tế Du Lịch Nhật Bản',
            en: 'Japan Cultural Heritage & Tourism Economics'
          },
          subtitle: {
            vi: 'Kiểm định thống kê, Hồi quy không gian & Đánh giá chính sách công',
            en: 'Statistical testing, Spatial regression & Public policy evaluation'
          },
          keywords: 'heritage japan tourism policy statistics thesis',
          icon: <Landmark className="w-4 h-4 text-[#FFD14C]" />,
          action: () => {
            navigateSpa('/projects/proj-heritage-japan');
            onSelectProject?.('proj-heritage-japan');
          }
        },
        {
          id: 'case-library-bus',
          category: { vi: 'Dự Án Mũi Nhọn (Case Studies)', en: 'Featured Case Studies' },
          title: {
            vi: 'Library Bus: Thiết kế UX/UI Website Thư Viện Lưu Động',
            en: 'Library Bus: UX/UI Design for a Mobile Library Website'
          },
          subtitle: {
            vi: 'Nghiên cứu UX, sitemap, wireframe và UI design cho 20 màn hình desktop kèm bản mobile',
            en: 'UX research, sitemap, wireframes and UI design for 20 desktop screens plus mobile'
          },
          keywords: 'library bus ux ui design wireframe sitemap responsive',
          icon: <Bus className="w-4 h-4 text-[#9BE7FA]" />,
          action: () => {
            navigateSpa('/projects/proj-library-bus');
            onSelectProject?.('proj-library-bus');
          }
        },
        {
          id: 'nav-home',
          category: { vi: 'Công Cụ & Điều Hướng', en: 'Navigation & Tools' },
          title: { vi: 'Trang Chủ Tổng Quan (Dashboard)', en: 'Home Overview Dashboard' },
          subtitle: { vi: 'Về đầu trang chủ & Tổng hợp chỉ số Portfolio', en: 'Return to main portfolio dashboard' },
          keywords: 'home dashboard overview main',
          icon: <Home className="w-4 h-4 text-slate-300" />,
          action: () => {
            navigateSpa('/');
            onSelectTab?.('home');
          }
        },
        {
          id: 'nav-projects',
          category: { vi: 'Công Cụ & Điều Hướng', en: 'Navigation & Tools' },
          title: { vi: 'Danh Mục Tất Cả Dự Án (/projects)', en: 'All Projects Directory (/projects)' },
          subtitle: { vi: 'Xem toàn bộ các dự án Phân tích Dữ liệu & BI', en: 'Browse all Data Analytics & BI projects' },
          keywords: 'projects portfolio list case studies',
          icon: <FolderOpen className="w-4 h-4 text-slate-300" />,
          action: () => {
            navigateSpa('/projects');
            onSelectTab?.('projects');
          }
        },
        {
          id: 'nav-experience',
          category: { vi: 'Công Cụ & Điều Hướng', en: 'Navigation & Tools' },
          title: { vi: 'Kinh Nghiệm & Hồ Sơ Năng Lực (/experience)', en: 'Experience & Resume (/experience)' },
          subtitle: { vi: 'Quá trình làm việc, Kỹ năng SQL/Python/BI & Học vấn', en: 'Work history, SQL/Python/BI skills & Education' },
          keywords: 'experience cv resume career skills',
          icon: <Briefcase className="w-4 h-4 text-slate-300" />,
          action: () => {
            navigateSpa('/experience');
            onSelectTab?.('experience');
          }
        },
        {
          id: 'nav-about',
          category: { vi: 'Công Cụ & Điều Hướng', en: 'Navigation & Tools' },
          title: { vi: 'Giới Thiệu & Kiểm Toán SQL (/about)', en: 'About & SQL Reconciliation Audit (/about)' },
          subtitle: { vi: 'Hồ sơ năng lực, bằng chứng kiểm toán số liệu & phương pháp luận', en: 'Core competencies, telemetry audit proof & methodology' },
          keywords: 'about profile skills audit reconciliation sql',
          icon: <User className="w-4 h-4 text-slate-300" />,
          action: () => {
            navigateSpa('/about');
            onSelectTab?.('about');
          }
        },
        {
          id: 'action-download-cv',
          category: { vi: 'Tài Liệu & Thiết Lập', en: 'Documents & Preferences' },
          title: {
            vi: 'Tải Xuống CV PDF (Mã Văn Hùng - Data Analyst 2026)',
            en: 'Download Resume PDF (Ma Van Hung - Data Analyst 2026)'
          },
          subtitle: {
            vi: 'Mở hoặc tải trực tiếp tệp PDF hồ sơ năng lực chính thức',
            en: 'Open or download official PDF curriculum vitae'
          },
          keywords: 'download cv resume pdf ma van hung',
          icon: <FileText className="w-4 h-4 text-[#FFD14C]" />,
          action: () => {
            closePalette();
            window.open('/Ma_Van_Hung_CV_Data_Analyst_2026.pdf', '_blank', 'noopener,noreferrer');
          }
        },
        {
          id: 'action-toggle-lang',
          category: { vi: 'Tài Liệu & Thiết Lập', en: 'Documents & Preferences' },
          title: {
            vi: lang === 'vi' ? 'Chuyển Ngôn Ngữ: Tiếng Anh (English)' : 'Switch Language: Vietnamese (Tiếng Việt)',
            en: lang === 'vi' ? 'Switch Language: English' : 'Switch Language: Tiếng Việt'
          },
          subtitle: { vi: 'Thay đổi ngôn ngữ hiển thị toàn trang tức thì', en: 'Toggle site-wide display language' },
          keywords: 'language vietnamese english vi en translate',
          icon: <Globe className="w-4 h-4 text-[#9BE7FA]" />,
          action: () => {
            setLanguage(lang === 'vi' ? 'en' : 'vi');
            closePalette();
          }
        },
        {
          id: 'action-toggle-theme',
          category: { vi: 'Tài Liệu & Thiết Lập', en: 'Documents & Preferences' },
          title: {
            vi: `Chuyển Giao Diện: ${(resolvedTheme || theme) === 'dark' ? 'Chế Độ Sáng (Light)' : 'Chế Độ Tối (Dark)'}`,
            en: `Switch Theme: ${(resolvedTheme || theme) === 'dark' ? 'Light Mode' : 'Dark Mode'}`
          },
          subtitle: { vi: 'Tối ưu độ tương phản thị giác theo môi trường', en: 'Toggle dark/light visual theme' },
          keywords: 'theme dark light mode appearance',
          icon: (resolvedTheme || theme) === 'dark' ? (
            <Sun className="w-4 h-4 text-[#FFD14C]" />
          ) : (
            <Moon className="w-4 h-4 text-[#9BE7FA]" />
          ),
          action: () => {
            toggleTheme();
            closePalette();
          }
        }
      ];

      // Thêm các dự án mở rộng nếu có propProjects truyền vào
      if (propProjects && propProjects.length > 0) {
        propProjects.forEach((p) => {
          if (!items.some((it) => it.id.includes(p.id))) {
            items.splice(3, 0, {
              id: `case-${p.id}`,
              category: { vi: 'Dự Án Bổ Sung', en: 'Additional Case Studies' },
              title: { vi: p.title, en: p.title },
              subtitle: { vi: p.desc, en: p.desc },
              keywords: `${p.title} ${p.tags?.join(' ') || ''}`.toLowerCase(),
              icon: <BarChart3 className="w-4 h-4 text-[#9BE7FA]" />,
              action: () => {
                navigateSpa(`/projects/${p.id}`);
                onSelectProject?.(p.id);
              }
            });
          }
        });
      }

      return items;
    },
    [closePalette, lang, navigateSpa, onSelectProject, onSelectTab, propProjects, resolvedTheme, setLanguage, theme, toggleTheme]
  );

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
      {/* NÚT MỞ NHANH COMMAND PALETTE & TẢI CV TRÊN MOBILE (390px) */}
      <button
        type="button"
        onClick={() => setInternalIsOpen(true)}
        aria-label={lang === 'vi' ? 'Mở bảng tìm kiếm nhanh (Ctrl+K)' : 'Open quick command search (Ctrl+K)'}
        className="lg:hidden fixed bottom-20 right-4 z-40 min-h-[44px] px-3.5 py-2 rounded-full bg-slate-900/95 hover:bg-slate-800 text-[#9BE7FA] border border-[#9BE7FA]/40 shadow-xl backdrop-blur-md flex items-center gap-1.5 text-xs font-bold cursor-pointer" /* taste-skill-ignore: floating button */
      >
        <Search className="w-3.5 h-3.5" />
        <span>{lang === 'vi' ? 'Tìm nhanh / CV' : 'Search / CV'}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'vi' ? 'Bảng điều khiển và tìm kiếm nhanh' : 'Command Palette Search'}
          className="fixed inset-0 z-[90] flex items-start justify-center pt-14 sm:pt-24 px-3 sm:px-4"
        >
          {/* BACKDROP */}
          <div
            onClick={closePalette}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          {/* DIALOG BOX */}
          <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-700/90 bg-slate-900 shadow-2xl overflow-hidden" /* taste-skill-ignore: modal overlay */>
            {/* SEARCH INPUT BAR */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800" /* taste-skill-ignore: form input divider */>
              <Search className="w-4 h-4 text-[#9BE7FA] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  lang === 'vi'
                    ? 'Nhập tên dự án (Kami Ely, Japan, Library Bus), SQL Lab hoặc tải CV...'
                    : 'Search projects (Kami Ely, Japan, Library Bus), SQL Lab, or download CV...'
                }
                aria-label={lang === 'vi' ? 'Ô nhập từ khóa tìm kiếm' : 'Command search input'}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={closePalette}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                <kbd>ESC</kbd>
              </button>
            </div>

            {/* COMMAND LIST */}
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

            {/* FOOTER SHORTCUT HINTS */}
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
