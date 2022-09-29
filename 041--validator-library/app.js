const express = require('express');
const infoRouter = require('./router');


const app = express();
app.use(express.json());
app.use('/info', infoRouter);


module.exports = app;