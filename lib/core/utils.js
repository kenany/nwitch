var path = require('path');
var async = require('async');
var concat = require('concat-stream')
var topl = require('topl');
var fs = require('graceful-fs');

var fileExists = fs.exists || path.exists;

var readTOML = function(filename, callback) {
  async.waterfall([
    function(cb) {
      var stream = fs.createReadStream(filename, {encoding: 'utf8'});

      var write = concat(function(data) {
        cb(null, data);
      });

      stream.pipe(write);
    }, function(data, cb) {
      var rv;
      try {
        rv = topl.parse(data);
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