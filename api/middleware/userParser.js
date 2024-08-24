const User = require("../model/user");

async function userParser(req, res, next) {
  let uuid = req.cookies.uuid;
  if (!uuid) {
	uuid = req.headers['x-42intratools-key'];
  }
  req.user = await User.findOne({ uuid: uuid });
  next();
}

module.exports	= userParser;