import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function StatusBadge({ status }) {
  const { t } = useLanguage();

  if (!status) return null;

  const normalized = status.toLowerCase();

  let colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  let label = status;

  if (normalized.includes('open') || normalized.includes('active')) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    label = t('statusOpen');
  } else if (normalized.includes('closing') || normalized.includes('soon')) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 font-medium';
    label = t('statusClosingSoon');
  } else if (normalized.includes('new')) {
    colorClasses = 'bg-[#12345A] text-white border-[#0B1F3A] font-semibold';
    label = t('statusNew');
  } else if (normalized.includes('admit')) {
    colorClasses = 'bg-sky-100 text-[#12345A] border-sky-300 font-medium';
    label = t('statusAdmitCard');
  } else if (normalized.includes('result')) {
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium';
    label = t('statusResult');
  } else if (normalized.includes('closed')) {
    colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
    label = t('statusClosed');
  } else if (normalized.includes('draft')) {
    colorClasses = 'bg-amber-100 text-amber-900 border-amber-200';
    label = t('statusDraft');
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border tracking-wide uppercase transition-colors ${colorClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {label}
    </span>
  );
}
