#!/usr/bin/env node
/**
 * Builds a single HTML file containing every scheduled post, for review before
 * it publishes. Scheduled posts are deliberately unreachable on the site, so
 * this is how you read them while there is still time to change them.
 *
 *   npm run preview-scheduled            -> writes scheduled-posts-preview.html
 *   npm run preview-scheduled -- <path>  -> writes it somewhere else
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'content', 'posts');
const OUT = process.argv[2] || path.join(ROOT, 'scheduled-posts-preview.html');

const pad = n => String(n).padStart(2, '0');
const now = new Date();
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

const scheduled = fs.readdirSync(DIR)
  .filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')))
  .filter(p => p.publishAt > today)
  .sort((a, b) => a.publishAt.localeCompare(b.publishAt));

if (!scheduled.length) {
  console.log('preview-scheduled: nothing scheduled');
  process.exit(0);
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const toc = scheduled.map((p, i) =>
  `<li><a href="#p${i}"><strong>${p.publishAt}</strong> — ${esc(p.title)}</a></li>`).join('\n');

const articles = scheduled.map((p, i) => `
<article id="p${i}">
  <div class="meta-bar">
    <span class="date">${p.publishAt}</span>
    <span class="cat">${esc(p.category)}</span>
    <span>${esc(p.readTime)}</span>
    <span class="slug">/blog/${esc(p.slug)}</span>
  </div>
  <h1>${esc(p.title)}</h1>
  <div class="seo">
    <div><b>Meta description</b> (${p.metaDescription.length} chars)<br>${esc(p.metaDescription)}</div>
    <div><b>Excerpt</b><br>${esc(p.excerpt)}</div>
    <div><b>Keywords</b><br>${esc(p.keywords)}</div>
  </div>
  <div class="body">${p.body}</div>
</article>`).join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Scheduled posts — review</title>
<style>
  :root { --ink:#141e2b; --muted:#66768a; --rule:#dde3ea; --accent:#0891b2; --bg:#f6f8fa; }
  * { box-sizing:border-box; }
  body { margin:0; padding:0 20px 80px; background:var(--bg); color:var(--ink);
         font:16px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
  .wrap { max-width:780px; margin:0 auto; }
  header { padding:48px 0 24px; border-bottom:2px solid var(--ink); margin-bottom:32px; }
  header h1 { margin:0 0 6px; font-size:1.7rem; letter-spacing:-.02em; }
  header p { margin:0; color:var(--muted); font-size:.92rem; }
  nav { background:#fff; border:1px solid var(--rule); border-radius:10px; padding:20px 24px; margin-bottom:48px; }
  nav h2 { margin:0 0 12px; font-size:.75rem; text-transform:uppercase; letter-spacing:.12em; color:var(--muted); }
  nav ol { margin:0; padding-left:20px; }
  nav li { margin:7px 0; font-size:.93rem; }
  nav a { color:var(--ink); text-decoration:none; }
  nav a:hover { color:var(--accent); }
  nav strong { font-variant-numeric:tabular-nums; color:var(--accent); }
  article { background:#fff; border:1px solid var(--rule); border-radius:10px;
            padding:36px 40px; margin-bottom:40px; }
  .meta-bar { display:flex; flex-wrap:wrap; gap:14px; align-items:center;
              font-size:.76rem; color:var(--muted); margin-bottom:14px; }
  .meta-bar .date { background:var(--accent); color:#fff; padding:3px 10px;
                    border-radius:100px; font-weight:700; }
  .meta-bar .cat { border:1px solid var(--rule); padding:3px 10px; border-radius:100px; }
  .meta-bar .slug { font-family:ui-monospace,Menlo,monospace; }
  article h1 { font-size:1.65rem; line-height:1.25; margin:0 0 20px; letter-spacing:-.02em; }
  .seo { background:#f2f6f9; border-left:3px solid var(--accent); border-radius:0 6px 6px 0;
         padding:16px 18px; margin-bottom:28px; font-size:.84rem; color:#3c4b5d; }
  .seo div + div { margin-top:12px; }
  .seo b { color:var(--ink); }
  .body h2 { font-size:1.18rem; margin:32px 0 10px; letter-spacing:-.01em; }
  .body h3 { font-size:1rem; margin:22px 0 8px; }
  .body p { margin:0 0 15px; }
  .body ul, .body ol { margin:0 0 18px; padding-left:22px; }
  .body li { margin:6px 0; }
  .body a { color:var(--accent); }
  @media (max-width:640px){ article { padding:24px 20px; } }
</style></head>
<body><div class="wrap">
<header>
  <h1>Scheduled posts — for review</h1>
  <p>${scheduled.length} posts, publishing ${scheduled[0].publishAt} to ${scheduled[scheduled.length - 1].publishAt}.
     None of these are reachable on the live site until their date.</p>
</header>
<nav><h2>Publishing schedule</h2><ol>
${toc}
</ol></nav>
${articles}
</div></body></html>`;

fs.writeFileSync(OUT, html);
console.log(`preview-scheduled: ${scheduled.length} posts -> ${OUT}`);
