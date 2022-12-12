const httpStatus = require('http-status');
const moment = require('moment');
const { Object, Device } = require('../models');
const ApiError = require('../utils/ApiError');
const { returnPromise, fetchDevicesTrackingDataQuery, fetchNotAddedDevicesDataQuery } = require('../utils/helper');


/**
 * Query for objects
 * @param {Object} filter - mysql filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDevicesTrackingData = async (filter, options) => {
  const imeis = await fetchUserImeis(filter);
  const query = fetchDevicesTrackingDataQuery(filter, options, imeis);
  const response = await returnPromise(query);
  const objects = await Object.find(filter, { _id: 0, objectDeviceImei: 1, objectName: 1, objectType: 1, objectIsInParkingMode: 1 });
  return { trackingData: response, staticData: objects };
};

const fetchUserImeis = async (filter) => {
  try {
    const imeis = await Object.find(filter).distinct('objectDeviceImei');
    return imeis;
  } catch (error) {
    console.log('deviceimeierror', error)
  }
}


/**
 * Query for Not added Devices Data
 * @param {Object} filter - mysql filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryNotAddedDevicesData = async (filter, options) => {
  const query = fetchNotAddedDevicesDataQuery(filter, options);
  const response = await returnPromise(query);
  return { data: response };
};

/**
 * Get object by id
 * @param {string} imei
 * @returns {Promise<Object>}
 */
const queryDeviceTrackingDataByImei = async (imei) => {
  const query = `SELECT * FROM sw_obj_data WHERE imei=${imei}`;
  const response = await returnPromise(query);
  return response;
};

/**
 * fetch history report by queries date range, imei
 * @param {string} imei
 * @param {date} from
 * @param {date} to
 * @returns {Promise<Object>}
 */
const queryDeviceHistoryDataByImei = async (queryParams) => {
  console.log(queryParams);
  const query = `SELECT convert_tz(serverTime,'+00:00','${queryParams.tz}') as serverTime, imei, packetType, odometer, address, convert_tz(deviceTime,'+00:00','${queryParams.tz}') as deviceTime, lat, lng, acc, speed, gps, tripStatus, tripId, isHistory FROM sw_object_${queryParams.imei} WHERE packetType = 'ping' AND deviceTime >= '${queryParams.from}' AND deviceTime < '${queryParams.to}'`;
  const query2 = `SELECT convert_tz(serverTime,'+00:00','${queryParams.tz}') as serverTime, imei, packetType, odometer, address, convert_tz(deviceTime,'+00:00','${queryParams.tz}') as deviceTime, lat, lng, acc, speed, gps, tripStatus, tripId, isHistory 
FROM sw_object_${queryParams.imei}
WHERE (tripStatus = "ts" OR tripStatus = "te") AND deviceTime >= '${queryParams.from}' AND deviceTime < '${queryParams.to}';`;
  console.log(query);
  const trips = {};
  const stops = {};
  const response1 = await returnPromise(query);
  const response2 = await returnPromise(query2);
  response2.forEach(el => {
    let tripId = el.tripId;
    if (el.tripStatus === 'ts') {
      trips[tripId] = { tripId: tripId, stTime: el.deviceTime, stCoord: [el.lat, el.lng], stOdo: el.odometer }
      stops[tripId - 1] = { ...stops[tripId - 1], enTime: el.deviceTime }
    } else if (el.tripStatus === 'te') {
      trips[tripId] = { ...trips[tripId], enTime: el.deviceTime, enCoord: [el.lat, el.lng], enOdo: el.odometer };
      stops[tripId] = { stopId: tripId, coords: [el.lat, el.lng], stTime: el.deviceTime }
    }
  })
  return { points: response1, trips, stops };
};

/**
 * fetch trip summary report by queries date range, imei
 * @param {string} imei
 * @param {date} from
 * @param {date} to
 * @returns {Promise<Object>}
 */

const queryDeviceTripsByImei = async (queryParams) => {
  const query = `SELECT convert_tz(serverTime,'+00:00','${queryParams.tz}') as serverTime, imei, packetType, odometer, address, convert_tz(deviceTime,'+00:00','${queryParams.tz}') as deviceTime, lat, lng, acc, speed, gps, tripStatus, tripId, isHistory 
FROM sw_object_${queryParams.imei}
WHERE (tripStatus = "ts" OR tripStatus = "te") AND deviceTime >= '${queryParams.from}' AND deviceTime < '${queryParams.to}';`;
  console.log(query);
  const maxSpeedQuery = `SELECT
tripId,
  MAX(speed) as maxSpeed
FROM sw_object_${queryParams.imei}
    WHERE tripId > 0 
AND			deviceTime >='${queryParams.from}'
AND deviceTime <'${queryParams.to}'
GROUP BY tripId;`;

  const response = await returnPromise(query);
  const response1 = await returnPromise(maxSpeedQuery);
  const trips = {};
  const maxSpeedObj = {};
  response1.forEach(el => {
    maxSpeedObj[el.tripId] = el.maxSpeed;
  })
  response.forEach(el => {
    let tripId = el.tripId;
    if (el.tripStatus === 'ts') {
      trips[tripId] = { tripId: tripId, stTime: el.deviceTime, stCoord: [el.lat, el.lng], stOdo: el.odometer }
    } else if (el.tripStatus === 'te') {
      trips[tripId] = { ...trips[tripId], enTime: el.deviceTime, enCoord: [el.lat, el.lng], enOdo: el.odometer, maxSpeed: maxSpeedObj[tripId] };
    }
  })

  return trips;
};

