const PasswordModel = require('./model');


exports.getAllInfo = async (_, res) => {
    try {
        const results = await PasswordModel.find({});

        if (results.length === 0) throw 'Data not found';

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

exports.register = async (req, res) => {
    try {
        const info = await PasswordModel.create({
            key: req.body.key,
            password: req.body.password
        });

        res.status(201).json({
            status: 'success',
            data: info
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}