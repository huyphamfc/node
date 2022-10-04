const jwt = require('jsonwebtoken');
const validateEmail = require('validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const AccountModel = require('./model');

// prettier-ignore
const createToken = id => jwt.sign(
    { id }, 
    process.env.JWT_PRIVATE_KEY, 
    { expiresIn: process.env.JWT_EXPIRATION}
);

exports.getAllAccounts = async (_, res) => {
  try {
    const accounts = await AccountModel.find();

    if (accounts.length === 0) throw 'Data not found.';

    res.status(200).json({
      status: 'success',
      results: accounts.length,
      data: accounts,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getAccountByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const isEmail = validateEmail.isEmail(email);
    if (!isEmail) throw 'Email is invalid.';

    const result = await AccountModel.findOne({ email });
    if (!result) throw 'Email does not exist.';

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteAccountByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const isEmail = validateEmail.isEmail(email);
    if (!isEmail) throw 'Email is invalid.';

    const result = await AccountModel.findOneAndDelete({ email });
    if (!result) throw 'Email does not exist.';

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.signup = async (req, res) => {
  const payload = req.body;
  try {
    const account = await AccountModel.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      passwordConfirmation: payload.passwordConfirmation,
      passwordUpdateAt: Date.now(),
      role: payload.role,
    });

    const token = createToken(account._id);

    res.status(201).json({
      status: 'success',
      token,
    });
  } catch (err) {
    if (err.code === 11000) err.message = 'Email already exists.';
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw 'Please enter both your email and password.';

    const isEmail = validateEmail.isEmail(email);
    if (!isEmail) throw 'Email is invalid.';

    const account = await AccountModel.findOne({ email }).select('+password');
    if (!account) throw 'Your email or password is incorrect.';

    const isPasswordCorrect = await account.verifyPassword(
      password,
      account.password
    );
    if (!isPasswordCorrect) throw 'Your email or password is incorrect.';

    const token = createToken(account._id);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.protectRoute = async (req, res, next) => {
  try {
    const payload = req.headers.authorization;
    if (!payload || !payload.startsWith('Bearer')) {
      throw 'Please log in to access.';
    }

    const token = payload.split(' ')[1];
    await jwt.verify(token, process.env.JWT_PRIVATE_KEY, err => {
      if (err) throw 'Signature invalid.';
    });

    const decodedToken = jwt.decode(token);
    const account = await AccountModel.findById(decodedToken.id).select(
      '+password'
    );
    if (!account) throw 'Account no longer exists.';

    if (account.passwordUpdateAt.getTime() > decodedToken.iat * 1000) {
      throw 'Session expired.';
    }

    req.currentAccount = account;

    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.restrictTo = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!roles.includes(req.currentAccount.role))
        throw 'Permission Required.';

      next();
    } catch (err) {
      res.status(403).json({
        status: 'fail',
        message: err,
      });
    }
  };
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const isEmail = validateEmail.isEmail(email);
    if (!isEmail) throw 'Please enter a valid email.';

    const account = await AccountModel.findOne({ email });
    if (!account) throw 'Account does not exist.';

    const passwordResetToken = account.createRandomToken();
    await account.save({ validateBeforeSave: false });

    // prettier-ignore
    const resetURL = `${req.protocol}://${req.get('host')}/accounts/reset-password/${passwordResetToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'Huy Pham <admin@huyphamfc.com>',
      to: email,
      subject: 'Your password reset token (valid in 10 minutes)',
      text: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions, err => {
      if (!err) return;
      account.passwordResetToken = undefined;
      account.passwordResetTokenExpireAt = undefined;
      account.save({ validateBeforeSave: false });

      res.status(500).json({
        status: 'fail',
        message: 'There was an error sending the email. Try again later.',
      });
    });

    res.status(200).json({
      status: 'success',
      message: `The token is sent to the user's email.`,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const account = await AccountModel.findOne({
      passwordResetToken,
      passwordResetTokenExpireAt: { $gt: Date.now() },
    });
    if (!account) throw 'Token is invalid or expired.';

    account.password = req.body.password;
    account.passwordConfirmation = req.body.passwordConfirmation;
    account.passwordResetToken = undefined;
    account.passwordResetTokenExpireAt = undefined;
    account.passwordUpdateAt = Date.now();
    await account.save();

    const token = createToken(account._id);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const payload = req.body;
    const account = req.currentAccount;

    if (!payload.passwordCurrent) throw 'Please enter your password.';
    if (
      !(await account.verifyPassword(payload.passwordCurrent, account.password))
    ) {
      throw 'Password is incorrect.';
    }

    account.password = payload.password;
    account.passwordConfirmation = payload.passwordConfirmation;
    account.passwordUpdateAt = Date.now();

    await account.save();

    const token = createToken(account._id);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
