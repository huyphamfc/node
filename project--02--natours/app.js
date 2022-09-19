const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routers/tour-routers');


dotenv.config({ path: './config.env' });

const app = express();
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use('/tours', tourRouter);


module.exports = app;