var Config, async, fileExists, readTOML, _ref;

async = require('async');

_ref = require('./utils'), readTOML = _ref.readTOML, fileExists = _ref.fileExists;

Config = (function() {
  Config.defaults = {
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
    var defaultValue, option, value, _ref1;
    for (option in options) {
      value = options[option];
      this[option] = value;
    }
    _ref1 = this.constructor.defaults;
    for (option in _ref1) {
      defaultValue = _ref1[option];
      if (this[option] == null) {
        this[option] = defaultValue;
      }
    }
  }

  return Config;

})();

Config.fromFile = function(path, callback) {
  return async.waterfall([
    function(cb) {
      return fileExists(path, function(exists) {
        if (exists) {
          return readTOML(path, cb);
        } else {
          return typeof cb === "function" ? cb(new Error("Config file at '" + path + "' does not exist.")) : void 0;
        }
      });
    }, function(options, cb) {
      var config;
      config = new Config(options);
      config.__filename = path;
      return typeof cb === "function" ? cb(null, config) : void 0;
    }
  ], callback);
};

module.exports = {
  Config: Config
};