'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, Briefcase, FileText, User, LayoutDashboard, Database, 
  Sun, Moon, Globe, Download, CornerDownLeft, X
} from 'lucide-react';
import { ProjectData } from '@/app/types';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';
import { trackVisitorAction } from '@/app/lib/visitorTracking';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectData[];
  onSelectTab: (_tabId: string) => void;
  onSelectProject: (_projId: string) => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Projects' | 'Quick Actions' | 'Skills';
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  action: () => void;
  badge?: string;
}

export default function CommandPalette({
  isOpen,
  onClose,
  projects,
  onSelectTab,
  onSelectProject,
}: CommandPaletteProps) {
  const { language, setLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const isEn = language === 'en';
  const isDark = resolvedTheme === 'dark';

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setQuery('');
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Build command list
  const commands: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = [
      // Navigation
      {
        id: 'nav-home',
        category: 'Navigation',
        title: isEn ? 'Home (Overview)' : 'Trang Chủ (Tổng quan)',
        subtitle: isEn ? 'Hero profile and summary' : 'Giới thiệu tổng quan và tóm tắt',
        icon: User,
        action: () => { onSelectTab('home'); onClose(); },
      },
      {
        id: 'nav-about',
        category: 'Navigation',
        title: isEn ? 'About & SQL Sandbox' : 'Giới Thiệu & SQL Sandbox',
        subtitle: isEn ? 'Interactive SQL runner & bio' : 'Trình thực thi SQL tương tác & tiểu sử',
        icon: Database,
        action: () => { onSelectTab('about'); onClose(); },
        badge: 'Interactive',
      },
      {
        id: 'nav-cv',
        category: 'Navigation',
        title: isEn ? 'Education & Experience' : 'Học Vấn & Kinh Nghiệm',
        subtitle: isEn ? 'Career timeline and research' : 'Lộ trình sự nghiệp và nghiên cứu khoa học',
        icon: FileText,
        action: () => { onSelectTab('experience'); onClose(); },
      },
      {
        id: 'nav-projects',
        category: 'Navigation',
        title: isEn ? 'All Projects' : 'Tất Cả Dự Án',
        subtitle: isEn ? 'Explore all data analyst case studies' : 'Khám phá danh mục các dự án phân tích',
        icon: Briefcase,
        action: () => { onSelectTab('projects'); onClose(); },
      },
      {
        id: 'nav-dashboard',
        category: 'Navigation',
        title: isEn ? 'Interactive Lab' : 'Thực Hành Lab',
        subtitle: isEn ? 'Live metrics and SQL visualizer' : 'Chỉ số thời gian thực và SQL/CSV',
        icon: LayoutDashboard,
        action: () => { onSelectTab('lab'); onClose(); },
        badge: 'Interactive',
      },

      // Project Case Studies
      ...projects.map((p) => ({
        id: `proj-${p.id}`,
        category: 'Projects' as const,
        title: p.title,
        subtitle: p.desc,
        icon: Briefcase,
        action: () => { onSelectProject(p.id); onClose(); },
        badge: p.tags?.[0] || 'Case Study',
      })),

      // Quick Actions
      {
        id: 'action-theme',
        category: 'Quick Actions',
        title: isEn ? `Switch to ${isDark ? 'Light' : 'Dark'} Mode` : `Chuyển sang Giao diện ${isDark ? 'Sáng' : 'Tối'}`,
        subtitle: isEn ? 'Toggle application color theme' : 'Đổi chế độ màu sắc giao diện',
        icon: isDark ? Sun : Moon,
        action: () => { toggleTheme(); onClose(); },
        badge: isDark ? 'Light' : 'Dark',
      },
      {
        id: 'action-cv',
        category: 'Quick Actions',
        title: isEn ? 'Download CV (PDF)' : 'Tải Hồ Sơ Năng Lực (CV PDF)',
        subtitle: isEn ? 'Download complete curriculum vitae' : 'Mở và tải tệp CV đầy đủ',
        icon: Download,
        action: () => { window.open('/Ma_Van_Hung_CV_Data_Analyst_2026.pdf', '_blank'); onClose(); },
      },
    ];

    return items;
  }, [isEn, isDark, projects, onSelectTab, onSelectProject, toggleTheme, setLanguage, onClose]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(lower)) ||
        c.category.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          trackVisitorAction(`Command Palette: ${filteredCommands[selectedIndex].title}`, 'command_palette', 'navigation');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div 
        className="relative w-full max-w-xl bg-ground-alt/95 dark:bg-slate-900/95 border border-[#9BE7FA]/40 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden font-heading"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-subtle dark:border-slate-800 bg-surface/20 dark:bg-slate-900">
          <Search className="w-5 h-5 text-[#074553] dark:text-[#9BE7FA] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={isEn ? 'Type a command, search project, or skill...' : 'Tìm nhanh dự án, kỹ năng, hoặc lệnh điều hướng...'}
            className="w-full bg-transparent border-none text-ink dark:text-white placeholder-ink-muted dark:placeholder-slate-500 text-sm focus:outline-hidden"
          />
          <button
            onClick={onClose}
            aria-label="Đóng bảng lệnh nhanh"
            className="p-1 rounded-md text-ink-muted hover:text-ink dark:text-slate-400 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2" role="listbox">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-muted dark:text-slate-400">
              {isEn ? 'No commands matching your query' : 'Không tìm thấy kết quả phù hợp'}
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    cmd.action();
                    trackVisitorAction(`Command Palette: ${cmd.title}`, 'command_palette', 'navigation');
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#C8EEF7]/50 dark:bg-slate-800 text-ink dark:text-white'
                      : 'text-ink-secondary dark:text-slate-300 hover:bg-surface/20 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#9BE7FA] text-slate-950 dark:bg-[#9BE7FA]' : 'bg-surface/40 dark:bg-slate-800 text-[#074553] dark:text-[#9BE7FA]'}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate text-ink dark:text-white">
                        {cmd.title}
                      </p>
                      {cmd.subtitle && (
                        <p className="text-[11px] text-ink-muted dark:text-slate-400 truncate">
                          {cmd.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.badge && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface/50 border border-border-subtle dark:bg-slate-800 dark:border-slate-700 text-[#074553] dark:text-[#9BE7FA]">
                        {cmd.badge}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-ink-muted dark:text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-ground dark:bg-slate-950 border-t border-border-subtle dark:border-slate-800 text-[11px] text-ink-muted dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>Dùng</span>
            <kbd className="px-1.5 py-0.5 rounded-sm bg-surface/50 dark:bg-slate-800 border border-border-subtle dark:border-slate-700 font-mono text-[10px]">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded-sm bg-surface/50 dark:bg-slate-800 border border-border-subtle dark:border-slate-700 font-mono text-[10px]">↓</kbd>
            <span>để chọn</span>
            <kbd className="px-1.5 py-0.5 rounded-sm bg-surface/50 dark:bg-slate-800 border border-border-subtle dark:border-slate-700 font-mono text-[10px]">Enter</kbd>
            <span>để mở</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded-sm bg-surface/50 dark:bg-slate-800 border border-border-subtle dark:border-slate-700 font-mono text-[10px]">ESC</kbd>
            <span>đóng</span>
          </div>
        </div>
      </div>
    </div>
  );
}
