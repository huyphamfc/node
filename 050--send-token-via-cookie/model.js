const mongoose = require('mongoose');
const validateEmail = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

accountSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.name = this.name.trim().toLowerCase();
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }

  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirmation = undefined;
  }

  next();
});

accountSchema.method('verifyPassword', async (password, hash) => {
  return await bcrypt.compare(password, hash);
});

accountSchema.method('createRandomToken', function () {
  const randomToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(randomToken)
    .digest('hex');

  this.passwordResetTokenExpireAt =
    Date.now() + Number(process.env.CRYPTO_EXPIRATION);

  return randomToken;
});

const AccountModel = mongoose.model('Account', accountSchema);

module.exports = AccountModel;
