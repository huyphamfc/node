const mongoose = require('mongoose');
const validateEmail = require('validator');

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name.'],
  },

  email: {
    type: String,
    required: [true, 'Please enter your email.'],
    validate: [validateEmail.isEmail, 'Please enter a valid email.'],
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, 'Please enter your password.'],
    minLength: [8, 'The password must be at least 8 characters.'],
    select: false,
  },

  passwordConfirmation: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator(value) {
        return value === this.password;
      },
      message: 'The password confirmation does not match.',
    },
  },

  passwordUpdateAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpireAt: Date,

  role: {
    type: String,
    enum: ['admin', 'guide', 'lead-guide', 'user'],
    default: 'user',
  },
});

const AccountModel = mongoose.model('Account', accountSchema);

module.exports = AccountModel;
