express = require 'express'
gzippo = require 'gzippo'
irc = require 'irc'
moment = require 'moment'
path = require 'path'


server = require './core/server'
{logger} = require './core/logger'
{Config} = require './core/config'

# Maximum age of cached assets
retirement = moment.duration(1, 'year').asMilliseconds()

# File paths
root = path.dirname __dirname
publicPath = path.join root, 'public'
viewsPath = path.join root, 'views'

# Setup express app. CoffeeScript is a little buggy when it comes to multiline
# chaining, so parentheses are necessary.
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

# Main function
main = () ->
  server.run app

module.exports = main