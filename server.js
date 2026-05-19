const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// ===== DATABASE — serverless-safe connection =====
// In Vercel each request may be a cold start, so we await the connection
// inside a middleware rather than fire-and-forget at module load time.
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return; // already connected
  if (!MONGODB_URI) return;
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 30000,
  });
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
app.use(cookieParser(process.env.SESSION_SECRET || 'finrise-secret-2026'));

// ===== WEBSITE ROUTES (no DB needed) =====
const websiteRoutes = require('./routes/website');
app.use('/', websiteRoutes);

// ===== ENSURE DB CONNECTED before any /admin route =====
app.use('/admin', async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    // Still call next — login page works without DB
  }
  next();
});

// ===== ADMIN ROUTES =====
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// ===== START / EXPORT =====
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`FinRise Advisors running on http://localhost:${PORT}`);
  });
}

module.exports = app;
