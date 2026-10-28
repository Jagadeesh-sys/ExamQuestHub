import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Building2,
  Calendar,
  Clock,
  GraduationCap,
  ExternalLink,
  FileText,
  MapPin,
  CheckCircle2,
  Briefcase,
  Coins,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import StatusBadge from './StatusBadge.jsx';

/**
 * StraightLineNotification:
 * Displays a notification as a compact horizontal straight line / strip.
 * Clicking anywhere on the straight line expands full details up to a comfortable readable length.
 */
export default function StraightLineNotification({
  item,
  isExpanded: controlledExpanded,
  onToggle,
  theme = 'card', // 'card' | 'navy'
  defaultExpanded = false
}) {
  const { t, getLocalized } = useLanguage();
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  if (!item) return null;

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const toggleExpand = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const title = getLocalized(item.title);
  const org = getLocalized(item.organization);
  const qual = getLocalized(item.qualification);
  const summary = getLocalized(item.summary);
  const desc = getLocalized(item.description);
  const ageLimit = getLocalized(item.ageLimit);
  const fee = getLocalized(item.applicationFee);
  const salary = getLocalized(item.salary);
  const selection = getLocalized(item.selectionProcess);
  const detailSlug = item.slug || item.id;

  // Navy theme (matches the user's screenshot straight-line banner)
  if (theme === 'navy') {
    return (
      <div className="w-full bg-[#0B1F3A] text-white rounded-xl border border-white/10 shadow-md overflow-hidden transition-all duration-200">
        {/* Straight Line Strip Header */}
        <div
          role="button"
          tabIndex={0}
          onClick={toggleExpand}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleExpand())}
          className="px-4 py-3 cursor-pointer flex items-center justify-between gap-3 hover:bg-white/5 transition-colors select-none"
          aria-expanded={isExpanded}
        >
          {/* Straight line content */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F2BE4F] text-[#0B1F3A] uppercase tracking-wider">
              {item.category || 'Govt Job'}
            </span>
            <span className="shrink-0 font-bold text-xs sm:text-sm text-sky-200 truncate max-w-[140px] sm:max-w-[200px]">
              {org}
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs sm:text-sm font-medium text-white truncate flex-1">
              {title}
            </span>
            {item.deadline && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-amber-300 font-semibold shrink-0">
                <Clock className="w-3 h-3" />
                <span>Last Date: {item.deadline}</span>
              </span>
            )}
          </div>

          {/* Action indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-sky-200 hover:text-white hidden sm:inline">
              {isExpanded ? 'Hide Details' : 'Click for Details'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Expanded Full Details */}
        {isExpanded && (
          <div className="border-t border-white/10 bg-[#12345A]/95 p-4 sm:p-6 animate-in slide-in-from-top-2 duration-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h4 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  {title}
                </h4>
                <p className="text-xs text-sky-200 mt-0.5 font-medium">
                  {org} • {item.region} {item.notificationNo ? `• Ref No: ${item.notificationNo}` : ''}
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>

            {/* Quick highlight summary */}
            {(summary || desc) && (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/10">
                {summary || desc}
              </p>
            )}

            {/* Structured Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block font-semibold mb-1">Qualification</span>
                <span className="text-white font-medium line-clamp-2">{qual || 'See official notification'}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block font-semibold mb-1">Age Limit</span>
                <span className="text-white font-medium">{ageLimit || 'As per recruitment rules'}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block font-semibold mb-1">Total Vacancies</span>
                <span className="text-emerald-300 font-bold">{item.vacancies || 'Check Notification'}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block font-semibold mb-1">Application Fee</span>
                <span className="text-white font-medium">{fee || 'Refer to notification'}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                {item.pdfUrl && (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-400" />
                    <span>Download Official PDF</span>
                  </a>
                )}
                {item.applyUrl && (
                  <a
                    href={item.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F2BE4F] hover:bg-[#E0AC3C] text-[#0B1F3A] rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>Apply Online</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/jobs/${detailSlug}`}
                  className="text-xs font-semibold text-sky-200 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>View Dedicated Exam Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={toggleExpand}
                  className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white rounded-md hover:bg-white/10"
                >
                  Collapse
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard Card/Clean Straight Line Strip
  return (
    <div
      className={`w-full bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-xs ${
        isExpanded ? 'border-[#2468B4] ring-2 ring-[#2468B4]/10 shadow-md' : 'border-[#E3EAF2] hover:border-[#2468B4]/40 hover:shadow-xs'
      }`}
    >
      {/* Straight Line Row */}
      <div
        role="button"
        tabIndex={0}
        onClick={toggleExpand}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleExpand())}
        className="px-3.5 sm:px-5 py-3 cursor-pointer flex items-center justify-between gap-3 select-none hover:bg-slate-50/70 transition-colors"
        aria-expanded={isExpanded}
        title="Click to view full details"
      >
        {/* Left Side: Status + Org + Title on straight line */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Status badge */}
          <div className="shrink-0 scale-90 sm:scale-100 origin-left">
            <StatusBadge status={item.status} />
          </div>

          {/* Category */}
          <span className="shrink-0 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] hidden sm:inline-block">
            {item.category}
          </span>

          {/* Org name */}
          <span className="font-heading font-bold text-xs sm:text-sm text-[#12345A] truncate max-w-[130px] sm:max-w-[200px] shrink-0">
            {org}
          </span>

          <span className="text-slate-300 hidden md:inline">•</span>

          {/* Title on straight line */}
          <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate flex-1 hover:text-[#2468B4] transition-colors">
            {title}
          </span>

          {/* Date info */}
          {item.deadline ? (
            <span className="hidden lg:inline-flex items-center gap-1 text-xs text-amber-900 font-medium shrink-0 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Last Date: {item.deadline}</span>
            </span>
          ) : (
            <span className="hidden lg:inline text-[11px] text-slate-400 shrink-0">
              {item.publishedAt}
            </span>
          )}
        </div>

        {/* Right Side: Quick Action & Expand Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-[#2468B4] hidden sm:inline">
            {isExpanded ? 'Hide Details' : 'Click to View'}
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform ${
              isExpanded ? 'bg-[#EAF3FF] text-[#12345A] rotate-180' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Expanded Details Section (Opens smoothly up to readable length) */}
      {isExpanded && (
        <div className="border-t border-[#E3EAF2] bg-[#F6F8FC]/60 p-4 sm:p-6 animate-in slide-in-from-top-1 duration-150 space-y-4">
          
          {/* Top Title & Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3EAF2] pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-bold text-[#12345A]">{org}</span>
                <span>•</span>
                <span>{item.region}</span>
                {item.notificationNo && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-slate-600">Notice No: {item.notificationNo}</span>
                  </>
                )}
              </div>
              <h4 className="font-heading font-extrabold text-base sm:text-lg text-[#182B45] leading-snug">
                {title}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={item.status} />
              {item.vacancies && item.vacancies !== 'TBD' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {item.vacancies}
                </span>
              )}
            </div>
          </div>

          {/* Summary / Snippet */}
          {(summary || desc) && (
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-[#E3EAF2]">
              <span className="font-bold text-[#12345A] block mb-1">Summary of Recruitment:</span>
              <p>{summary || desc}</p>
            </div>
          )}

          {/* Details Table / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Qualification */}
            <div className="bg-white p-3 rounded-xl border border-[#E3EAF2]">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#2468B4]" />
                <span>Eligibility / Qualification</span>
              </div>
              <p className="text-slate-800 font-medium">
                {qual || 'Please check official notification document for detailed degree requirements.'}
              </p>
            </div>

            {/* Age Limit */}
            <div className="bg-white p-3 rounded-xl border border-[#E3EAF2]">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#2468B4]" />
                <span>Age Limit</span>
              </div>
              <p className="text-slate-800 font-medium">
                {ageLimit || 'Standard age criteria with relaxation for reserved categories.'}
              </p>
            </div>

            {/* Important Dates */}
            <div className="bg-white p-3 rounded-xl border border-[#E3EAF2]">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Important Dates</span>
              </div>
              <div className="space-y-0.5 text-slate-700 font-medium">
                <div>Posted: <span className="text-slate-900 font-bold">{item.publishedAt}</span></div>
                {item.deadline && (
                  <div className="text-amber-900 font-bold">
                    Last Date: {item.deadline}
                  </div>
                )}
                {item.examDate && <div>Exam: {item.examDate}</div>}
              </div>
            </div>

            {/* Application Fee & Salary */}
            <div className="bg-white p-3 rounded-xl border border-[#E3EAF2]">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fee & Pay Scale</span>
              </div>
              <div className="space-y-0.5 text-slate-700">
                <div>Fee: <span className="font-medium">{fee || 'Refer to notice'}</span></div>
                {salary && <div className="text-emerald-800 font-semibold">Scale: {salary}</div>}
              </div>
            </div>
          </div>

          {/* Selection Process if available */}
          {selection && (
            <div className="text-xs bg-white p-3 rounded-xl border border-[#E3EAF2] flex items-start gap-2">
              <Award className="w-4 h-4 text-[#2468B4] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#12345A]">Selection Process: </span>
                <span className="text-slate-700">{selection}</span>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E3EAF2]">
            <div className="flex items-center gap-2">
              {item.pdfUrl && (
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition-colors shadow-xs active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5 text-red-500" />
                  <span>Official Notification PDF</span>
                </a>
              )}

              {item.applyUrl && (
                <a
                  href={item.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#12345A] hover:bg-[#0B1F3A] text-white rounded-xl text-xs font-bold transition-colors shadow-xs active:scale-95"
                >
                  <span>Apply Online</span>
                  <ExternalLink className="w-3 h-3 text-slate-300" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/jobs/${detailSlug}`}
                className="text-xs font-bold text-[#2468B4] hover:underline flex items-center gap-1 py-1 px-2"
              >
                <span>Read Full Notification Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={toggleExpand}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60"
              >
                Collapse
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
