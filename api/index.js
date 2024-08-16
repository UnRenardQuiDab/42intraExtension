require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { default: axios } = require('axios');
const User = require('./model/user');
const cors = require('cors');
const generateAccessToken = require('./auth/generateAccessToken');
const isLoggedIn = require('./middleware/isLoggedIn');
const cookieParser = require('cookie-parser');
const app = express();


module.exports = app;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions =  {
    origin: [process.env.EXT_URI, "signin.intra.42.fr"],
    credentials: true,
    optionSucessStatus: 200,
};
app.use(cors(corsOptions));

app.use(async (req, res, next) => {
  let uuid = req.cookies.uuid;
  if (!uuid) {
    uuid = req.headers['x-42intratools-key'];
  }
  req.user = await User.findOne({ uuid: uuid });
  next();
});

app.get('/auth/42', (req, res) => {
  const url = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.CALLBACK_URL}&response_type=code`;
  res.redirect(url);
});

app.get('/auth/42/callback', 
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
      res.redirect(`/redirect?uuid=${uuid}&login=${login}`);
    });
});


app.get('/redirect', (req, res) => {
  res.send(`You are now connected you can close this tab`);
});

app.get('/logtime', isLoggedIn, async (req, res) => {
		const user = req.user;
    //console.log(await user.getLogtime());
    res.send(await user.getLogtime());
    // if (!user) {
    //   res.status(500).send('User not found');
    //   return;
    // }
    
    // try {
    //   const response = await axios.get(`https://api.intra.42.fr/v2/users/${user.login}/locations_stats`, {
    //       headers: {
    //           Authorization: `Bearer ${await app.intraApp.getAuthToken()}`
    //       },
    //       params: {
    //         begin_at: new Date(user.intraUserCreatedAt).toISOString(),
    //         end_at: new Date(Date.now()).toISOString()
    //       }
    //   });

    //   res.send(response.data);
    // } catch (error) {
    //   res.status(500).send(error);
    //   return;
    // }

});

app.get('/me', isLoggedIn, async (req, res) => {
  const bwisniew  = await User.findOne({ login: 'bwisniew' });
  if (!bwisniew) {
    res.status(500).send('User not found');
    return;
  }

  const response = await fetch(`https://api.intra.42.fr/v2/me`, {
    headers: {
      'Authorization': `Bearer ${await bwisniew.getToken()}`
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
