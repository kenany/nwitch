var winston = require('winston');

var transports = [
  new winston.transports.Console({
    colorize: true
  })
];

var logger = new winston.Logger({
  exitOnError: true,
  transports: transports
});

module.exports.logger = logger
module.exports.transports = transports;