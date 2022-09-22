const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');


dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const port = process.env.PORT;


mongoose
    .connect(DB)
    .then(() => console.log('Connect DB successfully.'))
    .catch(err => console.log(err));


const userSchema = mongoose.Schema({
    name: String,
    phone: Number,
    address: String
});

const UserModel = mongoose.model('User', userSchema);


const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        let query = { ...req.query };

        const excludedFields = ['sort', 'limit', 'fields', 'page'];
        excludedFields.forEach(property => delete query[property]);

        query = UserModel.find();

        if (req.query.page || req.query.limit) {
            const page = req.query.page * 1 || 1;
            const limit = req.query.limit * 1 || 5;
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
            // page 1: 1-limit documents
            // page 2: (limit + 1)-(2*limit) documents
            // page ... : ...
            const numberOfUsers = await UserModel.countDocuments();
            if (skip >= numberOfUsers) throw 'This page is not exist.';
        }

        const result = await query;

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
});

app.listen(port, err => {
    if (err) throw err;
    console.log(`Listening on port ${port}`);
});