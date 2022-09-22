const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const studentRouter = require('./router');


dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const port = process.env.PORT;


mongoose
    .connect(DB)
    .then(() => console.log('Connect DB successfully.'))
    .catch(err => console.log(err));


const app = express();
app.use(express.json());

app.use('/students', studentRouter);

app.listen(port, err => {
    if (err) console.log(err);
    console.log(`Listening on port ${port}...`);
});