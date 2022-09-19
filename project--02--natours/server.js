const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');


dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
mongoose
    .connect(DB)
    .then(() => console.log('Connect DB successfully.'))
    .catch(err => { throw err });

const port = process.env.PORT || 8000;
app.listen(8000, err => {
    if (err) throw err;
    console.log(`Listening on port ${port}...`);
});