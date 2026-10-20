'use client';

import React from 'react';
import { User, Sparkles, FileText, Plus, Trash2, CheckCheck } from 'lucide-react';
import { ProfileData, SkillItem, ExperienceItem } from '@/app/types';

interface ProfileEditorTabProps {
  profileForm: ProfileData;
  setProfileForm: React.Dispatch<React.SetStateAction<ProfileData>>;
  onSave: () => void;
  isSaving: boolean;
}

export default function ProfileEditorTab({
  profileForm,
  setProfileForm,
  onSave,
  isSaving,
}: ProfileEditorTabProps) {
  // Skill Handlers
  const handleAddSkill = () => {
    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name: 'Kỹ năng mới',
      category: 'Languages & Querying',
      level: 5,
      proficiencyNote: 'Mô tả kinh nghiệm',
      tags: ['New'],
    };
    setProfileForm({
      ...profileForm,
      skills: [...(profileForm.skills || []), newSkill],
    });
  };

  const handleRemoveSkill = (id: string) => {
    setProfileForm({
      ...profileForm,
      skills: (profileForm.skills || []).filter((s) => s.id !== id),
    });
  };

  // Experience Handlers
  const handleAddExperience = (type: 'education' | 'work') => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      type,
      role: type === 'education' ? 'Ngành học mới' : 'Vị trí công việc mới',
      company: 'Tên tổ chức / Trường',
      period: '2024 - Hiện tại',
      description: ['Thành tích / Chi tiết trách nhiệm chính...'],
      location: 'Hà Nội, Việt Nam',
    };
    setProfileForm({
      ...profileForm,
      experiences: [...(profileForm.experiences || []), newExp],
    });
  };

  const handleRemoveExperience = (id: string) => {
    setProfileForm({
      ...profileForm,
      experiences: (profileForm.experiences || []).filter((e) => e.id !== id),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Basic Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            Thông tin Cơ bản
          </h3>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-3 py-1.5 bg-[#0D7287] hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition cursor-pointer shadow-xs"
          >
            Lưu phần này
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Họ và Tên
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Chức danh hiển thị (Job Title)
            </label>
            <input
              type="text"
              value={profileForm.title}
              onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Phụ đề / Headline (Subtitle)
            </label>
            <input
              type="text"
              value={profileForm.subtitle || ''}
              onChange={(e) => setProfileForm({ ...profileForm, subtitle: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ảnh đại diện URL (Avatar URL)
            </label>
            <input
              type="text"
              value={profileForm.avatarUrl || ''}
              placeholder="https://example.com/avatar.jpg"
              onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Liên hệ
            </label>
            <input
              type="email"
              value={profileForm.email || ''}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              GitHub URL
            </label>
            <input
              type="text"
              value={profileForm.github || ''}
              onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              LinkedIn URL
            </label>
            <input
              type="text"
              value={profileForm.linkedin || ''}
              onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mục tiêu Nghề nghiệp (Career Goal Overview)
            </label>
            <input
              type="text"
              value={profileForm.careerGoal || ''}
              onChange={(e) => setProfileForm({ ...profileForm, careerGoal: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Tiểu sử & Giới thiệu Tóm tắt (Bio)
          </label>
          <textarea
            rows={4}
            value={profileForm.bio}
            onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500 leading-relaxed font-lora"
          />
        </div>
      </div>

      {/* Skills List Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              Danh sách Kỹ Năng & Công Cụ ({profileForm.skills?.length || 0})
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Hiển thị tại phần About và thanh kỹ năng
            </p>
          </div>
          <button
            onClick={handleAddSkill}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D7287] hover:bg-[#074553] text-white dark:bg-[#9BE7FA] dark:text-slate-950 dark:hover:bg-[#C8EEF7] font-bold text-xs rounded-lg transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Kỹ Năng</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
          {(profileForm.skills || []).map((skill, idx) => (
            <div
              key={skill.id || idx}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 relative group"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={skill.name}
                  placeholder="Tên kỹ năng"
                  onChange={(e) => {
                    const newSkills = [...profileForm.skills];
                    newSkills[idx].name = e.target.value;
                    setProfileForm({ ...profileForm, skills: newSkills });
                  }}
                  className="text-xs font-bold text-slate-900 dark:text-white bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-cyan-500 focus:outline-hidden px-1 py-0.5 flex-1"
                />
                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  title="Xóa kỹ năng"
                  aria-label="Xóa kỹ năng"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Danh mục</label>
                  <input
                    type="text"
                    value={skill.category || 'Languages & Querying'}
                    onChange={(e) => {
                      const newSkills = [...profileForm.skills];
                      newSkills[idx].category = e.target.value;
                      setProfileForm({ ...profileForm, skills: newSkills });
                    }}
                    className="w-full text-[11px] px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Cấp độ (1-5 sao)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={skill.level || 5}
                    onChange={(e) => {
                      const newSkills = [...profileForm.skills];
                      newSkills[idx].level = parseInt(e.target.value, 10) || 5;
                      setProfileForm({ ...profileForm, skills: newSkills });
                    }}
                    className="w-full text-[11px] px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400">Mô tả độ thành thạo</label>
                <input
                  type="text"
                  value={skill.proficiencyNote || ''}
                  placeholder="Ví dụ: Complex Joins, CTEs, Window Functions..."
                  onChange={(e) => {
                    const newSkills = [...profileForm.skills];
                    newSkills[idx].proficiencyNote = e.target.value;
                    setProfileForm({ ...profileForm, skills: newSkills });
                  }}
                  className="w-full text-[11px] px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experiences & Education Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
              Kinh Nghiệm & Học Vấn ({profileForm.experiences?.length || 0})
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Hiển thị tại dòng thời gian mục CV & Experience
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAddExperience('education')}
              className="px-3 py-1.5 bg-[#FFE485] hover:bg-[#FFD14C] text-[#92400E] font-bold text-xs rounded-lg transition cursor-pointer shadow-xs"
            >
              + Học Vấn
            </button>
            <button
              onClick={() => handleAddExperience('work')}
              className="px-3 py-1.5 bg-[#0D7287] hover:bg-cyan-700 text-white font-bold text-xs rounded-lg transition cursor-pointer shadow-xs"
            >
              + Kinh Nghiệm
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {(profileForm.experiences || []).map((exp, idx) => (
            <div
              key={exp.id || idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 relative"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase ${
                  exp.type === 'education' 
                    ? 'bg-[#C8EEF7] text-[#074553] dark:bg-[#074553]/60 dark:text-[#9BE7FA]' 
                    : 'bg-[#FFE485]/40 text-[#92400E] dark:bg-[#FFE485]/20 dark:text-[#FFE485]'
                }`}>
                  {exp.type === 'education' ? 'Học vấn' : 'Kinh nghiệm thực tế'}
                </span>
                <button
                  onClick={() => handleRemoveExperience(exp.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  aria-label="Xóa kinh nghiệm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-500 dark:text-slate-400">Chức vụ / Ngành học</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => {
                      const newExp = [...profileForm.experiences];
                      newExp[idx].role = e.target.value;
                      setProfileForm({ ...profileForm, experiences: newExp });
                    }}
                    className="w-full text-xs font-bold px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400">Thời gian</label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => {
                      const newExp = [...profileForm.experiences];
                      newExp[idx].period = e.target.value;
                      setProfileForm({ ...profileForm, experiences: newExp });
                    }}
                    className="w-full text-xs px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400">Tổ chức / Trường học</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => {
                    const newExp = [...profileForm.experiences];
                    newExp[idx].company = e.target.value;
                    setProfileForm({ ...profileForm, experiences: newExp });
                  }}
                  className="w-full text-xs px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400">Chi tiết trách nhiệm (Mỗi dòng một ý)</label>
                <textarea
                  rows={3}
                  value={(exp.description || []).join('\n')}
                  onChange={(e) => {
                    const newExp = [...profileForm.experiences];
                    newExp[idx].description = e.target.value.split('\n');
                    setProfileForm({ ...profileForm, experiences: newExp });
                  }}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Goals List Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCheck className="w-4 h-4 text-[#0D7287] dark:text-[#9BE7FA]" />
            Mục Tiêu & Định Hướng Phát Triển
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(profileForm.careerGoalsList || []).map((goal, idx) => (
            <div
              key={goal.id || idx}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
            >
              <input
                type="text"
                value={goal.title}
                onChange={(e) => {
                  const newGoals = [...profileForm.careerGoalsList || []];
                  newGoals[idx].title = e.target.value;
                  setProfileForm({ ...profileForm, careerGoalsList: newGoals });
                }}
                className="w-full text-xs font-bold px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
              <textarea
                rows={3}
                value={goal.desc}
                onChange={(e) => {
                  const newGoals = [...profileForm.careerGoalsList || []];
                  newGoals[idx].desc = e.target.value;
                  setProfileForm({ ...profileForm, careerGoalsList: newGoals });
                }}
                className="w-full text-xs px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
