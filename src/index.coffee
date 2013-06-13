path = require 'path'
async = require 'async'
express = require 'express'
gzippo = require 'gzippo'
irc = require 'irc'
moment = require 'moment'
stringifyObject = require 'stringify-object'

{logger} = require './core/logger'

# Root path
root = path.dirname __dirname


# Connect to the IRC server
connectToIRC = (config, callback) ->
  bot = config.account
  client = new irc.Client config.irc.address, bot.username,
    userName: bot.username
    realName: bot.username
    port: 6667
    password: bot.password
    showErrors: true
    channels: [bot.channel]
    stripColors: true
  client.addListener 'error', (error) ->
    message = stringifyObject error,
      indent: '  '
      singleQuotes: false
    logger.error message
  logger.info "Connected to IRC server #{ config.irc.address } and joined
    channel #{ bot.channel } as #{ bot.username }."
  callback? null, client

createApp = (config, callback) ->
  publicPath = path.join root, 'public'
  viewsPath = path.join root, 'views'

  # Maximum age of cached assets
  retirement = moment.duration(1, 'year').asMilliseconds()

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

  callback? null, app


# Main function
main = () ->
  async.waterfall [

    # First generate a Config object
    (callback) ->
      {Config} = require './core/config'
      {fileExists} = require './core/utils'
      configPath = path.join root, 'config.toml'
      fileExists configPath, (exists) ->
        if exists
          logger.info "Config file successfully found."
          Config.fromFile configPath, (error, config) ->
            callback? error, config
        else
          callback? new Error "Config file cannot be found.", null

    # Connect to the IRC server
    (config, callback) ->
      connectToIRC config, (error, client) ->
        callback? error, config, client

    # Then create the express app
    (config, client, callback) ->
      createApp config, (error, app) ->
        callback? error?, config, client, app

    # Now for the web server
    (config, client, app, callback) ->
      server = require './core/server'
      server.run config, client, app, callback
  ], (error) ->
    if error
      logger.error error.message, error

module.exports = main