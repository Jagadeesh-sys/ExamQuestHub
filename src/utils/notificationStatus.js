/**
 * Notification date rules, shared by the running app and the SEO build script.
 *
 * A notification whose last date has already gone by is reported as closed even
 * when the stored record still says "Applications Open", so the badge stays
 * accurate without an admin having to edit it after every deadline. Later
 * stages ("Admit Card Released", "Result Released") are left alone, because the
 * application window closing does not invalidate published results.
 *
 * This module has no imports on purpose: the build-time SEO script loads it
 * directly, so it must stay free of React and icon dependencies.
 */

export const CLOSED_STATUS = 'Closed';

/** Stored statuses that stop being true once the last date has passed. */
const CLOSABLE_STATUSES = ['applications open', 'closing soon'];

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Normalises any date value to a `YYYY-MM-DD` string, or '' when it is not a
 * usable date. Local calendar components are used rather than `toISOString()`
 * so a date never shifts a day because of the timezone offset.
 */
export function toDateOnly(value) {
  if (!value) return '';

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? '' : formatLocalDate(value);
  }

  const raw = String(value).trim();

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? '' : formatLocalDate(parsed);
}

/** Today as `YYYY-MM-DD` in the visitor's own timezone. */
export function todayDateOnly(now = new Date()) {
  return formatLocalDate(now);
}

/** True when `deadline` is a real date that is already behind us. */
export function hasDeadlinePassed(deadline, now = new Date()) {
  const lastDate = toDateOnly(deadline);
  if (!lastDate) return false;
  return lastDate < todayDateOnly(now);
}

/** The status a visitor should see for this notification, right now. */
export function getEffectiveStatus(item, now = new Date()) {
  const status = String(item?.status || '').trim();
  if (!status) return status;

  const normalized = status.toLowerCase();
  if (!CLOSABLE_STATUSES.some((candidate) => normalized.includes(candidate))) {
    return status;
  }

  return hasDeadlinePassed(item?.deadline, now) ? CLOSED_STATUS : status;
}

/**
 * Flag put on a notification whose status was only worked out from a passed
 * deadline, so saving it back can tell a derived "Closed" apart from a
 * deliberate one.
 */
export const AUTO_CLOSED_FLAG = 'statusAutoClosed';

/** Returns the item unchanged when its status needs no correction. */
export function withEffectiveStatus(item, now = new Date()) {
  if (!item || typeof item !== 'object') return item;

  const status = getEffectiveStatus(item, now);
  const autoClosed = status !== item.status && status === CLOSED_STATUS;

  if (!autoClosed && item[AUTO_CLOSED_FLAG] !== true) return item;

  return { ...item, status, [AUTO_CLOSED_FLAG]: autoClosed };
}

export function withEffectiveStatusList(items, now = new Date()) {
  if (!Array.isArray(items)) return items;
  return items.map((item) => withEffectiveStatus(item, now));
}
