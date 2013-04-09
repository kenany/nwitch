# External dependencies
http = require 'http'
path = require 'path'
express = require 'express'
gzippo = require 'gzippo'
derby = require 'derby'

# Kinda external dependencies
app = require '../app'
serverError = require './serverError'
middleware = require './middleware'


# Infinite stack trace
Error.stackTraceLimit = Infinity if process.env.NODE_ENV is 'development'

# Server configuration
expressApp = express()
module.exports = server = http.createServer expressApp

# Max age of cached assets
ONE_YEAR = 1000 * 60 * 60 * 24 * 365

# The server-side store syncs data over Socket.IO
store = derby.createStore listen: server

root = path.dirname path.dirname __dirname
publicPath = path.join root, 'public'

expressApp
  # TODO: favicon
  #.use(express.favicon('#{publicPath}/favicon.ico'))

  # Gzip static files and serve from memory
  .use(gzippo.staticGzip publicPath, maxAge: ONE_YEAR)

  # Gzip dynamically rendered content
  .use(express.compress())

  # Add form data parsing support
  .use(express.bodyParser())
  .use(express.methodOverride())

  # The store creates models for incoming requests
  .use(store.modelMiddleware())

  .use(middleware.view)

  # Creates an express middleware from the app's routes
  .use(app.router())
  .use(require('./static').middleware)
  .use(expressApp.router)
  .use(serverError root)


# Server-only routes
expressApp.all '*', (req) ->
  throw "404: #{req.url}"