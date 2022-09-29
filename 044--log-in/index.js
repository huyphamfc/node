const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');


dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const port = process.env.PORT || 8000;


mongoose
    .connect(DB)
    .then(() => console.log('Connect MongoDB successfully.'))
    .catch(err => console.log(err));


app.listen(port, err => {
    if (err) console.log(err);
    console.log(`Listening on port ${port}...`);
});