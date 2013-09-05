var path = require('path');
var concat = require('concat-stream');
var toml = require('toml');
var fs = require('graceful-fs');

var fileExists = fs.exists || path.exists;
var fileExistsSync = fs.existsSync || path.existsSync;

var readFile = function(filename, callback) {
  var stream = fs.createReadStream(filename, {encoding: 'utf8'});
  stream.on('error', callback);

  var write = concat(function(data) {
    callback(null, data);
  });

  stream.pipe(write);
};

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

var readTOMLSync = function(filename) {
  var buffer = fs.readFileSync(filename);
  return toml.parse(buffer.toString());
};

module.exports.fileExists = fileExists;
module.exports.fileExistsSync = fileExistsSync;
module.exports.readTOML = readTOML;
module.exports.readTOMLSync = readTOMLSync;