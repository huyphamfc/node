const express = require('express');
const personRouter = require('./router');


const app = express();
app.use(express.json());
app.use('/people', personRouter);


module.exports = app;