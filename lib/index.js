var path = require('path');
var express = require('express');
var gzippo = require('gzippo');
var irc = require('irc');
var ms = require('ms');
var stringifyObject = require('stringify-object');

var logger = require('./core/logger').logger;

var root = path.dirname(__dirname);

var connectToIRC = function(config) {
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
  logger.info('Connected to IRC server ' + config.irc.address);
  logger.info('Joined channel #' + bot.channel + ' as ' + bot.username + '.');
};

var createApp = function(config) {
  var publicPath = path.join(root, 'public');
  var viewsPath = path.join(root, 'views');

  var gzipCacheAge = ms(config.server.cacheAge);

  var app = express();

  app
    .set('view engine', 'jade')
    .set('views', viewsPath)
    .use(require('express-uncapitalize')())
    .use(gzippo.staticGzip(publicPath, {
      maxAge: gzipCacheAge
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

  return app;
};

var main = function() {
  var Config = require('./core/config').Config;
  var fileExists = require('./core/utils').fileExists;
  var configPath = path.join(root, 'config.toml');
  fileExists(configPath, function(exists) {
    if (exists) {
      logger.info('Config file found.');
      Config.fromFile(configPath, function(error, config) {
        connectToIRC(config);
        var app = createApp(config);
        var server = require('./core/server');
        server.run(config, app);
      });
    } else {
      logger.error('Config file cannot be found.');
    }
  });
};

module.exports = main;