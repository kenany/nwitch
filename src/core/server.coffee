http = require 'http'

{logger} = require './logger'

run = (config, client, app, callback) ->
  port = config.server.port or 3001
  server = http.createServer app
  server.on 'error', (error) ->
    callback? error
    callback = null
  server.on 'listening', ->
    logger.info "Server is up at #{port}"
    callback? null, config, client, app, server
    callback = null
  server.listen port

module.exports = {run}