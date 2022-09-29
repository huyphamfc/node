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
            passwordConfirm: req.body.passwordConfirm
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

        if (!email || !password) throw 'Please enter both email and password.';

        const account = await AccountModel.findOne({ email });
        if (!account) throw 'Email or password is incorrect.';

        const isCorrect = await account.isPasswordCorrect(password, account.password);
        if (!isCorrect) throw 'Email or password is incorrect.';

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