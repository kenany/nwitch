var http = require('http');

var logger = require('./logger').logger;

/**
 * Creates a web server on `port` with a `app` being used as the
 * `requestListener`.
 *
 * @param {Number} port The port to open the server on.
 * @param {Function} app The function passed as `requestListener` to
 *  `http.createServer`.
 */
var run = function(port, app) {
  var server = http.createServer(app);
  server.on('error', logger.error);
  server.on('listening', function() {
    logger.info('Server is up at port ' + port + '.');
  });
  server.listen(port);
};

module.exports.run = run;