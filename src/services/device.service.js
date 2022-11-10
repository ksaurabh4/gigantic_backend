const httpStatus = require('http-status');
const axios = require('axios').default;
const { Device } = require('../models');
const ApiError = require('../utils/ApiError');
const { getObjectByImei, updateObjectById, updateObjectByImei } = require('./object.service');

/**
 * Create a device
 * @param {Object} deviceBody
 * @returns {Promise<Device>}
 */
const createDevice = async (deviceBody) => {
  if (await Device.isDeviceAdded(deviceBody.deviceImei)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'device already added');
  }
  const devices = Device.create(deviceBody);
  axios.post('http://localhost:3001/api/refresh');
  return devices;
};

/**
 * Query for devices
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDevices = async (filter, options) => {
  const devices = await Device.paginate(filter, options);
  return devices;
};

/**
 * Query for devices list
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDevicesList = async (filter, options) => {
  const devices = await Device.paginate(filter, options, ['deviceImei', 'deviceSimNumber']);
  return devices;
};
/**
 * Get device by id
 * @param {ObjectId} id
 * @returns {Promise<Device>}
 */
const getDeviceById = async (id) => {
  return Device.findById(id);
};

/**
 * Update device by id
 * @param {ObjectId} deviceId
 * @param {Object} updateBody
 * @returns {Promise<Device>}
 */
const updateDeviceById = async (deviceId, updateBody) => {
  let device = await getDeviceById(deviceId);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  }
  const deviceOldImei = device.deviceImei;
  Object.assign(device, updateBody);
  await device.save();
  if (updateBody.deviceImei){
    await updateObjectByImei(deviceOldImei, { objectDeviceImei: updateBody.deviceImei });
  }
  axios.post('http://localhost:3001/api/refresh');
  return device;
};

/**
 * Delete device by id
 * @param {ObjectId} deviceId
 * @returns {Promise<Device>}
 */
const deleteDeviceById = async (deviceId) => {
  const device = await getDeviceById(deviceId);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  }
  await device.remove();
  axios.post('http://localhost:3001/api/refresh');
  return device;
};

module.exports = {
  createDevice,
  queryDevices,
  queryDevicesList,
  getDeviceById,
  updateDeviceById,
  deleteDeviceById,
};
