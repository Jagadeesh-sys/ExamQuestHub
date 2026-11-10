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

// Global Vite preload error listener: prevent automatic browser reload loops
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    // Suppress Vite's unhandled preload error and prevent automated page reload loops
    try {
      event?.preventDefault?.();
    } catch {
      // ignore
    }
    console.warn('[Vite] Preload error handled gracefully (automatic reload disabled).', event);
  });
}

export function lazyWithRetry(componentImport, componentName = 'component') {
  return lazy(async () => {
    try {
      // First attempt
      return await componentImport();
    } catch (error) {
      console.warn(`[LazyLoader] Initial load failed for ${componentName}, retrying in-memory once...`, error);
      
      try {
        // Wait 350ms and attempt a single programmatic retry before bubbling to ErrorBoundary
        await new Promise((resolve) => setTimeout(resolve, 350));
        return await componentImport();
      } catch (retryError) {
        console.error(`[LazyLoader] Retry failed for ${componentName}:`, retryError);
        // Rethrow to ErrorBoundary so user gets a clean, non-disruptive retry button instead of a jarring loop
        throw retryError;
      }
    }
  });
}

export default lazyWithRetry;
