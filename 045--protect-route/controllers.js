const jwt = require('jsonwebtoken');
const AccountModel = require('./model');


exports.getAllAccounts = async (_, res) => {
    try {
        const results = await AccountModel.find({});

        if (results.length === 0) throw 'Data not found.';

        res.status(200).json({
            status: 'success',
            results: results.length,
            data: results
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}


const createToken = id => jwt.sign(
    { id },
    process.env.SECRET_KEY,
    { expiresIn: process.env.EXPIRES_IN }
);

exports.signup = async (req, res) => {
    try {
        const account = await AccountModel.create({
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation,
            passwordUpdateAt: Date.now()
        });

        const token = createToken(account._id);

        res.status(201).json({
            status: 'success',
            data: account,
            token
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) throw 'Please enter both your email and password.';

        const account = await AccountModel.findOne({ email }).select('+password');

        if (!account) throw 'Your email or password is incorrect.';

        const isCorrect = await account.isPasswordCorrect(password, account.password);
        if (!isCorrect) throw 'Your email or password is incorrect.';

        const token = createToken(account._id);

        res.status(200).json({
            status: 'success',
            token
        });
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err
        });
    }
}


exports.protectRoute = async (req, res, next) => {
    try {
        let token;

        // get token
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) throw 'Please log in to access.';

        // verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // confirm the account still exists during the token valid time
        const account = await AccountModel.findById(decoded.id).select('+passwordUpdateAt');
        if (!account) throw 'Account does not exist.';

        // confirm the password of the account did not change during the token valid time
        const passwordUpdateAt = +account.passwordUpdateAt / 1000;
        if (passwordUpdateAt > decoded.iat) throw 'Password has changed.';

        next();
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err
        });
    }
}