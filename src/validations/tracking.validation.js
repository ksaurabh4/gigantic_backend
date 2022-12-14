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

const getNotAddedDevicesData = {
  query: Joi.object().keys({
    protocol: Joi.string(),
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

const getDeviceDataByImei = {
  query: Joi.object().keys({
    imei: Joi.string(),
    from: Joi.date().required(),
    to: Joi.date().required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const sendCommand = {
  body: Joi.object().keys({
    imei: Joi.string().required(),
    cmdType: Joi.string().required(),
    cmdContent: Joi.string().required(),
    port: Joi.string().required(),
    sentFrom: Joi.string(),
    devicePin: Joi.string(),
    userPin: Joi.number(),
  }),
};


module.exports = {
  getDevicesTrackingData,
  getDeviceDataByImei,
  getNotAddedDevicesData,
  getDeviceTrackingData,
  sendCommand,
};
