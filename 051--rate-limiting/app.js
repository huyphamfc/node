const express = require('express');
const limiter = require('express-rate-limit');
const accountRouter = require('./router');

const limitRate = limiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many requests, please try again later.',
});

const app = express();
app.use('/', limitRate);
app.use(express.json());
app.use('/accounts', accountRouter);

module.exports = app;
