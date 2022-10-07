const express = require('express');
const helmet = require('helmet');
const limiter = require('express-rate-limit');
const path = require('path');
const router = require('./router');

const limitRate = limiter({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Too many requests are sent. Please try again later.',
});

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('view', path.join(__dirname, 'views'));

app.use(helmet());

app.use(limitRate);

app.use(express.json({ limit: '100kb' }));

app.use('/', router);

app.listen(8000, err => {
  if (err) console.log(err);
  console.log('Server running on port 8000...');
});
