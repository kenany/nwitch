# External dependencies
express = require 'express'
gzippo = require 'gzippo'
irc = require 'irc'
moment = require 'moment'
path = require 'path'

# Not-so-external dependencies
server = require './core/server'
{serverAddress} = require './common'
{logger} = require './core/logger'
{bot} = require './config'

# Infinite stack trace
Error.stackTraceLimit = Infinity if process.env.NODE_ENV is 'development'

# Maximum age of cached assets
retirement = moment.duration(1, 'year').asMilliseconds()

root = path.dirname path.dirname __dirname
publicPath = path.join root, 'public'
viewsPath = path.join root, 'views'

# Setup express app
exports.app = app = express()
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
  res.send 'Hello World'

# Connect to the IRC server
connectToIRC = () ->
  logger.info 'Connecting to IRC...'
  client = new irc.Client serverAddress, bot.username,
    userName: bot.username
    password: bot.password
    channels: bot.channel

  # Error listener
  client.addListener 'error', (message) ->
    logger.error message

main = () ->
  server.run app

module.exports = main