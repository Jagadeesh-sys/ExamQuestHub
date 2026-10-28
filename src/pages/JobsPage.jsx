import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  RefreshCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  List,
  LayoutGrid
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getUpdates } from '../firebase/firestoreService.js';
import NotificationCard from '../components/NotificationCard.jsx';
import StraightLineNotification from '../components/StraightLineNotification.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

const ITEMS_PER_PAGE = 9;

export default function JobsPage() {
  const { t, getLocalized } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters from URL or state
  const searchFilter = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'All';
  const regionFilter = searchParams.get('region') || 'All';
  const statusFilter = searchParams.get('status') || 'All';
  const sortBy = searchParams.get('sort') || 'newest';

  const [viewMode, setViewMode] = useState('straightLine'); // 'straightLine' (default) | 'grid'
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getUpdates(false);
        setUpdates(data);
      } catch (e) {
        console.error('Failed to load jobs directory', e);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
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

  const categories = [
    'All',
    'UPSC',
    'SSC',
    'State PSC',
    'Banking',
    'RRB and Railway',
    'Defence',
    'Teaching',
    'Engineering Recruitment',
    'GATE, ISRO, and other technical examinations'
  ];

  const regions = ['All', 'All India', 'Andhra Pradesh', 'Telangana'];
  const statuses = ['All', 'Applications Open', 'Closing Soon', 'Admit Card Released', 'Result Released', 'Closed'];

  // Filter and sort
  const filteredList = useMemo(() => {
    return updates.filter((item) => {
      const title = getLocalized(item.title).toLowerCase();
      const org = getLocalized(item.organization).toLowerCase();
      const s = searchFilter.toLowerCase();

      const matchSearch = !s || title.includes(s) || org.includes(s);
      const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
      const matchReg = regionFilter === 'All' || item.region === regionFilter;
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchSearch && matchCat && matchReg && matchStatus;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      }
      return (b.publishedAt || '').localeCompare(a.publishedAt || '');
    });
  }, [updates, searchFilter, categoryFilter, regionFilter, statusFilter, sortBy, getLocalized]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: t('navJobs') }]} />

      {/* Page Header */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#E3EAF2]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2468B4] uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" />
              <span>Verified Government Job Alerts</span>
            </div>
            <h1 className="font-heading font-extrabold text-xl sm:text-3xl text-[#182B45]">
              {t('navJobs')} Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Authentic recruitment notifications verified against official commission gazettes. Filter by exam board, region, and application status.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-[#F6F8FC] px-3.5 py-2 rounded-xl border border-[#E3EAF2] self-start md:self-auto">
            <span className="font-bold text-[#12345A]">{filteredList.length}</span>
            <span>Notifications found</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => updateParam('search', e.target.value)}
              placeholder="Search by job title or board..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4]"
            />
          </div>

          {/* Category selector */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => updateParam('category', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4] text-slate-700"
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Region selector */}
          <div>
            <select
              value={regionFilter}
              onChange={(e) => updateParam('region', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4] text-slate-700"
            >
              <option value="All">All Regions</option>
              {regions.filter(r => r !== 'All').map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => updateParam('status', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4] text-slate-700"
            >
              <option value="All">All Statuses</option>
              {statuses.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Sort & View Mode Switcher */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Sort:</span>
              <button
                type="button"
                onClick={() => updateParam('sort', 'newest')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  sortBy === 'newest'
                    ? 'bg-[#12345A] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t('newestFirst')}
              </button>
              <button
                type="button"
                onClick={() => updateParam('sort', 'deadline')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  sortBy === 'deadline'
                    ? 'bg-[#12345A] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t('deadlineFirst')}
              </button>
            </div>

            {(searchFilter || categoryFilter !== 'All' || regionFilter !== 'All' || statusFilter !== 'All') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors font-medium"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>{t('resetFilters')}</span>
              </button>
            )}
          </div>

          {/* View Mode Switcher */}
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

      {/* Helpful Hint & Expand All for Straight Line mode */}
      {viewMode === 'straightLine' && paginatedItems.length > 0 && !loading && (
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#2468B4] animate-pulse" />
            <span>Click any straight line row to reveal full details up to full length</span>
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
            className="text-[#2468B4] hover:underline font-bold"
          >
            {paginatedItems.every(u => expandedIds[u.id]) ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      )}

      {/* Listing Content */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : paginatedItems.length > 0 ? (
        <div className="space-y-6">
          {viewMode === 'straightLine' ? (
            <div className="space-y-2.5">
              {paginatedItems.map((item) => (
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
              {paginatedItems.map((item) => (
                <NotificationCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white rounded-2xl p-4 border border-[#E3EAF2] flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg font-semibold transition-colors ${
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
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50"
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
  );
}
