async = require 'async'

{readTOML, fileExists} = require './utils'

class Config
  @defaults =
    account:
      username: 'admin'
      password: 'password'
      channel: '#riotgames'
    irc:
      address: '199.9.253.199'
    server:
      port: 6667

  constructor: (options) ->
    for option, value of options
      @[option] = value
    for option, defaultValue of @constructor.defaults
      @[option] ?= defaultValue

# Create a Config instance from a TOML file.
#
# path  - The String path to a TOML file.
# callback - The Function called after creating the Config instance.
#
# Returns a Config instance.
Config.fromFile = (path, callback) ->
  async.waterfall [
    (cb) ->
      fileExists path, (exists) ->
        if exists
          readTOML path, cb
        else
          cb? new Error "Config file at '#{ path }' does not exist."
    (options, cb) ->
      config = new Config options
      config.__filename = path
      cb? null, config
  ], callback

module.exports = {Config}