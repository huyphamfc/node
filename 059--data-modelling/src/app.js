const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/globalErrorController');

dotenv.config();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));

app.all('*', (req, res, next) => {
  next(new AppError(404, `Cannot find ${req.originalUrl} on the server.`));
});

app.use(globalErrorHandler);

module.exports = app;
