require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { default: axios } = require('axios');
const User = require('./model/user');
const IntraApp = require('./intra/IntraApp');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.intraApp = new IntraApp();

// Route pour démarrer le processus d'authentification
app.get('/auth/42', (req, res) => {
  const url = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.CALLBACK_URL}&response_type=code`;
  res.redirect(url);
});

// Route pour gérer le callback de l'authentification
app.get('/auth/42/callback', 
  async (req, res) => {
    const code = req.query.code;
    const url = `https://api.intra.42.fr/oauth/token`;

    const requestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.CALLBACK_URL
    });

    const response = await axios.post(url, requestBody.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });
    
    if (response.status !== 200) {
      res.status(500).send('Code not valid');
      return;
    }

    const { access_token, refresh_token, expires_in } = response.data;

    const user = await fetch('https://api.intra.42.fr/v2/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    if (user.status !== 200) {
      res.status(500).send('User not found');
      return;
    }

    const { id, login, created_at } = await user.json();
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
        intraUserCreatedAt: created_at
      },
      { new: true, upsert: true, useFindAndModify: false });
    

    res.redirect(`/redirect?uuid=${uuid}&login=${login}`);
  }
);

// Route pour afficher le profil après connexion
app.get('/redirect', (req, res) => {
  res.send(`You are now connected you can close this tab`);
});

app.get('/logtime', async (req, res) => {
		const bwisniew = await User.findOne({ login: 'bwisniew' });
    if (!bwisniew) {
      res.status(500).send('User not found');
      return;
    }
    
    try {
      const response = await axios.get(`https://api.intra.42.fr/v2/users/${bwisniew.login}/locations_stats`, {
          headers: {
              Authorization: `Bearer ${await app.intraApp.getAuthToken()}`
          },
          params: {
            begin_at: new Date(bwisniew.intraUserCreatedAt).toISOString(),
            end_at: new Date(Date.now()).toISOString()
          }
      });

      res.send(response.data);
    } catch (error) {
      res.status(500).send(error);
      return;
    }

});

app.get('/me', async (req, res) => {
  const bwisniew  = await User.findOne({ login: 'bwisniew' });
  if (!bwisniew) {
    res.status(500).send('User not found');
    return;
  }

  const response = await fetch(`https://api.intra.42.fr/v2/me`, {
    headers: {
      'Authorization': `Bearer ${bwisniew.accessToken}`
    }
  });

  if (response.status !== 200) {
    res.status(500).send('User not found');
    return;
  }

  const data = await response.json();
  res.send(data);
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
