var http = require('http');

var logger = require('./logger').logger;

var run = function(config, app, callback) {
  var port = config.server.port || 3001;

  var server = http.createServer(app);
  server.on('error', callback);
  server.on('listening', function() {
    logger.info('Server is up at port ' + port + '.');
    callback(null, server);
  });
  server.listen(port);
};

module.exports.run = run;