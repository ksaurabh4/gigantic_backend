const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const modelSchema = mongoose.Schema({
  modelName: {
    type: String,
    required: true,
    trim: true,
  },
  modelPort: {
    type: Number,
    required: true,
    trim: true,
  },
  modelSensors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Sensor'}],
  modelCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  modelCreatedAt: Date,
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedAt: Date,
});

// add plugin that converts mongoose to json
modelSchema.plugin(toJSON);
modelSchema.plugin(paginate);

/**
 * @typedef Model
 */

const Model = mongoose.model('Model', modelSchema);

module.exports = Model;
