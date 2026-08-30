'use client';

import React from 'react';
import {
  Briefcase, Plus, Save, Star, ArrowUp, ArrowDown, Copy, Trash2,
  Image as ImageIcon, Upload, Sparkles, TrendingUp, FileText,
} from 'lucide-react';
import { ProjectData } from '../../types';

interface ProjectsTabProps {
  formProjects: ProjectData[];
  setFormProjects: React.Dispatch<React.SetStateAction<ProjectData[]>>;
  onSaveProjects: (projects: ProjectData[]) => void;
}

export default function ProjectsTab({
  formProjects,
  setFormProjects,
  onSaveProjects,
}: ProjectsTabProps) {
  const handleProjectAdd = () => {
    const newProj: ProjectData = {
      id: `proj-${Date.now()}`,
      title: 'Dự án Phân tích Dữ liệu Mới',
      desc: 'Mô tả ngắn gọn về bài toán kinh doanh, phương pháp tiếp cận và kết quả đạt được.',
      tags: ['Python', 'SQL', 'Power BI'],
      tools: ['SQL', 'Python', 'Power BI'],
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      featured: false,
      problem: 'Mô tả bài toán kinh doanh thực tế cần giải quyết...',
      method: 'Quy trình thu thập, tiền xử lý và xây dựng pipeline phân tích...',
      insight: 'Những phát hiện cốt lõi và giá trị đo lường được cho doanh nghiệp...',
      metrics: [
        { label: 'Tăng Trưởng Doanh Số', value: '+24.5%', change: 'MoM', isPositive: true },
        { label: 'Tỷ Lệ Chuyển Đổi', value: '3.8%', change: '+1.2%', isPositive: true },
        { label: 'Quy Mô Xử Lý Dữ Liệu', value: '1.2M+', change: 'Dòng', isPositive: true },
      ],
      content: '# Giới thiệu Dự án\n\n## 1. Bối cảnh & Vấn đề\n\n## 2. Phương pháp Phân tích\n\n## 3. Kết quả & Đề xuất Chiến lược\n',
    };
    setFormProjects((prev) => [newProj, ...prev]);
  };

  const handleProjectDuplicate = (projId: string) => {
    const original = formProjects.find((p) => p.id === projId);
    if (!original) return;
    const duplicated: ProjectData = {
      ...original,
      id: `proj-${Date.now()}`,
      title: `${original.title} (Bản sao)`,
    };
    const index = formProjects.findIndex((p) => p.id === projId);
    const updated = [...formProjects];
    updated.splice(index + 1, 0, duplicated);
    setFormProjects(updated);
  };

  const handleProjectMove = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === formProjects.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...formProjects];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormProjects(updated);
  };

  const handleProjectRemove = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa dự án này không?')) {
      setFormProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleProjectChange = (id: string, field: keyof ProjectData, value: any) => {
    setFormProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleProjectImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        handleProjectChange(id, 'img', base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProjectMetricAdd = (projId: string) => {
    setFormProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projId) return p;
        const currentMetrics = p.metrics || [];
        return {
          ...p,
          metrics: [
            ...currentMetrics,
            { label: 'Chỉ số mới', value: '100%', change: '+10%', isPositive: true },
          ],
        };
      })
    );
  };

  const handleProjectMetricRemove = (projId: string, metricIndex: number) => {
    setFormProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projId) return p;
        const currentMetrics = p.metrics || [];
        return {
          ...p,
          metrics: currentMetrics.filter((_, idx) => idx !== metricIndex),
        };
      })
    );
  };

  const handleProjectMetricChange = (
    projId: string,
    metricIndex: number,
    field: string,
    val: any
  ) => {
    setFormProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projId) return p;
        const currentMetrics = [...(p.metrics || [])];
        if (currentMetrics[metricIndex]) {
          currentMetrics[metricIndex] = { ...currentMetrics[metricIndex], [field]: val };
        }
        return { ...p, metrics: currentMetrics };
      })
    );
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-blue-light/60">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-slate-900" />
            Quản lý & Chỉnh sửa Dự án ({formProjects.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tùy chỉnh toàn diện thông tin dự án, bộ 3 trụ cột dữ liệu (Problem - Method - Insight), KPI đo lường, ảnh đại diện và bài viết Markdown.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleProjectAdd}
            className="px-4 py-2 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Thêm Dự án Mới
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveProjects(formProjects);
              alert('🎉 Đã lưu toàn bộ danh sách dự án thành công!');
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Lưu Dự Án Ngay
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {formProjects.map((proj, idx) => (
          <div key={proj.id} className="p-6 bg-slate-50/80 border border-brand-blue-light rounded-3xl space-y-6 shadow-xs relative">
            {/* Project Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-blue-light/80">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-7 h-7 rounded-full bg-brand-yellow text-slate-900 text-xs font-black flex items-center justify-center shadow-xs">
                  {idx + 1}
                </span>
                <h4 className="text-base font-bold text-slate-900">{proj.title}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                  ID: {proj.id}
                </span>
                {proj.featured && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Nổi Bật
                  </span>
                )}
              </div>

              {/* Top action buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleProjectMove(idx, 'up')}
                  className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-600 rounded-lg border border-slate-200 transition-all cursor-pointer"
                  title="Di chuyển lên trên"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === formProjects.length - 1}
                  onClick={() => handleProjectMove(idx, 'down')}
                  className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-600 rounded-lg border border-slate-200 transition-all cursor-pointer"
                  title="Di chuyển xuống dưới"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleProjectDuplicate(proj.id)}
                  className="p-1.5 bg-white hover:bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-200 transition-all cursor-pointer"
                  title="Nhân bản dự án"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleProjectRemove(proj.id)}
                  className="p-1.5 bg-white hover:bg-red-50 text-red-600 rounded-lg border border-red-200 transition-all cursor-pointer"
                  title="Xóa dự án"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Tên Dự Án
                </label>
                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => handleProjectChange(proj.id, 'title', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold text-slate-900 shadow-2xs"
                />
              </div>

              <div className="md:col-span-4 flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-2 bg-white border border-brand-blue-light rounded-xl w-full">
                  <input
                    type="checkbox"
                    checked={!!proj.featured}
                    onChange={(e) => handleProjectChange(proj.id, 'featured', e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Star className={`w-3.5 h-3.5 ${proj.featured ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                    Đánh dấu Dự án Nổi Bật
                  </span>
                </label>
              </div>

              <div className="md:col-span-6">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Thẻ Công Nghệ Tags (Phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={proj.tags.join(', ')}
                  onChange={(e) => handleProjectChange(proj.id, 'tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                  placeholder="Python, SQL, Recharts..."
                  className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-semibold text-slate-800 shadow-2xs"
                />
              </div>

              <div className="md:col-span-6">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Công Cụ Phân Tích Tools (Phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={(proj.tools || []).join(', ')}
                  onChange={(e) => handleProjectChange(proj.id, 'tools', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                  placeholder="SQL, Python, Power BI, MySQL, Redis..."
                  className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-semibold text-slate-800 shadow-2xs"
                />
              </div>

              <div className="md:col-span-12">
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Mô Tả Tóm Tắt (Card Description)
                </label>
                <textarea
                  rows={2}
                  value={proj.desc}
                  onChange={(e) => handleProjectChange(proj.id, 'desc', e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-800 leading-relaxed shadow-2xs"
                />
              </div>
            </div>

            {/* Thumbnail Image Section */}
            <div className="p-4 bg-white border border-brand-blue-light/80 rounded-2xl space-y-3">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-slate-700" />
                Ảnh Đại Diện Thumbnail Dự Án
              </h5>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 flex items-center justify-center">
                  {proj.img ? (
                    <img src={proj.img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">Chưa có ảnh</span>
                  )}
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      Tải ảnh từ máy tính
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/gif"
                        className="hidden"
                        onChange={(e) => handleProjectImageUpload(proj.id, e)}
                      />
                    </label>
                    {proj.img && (
                      <button
                        type="button"
                        onClick={() => handleProjectChange(proj.id, 'img', '')}
                        className="px-2.5 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      >
                        Xóa ảnh
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={proj.img || ''}
                    onChange={(e) => handleProjectChange(proj.id, 'img', e.target.value)}
                    placeholder="Hoặc nhập liên kết URL ảnh (https://...)"
                    className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-700 font-mono shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  URL Báo Cáo / Live Demo
                </label>
                <input
                  type="text"
                  value={proj.demoUrl || ''}
                  onChange={(e) => handleProjectChange(proj.id, 'demoUrl', e.target.value)}
                  placeholder="https://... hoặc /website.pdf"
                  className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-700 font-mono shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  URL GitHub Source Code
                </label>
                <input
                  type="text"
                  value={proj.githubUrl || ''}
                  onChange={(e) => handleProjectChange(proj.id, 'githubUrl', e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-700 font-mono shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  URL Nhúng Iframe Preview
                </label>
                <input
                  type="text"
                  value={proj.embedUrl || ''}
                  onChange={(e) => handleProjectChange(proj.id, 'embedUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-700 font-mono shadow-2xs"
                />
              </div>
            </div>

            {/* 3 Data Storytelling Pillars */}
            <div className="p-4 bg-white border border-brand-blue-light/80 rounded-2xl space-y-4">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Bộ 3 Trụ Cột Kể Chuyện Dữ Liệu (Data Storytelling Framework)
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    1. Bài Toán & Vấn Đề (Problem)
                  </label>
                  <textarea
                    rows={3}
                    value={proj.problem || ''}
                    onChange={(e) => handleProjectChange(proj.id, 'problem', e.target.value)}
                    placeholder="Vấn đề thực tế của doanh nghiệp..."
                    className="w-full p-2.5 bg-slate-50 border border-brand-blue-light rounded-xl text-xs text-slate-800 leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    2. Phương Pháp & Pipeline (Method)
                  </label>
                  <textarea
                    rows={3}
                    value={proj.method || ''}
                    onChange={(e) => handleProjectChange(proj.id, 'method', e.target.value)}
                    placeholder="Quy trình xử lý dữ liệu và thuật toán..."
                    className="w-full p-2.5 bg-slate-50 border border-brand-blue-light rounded-xl text-xs text-slate-800 leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    3. Kết Quả & Insight (Insight)
                  </label>
                  <textarea
                    rows={3}
                    value={proj.insight || ''}
                    onChange={(e) => handleProjectChange(proj.id, 'insight', e.target.value)}
                    placeholder="Tác động đo lường được và bài học cốt lõi..."
                    className="w-full p-2.5 bg-slate-50 border border-brand-blue-light rounded-xl text-xs text-slate-800 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Project KPI Metrics Editor */}
            <div className="p-4 bg-white border border-brand-blue-light/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Bộ Chỉ Số Đo Lường Định Lượng ({proj.metrics?.length || 0} KPIs)
                </h5>

                <button
                  type="button"
                  onClick={() => handleProjectMetricAdd(proj.id)}
                  className="px-3 py-1 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm KPI
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(proj.metrics || []).map((m, mIdx) => (
                  <div key={mIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative group">
                    <button
                      type="button"
                      onClick={() => handleProjectMetricRemove(proj.id, mIdx)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 rounded hover:bg-white transition-colors cursor-pointer"
                      title="Xóa KPI này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Tên chỉ số</label>
                      <input
                        type="text"
                        value={m.label}
                        onChange={(e) => handleProjectMetricChange(proj.id, mIdx, 'label', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Giá trị</label>
                        <input
                          type="text"
                          value={m.value}
                          onChange={(e) => handleProjectMetricChange(proj.id, mIdx, 'value', e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-extrabold text-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Ghi chú phụ</label>
                        <input
                          type="text"
                          value={m.change || ''}
                          onChange={(e) => handleProjectMetricChange(proj.id, mIdx, 'change', e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={m.isPositive !== false}
                          onChange={(e) => handleProjectMetricChange(proj.id, mIdx, 'isPositive', e.target.checked)}
                          className="w-3.5 h-3.5 text-emerald-600 rounded cursor-pointer"
                        />
                        Tăng trưởng tích cực (Xanh)
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Markdown Content Editor */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-700" />
                  Nội Dung Bài Viết Chi Tiết (Hỗ trợ cú pháp Markdown chuẩn)
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {proj.content ? `${proj.content.length} ký tự` : '0 ký tự'}
                </span>
              </label>
              <textarea
                rows={8}
                value={proj.content || ''}
                onChange={(e) => handleProjectChange(proj.id, 'content', e.target.value)}
                placeholder="# Giới thiệu dự án&#10;&#10;## 1. Bài toán kinh doanh&#10;..."
                className="w-full p-4 bg-white border border-brand-blue-light rounded-2xl text-xs font-mono text-slate-900 leading-relaxed shadow-2xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
