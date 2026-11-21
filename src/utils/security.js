/**
 * ExamQuestHub Security & Input Sanitization Utilities
 * Blocks unsafe URL schemes (javascript:, vbscript:, data:text/html, data:image/svg+xml),
 * protocol-relative open redirects (//...), and JSON prototype-pollution keys.
 */

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const MAX_INLINE_DATA_URI_CHARS = 950000;

function stripControlChars(raw) {
  return String(raw || '').replace(/[\u0000-\u001F\u007F]/g, '').trim();
}

/**
 * Validates and sanitizes navigation/external href links.
 * Permits only https://, http://, or single-leading-slash relative routes (/...).
 */
export function sanitizeExternalUrl(url, fallback = '#') {
  if (typeof url !== 'string') return fallback;
  const cleaned = stripControlChars(url);
  if (!cleaned || cleaned.length > 2048) return fallback;

  // Allow safe internal path routes (/jobs/123) while blocking protocol-relative redirects (//evil.com)
  if (cleaned.startsWith('/') && !cleaned.startsWith('//')) {
    return cleaned;
  }

  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

/**
 * Validates and sanitizes downloadable document/PDF links.
 * Permits https://, http://, single-slash local assets, and base64 PDF data URIs.
 */
export function sanitizeDocumentUrl(url, fallback = '#') {
  if (typeof url !== 'string') return fallback;
  const cleaned = stripControlChars(url);
  if (!cleaned) return fallback;

  if (/^data:application\/pdf;base64,[A-Za-z0-9+/=]+$/i.test(cleaned)) {
    return cleaned.length <= MAX_INLINE_DATA_URI_CHARS ? cleaned : fallback;
  }

  return sanitizeExternalUrl(cleaned, fallback);
}

/**
 * Validates and sanitizes image/media URLs.
 * Permits https://, http://, single-slash local assets, and raster base64 images (blocks SVG scripts).
 */
export function sanitizeMediaUrl(url, fallback = '') {
  if (typeof url !== 'string') return fallback;
  const cleaned = stripControlChars(url);
  if (!cleaned) return fallback;

  if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(cleaned)) {
    return cleaned.length <= MAX_INLINE_DATA_URI_CHARS ? cleaned : fallback;
  }

  return sanitizeExternalUrl(cleaned, fallback);
}

/**
 * Recursively strips prototype-pollution keys (__proto__, constructor, prototype)
 * from untrusted parsed JSON or storage objects.
 */
export function stripDangerousKeys(value, depth = 0) {
  if (depth > 25 || value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => stripDangerousKeys(item, depth + 1));
  }
  const clean = {};
  for (const [key, nested] of Object.entries(value)) {
    if (DANGEROUS_KEYS.has(key)) continue;
    clean[key] = stripDangerousKeys(nested, depth + 1);
  }
  return clean;
}

/**
 * Safely parses JSON strings while stripping prototype-pollution keys and capping max payload size.
 */
export function safeJsonParse(raw, fallback = null, maxBytes = 6 * 1024 * 1024) {
  if (typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > maxBytes) return fallback;
  try {
    const parsed = JSON.parse(trimmed, (key, val) => (DANGEROUS_KEYS.has(key) ? undefined : val));
    return stripDangerousKeys(parsed);
  } catch {
    return fallback;
  }
}
