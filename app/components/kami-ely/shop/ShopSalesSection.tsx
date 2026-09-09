'use client';

import React from 'react';
import { Download } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import SectionHeader from '../../ui/SectionHeader';
import { shopWeeklyTrendData, PALETTE } from '../../../data/kamiElyData';

interface ShopSalesSectionProps {
  isEn: boolean;
  copyDeepLink: (id: string) => void;
  handleExportChart: (id: string, name: string) => void;
  channelData: Record<string, any[]>;
  contentData: Record<string, any[]>;
  channelMetric: 'units' | 'gmv';
  setChannelMetric: (m: 'units' | 'gmv') => void;
  contentMetric: 'units' | 'gmv';
  setContentMetric: (m: 'units' | 'gmv') => void;
}

export default function ShopSalesSection({
  isEn,
  copyDeepLink,
  handleExportChart,
  channelData,
  contentData,
  channelMetric,
  setChannelMetric,
  contentMetric,
  setContentMetric
}: ShopSalesSectionProps) {
  return (
    <section id="shop-sales" className="space-y-6 scroll-mt-36">
      <SectionHeader 
        badge="1.2" 
        title={isEn ? "Sales Trajectory & Transaction Structure" : "Phân Tích Bán Hàng & Cơ Cấu Giao Dịch"} 
        id="shop-sales" 
        onCopy={copyDeepLink} 
      />

      {/* 180-Day Trajectory Chart */}
      <div id="shop-sales-trend" className="p-6 sm:p-8 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h3 className="text-base font-black text-slate-950 dark:text-white">
              {isEn ? '180-Day Trajectory (26 Weeks): Units Sold & GMV in Million VND' : 'Chuỗi Doanh Số 180 Ngày (26 Tuần): Sản Lượng & Doanh Thu GMV (Triệu đ)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn ? 'Weekly aggregation showing June summer peak propelled by continuous LIVE sessions' : 'Dữ liệu tổng hợp theo tuần ghi nhận đỉnh điểm mùa du lịch tháng 6 với hơn 1.950 SP/ngày'}
            </p>
          </div>
          <button
            onClick={() => handleExportChart('shop-sales-trend', 'kami-ely-sales-trend-180d')}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#C8EEF7]/50 hover:bg-[#C8EEF7] text-[#0D7287] border border-[#9BE7FA] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-[#9BE7FA] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất PNG</span>
          </button>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={shopWeeklyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUnitsBrand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9BE7FA" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#9BE7FA" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorGmvBrand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFE485" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#FFD14C" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#0D7287" fontSize={11} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#b45309" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #9BE7FA', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Area yAxisId="left" type="monotone" dataKey="units" name={isEn ? 'Units Sold' : 'Sản phẩm bán ra'} stroke="#0D7287" strokeWidth={3} fillOpacity={1} fill="url(#colorUnitsBrand)" />
              <Area yAxisId="right" type="monotone" dataKey="gmv" name={isEn ? 'GMV (Million VND)' : 'GMV (Triệu đ)'} stroke="#FFD14C" strokeWidth={3} fillOpacity={1} fill="url(#colorGmvBrand)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Channels & Content Formats Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Channels */}
        <div id="shop-channels-pie" className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Transaction Channels' : 'Phân Bổ Kênh Giao Dịch'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kênh chính vs Mạng lưới Affiliate</p>
            </div>
            <div className="flex bg-[#C8EEF7]/40 rounded-xl p-1 dark:bg-slate-800">
              <button onClick={() => setChannelMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${channelMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số lượng</button>
              <button onClick={() => setChannelMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${channelMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={channelData[channelMetric]}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="78%"
                  paddingAngle={3}
                  dataKey="value"
                >
                  {channelData[channelMetric].map((_, index) => (
                    <Cell key={`cell-ch-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, channelMetric === 'gmv' ? 'Tỷ trọng GMV' : 'Tỷ trọng số lượng']} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Distribution */}
        <div id="shop-content-pie" className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">{isEn ? 'Content Format Distribution' : 'Cơ Cấu Định Dạng Nội Dung'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">LIVE vs Video vs Thẻ sản phẩm</p>
            </div>
            <div className="flex bg-[#FFE485]/30 rounded-xl p-1 dark:bg-slate-800">
              <button onClick={() => setContentMetric('units')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${contentMetric === 'units' ? 'bg-[#9BE7FA] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>Số lượng</button>
              <button onClick={() => setContentMetric('gmv')} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${contentMetric === 'gmv' ? 'bg-[#FFD14C] text-slate-950 shadow-xs font-black' : 'text-slate-600 dark:text-slate-400'}`}>GMV</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={contentData[contentMetric]}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="78%"
                  paddingAngle={3}
                  dataKey="value"
                >
                  {contentData[contentMetric].map((_, index) => (
                    <Cell key={`cell-ct-${index}`} fill={PALETTE[(index + 2) % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, contentMetric === 'gmv' ? 'Tỷ trọng GMV' : 'Tỷ trọng số lượng']} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
