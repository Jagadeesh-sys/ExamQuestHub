import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Briefcase,
  FileCheck2,
  Award,
  Globe2,
  BookOpen,
  FileText,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Instagram,
  CheckCircle2,
  ExternalLink,
  Layers,
  List,
  LayoutGrid,
  Columns3
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  getUpdates,
  getCurrentAffairs,
  subscribeToUpdates,
  subscribeToCurrentAffairs
} from '../firebase/firestoreService.js';
import NotificationCard from '../components/NotificationCard.jsx';
import StraightLineNotification from '../components/StraightLineNotification.jsx';
import StraightLineCurrentAffair from '../components/StraightLineCurrentAffair.jsx';
import CurrentAffairCard from '../components/CurrentAffairCard.jsx';
import LiveAlertsBar from '../components/LiveAlertsBar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import MockTestCard from '../components/MockTestCard.jsx';
import EditorialCurrentAffairsSection from '../components/EditorialCurrentAffairsSection.jsx';
import { MOCK_TESTS_METADATA } from '../data/mockTestsData.js';

export default function HomePage() {
  const { t, getLocalized } = useLanguage();
  const navigate = useNavigate();

  const [updates, setUpdates] = useState([]);
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('straightLine'); // 'straightLine' (default) | 'grid'
  const [expandedIds, setExpandedIds] = useState({});

  // Current Affairs Display Options: 'threeInRow' | 'singleAlign' | 'grid'
  const [caViewMode, setCaViewMode] = useState('threeInRow');
  const [expandedCaIds, setExpandedCaIds] = useState({});

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCaExpand = (id) => {
    setExpandedCaIds(prev => ({ ...prev, [id]: !prev[id] }));
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

  // Filter updates for latest notifications section
  const filteredUpdates = updates.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;
    const matchesSearch = !searchQuery.trim() || 
      getLocalized(item.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getLocalized(item.organization).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesRegion && matchesSearch;
  });

  const quickAccessCards = [
    {
      title: t('qcLatestJobsTitle'),
      desc: t('qcLatestJobsDesc'),
      icon: Briefcase,
      color: 'bg-blue-50 text-[#2468B4] border-blue-100',
      to: '/jobs'
    },
    {
      title: t('qcAdmitCardsTitle'),
      desc: t('qcAdmitCardsDesc'),
      icon: FileCheck2,
      color: 'bg-sky-50 text-[#12345A] border-sky-100',
      to: '/admit-cards'
    },
    {
      title: t('qcResultsTitle'),
      desc: t('qcResultsDesc'),
      icon: Award,
      color: 'bg-emerald-50 text-[#16845D] border-emerald-100',
      to: '/results'
    },
    {
      title: 'Mock Tests (CBT)',
      desc: 'Jan 2026, Dec, Nov & Oct 2025 Mocks',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      to: '/mocks'
    },
    {
      title: t('qcCurrentAffairsTitle'),
      desc: t('qcCurrentAffairsDesc'),
      icon: Globe2,
      color: 'bg-blue-50 text-[#2468B4] border-blue-100',
      to: '/current-affairs'
    },
    {
      title: t('qcPreviousPapersTitle'),
      desc: t('qcPreviousPapersDesc'),
      icon: BookOpen,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      to: '/previous-papers'
    },
    {
      title: t('qcSyllabusTitle'),
      desc: t('qcSyllabusDesc'),
      icon: FileText,
      color: 'bg-purple-50 text-purple-700 border-purple-100',
      to: '/study-material'
    }
  ];

  const examCategories = [
    { id: 'UPSC', label: t('catUPSC') },
    { id: 'SSC', label: t('catSSC') },
    { id: 'RRB and Railway', label: t('catRRB') },
    { id: 'Banking', label: t('catBanking') },
    { id: 'Defence', label: t('catDefence') },
    { id: 'State PSC', label: t('catStatePSC') },
    { id: 'State Government Jobs', label: t('catStateGovt') },
    { id: 'Teaching', label: t('catTeaching') },
    { id: 'Engineering Recruitment', label: t('catEngineering') },
    { id: 'GATE, ISRO, and other technical examinations', label: t('catGATE_ISRO') },
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Top Live Alerts Straight-Line Strip */}
      <LiveAlertsBar notifications={updates} />

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#0B1F3A] to-[#12345A] text-white pt-12 pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Subtle decorative geometry */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-[40px] border-white/20" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border-[30px] border-[#F2BE4F]/30" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 border border-white/10 rotate-45" />
        </div>

        <div className="relative max-w-[1200px] mx-auto text-center space-y-6">
          
          {/* Brand Logo Emblem */}
          <div className="flex justify-center -mb-2">
            <img
              src="/assets/aistudio/file_000000006a4881f4be54dc3e116f9bc0_65b76b0e.png"
              alt="ExamQuestHub Brand Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-contain bg-white/10 p-1.5 backdrop-blur-xs shadow-xl border border-white/20 animate-in zoom-in-95 duration-200 hover:scale-105 transition-transform"
            />
          </div>

          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F2BE4F] text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('tagline')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight max-w-4xl mx-auto leading-tight px-1">
            {t('heroHeadline')}
          </h1>

          {/* Supporting Text */}
          <p className="text-slate-200 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal px-2">
            {t('heroSubtext')}
          </p>

          {/* Quick Search in Hero */}
          <div className="max-w-2xl mx-auto pt-2 w-full">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-9 sm:pl-12 pr-20 sm:pr-28 py-2.5 sm:py-3.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-hidden focus:ring-4 focus:ring-[#2468B4]/40 shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-1.5 sm:right-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                Search
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2 w-full max-w-xs sm:max-w-none mx-auto">
            <Link
              to="/jobs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F2BE4F] hover:bg-[#E0AC3C] text-[#0B1F3A] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-95"
            >
              <span>{t('exploreJobs')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/gk-practice"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm rounded-xl transition-all backdrop-blur-xs active:scale-95"
            >
              <span>{t('practiceGK')}</span>
            </Link>
          </div>

          {/* Small Trust Messaging */}
          <div className="pt-3 flex items-center justify-center gap-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#F2BE4F]" />
            <span>{t('trustNote')}</span>
          </div>

        </div>
      </section>

      {/* 2. QUICK ACCESS CATEGORY CARDS */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {quickAccessCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                to={card.to}
                className="bg-white rounded-2xl p-4 border border-[#E3EAF2] hover:border-[#2468B4]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${card.color}`}>
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-[#182B45] group-hover:text-[#2468B4] transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                    {card.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. LATEST NOTIFICATIONS SECTION */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2468B4] uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Verified Alerts</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#182B45]">
              Latest Recruitment Notifications
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Central & State government examinations with verified publication dates and links.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12345A] hover:text-[#2468B4] py-1 transition-colors self-start md:self-auto"
          >
            <span>{t('viewAllUpdates')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Tabs & View Mode Bar */}
        <div className="bg-white p-3 rounded-2xl border border-[#E3EAF2] shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('allCategories')}
            </button>
            {['UPSC', 'SSC', 'State PSC', 'Banking', 'RRB and Railway'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#12345A] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right: Region Tabs & Straight Line View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Region Tabs */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Region:</span>
              {[
                { id: 'All', label: 'All' },
                { id: 'All India', label: 'All India' },
                { id: 'Andhra Pradesh', label: 'AP' },
                { id: 'Telangana', label: 'TS' }
              ].map((reg) => (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedRegion === reg.id
                      ? 'bg-[#EAF3FF] text-[#12345A] font-bold border border-[#2468B4]/20'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('straightLine')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'straightLine'
                    ? 'bg-white text-[#12345A] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Straight Line Expandable View"
              >
                <List className="w-3.5 h-3.5 text-[#2468B4]" />
                <span>Straight Line</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#12345A] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Cards Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#2468B4]" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>

        </div>

        {/* Straight-line helpful indicator & expand-all button */}
        {viewMode === 'straightLine' && filteredUpdates.length > 0 && !loading && (
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#2468B4] animate-pulse" />
              <span>Click any notification line to view full details up to full length</span>
            </span>
            <button
              type="button"
              onClick={() => {
                const areAllExp = filteredUpdates.slice(0, 8).every(u => expandedIds[u.id]);
                if (areAllExp) {
                  setExpandedIds({});
                } else {
                  const next = {};
                  filteredUpdates.slice(0, 8).forEach(u => { next[u.id] = true; });
                  setExpandedIds(next);
                }
              }}
              className="text-[#2468B4] hover:underline font-bold"
            >
              {filteredUpdates.slice(0, 8).every(u => expandedIds[u.id]) ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        )}

        {/* Notifications Listing */}
        {loading ? (
          <SkeletonLoader count={6} />
        ) : filteredUpdates.length > 0 ? (
          viewMode === 'straightLine' ? (
            <div className="space-y-2.5">
              {filteredUpdates.slice(0, 8).map((item) => (
                <StraightLineNotification
                  key={item.id}
                  item={item}
                  isExpanded={!!expandedIds[item.id]}
                  onToggle={() => toggleExpand(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredUpdates.slice(0, 6).map((item) => (
                <NotificationCard key={item.id} item={item} />
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl border border-[#E3EAF2] p-8 text-center text-slate-500">
            <p>No notifications match the chosen category or region filter.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedRegion('All'); setSearchQuery(''); }}
              className="mt-3 text-xs font-semibold text-[#2468B4] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      {/* 4. EXAM CATEGORIES DIRECTORY */}
      <section className="bg-white py-12 border-y border-[#E3EAF2]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2468B4] uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Explore Boards</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#182B45]">
              Recruitment Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse notifications structured by competitive exam boards and commission departments.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {examCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/jobs?category=${encodeURIComponent(cat.id)}`}
                className="p-3.5 rounded-xl border border-[#E3EAF2] bg-[#F6F8FC] hover:bg-white hover:border-[#2468B4] hover:shadow-xs transition-all text-center group"
              >
                <span className="font-heading font-bold text-xs sm:text-sm text-[#182B45] group-hover:text-[#2468B4] transition-colors block">
                  {cat.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  View notifications
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5 CURRENT AFFAIRS MOCK TESTS (PDF-GROUNDED CBT & PRACTICE) */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2468B4] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#F2BE4F]" />
              <span>Grounded in Official Monthly Compendiums</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#182B45]">
              Current Affairs Mock Tests & Practice Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Full-length CBT mock tests for UPSC, SSC, Banking, Railways & State PSCs with verified explanations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/mocks"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span>Explore All {MOCK_TESTS_METADATA.length} Mocks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Mock cards row matching image_324852b7.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TESTS_METADATA.slice(0, 3).map((mock) => (
            <MockTestCard key={mock.id} mock={mock} />
          ))}
        </div>
      </section>

      {/* 5. CURRENT AFFAIRS PREVIEW (Matching image_1b19ce6e.png) */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <EditorialCurrentAffairsSection
          articles={currentAffairs}
          loading={loading}
          showViewToggle={true}
          initialViewMode="editorial"
        />
      </section>

      {/* 6. STUDY RESOURCES & PYQ PREVIEW */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="bg-[#EAF3FF]/60 rounded-3xl p-6 sm:p-8 border border-[#2468B4]/20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-[#2468B4] uppercase tracking-wider block mb-1">
                Authentic Study Archives
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#182B45]">
                Previous-Year Papers & Syllabi
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Download verified official board papers, exam schemes, and answer keys.
              </p>
            </div>
            <Link
              to="/previous-papers"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12345A] hover:text-[#2468B4]"
            >
              <span>Explore all papers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-[#E3EAF2] hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-[#12345A] font-semibold text-[10px]">
                  UPSC CSE 2024
                </span>
                <span>2.4 MB PDF</span>
              </div>
              <h4 className="font-heading font-bold text-sm text-[#182B45]">
                UPSC Civil Services Prelims 2024 Paper-I GS
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Official bilingual question paper with UPSC key references.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100">
                <Link
                  to="/previous-papers"
                  className="text-xs font-semibold text-[#2468B4] hover:underline"
                >
                  Download Paper PDF →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#E3EAF2] hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold text-[10px]">
                  APPSC Group 2
                </span>
                <span>1.2 MB PDF</span>
              </div>
              <h4 className="font-heading font-bold text-sm text-[#182B45]">
                APPSC Group-II Revised Scheme & Syllabus
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Comprehensive stage-wise topics for Prelims and Mains.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100">
                <Link
                  to="/study-material"
                  className="text-xs font-semibold text-[#2468B4] hover:underline"
                >
                  View Full Syllabus →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#E3EAF2] hover:shadow-xs transition-shadow">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold text-[10px]">
                  TGPSC Group 1
                </span>
                <span>1.5 MB PDF</span>
              </div>
              <h4 className="font-heading font-bold text-sm text-[#182B45]">
                TGPSC Group-I Mains Detailed Syllabus
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Paper-wise syllabus breakdown including Telangana Movement.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100">
                <Link
                  to="/study-material"
                  className="text-xs font-semibold text-[#2468B4] hover:underline"
                >
                  View Full Syllabus →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COMPACT INSTAGRAM & ASPIRANT CALL TO ACTION */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#12345A] to-[#0B1F3A] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F2BE4F] text-xs font-semibold">
              <Instagram className="w-3.5 h-3.5" />
              <span>Join 50,000+ Aspirants</span>
            </div>
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
              Stay ahead with Instant Exam Alerts & Daily GK on Instagram
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Get notified the moment hall tickets, answer keys, and application deadlines are announced. No spam, only verified updates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full md:w-auto">
            <a
              href="https://instagram.com/examquesthub"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-[#F2BE4F] hover:bg-[#E0AC3C] text-[#0B1F3A] font-bold text-xs transition-all shadow-sm"
            >
              Follow @examquesthub
            </a>
            <Link
              to="/gk-practice"
              className="w-full sm:w-auto text-center px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              Practice Today's GK
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
