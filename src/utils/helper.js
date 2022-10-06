const pool = require('../config/sqldbconfig');

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

exports.fetchDevicesTrackingDataQuery = (filter, options) => {
  return 'SELECT * FROM sw_obj_data';
}