const AccountModel = require('./model');
const jwt = require('jsonwebtoken');

const createJWTToken = id => {
  return jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

exports.getAllAccounts = async (_, res) => {
  try {
    const results = await AccountModel.find({});
    if (results.length === 0) throw new Error('Data not found.');

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: results,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const account = await AccountModel.create({
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
      passwordUpdateAt: Date.now(),
      role: req.body.role,
    });

    const token = createJWTToken(account._id);

    res.cookie('jwt', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 1),
      httpOnly: true,
      secure: false,
    });

    res.status(201).json({
      status: 'success',
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = 'Email already exists. Try another.';
    }

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

    const account = await AccountModel.findOne({ email }).select('+password');
    if (!account) throw new Error('Your email or password is incorrect.');

    const isPasswordCorrect = await account.verifyPassword(
      password,
      account.password
    );
    if (!isPasswordCorrect) {
      throw new Error('Your email or password is incorrect.');
    }

    const token = createJWTToken(account._id);

    res.cookie('jwt', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 1),
      httpOnly: true,
      secure: false,
    });

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
    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
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

    const passwordUpdateAt = +account.passwordUpdateAt / 1000;
    if (passwordUpdateAt > decodedToken.iat) {
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
