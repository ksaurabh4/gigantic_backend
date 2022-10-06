const allRoles = {
  user: ['changePassword', 'canImmobilize', 'getTrackingData',],
  admin: ['getUsers', 'manageUsers', 'changePassword', 'canImmobilize', 'getTrackingData',],
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
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
