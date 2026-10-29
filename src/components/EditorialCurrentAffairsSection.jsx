import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
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
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import StraightLineCurrentAffair from './StraightLineCurrentAffair.jsx';
import CurrentAffairCard from './CurrentAffairCard.jsx';

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

export default function EditorialCurrentAffairsSection({
  articles = [],
  loading = false,
  showViewToggle = true,
  initialViewMode = 'editorial', // 'editorial' | 'threeInRow' | 'singleAlign' | 'grid'
  onOpenAdminImageModal = null // optional callback if admin wants quick image paste
}) {
  const { t, getLocalized } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [bookmarkedIds, setBookmarkedIds] = useState({});
  const [expandedIds, setExpandedIds] = useState({});

  const topics = [
    'All',
    'National news',
    'International affairs',
    'Economy',
    'Science and technology',
    'Environment',
    'Awards and honours',
    'Sports',
    'Government schemes',
    'Andhra Pradesh current affairs',
    'Telangana current affairs'
  ];

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
    const matchTopic = selectedTopic === 'All' || item.topic === selectedTopic;
    return matchSearch && matchTopic;
  });

  // Top main cards (left 2-column grid in screenshot)
  const mainCards = filtered.slice(0, 6);
  // Compact mini cards (top right 2x2 grid in screenshot)
  const miniCards = filtered.slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HERO BANNER (Matching image_1b19ce6e.png exactly) */}
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

          <div className="flex items-center self-start sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
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
      {viewMode === 'editorial' ? (
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

            {/* Editor's Picks (Two wide highlight cards matching bottom of image_1b19ce6e.png) */}
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
                
                {/* Editor Pick 1: Navy rounded card */}
                <div className="bg-[#0B1F3A] rounded-2xl p-4 sm:p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#F2BE4F] text-[10px] font-bold border border-[#F2BE4F]/30">
                        Exam-Targeted Editorial Desk
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <h4 className="font-heading font-extrabold text-sm sm:text-base text-white leading-snug">
                          Cabinet Approves Pradhan Mantri Viksit Gram Swaraj Yojana
                        </h4>
                      </div>
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white/20">
                        <img
                          src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80"
                          alt="Cabinet meeting"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 leading-relaxed">
                      <strong className="text-white">SIMBEX-2026:</strong> The Union Cabinet approved the Pradhan Mantri Viksit Gram Swaraj Yojana as a Centrally Sponsored Scheme with ₹97,395 crore outlay, fostering saturation of grassroots amenities.
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Oct 28, 2026 • Cabinet Communique</span>
                    <Link to="/current-affairs" className="text-[#F2BE4F] font-bold hover:underline flex items-center gap-1">
                      <span>Read Feature</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <GoldenCornerFlourish />
                </div>

                {/* Editor Pick 2: Mint/Sky soft card */}
                <div className="bg-[#F0F7FB] rounded-2xl p-4 sm:p-5 border border-[#D5E8F3] text-[#182B45] flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Economy
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#182B45] leading-snug">
                          Cabinet Approves Pradhan Mantri Viksit Gram Swaraj Yojana
                        </h4>
                      </div>
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80"
                          alt="Rural development"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 leading-relaxed">
                      <strong className="text-slate-900">Pradhan Mantri Yojana:</strong> The Union Cabinet approved the rural infrastructure scheme comprising a central share of ₹64,499.48 crore and state share of ₹32,896.07 crore.
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Oct 28, 2026 • Ministry of Finance</span>
                    <Link to="/current-affairs" className="text-[#2468B4] font-bold hover:underline flex items-center gap-1">
                      <span>Read Feature</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <GoldenCornerFlourish />
                </div>

              </div>
            </div>

          </div>

        </div>
      ) : viewMode === 'singleAlign' ? (
        /* STRAIGHT LINE LIST VIEW */
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <StraightLineCurrentAffair
              key={item.id}
              item={item}
              isExpanded={!!expandedIds[item.id]}
              onToggle={() => toggleExpand(item.id)}
            />
          ))}
        </div>
      ) : viewMode === 'threeInRow' ? (
        /* 3-IN-A-ROW CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <CurrentAffairCard key={item.id} item={item} layout="threeInRow" />
          ))}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <CurrentAffairCard key={item.id} item={item} layout="grid" />
          ))}
        </div>
      )}

    </div>
  );
}
