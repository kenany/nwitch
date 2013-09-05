var irc = require('irc');
var Config = require('./config');
var logger = require('./logger').logger;

function Bot(configFile) {
  this.configFile = configFile;
  this.config = Config.fromFileSync(configFile);
}

Bot.prototype.spawn = function() {
  var config = this.config;

  var bot = config.account;
  this.client = new irc.Client(config.irc.address, bot.username, {
    port: config.irc.port,
    userName: bot.username,
    realName: bot.username,
    password: bot.password,
    showErrors: true,
    channels: [bot.channel],
    stripColors: true
  });

  logger.info('Connected to ' + config.irc.address + ':' + config.irc.port);
  logger.info('Joined channel #' + bot.channel + ' as ' + bot.username);

  this.client.addListener('message', function(from, to, message) {
    if (message.charAt(0) === '!') {
      var command = message.split(' ')[0].replace('!', '');
      this.emit('command.' + command, from, to, message, message.split(' '));
    }
  });

  this.client.addListener('raw', function(raw) {
    if (config.debug) {
      logger.info(Math.round(new Date().getTime() / 1000) + ' ' + raw.rawCommand + ' ' + raw.args.join(' '));
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