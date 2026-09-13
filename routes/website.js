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