/**
 * fetch stopage summary report by queries date range, imei
 * @param {string} imei
 * @param {date} from
 * @param {date} to
 * @returns {Promise<Object>}
 */

const queryDeviceStopageByImei = async (queryParams) => {
  const query = `SELECT convert_tz(serverTime,'+00:00','${queryParams.tz}') as serverTime, imei, packetType, odometer, address, convert_tz(deviceTime,'+00:00','${queryParams.tz}') as deviceTime, lat, lng, acc, speed, gps, tripStatus, tripId, isHistory 
FROM sw_object_${queryParams.imei}
WHERE (tripStatus = "ts" OR tripStatus = "te") AND deviceTime >= '${queryParams.from}' AND deviceTime < '${queryParams.to}';`;
  console.log(query);

  const response = await returnPromise(query);
  const stops = {}
  response.forEach(el => {
    let tripId = el.tripId;
    if (el.tripStatus === 'ts') {
      stops[tripId - 1] = { ...stops[tripId - 1], enTime: el.deviceTime }
    } else if (el.tripStatus === 'te') {
      stops[tripId] = { stopId: tripId, coords: [el.lat, el.lng], stTime: el.deviceTime }
    }
  })

  return stops;
};

/**
 * fetch alert report by queries date range, imei, userId
 * @param {string} imei
 * @param {date} from
 * @param {date} to
 * @returns {Promise<Object>}
 */

const queryAlertsByImei = async (queryParams) => {
  const query = `SELECT convert_tz(serverTime,'+00:00','${queryParams.tz}') as serverTime, convert_tz(deviceTime,' + 00: 00','${queryParams.tz}') as deviceTime,imei,lat,lng,alert_name,alert_text,alert_value, speed,angle FROM sw_obj_alerts
WHERE userId='' AND imei = '${queryParams.imei}' AND AND deviceTime >= '${queryParams.from}' AND deviceTime < '${queryParams.to}';`;
  console.log(query);

  const response = await returnPromise(query);
  const stops = {}
  response.forEach(el => {
    let tripId = el.tripId;
    if (el.tripStatus === 'ts') {
      stops[tripId - 1] = { ...stops[tripId - 1], enTime: el.deviceTime }
    } else if (el.tripStatus === 'te') {
      stops[tripId] = { stopId: tripId, coords: [el.lat, el.lng], stTime: el.deviceTime }
    }
  })

  return stops;
};

/**
 * fetch travel summary report by queries date range, imei
 * @param {string} imei
 * @param {date} from
 * @param {date} to
 * @returns {Promise<Object>}
 */

const queryDeviceTravelSummaryByImei = async (queryParams) => {
  console.log(queryParams);
  const firstLastRowQuery = `WITH Cte AS(
    SELECT
         convert_tz(deviceTime,'+00:00','${queryParams.tz}') as newDate,
         CAST(convert_tz(deviceTime,'+00:00','${queryParams.tz}') AS DATE) as date,
         lat,lng,odometer,lastDistance,tripId,
         id,
        ROW_NUMBER() OVER(PARTITION BY CAST(newDate AS DATE) ORDER BY deviceTime ASC) as rn1,
        ROW_NUMBER() OVER(PARTITION BY CAST(newDate AS DATE) ORDER BY deviceTime DESC) as rn2
    FROM sw_object_${queryParams.imei}
    WHERE
			deviceTime >='${queryParams.from}'
AND deviceTime <'${queryParams.to}'
)
SELECT * FROM Cte WHERE rn1 = 1 OR rn2 = 1`;
  const maxSpeedQuery = `SELECT
  date(convert_tz(deviceTime,'+00:00','${queryParams.tz}')) as date,
  MAX(speed) as maxSpeed
FROM sw_object_${queryParams.imei}
    WHERE
			deviceTime >='${queryParams.from}'
AND deviceTime <'${queryParams.to}'
GROUP BY date;`

  const response = await returnPromise(firstLastRowQuery);
  const response2 = await returnPromise(maxSpeedQuery);

  const travelSummary = {};
  let dayCount = 0;
  response.forEach(el => {
    const date = moment(el.date).format('YYYY-MM-DD');
    if (!travelSummary[date]) {
      travelSummary[date] = { maxSpeed: response2[dayCount].maxSpeed, enCoors: [el.lat, el.lng], enOdo: el.odometer, enDis: el.lastDistance, enTripId: el.tripId }
      dayCount++;
    } else {
      travelSummary[date] = { ...travelSummary[date], stCoors: [el.lat, el.lng], stOdo: el.odometer, stDis: el.lastDistance, enTripId: el.tripId }
    }

  })
  return travelSummary;
};


module.exports = {
  queryDevicesTrackingData,
  queryNotAddedDevicesData,
  queryDeviceTrackingDataByImei,
  queryDeviceHistoryDataByImei,
  queryDeviceTripsByImei,
  queryDeviceStopageByImei,
  queryAlertsByImei,
  queryDeviceTravelSummaryByImei,
};
