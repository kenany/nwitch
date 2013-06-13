path = require 'path'
async = require 'async'
topl = require 'topl'

fs = undefined
try
  fs = require 'graceful-fs'
catch error
  fs = require 'fs'

fileExists = fs.exists or path.exists

# Read and parse a TOML file.
#
# filename  - The String path to a TOML file.
# callback - The Function called after parsing.
#
# Returns the parsed-TOML Object.
readTOML = (filename, callback) ->
  async.waterfall [
    (cb) ->
      fs.readFile filename, cb
    (buffer, cb) ->
      try
        rv = topl.parse buffer.toString()
        cb null, rv
      catch error
        error.filename = filename
        error.message = "parsing #{ path.basename(filename) }: #{ error.message }"
        cb error, null
  ], callback

module.exports = {fileExists, readTOML}