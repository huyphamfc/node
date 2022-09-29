const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const passwordSchema = new mongoose.Schema({
    key: {
        type: String,
        required: [true, 'Please enter your key.']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password.']
    }
});

passwordSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    // encrypt password
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

const PasswordModel = mongoose.model('Password', passwordSchema);


module.exports = PasswordModel;