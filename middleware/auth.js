// Middleware to protect admin routes (signed cookie — serverless safe)
module.exports = function requireAdmin(req, res, next) {
  if (req.signedCookies && req.signedCookies.adminAuth === 'true') {
    return next();
  }
  res.redirect('/admin/login');
};
