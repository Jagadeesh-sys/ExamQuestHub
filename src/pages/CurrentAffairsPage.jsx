import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getCurrentAffairs } from '../firebase/firestoreService.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EditorialCurrentAffairsSection from '../components/EditorialCurrentAffairsSection.jsx';

export default function CurrentAffairsPage() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: t('navCurrentAffairs') }]} />

      {/* Editorial Current Affairs Section (Matching image_1b19ce6e.png) */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : (
        <EditorialCurrentAffairsSection
          articles={articles}
          loading={loading}
          showViewToggle={true}
          initialViewMode="editorial"
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
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#12345A] text-white font-bold text-xs rounded-xl hover:bg-[#0B1F3A] transition-colors shrink-0 shadow-xs"
        >
          <span>Start Daily GK Quiz</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
