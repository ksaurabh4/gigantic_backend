const allRoles = {
  user: ['changePassword', 'canImmobilize', 'getTrackingData','sendCommand'],
  admin: ['getUsers', 'manageUsers', 'changePassword', 'canImmobilize', 'getTrackingData','sendCommand'],
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
