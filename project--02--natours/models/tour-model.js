const mongoose = require('mongoose');


const tourSchema = mongoose.Schema({
    _id: String,
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
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size.']
    },
    difficult: {
        type: String,
        required: [true, 'A tour must have a difficulty.'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: ['Difficulty is either: easy, medium, difficult.']
        }
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price.']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description.']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image.']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);


module.exports = Tour;