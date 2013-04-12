# External dependency
http = require 'http'

{logger} = require './logger'

run = (handler) ->
  port = process.env.PORT || 3001
  server = http.createServer handler
  server.on 'error', (message) ->
    logger.error message
  server.listen port
  logger.info 'Server is up at ' + port

module.exports = {run}