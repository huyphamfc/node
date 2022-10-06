const express = require('express');
const helmet = require('helmet');
const limiter = require('express-rate-limit');
const sanitization = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const accountRouter = require('./router');

const limitRate = limiter({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.',
});

const app = express();

app.use(helmet());

app.use('/', limitRate);

app.use(express.json({ limit: '100kb' }));

app.use(sanitization());

app.use(xssClean());

app.use(
  hpp({
    whitelist: ['name', 'email'],
  })
);
// GET / name=Huy&name=Huy

app.use('/accounts', accountRouter);

module.exports = app;
