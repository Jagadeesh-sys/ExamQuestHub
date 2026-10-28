import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Play, BookOpen, CheckCircle, ExternalLink } from 'lucide-react';

export default function MockTestCard({ mock }) {
  const navigate = useNavigate();

  const handleStartCbt = () => {
    navigate(`/mocks/${mock.id}?mode=cbt`);
  };

  const handlePractice = (e) => {
    e.stopPropagation();
    navigate(`/mocks/${mock.id}?mode=practice`);
  };

  const handleSolutions = (e) => {
    e.stopPropagation();
    navigate(`/mocks/${mock.id}?mode=solutions`);
  };

  const handleOpenPdf = (e) => {
    e.stopPropagation();
    if (mock.pdfUrl) {
      window.open(mock.pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`rounded-[28px] border ${mock.cardBorder || 'border-[#E3EAF2]'} ${
        mock.cardBg || 'bg-white'
      } p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative`}
    >
      {/* Top Header Pill & PDF Action Button */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span
          className={`px-3.5 py-1.5 ${
            mock.pillBg || 'bg-white'
          } text-slate-800 text-xs font-bold rounded-full shadow-2xs border border-black/5 tracking-tight`}
        >
          {mock.month}
        </span>

        {mock.pdfUrl && (
          <button
            onClick={handleOpenPdf}
            title={`View / Download ${mock.pdfFileName || 'PDF'}`}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-black transition-all border border-black/5 cursor-pointer"
            aria-label="View authentic PDF"
          >
            <FileText className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mock Identification & Title with Count Badge */}
      <div className="space-y-1 mb-5">
        <div className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">
          {mock.code}
        </div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl sm:text-[22px] font-black text-slate-900 tracking-tight leading-snug line-clamp-2">
            {mock.title}
          </h3>
          <div
            className={`w-11 h-11 rounded-full ${
              mock.badgeBg || 'bg-slate-900'
            } ${mock.badgeTextCol || 'text-white'} flex items-center justify-center font-black text-sm shrink-0 shadow-xs border border-white/40`}
          >
            {mock.badgeText}
          </div>
        </div>
        {mock.subtitle && (
          <p className="text-xs text-slate-600 line-clamp-2 pt-1 font-medium leading-relaxed">
            {mock.subtitle}
          </p>
        )}
      </div>

      {/* Pill Tags Matching Reference Design */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {/* Total Questions Pill */}
        <span className="px-3 py-1 rounded-full text-xs font-semibold text-slate-800 bg-white/90 border border-slate-200/80 shadow-2xs">
          {mock.questionsCount} MCQs
        </span>

        {/* Duration Pill */}
        <span className="px-3 py-1 rounded-full text-xs font-semibold text-slate-800 bg-white/90 border border-slate-200/80 shadow-2xs">
          {mock.timeMinutes} Mins
        </span>

        {/* Practice Mode Clickable Pill */}
        <button
          onClick={handlePractice}
          className="px-3.5 py-1 rounded-full text-xs font-bold text-[#1E5692] bg-white border border-[#2468B4]/40 hover:bg-[#EAF3FF] hover:border-[#2468B4] transition-colors shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
          title="Instant answers and detailed explanations"
        >
          <span>Practice Mode</span>
        </button>

        {/* Solutions Clickable Pill */}
        <button
          onClick={handleSolutions}
          className="px-3.5 py-1 rounded-full text-xs font-bold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 transition-colors shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
          title="View all verified answers and explanations"
        >
          <span>Solutions</span>
        </button>

        {/* Difficulty Pills if present (Nov mocks) */}
        {mock.difficultyStats && (
          <>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-800 bg-emerald-50/90 border border-emerald-200">
              Easy · {mock.difficultyStats.easy}Q
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-800 bg-amber-50/90 border border-amber-200">
              Med · {mock.difficultyStats.medium}Q
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-rose-800 bg-rose-50/90 border border-rose-200">
              Hard · {mock.difficultyStats.hard}Q
            </span>
          </>
        )}
      </div>

      {/* Card Footer: Marks, Format & Start Mock CTA */}
      <div className="pt-4 border-t border-black/5 flex items-center justify-between gap-3 mt-auto">
        <div>
          <div className="text-lg font-black text-slate-900 tracking-tight leading-none">
            {mock.marks} Marks
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1">
            {mock.timeMinutes} Mins · CBT
          </div>
        </div>

        <button
          onClick={handleStartCbt}
          className="bg-[#111827] hover:bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Start Mock</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
