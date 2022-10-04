const express = require('express');
const accountControllers = require('./controllers');

const accountRouter = express.Router();

accountRouter.route('/signup').post(accountControllers.signup);

accountRouter.route('/login').post(accountControllers.login);

accountRouter.route('/forgot-password').post(accountControllers.forgotPassword);

accountRouter
  .route('/reset-password/:token')
  .patch(accountControllers.resetPassword);

accountRouter
  .route('/')
  .get(accountControllers.protectRoute, accountControllers.getAllAccounts);

accountRouter
  .route('/:email')
  .get(accountControllers.protectRoute, accountControllers.getAccountByEmail)
  .delete(
    accountControllers.protectRoute,
    accountControllers.restrictTo('admin'),
    accountControllers.deleteAccountByEmail
  );

module.exports = accountRouter;
