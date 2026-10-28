import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/index.js';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('eqh_language');
      return saved === 'te' ? 'te' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('eqh_language', language);
      document.documentElement.lang = language;
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }
  }, [language]);

  const t = (key, fallback = '') => {
    const dict = translations[language] || translations.en;
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    // Fallback to English
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return fallback || key;
  };

  /**
   * Helper to retrieve bilingual text from an object formatted as:
   * { en: "Text", te: "టెక్స్ట్" } or string fallback
   */
  const getLocalized = (obj, fallback = '') => {
    if (!obj) return fallback;
    if (typeof obj === 'string') return obj;
    if (language === 'te' && obj.te) return obj.te;
    if (obj.en) return obj.en;
    return obj.te || fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
