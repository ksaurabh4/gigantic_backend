const httpStatus = require('http-status');
const { Object, Device } = require('../models');
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
  const imeis = await fetchUserImeis(filter);
  const query = fetchDevicesTrackingDataQuery(filter, options, imeis);
  const response = await returnPromise(query);
  const objects = await Object.find(filter, { _id: 0, objectDeviceImei: 1, objectName: 1, objectType: 1, objectIsInParkingMode: 1 });
  return { trackingData: response, staticData: objects };
};

const fetchUserImeis = async (filter) => {
  try {
    const imeis = await Object.find(filter).distinct('objectDeviceImei');
    return imeis;
  } catch (error) {
    console.log('deviceimeierror', error)
  }
}

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

/**
 * Get array of objects by id
 * @param {string} imei
 * @param {date} from
 * @param {date} to
 * @returns {Promise<Object>}
 */
const queryDeviceHistoryDataByImei = async (imei) => {
  const query = `SELECT * FROM sw_obj_${imei} WHERE imei=${imei} `;
  const response = await returnPromise(query);
  return response;
};

module.exports = {
  queryDevicesTrackingData,
  queryDeviceTrackingDataByImei,
  queryDeviceHistoryDataByImei,
};
