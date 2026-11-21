import React, { useEffect, useState } from 'react';
import { X, Loader2, AlertTriangle, CheckCircle2, Edit2, FileText } from 'lucide-react';
import { getQuestionsForShift } from '../../services/rrbMockService.js';
import { getQuestionText, getOptionTexts } from '../../utils/questionClassifier.js';

export default function AdminShiftPaperPreviewModal({ shift, onClose, onEditQuestion }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    let active = true;
    if (!shift) return undefined;
    setLoading(true);
    getQuestionsForShift(shift.id, null, { includeIncomplete: true })
      .then((list) => {
        if (active) setQuestions(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (active) setQuestions([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [shift]);

  if (!shift) return null;

  const incompleteCount = questions.filter(
    (q) =>
      getQuestionText(q).length < 2 ||
      getOptionTexts(q).filter((o) => o.trim().length > 0).length < 2
  ).length;

  return (
    <div className="fixed inset-0 z-[125] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-[#E3EAF2] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E3EAF2] flex items-start justify-between gap-4 bg-[#F6F8FC]">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-[#12345A] text-white text-[11px] font-black">
                Ordered Paper Preview (1..{questions.length})
              </span>
              {incompleteCount > 0 ? (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {incompleteCount} Incomplete Slots
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  100% Complete Extraction
                </span>
              )}
            </div>
            <h3 className="text-lg font-black text-[#12345A] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2468B4]" />
              <span>{shift.title || shift.id}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {shift.examDate} · {shift.shiftTiming} · {shift.durationMinutes || 90} min · {shift.totalMarks || 100} marks
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
          {loading ? (
            <div className="py-16 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-[#2468B4] animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">Loading ordered shift questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No questions found in this shift bucket.
            </div>
          ) : (
            questions.map((q, index) => {
              const stem = getQuestionText(q);
              const opts = getOptionTexts(q).filter((o) => o.trim().length > 0);
              const isIncomplete = stem.length < 2 || opts.length < 2;
              return (
                <div
                  key={q.id || index}
                  className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isIncomplete
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-white border-[#E3EAF2] hover:border-[#2468B4]'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-[#12345A] text-white font-black text-[10px]">
                        #{q.originalOrder || q.questionNumber || index + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {q.subject}
                      </span>
                      {q.topic && (
                        <span className="px-2 py-0.5 rounded bg-[#EAF3FF] text-[#12345A] font-semibold text-[10px]">
                          {q.topic}
                        </span>
                      )}
                      {isIncomplete && (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                          Incomplete / Diagram Extraction Needed
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-slate-800 line-clamp-2">
                      {stem || '(Empty question stem — inspect source PDF)'}
                    </p>
                  </div>

                  {typeof onEditQuestion === 'function' && (
                    <button
                      type="button"
                      onClick={() => onEditQuestion(q)}
                      className="px-3 py-1.5 rounded-xl bg-[#EAF3FF] hover:bg-[#DCEBFF] text-[#12345A] font-bold text-[11px] flex items-center gap-1 shrink-0 cursor-pointer self-start sm:self-center"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
