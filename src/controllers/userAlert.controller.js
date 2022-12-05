const httpStatus = require('http-status');
const moment = require('moment');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userAlertService } = require('../services');

const createUserAlert = catchAsync(async (req, res) => {
  const userAlert = await userAlertService.createUserAlert({ ...req.body, userAlertCreatedBy: req.user.id, userAlertCreatedAt: moment() });
  res.status(httpStatus.CREATED).send(userAlert);
});

const getUserAlerts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userAlertStatus', 'userAlertModelId']);
  if(req.user.role !== 'superadmin'){
    filter.userAlertClientId = req.user.userCompId;
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = 'userAlertSensors.sensorId, userAlertModelId, userAlertClientId';
  const result = await userAlertService.queryUserAlerts(filter, options);
  res.send(result);
});

const getUsersWithAlerts = catchAsync(async (req, res) =>{
  const filter = {};
  filter.userAlertObjectsImei = { $in: [req.params.deviceImei] };
  const result = await userAlertService.getUsersWithAlertsByImei(filter);
  res.send(result);
})

const getUserAlertsList = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userAlertClientId', 'userAlertStatus']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userAlertService.queryUserAlertsList(filter, options);
  res.send(result);
});

const getUserAlert = catchAsync(async (req, res) => {
  const userAlert = await userAlertService.getUserAlertById(req.params.userAlertId);
  if (!userAlert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserAlert not found');
  }
  res.send(userAlert);
});

const updateUserAlert = catchAsync(async (req, res) => {
  const userAlert = await userAlertService.updateUserAlertById(req.params.userAlertId, {
    ...req.body,
    lastUpdatedBy: req.user.id,
    lastUpdatedAt: moment(),
  });
  res.send(userAlert);
});

const deleteUserAlert = catchAsync(async (req, res) => {
  await userAlertService.deleteUserAlertById(req.params.userAlertId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUserAlert,
  getUserAlerts,
  getUserAlertsList,
  getUsersWithAlerts,
  getUserAlert,
  updateUserAlert,
  deleteUserAlert,
};
