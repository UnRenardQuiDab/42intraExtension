function isLoggedIn(req, res, next) {
  if (req.user) {
	return next();
  }
  return res.status(401).send('Unauthorized');
}

module.exports = isLoggedIn;