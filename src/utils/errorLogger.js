/**
 * ExamQuestHub Centralized Error Logging & Diagnostics Service
 * Captures, sanitizes, and categorizes runtime errors (React, Firebase, Auth, Network, Routing)
 * without exposing sensitive user tokens, passwords, or credentials.
 */

const MAX_LOGS = 50;
const STORAGE_KEY = 'eqh_error_logs_v1';

let inMemoryLogs = [];
const logSubscribers = new Set();

// Safely retrieve stored logs from sessionStorage
try {
  const saved = typeof window !== 'undefined' ? window.sessionStorage?.getItem(STORAGE_KEY) : null;
  if (saved) {
    inMemoryLogs = JSON.parse(saved);
  }
} catch {
  // Session storage unavailable or restricted (private mode)
  inMemoryLogs = [];
}

// Device & Browser Information Detection
export function getDeviceInfo() {
  if (typeof window === 'undefined' || !navigator) {
    return { platform: 'Unknown', isMobile: false, browser: 'Unknown', screen: 'Unknown' };
  }

  const ua = navigator.userAgent || '';
  const isMobile = /Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /(iPad|Tablet|(Android(?!.*Mobile)))/i.test(ua);
  
  let browser = 'Other';
  if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';

  let os = 'Unknown OS';
  if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Win/i.test(ua)) os = 'Windows';
  else if (/Mac/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  return {
    os,
    browser,
    isMobile,
    isTablet,
    screen: `${window.innerWidth}x${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio || 1,
    online: navigator.onLine !== false
  };
}

// Sanitize string to remove any API keys, tokens, or password parameters
function sanitizeMessage(str) {
  if (!str) return '';
  return String(str)
    .replace(/(apiKey|password|token|bearer|key)=([a-zA-Z0-9_\-.]+)/gi, '$1=[REDACTED]')
    .replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_API_KEY]');
}

/**
 * Log an error into the centralized store
 */
export function logAppError({
  category = 'General', // 'React' | 'Firebase' | 'Firestore' | 'Auth' | 'Network' | 'Routing'
  message = '',
  component = 'Unknown',
  stack = '',
  metadata = {}
}) {
  const deviceInfo = getDeviceInfo();
  const entry = {
    id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    category,
    message: sanitizeMessage(message),
    component,
    stack: sanitizeMessage(stack).slice(0, 1000),
    device: `${deviceInfo.os} • ${deviceInfo.browser} (${deviceInfo.screen})`,
    online: deviceInfo.online,
    metadata: typeof metadata === 'object' ? JSON.parse(JSON.stringify(metadata)) : {}
  };

  inMemoryLogs.unshift(entry);
  if (inMemoryLogs.length > MAX_LOGS) {
    inMemoryLogs = inMemoryLogs.slice(0, MAX_LOGS);
  }

  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryLogs));
    }
  } catch {
    // Ignore storage quota error
  }

  // Notify active listeners (e.g., admin dashboard diagnostics tab)
  logSubscribers.forEach((cb) => {
    try {
      cb(entry, inMemoryLogs);
    } catch (e) {
      console.warn('Error in log subscriber callback', e);
    }
  });

  return entry;
}

export function getErrorLogs() {
  return [...inMemoryLogs];
}

export function clearErrorLogs() {
  inMemoryLogs = [];
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
  logSubscribers.forEach((cb) => cb(null, []));
}

export function subscribeToErrorLogs(callback) {
  logSubscribers.add(callback);
  return () => logSubscribers.delete(callback);
}

// Global browser window error listeners for uncaught errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logAppError({
      category: 'JavaScript',
      message: event.message || 'Uncaught window error',
      component: event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : 'Window',
      stack: event.error?.stack || ''
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason instanceof Error ? reason.message : String(reason);
    logAppError({
      category: 'UnhandledPromise',
      message: msg || 'Unhandled promise rejection',
      component: 'Promise',
      stack: reason instanceof Error ? reason.stack : ''
    });
  });
}
