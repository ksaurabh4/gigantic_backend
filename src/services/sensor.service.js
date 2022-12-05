const httpStatus = require('http-status');
const { Sensor } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a sensor
 * @param {Object} sensorBody
 * @returns {Promise<Sensor>}
 */
const createSensor = async (sensorBody) => {
  return Sensor.create(sensorBody);
};

/**
 * Query for sensors
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySensors = async (filter, options) => {
  const sensors = await Sensor.paginate(filter, options);
  return sensors;
};
/**
 * Query for sensors list
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySensorsList = async (filter, options) => {
  const sensors = await Sensor.paginate(filter, options, ['sensorName', 'sensorPort']);
  return sensors;
};
/**
 * Get sensor by id
 * @param {ObjectId} id
 * @returns {Promise<Sensor>}
 */
const getSensorById = async (id) => {
  return Sensor.findById(id);
};

/**
 * Update sensor by id
 * @param {ObjectId} sensorId
 * @param {Object} updateBody
 * @returns {Promise<Sensor>}
 */
const updateSensorById = async (sensorId, updateBody) => {
  const sensor = await getSensorById(sensorId);
  if (!sensor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sensor not found');
  }
  Object.assign(sensor, updateBody);
  await sensor.save();
  return sensor;
};

/**
 * Delete sensor by id
 * @param {ObjectId} sensorId
 * @returns {Promise<Sensor>}
 */
const deleteSensorById = async (sensorId) => {
  const sensor = await getSensorById(sensorId);
  if (!sensor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sensor not found');
  }
  await sensor.remove();
  return sensor;
};

module.exports = {
  createSensor,
  querySensors,
  querySensorsList,
  getSensorById,
  updateSensorById,
  deleteSensorById,
};
