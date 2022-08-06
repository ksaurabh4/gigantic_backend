const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email(),
    password: Joi.string().required().custom(password),
    userFullName: Joi.string(),
    userPhone: Joi.string(),
    userCompId: Joi.string().custom(objectId).required(),
    userTimeZone: Joi.string(),
    userIsActive: Joi.boolean(),
    role: Joi.string().required().valid('user', 'admin', 'reseller', 'superadmin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    role: Joi.string(),
    userCompId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      username: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      userFullName: Joi.string(),
      userCompId: Joi.string().custom(objectId),
      userTimeZone: Joi.string(),
      userIsActive: Joi.boolean(),
      role: Joi.string().valid('user', 'admin', 'reseller', 'superadmin'),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
