import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Clock,
  Play,
  Bookmark,
  Monitor,
  Download,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ALL_CBT_SHIFTS } from '../data/allShiftsMetadata.js';
import { FULL_MOCK_SERIES } from '../data/fullMockSeriesData.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

export default function TestSeriesPage() {
  const { seriesId } = useParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [shiftTimeFilter, setShiftTimeFilter] = useState('all'); // 'all' | 'morning' | 'afternoon' | 'evening'
  const [currentPage, setCurrentPage] = useState(1);
  const SHIFTS_PER_PAGE = 10; // Exactly 10 tests / papers per page as requested

  // Local Bookmarks store
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const cached = localStorage.getItem('eqh_bookmarked_series_tests');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('eqh_bookmarked_series_tests', JSON.stringify(next));
      } catch (err) {
        console.warn(err);
      }
      return next;
    });
  };

  // Resolve Series Configuration based on seriesId
  const seriesConfig = useMemo(() => {
    const id = String(seriesId || '').toLowerCase();

    if (id.includes('rrb-ug') || id.includes('undergraduate') || id === 'ug') {
      const ugShifts = ALL_CBT_SHIFTS.filter(
        (s) =>
          String(s.id).includes('ug') ||
          String(s.examName || '').includes('Under Graduate') ||
          s.examLevel === 'Under Graduate'
      );
      return {
        id: 'series-rrb-ug',
        bannerTitle: 'RRB NTPC Under Graduate 2026-27 (CBT 1 + CBT 2) Mock Test Series',
        title: 'RRB NTPC Under Graduate 2026-27 (CBT 1 + CBT 2) Mock Test Series',
        totalTestsBadge: '656 Total Tests',
        freeTestsBadge: '2 Free Tests',
        description:
          'Practice all official shifts conducted for RRB NTPC Under Graduate (CEN 06/2024). Includes exact question sequence, official answer keys, time limits, and negative marking.',
        agency: 'RRB',
        examLevel: 'Under Graduate (CEN 06/2024)',
        totalTests: ugShifts.length || 57,
        questionsPerTest: 100,
        timeMinutes: 90,
        totalMarks: 100,
        negativeMarking: '0.25',
        languages: 'English · Hindi',
        logoUrl: '/assets/aistudio/image_cbd93505.png',
        badge: '57 OFFICIAL SHIFTS',
        shifts: ugShifts
      };
    }

    if (id.includes('rrb-grad') || id.includes('graduate') || id === 'grad') {
      const gradShifts = ALL_CBT_SHIFTS.filter(
        (s) => s.examLevel === 'Graduate' || String(s.id).includes('grad')
      );
      return {
        id: 'series-rrb-grad',
        bannerTitle: 'RRB NTPC Graduate Level 2025-26 (CBT 1 + CBT 2) Mock Test Series',
        title: 'RRB NTPC Graduate Level 2025-26 (CBT 1 + CBT 2) Mock Test Series',
        totalTestsBadge: `${gradShifts.length || 71} Total Tests`,
        freeTestsBadge: '2 Free Tests',
        description:
          'Comprehensive collection of RRB NTPC Graduate Level exam papers (CEN 05/2024). Test yourself with real shift papers timed to 90 minutes.',
        agency: 'RRB',
        examLevel: 'Graduate Level (CEN 05/2024)',
        totalTests: gradShifts.length || 71,
        questionsPerTest: 100,
        timeMinutes: 90,
        totalMarks: 100,
        negativeMarking: '0.25',
        languages: 'English · Hindi',
        logoUrl: '/assets/aistudio/image_cbd93505.png',
        badge: '71 OFFICIAL SHIFTS',
        shifts: gradShifts
      };
    }

    if (id.includes('group-d') || id.includes('level-1')) {
      const groupDShifts = ALL_CBT_SHIFTS.filter(
        (s) => s.examType === 'RRB Group D' || String(s.id).includes('group-d')
      );
      return {
        id: 'series-rrb-group-d',
        bannerTitle: 'RRB Group D 2025-26 (Level-1 CBT) All 48 Sets Mock Test Series',
        title: 'RRB Group D 2025-26 (Level-1 CBT) All 48 Sets Mock Test Series',
        totalTestsBadge: `${groupDShifts.length || 48} Total Tests`,
        freeTestsBadge: '2 Free Tests',
        description:
          'Practice all 48 official RRB Group D Level-1 CBT sets (4,800 verified questions). Features 25 General Science, 25 Mathematics, 30 Reasoning, and 20 General Awareness & Current Affairs per set.',
        agency: 'RRB',
        examLevel: 'Level-1 (CEN 09/2025)',
        totalTests: groupDShifts.length || 48,
        questionsPerTest: 100,
        timeMinutes: 90,
        totalMarks: 100,
        negativeMarking: '0.33',
        languages: 'English · Hindi',
        logoUrl: '/assets/aistudio/image_cbd93505.png',
        badge: `${groupDShifts.length || 48} OFFICIAL SETS`,
        shifts: groupDShifts
      };
    }

    if (id.includes('ssc') && id.includes('2026')) {
      const ssc2026 = ALL_CBT_SHIFTS.filter(
        (s) =>
          (s.examType === 'SSC CGL' || String(s.id).includes('ssc')) &&
          (s.examYear === '2026' || String(s.id).includes('2026'))
      );
      return {
        id: 'series-ssc-cgl-2026',
        bannerTitle: 'SSC CGL 2026 (Tier 1 + Tier 2) Mock Test Series',
        title: 'SSC CGL 2026 (Tier 1 + Tier 2) Mock Test Series',
        totalTestsBadge: `${ssc2026.length || 14} Total Tests`,
        freeTestsBadge: '2 Free Tests',
        description:
          'Master SSC CGL Tier-1 pattern with authentic 2026 examination shifts. Features 25 questions each in Reasoning, General Awareness, Quantitative Aptitude, and English.',
        agency: 'SSC',
        examLevel: 'Tier-1 CBT (2026)',
        totalTests: ssc2026.length || 14,
        questionsPerTest: 100,
        timeMinutes: 60,
        totalMarks: 200,
        negativeMarking: '0.50',
        languages: 'English',
        logoUrl: '/assets/aistudio/image_445d7a66.png',
        badge: '2026 LATEST',
        shifts: ssc2026
      };
    }

    if (id.includes('ssc') && (id.includes('2020') || id.includes('cgl'))) {
      const ssc2020 = ALL_CBT_SHIFTS.filter(
        (s) =>
          (s.examType === 'SSC CGL' || String(s.id).includes('ssc')) &&
          (s.examYear === '2020' || String(s.id).includes('2020'))
      );
      return {
        id: 'series-ssc-cgl-2020',
        bannerTitle: 'SSC CGL Tier-1 Previous Year (All 21 Sets) Mock Test Series',
        title: 'SSC CGL Tier-1 Previous Year (All 21 Sets) Mock Test Series',
        totalTestsBadge: `${ssc2020.length || 21} Total Tests`,
        freeTestsBadge: '2 Free Tests',
        description:
          'Full 21 Tier-1 shift sets with official answer keys. Practice under realistic exam time constraints of 60 minutes with -0.50 negative marking.',
        agency: 'SSC',
        examLevel: 'Tier-1 CBT (2020 All 21 Sets)',
        totalTests: ssc2020.length || 21,
        questionsPerTest: 100,
        timeMinutes: 60,
        totalMarks: 200,
        negativeMarking: '0.50',
        languages: 'English',
        logoUrl: '/assets/aistudio/image_445d7a66.png',
        badge: '21 OFFICIAL SETS',
        shifts: ssc2020
      };
    }

    // Default: Full Mocks Series
    const fullMockShifts = FULL_MOCK_SERIES.map((m, idx) => ({
      id: m.id,
      title: m.title,
      subtitle: m.subtitle,
      shiftNumber: idx + 1,
      examDate: 'Simulated CBT Exam',
      shiftTiming: `${m.timeMinutes} Minutes Duration`,
      examName: m.examName,
      examLevel: m.agency,
      questionsCount: m.questionsCount || 100,
      durationMinutes: m.timeMinutes || 90,
      totalMarks: m.marks || 100,
      negativeMarking: 0.25,
      isFullMock: true,
      rawObj: m
    }));

    return {
      id: 'series-full-mocks',
      bannerTitle: 'RRB & SSC Full Mock Test Series (CBT 1 + CBT 2)',
      title: 'Official Examination Full CBT Simulated Mock Test Series',
      totalTestsBadge: `${fullMockShifts.length} Total Tests`,
      freeTestsBadge: '2 Free Tests',
      description:
        'Standard CBT simulated full mocks designed by subject experts following the exact blueprint and difficulty levels of upcoming government recruitment exams.',
      agency: 'EXAM',
      examLevel: 'Full CBT Simulation',
      totalTests: fullMockShifts.length,
      questionsPerTest: 100,
      timeMinutes: 90,
      totalMarks: 100,
      negativeMarking: '0.25',
      languages: 'English · Hindi',
      logoUrl: '/assets/aistudio/image_cbd93505.png',
      badge: 'FULL CBT SIMULATION',
      shifts: fullMockShifts
    };
  }, [seriesId]);

  // Helper for dynamic card title matching Image 1
  const getCardTitle = (shift, idx) => {
    if (shift.title && (shift.title.includes('Full Mock') || shift.title.includes('CBT–1 Full Mock') || shift.title.includes('CBT-1 Full Mock'))) {
      return shift.title;
    }
    const num = String(shift.shiftNumber || shift.setNumber || idx + 1).padStart(2, '0');
    if (seriesConfig.id.includes('rrb-ug')) {
      return `RRB NTPC CBT–1 Full Mock – ${num}`;
    }
    if (seriesConfig.id.includes('rrb-grad')) {
      return `RRB NTPC Graduate CBT–1 Shift – ${num}`;
    }
    if (seriesConfig.id.includes('group-d')) {
      return `RRB Group D 2025 – Set ${num}`;
    }
    if (seriesConfig.id.includes('ssc') && seriesConfig.id.includes('2026')) {
      return `SSC CGL 2026 Tier–1 Shift – ${num}`;
    }
    if (seriesConfig.id.includes('ssc') && seriesConfig.id.includes('2020')) {
      return `SSC CGL 2020 Tier–1 Set – ${num}`;
    }
    return shift.title || `${seriesConfig.agency} CBT–1 Full Mock – ${num}`;
  };

  // Filtered shifts based on search query and shift timing
  const filteredShifts = useMemo(() => {
    let list = seriesConfig.shifts || [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((s) => {
        const titleMatch = (s.title || '').toLowerCase().includes(q);
        const shiftNumMatch = String(s.shiftNumber || '').includes(q);
        const setNumMatch = String(s.setNumber || '').includes(q);
        const dateMatch = (s.examDate || '').toLowerCase().includes(q);
        const timeMatch = (s.shiftTiming || '').toLowerCase().includes(q);
        return titleMatch || shiftNumMatch || setNumMatch || dateMatch || timeMatch;
      });
    }

    if (shiftTimeFilter !== 'all') {
      list = list.filter((s) => {
        const timing = (s.shiftTiming || '').toLowerCase();
        if (shiftTimeFilter === 'morning') {
          return timing.includes('9:00') || timing.includes('am') || timing.includes('morning');
        }
        if (shiftTimeFilter === 'afternoon') {
          return timing.includes('12:45') || timing.includes('1:00') || timing.includes('afternoon');
        }
        if (shiftTimeFilter === 'evening') {
          return timing.includes('4:30') || timing.includes('pm') || timing.includes('evening');
        }
        return true;
      });
    }

    return list;
  }, [seriesConfig.shifts, searchQuery, shiftTimeFilter]);

  // Paginated list (Strictly 10 shifts per page)
  const totalPages = Math.max(1, Math.ceil(filteredShifts.length / SHIFTS_PER_PAGE));
  const paginatedShifts = useMemo(() => {
    const start = (currentPage - 1) * SHIFTS_PER_PAGE;
    return filteredShifts.slice(start, start + SHIFTS_PER_PAGE);
  }, [filteredShifts, currentPage]);

  const handleStartTest = (testId) => {
    navigate(`/mocks/${testId}`);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] pb-16">
      {/* Top Breadcrumbs Strip */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/mocks')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Back to Mock Tests</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Mock Tests Hub', href: '/mocks' },
                { label: seriesConfig.agency }
              ]}
            />
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#12345A] text-white text-[11px] font-black uppercase tracking-wider">
            {seriesConfig.badge}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6">
        {/* =========================================================================
            TOP BANNER (Exact Replica of Image 2 - Dark charcoal theme with circular logo)
            Mobile-friendly responsive side-by-side flex container
            ========================================================================= */}
        <div className="bg-[#22252E] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Left Column: Title & Total Tests Pill */}
            <div className="min-w-0 space-y-2 sm:space-y-3">
              <h1 className="text-white font-black text-base sm:text-xl md:text-2xl font-heading leading-tight tracking-tight">
                {seriesConfig.bannerTitle || seriesConfig.title}
              </h1>

              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-lg bg-[#3B82F6] text-white font-bold text-xs sm:text-sm shadow-xs">
                  {seriesConfig.totalTestsBadge}
                </span>
              </div>
            </div>

            {/* Right Column: Circular Dark Container with Official Agency Round Emblem */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2A2E39] border border-white/10 p-2 sm:p-2.5 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
              <img
                src={seriesConfig.logoUrl}
                alt={seriesConfig.agency}
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  e.currentTarget.src = '/assets/aistudio/image_cbd93505.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            SEARCH & FILTERS TOOLBAR
            ========================================================================= */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search shift number, date (e.g. Shift 1, 07 Aug)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#2468B4] focus:bg-white transition"
            />
          </div>

          {/* Timing Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'All Shifts' },
              { id: 'morning', label: 'Morning (9:00 AM)' },
              { id: 'afternoon', label: 'Afternoon (12:45 PM)' },
              { id: 'evening', label: 'Evening (4:30 PM)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setShiftTimeFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  shiftTimeFilter === tab.id
                    ? 'bg-[#12345A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            TESTS LIST (Exact Replica of Image 1 - Card with Emblem, Meta, Pills, Buttons)
            Strictly 10 tests per page with responsive pagination
            ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#2468B4] rounded-full inline-block" />
              <h2 className="text-base sm:text-lg font-black text-[#12345A] font-heading">
                All Available Tests ({filteredShifts.length})
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Showing {Math.min(filteredShifts.length, (currentPage - 1) * SHIFTS_PER_PAGE + 1)}–{Math.min(filteredShifts.length, currentPage * SHIFTS_PER_PAGE)} of {filteredShifts.length}
            </span>
          </div>

          {filteredShifts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <p className="text-base font-bold text-slate-700">No shifts match your search criteria</p>
              <p className="text-xs text-slate-400">Try searching with a different keyword or reset filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShiftTimeFilter('all');
                }}
                className="px-4 py-2 bg-[#12345A] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {paginatedShifts.map((shift, idx) => {
                const globalIndex = (currentPage - 1) * SHIFTS_PER_PAGE + idx;
                const cardTitle = getCardTitle(shift, globalIndex);
                const isBookmarked = bookmarkedIds.includes(shift.id);

                return (
                  <div
                    key={shift.id || idx}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all p-3.5 sm:p-5 flex flex-col justify-between group"
                  >
                    {/* Top Row: Circular Agency Emblem + Title & Questions | Mins + Bookmark Ribbon */}
                    <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Circular Emblem Frame matching Image 1 */}
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-200 p-0.5 bg-slate-50 flex items-center justify-center shrink-0 shadow-2xs">
                          <img
                            src={seriesConfig.logoUrl}
                            alt={seriesConfig.agency}
                            className="w-full h-full object-contain rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/aistudio/image_cbd93505.png';
                            }}
                          />
                        </div>

                        {/* Title & Questions | Mins metadata */}
                        <div className="min-w-0">
                          <h3 className="font-heading font-black text-sm sm:text-base text-[#12345A] leading-snug group-hover:text-[#2468B4] transition-colors truncate">
                            {cardTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium mt-1">
                            <span className="flex items-center gap-1">
                              <Monitor className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{shift.questionsCount || 100} Questions</span>
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{shift.durationMinutes || seriesConfig.timeMinutes} Mins</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        type="button"
                        onClick={() => toggleBookmark(shift.id)}
                        className="text-slate-400 hover:text-amber-500 p-1.5 transition cursor-pointer shrink-0"
                        title="Bookmark Test"
                      >
                        <Bookmark
                          className={`w-5 h-5 ${
                            isBookmarked
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-slate-400'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Bottom Row: Difficulty Pill + Negative Marking Pill & Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3.5 border-t border-slate-100 mt-3">
                      {/* Left Badges matching Image 1: [Medium] [-0.25 Negative Marking] */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-[#FEF9C3] text-[#A16207] text-xs font-bold border border-amber-200/50">
                          Medium
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#F1F5F9] text-[#475569] text-xs font-medium border border-slate-200/60">
                          -{seriesConfig.negativeMarking} Negative Marking
                        </span>
                      </div>

                      {/* Right Buttons matching Image 1: [Practice] [▶ Start Test] */}
                      <div className="flex items-center gap-2 shrink-0">
                        {shift.paperUrl && (
                          <a
                            href={shift.paperUrl}
                            target="_blank"
                            rel="noreferrer"
                            download={shift.pdfFileName || undefined}
                            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition"
                            title="Download official PDF paper"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => navigate(`/mocks/${shift.id}?mode=practice`)}
                          className="px-3.5 sm:px-4 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-50 hover:border-slate-400 transition cursor-pointer active:scale-95"
                        >
                          Practice
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartTest(shift.id)}
                          className="px-4 sm:px-5 py-1.5 rounded-xl bg-[#0F223D] hover:bg-[#071324] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start Test</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Clean Pagination Controls (10 per page) */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200/80">
              <span className="text-xs text-slate-500 font-medium">
                Page <strong className="text-slate-800">{currentPage}</strong> of <strong>{totalPages}</strong> (10 tests per page)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((pg) => {
                    if (totalPages <= 7) return true;
                    if (pg === 1 || pg === totalPages) return true;
                    return Math.abs(pg - currentPage) <= 1;
                  })
                  .map((pg, i, arr) => {
                    const prevPg = arr[i - 1];
                    const hasGap = prevPg && pg - prevPg > 1;

                    return (
                      <React.Fragment key={pg}>
                        {hasGap && (
                          <span className="px-1 text-slate-400 text-xs">...</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(pg)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                            currentPage === pg
                              ? 'bg-[#12345A] text-white shadow-xs'
                              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 shadow-2xs'
                          }`}
                        >
                          {pg}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
