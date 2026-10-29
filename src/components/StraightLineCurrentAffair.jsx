import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Tag,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

/**
 * StraightLineCurrentAffair:
 * Compact horizontal straight-line item for current affairs.
 * Clicking anywhere expands the full story, topic tags, source info, and actions.
 */
export default function StraightLineCurrentAffair({
  item,
  isExpanded: controlledExpanded,
  onToggle,
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

  const headline = getLocalized(item.headline);
  const summary = getLocalized(item.summary);
  const detailSlug = item.slug || item.id;

  return (
    <div
      className={`w-full bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-2xs ${
        isExpanded
          ? 'border-[#2468B4] ring-2 ring-[#2468B4]/10 shadow-sm'
          : 'border-[#E3EAF2] hover:border-[#2468B4]/40 hover:shadow-xs'
      }`}
    >
      {/* Straight Line Strip */}
      <div
        role="button"
        tabIndex={0}
        onClick={toggleExpand}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleExpand())}
        className="px-3.5 sm:px-4 py-3 cursor-pointer flex items-center justify-between gap-3 select-none hover:bg-slate-50/80 transition-colors"
        aria-expanded={isExpanded}
        title="Click to view full details"
      >
        {/* Left: Topic Badge + Date + Headline in a single line */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <span className="shrink-0 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px] sm:text-[11px] border border-emerald-100 whitespace-nowrap">
            {item.topic || 'General'}
          </span>

          {item.eventDate && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium shrink-0">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{item.eventDate}</span>
            </span>
          )}

          <span className="text-slate-300 hidden md:inline">•</span>

          {/* Headline on straight line */}
          <span className="text-xs sm:text-sm font-semibold text-[#182B45] truncate flex-1 hover:text-[#2468B4] transition-colors">
            {headline}
          </span>
        </div>

        {/* Right: Expand Indicator & Quick Action */}
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

      {/* Expanded Full Details */}
      {isExpanded && (
        <div className="border-t border-[#E3EAF2] bg-[#F6F8FC]/60 p-4 sm:p-5 animate-in slide-in-from-top-1 duration-150 space-y-3.5">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-emerald-700">{item.topic}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.eventDate}
                </span>
              </div>
              <h4 className="font-heading font-extrabold text-base sm:text-lg text-[#182B45] leading-snug">
                {headline}
              </h4>
            </div>

            {item.sourceName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 self-start sm:self-auto shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Source: {item.sourceName}</span>
              </span>
            )}
          </div>

          {/* Media & Full Narrative / Summary */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-3.5 sm:p-4 rounded-xl border border-[#E3EAF2]">
            {item.imageUrl && (
              <div className="w-full sm:w-36 h-28 sm:h-28 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img
                  src={item.imageUrl}
                  alt={headline}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
            )}
            <div className="flex-1 space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="whitespace-pre-line">{summary}</p>
              {item.examRelevance && item.examRelevance.length > 0 && (
                <div className="flex items-center flex-wrap gap-1 pt-1 text-[10px]">
                  <span className="font-semibold text-slate-400">Exam Relevance:</span>
                  {item.examRelevance.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3" /> Tags:
              </span>
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 text-[10px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{item.sourceName ? `Open on ${item.sourceName}` : 'Primary Source Link'}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/current-affairs/${detailSlug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold transition-all shadow-2xs"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={toggleExpand}
                className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200/50"
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
