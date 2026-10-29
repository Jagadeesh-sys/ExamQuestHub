import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Tag,
  Star
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

/**
 * CurrentAffairCard:
 * Flexible card for Current Affairs, supporting 'threeInRow' (spacious 3-column format)
 * and 'grid' (compact multi-column format) with thumbnail image and exam relevance tags.
 */
export default function CurrentAffairCard({ item, layout = 'threeInRow' }) {
  const { t, getLocalized } = useLanguage();

  if (!item) return null;

  const headline = getLocalized(item.headline);
  const summary = getLocalized(item.summary);
  const detailSlug = item.slug || item.id;
  const isThreeInRow = layout === 'threeInRow';
  const examTags = item.examRelevance || ['UPSC', 'APPSC', 'SSC'];

  return (
    <article
      className={`bg-white rounded-2xl border border-[#E3EAF2] hover:border-[#2468B4]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group overflow-hidden relative ${
        isThreeInRow ? 'p-4 sm:p-5' : 'p-3.5'
      }`}
    >
      <div className="space-y-3">
        {/* Top Media & Tags Header */}
        <div className="flex gap-3">
          {item.imageUrl && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
              <img
                src={item.imageUrl}
                alt={headline}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
          )}

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between text-xs gap-1">
              <span className="px-2 py-0.5 rounded bg-[#F0F4F9] text-[#1E3A5F] font-bold text-[10px] border border-slate-200 truncate">
                {item.topic}
              </span>
              <span className="text-slate-400 text-[10px] flex items-center gap-1 shrink-0">
                <Calendar className="w-2.5 h-2.5 text-slate-400" />
                {item.eventDate}
              </span>
            </div>

            {/* Title */}
            <Link
              to={`/current-affairs/${detailSlug}`}
              className={`font-heading font-extrabold text-[#182B45] hover:text-[#2468B4] transition-colors leading-snug block ${
                isThreeInRow ? 'text-sm sm:text-base line-clamp-2' : 'text-xs sm:text-sm line-clamp-2'
              }`}
            >
              {headline}
            </Link>
          </div>
        </div>

        {/* Summary Description */}
        <p
          className={`text-slate-600 leading-relaxed ${
            isThreeInRow ? 'text-xs sm:text-sm line-clamp-3' : 'text-[11px] line-clamp-2'
          }`}
        >
          {summary}
        </p>

        {/* Exam Relevance Tags */}
        <div className="flex items-center flex-wrap gap-1 text-[10px]">
          <span className="font-semibold text-slate-400 text-[9px]">Relevance:</span>
          {examTags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[9px] font-medium border border-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {item.sourceUrl ? (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-slate-500 hover:text-[#2468B4] flex items-center gap-1 truncate max-w-[130px]"
            title={item.sourceName || 'Primary Source'}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">{item.sourceName || t('sourceLink') || 'Verified'}</span>
          </a>
        ) : (
          <span />
        )}

        <Link
          to={`/current-affairs/${detailSlug}`}
          className="font-bold text-xs text-[#2468B4] hover:text-[#12345A] flex items-center gap-0.5 py-0.5 px-1.5 rounded-lg hover:bg-[#EAF3FF] transition-all"
        >
          <span>{t('readMore') || 'Read More'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
