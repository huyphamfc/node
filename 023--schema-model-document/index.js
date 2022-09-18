const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;

mongoose
    .connect(DB)
    .then(con => {
        console.log(con.connections);
        console.log('Connect DB successfully.');
    })
    .catch(err => { throw err });

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: [true, 'Must have a number!']
    },
    address: String
});

const User = mongoose.model('User', userSchema);

const testUser = new User({
    name: 'JavaScript',
    age: 26,
    address: 'USA'
});

testUser
    .save()
    .then(doc => {
        console.log(doc);
        console.log('Update document successfully.');
    })
    .catch(err => { throw err });
