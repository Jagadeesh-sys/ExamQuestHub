import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  Clock,
  Layers,
  Play,
  RotateCcw,
  Search,
  Sliders,
  X
} from 'lucide-react';
import {
  CANONICAL_SUBJECTS,
  SUBJECT_TOPIC_TREE,
  getAllExamStagesFlat,
  getExamStageConfig
} from '../constants/examHierarchy.js';
import { resolveCanonicalTopicId } from '../constants/mockTaxonomy.js';

const PRESET_TEMPLATES = [
  {
    id: 'speed-mix',
    title: 'Speed Drill Mix',
    detail: '25 Qs · 20 mins · Quant, Reasoning, GK',
    examStage: 'all',
    subjects: ['quantitative-aptitude', 'reasoning', 'general-knowledge'],
    topics: [],
    difficulty: 'All',
    questionType: 'PYQ',
    count: 25,
    duration: '20',
    negMarking: 'official',
    mode: 'cbt'
  },
  {
    id: 'ssc-t1-mini',
    title: 'SSC CGL Tier-1 Mini',
    detail: '40 Qs · 30 mins · +2 / -0.50',
    examStage: 'ssc-cgl-tier1',
    subjects: ['reasoning', 'general-knowledge', 'quantitative-aptitude', 'english-language'],
    topics: [],
    difficulty: 'All',
    questionType: 'PYQ',
    count: 40,
    duration: '30',
    negMarking: 'official',
    mode: 'cbt'
  },
  {
    id: 'rrb-quant-reas',
    title: 'RRB Quant & Reasoning',
    detail: '30 Qs · 30 mins · +1 / -0.33',
    examStage: 'rrb-ntpc-ug-cbt1',
    subjects: ['quantitative-aptitude', 'reasoning'],
    topics: [],
    difficulty: 'All',
    questionType: 'LATEST',
    count: 30,
    duration: '30',
    negMarking: 'official',
    mode: 'cbt'
  },
  {
    id: 'gs-ca-drill',
    title: 'GK, Science & CA Mega',
    detail: '50 Qs · 35 mins · Practice Mode',
    examStage: 'all',
    subjects: ['general-knowledge', 'general-science', 'current-affairs'],
    topics: [],
    difficulty: 'All',
    questionType: 'ALL',
    count: 50,
    duration: '35',
    negMarking: 'none',
    mode: 'practice'
  }
];

const QUESTION_COUNT_OPTIONS = [10, 20, 30, 50, 75, 100];
const DURATION_OPTIONS = [
  { value: 'auto', label: 'Auto (1m/Q)' },
  { value: '15', label: '15 mins' },
  { value: '30', label: '30 mins' },
  { value: '45', label: '45 mins' },
  { value: '60', label: '60 mins' },
  { value: '90', label: '90 mins' }
];
const SOURCE_OPTIONS = [
  { value: 'ALL', label: 'All Official' },
  { value: 'PYQ', label: 'PYQ Shifts' },
  { value: 'LATEST', label: '2024–26 Latest' },
  { value: 'IMPORTANT', label: 'High-Yield' }
];
const DIFFICULTY_OPTIONS = [
  { value: 'All', label: 'All Levels' },
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' }
];

const DEFAULT_CONFIG = {
  examStage: 'all',
  subjects: ['quantitative-aptitude', 'reasoning', 'general-knowledge'],
  topics: [],
  difficulty: 'All',
  questionType: 'PYQ',
  count: 30,
  duration: 'auto',
  negMarking: 'official',
  mode: 'cbt'
};

