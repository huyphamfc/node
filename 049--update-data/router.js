const express = require('express');
const accountControllers = require('./controllers');

const accountRouter = express.Router();

accountRouter.route('/signup').post(accountControllers.signup);

accountRouter.route('/login').post(accountControllers.login);

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

accountRouter
  .route('/update-data')
  .patch(accountControllers.protectRoute, accountControllers.updateData);

module.exports = accountRouter;
