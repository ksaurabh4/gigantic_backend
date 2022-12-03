const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAlert = {
  body: Joi.object().keys({
    alertName: Joi.string().required(),
    alertKey: Joi.string().required(),
    alertType: Joi.string(),
    alertText1: Joi.string(),
    alertText2: Joi.string(),
  }),
};

const getAlerts = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAlert = {
  params: Joi.object().keys({
    alertId: Joi.string().custom(objectId),
  }),
};

const updateAlert = {
  params: Joi.object().keys({
    alertId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      alertName: Joi.string(),
      alertKey: Joi.string(),
      alertType: Joi.string(),
      alertText1:Joi.string(),
      alertText2: Joi.string(),
    })
    .min(1),
};

const deleteAlert = {
  params: Joi.object().keys({
    alertId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAlert,
  getAlerts,
  getAlert,
  updateAlert,
  deleteAlert,
};
