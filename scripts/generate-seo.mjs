/**
 * Build-time SEO generator.
 *
 * Runs after `vite build` (see the `postbuild` script) and:
 *   1. prerenders a static HTML shell for every published job and news article,
 *      so crawlers that do not execute JavaScript still see real content,
 *      correct titles/descriptions and JobPosting / NewsArticle structured data;
 *   2. writes `dist/sitemap.xml` and `dist/robots.txt`.
 *
 * Every network failure is non-fatal: the script always emits the sitemap and
 * robots.txt, and simply skips per-page prerendering if Firestore is unreachable.
 */

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  FALLBACK_SITE_URL,
  buildArticlePageSeo,
  buildJobPageSeo,
  buildOrganizationSchema,
  buildSeoHead,
  buildWebSiteSchema,
  pickLocalized,
  renderHeadHtml,
  toAbsoluteUrl
} from '../src/utils/seo.js';
import { STATIC_PAGES, getSitemapStaticPages } from '../src/utils/routeMeta.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

function resolveSiteUrl() {
  const explicit = process.env.SITE_URL || process.env.VITE_SITE_URL;
  if (explicit) return String(explicit).replace(/\/+$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${String(vercel).replace(/^https?:\/\//, '').replace(/\/+$/, '')}`;

  return FALLBACK_SITE_URL;
}

function escapeHtml(value) {
  return String(value === null || value === undefined ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ------------------------------ Firestore ------------------------------ */

async function loadFirebaseConfig() {
  const configPath = path.join(ROOT, 'firebase-applet-config.json');
  let fileConfig = {};
  if (existsSync(configPath)) {
    try {
      fileConfig = JSON.parse(await readFile(configPath, 'utf8'));
    } catch (err) {
      console.warn('[seo] Could not parse firebase-applet-config.json:', err.message);
    }
  }

  return {
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || fileConfig.projectId,
    apiKey: process.env.VITE_FIREBASE_API_KEY || fileConfig.apiKey,
    databaseId:
      process.env.VITE_FIREBASE_DATABASE_ID || fileConfig.firestoreDatabaseId || '(default)'
  };
}

function decodeValue(value) {
  if (!value || typeof value !== 'object') return null;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('booleanValue' in value) return Boolean(value.booleanValue);
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  if ('referenceValue' in value) return value.referenceValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeValue);
  if ('mapValue' in value) return decodeFields(value.mapValue.fields || {});
  return null;
}

function decodeFields(fields) {
  const out = {};
  for (const [key, value] of Object.entries(fields || {})) {
    out[key] = decodeValue(value);
  }
  return out;
}

async function fetchCollection(name, config) {
  const documents = [];
  let pageToken = '';

  do {
    const base = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.databaseId}/documents/${name}`;
    const query = `?key=${encodeURIComponent(config.apiKey)}&pageSize=300${
      pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''
    }`;

    const response = await fetch(`${base}${query}`);
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`Firestore ${name} request failed with ${response.status}. ${detail.slice(0, 200)}`);
    }

    const payload = await response.json();
    for (const doc of payload.documents || []) {
      documents.push({ id: doc.name.split('/').pop(), ...decodeFields(doc.fields) });
    }
    pageToken = payload.nextPageToken || '';
  } while (pageToken);

  return documents;
}

function isDraft(item) {
  const status = String(item?.status || '').toLowerCase();
  return status === 'draft' || status === 'unpublished' || item?.published === false;
}

function sortByDateDesc(items, field) {
  return [...items].sort((a, b) =>
    String(b[field] || b.publishedAt || '').localeCompare(String(a[field] || a.publishedAt || ''))
  );
}

/* --------------------------- Static HTML body --------------------------- */

function renderValueRow(label, value) {
  if (!value) return '';
  return `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`;
}

function renderJobBody(job) {
  const title = pickLocalized(job.title);
  const organization = pickLocalized(job.organization);
  const summary = pickLocalized(job.summary);
  const description = pickLocalized(job.description);

  const facts = [
    renderValueRow('Organization', organization),
    renderValueRow('Category', job.category),
    renderValueRow('Region', job.region),
    renderValueRow('Notification Number', job.notificationNo),
    renderValueRow('Published On', job.publishedAt),
    renderValueRow('Last Date to Apply', job.deadline),
    renderValueRow('Exam Date', job.examDate),
    renderValueRow('Total Vacancies', job.vacancies),
    renderValueRow('Status', job.status)
  ].join('');

  const eligibility = [
    renderValueRow('Qualification', pickLocalized(job.qualification)),
    renderValueRow('Age Limit', pickLocalized(job.ageLimit)),
    renderValueRow('Application Fee', pickLocalized(job.applicationFee)),
    renderValueRow('Selection Process', pickLocalized(job.selectionProcess)),
    renderValueRow('Salary', pickLocalized(job.salary))
  ].join('');

  return [
    '<main>',
    '<nav><a href="/">ExamQuestHub</a> &rsaquo; <a href="/jobs">Latest Jobs</a></nav>',
    `<h1>${escapeHtml(title)}</h1>`,
    `<ul>${facts}</ul>`,
    summary ? `<h2>Overview</h2><p>${escapeHtml(summary)}</p>` : '',
    description ? `<p>${escapeHtml(description)}</p>` : '',
    eligibility ? `<h2>Eligibility &amp; Application Details</h2><ul>${eligibility}</ul>` : '',
    job.applyUrl
      ? `<p><a href="${escapeHtml(job.applyUrl)}" rel="noopener nofollow">Apply on the official website</a></p>`
      : '',
    job.pdfUrl
      ? `<p><a href="${escapeHtml(job.pdfUrl)}" rel="noopener nofollow">Official notification PDF</a></p>`
      : '',
    '<p><a href="/jobs">Browse all government job notifications</a></p>',
    '</main>'
  ]
    .filter(Boolean)
    .join('\n');
}

function renderArticleBody(article, siteUrl) {
  const headline = pickLocalized(article.headline);
  const summary = pickLocalized(article.summary);
  const content = pickLocalized(article.content);
  const source = pickLocalized(article.sourceName);
  const image = article.imageUrl ? toAbsoluteUrl(article.imageUrl, siteUrl) : '';

  return [
    '<main>',
    '<nav><a href="/">ExamQuestHub</a> &rsaquo; <a href="/current-affairs">Current Affairs</a></nav>',
    '<article>',
    `<h1>${escapeHtml(headline)}</h1>`,
    `<ul>${[
      renderValueRow('Topic', article.topic),
      renderValueRow('Event Date', article.eventDate),
      renderValueRow('Source', source)
    ].join('')}</ul>`,
    image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(headline)}" />` : '',
    summary ? `<h2>Summary</h2><p>${escapeHtml(summary)}</p>` : '',
    content ? `<h2>Details</h2><p>${escapeHtml(content)}</p>` : '',
    Array.isArray(article.tags) && article.tags.length
      ? `<p>Keywords: ${escapeHtml(article.tags.join(', '))}</p>`
      : '',
    article.sourceUrl
      ? `<p><a href="${escapeHtml(article.sourceUrl)}" rel="noopener nofollow">View official source</a></p>`
      : '',
    '</article>',
    '<p><a href="/current-affairs">Read more daily current affairs</a></p>',
    '</main>'
  ]
    .filter(Boolean)
    .join('\n');
}

// Which records belong on which hub page. Hub pages link to their own detail
// pages so crawlers that do not execute JavaScript can still discover them.
const HUB_COLLECTIONS = {
  '/jobs': (jobs) => jobs.filter((item) => !item.type || item.type === 'job'),
  '/admit-cards': (jobs) => jobs.filter((item) => item.type === 'admit-card'),
  '/results': (jobs) => jobs.filter((item) => item.type === 'result'),
  '/current-affairs': (_jobs, articles) => articles
};

const MAX_COLLECTION_LINKS = 200;

function renderStaticBody(page, jobs = [], articles = []) {
  const hubLinks = STATIC_PAGES.filter((other) => !other.noindex && other.path !== page.path)
    .map((other) => `<li><a href="${other.path}">${escapeHtml(other.title || other.h1)}</a></li>`)
    .join('\n');

  const select = HUB_COLLECTIONS[page.path];
  const isArticleHub = page.path === '/current-affairs';
  const itemLinks = select
    ? select(jobs, articles)
        .slice(0, MAX_COLLECTION_LINKS)
        .map((item) => {
          const href = isArticleHub
            ? `/current-affairs/${item.slug || item.id}`
            : `/jobs/${item.slug || item.id}`;
          const label = isArticleHub ? pickLocalized(item.headline) : pickLocalized(item.title);
          return `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`;
        })
        .join('\n')
    : '';

  return [
    '<main>',
    `<h1>${escapeHtml(page.h1 || page.title)}</h1>`,
    `<p>${escapeHtml(page.description)}</p>`,
    itemLinks ? `<h2>Latest updates</h2>\n<ul>\n${itemLinks}\n</ul>` : '',
    '<h2>Explore ExamQuestHub</h2>',
    `<ul>\n${hubLinks}\n</ul>`,
    '</main>'
  ]
    .filter(Boolean)
    .join('\n');
}

/* ------------------------------ Page output ------------------------------ */

function buildPageHtml(template, head, bodyHtml) {
  const seoBlock = `<!-- EQH:SEO:START -->\n    ${renderHeadHtml(head)}\n    <!-- EQH:SEO:END -->`;

  let html = template;
  if (html.includes('<!-- EQH:SEO:START -->')) {
    html = html.replace(/<!-- EQH:SEO:START -->[\s\S]*?<!-- EQH:SEO:END -->/, () => seoBlock);
  } else {
    html = html.replace('</head>', () => `${seoBlock}\n  </head>`);
  }

  if (bodyHtml && html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', () => `<div id="root">${bodyHtml}</div>`);
  }

  return html;
}

async function writeDistFile(relativePath, contents) {
  const target = path.join(DIST, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents, 'utf8');
}

/* ------------------------------- Sitemap -------------------------------- */

function renderSitemap(entries, siteUrl) {
  const urls = entries
    .map((entry) => {
      const lines = [`    <loc>${escapeHtml(toAbsoluteUrl(entry.path, siteUrl))}</loc>`];
      if (entry.lastmod) lines.push(`    <lastmod>${escapeHtml(entry.lastmod)}</lastmod>`);
      if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      if (entry.priority) lines.push(`    <priority>${entry.priority}</priority>`);
      return `  <url>\n${lines.join('\n')}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function renderRobots(siteUrl) {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    '',
    `Sitemap: ${toAbsoluteUrl('/sitemap.xml', siteUrl)}`,
    ''
  ].join('\n');
}

/* --------------------------------- Main --------------------------------- */

async function main() {
  const siteUrl = resolveSiteUrl();

  if (!existsSync(DIST)) {
    console.warn('[seo] dist/ not found — skipping SEO generation.');
    return;
  }

  const template = await readFile(path.join(DIST, 'index.html'), 'utf8');

  const sitemapEntries = getSitemapStaticPages().map((page) => ({
    path: page.path,
    changefreq: page.changefreq,
    priority: page.priority
  }));

  // Firestore is queried first so hub pages can link to their own detail pages.
  let jobs = [];
  let articles = [];

  try {
    const config = await loadFirebaseConfig();
    if (!config.projectId || !config.apiKey) {
      throw new Error('Firebase projectId/apiKey are not available.');
    }

    const [rawUpdates, rawArticles] = await Promise.all([
      fetchCollection('updates', config),
      fetchCollection('currentAffairs', config)
    ]);

    jobs = sortByDateDesc(rawUpdates.filter((item) => !isDraft(item)), 'publishedAt');
    articles = sortByDateDesc(rawArticles.filter((item) => !isDraft(item)), 'eventDate');
    console.log(`[seo] Loaded ${jobs.length} notifications and ${articles.length} articles.`);
  } catch (err) {
    console.warn(`[seo] Skipping page prerender (${err.message})`);
  }

  // Prerender every static route as its own file. This matters because the SPA
  // fallback serves dist/index.html, whose canonical points at "/" — without a
  // per-route file, hub URLs like /jobs would be reported as duplicates of the
  // homepage by search engines.
  for (const page of STATIC_PAGES) {
    const head = buildSeoHead({
      siteUrl,
      path: page.path,
      title: page.title,
      description: page.description,
      noindex: page.noindex,
      jsonLd:
        page.path === '/'
          ? [buildWebSiteSchema(siteUrl), buildOrganizationSchema(siteUrl)]
          : []
    });
    const fileName =
      page.path === '/' ? 'index.html' : `${page.path.replace(/^\//, '')}.html`;
    await writeDistFile(
      fileName,
      buildPageHtml(template, head, renderStaticBody(page, jobs, articles))
    );
  }

  for (const job of jobs) {
    const head = buildSeoHead({ siteUrl, ...buildJobPageSeo(job, siteUrl) });
    const slug = job.slug || job.id;
    await writeDistFile(path.join('jobs', `${slug}.html`), buildPageHtml(template, head, renderJobBody(job)));
    sitemapEntries.push({
      path: `/jobs/${slug}`,
      lastmod: job.updatedAt || job.publishedAt,
      changefreq: 'weekly',
      priority: '0.7'
    });
  }

  for (const article of articles) {
    const head = buildSeoHead({ siteUrl, ...buildArticlePageSeo(article, siteUrl) });
    const slug = article.slug || article.id;
    await writeDistFile(
      path.join('current-affairs', `${slug}.html`),
      buildPageHtml(template, head, renderArticleBody(article, siteUrl))
    );
    sitemapEntries.push({
      path: `/current-affairs/${slug}`,
      lastmod: article.updatedAt || article.eventDate || article.publishedAt,
      changefreq: 'monthly',
      priority: '0.6'
    });
  }

  await writeDistFile('sitemap.xml', renderSitemap(sitemapEntries, siteUrl));
  await writeDistFile('robots.txt', renderRobots(siteUrl));

  const totalPages = STATIC_PAGES.length + jobs.length + articles.length;
  console.log(
    `[seo] Generated ${totalPages} prerendered pages (${STATIC_PAGES.length} static + ${jobs.length} jobs + ${articles.length} articles), sitemap.xml (${sitemapEntries.length} URLs) and robots.txt for ${siteUrl}`
  );
}

main().catch((err) => {
  // SEO generation must never break a deployment.
  console.warn('[seo] Generation skipped:', err?.message || err);
  process.exitCode = 0;
});
