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
  DEFAULT_DESCRIPTION,
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

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const STATIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/jobs', changefreq: 'daily', priority: '0.9' },
  { path: '/current-affairs', changefreq: 'daily', priority: '0.9' },
  { path: '/admit-cards', changefreq: 'daily', priority: '0.8' },
  { path: '/results', changefreq: 'daily', priority: '0.8' },
  { path: '/mocks', changefreq: 'weekly', priority: '0.8' },
  { path: '/gk-practice', changefreq: 'weekly', priority: '0.7' },
  { path: '/previous-papers', changefreq: 'weekly', priority: '0.7' },
  { path: '/study-material', changefreq: 'weekly', priority: '0.6' }
];

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

function renderHomeBody() {
  return [
    '<main>',
    `<h1>ExamQuestHub — Your Exam. Your Next Step.</h1>`,
    `<p>${escapeHtml(DEFAULT_DESCRIPTION)}</p>`,
    '<h2>Explore</h2>',
    '<ul>',
    '<li><a href="/jobs">Latest government job notifications</a></li>',
    '<li><a href="/current-affairs">Daily current affairs</a></li>',
    '<li><a href="/admit-cards">Admit cards</a></li>',
    '<li><a href="/results">Exam results</a></li>',
    '<li><a href="/mocks">Free online mock tests</a></li>',
    '<li><a href="/gk-practice">GK practice questions</a></li>',
    '<li><a href="/previous-papers">Previous year question papers</a></li>',
    '<li><a href="/study-material">Study material</a></li>',
    '</ul>',
    '</main>'
  ].join('\n');
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

  const sitemapEntries = STATIC_PAGES.map((page) => ({ ...page }));

  // Homepage (also rewrites dist/index.html with a canonical URL + JSON-LD).
  const homeHead = buildSeoHead({
    siteUrl,
    path: '/',
    title: '',
    description: DEFAULT_DESCRIPTION,
    jsonLd: [buildWebSiteSchema(siteUrl), buildOrganizationSchema(siteUrl)]
  });
  await writeDistFile('index.html', buildPageHtml(template, homeHead, renderHomeBody()));

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

  console.log(
    `[seo] Generated ${jobs.length + articles.length} prerendered pages, sitemap.xml (${sitemapEntries.length} URLs) and robots.txt for ${siteUrl}`
  );
}

main().catch((err) => {
  // SEO generation must never break a deployment.
  console.warn('[seo] Generation skipped:', err?.message || err);
  process.exitCode = 0;
});
