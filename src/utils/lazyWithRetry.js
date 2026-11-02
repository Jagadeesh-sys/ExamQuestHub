import { lazy } from 'react';

/**
 * Resilient lazy loader for React components.
 * 
 * Automatically recovers from stale deployment chunk errors:
 * "Failed to fetch dynamically imported module: https://examquesthub.vercel.app/assets/AdminPage-xxxx.js"
 * 
 * When a new deployment is pushed to Vercel, previous hashed chunks no longer exist.
 * If a user's mobile browser still has the previous HTML cached, navigating to a lazy route
 * will fail to load the old chunk. This wrapper detects chunk loading failures and automatically
 * reloads the page to load the latest HTML and asset chunks.
 */

// Global Vite preload error listener
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('[Vite] Preload error detected. Attempting automatic recovery...', event);
    const reloadKey = 'eqh_vite_preload_reload';
    const lastReload = parseInt(window.sessionStorage?.getItem(reloadKey) || '0', 10);
    const now = Date.now();
    // Allow reload only once every 10 seconds to prevent loops
    if (now - lastReload > 10000) {
      window.sessionStorage?.setItem(reloadKey, String(now));
      window.location.reload();
    }
  });
}

export function lazyWithRetry(componentImport, componentName = 'component') {
  return lazy(async () => {
    const sessionKey = `eqh_chunk_retry_${componentName}`;
    const hasRetried = window.sessionStorage?.getItem(sessionKey) === 'true';

    try {
      const component = await componentImport();
      // Successful load - clear retry flag
      window.sessionStorage?.removeItem(sessionKey);
      return component;
    } catch (error) {
      console.warn(`[LazyLoader] Error loading ${componentName}:`, error);

      const errorMessage = String(error?.message || error || '');
      const isChunkError =
        errorMessage.includes('Failed to fetch dynamically imported module') ||
        errorMessage.includes('dynamically imported module') ||
        errorMessage.includes('Loading chunk') ||
        errorMessage.includes('error loading dynamically imported module') ||
        error?.name === 'ChunkLoadError' ||
        errorMessage.includes('Importing a module script failed');

      if (isChunkError && !hasRetried && typeof window !== 'undefined') {
        console.info(`[LazyLoader] Stale bundle chunk detected for ${componentName}. Refreshing with latest assets...`);
        window.sessionStorage?.setItem(sessionKey, 'true');
        // Force reload page to fetch latest index.html with new asset hashes
        window.location.reload();
        // Return a pending promise so React doesn't render an error before reload completes
        return new Promise(() => {});
      }

      // If already retried or not a chunk error, rethrow to ErrorBoundary
      window.sessionStorage?.removeItem(sessionKey);
      throw error;
    }
  });
}

export default lazyWithRetry;
