'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ProfileData, ProjectData } from '../types';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS } from '../defaultData';
import { translations } from '../data/translations';

interface DbStatus {
  connected: boolean;
  message: string;
  source?: string;
  stats?: {
    profileRows: number;
    textRows: number;
    projectRows: number;
  };
}

interface PortfolioDataContextType {
  profile: ProfileData;
  projects: ProjectData[];
  customTexts: {
    vi: Record<string, string>;
    en: Record<string, string>;
  };
  dbStatus: DbStatus;
  isLoading: boolean;
  isSaving: boolean;
  updateProfile: (updated: Partial<ProfileData>) => Promise<{ success: boolean; message: string }>;
  updateCustomTexts: (updates: Array<{ text_key: string; lang: 'vi' | 'en'; value_text: string; section?: string }>) => Promise<{ success: boolean; message: string }>;
  updateProjects: (updated: ProjectData[]) => Promise<{ success: boolean; message: string }>;
  refreshData: () => Promise<void>;
  resetToDefault: () => Promise<{ success: boolean; message: string }>;
  getCustomText: (key: string, lang: 'vi' | 'en', fallback?: string) => string;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      headers['x-admin-token'] = token;
    }
  }
  return headers;
}

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<ProjectData[]>(DEFAULT_PROJECTS);
  const [customTexts, setCustomTexts] = useState<{ vi: Record<string, string>; en: Record<string, string> }>({
    vi: { ...translations.vi },
    en: { ...translations.en },
  });
  const [dbStatus, setDbStatus] = useState<DbStatus>({
    connected: false,
    message: 'Đang kiểm tra kết nối...',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial profile, projects, custom texts, and db status
  const refreshData = useCallback(async () => {
    try {
      // 1. Fetch DB Status
      const dbRes = await fetch('/api/db').then((r) => r.json()).catch(() => ({ connected: false, message: 'Offline' }));
      if (dbRes) setDbStatus(dbRes);

      // 2. Fetch Profile Data
      const profRes = await fetch('/api/profile').then((r) => r.json()).catch(() => null);
      if (profRes && profRes.data) {
        setProfile((prev) => ({
          ...prev,
          ...profRes.data,
          skills: profRes.data.skills || prev.skills,
          experiences: profRes.data.experiences || prev.experiences,
          careerGoalsList: profRes.data.careerGoalsList || prev.careerGoalsList,
        }));
      }

      // 3. Fetch Projects Data
      const projRes = await fetch('/api/projects').then((r) => r.json()).catch(() => null);
      if (projRes && Array.isArray(projRes.data) && projRes.data.length > 0) {
        setProjects(projRes.data);
      }

      // 4. Fetch Texts
      const textRes = await fetch('/api/texts').then((r) => r.json()).catch(() => null);
      if (textRes && textRes.data) {
        setCustomTexts({
          vi: { ...translations.vi, ...(textRes.data.vi || {}) },
          en: { ...translations.en, ...(textRes.data.en || {}) },
        });
      }
    } catch (err) {
      console.warn('[PortfolioDataProvider] Data fetch fallback to static:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        const [dbRes, profRes, projRes, textRes] = await Promise.all([
          fetch('/api/db').then((r) => r.json()).catch(() => ({ connected: false, message: 'Offline' })),
          fetch('/api/profile').then((r) => r.json()).catch(() => null),
          fetch('/api/projects').then((r) => r.json()).catch(() => null),
          fetch('/api/texts').then((r) => r.json()).catch(() => null),
        ]);

        if (!active) return;

        if (dbRes) setDbStatus(dbRes);

        if (profRes && profRes.data) {
          setProfile((prev) => ({
            ...prev,
            ...profRes.data,
            skills: profRes.data.skills || prev.skills,
            experiences: profRes.data.experiences || prev.experiences,
            careerGoalsList: profRes.data.careerGoalsList || prev.careerGoalsList,
          }));
        }

        if (projRes && Array.isArray(projRes.data) && projRes.data.length > 0) {
          setProjects(projRes.data);
        }

        if (textRes && textRes.data) {
          setCustomTexts({
            vi: { ...translations.vi, ...(textRes.data.vi || {}) },
            en: { ...translations.en, ...(textRes.data.en || {}) },
          });
        }
      } catch (err) {
        console.warn('[PortfolioDataProvider] Init load:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    init();

    return () => {
      active = false;
    };
  }, []);

  // Update Profile
  const updateProfile = async (updated: Partial<ProfileData>): Promise<{ success: boolean; message: string }> => {
    setIsSaving(true);
    const newProfile: ProfileData = {
      ...profile,
      ...updated,
    };
    // Optimistic UI update
    setProfile(newProfile);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newProfile),
      });
      const data = await res.json();

      if (res.status === 401) {
        return { success: false, message: data.message || 'Chưa được cấp quyền Admin.' };
      }

      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('portfolio_custom_profile', JSON.stringify(newProfile));
        }
        return { success: true, message: data.message || 'Cập nhật thông tin thành công!' };
      } else {
        return { success: false, message: data.message || 'Lỗi cập nhật thông tin.' };
      }
    } catch (err: any) {
      console.warn('[updateProfile] Saved locally:', err);
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolio_custom_profile', JSON.stringify(newProfile));
      }
      return { success: true, message: 'Đã lưu thay đổi vào bộ nhớ cục bộ.' };
    } finally {
      setIsSaving(false);
    }
  };

  // Update Custom Texts
  const updateCustomTexts = async (
    updates: Array<{ text_key: string; lang: 'vi' | 'en'; value_text: string; section?: string }>
  ): Promise<{ success: boolean; message: string }> => {
    setIsSaving(true);

    // Optimistic update
    setCustomTexts((prev) => {
      const nextVi = { ...prev.vi };
      const nextEn = { ...prev.en };

      updates.forEach((item) => {
        if (item.lang === 'vi') {
          nextVi[item.text_key] = item.value_text;
        } else if (item.lang === 'en') {
          nextEn[item.text_key] = item.value_text;
        }
      });

      return { vi: nextVi, en: nextEn };
    });

    try {
      const res = await fetch('/api/texts', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ updates }),
      });
      const data = await res.json();

      if (res.status === 401) {
        return { success: false, message: data.message || 'Chưa được cấp quyền Admin.' };
      }

      return {
        success: data.success ?? true,
        message: data.message || 'Cập nhật văn bản thành công!',
      };
    } catch (err: any) {
      console.warn('[updateCustomTexts] Error saving to API:', err);
      return { success: true, message: 'Đã lưu văn bản vào bộ nhớ cục bộ.' };
    } finally {
      setIsSaving(false);
    }
  };

  // Update Projects
  const updateProjects = async (updatedProjects: ProjectData[]): Promise<{ success: boolean; message: string }> => {
    setIsSaving(true);
    setProjects(updatedProjects);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ projects: updatedProjects }),
      });
      const data = await res.json();

      if (res.status === 401) {
        return { success: false, message: data.message || 'Chưa được cấp quyền Admin.' };
      }

      return {
        success: data.success ?? true,
        message: data.message || 'Cập nhật danh sách dự án thành công!',
      };
    } catch (err: any) {
      console.warn('[updateProjects] Error saving to API:', err);
      return { success: true, message: 'Đã lưu danh sách dự án vào bộ nhớ cục bộ.' };
    } finally {
      setIsSaving(false);
    }
  };

  // Reset all to default
  const resetToDefault = async (): Promise<{ success: boolean; message: string }> => {
    setIsSaving(true);
    setProfile(DEFAULT_PROFILE);
    setProjects(DEFAULT_PROJECTS);
    setCustomTexts({
      vi: { ...translations.vi },
      en: { ...translations.en },
    });

    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: 'reset', confirmKey: 'CONFIRM_RESET_DATABASE' }),
      });
      const data = await res.json();

      if (res.status === 401) {
        return { success: false, message: data.message || 'Chưa được cấp quyền Admin.' };
      }

      await refreshData();
      return {
        success: data.success ?? true,
        message: data.message || 'Đã khôi phục dữ liệu mặc định thành công!',
      };
    } catch {
      return { success: true, message: 'Đã khôi phục dữ liệu mặc định.' };
    } finally {
      setIsSaving(false);
    }
  };

  const getCustomText = (key: string, lang: 'vi' | 'en', fallback?: string): string => {
    const dict = lang === 'en' ? customTexts.en : customTexts.vi;
    if (dict && key in dict) {
      return dict[key];
    }
    const fallbackDict = lang === 'en' ? translations.en : translations.vi;
    if (fallbackDict && key in (fallbackDict as any)) {
      return (fallbackDict as any)[key];
    }
    return fallback || key;
  };

  return (
    <PortfolioDataContext.Provider
      value={{
        profile,
        projects,
        customTexts,
        dbStatus,
        isLoading,
        isSaving,
        updateProfile,
        updateCustomTexts,
        updateProjects,
        refreshData,
        resetToDefault,
        getCustomText,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
}
