'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProfileData, ProjectData, DashboardData } from '@/app/types';
import { DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_DASHBOARD } from '@/app/defaultData';
import { safeJsonParse } from '@/app/lib/security';
import { trackVisitorAction } from '@/app/lib/visitorTracking';

/**
 * Custom hook to manage portfolio data state.
 * Encapsulates localStorage read/write logic and provides
 * clean save handlers.
 */
export function usePortfolioState() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<ProjectData[]>(DEFAULT_PROJECTS);
  const [dashboard, setDashboard] = useState<DashboardData>(DEFAULT_DASHBOARD);

  // Load saved data from localStorage on mount
  useEffect(() => {
    // Track initial page visit
    trackVisitorAction('Truy cập trang web', 'Người xem mở trang Portfolio', 'pageview');

    // Load Profile securely
    const savedProfile = localStorage.getItem('portfolio_profile_v4');
    if (savedProfile) {
      const parsed = safeJsonParse(savedProfile, DEFAULT_PROFILE);
      if (!parsed.name || parsed.name === 'Nguyễn Văn A') {
        setProfile(DEFAULT_PROFILE);
      } else {
        setProfile(parsed);
      }
    } else {
      setProfile(DEFAULT_PROFILE);
    }

    // Load Projects securely
    const savedProjects = localStorage.getItem('portfolio_projects_v4');
    if (savedProjects) {
      setProjects(safeJsonParse(savedProjects, DEFAULT_PROJECTS));
    } else {
      setProjects(DEFAULT_PROJECTS);
    }

    // Load Dashboard & Charts securely
    const savedDashboard = localStorage.getItem('portfolio_dashboard_v4');
    if (savedDashboard) {
      setDashboard(safeJsonParse(savedDashboard, DEFAULT_DASHBOARD));
    } else {
      setDashboard(DEFAULT_DASHBOARD);
    }
  }, []);

  // Memoized save handlers
  const handleSaveProfile = useCallback((newProfile: ProfileData) => {
    setProfile(newProfile);
    localStorage.setItem('portfolio_profile_v4', JSON.stringify(newProfile));
  }, []);

  const handleSaveProjects = useCallback((newProjects: ProjectData[]) => {
    setProjects(newProjects);
    localStorage.setItem('portfolio_projects_v4', JSON.stringify(newProjects));
  }, []);

  const handleSaveDashboard = useCallback((newDashboard: DashboardData) => {
    setDashboard(newDashboard);
    localStorage.setItem('portfolio_dashboard_v4', JSON.stringify(newDashboard));
  }, []);

  return {
    profile,
    projects,
    dashboard,
    handleSaveProfile,
    handleSaveProjects,
    handleSaveDashboard,
  };
}
