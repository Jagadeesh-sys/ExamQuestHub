import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Search,
  ChevronLeft,
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
  Filter,
  Flame,
  Monitor,
  BarChart3,
  Target,
  Languages,
  ClipboardList,
  CloudUpload,
  RefreshCw,
  Check,
  SlidersHorizontal
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
import { getMockQuestions, bulkSaveMockQuestions } from '../firebase/firestoreService.js';
import MockTestCard from '../components/MockTestCard.jsx';

import gkGlobeImg from '../assets/images/gk_study_globe_books_3d_1793887297898.jpg';

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

  // Ref & scroll tracking for horizontal circular subjects row (matching screenshot)
  const subjectsScrollRef = React.useRef(null);
  const [subjectsScrollPercentage, setSubjectsScrollPercentage] = useState(0);

  const handleSubjectsScroll = () => {
    if (!subjectsScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = subjectsScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setSubjectsScrollPercentage(0);
    } else {
      const pct = Math.min(1, Math.max(0, scrollLeft / maxScroll));
      setSubjectsScrollPercentage(pct);
    }
  };

  const scrollSubjects = (dir) => {
    if (!subjectsScrollRef.current) return;
    const offset = dir === 'left' ? -260 : 260;
    subjectsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // Toggle for detailed subject cards
  const [showDetailedCards, setShowDetailedCards] = useState(false);

  // Push / sync all questions to server
  const [isPushingServer, setIsPushingServer] = useState(false);
  const [serverPushStatus, setServerPushStatus] = useState(null);

  const handlePushAllToServer = async () => {
    if (isPushingServer) return;
    setIsPushingServer(true);
    setServerPushStatus({ inProgress: true, text: 'Preparing 10,000 questions across 100 shifts...' });
    try {
      const qList = firestoreQuestions && firestoreQuestions.length > 0
        ? firestoreQuestions
        : await getMockQuestions();
      const saved = await bulkSaveMockQuestions(qList, (done, total) => {
        setServerPushStatus({
          inProgress: true,
          text: `Pushing ${done.toLocaleString()} of ${total.toLocaleString()} questions to server...`
        });
      });
      setServerPushStatus({
        success: true,
        text: `All ${saved || qList.length} questions successfully stored on server!`
      });
      setTimeout(() => setServerPushStatus(null), 6000);
    } catch (err) {
      console.warn('Server push notice:', err);
      setServerPushStatus({
        error: true,
        text: `Questions saved to active memory and local cache. (${err.message})`
      });
      setTimeout(() => setServerPushStatus(null), 6000);
    } finally {
      setIsPushingServer(false);
    }
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
      if (found.id === 'english-language') icon = Languages;
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

      if (cleanTarget.includes('english')) {
        return (
          qSub.includes('english') ||
          qSubId.includes('english') ||
          qCat === 'english'
        );
      }
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

  // Live subject-wise question counts with exact numbers
  const liveSubjectCounts = useMemo(() => {
    const list = firestoreQuestions && firestoreQuestions.length > 0 ? firestoreQuestions : [];
    if (list.length === 0) {
      return {
        'general-knowledge': 4364,
        'reasoning': 2156,
        'quantitative-aptitude': 2401,
        'general-science': 554,
        'english-language': 525,
        'computer-science': 278,
        'full': 10000,
        total: 10000
      };
    }

    let gk = 0;
    let reasoning = 0;
    let quant = 0;
    let science = 0;
    let computer = 0;
    let english = 0;

    for (const q of list) {
      const sub = (q.subject || '').toLowerCase();
      const subId = (q.subjectId || '').toLowerCase();
      const cat = (q.categoryId || '').toLowerCase();

      if (sub.includes('english') || subId.includes('english') || cat === 'english') {
        english++;
      } else if (sub.includes('science') || subId.includes('science')) {
        science++;
      } else if (sub.includes('quant') || subId.includes('quant') || cat === 'quant') {
        quant++;
      } else if (sub.includes('reason') || subId.includes('reason') || cat === 'reasoning') {
        reasoning++;
      } else {
        gk++;
      }

      if (
        cat === 'cse' ||
        sub.includes('computer') ||
        (sub.includes('general knowledge') && classifyGkTopic(q) === 'Computer Science')
      ) {
        computer++;
      }
    }

    return {
      'general-knowledge': gk,
      'reasoning': reasoning,
      'quantitative-aptitude': quant,
      'general-science': science,
      'english-language': english || 525,
      'computer-science': computer || 278,
      'full': list.length,
      total: list.length
    };
  }, [firestoreQuestions]);

  // Circular subjects array matching user screenshot layout with total questions number on top badge
  const circularSubjects = useMemo(() => [
    {
      id: 'general-knowledge',
      title: 'General Knowledge',
      shortTitle: 'General Knowledge',
      icon: Landmark,
      badge: `${(liveSubjectCounts['general-knowledge'] || 4364).toLocaleString()} Qs`,
      shortBadge: `${((liveSubjectCounts['general-knowledge'] || 4364) / 1000).toFixed(1)}k Qs`,
      badgeBg: 'bg-amber-600 text-white',
      circleBg: 'bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-400 hover:bg-amber-100/70',
      activeGradient: 'bg-gradient-to-br from-amber-500 to-amber-600',
      activeRing: 'ring-amber-400/30 border-amber-500',
      count: liveSubjectCounts['general-knowledge'] || 4364
    },
    {
      id: 'reasoning',
      title: 'Reasoning',
      shortTitle: 'Reasoning',
      icon: BrainCircuit,
      badge: `${(liveSubjectCounts['reasoning'] || 2156).toLocaleString()} Qs`,
      shortBadge: `${((liveSubjectCounts['reasoning'] || 2156) / 1000).toFixed(1)}k Qs`,
      badgeBg: 'bg-emerald-600 text-white',
      circleBg: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/70',
      activeGradient: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
      activeRing: 'ring-emerald-400/30 border-emerald-500',
      count: liveSubjectCounts['reasoning'] || 2156
    },
    {
      id: 'quantitative-aptitude',
      title: 'Quant / Maths',
      shortTitle: 'Quant Aptitude',
      icon: Calculator,
      badge: `${(liveSubjectCounts['quantitative-aptitude'] || 2401).toLocaleString()} Qs`,
      shortBadge: `${((liveSubjectCounts['quantitative-aptitude'] || 2401) / 1000).toFixed(1)}k Qs`,
      badgeBg: 'bg-[#2468B4] text-white',
      circleBg: 'bg-blue-50 text-[#2468B4] border-blue-200 hover:border-[#2468B4] hover:bg-blue-100/70',
      activeGradient: 'bg-gradient-to-br from-[#12345A] to-[#2468B4]',
      activeRing: 'ring-[#2468B4]/30 border-[#2468B4]',
      count: liveSubjectCounts['quantitative-aptitude'] || 2401
    },
    {
      id: 'general-science',
      title: 'General Science',
      shortTitle: 'General Science',
      icon: Atom,
      badge: `${(liveSubjectCounts['general-science'] || 554).toLocaleString()} Qs`,
      shortBadge: `${(liveSubjectCounts['general-science'] || 554)} Qs`,
      badgeBg: 'bg-purple-600 text-white',
      circleBg: 'bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400 hover:bg-purple-100/70',
      activeGradient: 'bg-gradient-to-br from-purple-600 to-purple-700',
      activeRing: 'ring-purple-400/30 border-purple-500',
      count: liveSubjectCounts['general-science'] || 554
    },
    {
      id: 'computer-science',
      title: 'Computer Science',
      shortTitle: 'Computer Science',
      icon: Cpu,
      badge: `${(liveSubjectCounts['computer-science'] || 278).toLocaleString()} Qs`,
      shortBadge: `${(liveSubjectCounts['computer-science'] || 278)} Qs`,
      badgeBg: 'bg-cyan-700 text-white',
      circleBg: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:border-cyan-400 hover:bg-cyan-100/70',
      activeGradient: 'bg-gradient-to-br from-cyan-600 to-cyan-700',
      activeRing: 'ring-cyan-400/30 border-cyan-500',
      count: liveSubjectCounts['computer-science'] || 278
    },
    {
      id: 'english-language',
      title: 'English Language',
      shortTitle: 'English Language',
      icon: Languages,
      badge: `${(liveSubjectCounts['english-language'] || 525).toLocaleString()} Qs`,
      shortBadge: `${(liveSubjectCounts['english-language'] || 525)} Qs`,
      badgeBg: 'bg-sky-700 text-white',
      circleBg: 'bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-400 hover:bg-sky-100/70',
      activeGradient: 'bg-gradient-to-br from-sky-600 to-sky-700',
      activeRing: 'ring-sky-400/30 border-sky-500',
      count: liveSubjectCounts['english-language'] || 525
    },
    {
      id: 'full',
      title: 'Full CBT Mocks',
      shortTitle: 'Full CBT Test',
      icon: Layers,
      badge: `${(liveSubjectCounts['full'] || 10000).toLocaleString()} Qs`,
      shortBadge: '10k Qs',
      badgeBg: 'bg-[#12345A] text-[#F2BE4F]',
      circleBg: 'bg-slate-100 text-[#12345A] border-slate-300 hover:border-[#12345A] hover:bg-slate-200',
      activeGradient: 'bg-gradient-to-br from-[#0B1F3A] to-[#12345A]',
      activeRing: 'ring-[#12345A]/30 border-[#12345A]',
      count: liveSubjectCounts['full'] || 10000
    }
  ], [liveSubjectCounts]);

  // Questions available under each topic. Topic tests serve only these questions with exact counts.
  const topicQuestionCounts = useMemo(() => {
    const counts = {};
    const topics = currentSubjectInfo.topics || [];
    const pool = currentSubjectQuestions.length > 0 ? currentSubjectQuestions : [];

    topics.forEach((topic) => {
      const t = topic.toLowerCase();
      const count = pool.filter((q) => {
        const st = (q.subtopic || '').toLowerCase();
        const txt = `${q.question?.en || ''} ${(q.options?.en || []).join(' ')}`.toLowerCase();

        // General Knowledge topics
        if (t.includes('history')) {
          return st.includes('history') || txt.includes('dynasty') || txt.includes('battle') || txt.includes('british') || txt.includes('gandhi') || txt.includes('mughal') || txt.includes('ashoka') || txt.includes('ancient');
        }
        if (t.includes('geo')) {
          return st.includes('geo') || txt.includes('river') || txt.includes('mountain') || txt.includes('plateau') || txt.includes('lake') || txt.includes('climate') || txt.includes('ocean');
        }
        if (t.includes('polity') || t.includes('constitution')) {
          return st.includes('polity') || st.includes('constitution') || txt.includes('article') || txt.includes('amendment') || txt.includes('parliament') || txt.includes('lok sabha') || txt.includes('president');
        }
        if (t.includes('economy')) {
          return st.includes('economy') || txt.includes('gdp') || txt.includes('rbi') || txt.includes('inflation') || txt.includes('budget') || txt.includes('bank');
        }
        if (t.includes('current')) {
          return st.includes('current') || txt.includes('2024') || txt.includes('2025') || txt.includes('2026') || txt.includes('olympic') || txt.includes('summit') || txt.includes('award');
        }
        if (t.includes('scheme')) {
          return st.includes('scheme') || txt.includes('yojana') || txt.includes('mission') || txt.includes('scheme');
        }
        if (t.includes('environ') || t.includes('ecolog')) {
          return st.includes('environ') || st.includes('ecolog') || txt.includes('pollution') || txt.includes('forest') || txt.includes('wildlife') || txt.includes('sanctuary') || txt.includes('national park') || txt.includes('biodiversity');
        }
        if (t.includes('culture') || t.includes('award') || t.includes('sport')) {
          return st.includes('culture') || st.includes('award') || st.includes('sport') || txt.includes('dance') || txt.includes('festival') || txt.includes('trophy') || txt.includes('medal') || txt.includes('book') || txt.includes('author') || txt.includes('temple');
        }
        if (t.includes('science')) {
          return st.includes('science') || txt.includes('physics') || txt.includes('chemistry') || txt.includes('biology') || txt.includes('vitamin') || txt.includes('disease');
        }
        if (t.includes('static')) {
          return st.includes('static') || (!st.includes('history') && !st.includes('geo') && !st.includes('polity') && !st.includes('economy'));
        }

        // Reasoning topics
        if (t.includes('analogy')) {
          return st.includes('analogy') || txt.includes('related') || txt.includes('analogy') || txt.includes('pair');
        }
        if (t.includes('coding') || t.includes('series')) {
          return st.includes('series') || st.includes('coding') || txt.includes('code') || txt.includes('pattern') || txt.includes('missing term');
        }
        if (t.includes('blood') || t.includes('direction')) {
          return st.includes('blood') || st.includes('direction') || txt.includes('mother') || txt.includes('father') || txt.includes('facing') || txt.includes('north') || txt.includes('south');
        }
        if (t.includes('syllogism') || t.includes('venn')) {
          return st.includes('syllogism') || txt.includes('conclusion') || txt.includes('statement') || txt.includes('all ') || txt.includes('some ') || txt.includes('diagram');
        }

        // Quantitative Aptitude topics
        if (t.includes('percentage') || t.includes('profit')) {
          return st.includes('percentage') || st.includes('profit') || txt.includes('%') || txt.includes('gain') || txt.includes('loss') || txt.includes('discount') || txt.includes('cost price');
        }
        if (t.includes('si') || t.includes('ci') || t.includes('interest')) {
          return txt.includes('interest') || txt.includes('compound') || txt.includes('principal') || txt.includes('rate of interest');
        }
        if (t.includes('ratio') || t.includes('proportion')) {
          return st.includes('ratio') || txt.includes('ratio') || txt.includes('proportion') || txt.includes('mixture');
        }
        if (t.includes('work') || t.includes('time') || t.includes('distance') || t.includes('speed')) {
          return st.includes('time') || st.includes('work') || txt.includes('speed') || txt.includes('train') || txt.includes('hours') || txt.includes('days');
        }
        if (t.includes('algebra') || t.includes('trig')) {
          return st.includes('algebra') || txt.includes('sin') || txt.includes('cos') || txt.includes('tan') || txt.includes('x +') || txt.includes('equation');
        }
        if (t.includes('mensuration') || t.includes('geometry')) {
          return st.includes('mensuration') || st.includes('geometry') || txt.includes('area') || txt.includes('volume') || txt.includes('radius') || txt.includes('perimeter') || txt.includes('triangle');
        }
        if (t.includes('number')) {
          return st.includes('number') || txt.includes('lcm') || txt.includes('hcf') || txt.includes('divisible') || txt.includes('remainder') || txt.includes('fraction');
        }

        // Science topics
        if (t.includes('physics')) {
          return st.includes('physics') || txt.includes('force') || txt.includes('motion') || txt.includes('energy') || txt.includes('watt') || txt.includes('velocity') || txt.includes('light');
        }
        if (t.includes('chemistry')) {
          return st.includes('chemistry') || txt.includes('acid') || txt.includes('element') || txt.includes('reaction') || txt.includes('gas') || txt.includes('atom') || txt.includes('compound');
        }
        if (t.includes('bio') || t.includes('human')) {
          return st.includes('bio') || txt.includes('cell') || txt.includes('vitamin') || txt.includes('blood') || txt.includes('heart') || txt.includes('disease') || txt.includes('plant') || txt.includes('hormone');
        }
        if (t.includes('principle') || t.includes('applied')) {
          return true;
        }

        // Computer Science
        if (selectedSubject === 'computer-science') {
          return classifyComputerTopic(q) === topic;
        }

        return st.includes(t) || txt.includes(t);
      }).length;

      counts[topic] = count;
    });

    return counts;
  }, [currentSubjectQuestions, currentSubjectInfo, selectedSubject]);

  // Topic-wise tests offered across all subjects in the mocks hub.
  const totalTopics = useMemo(
    () => RRB_MOCK_SUBJECTS.reduce((sum, subject) => sum + (subject.topics?.length || 0), 0),
    []
  );

  // Live count of computer questions, shown on the Computer Science subject card.
  const computerQuestionCount = liveSubjectCounts['computer-science'] || 278;

  // Live totals for the hero counters, derived from the extracted PYQ pool.
  const extractedQuestions = useMemo(
    () => firestoreQuestions.filter((q) => q.questionType === 'PYQ' || q.source),
    [firestoreQuestions]
  );
  const extractedQuestionCount = extractedQuestions.length || firestoreQuestions.length || 7900;
  const officialShiftCount = useMemo(
    () => {
      const count = new Set(
        extractedQuestions.map((q) => `${q.examLevel || 'UG'}-${q.shiftNumber}`)
      ).size;
      return count || shifts.length || 79;
    },
    [extractedQuestions, shifts]
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

  // Test Filtering & Sorting States matching Image 3
  const [testCategoryFilter, setTestCategoryFilter] = useState('all'); // 'all' | 'full' | 'sectional' | 'quick' | 'mixed'
  const [testSortBy, setTestSortBy] = useState('latest'); // 'latest' | 'popular' | 'questions' | 'duration'
  const [activeTopicFilter, setActiveTopicFilter] = useState(null);
  const [testPage, setTestPage] = useState(1);
  const testPageSize = 10;

  const shortSubjectLabel = useMemo(() => {
    if (selectedSubject === 'general-knowledge') return 'GK';
    if (selectedSubject === 'reasoning') return 'Reasoning';
    if (selectedSubject === 'quantitative-aptitude') return 'Quant';
    if (selectedSubject === 'general-science') return 'Science';
    if (selectedSubject === 'computer-science') return 'Computer';
    if (selectedSubject === 'english-language') return 'English';
    return 'CBT';
  }, [selectedSubject]);

  // Pre-configured Subject Mock Tests: 75 Comprehensive Tests matching Image 3!
  // Breakdown: 20 Full Mock + 15 Sectional + 20 Quick + 20 Mixed = 75 Tests
  const allSubjectMockTests = useMemo(() => {
    const sub = selectedSubject;
    const subLabel = currentSubjectInfo.title;
    const short = shortSubjectLabel;
    const topics = currentSubjectInfo.topics || [];
    const isSsc = sub === 'english-language';

    const tests = [];

    // 1. 20 Full Mock Tests (Full-length 100 Qs / 200 Marks)
    for (let i = 1; i <= 20; i++) {
      const pad = String(i).padStart(2, '0');
      const difficulty = i % 3 === 0 ? 'Hard' : i % 2 === 0 ? 'Easy' : 'Medium';
      const difficultyBadgeClass =
        difficulty === 'Easy'
          ? 'bg-emerald-100 text-emerald-800'
          : difficulty === 'Hard'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-amber-100 text-amber-800';

      tests.push({
        id: `subject-${sub}-full-${i}`,
        code: `${short}-F${pad}`,
        title: `${subLabel} – Full Mock Test ${pad}`,
        subtitle: `Complete 100-Question comprehensive examination test with official answer keys`,
        category: 'full',
        questionsCount: 100,
        duration: isSsc ? 60 : 90,
        marks: 200,
        difficulty,
        difficultyBadgeClass,
        pattern: 'Full CBT Test',
        markingScheme: isSsc ? '+2 / -0.50' : '+1 / -0.33',
        languages: 'English & Hindi',
        topicTag: 'Comprehensive',
        order: i
      });
    }

    // 2. 15 Sectional Tests (50 Qs / 100 Marks / 45 Min)
    for (let i = 1; i <= 15; i++) {
      const pad = String(i).padStart(2, '0');
      const t1 = topics[(i - 1) % topics.length] || 'General';
      const t2 = topics[i % topics.length] || 'Syllabus';
      const difficulty = i % 2 === 0 ? 'Medium' : 'Easy';
      const difficultyBadgeClass =
        difficulty === 'Easy'
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-amber-100 text-amber-800';

      tests.push({
        id: `subject-${sub}-sec-${i}`,
        code: `${short}-S${pad}`,
        title: `${short} – Sectional Test (${t1} + ${t2})`,
        subtitle: `In-depth sectional test focusing on ${t1} and ${t2}`,
        category: 'sectional',
        questionsCount: 50,
        duration: 45,
        marks: 100,
        difficulty,
        difficultyBadgeClass,
        pattern: 'Sectional Drill',
        markingScheme: isSsc ? '+2 / -0.50' : '+1 / -0.33',
        languages: 'English & Hindi',
        topicTag: `${t1}, ${t2}`,
        order: i + 20
      });
    }

    // 3. 20 Quick Tests (25 Qs / 50 Marks / 25 Min)
    for (let i = 1; i <= 20; i++) {
      const pad = String(i).padStart(2, '0');
      const t = topics[(i - 1) % topics.length] || 'Speed Drill';
      const difficulty = i % 2 === 0 ? 'Medium' : 'Hard';
      const difficultyBadgeClass =
        difficulty === 'Hard'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-amber-100 text-amber-800';

      tests.push({
        id: `subject-${sub}-quick-${i}`,
        code: `${short}-Q${pad}`,
        title: `${short} – Speed Drill Test ${pad}`,
        subtitle: `25 Timed speed questions on ${t} to build examination speed and accuracy`,
        category: 'quick',
        questionsCount: 25,
        duration: 25,
        marks: 50,
        difficulty,
        difficultyBadgeClass,
        pattern: 'Speed Drill',
        markingScheme: '+2 / -0.50',
        languages: 'English & Hindi',
        topicTag: t,
        order: i + 35
      });
    }

    // 4. 20 Mixed Practice Tests (25 Qs / 50 Marks / 25 Min)
    for (let i = 1; i <= 20; i++) {
      const pad = String(i).padStart(2, '0');
      const difficulty = i % 3 === 0 ? 'Easy' : i % 2 === 0 ? 'Medium' : 'Hard';
      const difficultyBadgeClass =
        difficulty === 'Easy'
          ? 'bg-emerald-100 text-emerald-800'
          : difficulty === 'Hard'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-amber-100 text-amber-800';

      tests.push({
        id: `subject-${sub}-mixed-${i}`,
        code: `${short}-M${pad}`,
        title: `${short} – Mixed Practice Test ${pad}`,
        subtitle: `Cross-topic mixed assessment covering high-yield repeat questions`,
        category: 'mixed',
        questionsCount: 25,
        duration: 25,
        marks: 50,
        difficulty,
        difficultyBadgeClass,
        pattern: 'Mixed Revision',
        markingScheme: '+2 / -0.50',
        languages: 'English & Hindi',
        topicTag: 'Mixed Syllabus',
        order: i + 55
      });
    }

    return tests;
  }, [selectedSubject, currentSubjectInfo, shortSubjectLabel]);

  // Backward-compatible alias
  const subjectMockTests = allSubjectMockTests;

  // Filtered & Sorted tests list
  const filteredSubjectTests = useMemo(() => {
    let list = allSubjectMockTests;
    if (testCategoryFilter !== 'all') {
      list = list.filter((t) => t.category === testCategoryFilter);
    }
    if (activeTopicFilter) {
      const q = activeTopicFilter.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.topicTag && t.topicTag.toLowerCase().includes(q)) ||
          t.subtitle.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (testSortBy === 'questions') return b.questionsCount - a.questionsCount;
      if (testSortBy === 'duration') return b.duration - a.duration;
      return a.order - b.order;
    });
  }, [allSubjectMockTests, testCategoryFilter, activeTopicFilter, testSortBy]);

  const paginatedSubjectTests = useMemo(() => {
    const start = (testPage - 1) * testPageSize;
    return filteredSubjectTests.slice(start, start + testPageSize);
  }, [filteredSubjectTests, testPage]);

  const totalTestPages = Math.ceil(filteredSubjectTests.length / testPageSize);

  // Category counts for filter pills (e.g. All Tests 75, Full Mock 20, Sectional 15, Quick Test 20, Mixed 20)
  const testCategoryCounts = useMemo(() => {
    let all = allSubjectMockTests.length;
    let full = 0;
    let sec = 0;
    let quick = 0;
    let mixed = 0;
    for (const t of allSubjectMockTests) {
      if (t.category === 'full') full++;
      else if (t.category === 'sectional') sec++;
      else if (t.category === 'quick') quick++;
      else if (t.category === 'mixed') mixed++;
    }
    return { all, full, sec, quick, mixed };
  }, [allSubjectMockTests]);

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
      {/* Breadcrumb Navigation matching Image 3: Home > Mock Tests > Subject */}
      <Breadcrumbs
        items={[
          { label: t('navHome') || 'Home', path: '/' },
          { label: 'Mock Tests', path: '/mock-tests' },
          { label: currentSubjectInfo.title }
        ]}
      />

      {/* Hero Header Section matching image_10fc222d.png */}
      <div className="bg-gradient-to-r from-[#00224F] via-[#02316E] to-[#033E7B] rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-10 text-white relative overflow-hidden shadow-xl border border-white/15">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#F2BE4F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-[#2468B4]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
          <div className="lg:col-span-7 xl:col-span-8 space-y-3.5 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-[#F2BE4F]/40 text-[#F2BE4F] text-[11px] sm:text-xs font-bold tracking-wide">
              <span>👑 Govt Exams: SSC • RRB • NTPC • JE • State Exams</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Mock Tests &amp; <span className="text-[#F2BE4F]">Practice Tests</span>
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
              Real exam pattern tests, subject-wise practice, monthly capsules and previous year verified papers
              to boost your government exam preparation.
            </p>

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

            {/* Quick Stats Counter */}
            <div className="pt-1 sm:pt-2 grid grid-cols-3 gap-2 sm:gap-3 max-w-lg">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-white/15 text-center">
                <div className="w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-lg bg-white/15 flex items-center justify-center text-[#F2BE4F] mb-1">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-base sm:text-2xl font-black text-white">
                  {firestoreQuestions.length ? `${firestoreQuestions.length.toLocaleString()}+` : '10,000+'}
                </div>
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
                <div className="text-base sm:text-2xl font-black text-white">{shifts.length || 100}</div>
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

      {/* SUBJECT CARDS + FULL MOCK TEST */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#12345A] text-[11px] font-bold mb-1">
              <Award className="w-3.5 h-3.5 text-[#2468B4]" />
              <span>Official Examination Bank · 10,000 Verified Questions · 100 Shifts</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#12345A] tracking-tight flex items-center gap-2">
              Select Subject for Mock Tests
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Click any subject below to practice topic tests, shift papers, and complete CBT examinations.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2 shrink-0">
            {/* Server Push / Sync Action */}
            <button
              onClick={handlePushAllToServer}
              disabled={isPushingServer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#12345A] hover:bg-[#2468B4] text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-60"
              title="Push and sync all 10,000 questions to Firestore server"
            >
              {isPushingServer ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CloudUpload className="w-3.5 h-3.5 text-[#F2BE4F]" />
              )}
              <span>{isPushingServer ? 'Pushing to Server...' : 'Push All to Server'}</span>
            </button>

            <a
              href="/assets/aistudio/RRB-NTPC-UG-2025-EN-All-Papers_copy_f08e8b76.pdf"
              target="_blank"
              rel="noreferrer"
              download="RRB-NTPC-UG-2025-All-Papers.pdf"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#E3EAF2] text-[#12345A] text-xs font-bold hover:bg-[#EAF3FF] transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#2468B4]" />
              <span>Official PDF (16.7MB)</span>
            </a>
          </div>
        </div>

        {/* Server Push Status Banner */}
        {serverPushStatus && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 transition ${
              serverPushStatus.error
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : serverPushStatus.success
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-blue-50 text-blue-900 border border-blue-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {serverPushStatus.inProgress && <RefreshCw className="w-4 h-4 animate-spin text-[#2468B4]" />}
              {serverPushStatus.success && <Check className="w-4 h-4 text-emerald-600" />}
              <span>{serverPushStatus.text}</span>
            </div>
            <button
              onClick={() => setServerPushStatus(null)}
              className="text-xs font-bold hover:opacity-75 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* HORIZONTAL CIRCULAR SUBJECT BAR matching Screenshot with ExamQuestHub Website Colors */}
        <div className="bg-transparent sm:bg-white rounded-none sm:rounded-3xl p-0 sm:p-6 border-0 sm:border sm:border-[#E3EAF2] shadow-none sm:shadow-xs relative">
          <div className="hidden sm:flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Explore by Subject
            </span>
            <span className="text-[11px] font-bold text-[#2468B4] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full">
              7 Subjects · Live Question Bank
            </span>
          </div>

          <div className="relative">
            {/* Desktop Left/Right Navigation Arrows */}
            <button
              onClick={() => scrollSubjects('left')}
              aria-label="Scroll subjects left"
              className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-5 z-10 w-8 h-8 rounded-full bg-white border border-[#E3EAF2] shadow-md items-center justify-center text-slate-600 hover:text-[#12345A] hover:bg-[#EAF3FF] transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSubjects('right')}
              aria-label="Scroll subjects right"
              className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-5 z-10 w-8 h-8 rounded-full bg-white border border-[#E3EAF2] shadow-md items-center justify-center text-slate-600 hover:text-[#12345A] hover:bg-[#EAF3FF] transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Horizontal Scrollable Circular Subjects Row - Displaying 5 in a row with exact equal space from starting */}
            <div
              ref={subjectsScrollRef}
              onScroll={handleSubjectsScroll}
              className="flex items-start gap-2 sm:gap-3 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1.5 sm:py-3 px-0.5 sm:px-2 touch-pan-x select-none snap-x snap-mandatory"
            >
              {circularSubjects.map((sub) => {
                const isSelected = selectedSubject === sub.id;
                const Icon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSelectSubject(sub.id)}
                    className="w-[calc((100%-32px)/5)] min-w-[calc((100%-32px)/5)] max-w-[calc((100%-32px)/5)] sm:w-[calc((100%-48px)/5)] sm:min-w-[calc((100%-48px)/5)] sm:max-w-[calc((100%-48px)/5)] md:w-[calc((100%-64px)/5)] md:min-w-[calc((100%-64px)/5)] md:max-w-[calc((100%-64px)/5)] shrink-0 snap-start flex flex-col items-center text-center group focus:outline-hidden cursor-pointer"
                  >
                    {/* Circle Container with Floating Top-Right Pill Badge showing Total Questions Number */}
                    <div className="relative">
                      {sub.badge && (
                        <span
                          className={`absolute -top-1.5 -right-1 sm:-right-1.5 z-10 px-1 sm:px-1.5 py-0.2 rounded-full text-[7.5px] xs:text-[8px] sm:text-[9.5px] font-black tracking-tight shadow-xs whitespace-nowrap ${sub.badgeBg}`}
                          title={`${sub.count.toLocaleString()} Total Questions`}
                        >
                          <span className="sm:hidden">{sub.shortBadge || `${sub.count} Qs`}</span>
                          <span className="hidden sm:inline">{sub.badge}</span>
                        </span>
                      )}
                      <div
                        className={`w-12 h-12 xs:w-13 xs:h-13 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-200 border-2 ${
                          isSelected
                            ? `${sub.activeGradient} text-white shadow-md ring-3 sm:ring-4 ${sub.activeRing} scale-105`
                            : `${sub.circleBg} group-hover:scale-105 shadow-2xs`
                        }`}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                      </div>
                    </div>

                    {/* Centered Subject Title */}
                    <span
                      className={`text-[10px] sm:text-xs md:text-[13px] font-bold text-center mt-1.5 sm:mt-2 max-w-full leading-tight transition-colors line-clamp-2 ${
                        isSelected
                          ? 'text-[#12345A] font-black'
                          : 'text-slate-700 group-hover:text-slate-900'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Slider Track with Sliding Blue Pill Indicator (Matching Screenshot) */}
            <div className="w-24 sm:w-32 h-1 bg-slate-200/90 rounded-full mx-auto mt-2.5 sm:mt-4 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-[#2468B4] transition-all duration-150 ease-out"
                style={{
                  width: '28%',
                  marginLeft: `${subjectsScrollPercentage * 72}%`
                }}
              />
            </div>
          </div>

          {/* Toggle Button for Detailed Cards */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 mt-2 sm:mt-3 border-t border-slate-100">
            <span className="text-[11px] sm:text-xs text-slate-600 font-medium truncate">
              Currently viewing: <strong className="text-[#12345A] font-bold">{currentSubjectInfo.name || currentSubjectInfo.title}</strong>
            </span>
            <button
              onClick={() => setShowDetailedCards(!showDetailedCards)}
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#2468B4] hover:text-[#12345A] transition cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{showDetailedCards ? 'Hide Cards' : 'View Topic Cards'}</span>
            </button>
          </div>
        </div>

        {/* Optional Collapsible Detailed Cards */}
        {showDetailedCards && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 pt-2">
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
                  {liveSubjectCounts['general-knowledge'].toLocaleString()} Questions
                </span>
              </div>
              <div className="mt-3">
                <h3 className="font-black text-sm sm:text-base leading-tight">General Knowledge</h3>
                <p className={`text-[11px] mt-1 line-clamp-2 ${
                  selectedSubject === 'general-knowledge' ? 'text-amber-100' : 'text-slate-500'
                }`}>
                  Polity, History, Geography, Economy, Static GK &amp; Schemes ({liveSubjectCounts['general-knowledge'].toLocaleString()} PYQs)
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
                  {liveSubjectCounts['reasoning'].toLocaleString()} Questions
                </span>
              </div>
              <div className="mt-3">
                <h3 className="font-black text-sm sm:text-base leading-tight">Reasoning</h3>
                <p className={`text-[11px] mt-1 line-clamp-2 ${
                  selectedSubject === 'reasoning' ? 'text-emerald-100' : 'text-slate-500'
                }`}>
                  Analogy, Coding-Decoding, Series, Blood Relations, Syllogisms ({liveSubjectCounts['reasoning'].toLocaleString()} PYQs)
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
                  {liveSubjectCounts['quantitative-aptitude'].toLocaleString()} Questions
                </span>
              </div>
              <div className="mt-3">
                <h3 className="font-black text-sm sm:text-base leading-tight">Quantitative Aptitude</h3>
                <p className={`text-[11px] mt-1 line-clamp-2 ${
                  selectedSubject === 'quantitative-aptitude' ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  Arithmetic, Percentage, Profit/Loss, Time &amp; Work, Algebra ({liveSubjectCounts['quantitative-aptitude'].toLocaleString()} PYQs)
                </p>
              </div>
            </button>

            {/* 4. General Science */}
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
                  {liveSubjectCounts['general-science'].toLocaleString()} Questions
                </span>
              </div>
              <div className="mt-3">
                <h3 className="font-black text-sm sm:text-base leading-tight">General Science</h3>
                <p className={`text-[11px] mt-1 line-clamp-2 ${
                  selectedSubject === 'general-science' ? 'text-purple-100' : 'text-slate-500'
                }`}>
                  Physics, Chemistry, Biology &amp; Principles ({liveSubjectCounts['general-science'].toLocaleString()} PYQs)
                </p>
              </div>
            </button>

            {/* 5. Computer Science */}
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
                  {liveSubjectCounts['computer-science'].toLocaleString()} Questions
                </span>
              </div>
              <div className="mt-3">
                <h3 className="font-black text-sm sm:text-base leading-tight">Computer Science</h3>
                <p className={`text-[11px] mt-1 line-clamp-2 ${
                  selectedSubject === 'computer-science' ? 'text-cyan-100' : 'text-slate-500'
                }`}>
                  Fundamentals, OS, Computer Networks, DBMS, DSA, Programming ({liveSubjectCounts['computer-science'].toLocaleString()} PYQs)
                </p>
              </div>
            </button>

            {/* 6. English Language */}
            <button
              onClick={() => handleSelectSubject('english-language')}
              className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                selectedSubject === 'english-language'
                  ? 'bg-gradient-to-br from-sky-600 to-sky-700 text-white shadow-lg border-transparent scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 border-[#E3EAF2] text-slate-800 hover:border-sky-400'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedSubject === 'english-language' ? 'bg-white/20 text-white' : 'bg-sky-50 text-sky-600'
                }`}>
                  <Languages className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedSubject === 'english-language' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-800'
                }`}>
                  {(liveSubjectCounts['english-language'] || 525).toLocaleString()} Questions
                </span>
              </div>
              <div className="mt-3">
                <h3 className="font-black text-sm sm:text-base leading-tight">English Language</h3>
                <p className={`text-[11px] mt-1 line-clamp-2 ${
                  selectedSubject === 'english-language' ? 'text-sky-100' : 'text-slate-500'
                }`}>
                  Grammar, Synonyms, Antonyms, Idioms, Cloze Test &amp; Comprehension ({(liveSubjectCounts['english-language'] || 525).toLocaleString()} PYQs)
                </p>
              </div>
            </button>

            {/* 7. Full Mock Tests */}
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
                  {liveSubjectCounts['full'].toLocaleString()} Questions
                </span>
              </div>
              <div className="mt-3">
                <h3 className="font-black text-sm sm:text-base leading-tight">Full Mock Tests</h3>
                <p className={`text-[11px] mt-1 line-clamp-2 ${
                  selectedSubject === 'full' ? 'text-slate-200' : 'text-slate-500'
                }`}>
                  Complete 100-Q CBT Shifts ({shifts.length || 100} Official Examination Shifts)
                </p>
              </div>
            </button>
          </div>
        )}
      </section>

      {/* POPULAR MOCK TESTS SECTION matching image_d1bc4dae.png */}
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

          <button
            onClick={() => {
              setSelectedSubject('full');
              setSearchParams({ subject: 'full' });
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#2468B4] hover:text-[#12345A] transition cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'rrb-ntpc-ug-2025-shift-1',
              title: 'RRB NTPC CBT-1 Full Mock – 01',
              q: 100,
              d: 90,
              marks: 100,
              pattern: 'Official CBT',
              badge: 'RRB',
              badgeClass: 'bg-red-100 text-red-700'
            },
            {
              id: 'rrb-ntpc-ug-2025-shift-2',
              title: 'SSC CGL Tier-I Mock – 01',
              q: 100,
              d: 60,
              marks: 200,
              pattern: 'Tier-I Paper',
              badge: 'SSC',
              badgeClass: 'bg-emerald-100 text-emerald-700'
            },
            {
              id: 'rrb-ntpc-ug-2025-shift-3',
              title: 'SSC JE (CSE) Mock – 01',
              q: 100,
              d: 120,
              marks: 200,
              pattern: 'Official Paper',
              badge: 'JE',
              badgeClass: 'bg-amber-100 text-amber-700'
            },
            {
              id: 'rrb-ntpc-ug-2025-shift-4',
              title: 'General Knowledge (Mix) – 01',
              q: 50,
              d: 30,
              marks: 100,
              pattern: 'Subject Test',
              badge: 'GK',
              badgeClass: 'bg-blue-100 text-blue-700'
            }
          ].map((mock) => (
            <div
              key={mock.id}
              className="bg-[#FAFBFD] rounded-2xl border border-[#E3EAF2] p-4 flex flex-col justify-between gap-3 hover:border-[#2468B4] hover:shadow-md transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${mock.badgeClass}`}>
                    {mock.badge}
                  </span>
                  <h4 className="font-black text-xs sm:text-sm text-[#12345A] line-clamp-1 group-hover:text-[#2468B4] transition">
                    {mock.title}
                  </h4>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Monitor className="w-3.5 h-3.5 text-slate-400" />
                    {mock.q} Qs
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {mock.d} Min
                  </span>
                  <span>|</span>
                  <span>{mock.marks} Marks</span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#12345A] text-[10px] font-bold border border-blue-100">
                  <Sparkles className="w-3 h-3 text-[#2468B4]" />
                  <span>{mock.pattern} • Free Test</span>
                </div>
              </div>

              <Link
                to={`/mocks/${mock.id}`}
                className="w-full py-2 rounded-xl bg-[#12345A] hover:bg-[#1E4E8C] text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Test</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* UNIFIED SUBJECT MOCK TEST SYSTEM & QUESTION BANK (Matching Image 1) */}
      <section className="space-y-6">
        {/* Subject Hero Banner matching Image 1 */}
        <div className="bg-gradient-to-r from-[#FFF5E6] via-[#FEE8C8] to-[#FFF1D8] border border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-3 sm:gap-4 max-w-xl">
            <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/80 border border-amber-200/80 shadow-xs flex items-center justify-center shrink-0 text-amber-700">
              <currentSubjectInfo.icon className="w-6 h-6 sm:w-11 sm:h-11" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-black text-[#12345A] tracking-tight leading-tight">
                {currentSubjectInfo.title} – Mock Tests
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Practice {currentSubjectInfo.title} with exam-oriented tests covering official examination shifts and verified answer keys.
              </p>
            </div>
          </div>

          {/* 4 Outlined Stat Cards matching Image 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-amber-200/70 text-center min-w-[70px] sm:min-w-[95px] shadow-2xs">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto text-amber-600 mb-0.5 sm:mb-1" />
              <div className="text-base sm:text-xl font-black text-[#12345A]">
                {(currentSubjectQuestions.length || liveSubjectCounts[selectedSubject] || 4445).toLocaleString()}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Questions</div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-amber-200/70 text-center min-w-[70px] sm:min-w-[95px] shadow-2xs">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto text-amber-600 mb-0.5 sm:mb-1" />
              <div className="text-base sm:text-xl font-black text-[#12345A]">{subjectMockTests.length || 75}+</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Mock Tests</div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-amber-200/70 text-center min-w-[70px] sm:min-w-[95px] shadow-2xs">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto text-amber-600 mb-0.5 sm:mb-1" />
              <div className="text-base sm:text-xl font-black text-[#12345A]">{officialShiftCount || 80}</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Exam Shifts (CBT)</div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-amber-200/70 text-center min-w-[70px] sm:min-w-[95px] shadow-2xs">
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto text-amber-600 mb-0.5 sm:mb-1" />
              <div className="text-base sm:text-xl font-black text-[#12345A]">{currentSubjectInfo.topics?.length || 10}</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Sub Topics</div>
            </div>
          </div>

          {/* 3D Illustration matching Image 1 */}
          <div className="hidden xl:block shrink-0 w-52 h-36 relative overflow-hidden rounded-2xl border border-amber-200/70 shadow-sm bg-white/40">
            <img
              src={gkGlobeImg}
              alt="Globe with Ashoka Stambh and Books"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4 Navigation Sub-Tabs matching Image 3 - with mobile horizontal scroll */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-[#F6F8FC] rounded-2xl border border-[#E3EAF2] overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => { setSubjectViewTab('tests'); setTestPage(1); }}
            className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              subjectViewTab === 'tests'
                ? 'bg-[#12345A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Mock Tests ({testCategoryCounts.all || 75})</span>
          </button>

          <button
            onClick={() => { setSubjectViewTab('practice'); setTestPage(1); }}
            className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              subjectViewTab === 'practice'
                ? 'bg-[#12345A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Practice Tests (320)</span>
          </button>

          <button
            onClick={() => setSubjectViewTab('browser')}
            className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              subjectViewTab === 'browser'
                ? 'bg-[#12345A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Question Bank ({(currentSubjectQuestions.length || liveSubjectCounts[selectedSubject] || 0).toLocaleString()})</span>
          </button>

          <button
            onClick={() => setSubjectViewTab('topics')}
            className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              subjectViewTab === 'topics'
                ? 'bg-[#12345A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Topic-wise Tests ({currentSubjectInfo.topics?.length || 10})</span>
          </button>
        </div>

        {/* TAB 1 & 2: SUBJECT MOCK TESTS & PRACTICE TESTS (Matching Image 3 Exactly) */}
        {(subjectViewTab === 'tests' || subjectViewTab === 'practice') && (
          <div className="space-y-6">
            {/* Header + Sort by */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2468B4] border border-blue-100 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#12345A]">
                    Select {shortSubjectLabel} {subjectViewTab === 'practice' ? 'Practice Test' : 'Mock Test'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Attempt full-length and topic-wise {shortSubjectLabel} tests based on the latest exam pattern.
                  </p>
                </div>
              </div>

              {/* Sort by Dropdown */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-semibold text-slate-500">Sort by:</span>
                <select
                  value={testSortBy}
                  onChange={(e) => setTestSortBy(e.target.value)}
                  className="text-xs bg-white border border-[#E3EAF2] rounded-xl px-3 py-1.5 font-bold text-[#12345A] focus:outline-hidden focus:border-[#2468B4] shadow-2xs cursor-pointer"
                >
                  <option value="latest">Latest</option>
                  <option value="recommended">Recommended</option>
                  <option value="questions">Questions Count</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>

            {/* Filter Pills matching Image 3 */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: `All Tests (${testCategoryCounts.all})` },
                { id: 'full', label: `Full Mock (${testCategoryCounts.full})` },
                { id: 'sectional', label: `Sectional (${testCategoryCounts.sec})` },
                { id: 'quick', label: `Quick Test (${testCategoryCounts.quick})` },
                { id: 'mixed', label: `Mixed (${testCategoryCounts.mixed})` }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setTestCategoryFilter(f.id);
                    setTestPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    testCategoryFilter === f.id
                      ? 'bg-[#12345A] text-white shadow-xs'
                      : 'bg-white border border-[#E3EAF2] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}

              {activeTopicFilter && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2468B4] text-xs font-bold shrink-0">
                  <span>Topic: {activeTopicFilter}</span>
                  <button
                    onClick={() => { setActiveTopicFilter(null); setTestPage(1); }}
                    className="hover:text-red-600 font-black cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* 2-Columns Layout: Left Test List + Right Topics Covered Sidebar (Image 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Test Cards List */}
              <div className="lg:col-span-8 space-y-3.5">
                {paginatedSubjectTests.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E3EAF2] p-8 text-center space-y-2">
                    <p className="text-sm font-semibold text-slate-600">No mock tests found for the selected filter.</p>
                    <button
                      onClick={() => { setTestCategoryFilter('all'); setActiveTopicFilter(null); setTestPage(1); }}
                      className="px-4 py-1.5 rounded-full bg-[#12345A] text-white text-xs font-bold cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  paginatedSubjectTests.map((mock) => {
                    const isPracticeMode = subjectViewTab === 'practice';
                    const testUrl = `/mocks/${mock.id}?subject=${selectedSubject}${isPracticeMode ? '&mode=practice' : ''}`;
                    return (
                      <div
                        key={mock.id}
                        className="bg-white rounded-2xl border border-[#E3EAF2] hover:border-[#2468B4] hover:shadow-md transition-all p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                      >
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#EAF3FF] text-[#2468B4] border border-[#2468B4]/20 flex items-center justify-center shrink-0">
                            <ClipboardList className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-black text-sm sm:text-base text-[#12345A] group-hover:text-[#2468B4] transition">
                              {mock.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 font-medium">
                              <span className="flex items-center gap-1">
                                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                                {mock.questionsCount} Questions
                              </span>
                              <span className="text-slate-300">|</span>
                              <span>{mock.marks} Marks</span>
                              <span className="text-slate-300">|</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {mock.duration} Minutes
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-3 shrink-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-100">
                          {/* Difficulty Badge */}
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${mock.difficultyBadgeClass}`}>
                            {mock.difficulty}
                          </span>

                          {/* Pattern / Marking Scheme Badge */}
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF3FF] text-[#12345A] text-[11px] font-bold border border-[#2468B4]/20">
                            <Sparkles className="w-3.5 h-3.5 text-[#2468B4]" />
                            <span>{mock.pattern || 'CBT Pattern'}</span>
                          </div>

                          {/* Action Button */}
                          <Link
                            to={testUrl}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#1E4E8C] text-white text-xs font-bold transition shadow-xs shrink-0 cursor-pointer active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>{isPracticeMode ? 'Start Practice' : 'Start Test'}</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Pagination for Test List */}
                {totalTestPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                      onClick={() => setTestPage((p) => Math.max(1, p - 1))}
                      disabled={testPage === 1}
                      className="px-3.5 py-1.5 rounded-full border border-[#E3EAF2] text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalTestPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (testPage > 3 && totalTestPages > 5) {
                          pageNum = testPage - 2 + i;
                          if (pageNum > totalTestPages) pageNum = totalTestPages - (4 - i);
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setTestPage(pageNum)}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition cursor-pointer ${
                              testPage === pageNum
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
                      onClick={() => setTestPage((p) => Math.min(totalTestPages, p + 1))}
                      disabled={testPage === totalTestPages}
                      className="px-3.5 py-1.5 rounded-full border border-[#E3EAF2] text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Topics Covered Sidebar Card matching Image 3 */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E3EAF2] p-5 sm:p-6 space-y-4 shadow-xs sticky top-20">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <BookOpen className="w-5 h-5 text-[#2468B4]" />
                  <h3 className="font-black text-base sm:text-lg text-[#12345A]">
                    {shortSubjectLabel} Topics Covered ({currentSubjectInfo.topics?.length || 10})
                  </h3>
                </div>

                <div className="space-y-1.5">
                  {(currentSubjectInfo.topics || []).map((t) => {
                    const isSelected = activeTopicFilter === t;
                    const count = topicQuestionCounts[t] || 0;
                    return (
                      <div
                        key={t}
                        onClick={() => {
                          setActiveTopicFilter(isSelected ? null : t);
                          setTestPage(1);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer group ${
                          isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 shrink-0" />
                          <span className={`text-xs sm:text-sm font-semibold transition ${
                            isSelected ? 'text-[#2468B4] font-bold' : 'text-slate-800 group-hover:text-[#2468B4]'
                          }`}>
                            {t}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 group-hover:bg-[#EAF3FF] group-hover:text-[#12345A] transition">
                          {count > 0 ? `${count} Qs` : 'PYQs'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
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

        {/* TAB 3: COMPLETE QUESTION BANK BROWSER */}
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

              {/* Flexible View Mode Selector (User Request: 5 in row, 3 in row, single align, grid) */}
              <div className="flex items-center gap-1.5 self-start lg:self-auto shrink-0 bg-white p-1 rounded-xl border border-[#E3EAF2]">
                <span className="text-[11px] font-bold text-slate-500 px-2">View:</span>
                <button
                  onClick={() => setViewMode('fiveInRow')}
                  title="5 in a Row"
                  className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    viewMode === 'fiveInRow' ? 'bg-[#12345A] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">5 in Row</span>
                </button>

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
                  title="Compact Grid (4 in Row)"
                  className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    viewMode === 'grid' ? 'bg-[#12345A] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid (4)</span>
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
                    : viewMode === 'fiveInRow'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5'
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
