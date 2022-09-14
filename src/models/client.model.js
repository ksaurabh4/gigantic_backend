const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const clientSchema = mongoose.Schema({
  compName: {
    type: String,
    required: true,
    trim: true,
  },
  compContactPerson: {
    type: String,
    required: true,
    trim: true,
  },
  compEmail: {
    type: String,
    trim: true,
  },
  compSalesPerson: { type: String },
  compSupportNumber: { type: String },
  compSupportEmail: { type: String },
  compPrimaryUser: { type: String, unique: true, required: true },
  compAddress: { type: String },
  compCity: { type: String },
  compState: { type: String },
  compZip: { type: String },
  compCountry: {
    type: String,
    required: true,
    trim: true,
  },
  compPhone: {
    type: String,
    trim: true,
  },
  compCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  compCreatedAt: Date,
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedAt: Date,
  compParentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  compIsReseller: {
    type: Boolean,
    default: false,
  },
  compIsActive: {
    type: Boolean,
    default: true,
  },
  // compLevel: { type: Number, default: 4 },
  compLogoUrl: { type: String, default: 'https://media.skywonder.com/clientLogo/60853b915133ea04f449d896.png' },
  compDemoDetails: {
    id: { type: String, default: '' },
    pswd: { type: String, default: '' },
  },
  compPreferredLang: { type: String, default: 'english' },
  compPreferredCoordinates: {
    type: { type: String },
    coordinates: [],
  },
  compDomain: { type: String },
  compIp: { type: String },
  compIsWhiteLabelled: Boolean,
});

// add plugin that converts mongoose to json
clientSchema.plugin(toJSON);
clientSchema.plugin(paginate);

// tie an index to the schema
clientSchema.index({ compPreferredCoordinates: '2dsphere' });

/**
 * @typedef Client
 */

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
