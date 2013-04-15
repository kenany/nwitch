fs = require 'fs'
path = require 'path'
async = require 'async'
topl = require 'topl'

fileExists = fs.exists or path.exists

# Read and try to parse a TOML file.
#
# {String} filename The path to a TOML file.
# {Function} callback The function called after parsing.
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

# Exports
module.exports = {fileExists, readTOML}