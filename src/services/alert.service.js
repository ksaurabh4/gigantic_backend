const httpStatus = require('http-status');
const { Alert } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a alert
 * @param {Object} alertBody
 * @returns {Promise<Alert>}
 */
const createAlert = async (alertBody) => {
  return Alert.create(alertBody);
};

/**
 * Query for alerts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAlerts = async (filter, options) => {
  const alerts = await Alert.paginate(filter, options);
  return alerts;
};
/**
 * Query for alerts list
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAlertsList = async (filter, options) => {
  const alerts = await Alert.paginate(filter, options, ['alertName', 'alertType']);
  return alerts;
};
/**
 * Get alert by id
 * @param {ObjectId} id
 * @returns {Promise<Alert>}
 */
const getAlertById = async (id) => {
  return Alert.findById(id);
};

/**
 * Update alert by id
 * @param {ObjectId} alertId
 * @param {Object} updateBody
 * @returns {Promise<Alert>}
 */
const updateAlertById = async (alertId, updateBody) => {
  const alert = await getAlertById(alertId);
  if (!alert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Alert not found');
  }
  Object.assign(alert, updateBody);
  await alert.save();
  return alert;
};

/**
 * Delete alert by id
 * @param {ObjectId} alertId
 * @returns {Promise<Alert>}
 */
const deleteAlertById = async (alertId) => {
  const alert = await getAlertById(alertId);
  if (!alert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Alert not found');
  }
  await alert.remove();
  return alert;
};

module.exports = {
  createAlert,
  queryAlerts,
  queryAlertsList,
  getAlertById,
  updateAlertById,
  deleteAlertById,
};
