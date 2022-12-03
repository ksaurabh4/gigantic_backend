const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const alertSchema = mongoose.Schema({
  alertName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  alertKey: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  alertType: {
    type: String,
    enum: ["logic", "value", "fence", "poi", "none"],
    default: "none",
  },
  alertText1: { type: String },
  alertText2: { type: String },
  alertCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  alertCreatedAt: Date,
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedAt: Date,
});

// add plugin that converts mongoose to json
alertSchema.plugin(toJSON);
alertSchema.plugin(paginate);

/**
 * @typedef Alert
 */

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
