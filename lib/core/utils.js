var path = require('path');
var async = require('async');
var topl = require('topl');
var fs = require('graceful-fs');

var fileExists = fs.exists || path.exists;

var readTOML = function(filename, callback) {
  async.waterfall([
    function(cb) {
      var buffer = '';
      var stream = fs.createReadStream(filename, {encoding: 'utf8'});
      stream.on('data', function(data) {
        buffer += data.toString();
      });
      stream.on('end', function() {
        cb(null, buffer);
      });
    }, function(buffer, cb) {
      var rv;
      try {
        rv = topl.parse(buffer);
        cb(null, rv);
      } catch (error) {
        error.filename = filename;
        error.message = 'Parsing ' + path.basename(filename) + ': ' + error.message;
        cb(error, null);
      }
    }
  ], callback);
};

module.exports = {
  fileExists: fileExists,
  readTOML: readTOML
};