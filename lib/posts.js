/**
 * Blog post loading and scheduled publishing.
 *
 * Posts live as JSON files in content/posts/. Each carries a `publishAt` date
 * (YYYY-MM-DD); a post is public only once that date has arrived. That is what
 * makes daily publishing work with no cron job and no scheduled task — the
 * server simply checks the date, so a post goes live on its morning whether or
 * not anyone's machine is switched on.
 *
 * Files are read once per cold start. A deploy picks up new files; scheduled
 * posts then appear on their own date without another deploy.
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');

const REQUIRED_FIELDS = [
  'slug', 'title', 'category', 'publishAt', 'date',
  'readTime', 'icon', 'excerpt', 'metaDescription', 'keywords', 'body',
];

function loadAll() {
  let files;
  try {
    files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.json'));
  } catch (err) {
    console.error('posts: cannot read content/posts —', err.message);
    return [];
  }

  const posts = [];
  for (const file of files) {
    try {
      const post = JSON.parse(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
      const missing = REQUIRED_FIELDS.filter(f => !post[f]);
      if (missing.length) {
        // Skip rather than serve a half-rendered page.
        console.error(`posts: ${file} missing ${missing.join(', ')} — skipped`);
        continue;
      }
      posts.push(post);
    } catch (err) {
      console.error(`posts: ${file} is not valid JSON — skipped (${err.message})`);
    }
  }
  return posts;
}

const ALL_POSTS = loadAll();

function today() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Posts whose publish date has arrived, newest first. */
function published() {
  const now = today();
  return ALL_POSTS
    .filter(p => p.publishAt <= now)
    .sort((a, b) => b.publishAt.localeCompare(a.publishAt));
}

/** Scheduled but not yet public — used by the validation script. */
function scheduled() {
  const now = today();
  return ALL_POSTS
    .filter(p => p.publishAt > now)
    .sort((a, b) => a.publishAt.localeCompare(b.publishAt));
}

function bySlug(slug) {
  return published().find(p => p.slug === slug);
}

module.exports = { published, scheduled, bySlug, all: () => ALL_POSTS, today, REQUIRED_FIELDS };
