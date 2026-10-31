import { useLocation } from 'react-router-dom';
import useSeo from '../hooks/useSeo.js';
import {
  DEFAULT_DESCRIPTION,
  buildNotFoundSeo,
  buildOrganizationSchema,
  buildWebSiteSchema,
  getOrigin
} from '../utils/seo.js';

/**
 * Static, hand-written metadata for the non-dynamic routes.
 * Dynamic detail routes (`/jobs/:slug`, `/current-affairs/:id`) resolve their
 * own metadata once their record has loaded, so they are skipped here.
 */
const STATIC_ROUTES = {
  '/': {
    title: '',
    description: DEFAULT_DESCRIPTION
  },
  '/jobs': {
    title: 'Latest Government Job Notifications',
    description:
      'Browse verified government job notifications for UPSC, SSC, Railways, Banking, APPSC and TSPSC — with vacancies, eligibility, application fees and last dates.'
  },
  '/admit-cards': {
    title: 'Government Exam Admit Cards',
    description:
      'Download the latest admit cards and hall tickets for UPSC, SSC, Railway, Banking, APPSC and TSPSC examinations as soon as they are released.'
  },
  '/results': {
    title: 'Government Exam Results',
    description:
      'Check the latest government exam results, scorecards, cut-offs and merit lists for UPSC, SSC, Railways, Banking and State Public Service Commissions.'
  },
  '/current-affairs': {
    title: 'Daily Current Affairs for Competitive Exams',
    description:
      'Daily current affairs and exam-oriented news analysis for UPSC, APPSC, TSPSC, SSC and Banking, verified against official government sources.'
  },
  '/gk-practice': {
    title: 'GK Practice Questions',
    description:
      'Practise topic-wise general knowledge questions with instant answers and explanations for competitive and government examinations.'
  },
  '/mocks': {
    title: 'Free Online Mock Tests',
    description:
      'Attempt free full-length and sectional mock tests with a real exam interface, timer, negative marking and detailed performance analysis.'
  },
  '/previous-papers': {
    title: 'Previous Year Question Papers',
    description:
      'Download previous year question papers with answer keys for UPSC, SSC, Railways, Banking, APPSC and TSPSC examinations.'
  },
  '/study-material': {
    title: 'Exam Study Material',
    description:
      'Free study material, syllabus breakdowns and preparation resources for government and competitive examinations.'
  },
  '/admin': {
    title: 'Admin Console',
    description: 'Restricted administration area.',
    noindex: true
  }
};

function resolveRouteSeo(pathname) {
  if (STATIC_ROUTES[pathname]) return { ...STATIC_ROUTES[pathname], path: pathname };

  // Detail routes own their metadata — leave whatever is already in the head.
  if (/^\/(jobs|current-affairs)\/[^/]+$/.test(pathname)) return null;

  if (/^\/mocks\/[^/]+$/.test(pathname)) {
    return {
      title: 'Online Mock Test',
      description:
        'Attempt this free mock test with a real exam interface, timer, question palette and detailed result analysis.',
      path: pathname
    };
  }

  return buildNotFoundSeo(pathname);
}

export default function RouteSeo() {
  const { pathname } = useLocation();
  const origin = getOrigin();
  const seo = resolveRouteSeo(pathname);

  useSeo(
    seo
      ? {
          ...seo,
          jsonLd:
            pathname === '/'
              ? [buildWebSiteSchema(origin), buildOrganizationSchema(origin)]
              : []
        }
      : null
  );

  return null;
}
