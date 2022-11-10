const httpStatus = require('http-status');
const moment = require('moment');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { deviceService } = require('../services');

const createDevice = catchAsync(async (req, res) => {
  const device = await deviceService.createDevice({ ...req.body, deviceCreatedBy: req.user.id, deviceCreatedAt: moment() });
  res.status(httpStatus.CREATED).send(device);
});

const getDevices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['deviceStatus', 'deviceModelId']);
  if(req.user.role !== 'superadmin'){
    filter.deviceClientId = req.user.userCompId;
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = 'deviceSensors.sensorId, deviceModelId, deviceClientId';
  const result = await deviceService.queryDevices(filter, options);
  res.send(result);
});

const getDevicesList = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['deviceClientId', 'deviceStatus']);
  // filter.compParentId = req.user.userCompId;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await deviceService.queryDevicesList(filter, options);
  res.send(result);
});

const getDevice = catchAsync(async (req, res) => {
  const device = await deviceService.getDeviceById(req.params.deviceId);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  }
  res.send(device);
});

const updateDevice = catchAsync(async (req, res) => {
  const device = await deviceService.updateDeviceById(req.params.deviceId, {
    ...req.body,
    lastUpdatedBy: req.user.id,
    lastUpdatedAt: moment(),
  });
  res.send(device);
});

const deleteDevice = catchAsync(async (req, res) => {
  await deviceService.deleteDeviceById(req.params.deviceId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDevice,
  getDevices,
  getDevicesList,
  getDevice,
  updateDevice,
  deleteDevice,
};
