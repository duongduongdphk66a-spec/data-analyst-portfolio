'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowLeft, AlertCircle, TrendingUp, Info, BarChart3, Users, Landmark, FileText } from 'lucide-react';
import Link from 'next/link';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useRouter } from 'next/navigation';
import { trackVisitorAction } from '../../lib/visitorTracking';

// Data for charts
const touristsData = [
  { year: '03', value: 5.2 }, { year: '04', value: 6.1 }, { year: '05', value: 6.7 },
  { year: '06', value: 7.3 }, { year: '07', value: 8.3 }, { year: '08', value: 8.4 },
  { year: '09', value: 6.8 }, { year: '10', value: 8.6 }, { year: '11', value: 6.2 },
  { year: '12', value: 8.4 }, { year: '13', value: 10.4 }, { year: '14', value: 13.4 },
  { year: '15', value: 19.7 }, { year: '16', value: 24.0 }, { year: '17', value: 28.7 },
  { year: '18', value: 31.2 }, { year: '19', value: 31.9 }, { year: '20', value: 4.1 },
  { year: '21', value: 0.2 }, { year: '22', value: 3.4 },
];

const kyotoNaraData = [
  { year: '2009', kyoto: 957.2, nara: 407 }, { year: '2010', kyoto: 783.8, nara: 629 },
  { year: '2011', kyoto: 983.9, nara: 174 }, { year: '2012', kyoto: 515.4, nara: 267 },
  { year: '2013', kyoto: 844.9, nara: 435 }, { year: '2014', kyoto: 1127.9, nara: 630 },
  { year: '2015', kyoto: 1828.6, nara: 975 }, { year: '2016', kyoto: 3158.6, nara: 1576 },
  { year: '2017', kyoto: 3184.8, nara: 1990 }, { year: '2018', kyoto: 3527.8, nara: 2651 },
  { year: '2019', kyoto: 4503.3, nara: 3318 }, { year: '2020', kyoto: 3799.0, nara: 28.9 },
];

const spendData = [
  { year: '2010', value: 1.15 }, { year: '2011', value: 0.81 }, { year: '2012', value: 1.08 },
  { year: '2013', value: 1.41 }, { year: '2014', value: 2.02 }, { year: '2015', value: 3.48 },
  { year: '2016', value: 3.75 }, { year: '2017', value: 4.41 }, { year: '2018', value: 4.50 },
  { year: '2019', value: 4.81 }, { year: '2020', value: 0.70 }, { year: '2021', value: 0.10 },
];

