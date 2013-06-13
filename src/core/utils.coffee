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
      buffer = ''
      stream = fs.createReadStream filename,
        encoding: 'utf8'

      stream.on 'data', (data) ->
        buffer += data.toString()

      stream.on 'end', ->
        cb null, buffer
    (buffer, cb) ->
      try
        rv = topl.parse buffer
        cb null, rv
      catch error
        error.filename = filename
        error.message = "Parsing #{ path.basename(filename) }: #{ error.message }"
        cb error, null
  ], callback

module.exports = {fileExists, readTOML}