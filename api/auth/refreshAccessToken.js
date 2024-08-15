const axios = require('axios');

function refreshAccessToken(refreshToken, callback) {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
  params.append('client_id', process.env.CLIENT_ID);
  params.append('client_secret', process.env.CLIENT_SECRET);

  axios.post('https://api.intra.42.fr/oauth/token', params)
    .then(response => {
      callback(null, response.data.access_token, response.data.refresh_token);
    })
    .catch(error => {
      callback(error);
    });
}
