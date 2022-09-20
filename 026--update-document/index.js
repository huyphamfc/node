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


const dataSchema = mongoose.Schema({ _id: String, name: String });
const DataModel = mongoose.model('Data', dataSchema);


const app = express();
app.use(express.json());

app.patch('/data/:id', async (req, res) => {
    try {
        const updatedData = await DataModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedData) throw 'Invalid ID.';
        res.status(201).json({
            status: 'success',
            data: updatedData
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