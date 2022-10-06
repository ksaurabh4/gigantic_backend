const httpStatus = require('http-status');
const moment = require('moment');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { trackingService } = require('../services');

const getDevicesTrackingData = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['protocol', 'vehicleStatus']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await trackingService.queryDevicesTrackingData(filter, options);
  res.send(result);
});

const getDeviceTrackingData = catchAsync(async (req, res) => {
  const trackingData = await trackingService.queryDeviceTrackingDataByImei(req.params.imei);
  if (!trackingData[0]) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  }
  res.send(trackingData);
});

module.exports = {
  getDevicesTrackingData,
  getDeviceTrackingData,
};
