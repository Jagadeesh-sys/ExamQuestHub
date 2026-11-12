import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Play,
  FileText,
  FileCheck2,
  HelpCircle,
  Award,
  ArrowLeft,
  Menu,
  X,
  Share2,
  Download,
  Eye,
  Sliders,
  Sparkles,
  Maximize2,
  Minimize2,
  Loader2,
  BadgeCheck,
  TrendingUp,
  BarChart2,
  CheckSquare,
  Layers,
  Flag,
  ListOrdered
} from 'lucide-react';
import { MOCK_TESTS_METADATA, MOCK_QUESTIONS_DATABASE } from '../data/mockTestsData.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { getMockQuestions } from '../firebase/firestoreService.js';
import {
  MOCK_VERIFICATION,
  buildTestId,
  getCategoryById,
  getSubjectById,
  getTestTypeById,
  parseTestId,
  selectTestQuestions,
  toEngineQuestion
} from '../constants/mockTaxonomy.js';
import { getEngineMockTest } from '../services/rrbMockService.js';

/**
 * Builds engine metadata for a Firestore-backed subject test
 */
function buildSubjectTestMeta({ categoryId, subjectId, questionType }, questions) {
  const category = getCategoryById(categoryId);
  const subject = getSubjectById(categoryId, subjectId);
  const type = getTestTypeById(questionType);

  return {
    id: buildTestId(categoryId, subjectId, questionType),
    code: category?.shortName || categoryId,
    month: subject?.name || subjectId,
    title: `${subject?.name || subjectId} — ${type?.label || questionType}`,
    subtitle: type?.description || '',
    questionsCount: questions.length,
    timeMinutes: Math.min(180, Math.max(5, questions.length)),
    marks: questions.length,
    negativeMarking: 0.25,
    pdfUrl: '',
    pdfFileName: '',
    subjectTest: true
  };
}

/**
 * Attribution strip for a question showing exam details and source
 */
function QuestionAttribution({ question, className = '' }) {
  if (!question?.examName && !question?.source && !question?.paperUrl) return null;

  const verified = question.verificationStatus === MOCK_VERIFICATION.VERIFIED || question.isVerified;

  return (
    <div className={`flex flex-wrap items-center gap-2 text-[11px] ${className}`}>
      {question.examName && (
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
          {question.examName}
          {question.examYear ? ` · ${question.examYear}` : ''}
        </span>
      )}
      {verified && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
          <BadgeCheck className="w-3 h-3" />
          Verified
        </span>
      )}
      {question.source && <span className="text-slate-500">Source: {question.source}</span>}
      {question.paperUrl && (
        <a
          href={question.paperUrl}
          target="_blank"
          rel="noreferrer"
          download={question.paperFileName || undefined}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#12345A] font-bold hover:bg-[#DCEBFF] transition"
        >
          <FileText className="w-3 h-3" />
          Question Paper
        </a>
      )}
    </div>
  );
}

