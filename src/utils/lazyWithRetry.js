import { lazy } from 'react';

/**
 * `React.lazy` that recovers from stale chunks after a deployment.
 *
 * Vercel only keeps the files of the deployment that is currently live, and the
 * asset file names change on every build. A tab that was opened before a
 * redeploy still holds an entry bundle pointing at the previous names, so
 * navigating to a lazily loaded route fails with
 * "Failed to fetch dynamically imported module".
 *
 * That is not a real failure: reloading the page fetches the current HTML and
 * therefore the current file names. One reload is attempted, and only once per
 * cooldown window so a genuinely broken chunk surfaces as an error instead of
 * reloading forever.
 */

const RELOAD_STAMP_KEY = 'eqh_chunk_reload_at';
const RELOAD_COOLDOWN_MS = 15000;

function readReloadStamp() {
  try {
    return Number(window.sessionStorage.getItem(RELOAD_STAMP_KEY) || 0);
  } catch {
    return 0;
  }
}

function writeReloadStamp(value) {
  try {
    window.sessionStorage.setItem(RELOAD_STAMP_KEY, String(value));
  } catch {
    // Private browsing modes can refuse storage; reloading once is still better
    // than leaving the user on a broken route.
  }
}

export default function lazyWithRetry(importer) {
  return lazy(() =>
    importer().catch((error) => {
      const now = Date.now();

      if (now - readReloadStamp() > RELOAD_COOLDOWN_MS) {
        writeReloadStamp(now);
        window.location.reload();
        // Never settles: the page is being replaced, so keep the loading
        // fallback on screen instead of flashing an error or a blank page.
        return new Promise(() => {});
      }

      throw error;
    })
  );
}
