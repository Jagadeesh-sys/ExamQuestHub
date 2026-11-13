import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers,
  AlertTriangle,
  Search,
  ShieldCheck,
  Target,
  Wrench,
  Activity,
  Award,
  CheckSquare,
  Square,
  Download
} from 'lucide-react';
import {
  getExamSyllabusById,
  getSyllabusProgress,
  recordRecentlyViewedSyllabus,
  toggleChapterProgress
} from '../services/syllabusService.js';
import { getCategoryById, getExamChapterCount } from '../data/syllabus/syllabusRegistry.js';

const DETAIL_TABS = [
  { id: 'overview', label: 'Overview & Eligibility' },
  { id: 'pattern', label: 'Selection & Exam Pattern' },
  { id: 'syllabus', label: 'Complete Syllabus & Topics' },
  { id: 'resources', label: 'Official PDF & Prep' }
];

export default function SyllabusDetailPage() {
  const { examId } = useParams();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('syllabus');
  const [activeSubjectId, setActiveSubjectId] = useState('all');
  const [topicSearch, setTopicSearch] = useState('');
  const [expandedChapters, setExpandedChapters] = useState({});
  const [progress, setProgress] = useState({ completedChapters: [], completionPercent: 0 });
  const [selectedVersionIdx, setSelectedVersionIdx] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const record = await getExamSyllabusById(examId, false);
        if (!mounted) return;
        setExam(record);
        setSelectedVersionIdx(0);
        setActiveSubjectId('all');
        setTopicSearch('');

        if (record) {
          recordRecentlyViewedSyllabus(record.id);
          const prog = await getSyllabusProgress(record.id);
          if (mounted && prog) setProgress(prog);

          // Expand first 2 chapters of the first subject by default for immediate utility
          const initialExpanded = {};
          const firstSubject = record.subjects?.[0];
          (firstSubject?.chapters || []).slice(0, 2).forEach((ch) => {
            initialExpanded[`${firstSubject.id}__${ch.id}`] = true;
          });
          setExpandedChapters(initialExpanded);

          // Update document title & meta for SEO parity
          document.title = `${record.name} Syllabus (${record.notificationYear}) | ExamQuestHub`;
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [examId]);

  const category = useMemo(
    () => (exam ? getCategoryById(exam.categoryId) : null),
    [exam]
  );

  const totalChapters = useMemo(() => getExamChapterCount(exam), [exam]);
  const completedSet = useMemo(
    () => new Set(progress?.completedChapters || []),
    [progress]
  );
  const completedCount = completedSet.size;
  const completionPercent = totalChapters > 0
    ? Math.min(100, Math.round((completedCount / totalChapters) * 100))
    : 0;

  const handleToggleChapterCheck = async (chapterKey) => {
    if (!exam) return;
    const updated = await toggleChapterProgress(exam, chapterKey);
    if (updated) setProgress(updated);
  };

  const toggleChapterAccordion = (key) => {
    setExpandedChapters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAllInView = () => {
    if (!exam) return;
    const next = { ...expandedChapters };
    (exam.subjects || []).forEach((subj) => {
      if (activeSubjectId === 'all' || activeSubjectId === subj.id) {
        (subj.chapters || []).forEach((ch) => {
          next[`${subj.id}__${ch.id}`] = true;
        });
      }
    });
    setExpandedChapters(next);
  };

  const collapseAllInView = () => {
    setExpandedChapters({});
  };

  const filteredSubjects = useMemo(() => {
    if (!exam) return [];
    const q = topicSearch.trim().toLowerCase();
    return (exam.subjects || [])
      .filter((subj) => activeSubjectId === 'all' || subj.id === activeSubjectId)
      .map((subj) => {
        const chapters = (subj.chapters || []).filter((ch) => {
          if (!q) return true;
          const inTitle = ch.title?.toLowerCase().includes(q);
          const inSubs = (ch.subtopics || []).some((st) => st.toLowerCase().includes(q));
          return inTitle || inSubs || subj.name?.toLowerCase().includes(q);
        });
        return { ...subj, chapters };
      })
      .filter((subj) => subj.chapters.length > 0);
  }, [exam, activeSubjectId, topicSearch]);

  if (loading) {
    return (
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-10 space-y-5">
        <div className="h-44 bg-white rounded-3xl border border-[#E3EAF2] animate-pulse" />
        <div className="h-96 bg-white rounded-3xl border border-[#E3EAF2] animate-pulse" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <div className="bg-white rounded-3xl border border-[#E3EAF2] p-10 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h1 className="font-heading font-extrabold text-xl text-[#182B45]">
            Examination Syllabus Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            The requested exam syllabus ({examId}) could not be located or may be unpublished.
          </p>
          <Link
            to="/syllabus"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#12345A] text-white text-xs font-bold hover:bg-[#0B1F3A]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Syllabus Library</span>
          </Link>
        </div>
      </div>
    );
  }

  const isProvisional = String(exam.verificationStatus || '').toLowerCase().includes('provisional');
  const activeVersion = exam.versionHistory?.[selectedVersionIdx] || exam.versionHistory?.[0];

  return (
    <div className="min-h-screen bg-[#F6F8FC] pb-16">
      {/* Header Summary Banner */}
      <section className="bg-gradient-to-br from-[#0B1F3A] via-[#12345A] to-[#1A4273] text-white border-b border-[#244E82]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-300 flex-wrap">
            <Link to="/syllabus" className="hover:text-white inline-flex items-center gap-1 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Syllabus Library</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {category && (
              <>
                <Link
                  to={`/syllabus?category=${category.id}`}
                  className="hover:text-white font-semibold"
                >
                  {category.shortName || category.name}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </>
            )}
            <span className="text-[#F2BE4F] font-bold truncate">{exam.shortName || exam.examCode}</span>
          </nav>

          {/* Title & Progress Panel */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-2.5 flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#F2BE4F] flex items-center gap-2 flex-wrap">
                <span>{exam.examCode}</span>
                <span>·</span>
                <span>{exam.scope} Government</span>
                {exam.state && (
                  <>
                    <span>·</span>
                    <span>{exam.state}</span>
                  </>
                )}
                <span>·</span>
                <span className={isProvisional ? 'text-amber-300' : 'text-emerald-300'}>
                  {exam.verificationStatus || `Verified ${exam.notificationYear}`}
                </span>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white leading-tight">
                {exam.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                Conducting Authority: <strong className="text-white">{exam.authority}</strong>
              </p>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
                {exam.introduction}
              </p>
            </div>

            {/* Study Completion Card */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-4 sm:p-5 w-full lg:w-72 shrink-0 space-y-3 backdrop-blur-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Your Preparation Tracker
                </span>
                <span className="font-heading font-extrabold text-lg text-[#F2BE4F] tabular-nums">
                  {completionPercent}%
                </span>
              </div>

              <div className="h-2 w-full bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F2BE4F] rounded-full transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-200 tabular-nums">
                <span>
                  {completedCount} of {totalChapters} chapters completed
                </span>
                <span>{(exam.subjects || []).length} subjects</span>
              </div>

              {Array.isArray(exam.versionHistory) && exam.versionHistory.length > 0 && (
                <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-slate-300 font-medium">Cycle Version:</span>
                  <select
                    value={selectedVersionIdx}
                    onChange={(e) => setSelectedVersionIdx(Number(e.target.value))}
                    aria-label="Syllabus version"
                    className="bg-[#0B1F3A] text-white border border-white/25 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-hidden"
                  >
                    {exam.versionHistory.map((v, idx) => (
                      <option key={v.version} value={idx}>
                        {v.version} ({v.year})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Quick 4-Stat Summary Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div className="bg-white/10 border border-white/10 rounded-xl px-3.5 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                Total Questions
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5 tabular-nums">
                {exam.totalQuestions}
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl px-3.5 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                Total Marks
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5 tabular-nums">
                {exam.totalMarks}
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl px-3.5 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                Duration
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5 tabular-nums">
                {exam.duration}
              </div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl px-3.5 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                Negative Marking
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#F2BE4F] mt-0.5">
                {exam.negativeMarking}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Provisional / Cycle Verification Banner when applicable */}
        {(isProvisional || exam.provisionalNote) && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-bold">
                Notification Verification Advisory ({exam.verificationStatus})
              </p>
              <p className="leading-relaxed">
                {exam.provisionalNote ||
                  `Showing latest official ${exam.notificationYear} framework (${exam.officialNotificationRef}). Cross-check against the upcoming 2026 official gazette once released.`}
              </p>
            </div>
          </div>
        )}

        {/* Section Tabs */}
        <div className="bg-white rounded-2xl p-1.5 border border-[#E3EAF2] flex items-center gap-1 overflow-x-auto no-scrollbar">
          {DETAIL_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-[#12345A] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & ELIGIBILITY */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E3EAF2] p-5 sm:p-6 space-y-5">
              <h2 className="font-heading font-extrabold text-lg text-[#12345A] border-b border-slate-100 pb-3">
                Examination Overview & Eligibility
              </h2>

              <dl className="divide-y divide-slate-100 text-xs sm:text-sm">
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1">
                  <dt className="font-bold text-slate-600">Exam Introduction</dt>
                  <dd className="sm:col-span-2 text-[#182B45] leading-relaxed">{exam.introduction}</dd>
                </div>
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1">
                  <dt className="font-bold text-slate-600">Conducting Authority</dt>
                  <dd className="sm:col-span-2 text-[#182B45] font-semibold">{exam.authority}</dd>
                </div>
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1">
                  <dt className="font-bold text-slate-600">Educational Qualification</dt>
                  <dd className="sm:col-span-2 text-[#182B45] leading-relaxed">{exam.qualification}</dd>
                </div>
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1">
                  <dt className="font-bold text-slate-600">Age Limit</dt>
                  <dd className="sm:col-span-2 text-[#182B45] leading-relaxed">{exam.ageLimit}</dd>
                </div>
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1">
                  <dt className="font-bold text-slate-600">Selection Process</dt>
                  <dd className="sm:col-span-2 text-[#182B45] font-medium leading-relaxed">{exam.selectionProcess}</dd>
                </div>
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1">
                  <dt className="font-bold text-slate-600">Language Options</dt>
                  <dd className="sm:col-span-2 text-[#182B45]">
                    {(exam.languages || []).join(', ')}
                  </dd>
                </div>
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1">
                  <dt className="font-bold text-slate-600">Official Notification Ref</dt>
                  <dd className="sm:col-span-2 text-[#182B45]">
                    {exam.officialNotificationRef} · Last verified {exam.lastVerifiedDate}
                  </dd>
                </div>
              </dl>
            </div>

            <aside className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#E3EAF2] p-5 space-y-3">
                <h3 className="font-heading font-bold text-sm text-[#12345A] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2468B4]" />
                  <span>Version History</span>
                </h3>
                <div className="space-y-2.5 text-xs">
                  {(exam.versionHistory || []).map((ver) => (
                    <div key={ver.version} className="p-3 rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#12345A]">
                        <span>{ver.version}</span>
                        <span className="tabular-nums text-slate-500">{ver.updatedAt}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{ver.notes}</p>
                    </div>
                  ))}
                  {activeVersion && activeVersion.notes && (
                    <p className="text-[11px] text-slate-500">
                      Viewing {activeVersion.version} ({activeVersion.year})
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E3EAF2] p-5 space-y-3">
                <h3 className="font-heading font-bold text-sm text-[#12345A]">
                  Jump to Full Syllabus
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Explore all {(exam.subjects || []).length} subjects and {totalChapters} chapters with official vs recommended topic tags.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('syllabus')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Open Chapter-Wise Syllabus
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* TAB 2: SELECTION PROCESS, EXAM PATTERN, PHYSICAL, SKILL & INTERVIEW */}
        {activeTab === 'pattern' && (
          <div className="space-y-5">
            {/* Stages Flow */}
            <div className="bg-white rounded-2xl border border-[#E3EAF2] p-5 sm:p-6 space-y-4">
              <h2 className="font-heading font-extrabold text-lg text-[#12345A] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#2468B4]" />
                <span>Examination Stages & Selection Flow</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">{exam.selectionProcess}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {(exam.stages || []).map((stage, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-[#F6F8FC] border border-[#E3EAF2] p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[#2468B4] uppercase tabular-nums">Stage {idx + 1}</span>
                      <span className={stage.qualifyingOnly ? 'text-amber-700' : 'text-emerald-700'}>
                        {stage.qualifyingOnly ? 'Qualifying' : 'Merit'}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-sm text-[#182B45]">{stage.name}</h3>
                    <div className="text-[11px] font-semibold text-slate-500">{stage.mode}</div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">{stage.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage-Wise Exam Pattern Tables */}
            <div className="space-y-4">
              {(exam.examPattern || []).map((block, bIdx) => (
                <div key={bIdx} className="bg-white rounded-2xl border border-[#E3EAF2] overflow-hidden">
                  <div className="px-5 py-3.5 bg-[#F6F8FC] border-b border-[#E3EAF2] flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#12345A]">
                      {block.stageName}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/70">
                          <th className="py-2.5 px-5 font-bold">Subject / Section</th>
                          <th className="py-2.5 px-4 font-bold text-right tabular-nums">Questions</th>
                          <th className="py-2.5 px-5 font-bold text-right tabular-nums">Marks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(block.sections || []).map((sec, sIdx) => (
                          <tr key={sIdx} className="hover:bg-slate-50/60">
                            <td className="py-3 px-5 font-medium text-[#182B45]">{sec.subject}</td>
                            <td className="py-3 px-4 text-right font-semibold text-slate-700 tabular-nums">
                              {sec.questions}
                            </td>
                            <td className="py-3 px-5 text-right font-bold text-[#12345A] tabular-nums">
                              {sec.marks}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Physical Standards, Skill/Typing/CBAT & Interview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-[#E3EAF2] p-5 space-y-2.5">
                <h3 className="font-heading font-bold text-sm text-[#12345A] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#2468B4]" />
                  <span>Physical Standards & PET/Medical</span>
                </h3>
                {exam.physicalStandards ? (
                  <dl className="space-y-1.5 text-xs text-slate-600">
                    {exam.physicalStandards.maleHeight && (
                      <div>
                        <dt className="font-bold text-slate-800 inline">Male Height: </dt>
                        <dd className="inline">{exam.physicalStandards.maleHeight}</dd>
                      </div>
                    )}
                    {exam.physicalStandards.femaleHeight && (
                      <div>
                        <dt className="font-bold text-slate-800 inline">Female Height: </dt>
                        <dd className="inline">{exam.physicalStandards.femaleHeight}</dd>
                      </div>
                    )}
                    {exam.physicalStandards.maleChest && (
                      <div>
                        <dt className="font-bold text-slate-800 inline">Male Chest: </dt>
                        <dd className="inline">{exam.physicalStandards.maleChest}</dd>
                      </div>
                    )}
                    {exam.physicalStandards.running && (
                      <div>
                        <dt className="font-bold text-slate-800 inline">Running / PET: </dt>
                        <dd className="inline">{exam.physicalStandards.running}</dd>
                      </div>
                    )}
                    {exam.physicalStandards.otherEvents && (
                      <div>
                        <dt className="font-bold text-slate-800 inline">Other Events: </dt>
                        <dd className="inline">{exam.physicalStandards.otherEvents}</dd>
                      </div>
                    )}
                    {exam.physicalStandards.medicalStandard && (
                      <div>
                        <dt className="font-bold text-slate-800 inline">Medical Standards: </dt>
                        <dd className="inline">{exam.physicalStandards.medicalStandard}</dd>
                      </div>
                    )}
                  </dl>
                ) : (
                  <p className="text-xs text-slate-500">
                    No physical efficiency test (PET/PST) required. Standard Central/State Govt medical fitness at joining.
                  </p>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-[#E3EAF2] p-5 space-y-2.5">
                <h3 className="font-heading font-bold text-sm text-[#12345A] flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#2468B4]" />
                  <span>Skill, Typing & Aptitude Tests</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {exam.skillTestDetails || 'No separate skill test or typing test prescribed for this examination.'}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E3EAF2] p-5 space-y-2.5">
                <h3 className="font-heading font-bold text-sm text-[#12345A] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#2468B4]" />
                  <span>Interview & Document Verification</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {exam.interviewDetails || 'Document Verification followed by final merit allotment.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPLETE SUBJECT-WISE & CHAPTER-WISE SYLLABUS */}
        {activeTab === 'syllabus' && (
          <div className="space-y-5">
            {/* Subject Filter + Topic Search + Expand Controls */}
            <div className="bg-white rounded-2xl border border-[#E3EAF2] p-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    placeholder="Filter chapters or subtopics inside this exam (e.g., Parliament, Number System, Thermodynamics)..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4]"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={expandAllInView}
                    className="px-3 py-2 rounded-xl bg-[#EAF3FF] text-[#12345A] hover:bg-[#dcebff] text-xs font-bold cursor-pointer"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllInView}
                    className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Subject Switcher Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                <button
                  type="button"
                  onClick={() => setActiveSubjectId('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                    activeSubjectId === 'all'
                      ? 'bg-[#12345A] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Subjects ({(exam.subjects || []).length})
                </button>
                {(exam.subjects || []).map((subj) => (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => setActiveSubjectId(subj.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                      activeSubjectId === subj.id
                        ? 'bg-[#12345A] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {subj.shortName || subj.name} ({(subj.chapters || []).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Subject & Chapter Accordions */}
            {filteredSubjects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E3EAF2] p-8 text-center space-y-2">
                <p className="text-sm font-bold text-[#182B45]">
                  No chapters matched &ldquo;{topicSearch}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTopicSearch('');
                    setActiveSubjectId('all');
                  }}
                  className="text-xs font-bold text-[#2468B4] hover:underline cursor-pointer"
                >
                  Reset syllabus search
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredSubjects.map((subj) => {
                  const subjChapterKeys = (subj.chapters || []).map((ch) => `${subj.id}__${ch.id}`);
                  const subjDoneCount = subjChapterKeys.filter((k) => completedSet.has(k)).length;

                  return (
                    <div
                      key={subj.id}
                      className="bg-white rounded-2xl border border-[#E3EAF2] overflow-hidden"
                    >
                      <div className="px-5 py-4 bg-[#F6F8FC] border-b border-[#E3EAF2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-bold text-[#2468B4] uppercase tracking-wider">
                            {subj.stageTag || 'All Stages'}
                          </div>
                          <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#12345A]">
                            {subj.name}
                          </h2>
                          {subj.description && (
                            <p className="text-xs text-slate-500 mt-0.5">{subj.description}</p>
                          )}
                        </div>
                        <div className="text-xs font-bold text-slate-600 tabular-nums shrink-0">
                          {subjDoneCount}/{subj.chapters.length} Chapters Done
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {subj.chapters.map((chapter, chIdx) => {
                          const key = `${subj.id}__${chapter.id}`;
                          const isOpen = !!expandedChapters[key];
                          const isDone = completedSet.has(key);
                          const isRecommended = chapter.topicType === 'recommended';

                          return (
                            <div key={key} className="transition-colors">
                              <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleChapterCheck(key)}
                                    aria-label={`Mark ${chapter.title} as completed`}
                                    className="text-[#2468B4] hover:text-[#12345A] shrink-0 cursor-pointer"
                                  >
                                    {isDone ? (
                                      <CheckSquare className="w-4.5 h-4.5 text-emerald-600" />
                                    ) : (
                                      <Square className="w-4.5 h-4.5 text-slate-300" />
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => toggleChapterAccordion(key)}
                                    className="text-left min-w-0 flex-1 flex items-center gap-2 cursor-pointer"
                                  >
                                    <span className="text-xs font-bold text-slate-400 tabular-nums shrink-0">
                                      {String(chIdx + 1).padStart(2, '0')}
                                    </span>
                                    <span
                                      className={`font-semibold text-xs sm:text-sm truncate ${
                                        isDone ? 'text-emerald-800 line-through decoration-emerald-400/60' : 'text-[#182B45]'
                                      }`}
                                    >
                                      {chapter.title}
                                    </span>
                                  </button>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <span
                                    className={`text-[10px] font-bold uppercase tracking-wider ${
                                      isRecommended ? 'text-amber-700' : 'text-emerald-700'
                                    }`}
                                  >
                                    {isRecommended ? 'Recommended' : 'Official'}
                                  </span>
                                  <span className="hidden sm:inline text-[11px] text-slate-400 tabular-nums">
                                    {(chapter.subtopics || []).length} topics
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => toggleChapterAccordion(key)}
                                    aria-label={isOpen ? 'Collapse chapter' : 'Expand chapter'}
                                    className="p-1 text-slate-500 hover:text-[#12345A] cursor-pointer"
                                  >
                                    {isOpen ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {isOpen && (
                                <div className="px-11 sm:px-12 pb-4 pt-1 bg-[#F6F8FC]/60">
                                  <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-4">
                                    {(chapter.subtopics || []).map((sub, sIdx) => (
                                      <li key={sIdx} className="leading-relaxed">
                                        {sub}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Practical / Technical Topics Panel */}
            {Array.isArray(exam.practicalTechnicalTopics) && exam.practicalTechnicalTopics.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E3EAF2] p-5 sm:p-6 space-y-3">
                <h3 className="font-heading font-bold text-base text-[#12345A] flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#2468B4]" />
                  <span>Practical, Technical & Stage-Specific Requirements</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc pl-5">
                  {exam.practicalTechnicalTopics.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: OFFICIAL PDF & PREPARATION RESOURCES */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-[#E3EAF2] p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#12345A]">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="font-heading font-extrabold text-lg">
                  Official Notification & Syllabus References
                </h2>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  <strong>Notification Reference:</strong> {exam.officialNotificationRef}
                </p>
                <p>
                  <strong>Verification Status:</strong> {exam.verificationStatus} (Verified {exam.lastVerifiedDate})
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {exam.officialSyllabusPdfUrl && (
                  <a
                    href={exam.officialSyllabusPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold flex items-center justify-between transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#F2BE4F]" />
                      <span>{exam.syllabusPdfLabel || 'Download Official Syllabus / Paper PDF'}</span>
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {exam.officialWebsiteUrl && (
                  <a
                    href={exam.officialWebsiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#EAF3FF] hover:bg-[#dcebff] text-[#12345A] text-xs font-bold flex items-center justify-between transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#2468B4]" />
                      <span>Visit Official Authority Portal ({exam.officialWebsiteUrl.replace(/^https?:\/\//, '')})</span>
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E3EAF2] p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#12345A]">
                <Target className="w-5 h-5 text-[#2468B4]" />
                <h2 className="font-heading font-extrabold text-lg">
                  Practice & Preparation Resources
                </h2>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Pair this chapter-wise syllabus checklist with real CBT mock tests, verified previous-year question papers, and daily GK capsules on ExamQuestHub.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <Link
                  to={exam.linkedMockCategory ? `/mocks/category/${exam.linkedMockCategory}` : '/mocks'}
                  className="p-3.5 rounded-xl border border-[#E3EAF2] hover:border-[#2468B4] hover:bg-[#EAF3FF]/40 transition-colors space-y-1"
                >
                  <div className="font-heading font-bold text-xs text-[#12345A]">Online Mock Tests</div>
                  <div className="text-[11px] text-slate-500">Real CBT interface with negative marking</div>
                </Link>

                <Link
                  to="/previous-papers"
                  className="p-3.5 rounded-xl border border-[#E3EAF2] hover:border-[#2468B4] hover:bg-[#EAF3FF]/40 transition-colors space-y-1"
                >
                  <div className="font-heading font-bold text-xs text-[#12345A]">Previous Year Papers</div>
                  <div className="text-[11px] text-slate-500">Official shift-wise question papers & keys</div>
                </Link>

                <Link
                  to="/gk-practice"
                  className="p-3.5 rounded-xl border border-[#E3EAF2] hover:border-[#2468B4] hover:bg-[#EAF3FF]/40 transition-colors space-y-1"
                >
                  <div className="font-heading font-bold text-xs text-[#12345A]">Daily GK & Subject MCQs</div>
                  <div className="text-[11px] text-slate-500">Topic-wise bilingual practice bank</div>
                </Link>

                <Link
                  to="/study-material"
                  className="p-3.5 rounded-xl border border-[#E3EAF2] hover:border-[#2468B4] hover:bg-[#EAF3FF]/40 transition-colors space-y-1"
                >
                  <div className="font-heading font-bold text-xs text-[#12345A]">Study Capsules & Notes</div>
                  <div className="text-[11px] text-slate-500">Revision PDFs & subject guides</div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
