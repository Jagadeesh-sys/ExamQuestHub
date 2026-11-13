import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  ShieldCheck,
  Instagram,
  ArrowRight,
  Bell,
  GraduationCap,
  ChevronLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import { PWAInstallButton } from './PWAInstallBanner.jsx';

export default function Header() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnread, setHasUnread] = useState(true);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen || notificationsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, notificationsOpen]);

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
    { to: '/', label: t('navHome') || 'Home' },
    { to: '/jobs', label: t('navJobs') || 'Jobs' },
    { to: '/syllabus', label: 'Syllabus' },
    { to: '/mocks', label: 'Mock Tests', isHot: true },
    { to: '/results', label: t('navResults') || 'Results' },
    { to: '/current-affairs', label: t('navCurrentAffairs') || 'Current Affairs' },
    { to: '/previous-papers', label: t('navPreviousPapers') || 'Previous Papers' },
  ];

  const quickNotifications = [
    {
      id: 'n1',
      title: 'RRB NTPC 2026 – 32,438 Vacancies',
      desc: 'Online application window is officially open. Last date 30 Nov 2026.',
      time: 'Just now',
      link: '/jobs/rrb-ntpc-2026-cbt1',
      tag: 'New'
    },
    {
      id: 'n2',
      title: 'CRPF Sports Quota Recruitment',
      desc: '521 Constable posts announced. Download authentic PDF notification.',
      time: '2 hours ago',
      link: '/jobs',
      tag: 'Verified'
    },
    {
      id: 'n3',
      title: 'NIA Sub-Inspector & Inspector Exam Date',
      desc: 'Admit cards releasing soon. Check official schedule and syllabus.',
      time: 'Today',
      link: '/admit-cards',
      tag: 'Admit Card'
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-200 bg-[#1F224D] text-white border-b border-[#2C3867]/60 shadow-sm">
        {/* Desktop Top announcement bar */}
        <div className="hidden lg:block bg-[#16193E] text-white text-[11px] py-1.5 px-6 border-b border-[#242A57]">
          <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-black bg-[#F2BE4F] text-[#0B1F3A] uppercase tracking-wider">
                100% Verified
              </span>
              <span className="text-slate-300 font-medium">
                {t('trustNote') || 'Directly extracted from authentic official gazette notifications & official answer keys.'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
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
                <span>{t('navAdmin') || 'Admin Portal'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main App Bar - Matches the reference screenshot */}
        <div className="max-w-[1240px] mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-[60px] sm:h-[68px]">
            
            {/* Left Slot: Mobile Back button (on /mocks) or Hamburger and Brand Logo */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {location.pathname.startsWith('/mocks') ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.history.length > 1) {
                      navigate(-1);
                    } else {
                      navigate('/');
                    }
                  }}
                  className="lg:hidden w-8 h-8 -ml-1 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer active:scale-95"
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden w-8 h-8 -ml-1 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer active:scale-95"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-5 h-5 stroke-[2.2]" />
                </button>
              )}

              {/* Brand Logo & Title with compact gap and exact image proportions */}
              <Link
                to="/"
                className="flex items-center gap-1.5 sm:gap-2 group focus:outline-hidden py-1"
                aria-label="ExamQuestHub Home"
              >
                <img
                  src="/assets/aistudio/examquesthub_cap_logo.png"
                  alt="ExamQuest Hub Logo"
                  className="h-[24px] sm:h-[27px] w-auto object-contain shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform"
                />
                
                <div className="flex flex-col text-left">
                  <span className="font-heading font-extrabold text-[13.5px] sm:text-[15px] tracking-tight text-white leading-tight">
                    Exam<span className="text-[#F2BE4F] font-extrabold">Quest</span> <span className="font-extrabold text-white">Hub</span>
                  </span>
                  <span className="text-[7.5px] sm:text-[8.5px] font-medium text-[#A6B9D8] tracking-tight leading-none mt-0.5 whitespace-nowrap">
                    Govt Exams • Jobs • Current Affairs
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Center Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-xs font-bold rounded-lg transition-colors relative flex items-center gap-1.5 ${
                      isActive
                        ? 'text-white bg-white/15 shadow-2xs'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
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

            {/* Right Slot: Language Pill, Notification Bell, Search Icon */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Language Selector Pill "🌐 English ⌵" */}
              <LanguageSelector variant="pill-dark" />

              {/* Notification Bell with Red Badge Dot - Decreased size */}
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(true);
                  setHasUnread(false);
                }}
                className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer relative active:scale-95"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4 stroke-[2]" />
                {hasUnread && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-[#1F224D]" />
                )}
              </button>

              {/* Search Glass Button - Decreased size */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer active:scale-95"
                title="Search exams"
                aria-label="Search exams"
              >
                <Search className="w-4 h-4 stroke-[2]" />
              </button>

              {/* Desktop Install App CTA */}
              <div className="hidden lg:block ml-2">
                <PWAInstallButton className="bg-[#F2BE4F] text-[#0B1F3A] hover:bg-[#E0AC3C] font-bold text-xs shadow-xs" />
              </div>
            </div>

          </div>
        </div>

        {/* Quick Search Overlay Dropdown - Decreased compact size */}
        {searchOpen && (
          <div className="border-t border-[#1E3A5F] bg-[#071527] py-2 px-3 sm:px-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="max-w-[720px] mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, exams, notifications, current affairs..."
                  autoFocus
                  className="w-full pl-8 pr-20 py-1.5 sm:py-2 text-xs bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-full focus:outline-hidden focus:border-[#F2BE4F] focus:ring-2 focus:ring-[#F2BE4F]/20 shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1 bg-[#F2BE4F] hover:bg-[#E0AC3C] text-[#0B1F3A] text-[11px] font-black rounded-full transition-colors cursor-pointer shadow-2xs"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Sheet */}
            <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white text-[#182B45] h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
              
              {/* Drawer Header */}
              <div className="p-4 bg-[#1F224D] text-white flex items-center justify-between border-b border-[#2C3867]">
                <div className="flex items-center gap-1.5">
                  <img
                    src="/assets/aistudio/examquesthub_cap_logo.png"
                    alt="ExamQuest Hub Logo"
                    className="h-[24px] w-auto object-contain shrink-0"
                  />
                  <div>
                    <span className="font-heading font-extrabold text-[13.5px] text-white leading-tight block">
                      Exam<span className="text-[#F2BE4F] font-extrabold">Quest</span> Hub
                    </span>
                    <span className="text-[7.5px] sm:text-[8px] text-[#A6B9D8] font-medium block mt-0.5">
                      Govt Exams • Jobs • Current Affairs
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
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
                      placeholder="Search exams, notifications..."
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
                      `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-colors ${
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

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="px-1">
                    <PWAInstallButton className="w-full justify-center bg-[#12345A] text-white hover:bg-[#0B1F3A] py-2.5 shadow-xs" />
                  </div>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#F2BE4F]" />
                    <span>Admin Portal</span>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold">Language:</span>
                  <LanguageSelector />
                </div>
                <a
                  href="https://instagram.com/examquesthub"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Follow @examquesthub</span>
                </a>
              </div>

            </div>
          </div>
        )}

        {/* Notifications Modal/Drawer */}
        {notificationsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setNotificationsOpen(false)}
            />
            <div className="relative w-full max-w-md bg-white text-[#182B45] rounded-3xl shadow-2xl p-5 z-10 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#12345A] flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-[#12345A]">
                    Live Exam Alerts
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2 max-h-[60vh] overflow-y-auto">
                {quickNotifications.map((n) => (
                  <Link
                    key={n.id}
                    to={n.link}
                    onClick={() => setNotificationsOpen(false)}
                    className="block py-3 hover:bg-slate-50 rounded-xl px-2 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#12345A]">
                        {n.tag}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{n.time}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <Link
                  to="/jobs"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-bold text-[#2468B4] hover:underline"
                >
                  View All Notifications →
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
