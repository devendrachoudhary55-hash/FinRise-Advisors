const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Submission = require('../models/Submission');
const requireAdmin = require('../middleware/auth');

// =====================================================================
// LEADS API — read-only feed for the daily lead-triage task
// =====================================================================
// The daily task runs on a laptop with no database credentials, so it reads
// leads over HTTP instead. Authentication is a single shared token in
// LEADS_API_TOKEN, compared in constant time. This sits under /admin so it
// inherits the DB-connect middleware in server.js, but it deliberately does
// NOT use requireAdmin — a cookie is useless to a background script.
//
// If LEADS_API_TOKEN is unset the endpoints refuse every request rather than
// falling open.

function requireLeadsToken(req, res, next) {
  const expected = process.env.LEADS_API_TOKEN || '';
  if (!expected) {
    return res.status(503).json({ error: 'leads_api_disabled' });
  }
  const given = req.get('x-leads-token') || req.query.token || '';
  const a = Buffer.from(String(given));
  const b = Buffer.from(expected);
  // timingSafeEqual throws on a length mismatch, so check length first. The
  // length of the token is not a useful secret.
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

// ----- GET /admin/api/leads -------------------------------------------
// Everything still waiting to be judged and followed up, oldest first.
//   ?status=pending (default) | triaged | all
//   ?limit=1..100   (default 25)
//   ?sinceDays=N    only leads created in the last N days
//
// "pending" must be {$ne: true}, not {nurtured: false}. Submissions saved
// before this field existed have no `nurtured` key at all, and Mongo does not
// match a missing field against false — every pre-existing lead would be
// invisible to the feed.
router.get('/api/leads', requireLeadsToken, async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 25, 1), 100);

    let query;
    if (status === 'pending') query = { nurtured: { $ne: true } };
    else if (status === 'triaged') query = { nurtured: true };
    else query = {};

    const sinceDays = parseInt(req.query.sinceDays, 10);
    if (Number.isFinite(sinceDays) && sinceDays > 0) {
      const cutoff = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);
      query.createdAt = { $gte: cutoff };
    }

    const leads = await Submission.find(query)
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();

    res.json({
      generatedAt: new Date().toISOString(),
      status,
      count: leads.length,
      pendingTotal: await Submission.countDocuments({ nurtured: { $ne: true } }),
      leads: leads.map(l => ({
        id: String(l._id),
        createdAt: l.createdAt,
        name: l.name,
        email: l.email,
        phone: l.phone,
        company: l.company,
        service: l.service,
        message: l.message,
        resource: l.resource,
        source: l.source,
        triage: l.triage,
        nurtured: l.nurtured,
        triageNote: l.triageNote
      }))
    });
  } catch (err) {
    console.error('leads api:', err.message);
    res.status(500).json({ error: 'server_error', detail: err.message });
  }
});

// ----- POST /admin/api/leads/:id/triage -------------------------------
// Records the judgement and marks the lead handled so it is never queued
// twice. Body: { triage: 'genuine'|'spam', note?: string, nurtured?: boolean }
router.post('/api/leads/:id/triage', requireLeadsToken, async (req, res) => {
  try {
    const { triage, note } = req.body || {};
    if (!['genuine', 'spam'].includes(triage)) {
      return res.status(400).json({ error: 'triage must be "genuine" or "spam"' });
    }
    const nurtured = req.body.nurtured === undefined ? true : !!req.body.nurtured;

    const now = new Date();
    const updated = await Submission.findByIdAndUpdate(
      req.params.id,
      {
        triage,
        triagedAt: now,
        nurtured,
        nurturedAt: nurtured ? now : null,
        triageNote: String(note || '').slice(0, 2000)
      },
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ error: 'not_found' });
    res.json({ ok: true, id: String(updated._id), triage: updated.triage, nurtured: updated.nurtured });
  } catch (err) {
    console.error('leads api triage:', err.message);
    res.status(500).json({ error: 'server_error', detail: err.message });
  }
});

// ===== LOGIN PAGE =====
router.get('/login', (req, res) => {
  if (req.signedCookies && req.signedCookies.adminAuth === 'true') return res.redirect('/admin');
  res.render('admin/login', { layout: false, error: null });
});

// ===== PROCESS LOGIN =====
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'finrise2026';

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.cookie('adminAuth', 'true', {
      signed: true,
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production'
    });
    return res.redirect('/admin');
  }
  res.render('admin/login', { layout: false, error: 'Invalid username or password.' });
});

// ===== LOGOUT =====
router.get('/logout', (req, res) => {
  res.clearCookie('adminAuth');
  res.redirect('/admin/login');
});

// ===== DASHBOARD =====
router.get('/', requireAdmin, async (req, res) => {
  try {
    const filter = req.query.filter || 'all';
    const service = req.query.service || '';
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 20;

    // Build query
    let query = {};
    if (filter === 'unread') query.read = false;
    if (service) query.service = service;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Stats
    const total     = await Submission.countDocuments();
    const unread    = await Submission.countDocuments({ read: false });
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const today     = await Submission.countDocuments({ createdAt: { $gte: todayStart } });
    const weekStart  = new Date(); weekStart.setDate(weekStart.getDate() - 7);
    const thisWeek  = await Submission.countDocuments({ createdAt: { $gte: weekStart } });

    // Submissions
    const submissions = await Submission
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(await Submission.countDocuments(query) / limit);

    // Unique services for filter dropdown
    const services = await Submission.distinct('service');

    res.render('admin/dashboard', {
      layout: false,
      submissions,
      stats: { total, unread, today, thisWeek },
      filter, service, search,
      page, totalPages,
      services: services.filter(Boolean)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error: ' + err.message);
  }
});

// ===== VIEW SINGLE SUBMISSION =====
router.get('/submission/:id', requireAdmin, async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!submission) return res.redirect('/admin');
    res.render('admin/submission', { layout: false, submission });
  } catch (err) {
    res.redirect('/admin');
  }
});

// ===== MARK READ / UNREAD =====
router.post('/mark/:id', requireAdmin, async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (sub) { sub.read = !sub.read; await sub.save(); }
    res.redirect('back');
  } catch (err) {
    res.redirect('/admin');
  }
});

// ===== DELETE =====
router.post('/delete/:id', requireAdmin, async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    res.redirect('/admin');
  }
});

// ===== MARK ALL READ =====
router.post('/mark-all-read', requireAdmin, async (req, res) => {
  try {
    await Submission.updateMany({ read: false }, { read: true });
    res.redirect('/admin');
  } catch (err) {
    res.redirect('/admin');
  }
});

module.exports = router;
