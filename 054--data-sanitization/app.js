const express = require('express');
const helmet = require('helmet');
const limiter = require('express-rate-limit');
const sanitization = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const accountRouter = require('./router');

const limitRate = limiter({
  windowMs: 60 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(helmet());

app.use('/', limitRate);

app.use(express.json({ limit: '100kb' }));

// against NoSQL query injection: {field: {"$gte":""}}
app.use(sanitization());

// against attacker malicious HTML injection
app.use(xssClean());

app.use('/accounts', accountRouter);

module.exports = app;
