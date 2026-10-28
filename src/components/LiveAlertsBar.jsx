import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import StatusBadge from './StatusBadge.jsx';

/**
 * LiveAlertsBar:
 * A prominent straight-line notification alert banner styled in dark navy (#0B1F3A / #12345A),
 * matching the user's design reference. Clicking the straight line expands full details in place.
 */
export default function LiveAlertsBar({ notifications = [] }) {
  const { t, getLocalized } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Filter out any invalid items
  const validItems = notifications.filter(Boolean);

  // Auto-advance ticker if not paused and not expanded
  useEffect(() => {
    if (validItems.length <= 1 || isPaused || isExpanded) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validItems.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [validItems.length, isPaused, isExpanded]);

  if (!validItems.length) return null;

  const currentItem = validItems[currentIndex] || validItems[0];
  const title = getLocalized(currentItem.title);
  const org = getLocalized(currentItem.organization);
  const qual = getLocalized(currentItem.qualification);
  const summary = getLocalized(currentItem.summary);
  const detailSlug = currentItem.slug || currentItem.id;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validItems.length) % validItems.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validItems.length);
  };

  return (
    <div
      className="w-full bg-[#0B1F3A] border-y border-[#12345A] shadow-md transition-all select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1200px] mx-auto px-3 sm:px-6">
        
        {/* Straight Line Strip Header */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setIsExpanded(!isExpanded))}
          className="py-2.5 sm:py-3 flex items-center justify-between gap-2.5 sm:gap-4 cursor-pointer text-white focus:outline-hidden group"
          aria-expanded={isExpanded}
          title="Click to view full notification details"
        >
          {/* Badge & straight line text */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
            {/* Pulsing Alert Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2BE4F] text-[#0B1F3A] font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider shrink-0 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
              <span>Live Alert</span>
            </div>

            {/* Straight line notification content */}
            <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
              <span className="font-bold text-xs sm:text-sm text-sky-200 shrink-0">
                [{currentItem.category || 'Recruitment'}] {org}:
              </span>
              <span className="text-xs sm:text-sm text-white font-medium truncate group-hover:text-amber-200 transition-colors">
                {title}
              </span>
              {currentItem.deadline && (
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[#F2BE4F] font-bold shrink-0 ml-1">
                  <Clock className="w-3 h-3" />
                  <span>Last Date: {currentItem.deadline}</span>
                </span>
              )}
            </div>
          </div>

          {/* Controls: Prev/Next + Expand button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Prev/Next arrows for cycling notifications */}
            {validItems.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
                  aria-label="Previous alert"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-slate-300 px-1">
                  {currentIndex + 1}/{validItems.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
                  aria-label="Next alert"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Expand / Collapse toggle */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors">
              <span className="hidden sm:inline text-[11px]">
                {isExpanded ? 'Hide Details' : 'Click for Details'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-[#F2BE4F]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#F2BE4F]" />
              )}
            </div>
          </div>
        </div>

        {/* Expanded Full Details Section (Reveals up to readable length) */}
        {isExpanded && (
          <div className="border-t border-white/15 py-4 pb-5 space-y-4 text-white animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs text-sky-200 font-semibold mb-1">
                  <Building2 className="w-3.5 h-3.5 text-[#F2BE4F]" />
                  <span>{org}</span>
                  <span>•</span>
                  <span>Region: {currentItem.region}</span>
                  {currentItem.notificationNo && (
                    <>
                      <span>•</span>
                      <span>Advt: {currentItem.notificationNo}</span>
                    </>
                  )}
                </div>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  {title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={currentItem.status} />
                {currentItem.vacancies && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    {currentItem.vacancies}
                  </span>
                )}
              </div>
            </div>

            {/* Summary preview */}
            {summary && (
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#12345A]/70 p-3.5 rounded-xl border border-white/10">
                {summary}
              </p>
            )}

            {/* Quick breakdown metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block font-semibold mb-0.5">Qualification</span>
                <span className="text-white font-medium">{qual || 'Check Official Notification'}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block font-semibold mb-0.5">Key Dates</span>
                <div className="text-white font-medium space-y-0.5">
                  <div>Published: {currentItem.publishedAt}</div>
                  {currentItem.deadline && (
                    <div className="text-[#F2BE4F] font-bold">Last Date: {currentItem.deadline}</div>
                  )}
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 block font-semibold mb-0.5">Application Fee</span>
                <span className="text-white font-medium">{getLocalized(currentItem.applicationFee) || 'Refer to notification'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                {currentItem.pdfUrl && (
                  <a
                    href={currentItem.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-400" />
                    <span>Download Official PDF</span>
                  </a>
                )}

                {currentItem.applyUrl && (
                  <a
                    href={currentItem.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F2BE4F] hover:bg-[#E0AC3C] text-[#0B1F3A] rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>Apply Online</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/jobs/${detailSlug}`}
                  className="text-xs font-bold text-sky-200 hover:text-white flex items-center gap-1 py-1"
                >
                  <span>Full Exam Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-2.5 py-1 text-xs text-slate-300 hover:text-white rounded-md hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
