var path = require('path');
var async = require('async');
var express = require('express');
var gzippo = require('gzippo');
var irc = require('irc');
var moment = require('moment');
var stringifyObject = require('stringify-object');

var logger = require('./core/logger').logger;

var root = path.dirname(__dirname);

var connectToIRC = function(config, callback) {
  var bot = config.account;
  var client = new irc.Client(config.irc.address, bot.username, {
    userName: bot.username,
    realName: bot.username,
    port: 6667,
    password: bot.password,
    showErrors: true,
    channels: [bot.channel],
    stripColors: true
  });
  client.addListener('error', function(error) {
    var message = stringifyObject(error, {
      indent: '  ',
      singleQuotes: false
    });
    logger.error(message);
  });
  logger.info('Connected to IRC server ' + config.irc.address + ' and joined channel ' + bot.channel + ' as ' + bot.username + '.');
  callback(null, client);
};

var createApp = function(config, callback) {
  var publicPath = path.join(root, 'public');
  var viewsPath = path.join(root, 'views');

  var retirement = moment.duration(1, 'year').asMilliseconds();

  var app = express();

  app
    .set('view engine', 'jade')
    .set('views', viewsPath)
    .use(require('express-uncapitalize')())
    .use(gzippo.staticGzip(publicPath, {
      maxAge: retirement
    }))
    .use(express.compress())
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(app.router);

  app.get('/', function(req, res) {
    res.render('index.jade', {
      embed: 'http://www.twitch.tv/chat/embed?channel=' + config.account.channel + '&popout_chat=true'
    });
  });
  callback(null, app);
};

var main = function() {
  async.waterfall([
    function(callback) {
      var Config = require('./core/config').Config;
      var fileExists = require('./core/utils').fileExists;
      var configPath = path.join(root, 'config.toml');
      fileExists(configPath, function(exists) {
        if (exists) {
          logger.info('Config file found.');
          Config.fromFile(configPath, function(error, config) {
            callback(error, config);
          });
        } else {
          callback(new Error('Config file cannot be found.', null));
        }
      });
    }, function(config, callback) {
      connectToIRC(config, function(error, client) {
        callback(error, config, client);
      });
    }, function(config, client, callback) {
      createApp(config, function(error, app) {
        callback(error, config, app);
      });
    }, function(config, app, callback) {
      var server = require('./core/server');
      server.run(config, app, callback);
    }
  ], function(error) {
    if (error) logger.error(error.message, error);
  });
};

module.exports = main;