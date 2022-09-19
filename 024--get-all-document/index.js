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

const tourSchema = mongoose.Schema();

const Tour = mongoose.model('Tour', tourSchema);

const app = express();

app.get('/tours', async (req, res) => {
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
});

app.listen(port, err => {
    if (err) throw err;
    console.log(`Listening on port ${port}...`);
});