var async = require('async');
var _ = require('lodash');

var readTOML = require('./utils').readTOML;
var fileExists = require('./utils').fileExists;

function Config(options) {
  var defaults = {
    account: {
      username: 'admin',
      password: 'password',
      channel: '#riotgames'
    },
    irc: {
      address: '199.9.253.199',
      port: 6667
    },
    server: {
      port: 3001,
      cacheAge: '1 year'
    }
  };

  var that = this;
  _.forOwn(defaults, function(value, key) {
    that[key] = _.defaults(options[key], value);
  });
}

Config.fromFile = function(path, callback) {
  async.waterfall([
    function(cb) {
      fileExists(path, function(exists) {
        if (exists) {
          readTOML(path, cb);
        } else {
          cb(new Error("Config file at '" + path + "' does not exist."));
        }
      });
    }, function(options, cb) {
      var config = new Config(options);
      config.__filename = path;
      cb(null, config);
    }
  ], callback);
};

module.exports.Config = Config;