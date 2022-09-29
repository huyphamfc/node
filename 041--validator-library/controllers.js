const InfoModel = require('./model');


exports.getAllInfo = async (_, res) => {
    try {
        const results = await InfoModel.find({});

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
        const info = await InfoModel.create({
            name: req.body.name,
            email: req.body.email
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