import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Search,
  Building2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getUpdates } from '../firebase/firestoreService.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function AdmitCardsPage() {
  const { t, getLocalized } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [orgFilter, setOrgFilter] = useState('All');

  useEffect(() => {
    async function loadAdmitCards() {
      try {
        const data = await getUpdates(false);
        // Filter those marked as admit card or having admit card status or upcoming exam date
        const admitList = data.filter(
          (d) => d.type === 'admit-card' || (d.status && d.status.toLowerCase().includes('admit')) || d.examDate
        );
        setItems(admitList);
      } catch (e) {
        console.error('Failed to load admit cards', e);
      } finally {
        setLoading(false);
      }
    }
    loadAdmitCards();
  }, []);

  const organizations = ['All', ...new Set(items.map((i) => i.category || 'Other'))];

  const filtered = items.filter((item) => {
    const title = getLocalized(item.title).toLowerCase();
    const org = getLocalized(item.organization).toLowerCase();
    const matchSearch = !searchQuery.trim() || title.includes(searchQuery.toLowerCase()) || org.includes(searchQuery.toLowerCase());
    const matchOrg = orgFilter === 'All' || item.category === orgFilter;
    return matchSearch && matchOrg;
  });

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: t('navAdmitCards') }]} />

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#E3EAF2]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12345A] uppercase tracking-wider mb-1">
              <FileCheck2 className="w-4 h-4 text-[#2468B4]" />
              <span>Hall Tickets & City Slips</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#182B45]">
              {t('navAdmitCards')} & Schedules
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Official board-verified hall ticket release dates, city intimation slips, and direct portal download links.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-[#F6F8FC] px-3.5 py-2 rounded-xl border border-[#E3EAF2]">
            Showing <strong className="text-[#12345A]">{filtered.length}</strong> verified schedules
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exam name or recruiting board..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4]"
            />
          </div>

          <div className="w-full sm:w-60">
            <select
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4] text-slate-700"
            >
              {organizations.map((org) => (
                <option key={org} value={org}>
                  {org === 'All' ? 'All Boards & Categories' : org}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Listing Grid */}
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
                    <StatusBadge status={item.status || 'Admit Card Released'} />
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#182B45] leading-snug">
                    {title}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#F6F8FC] text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Exam Date
                      </span>
                      <span className="font-bold text-[#12345A]">
                        {item.examDate || 'Check Schedule Notice'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Admit Card Status
                      </span>
                      <span className="font-semibold text-emerald-700">
                        Available on Official Portal
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Verified: {item.publishedAt}
                  </span>

                  <a
                    href={item.applyUrl || item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs active:scale-95"
                  >
                    <span>Download Hall Ticket</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No admit cards found"
          description="Try clearing your search query or selecting All Boards."
          onReset={() => { setSearchQuery(''); setOrgFilter('All'); }}
        />
      )}

      {/* Advisory Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          ExamQuestHub links directly to the official examination boards for candidate authentication. Please ensure you have your Registration ID and Date of Birth ready before proceeding to the board server.
        </p>
      </div>

    </div>
  );
}
