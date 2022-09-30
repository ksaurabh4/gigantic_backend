const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const deviceSchema = mongoose.Schema({
  deviceImei: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  deviceModelName: {
    type: String,
    required: true,
    trim: true,
  },
  deviceType: {
    type: String,
    required: true,
    enum: ['wired', 'wireless', 'obd'],
    default: 'wired',
  },
  deviceManufacturer: {
    type: String,
    trim: true,
  },
  deviceSimNumber: {
    type: String,
    unique: true,
    trim: true,
  },
  deviceSimProvider: {
    type: String,
    trim: true,
  },
  deviceModelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
  deviceClientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  deviceSensors: [
    {
      parameterName: String,
      sensorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' },
      readingType: String,
      fuelCalibData: { type: mongoose.Schema.Types.ObjectId, ref: 'Fuel' },
    },
  ],
  deviceStatus: {
    type: String,
    enum: ['unassigned', 'assigned', 'activated', 'deactivated'],
    default: 'unassigned',
  },
  deviceCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceCreatedAt: Date,
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedAt: Date,
  deviceDefaultPassword: { type: String, default: '' },
});

// add plugin that converts mongoose to json
deviceSchema.plugin(toJSON);
deviceSchema.plugin(paginate);
/**
 * Check if IMEI is already added
 * @param {string} deviceImei - The device's imei
 * @param {ObjectId} [excludeDeviceId] - The id of the device to be excluded
 * @returns {Promise<boolean>}
 */
deviceSchema.statics.isDeviceAdded = async function (deviceImei, excludeDeviceId) {
  const device = await this.findOne({ deviceImei, _id: { $ne: excludeDeviceId } });
  return !!device;
};
/**
 * @typedef Device
 */

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
