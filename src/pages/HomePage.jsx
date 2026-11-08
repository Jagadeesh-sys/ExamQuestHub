import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Mic,
  Briefcase,
  FileCheck2,
  Award,
  TrendingUp,
  FileText,
  BookOpen,
  Target,
  BookMarked,
  Newspaper,
  Layers,
  LayoutGrid,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Trophy,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { subscribeToUpdates, subscribeToCurrentAffairs } from '../firebase/firestoreService.js';
import AgencyLogo from '../components/AgencyLogo.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import { MOCK_TESTS_METADATA } from '../data/mockTestsMetadata.js';

export default function HomePage() {
  const { t, getLocalized } = useLanguage();
  const navigate = useNavigate();

  const [updates, setUpdates] = useState([]);
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isListening, setIsListening] = useState(false);

  const caScrollRef = useRef(null);

  const scrollCaMocks = (direction) => {
    if (caScrollRef.current) {
      const scrollAmount = direction === 'left' ? -310 : 310;
      caScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setLoading(true);
    const unsubUpdates = subscribeToUpdates((data) => {
      setUpdates(data);
      setLoading(false);
    }, false);

    const unsubCA = subscribeToCurrentAffairs((data) => {
      setCurrentAffairs(data.slice(0, 4));
    });

    return () => {
      unsubUpdates();
      unsubCA();
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Voice search affordance
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
          setSearchQuery(transcript);
          navigate(`/jobs?search=${encodeURIComponent(transcript)}`);
        };
        recognition.start();
      } catch (err) {
        console.warn('Speech recognition error:', err);
      }
    } else {
      const q = prompt('What exam or job are you looking for?');
      if (q) {
        navigate(`/jobs?search=${encodeURIComponent(q)}`);
      }
    }
  };

  // 10 Quick Access Tiles matching the exact reference image
  const quickAccessTiles = [
    {
      id: 'jobs',
      label: 'Latest Jobs',
      icon: Briefcase,
      to: '/jobs',
      bgClass: 'bg-[#EFF6FF] border-[#DBEAFE]',
      iconClass: 'text-[#2563EB]'
    },
    {
      id: 'admit-cards',
      label: 'Admit Cards',
      icon: FileCheck2,
      to: '/admit-cards',
      bgClass: 'bg-[#F5F3FF] border-[#EDE9FE]',
      iconClass: 'text-[#7C3AED]'
    },
    {
      id: 'results',
      label: 'Results',
      icon: TrendingUp,
      to: '/results',
      bgClass: 'bg-[#ECFDF5] border-[#D1FAE5]',
      iconClass: 'text-[#059669]'
    },
    {
      id: 'pyqs',
      label: 'PYQs & Papers',
      icon: FileText,
      to: '/previous-papers',
      bgClass: 'bg-[#FFF1F2] border-[#FFE4E6]',
      iconClass: 'text-[#E11D48]'
    },
    {
      id: 'syllabus',
      label: 'Syllabus',
      icon: BookOpen,
      to: '/study-material',
      bgClass: 'bg-[#EEF2FF] border-[#E0E7FF]',
      iconClass: 'text-[#6366F1]'
    },
    {
      id: 'mocks',
      label: 'Mock Tests',
      icon: Target,
      to: '/mocks',
      bgClass: 'bg-[#FFF7ED] border-[#FFEDD5]',
      iconClass: 'text-[#EA580C]'
    },
    {
      id: 'daily-gk',
      label: 'Daily GK',
      icon: BookMarked,
      to: '/gk-practice',
      bgClass: 'bg-[#F0F9FF] border-[#E0F2FE]',
      iconClass: 'text-[#0284C7]'
    },
    {
      id: 'current-affairs',
      label: 'Current Affairs',
      icon: Newspaper,
      to: '/current-affairs',
      bgClass: 'bg-[#EEF2FF] border-[#E0E7FF]',
      iconClass: 'text-[#4F46E5]'
    },
    {
      id: 'boards',
      label: 'Exam Boards',
      icon: Layers,
      to: '/jobs',
      bgClass: 'bg-[#F0FDFA] border-[#CCFBF1]',
      iconClass: 'text-[#0D9488]'
    },
    {
      id: 'more',
      label: 'More',
      icon: LayoutGrid,
      to: '/study-material',
      bgClass: 'bg-[#F1F5F9] border-[#E2E8F0]',
      iconClass: 'text-[#1E293B]'
    }
  ];

  // Primary 3 Verified Notifications matching the reference screenshot exactly
  const primaryFeaturedNotifications = [
    {
      id: 'rrb-ntpc-2026',
      organization: 'Railway Recruitment Board (RRB)',
      title: 'RRB NTPC 2026 – 32,438 Vacancies',
      scope: 'All India',
      status: 'Applications Open',
      statusType: 'success',
      lastDate: '30 Nov 2026',
      slug: 'rrb-ntpc-2026-cbt1',
      link: '/jobs/rrb-ntpc-2026-cbt1',
      isHot: true
    },
    {
      id: 'crpf-sports-quota-2026',
      organization: 'CRPF – Sports Quota Recruitment',
      title: '521 Vacancies for Constable (General Duty)',
      scope: 'All India',
      status: 'Applications Open',
      statusType: 'success',
      lastDate: '15 Dec 2026',
      slug: 'crpf-sports-quota-2026',
      link: '/jobs/crpf-sports-quota-2026'
    },
    {
      id: 'nia-recruitment-2026',
      organization: 'NIA Recruitment 2026',
      title: '111 Posts – Inspector, SI, and ASI',
      scope: 'All India',
      status: 'Notification Released',
      statusType: 'info',
      lastDate: '02 Dec 2026',
      slug: 'nia-recruitment-2026',
      link: '/jobs/nia-recruitment-2026'
    }
  ];

  // Dynamic notifications from feed (merged without duplicating featured)
  const additionalNotifications = updates.filter(
    (u) => !primaryFeaturedNotifications.some((p) => p.id === u.id || p.slug === u.slug)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1F224D] via-[#2D457B] via-15% via-[#BFD7F8]/40 to-[#F4F7FC] pb-20">
      
      {/* Container matching max-w of application */}
      <div className="max-w-[1240px] mx-auto px-3.5 sm:px-6 pt-3 sm:pt-4 space-y-4 sm:space-y-6">

        {/* 1. HERO BANNER - Clean Background with Live HTML/CSS Overlay */}
        <section
          aria-label="Welcome Hero"
          className="relative w-full min-h-[145px] sm:min-h-[180px] md:min-h-[220px] aspect-[2.5/1] sm:aspect-[2.8/1] md:aspect-[3/1] rounded-2xl sm:rounded-[20px] overflow-hidden shadow-xl shadow-[#081F44]/25 border border-white/10 select-none bg-[#07183B]"
        >
          {/* Background Image: Clean Parliament dome, Ashoka emblem & Indian flag */}
          <img
            src="/assets/aistudio/file_0000000010cc8207b72f593050b0fa7c_1f1ac3d0.png"
            alt="Your Next Government Exams Starts Here"
            className="absolute inset-0 w-full h-full object-cover object-right sm:object-center block"
            loading="eager"
          />

          {/* Real Live Text & Button Overlay */}
          <div className="relative z-20 flex flex-col justify-center h-full px-4 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-5 max-w-[62%] sm:max-w-[58%] md:max-w-[55%]">
            {/* 1. Eyebrow: Decreased font size for refined look */}
            <div className="inline-flex items-center gap-1 sm:gap-1.5 text-[#F2BE4F] text-[8px] sm:text-[10px] md:text-xs font-bold tracking-wide uppercase mb-1 sm:mb-1.5">
              <Award className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#F2BE4F] shrink-0" />
              <span>All Govt Exams — One Platform</span>
            </div>

            {/* 2. Main Headline */}
            <h1 className="font-heading font-black text-white text-[16px] sm:text-2xl md:text-3xl lg:text-[36px] leading-[1.15] tracking-tight">
              <span>Your Next</span> <br />
              <span className="text-[#F2BE4F]">Government Exams</span> <br />
              <span>Starts Here.</span>
            </h1>

            {/* 3. Functional Explore Button */}
            <div className="pt-2 sm:pt-3 md:pt-4">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full bg-[#F2BE4F] hover:bg-[#E0AC3C] text-[#0B1F3A] font-black text-[10px] sm:text-xs md:text-sm shadow-md transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#F2BE4F]/50"
              >
                <span>Explore Now</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </section>

        {/* 2. FLOATING SEARCH BAR - Compact proportions matching mobile reference design */}
        <div className="relative w-full">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, exams, notifications, current affairs..."
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-[13px] bg-white border border-[#E3EAF2] rounded-full text-slate-800 placeholder-slate-400 shadow-xs hover:border-[#2468B4] focus:outline-hidden focus:border-[#2468B4] focus:ring-4 focus:ring-[#2468B4]/10 transition-all"
            />
            <button
              type="button"
              onClick={handleVoiceSearch}
              title="Voice Search"
              className={`absolute right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-[#12345A] hover:bg-slate-100'
              }`}
              aria-label="Voice search"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* 3. 10 QUICK ACCESS ACTION TILES (2 rows x 5 columns) */}
        <section aria-label="Quick Access Categories">
          <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-3">
            {quickAccessTiles.map((tile) => {
              const Icon = tile.icon;
              return (
                <Link
                  key={tile.id}
                  to={tile.to}
                  className="flex flex-col items-center text-center group transition-transform active:scale-95"
                >
                  {/* Rounded Squircle Tile */}
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${tile.bgClass} border flex items-center justify-center shadow-xs group-hover:shadow-md group-hover:-translate-y-0.5 transition-all`}
                  >
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${tile.iconClass} stroke-[1.8]`} />
                  </div>
                  {/* Label */}
                  <span className="text-[11px] sm:text-xs font-bold text-slate-700 group-hover:text-[#12345A] mt-1.5 leading-tight tracking-tight line-clamp-1">
                    {tile.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. LIVE ALERT TICKER BAR - Exact replica of the reference design */}
        <section aria-label="Live Alert">
          <Link
            to="/jobs/rrb-ntpc-2026-cbt1"
            className="flex items-center justify-between gap-2.5 p-2 sm:p-2.5 rounded-full bg-[#EAF3FF] border border-[#BFDBFE]/60 hover:bg-[#E1EDFE] transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#12345A] text-[#F2BE4F] text-[10px] sm:text-[11px] font-black uppercase tracking-wider shrink-0 shadow-xs">
                <Bell className="w-3 h-3 fill-[#F2BE4F]" />
                <span>LIVE ALERT</span>
              </div>
              <span className="text-slate-300 font-bold shrink-0">|</span>
              {/* Alert Content */}
              <span className="text-xs sm:text-sm font-bold text-[#12345A] truncate">
                Railway Recruitment 2026 – 32,438 Vacancies Notified...
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#12345A] group-hover:translate-x-0.5 transition-transform shrink-0 mr-1" />
          </Link>
        </section>

        {/* 5. LATEST RECRUITMENT NOTIFICATIONS - Exact cards as in reference screenshot */}
        <section aria-label="Latest Recruitment Notifications" className="space-y-3">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#12345A] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-black text-base sm:text-lg text-[#12345A] tracking-tight">
                Latest Recruitment Notifications
              </h2>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#12345A] hover:text-[#2468B4] transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Cards List */}
          <div className="space-y-2.5">
            {primaryFeaturedNotifications.map((job) => (
              <Link
                key={job.id}
                to={job.link}
                className="bg-white rounded-2xl border border-[#E3EAF2] p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:border-[#2468B4] hover:shadow-md transition-all active:scale-[0.99] group cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Agency Circular Emblem */}
                  <AgencyLogo org={job.organization} size="lg" />

                  {/* Title & Metadata */}
                  <div className="min-w-0 space-y-1">
                    <h3 className="font-heading font-black text-xs sm:text-sm text-[#12345A] group-hover:text-[#2468B4] transition-colors truncate">
                      {job.organization}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-bold text-slate-700 truncate">
                      {job.title}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1E40AF] text-[10px] font-bold">
                        {job.scope}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          job.statusType === 'success'
                            ? 'bg-[#ECFDF5] text-[#065F46]'
                            : 'bg-[#EFF6FF] text-[#1E40AF]'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Last Date in Red & Chevron */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 text-right">
                    <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                    <div className="flex flex-col text-right">
                      <span className="text-[9.5px] sm:text-[10px] font-bold text-rose-600 leading-tight uppercase">
                        Last Date
                      </span>
                      <span className="text-xs sm:text-sm font-black text-rose-600 leading-tight whitespace-nowrap">
                        {job.lastDate}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#12345A] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}

            {/* Additional Dynamic Notifications from Firestore if loaded */}
            {additionalNotifications.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                to={`/jobs/${item.slug || item.id}`}
                className="bg-white rounded-2xl border border-[#E3EAF2] p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:border-[#2468B4] hover:shadow-md transition-all active:scale-[0.99] group cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <AgencyLogo org={item.organization} size="lg" />
                  <div className="min-w-0 space-y-1">
                    <h3 className="font-heading font-black text-xs sm:text-sm text-[#12345A] group-hover:text-[#2468B4] transition-colors truncate">
                      {getLocalized(item.organization) || item.organization}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-bold text-slate-700 truncate">
                      {getLocalized(item.title) || item.title}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1E40AF] text-[10px] font-bold">
                        {item.region || 'All India'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#065F46] text-[10px] font-bold">
                        {item.status || 'Verified'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 text-right">
                    <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                    <div className="flex flex-col text-right">
                      <span className="text-[9.5px] sm:text-[10px] font-bold text-rose-600 leading-tight uppercase">
                        Last Date
                      </span>
                      <span className="text-xs sm:text-sm font-black text-rose-600 leading-tight whitespace-nowrap">
                        {item.lastDate || 'Check PDF'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#12345A] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. SECONDARY BANNER: "Current Affairs & Practice" with Live HTML/CSS Overlay */}
        <section
          aria-label="Current Affairs and Practice"
          className="relative w-full rounded-2xl sm:rounded-[20px] overflow-hidden shadow-xl shadow-[#1E1B4B]/20 border border-white/10 select-none aspect-[2172/724] bg-[#160D35]"
        >
          {/* Background Image: Clean 3D Globe, books & laptop on purple desk */}
          <img
            src="/assets/aistudio/file_00000000c4d882118daba62104aebfa5_00c0281b.png"
            alt="Current Affairs & Practice — Daily updates, quizzes & full mock tests"
            className="w-full h-full object-cover block"
            loading="lazy"
          />

          {/* Real Live Text & Button Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-2 sm:py-6 max-w-[64%] sm:max-w-[58%] md:max-w-[55%]">
            {/* Heading */}
            <h2 className="font-heading font-black text-white text-[15px] sm:text-2xl md:text-3xl lg:text-[34px] leading-tight tracking-tight">
              <span className="text-[#F2BE4F]">Current Affairs</span>{' '}
              <span>&amp; Practice</span>
            </h2>

            {/* Subtitle */}
            <p className="text-slate-200 text-[8.5px] sm:text-xs md:text-sm font-semibold tracking-wide mt-0.5 sm:mt-1.5 line-clamp-1">
              Daily updates, quizzes &amp; full mock tests
            </p>

            {/* Working Practice Now Button */}
            <div className="pt-1.5 sm:pt-3 md:pt-4">
              <Link
                to="/current-affairs"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-1 sm:py-2.5 rounded-full bg-[#F2BE4F] hover:bg-[#E0AC3C] text-[#0B1F3A] font-black text-[9.5px] sm:text-xs md:text-sm shadow-md transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#F2BE4F]/50"
              >
                <span>Practice Now</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </section>

        {/* 7. CURRENT AFFAIRS MOCK TESTS - Compact Horizontal Scrolling Track (Half Height) */}
        <section aria-label="Current Affairs Mock Tests" className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E40AF]">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-sm sm:text-base text-[#12345A] tracking-tight">
                  Current Affairs Mock Tests
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                  Verified monthly MCQ practice sets with detailed solutions & CBT mode
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Scroll controls */}
              <button
                type="button"
                onClick={() => scrollCaMocks('left')}
                className="w-7 h-7 rounded-full bg-white border border-[#E3EAF2] flex items-center justify-center text-slate-600 hover:text-[#12345A] hover:border-[#2468B4] shadow-2xs transition-colors cursor-pointer active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCaMocks('right')}
                className="w-7 h-7 rounded-full bg-white border border-[#E3EAF2] flex items-center justify-center text-slate-600 hover:text-[#12345A] hover:border-[#2468B4] shadow-2xs transition-colors cursor-pointer active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <Link
                to="/mocks"
                className="text-xs font-bold text-[#2468B4] hover:text-[#12345A] flex items-center gap-1 group py-1 ml-1"
              >
                <span className="hidden sm:inline">View All</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Horizontal Scrolling Track (Half-Height Cards ~142px) */}
          <div
            ref={caScrollRef}
            className="flex gap-3 overflow-x-auto pb-2 pt-1 px-0.5 scrollbar-none snap-x snap-mandatory scroll-smooth"
          >
            {MOCK_TESTS_METADATA.map((mock) => (
              <div
                key={mock.id}
                className={`w-[270px] sm:w-[300px] shrink-0 snap-start h-[142px] sm:h-[148px] rounded-2xl border ${
                  mock.cardBorder || 'border-[#E3EAF2]'
                } ${mock.cardBg || 'bg-white'} p-3.5 flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 relative group`}
              >
                {/* Top row: Month pill + Questions count */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-white text-slate-800 border border-black/5 shadow-2xs">
                    {mock.month}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-700 bg-white/80 border border-black/5">
                    {mock.questionsCount} MCQs • {mock.timeMinutes}m
                  </span>
                </div>

                {/* Middle: Title & Subtitle */}
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">
                    {mock.code}
                  </div>
                  <h3 className="font-heading font-black text-xs sm:text-[13.5px] text-slate-900 truncate tracking-tight">
                    {mock.title}
                  </h3>
                  <p className="text-[10.5px] text-slate-600 truncate font-medium">
                    {mock.subtitle}
                  </p>
                </div>

                {/* Bottom row: Marks & CTAs */}
                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-black/5">
                  <span className="text-xs font-black text-slate-800">
                    {mock.marks} Marks
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/mocks/${mock.id}?mode=practice`}
                      className="px-2.5 py-1 rounded-full text-[10.5px] font-bold text-[#1E5692] bg-white border border-[#2468B4]/40 hover:bg-[#EAF3FF] transition-colors shadow-2xs active:scale-95"
                    >
                      Practice
                    </Link>
                    <Link
                      to={`/mocks/${mock.id}?mode=cbt`}
                      className="px-3 py-1 rounded-full text-[10.5px] font-bold text-white bg-[#111827] hover:bg-black transition-colors shadow-2xs active:scale-95 flex items-center gap-1"
                    >
                      <span>Start</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
