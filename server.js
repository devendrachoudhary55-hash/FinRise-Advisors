const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser(process.env.SESSION_SECRET || 'finrise-secret-2026'));

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
