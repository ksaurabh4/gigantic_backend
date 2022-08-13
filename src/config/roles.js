const allRoles = {
  user: ['changePassword', 'canImmobilize'],
  admin: ['getUsers', 'manageUsers', 'changePassword', 'canImmobilize'],
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
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
