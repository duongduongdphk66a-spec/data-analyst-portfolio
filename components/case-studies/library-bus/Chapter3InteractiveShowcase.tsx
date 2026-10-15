import React, { useState } from 'react';
import { 
  GitBranch, Layers, ExternalLink, Zap, Database, 
  Compass, Cpu, Sparkles
} from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

import { useLanguage } from '@/app/context/LanguageContext';

export interface Chapter3InteractiveShowcaseProps {
  isEn?: boolean;
  onCopyDeepLink?: (_sectionId: string, _title?: string) => void;
}

export function Chapter3InteractiveShowcase({ 
  isEn: propIsEn, 
  onCopyDeepLink = () => {} 
}: Chapter3InteractiveShowcaseProps = {}) {
  const { language } = useLanguage();
  const isEn = propIsEn !== undefined ? propIsEn : language === 'en';
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'architecture-graph' | 'understand-radar'>('architecture-graph');

  return (
    <section id="sec-interactive" className="space-y-6 scroll-mt-36">
      <SectionHeader
        variant="chapter"
        id="sec-interactive"
        chapter="CHAPTER 03"
        subtitle={isEn ? '3.3 Interactive Demos & Architecture Mapping' : '3.3 Bộ trình diễn tương tác & Bản đồ kiến trúc'}
        badge="3.3"
        title={isEn ? 'Live Interactive Showcase: Architecture Graph & Radar Map' : 'Bộ Trình Diễn Tương Tác: Đồ Thị Mạng Lưới & Bản Đồ Radar Kiến Trúc'}
        onCopy={onCopyDeepLink}
      />

      {/* Comparative Overview Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#C8EEF7]/40 via-white to-amber-50/40 border border-[#9BE7FA]/60 dark:from-slate-900 dark:via-slate-900/90 dark:to-amber-950/20 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0D7287]/10 text-[#0D7287] dark:bg-[#0D7287]/20 dark:text-[#9BE7FA]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {isEn ? 'Two Complementary Architectural Perspectives' : 'Hai Góc Nhìn Kiến Trúc Bổ Trợ Song Hành'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {isEn 
                  ? 'Switch between relational entity topology (D3 Graph) and concentric abstraction layers (Clean Radar).'
                  : 'Chuyển đổi giữa góc nhìn quan hệ thực thể (D3 Graph) và phân tầng trừu tượng (Clean Radar).'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              7 Apps • 23 Models
            </span>
            <span>&</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              6 Rings • 702 Nodes
            </span>
          </div>
        </div>
      </div>

      {/* Showcase Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <button
          onClick={() => setActiveShowcaseTab('architecture-graph')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeShowcaseTab === 'architecture-graph'
              ? 'bg-[#0D7287] text-white shadow-md'
              : 'text-slate-700 hover:text-[#0D7287] hover:bg-white/80 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>{isEn ? '7-App Interactive Architecture Graph' : 'Đồ Thị Mạng Lưới Kiến Trúc 7 Apps'}</span>
          <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] font-bold dark:bg-slate-800 dark:text-[#9BE7FA]">
            D3 Graph
          </span>
        </button>

        <button
          onClick={() => setActiveShowcaseTab('understand-radar')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeShowcaseTab === 'understand-radar'
              ? 'bg-[#0D7287] text-white shadow-md'
              : 'text-slate-700 hover:text-[#0D7287] hover:bg-white/80 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isEn ? 'Concentric Architecture Radar' : 'Bản Đồ Radar Vòng Tròn Đồng Tâm'}</span>
          <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md bg-[#C8EEF7] text-[#0D7287] font-bold dark:bg-slate-800 dark:text-[#9BE7FA]">
            Clean Radar
          </span>
        </button>
      </div>

      {/* Tab 1: Explanation & Interactive D3 Architecture Graph */}
      {activeShowcaseTab === 'architecture-graph' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Detailed Explanation: Functionality & Structure */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#0D7287]/10 text-[#0D7287] dark:bg-[#0D7287]/20 dark:text-[#9BE7FA]">
                  <GitBranch className="w-4 h-4" />
                </span>
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {isEn 
                    ? '1. 7-App Architecture Graph: Functionality & Structural Overview' 
                    : '1. Đồ Thị Mạng Lưới Kiến Trúc 7 Apps: Chức Năng & Cấu Trúc Chi Tiết'}
                </h4>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#C8EEF7]/50 text-[#0D7287] border border-[#9BE7FA]/40 dark:bg-slate-800 dark:text-[#9BE7FA]">
                {isEn ? 'Entity-Relationship & Foreign Key Topology' : 'Mô Hình Quan Hệ Thực Thể & Ràng Buộc Khóa Ngoại'}
              </span>
            </div>

            {/* 2-Column Grid: Chức Năng vs Cấu Trúc */}
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              {/* Column 1: Chức Năng Tương Tác */}
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
                        ? 'Freely drag nodes, pan, and zoom to explore clusters with dynamic spring repulsion.'
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
                        ? 'Click any node to see who references it (Incoming) and what it connects to (Outgoing), with 1-click zoom.'
                        : 'Nhấp vào node để xem bảng phụ thuộc (Incoming) và liên đới (Outgoing), hỗ trợ zoom nhanh 1 chạm.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold mt-0.5">▸</span>
                    <span>
                      <strong>{isEn ? 'Pinning & Link Adjustment:' : 'Khóa vị trí & Điều chỉnh lực liên kết:'}</strong>{' '}
                      {isEn 
                        ? 'Pin key nodes in place to build custom topology layouts or adjust graph repulsion.'
                        : 'Ghim cố định node để tạo sơ đồ tùy chỉnh hoặc tinh chỉnh lực đẩy liên kết của đồ thị.'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Column 2: Cấu Trúc Kỹ Thuật */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3 dark:bg-slate-950 dark:border-slate-800/80">
                <div className="flex items-center gap-2 font-black uppercase tracking-wider text-[#ED9040] dark:text-[#FFD14C]">
                  <Database className="w-4 h-4" />
                  <span>{isEn ? 'Architecture & Data Structure' : 'Cấu Trúc Kiến Trúc & Dữ Liệu'}</span>
                </div>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ED9040] dark:text-[#FFD14C] font-bold mt-0.5">▸</span>
                    <span>
                      <strong>{isEn ? '7 Django Modular Monolith Apps:' : '7 Phân Hệ Django Modular Monolith:'}</strong>{' '}
                      {isEn 
                        ? 'inventory (fleet & books), transactions (borrows & locking), users (RBAC & auth), analytics, notifications, blog, core.'
                        : 'inventory (đội xe & kho sách), transactions (mượn/trả & khóa bi quan), users (xác thực & RBAC), analytics, notifications, blog, core.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ED9040] dark:text-[#FFD14C] font-bold mt-0.5">▸</span>
                    <span>
                      <strong>{isEn ? '23+ ORM Models & Relational Constraints:' : '23+ Models ORM & Ràng Buộc Khóa Ngoại:'}</strong>{' '}
                      {isEn 
                        ? 'Models like BorrowRecord bridge Profile, BookCopy, LibraryBus, and BusRoute with high data integrity.'
                        : 'Thực thể BorrowRecord liên kết chặt chẽ với Profile, BookCopy, LibraryBus và BusRoute qua Foreign Keys.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ED9040] dark:text-[#FFD14C] font-bold mt-0.5">▸</span>
                    <span>
                      <strong>{isEn ? 'Offline HTML5 Canvas Engine:' : 'Động cơ HTML5 Canvas 100% Offline:'}</strong>{' '}
                      {isEn 
                        ? 'Renders at 60fps standalone with Vis-Network, requiring zero external server dependencies.'
                        : 'Kết xuất đồ họa 60fps mượt mà qua Vis-Network, hoạt động độc lập không phụ thuộc kết nối internet ngoài.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ED9040] dark:text-[#FFD14C] font-bold mt-0.5">▸</span>
                    <span>
                      <strong>{isEn ? 'Transactional Flow Direction:' : 'Định hướng luồng giao dịch:'}</strong>{' '}
                      {isEn 
                        ? 'Edges indicate strict relational dependency direction from consumers to root domain entities.'
                        : 'Đồ thị thể hiện chính xác chiều phụ thuộc từ thực thể tiêu thụ về thực thể gốc.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Iframe Showcase Card */}
          <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <GitBranch className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>Interactive Architecture Graph (7 Apps, Models & Foreign Keys)</span>
              </div>
              <a
                href="/library-bus/architecture-graph.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#0D7287]" />
                <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
              </a>
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

      {/* Tab 2: Explanation & Concentric Architecture Radar */}
      {activeShowcaseTab === 'understand-radar' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Detailed Explanation: Functionality & Structure */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#0D7287]/10 text-[#0D7287] dark:bg-[#0D7287]/20 dark:text-[#9BE7FA]">
                  <Layers className="w-4 h-4" />
                </span>
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {isEn 
                    ? '2. Concentric Radar Map: Functionality & Structural Overview' 
                    : '2. Bản Đồ Radar Vòng Tròn Đồng Tâm: Chức Năng & Cấu Trúc Chi Tiết'}
                </h4>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#C8EEF7]/50 text-[#0D7287] border border-[#9BE7FA]/40 dark:bg-slate-800 dark:text-[#9BE7FA]">
                {isEn ? 'Clean / Onion Architecture Radial Layout' : 'Mô Hình Phân Tầng Clean / Onion Architecture'}
              </span>
            </div>

            {/* 2-Column Grid: Chức Năng vs Cấu Trúc */}
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              {/* Column 1: Chức Năng Tương Tác */}
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
                        ? 'Follow the 7-step tour from system init (settings.py), ORM models, locking engine, Celery workers to UI templates.'
                        : 'Theo dõi 7 bước tuần tự từ settings.py, models, Celery worker đến giao diện người dùng.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold mt-0.5">▸</span>
                    <span>
                      <strong>{isEn ? 'Inspect 702 Code Nodes:' : 'Khám phá chi tiết 702 tệp mã nguồn:'}</strong>{' '}
                      {isEn 
                        ? 'Click any dot on the radar to inspect exact file paths, class/function names, and functional responsibilities.'
                        : 'Nhấp vào một điểm trên bản đồ để xem chi tiết đường dẫn, tên hàm và vai trò nghiệp vụ.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold mt-0.5">▸</span>
                    <span>
                      <strong>{isEn ? 'Auto-adapting Inspector & Quick Focus:' : 'Bảng Inspector tự co giãn & Phóng to 1 chạm:'}</strong>{' '}
                      {isEn 
                        ? 'Cards adapt cleanly to text length without scrollbars; click key source files to pan and zoom directly.'
                        : 'Thẻ giải thích tự động co giãn; nhấp vào tệp mã nguồn để camera zoom thẳng đến node tương ứng.'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Column 2: Cấu Trúc Kỹ Thuật */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3 dark:bg-slate-950 dark:border-slate-800/80">
                <div className="flex items-center gap-2 font-black uppercase tracking-wider text-[#ED9040] dark:text-[#FFD14C]">
                  <Cpu className="w-4 h-4" />
                  <span>{isEn ? 'Architecture & Layer Structure' : 'Cấu Trúc Phân Tầng & Hình Học'}</span>
                </div>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ED9040] dark:text-[#FFD14C] font-bold mt-0.5">▸</span>
                    <span>
                      <strong>{isEn ? '6 Concentric Clean Architecture Rings:' : '6 Vòng Tròn Đồng Tâm (Clean Architecture):'}</strong>
                      <div className="mt-1 grid grid-cols-2 gap-1 text-[11px] font-mono">
                        <span className="text-sky-600 dark:text-sky-400">• Vòng 1: Core & Config (30)</span>
                        <span className="text-emerald-600 dark:text-emerald-400">• Vòng 2: Models & DB (32)</span>
                        <span className="text-amber-600 dark:text-amber-400">• Vòng 3: Services & Tasks (7)</span>
                        <span className="text-indigo-600 dark:text-indigo-400">• Vòng 4: Views & Controllers (32)</span>
                        <span className="text-purple-600 dark:text-purple-400">• Vòng 5: Testing & Docs (20)</span>
                        <span className="text-rose-600 dark:text-rose-400">• Vòng 6: Frontend Templates (114)</span>
                      </div>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ED9040] dark:text-[#FFD14C] font-bold mt-0.5">▸</span>
                    <span>
                      <strong>{isEn ? 'Strict Polar Coordinates (r, θ):' : 'Tọa độ cực Polar Projection (r, θ):'}</strong>{' '}
                      {isEn 
                        ? 'Nodes are mathematically locked onto designated concentric orbits, eliminating clutter and preserving architectural tiers.'
                        : 'Các node được khóa cố định theo hình học, loại bỏ sự lộn xộn và giữ đúng trật tự tầng.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ED9040] dark:text-[#FFD14C] font-bold mt-0.5">▸</span>
                    <span>
                      <strong>{isEn ? 'Dependency Rule Enforcement:' : 'Nguyên tắc bất biến phụ thuộc:'}</strong>{' '}
                      {isEn 
                        ? 'Inner layers contain pure business rules and domain models, completely decoupled from outer UI templates.'
                        : 'Tầng bên trong chứa luật nghiệp vụ thuần túy, hoàn toàn độc lập với giao diện bên ngoài.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Iframe Showcase Card */}
          <div className="rounded-3xl bg-white border-2 border-slate-200 shadow-md overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            <div className="p-4 bg-[#C8EEF7]/30 border-b border-slate-200/80 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Layers className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                <span>Concentric Architecture Radar: Bản đồ Vòng Tròn Đồng Tâm</span>
              </div>
              <a
                href="/library-bus/understand_dashboard.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs dark:bg-slate-700 dark:text-white dark:border-slate-600"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#0D7287]" />
                <span>{isEn ? 'Open Fullscreen' : 'Mở toàn màn hình'}</span>
              </a>
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
    </section>
  );
}

export default Chapter3InteractiveShowcase;
