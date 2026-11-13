import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Layers,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  FileText,
  GraduationCap,
  X
} from 'lucide-react';
import {
  getExamCategories,
  getExamSyllabi,
  getAllSyllabusProgress,
  getRecentlyViewedSyllabi
} from '../services/syllabusService.js';
import {
  examMatchesCategory,
  getExamChapterCount,
  getSyllabusCategoryCounts
} from '../data/syllabus/syllabusRegistry.js';

const SCOPE_TABS = [
  { id: 'all', label: 'All Exams' },
  { id: 'central', label: 'Central Govt' },
  { id: 'state', label: 'State Govt (AP / TG / All States)' },
  { id: 'popular', label: 'Popular Exams' }
];

const QUALIFICATION_FILTERS = [
  { id: 'all', label: 'All Qualifications' },
  { id: '10th', label: '10th / Matric' },
  { id: '12th', label: '10+2 / Intermediate' },
  { id: 'graduate', label: 'Graduate / Degree' },
  { id: 'engineering', label: 'Diploma / B.E. / B.Tech' },
  { id: 'teaching', label: 'B.Ed / D.El.Ed / PG / NET' }
];

function matchesQualification(exam, qualId) {
  if (qualId === 'all') return true;
  const q = `${exam.qualification || ''} ${exam.name || ''}`.toLowerCase();
  if (qualId === '10th') return q.includes('10th') || q.includes('matric');
  if (qualId === '12th') return q.includes('10+2') || q.includes('12th') || q.includes('intermediate') || q.includes('senior secondary');
  if (qualId === 'graduate') return q.includes('bachelor') || q.includes('degree') || q.includes('graduat');
  if (qualId === 'engineering') return q.includes('diploma') || q.includes('b.e.') || q.includes('b.tech') || q.includes('engineering') || exam.categoryId === 'engineering';
  if (qualId === 'teaching') return q.includes('b.ed') || q.includes('d.el.ed') || q.includes('master') || exam.categoryId === 'teaching';
  return true;
}

function getSyllabusSearchText(exam) {
  const subjectNames = (exam.subjects || []).map((s) => `${s.name} ${s.shortName || ''}`).join(' ');
  const chapterNames = (exam.subjects || [])
    .flatMap((s) => (s.chapters || []).map((c) => c.title))
    .join(' ');
  return `${exam.name} ${exam.shortName} ${exam.examCode} ${exam.authority} ${exam.state || ''} ${exam.qualification || ''} ${subjectNames} ${chapterNames}`.toLowerCase();
}

