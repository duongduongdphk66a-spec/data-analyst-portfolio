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
  updateProfile: (_updated: Partial<ProfileData>) => Promise<{ success: boolean; message: string }>;
  updateCustomTexts: (_updates: Array<{ text_key: string; lang: 'vi' | 'en'; value_text: string; section?: string }>) => Promise<{ success: boolean; message: string }>;
  updateProjects: (_updated: ProjectData[]) => Promise<{ success: boolean; message: string }>;
  refreshData: () => Promise<void>;
  resetToDefault: () => Promise<{ success: boolean; message: string }>;
  getCustomText: (_key: string, _lang: 'vi' | 'en', _fallback?: string) => string;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

function getAuthHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json' };
}

function safeSetLocalStorage(key: string, data: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
  } catch (e) {
    console.warn(`[safeSetLocalStorage] Failed to save ${key} to localStorage:`, e);
    if (data && typeof data === 'object' && 'avatarUrl' in data) {
      try {
        const copy = { ...(data as Record<string, unknown>), avatarUrl: '' };
        localStorage.setItem(key, JSON.stringify(copy));
      } catch {
        // Quota fallback
      }
    }
  }
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

  // Fetch initial profile, projects, custom texts, and db status in parallel
  const refreshData = useCallback(async () => {
    try {
      const [dbRes, profRes, projRes, textRes] = await Promise.all([
        fetch('/api/db').then((r) => r.json()).catch(() => ({ connected: false, message: 'Offline' })),
        fetch('/api/profile').then((r) => r.json()).catch(() => null),
        fetch('/api/projects').then((r) => r.json()).catch(() => null),
        fetch('/api/texts').then((r) => r.json()).catch(() => null),
      ]);

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
      console.warn('[PortfolioDataProvider] Data fetch fallback to static:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial data on mount: delegates to refreshData to avoid code duplication
  useEffect(() => {
    let ignore = false;

    const initData = async () => {
      await refreshData();
      // refreshData already sets isLoading = false internally
    };

    if (!ignore) {
      initData();
    }

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Profile
  const updateProfile = async (updated: Partial<ProfileData>): Promise<{ success: boolean; message: string }> => {
    setIsSaving(true);
    const previousProfile = profile;
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

      if (!res.ok || !data.success) {
        setProfile(previousProfile);
        return { success: false, message: data.message || 'Lỗi cập nhật thông tin lên máy chủ.' };
      }

      safeSetLocalStorage('portfolio_custom_profile', newProfile);
      return { success: true, message: data.message || 'Cập nhật thông tin thành công!' };
    } catch (err: unknown) {
      console.error('[updateProfile] Network/Server error:', err);
      setProfile(previousProfile);
      return { success: false, message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.' };
    } finally {
      setIsSaving(false);
    }
  };

  // Update Custom Texts
  const updateCustomTexts = async (
    updates: Array<{ text_key: string; lang: 'vi' | 'en'; value_text: string; section?: string }>
  ): Promise<{ success: boolean; message: string }> => {
    setIsSaving(true);
    const previousTexts = customTexts;

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

      if (!res.ok || !data.success) {
        setCustomTexts(previousTexts);
        return { success: false, message: data.message || 'Lỗi lưu văn bản lên máy chủ.' };
      }

      return {
        success: true,
        message: data.message || 'Cập nhật văn bản thành công!',
      };
    } catch (err: unknown) {
      console.error('[updateCustomTexts] Network/Server error:', err);
      setCustomTexts(previousTexts);
      return { success: false, message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.' };
    } finally {
      setIsSaving(false);
    }
  };

  // Update Projects
  const updateProjects = async (updatedProjects: ProjectData[]): Promise<{ success: boolean; message: string }> => {
    setIsSaving(true);
    const previousProjects = projects;
    setProjects(updatedProjects);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ projects: updatedProjects }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setProjects(previousProjects);
        return { success: false, message: data.message || 'Lỗi cập nhật danh sách dự án.' };
      }

      return {
        success: true,
        message: data.message || 'Cập nhật danh sách dự án thành công!',
      };
    } catch (err: unknown) {
      console.error('[updateProjects] Network/Server error:', err);
      setProjects(previousProjects);
      return { success: false, message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.' };
    } finally {
      setIsSaving(false);
    }
  };

  // Reset all to default
  const resetToDefault = async (): Promise<{ success: boolean; message: string }> => {
    setIsSaving(true);
    const prevProfile = profile;
    const prevProjects = projects;
    const prevTexts = customTexts;

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

      if (!res.ok || !data.success) {
        setProfile(prevProfile);
        setProjects(prevProjects);
        setCustomTexts(prevTexts);
        return { success: false, message: data.message || 'Lỗi khôi phục dữ liệu mặc định.' };
      }

      await refreshData();
      return {
        success: true,
        message: data.message || 'Đã khôi phục dữ liệu mặc định thành công!',
      };
    } catch (err: unknown) {
      console.error('[resetToDefault] Error:', err);
      setProfile(prevProfile);
      setProjects(prevProjects);
      setCustomTexts(prevTexts);
      return { success: false, message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.' };
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
