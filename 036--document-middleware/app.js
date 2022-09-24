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

taskSchema.pre('save', function (next) {
    console.log('This is a Pre Document Middleware.');
    console.log(this);
    next();
});

taskSchema.post('save', function (doc, next) {
    console.log('This is a Post Document Middleware.');
    console.log(doc);
    next();
});

const TaskModel = new mongoose.model('Task', taskSchema);


const app = express();
app.use(express.json());

app.post('/tasks', async (req, res) => {
    try {
        const task = new TaskModel(req.body);
        await task.save();
        res.status(201).json({
            status: 'Done.'
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
});

app.listen(port, err => {
    if (err) console.log(err);
    console.log(`Listening on port ${port}...`);
});