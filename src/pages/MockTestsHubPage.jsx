import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  Award,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { MOCK_TESTS_METADATA } from '../data/mockTestsData.js';
import MockTestCard from '../components/MockTestCard.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function MockTestsHubPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const months = ['All', 'January 2026', 'December 2025', 'November 2025', 'October 2025'];

  const filteredMocks = useMemo(() => {
    return MOCK_TESTS_METADATA.filter((mock) => {
      const matchMonth =
        selectedMonth === 'All' ||
        mock.month.toLowerCase().includes(selectedMonth.toLowerCase());
      const matchSearch =
        searchQuery === '' ||
        mock.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mock.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mock.subtitle && mock.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchMonth && matchSearch;
    });
  }, [selectedMonth, searchQuery]);

  // Overall statistics
  const totalQuestions = MOCK_TESTS_METADATA.reduce((acc, m) => acc + m.questionsCount, 0);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: t('navHome') || 'Home', path: '/' },
          { label: 'Mock Tests & CBT Hub' }
        ]}
      />

      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-[#0B1F3A] via-[#12345A] to-[#1E4E8C] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg border border-white/10">
        <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-64 h-64 bg-[#F2BE4F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#2468B4]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F2BE4F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official PDF-Grounded Test Series</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Current Affairs <span className="text-[#F2BE4F]">Mock Tests & CBT Hub</span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Practice realistic online computer-based tests (CBT) compiled from verified
            monthly Current Affairs compilations (Jan 2026, Dec 2025, Nov 2025 & Oct 2025).
            Equipped with instant practice mode, detailed explanations, and authentic PDF downloads.
          </p>

          {/* Quick Stats Counter */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-[#F2BE4F]">
                {totalQuestions}+
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Verified MCQs</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">6</div>
              <div className="text-[11px] text-slate-300 font-medium">Full & Mini Mocks</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
              <div className="text-[11px] text-slate-300 font-medium">Verified Solutions</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-sky-400">4 PDFs</div>
              <div className="text-[11px] text-slate-300 font-medium">Authentic Files</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E3EAF2] shadow-xs">
        {/* Month Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedMonth === m
                  ? 'bg-[#12345A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mock test by month or title..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-[#F6F8FC] border border-[#E3EAF2] rounded-full focus:outline-hidden focus:border-[#2468B4] focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Mock Cards Grid Matching UI Mockup */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#12345A] tracking-tight">
              Available Test Series
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#12345A]">
              {filteredMocks.length} Tests
            </span>
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            Click <span className="font-bold text-slate-700">Start Mock</span> for timed CBT or tap pills for Practice / Solutions
          </div>
        </div>

        {filteredMocks.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#E3EAF2] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF3FF] text-[#2468B4] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No mock tests match your filter</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try switching back to "All" months or clear your search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedMonth('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#12345A] text-white rounded-full text-xs font-bold hover:bg-[#0B1F3A]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMocks.map((mock) => (
              <MockTestCard key={mock.id} mock={mock} />
            ))}
          </div>
        )}
      </div>

      {/* Feature Guide & Instructions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAF2] space-y-6">
        <h3 className="text-lg font-black text-[#12345A] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>How ExamQuestHub Mock Test Engine Works</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#F6F8FC] border border-[#E3EAF2] space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#12345A] text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900">CBT Exam Mode</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard examination environment with live countdown timer, interactive question
              navigation palette, mark for review, and deep result analytics with negative marking.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F8FC] border border-[#E3EAF2] space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#2468B4] text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900">Practice Mode</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Self-paced learning mode. Selecting any option immediately reveals whether your
              answer is correct, highlighting the right choice and unfolding the authentic explanation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F8FC] border border-[#E3EAF2] space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900">Solutions & Compendiums</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review all questions with verified official rationales without taking the test. Download
              original PDF compendiums directly using the top-right document button on each card.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
