import React from 'react';

/**
 * StatusBadge:
 * Displays a unified status badge according to ExamQuestHub design system:
 *   - UPCOMING: Blue badge
 *   - OPEN: Green badge
 *   - CLOSED: Grey/slate badge
 *   - DATE NOT AVAILABLE / NEEDS VERIFICATION: Amber / slate badge
 *   - DRAFT / ADMIT CARD / RESULT: Domain specific badges
 */
export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const normalized = String(status).trim().toLowerCase();

  let colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  let dotColor = 'bg-blue-600';
  let label = String(status).toUpperCase();

  if (normalized === 'open' || normalized === 'applications open' || normalized.includes('open') || normalized.includes('active')) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold';
    dotColor = 'bg-emerald-600';
    label = 'OPEN';
  } else if (normalized === 'upcoming' || normalized.includes('upcoming')) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-300 font-bold';
    dotColor = 'bg-blue-600';
    label = 'UPCOMING';
  } else if (normalized === 'closed' || normalized.includes('closed')) {
    colorClasses = 'bg-slate-100 text-slate-600 border-slate-300 font-bold';
    dotColor = 'bg-slate-500';
    label = 'CLOSED';
  } else if (normalized.includes('date not available')) {
    colorClasses = 'bg-slate-100 text-slate-600 border-slate-200 font-medium';
    dotColor = 'bg-slate-400';
    label = 'DATE NOT AVAILABLE';
  } else if (normalized.includes('verification') || normalized.includes('needs verification')) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 font-medium';
    dotColor = 'bg-amber-500';
    label = 'NEEDS VERIFICATION';
  } else if (normalized.includes('closing') || normalized.includes('soon')) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
    dotColor = 'bg-amber-600';
    label = 'CLOSING SOON';
  } else if (normalized.includes('admit')) {
    colorClasses = 'bg-sky-100 text-[#12345A] border-sky-300 font-medium';
    dotColor = 'bg-[#12345A]';
    label = 'ADMIT CARD RELEASED';
  } else if (normalized.includes('result')) {
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium';
    dotColor = 'bg-indigo-600';
    label = 'RESULT RELEASED';
  } else if (normalized.includes('draft')) {
    colorClasses = 'bg-amber-100 text-amber-900 border-amber-200 font-semibold';
    dotColor = 'bg-amber-600';
    label = 'DRAFT';
  } else if (normalized.includes('new')) {
    colorClasses = 'bg-[#12345A] text-white border-[#0B1F3A] font-semibold';
    dotColor = 'bg-[#F2BE4F]';
    label = 'NEW';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs border tracking-wide uppercase transition-colors shrink-0 ${colorClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 opacity-90 shrink-0 ${dotColor}`} />
      <span>{label}</span>
    </span>
  );
}
