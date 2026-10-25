'use client';

import React from 'react';
import { FolderGit2, Plus, Save, Trash2 } from 'lucide-react';
import { ProjectData } from '@/app/types';

interface ProjectsManagerTabProps {
  projectsForm: ProjectData[];
  setProjectsForm: React.Dispatch<React.SetStateAction<ProjectData[]>>;
  onSave: () => void;
  isSaving: boolean;
}

export default function ProjectsManagerTab({
  projectsForm,
  setProjectsForm,
  onSave,
  isSaving,
}: ProjectsManagerTabProps) {
  const handleAddProject = () => {
    const newProj: ProjectData = {
      id: `proj-custom-${Date.now()}`,
      title: 'Dự án mới tạo',
      desc: 'Mô tả tóm tắt nội dung phân tích dữ liệu của dự án...',
      tags: ['SQL', 'Python', 'Power BI'],
      metrics: [{ label: 'Tăng trưởng GMV', value: '+25%', change: '+25%', isPositive: true }],
      demoUrl: '',
      githubUrl: '',
      embedUrl: '',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
      featured: false,
      problem: 'Xác định các điểm nghẽn hiệu suất và cơ hội cải thiện...',
      method: 'Thu thập dữ liệu, làm sạch bằng Python, mô hình hoá bằng SQL và trực quan hoá dashboard...',
      insight: 'Tối ưu hoá kênh chuyển đổi và tăng tỷ lệ giữ chân khách hàng...',
      content: '## Giới thiệu Dự án\n\nNội dung chi tiết tài liệu nghiên cứu tình huống...',
    };
    setProjectsForm([newProj, ...projectsForm]);
  };

  const handleRemoveProject = (id: string) => {
    setProjectsForm(projectsForm.filter((p) => p.id !== id));
  };

  const handleUpdateProjectField = <K extends keyof ProjectData>(idx: number, field: K, val: ProjectData[K]) => {
    const updated = [...projectsForm];
    updated[idx] = { ...updated[idx], [field]: val };
    setProjectsForm(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            Danh sách Dự án Portfolio ({projectsForm.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quản lý nội dung, hình ảnh, liên kết demo, github và iframe embed của từng dự án
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddProject}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0D7287] hover:bg-[#074553] text-white dark:bg-[#9BE7FA] dark:text-slate-950 dark:hover:bg-[#C8EEF7] font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Dự Án Mới</span>
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0D7287] hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu Dự Án</span>
          </button>
        </div>
      </div>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
        {projectsForm.map((proj, idx) => (
          <div
            key={proj.id || idx}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 tabular-nums text-xs font-bold">
                  #{idx + 1}
                </span>
                <span className="tabular-nums text-xs text-slate-400">ID: {proj.id}</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(proj.featured)}
                    onChange={(e) => handleUpdateProjectField(idx, 'featured', e.target.checked)}
                    className="rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>⭐ Featured</span>
                </label>

                <button
                  onClick={() => handleRemoveProject(proj.id)}
                  className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  title="Xóa dự án"
                  aria-label="Xóa dự án"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tiêu đề Dự án
                </label>
                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => handleUpdateProjectField(idx, 'title', e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mô tả Ngắn (Summary Description)
                </label>
                <textarea
                  rows={2}
                  value={proj.desc}
                  onChange={(e) => handleUpdateProjectField(idx, 'desc', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed font-lora"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ảnh Bìa URL (Image URL)
                </label>
                <input
                  type="text"
                  value={proj.img || ''}
                  placeholder="https://images.unsplash.com/..."
                  onChange={(e) => handleUpdateProjectField(idx, 'img', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tags Phân loại (Ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={(proj.tags || []).join(', ')}
                  onChange={(e) =>
                    handleUpdateProjectField(
                      idx,
                      'tags',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Demo / Report URL (hoặc file PDF)
                </label>
                <input
                  type="text"
                  value={proj.demoUrl || ''}
                  placeholder="/website.pdf hoặc https://demo.com"
                  onChange={(e) => handleUpdateProjectField(idx, 'demoUrl', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  value={proj.githubUrl || ''}
                  placeholder="https://github.com/..."
                  onChange={(e) => handleUpdateProjectField(idx, 'githubUrl', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Iframe Embed URL (Trực quan hóa nhúng ngoài)
                </label>
                <input
                  type="text"
                  value={proj.embedUrl || ''}
                  placeholder="https://lookerstudio.google.com/embed/..."
                  onChange={(e) => handleUpdateProjectField(idx, 'embedUrl', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bài toán Kinh doanh (Problem)
                </label>
                <textarea
                  rows={3}
                  value={proj.problem || ''}
                  onChange={(e) => handleUpdateProjectField(idx, 'problem', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-lora"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phương pháp Xử lý (Methodology)
                </label>
                <textarea
                  rows={3}
                  value={proj.method || ''}
                  onChange={(e) => handleUpdateProjectField(idx, 'method', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-lora"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Insight Giá Trị Đạt Được (Key Insight)
                </label>
                <textarea
                  rows={2}
                  value={proj.insight || ''}
                  onChange={(e) => handleUpdateProjectField(idx, 'insight', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-lora"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tài liệu Case Study Chi tiết (Markdown format)
                </label>
                <textarea
                  rows={6}
                  value={proj.content || ''}
                  placeholder="## Mục Tiêu Phân Tích..."
                  onChange={(e) => handleUpdateProjectField(idx, 'content', e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
