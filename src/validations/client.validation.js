const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createClient = {
  body: Joi.object().keys({
    compName: Joi.string().required(),
    compEmail: Joi.string().email(),
    compPrimaryUser: Joi.string().required(),
    password: Joi.string().required().min(8),
    compContactPerson: Joi.string().required(),
    compSalesPerson: Joi.string(),
    compSupportNumber: Joi.number(),
    compSupportEmail: Joi.string().email(),
    compAddress: Joi.string(),
    compCity: Joi.string(),
    compState: Joi.string(),
    compZip: Joi.string(),
    compCountry: Joi.string().required(),
    compPhone: Joi.number(),
    compLogoUrl: Joi.string(),
    compDomain: Joi.string(),
    compIp: Joi.string(),
    compParentId: Joi.string().custom(objectId).required(),
    compHirerchy: Joi.array(),
    compIsWhiteLabelled: Joi.boolean(),
    compDemoDetails: Joi.object(),
    compPreferredLang: Joi.string(),
    compPreferredCoordinates: Joi.object(),
    compIsReseller: Joi.boolean(),
    compIsActive: Joi.boolean(),
  }),
};

const getClients = {
  query: Joi.object().keys({
    name: Joi.string(),
    compIsReseller: Joi.boolean(),
    compParentId: Joi.boolean(),
    compIsActive: Joi.boolean(),
    compIsWhiteLabelled: Joi.boolean(),
    compCountry: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getClient = {
  params: Joi.object().keys({
    clientId: Joi.string().custom(objectId),
  }),
};

const updateClient = {
  params: Joi.object().keys({
    clientId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      compParentId: Joi.required().custom(objectId),
      compName: Joi.string(),
      compEmail: Joi.string().email(),
      compContactPerson: Joi.string(),
      compSalesPerson: Joi.string(),
      compHirerchy: Joi.array(),
      compSupportNumber: Joi.string(),
      compSupportEmail: Joi.string().email(),
      compAddress: Joi.string(),
      compCity: Joi.string(),
      compState: Joi.string(),
      compZip: Joi.string(),
      compCountry: Joi.string(),
      compDomain: Joi.string(),
      compIp: Joi.string(),
      compPhone: Joi.string(),
      compLogoUrl: Joi.string(),
      compIsWhiteLabelled: Joi.boolean(),
      compPreferredLang: Joi.string(),
      compDemoDetails: Joi.object(),
      compIsReseller: Joi.boolean(),
      compIsActive: Joi.boolean(),
    })
    .min(1),
};

const deleteClient = {
  params: Joi.object().keys({
    clientId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
};
