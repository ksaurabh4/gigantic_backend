const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createUserAlert = {
  body: Joi.object().keys({
    userAlerts: Joi.array().required(),
    userAlertUserId: Joi.string().custom(objectId).required(),
    userAlertObjectsImei: Joi.array().required(),
    userAlertEnabledOn: Joi.array(),
    userAlertWebhook: Joi.string(),
    userAlertEmail: Joi.string(),
    userAlertPhone: Joi.string(),
  }),
};

const getUserAlerts = {
  query: Joi.object().keys({
    userAlertId: Joi.string().custom(objectId),
    userAlertUserId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUserAlert = {
  params: Joi.object().keys({
    userAlertId: Joi.string().custom(objectId),
  }),
};

const getUsersWithAlerts = {
  params: Joi.object().keys({
    deviceImei: Joi.string(),
  }),
};

const updateUserAlert = {
  params: Joi.object().keys({
    userAlertId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      userAlertDevices: Joi.array(),
      userAlertUserId: Joi.string().custom(objectId),
      userAlertText: Joi.string(),
      userAlertEnabledOn: Joi.array(),
      userAlertValue: Joi.string(),
      userAlertWebhook: Joi.string(),
      userAlertEmail: Joi.string(),
      userAlertPhone: Joi.string(),
    })
    .min(1),
};

const deleteUserAlert = {
  params: Joi.object().keys({
    userAlertId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUserAlert,
  getUserAlerts,
  getUserAlert,
  getUsersWithAlerts,
  updateUserAlert,
  deleteUserAlert,
};
