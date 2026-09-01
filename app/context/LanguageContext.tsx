'use client';

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore, ReactNode, useCallback } from 'react';
import { translations, TranslationKey } from '../data/translations';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
  isEnglish: boolean;
  dynamicTexts: {
    vi: Record<string, string>;
    en: Record<string, string>;
  };
  setDynamicTexts: React.Dispatch<React.SetStateAction<{ vi: Record<string, string>; en: Record<string, string> }>>;
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

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const language: Language = useSyncExternalStore(subscribeLanguage, getSavedLanguage, () => 'vi' as Language);
  const [dynamicTexts, setDynamicTexts] = useState<{ vi: Record<string, string>; en: Record<string, string> }>({
    vi: {},
    en: {},
  });

  const reloadTexts = useCallback(async () => {
    try {
      const res = await fetch('/api/texts').then((r) => r.json()).catch(() => null);
      if (res && res.data) {
        setDynamicTexts({
          vi: res.data.vi || {},
          en: res.data.en || {},
        });
      }
    } catch {
      // ignore network errors
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/texts')
      .then((r) => r.json())
      .then((res) => {
        if (active && res && res.data) {
          setDynamicTexts({
            vi: res.data.vi || {},
            en: res.data.en || {},
          });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const setLanguage = (newLang: Language) => {
    localStorage.setItem('portfolio_lang', newLang);
    window.dispatchEvent(new Event('languagechange'));
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  const t = (key: TranslationKey | string, fallback?: string): string => {
    // 1. Check custom dynamic overrides from MySQL
    const dynamicDict = language === 'en' ? dynamicTexts.en : dynamicTexts.vi;
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
        dynamicTexts,
        setDynamicTexts,
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
      setDynamicTexts: () => {},
      reloadTexts: async () => {},
    };
  }
  return context;
};
