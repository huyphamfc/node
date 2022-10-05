const jwt = require('jsonwebtoken');
const validateEmail = require('validator');
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

exports.updateData = async (req, res) => {
  try {
    const account = req.currentAccount;
    const payload = req.body;

    if (payload.password || payload.passwordConfirmation) {
      throw new Error('Cannot update password here.');
    }

    account.name = payload.name || account.name;
    account.email = payload.email || account.email;
    await account.save({ validateModifiedOnly: true });

    res.status(201).json({
      status: 'success',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
