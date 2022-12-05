const httpStatus = require('http-status');
const moment = require('moment');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { sensorService } = require('../services');

const createSensor = catchAsync(async (req, res) => {
  const sensor = await sensorService.createSensor({ ...req.body, sensorCreatedBy: req.user.id, sensorCreatedAt: moment() });
  res.status(httpStatus.CREATED).send(sensor);
});

const getSensors = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await sensorService.querySensors(filter, options);
  res.send(result);
});

const getSensorsList = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['sensorPort']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await sensorService.querySensorsList(filter, options);
  res.send(result);
});

const getSensor = catchAsync(async (req, res) => {
  const sensor = await sensorService.getSensorById(req.params.sensorId);
  if (!sensor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sensor not found');
  }
  res.send(sensor);
});

const updateSensor = catchAsync(async (req, res) => {
  const sensor = await sensorService.updateSensorById(req.params.sensorId, {
    ...req.body,
    lastUpdatedBy: req.user.id,
    lastUpdatedAt: moment(),
  });
  res.send(sensor);
});

const deleteSensor = catchAsync(async (req, res) => {
  await sensorService.deleteSensorById(req.params.sensorId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSensor,
  getSensors,
  getSensorsList,
  getSensor,
  updateSensor,
  deleteSensor,
};
