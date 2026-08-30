'use client';

import React, { useRef } from 'react';
import { User, Camera, Upload, Trash2, Plus } from 'lucide-react';
import { ProfileData, ExperienceItem, SkillItem, CareerGoalItem } from '../../types';

interface ProfileTabProps {
  formProfile: ProfileData;
  setFormProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
}

export default function ProfileTab({ formProfile, setFormProfile }: ProfileTabProps) {
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFormProfile((prev) => ({ ...prev, avatarUrl: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCareerGoalAdd = () => {
    const newGoal: CareerGoalItem = {
      id: `goal-${Date.now()}`,
      title: 'Mục tiêu chiến lược mới',
      desc: 'Mô tả chi tiết về định hướng và năng lực...',
      icon: 'list',
    };
    setFormProfile((prev) => ({
      ...prev,
      careerGoalsList: [...(prev.careerGoalsList || []), newGoal],
    }));
  };

  const handleCareerGoalRemove = (id: string) => {
    setFormProfile((prev) => ({
      ...prev,
      careerGoalsList: (prev.careerGoalsList || []).filter((g) => g.id !== id),
    }));
  };

  const handleCareerGoalChange = (id: string, field: keyof CareerGoalItem, value: any) => {
    setFormProfile((prev) => ({
      ...prev,
      careerGoalsList: (prev.careerGoalsList || []).map((g) =>
        g.id === id ? { ...g, [field]: value } : g
      ),
    }));
  };

  const handleSkillAdd = () => {
    const newSkill: SkillItem = {
      id: `skill-${Date.now()}`,
      name: 'Kỹ năng mới',
      category: 'Core Skills',
      level: 5,
      icon: 'python',
    };
    setFormProfile((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
  };

  const handleSkillRemove = (id: string) => {
    setFormProfile((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
  };

  const handleSkillChange = (id: string, field: keyof SkillItem, value: any) => {
    setFormProfile((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const handleExpAdd = (type: 'education' | 'work') => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      type,
      role: type === 'education' ? 'Bằng cấp / Khóa học mới' : 'Vị trí công việc mới',
      company: 'Tên trường / Doanh nghiệp',
      period: '2024 - Hiện tại',
      description: ['Mô tả chi tiết về quá trình học tập hoặc thành tích làm việc...'],
    };
    setFormProfile((prev) => ({ ...prev, experiences: [newExp, ...prev.experiences] }));
  };

  const handleExpRemove = (id: string) => {
    setFormProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  const handleExpChange = (id: string, field: keyof ExperienceItem, value: any) => {
    setFormProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-blue-light/80 shadow-sm space-y-6 animate-in fade-in duration-200">
      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        <User className="w-5 h-5 text-slate-900" />
        Thông tin Hồ sơ & Lý lịch Cá nhân
      </h3>

      {/* Avatar Upload & Preview Card */}
      <div className="p-5 bg-slate-50 border border-brand-blue-light rounded-2xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-brand-blue-light/40 flex-shrink-0 relative flex items-center justify-center">
          {formProfile.avatarUrl ? (
            <img
              src={formProfile.avatarUrl}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-yellow text-slate-900 text-3xl font-extrabold">
              {formProfile.name ? formProfile.name.charAt(0) : 'A'}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3 w-full">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-slate-900" />
              Ảnh đại diện (Avatar)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Tải ảnh chân dung của bạn từ máy tính lên hoặc nhập liên kết ảnh trực tiếp
            </p>
          </div>

          <input
            ref={avatarFileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleAvatarFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => avatarFileInputRef.current?.click()}
              className="px-4 py-2 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Tải ảnh từ máy tính
            </button>

            {formProfile.avatarUrl && (
              <button
                type="button"
                onClick={() => setFormProfile((prev) => ({ ...prev, avatarUrl: '' }))}
                className="px-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa ảnh đại diện
              </button>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Hoặc nhập URL ảnh (https://...)"
              value={formProfile.avatarUrl || ''}
              onChange={(e) => setFormProfile((prev) => ({ ...prev, avatarUrl: e.target.value }))}
              className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-700 font-mono"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
            Họ và Tên
          </label>
          <input
            type="text"
            value={formProfile.name}
            onChange={(e) => setFormProfile((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold text-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
            Tên phụ / English Name
          </label>
          <input
            type="text"
            value={formProfile.subtitle || ''}
            placeholder="Placeholder Name"
            onChange={(e) => setFormProfile((prev) => ({ ...prev, subtitle: e.target.value }))}
            className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold text-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
            Chức danh / Tiêu đề chuyên môn
          </label>
          <input
            type="text"
            value={formProfile.title}
            onChange={(e) => setFormProfile((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs font-bold text-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
            Email liên hệ
          </label>
          <input
            type="email"
            value={formProfile.email || ''}
            onChange={(e) => setFormProfile((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-800"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
            Link GitHub
          </label>
          <input
            type="text"
            value={formProfile.github || ''}
            onChange={(e) => setFormProfile((prev) => ({ ...prev, github: e.target.value }))}
            className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-800"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
            Link LinkedIn
          </label>
          <input
            type="text"
            value={formProfile.linkedin || ''}
            onChange={(e) => setFormProfile((prev) => ({ ...prev, linkedin: e.target.value }))}
            className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
          Tiểu sử giới thiệu (Bio)
        </label>
        <textarea
          rows={3}
          value={formProfile.bio}
          onChange={(e) => setFormProfile((prev) => ({ ...prev, bio: e.target.value }))}
          className="w-full px-3 py-2 bg-white border border-brand-blue-light rounded-xl text-xs text-slate-800 leading-relaxed"
        />
      </div>

      {/* Career Goals List Editor */}
      <div className="pt-4 border-t border-brand-blue-light/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Mục tiêu nghề nghiệp (Career Goals) ({formProfile.careerGoalsList?.length || 0})
            </h4>
            <p className="text-[11px] text-slate-500">Hiển thị ở cột bên phải phần Giới thiệu</p>
          </div>
          <button
            onClick={handleCareerGoalAdd}
            className="px-3 py-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Thêm Mục tiêu
          </button>
        </div>

        <div className="space-y-3">
          {(formProfile.careerGoalsList || []).map((goal) => (
            <div key={goal.id} className="p-4 bg-slate-50 border border-brand-blue-light rounded-2xl space-y-3 relative">
              <button
                onClick={() => handleCareerGoalRemove(goal.id)}
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                title="Xóa mục tiêu"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    Tiêu đề mục tiêu
                  </label>
                  <input
                    type="text"
                    value={goal.title}
                    onChange={(e) => handleCareerGoalChange(goal.id, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    Icon biểu tượng
                  </label>
                  <select
                    value={goal.icon || 'list'}
                    onChange={(e) => handleCareerGoalChange(goal.id, 'icon', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs"
                  >
                    <option value="list">List / Checklist</option>
                    <option value="cloud">Cloud Architecture</option>
                    <option value="network">Network / Hierarchy</option>
                    <option value="target">Target / Goal</option>
                    <option value="database">Database / Data</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  rows={2}
                  value={goal.desc}
                  onChange={(e) => handleCareerGoalChange(goal.id, 'desc', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Editor */}
      <div className="pt-4 border-t border-brand-blue-light/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Kỹ năng chuyên môn & Đánh giá Sao (Skills Matrix) ({formProfile.skills.length})
            </h4>
            <p className="text-[11px] text-slate-500">Hiển thị ở lưới thẻ kỹ năng hàng dưới</p>
          </div>
          <button
            onClick={handleSkillAdd}
            className="px-3 py-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Thêm Kỹ năng
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {formProfile.skills.map((skill) => (
            <div key={skill.id} className="p-3.5 bg-slate-50 border border-brand-blue-light rounded-2xl space-y-2.5 relative">
              <button
                onClick={() => handleSkillRemove(skill.id)}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                title="Xóa kỹ năng"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                  Tên Kỹ năng
                </label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                  className="w-full px-2.5 py-1 bg-white border border-brand-blue-light rounded-lg text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                    Số Sao (1 - 5)
                  </label>
                  <select
                    value={skill.level || 5}
                    onChange={(e) => handleSkillChange(skill.id, 'level', Number(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-brand-blue-light rounded-lg text-xs font-bold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 sao)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 sao)</option>
                    <option value={3}>⭐⭐⭐ (3 sao)</option>
                    <option value={2}>⭐⭐ (2 sao)</option>
                    <option value={1}>⭐ (1 sao)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                    Biểu tượng Icon
                  </label>
                  <select
                    value={skill.icon || 'python'}
                    onChange={(e) => handleSkillChange(skill.id, 'icon', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-brand-blue-light rounded-lg text-xs"
                  >
                    <option value="python">Python (&lt;/&gt;)</option>
                    <option value="sql">SQL (Database)</option>
                    <option value="devops">DevOps (Gears)</option>
                    <option value="javascript">JavaScript (JS)</option>
                    <option value="ml">Machine Learning (Brain)</option>
                    <option value="uiux">UI/UX Design (App)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education List Editor */}
      <div className="pt-4 border-t border-brand-blue-light/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              🎓 Học Vấn & Bằng Cấp (Education) ({formProfile.experiences.filter((e) => e.type === 'education').length})
            </h4>
            <p className="text-[11px] text-slate-500">Hiển thị ở Thẻ HỌC VẤN trên trang Học Vấn & Kinh Nghiệm</p>
          </div>
          <button
            onClick={() => handleExpAdd('education')}
            className="px-3 py-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" /> + Thêm Học vấn
          </button>
        </div>

        <div className="space-y-4">
          {formProfile.experiences
            .filter((e) => e.type === 'education')
            .map((exp) => (
              <div key={exp.id} className="p-4 bg-slate-50 border border-brand-blue-light rounded-2xl space-y-3 relative">
                <button
                  onClick={() => handleExpRemove(exp.id)}
                  className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  title="Xóa mục học vấn"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Chuyên ngành / Bằng cấp
                    </label>
                    <input
                      type="text"
                      value={exp.role}
                      placeholder="Chuyên ngành Quản trị thông tin"
                      onChange={(e) => handleExpChange(exp.id, 'role', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Trường Đại học / Tổ chức
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      placeholder="Đại học Quốc gia Hà Nội (VNU)"
                      onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Thời gian học
                    </label>
                    <input
                      type="text"
                      value={exp.period}
                      placeholder="2020 - 2024"
                      onChange={(e) => handleExpChange(exp.id, 'period', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    Mô tả trọng tâm / Nội dung đào tạo
                  </label>
                  <textarea
                    rows={2}
                    value={exp.description.join('\n')}
                    placeholder="Tập trung vào quản lý, phân tích và tối ưu hóa hệ thống thông tin dữ liệu."
                    onChange={(e) => handleExpChange(exp.id, 'description', e.target.value.split('\n'))}
                    className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs leading-relaxed font-normal"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Work Experience List Editor */}
      <div className="pt-4 border-t border-brand-blue-light/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              💼 Kinh Nghiệm Làm Việc & Nghiên Cứu ({formProfile.experiences.filter((e) => e.type === 'work').length})
            </h4>
            <p className="text-[11px] text-slate-500">Hiển thị ở Thẻ KINH NGHIỆM trên trang Học Vấn & Kinh Nghiệm</p>
          </div>
          <button
            onClick={() => handleExpAdd('work')}
            className="px-3 py-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" /> + Thêm Kinh nghiệm
          </button>
        </div>

        <div className="space-y-4">
          {formProfile.experiences
            .filter((e) => e.type === 'work')
            .map((exp) => (
              <div key={exp.id} className="p-4 bg-slate-50 border border-brand-blue-light rounded-2xl space-y-3 relative">
                <button
                  onClick={() => handleExpRemove(exp.id)}
                  className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  title="Xóa mục kinh nghiệm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Tiêu đề Kinh nghiệm / Vị trí / Đề tài
                    </label>
                    <input
                      type="text"
                      value={exp.role}
                      placeholder="1. Nghiên cứu Khoa học Sinh viên: Phân tích Du lịch Di sản tại Nhật Bản."
                      onChange={(e) => handleExpChange(exp.id, 'role', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                      Tên Công ty / Đơn vị tổ chức
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      placeholder="Steve x Kami Company"
                      onChange={(e) => handleExpChange(exp.id, 'company', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    Các gạch đầu dòng mô tả công việc (Mỗi dòng là một gạch đầu dòng •)
                  </label>
                  <textarea
                    rows={3}
                    value={exp.description.join('\n')}
                    placeholder="Sử dụng các phương pháp phân tích dữ liệu để đánh giá xu hướng..."
                    onChange={(e) => handleExpChange(exp.id, 'description', e.target.value.split('\n'))}
                    className="w-full px-3 py-1.5 bg-white border border-brand-blue-light rounded-lg text-xs leading-relaxed"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
