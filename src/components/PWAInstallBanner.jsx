import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle, Share2, Sparkles, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.js';

/**
 * PWA & Google Play Store Install Banner / Modal component.
 * Provides 1-click home screen install for Android & desktop Chrome/Edge,
 * plus guided installation for iOS Safari, and Play Store TWA readiness.
 */
export default function PWAInstallBanner() {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('eqh_pwa_banner_dismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('eqh_pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      const success = await install();
      setInstalling(false);
      if (success) {
        setShowModal(false);
      }
    } else {
      setShowModal(true);
    }
  };

  // If already running standalone as an installed app, don't show the banner
  if (isInstalled || dismissed) {
    return null;
  }

  return (
    <>
      {/* Mobile & Tablet Bottom Install Bar */}
      <aside
        aria-label="App installation banner"
        className="fixed bottom-[60px] lg:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-[105] bg-gradient-to-r from-[#0B1F3A] to-[#12345A] text-white p-3.5 rounded-2xl shadow-2xl border border-white/15 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src="/pwa-192x192.png"
              alt="ExamQuestHub App Icon"
              className="w-11 h-11 rounded-xl shadow-md border border-white/20 object-cover bg-white"
            />
            <span className="absolute -bottom-1 -right-1 bg-[#F2BE4F] text-[#0B1F3A] text-[9px] font-black px-1 rounded-sm shadow-xs">
              APP
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-black text-white truncate tracking-tight">
                ExamQuestHub App
              </span>
              <span className="hidden xs:inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.2 rounded-full">
                ★ 4.9
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">
              {isAndroid ? 'Play Store & Offline Ready • Fast & Free' : 'Install on your device for instant access'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            disabled={installing}
            className="flex items-center gap-1.5 bg-[#F2BE4F] hover:bg-[#e0ac39] text-[#0B1F3A] px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{installing ? 'Installing…' : 'Install'}</span>
          </button>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Educational / iOS / Manual Install Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-100 text-slate-800 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src="/pwa-192x192.png"
                alt="ExamQuestHub App Icon"
                className="w-12 h-12 rounded-2xl shadow-md border border-[#E3EAF2]"
              />
              <div>
                <h3 className="text-base font-black text-[#12345A] leading-tight">
                  Install ExamQuestHub
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {isIOS ? 'Install on iPhone & iPad' : 'Google Play & Android Mobile App'}
                </p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#12345A] text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                    1
                  </div>
                  <p>
                    Tap the <strong className="text-slate-900 inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-blue-600 inline" /> Share</strong> icon at the bottom of Safari.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#12345A] text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                    2
                  </div>
                  <p>
                    Scroll down and tap <strong className="text-slate-900">Add to Home Screen</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#12345A] text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                    3
                  </div>
                  <p>
                    Tap <strong className="text-slate-900">Add</strong> in the top-right corner to launch like a native app!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-semibold">Fast 1-tap installation with zero store wait</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                  <Smartphone className="w-4 h-4 shrink-0 text-[#2468B4]" />
                  <span>Works offline with cached exams & questions</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#F2BE4F]" />
                  <span>Full screen experience without browser address bar</span>
                </div>
              </div>
            )}

            {isInstallable ? (
              <button
                onClick={async () => {
                  setInstalling(true);
                  const ok = await install();
                  setInstalling(false);
                  if (ok) setShowModal(false);
                }}
                disabled={installing}
                className="w-full py-2.5 px-4 bg-[#12345A] hover:bg-[#0B1F3A] text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{installing ? 'Installing…' : 'Install ExamQuestHub Now'}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Got It
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Compact Install App Button for Header or Navigation
 */
export function PWAInstallButton({ className = '' }) {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (isInstallable) {
            install();
          } else {
            setShowIOSModal(true);
          }
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer ${className}`}
        title="Install ExamQuestHub App on your device"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#F2BE4F]" />
        <span>Install App</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-100 text-slate-800 relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black text-[#12345A] mb-1">
              Install ExamQuestHub App
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {isIOS
                ? 'Follow these quick steps on your iPhone/iPad Safari:'
                : 'Add to your phone or desktop home screen for one-tap native access:'}
            </p>
            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
              {isIOS ? (
                <>
                  <p>1. Tap the <strong>Share</strong> button in Safari toolbar.</p>
                  <p>2. Choose <strong>Add to Home Screen</strong>.</p>
                  <p>3. Tap <strong>Add</strong> to complete.</p>
                </>
              ) : (
                <>
                  <p>1. Open browser settings or menu (three dots in Chrome/Edge).</p>
                  <p>2. Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
                  <p>3. Enjoy fast offline-ready exam preparation!</p>
                </>
              )}
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-[#12345A] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
