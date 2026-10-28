import React from 'react';
import { SearchX, RefreshCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function EmptyState({
  title = 'No notifications found',
  description = 'Try adjusting your search query, selecting a different exam category, or resetting filters.',
  onReset
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-[#E3EAF2] p-10 text-center max-w-lg mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="font-heading font-bold text-lg text-[#182B45] mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-6">
        {description}
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>{t('resetFilters')}</span>
        </button>
      )}
    </div>
  );
}
