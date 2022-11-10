const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const objectSchema = mongoose.Schema({
  objectName: {
    type: String,
    required: true,
    trim: true,
  },
  objectType: {
    type: String,
    required: true,
    trim: true,
    default: 'Car',
  },
  objectIcon: String,
  objectClientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  objectDeviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  objectDeviceImei: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  objectIsInParkingMode: { type: Boolean, default: false },
  objectUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  objectStatus: {
    type: String,
    enum: ['notactivated', 'activated', 'deactivated', 'expired', 'removed'],
    default: 'notactivated',
  },
  objectCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  objectCreatedAt: Date,
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedAt: Date,
});

// add plugin that converts mongoose to json
objectSchema.plugin(toJSON);
objectSchema.plugin(paginate);
/**
 * Check if IMEI is already added
 * @param {string} objectImei - The object's imei
 * @param {ObjectId} [excludeObjectId] - The id of the object to be excluded
 * @returns {Promise<boolean>}
 */
objectSchema.statics.isDeviceAssigned = async function (objectDeviceId) {
  const object = await this.findOne({ objectDeviceId });
  return !!object;
};
/**
 * @typedef Object
 */

const Object = mongoose.model('Object', objectSchema);

module.exports = Object;
