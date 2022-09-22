const mongoose = require('mongoose');


const studentSchema = mongoose.Schema({
    name: String,
    grade: Number,
    score: Number,
    address: String
});

const studentModel = mongoose.model('Student', studentSchema);


module.exports = studentModel;