fs = require 'fs'
path = require 'path'
async = require 'async'
topl = require 'topl'

fileExists = fs.exists or path.exists

# Read and parse a TOML file.
#
# filename  - The String path to a TOML file.
# callback - The Function called after parsing.
#
# Returns the parsed-TOML Object.
readTOML = (filename, callback) ->
  async.waterfall [
    (callback) ->
      fs.readFile filename, callback
    (buffer, callback) ->
      try
        rv = topl.parse buffer.toString()
        callback null, rv
      catch error
        error.filename = filename
        error.message = "parsing #{ path.basename(filename) }: #{ error.message }"
        callback error
  ], callback

module.exports = {fileExists, readTOML}