var fs = require('graceful-fs');
var isFunction = require('lodash.isfunction');
var isUndefined = require('lodash.isundefined');
var logger = require('./logger').logger;

var EVENTS = ['registered', 'motd', 'names', 'topic', 'join', 'part', 'quit',
  'kick', 'kill', 'message', 'notice', 'ping', 'pm', 'ctcp', 'ctcpNotice',
  'ctcpPrivmsg', 'ctcpVersion', 'nick', 'plusMode', 'minusMode', 'whois',
  'channelistStart', 'channelistItem', 'channelList', 'raw', 'error'];

/**
 * Base class for plugins to inherit.
 *
 * @param {Bot} bot
 * @param {Object} metadata
 */
function Plugin(bot, metadata) {
  this.metadata = metadata;
}

/**
 * Returns plugin's name.
 *
 * @returns {String} Plugin's name.
 */
Plugin.prototype.getName = function() {
  return this.metadata.name;
};

/**
 * Initialize a plugin manager.
 *
 * @param {Object} config
 * @param {Bot} bot
 * @param {Object} metadata
 */
function PluginManager(config, bot, client) {
  this.config = config;
  this.bot = bot;
  this.client = client;
}

/**
 * Adds a new plugin event.
 *
 * @param {Plugin} plugin
 * @param {String} event
 * @param {Function} func
 */
PluginManager.prototype.addPluginEvent = function(plugin, evnt, func) {
  var bot = this.bot;

  if (isUndefined(bot.hooks[plugin])) {
    bot.hooks[plugin] = [];
  }

  var callback = (function() {
    return function() {
      func.apply(that, arguments);
    };
  })();

  bot.hooks[plugin].push({event: evnt, callback: callback});

  var that = bot.plugins[plugin];
  return bot.client.addListener(evnt, callback);
};

/**
 * Adds a new plugin command.
 *
 * @param {Plugin} plugin
 * @param {String} command
 * @param {Function} func
 */
PluginManager.prototype.addPluginCommand = function(plugin, command, func) {
  var bot = this.bot;

  bot.client.addListener('command.' + command, function(from, to, message) {
    var args = message.split(' ');
    bot.plugins[plugin][func](from, to, message, args);
  });
};

/**
 * Unloads a plugin
 *
 * @param {Plugin} plugin
 */
PluginManager.prototype.unload = function(plugin) {
  var bot = this.bot;
  delete bot.plugins[plugin.getName()];
};

/**
 * Loads a plugin from a file.
 *
 * @param {String} file
 */
PluginManager.prototype.load = function(file) {
  var that = this;
  var bot = this.bot;
  var client = this.client;
  var config = bot.getConfig();

  var PluginToLoad = require(file)(Plugin);
  var plugin = new PluginToLoad(bot, client);
  var pluginName = plugin.getName();

  if (config.debug) {
    logger.debug('Loading plugin: ' + pluginName);
  }

  this.unload(plugin);

  bot.plugins[pluginName] = plugin;

  EVENTS.forEach(function(event) {
    var onEvent = 'on' + event.charAt(0).toUpperCase() + event.substr(1);
    var callback = bot.plugins[pluginName][onEvent];

    if (isFunction(callback)) {
      that.addPluginEvent(bot, pluginName, event, callback);

      if (config.debug) {
        logger.debug('Registered ' + onEvent + 'hook for ' + pluginName);
      }
    }
  }, bot);

  var commands = bot.plugins[pluginName].commands;
  for (var key in commands) {
    var command = key;
    var func = commands[key];
    var callback = bot.plugins[pluginName][func];
    this.addPluginCommand(pluginName, command, func);
  }
};

module.exports.Plugin = Plugin;
module.exports.PluginManager = PluginManager;