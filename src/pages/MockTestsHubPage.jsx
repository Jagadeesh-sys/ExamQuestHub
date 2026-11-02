import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Search,
  ChevronRight,
  Clock,
  Award,
  Layers,
  Columns3,
  List,
  LayoutGrid,
  Download,
  Play,
  FileText,
  BrainCircuit,
  Calculator,
  Landmark,
  Atom,
  HelpCircle,
  ShieldCheck,
  Calendar,
  Filter
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getAllShifts, RRB_CORE_SUBJECTS } from '../services/rrbMockService.js';
import { MOCK_CATEGORIES, MOCK_TEST_TYPES, countQuestionsBySubject } from '../constants/mockTaxonomy.js';
import { MOCK_TESTS_METADATA } from '../data/mockTestsMetadata.js';
import { getMockQuestions } from '../firebase/firestoreService.js';
import MockTestCard from '../components/MockTestCard.jsx';

export default function MockTestsHubPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Subject Tab: 'general-knowledge' | 'reasoning' | 'quantitative-aptitude' | 'general-science' | 'full'
  const initialSubject = searchParams.get('subject') || 'general-knowledge';
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);

  // Shifts Data
  const [shifts, setShifts] = useState([]);
  const [shiftSearch, setShiftSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('All'); // 'All' | 'May 2026' | 'June 2026' | 'Morning' | 'Afternoon' | 'Evening'

  // View layout option: 'threeInRow' | 'singleAlign' | 'grid'
  const [viewMode, setViewMode] = useState('threeInRow');

  // Secondary legacy section tabs
  const [showAdditionalBanks, setShowAdditionalBanks] = useState(false);
  const [selectedCaMonth, setSelectedCaMonth] = useState('All');
  const [caSearch, setCaSearch] = useState('');
  const [firestoreQuestions, setFirestoreQuestions] = useState([]);

  useEffect(() => {
    setShifts(getAllShifts());
    (async () => {
      try {
        const qData = await getMockQuestions();
        setFirestoreQuestions(qData);
      } catch (err) {
        console.error('Error loading firestore questions:', err);
      }
    })();
  }, []);

  // Update URL search param when subject changes
  const handleSelectSubject = (subId) => {
    setSelectedSubject(subId);
    setSearchParams({ subject: subId });
  };

  const currentSubjectInfo = useMemo(() => {
    if (selectedSubject === 'full') {
      return {
        id: 'full',
        title: 'Full Mock Test (All 4 Subjects)',
        name: 'Full CBT Examination (100 Questions)',
        description: 'Original 100-Question examination paper combining Quantitative Aptitude (30Q), General Awareness & Science (40Q), and Reasoning (30Q) in exact examination sequence.',
        color: 'from-[#0B1F3A] to-[#1E4E8C]',
        badge: 'Full CBT Shift',
        icon: Layers,
        topics: ['Quantitative Aptitude (30Q)', 'General Knowledge & Studies (30-32Q)', 'General Science (8-10Q)', 'Reasoning (30Q)']
      };
    }
    const found = RRB_CORE_SUBJECTS.find((s) => s.id === selectedSubject);
    if (found) {
      let icon = Landmark;
      if (found.id === 'reasoning') icon = BrainCircuit;
      if (found.id === 'quantitative-aptitude') icon = Calculator;
      if (found.id === 'general-science') icon = Atom;
      return { ...found, icon };
    }
    return {
      id: 'general-knowledge',
      title: 'General Knowledge',
      name: 'General Knowledge (GK & GA)',
      description: 'Indian History, Geography, Indian Polity, Economy, Static GK, Current Affairs, Schemes',
      color: 'from-amber-600 to-amber-700',
      badge: 'GK & GA',
      icon: Landmark,
      topics: ['Indian History', 'Geography', 'Polity & Constitution', 'Economy', 'Static GK', 'Current Affairs', 'Government Schemes']
    };
  }, [selectedSubject]);

  // Filtered Shifts
  const filteredShifts = useMemo(() => {
    return shifts.filter((shift) => {
      // Date filter
      if (dateFilter === 'May 2026' && !shift.examDate.includes('May 2026')) return false;
      if (dateFilter === 'June 2026' && !shift.examDate.includes('Jun 2026')) return false;
      if (dateFilter === 'Morning' && !shift.shiftTiming.includes('9:00 AM')) return false;
      if (dateFilter === 'Afternoon' && !shift.shiftTiming.includes('12:45 PM')) return false;
      if (dateFilter === 'Evening' && !shift.shiftTiming.includes('4:30 PM')) return false;

      // Text search
      if (shiftSearch.trim()) {
        const query = shiftSearch.toLowerCase().trim();
        const matchTitle = shift.title.toLowerCase().includes(query);
        const matchCode = shift.code.toLowerCase().includes(query);
        const matchDate = shift.examDate.toLowerCase().includes(query);
        const matchTiming = shift.shiftTiming.toLowerCase().includes(query);
        const matchShiftNum = `shift ${shift.shiftNumber}`.includes(query) || `${shift.shiftNumber}` === query;
        return matchTitle || matchCode || matchDate || matchTiming || matchShiftNum;
      }
      return true;
    });
  }, [shifts, dateFilter, shiftSearch]);

  // Subject question count helper
  const getSubjectQuestionCount = (shift, subId) => {
    if (subId === 'full') return 100;
    if (subId === 'quantitative-aptitude') return shift.subjectCounts?.['Quantitative Aptitude'] || 30;
    if (subId === 'reasoning') return shift.subjectCounts?.['Reasoning'] || 30;
    if (subId === 'general-science') return shift.subjectCounts?.['General Science'] || 10;
    if (subId === 'general-knowledge') return shift.subjectCounts?.['General Knowledge'] || 30;
    return 30;
  };

  const getSubjectDuration = (subId) => {
    if (subId === 'full') return 90;
    return 30;
  };

  const getSubjectMarks = (shift, subId) => {
    if (subId === 'full') return 100;
    return getSubjectQuestionCount(shift, subId);
  };

  // Legacy CA filter
  const filteredCaMocks = useMemo(() => {
    return MOCK_TESTS_METADATA.filter((mock) => {
      const matchMonth =
        selectedCaMonth === 'All' ||
        mock.month.toLowerCase().includes(selectedCaMonth.toLowerCase());
      const matchSearch =
        caSearch === '' ||
        mock.title.toLowerCase().includes(caSearch.toLowerCase()) ||
        mock.code.toLowerCase().includes(caSearch.toLowerCase());
      return matchMonth && matchSearch;
    });
  }, [selectedCaMonth, caSearch]);

  const subjectCounts = useMemo(() => countQuestionsBySubject(firestoreQuestions), [firestoreQuestions]);
  const categoryStats = useMemo(() => {
    return MOCK_CATEGORIES.map((category) => {
      let total = 0;
      category.subjects.forEach((subject) => {
        total += subjectCounts[`${category.id}::${subject.id}`]?.total || 0;
      });
      return { category, total };
    });
  }, [subjectCounts]);

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: t('navHome') || 'Home', path: '/' },
          { label: 'Previous Year Mock Test System' }
        ]}
      />

      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-[#0B1F3A] via-[#12345A] to-[#1E4E8C] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-72 h-72 bg-[#F2BE4F]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#2468B4]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F2BE4F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RRB NTPC UG 2025 · CEN 07/2025 · 32 Shifts CBT Compilation</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Previous Year <span className="text-[#F2BE4F]">Mock Test System</span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-3xl">
            Real questions extracted directly from all 32 shifts of the RRB NTPC Under-Graduate 2025 examination 
            with official answer keys preserved. Practice subject-wise tests or full-length CBT mock tests in realistic exam interface.
          </p>

          {/* Quick Stats Counter */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-[#F2BE4F]">32</div>
              <div className="text-[11px] text-slate-300 font-medium">Official Exam Shifts</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">3,200</div>
              <div className="text-[11px] text-slate-300 font-medium">Extracted Questions</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">4 Core</div>
              <div className="text-[11px] text-slate-300 font-medium">Subjects Classified</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-sky-400">100%</div>
              <div className="text-[11px] text-slate-300 font-medium">Official Answer Keys</div>
            </div>
          </div>
        </div>
      </div>

      {/* CORE 4 SUBJECT CARDS + FULL MOCK TEST (User Request Item 3) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#12345A] tracking-tight flex items-center gap-2">
              <Award className="w-6 h-6 text-[#2468B4]" />
              Select Subject for Mock Tests
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Click any subject below to load all 32 shift papers classified under that subject.
            </p>
          </div>

          <a
            href="/assets/aistudio/RRB-NTPC-UG-2025-EN-All-Papers_copy_f08e8b76.pdf"
            target="_blank"
            rel="noreferrer"
            download="RRB-NTPC-UG-2025-All-Papers.pdf"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E3EAF2] text-[#12345A] text-xs font-bold hover:bg-[#EAF3FF] transition shadow-2xs shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-[#2468B4]" />
            <span>Download Official PDF (16.7MB)</span>
          </a>
        </div>

        {/* The 4 Core Subject Cards + Full Mock Test */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* 1. General Knowledge */}
          <button
            onClick={() => handleSelectSubject('general-knowledge')}
            className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedSubject === 'general-knowledge'
                ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg border-transparent scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-[#E3EAF2] text-slate-800 hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedSubject === 'general-knowledge' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-600'
              }`}>
                <Landmark className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedSubject === 'general-knowledge' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                32 Shifts
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-sm sm:text-base leading-tight">General Knowledge</h3>
              <p className={`text-[11px] mt-1 line-clamp-2 ${
                selectedSubject === 'general-knowledge' ? 'text-amber-100' : 'text-slate-500'
              }`}>
                Polity, History, Geography, Economy, Static GK & Schemes
              </p>
            </div>
          </button>

          {/* 2. Reasoning */}
          <button
            onClick={() => handleSelectSubject('reasoning')}
            className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedSubject === 'reasoning'
                ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg border-transparent scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-[#E3EAF2] text-slate-800 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedSubject === 'reasoning' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedSubject === 'reasoning' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                32 Shifts
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-sm sm:text-base leading-tight">Reasoning</h3>
              <p className={`text-[11px] mt-1 line-clamp-2 ${
                selectedSubject === 'reasoning' ? 'text-emerald-100' : 'text-slate-500'
              }`}>
                Analogy, Coding-Decoding, Series, Blood Relations, Syllogisms
              </p>
            </div>
          </button>

          {/* 3. Quantitative Aptitude */}
          <button
            onClick={() => handleSelectSubject('quantitative-aptitude')}
            className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedSubject === 'quantitative-aptitude'
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg border-transparent scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-[#E3EAF2] text-slate-800 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedSubject === 'quantitative-aptitude' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
              }`}>
                <Calculator className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedSubject === 'quantitative-aptitude' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
              }`}>
                32 Shifts
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-sm sm:text-base leading-tight">Quantitative Aptitude</h3>
              <p className={`text-[11px] mt-1 line-clamp-2 ${
                selectedSubject === 'quantitative-aptitude' ? 'text-blue-100' : 'text-slate-500'
              }`}>
                Arithmetic, Percentage, Profit/Loss, Time & Work, Algebra
              </p>
            </div>
          </button>

          {/* 4. General Science (Separated from GA) */}
          <button
            onClick={() => handleSelectSubject('general-science')}
            className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedSubject === 'general-science'
                ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg border-transparent scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-[#E3EAF2] text-slate-800 hover:border-purple-400'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedSubject === 'general-science' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'
              }`}>
                <Atom className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedSubject === 'general-science' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
              }`}>
                Extracted from GA
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-sm sm:text-base leading-tight">General Science</h3>
              <p className={`text-[11px] mt-1 line-clamp-2 ${
                selectedSubject === 'general-science' ? 'text-purple-100' : 'text-slate-500'
              }`}>
                Physics, Chemistry, Biology, Human Body & Scientific Principles
              </p>
            </div>
          </button>

          {/* 5. Optional Full Mock Test (All 4 Subjects Combined) */}
          <button
            onClick={() => handleSelectSubject('full')}
            className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedSubject === 'full'
                ? 'bg-gradient-to-br from-[#0B1F3A] to-[#12345A] text-white shadow-lg border-transparent scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-[#E3EAF2] text-slate-800 hover:border-[#12345A]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedSubject === 'full' ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#12345A]'
              }`}>
                <Layers className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedSubject === 'full' ? 'bg-[#F2BE4F] text-[#0B1F3A]' : 'bg-amber-100 text-amber-900'
              }`}>
                100 Qs Full CBT
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-sm sm:text-base leading-tight">Full Mock Tests</h3>
              <p className={`text-[11px] mt-1 line-clamp-2 ${
                selectedSubject === 'full' ? 'text-slate-200' : 'text-slate-500'
              }`}>
                Complete 100-Q CBT Shift (All 4 subjects in original sequence)
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* SUBJECT BANNER & SEARCH/FILTER BAR */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3EAF2] shadow-xs space-y-5">
        {/* Active Subject Info Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2468B4]" />
              <h3 className="text-lg sm:text-xl font-black text-[#12345A]">
                {currentSubjectInfo.title} — Available Shift Mock Tests
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              {currentSubjectInfo.description}
            </p>
          </div>

          {/* View mode switcher (User Request: 3 in row, single align, grid) */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 bg-[#F6F8FC] p-1 rounded-xl border border-[#E3EAF2]">
            <span className="text-[11px] font-bold text-slate-500 px-2">Layout:</span>
            <button
              onClick={() => setViewMode('threeInRow')}
              title="3 in a row (Grid Cards)"
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'threeInRow' ? 'bg-white text-[#12345A] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3 in Row</span>
            </button>
            <button
              onClick={() => setViewMode('singleAlign')}
              title="Single Align (Horizontal Rows)"
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'singleAlign' ? 'bg-white text-[#12345A] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Single Align</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Compact Grid"
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-[#12345A] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Shift Date Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
            {['All', 'May 2026', 'June 2026', 'Morning', 'Afternoon', 'Evening'].map((df) => (
              <button
                key={df}
                onClick={() => setDateFilter(df)}
                className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer ${
                  dateFilter === df
                    ? 'bg-[#12345A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {df === 'All' ? 'All 32 Shifts' : df}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={shiftSearch}
              onChange={(e) => setShiftSearch(e.target.value)}
              placeholder="Search shift (e.g. Shift 1, 07 May, 12:45)..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#F6F8FC] border border-[#E3EAF2] rounded-full focus:outline-hidden focus:border-[#2468B4] focus:bg-white transition"
            />
            {shiftSearch && (
              <button
                onClick={() => setShiftSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* MOCK TESTS LIST (32 Shifts) */}
        {filteredShifts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm space-y-2">
            <p>No examination shifts match your filter.</p>
            <button
              onClick={() => { setShiftSearch(''); setDateFilter('All'); }}
              className="px-4 py-1.5 rounded-full bg-[#12345A] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === 'singleAlign'
                ? 'space-y-3'
                : viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
            }
          >
            {filteredShifts.map((shift) => {
              const qCount = getSubjectQuestionCount(shift, selectedSubject);
              const duration = getSubjectDuration(selectedSubject);
              const totalMarks = getSubjectMarks(shift, selectedSubject);
              const testUrl = selectedSubject === 'full' 
                ? `/mocks/${shift.id}`
                : `/mocks/${shift.id}--${selectedSubject}`;

              if (viewMode === 'singleAlign') {
                return (
                  <div
                    key={shift.id}
                    className="bg-white rounded-2xl border border-[#E3EAF2] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#2468B4] hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[#EAF3FF] text-[#12345A] font-black flex flex-col items-center justify-center shrink-0 border border-[#2468B4]/20">
                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Set</span>
                        <span className="text-base leading-none">{shift.shiftNumber}</span>
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-black text-[#12345A] text-sm sm:text-base">
                            {shift.title}
                          </h4>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Official Key
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">{shift.examName} ({shift.examYear})</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {shift.examDate}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {shift.shiftTiming}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="flex items-center gap-3 text-xs text-slate-600 mr-2">
                        <span className="bg-slate-100 px-2 py-1 rounded-md font-bold">{qCount} Questions</span>
                        <span className="bg-slate-100 px-2 py-1 rounded-md font-bold">{duration} Mins</span>
                        <span className="bg-slate-100 px-2 py-1 rounded-md font-bold">{totalMarks} Marks</span>
                      </div>
                      <Link
                        to={testUrl}
                        className="px-4 py-2 rounded-full bg-[#12345A] hover:bg-[#1E4E8C] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Test</span>
                      </Link>
                      <Link
                        to={`${testUrl}?mode=practice`}
                        className="px-3 py-2 rounded-full bg-[#EAF3FF] hover:bg-[#DCEBFF] text-[#12345A] text-xs font-bold transition"
                      >
                        Practice
                      </Link>
                    </div>
                  </div>
                );
              }

              // Card Layout (3 in a Row or Grid)
              return (
                <div
                  key={shift.id}
                  className="bg-white rounded-3xl border border-[#E3EAF2] p-5 flex flex-col justify-between gap-4 hover:border-[#2468B4] hover:shadow-lg transition-all group"
                >
                  <div className="space-y-3">
                    {/* Header badge & Shift */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#12345A] font-black flex items-center justify-center text-xs border border-[#2468B4]/20">
                          S{shift.shiftNumber}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            {shift.examName} · {shift.examYear}
                          </span>
                          <h4 className="font-black text-[#12345A] text-base leading-snug group-hover:text-[#2468B4] transition">
                            {shift.title}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Date and Timing */}
                    <div className="bg-[#F6F8FC] rounded-2xl p-3 space-y-1.5 text-xs text-slate-600 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-[#2468B4]" />
                          {shift.examDate}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Official Key
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Shift Timing: {shift.shiftTiming}</span>
                      </div>
                    </div>

                    {/* Metadata Chips: Questions, Duration, Marks */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                        <div className="text-xs font-black text-[#12345A]">{qCount}</div>
                        <div className="text-[10px] text-slate-500 font-medium">Questions</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                        <div className="text-xs font-black text-[#12345A]">{duration}m</div>
                        <div className="text-[10px] text-slate-500 font-medium">Duration</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                        <div className="text-xs font-black text-[#12345A]">{totalMarks}</div>
                        <div className="text-[10px] text-slate-500 font-medium">Marks (-0.33)</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <Link
                      to={testUrl}
                      className="w-full py-2.5 rounded-xl bg-[#12345A] hover:bg-[#1E4E8C] text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Test</span>
                    </Link>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`${testUrl}?mode=practice`}
                        className="py-1.5 rounded-xl bg-[#EAF3FF] hover:bg-[#DCEBFF] text-[#12345A] text-[11px] font-bold text-center transition"
                      >
                        Practice Mode
                      </Link>
                      <Link
                        to={`${testUrl}?mode=solutions`}
                        className="py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold text-center transition"
                      >
                        Solutions Key
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ADDITIONAL QUESTION BANKS ACCORDION / TOGGLE */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <button
          onClick={() => setShowAdditionalBanks(!showAdditionalBanks)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-[#E3EAF2] hover:bg-slate-50 transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#2468B4]" />
            <div>
              <h3 className="font-black text-[#12345A] text-sm sm:text-base">
                Additional Exam Categories & Monthly Current Affairs Mocks
              </h3>
              <p className="text-xs text-slate-500">
                Explore Computer Science (CSE), English Language, and monthly Current Affairs full compilations.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#2468B4] px-3 py-1 rounded-full bg-[#EAF3FF]">
            {showAdditionalBanks ? 'Hide Additional Banks' : 'Show Additional Banks'}
          </span>
        </button>

        {showAdditionalBanks && (
          <div className="space-y-8 pt-4">
            {/* Subject-wise Test Series (CSE, English, etc.) */}
            <div className="space-y-4">
              <h4 className="text-lg font-black text-[#12345A] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#2468B4]" />
                Additional Subject-wise Series
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryStats.map(({ category, total }) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.id}
                      to={`/mocks/category/${category.id}`}
                      className="group bg-white rounded-2xl border border-[#E3EAF2] p-5 flex flex-col gap-3 transition-all hover:shadow-md hover:border-[#2468B4]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${category.accent.chip}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {category.subjects.length} subjects
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-black text-[#12345A]">{category.name}</h4>
                        <p className="text-xs text-slate-600 mt-1">{category.tagline}</p>
                      </div>
                      <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>{total > 0 ? `${total} questions` : 'Practice questions'}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#12345A]" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Monthly Current Affairs Compilations */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h4 className="text-lg font-black text-[#12345A] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#2468B4]" />
                  Monthly Current Affairs Mocks ({MOCK_TESTS_METADATA.length} Full CBTs)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCaMocks.slice(0, 6).map((mock) => (
                  <MockTestCard key={mock.id} mock={mock} />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
