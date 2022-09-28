const mongoose = require('mongoose');


const numberSchema = new mongoose.Schema({
    message: {
        type: String,
        required: [true, 'Please enter your message.'],

        // built-in validator
        minLength: [3, 'The message must have at least 3 characters.']
    },
    value: {
        type: Number,
        required: [true, 'Please enter your value.'],

        // built-in validator
        min: [0, 'The number must be greater than or equal to 0.']
    }
});

const NumberModel = mongoose.model('Number', numberSchema);


module.exports = NumberModel;