const jwt = require('jsonwebtoken');

const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const UserModel = require('../models/UserModel');

const signJWT = (id) =>
  jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

const sendCookie = (req, res, statusCode, token) => {
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure,
    sameSite: 'none',
  });

  res.status(statusCode).json({
    status: 'success',
  });
};

exports.signup = catchAsyncError(async (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body;

  const newUser = await UserModel.create({
    name,
    email,
    password,
    passwordConfirmation,
  });

  const token = signJWT(newUser._id);

  sendCookie(req, res, 201, token);
});

exports.login = catchAsyncError(async (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;
  if (!email || !password) {
    throw new AppError(400, 'Please enter both your email and password.');
  }

  const user = await UserModel.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(401, 'Your email or password is incorrect.');
  }

  const isPasswordCorrect = await user.checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError(401, 'Your email or password is incorrect.');
  }

  const token = signJWT(user._id);

  sendCookie(req, res, 200, token);
});
