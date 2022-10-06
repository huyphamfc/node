const express = require('express');
const accountControllers = require('./controllers');

const accountRouter = express.Router();

accountRouter.route('/').get(accountControllers.getAllAccounts);

module.exports = accountRouter;
