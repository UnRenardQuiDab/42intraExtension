const Token = require("../model/token");

async function userParser(req, res, next) {
  let token = req.cookies.token;
  if (!token) {
    token = req.headers['x-42intratools-key'];
  }
  if (!token)
    return next();
  const user_token = await Token.findOne({ accessToken: token }).populate('user');
  req.user = user_token?.user;
  next();
}

module.exports	= userParser;