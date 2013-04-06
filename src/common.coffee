winston = require 'winston'

exports.serverAddress = '199.9.253.199'

transports = exports.transports = [
  new (winston.transports.Console)()
]

exports.logger = new winston.Logger
  exitOnError: true
  transports: transports