const express = require('express');
const passwordRouter = require('./router');


const app = express();
app.use(express.json());
app.use('/passwords', passwordRouter);


module.exports = app;