import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSelector({ variant = 'default', compact = false }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en', label: 'English', sub: 'English' },
    { code: 'te', label: 'తెలుగు', sub: 'Telugu' }
  ];

  const currentLabel = language === 'te' ? 'తెలుగు' : 'English';

  // Variant matching the exact reference screenshot: "🌐 English ⌵" pill on dark header
  if (variant === 'pill-dark') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-0.5 h-[22px] rounded-full bg-white/10 hover:bg-white/15 text-white text-[10px] font-semibold border border-white/20 transition-all cursor-pointer backdrop-blur-xs active:scale-95 shadow-2xs"
          aria-label="Select language"
          aria-expanded={isOpen}
        >
          <Globe className="w-2.5 h-2.5 text-white/90 shrink-0" />
          <span className="font-medium tracking-tight text-[10px] leading-none">{currentLabel}</span>
          <ChevronDown className={`w-2 h-2 text-white/70 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                  language === lang.code
                    ? 'bg-[#EAF3FF] text-[#12345A] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{lang.label}</span>
                {language === lang.code && <Check className="w-3.5 h-3.5 text-[#2468B4]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Standard Segmented control
  return (
    <div className="inline-flex items-center rounded-xl border border-[#E3EAF2] bg-white p-0.5 text-xs font-medium shadow-2xs">
      <div className="flex items-center px-1.5 text-slate-400">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-lg transition-all ${
          language === 'en'
            ? 'bg-[#12345A] text-white shadow-2xs font-bold'
            : 'text-slate-600 hover:text-[#12345A] hover:bg-slate-50'
        }`}
        aria-label="Switch to English"
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('te')}
        className={`px-2.5 py-1 rounded-lg transition-all telugu-text ${
          language === 'te'
            ? 'bg-[#12345A] text-white shadow-2xs font-bold'
            : 'text-slate-600 hover:text-[#12345A] hover:bg-slate-50'
        }`}
        aria-label="Switch to Telugu"
      >
        తెలుగు
      </button>
    </div>
  );
}
