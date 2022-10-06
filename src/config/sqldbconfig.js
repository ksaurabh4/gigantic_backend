const mysql = require('mysql');
const config = require('./config');

const pool = mysql.createPool({
  connectionLimit: 10,
  queueLimit: 100,
  host: config.sqldb.host,
  port: config.sqldb.port,
  user: config.sqldb.username,
  password: config.sqldb.password,
  database: config.sqldb.database,
  connectTimeout: 10000,
  waitForConnections: true,
  acquireTimeout: 10000,
  debug: false,
});

pool.on('connection', (connection) => {
  console.log('MySQL DB Connection established');
});

pool.on('acquire', (connection) => {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('enqueue', () => {
  console.log('Waiting for available connection slot...');
});

pool.on('release', (connection) => {
  console.log('Connection %d released', connection.threadId);
});

module.exports = pool;