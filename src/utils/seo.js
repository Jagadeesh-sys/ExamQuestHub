/**
 * Framework-free SEO helpers.
 *
 * The same module is imported by:
 *   - the browser (see `useSeo`, which mutates the live <head>), and
 *   - the build-time prerender script (`scripts/generate-seo.mjs`).
 *
 * It must therefore never touch `window`/`document` at module scope.
 */

export const SITE_NAME = 'ExamQuestHub';
export const SITE_TAGLINE = 'Your Exam. Your Next Step.';
export const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const DEFAULT_DESCRIPTION =
  'Verified government exam notifications, admit cards, results, daily current affairs, GK practice, and previous-year question papers for UPSC, SSC, Banking, Railways, AP, and TS.';
// Solid-background logo: renders reliably inside social preview cards.
export const DEFAULT_OG_IMAGE = '/assets/aistudio/file_000000006a4881f4be54dc3e116f9bc0_65b76b0e.png';
export const FALLBACK_SITE_URL = 'https://examquesthub.vercel.app';

const MANAGED_JSONLD_ATTR = 'data-eqh-seo';

/** Only used by the browser. Returns the deployed origin, or a sane default. */
export function getOrigin() {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return FALLBACK_SITE_URL;
}

export function pickLocalized(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (typeof value.en === 'string' && value.en.trim()) return value.en;
    if (typeof value.te === 'string' && value.te.trim()) return value.te;
    const first = Object.values(value).find((entry) => typeof entry === 'string' && entry.trim());
    return first || fallback;
  }
  return String(value);
}

export function stripHtml(input) {
  return String(input || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncate(text, max = 160) {
  const clean = stripHtml(text);
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  // Only fall back to a hard cut when there is no sensible word boundary.
  const boundary = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${boundary.trimEnd()}…`;
}

export function toAbsoluteUrl(pathOrUrl, siteUrl) {
  const base = String(siteUrl || FALLBACK_SITE_URL).replace(/\/+$/, '');
  const value = String(pathOrUrl || '').trim();
  if (!value) return `${base}/`;
  if (/^https?:\/\//i.test(value)) return value;
  return `${base}${value.startsWith('/') ? '' : '/'}${value}`;
}

/** Normalises `YYYY-MM-DD` and ISO strings into a valid schema.org datetime. */
export function toIsoDate(value) {
  if (!value) return '';
  const raw = String(value).trim();
  const parsed = new Date(raw.length === 10 ? `${raw}T00:00:00Z` : raw);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
}

/* ------------------------------------------------------------------ *
 * Structured data
 * ------------------------------------------------------------------ */

export function buildWebSiteSchema(siteUrl) {
  const base = String(siteUrl || FALLBACK_SITE_URL).replace(/\/+$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Exam Quest Hub',
    url: `${base}/`,
    description: DEFAULT_DESCRIPTION,
    inLanguage: ['en', 'te'],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${base}/`,
      logo: { '@type': 'ImageObject', url: toAbsoluteUrl(DEFAULT_OG_IMAGE, base) }
    }
  };
}

