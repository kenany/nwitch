winston = require 'winston'

transports = exports.transports = [
  new (winston.transports.Console)
    colorize: true
]

exports.logger = new winston.Logger
  exitOnError: true
  transports: transports