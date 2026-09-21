const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load Submission model safely — website still works even if MongoDB is unavailable
let Submission = null;
try { Submission = require('../models/Submission'); } catch (e) { /* no DB */ }

// ===== BLOG POSTS =====
// Posts live in content/posts/*.json and become public on their publishAt
// date, which is what makes scheduled daily publishing work without a cron.
const posts = require('../lib/posts');


// ===== LEGACY URL REDIRECTS (301) =====
// Old site structure crawled by Google before the current site launched.
// Permanent redirects preserve link equity and clear the stale
// "Crawled - currently not indexed" entries in Search Console.
const legacyRedirects = {
  '/news': '/blog',
  '/terms-conditions': '/terms-of-use',
  '/blogs/benefits-of-outsourcing-bookkeeping-accounting-for-cpa-firms': '/blog/outsourced-accounting-services-for-small-business',
  '/blogs/outsourced-accounting-benefits-types-and-getting-started': '/blog/outsourced-accounting-services-for-small-business',
  '/service/receivables-management': '/services#outsourced-accounting',
  '/service/payables-management': '/services#outsourced-accounting',
  '/service/tax-return-preparation': '/services#tax'
};

router.get(Object.keys(legacyRedirects), (req, res) => {
  res.redirect(301, legacyRedirects[req.path]);
});

// Family-level fallbacks for any remaining old paths
router.get('/blogs/:slug', (req, res) => res.redirect(301, '/blog'));
router.get('/service/:slug', (req, res) => res.redirect(301, '/services'));
router.get('/faqs/:slug', (req, res) => res.redirect(301, '/resources'));
router.get('/efile-itr/:slug', (req, res) => res.redirect(301, '/services#tax'));

// ===== HOME =====
router.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'Construction Accounting, Bookkeeping & Fractional CFO Services | FinRise Advisors',
    metaDescription: 'Outsourced accounting, bookkeeping, payroll and fractional CFO for US construction companies — job costing, WIP schedules, AIA billing and retainage.',
    keywords: 'construction accounting services, contractor bookkeeping, job costing, WIP schedule preparation, AIA billing G702 G703, retainage tracking, construction fractional CFO, outsourced accounting for contractors',
    page: 'home',
    canonicalUrl: 'https://www.finriseadvisors.com/',
    // Surfaced on the homepage so crawlers reach posts directly, rather than
    // only via /blog. Sitemap-only discovery was leaving them uncrawled.
    latestPosts: posts.published().slice(0, 3)
  });
});

// ===== ABOUT =====
router.get('/about-us', (req, res) => {
  res.render('pages/about', {
    title: 'About FinRise Advisors | US Outsourced Accounting Experts',
    metaDescription: 'Learn about FinRise Advisors — a dedicated outsourced accounting and fractional CFO firm serving US businesses. US GAAP expertise, dedicated teams, no long-term contracts.',
    keywords: 'FinRise Advisors, about FinRise, outsourced accounting firm USA, accounting advisory firm',
    page: 'about',
    canonicalUrl: 'https://www.finriseadvisors.com/about-us'
  });
});

// ===== SERVICES =====
router.get('/services', (req, res) => {
  res.render('pages/services', {
    title: 'Outsourced Accounting, Fractional CFO & Construction Accounting Services | FinRise Advisors',
    metaDescription: 'Full-service outsourced accounting, fractional CFO, bookkeeping, payroll, construction accounting, and tax compliance for US businesses. US GAAP experts. Get a free quote.',
    keywords: 'outsourced accounting services, fractional CFO services, construction accounting, bookkeeping services, payroll services USA, tax compliance',
    page: 'services',
    canonicalUrl: 'https://www.finriseadvisors.com/services'
  });
});

// ===== PRICING =====
router.get('/pricing', (req, res) => {
  res.render('pages/pricing', {
    title: 'Pricing — Construction Accounting & Fractional CFO Services | FinRise Advisors',
    metaDescription: 'Monthly pricing for construction accounting, bookkeeping, payroll and fractional CFO services. No long-term contracts. Get a quote scoped to your jobs.',
    keywords: 'construction accounting pricing, contractor bookkeeping cost, construction fractional CFO cost, job costing services price',
    page: 'pricing',
    canonicalUrl: 'https://www.finriseadvisors.com/pricing'
  });
});

// ===== RESOURCES =====
router.get('/resources', (req, res) => {
  res.render('pages/resources', {
    title: 'Free Accounting & Finance Resources for US Businesses | FinRise Advisors',
    metaDescription: 'Free downloadable templates and checklists for US business owners: WIP schedule template, cash flow forecast, job costing checklist, and more. Download now — no signup required.',
    keywords: 'free accounting templates, WIP schedule template, cash flow forecast template, job costing template, construction accounting checklist',
    page: 'resources',
    canonicalUrl: 'https://www.finriseadvisors.com/resources'
  });
});

