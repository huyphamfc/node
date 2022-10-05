const express = require('express');
const accountControllers = require('./controllers');

const accountRouter = express.Router();

accountRouter.route('/signup').post(accountControllers.signup);

accountRouter.route('/login').post(accountControllers.login);

accountRouter
  .route('/')
  .get(accountControllers.protectRoute, accountControllers.getAllAccounts);

module.exports = accountRouter;
