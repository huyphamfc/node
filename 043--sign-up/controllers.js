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

exports.signup = async (req, res) => {
    try {
        const account = await AccountModel.create({
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        const token = jwt.sign(
            { id: account._id },
            process.env.SECRET_KEY,
            { expiresIn: process.env.EXPIRES_IN }
        );

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