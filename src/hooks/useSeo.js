import { useEffect } from 'react';
import { applySeoHead, buildSeoHead, getOrigin } from '../utils/seo.js';

/**
 * Keeps the live document <head> in sync with the current page.
 *
 * Pass `null` (or omit) to leave the current head untouched — used by dynamic
 * routes that resolve their own metadata once their data has loaded.
 *
 * @param {object|null} options See `buildSeoHead` for supported fields.
 */
export default function useSeo(options) {
  const key = options ? JSON.stringify(options) : '';

  useEffect(() => {
    if (!key) return;
    applySeoHead(buildSeoHead({ ...JSON.parse(key), siteUrl: getOrigin() }));
  }, [key]);
}