export default function CustomMockBuilderModal({
  isOpen,
  onClose,
  onLaunch,
  manifestStats,
  initialConfig = null
}) {
  const allExamStages = useMemo(() => getAllExamStagesFlat(), []);

  const [examStage, setExamStage] = useState(DEFAULT_CONFIG.examStage);
  const [subjects, setSubjects] = useState(DEFAULT_CONFIG.subjects);
  const [topics, setTopics] = useState(DEFAULT_CONFIG.topics);
  const [difficulty, setDifficulty] = useState(DEFAULT_CONFIG.difficulty);
  const [questionType, setQuestionType] = useState(DEFAULT_CONFIG.questionType);
  const [count, setCount] = useState(DEFAULT_CONFIG.count);
  const [duration, setDuration] = useState(DEFAULT_CONFIG.duration);
  const [negMarking, setNegMarking] = useState(DEFAULT_CONFIG.negMarking);
  const [mode, setMode] = useState(DEFAULT_CONFIG.mode);
  const [topicSearch, setTopicSearch] = useState('');
  const [activePresetId, setActivePresetId] = useState(null);

  // Hydrate when opened with explicit URL params (e.g., returning via "Rebuild Custom Mock")
  useEffect(() => {
    if (!isOpen || !initialConfig) return;
    if (initialConfig.examStage) setExamStage(initialConfig.examStage);
    if (Array.isArray(initialConfig.subjects) && initialConfig.subjects.length > 0) {
      setSubjects(initialConfig.subjects);
    }
    if (Array.isArray(initialConfig.topics)) setTopics(initialConfig.topics);
    if (initialConfig.difficulty) setDifficulty(initialConfig.difficulty);
    if (initialConfig.questionType) setQuestionType(initialConfig.questionType);
    if (initialConfig.count) setCount(Number(initialConfig.count) || 30);
    if (initialConfig.duration) setDuration(String(initialConfig.duration));
    if (initialConfig.negMarking) setNegMarking(String(initialConfig.negMarking));
    if (initialConfig.mode) setMode(initialConfig.mode);
    setActivePresetId(null);
  }, [isOpen, initialConfig]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const stageResolved = useMemo(
    () => (examStage && examStage !== 'all' ? getExamStageConfig(examStage) : null),
    [examStage]
  );

  const allowedSubjectSet = useMemo(() => {
    if (!stageResolved?.stage?.allowedSubjectIds) return null;
    return new Set(stageResolved.stage.allowedSubjectIds);
  }, [stageResolved]);

  // Keep selected subjects & topics compliant when examStage changes
  const handleChangeExamStage = (nextStage) => {
    setActivePresetId(null);
    setExamStage(nextStage);
    if (nextStage === 'all') return;
    const resolved = getExamStageConfig(nextStage);
    const allowed = resolved?.stage?.allowedSubjectIds;
    if (Array.isArray(allowed) && allowed.length > 0) {
      const allowedSet = new Set(allowed);
      setSubjects((prev) => {
        const filtered = prev.filter((sid) => allowedSet.has(sid));
        const nextSubs = filtered.length > 0 ? filtered : allowed.slice(0, Math.min(3, allowed.length));
        setTopics((prevTopics) =>
          prevTopics.filter((tid) =>
            nextSubs.some((s) => (SUBJECT_TOPIC_TREE[s] || []).some((t) => t.id === tid))
          )
        );
        return nextSubs;
      });
    }
  };

  const applyPreset = (preset) => {
    setActivePresetId(preset.id);
    setExamStage(preset.examStage);
    setSubjects(preset.subjects);
    setTopics(preset.topics);
    setDifficulty(preset.difficulty);
    setQuestionType(preset.questionType);
    setCount(preset.count);
    setDuration(preset.duration);
    setNegMarking(preset.negMarking);
    setMode(preset.mode);
    setTopicSearch('');
  };

  const handleReset = () => {
    setActivePresetId(null);
    setExamStage(DEFAULT_CONFIG.examStage);
    setSubjects(DEFAULT_CONFIG.subjects);
    setTopics(DEFAULT_CONFIG.topics);
    setDifficulty(DEFAULT_CONFIG.difficulty);
    setQuestionType(DEFAULT_CONFIG.questionType);
    setCount(DEFAULT_CONFIG.count);
    setDuration(DEFAULT_CONFIG.duration);
    setNegMarking(DEFAULT_CONFIG.negMarking);
    setMode(DEFAULT_CONFIG.mode);
    setTopicSearch('');
  };

  const toggleSubject = (sid) => {
    if (allowedSubjectSet && !allowedSubjectSet.has(sid)) return;
    setActivePresetId(null);
    setSubjects((prev) => {
      const next = prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid];
      setTopics((prevTopics) =>
        prevTopics.filter((tid) =>
          next.some((s) => (SUBJECT_TOPIC_TREE[s] || []).some((t) => t.id === tid))
        )
      );
      return next;
    });
  };

  const toggleTopic = (tid) => {
    setActivePresetId(null);
    setTopics((prev) => (prev.includes(tid) ? prev.filter((x) => x !== tid) : [...prev, tid]));
  };

  const subjectCounts = manifestStats?.subjectCounts || {};
  const topicCounts = manifestStats?.topicCounts || {};

  const getTopicCount = (subjectId, topicId) => {
    let total = 0;
    const prefix = `${subjectId}::`;
    for (const [k, val] of Object.entries(topicCounts)) {
      if (k.startsWith(prefix)) {
        const rawTop = k.slice(prefix.length);
        if (rawTop === topicId || resolveCanonicalTopicId(rawTop) === topicId) {
          total += Number(val) || 0;
        }
      }
    }
    return total;
  };

  const groupedTopics = useMemo(() => {
    const query = topicSearch.trim().toLowerCase();
    const groups = [];
    for (const sid of subjects) {
      const subMeta = CANONICAL_SUBJECTS.find((s) => s.id === sid);
      const list = (SUBJECT_TOPIC_TREE[sid] || [])
        .map((t) => ({
          ...t,
          subjectId: sid,
          count: getTopicCount(sid, t.id)
        }))
        .filter((t) => !query || t.name.toLowerCase().includes(query));
      if (list.length > 0) {
        groups.push({
          subjectId: sid,
          subjectName: subMeta?.name || sid,
          topics: list
        });
      }
    }
    return groups;
  }, [subjects, topicSearch, topicCounts]);

  // Live blueprint calculations
  const blueprint = useMemo(() => {
    const activeSubs = subjects.filter((sid) => !allowedSubjectSet || allowedSubjectSet.has(sid));
    const subCountMap = {};
    let totalAvailable = 0;

    for (const sid of activeSubs) {
      const selectedTopicsForSub = topics.filter((tid) =>
        (SUBJECT_TOPIC_TREE[sid] || []).some((t) => t.id === tid)
      );
      let subPool = 0;
      if (topics.length > 0) {
        for (const tid of selectedTopicsForSub) {
          subPool += getTopicCount(sid, tid);
        }
      } else {
        subPool = Number(subjectCounts[sid]) || 0;
      }
      subCountMap[sid] = subPool;
      totalAvailable += subPool;
    }

    // Subject allocation preview matching questionSelectionEngine balanced distribution
    const eligibleSubsForAlloc = activeSubs.filter((sid) => {
      if (Object.keys(subjectCounts).length === 0) return true;
      return (subCountMap[sid] || 0) > 0;
    });

    const targetQuestions =
      Object.keys(subjectCounts).length > 0 && totalAvailable > 0
        ? Math.min(count, totalAvailable)
        : count;

    const allocation = [];
    if (eligibleSubsForAlloc.length > 0) {
      const base = Math.floor(targetQuestions / eligibleSubsForAlloc.length);
      let rem = targetQuestions % eligibleSubsForAlloc.length;
      for (const sid of eligibleSubsForAlloc) {
        const subMeta = CANONICAL_SUBJECTS.find((s) => s.id === sid);
        const share = base + (rem > 0 ? 1 : 0);
        if (rem > 0) rem--;
        allocation.push({
          id: sid,
          name: subMeta?.shortName || subMeta?.name || sid,
          questions: share,
          available: subCountMap[sid] || 0
        });
      }
    }

    const marksPerQ =
      stageResolved?.stage?.marksPerQuestion ||
      (activeSubs.length === 1 && activeSubs[0] === 'english-language' ? 2 : 1);
    const negRate =
      negMarking === 'none'
        ? 0
        : stageResolved?.stage?.negativeMarking ??
          (activeSubs.length === 1 && activeSubs[0] === 'english-language' ? 0.5 : 0.33);

    const effectiveMinutes =
      duration === 'auto' ? Math.max(10, Math.min(180, targetQuestions)) : Number(duration) || 30;

    return {
      activeSubs,
      totalAvailable,
      targetQuestions,
      allocation,
      marksPerQ,
      negRate,
      totalMarks: targetQuestions * marksPerQ,
      effectiveMinutes,
      hasShortfall: Object.keys(subjectCounts).length > 0 && totalAvailable > 0 && totalAvailable < count
    };
  }, [subjects, topics, allowedSubjectSet, subjectCounts, topicCounts, count, duration, negMarking, stageResolved]);

  const canLaunch =
    blueprint.activeSubs.length > 0 &&
    (Object.keys(subjectCounts).length === 0 || blueprint.totalAvailable > 0);

  const handleLaunchClick = () => {
    if (!canLaunch) return;
    onLaunch({
      mode,
      examStage,
      subjects: blueprint.activeSubs,
      topics,
      difficulty,
      questionType,
      count,
      duration: duration === 'auto' ? '' : duration,
      negMarking
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#081529]/65 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-builder-title"
    >
      <div
        className="bg-white sm:rounded-2xl w-full max-w-5xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <header className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-white shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#2468B4] font-semibold">
              <Sliders className="w-3.5 h-3.5 shrink-0" />
              <span>Custom Mock Test Studio</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-medium tabular-nums">
                {(manifestStats?.totalQuestions || 19858).toLocaleString()} Verified Qs
              </span>
            </div>
            <h2
              id="custom-builder-title"
              className="text-lg sm:text-xl font-heading font-bold text-[#12345A] tracking-tight truncate mt-0.5"
            >
              Build Your Custom Exam Paper
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#12345A] hover:bg-slate-100 transition cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Custom Mock Builder"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Two-Zone Split Body */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Zone: Configuration Deck */}
          <div className="lg:col-span-7 lg:overflow-y-auto p-5 sm:p-6 space-y-6 bg-white">
            {/* Quick Presets */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-500 tracking-wide">
                  Quick-Start Templates
                </h3>
                <span className="text-[11px] text-slate-400">1-click setup</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_TEMPLATES.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`text-left px-3.5 py-2.5 rounded-xl border transition cursor-pointer ${
                        isActive
                          ? 'bg-[#EAF3FF] border-[#2468B4] text-[#12345A]'
                          : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#12345A] flex items-center justify-between gap-2">
                        <span className="truncate">{preset.title}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-[#2468B4] shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate tabular-nums">
                        {preset.detail}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 01. Target Exam & Syllabus Stage */}
            <section className="space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <label
                  htmlFor="custom-exam-stage"
                  className="text-sm font-bold text-[#12345A]"
                >
                  01. Target Exam &amp; Syllabus Scope
                </label>
                {stageResolved && (
                  <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap">
                    +{stageResolved.stage.marksPerQuestion} / -{stageResolved.stage.negativeMarking} pattern
                  </span>
                )}
              </div>
              <select
                id="custom-exam-stage"
                value={examStage}
                onChange={(e) => handleChangeExamStage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-[#2468B4] focus:ring-2 focus:ring-[#2468B4]/15 transition"
              >
                <option value="all">All Competitive Exams (National Question Pool)</option>
                {allExamStages.map((st) => (
                  <option key={st.stageId} value={st.stageId}>
                    {st.examShortName} — {st.name} (+{st.marksPerQuestion} / -{st.negativeMarking})
                  </option>
                ))}
              </select>
              {stageResolved && (
                <p className="text-xs text-slate-500">
                  Restricted strictly to questions eligible for{' '}
                  <strong className="text-slate-700">
                    {stageResolved.exam.shortName} {stageResolved.stage.shortName}
                  </strong>
                  . Cross-exam &amp; out-of-syllabus items are excluded automatically.
                </p>
              )}
            </section>

            {/* 02. Subjects Allocation */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#12345A]">
                  02. Select Subjects{' '}
                  <span className="text-slate-400 font-medium tabular-nums">
                    ({blueprint.activeSubs.length} active)
                  </span>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePresetId(null);
                      const eligibleIds = CANONICAL_SUBJECTS.filter(
                        (s) => !allowedSubjectSet || allowedSubjectSet.has(s.id)
                      ).map((s) => s.id);
                      setSubjects(
                        blueprint.activeSubs.length === eligibleIds.length ? [] : eligibleIds
                      );
                      setTopics([]);
                    }}
                    className="text-xs font-semibold text-[#2468B4] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    {blueprint.activeSubs.length ===
                    CANONICAL_SUBJECTS.filter((s) => !allowedSubjectSet || allowedSubjectSet.has(s.id)).length
                      ? 'Clear All'
                      : 'Select All Eligible'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CANONICAL_SUBJECTS.map((sub) => {
                  const isDisallowed = allowedSubjectSet && !allowedSubjectSet.has(sub.id);
                  const active = !isDisallowed && subjects.includes(sub.id);
                  const availableNum = Number(subjectCounts[sub.id]) || 0;

                  return (
                    <button
                      key={sub.id}
                      type="button"
                      disabled={isDisallowed}
                      onClick={() => toggleSubject(sub.id)}
                      className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-left transition min-h-[44px] ${
                        isDisallowed
                          ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-65'
                          : active
                          ? 'bg-[#12345A] border-[#12345A] text-white cursor-pointer'
                          : 'bg-white border-slate-200 hover:border-[#2468B4]/50 hover:bg-slate-50 text-slate-800 cursor-pointer'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{sub.name}</div>
                        <div
                          className={`text-[11px] tabular-nums ${
                            isDisallowed
                              ? 'text-slate-400'
                              : active
                              ? 'text-blue-200'
                              : 'text-slate-500'
                          }`}
                        >
                          {isDisallowed
                            ? `Not in ${stageResolved?.stage?.shortName || 'stage'} syllabus`
                            : availableNum > 0
                            ? `${availableNum.toLocaleString()} questions`
                            : 'Available'}
                        </div>
                      </div>
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                          isDisallowed
                            ? 'border-slate-200 bg-slate-100'
                            : active
                            ? 'bg-[#F2BE4F] border-[#F2BE4F] text-[#0B1F3A]'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 03. Canonical Topics (Optional Narrowing) */}
            {subjects.length > 0 && (
              <section className="space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#12345A]">
                    03. Topic Focus{' '}
                    <span className="text-slate-400 font-normal text-xs">
                      (Optional · balanced mix if none chosen)
                    </span>
                  </span>
                  {topics.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setActivePresetId(null);
                        setTopics([]);
                      }}
                      className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer self-start sm:self-auto whitespace-nowrap"
                    >
                      Clear Topics ({topics.length})
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    placeholder="Filter topics (e.g. Percentage, Indian Polity, Syllogism)..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#2468B4]"
                  />
                  {topicSearch && (
                    <button
                      type="button"
                      onClick={() => setTopicSearch('')}
                      aria-label="Clear topic filter"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 space-y-3">
                  {groupedTopics.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-3">
                      No topics matched &ldquo;{topicSearch}&rdquo;.
                    </p>
                  ) : (
                    groupedTopics.map((grp) => (
                      <div key={grp.subjectId} className="space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-500">
                          {grp.subjectName}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {grp.topics.map((top) => {
                            const isPicked = topics.includes(top.id);
                            return (
                              <button
                                key={top.id}
                                type="button"
                                onClick={() => toggleTopic(top.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                                  isPicked
                                    ? 'bg-[#2468B4] text-white border-[#2468B4]'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <span>{top.name}</span>
                                {top.count > 0 && (
                                  <span
                                    className={`text-[10.5px] tabular-nums ${
                                      isPicked ? 'text-blue-100' : 'text-slate-400'
                                    }`}
                                  >
                                    {top.count.toLocaleString()}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {/* 04. Test Parameters */}
            <section className="space-y-4">
              <div className="text-sm font-bold text-[#12345A]">
                04. Paper Size, Timing &amp; Marking
              </div>

              {/* Question Count Segmented Control */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Question Count</span>
                  <span className="text-slate-500 tabular-nums">{count} Questions</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {QUESTION_COUNT_OPTIONS.map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => {
                        setActivePresetId(null);
                        setCount(cnt);
                      }}
                      className={`py-2 rounded-lg text-xs font-bold tabular-nums transition cursor-pointer whitespace-nowrap ${
                        count === cnt
                          ? 'bg-white text-[#12345A] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Duration */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Timer Duration</span>
                  <span className="text-slate-500 tabular-nums">
                    {blueprint.effectiveMinutes} Minutes
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setActivePresetId(null);
                        setDuration(opt.value);
                      }}
                      className={`py-2 px-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                        duration === opt.value
                          ? 'bg-white text-[#12345A] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 block">Difficulty</span>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
                    {DIFFICULTY_OPTIONS.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => {
                          setActivePresetId(null);
                          setDifficulty(d.value);
                        }}
                        className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                          difficulty === d.value
                            ? 'bg-white text-[#12345A] shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {d.value === 'All' ? 'Mixed' : d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 block">Question Source</span>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                    {SOURCE_OPTIONS.map((src) => (
                      <button
                        key={src.value}
                        type="button"
                        onClick={() => {
                          setActivePresetId(null);
                          setQuestionType(src.value);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                          questionType === src.value
                            ? 'bg-white text-[#12345A] shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {src.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Marking & Engine Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 block">Marking Scheme</span>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePresetId(null);
                        setNegMarking('official');
                      }}
                      className={`py-2 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                        negMarking === 'official'
                          ? 'bg-white text-[#12345A] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Exam Negative
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePresetId(null);
                        setNegMarking('none');
                      }}
                      className={`py-2 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                        negMarking === 'none'
                          ? 'bg-white text-[#12345A] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      No Negative (0)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 block">Attempt Mode</span>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePresetId(null);
                        setMode('cbt');
                      }}
                      className={`py-2 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                        mode === 'cbt'
                          ? 'bg-[#12345A] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Timed CBT
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePresetId(null);
                        setMode('practice');
                      }}
                      className={`py-2 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                        mode === 'practice'
                          ? 'bg-[#2468B4] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Instant Practice
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Zone: Live Test Blueprint & Summary Panel */}
          <aside className="lg:col-span-5 bg-[#F8FAFC] border-t lg:border-t-0 lg:border-l border-slate-200 p-5 sm:p-6 flex flex-col justify-between gap-5 lg:overflow-y-auto">
            <div className="space-y-5">
              {/* Blueprint Header */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#2468B4]">Live Paper Blueprint</div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-heading font-bold text-[#12345A] tabular-nums">
                    {blueprint.targetQuestions} Questions
                  </span>
                  <span className="text-xs font-semibold text-slate-500 tabular-nums">
                    {blueprint.effectiveMinutes} mins
                  </span>
                </div>
                <div className="text-xs text-slate-500 tabular-nums">
                  {Object.keys(subjectCounts).length > 0
                    ? `${blueprint.totalAvailable.toLocaleString()} matching questions in verified bank`
                    : 'Drawing across verified SSC, RRB & APPSC archives'}
                </div>
              </div>

              {/* Validation / Shortfall Notice */}
              {blueprint.activeSubs.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>Select at least one subject on the left to generate your custom mock test.</span>
                </div>
              ) : Object.keys(subjectCounts).length > 0 && blueprint.totalAvailable === 0 ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    No questions matched those exact topic filters. Clear selected topics or add another subject.
                  </span>
                </div>
              ) : blueprint.hasShortfall ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="tabular-nums">
                    Selected filters have ~{blueprint.totalAvailable} verified questions. The engine will include all available matches without cross-topic padding.
                  </span>
                </div>
              ) : null}

              {/* Balanced Subject Distribution */}
              {blueprint.allocation.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#12345A]">Subject Distribution</span>
                    <span className="text-slate-500">Balanced quota</span>
                  </div>
                  <div className="space-y-2.5">
                    {blueprint.allocation.map((item) => (
                      <div key={item.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700 truncate">{item.name}</span>
                          <span className="font-bold text-[#12345A] tabular-nums shrink-0">
                            {item.questions} Qs
                          </span>
                        </div>
                        <progress
                          max={Math.max(1, blueprint.targetQuestions)}
                          value={item.questions}
                          className="w-full h-1.5 rounded-full overflow-hidden accent-[#12345A] bg-slate-100 block"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spec Table */}
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
                <div className="px-4 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Total Marks</span>
                  </span>
                  <span className="font-bold text-[#12345A] tabular-nums">
                    {blueprint.totalMarks} Marks
                  </span>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Marking Rule</span>
                  </span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    +{blueprint.marksPerQ} / {blueprint.negRate === 0 ? '0 (No penalty)' : `-${blueprint.negRate}`}
                  </span>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration</span>
                  </span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    {blueprint.effectiveMinutes} Minutes
                  </span>
                </div>
                <div className="px-4 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-slate-500">Selected Mode</span>
                  <span className="font-bold text-[#2468B4]">
                    {mode === 'cbt' ? 'Timed CBT Simulation' : 'Practice (Instant Key)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Launch Action */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200">
              <button
                type="button"
                disabled={!canLaunch}
                onClick={handleLaunchClick}
                className="w-full py-3 px-6 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {mode === 'cbt'
                    ? `Start ${blueprint.targetQuestions}Q Custom CBT`
                    : `Start ${blueprint.targetQuestions}Q Practice`}
                </span>
              </button>
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                <span>100% Free · No Login Required</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
