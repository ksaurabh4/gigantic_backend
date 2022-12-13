const httpStatus = require('http-status');
const { Object: ObjectModel } = require('../models');
const ApiError = require('../utils/ApiError');
const { updateDeviceById } = require('./device.service');

/**
 * Create a object
 * @param {Object} objectBody
 * @returns {Promise<Object>}
 */
const createObject = async (objectBody) => {
  if (await ObjectModel.isDeviceAssigned(objectBody.objectDeviceId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'device assigned to other object');
  }
  const object = await ObjectModel.create(objectBody);

  if (object._id) {
    // console.log(updateDeviceById);
    await updateDeviceById(objectBody.objectDeviceId, { deviceStatus: 'assigned' });
  }

  return object;
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
  const objects = await ObjectModel.paginate(filter, options);
  return objects;
};

/**
 * Query for objects list
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryObjectsList = async (filter, options) => {
  const objects = await ObjectModel.paginate(filter, options, ['objectName', 'objectDeviceImei']);
  return objects;
};

/**
 * Get object by id
 * @param {ObjectId} id
 * @returns {Promise<Object>}
 */
const getObjectById = async (id) => {
  return ObjectModel.findById(id);
};

/**
 * Get object by imei
 * @param {string} imei
 * @returns {Promise<Object>}
 */
const getObjectByImei = async (imei) => {
  const object = await ObjectModel.find({ objectDeviceImei: imei });
  return object[0];
};

/**
 * Update object by imei
 * @param {ObjectId} imei
 * @param {Object} updateBody
 * @returns {Promise<Object>}
 */
const updateObjectByImei = async (imei, updateBody) => {
  const object = await getObjectByImei(imei);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, 'this Object not found');
  }
  if (updateBody.objectDeviceId && object.objectDeviceId !== updateBody.objectDeviceId) {
    if (await ObjectModel.isDeviceAssigned(updateBody.objectDeviceId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'device assigned to other object');
    }
    Object.assign(object, updateBody);
    await object.save();
    await updateDeviceById(object.objectDeviceId, { deviceStatus: 'unassigned' });
  }else{
    Object.assign(object, updateBody);
    await object.save();
  }
  return object;
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
  if (updateBody.objectDeviceId && object.objectDeviceId !== updateBody.objectDeviceId) {
    if (await ObjectModel.isDeviceAssigned(updateBody.objectDeviceId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'device assigned to other object');
    }
    Object.assign(object, updateBody);
    await object.save();
    await updateDeviceById(object.objectDeviceId, { deviceStatus: 'unassigned' });
  } else {
    Object.assign(object, updateBody);
    await object.save();
  }
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
  queryObjectsList,
  getObjectById,
  getObjectByImei,
  updateObjectById,
  updateObjectByImei,
  deleteObjectById,
};
