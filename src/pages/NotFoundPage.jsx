import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-[600px] mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-[#EAF3FF] text-[#12345A] flex items-center justify-center mx-auto">
        <FileQuestion className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-[#2468B4] uppercase tracking-wider">
          404 Error
        </span>
        <h1 className="font-heading font-extrabold text-3xl text-[#182B45]">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
          The exam update, hall ticket link, or study resource you are looking for may have expired or been moved to a new section.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>{t('navHome')}</span>
        </Link>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Latest Jobs</span>
        </Link>
      </div>
    </div>
  );
}
