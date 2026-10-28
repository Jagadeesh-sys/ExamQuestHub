import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Award,
  Layers,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getQuestions } from '../firebase/firestoreService.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';

export default function GKPracticePage() {
  const { t, getLocalized, language } = useLanguage();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: optionIndex }
  const [showExplanation, setShowExplanation] = useState({}); // { [qId]: boolean }
  const [selectedTopic, setSelectedTopic] = useState('All');

  useEffect(() => {
    async function loadQuiz() {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (err) {
        console.error('Failed to load GK questions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, []);

  const topics = ['All', ...new Set(questions.map((q) => q.topic).filter(Boolean))];

  const filteredQuestions = questions.filter((q) => {
    if (selectedTopic === 'All') return true;
    return q.topic === selectedTopic;
  });

  const currentQ = filteredQuestions[currentIndex];

  const handleSelectOption = (index) => {
    if (!currentQ) return;
    if (selectedAnswers[currentQ.id] !== undefined) return; // already answered
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: index
    }));
    // Auto show explanation upon selection
    setShowExplanation((prev) => ({
      ...prev,
      [currentQ.id]: true
    }));
  };

  const toggleExplanation = () => {
    if (!currentQ) return;
    setShowExplanation((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  // Score calculation
  const score = Object.entries(selectedAnswers).reduce((acc, [qId, chosenIndex]) => {
    const q = questions.find((item) => item.id === qId);
    if (q && q.correctAnswer === chosenIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const answeredCount = Object.keys(selectedAnswers).length;

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: t('gkModuleTitle') }]} />

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAF2] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12345A] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#F2BE4F]" />
            <span>Interactive Assessment Module</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#182B45]">
            {t('gkModuleTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {t('gkModuleSubtitle')}
          </p>
        </div>

        {/* Live Score Counter */}
        <div className="flex items-center gap-3 bg-[#F6F8FC] p-3 rounded-2xl border border-[#E3EAF2] self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-[#12345A] flex items-center justify-center text-[#F2BE4F]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              {t('yourScore')}
            </span>
            <div className="text-base font-bold text-[#182B45]">
              {score} / {answeredCount}
              <span className="text-xs text-slate-400 font-normal ml-1">
                ({answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Topics:</span>
        {topics.map((top) => (
          <button
            key={top}
            type="button"
            onClick={() => { setSelectedTopic(top); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTopic === top
                ? 'bg-[#12345A] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {top === 'All' ? 'All Topics' : top}
          </button>
        ))}
      </div>

      {/* Main Interactive Quiz Card */}
      {loading ? (
        <SkeletonLoader count={1} type="card" />
      ) : currentQ ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAF2] shadow-xs space-y-6">
          
          {/* Question Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#EAF3FF] text-[#12345A] font-bold">
                {t('question')} {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                {currentQ.topic}
              </span>
            </div>

            {/* Clear distinction between PYQ and Original Practice */}
            <div>
              {currentQ.isPyq ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{currentQ.examSource || t('pyqNote')}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#12345A] text-[11px] font-semibold border border-blue-200">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t('originalPracticeNote')}</span>
                </span>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-[#182B45] leading-relaxed">
              {getLocalized(currentQ.question)}
            </h2>

            {/* Show both languages if English or Telugu has secondary display */}
            {language === 'te' && currentQ.question?.en && (
              <p className="text-xs text-slate-400 italic">
                En: {currentQ.question.en}
              </p>
            )}
            {language === 'en' && currentQ.question?.te && (
              <p className="text-xs text-slate-400 telugu-text">
                తెలుగు: {currentQ.question.te}
              </p>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            {(() => {
              const opts = (language === 'te' && currentQ.options?.te) 
                ? currentQ.options.te 
                : (currentQ.options?.en || currentQ.options || []);

              const isAnswered = selectedAnswers[currentQ.id] !== undefined;
              const selectedOption = selectedAnswers[currentQ.id];
              const isCorrect = selectedOption === currentQ.correctAnswer;

              return opts.map((optText, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isTheCorrectOption = optIdx === currentQ.correctAnswer;

                let btnClasses = 'border-slate-200 bg-white hover:border-[#2468B4] hover:bg-slate-50 text-slate-800';

                if (isAnswered) {
                  if (isTheCorrectOption) {
                    btnClasses = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                  } else if (isSelected) {
                    btnClasses = 'border-red-400 bg-red-50 text-red-950';
                  } else {
                    btnClasses = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-start gap-3 ${btnClasses}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs shrink-0 text-slate-600 mt-0.5">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-snug">{optText}</span>

                    {isAnswered && isTheCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              });
            })()}
          </div>

          {/* Explanation Section */}
          {showExplanation[currentQ.id] && (
            <div className="p-5 rounded-2xl bg-[#EAF3FF] border border-[#2468B4]/20 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs font-bold text-[#12345A]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2468B4]" />
                  <span>Explanation & Key Concepts</span>
                </span>
                <span className="text-emerald-700">
                  Correct Answer: Option {String.fromCharCode(65 + currentQ.correctAnswer)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {getLocalized(currentQ.explanation)}
              </p>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={toggleExplanation}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-[#12345A] hover:bg-slate-50 font-semibold transition-colors active:bg-slate-100"
            >
              {showExplanation[currentQ.id] ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>{t('hideAnswer')}</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>{t('showAnswer')}</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 active:bg-slate-100"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('prevQuestion')}</span>
              </button>

              <button
                type="button"
                disabled={currentIndex === filteredQuestions.length - 1}
                onClick={() => setCurrentIndex((idx) => Math.min(filteredQuestions.length - 1, idx + 1))}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-5 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white font-semibold disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs active:scale-95"
              >
                <span>{t('nextQuestion')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Navigation Palette */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block mb-2">
              Question Palette:
            </span>
            <div className="flex flex-wrap gap-2">
              {filteredQuestions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;
                const isCorrect = isAnswered && selectedAnswers[q.id] === q.correctAnswer;

                let pillColor = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                if (isAnswered) {
                  pillColor = isCorrect
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-red-500 text-white font-bold';
                }
                if (isCurrent) {
                  pillColor += ' ring-2 ring-offset-2 ring-[#12345A]';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${pillColor}`}
                    aria-label={`Go to question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-500">
          <p>No questions found for the selected topic.</p>
          <button
            type="button"
            onClick={() => setSelectedTopic('All')}
            className="mt-3 text-xs font-semibold text-[#2468B4] hover:underline"
          >
            Show All Topics
          </button>
        </div>
      )}

      {/* Restart Button */}
      {answeredCount > 0 && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleResetQuiz}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-600 hover:text-[#12345A] text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('restartQuiz')}</span>
          </button>
        </div>
      )}

    </div>
  );
}
