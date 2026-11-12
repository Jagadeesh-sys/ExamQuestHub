/**
 * Automatic Job Application Status System & Date Rules.
 *
 * Implements the ExamQuestHub dynamic status lifecycle:
 *   - UPCOMING: Current IST date is before application start date.
 *   - OPEN: Current IST date is between application start date and application last date (inclusive in IST).
 *   - CLOSED: Current IST date is after application last date.
 *   - DATE NOT AVAILABLE / NEEDS VERIFICATION: Missing or malformed dates.
 *
 * All dates are consistently evaluated in Indian Standard Time (Asia/Kolkata, UTC+05:30).
 *
 * This module is pure JavaScript without React/JSX dependencies so build-time SEO
 * scripts and runtime client code can share the exact same calculation.
 */

export const STATUS_UPCOMING = 'UPCOMING';
export const STATUS_OPEN = 'OPEN';
export const STATUS_CLOSED = 'CLOSED';
export const STATUS_DATE_NOT_ANNOUNCED = 'DATE NOT ANNOUNCED';
export const STATUS_DATE_NOT_AVAILABLE = 'DATE NOT ANNOUNCED';
export const STATUS_NEEDS_VERIFICATION = 'NEEDS VERIFICATION';

// Backward compatibility constants
export const CLOSED_STATUS = STATUS_CLOSED;
export const AUTO_CLOSED_FLAG = 'statusAutoClosed';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTH_LOOKUP = {
  jan: '01', january: '01',
  feb: '02', february: '02',
  mar: '03', march: '03',
  apr: '04', april: '04',
  may: '05', may: '05',
  jun: '06', june: '06',
  jul: '07', july: '07',
  aug: '08', august: '08',
  sep: '09', september: '09',
  oct: '10', october: '10',
  nov: '11', november: '11',
  dec: '12', december: '12'
};

/**
 * Format a Date object as `YYYY-MM-DD` in Indian Standard Time (Asia/Kolkata).
 */
