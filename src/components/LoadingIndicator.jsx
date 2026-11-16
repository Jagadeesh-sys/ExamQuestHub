import React from 'react';

/**
 * Branded Loading Indicator styled with the exact Splash Screen shading merge
 * (#152164 -> #1F317B -> #3B59AA -> #AEC6EE -> #F5F8FD) and blue-to-gold bar.
 */
export default function LoadingIndicator({
  variant = 'route',
  label = 'Loading…',
  progress = null
}) {
  if (variant === 'inline') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center gap-2.5 py-6 px-4 text-center"
      >
        <div className="w-40 h-1.5 rounded-full bg-[#152164]/15 overflow-hidden">
          <div className="w-1/2 h-full rounded-full bg-gradient-to-r from-[#1045A1] via-[#2468B4] to-[#F9B822] eqh-animate-shimmer" />
        </div>
        {label && (
          <p className="text-xs font-semibold text-[#182B45]/80">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative w-full min-h-[65vh] flex flex-col items-center justify-center px-6 py-16 overflow-hidden eqh-shading-merge"
    >
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-xs gap-3.5">
        <img
          src="/assets/aistudio/examquesthub_cap_logo.png"
          alt="ExamQuest Hub"
          className="w-20 h-auto object-contain drop-shadow-[0_10px_22px_rgba(11,24,72,0.28)]"
          referrerPolicy="no-referrer"
        />

        {/* Slim Blue-to-Gold Loading Indicator Bar */}
        <div className="w-40 max-w-[48vw] h-[3.5px] rounded-full bg-white/40 overflow-hidden">
          {typeof progress === 'number' ? (
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1045A1] via-[#2468B4] to-[#F9B822] transition-[width] duration-200 ease-out"
              style={{ width: `${Math.min(100, Math.max(4, progress))}%` }}
            />
          ) : (
            <div className="w-3/5 h-full rounded-full bg-gradient-to-r from-[#1045A1] via-[#2468B4] to-[#F9B822] eqh-animate-shimmer" />
          )}
        </div>

        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}
