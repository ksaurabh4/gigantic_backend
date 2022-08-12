const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error('Password must contain at least one letter and one number');
      }
    },
    private: true, // used by the toJSON plugin
  },
  role: {
    type: String,
    enum: roles,
    default: 'user',
  },
  userPasswordText: {
    type: String,
  },
  userPinText: {
    type: String,
  },
  userPhone: {
    type: String,
    required: true,
    trim: true,
  },
  userFullName: {
    type: String,
    required: true,
    trim: true,
  },
  userCompId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  userCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userCreatedAt: Date,
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedAt: Date,
  userTimeZone: String,
  userIsActive: {
    type: Boolean,
    default: true,
  },
});

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if username is taken
 * @param {string} username - The user's username
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
