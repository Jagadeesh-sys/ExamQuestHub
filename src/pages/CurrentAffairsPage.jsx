import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  Search,
  Calendar,
  ExternalLink,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getCurrentAffairs } from '../firebase/firestoreService.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function CurrentAffairsPage() {
  const { t, getLocalized } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadAffairs() {
      try {
        const data = await getCurrentAffairs();
        setArticles(data);
      } catch (e) {
        console.error('Failed to load current affairs', e);
      } finally {
        setLoading(false);
      }
    }
    loadAffairs();
  }, []);

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

  const filtered = articles.filter((item) => {
    const headline = getLocalized(item.headline).toLowerCase();
    const summary = getLocalized(item.summary).toLowerCase();
    const s = searchQuery.toLowerCase();

    const matchSearch = !s || headline.includes(s) || summary.includes(s);
    const matchTopic = selectedTopic === 'All' || item.topic === selectedTopic;
    return matchSearch && matchTopic;
  });

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: t('navCurrentAffairs') }]} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#12345A] to-[#0B1F3A] rounded-3xl p-4 sm:p-8 text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F2BE4F] text-xs font-semibold backdrop-blur-xs">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Exam-Targeted Editorial Desk</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              {t('dailyCurrentAffairs')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Curated daily current affairs for UPSC, APPSC, TGPSC, SSC, and Banking exams. Verified with PIB, RBI, and Gazette records.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/gk-practice"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F2BE4F] hover:bg-[#E0AC3C] text-[#0B1F3A] font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <span>{t('practiceTodayGK')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Topic Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-[#E3EAF2] space-y-3">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search current affairs by keyword, organization, or topic..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4]"
          />
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {topics.map((tName) => (
            <button
              key={tName}
              type="button"
              onClick={() => setSelectedTopic(tName)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTopic === tName
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tName}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <SkeletonLoader count={4} />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => {
            const headline = getLocalized(item.headline);
            const summary = getLocalized(item.summary);
            const detailSlug = item.slug || item.id;

            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-[#E3EAF2] hover:border-[#2468B4]/40 hover:shadow-sm transition-all p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-100">
                      {item.topic}
                    </span>
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.eventDate}
                    </span>
                  </div>

                  <Link
                    to={`/current-affairs/${detailSlug}`}
                    className="font-heading font-bold text-base sm:text-lg text-[#182B45] hover:text-[#2468B4] transition-colors leading-snug block"
                  >
                    {headline}
                  </Link>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {summary}
                  </p>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  {item.sourceUrl ? (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-[#2468B4] flex items-center gap-1 text-[11px]"
                      title={item.sourceName || 'Primary Source'}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate max-w-[180px]">{item.sourceName || t('sourceLink')}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : <span />}

                  <Link
                    to={`/current-affairs/${detailSlug}`}
                    className="font-semibold text-xs text-[#2468B4] hover:underline flex items-center gap-1"
                  >
                    <span>{t('readMore')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No articles found"
          description="Try selecting a different topic or clearing your search keywords."
          onReset={() => { setSearchQuery(''); setSelectedTopic('All'); }}
        />
      )}

      {/* GK Practice Bottom Card */}
      <div className="bg-[#EAF3FF] rounded-2xl p-6 border border-[#2468B4]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-base text-[#12345A]">
            Test your knowledge of these events
          </h3>
          <p className="text-xs text-slate-600">
            Practice bilingual multiple-choice questions based on national, AP, and TS current affairs.
          </p>
        </div>
        <Link
          to="/gk-practice"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#12345A] text-white font-bold text-xs rounded-xl hover:bg-[#0B1F3A] transition-colors shrink-0"
        >
          <span>Start Daily GK Quiz</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