// ===== GATED RESOURCE DOWNLOADS =====
// The files live in content/downloads, outside public/, so the form is a real
// gate rather than a suggestion — a direct URL guess cannot reach the file.
const DOWNLOADS = {
  'wip-schedule': {
    slug: 'wip-schedule',
    title: 'WIP Schedule Template for Contractors',
    intro: 'A working Excel schedule built on the cost-to-cost percentage-of-completion method — the format your lender and surety expect. Fourteen sample jobs already filled in so you can see how it behaves before you put your own numbers in.',
    fileLabel: 'Excel template',
    file: 'FinRise-WIP-Schedule-Template.xlsx',
    downloadName: 'FinRise-WIP-Schedule-Template.xlsx',
    features: [
      'Percentage of completion calculated automatically from cost to date',
      'Over- and under-billing worked out per job',
      'Split into costs in excess of billings and billings in excess of costs',
      'Portfolio backlog and gross margin',
      'Fourteen worked sample jobs showing both billing positions',
      'Plain-English notes on how every column is derived',
    ],
  },
};

function renderDownload(req, res, resource, opts = {}) {
  res.render('pages/resource-download', {
    title: `${resource.title} — Free Download | FinRise Advisors`,
    metaDescription: `Free ${resource.title.toLowerCase()} from FinRise Advisors. Cost-to-cost percentage of completion, over and under billings, and backlog — built for US contractors.`,
    keywords: 'WIP schedule template, work in progress schedule excel, construction WIP template, percentage of completion template',
    page: 'resources',
    canonicalUrl: `https://www.finriseadvisors.com/resources/${resource.slug}`,
    resource,
    ready: opts.ready || false,
    error: opts.error || null,
    values: opts.values || { name: '', email: '', company: '', phone: '' },
  });
}

router.get('/resources/:slug', (req, res, next) => {
  const resource = DOWNLOADS[req.params.slug];
  if (!resource) return next();
  const unlocked = req.signedCookies && req.signedCookies[`dl_${resource.slug}`] === 'true';
  renderDownload(req, res, resource, { ready: unlocked });
});

router.post('/resources/:slug', async (req, res, next) => {
  const resource = DOWNLOADS[req.params.slug];
  if (!resource) return next();

  const values = {
    name: (req.body.name || '').trim(),
    email: (req.body.email || '').trim(),
    company: (req.body.company || '').trim(),
    phone: (req.body.phone || '').trim(),
  };
  const revenue = (req.body.revenue || '').trim();

  if (!values.name || !values.email || !values.company) {
    return renderDownload(req, res, resource, { error: 'Please fill in your name, email and company.', values });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
    return renderDownload(req, res, resource, { error: 'That email address does not look right.', values });
  }

  // A failed save must not cost us the lead's goodwill — log it and still
  // hand over the file.
  if (Submission) {
    try {
      const ipAddress =
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress || '';
      await Submission.create({
        ...values,
        service: 'Resource download',
        resource: resource.title,
        message: revenue ? `Annual revenue: ${revenue}` : '',
        source: 'resource',
        ipAddress,
      });
      console.log('Resource lead saved:', { ...values, resource: resource.slug });
    } catch (err) {
      console.error('Failed to save resource lead:', err.message);
    }
  } else {
    console.log('Resource lead (no DB):', { ...values, resource: resource.slug });
  }

  res.cookie(`dl_${resource.slug}`, 'true', {
    signed: true,
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.redirect(`/resources/${resource.slug}#get`);
});

router.get('/download/:slug', (req, res, next) => {
  const resource = DOWNLOADS[req.params.slug];
  if (!resource) return next();
  if (!req.signedCookies || req.signedCookies[`dl_${resource.slug}`] !== 'true') {
    return res.redirect(`/resources/${resource.slug}#get`);
  }
  res.download(path.join(__dirname, '..', 'content', 'downloads', resource.file), resource.downloadName, err => {
    if (err && !res.headersSent) res.redirect(`/resources/${resource.slug}`);
  });
});

// ===== BLOG LIST =====
router.get('/blog', (req, res) => {
  res.render('pages/blog', {
    title: 'Accounting & CFO Insights Blog | FinRise Advisors',
    metaDescription: 'Accounting tips, fractional CFO insights, construction finance guides, and cash flow strategies for US business owners. Read the FinRise Advisors blog.',
    keywords: 'accounting blog, CFO insights, construction accounting blog, business finance tips, bookkeeping tips',
    page: 'blog',
    canonicalUrl: 'https://www.finriseadvisors.com/blog',
    posts: posts.published()
  });
});

// ===== BLOG POST =====
router.get('/blog/:slug', (req, res) => {
  // bySlug only looks at published posts, so a scheduled post 404s (and
  // redirects) until its date arrives rather than leaking early.
  const post = posts.bySlug(req.params.slug);
  if (!post) return res.redirect('/blog');
  const related = posts.published().filter(p => p.slug !== post.slug).slice(0, 3);
  res.render('pages/blog-post', {
    title: `${post.title} | FinRise Advisors`,
    metaDescription: post.metaDescription,
    keywords: post.keywords,
    page: 'blog',
    canonicalUrl: `https://www.finriseadvisors.com/blog/${post.slug}`,
    post,
    related
  });
});

// ===== CONTACT =====
router.get('/contact-us', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact FinRise Advisors | Book a Free Consultation',
    metaDescription: 'Book a free 30-minute consultation with FinRise Advisors. Get expert advice on outsourced accounting, bookkeeping, payroll, or fractional CFO services for your US business.',
    keywords: 'contact FinRise Advisors, book free consultation, outsourced accounting consultation, fractional CFO consultation',
    page: 'contact',
    canonicalUrl: 'https://www.finriseadvisors.com/contact-us'
  });
});

