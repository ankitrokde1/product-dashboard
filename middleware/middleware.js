function checkNotLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    return res.redirect("/");
  }
  next();
}

function checkLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  next();
}

module.exports = { checkNotLoggedIn, checkLoggedIn };
