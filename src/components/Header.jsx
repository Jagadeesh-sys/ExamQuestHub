import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  ShieldCheck,
  Instagram,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import LanguageSelector from './LanguageSelector.jsx';

export default function Header() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: t('navHome') },
    { to: '/jobs', label: t('navJobs') },
    { to: '/mocks', label: 'Mock Tests', isHot: true },
    { to: '/admit-cards', label: t('navAdmitCards') },
    { to: '/results', label: t('navResults') },
    { to: '/current-affairs', label: t('navCurrentAffairs') },
    { to: '/previous-papers', label: t('navPreviousPapers') },
    { to: '/study-material', label: t('navStudyMaterials') },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white ${
          isScrolled
            ? 'shadow-xs border-b border-[#E3EAF2]'
            : 'border-b border-[#E3EAF2]'
        }`}
      >
        {/* Top announcement bar - compact and wrap-proof */}
        <div className="bg-[#0B1F3A] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-[#F2BE4F] text-[#0B1F3A] uppercase tracking-wider shrink-0">
                Verified
              </span>
              <span className="truncate text-slate-200 font-medium">
                {t('trustNote')}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-slate-300 shrink-0">
              <a
                href="https://instagram.com/examquesthub"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[#F2BE4F] transition-colors"
                title="Follow on Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span className="text-[11px]">@examquesthub</span>
              </a>
              <Link
                to="/admin"
                className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#F2BE4F]" />
                <span>{t('navAdmin')}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Nav Container */}
        <div className="max-w-[1200px] mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between min-h-[58px] sm:min-h-[72px] py-1">
            
            {/* Logo with Name Underneath */}
            <Link
              to="/"
              className="flex flex-col items-center justify-center text-center group focus:outline-hidden py-0.5 shrink-0"
              aria-label="ExamQuestHub Home"
            >
              <img
                src="/assets/aistudio/file_000000006a4881f4be54dc3e116f9bc0_65b76b0e.png"
                alt="ExamQuestHub Logo"
                className="w-7 h-7 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform drop-shadow-xs shrink-0"
              />
              <span className="font-heading font-extrabold text-[11px] sm:text-[13px] tracking-tight text-[#12345A] leading-none mt-1 whitespace-nowrap">
                ExamQuest <span className="text-[#2468B4]">Hub</span>
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] font-semibold text-slate-500 tracking-wider uppercase leading-none mt-0.5 hidden sm:block">
                Your Exam. Your Next Step.
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-semibold rounded-lg transition-colors relative flex items-center gap-1.5 ${
                      isActive
                        ? 'text-[#12345A] bg-[#EAF3FF]'
                        : 'text-slate-600 hover:text-[#12345A] hover:bg-slate-50'
                    }`
                  }
                >
                  <span>{link.label}</span>
                  {link.isHot && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#F2BE4F] text-[#0B1F3A] uppercase tracking-wider">
                      CBT
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-slate-500 hover:text-[#12345A] hover:bg-slate-100 rounded-lg transition-colors"
                title="Search exams"
                aria-label="Search exams"
              >
                <Search className="w-4 h-4" />
              </button>
              <LanguageSelector />
            </div>

            {/* Mobile Controls (Minimal & Touch-Friendly, min 44px tap target) */}
            <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
              <LanguageSelector compact />
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-xl"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-xl focus:outline-hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-[#E3EAF2] bg-[#F6F8FC] py-3 px-3 sm:px-4 shadow-inner animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="max-w-[720px] mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  autoFocus
                  className="w-full pl-9 pr-20 py-2.5 text-xs sm:text-sm bg-white border border-[#E3EAF2] rounded-xl focus:outline-hidden focus:border-[#2468B4] focus:ring-2 focus:ring-[#2468B4]/20 shadow-xs"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1.5 bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Robust Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Sheet */}
            <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
              
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <img
                    src="/assets/aistudio/file_000000006a4881f4be54dc3e116f9bc0_65b76b0e.png"
                    alt="ExamQuestHub Logo"
                    className="w-10 h-10 object-contain drop-shadow-xs"
                  />
                  <span className="font-heading font-extrabold text-sm text-[#12345A] mt-1 leading-tight">
                    ExamQuest <span className="text-[#2468B4]">Hub</span>
                  </span>
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                    Your Exam. Your Next Step.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 self-start mt-0.5"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                <div className="mb-4">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchPlaceholder')}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#2468B4]"
                    />
                  </form>
                </div>

                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'text-[#12345A] bg-[#EAF3FF]'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </NavLink>
                ))}

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#F2BE4F]" />
                    <span>{t('navAdmin')}</span>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Language / భాష:</span>
                  <LanguageSelector />
                </div>
                <a
                  href="https://instagram.com/examquesthub"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Follow @examquesthub</span>
                </a>
              </div>

            </div>
          </div>
        )}
      </header>
    </>
  );
}
