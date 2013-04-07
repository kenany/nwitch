# External dependencies
express = require 'express'
path = require 'path'
derby = require 'derby'

router = new express.Router()

# Static pages
staticPages = derby.createStatic path.dirname(path.dirname(__dirname))

beforeEach = (req, res, next) ->
  req.getModel().set '_view', {nodeEnv: 'production'}
  next()

module.exports = router