import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Globe2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Share2,
  Check,
  Copy,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getCurrentAffairById } from '../firebase/firestoreService.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';

export default function CurrentAffairDetailPage() {
  const { id } = useParams();
  const { t, getLocalized } = useLanguage();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadItem() {
      setLoading(true);
      try {
        const item = await getCurrentAffairById(id);
        setArticle(item);
      } catch (err) {
        console.error('Failed to load current affair:', err);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <SkeletonLoader count={1} type="card" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Article Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            The requested news item could not be retrieved.
          </p>
          <Link
            to="/current-affairs"
            className="px-4 py-2 bg-[#12345A] text-white text-xs font-semibold rounded-xl"
          >
            Back to Current Affairs
          </Link>
        </div>
      </div>
    );
  }

  const headline = getLocalized(article.headline);
  const summary = getLocalized(article.summary);
  const content = getLocalized(article.content || article.summary);

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t('navCurrentAffairs'), to: '/current-affairs' },
          { label: headline }
        ]}
      />

      <article className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E3EAF2] space-y-6">
        
        {/* Topic & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-100">
              {article.topic}
            </span>
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Event Date: {article.eventDate}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Headline */}
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#182B45] leading-tight">
          {headline}
        </h1>

        {/* Source verification callout */}
        <div className="bg-[#F6F8FC] rounded-2xl p-4 border border-[#E3EAF2] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-600">
              Verified Source: <strong className="text-slate-900">{article.sourceName || 'Official Press Release'}</strong>
            </span>
          </div>
          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#2468B4] hover:underline"
            >
              <span>View Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-96">
            <img
              src={article.imageUrl}
              alt={headline}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Summary Card */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
          {summary}
        </div>

        {/* Body content */}
        <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-4 pt-2">
          <p>{content}</p>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Keywords:</span>
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Practice Navigation */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/current-affairs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#12345A]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Current Affairs</span>
          </Link>

          <Link
            to="/gk-practice"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold transition-colors"
          >
            <span>Practice Related GK Questions</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </article>

    </div>
  );
}
