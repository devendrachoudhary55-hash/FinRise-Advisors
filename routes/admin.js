const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const requireAdmin = require('../middleware/auth');

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
