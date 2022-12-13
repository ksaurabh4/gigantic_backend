const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createObject = {
  body: Joi.object().keys({
    objectName: Joi.string().required(),
    objectType: Joi.string().required(),
    objectUsers: Joi.array(),
    objectClientId: Joi.string().required().custom(objectId),
    objectDeviceId: Joi.string().required().custom(objectId),
    objectDeviceImei: Joi.string().required(),
    objectIsInParkingMode: Joi.boolean(),
    objectStatus: Joi.string().required(),
    objectIcon: Joi.string(),
  }),
};

const getObjects = {
  query: Joi.object().keys({
    objectName: Joi.string(),
    objectType: Joi.string(),
    objectClientId: Joi.string().custom(objectId),
    objectUsers: Joi.string().custom(objectId),
    objectDeviceId: Joi.string().custom(objectId),
    objectDeviceImei: Joi.string(),
    objectIsInParkingMode: Joi.boolean(),
    objectStatus: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getObject = {
  params: Joi.object().keys({
    objectId: Joi.string().custom(objectId),
  }),
};

const updateObject = {
  params: Joi.object().keys({
    objectId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      objectName: Joi.string(),
      objectType: Joi.string(),
      objectUsers: Joi.array(),
      objectClientId: Joi.string().custom(objectId),
      objectDeviceId: Joi.string().custom(objectId),
      objectDeviceImei: Joi.string(),
      objectIsInParkingMode: Joi.boolean(),
      objectStatus: Joi.string(),
      objectIcon: Joi.string(),
    })
    .min(1),
};

const deleteObject = {
  params: Joi.object().keys({
    objectId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createObject,
  getObjects,
  getObject,
  updateObject,
  deleteObject,
};
