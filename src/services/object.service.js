const httpStatus = require('http-status');
const { Object } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a object
 * @param {Object} objectBody
 * @returns {Promise<Object>}
 */
const createObject = async (objectBody) => {
  if (await Object.isDeviceAssigned(objectBody.objectDeviceId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'device assigned to other object');
  }
  return Object.create(objectBody);
};

/**
 * Query for objects
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryObjects = async (filter, options) => {
  const objects = await Object.paginate(filter, options);
  return objects;
};

/**
 * Get object by id
 * @param {ObjectId} id
 * @returns {Promise<Object>}
 */
const getObjectById = async (id) => {
  return Object.findById(id);
};

/**
 * Update object by id
 * @param {ObjectId} objectId
 * @param {Object} updateBody
 * @returns {Promise<Object>}
 */
const updateObjectById = async (objectId, updateBody) => {
  const object = await getObjectById(objectId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Object not found');
  }
  Object.assign(object, updateBody);
  await object.save();
  return object;
};

/**
 * Delete object by id
 * @param {ObjectId} objectId
 * @returns {Promise<Object>}
 */
const deleteObjectById = async (objectId) => {
  const object = await getObjectById(objectId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Object not found');
  }
  await object.remove();
  return object;
};

module.exports = {
  createObject,
  queryObjects,
  getObjectById,
  updateObjectById,
  deleteObjectById,
};
