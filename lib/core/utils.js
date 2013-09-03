var path = require('path');
var concat = require('concat-stream');
var topl = require('topl');
var fs = require('graceful-fs');

var fileExists = fs.exists || path.exists;

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
    if (error) callback(error);

    try {
      var toml = topl.parse(data);
      callback(null, toml);
    } catch (error) {
      error.filename = filename;
      error.message = 'Parsing ' + path.basename(filename) + ': ' + error.message;
      callback(error);
    }
  });
};

module.exports.fileExists = fileExists;
module.exports.readTOML = readTOML;