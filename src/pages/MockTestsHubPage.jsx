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
  Cpu,
  HelpCircle,
  ShieldCheck,
  Calendar,
  Filter
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  getAllShifts,
  RRB_MOCK_SUBJECTS,
  slugifyTopic,
  classifyGkTopic,
  classifyComputerTopic
} from '../services/rrbMockService.js';
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
    const found = RRB_MOCK_SUBJECTS.find((s) => s.id === selectedSubject);
    if (found) {
      let icon = Landmark;
      if (found.id === 'reasoning') icon = BrainCircuit;
      if (found.id === 'quantitative-aptitude') icon = Calculator;
      if (found.id === 'general-science') icon = Atom;
      if (found.id === 'computer-science') icon = Cpu;
      return { ...found, icon };
    }
    return {
      id: 'general-knowledge',
      title: 'General Knowledge',
      name: 'General Knowledge (GK & GA)',
      description: 'Indian History, Geography, Indian Polity, Economy, Static GK, Current Affairs & Schemes',
      color: 'from-amber-600 to-amber-700',
      badge: 'GK & GA',
      icon: Landmark,
      topics: ['Indian History', 'Geography', 'Polity & Constitution', 'Economy', 'Static GK', 'Current Affairs', 'Government Schemes']
    };
  }, [selectedSubject]);

  // Active subject question pool
  const currentSubjectQuestions = useMemo(() => {
    if (!firestoreQuestions || firestoreQuestions.length === 0) return [];
    if (selectedSubject === 'full') return firestoreQuestions;
    const cleanTarget = selectedSubject.toLowerCase().replace(/[^a-z]/g, '');

    return firestoreQuestions.filter((q) => {
      const qSub = (q.subject || '').toLowerCase().replace(/[^a-z]/g, '');
      const qSubId = (q.subjectId || '').toLowerCase().replace(/[^a-z]/g, '');
      const qCat = (q.categoryId || '').toLowerCase().replace(/[^a-z]/g, '');

      // Checked before the science rule: "computer-science" also contains "science".
      if (cleanTarget.includes('computer')) {
        return (
          qSub.includes('generalknowledge') &&
          classifyGkTopic(q) === 'Computer Science'
        );
      }
      if (cleanTarget.includes('gk') || cleanTarget.includes('generalknowledge') || cleanTarget.includes('generalawareness')) {
        return (
          qSub.includes('generalknowledge') ||
          qSubId.includes('generalknowledge') ||
          (qCat === 'gk' && !qSub.includes('science') && qSubId !== 'general-science')
        );
      }
      if (cleanTarget.includes('science') || cleanTarget.includes('generalscience')) {
        return (
          qSub.includes('generalscience') ||
          qSubId.includes('generalscience') ||
          qSub.includes('science') ||
          qSubId.includes('science')
        );
      }
      if (cleanTarget.includes('quant') || cleanTarget.includes('quantitative')) {
        return qSub.includes('quantitative') || qSubId.includes('quantitative') || qCat === 'quant';
      }
      if (cleanTarget.includes('reason')) {
        return qSub.includes('reasoning') || qSubId.includes('reasoning') || qCat === 'reasoning';
      }
      return qSub.includes(cleanTarget) || cleanTarget.includes(qSub);
    });
  }, [firestoreQuestions, selectedSubject]);

  // Questions available under each topic. Topic tests serve only these questions.
  const topicQuestionCounts = useMemo(() => {
    const classifier =
      selectedSubject === 'general-knowledge'
        ? classifyGkTopic
        : selectedSubject === 'computer-science'
          ? classifyComputerTopic
          : null;
    if (!classifier) return {};
    const counts = {};
    currentSubjectQuestions.forEach((q) => {
      const topic = classifier(q);
      counts[topic] = (counts[topic] || 0) + 1;
    });
    return counts;
  }, [currentSubjectQuestions, selectedSubject]);

  // Topic-wise tests offered across all subjects in the mocks hub.
  const totalTopics = useMemo(
    () => RRB_MOCK_SUBJECTS.reduce((sum, subject) => sum + (subject.topics?.length || 0), 0),
    []
  );

  // Live count of computer questions, shown on the Computer Science subject card.
  const computerQuestionCount = useMemo(
    () =>
      firestoreQuestions.filter((q) => {
        const qSub = (q.subject || '').toLowerCase().replace(/[^a-z]/g, '');
        return qSub.includes('generalknowledge') && classifyGkTopic(q) === 'Computer Science';
      }).length,
    [firestoreQuestions]
  );

  // Live totals for the hero counters, derived from the extracted PYQ pool.
  const extractedQuestions = useMemo(
    () => firestoreQuestions.filter((q) => q.questionType === 'PYQ'),
    [firestoreQuestions]
  );
  const extractedQuestionCount = extractedQuestions.length;
  const officialShiftCount = useMemo(
    () =>
      new Set(
        extractedQuestions.map((q) => `${q.examLevel || 'UG'}-${q.shiftNumber}`)
      ).size,
    [extractedQuestions]
  );

  // Tab inside active subject: 'tests' | 'topics' | 'browser'
  const [subjectViewTab, setSubjectViewTab] = useState('tests');

  // Question bank search & filter
  const [bankSearch, setBankSearch] = useState('');
  const [bankSubtopic, setBankSubtopic] = useState('All');
  const [expandedSolutions, setExpandedSolutions] = useState({});
  const [browserPage, setBrowserPage] = useState(1);
  const browserPageSize = 24;

  const toggleSolution = (qId) => {
    setExpandedSolutions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Subtopics extracted from current pool
  const availableSubtopics = useMemo(() => {
    const set = new Set();
    currentSubjectQuestions.forEach((q) => {
      if (q.subtopic) set.add(q.subtopic);
    });
    return ['All', ...Array.from(set)];
  }, [currentSubjectQuestions]);

  // Filtered browser questions
  const filteredBrowserQuestions = useMemo(() => {
    return currentSubjectQuestions.filter((q) => {
      if (bankSubtopic !== 'All' && q.subtopic !== bankSubtopic) return false;
      if (bankSearch.trim()) {
        const query = bankSearch.toLowerCase().trim();
        const matchQ = (q.question?.en || '').toLowerCase().includes(query);
        const matchOpts = (q.options?.en || []).some((opt) => opt.toLowerCase().includes(query));
        const matchSubtopic = (q.subtopic || '').toLowerCase().includes(query);
        const matchId = (q.id || '').toLowerCase().includes(query);
        return matchQ || matchOpts || matchSubtopic || matchId;
      }
      return true;
    });
  }, [currentSubjectQuestions, bankSubtopic, bankSearch]);

  const paginatedBrowserQuestions = useMemo(() => {
    const start = (browserPage - 1) * browserPageSize;
    return filteredBrowserQuestions.slice(start, start + browserPageSize);
  }, [filteredBrowserQuestions, browserPage]);

  const totalBrowserPages = Math.ceil(filteredBrowserQuestions.length / browserPageSize);

  // Pre-configured Subject Mock Tests (5 Comprehensive Tests per subject)
  const subjectMockTests = useMemo(() => {
    const sub = selectedSubject;
    const subLabel = currentSubjectInfo.title;

    if (sub === 'full') {
      return [
        {
          id: 'full-cbt-master-1',
          code: 'RRB-CBT-1',
          title: 'RRB NTPC UG 2025 · Full CBT Master Mock 1',
          subtitle: 'Complete 100-Question CBT paper (30 Quant, 30 GK, 10 Science, 30 Reasoning)',
          questionsCount: 100,
          duration: 90,
          marks: 100,
          badge: 'Official CBT Full Mock'
        },
        {
          id: 'full-cbt-master-2',
          code: 'RRB-CBT-2',
          title: 'RRB NTPC UG 2025 · Full CBT Master Mock 2',
          subtitle: 'Full 100 Questions covering all 4 subjects in standard exam sequence',
          questionsCount: 100,
          duration: 90,
          marks: 100,
          badge: 'Full CBT Shift'
        },
        {
          id: 'full-cbt-master-3',
          code: 'RRB-CBT-3',
          title: 'RRB NTPC UG 2025 · Full CBT Master Mock 3',
          subtitle: 'Complete examination simulation with negative marking and timer',
          questionsCount: 100,
          duration: 90,
          marks: 100,
          badge: 'Full CBT Shift'
        },
        {
          id: 'full-cbt-master-4',
          code: 'RRB-CBT-4',
          title: 'RRB NTPC UG 2025 · Full CBT Master Mock 4',
          subtitle: 'High-probability questions selected across 32 examination shifts',
          questionsCount: 100,
          duration: 90,
          marks: 100,
          badge: 'Full CBT Shift'
        },
        {
          id: 'full-cbt-master-5',
          code: 'RRB-CBT-5',
          title: 'RRB NTPC UG 2025 · Full CBT Master Mock 5',
          subtitle: 'Comprehensive speed and accuracy examination test',
          questionsCount: 100,
          duration: 90,
          marks: 100,
          badge: 'Full CBT Shift'
        }
      ];
    }

    return [
      {
        id: `subject-${sub}-master-1`,
        code: `${sub.slice(0, 3).toUpperCase()}-M1`,
        title: `${subLabel} · Master PYQ Mock Test 1`,
        subtitle: `Drawn from all official shifts with 100% official answer keys and solutions`,
        questionsCount: Math.min(100, currentSubjectQuestions.length || 100),
        duration: 90,
        marks: Math.min(100, currentSubjectQuestions.length || 100),
        badge: 'Full Subject Test'
      },
      {
        id: `subject-${sub}-50q-2`,
        code: `${sub.slice(0, 3).toUpperCase()}-T2`,
        title: `${subLabel} · High-Yield Mock Test 2`,
        subtitle: `50 Most important questions for rapid syllabus coverage and revision`,
        questionsCount: 50,
        duration: 45,
        marks: 50,
        badge: 'High-Yield 50Q'
      },
      {
        id: `subject-${sub}-25q-3`,
        code: `${sub.slice(0, 3).toUpperCase()}-T3`,
        title: `${subLabel} · Speed Drill Test 3`,
        subtitle: `25 Timed questions to build speed, accuracy, and examination stamina`,
        questionsCount: 25,
        duration: 25,
        marks: 25,
        badge: 'Speed Drill 25Q'
      },
      {
        id: `subject-${sub}-master-4`,
        code: `${sub.slice(0, 3).toUpperCase()}-M4`,
        title: `${subLabel} · Comprehensive Mock Test 4`,
        subtitle: `Comprehensive assessment covering all key concepts and PYQs`,
        questionsCount: Math.min(100, currentSubjectQuestions.length || 100),
        duration: 90,
        marks: Math.min(100, currentSubjectQuestions.length || 100),
        badge: 'Full Subject Test'
      },
      {
        id: `subject-${sub}-50q-5`,
        code: `${sub.slice(0, 3).toUpperCase()}-T5`,
        title: `${subLabel} · Rapid Revision Mock 5`,
        subtitle: `50 Questions focused on previous year repeated themes and problem types`,
        questionsCount: 50,
        duration: 45,
        marks: 50,
        badge: 'Rapid Revision 50Q'
      }
    ];
  }, [selectedSubject, currentSubjectInfo, currentSubjectQuestions]);

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
            <span>RRB NTPC UG &amp; Graduate 2025 · Official CBT Compilation</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Previous Year <span className="text-[#F2BE4F]">Mock Test System</span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-3xl">
            Real questions extracted directly from the RRB NTPC Under-Graduate (CEN 07/2025) and
            Graduate (CEN 06/2025) 2025 examinations with official answer keys preserved. Practice
            subject-wise tests or full-length CBT mock tests in a realistic exam interface.
          </p>

          {/* Quick Stats Counter */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-[#F2BE4F]">
                {officialShiftCount || '—'}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Official Exam Shifts</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">
                {extractedQuestionCount ? extractedQuestionCount.toLocaleString('en-IN') : '—'}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Extracted Questions</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{totalTopics}</div>
              <div className="text-[11px] text-slate-300 font-medium">Topics Covered</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-sky-400">100%</div>
              <div className="text-[11px] text-slate-300 font-medium">Official Answer Keys</div>
            </div>
          </div>
        </div>
      </div>

      {/* SUBJECT CARDS + FULL MOCK TEST */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#12345A] tracking-tight flex items-center gap-2">
              <Award className="w-6 h-6 text-[#2468B4]" />
              Select Subject for Mock Tests
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Click any subject below to load all official shift papers classified under that subject.
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

        {/* Subject Cards + Full Mock Test */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                1,000+ Questions
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-sm sm:text-base leading-tight">General Knowledge</h3>
              <p className={`text-[11px] mt-1 line-clamp-2 ${
                selectedSubject === 'general-knowledge' ? 'text-amber-100' : 'text-slate-500'
              }`}>
                Polity, History, Geography, Economy, Static GK & Schemes (1,034+ PYQs)
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
                960+ Questions
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
                960+ Questions
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
                246+ Questions
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-sm sm:text-base leading-tight">General Science</h3>
              <p className={`text-[11px] mt-1 line-clamp-2 ${
                selectedSubject === 'general-science' ? 'text-purple-100' : 'text-slate-500'
              }`}>
                Physics, Chemistry, Biology & Principles (Separated from GA)
              </p>
            </div>
          </button>

          {/* 5. Computer Science (Own subject with syllabus subtopics) */}
          <button
            onClick={() => handleSelectSubject('computer-science')}
            className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedSubject === 'computer-science'
                ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white shadow-lg border-transparent scale-[1.02]'
                : 'bg-white hover:bg-slate-50 border-[#E3EAF2] text-slate-800 hover:border-cyan-400'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selectedSubject === 'computer-science' ? 'bg-white/20 text-white' : 'bg-cyan-50 text-cyan-600'
              }`}>
                <Cpu className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedSubject === 'computer-science' ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-800'
              }`}>
                {computerQuestionCount > 0 ? `${computerQuestionCount} Questions` : '8 Topics'}
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-black text-sm sm:text-base leading-tight">Computer Science</h3>
              <p className={`text-[11px] mt-1 line-clamp-2 ${
                selectedSubject === 'computer-science' ? 'text-cyan-100' : 'text-slate-500'
              }`}>
                Fundamentals, OS, Computer Networks, DBMS, DSA, Programming &amp; Digital Logic
              </p>
            </div>
          </button>

          {/* 6. Optional Full Mock Test (All 4 Subjects Combined) */}
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

      {/* UNIFIED SUBJECT MOCK TEST SYSTEM & QUESTION BANK */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E3EAF2] shadow-xs space-y-6">
        {/* Active Subject Info Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#2468B4]" />
              <h3 className="text-xl sm:text-2xl font-black text-[#12345A]">
                {currentSubjectInfo.title} — Mock Tests &amp; Question Bank
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                {currentSubjectQuestions.length || (selectedSubject === 'general-knowledge' ? '1,034+' : selectedSubject === 'general-science' ? '246+' : '960+')} Questions Available
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              {currentSubjectInfo.description}. All official exam shifts unified into comprehensive practice tests and question banks.
            </p>
          </div>

          {/* Subject Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-[#F6F8FC] p-1.5 rounded-2xl border border-[#E3EAF2] shrink-0">
            <button
              onClick={() => setSubjectViewTab('tests')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                subjectViewTab === 'tests'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Mock Tests ({subjectMockTests.length})</span>
            </button>

            <button
              onClick={() => setSubjectViewTab('topics')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                subjectViewTab === 'topics'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Topic Tests ({currentSubjectInfo.topics?.length || 6})</span>
            </button>

            <button
              onClick={() => setSubjectViewTab('browser')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                subjectViewTab === 'browser'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Question Bank ({currentSubjectQuestions.length || 1000}+)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SUBJECT MOCK TESTS */}
        {subjectViewTab === 'tests' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F6F8FC] p-4 rounded-2xl border border-[#E3EAF2]">
              <div>
                <h4 className="font-black text-[#12345A] text-sm sm:text-base">
                  Available CBT Mock Tests for {currentSubjectInfo.title}
                </h4>
                <p className="text-xs text-slate-500">
                  Select a test to begin a timed CBT examination simulation with negative marking (-0.33) and instant scorecard.
                </p>
              </div>

              <Link
                to={`/mocks/subject-${selectedSubject}-master-1?subject=${selectedSubject}&mode=practice`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12345A] text-white text-xs font-bold hover:bg-[#1E4E8C] transition shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Full Master Mock</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {subjectMockTests.map((mock) => {
                const testUrl = `/mocks/${mock.id}?subject=${selectedSubject}`;
                return (
                  <div
                    key={mock.id}
                    className="bg-white rounded-3xl border border-[#E3EAF2] p-5 flex flex-col justify-between gap-4 hover:border-[#2468B4] hover:shadow-lg transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#12345A] font-black flex items-center justify-center text-xs border border-[#2468B4]/20">
                          {mock.code.slice(-2)}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          {mock.badge}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-[#12345A] text-base leading-snug group-hover:text-[#2468B4] transition">
                          {mock.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {mock.subtitle}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                          <div className="text-xs font-black text-[#12345A]">{mock.questionsCount}</div>
                          <div className="text-[10px] text-slate-500 font-medium">Questions</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                          <div className="text-xs font-black text-[#12345A]">{mock.duration}m</div>
                          <div className="text-[10px] text-slate-500 font-medium">Duration</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                          <div className="text-xs font-black text-[#12345A]">{mock.marks}</div>
                          <div className="text-[10px] text-slate-500 font-medium">Marks (-0.33)</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <Link
                        to={testUrl}
                        className="w-full py-2.5 rounded-xl bg-[#12345A] hover:bg-[#1E4E8C] text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Test</span>
                      </Link>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to={`${testUrl}&mode=practice`}
                          className="py-1.5 rounded-xl bg-[#EAF3FF] hover:bg-[#DCEBFF] text-[#12345A] text-[11px] font-bold text-center transition"
                        >
                          Practice Mode
                        </Link>
                        <Link
                          to={`${testUrl}&mode=solutions`}
                          className="py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold text-center transition"
                        >
                          Official Key
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: TOPIC-WISE PRACTICE TESTS */}
        {subjectViewTab === 'topics' && (
          <div className="space-y-6">
            <div className="bg-[#F6F8FC] p-4 rounded-2xl border border-[#E3EAF2]">
              <h4 className="font-black text-[#12345A] text-sm sm:text-base">
                Topic-wise Mastery Tests for {currentSubjectInfo.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Practice specific topics to eliminate weak areas and master previous year examination themes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(currentSubjectInfo.topics || []).map((topic, idx) => {
                const testUrl = `/mocks/topic-${selectedSubject}-${slugifyTopic(topic)}?subject=${selectedSubject}`;
                const questionCount = topicQuestionCounts[topic] || 0;
                return (
                  <div
                    key={topic}
                    className="bg-white rounded-2xl border border-[#E3EAF2] p-5 flex flex-col justify-between gap-3 hover:border-[#2468B4] hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-xs">
                        #{idx + 1}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {questionCount > 0 ? `${questionCount} Questions` : 'Syllabus Topic'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-[#12345A] text-base leading-snug">
                        {topic}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {questionCount > 0
                          ? `${questionCount} previous year questions classified under this topic.`
                          : 'Syllabus topic — practice set drawn from the official Computer Science question pool.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        to={testUrl}
                        className="flex-1 py-2 rounded-xl bg-[#12345A] hover:bg-[#1E4E8C] text-white text-xs font-bold text-center transition"
                      >
                        Start Test
                      </Link>
                      <Link
                        to={`${testUrl}&mode=practice`}
                        className="py-2 px-3 rounded-xl bg-[#EAF3FF] hover:bg-[#DCEBFF] text-[#12345A] text-xs font-bold transition"
                      >
                        Practice
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: COMPLETE QUESTION BANK BROWSER (1,000+ Questions) */}
        {subjectViewTab === 'browser' && (
          <div className="space-y-5">
            {/* Search, Filter and View Mode Toolbar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 bg-[#F6F8FC] rounded-2xl border border-[#E3EAF2]">
              {/* Search input */}
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bankSearch}
                  onChange={(e) => {
                    setBankSearch(e.target.value);
                    setBrowserPage(1);
                  }}
                  placeholder="Search in question text, options, or subtopics..."
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-[#E3EAF2] rounded-full focus:outline-hidden focus:border-[#2468B4] transition"
                />
                {bankSearch && (
                  <button
                    onClick={() => { setBankSearch(''); setBrowserPage(1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Subtopic Filter */}
              {availableSubtopics.length > 2 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 shrink-0">Subtopic:</span>
                  <select
                    value={bankSubtopic}
                    onChange={(e) => {
                      setBankSubtopic(e.target.value);
                      setBrowserPage(1);
                    }}
                    className="text-xs bg-white border border-[#E3EAF2] rounded-full px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:border-[#2468B4]"
                  >
                    {availableSubtopics.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Flexible View Mode Selector (User Request: 3 in row, single align, grid) */}
              <div className="flex items-center gap-1.5 self-start lg:self-auto shrink-0 bg-white p-1 rounded-xl border border-[#E3EAF2]">
                <span className="text-[11px] font-bold text-slate-500 px-2">View:</span>
                <button
                  onClick={() => setViewMode('threeInRow')}
                  title="3 in a Row (Grid Cards)"
                  className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    viewMode === 'threeInRow' ? 'bg-[#12345A] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">3 in Row</span>
                </button>

                <button
                  onClick={() => setViewMode('singleAlign')}
                  title="Single Align (Horizontal Rows)"
                  className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    viewMode === 'singleAlign' ? 'bg-[#12345A] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Single Align</span>
                </button>

                <button
                  onClick={() => setViewMode('grid')}
                  title="Compact Grid"
                  className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    viewMode === 'grid' ? 'bg-[#12345A] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>
            </div>

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Showing <b>{paginatedBrowserQuestions.length}</b> of <b>{filteredBrowserQuestions.length}</b> questions in {currentSubjectInfo.title}
              </span>
              <span>Page {browserPage} of {totalBrowserPages || 1}</span>
            </div>

            {/* QUESTIONS LIST */}
            {filteredBrowserQuestions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm space-y-2">
                <p>No questions matched your search criteria.</p>
                <button
                  onClick={() => { setBankSearch(''); setBankSubtopic('All'); }}
                  className="px-4 py-1.5 rounded-full bg-[#12345A] text-white text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'singleAlign'
                    ? 'space-y-4'
                    : viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                }
              >
                {paginatedBrowserQuestions.map((q, idx) => {
                  const qNum = (browserPage - 1) * browserPageSize + idx + 1;
                  const isExpanded = Boolean(expandedSolutions[q.id]);
                  const correctIdx = Number(q.correctAnswer);
                  const letters = ['A', 'B', 'C', 'D'];
                  const enOptions = Array.isArray(q.options?.en) ? q.options.en : [];

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-3xl border border-[#E3EAF2] p-5 flex flex-col justify-between gap-3 hover:border-[#2468B4] hover:shadow-md transition"
                    >
                      <div className="space-y-2.5">
                        {/* Header: Q Number & Badges */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-xl bg-[#EAF3FF] text-[#12345A] font-black flex items-center justify-center text-xs border border-[#2468B4]/20">
                              Q{qNum}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              {q.subtopic || q.subject}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Official Key
                          </span>
                        </div>

                        {/* Question Text */}
                        <p className="text-sm font-bold text-slate-900 leading-snug">
                          {q.question?.en}
                        </p>

                        {/* 4 Options */}
                        <div className="space-y-1.5 pt-1">
                          {enOptions.map((opt, oIdx) => {
                            const isCorrect = oIdx === correctIdx;
                            return (
                              <div
                                key={oIdx}
                                className={`flex items-start gap-2 p-2 rounded-xl text-xs transition ${
                                  isExpanded && isCorrect
                                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold'
                                    : 'bg-slate-50 text-slate-700 border border-slate-100'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                                  isExpanded && isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {letters[oIdx]}
                                </span>
                                <span className="leading-tight pt-0.5">{opt}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Explanation toggle & Source */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        {isExpanded && (
                          <div className="bg-emerald-50/70 p-3 rounded-2xl text-xs text-slate-800 space-y-1.5 border border-emerald-100 animate-fadeIn">
                            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Correct Answer: Option ({letters[correctIdx] || 'A'})</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed text-[11px]">
                              {q.explanation?.en || 'Official answer verified from examination answer key.'}
                            </p>
                            <div className="text-[10px] text-slate-500 font-semibold pt-1">
                              Source: {q.source || 'RRB Official Answer Key (CEN 07/2025)'}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs">
                          <button
                            onClick={() => toggleSolution(q.id)}
                            className="text-[#2468B4] font-bold hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>{isExpanded ? 'Hide Solution' : 'View Answer & Explanation'}</span>
                          </button>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {q.examName ? `${q.examName} · 2025` : 'PYQ'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalBrowserPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setBrowserPage((p) => Math.max(1, p - 1))}
                  disabled={browserPage === 1}
                  className="px-4 py-2 rounded-full border border-[#E3EAF2] text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalBrowserPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (browserPage > 3 && totalBrowserPages > 5) {
                      pageNum = browserPage - 2 + i;
                      if (pageNum > totalBrowserPages) pageNum = totalBrowserPages - (4 - i);
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setBrowserPage(pageNum)}
                        className={`w-8 h-8 rounded-full text-xs font-bold transition cursor-pointer ${
                          browserPage === pageNum
                            ? 'bg-[#12345A] text-white'
                            : 'bg-white border border-[#E3EAF2] text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setBrowserPage((p) => Math.min(totalBrowserPages, p + 1))}
                  disabled={browserPage === totalBrowserPages}
                  className="px-4 py-2 rounded-full border border-[#E3EAF2] text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
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
