'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GitBranch, Layers, ExternalLink, Zap, Database, 
  Compass, Cpu, PlayCircle, Workflow, Activity,
  Monitor, Smartphone, Presentation, ArrowUpRight
} from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { useLanguage } from '@/app/context/LanguageContext';

export interface Chapter3InteractiveShowcaseProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

type ShowcaseTab = 'architecture-graph' | 'understand-radar' | 'website-desktop' | 'website-mobile' | 'presentation';
type ViewMode = 'interactive' | 'inspector';

export function Chapter3InteractiveShowcase({ 
  isEn: propIsEn, 
  onCopyDeepLink = () => {} 
}: Chapter3InteractiveShowcaseProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';

  const [viewMode, setViewMode] = useState<ViewMode>('interactive');
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<ShowcaseTab>('architecture-graph');

  return (
    <section id="sec-interactive" className="space-y-6 scroll-mt-36">
      <SectionHeader
        variant="chapter"
        id="sec-interactive"
        chapter="CHAPTER 03"
        subtitle={isEn ? '3.3 Live Interactive Sandbox & Architecture Inspector' : '3.3 Phòng Thí Nghiệm Tương Tác Sống & Giải Phẫu Kiến Trúc'}
        badge="3.3"
        title={isEn ? 'Live Interactive Showcase: Architecture Graph, Radar & UI Sandbox' : 'Bộ Trình Diễn Tương Tác: Đồ Thị Kiến Trúc, Bản Đồ Radar & Sandbox Giao Diện'}
        onCopy={onCopyDeepLink}
      />

      {/* TOP VIEW MODE TOGGLE (2 Chế độ: Trải nghiệm Tương tác Sống vs Giải phẫu Cấu trúc & Luồng Sự kiện) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100 border border-slate-200/90 dark:bg-slate-900/90 dark:border-slate-800">
        <div className="flex items-center gap-2 px-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          <Activity className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
          <span>{isEn ? 'DISPLAY PERSPECTIVE:' : 'GÓC NHÌN TRÌNH DIỄN:'}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <button
            type="button"
            onClick={() => setViewMode('interactive')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'interactive'
                ? 'bg-[#0D7287] text-white shadow-md'
                : 'bg-white/80 text-slate-700 hover:bg-white hover:text-[#0D7287] border border-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-slate-700'
            }`}
          >
            <PlayCircle className="w-4 h-4 text-[#9BE7FA]" />
            <span>{isEn ? 'Live Interactive Sandbox' : 'Trải Nghiệm Tương Tác Sống'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('inspector')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'inspector'
                ? 'bg-[#0D7287] text-white shadow-md'
                : 'bg-white/80 text-slate-700 hover:bg-white hover:text-[#0D7287] border border-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-slate-700'
            }`}
          >
            <Workflow className="w-4 h-4 text-[#FFD14C]" />
            <span>{isEn ? 'Architecture & Event Lifecycle' : 'Giải Phẫu Cấu Trúc & Luồng Sự Kiện'}</span>
          </button>
        </div>
      </div>

      {/* MODE 1: LIVE INTERACTIVE SANDBOX */}
      {viewMode === 'interactive' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 5-Artifact Tab Bar */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveShowcaseTab('architecture-graph')}
              className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeShowcaseTab === 'architecture-graph'
                  ? 'bg-[#0D7287] text-white shadow-md'
                  : 'text-slate-700 hover:text-[#0D7287] hover:bg-white/80 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>{isEn ? '7-App D3 Graph' : 'Đồ Thị Kiến Trúc 7 Apps'}</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] font-bold dark:bg-slate-800 dark:text-[#9BE7FA]">
                D3 Network
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveShowcaseTab('understand-radar')}
              className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeShowcaseTab === 'understand-radar'
                  ? 'bg-[#0D7287] text-white shadow-md'
                  : 'text-slate-700 hover:text-[#0D7287] hover:bg-white/80 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isEn ? 'Concentric Radar' : 'Bản Đồ Radar Đồng Tâm'}</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] font-bold dark:bg-slate-800 dark:text-[#9BE7FA]">
                Clean Arch
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveShowcaseTab('website-desktop')}
              className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeShowcaseTab === 'website-desktop'
                  ? 'bg-[#0D7287] text-white shadow-md'
                  : 'text-slate-700 hover:text-[#0D7287] hover:bg-white/80 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>{isEn ? 'Desktop Reader (1440px)' : 'Độc Giả Desktop (1440px)'}</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-md bg-[#FFE485] text-amber-950 font-bold dark:bg-amber-900/40 dark:text-[#FFE485]">
                20 Screens
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveShowcaseTab('website-mobile')}
              className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeShowcaseTab === 'website-mobile'
                  ? 'bg-[#0D7287] text-white shadow-md'
                  : 'text-slate-700 hover:text-[#0D7287] hover:bg-white/80 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{isEn ? 'Mobile Reader (390px)' : 'Độc Giả Mobile (390px)'}</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] font-bold dark:bg-slate-800 dark:text-[#9BE7FA]">
                Responsive
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveShowcaseTab('presentation')}
              className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeShowcaseTab === 'presentation'
                  ? 'bg-[#0D7287] text-white shadow-md'
                  : 'text-slate-700 hover:text-[#0D7287] hover:bg-white/80 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Presentation className="w-4 h-4" />
              <span>{isEn ? 'Product Pitch Deck' : 'Bản Thuyết Trình Sản Phẩm'}</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-md bg-[#FFE485] text-amber-950 font-bold dark:bg-amber-900/40 dark:text-[#FFE485]">
                30 Slides
              </span>
            </button>
          </div>

          {/* TAB 1: ARCHITECTURE GRAPH */}
          {activeShowcaseTab === 'architecture-graph' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#0D7287]/10 text-[#0D7287] dark:bg-[#0D7287]/20 dark:text-[#9BE7FA]">
                      <GitBranch className="w-4 h-4" />
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {isEn 
                        ? '1. 7-App Architecture Graph: Entity-Relationship & Relational Topology' 
                        : '1. Đồ Thị Mạng Lưới Kiến Trúc 7 Apps: Quan Hệ Thực Thể & Ràng Buộc Khóa Ngoại'}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/projects/library-bus/architecture"
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#C8EEF7]/40 text-[#0D7287] hover:bg-[#C8EEF7] border border-[#9BE7FA]/60 dark:bg-slate-800 dark:text-[#9BE7FA] dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      <span>{isEn ? 'Dedicated Route' : 'Trang Độc Lập'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3 dark:bg-slate-950 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
                      <Zap className="w-4 h-4" />
                      <span>{isEn ? 'Interactive Capabilities & Tools' : 'Chức Năng & Công Cụ Tương Tác'}</span>
                    </div>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold mt-0.5">▸</span>
                        <span>
                          <strong>{isEn ? 'Physics-driven D3 Simulation:' : 'Vật lý động học D3 Force Simulation:'}</strong>{' '}
                          {isEn 
                            ? 'Drag nodes, pan, and zoom to explore clusters with dynamic spring repulsion.'
                            : 'Kéo thả tự do các node, phóng to/thu nhỏ (Zoom & Pan), tự động cân bằng lực đẩy lò xo mượt mà.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold mt-0.5">▸</span>
                        <span>
                          <strong>{isEn ? 'Multi-App Filtering & Search:' : 'Bộ lọc phân hệ & Tìm kiếm nhanh:'}</strong>{' '}
                          {isEn 
                            ? 'Filter by 7 Django apps (Inventory, Transactions, Users, etc.) or search models instantly.'
                            : 'Lọc nhanh theo 7 phân hệ Django (Kho sách, Giao dịch, Người dùng,...) hoặc tra cứu model bất kỳ.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold mt-0.5">▸</span>
                        <span>
                          <strong>{isEn ? 'Bidirectional Dependency Inspector:' : 'Bảng phân tích ảnh hưởng 2 chiều:'}</strong>{' '}
                          {isEn 
                            ? 'Click any node to see who references it (Incoming) and what it connects to (Outgoing).'
                            : 'Nhấp vào node để xem bảng phụ thuộc (Incoming) và liên đới (Outgoing), hỗ trợ zoom nhanh 1 chạm.'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3 dark:bg-slate-950 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 font-black uppercase tracking-wider text-[#0D7287] dark:text-[#FFD14C]">
                      <Database className="w-4 h-4" />
                      <span>{isEn ? 'Architecture & Data Structure' : 'Cấu Trúc Kiến Trúc & Dữ Liệu'}</span>
                    </div>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="text-[#0D7287] dark:text-[#FFD14C] font-bold mt-0.5">▸</span>
                        <span>
                          <strong>{isEn ? '7 Django Modular Monolith Apps:' : '7 Phân Hệ Django Modular Monolith:'}</strong>{' '}
                          {isEn 
                            ? 'inventory, transactions, users, analytics, notifications, blog, core with clear boundaries.'
                            : 'inventory (đội xe & kho sách), transactions (mượn/trả), users (xác thực), analytics, notifications, blog, core.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0D7287] dark:text-[#FFD14C] font-bold mt-0.5">▸</span>
                        <span>
                          <strong>{isEn ? '23+ ORM Models & Relational Integrity:' : '23+ Models ORM & Ràng Buộc Khóa Ngoại:'}</strong>{' '}
                          {isEn 
                            ? 'BorrowRecord connects Profile, BookCopy, LibraryBus, and BusRoute with strict integrity.'
                            : 'Thực thể BorrowRecord liên kết chặt chẽ với Profile, BookCopy, LibraryBus và BusRoute qua Foreign Keys.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0D7287] dark:text-[#FFD14C] font-bold mt-0.5">▸</span>
                        <span>
                          <strong>{isEn ? '100% Standalone Canvas Engine:' : 'Động cơ Vis-Network Canvas 100% Độc Lập:'}</strong>{' '}
                          {isEn 
                            ? 'Runs standalone in iframe, requiring zero external database servers.'
                            : 'Hoạt động độc lập không phụ thuộc máy chủ cơ sở dữ liệu bên ngoài.'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <GitBranch className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span>Interactive Architecture Graph (7 Apps, Models & Foreign Keys)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/library-bus/architecture-graph.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                      <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
                    </a>
                  </div>
                </div>
                <div className="w-full h-[650px] bg-slate-50 dark:bg-slate-950">
                  <iframe
                    src="/library-bus/architecture-graph.html"
                    title="Library Bus Architecture Graph"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UNDERSTAND RADAR */}
          {activeShowcaseTab === 'understand-radar' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#0D7287]/10 text-[#0D7287] dark:bg-[#0D7287]/20 dark:text-[#9BE7FA]">
                      <Layers className="w-4 h-4" />
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {isEn 
                        ? '2. Concentric Radar Map: Clean / Onion Architecture Radial Layout' 
                        : '2. Bản Đồ Radar Vòng Tròn Đồng Tâm: Mô Hình Phân Tầng Clean / Onion Architecture'}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/projects/library-bus/dashboard"
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#C8EEF7]/40 text-[#0D7287] hover:bg-[#C8EEF7] border border-[#9BE7FA]/60 dark:bg-slate-800 dark:text-[#9BE7FA] dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      <span>{isEn ? 'Dedicated Route' : 'Trang Độc Lập'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3 dark:bg-slate-950 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 font-black uppercase tracking-wider text-[#0D7287] dark:text-[#9BE7FA]">
                      <Compass className="w-4 h-4" />
                      <span>{isEn ? 'Interactive Capabilities & Tools' : 'Chức Năng & Công Cụ Tương Tác'}</span>
                    </div>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold mt-0.5">▸</span>
                        <span>
                          <strong>{isEn ? '6-Layer Interactive Highlighting:' : 'Lọc & Highlight 6 Tầng Kiến Trúc:'}</strong>{' '}
                          {isEn 
                            ? 'Click any sidebar card to highlight its nodes on the radar and open the Inspector panel.'
                            : 'Chọn thẻ bên trái để làm sáng node tương ứng trên radar và mở bảng giải thích.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold mt-0.5">▸</span>
                        <span>
                          <strong>{isEn ? '7-Step Architectural Guided Tour:' : 'Chuyến tham quan có hướng dẫn 7 bước:'}</strong>{' '}
                          {isEn 
                            ? 'Follow the 7-step tour from settings.py, ORM models, locking engine, Celery to UI templates.'
                            : 'Theo dõi 7 bước tuần tự từ settings.py, models, Celery worker đến giao diện người dùng.'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold mt-0.5">▸</span>
                        <span>
                          <strong>{isEn ? 'Inspect 702 Code Nodes:' : 'Khám phá chi tiết 702 tệp mã nguồn:'}</strong>{' '}
                          {isEn 
                            ? 'Click any dot on the radar to inspect exact file paths, class/function names, and responsibilities.'
                            : 'Nhấp vào một điểm trên bản đồ để xem chi tiết đường dẫn, tên hàm và vai trò nghiệp vụ.'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3 dark:bg-slate-950 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 font-black uppercase tracking-wider text-[#0D7287] dark:text-[#FFD14C]">
                      <Cpu className="w-4 h-4" />
                      <span>{isEn ? 'Architecture & Layer Structure' : 'Cấu Trúc Phân Tầng & Hình Học'}</span>
                    </div>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="text-[#0D7287] dark:text-[#FFD14C] font-bold mt-0.5">▸</span>
                        <span>
                          <strong>{isEn ? '6 Concentric Clean Architecture Rings:' : '6 Vòng Tròn Đồng Tâm (Clean Architecture):'}</strong>
                          <div className="mt-1 grid grid-cols-2 gap-1 text-[11px] font-mono">
                            <span className="text-sky-600 dark:text-sky-400">• Vòng 1: Core & Config (30)</span>
                            <span className="text-emerald-600 dark:text-emerald-400">• Vòng 2: Models & DB (32)</span>
                            <span className="text-amber-600 dark:text-amber-400">• Vòng 3: Services & Tasks (7)</span>
                            <span className="text-indigo-600 dark:text-indigo-400">• Vòng 4: Views (32)</span>
                            <span className="text-purple-600 dark:text-purple-400">• Vòng 5: Testing (20)</span>
                            <span className="text-rose-600 dark:text-rose-400">• Vòng 6: Templates (114)</span>
                          </div>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0D7287] dark:text-[#FFD14C] font-bold mt-0.5">▸</span>
                        <span>
                          <strong>{isEn ? 'Polar Projection (r, θ):' : 'Tọa độ cực Polar Projection (r, θ):'}</strong>{' '}
                          {isEn 
                            ? 'Nodes are mathematically locked onto designated concentric orbits, eliminating visual clutter.'
                            : 'Các node được khóa cố định theo hình học, loại bỏ sự lộn xộn và giữ đúng trật tự tầng.'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Layers className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span>Concentric Architecture Radar & Telemetry Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/library-bus/understand_dashboard.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                      <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
                    </a>
                  </div>
                </div>
                <div className="w-full h-[650px] bg-slate-50 dark:bg-slate-950">
                  <iframe
                    src="/library-bus/understand_dashboard.html"
                    title="Library Bus Concentric Radar"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESKTOP READER (1440px) */}
          {activeShowcaseTab === 'website-desktop' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {isEn ? '3. Desktop Reader Interface Specification (1440px Canvas)' : '3. Bản Đặc Tả Thiết Kế Website Độc Giả Desktop (1440px)'}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA] px-2.5 py-0.5 rounded-md bg-[#C8EEF7]/50 dark:bg-slate-800">
                    20 High-Fidelity Desktop Screens
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Explore the live interactive specification of the 20 desktop screens, featuring real bus field telemetry, instant O(1) book filtering, route tracking, and seat reservation workflows.'
                    : 'Trực tiếp khám phá 20 màn hình website máy tính hoàn chỉnh: từ tìm kiếm sách O(1), theo dõi lộ trình xe buýt, thông tin thủ thư đến luồng đặt giữ chỗ chống xung đột.'}
                </p>
              </div>

              <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Monitor className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span>website.html (Desktop 1440px Reader Specification)</span>
                  </div>
                  <a
                    href="/library-bus/website.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
                  </a>
                </div>
                <div className="w-full h-[680px] bg-slate-950">
                  <iframe
                    src="/library-bus/website.html"
                    title="Library Bus Desktop Reader"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MOBILE READER (390px) */}
          {activeShowcaseTab === 'website-mobile' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {isEn ? '4. Mobile Reader UX/UI Guidelines (390px Viewport)' : '4. Bộ Quy Chuẩn Thiết Kế Ứng Dụng Di Động (Khung 390px)'}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0D7287] dark:text-[#9BE7FA] px-2.5 py-0.5 rounded-md bg-[#C8EEF7]/50 dark:bg-slate-800">
                    34 Mobile Screen Guidelines
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Mobile viewport simulation optimized for touch ergonomics (44x44px targets), bottom navigation bar, quick QR code scan, and route schedule notifications.'
                    : 'Mô phỏng trải nghiệm trên điện thoại thông minh: bố cục công thái học ngón tay cái, thanh điều hướng đáy, quét mã QR nhận sách và theo dõi trạm dừng theo thời gian thực.'}
                </p>
              </div>

              <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Smartphone className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span>website-mobile.html (Mobile 390px Interactive Sandbox)</span>
                  </div>
                  <a
                    href="/library-bus/website-mobile.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
                  </a>
                </div>
                <div className="w-full h-[700px] bg-slate-950 flex items-center justify-center p-3">
                  <div className="w-full max-w-[420px] h-full rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-black">
                    <iframe
                      src="/library-bus/website-mobile.html"
                      title="Library Bus Mobile Reader"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRESENTATION (30 SLIDES) */}
          {activeShowcaseTab === 'presentation' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <Presentation className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {isEn ? '5. Product Pitch Deck: Research, Architecture & Design (30 Slides)' : '5. Bản Trình Chiếu Sản Phẩm: Nghiên Cứu, Kiến Trúc & Thiết Kế (30 Slides)'}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/projects/library-bus/presentation"
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#C8EEF7]/40 text-[#0D7287] hover:bg-[#C8EEF7] border border-[#9BE7FA]/60 dark:bg-slate-800 dark:text-[#9BE7FA] dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      <span>{isEn ? 'Dedicated Route' : 'Trang Độc Lập'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'A comprehensive 30-slide pitch deck covering user personas, pain-point quantification, information architecture, 12-column grid system, and production telemetry benchmarks.'
                    : 'Bản slide 30 trang đầy đủ thuyết minh: chân dung người dùng, định lượng nỗi đau mượn sách, kiến trúc thông tin, hệ thống lưới 12 cột và số đo kiểm thử hiệu năng.'}
                </p>
              </div>

              <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Presentation className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span>presentation.html (30-Slide Product Deck)</span>
                  </div>
                  <a
                    href="/library-bus/presentation.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
                  </a>
                </div>
                <div className="w-full h-[650px] bg-slate-950">
                  <iframe
                    src="/library-bus/presentation.html"
                    title="Library Bus Presentation Deck"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* KHỐI GIẢI PHẪU LUỒNG TƯƠNG TÁC 4 BƯỚC (HIỂN THỊ TRỰC QUAN NGAY TRÊN SHOWCASE) */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 space-y-3 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#9BE7FA]" />
                <span className="text-xs font-mono font-bold uppercase text-[#9BE7FA]">
                  {isEn
                    ? 'End-to-End User Interaction & Telemetry Lifecycle'
                    : 'Chu Trình Sự Kiện Khi Người Dùng Tương Tác (End-to-End Interaction Lifecycle)'}
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                Simulated via Python Seeding & Archify Runtime
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 font-bold">BƯỚC 1 • UI EVENT</span>
                  <span className="text-slate-400">0–16ms</span>
                </div>
                <div className="font-bold text-white">
                  {isEn ? 'Micro-Interactions & Tokens' : 'Vi tương tác & Design Tokens'}
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {isEn
                    ? 'User filters books, selects a bus stop, or clicks a graph node. tokens.css & animations.js trigger instant visual feedback.'
                    : 'Người dùng lọc sách, chọn điểm đỗ xe buýt hoặc bấm node đồ thị. Tầng tokens.css & animations.js phản hồi trạng thái tức thì.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">BƯỚC 2 • ATOMIC LOCK</span>
                  <span className="text-slate-400">services.py</span>
                </div>
                <div className="font-bold text-white">
                  {isEn ? 'Concurrency & Stock Validation' : 'Kiểm soát Xung đột Đặt sách'}
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Simulates transactions/services.py & test_race_condition.py: locks bus inventory rows to prevent double-booking.'
                    : 'Mô phỏng logic transactions/services.py & test_race_condition.py: khóa bản ghi sách trên xe buýt, ngăn chặn lỗi đặt trùng.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">BƯỚC 3 • ASYNC WORKER</span>
                  <span className="text-slate-400">celery.py</span>
                </div>
                <div className="font-bold text-white">
                  {isEn ? 'Async Notification Dispatch' : 'Chu trình Thông báo & Hàng đợi'}
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Triggers notifications/tasks.py to dispatch QR pickup codes, bus stop reminders, or waitlist alerts.'
                    : 'Kích hoạt notifications/tasks.py gửi mã QR nhận sách, lịch hẹn điểm đỗ hoặc đưa vào danh sách chờ tự động.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 font-bold">BƯỚC 4 • TELEMETRY BI</span>
                  <span className="text-slate-400">analytics/</span>
                </div>
                <div className="font-bold text-white">
                  {isEn ? 'Dashboard & Leaderboard Sync' : 'Cập nhật Dashboard & Xếp hạng'}
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Circulation events are logged to analytics/models.py, updating bus load charts and reader leaderboards.'
                    : 'Sự kiện mượn/trả được ghi nhận vào analytics/models.py, cập nhật biểu đồ mật độ tuyến xe và Leaderboard.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: ARCHITECTURE & EVENT LIFECYCLE (GIẢI PHẪU CẤU TRÚC 4 LỚP & ĐỒ THỊ) */}
      {viewMode === 'inspector' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* A. 4-STEP LIFECYCLE INSPECTOR */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#9BE7FA]" />
                <span className="text-xs font-mono font-bold uppercase text-[#9BE7FA]">
                  {isEn
                    ? 'End-to-End User Interaction & Telemetry Lifecycle'
                    : 'Chu Trình Sự Kiện Khi Người Dùng Tương Tác (End-to-End Interaction Lifecycle)'}
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                Simulated via Python Seeding & Archify Runtime
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 font-bold">BƯỚC 1 • UI EVENT</span>
                  <span className="text-slate-400">0–16ms</span>
                </div>
                <div className="font-bold text-white">
                  {isEn ? 'Micro-Interactions & Tokens' : 'Vi tương tác & Design Tokens'}
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {isEn
                    ? 'User filters books, selects a bus stop, or clicks a graph node. tokens.css & animations.js trigger instant visual feedback.'
                    : 'Người dùng lọc sách, chọn điểm đỗ xe buýt hoặc bấm node đồ thị. Tầng tokens.css & animations.js phản hồi trạng thái tức thì.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">BƯỚC 2 • ATOMIC LOCK</span>
                  <span className="text-slate-400">services.py</span>
                </div>
                <div className="font-bold text-white">
                  {isEn ? 'Concurrency & Stock Validation' : 'Kiểm soát Xung đột Đặt sách'}
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Simulates transactions/services.py & test_race_condition.py: locks bus inventory rows to prevent double-booking.'
                    : 'Mô phỏng logic transactions/services.py & test_race_condition.py: khóa bản ghi sách trên xe buýt, ngăn chặn lỗi đặt trùng.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">BƯỚC 3 • ASYNC WORKER</span>
                  <span className="text-slate-400">celery.py</span>
                </div>
                <div className="font-bold text-white">
                  {isEn ? 'Async Notification Dispatch' : 'Chu trình Thông báo & Hàng đợi'}
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Triggers notifications/tasks.py to dispatch QR pickup codes, bus stop reminders, or waitlist alerts.'
                    : 'Kích hoạt notifications/tasks.py gửi mã QR nhận sách, lịch hẹn điểm đỗ hoặc đưa vào danh sách chờ tự động.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 font-bold">BƯỚC 4 • TELEMETRY BI</span>
                  <span className="text-slate-400">analytics/</span>
                </div>
                <div className="font-bold text-white">
                  {isEn ? 'Dashboard & Leaderboard Sync' : 'Cập nhật Dashboard & Xếp hạng'}
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Circulation events are logged to analytics/models.py, updating bus load charts and reader leaderboards.'
                    : 'Sự kiện mượn/trả được ghi nhận vào analytics/models.py, cập nhật biểu đồ mật độ tuyến xe và Leaderboard.'}
                </p>
              </div>
            </div>
          </div>

          {/* B. 4-LAYER ARCHITECTURAL BLUEPRINT */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isEn ? '4-Tier System Architecture: From Synthetic Seeding to Next.js Presentation' : 'Cấu Trúc Kiến Trúc 4 Lớp: Từ Kịch Bản Mô Phỏng Đến Trình Diễn Next.js'}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#C8EEF7]/50 text-[#0D7287] dark:bg-slate-800 dark:text-[#9BE7FA]">
                4-Layer Stack
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* LỚP 4 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 dark:bg-slate-950 dark:border-slate-800/80">
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-sky-500/15 text-[#0D7287] dark:text-sky-300 font-bold">LỚP 4</span>
                  <span className="text-slate-400">Presentation</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {isEn ? 'Next.js Orchestrator' : 'Bộ Điều Phối Portfolio'}
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Chapter3InteractiveShowcase, screens.ts metadata, and 3 dedicated routes (/architecture, /dashboard, /presentation).'
                    : 'Chapter3InteractiveShowcase, screens.ts quản lý metadata màn hình, và 3 route chuyên biệt (/architecture, /dashboard, /presentation).'}
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-500">
                  Tech: Next.js 15, Turbopack, Tailwind
                </div>
              </div>

              {/* LỚP 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 dark:bg-slate-950 dark:border-slate-800/80">
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">LỚP 3</span>
                  <span className="text-slate-400">Artifacts</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {isEn ? '5 Standalone HTML Environments' : '5 Môi Trường Độc Lập'}
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'architecture-graph.html, website.html, website-mobile.html, understand_dashboard.html, and presentation.html.'
                    : '5 môi trường tự chứa chạy 100% offline không phụ thuộc DB ngoài: đồ thị mạng lưới, web desktop 1440px, web mobile 390px, radar và slide 30 trang.'}
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-500">
                  Tech: Vis-Network, Archify, Canvas
                </div>
              </div>

              {/* LỚP 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 dark:bg-slate-950 dark:border-slate-800/80">
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold">LỚP 2</span>
                  <span className="text-slate-400">Design System</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {isEn ? 'Design Tokens & 42 Templates' : 'Design Tokens & 42 Templates'}
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'tokens.css -> base.css -> components.css -> animations.css. 42 templates across 6 modules (inventory, transactions, users, etc.).'
                    : 'Kiến trúc CSS 4 tầng và 42 template phân tách theo 6 phân hệ: inventory (15), transactions (8), analytics (10), blog (11), users (13), notifications (3).'}
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-500">
                  Tokens: #9BE7FA, #C8EEF7, #FFE485, #FFD14C
                </div>
              </div>

              {/* LỚP 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 dark:bg-slate-950 dark:border-slate-800/80">
                <div className="flex items-center justify-between font-mono">
                  <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold">LỚP 1</span>
                  <span className="text-slate-400">Kernel</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {isEn ? 'Synthetic Simulation Kernel' : 'Hạt Nhân Mô Phỏng Nghiệp Vụ'}
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Python scripts generating realistic data & simulating edge cases: seed_books.py, seed_routes.py, generate_test_data.py, and test_race_condition.py.'
                    : 'Bộ script Python khởi tạo dữ liệu giả lập và kiểm thử xung đột: seed_books.py, seed_routes.py, generate_test_data.py và test_race_condition.py.'}
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-500">
                  Kernel: Python 3.11, Django ORM, Celery
                </div>
              </div>
            </div>
          </div>

          {/* C. 6 GRAPH ADVANCED MECHANICS TABLE */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isEn ? '6 Advanced Graph Mechanics in Archify Engine' : '6 Cơ Chế Tương Tác Nâng Cao Của Động Cơ Đồ Thị Archify'}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#C8EEF7]/50 text-[#0D7287] dark:bg-slate-800 dark:text-[#9BE7FA]">
                viewer-runtime
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50 dark:bg-slate-950 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-bold">{isEn ? 'Graph Mechanism' : 'Cơ Chế Tương Tác'}</th>
                    <th className="py-3 px-4 font-bold">{isEn ? 'User Interaction' : 'Thao Tác Của Người Dùng'}</th>
                    <th className="py-3 px-4 font-bold">{isEn ? 'Runtime Handling & Underlying Behavior' : 'Cách Thức Phản Hồi Dưới Tầng Viewer-Runtime'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                      <span>{isEn ? '1. Relationship Lens & Pulse' : '1. Thấu kính Quan hệ & Xung Dữ liệu'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                      Hover / Click on node
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      {isEn
                        ? 'Highlights 1-hop direct neighbors or full reachability chain. Pulses light across links showing request flow direction; dims non-relevant nodes.'
                        : 'Làm sáng cạnh nối trực tiếp (1-Hop) hoặc chuỗi phụ thuộc. Kích hoạt hiệu ứng xung ánh sáng chạy dọc theo đường truyền dữ liệu; làm mờ các node không liên quan.'}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{isEn ? '2. Story Beat & Follow-Camera' : '2. Đạo diễn Kịch bản & Camera Tự động'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                      Click Next / Prev Beats
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      {isEn
                        ? 'Divides workflow into chapters. Camera smoothly pans and zooms into the executing node cluster with contextual narrative box.'
                        : 'Phân tách quy trình thành từng nhịp truyện. Camera tự động trượt tọa độ (Pan) và phóng to (Zoom) vào cụm node đang thực thi, kèm hộp thuyết minh ngữ cảnh.'}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span>{isEn ? '3. Semantic Passport & Proof' : '3. Hộ chiếu Ngữ nghĩa & Bằng chứng Mã'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                      Double-click node
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      {isEn
                        ? 'Opens technical passport showing: component name, layer type, repository file path evidence, internal methods, and bidirectional edges.'
                        : 'Mở ngăn thông tin kỹ thuật: tên thành phần, tầng kiến trúc, đường dẫn tệp thực tế trong repo, các hàm/models và danh sách kết nối.'}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                      <span>{isEn ? '4. Semantic Zoom & Radar' : '4. Thu phóng Ngữ nghĩa & Radar Định vị'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                      Mouse wheel / Drag / Minimap
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      {isEn
                        ? 'Adapts visual density dynamically according to zoom level. The corner minimap tracks viewport position across the large system canvas.'
                        : 'Tự động điều chỉnh mật độ thông tin theo mức thu phóng. Góc màn hình có radar minimap giúp xác định vị trí khung nhìn trên tổng thể.'}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span>{isEn ? '5. Legend Gateway & Finder' : '5. Cổng Lọc Chú giải & Tìm kiếm Nhanh'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                      Click legend pill / Search keyword
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      {isEn
                        ? 'Instantly filters nodes by layer (Templates, Views, Services, Models, Workers) or focuses camera directly onto matching search hits.'
                        : 'Lọc tức thì các node theo nhóm vai trò kiến trúc hoặc nhảy thẳng camera tới node khớp từ khóa.'}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      <span>{isEn ? '6. Route Probe & Permalink' : '6. Kiểm dò Tuyến & Liên kết Trạng thái'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                      Select A to B / Copy URL
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      {isEn
                        ? 'Traces path between any 2 nodes and serializes the selected state into a shareable URL permalink.'
                        : 'Kiểm tra đường truyền giữa 2 thành phần bất kỳ và ghi trạng thái node đang chọn vào URL để chia sẻ chính xác góc nhìn.'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* D. DIRECT SUB-ROUTES & LAUNCH BAR */}
          <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase text-[#0D7287] dark:text-[#9BE7FA]">
                {isEn ? 'Dedicated Sub-Route Navigation' : 'Cổng Khám Phá Toàn Màn Hình'}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isEn 
                  ? 'Access full-viewport experiences on isolated sub-routes designed for desktop monitors.'
                  : 'Trải nghiệm trên diện tích hiển thị tối đa với các route chuyên biệt cho máy tính.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/projects/library-bus/architecture"
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0D7287] text-white hover:bg-[#095262] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <GitBranch className="w-3.5 h-3.5 text-[#9BE7FA]" />
                <span>/architecture</span>
              </Link>
              <Link
                href="/projects/library-bus/dashboard"
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>/dashboard</span>
              </Link>
              <Link
                href="/projects/library-bus/presentation"
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Presentation className="w-3.5 h-3.5 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>/presentation</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Chapter3InteractiveShowcase;