export default function SyllabusHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState([]);
  const [exams, setExams] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [recentIds, setRecentIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [scopeFilter, setScopeFilter] = useState('all');
  const [qualFilter, setQualFilter] = useState('all');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [cats, list] = await Promise.all([getExamCategories(), getExamSyllabi(false)]);
        if (!mounted) return;
        setCategories(cats);
        setExams(list);
        setProgressMap(getAllSyllabusProgress());
        setRecentIds(getRecentlyViewedSyllabi());
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    const next = new URLSearchParams(searchParams);
    if (catId === 'all') next.delete('category');
    else next.set('category', catId);
    setSearchParams(next, { replace: true });
    const listEl = document.getElementById('syllabus-results-section');
    if (listEl && catId !== 'all') {
      listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const categoryCounts = useMemo(() => getSyllabusCategoryCounts(exams), [exams]);

  const categoryLookup = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const recentExams = useMemo(() => {
    if (!recentIds.length || !exams.length) return [];
    const byId = new Map(exams.map((e) => [e.id, e]));
    return recentIds.map((id) => byId.get(id)).filter(Boolean).slice(0, 4);
  }, [recentIds, exams]);

  const popularExams = useMemo(
    () => exams.filter((e) => e.popular).slice(0, 8),
    [exams]
  );

  const stateExamsSummary = useMemo(() => {
    const apCount = exams.filter((e) => e.state === 'Andhra Pradesh' || e.categoryId === 'appsc').length;
    const tgCount = exams.filter((e) => e.state === 'Telangana' || e.categoryId === 'tgpsc').length;
    const allStateCount = exams.filter((e) => e.scope === 'State' || e.scope === 'Central & State').length;
    const centralCount = exams.filter((e) => e.scope === 'Central' || e.scope === 'Central & State').length;
    return { apCount, tgCount, allStateCount, centralCount };
  }, [exams]);

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return exams.filter((exam) => {
      if (!examMatchesCategory(exam, selectedCategory)) return false;
      if (scopeFilter === 'central' && exam.scope === 'State') return false;
      if (scopeFilter === 'state' && exam.scope === 'Central') return false;
      if (scopeFilter === 'popular' && !exam.popular) return false;
      if (!matchesQualification(exam, qualFilter)) return false;
      if (q && !getSyllabusSearchText(exam).includes(q)) return false;
      return true;
    });
  }, [exams, selectedCategory, scopeFilter, qualFilter, searchQuery]);

  const hasActiveFilters =
    selectedCategory !== 'all' || scopeFilter !== 'all' || qualFilter !== 'all' || searchQuery.trim() !== '';

  const resetFilters = () => {
    setSelectedCategory('all');
    setScopeFilter('all');
    setQualFilter('all');
    setSearchQuery('');
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] pb-16">
      {/* Header & Search Hero */}
      <section className="bg-gradient-to-br from-[#0B1F3A] via-[#12345A] to-[#1B4980] text-white border-b border-[#244E82]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#F2BE4F]">
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>2026 Syllabus Library · Central & State Competitive Examinations</span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-[34px] tracking-tight text-white leading-tight">
                Government Competitive Exams Syllabus
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                Complete chapter-wise syllabus, exam pattern, negative marking, physical standards, and study checklists across Railways, SSC, APPSC, TGPSC, UPSC, Banking, Defence, Police, Engineering, and Teaching examinations.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0 bg-white/10 border border-white/15 rounded-2xl p-3 sm:px-4 backdrop-blur-xs">
              <div className="text-center px-2">
                <div className="font-heading font-extrabold text-lg sm:text-xl text-[#F2BE4F] tabular-nums">
                  {categories.length || 12}
                </div>
                <div className="text-[10px] font-semibold text-slate-200 uppercase tracking-wide">
                  Categories
                </div>
              </div>
              <div className="text-center px-2 border-x border-white/15">
                <div className="font-heading font-extrabold text-lg sm:text-xl text-white tabular-nums">
                  {exams.length}
                </div>
                <div className="text-[10px] font-semibold text-slate-200 uppercase tracking-wide">
                  Exams
                </div>
              </div>
              <div className="text-center px-2">
                <div className="font-heading font-extrabold text-lg sm:text-xl text-emerald-300 tabular-nums">
                  2026
                </div>
                <div className="text-[10px] font-semibold text-slate-200 uppercase tracking-wide">
                  Updated Cycle
                </div>
              </div>
            </div>
          </div>

          {/* Search & Quick Qualification Bar */}
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-lg border border-white/20 flex flex-col md:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any exam, code, authority, subject, or chapter (e.g., SSC CGL, APPSC Group 2, Thermodynamics, Polity)..."
                aria-label="Search exam syllabi"
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#182B45] bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-56">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={qualFilter}
                  onChange={(e) => setQualFilter(e.target.value)}
                  aria-label="Filter by qualification"
                  className="w-full pl-8 pr-3 py-2.5 text-xs font-semibold text-[#182B45] bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4] cursor-pointer"
                >
                  {QUALIFICATION_FILTERS.map((qf) => (
                    <option key={qf.id} value={qf.id}>
                      {qf.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Scope Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {SCOPE_TABS.map((tab) => {
              const active = scopeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setScopeFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#F2BE4F] text-[#0B1F3A] shadow-xs'
                      : 'bg-white/10 text-slate-100 hover:bg-white/20 border border-white/15'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Recently Viewed Syllabi (if any) */}
        {recentExams.length > 0 && !hasActiveFilters && (
          <section aria-label="Recently Viewed Syllabi" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-base sm:text-lg text-[#12345A] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2468B4]" />
                <span>Recently Viewed Syllabi</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recentExams.map((exam) => {
                const prog = progressMap[exam.id];
                const pct = prog?.completionPercent || 0;
                return (
                  <Link
                    key={exam.id}
                    to={`/syllabus/${exam.id}`}
                    className="bg-white rounded-2xl border border-[#E3EAF2] p-4 hover:border-[#2468B4] hover:shadow-sm transition-all flex flex-col justify-between gap-2.5 group"
                  >
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 tabular-nums">
                        <span>{exam.examCode}</span>
                        <span>·</span>
                        <span>{exam.notificationYear}</span>
                      </div>
                      <h3 className="font-heading font-bold text-sm text-[#182B45] group-hover:text-[#2468B4] line-clamp-1">
                        {exam.shortName || exam.name}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
                        <span>Progress</span>
                        <span className="font-bold text-[#12345A]">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2468B4] rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Central vs State Government Quick Explorer */}
        {!hasActiveFilters && (
          <section aria-label="Central and State Examination Portals" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#E3EAF2] p-5 flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2468B4] uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>Central Government Examinations</span>
                </div>
                <h2 className="font-heading font-extrabold text-lg text-[#182B45]">
                  UPSC, SSC, Railways (RRB), Banking, Defence & CAPF
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All-India cadre examinations including Civil Services, CGL, CHSL, NTPC, Group D, ALP, IBPS/SBI PO, RBI Grade B, NDA, CDS, AFCAT, GATE, and CTET.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 tabular-nums">
                  {stateExamsSummary.centralCount} Central & All-India Syllabi
                </span>
                <button
                  type="button"
                  onClick={() => setScopeFilter('central')}
                  className="text-xs font-bold text-[#12345A] hover:text-[#2468B4] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Browse Central Exams</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E3EAF2] p-5 flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>State Government & Regional PSCs</span>
                </div>
                <h2 className="font-heading font-extrabold text-lg text-[#182B45]">
                  APPSC, TGPSC, State Police, TET, DSC & State PSCs
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete AP & Telangana syllabus coverage ({stateExamsSummary.apCount} AP + {stateExamsSummary.tgCount} Telangana + All-State Police/AE/JE/PCS guides) with state bifurcation & GK modules.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('appsc')}
                    className="text-[#12345A] hover:text-[#2468B4] cursor-pointer"
                  >
                    APPSC ({categoryCounts.appsc || 0})
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('tgpsc')}
                    className="text-[#12345A] hover:text-[#2468B4] cursor-pointer"
                  >
                    TGPSC ({categoryCounts.tgpsc || 0})
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    type="button"
                    onClick={() => setScopeFilter('state')}
                    className="text-emerald-700 hover:underline cursor-pointer"
                  >
                    All State ({stateExamsSummary.allStateCount})
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Popular Exams Spotlight */}
        {!hasActiveFilters && popularExams.length > 0 && (
          <section aria-label="Popular Examinations" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F2BE4F]" />
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#12345A]">
                  Popular Exam Syllabi
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setScopeFilter('popular')}
                className="text-xs font-bold text-[#2468B4] hover:text-[#12345A] inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All Popular</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {popularExams.map((exam) => {
                const cat = categoryLookup.get(exam.categoryId);
                const chaptersCount = getExamChapterCount(exam);
                return (
                  <Link
                    key={exam.id}
                    to={`/syllabus/${exam.id}`}
                    className="bg-white rounded-2xl border border-[#E3EAF2] p-4 hover:border-[#2468B4] hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between gap-2">
                        <span className="text-[#2468B4] font-bold">{cat?.code || exam.examCode}</span>
                        <span className="tabular-nums">{exam.notificationYear}</span>
                      </div>
                      <h3 className="font-heading font-bold text-sm text-[#182B45] group-hover:text-[#2468B4] line-clamp-2 leading-snug">
                        {exam.shortName || exam.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{exam.authority}</p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 tabular-nums">
                      <span>
                        {(exam.stages || []).length} Stages · {chaptersCount} Chapters
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#12345A] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Browse by 12 Categories */}
        <section aria-label="Browse by Exam Category" className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#12345A]" />
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#12345A]">
                Browse by 12 Exam Categories
              </h2>
            </div>
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => handleSelectCategory('all')}
                className="text-xs font-bold text-[#2468B4] hover:underline cursor-pointer"
              >
                Show All 12 Categories
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(active ? 'all' : cat.id)}
                  className={`text-left rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    active
                      ? 'bg-[#12345A] text-white border-[#12345A] shadow-md'
                      : 'bg-white text-[#182B45] border-[#E3EAF2] hover:border-[#2468B4] hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className={`font-bold uppercase tracking-wider ${active ? 'text-[#F2BE4F]' : 'text-[#2468B4]'}`}>
                        {cat.code} · {cat.scope}
                      </span>
                      <span className={`font-bold tabular-nums ${active ? 'text-slate-200' : 'text-slate-500'}`}>
                        {count} Exams
                      </span>
                    </div>
                    <h3 className={`font-heading font-bold text-sm leading-snug ${active ? 'text-white' : 'text-[#182B45]'}`}>
                      {cat.name}
                    </h3>
                  </div>
                  <p className={`text-[11px] line-clamp-2 leading-relaxed ${active ? 'text-slate-200' : 'text-slate-500'}`}>
                    {cat.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Filtered Exam Syllabi Results Grid */}
        <section id="syllabus-results-section" aria-label="Exam Syllabus Directory" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3EAF2] pb-3">
            <div>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#12345A]">
                {selectedCategory === 'all'
                  ? 'All Competitive Exam Syllabi'
                  : categoryLookup.get(selectedCategory)?.name || 'Category Syllabi'}
              </h2>
              <p className="text-xs text-slate-500 tabular-nums mt-0.5">
                Showing {filteredExams.length} verified examination{filteredExams.length === 1 ? '' : 's'}
                {scopeFilter !== 'all' ? ` · ${SCOPE_TABS.find((t) => t.id === scopeFilter)?.label}` : ''}
                {qualFilter !== 'all' ? ` · ${QUALIFICATION_FILTERS.find((q) => q.id === qualFilter)?.label}` : ''}
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white border border-[#E3EAF2] text-xs font-bold text-slate-700 hover:text-[#12345A] hover:border-[#2468B4] cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-[#E3EAF2] p-5 h-52 animate-pulse space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E3EAF2] p-10 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-heading font-bold text-base text-[#182B45]">
                No matching exam syllabus found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing your qualification filter or searching with broader keywords such as UPSC, SSC, RRB, APPSC, Banking, or Civil.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-[#12345A] text-white text-xs font-bold hover:bg-[#0B1F3A] cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExams.map((exam) => {
                const cat = categoryLookup.get(exam.categoryId);
                const stageCount = (exam.stages || []).length;
                const subjectCount = (exam.subjects || []).length;
                const chapterCount = getExamChapterCount(exam);
                const prog = progressMap[exam.id];
                const pct = prog?.completionPercent || 0;
                const isProvisional = String(exam.verificationStatus || '').toLowerCase().includes('provisional');

                return (
                  <article
                    key={exam.id}
                    className="bg-white rounded-2xl border border-[#E3EAF2] p-5 hover:border-[#2468B4] hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2.5">
                      {/* Metadata Header (Zero-pill discipline with middot separators) */}
                      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500">
                        <span className="text-[#2468B4] font-bold truncate">
                          {cat?.shortName || exam.categoryId.toUpperCase()} · {exam.examCode}
                        </span>
                        <span
                          className={`shrink-0 font-bold tabular-nums ${
                            isProvisional ? 'text-amber-700' : 'text-emerald-700'
                          }`}
                        >
                          {isProvisional ? 'Provisional' : exam.verificationStatus || `Verified ${exam.notificationYear}`}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-heading font-extrabold text-base text-[#182B45] leading-snug">
                          {exam.name}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                          {exam.authority}
                        </p>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {exam.introduction}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-[#2468B4]" />
                          <span>
                            {stageCount} Stage{stageCount === 1 ? '' : 's'} · {subjectCount} Subjects · {chapterCount} Chapters
                          </span>
                        </span>
                      </div>

                      {pct > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] tabular-nums">
                            <span className="text-slate-500 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Syllabus Progress</span>
                            </span>
                            <span className="font-bold text-[#12345A]">{pct}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <Link
                        to={`/syllabus/${exam.id}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#EAF3FF] hover:bg-[#12345A] text-[#12345A] hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>View Complete Syllabus</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
