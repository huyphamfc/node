const mongoose = require('mongoose');
const validateEmail = require('validator');
const bcrypt = require('bcrypt');


const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter your email.'],
        unique: [true, 'Email already exists.'],
        lowercase: true,
        validate: [validateEmail.isEmail, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password.'],
        minLength: [8, 'The password must be at least 8 characters.'],
        select: false
    },
    passwordConfirmation: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'The password confirmation does not match.'
        }
    },
    passwordUpdateAt: {
        type: String,
        select: false
    }
});

accountSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirmation = undefined;

    next();
});

accountSchema.method(
    'isPasswordCorrect', async function (inputPassword, databasePassword) {
        return await bcrypt.compare(inputPassword, databasePassword);
    }
);

const AccountModel = mongoose.model('Account', accountSchema);


module.exports = AccountModel;