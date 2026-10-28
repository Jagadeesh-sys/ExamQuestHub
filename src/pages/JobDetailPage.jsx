import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Clock,
  GraduationCap,
  FileText,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Share2,
  Check,
  Copy,
  ChevronRight,
  Info,
  DollarSign,
  Users,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getUpdateById, getUpdates } from '../firebase/firestoreService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import NotificationCard from '../components/NotificationCard.jsx';

export default function JobDetailPage() {
  const { slug } = useParams();
  const { t, getLocalized } = useLanguage();

  const [job, setJob] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const item = await getUpdateById(slug);
        setJob(item);
        if (item) {
          const all = await getUpdates(false);
          const rel = all.filter(
            (o) => o.id !== item.id && (o.category === item.category || o.region === item.region)
          ).slice(0, 3);
          setRelated(rel);
        }
      } catch (err) {
        console.error('Failed to load job detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: getLocalized(job?.title) || 'Exam Notification',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `*${getLocalized(job?.title)}*\nOrganization: ${getLocalized(job?.organization)}\nLast Date: ${job?.deadline || 'Refer Official Notice'}\nVerified Details: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <SkeletonLoader count={1} type="card" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Notification Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            The requested recruitment record does not exist or may have been relocated.
          </p>
          <Link
            to="/jobs"
            className="px-4 py-2 bg-[#12345A] text-white text-xs font-semibold rounded-xl"
          >
            Back to Latest Jobs
          </Link>
        </div>
      </div>
    );
  }

  const title = getLocalized(job.title);
  const org = getLocalized(job.organization);
  const qual = getLocalized(job.qualification, t('referOfficialNotice'));
  const age = getLocalized(job.ageLimit, t('referOfficialNotice'));
  const fee = getLocalized(job.applicationFee, t('referOfficialNotice'));
  const selection = getLocalized(job.selectionProcess, t('referOfficialNotice'));
  const salary = getLocalized(job.salary, t('referOfficialNotice'));
  const summary = getLocalized(job.summary);
  const desc = getLocalized(job.description);

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-8 pb-32 lg:pb-8">
      
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t('navJobs'), to: '/jobs' },
          { label: title }
        ]}
      />

      {/* Main Notification Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAF2] shadow-xs space-y-6">
        
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-[#12345A] font-bold text-xs">
              <Building2 className="w-3.5 h-3.5 text-[#2468B4]" />
              {org}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
              {job.category}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
              {job.region}
            </span>
          </div>

          <StatusBadge status={job.status} />
        </div>

        {/* Title */}
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#182B45] leading-tight">
          {title}
        </h1>

        {/* Key Quick Facts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F6F8FC] p-4 rounded-2xl border border-[#E3EAF2]">
          <div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
              {t('publishedOn')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#182B45]">
              {job.publishedAt || t('referOfficialNotice')}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
              {t('closingDate')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-amber-900">
              {job.deadline || t('referOfficialNotice')}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
              {t('vacancies')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-emerald-800">
              {job.vacancies || t('referOfficialNotice')}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
              {t('notificationNo')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-700 truncate block">
              {job.notificationNo || 'See Gazette'}
            </span>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {job.applyUrl && (
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95"
              >
                <span>{job.type === 'admit-card' ? t('downloadAdmitCard') : job.type === 'result' ? t('checkResult') : t('applyOnline')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {job.pdfUrl && (
              <a
                href={job.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-semibold rounded-xl transition-all active:scale-95"
              >
                <FileText className="w-4 h-4 text-red-500" />
                <span>{t('officialNotification')}</span>
              </a>
            )}
          </div>

          {/* Social Share Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>{t('shareOnWhatsApp')}</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title={t('copyLink')}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>

      {/* Structured Details Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Comprehensive Facts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Editorial Summary & Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAF2] space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#182B45] flex items-center gap-2">
              <Info className="w-5 h-5 text-[#2468B4]" />
              <span>Overview & Description</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {summary}
            </p>
            {desc && (
              <p className="text-sm text-slate-600 leading-relaxed pt-2">
                {desc}
              </p>
            )}
          </div>

          {/* Detailed Verification Matrix */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAF2] space-y-6">
            <h2 className="font-heading font-bold text-lg text-[#182B45] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#16845D]" />
              <span>Verified Eligibility & Rules</span>
            </h2>

            <div className="divide-y divide-slate-100 text-sm">
              
              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {t('qualification')}
                </span>
                <span className="sm:col-span-2 text-slate-800 leading-relaxed">
                  {qual}
                </span>
              </div>

              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {t('ageLimit')}
                </span>
                <span className="sm:col-span-2 text-slate-800 leading-relaxed">
                  {age}
                </span>
              </div>

              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {t('applicationFee')}
                </span>
                <span className="sm:col-span-2 text-slate-800 leading-relaxed">
                  {fee}
                </span>
              </div>

              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {t('selectionProcess')}
                </span>
                <span className="sm:col-span-2 text-slate-800 leading-relaxed">
                  {selection}
                </span>
              </div>

              <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {t('salary')}
                </span>
                <span className="sm:col-span-2 text-slate-800 leading-relaxed">
                  {salary}
                </span>
              </div>

              {job.examDate && (
                <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    {t('examDate')}
                  </span>
                  <span className="sm:col-span-2 font-semibold text-[#12345A] leading-relaxed">
                    {job.examDate}
                  </span>
                </div>
              )}

            </div>
          </div>

          {/* Statutory Verification Footer Notice */}
          <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-[11px] block">
                Official Verification Log
              </span>
              <p className="leading-relaxed">
                This notice was verified on <strong className="font-semibold">{new Date(job.verifiedAt || job.publishedAt).toLocaleDateString()}</strong> from {org} official communications. {t('disclaimerNotice')}
              </p>
            </div>
          </div>

        </div>

        {/* Right Sidebar: Official Sources & Actions */}
        <div className="space-y-6">
          
          {/* Official Board Box */}
          <div className="bg-white rounded-3xl p-6 border border-[#E3EAF2] space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#182B45] uppercase tracking-wider text-xs">
              Direct Official Portals
            </h3>
            
            <div className="space-y-2.5 text-xs">
              {job.applyUrl && (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#12345A] text-white hover:bg-[#0B1F3A] font-semibold transition-colors"
                >
                  <span>Apply on Official Board</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {job.pdfUrl && (
                <a
                  href={job.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 font-semibold transition-colors"
                >
                  <span>Download Notification PDF</span>
                  <FileText className="w-4 h-4 text-red-500" />
                </a>
              )}

              {job.officialUrl && (
                <a
                  href={job.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <span>Recruitment Portal Home</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              ExamQuestHub never asks for your application password, OTP, or identity documents. Only apply through the commission URLs above.
            </div>
          </div>

          {/* Quick Prep Links */}
          <div className="bg-gradient-to-br from-[#EAF3FF] to-white rounded-3xl p-6 border border-[#2468B4]/20 space-y-3">
            <h3 className="font-heading font-bold text-sm text-[#12345A]">
              Prepare for this Examination
            </h3>
            <p className="text-xs text-slate-600">
              Revise topic-wise previous year questions and check syllabus breakdowns.
            </p>
            <div className="space-y-2 pt-1 text-xs">
              <Link
                to="/gk-practice"
                className="block p-2.5 rounded-xl bg-white border border-[#2468B4]/20 text-[#12345A] font-semibold hover:border-[#2468B4] transition-colors"
              >
                Practice Topic-Wise Daily GK →
              </Link>
              <Link
                to="/previous-papers"
                className="block p-2.5 rounded-xl bg-white border border-[#2468B4]/20 text-[#12345A] font-semibold hover:border-[#2468B4] transition-colors"
              >
                Download Past Papers & Keys →
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Related Notifications */}
      {related.length > 0 && (
        <section className="pt-6 border-t border-slate-200 space-y-4">
          <h2 className="font-heading font-bold text-xl text-[#182B45]">
            {t('relatedJobs')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((item) => (
              <NotificationCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Floating Mobile Sticky Action Bar */}
      {(job.applyUrl || job.pdfUrl) && (
        <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md px-4 py-2 border-t border-slate-200 shadow-xl flex items-center gap-2">
          {job.applyUrl && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl text-center shadow-xs flex items-center justify-center gap-1.5 active:scale-98"
            >
              <span>{job.type === 'admit-card' ? t('downloadAdmitCard') : job.type === 'result' ? t('checkResult') : t('applyOnline')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {job.pdfUrl && (
            <a
              href={job.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 border border-slate-200 active:scale-98"
              title="Official PDF"
            >
              <FileText className="w-4 h-4 text-red-500" />
              <span>PDF</span>
            </a>
          )}
        </div>
      )}

    </div>
  );
}
