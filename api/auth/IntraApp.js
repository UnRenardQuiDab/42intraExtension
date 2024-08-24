require('dotenv').config();

class IntraApp {
	constructor() {
		this.token = null;
		this.expiration = null;
		this.getAuthToken();
	}

	async getAuthToken() {

		if (new Date(this.expiration) >= Date.now()) {
			return this.token;
		}

		const params = new URLSearchParams();
		params.append('grant_type', 'client_credentials');
		params.append('client_id', process.env.CLIENT_ID);
		params.append('client_secret', process.env.CLIENT_SECRET);

		try {
			const response = await fetch('https://api.intra.42.fr/oauth/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: params.toString()
			});
		
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const token = await response.json();
			this.token = token.access_token;
			console.log('Token:', this.token);
			this.expiration = Date.now() + token.expires_in * 1000;
			return token;

		} catch(err) {
			console.error('Error fetching token:', err);
			return null;
		}
	}
}

module.exports = new IntraApp;