var path = require('path');
var concat = require('concat-stream');
var toml = require('toml');
var fs = require('graceful-fs');

var fileExists = fs.exists || path.exists;
var fileExistsSync = fs.existsSync || path.existsSync;

/**
 * Returns the contents of a file asynchronously.
 *
 * @param {String} filename The name of the file to read.
 * @param {Function} callback The function used to handle the file's contents.
 */
var readFile = function(filename, callback) {
  var stream = fs.createReadStream(filename, {encoding: 'utf8'});
  stream.on('error', callback);

  var write = concat(function(data) {
    callback(null, data);
  });

  stream.pipe(write);
};

/**
 * Parses a TOML file asynchronously.
 *
 * @param {String} filename The name of the file to read.
 * @param {Function} callback The function used to handle the parsed TOML.
 */
var readTOML = function(filename, callback) {
  readFile(filename, function(error, data) {
    if (error) return callback(error);

    try {
      var tomlObject = toml.parse(data);
      callback(null, tomlObject);
    } catch (error) {
      error.filename = filename;
      error.message = 'Parsing ' + path.basename(filename) + ': ' + error.message;
      callback(error);
    }
  });
};

/**
 * Parses a TOML file synchronously.
 *
 * @param {String} filename The name of the file to read.
 * @returns {Object} The parsed TOML.
 */
var readTOMLSync = function(filename) {
  var buffer = fs.readFileSync(filename);
  return toml.parse(buffer.toString());
};

module.exports.fileExists = fileExists;
module.exports.fileExistsSync = fileExistsSync;
module.exports.readTOML = readTOML;
module.exports.readTOMLSync = readTOMLSync;