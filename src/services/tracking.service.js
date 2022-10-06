const httpStatus = require('http-status');
const { Object } = require('../models');
const ApiError = require('../utils/ApiError');
const { returnPromise, fetchDevicesTrackingDataQuery } = require('../utils/helper');


/**
 * Query for objects
 * @param {Object} filter - mysql filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDevicesTrackingData = async (filter, options) => {
  const query = fetchDevicesTrackingDataQuery(filter, options);
  const response = await returnPromise(query);
  return response;
};

/**
 * Get object by id
 * @param {string} imei
 * @returns {Promise<Object>}
 */
const queryDeviceTrackingDataByImei = async (imei) => {
  const query = `SELECT * FROM sw_obj_data WHERE imei=${imei}`;
  const response = await returnPromise(query);
  return response;
};

module.exports = {
  queryDevicesTrackingData,
  queryDeviceTrackingDataByImei,
};
