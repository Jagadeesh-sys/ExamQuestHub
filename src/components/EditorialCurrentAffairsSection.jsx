import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  Film,
  Search,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
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
    <article className="relative h-full w-full snap-start snap-always bg-white overflow-y-auto no-scrollbar pb-24 pt-6">
      <div className="px-4 pb-12 space-y-6">
        {/* Title / Headline - First */}
        <h2 className="font-heading font-black text-[#0B1F3A] text-2xl leading-[1.2] tracking-tight pt-2">
          {headline}
        </h2>

        {/* Top Info: Category + Date + Page Indicator */}
        <div className="flex items-center justify-between text-[10px] font-bold border-b border-slate-100 pb-3">
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

        {/* Main Image - Second */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/50 shadow-sm">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=900&q=80'}
            alt={headline}
            loading="lazy"
            className="w-full h-auto object-contain max-h-[450px]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80';
            }}
          />
        </div>

        {/* Verified Source Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold shrink-0">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified:</span>
            </div>
            <span className="text-slate-700 font-extrabold truncate">
              {item.sourceName || 'Press Information Bureau - BRICS Summit'}
            </span>
          </div>
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#2468B4] font-bold flex items-center gap-0.5 hover:underline shrink-0 ml-2"
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Matter (Summary + Content) - Third */}
        <div className="space-y-5">
          {/* Yellow Highlight Summary Box */}
          <div className="relative p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 flex gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] flex items-center justify-center shrink-0 shadow-md">
              <Newspaper className="w-5 h-5 text-[#F2BE4F]" />
            </div>
            <p className="text-slate-800 text-[13px] leading-relaxed font-semibold">
              {summary}
            </p>
          </div>

          {/* Detailed News Header */}
          <div className="flex items-center gap-3 pt-2">
            <div className="w-1.5 h-6 bg-[#2468B4] rounded-full" />
            <h3 className="font-heading font-black text-[#0B1F3A] text-lg">Detailed News</h3>
          </div>

          {/* Detailed Content */}
          {content && (
            <div className="text-slate-600 text-[13.5px] leading-relaxed space-y-4 font-medium px-1">
              {content}
            </div>
          )}

          {/* Key Highlights Section */}
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3.5">
            <div className="flex items-center gap-2.5 text-[#2468B4] font-bold">
              <Zap className="w-5 h-5 fill-current" />
              <span className="text-sm">Key Highlights</span>
            </div>
            <ul className="space-y-2.5">
              {[
                "Important international summit held in New Delhi",
                "Adopted the landmark New Delhi Declaration",
                "Focus on resilience, innovation and cooperation",
                "Strengthened multilateralism and people-to-people ties"
              ].map((highlight, idx) => (
                <li key={idx} className="flex gap-3 text-slate-700 text-[13px] leading-tight font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2468B4] mt-1.5 shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Pagination Dots & Swipe Indicator */}
        <div className="pt-8 flex flex-col items-center gap-4">
          <div className="flex gap-1.5">
            {[...Array(Math.min(5, total))].map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === (index % 5) ? 'w-8 bg-[#2468B4]' : 'w-6 bg-slate-200'
                }`} 
              />
            ))}
          </div>
          <div className="flex flex-col items-center gap-1.5 text-slate-400 animate-bounce">
            <ChevronUp className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Swipe up for next update</span>
          </div>
        </div>
      </div>

      {/* Floating Action Rail - Matches Image */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-5 items-center">
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={(e) => onToggleBookmark(item.id, e)}
            className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all active:scale-90 ${
              isBookmarked
                ? 'bg-[#F2BE4F] text-[#0B1F3A]'
                : 'bg-slate-50/80 backdrop-blur-md text-slate-700 border border-white'
            }`}
          >
            <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase">Save</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={handleShare}
            className="w-14 h-14 rounded-2xl bg-slate-50/80 backdrop-blur-md text-slate-700 border border-white shadow-xl flex items-center justify-center active:scale-90"
          >
            <Share2 className="w-6 h-6" />
          </button>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase">Share</span>
        </div>
        
        <div className="flex flex-col items-center gap-1 mt-4">
          <div className="w-14 h-14 rounded-full bg-[#0B1F3A] text-white shadow-2xl flex items-center justify-center animate-pulse">
            <ArrowRight className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-700 uppercase">Next</span>
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

  // Filter articles based on search and selected topic
  const filtered = articles.filter((item) => {
    const headline = getLocalized(item.headline).toLowerCase();
    const summary = getLocalized(item.summary).toLowerCase();
    const s = searchQuery.toLowerCase();

    const matchSearch = !s || headline.includes(s) || summary.includes(s);
    const matchTopic = topicMatches(item.topic, selectedTopic);
    return matchSearch && matchTopic;
  });

  // Top main cards (left 2-column grid in screenshot)
  const mainCards = filtered.slice(0, 6);
  // Compact mini cards (top right 2x2 grid in screenshot)
  const miniCards = filtered.slice(0, 4);

  // Month + year grouping for the list views, driven by each article's eventDate.
  // Groups are ordered newest first; articles without a valid date fall into "Undated".
  const monthGroups = (() => {
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
  })();

  // "Editor's Picks" always shows the two most recent articles, so the section
  // refreshes on its own as new current affairs are published — nothing hardcoded.
  const editorPicks = [...articles]
    .filter((item) => item?.headline)
    .sort((a, b) => {
      const ta = new Date(`${a.eventDate}T00:00:00`).getTime();
      const tb = new Date(`${b.eventDate}T00:00:00`).getTime();
      return (Number.isNaN(tb) ? -Infinity : tb) - (Number.isNaN(ta) ? -Infinity : ta);
    })
    .slice(0, 2);

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
        /* INSTAGRAM-REELS STYLE SWIPE FEED (mobile) */
        <div className="fixed top-0 left-0 right-0 bottom-16 z-50 bg-white animate-in fade-in duration-200 lg:hidden overflow-hidden flex flex-col">
          {/* Floating Exit Button */}
          <button
            type="button"
            onClick={() => setViewMode('editorial')}
            className="absolute top-4 left-4 z-[60] p-2.5 rounded-xl bg-white/80 backdrop-blur-md text-[#0B1F3A] border border-slate-200 shadow-lg active:scale-95 transition-all"
            aria-label="Exit Reels"
          >
            <Grid className="w-5 h-5" />
          </button>

          {/* Floating Topic Filters (Horizontal Scroll) */}
          <div className="absolute top-4 right-4 left-16 z-[60] flex items-center gap-2 overflow-x-auto no-scrollbar">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap border transition-all ${
                  selectedTopic === topic
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-md'
                    : 'bg-white/80 backdrop-blur-md text-slate-600 border-slate-200'
                }`}
              >
                {topic}
              </button>
            ))}
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
        /* EXACT COMPOSITE 3-COLUMN DASHBOARD AS IN image_1b19ce6e.png */
        <div className="space-y-8">
          
          {/* Composite Top Section: [Left: 2-Col Main Cards] | [Center: Update Nest Rail] | [Right: Mini Cards + Monthly Digest] */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* LEFT AREA: 2-Column Grid of Main Current Affairs Cards (lg:col-span-6) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mainCards.map((item) => {
                  const headline = getLocalized(item.headline);
                  const summary = getLocalized(item.summary);
                  const detailSlug = item.slug || item.id;
                  const isBookmarked = !!bookmarkedIds[item.id];
                  const examTags = item.examRelevance || ['UPSC', 'APPSC', 'SSC'];

                  return (
                    <article
                      key={item.id}
                      className="bg-white rounded-2xl border border-[#E3EAF2] hover:border-[#2468B4]/40 hover:shadow-md transition-all p-3.5 flex flex-col justify-between relative overflow-hidden group"
                    >
                      <div className="space-y-2">
                        {/* Top row: Thumbnail on Left + Tag & Star on Right */}
                        <div className="flex gap-2.5">
                          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                            <img
                              src={item.imageUrl || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'}
                              alt={headline}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="px-2 py-0.5 rounded bg-[#F0F4F9] text-[#1E3A5F] text-[9px] font-semibold truncate border border-slate-200">
                                {item.topic}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => toggleBookmark(item.id, e)}
                                className={`p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ${
                                  isBookmarked ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'
                                }`}
                                title={isBookmarked ? 'Bookmarked' : 'Bookmark this article'}
                              >
                                <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                              </button>
                            </div>

                            <Link
                              to={`/current-affairs/${detailSlug}`}
                              className="font-heading font-extrabold text-[#182B45] hover:text-[#2468B4] text-xs leading-snug line-clamp-2 block transition-colors"
                            >
                              {headline}
                            </Link>
                          </div>
                        </div>

                        {/* Synopsis */}
                        <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3">
                          {summary}
                        </p>

                        {/* Exam Relevance Tags row */}
                        <div className="flex items-center flex-wrap gap-1 pt-1 text-[10px]">
                          <span className="font-semibold text-slate-400 mr-1">
                            Exam Relevance
                          </span>
                          {examTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-medium text-[9px] border border-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 relative z-10">
                        <div className="flex items-center gap-2 truncate">
                          <span className="flex items-center gap-1 shrink-0">
                            <Calendar className="w-2.5 h-2.5 text-slate-400" />
                            <span>{item.eventDate}</span>
                          </span>
                          <span className="truncate max-w-[110px]" title={item.sourceName}>
                            • {item.sourceName || 'PIB'}
                          </span>
                        </div>

                        <Link
                          to={`/current-affairs/${detailSlug}`}
                          className="font-bold text-[#2468B4] hover:underline flex items-center gap-0.5 shrink-0"
                        >
                          <span>Read More</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* Corner Golden Flair */}
                      <GoldenCornerFlourish />
                    </article>
                  );
                })}
              </div>
            </div>

            {/* MIDDLE AREA: "Update Nest" Rail (lg:col-span-2) */}
            <div className="lg:col-span-2 bg-[#FAF8F5] rounded-2xl border border-amber-200/60 p-3.5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-center space-y-1 mb-3">
                  <GoldenNestIcon />
                  <h3 className="font-heading font-extrabold text-xs text-[#182B45] tracking-tight">
                    Update Nest
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {/* Alert 1 */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-1 text-center">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="font-bold text-[11px] text-[#182B45]">
                      Content Update
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Recent PIB Releases & Case Studies Added.
                    </p>
                  </div>

                  {/* Alert 2 */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-1 text-center">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <div className="font-bold text-[11px] text-[#182B45]">
                      Exam Syllabus Refresh
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      UPSC & Banking relevance tags updated for new patterns.
                    </p>
                  </div>

                  {/* Alert 3 */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-1 text-center">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <div className="font-bold text-[11px] text-[#182B45]">
                      Feature Notification
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      New 'Analyse similar topics' tool launched.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT AREA: Mini Cards Grid + Monthly Digest (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Mini Cards 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {miniCards.map((item) => {
                  const headline = getLocalized(item.headline);
                  const detailSlug = item.slug || item.id;
                  const isBookmarked = !!bookmarkedIds[item.id];
                  const examTags = (item.examRelevance || ['UPSC', 'SSC']).slice(0, 3);

                  return (
                    <article
                      key={`mini-${item.id}`}
                      className="bg-white rounded-xl border border-[#E3EAF2] hover:border-[#2468B4]/40 p-2.5 flex flex-col justify-between relative overflow-hidden group shadow-2xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex gap-1.5 items-start">
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80'}
                            alt={headline}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-100"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] font-semibold text-[#1E3A5F] px-1.5 py-0.2 bg-[#F0F4F9] rounded block truncate">
                              {item.topic}
                            </span>
                            <Link
                              to={`/current-affairs/${detailSlug}`}
                              className="font-bold text-[10px] text-[#182B45] hover:text-[#2468B4] line-clamp-2 leading-tight mt-0.5 block"
                            >
                              {headline}
                            </Link>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 pt-0.5">
                          <span className="text-[8px] text-slate-400">Exam:</span>
                          {examTags.map((tag, idx) => (
                            <span key={idx} className="text-[8px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-1.5 mt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                        <span>{item.eventDate}</span>
                        <Link to={`/current-affairs/${detailSlug}`} className="text-[#2468B4] font-bold hover:underline">
                          Read More &gt;
                        </Link>
                      </div>

                      <GoldenCornerFlourish />
                    </article>
                  );
                })}
              </div>

              {/* Monthly Digest Card (matching blush/peach card in image_1b19ce6e.png) */}
              <div className="bg-[#FDF4ED] rounded-2xl border border-[#F5DACB] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-xs sm:text-sm text-[#182B45]">
                    Monthly Digest
                  </h3>
                  <Link
                    to="/current-affairs"
                    className="text-[11px] font-bold text-[#E07A5F] hover:underline"
                  >
                    View All &gt;
                  </Link>
                </div>

                <div className="space-y-2 text-xs">
                  {monthlyDigestItems.map((digest, i) => (
                    <div key={i} className="space-y-0.5 pb-2 border-b border-[#F5DACB]/50 last:border-b-0 last:pb-0">
                      <h4 className="font-bold text-[11px] text-[#2D2A26]">
                        {digest.title}
                      </h4>
                      <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-2">
                        {digest.snippet}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  to="/current-affairs"
                  className="block w-full py-2 px-3 text-center rounded-xl bg-[#E07A5F] hover:bg-[#D0694E] text-white text-xs font-bold transition-colors shadow-xs active:scale-98"
                >
                  View All &gt;
                </Link>
              </div>

            </div>

          </div>

          {/* Trending Topics & Editor's Picks Row */}
          <div className="space-y-4">
            
            {/* Trending Topics Cloud */}
            <div className="bg-white rounded-2xl border border-[#E3EAF2] p-4">
              <h3 className="font-heading font-extrabold text-xs sm:text-sm text-[#182B45] mb-2.5">
                Trending Topics
              </h3>
              <div className="flex flex-wrap items-center gap-1.5">
                {trendingTags.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 rounded-full bg-[#FCEEE7] hover:bg-[#F8DEC0] text-[#9E4D36] border border-[#F5D8CC] text-xs font-medium transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor's Picks — driven by the two newest articles in the database */}
            {editorPicks.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-xs sm:text-sm text-[#182B45]">
                    Editor's Picks
                  </h3>
                  <Link
                    to="/current-affairs"
                    className="text-xs font-bold text-[#2468B4] hover:underline"
                  >
                    View All &gt;
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editorPicks.map((item, index) => {
                    const isNavy = index === 0;
                    const headline = getLocalized(item.headline);
                    const summary = getLocalized(item.summary);
                    const detailSlug = item.slug || item.id;

                    return (
                      <div
                        key={item.id}
                        className={
                          isNavy
                            ? 'bg-[#0B1F3A] rounded-2xl p-4 sm:p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-xs'
                            : 'bg-[#F0F7FB] rounded-2xl p-4 sm:p-5 border border-[#D5E8F3] text-[#182B45] flex flex-col justify-between relative overflow-hidden shadow-xs'
                        }
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span
                              className={
                                isNavy
                                  ? 'px-2.5 py-0.5 rounded-full bg-white/10 text-[#F2BE4F] text-[10px] font-bold border border-[#F2BE4F]/30'
                                  : 'px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold'
                              }
                            >
                              {item.topic || "Editor's Pick"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <Link
                                to={`/current-affairs/${detailSlug}`}
                                className={`font-heading font-extrabold text-sm sm:text-base leading-snug hover:underline ${
                                  isNavy ? 'text-white' : 'text-[#182B45]'
                                }`}
                              >
                                {headline}
                              </Link>
                            </div>
                            <div
                              className={`w-14 h-14 overflow-hidden shrink-0 ${
                                isNavy ? 'rounded-full border-2 border-white/20' : 'rounded-xl border border-slate-200'
                              }`}
                            >
                              <img
                                src={item.imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80'}
                                alt={headline}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80';
                                }}
                              />
                            </div>
                          </div>

                          <p
                            className={`text-[11px] leading-relaxed line-clamp-3 ${
                              isNavy ? 'text-slate-300' : 'text-slate-600'
                            }`}
                          >
                            {summary}
                          </p>
                        </div>

                        <div
                          className={`pt-3 mt-3 border-t flex items-center justify-between text-[11px] ${
                            isNavy ? 'border-white/10 text-slate-400' : 'border-slate-200/60 text-slate-500'
                          }`}
                        >
                          <span className="truncate">
                            {item.eventDate || ''}
                            {item.sourceName ? ` • ${item.sourceName}` : ''}
                          </span>
                          <Link
                            to={`/current-affairs/${detailSlug}`}
                            className={`font-bold hover:underline flex items-center gap-1 shrink-0 ${
                              isNavy ? 'text-[#F2BE4F]' : 'text-[#2468B4]'
                            }`}
                          >
                            <span>Read Feature</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>

                        <GoldenCornerFlourish />
                      </div>
                    );
                  })}
                </div>
              </div>
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
