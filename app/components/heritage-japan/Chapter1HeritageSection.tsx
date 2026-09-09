'use client';

import React, { useState, useMemo } from 'react';
import { Landmark, Search, TrendingUp, AlertTriangle } from 'lucide-react';
import { UNESCO_SITES_JAPAN } from '../../data/heritageJapanData';
import SectionHeader from '../ui/SectionHeader';

interface Chapter1HeritageSectionProps {
  isEn: boolean;
  onCopyDeepLink: (_sectionId: string, _title?: string) => void;
}

export function Chapter1HeritageSection({ isEn, onCopyDeepLink }: Chapter1HeritageSectionProps) {
  const [unescoFilter, setUnescoFilter] = useState<'all' | 'Văn hóa' | 'Thiên nhiên'>('all');
  const [unescoSearch, setUnescoSearch] = useState<string>('');

  const filteredUnescoSites = useMemo(() => {
    return UNESCO_SITES_JAPAN.filter(site => {
      const matchesType = unescoFilter === 'all' || site.type === unescoFilter;
      const matchesSearch = !unescoSearch.trim() || 
        site.nameVi.toLowerCase().includes(unescoSearch.toLowerCase()) ||
        site.nameJa.includes(unescoSearch) ||
        site.prefecture.toLowerCase().includes(unescoSearch.toLowerCase()) ||
        site.highlight.toLowerCase().includes(unescoSearch.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [unescoFilter, unescoSearch]);

  return (
    <section id="chuong-1" className="py-16 bg-slate-50 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          variant="stacked"
          id="chuong-1"
          badge={isEn ? 'Chapter 1 • Theoretical Foundation' : 'Chương 1 • Cơ sở lý luận & Thực tiễn'}
          title={isEn ? 'Heritage & Heritage Tourism in the World and Japan' : 'Di sản và Du lịch di sản trên thế giới và Nhật Bản'}
          onCopy={onCopyDeepLink}
        />

        <div className="space-y-8 text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
          {/* 1.1 Di sản */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-4 dark:text-white">
              1.1. Di sản và Di sản thế giới tại Nhật Bản
            </h3>
            
            <div className="space-y-4 text-sm sm:text-base">
              <p>
                <strong>Khái niệm di sản:</strong> Di sản bao gồm các tài sản văn hóa, lịch sử và thiên nhiên được các thế hệ trước để lại, có giá trị khoa học, thẩm mỹ và tinh thần to lớn. Theo Công ước Bảo vệ Di sản Văn hóa và Thiên nhiên Thế giới năm 1972 của UNESCO, Di sản Thế giới là những di sản đáp ứng các tiêu chí khắt khe về &quot;Giá trị nổi bật toàn cầu&quot; (Outstanding Universal Value - OUV).
              </p>
              <p>
                <strong>Vai trò trong du lịch:</strong> Di sản là thỏi nam châm thu hút du khách, mang lại sức cạnh tranh khác biệt cho điểm đến. Khách du lịch di sản thường có thời gian lưu trú dài hơn và mức chi tiêu cao hơn đáng kể so với khách du lịch đại trà.
              </p>
              <p>
                <strong>Nhật Bản:</strong> Tính đến năm 2023, Nhật Bản sở hữu <strong>25 Di sản Thế giới</strong> được UNESCO công nhận, bao gồm <strong>20 Di sản Văn hóa</strong> và <strong>5 Di sản Thiên nhiên</strong>. Hệ thống di sản phong phú trải dài từ kiến trúc gỗ cổ nhất thế giới (Chùa Horyuji), các cố đô ngàn năm (Kyoto, Nara) đến những kiệt tác thiên nhiên biệt lập (Yakushima, Shiretoko, Ogasawara).
              </p>
            </div>

            {/* Interactive UNESCO Explorer */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2 dark:text-white">
                    <Landmark className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
                    <span>Tra cứu 25 Di sản Thế giới UNESCO tại Nhật Bản</span>
                  </h4>
                  <p className="text-xs text-slate-500">Bảng dữ liệu định danh 20 Di sản Văn hóa & 5 Di sản Thiên nhiên</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-lg p-1 bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    {(['all', 'Văn hóa', 'Thiên nhiên'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setUnescoFilter(type)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                          unescoFilter === type 
                            ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-700 dark:text-white' 
                            : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        {type === 'all' ? 'Tất cả (25)' : `${type} (${type === 'Văn hóa' ? 20 : 5})`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search bar */}
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={unescoSearch}
                  onChange={(e) => setUnescoSearch(e.target.value)}
                  placeholder="Tìm theo tên di sản, tỉnh (Kyoto, Nara, Hiroshima, Tokyo...)..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8CE0F4] transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              {/* Grid of UNESCO sites */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredUnescoSites.map((site) => (
                  <div 
                    key={site.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#8CE0F4] transition-all text-xs dark:bg-slate-800/70 dark:border-slate-700/80"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        site.type === 'Văn hóa' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      }`}>
                        {site.type} • {site.year}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">{site.prefecture}</span>
                    </div>
                    <p className="font-extrabold text-slate-900 mb-0.5 dark:text-white">{site.nameVi}</p>
                    <p className="text-[11px] text-slate-500 font-japanese mb-1.5 dark:text-slate-400">{site.nameJa}</p>
                    <p className="text-slate-600 leading-normal text-[11px] dark:text-slate-300">{site.highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 1.2 Du lịch di sản */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-4 dark:text-white">
              1.2. Khái niệm Du lịch di sản & Ma trận tác động hai chiều
            </h3>

            <div className="space-y-4 text-sm sm:text-base">
              <p>
                Theo ICOMOS (Hội đồng Quốc tế về Di tích và Di chỉ) và UNWTO, <strong>Du lịch di sản</strong> là hoạt động di chuyển của các cá nhân nhằm trải nghiệm, khám phá và tìm hiểu về các di tích lịch sử, khảo cổ, kiến trúc, cảnh quan và lối sống truyền thống. Các hoạt động cốt lõi bao gồm: chiêm bái tâm linh, hành hương, tham gia lễ hội dân gian (Matsuri), thưởng thức ẩm thực di sản và học nghề thủ công truyền thống.
              </p>

              {/* 2-column impact matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/60">
                  <div className="flex items-center gap-2 text-emerald-800 font-black text-sm uppercase tracking-wider mb-2 dark:text-emerald-300">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Tác động tích cực (Positive Impacts)</span>
                  </div>
                  <ul className="text-xs sm:text-sm space-y-2 text-slate-700 list-disc list-inside dark:text-slate-300">
                    <li><strong>Kinh tế:</strong> Tạo nguồn thu ngân sách trực tiếp thông qua vé tham quan, dịch vụ lưu trú và chi tiêu mua sắm hàng thủ công.</li>
                    <li><strong>Tái đầu tư:</strong> Cung cấp tài chính dồi dào cho các dự án trùng tu, bảo dưỡng định kỳ các công trình cổ bằng gỗ quý giá.</li>
                    <li><strong>Việc làm:</strong> Giải quyết công ăn việc làm cho cư dân bản địa, khuyến khích giới trẻ ở lại quê hương giữ nghề truyền thống.</li>
                    <li><strong>Tự hào văn hóa:</strong> Khơi dậy ý thức cộng đồng, bảo vệ các nghi lễ và văn hóa dân gian đứng trước nguy cơ mai một.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-rose-50/70 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/60">
                  <div className="flex items-center gap-2 text-rose-800 font-black text-sm uppercase tracking-wider mb-2 dark:text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Tác động tiêu cực (Negative Impacts)</span>
                  </div>
                  <ul className="text-xs sm:text-sm space-y-2 text-slate-700 list-disc list-inside dark:text-slate-300">
                    <li><strong>Hao mòn vật chất:</strong> Áp lực bước chân hàng triệu du khách gây mòn nền gỗ, bậc đá và rung chấn kết cấu công trình cổ.</li>
                    <li><strong>Quá tải du lịch (Overtourism):</strong> Nghẽn đường, ách tắc phương tiện công cộng, tiếng ồn xáo trộn nếp sống cư dân bản địa.</li>
                    <li><strong>Thương mại hóa thái quá:</strong> Hàng hóa lưu niệm sản xuất hàng loạt từ nước ngoài lấn át sản phẩm thủ công tinh xảo nguyên bản.</li>
                    <li><strong>Ô nhiễm môi trường:</strong> Lượng rác thải khổng lồ, đặc biệt là bao bì nhựa và hộp đựng thức ăn du khách vứt bừa bãi.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F3FCFE] border border-[#9BE7FA] mt-4 text-xs sm:text-sm text-slate-800 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-200">
                <strong className="text-[#0D7287] dark:text-[#9BE7FA]">Nguyên tắc phát triển bền vững:</strong> 
                {" "}Phát triển du lịch di sản bền vững đòi hỏi phải duy trì cân bằng động giữa 3 trụ cột: <em>Hiệu quả kinh tế lâu dài</em>, <em>Bảo tồn nguyên vẹn tính chân xác của di sản</em> và <em>Đảm bảo chất lượng cuộc sống bình yên cho cộng đồng địa phương</em>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
