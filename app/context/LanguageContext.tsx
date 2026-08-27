'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, TranslationKey } from '../data/translations';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    const savedLang = localStorage.getItem('portfolio_lang') as Language | null;
    if (savedLang === 'en' || savedLang === 'vi') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('portfolio_lang', newLang);
    // Dispatch event so other components or tabs can sync
    window.dispatchEvent(new Event('languagechange'));
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  const t = (key: TranslationKey | string, fallback?: string): string => {
    const dict = translations[language];
    if (dict && key in dict) {
      return (dict as any)[key];
    }
    const viDict = translations.vi;
    if (viDict && key in viDict) {
      return (viDict as any)[key];
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
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: 'vi' as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string, fallback?: string) => fallback || key,
      isEnglish: false,
    };
  }
  return context;
};
