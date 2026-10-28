import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Globe } from 'lucide-react';

export default function LanguageSelector({ compact = false }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-lg border border-[#E3EAF2] bg-white p-0.5 text-xs font-medium shadow-xs">
      <div className="flex items-center px-1.5 text-slate-400">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-md transition-all ${
          language === 'en'
            ? 'bg-[#12345A] text-white shadow-xs font-semibold'
            : 'text-slate-600 hover:text-[#12345A] hover:bg-slate-50'
        }`}
        aria-label="Switch to English"
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('te')}
        className={`px-2 py-1 rounded-md transition-all telugu-text ${
          language === 'te'
            ? 'bg-[#12345A] text-white shadow-xs font-semibold'
            : 'text-slate-600 hover:text-[#12345A] hover:bg-slate-50'
        }`}
        aria-label="Switch to Telugu"
      >
        తెలుగు
      </button>
    </div>
  );
}
