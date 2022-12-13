const httpStatus = require('http-status');
const moment = require('moment');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { trackingService } = require('../services');
const { timeZoneToMinutes } = require('../utils/helper');

const getDevicesTrackingData = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['protocol', 'vehicleStatus']);
  filter.objectUsers = req.user._id;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  try {
    const result = await trackingService.queryDevicesTrackingData(filter, options);
    res.send(result);
  } catch (error) {
    console.log('error', error);
  }
});

const getNotAddedDevicesData = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['protocol']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  try {
    const result = await trackingService.queryNotAddedDevicesData(filter, options);
    res.send(result);
  } catch (error) {
    console.log('error', error);
  }
});

const getDeviceTrackingData = catchAsync(async (req, res) => {
  const trackingData = await trackingService.queryDeviceTrackingDataByImei(req.params.imei);
  if (!trackingData[0]) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  }
  res.send(trackingData[0]);
});

const getDeviceHistoryData = catchAsync(async (req, res) => {
  const timeDifference = timeZoneToMinutes(req.user.userTimeZone);
  const historyData = await trackingService.queryDeviceHistoryDataByImei({ ...req.query, to: moment(req.query.to).subtract(timeDifference, "minute").format('YYYY-MM-DD HH:mm'), from: moment(req.query.from).subtract(timeDifference, "minute").format('YYYY-MM-DD HH:mm'), tz: req.user.userTimeZone });
  // if (!historyData[0]) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  // }
  res.send(historyData);
});

const getDeviceTripsData = catchAsync(async (req, res) => {
  const timeDifference = timeZoneToMinutes(req.user.userTimeZone);
  const historyData = await trackingService.queryDeviceTripsByImei({ ...req.query, to: moment(req.query.to).subtract(timeDifference, "minute").format('YYYY-MM-DD HH:mm'), from: moment(req.query.from).subtract(timeDifference, "minute").format('YYYY-MM-DD HH:mm'), tz: req.user.userTimeZone });
  // if (!historyData[0]) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  // }
  res.send(historyData);
});

const getDeviceStopageData = catchAsync(async (req, res) => {
  const timeDifference = timeZoneToMinutes(req.user.userTimeZone);
  const historyData = await trackingService.queryDeviceStopageByImei({ ...req.query, to: moment(req.query.to).subtract(timeDifference, "minute").format('YYYY-MM-DD HH:mm'), from: moment(req.query.from).subtract(timeDifference, "minute").format('YYYY-MM-DD HH:mm'), tz: req.user.userTimeZone });
  // if (!historyData[0]) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  // }
  res.send(historyData);
});

const getAlertsData = catchAsync(async (req, res) => {
  const timeDifference = timeZoneToMinutes(req.user.userTimeZone);
  const alertsData = await trackingService.queryAlertsByImei({ ...req.query, to: moment(req.query.to).subtract(timeDifference, "minute").format('YYYY-MM-DD HH:mm'), from: moment(req.query.from).subtract(timeDifference, "minute").format('YYYY-MM-DD HH:mm'), tz: req.user.userTimeZone, userId:req.user.id });
  // if (!historyData[0]) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  // }
  res.send(alertsData);
});

const getDeviceTravelSummary = catchAsync(async (req, res) => {

  const timeDifference = timeZoneToMinutes(req.user.userTimeZone);
  console.log(req.user.userTimeZone, timeDifference);
  const travelSummaryData = await trackingService.queryDeviceTravelSummaryByImei({ ...req.query, to: moment(req.query.to).subtract(timeDifference, "minute").format('YYYY-MM-DD HH:mm'), from: moment(req.query.from).subtract(timeDifference, "minute").format('YYYY-MM-DD HH:mm'), tz: req.user.userTimeZone });
  // if (!historyData[0]) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  // }
  res.send(travelSummaryData);
});

const saveLockData = (
  imei,
  cmdType,
  userId,
  status,
  deviceReponse,
  date,
  cmd,
  sentFrom
) => {
  return new Promise((resolve, reject) => {
    Devices.findOne({ deviceId: imei }, '_id', (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: 'Internal Server Error' });
      }
      const deviceId = doc._id;
      const lockData = {
        cmdType: cmdType,
        deviceId: deviceId,
        userId: userId,
        status: status,
        deviceReponse: deviceReponse,
        date: date,
        cmd: cmd,
        sentFrom: sentFrom,
      };

      new Lock(lockData).save((e, doc) => {
        if (e) {
          reject(e);
          return;
        }
        resolve(doc._id);
      });
    });
  });
};

