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
  BadgeCheck
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

/**
 * Builds engine metadata for a Firestore-backed subject test
 * (`/mocks/<categoryId>--<subjectId>--<type>`).
 * Attribution fields are taken from the stored records only.
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
    // One minute per question keeps short subject tests from dragging.
    timeMinutes: Math.min(180, Math.max(5, questions.length)),
    marks: questions.length,
    pdfUrl: '',
    pdfFileName: '',
    subjectTest: true
  };
}

/**
 * Attribution strip for a question. Shows the examination name, year and
 * source exactly as stored — never inferred or generated.
 */
function QuestionAttribution({ question, className = '' }) {
  if (!question?.examName && !question?.source && !question?.paperUrl) return null;

  const verified = question.verificationStatus === MOCK_VERIFICATION.VERIFIED;

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

  // A test id of the form `categoryId--subjectId--type` is served from the
  // `mockQuestions` Firestore collection; everything else is a bundled CA mock.
  const parsedTest = useMemo(() => parseTestId(mockId), [mockId]);
  const isSubjectTest = Boolean(parsedTest);

  const [subjectTest, setSubjectTest] = useState({ loading: isSubjectTest, meta: null, questions: [] });

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

  const staticMeta = useMemo(
    () => MOCK_TESTS_METADATA.find((m) => m.id === mockId) || null,
    [mockId]
  );

  const mockMeta = isSubjectTest ? subjectTest.meta : staticMeta;

  const allQuestions = useMemo(() => {
    if (isSubjectTest) return subjectTest.questions;
    return staticMeta ? MOCK_QUESTIONS_DATABASE[staticMeta.id] || [] : [];
  }, [isSubjectTest, subjectTest.questions, staticMeta]);

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

  // Reset every attempt-scoped value whenever a different test is opened.
  useEffect(() => {
    if (!mockMeta) return;
    setCurrentIndex(0);
    setSelectedAnswers({});
    setMarkedForReview({});
    setVisitedQuestions(new Set([0]));
    setTimeRemaining(mockMeta.timeMinutes * 60);
    setIsSubmitted(false);
    setSolutionFilter('all');
  }, [mockMeta?.id]);

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
  }, [activeMode, isSubmitted]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs) => {
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
      // In practice mode, record answer to immediately reveal correctness
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQ.id]: letter
      }));
    } else if (activeMode === 'cbt') {
      // In CBT mode, toggle option if already selected
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

  const handleClearResponse = () => {
    if (!currentQ || isSubmitted) return;
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleToggleMarkReview = () => {
    if (!currentQ || isSubmitted) return;
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const handleNext = () => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentIndex(index);
    setMobilePaletteOpen(false);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setMarkedForReview({});
    setVisitedQuestions(new Set([0]));
    setCurrentIndex(0);
    setTimeRemaining(mockMeta.timeMinutes * 60);
    setIsSubmitted(false);
  };

  const handleSwitchMode = (newMode) => {
    setSearchParams({ mode: newMode });
    setActiveMode(newMode);
    setMobilePaletteOpen(false);
  };

  // Performance calculations
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
    // Standard 1 mark correct, -0.25 negative mark
    const score = Math.max(0, correct * 1 - incorrect * 0.25);
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const timeSpent = (mockMeta?.timeMinutes || 0) * 60 - timeRemaining;

    return {
      total: allQuestions.length,
      attempted,
      unattempted,
      correct,
      incorrect,
      score: Number(score.toFixed(2)),
      accuracy,
      timeSpent: Math.max(0, timeSpent)
    };
  }, [allQuestions, selectedAnswers, mockMeta?.timeMinutes, timeRemaining]);

  // Question Status styling for Palette
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

  // Status Counts for Summary
  const statusCounts = useMemo(() => {
    let answered = 0;
    let marked = 0;
    let notAnswered = 0;
    let unvisited = 0;

    allQuestions.forEach((q, idx) => {
      const status = getQuestionStatus(idx);
      if (status === 'answered' || status === 'marked-answered') answered++;
      if (status === 'marked' || status === 'marked-answered') marked++;
      if (status === 'not-answered') notAnswered++;
      if (status === 'unvisited') unvisited++;
    });

    return { answered, marked, notAnswered, unvisited };
  }, [allQuestions, selectedAnswers, markedForReview, visitedQuestions]);

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

  if (isSubjectTest && subjectTest.loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center gap-3">
        <Loader2 className="w-7 h-7 text-[#2468B4] animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading test questions…</p>
      </div>
    );
  }

  if (!mockMeta || !allQuestions || allQuestions.length === 0) {
    // Send the student back to the subject they came from so they can pick a
    // test type that actually has questions.
    const backTo = parsedTest
      ? `/mocks/category/${parsedTest.categoryId}/${parsedTest.subjectId}`
      : '/mocks';

    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">
          {mockMeta ? 'No Questions Published Yet' : 'Mock Test Not Found'}
        </h2>
        <p className="text-slate-500">
          {mockMeta
            ? 'This test does not have any published questions yet. Please check back soon.'
            : 'The requested test could not be loaded.'}
        </p>
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#12345A] text-white rounded-full font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{parsedTest ? 'Back to Subject' : 'Return to Mock Hub'}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col">
      {/* Top Test Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E3EAF2] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Back & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigate('/mocks')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition shrink-0"
              title="Return to Mock Hub"
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
                  {mockMeta.month}
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
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                activeMode === 'cbt'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CBT Exam
            </button>
            <button
              onClick={() => handleSwitchMode('practice')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                activeMode === 'practice'
                  ? 'bg-[#2468B4] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Practice Mode
            </button>
            <button
              onClick={() => handleSwitchMode('solutions')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
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
                title="Download original PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </a>
            )}

            {/* Mobile Palette Toggle Button */}
            <button
              onClick={() => setMobilePaletteOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
            >
              <Menu className="w-4 h-4" />
              <span>{currentIndex + 1}/{allQuestions.length}</span>
            </button>

            {activeMode === 'cbt' && !isSubmitted && (
              <button
                onClick={() => setSubmitConfirmOpen(true)}
                className="bg-[#12345A] hover:bg-[#0B1F3A] text-white px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Test Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-28 lg:pb-8 flex flex-col lg:flex-row gap-6">
        {/* If test is submitted in CBT mode, show Result & Performance Screen */}
        {isSubmitted && activeMode === 'cbt' ? (
          <div className="w-full space-y-6">
            {/* Scorecard Hero */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAF2] shadow-sm text-center relative overflow-hidden">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                  <Award className="w-8 h-8" />
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  Test Completed
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#12345A]">
                  Your Score: <span className="text-[#2468B4]">{stats.score}</span> / {mockMeta.marks}
                </h2>

                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Marking Scheme: +1 for correct answer, -0.25 negative marking for incorrect answer.
                </p>

                {/* Performance Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="text-2xl font-black text-emerald-700">{stats.correct}</div>
                    <div className="text-xs font-semibold text-emerald-800">Correct</div>
                  </div>

                  <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                    <div className="text-2xl font-black text-rose-700">{stats.incorrect}</div>
                    <div className="text-xs font-semibold text-rose-800">Incorrect (-{stats.incorrect * 0.25})</div>
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

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => handleSwitchMode('solutions')}
                    className="px-5 py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white rounded-full font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Review All Solutions</span>
                  </button>

                  <button
                    onClick={handleRetake}
                    className="px-5 py-2.5 bg-white border border-[#E3EAF2] hover:bg-slate-50 text-slate-800 rounded-full font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Mock Test</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Questions Detailed Review Table/List */}
            <div className="bg-white rounded-3xl p-6 border border-[#E3EAF2] space-y-4">
              <h3 className="text-lg font-black text-[#12345A]">Detailed Question Review</h3>
              <div className="space-y-4">
                {allQuestions.map((q, idx) => {
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  const isAttempted = userAns !== undefined;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border transition ${
                        !isAttempted
                          ? 'border-slate-200 bg-slate-50/60'
                          : isCorrect
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-rose-200 bg-rose-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-600">
                          Q{idx + 1}. [{q.topic}]
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            !isAttempted
                              ? 'bg-slate-200 text-slate-700'
                              : isCorrect
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {!isAttempted ? 'Skipped' : isCorrect ? 'Correct (+1)' : 'Incorrect (-0.25)'}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-slate-900 mb-2">{q.question}</p>

                      <QuestionAttribution question={q} className="mb-3" />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                        {['A', 'B', 'C', 'D'].map((opt) => (
                          <div
                            key={opt}
                            className={`p-2 rounded-xl border flex items-center gap-2 ${
                              opt === q.correctAnswer
                                ? 'bg-emerald-100 border-emerald-300 font-bold text-emerald-900'
                                : userAns === opt
                                ? 'bg-rose-100 border-rose-300 font-bold text-rose-900'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center font-bold">
                              {opt}
                            </span>
                            <span>{q.options[opt]}</span>
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div className="bg-white/80 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                          <strong className="text-slate-900">Explanation: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : activeMode === 'solutions' ? (
          /* Solutions Reader Mode */
          <div className="w-full space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E3EAF2] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#12345A]">
                  Verified Solutions & Explanations
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Complete questions with official explanations grounded in authentic compilations.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-[#F6F8FC] p-1 rounded-full border border-[#E3EAF2] text-xs font-bold">
                <button
                  onClick={() => setSolutionFilter('all')}
                  className={`px-3 py-1 rounded-full transition ${
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
                      className={`px-3 py-1 rounded-full transition ${
                        solutionFilter === 'correct'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Correct ({stats.correct})
                    </button>
                    <button
                      onClick={() => setSolutionFilter('incorrect')}
                      className={`px-3 py-1 rounded-full transition ${
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
          /* CBT & Practice Interactive Engine */
          <>
            {/* Left / Main Question Area */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#E3EAF2] shadow-xs space-y-5">
                {/* Question Info Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E3EAF2] gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-[#12345A] text-white text-xs font-bold">
                      Q {currentIndex + 1} of {allQuestions.length}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {currentQ.topic}
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
                        {markedForReview[currentQ.id] ? 'Marked' : 'Mark for Review'}
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

                {/* Exam / year / source attribution (PYQs only) */}
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

                {/* Options List */}
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
                        'bg-[#EAF3FF] border-[#2468B4] text-[#12345A] font-bold shadow-2xs';
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

                {/* Practice Mode Instant Explanation Box */}
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
              </div>

              {/* Bottom Desktop Navigation Toolbar */}
              <div className="hidden lg:flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E3EAF2] shadow-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleClearResponse}
                    disabled={!selectedAnswers[currentQ.id]}
                    className="px-3.5 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition cursor-pointer"
                  >
                    Clear Response
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === allQuestions.length - 1}
                    className="px-5 py-2 rounded-full bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Question Palette (Desktop) */}
            <aside className="hidden lg:block w-80 bg-white rounded-3xl p-5 border border-[#E3EAF2] shadow-xs space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Question Palette</h3>
                <span className="text-xs font-semibold text-slate-500">
                  {statusCounts.answered} / {allQuestions.length} Done
                </span>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 bg-[#F6F8FC] p-3 rounded-2xl border border-[#E3EAF2]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Answered ({statusCounts.answered})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0" />
                  <span>Not Answered ({statusCounts.notAnswered})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-purple-500 shrink-0" />
                  <span>Marked ({statusCounts.marked})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-300 shrink-0" />
                  <span>Not Visited ({statusCounts.unvisited})</span>
                </div>
              </div>

              {/* Question Number Grid */}
              <div className="max-h-[380px] overflow-y-auto pr-1">
                <div className="grid grid-cols-5 gap-2">
                  {allQuestions.map((q, idx) => {
                    const status = getQuestionStatus(idx);
                    const isCurrent = idx === currentIndex;

                    let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                    if (status === 'answered') {
                      btnStyle = 'bg-emerald-600 text-white font-bold';
                    } else if (status === 'marked-answered') {
                      btnStyle = 'bg-purple-600 text-white font-bold ring-2 ring-emerald-400';
                    } else if (status === 'marked') {
                      btnStyle = 'bg-purple-500 text-white font-bold';
                    } else if (status === 'not-answered') {
                      btnStyle = 'bg-rose-500 text-white font-bold';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer ${btnStyle} ${
                          isCurrent ? 'ring-2 ring-offset-2 ring-[#12345A] scale-105' : ''
                        }`}
                      >
                        {idx + 1}
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
                    className="w-full py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white rounded-full font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    Submit Complete Test
                  </button>
                </div>
              )}
            </aside>
          </>
        )}
      </main>

      {/* Sticky Mobile Bottom Navigation Bar (Visible only when in CBT/Practice and not submitted) */}
      {!isSubmitted && activeMode !== 'solutions' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E3EAF2] px-3 py-2 shadow-lg safe-area-pb">
          <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <button
              onClick={handleToggleMarkReview}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
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
              className="px-2.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-30"
            >
              Clear
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === allQuestions.length - 1}
              className="px-4 py-2 rounded-xl bg-[#12345A] text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Question Palette Drawer / Bottom Sheet */}
      {mobilePaletteOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Question Navigation</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#12345A]">
                  {statusCounts.answered} / {allQuestions.length} Done
                </span>
              </div>
              <button
                onClick={() => setMobilePaletteOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Legend */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 bg-[#F6F8FC] p-2.5 rounded-xl">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Marked</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>Unvisited</span>
              </div>
            </div>

            {/* Mobile Grid */}
            <div className="overflow-y-auto max-h-[50vh] pr-1 py-1">
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {allQuestions.map((q, idx) => {
                  const status = getQuestionStatus(idx);
                  const isCurrent = idx === currentIndex;

                  let btnStyle = 'bg-slate-100 text-slate-700';
                  if (status === 'answered') {
                    btnStyle = 'bg-emerald-600 text-white font-bold';
                  } else if (status === 'marked-answered') {
                    btnStyle = 'bg-purple-600 text-white font-bold ring-2 ring-emerald-400';
                  } else if (status === 'marked') {
                    btnStyle = 'bg-purple-500 text-white font-bold';
                  } else if (status === 'not-answered') {
                    btnStyle = 'bg-rose-500 text-white font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`h-9 rounded-xl text-xs flex items-center justify-center transition-all ${btnStyle} ${
                        isCurrent ? 'ring-2 ring-offset-2 ring-[#12345A] font-black' : ''
                      }`}
                    >
                      {idx + 1}
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
                className="w-full py-2.5 bg-[#12345A] text-white rounded-full font-bold text-xs shadow-xs"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {submitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Confirm Test Submission</h3>
                <p className="text-xs text-slate-500">Are you sure you want to finish?</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-[#F6F8FC] p-3 rounded-2xl border border-[#E3EAF2]">
              <div className="p-2 bg-white rounded-xl">
                <div className="text-slate-500">Answered:</div>
                <div className="text-base font-black text-emerald-600">{statusCounts.answered}</div>
              </div>
              <div className="p-2 bg-white rounded-xl">
                <div className="text-slate-500">Unanswered:</div>
                <div className="text-base font-black text-rose-600">
                  {allQuestions.length - statusCounts.answered}
                </div>
              </div>
              <div className="p-2 bg-white rounded-xl">
                <div className="text-slate-500">Marked for Review:</div>
                <div className="text-base font-black text-purple-600">{statusCounts.marked}</div>
              </div>
              <div className="p-2 bg-white rounded-xl">
                <div className="text-slate-500">Time Left:</div>
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
                className="px-5 py-2 rounded-full bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold transition shadow-xs cursor-pointer"
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
