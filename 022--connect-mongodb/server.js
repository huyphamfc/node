const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');


dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
mongoose
    .connect(DB)
    .then(con => {
        console.log(con.connections);
        console.log('Connect DB successfully!');
    })

const port = process.env.PORT || 3000;
app.listen(port);