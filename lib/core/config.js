var async = require('async');
var defaults = require('lodash.defaults');
var forOwn = require('lodash.forOwn');

var fileExists = require('./utils').fileExists;
var fileExistsSync = require('./utils').fileExistsSync;
var readTOML = require('./utils').readTOML;
var readTOMLSync = require('./utils').readTOMLSync;

function Config(options) {
  var defaultConfig = {
    debug: false,
    account: {
      username: 'nwitch',
      password: 'oauth:',
      channel: 'riotgames'
    },
    twitchtv: {
      id: '',
      secret: ''
    },
    irc: {
      address: '199.9.250.239',
      port: 6667
    },
    server: {
      port: 3001,
      cacheAge: '1 year'
    }
  };

  var that = this;
  forOwn(defaultConfig, function(value, key) {
    that[key] = defaults(options[key], value);
  });
}

Config.fromFile = function(path, callback) {
  async.waterfall([
    function(cb) {
      fileExists(path, function(exists) {
        if (exists) {
          readTOML(path, cb);
        } else {
          cb(new Error('Config file at "' + path + '" does not exist.'));
        }
      });
    }, function(options, cb) {
      var config = new Config(options);
      config.__filename = path;
      cb(null, config);
    }
  ], callback);
};

Config.fromFileSync = function(path) {
  if (!fileExistsSync(path)) {
    throw new Error('Config file at "' + path + '" does not exist.');
  }
  var config = new Config(readTOMLSync(path));
  config.__filename = path;
  return config;
};

module.exports = Config;