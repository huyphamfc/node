const jwt = require('jsonwebtoken');

const UserModel = require('../models/UserModel');
const catchAsyncError = require('../utils/catchAsyncError');

const signJWT = (id) =>
  jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

const sendCookie = (req, res, token) => {
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure,
    sameSite: 'none',
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

  sendCookie(req, res, token);

  res.status(201).json({
    status: 'success',
  });
});
