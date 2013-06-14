http = require 'http'

{logger} = require './logger'

run = (config, app, callback) ->
  port = config.server.port or 3001
  server = http.createServer app
  server.on 'error', (error) ->
    callback? error, null
  server.on 'listening', ->
    logger.info "Server is up at port #{port}."
    callback? null, server
  server.listen port

module.exports = {run}