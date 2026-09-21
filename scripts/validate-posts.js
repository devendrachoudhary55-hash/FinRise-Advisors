#!/usr/bin/env node
/**
 * Checks every post in content/posts/ before it can be committed.
 *
 * A scheduled post publishes itself with nobody watching, so the time to catch
 * a broken link, a duplicate slug or a leftover TODO is now — not on the
 * morning it goes live. The pre-commit hook runs this and refuses the commit
 * on any error.
 *
 *   npm run validate-posts
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');

const REQUIRED = ['slug', 'title', 'category', 'publishAt', 'date', 'readTime',
                  'icon', 'excerpt', 'metaDescription', 'keywords', 'body'];

// Categories the blog filter buttons and CSS actually support.
const CATEGORIES = ['CFO Insights', 'Construction', 'Business Finance'];

const errors = [];
const warnings = [];
const seenSlugs = new Map();
const seenTitles = new Map();

function err(file, msg) { errors.push(`${file}: ${msg}`); }
function warn(file, msg) { warnings.push(`${file}: ${msg}`); }

const files = fs.existsSync(POSTS_DIR)
  ? fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json'))
  : [];

if (!files.length) {
  console.error('validate-posts: no posts found in content/posts');
  process.exit(1);
}

// Internal link targets that exist on the site.
const STATIC_ROUTES = new Set(['/', '/about-us', '/services', '/pricing', '/blog',
  '/resources', '/contact-us', '/privacy-policy', '/terms-of-use',
  // gated resource landing pages
  '/resources/wip-schedule']);

const allSlugs = new Set();
const parsed = [];

for (const file of files) {
  let post;
  try {
    post = JSON.parse(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
  } catch (e) {
    err(file, `invalid JSON — ${e.message}`);
    continue;
  }
  parsed.push({ file, post });
  if (post.slug) allSlugs.add(post.slug);
}

for (const { file, post } of parsed) {
  for (const field of REQUIRED) {
    if (!post[field] || String(post[field]).trim() === '') err(file, `missing "${field}"`);
  }
  if (errors.some(e => e.startsWith(file + ':'))) continue;

  // Slug hygiene — it becomes a public URL.
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug)) {
    err(file, `slug "${post.slug}" must be lowercase words separated by single hyphens`);
  }
  if (path.basename(file, '.json') !== post.slug) {
    err(file, `filename must match slug ("${post.slug}.json")`);
  }
  if (seenSlugs.has(post.slug)) {
    err(file, `duplicate slug, also in ${seenSlugs.get(post.slug)}`);
  }
  seenSlugs.set(post.slug, file);

  const titleKey = post.title.trim().toLowerCase();
  if (seenTitles.has(titleKey)) {
    err(file, `duplicate title, also in ${seenTitles.get(titleKey)}`);
  }
  seenTitles.set(titleKey, file);

  // Dates
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.publishAt)) {
    err(file, `publishAt "${post.publishAt}" must be YYYY-MM-DD`);
  } else if (isNaN(new Date(post.publishAt))) {
    err(file, `publishAt "${post.publishAt}" is not a real date`);
  }
  if (post.updated && !/^\d{4}-\d{2}-\d{2}$/.test(post.updated)) {
    err(file, `updated "${post.updated}" must be YYYY-MM-DD`);
  }
  // The displayed date should agree with the scheduled one.
  const display = new Date(post.date);
  if (isNaN(display)) {
    err(file, `date "${post.date}" is not parseable`);
  } else {
    const pad = n => String(n).padStart(2, '0');
    const iso = `${display.getFullYear()}-${pad(display.getMonth() + 1)}-${pad(display.getDate())}`;
    if (iso !== post.publishAt) {
      err(file, `date "${post.date}" (${iso}) disagrees with publishAt "${post.publishAt}"`);
    }
  }

  if (!CATEGORIES.includes(post.category)) {
    err(file, `category "${post.category}" is not one of: ${CATEGORIES.join(', ')}`);
  }
  if (!/^fa-[a-z0-9-]+$/.test(post.icon)) {
    err(file, `icon "${post.icon}" should look like "fa-hard-hat"`);
  }

  // SEO limits — Google truncates beyond these.
  if (post.metaDescription.length > 160) {
    err(file, `metaDescription is ${post.metaDescription.length} chars (max 160)`);
  }
  if (post.metaDescription.length < 70) {
    warn(file, `metaDescription is only ${post.metaDescription.length} chars`);
  }
  if (post.title.length > 70) {
    warn(file, `title is ${post.title.length} chars — may truncate in search results`);
  }
  if (post.excerpt.length > 200) {
    warn(file, `excerpt is ${post.excerpt.length} chars`);
  }

  // Body checks
  const body = post.body;
  if (!/<h2[ >]/.test(body)) err(file, 'body has no <h2> headings');
  const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words < 500) err(file, `body is only ${words} words — too thin to be useful`);
  if (words > 4000) warn(file, `body is ${words} words — unusually long`);

  const placeholders = body.match(/TODO|FIXME|Lorem ipsum|XXXX|\[insert|\{\{/gi);
  if (placeholders) err(file, `body contains placeholder text: ${[...new Set(placeholders)].join(', ')}`);

  // Unbalanced tags render as broken pages.
  for (const tag of ['h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'table']) {
    const open = (body.match(new RegExp(`<${tag}[ >]`, 'g')) || []).length;
    const close = (body.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (open !== close) err(file, `unbalanced <${tag}> — ${open} open, ${close} closing`);
  }

  // Internal links must point at something real.
  const hrefs = [...body.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  for (const href of hrefs) {
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) continue;
    const clean = href.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
    if (STATIC_ROUTES.has(clean)) continue;
    const m = clean.match(/^\/blog\/(.+)$/);
    if (m && allSlugs.has(m[1])) continue;
    err(file, `internal link "${href}" does not resolve to a real page`);
  }

  // Cheap tell for machine-written filler.
  const cliches = body.match(/in today's fast-paced|leverage synergies|in conclusion,|it is important to note that/gi);
  if (cliches) warn(file, `generic phrasing: ${[...new Set(cliches)].join(', ')}`);
}

// Two posts must not share a publish date, or one silently hides the other.
const byDate = new Map();
for (const { file, post } of parsed) {
  if (!post.publishAt) continue;
  if (byDate.has(post.publishAt)) {
    warn(file, `shares publishAt ${post.publishAt} with ${byDate.get(post.publishAt)}`);
  }
  byDate.set(post.publishAt, file);
}

const pad = n => String(n).padStart(2, '0');
const now = new Date();
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const live = parsed.filter(p => p.post.publishAt <= today).length;
const queued = parsed.filter(p => p.post.publishAt > today).length;

console.log(`validate-posts: ${parsed.length} posts — ${live} live, ${queued} scheduled`);
if (queued) {
  const next = parsed.filter(p => p.post.publishAt > today)
    .sort((a, b) => a.post.publishAt.localeCompare(b.post.publishAt));
  console.log(`  next up: ${next[0].post.publishAt}  ${next[0].post.slug}`);
  console.log(`  last queued: ${next[next.length - 1].post.publishAt}`);
}

for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.error(`  ERROR ${e}`);

if (errors.length) {
  console.error(`\nvalidate-posts: ${errors.length} error(s) — nothing will be published until these are fixed.`);
  process.exit(1);
}
console.log('validate-posts: all checks passed');