export function formatDateIST(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date);
  } catch {
    // Fallback if Intl timeZone is unsupported
    const utcTime = date.getTime();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcTime + istOffsetMs);
    const y = istDate.getUTCFullYear();
    const m = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const d = String(istDate.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

/**
 * Returns today's calendar date as `YYYY-MM-DD` in Indian Standard Time (Asia/Kolkata).
 */
export function getTodayIST(now = new Date()) {
  const d = now instanceof Date ? now : new Date(now);
  if (Number.isNaN(d.getTime())) return '';
  return formatDateIST(d);
}

/** Legacy alias */
export function todayDateOnly(now = new Date()) {
  return getTodayIST(now);
}

/**
 * Normalizes any date value (string, Date, Firestore Timestamp) into a strict `YYYY-MM-DD`
 * string without any UTC timezone conversion shift.
 */
export function normalizeDateIST(value) {
  if (!value) return '';

  // Firestore Timestamp with toDate()
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return formatDateIST(value.toDate());
  }

  // Native Date instance
  if (value instanceof Date) {
    return formatDateIST(value);
  }

  const raw = String(value).trim();
  if (!raw) return '';

  // 1. Standard ISO format: YYYY-MM-DD (take calendar components directly to avoid timezone shift)
  const ymdMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymdMatch) {
    const y = parseInt(ymdMatch[1], 10);
    const m = parseInt(ymdMatch[2], 10);
    const d = parseInt(ymdMatch[3], 10);
    if (y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${ymdMatch[1]}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
  }

  // 2. Indian date format: DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = raw.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10);
    const y = parseInt(dmyMatch[3], 10);
    if (y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
  }

  // 3. DD Month YYYY (e.g., 15 November 2026 or 15 Nov 2026)
  const dMonthYMatch = raw.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
  if (dMonthYMatch) {
    const d = parseInt(dMonthYMatch[1], 10);
    const mKey = dMonthYMatch[2].toLowerCase();
    const m = MONTH_LOOKUP[mKey];
    const y = parseInt(dMonthYMatch[3], 10);
    if (m && y >= 1900 && y <= 2100 && d >= 1 && d <= 31) {
      return `${y}-${m}-${String(d).padStart(2, '0')}`;
    }
  }

  // 4. Month DD, YYYY (e.g., November 15, 2026 or Nov 15 2026)
  const monthDYMatch = raw.match(/^([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (monthDYMatch) {
    const mKey = monthDYMatch[1].toLowerCase();
    const m = MONTH_LOOKUP[mKey];
    const d = parseInt(monthDYMatch[2], 10);
    const y = parseInt(monthDYMatch[3], 10);
    if (m && y >= 1900 && y <= 2100 && d >= 1 && d <= 31) {
      return `${y}-${m}-${String(d).padStart(2, '0')}`;
    }
  }

  // Fallback parser for standard Date strings
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return formatDateIST(parsed);
  }

  return '';
}

/** Legacy alias */
export function toDateOnly(value) {
  return normalizeDateIST(value);
}

/**
 * Extracts the Application Start Date from an item supporting all legacy field names.
 */
export function getApplicationStartDate(item) {
  if (!item || typeof item !== 'object') return '';
  return (
    item.applicationStartDate ||
    item.openingDate ||
    item.startDate ||
    item.applicationStart ||
    item.start_date ||
    item.applyStartDate ||
    ''
  );
}

/**
 * Extracts the Application Last Date / Deadline from an item supporting all legacy field names.
 */
export function getApplicationLastDate(item) {
  if (!item || typeof item !== 'object') return '';
  return (
    item.applicationLastDate ||
    item.deadline ||
    item.lastDate ||
    item.applicationDeadline ||
    item.closingDate ||
    item.last_date ||
    item.applyEndDate ||
    ''
  );
}

/**
 * Reusable core status calculation function.
 *
 * Rules:
 * - If current date is before application start date -> UPCOMING
 * - If current date is between application start date and application last date, inclusive -> OPEN
 * - If current date is after application last date -> CLOSED
 * - Evaluated strictly in Indian Standard Time (Asia/Kolkata).
 * - Start date is inclusive (becomes OPEN at 00:00:00 IST on start date).
 * - Last date remains OPEN throughout the entire day in IST (becomes CLOSED at 00:00:00 IST the next day).
 * - If dates are missing or invalid, returns DATE NOT AVAILABLE or NEEDS VERIFICATION.
 */
export function calculateJobStatus(startRaw, lastRaw, now = new Date()) {
  const start = normalizeDateIST(startRaw);
  const last = normalizeDateIST(lastRaw);
  const today = getTodayIST(now);

  // Missing either start date or deadline
  if (!start || !last) {
    return STATUS_DATE_NOT_ANNOUNCED;
  }

  // Invalid date range (start date occurs after deadline)
  if (start > last) {
    return STATUS_NEEDS_VERIFICATION;
  }

  // Exact requested priority:
  // IF currentDate < applicationStartDate: status = UPCOMING
  if (today < start) {
    return STATUS_UPCOMING;
  }

  // ELSE IF currentDate <= applicationLastDate: status = OPEN
  // (Remains OPEN throughout the closing date until 23:59:59 IST)
  if (today <= last) {
    return STATUS_OPEN;
  }

  // ELSE: status = CLOSED
  return STATUS_CLOSED;
}

/**
 * Checks if the deadline for an application has passed in IST.
 */
export function hasDeadlinePassed(deadline, now = new Date()) {
  const lastDate = normalizeDateIST(deadline);
  if (!lastDate) return false;
  return getTodayIST(now) > lastDate;
}

/**
 * Determines the live effective status of an item.
 *
 * Never relies on a stale manually-stored status for job notifications.
 * Evaluates Application Start Date and Application Last Date dynamically.
 */
export function getEffectiveStatus(item, now = new Date()) {
  if (!item || typeof item !== 'object') return '';

  const rawStatus = String(item.status || '').trim();
  const normalizedRaw = rawStatus.toLowerCase();

  // Explicit Draft items remain Draft in the admin view
  if (normalizedRaw === 'draft' || item.isDraft || item.published === false) {
    return 'Draft';
  }

  // Items explicitly categorized as non-job updates (e.g. Admit Cards or Results)
  if (item.type === 'admit-card' || normalizedRaw.includes('admit')) {
    return 'Admit Card Released';
  }
  if (item.type === 'result' || normalizedRaw.includes('result')) {
    return 'Result Released';
  }

  const startDateRaw = getApplicationStartDate(item);
  const lastDateRaw = getApplicationLastDate(item);

  // If application start date and last date are present, calculate dynamically
  if (startDateRaw && lastDateRaw) {
    return calculateJobStatus(startDateRaw, lastDateRaw, now);
  }

  // If either application start date or last date is missing, do NOT classify as OPEN:
  return STATUS_DATE_NOT_ANNOUNCED;
}

/**
 * Returns a cloned item with the dynamically calculated effective status.
 */
export function withEffectiveStatus(item, now = new Date()) {
  if (!item || typeof item !== 'object') return item;

  const effectiveStatus = getEffectiveStatus(item, now);
  const autoClosed = effectiveStatus === STATUS_CLOSED && item.status !== STATUS_CLOSED;

  return {
    ...item,
    status: effectiveStatus,
    [AUTO_CLOSED_FLAG]: autoClosed
  };
}

/**
 * Applies withEffectiveStatus across an entire array of items.
 */
export function withEffectiveStatusList(items, now = new Date()) {
  if (!Array.isArray(items)) return items;
  return items.map((item) => withEffectiveStatus(item, now));
}

/**
 * Convenience helpers for status checks
 */
export function isJobOpen(item, now = new Date()) {
  const status = typeof item === 'string' ? item : getEffectiveStatus(item, now);
  const s = String(status).trim().toLowerCase();
  return s === 'open' || s === 'application open' || s === 'applications open';
}

export function isJobUpcoming(item, now = new Date()) {
  const status = typeof item === 'string' ? item : getEffectiveStatus(item, now);
  const s = String(status).trim().toLowerCase();
  return s === 'upcoming';
}

export function isJobClosed(item, now = new Date()) {
  const status = typeof item === 'string' ? item : getEffectiveStatus(item, now);
  const s = String(status).trim().toLowerCase();
  return s === 'closed' || s === 'application closed';
}

/**
 * Formats a `YYYY-MM-DD` or other date string into a user-friendly display date (e.g., '15 Nov 2026').
 */
export function formatDisplayDate(value) {
  const normalized = normalizeDateIST(value);
  if (!normalized) return String(value || '');

  const parts = normalized.split('-');
  if (parts.length === 3) {
    const y = parts[0];
    const mIdx = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (mIdx >= 0 && mIdx < 12) {
      return `${d} ${MONTH_NAMES[mIdx]} ${y}`;
    }
  }

  return normalized;
}
