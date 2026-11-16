import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { ArrowRight, Bell, BookOpen } from 'lucide-react';
import jobBannerArtwork from '../assets/images/job_banner_8d9279ad.png';

export const ONBOARDING_STORAGE_KEY = 'eqh_onboarding_v1_done';

const CAP_LOGO_URL = '/assets/aistudio/examquesthub_cap_logo.png';
const ONBOARDING_1_ARTWORK_URL =
  '/assets/aistudio/e036085fed9de97849e05bc00f1bdb7158c52d62247e4e329467bab21a32f66d_78218901.png';

/**
 * Full-screen Splash Screen + 2-Step Onboarding Flow:
 * - Stage 'splash': Vertical shading merge (#152164 -> #1F317B -> #3B59AA -> #AEC6EE -> #F5F8FD),
 *   "Welcome" with golden curved swash, centered 30% cap+book logo, and slim blue-to-gold loading bar.
 * - Stage 'onboarding-1': Matches the exact attached reference design ("Skip" top-right,
 *   centered 3D clipboard/cap/books/target artwork floating on gradient, "Prepare for Govt Exams",
 *   half-gold/half-white swash, concise subtitle, dots + circular white arrow CTA, and bottom waves).
 * - Stage 'onboarding-2': Matching screen for Government Job Notifications & Exam Alerts.
 */
