const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getDevicesTrackingData = {
  query: Joi.object().keys({
    protocol: Joi.string(),
    deviceClientId: Joi.string().custom(objectId),
    vehicleStatus: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDeviceTrackingData = {
  params: Joi.object().keys({
    imei: Joi.string(),
  }),
};

const sendCommand = {
  body: Joi.object().keys({
    imei: Joi.string().required(),
    cmdType: Joi.string().required(),
    port: Joi.string().required(),
    sentFrom: Joi.string(),
    devicePin: Joi.string(),
    userPin: Joi.number(),
  }),
};


module.exports = {
  getDevicesTrackingData,
  getDeviceTrackingData,
  sendCommand,
};
