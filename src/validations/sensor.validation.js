const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSensor = {
  body: Joi.object().keys({
    sensorName: Joi.string().required(),
    sensorType: Joi.string().required(),
    sensorOption1: Joi.string(),
    sensorOption2: Joi.string(),
  }),
};

const getSensors = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSensor = {
  params: Joi.object().keys({
    sensorId: Joi.string().custom(objectId),
  }),
};

const updateSensor = {
  params: Joi.object().keys({
    sensorId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      sensorName: Joi.string(),
      sensorType: Joi.string(),
      sensorOption2:Joi.string(),
      sensorOption1: Joi.string(),
    })
    .min(1),
};

const deleteSensor = {
  params: Joi.object().keys({
    sensorId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSensor,
  getSensors,
  getSensor,
  updateSensor,
  deleteSensor,
};
