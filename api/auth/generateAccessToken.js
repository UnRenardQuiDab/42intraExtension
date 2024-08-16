const axios = require('axios');

function generateAccessToken(code, callback) {


	const params = new URLSearchParams();
	params.append('grant_type', 'authorization_code');
	params.append('code', code);
	params.append('client_id', process.env.CLIENT_ID);
	params.append('client_secret', process.env.CLIENT_SECRET);
	params.append('redirect_uri', process.env.CALLBACK_URL);

	axios.post('https://api.intra.42.fr/oauth/token', params, {
		headers: {
		"Content-Type": "application/x-www-form-urlencoded",
		}
	})
	.then(response => {
		callback(null, response.data);
	})
	.catch(error => {
		callback(error);
	});
}

module.exports = generateAccessToken;