var inherits = require('util').inherits;

module.exports = function(NwitchPlugin) {
  function Plugin(bot, client) {
    NwitchPlugin.apply(this, arguments);

    this.metadata = {
      name: 'ping',
      title: 'Ping',
      description: 'Ping module for nwitch',
      version: '0.0.1',
      author: 'Kenan Yildirim'
    };

    this.bot = bot;
    this.client = client;
    this.commands = {
      'ping': 'onCommandPing'
    };
  }

  inherits(Plugin, NwitchPlugin);

  Plugin.prototype.onCommandPing = function(from, to, message, args) {
    this.client.say((to.charAt(0) === '#' ? to : from), from + ': pong!');
  };

  return Plugin;
};