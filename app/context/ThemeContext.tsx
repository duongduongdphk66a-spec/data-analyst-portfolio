'use client';

import React, { createContext, useContext, useEffect, useCallback, useSyncExternalStore, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSavedTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem('portfolio_theme') as Theme | null;
  return saved && ['light', 'dark', 'system'].includes(saved) ? saved : 'system';
}

function subscribeTheme(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('themechange', callback);
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('themechange', callback);
    mediaQuery.removeEventListener('change', callback);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme: Theme = useSyncExternalStore(subscribeTheme, getSavedTheme, () => 'system' as Theme);

  // Compute resolved effective theme purely
  const isSystemDark = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
  const resolvedTheme: ResolvedTheme = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : isSystemDark ? 'dark' : 'light';

  // Synchronize class with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem('portfolio_theme', newTheme);
    window.dispatchEvent(new Event('themechange'));
  }, []);

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light' as Theme,
      resolvedTheme: 'light' as ResolvedTheme,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
