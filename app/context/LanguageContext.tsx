'use client';

import React, { createContext, useContext, useSyncExternalStore, ReactNode, useCallback } from 'react';
import { translations, TranslationKey } from '../data/translations';
import { usePortfolioData } from './PortfolioDataContext';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (_lang: Language) => void;
  toggleLanguage: () => void;
  t: (_key: TranslationKey | string, _fallback?: string) => string;
  isEnglish: boolean;
  dynamicTexts: {
    vi: Record<string, string>;
    en: Record<string, string>;
  };
  reloadTexts: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getSavedLanguage(): Language {
  if (typeof window === 'undefined') return 'vi';
  const saved = localStorage.getItem('portfolio_lang') as Language | null;
  return saved === 'en' || saved === 'vi' ? saved : 'vi';
}

function subscribeLanguage(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('languagechange', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('languagechange', callback);
  };
}

import { useRouter } from 'next/navigation';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const language: Language = useSyncExternalStore(subscribeLanguage, getSavedLanguage, () => 'vi' as Language);
  const { customTexts, refreshData } = usePortfolioData();

  const reloadTexts = useCallback(async () => {
    await refreshData();
  }, [refreshData]);

  const setLanguage = (newLang: Language) => {
    localStorage.setItem('portfolio_lang', newLang);
    document.cookie = `portfolio_lang=${newLang}; path=/; max-age=31536000`;
    window.dispatchEvent(new Event('languagechange'));
    router.refresh();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  const t = (key: TranslationKey | string, fallback?: string): string => {
    // 1. Check custom dynamic overrides from MySQL (via PortfolioDataContext)
    const dynamicDict = language === 'en' ? customTexts?.en : customTexts?.vi;
    if (dynamicDict && dynamicDict[key]) {
      return dynamicDict[key];
    }

    // 2. Check static translations for current language
    const dict = language === 'en' ? translations.en : translations.vi;
    if (dict && key in dict) {
      return (dict as unknown as Record<string, string>)[key];
    }

    // 3. Fallback to Vietnamese static
    const viDict = translations.vi;
    if (viDict && key in viDict) {
      return (viDict as Record<string, string>)[key];
    }

    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isEnglish: language === 'en',
        dynamicTexts: customTexts,
        reloadTexts,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'vi' as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string, fallback?: string) => fallback || key,
      isEnglish: false,
      dynamicTexts: { vi: {}, en: {} },
      reloadTexts: async () => {},
    };
  }
  return context;
};
