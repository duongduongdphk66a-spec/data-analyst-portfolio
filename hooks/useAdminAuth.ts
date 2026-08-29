'use client';

import { useState, useEffect, useCallback } from 'react';
import { isSessionAdmin, setAdminSession, touchSession } from '@/app/lib/auth';

/**
 * Custom hook to manage admin authentication state.
 * Encapsulates session checking, activity tracking, and keyboard shortcuts.
 */
export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Check admin session on mount
  useEffect(() => {
    setIsAdmin(isSessionAdmin());
  }, []);

  // Periodic session inactivity check and activity touch
  useEffect(() => {
    if (!isAdmin) return;

    const handleUserActivity = () => {
      touchSession();
    };

    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    const interval = setInterval(() => {
      const valid = isSessionAdmin();
      if (!valid) {
        setIsAdmin(false);
      }
    }, 30000);

    return () => {
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearInterval(interval);
    };
  }, [isAdmin]);

  const handleLoginSuccess = useCallback(() => {
    setIsAdmin(true);
  }, []);

  const handleLogout = useCallback(() => {
    setAdminSession(false);
    setIsAdmin(false);
  }, []);

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  return {
    isAdmin,
    isLoginModalOpen,
    handleLoginSuccess,
    handleLogout,
    openLoginModal,
    closeLoginModal,
  };
}
