import React from 'react';
import { Wifi, Wind, BatteryCharging, Coffee, BookOpen, Bus } from 'lucide-react';
import { WireframeBar, WireframeCrossBox, WireframePill } from './WireframeHelpers';

export const renderBookDetailWireframe = (sheetNum: 1 | 2) => {
  if (sheetNum === 1) {
    return (
      <div data-ui="wireframe-mock" className="space-y-3">
        <div className="flex justify-between items-center pb-2 border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-300" />
            <WireframeBar w="w-16" h="h-3" />
          </div>
          <div className="hidden sm:flex gap-2">
            <WireframeBar w="w-8" h="h-2" />
            <WireframeBar w="w-8" h="h-2" />
            <WireframeBar w="w-8" h="h-2" />
          </div>
          <WireframePill w="w-12" h="h-4" />
        </div>

        <div className="flex gap-2 items-center">
          <WireframeBar w="w-10" h="h-1.5" />
          <span className="text-xs text-slate-300">&gt;</span>
          <WireframeBar w="w-12" h="h-1.5" />
          <span className="text-xs text-slate-300">&gt;</span>
          <WireframeBar w="w-16" h="h-1.5" />
        </div>

        <div className="space-y-1">
          <WireframeBar w="w-48" h="h-4" />
          <WireframeBar w="w-32" h="h-2" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <WireframeCrossBox aspect="aspect-4/3" className="w-full" />
          </div>
          <div className="col-span-1 flex flex-col gap-1.5">
            <WireframeCrossBox aspect="aspect-square" className="w-full" />
            <WireframeCrossBox aspect="aspect-square" className="w-full" />
            <WireframeCrossBox aspect="aspect-square" className="w-full" />
          </div>
        </div>

        <div className="p-2 bg-slate-100 rounded-lg flex justify-between items-center">
          <div className="flex gap-1 items-center"><div className="w-3 h-3 rounded bg-slate-300" /><WireframeBar w="w-6" h="h-1.5" /></div>
          <div className="flex gap-1 items-center"><div className="w-3 h-3 rounded bg-slate-300" /><WireframeBar w="w-6" h="h-1.5" /></div>
          <div className="flex gap-1 items-center"><div className="w-3 h-3 rounded bg-slate-300" /><WireframeBar w="w-6" h="h-1.5" /></div>
          <div className="flex gap-1 items-center"><div className="w-3 h-3 rounded bg-slate-300" /><WireframeBar w="w-6" h="h-1.5" /></div>
        </div>

        <div className="pt-1">
          <WireframeBar w="w-28" h="h-3" className="mb-2" />
          <div className="space-y-2">
            {[1, 2, 3].map((row) => (
              <div key={row} className="p-2 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1 shrink-0">
                    <WireframeCrossBox aspect="aspect-square" className="w-9 h-9 rounded" />
                    <div className="flex gap-0.5">
                      <div className="w-2.5 h-1.5 bg-slate-300 rounded-xs" />
                      <div className="w-2.5 h-1.5 bg-slate-300 rounded-xs" />
                      <div className="w-2.5 h-1.5 bg-slate-300 rounded-xs" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <WireframeBar w="w-24" h="h-2.5" />
                    <div className="flex gap-2">
                      <WireframeBar w="w-8" h="h-1.5" />
                      <WireframeBar w="w-8" h="h-1.5" />
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <WireframeBar w="w-10" h="h-2.5" />
                  <WireframePill w="w-12" h="h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-ui="wireframe-mock" className="space-y-3">
      <div className="text-center py-1 border-slate-200">
        <WireframeBar w="w-16" h="h-2.5" className="mx-auto" />
      </div>

      <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-200">
        <div className="w-12 h-12 rounded-full border-2 border-slate-400 flex items-center justify-center tabular-nums font-bold text-xs text-slate-500">
          9.7
        </div>
        <div className="flex-1 space-y-1.5">
          <WireframeBar w="w-full" h="h-1" />
          <WireframeBar w="w-3/4" h="h-1" />
          <WireframeBar w="w-1/2" h="h-1" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <WireframeBar w="w-20" h="h-2" />
          <WireframePill w="w-10" h="h-3" />
        </div>
        <div data-ui="wireframe-box" className="p-2 border border-slate-200 rounded-lg space-y-1">
          <WireframeBar w="w-24" h="h-2" />
          <WireframeBar w="w-full" h="h-1.5" />
          <WireframeBar w="w-5/6" h="h-1.5" />
        </div>
      </div>

      <div className="space-y-1.5">
        <WireframeBar w="w-24" h="h-2" />
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} data-ui="wireframe-card" className="p-1 border border-slate-200 rounded space-y-1">
              <WireframeCrossBox aspect="aspect-square" className="w-full" />
              <WireframeBar w="w-full" h="h-1" />
              <WireframeBar w="w-2/3" h="h-1" />
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 bg-slate-200 rounded text-center">
        <WireframeBar w="w-36" h="h-2.5" className="mx-auto mb-1" />
        <WireframePill w="w-16" h="h-3.5" className="mx-auto" />
      </div>
    </div>
  );
};

export const renderBookDetailUI = (sheetNum: 1 | 2) => {
  if (sheetNum === 1) {
    return (
      <div className="space-y-3 font-sans text-slate-800 dark:text-slate-100">
        <div className="flex justify-between items-center pb-2 border-[#9BE7FA]/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#0D7287] flex items-center justify-center text-white font-sans font-black text-xs">
              LB
            </div>
            <span className="font-sans font-black text-xs text-[#0D7287] dark:text-[#9BE7FA] tracking-tight">Library Bus</span>
          </div>
          <div className="hidden sm:flex gap-3 text-xs font-bold text-[#0D7287] dark:text-[#9BE7FA]">
            <span className="text-[#0D7287] hover:underline cursor-pointer dark:text-[#9BE7FA]">Tra cứu</span>
            <span className="hover:underline cursor-pointer">Bản đồ</span>
            <span className="hover:underline cursor-pointer">Lịch trình</span>
          </div>
          <button className="px-2.5 py-1 rounded-full bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-extrabold shadow-xs transition-colors">
            Đăng nhập
          </button>
        </div>

        <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
          <span>Trang chủ</span> <span>/</span> <span>Kho sách</span> <span>/</span> <span className="text-[#0D7287] dark:text-[#9BE7FA] font-bold">Bản Cực (Origin)</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-sans font-black text-sm text-[#0D7287] dark:text-[#9BE7FA]">Bản Cực (Origin) - Dan Brown</h3>
            <span className="px-1.5 py-0.5 rounded bg-[#FFD14C]/80 text-slate-950 text-xs font-black">Có sẵn</span>
          </div>
          <p className="text-xs text-slate-500">Mã sách: BK-DAN-8802 • NXB Tổng hợp TP.HCM • 2021</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3 rounded-xl overflow-hidden shadow-xs border border-[#9BE7FA]/40 relative group p-3 text-white flex flex-col justify-between h-32 bg-[#074553]">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded bg-black/40 text-[#FFD14C] text-xs font-bold">
                ⭐ 4.8 / 5.0
              </span>
              <BookOpen className="w-4 h-4 text-[#9BE7FA] opacity-90" />
            </div>
            <div className="space-y-0.5 border-l-2 border-[#FFD14C] pl-2">
              <div className="text-xs font-sans font-black tracking-wide text-white">ORIGIN</div>
              <div className="text-xs font-sans text-[#FFE485]">DAN BROWN</div>
            </div>
            <div className="flex justify-between text-xs tabular-nums text-[#C8EEF7] border-white/20 pt-1">
              <span>THƯ VIỆN SỐ</span>
              <span>BẢN CHUẨN</span>
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-1.5">
            <div className="w-full h-9 rounded-lg border border-[#9BE7FA]/40 p-1 flex items-center justify-center text-xs font-bold text-white shadow-2xs bg-[#0D7287]">
              Bìa 1
            </div>
            <div className="w-full h-9 rounded-lg border border-[#9BE7FA]/40 p-1 flex items-center justify-center text-xs font-bold text-[#FFD14C] shadow-2xs bg-[#074553]">
              Mục lục
            </div>
            <div className="w-full h-9 rounded-lg border border-[#9BE7FA]/40 p-1 flex items-center justify-center text-xs font-bold text-slate-950 shadow-2xs bg-[#FFD14C]">
              Lời tựa
            </div>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-[#F0F9FB] border border-[#9BE7FA]/30 grid grid-cols-4 gap-1 text-xs text-center dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-center gap-1 font-bold text-[#0D7287] dark:text-[#9BE7FA]"><Wifi className="w-3 h-3 text-[#0D7287] dark:text-[#9BE7FA]" /> WiFi 5G</div>
          <div className="flex items-center justify-center gap-1 font-bold text-[#0D7287] dark:text-[#9BE7FA]"><Wind className="w-3 h-3 text-[#0D7287] dark:text-[#9BE7FA]" /> Máy lạnh</div>
          <div className="flex items-center justify-center gap-1 font-bold text-[#0D7287] dark:text-[#9BE7FA]"><BatteryCharging className="w-3 h-3 text-[#0D7287] dark:text-[#9BE7FA]" /> Sạc Type-C</div>
          <div className="flex items-center justify-center gap-1 font-bold text-[#0D7287] dark:text-[#9BE7FA]"><Coffee className="w-3 h-3 text-[#0D7287] dark:text-[#9BE7FA]" /> Trà miễn phí</div>
        </div>

        <div className="pt-1">
          <h4 className="font-sans font-black text-xs text-[#0D7287] dark:text-[#9BE7FA] mb-1.5 flex items-center justify-between">
            <span>Đang có trên các xe buýt lưu động:</span>
            <span className="text-xs text-slate-500 font-sans font-normal">3 xe đang dừng</span>
          </h4>
          <div className="space-y-1.5">
            {[
              { name: 'Bus 01: KĐT Linh Đàm', dist: '0.8 km', eta: '10 phút', copies: 2, status: 'Còn sách' },
              { name: 'Bus 04: ĐH Quốc Gia HN', dist: '2.4 km', eta: '35 phút', copies: 1, status: 'Còn sách' },
              { name: 'Bus 07: THPT Chu Văn An', dist: '4.1 km', eta: '50 phút', copies: 0, status: 'Đã đặt hết' },
            ].map((bus, idx) => (
              <div key={idx} className="p-2 rounded-xl border border-[#9BE7FA]/30 bg-white dark:bg-slate-800 dark:border-slate-700 flex items-center justify-between shadow-2xs hover:border-[#0D7287] transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#C8EEF7]/50 text-[#0D7287] dark:bg-slate-700 dark:text-[#9BE7FA] flex items-center justify-center font-bold">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{bus.name}</div>
                    <div className="text-xs text-slate-500">Cách {bus.dist} • Dừng tiếp sau {bus.eta}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-bold ${bus.copies > 0 ? 'bg-cyan-50 text-[#0D7287] border border-[#9BE7FA]/40 dark:bg-slate-900 dark:text-[#9BE7FA]' : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400'}`}>
                    {bus.status}
                  </span>
                  <button className="block mt-0.5 px-2 py-0.5 rounded-md bg-[#0D7287] hover:bg-[#074553] text-white text-xs font-bold">
                    Giữ sách
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans text-slate-800 dark:text-slate-100">
      <div className="text-center pb-1 border-[#9BE7FA]/40">
        <h4 className="font-sans font-black text-xs text-[#0D7287] dark:text-[#9BE7FA]">Độc giả đánh giá & Bình luận</h4>
      </div>

      <div className="p-3 rounded-2xl border border-[#9BE7FA]/40 flex items-center gap-3 dark:border-slate-700 bg-[#F0F9FB]">
        <div className="w-12 h-12 rounded-full bg-[#0D7287] text-[#FFD14C] font-sans font-black text-sm flex items-center justify-center shadow-xs">
          9.7
        </div>
        <div className="flex-1 text-xs">
          <div className="font-bold text-[#0D7287] dark:text-[#9BE7FA]">Xuất sắc • 128 lượt bình chọn</div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-[#FFD14C] h-full w-[97%]" />
          </div>
          <div className="text-xs text-slate-500 mt-0.5 flex justify-between">
            <span>Chất lượng sách: 9.8</span>
            <span>Tiện nghi xe: 9.6</span>
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-xl border border-[#9BE7FA]/30 bg-white dark:bg-slate-800 dark:border-slate-700 space-y-1">
        <div className="flex justify-between items-center text-xs">
          <div className="font-bold text-slate-900 dark:text-white">Nguyễn Hoàng Nam • Độc giả thân thiết</div>
          <span className="text-xs text-slate-400">12/03/2024</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
          &ldquo;Sách rất mới, xe buýt đỗ đúng giờ tại điểm đón ngã tư Linh Đàm. Thủ thư hỗ trợ mượn trả qua mã QR rất nhanh!&rdquo;
        </p>
      </div>

      <div className="space-y-1">
        <div className="text-xs font-sans font-bold text-[#0D7287] dark:text-[#9BE7FA]">Sách cùng tác giả / thể loại:</div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { title: 'Mật Mã Da Vinci', color: 'bg-[#074553]', textColor: 'text-[#FFD14C]' },
            { title: 'Thiên Thần & Ác Quỷ', color: 'bg-[#0D7287]', textColor: 'text-white' },
            { title: 'Biểu Tượng Thất Truyền', color: 'bg-[#042D36]', textColor: 'text-[#FFE485]' },
            { title: 'Hỏa Ngục', color: 'bg-[#0F262F]', textColor: 'text-[#9BE7FA]' },
          ].map((book, idx) => (
            <div key={idx} className="p-1.5 rounded-lg border border-[#9BE7FA]/30 bg-white dark:bg-slate-800 dark:border-slate-700 text-center group cursor-pointer hover:border-[#0D7287] transition-colors">
              <div className={`w-full h-11 rounded mb-1 ${book.color} flex flex-col items-center justify-center p-1 shadow-2xs`}>
                <BookOpen className={`w-3 h-3 ${book.textColor} mb-0.5 opacity-90`} />
                <span className={`text-xs font-black ${book.textColor} leading-none truncate max-w-full`}>DAN BROWN</span>
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{book.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-[#074553] text-white text-center space-y-1">
        <div className="text-xs font-bold text-[#FFD14C]">Sẵn sàng tiếp cận tri thức lưu động?</div>
        <button className="px-3 py-1 rounded-full bg-[#FFD14C] hover:bg-[#FFE485] text-slate-950 text-xs font-extrabold shadow-xs transition-colors">
          Đăng ký thẻ đọc miễn phí
        </button>
      </div>
    </div>
  );
};
