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