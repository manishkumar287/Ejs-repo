const express = require('express');
const bodyParser = require('body-parser');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set your reCAPTCHA keys
const RECAPTCHA_SITE_KEY = process.env.SITE_KEY;
const RECAPTCHA_SECRET_KEY = process.env.SECRET_KEY;

// Create a new instance of Recaptcha
const recaptcha = new Recaptcha(RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY);

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Routes
app.get('/', (req, res) => {
  res.render('contact',{ captcha: recaptcha.render(), siteKey: RECAPTCHA_SITE_KEY });
});

app.post('/submit', recaptcha.middleware.verify, (req, res) => {
if (req.recaptcha.error) {
    console.error('Captcha verification error:', req.recaptcha.error);
    res.send('Captcha verification failed. Please try again.');
  } else {
    // Your form handling logic
    res.send('Form submitted successfully!');
  }
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
