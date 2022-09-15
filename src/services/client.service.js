const httpStatus = require('http-status');
const { Client, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { createUser } = require('./user.service');

/**
 * Create a client
 * @param {Object} clientBody
 * @returns {Promise<Client>}
 */
const createClient = async (clientBody) => {
  if (await User.isUsernameTaken(clientBody.compPrimaryUser)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  const client = await Client.create(clientBody);
  const {
    compPrimaryUser: username,
    password,
    compTimeZone,
    compEmail,
    compPhone,
    compContactPerson: userFullName,
    compPhone: userPhone,
    compCreatedBy: userCreatedBy,
    compCreatedAt: userCreatedAt,
    compIsReseller,
  } = clientBody;
  if (client._id) {
    await createUser({
      username,
      password,
      compEmail,
      compPhone,
      userFullName,
      userPhone,
      role: compIsReseller ? 'reseller' : 'admin',
      userPasswordText: password,
      userTimeZone: compTimeZone,
      userCompId: client._id,
      userCreatedBy,
      userCreatedAt,
    });
  }
  return client;
};

/**
 * Query for clients
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClients = async (filter, options) => {
  const clients = await Client.paginate(filter, options);
  return clients;
};

/**
 * Query for clients List
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClientsList = async (filter, options) => {
  const clients = await Client.paginate(filter, options, ['compName', 'compPrimaryUser', 'compHirerchy']);
  return clients;
};

/**
 * Get client by id
 * @param {ObjectId} id
 * @returns {Promise<Client>}
 */
const getClientById = async (id) => {
  return Client.findById(id);
};

/**
 * Update client by id
 * @param {ObjectId} clientId
 * @param {Object} updateBody
 * @returns {Promise<Client>}
 */
const updateClientById = async (clientId, updateBody) => {
  const client = await getClientById(clientId);
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
  }
  Object.assign(client, updateBody);
  await client.save();
  return client;
};

/**
 * Delete client by id
 * @param {ObjectId} clientId
 * @returns {Promise<Client>}
 */
const deleteClientById = async (clientId) => {
  const client = await getClientById(clientId);
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
  }
  await client.remove();
  return client;
};

module.exports = {
  createClient,
  queryClients,
  queryClientsList,
  getClientById,
  updateClientById,
  deleteClientById,
};
