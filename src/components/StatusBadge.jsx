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
export default function StatusBadge({ status, subtext, size = 'sm', className = '' }) {
  if (!status) return null;

  const normalized = String(status).trim().toLowerCase();

  let colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  let dotColor = 'bg-blue-600';
  let label = String(status);

  if (
    normalized === 'open' ||
    normalized === 'application open' ||
    normalized === 'applications open' ||
    normalized.includes('open') ||
    normalized.includes('active')
  ) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold';
    dotColor = 'bg-emerald-600';
    label = 'Application Open';
  } else if (normalized === 'upcoming' || normalized.includes('upcoming')) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-300 font-bold';
    dotColor = 'bg-blue-600';
    label = 'Upcoming';
  } else if (normalized === 'closed' || normalized === 'application closed' || normalized.includes('closed')) {
    colorClasses = 'bg-slate-100 text-slate-600 border-slate-300 font-bold';
    dotColor = 'bg-slate-500';
    label = 'Application Closed';
  } else if (normalized.includes('verification') || normalized.includes('needs verification')) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
    dotColor = 'bg-amber-600';
    label = 'Needs Verification';
  } else if (
    normalized.includes('date not announced') ||
    normalized.includes('date not available') ||
    normalized.includes('dates not announced') ||
    normalized.includes('pending')
  ) {
    colorClasses = 'bg-slate-100 text-slate-600 border-slate-200 font-medium';
    dotColor = 'bg-slate-400';
    label = 'Dates Not Announced';
  } else if (normalized.includes('closing') || normalized.includes('soon')) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
    dotColor = 'bg-amber-600';
    label = 'Closing Soon';
  } else if (normalized.includes('admit')) {
    colorClasses = 'bg-sky-100 text-[#12345A] border-sky-300 font-medium';
    dotColor = 'bg-[#12345A]';
    label = 'Admit Card Released';
  } else if (normalized.includes('result')) {
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium';
    dotColor = 'bg-indigo-600';
    label = 'Result Released';
  } else if (normalized.includes('draft')) {
    colorClasses = 'bg-amber-100 text-amber-900 border-amber-200 font-semibold';
    dotColor = 'bg-amber-600';
    label = 'Draft';
  } else if (normalized.includes('new')) {
    colorClasses = 'bg-[#12345A] text-white border-[#0B1F3A] font-semibold';
    dotColor = 'bg-[#F2BE4F]';
    label = 'NEW';
  }

  const sizeClasses = size === 'xs'
    ? 'px-2 py-0.5 text-[10px]'
    : 'px-2.5 py-0.5 text-[10px] sm:text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide transition-colors shrink-0 ${sizeClasses} ${colorClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 opacity-90 shrink-0 ${dotColor}`} />
      <span>{label}</span>
      {subtext && (
        <span className="ml-1.5 pl-1.5 border-l border-current/30 text-[10px] sm:text-[11px] font-medium normal-case">
          {subtext}
        </span>
      )}
    </span>
  );
}
