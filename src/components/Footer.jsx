import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Instagram,
  AlertCircle,
  ExternalLink,
  Shield,
  FileText,
  Mail,
  Heart
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0B1F3A] text-slate-300 pt-12 pb-8 border-t border-[#12345A]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Prominent Mandatory Disclaimer Callout */}
        <div className="bg-[#12345A]/80 border border-slate-700/60 rounded-xl p-4 sm:p-5 mb-10 text-xs sm:text-sm text-slate-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#F2BE4F] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#F2BE4F] uppercase tracking-wider text-[11px] block">
                {t('disclaimer')} / Statutory Advisory
              </span>
              <p className="leading-relaxed text-slate-300">
                {t('disclaimerNotice')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/examquesthub-logo.png"
                alt="ExamQuestHub Logo"
                className="w-10 h-10 rounded-full object-contain bg-white/10 p-0.5 border border-white/20"
              />
              <span className="font-heading font-extrabold text-lg text-white">
                ExamQuest<span className="text-[#F2BE4F]">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('aboutText')}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com/examquesthub"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-pink-400 hover:bg-pink-600 hover:text-white transition-colors"
                title="ExamQuestHub on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@examquesthub.com"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sky-400 hover:bg-sky-600 hover:text-white transition-colors"
                title="Email Editorial Team"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider text-xs">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  {t('navJobs')}
                </Link>
              </li>
              <li>
                <Link to="/admit-cards" className="hover:text-white transition-colors">
                  {t('navAdmitCards')}
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-white transition-colors">
                  {t('navResults')}
                </Link>
              </li>
              <li>
                <Link to="/current-affairs" className="hover:text-white transition-colors">
                  {t('navCurrentAffairs')}
                </Link>
              </li>
              <li>
                <Link to="/previous-papers" className="hover:text-white transition-colors">
                  {t('navPreviousPapers')}
                </Link>
              </li>
              <li>
                <Link to="/study-material" className="hover:text-white transition-colors">
                  {t('navStudyMaterials')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Examination Boards */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider text-xs">
              Official Boards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://upsc.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>UPSC (upsc.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://ssc.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>SSC (ssc.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://psc.ap.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>APPSC (psc.ap.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://tgpsc.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>TGPSC (tgpsc.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://rrbcdg.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Railway RRB (rrbcdg.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://ibps.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>IBPS (ibps.in)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Editorial Policy */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider text-xs">
              {t('legalLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400">
                  ExamQuestHub operates under public editorial guidelines. All notifications are cross-checked with the respective commission gazettes.
                </span>
              </li>
              <li className="pt-2">
                <a
                  href="mailto:corrections@examquesthub.com?subject=Report%20Correction"
                  className="text-[#F2BE4F] hover:underline inline-flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  <span>Report a typo or notification update</span>
                </a>
              </li>
              <li className="pt-1">
                <Link to="/admin" className="text-slate-400 hover:text-white flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Editor & Admin Sign-in</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} ExamQuestHub. {t('allRightsReserved')}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Use</span>
            <span>•</span>
            <span>Anti-Fraud Advisory</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
