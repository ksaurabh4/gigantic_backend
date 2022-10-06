const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const clientRoute = require('./client.route');
const deviceRoute = require('./device.route');
const objectRoute = require('./object.route');
const modelRoute = require('./model.route');
const docsRoute = require('./docs.route');
const trackingRoute = require('./tracking.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/clients',
    route: clientRoute,
  },
  {
    path: '/devices',
    route: deviceRoute,
  },
  {
    path: '/objects',
    route: objectRoute,
  },
  {
    path: '/models',
    route: modelRoute,
  },
  {
    path: '/tracking',
    route: trackingRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
