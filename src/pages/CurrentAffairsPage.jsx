import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Landmark,
  BrainCircuit,
  Calculator,
  Atom,
  Cpu,
  Layers,
  FileText,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Search,
  Flame,
  Clock,
  Award,
  Target,
  BookOpen,
  BarChart3,
  Download,
  Calendar,
  Sparkles,
  Filter,
  Check,
  Play,
  Share2,
  HelpCircle,
  TrendingUp,
  Monitor
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getMockQuestions, subscribeToCurrentAffairs } from '../firebase/firestoreService.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EditorialCurrentAffairsSection from '../components/EditorialCurrentAffairsSection.jsx';

import computerDeskImg from '../assets/images/computer_exam_desk_3d_1793887297243.jpg';
import gkGlobeImg from '../assets/images/gk_study_globe_books_3d_1793887297898.jpg';

// Official Subject Taxonomy matching the reference design
const SUBJECT_CATALOG = [
  {
    id: 'general-knowledge',
    title: 'General Knowledge',
    shortName: 'GK',
    description: 'Polity, History, Geography, Economy, Current Affairs, Schemes',
    questionsCount: '4,445 Questions',
    rawCount: 4445,
    icon: Landmark,
    accent: {
      gradient: 'from-[#FFF7ED] to-[#FFEDD5]',
      border: 'border-amber-200 hover:border-amber-400',
      iconBg: 'bg-orange-500/15 text-orange-600',
      badgeBg: 'bg-orange-100 text-orange-800',
      bannerBg: 'from-[#FFF5E6] via-[#FEE8C8] to-[#FFF1D8]',
      bannerBorder: 'border-amber-300'
    },
    topics: [
      'Indian History',
      'Geography',
      'Indian Polity & Constitution',
      'Indian Economy',
      'General Science',
      'Current Affairs',
      'Static GK',
      'Government Schemes',
      'Environment & Ecology',
      'Culture, Awards & Sports'
    ]
  },
  {
    id: 'reasoning',
    title: 'Reasoning',
    shortName: 'Reasoning',
    description: 'Analogy, Coding-Decoding, Series, Blood Relations',
    questionsCount: '1,649 Questions',
    rawCount: 1649,
    icon: BrainCircuit,
    accent: {
      gradient: 'from-[#ECFDF5] to-[#D1FAE5]',
      border: 'border-emerald-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-500/15 text-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      bannerBg: 'from-[#E6FBF2] via-[#D0F5E4] to-[#E3FAF0]',
      bannerBorder: 'border-emerald-300'
    },
    topics: [
      'Analogy & Classification',
      'Coding-Decoding',
      'Number & Alphabet Series',
      'Blood Relations',
      'Direction & Distance Sense',
      'Syllogism & Deductive Logic',
      'Puzzles & Seating Arrangements',
      'Venn Diagrams & Sets',
      'Statement & Assumptions',
      'Non-Verbal & Visual Reasoning'
    ]
  },
  {
    id: 'quantitative-aptitude',
    title: 'Quantitative Aptitude',
    shortName: 'Quant',
    description: 'Arithmetic, Percentage, Algebra, Time & Work, Geometry',
    questionsCount: '1,897 Questions',
    rawCount: 1897,
    icon: Calculator,
    accent: {
      gradient: 'from-[#EFF6FF] to-[#DBEAFE]',
      border: 'border-blue-200 hover:border-blue-400',
      iconBg: 'bg-blue-500/15 text-blue-600',
      badgeBg: 'bg-blue-100 text-blue-800',
      bannerBg: 'from-[#EBF3FF] via-[#D6E6FF] to-[#E5F0FF]',
      bannerBorder: 'border-blue-300'
    },
    topics: [
      'Number System & Simplification',
      'Percentage, Profit & Loss',
      'Ratio, Proportion & Mixtures',
      'Simple & Compound Interest',
      'Time, Speed, Distance & Work',
      'Algebra & Equations',
      'Geometry & Triangles',
      'Mensuration (2D & 3D)',
      'Trigonometry & Heights',
      'Data Interpretation & Charts'
    ]
  },
  {
    id: 'general-science',
    title: 'General Science',
    shortName: 'Science',
    description: 'Physics, Chemistry, Biology & Principles',
    questionsCount: '666 Questions',
    rawCount: 666,
    icon: Atom,
    accent: {
      gradient: 'from-[#FAF5FF] to-[#F3E8FF]',
      border: 'border-purple-200 hover:border-purple-400',
      iconBg: 'bg-purple-500/15 text-purple-600',
      badgeBg: 'bg-purple-100 text-purple-800',
      bannerBg: 'from-[#F7EEFF] via-[#EBD9FC] to-[#F5EAFE]',
      bannerBorder: 'border-purple-300'
    },
    topics: [
      'Physics: Mechanics & Motion',
      'Physics: Heat, Light & Optics',
      'Physics: Electricity & Magnetism',
      'Chemistry: Matter & Atoms',
      'Chemistry: Acids, Bases & Metals',
      'Chemistry: Organic & Periodic Table',
      'Biology: Human Body & Organs',
      'Biology: Plant & Animal Kingdom',
      'Biology: Health, Diseases & Nutrition',
      'Scientific Discoveries & Tech'
    ]
  },
  {
    id: 'computer-science',
    title: 'Computer Science',
    shortName: 'Computer',
    description: 'OS, CN, DBMS, DSA, Programming & More',
    questionsCount: '566 Questions',
    rawCount: 566,
    icon: Cpu,
    accent: {
      gradient: 'from-[#ECFEFF] to-[#CFFAFE]',
      border: 'border-cyan-200 hover:border-cyan-400',
      iconBg: 'bg-cyan-500/15 text-cyan-600',
      badgeBg: 'bg-cyan-100 text-cyan-800',
      bannerBg: 'from-[#E5FAFC] via-[#CEF4F8] to-[#E3F9FB]',
      bannerBorder: 'border-cyan-300'
    },
    topics: [
      'Computer Fundamentals & Hardware',
      'Operating Systems (Windows/Linux)',
      'Computer Networks & Protocols',
      'Database Management Systems (DBMS)',
      'Data Structures & Algorithms',
      'Programming Concepts & OOP',
      'Digital Logic & Architecture',
      'Cybersecurity & Internet Awareness',
      'MS Office & Productivity Tools',
      'Emerging Technologies & AI'
    ]
  },
  {
    id: 'full',
    title: 'Full Mock Tests',
    shortName: 'Full CBT',
    description: 'Complete 100-Q CBT Shifts (80 Official Examination Shifts)',
    questionsCount: '8,657 Questions',
    rawCount: 8657,
    icon: Layers,
    accent: {
      gradient: 'from-[#FEFCE8] to-[#FEF08A]/60',
      border: 'border-amber-200 hover:border-amber-400',
      iconBg: 'bg-amber-500/15 text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-900',
      bannerBg: 'from-[#FFF8E7] via-[#FEEFC9] to-[#FFF6E3]',
      bannerBorder: 'border-amber-300'
    },
    topics: [
      'Quantitative Aptitude (30Q)',
      'General Intelligence & Reasoning (30Q)',
      'General Awareness & Studies (30-32Q)',
      'General Science Section (8-10Q)',
      'Speed Calculation Drills',
      'Negative Marking Practice',
      'Complete CBT Time Management',
      'Previous Year Cut-off Benchmarking',
      'Shift-wise Rank Analytics',
      'Full Solution Key & Explanations'
    ]
  }
];

// Popular Mock Tests matching the cards row in image_d1bc4dae.png
const POPULAR_MOCK_TESTS = [
  {
    id: 'rrb-ntpc-ug-2025-shift-1',
    code: 'RRB NTPC',
    title: 'RRB NTPC CBT-1 Full Mock – 01',
    questionsCount: 100,
    duration: 90,
    marks: 100,
    attempts: '58.2K Attempts',
    badgeType: 'rrb',
    examBadge: 'RRB',
    path: '/mocks/rrb-ntpc-ug-2025-shift-1'
  },
  {
    id: 'rrb-ntpc-ug-2025-shift-2',
    code: 'SSC CGL',
    title: 'SSC CGL Tier-I Mock – 01',
    questionsCount: 100,
    duration: 60,
    marks: 200,
    attempts: '42.9K Attempts',
    badgeType: 'ssc',
    examBadge: 'SSC',
    path: '/mocks/rrb-ntpc-ug-2025-shift-2'
  },
  {
    id: 'rrb-ntpc-ug-2025-shift-3',
    code: 'SSC JE',
    title: 'SSC JE (CSE) Mock – 01',
    questionsCount: 100,
    duration: 120,
    marks: 100,
    attempts: '18.4K Attempts',
    badgeType: 'je',
    examBadge: 'JE',
    path: '/mocks/rrb-ntpc-ug-2025-shift-3'
  },
  {
    id: 'rrb-ntpc-ug-2025-shift-4',
    code: 'GK MIX',
    title: 'General Knowledge (Mix) – 01',
    questionsCount: 50,
    duration: 30,
    marks: 100,
    attempts: '32.1K Attempts',
    badgeType: 'gk',
    examBadge: 'GK',
    path: '/mocks/rrb-ntpc-ug-2025-shift-4?subject=general-knowledge'
  }
];

// Curated GK Mock Tests matching Image 1
const GK_MOCK_TESTS = [
  {
    id: 'gk-mock-full-01',
    title: 'General Knowledge – Full Mock Test 01',
    type: 'Full Mock',
    questions: 100,
    marks: 200,
    duration: 90,
    difficulty: 'Medium',
    attempts: '58.2K Attempts',
    targetShift: 'rrb-ntpc-ug-2025-shift-1'
  },
  {
    id: 'gk-mock-sec-02',
    title: 'GK – Sectional Test (History + Geography)',
    type: 'Sectional',
    questions: 50,
    marks: 100,
    duration: 45,
    difficulty: 'Easy',
    attempts: '42.9K Attempts',
    targetShift: 'rrb-ntpc-ug-2025-shift-2'
  },
  {
    id: 'gk-mock-mix-03',
    title: 'GK – Mixed Practice Test 01',
    type: 'Mixed',
    questions: 25,
    marks: 50,
    duration: 25,
    difficulty: 'Hard',
    attempts: '18.4K Attempts',
    targetShift: 'rrb-ntpc-ug-2025-shift-3'
  },
  {
    id: 'gk-mock-polity-04',
    title: 'Indian Polity & Constitution Speed Drill',
    type: 'Quick Test',
    questions: 30,
    marks: 60,
    duration: 25,
    difficulty: 'Medium',
    attempts: '36.8K Attempts',
    targetShift: 'rrb-ntpc-ug-2025-shift-4'
  },
  {
    id: 'gk-mock-ca-05',
    title: 'Current Affairs 2025–2026 Booster Test',
    type: 'Full Mock',
    questions: 50,
    marks: 100,
    duration: 40,
    difficulty: 'Medium',
    attempts: '51.4K Attempts',
    targetShift: 'rrb-ntpc-ug-2025-shift-5'
  },
  {
    id: 'gk-mock-static-06',
    title: 'Static GK & National Movements Mastery',
    type: 'Sectional',
    questions: 40,
    marks: 80,
    duration: 35,
    difficulty: 'Easy',
    attempts: '29.1K Attempts',
    targetShift: 'rrb-ntpc-ug-2025-shift-6'
  },
  {
    id: 'gk-mock-economy-07',
    title: 'Indian Economy & Financial Awareness Mock',
    type: 'Quick Test',
    questions: 25,
    marks: 50,
    duration: 20,
    difficulty: 'Hard',
    attempts: '22.7K Attempts',
    targetShift: 'rrb-ntpc-ug-2025-shift-7'
  },
  {
    id: 'gk-mock-schemes-08',
    title: 'Government Schemes & Policies 2025 Mock',
    type: 'Mixed',
    questions: 30,
    marks: 60,
    duration: 25,
    difficulty: 'Medium',
    attempts: '33.9K Attempts',
    targetShift: 'rrb-ntpc-ug-2025-shift-8'
  }
];

// Official Monthly PDF Capsules available for direct download
const MONTHLY_PDF_CAPSULES = [
  {
    month: 'January 2026',
    title: 'January 2026 Current Affairs MCQ Capsule',
    pages: '28 Pages',
    mcqs: '250+ MCQs',
    url: '/assets/aistudio/January_2026_Current_Affairs_MCQ_31a6a736.pdf',
    fileName: 'January_2026_Current_Affairs_MCQ.pdf',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    month: 'December 2025',
    title: 'December 2025 Current Affairs MCQ Capsule',
    pages: '32 Pages',
    mcqs: '300+ MCQs',
    url: '/assets/aistudio/December_2025_Current_Affairs_MCQs_fea0a8ff.pdf',
    fileName: 'December_2025_Current_Affairs_MCQs.pdf',
    color: 'from-amber-600 to-orange-700'
  },
  {
    month: 'November 2025',
    title: 'November 2025 Current Affairs MCQ Capsule',
    pages: '30 Pages',
    mcqs: '280+ MCQs',
    url: '/assets/aistudio/November_2025_Current_Affairs_MCQs_106d2ab4.pdf',
    fileName: 'November_2025_Current_Affairs_MCQs.pdf',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    month: 'October 2025',
    title: 'October 2025 Current Affairs MCQ Capsule',
    pages: '26 Pages',
    mcqs: '240+ MCQs',
    url: '/assets/aistudio/October_2025_Current_Affairs_MCQs_9e8d634c.pdf',
    fileName: 'October_2025_Current_Affairs_MCQs.pdf',
    color: 'from-purple-600 to-violet-700'
  }
];

export default function CurrentAffairsPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected subject from URL param or state: default null (overview hub)
  const subjectParam = searchParams.get('subject');
  const selectedSubjectId = subjectParam || null;

  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Sub-tabs inside selected subject view: 'tests' | 'practice' | 'bank' | 'topics'
  const [subTab, setSubTab] = useState('tests');

  // Filter chips in the tests list: 'All' | 'Full Mock' | 'Sectional' | 'Quick Test' | 'Mixed'
  const [testTypeFilter, setTestTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedTopicTag, setSelectedTopicTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Expand question answers in question bank browser
  const [expandedSolutions, setExpandedSolutions] = useState({});

  useEffect(() => {
    const unsub = subscribeToCurrentAffairs((data) => {
      setArticles(data || []);
      setLoadingArticles(false);
    });

    (async () => {
      try {
        const qData = await getMockQuestions();
        setQuestions(qData || []);
      } catch (err) {
        console.error('Failed to load mock questions:', err);
      } finally {
        setLoadingQuestions(false);
      }
    })();

    return () => unsub();
  }, []);

  // Current active subject metadata
  const currentSubject = useMemo(() => {
    if (!selectedSubjectId) return null;
    return SUBJECT_CATALOG.find((s) => s.id === selectedSubjectId) || SUBJECT_CATALOG[0];
  }, [selectedSubjectId]);

  // Handle clicking a subject card (e.g. GK)
  const handleSelectSubject = (id) => {
    setSearchParams({ subject: id });
    setSubTab('tests');
    setTestTypeFilter('All');
    setSelectedTopicTag('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back button to return to All Subjects Hub
  const handleBackToHub = () => {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered mock tests for the active subject
  const filteredMockTests = useMemo(() => {
    return GK_MOCK_TESTS.filter((test) => {
      if (testTypeFilter !== 'All' && test.type !== testTypeFilter) return false;
      if (selectedTopicTag !== 'All') {
        const matchTitle = test.title.toLowerCase().includes(selectedTopicTag.toLowerCase());
        if (!matchTitle) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = test.title.toLowerCase().includes(q);
        const matchType = test.type.toLowerCase().includes(q);
        return matchTitle || matchType;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'questions') return b.questions - a.questions;
      if (sortBy === 'duration') return b.duration - a.duration;
      return 0;
    });
  }, [testTypeFilter, selectedTopicTag, searchQuery, sortBy]);

  // Questions belonging to the active subject for Question Bank tab
  const activeSubjectQuestions = useMemo(() => {
    if (!currentSubject || questions.length === 0) return [];
    const subClean = currentSubject.id.replace(/[^a-z]/g, '');

    return questions.filter((q) => {
      const qSub = (q.subject || '').toLowerCase().replace(/[^a-z]/g, '');
      const qCat = (q.categoryId || '').toLowerCase().replace(/[^a-z]/g, '');

      if (subClean.includes('gk') || subClean.includes('generalknowledge')) {
        return qSub.includes('generalknowledge') || qCat === 'gk';
      }
      if (subClean.includes('reason')) {
        return qSub.includes('reasoning') || qCat === 'reasoning';
      }
      if (subClean.includes('quant')) {
        return qSub.includes('quantitative') || qCat === 'quant';
      }
      if (subClean.includes('science')) {
        return qSub.includes('science');
      }
      if (subClean.includes('computer')) {
        return qSub.includes('computer') || qCat === 'cse';
      }
      return true;
    });
  }, [currentSubject, questions]);

  const toggleSolution = (qId) => {
    setExpandedSolutions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="max-w-[1240px] mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-8">
      {/* 1. BREADCRUMBS */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={
            currentSubject
              ? [
                  { label: t('navCurrentAffairs') || 'Current Affairs & Mock Tests', to: '/current-affairs' },
                  { label: currentSubject.title }
                ]
              : [{ label: t('navCurrentAffairs') || 'Current Affairs & Mock Tests' }]
          }
        />

        {currentSubject && (
          <button
            onClick={handleBackToHub}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E3EAF2] text-[#12345A] text-xs font-bold hover:bg-[#EAF3FF] hover:border-[#2468B4] transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Subjects</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* VIEW A: MAIN CURRENT AFFAIRS & MOCK TESTS HUB (Matching Image 2)           */}
      {/* ========================================================================= */}
      {!currentSubject && (
        <div className="space-y-8">
          {/* Top Hero Banner matching image_10fc222d.png */}
          <div className="bg-gradient-to-r from-[#00224F] via-[#02316E] to-[#033E7B] rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-10 text-white relative overflow-hidden shadow-xl border border-white/15">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#F2BE4F]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-[#2468B4]/25 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
              {/* Left Column: Title, Subtitle, Checkmarks & Stats */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-3.5 sm:space-y-5">
                {/* Gold Pill Badge */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-[#F2BE4F]/40 text-[#F2BE4F] text-[11px] sm:text-xs font-bold tracking-wide">
                  <span>👑 Govt Exams: SSC • RRB • NTPC • JE • State Exams</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Mock Tests &amp; <span className="text-[#F2BE4F]">Practice Tests</span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
                  Real exam pattern tests, subject-wise practice, monthly capsules and previous year verified papers
                  to boost your government exam preparation.
                </p>

                {/* 3 Checkmark Feature Points */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-6 pt-1 text-[11px] sm:text-xs font-semibold text-slate-100">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                    <span>Exam Pattern Based</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                    <span>No Login Required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                    <span>Instant Result &amp; Analysis</span>
                  </div>
                </div>

                {/* 3 Outlined Glass Stats Counters */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2 max-w-lg">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/15 text-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-lg bg-white/15 flex items-center justify-center text-[#F2BE4F] mb-1">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="text-base sm:text-2xl font-black text-white">16,430+</div>
                    <div className="text-[9px] sm:text-xs text-slate-300 font-medium leading-tight">Questions</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/15 text-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-lg bg-white/15 flex items-center justify-center text-[#F2BE4F] mb-1">
                      <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="text-base sm:text-2xl font-black text-white">320+</div>
                    <div className="text-[9px] sm:text-xs text-slate-300 font-medium leading-tight">Mock Tests</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/15 text-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-lg bg-white/15 flex items-center justify-center text-[#F2BE4F] mb-1">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="text-base sm:text-2xl font-black text-white">80</div>
                    <div className="text-[9px] sm:text-xs text-slate-300 font-medium leading-tight">Exam Shifts (CBT)</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Seamless Blended 3D Laptop with Exam & Study Books (matching image_10fc222d.png) */}
              <div className="lg:col-span-5 xl:col-span-4 flex items-center justify-center lg:justify-end relative pt-2 lg:pt-0">
                <div className="relative w-full max-w-[280px] sm:max-w-md lg:max-w-none flex items-center justify-center">
                  <img
                    src="/assets/aistudio/hero_laptop_seamless.png"
                    alt="Online CBT Exam on Laptop with Stack of Subject Books, Clock and Pens"
                    className="w-full h-auto max-h-[190px] sm:max-h-[260px] lg:max-h-[360px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: SELECT SUBJECT FOR MOCK TESTS (6 Cards matching Image 2) */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#2468B4]">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#12345A] tracking-tight">
                Select Subject for Mock Tests
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUBJECT_CATALOG.map((subject) => {
                const Icon = subject.icon;
                return (
                  <button
                    key={subject.id}
                    onClick={() => handleSelectSubject(subject.id)}
                    className={`bg-gradient-to-r ${subject.accent.gradient} ${subject.accent.border} rounded-2xl p-5 border transition-all duration-200 hover:shadow-md cursor-pointer text-left flex flex-col justify-between gap-4 group relative overflow-hidden`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${subject.accent.iconBg} transition-transform group-hover:scale-105`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-black text-base text-[#12345A] group-hover:text-[#0B1F3A] transition-colors leading-tight">
                            {subject.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-1 leading-snug">
                            {subject.description}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs ${subject.accent.badgeBg}`}>
                        {subject.questionsCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-end pt-1">
                      <span className="w-8 h-8 rounded-full bg-white/80 border border-slate-200/80 group-hover:bg-[#12345A] group-hover:text-white group-hover:border-[#12345A] text-slate-600 flex items-center justify-center transition-all duration-200 shadow-2xs">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: POPULAR MOCK TESTS (Horizontal cards row matching Image 2) */}
          <section className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E3EAF2] shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#12345A]">
                    Popular Mock Tests
                  </h3>
                  <p className="text-xs text-slate-500">
                    Attempt exam-wise full tests with official pattern.
                  </p>
                </div>
              </div>

              <Link
                to="/mocks"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2468B4] hover:text-[#12345A] transition"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {POPULAR_MOCK_TESTS.map((mock) => (
                <div
                  key={mock.id}
                  className="bg-[#FAFBFD] rounded-2xl border border-[#E3EAF2] p-4 flex flex-col justify-between gap-3 hover:border-[#2468B4] hover:shadow-md transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                          mock.badgeType === 'rrb'
                            ? 'bg-red-100 text-red-700'
                            : mock.badgeType === 'ssc'
                            ? 'bg-emerald-100 text-emerald-700'
                            : mock.badgeType === 'je'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {mock.examBadge}
                      </span>
                      <h4 className="font-black text-xs sm:text-sm text-[#12345A] line-clamp-1 group-hover:text-[#2468B4] transition">
                        {mock.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Monitor className="w-3.5 h-3.5 text-slate-400" />
                        {mock.questionsCount} Qs
                      </span>
                      <span>|</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {mock.duration} Min
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold">
                      <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                      <span>{mock.attempts}</span>
                    </div>
                  </div>

                  <Link
                    to={mock.path}
                    className="w-full py-2 rounded-xl bg-[#12345A] hover:bg-[#1E4E8C] text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Test</span>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: MONTHLY CURRENT AFFAIRS PDF CAPSULES */}
          <section className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E3EAF2] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2468B4] flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#12345A]">
                    Official Monthly Current Affairs PDF Capsules
                  </h3>
                  <p className="text-xs text-slate-500">
                    Download verified English &amp; Telugu monthly MCQ question banks directly to your device.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MONTHLY_PDF_CAPSULES.map((capsule) => (
                <div
                  key={capsule.month}
                  className="bg-[#FAFBFD] rounded-2xl border border-[#E3EAF2] p-4 flex flex-col justify-between gap-3 hover:border-[#2468B4] transition group"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#2468B4] uppercase tracking-wider">
                      {capsule.month}
                    </span>
                    <h4 className="font-black text-sm text-[#12345A] leading-tight">
                      {capsule.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{capsule.pages}</span>
                      <span>·</span>
                      <span className="font-bold text-emerald-600">{capsule.mcqs}</span>
                    </div>
                  </div>

                  <a
                    href={capsule.url}
                    download={capsule.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-white border border-[#E3EAF2] hover:bg-[#EAF3FF] hover:border-[#2468B4] text-[#12345A] text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#2468B4]" />
                    <span>Download PDF</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: EDITORIAL DAILY CURRENT AFFAIRS FEED */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[#12345A]">
                  Daily Verified Current Affairs Articles
                </h3>
                <p className="text-xs text-slate-500">
                  In-depth analysis for UPSC, APPSC, TGPSC, SSC, and Railway examinations.
                </p>
              </div>
            </div>

            {loadingArticles ? (
              <SkeletonLoader count={4} />
            ) : (
              <EditorialCurrentAffairsSection
                articles={articles}
                loading={loadingArticles}
                showViewToggle={true}
                initialViewMode="editorial"
                mobileReels={false}
              />
            )}
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: SUBJECT MOCK TEST VIEW (Matching Image 1: General Knowledge, etc) */}
      {/* ========================================================================= */}
      {currentSubject && (
        <div className="space-y-6">
          {/* TOP SUBJECT HERO BANNER (Matching Image 1) */}
          <div className={`bg-gradient-to-r ${currentSubject.accent.bannerBg} ${currentSubject.accent.bannerBorder} rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-10 border shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6`}>
            {/* Left Column: Icon, Title & Description */}
            <div className="flex items-start gap-3 sm:gap-4 max-w-xl">
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/80 border border-amber-200/80 shadow-xs flex items-center justify-center shrink-0 text-amber-700">
                <currentSubject.icon className="w-6 h-6 sm:w-11 sm:h-11" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-[#12345A] tracking-tight leading-tight">
                  {currentSubject.title} – Mock Tests
                </h1>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Practice {currentSubject.shortName} with exam-oriented tests covering History, Geography, Polity, Economy, Current Affairs, Static GK and Government Schemes.
                </p>
              </div>
            </div>

            {/* Middle: 4 Outlined White Stat Cards (Matching Image 1) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full lg:w-auto shrink-0">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-amber-200/70 text-center min-w-[70px] sm:min-w-[95px] shadow-2xs">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto text-amber-600 mb-0.5 sm:mb-1" />
                <div className="text-base sm:text-xl font-black text-[#12345A]">4,445+</div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Questions</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-amber-200/70 text-center min-w-[70px] sm:min-w-[95px] shadow-2xs">
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto text-amber-600 mb-0.5 sm:mb-1" />
                <div className="text-base sm:text-xl font-black text-[#12345A]">75+</div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Mock Tests</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-amber-200/70 text-center min-w-[70px] sm:min-w-[95px] shadow-2xs">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto text-amber-600 mb-0.5 sm:mb-1" />
                <div className="text-base sm:text-xl font-black text-[#12345A]">80</div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Exam Shifts (CBT)</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-amber-200/70 text-center min-w-[70px] sm:min-w-[95px] shadow-2xs">
                <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto text-amber-600 mb-0.5 sm:mb-1" />
                <div className="text-base sm:text-xl font-black text-[#12345A]">{currentSubject.topics.length}</div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Sub Topics</div>
              </div>
            </div>

            {/* Right: 3D Educational Globe & Ashoka Stambh Graphic (Matching Image 1) */}
            <div className="hidden xl:block shrink-0 w-52 h-36 relative overflow-hidden rounded-2xl border border-amber-200/70 shadow-sm bg-white/40">
              <img
                src={gkGlobeImg}
                alt="Globe with Ashoka Stambh and Books"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 4 SUB-TABS STRIP (Matching Image 1) - with mobile horizontal scroll */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-[#F6F8FC] rounded-2xl border border-[#E3EAF2] overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setSubTab('tests')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                subTab === 'tests'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Mock Tests (75)</span>
            </button>

            <button
              onClick={() => setSubTab('practice')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                subTab === 'practice'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Practice Tests (320)</span>
            </button>

            <button
              onClick={() => setSubTab('bank')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                subTab === 'bank'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Question Bank (4,445)</span>
            </button>

            <button
              onClick={() => setSubTab('topics')}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                subTab === 'topics'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Topic-wise Tests ({currentSubject.topics.length})</span>
            </button>
          </div>

          {/* MAIN 2-COLUMN LAYOUT (Matching Image 1) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ========================================================= */}
            {/* LEFT COLUMN: SELECT GK MOCK TEST & TEST LIST (approx 70%) */}
            {/* ========================================================= */}
            <div className="lg:col-span-8 space-y-5">
              {/* SUBTAB 1: MOCK TESTS */}
              {subTab === 'tests' && (
                <div className="space-y-4">
                  {/* Header & Sort Row (Matching Image 1) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#2468B4]" />
                      <div>
                        <h2 className="text-xl font-black text-[#12345A]">
                          Select {currentSubject.shortName} Mock Test
                        </h2>
                        <p className="text-xs text-slate-500">
                          Attempt full-length and topic-wise {currentSubject.shortName} tests based on the latest exam pattern.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-slate-500">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-xs bg-white border border-[#E3EAF2] rounded-xl px-3 py-1.5 font-bold text-slate-700 focus:outline-hidden focus:border-[#2468B4]"
                      >
                        <option value="latest">Latest</option>
                        <option value="questions">Questions</option>
                        <option value="duration">Duration</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Chips Row (Matching Image 1) - with mobile horizontal scroll */}
                  <div className="flex items-center gap-1.5 sm:gap-2 pt-1 pb-1 overflow-x-auto no-scrollbar scroll-smooth">
                    {['All Tests (75)', 'Full Mock (20)', 'Sectional (15)', 'Quick Test (20)', 'Mixed (20)'].map((label) => {
                      const typeKey = label.startsWith('All') ? 'All' : label.split(' (')[0];
                      const isActive = testTypeFilter === typeKey;
                      return (
                        <button
                          key={label}
                          onClick={() => setTestTypeFilter(typeKey)}
                          className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            isActive
                              ? 'bg-[#12345A] text-white shadow-2xs'
                              : 'bg-white border border-[#E3EAF2] text-slate-600 hover:border-slate-400'
                          }`}
                        >
                          {label.includes('Full') && <Layers className="w-3 h-3" />}
                          {label.includes('Sectional') && <BarChart3 className="w-3 h-3" />}
                          {label.includes('Quick') && <Sparkles className="w-3 h-3" />}
                          {label.includes('Mixed') && <TrendingUp className="w-3 h-3" />}
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Test Cards List (Matching Image 1 cards) */}
                  <div className="space-y-3 pt-2">
                    {filteredMockTests.map((test) => (
                      <div
                        key={test.id}
                        className="bg-white rounded-2xl border border-[#E3EAF2] p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:border-[#2468B4] hover:shadow-md transition-all group"
                      >
                        {/* Test Details */}
                        <div className="flex items-start gap-3 sm:gap-3.5">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-[#2468B4] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#12345A] group-hover:text-white transition-colors">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="font-black text-sm sm:text-base text-[#12345A] group-hover:text-[#2468B4] transition">
                              {test.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-500 font-medium">
                              <span className="flex items-center gap-1">
                                <Monitor className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                                {test.questions} Questions
                              </span>
                              <span>|</span>
                              <span>{test.marks} Marks</span>
                              <span>|</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                                {test.duration} Minutes
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Badges & Start Button */}
                        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {/* Difficulty Tag */}
                          <span
                            className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold ${
                              test.difficulty === 'Easy'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : test.difficulty === 'Hard'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {test.difficulty}
                          </span>

                          {/* Attempts Counter */}
                          <div className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-orange-50 text-orange-700 text-[11px] sm:text-xs font-bold">
                            <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                            <span>{test.attempts}</span>
                          </div>

                          {/* Start Test Button */}
                          <Link
                            to={`/mocks/${test.targetShift}?subject=${currentSubject.id}`}
                            className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#12345A] hover:bg-[#1E4E8C] text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer text-center"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Start Test</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBTAB 2: PRACTICE TESTS */}
              {subTab === 'practice' && (
                <div className="space-y-4">
                  <div className="bg-[#FAFBFD] rounded-2xl border border-[#E3EAF2] p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-[#12345A] text-base">Quick Practice Drills</h3>
                      <p className="text-xs text-slate-500">
                        Rapid practice tests designed to reinforce conceptual understanding.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      { title: `${currentSubject.title} Speed Drill 01`, q: 25, t: 20 },
                      { title: `${currentSubject.title} High-Yield 02`, q: 50, t: 40 },
                      { title: `${currentSubject.title} Accuracy Drill 03`, q: 30, t: 25 },
                      { title: `${currentSubject.title} PYQ Master Set 04`, q: 50, t: 45 }
                    ].map((drill, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-[#E3EAF2] p-4 flex flex-col justify-between gap-3 hover:border-[#2468B4] transition">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Practice Set #{idx + 1}</span>
                          <h4 className="font-black text-sm text-[#12345A] mt-1.5">{drill.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{drill.q} Questions · {drill.t} Mins</p>
                        </div>
                        <Link
                          to={`/mocks/rrb-ntpc-ug-2025-shift-${idx + 1}?subject=${currentSubject.id}&mode=practice`}
                          className="w-full py-2 rounded-xl bg-[#EAF3FF] hover:bg-[#12345A] hover:text-white text-[#12345A] text-xs font-bold text-center transition flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start Practice Drill</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBTAB 3: QUESTION BANK BROWSER */}
              {subTab === 'bank' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#E3EAF2]">
                    <div className="text-xs font-bold text-[#12345A]">
                      Showing verified questions from the official examination database
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                      {activeSubjectQuestions.length || 4445} Questions Available
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeSubjectQuestions.slice(0, 15).map((q, idx) => (
                      <div key={q.id || idx} className="bg-white rounded-2xl border border-[#E3EAF2] p-4 sm:p-5 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-slate-100 text-[#12345A]">
                            Q{idx + 1}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {q.subtopic || 'General Awareness'}
                          </span>
                        </div>

                        <p className="text-sm font-bold text-[#12345A] leading-relaxed">
                          {q.question?.en || 'Question text'}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {(q.options?.en || []).map((opt, optIdx) => {
                            const letters = ['A', 'B', 'C', 'D'];
                            const isCorrect = q.correctAnswer === optIdx;
                            const isExpanded = !!expandedSolutions[q.id || idx];
                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-xl border text-xs font-medium transition ${
                                  isExpanded && isCorrect
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                                    : 'bg-[#FAFBFD] border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className="font-bold mr-2 text-slate-400">{letters[optIdx]}.</span>
                                <span>{opt}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <button
                            onClick={() => toggleSolution(q.id || idx)}
                            className="text-xs font-bold text-[#2468B4] hover:underline cursor-pointer"
                          >
                            {expandedSolutions[q.id || idx] ? 'Hide Solution' : 'View Correct Answer & Solution'}
                          </button>

                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Official Verified Answer Key
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBTAB 4: TOPIC-WISE TESTS */}
              {subTab === 'topics' && (
                <div className="space-y-4">
                  <div className="bg-[#FAFBFD] rounded-2xl border border-[#E3EAF2] p-4">
                    <h3 className="font-black text-[#12345A] text-base">Syllabus Topic Tests</h3>
                    <p className="text-xs text-slate-500">
                      Target each specific topic to master individual syllabus sections.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {currentSubject.topics.map((topic, idx) => (
                      <div key={topic} className="bg-white rounded-2xl border border-[#E3EAF2] p-4 flex flex-col justify-between gap-3 hover:border-[#2468B4] transition">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-700">Topic #{idx + 1}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Syllabus Test</span>
                          </div>
                          <h4 className="font-black text-sm text-[#12345A] mt-1.5">{topic}</h4>
                        </div>
                        <Link
                          to={`/mocks/rrb-ntpc-ug-2025-shift-${(idx % 10) + 1}?subject=${currentSubject.id}&topic=${encodeURIComponent(topic)}`}
                          className="w-full py-2 rounded-xl bg-[#12345A] hover:bg-[#1E4E8C] text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Start Topic Test</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* RIGHT COLUMN: GK TOPICS COVERED (10) SIDEBAR (Matching Image 1)          */}
            {/* ========================================================================= */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl border border-[#E3EAF2] p-5 sm:p-6 shadow-xs space-y-4 sticky top-20">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <BookOpen className="w-5 h-5 text-[#2468B4]" />
                  <h3 className="text-base sm:text-lg font-black text-[#12345A]">
                    {currentSubject.shortName} Topics Covered ({currentSubject.topics.length})
                  </h3>
                </div>

                {/* Topics List with Green Checkmarks (Matching Image 1) */}
                <div className="space-y-1">
                  {currentSubject.topics.map((topic, idx) => {
                    const isSelected = selectedTopicTag === topic;
                    return (
                      <button
                        key={topic}
                        onClick={() => {
                          setSelectedTopicTag(isSelected ? 'All' : topic);
                          setSubTab('tests');
                        }}
                        className={`w-full text-left py-2.5 px-3 rounded-xl transition flex items-center justify-between text-xs sm:text-sm font-semibold cursor-pointer border ${
                          isSelected
                            ? 'bg-[#EAF3FF] border-[#2468B4] text-[#12345A] font-bold'
                            : 'hover:bg-[#FAFBFD] border-transparent text-slate-700 hover:text-[#12345A]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                          <span className="leading-snug">{topic}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-[#2468B4]' : ''}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Reset Topic Filter */}
                {selectedTopicTag !== 'All' && (
                  <button
                    onClick={() => setSelectedTopicTag('All')}
                    className="w-full py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
                  >
                    Clear Topic Filter (Show All)
                  </button>
                )}

                {/* Helpful Tip */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
                  💡 Click any topic above to filter mock tests and question bank specifically for that syllabus unit.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
