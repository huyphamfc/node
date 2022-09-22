const studentModel = require('./model');
const APIFeatures = require('./api-features');


exports.getAllStudents = async (req, res) => {
    try {
        // let query = { ...req.query };

        // const excludedFields = ['sort', 'fields', 'page', 'limit'];
        // excludedFields.forEach(property => delete query[property]);

        // query = JSON
        //     .stringify(query)
        //     .replace(/\b(gte|gt|lte|lt)/g, pattern => `$${pattern}`);
        // query = JSON.parse(query);

        // query = studentModel.find(query);

        // if (req.query.sort) {
        //     query = query.sort(req.query.sort.replaceAll(',', ' '));
        // } else {
        //     query = query.sort('name');
        // }

        // if (req.query.fields) {
        //     query = query.select(req.query.fields.replaceAll(',', ' '));
        // } else {
        //     query = query.select('-address');
        // }

        // if (req.query.page || req.query.limit) {
        //     const page = req.query.page || 1;
        //     const limit = req.query.limit || 3;
        //     const skip = (page - 1) * limit;

        //     query = query.skip(skip).limit(limit);
        // }

        const data = new APIFeatures(studentModel, req.query);
        data
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const result = await data.result;
        if (result.length === 0) throw 'Data is not exist.';

        res.status(200).json({
            status: 'success',
            results: result.length,
            data: result
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getStudentById = async (req, res) => {
    try {
        const result = await studentModel.findById({ _id: req.params.id });

        if (!result) throw 'Invalid ID.';
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.updateStudentById = async (req, res) => {
    try {
        const result = await studentModel.findByIdAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!result) throw 'Invalid ID.';
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deleteStudentById = async (req, res) => {
    try {
        const result = await studentModel.findByIdAndDelete({ _id: req.params.id });

        if (!result) throw 'Invalid ID.';
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}