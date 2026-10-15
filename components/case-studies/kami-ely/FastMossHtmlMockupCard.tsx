'use client';

import React from 'react';
import { Maximize2, ArrowUpRight } from 'lucide-react';

export interface FastMossHtmlMockupCardProps {
  screenshotId: string;
  caption?: string;
  onOpenProofModal?: (_screenshotId?: string) => void;
  isEn?: boolean;
  className?: string;
}

export default function FastMossHtmlMockupCard({
  screenshotId,
  caption,
  onOpenProofModal,
  isEn = false,
  className = ''
}: FastMossHtmlMockupCardProps) {
  const handleClick = () => {
    if (onOpenProofModal) {
      onOpenProofModal(screenshotId);
    }
  };

  const renderMockupContent = () => {
    switch (screenshotId) {
      // 073329: All-Time Store Overview
      case '073329':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-sky-400">FASTMOSS • SHOP ID: 7494498...</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                RANK #259 CATEGORY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase">Total GMV (All-Time)</div>
                <div className="text-lg font-black text-sky-400 mt-0.5">31,6 Tỉ ₫</div>
                <div className="text-xs text-slate-500 mt-0.5">Cumulative Sales</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase">Total Units Sold</div>
                <div className="text-lg font-black text-emerald-400 mt-0.5">238,4k SP</div>
                <div className="text-xs text-slate-500 mt-0.5">238,2k on Collab</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                <div className="text-slate-400">Shoppable LIVE</div>
                <div className="text-xs font-bold text-white mt-0.5">12,4k phiên</div>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                <div className="text-slate-400">Shoppable Videos</div>
                <div className="text-xs font-bold text-white mt-0.5">11,2k video</div>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                <div className="text-slate-400">Network KOCs</div>
                <div className="text-xs font-bold text-white mt-0.5">6,0k Creators</div>
              </div>
            </div>

            <div className="p-2 rounded bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 flex items-center justify-between">
              <span>Verified Store: Kami Ely Vietnam</span>
              <span className="font-bold text-white">Active Catalog: 179 SKUs</span>
            </div>
          </div>
        );

      // 073418: 180-Day Store Detail & Data Warehouse ELT
      case '073418':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-[11px] font-bold text-indigo-300">DATA OVERVIEW • 180 DAYS</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                18.778 ROWS
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">180d Verified Gross GMV</div>
                <div className="text-base font-black text-white mt-0.5">12.735.128.067 VNĐ</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Units Sold</div>
                <div className="text-base font-black text-emerald-400 mt-0.5">85.500 SP</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Daily Average (180d)</span>
                <span className="font-bold text-sky-300">70,75 Triệu đ / ngày (475 SP)</span>
              </div>
              <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">All-Time Peak (16/06)</span>
                <span className="font-bold text-emerald-400">315,05 Tr đ (1.936 SP)</span>
              </div>
              <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">All-Time Trough (04/09)</span>
                <span className="font-bold text-rose-400">5,44 Tr đ (49 SP)</span>
              </div>
            </div>

            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
              <span>ETL Regex Match: (180 ng y) .xlsx</span>
              <span className="font-bold">Zero Manual Fixes</span>
            </div>
          </div>
        );

      // 073520: 90-Day Channel Attribution & Showcase Product Card
      case '073520':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[11px] font-bold text-amber-300">CHANNEL BREAKDOWN • 90 DAYS</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                6,14 TỈ Đ TOTAL
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sky-300 block">Kênh Chính Chủ (@kamielyhn)</span>
                  <span className="text-xs text-slate-400">20.027 SP • 49,76% sản lượng</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sky-400">3,03 Tỉ ₫</div>
                  <div className="text-xs text-sky-300 font-bold">49,31% GMV</div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-300 block">Mạng Lưới Affiliate (5.712 KOC)</span>
                  <span className="text-xs text-slate-400">11.572 SP • 28,75% sản lượng</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">1,71 Tỉ ₫</div>
                  <div className="text-xs text-emerald-300 font-bold">27,84% GMV</div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-300 block">Thẻ Sản Phẩm / Kệ Hàng (Showcase)</span>
                  <span className="text-xs text-slate-400">8.630 SP • 21,49% sản lượng</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-400">1,40 Tỉ ₫</div>
                  <div className="text-xs text-amber-300 font-bold">22,85% GMV</div>
                </div>
              </div>
            </div>

            <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-400 flex justify-between">
              <span>Reconciled Sum: 40.229 SP</span>
              <span className="text-white font-bold">100% Khớp Seller Center</span>
            </div>
          </div>
        );

      // 080547: 180-Day GMV Curve & Monthly Index
      case '080547':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-300">180-DAY TIME-SERIES CURVE</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                -82,9% SỤT GIẢM T8
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Tháng 4 (Tăng tốc)</div>
                <div className="text-sm font-bold text-sky-400 mt-0.5">2,46 Tỉ ₫</div>
                <div className="text-slate-500">Index: 258,9</div>
              </div>
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-emerald-300 font-bold">Tháng 6 (Đỉnh hè)</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">3,77 Tỉ ₫</div>
                <div className="text-emerald-300">Index: 397,2</div>
              </div>
              <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30">
                <div className="text-rose-300 font-bold">Tháng 8 (Vực thẳm)</div>
                <div className="text-sm font-black text-rose-400 mt-0.5">645,5 Tr ₫</div>
                <div className="text-rose-300">Index: 68,0</div>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Khán giả tại Hà Nội (Hết mùa biển):</span>
                <span className="font-bold text-amber-400">43% Followers</span>
              </div>
              <div className="flex justify-between">
                <span>Tỷ trọng Đồ bơi trong cơ cấu shop:</span>
                <span className="font-bold text-sky-400">69,31% GMV</span>
              </div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs text-slate-400 flex justify-between">
              <span>Đỉnh: 16/06 (315M ₫ / 1.936 SP)</span>
              <span>Đáy: 04/09 (5,4M ₫ / 49 SP)</span>
            </div>
          </div>
        );

      // 073657: 5,713 Creators & Pareto Distribution
      case '073657':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                <span className="text-[11px] font-bold text-pink-300">KOC PARETO AUDIT • 90 DAYS</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20 font-bold">
                5.713 KOCS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-xs text-slate-400">KOC Có Đơn (Active)</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">292 KOCs (5,1%)</div>
                <div className="text-xs text-emerald-300">4,73 Tỉ ₫ Doanh số</div>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
                <div className="text-xs text-slate-400">KOC Ngủ Đông (Dormant)</div>
                <div className="text-base font-bold text-rose-400 mt-0.5">5.421 KOCs (94,9%)</div>
                <div className="text-xs text-rose-300">0 đơn phát sinh</div>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-amber-300">Top 1 KOC (@girlstyle.vn):</span>
                <span className="text-white">732,77 Tr ₫ (5.009 SP)</span>
              </div>
              <div className="text-xs text-slate-400">
                Gánh 42,9% GMV toàn mạng lưới Affiliate (Top 1% = 91,49% GMV)
              </div>
            </div>

            <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-400 flex justify-between">
              <span>Followers &lt;5k (Nano/Micro):</span>
              <span className="text-emerald-400 font-bold">Gánh 96,09% GMV Ngoài</span>
            </div>
          </div>
        );

      // 080553: 222 Self-Operated Videos & Title Text Mining
      case '080553':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-[11px] font-bold text-cyan-300">@KAMIELYHN • 222 VIDEOS</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                870,2 TR Đ GMV
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Tổng Views</div>
                <div className="text-xs font-bold text-white mt-0.5">7,97M</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Sản phẩm bán</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">5.144 SP</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Video có đơn</div>
                <div className="text-xs font-bold text-sky-400 mt-0.5">101 (45,5%)</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 flex justify-between">
                <div>
                  <div className="font-bold text-emerald-300">#1 "Chính Thức Mở Bán_ Croptop yếm..."</div>
                  <div className="text-slate-400">529.000 views • 856 SP</div>
                </div>
                <div className="font-bold text-emerald-400 text-right">170,16 Tr ₫</div>
              </div>

              <div className="p-2 rounded bg-sky-500/10 border border-sky-500/30 flex justify-between">
                <div>
                  <div className="font-bold text-sky-300">#2 "| BEACH READY FIT_ Set bikini..."</div>
                  <div className="text-slate-400">755.000 views • 288 SP</div>
                </div>
                <div className="font-bold text-sky-400 text-right">56,93 Tr ₫</div>
              </div>
            </div>

            <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-400 flex justify-between">
              <span>GPM Nhóm Hook "Mở Bán":</span>
              <span className="text-white font-bold">Gấp 3,2x Tiêu đề thường</span>
            </div>
          </div>
        );

      // 080510: 475 LIVE Sessions & Anomaly Detection
      case '080510':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[11px] font-bold text-amber-300">LIVE ANOMALY DETECTOR • 475 PHIÊN</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                95,58% RA ĐƠN
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30">
                <div className="font-bold text-rose-300">Bẫy Số Lượng (09/04)</div>
                <div className="text-sm font-bold text-white mt-0.5">106 phiên LIVE</div>
                <div className="text-rose-400 font-bold">749k đ / phiên (79,46 Tr)</div>
              </div>
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30">
                <div className="font-bold text-emerald-300">Điểm Tối Ưu (25/06)</div>
                <div className="text-sm font-bold text-white mt-0.5">45 phiên LIVE</div>
                <div className="text-emerald-400 font-bold">4,36 Tr đ / phiên (196 Tr)</div>
              </div>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Chênh lệch hiệu suất phiên:</span>
                <span className="font-bold text-emerald-400">Gấp 5,8x (Chất lượng &gt; Số lượng)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phân vị Lượt xem LIVE:</span>
                <span className="font-bold text-white">Median: 948 vs Mean: 2.400 views</span>
              </div>
            </div>

            <div className="p-1.5 rounded bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 flex justify-between">
              <span>Đỉnh Marathon (16/06):</span>
              <span className="font-bold">272,1 Tr đ / 1.850 SP</span>
            </div>
          </div>
        );

      // 080124: 4.5x GPM Paradox & LIVE Entry Funnel
      case '080124':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                <span className="text-[11px] font-bold text-pink-300">GPM PARADOX & ENTRY FUNNEL</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20 font-bold">
                VIDEO 4,5X LIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-pink-500/10 border border-pink-500/30">
                <div className="text-xs text-slate-400">Shoppable Video GPM</div>
                <div className="text-lg font-black text-pink-400 mt-0.5">135,2k ₫</div>
                <div className="text-xs text-pink-300">/ 1.000 views (28 ngày)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Livestream GPM</div>
                <div className="text-lg font-black text-slate-300 mt-0.5">30,2k ₫</div>
                <div className="text-xs text-slate-500">/ 1.000 views (208 phiên)</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 flex justify-between">
                <span className="text-rose-300">Bảng tin - Ô Live (46% PV):</span>
                <span className="font-bold text-rose-400">5,09% Vào phòng (95% bỏ qua)</span>
              </div>
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 flex justify-between">
                <span className="text-emerald-300">Nguồn Tìm Kiếm (43% PV):</span>
                <span className="font-bold text-emerald-400">25,68% Vào phòng (Gấp 5x)</span>
              </div>
            </div>

            <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-400 flex justify-between">
              <span>Paid Ads Share in Video:</span>
              <span className="text-amber-400 font-bold">94,70% GMV (2,056 Tỉ đ)</span>
            </div>
          </div>
        );

      // 080800: Collaborative Stores & Catalog Matrix
      case '080800':
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-300">4 COLLABORATIVE STORES</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                9,2 TỈ Đ ALL-TIME
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded bg-sky-500/10 border border-sky-500/30 flex justify-between">
                <span className="font-bold text-sky-300">#1 Kami Ely Official Store:</span>
                <span className="font-bold text-white">9,1 Tỉ ₫ (69.245 SP)</span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between text-slate-400">
                <span>#2 Havi Bikini Store:</span>
                <span className="text-slate-200">71,8 Tr ₫ (479 SP)</span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800 flex justify-between text-slate-400">
                <span>#3 KamiBiii Store:</span>
                <span className="text-slate-200">6,2 Tr ₫ (42 SP)</span>
              </div>
            </div>

            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-amber-300">Vùng Giá Vàng (100k - 200k):</span>
                <span className="text-white">67,37% Doanh Thu</span>
              </div>
              <div className="text-slate-400">Hero SKU CV11 dẫn đầu toàn shop với 6.375 đơn bán</div>
            </div>

            <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-400 flex justify-between">
              <span>Dead Stock (0 đơn bán):</span>
              <span className="text-rose-400 font-bold">197 / 331 SKUs (59,5%)</span>
            </div>
          </div>
        );

      // 073543: LIVE Funnel Diagnostic Telemetry
      case '073543':
      default:
        return (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-[11px] font-bold text-cyan-300">LIVE WORKBENCH TELEMETRY</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                SELLER CENTER
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Lượt Xem Phòng (PV)</div>
                <div className="text-base font-bold text-white mt-0.5">3,29M Views</div>
                <div className="text-emerald-400">TB 6.932 views/phiên</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">A/B Testing Live Ads</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">5,73M ₫ / giờ</div>
                <div className="text-sky-300">Tăng tốc độ bán 3,16x</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Hợp nhất Live (Live Merge 2% PV):</span>
                <span className="font-bold text-emerald-400">41,41% Vào phòng (Đỉnh CVR)</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Ghim #1 Hero SKU Chân Váy CV11:</span>
                <span className="font-bold text-amber-300">130 đơn = 20,34 Tr ₫ (98,5%)</span>
              </div>
            </div>

            <div className="p-1.5 rounded bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 flex justify-between">
              <span>Độ dài phiên khuyến nghị:</span>
              <span className="font-bold">3h – 3h30p (Tránh bão hòa)</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`rounded-2xl border border-slate-800 bg-slate-950 p-4 hover:border-sky-500/50 transition cursor-pointer group flex flex-col justify-between space-y-3 ${className}`}
    >
      {/* CARD TOP META */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-900 text-sky-400 border border-slate-800">
            📊 HTML TELEMETRY #{screenshotId}
          </span>
          <span className="text-xs text-emerald-400 font-mono hidden sm:inline">
            ✓ Ground Truth
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-sky-400 group-hover:text-sky-300 transition">
          <Maximize2 className="w-3 h-3" />
          <span>{isEn ? 'Modal' : 'Phóng to'}</span>
        </span>
      </div>

      {/* DYNAMIC HTML TELEMETRY CARD */}
      <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 group-hover:border-slate-700 transition">
        {renderMockupContent()}
      </div>

      {/* CARD FOOTER CAPTION */}
      {caption && (
        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="line-clamp-1">{caption}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
        </div>
      )}
    </div>
  );
}
