const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');


dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const port = process.env.PORT;


mongoose
    .connect(DB)
    .then(() => console.log('Connect DB successfully.'))
    .catch(err => console.log(err));

const taskSchema = mongoose.Schema({
    name: String,
    duration: Number
});

taskSchema.pre(/^find/, function (next) {
    this.startTime = Date.now();
    console.log('This is a Pre Query Middleware.');
    next();
});

taskSchema.post(/^find/, function (docs, next) {
    console.log('This is a Post Query Middleware.');
    console.log(`Query took ${Date.now() - this.startTime} ms.`);
    next();
});

const TaskModel = new mongoose.model('Task', taskSchema);


const app = express();
app.use(express.json());

app.get('/tasks', async (req, res) => {
    try {
        const results = await TaskModel.find();

        if (results.length === 0) throw 'Page Not Found.';

        res.status(200).json({
            status: 'Success',
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
    if (err) console.log(err);
    console.log(`Listening on port ${port}...`);
});