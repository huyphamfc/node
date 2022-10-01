const express = require('express');
const accountController = require('./controllers');


const accountRouter = express.Router();

accountRouter
    .route('/')
    .get(
        accountController.protectRoute,
        accountController.getAllAccounts
    );

accountRouter
    .route('/:email')
    .get(
        accountController.protectRoute,
        accountController.getAccountByEmail
    )
    .delete(
        accountController.protectRoute,
        accountController.restrictTo('admin'),
        accountController.deleteAccount
    );

accountRouter.post('/signup', accountController.signup);

accountRouter.post('/login', accountController.login);


module.exports = accountRouter;