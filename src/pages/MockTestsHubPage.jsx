import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Layers,
  Calendar,
  LayoutGrid,
  Play,
  BookOpen,
  Clock,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Brain,
  Calculator,
  FlaskConical,
  Code,
  Search,
  CheckCircle2,
  Download,
  Filter,
  RefreshCw,
  CloudUpload,
  Check,
  Award,
  Sparkles,
  ShieldCheck,
  Flame,
  Newspaper,
  Trophy,
  Target,
  Globe,
  AlertTriangle,
  Crown,
  Zap,
  Lock,
  Unlock,
  Bell,
  X
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  getAllShifts,
  loadAllShifts,
  RRB_MOCK_SUBJECTS,
  slugifyTopic,
  classifyGkTopic,
  classifyComputerTopic
} from '../services/rrbMockService.js';
import { MOCK_TESTS_METADATA } from '../data/mockTestsMetadata.js';
import { FULL_MOCK_SERIES, SECTIONAL_TESTS } from '../data/fullMockSeriesData.js';
import OfficialMockTestCard from '../components/OfficialMockTestCard.jsx';
import {
  getMockQuestions,
  bulkSaveMockQuestions,
  getDirectFirestoreMockStats,
  migrateOlderGraduateQuestionsTo2024
} from '../firebase/firestoreService.js';
import { SUBJECT_TOPIC_TAXONOMY, getTopicsForSubject } from '../constants/mockTaxonomy.js';

// Import Circular 3D Medallion Subject Icons
import iconAllMock from '../assets/images/subject_all_mock.png';
import iconCurrentAffairs from '../assets/images/subject_current_affairs.png';
import iconEnglish from '../assets/images/subject_english.png';
import iconGeneralKnowledge from '../assets/images/subject_general_knowledge.png';
import iconReasoning from '../assets/images/subject_reasoning.png';
import iconQuant from '../assets/images/subject_quant.png';
import iconScience from '../assets/images/subject_science.png';
import iconComputer from '../assets/images/subject_computer.png';

