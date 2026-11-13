import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Download,
  Calendar,
  FileText,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { subscribeToCurrentAffairs } from '../firebase/firestoreService.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EditorialCurrentAffairsSection from '../components/EditorialCurrentAffairsSection.jsx';

// Official Monthly PDF Capsules available for direct download
const MONTHLY_PDF_CAPSULES = [
  {
    month: 'January 2026',
    title: 'January 2026 Current Affairs MCQ Capsule',
    pages: '28 Pages',
    mcqs: '250+ MCQs',
    url: '/assets/aistudio/January_2026_Current_Affairs_MCQ_31a6a736.pdf',
    fileName: 'January_2026_Current_Affairs_MCQ.pdf',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    month: 'December 2025',
    title: 'December 2025 Current Affairs MCQ Capsule',
    pages: '32 Pages',
    mcqs: '300+ MCQs',
    url: '/assets/aistudio/December_2025_Current_Affairs_MCQs_fea0a8ff.pdf',
    fileName: 'December_2025_Current_Affairs_MCQs.pdf',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    month: 'November 2025',
    title: 'November 2025 Current Affairs MCQ Capsule',
    pages: '30 Pages',
    mcqs: '280+ MCQs',
    url: '/assets/aistudio/November_2025_Current_Affairs_MCQs_106d2ab4.pdf',
    fileName: 'November_2025_Current_Affairs_MCQs.pdf',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    month: 'October 2025',
    title: 'October 2025 Current Affairs MCQ Capsule',
    pages: '26 Pages',
    mcqs: '240+ MCQs',
    url: '/assets/aistudio/October_2025_Current_Affairs_MCQs_9e8d634c.pdf',
    fileName: 'October_2025_Current_Affairs_MCQs.pdf',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
  }
];

export default function CurrentAffairsPage() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    const unsub = subscribeToCurrentAffairs((data) => {
      setArticles(data || []);
      setLoadingArticles(false);
    });

    return () => unsub();
  }, []);

  return (
    <div className="max-w-[1240px] mx-auto px-3 sm:px-6 py-3 sm:py-8 pb-24 sm:pb-8 space-y-4 sm:space-y-8">
      {/* 1. BREADCRUMBS (Hidden on mobile) */}
      <div className="hidden sm:flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: t('navCurrentAffairs') || 'Current Affairs' }
          ]}
        />
      </div>

      {/* Mobile Page Header Bar */}
      <div className="sm:hidden flex items-center justify-between pt-1 pb-0.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#12345A] flex items-center justify-center border border-blue-100/80 shadow-2xs">
            <Newspaper className="w-4.5 h-4.5 text-[#2468B4]" />
          </div>
          <div>
            <h1 className="font-heading font-black text-base text-[#12345A] leading-tight">Current Affairs &amp; GK</h1>
            <p className="text-[10.5px] text-slate-500 font-semibold">Daily Verified Exam News &amp; MCQs</p>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED CURRENT AFFAIRS HERO BANNER (Desktop & Classic View) */}
      <div className="hidden sm:block bg-gradient-to-r from-[#00224F] via-[#02316E] to-[#033E7B] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-xl border border-white/15">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#F2BE4F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-[#2468B4]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-[#F2BE4F]/40 text-[#F2BE4F] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Verified Exam Capsules • UPSC • SSC • RRB • State PSCs</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Daily Current Affairs &amp; <span className="text-[#F2BE4F]">Editorial Analysis</span>
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed">
              Curated daily news capsules, policy breakdowns, economic indicators, and verified monthly MCQ banks designed specifically for competitive exam aspirants.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs font-semibold text-slate-100">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bilingual Coverage (English &amp; Telugu)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Topic-wise Classification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Monthly PDF Downloads</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Block */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15 text-center min-w-[120px]">
              <div className="w-8 h-8 mx-auto rounded-xl bg-white/15 flex items-center justify-center text-[#F2BE4F] mb-1.5">
                <Newspaper className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{articles.length || '50+'}</div>
              <div className="text-xs text-slate-300 font-medium">Daily Articles</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15 text-center min-w-[120px]">
              <div className="w-8 h-8 mx-auto rounded-xl bg-white/15 flex items-center justify-center text-[#F2BE4F] mb-1.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">4</div>
              <div className="text-xs text-slate-300 font-medium">Monthly PDFs</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MONTHLY CURRENT AFFAIRS PDF CAPSULES (Desktop & Tablet) */}
      <section className="hidden sm:block bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#E3EAF2] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2468B4] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#12345A]">
                Official Monthly Current Affairs PDF Capsules
              </h2>
              <p className="text-xs text-slate-500">
                Download verified monthly MCQ question banks directly to your device for offline revision.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MONTHLY_PDF_CAPSULES.map((capsule) => (
            <div
              key={capsule.month}
              className="bg-[#FAFBFD] rounded-2xl border border-[#E3EAF2] p-4 flex flex-col justify-between gap-3 hover:border-[#2468B4] hover:shadow-sm transition group"
            >
              <div className="space-y-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${capsule.badgeColor} uppercase tracking-wider inline-block`}>
                  {capsule.month}
                </span>
                <h3 className="font-black text-sm text-[#12345A] leading-tight">
                  {capsule.title}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <span>{capsule.pages}</span>
                  <span>·</span>
                  <span className="font-bold text-emerald-600">{capsule.mcqs}</span>
                </div>
              </div>

              <a
                href={capsule.url}
                download={capsule.fileName}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-white border border-[#E3EAF2] hover:bg-[#EAF3FF] hover:border-[#2468B4] text-[#12345A] text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#2468B4]" />
                <span>Download PDF</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MAIN EDITORIAL CURRENT AFFAIRS SECTION (with News Reels on Mobile!) */}
      <section className="space-y-4">
        {loadingArticles ? (
          <SkeletonLoader count={4} />
        ) : (
          <EditorialCurrentAffairsSection
            articles={articles}
            loading={loadingArticles}
            showViewToggle={true}
            initialViewMode="editorial"
            mobileReels={true}
          />
        )}
      </section>
    </div>
  );
}
