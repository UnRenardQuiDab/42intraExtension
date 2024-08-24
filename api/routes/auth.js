const express = require("express")
const router = new express.Router();
const generateAccessToken = require('../auth/generateAccessToken');
const User = require("../model/user");
const { v4: uuidv4 } = require('uuid');

router.get('/42', (req, res) => {
	const url = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.CALLBACK_URL}&response_type=code`;
	res.redirect(url);
});
  
router.get('/42/callback', 
	async (req, res) => {
	  const code = req.query.code;
  
	  generateAccessToken(code, async (error, response) => {
		if (error) {
		  res.status(500).send('Code not valid');
		  return;
		}
  
		const { access_token, refresh_token, expires_in } = response;
	
		const me = await fetch('https://api.intra.42.fr/v2/me', {
		  headers: {
			'Authorization': `Bearer ${access_token}`
		  }
		});
	
		if (me.status !== 200) {
		  res.status(500).send('User not found');
		  return;
		}
	
		const { id, login, created_at } = await me.json();
		const uuid = uuidv4();
	
		await User.findOneAndUpdate(
		  { intraId: id },
		  {
			intraId: id,
			login: login,
			accessToken: access_token,
			refreshToken: refresh_token,
			expiresIn: new Date(Date.now() + expires_in * 1000),
			uuid: uuid,
			intraUserCreatedAt: created_at,
			logtime: { durations: [], lastFetchedDate: created_at }
		  },
		  { new: true, upsert: true, useFindAndModify: false });
		
		res.cookie('uuid', uuid);
		res.redirect(`/auth/redirect?uuid=${uuid}&login=${login}`);
	  });
  });
  
  
router.get('/redirect', (req, res) => {
	res.send(`You are now connected you can close this tab`);
});
  

module.exports = router;