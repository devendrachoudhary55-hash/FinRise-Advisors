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

// Start the day after whatever is already scheduled furthest out.
const lastScheduled = [...written.values()].sort().pop();
const start = new Date(lastScheduled + 'T00:00:00');
start.setDate(start.getDate() + 1);

const rows = plan.map((topic, i) => {
  const d = new Date(start);
  d.setDate(d.getDate() + i);
  return { ...topic, date: iso(d), done: written.has(topic.slug) };
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
