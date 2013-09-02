var http = require('http');

var logger = require('./logger').logger;

var run = function(config, app) {
  var port = config.server.port;

  var server = http.createServer(app);
  server.on('error', logger.error);
  server.on('listening', function() {
    logger.info('Server is up at port ' + port + '.');
  });
  server.listen(port);
};

module.exports.run = run;