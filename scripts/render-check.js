#!/usr/bin/env node
/**
 * Renders every scheduled post through the real blog-post template, as if its
 * publish date had arrived.
 *
 * A scheduled post goes live with nobody watching. If the template throws, or
 * a field renders as "undefined", or the JSON-LD is malformed, we need to know
 * now — not from a broken page that has been public for a day.
 *
 *   npm run render-check
 */

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'content', 'posts');
const TPL = path.join(ROOT, 'views', 'pages', 'blog-post.ejs');

const tpl = fs.readFileSync(TPL, 'utf8');
const all = fs.readdirSync(DIR)
  .filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')));

const pad = n => String(n).padStart(2, '0');
const now = new Date();
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

// Check scheduled posts; live ones are already proven by being served.
const scheduled = all
  .filter(p => p.publishAt > today)
  .sort((a, b) => a.publishAt.localeCompare(b.publishAt));

if (!scheduled.length) {
  console.log('render-check: no scheduled posts to check');
  process.exit(0);
}

let failures = 0;

for (const post of scheduled) {
  const related = all.filter(p => p.slug !== post.slug).slice(0, 3);
  try {
    const html = ejs.render(tpl, { post, related }, { filename: TPL });

    const problems = [];
    if (!html.includes(post.title)) problems.push('title missing from output');
    if (!html.includes(`/blog/${post.slug}`)) problems.push('slug missing from output');
    if (!/<script type="application\/ld\+json">/.test(html)) problems.push('BlogPosting schema missing');
    if (/undefined|\[object Object\]/.test(html)) problems.push('rendered "undefined" or "[object Object]"');
    if (html.length < 3000) problems.push(`output only ${html.length} bytes`);

    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (ld) {
      try {
        JSON.parse(ld[1]);
      } catch (e) {
        problems.push(`invalid JSON-LD — ${e.message}`);
      }
    }

    if (problems.length) {
      failures++;
      console.error(`  FAIL  ${post.slug}`);
      for (const p of problems) console.error(`        ${p}`);
    } else {
      console.log(`  ok    ${post.publishAt}  ${post.slug}`);
    }
  } catch (e) {
    failures++;
    console.error(`  FAIL  ${post.slug} — template threw: ${e.message}`);
  }
}

console.log(`render-check: ${scheduled.length} scheduled post(s), ${failures} failure(s)`);
if (failures) {
  console.error('render-check: scheduled posts would publish broken — fix before committing.');
  process.exit(1);
}
