import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  X,
  CheckCircle,
  Share2,
  Sparkles,
  RefreshCw,
  WifiOff,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.js';

/**
 * Shared step-by-step install guide modal for iOS Safari, Android Chrome/Edge,
 * In-App Browsers (WhatsApp/Telegram/Instagram), and Desktop browsers.
 */
function InstallGuideModal({
  isOpen,
  onClose,
  isIOS,
  isAndroid,
  isInAppBrowser,
  isInstallable,
  installing,
  onNativeInstall
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-100 text-slate-800 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close install instructions"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-6">
          <img
            src="/pwa-192x192.png"
            alt="ExamQuestHub App Icon"
            className="w-12 h-12 rounded-2xl shadow-md border border-[#E3EAF2] shrink-0"
          />
          <div>
            <h3 className="text-base font-black text-[#12345A] leading-tight">
              Download ExamQuestHub App
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isIOS
                ? 'Install on iPhone & iPad'
                : isAndroid
                  ? 'Install on Android Home Screen'
                  : 'Install Fast Offline Mobile & Desktop App'}
            </p>
          </div>
        </div>

        {isInAppBrowser ? (
          <div className="space-y-3 text-xs text-slate-700 bg-amber-50 p-4 rounded-2xl border border-amber-200 mb-4">
            <p className="font-bold text-amber-900 flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 shrink-0" />
              Open in {isIOS ? 'Safari' : 'Chrome'} to Install
            </p>
            <p className="leading-relaxed">
              You are viewing inside an in-app browser. Tap the top-right menu (
              <strong>{isIOS ? 'Share / Safari icon' : '⋮ Three dots'}</strong>) and choose{' '}
              <strong>Open in {isIOS ? 'Safari' : 'Chrome'}</strong>, then tap{' '}
              <strong>Install App</strong>.
            </p>
          </div>
        ) : isIOS ? (
          <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#12345A] text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                1
              </div>
              <p className="pt-0.5">
                Tap the{' '}
                <strong className="text-slate-900 inline-flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-blue-600 inline" /> Share
                </strong>{' '}
                button at the bottom of Safari.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#12345A] text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                2
              </div>
              <p className="pt-0.5">
                Scroll down and tap <strong className="text-slate-900">Add to Home Screen</strong>.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#12345A] text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                3
              </div>
              <p className="pt-0.5">
                Tap <strong className="text-slate-900">Add</strong> in the top-right corner to launch like a native app!
              </p>
            </div>
          </div>
        ) : isAndroid ? (
          <div className="space-y-2.5 text-xs text-slate-600 mb-4">
            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#12345A] text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                  1
                </div>
                <p className="pt-0.5">
                  Tap the{' '}
                  <strong className="text-slate-900 inline-flex items-center gap-0.5">
                    <MoreVertical className="w-3.5 h-3.5 text-[#2468B4] inline" /> Menu
                  </strong>{' '}
                  in the top-right corner of Chrome / Edge.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#12345A] text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                  2
                </div>
                <p className="pt-0.5">
                  Tap <strong className="text-slate-900">Install app</strong> or{' '}
                  <strong className="text-slate-900">Add to Home screen</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#12345A] text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                  3
                </div>
                <p className="pt-0.5">
                  Tap <strong className="text-slate-900">Install</strong> — gets automatic updates & offline access!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 text-xs text-slate-600 mb-4">
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">1-tap installation with automatic app updates</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <Smartphone className="w-4 h-4 shrink-0 text-[#2468B4]" />
              <span>Works offline with cached mock tests & current affairs</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <Sparkles className="w-4 h-4 shrink-0 text-[#F2BE4F]" />
              <span>Full-screen app experience without browser clutter</span>
            </div>
          </div>
        )}

        {isInstallable ? (
          <button
            type="button"
            onClick={onNativeInstall}
            disabled={installing}
            className="w-full py-2.5 px-4 bg-[#12345A] hover:bg-[#0B1F3A] text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            <span>{installing ? 'Installing…' : 'Install ExamQuestHub Now'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#12345A] hover:bg-[#0B1F3A] text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Got It
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Floating Mobile Install Banner + Live App Update Toast + Offline Indicator.
 */
export default function PWAInstallBanner() {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isInAppBrowser,
    isOnline,
    updateAvailable,
    updating,
    install,
    applyUpdate
  } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem('eqh_pwa_banner_dismissed');
      if (isDismissed === 'true') {
        setDismissed(true);
      }
    } catch {
      // ignore storage failure
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('eqh_pwa_banner_dismissed', 'true');
    } catch {
      // ignore storage failure
    }
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

  const showUpdateBanner = updateAvailable && !updateDismissed;
  const showInstallBanner = !isInstalled && !dismissed && !showUpdateBanner;

  return (
    <>
      {/* Offline Connectivity Pill */}
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[82px] lg:bottom-4 left-3 z-[104] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-lg"
        >
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span>Offline Mode</span>
        </div>
      )}

      {/* App Update Available Banner (takes priority so mobile installed apps always stay fresh) */}
      {showUpdateBanner && (
        <aside
          aria-label="App update available"
          className="fixed bottom-[78px] lg:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-[106] bg-gradient-to-r from-[#0B1F3A] to-[#1D4A8A] text-white p-3.5 rounded-2xl shadow-2xl border border-[#F2BE4F]/40 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom duration-300"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/pwa-192x192.png"
              alt="ExamQuestHub App Icon"
              className="w-10 h-10 rounded-xl shadow-md border border-white/20 object-cover bg-white shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate">App Update Ready</p>
              <p className="text-[10.5px] text-slate-200 truncate">
                Tap Update for the latest version & news
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={applyUpdate}
              disabled={updating}
              className="flex items-center gap-1.5 bg-[#F2BE4F] hover:bg-[#e0ac39] text-[#0B1F3A] px-3 py-1.5 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${updating ? 'animate-spin' : ''}`} />
              <span>{updating ? 'Updating…' : 'Update'}</span>
            </button>
            <button
              type="button"
              onClick={() => setUpdateDismissed(true)}
              aria-label="Dismiss update banner"
              className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Mobile & Tablet Bottom Install Bar */}
      {showInstallBanner && (
        <aside
          aria-label="App installation banner"
          className="fixed bottom-[78px] lg:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-[105] bg-gradient-to-r from-[#0B1F3A] to-[#12345A] text-white p-3.5 rounded-2xl shadow-2xl border border-white/15 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom duration-300"
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
                {isAndroid
                  ? 'Download App • Fast, Offline & Free'
                  : 'Install on your phone for instant access'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={installing}
              className="flex items-center gap-1.5 bg-[#F2BE4F] hover:bg-[#e0ac39] text-[#0B1F3A] px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{installing ? 'Installing…' : 'Install'}</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      <InstallGuideModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isIOS={isIOS}
        isAndroid={isAndroid}
        isInAppBrowser={isInAppBrowser}
        isInstallable={isInstallable}
        installing={installing}
        onNativeInstall={handleInstallClick}
      />
    </>
  );
}

/**
 * Install / Update App Button for Header, Mobile Top Bar, or Drawer Navigation.
 */
export function PWAInstallButton({ className = '', compact = false }) {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isInAppBrowser,
    updateAvailable,
    updating,
    install,
    applyUpdate
  } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installing, setInstalling] = useState(false);

  // When already installed, hide unless an app update is ready
  if (isInstalled && !updateAvailable) return null;

  const handleAction = async () => {
    if (updateAvailable) {
      await applyUpdate();
      return;
    }
    if (isInstallable) {
      setInstalling(true);
      const ok = await install();
      setInstalling(false);
      if (ok) setShowGuideModal(false);
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={handleAction}
          disabled={installing || updating}
          className={`flex items-center justify-center gap-1 h-7 px-2 min-[400px]:px-2.5 rounded-full font-black text-[10.5px] transition-all active:scale-95 cursor-pointer shrink-0 ${className}`}
          title={updateAvailable ? 'Update ExamQuestHub App' : 'Download ExamQuestHub App'}
          aria-label={updateAvailable ? 'Update ExamQuestHub App' : 'Download ExamQuestHub App'}
        >
          {updateAvailable ? (
            <>
              <RefreshCw className={`w-3.5 h-3.5 ${updating ? 'animate-spin' : ''}`} />
              <span>Update</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span className="hidden min-[400px]:inline">App</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleAction}
          disabled={installing || updating}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer ${className}`}
          title={updateAvailable ? 'Update ExamQuestHub App' : 'Install ExamQuestHub App on your device'}
        >
          {updateAvailable ? (
            <>
              <RefreshCw className={`w-3.5 h-3.5 ${updating ? 'animate-spin' : ''}`} />
              <span>{updating ? 'Updating…' : 'Update App'}</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-[#F2BE4F]" />
              <span>{installing ? 'Installing…' : 'Install App'}</span>
            </>
          )}
        </button>
      )}

      <InstallGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        isIOS={isIOS}
        isAndroid={isAndroid}
        isInAppBrowser={isInAppBrowser}
        isInstallable={isInstallable}
        installing={installing}
        onNativeInstall={handleAction}
      />
    </>
  );
}
