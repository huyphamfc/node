const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/user-routes');
const countryRouter = require('./routes/country-routes');


const app = express();
app.use(morgan('dev'));
app.use('/users', userRouter);
app.use('/countries', countryRouter);


module.exports = app;