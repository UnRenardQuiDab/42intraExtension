require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const isLoggedIn = require('./middleware/isLoggedIn');
const cookieParser = require('cookie-parser');
const userParser = require('./middleware/userParser');
const api42 = require('./api42');
const app = express();


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

app.get('/me', isLoggedIn, async (req, res) => {
  try {
    res.send(await api42.whoAmI(req.user.intraToken));
    await req.user.save();
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
