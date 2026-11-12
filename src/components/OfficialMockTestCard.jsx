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
  const agency = test.agency || (test.examId === 'ssc-cgl' || test.examName?.includes('SSC') ? 'SSC' : 'RRB');
  const isSsc = agency.includes('SSC') || test.examType === 'SSC CGL' || String(test.id).includes('ssc');

  let avatarBg = 'bg-[#FFE4E6] text-[#E11D48]'; // RRB soft pink / red
  if (isSsc) {
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
  const attempts = test.attempts || '42.6K Attempts';

  return (
    <div className="bg-white rounded-[24px] sm:rounded-[26px] p-4 sm:p-5 shadow-xs border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3.5 relative group">
      {/* =========================================================================
          TOP ROW: Round Avatar + Title & Meta (Questions | Minutes) + Bookmark
          ========================================================================= */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Circular Medallion */}
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-xs sm:text-[13px] shrink-0 tracking-tight select-none shadow-2xs ${avatarBg}`}
          >
            {agency.slice(0, 4)}
          </div>

          {/* Title & Metadata */}
          <div className="min-w-0">
            <h3 className="font-heading font-black text-sm sm:text-base text-[#12345A] tracking-tight leading-snug line-clamp-1 group-hover:text-[#2468B4] transition-colors">
              {test.title}
            </h3>

            {/* Questions | Duration Row with exact icons */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-1">
              <span className="flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
                <span>{qCount} Questions</span>
              </span>

              <span className="text-slate-300">|</span>

              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
                <span>{duration} Minutes</span>
              </span>

              {test.pdfUrl && (
                <>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <a
                    href={test.pdfUrl}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#12345A]"
                    title="Download official PDF answer key"
                  >
                    <Download className="w-3 h-3" />
                    <span>PDF</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Top-Right Bookmark Button */}
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
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
              <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
            ) : (
              <Bookmark className="w-5 h-5 stroke-[1.8]" />
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM ROW: Flame Attempts Pill + Difficulty + Negative Marking + "Start Test"
          ========================================================================= */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* Left Pills Stack */}
        <div className="flex flex-col gap-1.5 min-w-0">
          {/* Row 1: Flame attempts + Hard pill (if Hard) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEDD5] text-[#C2410C] text-xs font-bold shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-[#EA580C] fill-[#EA580C]" />
              <span>{attempts}</span>
            </span>

            {diff === 'Hard' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#F3E8FF] text-[#7E22CE] shadow-2xs">
                Hard
              </span>
            )}
          </div>

          {/* Row 2: Medium/Easy pill (if not Hard) */}
          {diff !== 'Hard' && (
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${diffBg}`}>
                {diff}
              </span>
            </div>
          )}

          {/* Row 3: Negative marking pill */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F1F5F9] text-[#475569] text-xs font-medium border border-slate-200/50 shadow-2xs">
              {negMarking}
            </span>
          </div>
        </div>

        {/* Right Buttons: Optional Practice + Navy "Start Test" Pill Button */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
          {onPractice && (
            <button
              type="button"
              onClick={() => onPractice(test)}
              className="px-3.5 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Practice
            </button>
          )}

          <button
            type="button"
            onClick={() => onStartTest(test)}
            className="px-5 sm:px-6 py-2.5 rounded-full bg-[#0F2942] hover:bg-[#071B2D] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>Start Test</span>
          </button>
        </div>
      </div>
    </div>
  );
}
