const allRoles = {
  user: ['changePassword', 'canImmobilize', 'getTrackingData', 'sendCommand',
    'getAlerts',],
  admin: ['getUsers', 'manageUsers', 'changePassword', 'canImmobilize',
    'getAlerts', 'getTrackingData', 'sendCommand'],
  reseller: [
    'getUsers',
    'manageUsers',
    'changePassword',
    'getClients',
    'manageClients',
    'canImmobilize',
    'manageDevices',
    'getDevices',
    'getModels',
    'getAlerts',
    'manageObjects',
    'getObjects',
    'getTrackingData',
    'sendCommand'
  ],
  superadmin: [
    'getUsers',
    'manageUsers',
    'changePassword',
    'getClients',
    'manageClients',
    'canImmobilize',
    'manageDevices',
    'getDevices',
    'manageModels',
    'getModels',
    'manageAlerts',
    'getAlerts',
    'manageObjects',
    'getObjects',
    'getTrackingData',
    'sendCommand',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
