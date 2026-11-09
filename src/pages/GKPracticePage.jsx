import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Lightbulb,
  Trophy,
  Target,
  LayoutGrid,
  Landmark,
  Globe,
  TrendingUp,
  Atom,
  Cpu,
  Newspaper,
  Check,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Info,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getQuestions } from '../firebase/firestoreService.js';
import SkeletonLoader from '../components/SkeletonLoader.jsx';

export default function GKPracticePage() {
  const { t, getLocalized, language, setLanguage } = useLanguage();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: optionIndex }
  const [selectedTopic, setSelectedTopic] = useState('All Topics');

  const topicsContainerRef = useRef(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const data = await getQuestions();
        setQuestions(data || []);
      } catch (err) {
        console.error('Failed to load GK questions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, []);

  const TOPIC_CONFIG = [
    { label: 'All Topics', icon: LayoutGrid, key: 'All' },
    { label: 'Indian Polity', icon: Landmark, key: 'Polity' },
    { label: 'Indian History', icon: Landmark, key: 'History' },
    { label: 'Geography', icon: Globe, key: 'Geography' },
    { label: 'Economy', icon: TrendingUp, key: 'Economy' },
    { label: 'General Science', icon: Atom, key: 'Science' },
    { label: 'Computer Science', icon: Cpu, key: 'Computer' },
    { label: 'Current Affairs', icon: Newspaper, key: 'Current Affairs' },
  ];

  const filteredQuestions = questions.filter((q) => {
    if (selectedTopic === 'All Topics' || selectedTopic === 'All') return true;
    const qTopic = (q.topic || '').toLowerCase();
    const sel = selectedTopic.toLowerCase();

    if (sel.includes('polity')) return qTopic.includes('polity');
    if (sel.includes('history')) return qTopic.includes('history');
    if (sel.includes('geography')) return qTopic.includes('geography');
    if (sel.includes('economy')) return qTopic.includes('economy');
    if (sel.includes('science')) return qTopic.includes('science');
    if (sel.includes('computer')) return qTopic.includes('computer');
    if (sel.includes('current')) return qTopic.includes('current');
    return qTopic.includes(sel);
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (index) => {
    if (!currentQ) return;
    if (selectedAnswers[currentQ.id] !== undefined) return; // already answered
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: index
    }));
  };

  // Score & Accuracy calculation
  const score = Object.entries(selectedAnswers).reduce((acc, [qId, chosenIndex]) => {
    const q = questions.find((item) => item.id === qId);
    if (q && q.correctAnswer === chosenIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const answeredCount = Object.keys(selectedAnswers).length;
  const accuracy = answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0;

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
  };

  const handleScrollTopicsRight = () => {
    if (topicsContainerRef.current) {
      topicsContainerRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] relative pb-24 sm:pb-20 overflow-x-hidden text-[#0B1F3A]">
      {/* Background gradient backdrop matching Home Page & Mock Tests top shading merge exactly */}
      <div
        className="absolute top-0 left-0 right-0 h-[480px] sm:h-[540px] bg-gradient-to-b from-[#1F224D] via-[#2D457B] via-60% via-[#BFD7F8]/40 to-[#F4F7FC] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[880px] mx-auto px-3.5 sm:px-6 py-3.5 sm:py-6 space-y-4 sm:space-y-6 relative z-10">

        {/* 1. BREADCRUMBS */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-white/80 pt-0.5">
          <Link to="/" className="flex items-center gap-1.5 hover:text-[#F2BE4F] transition-colors text-white/90">
            <Home className="w-3.5 h-3.5 text-[#F2BE4F]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-white/60" />
          <span className="text-white font-bold">Daily General Knowledge Practice</span>
        </nav>

        {/* 2. HERO BANNER CARD (Exact match from reference image_00b68d66.png) */}
        <div className="bg-gradient-to-r from-[#F0F6FD] via-[#E8F3FD] to-[#DCECFB] rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-[#D5E5F7] shadow-sm relative overflow-hidden">
          {/* Subtle light effect on the right behind illustration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-white/60 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between gap-3 sm:gap-6 relative z-10">
            <div className="space-y-2 sm:space-y-3 max-w-[64%] sm:max-w-xl">
              {/* Top pill badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/80 backdrop-blur-xs border border-amber-200/80 shadow-2xs">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-100/90 text-amber-500 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-500" />
                </div>
                <span className="text-[9px] sm:text-[11px] font-black text-[#1864AB] tracking-wider sm:tracking-widest uppercase truncate">
                  INTERACTIVE ASSESSMENT MODULE
                </span>
              </div>

              {/* Title */}
              <h1 className="font-heading font-black text-lg sm:text-3xl lg:text-[32px] text-[#0B1F3A] leading-tight tracking-tight">
                Daily General Knowledge Practice
              </h1>

              {/* Subtitle */}
              <p className={`text-slate-600 text-xs sm:text-[13px] leading-relaxed max-w-md font-medium line-clamp-2 sm:line-clamp-none ${language === 'te' ? 'telugu-text font-telugu' : ''}`}>
                {language === 'te'
                  ? 'ధృవీకరించబడిన వివరణలతో టాపిక్ వారీ బహుళైచ్ఛిక ప్రశ్నలు.'
                  : 'Topic-wise multiple-choice questions with verified explanations in English and Telugu.'}
              </p>

              {/* Desktop/Tablet Score Card - Sits inside banner on left bottom (matching image_00b68d66.png) */}
              <div className="hidden sm:block pt-1">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 shadow-2xs inline-flex items-center gap-3 sm:gap-4">
                  {/* Score */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#0B4F9C] flex items-center justify-center text-amber-300 shadow-2xs shrink-0">
                      <Trophy className="w-5 h-5 fill-amber-300 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">
                        YOUR SCORE
                      </span>
                      <span className="font-black text-base text-[#0B1F3A]">
                        {score} / {answeredCount}
                      </span>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-px h-8 bg-slate-200" />

                  {/* Accuracy */}
                  <div className="flex items-center gap-2.5 pr-2">
                    <div className="w-7 h-7 flex items-center justify-center text-[#0B4F9C] shrink-0">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">
                        Accuracy
                      </span>
                      <span className="font-black text-base text-[#0B4F9C]">
                        {accuracy}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 3D Illustration: Sits nicely on the right side like a true banner */}
            <div className="shrink-0 flex items-center justify-end">
              <img
                src="/assets/aistudio/practice_illustration.png"
                alt="Learn Practice Improve"
                className="w-28 sm:w-60 md:w-72 object-contain drop-shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Mobile Score Card: Rendered directly BELOW the banner ("give baner then below add score card") */}
        <div className="block sm:hidden">
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2">
            {/* Score */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0B4F9C] flex items-center justify-center text-amber-300 shadow-2xs shrink-0">
                <Trophy className="w-4 h-4 fill-amber-300 text-amber-400" />
              </div>
              <div>
                <span className="text-[8.5px] font-black uppercase text-slate-500 tracking-wider block">
                  YOUR SCORE
                </span>
                <span className="font-black text-sm text-[#0B1F3A]">
                  {score} / {answeredCount}
                </span>
              </div>
            </div>

            <div className="w-px h-7 bg-slate-200 shrink-0" />

            {/* Accuracy */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 flex items-center justify-center text-[#0B4F9C] shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold block">
                  Accuracy
                </span>
                <span className="font-black text-sm text-[#0B4F9C]">
                  {accuracy}%
                </span>
              </div>
            </div>

            <div className="w-px h-7 bg-slate-200 shrink-0" />

            {/* Answered / Reset */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[9px] text-slate-500 font-bold block">
                  Progress
                </span>
                <span className="text-xs font-bold text-[#1864AB]">
                  {answeredCount}/{filteredQuestions.length}
                </span>
              </div>
              {answeredCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Reset Quiz"
                  aria-label="Reset Quiz"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. TOPICS FILTER PILLS BAR (Exact match with icons and right arrow) */}
        <div className="flex items-center gap-2">
          <div
            ref={topicsContainerRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1 scroll-smooth"
          >
            {TOPIC_CONFIG.map((tItem) => {
              const Icon = tItem.icon;
              const isSelected = selectedTopic === tItem.label;
              return (
                <button
                  key={tItem.label}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(tItem.label);
                    setCurrentIndex(0);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : 'bg-white border border-slate-200/90 text-[#182B45] hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tItem.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow Chevron Button */}
          <button
            type="button"
            onClick={handleScrollTopicsRight}
            aria-label="Scroll topics"
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4. MAIN INTERACTIVE QUESTION CARD (Exact match from image_dc5db239.png) */}
        {loading ? (
          <SkeletonLoader count={1} type="card" />
        ) : currentQ ? (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">

            {/* Top Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Pill 1: Question counter */}
                <span className="px-3.5 py-1.5 rounded-full bg-[#EBF3FC] text-[#0B4F9C] font-extrabold text-xs">
                  {language === 'te'
                    ? `ప్రశ్న ${currentIndex + 1} / ${filteredQuestions.length}`
                    : `Question ${currentIndex + 1} of ${filteredQuestions.length}`}
                </span>

                {/* Pill 2: Topic */}
                <span className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[#182B45] font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                  <Landmark className="w-3.5 h-3.5 text-[#0B4F9C]" />
                  <span>{currentQ.topic || 'Indian Polity'}</span>
                </span>
              </div>

              {/* Right: In-Card Language Switcher & Progress */}
              <div className="flex items-center gap-3">
                {/* In-Card Language Switcher: Toggle between English and Telugu */}
                <div className="inline-flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-200/90 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer text-[11px] ${
                      language === 'en'
                        ? 'bg-[#12345A] text-white shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-[#12345A]'
                    }`}
                    title="View question in English only"
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('te')}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer text-[11px] font-telugu ${
                      language === 'te'
                        ? 'bg-[#12345A] text-white shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-[#12345A]'
                    }`}
                    title="కేవలం తెలుగులో మాత్రమే చూపించు"
                  >
                    తెలుగు
                  </button>
                </div>

                {/* Progress bar */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-20 sm:w-24 h-2 rounded-full bg-[#E2EDFA] relative overflow-hidden">
                    <div
                      className="h-full bg-[#1864AB] rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Informational Tip Banner */}
            <div className="bg-[#EDF5FD] rounded-xl p-3 sm:p-3.5 flex items-start gap-2.5 border border-[#D0E4FA]/70 text-[#1864AB]">
              <div className="w-5 h-5 rounded-full bg-[#1864AB] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5 fill-current text-[#1864AB]" />
              </div>
              <div className="text-xs leading-snug">
                <p className="font-bold text-[#1864AB]">
                  {language === 'te'
                    ? 'ప్రతి ప్రశ్నకు ధృవీకరించబడిన వివరణ ఇవ్వబడింది.'
                    : 'Each question comes with a verified explanation.'}
                </p>
                <p className="text-slate-600 font-medium">
                  {language === 'te'
                    ? 'పోటీ పరీక్షల తయారీ కోసం ప్రత్యేకంగా రూపొందించబడింది.'
                    : 'For competitive exams preparation.'}
                </p>
              </div>
            </div>

            {/* Question Text (Single Language Display: Telugu only or English only) */}
            <div className="flex items-start gap-3 pt-1">
              {/* Q1 Blue Badge */}
              <div className="w-8 h-8 rounded-full bg-[#0B4F9C] text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                Q{currentIndex + 1}
              </div>

              <div className="space-y-1.5 flex-1">
                <h2
                  className={`font-heading font-black text-base sm:text-xl text-[#0B1F3A] leading-snug ${
                    language === 'te' ? 'telugu-text font-telugu' : ''
                  }`}
                >
                  {language === 'te'
                    ? (currentQ.question?.te || currentQ.question?.en || (typeof currentQ.question === 'string' ? currentQ.question : ''))
                    : (currentQ.question?.en || (typeof currentQ.question === 'string' ? currentQ.question : currentQ.question?.te || ''))}
                </h2>
              </div>
            </div>

            {/* Options List (A, B, C, D) */}
            <div className="space-y-2.5 pt-1">
              {(() => {
                const hasTeOpts = language === 'te' && Array.isArray(currentQ.options?.te) && currentQ.options.te.length > 0;
                const opts = hasTeOpts
                  ? currentQ.options.te
                  : (currentQ.options?.en || (Array.isArray(currentQ.options) ? currentQ.options : []));

                const isAnswered = selectedAnswers[currentQ.id] !== undefined;
                const userChoice = selectedAnswers[currentQ.id];

                return opts.map((optText, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  const isCorrectAnswer = optIdx === currentQ.correctAnswer;

                  let borderClass = 'border-slate-200/90 bg-white hover:border-[#1864AB]/50 hover:bg-slate-50/70 text-slate-800';

                  if (isAnswered) {
                    if (isSelected) {
                      borderClass = 'border-[#2468B4] bg-[#F4F9FE] ring-1 ring-[#2468B4] text-slate-900';
                    } else if (isCorrectAnswer) {
                      borderClass = 'border-emerald-500 bg-emerald-50/30 text-emerald-950';
                    } else {
                      borderClass = 'border-slate-200 bg-white opacity-60 text-slate-600';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center gap-3 relative cursor-pointer select-none active:scale-[0.99] ${borderClass}`}
                    >
                      {/* Radio Circle */}
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#0B4F9C] flex items-center justify-center shrink-0 bg-white">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0B4F9C]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                      )}

                      {/* Letter Badge A, B, C, D */}
                      <span className="w-6 h-6 rounded-md bg-[#EDF5FD] text-[#0B4F9C] font-black text-xs flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>

                      {/* Option Text */}
                      <span className={`flex-1 font-semibold text-xs sm:text-sm text-slate-800 leading-snug ${language === 'te' ? 'telugu-text font-telugu' : ''}`}>
                        {optText}
                      </span>

                      {/* Right Indicator (Green Checkmark on correct answer when answered) */}
                      {isAnswered && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-rose-500 fill-rose-100 shrink-0" />
                      )}
                    </button>
                  );
                });
              })()}
            </div>

            {/* Explanation & Correct Answer Box */}
            {selectedAnswers[currentQ.id] !== undefined && (
              <div className="bg-[#F0F6FD] rounded-2xl p-4 sm:p-5 border border-[#D5E5F7] flex flex-col md:flex-row gap-4 md:items-start animate-in fade-in duration-200">
                {/* Left: Correct Answer */}
                <div className="flex items-start gap-2.5 md:w-5/12 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                      {language === 'te' ? 'సరైన సమాధానం' : 'Correct Answer'}
                    </span>
                    <p className={`font-heading font-black text-xs sm:text-sm text-[#0B1F3A] mt-0.5 ${language === 'te' ? 'telugu-text font-telugu' : ''}`}>
                      {String.fromCharCode(65 + currentQ.correctAnswer)}.{' '}
                      {(() => {
                        const hasTeOpts = language === 'te' && Array.isArray(currentQ.options?.te) && currentQ.options.te.length > 0;
                        const opts = hasTeOpts
                          ? currentQ.options.te
                          : (currentQ.options?.en || (Array.isArray(currentQ.options) ? currentQ.options : []));
                        return opts[currentQ.correctAnswer] || '';
                      })()}
                    </p>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px self-stretch bg-slate-200/80" />

                {/* Right: Explanation */}
                <div className="flex items-start gap-2.5 flex-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0B4F9C] flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-[#0B4F9C] uppercase tracking-wider block">
                      {language === 'te' ? 'వివరణ' : 'Explanation'}
                    </span>
                    <p className={`text-slate-600 text-xs sm:text-[13px] leading-relaxed mt-0.5 font-normal ${language === 'te' ? 'telugu-text font-telugu' : ''}`}>
                      {language === 'te'
                        ? (currentQ.explanation?.te || currentQ.explanation?.en || (typeof currentQ.explanation === 'string' ? currentQ.explanation : ''))
                        : (currentQ.explanation?.en || (typeof currentQ.explanation === 'string' ? currentQ.explanation : currentQ.explanation?.te || ''))}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Navigation Buttons Row (Previous Question / Next Question) */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
                className={`px-4 sm:px-5 py-2.5 rounded-full bg-white border border-slate-300 text-[#182B45] font-bold text-xs hover:bg-slate-50 flex items-center gap-2 shadow-2xs disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer ${
                  language === 'te' ? 'telugu-text font-telugu' : ''
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'te' ? 'మునుపటి ప్రశ్న' : 'Previous Question'}</span>
              </button>

              <button
                type="button"
                disabled={currentIndex === filteredQuestions.length - 1}
                onClick={() => setCurrentIndex((idx) => Math.min(filteredQuestions.length - 1, idx + 1))}
                className={`px-5 sm:px-6 py-2.5 rounded-full bg-[#0B4F9C] hover:bg-[#083D7A] text-white font-black text-xs flex items-center gap-2 shadow-xs disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer ${
                  language === 'te' ? 'telugu-text font-telugu' : ''
                }`}
              >
                <span>{language === 'te' ? 'తదుపరి ప్రశ్న' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-500">
            <p>No questions found for the selected topic.</p>
            <button
              type="button"
              onClick={() => setSelectedTopic('All Topics')}
              className="mt-3 text-xs font-semibold text-[#0B4F9C] hover:underline"
            >
              Show All Topics
            </button>
          </div>
        )}

        {/* Reset Quiz Button */}
        {answeredCount > 0 && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-600 hover:text-[#0B1F3A] hover:bg-white text-xs font-semibold transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Practice Quiz</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
