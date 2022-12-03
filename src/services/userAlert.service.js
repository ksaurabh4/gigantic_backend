const httpStatus = require('http-status');
const axios = require('axios').default;
const { UserAlert } = require('../models');
const ApiError = require('../utils/ApiError');
// const { updateObjectByImei } = require('./object.service');

/**
 * Create a userAlert
 * @param {Object} userAlertBody
 * @returns {Promise<UserAlert>}
 */
const createUserAlert = async (userAlertBody) => {
  if (await UserAlert.isUserAlertAdded(userAlertBody.userAlertImei)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'userAlert already added');
  }
  const userAlerts = UserAlert.create(userAlertBody);
  axios.post('http://localhost:3001/api/refresh');
  return userAlerts;
};

/**
 * Query for userAlerts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUserAlerts = async (filter, options) => {
  const userAlerts = await UserAlert.paginate(filter, options);
  return userAlerts;
};

/**
 * Query for userAlerts list
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUserAlertsList = async (filter, options) => {
  const userAlerts = await UserAlert.paginate(filter, options, ['userAlertImei', 'userAlertSimNumber']);
  return userAlerts;
};
/**
 * Get userAlert by id
 * @param {ObjectId} id
 * @returns {Promise<UserAlert>}
 */
const getUserAlertById = async (id) => {
  return UserAlert.findById(id);
};

/**
 * Update userAlert by id
 * @param {ObjectId} userAlertId
 * @param {Object} updateBody
 * @returns {Promise<UserAlert>}
 */
const updateUserAlertById = async (userAlertId, updateBody) => {
  let userAlert = await getUserAlertById(userAlertId);
  if (!userAlert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserAlert not found');
  }
  const userAlertOldImei = userAlert.userAlertImei;
  Object.assign(userAlert, updateBody);
  await userAlert.save();
  if (updateBody.userAlertImei){
    // await updateObjectByImei(userAlertOldImei, { objectUserAlertImei: updateBody.userAlertImei });
    // await axios.post('http://localhost:3001/v1/objects', { objectUserAlertImei: updateBody.userAlertImei })
  }
  return userAlert;
};

/**
 * Delete userAlert by id
 * @param {ObjectId} userAlertId
 * @returns {Promise<UserAlert>}
 */
const deleteUserAlertById = async (userAlertId) => {
  const userAlert = await getUserAlertById(userAlertId);
  if (!userAlert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserAlert not found');
  }
  await userAlert.remove();
  axios.post('http://localhost:3001/api/refresh');
  return userAlert;
};

module.exports = {
  createUserAlert,
  queryUserAlerts,
  queryUserAlertsList,
  getUserAlertById,
  updateUserAlertById,
  deleteUserAlertById,
};
