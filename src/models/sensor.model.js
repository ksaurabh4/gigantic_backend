const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const sensorSchema = mongoose.Schema({
  sensorName: { type: String, unique: true },
  sensorType: {
    type: String,
    enum: ['analog', 'digital', 'volt'],
    default: 'digital',
  },
  sensorOption1: String,
  sensorOption2: String,
  deviceCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceCreatedAt: Date,
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedAt: Date,
});

// add plugin that converts mongoose to json
sensorSchema.plugin(toJSON);
sensorSchema.plugin(paginate);

/**
 * @typedef Device
 */

const Device = mongoose.model('Sensor', sensorSchema);

module.exports = Device;
