const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');

dotenv.config();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `I'm a server!`,
  });
});

module.exports = app;
