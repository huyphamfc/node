const NumberModel = require('./model');


exports.getAllNumbers = async (_, res) => {
    try {
        const results = await NumberModel.find();

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

exports.createNumber = async (req, res) => {
    try {
        const newNumber = await NumberModel.create({
            message: req.body.message,
            value: req.body.value
        });

        res.status(200).json({
            status: 'success',
            data: newNumber
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}