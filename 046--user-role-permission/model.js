const mongoose = require('mongoose');
const validation = require('validator');
const bcrypt = require('bcrypt');


const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter your email.'],
        unique: true,
        lowercase: true,
        validate: [validation.isEmail, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password.'],
        minLength: [true, 'The password must be at least 8 characters.'],
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
    },
    role: {
        type: String,
        // "enum" is an array. Creating a validator to check that the value is in the "enum" or not
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    }
});


accountSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirmation = undefined;

    next();
});

accountSchema.method(
    'verifyPassword',
    async (inputPassword, databasePassword) =>
        await bcrypt.compare(inputPassword, databasePassword)
);


const AccountModel = mongoose.model('Account', accountSchema);


module.exports = AccountModel;