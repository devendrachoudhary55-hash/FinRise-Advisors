const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'partials/layout');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const websiteRoutes = require('./routes/website');
app.use('/', websiteRoutes);

// Start server locally; export for Vercel serverless
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`FinRise Advisors running on http://localhost:${PORT}`);
  });
}

module.exports = app;
