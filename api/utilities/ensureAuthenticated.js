// Middleware to check if a user is authenticated
// Prevents users going to /profile whether they authenticated or not
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};
