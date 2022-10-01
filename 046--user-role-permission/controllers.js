const AccountModel = require('./model');
const jwt = require('jsonwebtoken');


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
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}


exports.getAccountByEmail = async (req, res) => {
    try {
        const account = await AccountModel.findOne({ email: req.params.email });
        if (!account) throw 'Account does not exist.';

        res.status(200).json({
            status: 'success',
            data: account
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}


exports.deleteAccount = async (req, res) => {
    try {
        const account = await AccountModel.findOneAndDelete({ email: req.params.email });
        if (!account) throw 'Invalid email.';

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err
        });
    }
}


const createToken = id => jwt.sign(
    { id }, process.env.PRIVATE_KEY, { expiresIn: process.env.EXPIRATION }
);

exports.signup = async (req, res) => {
    try {
        const account = await AccountModel.create({
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation,
            passwordUpdateAt: Date.now(),
            role: req.body.role
        });

        const token = jwt.sign(
            { id: account._id },
            process.env.PRIVATE_KEY,
            { expiresIn: process.env.EXPIRATION }
        );

        res.status(201).json({
            status: 'success',
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

        if (!email || !password) throw 'Please enter both email and password.';

        const account = await AccountModel.findOne({ email }).select('+password');
        if (!account) throw 'Your email or password is incorrect.';

        const isPasswordCorrect = await account.verifyPassword(password, account.password);
        if (!isPasswordCorrect) throw 'Your email or password is incorrect.';

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
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) throw 'Please log in to access.';

        const decodedToken = await jwt.verify(
            token,
            process.env.PRIVATE_KEY,
            (err, payload) => {
                if (err) throw 'Invalid Signature.';
                return payload;
            }
        );

        const account = await AccountModel.findById(decodedToken.id).select('+passwordUpdateAt');
        if (!account) throw 'Account does not exist.';

        const passwordUpdateAt = +account.passwordUpdateAt / 1000;
        if (passwordUpdateAt > decodedToken.iat) throw 'Password has changed.';

        // pass "account" document to the next middleware
        req.currentAccount = account;
        next();
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err
        });
    }
}


// cannot pass arguments into the middleware => wrap middleware into a function
exports.restrictTo = (...roles) => async (req, res, next) => {
    try {
        if (!roles.includes(req.currentAccount.role)) throw 'You do not have permission.';

        next();
    } catch (err) {
        res.status(403).json({
            status: 'fail',
            message: err
        });
    }
}