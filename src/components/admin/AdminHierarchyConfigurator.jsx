import React, { useState } from 'react';
import { Layers, RotateCcw, Save, CheckCircle2, Clock, Award, ShieldCheck } from 'lucide-react';
import {
  CANONICAL_SUBJECTS,
  getConfigurableExamHierarchy,
  saveExamHierarchyOverride,
  resetExamHierarchyOverride
} from '../../constants/examHierarchy.js';

export default function AdminHierarchyConfigurator({ onNotify }) {
  const [hierarchy, setHierarchy] = useState(() => getConfigurableExamHierarchy());
  const [expandedExamId, setExpandedExamId] = useState(() => hierarchy[0]?.examId || 'ssc-cgl');
  const [dirty, setDirty] = useState(false);

  const updateStageField = (examId, stageId, field, value) => {
    setHierarchy((prev) =>
      prev.map((exam) => {
        if (exam.examId !== examId) return exam;
        return {
          ...exam,
          stages: (exam.stages || []).map((stage) => {
            if (stage.stageId !== stageId) return stage;
            const next = { ...stage, [field]: value };
            if (field === 'marksPerQuestion' || field === 'totalQuestions') {
              const tq = Number(field === 'totalQuestions' ? value : next.totalQuestions) || 0;
              const mpq = Number(field === 'marksPerQuestion' ? value : next.marksPerQuestion) || 1;
              next.totalMarks = Math.round(tq * mpq * 100) / 100;
            }
            return next;
          })
        };
      })
    );
    setDirty(true);
  };

  const updateSectionCount = (examId, stageId, sectionId, newCountRaw) => {
    const count = Math.max(0, Math.min(300, parseInt(newCountRaw || '0', 10) || 0));
    setHierarchy((prev) =>
      prev.map((exam) => {
        if (exam.examId !== examId) return exam;
        return {
          ...exam,
          stages: (exam.stages || []).map((stage) => {
            if (stage.stageId !== stageId) return stage;
            const sections = (stage.sections || []).map((sec) =>
              sec.id === sectionId ? { ...sec, count } : sec
            );
            const totalQuestions = sections.reduce((acc, s) => acc + (Number(s.count) || 0), 0);
            const totalMarks = sections.reduce(
              (acc, s) => acc + (Number(s.count) || 0) * (Number(s.marksPerQuestion ?? stage.marksPerQuestion) || 1),
              0
            );
            return {
              ...stage,
              sections,
              totalQuestions,
              totalMarks: Math.round(totalMarks * 100) / 100
            };
          })
        };
      })
    );
    setDirty(true);
  };

  const handleSaveAll = () => {
    const ok = saveExamHierarchyOverride(hierarchy);
    if (ok) {
      setDirty(false);
      if (onNotify) onNotify('Exam hierarchy & official stage patterns saved!', 'success');
    } else if (onNotify) {
      onNotify('Failed to save hierarchy overrides.', 'error');
    }
  };

  const handleResetDefaults = () => {
    resetExamHierarchyOverride();
    const fresh = getConfigurableExamHierarchy();
    setHierarchy(fresh);
    setDirty(false);
    if (onNotify) onNotify('Exam hierarchy restored to official syllabus defaults.', 'info');
  };

  const subjectNameMap = Object.fromEntries(CANONICAL_SUBJECTS.map((s) => [s.id, s.shortName]));

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3EAF2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EAF3FF] text-[#12345A] text-[11px] font-bold mb-1.5">
            <Layers className="w-3.5 h-3.5 text-[#2468B4]" />
            <span>Configurable Exam Hierarchy &amp; Stage Patterns</span>
          </div>
          <h3 className="text-lg font-black text-[#12345A]">
            Exam → Stage → Section Quotas &amp; Marking Rules
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintains separate stages (Tier-1 vs Tier-2, UG vs Graduate, Prelims vs Mains) and official negative marking rules used by the Mock Engine.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl border border-[#E3EAF2] bg-[#F6F8FC] hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Official Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs ${
              dirty
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-[#12345A] hover:bg-[#1E4E8C] text-white'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{dirty ? 'Save Pattern Changes' : 'Saved'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {hierarchy.map((exam) => {
          const isOpen = expandedExamId === exam.examId;
          return (
            <div key={exam.examId} className="bg-white rounded-3xl border border-[#E3EAF2] overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setExpandedExamId(isOpen ? '' : exam.examId)}
                className="w-full p-5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F6F8FC]/60 transition cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#12345A] text-white text-[11px] font-black">
                      {exam.agency}
                    </span>
                    <h4 className="font-black text-[#12345A] text-base">{exam.name}</h4>
                    <span className="text-[11px] font-semibold text-[#2468B4]">
                      ({(exam.stages || []).length} {(exam.stages || []).length === 1 ? 'Stage' : 'Stages'})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Syllabus Version: {exam.syllabusVersion}</p>
                </div>
                <span className="text-xs font-bold text-[#2468B4]">
                  {isOpen ? 'Collapse Stages ▲' : 'Configure Stages ▼'}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-[#E3EAF2] space-y-4 bg-[#F6F8FC]/40">
                  {(exam.stages || []).map((stage) => (
                    <div key={stage.stageId} className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E3EAF2] space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-sm text-[#12345A]">{stage.name}</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono">
                              {stage.stageId}
                            </span>
                            {stage.qualifyingOnly && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                                Qualifying Stage
                              </span>
                            )}
                          </div>
                          {stage.note && (
                            <p className="text-[11px] text-slate-500 mt-1">{stage.note}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs font-bold text-[#12345A]">
                          <span className="inline-flex items-center gap-1 bg-[#EAF3FF] px-2.5 py-1 rounded-lg">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#2468B4]" />
                            {stage.totalQuestions} Qs
                          </span>
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            {stage.totalMarks} Marks
                          </span>
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {stage.durationMinutes} min
                          </span>
                        </div>
                      </div>

                      {/* Configurable Stage Parameters */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">Duration (Minutes)</label>
                          <input
                            type="number"
                            min="10"
                            max="240"
                            value={stage.durationMinutes}
                            onChange={(e) =>
                              updateStageField(
                                exam.examId,
                                stage.stageId,
                                'durationMinutes',
                                Math.max(10, parseInt(e.target.value || '60', 10) || 60)
                              )
                            }
                            className="w-full p-2 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl font-bold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">Marks / Question</label>
                          <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            max="10"
                            value={stage.marksPerQuestion}
                            onChange={(e) =>
                              updateStageField(
                                exam.examId,
                                stage.stageId,
                                'marksPerQuestion',
                                Math.max(0.5, parseFloat(e.target.value || '1') || 1)
                              )
                            }
                            className="w-full p-2 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl font-bold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">Negative Marking</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="5"
                            value={stage.negativeMarking}
                            onChange={(e) =>
                              updateStageField(
                                exam.examId,
                                stage.stageId,
                                'negativeMarking',
                                Math.max(0, parseFloat(e.target.value || '0') || 0)
                              )
                            }
                            className="w-full p-2 bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Sections Breakdown */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Official Section Quotas (Total: {stage.totalQuestions} Questions)
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {(stage.sections || []).map((sec) => (
                            <div
                              key={sec.id}
                              className="p-3 rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-[#12345A] truncate">{sec.name}</div>
                                <div className="text-[10px] text-slate-500 mt-0.5 flex flex-wrap gap-1">
                                  {(sec.subjectIds || []).map((sid) => (
                                    <span key={sid} className="px-1.5 py-0.5 rounded bg-white border border-slate-200">
                                      {subjectNameMap[sid] || sid}
                                    </span>
                                  ))}
                                  <span className="text-slate-400">
                                    (+{sec.marksPerQuestion ?? stage.marksPerQuestion} / -{sec.negativeMarking ?? stage.negativeMarking})
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <input
                                  type="number"
                                  min="0"
                                  max="300"
                                  value={sec.count}
                                  onChange={(e) =>
                                    updateSectionCount(exam.examId, stage.stageId, sec.id, e.target.value)
                                  }
                                  className="w-16 p-1.5 text-center text-xs font-black bg-white border border-slate-300 rounded-lg text-[#12345A]"
                                />
                                <span className="text-[10px] font-bold text-slate-500">Qs</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Mock Engine &amp; Custom Mock Builder read directly from this hierarchy configuration for quotas, duration, and positive/negative marks.
        </span>
      </div>
    </div>
  );
}
