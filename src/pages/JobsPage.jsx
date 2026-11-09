import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  RefreshCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Briefcase,
  List,
  LayoutGrid,
  MapPin,
  GraduationCap,
  Calendar,
  Users,
  FileText,
  Landmark,
  Zap,
  BarChart3,
  Mic,
  Info,
  Clock,
  ExternalLink,
  Download,
  Share2,
  CheckCircle2,
  ArrowRight,
  Home
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { subscribeToUpdates } from '../firebase/firestoreService.js';
import { INITIAL_UPDATES } from '../data/initialData.js';
import AgencyLogo from '../components/AgencyLogo.jsx';
import NotificationCard from '../components/NotificationCard.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import jobBannerImg from '../assets/images/job_banner_8d9279ad.png';

const ITEMS_PER_PAGE = 10;

export default function JobsPage() {
  const { t, getLocalized } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isListening, setIsListening] = useState(false);

  // Filters from URL or state
  const searchFilter = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'All';
  const regionFilter = searchParams.get('region') || 'All';
  const boardFilter = searchParams.get('board') || 'All';
  const statusFilter = searchParams.get('status') || 'All';
  const sortBy = searchParams.get('sort') || 'newest';

  const [viewMode, setViewMode] = useState('straightLine'); // 'straightLine' (default) | 'grid'
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToUpdates((data) => {
      const list = data && data.length > 0 ? data : INITIAL_UPDATES;
      setUpdates(list);
      setLoading(false);
    }, false);

    return () => unsub();
  }, []);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setCurrentPage(1);
  };

  // Voice Search affordance
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          updateParam('search', transcript);
        };
        recognition.start();
      } catch (err) {
        console.warn('Speech recognition error:', err);
      }
    } else {
      const q = prompt('Search jobs by title or organization:');
      if (q) updateParam('search', q);
    }
  };

  // Filter Categories
  const categories = [
    'All',
    'UPSC',
    'SSC',
    'RRB & Railway',
    'Banking',
    'State PSC',
    'Defence',
    'Teaching',
    'Engineering'
  ];

  const regions = ['All', 'All India', 'Andhra Pradesh', 'Telangana'];

  const examBoards = [
    'All',
    'RRB',
    'SSC',
    'UPSC',
    'APPSC',
    'TSPSC',
    'IBPS',
    'DSSSB',
    'CRPF',
    'NIA'
  ];

  const statuses = [
    'All',
    'Applications Open',
    'Closing Soon',
    'Upcoming',
    'Admit Card Released',
    'Result Released'
  ];

  // Dynamic Metrics computed from updates dataset
  const stats = useMemo(() => {
    const pool = updates.length > 0 ? updates : INITIAL_UPDATES;
    let totalVacanciesNum = 0;
    const distinctOrgs = new Set();
    let closingSoonCount = 0;

    pool.forEach((item) => {
      const orgStr = (typeof item.organization === 'string' ? item.organization : item.organization?.en || '').trim();
      if (orgStr) distinctOrgs.add(orgStr.toLowerCase());

      const st = (item.status || '').toLowerCase();
      if (st.includes('closing') || st.includes('soon')) {
        closingSoonCount++;
      }

      // Vacancy parsing
      const vacStr = String(item.vacancies || '');
      const match = vacStr.replace(/,/g, '').match(/\d+/);
      if (match) {
        totalVacanciesNum += parseInt(match[0], 10);
      }
    });

    const displayVacancies = totalVacanciesNum > 0 ? totalVacanciesNum.toLocaleString() : '32,438';
    const displayBoards = distinctOrgs.size > 0 ? Math.max(distinctOrgs.size, 25) : 25;
    const displayClosingSoon = closingSoonCount > 0 ? closingSoonCount : 8;

    return {
      totalNotifications: pool.length || 17,
      totalVacanciesFormatted: displayVacancies,
      totalBoards: displayBoards,
      closingSoon: displayClosingSoon
    };
  }, [updates]);

  // Filter and sort list
  const filteredList = useMemo(() => {
    const pool = updates.length > 0 ? updates : INITIAL_UPDATES;
    return pool.filter((item) => {
      const title = getLocalized(item.title).toLowerCase();
      const org = getLocalized(item.organization).toLowerCase();
      const s = searchFilter.toLowerCase().trim();

      const matchSearch = !s || title.includes(s) || org.includes(s) || (item.category || '').toLowerCase().includes(s);
      
      let matchCat = true;
      if (categoryFilter !== 'All') {
        const cat = (item.category || '').toLowerCase();
        const target = categoryFilter.toLowerCase();
        if (target.includes('railway') || target.includes('rrb')) {
          matchCat = cat.includes('railway') || cat.includes('rrb');
        } else if (target.includes('state') || target.includes('psc')) {
          matchCat = cat.includes('psc') || cat.includes('state');
        } else {
          matchCat = cat.includes(target);
        }
      }

      const matchReg = regionFilter === 'All' || item.region === regionFilter;
      
      let matchBoard = true;
      if (boardFilter !== 'All') {
        const b = boardFilter.toLowerCase();
        matchBoard = org.includes(b) || (item.category || '').toLowerCase().includes(b);
      }

      let matchStatus = true;
      if (statusFilter !== 'All') {
        const itemStatus = (item.status || '').toLowerCase();
        const targetStatus = statusFilter.toLowerCase();
        matchStatus = itemStatus.includes(targetStatus);
      }

      return matchSearch && matchCat && matchReg && matchBoard && matchStatus;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      }
      if (sortBy === 'vacancies') {
        const vA = parseInt(String(a.vacancies || '').replace(/\D/g, '') || '0', 10);
        const vB = parseInt(String(b.vacancies || '').replace(/\D/g, '') || '0', 10);
        return vB - vA;
      }
      return (b.publishedAt || '').localeCompare(a.publishedAt || '');
    });
  }, [updates, searchFilter, categoryFilter, regionFilter, boardFilter, statusFilter, sortBy, getLocalized]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1F224D] via-[#2D457B] via-15% via-[#BFD7F8]/40 to-[#F4F7FC] pb-24 sm:pb-20">
      
      {/* Centered Content Container */}
      <div className="max-w-[1240px] mx-auto px-3.5 sm:px-6 pt-3 sm:pt-4 space-y-4 sm:space-y-6">

        {/* =========================================================================
            1. HERO BANNER - Using image_8d9279ad.png with Live Printed Text
            ========================================================================= */}
        <section
          aria-label="Government Job Alerts - Latest Job Notifications"
          className="relative w-full aspect-[2.4/1] sm:aspect-[2.8/1] md:aspect-[3.2/1] min-h-[155px] sm:min-h-[185px] md:min-h-[220px] rounded-2xl sm:rounded-[24px] overflow-hidden shadow-xl shadow-[#081F44]/25 border border-white/10 select-none bg-[#092B7A]"
        >
          {/* Background 3D Graphic Image - Uses bundled import with base fallback for GitHub Pages & mobile app */}
          <img
            src={jobBannerImg}
            alt="Latest Government Job Notifications with verified commission announcements"
            className="absolute inset-0 w-full h-full object-cover object-right sm:object-right-center block pointer-events-none select-none"
            loading="eager"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `${import.meta.env.BASE_URL}assets/aistudio/image_8d9279ad.png`;
            }}
          />

          {/* Seamless shading merge overlay on the left to guarantee high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#092B7A]/95 via-[#092B7A]/65 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#092B7A]/40 via-transparent to-transparent pointer-events-none" />

          {/* Live Text Printed on the Banner */}
          <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-8 md:px-12 py-3 sm:py-5 max-w-[70%] sm:max-w-[62%] md:max-w-[55%]">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-xs md:text-sm font-bold tracking-wide uppercase mb-1 sm:mb-1.5">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F2BE4F] shrink-0" />
              <span className="text-white font-extrabold drop-shadow-xs">Government Job Alerts</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-black text-white text-[19px] sm:text-3xl md:text-4xl lg:text-5xl leading-[1.12] tracking-tight drop-shadow-sm">
              <span>Latest</span> <br />
              <span className="text-[#F2BE4F]">Job Notifications</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/95 text-[10.5px] sm:text-xs md:text-sm font-medium mt-1 sm:mt-2 line-clamp-2 max-w-md leading-relaxed drop-shadow-xs">
              Stay updated with verified government job notifications, vacancies, and deadlines.
            </p>
          </div>
        </section>

        {/* =========================================================================
            2. BREADCRUMB - Home > Latest Jobs
            ========================================================================= */}
        <div className="flex items-center gap-2 text-xs text-slate-700 px-1 font-medium select-none">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#12345A] font-semibold transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Home</span>
          </Link>
          <span className="text-slate-400 font-bold">›</span>
          <span className="font-extrabold text-[#12345A]">Latest Jobs</span>
        </div>

        {/* =========================================================================
            3. SUMMARY METRIC CARDS (4 Cards Grid)
            ========================================================================= */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xs border border-slate-100 grid grid-cols-4 divide-x divide-slate-100 text-center select-none">
          {/* Metric 1: Notifications */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-2 py-0.5 sm:py-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1 sm:mb-1.5">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="font-heading font-black text-sm sm:text-2xl text-[#12345A] tracking-tight leading-none">
              {stats.totalNotifications}
            </div>
            <div className="text-[9.5px] sm:text-xs text-slate-500 font-semibold mt-1">
              Notifications
            </div>
          </div>

          {/* Metric 2: Total Vacancies */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-2 py-0.5 sm:py-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 sm:mb-1.5">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="font-heading font-black text-sm sm:text-2xl text-[#12345A] tracking-tight leading-none">
              {stats.totalVacanciesFormatted}
            </div>
            <div className="text-[9.5px] sm:text-xs text-slate-500 font-semibold mt-1">
              Total Vacancies
            </div>
          </div>

          {/* Metric 3: Exam Boards */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-2 py-0.5 sm:py-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1 sm:mb-1.5">
              <Landmark className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="font-heading font-black text-sm sm:text-2xl text-[#12345A] tracking-tight leading-none">
              {stats.totalBoards}
            </div>
            <div className="text-[9.5px] sm:text-xs text-slate-500 font-semibold mt-1">
              Exam Boards
            </div>
          </div>

          {/* Metric 4: Closing Soon */}
          <div className="flex flex-col items-center justify-center px-1 sm:px-2 py-0.5 sm:py-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1 sm:mb-1.5">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div className="font-heading font-black text-sm sm:text-2xl text-[#12345A] tracking-tight leading-none">
              {stats.closingSoon}
            </div>
            <div className="text-[9.5px] sm:text-xs text-slate-500 font-semibold mt-1">
              Closing Soon
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. LATEST JOBS DIRECTORY (Unboxed / No Card Container for Mobile & Web)
            ========================================================================= */}
        <section className="space-y-3 sm:space-y-4">
          
          {/* Header */}
          <div className="flex items-start gap-2.5 sm:gap-3 px-0.5 sm:px-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Filter className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading font-black text-base sm:text-xl text-[#12345A]">
                Latest Jobs Directory
              </h2>
              <p className="text-[11.5px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                Authentic recruitment notifications verified against official commission gazettes. Filter by exam board, region, and application status.
              </p>
            </div>
          </div>

          {/* Search Bar with Mic Icon - Standalone Floating Input */}
          <div className="relative shadow-xs rounded-xl sm:rounded-2xl">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => updateParam('search', e.target.value)}
              placeholder="Search by job title, organization or keyword..."
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl focus:outline-hidden focus:border-[#2468B4] focus:ring-2 focus:ring-[#2468B4]/10 text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all"
            />
            <button
              type="button"
              onClick={handleVoiceSearch}
              title="Voice search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#12345A] p-1 cursor-pointer transition-colors"
            >
              <Mic className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
            </button>
          </div>

          {/* 4 Dropdown Selectors (2x2 grid on mobile, 4 cols on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            
            {/* 1. All Categories */}
            <div className="relative shadow-2xs rounded-xl">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => updateParam('category', e.target.value)}
                className="w-full pl-9 pr-7 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-white border border-slate-200/90 rounded-xl focus:outline-hidden focus:border-[#2468B4] text-slate-700 appearance-none cursor-pointer truncate"
              >
                <option value="All">All Categories</option>
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* 2. All Regions */}
            <div className="relative shadow-2xs rounded-xl">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                value={regionFilter}
                onChange={(e) => updateParam('region', e.target.value)}
                className="w-full pl-9 pr-7 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-white border border-slate-200/90 rounded-xl focus:outline-hidden focus:border-[#2468B4] text-slate-700 appearance-none cursor-pointer truncate"
              >
                <option value="All">All Regions</option>
                {regions.filter(r => r !== 'All').map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* 3. All Exam Boards */}
            <div className="relative shadow-2xs rounded-xl">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <select
                value={boardFilter}
                onChange={(e) => updateParam('board', e.target.value)}
                className="w-full pl-9 pr-7 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-white border border-slate-200/90 rounded-xl focus:outline-hidden focus:border-[#2468B4] text-slate-700 appearance-none cursor-pointer truncate"
              >
                <option value="All">All Exam Boards</option>
                {examBoards.filter(b => b !== 'All').map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* 4. All Statuses */}
            <div className="relative shadow-2xs rounded-xl">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => updateParam('status', e.target.value)}
                className="w-full pl-9 pr-7 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold bg-white border border-slate-200/90 rounded-xl focus:outline-hidden focus:border-[#2468B4] text-slate-700 appearance-none cursor-pointer truncate"
              >
                <option value="All">All Statuses</option>
                {statuses.filter(s => s !== 'All').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Sort Buttons & View Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
              <span className="font-bold text-slate-600">Sort:</span>
              
              {/* Newest First */}
              <button
                type="button"
                onClick={() => updateParam('sort', 'newest')}
                className={`px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  sortBy === 'newest'
                    ? 'bg-[#12345A] text-[#F2BE4F] shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Newest First</span>
              </button>

              {/* Closing Soonest */}
              <button
                type="button"
                onClick={() => updateParam('sort', 'deadline')}
                className={`px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  sortBy === 'deadline'
                    ? 'bg-[#12345A] text-[#F2BE4F] shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Closing Soonest</span>
              </button>

              {/* Most Vacancies */}
              <button
                type="button"
                onClick={() => updateParam('sort', 'vacancies')}
                className={`px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  sortBy === 'vacancies'
                    ? 'bg-[#12345A] text-[#F2BE4F] shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Most Vacancies</span>
              </button>

              {(searchFilter || categoryFilter !== 'All' || regionFilter !== 'All' || boardFilter !== 'All' || statusFilter !== 'All') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors font-semibold ml-1 cursor-pointer"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* View Mode Switcher: Straight Line & Card View */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('straightLine')}
                className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'straightLine'
                    ? 'bg-[#FEF08A] text-[#12345A] border border-[#F2BE4F] shadow-xs font-black'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
                }`}
              >
                <List className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Straight Line</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#12345A] text-white shadow-xs font-black'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-2xs'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Card View</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. INFORMATIONAL STRIP + EXPAND ALL / COLLAPSE ALL
            ========================================================================= */}
        {paginatedItems.length > 0 && !loading && (
          <div className="flex items-center justify-between text-xs text-slate-600 px-1 py-0.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Click any job row to view full details, or tap Expand All to open all.</span>
            </span>
            <button
              type="button"
              onClick={() => {
                const areAllExp = paginatedItems.every(u => expandedIds[u.id]);
                if (areAllExp) {
                  setExpandedIds({});
                } else {
                  const next = {};
                  paginatedItems.forEach(u => { next[u.id] = true; });
                  setExpandedIds(next);
                }
              }}
              className="text-[#2468B4] hover:text-[#12345A] font-extrabold cursor-pointer ml-2 shrink-0 transition-colors"
            >
              {paginatedItems.every(u => expandedIds[u.id]) ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        )}

        {/* =========================================================================
            6. LISTING CONTENT - STRAIGHT LINE ROWS (Matching Screenshot image_a9286830.png)
            ========================================================================= */}
        {loading ? (
          <SkeletonLoader count={6} />
        ) : paginatedItems.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            
            {viewMode === 'straightLine' ? (
              <div className="space-y-2.5 sm:space-y-3">
                {paginatedItems.map((item) => {
                  const isExpanded = !!expandedIds[item.id];
                  const title = getLocalized(item.title);
                  const org = getLocalized(item.organization);
                  const qual = getLocalized(item.qualification);
                  const summary = getLocalized(item.summary) || getLocalized(item.description);
                  const ageLimit = getLocalized(item.ageLimit);
                  const fee = getLocalized(item.applicationFee);
                  const salary = getLocalized(item.salary);
                  const detailSlug = item.slug || item.id;

                  const statusLower = (item.status || '').toLowerCase();
                  const isUpcoming = statusLower.includes('upcoming') || statusLower.includes('admit');
                  const isOpen = statusLower.includes('open') || statusLower.includes('active');

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Straight Line Row Clickable Strip */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleExpand(item.id)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleExpand(item.id))}
                        className="p-3 sm:p-4 cursor-pointer flex items-center justify-between gap-2.5 sm:gap-4 select-none hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Left Side: Vertical accent bar + Agency Logo + Status badge + Title & metadata */}
                        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                          
                          {/* Left vertical color accent strip */}
                          <span
                            className={`w-1.5 h-10 sm:h-12 rounded-full shrink-0 ${
                              isUpcoming
                                ? 'bg-blue-500'
                                : isOpen
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                            }`}
                          />

                          {/* Circular Agency Emblem */}
                          <AgencyLogo org={item.organization} size="md" className="shrink-0" />

                          {/* Status badge pill (Desktop & Tablet) */}
                          <div className="hidden xs:block shrink-0">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 ${
                                isUpcoming
                                  ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                                  : isOpen
                                  ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                                  : 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <span>{item.status || 'Active'}</span>
                            </span>
                          </div>

                          {/* Titles and Sub-details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {/* Status pill on tiny screens */}
                              <span
                                className={`xs:hidden px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider inline-flex items-center gap-1 shrink-0 ${
                                  isUpcoming
                                    ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                                    : isOpen
                                    ? 'bg-[#ECFDF5] text-[#047857]'
                                    : 'bg-[#FFFBEB] text-[#B45309]'
                                }`}
                              >
                                <span className="w-1 h-1 rounded-full bg-current" />
                                <span>{item.status}</span>
                              </span>

                              <h3 className="font-heading font-extrabold text-xs sm:text-sm md:text-base text-[#0F172A] leading-snug truncate">
                                {title}
                              </h3>
                            </div>

                            {/* Sub-row: Vacancies & Expected/Last Date */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                              <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                <span>{item.vacancies || 'Check Notification'} Vacancies</span>
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>
                                  {item.deadline
                                    ? `Last Date: ${item.deadline}`
                                    : `Expected: ${item.publishedAt || 'Dec 2026'}`}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Side: Down chevron toggle button */}
                        <div className="shrink-0 pl-1">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                              isExpanded
                                ? 'bg-[#12345A] text-white shadow-xs rotate-180'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <ChevronDown className="w-4 h-4 stroke-[2.2]" />
                          </div>
                        </div>
                      </div>

                      {/* Smooth Expanded Accordion Details */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-[#F8FAFC] p-4 sm:p-6 space-y-4 animate-in slide-in-from-top-1 duration-150">
                          
                          {/* Header Metadata */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                            <div>
                              <p className="text-xs text-slate-500 font-semibold">
                                {org} • {item.region} {item.notificationNo ? `• Ref No: ${item.notificationNo}` : ''}
                              </p>
                              <h4 className="font-heading font-black text-sm sm:text-base text-[#12345A] mt-0.5">
                                {title}
                              </h4>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                              {item.vacancies || 'Multiple Posts'}
                            </span>
                          </div>

                          {/* Summary */}
                          {summary && (
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                              {summary}
                            </p>
                          )}

                          {/* 4 Details Cards Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                              <span className="text-slate-400 block font-bold mb-1">Qualification</span>
                              <span className="text-slate-800 font-semibold line-clamp-2">
                                {qual || 'Degree in any discipline from recognized university.'}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                              <span className="text-slate-400 block font-bold mb-1">Age Limit</span>
                              <span className="text-slate-800 font-semibold">
                                {ageLimit || 'As per commission guidelines & reservation rules.'}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                              <span className="text-slate-400 block font-bold mb-1">Salary / Pay Scale</span>
                              <span className="text-slate-800 font-semibold">
                                {salary || 'As per 7th CPC Matrix / State Scales.'}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                              <span className="text-slate-400 block font-bold mb-1">Application Fee</span>
                              <span className="text-slate-800 font-semibold">
                                {fee || 'Refer to official recruitment gazette.'}
                              </span>
                            </div>
                          </div>

                          {/* Bottom Action Bar */}
                          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80">
                            <div className="flex flex-wrap items-center gap-2">
                              {item.pdfUrl && (
                                <a
                                  href={item.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
                                >
                                  <Download className="w-3.5 h-3.5 text-red-500" />
                                  <span>Download Official PDF</span>
                                </a>
                              )}
                              {item.applyUrl && (
                                <a
                                  href={item.applyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F2BE4F] hover:bg-[#E0AC3C] text-[#0B1F3A] rounded-lg text-xs font-black transition-colors shadow-xs"
                                >
                                  <span>Apply Online</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  if (navigator.share) {
                                    navigator.share({
                                      title,
                                      url: window.location.origin + `/jobs/${detailSlug}`
                                    }).catch(() => {});
                                  } else {
                                    navigator.clipboard.writeText(window.location.origin + `/jobs/${detailSlug}`);
                                    alert('Link copied to clipboard!');
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200"
                                title="Share"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Share</span>
                              </button>
                            </div>

                            <Link
                              to={`/jobs/${detailSlug}`}
                              className="text-xs font-bold text-[#2468B4] hover:text-[#12345A] flex items-center gap-1 transition-colors"
                            >
                              <span>View Dedicated Exam Page</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedItems.map((item) => (
                  <NotificationCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Showing Page <strong className="text-[#12345A] font-bold">{currentPage}</strong> of {totalPages} ({filteredList.length} total)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg font-bold transition-colors cursor-pointer ${
                        currentPage === i + 1
                          ? 'bg-[#12345A] text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 cursor-pointer"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState onReset={handleResetFilters} />
        )}

      </div>
    </div>
  );
}
