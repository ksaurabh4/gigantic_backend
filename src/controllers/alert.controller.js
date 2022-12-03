const httpStatus = require('http-status');
const moment = require('moment');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { alertService } = require('../services');

const createAlert = catchAsync(async (req, res) => {
  const alert = await alertService.createAlert({ ...req.body, alertCreatedBy: req.user.id, alertCreatedAt: moment() });
  res.status(httpStatus.CREATED).send(alert);
});

const getAlerts = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await alertService.queryAlerts(filter, options);
  res.send(result);
});

const getAlertsList = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['alertPort']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await alertService.queryAlertsList(filter, options);
  res.send(result);
});

const getAlert = catchAsync(async (req, res) => {
  const alert = await alertService.getAlertById(req.params.alertId);
  if (!alert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Alert not found');
  }
  res.send(alert);
});

const updateAlert = catchAsync(async (req, res) => {
  const alert = await alertService.updateAlertById(req.params.alertId, {
    ...req.body,
    lastUpdatedBy: req.user.id,
    lastUpdatedAt: moment(),
  });
  res.send(alert);
});

const deleteAlert = catchAsync(async (req, res) => {
  await alertService.deleteAlertById(req.params.alertId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAlert,
  getAlerts,
  getAlertsList,
  getAlert,
  updateAlert,
  deleteAlert,
};
