'use client';

import React from 'react';
import { Users, Activity, Monitor, Compass, RefreshCw, Trash2 } from 'lucide-react';
import { VisitorAnalyticsSummary } from '../../lib/visitorTracking';

interface VisitorsTabProps {
  visitorAnalytics: VisitorAnalyticsSummary;
  refreshVisitorData: () => void;
  clearVisitorLogs: () => void;
}

export default function VisitorsTab({
  visitorAnalytics,
  refreshVisitorData,
  clearVisitorLogs,
}: VisitorsTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-brand-blue-light/80 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 mb-1.5">
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Khách truy cập</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{visitorAnalytics.uniqueVisitorsCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Người xem độc nhất (Unique)</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-brand-blue-light/80 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-1.5">
            <Activity className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Tổng tương tác</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{visitorAnalytics.totalActions}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Lượt xem & Click nút</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-brand-blue-light/80 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 mb-1.5">
            <Monitor className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Thiết bị chủ yếu</span>
          </div>
          <p className="text-base font-extrabold text-slate-900 truncate">
            {Object.keys(visitorAnalytics.deviceBreakdown)[0] || 'Desktop'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Môi trường xem trang</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-brand-blue-light/80 shadow-xs">
          <div className="flex items-center gap-2 text-purple-600 mb-1.5">
            <Compass className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Mục xem nhiều</span>
          </div>
          <p className="text-base font-extrabold text-slate-900 truncate">
            {Object.keys(visitorAnalytics.topSections)[0] || 'Giới thiệu'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Nội dung thu hút nhất</p>
        </div>
      </div>

      {/* Live Visitor Feed Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Nhật ký Hành vi Người xem Chi tiết (Live Activity Feed)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Biết rõ ai đã vào website, dùng thiết bị/trình duyệt gì, đã bấm xem mục nào, dự án nào và lúc mấy giờ.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshVisitorData}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Làm mới
            </button>

            {visitorAnalytics.recentActions.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc muốn xóa sạch toàn bộ lịch sử theo dõi khách xem?')) {
                    clearVisitorLogs();
                    refreshVisitorData();
                  }
                }}
                className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa nhật ký
              </button>
            )}
          </div>
        </div>

        {visitorAnalytics.recentActions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-medium">Chưa có dữ liệu hành vi nào của khách xem.</p>
            <p className="text-xs">Khi có người mở web hoặc bấm các nút, dữ liệu sẽ tự động xuất hiện tại đây.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="p-3">Thời gian</th>
                  <th className="p-3">Người xem (Visitor)</th>
                  <th className="p-3">Hành động đã làm</th>
                  <th className="p-3">Chi tiết bổ sung</th>
                  <th className="p-3 text-right">Phân loại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visitorAnalytics.recentActions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 text-slate-500 whitespace-nowrap font-mono">{item.timestamp}</td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{item.visitorLabel}</div>
                      <div className="text-[10px] text-slate-400">Màn hình: {item.screenResolution || 'N/A'}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{item.action}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{item.details || '-'}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.category === 'pageview'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : item.category === 'project'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : item.category === 'contact'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.category === 'download'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.category.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
