const httpStatus = require('http-status');
const moment = require('moment');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { objectService } = require('../services');

const createObject = catchAsync(async (req, res) => {
  const object = await objectService.createObject({ ...req.body, objectCreatedBy: req.user.id, objectCreatedAt: moment() });
  res.status(httpStatus.CREATED).send(object);
});

const getObjects = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['objectStatus', 'objectModelId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await objectService.queryObjects(filter, options);
  res.send(result);
});

const getObject = catchAsync(async (req, res) => {
  const object = await objectService.getObjectById(req.params.objectId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Object not found');
  }
  res.send(object);
});

const updateObject = catchAsync(async (req, res) => {
  const object = await objectService.updateObjectById(req.params.objectId, {
    ...req.body,
    lastUpdatedBy: req.user.id,
    lastUpdatedAt: moment(),
  });
  res.send(object);
});

const deleteObject = catchAsync(async (req, res) => {
  await objectService.deleteObjectById(req.params.objectId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createObject,
  getObjects,
  getObject,
  updateObject,
  deleteObject,
};
