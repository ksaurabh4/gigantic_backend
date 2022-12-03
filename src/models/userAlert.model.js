const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userAlertSchema = mongoose.Schema({
  userAlertId: { type: mongoose.Schema.Types.ObjectId, ref: "alert" },
  userAlertDevices: [{ type: mongoose.Schema.Types.ObjectId, ref: "devices" }],
  userAlertUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userAlertText: { type: String },
  userAlertEnabledOn: [{ type: String }],
  userAlertValue: { type: String },
  userAlertWebhook: { type: String },
  userAlertEmail: { type: String },
  userAlertPhone: { type: String },
  userAlertCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userAlertCreatedAt: Date,
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedAt: Date,
});

// add plugin that converts mongoose to json
userAlertSchema.plugin(toJSON);
userAlertSchema.plugin(paginate);

/**
 * @typedef UserAlert
 */

const UserAlert = mongoose.model('UserAlert', userAlertSchema);

module.exports = UserAlert;
