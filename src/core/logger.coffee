# winston for logging
winston = require 'winston'

transports = exports.transports = [
  new (winston.transports.Console)()
]

exports.logger = new winston.Logger
  exitOnError: true
  transports: transports