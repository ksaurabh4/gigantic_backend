const allRoles = {
  user: ['changePassword', 'canImmobilize'],
  admin: ['getUsers', 'manageUsers', 'changePassword', 'canImmobilize'],
  reseller: ['getUsers', 'manageUsers', 'changePassword', 'getClients', 'manageClients', 'canImmobilize'],
  superadmin: ['getUsers', 'manageUsers', 'changePassword', 'getClients', 'manageClients', 'canImmobilize'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
