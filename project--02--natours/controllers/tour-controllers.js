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
        let query = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete query[field]);

        query = JSON
            .stringify(query)
            .replace(/\b(gte|gt|lte|lt)/g, pattern => `$${pattern}`);
        query = JSON.parse(query);

        const tours = await Tour.find(query);
        res.status(200).json({
            status: 'success',
            data: tours
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: tour
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedTour) throw 'Invalid ID.';
        res.status(200).json({
            status: 'success',
            data: updatedTour
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deleteTour = async (req, res) => {
    try {
        const result = await Tour.findByIdAndDelete(req.params.id);
        if (!result) throw 'Invalid ID.';
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (er) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}