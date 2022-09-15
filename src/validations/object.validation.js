const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDevice = {
  body: Joi.object().keys({
    objectName: Joi.string().required(),
    objectType: Joi.string().required(),
    objectClientId: Joi.string().required().custom(objectId),
    objectDeviceId: Joi.string().required().custom(objectId),
    objectIsInParkingMode: Joi.boolean(),
    objectStatus: Joi.string().required(),
    objectIcon: Joi.string(),
  }),
};

const getDevices = {
  query: Joi.object().keys({
    objectName: Joi.string(),
    objectType: Joi.string(),
    objectClientId: Joi.string().custom(objectId),
    objectDeviceId: Joi.string().required().custom(objectId),
    objectIsInParkingMode: Joi.boolean(),
    objectStatus: Joi.string(),
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
      objectName: Joi.string(),
      objectType: Joi.string(),
      objectClientId: Joi.string().custom(objectId),
      objectDeviceId: Joi.string().custom(objectId),
      objectIsInParkingMode: Joi.boolean(),
      objectStatus: Joi.string(),
      objectIcon: Joi.string(),
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