// ===== PRIVACY POLICY =====
router.get('/privacy-policy', (req, res) => {
  res.render('pages/privacy-policy', {
    title: 'Privacy Policy | FinRise Advisors',
    metaDescription: 'Read the FinRise Advisors Privacy Policy — how we collect, use, and protect your information when you visit our website.',
    keywords: 'FinRise Advisors privacy policy',
    page: '',
    canonicalUrl: 'https://www.finriseadvisors.com/privacy-policy'
  });
});

// ===== TERMS OF USE =====
router.get('/terms-of-use', (req, res) => {
  res.render('pages/terms-of-use', {
    title: 'Terms of Use | FinRise Advisors',
    metaDescription: 'Read the FinRise Advisors Terms of Use — the rules and conditions governing your use of our website and services.',
    keywords: 'FinRise Advisors terms of use',
    page: '',
    canonicalUrl: 'https://www.finriseadvisors.com/terms-of-use'
  });
});

router.post('/contact', async (req, res) => {
  const { name, email, phone, company, service, message } = req.body;
  if (Submission) {
    try {
      const ipAddress =
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        '';
      await Submission.create({ name, email, phone, company, service, message, source: 'contact', ipAddress });
      console.log('Contact form saved:', { name, email, company, service });
    } catch (err) {
      console.error('Failed to save contact submission:', err.message);
    }
  } else {
    console.log('Contact form (no DB):', { name, email, company, service });
  }
  res.json({ success: true });
});

// ===== SITEMAP.XML =====

// lastmod must be truthful. Reporting "today" on every request makes Google
// distrust the field; a hardcoded date goes stale and tells Google not to
// re-crawl pages that did change; and file mtimes are useless here because
// Vercel normalises every file to a fixed epoch (2018-10-20) for reproducible
// builds. So dates come from git, written to content-dates.json by
// scripts/update-sitemap-dates.js and committed with the change itself.
const SITEMAP_FALLBACK_DATE = '2026-09-12';

// Loaded once per cold start; the file ships with the deployment.
const PAGE_DATES = (() => {
  try {
    const raw = fs.readFileSync(path.join(__dirname, '..', 'content-dates.json'), 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.pages === 'object' ? parsed.pages : {};
  } catch (err) {
    console.error('sitemap: content-dates.json unreadable, using fallback date');
    return {};
  }
})();

function formatDate(d) {
  // Build from local parts — toISOString() shifts the date back a day in
  // timezones ahead of UTC.
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function pageDate(url) {
  const d = PAGE_DATES[url];
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : SITEMAP_FALLBACK_DATE;
}

router.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://www.finriseadvisors.com';

  const staticPages = [
    { url: '/', priority: '1.0', freq: 'weekly' },
    { url: '/about-us', priority: '0.8', freq: 'monthly' },
    { url: '/services', priority: '0.9', freq: 'weekly' },
    { url: '/pricing', priority: '0.8', freq: 'monthly' },
    { url: '/blog', priority: '0.8', freq: 'weekly' },
    { url: '/resources', priority: '0.7', freq: 'monthly' },
    { url: '/contact-us', priority: '0.7', freq: 'monthly' },
    { url: '/privacy-policy', priority: '0.3', freq: 'yearly' },
    { url: '/terms-of-use', priority: '0.3', freq: 'yearly' },
  ].map(p => ({ ...p, lastmod: pageDate(p.url) }));

  // Only published posts belong in the sitemap — submitting a URL that 404s
  // until next week would be a bad signal. `updated` wins if the body was
  // revised after publishing.
  const blogUrls = posts.published().map(p => ({
    url: `/blog/${p.slug}`,
    priority: '0.7',
    freq: 'monthly',
    lastmod: /^\d{4}-\d{2}-\d{2}$/.test(p.updated || '') ? p.updated : p.publishAt
  }));

  const allPages = [...staticPages, ...blogUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${baseUrl}${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

// ===== ROBOTS.TXT =====
router.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: https://www.finriseadvisors.com/sitemap.xml`);
});

module.exports = router;
