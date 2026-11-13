import React from 'react';
import { Sparkles, Crown, Check, X, ShieldCheck, Zap, BookOpen, Award, FileText } from 'lucide-react';

export default function ExamPassProModal({ isOpen, onClose, onActivatePass, isPassActive }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F2BE4F] to-amber-600 text-white flex items-center justify-center shadow-md">
              <Crown className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10.5px] font-bold">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>ExamQuestHub Premium Tier</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#12345A] font-heading mt-0.5">
                ExamPass Pro
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed relative z-10">
          Unlock all advanced examination mock tests, sectional CBT simulations, all-India rank percentile analytics, and official PDF question keys.
        </p>

        {/* Feature List */}
        <div className="space-y-2.5 py-1 relative z-10">
          {[
            {
              icon: Zap,
              title: 'All Advanced Full Mocks Unlocked',
              desc: 'Access Mock 03, 04, 05+ sets for RRB NTPC, SSC CGL, CHSL and MTS'
            },
            {
              icon: Award,
              title: 'All-India Rank & Percentile Breakdown',
              desc: 'Real-time performance comparison against top rankers across shifts'
            },
            {
              icon: BookOpen,
              title: '50-Question Mega Topic Drills',
              desc: 'Unlimited question size selection (10, 20, 25, 50 Qs) for all topics'
            },
            {
              icon: FileText,
              title: 'Official CBT Question Papers & Solutions',
              desc: 'Direct PDF downloads for all 211 official examination shift papers'
            }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-[#F6F8FC] border border-[#E3EAF2]">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#12345A] shrink-0 shadow-2xs">
                <item.icon className="w-4 h-4 text-[#F2BE4F]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#12345A]">{item.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Plan status & Activation */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <div className="text-center sm:text-left">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">Status</span>
            <span className="text-xs font-black text-[#12345A]">
              {isPassActive ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Pro Pass Active</span>
                </span>
              ) : (
                'Free Tier User'
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onActivatePass();
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-full bg-gradient-to-r from-[#12345A] to-[#1E4D82] hover:opacity-95 text-white text-xs font-black transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 text-[#F2BE4F]" />
              <span>{isPassActive ? 'Deactivate Pro Pass' : 'Activate Free 7-Day Pass'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
