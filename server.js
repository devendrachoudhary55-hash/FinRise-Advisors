const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== VIEW ENGINE =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'partials/layout');

// ===== MIDDLEWARE =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== SESSION (safe — works with or without MongoDB) =====
try {
  const session = require('express-session');
  const MONGODB_URI = process.env.MONGODB_URI || '';
  const SESSION_SECRET = process.env.SESSION_SECRET || 'finrise-dev-secret-2026';

  const sessionConfig = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 }
  };

  if (MONGODB_URI) {
    try {
      const mongoose = require('mongoose');
      const MongoStore = require('connect-mongo');
      mongoose.connect(MONGODB_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB error:', err.message));
      sessionConfig.store = MongoStore.create({ mongoUrl: MONGODB_URI, touchAfter: 24 * 3600 });
    } catch (dbErr) {
      console.error('DB/session-store init failed (using memory store):', dbErr.message);
    }
  }

  app.use(session(sessionConfig));
} catch (sessionErr) {
  console.error('express-session init failed — admin login disabled:', sessionErr.message);
}

// ===== ROUTES =====
const websiteRoutes = require('./routes/website');
app.use('/', websiteRoutes);

try {
  const adminRoutes = require('./routes/admin');
  app.use('/admin', adminRoutes);
} catch (adminErr) {
  console.error('Admin routes failed to load:', adminErr.message);
  app.use('/admin', (req, res) => res.status(503).send('Admin portal temporarily unavailable.'));
}

// ===== START / EXPORT =====
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`FinRise Advisors running on http://localhost:${PORT}`);
  });
}

module.exports = app;
