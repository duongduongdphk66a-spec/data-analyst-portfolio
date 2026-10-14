'use client';

import React from 'react';
import { Sparkles, Award, Users, Lightbulb, ImageIcon } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  affiliateFollowerTiers,
  topAffiliatesList,
  shopAffiliateCategoryDistribution
} from '@/app/data/kamiElyData';

interface ShopAffiliateSectionProps {
  isEn: boolean;
  copyDeepLink: (_id: string) => void;
  openProofScreenshot: (_id: string) => void;
  affMetric: 'units' | 'gmv' | 'count';
  setAffMetric: (_m: 'units' | 'gmv' | 'count') => void;
  affCatMetric: 'units' | 'gmv' | 'count';
  setAffCatMetric: (_m: 'units' | 'gmv' | 'count') => void;
  topAffiliates?: any[];
  isLiveDb?: boolean;
}

export default function ShopAffiliateSection({
  isEn,
  copyDeepLink,
  openProofScreenshot,
  affMetric,
  setAffMetric,
  affCatMetric,
  setAffCatMetric,
  topAffiliates,
  isLiveDb
}: ShopAffiliateSectionProps) {
  const affList = topAffiliates && topAffiliates.length > 0 ? topAffiliates : topAffiliatesList;

  return (
    <section id="shop-affiliates" className="space-y-6 scroll-mt-36">
      <SectionHeader 
        badge="1.4" 
        title={isEn ? "Affiliate Network & KOC Performance" : "Mạng Lưới Tiếp Thị Liên Kết & KOC"} 
        id="shop-affiliates" 
        onCopy={copyDeepLink} 
        extraAction={
          <button
            onClick={() => openProofScreenshot('sc-073657')}
            className="text-xs px-2.5 py-1 rounded-lg bg-[#C8EEF7]/50 hover:bg-[#9BE7FA]/60 text-[#0D7287] font-bold flex items-center gap-1 border border-[#9BE7FA]/60 dark:bg-slate-800 dark:text-[#9BE7FA] dark:border-slate-700 cursor-pointer transition-all"
            title="Xem ảnh FastMoss gốc #073657, #073705, #073713"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ảnh FastMoss #073657-#073713</span>
          </button>
        } 
      />

      {/* In-House Satellite vs True External Affiliate Callout Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50 via-white to-sky-50 border-2 border-indigo-200 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 dark:border-indigo-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'DE-BIASING AFFILIATE DATA · IN-HOUSE SATELLITE DISCOVERY' : 'PHÁT HIỆN ĐẶC QUYỀN · BÓC TÁCH KÊNH VỆ TINH NỘI BỘ'}</span>
          </div>
          <span className="text-xs text-slate-500 font-mono font-bold">1 Team · 2 Kênh Live Song Song</span>
        </div>

        <div className="space-y-2 max-w-4xl">
          <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
            {isEn 
              ? 'Girl Style (@girlstyle.vn) is an In-House Satellite Channel, Not an External Affiliate!'
              : 'Girl Style (@girlstyle.vn) Là Kênh Vệ Tinh Trực Thuộc Shop, Không Phải Affiliate Ngoài!'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {isEn
              ? 'On FastMoss dashboards, Girl Style is classified as an affiliate with 42.9% of affiliate GMV (732.8M VND in 90d, 1.26B VND in Live 180d). However, operational audit confirms it is operated by the shop’s internal team. True external affiliates generate only 982M VND in Live (10.6% share), with 94.9% of 5,712 registered KOCs being completely dormant (0 orders).'
              : 'Báo cáo FastMoss gắn nhãn Girl Style là affiliate (chiếm 42,9% GMV creator 90N và 56,1% GMV Live affiliate 180N). Nhưng thực tế vận hành xác nhận Girl Style thuộc shop và do cùng 1 team in-house livestream. Khi bóc tách, mạng lưới affiliate ngoài thực thụ chỉ tạo 982 triệu VNĐ Live (10,6%), với 94,9% trong 5.712 KOC đăng ký hoàn toàn không ra đơn!'}
          </p>
        </div>

        {/* 6 Stat Badges: Format Disparity & Pareto Concentration */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-white border border-indigo-200 text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">{isEn ? 'In-House Live (2 Channels)' : 'Live Nội Bộ (2 Kênh)'}</div>
            <div className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">8,28 Tỷ ₫ (89.4%)</div>
            <div className="text-[10px] text-slate-400">Kami Ely + Girl Style</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">{isEn ? 'True External KOCs' : 'Live KOC Ngoài Thực'}</div>
            <div className="text-base font-black text-amber-600 dark:text-amber-400 mt-0.5">982,4 Tr ₫ (10.6%)</div>
            <div className="text-[10px] text-slate-400">6.321 phiên · 155k/phiên</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">{isEn ? 'Dormant KOCs (0 Orders)' : 'KOC "Ngủ Đông" (0 Đơn)'}</div>
            <div className="text-base font-black text-rose-500 mt-0.5">94,89%</div>
            <div className="text-[10px] text-slate-400">5.421 / 5.713 KOC</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">{isEn ? 'Active Converting KOCs' : 'KOC Ra Đơn Thực Tế'}</div>
            <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">292 KOC (5,11%)</div>
            <div className="text-[10px] text-slate-400">Top 1% gánh 91,49% GMV</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">{isEn ? 'Video vs LIVE KOCs' : 'KOC Video vs LIVE'}</div>
            <div className="text-base font-black text-[#0D7287] dark:text-[#9BE7FA] mt-0.5">5.4k vs 234</div>
            <div className="text-[10px] text-slate-400">95,9% KOC làm video</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold uppercase">{isEn ? 'Top External Tier' : 'Tier Ngoài Hiệu Quả Nhất'}</div>
            <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">10k – 50k Follow</div>
            <div className="text-[10px] text-slate-400">37.5% GMV ngoài · conv 7.8%</div>
          </div>
        </div>
      </div>

      {/* Follower Tiers Chart & Top KOC Table */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Distribution by Follower Tier' : 'Hiệu Quả Theo Tệp Follower'}</h3>
            <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800">
              <button onClick={() => setAffMetric('units')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${affMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số lượng</button>
              <button onClick={() => setAffMetric('gmv')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${affMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
              <button onClick={() => setAffMetric('count')} className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${affMetric === 'count' ? 'bg-[#FFE485] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số KOC</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={affiliateFollowerTiers[affMetric]} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                <XAxis type="number" domain={[0, 'auto']} stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis dataKey="tier" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={125} />
                <Tooltip />
                <Bar dataKey="value" fill="#0D7287" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top KOC Table */}
        <div className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FFD14C]" />
              {isEn ? 'Top Performing Affiliates' : 'Top KOC / Affiliates Tiêu Biểu'}
            </h3>
            {isLiveDb && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                MySQL Live
              </span>
            )}
          </div>
          <div className="space-y-2.5">
            {affList.map((aff) => (
              <div key={aff.id} className="p-3 rounded-2xl bg-[#FFFDF5] border border-[#FFE485]/50 flex items-center justify-between gap-3 dark:bg-slate-800/60 dark:border-slate-700/60">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{aff.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C8EEF7] text-[#0D7287] dark:bg-slate-700 dark:text-[#9BE7FA] font-bold">
                      @{aff.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {aff.followers.toLocaleString()} followers · Video GPM: {aff.videoGpm}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-[#0D7287] dark:text-[#FFD14C]">{aff.gmv.toLocaleString()} Triệu đ</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{aff.units.toLocaleString()} SP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KOC Category Distribution (FastMoss Screenshots 073657, 073705, 073713) */}
      <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="space-y-0.5">
            <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0D7287] dark:text-[#9BE7FA]" />
              {isEn ? 'Affiliate Network Industry Breakdown' : 'Cơ Cấu Ngành Hàng Của Mạng Lưới KOC Affiliate'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn ? 'Telemetry from FastMoss Screenshots 073657, 073705 & 073713' : 'Dữ liệu trích xuất từ chuỗi ảnh FastMoss #073657, #073705 & #073713'}
            </p>
          </div>
          <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800 shrink-0">
            <button onClick={() => setAffCatMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${affCatMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'Units' : 'Số lượng'}</button>
            <button onClick={() => setAffCatMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${affCatMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
            <button onClick={() => setAffCatMetric('count')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${affCatMetric === 'count' ? 'bg-[#FFE485] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>{isEn ? 'KOC Count' : 'Số KOC'}</button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 pt-2">
          <div className="md:col-span-2 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shopAffiliateCategoryDistribution[affCatMetric]} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={145} />
                <Tooltip formatter={(value, _name, item: any) => [item?.payload?.label || `${value}%`, affCatMetric === 'gmv' ? 'Doanh số' : affCatMetric === 'units' ? 'Sản lượng' : 'Số KOC']} />
                <Bar dataKey="value" fill="#0D7287" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF5] to-[#FFE485]/20 border border-[#FFE485]/70 border-l-4 border-l-[#FFD14C] flex flex-col justify-center space-y-3 text-xs dark:bg-slate-800/60 dark:border-slate-700 dark:border-l-[#FFD14C]">
            <div className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#FFD14C]" />
              Insight Ngành Hàng KOC
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              KOC thuộc nhóm <strong>Clothing & Accessories</strong> chỉ chiếm <strong>32.0% số lượng (315 KOC)</strong> nhưng tạo ra tới <strong>68.69% sản lượng (21.7k SP)</strong> và <strong>66.08% doanh số GMV (3,1 Tỷ đ)</strong>.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Nhóm <strong>Other</strong> chiếm tới 57.48% số KOC (566 KOC) nhưng chỉ đóng góp 28.83% GMV (1,3 Tỷ đ). Tỷ lệ chuyển đổi tập trung cao nhất ở các KOC chuyên ngành thời trang và làm đẹp.
            </p>
          </div>
        </div>
      </div>
      {/* 1.4.B KOC Risk Concentration & Follower Tier Dynamics */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-amber-50/30 border-2 border-amber-300/80 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 dark:border-amber-700/60 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 dark:text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/20">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{isEn ? 'KOC TIER AUDIT & VENDOR CONCENTRATION' : 'ĐỐI SOÁT PHÂN TẦNG KOC & RỦI RO TẬP TRUNG ĐƠN LẺ'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
              {isEn 
                ? 'Follower Tier Asymmetry vs. Single-Creator Vulnerability' 
                : 'Nghịch Lý Phân Tầng Follower: Nhóm <5k Gánh 96% GMV vs. Rủi Ro Phụ Thuộc 1 KOC'}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 text-amber-800 dark:text-amber-300 shrink-0 self-start sm:self-auto">
            90-Day Affiliate Audit: 4,7 Tỷ ₫
          </span>
        </div>

        {/* 2-Column Comparative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Follower Tier Realities */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {isEn ? '1. Follower Tier Dynamics (<5k Follower Rule)' : '1. Cấu Trúc Tầng Follower: Quy Luật <5k Follower'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dữ liệu đối soát 90 ngày (31,6k đơn bán / 4,7 Tỷ đ) chứng minh nghịch lý lớn: Nhóm có lượng follow thấp nhất lại mang lại doanh số cao nhất toàn sàn:
            </p>
            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                <div>
                  <span className="font-black text-emerald-900 dark:text-emerald-200">Nano KOC (≤ 1k Follow):</span>
                  <span className="text-[11px] text-slate-500 block">16,0k SP (50,7% đơn)</span>
                </div>
                <div className="text-right font-black text-emerald-700 dark:text-emerald-300 text-sm">
                  2,1 Tỷ ₫ (43,4% GMV)
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                <div>
                  <span className="font-black text-emerald-900 dark:text-emerald-200">Micro KOC (1k – 5k Follow):</span>
                  <span className="text-[11px] text-slate-500 block">16,6k SP (52,7% đơn)</span>
                </div>
                <div className="text-right font-black text-emerald-700 dark:text-emerald-300 text-sm">
                  2,5 Tỷ ₫ (52,7% GMV)
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic pt-1">
              → Tổng cộng nhóm KOC dưới 5.000 followers đóng góp hơn <strong>95% – 96% doanh số Affiliate</strong>, trong khi nhóm Macro (&gt;50k follow) chỉ chiếm chưa đầy 15% sản lượng.
            </p>
          </div>

          {/* Right: Creator Dependency & Dormancy */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              {isEn ? '2. Single-Creator Concentration Risk' : '2. Rủi Ro Tập Trung Cá Nhân & KOC "Ngủ Đông"'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Mặc dù có tới <strong>5.713 Creators</strong> liên kết giỏ hàng, chỉ <strong>5,1% (292 KOC)</strong> thực sự phát sinh đơn hàng thành công (94,9% hoàn toàn ngủ đông):
            </p>
            <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-rose-900 dark:text-rose-200">
                <span>Trọng số kênh @girlstyle.vn:</span>
                <span className="font-black text-sm">&gt;40% GMV Affiliate</span>
              </div>
              <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80 leading-relaxed">
                Khi bóc tách tuần giữa tháng 3/2026, khi cả <code>@girlstyle.vn</code> và <code>@yumireview07</code> không lên sóng LIVE, toàn bộ doanh thu LIVE của mạng lưới affiliate rơi thẳng về <strong>0 VNĐ</strong>!
              </p>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              → Ngành hàng <strong>Clothing & Accessories</strong> chiếm 68,69% sản lượng affiliate nhưng việc dồn doanh số vào 1 KOC duy nhất tạo ra lỗ hổng lớn về tính liên tục của doanh nghiệp.
            </p>
          </div>
        </div>

        {/* Actionable Strategy Takeaway */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5 leading-relaxed">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-amber-900 dark:text-amber-300">Giải pháp chiến lược: </strong>
            Triển khai chương trình <em>"Automated Sample Kit"</em> cho tệp Nano/Micro (&lt;5k follow) và nâng mức hoa hồng LIVE lên <strong>12% – 14%</strong> (so với mức 8% – 10% của video) để chuyển đổi một phần trong 5.400 KOC video sang mảng LIVE, phân tán rủi ro phụ thuộc vào kênh vệ tinh duy nhất.
          </p>
        </div>
      </div>
    </section>
  );
}

