const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const router = require('./router');


const app = express();

dotenv.config({ path: './config.env' });
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/data', router);


module.exports = app;