export default function MockTestsHubPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Subject / Exam selection from query or state
  const initialSubject = searchParams.get('subject') || 'all';
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);

  // Active Category Tabs:
  // 'all' | 'full-mock' | 'pyqs' | 'subject-wise' | 'topic-wise' | 'sectional'
  const initialTab = searchParams.get('tab') || 'all';
  const [activeCategoryTab, setActiveCategoryTab] = useState(initialTab);

  // Global search input for mock tests & papers
  const [globalSearch, setGlobalSearch] = useState('');

  // Universal 100% Free Access for All (No Premium Locks)
  const hasProPass = true;
  const [proModalOpen, setProModalOpen] = useState(false);

  // Sub-Filter for "Test Series For You" section ('all' | 'rankers' | 'pyqs' | 'full-mock')
  const [testSeriesSubFilter, setTestSeriesSubFilter] = useState('all');

  const subjectScrollRef = useRef(null);
  const scrollSubjects = (direction) => {
    if (subjectScrollRef.current) {
      const step = subjectScrollRef.current.clientWidth || 320;
      const amt = direction === 'left' ? -step : step;
      subjectScrollRef.current.scrollBy({ left: amt, behavior: 'smooth' });
    }
  };

  // Bookmarked test IDs (persisted to localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('eqh_bookmarked_tests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (testId) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId];
      try {
        localStorage.setItem('eqh_bookmarked_tests', JSON.stringify(next));
      } catch (err) {
        console.warn('Could not save bookmark:', err);
      }
      return next;
    });
  };

  // Active topic configuration modal: null | topic object
  const [activeTopicModal, setActiveTopicModal] = useState(null);

  // Chosen question count for topic practice: 10 | 20 | 25 | 50 | 'all'
  const [chosenTopicQuestionCount, setChosenTopicQuestionCount] = useState(25);

  // Unified Bank Stats (Stable verified ground truth: 19,121 Questions • 163 CBT Shifts)
  const [firestoreStats, setFirestoreStats] = useState(() => {
    const defaultStats = {
      totalQuestions: 19121,
      verifiedQuestions: 19121,
      unverifiedQuestions: 0,
      totalShifts: 163,
      totalSubtopics: 64,
      totalMockTests: 380,
      subjectCounts: {
        all: 19121,
        'general-knowledge': 7420,
        'quantitative-aptitude': 4410,
        reasoning: 4140,
        'general-science': 1020,
        'computer-science': 810,
        'english-language': 680,
        'current-affairs': 641
      },
      source: 'Official Question Bank (19,121 Qs • 163 Shifts · All Official Papers)'
    };
    try {
      const cached = localStorage.getItem('eqh_db_mock_stats_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed.totalQuestions === 'number' && parsed.totalQuestions > 0) {
          return parsed;
        }
      }
      return defaultStats;
    } catch {
      return defaultStats;
    }
  });

  // Shifts Data & Server Questions
  const [shifts, setShifts] = useState(() => getAllShifts());
  const [firestoreQuestions, setFirestoreQuestions] = useState([]);
  const [shiftSearch, setShiftSearch] = useState('');
  const [pyqExamFilter, setPyqExamFilter] = useState('all');
  const [pyqCurrentPage, setPyqCurrentPage] = useState(1);
  const [jumpPageInput, setJumpPageInput] = useState('');
  const SHIFTS_PER_PAGE = 24;

  // Load real data directly from the Firestore server on component mount
  useEffect(() => {
    let isMounted = true;
    const fetchServerData = async () => {
      try {
        const stats = await getDirectFirestoreMockStats();
        if (isMounted && stats && stats.totalQuestions) {
          setFirestoreStats(stats);
        }

        const allLoadedShifts = await loadAllShifts();
        if (isMounted && allLoadedShifts) {
          setShifts(allLoadedShifts);
        }

        const qData = await getMockQuestions();
        if (isMounted && Array.isArray(qData) && qData.length > 0) {
          setFirestoreQuestions(qData);
          setFirestoreStats((prev) => ({
            ...prev,
            totalQuestions: qData.length,
            verifiedQuestions: qData.length,
            subjectCounts: {
              ...(prev?.subjectCounts || {}),
              all: qData.length
            }
          }));
        }
      } catch (err) {
        console.error('Error fetching questions and shifts from server:', err);
      }
    };

    fetchServerData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectSubject = (subId) => {
    setSelectedSubject(subId);
    if (subId === 'all') {
      const current = Object.fromEntries(searchParams.entries());
      delete current.subject;
      setSearchParams(current);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams.entries()), subject: subId });
    }
    setActiveTopicModal(null);
  };

  const handleSelectCategoryTab = (tabId) => {
    setActiveCategoryTab(tabId);
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), tab: tabId });
  };

  // Helper to format real question counts matching reference image (12.2k Qs, 4.9k Qs, 875 Qs, etc.)
  const formatQuestionsBadge = (count, fallbackLabel) => {
    if (!count) return fallbackLabel;
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k Qs`;
    }
    return `${count} Qs`;
  };

  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  const liveTotalQuestionsNumber = firestoreStats.totalQuestions || 19121;
  const liveSubjectCounts = firestoreStats.subjectCounts || {};

  // Circular Exam / Subject Carousel Items (Both Exams and Core Subjects)
  const examCarouselCards = useMemo(() => [
    {
      id: 'all',
      title: 'All Exams',
      shortTitle: 'All Exams',
      badge: `${(liveTotalQuestionsNumber / 1000).toFixed(1)}k Qs`,
      image3d: iconAllMock,
      fallbackUrl: `${cleanBase}assets/aistudio/image_a918d86e.png`,
      type: 'exam'
    },
    {
      id: 'rrb-ntpc',
      title: 'RRB NTPC',
      shortTitle: 'RRB NTPC',
      badge: '128 Shifts',
      image3d: `${cleanBase}assets/aistudio/logo_rrb_clean.png`,
      fallbackUrl: `${cleanBase}assets/aistudio/image_64ced5a3.png`,
      type: 'exam'
    },
    {
      id: 'ssc-cgl',
      title: 'SSC CGL',
      shortTitle: 'SSC CGL',
      badge: '35 Shifts',
      image3d: `${cleanBase}assets/aistudio/image_a918d86e.png`,
      fallbackUrl: `${cleanBase}assets/aistudio/header_icon_trimmed.png`,
      type: 'exam'
    },
    {
      id: 'ssc-chsl',
      title: 'SSC CHSL',
      shortTitle: 'SSC CHSL',
      badge: '10+2 Tier-1',
      image3d: `${cleanBase}assets/aistudio/header_icon_trimmed.png`,
      fallbackUrl: `${cleanBase}assets/aistudio/image_a918d86e.png`,
      type: 'exam'
    },
    {
      id: 'ssc-mts',
      title: 'SSC MTS',
      shortTitle: 'SSC MTS',
      badge: 'Multi-Tasking',
      image3d: `${cleanBase}assets/aistudio/image_3a489c44.png`,
      fallbackUrl: `${cleanBase}assets/aistudio/header_icon_trimmed.png`,
      type: 'exam'
    },
    {
      id: 'general-knowledge',
      title: 'General Awareness',
      shortTitle: 'GA / GK',
      badge: formatQuestionsBadge(liveSubjectCounts['general-knowledge'] || 7420, '7.4k Qs'),
      image3d: iconGeneralKnowledge,
      fallbackUrl: `${cleanBase}assets/aistudio/image_1955d35b.png`,
      type: 'subject'
    },
    {
      id: 'quantitative-aptitude',
      title: 'Mathematics',
      shortTitle: 'Maths / Quant',
      badge: formatQuestionsBadge(liveSubjectCounts['quantitative-aptitude'] || 4410, '4.4k Qs'),
      image3d: iconQuant,
      fallbackUrl: `${cleanBase}assets/aistudio/image_6a75de99.png`,
      type: 'subject'
    },
    {
      id: 'reasoning',
      title: 'Reasoning',
      shortTitle: 'Reasoning',
      badge: formatQuestionsBadge(liveSubjectCounts['reasoning'] || 4140, '4.1k Qs'),
      image3d: iconReasoning,
      fallbackUrl: `${cleanBase}assets/aistudio/image_70b0a70b.png`,
      type: 'subject'
    },
    {
      id: 'english-language',
      title: 'English',
      shortTitle: 'English',
      badge: formatQuestionsBadge(liveSubjectCounts['english-language'] || 680, '680 Qs'),
      image3d: iconEnglish,
      fallbackUrl: `${cleanBase}assets/aistudio/image_33dcd63b.png`,
      type: 'subject'
    },
    {
      id: 'general-science',
      title: 'General Science',
      shortTitle: 'Science',
      badge: formatQuestionsBadge(liveSubjectCounts['general-science'] || 1020, '1.0k Qs'),
      image3d: iconScience,
      fallbackUrl: `${cleanBase}assets/aistudio/image_dbf284c6.png`,
      type: 'subject'
    }
  ], [liveTotalQuestionsNumber, liveSubjectCounts, cleanBase]);

  // Current Subject Topics list (strictly filtered by subject)
  const currentSubjectTopics = useMemo(() => {
    const targetSub = selectedSubject.startsWith('rrb') || selectedSubject.startsWith('ssc')
      ? 'general-knowledge'
      : (selectedSubject === 'all' ? 'general-knowledge' : selectedSubject);
    return getTopicsForSubject(targetSub);
  }, [selectedSubject]);

  // Topic questions counter
  const getTopicQuestionCount = (subjectId, topic) => {
    const key = `${subjectId}::${topic.id}`;
    if (firestoreStats?.topicCounts?.[key]) {
      return firestoreStats.topicCounts[key];
    }
    const totalSub = liveSubjectCounts[subjectId] || 600;
    return Math.max(25, Math.round(totalSub / Math.max(1, currentSubjectTopics.length)));
  };

  // Full Mock Tests filtered by selected exam/subject and search
  const filteredFullMocks = useMemo(() => {
    let list = FULL_MOCK_SERIES;

    if (selectedSubject === 'rrb-ntpc') {
      list = list.filter((m) => m.examId === 'rrb-ntpc');
    } else if (selectedSubject === 'ssc-cgl') {
      list = list.filter((m) => m.examId === 'ssc-cgl');
    } else if (selectedSubject === 'ssc-chsl') {
      list = list.filter((m) => m.examId === 'ssc-chsl');
    } else if (selectedSubject === 'ssc-mts') {
      list = list.filter((m) => m.examId === 'ssc-mts');
    } else if (selectedSubject !== 'all') {
      // If a subject is selected, show tests containing that section
      list = list.filter((m) => m.sections.some((s) => s.name.toLowerCase().includes(selectedSubject.replace('-', ' '))));
    }

    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.examName.toLowerCase().includes(q) ||
          m.pattern.toLowerCase().includes(q) ||
          m.mockNumber.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedSubject, globalSearch]);

  // Previous Year Shift Papers Filtered
  const { matchingShifts, paginatedShifts, totalPages } = useMemo(() => {
    if (!shifts || shifts.length === 0) {
      return { matchingShifts: [], paginatedShifts: [], totalPages: 1 };
    }
    let list = shifts;

    const isGrad2026 = (s) =>
      (s.examLevel === 'Graduate' || String(s.id).includes('grad')) &&
      (s.examYear === '2026' || String(s.id).includes('2026') || String(s.examName || '').includes('2025-26'));
    const isGrad2024 = (s) =>
      (s.examLevel === 'Graduate' || String(s.id).includes('grad')) && !isGrad2026(s);
    const isUg = (s) =>
      String(s.id).includes('ug') || String(s.examName || '').includes('Under Graduate') || s.examLevel === 'Under Graduate';
    const isSsc2020 = (s) =>
      (s.examType === 'SSC CGL' || String(s.id).includes('ssc')) && (s.examYear === '2020' || String(s.id).includes('2020'));
    const isSsc2026 = (s) =>
      (s.examType === 'SSC CGL' || String(s.id).includes('ssc')) && (s.examYear === '2026' || String(s.id).includes('2026'));
    const isSsc = (s) => isSsc2020(s) || isSsc2026(s) || String(s.id).includes('ssc');
    const isRrb = (s) => isUg(s) || isGrad2024(s) || isGrad2026(s);

    // Apply Carousel Exam selection
    if (selectedSubject === 'rrb-ntpc') {
      list = list.filter(isRrb);
    } else if (selectedSubject === 'ssc-cgl') {
      list = list.filter(isSsc);
    }

    // Apply PYQ Sub-Tab Filter
    if (pyqExamFilter === 'rrb-ug') {
      list = list.filter(isUg);
    } else if (pyqExamFilter === 'rrb-grad-2024') {
      list = list.filter(isGrad2024);
    } else if (pyqExamFilter === 'rrb-grad-2026') {
      list = list.filter(isGrad2026);
    } else if (pyqExamFilter === 'ssc-2020') {
      list = list.filter(isSsc2020);
    } else if (pyqExamFilter === 'ssc-2026') {
      list = list.filter(isSsc2026);
    }

    // Apply Shift / Date Search
    const searchParam = (shiftSearch || globalSearch).toLowerCase().trim();
    if (searchParam) {
      list = list.filter(
        (s) =>
          s.shiftNumber?.toString().includes(searchParam) ||
          (s.title && s.title.toLowerCase().includes(searchParam)) ||
          (s.examDate && s.examDate.toLowerCase().includes(searchParam)) ||
          (s.examName && s.examName.toLowerCase().includes(searchParam)) ||
          (s.shiftTiming && s.shiftTiming.toLowerCase().includes(searchParam))
      );
    }

    const total = Math.max(1, Math.ceil(list.length / SHIFTS_PER_PAGE));
    const startIdx = (pyqCurrentPage - 1) * SHIFTS_PER_PAGE;
    const paginated = list.slice(startIdx, startIdx + SHIFTS_PER_PAGE);

    return { matchingShifts: list, paginatedShifts: paginated, totalPages: total };
  }, [shifts, selectedSubject, pyqExamFilter, shiftSearch, globalSearch, pyqCurrentPage]);

  // Jump to page helper
  const handleJumpToPage = (e) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setPyqCurrentPage(p);
      setJumpPageInput('');
    }
  };

  // Series matching reference image: Screenshot_20261112_092302_2e65db37.jpg
  const newTestSeriesList = [
    {
      id: 'series-rrb-ntpc-ug',
      title: 'RRB NTPC Under Graduate 2026-27 (CBT 1 + CBT 2)',
      totalTests: '656 Total Tests',
      freeLabel: '100% Free',
      languages: 'English, Hindi +6 more',
      agency: 'RRB',
      examId: 'rrb-ntpc',
      logoUrl: '/assets/aistudio/logo_rrb_clean.png',
      badge: 'NEW'
    },
    {
      id: 'series-opsc-grad',
      title: 'OPSC Combined Graduate 2026 Mock Series',
      totalTests: '175 Total Tests',
      freeLabel: '100% Free',
      languages: 'English, Hindi +4 more',
      agency: 'OPSC',
      examId: 'all',
      logoUrl: '/assets/aistudio/logo_rrb_clean.png',
      badge: 'NEW'
    },
    {
      id: 'series-rrb-ntpc-grad',
      title: 'RRB NTPC Graduate 2026-27 (CBT 1 + CBT 2)',
      totalTests: '835 Total Tests',
      freeLabel: '100% Free',
      languages: 'English, Hindi +6 more',
      agency: 'RRB',
      examId: 'rrb-ntpc',
      logoUrl: '/assets/aistudio/logo_rrb_clean.png',
      badge: 'NEW'
    },
    {
      id: 'series-rrb-sm',
      title: 'RRB Station Master (CBT + CBAT) 2026 Series',
      totalTests: '164 Total Tests',
      freeLabel: '100% Free',
      languages: 'English, Hindi +6 more',
      agency: 'RRB',
      examId: 'rrb-ntpc',
      logoUrl: '/assets/aistudio/logo_rrb_clean.png',
      badge: 'NEW'
    },
    {
      id: 'series-ssc-cgl',
      title: 'SSC CGL 2026 Complete (Tier 1 + Tier 2) Mock Series',
      totalTests: '420 Total Tests',
      freeLabel: '100% Free',
      languages: 'English, Hindi +6 more',
      agency: 'SSC',
      examId: 'ssc-cgl',
      logoUrl: '/assets/aistudio/logo_rrb_clean.png',
      badge: 'NEW'
    }
  ];

  const testSeriesForYouList = [
    {
      id: 'ts-rrb-grad',
      title: 'RRB NTPC Graduate 2026-27 (CBT 1 + CBT 2) Mock Test Series',
      totalTests: '835 Total tests',
      freeLabel: '100% Free',
      languages: 'English, Hindi +6 more',
      examId: 'rrb-ntpc',
      category: 'rankers',
      logoUrl: '/assets/aistudio/logo_rrb_clean.png',
      targetTab: 'full-mock'
    },
    {
      id: 'ts-rrb-sm',
      title: 'RRB Station Master(CBT + CBAT) 2026 Mock Test Series',
      totalTests: '164 Total tests',
      freeLabel: '100% Free',
      languages: 'English, Hindi +6 more',
      examId: 'rrb-ntpc',
      category: 'rankers',
      logoUrl: '/assets/aistudio/logo_rrb_clean.png',
      targetTab: 'full-mock'
    },
    {
      id: 'ts-rrb-ug',
      title: 'RRB NTPC Under Graduate 2026-27 (CBT 1 + CBT 2) Mock Test Series',
      totalTests: '656 Total tests',
      freeLabel: '100% Free',
      languages: 'English, Hindi +6 more',
      examId: 'rrb-ntpc',
      category: 'rankers',
      logoUrl: '/assets/aistudio/logo_rrb_clean.png',
      targetTab: 'full-mock'
    },
    {
      id: 'ts-ssc-cgl',
      title: 'SSC CGL 2026 Complete (Tier 1 + Tier 2) Mock Test Series',
      totalTests: '420 Total tests',
      freeLabel: '100% Free',
      languages: 'English, Hindi +6 more',
      examId: 'ssc-cgl',
      category: 'rankers',
      logoUrl: '/assets/aistudio/logo_rrb_clean.png',
      targetTab: 'full-mock'
    },
    {
      id: 'ts-rrb-pyqs',
      title: 'RRB NTPC Official CBT 163 Shift Papers Series',
      totalTests: '163 CBT Shift Papers',
      freeLabel: '100% Free',
      languages: 'English, Hindi +6 more',
      examId: 'rrb-ntpc',
      category: 'pyqs',
      logoUrl: '/assets/aistudio/logo_rrb_clean.png',
      targetTab: 'pyqs'
    }
  ];

  const displayedTestSeries = useMemo(() => {
    if (testSeriesSubFilter === 'rankers') {
      return testSeriesForYouList.filter((t) => t.category === 'rankers');
    }
    if (testSeriesSubFilter === 'pyqs') {
      return testSeriesForYouList.filter((t) => t.category === 'pyqs' || t.targetTab === 'pyqs');
    }
    if (testSeriesSubFilter === 'full-mock') {
      return testSeriesForYouList.filter((t) => t.targetTab === 'full-mock');
    }
    return testSeriesForYouList;
  }, [testSeriesSubFilter]);

  // Launch test handler - 100% Free for everyone (No locks)
  const handleLaunchTest = (test, mode = 'cbt') => {
    navigate(`/mocks/${test.id}?mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] pb-24 relative overflow-x-hidden">
      {/* Top Banner Gradient Shading Merge (Only for banner area, merges smoothly into normal #F4F7FC below like HomePage) */}
      <div className="absolute top-0 inset-x-0 h-[280px] sm:h-[360px] md:h-[430px] bg-gradient-to-b from-[#1F224D] via-[#2D457B] to-[#F4F7FC] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[420px] sm:w-[620px] h-[340px] sm:h-[460px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-28 left-0 w-[340px] sm:w-[500px] h-[300px] sm:h-[420px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1240px] mx-auto px-3.5 sm:px-6 pt-3 sm:pt-4 space-y-4 sm:space-y-6">
        {/* =========================================================================
            HEADER & BREADCRUMBS
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-200">
          <Breadcrumbs
            items={[
              { label: t('navHome') || 'Home', path: '/' },
              { label: 'Mock Tests' }
            ]}
          />

          {/* Quick Header Actions: 100% Free For All Badge, Bookmarks Counter */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* 100% Free For All Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-xs shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
              <span>100% Free For All</span>
            </div>

            {/* Bookmarks Counter */}
            <button
              type="button"
              onClick={() => {
                setActiveCategoryTab('all');
                setGlobalSearch('');
              }}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer relative"
              title="Saved Tests"
            >
              <Bookmark className="w-4 h-4 text-slate-200" />
              {bookmarkedIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {bookmarkedIds.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================================
            HERO BANNER
            ========================================================================= */}
        <section
          aria-label="Ace Your Government Exams"
          className="relative w-full rounded-2xl sm:rounded-[20px] overflow-hidden shadow-xl shadow-[#081F44]/25 border border-white/10 select-none bg-[#07183B] group"
        >
          <img
            src="/assets/aistudio/image_ef986abf.png"
            alt="Ace Your Government Exams - Real exam pattern tests, topic-wise practice, and previous year papers with detailed analysis."
            className="w-full h-auto object-cover block select-none pointer-events-none"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07183B]/70 via-[#07183B]/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07183B]/55 via-transparent to-transparent pointer-events-none" />
        </section>

        {/* =========================================================================
            LIVE GLOBAL SEARCH BAR
            ========================================================================= */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search full mocks, previous year shift papers (e.g. Shift 1, Modern History, SSC CGL Tier-1)..."
            className="w-full pl-11 pr-10 py-3 bg-white text-slate-800 text-xs sm:text-sm font-medium rounded-2xl sm:rounded-full border border-slate-200/90 shadow-xs focus:outline-hidden focus:border-[#2468B4] focus:ring-2 focus:ring-[#2468B4]/20 transition"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* =========================================================================
            COMPACT STATISTICS CARDS (Verified Bank: 19,121+ Questions • 163 CBT Shifts)
            ========================================================================= */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xs border border-slate-100 grid grid-cols-4 divide-x divide-slate-100 text-center">
          <div className="flex flex-col items-center justify-center px-1 sm:px-2 py-0.5 sm:py-1">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#12345A] stroke-[2.2] mb-1 sm:mb-1.5" />
            <div className="font-heading font-black text-sm sm:text-2xl text-[#12345A] tracking-tight leading-none">
              {firestoreStats.totalQuestions?.toLocaleString() || '19,121'}+
            </div>
            <div className="text-[9.5px] sm:text-xs text-slate-500 font-semibold mt-1">
              Total Questions
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-1 sm:px-2 py-0.5 sm:py-1">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#12345A] stroke-[2.2] mb-1 sm:mb-1.5" />
            <div className="font-heading font-black text-sm sm:text-2xl text-[#12345A] tracking-tight leading-none">
              {firestoreStats.totalMockTests ? `${firestoreStats.totalMockTests}+` : '380+'}
            </div>
            <div className="text-[9.5px] sm:text-xs text-slate-500 font-semibold mt-1">
              Mock Tests
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-1 sm:px-2 py-0.5 sm:py-1">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#12345A] stroke-[2.2] mb-1 sm:mb-1.5" />
            <div className="font-heading font-black text-sm sm:text-2xl text-[#12345A] tracking-tight leading-none">
              163
            </div>
            <div className="text-[9.5px] sm:text-xs text-slate-500 font-semibold mt-1 leading-tight text-center">
              CBT Shift Papers
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-1 sm:px-2 py-0.5 sm:py-1">
            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-[#12345A] stroke-[2.2] mb-1 sm:mb-1.5" />
            <div className="font-heading font-black text-sm sm:text-2xl text-[#12345A] tracking-tight leading-none">
              8
            </div>
            <div className="text-[9.5px] sm:text-xs text-slate-500 font-semibold mt-1">
              Available Subjects
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: NEW TEST SERIES (Application Color Theme)
            ========================================================================= */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#2468B4] rounded-full inline-block" />
            <h2 className="text-base sm:text-lg font-black text-[#12345A] font-heading tracking-tight">
              New Test Series
            </h2>
          </div>

          <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar py-1">
            {newTestSeriesList.map((series) => (
              <div
                key={series.id}
                onClick={() => {
                  if (series.examId && series.examId !== 'all') {
                    setSelectedSubject(series.examId);
                  }
                  setActiveCategoryTab('full-mock');
                }}
                className="min-w-[275px] sm:min-w-[315px] max-w-[330px] bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group shrink-0 active:scale-[0.98]"
              >
                {/* Left: Round Emblem Logo + NEW Badge */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-50 p-1 border border-slate-200 shadow-2xs flex items-center justify-center">
                    <img
                      src={series.logoUrl}
                      alt={series.title}
                      className="w-full h-full object-contain rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/aistudio/logo_rrb_clean.png';
                      }}
                    />
                  </div>
                  <span className="mt-1.5 px-2 py-0.5 rounded-xs bg-[#7C3AED] text-white text-[9px] font-black uppercase tracking-wider shadow-2xs">
                    NEW
                  </span>
                </div>

                {/* Right: Title, Tests Count + Free, Languages */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading font-black text-sm text-[#12345A] leading-snug line-clamp-2 group-hover:text-[#2468B4] transition-colors">
                    {series.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs mt-1.5">
                    <span className="text-slate-600 font-semibold">{series.totalTests}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.2 rounded-full text-[11px] border border-emerald-200/60">
                      {series.freeLabel}
                    </span>
                  </div>
                  <div className="text-xs text-[#2468B4] font-semibold mt-1 truncate">
                    {series.languages}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: TEST SERIES FOR YOU (Application Color Theme)
            ========================================================================= */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#2468B4] rounded-full inline-block" />
              <h2 className="text-base sm:text-lg font-black text-[#12345A] font-heading tracking-tight">
                Test Series For You
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveCategoryTab('full-mock')}
              className="text-xs sm:text-sm font-bold text-[#2468B4] hover:text-[#12345A] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          {/* Sub-Filters Pill Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'rankers', label: 'Rankers Test Series' },
              { id: 'pyqs', label: 'Previous Year Papers' },
              { id: 'full-mock', label: 'Full Mock Tests' }
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setTestSeriesSubFilter(btn.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  testSeriesSubFilter === btn.id
                    ? 'bg-[#12345A] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Test Series List Card (Pure white clean application card container) */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-3 border border-slate-200/90 shadow-xs divide-y divide-slate-100">
            {displayedTestSeries.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.examId && item.examId !== 'all') {
                    setSelectedSubject(item.examId);
                  }
                  if (item.targetTab) {
                    setActiveCategoryTab(item.targetTab);
                  }
                }}
                className="flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl hover:bg-slate-50/80 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Circular Official Emblem */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-50 p-1 border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                    <img
                      src={item.logoUrl}
                      alt={item.title}
                      className="w-full h-full object-contain rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/aistudio/logo_rrb_clean.png';
                      }}
                    />
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <h3 className="font-heading font-black text-sm sm:text-base text-[#12345A] group-hover:text-[#2468B4] transition leading-snug line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs mt-1">
                      <span className="text-slate-600 font-semibold">{item.totalTests}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.2 rounded-full text-[11px] border border-emerald-200/60">
                        {item.freeLabel}
                      </span>
                    </div>
                    <div className="text-xs text-[#2468B4] font-semibold mt-0.5 truncate">
                      {item.languages}
                    </div>
                  </div>
                </div>

                {/* Right Arrow */}
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#12345A] group-hover:translate-x-0.5 transition shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            TEST CATEGORY NAVIGATION TABS (Horizontally Scrollable)
            1. All Tests  2. Full Mock Tests  3. Previous Year Papers
            4. Subject-wise Tests  5. Topic-wise Practice  6. Sectional Tests
            ========================================================================= */}
        <section className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 select-none">
          {[
            { id: 'all', label: 'All Tests', icon: LayoutGrid, count: '380+' },
            { id: 'full-mock', label: 'Full Mock Tests', icon: Play, count: '14 Series' },
            { id: 'pyqs', label: 'Previous Year Papers', icon: BookOpen, count: '163 Shifts' },
            { id: 'subject-wise', label: 'Subject-wise Tests', icon: Layers, count: '8 Core' },
            { id: 'topic-wise', label: 'Topic-wise Practice', icon: Sparkles, count: '64 Units' },
            { id: 'sectional', label: 'Sectional Tests', icon: Target, count: 'Speed Drills' }
          ].map((tab) => {
            const isActive = activeCategoryTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectCategoryTab(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer select-none shrink-0 shadow-2xs ${
                  isActive
                    ? 'bg-[#12345A] text-white ring-2 ring-[#12345A]/20 shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F2BE4F]' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </section>

        {/* =========================================================================
            CIRCULAR HORIZONTAL EXAM / SUBJECT CAROUSEL
            All Exams, RRB NTPC, SSC CGL, SSC CHSL, SSC MTS, General Awareness,
            Mathematics, Reasoning, English, General Science
            ========================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#F2BE4F] rounded-full inline-block" />
              <h2 className="text-sm sm:text-base font-bold text-[#12345A]">
                Select Exam or Subject
              </h2>
            </div>
            {selectedSubject !== 'all' && (
              <button
                type="button"
                onClick={() => handleSelectSubject('all')}
                className="text-xs font-bold text-[#2468B4] hover:underline cursor-pointer"
              >
                Reset Filter (Show All)
              </button>
            )}
          </div>

          <div className="relative -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
            <div
              ref={subjectScrollRef}
              className="flex items-start gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5"
            >
              {examCarouselCards.map((item) => {
                const isSelected = selectedSubject === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectSubject(item.id)}
                    className="group relative flex-shrink-0 flex flex-col items-center justify-start w-[82px] sm:w-[94px] text-center transition-all duration-200 cursor-pointer active:scale-95"
                    title={item.title}
                  >
                    {/* Circular Icon */}
                    <div
                      className={`w-[66px] h-[66px] sm:w-[74px] sm:h-[74px] rounded-full p-1 bg-gradient-to-b from-white to-slate-50 border-2 flex items-center justify-center relative transition-all duration-200 shrink-0 ${
                        isSelected
                          ? 'border-[#12345A] ring-3 ring-[#12345A]/25 scale-105 shadow-md bg-blue-50/50'
                          : 'border-slate-200/90 hover:border-[#12345A]/40 shadow-xs'
                      }`}
                    >
                      <img
                        src={item.image3d}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-full drop-shadow-xs"
                        loading="lazy"
                        onError={(e) => {
                          if (item.fallbackUrl && e.currentTarget.src !== item.fallbackUrl) {
                            e.currentTarget.src = item.fallbackUrl;
                          }
                        }}
                      />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#12345A] text-[#F2BE4F] border-2 border-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div className="w-full my-1 truncate px-1">
                      <span
                        className={`text-xs sm:text-[13px] font-heading font-black tracking-tight leading-tight block truncate ${
                          isSelected ? 'text-[#12345A]' : 'text-slate-800 group-hover:text-[#12345A]'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    {/* Badge */}
                    <span
                      className={`text-[9.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full truncate leading-none ${
                        isSelected
                          ? 'bg-[#12345A] text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            VIEW 1: FULL MOCK TESTS (Exam-specific patterns: RRB NTPC CBT-1 & SSC CGL)
            ========================================================================= */}
        {(activeCategoryTab === 'all' || activeCategoryTab === 'full-mock') && (
          <section className="space-y-4 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#F2BE4F] rounded-full inline-block" />
                  <h3 className="text-base sm:text-lg font-black text-[#12345A] font-heading">
                    Full Mock Tests (Official Pattern CBT Simulations)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 pl-3.5 mt-0.5">
                  Complete length examination test series with real exam timers, negative marking, and section navigation.
                </p>
              </div>
              <span className="text-xs font-bold text-[#12345A] bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs self-start sm:self-auto">
                {filteredFullMocks.length} Tests Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFullMocks.map((test) => (
                <OfficialMockTestCard
                  key={test.id}
                  test={test}
                  isBookmarked={bookmarkedIds.includes(test.id)}
                  onToggleBookmark={toggleBookmark}
                  onStartTest={(t) => handleLaunchTest(t, 'cbt')}
                  onPractice={(t) => handleLaunchTest(t, 'practice')}
                  hasProPass={hasProPass}
                />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            VIEW 2: DEDICATED PREVIOUS YEAR PAPERS (RRB NTPC & SSC CGL - 163 Shifts)
            ========================================================================= */}
        {(activeCategoryTab === 'all' || activeCategoryTab === 'pyqs') && (
          <section className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#F2BE4F] rounded-full inline-block" />
                  <h3 className="text-base sm:text-lg font-black text-[#12345A] font-heading">
                    Previous Year Papers (163 CBT Shift Papers)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 pl-3.5 mt-0.5">
                  Every original shift paper is accessible as an independent test with authentic questions & official keys.
                </p>
              </div>

              {/* Sub-Filters for PYQs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'all', label: 'All 163 Shifts' },
                  { id: 'rrb-ug', label: 'RRB UG (57 Shifts)' },
                  { id: 'rrb-grad-2024', label: 'RRB Grad 2024 (47 Shifts)' },
                  { id: 'rrb-grad-2026', label: 'RRB Grad 2025-26 (24 Shifts)' },
                  { id: 'ssc-2020', label: 'SSC CGL 2020 (21 Shifts)' },
                  { id: 'ssc-2026', label: 'SSC CGL 2026 (14 Shifts)' }
                ].map((flt) => (
                  <button
                    key={flt.id}
                    type="button"
                    onClick={() => {
                      setPyqExamFilter(flt.id);
                      setPyqCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      pyqExamFilter === flt.id
                        ? 'bg-[#12345A] text-white shadow-2xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shift Search & Pagination Bar Top */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={shiftSearch}
                  onChange={(e) => {
                    setShiftSearch(e.target.value);
                    setPyqCurrentPage(1);
                  }}
                  placeholder="Filter shift by number (e.g. 1, 2, 3) or date (e.g. 2024, 2025)..."
                  className="w-full text-xs bg-transparent focus:outline-hidden"
                />
              </div>

              {/* Page Navigator */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-500 font-medium">
                  Page <strong className="text-slate-800">{pyqCurrentPage}</strong> of {totalPages} ({matchingShifts.length} shifts)
                </span>
                <button
                  type="button"
                  disabled={pyqCurrentPage <= 1}
                  onClick={() => setPyqCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-md border border-slate-200 disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={pyqCurrentPage >= totalPages}
                  onClick={() => setPyqCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-md border border-slate-200 disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Jump to page form */}
                <form onSubmit={handleJumpToPage} className="flex items-center gap-1 pl-1 border-l border-slate-200">
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={jumpPageInput}
                    onChange={(e) => setJumpPageInput(e.target.value)}
                    placeholder="Page#"
                    className="w-14 px-1.5 py-0.5 border border-slate-200 rounded text-center text-xs"
                  />
                  <button type="submit" className="px-2 py-0.5 bg-[#12345A] text-white rounded text-[11px] font-bold">
                    Go
                  </button>
                </form>
              </div>
            </div>

            {/* PYQ Shift Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedShifts.map((shift) => {
                const is2026Grad =
                  (shift.examLevel === 'Graduate' || String(shift.id).includes('grad')) &&
                  (shift.examYear === '2026' || String(shift.id).includes('2026'));
                const is2024Grad =
                  (shift.examLevel === 'Graduate' || String(shift.id).includes('grad')) && !is2026Grad;
                const isSsc =
                  shift.examType === 'SSC CGL' || String(shift.id).includes('ssc');

                const pdfDownloadUrl = isSsc
                  ? '/assets/aistudio/SSC_CGL_2020_All_21_Sets_English.pdf'
                  : is2026Grad
                  ? '/assets/aistudio/RRB-NTPC-Graduate-2025-CBT1-EN-Complete-Paper_4ec5b5cd.pdf'
                  : is2024Grad
                  ? '/assets/aistudio/RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key_887400b5.pdf'
                  : '/assets/aistudio/RRB-NTPC-UG-2025-EN-All-Papers_copy_f08e8b76.pdf';

                const pyqTestObj = {
                  id: shift.id,
                  title: shift.title || (isSsc ? `SSC CGL Tier–I Shift ${shift.shiftNumber || 1}` : `RRB NTPC CBT–1 Shift ${shift.shiftNumber || 1}`),
                  agency: isSsc ? 'SSC' : 'RRB',
                  examType: isSsc ? 'SSC CGL' : 'RRB NTPC',
                  examId: isSsc ? 'ssc-cgl' : 'rrb-ntpc',
                  questionsCount: shift.questionsCount || 100,
                  timeMinutes: shift.durationMinutes || (isSsc ? 60 : 90),
                  negativeMarking: isSsc ? '-0.50 Negative Marking' : '-0.25 Negative Marking',
                  attempts: `${(24 + (Number(shift.shiftNumber) || 1) * 1.4).toFixed(1)}K Attempts`,
                  difficulty: (Number(shift.shiftNumber) || 1) % 3 === 0 ? 'Hard' : 'Medium',
                  isFree: true,
                  pdfUrl: pdfDownloadUrl
                };

                return (
                  <OfficialMockTestCard
                    key={shift.id || shift.shiftNumber}
                    test={pyqTestObj}
                    isBookmarked={bookmarkedIds.includes(shift.id)}
                    onToggleBookmark={toggleBookmark}
                    onStartTest={() => navigate(`/mocks/${shift.id}?mode=cbt`)}
                    onPractice={() => navigate(`/mocks/${shift.id}?mode=practice`)}
                    hasProPass={hasProPass}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================================================
            VIEW 3: TOPIC-WISE PRACTICE & DRILL GENERATOR
            (General Awareness, Mathematics, Reasoning, English, General Science)
            Configurable: 10, 20, 25, 50 questions with strict subject protection!
            ========================================================================= */}
        {(activeCategoryTab === 'all' || activeCategoryTab === 'topic-wise') && (
          <section className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#F2BE4F] rounded-full inline-block" />
                  <h3 className="text-base sm:text-lg font-black text-[#12345A] font-heading">
                    Topic-Wise Practice &amp; Drill Generator
                  </h3>
                </div>
                <p className="text-xs text-slate-500 pl-3.5 mt-0.5">
                  Select any syllabus topic and configure drills with 10, 20, 25 or 50 questions with zero cross-subject bleeding.
                </p>
              </div>

              <span className="text-xs font-bold text-[#12345A] bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs self-start sm:self-auto">
                {currentSubjectTopics.length} Syllabus Units
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {currentSubjectTopics.map((topic) => {
                const targetSub = selectedSubject.startsWith('rrb') || selectedSubject.startsWith('ssc')
                  ? 'general-knowledge'
                  : (selectedSubject === 'all' ? 'general-knowledge' : selectedSubject);
                const qCount = getTopicQuestionCount(targetSub, topic);

                return (
                  <div
                    key={topic.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md hover:border-[#12345A]/40 transition group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#12345A]">
                          {topic.subtopics?.length || 0} Subtopics
                        </span>
                        <span className="text-xs font-black text-slate-700">
                          {qCount} Questions
                        </span>
                      </div>

                      <h4 className="font-bold text-sm sm:text-base text-[#12345A] mt-2 group-hover:text-[#2468B4] transition">
                        {topic.name}
                      </h4>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {topic.description || 'Targeted official questions mapped to syllabus.'}
                      </p>

                      {topic.subtopics && topic.subtopics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-slate-100">
                          {topic.subtopics.slice(0, 3).map((sub, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 line-clamp-1"
                            >
                              {sub}
                            </span>
                          ))}
                          {topic.subtopics.length > 3 && (
                            <span className="text-[10px] font-semibold text-slate-400 self-center">
                              +{topic.subtopics.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-emerald-700 font-bold">Free Practice</span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTopicModal({ ...topic, subjectId: targetSub });
                          setChosenTopicQuestionCount(25);
                        }}
                        className="bg-[#12345A] hover:bg-[#2468B4] text-white px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#F2BE4F]" />
                        <span>Launch Drill</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================================================
            VIEW 4: SECTIONAL TESTS (Speed Drills 25 Qs & Sectional CBTs)
            ========================================================================= */}
        {(activeCategoryTab === 'all' || activeCategoryTab === 'sectional') && (
          <section className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#F2BE4F] rounded-full inline-block" />
              <h3 className="text-base sm:text-lg font-black text-[#12345A] font-heading">
                Sectional Tests &amp; Speed Drills
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SECTIONAL_TESTS.map((test) => (
                <OfficialMockTestCard
                  key={test.id}
                  test={{
                    ...test,
                    agency: test.agency || (test.title.includes('SSC') ? 'SSC' : 'RRB'),
                    negativeMarking: test.negativeMarking || '-0.25 Negative Marking'
                  }}
                  isBookmarked={bookmarkedIds.includes(test.id)}
                  onToggleBookmark={toggleBookmark}
                  onStartTest={(t) => handleLaunchTest(t, 'cbt')}
                  onPractice={(t) => handleLaunchTest(t, 'practice')}
                  hasProPass={hasProPass}
                />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            TOPIC PRACTICE & DRILL CONFIGURATION MODAL (10, 20, 25, 50 Qs)
            ========================================================================= */}
        {activeTopicModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#2468B4]">
                    {examCarouselCards.find((s) => s.id === activeTopicModal.subjectId)?.title || 'Subject'} · Drill Generator
                  </span>
                  <h3 className="text-xl font-black text-[#12345A] mt-0.5">
                    {activeTopicModal.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeTopicModal.description || 'Targeted official questions mapped to syllabus.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTopicModal(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subtopics Structure */}
              {activeTopicModal.subtopics && activeTopicModal.subtopics.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">
                    Included Subtopics ({activeTopicModal.subtopics.length}):
                  </label>
                  <div className="max-h-36 overflow-y-auto pr-1 flex flex-wrap gap-1.5 p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    {activeTopicModal.subtopics.map((sub, sIdx) => (
                      <span key={sIdx} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        <span>{sub}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Count Selector: 10, 20, 25, 50, all */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Choose Test Size:</label>
                <div className="grid grid-cols-5 gap-1.5 text-xs font-bold">
                  {[10, 20, 25, 50, 'all'].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setChosenTopicQuestionCount(cnt)}
                      className={`py-2 rounded-xl border transition-all cursor-pointer text-center ${
                        chosenTopicQuestionCount === cnt
                          ? 'bg-[#12345A] text-white border-[#12345A] shadow-xs scale-105'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cnt === 'all' ? 'All' : `${cnt} Qs`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <Link
                  to={`/mocks/topic-${activeTopicModal.subjectId || 'general-knowledge'}-${activeTopicModal.id}?mode=practice&limit=${
                    chosenTopicQuestionCount === 'all'
                      ? getTopicQuestionCount(activeTopicModal.subjectId || 'general-knowledge', activeTopicModal)
                      : chosenTopicQuestionCount
                  }`}
                  className="w-full py-2.5 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Start Practice Mode</span>
                </Link>

                <Link
                  to={`/mocks/topic-${activeTopicModal.subjectId || 'general-knowledge'}-${activeTopicModal.id}?mode=cbt&limit=${
                    chosenTopicQuestionCount === 'all'
                      ? getTopicQuestionCount(activeTopicModal.subjectId || 'general-knowledge', activeTopicModal)
                      : chosenTopicQuestionCount
                  }`}
                  className="w-full py-2.5 px-4 rounded-full bg-[#12345A] hover:bg-[#0B1F3A] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Start CBT Examination</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
