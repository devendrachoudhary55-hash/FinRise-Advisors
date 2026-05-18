const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== DATABASE CONNECTION =====
const MONGODB_URI = process.env.MONGODB_URI || '';
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI not set — admin portal will not persist data.');
}

// ===== VIEW ENGINE =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'partials/layout');

// ===== MIDDLEWARE =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== SESSION =====
const SESSION_SECRET = process.env.SESSION_SECRET || 'finrise-dev-secret-change-in-prod';
const sessionConfig = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8  // 8 hours
  }
};

// Use MongoDB to store sessions if DB is available; otherwise fall back to memory
if (MONGODB_URI) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: MONGODB_URI,
    touchAfter: 24 * 3600 // only update session once per day unless data changes
  });
}

app.use(session(sessionConfig));

// ===== ROUTES =====
const websiteRoutes = require('./routes/website');
const adminRoutes = require('./routes/admin');

app.use('/', websiteRoutes);
app.use('/admin', adminRoutes);

// ===== START / EXPORT =====
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`FinRise Advisors running on http://localhost:${PORT}`);
  });
}

module.exports = app;
