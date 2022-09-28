const express = require('express');
const numberRouter = require('./router');


const app = express();
app.use(express.json());
app.use('/numbers', numberRouter);


module.exports = app;