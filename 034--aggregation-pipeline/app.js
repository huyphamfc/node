const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const orderRouter = require('./router');


dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const port = process.env.PORT;


mongoose
    .connect(DB)
    .then(() => console.log('Connect DB successfully.'))
    .catch(err => console.log(err));


const app = express();

app.use('/orders', orderRouter);

app.listen(port, err => {
    if (err) throw err;
    console.log(`Listening on port ${port}...`);
});