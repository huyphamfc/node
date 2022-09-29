const PersonModel = require('./model');


exports.getAllPerson = async (_, res) => {
    try {
        const results = await PersonModel.find({});

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
        const person = await PersonModel.create({
            name: req.body.name,
            age: req.body.age,
            yearOfBirth: req.body.yearOfBirth
        });

        res.status(201).json({
            status: 'success',
            data: person
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}