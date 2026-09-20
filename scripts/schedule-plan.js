#!/usr/bin/env node
/**
 * Maps the editorial plan onto calendar dates, one post per day, starting the
 * day after the last thing already queued. Reports which planned topics are
 * written and which are still outstanding.
 *
 *   npm run schedule          -> show the schedule and what is still to write
 *   npm run schedule -- --json  -> machine-readable, used when writing posts
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POSTS = path.join(ROOT, 'content', 'posts');
const plan = require(path.join(ROOT, 'content', 'topic-plan.js'));

const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const written = new Map();
for (const f of fs.readdirSync(POSTS).filter(f => f.endsWith('.json'))) {
  const p = JSON.parse(fs.readFileSync(path.join(POSTS, f), 'utf8'));
  written.set(p.slug, p.publishAt);
}

// Two posts a week, Tuesday and Thursday. Daily output from a one-person firm
// reads as mass-produced, and the evidence says specificity converts while
// volume does not — so the cadence is deliberate, not a limitation.
const PUBLISH_DAYS = [2, 4]; // Sun=0

// Start after whatever is already scheduled furthest out, excluding the plan's
// own entries so re-running this does not drag the schedule forward each time.
const planSlugs = new Set(plan.map(p => p.slug));
const fixedDates = [...written.entries()]
  .filter(([slug]) => !planSlugs.has(slug))
  .map(([, date]) => date)
  .sort();
const cursor = new Date((fixedDates.pop() || iso(new Date())) + 'T00:00:00');

const rows = plan.map(topic => {
  do { cursor.setDate(cursor.getDate() + 1); }
  while (!PUBLISH_DAYS.includes(cursor.getDay()));
  return { ...topic, date: iso(cursor), done: written.has(topic.slug) };
});

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

const done = rows.filter(r => r.done).length;
console.log(`schedule: ${plan.length} topics planned, ${done} written, ${plan.length - done} to write`);
console.log(`first slot ${rows[0].date}  ·  last slot ${rows[rows.length - 1].date}`);
console.log();
for (const r of rows) {
  console.log(`  ${r.done ? '✓' : ' '} ${r.date}  ${r.slug}`);
}
