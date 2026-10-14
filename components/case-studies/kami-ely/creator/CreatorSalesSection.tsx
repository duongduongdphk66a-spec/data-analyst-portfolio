'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Radio,
  Video,
  ShoppingBag,
  Award,
  Sparkles,
  ShieldCheck,
  Eye,
  Link as LinkIcon,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  creator180dTelemetry,
  creatorSalesCapacity,
  creatorCollaborativeStores
} from '@/app/data/kamiElyData';

interface CreatorSalesSectionProps {
  isEn: boolean;
  copyDeepLink: (_id: string, _name?: string) => void;
  openProofScreenshot: (_id: string) => void;
  handleTabChange: (_tab: 'science' | 'shop' | 'creator') => void;
  collaborativeStores?: any;
}

export default function CreatorSalesSection({
  isEn,
  copyDeepLink,
  openProofScreenshot,
  handleTabChange,
  collaborativeStores: _collaborativeStores
}: CreatorSalesSectionProps) {
  const [crSalesMetric, setCrSalesMetric] = useState<'gmv' | 'units'>('gmv');

  return (
    <div className="space-y-16">
      {/* GROUP DIVIDER: NĂNG LỰC THƯƠNG MẠI & TẬP TRUNG THƯƠNG HIỆU */}
      <div className="pt-6 pb-2 flex items-center gap-4">
        <div className="h-px bg-gradient-to-r from-transparent via-[#FFD14C] to-transparent flex-1 dark:via-slate-700" />
        <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FFE485] text-slate-950 border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700 shadow-xs">
          {isEn ? 'Group III: Commercial Capacity & Exclusive Monopolization' : 'Nhóm III: Năng Lực Thương Mại & Mức Độ Tập Trung Thương Hiệu'}
        </span>
        <div className="h-px bg-gradient-to-r from-transparent via-[#FFD14C] to-transparent flex-1 dark:via-slate-700" />
      </div>

      {/* 2.6 PHÂN TÍCH DOANH SỐ & VIỄN TRẮC 180 NGÀY (SALES TELEMETRY 180-DAY) */}
      <section id="creator-sales" className="space-y-6 scroll-mt-36">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#FFD14C] text-slate-950 rounded-lg text-xs font-black uppercase">
              2.6
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
              {isEn ? 'Sales Analysis & 180-Day Telemetry' : 'Phân Tích Doanh Số & Dữ Liệu Viễn Trắc 180 Ngày'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openProofScreenshot('sc-080501')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#FFE485] text-slate-950 hover:bg-[#FFD14C] transition-colors border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700 cursor-pointer"
              title={isEn ? 'View FastMoss Proof #080501-#080640' : 'Xem Bằng Chứng FastMoss #080501-#080640'}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>FastMoss #080501-#080640</span>
            </button>
            <button
              onClick={() => copyDeepLink('creator-sales', '2.6 Phân tích doanh số')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              title="Sao chép liên kết"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 180-Day Creator Telemetry Ribbon */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#C8EEF7]/40 via-white to-[#FFE485]/30 border border-[#9BE7FA] dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                {isEn ? 'Comprehensive 180-Day Creator Metrics (FastMoss Telemetry)' : 'Tổng Hợp Chỉ Số Kênh 180 Ngày Gần Nhất (FastMoss Telemetry)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? 'Timeframe: 2024/03/09 - 2024/09/04 · Consolidated from 13 Bi-weekly Telemetry Points' : 'Thời gian: 09/03/2024 - 04/09/2024 · Trích xuất từ 13 điểm viễn trắc 2 tuần liên tục'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Verified Telemetry</span>
            </div>
          </div>

          {/* KPI Ribbon Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-white border border-[#FFD14C] text-center dark:bg-slate-950 dark:border-slate-800">
              <div className="text-lg font-black text-slate-950 dark:text-[#FFD14C]">{creator180dTelemetry.totalGmv}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? '180d GMV' : 'Doanh số 180d'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#9BE7FA] text-center dark:bg-slate-950 dark:border-slate-800">
              <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">{creator180dTelemetry.totalUnitsSold}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? 'Units Sold' : 'Sản phẩm bán'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-950 dark:border-slate-800">
              <div className="text-lg font-black text-slate-950 dark:text-white">{creator180dTelemetry.totalVideoViews}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? 'Video Views' : 'Lượt xem video'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-950 dark:border-slate-800">
              <div className="text-lg font-black text-rose-600 dark:text-rose-400">{creator180dTelemetry.likes}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? 'Likes' : 'Lượt thích'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-950 dark:border-slate-800">
              <div className="text-lg font-black text-amber-600 dark:text-amber-400">{creator180dTelemetry.saves}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? 'Saves' : 'Lưu trữ'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-950 dark:border-slate-800">
              <div className="text-lg font-black text-blue-600 dark:text-blue-400">{creator180dTelemetry.shares}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? 'Shares' : 'Chia sẻ'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-emerald-300 text-center dark:bg-slate-950 dark:border-slate-800">
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{creator180dTelemetry.followerGrowth}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{isEn ? 'Follower Net' : 'Tăng Follow'}</div>
            </div>
          </div>
        </div>

        {/* LIVE vs Video vs Showcase Commercial Distribution */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#FFD14C] shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-xs font-bold border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C]">
                LIVE Channel (84.5%)
              </span>
              <Radio className="w-5 h-5 text-[#0D7287] dark:text-[#FFD14C]" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-950 dark:text-white">
                {creator180dTelemetry.liveSales.gmv}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {creator180dTelemetry.liveSales.units} ({creator180dTelemetry.liveSales.shareUnits} sản lượng)
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
              {isEn 
                ? 'The core revenue engine. Live sessions achieve highest conversion by letting viewers see bikini fitting on-screen with real-time size recommendations.' 
                : 'Kênh chốt đơn chủ lực. Livestream tỷ lệ chuyển đổi cao do người xem nhìn trực tiếp form dáng trên mẫu thật và được tư vấn size.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA] shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8EEF7] text-[#0D7287] text-xs font-bold border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA]">
                Shoppable Video (15.0%)
              </span>
              <Video className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#0D7287] dark:text-[#9BE7FA]">
                {creator180dTelemetry.videoSales.gmv}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {creator180dTelemetry.videoSales.units} ({creator180dTelemetry.videoSales.shareUnits} sản lượng)
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
              {isEn 
                ? 'Top-of-funnel brand amplifier. 6.6M views generate continuous organic discovery and long-tail purchases even when creator is offline.' 
                : 'Phễu lan tỏa thương hiệu. 6.6M lượt xem tạo dòng traffic tự nhiên và đem lại doanh số ổn định ngay cả khi không live.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold dark:bg-slate-800 dark:text-slate-400">
                Showcase / Trưng bày (0%)
              </span>
              <ShoppingBag className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-400">
                {creator180dTelemetry.showcaseSales.gmv}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {creator180dTelemetry.showcaseSales.units}
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
              {isEn 
                ? 'Showcase tab is entirely unmonetized. Creator focuses 100% of commercial attention on dynamic interactive channels (Live & Shoppable Video).' 
                : 'Tủ trưng bày không phát sinh doanh thu. 100% tài nguyên tập trung vào các kênh tương tác (Livestream và Video).'}
            </p>
          </div>
        </div>

        {/* 180-Day Bi-Weekly GMV Trajectory Chart */}
        <div className="p-6 rounded-3xl bg-white border border-[#FFD14C] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#0D7287] dark:text-[#FFD14C]" />
                {isEn ? '180-Day Bi-Weekly GMV Trajectory & Peak Analysis' : 'Quỹ Đạo Doanh Số GMV 180 Ngày (Chu Kỳ 2 Tuần) & Phân Tích Đỉnh Cao'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? 'Data plotted from 14 sequential FastMoss bi-weekly captures (Screenshots 080501 - 080640)' : 'Dữ liệu được vẽ từ 14 mốc chụp viễn trắc FastMoss liên tục (Ảnh 080501 - 080640)'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FFFDF5] text-slate-900 text-xs font-bold border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C]">
              {isEn ? 'Summer Peak: Jun 10 - Jun 23 (1,061.6M đ)' : 'Đỉnh mùa hè: 10/06 - 23/06 (1.061,6 Triệu đ)'}
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={creator180dTelemetry.trajectory} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
                <defs>
                  <linearGradient id="creatorGmvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD14C" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFE485" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="dateRange" stroke="#64748B" fontSize={10} angle={-25} textAnchor="end" tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}M`} />
                <Tooltip 
                  formatter={(val: any, _name: any, item: any) => [
                    `${Number(val).toLocaleString()} Triệu đ (${item?.payload?.units?.toLocaleString()} SP)`,
                    'Doanh Số (GMV)'
                  ]}
                />
                <Area type="monotone" dataKey="gmv" stroke="#0D7287" strokeWidth={3} fillOpacity={1} fill="url(#creatorGmvGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Category Sales Capacity (Screenshots 081026 & 081041) */}
        <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                {isEn ? 'Category Commercial Capacity & Dominance' : 'Năng Lực Bán Hàng Theo Ngành Hàng (Category Capacity)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? 'FastMoss Screenshot 081026 (GMV) & 081041 (Units)' : 'Trích xuất từ ảnh FastMoss #081026 (Doanh số) và #081041 (Sản lượng)'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openProofScreenshot('sc-081026')}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#C8EEF7] text-[#0D7287] hover:bg-[#9BE7FA] transition-colors border border-[#9BE7FA] dark:bg-slate-800 dark:text-[#9BE7FA] cursor-pointer"
              >
                FastMoss #081026
              </button>
              <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800 shrink-0">
                <button 
                  onClick={() => setCrSalesMetric('gmv')} 
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${crSalesMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  GMV
                </button>
                <button 
                  onClick={() => setCrSalesMetric('units')} 
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${crSalesMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  {isEn ? 'Units' : 'Sản lượng'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-2">
            <div className="md:col-span-2 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={creatorSalesCapacity[crSalesMetric]} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={155} />
                  <Tooltip formatter={(value, _name, item: any) => [item?.payload?.label || `${value}%`, crSalesMetric === 'gmv' ? 'Doanh số GMV' : 'Sản lượng']} />
                  <Bar dataKey="value" fill="#0D7287" radius={[0, 6, 6, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF5] to-[#FFE485]/20 border border-[#FFE485] border-l-4 border-l-[#FFD14C] shadow-xs flex flex-col justify-center space-y-3 text-xs sm:text-sm dark:bg-slate-800/60 dark:border-slate-700 dark:border-l-[#FFD14C]">
              <div className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD14C]" />
                {isEn ? 'Niche Monopoly Effect' : 'Hiệu Ứng Thống Trị Ngách'}
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Ngành <strong>Thể thao & Hoạt động ngoài trời (Sports & Outdoor)</strong> chiếm áp đảo tuyệt đối với <strong>98.92% GMV (5,7 Tỷ đ)</strong> và <strong>99.07% sản lượng (39.0k SP)</strong>.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Creator chỉ tập trung vào đồ bơi và phụ kiện biển, đưa kênh thành lựa chọn số 1 cho người mua tìm kiếm đồ bơi chất lượng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.7 CỬA HÀNG HỢP TÁC PHÂN PHỐI (TOP COLLABORATIVE STORES) */}
      <section id="creator-collaborative" className="space-y-6 scroll-mt-36">
        <SectionHeader 
          badge="2.7" 
          title={isEn ? "Top Collaborative Brand Stores" : "Các Cửa Hàng Hợp Tác Phân Phối Của Creator"} 
          id="creator-collaborative" 
          onCopy={copyDeepLink} 
          badgeBg="bg-[#FFD14C] text-slate-950" 
          extraAction={
            <button
              onClick={() => openProofScreenshot('sc-081121')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#FFE485] text-slate-950 hover:bg-[#FFD14C] transition-colors border border-[#FFD14C] dark:bg-slate-800 dark:text-[#FFD14C] dark:border-slate-700 cursor-pointer"
              title={isEn ? 'View FastMoss Proof #081121' : 'Xem Bằng Chứng FastMoss #081121'}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>FastMoss #081121</span>
            </button>
          } 
        />

        {/* Collaborative Stores Table & Brand Concentration */}
        <div className="space-y-4">
          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#FFD14C] bg-white shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFE485]/30 text-slate-800 font-bold uppercase border-b border-[#FFE485]/60 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Cửa Hàng Đối Tác</th>
                  <th className="p-3.5">Đã Bán (Sản lượng)</th>
                  <th className="p-3.5">Tỷ Lệ Sản Lượng</th>
                  <th className="p-3.5">Doanh Số (GMV)</th>
                  <th className="p-3.5">Tỷ Trọng GMV</th>
                  <th className="p-3.5">Phiên LIVE</th>
                  <th className="p-3.5">Video Gắn Giỏ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {creatorCollaborativeStores.map((s, i) => (
                  <tr key={i} className={`hover:bg-[#FFE485]/10 transition-colors dark:hover:bg-slate-800/50 ${i === 0 ? 'bg-[#FFFDF5] dark:bg-slate-800/40 font-bold' : ''}`}>
                    <td className="p-3.5 flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-[#0D7287] text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {i + 1}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{s.storeName}</span>
                      {i === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-[10px] font-extrabold border border-[#FFD14C]">
                          {isEn ? 'Flagship Store' : 'Shop Chính Chủ'}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{s.unitsSold}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono">{s.unitsShare}</td>
                    <td className="p-3.5 font-bold text-[#0D7287] dark:text-[#FFD14C]">{s.gmv}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white font-mono">{s.gmvShare}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono">{s.liveSessions}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono">{s.videosCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {creatorCollaborativeStores.map((s, i) => (
              <div key={i} className={`p-4 rounded-2xl border shadow-xs space-y-2.5 transition-colors ${
                i === 0 
                  ? 'bg-[#FFFDF5] border-[#FFD14C] dark:bg-slate-800/80 dark:border-[#FFD14C]' 
                  : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-[#0D7287] text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {i + 1}
                    </span>
                    <span className="font-black text-sm text-slate-950 dark:text-white">{s.storeName}</span>
                  </div>
                  {i === 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFE485] text-slate-950 text-[10px] font-extrabold border border-[#FFD14C]">
                      {isEn ? 'Flagship Store' : 'Shop Chính Chủ'}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">{isEn ? 'Units Sold' : 'Sản lượng'}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{s.unitsSold} ({s.unitsShare})</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">{isEn ? 'GMV' : 'Doanh số'}</div>
                    <div className="font-black text-[#0D7287] dark:text-[#FFD14C]">{s.gmv} ({s.gmvShare})</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">{isEn ? 'LIVE Sessions' : 'Phiên LIVE'}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{s.liveSessions}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">{isEn ? 'Videos' : 'Video gắn giỏ'}</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{s.videosCount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Brand Concentration Analysis Callout */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FFFDF5] via-[#C8EEF7]/20 to-[#FFE485]/30 border border-[#FFD14C] border-l-4 border-l-[#FFD14C] shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between dark:bg-slate-900 dark:border-slate-800 dark:border-l-[#FFD14C]">
            <div className="space-y-2">
              <div className="font-black text-slate-950 dark:text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
                {isEn ? 'Monopoly Brand Commitment (98.92% Revenue Concentration)' : 'Mức Độ Tập Trung Thương Hiệu Tuyệt Đối (98.92% GMV)'}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
                {isEn 
                  ? 'Out of 9.2B VND total GMV, 9.1B is exclusively generated for Kami Ely. This proves @kamielyhn is the core brand owner, not just a general affiliate reseller.' 
                  : 'Trong 9,2 Tỷ GMV, có tới 9,1 Tỷ đến từ Kami Ely. Điều này khẳng định @kamielyhn là chủ thương hiệu đích thực, không phải một KOC làm affiliate thông thường.'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#FFD14C] text-center shrink-0 w-full md:w-48 shadow-xs dark:bg-slate-950">
              <div className="text-3xl font-black text-[#0D7287] dark:text-[#FFD14C]">98.92%</div>
              <div className="text-[11px] text-slate-500 font-bold mt-1">Doanh Số Dành Cho Kami Ely</div>
            </div>
          </div>
        </div>
      </section>

      {/* CROSS-TAB NAVIGATION CTA */}
      <div className="pt-8 border-t border-[#FFE485]/60 dark:border-slate-800">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFFDF5] via-[#FFF9E6] to-[#FFE485]/40 border-2 border-[#FFD14C] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 dark:bg-gradient-to-br dark:from-[#041E24] dark:via-slate-900 dark:to-[#0D7287]/40 dark:border-[#9BE7FA] dark:shadow-xl transition-colors">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD14C] text-slate-950 text-xs font-black uppercase tracking-wider dark:bg-[#9BE7FA] dark:text-slate-950">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'STATISTICAL RIGOR & OPTIMIZATION' : 'CHUYÊN SÂU TOÁN THỐNG KÊ & TỐI ƯU'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
              {isEn 
                ? 'Read the 6-Part Applied Data Science Case Study' 
                : 'Đọc Nghiên Cứu Khoa Học Dữ Liệu & Thống Kê Suy Diễn (6 Phần)'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {isEn
                ? 'Mathematical validation, Tukey IQR outlier detection, Welch t-test on GPM, Polynomial regression on LIVE fatigue, STL seasonality, and linear programming.'
                : 'Kiểm định toán học, lọc dị biệt Tukey IQR, Welch t-test, hồi quy đa thức đo điểm bão hòa LIVE và bài toán tối ưu phân bổ dòng tiền.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                handleTabChange('science');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#0D7287] hover:bg-[#095262] text-white dark:bg-[#9BE7FA] dark:hover:bg-[#72dbf3] dark:text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isEn ? 'Explore Data Science Case Study' : 'Khám Phá Nghiên Cứu Data Science'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                handleTabChange('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#0D7287] text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 dark:text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isEn ? 'Return to Shop Analysis (Part 1)' : 'Quay Lại Phân Tích Shop (Phần 1)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
