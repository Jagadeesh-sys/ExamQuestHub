import { useLocation } from 'react-router-dom';
import useSeo from '../hooks/useSeo.js';
import { buildOrganizationSchema, buildWebSiteSchema, getOrigin } from '../utils/seo.js';
import { resolveRouteMeta } from '../utils/routeMeta.js';

/**
 * Applies page metadata for every route.
 *
 * Route metadata lives in `src/utils/routeMeta.js` so the build-time prerender
 * script emits exactly the same titles, descriptions and canonicals that the
 * SPA applies at runtime.
 */
export default function RouteSeo() {
  const { pathname } = useLocation();
  const origin = getOrigin();
  const meta = resolveRouteMeta(pathname);

  useSeo(
    meta
      ? {
          title: meta.title,
          description: meta.description,
          path: meta.path,
          noindex: meta.noindex,
          jsonLd:
            pathname === '/'
              ? [buildWebSiteSchema(origin), buildOrganizationSchema(origin)]
              : []
        }
      : null
  );

  return null;
}
