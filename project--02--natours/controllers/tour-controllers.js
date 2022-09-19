const Tour = require('../models/tour-model');


exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        newTour.save();
        res.status(201).json({
            status: 'success',
            data: newTour
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).json({
            status: 'success',
            data: { tours }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}