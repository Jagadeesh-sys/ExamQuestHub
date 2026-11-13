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
  Pause,
  FileText,
  FileCheck2,
  HelpCircle,
  Award,
  ArrowLeft,
  ArrowRight,
  Trash2,
  MoreVertical,
  Info,
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
import { getEngineMockTest, getQuestionsByIds, summarizeIncludedExams } from '../services/rrbMockService.js';

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
 * Attribution strip for a question showing complete exam details, year, shift, topic, and source
 */
function QuestionAttribution({ question, className = '' }) {
  if (!question?.examName && !question?.source && !question?.paperUrl) return null;

  const verified = question.verificationStatus === MOCK_VERIFICATION.VERIFIED || question.isVerified;
  const examNameStr = String(question.examName || '').trim();
  const examYearStr = String(question.examYear || '').trim();
  const showYearSeparately = Boolean(examYearStr && !examNameStr.includes(examYearStr));
  const shiftInfo = question.shift && question.shift !== 'Master PYQ Pool' && question.shift !== 'Official Question Bank'
    ? question.shift
    : '';
  const dateInfo = question.examDate ? String(question.examDate).trim() : '';

  return (
    <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] ${className}`}>
      {examNameStr && (
        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200/80">
          {examNameStr}
          {showYearSeparately ? ` · ${examYearStr}` : ''}
          {shiftInfo ? ` · ${shiftInfo}` : ''}
          {dateInfo ? ` (${dateInfo})` : ''}
        </span>
      )}
      {question.topic && (
        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#12345A] font-semibold border border-blue-100">
          {question.topic}
        </span>
      )}
      {verified && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
          <BadgeCheck className="w-3 h-3" />
          Verified
        </span>
      )}
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
  const isDynamicTest = useMemo(
    () =>
      Boolean(
        mockId &&
          (mockId.startsWith('rrb-') ||
            mockId.startsWith('ssc-') ||
            mockId.startsWith('subject-') ||
            mockId.startsWith('topic-') ||
            mockId.startsWith('full-') ||
            mockId.startsWith('ca-mock-') ||
            mockId.startsWith('sec-') ||
            mockId.startsWith('series-') ||
            mockId.startsWith('unified-') ||
            mockId.includes('--'))
      ),
    [mockId]
  );
  const isSubjectTest = Boolean(parsedTest) && !isDynamicTest;

  const [subjectTest, setSubjectTest] = useState({ loading: isSubjectTest, meta: null, questions: [] });
  const [rrbTestState, setRrbTestState] = useState({ loading: isDynamicTest, meta: null, questions: [] });

  // Custom practice subset (for "Practice Incorrect Questions" feature) & random shuffle nonce
  const [practiceSubset, setPracticeSubset] = useState(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

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
  }, [mockId, isSubjectTest, parsedTest]);

  const subjectParam = searchParams.get('subject');
  const limitParam = searchParams.get('limit');

  // Load CBT, Subject, or Topic-wise Test (preserves active CBT questionIds across page refresh; re-samples on refreshNonce)
  useEffect(() => {
    if (!isDynamicTest) {
      setRrbTestState({ loading: false, meta: null, questions: [] });
      return undefined;
    }

    let active = true;
    setRrbTestState({ loading: true, meta: null, questions: [] });

    (async () => {
      try {
        const data = await getEngineMockTest(mockId, subjectParam, limitParam);
        if (!active) return;

        let finalQuestions = data?.questions || [];
        let finalMeta = data?.meta || null;

        // If user refreshes mid-CBT test, restore the exact same question IDs so saved answers match
        if (refreshNonce === 0 && modeParam === 'cbt' && mockId) {
          try {
            const savedRaw = localStorage.getItem(`eqh_active_test_${mockId}`);
            if (savedRaw) {
              const saved = JSON.parse(savedRaw);
              if (saved && !saved.isSubmitted && Array.isArray(saved.questionIds) && saved.questionIds.length > 0) {
                const restoredQs = await getQuestionsByIds(saved.questionIds);
                if (active && restoredQs.length > 0) {
                  finalQuestions = restoredQs;
                  if (finalMeta) {
                    const summary = summarizeIncludedExams(restoredQs);
                    finalMeta = {
                      ...finalMeta,
                      questionsCount: restoredQs.length,
                      includedExams: summary.includedExams,
                      yearsList: summary.yearsList,
                      examName: summary.examsSummaryText,
                      examYear: summary.yearsText
                    };
                  }
                }
              }
            }
          } catch {
            // fallback to fresh randomized draw
          }
        }

        if (!active) return;
        setRrbTestState({ loading: false, meta: finalMeta, questions: finalQuestions });
      } catch (err) {
        if (!active) return;
        console.error('Failed to load mock test:', err);
        setRrbTestState({ loading: false, meta: null, questions: [] });
      }
    })();

    return () => {
      active = false;
    };
  }, [mockId, subjectParam, limitParam, isDynamicTest, refreshNonce]);

  const staticMeta = useMemo(
    () => MOCK_TESTS_METADATA.find((m) => m.id === mockId) || null,
    [mockId]
  );

  const mockMeta = isDynamicTest ? rrbTestState.meta : (isSubjectTest ? subjectTest.meta : staticMeta);

  const baseQuestions = useMemo(() => {
    if (isDynamicTest) return rrbTestState.questions;
    if (isSubjectTest) return subjectTest.questions;
    return staticMeta ? MOCK_QUESTIONS_DATABASE[staticMeta.id] || [] : [];
  }, [isDynamicTest, rrbTestState.questions, isSubjectTest, subjectTest.questions, staticMeta]);

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

  // Pre-test instructions & test controls
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [instructionsAgreed, setInstructionsAgreed] = useState(true);
  const [instructionTab, setInstructionTab] = useState('instructions'); // 'instructions' | 'pattern' | 'faqs'
  const [isPaused, setIsPaused] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [paletteTab, setPaletteTab] = useState('palette'); // 'palette' | 'summary'
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState({});

  // Sync mode query parameter with state
  useEffect(() => {
    if (modeParam !== activeMode) {
      setActiveMode(modeParam);
      if (modeParam !== 'cbt') {
        setIsExamStarted(true);
      }
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
              const elapsed = parsed.timestamp ? Math.floor((Date.now() - parsed.timestamp) / 1000) : 0;
              const remaining = Math.max(0, parsed.timeRemaining - elapsed);
              setTimeRemaining(remaining);
            }
            if (typeof parsed.currentIndex === 'number' && parsed.currentIndex >= 0) {
              setCurrentIndex(parsed.currentIndex);
            }
            restored = true;
          }
        }
      } catch {
        // fallback to fresh
      }
    }

    if (restored) {
      setIsExamStarted(true);
    } else {
      setCurrentIndex(0);
      setSelectedAnswers({});
      setMarkedForReview({});
      setVisitedQuestions(new Set([0]));
      setTimeRemaining((mockMeta.timeMinutes || 60) * 60);
      setIsSubmitted(false);
      setSolutionFilter('all');
      setPracticeSubset(null);
      setIsExamStarted(activeMode !== 'cbt');
    }
  }, [mockMeta?.id]);

  // Persist CBT progress to localStorage with throttling
  useEffect(() => {
    if (!STORAGE_KEY_ACTIVE_TEST || isSubmitted || activeMode !== 'cbt' || allQuestions.length === 0) return;
    try {
      localStorage.setItem(
        STORAGE_KEY_ACTIVE_TEST,
        JSON.stringify({
          testId: mockMeta?.id,
          testTitle: mockMeta?.title,
          targetSubject: mockMeta?.targetSubject,
          questionIds: baseQuestions.map((q) => q.id),
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
  }, [STORAGE_KEY_ACTIVE_TEST, selectedAnswers, markedForReview, visitedQuestions, currentIndex, isSubmitted, activeMode, allQuestions.length, baseQuestions, mockMeta?.id, mockMeta?.title, mockMeta?.targetSubject]);

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
    if (activeMode !== 'cbt' || isSubmitted || !isExamStarted || isPaused || !mockMeta || allQuestions.length === 0) return;

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
  }, [activeMode, isSubmitted, isExamStarted, isPaused, mockMeta, allQuestions.length]);

  // Format seconds to hh:mm:ss format matching official CBT (Image 2)
  const formatTime = (secs) => {
    if (!secs || secs < 0) return '00:00:00';
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remSecs = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const cleanMockTitle = useMemo(() => {
    if (!mockMeta) return 'Mock Test';
    let t = mockMeta.title || mockMeta.name || 'Official Examination Mock Test';
    t = t.replace(' · Full Shift CBT (All Subjects)', '');
    return t;
  }, [mockMeta]);

  const examAgency = useMemo(() => {
    if (mockMeta?.includedExams && mockMeta.includedExams.length > 1) return 'PYQ';
    const raw = String(mockMeta?.agency || mockMeta?.examName || mockMeta?.code || mockId || '').toLowerCase();
    if (raw.includes('rrb') || raw.includes('railway') || raw.includes('ntpc')) return 'RRB';
    if (raw.includes('ssc') || raw.includes('cgl') || raw.includes('chsl') || raw.includes('mts')) return 'SSC';
    return 'EQH';
  }, [mockMeta, mockId]);

  const toggleQuestionBookmark = (qId) => {
    setBookmarkedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId]
    }));
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

  // Retake test from scratch (deals a fresh randomized set across all exams/years for dynamic pools)
  const handleRetake = () => {
    if (STORAGE_KEY_ACTIVE_TEST) {
      try {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_TEST);
      } catch {
        // ignore
      }
    }
    setSelectedAnswers({});
    setMarkedForReview({});
    setVisitedQuestions(new Set([0]));
    setCurrentIndex(0);
    setTimeRemaining((mockMeta?.timeMinutes || 60) * 60);
    setIsSubmitted(false);
    setPracticeSubset(null);
    if (mockMeta?.isRandomizedPool) {
      setRefreshNonce((n) => n + 1);
    }
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

  if ((isSubjectTest && subjectTest.loading) || (isDynamicTest && rrbTestState.loading)) {
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
  const marksPerQuestion = examAgency === 'SSC' ? 2 : 1;
  const negativeMarkingRate = mockMeta?.negativeMarking ?? (examAgency === 'SSC' ? 0.5 : 0.25);

  // =========================================================================
  // PRE-TEST INSTRUCTIONS SCREEN (Matching Image 1)
  // =========================================================================
  if (activeMode === 'cbt' && !isExamStarted && !isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex flex-col">
        {/* Top Header matching Image 1 */}
        <header className="sticky top-0 z-30 bg-[#0B2545] text-white shadow-xs">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/examquesthub-logo.png"
                alt="ExamQuestHub"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/logo.png';
                }}
              />
              <div className="text-left">
                <div className="text-sm font-black font-heading tracking-tight leading-none text-white">
                  Exam<span className="text-[#F2BE4F]">Quest</span>Hub
                </div>
                <span className="text-[10px] font-semibold text-slate-300">
                  Govt Exams • Mock Tests • PYQs
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleQuestionBookmark(allQuestions[0]?.id || 'test')}
              className="p-2 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
              title="Bookmark test"
            >
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content matching Image 1 */}
        <main className="flex-1 max-w-2xl sm:max-w-3xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3.5 sm:space-y-4">
          {/* Header Card with Circular Agency Emblem, Title and Badges */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Official Circular Agency Emblem Badge */}
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-[#FFE4E6] border border-[#FECDD3] flex flex-col items-center justify-center p-1.5 shrink-0 shadow-2xs">
                <img
                  src={examAgency === 'SSC' ? '/assets/aistudio/image_445d7a66.png' : '/assets/aistudio/image_cbd93505.png'}
                  alt={examAgency || 'Exam'}
                  className="w-7 h-7 sm:w-9 sm:h-9 object-contain rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/aistudio/image_cbd93505.png';
                  }}
                />
                <span className="text-[9px] sm:text-[10px] font-black text-[#E11D48] tracking-wider uppercase mt-0.5">
                  {examAgency || 'RRB'}
                </span>
              </div>

              <div className="flex-1 space-y-1.5 min-w-0">
                <h1 className="text-sm sm:text-xl md:text-2xl font-black text-[#0B2545] font-heading leading-snug">
                  {cleanMockTitle}
                </h1>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#1D4ED8] text-[10px] sm:text-xs font-bold">
                    {mockMeta.isRandomizedPool ? 'Random Multi-Exam PYQs' : 'Mock Test'}
                  </span>
                  {mockMeta.examYear && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#7E22CE] text-[10px] sm:text-xs font-bold">
                      Years: {mockMeta.examYear}
                    </span>
                  )}
                </div>

                {mockMeta.includedExams && mockMeta.includedExams.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {mockMeta.includedExams.map((ex) => (
                      <span
                        key={ex.label}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-semibold border border-slate-200/80"
                      >
                        {ex.label} ({ex.count} Qs)
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Tabs matching Image 1 */}
            <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200 mt-4 sm:mt-6 pt-1">
              {[
                { id: 'instructions', label: 'Instructions' },
                { id: 'pattern', label: 'Exam Pattern' },
                { id: 'faqs', label: 'FAQs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setInstructionTab(tab.id)}
                  className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-bold transition relative cursor-pointer ${
                    instructionTab === tab.id
                      ? 'text-[#1D4ED8]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {instructionTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1D4ED8] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions Tab Content */}
          {instructionTab === 'instructions' && (
            <div className="space-y-3 sm:space-y-4">
              {/* 4 Stat Boxes in a row */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs grid grid-cols-4 divide-x divide-slate-100 overflow-hidden py-2.5 sm:py-4">
                <div className="flex flex-col items-center justify-center px-1 sm:px-2 text-center">
                  <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-[#2563EB] mb-0.5 sm:mb-1" />
                  <span className="text-sm sm:text-2xl font-black text-slate-900 leading-tight">
                    {mockMeta.timeMinutes || 90}
                  </span>
                  <span className="text-[9.5px] sm:text-xs font-semibold text-slate-500">Minutes</span>
                </div>

                <div className="flex flex-col items-center justify-center px-1 sm:px-2 text-center">
                  <Layers className="w-4 h-4 sm:w-6 sm:h-6 text-[#2563EB] mb-0.5 sm:mb-1" />
                  <span className="text-sm sm:text-2xl font-black text-slate-900 leading-tight">
                    {allQuestions.length || mockMeta.questionsCount || 100}
                  </span>
                  <span className="text-[9.5px] sm:text-xs font-semibold text-slate-500">Questions</span>
                </div>

                <div className="flex flex-col items-center justify-center px-1 sm:px-2 text-center">
                  <Award className="w-4 h-4 sm:w-6 sm:h-6 text-[#D97706] mb-0.5 sm:mb-1" />
                  <span className="text-sm sm:text-2xl font-black text-slate-900 leading-tight">
                    {mockMeta.marks || (allQuestions.length * marksPerQuestion)}
                  </span>
                  <span className="text-[9.5px] sm:text-xs font-semibold text-slate-500">Marks</span>
                </div>

                <div className="flex flex-col items-center justify-center px-1 sm:px-2 text-center">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-[#DC2626] flex items-center justify-center mb-0.5 sm:mb-1">
                    <span className="w-2 sm:w-2.5 h-0.5 bg-[#DC2626] rounded-full inline-block" />
                  </div>
                  <span className="text-sm sm:text-2xl font-black text-[#DC2626] leading-tight">
                    -{negativeMarkingRate}
                  </span>
                  <span className="text-[9px] sm:text-xs font-semibold text-slate-500 text-center leading-tight">
                    Negative Marking
                  </span>
                </div>
              </div>

              {/* Important Instructions Box */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 p-3.5 sm:p-6 shadow-xs space-y-2.5 sm:space-y-3.5">
                <div className="flex items-center gap-2 text-[#2563EB]">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
                    i
                  </div>
                  <h3 className="text-xs sm:text-base font-black text-slate-900">Important Instructions</h3>
                </div>

                <ul className="space-y-2 sm:space-y-3 text-[11px] sm:text-sm text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                    <span>This is a Computer Based Test (CBT).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                    <span>
                      The test contains {sectionsList.length || 4} sections with a total of{' '}
                      {allQuestions.length || mockMeta.questionsCount || 100} questions.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                    <span>
                      There is a negative marking of {negativeMarkingRate} marks for each wrong answer.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                    <span>You can mark a question for review and change your answer later.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                    <span>
                      The timer will run for {mockMeta.timeMinutes || 90} minutes. The test will auto submit once the time is over.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                    <span>Ensure a stable internet connection throughout the test.</span>
                  </li>
                </ul>
              </div>

              {/* Yellow tip banner */}
              <div className="bg-[#FEF3C7]/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#FDE68A] flex items-center gap-2.5 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                </div>
                <p className="text-[11px] sm:text-sm font-bold text-slate-800">
                  Read all instructions carefully before starting the test.
                </p>
              </div>

              {/* Agreement Checkbox */}
              <div className="pt-0.5">
                <label className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={instructionsAgreed}
                    onChange={(e) => setInstructionsAgreed(e.target.checked)}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-md border-slate-300 text-[#0B2545] focus:ring-[#0B2545] cursor-pointer"
                  />
                  <span className="text-[11.5px] sm:text-sm font-semibold text-slate-800">
                    I have read and understood the instructions.
                  </span>
                </label>
              </div>

              {/* Big CTA Agree & Continue matching Image 1 */}
              <button
                type="button"
                disabled={!instructionsAgreed}
                onClick={() => setIsExamStarted(true)}
                className="w-full py-3 sm:py-3.5 px-4 sm:px-6 bg-[#0B2545] hover:bg-[#071930] disabled:opacity-40 text-white rounded-xl sm:rounded-2xl text-xs sm:text-base font-black shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Agree &amp; Continue</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}

          {/* Exam Pattern Tab Content */}
          {instructionTab === 'pattern' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Examination Section Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                      <th className="py-2.5 px-3">Section</th>
                      <th className="py-2.5 px-3 text-center">Questions</th>
                      <th className="py-2.5 px-3 text-center">Marks</th>
                      <th className="py-2.5 px-3 text-right">Negative Marking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {sectionsList.map((sec, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-800">{sec.name}</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-700">{sec.count}</td>
                        <td className="py-3 px-3 text-center font-bold text-[#12345A]">
                          {sec.count * marksPerQuestion}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-rose-600">
                          -{negativeMarkingRate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FAQs Tab Content */}
          {instructionTab === 'faqs' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">What do question status colors mean?</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  White indicates unvisited questions. Red shows visited but unanswered questions. Green denotes successfully answered questions. Purple indicates marked for review. Half-green half-purple denotes answered and marked for review.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">How does negative marking work?</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For every incorrect response, {negativeMarkingRate} marks are deducted. Questions left unattempted carry no negative penalty.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Can I change my answer during the test?</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Yes, you can navigate back to any question anytime, select another option, or click "Clear" to remove your answer before submitting.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col">
      {/* =========================================================================
          TOP SECTION: TEST NAME, QUESTION COUNTER, TIMER, PAUSE, SUBMIT BUTTON
          ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E3EAF2] shadow-xs">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3 overflow-hidden">
          {/* Back & Title with Dynamic Mock Test Name */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={() => {
                if (activeMode === 'cbt' && !isSubmitted) {
                  setExitConfirmOpen(true);
                } else {
                  navigate('/mocks');
                }
              }}
              className="p-1 sm:p-2 rounded-full hover:bg-slate-100 text-slate-700 transition shrink-0 cursor-pointer"
              title="Return to Mock Tests"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>

            {/* Logo + Dynamic Mock Test Title underneath */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <img
                src="/assets/aistudio/examquesthub-logo.png"
                alt="ExamQuestHub"
                className="h-6 sm:h-9 w-auto object-contain shrink-0"
                onError={(e) => {
                  e.currentTarget.src = '/logo.png';
                }}
              />
              <div className="min-w-0">
                <div className="hidden xs:flex items-center gap-1 leading-none">
                  <span className="text-[11px] sm:text-xs font-black text-[#12345A] font-heading tracking-tight leading-none truncate">
                    Exam<span className="text-[#F2BE4F]">Quest</span>Hub
                  </span>
                </div>
                <h1 className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[110px] xs:max-w-[150px] sm:max-w-xs md:max-w-md lg:max-w-lg leading-tight">
                  {cleanMockTitle}
                </h1>
              </div>
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

          {/* Right Action: Pause & Red Countdown Timer Badge & Palette Button */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {activeMode === 'cbt' && !isSubmitted && (
              <>
                {/* Pause Button */}
                <button
                  type="button"
                  onClick={() => setIsPaused((prev) => !prev)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer active:scale-95 shrink-0"
                  title={isPaused ? 'Resume Test' : 'Pause Test'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 fill-current text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-slate-700" />}
                </button>

                {/* Red/Burgundy Timer Badge matching Image 2 */}
                <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#8B1E27] text-white font-mono font-black text-xs sm:text-sm shadow-xs shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              </>
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
              className="lg:hidden flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer active:scale-95 shrink-0"
              title="Open question palette"
            >
              <Menu className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Q {currentIndex + 1}/{allQuestions.length}</span>
            </button>

            {activeMode === 'cbt' && !isSubmitted && (
              <button
                onClick={() => setSubmitConfirmOpen(true)}
                className="hidden sm:inline-flex bg-[#12345A] hover:bg-[#0B1F3A] text-white px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Section Navigation Tabs matching Image 2 */}
      {activeMode === 'cbt' && !isSubmitted && sectionsList.length > 0 && (
        <div className="bg-white border-b border-[#E3EAF2] px-3 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
            {sectionsList.map((sec) => {
              const isCurrentSection = sec.name === currentSectionName;
              return (
                <button
                  key={sec.name}
                  type="button"
                  onClick={() => handleJumpToQuestion(sec.firstIndex)}
                  className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                    isCurrentSection
                      ? 'bg-[#0A48A5] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 bg-transparent'
                  }`}
                >
                  {sec.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
            <div className="bg-white rounded-3xl p-6 border border-[#E3EAF2] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#12345A]">
                    Verified Solutions &amp; Explanations
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete questions with official explanations grounded in authentic examination compilations.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {mockMeta?.isRandomizedPool && (
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="px-3.5 py-1.5 rounded-full bg-[#EAF3FF] hover:bg-[#DCEBFF] text-[#12345A] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>New Random Set</span>
                    </button>
                  )}

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
              </div>

              {mockMeta?.includedExams && mockMeta.includedExams.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">Exams &amp; Years in Set:</span>
                  {mockMeta.includedExams.map((ex) => (
                    <span
                      key={ex.label}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/80"
                    >
                      {ex.label} ({ex.count} Qs)
                    </span>
                  ))}
                </div>
              )}
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
              {/* Multi-Exam PYQ Coverage & New Random Set Strip */}
              {mockMeta?.includedExams && mockMeta.includedExams.length > 0 && (
                <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-[#E3EAF2] shadow-2xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#12345A] uppercase tracking-wider mr-0.5">
                      Exam &amp; Year Mix:
                    </span>
                    {mockMeta.includedExams.map((ex) => (
                      <span
                        key={ex.label}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10.5px] font-semibold border border-slate-200/80"
                      >
                        {ex.label} · {ex.count}
                      </span>
                    ))}
                  </div>
                  {activeMode === 'practice' && mockMeta?.isRandomizedPool && (
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF3FF] hover:bg-[#DCEBFF] text-[#12345A] text-[11px] font-bold transition cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>New Random Set</span>
                    </button>
                  )}
                </div>
              )}

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

              <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-[#E3EAF2] shadow-xs space-y-3.5 sm:space-y-5">
                {/* Question Info Bar matching Image 2 */}
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="text-xs sm:text-base font-black text-slate-900">
                      Question {currentIndex + 1} of {allQuestions.length}
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#15803D] text-[10px] sm:text-xs font-black">
                      +{marksPerQuestion.toFixed(2)}
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-[#FFE4E6] text-[#E11D48] text-[10px] sm:text-xs font-black">
                      -{negativeMarkingRate.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500">
                    <button
                      type="button"
                      onClick={() => toggleQuestionBookmark(currentQ.id)}
                      className={`p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer ${
                        bookmarkedQuestions[currentQ.id] ? 'text-amber-500' : 'text-slate-400'
                      }`}
                      title="Bookmark Question"
                    >
                      <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${bookmarkedQuestions[currentQ.id] ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobilePaletteOpen(true)}
                      className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition cursor-pointer"
                      title="Question palette"
                    >
                      <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* Exam / year / source attribution */}
                <QuestionAttribution question={currentQ} className="-mt-1.5 sm:-mt-2" />

                {/* Question Text with decreased mobile font size */}
                <div
                  className={`text-slate-900 font-bold leading-relaxed ${
                    fontSize === 'sm'
                      ? 'text-xs sm:text-sm'
                      : fontSize === 'lg'
                      ? 'text-sm sm:text-xl'
                      : 'text-xs sm:text-base md:text-lg'
                  }`}
                >
                  {typeof currentQ.question === 'string'
                    ? currentQ.question
                    : (typeof currentQ.question?.en === 'string'
                        ? currentQ.question.en
                        : (typeof currentQ.question?.te === 'string' ? currentQ.question.te : 'Question not available'))}
                  {currentQ.questionTe && typeof currentQ.questionTe === 'string' && (
                    <p className="mt-1.5 text-[11px] sm:text-sm font-normal text-slate-600 leading-relaxed">
                      {currentQ.questionTe}
                    </p>
                  )}
                </div>

                {/* Options List with Radio buttons matching Image 2 */}
                <div className="space-y-2 sm:space-y-3 pt-1">
                  {['A', 'B', 'C', 'D'].map((opt) => {
                    const isSelected = selectedAnswers[currentQ.id] === opt;
                    const isPractice = activeMode === 'practice';
                    const isPracticeAnswered = isPractice && selectedAnswers[currentQ.id];
                    const isCorrect = opt === currentQ.correctAnswer;

                    let optionStyle =
                      'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 text-slate-800';

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
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        disabled={isPracticeAnswered}
                        className={`w-full text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex items-center gap-2.5 sm:gap-3.5 cursor-pointer ${optionStyle}`}
                      >
                        <div
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isPracticeAnswered && isCorrect
                              ? 'border-emerald-600 bg-emerald-600'
                              : isPracticeAnswered && isSelected
                              ? 'border-rose-600 bg-rose-600'
                              : isSelected
                              ? 'border-[#12345A] bg-[#12345A]'
                              : 'border-slate-400 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />}
                        </div>

                        <span className="font-bold text-xs sm:text-base mr-0.5 sm:mr-1">{opt}.</span>

                        <span className="text-xs sm:text-base leading-snug flex-1">
                          {currentQ.options[opt]}
                          {currentQ.optionsTe?.[opt] && (
                            <span className="block text-[11px] sm:text-xs font-normal text-slate-500 mt-0.5">
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
                    className={`rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border transition-all space-y-2 animate-in fade-in duration-300 ${
                      selectedAnswers[currentQ.id] === currentQ.correctAnswer
                        ? 'bg-emerald-50/80 border-emerald-200'
                        : 'bg-amber-50/80 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedAnswers[currentQ.id] === currentQ.correctAnswer ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                          <span className="font-bold text-xs sm:text-sm text-emerald-900">
                            Correct Answer! (+1 Mark)
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" />
                          <span className="font-bold text-xs sm:text-sm text-rose-900">
                            Incorrect. Correct choice is ({currentQ.correctAnswer}):{' '}
                            {currentQ.options[currentQ.correctAnswer]}
                          </span>
                        </>
                      )}
                    </div>

                    {currentQ.explanation && (
                      <div className="text-[11px] sm:text-xs text-slate-700 leading-relaxed pt-1 border-t border-black/5 mt-2">
                        <strong className="text-slate-900">Detailed Explanation: </strong>
                        {currentQ.explanation}
                        {currentQ.explanationTe && (
                          <span className="block mt-1 text-slate-600">
                            {currentQ.explanationTe}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Desktop Primary Action Bar (Only visible on Desktop lg:flex - Single Unified Navigation) */}
                <div className="hidden lg:flex pt-4 border-t border-slate-100 items-center justify-between gap-3">
                  {/* Left Controls: Clear & Mark for Review */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleMarkReview}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        markedForReview[currentQ?.id]
                          ? 'bg-purple-100 text-purple-800 border-purple-400 font-black'
                          : 'border-[#A855F7] text-[#7E22CE] bg-purple-50/50 hover:bg-purple-100'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>{markedForReview[currentQ?.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClearResponse}
                      disabled={!selectedAnswers[currentQ?.id]}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-slate-600" />
                      <span>Clear Response</span>
                    </button>
                  </div>

                  {/* Right Controls: Previous & Save & Next / Submit Test */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold disabled:opacity-30 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {isLastQuestion ? (
                      <button
                        type="button"
                        onClick={() => setSubmitConfirmOpen(true)}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Test</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSaveAndNext}
                        className="px-6 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#071930] text-white text-sm font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                      >
                        <span>Save &amp; Next</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                RIGHT QUESTION PALETTE (Matching Image 2)
                ========================================================================= */}
            <aside className="hidden lg:block w-80 bg-white rounded-3xl p-5 border border-[#E3EAF2] shadow-xs space-y-4 shrink-0">
              {/* Palette / Summary Tabs matching Image 2 */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPaletteTab('palette')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    paletteTab === 'palette'
                      ? 'bg-[#1D4ED8] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Question Palette
                </button>
                <button
                  type="button"
                  onClick={() => setPaletteTab('summary')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    paletteTab === 'summary'
                      ? 'bg-[#1D4ED8] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Summary
                </button>
              </div>

              {paletteTab === 'palette' ? (
                <>
                  {/* Status Legend matching Image 2 */}
                  <div className="space-y-2 text-xs font-semibold text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-xs bg-white border border-slate-300 shrink-0" />
                        <span>Not Visited</span>
                      </div>
                      <span className="font-bold text-slate-800">{statusCounts.unvisited}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-xs bg-[#F87171] shrink-0" />
                        <span>Not Answered</span>
                      </div>
                      <span className="font-bold text-slate-800">{statusCounts.notAnswered}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-xs bg-[#22C55E] shrink-0" />
                        <span>Answered</span>
                      </div>
                      <span className="font-bold text-slate-800">{statusCounts.answered}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-xs bg-[#A855F7] shrink-0" />
                        <span>Marked for Review</span>
                      </div>
                      <span className="font-bold text-slate-800">{statusCounts.marked}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded-xs bg-gradient-to-br from-[#22C55E] 50% to-[#A855F7] 50% shrink-0" />
                        <span>Answered &amp; Marked</span>
                      </div>
                      <span className="font-bold text-slate-800">{statusCounts.markedAnswered}</span>
                    </div>
                  </div>

                  {/* 5-Column Question Grid matching Image 2 */}
                  <div className="max-h-[380px] overflow-y-auto pr-1">
                    <div className="grid grid-cols-5 gap-2">
                      {allQuestions.map((q, idx) => {
                        const status = getQuestionStatus(idx);
                        const isCurrent = idx === currentIndex;

                        let btnStyle = 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50';

                        if (isCurrent) {
                          btnStyle = 'bg-[#1D4ED8] text-white ring-2 ring-offset-2 ring-[#1D4ED8] font-black shadow-md scale-105 z-10';
                        } else if (status === 'marked-answered') {
                          btnStyle = 'bg-gradient-to-br from-[#22C55E] 50% to-[#A855F7] 50% text-white font-black shadow-2xs';
                        } else if (status === 'marked') {
                          btnStyle = 'bg-[#A855F7] text-white font-black shadow-2xs';
                        } else if (status === 'answered') {
                          btnStyle = 'bg-[#22C55E] text-white font-black shadow-2xs';
                        } else if (status === 'not-answered') {
                          btnStyle = 'bg-[#F87171] text-white font-black shadow-2xs';
                        }

                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => handleJumpToQuestion(idx)}
                            className={`h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${btnStyle}`}
                            title={`Question ${idx + 1} (${status})`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Attempted</span>
                    <span className="font-bold text-slate-800">{statusCounts.answered + statusCounts.markedAnswered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Remaining</span>
                    <span className="font-bold text-slate-800">{statusCounts.unvisited + statusCounts.notAnswered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Marked for Review</span>
                    <span className="font-bold text-purple-700">{statusCounts.marked + statusCounts.markedAnswered}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span className="text-slate-500">Total Questions</span>
                    <span className="font-bold text-[#12345A]">{allQuestions.length}</span>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              {activeMode === 'cbt' && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmitConfirmOpen(true)}
                    className="w-full py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
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
          STICKY MOBILE BOTTOM NAVIGATION BAR (FIXED & SINGLE PRIMARY MOBILE NAV)
          ========================================================================= */}
      {!isSubmitted && activeMode !== 'solutions' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E3EAF2] px-3 py-2.5 shadow-lg safe-area-pb">
          <div className="flex items-center justify-between gap-1.5 max-w-lg mx-auto">
            {/* 1. Previous (Disabled on Question 1) */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-2.5 sm:px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* 2. Mark for Review */}
            <button
              type="button"
              onClick={handleToggleMarkReview}
              className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                markedForReview[currentQ?.id]
                  ? 'bg-purple-100 text-purple-800 border-purple-400 font-black'
                  : 'bg-purple-50/60 text-[#7E22CE] border-purple-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>

            {/* 3. Clear Response */}
            <button
              type="button"
              onClick={handleClearResponse}
              disabled={!selectedAnswers[currentQ?.id]}
              className="px-2 sm:px-2.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 border border-slate-200 transition cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            {/* 4. Save & Next / Submit Test */}
            {isLastQuestion ? (
              <button
                type="button"
                onClick={() => setSubmitConfirmOpen(true)}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit Test</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
              >
                <span>Save &amp; Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
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

      {/* =========================================================================
          PAUSE MODAL DIALOG
          ========================================================================= */}
      {isPaused && !isSubmitted && activeMode === 'cbt' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Pause className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Test Is Paused</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your countdown timer is on hold. You can resume at any time.
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700">
              Time Remaining: <span className="font-mono font-black text-rose-600">{formatTime(timeRemaining)}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsPaused(false)}
              className="w-full py-2.5 rounded-full bg-[#12345A] hover:bg-[#0B1F3A] text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Test</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          EXIT CONFIRMATION MODAL
          ========================================================================= */}
      {exitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Leave Examination?</h3>
                <p className="text-xs text-slate-500">Your test progress will be saved in this browser session.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to exit? You can come back and resume before submitting.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExitConfirmOpen(false)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={() => {
                  setExitConfirmOpen(false);
                  navigate('/mocks');
                }}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                Exit to Mocks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
