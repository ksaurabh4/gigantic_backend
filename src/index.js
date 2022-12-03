/**
 * Module dependencies.
 */
// A tool to find an open port or domain socket on the machine
const portfinder = require('portfinder');
const cluster = require('cluster');
// comment below line to start cluster with maximum workers
const workers = 1;
// uncomment below line to start cluster with maximum workers
// const workers = process.env.WORKERS || require('os').cpus().length;
let port = 5500;
const portSpan = 999;

if (cluster.isMaster) {
  portfinder.getPort({
    port, // minimum port number
    stopPort: port + portSpan, // maximum port number
  }, (err, openPort) => {
    if (err) throw err;
    port = openPort;
    process.env.PORT = openPort;
    console.log(`Server will start on port ${port}`);
    console.log('Master cluster is running on %s with %s workers', process.pid, workers);
    for (let i = 0; i < workers; ++i) {
      const worker = cluster.fork().process;
      console.log('worker %s on %s started', i + 1, worker.pid);
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log('worker %s died. restarting...', worker.process.pid);
      cluster.fork();
    });
  });
}

/**
   * Normalize a port into a number, string, or false.
   */
function normalizePort(val) {
  const $port = parseInt(val, 10);
  if (isNaN($port)) {
    // named pipe
    return val;
  }
  if ($port >= 0) {
    // port number
    return $port;
  }
  return false;
}

if (cluster.isWorker) {
  const app = require('./app');
  const debug = require('debug')('gigantic-backend:server');
  const http = require('http');
  const ON_DEATH = require('death');
  require('./config/mongodbconfig');
  const mysqlpool = require('./config/sqldbconfig');

  /**
   * Get port from environment and store in Express.
   */
  port = normalizePort(process.env.PORT);
  app.set('port', port);
  /**
   * Create HTTP server.
   */
  const server = http.createServer(app);
  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  /**
   * Event listener for HTTP server "error" event.
   */
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  /**
   * Event listener for HTTP server "listening" event.
   */
  function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
  }
  /**
   * Event listener for HTTP server "close" event.
   * It sets the callback on SIGINT, SIGQUIT & SIGTERM.
   */
  ON_DEATH((signal, err) => {
    mysqlpool.end((err) => {
      console.log('\nAll connections in the pool have ended');
      console.log('Server is going down now...');
      server.close();
      process.exit();
    });
  });
  console.log(`gigantic backend server Started on http://localhost:${port}\n`);
}