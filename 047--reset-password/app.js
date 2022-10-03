const express = require('express');
const accountRouter = require('./router');

const app = express();
app.use(express.json());
app.use('/accounts', accountRouter);

module.exports = app;
