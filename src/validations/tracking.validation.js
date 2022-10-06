const Joi = require('joi');

const getDevicesTrackingData = {
  query: Joi.object().keys({
    protocol: Joi.string(),
    vehicleStatus: Joi.string(),
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


module.exports = {
  getDevicesTrackingData,
  getDeviceTrackingData,
};
