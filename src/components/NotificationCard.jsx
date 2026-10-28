import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Clock,
  GraduationCap,
  ExternalLink,
  FileText,
  MapPin,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import StatusBadge from './StatusBadge.jsx';

export default function NotificationCard({ item }) {
  const { t, getLocalized } = useLanguage();

  if (!item) return null;

  const title = getLocalized(item.title);
  const org = getLocalized(item.organization);
  const qual = getLocalized(item.qualification);
  const detailSlug = item.slug || item.id;

  return (
    <article className="bg-white rounded-2xl border border-[#E3EAF2] hover:border-[#2468B4]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Meta Header */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2468B4]">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[170px] sm:max-w-[240px] uppercase tracking-wider text-[11px]">
              {org}
            </span>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Title */}
        <Link
          to={`/jobs/${detailSlug}`}
          className="block group-hover:text-[#2468B4] transition-colors"
        >
          <h3 className="font-heading font-bold text-base sm:text-lg text-[#182B45] leading-snug line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Category & Region badges */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
            {item.category}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
            <MapPin className="w-3 h-3 text-slate-400" />
            {item.region}
          </span>
          {item.vacancies && item.vacancies !== 'TBD' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-100">
              {item.vacancies}
            </span>
          )}
        </div>

        {/* Qualification snippet if available */}
        {qual && (
          <div className="mt-3 text-xs text-slate-600 flex items-start gap-1.5 line-clamp-2">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{qual}</span>
          </div>
        )}
      </div>

      {/* Middle Dates & Verification Section */}
      <div className="px-5 py-2.5 bg-[#F6F8FC]/60 border-t border-b border-[#E3EAF2]/60 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{item.publishedAt}</span>
        </div>

        {item.deadline ? (
          <div className="flex items-center gap-1.5 text-amber-900 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Last Date: {item.deadline}</span>
          </div>
        ) : (
          <span className="text-slate-400 italic text-[11px]">
            {t('referOfficialNotice')}
          </span>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-3.5 sm:p-4 bg-white flex items-center justify-between gap-2">
        <Link
          to={`/jobs/${detailSlug}`}
          className="text-xs font-semibold text-[#12345A] hover:text-[#2468B4] flex items-center gap-1 py-2 px-2.5 rounded-xl hover:bg-slate-50 transition-colors active:scale-95"
        >
          <span>{t('viewDetails')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {item.pdfUrl && (
            <a
              href={item.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 text-slate-600 hover:text-[#12345A] hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/60 active:scale-95"
              title="Official Notification PDF"
              aria-label="Official Notification PDF"
            >
              <FileText className="w-4 h-4 text-red-500" />
            </a>
          )}

          {item.applyUrl && (
            <a
              href={item.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3.5 py-2 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs active:scale-95"
            >
              <span>{item.type === 'admit-card' ? 'Admit Card' : item.type === 'result' ? 'Result' : 'Apply'}</span>
              <ExternalLink className="w-3 h-3 text-slate-300" />
            </a>
          )}
        </div>
      </div>

    </article>
  );
}
