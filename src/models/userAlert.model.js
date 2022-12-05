const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userAlertSchema = mongoose.Schema({
  userAlertId: { type: mongoose.Schema.Types.ObjectId, ref: "Alert", required: true },
  userAlertText:{ type: String, default:'' },
  userAlertValue: { type: String },
  userAlertUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userAlertObjectsImei: [{ type: String }],
  userAlertEnabledOn: [{ type: String }],
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

// /**
//  * Check if userAlert is already added for this user for this object
//  * @param {string} objectId
//  * @param {string} userId
//  * @returns {Promise<boolean>}
//  */
// userAlertSchema.statics.isAlertAddedForThisObjectForThisUser = async function (objectId,userId) {
//   const userAlert = await this.findOne({ userAlertObjectId: objectId, userAlertUserId: userId  });
//   return !!userAlert;
// };

/**
 * @typedef UserAlert
 */

const UserAlert = mongoose.model('UserAlert', userAlertSchema);

module.exports = UserAlert;
