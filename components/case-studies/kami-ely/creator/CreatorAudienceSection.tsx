'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import SectionHeader from '@/components/ui/SectionHeader';
import { creatorDemographics } from '@/app/data/kamiElyData';

interface CreatorAudienceSectionProps {
  isEn: boolean;
  copyDeepLink: (_id: string, _name?: string) => void;
}

export default function CreatorAudienceSection({
  isEn,
  copyDeepLink
}: CreatorAudienceSectionProps) {
  return (
    <section id="creator-followers" className="space-y-6 scroll-mt-36">
      <SectionHeader 
        badge="2.3" 
        title={isEn ? "Audience & Follower Demographics" : "Chân Dung Người Theo Dõi & Nhân Khẩu Học"} 
        id="creator-followers" 
        onCopy={copyDeepLink} 
        badgeBg="bg-[#FFD14C] text-slate-950" 
      />

      {/* Demographics 3 Charts: Gender, Age, Geographic */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Gender */}
        <div className="p-6 rounded-3xl bg-white border border-[#FFD14C] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-base font-black text-slate-950 dark:text-white">
            {isEn ? 'Gender Split' : 'Tỷ Lệ Giới Tính'}
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={creatorDemographics.gender}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="75%"
                  paddingAngle={3}
                  dataKey="value"
                >
                  {creatorDemographics.gender.map((entry, index) => (
                    <Cell key={`cell-gender-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, 'Tỷ lệ']} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-slate-600 dark:text-slate-400 font-bold">
            Nữ giới chiếm <b>73%</b>: Phù hợp hoàn hảo với thời trang nữ & đồ bơi
          </div>
        </div>

        {/* Age */}
        <div className="p-6 rounded-3xl bg-white border border-[#9BE7FA]/60 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-base font-black text-slate-950 dark:text-white">
            {isEn ? 'Age Distribution' : 'Cơ Cấu Nhóm Tuổi'}
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creatorDemographics.age} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis dataKey="group" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={65} />
                <Tooltip formatter={(v) => [`${v}%`, 'Tỷ trọng']} />
                <Bar dataKey="value" fill="#0D7287" radius={[0, 6, 6, 0]} barSize={20}>
                  {creatorDemographics.age.map((entry, index) => (
                    <Cell key={`cell-age-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-slate-600 dark:text-slate-400 font-bold">
            Nhóm <b>18 - 24 tuổi</b> chiếm áp đảo <b>60%</b> (Gen Z sành điệu)
          </div>
        </div>

        {/* Top Cities */}
        <div className="p-6 rounded-3xl bg-white border border-[#FFE485] shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-base font-black text-slate-950 dark:text-white">
            {isEn ? 'Top Locations' : 'Phân Bổ Tỉnh / Thành'}
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creatorDemographics.locations} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis dataKey={isEn ? "cityEn" : "city"} type="category" stroke="#64748B" fontSize={11} tickLine={false} width={100} />
                <Tooltip formatter={(v) => [`${v}%`, isEn ? 'Share' : 'Tỷ trọng']} />
                <Bar dataKey="value" fill="#FFD14C" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-slate-600 dark:text-slate-400 font-bold">
            {isEn ? (
              <><b>TP. Hồ Chí Minh & Hanoi</b> co-lead with <b>41%</b> each (82% total followers)</>
            ) : (
              <><b>TP. Hồ Chí Minh & Hà Nội</b> đồng dẫn đầu với <b>41%</b> mỗi nơi (chiếm 82% người theo dõi)</>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
