import React from 'react';
import { Monitor, Clock, Flame, Bookmark, BookmarkCheck, Play, Download, Crown, CheckCircle2 } from 'lucide-react';

/**
 * Exact UI Card matching user attachment /public/assets/aistudio/image_94cc3b53.png
 * Features:
 * - Circular agency badge (RRB: soft pink/red, SSC: soft green, etc.)
 * - Deep navy title with bold styling
 * - Monitor + 100 Questions | Clock + 90 Minutes meta line
 * - Top-right Bookmark outline button
 * - Soft orange Flame attempts pill (e.g. 58.2K Attempts)
 * - Difficulty pill (Medium: yellow, Hard: lilac, Easy: green)
 * - Soft blue/gray negative marking pill (-0.25 / -0.33 / -0.50 Negative Marking)
 * - Deep navy solid rounded "Start Test" pill button on the right with white play icon
 */
export default function OfficialMockTestCard({
  test,
  isBookmarked = false,
  onToggleBookmark,
  onStartTest,
  onPractice,
  hasProPass = false
}) {
  // Determine avatar colors based on agency or exam
  const agency = test.agency || (test.examId === 'ssc-cgl' || test.examName?.includes('SSC') ? 'SSC' : (test.examName?.includes('APPSC') || String(test.id || '').includes('appsc') ? 'APPSC' : 'RRB'));
  const isAppsc = agency.includes('APPSC') || test.examType === 'APPSC Group II' || String(test.id || '').includes('appsc');
  const isSsc = !isAppsc && (agency.includes('SSC') || test.examType === 'SSC CGL' || String(test.id || '').includes('ssc'));

  let avatarBg = 'bg-[#FFE4E6] text-[#E11D48]'; // RRB soft pink / red
  if (isAppsc) {
    avatarBg = 'bg-[#ECFDF5] text-[#047857]'; // APPSC soft emerald
  } else if (isSsc) {
    avatarBg = 'bg-[#DCFCE7] text-[#15803D]'; // SSC soft green
  } else if (agency === 'GA' || agency === 'GK') {
    avatarBg = 'bg-[#FEF9C3] text-[#A16207]';
  } else if (agency === 'MATH') {
    avatarBg = 'bg-[#E0F2FE] text-[#0369A1]';
  } else if (agency === 'REAS') {
    avatarBg = 'bg-[#F3E8FF] text-[#7E22CE]';
  } else if (agency === 'ENG') {
    avatarBg = 'bg-[#EFF6FF] text-[#1D4ED8]';
  } else if (agency === 'SCI') {
    avatarBg = 'bg-[#F3E8FF] text-[#6B21A8]';
  }

  // Difficulty colors
  const diff = test.difficulty || 'Medium';
  let diffBg = 'bg-[#FEF9C3] text-[#854D0E]'; // Medium: yellow/amber
  if (diff === 'Hard') {
    diffBg = 'bg-[#F3E8FF] text-[#7E22CE]'; // Hard: lilac/purple
  } else if (diff === 'Easy') {
    diffBg = 'bg-[#DCFCE7] text-[#15803D]'; // Easy: mint green
  }

  // Negative marking string
  const negMarking = test.negativeMarking
    ? (test.negativeMarking.includes('Negative') ? test.negativeMarking : `-${test.negativeMarking} Negative Marking`)
    : (isSsc ? '-0.50 Negative Marking' : '-0.25 Negative Marking');

  // Questions and Duration strings
  const qCount = test.questionsCount || test.totalQuestions || 100;
  const duration = test.timeMinutes || test.durationMinutes || (isSsc ? 60 : 90);
  // Official emblem logo
  const defaultLogo = isAppsc ? '/assets/aistudio/image_3b1d93b9.png' : (isSsc ? '/assets/aistudio/image_445d7a66.png' : '/assets/aistudio/image_cbd93505.png');
  const logoUrl = test.logoUrl || defaultLogo;

  return (
    <div className="bg-white rounded-2xl sm:rounded-[20px] p-3.5 sm:p-4 shadow-xs border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-2.5 relative group">
      {/* =========================================================================
          TOP ROW: Round Official Logo + Title & Meta (Questions | Minutes) + Bookmark
          ========================================================================= */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 min-w-0">
          {/* Circular Official Medallion */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white p-0.5 border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
            <img
              src={logoUrl}
              alt={agency}
              className="w-full h-full object-contain rounded-full"
              onError={(e) => {
                e.currentTarget.src = defaultLogo;
              }}
            />
          </div>

          {/* Title & Metadata */}
          <div className="min-w-0">
            <h3 className="font-heading font-black text-xs sm:text-[13.5px] text-[#12345A] tracking-tight leading-snug line-clamp-1 group-hover:text-[#2468B4] transition-colors">
              {test.title}
            </h3>

            {/* Questions | Duration Row */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <Monitor className="w-3 h-3 text-slate-400 stroke-[2.2]" />
                <span>{qCount} Questions</span>
              </span>

              <span className="text-slate-300">|</span>

              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400 stroke-[2.2]" />
                <span>{duration} Mins</span>
              </span>

              {test.pdfUrl && (
                <>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <a
                    href={test.pdfUrl}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="hidden sm:inline-flex items-center gap-1 text-[10.5px] font-bold text-slate-500 hover:text-[#12345A]"
                    title="Download official PDF answer key"
                  >
                    <Download className="w-2.5 h-2.5" />
                    <span>PDF</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Top-Right Bookmark Button */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark?.(test.id);
            }}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Test'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
            ) : (
              <Bookmark className="w-4 h-4 stroke-[1.8]" />
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM ROW: Difficulty + Negative Marking + "Practice" + "▶ Start Test"
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        {/* Left Pills: Difficulty & Negative Marking */}
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${diffBg}`}>
            {diff}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] text-[11px] font-medium border border-slate-200/60">
            {negMarking}
          </span>
        </div>

        {/* Right Buttons: Practice + Start Test matching Image 1 */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onPractice && (
            <button
              type="button"
              onClick={() => onPractice(test)}
              className="px-3 py-1 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer active:scale-95"
            >
              Practice
            </button>
          )}

          <button
            type="button"
            onClick={() => onStartTest(test)}
            className="px-3.5 py-1 rounded-xl bg-[#0F223D] hover:bg-[#071324] text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Play className="w-3 h-3 fill-white text-white" />
            <span>Start Test</span>
          </button>
        </div>
      </div>
    </div>
  );
}
