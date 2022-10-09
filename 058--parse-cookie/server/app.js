const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const accountRouter = require('./router');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5500',
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors());

app.use(helmet());

const limitRate = limiter({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.',
});

app.use('/', limitRate);

app.use(express.json({ limit: '100kb' }));

app.use(cookieParser());

app.use('/api/accounts', accountRouter);

module.exports = app;
