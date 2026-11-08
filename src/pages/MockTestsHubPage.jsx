import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Layers,
  Calendar,
  LayoutGrid,
  Play,
  BookOpen,
  Bookmark,
  Monitor,
  Clock,
  Flame,
  ChevronRight,
  SlidersHorizontal,
  Search,
  Landmark,
  BrainCircuit,
  Calculator,
  FlaskConical,
  Code2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getAllShifts } from '../services/rrbMockService.js';
import { MOCK_TESTS_METADATA } from '../data/mockTestsMetadata.js';
import MockTestCard from '../components/MockTestCard.jsx';

export default function MockTestsHubPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Subject: null | 'general-knowledge' | 'reasoning' | 'quantitative-aptitude' | 'general-science' | 'computer-science'
  const initialSubject = searchParams.get('subject') || null;
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);

  // Active Main Tab: 'mocks' (Mock Tests 75) | 'practice' (Practice Tests 320) | 'pyqs' (PYQs 101 Shifts)
  const initialTab = searchParams.get('tab') || 'mocks';
  const [activeMainTab, setActiveMainTab] = useState(initialTab);

  // Shifts Data
  const [shifts, setShifts] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('eqh_bookmarked_mocks') || '["popular-rrb-1", "popular-ssc-1"]');
    } catch {
      return ['popular-rrb-1', 'popular-ssc-1'];
    }
  });

  // Secondary search & filter states
  const [testSearch, setTestSearch] = useState('');
  const [testCategoryFilter, setTestCategoryFilter] = useState('all'); // 'all' | 'full' | 'sectional' | 'quick'
  const [showAllTests, setShowAllTests] = useState(false);
  const [showAdditionalBanks, setShowAdditionalBanks] = useState(false);

  useEffect(() => {
    setShifts(getAllShifts());
  }, []);

  const toggleBookmark = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('eqh_bookmarked_mocks', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSelectSubject = (subId) => {
    if (selectedSubject === subId) {
      setSelectedSubject(null);
      setSearchParams({ tab: activeMainTab });
    } else {
      setSelectedSubject(subId);
      setSearchParams({ tab: activeMainTab, subject: subId });
      setShowAllTests(true);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveMainTab(tabId);
    setSearchParams(selectedSubject ? { tab: tabId, subject: selectedSubject } : { tab: tabId });
  };

  // 5 Subjects matching the reference image
  const subjectList = useMemo(() => [
    {
      id: 'general-knowledge',
      title: 'General Knowledge',
      pillText: '4.9k Qs',
      icon: Landmark,
      cardBg: 'bg-[#FFF9ED] border-[#FDE68A] hover:border-[#F59E0B]',
      activeCardBg: 'bg-[#FFF3D6] border-[#F59E0B] ring-2 ring-[#F59E0B]/30',
      iconBg: 'text-[#D97706]',
      pillBg: 'bg-[#FEF3C7] text-[#B45309]',
      description: 'History, Polity, Geography, Economy, Schemes & Static GK'
    },
    {
      id: 'reasoning',
      title: 'Reasoning',
      pillText: '2.2k Qs',
      icon: BrainCircuit,
      cardBg: 'bg-[#F0F6FF] border-[#BFDBFE] hover:border-[#3B82F6]',
      activeCardBg: 'bg-[#E1EDFE] border-[#3B82F6] ring-2 ring-[#3B82F6]/30',
      iconBg: 'text-[#2563EB]',
      pillBg: 'bg-[#DBEAFE] text-[#1D4ED8]',
      description: 'Analogy, Coding-Decoding, Series, Syllogisms & Blood Relations'
    },
    {
      id: 'quantitative-aptitude',
      title: 'Quant / Maths',
      pillText: '2.4k Qs',
      icon: Calculator,
      cardBg: 'bg-[#ECFDF5] border-[#A7F3D0] hover:border-[#10B981]',
      activeCardBg: 'bg-[#D1FAE5] border-[#10B981] ring-2 ring-[#10B981]/30',
      iconBg: 'text-[#059669]',
      pillBg: 'bg-[#D1FAE5] text-[#047857]',
      description: 'Arithmetic, Percentage, Profit & Loss, SI/CI, Algebra & Geometry'
    },
    {
      id: 'general-science',
      title: 'General Science',
      pillText: '738 Qs',
      icon: FlaskConical,
      cardBg: 'bg-[#F5F3FF] border-[#DDD6FE] hover:border-[#8B5CF6]',
      activeCardBg: 'bg-[#EDE9FE] border-[#8B5CF6] ring-2 ring-[#8B5CF6]/30',
      iconBg: 'text-[#7C3AED]',
      pillBg: 'bg-[#EDE9FE] text-[#6D28D9]',
      description: 'Physics, Chemistry, Biology & Applied Scientific Principles'
    },
    {
      id: 'computer-science',
      title: 'Computer Science',
      pillText: '568 Qs',
      icon: Code2,
      cardBg: 'bg-[#F0F9FF] border-[#BAE6FD] hover:border-[#0284C7]',
      activeCardBg: 'bg-[#E0F2FE] border-[#0284C7] ring-2 ring-[#0284C7]/30',
      iconBg: 'text-[#0284C7]',
      pillBg: 'bg-[#E0F2FE] text-[#0369A1]',
      description: 'Computer Fundamentals, Hardware, OS, Networking & MS Office'
    }
  ], []);

  // 4 Popular Mock Tests matching the reference image
  const popularMockTests = useMemo(() => [
    {
      id: 'popular-rrb-1',
      agencyBadge: 'RRB',
      agencyBg: 'bg-[#FEE2E2] text-[#DC2626]',
      title: 'RRB NTPC CBT–1 Full Mock – 01',
      questionsCount: 100,
      duration: 90,
      attempts: '58.2K Attempts',
      difficulty: 'Medium',
      difficultyBg: 'bg-[#FEF3C7] text-[#B45309]',
      targetUrl: '/mocks/rrb-ntpc-ug-2025-shift-1?mode=cbt',
      practiceUrl: '/mocks/rrb-ntpc-ug-2025-shift-1?mode=practice'
    },
    {
      id: 'popular-ssc-1',
      agencyBadge: 'SSC',
      agencyBg: 'bg-[#DCFCE7] text-[#16A34A]',
      title: 'SSC CGL Tier–I Mock – 01',
      questionsCount: 100,
      duration: 60,
      attempts: '42.9K Attempts',
      difficulty: 'Medium',
      difficultyBg: 'bg-[#FEF3C7] text-[#B45309]',
      targetUrl: '/mocks/ssc-cgl-tier1-mock-1?mode=cbt',
      practiceUrl: '/mocks/ssc-cgl-tier1-mock-1?mode=practice'
    },
    {
      id: 'popular-je-1',
      agencyBadge: 'SSC JE',
      agencyBg: 'bg-[#FEF3C7] text-[#B45309]',
      title: 'SSC JE (CSE) Mock – 01',
      questionsCount: 100,
      duration: 120,
      attempts: '18.4K Attempts',
      difficulty: 'Medium',
      difficultyBg: 'bg-[#FEF3C7] text-[#B45309]',
      targetUrl: '/mocks/subject-computer-science-full-1?mode=cbt',
      practiceUrl: '/mocks/subject-computer-science-full-1?mode=practice'
    },
    {
      id: 'popular-gk-1',
      agencyBadge: 'GK',
      agencyBg: 'bg-[#DBEAFE] text-[#1D4ED8]',
      title: 'General Knowledge (Mix) – 01',
      questionsCount: 50,
      duration: 30,
      attempts: '32.1K Attempts',
      difficulty: 'Easy',
      difficultyBg: 'bg-[#DCFCE7] text-[#15803D]',
      targetUrl: '/mocks/subject-general-knowledge-sec-1?mode=cbt',
      practiceUrl: '/mocks/subject-general-knowledge-sec-1?mode=practice'
    }
  ], []);

  // Pre-configured Subject Tests
  const allSubjectTests = useMemo(() => {
    const list = [];
    const subjects = selectedSubject
      ? [subjectList.find((s) => s.id === selectedSubject) || subjectList[0]]
      : subjectList;

    subjects.forEach((subj) => {
      // 4 Full Mocks per subject
      for (let i = 1; i <= 4; i++) {
        const pad = String(i).padStart(2, '0');
        list.push({
          id: `test-${subj.id}-full-${i}`,
          code: `${subj.title.split(' ')[0]}-F${pad}`,
          title: `${subj.title} – Full Mock Test ${pad}`,
          subtitle: `Complete official examination pattern test with detailed solutions`,
          subjectId: subj.id,
          subjectTitle: subj.title,
          category: 'full',
          questionsCount: 100,
          duration: 90,
          marks: 100,
          difficulty: i % 2 === 0 ? 'Medium' : 'Hard',
          difficultyBg: i % 2 === 0 ? 'bg-[#FEF3C7] text-[#B45309]' : 'bg-[#EDE9FE] text-[#6D28D9]',
          attempts: `${(25 + i * 7).toFixed(1)}K Attempts`,
          targetUrl: `/mocks/subject-${subj.id}-full-${i}?mode=cbt`,
          practiceUrl: `/mocks/subject-${subj.id}-full-${i}?mode=practice`
        });
      }

      // 4 Sectional Tests per subject
      for (let i = 1; i <= 4; i++) {
        const pad = String(i).padStart(2, '0');
        list.push({
          id: `test-${subj.id}-sec-${i}`,
          code: `${subj.title.split(' ')[0]}-S${pad}`,
          title: `${subj.title} – Sectional Drill ${pad}`,
          subtitle: `Targeted 50-Question topic assessment for accuracy and speed`,
          subjectId: subj.id,
          subjectTitle: subj.title,
          category: 'sectional',
          questionsCount: 50,
          duration: 45,
          marks: 50,
          difficulty: 'Medium',
          difficultyBg: 'bg-[#FEF3C7] text-[#B45309]',
          attempts: `${(15 + i * 5).toFixed(1)}K Attempts`,
          targetUrl: `/mocks/subject-${subj.id}-sec-${i}?mode=cbt`,
          practiceUrl: `/mocks/subject-${subj.id}-sec-${i}?mode=practice`
        });
      }

      // 4 Speed Practice Tests per subject
      for (let i = 1; i <= 4; i++) {
        const pad = String(i).padStart(2, '0');
        list.push({
          id: `test-${subj.id}-quick-${i}`,
          code: `${subj.title.split(' ')[0]}-Q${pad}`,
          title: `${subj.title} – Speed Practice ${pad}`,
          subtitle: `25 High-yield repeat questions designed for rapid revision`,
          subjectId: subj.id,
          subjectTitle: subj.title,
          category: 'quick',
          questionsCount: 25,
          duration: 20,
          marks: 25,
          difficulty: 'Easy',
          difficultyBg: 'bg-[#DCFCE7] text-[#15803D]',
          attempts: `${(30 + i * 8).toFixed(1)}K Attempts`,
          targetUrl: `/mocks/subject-${subj.id}-quick-${i}?mode=cbt`,
          practiceUrl: `/mocks/subject-${subj.id}-quick-${i}?mode=practice`
        });
      }
    });

    return list;
  }, [selectedSubject, subjectList]);

  // Filtered tests
  const filteredTests = useMemo(() => {
    let result = allSubjectTests;
    if (testCategoryFilter !== 'all') {
      result = result.filter((t) => t.category === testCategoryFilter);
    }
    if (testSearch.trim()) {
      const q = testSearch.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q) ||
          t.subjectTitle.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allSubjectTests, testCategoryFilter, testSearch]);

  return (
    <div className="min-h-screen bg-[#F6F8FC] pb-24">
      <div className="max-w-[1240px] mx-auto px-3.5 sm:px-6 pt-3 sm:pt-4 space-y-4 sm:space-y-5">

        {/* 1. HERO BANNER — Exact image copy from reference */}
        <section
          aria-label="Mock Tests & Practice Tests Hero"
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-[#081F44]/25 border border-white/10 select-none group"
        >
          <div className="relative aspect-[873/335] w-full">
            <img
              src="/assets/aistudio/mock_hero_banner_exact.png"
              alt="Ace Your Government Exams — Mock Tests & Practice Tests"
              className="w-full h-full object-cover block"
              loading="eager"
            />

            {/* Semantic Structure for Screen Readers & SEO */}
            <div className="sr-only">
              <span>Mock Tests &amp; Practice Tests</span>
              <h1>Ace Your Government Exams</h1>
              <p>Real exam pattern tests, topic-wise practice, and previous year papers with detailed analysis.</p>
              <ul>
                <li>Exam Pattern Based</li>
                <li>Instant Result &amp; Analysis</li>
                <li>No Login Required</li>
              </ul>
            </div>

            {/* Action Tap Target to start practice directly */}
            <button
              type="button"
              onClick={() => handleTabChange('mocks')}
              className="absolute inset-0 cursor-pointer z-10"
              aria-label="Start Mock Tests"
            />
          </div>
        </section>

        {/* 2. STATS COUNTER CARD — Exact 4-Column Design */}
        <section
          aria-label="Platform Statistics"
          className="bg-white rounded-2xl border border-[#E3EAF2] shadow-xs py-3.5 px-2 sm:px-6"
        >
          <div className="grid grid-cols-4 divide-x divide-slate-100 text-center">
            {/* Column 1: Questions */}
            <div className="px-1 sm:px-2 flex flex-col items-center justify-center">
              <FileText className="w-5 h-5 text-[#2468B4] mb-1.5 stroke-[1.8]" />
              <div className="text-base sm:text-xl font-black text-[#12345A] tracking-tight leading-tight">
                10,757+
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5">
                Questions
              </div>
            </div>

            {/* Column 2: Mock Tests */}
            <div className="px-1 sm:px-2 flex flex-col items-center justify-center">
              <Layers className="w-5 h-5 text-[#2468B4] mb-1.5 stroke-[1.8]" />
              <div className="text-base sm:text-xl font-black text-[#12345A] tracking-tight leading-tight">
                320+
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5">
                Mock Tests
              </div>
            </div>

            {/* Column 3: Exam Shifts (CBT) */}
            <div className="px-1 sm:px-2 flex flex-col items-center justify-center">
              <Calendar className="w-5 h-5 text-[#2468B4] mb-1.5 stroke-[1.8]" />
              <div className="text-base sm:text-xl font-black text-[#12345A] tracking-tight leading-tight">
                101
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 whitespace-nowrap">
                Exam Shifts (CBT)
              </div>
            </div>

            {/* Column 4: Sub Topics */}
            <div className="px-1 sm:px-2 flex flex-col items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-[#2468B4] mb-1.5 stroke-[1.8]" />
              <div className="text-base sm:text-xl font-black text-[#12345A] tracking-tight leading-tight">
                10
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5">
                Sub Topics
              </div>
            </div>
          </div>
        </section>

        {/* 3. THREE TAB SWITCHER ROW (Pills) */}
        <section aria-label="Test Type Tabs" className="pt-1">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto sm:mx-0">
            {/* Tab 1: Mock Tests (75) */}
            <button
              type="button"
              onClick={() => handleTabChange('mocks')}
              className={`py-2.5 px-3 sm:px-5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeMainTab === 'mocks'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'bg-white border border-[#E3EAF2] text-slate-700 hover:text-[#12345A] hover:bg-slate-50'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${activeMainTab === 'mocks' ? 'fill-white text-white' : 'text-slate-600'}`} />
              <span className="whitespace-nowrap">Mock Tests (75)</span>
            </button>

            {/* Tab 2: Practice Tests (320) */}
            <button
              type="button"
              onClick={() => handleTabChange('practice')}
              className={`py-2.5 px-3 sm:px-5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeMainTab === 'practice'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'bg-white border border-[#E3EAF2] text-slate-700 hover:text-[#12345A] hover:bg-slate-50'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${activeMainTab === 'practice' ? 'text-[#F2BE4F]' : 'text-slate-600'}`} />
              <span className="whitespace-nowrap">Practice Tests (320)</span>
            </button>

            {/* Tab 3: PYQs */}
            <button
              type="button"
              onClick={() => handleTabChange('pyqs')}
              className={`py-2.5 px-3 sm:px-5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeMainTab === 'pyqs'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'bg-white border border-[#E3EAF2] text-slate-700 hover:text-[#12345A] hover:bg-slate-50'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeMainTab === 'pyqs' ? 'text-[#F2BE4F]' : 'text-slate-600'}`} />
              <span>PYQs</span>
            </button>
          </div>
        </section>

        {/* 4. SECTION: "Select Subject for Mock Tests" */}
        <section aria-label="Select Subject for Mock Tests" className="space-y-3 pt-1">
          {/* Section Header Row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#F59E0B] rounded-full inline-block shrink-0" />
                <h2 className="font-heading font-black text-base sm:text-lg text-[#182B45] tracking-tight">
                  Select Subject for Mock Tests
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium pl-3.5 mt-0.5">
                Click a subject to attempt full-length and topic-wise tests.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedSubject(null);
                setShowAllTests(true);
              }}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#12345A] hover:text-[#2468B4] transition-colors cursor-pointer shrink-0"
            >
              <span>All Subjects</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 5 Subject Cards — Exact replica of reference */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
            {subjectList.map((subject) => {
              const isSelected = selectedSubject === subject.id;
              const Icon = subject.icon;
              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => handleSelectSubject(subject.id)}
                  className={`rounded-2xl p-2 sm:p-4 text-center border transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-between min-h-[110px] sm:min-h-[135px] ${
                    isSelected ? subject.activeCardBg : subject.cardBg
                  }`}
                >
                  {/* Icon */}
                  <div className="w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center mx-auto">
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${subject.iconBg} stroke-[2]`} />
                  </div>

                  {/* Title */}
                  <span className="font-heading font-bold text-[10.5px] sm:text-xs md:text-sm text-[#182B45] leading-tight my-1 line-clamp-2">
                    {subject.title}
                  </span>

                  {/* Pill Badge */}
                  <span
                    className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10.5px] font-bold ${subject.pillBg} shadow-2xs`}
                  >
                    {subject.pillText}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. SECTION: "Popular Mock Tests" */}
        <section aria-label="Popular Mock Tests" className="space-y-3 pt-2">
          {/* Section Header Row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#F59E0B] rounded-full inline-block shrink-0" />
                <h2 className="font-heading font-black text-base sm:text-lg text-[#182B45] tracking-tight">
                  Popular Mock Tests
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium pl-3.5 mt-0.5">
                Attempt exam-wise full tests with official pattern.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAllTests(true)}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#12345A] hover:text-[#2468B4] transition-colors cursor-pointer shrink-0"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Popular Test Cards Stack */}
          <div className="space-y-3">
            {popularMockTests.map((test) => {
              const isBookmarked = bookmarkedIds.includes(test.id);
              return (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl border border-[#E3EAF2] p-3.5 sm:p-4.5 hover:border-[#2468B4] hover:shadow-md transition-all shadow-2xs flex flex-col gap-3 group"
                >
                  {/* Top Row: Circular Badge, Title, Metadata, Bookmark */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
                      {/* Circular Agency Badge */}
                      <span
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-xs sm:text-[13px] tracking-tight shrink-0 shadow-2xs ${test.agencyBg}`}
                      >
                        {test.agencyBadge}
                      </span>

                      {/* Title & Metadata */}
                      <div className="space-y-1 min-w-0">
                        <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#12345A] group-hover:text-[#2468B4] transition-colors truncate">
                          {test.title}
                        </h3>

                        <div className="flex items-center gap-3 text-slate-500 text-[11px] sm:text-xs font-semibold">
                          <span className="flex items-center gap-1">
                            <Monitor className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                            <span>{test.questionsCount} Questions</span>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                            <span>{test.duration} Minutes</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bookmark Toggle Icon */}
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(test.id, e)}
                      aria-label="Bookmark mock test"
                      className="p-1 rounded-lg text-slate-400 hover:text-[#12345A] transition-colors cursor-pointer shrink-0"
                    >
                      <Bookmark
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isBookmarked ? 'fill-[#12345A] text-[#12345A]' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Bottom Row: Attempts Badge, Difficulty Pill, Start Test Button */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {/* Flame Attempts Badge */}
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5] text-[10.5px] font-bold shadow-2xs">
                        <Flame className="w-3 h-3 fill-[#EA580C] text-[#EA580C]" />
                        <span>{test.attempts}</span>
                      </span>

                      {/* Difficulty Pill */}
                      <span
                        className={`px-3 py-1 rounded-full text-[10.5px] font-bold ${test.difficultyBg} shadow-2xs`}
                      >
                        {test.difficulty}
                      </span>
                    </div>

                    {/* Start Test button */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={test.practiceUrl}
                        className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-bold text-[#12345A] bg-[#EAF3FF] hover:bg-[#DBEAFE] transition-colors"
                      >
                        Practice
                      </Link>
                      <Link
                        to={test.targetUrl}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#12345A] hover:bg-[#1E4E8C] text-white font-bold text-xs sm:text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Start Test</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. SUBJECT & PRACTICE TESTS DRAWER (When Subject is selected or View All clicked) */}
        {(selectedSubject || showAllTests || activeMainTab === 'practice' || activeMainTab === 'pyqs') && (
          <section aria-label="Subject Tests & Shift Papers" className="space-y-4 pt-4 border-t border-slate-200">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-[#E3EAF2] p-4 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#2468B4]" />
                  <h3 className="font-heading font-black text-sm sm:text-base text-[#12345A]">
                    {selectedSubject
                      ? `${subjectList.find((s) => s.id === selectedSubject)?.title} Tests`
                      : activeMainTab === 'pyqs'
                      ? 'Official CBT Shift Papers (101 Shifts)'
                      : activeMainTab === 'practice'
                      ? 'Topic Practice & Speed Drills'
                      : 'All Available Mock Tests'}
                  </h3>
                </div>

                {/* Search Bar inside tests */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={testSearch}
                    onChange={(e) => setTestSearch(e.target.value)}
                    placeholder="Search mock tests..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-[#E3EAF2] rounded-full text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#2468B4]"
                  />
                </div>
              </div>

              {/* Sub-Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                {[
                  { id: 'all', label: `All (${filteredTests.length})` },
                  { id: 'full', label: 'Full Mock (100 Qs)' },
                  { id: 'sectional', label: 'Sectional (50 Qs)' },
                  { id: 'quick', label: 'Speed Practice (25 Qs)' }
                ].map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setTestCategoryFilter(pill.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      testCategoryFilter === pill.id
                        ? 'bg-[#12345A] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTests.map((test) => {
                const isBookmarked = bookmarkedIds.includes(test.id);
                return (
                  <div
                    key={test.id}
                    className="bg-white rounded-2xl border border-[#E3EAF2] p-4 hover:border-[#2468B4] hover:shadow-md transition-all shadow-xs flex flex-col justify-between gap-3 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1E40AF] text-[10px] font-bold">
                            {test.code}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${test.difficultyBg}`}>
                            {test.difficulty}
                          </span>
                        </div>
                        <h4 className="font-heading font-black text-sm text-[#12345A] group-hover:text-[#2468B4] transition-colors mt-1.5">
                          {test.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{test.subtitle}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(test.id, e)}
                        className="p-1 text-slate-400 hover:text-[#12345A] transition-colors cursor-pointer"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            isBookmarked ? 'fill-[#12345A] text-[#12345A]' : 'text-slate-400'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                        <span>{test.questionsCount} Qs</span>
                        <span>•</span>
                        <span>{test.duration} Min</span>
                        <span>•</span>
                        <span>{test.attempts}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={test.practiceUrl}
                          className="px-2.5 py-1 rounded-full text-[11px] font-bold text-[#12345A] bg-[#EAF3FF] hover:bg-[#DBEAFE] transition-colors"
                        >
                          Practice
                        </Link>
                        <Link
                          to={test.targetUrl}
                          className="px-3.5 py-1 rounded-full text-[11px] font-bold text-white bg-[#12345A] hover:bg-[#1E4E8C] transition-colors flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Start</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 7. OFFICIAL SHIFTS & ARCHIVE TOGGLE */}
        <section aria-label="Official Question Banks & Shift Papers" className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdditionalBanks(!showAdditionalBanks)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-[#E3EAF2] hover:bg-slate-50 transition cursor-pointer text-left shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2468B4] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="font-heading font-black text-[#12345A] text-xs sm:text-sm md:text-base">
                  Official CBT Exam Shifts &amp; Monthly Current Affairs Mocks
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Attempt verified full shift question papers from RRB NTPC, SSC CGL &amp; monthly Current Affairs.
                </p>
              </div>
            </div>

            <span className="text-[11px] sm:text-xs font-bold text-[#2468B4] px-3 py-1 rounded-full bg-[#EAF3FF] shrink-0">
              {showAdditionalBanks ? 'Hide' : 'Show All'}
            </span>
          </button>

          {showAdditionalBanks && (
            <div className="mt-4 bg-white rounded-2xl border border-[#E3EAF2] p-4 sm:p-6 space-y-5">
              <div>
                <h4 className="font-heading font-black text-sm sm:text-base text-[#12345A] mb-3">
                  Monthly Current Affairs Full CBT Mocks ({MOCK_TESTS_METADATA.length} Sets)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {MOCK_TESTS_METADATA.slice(0, 6).map((mock) => (
                    <MockTestCard key={mock.id} mock={mock} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
