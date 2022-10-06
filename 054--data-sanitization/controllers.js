const jwt = require('jsonwebtoken');
const AccountModel = require('./model');

exports.getAllAccounts = async (_, res) => {
  try {
    const results = await AccountModel.find();

    if (results.length === 0) throw new Error('Data not found.');

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: results,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const createToken = id => {
  return jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

exports.signup = async (req, res) => {
  try {
    const account = await AccountModel.create({
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordUpdateAt: Date.now(),
    });

    const token = createToken(account._id);

    res.status(201).json({
      status: 'success',
      data: account,
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const account = await AccountModel.findOne({ email });
    if (!account) throw new Error('Email or password is incorrect.');

    const isCorrect = await account.isPasswordCorrect(
      password,
      account.password
    );
    if (!isCorrect) throw new Error('Email or password is incorrect.');

    const token = createToken(account._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.protectRoute = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) throw new Error('Please log in to access.');

    const decodedToken = await jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY,
      (err, payload) => {
        if (err) throw new Error('Invalid Signature.');
        return payload;
      }
    );

    const account = await AccountModel.findById(decodedToken.id).select(
      '+passwordUpdateAt'
    );
    if (!account) throw new Error('Account does not exist.');

    if (account.passwordUpdateAt.getTime() > decodedToken.iat * 1000) {
      throw new Error('Password has changed.');
    }

    req.currentAccount = account;

    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};
