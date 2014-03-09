var winston = require('winston');

var transports = [
  new winston.transports.Console({
    level: 'debug',
    colorize: true
  })
];

module.exports = new winston.Logger({
  exitOnError: true,
  transports: transports
});