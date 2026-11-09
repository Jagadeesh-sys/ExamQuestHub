import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  Film,
  Search,
  Calendar,
  ExternalLink,
  ChevronRight,
  Star,
  Sparkles,
  ArrowRight,
  FileText,
  GraduationCap,
  Bell,
  Layers,
  Columns3,
  List,
  LayoutGrid,
  Play,
  TrendingUp,
  Bookmark,
  Share2,
  Newspaper,
  ChevronUp,
  MoreHorizontal,
  Zap,
  ArrowDown,
  Grid,
  LayoutList
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import StraightLineCurrentAffair from './StraightLineCurrentAffair.jsx';
import CurrentAffairCard from './CurrentAffairCard.jsx';
import { CURRENT_AFFAIR_TOPICS, topicMatches } from '../constants/currentAffairs.js';

// Golden leaf corner SVG decoration matching image_1b19ce6e.png
function GoldenCornerFlourish() {
  return (
    <div className="absolute bottom-1 right-1 pointer-events-none opacity-85 select-none" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21 21C16 21 11 18 10 13C9 8 13 4 19 3C19 9 22 15 21 21Z"
          fill="#D4A373"
          fillOpacity="0.45"
        />
        <path
          d="M17 17C13 17 9 14.5 8 10.5C7 6.5 10 3.5 15 2.5C15 7.5 17.5 12.5 17 17Z"
          fill="#E76F51"
          fillOpacity="0.55"
        />
        <path
          d="M3 21C6 19 12 16 15 11"
          stroke="#C89666"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// Golden nest crest SVG icon for "Update Nest"
function GoldenNestIcon() {
  return (
    <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs mx-auto">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14c2.5 4 13.5 4 16 0" />
        <path d="M2 11c3.5 7 16.5 7 20 0" />
        <ellipse cx="12" cy="9" rx="3" ry="2" fill="#F2BE4F" fillOpacity="0.4" />
        <ellipse cx="8" cy="11" rx="2.5" ry="1.8" fill="#F2BE4F" fillOpacity="0.3" />
        <ellipse cx="16" cy="11" rx="2.5" ry="1.8" fill="#F2BE4F" fillOpacity="0.3" />
      </svg>
    </div>
  );
}

// Month + year section header used by the list views
function MonthGroupHeader({ label, count }) {
  return (
    <div className="flex items-center gap-2.5 pt-1">
      <span className="h-5 w-1.5 rounded-full bg-[#2468B4]" />
      <h3 className="font-heading font-extrabold text-sm text-[#182B45]">{label}</h3>
      <span className="px-2 py-0.5 rounded-full bg-[#F0F4F9] border border-[#E3EAF2] text-[10px] font-semibold text-[#1E3A5F]">
        {count} {count === 1 ? 'article' : 'articles'}
      </span>
      <span className="flex-1 h-px bg-[#E3EAF2]" />
    </div>
  );
}

// Full-height swipeable card used by the Reels-style mobile feed
function ReelCard({ item, isBookmarked, onToggleBookmark, index, total }) {
  const { getLocalized } = useLanguage();
  const headline = getLocalized(item.headline);
  const summary = getLocalized(item.summary);
  const content = getLocalized(item.content);
  const detailSlug = item.slug || item.id;

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: headline,
          text: summary,
          url: window.location.origin + '/current-affairs/' + detailSlug,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <article className="relative h-full w-full snap-start snap-always bg-white overflow-y-auto no-scrollbar pb-24 pt-2">
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none overflow-hidden">
        <GoldenCornerFlourish />
      </div>

      <div className="px-4 pb-12 space-y-4">
        {/* Top Info: Category + Date + Page Indicator */}
        <div className="flex items-center justify-between text-[10px] font-bold pt-2">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wide">
              {item.topic || 'International Affairs'}
            </span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{item.eventDate || '12 Sep 2026'}</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-extrabold tracking-tighter">
            {index + 1}/{total}
          </span>
        </div>

        {/* Headline + Share Button */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading font-black text-[#0B1F3A] text-[22px] leading-[1.2] tracking-tight flex-1">
            {headline}
          </h2>
          <button
            type="button"
            onClick={handleShare}
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-[#0B1F3A] shadow-sm flex items-center justify-center shrink-0 active:scale-90 transition-transform"
            aria-label="Share story"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Main Image - Below Headline */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/50 shadow-sm">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=900&q=80'}
            alt={headline}
            loading="lazy"
            className="w-full aspect-[4/3] object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80';
            }}
          />
        </div>

        {/* Matter (Summary + Content) - Clean unboxed text, no background cards */}
        <div className="space-y-3.5 pt-1">
          {/* Summary Lead text */}
          <p className="text-slate-800 text-[14px] sm:text-[15px] leading-relaxed font-semibold">
            {summary}
          </p>

          {/* Detailed News */}
          {content && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#2468B4] rounded-full" />
                <h3 className="font-heading font-black text-[#0B1F3A] text-sm sm:text-base">Detailed News</h3>
              </div>
              <p className="text-slate-600 text-[13px] leading-relaxed font-normal">
                {content}
              </p>
            </div>
          )}

          {/* Key Highlights - Clean unboxed bullet list */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-[#2468B4] font-bold text-xs uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Key Highlights</span>
            </div>
            <ul className="space-y-1.5">
              {[
                "Important national and international milestone verified against PIB and official gazette bulletins.",
                "High relevance for UPSC, State PSCs, SSC CGL/CHSL, and Railway CBT examinations.",
                "Focus on policies, bilateral cooperation, and socio-economic development metrics."
              ].map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700 text-[12.5px] leading-snug font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2468B4] mt-1.5 shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Swipe Indicator */}
        <div className="pt-6 pb-4 flex flex-col items-center gap-1.5 text-slate-400 animate-bounce">
          <ChevronUp className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Swipe up for next update</span>
        </div>
      </div>
    </article>
  );
}

export default function EditorialCurrentAffairsSection({
  articles = [],
  loading = false,
  showViewToggle = true,
  initialViewMode = 'editorial', // 'editorial' | 'threeInRow' | 'singleAlign' | 'grid' | 'reels'
  mobileReels = false, // when true, phones open straight into the Reels-style feed
  onOpenAdminImageModal = null // optional callback if admin wants quick image paste
}) {
  const { t, getLocalized } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [viewMode, setViewMode] = useState(
    mobileReels && typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
      ? 'reels'
      : initialViewMode
  );
  const [bookmarkedIds, setBookmarkedIds] = useState({});
  const [expandedIds, setExpandedIds] = useState({});

  // Lock body scroll when in full-screen Reels mode
  useEffect(() => {
    if (viewMode === 'reels') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [viewMode]);

  // On mobile screens, automatically open in News Reels mode when mobileReels is true
  useEffect(() => {
    if (mobileReels && typeof window !== 'undefined' && window.innerWidth < 1024) {
      setViewMode('reels');
    }
  }, [mobileReels]);

  // If window resizes to desktop, and we are in reels mode, switch back to editorial
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleResize = (e) => {
      if (e.matches && viewMode === 'reels') {
        setViewMode('editorial');
      }
    };
    
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, [viewMode]);

  const topics = ['All', ...CURRENT_AFFAIR_TOPICS];

  const trendingTags = [
    'Space Research',
    'Foreign Policy',
    'Indian Constitution',
    'Climate Change',
    'Budget 2026-27',
    'Social Justice',
    'Health & Bioscience',
    'Banking Reform',
    'Farmers Welfare',
    'Green Hydrogen'
  ];

  const monthlyDigestItems = [
    {
      title: 'October 2026: Rural Initiatives',
      snippet: 'Pradhan Mantri Viksit Gram Swaraj centrally Sponsored Scheme for 2026-31. The scheme has total outlay of ₹97,395 crore.'
    },
    {
      title: 'September 2026: Defense Ties',
      snippet: 'Defense Ties to improve Regional Maritime safety, Bilateral exercises and counter-piracy corridors across Indian Ocean.'
    },
    {
      title: 'August 2026: Economic Indicators',
      snippet: 'The August 2026 Economic data opportunity economic index tracks 20 key production and export metrics.'
    },
    {
      title: 'October 2026: Rural Initiatives',
      snippet: 'Saturation of digital panchayats and community solar irrigation models deployed across 50,000 villages.'
    }
  ];

  const toggleBookmark = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Deduplicate articles strictly by unique ID or normalized headline to avoid duplicate current affairs
  const uniqueArticles = React.useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const art of articles || []) {
      if (!art) continue;
      const h = (typeof art.headline === 'object' ? art.headline.en : art.headline) || '';
      const cleanH = h.trim().toLowerCase();
      const idKey = art.id ? String(art.id) : '';
      if (idKey && seen.has(idKey)) continue;
      if (cleanH && seen.has(cleanH)) continue;
      if (idKey) seen.add(idKey);
      if (cleanH) seen.add(cleanH);
      result.push(art);
    }
    return result;
  }, [articles]);

  // Filter deduplicated articles based on search and selected topic
  const filtered = React.useMemo(() => {
    return uniqueArticles.filter((item) => {
      const headline = getLocalized(item.headline).toLowerCase();
      const summary = getLocalized(item.summary).toLowerCase();
      const s = searchQuery.toLowerCase().trim();

      const matchSearch = !s || headline.includes(s) || summary.includes(s);
      const matchTopic = topicMatches(item.topic, selectedTopic);
      return matchSearch && matchTopic;
    });
  }, [uniqueArticles, searchQuery, selectedTopic, getLocalized]);

  // Month + year grouping for the list views, driven by deduplicated filtered articles
  const monthGroups = React.useMemo(() => {
    const groups = new Map();
    filtered.forEach((item) => {
      const time = new Date(`${item.eventDate}T00:00:00`).getTime();
      const valid = !Number.isNaN(time);
      const date = valid ? new Date(time) : null;
      const key = valid ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : 'undated';

      if (!groups.has(key)) {
        groups.set(key, {
          key,
          label: valid ? date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Undated',
          sortTime: valid ? time : -Infinity,
          items: []
        });
      }
      groups.get(key).items.push(item);
    });

    return Array.from(groups.values()).sort((a, b) => b.sortTime - a.sortTime);
  }, [filtered]);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HERO BANNER (hidden in Reels mode so the feed gets full focus) */}
      {viewMode !== 'reels' && (
      <div className="bg-[#0B1F3A] rounded-3xl p-5 sm:p-7 text-white relative overflow-hidden border border-[#182B45] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-[#F2BE4F]/40 text-[#F2BE4F] text-[11px] font-semibold backdrop-blur-xs">
              <span className="w-3.5 h-3.5 rounded-full border border-[#F2BE4F] flex items-center justify-center text-[9px] font-bold">i</span>
              <span>Exam-Targeted Editorial Desk</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {t('dailyCurrentAffairs')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Curated daily current affairs for UPSC, APPSC, TPPSC, SSC, and Banking exams. Verified with PIB.
            </p>
          </div>

          <div className="flex items-center shrink-0">
            <Link
              to="/gk-practice"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F2BE4F] hover:bg-[#E0AC3C] text-[#0B1F3A] font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
            >
              <span>{t('practiceTodayGK')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
      )}

      {/* 2. SEARCH BAR & TOPIC PILLS (Matching image_1b19ce6e.png) */}
      <div className="space-y-3">
        {/* Full-width Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, organization, or topic..."
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-[#F6F8FC] border border-[#E3EAF2] rounded-2xl focus:bg-white focus:outline-hidden focus:border-[#2468B4] focus:ring-3 focus:ring-[#2468B4]/20 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter Topic Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
          {topics.map((tName) => {
            const isSelected = selectedTopic === tName;
            return (
              <button
                key={tName}
                type="button"
                onClick={() => setSelectedTopic(tName)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B1F3A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tName === 'Andhra Pradesh current affairs' ? 'Andhra Pradesh' : tName === 'Telangana current affairs' ? 'Telangana' : tName}
              </button>
            );
          })}
        </div>
      </div>

      {/* View Options Selector Bar (Flexible to switch between Editorial Dashboard, 3 in Row, Single Align, Grid) */}
      {showViewToggle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[#E3EAF2]">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 px-2">
            <span className="w-2 h-2 rounded-full bg-[#2468B4]" />
            <span>
              Showing <strong className="text-slate-900">{filtered.length}</strong> {selectedTopic === 'All' ? 'Current Affairs articles' : `${selectedTopic} stories`}
            </span>
          </div>

          <div className="flex items-center self-start sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs max-w-full overflow-x-auto no-scrollbar">
            {mobileReels && (
              <button
                type="button"
                onClick={() => setViewMode('reels')}
                className={`lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  viewMode === 'reels'
                    ? 'bg-white text-[#12345A] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Reels-style swipe feed (mobile)"
              >
                <Film className="w-3.5 h-3.5 text-[#2468B4]" />
                <span>Reels</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setViewMode('editorial')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'editorial'
                  ? 'bg-white text-[#12345A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Editorial Dashboard (as in image)"
            >
              <Layers className="w-3.5 h-3.5 text-[#2468B4]" />
              <span>Editorial Desk</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('threeInRow')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'threeInRow'
                  ? 'bg-white text-[#12345A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Display 3 in a row"
            >
              <Columns3 className="w-3.5 h-3.5 text-[#2468B4]" />
              <span>3 in Row</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('singleAlign')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'singleAlign'
                  ? 'bg-white text-[#12345A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Display single align (straight line list)"
            >
              <List className="w-3.5 h-3.5 text-[#2468B4]" />
              <span>Single Align</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#12345A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Display grid cards"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#2468B4]" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT RENDERING */}
      {viewMode === 'reels' ? (
        /* INSTAGRAM-REELS STYLE SWIPE FEED (mobile) - Full top-0 (removes global header) to above bottom nav */
        <div className="fixed top-0 bottom-[64px] pb-[max(0px,env(safe-area-inset-bottom))] left-0 right-0 z-40 bg-white animate-in fade-in duration-200 lg:hidden overflow-hidden flex flex-col">
          {/* Reels Header: App logo on left side of News Reels text */}
          <div className="bg-white px-4 pt-3 pb-2.5 space-y-2.5 border-b border-slate-100 safe-area-pt shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/aistudio/examquesthub-logo.png"
                  alt="ExamQuestHub"
                  className="w-8 h-8 rounded-xl object-contain bg-slate-50 border border-slate-200/80 p-0.5 shadow-2xs shrink-0"
                />
                <div className="leading-tight">
                  <h2 className="font-heading font-black text-[#0B1F3A] text-base uppercase tracking-tight">
                    News Reels
                  </h2>
                  <p className="text-[10px] text-slate-500 font-bold">Swipe up for next update</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('editorial')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black text-[#0B1F3A] bg-slate-50 border border-slate-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Classic View</span>
              </button>
            </div>

            {/* Topic Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap border transition-all cursor-pointer ${
                    selectedTopic === topic
                      ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-md'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-sm text-slate-500 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <p>No current affairs match your filters yet.</p>
              <button 
                onClick={() => setSelectedTopic('All')}
                className="text-[#2468B4] font-bold text-xs hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="flex-1 snap-y snap-mandatory overflow-y-auto no-scrollbar overscroll-contain">
              {filtered.map((item, idx) => (
                <div key={item.id} className="h-full w-full snap-start snap-always">
                  <ReelCard
                    item={item}
                    isBookmarked={!!bookmarkedIds[item.id]}
                    onToggleBookmark={toggleBookmark}
                    index={idx}
                    total={filtered.length}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : viewMode === 'editorial' ? (
        /* CLEAN UNBOXED CLASSIC VIEW (NO BACKGROUND CARD, NO HEAVY BOXES) */
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4.5 bg-[#2468B4] rounded-full inline-block" />
              <h2 className="font-heading font-black text-base sm:text-lg text-[#0B1F3A]">
                Latest Current Affairs Articles
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {filtered.length} {filtered.length === 1 ? 'Article' : 'Articles'}
            </span>
          </div>

          <div className="divide-y divide-slate-200/80">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500 space-y-2">
                <p>No current affairs match your filter query.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTopic('All');
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-[#2468B4] hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filtered.map((item) => {
                const headline = getLocalized(item.headline);
                const summary = getLocalized(item.summary);
                const detailSlug = item.slug || item.id;
                const isBookmarked = !!bookmarkedIds[item.id];
                const examTags = item.examRelevance || ['UPSC', 'APPSC', 'SSC'];

                return (
                  <article
                    key={item.id}
                    className="py-4 sm:py-5 first:pt-3 last:pb-1 flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-start group"
                  >
                    {/* Thumbnail */}
                    <div className="w-full sm:w-44 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 relative">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'}
                        alt={headline}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <span className="sm:hidden absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-bold uppercase tracking-wider">
                        {item.topic}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-[#1E3A5F] text-[10px] font-bold uppercase tracking-wider">
                            {item.topic}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{item.eventDate || 'Today'}</span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(item.id, e)}
                          className={`p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ${
                            isBookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'
                          }`}
                          title={isBookmarked ? 'Bookmarked' : 'Bookmark this article'}
                        >
                          <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>
                      </div>

                      <Link
                        to={`/current-affairs/${detailSlug}`}
                        className="font-heading font-black text-sm sm:text-base text-[#182B45] hover:text-[#2468B4] leading-snug block transition-colors"
                      >
                        {headline}
                      </Link>

                      <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed line-clamp-2 sm:line-clamp-3 font-normal">
                        {summary}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target:</span>
                          {examTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 font-semibold text-[10px] border border-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          to={`/current-affairs/${detailSlug}`}
                          className="font-bold text-[#2468B4] hover:text-[#12345A] flex items-center gap-1 text-xs shrink-0 transition-colors"
                        >
                          <span>Read Full Story</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      ) : viewMode === 'singleAlign' ? (
        /* STRAIGHT LINE LIST VIEW */
        <div className="space-y-6">
          {monthGroups.map((group) => (
            <section key={group.key} className="space-y-2.5">
              <MonthGroupHeader label={group.label} count={group.items.length} />
              {group.items.map((item) => (
                <StraightLineCurrentAffair
                  key={item.id}
                  item={item}
                  isExpanded={!!expandedIds[item.id]}
                  onToggle={() => toggleExpand(item.id)}
                />
              ))}
            </section>
          ))}
        </div>
      ) : viewMode === 'threeInRow' ? (
        /* 3-IN-A-ROW CARD VIEW */
        <div className="space-y-7">
          {monthGroups.map((group) => (
            <section key={group.key} className="space-y-4">
              <MonthGroupHeader label={group.label} count={group.items.length} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.items.map((item) => (
                  <CurrentAffairCard key={item.id} item={item} layout="threeInRow" />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="space-y-7">
          {monthGroups.map((group) => (
            <section key={group.key} className="space-y-4">
              <MonthGroupHeader label={group.label} count={group.items.length} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {group.items.map((item) => (
                  <CurrentAffairCard key={item.id} item={item} layout="grid" />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

    </div>
  );
}
