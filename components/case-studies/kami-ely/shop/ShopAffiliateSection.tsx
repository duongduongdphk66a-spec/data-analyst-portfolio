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
  copyDeepLink: (id: string) => void;
  openProofScreenshot: (id: string) => void;
  affMetric: 'units' | 'gmv' | 'count';
  setAffMetric: (m: 'units' | 'gmv' | 'count') => void;
  affCatMetric: 'units' | 'gmv' | 'count';
  setAffCatMetric: (m: 'units' | 'gmv' | 'count') => void;
}

export default function ShopAffiliateSection({
  isEn,
  copyDeepLink,
  openProofScreenshot,
  affMetric,
  setAffMetric,
  affCatMetric,
  setAffCatMetric
}: ShopAffiliateSectionProps) {
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

      {/* Nano Powerhouse callout with #C8EEF7 & #FFE485 gradient */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#C8EEF7]/50 via-[#FFFDF5] to-[#FFE485]/40 border border-[#9BE7FA] border-l-4 border-l-[#0D7287] shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:border-slate-700 dark:border-l-[#9BE7FA]">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#0D7287] text-white text-[11px] font-black uppercase">KOC Nano</span>
            <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              Sức Mạnh Vượt Trội Của Nhóm Nano-Affiliate (1k - 5k Followers)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Nhóm creator có từ 1k đến 5k followers chiếm 48.2% số lượng nhưng mang lại tới 52.7% GMV (2,5 Tỷ đ) và 52.7% sản lượng (16.6k đơn), vượt xa nhóm Macro (&gt;100k chỉ đóng góp 5.3% GMV).
          </p>
        </div>
        <div className="flex gap-4 shrink-0">
          <div className="p-3 rounded-2xl bg-white border border-[#9BE7FA]/60 text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">5.7k</div>
            <div className="text-[10px] text-slate-500">Tổng Influencers</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-[#FFD14C] text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="text-lg font-black text-[#0D7287] dark:text-[#FFD14C]">4,7 Tỷ đ</div>
            <div className="text-[10px] text-slate-500">GMV 90 Ngày</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-[#9BE7FA]/60 text-center dark:bg-slate-900 dark:border-slate-800">
            <div className="text-lg font-black text-[#0D7287] dark:text-[#9BE7FA]">+983</div>
            <div className="text-[10px] text-slate-500">KOC Mới Onboard</div>
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
          <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <Award className="w-5 h-5 text-[#FFD14C]" />
            {isEn ? 'Top Performing Affiliates' : 'Top KOC / Affiliates Tiêu Biểu'}
          </h3>
          <div className="space-y-2.5">
            {topAffiliatesList.map((aff) => (
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
    </section>
  );
}
