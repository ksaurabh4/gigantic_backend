const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDevice = {
  body: Joi.object().keys({
    deviceImei: Joi.string().required(),
    deviceModelName: Joi.string().required(),
    deviceType: Joi.string().required(),
    deviceManufacturer: Joi.string(),
    deviceClientId: Joi.string().required(),
    deviceStatus: Joi.string().required(),
    deviceDefaultPassword: Joi.string(),
  }),
};

const getDevices = {
  query: Joi.object().keys({
    deviceImei: Joi.string(),
    deviceModelName: Joi.string(),
    deviceType: Joi.string(),
    deviceManufacturer: Joi.string(),
    deviceClientId: Joi.string().custom(objectId),
    deviceStatus: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDevice = {
  params: Joi.object().keys({
    deviceId: Joi.string().custom(objectId),
  }),
};

const updateDevice = {
  params: Joi.object().keys({
    deviceId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      deviceImei: Joi.string(),
      deviceModelName: Joi.string(),
      deviceType: Joi.string(),
      deviceManufacturer: Joi.string(),
      deviceClientId: Joi.string(),
      deviceStatus: Joi.string(),
      deviceDefaultPassword: Joi.string(),
    })
    .min(1),
};

const deleteDevice = {
  params: Joi.object().keys({
    deviceId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createDevice,
  getDevices,
  getDevice,
  updateDevice,
  deleteDevice,
};
