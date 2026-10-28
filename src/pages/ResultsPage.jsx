import React, { useState, useEffect } from 'react';
import {
  Award,
  Search,
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getUpdates } from '../firebase/firestoreService.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function ResultsPage() {
  const { t, getLocalized } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    async function loadResults() {
      try {
        const data = await getUpdates(false);
        const resultList = data.filter(
          (d) => d.type === 'result' || (d.status && d.status.toLowerCase().includes('result'))
        );
        setItems(resultList.length > 0 ? resultList : data.slice(0, 4));
      } catch (e) {
        console.error('Failed to load results', e);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  const filtered = items.filter((item) => {
    const title = getLocalized(item.title).toLowerCase();
    const org = getLocalized(item.organization).toLowerCase();
    const matchSearch = !searchQuery.trim() || title.includes(searchQuery.toLowerCase()) || org.includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: t('navResults') }]} />

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#E3EAF2]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16845D] uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Official Merit Lists & Answer Keys</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#182B45]">
              {t('navResults')} & Answer Keys
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Verified provisional keys, cut-off marks, and final merit notifications released by UPSC, SSC, APPSC, TGPSC, and Banking boards.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-[#F6F8FC] px-3.5 py-2 rounded-xl border border-[#E3EAF2]">
            Showing <strong className="text-[#12345A]">{filtered.length}</strong> announcements
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exam name or board..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4]"
            />
          </div>

          <div className="w-full sm:w-60">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4] text-slate-700"
            >
              <option value="All">All Categories</option>
              <option value="UPSC">UPSC</option>
              <option value="SSC">SSC</option>
              <option value="State PSC">State PSC (AP/TS)</option>
              <option value="Banking">Banking</option>
              <option value="RRB and Railway">Railways</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listing Cards */}
      {loading ? (
        <SkeletonLoader count={4} />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => {
            const title = getLocalized(item.title);
            const org = getLocalized(item.organization);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E3EAF2] hover:border-[#2468B4]/40 hover:shadow-xs transition-all p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#2468B4] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Building2 className="w-3.5 h-3.5" />
                      {org}
                    </span>
                    <StatusBadge status="Result Released" />
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#182B45] leading-snug">
                    {title}
                  </h3>

                  <div className="p-3 rounded-xl bg-[#F6F8FC] text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Announced Date:</span>
                      <span className="font-bold text-[#182B45]">{item.publishedAt}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Verification Status:</span>
                      <span className="font-semibold text-emerald-700">Official Gazetted</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.region}
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {item.pdfUrl && (
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl text-slate-600 hover:text-[#12345A] hover:bg-slate-100 border border-slate-200"
                        title="Download Merit PDF"
                      >
                        <FileText className="w-4 h-4 text-red-500" />
                      </a>
                    )}
                    <a
                      href={item.applyUrl || item.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs active:scale-95"
                    >
                      <span>Check Result & Cut-off</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No results found"
          description="Try adjusting your search criteria."
          onReset={() => { setSearchQuery(''); setCategoryFilter('All'); }}
        />
      )}

      {/* Statutory Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          ExamQuestHub does not host private scorecards or require login credentials. All score checks and individual candidate ranks must be verified on the official commission websites via the links provided above.
        </p>
      </div>

    </div>
  );
}
