
const mongoose = require('mongoose');
// const app = require('./app');
const config = require('./config');
const logger = require('./logger');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  // server = app.listen(config.port, () => {
  //   logger.info(`Listening to port ${config.port}`);
  // });
});