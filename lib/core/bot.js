var path = require('path');
var fs = require('graceful-fs');
var irc = require('irc');
var Config = require('./config');
var PluginManager = require('./plugin').PluginManager;
var logger = require('./logger');

/**
 * Initialize an IRC bot.
 *
 * @param {String} configFile
 */
function Bot(configFile) {
  this.config = Config.fromFileSync(configFile);
  this.plugins = [];
  this.hooks = [];
}

/**
 * Returns bot's config.
 *
 * @returns {Object}
 */
Bot.prototype.getConfig = function() {
  return this.config;
};

/**
 * Loads default plugins.
 */
Bot.prototype.loadDefaultPlugins = function() {
  var bot = this;
  var Manager = new PluginManager(bot.config, bot, bot.client);
  var pluginsDirectory = path.resolve(__dirname, '../plugins');

  fs.readdir(pluginsDirectory, function(error, files) {
    if (error) throw error;

    files.forEach(function(file) {
      Manager.load(path.resolve(pluginsDirectory, file));
    });
  });
};

/**
 * Loads installed plugins.
 */
Bot.prototype.loadPlugins = function() {
  var bot = this;
  var Manager = new PluginManager(bot.config, bot, bot.client);

  bot.config.bot.plugins.forEach(function(plugin) {
    Manager.load(path.resolve(__dirname + '../../../node_modules', plugin));
  });
};

/**
 * Spawns IRC client, joins channel, loads default plugins, and sets up message
 * hooks.
 */
Bot.prototype.spawn = function() {
  var config = this.config;

  var bot = config.account;
  this.client = new irc.Client(config.irc.address, bot.username, {
    port: config.irc.port,
    userName: bot.username,
    realName: bot.username,
    password: bot.password,
    showErrors: true,
    channels: ['#' + bot.channel],
    stripColors: true
  });

  logger.info('Connected to ' + config.irc.address + ':' + config.irc.port);
  logger.info('Joined channel #' + bot.channel + ' as ' + bot.username);

  this.loadDefaultPlugins();
  this.loadPlugins();

  this.client.setMaxListeners(30);

  this.client.addListener('message', function(from, to, message) {
    if (message.charAt(0) === '!') {
      var command = message.split(' ')[0].replace('!', '');
      this.emit('command.' + command, from, to, message, message.split(' '));
    }
  });

  this.client.addListener('raw', function(raw) {
    if (config.debug) {
      logger.debug(Math.round(new Date().getTime() / 1000) + ' ' + raw.rawCommand + ' ' + raw.args.join(' '));
    }
  });

  this.client.addListener('join', function(channel, nick, message) {
    if (config.debug) {
      logger.debug('Joined channel: ' + channel);
    }
  });

  this.client.addListener('error', function(message) {
    if (config.debug) {
      logger.error(message);
    }
  });
};

module.exports = Bot;