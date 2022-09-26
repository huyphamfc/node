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

taskSchema.pre('aggregate', function (next) {
    console.log('This is a Pre Aggregation Middleware.');
    console.log(this.pipeline());
    next();
});

taskSchema.post('aggregate', function (_, next) {
    console.log('This is a Post Aggregation Middleware.');
    next();
});

const TaskModel = new mongoose.model('Task', taskSchema);


const app = express();
app.use(express.json());

app.get('/tasks', async (req, res) => {
    try {
        const results = await TaskModel.aggregate([
            { $match: {} },
            {
                $group: {
                    _id: null,
                    maxTime: { $max: "$duration" },
                    minTime: { $min: "$duration" },
                    totalTime: { $sum: "$duration" }
                }
            }
        ]);

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