const mongoose = require('mongoose');


const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name.'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal than 40 characters.'],
        minlength: [10, 'A tour name must have more or equal than 10 characters.']
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration.']
    },
    difficult: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: ['Difficulty is either: easy, medium, difficult']
        }
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    rating: Number
});

const Tour = mongoose.model('Tour', tourSchema);


module.exports = Tour;