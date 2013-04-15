http = require 'http'

{logger} = require './logger'

run = (app, callback) ->
  port = process.env.PORT || 3001
  server = http.createServer app
  server.on 'error', (error) ->
    callback? error
    callback = null
  server.on 'listening', ->
    callback?()
    callback = null
  server.listen port
  logger.info 'Server is up at ' + port

module.exports = {run}