export default function HeritageJapanProject() {
  const router = useRouter();

  useEffect(() => {
    trackVisitorAction('Xem chi tiết dự án: Sự phát triển của Du lịch Di sản tại Nhật Bản', 'proj-heritage-japan', 'project');
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-element').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-yellow/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-blue-light/50 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-semibold group cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại Portfolio</span>
          </button>
          
          <div className="hidden md:flex gap-6 text-sm font-semibold text-slate-600">
            <a href="#boi-canh" className="hover:text-slate-900 transition-colors">Bối cảnh</a>
            <a href="#di-san" className="hover:text-slate-900 transition-colors">Di sản</a>
            <a href="#chinh-sach" className="hover:text-slate-900 transition-colors">Chính sách</a>
            <a href="#du-lieu" className="hover:text-slate-900 transition-colors">Dữ liệu</a>
            <a href="#ket-luan" className="hover:text-slate-900 transition-colors">Kết luận</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white min-h-[85vh] flex flex-col justify-center overflow-hidden">
        {/* Sun Element */}
        <div className="absolute right-[8%] top-[16%] w-48 h-48 rounded-full bg-gradient-to-tr from-[#FFE485] via-brand-yellow to-[#E8A93A] shadow-[0_0_120px_30px_rgba(255,209,76,0.18)] hidden md:block"></div>
        
        {/* Mountain SVG overlay (recreating the fuji shape) */}
        <div className="absolute left-0 right-0 bottom-0 w-full h-[25vh] opacity-90 pointer-events-none">
          <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="w-full h-full fill-[#0D2033]">
            <path d="M0,360 L340,140 L430,220 L620,60 L760,190 L880,110 L1020,230 L1160,150 L1440,300 L1440,360 Z"/>
          </svg>
          <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full fill-[#F6FBFD] opacity-85">
            <path d="M560,90 L620,60 L680,100 L650,105 L610,88 L590,102 Z"/>
          </svg>
          <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full fill-[#0A1723]">
            <path d="M0,360 L520,170 L640,250 L900,120 L1080,240 L1440,180 L1440,360 Z"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 w-full">
          <div className="flex items-center gap-3 text-brand-blue font-mono text-sm tracking-widest uppercase font-bold mb-6">
            <span className="w-6 h-0.5 bg-brand-yellow"></span>
            Data Analytics Case Study
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 max-w-4xl tracking-tight">
            Sự phát triển của <br/>
            <em className="not-italic text-brand-yellow">Du lịch Di sản</em> tại Nhật Bản
          </h1>
          <p className="text-lg md:text-xl text-brand-blue-light/90 max-w-2xl mb-12 leading-relaxed">
            Phân tích chuỗi số liệu khách du lịch quốc tế, chi tiêu du lịch và chính sách bảo tồn di sản Nhật Bản giai đoạn 2013 – nay, chuyển thể từ niên luận ngành Nhật Bản học thành một dự án trực quan hoá dữ liệu.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10 max-w-4xl">
            <div>
              <div className="text-3xl font-bold text-brand-yellow font-mono leading-none">2013–22</div>
              <div className="text-xs text-brand-blue mt-2 tracking-widest font-mono uppercase">Khung thời gian</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-yellow font-mono leading-none">25</div>
              <div className="text-xs text-brand-blue mt-2 tracking-widest font-mono uppercase">Di sản thế giới</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-yellow font-mono leading-none">6</div>
              <div className="text-xs text-brand-blue mt-2 tracking-widest font-mono uppercase">Biểu đồ dữ liệu</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-yellow font-mono leading-none">3</div>
              <div className="text-xs text-brand-blue mt-2 tracking-widest font-mono uppercase">Địa phương trọng điểm</div>
            </div>
          </div>
        </div>
      </header>

      {/* Context */}
      <section id="boi-canh" className="py-24 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <span className="w-6 h-0.5 bg-brand-yellow"></span>
          01 · Bối cảnh nghiên cứu
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Vì sao du lịch di sản Nhật Bản đáng để phân tích?</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-10">
              Du lịch di sản là mũi nhọn du lịch quốc gia của Nhật Bản. Nghiên cứu tìm hiểu sự phát triển của loại hình du lịch này kể từ năm 2013 — thời điểm Chính phủ Nhật ban hành Chương trình hành động hướng tới quốc gia du lịch.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-brand-blue-light/20 p-6 rounded-2xl border border-brand-blue-light/50">
                <div className="text-3xl font-bold text-slate-900 font-mono mb-2"><span className="text-brand-yellow drop-shadow-sm">40%</span></div>
                <p className="text-sm text-slate-600">khách du lịch thế giới chọn di sản làm điểm đến (UNWTO)</p>
              </div>
              <div className="bg-brand-blue-light/20 p-6 rounded-2xl border border-brand-blue-light/50">
                <div className="text-3xl font-bold text-slate-900 font-mono mb-2"><span className="text-brand-yellow drop-shadow-sm">556.9</span> tỷ</div>
                <p className="text-sm text-slate-600">USD doanh thu du lịch di sản toàn cầu năm 2021</p>
              </div>
            </div>
          </div>
          
          <div className="reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
            <div className="bg-brand-yellow-light rounded-3xl p-8 md:p-10 mb-8 border border-brand-yellow shadow-sm">
              <p className="text-sm font-mono text-slate-600 uppercase tracking-widest mb-4 font-bold">Câu hỏi nghiên cứu chính</p>
              <p className="text-2xl md:text-3xl font-bold italic text-slate-900 leading-tight">
                "Du lịch di sản tại Nhật Bản đã phát triển như thế nào từ năm 2013?"
              </p>
            </div>
            
            <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-4 font-bold">Câu hỏi phụ</p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-yellow shrink-0"></div>
                <span className="text-slate-600">Các chính sách phát triển du lịch di sản của Nhật Bản là gì?</span>
              </li>
              <li className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-yellow shrink-0"></div>
                <span className="text-slate-600">Hiệu quả thể hiện qua số lượng khách, tốc độ tăng trưởng và doanh thu du lịch ra sao?</span>
              </li>
              <li className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-yellow shrink-0"></div>
                <span className="text-slate-600">Tình trạng bảo tồn và quản lý di sản đã thay đổi như thế nào?</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Heritage */}
      <section id="di-san" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <span className="w-6 h-0.5 bg-brand-yellow"></span>
            02 · Di sản & du lịch di sản
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-16 tracking-tight reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
            Di sản là động lực, là bản sắc, là cầu nối văn hoá
          </h2>
          
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
            <div className="bg-slate-950 text-white rounded-3xl p-10 lg:p-12 shadow-2xl reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
              <p className="text-brand-blue font-mono text-xs tracking-widest uppercase font-bold mb-4">Di sản Thế giới UNESCO tại Nhật Bản (2023)</p>
              <div className="text-8xl font-black font-mono text-brand-yellow leading-none mb-2">25</div>
              <p className="text-brand-blue-light/80 text-sm">di sản thế giới</p>
              
              <div className="flex gap-10 mt-8 mb-10">
                <div>
                  <span className="block text-4xl font-bold font-mono text-white mb-1">20</span>
                  <span className="text-xs text-brand-blue-light/70 uppercase tracking-wider">Di sản văn hoá</span>
                </div>
                <div>
                  <span className="block text-4xl font-bold font-mono text-brand-yellow mb-1">5</span>
                  <span className="text-xs text-brand-blue-light/70 uppercase tracking-wider">Di sản thiên nhiên</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2.5">
                {['Cố đô Kyoto', 'Cố đô Nara', 'Núi Phú Sĩ', 'Himeji', 'Itsukushima'].map(dest => (
                  <span key={dest} className="px-4 py-2 rounded-full bg-slate-800 text-brand-blue-light text-xs font-mono border border-slate-700">
                    {dest}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-8 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300">
              {[
                { id: '01', title: 'Động lực du lịch', desc: 'Là điểm đến hấp dẫn để khám phá, trải nghiệm văn hoá và phong tục mới của du khách trong và ngoài nước.' },
                { id: '02', title: 'Tạo sự khác biệt', desc: 'Phản ánh bản sắc riêng của từng cộng đồng, dân tộc — không nơi nào giống nơi nào.' },
                { id: '03', title: 'Giáo dục & giao lưu', desc: 'Nâng cao hiểu biết lịch sử, thúc đẩy giao lưu văn hoá giữa các quốc gia, dân tộc.' },
                { id: '04', title: 'Nguồn lực kinh tế', desc: 'Tạo doanh thu tái đầu tư cho công tác bảo tồn, tôn tạo di sản và phát triển địa phương.' }
              ].map(role => (
                <div key={role.id} className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-brand-blue-light/30 border border-brand-blue-light text-slate-900 font-bold font-mono flex items-center justify-center shrink-0 shadow-sm">
                    {role.id}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{role.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{role.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Policy Timeline */}
      <section id="chinh-sach" className="py-24 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <span className="w-6 h-0.5 bg-brand-yellow"></span>
          03 · Chính sách phát triển
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
          Nền tảng pháp lý đi trước, chính sách du lịch theo sau
        </h2>
        
        <p className="text-lg text-slate-600 max-w-3xl mb-16 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
          Bảo tồn di sản văn hoá được luật hoá từ giữa thế kỷ 20 tại Nhật Bản, tạo nền móng để các chính sách thúc đẩy du lịch được ban hành và thực thi hiệu quả sau này.
        </p>

        <div className="relative mb-12 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300">
          <div className="absolute top-6 left-8 right-8 h-0.5 bg-brand-blue-light hidden md:block"></div>
          
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {[
              { year: '1950', title: 'Luật Bảo vệ Di sản Văn hoá', desc: 'Hợp nhất 3 đạo luật bảo tồn tiền thân, bổ sung tài sản văn hoá phi vật thể vào phạm vi bảo vệ.', active: false },
              { year: '2004', title: 'Sửa đổi Luật Di sản Văn hoá', desc: 'Bổ sung chế độ bảo tồn cảnh quan văn hoá & quần thể kiến trúc truyền thống.', active: false },
              { year: "'06–08", title: 'Luật Du lịch Quốc gia', desc: 'Thành lập Cơ quan Du lịch Nhật Bản (2008); định hướng du lịch bền vững.', active: false },
              { year: '2013', title: 'Chương trình hành động', desc: 'Cột mốc khởi đầu nghiên cứu — thúc đẩy “Thương hiệu Nhật Bản”, nới lỏng visa, mở rộng hạ tầng.', active: true }
            ].map((node, i) => (
              <div key={i} className="relative">
                <div className={`mx-auto mb-6 flex items-center justify-center font-bold font-mono text-slate-900 transition-all rounded-full shadow-sm
                  ${node.active ? 'w-16 h-16 bg-brand-yellow text-lg ring-4 ring-brand-yellow/30' : 'w-12 h-12 bg-brand-blue text-sm border-4 border-white'}`}>
                  {node.year}
                </div>
                <div className={`p-6 rounded-2xl h-full border ${node.active ? 'bg-brand-yellow-light/20 border-brand-yellow shadow-md' : 'bg-white border-brand-blue-light/50 shadow-sm'}`}>
                  <h4 className="font-bold text-slate-900 mb-3 leading-snug">{node.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-brand-blue-light p-8 rounded-2xl flex gap-4 items-start shadow-xl reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-400">
          <Info className="w-6 h-6 text-brand-yellow shrink-0 mt-0.5" />
          <p className="text-sm md:text-base leading-relaxed">
            <b className="text-white">Trọng tâm chính sách 2013:</b> nới lỏng thị thực cho ASEAN (Thái Lan, Malaysia, Việt Nam, Philippines) · mở rộng cơ sở lưu trú · quảng bá “Thương hiệu Nhật Bản” · hỗ trợ đa ngôn ngữ & thanh toán quốc tế · thu hút hội nghị MICE.
          </p>
        </div>
      </section>

      {/* Data Charts Section */}
      <section id="du-lieu" className="py-24 bg-slate-950 text-white border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 text-brand-blue font-mono text-sm tracking-widest uppercase font-bold mb-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <span className="w-6 h-0.5 bg-brand-yellow"></span>
            04 · Phân tích dữ liệu
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
            Đường cong tăng trưởng nói lên điều gì?
          </h2>
          
          <p className="text-lg text-brand-blue-light/80 max-w-3xl mb-16 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
            Ba chuỗi số liệu được trích xuất, chuẩn hoá và trực quan hoá lại từ nguồn thống kê chính thức (MLIT, JNTO, tỉnh Kyoto, Nara) được trích dẫn trong niên luận gốc.
          </p>

          {/* Chart 1 */}
          <div className="py-12 border-t border-white/10 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="text-brand-blue" />
                Khách du lịch quốc tế đến Nhật Bản
              </h3>
              <span className="font-mono text-sm text-brand-blue tracking-wider">TRIỆU NGƯỜI · 2003–2022</span>
            </div>
            
            <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={touristsData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#FFD14C' }}
                      formatter={(value) => [`${value} triệu`, 'Số lượng']}
                      labelStyle={{ color: '#9BE7FA', marginBottom: '4px' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#FFD14C" strokeWidth={3} dot={{ fill: '#FFD14C', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="bg-brand-yellow rounded-2xl p-5 text-slate-900 shadow-md">
                  <div className="text-2xl font-bold font-mono mb-1">31,9 triệu</div>
                  <div className="text-sm font-medium">lượt khách quốc tế năm 2019 — mức đỉnh, gấp ~5 lần năm 2013</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-xl font-bold font-mono text-white mb-1">2013 → 2019</div>
                  <div className="text-sm text-brand-blue-light/80">10,4 triệu → 31,9 triệu (+207%) sau khi Chương trình hành động du lịch được triển khai</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-xl font-bold font-mono text-white mb-1">0,2 triệu</div>
                  <div className="text-sm text-brand-blue-light/80">năm 2021 — tác động COVID-19; phục hồi mạnh mẽ từ 2023</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="py-12 border-t border-white/10 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Users className="text-brand-blue" />
                Khách quốc tế tại Kyoto & Nara
              </h3>
              <span className="font-mono text-sm text-brand-blue tracking-wider">NGHÌN LƯỢT KHÁCH · 2009–2020</span>
            </div>
            
            <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kyotoNaraData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      formatter={(value) => [`${value} nghìn`, 'Khách']}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="kyoto" name="Cố đô Kyoto" stroke="#FFD14C" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="nara" name="Cố đô Nara" stroke="#9BE7FA" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="bg-brand-yellow rounded-2xl p-5 text-slate-900 shadow-md">
                  <div className="text-2xl font-bold font-mono mb-1">Kyoto: 4,5 triệu</div>
                  <div className="text-sm font-medium">lượt khách quốc tế năm 2019 — trước 2013 chưa từng vượt mốc 1 triệu</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-2xl font-bold font-mono text-brand-blue mb-1">Nara: 3,3 triệu</div>
                  <div className="text-sm text-brand-blue-light/80">lượt khách năm 2019, duy trì tăng 40–60% mỗi năm kể từ 2013</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 3 */}
          <div className="py-12 border-t border-white/10 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <BarChart3 className="text-brand-blue" />
                Chi tiêu du lịch của khách quốc tế
              </h3>
              <span className="font-mono text-sm text-brand-blue tracking-wider">NGHÌN TỶ YÊN · 2010–2021</span>
            </div>
            
            <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#FFD14C' }}
                      formatter={(value) => [`${value} nghìn tỷ ¥`, 'Doanh thu']}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="value" fill="#FFD14C" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="bg-brand-yellow rounded-2xl p-5 text-slate-900 shadow-md">
                  <div className="text-2xl font-bold font-mono mb-1">Tăng gấp 3.4 lần</div>
                  <div className="text-sm font-medium">tăng trưởng chi tiêu quốc tế: từ 1,41 (2013) lên 4,81 nghìn tỷ Yên (2019)</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-xl font-bold font-mono text-white mb-1">Đóng góp địa phương</div>
                  <div className="text-sm text-brand-blue-light/80 mt-2">
                    <ul className="space-y-2">
                      <li>• <b>Kyoto:</b> 649 → 1.308 tỷ Yên (2008–2019)</li>
                      <li>• <b>Nara:</b> 873 → 1.208 tỷ Yên (2013–2018)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="thach-thuc" className="py-24 bg-slate-50 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 text-slate-500 font-mono text-sm tracking-widest uppercase font-bold mb-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <span className="w-6 h-0.5 bg-brand-yellow"></span>
          05 · Mặt trái của tăng trưởng
        </div>
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-12 tracking-tight reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
          Quá tải du lịch & thương mại hoá
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-brand-blue-light shadow-sm reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-brand-yellow flex items-center justify-center text-slate-900 shadow-sm">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Quá tải du lịch</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-brand-yellow-dark font-bold mb-2">Kyoto</h4>
                <p className="text-slate-600">Tắc nghẽn xe buýt công cộng quanh Gion, Kinkakuji; xung đột giữa nhu cầu di chuyển của du khách và cư dân bản địa.</p>
              </div>
              <div>
                <h4 className="text-brand-yellow-dark font-bold mb-2">Làng cổ Shirakawa-go</h4>
                <p className="text-slate-600">~600 cư dân địa phương phải tiếp đón tới 1,8 triệu lượt khách/năm — vượt quá sức chứa hạ tầng của làng.</p>
              </div>
              <div>
                <h4 className="text-brand-yellow-dark font-bold mb-2">Nara</h4>
                <p className="text-slate-600">Lượng rác thải từ việc cho hươu ăn tăng, gây nguy cơ mất cân bằng sinh thái và ảnh hưởng trực tiếp đến nông nghiệp khu vực.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-xl reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-slate-900 shadow-sm">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Thương mại hoá di sản</h3>
            </div>
            
            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-brand-yellow font-bold mb-2">Lợi ích kinh tế</h4>
                <p className="text-brand-blue-light/80">Tăng nguồn thu ngân sách để tái đầu tư bảo tồn; quảng bá giá trị di sản rộng rãi; tạo việc làm trực tiếp cho cộng đồng.</p>
              </div>
              <div>
                <h4 className="text-brand-yellow font-bold mb-2">Rủi ro văn hoá</h4>
                <p className="text-brand-blue-light/80">Xây dựng hạ tầng quá mức làm phá vỡ cảnh quan; nguy cơ làm mất giá trị nguyên bản; xung đột lợi ích giữa doanh nghiệp lớn và người dân.</p>
              </div>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-brand-blue-light italic text-sm">
              Ví dụ tại Kyoto: Số lượng phòng khách sạn tăng từ 30.000 (2014) lên 53.000 (2019) — nhưng vẫn chưa theo kịp tốc độ khách tăng gấp 4 lần.
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion & About */}
      <section id="ket-luan" className="py-24 bg-slate-900 text-white border-b-8 border-brand-yellow">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 text-brand-blue font-mono text-sm tracking-widest uppercase font-bold mb-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <span className="w-6 h-0.5 bg-brand-yellow"></span>
            Tổng kết Case Study
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-16 tracking-tight max-w-3xl leading-tight reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
            Tăng trưởng ấn tượng, đi cùng bài toán bền vững
          </h2>
          
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
            <ul className="space-y-6 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
              <li className="flex gap-4">
                <div className="w-2.5 h-2.5 mt-2 rounded-full bg-brand-yellow shrink-0"></div>
                <span className="text-lg text-brand-blue-light/90 leading-relaxed">Du lịch di sản Nhật Bản tăng trưởng bùng nổ kể từ 2013, được thúc đẩy bởi Chương trình hành động hướng tới quốc gia du lịch cùng nền tảng pháp lý Luật Bảo vệ Di sản vững chắc.</span>
              </li>
              <li className="flex gap-4">
                <div className="w-2.5 h-2.5 mt-2 rounded-full bg-brand-yellow shrink-0"></div>
                <span className="text-lg text-brand-blue-light/90 leading-relaxed">Số lượng khách quốc tế và chi tiêu du lịch tăng gấp nhiều lần tại các điểm di sản trọng điểm, đóng góp tỷ trọng ngày càng lớn vào GDP và việc làm toàn quốc.</span>
              </li>
              <li className="flex gap-4">
                <div className="w-2.5 h-2.5 mt-2 rounded-full bg-brand-yellow shrink-0"></div>
                <span className="text-lg text-brand-blue-light/90 leading-relaxed">Sự bùng nổ này đi kèm những thách thức rõ rệt về quá tải và thương mại hoá; buộc các địa phương phải chuyển hướng chiến lược sang "chất lượng hơn số lượng" (phát triển bền vững).</span>
              </li>
            </ul>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 reveal-element opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300">
              <h3 className="text-brand-yellow font-bold text-xl mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Về dự án phân tích này
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-brand-blue font-mono text-xs uppercase tracking-widest font-bold mb-2">Nguồn dữ liệu</h4>
                  <p className="text-sm text-brand-blue-light/80 leading-relaxed">Số liệu trích xuất từ niên luận "Sự phát triển của du lịch di sản tại Nhật Bản" và các nguồn thống kê chính phủ (MLIT, JNTO).</p>
                </div>
                <div>
                  <h4 className="text-brand-blue font-mono text-xs uppercase tracking-widest font-bold mb-2">Phương pháp</h4>
                  <p className="text-sm text-brand-blue-light/80 leading-relaxed">Trích xuất số liệu chuỗi thời gian, chuẩn hoá đơn vị và xây dựng hệ thống trực quan hoá (Data Viz) bằng Recharts.</p>
                </div>
                <div>
                  <h4 className="text-brand-blue font-mono text-xs uppercase tracking-widest font-bold mb-2">Kỹ năng thể hiện</h4>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['Data Extraction', 'Data Viz', 'Recharts', 'React', 'Storytelling'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-mono text-brand-blue-light border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-500 py-12 text-center text-sm">
        <div className="max-w-4xl mx-auto px-6">
          <p className="mb-2">Dự án cá nhân · Phân tích & trực quan hoá dữ liệu du lịch di sản Nhật Bản</p>
          <p>Bản gốc: Niên luận ngành Nhật Bản học, Khoa Đông Phương học, ĐHKHXH&NV, ĐHQGHN</p>
        </div>
      </footer>
    </div>
  );
}
