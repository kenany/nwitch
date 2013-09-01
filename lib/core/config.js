var async = require('async');
var _ = require('lodash');

var readTOML = require('./utils').readTOML;
var fileExists = require('./utils').fileExists;

var defaults = {
  account: {
    username: 'admin',
    password: 'password',
    channel: '#riotgames'
  },
  irc: {
    address: '199.9.253.199'
  },
  server: {
    port: 6667
  }
};

function Config(options) {
  this['account'] = _.defaults(defaults['account'], options['account']);
  this['irc'] = _.defaults(defaults['irc'], options['irc']);
  this['server'] = _.defaults(defaults['server'], options['server']);
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