export default function MockTestEnginePage() {
  const { mockId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode: 'cbt' | 'practice' | 'solutions'
  const modeParam = searchParams.get('mode') || 'cbt';
  const [activeMode, setActiveMode] = useState(modeParam);

  const parsedTest = useMemo(() => parseTestId(mockId), [mockId]);
  const isSubjectTest = Boolean(parsedTest);
  const isRrbTest = useMemo(
    () =>
      Boolean(
        mockId &&
          (mockId.startsWith('rrb-ntpc-') ||
            mockId.startsWith('subject-') ||
            mockId.startsWith('topic-') ||
            mockId.startsWith('full-cbt-') ||
            mockId.startsWith('ca-mock-') ||
            mockId.startsWith('unified-'))
      ),
    [mockId]
  );

  const [subjectTest, setSubjectTest] = useState({ loading: isSubjectTest, meta: null, questions: [] });
  const [rrbTestState, setRrbTestState] = useState({ loading: isRrbTest, meta: null, questions: [] });

  // Custom practice subset (for "Practice Incorrect Questions" feature)
  const [practiceSubset, setPracticeSubset] = useState(null);

  useEffect(() => {
    if (!isSubjectTest) {
      setSubjectTest({ loading: false, meta: null, questions: [] });
      return undefined;
    }

    let active = true;
    setSubjectTest({ loading: true, meta: null, questions: [] });

    (async () => {
      const data = await getMockQuestions();
      if (!active) return;

      const picked = selectTestQuestions(data, parsedTest);
      const questions = picked.map((question, index) => toEngineQuestion(question, index));
      setSubjectTest({ loading: false, meta: buildSubjectTestMeta(parsedTest, questions), questions });
    })();

    return () => {
      active = false;
    };
  }, [mockId, isSubjectTest]);

  // Load CBT, Subject, or Topic-wise Test
  useEffect(() => {
    if (!isRrbTest) {
      setRrbTestState({ loading: false, meta: null, questions: [] });
      return undefined;
    }

    let active = true;
    setRrbTestState({ loading: true, meta: null, questions: [] });

    (async () => {
      const subjectParam = searchParams.get('subject');
      const limitParam = searchParams.get('limit');
      const data = await getEngineMockTest(mockId, subjectParam, limitParam);
      if (!active) return;
      setRrbTestState({ loading: false, meta: data.meta, questions: data.questions });
    })();

    return () => {
      active = false;
    };
  }, [mockId, searchParams, isRrbTest]);

  const staticMeta = useMemo(
    () => MOCK_TESTS_METADATA.find((m) => m.id === mockId) || null,
    [mockId]
  );

  const mockMeta = isRrbTest ? rrbTestState.meta : (isSubjectTest ? subjectTest.meta : staticMeta);

  const baseQuestions = useMemo(() => {
    if (isRrbTest) return rrbTestState.questions;
    if (isSubjectTest) return subjectTest.questions;
    return staticMeta ? MOCK_QUESTIONS_DATABASE[staticMeta.id] || [] : [];
  }, [isRrbTest, rrbTestState.questions, isSubjectTest, subjectTest.questions, staticMeta]);

  // Use practice subset if user chose "Practice Incorrect Questions"
  const allQuestions = useMemo(() => {
    return practiceSubset && practiceSubset.length > 0 ? practiceSubset : baseQuestions;
  }, [practiceSubset, baseQuestions]);

  // CBT & Practice State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: 'A'|'B'|'C'|'D' }
  const [markedForReview, setMarkedForReview] = useState({}); // { [qId]: boolean }
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [fontSize, setFontSize] = useState('base'); // 'sm' | 'base' | 'lg'
  const [solutionFilter, setSolutionFilter] = useState('all'); // 'all' | 'correct' | 'incorrect' | 'unattempted'

  // Sync mode query parameter with state
  useEffect(() => {
    if (modeParam !== activeMode) {
      setActiveMode(modeParam);
    }
  }, [modeParam]);

  const STORAGE_KEY_ACTIVE_TEST = mockMeta?.id ? `eqh_active_test_${mockMeta.id}` : null;

  // Restore attempt-scoped values or initialize fresh
  useEffect(() => {
    if (!mockMeta) return;

    let restored = false;
    if (STORAGE_KEY_ACTIVE_TEST) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TEST);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && !parsed.isSubmitted && Array.isArray(parsed.visitedQuestions)) {
            setSelectedAnswers(parsed.selectedAnswers || {});
            setMarkedForReview(parsed.markedForReview || {});
            setVisitedQuestions(new Set(parsed.visitedQuestions));
            if (typeof parsed.timeRemaining === 'number' && parsed.timeRemaining > 0) {
              setTimeRemaining(parsed.timeRemaining);
            }
            if (typeof parsed.currentIndex === 'number') {
              setCurrentIndex(parsed.currentIndex);
            }
            restored = true;
          }
        }
      } catch {
        // fallback to fresh
      }
    }

    if (!restored) {
      setCurrentIndex(0);
      setSelectedAnswers({});
      setMarkedForReview({});
      setVisitedQuestions(new Set([0]));
      setTimeRemaining((mockMeta.timeMinutes || 60) * 60);
      setIsSubmitted(false);
      setSolutionFilter('all');
      setPracticeSubset(null);
    }
  }, [mockMeta?.id]);

  // Persist CBT progress to localStorage
  useEffect(() => {
    if (!STORAGE_KEY_ACTIVE_TEST || isSubmitted || activeMode !== 'cbt' || allQuestions.length === 0) return;
    try {
      localStorage.setItem(
        STORAGE_KEY_ACTIVE_TEST,
        JSON.stringify({
          selectedAnswers,
          markedForReview,
          visitedQuestions: Array.from(visitedQuestions),
          timeRemaining,
          currentIndex,
          isSubmitted: false,
          timestamp: Date.now()
        })
      );
    } catch {
      // ignore storage quota errors
    }
  }, [STORAGE_KEY_ACTIVE_TEST, selectedAnswers, markedForReview, visitedQuestions, timeRemaining, currentIndex, isSubmitted, activeMode, allQuestions.length]);

  // Clear saved progress on submission
  useEffect(() => {
    if (isSubmitted && STORAGE_KEY_ACTIVE_TEST) {
      try {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_TEST);
      } catch {
        // ignore
      }
    }
  }, [isSubmitted, STORAGE_KEY_ACTIVE_TEST]);

  // Mark current question as visited
  useEffect(() => {
    setVisitedQuestions((prev) => new Set([...prev, currentIndex]));
  }, [currentIndex]);

  // Timer for CBT mode
  useEffect(() => {
    if (activeMode !== 'cbt' || isSubmitted || !mockMeta || allQuestions.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeMode, isSubmitted, mockMeta, allQuestions.length]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs) => {
    if (!secs || secs < 0) return '00:00';
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remSecs = secs % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const currentQ = allQuestions[currentIndex] || null;

  // Question options selection
  const handleSelectOption = (letter) => {
    if (!currentQ || isSubmitted) return;

    if (activeMode === 'practice') {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQ.id]: letter
      }));
    } else if (activeMode === 'cbt') {
      setSelectedAnswers((prev) => {
        if (prev[currentQ.id] === letter) {
          const next = { ...prev };
          delete next[currentQ.id];
          return next;
        }
        return { ...prev, [currentQ.id]: letter };
      });
    }
  };

  // Clear current response
  const handleClearResponse = () => {
    if (!currentQ || isSubmitted) return;
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  // Toggle mark for review
  const handleToggleMarkReview = () => {
    if (!currentQ || isSubmitted) return;
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  // Save & Next handler: if on last question, opens Submit Confirmation Dialog
  const handleSaveAndNext = () => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSubmitConfirmOpen(true);
    }
  };

  // Previous handler
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Jump directly to a question from palette
  const handleJumpToQuestion = (index) => {
    setCurrentIndex(index);
    setMobilePaletteOpen(false);
  };

  // Retake test from scratch
  const handleRetake = () => {
    setSelectedAnswers({});
    setMarkedForReview({});
    setVisitedQuestions(new Set([0]));
    setCurrentIndex(0);
    setTimeRemaining((mockMeta.timeMinutes || 60) * 60);
    setIsSubmitted(false);
    setPracticeSubset(null);
  };

  // Practice incorrect questions only
  const handlePracticeIncorrect = () => {
    const incorrectQs = baseQuestions.filter((q) => {
      const chosen = selectedAnswers[q.id];
      return chosen !== q.correctAnswer;
    });

    if (incorrectQs.length > 0) {
      setPracticeSubset(incorrectQs);
      setSelectedAnswers({});
      setMarkedForReview({});
      setVisitedQuestions(new Set([0]));
      setCurrentIndex(0);
      setActiveMode('practice');
      setIsSubmitted(false);
      setSolutionFilter('all');
    }
  };

  const handleSwitchMode = (newMode) => {
    setSearchParams({ mode: newMode });
    setActiveMode(newMode);
    setMobilePaletteOpen(false);
  };

  // 5 SSC CBT Question Statuses:
  // 1. Not Visited (Gray)
  // 2. Not Answered (Red)
  // 3. Answered (Green)
  // 4. Marked for Review (Purple)
  // 5. Answered & Marked for Review (Purple with Green Indicator)
  const getQuestionStatus = (index) => {
    const q = allQuestions[index];
    if (!q) return 'unvisited';
    const isAnswered = selectedAnswers[q.id] !== undefined;
    const isMarked = markedForReview[q.id];
    const isVisited = visitedQuestions.has(index);

    if (isMarked && isAnswered) return 'marked-answered';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    if (isVisited) return 'not-answered';
    return 'unvisited';
  };

  // Status Counts for 5-state Palette Summary
  const statusCounts = useMemo(() => {
    let answered = 0;
    let marked = 0;
    let markedAnswered = 0;
    let notAnswered = 0;
    let unvisited = 0;

    allQuestions.forEach((q, idx) => {
      const status = getQuestionStatus(idx);
      if (status === 'answered') answered++;
      else if (status === 'marked-answered') markedAnswered++;
      else if (status === 'marked') marked++;
      else if (status === 'not-answered') notAnswered++;
      else unvisited++;
    });

    return { answered, marked, markedAnswered, notAnswered, unvisited };
  }, [allQuestions, selectedAnswers, markedForReview, visitedQuestions]);

  // Overall Performance Statistics
  const stats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    allQuestions.forEach((q) => {
      const chosen = selectedAnswers[q.id];
      if (!chosen) {
        unattempted++;
      } else if (chosen === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const attempted = correct + incorrect;
    const negRate = mockMeta?.negativeMarking ?? 0.25;
    const rawScore = correct * 1 - incorrect * negRate;
    const score = Math.max(0, Number(rawScore.toFixed(2)));
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const totalSecs = (mockMeta?.timeMinutes || 60) * 60;
    const timeSpent = Math.max(0, totalSecs - timeRemaining);

    return {
      total: allQuestions.length,
      attempted,
      unattempted,
      correct,
      incorrect,
      negativeMarking: negRate,
      negativeDeduction: Number((incorrect * negRate).toFixed(2)),
      score,
      accuracy,
      timeSpent
    };
  }, [allQuestions, selectedAnswers, mockMeta, timeRemaining]);

  // Subject-wise and Topic-wise Breakdown
  const breakdownStats = useMemo(() => {
    const subjectMap = {};
    const topicMap = {};

    allQuestions.forEach((q) => {
      const sub = q.subject || q.targetSubject || mockMeta?.subjectLabel || 'General Knowledge';
      const top = q.topic || q.subtopic || 'General Practice';
      const ans = selectedAnswers[q.id];
      const isAttempted = ans !== undefined;
      const isCorrect = isAttempted && ans === q.correctAnswer;
      const isIncorrect = isAttempted && ans !== q.correctAnswer;

      if (!subjectMap[sub]) {
        subjectMap[sub] = { subject: sub, total: 0, attempted: 0, correct: 0, incorrect: 0, unattempted: 0 };
      }
      subjectMap[sub].total++;
      if (isAttempted) subjectMap[sub].attempted++;
      else subjectMap[sub].unattempted++;
      if (isCorrect) subjectMap[sub].correct++;
      if (isIncorrect) subjectMap[sub].incorrect++;

      if (!topicMap[top]) {
        topicMap[top] = { topic: top, subject: sub, total: 0, attempted: 0, correct: 0, incorrect: 0, unattempted: 0 };
      }
      topicMap[top].total++;
      if (isAttempted) topicMap[top].attempted++;
      else topicMap[top].unattempted++;
      if (isCorrect) topicMap[top].correct++;
      if (isIncorrect) topicMap[top].incorrect++;
    });

    const negRate = mockMeta?.negativeMarking ?? 0.25;

    const subjects = Object.values(subjectMap).map((s) => {
      const marks = Number(Math.max(0, s.correct * 1 - s.incorrect * negRate).toFixed(2));
      const accuracy = s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : 0;
      return { ...s, marks, accuracy };
    });

    const topics = Object.values(topicMap).map((t) => {
      const accuracy = t.attempted > 0 ? Math.round((t.correct / t.attempted) * 100) : 0;
      let status = 'Moderate';
      if (t.attempted === 0) status = 'Unattempted';
      else if (accuracy >= 70) status = 'Strong';
      else if (accuracy < 40) status = 'Needs Focus';
      return { ...t, accuracy, status };
    });

    return { subjects, topics };
  }, [allQuestions, selectedAnswers, mockMeta]);

  // Questions filtered for Solutions mode
  const filteredSolutionsQuestions = useMemo(() => {
    if (solutionFilter === 'all') return allQuestions;
    return allQuestions.filter((q) => {
      const ans = selectedAnswers[q.id];
      if (solutionFilter === 'correct') return ans === q.correctAnswer;
      if (solutionFilter === 'incorrect') return ans && ans !== q.correctAnswer;
      if (solutionFilter === 'unattempted') return !ans;
      return true;
    });
  }, [allQuestions, selectedAnswers, solutionFilter]);

  // Multi-section support (e.g. Quantitative Aptitude, General Awareness, Reasoning)
  const sectionsList = useMemo(() => {
    const map = {};
    allQuestions.forEach((q, idx) => {
      const sec = q.sectionName || q.subject || 'All Questions';
      if (!map[sec]) {
        map[sec] = { name: sec, firstIndex: idx, count: 0, indices: [] };
      }
      map[sec].count++;
      map[sec].indices.push(idx);
    });
    return Object.values(map);
  }, [allQuestions]);

  const currentSectionName = currentQ?.sectionName || currentQ?.subject || 'All Questions';

  if ((isSubjectTest && subjectTest.loading) || (isRrbTest && rrbTestState.loading)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#2468B4] animate-spin" />
        <p className="text-sm font-bold text-slate-600">Loading verified examination questions…</p>
        <p className="text-xs text-slate-400">Filtering strictly by subject and topic taxonomy</p>
      </div>
    );
  }

  if (!mockMeta || !allQuestions || allQuestions.length === 0) {
    const backTo = parsedTest
      ? `/mocks?subject=${parsedTest.subjectId}`
      : '/mocks';

    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          {mockMeta ? 'No Questions in Selected Unit' : 'Mock Test Not Found'}
        </h2>
        <p className="text-slate-500 max-w-md mx-auto text-sm">
          {mockMeta
            ? 'We are compiling additional verified questions for this topic. Please choose another topic or explore the full subject mocks.'
            : 'The requested mock test could not be loaded.'}
        </p>
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#12345A] text-white rounded-full font-bold text-sm shadow-sm hover:bg-[#0B1F3A] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Mock Tests</span>
        </Link>
      </div>
    );
  }

  const isLastQuestion = currentIndex === allQuestions.length - 1;

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col">
      {/* =========================================================================
          TOP SECTION: TEST NAME, QUESTION COUNTER, TIMER, SUBMIT BUTTON
          ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E3EAF2] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Back & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigate('/mocks')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition shrink-0 cursor-pointer"
              title="Return to Mock Tests"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
                  {mockMeta.code}
                </span>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300" />
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-600">
                  {mockMeta.month || mockMeta.examName || 'Official Exam Bank'}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-[#12345A] truncate max-w-[200px] sm:max-w-md">
                {mockMeta.title}
              </h1>
            </div>
          </div>

          {/* Mode Tabs Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-[#F6F8FC] p-1 rounded-full border border-[#E3EAF2]">
            <button
              onClick={() => handleSwitchMode('cbt')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                activeMode === 'cbt'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CBT Exam
            </button>
            <button
              onClick={() => handleSwitchMode('practice')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                activeMode === 'practice'
                  ? 'bg-[#2468B4] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Practice Mode
            </button>
            <button
              onClick={() => handleSwitchMode('solutions')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                activeMode === 'solutions'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solutions
            </button>
          </div>

          {/* Right Action: Countdown Timer or Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {activeMode === 'cbt' && !isSubmitted && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-bold text-xs sm:text-sm border ${
                  timeRemaining < 300
                    ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                    : 'bg-[#EAF3FF] text-[#12345A] border-[#2468B4]/20'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}

            {mockMeta.pdfUrl && (
              <a
                href={mockMeta.pdfUrl}
                target="_blank"
                rel="noreferrer"
                download={mockMeta.pdfFileName}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200"
                title="Download original paper"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </a>
            )}

            {/* Mobile Palette Drawer Toggle */}
            <button
              onClick={() => setMobilePaletteOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer active:scale-95"
            >
              <Menu className="w-4 h-4" />
              <span>Q {currentIndex + 1}/{allQuestions.length}</span>
            </button>

            {activeMode === 'cbt' && !isSubmitted && (
              <button
                onClick={() => setSubmitConfirmOpen(true)}
                className="bg-[#12345A] hover:bg-[#0B1F3A] text-white px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-28 lg:pb-8 flex flex-col lg:flex-row gap-6">
        {/* =========================================================================
            RESULT & PERFORMANCE SCORECARD SCREEN
            ========================================================================= */}
        {isSubmitted && activeMode === 'cbt' ? (
          <div className="w-full space-y-6">
            {/* Scorecard Hero */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAF2] shadow-sm text-center relative overflow-hidden">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                  <Award className="w-8 h-8" />
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  Official CBT Evaluation Completed
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#12345A]">
                  Your Score: <span className="text-[#2468B4]">{stats.score}</span> / {mockMeta.marks || allQuestions.length}
                </h2>

                <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
                  Marking Scheme: +1 for correct answer, -{stats.negativeMarking} negative marking for incorrect answer. Time taken: <strong className="text-slate-800">{formatTime(stats.timeSpent)}</strong>.
                </p>

                {/* Performance Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="text-2xl font-black text-emerald-700">{stats.correct}</div>
                    <div className="text-xs font-semibold text-emerald-800">Correct</div>
                  </div>

                  <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                    <div className="text-2xl font-black text-rose-700">{stats.incorrect}</div>
                    <div className="text-xs font-semibold text-rose-800">Incorrect (-{stats.negativeDeduction})</div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <div className="text-2xl font-black text-slate-700">{stats.unattempted}</div>
                    <div className="text-xs font-semibold text-slate-600">Unattempted</div>
                  </div>

                  <div className="bg-[#EAF3FF] rounded-2xl p-4 border border-[#2468B4]/20">
                    <div className="text-2xl font-black text-[#12345A]">{stats.accuracy}%</div>
                    <div className="text-xs font-semibold text-slate-700">Accuracy</div>
                  </div>
                </div>

                {/* 4 Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
                  <button
                    onClick={() => handleSwitchMode('solutions')}
                    className="px-5 py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white rounded-full font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Review All Solutions</span>
                  </button>

                  <button
                    onClick={handleRetake}
                    className="px-5 py-2.5 bg-white border border-[#E3EAF2] hover:bg-slate-50 text-slate-800 rounded-full font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retry Test</span>
                  </button>

                  {stats.incorrect > 0 && (
                    <button
                      onClick={handlePracticeIncorrect}
                      className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-full font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      <span>Practice Incorrect ({stats.incorrect})</span>
                    </button>
                  )}

                  <Link
                    to="/mocks"
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Mock Tests</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Subject-Wise Performance Breakdown Table */}
            {breakdownStats.subjects.length > 0 && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3EAF2] shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-[#12345A]" />
                  <h3 className="text-base sm:text-lg font-black text-[#12345A]">Subject-Wise Performance Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/60">
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3 text-center">Questions</th>
                        <th className="py-2.5 px-3 text-center">Attempted</th>
                        <th className="py-2.5 px-3 text-center text-emerald-700">Correct</th>
                        <th className="py-2.5 px-3 text-center text-rose-700">Incorrect</th>
                        <th className="py-2.5 px-3 text-center text-[#12345A]">Marks</th>
                        <th className="py-2.5 px-3 text-right">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {breakdownStats.subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-bold text-slate-800">{sub.subject}</td>
                          <td className="py-3 px-3 text-center font-semibold text-slate-600">{sub.total}</td>
                          <td className="py-3 px-3 text-center font-semibold text-slate-600">{sub.attempted}</td>
                          <td className="py-3 px-3 text-center font-bold text-emerald-600">{sub.correct}</td>
                          <td className="py-3 px-3 text-center font-bold text-rose-600">{sub.incorrect}</td>
                          <td className="py-3 px-3 text-center font-black text-[#12345A]">{sub.marks}</td>
                          <td className="py-3 px-3 text-right font-black text-slate-800">{sub.accuracy}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Topic-Wise Performance Breakdown Table */}
            {breakdownStats.topics.length > 0 && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3EAF2] shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#2468B4]" />
                  <h3 className="text-base sm:text-lg font-black text-[#12345A]">Topic-Wise Breakdown &amp; Analysis</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/60">
                        <th className="py-2.5 px-3">Topic / Unit</th>
                        <th className="py-2.5 px-3 text-center">Questions</th>
                        <th className="py-2.5 px-3 text-center text-emerald-700">Correct</th>
                        <th className="py-2.5 px-3 text-center">Accuracy</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {breakdownStats.topics.map((top, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-bold text-slate-800">{top.topic}</td>
                          <td className="py-3 px-3 text-center font-semibold text-slate-600">{top.total}</td>
                          <td className="py-3 px-3 text-center font-bold text-emerald-600">{top.correct}</td>
                          <td className="py-3 px-3 text-center font-black text-slate-800">{top.accuracy}%</td>
                          <td className="py-3 px-3 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10.5px] ${
                                top.status === 'Strong'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : top.status === 'Needs Focus'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {top.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : activeMode === 'solutions' ? (
          /* =========================================================================
              SOLUTIONS & EXPLANATIONS MODE
              ========================================================================= */
          <div className="w-full space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E3EAF2] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#12345A]">
                  Verified Solutions &amp; Explanations
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Complete questions with official explanations grounded in authentic examination compilations.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-[#F6F8FC] p-1 rounded-full border border-[#E3EAF2] text-xs font-bold">
                <button
                  onClick={() => setSolutionFilter('all')}
                  className={`px-3 py-1 rounded-full transition cursor-pointer ${
                    solutionFilter === 'all'
                      ? 'bg-[#12345A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({allQuestions.length})
                </button>
                {Object.keys(selectedAnswers).length > 0 && (
                  <>
                    <button
                      onClick={() => setSolutionFilter('correct')}
                      className={`px-3 py-1 rounded-full transition cursor-pointer ${
                        solutionFilter === 'correct'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Correct ({stats.correct})
                    </button>
                    <button
                      onClick={() => setSolutionFilter('incorrect')}
                      className={`px-3 py-1 rounded-full transition cursor-pointer ${
                        solutionFilter === 'incorrect'
                          ? 'bg-rose-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Incorrect ({stats.incorrect})
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* List of Questions with Expanded Explanations */}
            <div className="space-y-4">
              {filteredSolutionsQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3EAF2] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Question {q.qNumber || idx + 1} · {q.topic}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF3FF] text-[#12345A]">
                      {q.difficulty || 'Medium'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h3>

                  {q.questionTe && (
                    <p className="text-sm text-slate-600 leading-relaxed -mt-1">{q.questionTe}</p>
                  )}

                  <QuestionAttribution question={q} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {['A', 'B', 'C', 'D'].map((opt) => {
                      const isCorrect = opt === q.correctAnswer;
                      const userPick = selectedAnswers[q.id] === opt;

                      return (
                        <div
                          key={opt}
                          className={`p-3 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 transition ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950 shadow-2xs'
                              : userPick
                              ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : userPick
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt}
                          </span>
                          <span className="pt-0.5">
                            {q.options[opt]}
                            {q.optionsTe?.[opt] && (
                              <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                                {q.optionsTe[opt]}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-[#EAF3FF]/60 rounded-2xl p-4 border border-[#2468B4]/20 space-y-1.5 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#12345A]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Correct Answer: Option ({q.correctAnswer}) - {q.options[q.correctAnswer]}</span>
                    </div>
                    {q.explanation && (
                      <p className="text-xs text-slate-700 leading-relaxed pt-1">
                        <strong className="text-slate-900">Explanation: </strong>
                        {q.explanation}
                        {q.explanationTe && (
                          <span className="block mt-1.5 text-slate-600">{q.explanationTe}</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* =========================================================================
              ACTIVE CBT & PRACTICE INTERACTIVE QUESTION AREA
              ========================================================================= */
          <>
            {/* Left Question Box */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              {/* Multi-Section Tabs Header (e.g. Quantitative Aptitude, Reasoning, General Awareness) */}
              {sectionsList.length > 1 && (
                <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-[#E3EAF2] shadow-2xs flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1 pr-1 shrink-0">
                    Sections:
                  </span>
                  {sectionsList.map((sec) => {
                    const isCurrentSection = sec.name === currentSectionName;
                    return (
                      <button
                        key={sec.name}
                        type="button"
                        onClick={() => handleJumpToQuestion(sec.firstIndex)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          isCurrentSection
                            ? 'bg-[#12345A] text-white shadow-xs scale-[1.02]'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{sec.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                            isCurrentSection ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {sec.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#E3EAF2] shadow-xs space-y-5">
                {/* Question Info Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E3EAF2] gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-[#12345A] text-white text-xs font-bold">
                      Q {currentIndex + 1} of {allQuestions.length}
                    </span>

                    {/* Quick mobile prev/next arrows */}
                    <div className="flex sm:hidden items-center gap-1">
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="p-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                        title="Previous Question"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAndNext}
                        disabled={isLastQuestion}
                        className="p-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                        title="Next Question"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {currentQ.topic || mockMeta.topicName || 'Authentic CBT'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hidden sm:inline-block">
                      {currentQ.difficulty || 'Medium'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleMarkReview}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition cursor-pointer ${
                        markedForReview[currentQ.id]
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                      title="Flag question for review later"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">
                        {markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}
                      </span>
                    </button>

                    {/* Font size adjustments */}
                    <div className="hidden sm:flex items-center border border-slate-200 rounded-full bg-slate-50 p-0.5">
                      <button
                        onClick={() => setFontSize('sm')}
                        className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          fontSize === 'sm' ? 'bg-white shadow-2xs text-[#12345A]' : 'text-slate-500'
                        }`}
                      >
                        A-
                      </button>
                      <button
                        onClick={() => setFontSize('base')}
                        className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          fontSize === 'base' ? 'bg-white shadow-2xs text-[#12345A]' : 'text-slate-500'
                        }`}
                      >
                        A
                      </button>
                      <button
                        onClick={() => setFontSize('lg')}
                        className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                          fontSize === 'lg' ? 'bg-white shadow-2xs text-[#12345A]' : 'text-slate-500'
                        }`}
                      >
                        A+
                      </button>
                    </div>
                  </div>
                </div>

                {/* Exam / year / source attribution */}
                <QuestionAttribution question={currentQ} className="-mt-2" />

                {/* Question Text */}
                <div
                  className={`text-slate-900 font-bold leading-relaxed ${
                    fontSize === 'sm'
                      ? 'text-sm sm:text-base'
                      : fontSize === 'lg'
                      ? 'text-lg sm:text-xl'
                      : 'text-base sm:text-lg'
                  }`}
                >
                  {currentQ.question}
                  {currentQ.questionTe && (
                    <p className="mt-2 text-sm font-normal text-slate-600 leading-relaxed">
                      {currentQ.questionTe}
                    </p>
                  )}
                </div>

                {/* Options List with High-Contrast Highlighting */}
                <div className="space-y-3 pt-2">
                  {['A', 'B', 'C', 'D'].map((opt) => {
                    const isSelected = selectedAnswers[currentQ.id] === opt;
                    const isPractice = activeMode === 'practice';
                    const isPracticeAnswered = isPractice && selectedAnswers[currentQ.id];
                    const isCorrect = opt === currentQ.correctAnswer;

                    let optionStyle =
                      'bg-white border-[#E3EAF2] hover:border-[#2468B4] hover:bg-[#F6F8FC] text-slate-800';

                    if (isPracticeAnswered) {
                      if (isCorrect) {
                        optionStyle =
                          'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs';
                      } else if (isSelected) {
                        optionStyle =
                          'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-2xs';
                      }
                    } else if (isSelected) {
                      optionStyle =
                        'bg-[#EAF3FF] border-[#2468B4] text-[#12345A] font-bold shadow-2xs ring-1 ring-[#2468B4]';
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption(opt)}
                        disabled={isPracticeAnswered}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isPracticeAnswered && isCorrect
                              ? 'bg-emerald-600 text-white'
                              : isPracticeAnswered && isSelected
                              ? 'bg-rose-600 text-white'
                              : isSelected
                              ? 'bg-[#12345A] text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {opt}
                        </span>

                        <span className="pt-0.5 text-xs sm:text-sm font-medium leading-relaxed">
                          {currentQ.options[opt]}
                          {currentQ.optionsTe?.[opt] && (
                            <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                              {currentQ.optionsTe[opt]}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Practice Mode Instant Explanation */}
                {activeMode === 'practice' && selectedAnswers[currentQ.id] && (
                  <div
                    className={`rounded-2xl p-4 sm:p-5 border transition-all space-y-2 animate-in fade-in duration-300 ${
                      selectedAnswers[currentQ.id] === currentQ.correctAnswer
                        ? 'bg-emerald-50/80 border-emerald-200'
                        : 'bg-amber-50/80 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedAnswers[currentQ.id] === currentQ.correctAnswer ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span className="font-bold text-sm text-emerald-900">
                            Correct Answer! (+1 Mark)
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          <span className="font-bold text-sm text-rose-900">
                            Incorrect. Correct choice is ({currentQ.correctAnswer}):{' '}
                            {currentQ.options[currentQ.correctAnswer]}
                          </span>
                        </>
                      )}
                    </div>

                    {currentQ.explanation && (
                      <div className="text-xs text-slate-700 leading-relaxed pt-1 border-t border-black/5 mt-2">
                        <strong className="text-slate-900">Detailed Explanation: </strong>
                        {currentQ.explanation}
                        {currentQ.explanationTe && (
                          <span className="block mt-1.5 text-slate-600">
                            {currentQ.explanationTe}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Dedicated Mobile In-Card Navigation Bar (Previous & Next Question) */}
                <div className="lg:hidden pt-4 border-t border-slate-100 flex items-center justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearResponse}
                    disabled={!selectedAnswers[currentQ?.id]}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition cursor-pointer"
                  >
                    Clear
                  </button>

                  {isLastQuestion ? (
                    <button
                      type="button"
                      onClick={() => setSubmitConfirmOpen(true)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center justify-center gap-1 shadow-md cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveAndNext}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Save &amp; Next</span>
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>

              {/* =========================================================================
                  BOTTOM NAVIGATION TOOLBAR (DESKTOP)
                  ========================================================================= */}
              <div className="hidden lg:flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E3EAF2] shadow-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleClearResponse}
                    disabled={!selectedAnswers[currentQ.id]}
                    className="px-3.5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition cursor-pointer"
                  >
                    Clear Response
                  </button>

                  <button
                    onClick={handleToggleMarkReview}
                    className={`px-3.5 py-2.5 rounded-full border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      markedForReview[currentQ.id]
                        ? 'bg-purple-100 text-purple-800 border-purple-300'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {isLastQuestion ? (
                    <button
                      onClick={() => setSubmitConfirmOpen(true)}
                      className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Test</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveAndNext}
                      className="px-6 py-2.5 rounded-full bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Save &amp; Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* =========================================================================
                RIGHT QUESTION PALETTE (DESKTOP)
                ========================================================================= */}
            <aside className="hidden lg:block w-80 bg-white rounded-3xl p-5 border border-[#E3EAF2] shadow-xs space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Question Palette</h3>
                <span className="text-xs font-bold text-[#12345A] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full">
                  {statusCounts.answered + statusCounts.markedAnswered} / {allQuestions.length} Answered
                </span>
              </div>

              {/* 5-State SSC CBT Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 bg-[#F6F8FC] p-3 rounded-2xl border border-[#E3EAF2]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center shrink-0">✓</span>
                  <span>Answered ({statusCounts.answered})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shrink-0">✕</span>
                  <span>Not Answered ({statusCounts.notAnswered})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-purple-600 text-white text-[9px] font-black flex items-center justify-center shrink-0">★</span>
                  <span>Marked ({statusCounts.marked})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-purple-600 text-white text-[9px] font-black relative flex items-center justify-center shrink-0 after:absolute after:-top-0.5 after:-right-0.5 after:w-1.5 after:h-1.5 after:bg-emerald-400 after:rounded-full after:ring-1 after:ring-white">★</span>
                  <span>Ans &amp; Marked ({statusCounts.markedAnswered})</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5 pt-1 border-t border-slate-200">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-200 text-slate-600 text-[9px] font-black flex items-center justify-center shrink-0">•</span>
                  <span>Not Visited ({statusCounts.unvisited})</span>
                </div>
              </div>

              {/* Question Number Grid */}
              <div className="max-h-[380px] overflow-y-auto pr-1">
                <div className="grid grid-cols-5 gap-2">
                  {allQuestions.map((q, idx) => {
                    const status = getQuestionStatus(idx);
                    const isCurrent = idx === currentIndex;

                    let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200';
                    let badgeDot = false;

                    if (status === 'answered') {
                      btnStyle = 'bg-emerald-600 text-white font-bold border border-emerald-700';
                    } else if (status === 'marked-answered') {
                      btnStyle = 'bg-purple-600 text-white font-bold border border-purple-700';
                      badgeDot = true;
                    } else if (status === 'marked') {
                      btnStyle = 'bg-purple-600 text-white font-bold border border-purple-700';
                    } else if (status === 'not-answered') {
                      btnStyle = 'bg-rose-500 text-white font-bold border border-rose-600';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => handleJumpToQuestion(idx)}
                        className={`h-9 rounded-xl text-xs relative flex items-center justify-center transition-all cursor-pointer ${btnStyle} ${
                          isCurrent ? 'ring-2 ring-offset-2 ring-[#12345A] scale-105 z-10' : ''
                        }`}
                        title={`Question ${idx + 1} (${status})`}
                      >
                        {idx + 1}
                        {badgeDot && (
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              {activeMode === 'cbt' && (
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitConfirmOpen(true)}
                    className="w-full py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white rounded-full font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
                  >
                    Submit Complete Test
                  </button>
                </div>
              )}
            </aside>
          </>
        )}
      </main>

      {/* =========================================================================
          STICKY MOBILE BOTTOM NAVIGATION BAR (FIXED & HIGHLY ACCESSIBLE)
          ========================================================================= */}
      {!isSubmitted && activeMode !== 'solutions' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E3EAF2] px-3 py-2.5 shadow-lg safe-area-pb">
          <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <button
              onClick={handleToggleMarkReview}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                markedForReview[currentQ?.id]
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 inline mr-1" />
              <span>Review</span>
            </button>

            <button
              onClick={handleClearResponse}
              disabled={!selectedAnswers[currentQ?.id]}
              className="px-2.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition cursor-pointer"
            >
              Clear
            </button>

            {isLastQuestion ? (
              <button
                onClick={() => setSubmitConfirmOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit</span>
              </button>
            ) : (
              <button
                onClick={handleSaveAndNext}
                className="px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
              >
                <span>Save &amp; Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MOBILE QUESTION PALETTE DRAWER / BOTTOM SHEET
          ========================================================================= */}
      {mobilePaletteOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Question Navigation Palette</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#12345A]">
                  {statusCounts.answered + statusCounts.markedAnswered} / {allQuestions.length} Done
                </span>
              </div>
              <button
                onClick={() => setMobilePaletteOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick 5-State Legend */}
            <div className="grid grid-cols-2 gap-1.5 text-[10.5px] font-semibold text-slate-600 bg-[#F6F8FC] p-2.5 rounded-xl">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Answered ({statusCounts.answered})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Not Answered ({statusCounts.notAnswered})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                <span>Marked ({statusCounts.marked})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 relative after:absolute after:-top-0.5 after:-right-0.5 after:w-1 after:h-1 after:bg-emerald-400 after:rounded-full" />
                <span>Ans &amp; Marked ({statusCounts.markedAnswered})</span>
              </div>
            </div>

            {/* Mobile Grid */}
            <div className="overflow-y-auto max-h-[50vh] pr-1 py-1">
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {allQuestions.map((q, idx) => {
                  const status = getQuestionStatus(idx);
                  const isCurrent = idx === currentIndex;

                  let btnStyle = 'bg-slate-100 text-slate-700';
                  let badgeDot = false;

                  if (status === 'answered') {
                    btnStyle = 'bg-emerald-600 text-white font-bold';
                  } else if (status === 'marked-answered') {
                    btnStyle = 'bg-purple-600 text-white font-bold';
                    badgeDot = true;
                  } else if (status === 'marked') {
                    btnStyle = 'bg-purple-600 text-white font-bold';
                  } else if (status === 'not-answered') {
                    btnStyle = 'bg-rose-500 text-white font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`h-9 rounded-xl text-xs relative flex items-center justify-center transition-all cursor-pointer ${btnStyle} ${
                        isCurrent ? 'ring-2 ring-offset-2 ring-[#12345A] font-black scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                      {badgeDot && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeMode === 'cbt' && (
              <button
                onClick={() => {
                  setMobilePaletteOpen(false);
                  setSubmitConfirmOpen(true);
                }}
                className="w-full py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white rounded-full font-bold text-xs shadow-xs cursor-pointer active:scale-95"
              >
                Submit Complete Test
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBMIT CONFIRMATION MODAL
          ========================================================================= */}
      {submitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Confirm Test Submission</h3>
                <p className="text-xs text-slate-500">Are you sure you want to complete your examination?</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-[#F6F8FC] p-3 rounded-2xl border border-[#E3EAF2]">
              <div className="p-2.5 bg-white rounded-xl shadow-2xs">
                <div className="text-slate-500 font-medium">Answered:</div>
                <div className="text-base font-black text-emerald-600">
                  {statusCounts.answered + statusCounts.markedAnswered}
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-xl shadow-2xs">
                <div className="text-slate-500 font-medium">Unanswered:</div>
                <div className="text-base font-black text-rose-600">
                  {allQuestions.length - (statusCounts.answered + statusCounts.markedAnswered)}
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-xl shadow-2xs">
                <div className="text-slate-500 font-medium">Marked for Review:</div>
                <div className="text-base font-black text-purple-600">
                  {statusCounts.marked + statusCounts.markedAnswered}
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-xl shadow-2xs">
                <div className="text-slate-500 font-medium">Time Left:</div>
                <div className="text-base font-black text-[#12345A]">{formatTime(timeRemaining)}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSubmitConfirmOpen(false)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Continue Test
              </button>
              <button
                onClick={() => {
                  setSubmitConfirmOpen(false);
                  setIsSubmitted(true);
                }}
                className="px-5 py-2 rounded-full bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-black transition shadow-xs cursor-pointer active:scale-95"
              >
                Yes, Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