export function buildOrganizationSchema(siteUrl) {
  const base = String(siteUrl || FALLBACK_SITE_URL).replace(/\/+$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${base}/`,
    logo: { '@type': 'ImageObject', url: toAbsoluteUrl(DEFAULT_OG_IMAGE, base) },
    description: DEFAULT_DESCRIPTION
  };
}

export function buildBreadcrumbSchema(items, siteUrl) {
  const list = (items || []).filter((item) => item && item.name);
  if (!list.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: stripHtml(item.name).slice(0, 120),
      item: toAbsoluteUrl(item.path || '/', siteUrl)
    }))
  };
}

/**
 * Google requires title, description, datePosted, hiringOrganization and
 * jobLocation before a posting is eligible for the Google Jobs experience.
 */
export function buildJobPostingSchema(job, url, siteUrl) {
  if (!job) return null;
  const title = pickLocalized(job.title);
  const datePosted = toIsoDate(job.publishedAt || job.createdAt);
  if (!title || !datePosted) return null;

  const organization = pickLocalized(job.organization) || SITE_NAME;
  const description =
    stripHtml([pickLocalized(job.summary), pickLocalized(job.description)].filter(Boolean).join(' ')) ||
    title;

  const publisher = {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: { '@type': 'ImageObject', url: toAbsoluteUrl(DEFAULT_OG_IMAGE, siteUrl) }
  };

  // Admit cards and results are announcements, not vacancies. Marking them up as
  // JobPosting would be invalid structured data, so they get an Article instead.
  if (job.type && job.type !== 'job') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: truncate(title, 110),
      description: truncate(description, 200),
      url,
      datePublished: datePosted,
      inLanguage: 'en',
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: { '@type': 'Organization', name: organization },
      publisher
    };
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    url,
    datePosted,
    inLanguage: 'en',
    hiringOrganization: {
      '@type': 'Organization',
      name: organization,
      ...(job.officialUrl ? { sameAs: job.officialUrl } : {})
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        addressRegion: job.region || 'India'
      }
    },
    identifier: {
      '@type': 'PropertyValue',
      name: organization,
      value: job.notificationNo || job.slug || job.id || url
    }
  };

  const validThrough = toIsoDate(job.deadline);
  if (validThrough) schema.validThrough = validThrough;

  const openings = Number(String(job.vacancies || '').replace(/[^\d]/g, ''));
  if (Number.isFinite(openings) && openings > 0) schema.totalJobOpenings = openings;

  return schema;
}

export function buildNewsArticleSchema(article, url, siteUrl) {
  if (!article) return null;
  const headline = pickLocalized(article.headline);
  const datePublished = toIsoDate(article.eventDate || article.publishedAt || article.createdAt);
  if (!headline || !datePublished) return null;

  const image = toAbsoluteUrl(article.imageUrl || DEFAULT_OG_IMAGE, siteUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: truncate(headline, 110),
    description: truncate(pickLocalized(article.summary), 200),
    articleSection: article.topic || 'Current Affairs',
    ...(Array.isArray(article.tags) && article.tags.length ? { keywords: article.tags.join(', ') } : {}),
    datePublished,
    dateModified: toIsoDate(article.updatedAt) || datePublished,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: [image],
    author: {
      '@type': 'Organization',
      name: pickLocalized(article.sourceName) || SITE_NAME
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: toAbsoluteUrl(DEFAULT_OG_IMAGE, siteUrl) }
    }
  };
}

/* ------------------------------------------------------------------ *
 * Page-level SEO descriptors (shared by runtime + prerender)
 * ------------------------------------------------------------------ */

export function buildJobPageSeo(job, siteUrl) {
  if (!job) return null;
  const path = `/jobs/${job.slug || job.id}`;
  const url = toAbsoluteUrl(path, siteUrl);
  const title = pickLocalized(job.title);
  const organization = pickLocalized(job.organization);

  return {
    title,
    description: pickLocalized(job.summary) || pickLocalized(job.description),
    path,
    type: 'article',
    image: job.imageUrl,
    publishedTime: job.publishedAt,
    modifiedTime: job.updatedAt || job.verifiedAt,
    keywords: [organization, job.category, job.region, 'government jobs', 'notification'].filter(Boolean),
    jsonLd: [
      buildJobPostingSchema(job, url, siteUrl),
      buildBreadcrumbSchema(
        [
          { name: 'Home', path: '/' },
          { name: 'Latest Jobs', path: '/jobs' },
          { name: title, path }
        ],
        siteUrl
      )
    ]
  };
}

export function buildArticlePageSeo(article, siteUrl) {
  if (!article) return null;
  const path = `/current-affairs/${article.slug || article.id}`;
  const url = toAbsoluteUrl(path, siteUrl);
  const headline = pickLocalized(article.headline);

  return {
    title: headline,
    description: pickLocalized(article.summary) || pickLocalized(article.content),
    path,
    type: 'article',
    image: article.imageUrl,
    publishedTime: article.eventDate || article.publishedAt,
    modifiedTime: article.updatedAt,
    keywords: [article.topic, pickLocalized(article.sourceName), 'current affairs', 'daily news'].filter(Boolean),
    jsonLd: [
      buildNewsArticleSchema(article, url, siteUrl),
      buildBreadcrumbSchema(
        [
          { name: 'Home', path: '/' },
          { name: 'Current Affairs', path: '/current-affairs' },
          { name: headline, path }
        ],
        siteUrl
      )
    ]
  };
}

export function buildNotFoundSeo(path, title = 'Page Not Found') {
  return {
    title,
    description: 'The page you requested could not be found on ExamQuestHub.',
    path,
    noindex: true
  };
}

/* ------------------------------------------------------------------ *
 * Head normalisation + renderers
 * ------------------------------------------------------------------ */

export function buildSeoHead(options) {
  const opts = options || {};
  const base = String(opts.siteUrl || FALLBACK_SITE_URL).replace(/\/+$/, '');
  const url = toAbsoluteUrl(opts.path || '/', base);
  const title = opts.title ? `${opts.title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const description = truncate(opts.description || DEFAULT_DESCRIPTION, 160);
  const image = toAbsoluteUrl(opts.image || DEFAULT_OG_IMAGE, base);

  const jsonLd = (opts.jsonLd || [])
    .map((entry) => (typeof entry === 'function' ? entry(base) : entry))
    .filter(Boolean);

  return {
    title,
    description,
    url,
    image,
    type: opts.type || 'website',
    siteName: SITE_NAME,
    robots: opts.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large',
    keywords: Array.isArray(opts.keywords) ? opts.keywords.join(', ') : opts.keywords || '',
    publishedTime: toIsoDate(opts.publishedTime),
    modifiedTime: toIsoDate(opts.modifiedTime),
    jsonLd
  };
}

function escapeAttr(value) {
  return String(value === null || value === undefined ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function serializeJsonLd(schema) {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}

/** Builds the `<head>` fragment injected at build time. */
export function renderHeadHtml(head) {
  const lines = [
    `<title>${escapeAttr(head.title)}</title>`,
    `<meta name="description" content="${escapeAttr(head.description)}" />`,
    `<link rel="canonical" href="${escapeAttr(head.url)}" />`,
    `<meta name="robots" content="${escapeAttr(head.robots)}" />`,
    `<meta property="og:site_name" content="${escapeAttr(head.siteName)}" />`,
    `<meta property="og:type" content="${escapeAttr(head.type)}" />`,
    `<meta property="og:title" content="${escapeAttr(head.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(head.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(head.url)}" />`,
    `<meta property="og:image" content="${escapeAttr(head.image)}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(head.title)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(head.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(head.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(head.image)}" />`
  ];

  if (head.keywords) lines.push(`<meta name="keywords" content="${escapeAttr(head.keywords)}" />`);
  if (head.publishedTime) {
    lines.push(`<meta property="article:published_time" content="${escapeAttr(head.publishedTime)}" />`);
  }
  if (head.modifiedTime) {
    lines.push(`<meta property="article:modified_time" content="${escapeAttr(head.modifiedTime)}" />`);
  }
  head.jsonLd.forEach((schema) => {
    lines.push(
      `<script type="application/ld+json" ${MANAGED_JSONLD_ATTR}="jsonld">${serializeJsonLd(schema)}</script>`
    );
  });

  return lines.join('\n    ');
}

function upsertMeta(attr, key, content) {
  const nodes = document.head.querySelectorAll(`meta[${attr}="${key}"]`);
  if (!content) {
    nodes.forEach((node) => node.remove());
    return;
  }
  let target = nodes[0];
  if (!target) {
    target = document.createElement('meta');
    target.setAttribute(attr, key);
    document.head.appendChild(target);
  }
  target.setAttribute('content', content);
  for (let i = 1; i < nodes.length; i += 1) nodes[i].remove();
}

function upsertCanonical(href) {
  const nodes = document.head.querySelectorAll('link[rel="canonical"]');
  let target = nodes[0];
  if (!target) {
    target = document.createElement('link');
    target.setAttribute('rel', 'canonical');
    document.head.appendChild(target);
  }
  target.setAttribute('href', href);
  for (let i = 1; i < nodes.length; i += 1) nodes[i].remove();
}

/** Applies a normalised head object to the live document (browser only). */
export function applySeoHead(head) {
  if (typeof document === 'undefined' || !head) return;

  document.title = head.title;

  upsertMeta('name', 'description', head.description);
  upsertMeta('name', 'robots', head.robots);
  upsertMeta('name', 'keywords', head.keywords || null);
  upsertMeta('property', 'og:site_name', head.siteName);
  upsertMeta('property', 'og:type', head.type);
  upsertMeta('property', 'og:title', head.title);
  upsertMeta('property', 'og:description', head.description);
  upsertMeta('property', 'og:url', head.url);
  upsertMeta('property', 'og:image', head.image);
  upsertMeta('property', 'og:image:alt', head.title);
  upsertMeta('property', 'og:locale', 'en_IN');
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', head.title);
  upsertMeta('name', 'twitter:description', head.description);
  upsertMeta('name', 'twitter:image', head.image);
  upsertMeta('property', 'article:published_time', head.publishedTime || null);
  upsertMeta('property', 'article:modified_time', head.modifiedTime || null);

  upsertCanonical(head.url);

  document.head.querySelectorAll(`script[${MANAGED_JSONLD_ATTR}="jsonld"]`).forEach((node) => node.remove());
  head.jsonLd.forEach((schema) => {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute(MANAGED_JSONLD_ATTR, 'jsonld');
    script.textContent = serializeJsonLd(schema);
    document.head.appendChild(script);
  });
}
