const pool = require('../config/sqldbconfig');

exports.timeZoneToMinutes = (tz) => {

  let t = tz.replace("+", "")
  t = tz.replace("-", "")
  t = t.split(':')
  const subtractMinute = parseFloat(t[0]) * 60 + parseFloat(t[1]);

  return tz.includes("-") ? -subtractMinute : subtractMinute;
};

exports.returnPromise = (query, values) => new Promise((resolve, reject) => {
  if (values) {
    pool.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  } else {
    pool.query(query, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  }
});

exports.fetchDevicesTrackingDataQuery = (filter, options,imeis) => {
  const imeisString = imeis.join();
  return `SELECT * FROM sw_obj_data WHERE imei IN (${imeisString})`;
}

exports.fetchNotAddedDevicesDataQuery = (filter, options) => {
  return `SELECT * FROM sw_obj_not_added_data Order By serverTime Desc`;
}