const updateLockData = (id, status, deviceResponse) => {
  return new Promise((resolve, reject) => {
    Lock.findByIdAndUpdate(id, {
      status: status,
      deviceReponse: deviceResponse,
    })
      .then((doc) => {
        resolve(doc._id);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

const hex_to_ascii = (str1) => {
  var hex = str1.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};

const sendCommand = catchAsync(async (req, res) => {
  //cmdType => cutoff_disconnect, cufoff_connect, reset

  let userId = req.userId;
  let user = req.user;
  const { imei, cmdType, cmdContent, sentFrom, userPin, port } = req.body;

  // if (user.immobilizeVehicles === undefined || !user.immobilizeVehicles) {
  //   return res
  //     .status(403)
  //     .send({ error: "You don't have access to lock/unlock vehicles." });
  // }

  // if (user.pinText !== undefined && user.pinText !== userPin) {
  //   return res.status(403).send({ error: 'Invalid User Pin' });
  // }

  let date = moment();

  const net = require('net');
  const client = new net.Socket();
  client.connect(8005, 'localhost', () => {
    client.write(
      JSON.stringify({
        imei: imei,
        cmdType: cmdType,
        cmdContent: cmdContent,
        port: port,
      })
    );
  });
  let isReturned = false;
  let lockId = '';
  setTimeout(() => {
    if (!isReturned) {
      isReturned = true;
      // saveLockData(imei, cmdType, userId, 'failed', '', date, '', sentFrom)
      //   .then((id) => {
      //     lockId = id;
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
      return res
        .status(408)
        .send({ error: "Device didn't respond. Please try again later." });
    }
  }, 30000);

  client.on('data', function (data) {
    console.log('received : ' + data);
    client.end();
    let { isSuccess, response, cutoffStatus } = JSON.parse(
      hex_to_ascii(data.toString('hex'))
    );
    console.log(isSuccess);
    if (!isSuccess && response == 'not_logged_in') {
      isReturned = true;

      // saveLockData(
      //   imei,
      //   cmdType,
      //   userId,
      //   'failed',
      //   'Device not logged in',
      //   date,
      //   '',
      //   sentFrom
      // ).catch((e) => {
      //   console.log(e);
      // });

      return res
        .status(200)
        .send({
          message: 'Device not logged in. Please try again later',
          isSuccess,
          cutoffStatus,
        });
    }

    if (!isReturned) {
      isReturned = true;

      // saveLockData(
      //   imei,
      //   cmdType,
      //   userId,
      //   isSuccess ? 'success' : 'failed',
      //   response,
      //   date,
      //   '',
      //   sentFrom
      // ).catch((e) => {
      //   console.log(e);
      // });
    } else if (lockId !== '') {
      // updateLockData(lockId, isSuccess ? 'success' : 'failed', response).catch(
      //   (e) => {
      //     console.log(e);
      //   }
      // );
    }

    // if (isSuccess) {
    //   axios
    //     .post('http://localhost:3001/api/cutoff', {
    //       imei: imei,
    //       cutoffValue: cmdType == 'cutoff_disconnect',
    //     })
    //     .then((data) => {
    //       return res
    //         .status(200)
    //         .send({ message: response, isSuccess, cutoffStatus });
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //       return res
    //         .status(200)
    //         .send({ message: response, isSuccess, cutoffStatus });
    //     });
    // } else {
    return res
      .status(200)
      .send({ message: response, isSuccess, cutoffStatus });
    // }
  });

  client.on('close', function () {
    console.log('Connection closed');
  });
});

module.exports = {
  getDevicesTrackingData,
  getNotAddedDevicesData,
  getDeviceTrackingData,
  getDeviceHistoryData,
  getDeviceTripsData,
  getDeviceStopageData,
  getAlertsData,
  getDeviceTravelSummary,
  sendCommand,
};
