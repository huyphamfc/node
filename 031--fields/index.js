const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');


dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const port = process.env.PORT;


mongoose
    .connect(DB)
    .then(() => console.log('Connect DB successfully.'))
    .catch(err => { throw err });


const playerSchema = mongoose.Schema({
    _id: String,
    name: String,
    club: String,
    squad_number: Number
});

const PlayerModel = mongoose.model('Player', playerSchema);


const app = express();

app.use(express.json());

app.get('/players', async (req, res) => {
    try {
        let query = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(property => delete query[property]);

        query = JSON
            .stringify(query)
            .replace(/\b(gte|gt|lte|lt)/g, pattern => `$${pattern}`);
        query = JSON.parse(query);
        query = PlayerModel.find(query);

        if (req.query.sort) {
            query = query.sort(req.query.sort.split(',').join(' '));
        } else {
            query = query.sort('club');
        }

        if (req.query.fields) {
            query = query.select(req.query.fields.split(',').join(' '));
        } else {
            query = query.select('-__v');
        }

        const results = await query;
        if (results.length === 0) throw 'Not found any player.';

        res.status(200).json({
            status: 'success',
            results: results.length,
            data: results
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
    console.log(`Listening on port ${port}...`);
});