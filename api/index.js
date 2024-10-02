require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const isLoggedIn = require('./middleware/isLoggedIn');
const cookieParser = require('cookie-parser');
const userParser = require('./middleware/userParser');
const app = express();


module.exports = app;

const corsOptions =  {
  origin: ["https://signin.intra.42.fr", "https://profile.intra.42.fr", `chrome-extension://${process.env.CHROME_EXTENSION_ID}`, `moz-extension://${process.env.FIREFOX_EXTENSION_ID}`],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSucessStatus: 204,
};


app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userParser);
app.use('/auth', require('./routes/auth'));
app.use('/user', isLoggedIn, require('./routes/user'));
app.use('/firefox', require('./routes/firefox'));


// app.get('/logtime', isLoggedIn, async (req, res) => {
// 		const user = req.user;
//     const logtime = await user.getLogtime();
//     if (!logtime)
//       res.status(500).send('Error while fetching logtime');
//     var resLogtime = {};
//     logtime.forEach(element => {
//       resLogtime[new Date(element.date).toLocaleDateString('en-CA')] = element.duration;
//     });
//     res.send(resLogtime);
// });

app.get('/me', isLoggedIn, async (req, res) => {
  const response = await fetch(`https://api.intra.42.fr/v2/me`, {
    headers: {
      'Authorization': `Bearer ${await req.user.getToken()}`
    }
  });

  if (response.status !== 200) {
    res.status(404).send('User not found');
    return;
  }

  const data = await response.json();
  res.send(data);
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
