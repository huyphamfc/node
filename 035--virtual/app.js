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

const taskSchema = new mongoose.Schema(
    {
        name: String,
        duration: Number
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

taskSchema
    .virtual('week')
    .get(function () {
        return (this.duration / 7).toFixed(1);
    });

const TaskModel = mongoose.model('Task', taskSchema);


const app = express();

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await TaskModel.find();

        if (tasks.length === 0) throw 'Page not found.';

        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: tasks
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