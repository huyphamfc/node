const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const userRouter = express.Router();

userRouter.route('/').get(userController.getAllUsers);

userRouter.route('/signup').post(authController.signup);
userRouter.route('/login').post(authController.login);

module.exports = userRouter;
