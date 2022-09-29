const mongoose = require('mongoose');


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    age: {
        type: Number,
        required: [true, 'Please enter your age.'],

        // custom validator
        validate: [
            function (value) {
                return value >= 18;
            },
            'The age must be at least 18.'
        ]
    },
    yearOfBirth: {
        type: Number,
        required: [true, 'Please enter your year of birth.'],

        // custom validator
        validate: {
            validator: function (value) {
                return value >= 1582;
            },
            message: 'The year of birth is invalid (>= 1582).'
        }
    }
});

const PersonModel = mongoose.model('Person', personSchema);


module.exports = PersonModel;