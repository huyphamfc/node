const mongoose = require('mongoose');
const validatorLib = require('validator');


const infoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email.'],
        lowercase: true,

        // validator library
        validate: [validatorLib.isEmail, 'Please enter a valid email.']
    }
});

const InfoModel = mongoose.model('Info', infoSchema);


module.exports = InfoModel;