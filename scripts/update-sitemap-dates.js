#!/usr/bin/env node
/**
 * Writes content-dates.json — the real last-modified date of each page.
 *
 * Why this exists: the sitemap's <lastmod> has to be truthful. Reporting
 * "today" on every request makes Google distrust the field; a hardcoded date
 * goes stale and tells Google not to re-crawl pages that did change; and file
 * mtimes are useless on Vercel, which normalises every file to a fixed epoch
 * (2018-10-20) for reproducible builds.
 *
 * So dates come from git — the one source that actually knows when content
 * changed — and are committed to the repo so the server can read them at
 * runtime on any host.
 *
 * Run automatically by .git/hooks/pre-commit, or by hand:
 *   npm run sitemap-dates
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'content-dates.json');

// Files shared by every page — a nav or footer edit is a real content change.
const SHARED_SOURCES = ['views/partials/layout.ejs'];

const PAGE_SOURCES = {
  '/': ['views/pages/home.ejs'],
  '/about-us': ['views/pages/about.ejs'],
  '/services': ['views/pages/services.ejs'],
  '/pricing': ['views/pages/pricing.ejs'],
  '/blog': ['views/pages/blog.ejs'],
  '/resources': ['views/pages/resources.ejs'],
  '/contact-us': ['views/pages/contact.ejs'],
  '/privacy-policy': ['views/pages/privacy-policy.ejs'],
  '/terms-of-use': ['views/pages/terms-of-use.ejs'],
};

const pad = n => String(n).padStart(2, '0');
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

function git(args) {
  try {
    return execSync(`git ${args}`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch (err) {
    return '';
  }
}

/**
 * A file staged or modified right now is being changed today — git log would
 * still report its previous commit. Otherwise use its last commit date.
 */
function fileDate(relPath) {
  if (git(`status --porcelain -- "${relPath}"`)) return today();
  const committed = git(`log -1 --format=%cs -- "${relPath}"`);
  return /^\d{4}-\d{2}-\d{2}$/.test(committed) ? committed : null;
}

function newestDate(relPaths) {
  const dates = [...relPaths, ...SHARED_SOURCES].map(fileDate).filter(Boolean);
  return dates.length ? dates.sort().pop() : null;
}

const dates = {};
for (const [url, sources] of Object.entries(PAGE_SOURCES)) {
  const date = newestDate(sources);
  if (date) dates[url] = date;
}

if (!Object.keys(dates).length) {
  console.error('update-sitemap-dates: no dates resolved — is this a git checkout?');
  process.exit(1);
}

fs.writeFileSync(OUT, JSON.stringify({ generated: today(), pages: dates }, null, 2) + '\n');
console.log(`update-sitemap-dates: wrote ${Object.keys(dates).length} page dates to content-dates.json`);
