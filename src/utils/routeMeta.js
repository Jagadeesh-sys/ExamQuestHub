/**
 * Single source of truth for the static (non-dynamic) routes.
 *
 * Consumed by:
 *   - `RouteSeo` for runtime <head> updates, and
 *   - `scripts/generate-seo.mjs` for build-time prerendering and the sitemap,
 *     so the crawler-facing HTML and the rendered SPA can never drift apart.
 */

import { DEFAULT_DESCRIPTION, buildNotFoundSeo } from './seo.js';

export const STATIC_PAGES = [
  {
    path: '/',
    title: '',
    h1: 'ExamQuestHub — Your Exam. Your Next Step.',
    description: DEFAULT_DESCRIPTION,
    changefreq: 'daily',
    priority: '1.0'
  },
  {
    path: '/jobs',
    title: 'Latest Government Job Notifications',
    h1: 'Latest Government Job Notifications',
    description:
      'Browse verified government job notifications for UPSC, SSC, Railways, Banking, APPSC and TSPSC — with vacancies, eligibility, application fees and last dates.',
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    path: '/current-affairs',
    title: 'Daily Current Affairs for Competitive Exams',
    h1: 'Daily Current Affairs',
    description:
      'Daily current affairs and exam-oriented news analysis for UPSC, APPSC, TSPSC, SSC and Banking, verified against official government sources.',
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    path: '/admit-cards',
    title: 'Government Exam Admit Cards',
    h1: 'Admit Cards',
    description:
      'Download the latest admit cards and hall tickets for UPSC, SSC, Railway, Banking, APPSC and TSPSC examinations as soon as they are released.',
    changefreq: 'daily',
    priority: '0.8'
  },
  {
    path: '/results',
    title: 'Government Exam Results',
    h1: 'Exam Results',
    description:
      'Check the latest government exam results, scorecards, cut-offs and merit lists for UPSC, SSC, Railways, Banking and State Public Service Commissions.',
    changefreq: 'daily',
    priority: '0.8'
  },
  {
    path: '/mocks',
    title: 'Free Online Mock Tests',
    h1: 'Free Online Mock Tests',
    description:
      'Attempt free full-length and sectional mock tests with a real exam interface, timer, negative marking and detailed performance analysis.',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    path: '/gk-practice',
    title: 'GK Practice Questions',
    h1: 'GK Practice Questions',
    description:
      'Practise topic-wise general knowledge questions with instant answers and explanations for competitive and government examinations.',
    changefreq: 'weekly',
    priority: '0.7'
  },
  {
    path: '/previous-papers',
    title: 'Previous Year Question Papers',
    h1: 'Previous Year Question Papers',
    description:
      'Download previous year question papers with answer keys for UPSC, SSC, Railways, Banking, APPSC and TSPSC examinations.',
    changefreq: 'weekly',
    priority: '0.7'
  },
  {
    path: '/study-material',
    title: 'Exam Study Material',
    h1: 'Exam Study Material',
    description:
      'Free study material, syllabus breakdowns and preparation resources for government and competitive examinations.',
    changefreq: 'weekly',
    priority: '0.6'
  },
  {
    // Never prerendered as a public page: it is disallowed in robots.txt and
    // carries a noindex directive whenever the SPA renders it.
    path: '/admin',
    title: 'Admin Console',
    h1: 'Admin Console',
    description: 'Restricted administration area.',
    noindex: true
  }
];

const PAGE_BY_PATH = new Map(STATIC_PAGES.map((page) => [page.path, page]));

/** Pages that belong in sitemap.xml (everything except noindex routes). */
export function getSitemapStaticPages() {
  return STATIC_PAGES.filter((page) => !page.noindex);
}

/**
 * Resolves the SEO descriptor for a pathname.
 * Returns `null` for dynamic routes that own their metadata.
 */
export function resolveRouteMeta(pathname) {
  const staticPage = PAGE_BY_PATH.get(pathname);
  if (staticPage) return { ...staticPage };

  // Detail routes set their own metadata once their record has loaded.
  if (/^\/(jobs|current-affairs)\/[^/]+$/.test(pathname)) return null;

  if (/^\/mocks\/[^/]+$/.test(pathname)) {
    return {
      path: pathname,
      title: 'Online Mock Test',
      description:
        'Attempt this free mock test with a real exam interface, timer, question palette and detailed result analysis.'
    };
  }

  return buildNotFoundSeo(pathname);
}
