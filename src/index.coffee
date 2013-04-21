path = require 'path'
async = require 'async'
express = require 'express'
gzippo = require 'gzippo'
irc = require 'irc'
moment = require 'moment'

{logger} = require './core/logger'
{Config} = require './core/config'
{readTOML, fileExists} = require './core/utils'

# Maximum age of cached assets
retirement = moment.duration(1, 'year').asMilliseconds()

publicPath = path.join root, 'public'
viewsPath = path.join root, 'views'

# Connect to the IRC server
connectToIRC = () ->
  logger.info 'Connecting to IRC...'
  client = new irc.Client serverAddress, bot.username,
    userName: bot.username
    password: bot.password
    channels: bot.channel
  client.addListener 'error', (message) ->
    logger.error message

createApp = (callback) ->
  root = path.dirname __dirname

  async.waterfall [
    (callback) ->
      configPath = path.join root, 'config.toml'
      fileExists configPath, (exists) ->
        if exists
          Config.fromFile configPath, callback
        else
          callback null, new Config
    (config, callback) ->
      # Setup express app. CoffeeScript is a little buggy when it comes to
      # multiline chaining, so parentheses are necessary.
      app = express()
      app
        .set('view engine', 'jade')
        .set('views', viewsPath)
        .use(require('express-uncapitalize')())

        # Gzip static files and serve from memory
        .use(gzippo.staticGzip publicPath, maxAge: retirement)

        # Gzip dynamically rendered content
        .use(express.compress())

        # Add form data parsing support
        .use(express.bodyParser())
        .use(express.methodOverride())

        .use(app.router)

      app.get '/', (req, res) ->
        res.render 'index.jade'

      callback null, app
  ], callback


# Main function
main = () ->
  async.waterfall [
    (callback) ->
      createApp callback
    (app, callback) ->
      server = require './core/server'
      server.run app, callback
  ], (error) ->
    if error
      logger.error error.message, error

module.exports = main