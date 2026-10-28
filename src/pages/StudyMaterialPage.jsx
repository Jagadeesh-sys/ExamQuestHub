import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Download,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getResources } from '../firebase/firestoreService.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function StudyMaterialPage() {
  const { t, getLocalized } = useLanguage();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadMaterials() {
      try {
        const data = await getResources();
        setResources(data);
      } catch (err) {
        console.error('Failed to load study materials', err);
      } finally {
        setLoading(false);
      }
    }
    loadMaterials();
  }, []);

  const categories = [
    'All',
    'Syllabus & Exam Pattern',
    'General Knowledge notes',
    'Previous-Year Papers'
  ];

  const filtered = resources.filter((item) => {
    const title = getLocalized(item.title).toLowerCase();
    const matchSearch = !searchQuery.trim() || title.includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: t('navStudyMaterials') }]} />

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#E3EAF2]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12345A] uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4 text-[#2468B4]" />
              <span>Syllabus Breakdown & Notes</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#182B45]">
              {t('navStudyMaterials')} & Syllabi
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Official stage-wise syllabus PDFs, marking schemes, and monthly current-affairs revision digests.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-[#F6F8FC] px-3.5 py-2 rounded-xl border border-[#E3EAF2]">
            Showing <strong className="text-[#12345A]">{filtered.length}</strong> resources
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search syllabus by examination or subject..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4]"
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E3EAF2] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#2468B4] text-slate-700"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Resource Types' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Materials */}
      {loading ? (
        <SkeletonLoader count={4} />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const title = getLocalized(item.title);
            const desc = getLocalized(item.description);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E3EAF2] hover:border-[#2468B4]/40 hover:shadow-xs transition-all p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 font-bold text-[11px]">
                      {item.category}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {item.fileSize || 'PDF Document'}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#182B45] leading-snug line-clamp-2">
                    {title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Board: {item.examBoard}
                  </span>

                  <a
                    href={item.downloadUrl || item.officialSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#12345A] hover:bg-[#0B1F3A] text-white font-semibold rounded-xl transition-colors shadow-xs active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No study resources found"
          description="Try adjusting your search query or selecting All Resource Types."
          onReset={() => { setSearchQuery(''); setCategoryFilter('All'); }}
        />
      )}

    </div>
  );
}
