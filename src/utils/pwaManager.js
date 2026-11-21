import { registerSW } from 'virtual:pwa-register';

function detectInstalledState() {
  if (typeof window === 'undefined') return false;
  try {
    const isStandaloneMedia =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.matchMedia('(display-mode: window-controls-overlay)').matches;
    const isIOSStandalone = window.navigator.standalone === true;
    const isAndroidTWA = document.referrer.includes('android-app://');
    return isStandaloneMedia || isIOSStandalone || isAndroidTWA;
  } catch {
    return false;
  }
}

function detectPlatform() {
  if (typeof window === 'undefined' || !window.navigator) {
    return { isIOS: false, isAndroid: false, isInAppBrowser: false };
  }
  const ua = window.navigator.userAgent || '';
  const lower = ua.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(lower) || (lower.includes('macintosh') && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(lower);
  const isInAppBrowser =
    /fban|fbav|instagram|whatsapp|telegram|line\/|micromessenger|wv\)/.test(lower) ||
    (isAndroid && /; wv\)/.test(lower));
  return { isIOS, isAndroid, isInAppBrowser };
}

function isInsideMockEngine() {
  if (typeof window === 'undefined') return false;
  const p = window.location.pathname || '';
  return p.startsWith('/mocks/') && !p.startsWith('/mocks/category') && !p.startsWith('/mocks/series');
}

const platform = detectPlatform();

const state = {
  deferredPrompt: typeof window !== 'undefined' ? window.__EQH_PWA_PROMPT || null : null,
  isInstalled: detectInstalledState(),
  isIOS: platform.isIOS,
  isAndroid: platform.isAndroid,
  isInAppBrowser: platform.isInAppBrowser,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  updateAvailable: false,
  updating: false,
  checkingUpdate: false
};

const listeners = new Set();
let initialized = false;
let swRegistration = null;
let updateSWFn = null;
let isReloadingForUpdate = false;

function notify() {
  const snapshot = getPWASnapshot();
  listeners.forEach((cb) => {
    try {
      cb(snapshot);
    } catch {
      // ignore subscriber failure
    }
  });
}

export function getPWASnapshot() {
  return {
    isInstallable: !!state.deferredPrompt,
    isInstalled: state.isInstalled,
    isIOS: state.isIOS,
    isAndroid: state.isAndroid,
    isInAppBrowser: state.isInAppBrowser,
    isOnline: state.isOnline,
    updateAvailable: state.updateAvailable,
    updating: state.updating,
    checkingUpdate: state.checkingUpdate,
    deferredPrompt: state.deferredPrompt
  };
}

export function subscribePWA(listener) {
  initPWAManager();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function triggerPWAInstall() {
  const promptEvent = state.deferredPrompt || (typeof window !== 'undefined' ? window.__EQH_PWA_PROMPT : null);
  if (!promptEvent) return false;
  try {
    await promptEvent.prompt();
    const choiceResult = await promptEvent.userChoice;
    if (choiceResult && choiceResult.outcome === 'accepted') {
      state.isInstalled = true;
      state.deferredPrompt = null;
      if (typeof window !== 'undefined') window.__EQH_PWA_PROMPT = null;
      notify();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function applyPWAUpdate() {
  if (isReloadingForUpdate) return;
  state.updating = true;
  notify();

  try {
    if (typeof updateSWFn === 'function') {
      await updateSWFn(true);
    } else if (swRegistration?.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  } catch {
    // fallback reload below
  }

  if (!isReloadingForUpdate && typeof window !== 'undefined') {
    isReloadingForUpdate = true;
    window.location.reload();
  }
}

export async function checkForPWAUpdate() {
  if (!swRegistration || state.checkingUpdate) return false;
  state.checkingUpdate = true;
  notify();
  try {
    await swRegistration.update();
    if (swRegistration.waiting) {
      state.updateAvailable = true;
    }
    return state.updateAvailable;
  } catch {
    return false;
  } finally {
    state.checkingUpdate = false;
    notify();
  }
}

export function initPWAManager() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  // Sync any early prompt captured before React booted
  if (window.__EQH_PWA_PROMPT && !state.deferredPrompt) {
    state.deferredPrompt = window.__EQH_PWA_PROMPT;
  }

  const syncPromptFromWindow = () => {
    state.deferredPrompt = window.__EQH_PWA_PROMPT || null;
    notify();
  };

  const handleBeforeInstallPrompt = (e) => {
    e.preventDefault();
    window.__EQH_PWA_PROMPT = e;
    state.deferredPrompt = e;
    notify();
  };

  const handleAppInstalled = () => {
    window.__EQH_PWA_PROMPT = null;
    state.deferredPrompt = null;
    state.isInstalled = true;
    notify();
  };

  const handleOnline = () => {
    state.isOnline = true;
    notify();
    swRegistration?.update?.().catch(() => {});
  };

  const handleOffline = () => {
    state.isOnline = false;
    notify();
  };

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.addEventListener('eqh:pwa-prompt-ready', syncPromptFromWindow);
  window.addEventListener('appinstalled', handleAppInstalled);
  window.addEventListener('eqh:pwa-installed', handleAppInstalled);
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  try {
    const mq = window.matchMedia('(display-mode: standalone)');
    const onDisplayChange = () => {
      state.isInstalled = detectInstalledState();
      notify();
    };
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onDisplayChange);
    }
  } catch {
    // ignore older Safari matchMedia
  }

  // Register Service Worker & background update checker for installed mobile/desktop apps
  if ('serviceWorker' in navigator) {
    let hadController = !!navigator.serviceWorker.controller;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) {
        hadController = true;
        return;
      }
      state.updateAvailable = true;
      notify();
      // Auto-apply update seamlessly unless student is mid-exam in MockTestEnginePage
      if (!isInsideMockEngine() && !isReloadingForUpdate) {
        isReloadingForUpdate = true;
        window.location.reload();
      }
    });

    try {
      updateSWFn = registerSW({
        immediate: true,
        onNeedRefresh() {
          state.updateAvailable = true;
          notify();
        },
        onOfflineReady() {
          notify();
        },
        onRegisteredSW(_swUrl, registration) {
          if (!registration) return;
          swRegistration = registration;
          if (registration.waiting) {
            state.updateAvailable = true;
            notify();
          }

          // Check for updates every 15 minutes while app stays open
          window.setInterval(() => {
            if (navigator.onLine) {
              registration.update().catch(() => {});
            }
          }, 15 * 60 * 1000);

          // Check immediately whenever mobile user re-opens or returns to the installed app
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && navigator.onLine) {
              registration.update().catch(() => {});
            }
          });
        },
        onRegisterError() {
          // ignore SW registration failure in restricted environments
        }
      });
    } catch {
      // ignore if virtual:pwa-register is stubbed
    }
  }
}