export default function SplashOnboarding({
  isOpen,
  showOnboardingAfterSplash = true,
  onComplete
}) {
  const [stage, setStage] = useState('splash');
  const [progress, setProgress] = useState(0);
  const [art1Failed, setArt1Failed] = useState(false);
  const [art2Failed, setArt2Failed] = useState(false);

  const splashDurationMs = showOnboardingAfterSplash ? 1950 : 1200;

  // Reset stage whenever opened
  useEffect(() => {
    if (!isOpen) return;
    setStage('splash');
    setProgress(8);
  }, [isOpen]);

  // Smoothly animate loading indicator bar during Splash stage
  useEffect(() => {
    if (!isOpen || stage !== 'splash') return;

    const startTime = performance.now();
    let rafId = null;

    const tick = (now) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / splashDurationMs);
      const eased = 1 - Math.pow(1 - ratio, 2.6);
      setProgress(Math.round(8 + eased * 92));

      if (ratio < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        if (showOnboardingAfterSplash) {
          setStage('onboarding-1');
        } else {
          onComplete?.();
        }
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isOpen, stage, splashDurationMs, showOnboardingAfterSplash, onComplete]);

  // Lock background scroll while overlay is active
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleFinish();
      } else if (e.key === 'ArrowRight' && stage === 'onboarding-1') {
        setStage('onboarding-2');
      } else if (e.key === 'ArrowLeft' && stage === 'onboarding-2') {
        setStage('onboarding-1');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, stage]);

  const handleFinish = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage quota errors
    }
    onComplete?.();
  };

  const onboardingSlides = useMemo(
    () => ({
      'onboarding-1': {
        step: 1,
        line1: 'Prepare for',
        line2: 'Govt Exams',
        subtitle: 'Mock Tests & Practice Tests · 213+ Official CBT Shifts',
        nextLabel: 'Next: Government Job Notifications'
      },
      'onboarding-2': {
        step: 2,
        line1: 'Govt Job Alerts',
        line2: '& Exam Updates',
        subtitle: 'Official Notifications, Admit Cards & Results',
        nextLabel: 'Get Started'
      }
    }),
    []
  );

  if (!isOpen) return null;

  const activeSlide = onboardingSlides[stage] || null;

  return (
    <MotionConfig reducedMotion="user">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={
          stage === 'splash'
            ? 'Welcome to ExamQuest Hub'
            : `${activeSlide?.line1} ${activeSlide?.line2}`
        }
        className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-[#F5F8FD] text-[#182B45] select-none"
      >
        {/* Exact Shading Merge Gradient Layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 eqh-shading-merge-splash"
        />

        <AnimatePresence mode="wait">
          {stage === 'splash' ? (
            /* =================================================================
               SPLASH SCREEN — Centered 30% Logo with Welcome above & Loading below
               ================================================================= */
            <motion.div
              key="splash-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex-1 grid grid-rows-[1fr_auto_1fr] justify-items-center px-6 min-h-full"
            >
              {/* 1. "Welcome" with curved golden underline directly above centered logo */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="self-end pb-3.5 sm:pb-4 flex flex-col items-center text-center"
              >
                <h1 className="font-heading font-extrabold text-[34px] sm:text-[42px] tracking-tight leading-none text-white">
                  Wel<span className="text-[#F9B822]">come</span>
                </h1>

                <svg
                  className="mt-1 ml-12 sm:ml-14 w-[92px] sm:w-[110px] h-[12px] overflow-visible"
                  viewBox="0 0 110 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M2 7.5C32 2.5 72 2.5 106 6.5"
                    stroke="#F9B822"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
              </motion.div>

              {/* 2. Animated Graduation Cap + Open Book Logo (Dead-center vertically & horizontally) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.76, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 19,
                  delay: 0.16
                }}
                className="self-center flex items-center justify-center"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="flex items-center justify-center"
                >
                  <img
                    src={CAP_LOGO_URL}
                    alt="ExamQuest Hub Logo"
                    className="w-[30vw] min-w-[116px] max-w-[176px] h-auto object-contain block mx-auto drop-shadow-[0_14px_26px_rgba(12,26,78,0.28)]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </motion.div>

              {/* 3. Decreased Slim Horizontal Blue-to-Gold Loading Line directly below centered logo */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0.92 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="self-start pt-3.5 sm:pt-4 flex justify-center"
              >
                <div
                  className="w-[164px] sm:w-[196px] max-w-[48vw] h-[3.5px] rounded-full bg-white/38 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Loading ExamQuest Hub"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1045A1] via-[#2468B4] to-[#F9B822] transition-[width] duration-100 ease-out relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent eqh-animate-shimmer" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* =================================================================
               ONBOARDING 1 & 2 — Exact visual match to attached reference
               ================================================================= */
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex-1 flex flex-col justify-between min-h-full overflow-hidden"
            >
              {/* Top Bar: Skip button in top-right */}
              <div className="relative z-20 w-full max-w-4xl mx-auto px-5 sm:px-8 pt-4 sm:pt-6 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="min-h-[44px] px-3 py-2 text-sm sm:text-base font-bold text-white hover:text-[#F9B822] transition-colors cursor-pointer"
                >
                  Skip
                </button>
              </div>

              {/* Center Stage: Floating 3D Illustration + Two-line Headline + Underline */}
              <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 -mt-4 sm:-mt-6 text-center">
                {/* 3D Artwork Floating Directly on Gradient (No Box) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="mb-5 sm:mb-6 flex items-center justify-center"
                >
                  {stage === 'onboarding-1' && !art1Failed ? (
                    <div
                      className="relative w-[248px] sm:w-[296px] md:w-[320px] aspect-[1.15/1] overflow-hidden"
                      style={{
                        maskImage:
                          'radial-gradient(ellipse 78% 76% at 50% 50%, #000 62%, transparent 98%)',
                        WebkitMaskImage:
                          'radial-gradient(ellipse 78% 76% at 50% 50%, #000 62%, transparent 98%)'
                      }}
                    >
                      <img
                        src={ONBOARDING_1_ARTWORK_URL}
                        alt="Prepare for Govt Exams - Mock Tests and Practice Tests"
                        onError={() => setArt1Failed(true)}
                        referrerPolicy="no-referrer"
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: 0,
                          width: '138%',
                          maxWidth: 'none',
                          height: 'auto',
                          transform: 'translate(-50%, -23.2%)',
                          pointerEvents: 'none'
                        }}
                      />
                    </div>
                  ) : stage === 'onboarding-2' && !art2Failed ? (
                    <div
                      className="relative w-[256px] sm:w-[304px] md:w-[328px] aspect-[1.22/1] overflow-hidden"
                      style={{
                        maskImage:
                          'radial-gradient(ellipse 76% 74% at 50% 50%, #000 58%, transparent 96%)',
                        WebkitMaskImage:
                          'radial-gradient(ellipse 76% 74% at 50% 50%, #000 58%, transparent 96%)'
                      }}
                    >
                      <img
                        src={jobBannerArtwork}
                        alt="Government Job Notifications and Exam Alerts"
                        onError={() => setArt2Failed(true)}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-[76%_50%] pointer-events-none"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center">
                      {stage === 'onboarding-1' ? (
                        <BookOpen className="w-24 h-24 text-[#F9B822]" />
                      ) : (
                        <Bell className="w-24 h-24 text-[#F9B822]" />
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Two-Line Centered Headline + Half-Gold/Half-White Curved Underline */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center"
                >
                  <h2 className="font-heading font-extrabold text-[30px] sm:text-[38px] leading-[1.12] tracking-tight">
                    <span className="block text-white">{activeSlide.line1}</span>
                    <span className="block text-[#F9B822]">{activeSlide.line2}</span>
                  </h2>

                  {/* Curved dual-tone swash underline (Gold left half, White right half) */}
                  <svg
                    className="mt-2.5 w-[108px] sm:w-[126px] h-[10px] overflow-visible"
                    viewBox="0 0 120 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="eqhSwashGrad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#F9B822" />
                        <stop offset="54%" stopColor="#F9B822" />
                        <stop offset="56%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#FFFFFF" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M3 6.5C38 2.5 82 2.5 117 6.0"
                      stroke="url(#eqhSwashGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </svg>

                  {/* Quiet single-line subtitle */}
                  <p className="mt-3 text-xs sm:text-sm font-medium text-[#EAF2FF] max-w-xs sm:max-w-md drop-shadow-2xs">
                    {activeSlide.subtitle}
                  </p>
                </motion.div>
              </div>

              {/* Lower Controls Row: Centered Pagination Dots + Right Floating Circular Arrow Button */}
              <div className="relative z-20 w-full max-w-md sm:max-w-lg mx-auto px-6 pb-[13vh] sm:pb-[15vh] pt-4 flex items-center justify-center">
                {/* Centered Dots */}
                <div
                  className="flex items-center gap-2.5"
                  aria-label={`Onboarding screen ${activeSlide.step} of 2`}
                >
                  <button
                    type="button"
                    onClick={() => setStage('onboarding-1')}
                    aria-label="Mock Tests and Practice Tests"
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      stage === 'onboarding-1'
                        ? 'bg-[#F9B822] scale-110'
                        : 'bg-[#94A3B8]/55 hover:bg-[#64748B]/70'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setStage('onboarding-2')}
                    aria-label="Government Job Notifications and Exam Alerts"
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      stage === 'onboarding-2'
                        ? 'bg-[#F9B822] scale-110'
                        : 'bg-[#94A3B8]/55 hover:bg-[#64748B]/70'
                    }`}
                  />
                </div>

                {/* Right Circular White Arrow CTA */}
                <button
                  type="button"
                  onClick={() => {
                    if (stage === 'onboarding-1') {
                      setStage('onboarding-2');
                    } else {
                      handleFinish();
                    }
                  }}
                  aria-label={activeSlide.nextLabel}
                  className="absolute right-6 sm:right-8 w-14 h-14 rounded-full bg-white hover:bg-[#F8FAFC] text-[#1045A1] shadow-[0_10px_28px_rgba(16,69,161,0.22)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ArrowRight className="w-6 h-6 stroke-[2.4]" />
                </button>
              </div>

              {/* Bottom Flowing Decorative Waves (Sky Blue + Gold Ribbon Line + Deep Royal Blue) */}
              <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-x-0 bottom-0 z-10 w-full overflow-hidden leading-none"
              >
                <svg
                  viewBox="0 0 1440 260"
                  preserveAspectRatio="none"
                  className="w-full h-[96px] sm:h-[120px] md:h-[140px] block"
                >
                  <defs>
                    <linearGradient id="eqhSkyWave" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#D7E6FB" />
                      <stop offset="55%" stopColor="#9DBDF2" />
                      <stop offset="100%" stopColor="#7DA5E8" />
                    </linearGradient>
                    <linearGradient id="eqhDeepWave" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#5D87D6" />
                      <stop offset="40%" stopColor="#1A4FA8" />
                      <stop offset="100%" stopColor="#0D3C96" />
                    </linearGradient>
                  </defs>

                  {/* Soft sky-blue background wave */}
                  <path
                    d="M0,210 C220,120 460,115 740,175 C1030,235 1240,150 1440,115 L1440,260 L0,260 Z"
                    fill="url(#eqhSkyWave)"
                  />

                  {/* Crisp golden curved ribbon arc */}
                  <path
                    d="M420,255 C680,175 1030,55 1440,88"
                    fill="none"
                    stroke="#F9B822"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />

                  {/* Deep royal-blue foreground wave */}
                  <path
                    d="M120,260 C520,195 960,65 1440,95 L1440,260 Z"
                    fill="url(#eqhDeepWave)"
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
