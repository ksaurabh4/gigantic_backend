const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createModel = {
  body: Joi.object().keys({
    modelName: Joi.string().required(),
    modelPort: Joi.number().required(),
    modelSensors: Joi.array(),
  }),
};

const getModels = {
  query: Joi.object().keys({
    modelPort: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getModel = {
  params: Joi.object().keys({
    modelId: Joi.string().custom(objectId),
  }),
};

const updateModel = {
  params: Joi.object().keys({
    modelId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      modelName: Joi.string(),
      modelPort: Joi.number(),
      modelSensors: Joi.array(),
    })
    .min(1),
};

const deleteModel = {
  params: Joi.object().keys({
    modelId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createModel,
  getModels,
  getModel,
  updateModel,
  deleteModel,
};
